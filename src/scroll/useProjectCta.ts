import { useState } from "react";
import { heroProject, type Project } from "@/content/projects";
import { useStepNav } from "@/scroll/StepNavContext";

/** Shared CTA behavior: hero project deep-dives in place, the rest open the placeholder stub. */
export function useProjectCta() {
  const { mode, goToSection } = useStepNav();
  const [stubProject, setStubProject] = useState<Project | null>(null);

  const open = (project: Project) => {
    if (project.id === heroProject.id) {
      if (mode === "stepping") {
        goToSection("deep");
      } else {
        document.getElementById("deep")?.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    window.location.hash = `#/projet/${project.id}`;
    setStubProject(project);
  };

  const close = () => setStubProject(null);

  return { stubProject, open, close };
}
