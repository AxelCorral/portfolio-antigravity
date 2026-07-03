const AMBER = "#e0913f";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

export function SplitVisual() {
  return (
    <div style={{ width: "100%", maxWidth: "280px" }}>
      {/* Split bar */}
      <div
        style={{
          display: "flex",
          height: "36px",
          borderRadius: "6px",
          overflow: "hidden",
          border: "1px solid rgba(241,234,222,0.1)",
        }}
      >
        {/* TRAIN — 80% */}
        <div
          style={{
            width: "80%",
            background: "rgba(241,234,222,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT_MONO,
            fontSize: "0.5625rem",
            color: "rgba(241,234,222,0.52)",
            letterSpacing: "0.1em",
          }}
        >
          TRAIN
        </div>
        {/* TEST — 20%, amber tinted */}
        <div
          style={{
            width: "20%",
            background: "rgba(224,145,63,0.18)",
            borderLeft: `1px solid rgba(224,145,63,0.35)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT_MONO,
            fontSize: "0.5625rem",
            color: AMBER,
            letterSpacing: "0.1em",
          }}
        >
          TEST
        </div>
      </div>

      {/* Sub-labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "8px",
          fontFamily: FONT_MONO,
          fontSize: "0.5625rem",
          letterSpacing: "0.06em",
        }}
      >
        <span style={{ color: "rgba(241,234,222,0.32)" }}>
          seasons ≤ N-1
        </span>
        <span style={{ color: "rgba(241,234,222,0.32)" }}>season N</span>
      </div>
    </div>
  );
}
