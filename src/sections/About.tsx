import { credibilite } from "@/content/projects";
import { Reveal } from "@/scroll/Reveal";
import { RevealGroup } from "@/scroll/RevealGroup";

export function About() {
  return (
    <section
      id="about"
      data-snap="about"
      className="relative bg-gradient-to-b from-void via-deep to-void px-6 py-28 sm:px-10 lg:px-20"
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 items-start gap-x-4 gap-y-12 sm:gap-x-6">
          <Reveal className="relative col-span-12 sm:col-span-7">
            <span
              aria-hidden="true"
              className="mb-6 block h-px w-16 bg-gradient-to-r from-halo/50 to-transparent"
            />
            <h2
              data-orb-anchor="about"
              className="m-0 mb-5.5 max-w-[18ch] text-pretty font-display text-2xl leading-[1.05] font-medium tracking-[-0.02em] text-ink"
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

          <div className="col-span-12 flex flex-col gap-5 sm:col-span-5 sm:col-start-8">
            <div className="font-mono text-[11px] tracking-[0.2em] text-ink-muted uppercase">
              Crédibilité entreprise
            </div>
            <RevealGroup className="flex flex-col gap-5" stagger={0.08}>
              {credibilite.map((item, i) => (
                <div
                  key={item.title}
                  className={`rounded-2xl p-6 ${
                    i === 0
                      ? "bg-gradient-to-br from-[rgba(224,145,63,0.16)] to-deep/80 shadow-[0_30px_70px_-30px_rgba(224,145,63,0.4)]"
                      : "bg-deep/40"
                  }`}
                >
                  {item.chiffre && (
                    <div className="mb-2 flex items-baseline gap-3.5">
                      <span className="font-mono text-[34px] font-medium tracking-[-0.02em] text-ink tabular-nums">
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
