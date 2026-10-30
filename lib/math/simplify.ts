// Canonical simplification.
//
// Output uses only num / sym / const / add / mul / pow / fn:
//  * sums and products are flattened, like terms and like factors are combined,
//  * a product has at most one numeric coefficient, placed first,
//  * a numeric coefficient times a single sum is distributed: 2(x+1) -> 2x + 2,
//  * exact values are used for common constants: sin(pi/6) = 1/2, ln(e) = 1, sqrt(12) = 2 sqrt(3).

import {
  ONE, PI, ZERO, contains, fn, guardSize, isNum, mul, num, numR, pow, type FnName, type Node,
} from "./ast";
import { MathError } from "./errors";
import { evaluate } from "./evaluate";
import * as R from "./rational";

/** Thrown when an expression has no real value, e.g. 1/0 or ln(-2). */
export class UndefinedValue extends MathError {
  constructor(message = "The expression is undefined at this point.") {
    super(message);
    this.name = "UndefinedValue";
  }
}

export function simplify(n: Node): Node {
  return guardSize(simp(n));
}

function simp(n: Node): Node {
  switch (n.k) {
    case "num":
    case "sym":
    case "const":
      return n;
    case "neg":
      return simplifyMul([num(-1), simp(n.arg)]);
    case "div":
      return simplifyMul([simp(n.num), simplifyPow(simp(n.den), num(-1))]);
    case "add":
      return simplifyAdd(n.terms.map(simp));
    case "mul":
      return simplifyMul(n.factors.map(simp));
    case "pow":
      return simplifyPow(simp(n.base), simp(n.exp));
    case "fn":
      return simplifyFn(n.name, simp(n.arg));
  }
}

// ---------- keys and ordering ----------

/** Stable string identifying a canonical tree; used for grouping and sorting. */
export function keyOf(n: Node): string {
  switch (n.k) {
    case "num":
      return `${n.v.n}/${n.v.d}`;
    case "sym":
      return n.name;
    case "const":
      return `#${n.name}`;
    case "add":
      return `+(${n.terms.map(keyOf).join(",")})`;
    case "mul":
      return `*(${n.factors.map(keyOf).join(",")})`;
    case "div":
      return `/(${keyOf(n.num)},${keyOf(n.den)})`;
    case "neg":
      return `-(${keyOf(n.arg)})`;
    case "pow":
      return `^(${keyOf(n.base)},${keyOf(n.exp)})`;
    case "fn":
      return `${n.name}(${keyOf(n.arg)})`;
  }
}

function factorRank(f: Node): number {
  const base = f.k === "pow" ? f.base : f;
  if (f.k === "num") return 0;
  if (f.k === "const") return 1;
  if (base.k === "num") return 1.5; // radicals such as sqrt(2)
  if (base.k === "sym") return 2;
  if (base.k === "const") return 4; // e^x
  if (base.k === "fn") return 5;
  if (base.k === "add") return 6;
  return 7;
}

function compareFactors(a: Node, b: Node): number {
  const r = factorRank(a) - factorRank(b);
  if (r) return r;
  const ka = keyOf(a.k === "pow" ? a.base : a);
  const kb = keyOf(b.k === "pow" ? b.base : b);
  return ka < kb ? -1 : ka > kb ? 1 : 0;
}

/** Total polynomial degree of a term in all symbols (for ordering only). */
function degree(t: Node): number {
  if (t.k === "sym") return 1;
  if (t.k === "pow" && t.base.k === "sym" && t.exp.k === "num") return R.toNumber(t.exp.v);
  if (t.k === "mul") return t.factors.reduce((s, f) => s + degree(f), 0);
  return 0;
}

