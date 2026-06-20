import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { railProjects } from "@/content/projects";
import { buildSteps, type Step } from "./path";
import { animateSectionStep, findNearestStepIndex } from "./transitions";
import { consumeReturnPosition } from "./returnPosition";

/** Stepping (Observer-driven, animated) only kicks in for motion-safe desktop. */
export const STEPPING_QUERY = "(prefers-reduced-motion: no-preference) and (min-width: 768px)";

interface StepNavApi {
  mode: "stepping" | "native";
  steps: Step[];
  currentStep: number;
  totalSteps: number;
  isAnimating: boolean;
  goToStep: (index: number) => void;
  goToSection: (sectionId: string) => void;
}

const StepNavCtx = createContext<StepNavApi | null>(null);

export function useStepNav() {
  const ctx = useContext(StepNavCtx);
  if (!ctx) throw new Error("useStepNav must be used within StepNavProvider");
  return ctx;
}

export function StepNavProvider({ children }: { children: ReactNode }) {
  const steps = useMemo(() => buildSteps(railProjects.length), []);
  const totalSteps = steps.length;

  const [mode, setMode] = useState<"stepping" | "native">("native");
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const currentStepRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const goToStepRef = useRef((index: number) => {
    const list = stepsRef.current;
    const clamped = Math.max(0, Math.min(list.length - 1, index));
    if (isAnimatingRef.current || clamped === currentStepRef.current) return;

    const prevStep = list[currentStepRef.current];
    const nextStep = list[clamped];

    isAnimatingRef.current = true;
    setIsAnimating(true);

    const onDone = () => {
      currentStepRef.current = clamped;
      setCurrentStep(clamped);
      isAnimatingRef.current = false;
      setIsAnimating(false);
    };

    // Moving between zigzag cards within "projets" — one scroll/keyboard
    // step = one project, no pin/scrub. FlowProjets' own effect (keyed on
    // currentStep) tweens the card focus, and PathOrb's generic spline
    // walk handles the orb; nothing else to drive here.
    if (prevStep.sectionId === "projets" && nextStep.sectionId === "projets") {
      onDone();
      return;
    }

    // Leaving the recap forward (to a real DOM section) needs an explicit
    // jump — the overlay closing doesn't move the document's scroll
    // position on its own, since recap has no scroll height of its own.
    if (prevStep.sectionId === "projets-recap" && nextStep.sectionId !== "projets-recap") {
      const nextEl = document.getElementById(nextStep.sectionId);
      nextEl?.scrollIntoView({ behavior: "auto", block: "start" });
      onDone();
      return;
    }

    if (nextStep.sectionId === "projets-recap") {
      if (prevStep.sectionId !== "projets") {
        document.getElementById("projets")?.scrollIntoView({ behavior: "auto", block: "start" });
      }
      onDone();
      return;
    }

    animateSectionStep(prevStep.sectionId, nextStep.sectionId, onDone);
  });

  const goToSectionRef = useRef((sectionId: string) => {
    const idx = stepsRef.current.findIndex((s) => s.sectionId === sectionId);
    if (idx >= 0) goToStepRef.current(idx);
  });

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(STEPPING_QUERY, () => {
      const saved = consumeReturnPosition();
      const initialIndex =
        saved?.mode === "stepping" && saved.step !== undefined
          ? Math.max(0, Math.min(stepsRef.current.length - 1, saved.step))
          : findNearestStepIndex(stepsRef.current);
      currentStepRef.current = initialIndex;
      setCurrentStep(initialIndex);
      setMode("stepping");

      if (saved?.mode === "stepping" && saved.step !== undefined) {
        const targetSection = stepsRef.current[initialIndex]?.sectionId;
        const scrollTargetId = targetSection === "projets-recap" ? "projets" : targetSection;
        const el = scrollTargetId && document.getElementById(scrollTargetId);
        el?.scrollIntoView({ behavior: "auto", block: "start" });
      }

      const observer = Observer.create({
        target: window,
        type: "wheel,touch,pointer",
        preventDefault: true,
        tolerance: 12,
        onUp: () => goToStepRef.current(currentStepRef.current - 1),
        onDown: () => goToStepRef.current(currentStepRef.current + 1),
      });

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
          e.preventDefault();
          goToStepRef.current(currentStepRef.current + 1);
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
          goToStepRef.current(currentStepRef.current - 1);
        } else if (e.key === "Home") {
          e.preventDefault();
          goToStepRef.current(0);
        } else if (e.key === "End") {
          e.preventDefault();
          goToStepRef.current(stepsRef.current.length - 1);
        }
      };
      window.addEventListener("keydown", onKeyDown);

      return () => {
        observer.kill();
        window.removeEventListener("keydown", onKeyDown);
        setMode("native");
      };
    });

    return () => mm.revert();
  }, []);

  const api = useMemo<StepNavApi>(
    () => ({
      mode,
      steps,
      currentStep,
      totalSteps,
      isAnimating,
      goToStep: (index: number) => goToStepRef.current(index),
      goToSection: (id: string) => goToSectionRef.current(id),
    }),
    [mode, steps, currentStep, totalSteps, isAnimating],
  );

  return <StepNavCtx.Provider value={api}>{children}</StepNavCtx.Provider>;
}
