import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Slide } from "@/data/projects/football-pipeline";
import { CoverSlide, StepSlide } from "./CarouselSlides";

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <line x1="1.5" y1="1.5" x2="10.5" y2="10.5" />
      <line x1="10.5" y1="1.5" x2="1.5" y2="10.5" />
    </svg>
  );
}

interface CarouselModalProps {
  slides: readonly Slide[];
  projectId: string;
  label: string;
  initialCurrent: number;
  onClose: () => void;
  onCurrentChange: (idx: number) => void;
}

export function CarouselModal({
  slides,
  projectId,
  label,
  initialCurrent,
  onClose,
  onCurrentChange,
}: CarouselModalProps) {
  const [current, setCurrent] = useState(initialCurrent);
  const frameRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isAnimating = useRef(false);
  const total = slides.length;

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Body scroll lock */
  useEffect(() => {
    const saved = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = saved;
    };
  }, []);

  /* Focus close button on open */
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  /* Escape closes */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  /* GSAP init — show initialCurrent slide, hide all others */
  useGSAP(
    () => {
      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, {
          opacity: i === initialCurrent ? 1 : 0,
          visibility: i === initialCurrent ? "visible" : "hidden",
          x: 0,
        });
      });
    },
    { scope: frameRef, dependencies: [] },
  );

  const animateTo = useCallback(
    (nextIdx: number, dir: 1 | -1) => {
      if (isAnimating.current || nextIdx === current) return;
      const exitEl = slideRefs.current[current];
      const enterEl = slideRefs.current[nextIdx];

      if (!exitEl || !enterEl) {
        setCurrent(nextIdx);
        onCurrentChange(nextIdx);
        return;
      }

      isAnimating.current = true;
      const dx = dir * 24;

      gsap.set(enterEl, { opacity: 0, x: prefersReduced ? 0 : dx, visibility: "visible" });

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
        tl.to(exitEl, { opacity: 0, x: -dx * 0.55, duration: 0.22, ease: "ease-fall" }, 0);
        tl.to(enterEl, { opacity: 1, x: 0, duration: 0.36, ease: "ease-float" }, 0.1);
        tl.set(exitEl, { visibility: "hidden", x: 0 });
      }

      setCurrent(nextIdx);
      onCurrentChange(nextIdx);
    },
    [current, prefersReduced, onCurrentChange],
  );

  const next = useCallback(
    () => animateTo((current + 1) % total, 1),
    [current, total, animateTo],
  );
  const prev = useCallback(
    () => animateTo((current - 1 + total) % total, -1),
    [current, total, animateTo],
  );
  const goTo = useCallback(
    (idx: number) => animateTo(idx, idx > current ? 1 : -1),
    [current, animateTo],
  );

  /* Arrow key navigation — global while modal is open */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [next, prev]);

  /* Focus trap */
  const trapFocus = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const frame = frameRef.current;
    if (!frame) return;
    const focusables = Array.from(
      frame.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  const watermark = String(parseInt(projectId, 10) || 1).padStart(2, "0");
  const counter = `${String(current + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  const isStep = slides[current].kind === "step";

  return createPortal(
    <div
      className="pc-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={frameRef}
        className="pc-modal-frame"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onKeyDown={trapFocus}
      >
        {/* Close button — reuses .pc-expand style */}
        <button
          ref={closeBtnRef}
          type="button"
          className="pc-expand"
          aria-label="Close expanded view"
          onClick={onClose}
        >
          <CloseIcon />
        </button>

        {/* Carousel fills frame via .pc layout — close button floats above */}
        <div className="pc">
        <div
          className={`pc-watermark${isStep ? " pc-watermark--dim" : ""}`}
          aria-hidden="true"
        >
          {watermark}
        </div>

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
              aria-label={`${i + 1} of ${total}${slide.label ? `: ${slide.label}` : ""}`}
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

        <nav className="pc-nav" aria-label="Slide navigation">
          <span className="pc-counter" aria-live="polite" aria-atomic="true">
            {counter}
          </span>
          <div
            className="pc-dots"
            role="tablist"
            aria-label="Go to slide"
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
                aria-label={slide.label ?? `Slide ${i + 1}`}
                className="pc-dot"
                tabIndex={i === current ? 0 : -1}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <div className="pc-arrows">
            <button type="button" className="pc-arrow" onClick={prev} aria-label="Previous slide">
              ‹
            </button>
            <button type="button" className="pc-arrow" onClick={next} aria-label="Next slide">
              ›
            </button>
          </div>
        </nav>
        </div>{/* end .pc */}
      </div>
    </div>,
    document.body,
  );
}
