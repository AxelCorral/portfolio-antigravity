import { HeroField } from "@/components/HeroField";
import { useScrollNav } from "@/scroll/ScrollProvider";

export function Hero() {
  const { scrollToSection } = useScrollNav();

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection("projets");
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-16 text-center sm:px-10 lg:px-20"
    >
      <div
        className="pointer-events-none absolute top-[32%] left-1/2 h-[1200px] w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(91,108,255,0.22) 0%, rgba(155,107,255,0.10) 26%, rgba(91,108,255,0) 58%)",
        }}
      />
      <div
        className="pointer-events-none absolute top-[58%] left-[62%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(155,107,255,0.16) 0%, rgba(155,107,255,0) 62%)",
        }}
      />

      <div className="pointer-events-none absolute top-1/2 left-1/2 z-1 -translate-x-1/2 -translate-y-[52%]">
        <HeroField />
      </div>

      <div className="relative z-2 flex max-w-4xl flex-col items-center gap-5">
        <span className="font-mono text-[12.5px] tracking-[0.34em] text-ink-muted uppercase">
          Axel Corral — Portfolio 2026
        </span>
        <h1
          data-orb-anchor="hero"
          className="m-0 max-w-[15ch] text-pretty font-display text-[clamp(34px,5.2vw,76px)] leading-[1.02] font-semibold tracking-[-0.03em] text-ink"
        >
          Je transforme des flux de données brutes en{" "}
          <span className="text-[#9FB0FF]">systèmes qui bougent.</span>
        </h1>
        <p className="m-0 max-w-[46ch] text-md leading-relaxed text-ink-muted">
          Le mouvement est la démo&nbsp;: la donnée lévite, se réorganise, se rejoue. Vision par
          ordinateur, modern data stack, produit déployé.
        </p>
        <a
          href="#projets"
          onClick={handleCtaClick}
          className="mt-1 inline-flex items-center gap-3 rounded-full bg-ember px-7.5 py-3.5 font-sans text-base font-semibold text-[#0B0A06] no-underline shadow-[0_18px_50px_-16px_rgba(242,182,90,0.6)]"
        >
          Voir le travail <span className="font-mono text-[13px]">→</span>
        </a>
      </div>

      <div className="absolute bottom-8.5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2.5">
        <span className="font-mono text-[10.5px] tracking-[0.3em] text-ink-muted uppercase">
          Défiler
        </span>
        <span className="h-11.5 w-px bg-gradient-to-b from-ink-muted/60 to-transparent" />
      </div>
    </section>
  );
}
