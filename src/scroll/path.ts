export const SECTION_IDS = ["hero", "projets", "projets-recap", "deep", "stack", "about", "contact"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export interface Step {
  sectionId: SectionId;
  /** Only set for "projets" steps — which zigzag card is in focus. */
  cardIndex?: number;
}

/**
 * One scroll/keyboard step = one project (P1 -> P2 -> P3 -> P4), each its
 * own discrete step like the rest of the site — no pinned scrub. The orb's
 * spline through all of this is generic (see PathOrb.tsx): it just walks
 * every step's anchor in order, and the "projets" steps' anchors happen to
 * be the zigzag cards (see anchors.ts), so the curve naturally threads
 * through them without any dedicated engine. "projets-recap" isn't a
 * scrollable DOM section at all; it's an overlay window opened/closed at
 * the zigzag's boundaries (see StepNavContext.tsx).
 */
export function buildSteps(railCount: number): Step[] {
  return SECTION_IDS.flatMap((id): Step[] => {
    if (id !== "projets") return [{ sectionId: id }];
    return Array.from({ length: Math.max(railCount, 1) }, (_, i) => ({ sectionId: id, cardIndex: i }));
  });
}
