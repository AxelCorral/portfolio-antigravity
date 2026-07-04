import { ArrowRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Magnet } from "@/components/Magnet";
import { CharacterLines, WordsPullUp } from "@/components/PortfolioMotion";
import { useLanguage } from "@/i18n/language";

const CITY_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";
const CLIFF_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4";

/**
 * Single pinned intro: city (state A) crossfades directly into the cliff
 * scene (state B) over one scroll-scrubbed range. Nav stays mounted and
 * visible throughout — only the background and the state-specific content
 * swap, so there is no "naked" mid-step and no city/cliff ping-pong.
 */
export function CinematicOpening({ onOpenBuildMode }: { onOpenBuildMode: () => void }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollRangeRef = useRef(1);
  const scrollYProgress = useMotionValue(0);

  useLayoutEffect(() => {
    function measure() {
      if (!ref.current) return;
      scrollRangeRef.current = Math.max(1, ref.current.offsetHeight - window.innerHeight);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    function update(value: number) {
      scrollYProgress.set(Math.min(1, Math.max(0, value / scrollRangeRef.current)));
    }
    update(scrollY.get());
    return scrollY.on("change", update);
  }, [scrollY, scrollYProgress]);

  const cityOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const cityScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const cliffOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const cliffScale = useTransform(scrollYProgress, [0.2, 1], [1.06, 1]);

  const contentAOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const contentAY = useTransform(scrollYProgress, [0, 0.3], [0, -28]);

  const contentBOpacity = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);

  const promptOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // Pointer events are a discrete on/off switch, not a tweened value — driven
  // by plain state so they don't get bundled into the same animated style
  // object as the continuous opacity crossfade above.
  const [stateBActive, setStateBActive] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setStateBActive(value > 0.3);
  });

  return (
    <section ref={ref} className="intro-sequence" id="opening" aria-label="Intro">
      <div className="intro-sticky">
        <motion.div
          className="intro-bg-layer"
          style={reduceMotion ? { opacity: 0 } : { opacity: cityOpacity, scale: cityScale }}
        >
          <video
            className="intro-bg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src={CITY_VIDEO} type="video/mp4" />
          </video>
        </motion.div>
        <motion.div
          className="intro-bg-layer"
          style={reduceMotion ? { opacity: 1 } : { opacity: cliffOpacity, scale: cliffScale }}
        >
          <video
            className="intro-bg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src={CLIFF_VIDEO} type="video/mp4" />
          </video>
        </motion.div>
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-35 mix-blend-overlay" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />

        <header className="city-header">
          <nav className="liquid-glass city-nav" aria-label={t.nav.aria}>
            <a className="city-logo" href="#opening" aria-label={t.nav.top}>
              AXEL
            </a>
            <div className="city-nav-links">
              <a href="#profile">{t.nav.profile}</a>
              <a href="#selected-work">{t.nav.projects}</a>
              <a href="#capabilities">{t.nav.skills}</a>
              <a href="#about">{t.nav.experience}</a>
              <a href="/cv-axel-corral.pdf" target="_blank" rel="noopener noreferrer">
                {t.nav.cv}
              </a>
            </div>
            <a className="city-contact" href="#contact">
              {t.nav.contact}
            </a>
          </nav>
        </header>

        <motion.button
          className="creator-hotspot"
          type="button"
          style={{
            ...(reduceMotion ? { opacity: 1 } : { opacity: cliffOpacity }),
            pointerEvents: stateBActive ? "auto" : "none",
          }}
          onClick={onOpenBuildMode}
          aria-label={t.hero.openPersonalLayer}
        >
          <span>{t.hero.personalLayer}</span>
        </motion.button>

        <motion.div
          className="city-content"
          style={
            reduceMotion
              ? { display: "none" }
              : {
                  opacity: contentAOpacity,
                  y: contentAY,
                  pointerEvents: stateBActive ? "none" : "auto",
                }
          }
        >
          <div className="max-w-3xl">
            <p className="mb-5 text-xs uppercase tracking-[0.18em] text-primary/75">
              {t.hero.introLabel}
            </p>
            <p className="city-heading" aria-label={t.hero.cityAria}>
              <CharacterLines lines={[...t.hero.cityLines]} />
            </p>
            <p className="mb-5 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
              {t.hero.cityText}
            </p>
            <div className="flex flex-wrap gap-3">
              <Magnet>
                <a className="opening-primary" href="#selected-work">
                  {t.hero.viewProjects}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </Magnet>
              <Magnet>
                <a className="liquid-glass opening-secondary" href="#selected-work">
                  {t.hero.viewSelectedWork}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </Magnet>
            </div>
          </div>

          <p className="liquid-glass city-tag">
            {t.hero.tag}
          </p>
        </motion.div>

        <motion.div
          id="profile"
          className="hero-content"
          style={
            reduceMotion
              ? undefined
              : { opacity: contentBOpacity, pointerEvents: stateBActive ? "auto" : "none" }
          }
        >
          <div className="hero-title-column">
            <p className="mb-5 text-xs tracking-[0.08em] text-primary/70 sm:text-sm">
              {t.hero.role}
            </p>
            <h1 id="hero-title" className="hero-title">
              <WordsPullUp text="Axel Corral" showAsterisk />
            </h1>
          </div>

          <div className="hero-intro">
            <p className="max-w-md text-sm leading-[1.35] text-primary/70 md:text-base">
              {t.hero.profileText}
            </p>
            <div className="hero-proof-strip" aria-label="Profile highlights">
              {t.hero.proof.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <Magnet>
                <a className="primary-cta group" href="#selected-work">
                  <span>{t.hero.viewSelectedWork}</span>
                  <span className="cta-icon">
                    <ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                </a>
              </Magnet>
              <button className="build-mode-trigger" type="button" onClick={onOpenBuildMode}>{t.hero.personalLayer}</button>
              <div className="flex gap-4 text-xs text-primary/60">
                <a className="subtle-link" href="/cv-axel-corral.pdf" target="_blank" rel="noopener noreferrer">
                  {t.hero.viewCV}
                </a>
                <a className="subtle-link" href="/cv-axel-corral.pdf" download="cv-axel-corral.pdf">
                  {t.hero.downloadCV}
                </a>
                <a className="subtle-link" href="https://github.com/AxelCorral" target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a className="subtle-link" href="#contact">{t.nav.contact}</a>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          className="transition-prompt"
          style={{ opacity: reduceMotion ? 0 : promptOpacity }}
        >
          {t.hero.scrollPrompt}
        </motion.p>
      </div>
    </section>
  );
}
