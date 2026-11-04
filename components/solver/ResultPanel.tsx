"use client";

import { AlertTriangle, Check, CheckCircle2, Copy, Info, Sigma, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Operation, ResultTable, SolveResult, StepSection } from "@/types/solver";
import { MathView } from "./MathView";

const RELATED: Record<Operation, { href: string; label: string }> = {
  derivative: { href: "/guides/derivative-rules", label: "Review the derivative rules" },
  "indefinite-integral": { href: "/guides/integration-techniques", label: "Review integration techniques" },
  "definite-integral": { href: "/integral-calculator", label: "Learn more about definite integrals" },
  limit: { href: "/limit-calculator", label: "Learn how limits are evaluated" },
  taylor: { href: "/taylor-series-calculator", label: "Learn how Taylor polynomials are built" },
  "critical-points": { href: "/critical-points-calculator", label: "Learn how critical points are classified" },
  "partial-derivative": { href: "/partial-derivative-calculator", label: "Learn how partial derivatives work" },
  implicit: { href: "/implicit-differentiation-calculator", label: "Learn how implicit differentiation works" },
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          setCopied(false);
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-accent/50 hover:bg-accent-soft hover:text-accent-strong"
    >
      {copied ? <Check aria-hidden className="h-4 w-4 text-ok" /> : <Copy aria-hidden className="h-4 w-4" />}
      {copied ? "Copied" : label}
    </button>
  );
}

function Steps({ section }: { section: StepSection }) {
  return (
    <section className="mt-6">
      <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-accent-strong">{section.title}</h3>
      <ol className="mt-3 space-y-2.5">
        {section.steps.map((step, i) => (
          <li
            key={i}
            className="relative rounded-xl border border-line bg-surface py-3 pl-12 pr-4 shadow-sm"
            style={{ marginLeft: `${Math.min(step.depth, 3) * 0.9}rem` }}
          >
            <span aria-hidden className="absolute left-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent-strong">
              {i + 1}
            </span>
            <p className="text-sm font-semibold text-ink">{step.rule}</p>
            {step.latex && <MathView latex={step.latex} display className="math-left mt-1 text-ink" />}
            {step.note && <p className="mt-1 text-sm text-muted">{step.note}</p>}
          </li>
        ))}
      </ol>
      {section.truncated && (
        <p className="mt-2 text-sm text-muted">Further intermediate steps were omitted to keep this readable; the final result includes them.</p>
      )}
    </section>
  );
}

function Table({ table }: { table: ResultTable }) {
  const text = new Set(table.textColumns ?? []);
  return (
    <div className="mt-6">
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <caption className="border-b border-line bg-accent-soft/60 px-4 py-2.5 text-left font-display font-bold text-ink">{table.caption}</caption>
          <thead>
            <tr className="border-b border-line">
              {table.headers.map((h, i) => (
                <th key={i} scope="col" className="px-4 py-2 text-left font-semibold text-ink">
                  {text.has(i) && !/[\\^{]/.test(h) ? h : <MathView latex={h} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, r) => (
              <tr key={r} className="border-b border-line last:border-0">
                {row.map((cell, c) => (
                  <td key={c} className="px-4 py-2 align-top text-ink-soft">
                    {text.has(c) ? cell : <MathView latex={cell} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ResultPanel({ result }: { result: SolveResult }) {
  if (!result.ok) {
    return (
      <div role="alert" className="rounded-2xl border border-danger/30 bg-danger-soft p-5">
        <p className="flex items-start gap-2 font-semibold text-danger">
          <AlertTriangle aria-hidden className="mt-0.5 h-5 w-5 shrink-0" />
          {result.error}
        </p>
        {result.hint && <p className="mt-2 pl-7 text-sm text-ink-soft">{result.hint}</p>}
      </div>
    );
  }

  const related = RELATED[result.operation];
  const check = result.check;
  return (
    <div className="rounded-2xl border border-line bg-paper p-4 sm:p-6">
      <h2 className="sr-only">Result</h2>
      <MathView latex={result.problemLatex} display className="math-left text-ink-soft" label="Problem" />
      <div className="relative mt-3 overflow-hidden rounded-xl border border-accent/30 bg-surface px-4 py-4 pl-5 shadow-card">
        <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-brand-gradient" />
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-strong">Answer</p>
        <MathView latex={result.answerLatex} display className="math-left mt-1 text-lg text-ink" />
        {result.approx && <p className="mt-1 text-sm text-muted">≈ {result.approx}</p>}
        <p className="mt-2 break-words font-mono text-xs text-muted">
          <span className="sr-only">Plain text answer: </span>
          {result.answerText}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <CopyButton text={result.answerText} label="Copy answer" />
          <CopyButton text={result.answerLatex} label="Copy LaTeX" />
        </div>
      </div>

      {check && (
        <p
          className={`mt-4 flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
            check.status === "verified" ? "bg-ok-soft text-ok" : check.status === "numeric" ? "bg-sunken text-ink-soft" : "bg-warn-soft text-warn"
          }`}
        >
          {check.status === "verified" ? (
            <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          ) : check.status === "numeric" ? (
            <Sigma aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          {check.message}
        </p>
      )}

      <p className="mt-4 text-sm text-ink-soft">
        <span className="font-semibold text-ink">Method: </span>
        {result.method}
      </p>

      {result.notes.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {result.notes.map((note) => (
            <li key={note} className="flex items-start gap-2 text-sm text-ink-soft">
              <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
              {note}
            </li>
          ))}
        </ul>
      )}

      {result.table && <Table table={result.table} />}

      {result.sections.length > 0 && (
        <details className="mt-6 group" open>
          <summary className="cursor-pointer font-display text-lg font-bold text-ink">Step-by-step solution</summary>
          {result.sections.map((section, i) => (
            <Steps key={i} section={section} />
          ))}
        </details>
      )}

      <p className="mt-6 text-sm">
        <Link href={related.href} className="text-accent-strong underline underline-offset-2">
          {related.label}
        </Link>
      </p>

      <RateSolution />
    </div>
  );
}

/** Invites a real rating after a solve: each star opens the review form with that rating preselected. */
function RateSolution() {
  return (
    <aside aria-labelledby="rate-solution-heading" className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-line bg-surface px-4 py-3">
      <p id="rate-solution-heading" className="text-sm font-semibold text-ink">
        Rate this solution
      </p>
      {/* Hovering or focusing star n fills stars 1..n: the whole row fills, then later siblings are reset. */}
      <ul className="group/rate flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <li key={n} className="[&:focus-within~li_svg]:fill-transparent [&:focus-within~li_svg]:text-line-strong [&:hover~li_svg]:fill-transparent [&:hover~li_svg]:text-line-strong">
            <Link
              href={`/reviews?rating=${n}#write`}
              aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
              className="block rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Star aria-hidden strokeWidth={1.5} className="h-6 w-6 fill-transparent text-line-strong transition-colors group-focus-within/rate:fill-star group-focus-within/rate:text-star-stroke group-hover/rate:fill-star group-hover/rate:text-star-stroke" />
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">Your review helps other learners.</p>
    </aside>
  );
}
