// Expression tree used by every part of the math engine.
//
// The parser produces "raw" trees that may contain `div` and `neg` nodes so that
// step-by-step explanations can follow the structure the user typed.
// `simplify()` turns any tree into canonical form, which only uses
// num / sym / const / add / mul / pow / fn (division becomes a negative power).

import { MathError } from "./errors";
import { rat, type Rational } from "./rational";

export type FnName =
  | "sin" | "cos" | "tan" | "sec" | "csc" | "cot"
  | "asin" | "acos" | "atan"
  | "sinh" | "cosh" | "tanh"
  | "ln" | "abs";

export const FUNCTION_NAMES: readonly FnName[] = [
  "sin", "cos", "tan", "sec", "csc", "cot", "asin", "acos", "atan", "sinh", "cosh", "tanh", "ln", "abs",
];

export type Node =
  | { k: "num"; v: Rational }
  | { k: "sym"; name: string }
  | { k: "const"; name: "pi" | "e" }
  | { k: "add"; terms: Node[] }
  | { k: "mul"; factors: Node[] }
  | { k: "div"; num: Node; den: Node }
  | { k: "neg"; arg: Node }
  | { k: "pow"; base: Node; exp: Node }
  | { k: "fn"; name: FnName; arg: Node };

// ---------- constructors ----------

export const num = (n: number, d = 1): Node => ({ k: "num", v: rat(n, d) });
export const numR = (v: Rational): Node => ({ k: "num", v });
export const sym = (name: string): Node => ({ k: "sym", name });
export const PI: Node = { k: "const", name: "pi" };
export const E: Node = { k: "const", name: "e" };
export const ZERO = num(0);
export const ONE = num(1);
export const add = (...terms: Node[]): Node => ({ k: "add", terms });
export const mul = (...factors: Node[]): Node => ({ k: "mul", factors });
export const div = (n: Node, d: Node): Node => ({ k: "div", num: n, den: d });
export const neg = (arg: Node): Node => ({ k: "neg", arg });
export const pow = (base: Node, exp: Node): Node => ({ k: "pow", base, exp });
export const fn = (name: FnName, arg: Node): Node => ({ k: "fn", name, arg });
export const sub = (a: Node, b: Node): Node => add(a, neg(b));
export const sqrt = (a: Node): Node => pow(a, num(1, 2));
export const exp = (a: Node): Node => pow(E, a);

// ---------- predicates ----------

export const isNum = (n: Node, value?: number): boolean =>
  n.k === "num" && (value === undefined || (n.v.n === value && n.v.d === 1));

export function contains(n: Node, v: string): boolean {
  switch (n.k) {
    case "sym":
      return n.name === v;
    case "num":
    case "const":
      return false;
    case "add":
      return n.terms.some((t) => contains(t, v));
    case "mul":
      return n.factors.some((f) => contains(f, v));
    case "div":
      return contains(n.num, v) || contains(n.den, v);
    case "neg":
      return contains(n.arg, v);
    case "pow":
      return contains(n.base, v) || contains(n.exp, v);
    case "fn":
      return contains(n.arg, v);
  }
}

export function freeSymbols(n: Node, out = new Set<string>()): Set<string> {
  switch (n.k) {
    case "sym":
      out.add(n.name);
      break;
    case "add":
      n.terms.forEach((t) => freeSymbols(t, out));
      break;
    case "mul":
      n.factors.forEach((f) => freeSymbols(f, out));
      break;
    case "div":
      freeSymbols(n.num, out);
      freeSymbols(n.den, out);
      break;
    case "neg":
    case "fn":
      freeSymbols(n.arg, out);
      break;
    case "pow":
      freeSymbols(n.base, out);
      freeSymbols(n.exp, out);
      break;
  }
  return out;
}

