# Backlog — Boucle d'amélioration continue UI

> Alimenté et réordonné à chaque cycle (Phase 4 — PRIORISER). Un chantier
> terminé est déplacé dans la section "Terminé" avec le cycle qui l'a livré,
> jamais supprimé silencieusement.

Ordre de priorité imposé par MISSION-UI.md §2 : P0 build/régression/contraste
> P0 zone prioritaire (§3) > P1 nouveaux projets (§4) > P1 démos existantes
(§5) > P2 reste du site.

---

## P0 — Zone prioritaire / contraste / régression

- [x] **AnimatedLetter sans variante reduced-motion** (`src/components/PortfolioMotion.tsx`).
  Corrigé cycle 002 (commit `1a756ce`) : rendu en opacité 1 immédiate sous
  `useReducedMotion()`, bypass du `useTransform`.
- [x] **Fenêtre d'animation du titre "Analytical profile" trop courte face à la
  vitesse de scroll réelle** (`WordsPullUpMultiStyle`). Corrigé cycle 002
  (commit `1a756ce`) : marge `useInView` avancée à 240px, délai/durée par mot
  réduits (0.08s→0.045s, 0.7s→0.55s).
- [x] **Fin de page abrupte : aucun footer/point de clôture** après
  `ContactSection`. Corrigé cycle 002 (commits `85140a2`, `10eacfb`) :
  `<SiteFooter>` avec identité propre (mention, retour en haut, liens),
  espace mort avant le footer resserré.
- [x] **Contraste insuffisant sur le bouton de langue inactif**
  (`.language-toggle-btn`, `src/index.css:159-176`). Corrigé cycle 002
  (commit `00691e7`) : opacité 0.45→0.58 (repos), 0.75→0.82 (hover),
  contraste calculé ≥ 5.4:1 sur fond noir. À reconfirmer par axe-core au
  prochain run complet (violation attendue résolue).
- [x] **Bloc "Analytical profile" visuellement plat, sans identité propre**
  (`.about-card`, fond uni `#101010` sans aucune texture, contrairement au
  `.contact-panel` voisin qui a déjà un radial-gradient). Réponse directe à
  la question MISSION-UI.md §3 "le bloc a-t-il une raison d'exister
  visuellement, ou est-ce un paragraphe posé ?" — c'était un paragraphe posé.
  Corrigé cycle 015 (commit `4d289d4`) : halo radial discret au token
  `--pc-amber-dim` déjà utilisé ailleurs, en haut à gauche de la carte, sans
  toucher au texte ni au contraste.

- [x] **Sélecteur de langue flottant imprimé sur le texte des cartes**
  (`.language-toggle`, `position: fixed` sans aucun fond). Sur 390px les
  `.capability-card` occupent toute la largeur : "EN · FR" se superposait
  littéralement aux items de carte — deux textes clairs l'un sur l'autre, le
  rapport de contraste n'était pas seulement < 4.5:1, il n'était pas défini
  (garde-fou §6 enfreint). Corrigé cycle 016 (commit `264d58e`) : voile
  radial `--overlay-scrim` (nouveau token) sous le contrôle, sans bord ni
  arête, le parti "typographie nue" documenté dans `index.css` est conservé.

- [x] **`.city-contact` (CTA "Contact" du nav) : texte blanc sur fond clair au
  survol, ~1.3:1** (cycle 040). Ni le balayage au repos (cycle 039) ni
  axe-core ne peuvent voir un défaut qui n'existe qu'à l'état `:hover` — angle
  mort confirmé identique à celui documenté cycle 021 pour l'état de repos.
  `scripts/ui-contrast-sweep.mjs` étendu avec `--pseudo=hover,focus-visible`
  (force l'état via CDP `CSS.forcePseudoState` élément par élément, un
  balayage complet 2 routes × 4 viewports × 2 langues × 2 états prend
  ~11 min). Premier run pleine couverture : 1 violation, exactement
  `.city-contact` héritant de la règle générique `.city-nav a:hover { color:
  #fff }` alors que son fond (`#e1e0cc`) est clair, pas sombre comme le reste
  du nav. Corrigé (commit `c4a6e9b`) : `.city-nav a:hover:not(.city-contact)`.
  Deuxième run après correctif : **0 violation** sur les 32 combinaisons
  (16 repos + 16 pseudo-état). `scripts/ui-gallery.mjs` gagne en parallèle un
  mode `hover:<sélecteur>` (commit `f124250`) — aucun mode existant ne
  pouvait produire une paire AVANT/APRÈS honnête pour un défaut qui ne se
  voit qu'au survol.

- [x] **Carte projet 06 recouvrait les CTA de `.home-projects-footer` sous
  1024px, contenu inatteignable au clic** (cycle 058, trouvé en revalidant
  visuellement le §4 avant de chercher un nouveau chantier). `.home-project-step`
  posait `top`/`z-index` inline sans condition alors que ces propriétés ne
  prennent sens qu'en `position: sticky` (cascade scrollytelling ≥1024px) ; en
  dessous, l'élément reste `position: relative`, où `top` décale la boîte
  peinte sans réserver l'espace — la carte 06 (dernier index, plus grand
  décalage) peignait par-dessus "Discover the personal layer"/"Contact Axel".
  Confirmé par clic Playwright : timeout avant correctif, succès après.
  Corrigé commit `00cbb76` : offset exposé en `--step-top`/`--step-z`,
  consommé uniquement dans le media query `≥1024px` de `index.css`. Run
  complet `ui-audit.mjs` après correctif : 0 violation axe-core, 0 débordement,
  10/10 combinaisons. Galerie cycle 058.

- [x] **`ProjectDetailModal` : onglet actif persistant entre deux projets
  différents, panneau vide et 0 onglet sélectionné** (cycle 062, trouvé en
  auditant "Vers l'Élysée" sous rotation D — cherchait un onglet Links pour
  vérifier si la série LinkedIn "Data Notebook" était bien liée, a exposé le
  bug en fermant/rouvrant deux projets différents). `activeTab` (`useState`)
  n'était jamais réinitialisé quand `project` changeait, car
  `ProjectDetailModal` est une instance React unique sans `key` — repro
  Playwright déterministe : ouvrir projet 04, onglet "Links", fermer, ouvrir
  projet 06 (sans onglet Links/Outputs) → **0 onglet `aria-selected`, panneau
  `#project-detail-content` à 0 caractère**. Contenu invisible = P0 au sens
  MISSION-UI.md §2 Phase 4. Corrigé commit `2006dcb` : `useEffect(() =>
  setActiveTab("overview"), [project?.id])`. Vérifié : `tsc -b` + `vite build`
  verts, repro rejouée après correctif (EN 1440, FR 1440, reduced-motion
  on/off) → panneau non vide, onglet "Overview"/"Vue d'ensemble" sélectionné
  dans les 4 cas. Run `ui-audit.mjs` partiel (4/10 combinaisons avant qu'un
  navigateur reste bloqué ~15 min sur une capture — tooling à part, voir
  entrée dédiée ci-dessous) : 0 débordement, 0 erreur console/page, seule
  violation axe-core = `.opening-primary` déjà documentée comme flake
  intermittent (cycles 059-061), sans rapport avec ce correctif. Dérogation
  au plafond de retouche écrite dans `MISSION-UI.md` §6 (`project-detail-modal`
  passe 3/3 → 4/3, gelée).
- [x] **`ui-audit.mjs` : un navigateur peut rester bloqué ~15 min sur une
  capture sans crasher ni avancer** (cycle 062, corrigé cycle 063). Contrairement
  au crash Chromium documenté et corrigé cycle 027 (`Target crashed`, mémoire),
  ce blocage ne levait aucune erreur : le process restait vivant, `report.json`
  n'avançait plus, jusqu'à interruption manuelle (`Stop-Process`). Corrigé
  (commit `2b15a30`) : `capturePageWithTimeout()` fait courir `capturePage()`
  contre un timeout dur de 90s (`Promise.race`), ferme de force le navigateur
  de cette combinaison précise si le délai est dépassé, et logue un flake au
  lieu de bloquer tout le run — symétrique à la tolérance déjà en place pour
  les crashs (cycle 027). Vérifié : deux runs complets 10/10 combinaisons
  après correctif (cycle 063), aucun blocage, **0 violation axe-core, 0
  débordement horizontal** sur les deux runs.
- [x] **`ui-audit.mjs` : `browser.close()` sautée si une erreur survient avant
  la fin de `capturePage()`** (cycle 063). Le correctif précédent (timeout
  90s) faisait toujours courir `browser.close()` comme instruction simple en
  fin de fonction : toute erreur levée avant cette ligne (le `page.screenshot()`
  qui a expiré et déclenché le constat ci-dessus, un flake, pas un bug du
  site) la sautait, laissant un Chromium orphelin qui garde un pipe ouvert
  vers le process `node` du script — celui-ci ne se termine alors jamais,
  même après avoir affiché "Audit complete". Corrigé commit `e7c6de9` :
  `capturePage()` isole désormais `launch()`/`close()` dans un `try/finally`,
  la logique de capture déplacée dans `runCapture()`. Vérifié : `node --check`
  et `npm run build` verts ; aucun run complet rejoué après ce correctif
  précis (le comportement du chemin de succès est inchangé — seul le chemin
  d'erreur, difficile à déclencher à la demande, est concerné).
- [ ] **Accumulation de process `node.exe` orphelins sur la machine** (repéré
  cycle 063, hors périmètre de ce cycle) : `tasklist` en dénombre **33**
  simultanés au début du cycle, dont au moins 3 serveurs `vite`/`preview` en
  écoute (ports 5184, 5195, 5199) hérités de sessions antérieures — aucun créé
  par ce cycle, qui n'a lancé aucun serveur de dev. Déjà noté cycle 062 sans
  action (même principe : ne pas toucher un état que le cycle courant n'a pas
  produit, faute de certitude que rien d'autre ne l'utilise). **P2 —
  outillage** : creuser si `scripts/ui-audit.mjs` ou une routine de cycle
  antérieure spawn un serveur `vite` sans jamais le tuer sur un chemin
  d'erreur (même classe de bug que le `browser.close()` ci-dessus, côté
  process serveur plutôt que navigateur) ; à défaut, documenter une commande
  de nettoyage manuel en début de cycle plutôt que de laisser croître le
  nombre indéfiniment.

## P1 — Intégration des nouveaux projets (MISSION-UI.md §4)

- [x] **Vers l'Élysée** — carte projet + page détail + section démo (iframe
  live vers `political-destiny.vercel.app`). Livré cycle 024 (commit
  `6e66d36`) : carte `04` dans `.home-project-*`, case study complet dans
  `ProjectDetailModal`, démo via le nouveau composant `LiveDemoEmbed`
  (montage au clic uniquement, poster + repli lien externe). Aucun lien
  repo (Q2 tranchée). En-têtes revérifiés au cycle 024, toujours `200 OK`
  sans `X-Frame-Options` ni `frame-ancestors`.
