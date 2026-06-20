export const SECTION_IDS = ["hero", "projets", "deep", "stack", "about", "contact"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export interface Step {
  sectionId: SectionId;
  /** Only set for "projets" steps — index of the cylinder card facing the camera. */
  cardIndex?: number;
}

/**
 * One step per project face: P1 -> P2 -> P3 -> P4 (cylinder rotation only —
 * the popup detail is hover/tap-driven, see carousel.ts, and isn't part of
 * the step sequence). Every other section is a single step. Manifeste has no
 * step of its own — it's a transitional overlay shown during the hero<->projets
 * transition (see transitions.ts), never a stop.
 */
export function buildSteps(railCount: number): Step[] {
  return SECTION_IDS.flatMap((id): Step[] => {
    if (id !== "projets") return [{ sectionId: id }];
    return Array.from({ length: Math.max(railCount, 1) }, (_, i) => ({ sectionId: id, cardIndex: i }));
  });
}

/** Stable string key for a step — used to resolve `data-orb-anchor` targets. */
export function stepAnchorKey(step: Step): string {
  if (step.sectionId === "projets") {
    return `projets-${step.cardIndex}`;
  }
  return step.sectionId;
}
