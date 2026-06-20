export const SECTION_IDS = ["hero", "manifeste", "projets", "deep", "stack", "about", "contact"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export interface Step {
  sectionId: SectionId;
  /** Only set for "projets" steps — index of the carousel card this step targets. */
  cardIndex?: number;
  /** Only set for "projets" steps — focus (carousel) or detail (popup) phase. */
  phase?: "focus" | "detail";
}

/**
 * Sequence inside "projets": P1-focus → P1-detail → P2-focus → P2-detail → ...
 * Every other section is a single step. The orb/path is anchor-driven (see
 * components/PathOrb.tsx) — this module only owns the step sequence.
 */
export function buildSteps(railCount: number): Step[] {
  return SECTION_IDS.flatMap((id): Step[] => {
    if (id !== "projets") return [{ sectionId: id }];

    return Array.from({ length: Math.max(railCount, 1) }, (_, i) => i).flatMap(
      (i): Step[] => [
        { sectionId: id, cardIndex: i, phase: "focus" },
        { sectionId: id, cardIndex: i, phase: "detail" },
      ],
    );
  });
}

/** Stable string key for a step — used to resolve `data-orb-anchor` targets. */
export function stepAnchorKey(step: Step): string {
  if (step.sectionId === "projets") {
    return `projets-${step.cardIndex}-${step.phase}`;
  }
  return step.sectionId;
}
