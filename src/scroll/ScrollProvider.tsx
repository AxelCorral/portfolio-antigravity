import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { consumeReturnPosition } from "./returnPosition";

/** Smooth (Lenis + scrub) only kicks in for motion-safe desktop — mobile and
 *  reduced-motion always get plain native scroll, per the build's fallback rule. */
export const SMOOTH_QUERY = "(prefers-reduced-motion: no-preference) and (min-width: 768px)";

const NAV_SECTIONS = ["hero", "projets", "deep", "stack", "about", "contact"] as const;

interface ScrollApi {
  smooth: boolean;
  activeSection: string;
  scrollToSection: (id: string) => void;
}

const ScrollCtx = createContext<ScrollApi | null>(null);

export function useScrollNav() {
  const ctx = useContext(ScrollCtx);
  if (!ctx) throw new Error("useScrollNav must be used within ScrollProvider");
  return ctx;
}

/**
 * One continuously scrolling document — no stepping, no overlays, no
 * hijack. This provider only does three things: (1) drives Lenis for a
 * buttery scroll feel on motion-safe desktop, native scroll everywhere else;
 * (2) tracks which top-level section is currently in view, for the side
 * markers; (3) offers a single smooth-scroll-to-section helper for Nav/Hero/
 * markers to share.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const [smooth, setSmooth] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const lenisRef = useRef<Lenis | null>(null);

  const scrollToSectionRef = useRef((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { duration: 1.3 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(SMOOTH_QUERY, () => {
      setSmooth(true);

      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const saved = consumeReturnPosition();
      if (saved) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => lenis.scrollTo(saved.scrollY, { immediate: true }));
        });
      }

      const triggers = NAV_SECTIONS.map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        return ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActiveSection(id);
          },
        });
      });

      return () => {
        triggers.forEach((t) => t?.kill());
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
        setSmooth(false);
      };
    });

    return () => mm.revert();
  }, []);

  useGSAP(() => {
    if (window.matchMedia(SMOOTH_QUERY).matches) return;
    const saved = consumeReturnPosition();
    if (saved) window.scrollTo(0, saved.scrollY);
  }, []);

  const api = useMemo<ScrollApi>(
    () => ({ smooth, activeSection, scrollToSection: (id: string) => scrollToSectionRef.current(id) }),
    [smooth, activeSection],
  );

  return <ScrollCtx.Provider value={api}>{children}</ScrollCtx.Provider>;
}
