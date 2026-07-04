export type VisualKind =
  | "flow"
  | "tree"
  | "sql"
  | "split"
  | "bars"
  | "stages"
  | "demo"
  | "levers"
  | "sources"
  | "equation"
  | "scenarios"
  | "scissors"
  | "limits"
  | "deliverables";

export interface SlideLink {
  label: string;
  url: string;
}

export interface Slide {
  kind: "cover" | "step";
  label?: string;
  headline?: string;
  body?: string;
  thesis?: string;
  thesisAccent?: string;
  sub?: string;
  file?: string;
  visual?: VisualKind;
  links?: SlideLink[];
}

export const footballPipelineSlides: readonly Slide[] = [
  {
    kind: "cover",
    label: "Project 01 · Data Engineering",
    thesis:
      "A prediction model only means something if it provably beats guessing.",
    thesisAccent: "beats guessing.",
    sub: "An end-to-end pipeline — ingestion to model — built so every number is reproducible and falsifiable.",
    file: "football-pipeline/",
  },
  {
    kind: "step",
    visual: "flow",
    label: "Step 01 — Ingestion",
    headline: "Where the data comes from, and why it fights back.",
    body: "football-data.org throttles requests and shifts its schema. Raw JSON is landed on S3 with retry handling, so a flaky source never corrupts the record.",
  },
  {
    kind: "step",
    visual: "tree",
    label: "Step 02 — Warehouse",
    headline: "From raw noise to a layer you can query.",
    body: "A curated Parquet layer, partitioned by competition and season. 1,752 matches across five European leagues, cached as six versioned datasets.",
  },
  {
    kind: "step",
    visual: "sql",
    label: "Step 03 — Analytical SQL",
    headline: "Asking the data real questions.",
    body: "Athena runs SQL straight over the curated schema: scoring rates, home advantage, weekly goal trends — no extra infrastructure to maintain.",
  },
  {
    kind: "step",
    visual: "split",
    label: "Step 04 — Modeling",
    headline: "The part most portfolios skip: a baseline.",
    body: "A time-based train/test split prevents leakage, and the model is scored against a documented naive baseline — so a result has to earn its keep.",
  },
  {
    kind: "step",
    visual: "bars",
    label: "Step 05 — Results",
    headline: "+9.7 points in Serie A. −0.7 in the Bundesliga.",
    body: "I report the league where the model failed to beat the baseline. That honesty is exactly what makes the winning numbers trustworthy.",
  },
  {
    kind: "step",
    visual: "stages",
    label: "Step 06 — Rigor",
    headline: "Reproducible, tested, shipped.",
    body: "A focused test suite plus GitLab CI/CD stages — lint, test, model, deploy — mean the pipeline rebuilds itself the same way every time.",
  },
  {
    kind: "step",
    visual: "demo",
    label: "Step 07 — Product",
    headline: "A Streamlit interface anyone can open.",
    body: "The whole pipeline ends in a live app: pick a league, see predictions and trends. The engineering disappears behind something you can actually use.",
  },
];
