#!/usr/bin/env node
/**
 * Rotation A probe (MISSION-UI.md §2 phase 3) — measures the *typographic
 * hierarchy* of the priority zone instead of judging it by eye.
 *
 * Answers the three questions rotation A asks, with numbers:
 *  1. Where does the eye land first in a section? (salience ranking of the
 *     first screenful: ink area x contrast x relative size — the three things
 *     pre-attentive vision actually sorts on)
 *  2. How many typographic levels are visible on one screen? More than 4 is
 *     noise, per the mission. A "level" is a distinct computed signature:
 *     family / size / weight / style / tracking / case / composited colour.
 *  3. What can be removed without losing information? Surfaced as *near
 *     duplicates*: two levels that differ by less than 1px of size and less
 *     than 0.06 of relative luminance read as the same level to a human but
 *     cost one more rule in the system.
 *
 * Usage: node scripts/ui-hierarchy-probe.mjs [--base-url=...] [--tag=before]
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
const OUT = path.join(ROOT, "docs/ui-loop/screenshots", `hierarchy-${TAG}`);

const VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
];

const SECTIONS = [
  { id: "about", sel: "#about" },
  { id: "capabilities", sel: "#capabilities" },
  { id: "contact", sel: "#contact" },
  { id: "footer", sel: ".site-footer" },
  // reste du site (hors zone prioritaire, cycle 030 rotation A) : hero + nav +
  // un slide projet representatif (les 6 partagent le meme gabarit .home-project-card)
  { id: "city-nav", sel: ".city-nav" },
  { id: "city-content", sel: ".city-content" },
  { id: "profile", sel: "#profile" },
  { id: "project-card-01", sel: "#project-01 .home-project-card" },
];

async function measure(page, viewportHeight) {
  return page.evaluate(
    ({ SECTIONS, viewportHeight }) => {
      const round = (v, n = 2) => Math.round(v * 10 ** n) / 10 ** n;

      // Tailwind v4 emits every utility colour as `oklch()`, and getComputedStyle
      // hands it back unresolved. A regex that only knows `rgb()` does not fail
      // loudly here - it returns null and the node is skipped, so the probe
      // reports a clean hierarchy built on a fraction of the text. That is how
      // the first run of this script saw 15 of the 35 text nodes of
      // `#capabilities` and missed all 16 card list items. Parse both.
      const srgbFromOklab = (L, a, b) => {
        const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
        const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
        const s_ = L - 0.0894841775 * a - 1.291485548 * b;
        const l = l_ ** 3;
        const m = m_ ** 3;
        const s = s_ ** 3;
        const lin = [
          4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
          -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
          -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
        ];
        return lin.map((v) => {
          const e = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.abs(v) ** (1 / 2.4) - 0.055;
          return Math.max(0, Math.min(255, e * 255));
        });
      };
      const parseColor = (c) => {
        if (!c || c === "transparent" || c === "none") return { r: 0, g: 0, b: 0, a: 0 };
        const rgb = c.match(/rgba?\(([^)]+)\)/);
        if (rgb) {
          const [r, g, b, a = 1] = rgb[1].split(/[,\s/]+/).filter(Boolean).map(parseFloat);
          return { r, g, b, a };
        }
        const lab = c.match(/oklab\(([^)]+)\)/i);
        if (lab) {
          const parts = lab[1].split("/");
          const [Lr, ar, br] = parts[0].trim().split(/\s+/);
          const L = Lr.endsWith("%") ? parseFloat(Lr) / 100 : parseFloat(Lr);
          const alphaRaw = parts[1]?.trim();
          const alpha =
            alphaRaw === undefined
              ? 1
              : alphaRaw.endsWith("%")
                ? parseFloat(alphaRaw) / 100
                : parseFloat(alphaRaw);
          const [r, g, bl] = srgbFromOklab(L, parseFloat(ar), parseFloat(br));
          return { r, g, b: bl, a: Number.isNaN(alpha) ? 1 : alpha };
        }
        const ok = c.match(/oklch\(([^)]+)\)/i);
        if (ok) {
          const parts = ok[1].split("/");
          const [Lr, Cr, Hr] = parts[0].trim().split(/\s+/);
          const L = Lr.endsWith("%") ? parseFloat(Lr) / 100 : parseFloat(Lr);
          const C = Cr.endsWith("%") ? (parseFloat(Cr) / 100) * 0.4 : parseFloat(Cr);
          const H = parseFloat(Hr ?? "0") || 0;
          const ar = parts[1]?.trim();
          const a = ar === undefined ? 1 : ar.endsWith("%") ? parseFloat(ar) / 100 : parseFloat(ar);
          const h = (H * Math.PI) / 180;
          const [r, g, b] = srgbFromOklab(L, C * Math.cos(h), C * Math.sin(h));
          return { r, g, b, a: Number.isNaN(a) ? 1 : a };
        }
        return null;
      };
      const over = (fg, bg) => ({
        r: fg.r * fg.a + bg.r * (1 - fg.a),
        g: fg.g * fg.a + bg.g * (1 - fg.a),
        b: fg.b * fg.a + bg.b * (1 - fg.a),
        a: 1,
      });
      const lum = ({ r, g, b }) => {
        const f = (v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const ratio = (a, b) => {
        const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
        return (hi + 0.05) / (lo + 0.05);
      };
      // effective background: first opaque-enough ancestor paint, flattened
      const bgOf = (el) => {
        let acc = null;
        let node = el;
        while (node && node !== document.documentElement.parentNode) {
          const c = parseColor(getComputedStyle(node).backgroundColor);
          if (c && c.a > 0) acc = acc ? over(acc, c) : c;
          if (acc && acc.a >= 0.999) return acc;
          node = node.parentElement;
        }
        const base = { r: 0, g: 0, b: 0, a: 1 };
        return acc ? over(acc, base) : base;
      };

      const shortFamily = (f) => f.split(",")[0].replace(/["']/g, "").trim();

      const out = { sections: [] };

      for (const s of SECTIONS) {
        const root = document.querySelector(s.sel);
        if (!root) continue;
        const rootRect = root.getBoundingClientRect();
        const rootTop = rootRect.top + window.scrollY;

        const nodes = [];
        const all = root.querySelectorAll("*");
        for (const el of all) {
          // only elements that themselves paint text (direct text children)
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

          const fg = parseColor(cs.color);
          if (!fg) continue;
          const bg = bgOf(el);
          const composited = over(fg, bg);
          const size = round(parseFloat(cs.fontSize), 1);
          const track = round(
            cs.letterSpacing === "normal" ? 0 : parseFloat(cs.letterSpacing),
            2,
          );

          const sig = [
            shortFamily(cs.fontFamily),
            `${size}px`,
            cs.fontWeight,
            cs.fontStyle === "italic" ? "italic" : "roman",
            `ls${track}`,
            cs.textTransform === "uppercase" ? "UPPER" : "none",
            `#${[composited.r, composited.g, composited.b]
              .map((v) => Math.round(v).toString(16).padStart(2, "0"))
              .join("")}`,
          ].join("|");

          nodes.push({
            sig,
            family: shortFamily(cs.fontFamily),
            size,
            weight: cs.fontWeight,
            italic: cs.fontStyle === "italic",
            tracking: track,
            upper: cs.textTransform === "uppercase",
            contrast: round(ratio(composited, bg), 2),
            lum: round(lum(composited), 4),
            top: Math.round(rect.top + window.scrollY - rootTop),
            bottom: Math.round(rect.bottom + window.scrollY - rootTop),
            w: Math.round(rect.width),
            h: Math.round(rect.height),
            // pre-attentive salience proxy: how much ink, how loud, how big
            salience: Math.round(
              Math.min(rect.width, ownText.length * size * 0.55) *
                rect.height *
                ratio(composited, bg) *
                (size / 16),
            ),
            text: ownText.slice(0, 48),
            tag: el.tagName.toLowerCase(),
            cls: (el.className?.baseVal ?? el.className ?? "").toString().slice(0, 48),
          });
        }

        // distinct levels across the whole section
        const bySig = new Map();
        for (const n of nodes) {
          if (!bySig.has(n.sig)) bySig.set(n.sig, { ...n, count: 0, samples: [] });
          const e = bySig.get(n.sig);
          e.count += 1;
          if (e.samples.length < 2) e.samples.push(n.text);
        }
        const levels = [...bySig.values()].sort((a, b) => b.size - a.size);

        // levels visible in one screenful — sliding window of viewport height
        let worstWindow = { at: 0, levels: 0, sigs: [] };
        const height = Math.round(rootRect.height);
        for (let y = 0; y <= Math.max(0, height - 1); y += 100) {
          const win = new Set(
            nodes.filter((n) => n.bottom > y && n.top < y + viewportHeight).map((n) => n.sig),
          );
          if (win.size > worstWindow.levels) {
            worstWindow = { at: y, levels: win.size, sigs: [...win] };
          }
        }

        // near duplicates: same family+weight+case, <1px apart, close luminance
        const dupes = [];
        for (let i = 0; i < levels.length; i += 1) {
          for (let j = i + 1; j < levels.length; j += 1) {
            const a = levels[i];
            const b = levels[j];
            if (a.family !== b.family || a.weight !== b.weight) continue;
            if (a.upper !== b.upper || a.italic !== b.italic) continue;
            if (Math.abs(a.size - b.size) >= 1) continue;
            if (Math.abs(a.lum - b.lum) >= 0.06) continue;
            dupes.push({
              a: `${a.size}px ${a.weight} lum${a.lum} "${a.text}"`,
              b: `${b.size}px ${b.weight} lum${b.lum} "${b.text}"`,
              dSize: round(Math.abs(a.size - b.size), 2),
              dLum: round(Math.abs(a.lum - b.lum), 4),
            });
          }
        }

        // first screenful salience ranking — "where does the eye go first?"
        const firstScreen = nodes
          .filter((n) => n.top < viewportHeight)
          .sort((a, b) => b.salience - a.salience)
          .slice(0, 5)
          .map((n) => ({
            text: n.text,
            tag: n.tag,
            size: n.size,
            contrast: n.contrast,
            salience: n.salience,
          }));

        out.sections.push({
          id: s.id,
          height,
          textNodes: nodes.length,
          levelCount: levels.length,
          levels: levels.map((l) => ({
            sig: l.sig,
            count: l.count,
            size: l.size,
            weight: l.weight,
            family: l.family,
            upper: l.upper,
            italic: l.italic,
            tracking: l.tracking,
            contrast: l.contrast,
            lum: l.lum,
            samples: l.samples,
          })),
          worstWindow,
          dupes,
          firstScreen,
        });
      }
      return out;
    },
    { SECTIONS, viewportHeight },
  );
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
      const h = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < h; y += 400) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(45);
      }
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(900);
      const data = await measure(page, vp.height);
      report.runs.push({ viewport: vp.name, lang, ...data });
      console.log(
        `${vp.name}_${lang}  ` +
          data.sections
            .map(
              (s) =>
                `${s.id}: ${s.levelCount} levels / ${s.worstWindow.levels} per screen` +
                (s.dupes.length ? ` (${s.dupes.length} near-dup)` : ""),
            )
            .join("  |  "),
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
