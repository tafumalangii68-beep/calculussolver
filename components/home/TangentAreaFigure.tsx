/** The two central ideas of calculus: a tangent line at a point and the area under the curve up to it. */
export function TangentAreaFigure({ className = "" }: { className?: string }) {
  return (
    <figure className={`overflow-hidden rounded-3xl border border-line bg-surface p-4 shadow-card sm:p-6 ${className}`}>
      <svg
        viewBox="0 0 600 400"
        role="img"
        aria-label="A curve with its tangent line at one point and the area under the curve shaded up to that point, the two central ideas of calculus"
        className="h-auto w-full"
      >
        <defs>
          <linearGradient id="taf-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#923eff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#7438f5" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="taf-curve" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#4c22c9" />
            <stop offset="1" stopColor="#923eff" />
          </linearGradient>
        </defs>
        <g className="stroke-line" strokeWidth="1">
          {Array.from({ length: 11 }, (_, i) => (
            <path key={`v${i}`} d={`M${50 + i * 50} 20 V350`} />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <path key={`h${i}`} d={`M40 ${50 + i * 50} H570`} />
          ))}
        </g>
        <path d="M50 350 V24 M44 36 L50 22 L56 36" fill="none" className="stroke-ink-soft" strokeWidth="2" strokeLinejoin="round" />
        <path d="M40 350 H576 M562 344 L578 350 L562 356" fill="none" className="stroke-ink-soft" strokeWidth="2" strokeLinejoin="round" />
        {/* Area under the curve up to x = 350 */}
        <path d="M60 330 C 160 330, 240 310, 300 250 C 320 230, 335 213, 350 197 L350 350 L60 350 Z" fill="url(#taf-area)" />
        {/* Curve */}
        <path d="M60 330 C 160 330, 240 310, 300 250 C 380 168, 430 95, 560 92" fill="none" stroke="url(#taf-curve)" strokeWidth="5" strokeLinecap="round" />
        {/* Tangent line at x = 350 */}
        <path d="M230 322 L470 72" stroke="#16a89a" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M350 197 V350" stroke="#7438f5" strokeWidth="1.5" strokeDasharray="5 5" />
        <circle cx="350" cy="197" r="9" fill="#ffffff" stroke="#7438f5" strokeWidth="4" />
        {/* Labels */}
        <g fontFamily="'Times New Roman', Georgia, serif" fontStyle="italic" fontSize="24" className="fill-ink">
          <text x="486" y="78">tangent</text>
          <text x="160" y="300" className="fill-accent-strong">area</text>
          <text x="530" y="128">f(x)</text>
        </g>
      </svg>
    </figure>
  );
}
