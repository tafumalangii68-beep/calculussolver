// Entry point used by the UI (inside a Web Worker) and by the unit tests.
// Validates the request, runs the right engine, and packages a result with
// steps, notes and an honest verification status.

import type { ResultCheck, SolveRequest, SolveResult, SolveSuccess, StepSection } from "@/types/solver";
import { add, contains, freeSymbols, isNum, mul, num, pow, sym, type Node } from "./ast";
import { findCriticalPoints } from "./critical";
import { differentiate, differentiateWithSteps } from "./derivative";
import { MathError } from "./errors";
import { evalAt, evaluate } from "./evaluate";
import { checkAntiderivative, findAntiderivative } from "./integral";
import { computeLimit, limitExact, limitNumber } from "./limit";
import { findRoots, findSingularity, formatNumber, integrateNumeric, SAMPLE_POINTS } from "./numeric";
import { parse, parseEquation, parseIn, parsePoint, type PointValue } from "./parser";
import { toLatex, toText } from "./print";
import { bestForm, cancelCommonContent, simplify, substituteExact } from "./simplify";
import { taylorPolynomial } from "./taylor";

export const VARIABLES = ["x", "t", "y", "z", "u", "θ"] as const;
export const MAX_DERIVATIVE_ORDER = 10;

const ORDINALS = ["", "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"];

function vTex(v: string): string {
  return v === "θ" ? "\\theta" : v;
}

function pointTex(p: PointValue): string {
  return p.kind === "inf" ? (p.sign > 0 ? "\\infty" : "-\\infty") : toLatex(simplify(p.node));
}

function pointNumber(p: PointValue): number {
  return p.kind === "inf" ? p.sign * Infinity : evaluate(p.node);
}

function approxOf(n: Node): string | undefined {
  if (n.k === "num" && n.v.d === 1) return undefined;
  const value = evaluate(n);
  return Number.isFinite(value) ? formatNumber(value) : undefined;
}

function wrapped(f: Node): string {
  return f.k === "add" ? `\\left(${toLatex(f)}\\right)` : toLatex(f);
}

// ---------- derivative ----------

/** Fixed, unremarkable values for letters other than the variable (used only in numerical checks). */
function paramEnv(nodes: Node[], exclude: string[]): Record<string, number> {
  const env: Record<string, number> = {};
  const names = [...new Set(nodes.flatMap((n) => [...freeSymbols(n)]))].filter((s) => !exclude.includes(s));
  names.forEach((s, i) => (env[s] = 1.37 + 0.41 * i));
  return env;
}

/** Compares d/dv of `previous` (by a central finite difference) with `current` at sample points. */
function finiteDifferenceCheck(previous: Node, current: Node, v: string): ResultCheck | undefined {
  const env = paramEnv([previous, current], [v]);
  let agree = 0;
  let bad = false;
  for (const x of SAMPLE_POINTS) {
    const h = 1e-5 * Math.max(1, Math.abs(x));
    const fd = (evaluate(previous, { ...env, [v]: x + h }) - evaluate(previous, { ...env, [v]: x - h })) / (2 * h);
    const exact = evaluate(current, { ...env, [v]: x });
    if (!Number.isFinite(fd) || !Number.isFinite(exact) || Math.abs(exact) > 1e6) continue;
    if (Math.abs(fd - exact) > 1e-4 * Math.max(1, Math.abs(exact))) bad = true;
    else agree++;
  }
  if (bad) {
    return { status: "warning", message: "A numerical spot check disagreed at one or more points (this can happen near discontinuities). Please double-check this result." };
  }
  return agree >= 3 ? { status: "verified", message: `Checked numerically: the result matches a finite-difference estimate at ${agree} sample points.` } : undefined;
}

