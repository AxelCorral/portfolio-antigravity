import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useScrollNav } from "@/scroll/ScrollProvider";

/**
 * One continuous smooth spline through every [data-orb-anchor] element in
 * document order (hero, manifeste, each project, recap, deep, stack, about,
 * contact) — built once in real page coordinates, not viewport-relative, so
 * the SVG itself scrolls with the page like any other absolutely-positioned
 * content instead of needing to be redrawn per step. Both the orb's position
 * and the bright "traveled" segment are driven by a single ScrollTrigger
 * spanning the whole document (scrub: true) — what you see is a direct
 * function of scroll position, never a self-playing animation.
 */
export function PathOrb() {
  const { smooth } = useScrollNav();
  const dimPathRef = useRef<SVGPathElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);
  const orbRef = useRef<SVGCircleElement>(null);
  const rawPathRef = useRef<ReturnType<typeof MotionPathPlugin.arrayToRawPath> | null>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  const applyProgress = (progress: number) => {
    const path = rawPathRef.current;
    if (!path || !orbRef.current || !progressPathRef.current) return;
    const pos = MotionPathPlugin.getPositionOnPath(path, progress);
    if (Number.isFinite(pos.x) && Number.isFinite(pos.y)) {
      gsap.set(orbRef.current, { attr: { cx: pos.x, cy: pos.y } });
    }
    gsap.set(progressPathRef.current, { drawSVG: `0% ${progress * 100}%` });
  };

  const rebuild = () => {
    if (!dimPathRef.current || !progressPathRef.current) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-orb-anchor]"));
    const points = els.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 + window.scrollX, y: r.top + r.height / 2 + window.scrollY };
    });
    if (points.length < 2) return;

    const rawPath = MotionPathPlugin.arrayToRawPath(points, { curviness: 1.25 });
    MotionPathPlugin.cacheRawPathMeasurements(rawPath);
    rawPathRef.current = rawPath;
    const d = MotionPathPlugin.rawPathToString(rawPath);
    gsap.set([dimPathRef.current, progressPathRef.current], { attr: { d } });
    setDims({ w: window.innerWidth, h: document.documentElement.scrollHeight });
  };

  useGSAP(
    () => {
      if (!smooth) return undefined;

      rebuild();
      // Fonts/lazy content can still shift layout right after mount.
      const settleTimer = window.setTimeout(rebuild, 350);

      const st = ScrollTrigger.create({
        start: 0,
        end: () => ScrollTrigger.maxScroll(window),
        scrub: true,
        onUpdate: (self) => applyProgress(self.progress),
      });

      const onResize = () => {
        rebuild();
        st.refresh();
        applyProgress(st.progress);
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.clearTimeout(settleTimer);
        window.removeEventListener("resize", onResize);
        st.kill();
      };
    },
    { dependencies: [smooth] },
  );

  if (!smooth) return null;

  return (
    <svg
      className="pointer-events-none absolute top-0 left-0"
      width={dims.w}
      height={dims.h}
      viewBox={`0 0 ${dims.w} ${dims.h}`}
      preserveAspectRatio="none"
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
      <path ref={dimPathRef} d="" fill="none" stroke="rgba(91,108,255,0.13)" strokeWidth="1.5" />

      {/* bright, traveled portion — same `d`, just a shorter DrawSVG window */}
      <path
        ref={progressPathRef}
        d=""
        fill="none"
        stroke="var(--halo)"
        strokeWidth="2"
        filter="url(#orb-glow)"
        opacity={0.85}
      />

      <circle ref={orbRef} cx={0} cy={0} r="5" fill="var(--halo)" filter="url(#orb-glow)" />
    </svg>
  );
}
