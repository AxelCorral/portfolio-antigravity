import { useScrollNav } from "@/scroll/ScrollProvider";

const links = [
  { id: "projets", label: "Projets" },
  { id: "deep", label: "Deep dive" },
  { id: "stack", label: "Stack" },
  { id: "about", label: "À propos" },
];

export function Nav() {
  const { scrollToSection } = useScrollNav();

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/[0.06] bg-deep/50 px-6 py-4.5 backdrop-blur-xl sm:px-10 lg:px-20">
      <a
        href="#hero"
        onClick={(e) => handleClick(e, "hero")}
        className="flex items-center gap-3.5"
      >
        <span className="flex h-8.5 w-8.5 items-center justify-center rounded-[9px] border border-white/[0.22] font-display text-[15px] font-semibold tracking-[-0.02em] text-ink shadow-[inset_0_0_16px_rgba(91,108,255,0.18)]">
          AC
        </span>
        <span className="flex flex-col leading-tight">
          <span className="font-display text-[15px] font-semibold tracking-[0.01em] text-ink">
            Axel Corral
          </span>
          <span className="font-mono text-[10.5px] tracking-[0.18em] text-ink-muted uppercase">
            Data / ML Engineer
          </span>
        </span>
      </a>
      <div className="flex items-center gap-5 font-mono text-[12.5px] tracking-[0.06em] text-ink-muted sm:gap-7 lg:gap-9">
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => handleClick(e, link.id)}
            className="hidden hover:text-ink sm:inline"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={(e) => handleClick(e, "contact")}
          className="border-b border-white/35 pb-0.5 text-ink no-underline"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
