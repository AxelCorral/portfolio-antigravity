export type ProjectCategory =
  | "Data Engineering"
  | "Open Data Analysis"
  | "Analytics Engineering";

export type ProjectStatus =
  | "Portfolio project"
  | "Research project"
  | "Personal project";

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
};

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
