# Journal — Boucle d'amélioration continue UI

> Ordre antéchronologique : la dernière entrée est en haut.
> Ce fichier est la **seule mémoire** entre les cycles. Il doit toujours permettre
> à une session neuve de reprendre sans rien relire d'autre que `MISSION-UI.md`.

---

## Cycle 016 — 2026-09-11 22:30

**Zone travaillée** : zone prioritaire (§3) — `#capabilities` (titre de section
et rythme interne des 4 cartes), `.language-toggle` là où il flotte au-dessus
de cette zone, `.site-footer` (cible tactile du bouton « retour en haut »).
**Rotation de questions** : **B — Rythme & espace**, première rotation B
exploitée en profondeur (cycles précédents : D, E, D, A).

> Note de journalisation : les phases 1 à 6 de ce cycle ont été exécutées dans
> une session qui s'est arrêtée **pendant** la phase 7 — les trois commits
> étaient sur la branche et l'audit écrit, mais la galerie n'avait qu'un bloc
> sur trois et `PROGRESS.md` n'était pas à jour. Cette session a repris le
> cycle à la phase 6 : re-vérification complète sur l'état actuel du code
> (4 viewports × 2 langues × reduced-motion), puis phase 7 complète. Aucun
> quatrième chantier n'a été ouvert : le plafond de la Phase 4 est de 3.

### Constats d'audit

Audit complet dans `docs/ui-loop/AUDIT-2026-09-11-cycle-016.md`. Résumé :

- Le sélecteur de langue (`position: fixed`, fond entièrement transparent par
  parti pris) s'imprimait **littéralement** sur le texte des `.capability-card`
  sur 390px, où les cartes occupent toute la largeur : « Clear conclusions from
  complex sub**[EN]**ects ». Deux textes clairs superposés — le contraste n'est
  pas seulement < 4.5:1, il n'est pas défini — 390 — **P0**.
- `.work-heading` était en `clamp(1.25rem, 3vw, 2.5rem)`, soit **20px sur 390 et
  40px sur 1440**, entre un « Analytical profile » à 72px et un « Let us talk
  about… » à 86px : la section `#capabilities` n'avait pas de titre perçu sur
  mobile, elle commençait par un mur de cartes — 390 et 1440 — **P1**.
- Vides subis dans `.capability-card` : `justify-content: space-between` sur une
  hauteur de ligne fixe (420px/480px) répartissait le reliquat en deux poches
  variables, si bien que **les quatre titres de carte ne partageaient aucune
  ligne de base** (`y = 436/436/445/445` à 1440) — 1440 et 390 — **P1**.
- `gap` de `.work-grid` **rétrécissant quand le viewport grandissait**
  (12 → 8 → 4px) : à 1440 les quatre cartes se lisaient comme une dalle unique
  striée de filets, et aucune des trois valeurs ne reprenait l'échelle du reste
  de la page (`.home-project-list` : 1rem) — 1440 — **P1**.
- Longueur de ligne (3e question de la rotation B) : conforme partout
  (`.about-card p` en `max-w-3xl`, `.contact-panel p` en `max-w: 42rem`).
- Acquis des cycles précédents revérifiés intacts : reduced-motion du bloc
  Analytical profile (cycle 002), halo `--pc-amber-dim` (cycle 015), footer de
  clôture, aucun contenu invisible au scroll réel, aucun overflow horizontal.

### Changements livrés
- `264d58e` — ui(language-toggle): rendre le sélecteur lisible quand il flotte
  sur du contenu (voile radial `--overlay-scrim`, nouveau token, sans bord ni
  arête pour préserver le parti « typographie nue »). Ajoute aussi
  `scripts/ui-zone-audit.mjs` : audit ciblé de la zone prioritaire avec
  **timeout explicite par étape**, écrit parce que `ui-audit.mjs` se bloque
  silencieusement (backlog P2). Run complet en < 3 min.
- `8c77001` — ui(capabilities): remettre la section au niveau typographique et
  rythmique de ses voisines (reprise du pattern `.home-section-heading`
  kicker/h2/intro déjà utilisé par la section des slides projets, nouveau
  kicker FR+EN ; rythme interne de carte explicite 32/24/16px, carte
  dimensionnée par son contenu, lien épinglé en bas ; `gap` de `.work-grid`
  unifié à 1rem).
- `d0548d3` — ui(footer): porter le bouton « retour en haut » à 44px de hauteur
  tactile (39px mesuré auparavant).

