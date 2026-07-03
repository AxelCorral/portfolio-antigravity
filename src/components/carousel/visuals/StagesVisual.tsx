const AMBER = "#e0913f";
const MUTED = "rgba(241,234,222,0.46)";
const LINE = "rgba(241,234,222,0.14)";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

const STAGES = ["lint", "test", "model", "deploy"] as const;

export function StagesVisual() {
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
      {STAGES.map((stage, i) => (
        <div
          key={stage}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span
              style={{
                fontSize: "1rem",
                color: AMBER,
                lineHeight: 1,
              }}
            >
              ✓
            </span>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.5625rem",
                color: MUTED,
                letterSpacing: "0.06em",
              }}
            >
              {stage}
            </span>
          </div>

          {i < STAGES.length - 1 && (
            <div
              style={{
                width: "18px",
                height: "1px",
                background: LINE,
                flexShrink: 0,
                marginBottom: "16px",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
