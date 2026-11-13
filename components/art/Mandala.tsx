/** Procedural mandala in the invite's colours. `variant="line"` draws an uncoloured colouring-page outline. */

const petal = (len: number, w: number) =>
  `M0 0 C ${w} ${-len * 0.3} ${w * 0.7} ${-len * 0.8} 0 ${-len} C ${-w * 0.7} ${-len * 0.8} ${-w} ${-len * 0.3} 0 0 Z`;

type Ring = {
  count: number;
  r: number;
  len: number;
  w: number;
  fill: string;
  inner: string;
  offset?: number;
};

const RINGS: Ring[] = [
  { count: 20, r: 64, len: 30, w: 10, fill: "#0f5c5a", inner: "#e8cf93" },
  { count: 20, r: 58, len: 26, w: 9, fill: "#c4623a", inner: "#f2b45c", offset: 9 },
  { count: 16, r: 38, len: 26, w: 9, fill: "#7b1631", inner: "#e9b4ab" },
  { count: 12, r: 20, len: 20, w: 7.5, fill: "#c39a45", inner: "#fbf6ee", offset: 15 },
];

const DISCS = [
  { r: 58, fill: "#fbf6ee", stroke: "#c39a45" },
  { r: 38, fill: "#f5ecdd", stroke: "#c39a45" },
  { r: 20, fill: "#0b4040", stroke: "#e8cf93" },
  { r: 12, fill: "#e8cf93", stroke: "#7b1631" },
  { r: 5, fill: "#7b1631", stroke: "#7b1631" },
];

export function Mandala({
  className = "",
  variant = "color",
  strokeColor = "#3a2924",
}: {
  className?: string;
  variant?: "color" | "line";
  strokeColor?: string;
}) {
  const line = variant === "line";
  const sw = line ? 0.9 : 0.6;
  const ringEl = (ring: Ring, idx: number) => (
    <g key={`ring-${idx}`}>
      {Array.from({ length: ring.count }, (_, i) => {
        const a = (360 / ring.count) * i + (ring.offset ?? 0);
        return (
          <g key={i} transform={`rotate(${a}) translate(0 ${-ring.r})`}>
            <path
              d={petal(ring.len, ring.w)}
              fill={line ? "none" : ring.fill}
              stroke={line ? strokeColor : "rgba(58,41,36,.25)"}
              strokeWidth={sw}
            />
            <path
              d={petal(ring.len * 0.55, ring.w * 0.45)}
              transform={`translate(0 ${-ring.len * 0.18})`}
              fill={line ? "none" : ring.inner}
              stroke={line ? strokeColor : "none"}
              strokeWidth={sw * 0.8}
            />
          </g>
        );
      })}
    </g>
  );
  const discEl = (i: number) => {
    const d = DISCS[i];
    return (
      <circle
        key={`disc-${i}`}
        r={d.r}
        fill={line ? "#fff" : d.fill}
        stroke={line ? strokeColor : d.stroke}
        strokeWidth={line ? sw : 1.2}
      />
    );
  };

  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden="true">
      {Array.from({ length: 40 }, (_, i) => {
        const a = ((Math.PI * 2) / 40) * i;
        return (
          <circle
            key={`dot-${i}`}
            cx={Math.cos(a) * 97}
            cy={Math.sin(a) * 97}
            r={1.6}
            fill={line ? "none" : "#c39a45"}
            stroke={line ? strokeColor : "none"}
            strokeWidth={sw * 0.7}
          />
        );
      })}
      {ringEl(RINGS[0], 0)}
      {ringEl(RINGS[1], 1)}
      {discEl(0)}
      {ringEl(RINGS[2], 2)}
      {discEl(1)}
      {ringEl(RINGS[3], 3)}
      {discEl(2)}
      {discEl(3)}
      {discEl(4)}
    </svg>
  );
}
