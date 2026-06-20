import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SectionLabel } from "@/components/SectionLabel";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectStubModal } from "@/components/ProjectStubModal";
import { railProjects } from "@/content/projects";
import { Reveal } from "@/scroll/Reveal";
import { useStepNav } from "@/scroll/StepNavContext";
import { useProjectCta } from "@/scroll/useProjectCta";

/** Right/left alternating, descending — see prompt.md Build 06 Partie A. */
const SLOTS = [
  { top: "6%", side: "right" as const },
  { top: "32%", side: "left" as const },
  { top: "58%", side: "right" as const },
  { top: "84%", side: "left" as const },
];

export function FlowProjets() {
  const { mode, steps, currentStep } = useStepNav();
  const isStepping = mode === "stepping";
  const containerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { stubProject, open, close } = useProjectCta();

  const currentStepData = steps[currentStep];
  const activeIndex =
    isStepping && currentStepData?.sectionId === "projets" ? currentStepData.cardIndex ?? 0 : -1;

  // One scroll/keyboard step = one project: no pin, no scrub — just tween
  // each card's focus weight off the discrete activeIndex. The orb/path is
  // handled generically by PathOrb (see anchors.ts), not duplicated here.
  useGSAP(
    () => {
      if (!isStepping || !containerRef.current) return;
      const cardEls = Array.from(containerRef.current.querySelectorAll<HTMLElement>("[data-zigzag-card]"));
      cardEls.forEach((el, i) => {
        const weight = activeIndex < 0 ? 1 : Math.max(0, 1 - Math.abs(activeIndex - i));
        gsap.to(el, {
          opacity: 0.16 + weight * 0.84,
          scale: 0.78 + weight * 0.22,
          filter: `blur(${((1 - weight) * 5).toFixed(2)}px)`,
          duration: 0.6,
          ease: "ease-float",
        });
      });
    },
    { dependencies: [activeIndex, isStepping] },
  );

  return (
    <section
      id="projets"
      ref={containerRef}
      className="relative min-h-dvh overflow-hidden py-20 max-md:snap-start motion-reduce:snap-start"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-6 sm:px-10 lg:px-20">
        <Reveal className="min-w-70 flex-1">
          <SectionLabel index="02" label="Flow projets" />
        </Reveal>
      </div>

      {isStepping ? (
        <div className="relative mx-auto mt-8 h-[78vh] min-h-[560px] max-w-7xl">
          {railProjects.map((project, i) => {
            const slot = SLOTS[i % SLOTS.length];
            return (
              <article
                key={project.id}
                data-zigzag-card
                className={`absolute w-[min(420px,86vw)] rounded-[20px] border border-white/[0.08] bg-gradient-to-br from-[rgba(14,17,30,0.92)] to-[rgba(8,10,20,0.92)] p-7 ${
                  slot.side === "right" ? "right-[6%] sm:right-[10%]" : "left-[6%] sm:left-[10%]"
                }`}
                style={{ top: slot.top }}
              >
                <div data-orb-anchor={`zigzag-${i}`} className="mb-5 flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.14em] text-ink-muted">
                    {String(i + 1).padStart(2, "0")}
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
                <h3 className="m-0 mb-3 font-display text-[24px] leading-[1.05] font-semibold tracking-[-0.02em] text-ink">
                  {project.title}
                </h3>
                <p className="m-0 mb-5 text-sm leading-relaxed text-ink-muted">{project.thesis}</p>
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-[32px] leading-none font-medium tracking-[-0.02em] text-ink tabular-nums">
                      {project.chiffreCle}
                    </div>
                    <div className="mt-2 max-w-[24ch] text-[12px] text-ink-muted">{project.chiffreCleLabel}</div>
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
                  <div className="mt-5 font-mono text-[11.5px] text-ink-muted">{project.lien} ↗</div>
                )}
                <button
                  type="button"
                  onClick={() => open(project)}
                  className="mt-5 inline-flex items-center gap-2 font-mono text-xs tracking-[0.08em] text-[#9FB0FF] uppercase"
                >
                  Voir le détail <span>→</span>
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-6.5 px-6 pb-10 sm:px-10 lg:px-20">
          {railProjects.map((project, i) => {
            const isOpen = expanded === project.id;
            return (
              <div key={project.id} className="flex w-full max-w-md flex-col items-center" style={{ scrollSnapAlign: "start" }}>
                <ProjectCard project={project} index={i} />
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : project.id)}
                  aria-expanded={isOpen}
                  className="mt-3 self-start font-mono text-xs tracking-[0.08em] text-ink-muted uppercase"
                >
                  {isOpen ? "Réduire −" : "Voir plus +"}
                </button>
                {isOpen && (
                  <div className="mt-3 w-full rounded-[16px] border border-white/10 bg-deep/60 p-5">
                    <p className="m-0 mb-4 text-sm leading-relaxed text-ink-muted">{project.thesis}</p>
                    <div className="mb-4 flex aspect-video w-full items-center justify-center rounded-[12px] border border-white/10 bg-void/60">
                      <span className="font-mono text-[10px] tracking-[0.18em] text-ink-muted uppercase">
                        Média à venir · lazy-load
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => open(project)}
                      className="inline-flex items-center gap-2 rounded-full bg-ember px-5 py-2.5 font-sans text-sm font-semibold text-[#0B0A06]"
                    >
                      Voir le détail complet →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {stubProject && <ProjectStubModal project={stubProject} onClose={close} />}
    </section>
  );
}