function hasSymbols(t: Node): boolean {
  switch (t.k) {
    case "sym":
      return true;
    case "num":
    case "const":
      return false;
    case "add":
      return t.terms.some(hasSymbols);
    case "mul":
      return t.factors.some(hasSymbols);
    case "div":
      return hasSymbols(t.num) || hasSymbols(t.den);
    case "neg":
    case "fn":
      return hasSymbols(t.arg);
    case "pow":
      return hasSymbols(t.base) || hasSymbols(t.exp);
  }
}

function compareTerms(a: Node, b: Node): number {
  const sa = hasSymbols(a) ? 0 : 1;
  const sb = hasSymbols(b) ? 0 : 1;
  if (sa !== sb) return sa - sb;
  const d = degree(b) - degree(a);
  if (d) return d;
  const ka = keyOf(splitCoefficient(a).rest);
  const kb = keyOf(splitCoefficient(b).rest);
  return ka < kb ? -1 : ka > kb ? 1 : 0;
}

// ---------- sums ----------

export function splitCoefficient(t: Node): { coef: R.Rational; rest: Node } {
  if (t.k === "num") return { coef: t.v, rest: ONE };
  if (t.k === "mul" && t.factors[0].k === "num") {
    const rest = t.factors.slice(1);
    return { coef: t.factors[0].v, rest: rest.length === 1 ? rest[0] : mul(...rest) };
  }
  return { coef: R.rat(1), rest: t };
}

function withCoefficient(coef: R.Rational, rest: Node): Node {
  if (isNum(rest, 1)) return numR(coef);
  if (coef.n === 1 && coef.d === 1) return rest;
  if (rest.k === "mul") return mul(numR(coef), ...rest.factors);
  return mul(numR(coef), rest);
}

export function simplifyAdd(terms: Node[]): Node {
  const flat: Node[] = [];
  for (const t of terms) {
    if (t.k === "add") flat.push(...t.terms);
    else flat.push(t);
  }
  let constant = R.rat(0);
  const groups = new Map<string, { coef: R.Rational; rest: Node }>();
  for (const t of flat) {
    if (t.k === "num") {
      constant = R.add(constant, t.v);
      continue;
    }
    const { coef, rest } = splitCoefficient(t);
    const key = keyOf(rest);
    const g = groups.get(key);
    if (g) g.coef = R.add(g.coef, coef);
    else groups.set(key, { coef, rest });
  }
  const out: Node[] = [];
  for (const g of groups.values()) {
    if (g.coef.n !== 0) out.push(withCoefficient(g.coef, g.rest));
  }
  out.sort(compareTerms);
  if (constant.n !== 0) out.push(numR(constant));
  if (out.length === 0) return ZERO;
  if (out.length === 1) return out[0];
  return { k: "add", terms: out };
}

// ---------- products ----------

function baseAndExp(f: Node): { base: Node; exp: Node } {
  return f.k === "pow" ? { base: f.base, exp: f.exp } : { base: f, exp: ONE };
}

export function simplifyMul(factors: Node[], depth = 0): Node {
  const flat: Node[] = [];
  for (const f of factors) {
    if (f.k === "mul") flat.push(...f.factors);
    else flat.push(f);
  }
  let coef = R.rat(1);
  const groups = new Map<string, { base: Node; exps: Node[] }>();
  for (const f of flat) {
    if (f.k === "num") {
      if (f.v.n === 0) return ZERO;
      coef = R.mul(coef, f.v);
      continue;
    }
    const { base, exp } = baseAndExp(f);
    const key = keyOf(base);
    const g = groups.get(key);
    if (g) g.exps.push(exp);
    else groups.set(key, { base, exps: [exp] });
  }

  const rest: Node[] = [];
  let needsAnotherPass = false;
  for (const g of groups.values()) {
    const exp = g.exps.length === 1 ? g.exps[0] : simplifyAdd(g.exps);
    const p = g.exps.length === 1 && g.exps[0] === ONE ? g.base : simplifyPow(g.base, exp);
    if (p.k === "num") {
      coef = R.mul(coef, p.v);
    } else if (p.k === "mul") {
      rest.push(...p.factors);
      needsAnotherPass = true;
    } else if (!isNum(p, 1)) {
      rest.push(p);
    }
  }
  if (coef.n === 0) return ZERO;
  if (needsAnotherPass && depth < 3) return simplifyMul([numR(coef), ...rest], depth + 1);

  // Distribute a numeric coefficient over a single sum: 2(x + 1) -> 2x + 2.
  if (rest.length === 1 && rest[0].k === "add" && !(coef.n === 1 && coef.d === 1)) {
    return simplifyAdd(rest[0].terms.map((t) => simplifyMul([numR(coef), t])));
  }

  rest.sort(compareFactors);
  const isOne = coef.n === 1 && coef.d === 1;
  if (rest.length === 0) return numR(coef);
  if (rest.length === 1 && isOne) return rest[0];
  return { k: "mul", factors: isOne ? rest : [numR(coef), ...rest] };
}

