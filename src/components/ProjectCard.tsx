import type { Project } from "@/content/projects";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isDeployed = project.statut === "deploye";

  return (
    <article className="flex w-[min(392px,85vw)] flex-none flex-col rounded-[20px] border border-white/[0.08] bg-gradient-to-br from-[rgba(14,17,30,0.85)] to-[rgba(8,10,20,0.85)] p-8">
      <div className="mb-6 flex items-center justify-between">
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

      <h3 className="m-0 mb-3 font-display text-[27px] leading-[1.05] font-semibold tracking-[-0.02em] text-ink">
        {project.title}
      </h3>
      <p className="m-0 mb-6.5 flex-1 text-sm leading-relaxed text-ink-muted">
        {project.thesis}
      </p>

      <div className="mb-5.5 flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[42px] leading-none font-medium tracking-[-0.02em] text-ink tabular-nums">
            {project.chiffreCle}
          </div>
          <div className="mt-2 max-w-[24ch] text-[12.5px] text-ink-muted">
            {project.chiffreCleLabel}
          </div>
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

      {project.lien && (
        <div className="mt-6 font-mono text-[11.5px] text-ink-muted">{project.lien} ↗</div>
      )}
      {isDeployed && !project.lien && (
        <div className="mt-6 font-mono text-[11.5px] text-[#7FC8A9]">● Live · shippé</div>
      )}
      {project.role === "hero-deep-dive" && (
        <div className="mt-6 flex items-center gap-2 font-mono text-xs tracking-[0.08em] text-[#9FB0FF] uppercase">
          Deep dive <span>→</span>
        </div>
      )}
    </article>
  );
}
