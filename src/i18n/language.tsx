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
    carousel: {
      expandFullScreen: "Expand to full screen",
      closeExpandedView: "Close expanded view",
      slideNavigation: "Slide navigation",
      goToSlide: "Go to slide",
      previousSlide: "Previous slide",
      nextSlide: "Next slide",
      slideWord: "Slide",
      ofWord: "of",
    },
    buildMode: {
      kicker: "AXEL CORRAL — PERSONAL LAYER",
      title: "Personal layer",
      subtitle:
        "The part behind the projects: curiosity, tools, football, AI experiments and systems I build for myself.",
      hint: "Move around to reveal what sits behind the work.",
      closeLabel: "Close",
      closeAriaLabel: "Close personal layer",
      moreSignals: "More signals",
      mapAriaLabel: "Personal thoughts around Axel",
      signalsAriaPrefix: "Personal signals",
      sectionKicker: "Behind the work / personal universe",
      sectionTitle: "Signals beneath the surface.",
      sectionSubtitle:
        "The bubbles above are the primary experience. This fallback keeps the same thoughts readable on touch screens and slower browsing moments.",
      closingAriaLabel: "Personal layer closing actions",
      closingText:
        "This layer is personal, but it points back to the same professional promise: useful systems, fast learning and clear interfaces.",
      backToWork: "Back to professional work",
      signals: [
        "football analysis",
        "3D avatar",
        "interface design",
        "open learning",
        "Toulouse",
        "systems thinking",
        "portfolio craft",
        "personal projects",
      ],
      bubbles: [
        {
          id: "builder",
          label: "I build what I need",
          eyebrow: "Builder reflex",
          title: "Tools usually start with a real need.",
          body: "I like turning recurring needs into tools: apps, automations, bots or small systems that make daily life clearer.",
          points: [
            "JobTrackr started from a real job-search need.",
            "Personal automations and AI-assisted workflows follow the same reflex.",
            "When I need a tool, I try to build it.",
          ],
          linkLabel: null,
        },
        {
          id: "ai",
          label: "AI playground",
          eyebrow: "AI experiments",
          title: "AI is a creative and technical accelerator.",
          body: "I use AI as a practical accelerator: prompts, visual concepts, video experiments, automation loops, Codex-style building and iterative product improvement.",
          points: [
            "The point is not hype; it is faster learning and sharper iteration.",
            "AI helps me prototype, critique, polish and ship with tighter loops.",
          ],
          linkLabel: null,
        },
        {
          id: "football",
          label: "Football brain",
          eyebrow: "Football & data",
          title: "Football is a playground for uncertainty.",
          body: "Football is one of my natural playgrounds for data: form, momentum, trajectories, decisions, uncertainty and emotion.",
          points: [
            "It connects naturally to analysis, scouting and storytelling.",
            "The professional portfolio includes a football-pipeline project built around this interest.",
          ],
          linkLabel: "See football-pipeline",
        },
        {
          id: "visual",
          label: "Visual instinct",
          eyebrow: "Creative direction",
          title: "How it feels matters as much as how it works.",
          body: "I care about how things feel, not only how they work. A useful data product should be clear, readable and visually intentional.",
          points: [
            "Dark graphite, cream highlights and cinematic motion are part of the portfolio language.",
            "Good visual hierarchy makes complex systems easier to trust.",
          ],
          linkLabel: null,
        },
        {
          id: "systems",
          label: "Systems curiosity",
          eyebrow: "Systems curiosity",
          title: "I am drawn to systems that shape decisions.",
          body: "I am interested in systems that shape real decisions: markets, incentives, public decisions, organizations, sport and data-driven tools.",
          points: [
            "I like connecting data with real-world constraints.",
            "The angle stays analytical, neutral and non-partisan.",
          ],
          linkLabel: null,
        },
      ],
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
    carousel: {
      expandFullScreen: "Agrandir en plein écran",
      closeExpandedView: "Fermer la vue agrandie",
      slideNavigation: "Navigation des slides",
      goToSlide: "Aller à la slide",
      previousSlide: "Slide précédente",
      nextSlide: "Slide suivante",
      slideWord: "Slide",
      ofWord: "sur",
    },
    buildMode: {
      kicker: "AXEL CORRAL — COUCHE PERSONNELLE",
      title: "Couche personnelle",
      subtitle:
        "Ce qu'il y a derrière les projets : curiosité, outils, football, expérimentations IA et systèmes que je construis pour moi-même.",
      hint: "Déplacez-vous pour révéler ce qui se cache derrière le travail.",
      closeLabel: "Fermer",
      closeAriaLabel: "Fermer la couche personnelle",
      moreSignals: "Plus de signaux",
      mapAriaLabel: "Pensées personnelles autour d’Axel",
      signalsAriaPrefix: "Signaux personnels",
      sectionKicker: "Derrière le travail / univers personnel",
      sectionTitle: "Des signaux sous la surface.",
      sectionSubtitle:
        "Les bulles ci-dessus sont l'expérience principale. Ce repli garde les mêmes idées lisibles sur écran tactile et lors d'une navigation plus lente.",
      closingAriaLabel: "Actions de fermeture de la couche personnelle",
      closingText:
        "Cette couche est personnelle, mais elle rejoint la même promesse professionnelle : des systèmes utiles, un apprentissage rapide et des interfaces claires.",
      backToWork: "Retour au travail professionnel",
      signals: [
        "analyse football",
        "avatar 3D",
        "design d'interface",
        "apprentissage ouvert",
        "Toulouse",
        "pensée systémique",
        "soin du portfolio",
        "projets personnels",
      ],
      bubbles: [
        {
          id: "builder",
          label: "Je construis ce dont j'ai besoin",
          eyebrow: "Réflexe de builder",
          title: "Les outils partent souvent d'un vrai besoin.",
          body: "J'aime transformer des besoins récurrents en outils : applications, automatisations, bots ou petits systèmes qui rendent le quotidien plus clair.",
          points: [
            "JobTrackr est né d'un vrai besoin de recherche d'emploi.",
            "Mes automatisations personnelles et workflows assistés par IA suivent le même réflexe.",
            "Quand j'ai besoin d'un outil, j'essaie de le construire.",
          ],
          linkLabel: null,
        },
        {
          id: "ai",
          label: "Terrain de jeu IA",
          eyebrow: "Expérimentations IA",
          title: "L'IA est un accélérateur créatif et technique.",
          body: "J'utilise l'IA comme un accélérateur pratique : prompts, concepts visuels, expérimentations vidéo, boucles d'automatisation, construction façon Codex et amélioration itérative de produit.",
          points: [
            "L'objectif n'est pas le hype, mais un apprentissage plus rapide et une itération plus précise.",
            "L'IA m'aide à prototyper, critiquer, peaufiner et livrer avec des boucles plus courtes.",
          ],
          linkLabel: null,
        },
        {
          id: "football",
          label: "Cerveau football",
          eyebrow: "Football & données",
          title: "Le football est un terrain de jeu pour l'incertitude.",
          body: "Le football est l'un de mes terrains de jeu naturels pour la donnée : forme, dynamique, trajectoires, décisions, incertitude et émotion.",
          points: [
            "Cela se relie naturellement à l'analyse, au scouting et au storytelling.",
            "Le portfolio professionnel inclut un projet football-pipeline construit autour de cet intérêt.",
          ],
          linkLabel: "Voir football-pipeline",
        },
        {
          id: "visual",
          label: "Instinct visuel",
          eyebrow: "Direction créative",
          title: "Le ressenti compte autant que le fonctionnement.",
          body: "Je fais attention à la façon dont les choses se ressentent, pas seulement à leur fonctionnement. Un bon produit data doit être clair, lisible et visuellement intentionnel.",
          points: [
            "Graphite sombre, touches crème et mouvement cinématique font partie du langage du portfolio.",
            "Une bonne hiérarchie visuelle rend les systèmes complexes plus faciles à faire confiance.",
          ],
          linkLabel: null,
        },
        {
          id: "systems",
          label: "Curiosité pour les systèmes",
          eyebrow: "Curiosité systémique",
          title: "Je suis attiré par les systèmes qui façonnent des décisions.",
          body: "Je m'intéresse aux systèmes qui façonnent de vraies décisions : marchés, incitations, décisions publiques, organisations, sport et outils pilotés par la donnée.",
          points: [
            "J'aime relier la donnée aux contraintes du monde réel.",
            "L'angle reste analytique, neutre et non partisan.",
          ],
          linkLabel: null,
        },
      ],
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
