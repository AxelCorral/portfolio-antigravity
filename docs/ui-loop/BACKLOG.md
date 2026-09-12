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

- [ ] **axe-core ne juge pas le contraste de cette page** (cycle 021) : **0
  violation `color-contrast` et 494 noeuds `incomplete`**, motif dominant
  « background color could not be determined due to a pseudo element » (les halos
  `::before` de `.capability-card` et `.about-card`) et « overlapped by another
  element ». Vingt journaux ont relu « 3 violations, aucune de contraste » comme
  un feu vert ; ce n'en etait pas un, et c'est ainsi qu'un texte a 3,47:1 a
  survecu vingt cycles. Piste : mesurer le contraste dans le probe maison plutot
  que d'attendre d'axe qu'il le fasse — c'est deja le cas depuis ce cycle, mais
  le probe ne couvre que les 4 sections de la zone prioritaire. **P2 — etendre
  la couverture du probe au reste de la page.**

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
- [ ] **`ui-gallery.mjs` ne sait pas figer une revelation d'une demi-seconde**
  (cycle 022). Avec `--prescroll=no`, le script appelle `scrollIntoViewIfNeeded()`
  **avant** de caler la cible a son `@y`, si bien que l'observateur declenche
  pendant ce premier scroll : le `--settle` demande ne compte pas a partir du
  debut de l'animation mais d'un instant inconnu, plus tard. Concretement, il a
  fallu quatre essais (`600`, `180`, `420`, puis `0` ms avec `@560`) pour obtenir
  une paire AVANT/APRES ou la cascade des cartes est encore visible — les trois
  premiers montraient deux images identiques, donc une preuve nulle. Piste :
  un mode `--freeze-at=<ms>` qui arme un `IntersectionObserver` temoin sur la
  cible, cale la page, **puis** compte le delai a partir du declenchement reel.
  **P2 — outillage.**

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
  laissés en place — hors périmètre de ce chantier.
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
