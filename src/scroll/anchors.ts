import type { Step } from "./path";

/** Resolves the real DOM element the orb should dock to for a given step. */
export function getAnchorEl(step: Step): HTMLElement | null {
  if (step.sectionId === "projets") {
    return document.querySelector<HTMLElement>(`#projets [data-orb-anchor="zigzag-${step.cardIndex ?? 0}"]`);
  }
  return document.querySelector<HTMLElement>(`[data-orb-anchor="${step.sectionId}"]`);
}

export interface AnchorPoint {
  x: number;
  y: number;
}

/** Center point of the anchor, in viewport pixels. */
export function getAnchorPoint(step: Step): AnchorPoint | null {
  const el = getAnchorEl(step);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}