export function size(n: Node): number {
  switch (n.k) {
    case "num":
    case "sym":
    case "const":
      return 1;
    case "add":
      return 1 + n.terms.reduce((s, t) => s + size(t), 0);
    case "mul":
      return 1 + n.factors.reduce((s, f) => s + size(f), 0);
    case "div":
      return 1 + size(n.num) + size(n.den);
    case "neg":
    case "fn":
      return 1 + size(n.arg);
    case "pow":
      return 1 + size(n.base) + size(n.exp);
  }
}

export const MAX_SIZE = 4000;

export function guardSize(n: Node): Node {
  if (size(n) > MAX_SIZE) {
    throw new MathError(
      "The expression grew too large to process.",
      "Try a simpler expression or a lower order.",
    );
  }
  return n;
}

/** Structural equality. Reliable on canonical (simplified) trees. */
export function equals(a: Node, b: Node): boolean {
  if (a.k !== b.k) return false;
  switch (a.k) {
    case "num":
      return a.v.n === (b as typeof a).v.n && a.v.d === (b as typeof a).v.d;
    case "sym":
    case "const":
      return a.name === (b as typeof a).name;
    case "add": {
      const bt = (b as typeof a).terms;
      return a.terms.length === bt.length && a.terms.every((t, i) => equals(t, bt[i]));
    }
    case "mul": {
      const bf = (b as typeof a).factors;
      return a.factors.length === bf.length && a.factors.every((f, i) => equals(f, bf[i]));
    }
    case "div":
      return equals(a.num, (b as typeof a).num) && equals(a.den, (b as typeof a).den);
    case "neg":
      return equals(a.arg, (b as typeof a).arg);
    case "pow":
      return equals(a.base, (b as typeof a).base) && equals(a.exp, (b as typeof a).exp);
    case "fn":
      return a.name === (b as typeof a).name && equals(a.arg, (b as typeof a).arg);
  }
}

/** Replaces every occurrence of the symbol `v` with `value`. */
export function substitute(n: Node, v: string, value: Node): Node {
  switch (n.k) {
    case "sym":
      return n.name === v ? value : n;
    case "num":
    case "const":
      return n;
    case "add":
      return add(...n.terms.map((t) => substitute(t, v, value)));
    case "mul":
      return mul(...n.factors.map((f) => substitute(f, v, value)));
    case "div":
      return div(substitute(n.num, v, value), substitute(n.den, v, value));
    case "neg":
      return neg(substitute(n.arg, v, value));
    case "pow":
      return pow(substitute(n.base, v, value), substitute(n.exp, v, value));
    case "fn":
      return fn(n.name, substitute(n.arg, v, value));
  }
}

/** Replaces every subtree structurally equal to `target` with `replacement`. */
export function replaceSubtree(n: Node, target: Node, replacement: Node): Node {
  if (equals(n, target)) return replacement;
  switch (n.k) {
    case "num":
    case "sym":
    case "const":
      return n;
    case "add":
      return add(...n.terms.map((t) => replaceSubtree(t, target, replacement)));
    case "mul":
      return mul(...n.factors.map((f) => replaceSubtree(f, target, replacement)));
    case "div":
      return div(replaceSubtree(n.num, target, replacement), replaceSubtree(n.den, target, replacement));
    case "neg":
      return neg(replaceSubtree(n.arg, target, replacement));
    case "pow":
      return pow(replaceSubtree(n.base, target, replacement), replaceSubtree(n.exp, target, replacement));
    case "fn":
      return fn(n.name, replaceSubtree(n.arg, target, replacement));
  }
}

/** All distinct subtrees, outermost first. */
export function subtrees(n: Node, out: Node[] = []): Node[] {
  if (!out.some((o) => equals(o, n))) out.push(n);
  switch (n.k) {
    case "add":
      n.terms.forEach((t) => subtrees(t, out));
      break;
    case "mul":
      n.factors.forEach((f) => subtrees(f, out));
      break;
    case "div":
      subtrees(n.num, out);
      subtrees(n.den, out);
      break;
    case "neg":
    case "fn":
      subtrees(n.arg, out);
      break;
    case "pow":
      subtrees(n.base, out);
      subtrees(n.exp, out);
      break;
  }
  return out;
}