function solveDerivative(req: SolveRequest): SolveSuccess {
  const { node, notes } = parse(req.expression);
  const v = req.variable;
  const order = req.order ?? 1;
  if (!Number.isInteger(order) || order < 1 || order > MAX_DERIVATIVE_ORDER) {
    throw new MathError(`Choose a derivative order between 1 and ${MAX_DERIVATIVE_ORDER}.`);
  }
  const params = [...freeSymbols(node)].filter((s) => s !== v);
  if (params.length) notes.push(`${params.join(", ")} ${params.length > 1 ? "are" : "is"} treated as ${params.length > 1 ? "constants" : "a constant"}.`);
  if (!contains(node, v)) notes.push(`The expression does not contain ${v}, so it is constant with respect to ${v}.`);

  const sections: StepSection[] = [];
  let current = node;
  let previous = node;
  for (let k = 1; k <= order; k++) {
    const { result, steps, truncated } = differentiateWithSteps(current, v);
    sections.push({
      title: order === 1 ? "Differentiate" : `${ORDINALS[k] ?? `Order ${k}`} derivative`,
      steps: [
        ...steps,
        { rule: "Simplify", latex: `${k === 1 ? "f'" : `f^{(${k})}`}(${vTex(v)}) = ${toLatex(result)}`, depth: 0 },
      ],
      truncated,
    });
    previous = current;
    current = result;
  }

  const check = finiteDifferenceCheck(previous, current, v);

  const dLabel = order === 1 ? `\\frac{d}{d${vTex(v)}}` : `\\frac{d^{${order}}}{d${vTex(v)}^{${order}}}`;
  return {
    ok: true,
    operation: "derivative",
    problemLatex: `${dLabel}\\left[${toLatex(node)}\\right]`,
    answerLatex: toLatex(current),
    answerText: toText(current),
    method: "Symbolic differentiation with the sum, product, quotient, power and chain rules.",
    sections,
    notes,
    check,
  };
}

// ---------- integrals ----------

function antiderivativeSections(steps: SolveSuccess["sections"][number]["steps"], method: "rules" | "cas", truncated: boolean): StepSection[] {
  if (method === "cas") {
    return [{
      title: "Find an antiderivative",
      steps: [{
        rule: "Computer algebra",
        latex: "\\text{Found with the bundled computer algebra engine}",
        note: "Step-by-step working is not available for this integral, but the result was checked by differentiating it.",
        depth: 0,
      }],
    }];
  }
  return [{ title: "Find an antiderivative", steps, truncated }];
}

function checkFor(status: ReturnType<typeof checkAntiderivative>): ResultCheck {
  return status === "verified"
    ? { status: "verified", message: "Verified: differentiating the answer gives back the integrand at every sample point checked." }
    : { status: "warning", message: "The result could not be fully checked numerically (too few points in the function's domain). Please verify it by differentiating." };
}

async function solveIndefinite(req: SolveRequest): Promise<SolveResult> {
  const { node, notes } = parse(req.expression);
  const v = req.variable;
  const params = [...freeSymbols(node)].filter((s) => s !== v);
  if (params.length) notes.push(`${params.join(", ")} ${params.length > 1 ? "are" : "is"} treated as ${params.length > 1 ? "constants" : "a constant"}.`);
  const outcome = await findAntiderivative(node, v);
  if (outcome.kind === "nonelementary") {
    return {
      ok: false,
      error: "This integral has no antiderivative that can be written with elementary functions.",
      hint: "Integrals such as ∫e^(x²) dx or ∫sin(x)/x dx are defined by special functions. Use the definite integral option to get a numerical value over an interval.",
    };
  }
  if (outcome.kind === "notfound") {
    return {
      ok: false,
      error: "The solver could not find an antiderivative for this expression.",
      hint: "Either no elementary antiderivative exists, or it needs a technique this solver does not support. A definite integral can still be evaluated numerically.",
    };
  }
  notes.push("C is an arbitrary constant of integration. Your textbook's answer may look different but still be equivalent (it may differ by a constant).");
  if (outcome.result && containsAbsLog(outcome.result)) notes.push("ln|u| is used so the result is valid on every interval where the integrand is defined.");
  return {
    ok: true,
    operation: "indefinite-integral",
    problemLatex: `\\int ${wrapped(node)}\\,d${vTex(v)}`,
    answerLatex: `${toLatex(outcome.result)} + C`,
    answerText: `${toText(outcome.result)} + C`,
    method: outcome.method === "rules"
      ? "Rule-based symbolic integration (standard forms, substitution, integration by parts, partial fractions)."
      : "Bundled computer algebra system, verified by differentiation.",
    sections: antiderivativeSections(outcome.steps, outcome.method, outcome.truncated),
    notes,
    check: checkFor(outcome.check),
  };
}

function containsAbsLog(n: Node): boolean {
  return toLatex(n).includes("\\ln\\left(\\left|");
}

