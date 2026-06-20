import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import Lenis from "lenis";
import { railProjects } from "@/content/projects";
import { buildSteps, type Step } from "./path";
import { animateSectionStep, findNearestStepIndex } from "./transitions";
import {
  closeDetailAndRotate,
  closeDetailOnly,
  forceCloseDetailInstant,
  getCarouselCardEls,
  layoutCarousel,
  openDetail,
  syncCarouselToStep,
} from "./carousel";

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

/** Transition logic specific to the "projets" carousel's focus/detail sub-steps. */
function animateProjetsStep(prev: Step, next: Step, onDone: () => void) {
  const cardEls = getCarouselCardEls();
  const prevIdx = prev.cardIndex ?? 0;
  const nextIdx = next.cardIndex ?? 0;

  if (prev.phase === "focus" && next.phase === "detail" && prevIdx === nextIdx) {
    openDetail(cardEls, prevIdx, onDone);
    return;
  }
  if (prev.phase === "detail" && next.phase === "focus" && nextIdx === prevIdx) {
    closeDetailOnly(cardEls, prevIdx, onDone);
    return;
  }
  if (prev.phase === "detail" && next.phase === "focus" && nextIdx === prevIdx + 1) {
    closeDetailAndRotate(cardEls, prevIdx, nextIdx, onDone);
    return;
  }

  // Generic jump (e.g. clicking a different project's marker).
  if (prev.phase === "detail") forceCloseDetailInstant(cardEls, prevIdx);
  layoutCarousel(cardEls, nextIdx, true, onDone);
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
  const lenisRef = useRef<Lenis | null>(null);

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

    if (prevStep.sectionId === nextStep.sectionId && prevStep.sectionId === "projets") {
      animateProjetsStep(prevStep, nextStep, onDone);
      return;
    }

    if (prevStep.sectionId === "projets" && prevStep.phase === "detail") {
      forceCloseDetailInstant(getCarouselCardEls(), prevStep.cardIndex ?? 0);
    }
    if (nextStep.sectionId === "projets") {
      syncCarouselToStep(getCarouselCardEls(), nextStep.cardIndex ?? 0, nextStep.phase);
    }
    animateSectionStep(prevStep.sectionId, nextStep.sectionId, lenisRef.current, onDone);
  });

  const goToSectionRef = useRef((sectionId: string) => {
    const idx = stepsRef.current.findIndex((s) => s.sectionId === sectionId);
    if (idx >= 0) goToStepRef.current(idx);
  });

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(STEPPING_QUERY, () => {
      const initialIndex = findNearestStepIndex(stepsRef.current);
      currentStepRef.current = initialIndex;
      setCurrentStep(initialIndex);
      setMode("stepping");

      const initialStep = stepsRef.current[initialIndex];
      if (initialStep.sectionId === "projets") {
        syncCarouselToStep(getCarouselCardEls(), initialStep.cardIndex ?? 0, initialStep.phase);
      }

      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenisRef.current = lenis;
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

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
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
        const cardEls = document.querySelectorAll("#carousel-stage [data-card-index]");
        if (cardEls.length > 0) {
          gsap.set(cardEls, { clearProps: "transform,opacity,filter,zIndex" });
        }
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
