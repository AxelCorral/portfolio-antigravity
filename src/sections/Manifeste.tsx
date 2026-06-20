import { useStepNav } from "@/scroll/StepNavContext";

const TEXT = (
  <>
    <span className="text-ink-muted">
      De la vidéo brute aux événements de match jusqu'aux flux d'offres d'emploi —
    </span>{" "}
    je conçois les pipelines qui transforment le désordre en systèmes exploitables.
  </>
);

/**
 * No step of its own (see path.ts) — in stepping mode this is a fixed,
 * invisible-by-default overlay that transitions.ts flashes in to cover the
 * hero<->projets jump, then fades out. In native/mobile scroll it's just a
 * normal compact block in the flow (no hijack there, so it doesn't need the
 * transitional treatment).
 */
export function Manifeste() {
  const { mode } = useStepNav();

  if (mode === "stepping") {
    return (
      <p
        data-manifeste-overlay
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 m-0 flex items-center justify-center px-10 text-center text-pretty font-display text-lg leading-[1.2] font-medium tracking-[-0.02em] text-ink opacity-0"
        style={{ maxWidth: "48ch", marginInline: "auto" }}
      >
        {TEXT}
      </p>
    );
  }

  return (
    <section
      id="manifeste"
      className="relative mx-auto flex max-w-7xl flex-col items-start px-6 py-10 max-md:snap-start motion-reduce:snap-start sm:px-10 sm:py-12 lg:px-20"
    >
      <p className="m-0 max-w-[30ch] text-pretty font-display text-lg leading-[1.14] font-medium tracking-[-0.02em] text-ink">
        {TEXT}
      </p>
    </section>
  );
}
