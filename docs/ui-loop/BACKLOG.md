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
- [ ] Vide en bas des cartes (`.capability-card`, `justify-content:
  space-between` sur hauteur de ligne de grille fixe 480px à partir de
  1024px) : la variation de hauteur du vide entre cartes selon la longueur
  du texte reste présente (ex. carte "Business Intelligence" avec un item
  sur 2 lignes vs les 3 autres sur 1 ligne). Non traité cycle 003 — jugé
  mineur une fois le lien différencié en place (le vide est cohérent avec
  un design en grille à hauteur de ligne fixe, pas une régression visible en
  soi), à revisiter seulement si un audit visuel futur le confirme gênant.

## P1 — Parcours de conversion

- [x] Ajouter CV au bloc de contact et au footer (`getContactLinks` dans
  `OnePage.tsx`). Corrigé cycle 002 (commit `85140a2`). LinkedIn toujours
  bloqué en attente de l'URL réelle (voir QUESTIONS.md Q1) — case laissée
  ouverte tant que Q1 n'est pas résolue.

## P1 — Whitespace du panneau de contact

- [x] `.contact-panel` (`src/index.css`) : `align-items: end` → `center`.
  Corrigé cycle 002 (commit `85140a2`).

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

- [x] Cycle 002 — Tous les P0 de la zone prioritaire résolus : reduced-motion
  `AnimatedLetter`, fenêtre de révélation du titre "Analytical profile",
  footer de clôture (+ resserrage de l'espace mort), contraste du toggle de
  langue. Plus 2 chantiers P1 : lien CV et rééquilibrage vertical du panneau
  de contact. Commits `1a756ce`, `00691e7`, `85140a2`, `10eacfb`.
- [x] Cycle 001 — Amorçage : `scripts/ui-audit.mjs`, branche `auto/ui-loop`,
  `docs/ui-loop/{BACKLOG,QUESTIONS}.md`, premier audit complet de la zone
  prioritaire, inventaire des 3 projets existants + 3 projets à intégrer.
