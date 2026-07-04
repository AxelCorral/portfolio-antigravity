const AMBER = "#e0913f";
const INK = "#f1eade";
const MUTED = "rgba(241,234,222,0.42)";
const BORDER = "rgba(241,234,222,0.12)";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

function ScenarioRow({ range, label, flagged }: { range: string; label: string; flagged?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        padding: "5px 10px",
        border: `1px solid ${flagged ? AMBER : BORDER}`,
        borderRadius: "5px",
        background: flagged ? "rgba(224,145,63,0.08)" : "rgba(241,234,222,0.03)",
        width: "100%",
        maxWidth: "220px",
      }}
    >
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.5625rem",
          color: flagged ? AMBER : INK,
          letterSpacing: "0.03em",
        }}
      >
        {range}
      </span>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.5rem",
          color: MUTED,
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function ScenariosVisual() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
      <ScenarioRow range="ICF 1.20–1.70" label="Insee '26" />
      <ScenarioRow range="+70k – +230k" label="Insee '26" />
      <ScenarioRow range="α → 2070" label="COR '25" flagged />
    </div>
  );
}
