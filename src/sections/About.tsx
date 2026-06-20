import { SectionLabel } from "@/components/SectionLabel";
import { credibilite } from "@/content/projects";
import { Reveal } from "@/scroll/Reveal";
import { RevealGroup } from "@/scroll/RevealGroup";

export function About() {
  return (
    <section
      id="about"
      className="relative bg-gradient-to-b from-void via-deep to-void px-6 py-20 sm:px-10 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <SectionLabel index="05" label="À propos" className="mb-12" />
        <div className="grid items-start gap-10 sm:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] lg:gap-22.5">
          <Reveal>
            <h2
              data-orb-anchor="about"
              className="m-0 mb-5.5 max-w-[22ch] text-pretty font-display text-xl leading-[1.12] font-medium tracking-[-0.02em] text-ink"
            >
              Du notebook à la production.
            </h2>
            <p className="m-0 max-w-[52ch] text-base leading-relaxed text-ink-muted">
              Data / ML Engineer. Je conçois des pipelines qui transforment de la donnée
              brute — vidéo, événements, flux d'offres — en systèmes exploitables et
              déployés. De la vision par ordinateur au modern data stack, ce qui
              m'intéresse, c'est le passage à l'échelle réelle.
            </p>
          </Reveal>

          <div className="flex flex-col gap-4.5">
            <div className="font-mono text-[11px] tracking-[0.2em] text-ink-muted uppercase">
              Crédibilité entreprise
            </div>
            <RevealGroup className="flex flex-col gap-4.5" stagger={0.08}>
              {credibilite.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/[0.08] bg-deep/60 p-6"
                >
                  {item.chiffre && (
                    <div className="mb-2 flex items-baseline gap-3.5">
                      <span className="font-mono text-[30px] font-medium tracking-[-0.02em] text-ink tabular-nums">
                        {item.chiffre}
                      </span>
                      <span className="rounded-full border border-[rgba(127,200,169,0.28)] px-2 py-1 font-mono text-[10px] tracking-[0.16em] text-[#7FC8A9] uppercase">
                        {item.chiffreLabel}
                      </span>
                    </div>
                  )}
                  <div className="mb-1.5 font-display text-[18px] font-semibold text-ink">
                    {item.title}
                  </div>
                  <p className="m-0 text-[13.5px] leading-relaxed text-ink-muted">
                    {item.description}
                  </p>
                </div>
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
