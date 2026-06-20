import { SectionLabel } from "@/components/SectionLabel";
import { stackField } from "@/content/projects";
import { Reveal } from "@/scroll/Reveal";
import { RevealGroup } from "@/scroll/RevealGroup";

// Depth tiers: near (bigger, brighter) -> mid -> far (smaller, dimmer).
const depthClass = [
  "text-lg border-halo/50 bg-gradient-to-br from-[rgba(20,24,46,0.9)] to-[rgba(9,11,22,0.9)] text-ink shadow-[0_30px_70px_-24px_rgba(91,108,255,0.5)]",
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
      className="relative overflow-hidden px-6 py-20 sm:px-10 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div data-orb-anchor="stack">
            <SectionLabel index="04" label="Stack" className="mb-2" />
            <p className="m-0 mb-2.5 text-sm text-ink-muted">
              Champ gravitationnel — les outils flottent sur plusieurs plans de profondeur.
            </p>
          </div>
        </Reveal>

        <div className="relative mt-10 py-10">
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(91,108,255,0.16) 0%, rgba(155,107,255,0.06) 34%, transparent 60%)",
            }}
          />
          <RevealGroup className="flex flex-wrap items-center justify-center gap-4" stagger={0.04}>
            {stackField.map((tool, i) => (
              <span
                key={tool}
                className={`relative rounded-xl border px-4 py-2 font-mono ${depthFor(i)}`}
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
