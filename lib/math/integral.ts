// Rule-based symbolic integration with recorded steps.
//
// Strategy order: constant rule, sum rule, constant multiple, table of standard
// forms (with linear inner arguments), rewriting/expansion, rational functions
// (long division, partial fractions, irreducible quadratics), u-substitution,
// and integration by parts. If every rule fails, a bundled computer algebra
// system (Algebrite) is tried. Every candidate is verified by differentiation.

import type { Step } from "@/types/solver";
import {
  ONE, add, contains, equals, fn, freeSymbols, isNum, mul, neg, num, numR, pow, replaceSubtree, size, subtrees, sym, type Node,
} from "./ast";
import { differentiate } from "./derivative";
import { MathError } from "./errors";
import { evaluate } from "./evaluate";
import { parse } from "./parser";
import { ALGEBRITE_PREFIX, toAlgebrite, toLatex } from "./print";
import { SAMPLE_POINTS } from "./numeric";
import * as P from "./polynomial";
import * as R from "./rational";
import { bestForm, expand, simplify, simplifyMul } from "./simplify";

const MAX_STEPS = 60;
const MAX_CALLS = 400;
const SUB_VARS = ["u", "w", "t", "s", "z"];

const abs = (u: Node) => fn("abs", u);
const ln = (u: Node) => fn("ln", u);
const frac = (a: Node, b: Node) => mul(a, pow(b, num(-1)));
const sqrtOf = (u: Node) => pow(u, num(1, 2));

interface TableHit {
  result: Node;
  rule: string;
  note?: string;
}

class Integrator {
  steps: Step[] = [];
  truncated = false;
  private calls = 0;

  constructor(private v: string, private record: boolean) {}

  private I(f: Node, v = this.v): string {
    const body = f.k === "add" ? `\\left(${toLatex(f)}\\right)` : toLatex(f);
    return `\\int ${body}\\,d${v === "θ" ? "\\theta" : v}`;
  }

  private open(depth: number): number {
    if (!this.record) return -1;
    if (this.steps.length >= MAX_STEPS) {
      this.truncated = true;
      return -1;
    }
    this.steps.push({ rule: "", latex: "", depth });
    return this.steps.length - 1;
  }

  private fill(slot: number, rule: string, parts: string[], note?: string): void {
    if (slot < 0) return;
    const unique = parts.filter((p, i) => i === 0 || p !== parts[i - 1]);
    this.steps[slot] = { ...this.steps[slot], rule, latex: unique.join(" = "), note };
  }

  private rollback(mark: number): void {
    this.steps.length = Math.min(this.steps.length, mark);
  }

  /** Linear coefficient a if u = a*v + b, otherwise null. */
  private linear(u: Node): Node | null {
    if (!contains(u, this.v)) return null;
    const d = differentiate(u, this.v);
    if (contains(d, this.v) || isNum(d, 0)) return null;
    return d;
  }

  integrate(f: Node, depth = 0): Node | null {
    if (depth > 10 || ++this.calls > MAX_CALLS) return null;
    f = simplify(f);
    const v = this.v;
    const mark = this.steps.length;
    const attempt = (strategy: () => Node | null): Node | null => {
      const r = strategy();
      if (!r) this.rollback(mark);
      return r;
    };

    if (!contains(f, v)) {
      const result = simplify(mul(f, sym(v)));
      const slot = this.open(depth);
      this.fill(slot, "Constant rule", [this.I(f), toLatex(result)], "The integral of a constant c is c·x.");
      return result;
    }

    return (
      (f.k === "add" ? attempt(() => this.sum(f as { k: "add"; terms: Node[] }, depth)) : null) ??
      (f.k === "mul" ? attempt(() => this.constantMultiple(f as { k: "mul"; factors: Node[] }, depth)) : null) ??
      attempt(() => this.fromTable(f, depth)) ??
      attempt(() => this.rewrite(f, depth)) ??
      attempt(() => this.rational(f, depth)) ??
      attempt(() => this.substitution(f, depth)) ??
      attempt(() => this.byParts(f, depth)) ??
      null
    );
  }

