import type { Step } from "./path";

/**
 * Resolves the real DOM element the orb should dock to for a macro step.
 * Only used for the macro spline (hero <-> projets-entry, recap <-> deep,
 * etc) — while actually inside the projets pinned scrub or the open recap
 * window, their own dedicated scrubbed orbs take over (see ZigzagOrb.tsx /
 * ProjectsRecap.tsx), not this one.
 */
export function getAnchorEl(step: Step): HTMLElement | null {
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
