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
  type: "github" | "repository" | "report";
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
  sourcePath: string;
  evidence: string[];
  previewImage?: string;
  previewAlt?: string;
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
    id: "03",
    title: "Scout IA",
    category: "Analytics Engineering",
    status: "Personal project",
    description:
      "A football scouting pipeline that loads StatsBomb Open Data into DuckDB, models player metrics with dbt and identifies unusual statistical profiles using position-based percentiles.",
    longDescription:
      "Scout IA is structured around a local analytical warehouse and a dbt transformation layer. Raw StatsBomb event data is staged in DuckDB, transformed into player-level marts and scored through position-specific per-90 percentiles before concise reports are assembled from the supplied metrics.",
    technologies: [
      "Python",
      "SQL",
      "DuckDB",
      "dbt",
      "StatsBomb",
      "pandas",
      "Streamlit",
      "pytest",
      "Anthropic API",
    ],
    highlights: [
      "StatsBomb JSON ingestion into a local DuckDB warehouse.",
      "Three staging models and four player-level marts in dbt.",
      "Per-90 statistics and position-specific percentile calculations.",
      "Minimum 450-minute threshold before player scoring.",
      "Structured scouting reports generated only from supplied metrics.",
    ],
    results: [
      {
        label: "Warehouse layer",
        description:
          "StatsBomb JSON ingestion is designed to populate a local DuckDB warehouse with matches, lineups and events.",
      },
      {
        label: "dbt lineage",
        description:
          "Three staging models feed four documented player-level marts for minutes, totals, per-90 metrics and percentiles.",
      },
      {
        label: "Comparable metrics",
        description:
          "Eleven per-90 measures are ranked by player position after a documented 450-minute eligibility threshold.",
      },
      {
        label: "Structured reports",
        description:
          "The report generator is constrained to the supplied statistics and produces profile, attention and recommendation sections.",
      },
    ],
    sourcePath: "scout-ia/",
    evidence: [
      "7 dbt models",
      "11 percentile metrics",
      "450-minute eligibility floor",
      "Staging → marts lineage",
    ],
  },
];

export const projectSkills = Array.from(
  new Set(projects.flatMap((project) => project.technologies)),
);
