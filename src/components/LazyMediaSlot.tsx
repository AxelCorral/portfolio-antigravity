import { useEffect, useRef, useState } from "react";

/** Reserves aspect-ratio up front (zero CLS) and only "activates" once scrolled into view. */
export function LazyMediaSlot({ label, className = "" }: { label: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={`relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-[16px] transition-opacity duration-500 ${className}`}
      style={{
        opacity: inView ? 1 : 0.4,
        background:
          "radial-gradient(circle at 30% 20%, rgba(224,145,63,0.14) 0%, rgba(215,95,52,0.06) 38%, var(--surface) 72%)",
      }}
    >
      <span className="max-w-[34ch] px-4 text-center font-mono text-[11px] tracking-[0.14em] text-ink-muted/70 uppercase">
        {label}
      </span>
    </div>
  );
}
