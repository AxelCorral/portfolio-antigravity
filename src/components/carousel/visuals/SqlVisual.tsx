const AMBER = "#e0913f";
const INK = "#f1eade";
const STR = "rgba(241,234,222,0.5)";
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

export function SqlVisual() {
  return (
    <pre
      style={{
        fontFamily: FONT_MONO,
        fontSize: "0.6875rem",
        lineHeight: 1.9,
        whiteSpace: "pre",
        margin: 0,
        color: INK,
        background: "none",
      }}
    >
      <span style={{ color: AMBER }}>{"SELECT"}</span>{" team, "}<span style={{ color: AMBER }}>{"AVG"}</span>{"(goals)\n"}<span style={{ color: AMBER }}>{"FROM"}</span>{"   curated_matches\n"}<span style={{ color: AMBER }}>{"WHERE"}</span>{"  venue = "}<span style={{ color: STR }}>{"'home'"}</span>{"\n"}<span style={{ color: AMBER }}>{"GROUP BY"}</span>{"  team"}
    </pre>
  );
}
