import type { Language } from "@/i18n/language";

export type ProjectCategory = string;

export type ProjectStatus = string;

export type ProjectResult = {
  label: string;
  description: string;
};

export type ProjectCaseStudySection = {
  eyebrow: string;
  title: string;
  body: string;
  points?: string[];
};

export type ProjectScreenshot = {
  title: string;
  description?: string;
  src: string;
  type: "chart" | "report" | "output" | "screenshot";
};

export type ProjectLink = {
  label: string;
  url: string;
  type: "github" | "repository" | "report" | "demo";
};

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  description: string;
  longDescription: string;
  hook?: string;
  whyItMatters?: string;
  caseStudy?: ProjectCaseStudySection[];
  keyTakeaway?: string;
  technologies: string[];
  highlights: string[];
  results: ProjectResult[];
  screenshots?: ProjectScreenshot[];
  links?: ProjectLink[];
  // Local-repo projects set this to their folder in the workspace. Demo-only
  // projects (no public repository, e.g. Vers l'Élysée) leave it unset rather
  // than fabricate a path — ProjectDetailModal hides the "source folder" row
  // when it is absent instead of showing a folder that does not exist.
  sourcePath?: string;
  evidence: string[];
  previewImage?: string;
  previewAlt?: string;
  // Caption shown under a live iframe demo (see LiveDemoEmbed). Only read when
  // `links` contains an entry with `type: "demo"`.
  demoCaption?: string;
  translations?: Partial<Record<Exclude<Language, "en">, ProjectTranslation>>;
};

export type ProjectTranslation = Partial<
  Pick<
    Project,
    | "title"
    | "category"
    | "status"
    | "description"
    | "longDescription"
    | "hook"
    | "whyItMatters"
    | "keyTakeaway"
    | "highlights"
    | "results"
    | "screenshots"
    | "links"
    | "evidence"
    | "previewAlt"
    | "demoCaption"
  >
> & {
  caseStudy?: ProjectCaseStudySection[];
};

export function getLocalizedProjects(language: Language): Project[] {
  if (language === "en") return projects;

  return projects.map((project) => ({
    ...project,
    ...(project.translations?.[language] ?? {}),
  }));
}

