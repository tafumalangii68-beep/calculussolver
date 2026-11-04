// Page illustrations drawn as inline SVG in the site palette. Theme-aware: strokes and fills
// use the colour tokens, so they work in light and dark mode.

function Frame({ label, viewBox, children }: { label: string; viewBox: string; children: React.ReactNode }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-paper p-4 sm:p-6">
      <svg viewBox={viewBox} role="img" aria-label={label} className="h-auto w-full">
        {children}
      </svg>
    </figure>
  );
}

const math = { fontFamily: "'Times New Roman', Georgia, serif", fontStyle: "italic" as const };

function Gear({ cx, cy, r, teeth, className }: { cx: number; cy: number; r: number; teeth: number; className: string }) {
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i * Math.PI) / teeth;
    const rad = i % 2 === 0 ? r : r * 0.8;
    const a1 = a - Math.PI / teeth / 2.2;
    const a2 = a + Math.PI / teeth / 2.2;
    pts.push(`${(cx + rad * Math.cos(a1)).toFixed(1)},${(cy + rad * Math.sin(a1)).toFixed(1)}`, `${(cx + rad * Math.cos(a2)).toFixed(1)},${(cy + rad * Math.sin(a2)).toFixed(1)}`);
  }
  return (
    <g className={className}>
      <polygon points={pts.join(" ")} />
      <circle cx={cx} cy={cy} r={r * 0.32} className="fill-paper" />
    </g>
  );
}

/** How It Works: an expression tree flows into gears and ends at a checkmark. */
export function PipelineDiagram() {
  const node = (x: number, y: number, t: string) => (
    <g key={`${x}${y}`}>
      <circle cx={x} cy={y} r="22" className="fill-surface stroke-accent" strokeWidth="2.5" />
      <text x={x} y={y + 7} textAnchor="middle" fontSize="20" className="fill-ink" style={math}>
        {t}
      </text>
    </g>
  );
  const label = (x: number, t: string) => (
    <text x={x} y="300" textAnchor="middle" fontSize="18" fontWeight="700" className="fill-ink" fontFamily="var(--font-jakarta), system-ui, sans-serif">
      {t}
    </text>
  );
  const arrow = (x: number) => (
    <path d={`M${x} 150 H${x + 70} M${x + 58} 140 L${x + 72} 150 L${x + 58} 160`} fill="none" className="stroke-accent" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  );
  return (
    <Frame label="Diagram: an expression tree flows into a set of gears and ends at a checkmark, showing input being parsed, solved and verified" viewBox="0 0 900 320">
      {/* Expression tree */}
      <g className="stroke-line-strong" strokeWidth="2">
        <path d="M150 70 L95 150 M150 70 L205 150 M205 150 L170 230 M205 150 L245 230" />
      </g>
      {node(150, 70, "+")}
      {node(95, 150, "x²")}
      {node(205, 150, "·")}
      {node(170, 230, "3")}
      {node(245, 230, "sin")}
      {label(170, "Parse")}
      {arrow(290)}
      {/* Gears */}
      <Gear cx={430} cy={130} r={62} teeth={10} className="fill-accent" />
      <Gear cx={515} cy={205} r={42} teeth={8} className="fill-teal" />
      {label(470, "Solve")}
      {arrow(590)}
      {/* Check */}
      <circle cx="760" cy="150" r="70" className="fill-accent-soft stroke-accent" strokeWidth="3" />
      <path d="M725 152 L750 178 L800 122" fill="none" className="stroke-accent-strong" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      {label(760, "Verify")}
    </Frame>
  );
}

/** About: a tidy study desk with an open notebook, a pencil, a laptop and a small plant. */
export function StudyDesk() {
  return (
    <Frame label="A tidy study desk with an open notebook, a pencil, a laptop and a small plant" viewBox="0 0 900 400">
      {/* Desk */}
      <rect x="20" y="320" width="860" height="18" rx="9" className="fill-line-strong" />
      {/* Laptop */}
      <rect x="470" y="120" width="300" height="190" rx="14" className="fill-navy-900" />
      <rect x="484" y="134" width="272" height="162" rx="6" className="fill-surface" />
      <path d="M440 310 H800 L790 322 H450 Z" className="fill-line-strong" />
      <path d="M506 270 C 560 268, 600 240, 640 200 S 710 150, 740 148" fill="none" className="stroke-accent" strokeWidth="4" strokeLinecap="round" />
      <path d="M506 280 H744 M512 150 V284" className="stroke-ink-soft" strokeWidth="2" />
      <text x="520" y="170" fontSize="20" className="fill-ink" style={math}>
        f(x)
      </text>
      {/* Notebook */}
      <g transform="translate(150 225) rotate(-6)">
        <rect x="0" y="0" width="250" height="90" rx="6" className="fill-surface stroke-line-strong" strokeWidth="2" />
        <path d="M125 0 V90" className="stroke-line-strong" strokeWidth="2" />
        {[20, 38, 56, 74].map((y) => (
          <path key={y} d={`M14 ${y} H112 M138 ${y} H236`} className="stroke-line" strokeWidth="1.5" />
        ))}
        <path d="M18 70 C 40 70, 60 40, 82 30 S 105 22, 110 22" fill="none" className="stroke-teal" strokeWidth="3" />
        <text x="146" y="44" fontSize="18" className="fill-accent-strong" style={math}>
          ∫ x dx
        </text>
      </g>
      {/* Pencil */}
      <g transform="translate(130 300) rotate(-12)">
        <rect x="0" y="0" width="170" height="12" rx="3" className="fill-accent" />
        <path d="M170 0 L190 6 L170 12 Z" className="fill-ink-soft" />
        <rect x="-14" y="0" width="14" height="12" rx="3" className="fill-teal" />
      </g>
      {/* Plant */}
      <path d="M816 250 C 790 200, 800 170, 820 150 M824 250 C 840 200, 860 180, 870 170 M820 250 C 818 210, 830 190, 846 186" fill="none" className="stroke-teal" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="820" cy="170" rx="16" ry="9" transform="rotate(-50 820 170)" className="fill-teal" />
      <ellipse cx="866" cy="172" rx="16" ry="9" transform="rotate(30 866 172)" className="fill-teal" />
      <ellipse cx="846" cy="186" rx="14" ry="8" transform="rotate(-10 846 186)" className="fill-teal" />
      <path d="M796 250 H850 L842 320 H804 Z" className="fill-accent" />
    </Frame>
  );
}
