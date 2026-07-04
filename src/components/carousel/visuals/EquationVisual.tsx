const AMBER = "#e0913f";
const INK = "#f1eade";
const MUTED = "rgba(241,234,222,0.42)";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

export function EquationVisual() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.9375rem",
          color: INK,
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: AMBER }}>{"τ*(t)"}</span>
        {" = "}
        <span style={{ color: INK }}>{"R(t)/A(t)"}</span>
        {" × "}
        <span style={{ color: INK }}>{"P̄(t)/W̄(t)"}</span>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          fontFamily: FONT_MONO,
          fontSize: "0.5rem",
          color: MUTED,
          letterSpacing: "0.05em",
        }}
      >
        <span>R/A</span>
        <span>·</span>
        <span>P̄/W̄</span>
      </div>
    </div>
  );
}
