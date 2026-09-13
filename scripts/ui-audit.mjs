#!/usr/bin/env node
/**
 * UI audit script for the continuous UI-improvement loop (see MISSION-UI.md §2 phase 2).
 *
 * Boots the Vite dev server, then for each viewport x language combination:
 *   - captures a full-page screenshot
 *   - captures a screenshot of each priority-zone section (about / capabilities / contact)
 *   - captures progressive scroll screenshots (400px steps) so GSAP/Framer reveals fire
 *     the way a real visitor would trigger them
 *   - runs an axe-core accessibility scan
 *   - records CLS + first-paint timing
 *
 * It also does one dedicated pass for hover states, one for keyboard focus-visible
 * states (Tab only), and one with `prefers-reduced-motion: reduce`.
 *
 * Output: docs/ui-loop/screenshots/<runId>/... + docs/ui-loop/screenshots/<runId>/report.json
 *
 * Usage: node scripts/ui-audit.mjs [--base-url=http://localhost:5183] [--path=/cv]
 *
 * --path=<route> audits a route other than the homepage (e.g. `/cv`). Every
 * capture stage keeps running the same way; only the per-section screenshot
 * list (SECTIONS) switches to that route's own landmarks, the same pattern
 * `ui-gallery.mjs`/`ui-hierarchy-probe.mjs`/`ui-evidence-probe.mjs` already use
 * (cycles 034/035/037 lesson: a route without its own selector set is
 * invisible to every probe in the loop, however many cycles run against `/`).
 */
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, "").split("=");
    return [key, value ?? true];
  }),
);

const DEV_PORT = 5183;
const ROUTE_PATH = args.path ? (args.path.startsWith("/") ? args.path : `/${args.path}`) : "";
const BASE_URL = (args["base-url"] ?? `http://localhost:${DEV_PORT}`) + ROUTE_PATH;
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const OUT_DIR = path.join(ROOT, "docs/ui-loop/screenshots", runId);

const VIEWPORTS = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "laptop-1440", width: 1440, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
];

const LANGS = ["en", "fr"];

// Sections that make up the priority zone (below the project slides) plus the
// slides themselves for continuity/comparison. --path=/cv switches to that
// route's own landmarks — it has no project slides or priority zone at all.
const SECTIONS =
  ROUTE_PATH === "/cv"
    ? [
        { id: "experience", label: "cv-experience" },
        { id: "projects", label: "cv-projects" },
      ]
    : [
        { id: "selected-work", label: "project-slides" },
        { id: "about", label: "about-analytical-profile" },
        { id: "capabilities", label: "capabilities" },
        { id: "contact", label: "contact-footer" },
      ];

