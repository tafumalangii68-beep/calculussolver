import type { WorkedExample as Example } from "@/types/content";
import { Tex } from "./Tex";

export function WorkedExample({ example, index }: { example: Example; index: number }) {
  return (
    <article className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent-strong">Example {index + 1}</p>
      <h3 className="mt-1 text-lg font-semibold text-ink">{example.title}</h3>
      <Tex display className="mt-3 text-ink">
        {example.problem}
      </Tex>
      <ol className="mt-4 space-y-3 border-l-2 border-line pl-4">
        {example.steps.map((step, i) => (
          <li key={i}>
            <p className="text-ink-soft">{step.text}</p>
            {step.math && <Tex display>{step.math}</Tex>}
          </li>
        ))}
      </ol>
      <div className="mt-4 rounded-lg bg-accent-soft px-4 py-3">
        <p className="text-sm font-medium text-accent-strong">Answer</p>
        <Tex display>{example.answer}</Tex>
      </div>
    </article>
  );
}
