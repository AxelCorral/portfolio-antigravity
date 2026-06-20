import { useEffect } from "react";
import type { Project } from "@/content/projects";

interface ProjectStubModalProps {
  project: Project;
  onClose: () => void;
}

/**
 * Placeholder deep-dive target for projects other than the hero case study.
 * Full content lands in a later build — this just wires the navigation.
 */
export function ProjectStubModal({ project, onClose }: ProjectStubModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-stub-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-w-lg rounded-[20px] border border-white/10 bg-deep p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-mono text-xs tracking-[0.22em] text-ink-muted uppercase">
          Deep dive · {project.title}
        </span>
        <h2 id="project-stub-title" className="m-0 mt-3 font-display text-xl font-semibold text-ink">
          Bientôt disponible
        </h2>
        <p className="m-0 mt-3 text-sm leading-relaxed text-ink-muted">{project.thesis}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 font-mono text-xs tracking-[0.08em] text-ink uppercase"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
