// Symbolic differentiation that records which rule is applied at each node.
// Steps follow the structure of the expression as typed (sum, product,
// quotient, chain rule...), and every intermediate result is simplified.

import type { Step } from "@/types/solver";
import {
  ONE, ZERO, add, contains, div, equals, fn, isNum, mul, neg, num, pow, type FnName, type Node,
} from "./ast";
import { toLatex, toText } from "./print";
import { bestForm, simplify } from "./simplify";

const MAX_STEPS = 60;

/** f'(u) for each supported function, as a function of the inner argument u. */
function outerDerivative(name: FnName, u: Node): Node {
  switch (name) {
    case "sin": return fn("cos", u);
    case "cos": return neg(fn("sin", u));
    case "tan": return pow(fn("sec", u), num(2));
    case "sec": return mul(fn("sec", u), fn("tan", u));
    case "csc": return neg(mul(fn("csc", u), fn("cot", u)));
    case "cot": return neg(pow(fn("csc", u), num(2)));
    case "asin": return pow(add(ONE, neg(pow(u, num(2)))), num(-1, 2));
    case "acos": return neg(pow(add(ONE, neg(pow(u, num(2)))), num(-1, 2)));
    case "atan": return div(ONE, add(ONE, pow(u, num(2))));
    case "sinh": return fn("cosh", u);
    case "cosh": return fn("sinh", u);
    case "tanh": return pow(fn("cosh", u), num(-2));
    case "ln": return div(ONE, u);
    case "abs": return div(u, fn("abs", u));
  }
}

const RULE_NAMES: Record<FnName, string> = {
  sin: "Derivative of sine", cos: "Derivative of cosine", tan: "Derivative of tangent",
  sec: "Derivative of secant", csc: "Derivative of cosecant", cot: "Derivative of cotangent",
  asin: "Derivative of arcsine", acos: "Derivative of arccosine", atan: "Derivative of arctangent",
  sinh: "Derivative of sinh", cosh: "Derivative of cosh", tanh: "Derivative of tanh",
  ln: "Derivative of ln", abs: "Derivative of absolute value",
};

class Differentiator {
  steps: Step[] = [];
  truncated = false;

  constructor(
    private v: string,
    private record: boolean,
    /** Use ∂ notation: other variables are held constant. */
    private partial = false,
  ) {}

  private D(n: Node): string {
    const v = this.v === "θ" ? "\\theta" : this.v;
    const op = this.partial ? `\\frac{\\partial}{\\partial ${v}}` : `\\frac{d}{d${v}}`;
    return `${op}\\left[${toLatex(n)}\\right]`;
  }

  /** Reserves a step slot so parent steps appear before their children. */
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

  d(n: Node, depth = 0): Node {
    const v = this.v;
    if (!contains(n, v)) {
      const slot = depth <= 1 ? this.open(depth) : -1;
      this.fill(slot, "Constant rule", [this.D(n), "0"], "The derivative of a constant is 0.");
      return ZERO;
    }
    switch (n.k) {
      case "sym": {
        const slot = depth <= 1 ? this.open(depth) : -1;
        this.fill(slot, "Power rule", [this.D(n), "1"]);
        return ONE;
      }
      case "add":
        return this.sum(n.terms, n, depth);
      case "neg": {
        const slot = this.open(depth);
        const inner = this.d(n.arg, depth + 1);
        const result = simplify(neg(inner));
        this.fill(slot, "Constant multiple rule", [this.D(n), `-${this.D(n.arg)}`, toLatex(result)]);
        return result;
      }
      case "mul":
        return this.product(n.factors, n, depth);
      case "div":
        return this.quotient(n, depth);
      case "pow":
        return this.power(n, depth);
      case "fn":
        return this.func(n, depth);
      default:
        return ZERO;
    }
  }

  private sum(terms: Node[], n: Node, depth: number): Node {
    const slot = this.open(depth);
    // Negated terms are differentiated directly so the sum rule shows the minus sign once.
    const parts = terms.map((t) => (t.k === "neg" ? neg(this.d(t.arg, depth + 1)) : this.d(t, depth + 1)));
    const result = bestForm(add(...parts));
    const split = terms
      .map((t, i) => {
        const negative = t.k === "neg";
        const body = this.D(negative ? (t as { arg: Node }).arg : t);
        return i === 0 ? (negative ? `-${body}` : body) : negative ? ` - ${body}` : ` + ${body}`;
      })
      .join("");
    this.fill(slot, "Sum rule", [this.D(n), split, toLatex(result)], "Differentiate each term separately.");
    return result;
  }

  private product(factors: Node[], n: Node, depth: number): Node {
    const v = this.v;
    const constants = factors.filter((f) => !contains(f, v));
    const variables = factors.filter((f) => contains(f, v));
    if (constants.length && variables.length) {
      const c = constants.length === 1 ? constants[0] : mul(...constants);
      const g = variables.length === 1 ? variables[0] : mul(...variables);
      const slot = this.open(depth);
      const dg = this.d(g, depth + 1);
      const result = bestForm(mul(c, dg));
      const cTex = toLatex(c);
      const cShown = isNum(c, -1) ? "-" : cTex;
      this.fill(slot, "Constant multiple rule", [this.D(n), `${cShown} ${this.D(g)}`, toLatex(result)], "Constant factors stay in front of the derivative.");
      return result;
    }
    if (variables.length === 1) return this.d(variables[0], depth);
    const [f, ...restFactors] = variables;
    const g = restFactors.length === 1 ? restFactors[0] : mul(...restFactors);
    const slot = this.open(depth);
    const df = this.d(f, depth + 1);
    const dg = this.d(g, depth + 1);
    const combined = add(mul(df, g), mul(f, dg));
    const result = bestForm(combined);
    this.fill(
      slot,
      "Product rule",
      [this.D(n), `${this.D(f)}\\cdot ${wrap(g)} + ${wrap(f)}\\cdot ${this.D(g)}`, toLatex(simplify(combined)), toLatex(result)],
      "(fg)' = f'g + fg'",
    );
    return result;
  }

