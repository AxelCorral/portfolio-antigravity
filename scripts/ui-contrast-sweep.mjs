#!/usr/bin/env node
/**
 * Full-site contrast sweep (MISSION-UI.md §6 guardrail: contrast >= 4.5:1,
 * >= 3:1 for large text — measured, not estimated).
 *
 * Backlog item open since cycle 021: axe-core's `color-contrast` rule reports
 * 0 violations on this site while leaving hundreds of nodes `incomplete`
 * ("background color could not be determined due to a pseudo element" /
 * "overlapped by another element") — that is not a clean bill of health, it
 * is axe declining to judge. The home-grown probe (scripts/lib/probe-color.js)
 * resolves oklch()/oklab() and flattens the real composited background, but
 * until now it only ever ran against a hand-picked list of selectors per
 * cycle. This script walks *every* text-painting element on a route instead,
 * so a regression anywhere no longer depends on a human guessing which
 * selector to probe next.
 *
 * WCAG 2 AA thresholds applied: 4.5:1 normal text, 3:1 for text >=24px (18pt)
 * or >=19px (14pt) when bold (font-weight >= 700) — same rule axe-core uses.
 * Decorative nodes (`aria-hidden="true"` on the node or an ancestor) are
 * skipped: WCAG 1.4.3 does not apply to them (cf. `.pc-watermark`, cycle 033).
 *
 * Usage: node scripts/ui-contrast-sweep.mjs [--base-url=http://localhost:5174]
 *        [--path=/cv] [--viewports=390,1440] [--langs=en,fr]
 *        [--pseudo=hover,focus-visible]
 *
 * `--pseudo` extends the sweep to interactive elements' :hover/:focus-visible
 * states — never checked by any tool in this project before cycle 040. The
 * rest-state sweep (default) cannot see these: forcing a pseudo-class on an
 * element requires the CDP `CSS.forcePseudoState` call, not a real mouse
 * move/Tab press repeated across every candidate. Each interactive element
 * (`a, button, [role="button"], input, select, textarea`) is tagged with a
 * throwaway `data-hp` index, its node resolved over CDP, the requested pseudo
 * classes forced one element at a time, then the *same* `measure()` re-runs
 * scoped to that element's subtree before the state is cleared.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);
const BASE = args["base-url"] ?? "http://localhost:5174";
const ROUTES = args.path ? [args.path] : ["/", "/cv"];
const VP_NAMES = (args.viewports ?? "390,768,1440,1920").split(",");
const LANGS = (args.langs ?? "en,fr").split(",");
const PROBE_SRC = path.join(ROOT, "scripts/lib/probe-color.js");
const PSEUDO_STATES = args.pseudo ? String(args.pseudo).split(",") : [];

const VIEWPORTS = {
  "390": { width: 390, height: 844 },
  "768": { width: 768, height: 1024 },
  "1440": { width: 1440, height: 900 },
  "1920": { width: 1920, height: 1080 },
};

async function measure(page, rootSelector) {
  return page.evaluate((rootSel) => {
    const { parseColor, over, ratio, bgOf, effectiveOpacity } = window.__probe;
    const round = (v, n = 2) => Math.round(v * 10 ** n) / 10 ** n;
    const isDecorative = (el) => {
      let node = el;
      while (node && node.nodeType === 1) {
        if (node.getAttribute && node.getAttribute("aria-hidden") === "true") return true;
        node = node.parentElement;
      }
      return false;
    };
    const out = [];
    const root = rootSel ? document.querySelector(rootSel) : document.body;
    const all = root ? root.querySelectorAll("*") : [];
    const scope = root ? [root, ...all] : all;
    for (const el of scope) {
      const ownText = Array.from(el.childNodes)
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent)
        .join("")
        .trim();
      if (!ownText) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      const opacity = effectiveOpacity(el);
      if (opacity <= 0.001) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) continue;
      if (isDecorative(el)) continue;

      const fgRaw = parseColor(cs.color);
      if (!fgRaw) continue;
      const fg = { ...fgRaw, a: fgRaw.a * opacity };
      const bg = bgOf(el);
      const composited = over(fg, bg);
      const size = round(parseFloat(cs.fontSize), 1);
      const weight = parseInt(cs.fontWeight, 10) || 400;
      const isLarge = size >= 24 || (size >= 19 && weight >= 700);
      const threshold = isLarge ? 3.0 : 4.5;
      const contrast = round(ratio(composited, bg), 2);
      if (contrast >= threshold) continue;

      out.push({
        contrast,
        threshold,
        size,
        weight,
        isLarge,
        text: ownText.slice(0, 60),
        tag: el.tagName.toLowerCase(),
        cls: (el.className?.baseVal ?? el.className ?? "").toString().slice(0, 80),
        top: Math.round(rect.top + window.scrollY),
      });
    }
    // de-dupe identical (cls, contrast, size) triples — a repeated list item
    // (e.g. 16 card bullets) should report once, not 16 times.
    const seen = new Map();
    for (const v of out) {
      const key = `${v.cls}|${v.contrast}|${v.size}|${v.weight}`;
      if (!seen.has(key)) seen.set(key, { ...v, count: 0, samples: [] });
      const e = seen.get(key);
      e.count += 1;
      if (e.samples.length < 2) e.samples.push(v.text);
    }
    return [...seen.values()].sort((a, b) => a.contrast - b.contrast);
  }, rootSelector);
}

const PSEUDO_MAP = { hover: ["hover"], "focus-visible": ["focus-visible"] };
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, select, textarea';

/**
 * Forces one pseudo-class at a time on every interactive element and
 * re-measures contrast scoped to that element's subtree. Uses CDP
 * `CSS.forcePseudoState` because these states can't be produced reliably (or
 * quickly, at this element count) by real mouse/keyboard interaction.
 */
