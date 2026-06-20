import gsap from "gsap";

interface RevealOptions {
  stagger?: number;
}

/**
 * Entry reveal driven by gsap.matchMedia: animates in under
 * `no-preference`, snaps straight to the visible end-state under
 * `reduce` — so reduced-motion users never see a transform.
 */
export function createReveal(
  targets: gsap.TweenTarget,
  trigger: Element,
  { stagger = 0 }: RevealOptions = {},
) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.set(targets, { opacity: 0, y: 24 });

    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "ease-float",
      stagger,
      scrollTrigger: {
        trigger,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(targets, { opacity: 1, y: 0 });
  });

  return mm;
}
