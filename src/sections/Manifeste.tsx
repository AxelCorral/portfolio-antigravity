import { Reveal } from "@/scroll/Reveal";

export function Manifeste() {
  return (
    <section
      id="manifeste"
      className="relative mx-auto grid max-w-7xl grid-cols-12 items-start gap-x-4 px-6 py-24 sm:gap-x-6 sm:px-10 sm:py-32 lg:px-20"
    >
      <div className="col-span-5 flex h-full sm:col-span-3" aria-hidden="true">
        <span className="h-24 w-px bg-gradient-to-b from-halo/40 to-transparent" />
      </div>

      <Reveal className="col-span-12 sm:col-span-8 sm:col-start-5 lg:col-start-6">
        <p
          data-orb-anchor="manifeste"
          className="m-0 max-w-[34ch] text-pretty font-display text-lg leading-[1.14] font-medium tracking-[-0.02em] text-ink"
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
