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
      data-snap="hero"
      className="relative grid min-h-dvh grid-cols-12 content-center gap-x-4 overflow-hidden px-6 pt-32 pb-24 sm:gap-x-6 sm:px-10 lg:px-20"
    >
      <div
        className="pointer-events-none absolute top-[14%] right-[-12%] h-[1100px] w-[1100px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(224,145,63,0.22) 0%, rgba(215,95,52,0.10) 26%, rgba(224,145,63,0) 58%)",
        }}
      />
      <div
        className="pointer-events-none absolute top-[60%] right-[8%] h-[460px] w-[460px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(215,95,52,0.16) 0%, rgba(215,95,52,0) 62%)",
        }}
      />

      <div className="pointer-events-none absolute top-[10%] right-[-8%] z-1 hidden w-[56vw] max-w-[760px] opacity-60 lg:block">
        <HeroField />
      </div>

      <span className="col-span-12 font-mono text-[12.5px] tracking-[0.34em] text-ink-muted uppercase sm:col-span-5">
        Axel Corral — Portfolio 2026
      </span>

      <h1
        data-orb-anchor="hero"
        className="relative z-2 col-span-12 mt-7 max-w-[17ch] text-pretty font-display text-[clamp(42px,8.4vw,112px)] leading-[0.97] font-semibold tracking-[-0.03em] text-ink sm:col-span-10 lg:col-span-9"
      >
        Je transforme des flux de données brutes en{" "}
        <span className="text-halo">systèmes qui bougent.</span>
      </h1>

      <p className="relative z-2 col-span-12 mt-9 max-w-[42ch] text-md leading-relaxed text-ink-muted sm:col-span-6 sm:col-start-6 lg:col-start-7">
        Le mouvement est la démo&nbsp;: la donnée lévite, se réorganise, se rejoue. Vision par
        ordinateur, modern data stack, produit déployé.
      </p>

      <a
        href="#projets"
        onClick={handleCtaClick}
        className="relative z-2 col-span-12 mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-ember px-7.5 py-3.5 font-sans text-base font-semibold text-[#0B0A06] no-underline shadow-[0_18px_50px_-16px_rgba(242,182,90,0.6)] sm:col-start-6 lg:col-start-7"
      >
        Voir le travail <span className="font-mono text-[13px]">→</span>
      </a>

      <div className="absolute bottom-8.5 left-6 flex flex-col items-start gap-2.5 sm:left-10 lg:left-20">
        <span className="font-mono text-[10.5px] tracking-[0.3em] text-ink-muted uppercase">
          Défiler
        </span>
        <span className="h-11.5 w-px bg-gradient-to-b from-ink-muted/60 to-transparent" />
      </div>
    </section>
  );
}
