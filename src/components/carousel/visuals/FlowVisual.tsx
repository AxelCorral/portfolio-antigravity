const AMBER = "#e0913f";
const INK = "#f1eade";
const MUTED = "rgba(241,234,222,0.45)";
const BORDER = "rgba(241,234,222,0.12)";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

interface NodeProps {
  label: string;
  sub?: string;
  accent?: boolean;
}

function Node({ label, sub, accent }: NodeProps) {
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
        minWidth: "84px",
        maxWidth: "96px",
      }}
    >
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.5625rem",
          color: accent ? AMBER : INK,
          letterSpacing: "0.04em",
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        {label}
      </span>
      {sub && (
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
      )}
    </div>
  );
}

function Arrow() {
  return (
    <span
      style={{
        color: MUTED,
        fontSize: "0.875rem",
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      →
    </span>
  );
}

export function FlowVisual() {
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
      <Node label="football-data.org" sub="API v4" />
      <Arrow />
      <Node label="retry + backoff" sub="error handling" />
      <Arrow />
      <Node label="S3 · raw JSON" sub="partitioned" accent />
    </div>
  );
}
