import gsap from "gsap";
import { Flip } from "gsap/Flip";

/**
 * Ordered by `data-card-index`, not DOM position — once a card is reparented
 * out of the ring for the hover-detail expand (see openHoverDetail), it's no
 * longer in its original tree position, so querySelectorAll order alone
 * would silently desync from the logical index.
 */
export function getCarouselCardEls(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>("#carousel-stage [data-card-index]")).sort(
    (a, b) => Number(a.dataset.cardIndex) - Number(b.dataset.cardIndex),
  );
}

function getRingEl(): HTMLElement | null {
  return document.getElementById("carousel-ring");
}

function getStageEl(): HTMLElement | null {
  return document.getElementById("carousel-stage");
}

function getCellEl(index: number): HTMLElement | null {
  return document.getElementById(`cylinder-cell-${index}`);
}

export function angleStep(count: number): number {
  return 360 / Math.max(count, 1);
}

function normalizeAngle(a: number): number {
  let x = a % 360;
  if (x > 180) x -= 360;
  if (x < -180) x += 360;
  return x;
}

/** Opacity/blur for a card at a given angular distance from facing the camera (0deg). */
function depthFor(absAngle: number) {
  const opacity = gsap.utils.clamp(0.1, 1, 1 - absAngle / 130);
  const blur = gsap.utils.clamp(0, 6, (absAngle / 180) * 6);
  return { opacity, filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "blur(0px)" };
}

function applyDepth(cardEls: HTMLElement[], ringRotation: number, skipIndex: number | null) {
  const step = angleStep(cardEls.length);
  cardEls.forEach((el, i) => {
    if (i === skipIndex) return;
    const eff = normalizeAngle(i * step + ringRotation);
    gsap.set(el, depthFor(Math.abs(eff)));
  });
}

function tweenDepth(cardEls: HTMLElement[], ringRotation: number, skipIndex: number | null, duration: number) {
  const step = angleStep(cardEls.length);
  cardEls.forEach((el, i) => {
    if (i === skipIndex) return;
    const eff = normalizeAngle(i * step + ringRotation);
    gsap.to(el, { ...depthFor(Math.abs(eff)), duration, ease: "ease-float" });
  });
}

/** Rotates the cylinder so cardEls[activeIndex] faces the camera. One step = one 90deg (360/N) turn. */
export function rotateCylinder(activeIndex: number, animate: boolean, onDone?: () => void) {
  const ring = getRingEl();
  const cardEls = getCarouselCardEls();
  if (!ring || cardEls.length === 0) {
    onDone?.();
    return;
  }
  const step = angleStep(cardEls.length);
  const target = -activeIndex * step;

  if (!animate) {
    gsap.set(ring, { rotationY: target });
    applyDepth(cardEls, target, null);
    onDone?.();
    return;
  }

  gsap.to(ring, {
    rotationY: target,
    duration: 0.9,
    ease: "ease-float",
    onUpdate: () => applyDepth(cardEls, Number(gsap.getProperty(ring, "rotationY")), null),
    onComplete: onDone,
  });
}

function detailExtraEl(cardEl: HTMLElement) {
  return cardEl.querySelector<HTMLElement>(".carousel-card-detail-extra");
}

let openIndex: number | null = null;

export function isHoverDetailOpen(): boolean {
  return openIndex !== null;
}

/**
 * Hover/tap detail expansion — independent of the scroll step sequence. The
 * card is physically moved out of the rotating 3D ring (a sibling of it,
 * inside the non-rotated stage) before expanding, so its fullscreen layout
 * isn't subject to the ring's rotateY/perspective ancestry; Flip handles the
 * reparent seamlessly.
 */
export function openHoverDetail(index: number, onDone?: () => void) {
  if (openIndex !== null) {
    onDone?.();
    return;
  }
  const cardEls = getCarouselCardEls();
  const cardEl = cardEls[index];
  const stage = getStageEl();
  if (!cardEl || !stage) {
    onDone?.();
    return;
  }

  openIndex = index;
  const state = Flip.getState(cardEl, { props: "borderRadius" });
  stage.appendChild(cardEl);
  cardEl.classList.add("is-detail");
  detailExtraEl(cardEl)?.classList.add("is-visible");

  Flip.from(state, { duration: 0.55, ease: "back.out(1.4)", absolute: true, scale: true, onComplete: onDone });

  const extra = detailExtraEl(cardEl);
  if (extra) {
    gsap.fromTo(extra, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, delay: 0.18, ease: "ease-float" });
  }

  const ring = getRingEl();
  const rotation = ring ? Number(gsap.getProperty(ring, "rotationY")) : 0;
  tweenDepth(cardEls, rotation, index, 0.35);
  gsap.to(cardEls.filter((_, i) => i !== index), { opacity: 0.06, filter: "blur(6px)", duration: 0.35, ease: "ease-float" });
}

export function closeHoverDetail(animate: boolean, onDone?: () => void) {
  if (openIndex === null) {
    onDone?.();
    return;
  }
  const index = openIndex;
  const cardEls = getCarouselCardEls();
  const cardEl = cardEls[index];
  const cell = getCellEl(index);
  openIndex = null;

  if (!cardEl || !cell) {
    onDone?.();
    return;
  }

  const state = animate ? Flip.getState(cardEl, { props: "borderRadius" }) : null;
  cell.appendChild(cardEl);
  cardEl.classList.remove("is-detail");
  detailExtraEl(cardEl)?.classList.remove("is-visible");

  const ring = getRingEl();
  const rotation = ring ? Number(gsap.getProperty(ring, "rotationY")) : 0;

  if (state && animate) {
    Flip.from(state, { duration: 0.45, ease: "ease-float", absolute: true, scale: true, onComplete: onDone });
    tweenDepth(cardEls, rotation, null, 0.45);
  } else {
    applyDepth(cardEls, rotation, null);
    onDone?.();
  }
}

/** Instantly collapses whichever card is expanded — used when navigating away from "projets". */
export function forceCloseHoverDetail() {
  if (openIndex === null) return;
  closeHoverDetail(false);
}