  private quotient(n: { k: "div"; num: Node; den: Node }, depth: number): Node {
    const v = this.v;
    const slot = this.open(depth);
    if (!contains(n.den, v)) {
      const dn = this.d(n.num, depth + 1);
      const result = bestForm(div(dn, n.den));
      this.fill(slot, "Constant multiple rule", [this.D(n), `\\frac{1}{${toLatex(n.den)}}${this.D(n.num)}`, toLatex(result)]);
      return result;
    }
    const df = this.d(n.num, depth + 1);
    const dg = this.d(n.den, depth + 1);
    const top = add(mul(df, n.den), neg(mul(n.num, dg)));
    const result = bestForm(div(top, pow(n.den, num(2))));
    this.fill(
      slot,
      "Quotient rule",
      [
        this.D(n),
        `\\frac{${this.D(n.num)}\\cdot ${wrap(n.den)} - ${wrap(n.num)}\\cdot ${this.D(n.den)}}{${wrap(n.den)}^{2}}`,
        toLatex(result),
      ],
      "(f/g)' = (f'g - fg') / g^2",
    );
    return result;
  }

  private power(n: { k: "pow"; base: Node; exp: Node }, depth: number): Node {
    const v = this.v;
    const { base, exp } = n;
    const baseVaries = contains(base, v);
    const expVaries = contains(exp, v);
    const slot = this.open(depth);

    if (baseVaries && !expVaries) {
      const lowered = simplify(add(exp, num(-1)));
      const outer = mul(exp, pow(base, lowered));
      if (equals(base, { k: "sym", name: v })) {
        const result = bestForm(outer);
        this.fill(slot, "Power rule", [this.D(n), toLatex(result)], "d/dx[xⁿ] = n·xⁿ⁻¹");
        return result;
      }
      const du = this.d(base, depth + 1);
      const result = bestForm(mul(outer, du));
      this.fill(
        slot,
        "Power rule with chain rule",
        [this.D(n), `${toLatex(simplify(outer))}\\cdot ${this.D(base)}`, toLatex(result)],
        `Let u = ${toText(base)}; d/dx[uⁿ] = n·uⁿ⁻¹·u'`,
      );
      return result;
    }

    if (!baseVaries && expVaries) {
      const isE = base.k === "const" && base.name === "e";
      const outer = isE ? n : mul(n, fn("ln", base));
      if (equals(exp, { k: "sym", name: v })) {
        const result = bestForm(outer);
        this.fill(slot, isE ? "Exponential rule" : "Exponential rule (base a)", [this.D(n), toLatex(result)], isE ? "d/dx[eˣ] = eˣ" : "d/dx[aˣ] = aˣ·ln(a)");
        return result;
      }
      const du = this.d(exp, depth + 1);
      const result = bestForm(mul(outer, du));
      this.fill(
        slot,
        "Exponential rule with chain rule",
        [this.D(n), `${toLatex(simplify(outer))}\\cdot ${this.D(exp)}`, toLatex(result)],
        isE ? "d/dx[eᵘ] = eᵘ·u'" : "d/dx[aᵘ] = aᵘ·ln(a)·u'",
      );
      return result;
    }

    // u^w with both parts varying: logarithmic differentiation.
    const du = this.d(base, depth + 1);
    const dw = this.d(exp, depth + 1);
    const result = bestForm(mul(n, add(mul(dw, fn("ln", base)), mul(exp, div(du, base)))));
    this.fill(
      slot,
      "Logarithmic differentiation",
      [this.D(n), `${toLatex(n)}\\left(${this.D(exp)}\\ln${paren(base)} + \\frac{${toLatex(exp)}}{${toLatex(base)}}${this.D(base)}\\right)`, toLatex(result)],
      "Write uʷ = e^(w·ln u) and differentiate.",
    );
    return result;
  }

  private func(n: { k: "fn"; name: FnName; arg: Node }, depth: number): Node {
    const slot = this.open(depth);
    const outer = outerDerivative(n.name, n.arg);
    if (equals(n.arg, { k: "sym", name: this.v })) {
      const result = bestForm(outer);
      this.fill(slot, RULE_NAMES[n.name], [this.D(n), toLatex(result)]);
      return result;
    }
    const du = this.d(n.arg, depth + 1);
    const result = bestForm(mul(outer, du));
    this.fill(
      slot,
      `Chain rule (${RULE_NAMES[n.name].replace("Derivative of ", "")})`,
      [this.D(n), `${toLatex(simplify(outer))}\\cdot ${this.D(n.arg)}`, toLatex(result)],
      `Outer function ${n.name}, inner function u = ${toText(n.arg)}.`,
    );
    return result;
  }
}

function wrap(n: Node): string {
  const t = toLatex(n);
  return n.k === "add" || n.k === "neg" ? `\\left(${t}\\right)` : t;
}

function paren(n: Node): string {
  return `\\left(${toLatex(n)}\\right)`;
}

export interface DerivativeWithSteps {
  result: Node;
  steps: Step[];
  truncated: boolean;
}

export function differentiateWithSteps(n: Node, v: string, options: { partial?: boolean } = {}): DerivativeWithSteps {
  const d = new Differentiator(v, true, options.partial);
  const result = d.d(n);
  return { result: bestForm(result), steps: d.steps, truncated: d.truncated };
}

export function differentiate(n: Node, v: string): Node {
  return bestForm(new Differentiator(v, false).d(n));
}