/** F evaluated at a bound: exact substitution, or a one-sided/at-infinity limit. */
function evaluateAtBound(F: Node, v: string, bound: PointValue, side: "left" | "right"): { exact: Node | null; value: number } {
  if (bound.kind === "inf") {
    const exact = limitExact(F, v, bound.sign);
    return { exact, value: exact ? evaluate(exact) : limitNumber(F, v, bound.sign) };
  }
  try {
    const exact = substituteExact(F, v, bound.node);
    const value = evaluate(exact);
    if (Number.isFinite(value) && !contains(exact, v)) return { exact, value };
  } catch (err) {
    if (!(err instanceof MathError)) throw err;
  }
  const lim = computeLimit(F, v, bound, side);
  if (lim.value.kind === "finite") return { exact: lim.method === "symbolic" ? lim.value.exact : null, value: lim.value.approx };
  if (lim.value.kind === "inf") return { exact: null, value: lim.value.sign * Infinity };
  return { exact: null, value: NaN };
}

async function solveDefinite(req: SolveRequest): Promise<SolveResult> {
  const v = req.variable;
  const { node, notes } = parseIn(req.expression, v);
  const lower = parsePoint(req.lower ?? "", "lower bound");
  const upper = parsePoint(req.upper ?? "", "upper bound");
  const a = pointNumber(lower);
  const b = pointNumber(upper);
  if (!Number.isFinite(a) && !Number.isFinite(b) && a === b) throw new MathError("The bounds cannot both be the same infinity.");
  const f = simplify(node);
  const fx = (x: number) => evalAt(f, v, x);
  const problemLatex = `\\int_{${pointTex(lower)}}^{${pointTex(upper)}} ${wrapped(node)}\\,d${vTex(v)}`;
  const [lo, hi] = a <= b ? [a, b] : [b, a];
  const improper = !Number.isFinite(a) || !Number.isFinite(b);

  // Interior singularities make the Fundamental Theorem of Calculus inapplicable.
  const inner = (x: number) => (x <= lo || x >= hi ? 0 : fx(x));
  const singular = findSingularity(inner, lo, hi);
  const numeric = singular === null
    ? integrateNumeric(fx, a, b)
    : (() => {
        const left = integrateNumeric(fx, a, singular);
        const right = integrateNumeric(fx, singular, b);
        return { value: left.value + right.value, ok: left.ok && right.ok, reason: left.reason ?? right.reason };
      })();
  if (singular !== null) {
    notes.push(`The integrand is unbounded or undefined near ${v} ≈ ${formatNumber(singular, 6)} inside the interval, so this is an improper integral.`);
  }

  const sections: StepSection[] = [];
  let exact: Node | null = null;
  let exactValue = NaN;
  let diverges = false;
  const outcome = singular === null ? await findAntiderivative(node, v) : null;

  if (outcome?.kind === "found") {
    sections.push(...antiderivativeSections(outcome.steps, outcome.method, outcome.truncated));
    const Fb = evaluateAtBound(outcome.result, v, upper, "left");
    const Fa = evaluateAtBound(outcome.result, v, lower, "right");
    exactValue = Fb.value - Fa.value;
    if (Fb.exact && Fa.exact) exact = simplify(add(Fb.exact, mul(num(-1), Fa.exact)));
    diverges = !Number.isFinite(Fb.value) || !Number.isFinite(Fa.value);
    const F = toLatex(outcome.result);
    const evalTex = (r: { exact: Node | null; value: number }) =>
      r.exact ? toLatex(r.exact) : Number.isFinite(r.value) ? formatNumber(r.value) : r.value > 0 ? "\\infty" : "-\\infty";
    sections.push({
      title: "Apply the Fundamental Theorem of Calculus",
      steps: [
        {
          rule: improper ? "Evaluate with limits" : "Evaluate F(b) − F(a)",
          latex: `\\left[${F}\\right]_{${pointTex(lower)}}^{${pointTex(upper)}} = \\left(${evalTex(Fb)}\\right) - \\left(${evalTex(Fa)}\\right)${exact ? ` = ${toLatex(exact)}` : ""}`,
          note: improper ? "At an infinite bound (or where F is undefined), F is replaced by its limit." : "∫ₐᵇ f(x) dx = F(b) − F(a), where F is any antiderivative.",
          depth: 0,
        },
      ],
    });
  }

  const tolerance = (x: number) => 1e-6 * Math.max(1, Math.abs(x));
  if (diverges || (!numeric.ok && (outcome?.kind !== "found" || !Number.isFinite(exactValue)))) {
    return {
      ok: true,
      operation: "definite-integral",
      problemLatex,
      answerLatex: "\\text{diverges}",
      answerText: "diverges",
      method: "The antiderivative and/or the numerical integration show the area is not finite.",
      sections,
      notes: [...notes, numeric.reason ?? "The integral does not converge to a finite value."],
      check: { status: "numeric", message: "Divergence was detected numerically and from the antiderivative where available." },
    };
  }

  if (outcome?.kind === "found" && Number.isFinite(exactValue)) {
    const agrees = !numeric.ok || Math.abs(exactValue - numeric.value) <= tolerance(numeric.value) * 100;
    if (agrees) {
      const answer = exact ?? null;
      return {
        ok: true,
        operation: "definite-integral",
        problemLatex,
        answerLatex: answer ? toLatex(answer) : `\\approx ${formatNumber(exactValue)}`,
        answerText: answer ? toText(answer) : formatNumber(exactValue),
        approx: answer ? approxOf(answer) : undefined,
        method: "Antiderivative + Fundamental Theorem of Calculus, cross-checked with numerical integration.",
        sections,
        notes,
        check: numeric.ok
          ? { status: "verified", message: `Cross-checked: numerical integration gives ${formatNumber(numeric.value)}.` }
          : { status: "warning", message: "Numerical integration did not converge, so only the symbolic result is shown." },
      };
    }
    notes.push("The symbolic result disagreed with numerical integration, so only the numerical value is shown.");
  } else if (outcome?.kind === "nonelementary" || outcome?.kind === "notfound") {
    notes.push(outcome.kind === "nonelementary"
      ? "This integrand has no elementary antiderivative, so the value is computed numerically."
      : "No antiderivative was found, so the value is computed numerically.");
  }

  sections.push({
    title: "Numerical integration",
    steps: [{
      rule: "Tanh-sinh quadrature",
      latex: `${problemLatex} \\approx ${formatNumber(numeric.value)}`,
      note: "A high-accuracy numerical method that samples the integrand densely near the endpoints.",
      depth: 0,
    }],
  });
  return {
    ok: true,
    operation: "definite-integral",
    problemLatex,
    answerLatex: `\\approx ${formatNumber(numeric.value)}`,
    answerText: formatNumber(numeric.value),
    method: "Numerical integration (tanh-sinh quadrature).",
    sections,
    notes,
    check: { status: "numeric", message: "This is a numerical approximation, typically accurate to about 10 significant digits." },
  };
}

