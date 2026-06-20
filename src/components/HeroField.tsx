// Placeholder signature: a tracking field of points on an implicit pitch.
// Swapped for the WebGL/OGL particle field in a later build.
const points = [
  [12, 30], [22, 55], [18, 78], [30, 18], [38, 62], [46, 40], [50, 88],
  [58, 25], [62, 70], [70, 48], [78, 32], [82, 80], [88, 58], [94, 20],
  [96, 66], [25, 95], [44, 10], [66, 96], [85, 12], [10, 60], [56, 56], [33, 40],
];

export function HeroField() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-[min(70vh,720px)] w-[min(1120px,94vw)]"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="dot-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9FB0FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#5B6CFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="2"
        fill="none"
        stroke="rgba(234,236,245,0.08)"
        strokeWidth="0.3"
      />
      <line x1="50" y1="4" x2="50" y2="96" stroke="rgba(234,236,245,0.06)" strokeWidth="0.3" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 1.4 : 0.9} fill="url(#dot-glow)" />
      ))}
    </svg>
  );
}
