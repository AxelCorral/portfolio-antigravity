#!/usr/bin/env node
/**
 * Rotation D — Credibility (MISSION-UI.md §2 phase 3).
 *
 * The three questions of rotation D are usually answered with an opinion. This
 * probe answers them with counts, on the priority zone (§3):
 *
 *   D-Q2 "are the claims backed, or merely declarative?"
 *     -> per section: number of assertive sentences vs number of links to a
 *        proof (repo / demo / capture / detail view), i.e. a claim-to-evidence
 *        ratio. A section with claims and zero outbound proof is declarative by
 *        measurement, not by taste.
 *
 *   D-Q2b "does the proof actually land?"
 *     -> every in-page anchor of the zone is *clicked*, and the probe records
 *        where the viewport ends up: does the target exist, is it inside the
 *        reading band, and is its text actually painted (effective opacity)?
 *        A dead or mis-landing anchor in a block whose kicker reads
 *        "Capabilities / evidence" is a credibility defect, not a nav detail.
 *
 *   D-Q3 "is there a finish gap between the showcase and the bottom?"
 *     -> the same structural inventory taken on the project slides (the worked
 *        part of the page) and on each zone section: how many distinct
 *        information roles does a block carry (meta, status, category, hook,
 *        body, evidence link, media), how many of them are proof-bearing.
 *
 * Colour maths comes from scripts/lib/probe-color.js so this probe and the
 * hierarchy/motion probes cannot diverge on a pixel value (cycle 021 lesson).
 *
 * Coverage control (cycle 021 lesson): the probe prints the number of text
 * nodes it actually measured per section. Compare it to the reference before
 * reading a single ratio.
 *
 * Usage: node scripts/ui-evidence-probe.mjs [--base-url=http://localhost:5183]
 *                                           [--tag=before] [--viewports=390,1440]
 *                                           [--langs=en,fr]
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const COLOR_LIB = path.join(__dirname, "lib/probe-color.js");

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);

const BASE_URL = args["base-url"] ?? "http://localhost:5183";
const TAG = args.tag ?? new Date().toISOString().replace(/[:.]/g, "-");
const OUT_DIR = path.join(ROOT, "docs/ui-loop/screenshots", `evidence-${TAG}`);

const ALL_VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
];
const wantedVp = args.viewports ? String(args.viewports).split(",") : null;
const VIEWPORTS = wantedVp ? ALL_VIEWPORTS.filter((v) => wantedVp.includes(v.name)) : ALL_VIEWPORTS;
const LANGS = args.langs ? String(args.langs).split(",") : ["en", "fr"];

// The showcase (worked part of the page) is measured alongside the zone so the
// "finish gap" of D-Q3 is a difference between two inventories, not a feeling.
const BLOCKS = [
  { sel: "#selected-work", key: "selected-work", role: "showcase" },
  { sel: "#about", key: "about", role: "zone" },
  { sel: "#capabilities", key: "capabilities", role: "zone" },
  { sel: "#contact", key: "contact", role: "zone" },
  { sel: ".site-footer", key: "site-footer", role: "zone" },
];

const withTimeout = (p, ms, label) =>
  Promise.race([
    p,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`timeout: ${label}`)), ms)),
  ]);

async function inventory(page) {
  return page.evaluate((blocks) => {
    const { parseColor, over, ratio, bgOf, effectiveOpacity } = window.__probe;

    // A "claim" is a sentence of running prose or a heading: text the visitor
    // is asked to believe. Labels, numbers and nav words are not claims.
    //
    // Claims are counted on *semantic blocks*, never on leaves. `#about` splits
    // its paragraph into 352 one-character spans (`AnimatedLetter`) and its
    // title into per-word spans (`WordsPullUpMultiStyle`): a leaf-based counter
    // reads that section as "2 claims, 30 characters" — a section that carries
    // 424 characters of pure assertion would look like the least declarative
    // block on the page. Same failure mode as cycle 021, opposite direction.
    const CLAIM_SEL = "p,h1,h2,h3,h4,li,blockquote,figcaption";
    const isClaimNode = (el, text) => {
      if (!text || text.length < 12) return false;
      // a nested claim block (li inside p, etc.) is counted once, at the top
      if (el.parentElement && el.parentElement.closest(CLAIM_SEL)) return false;
      return true;
    };

    const results = {};

    for (const block of blocks) {
      const root = document.querySelector(block.sel);
      if (!root) {
        results[block.key] = { missing: true };
        continue;
      }

      // Every text-bearing leaf — counted only for coverage control, so this
      // probe's node count can be compared with the hierarchy/motion probes.
      const leaves = [...root.querySelectorAll("*")].filter((el) => {
        if (!el.childNodes.length) return false;
        const own = [...el.childNodes]
          .filter((n) => n.nodeType === 3)
          .map((n) => n.textContent.trim())
          .join(" ")
          .trim();
        if (!own) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });

      const textNodes = leaves.length;
      const claims = [];
      for (const el of root.querySelectorAll(CLAIM_SEL)) {
        const text = el.textContent.trim().replace(/\s+/g, " ");
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (!isClaimNode(el, text)) continue;
        const cs = getComputedStyle(el);
        const fg = parseColor(cs.color);
        const bg = bgOf(el);
        const comp = over({ ...fg, a: (fg.a ?? 1) * effectiveOpacity(el) }, bg);
        claims.push({
          tag: el.tagName.toLowerCase(),
          cls: el.className && typeof el.className === "string" ? el.className.slice(0, 60) : "",
          chars: text.length,
          // sentences a reader must take on trust
          sentences: (text.match(/[.!?](\s|$)/g) || []).length || 1,
          contrast: +ratio(comp, bg).toFixed(2),
          text: text.slice(0, 90),
        });
      }

      // Proof-bearing affordances inside the block.
      const anchors = [...root.querySelectorAll("a[href]")].map((a) => {
        const href = a.getAttribute("href");
        const r = a.getBoundingClientRect();
        return {
          href,
          label: a.textContent.trim().replace(/\s+/g, " ").slice(0, 60),
          kind: href.startsWith("#")
            ? "in-page"
            : href.startsWith("mailto:")
              ? "mailto"
              : href.startsWith("/")
                ? "route"
                : "external",
          external: a.target === "_blank",
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      });

      const media = root.querySelectorAll("img,video,iframe,canvas,svg[data-figure]").length;

      results[block.key] = {
        role: block.role,
        textNodes,
        claimNodes: claims.length,
        claimSentences: claims.reduce((s, c) => s + c.sentences, 0),
        claimChars: claims.reduce((s, c) => s + c.chars, 0),
        proofLinks: anchors.filter((a) => a.kind !== "mailto").length,
        anchors,
        media,
        claims: claims.map((c) => ({ tag: c.tag, chars: c.chars, sentences: c.sentences, text: c.text })),
      };
    }

    return results;
  }, BLOCKS);
}

// D-Q2b: follow each in-page anchor of the zone and record where we land.
//
// The hash assignment and the measurement are two separate evaluates on
// purpose: a hash change under a router can destroy the execution context, and
// an evaluate that straddles it fails with "Execution context was destroyed"
// rather than returning a wrong number. Splitting them keeps the measurement
// honest instead of merely quiet.
async function followAnchors(page, hrefs) {
  const out = [];
  for (const href of hrefs) {
    const id = href.slice(1);
    /* eslint-disable no-await-in-loop */
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    const before = await page.evaluate(() => ({
      y: window.scrollY,
      exists: false,
    }));
    const exists = await page.evaluate((i) => Boolean(document.getElementById(i)), id);
    if (!exists) {
      out.push({ id, exists: false });
      continue;
    }
    await page.evaluate((i) => {
      window.location.hash = `#${i}`;
    }, id);
    await page.waitForTimeout(1100);
    const landed = await page.evaluate(
      ({ i, y0 }) => {
        const target = document.getElementById(i);
        if (!target) return { id: i, exists: false };
        const r = target.getBoundingClientRect();
        const vh = window.innerHeight;
        // Reading band: the part of the viewport a visitor is actually looking
        // at. Same 10%-90% predicate as the motion probe (cycle 022 lesson:
        // two probes must not hold two definitions of "on screen").
        const bandTop = vh * 0.1;
        const bandBottom = vh * 0.9;
        const { effectiveOpacity } = window.__probe;
        const texts = [...target.querySelectorAll("h1,h2,h3,p,li,span")].filter(
          (el) => el.textContent.trim().length > 3,
        );
        const painted = texts.filter((el) => effectiveOpacity(el) > 0.98).length;
        // A sticky-stacked slide can be geometrically "at the top" while the
        // visitor sees the slide stacked over it: measure what is on top of the
        // target's own centre, not just where its box is.
        const cx = Math.min(Math.max(r.left + r.width / 2, 1), window.innerWidth - 1);
        const cy = Math.min(Math.max(r.top + 40, 1), vh - 1);
        const hit = document.elementFromPoint(cx, cy);
        const covered = hit ? !target.contains(hit) && hit !== target : null;
        return {
          id: i,
          exists: true,
          scrollMoved: Math.round(Math.abs(window.scrollY - y0)),
          top: Math.round(r.top),
          height: Math.round(r.height),
          inBand: r.top < bandBottom && r.bottom > bandTop,
          topInBand: r.top >= bandTop - 1 && r.top <= bandBottom,
          covered,
          coveredBy: covered && hit ? `${hit.tagName.toLowerCase()}.${String(hit.className).slice(0, 40)}` : null,
          textNodes: texts.length,
          paintedNodes: painted,
          paintedRatio: texts.length ? +(painted / texts.length).toFixed(2) : null,
          offscreenAbove: r.bottom < bandTop,
          offscreenBelow: r.top > bandBottom,
        };
      },
      { i: id, y0: before.y },
    );
    out.push(landed);
    /* eslint-enable no-await-in-loop */
  }
  return out;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const report = { baseUrl: BASE_URL, tag: TAG, runs: [] };

  for (const viewport of VIEWPORTS) {
    for (const lang of LANGS) {
      const label = `${viewport.name}_${lang}`;
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
      });
      await context.addInitScript({ path: COLOR_LIB });
      await context.addInitScript(([l]) => {
        try {
          window.localStorage.setItem("portfolio-language", l);
        } catch {
          /* ignore */
        }
      }, [lang]);

      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

      try {
        await withTimeout(page.goto(BASE_URL, { waitUntil: "networkidle" }), 45000, `goto ${label}`);
        // Walk the page once so every reveal has fired, the way a visitor does.
        await page.evaluate(async () => {
          const step = 400;
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            // eslint-disable-next-line no-await-in-loop
            await new Promise((r) => setTimeout(r, 60));
          }
          window.scrollTo(0, document.body.scrollHeight);
          await new Promise((r) => setTimeout(r, 700));
        });

        const inv = await withTimeout(inventory(page), 30000, `inventory ${label}`);

        const zoneHrefs = new Set();
        for (const [key, data] of Object.entries(inv)) {
          if (data.missing || data.role !== "zone") continue;
          for (const a of data.anchors || []) {
            if (a.kind === "in-page") zoneHrefs.add(a.href);
          }
          void key;
        }
        const landings = await withTimeout(
          followAnchors(page, [...zoneHrefs]),
          60000,
          `anchors ${label}`,
        );

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth + 1,
        );

        report.runs.push({ label, viewport: viewport.name, lang, inventory: inv, landings, overflow, errors });
        const zone = Object.entries(inv).filter(([, d]) => d.role === "zone");
        console.log(
          `\n${label}  overflow:${overflow}  errors:${errors.length}`,
        );
        for (const [key, d] of Object.entries(inv)) {
          console.log(
            `  ${key.padEnd(15)} role:${(d.role || "?").padEnd(9)} textNodes:${String(d.textNodes).padStart(4)}  claims:${String(d.claimNodes).padStart(3)} (${String(d.claimSentences).padStart(3)} sentences, ${String(d.claimChars).padStart(5)} chars)  proofLinks:${String(d.proofLinks).padStart(2)}  media:${d.media}`,
          );
        }
        void zone;
        for (const l of landings) {
          console.log(
            `  jump #${l.id}: exists=${l.exists} inBand=${l.inBand} top=${l.top} painted=${l.paintedNodes}/${l.textNodes} (${l.paintedRatio})`,
          );
        }
      } catch (err) {
        console.log(`  !! ${label}: ${err.message}`);
        report.runs.push({ label, error: String(err) });
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();
  await writeFile(path.join(OUT_DIR, "evidence.json"), JSON.stringify(report, null, 2), "utf8");
  console.log(`\nreport -> ${path.relative(ROOT, path.join(OUT_DIR, "evidence.json"))}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
