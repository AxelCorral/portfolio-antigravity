import { SectionLabel } from "@/components/SectionLabel";
import { stackField } from "@/content/projects";
import { Reveal } from "@/scroll/Reveal";
import { RevealGroup } from "@/scroll/RevealGroup";

// Depth tiers: near (bigger, brighter) -> mid -> far (smaller, dimmer).
const depthClass = [
  "text-lg border-halo/50 bg-gradient-to-br from-[rgba(33,24,17,0.9)] to-[rgba(14,11,7,0.9)] text-ink shadow-[0_30px_70px_-24px_rgba(224,145,63,0.5)]",
  "text-base border-white/14 bg-deep/70 text-ink",
  "text-sm border-white/12 bg-deep/65 text-ink",
  "text-xs border-white/8 bg-deep/50 text-ink-muted",
];

function depthFor(i: number) {
  if (i === 0) return depthClass[0];
  if (i < 5) return depthClass[1];
  if (i < 10) return depthClass[2];
  return depthClass[3];
}

export function Stack() {
  return (
    <section
      id="stack"
      data-snap="stack"
      className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-20"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-x-4 sm:gap-x-6">
        <Reveal className="col-span-12 sm:col-span-4 lg:col-span-3">
          <div data-orb-anchor="stack">
            <SectionLabel label="Stack" className="mb-3" />
            <p className="m-0 max-w-[28ch] text-sm text-ink-muted">
              Champ gravitationnel — les outils flottent sur plusieurs plans de profondeur.
            </p>
          </div>
        </Reveal>

        <div className="relative col-span-12 mt-10 py-6 sm:col-span-8 sm:mt-0 sm:py-10 lg:col-span-9">
          <div
            className="pointer-events-none absolute top-1/2 -left-24 h-[680px] w-[680px] -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(224,145,63,0.16) 0%, rgba(215,95,52,0.06) 34%, transparent 60%)",
            }}
          />
          <RevealGroup className="flex max-w-3xl flex-wrap items-center gap-4" stagger={0.04}>
            {stackField.map((tool, i) => (
              <span
                key={tool}
                className={`relative rounded-xl border px-4 py-2 font-mono ${i % 6 === 0 ? "mt-7" : ""} ${depthFor(i)}`}
              >
                {tool}
              </span>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
