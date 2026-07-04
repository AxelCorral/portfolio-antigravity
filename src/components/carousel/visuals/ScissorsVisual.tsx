const AMBER = "#e0913f";
const NEG = "rgba(215,95,52,0.75)";
const MUTED = "rgba(241,234,222,0.4)";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

function TrendRow({
  symbol,
  from,
  to,
  color,
  up,
}: {
  symbol: string;
  from: string;
  to: string;
  color: string;
  up: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span
        style={{
          width: "2.25rem",
          flexShrink: 0,
          fontFamily: FONT_MONO,
          fontSize: "0.625rem",
          color,
          letterSpacing: "0.02em",
        }}
      >
        {symbol}
      </span>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.6875rem",
          color: MUTED,
          letterSpacing: "0.02em",
        }}
      >
        {from}
      </span>
      <span style={{ color: MUTED, fontSize: "0.75rem" }}>{up ? "↗" : "↘"}</span>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.6875rem",
          color,
          letterSpacing: "0.02em",
        }}
      >
        {to}
      </span>
    </div>
  );
}

export function ScissorsVisual() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", alignItems: "flex-start" }}>
      <TrendRow symbol="P/W" from="55%" to="~40%" color={NEG} up={false} />
      <TrendRow symbol="τ*(N)" from="30.5%" to="41.9%" color={AMBER} up />
    </div>
  );
}
