const AMBER = "#e0913f";
const INK = "#f1eade";
const MUTED = "rgba(241,234,222,0.45)";
const BORDER = "rgba(241,234,222,0.12)";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

function PlayerChip({ id, role }: { id: string; role: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "3px",
        border: `1px solid ${BORDER}`,
        borderRadius: "6px",
        padding: "6px 8px",
        background: "rgba(241,234,222,0.03)",
        minWidth: "68px",
      }}
    >
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.5625rem",
          color: INK,
          letterSpacing: "0.03em",
        }}
      >
        {id}
      </span>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.5rem",
          color: MUTED,
          letterSpacing: "0.03em",
        }}
      >
        {role}
      </span>
    </div>
  );
}

/** Conceptual representation of the persistent-ID research track (jersey
 * color + position + role) — a hypothesis being studied, not a shipped
 * result. Not a real pipeline export (none is public yet, see
 * docs/ui-loop/QUESTIONS.md Q4). */
export function ReidVisual() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.6rem",
        width: "100%",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: "0.5rem", color: MUTED, letterSpacing: "0.04em" }}>
          segment A
        </span>
        <PlayerChip id="id·07" role="jersey + pos + role" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
        <span
          style={{
            width: "20px",
            height: "1px",
            background: `repeating-linear-gradient(90deg, ${AMBER} 0 3px, transparent 3px 6px)`,
            display: "block",
          }}
        />
        <span style={{ fontFamily: FONT_MONO, fontSize: "0.5rem", color: AMBER, letterSpacing: "0.03em" }}>
          same id?
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: "0.5rem", color: MUTED, letterSpacing: "0.04em" }}>
          segment B
        </span>
        <PlayerChip id="id·07 ?" role="re-identification" />
      </div>
    </div>
  );
}