  private sum(f: { k: "add"; terms: Node[] }, depth: number): Node | null {
    const slot = this.open(depth);
    const parts: Node[] = [];
    for (const t of f.terms) {
      const r = this.integrate(t, depth + 1);
      if (!r) return null;
      parts.push(r);
    }
    const result = simplify(add(...parts));
    this.fill(slot, "Sum rule", [this.I(f), f.terms.map((t) => this.I(t)).join(" + ").replace(/\+ \\int -/g, "- \\int "), toLatex(result)], "Integrate each term separately.");
    return result;
  }

  private constantMultiple(f: { k: "mul"; factors: Node[] }, depth: number): Node | null {
    const consts = f.factors.filter((x) => !contains(x, this.v));
    if (!consts.length) return null;
    const vars = f.factors.filter((x) => contains(x, this.v));
    const c = simplifyMul(consts);
    const g = simplifyMul(vars);
    const slot = this.open(depth);
    const r = this.integrate(g, depth + 1);
    if (!r) return null;
    const result = simplify(mul(c, r));
    const cTex = isNum(c, -1) ? "-" : toLatex(c);
    this.fill(slot, "Constant multiple rule", [this.I(f), `${cTex}${this.I(g)}`, toLatex(result)], "Move constant factors outside the integral.");
    return result;
  }

  private fromTable(f: Node, depth: number): Node | null {
    const hit = this.table(f);
    if (!hit) return null;
    const result = simplify(hit.result);
    const slot = this.open(depth);
    this.fill(slot, hit.rule, [this.I(f), toLatex(result)], hit.note);
    return result;
  }

