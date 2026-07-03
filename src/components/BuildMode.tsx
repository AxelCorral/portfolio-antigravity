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
import avatarHead from "../../profil_3D.png";

const thoughtBubbles = [
  {
    id: "builder",
    label: "I build what I need",
    eyebrow: "Builder reflex",
    title: "Tools usually start with a real need.",
    body:
      "I like turning recurring needs into tools: apps, automations, bots or small systems that make daily life clearer.",
    points: [
      "JobTrackr started from a real job-search need.",
      "Personal automations and AI-assisted workflows follow the same reflex.",
      "When I need a tool, I try to build it.",
    ],
    position: { x: 28, y: 18 },
  },
  {
    id: "football",
    label: "Football brain",
    eyebrow: "Football & data",
    title: "Football is a playground for uncertainty.",
    body:
      "Football is one of my natural playgrounds for data: form, momentum, trajectories, decisions, uncertainty and emotion.",
    points: [
      "It connects naturally to analysis, scouting and storytelling.",
      "The professional portfolio includes a football-pipeline project built around this interest.",
    ],
    link: {
      label: "See football-pipeline",
      href: "https://github.com/AxelCorral/football-pipeline",
    },
    position: { x: 12, y: 34 },
  },
  {
    id: "ai",
    label: "AI playground",
    eyebrow: "AI experiments",
    title: "AI is a creative and technical accelerator.",
    body:
      "I use AI as a practical accelerator: prompts, visual concepts, video experiments, automation loops, Codex-style building and iterative product improvement.",
    points: [
      "The point is not hype; it is faster learning and sharper iteration.",
      "AI helps me prototype, critique, polish and ship with tighter loops.",
    ],
    position: { x: 58, y: 12 },
  },
  {
    id: "systems",
    label: "Systems curiosity",
    eyebrow: "Systems curiosity",
    title: "I am drawn to systems that shape decisions.",
    body:
      "I am interested in systems that shape real decisions: markets, incentives, public decisions, organizations, sport and data-driven tools.",
    points: [
      "I like connecting data with real-world constraints.",
      "The angle stays analytical, neutral and non-partisan.",
    ],
    position: { x: 78, y: 28 },
  },
  {
    id: "visual",
    label: "Visual instinct",
    eyebrow: "Creative direction",
    title: "How it feels matters as much as how it works.",
    body:
      "I care about how things feel, not only how they work. A useful data product should be clear, readable and visually intentional.",
    points: [
      "Dark graphite, cream highlights and cinematic motion are part of the portfolio language.",
      "Good visual hierarchy makes complex systems easier to trust.",
    ],
    position: { x: 82, y: 52 },
  },
  {
    id: "learning",
    label: "Learning by building",
    eyebrow: "Self-learning",
    title: "Make the idea real, then improve it.",
    body:
      "I learn by building, testing, breaking, correcting and shipping. The method is simple: make the idea real, then improve it.",
    points: [
      "Curiosity becomes useful when it turns into something testable.",
      "Iteration is where the idea gets sharper.",
    ],
    position: { x: 20, y: 64 },
  },
  {
    id: "digital",
    label: "First link to tech",
    eyebrow: "Digital doorway",
    title: "Digital worlds were an early doorway.",
    body:
      "Before data projects, there was curiosity for digital worlds. Not an identity, more like an early doorway into systems, interfaces and logic.",
    points: [
      "Interfaces, rules and feedback loops made technology feel tangible.",
      "That curiosity now shows up in tools, dashboards and visual systems.",
    ],
    position: { x: 42, y: 6 },
  },
];

const personalSignals = [
  "football analysis",
  "3D avatar",
  "interface design",
  "open learning",
  "Toulouse",
  "systems thinking",
  "portfolio craft",
  "personal projects",
];

type ThoughtBubble = (typeof thoughtBubbles)[number];

