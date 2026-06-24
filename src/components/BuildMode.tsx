import { ArrowDown, ArrowUpRight, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type RefObject,
} from "react";
import { Magnet } from "@/components/Magnet";
import { ProjectDetailModal } from "@/components/build-mode/ProjectDetailModal";
import {
  projects,
  projectSkills,
  type Project,
} from "@/data/projects";
import avatarHead from "../../profil_3D.png";

const capabilities = [
  {
    number: "01",
    title: "Business Intelligence",
    items: ["Power BI dashboards", "SharePoint / Power Query", "KPI design", "Reporting automation"],
  },
  {
    number: "02",
    title: "Data Engineering",
    items: ["Python workflows", "SQL transformations", "AWS-oriented architecture", "Reproducible outputs"],
  },
  {
    number: "03",
    title: "Analytical Projects",
    items: ["Quantitative analysis", "Open data", "Methodology", "Clear conclusions"],
  },
  {
    number: "04",
    title: "Portfolio Systems",
    items: ["GitHub projects", "Documentation", "Versioning", "Project storytelling"],
  },
];

function CapabilityCard({
  capability,
  index,
  reduceMotion,
}: {
  capability: (typeof capabilities)[number];
  index: number;
  reduceMotion: boolean | null;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMove(event: MouseEvent<HTMLElement>) {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    setTilt({ x: y * -3.5, y: x * 4.5 });
  }

  return (
    <Magnet
      className={`h-full build-card-wrap build-card-wrap-${index + 1}`}
      disabled={Boolean(reduceMotion)}
      strength={22}
    >
      <motion.article
        className="build-card"
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 38 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          delay: index * 0.08,
          duration: 0.72,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ rotateX: tilt.x, rotateY: tilt.y, transformPerspective: 900 }}
      >
        <div className="build-card-glow" aria-hidden="true" />
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-xs text-primary/45">{capability.number}</span>
          <ArrowUpRight
            size={18}
            className="build-card-arrow text-primary/55"
            aria-hidden="true"
          />
        </div>
        <div className="relative z-10">
          <h3 className="mb-5 text-2xl text-primary">{capability.title}</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {capability.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </motion.article>
    </Magnet>
  );
}

function BuildModeHero({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <section className="build-hero" aria-labelledby="build-mode-title">
      <div className="build-hero-orbits" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="build-hero-copy">
        <motion.p
          className="build-kicker"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.6 }}
        >
          AXEL CORRAL — BUILD LAYER
        </motion.p>
        <motion.h2
          id="build-mode-title"
          className="build-mode-title"
          initial={reduceMotion ? false : { opacity: 0, y: 52 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          Build mode
        </motion.h2>
        <motion.p
          className="build-hero-subtitle"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          A hidden layer for the systems, dashboards and analytical projects behind the portfolio.
        </motion.p>
      </div>

      <div className="build-portrait-stage">
        <motion.div
          className="build-portrait-motion"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.88, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="build-portrait-halo" aria-hidden="true" />
          <Magnet
            className="build-portrait-magnet"
            disabled={Boolean(reduceMotion)}
            strength={18}
          >
            <img
              className="build-portrait"
              src={avatarHead}
              alt="Stylized 3D avatar head of Axel Corral"
            />
          </Magnet>
        </motion.div>
      </div>

      <a className="build-scroll-cue" href="#selected-builds">
        Explore the layer
        <ArrowDown size={16} aria-hidden="true" />
      </a>
    </section>
  );
}

