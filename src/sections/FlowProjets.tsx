import { Link } from "react-router-dom";
import { SectionLabel } from "@/components/SectionLabel";
import { FictifTag } from "@/components/FictifTag";
import { LazyMediaSlot } from "@/components/LazyMediaSlot";
import { railProjects, type Project } from "@/content/projects";
import { Reveal } from "@/scroll/Reveal";
import { saveReturnPosition } from "@/scroll/returnPosition";

/**
 * Clean editorial scrollytelling: one project at a time, in normal document
 * flow, alternating left/right. Each block reveals once as it crosses into
 * view (Reveal — a direct function of scroll position, never a self-playing
 * cascade) and never overlaps its neighbors — no absolute stacking, no
 * blur-soup. The radial recap from earlier builds is replaced by a quiet
 * grid closing the section, in the same flow, no overlay.
 */
function ProjectBlock({ project, index }: { project: Project; index: number }) {
  const reversed = index % 2 === 1;

  return (
    <Reveal className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
      <div className={`flex flex-col gap-10 lg:items-center lg:gap-20 ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
        <div className="flex-1">
          <div className="mb-7 flex items-center gap-4">
            <span
              data-orb-anchor={`project-${index}`}
              className="font-display text-[40px] leading-none font-semibold text-white/[0.08] tabular-nums sm:text-5xl"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className={`rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] uppercase ${
                project.statut === "deploye"
                  ? "border-[rgba(127,200,169,0.28)] text-[#7FC8A9]"
                  : "border-white/[0.12] text-ink-muted"
              }`}
            >
              {project.statutLabel}
            </span>
          </div>

          <h3 className="m-0 mb-4 font-display text-[28px] leading-[1.05] font-semibold tracking-[-0.02em] text-ink sm:text-[34px]">
            {project.title}
          </h3>
          <p className="m-0 mb-8 max-w-[52ch] text-[15px] leading-relaxed text-ink-muted">
            {project.thesis}
          </p>

          <div className="mb-8 flex flex-wrap items-end gap-8">
            <div>
              <div className="font-mono text-[32px] leading-none font-medium tracking-[-0.02em] text-ink tabular-nums">
                {project.chiffreCle}
              </div>
              <div className="mt-1.5 flex items-start gap-2">
                <span className="max-w-[26ch] text-[12px] text-ink-muted">{project.chiffreCleLabel}</span>
                {project.placeholder && <FictifTag />}
              </div>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-1.75">
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
            <div className="mb-5 font-mono text-[11.5px] text-ink-muted">{project.lien} ↗</div>
          )}

          <Link
            to={`/projet/${project.id}`}
            onClick={saveReturnPosition}
            className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.08em] text-[#9FB0FF] uppercase no-underline"
          >
            Voir le détail <span>→</span>
          </Link>
        </div>

        <div className="flex-1">
          <LazyMediaSlot label={`Média à venir · ${project.title}`} />
        </div>
      </div>
    </Reveal>
  );
}

function RecapGrid() {
  return (
    <Reveal className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
      <p className="m-0 mb-6 font-mono text-xs tracking-[0.22em] text-ink-muted uppercase">
        Récap · tous les projets
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {railProjects.map((project, i) => (
          <Link
            key={project.id}
            to={`/projet/${project.id}`}
            onClick={saveReturnPosition}
            className="rounded-[16px] border border-white/[0.08] bg-deep/40 p-5 no-underline transition-colors duration-200 hover:border-white/20"
          >
            <span className="font-mono text-[11px] tracking-[0.14em] text-ink-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h4 className="m-0 mt-2 mb-2 font-display text-base font-semibold text-ink">{project.title}</h4>
            <p className="m-0 line-clamp-2 text-[12.5px] leading-relaxed text-ink-muted">{project.thesis}</p>
          </Link>
        ))}
      </div>
    </Reveal>
  );
}

export function FlowProjets() {
  return (
    <section id="projets" className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto mb-20 max-w-7xl px-6 sm:px-10 sm:mb-28 lg:px-20">
        <Reveal>
          <SectionLabel index="02" label="Flow projets" />
        </Reveal>
      </div>

      <div className="flex flex-col gap-24 sm:gap-32 lg:gap-40">
        {railProjects.map((project, i) => (
          <ProjectBlock key={project.id} project={project} index={i} />
        ))}
      </div>

      <div className="mt-24 sm:mt-32 lg:mt-40">
        <RecapGrid />
      </div>
    </section>
  );
}
