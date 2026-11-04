"use client";

import { Star } from "lucide-react";
import { useState } from "react";

const LABELS = ["Poor", "Fair", "Good", "Very good", "Excellent"];

/** Accessible star picker: a radio group, so arrow keys and screen readers work natively. */
export function StarInput({ value, onChange, error, name }: { value: number; onChange: (v: number) => void; error?: string; name: string }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="block text-sm font-medium text-ink">
        Your rating <span className="text-danger">*</span>
      </legend>
      <div className="mt-1 flex items-center gap-3">
        <div className="flex" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              onMouseEnter={() => setHover(n)}
              className="relative cursor-pointer rounded-md p-1 transition-transform hover:scale-110 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent"
            >
              <input
                type="radio"
                name={name}
                value={n}
                checked={value === n}
                onChange={() => onChange(n)}
                className="sr-only"
                aria-label={`${n} star${n > 1 ? "s" : ""} – ${LABELS[n - 1]}`}
              />
              <Star aria-hidden className={`h-8 w-8 transition-colors ${n <= shown ? "fill-star text-star" : "fill-transparent text-line-strong"}`} strokeWidth={1.5} />
            </label>
          ))}
        </div>
        <span className="text-sm text-muted" aria-hidden>
          {shown ? LABELS[shown - 1] : "Choose 1 to 5 stars"}
        </span>
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
