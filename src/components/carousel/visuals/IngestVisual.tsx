const AMBER = "#e0913f";
const INK = "#f1eade";
const MUTED = "rgba(241,234,222,0.45)";
const BORDER = "rgba(241,234,222,0.12)";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

function SourceNode({ label, sub }: { label: string; sub: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        border: `1px solid ${BORDER}`,
        borderRadius: "6px",
        padding: "6px 12px",
        background: "rgba(241,234,222,0.03)",
      }}
    >
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.5625rem",
          color: INK,
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.5rem",
          color: MUTED,
          letterSpacing: "0.02em",
        }}
      >
        {sub}
      </span>
    </div>
  );
}

export function IngestVisual() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.4rem",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", gap: "0.6rem" }}>
        <SourceNode label="France Travail" sub="OAuth2" />
        <SourceNode label="Adzuna" sub="REST" />
      </div>
      <span style={{ color: MUTED, fontSize: "0.75rem", lineHeight: 1 }} aria-hidden="true">
        ↓
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          fontFamily: FONT_MONO,
          fontSize: "0.625rem",
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: MUTED }}>normalize</span>
        <span style={{ color: MUTED }}>→</span>
        <span style={{ color: MUTED }}>dedup</span>
        <span style={{ color: MUTED }}>→</span>
        <span style={{ color: AMBER, fontWeight: 600 }}>upsert</span>
      </div>
    </div>
  );
}
