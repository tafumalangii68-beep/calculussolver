// Cover art for guides and blog posts (inline SVG on a navy gradient). Each article has its own motif;
// unknown slugs fall back to a generic curve.

const math = { fontFamily: "'Times New Roman', Georgia, serif", fontStyle: "italic" as const };

/** Squeeze cover: u²·sin(5/|u|)-style oscillation, scaled to stay inside the bounds y = 170 ± 130u². */
const squeezeWiggle = Array.from({ length: 229 }, (_, i) => {
  const x = 72 + i * 2;
  const u = (x - 300) / 230;
  const y = 170 + 0.85 * 130 * u * u * Math.sin(5 / (Math.abs(u) + 0.04));
  return `${i ? "L" : "M"}${x} ${y.toFixed(1)}`;
}).join(" ");

function Motif({ slug, id }: { slug: string; id: (name: string) => string }) {
  switch (slug) {
    case "derivative-rules":
      // Rule "chips" connected like a network, around d/dx.
      return (
        <g>
          <g stroke="#8f7bff" strokeOpacity="0.5" strokeWidth="2">
            <path d="M300 170 L150 90 M300 170 L460 90 M300 170 L150 260 M300 170 L460 260" />
          </g>
          {(
            [
              [150, 90, "xⁿ"],
              [460, 90, "f · g"],
              [150, 260, "f / g"],
              [460, 260, "f ∘ g"],
            ] as const
          ).map(([x, y, t]) => (
            <g key={t}>
              <rect x={x - 52} y={y - 28} width="104" height="56" rx="16" fill="#ffffff" fillOpacity="0.08" stroke="#c4a8ff" strokeOpacity="0.6" />
              <text x={x} y={y + 9} textAnchor="middle" fill="#ffffff" fontSize="26" style={math}>
                {t}
              </text>
            </g>
          ))}
          <circle cx="300" cy="170" r="58" fill={`url(#${id("violet")})`} />
          <text x="300" y="160" textAnchor="middle" fill="#ffffff" fontSize="30" style={math}>
            d
          </text>
          <rect x="276" y="168" width="48" height="2.5" fill="#ffffff" />
          <text x="300" y="200" textAnchor="middle" fill="#ffffff" fontSize="28" style={math}>
            dx
          </text>
        </g>
      );
    case "integration-techniques":
      // One integral branching into the techniques.
      return (
        <g>
          <g fill="none" stroke="#6fdcb8" strokeOpacity="0.7" strokeWidth="2.5">
            <path d="M150 170 C 250 170, 260 70, 400 70" />
            <path d="M150 170 C 250 170, 270 140, 400 140" />
            <path d="M150 170 C 250 170, 270 200, 400 200" />
            <path d="M150 170 C 250 170, 260 270, 400 270" />
          </g>
          <circle cx="140" cy="170" r="52" fill={`url(#${id("violet")})`} />
          <text x="140" y="188" textAnchor="middle" fill="#ffffff" fontSize="52" style={math}>
            ∫
          </text>
          {(
            [
              [70, "u-substitution"],
              [140, "by parts"],
              [200, "trig identities"],
              [270, "partial fractions"],
            ] as const
          ).map(([y, t]) => (
            <g key={t}>
              <rect x="404" y={y - 20} width="150" height="40" rx="12" fill="#ffffff" fillOpacity="0.08" stroke="#6fdcb8" strokeOpacity="0.6" />
              <text x="479" y={y + 6} textAnchor="middle" fill="#ffffff" fontSize="16" fontFamily="var(--font-inter), system-ui, sans-serif">
                {t}
              </text>
            </g>
          ))}
        </g>
      );
    case "how-to-find-the-derivative-of-a-function":
      // Secant lines turning into the tangent line.
      return (
        <g>
          <path d="M60 290 C 200 290, 260 220, 330 150 S 470 50, 560 46" fill="none" stroke="#c4a8ff" strokeWidth="5" strokeLinecap="round" />
          {(
            [
              [540, 40, 0.35],
              [470, 66, 0.55],
              [400, 118, 0.8],
            ] as const
          ).map(([x, y, o]) => (
            <path key={x} d={`M292 208 L${x} ${y}`} stroke="#ff9cc8" strokeOpacity={o} strokeWidth="2.5" strokeDasharray="6 6" />
          ))}
          <path d="M150 336 L470 48" stroke="#3fd1c1" strokeWidth="4" strokeLinecap="round" />
          <circle cx="292" cy="208" r="9" fill="#ffffff" stroke="#7438f5" strokeWidth="4" />
          <text x="470" y="250" fill="#ffffff" fontSize="26" style={math}>
            {"f′(x)"}
          </text>
        </g>
      );
    case "how-to-find-critical-points-and-classify-them":
      // A curve with flat tangents at its peak and valley, and the sign of f′ on each stretch.
      return (
        <g>
          <path d="M50 300 C 130 300, 150 90, 220 90 S 320 250, 390 250 S 500 60, 560 40" fill="none" stroke="#c4a8ff" strokeWidth="5" strokeLinecap="round" />
          <path d="M165 90 H275 M335 250 H445" stroke="#3fd1c1" strokeWidth="4" strokeLinecap="round" />
          <circle cx="220" cy="90" r="9" fill="#ffffff" stroke="#7438f5" strokeWidth="4" />
          <circle cx="390" cy="250" r="9" fill="#ffffff" stroke="#7438f5" strokeWidth="4" />
          <g fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="16" fill="#ffffff" fillOpacity="0.85" textAnchor="middle">
            <text x="220" y="62">max</text>
            <text x="390" y="290">min</text>
          </g>
          <g fontSize="30" fill="#fbbf6a" textAnchor="middle" style={math}>
            <text x="135" y="200">+</text>
            <text x="305" y="160">−</text>
            <text x="480" y="200">+</text>
          </g>
          <text x="560" y="320" textAnchor="end" fill="#ffffff" fontSize="24" style={math}>
            {"f′(x) = 0"}
          </text>
        </g>
      );
    case "what-partial-derivatives-mean-geometrically":
      // A wireframe hill sliced along x and y, with the two tangent lines at one point.
      return (
        <g>
          <g fill="none" stroke="#c4a8ff" strokeOpacity="0.45" strokeWidth="1.5">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <path key={`a${i}`} d={`M${90 + i * 40} ${290 - i * 18} Q ${210 + i * 40} ${70 - i * 6}, ${330 + i * 40} ${290 - i * 18}`} />
            ))}
          </g>
          <path d="M150 272 Q 270 52, 390 272" fill="none" stroke="#f0abfc" strokeWidth="4" strokeLinecap="round" />
          <path d="M210 304 Q 300 44, 470 224" fill="none" stroke="#3fd1c1" strokeWidth="4" strokeLinecap="round" />
          {/* Both slices pass through (294, 166); each dashed line is that slice's tangent there. */}
          <path d="M233 144 L355 188" stroke="#f0abfc" strokeWidth="2.5" strokeDasharray="6 6" />
          <path d="M240 203 L348 129" stroke="#3fd1c1" strokeWidth="2.5" strokeDasharray="6 6" />
          <circle cx="294" cy="166" r="9" fill="#ffffff" stroke="#7438f5" strokeWidth="4" />
          <g fontSize="24" style={math}>
            <text x="470" y="80" fill="#f0abfc">{"∂f/∂x"}</text>
            <text x="470" y="120" fill="#3fd1c1">{"∂f/∂y"}</text>
          </g>
        </g>
      );
    case "lhopitals-rule-explained-with-examples":
      // Two curves through the same zero, their tangent lines, and 0/0 turning into f′/g′.
      return (
        <g>
          <path d="M80 300 C 180 240, 240 200, 300 170 S 440 60, 540 30" fill="none" stroke="#c4a8ff" strokeWidth="5" strokeLinecap="round" />
          <path d="M80 250 C 180 215, 240 190, 300 170 S 440 140, 540 120" fill="none" stroke="#93b4ff" strokeWidth="5" strokeLinecap="round" />
          <path d="M190 240 L410 100" stroke="#c4a8ff" strokeOpacity="0.55" strokeWidth="2.5" strokeDasharray="6 6" />
          <path d="M190 210 L410 130" stroke="#93b4ff" strokeOpacity="0.55" strokeWidth="2.5" strokeDasharray="6 6" />
          <circle cx="300" cy="170" r="9" fill="#ffffff" stroke="#7438f5" strokeWidth="4" />
          <g fill="#ffffff" style={math} fontSize="30">
            <text x="96" y="92">0/0</text>
            <text x="206" y="92" fill="#3fd1c1">→</text>
            <text x="250" y="92">{"f′/g′"}</text>
          </g>
          <g fontSize="20" style={math}>
            <text x="548" y="40" fill="#c4a8ff">f</text>
            <text x="548" y="128" fill="#93b4ff">g</text>
          </g>
        </g>
      );
    case "squeeze-theorem-explained-with-examples":
      // An oscillating curve trapped between an upper and a lower bound that pinch together at one point.
      return (
        <g>
          {/* h and g are the parabolas y = 170 ∓ 130u² (u = (x − 300)/230); the wiggle stays inside them. */}
          <path d="M70 40 Q 300 300, 530 40" fill="none" stroke="#67d8ec" strokeWidth="4" strokeLinecap="round" />
          <path d="M70 300 Q 300 40, 530 300" fill="none" stroke="#67d8ec" strokeWidth="4" strokeLinecap="round" />
          <path d={squeezeWiggle} fill="none" stroke="#c4a8ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="300" cy="170" r="9" fill="#ffffff" stroke="#7438f5" strokeWidth="4" />
          <g fontSize="22" fill="#ffffff" style={math}>
            <text x="540" y="40">h(x)</text>
            <text x="540" y="312">g(x)</text>
          </g>
          <text x="300" y="322" textAnchor="middle" fill="#ffffff" fontSize="22" style={math}>
            L
          </text>
        </g>
      );
    default:
      return <path d="M60 280 C 200 280, 260 120, 340 120 S 480 220, 560 120" fill="none" stroke="#c4a8ff" strokeWidth="5" strokeLinecap="round" />;
  }
}

