import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useStepNav } from "@/scroll/StepNavContext";
import { getAnchorPoint, type AnchorPoint } from "@/scroll/anchors";
import type { Step } from "@/scroll/path";

/**
 * One continuous smooth spline through every anchor point in route order
 * (Catmull-Rom-style, via MotionPathPlugin.arrayToRawPath's `curviness`) —
 * never a fresh straight chord per transition, so tangents stay continuous
 * across every waypoint. The same raw path drives both the visible line
 * (dim + bright DrawSVG-style progress segment) and the orb's motion
 * (manual point lookup along the path, not the `motionPath` tween property —
 * that double-applies on top of an SVG element's own cx/cy attributes).
 */
function buildPoints(steps: Step[]): AnchorPoint[] {
  const pts: AnchorPoint[] = [];
  let last: AnchorPoint = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  steps.forEach((step) => {
    const p = getAnchorPoint(step);
    if (p) last = p;
    pts.push(last);
  });
  return pts;
}

export function PathOrb() {
  const { mode, steps, currentStep } = useStepNav();
  const dimPathRef = useRef<SVGPathElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);
  const orbRef = useRef<SVGCircleElement>(null);
  const rawPathRef = useRef<ReturnType<typeof MotionPathPlugin.arrayToRawPath> | null>(null);
  const progressRef = useRef(0);
  const [vb, setVb] = useState({ w: window.innerWidth, h: window.innerHeight });

  const rebuild = (animateTo: number | null) => {
    if (mode !== "stepping" || !dimPathRef.current || !progressPathRef.current || !orbRef.current) return;

    const points = buildPoints(steps);
    const rawPath = MotionPathPlugin.arrayToRawPath(points, { curviness: 1.25 });
    MotionPathPlugin.cacheRawPathMeasurements(rawPath);
    rawPathRef.current = rawPath;
    const d = MotionPathPlugin.rawPathToString(rawPath);
    gsap.set([dimPathRef.current, progressPathRef.current], { attr: { d } });

    const targetProgress = steps.length > 1 ? currentStep / (steps.length - 1) : 0;

    if (animateTo === null) {
      progressRef.current = targetProgress;
      const pos = MotionPathPlugin.getPositionOnPath(rawPath, targetProgress);
      gsap.set(orbRef.current, { attr: { cx: pos.x, cy: pos.y } });
      gsap.set(progressPathRef.current, { drawSVG: `0% ${targetProgress * 100}%` });
      return;
    }

    const from = progressRef.current;
    const proxy = { p: from };
    gsap.to(proxy, {
      p: targetProgress,
      duration: 0.9,
      ease: "ease-float",
      onUpdate: () => {
        const path = rawPathRef.current;
        if (!path || !orbRef.current || !progressPathRef.current) return;
        const pos = MotionPathPlugin.getPositionOnPath(path, proxy.p);
        gsap.set(orbRef.current, { attr: { cx: pos.x, cy: pos.y } });
        gsap.set(progressPathRef.current, { drawSVG: `0% ${proxy.p * 100}%` });
      },
    });
    progressRef.current = targetProgress;
  };

  useEffect(() => {
    const onResize = () => {
      setVb({ w: window.innerWidth, h: window.innerHeight });
      rebuild(null);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, steps]);

  useGSAP(() => {
    rebuild(currentStep);
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

      {/* dim reference for the whole route */}
      <path ref={dimPathRef} d="" fill="none" stroke="rgba(91,108,255,0.14)" strokeWidth="1.5" />

      {/* bright, traveled portion — same `d`, just a shorter DrawSVG window */}
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
