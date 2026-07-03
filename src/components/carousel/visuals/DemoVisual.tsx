const AMBER = "#e0913f";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

export function DemoVisual() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "270px",
        border: "1px solid rgba(241,234,222,0.14)",
        borderRadius: "8px",
        overflow: "hidden",
        background: "rgba(241,234,222,0.02)",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "8px 10px",
          borderBottom: "1px solid rgba(241,234,222,0.08)",
          background: "rgba(241,234,222,0.04)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: "block",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "rgba(241,234,222,0.18)",
            }}
          />
        ))}
      </div>

      {/* App content */}
      <div
        style={{
          padding: "14px 12px 16px",
          fontFamily: FONT_MONO,
          lineHeight: 1.6,
        }}
      >
        <div
          style={{
            fontSize: "0.5625rem",
            color: "rgba(241,234,222,0.42)",
            letterSpacing: "0.05em",
          }}
        >
          streamlit · /football-pipeline
        </div>
        <div
          style={{
            marginTop: "8px",
            fontSize: "0.625rem",
            color: AMBER,
            letterSpacing: "0.06em",
          }}
        >
          → live
        </div>
      </div>
    </div>
  );
}
