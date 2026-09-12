import {
  motion,
  useInView,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

const pullEase = [0.16, 1, 0.3, 1] as const;

/**
 * Opacity floor for scroll-revealed body copy.
 *
 * A reveal may dim text, never hide it: the not-yet-revealed state is what the
 * reader actually stares at while the paragraph sits mid-screen, so it has to
 * clear WCAG AA on its own. Measured on `.about-card` (text rgb(222,219,200)
 * over #101010, 16px body): 0.2 = 1.64:1, 0.5 = 4.16:1, 0.55 = 4.78:1,
 * 0.58 = 5.2:1. 0.58 is the value already used for `.language-toggle-btn`
 * (cycle 002) for the same reason — keep the two in step.
 */
export const REVEAL_FLOOR_OPACITY = 0.58;

/**
 * Longest a word cascade may take to hand over its last word, in seconds.
 *
 * Both reveals below used to delay word `i` by `i * 0.045s` with no ceiling, so
 * the duration of a headline was a function of how long its sentence was. The
 * `#about` title is 26 words: its last words reached full paint 2194ms (1440)
 * to 2325ms (390) after the block entered the reading band, and spent 365ms to
 * 622ms *on screen at 1:1* — not dimmed, absent, while already occupying their
 * place. The `#capabilities` title, 5 words through the same component, the
 * same easing and the same taste: 1263ms and 56ms. Only the word count differed
 * (cycle 022 audit C-2).
 *
 * With a window, the cascade reads the same on a short headline — 5 words still
 * step at the full 0.045s — and stops growing on a long one.
 */
const CASCADE_WINDOW = 0.45;
const CASCADE_STEP = 0.045;

/** Per-word delay step for a cascade of `count` words. */
export function cascadeStep(count: number) {
  return Math.min(CASCADE_STEP, CASCADE_WINDOW / Math.max(1, count - 1));
}

export function CharacterLines({ lines }: { lines: string[] }) {
  const reduceMotion = useReducedMotion();
  let characterIndex = 0;

  return (
    <>
      {lines.map((line) => (
        <span className="block" aria-hidden="true" key={line}>
          {line.split(" ").map((word, wordIndex, words) => (
            <span className="inline-block whitespace-nowrap" key={`${word}-${wordIndex}`}>
              {Array.from(word).map((character) => {
                const index = characterIndex++;
                return (
                  <motion.span
                    className="inline-block"
                    key={`${character}-${index}`}
                    initial={reduceMotion ? false : { opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.2 + index * 0.03,
                      duration: 0.5,
                      ease: pullEase,
                    }}
                  >
                    {character}
                  </motion.span>
                );
              })}
              {wordIndex < words.length - 1 ? (
                <>
                  <motion.span
                    className="inline-block"
                    initial={reduceMotion ? false : { opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.2 + characterIndex++ * 0.03,
                      duration: 0.5,
                      ease: pullEase,
                    }}
                  >
                    {"\u00A0"}
                  </motion.span>
                  <wbr />
                </>
              ) : null}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

export function WordsPullUp({
  text,
  showAsterisk = false,
}: {
  text: string;
  showAsterisk?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px 240px 0px" });
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");
  const step = cascadeStep(words.length);

  return (
    <span ref={ref} className="inline-flex flex-wrap">
      {words.map((word, index) => (
        <span className="overflow-visible pr-[0.21em]" key={`${word}-${index}`}>
          <motion.span
            className="relative inline-block"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.55, delay: index * step, ease: pullEase }}
          >
            {word}
            {showAsterisk && index === words.length - 1 ? (
              <span
                className="absolute -right-[0.3em] top-[0.65em] text-[0.31em]"
                aria-hidden="true"
              >
                *
              </span>
            ) : null}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

type Segment = {
  text: string;
  className?: string;
};

export function WordsPullUpMultiStyle({
  segments,
  align = "center",
}: {
  segments: Segment[];
  align?: "left" | "center";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px 240px 0px" });
  const reduceMotion = useReducedMotion();
  const words = segments.flatMap((segment) =>
    segment.text.split(" ").map((word) => ({ word, className: segment.className })),
  );
  const step = cascadeStep(words.length);

  return (
    <span
      ref={ref}
      className={`inline-flex flex-wrap ${align === "center" ? "justify-center" : "justify-start"}`}
    >
      {words.map(({ word, className }, index) => (
        // `overflow-visible`, like its twin `WordsPullUp` above — not
        // `overflow-hidden`. The mask was there to hide a 20px rise inside a
        // box 71 to 79px tall, where a word displaced by 20px stays three
        // quarters visible: it never curtained anything. What it did do was cut
        // the type. These word boxes are flex items, so they are blockified and
        // `overflow` applies for real, and their height is the line box —
        // `line-height: 0.98` on `.about-title`, `0.92` on the section headings,
        // both shorter than the ink they hold (75px roman, *81px* serif italic,
        // 87px at 86.4px). Measured at 1440 and 390, EN and FR: 31 to 36 clipped
        // boxes, i.e. every word of both headlines, and a masked/unmasked pixel
        // diff of 2424px at delta 207/255 landing exactly on the descenders of
        // *profile*, *shaped*, *by*, *experience*, *pipelines*, *reporting*,
        // *clarity*. Permanent, not transient — and identical under
        // `prefers-reduced-motion: reduce`, where no rise ever happens (cycle
        // 022 audit C-1).
        <span className={`overflow-visible pr-[0.25em] ${className ?? ""}`} key={`${word}-${index}`}>
          <motion.span
            className="inline-block"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.55, delay: index * step, ease: pullEase }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function AnimatedLetter({
  character,
  index,
  total,
  scrollYProgress,
}: {
  character: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();
  const progress = index / total;
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, progress - 0.1), Math.min(1, progress + 0.05)],
    [REVEAL_FLOOR_OPACITY, 1],
  );

  if (reduceMotion) {
    return <span>{character}</span>;
  }

  return <motion.span style={{ opacity }}>{character}</motion.span>;
}
