#!/usr/bin/env node
/**
 * Focused audit of the priority zone (MISSION-UI.md §3) — the fast, reliable
 * counterpart to `scripts/ui-audit.mjs`.
 *
 * `ui-audit.mjs` is exhaustive but has been observed hanging silently mid-run
 * (see BACKLOG "P2 — ui-audit.mjs semble se bloquer"). This script covers the
 * same ground for the sections below the project slides, with an explicit
 * timeout around every step so a stuck page fails fast instead of stalling the
 * cycle. It assumes a server is already running (dev or preview).
 *
 * Usage: node scripts/ui-zone-audit.mjs [--base-url=http://localhost:5183]
 *                                       [--tag=after] [--viewports=390,1440]
 */
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
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
const TAG = args.tag ?? new Date().toISOString().replace(/[:.]/g, "-");
const OUT_DIR = path.join(ROOT, "docs/ui-loop/screenshots", `zone-${TAG}`);

const ALL_VIEWPORTS = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "laptop-1440", width: 1440, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
];
const wanted = args.viewports ? String(args.viewports).split(",") : null;
const VIEWPORTS = wanted
  ? ALL_VIEWPORTS.filter((v) => wanted.some((w) => v.name.includes(w)))
  : ALL_VIEWPORTS;

const SECTIONS = ["about", "capabilities", "contact"];

/** Every await goes through this: a hung step must fail, never stall the cycle. */
function step(label, promise, ms = 20000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`TIMEOUT after ${ms}ms: ${label}`)), ms),
    ),
  ]);
}

async function run() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const report = { baseUrl: BASE_URL, tag: TAG, runs: [] };

  for (const vp of VIEWPORTS) {
    for (const lang of ["en", "fr"]) {
      for (const motion of ["no-preference", "reduce"]) {
        // reduced-motion only needs one viewport — it is a behaviour check, not a layout one
        if (motion === "reduce" && vp.width !== 1440) continue;
        const key = `${vp.name}_${lang}${motion === "reduce" ? "_reduced" : ""}`;
        const dir = path.join(OUT_DIR, key);
        await mkdir(dir, { recursive: true });
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: 1,
          reducedMotion: motion,
        });
        await context.addInitScript((l) => {
          window.localStorage.setItem("portfolio-language", l);
        }, lang);
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (e) => errors.push(String(e)));
        page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

        const entry = { key, viewport: vp.name, lang, motion, errors, sections: {} };
        try {
          await step(`${key} goto`, page.goto(BASE_URL, { waitUntil: "domcontentloaded" }), 30000);
          await step(`${key} settle`, page.waitForTimeout(1200));

          // Progressive scroll so reveal animations fire like a real visitor's,
          // then capture each priority-zone section once it has been traversed.
          for (const id of SECTIONS) {
            const handle = await page.$(`#${id}`);
            if (!handle) {
              entry.sections[id] = { error: "not found" };
              continue;
            }
            const box = await handle.boundingBox();
            if (box) {
              const target = Math.max(0, box.y - vp.height * 0.6);
              const from = await page.evaluate(() => window.scrollY);
              for (let y = from; y < target; y += 400) {
                await page.evaluate((v) => window.scrollTo(0, v), y);
                await page.waitForTimeout(90);
              }
              await page.evaluate((v) => window.scrollTo(0, v), target);
              await page.waitForTimeout(900);
            }
            await step(
              `${key} shot ${id}`,
              handle.screenshot({ path: path.join(dir, `${id}.png`) }),
              15000,
            );
            entry.sections[id] = await handle.evaluate((el) => {
              const r = el.getBoundingClientRect();
              return { width: Math.round(r.width), height: Math.round(r.height) };
            });
          }

          // footer sits outside <main>, capture it as the closing beat
          const footer = await page.$(".site-footer");
          if (footer) {
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.waitForTimeout(700);
            await step(
              `${key} shot footer`,
              footer.screenshot({ path: path.join(dir, "footer.png") }),
              15000,
            );
          }

          // end-of-page viewport shot: what a visitor actually sees on arrival at the bottom
          await step(
            `${key} shot bottom`,
            page.screenshot({ path: path.join(dir, "zz-bottom-viewport.png") }),
            15000,
          );

          entry.overflow = await page.evaluate(() => ({
            scrollWidth: document.body.scrollWidth,
            innerWidth: window.innerWidth,
            horizontal: document.body.scrollWidth > window.innerWidth + 1,
          }));

          const axe = await step(
            `${key} axe`,
            new AxeBuilder({ page }).analyze(),
            60000,
          );
          entry.axeViolations = axe.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.length,
            target: v.nodes[0]?.target,
          }));
        } catch (error) {
          entry.error = String(error);
        }
        report.runs.push(entry);
        console.log(
          `${key}: ${entry.error ?? "ok"} | axe=${entry.axeViolations?.length ?? "-"} | hscroll=${entry.overflow?.horizontal ?? "-"}`,
        );
        await context.close();
      }
    }
  }

  await browser.close();
  await writeFile(path.join(OUT_DIR, "report.json"), JSON.stringify(report, null, 2));
  console.log(`\nreport: ${path.relative(ROOT, path.join(OUT_DIR, "report.json"))}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