// ---------- limits ----------

function solveLimit(req: SolveRequest): SolveResult {
  const v = req.variable;
  const { node, notes } = parseIn(req.expression, v);
  const point = parsePoint(req.point ?? "", "approach value");
  const side = point.kind === "inf" ? "both" : req.side ?? "both";
  const out = computeLimit(node, v, point, side);
  const sideTex = side === "left" ? "^{-}" : side === "right" ? "^{+}" : "";
  const problemLatex = `\\lim_{${vTex(v)} \\to ${pointTex(point)}${sideTex}} ${toLatex(node)}`;
  const sections: StepSection[] = out.steps.length ? [{ title: "Evaluate the limit", steps: out.steps }] : [];
  const value = out.value;

  if (value.kind === "unknown") {
    return { ok: false, error: "The solver could not determine this limit.", hint: value.reason };
  }
  let answerLatex: string;
  let answerText: string;
  let approx: string | undefined;
  if (value.kind === "finite") {
    answerLatex = value.exact ? toLatex(value.exact) : `\\approx ${formatNumber(value.approx)}`;
    answerText = value.exact ? toText(value.exact) : formatNumber(value.approx);
    approx = value.exact ? approxOf(value.exact) : undefined;
  } else if (value.kind === "inf") {
    answerLatex = value.sign > 0 ? "\\infty" : "-\\infty";
    answerText = value.sign > 0 ? "infinity" : "-infinity";
    notes.push("Strictly speaking, a limit of ±∞ means the limit does not exist as a finite number; the function grows without bound.");
  } else {
    answerLatex = "\\text{does not exist}";
    answerText = "does not exist";
    notes.unshift(value.reason);
  }
  return {
    ok: true,
    operation: "limit",
    problemLatex,
    answerLatex,
    answerText,
    approx,
    method: out.method === "symbolic"
      ? "Symbolic evaluation (substitution, algebra, L'Hôpital's rule), confirmed numerically."
      : "Numerical evaluation from the requested side(s).",
    sections,
    notes: [...notes, ...out.notes],
    check: out.method === "symbolic"
      ? { status: "verified", message: "Confirmed by evaluating the function numerically close to the point." }
      : { status: "numeric", message: "Based on numerical evaluation; no symbolic method completed for this limit." },
  };
}

// ---------- Taylor ----------