export const projects: Project[] = [
  {
    id: "01",
    title: "Football Data Pipeline",
    category: "Data Engineering",
    status: "Portfolio project",
    hook: "From live football-data.org API calls to a recruiter-readable data product.",
    description:
      "An end-to-end pipeline that collects match data from football-data.org, normalizes it into Parquet datasets, supports Athena analysis and trains a result-prediction model for a Streamlit interface.",
    whyItMatters:
      "It proves Axel can connect ingestion, storage, analytics, ML and dashboard delivery in one reproducible workflow instead of stopping at an isolated notebook.",
    longDescription:
      "The project is organized as a production-style data workflow rather than a notebook: API ingestion, raw and curated storage layers, analytical SQL, feature engineering, model comparison, tests and a Streamlit consumption layer. Its README explicitly frames the pipeline architecture as the primary outcome, with model performance documented against a naive baseline.",
    keyTakeaway:
      "The strongest signal is not a spectacular prediction score: it is the complete path from source API to curated Parquet, analytical SQL, tested ML comparison and an offline-capable dashboard.",
    caseStudy: [
      {
        eyebrow: "Context / problem",
        title: "Football data is only useful once it is structured.",
        body:
          "Match data from football-data.org arrives through API responses that need to be collected, normalized, cached and made queryable before it can support analysis or a dashboard.",
        points: [
          "Source: football-data.org REST API v4.",
          "Scope documented in the README: PL, FL1, BL1, SA and PD for the 2025/26 season.",
        ],
      },
      {
        eyebrow: "Pipeline / method",
        title: "A local-first workflow shaped like an AWS data stack.",
        body:
          "The repository models raw JSON storage, curated Parquet outputs, Athena-oriented SQL and a Streamlit app that can still run locally from versioned cache files.",
        points: [
          "Raw layer: JSON by competition and date.",
          "Curated layer: Parquet partitioned by competition and season.",
          "Consumption layer: Streamlit dashboard backed by data/cache.",
        ],
      },
      {
        eyebrow: "Evidence / result",
        title: "1,752 matches are documented across five European leagues.",
        body:
          "The README reports 1,752 total matches and shows per-league ML evaluation against a naive home-win baseline, with the author explicitly framing model performance as secondary to pipeline quality.",
        points: [
          "Five cached league datasets plus a consolidated matches_all_2025 Parquet file.",
          "Analytical SQL covers home advantage, top scorers and average goals per round.",
          "ML compares Logistic Regression and Random Forest with a temporal 80/20 split.",
        ],
      },
      {
        eyebrow: "What it demonstrates",
        title: "Data engineering judgment, not just dashboard polish.",
        body:
          "The project gives a recruiter evidence of API ingestion, schema normalization, reproducible files, SQL analysis, basic ML evaluation, tests and a product-facing dashboard.",
        points: [
          "Tests cover extraction, ingestion, transformation, loading, ML and query layers.",
          "GitLab CI/CD stages are documented for lint, test, model, build and deploy.",
        ],
      },
    ],
    technologies: [
      "Python",
      "pandas",
      "AWS S3",
      "AWS Glue",
      "Athena",
      "Parquet",
      "scikit-learn",
      "Streamlit",
      "pytest",
    ],
    highlights: [
      "Ingestion with retry handling and raw JSON storage on S3.",
      "Curated Parquet layer partitioned by competition and season.",
      "Athena SQL for scoring, home advantage and goal trends.",
      "Time-based model split with a documented naive baseline.",
      "Test suite and GitLab CI/CD stages for lint, test, model and deploy.",
    ],
    results: [
      {
        label: "Curated data layer",
        description:
          "Six versioned Parquet cache files cover the five documented competitions plus the consolidated 2025 dataset.",
      },
      {
        label: "Analytical SQL",
        description:
          "Athena queries cover team scoring, home advantage and weekly goal trends against the curated match schema.",
      },
      {
        label: "Model evaluation",
        description:
          "Logistic Regression and Random Forest are compared with a time-based 80/20 split; documented gains range from +0.5 to +5.1 points over the home-win baseline depending on league.",
      },
      {
        label: "Delivery workflow",
        description:
          "The repository includes focused tests and GitLab CI/CD stages for linting, tests, model execution, build and deployment.",
      },
    ],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/AxelCorral/football-pipeline",
        type: "github",
      },
      {
        label: "GitLab",
        url: "https://gitlab.com/axelcorral-group/football-pipeline",
        type: "repository",
      },
    ],
    sourcePath: "football-pipeline/",
    evidence: [
      "1,752 documented matches",
      "5 European leagues",
      "6 cached Parquet datasets",
      "6 focused test modules",
    ],
    translations: {
      fr: {
        category: "Ingénierie des données",
        status: "Projet portfolio",
        hook:
          "Des appels API football-data.org jusqu’à un produit data lisible par un recruteur.",
        description:
          "Un pipeline end-to-end qui collecte les données de matchs depuis football-data.org, les normalise en jeux de données Parquet, prépare l’analyse Athena et entraîne un modèle de prédiction de résultat pour une interface Streamlit.",
        whyItMatters:
          "Ce projet montre qu’Axel sait relier ingestion, stockage, analyse, ML et dashboard dans un workflow reproductible, au lieu de s’arrêter à un notebook isolé.",
        longDescription:
          "Le projet est structuré comme un workflow data de production plutôt qu’un notebook : ingestion API, couches raw et curated, SQL analytique, feature engineering, comparaison de modèles, tests et couche de consommation Streamlit. Le README présente clairement l’architecture du pipeline comme le résultat principal, avec des performances de modèle documentées face à une baseline naïve.",
        keyTakeaway:
          "Le signal le plus fort n’est pas un score de prédiction spectaculaire : c’est le chemin complet de l’API source vers Parquet, SQL analytique, comparaison ML testée et dashboard capable de fonctionner hors ligne.",
        caseStudy: [
          {
            eyebrow: "Contexte / problème",
            title: "Les données football deviennent utiles quand elles sont structurées.",
            body:
              "Les données de matchs football-data.org arrivent via des réponses API qu’il faut collecter, normaliser, mettre en cache et rendre interrogeables avant de pouvoir alimenter une analyse ou un dashboard.",
            points: [
              "Source : API REST v4 football-data.org.",
              "Périmètre documenté dans le README : PL, FL1, BL1, SA et PD pour la saison 2025/26.",
            ],
          },
          {
            eyebrow: "Pipeline / méthode",
            title: "Un workflow local-first pensé comme une stack data AWS.",
            body:
              "Le dépôt modélise le stockage JSON brut, les sorties Parquet curated, du SQL orienté Athena et une app Streamlit capable de tourner localement grâce aux fichiers de cache versionnés.",
            points: [
              "Couche raw : JSON par compétition et par date.",
              "Couche curated : Parquet partitionné par compétition et saison.",
              "Couche de consommation : dashboard Streamlit alimenté par data/cache.",
            ],
          },
          {
            eyebrow: "Preuve / résultat",
            title: "1 752 matchs sont documentés sur cinq championnats européens.",
            body:
              "Le README indique 1 752 matchs au total et présente une évaluation ML par championnat face à une baseline victoire domicile, tout en rappelant que la qualité du pipeline prime sur la performance absolue.",
            points: [
              "Cinq datasets de ligue en cache plus un fichier consolidé matches_all_2025 en Parquet.",
              "Le SQL analytique couvre avantage domicile, meilleurs buteurs et moyenne de buts par journée.",
              "Le ML compare Logistic Regression et Random Forest avec un split temporel 80/20.",
            ],
          },
          {
            eyebrow: "Ce que ça démontre",
            title: "Du jugement data engineering, pas seulement un dashboard propre.",
            body:
              "Le projet donne à un recruteur des preuves d’ingestion API, de normalisation de schéma, de fichiers reproductibles, d’analyse SQL, d’évaluation ML simple, de tests et de dashboard orienté produit.",
            points: [
              "Les tests couvrent extraction, ingestion, transformation, chargement, ML et requêtes.",
              "Les stages GitLab CI/CD sont documentés pour lint, test, model, build et deploy.",
            ],
          },
        ],
        highlights: [
          "Ingestion avec retry handling et stockage JSON brut sur S3.",
          "Couche Parquet curated partitionnée par compétition et saison.",
          "SQL Athena pour scoring, avantage domicile et tendances de buts.",
          "Split temporel du modèle avec baseline naïve documentée.",
          "Suite de tests et stages GitLab CI/CD pour lint, test, model et deploy.",
        ],
        results: [
          {
            label: "Couche data curated",
            description:
              "Six fichiers de cache Parquet versionnés couvrent les cinq compétitions documentées plus le dataset consolidé 2025.",
          },
          {
            label: "SQL analytique",
            description:
              "Les requêtes Athena couvrent scoring par équipe, avantage domicile et tendances hebdomadaires de buts sur le schéma de matchs curated.",
          },
          {
            label: "Évaluation du modèle",
            description:
              "Logistic Regression et Random Forest sont comparés avec un split temporel 80/20 ; les gains documentés vont de +0,5 à +5,1 points face à la baseline victoire domicile selon la ligue.",
          },
          {
            label: "Workflow de livraison",
            description:
              "Le dépôt inclut des tests ciblés et des stages GitLab CI/CD pour linting, tests, exécution du modèle, build et déploiement.",
          },
        ],
        evidence: [
          "1 752 matchs documentés",
          "5 ligues européennes",
          "6 datasets Parquet en cache",
          "6 modules de tests ciblés",
        ],
      },
    },
  },
  {
    id: "02",
    title: "JobTrackr",
    category: "Full-Stack Engineering",
    status: "Deployed project",
    description:
      "A full-stack \"Career OS\" that centralizes a job search: automatic job aggregation from multiple sources, application tracking and AI-based CV/job compatibility scoring.",
    longDescription:
      "JobTrackr aggregates job postings from two official APIs — France Travail and Adzuna — into a single pipeline, stores tracked applications in a PostgreSQL database and uses the Gemini API to score compatibility between a candidate's CV and each offer. It ships as a deployed Next.js product rather than a local script.",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Neon", "Vercel", "Gemini API"],
    highlights: [
      "Automatic job aggregation from two official APIs: France Travail (OAuth2) and Adzuna.",
      "Application tracking with a Kanban-style workflow.",
      "AI-based CV/job compatibility scoring via the Gemini API.",
      "Full-stack Next.js app backed by a PostgreSQL (Neon) database.",
      "Deployed and running in production on Vercel.",
    ],
    results: [
      {
        label: "Source aggregation",
        description:
          "Two official APIs — France Travail (OAuth2) and Adzuna — are aggregated automatically into a single tracked feed.",
      },
      {
        label: "Deployment",
        description:
          "The application runs as a deployed full-stack product on Vercel, not a local prototype.",
      },
      {
        label: "AI scoring",
        description:
          "Job/CV compatibility is scored using the Gemini API to help prioritize applications.",
      },
      {
        label: "Data layer",
        description:
          "Applications and aggregated offers are persisted in a PostgreSQL database hosted on Neon.",
      },
    ],
    links: [
      {
        label: "Live demo",
        url: "https://jobtrackr-lake.vercel.app/",
        type: "demo",
      },
      {
        label: "GitHub",
        url: "https://github.com/AxelCorral/jobtrackr",
        type: "github",
      },
    ],
    sourcePath: "jobtrackr/",
    evidence: [
      "2 official APIs aggregated automatically",
      "Deployed on Vercel",
      "PostgreSQL (Neon) database",
      "AI-based compatibility scoring",
    ],
    translations: {
      fr: {
        title: "JobTrackr",
        category: "Ingénierie full-stack",
        status: "Projet déployé",
        description:
          "Un « Career OS » full-stack qui centralise une recherche d'emploi : agrégation automatique d'offres depuis plusieurs sources, suivi des candidatures et scoring IA de compatibilité CV/offre.",
        longDescription:
          "JobTrackr agrège les offres d'emploi depuis deux API officielles — France Travail et Adzuna — dans un pipeline unique, stocke les candidatures suivies dans une base PostgreSQL et utilise l'API Gemini pour scorer la compatibilité entre le CV d'un candidat et chaque offre. L'application est livrée comme un produit Next.js déployé, pas comme un script local.",
        highlights: [
          "Agrégation automatique depuis deux API officielles : France Travail (OAuth2) et Adzuna.",
          "Suivi des candidatures avec un workflow de type Kanban.",
          "Scoring de compatibilité CV/offre par IA via l'API Gemini.",
          "Application Next.js full-stack adossée à une base PostgreSQL (Neon).",
          "Déployée et fonctionnelle en production sur Vercel.",
        ],
        results: [
          {
            label: "Agrégation des sources",
            description:
              "Deux API officielles — France Travail (OAuth2) et Adzuna — sont agrégées automatiquement dans un flux unique suivi.",
          },
          {
            label: "Déploiement",
            description:
              "L'application tourne comme un produit full-stack déployé sur Vercel, pas comme un prototype local.",
          },
          {
            label: "Scoring IA",
            description:
              "La compatibilité CV/offre est scorée via l'API Gemini pour aider à prioriser les candidatures.",
          },
          {
            label: "Couche de données",
            description:
              "Les candidatures et les offres agrégées sont persistées dans une base PostgreSQL hébergée sur Neon.",
          },
        ],
        links: [
          {
            label: "Démo en ligne",
            url: "https://jobtrackr-lake.vercel.app/",
            type: "demo",
          },
          {
            label: "GitHub",
            url: "https://github.com/AxelCorral/jobtrackr",
            type: "github",
          },
        ],
        evidence: [
          "2 API officielles agrégées automatiquement",
          "Déployé sur Vercel",
          "Base de données PostgreSQL (Neon)",
          "Scoring de compatibilité par IA",
        ],
      },
    },
  },
  {
    id: "03",
    title: "Retirement Sustainability Model",
    category: "Open Data Analysis",
    status: "Research project",
    description:
      "A reproducible accounting model of the French pay-as-you-go pension system, built from Insee 2026 demographic projections and benchmarked against the COR 2026 report.",
    longDescription:
      "This research project makes the equilibrium logic explicit through a closed accounting equation and a sourced configuration of assumptions. It separates demographic pressure from relative pension dynamics, evaluates multiple Insee scenarios through 2070 and validates key trajectories against COR 2026 reference material.",
    technologies: [
      "Python",
      "pandas",
      "Matplotlib",
      "PyYAML",
      "OpenPyXL",
      "pytest",
      "Insee Open Data",
      "COR 2026",
    ],
    highlights: [
      "Explicit equilibrium equation separating demographic and economic effects.",
      "Five Insee demographic scenarios through 2070.",
      "Sourced assumptions centralized in a YAML configuration.",
      "Academic and social-format figure generation pipelines.",
      "Automated demographic, economic and companion-model calibration tests.",
    ],
    results: [
      {
        label: "Reproducible model",
        description:
          "The equilibrium contribution rate is computed from an explicit dependency ratio and relative pension equation.",
      },
      {
        label: "Scenario analysis",
        description:
          "Five Insee demographic scenarios and two indexation approaches are represented across the 2026–2070 horizon.",
      },
      {
        label: "Calibration",
        description:
          "The README documents 21 automated tests covering demographic, economic and companion-model calibration.",
      },
      {
        label: "Published outputs",
        description:
          "The repository generates academic figures, social-format charts and a complete PDF research report.",
      },
    ],
    screenshots: [
      {
        title: "Demographic scissors",
        description:
          "Documented comparison of the system's demographic and economic components.",
        src: "/projects/retirement-analysis/demographic-scissors.webp",
        type: "chart",
      },
      {
        title: "Scenario fan",
        description:
          "Projection range generated from the documented demographic scenarios.",
        src: "/projects/retirement-analysis/scenario-fan.webp",
        type: "chart",
      },
      {
        title: "2070 equilibrium frontier",
        description:
          "A generated mapping of the relationship between pension level and retirement age.",
        src: "/projects/retirement-analysis/equilibrium-frontier.webp",
        type: "chart",
      },
      {
        title: "COR benchmark validation",
        description:
          "Validation output comparing the model's dependency ratio with COR reference points.",
        src: "/projects/retirement-analysis/cor-validation.webp",
        type: "chart",
      },
    ],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/AxelCorral/retraites-cor2026",
        type: "github",
      },
      {
        label: "Research report",
        url: "/projects/retirement-analysis/memoire-retraites-cor-2026.pdf",
        type: "report",
      },
    ],
    sourcePath: "mini-memoire/",
    evidence: [
      "21 documented tests",
      "5 demographic scenarios",
      "2026–2070 horizon",
      "COR benchmark validation",
    ],
    previewImage:
      "/projects/retirement-analysis/equilibrium-frontier.webp",
    previewAlt:
      "Equilibrium frontier chart from the retirement sustainability project",
    translations: {
      fr: {
        title: "Modèle de soutenabilité des retraites",
        category: "Analyse open data",
        status: "Projet de recherche",
        description:
          "Un modèle comptable reproductible du système français de retraite par répartition, construit à partir des projections démographiques Insee 2026 et comparé au rapport COR 2026.",
        longDescription:
          "Ce projet de recherche rend explicite la logique d’équilibre via une équation comptable fermée et une configuration sourcée des hypothèses. Il sépare la pression démographique de la dynamique relative des pensions, évalue plusieurs scénarios Insee jusqu’en 2070 et valide des trajectoires clés face aux références COR 2026.",
        highlights: [
          "Équation d’équilibre explicite séparant effets démographiques et économiques.",
          "Cinq scénarios démographiques Insee jusqu’en 2070.",
          "Hypothèses sourcées centralisées dans une configuration YAML.",
          "Pipelines de génération de figures académiques et sociales.",
          "Tests automatisés de calibration démographique, économique et du modèle compagnon.",
        ],
        results: [
          {
            label: "Modèle reproductible",
            description:
              "Le taux de cotisation d’équilibre est calculé à partir d’un ratio de dépendance et d’une équation de pension relative explicites.",
          },
          {
            label: "Analyse de scénarios",
            description:
              "Cinq scénarios démographiques Insee et deux approches d’indexation sont représentés sur l’horizon 2026-2070.",
          },
          {
            label: "Calibration",
            description:
              "Le README documente 21 tests automatisés couvrant la calibration démographique, économique et du modèle compagnon.",
          },
          {
            label: "Livrables publiés",
            description:
              "Le dépôt génère des figures académiques, des graphiques au format social et un rapport PDF complet.",
          },
        ],
        screenshots: [
          {
            title: "Ciseaux démographiques",
            description:
              "Comparaison documentée des composantes démographiques et économiques du système.",
            src: "/projects/retirement-analysis/demographic-scissors.webp",
            type: "chart",
          },
          {
            title: "Éventail de scénarios",
            description:
              "Plage de projection générée à partir des scénarios démographiques documentés.",
            src: "/projects/retirement-analysis/scenario-fan.webp",
            type: "chart",
          },
          {
            title: "Frontière d’équilibre 2070",
            description:
              "Cartographie générée de la relation entre niveau de pension et âge de départ.",
            src: "/projects/retirement-analysis/equilibrium-frontier.webp",
            type: "chart",
          },
          {
            title: "Validation benchmark COR",
            description:
              "Sortie de validation comparant le ratio de dépendance du modèle avec les points de référence COR.",
            src: "/projects/retirement-analysis/cor-validation.webp",
            type: "chart",
          },
        ],
        links: [
          {
            label: "GitHub",
            url: "https://github.com/AxelCorral/retraites-cor2026",
            type: "github",
          },
          {
            label: "Rapport de recherche",
            url: "/projects/retirement-analysis/memoire-retraites-cor-2026.pdf",
            type: "report",
          },
        ],
        evidence: [
          "21 tests documentés",
          "5 scénarios démographiques",
          "Horizon 2026-2070",
          "Validation benchmark COR",
        ],
        previewAlt:
          "Graphique de frontière d’équilibre du projet de soutenabilité des retraites",
      },
    },
  },
  {
    id: "04",
    title: "Vers l'Élysée",
    category: "Probabilistic Modeling",
    status: "Deployed project",
    hook: "A probabilistic campaign simulator built to be audited, not just played.",
    description:
      "A narrative and probabilistic simulator of a French presidential campaign, playable directly in the browser: 31 decisions, 9 real political parties and fictional candidates, resolved by a documented model rather than a scripted outcome.",
    whyItMatters:
      "It shows Axel can carry a probabilistic model end to end: state hypotheses, implement them, audit the resulting output and explain the variance behind it, then publish that process instead of only the finished product.",
    longDescription:
      "Vers l'Élysée simulates a full presidential campaign as a sequence of 31 branching decisions across 9 real French political parties, mapped to fictional candidates so the exercise stays methodological rather than personal. It runs live in the browser with a Supabase backend, deployed on Vercel. The code was implemented with Claude Code, while the conception, hypotheses, metrics and interpretation were directed by Axel — and documented publicly through a 3-episode LinkedIn series, \"Vers l'Élysée — Data Notebook\", covering a model audit, counterfactual scenarios and a variance decomposition.",
    keyTakeaway:
      "The strongest signal is not the campaign narrative itself: it is the published audit trail behind it — model assumptions, a documented audit, counterfactuals and a variance decomposition, released alongside the simulator rather than kept private.",
    caseStudy: [
      {
        eyebrow: "Context / problem",
        title: "A playable campaign is only meaningful if its odds are auditable.",
        body:
          "A narrative political simulator can easily become a scripted story wearing the appearance of a model. The challenge was to make 31 campaign decisions resolve through a probabilistic model that could later be questioned, audited and explained — not a fixed branching script.",
        points: [
          "31 decisions span a full campaign arc.",
          "9 real French political parties, mapped to fictional candidates to keep the exercise methodological rather than personal.",
        ],
      },
      {
        eyebrow: "Pipeline / method",
        title: "A browser-playable simulator backed by a documented model.",
        body:
          "The simulator runs live in the browser with a Supabase backend, deployed on Vercel. The implementation itself was carried out with Claude Code, while the conception, the hypotheses, the metrics and their interpretation were directed by Axel throughout.",
        points: [
          "Live deployment: political-destiny.vercel.app.",
          "Backend: Supabase.",
          "Code implemented with Claude Code under Axel's direction.",
        ],
      },
      {
        eyebrow: "Evidence / result",
        title: "The modeling process is published, not just the simulator.",
        body:
          "A companion 3-episode LinkedIn series, \"Vers l'Élysée — Data Notebook\", documents the parts of the work a simulator alone cannot show: a model audit, counterfactual scenarios and a variance decomposition.",
        points: [
          "Episode 1: model audit.",
          "Episode 2: counterfactual scenarios.",
          "Episode 3: variance decomposition.",
        ],
      },
      {
        eyebrow: "What it demonstrates",
        title: "Modeling discipline applied to a subject built to be enjoyable.",
        body:
          "The project pairs a genuinely playable interface with a model whose assumptions are stated and auditable — and treats a politically sensitive subject with a neutral, methodological framing rather than a partisan one.",
        points: [
          "Fictional candidates avoid mapping outcomes onto real public figures.",
          "The published Data Notebook series lets the modeling choices be reviewed independently of the simulator itself.",
        ],
      },
    ],
    technologies: ["Supabase", "Vercel", "Claude Code"],
    highlights: [
      "31 branching decisions across a full presidential campaign.",
      "9 real political parties, mapped to fictional candidates to keep the simulation methodological.",
      "Live browser-playable simulator with a Supabase backend, deployed on Vercel.",
      "Companion \"Vers l'Élysée — Data Notebook\" LinkedIn series: model audit, counterfactuals, variance decomposition.",
      "Code implemented with Claude Code; conception, hypotheses, metrics and interpretation directed by Axel.",
    ],
    results: [
      {
        label: "Decision architecture",
        description:
          "31 decisions branch across a full campaign, resolved by a probabilistic model rather than a fixed script.",
      },
      {
        label: "Party coverage",
        description:
          "9 real French political parties are represented, mapped to fictional candidates to keep the exercise methodological.",
      },
      {
        label: "Deployment",
        description:
          "The simulator runs live on Vercel with a Supabase backend, playable directly in the browser.",
      },
      {
        label: "Published methodology",
        description:
          "A 3-episode LinkedIn series, \"Vers l'Élysée — Data Notebook\", documents a model audit, counterfactual scenarios and a variance decomposition.",
      },
    ],
    links: [
      {
        label: "Open the live simulator",
        url: "https://political-destiny.vercel.app",
        type: "demo",
      },
    ],
    evidence: [
      "31 decisions",
      "9 real parties",
      "Live on Vercel",
      "3-episode Data Notebook series",
    ],
    previewImage: "/projects/political-destiny/hero-preview.webp",
    previewAlt: "Homepage of the Vers l'Élysée campaign simulator",
    demoCaption:
      "You're looking at the live simulator, embedded directly from its Vercel deployment.",
    translations: {
      fr: {
        title: "Vers l'Élysée",
        category: "Modélisation probabiliste",
        status: "Projet déployé",
        hook:
          "Un simulateur de campagne probabiliste conçu pour être audité, pas seulement joué.",
        description:
          "Un simulateur narratif et probabiliste de campagne présidentielle française, jouable directement dans le navigateur : 31 décisions, 9 partis politiques réels et des candidats fictifs, résolus par un modèle documenté plutôt que par un scénario écrit à l'avance.",
        whyItMatters:
          "Ce projet montre qu'Axel sait porter un modèle probabiliste de bout en bout : poser des hypothèses, les implémenter, auditer le résultat et en expliquer la variance, puis publier cette démarche plutôt que seulement le produit fini.",
        longDescription:
          "Vers l'Élysée simule une campagne présidentielle complète comme une séquence de 31 décisions à embranchements, réparties sur 9 partis politiques français réels, associés à des candidats fictifs pour que l'exercice reste méthodologique plutôt que personnel. Il tourne en direct dans le navigateur avec un backend Supabase, déployé sur Vercel. Le code a été implémenté avec Claude Code, tandis que la conception, les hypothèses, les métriques et leur interprétation ont été pilotées par Axel — et documentées publiquement via une série LinkedIn en 3 épisodes, « Vers l'Élysée — Data Notebook », consacrée à un audit du modèle, à des scénarios contrefactuels et à une décomposition de variance.",
        keyTakeaway:
          "Le signal le plus fort n'est pas la campagne elle-même : c'est la démarche publiée derrière elle — hypothèses du modèle, audit documenté, contrefactuels et décomposition de variance, publiés aux côtés du simulateur plutôt que gardés en interne.",
        caseStudy: [
          {
            eyebrow: "Contexte / problème",
            title: "Une campagne jouable n'a de sens que si ses probabilités sont auditables.",
            body:
              "Un simulateur politique narratif peut facilement devenir une histoire scénarisée qui prend l'apparence d'un modèle. L'enjeu était de faire résoudre 31 décisions de campagne par un modèle probabiliste qui puisse ensuite être questionné, audité et expliqué — pas par un arbre de décision figé.",
            points: [
              "31 décisions couvrent une campagne complète.",
              "9 partis politiques français réels, associés à des candidats fictifs pour garder l'exercice méthodologique plutôt que personnel.",
            ],
          },
          {
            eyebrow: "Pipeline / méthode",
            title: "Un simulateur jouable dans le navigateur, adossé à un modèle documenté.",
            body:
              "Le simulateur tourne en direct dans le navigateur avec un backend Supabase, déployé sur Vercel. L'implémentation a été réalisée avec Claude Code, tandis que la conception, les hypothèses, les métriques et leur interprétation ont été pilotées par Axel de bout en bout.",
            points: [
              "Déploiement en ligne : political-destiny.vercel.app.",
              "Backend : Supabase.",
              "Code implémenté avec Claude Code, sous la direction d'Axel.",
            ],
          },
          {
            eyebrow: "Preuve / résultat",
            title: "La démarche de modélisation est publiée, pas seulement le simulateur.",
            body:
              "Une série LinkedIn compagnon en 3 épisodes, « Vers l'Élysée — Data Notebook », documente ce qu'un simulateur seul ne peut pas montrer : un audit du modèle, des scénarios contrefactuels et une décomposition de variance.",
            points: [
              "Épisode 1 : audit du modèle.",
              "Épisode 2 : scénarios contrefactuels.",
              "Épisode 3 : décomposition de variance.",
            ],
          },
          {
            eyebrow: "Ce que ça démontre",
            title: "Une rigueur de modélisation appliquée à un sujet pensé pour être agréable à utiliser.",
            body:
              "Le projet associe une interface réellement jouable à un modèle dont les hypothèses sont énoncées et auditables — et traite un sujet politiquement sensible avec un cadrage neutre et méthodologique plutôt que partisan.",
            points: [
              "Des candidats fictifs évitent de faire correspondre les résultats à de vraies personnalités publiques.",
              "La série Data Notebook publiée permet d'examiner les choix de modélisation indépendamment du simulateur lui-même.",
            ],
          },
        ],
        highlights: [
          "31 décisions à embranchements sur une campagne présidentielle complète.",
          "9 partis politiques réels, associés à des candidats fictifs pour garder la simulation méthodologique.",
          "Simulateur jouable en direct dans le navigateur, avec un backend Supabase, déployé sur Vercel.",
          "Série LinkedIn compagnon « Vers l'Élysée — Data Notebook » : audit du modèle, contrefactuels, décomposition de variance.",
          "Code implémenté avec Claude Code ; conception, hypothèses, métriques et interprétation pilotées par Axel.",
        ],
        results: [
          {
            label: "Architecture de décision",
            description:
              "31 décisions s'embranchent sur une campagne complète, résolues par un modèle probabiliste plutôt que par un scénario figé.",
          },
          {
            label: "Couverture partisane",
            description:
              "9 partis politiques français réels sont représentés, associés à des candidats fictifs pour garder l'exercice méthodologique.",
          },
          {
            label: "Déploiement",
            description:
              "Le simulateur tourne en direct sur Vercel avec un backend Supabase, jouable directement dans le navigateur.",
          },
          {
            label: "Méthodologie publiée",
            description:
              "Une série LinkedIn en 3 épisodes, « Vers l'Élysée — Data Notebook », documente un audit du modèle, des scénarios contrefactuels et une décomposition de variance.",
          },
        ],
        links: [
          {
            label: "Ouvrir le simulateur en ligne",
            url: "https://political-destiny.vercel.app",
            type: "demo",
          },
        ],
        evidence: [
          "31 décisions",
          "9 partis réels",
          "En ligne sur Vercel",
          "Série Data Notebook en 3 épisodes",
        ],
        previewAlt: "Page d'accueil du simulateur de campagne Vers l'Élysée",
        demoCaption:
          "Vous regardez le simulateur en direct, intégré depuis son déploiement Vercel.",
      },
    },
  },
  {
    id: "05",
    title: "Ombrair",
    category: "Rapid Product Delivery",
    status: "Deployed project",
    hook: "A fictitious smart-shutter company, built end to end in a few days with Claude Code.",
    description:
      "A fictitious smart-home company created for a university venture-creation exercise: a full product site around sensors, motorized shutters and windows that anticipate heatwaves, with a 3D product viewer, per-product pricing and a quote-request flow — built almost entirely with Claude Code.",
    whyItMatters:
      "It shows Axel can direct an AI coding agent to ship a complete, coherent product site — catalog, pricing, an interactive 3D product viewer, a quote flow — in the timeframe of a short academic exercise, not just a single static page.",
    longDescription:
      "Ombrair was built for a venture-creation exercise in the Master MIASHS at Université Toulouse Jean Jaurès, framed around heatwaves and thermal comfort at home. The fictitious product is a single automation system sold as three objects — a sensor, motorized shutters and motorized windows — that closes shutters before a room overheats and reopens them once outside air turns cooler. The live site carries a full catalog with per-product pricing, an interactive 3D viewer per product (drag to rotate, scroll or pinch to zoom, an exploded view), a quote-request flow, an app section, a simulator and a resources/FAQ area, deployed on Vercel. The fictional status is stated directly on the site itself, not left ambiguous, and the build was carried out almost end to end with Claude Code.",
    keyTakeaway:
      "The signal here is not the product concept: it is the speed and completeness of the execution — a coherent multi-page site with a working 3D product viewer, delivered in the time span of a short academic exercise under agentic direction.",
    caseStudy: [
      {
        eyebrow: "Context / problem",
        title: "A household problem turned into a venture-creation exercise.",
        body:
          "Ombrair answers a simple household pattern: closing shutters before the heat arrives and reopening them once the air outside cools down is already the right habit, but few households do it every day at the right moment. The exercise imagines a product that automates only that one gesture.",
        points: [
          "University venture-creation exercise: Master MIASHS, Université Toulouse Jean Jaurès.",
          "Explicitly fictional: the site states directly that no real sales are associated with it.",
        ],
      },
      {
        eyebrow: "Pipeline / method",
        title: "A full product site, built almost end to end with Claude Code.",
        body:
          "The three products — sensor, shutter, window — are presented as one system rather than three disconnected pages: a shared catalog, consistent pricing format, and a quote-request flow instead of a checkout cart. Each product page carries an interactive 3D viewer built for the exercise: drag to rotate, scroll or pinch to zoom, and an exploded view of the parts.",
        points: [
          "Deployed live: ombrair.vercel.app.",
          "Interactive 3D viewer on every product page: rotate, zoom, exploded view.",
          "Built almost end to end with Claude Code.",
        ],
      },
      {
        eyebrow: "Evidence / result",
        title: "The 3D viewer is a real interaction, not a static render.",
        body:
          "What the demo below shows is the actual deployed site: the same catalog, the same pricing, the same 3D viewer a visitor would use. Nothing here is a mockup standing in for the product.",
        points: [
          "Three products presented as one coherent system: sensor, shutter, window.",
          "The 3D viewer responds to drag, scroll and pinch live in the embed below.",
        ],
      },
      {
        eyebrow: "What it demonstrates",
        title: "Execution speed and agentic direction, with no ambiguity about what's real.",
        body:
          "The project pairs a fast, complete build with an explicit disclosure of its fictional status — the site itself states there are no real sales — so the speed of execution is the demonstrated skill, not a claim about a real product.",
        points: [
          "The fictional status is disclosed on the site itself, not left for a visitor to guess.",
          "The 3D product view is demonstrated live, not just described in copy.",
        ],
      },
    ],
    technologies: ["Claude Code", "Vercel"],
    highlights: [
      "Fictitious smart-home company built for a university venture-creation exercise (Master MIASHS, Université Toulouse Jean Jaurès).",
      "Full product site: catalog, per-product pricing, quote-request flow, deployed live on Vercel.",
      "Interactive 3D product viewer on every product page: drag to rotate, zoom, exploded view.",
      "Built almost end to end with Claude Code, in the timeframe of a short academic exercise.",
      "Fictional status stated explicitly on the site: no real sales are associated with it.",
    ],
    results: [
      {
        label: "Execution speed",
        description:
          "A complete multi-page product site was delivered in the timeframe of a short university exercise, directed almost entirely through Claude Code.",
      },
      {
        label: "Product scope",
        description:
          "Three products — sensor, shutter, window — presented as one coherent automation system, each with its own page, pricing and 3D viewer.",
      },
      {
        label: "3D as proof, not claim",
        description:
          "Each product page includes an interactive 3D viewer (rotate, zoom, exploded view) instead of a static photo or render.",
      },
      {
        label: "Explicit fictional framing",
        description:
          "The site states directly that it is a fictitious student project with no real sales, leaving no ambiguity for a visitor.",
      },
    ],
    links: [
      {
        label: "Open the live site",
        url: "https://ombrair.vercel.app",
        type: "demo",
      },
    ],
    evidence: [
      "3 products, 1 system",
      "Interactive 3D viewer",
      "Built with Claude Code",
      "Live on Vercel",
    ],
    previewImage: "/projects/ombrair/hero-preview.webp",
    previewAlt: "Interactive 3D viewer on the Ombrair sensor product page",
    demoCaption:
      "You're looking at the live site, embedded directly from its Vercel deployment — try the 3D viewer on a product page.",
    translations: {
      fr: {
        title: "Ombrair",
        category: "Livraison produit rapide",
        status: "Projet déployé",
        hook:
          "Une entreprise fictive de volets connectés, construite de bout en bout en quelques jours avec Claude Code.",
        description:
          "Une entreprise fictive de maison connectée créée pour un exercice universitaire de création d'entreprise : un site produit complet autour de capteurs, volets et fenêtres motorisés qui anticipent les canicules, avec un visualiseur 3D par produit, des tarifs et une demande de devis — construit presque entièrement avec Claude Code.",
        whyItMatters:
          "Cela montre qu'Axel sait piloter un agent de code IA pour livrer un site produit complet et cohérent — catalogue, tarifs, visualiseur 3D interactif, parcours de devis — dans le temps d'un exercice académique court, pas seulement une simple page statique.",
        longDescription:
          "Ombrair a été construit pour un exercice de création d'entreprise du Master MIASHS de l'Université Toulouse Jean Jaurès, sur la problématique des canicules et du confort thermique du logement. Le produit fictif est un système d'automatisation unique vendu comme trois objets — un capteur, des volets motorisés et des fenêtres motorisées — qui ferme les volets avant qu'une pièce ne surchauffe et les rouvre quand l'air extérieur redevient plus frais. Le site en ligne porte un catalogue complet avec un tarif par produit, un visualiseur 3D interactif par produit (glisser pour faire pivoter, molette ou pincement pour zoomer, vue éclatée), une demande de devis, une section application, un simulateur et un espace ressources/FAQ, déployé sur Vercel. Le caractère fictif est énoncé directement sur le site lui-même, sans ambiguïté, et la construction a été menée presque de bout en bout avec Claude Code.",
        keyTakeaway:
          "Le signal ici n'est pas le concept produit : c'est la vitesse et la complétude de l'exécution — un site multi-pages cohérent avec un visualiseur 3D fonctionnel, livré dans le temps d'un exercice académique court sous pilotage agentique.",
        caseStudy: [
          {
            eyebrow: "Contexte / problème",
            title: "Un problème domestique transformé en exercice de création d'entreprise.",
            body:
              "Ombrair répond à un schéma domestique simple : fermer les volets avant que la chaleur n'arrive et les rouvrir quand l'air extérieur redevient frais est déjà le bon réflexe, mais peu de foyers le font chaque jour au bon moment. L'exercice imagine un produit qui automatise seulement ce geste-là.",
            points: [
              "Exercice universitaire de création d'entreprise : Master MIASHS, Université Toulouse Jean Jaurès.",
              "Explicitement fictif : le site indique directement qu'aucune vente réelle n'y est associée.",
            ],
          },
          {
            eyebrow: "Pipeline / méthode",
            title: "Un site produit complet, construit presque de bout en bout avec Claude Code.",
            body:
              "Les trois produits — capteur, volet, fenêtre — sont présentés comme un seul système plutôt que trois pages disjointes : un catalogue commun, un format de prix cohérent, et une demande de devis plutôt qu'un panier d'achat. Chaque page produit porte un visualiseur 3D interactif construit pour l'exercice : glisser pour faire pivoter, molette ou pincement pour zoomer, et une vue éclatée des pièces.",
            points: [
              "Déployé en ligne : ombrair.vercel.app.",
              "Visualiseur 3D interactif sur chaque page produit : rotation, zoom, vue éclatée.",
              "Construit presque de bout en bout avec Claude Code.",
            ],
          },
          {
            eyebrow: "Preuve / résultat",
            title: "Le visualiseur 3D est une vraie interaction, pas un rendu statique.",
            body:
              "Ce que montre la démo ci-dessous est le site réellement déployé : le même catalogue, les mêmes tarifs, le même visualiseur 3D qu'un visiteur utiliserait. Rien ici n'est une maquette qui tient lieu de produit.",
            points: [
              "Trois produits présentés comme un système cohérent : capteur, volet, fenêtre.",
              "Le visualiseur 3D répond au glisser, à la molette et au pincement en direct dans l'intégration ci-dessous.",
            ],
          },
          {
            eyebrow: "Ce que ça démontre",
            title: "Vitesse d'exécution et pilotage agentique, sans ambiguïté sur ce qui est réel.",
            body:
              "Le projet associe une construction rapide et complète à une déclaration explicite de son caractère fictif — le site lui-même indique qu'aucune vente réelle n'y est associée — de sorte que la compétence démontrée est la vitesse d'exécution, pas une affirmation sur un produit réel.",
            points: [
              "Le caractère fictif est déclaré sur le site lui-même, pas laissé à deviner par le visiteur.",
              "La vue 3D du produit est démontrée en direct, pas seulement décrite dans le texte.",
            ],
          },
        ],
        highlights: [
          "Entreprise fictive de maison connectée construite pour un exercice universitaire de création d'entreprise (Master MIASHS, Université Toulouse Jean Jaurès).",
          "Site produit complet : catalogue, tarif par produit, demande de devis, déployé en ligne sur Vercel.",
          "Visualiseur 3D interactif sur chaque page produit : glisser pour pivoter, zoomer, vue éclatée.",
          "Construit presque de bout en bout avec Claude Code, dans le temps d'un exercice académique court.",
          "Caractère fictif énoncé explicitement sur le site : aucune vente réelle n'y est associée.",
        ],
        results: [
          {
            label: "Vitesse d'exécution",
            description:
              "Un site produit complet à plusieurs pages a été livré dans le temps d'un exercice universitaire court, piloté presque entièrement via Claude Code.",
          },
          {
            label: "Périmètre produit",
            description:
              "Trois produits — capteur, volet, fenêtre — présentés comme un seul système d'automatisation cohérent, chacun avec sa page, son tarif et son visualiseur 3D.",
          },
          {
            label: "La 3D comme preuve, pas comme affirmation",
            description:
              "Chaque page produit inclut un visualiseur 3D interactif (rotation, zoom, vue éclatée) plutôt qu'une photo ou un rendu statique.",
          },
          {
            label: "Cadrage fictif explicite",
            description:
              "Le site indique directement qu'il s'agit d'un projet étudiant fictif sans vente réelle, sans laisser d'ambiguïté au visiteur.",
          },
        ],
        links: [
          {
            label: "Ouvrir le site en ligne",
            url: "https://ombrair.vercel.app",
            type: "demo",
          },
        ],
        evidence: [
          "3 produits, 1 système",
          "Visualiseur 3D interactif",
          "Construit avec Claude Code",
          "En ligne sur Vercel",
        ],
        previewAlt: "Visualiseur 3D interactif sur la page du capteur Ombrair",
        demoCaption:
          "Vous regardez le site en direct, intégré depuis son déploiement Vercel — essayez le visualiseur 3D sur une page produit.",
      },
    },
  },
  {
    id: "06",
    title: "Football Video Analysis",
    category: "Computer Vision Research",
    status: "Research in progress",
    hook: "A detection-and-tracking pipeline for football video, published as work in progress under a CPU-only constraint.",
    description:
      "A research pipeline that detects and tracks players from football video (YOLOv8 + ByteTrack), calibrates a homography to project their positions onto real pitch coordinates, and surfaces the result through a 5-page Streamlit interface — run end to end on two real matches, entirely on CPU.",
    whyItMatters:
      "It shows Axel can carry a computer-vision research pipeline through real engineering constraints — CPU-only, no GPU — instead of only prototyping under ideal conditions, and can state plainly what is finished, what is being tested, and what does not exist yet.",
    longDescription:
      "This pipeline detects and tracks players and the ball across football broadcast footage using YOLOv8 for detection and ByteTrack for frame-to-frame tracking, then calibrates a per-sequence homography to project those tracked positions onto real-world pitch coordinates. Team clustering, play-phase classification and key-event detection turn the raw tracking data into a structure a coach could read, surfaced through a 5-page Streamlit interface (Home, Segments, Minimap, Player, Teams). The pipeline was run end to end on two real matches — Real Madrid–Dortmund (UEFA Champions League) and Swansea–Man City (Carabao Cup) — under a hard constraint: CPU only, no GPU. A track currently under study aims at persistent player IDs across segment boundaries, re-identifying a player by jersey color, position and role. The project is not public: no repository, no live demo. This section is an introduction to a piece of research in progress, illustrated with reconstructed abstract diagrams rather than real pipeline exports, which are not available yet.",
    keyTakeaway:
      "The project is presented for what it is: research in progress, not a finished deliverable — with a CPU-only constraint treated as an engineering condition to design around, not a caveat to excuse the result.",
    caseStudy: [
      {
        eyebrow: "Context / problem",
        title: "Extracting a coaching-relevant signal from broadcast video, on CPU only.",
        body:
          "Turning football broadcast footage into something a coach can act on requires detecting every player reliably, keeping track of who is who across the sequence, and doing it without the GPU budget most video pipelines assume.",
        points: [
          "Detection and tracking: YOLOv8 + ByteTrack.",
          "Hard constraint, assumed by design: CPU only, no GPU.",
        ],
      },
      {
        eyebrow: "Pipeline / method",
        title: "From tracked pixels to pitch coordinates to a readable interface.",
        body:
          "A homography calibrated per sequence projects tracked player positions from the broadcast camera view onto real-world pitch coordinates. Team clustering, play-phase classification and key-event detection structure that data, surfaced through a 5-page Streamlit interface: Home, Segments, Minimap, Player, Teams.",
        points: [
          "Homography calibration projects tracking data onto real pitch coordinates.",
          "5-page Streamlit interface: Home, Segments, Minimap, Player, Teams.",
        ],
      },
      {
        eyebrow: "Evidence / result",
        title: "Run end to end on two real matches, not a synthetic clip.",
        body:
          "The pipeline was applied to full broadcast footage from two real matches under the CPU-only constraint throughout — not a curated demo clip. A track under active study extends tracking across segment boundaries, re-identifying a player by jersey color, position and role.",
        points: [
          "Applied to Real Madrid–Dortmund (UEFA Champions League) and Swansea–Man City (Carabao Cup).",
          "Track in progress: persistent player IDs across segments, via jersey color + position + role.",
        ],
      },
      {
        eyebrow: "What it demonstrates",
        title: "A research pipeline stated honestly, ambition and constraint both included.",
        body:
          "The end goal is to compare a situation extracted from video against thousands of situations from real matches, to infer and visualize the decision it suggests — tactical feedback a coach or player could use. That goal is not yet reached; what is shown here is the pipeline built toward it, under a constraint that will not go away.",
        points: [
          "No repository or live demo: this section introduces work in progress, not a finished product.",
          "Visuals here are reconstructed abstract diagrams, never a broadcast capture or a club/competition logo.",
        ],
      },
    ],
    technologies: ["YOLOv8", "ByteTrack", "OpenCV", "Streamlit", "Python"],
    highlights: [
      "Detection and tracking pipeline: YOLOv8 for detection, ByteTrack for frame-to-frame tracking.",
      "Homography calibration projects player positions onto real pitch coordinates.",
      "5-page Streamlit interface: Home, Segments, Minimap, Player, Teams.",
      "Run end to end on two real matches — Real Madrid–Dortmund (UEFA Champions League), Swansea–Man City (Carabao Cup) — entirely on CPU.",
      "Research track in progress: persistent player IDs across segments via jersey color, position and role.",
    ],
    results: [
      {
        label: "Detection & tracking",
        description:
          "YOLOv8 detects players and the ball per frame; ByteTrack links detections into continuous tracks across the sequence.",
      },
      {
        label: "Real-world calibration",
        description:
          "A per-sequence homography projects tracked positions from the camera view onto real pitch coordinates.",
      },
      {
        label: "Engineering constraint",
        description:
          "The full pipeline runs on CPU only, with no GPU — a constraint that shaped every design choice upstream.",
      },
      {
        label: "Applied to real matches",
        description:
          "Run end to end on two real matches: Real Madrid–Dortmund (UEFA Champions League) and Swansea–Man City (Carabao Cup).",
      },
    ],
    evidence: [
      "YOLOv8 + ByteTrack",
      "Homography-calibrated pitch coordinates",
      "5-page Streamlit interface",
      "2 real matches, CPU only",
    ],
    translations: {
      fr: {
        title: "Analyse vidéo football",
        category: "Recherche en vision par ordinateur",
        status: "Recherche en cours",
        hook:
          "Un pipeline de détection et de tracking pour la vidéo de football, publié comme un travail en cours sous contrainte CPU uniquement.",
        description:
          "Un pipeline de recherche qui détecte et tracke les joueurs à partir de vidéo de football (YOLOv8 + ByteTrack), calibre une homographie pour projeter leurs positions en coordonnées terrain réelles, et restitue le résultat via une interface Streamlit à 5 pages — exécuté de bout en bout sur deux vrais matchs, entièrement en CPU.",
        whyItMatters:
          "Cela montre qu'Axel sait porter un pipeline de recherche en vision par ordinateur à travers de vraies contraintes d'ingénierie — CPU uniquement, sans GPU — plutôt que de seulement prototyper en conditions idéales, et sait énoncer clairement ce qui est fini, ce qui est en cours de test, et ce qui n'existe pas encore.",
        longDescription:
          "Ce pipeline détecte et tracke les joueurs et le ballon sur des extraits de diffusion de football, avec YOLOv8 pour la détection et ByteTrack pour le suivi image par image, puis calibre une homographie par séquence pour projeter ces positions trackées en coordonnées terrain réelles. Clustering d'équipes, classification des phases de jeu et détection d'événements clés transforment les données brutes de tracking en une structure lisible par un entraîneur, restituée via une interface Streamlit à 5 pages (Accueil, Segments, Minimap, Joueur, Équipes). Le pipeline a été exécuté de bout en bout sur deux vrais matchs — Real Madrid–Dortmund (Ligue des champions UEFA) et Swansea–Man City (Carabao Cup) — sous une contrainte stricte : CPU uniquement, sans GPU. Une piste actuellement à l'étude vise des identifiants de joueurs persistants d'un segment à l'autre, par ré-identification via la couleur de maillot, la position et le rôle. Le projet n'est pas public : aucun dépôt, aucune démo en ligne. Cette section est une introduction à un travail de recherche en cours, illustrée par des schémas abstraits reconstruits plutôt que par des exports réels du pipeline, qui ne sont pas encore disponibles.",
        keyTakeaway:
          "Le projet est présenté pour ce qu'il est : une recherche en cours, pas un livrable fini — avec la contrainte CPU uniquement traitée comme une condition d'ingénierie à concevoir, pas comme une excuse pour le résultat.",
        caseStudy: [
          {
            eyebrow: "Contexte / problème",
            title: "Extraire un signal utile à un entraîneur depuis de la vidéo de diffusion, en CPU uniquement.",
            body:
              "Transformer un extrait de diffusion de football en quelque chose d'exploitable par un entraîneur suppose de détecter chaque joueur de façon fiable, de garder la trace de qui est qui sur toute la séquence, et de le faire sans le budget GPU que suppose la plupart des pipelines vidéo.",
            points: [
              "Détection et tracking : YOLOv8 + ByteTrack.",
              "Contrainte stricte, assumée dès la conception : CPU uniquement, sans GPU.",
            ],
          },
          {
            eyebrow: "Pipeline / méthode",
            title: "Des pixels trackés aux coordonnées terrain, jusqu'à une interface lisible.",
            body:
              "Une homographie calibrée par séquence projette les positions trackées depuis la vue caméra vers des coordonnées terrain réelles. Clustering d'équipes, classification des phases de jeu et détection d'événements clés structurent ces données, restituées via une interface Streamlit à 5 pages : Accueil, Segments, Minimap, Joueur, Équipes.",
            points: [
              "La calibration par homographie projette les données de tracking en coordonnées terrain réelles.",
              "Interface Streamlit à 5 pages : Accueil, Segments, Minimap, Joueur, Équipes.",
            ],
          },
          {
            eyebrow: "Preuve / résultat",
            title: "Exécuté de bout en bout sur deux vrais matchs, pas un clip synthétique.",
            body:
              "Le pipeline a été appliqué à de véritables extraits de diffusion de deux vrais matchs, sous la contrainte CPU uniquement de bout en bout — pas un clip de démonstration choisi pour l'occasion. Une piste activement étudiée étend le tracking au-delà des segments, par ré-identification via la couleur de maillot, la position et le rôle.",
            points: [
              "Appliqué à Real Madrid–Dortmund (Ligue des champions UEFA) et Swansea–Man City (Carabao Cup).",
              "Piste en cours : identifiants de joueurs persistants entre segments, via couleur de maillot + position + rôle.",
            ],
          },
          {
            eyebrow: "Ce que ça démontre",
            title: "Un pipeline de recherche présenté honnêtement, ambition et contrainte comprises.",
            body:
              "L'objectif final est de comparer une situation extraite d'une vidéo à des milliers de situations issues de vrais matchs, pour en déduire et visualiser la décision qu'elle suggère — un retour tactique qu'un entraîneur ou un joueur pourrait utiliser. Cet objectif n'est pas encore atteint : ce qui est montré ici est le pipeline construit pour y parvenir, sous une contrainte qui ne disparaîtra pas.",
            points: [
              "Aucun dépôt ni démo en ligne : cette section introduit un travail en cours, pas un produit fini.",
              "Les visuels sont des schémas abstraits reconstruits, jamais une capture de diffusion ni un logo de club ou de compétition.",
            ],
          },
        ],
        highlights: [
          "Pipeline de détection et de tracking : YOLOv8 pour la détection, ByteTrack pour le suivi image par image.",
          "Calibration par homographie projetant les positions des joueurs en coordonnées terrain réelles.",
          "Interface Streamlit à 5 pages : Accueil, Segments, Minimap, Joueur, Équipes.",
          "Exécuté de bout en bout sur deux vrais matchs — Real Madrid–Dortmund (Ligue des champions UEFA), Swansea–Man City (Carabao Cup) — entièrement en CPU.",
          "Piste de recherche en cours : identifiants de joueurs persistants entre segments via couleur de maillot, position et rôle.",
        ],
        results: [
          {
            label: "Détection & tracking",
            description:
              "YOLOv8 détecte joueurs et ballon par frame ; ByteTrack relie les détections en trajectoires continues sur la séquence.",
          },
          {
            label: "Calibration terrain réel",
            description:
              "Une homographie par séquence projette les positions trackées depuis la vue caméra en coordonnées terrain réelles.",
          },
          {
            label: "Contrainte d'ingénierie",
            description:
              "Le pipeline complet tourne en CPU uniquement, sans GPU — une contrainte qui a façonné chaque choix de conception en amont.",
          },
          {
            label: "Appliqué à de vrais matchs",
            description:
              "Exécuté de bout en bout sur deux vrais matchs : Real Madrid–Dortmund (Ligue des champions UEFA) et Swansea–Man City (Carabao Cup).",
          },
        ],
        evidence: [
          "YOLOv8 + ByteTrack",
          "Coordonnées terrain calibrées par homographie",
          "Interface Streamlit à 5 pages",
          "2 vrais matchs, CPU uniquement",
        ],
      },
    },
  },
];

export const projectSkills = Array.from(
  new Set(projects.flatMap((project) => project.technologies)),
);
