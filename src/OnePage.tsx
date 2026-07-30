import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Boxes,
  Check,
  Database,
  ExternalLink,
  FileText,
  GitBranch,
  LineChart,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { ProjectCarousel } from "@/components/carousel/ProjectCarousel";
import {
  footballPipelineSlidesEn,
  footballPipelineSlidesFr,
} from "@/data/projects/football-pipeline";
import {
  jobtrackrSlidesEn,
  jobtrackrSlidesFr,
} from "@/data/projects/jobtrackr";
import {
  retirementAnalysisSlidesEn,
  retirementAnalysisSlidesFr,
} from "@/data/projects/retirement-analysis";
import { motion, useInView, useReducedMotion, useScroll } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { BuildMode } from "@/components/BuildMode";
import { ProjectDetailModal } from "@/components/build-mode/ProjectDetailModal";
import { CinematicOpening } from "@/components/CinematicOpening";
import { AnimatedLetter, WordsPullUpMultiStyle } from "@/components/PortfolioMotion";
import { getLocalizedProjects, type Project } from "@/data/projects";
import { useLanguage, type Language } from "@/i18n/language";

function getCapabilities(language: Language): Array<{
  number: string;
  title: string;
  icon: LucideIcon;
  items: string[];
}> {
  if (language === "fr") {
    return [
      {
        number: "01",
        title: "Business Intelligence.",
        icon: BarChart3,
        items: [
          "Dashboards Power BI et modèles de reporting",
          "SharePoint, Power Query et préparation de données",
          "Design de KPI, filtres et hiérarchie visuelle",
          "Analyses lisibles par les métiers",
        ],
      },
      {
        number: "02",
        title: "Ingénierie des données.",
        icon: Database,
        items: [
          "Workflows data en Python et SQL",
          "Logique ETL, nettoyage et transformation",
          "Architecture pipeline orientée AWS",
          "Datasets versionnés et sorties reproductibles",
        ],
      },
      {
        number: "03",
        title: "Projets analytiques.",
        icon: LineChart,
        items: [
          "Analyse quantitative et méthodologie",
          "Projets portfolio open source",
          "Storytelling data et rédaction technique",
          "Conclusions claires à partir de sujets complexes",
        ],
      },
      {
        number: "04",
        title: "Systèmes portfolio.",
        icon: Boxes,
        items: [
          "Projets GitHub et versioning",
          "Documentation technique claire",
          "Structures de projet inspectables",
          "Présentation orientée méthode et preuve",
        ],
      },
    ];
  }

  return [
    {
      number: "01",
      title: "Business Intelligence.",
      icon: BarChart3,
      items: [
        "Power BI dashboards and reporting models",
        "SharePoint, Power Query and data preparation",
        "KPI design, filters and visual hierarchy",
        "Business-readable analytics",
      ],
    },
    {
      number: "02",
      title: "Data Engineering.",
      icon: Database,
      items: [
        "Python and SQL data workflows",
        "ETL logic, cleaning and transformation",
        "AWS-oriented pipeline architecture",
        "Versioned datasets and reproducible outputs",
      ],
    },
    {
      number: "03",
      title: "Analytical Projects.",
      icon: LineChart,
      items: [
        "Quantitative analysis and methodology",
        "Open-source portfolio projects",
        "Data storytelling and technical writing",
        "Clear conclusions from complex subjects",
      ],
    },
    {
      number: "04",
      title: "Portfolio Systems.",
      icon: Boxes,
      items: [
        "GitHub projects and versioning",
        "Clear technical documentation",
        "Reviewable project structures",
        "Method-focused project storytelling",
      ],
    },
  ];
}

const contactLinks = [
  {
    label: "Email",
    value: "axel.corral.pro@gmail.com",
    href: "mailto:axel.corral.pro@gmail.com",
    icon: Mail,
  },
  {
    label: "GitHub",
    value: "github.com/AxelCorral",
    href: "https://github.com/AxelCorral",
    icon: GitBranch,
  },
];