- [x] **Ombrair** — carte projet + page détail + section démo (iframe live vers
  `ombrair.vercel.app`, avec mise en avant de l'affichage 3D produit). Livré
  cycle 025 (commit `fd39663`) : carte `05` dans `.home-project-*`, case
  study complet dans `ProjectDetailModal`, démo via `LiveDemoEmbed` (poster
  capturé sur la page produit du capteur pour montrer le visualiseur 3D,
  pas seulement le décrire). Angle vitesse d'exécution / pilotage agentique
  et caractère fictif explicite, ce dernier confirmé par le texte du site
  déployé lui-même (page `/a-propos`). Aucun lien repo (Q3 tranchée).
  En-têtes revérifiés au cycle 025, toujours `200 OK` sans en-tête bloquant.
- [x] **Analyse vidéo football (introduction)** — section d'introduction
  uniquement, sans lien code/démo live (projet non public). Livré cycle 026
  (commit `7119fcf`) : carte `06` dans `.home-project-*`, case study 4
  sections, carousel dédié à 7 slides avec 3 composants de schémas abstraits
  reconstruits (flux du pipeline, calibration terrain, piste de
  ré-identification). Emplacement documenté (commentaire « RESERVED SLOT »
  dans `src/data/projects/video-analysis.ts`) pour brancher les vrais exports
  du pipeline plus tard. **Le §4 de MISSION-UI.md est intégralement traité**
  (Vers l'Élysée cycle 024, Ombrair cycle 025, Analyse vidéo football cycle
  026) — cette case n'avait pas été cochée au moment du cycle 026 ; corrigé
  cycle 027 en revérifiant le code réel (`src/data/projects.ts` id `06`,
  branchement `OnePage.tsx`) plutôt qu'en faisant confiance au seul journal.

## P1 — Démos des projets existants (MISSION-UI.md §5)

- [x] Football Data Pipeline — carrousel de captures annotées (déjà conforme).
- [x] Retirement Sustainability Model — carrousel + captures statiques + PDF
  (déjà conforme).
- [x] JobTrackr — vérifié cycle 003 : `curl -I
  https://jobtrackr-lake.vercel.app` → `X-Frame-Options: DENY`. L'iframe est
  bloquée par l'application elle-même (protection anti-clickjacking côté
  JobTrackr, hors périmètre de ce repo) — conformément à la règle §5 ("si
  l'iframe est bloquée, descends d'un niveau"), on reste au carrousel de
  captures annotées déjà en place (format 3). Décision définitive, rien à
  coder.
- [x] **`LiveDemoEmbed` (Vers l'Élysée, Ombrair) : le poster de démo débordait
  du cadre et fusionnait visuellement avec sa légende** — trouvé cycle 051
  par lecture visuelle d'une capture `mobile-390_en` du run `ui-audit.mjs`
  (`.demo-embed-poster` héritait `min-height: 280px` de la règle générique
  `.home-project-proof img`, plus grand que le cadre flex réel ~225px sur
  mobile ; `.demo-embed-frame` en `overflow: visible` laissait les ~55px en
  trop déborder tel quel dans `.demo-embed-caption` en dessous, visible
  uniquement sur Vers l'Élysée car son poster est un vrai screenshot de page
  avec un bouton "Comment fonctionne la simulation ?" qui tombe pile dans la
  zone débordée). Corrigé cycle 051 (commit `60b29ae`) : `overflow: hidden`
  sur `.demo-embed-frame`, spécificité relevée sur le sélecteur du poster
  pour que son `min-height: 0` gagne, et un palier quasi opaque ajouté au
  dégradé de `.demo-embed-launch` en défense supplémentaire. Vérifié aux 4
  viewports et dans les 2 langues (voir PROGRESS.md cycle 051).
- [x] **`LiveDemoEmbed` (Vers l'Élysée, Ombrair) : l'iframe mobile ne recevait
  que 27%/25% de la hauteur du viewport** (cycle 061, rotation E appliquée
  aux deux chantiers §4 déployés, jamais mesurée sous cet angle malgré le
  correctif cycle 051 sur le même composant). `.home-project-proof--embed`
  avait un `min-height: 360px` sous 1024px, mais `.demo-embed-caption` porte
  une phrase complète qui passe à 3-4 lignes sous ~330px de large — mesuré à
  106-139px de haut selon projet/langue — et `.demo-embed-frame` (`flex: 1 1
  auto`) n'héritait que le reste : 224.8px (Vers l'Élysée) / 208px (Ombrair)
  sur mobile-390, soit 27%/25% d'un viewport iPhone-14. MISSION-UI.md §5
  exige qu'une démo « fonctionne sur mobile » ; un cadre de cette taille pour
  un simulateur jouable ou un visualiseur 3D ne le fait qu'en théorie.
  Corrigé (commit `e28f8e6`) : `min-height` porté à 500px, la légende garde
  le même retour à la ligne mais le cadre gagne 348-365px (35-43% du
  viewport) aux 4 combinaisons projet × langue mesurées. Vérifié : `npm run
  build` vert, `ui-audit.mjs` complet (0 overflow, 0 nouvelle violation
  axe-core, le seul flake `.opening-primary` déjà documenté et sans rapport),
  captures avant/après aux 2 projets × 2 langues, cadre chargé (iframe réel)
  relu à l'œil après correctif. Galerie cycle 061.

## P1 — Crédibilité de la zone "Capabilities"

- [x] Les 4 cartes "capabilities" sont visuellement identiques (mur de blocs,
  AUDIT-2026-09-11 P1-1) et pointaient toutes vers `#contact`. Corrigé cycle
  003 (commit `06314b8`) : lien différencié par carte vers la preuve la plus
  pertinente (BI → `/cv#experience`, Data Engineering → Football Data
  Pipeline, Analytical Projects → Retirement Sustainability Model, Portfolio
  Systems → profil GitHub).
- [x] Vide en bas des cartes (`.capability-card`, `justify-content:
  space-between` sur hauteur de ligne de grille fixe 480px à partir de
  1024px) : la variation de hauteur du vide entre cartes selon la longueur
  du texte reste présente (ex. carte "Business Intelligence" avec un item
  sur 2 lignes vs les 3 autres sur 1 ligne). Non traité cycle 003 — jugé
  mineur une fois le lien différencié en place. L'audit cycle 016 (rotation
  B) a confirmé que c'était gênant et **mesurable** : les quatre titres de
  carte ne partageaient aucune ligne de base (`y = 436/436/445/445` à 1440).
  Corrigé cycle 016 (commit `8c77001`) : rythme interne explicite
  (32/24/16px), carte dimensionnée par son contenu, lien épinglé en bas —
  titres à 101px du haut de carte et liens à 25px du bas sur les quatre
  cartes, aux 4 viewports et dans les 2 langues (mesuré cycle 016).

## P1 — Parcours de conversion

- [x] Ajouter CV au bloc de contact et au footer (`getContactLinks` dans
  `OnePage.tsx`). Corrigé cycle 002 (commit `85140a2`). LinkedIn toujours
  bloqué en attente de l'URL réelle (voir QUESTIONS.md Q1) — case laissée
  ouverte tant que Q1 n'est pas résolue.

## P1 — Whitespace du panneau de contact

- [x] `.contact-panel` (`src/index.css`) : `align-items: end` → `center`.
  Corrigé cycle 002 (commit `85140a2`).

## P2 — Reste du site

- [x] Fichiers `src/sections/About.tsx`, `Contact.tsx`, `Stack.tsx`,
  `Manifeste.tsx`, `FlowProjets.tsx` : premier jet abandonné, non importé
  depuis l'audit d'amorçage (cycle 001). Supprimé cycle 015 (commit `b1c77a5`)
  après confirmation grep exhaustive — largement au-delà des "2 cycles" de
  garde-fou. `Hero.tsx` et `Nav.tsx` du même dossier se sont avérés tout
  aussi morts (non repérés par l'audit initial) et ont été supprimés en même
  temps. Seul `DeepDive.tsx` du dossier `sections/` reste utilisé
  (`App.tsx`, `pages/DeepDivePage.tsx`). Effet mesurable : CSS de prod
  106.68 kB → 94.04 kB.
- [x] **`.capability-card a` mesuré à 42px de haut** (cycle 016) —
  **diagnostic erroné, corrigé cycle 017**. Ce n'était pas un défaut CSS :
  `.card-link` porte `min-height: 44px` depuis le commit `dba2f53`, antérieur
  à la boucle. Les 41.8px relevés valent exactement `44 x 0.95`, c'est-à-dire
  la mesure prise **pendant** l'animation d'entrée `scale: 0.95` de la carte.
  La cause réelle (le scale qui déforme tout le contenu de la carte) est
  traitée cycle 017 (commit `4c7aa53`) ; les 16 liens (4 cartes x 4 viewports
  x 2 langues) mesurent désormais 44.00px **à toutes les positions de scroll
  échantillonnées**, plus seulement au repos. Leçon d'outillage : une mesure
  de géométrie prise pendant un `transform` ne mesure pas le CSS.

- [x] **`.site-footer-links a` : 44px de haut mais 17.7 à 40px de large**
  (mesuré cycle 017 : `CV` 17.7x44, `Email` 31.9x44, `GitHub` 40x44 — identique
  à 390 et 1440, EN et FR). Le cycle 016 a vérifié la **hauteur** de ces liens
  et les a déclarés conformes ; leur largeur n'avait jamais été mesurée. `CV`
  passe même sous le plancher de 24px de WCAG 2.5.8. Corrigé cycle 018 (commit
  `6416659`) : `padding-inline: 0.625rem` + `min-width: 44px` + centrage, et le
  column-gap de la grille ramené à 0 pour ne pas additionner les deux
  espacements. Après (4 viewports x 2 langues, identique partout) : Email
  51.9x44, GitHub 60x44, CV 44x44 ; écart perçu entre les libellés 20 et
  23.1px contre 20 et 20px avant. Typographie inchangée.
- [x] **Kicker de section à 4.52:1** (`.home-section-heading p` /
  `.contact-kicker`, `rgba(225, 224, 204, 0.52)`). Re-mesuré cycle 018 dans la
  page (contraste composité, alpha aplati sur le fond opaque réellement
  hérité) : **4.49:1**, donc **sous** le seuil de 4.5:1 applicable à 11px, et
  pas au-dessus comme le cycle 016 l'avait estimé. Requalifié **P0** à ce
  titre. axe-core ne l'a jamais signalé — 4.49 contre 4.5 tombe dans sa
  tolérance d'arrondi ; c'est exactement pourquoi §6 exige une mesure.
  Corrigé cycle 018 (commit `1cb67ee`) : `0.58` → **5.37 à 5.41:1** mesurés
  sur les trois kickers, la valeur déjà tranchée au cycle 002 pour
  `.language-toggle-btn` dans le même cas de figure.
- [x] **`.contact-kicker` repeint par `.contact-panel p`** (collision de
  spécificité, `index.css:638` vs `index.css:656`). Le kicker de la dernière
  section de la page était rendu en 16px / `rgb(156,163,175)` / `margin-top:
  20px` là où les deux kickers au-dessus sont en 11px /
  `rgba(225,224,204,.52)` / `margin-top: 0` — le `letter-spacing: 0.16em`
  survivait, d'où 2.56px de tracking au lieu de 1.76px. Mesuré cycle 018 aux
  4 viewports dans les 2 langues. Corrigé cycle 018 (commit `b95e3ef`) :
  `.contact-panel p:not(.contact-kicker)`. `#contact` perd 29 à 30px de
  hauteur sur les 10 combinaisons du run d'audit — la marge fantôme plus
  l'écart de corps.

- [x] **`.capability-card` est le bloc de la zone qui réagit le moins à la
  largeur** (rotation E, cycle 019) : padding interne de **24px à tous les
  viewports**, là où `.about-card` va de 64/24 à 112/64 et `.contact-panel` de
  24/24 à 57.6/57.6. **Fermé par la mesure au cycle 020, sans une ligne de
  code** : c'est la *largeur de carte* qu'il fallait mesurer, pas son padding.
  Elle vaut 358 / 352 / **232** / 336 / 388 px à 390 / 768 / 1024 / 1440 / 1920 —
  la carte ne s'élargit pas avec la fenêtre, elle oscille au gré des passages de
  1 à 2 puis 4 colonnes. Un padding qui grandirait avec la fenêtre mangerait la
  carte au lieu de l'aérer : 24px constant est le comportement **juste**.

- [x] **`#contact` et `.site-footer` ont un padding de section figé** (48/56 et
  32/40 à tous les viewports), là où `#about` va de 80 à 112 et `#capabilities`
  de 80 à 96 (rotation E, cycle 019). Sur 1440 la descente de page donnait 112 /
  96 / 48 / 32 : la page se fermait sur **29 %** du souffle avec lequel elle
  s'ouvrait, et l'écart contact→footer valait **89px à 390 comme à 1920** alors
  que tous les écarts au-dessus suivaient la largeur. Tranché au cycle 020
  (commit `4ace013`) comme demandé, sur mesure : deux tokens
  (`--zone-pad-contact`, `--zone-pad-footer`) qui marchent sur le même
  breakpoint que les deux sections du dessus. Après : descente 160/136/105 à
  390 et 208/176/137 dès 768 — **la même proportion 1 : 0,85 : 0,66 à toutes les
  largeurs**.

- [ ] **La colonne d'une `.capability-card` ne fait que 184px de texte vif à
  1024** (232px de carte moins 2 × 24 de padding) — la plus étroite mesure de
  lecture du site, alors qu'elle en fait 310 à 390px. Cause : la grille passe à
  4 colonnes dès `min-width: 1024px`, où la fenêtre n'a pas encore la largeur
  pour quatre colonnes lisibles ; à 1024 chaque titre de carte casse en deux
  lignes et chaque item de liste passe à la ligne. C'est la cause racine de la
  troncature corrigée au cycle 020 (`3dc9597`), qui est traitée à la source et
  ne dépend plus de la grille. Arbitrage de grille (repousser le passage à 4
  colonnes vers 1280, ou passer par un palier à 3), à mesurer avant/après.
  **P2.**

- [ ] **Les 16 coches des cartes Capabilities sont plus claires que l'information
  qu'elles marquent** (rotation A, cycle 021). `<Check className="text-primary">`
  est peint a pleine luminance (0,7036) alors que l'item de liste qu'il precede
  est a 0,3535 : le marqueur decoratif est **deux fois plus clair que le texte**.
  Arbitrage d'icones, pas de texte — hors du cadre mesure de la rotation A, qui
  ne compte que les niveaux typographiques. A trancher dans un cycle de rotation
  A ou D. **P2.**

- [x] **axe-core ne juge pas le contraste de cette page** (cycle 021) : **0
  violation `color-contrast` et 494 noeuds `incomplete`**, motif dominant
  « background color could not be determined due to a pseudo element » (les halos
  `::before` de `.capability-card` et `.about-card`) et « overlapped by another
  element ». Vingt journaux ont relu « 3 violations, aucune de contraste » comme
  un feu vert ; ce n'en etait pas un, et c'est ainsi qu'un texte a 3,47:1 a
  survecu vingt cycles. Piste : mesurer le contraste dans le probe maison plutot
  que d'attendre d'axe qu'il le fasse — c'est deja le cas depuis ce cycle, mais
  le probe ne couvre que les 4 sections de la zone prioritaire. Couverture
  étendue cycle 039 : nouvel outil `scripts/ui-contrast-sweep.mjs`, qui marche
  **tout** le DOM d'une route (pas une liste de sélecteurs choisis à la main),
  résout `oklch()`/`oklab()`, applique les seuils WCAG AA (4.5:1 texte normal,
  3:1 grand texte) et ignore les noeuds `aria-hidden` (décoratifs, hors WCAG
  1.4.3 — même exception que `.pc-watermark`, cycle 033). Premier run sur les 2
  routes × 4 viewports × 2 langues : **1 violation trouvée** (`.home-project-why
  span`, "Why it matters"/"Pourquoi c'est important", 4.24:1), corrigée
  immédiatement (voir plus bas). Deuxième run après correctif : **0 violation
  sur les 16 combinaisons.**

- [ ] **`#about` est le seul bloc de la zone sans aucune ancre de preuve**
  (rotation D, cycle 018). Le bloc « Analytical profile » est 100 % assertif :
  phrase-titre + paragraphe énumérant « business intelligence, Power BI, SQL,
  Python, reporting automation and open data projects », sans un lien, un
  chiffre vérifiable ou un renvoi. Ce n'est pas une faute en soi — un bloc de
  positionnement a le droit d'être déclaratif, et `#capabilities` prouve juste
  après (4 cartes, 4 liens de preuve différenciés). Mais c'est le dernier
  endroit de la zone où un tech lead lit une affirmation sans pouvoir la
  vérifier. Arbitrage éditorial, pas un défaut mesuré : à traiter quand un
  cycle n'a pas d'écart chiffré plus urgent dans la zone.

- [x] **Le voile du sélecteur de langue masque le texte de la page sur 390px**.
  Qualifié de « défaut intermittent » depuis le cycle 016 ; le balayage de
  collision du cycle 019 (pas de 60px, toute boîte de texte recouvrant le
  rectangle du contrôle de plus de 2px sur les deux axes) dit qu'il était
  **majoritaire** : 24 des 49 positions de scroll de la zone prioritaire à 390
  (43/70 sur la page entière), 6/15 à 768 et 1024, 2/15 à 1440. Pire cas mesuré
  à 390 EN : le mot « with » du titre « Analytical profile » coupé en deux par
  « EN · FR ». Deux textes clairs superposés = contraste non pas insuffisant
  mais **non défini** (garde-fou §6) — **requalifié P0** à ce titre. Corrigé
  cycle 019 (commit `42333f3`) : le contrôle s'escamote au scroll descendant et
  revient au scroll montant, et reste toujours visible sous 160px de scroll
  puisque c'est en haut de page qu'on choisit sa langue. Après : **0 collision**
  sur 49/51 (390), 28/32 (768), 30/31 (1440), 31/32 (1920) positions, EN et FR.
  Clavier préservé (`opacity: 0` et jamais `visibility`, plus `:focus-within`) :
  Tab atteint le contrôle dès le premier appui même escamoté, vérifié sur les
  12 combinaisons. Variante `prefers-reduced-motion` : escamotage sans
  translation ni transition — l'évitement est une correction de lisibilité, pas
  une décoration, il ne se désactive donc pas.
- [x] **`ui-gallery.mjs` ne sait pas figer une revelation d'une demi-seconde**
  (cycle 022). Avec `--prescroll=no`, le script appelle `scrollIntoViewIfNeeded()`
  **avant** de caler la cible a son `@y`, si bien que l'observateur declenche
  pendant ce premier scroll : le `--settle` demande ne compte pas a partir du
  debut de l'animation mais d'un instant inconnu, plus tard. Concretement, il a
  fallu quatre essais (`600`, `180`, `420`, puis `0` ms avec `@560`) pour obtenir
  une paire AVANT/APRES ou la cascade des cartes est encore visible — les trois
  premiers montraient deux images identiques, donc une preuve nulle. **Corrigé
  cycle 049** (commit `d59d985`) : nouveau mode `--freeze-at=<ms>`, appliqué aux
  cibles sans préfixe spécial (id/sélecteur/`viewport:`) — arme un
  `IntersectionObserver` témoin sur la cible avant tout scroll, attend son
  déclenchement réel (`page.waitForFunction`), **puis** compte `<ms>` à partir
  de cet instant précis. Vérifié en deux temps : un script autonome confirmant
  que l'observateur, armé avant `scrollIntoViewIfNeeded()`, ne se déclenche
  qu'après (donc capture le vrai instant plutôt qu'un état déjà `revealed` par
  effet de bord du scroll) ; puis un run réel de bout en bout
  (`--cycle=999 --before=HEAD --sections=capabilities --prescroll=no
  --freeze-at=300`, worktree + deux serveurs, comme en production) qui produit
  bien une paire d'images — cycle 999 et son bloc `GALERIE.md` supprimés après
  vérification, aucun chantier UI ne justifiait de les garder. Pas de section
  UI retouchée par ce commit (fichier `scripts/` seul), donc pas d'entrée de
  galerie pour ce chantier lui-même.

- [ ] **Tout fondu d'entree traverse le bas du plancher de contraste** (rotation C,
  cycle 022). Le cycle 022 a ramene le pire temps passe sous 4,5:1 par une carte
  Capabilities de 727 a ~400ms, mais pas a zero, et c'est structurel : une carte
  qui part de `opacity: 0` passe par tous les contrastes entre 1:1 et son
  contraste de repos. Le projet a deja la regle qui interdit cela —
  `REVEAL_FLOOR_OPACITY = 0.58` dans `PortfolioMotion.tsx`, documente « a reveal
  may dim text, never hide it » — mais elle n'a ete appliquee qu'a
  `AnimatedLetter`. L'appliquer aux cartes demande d'abord de la recalibrer : 0.58
  a ete calcule pour `text-primary` (222,219,200) a 16px ; le texte le plus sourd
  d'une carte est `text-gray-400` a 14px, mesure a 6,17:1 au repos, et il faudrait
  un plancher d'environ **0.84** pour qu'il tienne 4,5:1 — c'est-a-dire renoncer
  au fondu et ne garder que la translation. Arbitrage de direction artistique, a
  trancher avec une mesure de cout par image (`long tasks`) et une capture, pas
  avec un avis. **P2.**

