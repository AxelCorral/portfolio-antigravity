# Journal — Boucle d'amélioration continue UI

> Ordre antéchronologique : la dernière entrée est en haut.
> Ce fichier est la **seule mémoire** entre les cycles. Il doit toujours permettre
> à une session neuve de reprendre sans rien relire d'autre que `MISSION-UI.md`.

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
