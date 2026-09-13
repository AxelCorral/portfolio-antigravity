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

const VIEWPORTS = {
  "390": { width: 390, height: 844 },
  "768": { width: 768, height: 1024 },
  "1440": { width: 1440, height: 900 },
  "1920": { width: 1920, height: 1080 },
};

async function measure(page) {
  return page.evaluate(() => {
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
    const all = document.body.querySelectorAll("*");
    for (const el of all) {
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
  });
}

async function run() {
  const OUT = path.join(ROOT, "docs/ui-loop/screenshots", "contrast-sweep");
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const report = { baseUrl: BASE, routes: ROUTES, runs: [] };

  for (const routePath of ROUTES) {
    for (const vpName of VP_NAMES) {
      const vp = VIEWPORTS[vpName];
      for (const lang of LANGS) {
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: 1,
        });
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
        await context.close();
      }
    }
  }

  await browser.close();
  await writeFile(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(`\nreport: ${path.relative(ROOT, path.join(OUT, "report.json"))}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