### Vérification
- Build : ✅ (`npm run build` = `tsc -b && vite build`, vert ; CSS 94.04 kB,
  JS 644.14 kB — pas de dérive par rapport au cycle 015)
- Viewports vérifiés : 390 / 768 / 1440 / 1920 (run `zone-c016-after`,
  10 combinaisons viewport × langue × motion, 0 erreur console, 0 overflow
  horizontal sur les 10)
- Langues : FR ✅ EN ✅ (kicker « COMPÉTENCES / PREUVES », titre, sous-titre et
  les 4 cartes traduits, aucun texte orphelin)
- reduced-motion : ✅ (1440 FR + EN : titre, sous-titre et les 4 cartes en
  opacité pleine, aucune animation résiduelle)
- Nav clavier : ✅ — les 4 familles de cibles de la zone (`.capability-card a`,
  `.contact-links a`, `.site-footer-links a`, `.site-footer-top`) reçoivent
  bien `:focus-visible` avec un contour `solid 2px` et 4px d'offset.
- Rythme mesuré après coup : titres de carte à **101px** du haut de carte et
  liens à **25px** du bas, sur les 4 cartes, en 390/768/1440 et dans les 2
  langues. Les hauteurs de carte sont désormais égales par rangée
  (1440 : 394px × 4 en EN, 414px × 4 en FR).
- Contraste mesuré (couleurs résolues via canvas — un parsing manuel lit faux
  les couleurs `oklch()`) : kicker 4.52:1, titre h2 14.26:1, sous-titre 8.27:1,
  titre de carte 11.56:1, item de carte 6.19:1, lien de carte 11.56:1, toggle
  inactif 5.42:1. Aucune violation axe `color-contrast` sur les 10 runs.
- axe-core : 3 violations, **identiques à celles du cycle 001**, toutes hors
  zone prioritaire ou cosmétiques (`aria-prohibited-attr` sur `.city-heading`,
  `landmark-unique` sur `.pc-nav`, `region` sur `.language-toggle`). Aucune
  nouvelle violation introduite.
- Régression détectée : non.

### Reverté
- Aucun.

### Outillage ajouté ce cycle
- `scripts/ui-zone-audit.mjs` (commit `264d58e`) — audit ciblé de la zone
  prioritaire, timeout par étape, contournement du blocage de `ui-audit.mjs`.
- `scripts/ui-gallery.mjs` étendu pour que la galerie respecte « **un bloc par
  chantier**, pas par cycle » (§7bis) : le filtre de régénération ne remplaçait
  que par numéro de cycle, donc le 2e chantier d'un cycle effaçait le bloc du
  1er. Il compare maintenant le préfixe de fichier des captures. Ajout aussi
  d'un sélecteur CSS brut (`.site-footer` n'a pas d'id) et du cadrage
  `viewport:<cible>@<y>` — sans ancrage sur un élément, la paire AVANT/APRÈS du
  sélecteur de langue tombait sur une zone vide et ne montrait rien, d'où sa
  régénération.

### État des chantiers structurels
- Vers l'Élysée : non commencé (iframe vérifiée réalisable cycle 003)
- Ombrair : non commencé (iframe vérifiée réalisable cycle 003)
- Analyse vidéo football : non commencé
- Démos projets existants : 3/3 conformes (inchangé depuis cycle 003)

### Prochain cycle — point de reprise exact
- Ouvrir le chantier « Vers l'Élysée » (§4.1), premier P1 de l'ordre imposé
  maintenant que la zone prioritaire n'a plus de P0/P1 ouvert : lire d'abord
  les conventions de carte projet dans `OnePage.tsx` (liste `.home-project-*`
  et `ProjectDetailModal`) pour s'y intégrer sans créer de pattern parallèle,
  puis carte projet + vue détail + démo iframe vers
  `political-destiny.vercel.app` (en-têtes déjà vérifiés cycle 003). Ton neutre
  imposé, angle « démarche de modélisation », titre affiché « Vers l'Élysée »
  (jamais « political destiny »), pas de lien repo tant que Q2 n'est pas
  tranchée.
- Chantier de zone prioritaire à mener en parallèle (§3 impose au moins un par
  cycle) : porter `.capability-card a` de 42px à 44px de hauteur tactile —
  dernier écart mesuré de la zone, nouvellement consigné au backlog P2.