// The hover/focus dry-run below targets homepage-only selectors; on /cv it
// probes the route's own interactive elements instead so that pass isn't
// silently a no-op (0 matches, 0 screenshots, no error) on the second route.
const HOVER_TARGETS =
  ROUTE_PATH === "/cv"
    ? [
        { selector: ".cv-project-card", name: "cv-project-card" },
        { selector: ".cv-contacts a", name: "cv-contact-link" },
      ]
    : [
        { selector: ".contact-links a", name: "contact-link" },
        { selector: ".capability-card .card-link", name: "capability-learn-more" },
        { selector: ".build-mode-trigger-strong", name: "discover-personal-cta" },
      ];

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 304) return true;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Dev server did not become ready at ${url} within ${timeoutMs}ms`);
}

async function setLanguage(page, lang) {
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    ["portfolio-language", lang],
  );
}

async function capturePage({ lang, viewport, reducedMotion }) {
  const tag = `${viewport.name}_${lang}${reducedMotion ? "_reduced-motion" : ""}`;
  const dir = path.join(OUT_DIR, tag);
  await mkdir(dir, { recursive: true });

  // A fresh browser per capture, not a shared one across the whole run: a long-lived
  // Chromium instance accumulates memory across ~10 screenshot-heavy sessions (GSAP
  // scenes, full-page captures, progressive scroll) and reliably crashes ("Target
  // crashed") a few captures in. One browser per call costs a few seconds of launch
  // time but survives the full run instead of losing every capture after the crash.
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
  });
  const page = await context.newPage();
  await setLanguage(page, lang);

  // CLS accumulator, installed before navigation.
  await page.addInitScript(() => {
    window.__cls = 0;
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__cls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    } catch {
      // layout-shift not supported
    }
  });

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  const pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const result = { tag, viewport: viewport.name, lang, reducedMotion, consoleErrors, pageErrors };

  // 1. Full page screenshot (top of page, before scrolling).
  await page.screenshot({ path: path.join(dir, "00-top.png") });

  // 2. Progressive scroll capture in 400px steps so scroll-triggered reveals fire
  //    the way a real visitor scrolling would trigger them.
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const step = 400;
  let i = 0;
  for (let y = 0; y < scrollHeight; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(180);
    await page.screenshot({
      path: path.join(dir, `scroll-${String(i).padStart(2, "0")}-y${y}.png`),
    });
    i += 1;
  }

  // 3. Full-page screenshot (captures everything, including below the fold).
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(dir, "01-fullpage.png"), fullPage: true });

  // 4. Per-section screenshots.
  for (const section of SECTIONS) {
    const locator = page.locator(`#${section.id}`).first();
    const count = await locator.count();
    if (count === 0) {
      result[`missing-section-${section.id}`] = true;
      continue;
    }
    await locator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    try {
      await locator.screenshot({ path: path.join(dir, `section-${section.label}.png`) });
    } catch (err) {
      result[`section-screenshot-error-${section.id}`] = String(err);
    }
  }

  // 5. Horizontal-scroll check (§ Rotation E — mobile-first).
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.body.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  result.horizontalOverflowPx = Math.max(0, overflow.scrollWidth - overflow.clientWidth);

  // 6. Metrics: paint timing + CLS.
  const timing = await page.evaluate(() => {
    const paint = performance.getEntriesByType("paint");
    const fcp = paint.find((p) => p.name === "first-contentful-paint");
    return { firstContentfulPaint: fcp ? fcp.startTime : null };
  });
  const cls = await page.evaluate(() => window.__cls);
  result.metrics = { ...timing, cumulativeLayoutShift: cls };

  // 7. Hover states — only once per language, at the laptop viewport, to bound run time.
  if (viewport.name === "laptop-1440" && !reducedMotion) {
    for (const target of HOVER_TARGETS) {
      const el = page.locator(target.selector).first();
      if ((await el.count()) === 0) continue;
      await el.scrollIntoViewIfNeeded();
      await el.hover();
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(dir, `hover-${target.name}.png`) });
    }

    // 8. Keyboard focus-visible states (Tab only, no mouse).
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.keyboard.press("Tab");
    for (let t = 0; t < 25; t += 1) {
      const active = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const rect = el.getBoundingClientRect();
        return { tag: el.tagName, text: el.textContent?.slice(0, 40), y: rect.top + window.scrollY };
      });
      // "Past the fold" landmark used to decide when a focused element is worth
      // its own screenshot. `#about` only exists on the homepage; on /cv, where
      // it's absent, falling back to Infinity made this predicate never true —
      // a silent no-op, not an error (same failure shape as the hover pass
      // above before HOVER_TARGETS existed).
      const foldMarker = ROUTE_PATH === "/cv" ? "experience" : "about";
      if (active && active.y > (await page.evaluate((id) => document.getElementById(id)?.offsetTop ?? Infinity, foldMarker)) - 200) {
        await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 300)), active.y);
        await page.waitForTimeout(120);
        await page.screenshot({ path: path.join(dir, `focus-${t}.png`) });
      }
      await page.keyboard.press("Tab");
    }
  }

  // 9. Axe accessibility scan — once per language at laptop viewport (representative)
  //    and once at mobile (touch target / small-viewport specific issues).
  if (!reducedMotion && (viewport.name === "laptop-1440" || viewport.name === "mobile-390")) {
    const axeResults = await new AxeBuilder({ page }).analyze();
    result.axeViolations = axeResults.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.length,
      targets: v.nodes.slice(0, 5).map((n) => n.target),
    }));
    await writeFile(
      path.join(dir, "axe-violations.json"),
      JSON.stringify(axeResults.violations, null, 2),
    );
  }

  await context.close();
  await browser.close();
  return result;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  console.log(`Starting Vite dev server on port ${DEV_PORT}...`);
  const server = spawn(
    "npx",
    ["vite", "--port", String(DEV_PORT), "--strictPort"],
    { cwd: ROOT, shell: true, stdio: "pipe" },
  );
  server.stdout.on("data", () => {});
  server.stderr.on("data", (d) => process.stderr.write(d));

  try {
    await waitForServer(BASE_URL);
    console.log(`Dev server ready at ${BASE_URL}`);

    const runs = [];
    const persist = () =>
      writeFile(path.join(OUT_DIR, "report.json"), JSON.stringify(runs, null, 2));

    const jobs = [];
    for (const lang of LANGS) {
      for (const viewport of VIEWPORTS) {
        jobs.push({ lang, viewport, reducedMotion: false });
      }
    }
    // Dedicated reduced-motion pass (laptop viewport, both languages — see MISSION-UI.md
    // Rotation C: "Le site est-il utilisable et élégant avec reduced-motion ?").
    for (const lang of LANGS) {
      jobs.push({ lang, viewport: VIEWPORTS.find((v) => v.name === "laptop-1440"), reducedMotion: true });
    }

    for (const job of jobs) {
      const label = `${job.viewport.name} / ${job.lang}${job.reducedMotion ? " / reduced-motion" : ""}`;
      console.log(`Capturing ${label}...`);
      try {
        runs.push(await capturePage(job));
      } catch (err) {
        // One crashed Chromium target must not discard every capture already on disk —
        // record the failure and keep going with the remaining viewport/language combos.
        console.error(`Capture failed for ${label}: ${err.message ?? err}`);
        runs.push({ tag: `${job.viewport.name}_${job.lang}`, lang: job.lang, viewport: job.viewport.name, reducedMotion: job.reducedMotion, captureError: String(err) });
      }
      await persist();
    }

    console.log(`\nAudit complete. Output: ${OUT_DIR}`);

    const totalAxeViolations = runs.reduce((sum, r) => sum + (r.axeViolations?.length ?? 0), 0);
    const overflowIssues = runs.filter((r) => r.horizontalOverflowPx > 0);
    console.log(`Axe violation groups found: ${totalAxeViolations}`);
    console.log(`Runs with horizontal overflow: ${overflowIssues.length}`);
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
