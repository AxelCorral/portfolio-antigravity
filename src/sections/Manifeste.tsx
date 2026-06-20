import { Reveal } from "@/scroll/Reveal";

export function Manifeste() {
  return (
    <section
      id="manifeste"
      className="relative mx-auto flex max-w-7xl flex-col items-start px-6 py-16 sm:px-10 sm:py-20 lg:px-20"
    >
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
    </section>
  );
}