function ThoughtMap({
  activeThought,
  setActiveThought,
  reduceMotion,
}: {
  activeThought: ThoughtBubble | null;
  setActiveThought: (thought: ThoughtBubble | null) => void;
  reduceMotion: boolean | null;
}) {
  return (
    <div className="thought-map" aria-label="Personal thoughts around Axel">
      <div className="thought-map-lines" aria-hidden="true" />
      {thoughtBubbles.map((thought, index) => (
        <motion.button
          className="thought-bubble"
          type="button"
          key={thought.id}
          style={{
            left: `${thought.position.x}%`,
            top: `${thought.position.y}%`,
          }}
          aria-expanded={activeThought?.id === thought.id}
          aria-label={`Open thought: ${thought.label}`}
          onClick={() => setActiveThought(activeThought?.id === thought.id ? null : thought)}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.72 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45 + index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span />
          <strong>{thought.label}</strong>
        </motion.button>
      ))}

      <AnimatePresence>
        {activeThought ? (
          <motion.aside
            className="thought-panel"
            key={activeThought.id}
            initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.24 }}
            aria-live="polite"
          >
            <button
              className="thought-panel-close"
              type="button"
              onClick={() => setActiveThought(null)}
              aria-label={`Close ${activeThought.label}`}
            >
              <X size={15} aria-hidden="true" />
            </button>
            <p>{activeThought.eyebrow}</p>
            <h3>{activeThought.title}</h3>
            <span>{activeThought.body}</span>
            <ul>
              {activeThought.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            {activeThought.link ? (
              <a href={activeThought.link.href} target="_blank" rel="noreferrer">
                {activeThought.link.label}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            ) : null}
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function MobileThoughtList({
  activeThought,
  setActiveThought,
}: {
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
  activeThought,
  setActiveThought,
  reduceMotion,
}: {
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
          AXEL CORRAL — PERSONAL LAYER
        </motion.p>
        <motion.h2
          id="build-mode-title"
          className="build-mode-title"
          initial={reduceMotion ? false : { opacity: 0, y: 52 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          Personal layer
        </motion.h2>
        <motion.p
          className="build-hero-subtitle"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          The part behind the projects: curiosity, tools, football, AI experiments and systems I build for myself.
        </motion.p>
        <motion.span
          className="thought-hint"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.55 }}
        >
          Move around to reveal what sits behind the work.
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
          activeThought={activeThought}
          setActiveThought={setActiveThought}
          reduceMotion={reduceMotion}
        />
      </div>

      <a className="build-scroll-cue" href="#personal-universe">
        More signals
        <ArrowDown size={16} aria-hidden="true" />
      </a>
    </section>
  );
}

function SkillsMarquee({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <motion.div
      className="build-marquee"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      aria-label={`Personal signals: ${personalSignals.join(", ")}`}
    >
      <div className="build-marquee-track" aria-hidden="true">
        {[...personalSignals, ...personalSignals].map((signal, index) => (
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
  const closeRef = useRef<HTMLButtonElement>(null);
  const [activeThought, setActiveThought] = useState<ThoughtBubble | null>(thoughtBubbles[0]);
  const reduceMotion = useReducedMotion();

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
                aria-label="Close personal layer"
              >
                Close
                <X size={17} aria-hidden="true" />
              </button>
            </Magnet>
          </div>

          <div className="build-mode-inner">
            <BuildModeHero
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
                <p>Behind the work / personal universe</p>
                <h3 id="personal-universe-title">Signals beneath the surface.</h3>
                <span>
                  The bubbles above are the primary experience. This fallback keeps the same thoughts readable on touch screens and slower browsing moments.
                </span>
              </div>

              <MobileThoughtList
                activeThought={activeThought}
                setActiveThought={setActiveThought}
              />
            </section>

            <SkillsMarquee reduceMotion={reduceMotion} />

            <section className="personal-layer-close" aria-label="Personal layer closing actions">
              <p>
                This layer is personal, but it points back to the same professional promise:
                useful systems, fast learning and clear interfaces.
              </p>
              <div>
                <button type="button" onClick={onClose}>
                  Back to professional work
                </button>
                <a href="#contact" onClick={onClose}>
                  Contact
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
