"use client";

import { ChevronDown, Keyboard, Loader2, Play, RotateCcw, ShieldCheck } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { MathError } from "@/lib/math/errors";
import { parse, parseEquation } from "@/lib/math/parser";
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
  "partial-derivative": "Partial derivative",
  implicit: "Implicit differentiation",
};

/** Shorter names where a tab has little room. */
const TAB_LABELS: Partial<Record<Operation, string>> = { "indefinite-integral": "Integral" };

/** Small math symbol shown beside each operation name. */
const OPERATION_SYMBOLS: Record<Operation, string> = {
  derivative: "d/dx",
  "indefinite-integral": "∫",
  "definite-integral": "∫ₐᵇ",
  limit: "lim",
  taylor: "Σ",
  "critical-points": "f′=0",
  "partial-derivative": "∂",
  implicit: "dy/dx",
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
  /** Partial derivatives: optional second variable ("" = none). */
  variable2: string;
  /** Implicit differentiation: optional point "x, y". */
  implicitPoint: string;
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
  variable2: "",
  implicitPoint: "",
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
    case "partial-derivative":
      return { ...base, variable2: f.variable2 || undefined };
    case "implicit":
      return { ...base, variable: "x", point: f.implicitPoint };
    default:
      return base;
  }
}

function fromExample(ex: SolverExample, current: Fields): Fields {
  const next: Fields = { ...current, expression: ex.expression, variable: ex.variable ?? "x" };
  if (ex.operation === "derivative") next.order = ex.order ?? 1;
  if (ex.operation === "definite-integral") Object.assign(next, { lower: ex.lower ?? "0", upper: ex.upper ?? "1" });
  if (ex.operation === "limit") Object.assign(next, { point: ex.point ?? "0", side: ex.side ?? "both" });
  if (ex.operation === "taylor") Object.assign(next, { center: ex.point ?? "0", taylorOrder: ex.order ?? 5 });
  if (ex.operation === "partial-derivative") next.variable2 = ex.variable2 ?? "";
  if (ex.operation === "implicit") next.implicitPoint = ex.point ?? "";
  return next;
}

const inputClass =
  "w-full rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-ink transition-colors placeholder:text-muted/70 hover:border-accent/50 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15";
const labelClass = "block text-sm font-medium text-ink";

function loadRenderer() {
  void import("katex");
}

export interface SolverProps {
  operations: Operation[];
  examples: SolverExample[];
  /** Accessible name for the solver region. */
  title: string;
  /** Starting derivative order (the second derivative calculator uses 2). */
  initialOrder?: number;
  /** Visible panel heading (e.g. "Calculus Calculator"). Without it, `title` labels the region invisibly. */
  heading?: string;
  /** Operations shown as tabs; the rest go into a "More tools" menu. Default: all as tabs. */
  primaryOperations?: Operation[];
}

