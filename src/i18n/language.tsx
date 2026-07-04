import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "fr";

const STORAGE_KEY = "portfolio-language";

export const translations = {
  en: {
    languageName: "English",
    switchTo: "Switch to French",
    nav: {
      aria: "Primary navigation",
      top: "Axel Corral, top of page",
      profile: "Profile",
      projects: "Projects",
      skills: "Skills",
      experience: "Experience",
      cv: "CV",
      contact: "Contact",
    },
    hero: {
      introLabel: "Axel Corral · Toulouse / France",
      cityAria: "Shaping data with clarity and action.",
      cityLines: ["Data systems", "built for clarity."],
      cityText:
        "Data Analyst / Junior Data Engineer working with Power BI, SQL, Python, dashboards, pipelines and reproducible analysis.",
      viewProjects: "View projects",
      viewSelectedWork: "View selected work",
      tag: "Business Intelligence. Data Engineering. Analysis.",
      role: "Data Analyst · Data Engineer Junior · Toulouse / France",
      profileText:
        "I build analytical systems, dashboards and data workflows that turn complex information into clear decisions: Power BI, SQL, Python, reporting automation and open-data analysis.",
      proof: ["Power BI dashboards", "SQL + Python", "Data pipelines"],
      personalLayer: "Personal layer",
      scrollPrompt: "Scroll to move from context to craft",
      openPersonalLayer: "Open personal layer",
      viewCV: "View CV",
      downloadCV: "Download",
    },
    projects: {
      kicker: "Selected projects / proof first",
      title: "Data work you can inspect.",
      intro:
        "Three projects with repositories, methods, outputs and evidence points surfaced before the skill list.",
      project: "Project",
      whyItMatters: "Why it matters",
      openCaseStudy: "Open case study",
      viewRepository: "View repository",
      viewReport: "View report",
      evidencePoints: "evidence points",
      caseStudyPreview: "Context, pipeline, evidence and takeaway",
      discoverPersonal: "Discover the personal layer",
      contactAxel: "Contact Axel",
    },
    capabilities: {
      title: "Capabilities connected to real projects.",
      subtitle: "Dashboards, pipelines, models and analytical storytelling.",
      learnMore: "Learn more",
    },
    about: {
      kicker: "Analytical profile",
      segments: [
        "I’m Axel Corral,",
        "a data profile shaped by field experience.",
        "I work on dashboards, pipelines, reporting systems and quantitative analysis with a strong focus on clarity.",
      ],
      body:
        "I am currently building my path toward data analysis and data engineering, with experience across business intelligence, Power BI, SQL, Python, reporting automation and open data projects. My work combines technical execution with a practical understanding of business needs, from production dashboards to portfolio projects designed to demonstrate method, rigor and autonomy.",
    },
    contact: {
      kicker: "Contact / next step",
      title: "Let us talk about dashboards, pipelines and analytical systems.",
      body:
        "Available for data analyst and junior data engineering opportunities, portfolio reviews and practical analytics projects.",
    },
    modal: {
      overview: "Overview",
      results: "Results",
      outputs: "Outputs",
      links: "Links",
      tech: "Tech",
      projectDetails: "Project details",
      closePrefix: "Close",
      closeSuffix: "details",
      status: "Status",
      sourceFolder: "Source folder",
      workspaceEvidence: "Workspace evidence",
      keyTakeaway: "Key takeaway",
    },
    skip: "Skip to content",
  },
  fr: {
    languageName: "Français",
    switchTo: "Passer en anglais",
    nav: {
      aria: "Navigation principale",
      top: "Axel Corral, haut de page",
      profile: "Profil",
      projects: "Projets",
      skills: "Compétences",
      experience: "Expérience",
      cv: "CV",
      contact: "Contact",
    },
    hero: {
      introLabel: "Axel Corral · Toulouse / France",
      cityAria: "Structurer la donnée avec clarté et impact.",
      cityLines: ["Systèmes data", "pensés pour clarifier."],
      cityText:
        "Data Analyst / Junior Data Engineer travaillant avec Power BI, SQL, Python, des dashboards, des pipelines et des analyses reproductibles.",
      viewProjects: "Voir les projets",
      viewSelectedWork: "Voir les projets sélectionnés",
      tag: "Business Intelligence. Ingénierie des données. Analyse.",
      role: "Data Analyst · Data Engineer Junior · Toulouse / France",
      profileText:
        "Je construis des systèmes analytiques, des dashboards et des workflows data qui transforment des informations complexes en décisions claires : Power BI, SQL, Python, automatisation du reporting et analyse open data.",
      proof: ["Dashboards Power BI", "SQL + Python", "Pipelines data"],
      personalLayer: "Couche personnelle",
      scrollPrompt: "Faites défiler pour passer du contexte au savoir-faire",
      openPersonalLayer: "Ouvrir la couche personnelle",
      viewCV: "Voir mon CV",
      downloadCV: "Télécharger",
    },
    projects: {
      kicker: "Projets sélectionnés / preuve d’abord",
      title: "Des projets data vérifiables.",
      intro:
        "Trois projets avec dépôts, méthodes, livrables et points de preuve visibles avant la liste de compétences.",
      project: "Projet",
      whyItMatters: "Pourquoi c’est important",
      openCaseStudy: "Voir l’étude de cas",
      viewRepository: "Voir le dépôt",
      viewReport: "Voir le rapport",
      evidencePoints: "points de preuve",
      caseStudyPreview: "Contexte, pipeline, preuves et synthèse",
      discoverPersonal: "Découvrir la couche personnelle",
      contactAxel: "Contacter Axel",
    },
    capabilities: {
      title: "Des compétences reliées à des projets réels.",
      subtitle: "Dashboards, pipelines, modèles et storytelling analytique.",
      learnMore: "En savoir plus",
    },
    about: {
      kicker: "Profil analytique",
      segments: [
        "Je suis Axel Corral,",
        "un profil data façonné par l’expérience terrain.",
        "Je travaille sur des dashboards, pipelines, systèmes de reporting et analyses quantitatives avec une forte exigence de clarté.",
      ],
      body:
        "Je construis actuellement mon parcours vers l’analyse de données et la data engineering, avec une expérience en business intelligence, Power BI, SQL, Python, automatisation du reporting et projets open data. Mon travail combine exécution technique et compréhension concrète des besoins métier, des dashboards en production aux projets portfolio conçus pour démontrer méthode, rigueur et autonomie.",
    },
    contact: {
      kicker: "Contact / prochaine étape",
      title: "Parlons dashboards, pipelines et systèmes analytiques.",
      body:
        "Disponible pour des opportunités de Data Analyst et Junior Data Engineer, des revues de portfolio et des projets analytiques concrets.",
    },
    modal: {
      overview: "Vue d’ensemble",
      results: "Résultats",
      outputs: "Livrables",
      links: "Liens",
      tech: "Tech",
      projectDetails: "Détails du projet",
      closePrefix: "Fermer",
      closeSuffix: "",
      status: "Statut",
      sourceFolder: "Dossier source",
      workspaceEvidence: "Preuves visibles",
      keyTakeaway: "À retenir",
    },
    skip: "Aller au contenu",
  },
} as const;

type TranslationCopy = (typeof translations)[Language];

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: TranslationCopy;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "fr" || saved === "en" ? saved : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((current) => (current === "en" ? "fr" : "en")),
      t: translations[language],
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