  private table(f: Node): TableHit | null {
    const v = this.v;
    const x = sym(v);
    if (f.k === "sym" && f.name === v) {
      return { result: mul(num(1, 2), pow(x, num(2))), rule: "Power rule", note: "∫xⁿ dx = xⁿ⁺¹/(n+1)" };
    }

    if (f.k === "pow") {
      const { base, exp } = f;
      if (contains(base, v) && !contains(exp, v)) {
        const a = this.linear(base);
        if (a) {
          const isX = base.k === "sym";
          const note = isX ? undefined : `Linear inner function u = ${toLatex(base)}, so divide by its slope ${toLatex(a)}.`;
          if (isNum(exp, -1)) {
            return { result: frac(ln(abs(base)), a), rule: isX ? "Reciprocal rule" : "Reciprocal rule (linear substitution)", note: note ?? "∫1/x dx = ln|x|" };
          }
          const n1 = simplify(add(exp, ONE));
          return { result: frac(pow(base, n1), mul(n1, a)), rule: isX ? "Power rule" : "Power rule (linear substitution)", note: note ?? "∫xⁿ dx = xⁿ⁺¹/(n+1), n ≠ −1" };
        }
        if (base.k === "fn" && exp.k === "num") {
          const hit = this.trigPower(base.name, base.arg, exp.v);
          if (hit) return hit;
        }
        const quad = this.quadraticRoot(base, exp);
        if (quad) return quad;
      }
      if (!contains(base, v) && contains(exp, v)) {
        const a = this.linear(exp);
        if (a) {
          const isE = base.k === "const" && base.name === "e";
          return isE
            ? { result: frac(f, a), rule: "Exponential rule", note: "∫eᵃˣ⁺ᵇ dx = eᵃˣ⁺ᵇ/a" }
            : { result: frac(f, mul(a, ln(base))), rule: "Exponential rule (base a)", note: "∫aˣ dx = aˣ/ln(a)" };
        }
      }
    }

    if (f.k === "fn") {
      const u = f.arg;
      const a = this.linear(u);
      if (!a) return null;
      const by = (r: Node, rule: string, note?: string): TableHit => ({ result: frac(r, a), rule, note });
      switch (f.name) {
        case "sin": return by(neg(fn("cos", u)), "Integral of sine", "∫sin(u) du = −cos(u)");
        case "cos": return by(fn("sin", u), "Integral of cosine", "∫cos(u) du = sin(u)");
        case "tan": return by(neg(ln(abs(fn("cos", u)))), "Integral of tangent", "∫tan(u) du = −ln|cos(u)|");
        case "cot": return by(ln(abs(fn("sin", u))), "Integral of cotangent", "∫cot(u) du = ln|sin(u)|");
        case "sec": return by(ln(abs(add(fn("sec", u), fn("tan", u)))), "Integral of secant", "∫sec(u) du = ln|sec(u) + tan(u)|");
        case "csc": return by(neg(ln(abs(add(fn("csc", u), fn("cot", u))))), "Integral of cosecant", "∫csc(u) du = −ln|csc(u) + cot(u)|");
        case "sinh": return by(fn("cosh", u), "Integral of sinh");
        case "cosh": return by(fn("sinh", u), "Integral of cosh");
        case "tanh": return by(ln(fn("cosh", u)), "Integral of tanh");
        case "abs": return by(mul(num(1, 2), u, abs(u)), "Integral of absolute value", "∫|u| du = u·|u|/2");
        case "ln": return by(add(mul(u, ln(u)), neg(u)), "Integral of ln", "Integration by parts gives ∫ln(u) du = u·ln(u) − u");
        case "asin": return by(add(mul(u, fn("asin", u)), sqrtOf(add(ONE, neg(pow(u, num(2)))))), "Integral of arcsine", "Integration by parts with u = arcsin(x), dv = dx");
        case "acos": return by(add(mul(u, fn("acos", u)), neg(sqrtOf(add(ONE, neg(pow(u, num(2))))))), "Integral of arccosine", "Integration by parts with u = arccos(x), dv = dx");
        case "atan": return by(add(mul(u, fn("atan", u)), mul(num(-1, 2), ln(add(ONE, pow(u, num(2)))))), "Integral of arctangent", "Integration by parts with u = arctan(x), dv = dx");
        default: return null;
      }
    }

    if (f.k === "mul" && f.factors.length === 2) {
      const [p, q] = f.factors;
      for (const [s, t] of [[p, q], [q, p]]) {
        if (s.k === "fn" && t.k === "fn" && equals(s.arg, t.arg)) {
          const a = this.linear(s.arg);
          if (!a) continue;
          if (s.name === "sec" && t.name === "tan") return { result: frac(s, a), rule: "Integral of sec·tan", note: "d/du[sec(u)] = sec(u)tan(u)" };
          if (s.name === "csc" && t.name === "cot") return { result: frac(neg(s), a), rule: "Integral of csc·cot", note: "d/du[csc(u)] = −csc(u)cot(u)" };
          if (s.name === "sin" && t.name === "cos") {
            return { result: frac(mul(num(1, 2), pow(fn("sin", s.arg), num(2))), a), rule: "Substitution u = sin(x)", note: "∫sin(u)cos(u) du = sin²(u)/2" };
          }
        }
        // e^(ax+b)·sin(cx+d) and e^(ax+b)·cos(cx+d): integration by parts twice.
        if (s.k === "pow" && s.base.k === "const" && s.base.name === "e" && t.k === "fn" && (t.name === "sin" || t.name === "cos")) {
          const a = this.linear(s.exp);
          const c = this.linear(t.arg);
          if (!a || !c) continue;
          const other = fn(t.name === "sin" ? "cos" : "sin", t.arg);
          const inner = t.name === "sin" ? add(mul(a, t), neg(mul(c, other))) : add(mul(a, t), mul(c, other));
          return {
            result: frac(mul(s, inner), add(pow(a, num(2)), pow(c, num(2)))),
            rule: "Integration by parts (twice)",
            note: "Applying integration by parts twice returns the original integral, which can then be solved for.",
          };
        }
      }
    }
    return null;
  }

