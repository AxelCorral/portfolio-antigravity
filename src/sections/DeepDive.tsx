import { heroProject } from "@/content/projects";
import { Reveal } from "@/scroll/Reveal";

export function DeepDive() {
  return (
    <section
      id="deep"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-6 py-14 sm:px-10 lg:px-20"
    >
      <div
        className="pointer-events-none absolute top-1/2 left-[30%] h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(155,107,255,0.14) 0%, rgba(155,107,255,0) 60%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <Reveal className="mb-7.5 flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-center gap-3.5 font-mono text-xs tracking-[0.22em] text-ink-muted uppercase">
            <span className="text-[#5C6178]">[ 03 ]</span> Deep dive · projet ★
          </div>
          <h2
            data-orb-anchor="deep"
            className="m-0 font-display text-2xl leading-none font-semibold tracking-[-0.03em] text-ink"
          >
            {heroProject.title}
          </h2>
        </Reveal>

        {/* foreground video zone */}
        <div className="relative h-[clamp(220px,46vh,480px)] w-full overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-br from-deep to-[#070912] shadow-[0_70px_180px_-60px_rgba(155,107,255,0.5)]">
          <div className="absolute top-4 left-4 flex items-center gap-1.75 font-mono text-[10px] tracking-[0.16em] text-[rgba(159,176,255,0.85)] uppercase">
            <span className="h-1.75 w-1.75 rounded-full bg-[#E0625F] shadow-[0_0_9px_rgba(224,98,95,0.8)]" />
            Footage · tracking
          </div>
          <div className="absolute top-4 right-4 font-mono text-[10px] tracking-[0.14em] text-[rgba(138,144,168,0.85)] tabular-nums">
            1920×1080 · 30 fps
          </div>

          <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3.5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 shadow-[0_0_40px_rgba(91,108,255,0.3)]">
              <span className="ml-1 border-y-10 border-l-16 border-y-transparent border-l-white/85" />
            </div>
            <span className="max-w-[40ch] font-mono text-[11px] tracking-[0.2em] text-ink-muted uppercase">
              overlay YOLOv8 + ByteTrack · heatmaps · reconstruction terrain par homographie
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 bg-gradient-to-t from-void/92 to-transparent p-8">
            <p className="m-0 max-w-[48ch] text-md leading-relaxed text-ink">
              {heroProject.thesis}
            </p>
            <div className="flex items-end gap-3.5">
              <div className="text-right">
                <div className="font-mono text-3xl leading-[0.95] font-medium tracking-[-0.02em] text-ink tabular-nums">
                  {heroProject.chiffreCle}
                </div>
                <div className="mt-1.5 max-w-[22ch] text-[12.5px] text-ink-muted">
                  {heroProject.chiffreCleLabel}
                </div>
              </div>
              {heroProject.placeholder && (
                <span className="mb-1.5 inline-flex flex-none items-center gap-1.5 rounded-full border border-white/[0.14] px-2 py-1 font-mono text-[9.5px] tracking-[0.16em] text-ink-muted uppercase">
                  <span className="h-1.25 w-1.25 rounded-full bg-ink-muted" />
                  Fictif
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6.5 flex flex-wrap items-center justify-between gap-5">
          <div className="flex flex-wrap gap-1.75">
            {heroProject.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/10 px-2.25 py-1 font-mono text-[11px] text-ink-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
