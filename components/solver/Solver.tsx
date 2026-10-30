"use client";

import { Keyboard, Loader2, RotateCcw, ShieldCheck } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { MathError } from "@/lib/math/errors";
import { parse } from "@/lib/math/parser";
import { toLatex } from "@/lib/math/print";
import type { SolverExample } from "@/types/content";
import type { LimitSide, Operation, SolveRequest } from "@/types/solver";
import { Keypad } from "./Keypad";
import { MathView } from "./MathView";
import { ResultPanel } from "./ResultPanel";
import { useSolver } from "./useSolver";

export const OPERATION_LABELS: Record<Operation, string> = {
  derivative: "Derivative",
  "indefinite-integral": "Indefinite integral",
  "definite-integral": "Definite integral",
  limit: "Limit",
  taylor: "Taylor series",
  "critical-points": "Critical points",
};

const VARIABLES = ["x", "t", "y", "z", "u", "θ"];

interface Fields {
  expression: string;
  variable: string;
  order: number;
  lower: string;
  upper: string;
  point: string;
  side: LimitSide;
  center: string;
  taylorOrder: number;
  rangeMin: string;
  rangeMax: string;
}

const DEFAULTS: Fields = {
  expression: "",
  variable: "x",
  order: 1,
  lower: "0",
  upper: "1",
  point: "0",
  side: "both",
  center: "0",
  taylorOrder: 5,
  rangeMin: "-10",
  rangeMax: "10",
};

function toRequest(op: Operation, f: Fields): SolveRequest {
  const base = { operation: op, expression: f.expression, variable: f.variable };
  switch (op) {
    case "derivative":
      return { ...base, order: f.order };
    case "definite-integral":
      return { ...base, lower: f.lower, upper: f.upper };
    case "limit":
      return { ...base, point: f.point, side: f.side };
    case "taylor":
      return { ...base, point: f.center, order: f.taylorOrder };
    case "critical-points":
      return { ...base, rangeMin: f.rangeMin, rangeMax: f.rangeMax };
    default:
      return base;
  }
}

function fromExample(ex: SolverExample, current: Fields): Fields {
  const next: Fields = { ...current, expression: ex.expression, variable: "x" };
  if (ex.operation === "derivative") next.order = ex.order ?? 1;
  if (ex.operation === "definite-integral") Object.assign(next, { lower: ex.lower ?? "0", upper: ex.upper ?? "1" });
  if (ex.operation === "limit") Object.assign(next, { point: ex.point ?? "0", side: ex.side ?? "both" });
  if (ex.operation === "taylor") Object.assign(next, { center: ex.point ?? "0", taylorOrder: ex.order ?? 5 });
  return next;
}

const inputClass =
  "w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";
const labelClass = "block text-sm font-medium text-ink";

function loadRenderer() {
  void import("katex");
}

export interface SolverProps {
  operations: Operation[];
  examples: SolverExample[];
  /** Accessible name for the solver region. */
  title: string;
}

