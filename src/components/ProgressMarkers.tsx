import { useStepNav } from "@/scroll/StepNavContext";

const SECTION_LABELS: Record<string, string> = {
  hero: "Accueil",
  projets: "Projets",
  "projets-recap": "Récap",
  deep: "Deep dive",
  stack: "Stack",
  about: "À propos",
  contact: "Contact",
};

export function ProgressMarkers() {
  const { steps, currentStep, goToStep, mode } = useStepNav();

  if (mode !== "stepping") return null;

  return (
    <nav
      aria-label="Navigation par section"
      className="fixed top-1/2 right-5 z-50 flex -translate-y-1/2 flex-col items-center gap-3.5 lg:right-8"
    >
      {steps.map((step, i) => {
        const isCurrent = i === currentStep;
        const label = SECTION_LABELS[step.sectionId] ?? step.sectionId;
        return (
          <button
            key={step.sectionId}
            type="button"
            aria-label={`Aller à ${label}`}
            aria-current={isCurrent ? "step" : undefined}
            onClick={() => goToStep(i)}
            className={`h-2 w-2 rounded-full border transition-colors ${
              isCurrent
                ? "border-halo bg-halo shadow-[0_0_10px_var(--halo)]"
                : "border-white/25 bg-transparent hover:border-white/50"
            }`}
          />
        );
      })}
    </nav>
  );
}