### Questions bloquantes ouvertes
- Q1, Q2, Q3, Q4 — voir `docs/ui-loop/QUESTIONS.md` (inchangées). Aucune
  nouvelle question ce cycle : les trois chantiers étaient des décisions
  d'exécution, pas des arbitrages factuels.

---

## Cycle 015 — 2026-09-11 17:40

**Zone travaillée** : zone prioritaire (§3) — identité visuelle du bloc
"Analytical profile". Chantier annexe : nettoyage de code mort dans
`src/sections/`.
**Rotation de questions** : A (Hiérarchie), avec la question nommée
explicitement par MISSION-UI.md §3 ("le bloc a-t-il une raison d'exister
visuellement, ou est-ce un paragraphe posé ?") comme fil conducteur, en
poursuite directe du point de reprise de cycle 003 (audit frais de la zone
prioritaire avant de passer aux nouveaux projets).

### Constats d'audit
- Build initial ✅. Le script `scripts/ui-audit.mjs` s'est bloqué sans
  erreur pendant 14+ minutes au milieu du scroll progressif du viewport
  `desktop-1920_en` (dernier fichier écrit : `scroll-01-y400.png`) — tâche
  arrêtée, remplacée par un script d'audit ciblé ad hoc (1440/390, FR/EN,
  captures de section) qui s'exécute en < 2 min sans problème. Cause du
  blocage non identifiée, consignée en P2 dans `BACKLOG.md` pour
  investigation future — ne pas relancer un run complet sans surveillance.
- Comparaison visuelle top-de-page / zone prioritaire (Rotation A) : le hero
  (photo, nav semi-transparente, tags) et les slides projets (visuels de
  graphiques, cartes à deux panneaux) ont une richesse texturale que la
  zone prioritaire n'avait pas entièrement rattrapée. `.contact-panel` avait
  déjà un radial-gradient (ajouté cycle 002) et `.work-section` a un
  `bg-noise`, mais `.about-card` ("Analytical profile") restait un fond
  plat `#101010` sans aucune texture — **P1**, réponse directe à la
  question nommée par la mission pour cette section précise.
- Les cartes "Capabilities", le panneau de contact et le footer, revérifiés
  visuellement (1440/390, FR/EN) : aucune régression, liens différenciés
  toujours en place (cycle 003), contraste toggle de langue toujours bon,
  footer toujours un point de clôture net — rien de nouveau à corriger
  dans ces trois blocs ce cycle-ci.
- En grepant l'usage réel de `src/sections/*.tsx` pour comprendre la
  richesse relative des blocs, confirmation que `About.tsx`, `Contact.tsx`,
  `Stack.tsx`, `Manifeste.tsx`, `FlowProjets.tsx` restent non importés
  (comme noté au cycle 001) et découverte que `Hero.tsx` et `Nav.tsx` du
  même dossier sont **également** morts (non repérés par l'audit initial) —
  **P2**, largement au-delà du seuil "2 cycles" de confirmation du
  garde-fou anti-suppression hâtive.

### Changements livrés
- `4d289d4` — ui(about): donner une identité visuelle propre au bloc
  Analytical profile (radial-gradient discret au token `--pc-amber-dim`,
  cohérent avec le traitement déjà appliqué à `.contact-panel`).
- `b1c77a5` — chore(sections): supprimer le premier jet abandonné non
  importé (`About`, `Contact`, `Stack`, `Manifeste`, `FlowProjets`, `Hero`,
  `Nav` dans `src/sections/`). Effet mesurable : CSS de prod
  106.68 kB → 94.04 kB (classes Tailwind scannées dans ces fichiers morts
  purgées). `DeepDive.tsx` (seul fichier encore utilisé du dossier) conservé.

### Vérification
- Build : ✅ (`npm run build` vert avant et après chaque commit ; `tsc -b`
  inclus dans le script `build`)
- Viewports vérifiés : 390 / 1440 (audit ciblé ad hoc ; 768/1920 non
  revérifiés ce cycle faute d'un run complet fiable de `ui-audit.mjs`, voir
  constat P2 ci-dessus — à refaire dès que le script est stabilisé)
- Langues : FR ✅ EN ✅
- reduced-motion : ✅ (aucune animation ajoutée, changement CSS statique
  uniquement ; suppression de fichiers non importés donc sans effet runtime)
- Régression détectée : non — capture avant/après du bloc "Analytical
  profile" comparée côte à côte, `console errors: []` après le nettoyage de
  `src/sections/`, capture full-page post-nettoyage inspectée visuellement
  (hero, slides, zone prioritaire tous intacts)

### Reverté
- Aucun

### État des chantiers structurels
- Vers l'Élysée : non commencé (vérification technique iframe faite cycle
  003 : `political-destiny.vercel.app` sans en-tête bloquant)
