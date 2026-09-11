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

- [ ] **Vers l'Élysée** — carte projet + page détail + section démo (iframe
  live vers `political-destiny.vercel.app` en priorité, format §5.1). Angle :
  démarche de modélisation, ton neutre (sujet politique). Aucun repo GitHub
  mentionné dans MISSION-UI.md : à confirmer avant d'ajouter un lien "View
  repository" (voir QUESTIONS.md). Vérifié cycle 003 : `curl -I
  https://political-destiny.vercel.app` → `200 OK`, aucun `X-Frame-Options`
  ni `Content-Security-Policy: frame-ancestors` — iframe live confirmée
  réalisable (format 1).
- [ ] **Ombrair** — carte projet + page détail + section démo (iframe live vers
  `ombrair.vercel.app`, avec mise en avant de l'affichage 3D produit). Angle :
  vitesse d'exécution, pilotage agentique. Statut fictif de l'entreprise à
  rendre explicite dans le texte. Vérifié cycle 003 : `curl -I
  https://ombrair.vercel.app` → `200 OK`, aucun en-tête bloquant — iframe
  live confirmée réalisable (format 1).
- [ ] **Analyse vidéo football (introduction)** — section d'introduction
  uniquement, sans lien code/démo live (projet non public). Démo en format 2
  (vidéo/capture animée) ou 3 (carrousel), à produire à partir de rendus du
  pipeline (minimap, heatmaps) — jamais de captures TV ni logos de club/compét.
  Média à produire ou besoin à consigner dans QUESTIONS.md si aucun asset
  n'est disponible dans le repo.

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

- [ ] **Le voile du sélecteur de langue masque un mot de carte sur 390px** à
  certaines positions de scroll (visible dans la paire APRÈS de la galerie
  cycle 016 : "…and reporting [EN] models"). C'est un progrès net sur la
  superposition illisible d'avant, et le mot réapparaît dès qu'on scrolle de
  quelques pixels, mais ce n'est pas un état final. Pistes : gouttière droite
  réservée sur les cartes en mobile, ou masquage du toggle au scroll
  descendant.
- [ ] `aria-prohibited-attr` sur `.city-heading` (hero) — attribut ARIA non
  permis, à corriger.
- [ ] `landmark-unique` — `.pc-nav` du carrousel projet 01 dupliqué sans nom
  accessible distinct par slide/instance.
- [ ] `region` — `.language-toggle` hors de tout landmark (violation axe
  moderate, cosmétique du point de vue lecteur d'écran).
- [ ] Bundle JS 641 kB (215 kB gzip), warning Vite "chunk > 500kB" au build.
  Pas urgent (pas de garde-fou performance chiffré dans la mission), mais à
  garder à l'œil si de nouvelles démos iframe/vidéo alourdissent encore le
  bundle initial.
- [ ] **`scripts/ui-audit.mjs` semble se bloquer sur un run complet** :
  observé cycle 015, le run s'est arrêté sans erreur ni progression pendant
  14+ minutes au milieu du scroll progressif du viewport `desktop-1920_en`
  (dernier fichier écrit : `scroll-01-y400.png`), alors qu'un script minimal
  équivalent (1440 + 390, FR/EN, scroll + captures ciblées) s'exécute en
  moins de 2 minutes sans problème. Cause non identifiée (candidats :
  `page.screenshot({fullPage:true})` qui attend un événement réseau/police
  qui ne se résout jamais sur ce viewport précis, ou le scan axe-core qui
  bloque). À investiguer avant de compter dessus pour un audit complet —
  ajouter un timeout explicite par étape pour fail-fast plutôt qu'un blocage
  silencieux.

## Terminé

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