// ---------- powers ----------

function numericPower(base: R.Rational, e: R.Rational): Node {
  if (R.isInt(e)) {
    if (base.n === 0 && e.n < 0) throw new UndefinedValue("Division by zero.");
    if (Math.abs(e.n) > 64 && Math.abs(base.n) !== 1 && base.d === 1 && base.n !== 0) {
      return pow(numR(base), numR(e));
    }
    try {
      return numR(R.powInt(base, e.n));
    } catch {
      return pow(numR(base), numR(e));
    }
  }
  if (base.n === 0) return e.n > 0 ? ZERO : (() => { throw new UndefinedValue("Division by zero."); })();
  if (base.d !== 1) {
    return simplifyMul([numericPower(R.rat(base.n), e), numericPower(R.rat(base.d), R.neg(e))]);
  }
  const q = e.d;
  if (base.n < 0) {
    if (q % 2 === 0) throw new UndefinedValue("An even root of a negative number is not a real number.");
    const positive = numericPower(R.rat(-base.n), e);
    return e.n % 2 === 0 ? positive : simplifyMul([num(-1), positive]);
  }
  // base^(p/q) = base^w * base^(r/q) with 0 <= r < q.
  const w = Math.floor(e.n / q);
  const r = e.n - w * q;
  let coef: R.Rational;
  try {
    coef = R.powInt(base, w);
  } catch {
    return pow(numR(base), numR(e));
  }
  const root = R.intRoot(base.n ** r, q);
  if (root !== null) return numR(R.mul(coef, R.rat(root)));
  if (!Number.isSafeInteger(base.n ** r)) return pow(numR(base), numR(e));
  const { outside, inside } = R.extractPower(base.n ** r, q);
  const radical = inside === 1 ? ONE : pow(num(inside), num(1, q));
  return mulRaw(R.mul(coef, R.rat(outside)), radical);
}

function mulRaw(coef: R.Rational, rest: Node): Node {
  if (isNum(rest, 1)) return numR(coef);
  if (coef.n === 1 && coef.d === 1) return rest;
  return { k: "mul", factors: [numR(coef), rest] };
}

function isPositiveConstant(n: Node): boolean {
  if (n.k === "const") return true;
  if (n.k === "num") return n.v.n > 0;
  return false;
}

