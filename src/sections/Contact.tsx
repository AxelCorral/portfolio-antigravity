import { Reveal } from "@/scroll/Reveal";

const links = [
  { href: "mailto:axel.corral.pro@gmail.com", label: "Email ↗" },
  { href: "#", label: "LinkedIn ↗" },
  { href: "#", label: "GitHub · AxelCorral ↗" },
];

export function Contact() {
  return (
    <section
      id="contact"
      data-snap="contact"
      className="relative flex min-h-[80vh] flex-col justify-center overflow-hidden px-6 py-28 sm:px-10 lg:px-20"
    >
      <div
        className="pointer-events-none absolute top-[38%] left-[18%] h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(224,145,63,0.2) 0%, rgba(215,95,52,0.09) 28%, transparent 58%)",
        }}
      />

      <div className="relative z-2 mx-auto grid w-full max-w-7xl grid-cols-12 items-end gap-x-4 gap-y-10 sm:gap-x-6">
        <div className="col-span-12 sm:col-span-7">
          <span className="mb-5 block font-mono text-xs tracking-[0.3em] text-ink-muted uppercase">
            Contact
          </span>
          <Reveal>
            <h2
              data-orb-anchor="contact"
              className="m-0 max-w-[16ch] text-pretty font-display text-[clamp(34px,5.4vw,68px)] leading-[0.98] font-semibold tracking-[-0.03em] text-ink"
            >
              Construisons un système qui bouge.
            </h2>
          </Reveal>
        </div>

        <div className="col-span-12 flex flex-col items-start gap-4 font-mono text-base tracking-[0.04em] sm:col-span-5 sm:items-end sm:gap-5">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="border-b border-white/30 pb-0.75 text-ink no-underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="relative z-2 mt-20 flex flex-wrap items-center gap-4">
        <span className="font-mono text-[11px] tracking-[0.1em] text-ink-muted">
          © 2026 Axel Corral
        </span>
      </div>
    </section>
  );
}
