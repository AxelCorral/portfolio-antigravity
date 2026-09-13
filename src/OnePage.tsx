import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  BookOpen,
  Boxes,
  Briefcase,
  Check,
  Database,
  ExternalLink,
  FileText,
  GitBranch,
  LineChart,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
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
import {
  footballVideoAnalysisSlidesEn,
  footballVideoAnalysisSlidesFr,
} from "@/data/projects/video-analysis";
import { motion, useInView, useReducedMotion, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { BuildMode } from "@/components/BuildMode";
import { ProjectDetailModal } from "@/components/build-mode/ProjectDetailModal";
import { CinematicOpening } from "@/components/CinematicOpening";
import { LiveDemoEmbed } from "@/components/LiveDemoEmbed";
import { AnimatedLetter, WordsPullUpMultiStyle } from "@/components/PortfolioMotion";
import { getLocalizedProjects, type Project } from "@/data/projects";
import { scrollToId } from "@/scroll/scrollToId";
import { useLanguage, type Language } from "@/i18n/language";

function getCapabilities(language: Language): Array<{
  number: string;
  title: string;
  icon: LucideIcon;
  items: string[];
  linkHref: string;
  linkLabel: string;
  linkExternal?: boolean;
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
        linkHref: "/cv#experience",
        linkLabel: "Voir l'expérience Power BI",
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
        linkHref: "#project-01",
        linkLabel: "Voir Football Data Pipeline",
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
        linkHref: "#project-03",
        linkLabel: "Voir le Modèle de soutenabilité des retraites",
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
        linkHref: "https://github.com/AxelCorral",
        linkLabel: "Voir le profil GitHub",
        linkExternal: true,
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
      linkHref: "/cv#experience",
      linkLabel: "See the Power BI experience",
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
      linkHref: "#project-01",
      linkLabel: "See Football Data Pipeline",
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
      linkHref: "#project-03",
      linkLabel: "See Retirement Sustainability Model",
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
      linkHref: "https://github.com/AxelCorral",
      linkLabel: "See the GitHub profile",
      linkExternal: true,
    },
  ];
}

const contactLinks = [
  {
    label: "Email",
    value: "axel.corral.pro@gmail.com",
    href: "mailto:axel.corral.pro@gmail.com",
    icon: Mail,
    internal: false,
  },
  {
    label: "GitHub",
    value: "github.com/AxelCorral",
    href: "https://github.com/AxelCorral",
    icon: GitBranch,
    internal: false,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/axelcorral",
    href: "https://www.linkedin.com/in/axelcorral",
    icon: Briefcase,
    internal: false,
  },
];