export function simplifyPow(base: Node, exp: Node): Node {
  if (isNum(exp, 0) && isNum(base, 0)) throw new UndefinedValue("0^0 is an indeterminate form.");
  if (isNum(exp, 0)) return ONE;
  if (isNum(exp, 1)) return base;
  if (isNum(base, 1)) return ONE;
  if (base.k === "num" && exp.k === "num") return numericPower(base.v, exp.v);
  if (isNum(base, 0)) {
    const e = evaluate(exp);
    if (e > 0) return ZERO;
    if (e < 0) throw new UndefinedValue("Division by zero.");
  }

  // (a^b)^c = a^(bc) when c is an integer or a is positive.
  if (base.k === "pow" && ((exp.k === "num" && R.isInt(exp.v)) || isPositiveConstant(base.base))) {
    return simplifyPow(base.base, simplifyMul([base.exp, exp]));
  }
  // (ab)^n = a^n b^n for integer n.
  if (base.k === "mul" && exp.k === "num" && R.isInt(exp.v)) {
    return simplifyMul(base.factors.map((f) => simplifyPow(f, exp)));
  }
  // (c * u)^(p/q) with positive numeric c: pull c out, e.g. sqrt(4x) = 2 sqrt(x).
  if (base.k === "mul" && exp.k === "num" && base.factors[0].k === "num" && base.factors[0].v.n > 0) {
    const [c, ...others] = base.factors;
    const rest = others.length === 1 ? others[0] : mul(...others);
    return simplifyMul([simplifyPow(c, exp), simplifyPow(rest, exp)]);
  }
  if (base.k === "const" && base.name === "e") {
    if (exp.k === "fn" && exp.name === "ln") return exp.arg;
    if (exp.k === "mul" && exp.factors.length === 2 && exp.factors[0].k === "num") {
      const inner = exp.factors[1];
      if (inner.k === "fn" && inner.name === "ln") return simplifyPow(inner.arg, exp.factors[0]);
    }
  }
  return pow(base, exp);
}

// ---------- functions ----------

/** If n equals q*pi for a rational q (including 0), returns q. */
function piMultiple(n: Node): R.Rational | null {
  if (isNum(n, 0)) return R.rat(0);
  if (n.k === "const" && n.name === "pi") return R.rat(1);
  if (n.k === "mul" && n.factors.length === 2 && n.factors[0].k === "num" && n.factors[1].k === "const" && n.factors[1].name === "pi") {
    return n.factors[0].v;
  }
  return null;
}

const SQRT2_2 = (): Node => mul(num(1, 2), pow(num(2), num(1, 2)));
const SQRT3_2 = (): Node => mul(num(1, 2), pow(num(3), num(1, 2)));

/** Exact sin(q*pi) for q with denominator 1, 2, 3, 4 or 6. */
function sinOfPiMultiple(q: R.Rational): Node | null {
  if (![1, 2, 3, 4, 6].includes(q.d)) return null;
  // Reduce to [0, 2) in units of pi, i.e. twelfths in [0, 24).
  const twelfths = (((q.n * 12) / q.d) % 24 + 24) % 24;
  const sign = twelfths > 12 ? -1 : 1;
  const t = twelfths > 12 ? twelfths - 12 : twelfths; // in [0, 12]
  const ref = t > 6 ? 12 - t : t; // reference angle in twelfths of pi, 0..6
  const value: Record<number, () => Node> = {
    0: () => ZERO,
    2: () => num(1, 2),
    3: SQRT2_2,
    4: SQRT3_2,
    6: () => ONE,
  };
  const make = value[ref];
  if (!make) return null;
  return simplifyMul([num(sign), make()]);
}

function trigSpecial(name: FnName, q: R.Rational): Node | null {
  const sin = sinOfPiMultiple(q);
  const cos = sinOfPiMultiple(R.add(q, R.rat(1, 2)));
  if (!sin || !cos) return null;
  const reciprocal = (x: Node, what: string): Node => {
    if (isNum(x, 0)) throw new UndefinedValue(`${what} is undefined at this angle.`);
    return simplifyPow(x, num(-1));
  };
  switch (name) {
    case "sin":
      return sin;
    case "cos":
      return cos;
    case "tan":
      return simplifyMul([sin, reciprocal(cos, "tan")]);
    case "cot":
      return simplifyMul([cos, reciprocal(sin, "cot")]);
    case "sec":
      return reciprocal(cos, "sec");
    case "csc":
      return reciprocal(sin, "csc");
    default:
      return null;
  }
}

