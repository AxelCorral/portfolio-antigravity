#!/usr/bin/env node
/**
 * Rotation C probe (MISSION-UI.md §2 phase 3) — measures what *movement* costs
 * the reader in the priority zone, instead of judging animation by eye.
 *
 * The three questions of rotation C, answered with numbers:
 *
 *  1. "Y a-t-il du contenu qui reste invisible si une animation ne se déclenche
 *     pas ?" -> `revealDebt`: a progressive scroll (400px steps, as §2 phase 2
 *     prescribes) records, for every text node of the zone, the WORST effective
 *     opacity and the WORST composited contrast observed *while the node sits
 *     at a readable height*. A node on screen under 4.5:1 is the §6 guardrail
 *     broken by motion rather than by CSS; a node on screen at opacity 0 is
 *     content the visitor simply cannot read.
 *     Plus a `deepJump` test: land instantly at the bottom of the page (deep
 *     link, End key, restored scroll position) and check the same nodes — this
 *     is the case where an IntersectionObserver reveal can legitimately never
 *     fire.
 *
 *  2. "Le site est-il utilisable et élégant avec reduced-motion ?" -> the whole
 *     sweep runs a second time under `prefers-reduced-motion: reduce`, and the
 *     two runs are compared node by node. Any node that is not fully painted
 *     under `reduce` is a bug, not a preference.
 *
 *  3. "Chaque animation justifie-t-elle son coût ?" -> `cost`: how many nodes
 *     carry an inline transform/opacity written by the animation runtime. Plus
 *     `clipping`: every `overflow: hidden` box in the zone whose own content
 *     does not fit inside it. A reveal mask is invisible until it cuts a glyph.
 *
 * Usage:
 *   node scripts/ui-motion-probe.mjs [--base-url=http://localhost:5183]
 *                                    [--tag=before] [--viewports=390,1440]
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const HELPERS = path.join(__dirname, "lib/probe-color.js");
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);
const BASE_URL = args["base-url"] ?? "http://localhost:5183";
const TAG = args.tag ?? "probe";
const OUT = path.join(ROOT, "docs/ui-loop/screenshots", `motion-${TAG}`);

const ALL_VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
];
const wanted = args.viewports ? String(args.viewports).split(",") : null;
const VIEWPORTS = wanted ? ALL_VIEWPORTS.filter((v) => wanted.includes(v.name)) : ALL_VIEWPORTS;

const ZONE = ["#about", "#capabilities", "#contact", ".site-footer"];

function step(label, promise, ms = 30000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT " + ms + "ms: " + label)), ms),
    ),
  ]);
}

/** One sample of every zone text node at the current scroll position. */
const SAMPLE = (ZONE) => {
  const { parseColor, over, ratio, bgOf, effectiveOpacity } = window.__probe;
  const vh = window.innerHeight;
  const out = [];
  for (const sel of ZONE) {
    const root = document.querySelector(sel);
    if (!root) continue;
    for (const el of root.querySelectorAll("*")) {
      const ownText = Array.from(el.childNodes)
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent)
        .join("")
        .trim();
      if (!ownText) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) continue;
      // "Readable height": the band where a visitor could actually be reading
      // this node, not merely where it technically intersects the viewport.
      const readable = rect.top < vh * 0.9 && rect.bottom > vh * 0.1;
      if (!readable) continue;
      const fg = parseColor(cs.color);
      if (!fg) continue;
      const eff = effectiveOpacity(el);
      const bg = bgOf(el);
      const painted = over({ r: fg.r, g: fg.g, b: fg.b, a: fg.a * eff }, bg);
      out.push({
        sel,
        key: sel + "|" + el.tagName.toLowerCase() + "|" + ownText.slice(0, 40),
        text: ownText.slice(0, 60),
        size: Math.round(parseFloat(cs.fontSize) * 10) / 10,
        opacity: Math.round(eff * 1000) / 1000,
        contrast: Math.round(ratio(painted, bg) * 100) / 100,
      });
    }
  }
  return out;
};

