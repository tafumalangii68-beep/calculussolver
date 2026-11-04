/**
 * Decorative hero illustration (inline SVG, so it is sharp at any size and costs no request):
 * a laptop showing an integral and a shaded curve, a stack of calculus books, a pencil cup,
 * a wireframe wave and two floating formula cards.
 */
export function HeroIllustration({ className = "" }: { className?: string }) {
  const math = { fontFamily: "'Times New Roman', 'STIX Two Math', Georgia, serif", fontStyle: "italic" as const };
  return (
    <svg viewBox="0 0 640 520" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id="hi-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#efe8ff" />
        </linearGradient>
        <linearGradient id="hi-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#923eff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#923eff" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="hi-frame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2b2f6b" />
          <stop offset="1" stopColor="#151936" />
        </linearGradient>
        <linearGradient id="hi-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e4e3f5" />
          <stop offset="1" stopColor="#a9a8cc" />
        </linearGradient>
        <linearGradient id="hi-violet" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7438f5" />
          <stop offset="1" stopColor="#923eff" />
        </linearGradient>
        <linearGradient id="hi-blue" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#4f8bff" />
        </linearGradient>
        <linearGradient id="hi-indigo" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4c22c9" />
          <stop offset="1" stopColor="#6d4cff" />
        </linearGradient>
        <radialGradient id="hi-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#923eff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#923eff" stopOpacity="0" />
        </radialGradient>
        <filter id="hi-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#05061a" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Glow */}
      <ellipse cx="380" cy="250" rx="260" ry="200" fill="url(#hi-glow)" />

      {/* Wireframe wave */}
      <g fill="none" stroke="#8f7bff" strokeOpacity="0.35" strokeWidth="1">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M10 ${250 + i * 9} C 90 ${170 + i * 14}, 160 ${330 - i * 6}, 250 ${215 + i * 10} S 330 ${150 + i * 12}, 360 ${200 + i * 8}`} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <path key={`v${i}`} d={`M${30 + i * 28} ${200 + Math.sin(i / 1.6) * 34} L ${30 + i * 28} ${300 + Math.sin(i / 1.6) * 30}`} strokeOpacity="0.18" />
        ))}
      </g>

      {/* Laptop */}
      <g filter="url(#hi-shadow)">
        <rect x="262" y="78" width="330" height="230" rx="16" fill="url(#hi-frame)" />
        <rect x="276" y="92" width="302" height="202" rx="8" fill="url(#hi-screen)" />
        <path d="M228 316 L626 316 L606 342 Q602 348 592 348 L262 348 Q252 348 248 342 Z" fill="url(#hi-base)" />
        <rect x="392" y="316" width="70" height="7" rx="3.5" fill="#8f8eb8" />
      </g>
      {/* Screen content: formula */}
      <g fill="#151936" style={math}>
        <text x="296" y="148" fontSize="40">∫</text>
        <text x="318" y="140" fontSize="25">x</text>
        <text x="332" y="127" fontSize="15" fontStyle="normal">2</text>
        <text x="344" y="140" fontSize="25">dx</text>
        <text x="380" y="140" fontSize="25" fontStyle="normal">=</text>
        <text x="408" y="124" fontSize="22">x</text>
        <text x="420" y="113" fontSize="13" fontStyle="normal">3</text>
        <rect x="404" y="130" width="30" height="2" />
        <text x="412" y="152" fontSize="20" fontStyle="normal">3</text>
        <text x="442" y="140" fontSize="24" fontStyle="normal">+</text>
        <text x="464" y="140" fontSize="24">C</text>
      </g>
      {/* Screen content: graph */}
      <g>
        <path d="M308 276 L308 170" stroke="#151936" strokeWidth="2" markerEnd="" />
        <path d="M302 178 L308 166 L314 178" fill="none" stroke="#151936" strokeWidth="2" strokeLinejoin="round" />
        <path d="M300 268 L560 268" stroke="#151936" strokeWidth="2" />
        <path d="M552 262 L564 268 L552 274" fill="none" stroke="#151936" strokeWidth="2" strokeLinejoin="round" />
        <g stroke="#c9bff5" strokeWidth="1">
          {[340, 372, 404, 436, 468, 500, 532].map((x) => (
            <path key={x} d={`M${x} 190 V268`} />
          ))}
          {[200, 222, 244].map((y) => (
            <path key={y} d={`M308 ${y} H548`} />
          ))}
        </g>
        <path d="M330 268 C 380 266, 420 250, 460 215 C 485 193, 505 186, 530 184 L530 268 Z" fill="url(#hi-area)" />
        <path d="M330 268 C 380 266, 420 250, 460 215 C 485 193, 505 186, 530 184" fill="none" stroke="#7438f5" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M530 184 V268" stroke="#7438f5" strokeWidth="1.5" strokeDasharray="4 4" />
      </g>

      {/* Books */}
      <g filter="url(#hi-shadow)" fontFamily="var(--font-jakarta), system-ui, sans-serif" fontWeight="700" fontSize="17" fill="#fff">
        {(
          [
            ["Limits", "url(#hi-indigo)", 380, 0],
            ["Integrals", "url(#hi-violet)", 338, 10],
            ["Derivatives", "url(#hi-blue)", 296, 2],
            ["Calculus", "url(#hi-blue)", 254, 16],
          ] as const
        ).map(([label, fill, y, dx]) => (
          <g key={label} transform={`translate(${96 + dx} ${y + 52})`}>
            <rect x="0" y="0" width="186" height="40" rx="8" fill={fill} />
            <rect x="150" y="5" width="30" height="30" rx="3" fill="#f3f1ff" />
            <path d="M152 12 H178 M152 19 H178 M152 26 H178" stroke="#d7d1f3" strokeWidth="1.5" />
            <rect x="0" y="0" width="186" height="8" rx="4" fill="#ffffff" fillOpacity="0.14" />
            <text x="22" y="26">{label}</text>
          </g>
        ))}
      </g>

      {/* Pencil cup with pi */}
      <g filter="url(#hi-shadow)">
        <path d="M560 356 L572 300 L612 268" stroke="#7438f5" strokeWidth="9" strokeLinecap="round" />
        <path d="M577 356 L590 290 L598 250" stroke="#4f8bff" strokeWidth="9" strokeLinecap="round" />
        <path d="M594 356 L606 300 L630 276" stroke="#c084fc" strokeWidth="9" strokeLinecap="round" />
        <path d="M548 336 H628 L620 420 Q618 430 608 430 H568 Q558 430 556 420 Z" fill="#f4f1ff" />
        <ellipse cx="588" cy="336" rx="40" ry="8" fill="#e6defd" />
        <text x="569" y="402" fontSize="46" fill="#7438f5" style={math}>
          π
        </text>
      </g>

      {/* Floating formula cards */}
      <g className="animate-float" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <rect x="150" y="40" width="108" height="78" rx="14" fill="#171b50" fillOpacity="0.85" stroke="#8f7bff" strokeOpacity="0.6" />
        <g fill="#ffffff" style={math}>
          <text x="166" y="72" fontSize="20">d</text>
          <rect x="164" y="79" width="26" height="1.8" />
          <text x="164" y="100" fontSize="20">dx</text>
          <text x="198" y="88" fontSize="22">f(x)</text>
        </g>
      </g>
      <g className="animate-float-slow" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <rect x="506" y="14" width="122" height="72" rx="14" fill="#171b50" fillOpacity="0.85" stroke="#8f7bff" strokeOpacity="0.6" />
        <g fill="#ffffff" style={math}>
          <text x="522" y="52" fontSize="21" fontStyle="normal">lim</text>
          <text x="560" y="52" fontSize="21">f(x)</text>
          <text x="522" y="72" fontSize="12">x→0</text>
        </g>
      </g>

      {/* Sparkles */}
      <g fill="#c9a8ff">
        <path d="M110 150 l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3 z" opacity="0.8" />
        <path d="M480 420 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 z" opacity="0.7" />
        <circle cx="620" cy="190" r="3" opacity="0.6" />
        <circle cx="236" cy="200" r="2.5" opacity="0.6" />
      </g>
    </svg>
  );
}
