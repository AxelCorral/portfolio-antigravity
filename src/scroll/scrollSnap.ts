import gsap from "gsap";
import type Lenis from "lenis";

/**
 * Idle-triggered snap, never a scroll hijack: free scroll is completely
 * untouched while the user is actively scrolling. Only once input has been
 * quiet for IDLE_MS AND Lenis has actually come to rest (velocity ~0, not
 * mid-inertia) do we look for the nearest [data-snap] anchor — and only in
 * the direction the user was last travelling, never behind. If that anchor
 * is within DEAD_ZONE of the viewport top, we glide to it; otherwise
 * (mid-section) we leave scroll alone entirely.
 *
 * Tunables — safe to adjust by feel:
 */
export const IDLE_MS = 220;
export const DEAD_ZONE = 0.18; // fraction of viewport height
export const SNAP_DURATION = 0.6; // seconds
export const COOLDOWN_MS = 500;

/** Small fixed tolerance (px) for snapping to the boundary just crossed, never further behind. */
const BEHIND_TOLERANCE_PX = 24;
const VELOCITY_EPS = 0.02;
const MAX_REST_POLL_FRAMES = 40; // ~666ms at 60fps safety cap

export function attachScrollSnap(lenis: Lenis): () => void {
  let idleTimer: number | null = null;
  let cooldownUntil = 0;
  let lastDirection: 1 | -1 = 1;
  let snapping = false;
  let inputGeneration = 0;
  let restPollId: number | null = null;

  const easeFloat = gsap.parseEase("ease-float");

  const onLenisScroll = () => {
    if (lenis.direction !== 0) lastDirection = lenis.direction;
  };
  lenis.on("scroll", onLenisScroll);

  const clearIdleTimer = () => {
    if (idleTimer !== null) {
      window.clearTimeout(idleTimer);
      idleTimer = null;
    }
  };

  const clearRestPoll = () => {
    if (restPollId !== null) {
      cancelAnimationFrame(restPollId);
      restPollId = null;
    }
  };

  const pickTarget = (): HTMLElement | null => {
    const anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-snap]"));
    if (anchors.length === 0) return null;

    const viewportH = window.innerHeight;
    const deadZonePx = viewportH * DEAD_ZONE;

    let best: HTMLElement | null = null;
    let bestDist = Infinity;

    for (const el of anchors) {
      const top = el.getBoundingClientRect().top;

      // Hard direction rule: never target a boundary behind the travel
      // direction, beyond a small "just crossed it" tolerance.
      const allowed =
        lastDirection === 1 ? top > -BEHIND_TOLERANCE_PX : top < BEHIND_TOLERANCE_PX;
      if (!allowed) continue;

      const dist = Math.abs(top);
      if (dist < bestDist) {
        bestDist = dist;
        best = el;
      }
    }

    if (!best || bestDist >= deadZonePx) return null;
    return best;
  };

  const runSnap = () => {
    const target = pickTarget();
    if (!target) return;

    snapping = true;
    cooldownUntil = performance.now() + COOLDOWN_MS;
    lenis.scrollTo(target, {
      duration: SNAP_DURATION,
      easing: easeFloat,
      onComplete: () => {
        snapping = false;
        cooldownUntil = performance.now() + COOLDOWN_MS;
      },
    });
  };

  const waitForRest = (gen: number, framesLeft: number) => {
    if (gen !== inputGeneration) return; // superseded by newer input
    if (Math.abs(lenis.velocity) > VELOCITY_EPS && framesLeft > 0) {
      restPollId = requestAnimationFrame(() => waitForRest(gen, framesLeft - 1));
      return;
    }
    restPollId = null;
    runSnap();
  };

  const attemptSnap = () => {
    if (performance.now() < cooldownUntil) return;
    clearRestPoll();
    waitForRest(inputGeneration, MAX_REST_POLL_FRAMES);
  };

  const scheduleSnap = () => {
    clearIdleTimer();
    idleTimer = window.setTimeout(attemptSnap, IDLE_MS);
  };

  const onUserScroll = () => {
    inputGeneration++;
    clearRestPoll();
    if (snapping) {
      // Input always wins: freeze the glide exactly where it is, instantly,
      // then give scroll a clean cooldown window before any new snap check —
      // this is what breaks the "stuck oscillating" loop.
      snapping = false;
      lenis.scrollTo(lenis.animatedScroll, { immediate: true });
      cooldownUntil = performance.now() + COOLDOWN_MS;
    }
    scheduleSnap();
  };

  const NAV_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);
  const onKeyDown = (e: KeyboardEvent) => {
    if (NAV_KEYS.has(e.key)) onUserScroll();
  };

  window.addEventListener("wheel", onUserScroll, { passive: true });
  window.addEventListener("touchmove", onUserScroll, { passive: true });
  window.addEventListener("keydown", onKeyDown);

  return () => {
    clearIdleTimer();
    clearRestPoll();
    lenis.off("scroll", onLenisScroll);
    window.removeEventListener("wheel", onUserScroll);
    window.removeEventListener("touchmove", onUserScroll);
    window.removeEventListener("keydown", onKeyDown);
  };
}
