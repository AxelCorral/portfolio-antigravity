const AMBER = "#e0913f";
const MUTED = "rgba(241,234,222,0.5)";
const DIM = "rgba(241,234,222,0.28)";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

export function TreeVisual() {
  return (
    <pre
      style={{
        fontFamily: FONT_MONO,
        fontSize: "0.6875rem",
        lineHeight: 1.9,
        whiteSpace: "pre",
        margin: 0,
        color: DIM,
        background: "none",
      }}
    >
      <span style={{ color: MUTED }}>{"curated/"}</span>{"\n"}{"├─ competition="}<span style={{ color: AMBER }}>{"SA"}</span>{"/ · season=2024 · matches.parquet\n"}{"└─ competition="}<span style={{ color: AMBER }}>{"BL1"}</span>{"/ · season=2024 · matches.parquet"}
    </pre>
  );
}
