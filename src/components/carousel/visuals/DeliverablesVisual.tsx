const AMBER = "#e0913f";
const INK = "#f1eade";
const MUTED = "rgba(241,234,222,0.42)";
const BORDER = "rgba(241,234,222,0.12)";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

function Badge({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: FONT_MONO,
        fontSize: "0.5625rem",
        letterSpacing: "0.04em",
        color: accent ? AMBER : INK,
        border: `1px solid ${accent ? AMBER : BORDER}`,
        borderRadius: "999px",
        padding: "4px 10px",
        background: accent ? "rgba(224,145,63,0.08)" : "rgba(241,234,222,0.03)",
      }}
    >
      {label}
    </span>
  );
}

export function DeliverablesVisual() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.4rem",
        flexWrap: "wrap",
      }}
    >
      <Badge label="MIT" />
      <Badge label="CC BY 4.0" />
      <Badge label="PDF · 20p" accent />
      <Badge label="21 tests" />
      <span style={{ fontFamily: FONT_MONO, fontSize: "0.5rem", color: MUTED, width: "100%", textAlign: "center", marginTop: "2px" }}>
        github.com/AxelCorral/retraites-cor2026
      </span>
    </div>
  );
}
