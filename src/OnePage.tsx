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
import { motion, useInView, useReducedMotion, useScroll } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { BuildMode } from "@/components/BuildMode";
import { ProjectDetailModal } from "@/components/build-mode/ProjectDetailModal";
import { CinematicOpening } from "@/components/CinematicOpening";
import { AnimatedLetter, WordsPullUpMultiStyle } from "@/components/PortfolioMotion";
import { projects, type Project } from "@/data/projects";

const capabilities: Array<{
  number: string;
  title: string;
  icon: LucideIcon;
  items: string[];
}> = [
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
}: {
  project: Project;
  index: number;
  onOpenProject: (project: Project) => void;
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
            <span>Project {project.id}</span>
            <span>{project.status}</span>
          </div>
          <span className="home-project-category">{project.category}</span>
          <h3>{project.title}</h3>
          {project.hook ? <strong className="home-project-hook">{project.hook}</strong> : null}
          <p>{project.description}</p>

          {project.whyItMatters ? (
            <div className="home-project-why">
              <span>Why it matters</span>
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
                Open case study
              </button>
            ) : null}
            {primaryLink ? (
              <a href={primaryLink.url} target="_blank" rel="noreferrer">
                <GitBranch size={16} aria-hidden="true" />
                View repository
              </a>
            ) : null}
            {reportLink ? (
              <a href={reportLink.url} target="_blank" rel="noreferrer">
                <FileText size={16} aria-hidden="true" />
                View report
              </a>
            ) : null}
          </div>
        </div>

        <div className="home-project-proof" aria-hidden="true">
          {project.previewImage ? (
            <img src={project.previewImage} alt="" loading="lazy" />
          ) : (
            <div className="home-project-proof-index">{project.id}</div>
          )}
          <div>
            <span>{project.evidence.length} evidence points</span>
            <strong>{project.sourcePath}</strong>
            {project.caseStudy?.length ? <em>Context, pipeline, evidence and takeaway</em> : null}
          </div>
        </div>
      </article>
    </div>
  );
}

function SelectedProjectsSection({
  onOpenBuildMode,
  onOpenProject,
}: {
  onOpenBuildMode: () => void;
  onOpenProject: (project: Project) => void;
}) {
  return (
    <section
      className="home-projects-section"
      id="selected-work"
      aria-labelledby="selected-work-title"
    >
      <div className="home-section-shell">
        <div className="home-section-heading">
          <p>Selected projects / proof first</p>
          <h2 id="selected-work-title">Data work you can inspect.</h2>
          <span>
            Three projects with repositories, methods, outputs and evidence points surfaced before
            the skill list.
          </span>
        </div>

        <div className="home-project-list">
          {projects.map((project, index) => (
            <ProjectShowcaseCard
              project={project}
              index={index}
              key={project.id}
              onOpenProject={onOpenProject}
            />
          ))}
        </div>

        <div className="home-projects-footer">
          <button className="build-mode-trigger build-mode-trigger-strong" type="button" onClick={onOpenBuildMode}>
            Discover the personal layer
          </button>
          <a className="subtle-link" href="#contact">
            Contact Axel
          </a>
        </div>
      </div>
    </section>
  );
}

function CapabilityCard({
  capability,
  index,
}: {
  capability: (typeof capabilities)[number];
  index: number;
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
        Learn more
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

function ContactSection() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-panel">
        <div>
          <p className="contact-kicker">Contact / next step</p>
          <h2 id="contact-title">Let us talk about dashboards, pipelines and analytical systems.</h2>
          <p>
            Available for data analyst and junior data engineering opportunities, portfolio
            reviews and practical analytics projects.
          </p>
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
  const [buildModeOpen, setBuildModeOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const reduceMotion = useReducedMotion();
  const openBuildMode = useCallback(() => setBuildModeOpen(true), []);
  const closeBuildMode = useCallback(() => setBuildModeOpen(false), []);
  const openProject = useCallback((project: Project) => setSelectedProject(project), []);
  const closeProject = useCallback(() => setSelectedProject(null), []);
  const aboutText =
    "I am currently building my path toward data analysis and data engineering, with experience across business intelligence, Power BI, SQL, Python, reporting automation and open data projects. My work combines technical execution with a practical understanding of business needs, from production dashboards to portfolio projects designed to demonstrate method, rigor and autonomy.";
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ["start 0.8", "end 0.2"],
  });

  return (
    <div className="portfolio-page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <main id="main">
        <CinematicOpening onOpenBuildMode={openBuildMode} />

        <SelectedProjectsSection onOpenBuildMode={openBuildMode} onOpenProject={openProject} />

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="about-card">
            <p className="mb-9 text-[10px] uppercase tracking-[0.2em] text-primary sm:text-xs">
              Analytical profile
            </p>
            <h2 id="about-title" className="about-title">
              <WordsPullUpMultiStyle
                segments={[
                  { text: "I’m Axel Corral,", className: "font-normal" },
                  {
                    text: "a data profile shaped by field experience.",
                    className: "font-serif italic",
                  },
                  {
                    text: "I work on dashboards, pipelines, reporting systems and quantitative analysis with a strong focus on clarity.",
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
                  segments={[{ text: "Capabilities connected to real projects." }]}
                />
              </span>
              <span className="block text-gray-500">
                <WordsPullUpMultiStyle
                  align="left"
                  segments={[
                    { text: "Dashboards, pipelines, models and analytical storytelling." },
                  ]}
                />
              </span>
            </h2>

            <div className="work-grid">
              {capabilities.map((capability, index) => (
                <CapabilityCard capability={capability} index={index} key={capability.number} />
              ))}
            </div>
          </div>
        </section>

        <ContactSection />
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