  private trigPower(name: string, u: Node, e: R.Rational): TableHit | null {
    const a = this.linear(u);
    if (!a || e.d !== 1) return null;
    const by = (r: Node, rule: string, note?: string): TableHit => ({ result: frac(r, a), rule, note });
    const k = e.n;
    if ((name === "sec" && k === 2) || (name === "cos" && k === -2)) return by(fn("tan", u), "Integral of sec²", "d/du[tan(u)] = sec²(u)");
    if ((name === "csc" && k === 2) || (name === "sin" && k === -2)) return by(neg(fn("cot", u)), "Integral of csc²", "d/du[cot(u)] = −csc²(u)");
    if (name === "sin" && k === 2) {
      return by(add(mul(num(1, 2), u), mul(num(-1, 4), fn("sin", mul(num(2), u)))), "Power-reducing identity", "sin²(u) = (1 − cos(2u))/2");
    }
    if (name === "cos" && k === 2) {
      return by(add(mul(num(1, 2), u), mul(num(1, 4), fn("sin", mul(num(2), u)))), "Power-reducing identity", "cos²(u) = (1 + cos(2u))/2");
    }
    if (name === "tan" && k === 2) return by(add(fn("tan", u), neg(u)), "Pythagorean identity", "tan²(u) = sec²(u) − 1");
    if (name === "cot" && k === 2) return by(add(neg(fn("cot", u)), neg(u)), "Pythagorean identity", "cot²(u) = csc²(u) − 1");
    return null;
  }

  /** (c − p·x²)^(−1/2) and (p·x² + c)^(−1/2). */
  private quadraticRoot(base: Node, exp: Node): TableHit | null {
    if (!(exp.k === "num" && exp.v.n === -1 && exp.v.d === 2)) return null;
    const poly = P.toPoly(base, this.v, 2);
    if (!poly || P.degree(poly) !== 2 || poly[1].n !== 0) return null;
    const [c, , p] = poly;
    const x = sym(this.v);
    if (p.n < 0 && c.n > 0) {
      const pp = R.neg(p);
      const scale = sqrtOf(numR(R.div(pp, c)));
      return {
        result: frac(fn("asin", mul(scale, x)), sqrtOf(numR(pp))),
        rule: "Inverse sine form",
        note: "∫ 1/√(a² − u²) du = arcsin(u/a)",
      };
    }
    if (p.n > 0) {
      const sp = sqrtOf(numR(p));
      return {
        result: frac(ln(abs(add(mul(sp, x), sqrtOf(base)))), sp),
        rule: "Inverse hyperbolic form",
        note: "∫ 1/√(u² + c) du = ln|u + √(u² + c)|",
      };
    }
    return null;
  }

  private rewrite(f: Node, depth: number): Node | null {
    let e: Node;
    try {
      e = expand(f);
    } catch {
      return null;
    }
    // Split a fraction whose denominator is a monomial: (x² + 1)/x -> x + 1/x.
    if (e.k === "mul") {
      const sums = e.factors.filter((x) => x.k === "add");
      const others = e.factors.filter((x) => x.k !== "add");
      const monomialDen = others.every((x) => !contains(x, this.v) || x.k === "sym" || (x.k === "pow" && x.base.k === "sym" && x.exp.k === "num"));
      if (sums.length === 1 && monomialDen) {
        e = simplify(add(...(sums[0] as { terms: Node[] }).terms.map((t) => mul(t, ...others))));
      }
    }
    if (e.k !== "add" || equals(e, f)) return null;
    const slot = this.open(depth);
    const r = this.integrate(e, depth + 1);
    if (!r) return null;
    this.fill(slot, "Rewrite the integrand", [this.I(f), this.I(e), toLatex(r)], "Expand or split the integrand into simpler terms.");
    return r;
  }

