import type { Slide } from "./football-pipeline";

// ---------------------------------------------------------------------------
// RESERVED SLOT — real pipeline exports
// ---------------------------------------------------------------------------
// This project is not public yet: no repository, no live demo, no exported
// asset (see docs/ui-loop/QUESTIONS.md, Q4 — resolved 2026-09-12). The three
// "visual" steps below (trackingFlow / pitchSchema / reid) render abstract,
// hand-built reconstructions — never a broadcast capture, never a club or
// competition logo, and never presented as real pipeline output.
//
// When a real export becomes available (an annotated frame, a minimap
// render, a heatmap), replace that slide's `visual: "<kind>"` line with a
// `chartImage: { src, alt }` pointing at the real asset. `StepSlide`
// (src/components/carousel/CarouselSlides.tsx) already renders `chartImage`
// exactly like the other project carousels (see retirement-analysis.ts) —
// no other change to this file, the carousel or the page layout is required.
// ---------------------------------------------------------------------------

export const footballVideoAnalysisSlidesEn: readonly Slide[] = [
  {
    kind: "cover",
    label: "Project 06 · Computer Vision Research",
    thesis:
      "A research pipeline, published as work in progress — not a finished product.",
    thesisAccent: "work in progress",
  },
  {
    kind: "step",
    visual: "trackingFlow",
    label: "Step 01 — Detection & tracking",
    headline: "Finding every player, frame after frame.",
    body: "YOLOv8 detects players and the ball on each frame; ByteTrack links those detections into continuous tracks across the sequence — the foundation every later stage depends on.",
  },
  {
    kind: "step",
    visual: "pitchSchema",
    label: "Step 02 — Calibration",
    headline: "From camera pixels to real pitch coordinates.",
    body: "A homography computed per sequence projects tracked positions from the broadcast camera view onto real-world pitch coordinates — the same transform behind the interface's minimap view.",
  },
  {
    kind: "step",
    label: "Step 03 — Interface",
    headline: "Five pages, one Streamlit app.",
    body: "Clustering, phase classification and event detection feed a single interface built to make the pipeline's output legible, not just computable.",
    list: [
      { number: "01", title: "Home", sub: "entry point, match selection" },
      { number: "02", title: "Segments", sub: "phase-classified play segments" },
      { number: "03", title: "Minimap", sub: "homography-projected positions" },
      { number: "04", title: "Player", sub: "per-player tracking view" },
      { number: "05", title: "Teams", sub: "clustering & team-level stats" },
    ],
  },
  {
    kind: "step",
    visual: "reid",
    label: "Step 04 — Research track, in progress",
    headline: "Can a player's ID survive a cut between segments?",
    body: "Segments are tracked independently today. The track under study re-identifies a player across segment boundaries using jersey color, position and role, aiming at stable IDs over a full match.",
  },
  {
    kind: "step",
    label: "Step 05 — Applied to real matches",
    headline: "Run end to end on two real matches, under a real constraint.",
    body: "The pipeline was applied to full broadcast footage, not a synthetic clip — and every design choice upstream was shaped by running it on CPU only.",
    list: [
      { number: "01", title: "Real Madrid – Dortmund", sub: "UEFA Champions League" },
      { number: "02", title: "Swansea – Man City", sub: "Carabao Cup" },
    ],
  },
  {
    kind: "step",
    label: "Step 06 — The goal beyond tracking",
    headline: "Turning a tracked sequence into a tactical suggestion.",
    body: "The end goal is to compare a situation extracted from video against thousands of situations from real matches, to infer and visualize the decision it suggests — feedback a coach or player could actually use.",
  },
];

export const footballVideoAnalysisSlidesFr: readonly Slide[] = [
  {
    kind: "cover",
    label: "Projet 06 · Recherche en vision par ordinateur",
    thesis:
      "Un pipeline de recherche, publié comme un travail en cours — pas un produit fini.",
    thesisAccent: "travail en cours",
  },
  {
    kind: "step",
    visual: "trackingFlow",
    label: "Étape 01 — Détection & tracking",
    headline: "Retrouver chaque joueur, image après image.",
    body: "YOLOv8 détecte joueurs et ballon sur chaque frame ; ByteTrack relie ces détections en trajectoires continues sur la séquence — le socle dont dépend chaque étape suivante.",
  },
  {
    kind: "step",
    visual: "pitchSchema",
    label: "Étape 02 — Calibration",
    headline: "Des pixels de la caméra aux coordonnées réelles du terrain.",
    body: "Une homographie calculée par séquence projette les positions trackées depuis la vue caméra vers des coordonnées terrain réelles — la même transformation qui alimente la vue minimap de l'interface.",
  },
  {
    kind: "step",
    label: "Étape 03 — Interface",
    headline: "Cinq pages, une seule application Streamlit.",
    body: "Clustering, classification des phases de jeu et détection d'événements alimentent une interface unique, pensée pour rendre la sortie du pipeline lisible, pas seulement calculable.",
    list: [
      { number: "01", title: "Accueil", sub: "point d'entrée, sélection du match" },
      { number: "02", title: "Segments", sub: "segments de jeu classés par phase" },
      { number: "03", title: "Minimap", sub: "positions projetées par homographie" },
      { number: "04", title: "Joueur", sub: "vue de tracking par joueur" },
      { number: "05", title: "Équipes", sub: "clustering & statistiques d'équipe" },
    ],
  },
  {
    kind: "step",
    visual: "reid",
    label: "Étape 04 — Piste de recherche, en cours",
    headline: "L'identifiant d'un joueur survit-il à une coupure entre segments ?",
    body: "Les segments sont aujourd'hui trackés indépendamment. La piste à l'étude ré-identifie un joueur d'un segment à l'autre à partir de la couleur de maillot, de la position et du rôle, pour viser des identifiants stables sur un match complet.",
  },
  {
    kind: "step",
    label: "Étape 05 — Appliqué à de vrais matchs",
    headline: "Exécuté de bout en bout sur deux vrais matchs, sous une vraie contrainte.",
    body: "Le pipeline a été appliqué à de véritables extraits de diffusion, pas à un clip synthétique — et chaque choix de conception en amont a été façonné par l'exécution en CPU uniquement.",
    list: [
      { number: "01", title: "Real Madrid – Dortmund", sub: "Ligue des champions UEFA" },
      { number: "02", title: "Swansea – Man City", sub: "Carabao Cup" },
    ],
  },
  {
    kind: "step",
    label: "Étape 06 — L'objectif au-delà du tracking",
    headline: "Transformer une séquence trackée en suggestion tactique.",
    body: "L'objectif final est de comparer une situation extraite d'une vidéo à des milliers de situations issues de vrais matchs, pour en déduire et visualiser la décision qu'elle suggère — un retour qu'un entraîneur ou un joueur pourrait réellement utiliser.",
  },
];
