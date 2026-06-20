import gsap from "gsap";
import { Flip } from "gsap/Flip";

export function getCarouselCardEls(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>("#carousel-stage [data-card-index]"));
}

interface Slot {
  x: number;
  scale: number;
  opacity: number;
  blur: number;
  z: number;
}

/**
 * offset = cardIndex - activeIndex. 0 = front-center. Positive = not-yet-seen,
 * stacked to the right. Negative = already-seen, stacked tighter to the left
 * ("comme si le manège avait tourné").
 */
function slotFor(offset: number): Slot {
  if (offset === 0) return { x: 0, scale: 1, opacity: 1, blur: 0, z: 10 };

  const dir = offset > 0 ? 1 : -1;
  const abs = Math.min(Math.abs(offset), 3);
  const scale = abs === 1 ? 0.72 : 0.6;
  const opacity = abs === 1 ? 0.5 : 0.32;
  const blur = abs === 1 ? 1.5 : 3;
  const baseSpacing = dir > 0 ? 230 : 165;
  const step = dir > 0 ? 165 : 95; // left stack is tighter ("empilé")
  const x = dir * (baseSpacing + (abs - 1) * step);

  return { x, scale, opacity, blur, z: 10 - abs };
}

function applySlot(el: HTMLElement, slot: Slot, animate: boolean, onComplete?: () => void) {
  const vars = {
    x: slot.x,
    scale: slot.scale,
    opacity: slot.opacity,
    filter: slot.blur > 0 ? `blur(${slot.blur}px)` : "blur(0px)",
    zIndex: slot.z,
  };

  if (!animate) {
    gsap.set(el, vars);
    onComplete?.();
    return;
  }

  gsap.to(el, { ...vars, duration: 0.8, ease: "ease-float", onComplete });
}

/** Lays out every card relative to activeIndex. Used for plain rotation (no detail involved). */
export function layoutCarousel(cardEls: HTMLElement[], activeIndex: number, animate: boolean, onDone?: () => void) {
  if (cardEls.length === 0) {
    onDone?.();
    return;
  }
  let remaining = cardEls.length;
  const done = () => {
    remaining--;
    if (remaining <= 0) onDone?.();
  };
  cardEls.forEach((el, i) => applySlot(el, slotFor(i - activeIndex), animate, done));
}

function detailExtraEl(cardEl: HTMLElement) {
  return cardEl.querySelector<HTMLElement>(".carousel-card-detail-extra");
}

function dimSiblings(cardEls: HTMLElement[], activeIndex: number, dim: boolean, duration: number) {
  cardEls.forEach((el, i) => {
    if (i === activeIndex) return;
    gsap.to(el, {
      opacity: dim ? 0.12 : slotFor(i - activeIndex).opacity,
      filter: dim ? "blur(5px)" : `blur(${slotFor(i - activeIndex).blur}px)`,
      duration,
      ease: "ease-float",
    });
  });
}

/** Pn-focus → Pn-detail: the active card Flips from its slot into a fullscreen panel. */
export function openDetail(cardEls: HTMLElement[], activeIndex: number, onDone: () => void) {
  const cardEl = cardEls[activeIndex];
  if (!cardEl) {
    onDone();
    return;
  }

  const state = Flip.getState(cardEl, { props: "borderRadius" });
  cardEl.classList.add("is-detail");
  detailExtraEl(cardEl)?.classList.add("is-visible");

  Flip.from(state, {
    duration: 0.8,
    ease: "back.out(1.6)",
    absolute: true,
    scale: true,
    onComplete: onDone,
  });

  const extra = detailExtraEl(cardEl);
  if (extra) {
    gsap.fromTo(extra, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, delay: 0.3, ease: "ease-float" });
  }

  dimSiblings(cardEls, activeIndex, true, 0.5);
}

/** Pn-detail → Pn-focus (step back up): closes the popup without rotating. */
export function closeDetailOnly(cardEls: HTMLElement[], activeIndex: number, onDone: () => void) {
  const cardEl = cardEls[activeIndex];
  if (!cardEl) {
    onDone();
    return;
  }

  const state = Flip.getState(cardEl, { props: "borderRadius" });
  cardEl.classList.remove("is-detail");
  detailExtraEl(cardEl)?.classList.remove("is-visible");
  gsap.set(cardEl, slotPropsFor(0));

  Flip.from(state, { duration: 0.7, ease: "ease-float", absolute: true, scale: true, onComplete: onDone });
  dimSiblings(cardEls, activeIndex, false, 0.5);
}

function slotPropsFor(offset: number) {
  const slot = slotFor(offset);
  return { x: slot.x, scale: slot.scale, opacity: slot.opacity, filter: `blur(${slot.blur}px)`, zIndex: slot.z };
}

/**
 * Pn-detail → P(n+1)-focus: ONE combined transition — the open card Flips back
 * down into its new (already-seen, back-left) slot while every other card
 * rotates to its new offset at the same time.
 */
export function closeDetailAndRotate(
  cardEls: HTMLElement[],
  activeIndex: number,
  nextActiveIndex: number,
  onDone: () => void,
) {
  const closingCard = cardEls[activeIndex];
  if (!closingCard) {
    layoutCarousel(cardEls, nextActiveIndex, true, onDone);
    return;
  }

  let remaining = cardEls.length;
  const done = () => {
    remaining--;
    if (remaining <= 0) onDone();
  };

  const state = Flip.getState(closingCard, { props: "borderRadius" });
  closingCard.classList.remove("is-detail");
  detailExtraEl(closingCard)?.classList.remove("is-visible");
  gsap.set(closingCard, slotPropsFor(activeIndex - nextActiveIndex));

  Flip.from(state, { duration: 0.8, ease: "ease-float", absolute: true, scale: true, onComplete: done });

  cardEls.forEach((el, i) => {
    if (i === activeIndex) return;
    applySlot(el, slotFor(i - nextActiveIndex), true, done);
  });
}

/** Instantly (no animation) snaps the whole carousel to match an arbitrary step — used on cross-section entry or jump. */
export function syncCarouselToStep(cardEls: HTMLElement[], cardIndex: number, phase: "focus" | "detail" | undefined) {
  cardEls.forEach((el, i) => {
    el.classList.remove("is-detail");
    detailExtraEl(el)?.classList.remove("is-visible");
    gsap.set(el, slotPropsFor(i - cardIndex));
  });

  if (phase === "detail") {
    const el = cardEls[cardIndex];
    if (el) {
      el.classList.add("is-detail");
      detailExtraEl(el)?.classList.add("is-visible");
      gsap.set(el, { x: 0, scale: 1, opacity: 1, filter: "blur(0px)", zIndex: 20 });
    }
  }
}

/** Used when navigating away from "projets" while a detail panel is open, so it doesn't stay stuck fullscreen. */
export function forceCloseDetailInstant(cardEls: HTMLElement[], activeIndex: number) {
  const el = cardEls[activeIndex];
  if (!el) return;
  el.classList.remove("is-detail");
  detailExtraEl(el)?.classList.remove("is-visible");
  gsap.set(el, slotPropsFor(0));
}