  /** Splits f into polynomial numerator and denominator, if it is a rational function. */
  private rationalParts(f: Node): { N: P.Poly; D: P.Poly } | null {
    const factors = f.k === "mul" ? f.factors : [f];
    let N: P.Poly = [R.rat(1)];
    let D: P.Poly = [R.rat(1)];
    for (const factor of factors) {
      const isDen = factor.k === "pow" && factor.exp.k === "num" && factor.exp.v.d === 1 && factor.exp.v.n < 0;
      const base = isDen ? (factor as { base: Node }).base : factor;
      const k = isDen ? -(factor as { exp: { v: R.Rational } }).exp.v.n : 1;
      const p = P.toPoly(base, this.v, 12);
      if (!p) return null;
      for (let i = 0; i < k; i++) {
        if (isDen) D = multiplyPoly(D, p);
        else N = multiplyPoly(N, p);
      }
    }
    if (P.degree(D) < 1 || P.degree(D) > 12) return null;
    return { N, D };
  }

  private rational(f: Node, depth: number): Node | null {
    const parts = this.rationalParts(f);
    if (!parts) return null;
    const { N, D } = parts;
    const v = this.v;
    const x = sym(v);

    if (P.degree(N) >= P.degree(D)) {
      const { q, r } = P.polyDivMod(N, D);
      const qNode = P.fromPoly(q, v);
      const rest = P.degree(r) === -Infinity ? null : simplify(frac(P.fromPoly(r, v), P.fromPoly(D, v)));
      const slot = this.open(depth);
      const qi = this.integrate(qNode, depth + 1);
      const ri = rest ? this.integrate(rest, depth + 1) : num(0);
      if (!qi || !ri) return null;
      const result = simplify(add(qi, ri));
      this.fill(
        slot,
        "Polynomial long division",
        [this.I(f), rest ? `${this.I(qNode)} + ${this.I(rest)}` : this.I(qNode), toLatex(result)],
        "The numerator's degree is at least the denominator's, so divide first.",
      );
      return result;
    }

    const { roots, rest } = P.rationalRoots(D);
    const lead = D[D.length - 1];
    const distinct = new Set(roots.map((r) => `${r.n}/${r.d}`));

    // Distinct linear factors: A_i = N(r_i) / D'(r_i).
    if (P.degree(rest) === 0 && roots.length >= 2 && distinct.size === roots.length) {
      const dD = P.polyDeriv(D);
      const terms = roots.map((r) => {
        const A = R.div(P.polyEval(N, r), P.polyEval(dD, r));
        return { A, r };
      });
      const decomposition = simplify(add(...terms.map(({ A, r }) => frac(numR(A), add(x, numR(R.neg(r)))))));
      const result = simplify(add(...terms.map(({ A, r }) => mul(numR(A), ln(abs(add(x, numR(R.neg(r)))))))));
      const slot = this.open(depth);
      this.fill(slot, "Partial fractions", [this.I(f), this.I(decomposition), toLatex(result)], "The denominator factors into distinct linear factors; each piece integrates to a logarithm.");
      return result;
    }

    // A single repeated root: rewrite N in powers of (x − r).
    if (P.degree(rest) === 0 && roots.length >= 2 && distinct.size === 1) {
      const r = roots[0];
      const k = roots.length;
      const shifted: Node[] = [];
      let remaining = N;
      for (let j = 0; P.degree(remaining) !== -Infinity && j <= P.degree(N); j++) {
        const { q, r: rem } = P.polyDivMod(remaining, [R.neg(r), R.rat(1)]);
        const c = rem[0];
        if (c.n !== 0) shifted.push(mul(numR(R.div(c, lead)), pow(add(x, numR(R.neg(r))), num(j - k))));
        remaining = q;
      }
      const rewritten = simplify(add(...shifted));
      const slot = this.open(depth);
      const result = this.integrate(rewritten, depth + 1);
      if (!result) return null;
      this.fill(slot, "Partial fractions (repeated factor)", [this.I(f), this.I(rewritten), toLatex(result)]);
      return result;
    }

    // Irreducible quadratic denominator with a linear numerator.
    if (P.degree(D) === 2 && roots.length === 0) {
      const [c, b, a] = D;
      const disc = R.sub(R.mul(R.rat(4), R.mul(a, c)), R.mul(b, b)); // 4ac − b² > 0
      if (disc.n <= 0) return null;
      const p = N[1] ?? R.rat(0);
      const q = N[0];
      const Dnode = P.fromPoly(D, v);
      const logPart = mul(numR(R.div(p, R.mul(R.rat(2), a))), ln(a.n > 0 ? Dnode : abs(Dnode)));
      const coefAtan = R.sub(q, R.div(R.mul(p, b), R.mul(R.rat(2), a)));
      const root = sqrtOf(numR(disc));
      const atanPart = mul(numR(R.mul(R.rat(2), coefAtan)), pow(root, num(-1)), fn("atan", frac(add(mul(numR(R.mul(R.rat(2), a)), x), numR(b)), root)));
      const result = simplify(add(logPart, atanPart));
      const slot = this.open(depth);
      this.fill(
        slot,
        "Completing the square",
        [this.I(f), toLatex(result)],
        "Split into a part whose numerator is a multiple of the denominator's derivative (a logarithm) and a constant part (an arctangent).",
      );
      return result;
    }
    return null;
  }