- [ ] **352 `<span>` animes pour un paragraphe** (rotation C, cycle 022).
  `AnimatedLetter` decoupe le paragraphe d'`#about` en 352 noeuds, chacun abonne
  a `scrollYProgress` ; 411 des 634 noeuds de la zone portent un style inline
  d'animation. Aucun defaut de lisibilite ne s'y rattache — les 325 caracteres
  qui n'atteignent jamais l'opacite 1 reposent sur le plancher de 0.58, soit
  5,2:1, au-dessus du seuil. Le coût est donc uniquement un coût de rendu, et il
  n'a **pas** ete mesure : le probe de mouvement compte les noeuds animes, pas
  les images longues. A rouvrir avec une mesure `PerformanceObserver` de
  `longtask` pendant un scroll scripte, pas avec un avis. **P2.**

- [x] `aria-prohibited-attr` sur `.city-heading` (hero) — `<p>` porte le rôle
  ARIA implicite "paragraph", qui n'admet pas `aria-label`. Corrigé cycle 028
  (commit `db4cc52`) : `aria-label` retiré, remplacé par un `<span
  className="sr-only">` portant le même texte — les lignes visibles de
  `CharacterLines` étaient déjà `aria-hidden`, donc le rendu à l'écran est
  inchangé (confirmé par capture cycle 028).
- [x] `landmark-unique` — `.pc-nav` dupliqué sans nom accessible distinct par
  instance. Cause : le prop `label` de `ProjectCarousel`/`CarouselModal`
  n'était jamais passé aux 4 sites d'appel (`OnePage.tsx`, projets 01/02/03/06)
  et retombait sur le même défaut générique "Project walkthrough" partout, si
  bien que les 4 `<nav aria-label="Slide navigation">` de la page portaient le
  même nom. Corrigé cycle 028 (commit `64dde59`) : `label={project.title}`
  passé à chaque appel, nav renommée `"Slide navigation: <titre du projet>"` —
  4 noms de landmark désormais uniques (vérifié par lecture du DOM aux 3
  combinaisons EN/FR/mobile).