function solveTaylor(req: SolveRequest): SolveResult {
  const v = req.variable;
  const { node, notes } = parseIn(req.expression, v);
  const center = parsePoint(req.point ?? "0", "center");
  if (center.kind === "inf") throw new MathError("A Taylor polynomial needs a finite center, such as 0 or 1.");
  const order = req.order ?? 5;
  const a = simplify(center.node);
  const { polynomial, table } = taylorPolynomial(node, v, a, order);
  const isMaclaurin = a.k === "num" && a.v.n === 0;
  const shiftTex = isMaclaurin ? vTex(v) : `\\left(${toLatex(simplify(add(sym(v), mul(num(-1), a))))}\\right)`;
  const general = `f(${vTex(v)}) \\approx \\sum_{k=0}^{${order}} \\frac{f^{(k)}(${toLatex(a)})}{k!}${isMaclaurin ? `${vTex(v)}^{k}` : `${shiftTex}^{k}`}`;

  // Accuracy illustration near the center.
  const x0 = evaluate(a) + 0.1;
  const fv = evalAt(node, v, x0);
  const pv = evalAt(polynomial, v, x0);
  if (Number.isFinite(fv) && Number.isFinite(pv)) {
    notes.push(`Near the center the polynomial is accurate: at ${v} = ${formatNumber(x0, 6)}, f = ${formatNumber(fv, 10)} and the polynomial gives ${formatNumber(pv, 10)}.`);
  }
  notes.push(`The remaining terms are of order ${shiftTex.replace(/\\left|\\right/g, "")}^${order + 1} and higher.`);
  return {
    ok: true,
    operation: "taylor",
    problemLatex: `T_{${order}}(${vTex(v)}) \\text{ for } ${toLatex(node)} \\text{ about } ${vTex(v)} = ${toLatex(a)}`,
    answerLatex: toLatex(polynomial),
    answerText: toText(polynomial),
    method: `${isMaclaurin ? "Maclaurin" : "Taylor"} polynomial from exact derivatives at the center.`,
    sections: [{
      title: "Build the polynomial",
      steps: [
        { rule: "Taylor formula", latex: general, note: "Each coefficient is the k-th derivative at the center divided by k!.", depth: 0 },
        { rule: "Collect the terms", latex: `T_{${order}}(${vTex(v)}) = ${toLatex(polynomial)}`, depth: 0 },
      ],
    }],
    notes,
    table,
    check: { status: "verified", message: "Every coefficient comes from an exact derivative evaluated at the center." },
  };
}

// ---------- critical points ----------

function solveCritical(req: SolveRequest): SolveResult {
  const v = req.variable;
  const { node, notes } = parseIn(req.expression, v);
  const lo = parsePoint(req.rangeMin ?? "-10", "interval start");
  const hi = parsePoint(req.rangeMax ?? "10", "interval end");
  if (lo.kind === "inf" || hi.kind === "inf") throw new MathError("Use a finite search interval, for example from -10 to 10.");
  const loN = evaluate(lo.node);
  const hiN = evaluate(hi.node);
  const f = simplify(node);
  const { result: f1, steps, truncated } = differentiateWithSteps(node, v);
  const f2 = differentiate(f1, v);
  const { points, table } = findCriticalPoints(f, f1, f2, v, loN, hiN);

  if (/sin|cos|tan|sec|csc|cot/.test(req.expression)) {
    notes.push("Trigonometric functions can have infinitely many critical points; only those inside the search interval are listed.");
  }
  if (points.some((p) => !p.exact)) notes.push("Points marked ≈ were found numerically (accurate to about 10 digits).");
  notes.push(`Only points inside [${formatNumber(loN)}, ${formatNumber(hiN)}] are searched. Change the interval to look elsewhere.`);

  const answerLatex = points.length
    ? points.map((p) => `${vTex(v)} = ${p.exact ? toLatex(p.exact) : `\\approx ${formatNumber(p.x, 8)}`}`).join(",\\quad ")
    : `\\text{No critical points in } [${formatNumber(loN)}, ${formatNumber(hiN)}]`;
  const answerText = points.length
    ? points.map((p) => `${v} = ${p.exact ? toText(p.exact) : formatNumber(p.x, 8)} (${p.type})`).join("; ")
    : "No critical points in the interval";

  return {
    ok: true,
    operation: "critical-points",
    problemLatex: `\\text{Critical points of } f(${vTex(v)}) = ${toLatex(node)}`,
    answerLatex,
    answerText,
    method: "Solve f′(x) = 0 (exactly for polynomial factors, numerically otherwise), add points where f′ is undefined, then classify.",
    sections: [
      { title: "Differentiate", steps: [...steps, { rule: "Result", latex: `f'(${vTex(v)}) = ${toLatex(f1)}`, depth: 0 }], truncated },
      {
        title: "Solve and classify",
        steps: [
          { rule: "Set the derivative to zero", latex: `${toLatex(f1)} = 0`, note: "Critical points are where f′ is zero or undefined while f is defined.", depth: 0 },
          { rule: "Second derivative", latex: `f''(${vTex(v)}) = ${toLatex(f2)}`, note: "f″ > 0 means a local minimum, f″ < 0 a local maximum; if f″ = 0, the sign change of f′ decides.", depth: 0 },
        ],
      },
    ],
    notes,
    table,
    check: { status: "verified", message: "Each point was confirmed by evaluating f′ there." },
  };
}

