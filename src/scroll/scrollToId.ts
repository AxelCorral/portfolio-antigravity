/**
 * Scrolling to an in-page target, resolved from its **flow** position.
 *
 * Why this is not just `el.scrollIntoView()`: the project slides are a sticky
 * stack (`.home-project-step`, `top` 88/116/144px, rising `z-index`, from
 * `min-width: 1024px`). Chromium reports the *shifted* box of a sticky element,
 * so once the reader has scrolled past the stack all three slides report the
 * same position. Measured at 1440 (cycle 023 audit, D-1):
 *
 *   scroll 0      offsetTop = 0 / 736 / 1472   <- the real flow positions
 *   scroll 4500   offsetTop = 1472 / 1472 / 1472
 *   scroll 5918   offsetTop = 1472 / 1472 / 1472
 *
 * Every fragment jump resolved from that box therefore lands on the same place
 * and shows whichever slide has the highest `z-index`. The consequence was not a
 * navigation detail: `#capabilities` is titled "Capabilities / evidence", and
 * its "See Football Data Pipeline" link delivered Retirement Sustainability
 * Model on every desktop width, in both languages — 5 of 8 viewport x language
 * combinations wrong.
 */

/**
 * Document-space top of `el` as it sits in flow, ignoring any sticky shift.
 *
 * Neutralising `position` for one synchronous read gives the flow box back.
 * Nothing is painted in between — the value is read and the inline style
 * restored inside the same task — and a sticky element occupies the same flow
 * space as a static one, so no sibling moves.
 */
export function flowTop(el: HTMLElement) {
  const inline = el.style.position;
  el.style.position = "static";
  const top = el.getBoundingClientRect().top + window.scrollY;
  el.style.position = inline;
  return top;
}

/** The offset a sticky target parks at, so we land it where it is designed to sit. */
export function stickyOffset(el: HTMLElement) {
  const cs = getComputedStyle(el);
  if (cs.position !== "sticky") return 0;
  const top = parseFloat(cs.top);
  return Number.isNaN(top) ? 0 : top;
}

/** Document-space scroll position that puts `el` where the design parks it. */
export function scrollTargetFor(el: HTMLElement) {
  return Math.max(0, Math.round(flowTop(el) - stickyOffset(el)));
}

/**
 * Scroll to the element carrying `id`. Returns false when there is no such
 * element, so callers can fall back to the browser's own behaviour rather than
 * swallowing the navigation.
 *
 * Motion: this uses native scrolling, which honours `scroll-behavior` — and
 * `index.css` already sets that to `auto` under `prefers-reduced-motion:
 * reduce`. Readers who asked for no motion keep getting an instant jump, with
 * no second rule to keep in sync.
 */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  window.scrollTo({ top: scrollTargetFor(el) });
  return true;
}
