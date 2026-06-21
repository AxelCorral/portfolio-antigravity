interface SectionLabelProps {
  label: string;
  className?: string;
}

/** Mono label + trailing rule — the only "marker" a section gets. No numbering. */
export function SectionLabel({ label, className = "" }: SectionLabelProps) {
  return (
    <div
      className={`flex items-center gap-3.5 font-mono text-xs tracking-[0.22em] text-ink-muted uppercase ${className}`}
    >
      {label}
      <span className="h-px flex-1 bg-gradient-to-r from-ink-muted/25 to-transparent" />
    </div>
  );
}
