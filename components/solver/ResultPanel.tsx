"use client";

import { AlertTriangle, Check, CheckCircle2, Copy, Info, Sigma } from "lucide-react";
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
      className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm text-ink-soft hover:bg-sunken"
    >
      {copied ? <Check aria-hidden className="h-4 w-4 text-ok" /> : <Copy aria-hidden className="h-4 w-4" />}
      {copied ? "Copied" : label}
    </button>
  );
}

function Steps({ section }: { section: StepSection }) {
  return (
    <section className="mt-6">
      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">{section.title}</h4>
      <ol className="mt-3 space-y-3">
        {section.steps.map((step, i) => (
          <li
            key={i}
            className="rounded-lg border border-line bg-surface px-4 py-3"
            style={{ marginLeft: `${Math.min(step.depth, 3) * 0.9}rem` }}
          >
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
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <caption className="border-b border-line bg-sunken px-4 py-2 text-left font-medium text-ink">{table.caption}</caption>
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
      <div role="alert" className="rounded-card border border-danger/30 bg-danger-soft p-5">
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
    <div className="rounded-card border border-line bg-paper p-5 sm:p-6">
      <h3 className="sr-only">Result</h3>
      <MathView latex={result.problemLatex} display className="math-left text-ink-soft" label="Problem" />
      <div className="mt-3 rounded-lg border border-accent/30 bg-surface px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-strong">Answer</p>
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
          <summary className="cursor-pointer font-semibold text-ink">Step-by-step solution</summary>
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
    </div>
  );
}
