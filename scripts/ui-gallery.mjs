#!/usr/bin/env node
/**
 * Générateur de la galerie AVANT/APRÈS de la boucle UI (voir MISSION-UI.md §7bis).
 *
 * Pour chaque chantier livré, capture la même section à deux révisions git et aux
 * viewports 390 et 1440, compresse en .webp, puis réécrit docs/ui-loop/GALERIE.md
 * en ordre antéchronologique.
 *
 * L'état AVANT est capturé sur un worktree git détaché à la révision antérieure :
 * c'est la seule façon d'obtenir une comparaison honnête. On ne touche jamais à
 * l'arbre de travail courant.
 *
 * Usage :
 *   node scripts/ui-gallery.mjs --cycle=015 --before=1ef0c01 \
 *     --sections=about --label="Identité visuelle du bloc Analytical profile" \
 *     --why="Le bloc n'avait aucune hiérarchie propre et se confondait avec la section suivante."
 *
 * Options :
 *   --cycle=NNN        numéro du cycle (obligatoire)
 *   --before=<ref>     révision git de l'état AVANT (obligatoire)
 *   --after=<ref>      révision de l'état APRÈS (défaut : l'arbre de travail courant)
 *   --sections=a,b     cibles à capturer (défaut : about). Une cible est un id
 *                      (`about`), un sélecteur CSS (`.site-footer`), ou
 *                      `viewport:<cible>[@<y>]` pour capturer le viewport entier
 *                      avec la cible calée à <y> px du haut — seule façon de
 *                      montrer un chantier portant sur un overlay `fixed`.
 *   --label="..."      intitulé du chantier (défaut : dérivé du sujet du dernier commit)
 *   --why="..."        légende d'une ligne (obligatoire)
 *   --slug=...         nom de fichier (défaut : dérivé du label)
 *   --lang=fr|en       langue des captures (défaut : en)
 *   --commits=a,b      hashes courts affichés sous le bloc (défaut : before..after)
 *   --prescroll=no     n'effectue pas le passage de scroll de préchauffage. Ce
 *                      passage déclenche les reveals `once: true` ; il est
 *                      indispensable pour une capture au repos, et rédhibitoire
 *                      pour un chantier dont la preuve EST l'animation en cours.
 *   --settle=<ms>      délai avant la capture, une fois la cible calée
 *                      (défaut 500). Avec --prescroll=no, c'est l'instant de
 *                      l'entrée que l'on fige.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { spawn, execSync } from "node:child_process";
import { mkdir, writeFile, readFile, rm, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const idx = arg.indexOf("=");
    if (idx === -1) return [arg.replace(/^--/, ""), true];
    return [arg.slice(2, idx), arg.slice(idx + 1)];
  }),
);

const CYCLE = String(args.cycle ?? "").padStart(3, "0");
const BEFORE_REF = args.before;
const AFTER_REF = args.after ?? null; // null = arbre de travail courant
const SECTIONS = String(args.sections ?? "about").split(",").map((s) => s.trim()).filter(Boolean);
const LANG = args.lang ?? "en";
const WHY = args.why ?? "";
const PRESCROLL = args.prescroll !== "no";
const SETTLE = Number(args.settle ?? 500);

/* 390 and 1440 are the pair MISSION-UI.md §7bis mandates, and the default.
   `--viewports=1024x800,1440` overrides it for the rare chantier whose proof
   lives at a width the mandated pair does not cover — the cycle 020 link
   truncation existed only between 1024 and 1279px, so a 390/1440 pair would
   have shown two identical images and claimed a fix nobody could see. The
   override widens the evidence; it never replaces it with something narrower. */
const DEFAULT_VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "1440", width: 1440, height: 900 },
];
const VIEWPORTS = args.viewports
  ? String(args.viewports)
      .split(",")
      .map((spec) => {
        const [w, h] = spec.trim().split("x");
        return { name: w, width: Number(w), height: Number(h ?? 900) };
      })
  : DEFAULT_VIEWPORTS;

const WEBP_QUALITY = 80;
const WEBP_MAX_WIDTH = 1200;
const SHOTS_ROOT = path.join(ROOT, "docs/ui-loop/shots");
const GALLERY_PATH = path.join(ROOT, "docs/ui-loop/GALERIE.md");
const BUDGET_BYTES = 40 * 1024 * 1024;

