// Real-valued numeric evaluation. Returns NaN outside the real domain
// (for example sqrt(-1) or ln(0)), never a complex number.

import type { Node } from "./ast";

export type Env = Record<string, number>;

export function evaluate(n: Node, env: Env = {}): number {
  switch (n.k) {
    case "num":
      return n.v.n / n.v.d;
    case "const":
      return n.name === "pi" ? Math.PI : Math.E;
    case "sym": {
      const value = env[n.name];
      return value === undefined ? NaN : value;
    }
    case "add":
      return n.terms.reduce((s, t) => s + evaluate(t, env), 0);
    case "mul":
      return n.factors.reduce((p, f) => p * evaluate(f, env), 1);
    case "div":
      return evaluate(n.num, env) / evaluate(n.den, env);
    case "neg":
      return -evaluate(n.arg, env);
    case "pow":
      return power(evaluate(n.base, env), n.exp, env);
    case "fn":
      return applyFn(n.name, evaluate(n.arg, env));
  }
}

function power(base: number, expNode: Node, env: Env): number {
  const e = evaluate(expNode, env);
  if (base < 0 && expNode.k === "num" && expNode.v.d % 2 === 1 && expNode.v.d !== 1) {
    // Real odd root of a negative number, e.g. (-8)^(1/3) = -2.
    const magnitude = Math.pow(-base, e);
    return expNode.v.n % 2 === 0 ? magnitude : -magnitude;
  }
  if (base === 0 && e < 0) return Infinity;
  return Math.pow(base, e);
}

export function applyFn(name: string, x: number): number {
  switch (name) {
    case "sin": return Math.sin(x);
    case "cos": return Math.cos(x);
    case "tan": return Math.tan(x);
    case "sec": return 1 / Math.cos(x);
    case "csc": return 1 / Math.sin(x);
    case "cot": return Math.cos(x) / Math.sin(x);
    case "asin": return Math.asin(x);
    case "acos": return Math.acos(x);
    case "atan": return Math.atan(x);
    case "sinh": return Math.sinh(x);
    case "cosh": return Math.cosh(x);
    case "tanh": return Math.tanh(x);
    case "ln": return x < 0 ? NaN : Math.log(x);
    case "abs": return Math.abs(x);
    default: return NaN;
  }
}

/** Evaluates f at x for the given variable; returns NaN on any domain problem. */
export function evalAt(n: Node, v: string, x: number): number {
  const value = evaluate(n, { [v]: x });
  return Number.isNaN(value) ? NaN : value;
}
