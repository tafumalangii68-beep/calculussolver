"use client";

const KEYS: { label: string; insert: string; aria?: string }[] = [
  { label: "x", insert: "x" },
  { label: "xⁿ", insert: "^", aria: "power" },
  { label: "( )", insert: "()", aria: "parentheses" },
  { label: "÷", insert: "/", aria: "divide" },
  { label: "*", insert: "*", aria: "multiply" },
  { label: "√", insert: "sqrt()", aria: "square root" },
  { label: "π", insert: "pi", aria: "pi" },
  { label: "e", insert: "e" },
  { label: "eˣ", insert: "e^()", aria: "e to the power" },
  { label: "ln", insert: "ln()", aria: "natural log" },
  { label: "sin", insert: "sin()" },
  { label: "cos", insert: "cos()" },
  { label: "tan", insert: "tan()" },
  { label: "|x|", insert: "abs()", aria: "absolute value" },
  { label: "asin", insert: "asin()", aria: "arcsine" },
  { label: "atan", insert: "atan()", aria: "arctangent" },
];

/** On-screen keys for symbols that are awkward to type on phones. */
export function Keypad({ onInsert }: { onInsert: (text: string, cursorBack: number) => void }) {
  return (
    <div role="group" aria-label="Math keypad" className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
      {KEYS.map((key) => (
        <button
          key={key.label}
          type="button"
          aria-label={`Insert ${key.aria ?? key.label}`}
          onClick={() => onInsert(key.insert, key.insert.endsWith("()") ? 1 : 0)}
          className="h-10 rounded-lg border border-line bg-surface font-mono text-sm text-ink hover:border-line-strong hover:bg-sunken active:bg-line"
        >
          {key.label}
        </button>
      ))}
    </div>
  );
}
