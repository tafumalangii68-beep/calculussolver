import { CheckCircle2 } from "lucide-react";
import type { WorkedExample as Example } from "@/types/content";
import { Tex } from "./Tex";

/** A worked example: the problem, a numbered timeline of steps, and the answer. */
export function WorkedExample({ example, index }: { example: Example; index: number }) {
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition-colors hover:border-accent/40 sm:p-6">
      <div className="flex items-center gap-3">
        <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-gradient font-display text-sm font-bold text-white shadow-glow">
          {index + 1}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent-strong">Example {index + 1}</p>
          <h3 className="font-display text-lg font-bold leading-snug text-ink">{example.title}</h3>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-accent-soft/60 px-4 py-1 text-ink">
        <Tex display>{example.problem}</Tex>
      </div>
      <ol className="mt-5 flex-1 space-y-4">
        {example.steps.map((step, i) => (
          <li key={i} className="relative pl-8">
            <span aria-hidden className="absolute left-0 top-0.5 grid h-5 w-5 place-items-center rounded-full border border-accent/40 bg-surface text-[11px] font-bold text-accent-strong">
              {i + 1}
            </span>
            {i < example.steps.length - 1 && <span aria-hidden className="absolute bottom-[-14px] left-[9.5px] top-6 w-px bg-line-strong" />}
            <p className="text-ink-soft">{step.text}</p>
            {step.math && <Tex display>{step.math}</Tex>}
          </li>
        ))}
      </ol>
      <div className="mt-5 rounded-xl border border-ok/25 bg-ok-soft px-4 py-2.5">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-ok">
          <CheckCircle2 aria-hidden className="h-4 w-4" /> Answer
        </p>
        <Tex display className="text-ink">
          {example.answer}
        </Tex>
      </div>
    </article>
  );
}
