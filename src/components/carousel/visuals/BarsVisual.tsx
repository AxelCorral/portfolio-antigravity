const AMBER = "#e0913f";
const NEG = "rgba(215,95,52,0.65)"; /* --halo-2 from tokens.css, muted */
const MUTED = "rgba(241,234,222,0.38)";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

const MAX_ABS = 10; /* scale denominator */

interface RowProps {
  label: string;
  value: number; /* +ve → right (amber), -ve → left (burnt) */
}

function BarRow({ label, value }: RowProps) {
  const pct = (Math.abs(value) / MAX_ABS) * 50; /* % from center per half */
  const positive = value >= 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "0.6rem",
      }}
    >
      {/* Label */}
      <span
        style={{
          width: "5.75rem",
          flexShrink: 0,
          fontFamily: FONT_MONO,
          fontSize: "0.5625rem",
          color: MUTED,
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </span>

      {/* Bar area — split at center */}
      <div
        style={{
          flex: 1,
          display: "flex",
          height: "14px",
          position: "relative",
        }}
      >
        {/* Negative half */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {!positive && (
            <div
              style={{
                width: `${pct * 2}%`,
                height: "100%",
                background: NEG,
                borderRadius: "3px 0 0 3px",
              }}
            />
          )}
        </div>
        {/* Center axis */}
        <div
          style={{
            width: "1px",
            background: "rgba(241,234,222,0.18)",
            flexShrink: 0,
          }}
        />
        {/* Positive half */}
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          {positive && (
            <div
              style={{
                width: `${pct * 2}%`,
                height: "100%",
                background: AMBER,
                borderRadius: "0 3px 3px 0",
                opacity: 0.88,
              }}
            />
          )}
        </div>
      </div>

      {/* Value label */}
      <span
        style={{
          width: "2.75rem",
          fontFamily: FONT_MONO,
          fontSize: "0.5625rem",
          color: positive ? AMBER : NEG,
          letterSpacing: "0.04em",
          flexShrink: 0,
        }}
      >
        {positive ? `+${value}` : value}
      </span>
    </div>
  );
}

export function BarsVisual() {
  return (
    <div style={{ width: "100%" }}>
      {/* Baseline label */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "0.6rem",
          fontFamily: FONT_MONO,
          fontSize: "0.5rem",
          color: "rgba(241,234,222,0.24)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        ← baseline →
      </div>

      <BarRow label="Serie A" value={9.7} />
      <BarRow label="Bundesliga" value={-0.7} />
    </div>
  );
}
