import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { railProjects } from "@/content/projects";
import { useStepNav } from "@/scroll/StepNavContext";
import { useProjectCta } from "@/scroll/useProjectCta";
import { fanAngles, rotateRing } from "@/scroll/carousel";

/**
 * Recap "wheel" of all 4 projects, opened once the zigzag (FlowProjets) has
 * fully scrolled by. Not a required step to move forward — just an overview;
 * closing (or scrolling past) continues to Stack. Pure-CSS grid fallback for
 * native/mobile/reduced-motion (no 3D, no overlay — see render branch below).
 *
 * Panels sit on a "fan" rather than the literal 360/N cylinder spacing — at
 * a true 90deg (N=4) a flat panel viewed edge-on is ~0 visible width, which
 * is exactly the "non-front panels aren't visible" gap this build calls out.
 * A tighter angle keeps every panel legible while still reading as a wheel.
 */
const FAN_DEG = 64;

export function ProjectsRecap() {
  const { mode, steps, currentStep, goToSection } = useStepNav();
  const isStepping = mode === "stepping";
  const isOpen = isStepping && steps[currentStep]?.sectionId === "projets-recap";
  const [activeIndex, setActiveIndex] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const { open } = useProjectCta();

  const baseAngles = fanAngles(railProjects.length, FAN_DEG);

  const focusIndex = (i: number) => {
    setActiveIndex(i);
    if (ringRef.current) {
      const cells = Array.from(ringRef.current.querySelectorAll<HTMLElement>(".recap-panel"));
      rotateRing(ringRef.current, cells, baseAngles, i, true);
    }
  };

  useGSAP(
    () => {
      if (!isStepping || !overlayRef.current || !windowRef.current) return;

      if (isOpen) {
        setActiveIndex(0);
        if (ringRef.current) {
          const cells = Array.from(ringRef.current.querySelectorAll<HTMLElement>(".recap-panel"));
          rotateRing(ringRef.current, cells, baseAngles, 0, false);
        }
        gsap.set(overlayRef.current, { autoAlpha: 1 });
        gsap.fromTo(
          windowRef.current,
          { scale: 0.82, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(1.5)" },
        );
      } else {
        gsap.to(windowRef.current, {
          scale: 0.9,
          autoAlpha: 0,
          duration: 0.35,
          ease: "ease-fall",
          onComplete: () => gsap.set(overlayRef.current, { autoAlpha: 0 }),
        });
      }
    },
    { dependencies: [isOpen, isStepping], revertOnUpdate: false },
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        focusIndex((activeIndex + 1) % railProjects.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        focusIndex((activeIndex - 1 + railProjects.length) % railProjects.length);
      } else if (e.key === "Escape") {
        e.preventDefault();
        goToSection("deep");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeIndex]);

  if (!isStepping) {
    return (
      <section
        id="projets-recap"
        className="relative mx-auto max-w-7xl px-6 py-16 max-md:snap-start sm:px-10 lg:px-20"
      >
        <p className="m-0 mb-8 font-mono text-xs tracking-[0.22em] text-ink-muted uppercase">
          [ Récap ] Tous les projets
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {railProjects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => open(project)}
              className="rounded-[16px] border border-white/10 bg-deep/60 p-5 text-left"
            >
              <h3 className="m-0 mb-2 font-display text-lg font-semibold text-ink">{project.title}</h3>
              <p className="m-0 text-sm leading-relaxed text-ink-muted">{project.thesis}</p>
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div
      ref={overlayRef}
      data-orb-anchor="projets-recap"
      className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center opacity-0"
      style={{ visibility: "hidden" }}
      aria-hidden={!isOpen}
    >
      <div className="absolute inset-0 bg-void/82 backdrop-blur-sm" />

      <div
        ref={windowRef}
        className={`relative w-[min(880px,92vw)] rounded-[24px] border border-white/10 bg-deep/90 p-8 shadow-[0_80px_200px_-60px_rgba(91,108,255,0.55)] ${
          isOpen ? "pointer-events-auto" : ""
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="font-mono text-xs tracking-[0.22em] text-ink-muted uppercase">
            Récap · tous les projets
          </span>
          <button
            type="button"
            onClick={() => goToSection("deep")}
            aria-label="Fermer le récap"
            className="rounded-full border border-white/20 px-4 py-1.5 font-mono text-xs tracking-[0.08em] text-ink uppercase"
          >
            Fermer
          </button>
        </div>

        <div className="recap-stage relative mx-auto h-[420px] w-full">
          {/* hub, visible behind the front panel */}
          <div className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-gradient-to-br from-[rgba(91,108,255,0.25)] to-transparent" />

          <div ref={ringRef} className="recap-ring">
            {railProjects.map((project, i) => (
              <div
                key={project.id}
                className="recap-cell"
                style={{ transform: `rotateY(${baseAngles[i]}deg) translateZ(300px)` }}
              >
                <button
                  type="button"
                  onClick={() => (i === activeIndex ? open(project) : focusIndex(i))}
                  className="recap-panel w-full rounded-[18px] border border-white/[0.1] bg-gradient-to-br from-[rgba(14,17,30,0.95)] to-[rgba(8,10,20,0.95)] p-6 text-left"
                >
                  <span className="font-mono text-[11px] tracking-[0.14em] text-ink-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="m-0 mt-2 mb-2 font-display text-lg font-semibold text-ink">{project.title}</h4>
                  <p className="m-0 line-clamp-3 text-[13px] leading-relaxed text-ink-muted">{project.thesis}</p>
                  {i === activeIndex && (
                    <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] text-[#9FB0FF] uppercase">
                      Voir le détail <span>→</span>
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-[11px] tracking-[0.1em] text-ink-muted uppercase">
          ← → pour tourner · clic sur le projet de face pour le détail
        </p>
      </div>
    </div>
  );
}
