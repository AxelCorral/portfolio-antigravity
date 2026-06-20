import type { Project } from "@/content/projects";

interface CarouselCardProps {
  project: Project;
  index: number;
  onCtaClick: () => void;
}

export function CarouselCard({ project, index, onCtaClick }: CarouselCardProps) {
  const isDeployed = project.statut === "deploye";

  return (
    <article
      data-card-index={index}
      className="carousel-card rounded-[20px] border border-white/[0.08] bg-gradient-to-br from-[rgba(14,17,30,0.92)] to-[rgba(8,10,20,0.92)] p-7"
    >
      <div data-orb-anchor="projets-card" className="mb-5 flex items-center justify-between">
        <span className="font-mono text-xs tracking-[0.14em] text-ink-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] uppercase ${
            isDeployed
              ? "border-[rgba(127,200,169,0.28)] text-[#7FC8A9]"
              : "border-white/[0.12] text-ink-muted"
          }`}
        >
          {project.statutLabel}
        </span>
      </div>

      <h3 className="m-0 mb-3 font-display text-[26px] leading-[1.05] font-semibold tracking-[-0.02em] text-ink">
        {project.title}
      </h3>
      <p className="m-0 mb-5 text-sm leading-relaxed text-ink-muted">{project.thesis}</p>

      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[38px] leading-none font-medium tracking-[-0.02em] text-ink tabular-nums">
            {project.chiffreCle}
          </div>
          <div className="mt-2 max-w-[24ch] text-[12.5px] text-ink-muted">{project.chiffreCleLabel}</div>
        </div>
        {project.placeholder && (
          <span className="inline-flex flex-none items-center gap-1.5 rounded-full border border-white/[0.14] px-2 py-1 font-mono text-[9.5px] tracking-[0.16em] text-ink-muted uppercase">
            <span className="h-1.25 w-1.25 rounded-full bg-ink-muted" />
            Fictif
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.75">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-white/10 px-2.25 py-1 font-mono text-[11px] text-ink-muted"
          >
            {tech}
          </span>
        ))}
      </div>

      <div data-orb-anchor="projets-detail" className="carousel-card-detail-extra mt-6 border-t border-white/10 pt-6">
        {project.lien && (
          <div className="mb-4 font-mono text-[12px] text-ink-muted">{project.lien} ↗</div>
        )}
        <button
          type="button"
          onClick={onCtaClick}
          className="inline-flex items-center gap-3 rounded-full bg-ember px-6 py-3 font-sans text-[15px] font-semibold text-[#0B0A06] no-underline shadow-[0_18px_50px_-16px_rgba(242,182,90,0.6)]"
        >
          Voir le détail complet <span className="font-mono text-[13px]">→</span>
        </button>
      </div>
    </article>
  );
}