export function Solver({ operations, examples, title, initialOrder = 1, heading, primaryOperations }: SolverProps) {
  const uid = useId();
  const startFields: Fields = { ...DEFAULTS, order: initialOrder };
  const [operation, setOperation] = useState<Operation>(operations[0]);
  const [fields, setFields] = useState<Fields>(startFields);
  const [keypad, setKeypad] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const { state, solve, reset, warm } = useSolver();
  const tabs = primaryOperations ? operations.filter((o) => primaryOperations.includes(o)) : operations;
  const moreOps = operations.filter((o) => !tabs.includes(o));

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

  const isImplicit = operation === "implicit";
  const isPartial = operation === "partial-derivative";
  const preview = useMemo(() => {
    if (!fields.expression.trim()) return null;
    try {
      if (isImplicit) {
        const { lhs, rhs } = parseEquation(fields.expression);
        return { ok: true as const, latex: `${toLatex(lhs)} = ${toLatex(rhs)}` };
      }
      const name = isPartial ? "f" : `f(${fields.variable === "θ" ? "\\theta" : fields.variable})`;
      return { ok: true as const, latex: `${name} = ${toLatex(parse(fields.expression).node)}` };
    } catch (err) {
      return { ok: false as const, message: err instanceof MathError ? err.message : "This expression could not be read." };
    }
  }, [fields.expression, fields.variable, isImplicit, isPartial]);

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
      aria-label={heading ? undefined : title}
      aria-labelledby={heading ? id("heading") : undefined}
      onPointerEnter={loadRenderer}
      onFocusCapture={loadRenderer}
      className="rounded-[1.5rem] border border-line bg-surface p-4 shadow-[0_24px_60px_-20px_rgb(21_25_54/0.22)] sm:p-7"
    >
      {heading && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span aria-hidden className="grid h-10 w-10 place-items-center rounded-xl bg-brand-gradient font-display text-lg font-bold italic text-white shadow-glow">
              ∫
            </span>
            <h2 id={id("heading")} className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {heading}
            </h2>
          </div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent-strong">
            <ShieldCheck aria-hidden className="h-3.5 w-3.5" /> Runs in your browser
          </p>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        {operations.length > 1 && <OperationPicker tabs={tabs} more={moreOps} operation={operation} onChange={setOperation} name={id("operation")} />}

        <div className={`mt-4 grid grid-cols-2 gap-3 ${isImplicit ? "sm:grid-cols-[minmax(0,1fr)_auto]" : "sm:grid-cols-[minmax(0,1fr)_6.5rem_auto]"}`}>
          <div className="col-span-2 min-w-0 sm:col-span-1">
            <label htmlFor={id("expr")} className={labelClass}>
              {isImplicit ? "Equation in x and y" : isPartial ? "Function of several variables" : `Function f(${v})`}
            </label>
            <div className="relative mt-1">
              <input
                ref={inputRef}
                id={id("expr")}
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder={isImplicit ? "e.g. x^2 + y^2 = 25" : isPartial ? "e.g. x^2 y + sin(x y)" : "e.g. x^2 sin(x)"}
                value={fields.expression}
                onChange={(e) => set("expression", e.target.value)}
                aria-describedby={id("preview")}
                className={`${inputClass} h-12 pr-12 font-mono text-base`}
              />
              <button
                type="button"
                onClick={() => setKeypad((k) => !k)}
                aria-expanded={keypad}
                aria-controls={id("keypad")}
                aria-label={keypad ? "Hide keypad" : "Show keypad"}
                title={keypad ? "Hide keypad" : "Show keypad"}
                className={`absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg transition-colors ${
                  keypad ? "bg-accent-soft text-accent-strong" : "text-muted hover:bg-sunken hover:text-ink"
                }`}
              >
                <Keyboard aria-hidden className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div hidden={isImplicit} className="min-w-0">
            <label htmlFor={id("var")} className={labelClass}>
              {isPartial ? "With respect to" : "Variable"}
            </label>
            <select id={id("var")} value={v} onChange={(e) => set("variable", e.target.value)} className={`${inputClass} mt-1 h-12`}>
              {VARIABLES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className={`flex items-end ${isImplicit ? "col-span-2 sm:col-span-1" : ""}`}>
            <button
              type="submit"
              disabled={state.status === "solving"}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient px-8 font-semibold text-white shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-gradient-hover disabled:translate-y-0 disabled:opacity-70 sm:w-auto"
            >
              {state.status === "solving" ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Play aria-hidden className="h-4 w-4 fill-current" />}
              {state.status === "solving" ? "Solving…" : "Solve"}
            </button>
          </div>
        </div>

        <div id={id("keypad")} hidden={!keypad} className="mt-3">
          <Keypad onInsert={insert} />
        </div>

        <div id={id("preview")} aria-live="polite" className="mt-3 flex min-h-14 items-center rounded-xl border border-dashed border-line-strong bg-paper px-3.5 py-2">
          {!preview && <span className="text-sm text-muted">Your expression will be shown here as it will be read.</span>}
          {preview?.ok && (
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <span className="shrink-0 rounded-md bg-accent-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent-strong">Reads as</span>
              <MathView latex={preview.latex} display className="math-left min-w-0 flex-1" />
            </span>
          )}
          {preview && !preview.ok && <span className="text-sm text-danger">{preview.message}</span>}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-x-4">
          <OperationOptions operation={operation} fields={fields} set={set} id={id} />
          <button
            type="button"
            onClick={() => {
              setFields(startFields);
              reset();
              inputRef.current?.focus();
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-line-strong px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-accent/50 hover:bg-accent-soft hover:text-accent-strong"
          >
            <RotateCcw aria-hidden className="h-4 w-4" /> Reset
          </button>
        </div>

        <p className="mt-4 flex items-start gap-2 text-sm text-muted">
          <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
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
                  className="rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-xs text-ink-soft transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent-strong"
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

/**
 * Operation tabs: a radio group, so arrow keys and screen readers work natively.
 * Operations beyond the tabs sit in a "More tools" menu that belongs to the same group.
 */
function OperationPicker({
  tabs,
  more,
  operation,
  onChange,
  name,
}: {
  tabs: Operation[];
  more: Operation[];
  operation: Operation;
  onChange: (op: Operation) => void;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const moreActive = more.includes(operation);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const tabClass = (active: boolean) =>
    `relative flex min-w-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2 ${
      active ? "bg-brand-gradient text-white shadow-glow" : "bg-sunken text-ink-soft hover:bg-accent-soft hover:text-accent-strong"
    }`;
  const symbol = (op: Operation, active: boolean) => (
    <span aria-hidden className={`font-display text-[13px] italic ${active ? "text-white/90" : "text-accent-strong"}`}>
      {OPERATION_SYMBOLS[op]}
    </span>
  );

  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Operation</legend>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {tabs.map((op) => (
          <label key={op} className={`${tabClass(op === operation)} sm:flex-1`}>
            <input type="radio" name={name} value={op} checked={op === operation} onChange={() => onChange(op)} className="sr-only" />
            {symbol(op, op === operation)}
            {TAB_LABELS[op] ?? OPERATION_LABELS[op]}
          </label>
        ))}
        {more.length > 0 && (
          <div ref={menuRef} className="relative col-span-2 sm:flex-1">
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`${name}-more`}
              onClick={() => setOpen((o) => !o)}
              className={`${tabClass(moreActive)} w-full`}
            >
              {moreActive ? OPERATION_LABELS[operation] : "More tools"}
              <ChevronDown aria-hidden className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>
            <div
              id={`${name}-more`}
              hidden={!open}
              className="absolute right-0 top-full z-20 mt-2 w-full min-w-64 rounded-2xl border border-line bg-surface p-1.5 shadow-2xl shadow-navy-950/15 sm:w-64"
            >
              {more.map((op) => (
                <label
                  key={op}
                  className={`relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                    op === operation ? "bg-accent-soft text-accent-strong" : "text-ink-soft hover:bg-sunken"
                  }`}
                >
                  <input
                    type="radio"
                    name={name}
                    value={op}
                    checked={op === operation}
                    onChange={() => {
                      onChange(op);
                      setOpen(false);
                    }}
                    className="sr-only"
                  />
                  <span aria-hidden className="grid h-8 w-11 shrink-0 place-items-center rounded-lg bg-accent-soft font-display text-xs italic text-accent-strong">
                    {OPERATION_SYMBOLS[op]}
                  </span>
                  {OPERATION_LABELS[op]}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </fieldset>
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
    case "partial-derivative":
      return (
        <div className="mt-4 max-w-xs">
          <label htmlFor={id("var2")} className={labelClass}>
            Then with respect to <span className="font-normal text-muted">(optional, for second partials)</span>
          </label>
          <select id={id("var2")} value={fields.variable2} onChange={(e) => set("variable2", e.target.value)} className={`${inputClass} mt-1`}>
            <option value="">None (first partial)</option>
            {VARIABLES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      );
    case "implicit":
      return (
        <div className="mt-4 max-w-md">
          <label htmlFor={id("ipoint")} className={labelClass}>
            At the point <span className="font-normal text-muted">(optional)</span>
          </label>
          <input id={id("ipoint")} value={fields.implicitPoint} onChange={(e) => set("implicitPoint", e.target.value)} className={small} placeholder="e.g. 3, 4" />
          <p className="mt-1 text-xs text-muted">Finds dy/dx. Add a point on the curve to get the slope and tangent line there.</p>
        </div>
      );
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
                  className={`relative cursor-pointer rounded-xl border px-3 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                    fields.side === value ? "border-accent bg-accent-soft font-medium text-accent-strong" : "border-line text-ink-soft hover:bg-sunken"
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