async function measurePseudo(page, states) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");
  const { root } = await cdp.send("DOM.getDocument");

  const count = await page.evaluate((sel) => {
    const els = [...document.querySelectorAll(sel)].filter((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none";
    });
    els.forEach((el, i) => el.setAttribute("data-hp", String(i)));
    return els.length;
  }, INTERACTIVE_SELECTOR);

  const found = [];
  for (let i = 0; i < count; i += 1) {
    const selector = `[data-hp="${i}"]`;
    let nodeId;
    try {
      ({ nodeId } = await cdp.send("DOM.querySelector", { nodeId: root.nodeId, selector }));
    } catch {
      continue;
    }
    if (!nodeId) continue;
    for (const state of states) {
      const forced = PSEUDO_MAP[state];
      if (!forced) continue;
      try {
        await cdp.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: forced });
        // Settle past any CSS transition (longest observed in this codebase is
        // 250ms) before measuring: this reports the steady state a keyboard
        // user actually reads while paused on the element, not a mid-fade
        // blip. Transient contrast during a reveal is a distinct, already
        // logged concern (BACKLOG.md, cycle 022, motion probe) — conflating
        // the two would misreport a transition artifact as a static defect.
        await page.waitForTimeout(320);
        const violations = await measure(page, selector);
        for (const v of violations) found.push({ ...v, pseudo: state, forcedOn: selector });
        await cdp.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: [] });
      } catch {
        // node detached mid-loop (e.g. a modal-only trigger) — skip, not fatal.
      }
    }
  }
  await page.evaluate(() => {
    document.querySelectorAll("[data-hp]").forEach((el) => el.removeAttribute("data-hp"));
  });
  await cdp.detach();

  // de-dupe: same class+contrast+pseudo reported from many equivalent instances.
  const seen = new Map();
  for (const v of found) {
    const key = `${v.cls}|${v.contrast}|${v.pseudo}`;
    if (!seen.has(key)) seen.set(key, { ...v, count: 0 });
    seen.get(key).count += 1;
  }
  return [...seen.values()].sort((a, b) => a.contrast - b.contrast);
}

async function run() {
  const OUT = path.join(ROOT, "docs/ui-loop/screenshots", "contrast-sweep");
  await mkdir(OUT, { recursive: true });
  const report = { baseUrl: BASE, routes: ROUTES, runs: [] };

  for (const routePath of ROUTES) {
    for (const vpName of VP_NAMES) {
      const vp = VIEWPORTS[vpName];
      for (const lang of LANGS) {
        // A fresh browser per combination, not one shared across the whole run:
        // the --pseudo pass opens a CDP session and forces a pseudo-class on
        // every interactive element, one at a time — heavier than the rest-state
        // sweep by an order of magnitude. A single long-lived Chromium instance
        // accumulates memory across ~10+ such sessions and eventually crashes
        // mid-evaluate (same root cause already diagnosed for ui-audit.mjs,
        // cycle 027 — "un seul browser Chromium partagé... finissait par
        // crasher"). Observed here as two combinations at 1920px throwing
        // "Execution context was destroyed" that reproduced as 0 violations
        // when re-run in isolation, confirming it was resource exhaustion, not
        // a real defect.
        const browser = await chromium.launch();
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: 1,
        });
        try {
          await context.addInitScript((l) => {
            window.localStorage.setItem("portfolio-language", l);
          }, lang);
          await context.addInitScript({ path: PROBE_SRC });
          const page = await context.newPage();
          await page.goto(BASE + routePath, { waitUntil: "domcontentloaded" });
          await page.waitForTimeout(1200);
          const h = await page.evaluate(() => document.body.scrollHeight);
          for (let y = 0; y < h; y += 400) {
            await page.evaluate((v) => window.scrollTo(0, v), y);
            await page.waitForTimeout(45);
          }
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await page.waitForTimeout(900);
          const violations = await measure(page);
          report.runs.push({ route: routePath, viewport: vpName, lang, violations });
          console.log(
            `${routePath} ${vpName}_${lang}  ${violations.length} violation(s)` +
              (violations.length
                ? "  worst=" +
                  violations[0].contrast +
                  ":1 on <" +
                  violations[0].tag +
                  " class=\"" +
                  violations[0].cls +
                  "\">"
                : ""),
          );

          if (PSEUDO_STATES.length) {
            const pseudoViolations = await measurePseudo(page, PSEUDO_STATES);
            report.runs[report.runs.length - 1].pseudoViolations = pseudoViolations;
            console.log(
              `${routePath} ${vpName}_${lang}  [pseudo:${PSEUDO_STATES.join("+")}] ` +
                `${pseudoViolations.length} violation(s)` +
                (pseudoViolations.length
                  ? "  worst=" +
                    pseudoViolations[0].contrast +
                    ":1 on <" +
                    pseudoViolations[0].tag +
                    " class=\"" +
                    pseudoViolations[0].cls +
                    `" :${pseudoViolations[0].pseudo}>`
                  : ""),
            );
          }
        } catch (e) {
          // A single combination crashing (e.g. execution context destroyed by
          // an unrelated dev-server reload) must not lose every other
          // combination's data — same lesson as ui-audit.mjs, cycle 027.
          console.error(`${routePath} ${vpName}_${lang}  CRASHED: ${e.message}`);
          report.runs.push({ route: routePath, viewport: vpName, lang, crashed: e.message });
        } finally {
          await context.close();
          await browser.close();
        }
      }
    }
  }

  await writeFile(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(`\nreport: ${path.relative(ROOT, path.join(OUT, "report.json"))}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
