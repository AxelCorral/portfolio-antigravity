const AMBER = "#e0913f";
const NEG = "rgba(215,95,52,0.75)";
const MUTED = "rgba(241,234,222,0.42)";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

export function LimitsVisual() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem" }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: "0.75rem", color: MUTED }}>
          P/W(L) 40.5%
        </span>
        <span style={{ color: MUTED, fontSize: "0.75rem" }}>vs</span>
        <span style={{ fontFamily: FONT_MONO, fontSize: "0.75rem", color: AMBER }}>
          COR 45.3%
        </span>
      </div>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.8125rem",
          color: NEG,
          letterSpacing: "0.02em",
        }}
      >
        −10.7%
      </span>
    </div>
  );
}
