import { SectionLabel } from "@/components/SectionLabel";
import { Reveal } from "@/scroll/Reveal";

export function Manifeste() {
  return (
    <section
      id="manifeste"
      className="relative mx-auto flex max-w-7xl flex-col items-start px-6 py-16 max-md:snap-start motion-reduce:snap-start sm:px-10 sm:py-20 lg:px-20 lg:py-24"
    >
      <SectionLabel index="01" label="Manifeste" className="mb-10" />
      <Reveal>
        <p
          data-orb-anchor="manifeste"
          className="m-0 max-w-[30ch] text-pretty font-display text-lg leading-[1.14] font-medium tracking-[-0.02em] text-ink"
        >
          <span className="text-ink-muted">
            De la vidéo brute aux événements de match jusqu'aux flux d'offres d'emploi —
          </span>{" "}
          je conçois les pipelines qui transforment le désordre en systèmes exploitables.
        </p>
      </Reveal>
      <span className="mt-10 inline-flex items-center gap-2.5 self-end font-mono text-[10.5px] tracking-[0.22em] text-ink-muted/70 uppercase">
        Vers le carrousel <span className="text-halo">↘</span>
      </span>
    </section>
  );
}
