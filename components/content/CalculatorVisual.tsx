import type { CalculatorSlug } from "@/lib/site-config";

// One small diagram per calculator for the page hero (navy background), drawn as inline SVG.

/** Descriptions for pages that have no illustration alt text of their own. */
export const visualLabels: Record<CalculatorSlug, string> = {
  "derivative-calculator": "A curve with tangent lines at three points: rising, flat at the peak, and falling",
  "second-derivative-calculator":
    "An S-shaped curve that is concave up on the left and concave down on the right, with the inflection point marked where the concavity changes",
  "partial-derivative-calculator":
    "A surface drawn as a wireframe with one slice highlighted, where y is held constant and the slope along x is the partial derivative",
  "chain-rule-calculator": "A flow diagram: x goes into the inner function g, whose output goes into the outer function f, with the chain rule formula below",
  "implicit-differentiation-calculator": "The circle x² + y² = 25 with its tangent line at the point (3, 4), which has slope −3/4",
  "integral-calculator": "Thin rectangles filling the area under a curve, approximating its integral",
  "limit-calculator": "A curve with a gap at one point, with arrows approaching the gap from the left and from the right",
  "taylor-series-calculator": "Several approximating curves hugging an original curve closely near one central point",
  "critical-points-calculator": "A curve with a flat tangent at the top of a hill and at the bottom of a valley, marking a local maximum and minimum",
};

const W = 400;
const H = 260;
const AXIS = "rgb(255 255 255 / 0.45)";
const GRID = "rgb(255 255 255 / 0.07)";
const CURVE = "#c4a8ff";
const ACCENT = "#3fd1c1";
const math = { fontFamily: "'Times New Roman', Georgia, serif", fontStyle: "italic" as const };

/** Polyline path for y = f(t), t in [t0, t1], mapped into the box [x0, x1] × [y0 (top), y1 (bottom)] for f in [fmin, fmax]. */
function plot(f: (t: number) => number, t0: number, t1: number, box: [number, number, number, number], fmin: number, fmax: number, n = 80) {
  const [x0, x1, yTop, yBottom] = box;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = t0 + ((t1 - t0) * i) / n;
    const v = Math.max(fmin - 1, Math.min(fmax + 1, f(t)));
    const x = x0 + ((x1 - x0) * i) / n;
    const y = yBottom - ((v - fmin) / (fmax - fmin)) * (yBottom - yTop);
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full">
      <g stroke={GRID}>
        {Array.from({ length: 9 }, (_, i) => (
          <path key={`v${i}`} d={`M${40 + i * 42} 16 V232`} />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <path key={`h${i}`} d={`M28 ${40 + i * 48} H388`} />
        ))}
      </g>
      {children}
    </svg>
  );
}

const Axes = ({ y = 220, x = 40 }: { y?: number; x?: number }) => (
  <g stroke={AXIS} strokeWidth="1.5" fill="none" strokeLinejoin="round">
    <path d={`M24 ${y} H384 M376 ${y - 5} L386 ${y} L376 ${y + 5}`} />
    <path d={`M${x} 240 V14 M${x - 5} 22 L${x} 12 L${x + 5} 22`} />
  </g>
);

const Dot = ({ cx, cy, open = false }: { cx: number; cy: number; open?: boolean }) => (
  <circle cx={cx} cy={cy} r="6" fill={open ? "#10143b" : "#ffffff"} stroke={open ? CURVE : "#7438f5"} strokeWidth="3" />
);

const Label = ({ x, y, children, color = "#ffffff", size = 16 }: { x: number; y: number; children: React.ReactNode; color?: string; size?: number }) => (
  <text x={x} y={y} fill={color} fontSize={size} style={math}>
    {children}
  </text>
);