/** Boxes that clip their own content. A reveal mask is invisible until it cuts. */
const CLIPPING = (ZONE) => {
  const out = [];
  for (const sel of ZONE) {
    const root = document.querySelector(sel);
    if (!root) continue;
    for (const el of root.querySelectorAll("*")) {
      const cs = getComputedStyle(el);
      const clipsY = cs.overflowY === "hidden" || cs.overflowY === "clip";
      const clipsX = cs.overflowX === "hidden" || cs.overflowX === "clip";
      if (!clipsY && !clipsX) continue;
      const overY = clipsY ? el.scrollHeight - el.clientHeight : 0;
      const overX = clipsX ? el.scrollWidth - el.clientWidth : 0;
      if (overY < 1 && overX < 1) continue;
      const text = (el.textContent || "").trim().slice(0, 40);
      if (!text) continue;
      out.push({
        sel,
        text,
        cls: String(el.className || "").slice(0, 80),
        clientH: el.clientHeight,
        scrollH: el.scrollHeight,
        overY,
        overX,
        fontSize: Math.round(parseFloat(cs.fontSize) * 10) / 10,
        lineHeight: cs.lineHeight,
      });
    }
  }
  return out;
};

/** How much of the zone is being driven by the animation runtime right now. */
const COST = (ZONE) => {
  let animated = 0;
  let willChange = 0;
  let total = 0;
  for (const sel of ZONE) {
    const root = document.querySelector(sel);
    if (!root) continue;
    for (const el of root.querySelectorAll("*")) {
      total++;
      const inline = el.getAttribute("style") || "";
      if (/opacity|transform|translate/.test(inline)) animated++;
      if (getComputedStyle(el).willChange !== "auto") willChange++;
    }
  }
  return { total, animated, willChange };
};

/**
 * Time-to-legible: park a section so it has just entered the reading band, then
 * sample every 50ms. An entrance animation is not free — it borrows the text
 * for as long as it runs, and the reader is already looking at it. `msToFull`
 * is how long the node takes to reach full paint; `msUnderFloor` is how long it
 * spends under the 4.5:1 the §6 guardrail asks of it *while on screen*.
 */
async function timeToLegible(page, selector, durationMs = 2600) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    // Section top parked at 55% of the viewport: it has just entered the band a
    // reader reads in, which is exactly when its entrance animation fires.
    window.scrollTo(0, Math.max(0, top - window.innerHeight * 0.55));
  }, selector);
  return page.evaluate(
    async (payload) => {
      const { sel, durationMs } = payload;
      const { parseColor, over, ratio, bgOf, effectiveOpacity } = window.__probe;
      const root = document.querySelector(sel);
      if (!root) return [];
      const targets = [];
      for (const el of root.querySelectorAll("*")) {
        const ownText = Array.from(el.childNodes)
          .filter((n) => n.nodeType === 3)
          .map((n) => n.textContent)
          .join("")
          .trim();
        if (!ownText) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none") continue;
        if (!parseColor(cs.color)) continue;
        targets.push({ el, text: ownText.slice(0, 46), size: parseFloat(cs.fontSize) });
      }
      const state = targets.map((t) => ({
        text: t.text,
        size: Math.round(t.size * 10) / 10,
        msToFull: null,
        msUnderFloor: 0,
        minContrast: Infinity,
      }));
      const t0 = performance.now();
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      let last = t0;
      while (performance.now() - t0 < durationMs) {
        await sleep(50);
        const now = performance.now();
        const dt = now - last;
        last = now;
        for (let i = 0; i < targets.length; i++) {
          const el = targets[i].el;
          const rect = el.getBoundingClientRect();
          // The SAME reading band as SAMPLE, deliberately: `rect.top <
          // innerHeight && rect.bottom > 0` counts a card peeking 20px above
          // the fold as "on screen", and such a card has legitimately not been
          // revealed yet (`useInView` margin `-100px`). With the loose test the
          // probe charged it the whole measurement window — 1374ms at 768 and
          // 1532ms at 1920, on nodes whose `msToFull` was null because their
          // reveal had simply never fired. Two instruments must not disagree
          // about what "the reader is looking at it" means.
          const onScreen = rect.top < innerHeight * 0.9 && rect.bottom > innerHeight * 0.1;
          const eff = effectiveOpacity(el);
          const cs = getComputedStyle(el);
          const fg = parseColor(cs.color);
          const bg = bgOf(el);
          const painted = over({ r: fg.r, g: fg.g, b: fg.b, a: fg.a * eff }, bg);
          const c = ratio(painted, bg);
          if (c < state[i].minContrast) state[i].minContrast = Math.round(c * 100) / 100;
          if (onScreen && c < 4.5) state[i].msUnderFloor += dt;
          if (state[i].msToFull === null && eff >= 0.99) state[i].msToFull = Math.round(now - t0);
        }
      }
      return state.map((s) => ({
        text: s.text,
        size: s.size,
        msToFull: s.msToFull,
        msUnderFloor: Math.round(s.msUnderFloor),
        minContrast: s.minContrast === Infinity ? null : s.minContrast,
      }));
    },
    { sel: selector, durationMs },
  );
}

