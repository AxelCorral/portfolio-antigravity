import gsap from "gsap";
import type { Step } from "./path";

/**
 * Section A recedes into depth, scroll jumps while invisible, section B
 * emerges. When the jump is hero<->projets, the Manifeste overlay (a fixed,
 * normally-invisible legend — see Manifeste.tsx) flashes in to cover the cut
 * and cedes its place, rather than Manifeste being its own dead step.
 */
export function animateSectionStep(prevSectionId: string, nextSectionId: string, onDone: () => void) {
  const prevEl = document.getElementById(prevSectionId);
  const nextEl = document.getElementById(nextSectionId);

  if (!prevEl || !nextEl) {
    onDone();
    return;
  }

  const isManifesteBeat =
    (prevSectionId === "hero" && nextSectionId === "projets") ||
    (prevSectionId === "projets" && nextSectionId === "hero");
  const manifeste = isManifesteBeat ? document.querySelector<HTMLElement>("[data-manifeste-overlay]") : null;

  const jump = () => nextEl.scrollIntoView({ behavior: "auto", block: "start" });

  const tl = gsap.timeline({ onComplete: onDone });

  tl.to(prevEl, {
    autoAlpha: 0,
    scale: 0.96,
    y: -16,
    filter: "blur(6px)",
    duration: 0.45,
    ease: "ease-fall",
  });

  if (manifeste) {
    tl.to(manifeste, { autoAlpha: 1, duration: 0.35, ease: "ease-float" })
      .call(jump)
      .to(manifeste, { autoAlpha: 0, duration: 0.35, ease: "ease-fall" }, "+=0.45");
  } else {
    tl.call(jump);
  }

  tl.fromTo(
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
