const KEY = "antigravity:return";

export interface ReturnPosition {
  scrollY: number;
}

// Cached after the first read so repeated calls between a save and its
// eventual restoration (StrictMode double-invokes effects in dev) keep
// returning the same result, instead of a later call finding the
// sessionStorage entry already cleared by an earlier one. Reset on every
// new save so each round-trip gets a fresh read.
let cache: ReturnPosition | null | undefined;

/** Recorded right before navigating "/" -> a deep-dive route, so coming back restores it. */
export function saveReturnPosition() {
  cache = undefined;
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ scrollY: window.scrollY }));
  } catch {
    // sessionStorage unavailable (privacy mode etc) — restoration is best-effort.
  }
}

/** Read-once per page load: returns the saved position (if any) and clears storage. */
export function consumeReturnPosition(): ReturnPosition | null {
  if (cache !== undefined) return cache;
  try {
    const raw = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    cache = raw ? (JSON.parse(raw) as ReturnPosition) : null;
  } catch {
    cache = null;
  }
  return cache;
}
