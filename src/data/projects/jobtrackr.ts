import type { Slide } from "./football-pipeline";

const DEMO_URL = "https://jobtrackr-lake.vercel.app/";
const GITHUB_URL = "https://github.com/AxelCorral/jobtrackr";

export const jobtrackrSlidesEn: readonly Slide[] = [
  {
    kind: "cover",
    label: "Project 02 · Data Pipeline",
    thesis: "The pipeline that runs my own job search.",
    thesisAccent: "my own",
    sub: "Aggregates job offers, scores them against my CV, and tracks every application.",
    file: "jobtrackr/",
  },
  {
    kind: "step",
    label: "The problem",
    headline: "Job hunting is scattered data.",
    body: "Multiple job boards, no ranking of what's worth applying to. One pipeline, one scored feed, one tracker.",
    metaStrip: "37 routes · 14 models · Neon · Vercel",
  },
  {
    kind: "step",
    visual: "ingest",
    label: "Ingestion",
    headline: "Two official APIs, one normalized feed.",
    body: "France Travail (OAuth2 client credentials, 32-city department mapping, 9 contract-type codes) and Adzuna. Sources run in parallel with Promise.allSettled — one failing source never kills the sync. Everything is normalized to a single offer schema.",
  },
  {
    kind: "step",
    label: "Production lessons",
    headline: "A pipeline is also sources that die.",
    headlineAccent: "die",
    body: "Indeed blocked Vercel's IPs. Welcome to the Jungle killed its RSS feed. Both removed cleanly — no ghost sources, no scraping workarounds.",
    stat: {
      value: "4 → 2",
      caption: "Sources survived",
    },
  },
  {
    kind: "step",
    label: "Serverless constraint",
    headline: "Sync in seconds, scoring on its own clock.",
    body: "Fetch + AI scoring hit 8–38s, over the limit. Fix: idempotent writes, batches of 5, 500ms throttle, capped at 50.",
    stat: {
      value: "10s",
      caption: "What shaped it",
    },
  },
  {
    kind: "step",
    label: "AI scoring",
    headline: "Every offer scored against my actual CV.",
    body: "Gemini scores each offer against my CV. Honest limit: fully LLM-generated — reproducibility isn't guaranteed.",
    stat: {
      value: "0–100 × 2",
      caption: "Per offer",
    },
  },
  {
    kind: "step",
    label: "Security audit",
    headline: "Audited like it ships to strangers.",
    body: "Zero IDOR by design — every route checks ownership. Then a full audit: SSRF fixed with DNS resolution and private-IP blocking, allowlists on write routes, bounded limits, security headers, bcrypt cost 12.",
  },
  {
    kind: "step",
    label: "Shipped · and unfinished",
    headline: "Deployed. Used daily. Not done.",
    body: "Live on Vercel + Neon, feeding my job search daily. Still missing: rate limiting, pipeline tests — the next iteration.",
    links: [
      {
        label: "View live demo",
        sub: "jobtrackr-lake.vercel.app",
        url: DEMO_URL,
      },
      {
        label: "View repository",
        sub: "github.com/AxelCorral/jobtrackr",
        url: GITHUB_URL,
      },
    ],
  },
];

export const jobtrackrSlidesFr: readonly Slide[] = [
  {
    kind: "cover",
    label: "Projet 02 · Pipeline de données",
    thesis: "Le pipeline qui alimente ma propre recherche d'emploi.",
    thesisAccent: "ma propre",
    sub: "Agrège les offres d'emploi, les score face à mon CV, et suit chaque candidature.",
    file: "jobtrackr/",
  },
  {
    kind: "step",
    label: "Le problème",
    headline: "Chercher un emploi, c'est des données éparpillées.",
    body: "Plusieurs job boards, aucun moyen de classer ce qui vaut une candidature. Un pipeline, un flux scoré, un tracker.",
    metaStrip: "37 routes · 14 modèles · Neon · Vercel",
  },
  {
    kind: "step",
    visual: "ingest",
    label: "Ingestion",
    headline: "Deux APIs officielles, un flux normalisé.",
    body: "France Travail (OAuth2 client credentials, mapping de 32 villes vers départements, 9 codes de contrat) et Adzuna. Sources en parallèle via Promise.allSettled — une source qui échoue ne tue jamais la synchro. Tout est normalisé vers un schéma unique.",
  },
  {
    kind: "step",
    label: "Leçons de production",
    headline: "Un pipeline, c'est aussi des sources qui meurent.",
    headlineAccent: "meurent",
    body: "Indeed a bloqué les IP de Vercel. Welcome to the Jungle a supprimé son flux RSS. Les deux ont été retirées proprement — pas de source fantôme, pas de scraping.",
    stat: {
      value: "4 → 2",
      caption: "Sources survivantes",
    },
  },
  {
    kind: "step",
    label: "Contrainte serverless",
    headline: "La synchro en secondes, le scoring à son rythme.",
    body: "Fetch + scoring IA : 8 à 38 s, au-delà de la limite. Fix : écritures idempotentes, batchs de 5, throttle 500 ms, borné à 50.",
    stat: {
      value: "10 s",
      caption: "A tout façonné",
    },
  },
  {
    kind: "step",
    label: "Scoring IA",
    headline: "Chaque offre scorée face à mon vrai CV.",
    body: "Gemini score chaque offre face à mon CV. Limite assumée : produit intégralement par le LLM — reproductibilité non garantie.",
    stat: {
      value: "0–100 × 2",
      caption: "Par offre",
    },
  },
  {
    kind: "step",
    label: "Audit sécurité",
    headline: "Audité comme s'il était ouvert au public.",
    body: "Zéro IDOR par construction — chaque route vérifie la propriété. Puis un audit complet : SSRF corrigée (résolution DNS, blocage IP privées), allowlists en écriture, limites bornées, headers de sécurité, bcrypt cost 12.",
  },
  {
    kind: "step",
    label: "Déployé · et inachevé",
    headline: "Déployé. Utilisé chaque jour. Pas terminé.",
    body: "En ligne sur Vercel + Neon, au service de ma recherche au quotidien. Ce qui manque : rate limiting, tests du pipeline — la prochaine itération.",
    links: [
      {
        label: "Voir la démo en ligne",
        sub: "jobtrackr-lake.vercel.app",
        url: DEMO_URL,
      },
      {
        label: "Voir le dépôt",
        sub: "github.com/AxelCorral/jobtrackr",
        url: GITHUB_URL,
      },
    ],
  },
];
