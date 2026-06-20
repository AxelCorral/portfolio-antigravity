import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useStepNav } from "@/scroll/StepNavContext";
import { getAnchorPoint, type AnchorPoint } from "@/scroll/anchors";

/**
 * The orb/track is anchor-driven: at every step it docks next to the real
 * focal element (section title, active carousel card, open detail panel —
 * see data-orb-anchor). The visible path is just the segment between the
 * previous and current anchor, redrawn each transition, rather than one
 * static decorative curve.
 */
export function PathOrb() {
  const { mode, steps, currentStep } = useStepNav();
  const pathRef = useRef<SVGPathElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);
  const orbRef = useRef<SVGCircleElement>(null);
  const lastPointRef = useRef<AnchorPoint | null>(null);
  const [vb, setVb] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const onResize = () => setVb({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Resync instantly (no animation) on resize — the anchor likely moved under us.
  useEffect(() => {
    const onResync = () => {
      if (mode !== "stepping" || !orbRef.current) return;
      const point = getAnchorPoint(steps[currentStep]);
      if (!point) return;
      lastPointRef.current = point;
      gsap.set(orbRef.current, { attr: { cx: point.x, cy: point.y } });
    };
    window.addEventListener("resize", onResync);
    return () => window.removeEventListener("resize", onResync);
  }, [mode, steps, currentStep]);

  useGSAP(() => {
    if (mode !== "stepping" || !orbRef.current || !pathRef.current || !progressPathRef.current) return;

    const toPoint = getAnchorPoint(steps[currentStep]);
    if (!toPoint) return;

    const fromPoint = lastPointRef.current ?? toPoint;
    lastPointRef.current = toPoint;

    if (fromPoint.x === toPoint.x && fromPoint.y === toPoint.y) {
      gsap.set(orbRef.current, { attr: { cx: toPoint.x, cy: toPoint.y } });
      gsap.set([pathRef.current, progressPathRef.current], { attr: { d: "" } });
      return;
    }

    const rawPath = MotionPathPlugin.arrayToRawPath([fromPoint, toPoint], { curviness: 1.25 });
    const d = MotionPathPlugin.rawPathToString(rawPath);

    gsap.set([pathRef.current, progressPathRef.current], { attr: { d } });
    gsap.fromTo(
      progressPathRef.current,
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 0.9, ease: "ease-float" },
    );
    gsap.fromTo(
      orbRef.current,
      { attr: { cx: fromPoint.x, cy: fromPoint.y } },
      { attr: { cx: toPoint.x, cy: toPoint.y }, duration: 0.9, ease: "ease-float" },
    );
  }, [currentStep, mode]);

  if (mode !== "stepping") return null;

  return (
    <svg
      className="pointer-events-none fixed inset-0 z-40 h-full w-full"
      viewBox={`0 0 ${vb.w} ${vb.h}`}
      aria-hidden="true"
    >
      <defs>
        <filter id="orb-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* dim reference for the current segment */}
      <path ref={pathRef} d="" fill="none" stroke="rgba(91,108,255,0.16)" strokeWidth="1.5" />

      {/* bright, traveled portion of the same segment */}
      <path
        ref={progressPathRef}
        d=""
        fill="none"
        stroke="var(--halo)"
        strokeWidth="2"
        filter="url(#orb-glow)"
        opacity={0.9}
      />

      <circle ref={orbRef} r="5" fill="var(--halo)" filter="url(#orb-glow)" />
    </svg>
  );
}