- [x] `region` — `.language-toggle` hors de tout landmark. Corrigé cycle 028
  (commit `77904d9`) : `role="group"` → `role="navigation"` (c'est
  effectivement un contrôle de navigation interlangue), sans effet visuel
  (`role` n'affecte pas le style). Troisième et dernière passe de retouche
  autorisée sur `language-toggle` (compteur §6, désormais gelée).
- [x] **CTA dupliqué dans l'état d'ouverture du hero** (rotation D, cycle
  029). `.city-content` portait deux boutons — "View projects" et "View
  selected work" — tous deux `href="#selected-work"`, mesuré aux 4
  combinaisons (1440/390 × EN/FR) avec le probe d'évidence étendu au hero/nav
  ce cycle. Corrigé commit `ce479ca` : pilule dupliquée retirée, CSS mort
  `.opening-secondary` nettoyé. Un seul CTA reste, sans perte d'information
  (destination identique).
- [x] **Redondance de contenu entre la copie statique de carte et le slide
  "cover" du carousel** (rotation A, cycle 030). `#project-01
  .home-project-card` remontait 18 niveaux typographiques (probe étendu au
  hero/nav/carte projet ce cycle) ; en creusant les échantillons, deux des
  quatre projets à carousel avaient un champ `sub` de slide "cover" qui
  redisait presque mot pour mot la `description`/le `hook` statique déjà
  visible juste à côté : JobTrackr (`sub` = mêmes 3 faits que `description`,
  reformulés) et Analyse vidéo football (`sub` redit le `hook`, `thesis` du
  même slide le redit déjà aussi — trois phrases pour deux faits). Corrigé
  commit `04a678e` : `sub` retiré (EN+FR) sur ces deux projets uniquement.
  Football Data Pipeline et Retirement Sustainability Model **laissés
  intacts** après la même vérification — leurs `sub` respectifs ajoutent un
  cadrage ("reproducible and falsifiable") ou un fait narratif (date de
  publication du rapport COR) absents de la copie adjacente ; les retirer
  aurait perdu de l'information, contrairement au test que rotation A
  demande d'appliquer avant de couper.
- [ ] Bundle JS ~680 kB (226 kB gzip), warning Vite "chunk > 500kB" au build.
  Pas urgent (pas de garde-fou performance chiffré dans la mission), mais à
  garder à l'œil si de nouvelles démos iframe/vidéo alourdissent encore le
  bundle initial.
- [x] **`ProjectDetailModal.tsx` jamais audité sous aucune rotation** (relevé
  cycle 031, point de reprise explicite). Rotation B appliquée cycle 032, un
  ad hoc probe Playwright (supprimé après usage) a mesuré trois défauts :
  `.project-detail-tabs button` à 34px de haut (sous 44px, seul chemin de clic
  pour changer d'onglet) ; le paragraphe overview à 81 caractères/ligne (EN) et
  77 (FR) à 1440, au-dessus du plafond de 75 que rotation B fixe ; et, trouvé
  incidemment par un scan axe-core scopé à la modale, `#project-detail-content`
  (zone scrollable `overflow-y:auto`) sans accès clavier
  (`scrollable-region-focusable`). Corrigé commit `e6305ff` : `min-height: 44px`
  sur les onglets, `max-width: var(--measure-lede)` (58ch, déjà calibré cycles
  019/020 pour la même classe de copie) sur le paragraphe, `tabIndex={0}` sur
  la zone de contenu. Après : 0 violation axe-core sur la modale (contre 1),
  73/72 caractères/ligne à 1440, ordre du focus trap revérifié inchangé
  (fermer → onglet → contenu → fermer, Échap ferme toujours).
- [x] **`ui-gallery.mjs` ne savait pas capturer un chantier vivant dans une
  modale ouverte par un `<button>`** (cycle 032, besoin du chantier ci-dessus :
  les 6 modales projet s'ouvrent toutes via un bouton, jamais un `<a href>`,
  hors du mode `click:` existant). Ajouté `openmodal:<boutonSelecteur>|
  <cibleSelecteur>` (commit `b444223`). Premier essai bloqué en timeout : les
  cartes projet sont un empilement `position: sticky`, et
  `scrollIntoViewIfNeeded()` atterrit parfois sous la carte suivante déjà
  empilée (bouton géométriquement recouvert bien que Playwright le juge
  visible) — corrigé (commit `cb5d790`) avec un `scrollIntoView({block:
  "start"})` natif qui cale le haut de la carte ciblée en haut du viewport
  avant le clic.
- [x] **Page fantôme `/projet/:slug` (`DeepDivePage.tsx`) atteignable par URL
  directe mais reliée à aucun élément d'interface** (cycle 031, point de
  reprise du cycle 030 : auditer `ProjectDetailModal`/`DeepDivePage`, jamais
  couverts par aucune rotation). Un premier jet de système de page de détail
  (`content/projects.ts`, `content/deepdives.{ts,md}`, `content/projets.md`,
  `sections/DeepDive.tsx`, `pages/DeepDivePage.tsx`, `components/{ProjectCard,
  FictifTag,LazyMediaSlot}.tsx`), jamais retiré après que le système actuel
  (`data/projects.ts` + `ProjectDetailModal.tsx`) l'a remplacé, restait
  accessible en devinant l'URL et affichait un texte 100 % français sans
  variante EN (violation §1) avec des chiffres JobTrackr divergents de la
  carte réelle. Exhaustivement vérifié mort par `grep -rln` fichier par
  fichier avant suppression (commit `f0686d2`). Bundle : JS 693,28 → 679,80 kB,
  CSS 96,77 → 87,19 kB. Aucun import partagé touché (`useDocumentMeta` reste
  utilisé par `CVPage.tsx`), homepage vérifiée visuellement identique après
  coup. Les tokens CSS `--fictif-ink`/`--fictif-border` (`tokens.css`,
  `index.css`), désormais orphelins eux aussi mais sans coût ni risque,
  laissés en place — hors périmètre de ce chantier. **Retirés cycle 040**
  (commit `42ed056`) : `grep -rn` confirmant l'absence de toute référence
  restante, build identique à l'octet près avant/après.
- [x] **`.project-case-study span`/`.project-overview-grid aside > span`
  (`ProjectDetailModal.tsx`, onglet Overview) mesurés à 4.28:1 et 4.02:1**
  (cycle 033, rotation C, mesure de contraste au probe maison plutôt qu'à
  l'œil). Sous le plancher de 4.5:1 (§6), à 10px, partagé identiquement par
  les 6 modales projet. axe-core scopé à `.project-detail-panel` : **0
  violation `color-contrast` avant comme après** — le panneau composite sa
  couleur de fond d'une façon qu'axe ne résout pas, exactement le blind-spot
  déjà loggé plus haut (cycle 021). `.pc-watermark` (le grand numéro de fond
  du carousel) mesuré à 1.06:1 au même passage mais **non retenu** :
  `aria-hidden="true"`, filigrane décoratif non porteur d'information, WCAG
  1.4.3 ne s'applique pas. Corrigé : alpha `0.5`/`0.48` → `0.58` (même valeur
  déjà tranchée pour le kicker/toggle, cycles 002/018) sur les deux règles,
  mesuré à **5.46:1** après. Rotation C sur la transition d'onglet
  (`duration: 0.2` sans easing nommé) et sur `ProjectCarousel`/
  `CarouselModal` investiguée dans le même cycle, **rien retenu** : la
  transition d'onglet ne dépasse jamais 200ms sous le plancher (un ordre de
  grandeur sous les cas déjà arbitrés en zone prioritaire), et le carousel
  répond déjà aux trois questions de la rotation (eases nommés, pas de
  contenu invisible, reduced-motion propre).
- [x] **`/cv` jamais visitée par aucun outil d'audit de la boucle** (cycle
  034 — `scripts/ui-audit.mjs` ne charge que `BASE_URL`, aucune route). Sonde
  Playwright ad hoc a mesuré trois défauts : `.cv-kicker`/`.cv-section-kicker`
  à 4.49:1, `.cv-timeline-dates` à 4.21:1, `.cv-print-note` à 2.52:1 (P0
  mesuré, motif déjà corrigé ailleurs cycles 002/018/033, jamais appliqué à
  cette page) ; `.cv-contacts a` (liens email/GitHub) à 40px de haut (P1
  mesuré, sous le plancher de 44px) ; `.cv-timeline-bullets li` à 111
  caractères/ligne à 1440 (P2 mesuré, au-dessus du plafond de 75 de rotation
  B). Corrigé commit `a47fe85` : alpha `0.52`/`0.5`/`0.35` → `0.58` (valeur
  déjà tranchée pour ce cas de figure, cycles 002/018/033), `min-height`
  40px→44px, `max-width: var(--measure-lede)` sur les puces. Revérifié cycle
  034 (script de vérification dédié, supprimé après usage) : contraste
  **5.41:1** aux 4 combinaisons 390/1440 × EN/FR, cibles tactiles **44px**, 0
  débordement horizontal, **0 violation axe-core**, mesure de lecture 48/61
  caractères/ligne (390/1440) — largement sous le plafond.
- [x] **`ui-gallery.mjs` ne visitait jamais que `/`** (cycle 034, besoin du
  chantier ci-dessus : `/cv` est une route distincte, jamais capturable en
  avant/après). Ajouté `--path=<route>` (commit `1f71bb3`) : ajoute la route
  à l'URL de base avant toute capture, même forme que les additions
  incrémentales précédentes (`openmodal:`, `--viewports`).
- [x] **`scripts/ui-hierarchy-probe.mjs` ne savait auditer que la page
  d'accueil** (cycle 035, même angle mort que `ui-gallery.mjs` au cycle 034 —
  `/cv` n'avait jamais reçu de rotation A-E complète). Ajouté `--path=<route>`
  (commit `0adcdd1`) : bascule sur un jeu de sélecteurs propre à `/cv`
  (`.cv-header`, `#experience`, `#projects`, `.cv-two-col`,
  `.cv-skills-groups`) au lieu des sections de la page d'accueil. Piège
  d'outillage rencontré et documenté au passage : sous Git Bash (MSYS) sur
  Windows, un argument `--path=/cv` est réécrit en chemin Windows absolu
  (`--path=D:/.../cv`) avant que Node ne le voie — `MSYS_NO_PATHCONV=1` est
  requis pour tout futur script Node invoqué avec un argument commençant par
  `/` depuis ce shell.
- [x] **En-tête de `/cv` répétait le nom deux fois** (cycle 035, rotation A,
  première rotation complète posée par écrit sur `/cv`). Le probe étendu
  ci-dessus a mesuré `.cv-header` à 6 niveaux typographiques avec un
  near-duplicate ; en creusant, le vrai défaut était un kicker `<p>` lisant
  "Axel Corral" en petites capitales immédiatement au-dessus d'un `<h1>` qui
  redit exactement la même chose — la toute première chose lue sur la page,
  lue deux fois. Tous les autres kickers de cette page catégorisent le bloc
  suivant (Experience, Education, Portfolio projects) ; celui-ci ne faisait
  que répéter. Corrigé commit `e6ecf21` : paragraphe retiré, règle CSS
  `.cv-kicker` et sa référence dans le media query d'impression nettoyées
  (plus aucune référence dans le repo). Niveaux : 6 → 5. axe-core : 0
  violation avant comme après aux 4 combinaisons 390/1440 × EN/FR. Reste de
  la page passé en revue sous rotation A dans le même cycle : bullets
  d'expérience dominant la salience du titre de poste (attendu, c'est le
  contenu que lit un recruteur, pas un défaut) ; libellés lieu/disponibilité
  quasi identiques visuellement mais portant deux faits réels distincts (pas
  de perte d'information à tester, rien à retirer) ; `cv-two-col` et
  `cv-skills` sous le seuil de 4 niveaux ou proches sans near-duplicate — rien
  retenu.
- [x] **Le lien "View case study" de `/cv` ne montrait pas de case study**
  (cycle 036, rotation D, point de reprise explicite du cycle 035).
  `src/pages/CVPage.tsx:90` pointe vers `/#project-XX` avec le même libellé
  que le bouton homepage qui ouvre `ProjectDetailModal`, mais l'effet de
  deep-link cross-route (`src/OnePage.tsx`, ajouté cycle 031) ne faisait que
  défiler jusqu'à la carte résumé — le lecteur devait cliquer une seconde
  fois sur "Open case study" pour obtenir ce que le premier lien promettait.
  Corrigé commit `ca1022d` : l'effet ouvre désormais la modale (même state
  que le clic homepage) quand le projet ciblé a une case study, en plus du
  défilement. Vérifié aux 4 combinaisons 390/1440 × EN/FR (sonde Playwright
  ad hoc, supprimée après usage) : modale ouverte, titre correct, focus posé
  sur le bouton de fermeture, **0 violation axe-core**. `/cv` ne liste que
  les projets 01/02/03 — vérifié intentionnel (CV formel, projets à dépôt
  vérifiable seulement), pas un défaut.
