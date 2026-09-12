#!/usr/bin/env node
/**
 * Rotation B probe (MISSION-UI.md §2 phase 3) — measures the *vertical rhythm*
 * of the priority zone instead of judging it by eye.
 *
 * Answers the three questions rotation B asks, with numbers:
 *  1. Do the spacings sit on the 4/8px scale, or are they arbitrary?
 *  2. Is the breathing between neighbouring sections even, or does the page
 *     shrink as it ends? (measured as the real ink-to-ink gap, not as CSS
 *     padding, because a card's own padding compensates part of it)
 *  3. Does any line of copy in the zone exceed 75 characters on desktop?
 *
 * Usage: node scripts/ui-rhythm-probe.mjs [--base-url=...] [--tag=before]
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
const TAG = args.tag ?? "probe";
const OUT = path.join(ROOT, "docs/ui-loop/screenshots", `rhythm-${TAG}`);

const VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
];

/* The zone, in document order. `head` is the first painted child of the section
   and `tail` the last one: the gap a reader perceives between two sections runs
   from one section's *last* ink to the next section's *first* ink, which is not
   the same box when a section opens on a heading and closes on a grid. */
const BLOCKS = [
  { id: "about", section: "#about", head: ".about-card", tail: ".about-card" },
  {
    id: "capabilities",
    section: "#capabilities",
    head: "#capabilities .home-section-heading",
    tail: ".work-grid",
  },
  { id: "contact", section: "#contact", head: ".contact-panel", tail: ".contact-panel" },
  { id: "footer", section: ".site-footer", head: ".site-footer-inner", tail: ".site-footer-inner" },
];

async function measure(page) {
  return page.evaluate((BLOCKS) => {
    const px = (v) => Math.round(parseFloat(v) * 100) / 100;
    const out = { blocks: [], gaps: [], lines: [] };

    const read = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        sel,
        top: Math.round(r.top + window.scrollY),
        bottom: Math.round(r.bottom + window.scrollY),
        height: Math.round(r.height),
        padTop: px(cs.paddingTop),
        padBottom: px(cs.paddingBottom),
        padLeft: px(cs.paddingLeft),
        padRight: px(cs.paddingRight),
      };
    };

    for (const b of BLOCKS) {
      const section = read(b.section);
      const head = read(b.head);
      const tail = read(b.tail);
      out.blocks.push({
        id: b.id,
        section,
        head,
        tail,
        // white the section pads on beyond what its own CSS declares — the
        // by-product of a min-height or a stretched grid, never a decision
        tailWhite: section && tail ? section.bottom - tail.bottom : null,
        headWhite: section && head ? head.top - section.top : null,
      });
    }

    // ink-to-ink gap: bottom of one block's last ink to top of the next one's first
    for (let i = 0; i < out.blocks.length - 1; i += 1) {
      const a = out.blocks[i];
      const b = out.blocks[i + 1];
      if (!a.tail || !b.head) continue;
      out.gaps.push({
        from: a.id,
        to: b.id,
        inkGap: b.head.top - a.tail.bottom,
        cssGap: (a.section?.padBottom ?? 0) + (b.section?.padTop ?? 0),
      });
    }

    // longest composed line for every text block in the zone
    const TEXT = [
      ["#about .about-lede", "about lede"],
      ["#capabilities .home-section-heading > span", "capabilities subtitle"],
      ["#capabilities .capability-card p", "capability card body"],
      ["#capabilities .capability-card li", "capability card item"],
      ["#contact .contact-panel p:not(.contact-kicker)", "contact subtitle"],
    ];
    for (const [sel, label] of TEXT) {
      document.querySelectorAll(sel).forEach((el, n) => {
        const text = el.textContent ?? "";
        if (!text.trim()) return;
        // walk character by character, grouping by the rect each one lands in
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const lines = [];
        let node;
        while ((node = walker.nextNode())) {
          for (let i = 0; i < node.textContent.length; i += 1) {
            const range = document.createRange();
            range.setStart(node, i);
            range.setEnd(node, i + 1);
            const rects = range.getClientRects();
            if (!rects.length) continue;
            const top = Math.round(rects[0].top);
            const last = lines[lines.length - 1];
            if (!last || Math.abs(last.top - top) > 4) {
              lines.push({ top, chars: 1, left: Math.round(rects[0].left) });
            } else {
              last.chars += 1;
            }
          }
        }
        if (!lines.length) return;
        out.lines.push({
          label: n ? `${label} #${n + 1}` : label,
          lines: lines.length,
          maxChars: Math.max(...lines.map((l) => l.chars)),
          leftEdges: new Set(lines.map((l) => l.left)).size,
        });
      });
    }
    return out;
  }, BLOCKS);
}

async function run() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const report = { baseUrl: BASE_URL, tag: TAG, runs: [] };

  for (const vp of VIEWPORTS) {
    for (const lang of ["en", "fr"]) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      await context.addInitScript((l) => {
        window.localStorage.setItem("portfolio-language", l);
      }, lang);
      const page = await context.newPage();
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1200);
      // traverse the whole page so every reveal has fired before measuring
      const h = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < h; y += 400) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(45);
      }
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(900);
      const data = await measure(page);
      report.runs.push({ viewport: vp.name, lang, ...data });
      console.log(
        `${vp.name}_${lang}  gaps: ${data.gaps
          .map((g) => `${g.from}->${g.to} ink=${g.inkGap}/css=${g.cssGap}`)
          .join("  ")}  |  tailWhite: ${data.blocks
          .map((b) => `${b.id}=${b.tailWhite}`)
          .join(" ")}`,
      );
      await context.close();
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
