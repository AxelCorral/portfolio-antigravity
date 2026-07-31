import { ArrowDown, ArrowUpRight, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { Magnet } from "@/components/Magnet";
import { useLanguage } from "@/i18n/language";
import avatarHead from "../../profil_3D.png";

// 5 hotspots (reduced from an earlier 7 — see redesign notes): positions
// are % coordinates within .thought-map, which now spans the full portrait
// stage. Each sits in genuine negative space around the avatar (top
// corners, left gap by the jaw, lower corners on the jacket) rather than
// scattered across the hair. Text content lives in the i18n translations
// (t.buildMode.bubbles) — this table only holds the non-translatable
// layout/link data, keyed by bubble id.
const bubbleLayout: Record<string, { position: { x: number; y: number }; href?: string }> = {
  builder: { position: { x: 9, y: 7 } },
  ai: { position: { x: 89, y: 9 } },
  football: {
    position: { x: 4, y: 46 },
    href: "https://github.com/AxelCorral/football-pipeline",
  },
  visual: { position: { x: 16, y: 88 } },
  systems: { position: { x: 87, y: 84 } },
};

type ThoughtBubble = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  points: readonly string[];
  position: { x: number; y: number };
  link?: { label: string; href: string };
};

function ThoughtMap({
  thoughtBubbles,
  mapAriaLabel,
  activeThought,
  setActiveThought,
  reduceMotion,
}: {
  thoughtBubbles: ThoughtBubble[];
  mapAriaLabel: string;
  activeThought: ThoughtBubble | null;
  setActiveThought: (thought: ThoughtBubble | null) => void;
  reduceMotion: boolean | null;
}) {
  const mapRef = useRef<HTMLDivElement>(null);

  // Touch/click-opened cards close on a tap outside any hotspot — mouse
  // hover and keyboard focus are handled separately, in CSS.
  useEffect(() => {
    if (!activeThought) return;
    function handlePointerDown(event: PointerEvent) {
      if (mapRef.current && !mapRef.current.contains(event.target as Node)) {
        setActiveThought(null);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [activeThought, setActiveThought]);

  return (
    <div className="thought-map" aria-label={mapAriaLabel} ref={mapRef}>
      <div className="thought-map-lines" aria-hidden="true" />
      {thoughtBubbles.map((thought, index) => {
        const isOpen = activeThought?.id === thought.id;
        // Cards always open toward the center of the scene so they never
        // spill past the stage edge, regardless of which corner the dot sits in.
        const openRight = thought.position.x < 50;
        const openDown = thought.position.y < 40;

        return (
          <div
            className="thought-node"
            key={thought.id}
            style={{ left: `${thought.position.x}%`, top: `${thought.position.y}%` }}
          >
            <motion.button
              className="thought-bubble"
              type="button"
              aria-expanded={isOpen}
              aria-label={`${thought.label} — ${thought.title}`}
              onClick={() => setActiveThought(isOpen ? null : thought)}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 + index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="thought-dot" aria-hidden="true" />
            </motion.button>

            <div
              className="thought-card"
              data-open={isOpen ? "true" : undefined}
              style={{
                ...(openRight ? { left: "26px" } : { right: "26px" }),
                ...(openDown ? { top: "-10px" } : { bottom: "-10px" }),
              }}
            >
              <p className="thought-card-kicker">{thought.eyebrow}</p>
              <h3>{thought.title}</h3>
              <p className="thought-card-body">{thought.body}</p>
              <ul>
                {thought.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              {thought.link ? (
                <a href={thought.link.href} target="_blank" rel="noreferrer">
                  {thought.link.label}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MobileThoughtList({
  thoughtBubbles,
  activeThought,
  setActiveThought,
}: {
  thoughtBubbles: ThoughtBubble[];
  activeThought: ThoughtBubble | null;
  setActiveThought: (thought: ThoughtBubble | null) => void;
}) {
  return (
    <div className="mobile-thought-list">
      {thoughtBubbles.map((thought) => {
        const open = activeThought?.id === thought.id;
        return (
          <article className="mobile-thought-card" key={thought.id}>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setActiveThought(open ? null : thought)}
            >
              <span>{thought.eyebrow}</span>
              <strong>{thought.label}</strong>
            </button>
            {open ? (
              <div>
                <h3>{thought.title}</h3>
                <p>{thought.body}</p>
                {thought.link ? (
                  <a href={thought.link.href} target="_blank" rel="noreferrer">
                    {thought.link.label}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function BuildModeHero({
  thoughtBubbles,
  copy,
  activeThought,
  setActiveThought,
  reduceMotion,
}: {
  thoughtBubbles: ThoughtBubble[];
  copy: {
    kicker: string;
    title: string;
    subtitle: string;
    hint: string;
    mapAriaLabel: string;
    moreSignals: string;
  };
  activeThought: ThoughtBubble | null;
  setActiveThought: (thought: ThoughtBubble | null) => void;
  reduceMotion: boolean | null;
}) {
  return (
    <section className="build-hero" aria-labelledby="build-mode-title">
      <div className="build-hero-orbits" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="build-hero-copy">
        <motion.p
          className="build-kicker"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.6 }}
        >
          {copy.kicker}
        </motion.p>
        <motion.h2
          id="build-mode-title"
          className="build-mode-title"
          initial={reduceMotion ? false : { opacity: 0, y: 52 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          {copy.title}
        </motion.h2>
        <motion.p
          className="build-hero-subtitle"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          {copy.subtitle}
        </motion.p>
        <motion.span
          className="thought-hint"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.55 }}
        >
          {copy.hint}
        </motion.span>
      </div>

      <div className="build-portrait-stage">
        <motion.div
          className="build-portrait-motion"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.88, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="build-portrait-halo" aria-hidden="true" />
          <Magnet
            className="build-portrait-magnet"
            disabled={Boolean(reduceMotion)}
            strength={18}
          >
            <img
              className="build-portrait"
              src={avatarHead}
              alt="Stylized 3D avatar head of Axel Corral"
            />
          </Magnet>
        </motion.div>

        <ThoughtMap
          thoughtBubbles={thoughtBubbles}
          mapAriaLabel={copy.mapAriaLabel}
          activeThought={activeThought}
          setActiveThought={setActiveThought}
          reduceMotion={reduceMotion}
        />
      </div>

      <a className="build-scroll-cue" href="#personal-universe">
        {copy.moreSignals}
        <ArrowDown size={16} aria-hidden="true" />
      </a>
    </section>
  );
}

function SkillsMarquee({
  signals,
  ariaLabel,
  reduceMotion,
}: {
  signals: readonly string[];
  ariaLabel: string;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.div
      className="build-marquee"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      aria-label={ariaLabel}
    >
      <div className="build-marquee-track" aria-hidden="true">
        {[...signals, ...signals].map((signal, index) => (
          <span className="build-skill" key={`${signal}-${index}`}>
            {signal}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function BuildMode({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [activeThought, setActiveThought] = useState<ThoughtBubble | null>(null);
  const reduceMotion = useReducedMotion();

  const thoughtBubbles: ThoughtBubble[] = t.buildMode.bubbles.map((bubble) => ({
    id: bubble.id,
    label: bubble.label,
    eyebrow: bubble.eyebrow,
    title: bubble.title,
    body: bubble.body,
    points: bubble.points,
    position: bubbleLayout[bubble.id].position,
    link: bubble.linkLabel
      ? { label: bubble.linkLabel, href: bubbleLayout[bubble.id].href! }
      : undefined,
  }));

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (activeThought) {
        setActiveThought(null);
        return;
      }
      onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeThought, open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="build-mode"
          role="dialog"
          aria-modal="true"
          aria-labelledby="build-mode-title"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="build-depth" aria-hidden="true">
            <div className="build-orb build-orb-one" />
            <div className="build-orb build-orb-two" />
            <div className="build-wireframe">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="build-mode-noise noise-overlay" aria-hidden="true" />

          <div className="build-close-fixed">
            <Magnet disabled={Boolean(reduceMotion)} strength={7}>
              <button
                ref={closeRef}
                className="build-close"
                type="button"
                onClick={onClose}
                aria-label={t.buildMode.closeAriaLabel}
              >
                {t.buildMode.closeLabel}
                <X size={17} aria-hidden="true" />
              </button>
            </Magnet>
          </div>

          <div className="build-mode-inner">
            <BuildModeHero
              thoughtBubbles={thoughtBubbles}
              copy={{
                kicker: t.buildMode.kicker,
                title: t.buildMode.title,
                subtitle: t.buildMode.subtitle,
                hint: t.buildMode.hint,
                mapAriaLabel: t.buildMode.mapAriaLabel,
                moreSignals: t.buildMode.moreSignals,
              }}
              activeThought={activeThought}
              setActiveThought={setActiveThought}
              reduceMotion={reduceMotion}
            />

            <section
              className="build-capabilities-section"
              id="personal-universe"
              aria-labelledby="personal-universe-title"
            >
              <div className="build-section-heading">
                <p>{t.buildMode.sectionKicker}</p>
                <h3 id="personal-universe-title">{t.buildMode.sectionTitle}</h3>
                <span>{t.buildMode.sectionSubtitle}</span>
              </div>

              <MobileThoughtList
                thoughtBubbles={thoughtBubbles}
                activeThought={activeThought}
                setActiveThought={setActiveThought}
              />
            </section>

            <SkillsMarquee
              signals={t.buildMode.signals}
              ariaLabel={`${t.buildMode.signalsAriaPrefix}: ${t.buildMode.signals.join(", ")}`}
              reduceMotion={reduceMotion}
            />

            <section className="personal-layer-close" aria-label={t.buildMode.closingAriaLabel}>
              <p>{t.buildMode.closingText}</p>
              <div>
                <button type="button" onClick={onClose}>
                  {t.buildMode.backToWork}
                </button>
                <a href="#contact" onClick={onClose}>
                  {t.nav.contact}
                </a>
                <a href="https://github.com/AxelCorral" target="_blank" rel="noreferrer">
                  GitHub
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </section>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
