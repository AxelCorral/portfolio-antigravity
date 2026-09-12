const AMBER = "#e0913f";
const MUTED = "rgba(241,234,222,0.45)";
const DIM = "rgba(241,234,222,0.55)";
const BORDER = "rgba(241,234,222,0.22)";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

/** Stylized top-down pitch, reconstructed to illustrate the homography
 * calibration step — not a real pipeline export (none is public yet, see
 * docs/ui-loop/QUESTIONS.md Q4). No club, competition or broadcast asset. */
export function PitchSchemaVisual() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.4rem",
        width: "100%",
      }}
    >
      <svg
        viewBox="0 0 220 130"
        width="100%"
        style={{ maxWidth: "220px" }}
        role="img"
        aria-label="Stylized top-down pitch showing camera positions projected onto real-world coordinates via homography"
      >
        <rect x="10" y="10" width="200" height="110" fill="none" stroke={BORDER} strokeWidth="1" />
        <line x1="110" y1="10" x2="110" y2="120" stroke={BORDER} strokeWidth="1" />
        <circle cx="110" cy="65" r="16" fill="none" stroke={BORDER} strokeWidth="1" />
        <circle cx="110" cy="65" r="1.4" fill={BORDER} />
        <rect x="10" y="35" width="26" height="60" fill="none" stroke={BORDER} strokeWidth="1" />
        <rect x="184" y="35" width="26" height="60" fill="none" stroke={BORDER} strokeWidth="1" />

        {/* Camera view, top-left — dashed rays converging onto tracked points */}
        <g opacity={0.85}>
          <rect x="4" y="2" width="16" height="10" fill="none" stroke={AMBER} strokeWidth="1" />
          <line x1="12" y1="12" x2="52" y2="48" stroke={AMBER} strokeWidth="0.75" strokeDasharray="2,2" />
          <line x1="12" y1="12" x2="96" y2="30" stroke={AMBER} strokeWidth="0.75" strokeDasharray="2,2" />
          <line x1="12" y1="12" x2="150" y2="92" stroke={AMBER} strokeWidth="0.75" strokeDasharray="2,2" />
        </g>

        {/* Projected player positions, in pitch coordinates */}
        <circle cx="52" cy="48" r="2.6" fill={AMBER} />
        <circle cx="96" cy="30" r="2.6" fill={AMBER} />
        <circle cx="150" cy="92" r="2.6" fill={AMBER} />
        <circle cx="70" cy="90" r="2.6" fill="rgba(241,234,222,0.55)" />
        <circle cx="130" cy="45" r="2.6" fill="rgba(241,234,222,0.55)" />
      </svg>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.5625rem",
          color: DIM,
          letterSpacing: "0.03em",
          textAlign: "center",
        }}
      >
        camera view <span style={{ color: MUTED }}>→</span> homography <span style={{ color: MUTED }}>→</span> pitch coordinates
      </span>
    </div>
  );
}
