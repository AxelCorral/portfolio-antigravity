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
      className="relative flex min-h-[86vh] flex-col items-center justify-center overflow-hidden px-6 py-25 text-center max-md:snap-start motion-reduce:snap-start sm:px-10 lg:px-20"
    >
      <div
        className="pointer-events-none absolute top-[46%] left-1/2 h-[1100px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(91,108,255,0.2) 0%, rgba(155,107,255,0.09) 28%, transparent 58%)",
        }}
      />

      <div className="relative z-2 flex max-w-3xl flex-col items-center gap-7.5">
        <span className="font-mono text-xs tracking-[0.3em] text-ink-muted uppercase">
          [ 06 ] Contact
        </span>
        <Reveal>
          <h2
            data-orb-anchor="contact"
            className="m-0 max-w-[16ch] text-pretty font-display text-2xl leading-none font-semibold tracking-[-0.03em] text-ink"
          >
            Construisons un système qui bouge.
          </h2>
        </Reveal>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-5 font-mono text-base tracking-[0.04em] sm:gap-11">
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

      <div className="absolute inset-x-0 bottom-7.5 flex flex-wrap items-center justify-between gap-4 px-6 sm:px-10 lg:px-20">
        <span className="font-mono text-[11px] tracking-[0.1em] text-ink-muted">
          © 2026 Axel Corral
        </span>
      </div>
    </section>
  );
}