function getContactLinks(contactLabels: ReturnType<typeof useLanguage>["t"]["contact"]) {
  return [
    ...contactLinks,
    {
      label: contactLabels.cvLabel,
      value: contactLabels.cvCaption,
      href: "/cv",
      icon: FileText,
      internal: true,
    },
  ];
}

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
  // Each link type gets its own labeled action instead of blindly showing
  // `links[0]` under the "View repository" label. JobTrackr's first link is
  // its live demo, not its repo — before this, the button read "View
  // repository" while pointing at the demo URL, and the GitHub link was
  // never shown at all. Vers l'Élysée has no repository link by design (Q2,
  // docs/ui-loop/QUESTIONS.md): a project with only a demo link now shows
  // only a demo action, never a mislabeled or fabricated repository link.
  const repoLink = project.links?.find(
    (link) => link.type === "github" || link.type === "repository",
  );
  const demoLink = project.links?.find((link) => link.type === "demo");
  const reportLink = project.links?.find((link) => link.type === "report");

  return (
    <div
      id={`project-${project.id}`}
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
            {repoLink ? (
              <a href={repoLink.url} target="_blank" rel="noreferrer">
                <GitBranch size={16} aria-hidden="true" />
                {labels.viewRepository}
              </a>
            ) : null}
            {demoLink ? (
              <a href={demoLink.url} target="_blank" rel="noreferrer">
                <ExternalLink size={16} aria-hidden="true" />
                {labels.viewDemo}
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
              label={project.title}
              slides={language === "fr" ? footballPipelineSlidesFr : footballPipelineSlidesEn}
            />
          </div>
        ) : project.id === "02" ? (
          <div className="home-project-proof home-project-proof--carousel">
            <ProjectCarousel
              projectId={project.id}
              label={project.title}
              slides={language === "fr" ? jobtrackrSlidesFr : jobtrackrSlidesEn}
            />
          </div>
        ) : project.id === "03" ? (
          <div className="home-project-proof home-project-proof--carousel">
            <ProjectCarousel
              projectId={project.id}
              label={project.title}
              slides={language === "fr" ? retirementAnalysisSlidesFr : retirementAnalysisSlidesEn}
            />
          </div>
        ) : project.id === "06" ? (
          <div className="home-project-proof home-project-proof--carousel">
            <ProjectCarousel
              projectId={project.id}
              label={project.title}
              slides={language === "fr" ? footballVideoAnalysisSlidesFr : footballVideoAnalysisSlidesEn}
            />
          </div>
        ) : demoLink ? (
          <div className="home-project-proof home-project-proof--embed">
            <LiveDemoEmbed
              src={demoLink.url}
              frameTitle={project.title}
              posterSrc={project.previewImage}
              posterAlt={project.previewAlt ?? project.title}
              launchLabel={labels.demoLaunch}
              captionLabel={project.demoCaption ?? project.title}
              openLabel={labels.viewDemo}
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

/**
 * `.work-grid` is 1 / 2 / 4 columns depending on the breakpoint, and each card
 * reveals on its own `useInView`. A stagger keyed on the absolute index is
 * therefore latency, not rhythm: at 390 the four cards cross the threshold at
 * four different scroll positions, yet card 4 still waited 3 x 0.15s before
 * starting its 0.65s fade — 1.1s from "on screen" to "readable" (cycle 017).
 * Reading the live column count keeps the stagger tied to what actually enters
 * together, and collapses it to zero in a single-column layout.
 */
function useGridColumns(ref: RefObject<HTMLDivElement | null>) {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () =>
      setColumns(
        Math.max(1, getComputedStyle(el).gridTemplateColumns.split(" ").filter(Boolean).length),
      );
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return columns;
}

function CapabilityCard({
  capability,
  staggerStep,
}: {
  capability: ReturnType<typeof getCapabilities>[number];
  staggerStep: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduceMotion = useReducedMotion();
  const Icon = capability.icon;

  return (
    <motion.article
      ref={ref}
      className="capability-card"
      // A translation, not a scale. `scale: 0.95` resampled the card's own text
      // for 650ms, thinned its 1px border to 0.95px, and made the card lie about
      // its size by 19px — including its 44px links, which measured 41.8px mid
      // animation (that measurement, not the CSS, was the "42px tap target" the
      // cycle 016 backlog recorded). Translating moves the card without
      // deforming anything it contains.
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      // 0.45s over 0.08s steps, not 0.65s over 0.15s. The four cards of a row
      // enter the viewport *together*, so the stagger is not ordering a reading
      // path — it is making the visitor wait. At 1440 the old numbers left card
      // `04` starting 450ms after card `01` and finishing 1100ms after it, and
      // the measurement says what that costs: 27 of the 28 text nodes of the
      // grid sat under 4.5:1 while already on screen, the `04` number itself at
      // 1.81:1 for 786ms, its title, four items and link for 566 to 617ms, and
      // the last node reached full paint 1764ms after the grid entered the
      // reading band (cycle 022 audit C-3). Cycle 021 raised that same number
      // from 3.47:1 to 4.94:1 as a P0 — the floor has to hold in motion too, not
      // only at rest. A 16px translate does not need 650ms.
      transition={{ duration: 0.45, delay: staggerStep * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-start justify-between">
        <span className="icon-frame" aria-hidden="true">
          <Icon size={21} strokeWidth={1.6} />
        </span>
        <span className="capability-number text-xs">{capability.number}</span>
      </div>

      <div>
        <h3 className="mb-6 text-2xl font-normal leading-none text-primary">
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

      {capability.linkExternal ? (
        <a className="card-link group" href={capability.linkHref} target="_blank" rel="noreferrer">
          {capability.linkLabel}
          <ArrowRight
            className="transition-transform duration-300 group-hover:translate-x-1"
            size={16}
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </a>
      ) : capability.linkHref.startsWith("/") ? (
        <Link className="card-link group" to={capability.linkHref}>
          {capability.linkLabel}
          <ArrowRight
            className="transition-transform duration-300 group-hover:translate-x-1"
            size={16}
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </Link>
      ) : (
        // In-page evidence link. It stays a real anchor — middle-click, "open in
        // new tab" and no-JS all keep working — but the scroll is resolved by
        // the shared helper rather than by the browser's fragment jump, because
        // the two targets it can point at (`#project-01`, `#project-03`) are
        // sticky-stacked slides whose native destination is the same document
        // position once the reader is below the stack. Before this, on every
        // desktop width in both languages, "See Football Data Pipeline" landed
        // the reader on Retirement Sustainability Model (cycle 023 audit, D-1).
        <a
          className="card-link group"
          href={capability.linkHref}
          onClick={(event) => {
            if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;
            const id = capability.linkHref.slice(1);
            if (!document.getElementById(id)) return;
            event.preventDefault();
            scrollToId(id);
            window.history.replaceState(null, "", capability.linkHref);
          }}
        >
          {capability.linkLabel}
          <ArrowRight
            className="transition-transform duration-300 group-hover:translate-x-1"
            size={16}
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </a>
      )}
    </motion.article>
  );
}

function CapabilityGrid({
  capabilities,
}: {
  capabilities: ReturnType<typeof getCapabilities>;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const columns = useGridColumns(gridRef);

  return (
    <div className="work-grid" ref={gridRef}>
      {capabilities.map((capability, index) => (
        <CapabilityCard
          capability={capability}
          key={capability.number}
          staggerStep={index % columns}
        />
      ))}
    </div>
  );
}

function ContactSection({ labels }: { labels: ReturnType<typeof useLanguage>["t"]["contact"] }) {
  const links = getContactLinks(labels);

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-panel">
        <div>
          <p className="contact-kicker">{labels.kicker}</p>
          <h2 id="contact-title">{labels.title}</h2>
          <p>{labels.body}</p>
        </div>

        <div className="contact-links">
          {links.map((link) => {
            const Icon = link.icon;
            const content = (
              <>
                <Icon size={18} aria-hidden="true" />
                <span>
                  <strong>{link.label}</strong>
                  {link.value}
                </span>
                {link.internal ? (
                  <ArrowRight size={15} aria-hidden="true" />
                ) : (
                  <ExternalLink size={15} aria-hidden="true" />
                )}
              </>
            );
            return link.internal ? (
              <Link to={link.href} key={link.href}>
                {content}
              </Link>
            ) : (
              <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
                {content}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SiteFooter({
  labels,
  contactLabels,
}: {
  labels: ReturnType<typeof useLanguage>["t"]["footer"];
  contactLabels: ReturnType<typeof useLanguage>["t"]["contact"];
}) {
  const year = new Date().getFullYear();
  const links = getContactLinks(contactLabels);

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <span className="site-footer-mark">Axel Corral</span>
          <p className="site-footer-rights">
            © {year} Axel Corral. {labels.rights}
          </p>
        </div>

        <nav className="site-footer-links" aria-label={contactLabels.kicker}>
          {links.map((link) =>
            link.internal ? (
              <Link to={link.href} key={link.href}>
                {link.label}
              </Link>
            ) : (
              <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ),
          )}
        </nav>

        <a className="site-footer-top" href="#main" aria-label={labels.backToTopAria}>
          {labels.backToTop}
          <ArrowUp size={15} aria-hidden="true" />
        </a>
      </div>
    </footer>
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
  // The reveal has to *finish* while the paragraph is still at a comfortable
  // reading height, not as it leaves the screen. With "end 0.2" the last
  // characters only lit up once rect.top was between 1px and 57px (measured at
  // 390/1440/1920, cycle 017) — the text was never fully legible in place.
  // Ending at 0.6 lands completion with the paragraph around mid-viewport.
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ["start 0.85", "end 0.6"],
  });

  // Cross-route deep links (e.g. from /cv) land with a URL hash before this
  // page's content has painted, so the browser's native scroll-to-fragment
  // finds nothing — retry once React has rendered.
  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    // Same sticky-resolution problem as the capability evidence links: a deep
    // link to `#project-01` must not be resolved from the slide's shifted box.
    const frame = requestAnimationFrame(() => {
      scrollToId(id);
      // The /cv "View case study" link points at this exact hash and says it
      // opens the case study — before this, it only scrolled to the summary
      // card, leaving a second click ("Open case study") to actually see one.
      const linkedProjectId = id.startsWith("project-") ? id.slice("project-".length) : null;
      const linkedProject = localizedProjects.find((project) => project.id === linkedProjectId);
      if (linkedProject?.caseStudy?.length) {
        setSelectedProjectId(linkedProject.id);
      }
    });
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <p className="about-kicker">{t.about.kicker}</p>
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
              className="about-lede mt-14 text-sm leading-relaxed text-primary sm:text-base"
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

            {/* The zone's opening block was the only claim-bearing block of the
                whole page with nothing to click: 537 characters, 3 assertion
                blocks, 0 proof links, 0 media, against 8 proof links and 4 media
                on the showcase above (cycle 023 audit, D-2). Its central claim —
                "a data profile shaped by field experience" — already has a
                proof, online and verified: /cv#experience lands correctly and
                carries the DRT apprenticeship. Nothing new is asserted here;
                what was missing was the link between a claim and evidence the
                site already holds. `.card-link` is the zone's established
                idiom (text + arrow), reused as-is. */}
            <div className="about-evidence">
              <Link className="card-link group" to="/cv#experience">
                {t.about.evidenceLabel}
                <ArrowRight
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  size={16}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </section>

        <section
          className="work-section bg-noise"
          id="capabilities"
          aria-labelledby="work-title"
        >
          <div className="relative z-10 mx-auto max-w-[1600px]">
            {/* Same heading pattern as the project-slides section above
                (kicker / h2 / intro) so the two sections announce themselves
                at the same typographic level — cycle 016 audit P1. */}
            <div className="home-section-heading">
              <p>{t.capabilities.kicker}</p>
              <h2 id="work-title">
                <WordsPullUpMultiStyle
                  align="left"
                  segments={[{ text: t.capabilities.title }]}
                />
              </h2>
              <span>{t.capabilities.subtitle}</span>
            </div>

            <CapabilityGrid capabilities={capabilities} />
          </div>
        </section>

        <ContactSection labels={t.contact} />
      </main>
      <SiteFooter labels={t.footer} contactLabels={t.contact} />
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
