"use client";

import { useEffect, useRef, useState } from "react";

type Katex = typeof import("katex").default;
let katexPromise: Promise<Katex> | null = null;

function loadKatex(): Promise<Katex> {
  katexPromise ??= import("katex").then((m) => m.default);
  return katexPromise;
}

/** Client-side KaTeX rendering; the library is loaded on first use only. */
export function MathView({ latex, display = false, className, label }: { latex: string; display?: boolean; className?: string; label?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadKatex().then((katex) => {
      if (cancelled || !ref.current) return;
      katex.render(latex, ref.current, { displayMode: display, throwOnError: false, output: "htmlAndMathml" });
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [latex, display]);

  const Tag = display ? "div" : "span";
  return (
    <Tag className={`${display ? "math-scroll" : ""} ${className ?? ""}`} role={label ? "group" : undefined} aria-label={label}>
      <span ref={ref} />
      {!ready && <span className="font-mono text-sm text-muted">{latex.length > 120 ? "Rendering…" : latex}</span>}
    </Tag>
  );
}