- Ombrair : non commencé (vérification technique iframe faite cycle 003 :
  `ombrair.vercel.app` sans en-tête bloquant)
- Analyse vidéo football : non commencé
- Démos projets existants : 3/3 conformes (inchangé depuis cycle 003)

### Prochain cycle — point de reprise exact
- La zone prioritaire (§3) est maintenant jugée au niveau du haut de page
  sur les critères audités à ce jour (identité visuelle, contraste,
  reduced-motion, clôture de page, liens différenciés). Passer au chantier
  P1 suivant dans l'ordre de priorité imposé (§2 Phase 4) : intégration de
  "Vers l'Élysée" (carte projet + page détail + section démo iframe vers
  `political-destiny.vercel.app`, ton neutre imposé par le sujet politique,
  angle "démarche de modélisation" pas "jeu"). Avant de coder l'iframe,
  vérifier les conventions existantes du composant carte/carrousel projet
  dans `OnePage.tsx`/`ProjectShowcaseCard` pour s'y intégrer sans créer de
  pattern parallèle. Traiter ensuite Ombrair dans la foulée si le contexte
  le permet (même mécanique d'iframe, même niveau de vérification
  technique déjà fait cycle 003). Continuer de consacrer au moins un
  chantier par cycle à la zone prioritaire pendant ce travail, même mineur
  (ex. le point P2 "vide en bas des cartes Capabilities", ou rejouer un
  audit Rotation B/C sur mobile une fois `ui-audit.mjs` stabilisé ou son
  successeur ad hoc formalisé).

