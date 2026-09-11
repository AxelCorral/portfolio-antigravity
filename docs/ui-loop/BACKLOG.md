# Backlog — Boucle d'amélioration continue UI

> Alimenté et réordonné à chaque cycle (Phase 4 — PRIORISER). Un chantier
> terminé est déplacé dans la section "Terminé" avec le cycle qui l'a livré,
> jamais supprimé silencieusement.

Ordre de priorité imposé par MISSION-UI.md §2 : P0 build/régression/contraste
> P0 zone prioritaire (§3) > P1 nouveaux projets (§4) > P1 démos existantes
(§5) > P2 reste du site.

---

## P0 — Zone prioritaire / contraste / régression

- [ ] **AnimatedLetter sans variante reduced-motion** (`src/components/PortfolioMotion.tsx`).
  Le corps de texte "Analytical profile" reste piloté uniquement par
  `scrollYProgress`, aucun garde `useReducedMotion()`. Voir AUDIT-2026-09-11
  P0-1. Fix : sous `prefers-reduced-motion`, rendre le texte à opacité 1
  d'emblée (bypass du `useTransform`).
- [ ] **Fenêtre d'animation du titre "Analytical profile" trop courte face à la
  vitesse de scroll réelle** (`WordsPullUpMultiStyle` + `.about-card`). Voir
  AUDIT-2026-09-11 P0-2. Piste : réduire le délai cumulatif par mot, agrandir
  la marge de déclenchement (`useInView` margin), ou allonger la présence de
  la carte dans le viewport (padding/min-height).
- [ ] **Fin de page abrupte : aucun footer/point de clôture** après
  `ContactSection`. Voir AUDIT-2026-09-11 P0-3. À concevoir avec sa propre
  identité (pas une 5e carte identique) : mention légale minimale, retour en
  haut, éventuellement rappel des liens de contact.
- [ ] **Contraste insuffisant sur le bouton de langue inactif**
  (`.language-toggle-btn`, `src/index.css:159-176`). Violation axe
  `color-contrast` reproduite sur mobile-390 EN/FR. À revérifier sur desktop
  avant de choisir la nouvelle valeur de couleur (mesurer, pas estimer).

## P1 — Intégration des nouveaux projets (MISSION-UI.md §4)

- [ ] **Vers l'Élysée** — carte projet + page détail + section démo (iframe
  live vers `political-destiny.vercel.app` en priorité, format §5.1). Angle :
  démarche de modélisation, ton neutre (sujet politique). Aucun repo GitHub
  mentionné dans MISSION-UI.md : à confirmer avant d'ajouter un lien "View
  repository" (voir QUESTIONS.md).
- [ ] **Ombrair** — carte projet + page détail + section démo (iframe live vers
  `ombrair.vercel.app`, avec mise en avant de l'affichage 3D produit). Angle :
  vitesse d'exécution, pilotage agentique. Statut fictif de l'entreprise à
  rendre explicite dans le texte.
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
- [ ] JobTrackr — a un lien "démo live" mais pas d'iframe embarquée alors que
  le format 1 (interactif embarqué) est le plus haut format réalisable pour un
  projet déployé sur Vercel. Vérifier d'abord les en-têtes
  `X-Frame-Options`/CSP de `jobtrackr-lake.vercel.app` avant d'investir du
  temps ; si bloqué, documenter pourquoi et rester au carrousel actuel.

## P1 — Crédibilité de la zone "Capabilities"

- [ ] Les 4 cartes "capabilities" sont visuellement identiques (mur de blocs,
  AUDIT-2026-09-11 P1-1) et pointent toutes vers `#contact`. Étudier un lien
  différencié par carte vers le projet qui illustre le mieux la compétence
  (ex. Data Engineering → Football Data Pipeline), et résorber le vide visuel
  en bas des cartes (`.capability-card` min-height 420px vs contenu réel).

## P1 — Parcours de conversion

- [ ] Ajouter CV et LinkedIn au bloc de contact (`contactLinks` dans
  `OnePage.tsx`). LinkedIn bloqué en attente de l'URL réelle (voir
  QUESTIONS.md). Le lien `/cv` peut être ajouté sans arbitrage (route déjà
  existante, aucune donnée à inventer).

## P1 — Whitespace du panneau de contact

- [ ] `.contact-panel` (`src/index.css:2608-2740`) : `align-items: end` laisse
  un grand vide non composé au-dessus des liens sur desktop/tablette
  (AUDIT-2026-09-11 P1-3). Revoir l'alignement ou enrichir la colonne de
  liens (ajout CV/LinkedIn ci-dessus réduira mécaniquement le déséquilibre).

## P2 — Reste du site

- [ ] Fichiers `src/sections/About.tsx`, `Contact.tsx`, `Stack.tsx`,
  `Manifeste.tsx`, `FlowProjets.tsx` : non importés par `App.tsx`/`OnePage.tsx`,
  semblent être un premier jet abandonné. À confirmer sur 2 cycles (pas de
  suppression hâtive — garde-fou "jamais de suppression hors périmètre") puis
  supprimer si confirmé mort, pour ne pas polluer les futurs audits/greps.
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

## Terminé

- [x] Cycle 001 — Amorçage : `scripts/ui-audit.mjs`, branche `auto/ui-loop`,
  `docs/ui-loop/{BACKLOG,QUESTIONS}.md`, premier audit complet de la zone
  prioritaire, inventaire des 3 projets existants + 3 projets à intégrer.