// ---------- partial derivatives ----------

function solvePartial(req: SolveRequest): SolveSuccess {
  const { node, notes } = parse(req.expression);
  const order = req.variable2 ? [req.variable, req.variable2] : [req.variable];
  for (const w of order) {
    if (!VARIABLES.includes(w as (typeof VARIABLES)[number])) throw new MathError("Choose a supported variable.");
  }
  const letters = [...freeSymbols(node)];
  notes.push(
    `When differentiating with respect to ${order[0]}, every other letter${letters.length > 1 ? ` (${letters.filter((s) => s !== order[0]).join(", ")})` : ""} is treated as a constant.`,
  );
  if (order.length === 2 && order[0] !== order[1]) {
    notes.push(`For functions with continuous second partial derivatives, the order does not matter: f_${order[0]}${order[1]} = f_${order[1]}${order[0]} (Clairaut's theorem).`);
  }

  const sections: StepSection[] = [];
  const checks: (ResultCheck | undefined)[] = [];
  let current = node;
  let subscript = "";
  for (const w of order) {
    if (!contains(current, w)) notes.push(`At this stage the expression does not contain ${w}, so its partial derivative with respect to ${w} is 0.`);
    const { result, steps, truncated } = differentiateWithSteps(current, w, { partial: true });
    subscript += vTex(w);
    sections.push({
      title: `Differentiate with respect to ${w} (other variables held constant)`,
      steps: [...steps, { rule: "Simplify", latex: `f_{${subscript}} = ${toLatex(result)}`, depth: 0 }],
      truncated,
    });
    checks.push(finiteDifferenceCheck(current, result, w));
    current = result;
  }

  const [v, w] = order.map(vTex);
  const problemLatex = order.length === 1
    ? `\\frac{\\partial}{\\partial ${v}}\\left[${toLatex(node)}\\right]`
    : `\\frac{\\partial^{2}}{${v === w ? `\\partial ${v}^{2}` : `\\partial ${w}\\,\\partial ${v}`}}\\left[${toLatex(node)}\\right]`;
  const warning = checks.find((c) => c?.status === "warning");
  const check: ResultCheck | undefined = warning ?? (checks.every((c) => c?.status === "verified")
    ? { status: "verified", message: "Checked numerically: each partial derivative matches a finite-difference estimate, with the other variables held fixed." }
    : undefined);

  return {
    ok: true,
    operation: "partial-derivative",
    problemLatex,
    answerLatex: `f_{${subscript}} = ${toLatex(current)}`,
    answerText: toText(current),
    method: "Partial differentiation: the usual derivative rules, with every other variable treated as a constant.",
    sections,
    notes,
    check,
  };
}

// ---------- implicit differentiation ----------

/** Parses "3, 4" or "(3, 4)" into two exact numbers. */
function parsePair(input: string): [Node, Node] {
  let text = input.trim();
  if (text.startsWith("(") && text.endsWith(")")) text = text.slice(1, -1);
  let depth = 0;
  let split = -1;
  for (let i = 0; i < text.length; i++) {
    if ("([{".includes(text[i])) depth++;
    else if (")]}".includes(text[i])) depth--;
    else if (text[i] === "," && depth === 0) {
      if (split >= 0) split = -2;
      else split = i;
    }
  }
  if (split < 0) throw new MathError("Enter the point as two numbers separated by a comma, for example 3, 4.");
  const [a, b] = [text.slice(0, split), text.slice(split + 1)].map((s, i) => parsePoint(s, i === 0 ? "x-coordinate" : "y-coordinate"));
  if (a.kind !== "finite" || b.kind !== "finite") throw new MathError("The point must have finite coordinates.");
  return [simplify(a.node), simplify(b.node)];
}

