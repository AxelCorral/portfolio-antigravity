export const SECTION_IDS = ["hero", "projets", "projets-recap", "deep", "stack", "about", "contact"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export interface Step {
  sectionId: SectionId;
}

/**
 * Purely macro steps now — "projets" is a single entry point into a long
 * pinned/scrubbed zigzag (real scroll drives progress there, see
 * FlowProjets.tsx, not Observer sub-stepping). "projets-recap" isn't a
 * scrollable DOM section at all; it's an overlay window opened/closed at
 * the zigzag's boundaries (see StepNavContext.tsx).
 */
export function buildSteps(): Step[] {
  return SECTION_IDS.map((id) => ({ sectionId: id }));
}
