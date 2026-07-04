const AMBER = "#e0913f";
const INK = "#f1eade";
const MUTED = "rgba(241,234,222,0.45)";
const BORDER = "rgba(241,234,222,0.12)";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

interface LeverProps {
  symbol: string;
  sub: string;
  accent?: boolean;
}

function Lever({ symbol, sub, accent }: LeverProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        border: `1px solid ${accent ? AMBER : BORDER}`,
        borderRadius: "6px",
        padding: "10px 14px",
        background: accent ? "rgba(224,145,63,0.08)" : "rgba(241,234,222,0.03)",
        minWidth: "76px",
      }}
    >
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.8125rem",
          color: accent ? AMBER : INK,
          letterSpacing: "0.02em",
        }}
      >
        {symbol}
      </span>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.5rem",
          color: MUTED,
          letterSpacing: "0.06em",
        }}
      >
        {sub}
      </span>
    </div>
  );
}

export function LeversVisual() {
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
      <Lever symbol="τ" sub="01" />
      <Lever symbol="P/W" sub="02" accent />
      <Lever symbol="+Δ age" sub="03" />
    </div>
  );
}