/** Checks dy/dx numerically by following the curve F(x, y) = 0 a tiny step either side of points on it. */
function implicitCheck(F: Node, Fy: Node, dydx: Node, env: Record<string, number>, extra: [number, number] | null): ResultCheck | undefined {
  const at = (n: Node, x: number, y: number) => evaluate(n, { ...env, x, y });
  const newton = (x: number, start: number): number | null => {
    let y = start;
    for (let i = 0; i < 40; i++) {
      const f = at(F, x, y);
      const d = at(Fy, x, y);
      if (!Number.isFinite(f) || !Number.isFinite(d) || d === 0) return null;
      const step = f / d;
      y -= step;
      if (Math.abs(step) < 1e-13 * Math.max(1, Math.abs(y))) return y;
    }
    return Math.abs(at(F, x, y)) < 1e-9 ? y : null;
  };
  const points: [number, number][] = extra ? [extra] : [];
  for (const x0 of [-2.3, -1.1, -0.4, 0.6, 1.4, 2.2, 3.1]) {
    const roots = findRoots((t) => at(F, x0, t), -20, 20, 2000);
    if (roots.length) points.push([x0, roots[0]]);
  }
  let agree = 0;
  for (const [x0, y0] of points) {
    const slope = at(dydx, x0, y0);
    if (!Number.isFinite(slope) || Math.abs(slope) > 1e6) continue;
    const h = 1e-5 * Math.max(1, Math.abs(x0));
    const yp = newton(x0 + h, y0);
    const ym = newton(x0 - h, y0);
    if (yp === null || ym === null) continue;
    const fd = (yp - ym) / (2 * h);
    if (Math.abs(fd - slope) > 1e-4 * Math.max(1, Math.abs(slope))) {
      return { status: "warning", message: "A numerical check along the curve disagreed at one point. Please double-check this result." };
    }
    agree++;
  }
  return agree >= 2
    ? { status: "verified", message: `Checked numerically: following the curve a tiny step either side of ${agree} points on it gives the same slope.` }
    : undefined;
}

