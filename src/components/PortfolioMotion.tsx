import {
  motion,
  useInView,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

const pullEase = [0.16, 1, 0.3, 1] as const;

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
  const inView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  return (
    <span ref={ref} className="inline-flex flex-wrap">
      {words.map((word, index) => (
        <span className="overflow-visible pr-[0.21em]" key={`${word}-${index}`}>
          <motion.span
            className="relative inline-block"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: index * 0.08, ease: pullEase }}
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
  const inView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const words = segments.flatMap((segment) =>
    segment.text.split(" ").map((word) => ({ word, className: segment.className })),
  );

  return (
    <span
      ref={ref}
      className={`inline-flex flex-wrap ${align === "center" ? "justify-center" : "justify-start"}`}
    >
      {words.map(({ word, className }, index) => (
        <span className={`overflow-hidden pr-[0.25em] ${className ?? ""}`} key={`${word}-${index}`}>
          <motion.span
            className="inline-block"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: index * 0.08, ease: pullEase }}
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
  const progress = index / total;
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, progress - 0.1), Math.min(1, progress + 0.05)],
    [0.2, 1],
  );

  return <motion.span style={{ opacity }}>{character}</motion.span>;
}