async function sweep(page) {
  const worst = new Map();
  const record = (samples, phase) => {
    for (const s of samples) {
      const prev = worst.get(s.key);
      if (!prev) {
        worst.set(s.key, Object.assign({}, s, { worstAt: phase }));
        continue;
      }
      const next = Object.assign({}, prev);
      if (s.opacity < prev.opacity) {
        next.opacity = s.opacity;
        next.worstAt = phase;
      }
      if (s.contrast < prev.contrast) next.contrast = s.contrast;
      worst.set(s.key, next);
    }
  };

  // Progressive scroll, 400px steps — the visitor's pace, not a jump to bottom.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += 400) {
    await page.evaluate((target) => window.scrollTo(0, target), y);
    await page.waitForTimeout(220);
    record(await page.evaluate(SAMPLE, ZONE), "scroll@" + y);
  }
  return worst;
}

async function run() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const report = { baseUrl: BASE_URL, tag: TAG, runs: [] };

  for (const viewport of VIEWPORTS) {
    for (const lang of ["en", "fr"]) {
      for (const motion of ["no-preference", "reduce"]) {
        const label = viewport.name + "_" + lang + "_" + motion;
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          reducedMotion: motion === "reduce" ? "reduce" : "no-preference",
        });
        await context.addInitScript({ path: HELPERS });
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
          await step(label, page.goto(BASE_URL, { waitUntil: "networkidle" }));
          await page.waitForTimeout(800);

          // Legibility timing runs FIRST, on a page nobody has scrolled yet:
          // every reveal here is `once: true`, so a sweep would consume them
          // and the timer would then measure an animation that already ran.
          const legibility = {};
          for (const sel of ["#about", "#capabilities", ".work-grid", "#contact"]) {
            legibility[sel] = await step(label + ":ttl" + sel, timeToLegible(page, sel), 60000);
          }

          const worst = await step(label + ":sweep", sweep(page), 240000);

          // Deep jump: land at the bottom in one go. Any reveal keyed on an
          // IntersectionObserver that the visitor never scrolled through has to
          // survive this, or the content is simply not there.
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await page.waitForTimeout(1200);
          const deepJump = await page.evaluate(SAMPLE, ZONE);

          const clipping = await page.evaluate(CLIPPING, ZONE);
          const cost = await page.evaluate(COST, ZONE);


          const nodes = [...worst.values()];
          const dim = nodes.filter((n) => n.opacity < 0.999);
          const under = nodes.filter((n) => n.contrast < 4.5);
          report.runs.push({
            label,
            viewport: viewport.name,
            lang,
            motion,
            nodesMeasured: nodes.length,
            dimOnScreen: dim,
            underFloor: under,
            deepJumpDim: deepJump.filter((n) => n.opacity < 0.999),
            clipping,
            cost,
            legibility,
            errors,
          });
          const slow = Object.values(legibility)
            .flat()
            .filter((n) => n.msUnderFloor > 0);
          const worstDwell = slow.reduce((m, n) => Math.max(m, n.msUnderFloor), 0);
          console.log(
            label +
              ": " +
              nodes.length +
              " nodes | dim-on-screen " +
              dim.length +
              " | <4.5:1 " +
              under.length +
              " | clipped " +
              clipping.length +
              " | animated " +
              cost.animated +
              "/" +
              cost.total +
              " | under-floor-while-read " +
              slow.length +
              " nodes, worst " +
              worstDwell +
              "ms",
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
