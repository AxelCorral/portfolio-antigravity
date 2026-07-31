import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Slide } from "@/data/projects/football-pipeline";
import { useLanguage } from "@/i18n/language";
import { CoverSlide, StepSlide } from "./CarouselSlides";
import { CarouselModal } from "./CarouselModal";

function ExpandIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="7.5,1.5 10.5,1.5 10.5,4.5" />
      <polyline points="4.5,10.5 1.5,10.5 1.5,7.5" />
      <line x1="10.5" y1="1.5" x2="6.5" y2="5.5" />
      <line x1="1.5" y1="10.5" x2="5.5" y2="6.5" />
    </svg>
  );
}

export function ProjectCarousel({
  projectId,
  slides,
  label = "Project walkthrough",
}: {
  projectId: string;
  slides: readonly Slide[];
  label?: string;
}) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const expandBtnRef = useRef<HTMLButtonElement>(null);
  const isAnimating = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const modalCurrentRef = useRef(0);
  const total = slides.length;

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animateTo = useCallback(
    (nextIdx: number, dir: 1 | -1) => {
      if (isAnimating.current || nextIdx === current) return;
      const exitEl = slideRefs.current[current];
      const enterEl = slideRefs.current[nextIdx];

      if (!exitEl || !enterEl) {
        setCurrent(nextIdx);
        return;
      }

      isAnimating.current = true;
      const dx = dir * 18;

      gsap.set(enterEl, {
        opacity: 0,
        x: prefersReduced ? 0 : dx,
        visibility: "visible",
      });

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
        },
      });

      if (prefersReduced) {
        tl.to(exitEl, { opacity: 0, duration: 0.18 });
        tl.to(enterEl, { opacity: 1, duration: 0.18 }, "+=0.04");
        tl.set(exitEl, { visibility: "hidden" });
      } else {
        tl.to(
          exitEl,
          { opacity: 0, x: -dx * 0.55, duration: 0.22, ease: "ease-fall" },
          0,
        );
        tl.to(
          enterEl,
          { opacity: 1, x: 0, duration: 0.36, ease: "ease-float" },
          0.1,
        );
        tl.set(exitEl, { visibility: "hidden", x: 0 });
      }

      setCurrent(nextIdx);
    },
    [current, prefersReduced],
  );

  const goTo = useCallback(
    (idx: number) => animateTo(idx, idx > current ? 1 : -1),
    [current, animateTo],
  );
  const next = useCallback(
    () => animateTo((current + 1) % total, 1),
    [current, total, animateTo],
  );
  const prev = useCallback(
    () => animateTo((current - 1 + total) % total, -1),
    [current, total, animateTo],
  );

  /* Arrow keys only when the wrapper itself is focused */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target !== el) return;
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [next, prev]);

  /* GSAP init — all hidden except first */
  useGSAP(
    () => {
      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, {
          opacity: i === 0 ? 1 : 0,
          visibility: i === 0 ? "visible" : "hidden",
          x: 0,
        });
      });
    },
    { scope: wrapRef, dependencies: [] },
  );

  /* Touch swipe */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 44) (dx < 0 ? next : prev)();
    touchStartX.current = null;
  };

  /* Expand modal handlers */
  const openModal = useCallback(() => {
    modalCurrentRef.current = current;
    setExpanded(true);
  }, [current]);

  const closeModal = useCallback(() => {
    const finalCurrent = modalCurrentRef.current;
    setExpanded(false);
    /* Sync inline carousel to wherever the modal landed */
    setCurrent(finalCurrent);
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        opacity: i === finalCurrent ? 1 : 0,
        visibility: i === finalCurrent ? "visible" : "hidden",
        x: 0,
      });
    });
    expandBtnRef.current?.focus();
  }, []);

  const handleModalCurrentChange = useCallback((idx: number) => {
    modalCurrentRef.current = idx;
  }, []);

  const watermark = String(parseInt(projectId, 10) || 1).padStart(2, "0");
  const counter = `${String(current + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  const isStep = slides[current].kind === "step";

  return (
    <>
      <div
        ref={wrapRef}
        className="pc"
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Expand button */}
        <button
          ref={expandBtnRef}
          type="button"
          className="pc-expand"
          aria-label={t.carousel.expandFullScreen}
          aria-haspopup="dialog"
          onClick={openModal}
        >
          <ExpandIcon />
        </button>

        {/* Watermark — hidden on step slides */}
        <div
          className={`pc-watermark${isStep ? " pc-watermark--dim" : ""}`}
          aria-hidden="true"
        >
          {watermark}
        </div>

        {/* Slides */}
        <div className="pc-viewport">
          {slides.map((slide, i) => (
            <div
              key={i}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className="pc-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} ${t.carousel.ofWord} ${total}${slide.label ? `: ${slide.label}` : ""}`}
              aria-hidden={i !== current}
            >
              {slide.kind === "cover" ? (
                <CoverSlide slide={slide} />
              ) : (
                <StepSlide slide={slide} />
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <nav className="pc-nav" aria-label={t.carousel.slideNavigation}>
          <span className="pc-counter" aria-live="polite" aria-atomic="true">
            {counter}
          </span>

          <div
            className="pc-dots"
            role="tablist"
            aria-label={t.carousel.goToSlide}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") { e.preventDefault(); next(); }
              if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
            }}
          >
            {slides.map((slide, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={slide.label ?? `${t.carousel.slideWord} ${i + 1}`}
                className="pc-dot"
                tabIndex={i === current ? 0 : -1}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          <div className="pc-arrows">
            <button
              type="button"
              className="pc-arrow"
              onClick={prev}
              aria-label={t.carousel.previousSlide}
            >
              ‹
            </button>
            <button
              type="button"
              className="pc-arrow"
              onClick={next}
              aria-label={t.carousel.nextSlide}
            >
              ›
            </button>
          </div>
        </nav>
      </div>

      {expanded && (
        <CarouselModal
          slides={slides}
          projectId={projectId}
          label={label}
          initialCurrent={current}
          onClose={closeModal}
          onCurrentChange={handleModalCurrentChange}
        />
      )}
    </>
  );
}