function ProjectShowcaseCard({
  project,
  index,
  onOpenProject,
  labels,
  language,
}: {
  project: Project;
  index: number;
  onOpenProject: (project: Project) => void;
  labels: ReturnType<typeof useLanguage>["t"]["projects"];
  language: Language;
}) {
  const primaryLink = project.links?.[0];
  const reportLink = project.links?.find((link) => link.type === "report");

  return (
    <div
      className="home-project-step"
      style={{ top: `calc(5.5rem + ${index * 28}px)`, zIndex: index + 1 }}
    >
      <article className="home-project-card">
        <div className="home-project-copy">
          <div className="home-project-meta">
            <span>{labels.project} {project.id}</span>
            <span>{project.status}</span>
          </div>
          <span className="home-project-category">{project.category}</span>
          <h3>{project.title}</h3>
          {project.hook ? <strong className="home-project-hook">{project.hook}</strong> : null}
          <p>{project.description}</p>

          {project.whyItMatters ? (
            <div className="home-project-why">
              <span>{labels.whyItMatters}</span>
              <p>{project.whyItMatters}</p>
            </div>
          ) : null}

          <div className="home-project-results">
            {project.results.slice(0, 2).map((result) => (
              <div key={result.label}>
                <strong>{result.label}</strong>
                <span>{result.description}</span>
              </div>
            ))}
          </div>

          <ul className="home-project-evidence" aria-label={`${project.title} evidence`}>
            {project.evidence.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="home-project-tags">
            {project.technologies.slice(0, 5).map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>

          <div className="home-project-actions">
            {project.caseStudy?.length ? (
              <button type="button" onClick={() => onOpenProject(project)}>
                <BookOpen size={16} aria-hidden="true" />
                {labels.openCaseStudy}
              </button>
            ) : null}
            {primaryLink ? (
              <a href={primaryLink.url} target="_blank" rel="noreferrer">
                <GitBranch size={16} aria-hidden="true" />
                {labels.viewRepository}
              </a>
            ) : null}
            {reportLink ? (
              <a href={reportLink.url} target="_blank" rel="noreferrer">
                <FileText size={16} aria-hidden="true" />
                {labels.viewReport}
              </a>
            ) : null}
          </div>
        </div>

        {project.id === "01" ? (
          <div className="home-project-proof home-project-proof--carousel">
            <ProjectCarousel
              projectId={project.id}
              slides={language === "fr" ? footballPipelineSlidesFr : footballPipelineSlidesEn}
            />
          </div>
        ) : project.id === "02" ? (
          <div className="home-project-proof home-project-proof--carousel">
            <ProjectCarousel
              projectId={project.id}
              slides={language === "fr" ? jobtrackrSlidesFr : jobtrackrSlidesEn}
            />
          </div>
        ) : project.id === "03" ? (
          <div className="home-project-proof home-project-proof--carousel">
            <ProjectCarousel
              projectId={project.id}
              slides={language === "fr" ? retirementAnalysisSlidesFr : retirementAnalysisSlidesEn}
            />
          </div>
        ) : (
          <div className="home-project-proof" aria-hidden="true">
            {project.previewImage ? (
              <img src={project.previewImage} alt="" loading="lazy" />
            ) : (
              <div className="home-project-proof-index">{project.id}</div>
            )}
            <div>
              <span>{project.evidence.length} {labels.evidencePoints}</span>
              <strong>{project.sourcePath}</strong>
              {project.caseStudy?.length ? <em>{labels.caseStudyPreview}</em> : null}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

function SelectedProjectsSection({
  onOpenBuildMode,
  onOpenProject,
  projects,
  labels,
  language,
}: {
  onOpenBuildMode: () => void;
  onOpenProject: (project: Project) => void;
  projects: Project[];
  labels: ReturnType<typeof useLanguage>["t"]["projects"];
  language: Language;
}) {
  return (
    <section
      className="home-projects-section"
      id="selected-work"
      aria-labelledby="selected-work-title"
    >
      <div className="home-section-shell">
        <div className="home-section-heading">
          <p>{labels.kicker}</p>
          <h2 id="selected-work-title">{labels.title}</h2>
          <span>{labels.intro}</span>
        </div>

        <div className="home-project-list">
          {projects.map((project, index) => (
            <ProjectShowcaseCard
              project={project}
              index={index}
              key={project.id}
              onOpenProject={onOpenProject}
              labels={labels}
              language={language}
            />
          ))}
        </div>

        <div className="home-projects-footer">
          <button className="build-mode-trigger build-mode-trigger-strong" type="button" onClick={onOpenBuildMode}>
            {labels.discoverPersonal}
          </button>
          <a className="subtle-link" href="#contact">
            {labels.contactAxel}
          </a>
        </div>
      </div>
    </section>
  );
}

function CapabilityCard({
  capability,
  index,
  learnMore,
}: {
  capability: ReturnType<typeof getCapabilities>[number];
  index: number;
  learnMore: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduceMotion = useReducedMotion();
  const Icon = capability.icon;

  return (
    <motion.article
      ref={ref}
      className="capability-card"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.65, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-start justify-between">
        <span className="icon-frame" aria-hidden="true">
          <Icon size={21} strokeWidth={1.6} />
        </span>
        <span className="text-xs text-primary/45">{capability.number}</span>
      </div>

      <div>
        <h3 className="mb-7 text-2xl font-normal leading-none text-primary">
          {capability.title}
        </h3>
        <ul className="space-y-4">
          {capability.items.map((item) => (
            <li className="flex gap-3 text-sm leading-snug text-gray-400" key={item}>
              <Check className="mt-0.5 shrink-0 text-primary" size={15} strokeWidth={1.8} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <a className="card-link group" href="#contact">
        {learnMore}
        <ArrowRight
          className="transition-transform duration-300 group-hover:translate-x-1"
          size={16}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </a>
    </motion.article>
  );
}

function ContactSection({ labels }: { labels: ReturnType<typeof useLanguage>["t"]["contact"] }) {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-panel">
        <div>
          <p className="contact-kicker">{labels.kicker}</p>
          <h2 id="contact-title">{labels.title}</h2>
          <p>{labels.body}</p>
        </div>

        <div className="contact-links">
          {contactLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a href={link.href} key={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noreferrer" : undefined}>
                <Icon size={18} aria-hidden="true" />
                <span>
                  <strong>{link.label}</strong>
                  {link.value}
                </span>
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OnePage() {
  const { language, t } = useLanguage();
  const [buildModeOpen, setBuildModeOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const localizedProjects = getLocalizedProjects(language);
  const capabilities = getCapabilities(language);
  const selectedProject =
    localizedProjects.find((project) => project.id === selectedProjectId) ?? null;
  const openBuildMode = useCallback(() => setBuildModeOpen(true), []);
  const closeBuildMode = useCallback(() => setBuildModeOpen(false), []);
  const openProject = useCallback((project: Project) => setSelectedProjectId(project.id), []);
  const closeProject = useCallback(() => setSelectedProjectId(null), []);
  const aboutText = t.about.body;
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ["start 0.8", "end 0.2"],
  });

  return (
    <div className="portfolio-page">
      <a className="skip-link" href="#main">
        {t.skip}
      </a>

      <main id="main">
        <CinematicOpening onOpenBuildMode={openBuildMode} />

        <SelectedProjectsSection
          onOpenBuildMode={openBuildMode}
          onOpenProject={openProject}
          projects={localizedProjects}
          labels={t.projects}
          language={language}
        />

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="about-card">
            <p className="mb-9 text-[10px] uppercase tracking-[0.2em] text-primary sm:text-xs">
              {t.about.kicker}
            </p>
            <h2 id="about-title" className="about-title">
              <WordsPullUpMultiStyle
                segments={[
                  { text: t.about.segments[0], className: "font-normal" },
                  {
                    text: t.about.segments[1],
                    className: "font-serif italic",
                  },
                  {
                    text: t.about.segments[2],
                    className: "font-normal",
                  },
                ]}
              />
            </h2>

            <p
              ref={paragraphRef}
              className="mx-auto mt-14 max-w-3xl text-sm leading-relaxed text-primary sm:text-base"
            >
              {Array.from(aboutText).map((character, index) => (
                <AnimatedLetter
                  character={character}
                  index={index}
                  key={`${character}-${index}`}
                  scrollYProgress={scrollYProgress}
                  total={aboutText.length}
                />
              ))}
            </p>
          </div>
        </section>

        <section
          className="work-section bg-noise"
          id="capabilities"
          aria-labelledby="work-title"
        >
          <div className="relative z-10 mx-auto max-w-[1600px]">
            <h2 id="work-title" className="work-heading">
              <span className="block text-primary">
                <WordsPullUpMultiStyle
                  align="left"
                  segments={[{ text: t.capabilities.title }]}
                />
              </span>
              <span className="block text-gray-500">
                <WordsPullUpMultiStyle
                  align="left"
                  segments={[{ text: t.capabilities.subtitle }]}
                />
              </span>
            </h2>

            <div className="work-grid">
              {capabilities.map((capability, index) => (
                <CapabilityCard
                  capability={capability}
                  index={index}
                  key={capability.number}
                  learnMore={t.capabilities.learnMore}
                />
              ))}
            </div>
          </div>
        </section>

        <ContactSection labels={t.contact} />
      </main>
      <BuildMode open={buildModeOpen} onClose={closeBuildMode} />
      <ProjectDetailModal
        project={selectedProject}
        onClose={closeProject}
        reduceMotion={reduceMotion}
      />
    </div>
  );
}

export default OnePage;