export function Solver({ operations, examples, title }: SolverProps) {
  const uid = useId();
  const [operation, setOperation] = useState<Operation>(operations[0]);
  const [fields, setFields] = useState<Fields>(DEFAULTS);
  const [keypad, setKeypad] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const { state, solve, reset, warm } = useSolver();

  // Load the math engine (in a worker, off the main thread) once the browser is idle, and the
  // math renderer on first interaction or a few seconds after load, so neither delays first paint.
  useEffect(() => {
    const engine = setTimeout(warm, 1500);
    const renderer = setTimeout(loadRenderer, 6000);
    return () => {
      clearTimeout(engine);
      clearTimeout(renderer);
    };
  }, [warm]);

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => setFields((f) => ({ ...f, [key]: value }));

  const preview = useMemo(() => {
    if (!fields.expression.trim()) return null;
    try {
      return { ok: true as const, latex: toLatex(parse(fields.expression).node) };
    } catch (err) {
      return { ok: false as const, message: err instanceof MathError ? err.message : "This expression could not be read." };
    }
  }, [fields.expression]);

  const run = (op: Operation, f: Fields) => {
    solve(toRequest(op, f));
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(operation, fields);
  };

  const insert = (text: string, cursorBack: number) => {
    const el = inputRef.current;
    const start = el?.selectionStart ?? fields.expression.length;
    const end = el?.selectionEnd ?? fields.expression.length;
    const next = fields.expression.slice(0, start) + text + fields.expression.slice(end);
    set("expression", next);
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      const pos = start + text.length - cursorBack;
      el.setSelectionRange(pos, pos);
    });
  };

  const loadExample = (ex: SolverExample) => {
    const op = operations.includes(ex.operation) ? ex.operation : operation;
    const next = fromExample(ex, fields);
    setOperation(op);
    setFields(next);
    run(op, next);
  };

  const id = (name: string) => `${uid}-${name}`;
  const v = fields.variable;

  return (
    <section
      aria-label={title}
      onPointerEnter={loadRenderer}
      onFocusCapture={loadRenderer}
      className="rounded-card border border-line bg-surface p-4 shadow-card sm:p-6"
    >
      <form onSubmit={onSubmit} noValidate>
        {operations.length > 1 && (
          <fieldset>
            <legend className="sr-only">Operation</legend>
            <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
              {operations.map((op) => (
                <label
                  key={op}
                  className={`shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                    op === operation ? "border-accent bg-accent text-white" : "border-line text-ink-soft hover:bg-sunken"
                  }`}
                >
                  <input
                    type="radio"
                    name={id("operation")}
                    value={op}
                    checked={op === operation}
                    onChange={() => setOperation(op)}
                    className="sr-only"
                  />
                  {OPERATION_LABELS[op]}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <label htmlFor={id("expr")} className={labelClass}>
              Function f({v})
            </label>
            <input
              ref={inputRef}
              id={id("expr")}
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="e.g. x^2 sin(x)"
              value={fields.expression}
              onChange={(e) => set("expression", e.target.value)}
              aria-describedby={id("preview")}
              className={`${inputClass} mt-1 font-mono text-base`}
            />
          </div>
          <div>
            <label htmlFor={id("var")} className={labelClass}>
              Variable
            </label>
            <select id={id("var")} value={v} onChange={(e) => set("variable", e.target.value)} className={`${inputClass} mt-1 sm:w-24`}>
              {VARIABLES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div id={id("preview")} aria-live="polite" className="mt-3 flex min-h-14 items-center rounded-lg border border-dashed border-line bg-paper px-3 py-2">
          {!preview && <span className="text-sm text-muted">Your expression will be shown here as it will be read.</span>}
          {preview?.ok && (
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-muted">Reads as</span>
              <MathView latex={`f(${v === "θ" ? "\\theta" : v}) = ${preview.latex}`} display className="math-left min-w-0 flex-1" />
            </span>
          )}
          {preview && !preview.ok && <span className="text-sm text-danger">{preview.message}</span>}
        </div>

        <div className="mt-3">
          <button
            type="button"
            onClick={() => setKeypad((k) => !k)}
            aria-expanded={keypad}
            aria-controls={id("keypad")}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
          >
            <Keyboard aria-hidden className="h-4 w-4" /> {keypad ? "Hide keypad" : "Show keypad"}
          </button>
          <div id={id("keypad")} hidden={!keypad} className="mt-2">
            <Keypad onInsert={insert} />
          </div>
        </div>

        <OperationOptions operation={operation} fields={fields} set={set} id={id} />

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={state.status === "solving"}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 font-semibold text-white hover:bg-accent-strong disabled:opacity-70"
          >
            {state.status === "solving" && <Loader2 aria-hidden className="h-4 w-4 animate-spin" />}
            {state.status === "solving" ? "Solving…" : "Solve"}
          </button>
          <button
            type="button"
            onClick={() => {
              setFields(DEFAULTS);
              reset();
              inputRef.current?.focus();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-sunken"
          >
            <RotateCcw aria-hidden className="h-4 w-4" /> Reset
          </button>
        </div>

        <p className="mt-4 flex items-start gap-2 text-sm text-muted">
          <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          Solved entirely in your browser. Nothing you type is sent to a server or stored, and no account is needed.
        </p>
      </form>

      {examples.length > 0 && (
        <div className="mt-5 border-t border-line pt-4">
          <p className="text-sm font-medium text-ink">Try an example</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {examples.map((ex) => (
              <li key={ex.label}>
                <button
                  type="button"
                  onClick={() => loadExample(ex)}
                  className="rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-xs text-ink-soft hover:border-accent hover:text-ink"
                >
                  {ex.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div ref={resultRef} aria-live="polite" aria-busy={state.status === "solving"} className="scroll-mt-24">
        {state.status === "done" && (
          <div className="mt-6">
            <ResultPanel result={state.result} />
          </div>
        )}
      </div>
    </section>
  );
}

function OperationOptions({
  operation,
  fields,
  set,
  id,
}: {
  operation: Operation;
  fields: Fields;
  set: <K extends keyof Fields>(key: K, value: Fields[K]) => void;
  id: (name: string) => string;
}) {
  const small = `${inputClass} mt-1 font-mono`;
  switch (operation) {
    case "derivative":
      return (
        <div className="mt-4 max-w-48">
          <label htmlFor={id("order")} className={labelClass}>
            Order
          </label>
          <select id={id("order")} value={fields.order} onChange={(e) => set("order", Number(e.target.value))} className={`${inputClass} mt-1`}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {["1st", "2nd", "3rd"][n - 1] ?? `${n}th`} derivative
              </option>
            ))}
          </select>
        </div>
      );
    case "definite-integral":
      return (
        <div className="mt-4 grid max-w-md grid-cols-2 gap-3">
          <div>
            <label htmlFor={id("lower")} className={labelClass}>
              Lower bound
            </label>
            <input id={id("lower")} value={fields.lower} onChange={(e) => set("lower", e.target.value)} className={small} placeholder="0, -inf, pi/2" />
          </div>
          <div>
            <label htmlFor={id("upper")} className={labelClass}>
              Upper bound
            </label>
            <input id={id("upper")} value={fields.upper} onChange={(e) => set("upper", e.target.value)} className={small} placeholder="1, inf, e" />
          </div>
          <p className="col-span-2 text-xs text-muted">Use inf or -inf for improper integrals.</p>
        </div>
      );
    case "limit":
      return (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
          <div>
            <label htmlFor={id("point")} className={labelClass}>
              {fields.variable} approaches
            </label>
            <input id={id("point")} value={fields.point} onChange={(e) => set("point", e.target.value)} className={small} placeholder="0, 2, pi, inf" />
          </div>
          <fieldset>
            <legend className={labelClass}>Direction</legend>
            <div className="mt-1 flex flex-wrap gap-1">
              {(
                [
                  ["both", "Both sides"],
                  ["left", "From the left (−)"],
                  ["right", "From the right (+)"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className={`cursor-pointer rounded-lg border px-3 py-2 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                    fields.side === value ? "border-accent bg-accent-soft text-accent-strong" : "border-line text-ink-soft hover:bg-sunken"
                  }`}
                >
                  <input type="radio" name={id("side")} value={value} checked={fields.side === value} onChange={() => set("side", value)} className="sr-only" />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <p className="text-xs text-muted sm:col-span-2">Type inf or -inf for limits at infinity (direction is ignored there).</p>
        </div>
      );
    case "taylor":
      return (
        <div className="mt-4 grid max-w-md grid-cols-2 gap-3">
          <div>
            <label htmlFor={id("center")} className={labelClass}>
              Center a
            </label>
            <input id={id("center")} value={fields.center} onChange={(e) => set("center", e.target.value)} className={small} placeholder="0" />
          </div>
          <div>
            <label htmlFor={id("torder")} className={labelClass}>
              Highest power
            </label>
            <select id={id("torder")} value={fields.taylorOrder} onChange={(e) => set("taylorOrder", Number(e.target.value))} className={`${inputClass} mt-1`}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <p className="col-span-2 text-xs text-muted">A center of 0 gives the Maclaurin polynomial.</p>
        </div>
      );
    case "critical-points":
      return (
        <div className="mt-4 grid max-w-md grid-cols-2 gap-3">
          <div>
            <label htmlFor={id("min")} className={labelClass}>
              Search from
            </label>
            <input id={id("min")} value={fields.rangeMin} onChange={(e) => set("rangeMin", e.target.value)} className={small} />
          </div>
          <div>
            <label htmlFor={id("max")} className={labelClass}>
              Search to
            </label>
            <input id={id("max")} value={fields.rangeMax} onChange={(e) => set("rangeMax", e.target.value)} className={small} />
          </div>
        </div>
      );
    default:
      return null;
  }
}
