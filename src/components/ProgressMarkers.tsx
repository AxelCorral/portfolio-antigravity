import { useStepNav } from "@/scroll/StepNavContext";

const SECTION_LABELS: Record<string, string> = {
  hero: "Accueil",
  manifeste: "Manifeste",
  projets: "Projets",
  deep: "Deep dive",
  stack: "Stack",
  about: "À propos",
  contact: "Contact",
};

interface Marker {
  key: string;
  stepIndex: number;
  label: string;
  isCurrent: boolean;
}

export function ProgressMarkers() {
  const { steps, currentStep, goToStep, mode } = useStepNav();

  if (mode !== "stepping") return null;

  const current = steps[currentStep];
  const markers: Marker[] = [];
  const seenSections = new Set<string>();

  steps.forEach((step, i) => {
    if (step.sectionId === "projets") {
      markers.push({
        key: `projets-${step.cardIndex}`,
        stepIndex: i,
        label: `Projet ${(step.cardIndex ?? 0) + 1}`,
        isCurrent: current?.sectionId === "projets" && current?.cardIndex === step.cardIndex,
      });
      return;
    }

    if (seenSections.has(step.sectionId)) return;
    seenSections.add(step.sectionId);
    markers.push({
      key: step.sectionId,
      stepIndex: i,
      label: SECTION_LABELS[step.sectionId] ?? step.sectionId,
      isCurrent: current?.sectionId === step.sectionId,
    });
  });

  return (
    <nav
      aria-label="Navigation par section"
      className="fixed top-1/2 right-5 z-50 flex -translate-y-1/2 flex-col items-center gap-3.5 lg:right-8"
    >
      {markers.map((marker) => (
        <button
          key={marker.key}
          type="button"
          aria-label={`Aller à ${marker.label}`}
          aria-current={marker.isCurrent ? "step" : undefined}
          onClick={() => goToStep(marker.stepIndex)}
          className={`h-2 w-2 rounded-full border transition-colors ${
            marker.isCurrent
              ? "border-halo bg-halo shadow-[0_0_10px_var(--halo)]"
              : "border-white/25 bg-transparent hover:border-white/50"
          }`}
        />
      ))}
    </nav>
  );
}