function ProjectEvidence({ project }: { project: Project }) {
  return (
    <div className="project-evidence">
      {project.previewImage ? (
        <img
          className="project-evidence-image"
          src={project.previewImage}
          alt={project.previewAlt ?? ""}
          loading="lazy"
        />
      ) : (
        <div className="project-evidence-index" aria-hidden="true">
          {project.id}
        </div>
      )}
      <div className="project-evidence-content">
        <p>Verified in workspace</p>
        <ul>
          {project.evidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <span>{project.sourcePath}</span>
      </div>
    </div>
  );
}

function StickyProjectCard({
  project,
  index,
  total,
  scrollContainer,
  reduceMotion,
  onOpen,
}: {
  project: Project;
  index: number;
  total: number;
  scrollContainer: RefObject<HTMLDivElement | null>;
  reduceMotion: boolean | null;
  onOpen: (project: Project, trigger: HTMLElement) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: scrollContainer,
    target: cardRef,
    offset: ["start 0.82", "end 0.2"],
  });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0.15, 1], [1, targetScale]);
  const opacity = useTransform(scrollYProgress, [0, 0.12], [0.72, 1]);

  return (
    <div
      ref={cardRef}
      className="sticky-project-step"
      style={{ top: `calc(5.5rem + ${index * 28}px)`, zIndex: index + 1 }}
    >
      <motion.article
        className="sticky-project-card"
        role="button"
        tabIndex={0}
        aria-label={`Open details for ${project.title}`}
        onClick={(event) => onOpen(project, event.currentTarget)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen(project, event.currentTarget);
          }
        }}
        whileHover={reduceMotion ? undefined : { y: -5 }}
        whileTap={reduceMotion ? undefined : { scale: 0.995 }}
        style={{
          scale: reduceMotion ? 1 : scale,
          opacity: reduceMotion ? 1 : opacity,
        }}
      >
        <div className="sticky-project-main">
          <div className="sticky-project-meta">
            <span>Project {project.id}</span>
            <span>{project.status}</span>
          </div>
          <span className="sticky-project-category">{project.category}</span>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <ul className="sticky-project-highlights">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <div className="sticky-project-tags">
            {project.technologies.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="sticky-project-footer">
            <span className="sticky-project-action">
              Open case study
              <ArrowUpRight size={17} aria-hidden="true" />
            </span>
            <span className="sticky-project-proof">
              {project.evidence.length} evidence points
            </span>
          </div>
        </div>
        <ProjectEvidence project={project} />
      </motion.article>
    </div>
  );
}

function SkillsMarquee({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <motion.div
      className="build-marquee"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      aria-label={`Tools and skills found in project files: ${projectSkills.join(", ")}`}
    >
      <div className="build-marquee-track" aria-hidden="true">
        {[...projectSkills, ...projectSkills].map((skill, index) => (
          <span className="build-skill" key={`${skill}-${index}`}>
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function BuildMode({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (selectedProject) {
        setSelectedProject(null);
        requestAnimationFrame(() => returnFocusRef.current?.focus());
      } else {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, selectedProject]);

  function openProject(project: Project, trigger: HTMLElement) {
    returnFocusRef.current = trigger;
    setSelectedProject(project);
  }

  function closeProject() {
    setSelectedProject(null);
    requestAnimationFrame(() => returnFocusRef.current?.focus());
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={scrollRef}
          className="build-mode"
          role="dialog"
          aria-modal="true"
          aria-labelledby="build-mode-title"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="build-depth" aria-hidden="true">
            <div className="build-orb build-orb-one" />
            <div className="build-orb build-orb-two" />
            <div className="build-wireframe">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="build-mode-noise noise-overlay" aria-hidden="true" />

          <div className="build-close-fixed">
            <Magnet disabled={Boolean(reduceMotion)} strength={7}>
              <button
                ref={closeRef}
                className="build-close"
                type="button"
                onClick={onClose}
                aria-label="Close build mode"
              >
                Close
                <X size={17} aria-hidden="true" />
              </button>
            </Magnet>
          </div>

          <div className="build-mode-inner">
            <BuildModeHero reduceMotion={reduceMotion} />

            <section
              className="sticky-projects"
              id="selected-builds"
              aria-labelledby="selected-builds-title"
            >
              <div className="build-section-heading selected-builds-heading">
                <p>Selected builds / {projects.length.toString().padStart(2, "0")}</p>
                <h3 id="selected-builds-title">Selected builds</h3>
                <span>
                  Real projects traced to README files, source code, tests, SQL models and generated outputs in the workspace.
                </span>
              </div>
              <div className="sticky-project-list">
                {projects.map((project, index) => (
                  <StickyProjectCard
                    project={project}
                    index={index}
                    total={projects.length}
                    key={project.id}
                    reduceMotion={reduceMotion}
                    scrollContainer={scrollRef}
                    onOpen={openProject}
                  />
                ))}
              </div>
            </section>

            <section
              className="build-capabilities-section"
              id="build-capabilities"
              aria-labelledby="capabilities-title"
            >
              <div className="build-section-heading">
                <p>Capabilities / 04</p>
                <h3 id="capabilities-title">Systems behind the work.</h3>
              </div>
              <div className="build-grid">
                {capabilities.map((capability, index) => (
                  <CapabilityCard
                    capability={capability}
                    index={index}
                    key={capability.number}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </div>
            </section>

            <SkillsMarquee reduceMotion={reduceMotion} />
          </div>

          <ProjectDetailModal
            key={selectedProject?.id ?? "closed"}
            project={selectedProject}
            onClose={closeProject}
            reduceMotion={reduceMotion}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
