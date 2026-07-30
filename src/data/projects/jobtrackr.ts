import type { Slide } from "./football-pipeline";

const GITHUB_URL = "https://github.com/AxelCorral/jobtrackr";

export const jobtrackrSlides: readonly Slide[] = [
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
        label: "View repository",
        sub: "github.com/AxelCorral/jobtrackr",
        url: GITHUB_URL,
      },
    ],
  },
];