const INVERSE_TRIG: Partial<Record<FnName, Record<string, Node>>> = {
  asin: { "0/1": ZERO, "1/1": mul(num(1, 2), PI), "-1/1": mul(num(-1, 2), PI), "1/2": mul(num(1, 6), PI), "-1/2": mul(num(-1, 6), PI) },
  acos: { "0/1": mul(num(1, 2), PI), "1/1": ZERO, "-1/1": PI, "1/2": mul(num(1, 3), PI), "-1/2": mul(num(2, 3), PI) },
  atan: { "0/1": ZERO, "1/1": mul(num(1, 4), PI), "-1/1": mul(num(-1, 4), PI) },
};

const ODD = new Set<FnName>(["sin", "tan", "csc", "cot", "asin", "atan", "sinh", "tanh"]);
const EVEN = new Set<FnName>(["cos", "sec", "cosh", "abs"]);

function hasNegativeCoefficient(n: Node): boolean {
  if (n.k === "num") return n.v.n < 0;
  return n.k === "mul" && n.factors[0].k === "num" && n.factors[0].v.n < 0;
}

export function simplifyFn(name: FnName, arg: Node): Node {
  if (arg.k === "num" || !hasSymbols(arg)) {
    const special = constantFunction(name, arg);
    if (special) return special;
  }
  if (hasNegativeCoefficient(arg) && !isNum(arg)) {
    const flipped = simplifyMul([num(-1), arg]);
    if (ODD.has(name)) return simplifyMul([num(-1), simplifyFn(name, flipped)]);
    if (EVEN.has(name)) return simplifyFn(name, flipped);
  }
  switch (name) {
    case "ln":
      if (arg.k === "pow" && arg.base.k === "const" && arg.base.name === "e") return arg.exp;
      break;
    case "sin":
      if (arg.k === "fn" && arg.name === "asin") return arg.arg;
      break;
    case "cos":
      if (arg.k === "fn" && arg.name === "acos") return arg.arg;
      break;
    case "tan":
      if (arg.k === "fn" && arg.name === "atan") return arg.arg;
      break;
    case "abs":
      if (arg.k === "fn" && arg.name === "abs") return arg;
      if (arg.k === "pow" && arg.exp.k === "num" && arg.exp.v.d === 1 && arg.exp.v.n % 2 === 0) return arg;
      if (arg.k === "pow" && arg.base.k === "const") return arg;
      break;
  }
  return fn(name, arg);
}

function constantFunction(name: FnName, arg: Node): Node | null {
  if (["sin", "cos", "tan", "sec", "csc", "cot"].includes(name)) {
    const q = piMultiple(arg);
    if (q) return trigSpecial(name, q);
  }
  if (arg.k === "num") {
    const v = arg.v;
    const table = INVERSE_TRIG[name];
    if (table && `${v.n}/${v.d}` in table) return table[`${v.n}/${v.d}`];
    if ((name === "asin" || name === "acos") && Math.abs(R.toNumber(v)) > 1) {
      throw new UndefinedValue(`${name === "asin" ? "arcsin" : "arccos"} is only defined on [-1, 1].`);
    }
    if (v.n === 0 && (name === "sinh" || name === "tanh")) return ZERO;
    if (v.n === 0 && name === "cosh") return ONE;
    if (name === "abs") return numR(v.n < 0 ? R.neg(v) : v);
    if (name === "ln") {
      if (v.n <= 0) throw new UndefinedValue("The natural logarithm is only defined for positive numbers.");
      if (v.n === 1 && v.d === 1) return ZERO;
    }
  }
  if (name === "ln" && arg.k === "const" && arg.name === "e") return ONE;
  if (name === "ln" || name === "abs") {
    const value = evaluate(arg);
    if (name === "ln" && Number.isFinite(value) && value <= 0) {
      throw new UndefinedValue("The natural logarithm is only defined for positive numbers.");
    }
    if (name === "abs" && Number.isFinite(value)) return value >= 0 ? arg : simplifyMul([num(-1), arg]);
  }
  return null;
}

