// Cover art for guides and blog posts (inline SVG on a navy gradient). Each article has its own motif;
// unknown slugs fall back to a generic curve.

const math = { fontFamily: "'Times New Roman', Georgia, serif", fontStyle: "italic" as const };

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