- [ ] **CLS 0.1603 sur `/cv` à tablet-768 + FR uniquement, causé par un reflow
  de police web à froid (FOUT)** (cycle 037, premier run complet de
  `ui-audit.mjs` sur `/cv` après l'ajout de `--path=<route>`). Reproductible
  100 % (4/4 runs identiques, ~0.156-0.160), isolé à la bande 700-768px en
  français uniquement (768px EN = 0.0007 ; toutes les autres combinaisons
  ≤ 0.012), et confirmé comme un problème de chargement de police par
  élimination : un `page.reload()` dans le même contexte (polices déjà en
  cache) fait tomber le CLS à **0**. La police de corps (`body`, chargée via
  Almarai + `display=swap` dans `index.html`) s'affiche d'abord en police de
  repli système puis se redessine avec des métriques différentes, déplaçant
  les retours à la ligne du texte courant (`.cv-hook`, `.cv-timeline`,
  `.cv-contacts`) — le français, plus long à contenu égal, franchit une
  limite de wrap à cette largeur que l'anglais ne franchit pas. **Pas corrigé
  ce cycle** : la correction standard (`font-display: optional`, ou des
  descripteurs `size-adjust`/`ascent-override`) touche le chargement de police
  de tout le site (Almarai est la police de base de `body`, pas seulement de
  `/cv`), donc exige sa propre vérification avant/après sur les 4 viewports ×
  2 langues des deux routes avant d'être livrée — trop large pour être
  greffée en fin de cycle. Bloqué en pratique sur `QUESTIONS.md` Q5 (écart
  entre la police de corps documentée — Inter — et celle réellement chargée —
  Almarai — qui détermine quelle réparation est la bonne). **P1 — prochain
  candidat naturel une fois Q5 tranchée.**
- [x] **`scripts/ui-evidence-probe.mjs`/`scripts/ui-audit.mjs` ne savaient
  auditer que la page d'accueil** (cycle 037, même angle mort que
  `ui-gallery.mjs`/`ui-hierarchy-probe.mjs` avant les cycles 034/035). Ajouté
  `--path=<route>` aux deux : `ui-evidence-probe.mjs` bascule son inventaire
  de blocs sur les sections `/cv` (rôle "zone" uniforme, pas de "showcase" —
  un CV n'a pas de slides projet) ; `ui-audit.mjs` bascule ses sections de
  capture et ses cibles de survol, et corrige un repli silencieux
  (`document.getElementById("about")` en dur pour décider si un état de focus
  clavier mérite sa capture — absent sur `/cv`, le `?? Infinity` rendait ce
  test toujours faux sans jamais le signaler). Premier run complet de
  `ui-audit.mjs --path=/cv` (10 combinaisons) : 0 overflow, 0 violation
  axe-core, 0 erreur console — et l'anomalie de CLS ci-dessus, qui valide que
  l'extension apporte une couverture réelle et pas seulement un flag inerte.
- [ ] **`ui-gallery.mjs` : le mode `viewport:<cible>@<y>` suppose qu'un
  scroll ne change que la position de la cible dans le document** (cycle
  029). Faux pour toute section pilotée par la position de scroll absolue
  (crossfade scroll-scrubé du hero, `CinematicOpening.tsx`) : positionner
  `.city-content` à `anchorTop=0` forçait ~400-470px de scroll, assez pour
  faire basculer l'état affiché (ville → cliff/profil) et produire une paire
  AVANT/APRÈS sans preuve (constaté et rejeté avant publication ce cycle,
  contourné avec un `anchorTop=400` choisi à la main). **P2 — outillage** :
  un mode qui verrouille `scrollY` avant de positionner la cible éviterait de
  deviner un `anchorTop` par essai si une autre section scroll-scrubée est
  retouchée un jour.
- [x] **`scripts/ui-audit.mjs` se bloquait/crashait sur un run complet**.
  Observé cycle 015 (blocage silencieux 14+ min) puis cycle 027 (`Target
  crashed` Chromium, reproductible à deux reprises à des points différents du
  run). Cause identifiée cycle 027 : un seul `browser` Chromium partagé
  accumulait de la mémoire sur ~10 sessions de captures intensives (scroll
  pleine page, GSAP) et finissait par crasher, perdant tout run non terminé
  faute de sortie incrémentale. Corrigé cycle 027 (commit `e6f49c2`) : un
  navigateur frais par capture, écriture incrémentale de `report.json`, et
  tolérance à l'échec d'une seule combinaison (log + continue) au lieu
  d'interrompre tout le run. Un run complet (8 combinaisons + 2 passes
  reduced-motion) termine désormais sans perte de données même si une
  capture individuelle échoue encore occasionnellement.

- [x] **`.cv-two-col` double le gap vertical entre Education et Languages sous
  768px** (cycle 038, rotation E, `/cv`). Le conteneur passe en une seule
  colonne implicite sous 768px, mais chaque enfant `<section className="cv-section">`
  gardait son propre `margin-bottom: 3.5rem` (56px) en plus du `gap: 3rem`
  (48px) de la grille — 104px mesurés entre le dernier item d'Education et le
  kicker Languages, contre 56px de rythme normal entre sections ailleurs sur
  la page (ex. #experience → #projects). Corrigé commit `fd91727` :
  `.cv-two-col > .cv-section { margin-bottom: 0 }`. Après : 48px aux 4
  viewports × 2 langues en mode empilé (390/768 tablette portrait avant le
  passage à 2 colonnes) ; le mode 2 colonnes (≥768px, gouttière horizontale
  48px) mesuré strictement identique avant/après aux 4 viewports × 2 langues.
  0 violation axe-core avant/après. Compteur §6 `cv-page` : 2/3 → **3/3,
  gelée**.

- [x] **`.home-project-why span` (kicker "Why it matters"/"Pourquoi c'est
  important", partagé par les 6 cartes projet) mesuré à 4.24:1** (cycle 039,
  premier run du nouveau `ui-contrast-sweep.mjs`). Sous le plancher de 4.5:1
  à 10px, présent depuis l'origine du bloc, invisible à axe-core (même angle
  mort que ci-dessus). Corrigé commits `e4cc8de`/`eaa8dff` : alpha `0.5` →
  `0.58` (`src/index.css`), même valeur déjà tranchée pour ce cas de figure
  (petit texte translucide sur fond quasi noir, cycles 002/018/033/034),
  mesurée à **5.4:1** après. Balayage complet (2 routes × 4 viewports × 2
  langues) : 0 violation résiduelle. axe-core scopé à `.home-project-card` :
  0 violation aux 4 combinaisons 390/1440 × EN/FR.

- [x] **`reduce`-motion coûte PLUS de temps main-thread au chargement que
  `no-preference`, `CinematicOpening.tsx`** (cycle 041, TBT ~380-450ms sous
  `reduce` contre ~200-250ms sous `no-preference` à 1440, reproduit sur 4
  runs). **Reverifié cycle 059, ne reproduit plus.** `scripts/ui-longtask-
  probe.mjs` relancé 4 fois indépendamment (3× à 1440 seul, 1× sur les 4
  viewports × 2 langues, 16 combinaisons au total) sur l'état actuel du
  code (aucun fichier touché avant la mesure) : `reduce` est désormais
  systématiquement **égal ou moins coûteux** que `no-preference` partout
  (ex. 1440/EN : 100ms contre 115ms ; 390/EN : 84ms contre 118ms ; pire cas
  768/FR : 108ms contre 100ms, écart de 8ms, sans commune mesure avec les
  ~150-250ms mesurés cycle 041). Aucun correctif de ce chantier n'a jamais
  été livré (§ cycle 041 : trop risqué sans budget dédié) — la disparition
  de l'écart est un effet de bord d'un ou plusieurs des commits hero
  ultérieurs (044/045/046/047/048/050/051/052/058 ont tous touché
  `CinematicOpening.tsx` ou `index.css` autour de ce composant), cause
  exacte non attribuée à un commit précis (non nécessaire : l'effet mesuré
  a disparu, pas seulement une de ses causes possibles). Fermé — plus un
  candidat P2, voir `PROGRESS.md` cycle 059.

