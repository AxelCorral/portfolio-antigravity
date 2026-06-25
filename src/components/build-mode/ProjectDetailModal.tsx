import {
  ExternalLink,
  FileText,
  GitBranch,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import type { Project } from "@/data/projects";
import { useLanguage } from "@/i18n/language";

type ProjectTab = "overview" | "results" | "outputs" | "links" | "tech";

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="project-detail-links">
      {project.links?.map((link) => {
        const Icon =
          link.type === "github"
            ? GitBranch
            : link.type === "report"
              ? FileText
              : ExternalLink;

        return (
          <a
            href={link.url}
            key={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon size={18} aria-hidden="true" />
            <span>{link.label}</span>
            <ExternalLink
              className="project-detail-link-arrow"
              size={15}
              aria-hidden="true"
            />
          </a>
        );
      })}
    </div>
  );
}

function ProjectOutputs({ project }: { project: Project }) {
  return (
    <div className="project-output-grid">
      {project.screenshots?.map((screenshot) => (
        <figure className="project-output" key={screenshot.src}>
          <div className="project-output-media">
            <img
              src={screenshot.src}
              alt={screenshot.title}
              loading="lazy"
            />
          </div>
          <figcaption>
            <span>{screenshot.type}</span>
            <h4>{screenshot.title}</h4>
            {screenshot.description ? <p>{screenshot.description}</p> : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function ProjectDetailModal({
  project,
  onClose,
  reduceMotion,
}: {
  project: Project | null;
  onClose: () => void;
  reduceMotion: boolean | null;
}) {
  const { t } = useLanguage();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<ProjectTab>("overview");

  const tabs = useMemo<ProjectTab[]>(() => {
    const available: ProjectTab[] = ["overview", "results"];
    if (project?.screenshots?.length) available.push("outputs");
    if (project?.links?.length) available.push("links");
    available.push("tech");
    return available;
  }, [project]);

  useEffect(() => {
    if (!project) return;
    closeRef.current?.focus();
  }, [project]);

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  function handlePanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const offset = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + offset + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab);
    panelRef.current
      ?.querySelector<HTMLButtonElement>(`#project-tab-${nextTab}`)
      ?.focus();
  }

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          className="project-detail-backdrop"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onMouseDown={handleBackdropClick}
        >
          <motion.div
            ref={panelRef}
            className="project-detail-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-detail-title"
            initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.985 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onKeyDown={handlePanelKeyDown}
          >
            <header className="project-detail-header">
              <div>
                <p>
                  Project {project.id} · {project.category}
                </p>
                <h3 id="project-detail-title">{project.title}</h3>
                <span>{project.description}</span>
              </div>
              <button
                ref={closeRef}
                className="project-detail-close"
                type="button"
                onClick={onClose}
                aria-label={`${t.modal.closePrefix} ${project.title} ${t.modal.closeSuffix}`.trim()}
              >
                <X size={19} aria-hidden="true" />
              </button>
            </header>

            <div className="project-detail-tabs" role="tablist" aria-label={t.modal.projectDetails}>
              {tabs.map((tab, index) => (
                <button
                  id={`project-tab-${tab}`}
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  aria-controls="project-detail-content"
                  tabIndex={activeTab === tab ? 0 : -1}
                  onClick={() => setActiveTab(tab)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  {t.modal[tab]}
                </button>
              ))}
            </div>

            <motion.div
              id="project-detail-content"
              className="project-detail-content"
              role="tabpanel"
              key={`${project.id}-${activeTab}`}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "overview" ? (
                <div className="project-overview-grid">
                  <div>
                    <p>{project.longDescription}</p>
                    {project.caseStudy?.length ? (
                      <div className="project-case-study">
                        {project.caseStudy.map((section) => (
                          <article key={section.eyebrow}>
                            <span>{section.eyebrow}</span>
                            <h4>{section.title}</h4>
                            <p>{section.body}</p>
                            {section.points?.length ? (
                              <ul>
                                {section.points.map((point) => (
                                  <li key={point}>{point}</li>
                                ))}
                              </ul>
                            ) : null}
                          </article>
                        ))}
                      </div>
                    ) : null}
                    <ul className="project-detail-highlights">
                      {project.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                    {project.keyTakeaway ? (
                      <div className="project-key-takeaway">
                        <span>{t.modal.keyTakeaway}</span>
                        <p>{project.keyTakeaway}</p>
                      </div>
                    ) : null}
                  </div>
                  <aside>
                    <span>{t.modal.status}</span>
                    <strong>{project.status}</strong>
                    <span>{t.modal.sourceFolder}</span>
                    <code>{project.sourcePath}</code>
                    <span>{t.modal.workspaceEvidence}</span>
                    <ul>
                      {project.evidence.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </aside>
                </div>
              ) : null}

              {activeTab === "results" ? (
                <div className="project-result-grid">
                  {project.results.map((result) => (
                    <article key={result.label}>
                      <h4>{result.label}</h4>
                      <p>{result.description}</p>
                    </article>
                  ))}
                </div>
              ) : null}

              {activeTab === "outputs" ? (
                <ProjectOutputs project={project} />
              ) : null}

              {activeTab === "links" ? (
                <ProjectLinks project={project} />
              ) : null}

              {activeTab === "tech" ? (
                <div className="project-detail-tech">
                  {project.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