  private freshVar(f: Node): string {
    return SUB_VARS.find((s) => s !== this.v && !contains(f, s)) ?? "u";
  }

  private substitution(f: Node, depth: number): Node | null {
    const v = this.v;
    const fSize = size(f);
    const candidates = subtrees(f)
      .filter((u) => u !== f && contains(u, v) && !(u.k === "sym") && size(u) < fSize && !equals(u, f))
      .filter((u) => u.k !== "num")
      .sort((p, q) => size(q) - size(p))
      .slice(0, 16);
    const uName = this.freshVar(f);
    for (const u of candidates) {
      if (this.linear(u) && u.k === "add") continue; // linear substitutions are handled by the table
      let du: Node;
      try {
        du = differentiate(u, v);
      } catch {
        continue;
      }
      if (isNum(du, 0)) continue;
      let q: Node;
      try {
        q = simplify(frac(f, du));
      } catch {
        continue;
      }
      const g = simplify(replaceSubtree(q, u, sym(uName)));
      if (contains(g, v) || !contains(g, uName) || size(g) >= fSize + 4) continue;
      const mark = this.steps.length;
      const slot = this.open(depth);
      const inner = new Integrator(uName, this.record);
      inner.calls = this.calls;
      const G = inner.integrate(g, 0);
      this.calls = inner.calls;
      if (!G) {
        this.rollback(mark);
        continue;
      }
      const result = simplify(replaceSubtree(G, sym(uName), u));
      this.fill(
        slot,
        "u-substitution",
        [this.I(f), this.I(g, uName), toLatex(G), toLatex(result)],
        `Let ${uName} = ${toLatex(u)}, so d${uName} = ${toLatex(du)}\\,d${v}. Integrate in ${uName}, then substitute back.`,
      );
      if (this.record && slot >= 0) {
        for (const s of inner.steps) this.steps.push({ ...s, depth: s.depth + depth + 1 });
        if (inner.truncated) this.truncated = true;
      }
      return result;
    }
    return null;
  }

