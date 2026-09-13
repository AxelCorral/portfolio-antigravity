#!/usr/bin/env node
/**
 * Rotation C probe (MISSION-UI.md §2 phase 3) — the one question the existing
 * `ui-motion-probe.mjs` cannot answer: "chaque animation GSAP justifie-t-elle
 * son coût ?" measured in main-thread time, not in legibility. That probe
 * checks whether text stays readable while animating; this one checks whether
 * the animation itself makes the page janky to a real visitor.
 *
 * Scope: the whole site (CinematicOpening entrance + every ScrollTrigger
 * reveal), not just the priority zone (§3, frozen) — rotation C's cost
 * question is asked of "chaque animation", and the zone's reveals are a
 * minority of what GSAP drives on this site.
 *
 * Method: `PerformanceObserver({entryTypes: ["longtask"]})`, registered via
 * `addInitScript` so it is listening before any app code runs. A "long task"
 * is any main-thread task >50ms — the standard Core Web Vitals definition
 * (Total Blocking Time sums `duration - 50` for each one). Two phases:
 *  - `load`: from navigation to 2.4s after — covers the CinematicOpening
 *    entrance, the most expensive animation on the site by design.
 *  - `scroll`: a progressive 400px-step scroll to the bottom — covers every
 *    ScrollTrigger reveal firing as a real visitor would trigger it.
 * Runs twice per viewport/lang: `no-preference` and `reduce`, so a regression
 * specific to reduced-motion (rotation C's second question) would show up as
 * a `reduce` run with non-zero TBT where GSAP should be doing near nothing.
 *
 * Usage:
 *   node scripts/ui-longtask-probe.mjs [--base-url=http://localhost:5183]
 *                                      [--path=/] [--tag=probe]
 *                                      [--viewports=390,1440]
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
const BASE_URL = args["base-url"] ?? "http://localhost:5183";
const ROUTE = args.path ?? "/";
const TAG = args.tag ?? "probe";
const OUT = path.join(ROOT, "docs/ui-loop/screenshots", `longtask-${TAG}`);

const ALL_VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
];
const wanted = args.viewports ? String(args.viewports).split(",") : null;
const VIEWPORTS = wanted ? ALL_VIEWPORTS.filter((v) => wanted.includes(v.name)) : ALL_VIEWPORTS;

function step(label, promise, ms = 30000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT " + ms + "ms: " + label)), ms),
    ),
  ]);
}

/** Registered before any app script runs — misses zero long tasks. */
function installObserver() {
  window.__longtasks = [];
  try {
    const obs = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__longtasks.push({
          start: Math.round(entry.startTime),
          duration: Math.round(entry.duration),
        });
      }
    });
    obs.observe({ entryTypes: ["longtask"] });
  } catch (e) {
    window.__longtaskUnsupported = String(e);
  }
}

function summarize(tasks) {
  const tbt = tasks.reduce((sum, t) => sum + Math.max(0, t.duration - 50), 0);
  const longest = tasks.reduce((m, t) => Math.max(m, t.duration), 0);
  return { count: tasks.length, tbt: Math.round(tbt), longest };
}

async function run() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const report = { baseUrl: BASE_URL, route: ROUTE, tag: TAG, runs: [] };

  for (const viewport of VIEWPORTS) {
    for (const lang of ["en", "fr"]) {
      for (const motion of ["no-preference", "reduce"]) {
        const label = viewport.name + "_" + lang + "_" + motion;
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          reducedMotion: motion === "reduce" ? "reduce" : "no-preference",
        });
        await context.addInitScript(installObserver);
        await context.addInitScript((value) => {
          try {
            window.localStorage.setItem("portfolio-language", value);
          } catch (e) {
            void e;
          }
        }, lang);
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (e) => errors.push(String(e)));

        try {
          const t0 = Date.now();
          await step(label, page.goto(BASE_URL + ROUTE, { waitUntil: "networkidle" }));
          await page.waitForTimeout(2400);
          const loadTasks = await page.evaluate(() => window.__longtasks.splice(0));
          const unsupported = await page.evaluate(() => window.__longtaskUnsupported ?? null);

          const height = await page.evaluate(() => document.body.scrollHeight);
          for (let y = 0; y <= height; y += 400) {
            await page.evaluate((target) => window.scrollTo(0, target), y);
            await page.waitForTimeout(180);
          }
          await page.waitForTimeout(400);
          const scrollTasks = await page.evaluate(() => window.__longtasks.splice(0));

          const load = summarize(loadTasks);
          const scroll = summarize(scrollTasks);
          report.runs.push({
            label,
            viewport: viewport.name,
            lang,
            motion,
            wallClockMs: Date.now() - t0,
            unsupported,
            load,
            scroll,
            errors,
          });
          console.log(
            label +
              ": load " +
              load.count +
              " tasks/TBT " +
              load.tbt +
              "ms/longest " +
              load.longest +
              "ms | scroll " +
              scroll.count +
              " tasks/TBT " +
              scroll.tbt +
              "ms/longest " +
              scroll.longest +
              "ms" +
              (unsupported ? " | UNSUPPORTED: " + unsupported : ""),
          );
        } catch (e) {
          report.runs.push({ label, error: String(e) });
          console.log(label + ": ERROR " + e);
        }
        await context.close();
      }
    }
  }

  await browser.close();
  await writeFile(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log("\nreport -> " + path.join(OUT, "report.json"));
}

run();