/** `instance` keeps gradient ids unique when several covers share a page. */
export function ArticleCover({ slug, label, instance = "cover", className = "" }: { slug: string; label: string; instance?: string; className?: string }) {
  const id = (name: string) => `ac-${instance}-${slug}-${name}`;
  return (
    <svg viewBox="0 0 600 340" role="img" aria-label={label} className={`h-auto w-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={id("bg")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#10143b" />
          <stop offset="1" stopColor="#2a1f73" />
        </linearGradient>
        <radialGradient id={id("glow")} cx="0.8" cy="0.1" r="0.7">
          <stop offset="0" stopColor="#923eff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#923eff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("violet")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7438f5" />
          <stop offset="1" stopColor="#923eff" />
        </linearGradient>
      </defs>
      <rect width="600" height="340" fill={`url(#${id("bg")})`} />
      <rect width="600" height="340" fill={`url(#${id("glow")})`} />
      <g stroke="#ffffff" strokeOpacity="0.06">
        {Array.from({ length: 12 }, (_, i) => (
          <path key={`v${i}`} d={`M${i * 50 + 25} 0 V340`} />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <path key={`h${i}`} d={`M0 ${i * 50 + 20} H600`} />
        ))}
      </g>
      <Motif slug={slug} id={id} />
    </svg>
  );
}