- [x] **`.home-project-actions` (bouton "Open case study"/lien démo/lien repo)
  couvert et inatteignable au clic sur 4 des 6 cartes projet, presque partout
  en desktop** (cycle 042, découvert en revérifiant visuellement le §4 —
  priorité absolue de ce run — plutôt que de se fier au seul journal). À
  partir de 1024px, `.home-project-card` est une hauteur fixe (`overflow:
  hidden`, pin sticky en cascade z-index croissant) : mesuré, le contenu de
  `.home-project-copy` déborde cette hauteur de 21 à 215px sur 01/04/05/06,
  aux 4 viewports desktop (1024/1280/1440/1920) et dans les deux langues (pire
  en français, plus long à sens égal). L'`overflow:hidden` du parent
  engloutissait silencieusement ce débordement — `.home-project-actions`,
  seul chemin vers "Open case study" (qui ouvre `ProjectDetailModal`), la
  démo live et le repo, se retrouvait entièrement ou partiellement hors de la
  boîte visible, ou physiquement recouvert par la carte projet suivante
  (confirmé par `elementFromPoint()` : au point de clic du bouton de la carte
  05, l'élément peint était `.home-project-copy` de la carte **06**). Un test
  de clic Playwright exhaustif (6 projets × 3 viewports × 2 langues = 36
  combinaisons) le confirmait : `locator.click()` **timeout** sur 04/05 en
  français à 1440, et plus largement sur 05 à tous les viewports même en
  anglais une fois le test étendu. **P0** — "contenu invisible", touchant
  directement les trois chantiers prioritaires du §4 de ce run. Corrigé
  (commit `72ab734`) : `.home-project-copy` gagne `overflow-y: auto` +
  `tabIndex={0}` (même motif que `.project-detail-content` dans
  `ProjectDetailModal`, cycle 032) pour que tout débordement résiduel reste
  atteignable au lieu d'être coupé en silence ; et surtout,
  `.home-project-actions` est déplacé dans le JSX (`OnePage.tsx`) juste après
  le `hook` (accroche courte), avant la `description` de longueur variable —
  la seule zone de la carte jamais atteinte par la carte suivante qui arrive
  par le bas, quelle que soit la longueur du texte dans l'une ou l'autre
  langue. Revérifié après correctif : **0/36 échecs de clic** (6 projets × 3
  viewports × 2 langues, 1024-1920px), **0/12** à 768px sous
  `reduced-motion`, **0 violation axe-core** (390/1440 × EN/FR après scroll
  complet), et Tab atteint "Open case study" en **une seule pression** après
  focus de la zone désormais scrollable. Bonus hiérarchie (rotation D,
  incidentelle) : le CTA arrive maintenant avant le mur de texte au lieu
  d'après, cohérent avec "un tech lead qui scrolle 15 secondes doit
  comprendre" — mais le chantier a été déclenché par la mesure de
  clickabilité, pas par une préférence esthétique.

- [x] **`.project-case-study p`/`.project-key-takeaway p` (blocs
  CONTEXT/PROBLEM, PIPELINE/METHOD, EVIDENCE/RESULT des 6 modales projet)
  sans plafond de mesure, 99-108 caractères/ligne à 1440/1920, EN et FR**
  (cycle 043, rotation B — "la longueur de ligne dépasse-t-elle 75
  caractères sur desktop ?"). Le paragraphe d'overview juste au-dessus
  (`.project-overview-grid > div > p`) avait déjà reçu `max-width:
  var(--measure-lede)` au cycle 032, mais la règle voisine
  `.project-case-study p`/`.project-key-takeaway p` — même colonne, même
  genre de copie — ne l'a jamais reçu : mesuré 33-44% au-dessus du plafond
  de rotation B sur les 4 projets à `caseStudy` non vide (01/04/05/06,
  02/03 n'ont pas de champ `caseStudy`), aux 2 viewports desktop et aux 2
  langues (canvas `measureText` sur le texte réel de chaque paragraphe, pas
  une estimation à l'œil). Touche directement les trois chantiers
  prioritaires du §4. Corrigé (commit `38757b9`) : même token
  `--measure-lede` (58ch) déjà tranché pour ce cas de figure. Après :
  70-77 caractères/ligne sur les 32 combinaisons (6 projets × 2 viewports ×
  2 langues, hors 02/03 sans case study) — dans la fourchette normale,
  contre 99-108 avant. Vérifié : 0 régression de clic (36/36 cartes),
  **0 violation axe-core** sur le panneau après ouverture (4 projets × 2
  viewports × 2 langues), rendu mobile (390px) inchangé (la colonne y
  était déjà plus étroite que la mesure). Compteur §6
  `project-detail-modal` : 2/3 → **3/3, gelée**.

- [x] **`.pc-dot` (points de navigation du carousel projet, `role="tab"` réel,
  partagé par 4 projets 01/02/03/06) mesuré à 4×4px (inactif) / 18×4px
  (actif)** (cycle 044, rotation E). Sous la convention 44px du reste du site
  et sous le minimum WCAG 2.5.8 (24×24px, même avec l'exception d'espacement —
  l'espacement centre à centre mesuré, ~12.5px sur le carousel à 8 points,
  est aussi sous les 24px que l'exception exige). Corrigé (commit `47bc024`) :
  pseudo-élément `::before` invisible (`inset: -20px -2px`) portant la zone
  cliquable à 8×44px/22×44px, sans changement visuel. Vérifié par 3 clics à la
  limite exacte de la zone étendue (bord gauche, bord droit, 0.5px après la
  zone du voisin) : aucun chevauchement, chaque clic active le bon point.
  **Plafond géométrique documenté, non atteint par choix** : 24px ou 44px
  pleins par point restent impossibles à la densité actuelle (jusqu'à 8 points
  sur ~100px à 390px) sans élargir `.pc-nav` ou réduire le nombre de points
  affichés — un arbitrage de densité visuelle, pas une valeur oubliée. Si Axel
  veut aller plus loin : soit élargir la barre de nav (espace disponible à
  vérifier aux 4 viewports), soit masquer les points sur les plus petits
  viewports et ne garder que `.pc-arrow` (déjà conforme 44px) + la navigation
  clavier (`ArrowLeft`/`ArrowRight` sur le `role="tablist"`, déjà en place) —
  **P2, arbitrage de densité, pas bloquant**. Compteur §6 `carousel-nav`
  (`.pc-*`) : 2/3 → **3/3, gelée**.

- [x] **`.subtle-link` (ligne View CV/Download/GitHub/Contact du hero) casse
  le texte d'un seul lien en plein mot à 768px** (cycle 045, trouvé par
  inspection visuelle directe des captures hero, pas une rotation A-E
  complète). À 768px, `.hero-intro` ne fait que `span 4/12` (~220px) et le
  conteneur `flex gap-4` sans `flex-wrap` laissait le premier lien
  (`View CV`/`Voir mon CV`) se rétrécir et casser son propre texte au lieu
  de renvoyer les liens suivants à la ligne — "Voir mon CV" éclatait sur
  3 lignes en français. Corrigé (commit `1904498`) : `flex-wrap` sur le
  conteneur + `white-space: nowrap` sur `.subtle-link`, chaque lien devient
  une unité insécable. Vérifié : hauteur exacte 44px sur les 5
  `.subtle-link` après correctif (0 retour à ligne interne), 0 violation
  axe-core scopée à `.hero-content`, aucune régression visuelle à
  390/1440/1920 (la colonne y est déjà assez large, `flex-wrap` sans effet
  par construction). Outillage : `scripts/ui-gallery.mjs` gagne le mode
  `scrollpx:<multiplicateurVh>` (commit `24e70f7`), seul moyen de capturer
  honnêtement une scène pilotée par le scroll à l'intérieur d'un
  `position: sticky` — `viewport:<sel>@<y>` et `scrollIntoViewIfNeeded()`
  traitent `.hero-content` comme déjà visible dès scroll 0 et n'avancent
  jamais le crossfade vers la scène B. Compteur §6 : nouvelle entrée
  `hero-links` (`.subtle-link`) **1/3**.

- [x] **`.opening-primary` (CTA "View projects"/"Voir les projets", scène A
  du hero) restait cliquable et atteignable au clavier pendant tout le fondu
  de sortie de la scène, alors que son contraste réel s'effondre bien avant
  la fin de ce fondu** (cycle 046, trouvé par un run `ui-audit.mjs`,
  rotation C — « du contenu qui reste invisible... un bug critique »).
  Texte (`#080808`) et fond de page (`#080808`) partagent la même teinte ;
  comme `opacity` est un compositing et non un changement de couleur, le
  fond du bouton (`#e1e0cc`) se fond visuellement vers ce même fond sombre
  au fil de `scrollYProgress` 0→0,3. Mesuré par échantillonnage de pixels
  réels (capture recadrée, `sharp`, déjà présent au projet) : 14,09:1 à
  progress=0, 6,54:1 à 0,10, **4,27:1 à 0,15** (sous le plancher WCAG AA),
  1:1 à 0,30 — et le lien restait focalisable/cliquable sur toute cette
  plage, un piège de focus clavier, pas seulement un fondu inesthétique
  (distinct de l'arbitrage déjà différé cycle 022 sur le texte non
  interactif). axe-core s'est montré peu fiable pour objectiver ce défaut
  précis (violations intermittentes, couleurs rapportées ne correspondant à
  aucune couleur réelle du bouton) — la mesure de référence retenue est
  l'échantillonnage de pixels direct. Corrigé (commit `a9c6c04`) :
  `pointer-events`/`tabIndex` coupés dès `scrollYProgress > 0,10` (6,54:1,
  marge de sécurité) au lieu d'attendre 0,3 (1:1) ; le fondu visuel
  lui-même est inchangé. Vérifié : 0/36 régression sur les cartes projet du
  §4, 0/6 échec de clic sur le CTA au repos (3 viewports × 2 langues),
  pixel réel de la capture de galerie cohérent avec l'opacité théorique
  (fondu visuel confirmé strictement inchangé). Compteur §6 `hero-cta` :
  1/3 → **2/3**.

- [x] **Cinq contrôles de la scène B du hero (`#profile`/`.hero-content` :
  `.primary-cta` "View selected work", `.build-mode-trigger`, 4×
  `.subtle-link` View CV/Download/GitHub/Contact — plus `.creator-hotspot`,
  sibling indépendant) invisibles (opacité 0) avant `scrollYProgress > 0,3`
  mais restés joignables et activables au clavier** (cycle 048, rotation C
  par réapplication délibérée de la question déjà posée pour `.opening-primary`
  cycles 046-047 — « le correctif ne serait-il pas incomplet ? » — plutôt que
  de la supposer close). `pointer-events: none` ne bloque que la souris ;
  un `<a>`/`<button>` reste dans l'ordre de tabulation et Entrée/Espace
  l'active nativement quel que soit `pointer-events`. Vérifié par Tab réel
  (Playwright) depuis le haut de page : 5 arrêts sur des contrôles à
  `opacity: 0` confirmé (`getComputedStyle`), avant tout scroll. Corrigé
  (commit `2830f0d`) : `.creator-hotspot` gagne `inert={!stateBActive}`
  (bouton isolé, aucun contenu structurel à perdre) ; les cinq contrôles de
  `#profile` gagnent un `tabIndex`/`aria-hidden` individuel plutôt qu'un
  `inert` sur le conteneur — un premier essai avec `inert` sur `#profile`
  a été **rejeté avant commit** : il masquait aussi le seul `<h1>` de la
  page (`#hero-title`, imbriqué dans le même conteneur) à l'arbre
  d'accessibilité pendant toute la scène A, détecté par axe-core
  (`page-has-heading-one`, 0 → 1 violation) avant toute publication — leçon
  d'outillage : `inert` est une solution correcte pour un élément isolé
  (`.creator-hotspot`) mais pas pour un conteneur qui porte aussi du
  contenu structurel non interactif devant rester découvrable. Revérifié
  après correctif définitif : **0 violation axe-core** (1440/390 × EN/FR,
  contre 1 avec le premier essai `inert`), Tab depuis le haut de page saute
  directement de `.city-contact` à `.opening-primary` puis aux cartes
  projet (0 arrêt invisible, EN et FR), les 7 contrôles de scène B restent
  Tab-atteignables et cliquables une fois `scrollYProgress > 0,3` (0/7
  régression), clic réel sur `.creator-hotspot` ouvre toujours le
  "build mode", `reduced-motion` inchangé (`#profile` jamais `inert` dans ce
  mode — c'est l'état statique toujours interactif que ce mode affiche à la
  place du crossfade). Test de clic §4 ciblé (6 projets, 1440px) rejoué
  après correctif : résultat identique au cycle 047 (4/6 modales, cause
  confirmée par les données du projet, aucune régression). Compteur §6 :
  `hero-links` (`.subtle-link`) 1/3 → **2/3** ; nouvelle entrée
  `hero-scene-b-controls` (`.creator-hotspot`/`.primary-cta`/
  `.build-mode-trigger`) **1/3**.

- [x] **`nav` (`.city-nav`) audité sous rotation A pour la première fois — rien
  retenu, deux pistes creusées et écartées avec preuve** (cycle 049).
  `scripts/ui-hierarchy-probe.mjs` (déjà étendu au hero/nav cycles 029/030) :
  `.city-nav` mesure 2 niveaux typographiques à 390px, 3 à 768/1440/1920 —
  sous le seuil de bruit de 4 niveaux (§2 rotation A), 0 near-dup. Deux pistes
  adjacentes investiguées avant de conclure : (1) `#profile` (scène B du hero)
  mesuré à 8 niveaux avec 1 near-dup à 390 uniquement, entre le rôle
  "Analytics Engineer · Junior Data Engineer · France" et le libellé
  "Personal layer" du `.build-mode-trigger` (même 12px/400, luminance à 0.036
  d'écart) — **écarté** après lecture du JSX/CSS : les deux textes sont
  spatialement séparés (colonne du nom vs rangée de CTA sous le paragraphe
  d'intro) et visuellement distingués (`.build-mode-trigger` porte un
  soulignement pointillé et `min-height: 44px`, un vrai bouton, pas du texte
  courant) — coïncidence de métriques de police, pas une duplication
  d'information ; (2) le classement de salience de `#city-content` plaçait le
  sous-titre (paragraphe entier) devant les glyphes du titre `Data systems
  built for clarity.` — **écarté comme artefact d'outillage, pas un défaut
  d'interface** : le titre est découpé en spans par caractère
  (`CharacterLines`), donc chaque span porte une salience individuelle
  minuscule face à un `<p>` mesuré comme un seul bloc ; la capture d'écran
  confirme que le titre domine réellement l'écran. Complété par un run complet
  `scripts/ui-contrast-sweep.mjs` (16 combinaisons, 2 routes × 4 viewports ×
  2 langues) — **0 violation**, confirmant l'absence de régression de
  contraste depuis les correctifs hero des cycles 041-048 — et un run complet
  `scripts/ui-audit.mjs` — **0 violation axe-core, 0 débordement horizontal**
  sur 9/10 combinaisons (la 10e a expiré sur `networkidle`, cause identifiée :
  conflit de port avec un serveur de prévisualisation orphelin d'un cycle
  antérieur jamais arrêté — note d'exploitation ci-dessous, pas un défaut
  d'interface). Troisième piste jugée non actionnable sans mesure
  supplémentaire : `.city-nav-links` (Profile/Projects/Skills/Experience/CV)
  passe en `display: none` sous 768px — vérifié que ce n'est pas une perte
  d'information (toutes les ancres de la page s'atteignent par le scroll
  naturel, `/cv` reste joignable via `.subtle-link` "View CV" du hero), juste
  une perte de raccourci direct vers `/cv#experience` sur mobile — non
  retenu. **Aucun code retouché dans `.city-nav`** — un audit qui ne trouve
  rien à corriger ne consomme pas de passe (§6 compte les retouches, pas les
  audits) : compteur `nav` inchangé à **2/3**. La rotation A est désormais
  posée par écrit sur ce composant et ne devra pas être redemandée sans fait
  nouveau.

- [x] **Note d'exploitation — serveurs `vite dev`/`vite preview` orphelins sur
  le port 5183 depuis des cycles antérieurs, jamais arrêtés, causant un audit
  bloqué** (cycle 049). En amorçant ce cycle, le serveur de développement
  démarré manuellement partageait le port avec au moins deux autres processus
  Node (un `vite preview` et un second `vite dev`) laissés vivants par des
  sessions précédentes — `scripts/ui-audit.mjs` tente de démarrer son propre
  serveur sur ce même port, échoue silencieusement ("Port already in use") et
  la dernière combinaison du run (`laptop-1440/fr/reduced-motion`) a expiré au
  bout de 30s sur `networkidle`, probablement gênée par la contention. Les
  quatre processus orphelins ont été arrêtés (`Stop-Process`) après
  diagnostic ; 9/10 combinaisons du même run avaient déjà produit des données
  exploitables (0 violation, 0 débordement) avant l'expiration. Pas un défaut
  du site ni de l'outillage — une hygiène de session à surveiller : un futur
  cycle qui trouve un run d'audit anormalement lent ou silencieux devrait
  vérifier les processus `node`/`vite` avant de soupçonner une régression.

- [x] **`.city-tag`/`.transition-prompt` (scène A du hero, `src/index.css`)
  se chevauchaient réellement de 16-17px sur toute la largeur mobile,
  pire en français où le message "Scroll to..." était en plus tronqué des
  deux côtés** (cycle 050, trouvé par lecture visuelle directe des captures
  `mobile-390_en/00-top.png` du run `ui-audit.mjs` — pas une rotation A-E
  complète, une anomalie visible dès la première image regardée). Sous
  768px, `.city-content` passe en une seule colonne : `.city-tag` (la
  pastille "Business Intelligence. Data Engineering. Analysis.") devient le
  dernier enfant du flux et se retrouve flush contre le padding bas du
  conteneur — exactement la même ligne "32px au-dessus du bas du viewport"
  que `.transition-prompt` ("Scroll to move..."), positionné indépendamment
  via `position: absolute; bottom: 2rem`. Mesuré par `getBoundingClientRect()`
  aux largeurs 320 à 767px, EN et FR : `y`-overlap de 16 à 17px, `x`-overlap
  jusqu'à 336px (quasi toute la largeur de la pastille) — confirmé
  visuellement par un recadrage de capture, le texte du prompt se peignait
  littéralement à l'intérieur du bas de la pastille noire. En creusant la
  même zone, second défaut trouvé : `.transition-prompt` portait
  `white-space: nowrap`, et le texte français ("Faites défiler pour passer
  du contexte au savoir-faire") est plus large que l'écran sous ~430px —
  mesuré débordant de 10px de chaque côté à 390px, coupé net par
  `.intro-sticky { overflow: hidden }` (pas de débordement horizontal de
  page, donc invisible à `ui-audit.mjs`, mais bien un texte tronqué des
  deux côtés à l'écran). Ni l'un ni l'autre défaut n'est vu par axe-core
  (chevauchement de deux textes lisibles indépendamment, pas un défaut de
  contraste — même angle mort que la collision `.language-toggle` du cycle
  019). Corrigé (`src/index.css`) : `.city-tag` gagne `margin-bottom: 3rem`
  sous 768px (remis à 0 dans le bloc `@media (min-width: 768px)` existant,
  où `.city-tag` passe dans sa propre colonne de grille et ne partage plus
  la ligne du prompt) ; `.transition-prompt` perd `white-space: nowrap` au
  profit de `width: max-content` + `max-width: calc(100vw - 3rem)` (le
  `width: max-content` est nécessaire : sans lui, un élément `position:
  absolute` ancré seulement par `left: 50%` se dimensionne par défaut sur
  "largeur du bloc englobant moins l'offset `left`", pas sur la largeur du
  viewport entier, et le texte anglais plus court se serait mis à passer à
  la ligne lui aussi alors qu'il tient déjà sur une seule). Revérifié :
  0 chevauchement mesuré de 320 à 767px (marge ≥ 15px) dans les deux
  langues, `768/1440/1920` inchangés (le point de contact à 1px déjà
  présent avant tout changement à 768px reste identique — pas une
  régression), 0 débordement horizontal, 0 violation axe-core scopée à
  `.intro-sequence` (3 viewports × 2 langues × 2 préférences de mouvement,
  12 combinaisons), run complet `ui-contrast-sweep.mjs` (2 routes × 4
  viewports × 2 langues) 0 violation. Un run complet `ui-audit.mjs` après
  correctif a signalé 1 violation `color-contrast` isolée sur
  `.opening-primary` à `laptop-1440_en` — élément non touché par ce
  chantier, dont l'instabilité de lecture axe-core est déjà documentée
  (cycles 046-047, « violations intermittentes ») ; 0/5 sur une reprise
  ciblée immédiate au repos, cohérent avec le comportement déjà connu, pas
  une régression de ce correctif. Compteur §6 : nouvelle entrée `city-tag`/
  `transition-prompt` **1/3**.

- [x] **`#contact` (`.contact-section`/`.contact-panel`/`.contact-links`)
  audité sous rotation B pour la première fois, `nav` (`.city-nav`) une
  deuxième fois — rien retenu, plusieurs pistes creusées et écartées avec
  preuve** (cycle 053). Sondes Playwright ad hoc (supprimées après usage) :
  tous les espacements déclarés de `.city-nav`/`.contact-panel`/
  `.contact-links` sont multiples de 4px sauf les paddings des pilules/puces
  (`.city-contact` 0.2rem/0.9rem, `.contact-links a` 0.9rem 1rem, gap
  icône-texte 0.55rem) — vérifiées **non isolées** : ces valeurs forment une
  micro-échelle déjà réutilisée dans une quinzaine de règles à travers tout
  le site (`grep -c "0.9rem" src/index.css` → 18 occurrences ;
  `home-project-evidence`, `home-project-actions`, `pc-cover`,
  `cv-timeline-bullets`, etc.) — un token de fait, pas une valeur oubliée,
  écarté conformément à la consigne de réutiliser les tokens existants (§5).
  Ratio de padding vertical entre `#about`/`#capabilities`/`#contact`/footer
  (112/96/80/48px à 1440) revérifié identique aux valeurs tranchées cycle
  020 — aucune régression. États `:focus-visible` de `.city-nav-links a`,
  `.city-contact` et `.contact-links a` vérifiés non rognés malgré
  `.city-nav { overflow: hidden }` (marge interne ~21px, largement au-dessus
  de l'anneau `outline 2px + offset 4px`). Rotation D et E repassées
  incidemment sur les deux mêmes composants (aucune affirmation non étayée
  dans `#contact`, cibles tactiles déjà conformes) — rien retenu non plus.
  **Aucun code retouché** — un audit qui ne trouve rien à corriger ne
  consomme pas de passe (§6) : compteurs inchangés, `#contact` **1/3**,
  `nav` **2/3**. Les rotations B (les deux composants) et A (`nav`, cycle
  049) sont désormais posées par écrit et ne devront pas être redemandées
  sans fait nouveau ; prochaine rotation naturelle si un cycle y revient :
  **C (mouvement)**, jamais posée sur `.city-nav a:hover`/
  `.contact-links a:hover`.

- [x] **`.city-nav a:hover`/`.contact-links a:hover` audités sous rotation C
  (mouvement) — rien retenu, les cinq rotations A-E sont désormais posées par
  écrit sur les deux composants** (cycle 054). Mesure directe
  (`getComputedStyle(el).transitionDuration` via Playwright `newContext`) :
  les deux transitions (`color` 200ms sur `.city-nav a`, `border-color`/
  `background`/`transform` 180ms sur `.contact-links a`) tombent à
  **0.00001s** sous `reducedMotion: 'reduce'`, grâce à la règle globale déjà
  en place (`index.css:3295`) — aucune règle spécifique à ces composants
  n'a jamais été nécessaire. Ni l'un ni l'autre n'est la seule voie d'accès à
  une information (états `:hover` décoratifs). **Aucun code retouché** — un
  audit qui ne trouve rien à corriger ne consomme pas de passe (§6) :
  compteurs inchangés, `#contact` **1/3**, `nav` **2/3**.

- [x] **`/cv` audité sous rotation B (rythme & espace) pour la première fois —
  rien retenu, quatre des cinq rotations sont désormais posées par écrit sur
  cette route** (cycle 056). Sonde Playwright ad hoc (supprimée après usage) :
  les 7 écarts encre-à-encre entre les 8 blocs de la page valent **48 / 40 /
  56 / 56 / 56 / 56 / 56px, identiques aux 8 combinaisons** (4 viewports × 2
  langues) — tous multiples de 8px, aucune respiration inégale. `.cv-hook`
  compose 73 caractères/ligne en anglais et 77 en français (`max-width: 56ch`
  en dur) : dépasse nominalement le plafond de 75 de la rotation B, mais reste
  dans la fourchette 70-77 déjà qualifiée « normale » au cycle 043 pour le
  token `--measure-lede` (58ch) — pas un fait nouveau. `.cv-hook` réutilise
  une valeur `56ch` propre plutôt que `--measure-lede`, mais l'harmoniser
  aurait élargi la colonne et donc aggravé (pas réduit) l'écart au plafond,
  pour un bénéfice de cohérence interne sans gain de lisibilité mesurable —
  et `cv-page` (compteur §6) est **gelée à 3/3** depuis le cycle 038, donc
  hors dérogation écrite qu'aucune de ces deux observations ne justifie.
  **Aucun code retouché**. Rotations désormais posées par écrit sur `/cv` : A
  (035), B (ce cycle), D (036), E (038) — il ne reste que **C (mouvement)**.

- [x] **`.home-project-card p`/`.home-project-why p` (description et encart
  "Why it matters", partagés par les 6 cartes projet) jamais mesurés en
  caractères/ligne** (cycle 060, rotation B — jamais posée sur ces deux
  sélecteurs précis, seulement sur le paragraphe d'overview de la modale,
  cycles 032/043). Sonde ad hoc (`Range.getClientRects()` sur le texte réel,
  supprimée après usage) sur les 6 cartes × 2 viewports desktop (1440/1920) ×
  2 langues : `.home-project-why p` jusqu'à **109-116 caractères/ligne**
  (carte 04, Vers l'Élysée, les deux viewports/langues), `.home-project-card p`
  jusqu'à **99 caractères/ligne** à 1920 (cartes 01, 05, 06) — bien au-delà du
  plafond de 75 que rotation B fixe, sur des paragraphes qui touchent
  directement le §4 (cartes 03/04/05/06). Corrigé (commit `566f6d0`) :
  `max-width: 52rem` (fixe) → `var(--measure-lede)` (58ch, déjà le token
  tranché pour ce type de copie ailleurs sur le site) sur les deux règles.
  Après : 52-66 caractères/ligne sur les 6 cartes × 2 viewports × 2 langues.
  `.home-project-hook` délibérément non touché : son pire cas mesuré (84
  caractères, un seul cas — Ombrair/EN) reste dans un ordre de grandeur
  proche de la fourchette 70-77 déjà qualifiée « normale » au cycle 056 pour
  `.cv-hook`, contrairement aux 99-116 des deux autres sélecteurs. Revérifié :
  **0/48 régression de clic** sur `.home-project-actions` (4 viewports desktop
  × 2 langues × 6 cartes, même test que le P0 du cycle 042 — les paragraphes
  plus hauts restent absorbés par `overflow-y: auto` sur `.home-project-copy`),
  **0 violation axe-core, 0 débordement horizontal** sur le run complet
  `ui-audit.mjs` (10 combinaisons). Galerie cycle 060.

- [x] **10 fichiers `src/components/`/`src/scroll/` jamais importés par aucun
  fichier vivant** (cycle 063, trouvé par un balayage systématique basename→
  référence sur tout `src/`, en marge de l'audit rotation D). Même famille que
  le premier jet abandonné retiré cycles 015/031/040 (`ProjectCard`,
  `FictifTag`, `LazyMediaSlot`, `DeepDivePage`, `Hero`, `Nav`) — signalé par
  une entrée `.claude/settings.local.json` déjà ancienne (permission de grep
  excluant `PathOrb`/`ProgressMarkers`/`HeroField`/`SectionLabel` d'une
  recherche antérieure) qui montrait que ces fichiers étaient déjà suspectés
  sans avoir jamais été retirés. Trois groupes confirmés morts par grep
  exhaustif (`grep -rl` sur `src/`, aucune occurrence hors le fichier
  lui-même) : `HeroField.tsx`/`PathOrb.tsx`/`ProgressMarkers.tsx`/
  `SectionLabel.tsx` (placeholders hero/nav antérieurs à
  `CinematicOpening.tsx`) ; `ScrollProvider.tsx`/`returnPosition.ts`/
  `scrollSnap.ts` (tout un système de smooth-scroll Lenis + snap au repos +
  restauration de position, remplacé par le scroll natif + `scrollToId.ts`
  actuel — `saveReturnPosition()` était exportée mais jamais appelée nulle
  part, le mécanisme était donc déjà inerte avant même ce nettoyage) ;
  `Reveal.tsx`/`RevealGroup.tsx`/`reveal-core.ts` (trio de reveal-on-scroll ne
  se référençant qu'entre eux, remplacé par les composants reveal de
  `PortfolioMotion.tsx`). Corrigé commit `0bb4e13` : les 10 fichiers
  supprimés. Vérifié : `tsc -b` sans erreur de module manquant (confirmation
  définitive qu'aucun fichier vivant ne les importait), `vite build` vert,
  CSS de prod 87.82 → 85.36 kB (Tailwind ne scanne plus les classes qui
  n'existaient que dans le code mort), JS identique au kilo-octet près (le
  code mort était déjà exclu du bundle par tree-shaking). Aucun rendu
  touché — 0 entrée de galerie pour ce chantier (même règle que les commits
  d'outillage purs, cycles 027/049).

## Terminé

- [x] Cycle 028 — §4 reconfirmé intégralement traité (code réel revérifié, pas
  seulement le journal), zone prioritaire toujours P2 gelée sans fait nouveau
  → cycle retombé en P2 "reste du site". Trois violations axe-core présentes
  depuis les cycles 001-027 (jamais 0 sur aucun run complet, cf. relevés
  répétés "3 violations identiques") corrigées : `aria-prohibited-attr`
  (`.city-heading`), `landmark-unique` (`.pc-nav`), `region`
  (`.language-toggle`). axe-core pleine page, 3 combinaisons (1440 EN, 1440
  FR, 390 EN), après scroll complet : **0 violation** (contre 3 à chaque
  cycle depuis 001). Outillage : bug Windows dans `scripts/ui-gallery.mjs`
  trouvé et corrigé en documentant ce chantier (`:` dans un nom de fichier
  issu de `--sections=viewport:...` faisait échouer l'écriture en silence sur
  NTFS — `slugify()` appliqué au nom de fichier, l'`id` brut reste utilisé
  pour la résolution de l'élément).
- [x] Cycle 027 — Le §4 étant intégralement traité (cycles 024-026, revérifié
  par le code plutôt que le seul journal), audit rotation E (mobile-first) sur
  le reste du site (hors zone prioritaire, gelée en §3). Deux cibles tactiles
  mesurées sous 44px : le CTA « Contact » du header (`.city-contact`,
  70×36px, `min-height` fixe à 36px) et les flèches Previous/Next des 6
  carousels projet (`.pc-arrow`, 30×30px, seul contrôle bouton pour naviguer
  sans clavier). Corrigé commit `cba1747` : les deux portées à 44px, style
  visuel inchangé. `.pc-dot` (points de pagination, 4-18px) délibérément non
  touché : chaque point a un aria-label nommant sa diapositive, et une
  alternative de même fonction (flèches + clavier, vérifié cycle 026) existe
  déjà — l'exception de contrôle équivalent de WCAG 2.5.8 s'applique ; forcer
  44px sur une rangée dense de 7-8 points aurait exigé une refonte du nav de
  carousel. Outillage : `scripts/ui-audit.mjs` durci contre les crashs
  Chromium (voir P2 ci-dessus, commit `e6f49c2`).
- [x] Cycle 022 — Zone prioritaire, rotation C (mouvement), 3 chantiers. Nouvel
  outil `scripts/ui-motion-probe.mjs` (+ `scripts/lib/probe-color.js`, les
  helpers couleur du cycle 021 sortis en un seul exemplaire etalonne) : il mesure
  une animation comme un **intervalle** — `msToFull` (temps jusqu'a la peinture
  pleine apres entree dans la bande de lecture, echantillonnage a 50ms),
  `msUnderFloor` (temps passe **a l'ecran** sous 4,5:1), `deepJump` (saut
  instantane en bas de page) et `clipping` (toute boite `overflow: hidden` dont
  le contenu ne tient pas dedans). Trois constats, tous chiffres : **le masque de
  revelation coupait les jambages des deux titres d'affichage de la zone**
  (`abc9949` — 31 boites en EN, 36 en FR, 2424 pixels de difference a delta
  207/255, defaut permanent et present a l'identique sous `reduce`) ; **la duree
  d'un titre etait fonction du nombre de mots de sa phrase** (`493805a` — 26 mots
  = 2194 a 2449ms, 5 mots = 1263ms, meme composant) ; **la 4e carte de la grille
  restait sous le plancher de contraste pendant 727ms** alors que le cycle 021
  avait porte ce meme numero a 4,94:1 au titre d'un P0 (`3727306`). Deux points
  fermes par la mesure, sans une ligne de code : **aucun contenu invisible si une
  animation ne se declenche pas** (`deepJump` = 0 noeud aux 16 combinaisons) et
  **`reduced-motion` totalement propre** (0 noeud sous opacite 1, 0 style inline
  d'animation). Lecon d'outillage : **deux instruments du meme cycle ne doivent
  pas avoir deux definitions de « le lecteur le regarde »** — la premiere version
  du probe comptait comme « a l'ecran » une carte depassant de 20px au bas du
  pli, et facturait 1532ms de dwell a des noeuds dont la revelation n'avait
  legitimement jamais demarre.

- [x] Cycle 021 — Zone prioritaire, rotation A (hierarchie), 3 chantiers.
  Nouvel outil `scripts/ui-hierarchy-probe.mjs` : salience du premier ecran,
  comptage des niveaux typographiques par fenetre, detection des quasi-doublons.
  **Son premier run etait faux et ne l'a pas dit** — son `parseColor` ne
  connaissait que `rgb()` et sautait en silence tout noeud en `oklch()`, soit,
  sous Tailwind v4, **20 des 35 noeuds de texte de `#capabilities`**, dont les
  deux niveaux les plus bas. Corrige (conversion `oklch()`/`oklab()` → sRGB,
  etalonnee sur deux valeurs connues) avant tout diagnostic. Trois constats, tous
  chiffres : les numeros de carte `01`-`04` peints a **3,47:1** mesures sur les
  pixels reellement peints (`d6eb2d1`, **P0**, plancher §6 a 4,5:1 pour du 12px,
  defaut present depuis l'origine du composant) ; le lien « retour en haut »
  **premier au classement de salience du footer** a 16,76:1 et seul objet portant
  la pilule d'action de la zone, devant trois liens de conversion a 7,65:1
  (`0466c87`) ; et le kicker de `#about` peint **exactement a la luminance de son
  propre corps de texte** quand les deux autres kickers de la zone tiennent
  l'eyebrow a 5,4:1 (`b704c84`). Apres : **plus aucun texte de la zone sous
  4,5:1**, le lien de sortie passe du rang 1 au rang 5, et les trois kickers de
  la zone sont a l'identique au pixel et au point de contraste pres. Lecon
  d'outillage : **un instrument qui ne sait pas lire une valeur ne le dit pas, il
  rend un resultat plus propre** — compter les noeuds mesures avant de croire les
  chiffres qu'ils portent.

- [x] Cycle 020 — Zone prioritaire, rotation B (rythme & espace), 3 chantiers.
  Nouvel outil `scripts/ui-rhythm-probe.mjs` : il mesure le **blanc de queue**
  de chaque section (l'écart entre sa dernière encre et son propre bas) en plus
  des paddings déclarés, ce qui est la seule façon de distinguer un blanc voulu
  d'un blanc subi. Trois constats, tous chiffrés : un lien de carte **tronqué en
  plein mot** de 1024 à 1279px (`3dc9597`, **P0**, contenu invisible — défaut
  présent depuis le cycle 003, jamais vu parce qu'aucun cycle n'avait audité la
  bande 1024-1280) ; une règle unique de sous-titre produisant **58, 95 et 102
  caractères par ligne** selon le bloc (`d8ec9cc`) ; et **306px de blanc de
  queue pour 96 déclarés** sous la grille Capabilities à 1920, avec 108px
  d'écart entre EN et FR du même écran (`4ace013`). Après : chaque écart
  encre-à-encre de la zone **égale exactement son écart CSS déclaré**, aux 4
  viewports et dans les 2 langues. Leçon d'outillage : **les quatre viewports de
  référence de la mission laissent un angle mort entre 1024 et 1440** — c'est
  précisément là que vivait le P0. Tout audit de grille doit désormais
  échantillonner la bande, pas seulement ses bornes.

- [x] Cycle 019 — Zone prioritaire, rotation E (mobile-first réel), 2 chantiers.
  Les deux questions historiques de la rotation E sont closes et le sont restées :
  **11 cibles interactives sur 11 conformes** dans la zone aux 3 viewports
  mesurés et dans les 2 langues, et **aucun scroll horizontal** aux 4 viewports
  (`scrollWidth === innerWidth` partout). Le troisième angle — « les sections du
  bas sont-elles pensées ou juste empilées ? » — a sorti deux constats mesurés :
  le sélecteur de langue défigurait le texte sur la majorité du scroll mobile
  (`42333f3`, requalifié P0), et le paragraphe « Analytical profile » composait
  108 à 110 caractères par ligne sur desktop tout en étant centré sur neuf
  lignes à 390 (`b164c62`). Introduit au système de design : `--measure-lede`
  (58ch), première mesure de lecture nommée du projet. Leçon d'outillage, la
  troisième de la série 017-018-019 : **un élément `position: fixed` apparaît à
  sa position de document, et non à sa position d'écran, dans une capture
  d'élément plus haute que le viewport** — c'est pourquoi « Skip to content »
  semblait posé au milieu des cartes Capabilities.

- [x] Cycle 018 — Zone prioritaire, rotation D (crédibilité), 3 chantiers, tous
  issus de mesures et non d'impressions : kicker de contact rendu à
  l'eyebrow du reste de la page (`b95e3ef`), contraste des trois kickers porté
  de 4.49:1 à ~5.4:1 (`1cb67ee`, P0 §6), cibles tactiles des trois liens du
  footer portées à 44px de large (`6416659`). Leçon d'outillage symétrique de
  celle du cycle 017 : une capture d'élément prise **avant** un reveal ne
  mesure pas le rendu — les `.capability-card` apparaissaient vides dans
  `capabilities.png` alors qu'elles sont intactes après un scroll complet.

- [x] Cycle 017 — Zone prioritaire, rotation C (mouvement), 3 chantiers :
  lisibilité du paragraphe "Analytical profile" pendant sa révélation
  (`d614ce8`, P0 contraste 1.64:1 → 5.2:1 + fenêtre de révélation recentrée),
  stagger des cartes Capabilities calé sur le nombre de colonnes réel plutôt
  que sur l'index de grille (`6d8b1ad`), entrée des cartes par translation au
  lieu d'une mise à l'échelle (`4c7aa53`, qui résout au passage le faux
  diagnostic "42px" du cycle 016). Outillage : `scripts/ui-gallery.mjs` gagne
  `--prescroll=no` et `--settle=<ms>` — sans ça le passage de préchauffage
  consomme les reveals `once: true` et un chantier d'animation ne peut pas
  avoir de paire AVANT/APRÈS du tout.
- [x] Cycle 016 — Zone prioritaire, rotation B (rythme & espace), 3 chantiers :
  lisibilité du sélecteur de langue flottant (`264d58e`), remise de la
  section Capabilities au niveau typographique et rythmique de ses voisines
  (`8c77001`), cible tactile du bouton "retour en haut" (`d0548d3`). Outillage :
  `scripts/ui-zone-audit.mjs` (audit ciblé avec timeout par étape) et
  `scripts/ui-gallery.mjs` étendu (un bloc de galerie par chantier, sélecteur
  brut, cadrage `viewport:<cible>@<y>`).
- [x] Cycle 002 — Tous les P0 de la zone prioritaire résolus : reduced-motion
  `AnimatedLetter`, fenêtre de révélation du titre "Analytical profile",
  footer de clôture (+ resserrage de l'espace mort), contraste du toggle de
  langue. Plus 2 chantiers P1 : lien CV et rééquilibrage vertical du panneau
  de contact. Commits `1a756ce`, `00691e7`, `85140a2`, `10eacfb`.
- [x] Cycle 001 — Amorçage : `scripts/ui-audit.mjs`, branche `auto/ui-loop`,
  `docs/ui-loop/{BACKLOG,QUESTIONS}.md`, premier audit complet de la zone
  prioritaire, inventaire des 3 projets existants + 3 projets à intégrer.
