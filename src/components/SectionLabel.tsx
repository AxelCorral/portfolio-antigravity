interface SectionLabelProps {
  index: string;
  label: string;
  className?: string;
}

export function SectionLabel({ index, label, className = "" }: SectionLabelProps) {
  return (
    <div
      className={`flex items-center gap-3.5 font-mono text-xs tracking-[0.22em] text-ink-muted uppercase ${className}`}
    >
      <span className="text-[#5C6178]">[ {index} ]</span>
      {label}
      <span className="h-px flex-1 bg-gradient-to-r from-ink-muted/25 to-transparent" />
    </div>
  );
}
