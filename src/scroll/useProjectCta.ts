import { useNavigate } from "react-router-dom";
import type { Project } from "@/content/projects";
import { useStepNav } from "@/scroll/StepNavContext";
import { saveReturnPosition } from "@/scroll/returnPosition";

/** Shared CTA behavior: every project now opens its real, shareable deep-dive route. */
export function useProjectCta() {
  const { mode, currentStep } = useStepNav();
  const navigate = useNavigate();

  const open = (project: Project) => {
    saveReturnPosition(
      mode === "stepping" ? { mode, step: currentStep } : { mode, scrollY: window.scrollY },
    );
    navigate(`/projet/${project.id}`);
  };

  return { open };
}
