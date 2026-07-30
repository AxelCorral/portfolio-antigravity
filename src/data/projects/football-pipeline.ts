export type VisualKind =
  | "flow"
  | "tree"
  | "sql"
  | "split"
  | "bars"
  | "stages"
  | "demo"
  | "ingest";

export interface SlideLink {
  label: string;
  url: string;
  sub?: string;
}

export interface SlideListItem {
  number: string;
  title: string;
  sub: string;
}

export interface SlideStat {
  value: string;
  caption: string;
}

export interface SlideChartImage {
  src: string;
  alt: string;
}

export interface Slide {
  kind: "cover" | "step";
  label?: string;
  headline?: string;
  headlineAccent?: string;
  body?: string;
  thesis?: string;
  thesisAccent?: string;
  sub?: string;
  file?: string;
  visual?: VisualKind;
  links?: SlideLink[];
  list?: SlideListItem[];
  stat?: SlideStat;
  chartImage?: SlideChartImage;
  metaStrip?: string;
}

export const footballPipelineSlidesEn: readonly Slide[] = [
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

export const footballPipelineSlidesFr: readonly Slide[] = [
  {
    kind: "cover",
    label: "Projet 01 · Ingénierie des données",
    thesis:
      "Un modèle de prédiction n'a de sens que s'il bat le hasard, preuve à l'appui.",
    thesisAccent: "bat le hasard, preuve à l'appui.",
    sub: "Un pipeline de bout en bout — de l'ingestion au modèle — construit pour que chaque chiffre soit reproductible et réfutable.",
    file: "football-pipeline/",
  },
  {
    kind: "step",
    visual: "flow",
    label: "Étape 01 — Ingestion",
    headline: "D'où viennent les données, et pourquoi elles résistent.",
    body: "football-data.org limite les requêtes et fait évoluer son schéma. Le JSON brut est déposé sur S3 avec gestion des relances, pour qu'une source instable ne corrompe jamais les données.",
  },
  {
    kind: "step",
    visual: "tree",
    label: "Étape 02 — Warehouse",
    headline: "Du bruit brut à une couche interrogeable.",
    body: "Une couche Parquet consolidée, partitionnée par compétition et saison. 1 752 matchs sur cinq championnats européens, mis en cache dans six datasets versionnés.",
  },
  {
    kind: "step",
    visual: "sql",
    label: "Étape 03 — SQL analytique",
    headline: "Poser de vraies questions aux données.",
    body: "Athena exécute du SQL directement sur le schéma consolidé : taux de buts, avantage du terrain, tendances hebdomadaires — sans infrastructure supplémentaire à maintenir.",
  },
  {
    kind: "step",
    visual: "split",
    label: "Étape 04 — Modélisation",
    headline: "Ce que la plupart des portfolios sautent : une baseline.",
    body: "Un split train/test temporel évite les fuites de données, et le modèle est évalué face à une baseline naïve documentée — un résultat doit donc faire ses preuves.",
  },
  {
    kind: "step",
    visual: "bars",
    label: "Étape 05 — Résultats",
    headline: "+9,7 points en Serie A. −0,7 en Bundesliga.",
    body: "Je publie aussi la ligue où le modèle n'a pas battu la baseline. C'est cette honnêteté qui rend les résultats gagnants crédibles.",
  },
  {
    kind: "step",
    visual: "stages",
    label: "Étape 06 — Rigueur",
    headline: "Reproductible, testé, livré.",
    body: "Une suite de tests ciblée et des stages GitLab CI/CD — lint, test, modèle, déploiement — garantissent que le pipeline se reconstruit toujours de la même façon.",
  },
  {
    kind: "step",
    visual: "demo",
    label: "Étape 07 — Produit",
    headline: "Une interface Streamlit que tout le monde peut ouvrir.",
    body: "Tout le pipeline aboutit à une application en ligne : on choisit une ligue, on voit prédictions et tendances. L'ingénierie s'efface derrière un outil réellement utilisable.",
  },
];