function solveImplicit(req: SolveRequest): SolveSuccess {
  const { lhs, rhs, notes } = parseEquation(req.expression);
  const x = "x";
  const y = "y";
  const F = simplify(add(lhs, mul(num(-1), rhs)));
  if (!contains(F, y)) {
    throw new MathError(
      "The equation does not contain y, so there is nothing to differentiate implicitly.",
      "Enter an equation relating x and y, such as x^2 + y^2 = 25. For an ordinary function of x, use the derivative calculator.",
    );
  }
  const params = [...freeSymbols(F)].filter((s) => s !== x && s !== y);
  if (params.length) notes.push(`${params.join(", ")} ${params.length > 1 ? "are" : "is"} treated as ${params.length > 1 ? "constants" : "a constant"}.`);

  const fx = differentiateWithSteps(F, x, { partial: true });
  const fy = differentiateWithSteps(F, y, { partial: true });
  if (isNum(fy.result, 0)) throw new MathError("∂F/∂y is zero everywhere, so dy/dx cannot be found from this equation.");
  const dydx = cancelCommonContent(bestForm(mul(num(-1), fx.result, pow(fy.result, num(-1)))));

  const sections: StepSection[] = [
    {
      title: "Rewrite the equation as F(x, y) = 0",
      steps: [{
        rule: "Move every term to one side",
        latex: `${toLatex(lhs)} = ${toLatex(rhs)} \\;\\Longrightarrow\\; F(x, y) = ${toLatex(F)} = 0`,
        depth: 0,
      }],
    },
    {
      title: "Partial derivative with respect to x (y held constant)",
      steps: [...fx.steps, { rule: "Result", latex: `F_{x} = ${toLatex(fx.result)}`, depth: 0 }],
      truncated: fx.truncated,
    },
    {
      title: "Partial derivative with respect to y (x held constant)",
      steps: [...fy.steps, { rule: "Result", latex: `F_{y} = ${toLatex(fy.result)}`, depth: 0 }],
      truncated: fy.truncated,
    },
    {
      title: "Apply the implicit differentiation formula",
      steps: [{
        rule: "dy/dx = −F_x / F_y",
        latex: `\\frac{dy}{dx} = -\\frac{F_{x}}{F_{y}} = -\\frac{${toLatex(fx.result)}}{${toLatex(fy.result)}} = ${toLatex(dydx)}`,
        note: "This gives the same result as differentiating both sides with respect to x (treating y as a function of x) and solving for dy/dx.",
        depth: 0,
      }],
    },
  ];

  let answerLatex = `\\frac{dy}{dx} = ${toLatex(dydx)}`;
  let answerText = toText(dydx);
  let approx: string | undefined;
  let extra: [number, number] | null = null;

  if (req.point?.trim()) {
    const [x0, y0] = parsePair(req.point);
    const where = `(${toLatex(x0)}, ${toLatex(y0)})`;
    const env = paramEnv([F], [x, y]);
    if (params.length === 0) {
      const residual = evaluate(F, { ...env, x: evaluate(x0), y: evaluate(y0) });
      if (Math.abs(residual) > 1e-8 * Math.max(1, Math.abs(evaluate(lhs, { x: evaluate(x0), y: evaluate(y0) })))) {
        throw new MathError(
          `The point (${toText(x0)}, ${toText(y0)}) is not on the curve: substituting it gives F = ${formatNumber(residual, 6)} instead of 0.`,
          "Check the coordinates, or leave the point empty to get dy/dx in general.",
        );
      }
      extra = [evaluate(x0), evaluate(y0)];
    }
    let slope: Node;
    try {
      slope = substituteExact(substituteExact(dydx, x, x0), y, y0);
    } catch (err) {
      if (!(err instanceof MathError)) throw err;
      throw new MathError(
        `dy/dx is undefined at ${toText(x0)}, ${toText(y0)} because F_y = 0 there.`,
        "This usually means the curve has a vertical tangent at that point.",
      );
    }
    const intercept = simplify(add(y0, mul(num(-1), slope, x0)));
    const tangent = simplify(add(mul(slope, sym(x)), intercept));
    sections.push({
      title: `Evaluate at ${where.replace(/\\/g, "")}`,
      steps: [
        { rule: "Substitute the point", latex: `\\left.\\frac{dy}{dx}\\right|_{${where}} = ${toLatex(slope)}`, depth: 0 },
        { rule: "Tangent line", latex: `y - ${toLatex(y0)} = ${toLatex(slope)}\\left(x - ${toLatex(x0)}\\right) \\;\\Longrightarrow\\; y = ${toLatex(tangent)}`, note: "Point–slope form of the tangent line at this point.", depth: 0 },
      ],
    });
    answerLatex += `,\\qquad \\left.\\frac{dy}{dx}\\right|_{${where}} = ${toLatex(slope)}`;
    answerText = `dy/dx = ${answerText}; at (${toText(x0)}, ${toText(y0)}): ${toText(slope)}`;
    approx = approxOf(slope);
    notes.push(`Tangent line at the point: y = ${toText(tangent)}.`);
  }

  notes.push("dy/dx is written in terms of both x and y, which is normal for implicit differentiation.");
  return {
    ok: true,
    operation: "implicit",
    problemLatex: `\\frac{dy}{dx} \\text{ for } ${toLatex(lhs)} = ${toLatex(rhs)}`,
    answerLatex,
    answerText,
    approx,
    method: "Implicit differentiation with the formula dy/dx = −F_x / F_y, where F(x, y) = 0.",
    sections,
    notes,
    check: implicitCheck(F, fy.result, dydx, paramEnv([F], [x, y]), extra),
  };
}

// ---------- dispatcher ----------

export async function solve(req: SolveRequest): Promise<SolveResult> {
  try {
    if (!VARIABLES.includes(req.variable as (typeof VARIABLES)[number])) {
      throw new MathError("Choose a supported variable.");
    }
    switch (req.operation) {
      case "derivative":
        return solveDerivative(req);
      case "indefinite-integral":
        return await solveIndefinite(req);
      case "definite-integral":
        return await solveDefinite(req);
      case "limit":
        return solveLimit(req);
      case "taylor":
        return solveTaylor(req);
      case "critical-points":
        return solveCritical(req);
      case "partial-derivative":
        return solvePartial(req);
      case "implicit":
        return solveImplicit(req);
    }
  } catch (err) {
    if (err instanceof MathError) return { ok: false, error: err.message, hint: err.hint };
    if (err instanceof RangeError) {
      return { ok: false, error: "This problem is too large or deeply nested to solve here.", hint: "Try simplifying the expression." };
    }
    return { ok: false, error: "Something went wrong while solving this problem.", hint: "Check the expression for typos. If it looks correct, this may be a limitation of the solver." };
  }
}
