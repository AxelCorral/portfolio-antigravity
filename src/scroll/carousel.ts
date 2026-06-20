import gsap from "gsap";

function normalizeAngle(a: number): number {
  let x = a % 360;
  if (x > 180) x -= 360;
  if (x < -180) x += 360;
  return x;
}

/** Centered placement angles — symmetric around 0 regardless of which index is active by default. */
export function fanAngles(count: number, fanDeg: number): number[] {
  return Array.from({ length: count }, (_, i) => (i - (count - 1) / 2) * fanDeg);
}

/**
 * Opacity/blur for a panel at a given angular distance from facing the
 * camera (0deg). Non-front panels stay clearly visible (not near-invisible)
 * per the recap's "you can see the whole wheel" requirement.
 */
function depthFor(absAngle: number) {
  const opacity = gsap.utils.clamp(0.35, 1, 1 - absAngle / 220);
  const blur = gsap.utils.clamp(0, 4, (absAngle / 180) * 4);
  return { opacity, filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "blur(0px)" };
}

function applyDepth(cardEls: HTMLElement[], baseAngles: number[], ringRotation: number) {
  cardEls.forEach((el, i) => {
    const eff = normalizeAngle(baseAngles[i] + ringRotation);
    gsap.set(el, depthFor(Math.abs(eff)));
  });
}

/** Rotates a preserve-3d ring so cardEls[activeIndex] faces the camera, given each card's fixed placement angle. */
export function rotateRing(
  ringEl: HTMLElement,
  cardEls: HTMLElement[],
  baseAngles: number[],
  activeIndex: number,
  animate: boolean,
  onDone?: () => void,
) {
  if (cardEls.length === 0) {
    onDone?.();
    return;
  }
  const target = -baseAngles[activeIndex];

  if (!animate) {
    gsap.set(ringEl, { rotationY: target });
    applyDepth(cardEls, baseAngles, target);
    onDone?.();
    return;
  }

  gsap.to(ringEl, {
    rotationY: target,
    duration: 0.7,
    ease: "ease-float",
    onUpdate: () => applyDepth(cardEls, baseAngles, Number(gsap.getProperty(ringEl, "rotationY"))),
    onComplete: onDone,
  });
}