  private byParts(f: Node, depth: number): Node | null {
    if (depth > 6) return null;
    const v = this.v;
    const factors = f.k === "mul" ? f.factors : [f];
    if (factors.length !== 2) return null;
    const isPoly = (n: Node) => P.toPoly(n, v, 8) !== null && contains(n, v);
    const isLogOrInverse = (n: Node) => n.k === "fn" && ["ln", "asin", "acos", "atan"].includes(n.name);
    const isExpOrTrig = (n: Node) =>
      (n.k === "fn" && ["sin", "cos", "sinh", "cosh"].includes(n.name)) ||
      (n.k === "pow" && !contains(n.base, v) && contains(n.exp, v));

    // LIATE: logarithms/inverse trig first, then algebraic, then trig/exponential.
    let uPart: Node | null = null;
    let dvPart: Node | null = null;
    const [a, b] = factors;
    if (isLogOrInverse(a) && (isPoly(b) || !contains(b, v))) [uPart, dvPart] = [a, b];
    else if (isLogOrInverse(b) && (isPoly(a) || !contains(a, v))) [uPart, dvPart] = [b, a];
    else if (isPoly(a) && isExpOrTrig(b)) [uPart, dvPart] = [a, b];
    else if (isPoly(b) && isExpOrTrig(a)) [uPart, dvPart] = [b, a];
    else if (isLogOrInverse(a) && b.k === "pow" && b.base.k === "sym" && b.exp.k === "num") [uPart, dvPart] = [a, b];
    else if (isLogOrInverse(b) && a.k === "pow" && a.base.k === "sym" && a.exp.k === "num") [uPart, dvPart] = [b, a];
    if (!uPart || !dvPart) return null;

    const silent = new Integrator(v, false);
    const V = silent.integrate(dvPart, 0);
    if (!V) return null;
    const du = differentiate(uPart, v);
    const slot = this.open(depth);
    const remaining = simplify(mul(V, du));
    const rest = this.integrate(remaining, depth + 1);
    if (!rest) return null;
    const result = simplify(add(mul(uPart, V), neg(rest)));
    this.fill(
      slot,
      "Integration by parts",
      [this.I(f), `${wrapTex(uPart)}\\cdot ${wrapTex(V)} - ${this.I(remaining)}`, toLatex(result)],
      `∫u dv = uv − ∫v du with u = ${toLatex(uPart)}, dv = ${toLatex(dvPart)} dx, du = ${toLatex(du)} dx, v = ${toLatex(V)}.`,
    );
    return result;
  }
}

function wrapTex(n: Node): string {
  return n.k === "add" ? `\\left(${toLatex(n)}\\right)` : toLatex(n);
}

function multiplyPoly(a: P.Poly, b: P.Poly): P.Poly {
  const out: P.Poly = Array.from({ length: a.length + b.length - 1 }, () => R.rat(0));
  a.forEach((x, i) => b.forEach((y, j) => (out[i + j] = R.add(out[i + j], R.mul(x, y)))));
  return P.trim(out);
}

// ---------- verification ----------

export type CheckStatus = "verified" | "mismatch" | "inconclusive";

const EXTRA_POINTS = [0.13, 0.47, 0.66, 0.91, -0.21, -0.58, 5.3, 7.9];

/** Checks numerically that dF/dv equals f at several sample points. */
export function checkAntiderivative(F: Node, f: Node, v: string): CheckStatus {
  let dF: Node;
  try {
    dF = differentiate(F, v);
  } catch {
    return "inconclusive";
  }
  // Other letters are parameters; give them fixed, unremarkable test values.
  const params: Record<string, number> = {};
  [...freeSymbols(f), ...freeSymbols(F)].filter((s) => s !== v).forEach((s, i) => (params[s] = 1.37 + 0.41 * i));
  let agree = 0;
  for (const x of [...SAMPLE_POINTS, ...EXTRA_POINTS]) {
    const a = evaluate(dF, { ...params, [v]: x });
    const b = evaluate(f, { ...params, [v]: x });
    if (!Number.isFinite(a) || !Number.isFinite(b) || Math.abs(b) > 1e8) continue;
    if (Math.abs(a - b) > 1e-6 * Math.max(1, Math.abs(b))) return "mismatch";
    agree++;
  }
  return agree >= 3 ? "verified" : "inconclusive";
}

// ---------- computer algebra fallback ----------

type AlgebriteModule = { run: (s: string) => string };
let algebrite: Promise<AlgebriteModule> | null = null;

function loadAlgebrite(): Promise<AlgebriteModule> {
  algebrite ??= import("algebrite").then((m) => ((m as { default?: AlgebriteModule }).default ?? (m as unknown as AlgebriteModule)));
  return algebrite;
}

/** Starts downloading the fallback engine in the background so it is available offline later. */
export function preloadCas(): void {
  void loadAlgebrite().catch(() => {
    algebrite = null;
  });
}

