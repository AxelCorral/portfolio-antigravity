import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { buildSteps, type Step } from "./path";
import { animateSectionStep, findNearestStepIndex } from "./transitions";

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
  /** The "projets" pinned zigzag flips this off while it owns real scroll, so the
   *  global Observer (and the keyboard down/up handlers) step aside and let the
   *  browser scroll naturally drive the scrub instead of hijacking it. */
  setObserverEnabled: (enabled: boolean) => void;
  /** True for a few frames around any discrete jump (markers, keyboard, recap
   *  close...). The zigzag's ScrollTrigger checks this so a jump that
   *  teleports across its whole pinned range (e.g. recap -> deep) doesn't
   *  also fire onEnter/onLeave as if the user had naturally scrubbed through it. */
  isProgrammaticJump: () => boolean;
}

const StepNavCtx = createContext<StepNavApi | null>(null);

export function useStepNav() {
  const ctx = useContext(StepNavCtx);
  if (!ctx) throw new Error("useStepNav must be used within StepNavProvider");
  return ctx;
}

export function StepNavProvider({ children }: { children: ReactNode }) {
  const steps = useMemo(() => buildSteps(), []);
  const totalSteps = steps.length;

  const [mode, setMode] = useState<"stepping" | "native">("native");
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const currentStepRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const observerRef = useRef<Observer | null>(null);
  const observerEnabledRef = useRef(true);
  const programmaticJumpRef = useRef(false);

  const setObserverEnabledRef = useRef((enabled: boolean) => {
    observerEnabledRef.current = enabled;
    if (enabled) observerRef.current?.enable();
    else observerRef.current?.disable();
  });

  const goToStepRef = useRef((index: number) => {
    const list = stepsRef.current;
    const clamped = Math.max(0, Math.min(list.length - 1, index));
    if (isAnimatingRef.current || clamped === currentStepRef.current) return;

    const prevStep = list[currentStepRef.current];
    const nextStep = list[clamped];

    isAnimatingRef.current = true;
    setIsAnimating(true);
    programmaticJumpRef.current = true;

    const onDone = () => {
      currentStepRef.current = clamped;
      setCurrentStep(clamped);
      isAnimatingRef.current = false;
      setIsAnimating(false);
      // The zigzag pin should only ever be "armed" (Observer disabled, real
      // scroll driving the scrub) while we're actually sitting on "projets".
      setObserverEnabledRef.current(nextStep.sectionId !== "projets");
      requestAnimationFrame(() => requestAnimationFrame(() => { programmaticJumpRef.current = false; }));
    };

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
      const initialIndex = findNearestStepIndex(stepsRef.current);
      currentStepRef.current = initialIndex;
      setCurrentStep(initialIndex);
      setMode("stepping");

      const observer = Observer.create({
        target: window,
        type: "wheel,touch,pointer",
        preventDefault: true,
        tolerance: 12,
        onUp: () => goToStepRef.current(currentStepRef.current - 1),
        onDown: () => goToStepRef.current(currentStepRef.current + 1),
      });
      observerRef.current = observer;
      observerEnabledRef.current = true;

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (e.key === "Home") {
          e.preventDefault();
          setObserverEnabledRef.current(true);
          goToStepRef.current(0);
        } else if (e.key === "End") {
          e.preventDefault();
          setObserverEnabledRef.current(true);
          goToStepRef.current(stepsRef.current.length - 1);
        } else if (!observerEnabledRef.current) {
          // Inside the pinned zigzag scrub — let the browser scroll natively.
          return;
        } else if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
          e.preventDefault();
          goToStepRef.current(currentStepRef.current + 1);
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
          goToStepRef.current(currentStepRef.current - 1);
        }
      };
      window.addEventListener("keydown", onKeyDown);

      return () => {
        observer.kill();
        observerRef.current = null;
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
      setObserverEnabled: (enabled: boolean) => setObserverEnabledRef.current(enabled),
      isProgrammaticJump: () => programmaticJumpRef.current,
    }),
    [mode, steps, currentStep, totalSteps, isAnimating],
  );

  return <StepNavCtx.Provider value={api}>{children}</StepNavCtx.Provider>;
}
