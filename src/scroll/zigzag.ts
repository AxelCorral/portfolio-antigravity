import { MotionPathPlugin } from "gsap/MotionPathPlugin";

export interface Point {
  x: number;
  y: number;
}

/**
 * The 4 project cards sit at fixed zigzag slots within the pinned container
 * (right/left alternating, descending) — their "focus" animation is purely
 * opacity/scale/translate layered on top, so these anchor points are stable
 * for the whole scrub and only need recomputing on resize.
 */
export function getZigzagAnchors(containerEl: HTMLElement, count: number): Point[] {
  const containerRect = containerEl.getBoundingClientRect();
  return Array.from({ length: count }, (_, i) => {
    const el = containerEl.querySelector<HTMLElement>(`[data-orb-anchor="zigzag-${i}"]`);
    if (!el) return { x: containerRect.width / 2, y: containerRect.height / 2 };
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2 - containerRect.left, y: r.top + r.height / 2 - containerRect.top };
  });
}

export function buildZigzagRawPath(points: Point[]) {
  const rawPath = MotionPathPlugin.arrayToRawPath(points, { curviness: 1.3 });
  MotionPathPlugin.cacheRawPathMeasurements(rawPath);
  return rawPath;
}

/** Focus weight (0..1) for card i given continuous scroll progress 0..1 across `count` cards. */
export function focusWeight(progress: number, index: number, count: number): number {
  const activePos = progress * (count - 1);
  return Math.max(0, 1 - Math.abs(activePos - index));
}
