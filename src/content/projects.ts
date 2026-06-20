export type ProjectStatus = "en-cours" | "deploye";

export interface Project {
  id: string;
  role: "hero-deep-dive" | "rail";
  statut: ProjectStatus;
  statutLabel: string;
  title: string;
  thesis: string;
  chiffreCle: string;
  chiffreCleLabel: string;
  placeholder: boolean;
  chiffreSecondaire?: string;
  chiffreSecondaireLabel?: string;
  placeholderSecondaire?: boolean;
  stack: string[];
  lien?: string;
}

export const projects: Project[] = [
  {
    id: "analyse-video-football",
    role: "hero-deep-dive",
    statut: "en-cours",
    statutLabel: "Hero · Deep dive",
    title: "Analyse vidéo football",
    thesis:
      "Transformer une simple vidéo de match en données de positionnement exploitables par un coach — qui était où, et quand — sans capteur ni caméra spécialisée.",
    chiffreCle: "22",
    chiffreCleLabel: "joueurs suivis image par image · 90 min de match",
    placeholder: true,
    stack: ["Python", "YOLOv8", "ByteTrack", "OpenCV", "Streamlit"],
  },
  {
    id: "football-pipeline",
    role: "rail",
    statut: "en-cours",
    statutLabel: "Rail",
    title: "football-pipeline",
    thesis:
      "Automatiser la collecte et la mise en forme de données football jusqu'à un dashboard live, déployé et maintenu comme un vrai produit (pas un notebook).",
    chiffreCle: "~2 000",
    chiffreCleLabel: "matchs agrégés · rafraîchis quotidiennement",
    placeholder: true,
    stack: ["Python", "Streamlit", "GitHub + GitLab"],
    lien: "football-pipeline-axel.streamlit.app",
  },
  {
    id: "scout-ia",
    role: "rail",
    statut: "en-cours",
    statutLabel: "Rail",
    title: "scout-ia",
    thesis:
      "Construire un outil de scouting qui transforme les données d'événements StatsBomb en métriques de joueurs comparables, avec une couche de transformation versionnée et testée.",
    chiffreCle: "3,1 M",
    chiffreCleLabel: "événements StatsBomb modélisés · 40 modèles dbt",
    placeholder: true,
    stack: ["Python", "dbt", "StatsBomb", "SQL"],
  },
  {
    id: "jobtrackr",
    role: "rail",
    statut: "deploye",
    statutLabel: "Rail · Déployé",
    title: "JobTrackr",
    thesis:
      "Un « Career OS » qui centralise toute une recherche d'emploi — du suivi des candidatures à l'agrégation automatique d'offres et au scoring IA de compatibilité.",
    chiffreCle: "3",
    chiffreCleLabel: "sources d'offres agrégées automatiquement · France Travail · Adzuna · RSS",
    placeholder: false,
    chiffreSecondaire: "180+",
    chiffreSecondaireLabel: "candidatures suivies",
    placeholderSecondaire: true,
    stack: ["Next.js", "PostgreSQL · Neon", "Vercel", "Gemini"],
  },
];

export const heroProject = projects.find((p) => p.role === "hero-deep-dive")!;
export const railProjects = projects;

export interface CredibiliteItem {
  title: string;
  description: string;
  chiffre?: string;
  chiffreLabel?: string;
}

export const credibilite: CredibiliteItem[] = [
  {
    title: "Energy EDA",
    description:
      "Pipeline EDA sur 14 M lignes de consommation énergétique, enrichi via API Open-Meteo (DJU Toulouse-Blagnac).",
    chiffre: "14 M",
    chiffreLabel: "Volume réel",
  },
  {
    title: "ECR · DSM-Firmenich",
    description:
      "Digitalisation du workflow Engineering Change Request en entreprise — SharePoint Online + Power Automate.",
  },
];

export const stackField = [
  "Python",
  "YOLOv8",
  "dbt",
  "Next.js",
  "PostgreSQL",
  "StatsBomb",
  "ByteTrack",
  "OpenCV",
  "Streamlit",
  "SQL",
  "Vercel",
  "Gemini",
  "Power Automate",
  "Open-Meteo API",
  "GitLab",
];
