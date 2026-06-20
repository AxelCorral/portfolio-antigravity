import gsap from "gsap";
import type Lenis from "lenis";
import type { Step } from "./path";

/** Section A recedes into depth, scroll jumps while invisible, section B emerges. */
export function animateSectionStep(
  prevSectionId: string,
  nextSectionId: string,
  lenis: Lenis | null,
  onDone: () => void,
) {
  const prevEl = document.getElementById(prevSectionId);
  const nextEl = document.getElementById(nextSectionId);

  if (!prevEl || !nextEl) {
    onDone();
    return;
  }

  gsap
    .timeline({ onComplete: onDone })
    .to(prevEl, {
      autoAlpha: 0,
      scale: 0.96,
      y: -16,
      filter: "blur(6px)",
      duration: 0.45,
      ease: "ease-fall",
    })
    .call(() => {
      if (lenis) {
        lenis.scrollTo(nextEl, { immediate: true });
      } else {
        nextEl.scrollIntoView({ behavior: "auto" });
      }
    })
    .fromTo(
      nextEl,
      { autoAlpha: 0, scale: 0.96, y: 24, filter: "blur(6px)" },
      { autoAlpha: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 0.85, ease: "ease-float" },
    );
}

/** Best-effort sync when stepping mode activates mid-session (e.g. resize across the breakpoint). */
export function findNearestStepIndex(steps: Step[]): number {
  let bestIndex = 0;
  let bestDistance = Infinity;

  steps.forEach((step, i) => {
    if (step.cardIndex !== undefined && step.cardIndex !== 0) return;
    const el = document.getElementById(step.sectionId);
    if (!el) return;
    const distance = Math.abs(el.getBoundingClientRect().top);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }
  });

  return bestIndex;
}
