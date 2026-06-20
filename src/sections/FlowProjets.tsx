import { useState } from "react";
import { SectionLabel } from "@/components/SectionLabel";
import { ProjectCard } from "@/components/ProjectCard";
import { CarouselCard } from "@/components/CarouselCard";
import { ProjectStubModal } from "@/components/ProjectStubModal";
import { railProjects, heroProject, type Project } from "@/content/projects";
import { Reveal } from "@/scroll/Reveal";
import { useStepNav } from "@/scroll/StepNavContext";
import { angleStep, closeHoverDetail, openHoverDetail } from "@/scroll/carousel";

const RADIUS = 460;

function useProjectCta() {
  const { mode, goToSection } = useStepNav();
  const [stubProject, setStubProject] = useState<Project | null>(null);

  const open = (project: Project) => {
    if (project.id === heroProject.id) {
      if (mode === "stepping") {
        goToSection("deep");
      } else {
        document.getElementById("deep")?.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    window.location.hash = `#/projet/${project.id}`;
    setStubProject(project);
  };

  const close = () => setStubProject(null);

  return { stubProject, open, close };
}

export function FlowProjets() {
  const { mode, steps, currentStep } = useStepNav();
  const isStepping = mode === "stepping";
  const { stubProject, open, close } = useProjectCta();
  const [expanded, setExpanded] = useState<string | null>(null);

  const currentStepData = steps[currentStep];
  const activeCardIndex = currentStepData?.sectionId === "projets" ? currentStepData.cardIndex ?? 0 : 0;
  const step = angleStep(railProjects.length);

  return (
    <section
      id="projets"
      className="relative overflow-hidden py-17.5 max-md:snap-start motion-reduce:snap-start sm:py-22.5 lg:py-27.5"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-6 sm:px-10 lg:px-20">
        <Reveal className="min-w-70 flex-1">
          <SectionLabel index="02" label="Flow projets" />
        </Reveal>
      </div>

      {isStepping ? (
        <div id="carousel-stage" className="cylinder-stage relative mt-10 h-[78vh] min-h-[560px]">
          <div id="carousel-ring" className="cylinder-ring">
            {railProjects.map((project, i) => (
              <CarouselCard
                key={project.id}
                project={project}
                index={i}
                angle={i * step}
                radius={RADIUS}
                isActive={i === activeCardIndex}
                onOpenDetail={() => openHoverDetail(i)}
                onCloseDetail={() => closeHoverDetail(true)}
                onCtaClick={() => open(project)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div
          className="mt-12 flex items-stretch gap-6.5 overflow-x-auto px-6 pb-4 [scrollbar-width:thin] [-webkit-overflow-scrolling:touch] sm:px-10 lg:px-20"
          style={{ scrollSnapType: "x proximity" }}
        >
          {railProjects.map((project, i) => {
            const isOpen = expanded === project.id;
            return (
              <div key={project.id} className="flex flex-none flex-col" style={{ scrollSnapAlign: "start" }}>
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
                  <div className="mt-3 w-[min(392px,85vw)] rounded-[16px] border border-white/10 bg-deep/60 p-5">
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