// ---------- expansion ----------

const MAX_TERMS = 300;

function multiplyOut(a: Node, b: Node): Node {
  const at = a.k === "add" ? a.terms : [a];
  const bt = b.k === "add" ? b.terms : [b];
  if (at.length * bt.length > MAX_TERMS) return simplifyMul([a, b]);
  const terms: Node[] = [];
  for (const x of at) for (const y of bt) terms.push(simplifyMul([x, y]));
  return simplifyAdd(terms);
}

const isDenominator = (f: Node): boolean => f.k === "pow" && hasNegativeCoefficient(f.exp);

/** Multiplies out products and small integer powers of sums. Denominators are left alone. */
export function expand(n: Node): Node {
  const s = simplify(n);
  return guardSize(expandCanonical(s));
}

function expandCanonical(n: Node): Node {
  switch (n.k) {
    case "add":
      return simplifyAdd(n.terms.map(expandCanonical));
    case "mul": {
      const dens = n.factors.filter(isDenominator);
      const nums = n.factors.filter((f) => !isDenominator(f)).map(expandCanonical);
      const top = nums.reduce<Node>((acc, f) => multiplyOut(acc, f), ONE);
      if (dens.length === 0) return top;
      // Keep a single fraction: distribute only if the numerator is not a sum.
      if (top.k === "add") return { k: "mul", factors: [top, ...dens].sort(compareFactors) };
      return simplifyMul([top, ...dens]);
    }
    case "pow":
      if (n.base.k === "add" && n.exp.k === "num" && R.isInt(n.exp.v) && n.exp.v.n > 1 && n.exp.v.n <= 8) {
        let result: Node = ONE;
        for (let i = 0; i < n.exp.v.n; i++) result = multiplyOut(result, n.base);
        return result;
      }
      return n;
    default:
      return n;
  }
}

/** Picks the more compact of the simplified and expanded forms. */
export function bestForm(n: Node): Node {
  const s = simplify(n);
  let e: Node;
  try {
    e = expand(s);
  } catch {
    return s;
  }
  return sizeOf(e) < sizeOf(s) ? e : s;
}

function sizeOf(n: Node): number {
  switch (n.k) {
    case "num":
      return n.v.d === 1 ? 1 : 2;
    case "sym":
    case "const":
      return 1;
    case "add":
      return n.terms.reduce((s, t) => s + sizeOf(t), 0) + n.terms.length - 1;
    case "mul":
      return n.factors.reduce((s, f) => s + sizeOf(f), 0);
    case "pow":
      return sizeOf(n.base) + sizeOf(n.exp);
    case "fn":
      return 1 + sizeOf(n.arg);
    default:
      return 1;
  }
}

/** Substitutes an exact value for v and simplifies; throws UndefinedValue if undefined. */
export function substituteExact(n: Node, v: string, value: Node): Node {
  const replaced = replaceSym(n, v, value);
  return simplify(replaced);
}

function replaceSym(n: Node, v: string, value: Node): Node {
  if (!contains(n, v)) return n;
  switch (n.k) {
    case "sym":
      return value;
    case "add":
      return { k: "add", terms: n.terms.map((t) => replaceSym(t, v, value)) };
    case "mul":
      return { k: "mul", factors: n.factors.map((f) => replaceSym(f, v, value)) };
    case "div":
      return { k: "div", num: replaceSym(n.num, v, value), den: replaceSym(n.den, v, value) };
    case "neg":
      return { k: "neg", arg: replaceSym(n.arg, v, value) };
    case "pow":
      return { k: "pow", base: replaceSym(n.base, v, value), exp: replaceSym(n.exp, v, value) };
    case "fn":
      return { k: "fn", name: n.name, arg: replaceSym(n.arg, v, value) };
    default:
      return n;
  }
}