const PORT_AFTER = 5191;
const PORT_BEFORE = 5192;

function fail(msg) {
  console.error(`\n[ui-gallery] ${msg}\n`);
  process.exit(1);
}

if (!args.cycle) fail("--cycle=NNN est obligatoire.");
if (!BEFORE_REF) fail("--before=<ref-git> est obligatoire : sans état antérieur, la galerie ment.");
if (!WHY) fail('--why="..." est obligatoire : une capture sans légende n\'explique rien.');

function git(cmd, cwd = ROOT) {
  return execSync(`git ${cmd}`, { cwd, encoding: "utf8" }).trim();
}

function slugify(s) {
  return String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 304) return true;
    } catch {
      /* pas encore prêt */
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Le serveur Vite n'a pas répondu sur ${url} en ${timeoutMs} ms`);
}

function startDevServer(cwd, port) {
  const server = spawn("npx", ["vite", "--port", String(port), "--strictPort"], {
    cwd,
    shell: true,
    stdio: "pipe",
  });
  server.stdout.on("data", () => {});
  server.stderr.on("data", (d) => process.stderr.write(d));
  return server;
}

/**
 * Capture chaque section demandée aux deux viewports, en PNG brut (converti ensuite).
 * Retourne une map { "<sectionId>-<viewport>": <buffer png> }.
 * Une section absente à cette révision est signalée par la valeur null : c'est le cas
 * légitime d'une section créée de zéro, que la galerie doit afficher honnêtement.
 */
async function captureState(baseUrl) {
  const browser = await chromium.launch();
  const out = {};
  try {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();
      await page.addInitScript(
        ([key, value]) => window.localStorage.setItem(key, value),
        ["portfolio-language", LANG],
      );
      await page.goto(baseUrl, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);

      // Un passage de scroll complet déclenche les reveals GSAP/ScrollTrigger, sinon
      // les sections basses sont capturées à l'état initial (opacité 0) et la
      // comparaison devient absurde. L'inverse est vrai pour un chantier dont la
      // preuve est l'entrée elle-même : préchauffer consomme le `once: true` et
      // il ne reste plus rien à comparer — d'où --prescroll=no.
      if (PRESCROLL) {
        const height = await page.evaluate(() => document.body.scrollHeight);
        for (let y = 0; y < height; y += 600) {
          await page.evaluate((yy) => window.scrollTo(0, yy), y);
          await page.waitForTimeout(120);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(400);
      }

      for (const id of SECTIONS) {
        const key = `${id}-${viewport.name}`;

        // "click:<href>" rejoue le seul geste qui peut révéler un chantier de
        // *destination* (une ancre qui atterrit au mauvais endroit) : une
        // capture statique de la section ne changerait pas d'une révision à
        // l'autre puisque le bug ne vit pas dans le rendu de la section, mais
        // dans la résolution du clic. On se place en bas de page (le cas réel
        // du cycle 023 : on vérifie une preuve après avoir lu toute la page),
        // on clique le vrai lien, on attend que le scroll se stabilise, puis on
        // capture le viewport — honnête aux deux révisions, buggé à l'ancienne,
        // corrigé à la nouvelle, sans aucune retouche.
        if (id.startsWith("click:")) {
          const href = id.slice("click:".length);
          const height = await page.evaluate(() => document.body.scrollHeight);
          await page.evaluate((y) => window.scrollTo(0, y), height);
          await page.waitForTimeout(400);
          const link = page.locator(`a[href="${href}"]`).first();
          if ((await link.count()) === 0) {
            out[key] = null;
            continue;
          }
          await link.click();
          // Attend que scrollY cesse de bouger (scroll natif ou smooth) avant de
          // figer la capture, plutôt qu'un délai fixe qui figerait un scroll
          // encore en vol.
          let last = -1;
          for (let i = 0; i < 20; i += 1) {
            await page.waitForTimeout(150);
            const y = await page.evaluate(() => window.scrollY);
            if (y === last) break;
            last = y;
          }
          out[key] = await page.screenshot();
          continue;
        }

        // "viewport:<id>" cadre le viewport calé sur le haut de la section, au
        // lieu de l'élément seul : c'est le seul moyen de montrer un chantier qui
        // porte sur un overlay `position: fixed` (le sélecteur de langue), qui par
        // définition n'appartient à aucune section.
        const asViewport = id.startsWith("viewport:");
        // "viewport:<cible>@<y>" cale en plus la cible à <y> px du haut du
        // viewport. Un simple offset de scroll ne suffit pas : entre deux
        // révisions la mise en page bouge, et la même valeur de scroll ne
        // montre plus le même contenu — la paire AVANT/APRÈS ne comparerait
        // alors plus rien. On s'accroche donc à un élément, pas à un pixel.
        const spec = asViewport ? id.slice("viewport:".length) : id;
        const at = spec.lastIndexOf("@");
        const targetId = at === -1 ? spec : spec.slice(0, at);
        const anchorTop = at === -1 ? 0 : Number(spec.slice(at + 1));
        // Un id par défaut, mais un sélecteur brut s'il commence par "." : le
        // footer n'a pas d'id et reste un chantier à documenter comme un autre.
        const locator = page
          .locator(targetId.startsWith(".") ? targetId : `#${targetId}`)
          .first();
        if ((await locator.count()) === 0) {
          out[key] = null;
          continue;
        }
        await locator.scrollIntoViewIfNeeded();
        await page.waitForTimeout(PRESCROLL ? 500 : 0);
        try {
          if (asViewport) {
            const box = await locator.boundingBox();
            if (box) {
              await page.evaluate(
                (y) => window.scrollTo(0, y),
                (await page.evaluate(() => window.scrollY)) + box.y - anchorTop,
              );
              await page.waitForTimeout(SETTLE);
            }
            out[key] = await page.screenshot();
          } else {
            out[key] = await locator.screenshot();
          }
        } catch {
          out[key] = null;
        }
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }
  return out;
}

async function withServer(cwd, port, fn) {
  const server = startDevServer(cwd, port);
  try {
    await waitForServer(`http://localhost:${port}`);
    return await fn(`http://localhost:${port}`);
  } finally {
    // Sur Windows, server.kill() ne tue que le shell npx : l'enfant node survit et
    // garde le port, ce qui fait échouer le serveur suivant (--strictPort).
    // taskkill /T descend dans l'arbre de processus.
    if (process.platform === "win32" && server.pid) {
      try {
        execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: "ignore" });
      } catch {
        /* déjà mort */
      }
    } else {
      server.kill();
    }
    await new Promise((r) => setTimeout(r, 800));
  }
}

