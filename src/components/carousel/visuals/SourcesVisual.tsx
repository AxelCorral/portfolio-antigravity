const AMBER = "#e0913f";
const INK = "#f1eade";
const MUTED = "rgba(241,234,222,0.42)";
const BORDER = "rgba(241,234,222,0.12)";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

function SourceBadge({ label, sub, accent }: { label: string; sub: string; accent?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "3px",
        border: `1px solid ${accent ? AMBER : BORDER}`,
        borderRadius: "6px",
        padding: "8px 10px",
        background: accent ? "rgba(224,145,63,0.08)" : "rgba(241,234,222,0.03)",
        minWidth: "88px",
      }}
    >
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.5625rem",
          color: accent ? AMBER : INK,
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.5rem",
          color: MUTED,
          letterSpacing: "0.04em",
        }}
      >
        {sub}
      </span>
    </div>
  );
}

export function SourcesVisual() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        width: "100%",
        flexWrap: "wrap",
      }}
    >
      <SourceBadge label="Insee IP2108" sub="06/2026" accent />
      <SourceBadge label="COR" sub="06/2026" />
      <SourceBadge label="DREES" sub="2025" />
    </div>
  );
}