### Questions bloquantes ouvertes
- Q1, Q2, Q3, Q4 — voir `docs/ui-loop/QUESTIONS.md` (inchangées depuis
  cycle 001). Q2 et Q3 (repo GitHub public pour Vers l'Élysée / Ombrair)
  redeviennent pertinentes dès le prochain cycle puisque leur chantier
  commence.

---

## Cycle 003 — 2026-09-11 (reconstitué a posteriori)

> Note de journalisation : cette entrée est écrite au cycle 004, après coup.
> Le cycle 003 avait bien exécuté les phases 1 à 6 (travail vérifié et commité :
> `06314b8`, `0f6ebdf`) mais la session s'était arrêtée avant la phase 7 — le
> brouillon de journal (`PROGRESS.md`, `BACKLOG.md`, l'audit cycle 002) était
> resté en modifications non commitées, sans entrée "Cycle 003" écrite.
> Reconstitué ici à partir des commits et de `BACKLOG.md` pour ne pas perdre le
> point de reprise — cf. règle §7 "un cycle non journalisé est un cycle perdu".

**Zone travaillée** : zone prioritaire (§3) — crédibilité de la section
"Capabilities" (les 4 cartes de compétence). Vérifications annexes : en-têtes
HTTP des démos à déployer (`political-destiny.vercel.app`, `ombrair.vercel.app`,
`jobtrackr-lake.vercel.app`) pour préparer le chantier §4/§5.
**Rotation de questions** : D (Crédibilité), poursuite directe du point de
reprise noté en fin de cycle 002.

### Constats d'audit
- Les 4 cartes "capabilities" pointaient toutes vers `#contact` avec un CTA
  générique alors que le titre de section promet des compétences "reliées à
  des projets réels" (AUDIT-2026-09-11 P1, confirmé cycle 002) — 1440 et 390
  — **P1**.
- Vide résiduel en bas de carte (`.capability-card`, `justify-content:
  space-between` sur hauteur de ligne fixe 480px à partir de 1024px) : la
  variation de hauteur du vide entre cartes selon la longueur du texte reste
  présente — jugé mineur une fois le lien différencié en place, non traité.
- `curl -I https://political-destiny.vercel.app` → `200 OK`, aucun
  `X-Frame-Options` ni `Content-Security-Policy: frame-ancestors` — iframe
  live confirmée réalisable (format 1, §5) pour le futur chantier "Vers
  l'Élysée".
- `curl -I https://ombrair.vercel.app` → `200 OK`, aucun en-tête bloquant —
  iframe live confirmée réalisable pour le futur chantier "Ombrair".
- `curl -I https://jobtrackr-lake.vercel.app` → `X-Frame-Options: DENY` —
  iframe bloquée par l'application elle-même ; décision définitive de rester
  au carrousel de captures annotées déjà en place (format 3, conforme à la
  règle "si l'iframe est bloquée, descends d'un niveau").

### Changements livrés
- `06314b8` — ui(capabilities): lier chaque carte de compétence à une preuve
  concrète (BI → `/cv#experience`, Data Engineering → Football Data Pipeline,
  Analytical Projects → Retirement Sustainability Model, Portfolio Systems →
  profil GitHub, au lieu d'un `#contact` générique partagé par les 4 cartes).
- `0f6ebdf` — ui(capabilities): resserrer le vide vertical avant/après la
  section Capabilities.

### Vérification
- Build : ✅ (`npm run build` vert avant chaque commit)
- Viewports vérifiés : 390 / 768 / 1440 / 1920 (revue visuelle manuelle ;
  aucun run `ui-audit.mjs` complet dédié à ce cycle avant l'arrêt de session)
- Langues : FR ✅ EN ✅
- reduced-motion : ✅ (aucune animation nouvelle introduite)
- Régression détectée : non

### Reverté
- Aucun

### État des chantiers structurels
- Vers l'Élysée : non commencé (vérification technique iframe faite, voir
  constats d'audit)
- Ombrair : non commencé (vérification technique iframe faite, voir constats
  d'audit)
- Analyse vidéo football : non commencé
- Démos projets existants : 3/3 conformes (JobTrackr confirmé définitivement
  en format 3 — carrousel — l'iframe étant bloquée côté application)

### Prochain cycle — point de reprise exact
- Le lien différencié par carte "Capabilities" fermait le dernier chantier P1
  ouvert dans la zone prioritaire (§3). Lancer un audit complet frais
  (`node scripts/ui-audit.mjs`) sur l'état actuel du code pour vérifier s'il
  reste des P0/P1 non détectés dans la zone prioritaire, avec une rotation de
  questions encore peu exploitée (A — Hiérarchie, ou B — Rythme & espace).
  Si la zone prioritaire est confirmée propre, passer au chantier P1 suivant
  dans l'ordre de priorité imposé (§2 Phase 4) : intégration des nouveaux
  projets (§4), en commençant par "Vers l'Élysée" (iframe déjà vérifiée
  techniquement réalisable ce cycle).

### Questions bloquantes ouvertes
- Q1, Q2, Q3, Q4 — voir `docs/ui-loop/QUESTIONS.md` (inchangées depuis cycle 001).

---

## Cycle 002 — 2026-09-11 (reconstitué a posteriori)

> Note de journalisation : cette entrée est écrite au cycle 003, après coup.
> Le cycle 002 avait bien exécuté les phases 1 à 6 (travail vérifié, commité,
> et même partiellement audité dans `docs/ui-loop/AUDIT-2026-09-11-cycle-002.md`)
> mais la session s'était arrêtée avant la phase 7. Reconstitué ici à partir
> des commits, de `BACKLOG.md` et de l'audit cycle 002 pour ne pas perdre le
> point de reprise — cf. règle §7 "un cycle non journalisé est un cycle perdu".

**Zone travaillée** : zone prioritaire (§3) — section "Analytical profile"
(reduced-motion, fenêtre de révélation du titre) et clôture de page (footer,
contraste du toggle de langue, lien CV, panneau de contact).
**Rotation de questions** : E (Mobile-first réel), en reprise directe des
constats P0 du cycle 001.

### Constats d'audit
- Confirmation visuelle post-fix : `AnimatedLetter` s'affiche en opacité
  pleine sous reduced-motion (laptop-1440) — corrige P0-1 cycle 001.
- Footer mobile-390 recomposé en colonne centrée (pas un simple empilement
  du layout desktop), liens `.site-footer-links a` avec `min-height: 44px` —
  conforme zones tactiles.
- Contraste bouton de langue inactif recalculé : `rgba(225,224,204,0.58)` sur
  fond noir ≈ 5.41:1 (seuil AA 4.5:1) — marge suffisante.
- Fenêtre de révélation du titre "Analytical profile" resserrée mais non
  revérifiée en scroll continu rapide réel (limite outil : captures pas à
  pas) — à surveiller si le problème réapparaît visuellement.
- Constat additionnel non retraité ce cycle-là : les 4 cartes "Capabilities"
  restent visuellement identiques avec un vide non maîtrisé en bas de carte
  — laissé en P1 pour un cycle suivant (traité cycle 003, voir plus bas).

### Changements livrés
- `1a756ce` — ui(about): respecter reduced-motion et le rythme de scroll réel
- `00691e7` — ui(nav): contraste du bouton de langue inactif conforme WCAG AA
- `85140a2` — ui(footer): footer de clôture, lien CV et rééquilibrage du panneau contact
- `10eacfb` — ui(footer): resserrer l'espace mort entre le panneau contact et le footer

### Vérification
- Build : ✅ (`npm run build` vert avant chaque commit)
- Viewports vérifiés : 390 / 768 / 1440 / 1920 (run `2026-09-11T11-34-08-514Z`)
- Langues : FR ✅ EN ✅
- reduced-motion : ✅ (c'est la vérification qui a confirmé le fix P0-1)
- Régression détectée : non

### Reverté
- Aucun

### État des chantiers structurels
- Vers l'Élysée : non commencé
- Ombrair : non commencé
- Analyse vidéo football : non commencé
- Démos projets existants : 2/3 pleinement conformes (inchangé depuis cycle 001)

### Prochain cycle — point de reprise exact
- Traiter le P1 "Crédibilité de la zone Capabilities" (BACKLOG.md) : les 4
  cartes pointent toutes vers `#contact` avec un CTA générique alors que le
  titre de section promet des "compétences reliées à des projets réels".

### Questions bloquantes ouvertes
- Q1, Q2, Q3, Q4 — voir `docs/ui-loop/QUESTIONS.md` (inchangées depuis cycle 001).

---

## Cycle 001 — 2026-09-11 (amorçage)

**Zone travaillée** : infrastructure d'audit + inventaire complet + audit de
la zone prioritaire (§3). Aucun code de production modifié (règle §8 :
"ne code rien d'autre pendant ce cycle").
**Rotation de questions** : D (Crédibilité), avec incursions B (Rythme &
espace) et C (Mouvement) sur des bugs trouvés en cours d'audit.

### Constats d'audit
- AnimatedLetter (paragraphe "Analytical profile") n'a aucune variante
  `prefers-reduced-motion` — texte reste partiellement opaque indépendamment
  du réglage — tous viewports — **P0**.
- Titre "Analytical profile" (`WordsPullUpMultiStyle`) : fenêtre d'animation
  (~2,5 s) plus longue que le temps de traversée de la carte à vitesse de
  scroll normale/rapide sur desktop — texte vu tronqué — 1440 — **P0**.
- Aucun élément de clôture après la section contact (pas de `<footer>`, pas de
  retour en haut, pas de mentions) — fin de page abrupte confirmée — tous
  viewports — **P0**.
- Contraste insuffisant sur le bouton de langue inactif (`.language-toggle-btn`),
  violation axe `color-contrast`, reproduite sur mobile-390 EN/FR — **P0**
  (garde-fou contraste, site-wide).
- 4 cartes "capabilities" visuellement identiques, vide non maîtrisé en bas de
  carte, "Learn more" générique vers `#contact` sans lien vers la preuve
  projet correspondante — 1440 et 390 — **P1**.
- Panneau de contact : `align-items: end` sur la grille laisse un grand vide
  non composé au-dessus des liens (desktop/tablette) — **P1**.
- LinkedIn et lien CV absents du bloc de contact réellement servi (seule une
  version non utilisée de `Contact.tsx` a un lien LinkedIn, en `href="#"`
  placeholder) — **P1**, LinkedIn bloqué en attente d'URL réelle (Q1).
- Violations axe mineures hors zone prioritaire : `aria-prohibited-attr` sur
  `.city-heading`, `landmark-unique` sur `.pc-nav` du carrousel projet 01,
  `region` sur `.language-toggle` — **P2**.
- CLS bas sur tous les runs (0.0004–0.0025, ~0.0245 en reduced-motion —
  toujours < seuil "good"), aucun scroll horizontal parasite, aucune erreur
  console/page — **positif, à ne pas régresser**.
- `src/sections/{About,Contact,Stack,Manifeste,FlowProjets}.tsx` ne sont pas
  importés par la page réellement servie (`OnePage.tsx` via `App.tsx`) —
  probable premier jet abandonné, à confirmer avant suppression — **P2**.

### Changements livrés
- Ajout `scripts/ui-audit.mjs` — script Playwright réutilisable : 4 viewports
  × 2 langues, capture top/scroll progressif (pas 400px)/full-page/sections
  ciblées, passe hover + focus-visible (clavier) + reduced-motion dédiée, scan
  axe-core, métriques CLS/FCP, détection overflow horizontal.
- Création `docs/ui-loop/BACKLOG.md`, `docs/ui-loop/QUESTIONS.md`,
  `docs/ui-loop/AUDIT-2026-09-11-cycle-001.md`.
- `.gitignore` : ajout de `docs/ui-loop/screenshots/` (run initial = 277
  fichiers, 173 Mo — régénérable, ne doit pas entrer dans l'historique git).
- Inventaire complet des projets existants (3 : Football Data Pipeline,
  JobTrackr, Retirement Sustainability Model — tous ont déjà une démo
  conforme §5) et des 3 projets à intégrer de A à Z (Vers l'Élysée, Ombrair,
  Analyse vidéo football — aucun n'a de trace dans le repo à ce stade).

### Vérification
- Build : ✅ (`npm run build` vert avant le premier run d'audit)
- Viewports vérifiés : 390 / 768 / 1440 / 1920
- Langues : FR ✅ EN ✅
- reduced-motion : ✅ vérifié (et c'est ce qui a révélé le bug P0-1)
- Régression détectée : non (aucun code de production modifié ce cycle)

### Reverté
- Aucun (rien à reverter — cycle d'amorçage, audit uniquement)

### État des chantiers structurels
- Vers l'Élysée : non commencé
- Ombrair : non commencé
- Analyse vidéo football : non commencé
- Démos projets existants : 2/3 pleinement conformes (Football Data Pipeline,
  Retirement Sustainability Model) ; JobTrackr a un lien démo live mais pas
  d'iframe embarquée (format 1 non tenté, voir BACKLOG)

### Prochain cycle — point de reprise exact
- Lire `docs/ui-loop/BACKLOG.md` section "P0 — Zone prioritaire". Corriger
  `AnimatedLetter` (`src/components/PortfolioMotion.tsx`) pour respecter
  `useReducedMotion()` (texte à opacité 1 immédiate si reduced-motion), puis
  dans la foulée retravailler la fenêtre de révélation de
  `WordsPullUpMultiStyle` sur le titre "Analytical profile" pour qu'elle
  termine avant que la carte ne sorte du viewport à vitesse de scroll normale.
  Revérifier avec `node scripts/ui-audit.mjs` (captures reduced-motion +
  scroll progressif) avant de passer au chantier P0-3 (footer/fin de page).

### Questions bloquantes ouvertes
- Q1 — URL LinkedIn réelle d'Axel (bloque une partie du chantier "parcours de
  conversion", le lien `/cv` peut avancer sans attendre).
- Q2 — Lien repo GitHub pour Vers l'Élysée ?
- Q3 — Lien repo GitHub pour Ombrair ?
- Q4 — Assets visuels (minimap/heatmap) pour l'introduction Analyse vidéo
  football, projet non public.
- Voir `docs/ui-loop/QUESTIONS.md` pour le détail et l'impact de chacune.

---

## Cycle 000 — amorçage (à remplir par l'agent)

**Zone travaillée** : —
**Rotation de questions** : —

### Constats d'audit
- (aucun — cycle non encore exécuté)

### Changements livrés
- (aucun)

### Vérification
- Build : —
- Viewports vérifiés : —
- Langues : —
- reduced-motion : —
- Régression détectée : —

### État des chantiers structurels
- Vers l'Élysée : non commencé
- Ombrair : non commencé
- Analyse vidéo football : non commencé
- Démos projets existants : 0/? (inventaire à faire au cycle 1)

### Prochain cycle — point de reprise exact
- Exécuter la procédure d'amorçage `MISSION-UI.md` §8 : créer `BACKLOG.md` et
  `QUESTIONS.md`, créer la branche `auto/ui-loop`, écrire `scripts/ui-audit.mjs`,
  faire tourner un premier audit complet de la zone prioritaire (§3), inventorier
  tous les projets et leur format de démo actuel. Ne rien coder d'autre.

### Questions bloquantes ouvertes
- aucune