/** Wraps logarithms that appear as additive terms in |...|: d/dx ln|u| = u'/u as well. */
function absLogs(n: Node): Node {
  const fix = (t: Node): Node => {
    if (t.k === "fn" && t.name === "ln" && !(t.arg.k === "fn" && t.arg.name === "abs")) return ln(abs(t.arg));
    if (t.k === "mul") return mul(...t.factors.map((f) => (f.k === "fn" && f.name === "ln" ? fix(f) : f)));
    return t;
  };
  return simplify(n.k === "add" ? add(...n.terms.map(fix)) : fix(n));
}

type CasOutcome = { kind: "found"; result: Node } | { kind: "nonelementary" } | { kind: "notfound" };

async function integrateWithCas(f: Node, v: string): Promise<CasOutcome> {
  let input: string;
  try {
    input = toAlgebrite(f);
  } catch {
    return { kind: "notfound" };
  }
  let output: string;
  try {
    const A = await loadAlgebrite();
    output = A.run(`integral(${input},${ALGEBRITE_PREFIX}${v === "θ" ? "theta" : v})`);
  } catch {
    return { kind: "notfound" };
  }
  if (!output || /Stop|sorry|integral\(|nil/i.test(output)) return { kind: "notfound" };
  if (/erf|Ei\(|Si\(|Ci\(|\bi\b/.test(output)) return { kind: "nonelementary" };
  const restored = output.replace(new RegExp(`${ALGEBRITE_PREFIX}(theta|[a-zA-Z])`, "g"), (_, name: string) => (name === "theta" ? "θ" : name));
  try {
    return { kind: "found", result: absLogs(bestForm(parse(restored).node)) };
  } catch {
    return { kind: "notfound" };
  }
}

// ---------- public API ----------

export type AntiderivativeOutcome =
  | { kind: "found"; result: Node; steps: Step[]; truncated: boolean; method: "rules" | "cas"; check: CheckStatus }
  | { kind: "nonelementary" }
  | { kind: "notfound" };

const KNOWN_NONELEMENTARY = (f: Node, v: string): boolean => {
  // e^(x^2), e^(-x^2), sin(x)/x, cos(x)/x, e^x/x, 1/ln(x), sin(x^2), cos(x^2).
  const text = toLatex(f);
  const x = v === "θ" ? "\\theta" : v;
  const patterns = [
    `e^{${x}^{2}}`, `e^{-${x}^{2}}`, `\\sin\\left(${x}^{2}\\right)`, `\\cos\\left(${x}^{2}\\right)`,
    `\\frac{\\sin\\left(${x}\\right)}{${x}}`, `\\frac{\\cos\\left(${x}\\right)}{${x}}`, `\\frac{e^{${x}}}{${x}}`, `\\frac{1}{\\ln\\left(${x}\\right)}`,
  ];
  return patterns.includes(text);
};

export async function findAntiderivative(integrand: Node, v: string): Promise<AntiderivativeOutcome> {
  const f = simplify(integrand);
  if (KNOWN_NONELEMENTARY(f, v)) return { kind: "nonelementary" };

  const engine = new Integrator(v, true);
  let ruled: Node | null = null;
  try {
    ruled = engine.integrate(f);
  } catch (err) {
    if (!(err instanceof MathError)) throw err;
  }
  if (ruled) {
    const result = bestForm(ruled);
    const check = checkAntiderivative(result, f, v);
    if (check !== "mismatch") {
      return { kind: "found", result, steps: engine.steps, truncated: engine.truncated, method: "rules", check };
    }
  }

  const cas = await integrateWithCas(f, v);
  if (cas.kind !== "found") return cas;
  const check = checkAntiderivative(cas.result, f, v);
  if (check === "mismatch") return { kind: "notfound" };
  return { kind: "found", result: cas.result, steps: [], truncated: false, method: "cas", check };
}

/** Synchronous rules-only antiderivative (no steps), used internally. */
export function antiderivativeByRules(f: Node, v: string): Node | null {
  try {
    const r = new Integrator(v, false).integrate(simplify(f));
    return r ? bestForm(r) : null;
  } catch {
    return null;
  }
}