export function CalculatorVisual({ slug, label }: { slug: CalculatorSlug; label: string }) {
  switch (slug) {
    case "derivative-calculator": {
      // Hill: rising tangent, flat tangent at the top, falling tangent.
      const f = (t: number) => Math.exp(-t * t);
      const box: [number, number, number, number] = [50, 370, 50, 210];
      const X = (t: number) => 50 + ((t + 2.2) / 4.4) * 320;
      const Y = (v: number) => 210 - v * 160;
      const tangent = (t: number, half = 0.55) => {
        const m = -2 * t * f(t);
        return `M${X(t - half)} ${Y(f(t) - m * half)} L${X(t + half)} ${Y(f(t) + m * half)}`;
      };
      return (
        <Frame label={label}>
          <Axes />
          <path d={plot(f, -2.2, 2.2, box, 0, 1)} fill="none" stroke={CURVE} strokeWidth="4" strokeLinecap="round" />
          {[-0.75, 0, 0.75].map((t) => (
            <g key={t}>
              <path d={tangent(t)} stroke={ACCENT} strokeWidth="3" strokeLinecap="round" />
              <Dot cx={X(t)} cy={Y(f(t))} />
            </g>
          ))}
          <Label x={X(-0.75) - 92} y={Y(f(-0.75)) + 6}>{"f′ > 0"}</Label>
          <Label x={X(0) - 24} y={Y(1) - 16}>{"f′ = 0"}</Label>
          <Label x={X(0.75) + 22} y={Y(f(0.75)) + 6}>{"f′ < 0"}</Label>
        </Frame>
      );
    }
    case "second-derivative-calculator": {
      const f = (t: number) => Math.atan(t * 1.4);
      const X = (t: number) => 50 + ((t + 2.5) / 5) * 320;
      const Y = (v: number) => 130 - v * 62;
      return (
        <Frame label={label}>
          <Axes />
          <rect x="50" y="20" width="160" height="200" fill="#3fd1c1" fillOpacity="0.08" />
          <rect x="210" y="20" width="160" height="200" fill="#923eff" fillOpacity="0.12" />
          <path d={plot(f, -2.5, 2.5, [50, 370, Y(1.6), Y(-1.6)], -1.6, 1.6)} fill="none" stroke={CURVE} strokeWidth="4" strokeLinecap="round" />
          <path d={`M${X(0)} 24 V220`} stroke="#ffffff" strokeOpacity="0.5" strokeDasharray="5 5" />
          <Dot cx={X(0)} cy={Y(0)} />
          <Label x={70} y={52} color={ACCENT}>{"f″ > 0  concave up"}</Label>
          <Label x={232} y={204} color="#e2d4ff">{"f″ < 0  concave down"}</Label>
          <Label x={X(0) + 12} y={Y(0) + 26} size={14}>inflection</Label>
        </Frame>
      );
    }
    case "partial-derivative-calculator": {
      // Wireframe surface z = f(x, y) in a simple oblique projection; one slice (y held constant) highlighted.
      const pt = (i: number, u: number) => {
        const x = 50 + i * 20 + u * 250;
        const y = 196 - i * 20 - 46 * Math.sin(u * Math.PI) * (0.65 + 0.35 * Math.cos(i / 2)) - u * 8;
        return [x, y] as const;
      };
      const line = (points: (readonly [number, number])[]) => points.map(([x, y], k) => `${k === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
      const rows = Array.from({ length: 7 }, (_, i) => line(Array.from({ length: 41 }, (_, k) => pt(i, k / 40))));
      const cols = Array.from({ length: 6 }, (_, j) => line(Array.from({ length: 7 }, (_, i) => pt(i, j / 5))));
      return (
        <Frame label={label}>
          {cols.map((d, j) => (
            <path key={`c${j}`} d={d} fill="none" stroke={CURVE} strokeOpacity="0.3" strokeWidth="1.25" />
          ))}
          {rows.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={i === 3 ? "#ff9cc8" : CURVE} strokeOpacity={i === 3 ? 1 : 0.45} strokeWidth={i === 3 ? 4 : 1.5} />
          ))}
          <path d="M120 232 H280 M270 226 L282 232 L270 238" stroke={ACCENT} strokeWidth="2.5" fill="none" />
          <Label x={160} y={252} color={ACCENT}>∂f/∂x</Label>
          <Label x={252} y={70} color="#ff9cc8">y held constant</Label>
        </Frame>
      );
    }
    case "chain-rule-calculator": {
      const box = (x: number, text: string, sub?: string) => (
        <g>
          <rect x={x} y="70" width="92" height="64" rx="14" fill="#ffffff" fillOpacity="0.08" stroke={CURVE} strokeOpacity="0.7" />
          <Label x={x + 46 - text.length * 4.6} y={sub ? 100 : 108} size={22}>
            {text}
          </Label>
          {sub && (
            <text x={x + 46} y="122" textAnchor="middle" fill="#ffffff" fillOpacity="0.6" fontSize="12">
              {sub}
            </text>
          )}
        </g>
      );
      const arrow = (x: number) => <path d={`M${x} 102 H${x + 34} M${x + 26} 95 L${x + 36} 102 L${x + 26} 109`} stroke={ACCENT} strokeWidth="2.5" fill="none" />;
      return (
        <Frame label={label}>
          {box(18, "x", "input")}
          {arrow(114)}
          {box(154, "g(x)", "inner")}
          {arrow(250)}
          {box(290, "f(u)", "outer")}
          <rect x="40" y="168" width="320" height="52" rx="14" fill="#7438f5" fillOpacity="0.25" stroke="#923eff" strokeOpacity="0.6" />
          <Label x={70} y={201} size={20}>
            {"dy/dx = f′(g(x)) · g′(x)"}
          </Label>
        </Frame>
      );
    }
    case "implicit-differentiation-calculator": {
      // x² + y² = 25 with the tangent at (3, 4): slope −3/4.
      const cx = 200;
      const cy = 130;
      const s = 19;
      const px = cx + 3 * s;
      const py = cy - 4 * s;
      return (
        <Frame label={label}>
          <g stroke={AXIS} strokeWidth="1.5">
            <path d={`M60 ${cy} H340`} />
            <path d={`M${cx} 18 V242`} />
          </g>
          <circle cx={cx} cy={cy} r={5 * s} fill="#7438f5" fillOpacity="0.12" stroke={CURVE} strokeWidth="4" />
          <path d={`M${px - 4 * 16} ${py - 3 * 16} L${px + 4 * 22} ${py + 3 * 22}`} stroke={ACCENT} strokeWidth="3" strokeLinecap="round" />
          <Dot cx={px} cy={py} />
          <Label x={px + 12} y={py - 10} size={15}>(3, 4)</Label>
          <Label x={286} y={150} size={15} color={ACCENT}>{"slope −3/4"}</Label>
          <Label x={70} y={238} size={17}>x² + y² = 25</Label>
        </Frame>
      );
    }
    case "integral-calculator": {
      const f = (t: number) => 0.35 + 0.5 * Math.sin(t) + 0.12 * t;
      const X = (t: number) => 50 + (t / 5) * 320;
      const Y = (v: number) => 220 - v * 150;
      const bars = Array.from({ length: 10 }, (_, i) => 0.4 + i * 0.42);
      return (
        <Frame label={label}>
          <Axes />
          {bars.map((t) => (
            <rect key={t} x={X(t)} y={Y(f(t + 0.21))} width={X(0.42) - X(0) - 3} height={220 - Y(f(t + 0.21))} rx="3" fill="#10b981" fillOpacity="0.28" stroke="#6fdcb8" strokeOpacity="0.7" />
          ))}
          <path d={plot(f, 0, 5, [50, 370, Y(1.2), Y(0)], 0, 1.2)} fill="none" stroke={CURVE} strokeWidth="4" strokeLinecap="round" />
          <Label x={X(0.4) - 4} y={238} size={15}>a</Label>
          <Label x={X(4.6) - 4} y={238} size={15}>b</Label>
          <Label x={232} y={52} size={20}>∫ f(x) dx</Label>
        </Frame>
      );
    }
    case "limit-calculator": {
      const f = (t: number) => 0.15 + 0.12 * t + 0.018 * t * t;
      const X = (t: number) => 50 + (t / 5) * 320;
      const Y = (v: number) => 210 - v * 150;
      const a = 2.5;
      return (
        <Frame label={label}>
          <Axes />
          <path d={plot(f, 0, 5, [50, 370, Y(1.25), Y(0)], 0, 1.25)} fill="none" stroke={CURVE} strokeWidth="4" strokeLinecap="round" />
          <path d={`M${X(a)} ${Y(f(a))} V220 M${X(a)} ${Y(f(a))} H40`} stroke="#ffffff" strokeOpacity="0.45" strokeDasharray="5 5" />
          <Dot cx={X(a)} cy={Y(f(a))} open />
          <path d={`M${X(1.2)} ${Y(f(1.2)) + 18} L${X(2.0)} ${Y(f(2.0)) + 18} M${X(2.0) - 10} ${Y(f(2.0)) + 12} L${X(2.0)} ${Y(f(2.0)) + 18} L${X(2.0) - 9} ${Y(f(2.0)) + 26}`} stroke={ACCENT} strokeWidth="2.5" fill="none" />
          <path d={`M${X(3.8)} ${Y(f(3.8)) - 18} L${X(3.0)} ${Y(f(3.0)) - 18} M${X(3.0) + 9} ${Y(f(3.0)) - 26} L${X(3.0)} ${Y(f(3.0)) - 18} L${X(3.0) + 10} ${Y(f(3.0)) - 11}`} stroke="#ffbf80" strokeWidth="2.5" fill="none" />
          <Label x={X(a) - 5} y={238} size={15}>a</Label>
          <Label x={22} y={Y(f(a)) + 5} size={15}>L</Label>
          <Label x={X(1.0)} y={Y(f(1.0)) + 46} size={14} color={ACCENT}>{"x → a⁻"}</Label>
          <Label x={X(3.6)} y={Y(f(3.6)) - 34} size={14} color="#ffbf80">{"x → a⁺"}</Label>
        </Frame>
      );
    }
    case "taylor-series-calculator": {
      const box: [number, number, number, number] = [40, 380, 30, 230];
      const T1 = (t: number) => t;
      const T3 = (t: number) => t - t ** 3 / 6;
      const T5 = (t: number) => t - t ** 3 / 6 + t ** 5 / 120;
      return (
        <Frame label={label}>
          <Axes y={130} x={210} />
          {[
            [T1, "#3fd1c1"],
            [T3, "#93bbff"],
            [T5, "#ff9cc8"],
          ].map(([fn, color], i) => (
            <path key={i} d={plot(fn as (t: number) => number, -Math.PI, Math.PI, box, -1.9, 1.9)} fill="none" stroke={color as string} strokeWidth="2.5" strokeDasharray="7 6" />
          ))}
          <path d={plot(Math.sin, -Math.PI, Math.PI, box, -1.9, 1.9)} fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
          <Dot cx={210} cy={130} />
          <Label x={54} y={226} size={14}>sin x</Label>
          <Label x={122} y={222} size={14} color="#3fd1c1">T₁</Label>
          <Label x={344} y={226} size={14} color="#93bbff">T₃</Label>
          <Label x={344} y={62} size={14} color="#ff9cc8">T₅</Label>
          <Label x={218} y={150} size={14}>a</Label>
        </Frame>
      );
    }
    case "critical-points-calculator": {
      const f = (t: number) => t ** 3 - 3 * t;
      const box: [number, number, number, number] = [50, 370, 30, 220];
      const X = (t: number) => 50 + ((t + 2.2) / 4.4) * 320;
      const Y = (v: number) => 220 - ((v + 4) / 8) * 190;
      return (
        <Frame label={label}>
          <Axes y={Y(0)} x={X(0)} />
          <path d={plot(f, -2.2, 2.2, box, -4, 4)} fill="none" stroke={CURVE} strokeWidth="4" strokeLinecap="round" />
          {[-1, 1].map((t) => (
            <g key={t}>
              <path d={`M${X(t) - 46} ${Y(f(t))} H${X(t) + 46}`} stroke={ACCENT} strokeWidth="3" strokeLinecap="round" />
              <Dot cx={X(t)} cy={Y(f(t))} />
            </g>
          ))}
          <Label x={X(-1) - 34} y={Y(f(-1)) - 16} size={15}>local max</Label>
          <Label x={X(1) - 30} y={Y(f(1)) + 30} size={15}>local min</Label>
          <Label x={X(1) + 42} y={Y(f(1)) - 10} size={14} color={ACCENT}>{"f′ = 0"}</Label>
        </Frame>
      );
    }
  }
}