async function toWebp(buffer, destPath) {
  const image = sharp(buffer);
  const meta = await image.metadata();
  const pipeline = meta.width && meta.width > WEBP_MAX_WIDTH
    ? image.resize({ width: WEBP_MAX_WIDTH })
    : image;
  await pipeline.webp({ quality: WEBP_QUALITY }).toFile(destPath);
  const { size } = await stat(destPath);
  return size;
}

async function dirSize(dir) {
  if (!existsSync(dir)) return 0;
  let total = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    total += entry.isDirectory() ? await dirSize(p) : (await stat(p)).size;
  }
  return total;
}

async function main() {
  const label = args.label ?? git(`log -1 --format=%s`);
  const slug = args.slug ?? slugify(label);
  const cycleDir = path.join(SHOTS_ROOT, `cycle-${CYCLE}`);
  await mkdir(cycleDir, { recursive: true });

  const afterLabel = AFTER_REF ?? "arbre de travail courant";
  console.log(`[ui-gallery] cycle ${CYCLE} · ${label}`);
  console.log(`[ui-gallery] AVANT = ${BEFORE_REF}   APRÈS = ${afterLabel}`);
  console.log(`[ui-gallery] sections = ${SECTIONS.join(", ")}   lang = ${LANG}`);

  // ---- APRÈS : arbre courant, ou worktree si une révision explicite est demandée ----
  let afterShots;
  let afterWorktree = null;
  if (AFTER_REF) {
    afterWorktree = await makeWorktree(AFTER_REF, "after");
    afterShots = await withServer(afterWorktree, PORT_AFTER, captureState);
  } else {
    afterShots = await withServer(ROOT, PORT_AFTER, captureState);
  }

  // ---- AVANT : worktree détaché sur la révision antérieure ----
  const beforeWorktree = await makeWorktree(BEFORE_REF, "before");
  let beforeShots;
  try {
    beforeShots = await withServer(beforeWorktree, PORT_BEFORE, captureState);
  } finally {
    await dropWorktree(beforeWorktree);
    if (afterWorktree) await dropWorktree(afterWorktree);
  }

  // ---- Conversion .webp, groupée par section ----
  // Une section = un chantier = un bloc (MISSION-UI.md §7bis). Regrouper plusieurs
  // sections dans un seul tableau ferait disparaître toutes les paires sauf la
  // dernière : le tableau n'a qu'une cellule AVANT et une cellule APRÈS par ligne.
  const perSection = [];
  const regeneratedBases = [];
  for (const id of SECTIONS) {
    // `id` peut être `viewport:.selecteur@40` — `:`, `.` et `@` sont interdits ou
    // ambigus dans un nom de fichier Windows (NTFS refuse `:` net). `slugify()`
    // neutralise ça pour le nom de fichier ; `id` lui-même reste intact pour la
    // résolution de l'élément (captureState) et la légende Markdown.
    const base = SECTIONS.length > 1 ? `${slug}-${slugify(id)}` : slug;
    regeneratedBases.push(base);
    const rows = [];

    for (const viewport of VIEWPORTS) {
      const key = `${id}-${viewport.name}`;
      const row = { viewport: viewport.name, avant: null, apres: null };

      if (beforeShots[key]) {
        const rel = `shots/cycle-${CYCLE}/${base}-${viewport.name}-avant.webp`;
        const size = await toWebp(beforeShots[key], path.join(ROOT, "docs/ui-loop", rel));
        row.avant = rel;
        console.log(`  ✓ ${rel} (${Math.round(size / 1024)} Ko)`);
      }
      if (afterShots[key]) {
        const rel = `shots/cycle-${CYCLE}/${base}-${viewport.name}-apres.webp`;
        const size = await toWebp(afterShots[key], path.join(ROOT, "docs/ui-loop", rel));
        row.apres = rel;
        console.log(`  ✓ ${rel} (${Math.round(size / 1024)} Ko)`);
      }
      rows.push(row);
    }
    perSection.push({ id, rows });
  }

  if (!perSection.some((s) => s.rows.some((r) => r.apres))) {
    fail(`Aucune capture APRÈS produite. Les sections ${SECTIONS.join(", ")} existent-elles (#id) ?`);
  }

  // ---- Bloc markdown ----
  const commits = args.commits
    ? String(args.commits).split(",").map((c) => c.trim())
    : git(`log --format=%h ${BEFORE_REF}..${AFTER_REF ?? "HEAD"}`).split("\n").filter(Boolean);

  const date = new Date().toISOString().slice(0, 10);
  const cell = (rel, alt) =>
    rel ? `![${alt}](${rel})` : "— (section nouvelle, pas d'état antérieur)";

  const commitLine = commits.length
    ? commits.map((c) => `\`${c}\``).join(" · ")
    : "_(aucun commit)_";

  const block = perSection
    .map(({ id, rows }) =>
      [
        `## Cycle ${CYCLE} — ${date} · ${label}${perSection.length > 1 ? ` — section \`#${id}\`` : ""}`,
        ``,
        `> ${WHY}`,
        ``,
        `|          | AVANT | APRÈS |`,
        `| -------- | ----- | ----- |`,
        ...rows.map(
          (r) =>
            `| **${r.viewport}** | ${cell(r.avant, `avant ${r.viewport}`)} | ${cell(r.apres, `après ${r.viewport}`)} |`,
        ),
        ``,
        commitLine,
        ``,
      ].join("\n"),
    )
    .join("\n");

  // ---- Écriture antéchronologique ----
  const header = [
    `# Galerie AVANT / APRÈS — boucle UI`,
    ``,
    `> Ordre antéchronologique : le chantier le plus récent est en haut.`,
    `> Chaque paire est capturée sur les révisions git réelles (voir MISSION-UI.md §7bis).`,
    `> Captures : viewports 390 et 1440 par défaut — un bloc peut en indiquer d'autres quand la preuve du chantier vit à une largeur que cette paire ne couvre pas. \`.webp\` qualité ${WEBP_QUALITY}, largeur max ${WEBP_MAX_WIDTH} px.`,
    ``,
    `---`,
    ``,
  ].join("\n");

  let previous = [];
  if (existsSync(GALLERY_PATH)) {
    const raw = await readFile(GALLERY_PATH, "utf8");
    // On repère le premier bloc de cycle plutôt qu'un séparateur d'en-tête : toute
    // dérive de format de l'en-tête effacerait sinon silencieusement l'historique.
    const idx = raw.search(/^## Cycle /m);
    const body = idx === -1 ? "" : raw.slice(idx);
    previous = body
      .split(/(?=^## Cycle )/m)
      .map((b) => b.trim())
      .filter(Boolean)
      // Un cycle peut livrer jusqu'à 3 chantiers, donc porter 3 blocs
      // (MISSION-UI.md §7bis : un bloc par chantier, pas par cycle). On ne
      // remplace donc que les blocs du même cycle qui montrent **le même**
      // chantier — repéré par le préfixe de fichier de ses captures — sinon
      // chaque run effacerait les chantiers documentés par le précédent.
      .filter(
        (b) =>
          !b.startsWith(`## Cycle ${CYCLE} `) ||
          !regeneratedBases.some((base) =>
            b.includes(`shots/cycle-${CYCLE}/${base}-`),
          ),
      );
  }

  // Tri antéchronologique par numéro de cycle : la galerie reste correcte même si
  // les cycles sont générés dans le désordre (rattrapage d'un cycle ancien).
  const cycleOf = (b) => {
    const m = b.match(/^## Cycle (\d+)/);
    return m ? Number(m[1]) : -1;
  };
  const all = [...block.split(/(?=^## Cycle )/m).map((b) => b.trim()).filter(Boolean), ...previous]
    .sort((a, b) => cycleOf(b) - cycleOf(a));

  await writeFile(GALLERY_PATH, `${header}${all.join("\n\n")}`.trimEnd() + "\n", "utf8");
  console.log(`\n[ui-gallery] docs/ui-loop/GALERIE.md mis à jour.`);

  const total = await dirSize(SHOTS_ROOT);
  const mb = (total / 1024 / 1024).toFixed(1);
  console.log(`[ui-gallery] poids de docs/ui-loop/shots/ : ${mb} Mo`);
  if (total > BUDGET_BYTES) {
    console.warn(
      `[ui-gallery] ⚠ budget de 40 Mo dépassé — élague les cycles les plus anciens (MISSION-UI.md §7bis).`,
    );
  }
}

async function makeWorktree(ref, tag) {
  const dir = path.join(os.tmpdir(), `ui-gallery-${tag}-${Date.now()}`);
  console.log(`[ui-gallery] worktree ${tag} (${ref}) → ${dir}`);
  git(`worktree add --detach "${dir}" ${ref}`);

  // Vite a besoin des dépendances ; on réutilise celles du repo plutôt que de
  // réinstaller (jonction sous Windows, lien symbolique ailleurs).
  const link = path.join(dir, "node_modules");
  const target = path.join(ROOT, "node_modules");
  try {
    if (process.platform === "win32") {
      execSync(`cmd /c mklink /J "${link}" "${target}"`, { stdio: "ignore" });
    } else {
      execSync(`ln -s "${target}" "${link}"`, { stdio: "ignore" });
    }
  } catch (err) {
    fail(`Impossible de lier node_modules dans le worktree : ${err.message}`);
  }
  return dir;
}

async function dropWorktree(dir) {
  try {
    // La jonction doit partir en premier, sinon git supprimerait node_modules du repo.
    const link = path.join(dir, "node_modules");
    if (existsSync(link)) {
      if (process.platform === "win32") execSync(`cmd /c rmdir "${link}"`, { stdio: "ignore" });
      else execSync(`rm "${link}"`, { stdio: "ignore" });
    }
    git(`worktree remove --force "${dir}"`);
  } catch {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
    try {
      git("worktree prune");
    } catch {
      /* best effort */
    }
  }
}

main().catch((err) => {
  console.error(err);
  try {
    git("worktree prune");
  } catch {
    /* best effort */
  }
  process.exitCode = 1;
});
