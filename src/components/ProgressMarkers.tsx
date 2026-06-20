import { useScrollNav } from "@/scroll/ScrollProvider";

const MARKERS = [
  { id: "hero", label: "Accueil" },
  { id: "projets", label: "Projets" },
  { id: "deep", label: "Deep dive" },
  { id: "stack", label: "Stack" },
  { id: "about", label: "À propos" },
  { id: "contact", label: "Contact" },
];

export function ProgressMarkers() {
  const { smooth, activeSection, scrollToSection } = useScrollNav();

  if (!smooth) return null;

  return (
    <nav
      aria-label="Navigation par section"
      className="fixed top-1/2 right-5 z-50 flex -translate-y-1/2 flex-col items-center gap-3.5 lg:right-8"
    >
      {MARKERS.map((marker) => {
        const isCurrent = marker.id === activeSection;
        return (
          <button
            key={marker.id}
            type="button"
            aria-label={`Aller à ${marker.label}`}
            aria-current={isCurrent ? "step" : undefined}
            onClick={() => scrollToSection(marker.id)}
            className={`h-2 w-2 rounded-full border transition-colors duration-200 ${
              isCurrent
                ? "border-halo bg-halo shadow-[0_0_10px_var(--halo)]"
                : "border-white/25 bg-transparent hover:border-white/50"
            }`}
          />
        );
      })}
    </nav>
  );
}
