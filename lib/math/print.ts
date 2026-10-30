// Printers: LaTeX for display, plain text for copying (re-parseable by our parser),
// and Algebrite syntax for the integration fallback.

import type { FnName, Node } from "./ast";
import { MathError } from "./errors";
import type { Rational } from "./rational";

// ---------- shared helpers ----------

function isNegativeTerm(t: Node): boolean {
  if (t.k === "num") return t.v.n < 0;
  if (t.k === "neg") return true;
  if (t.k === "mul" && t.factors[0]?.k === "num") return t.factors[0].v.n < 0;
  if (t.k === "div") return isNegativeTerm(t.num);
  return false;
}

function negateTerm(t: Node): Node {
  if (t.k === "num") return { k: "num", v: { n: -t.v.n, d: t.v.d } };
  if (t.k === "neg") return t.arg;
  if (t.k === "div") return { k: "div", num: negateTerm(t.num), den: t.den };
  if (t.k === "mul" && t.factors[0]?.k === "num") {
    const c = t.factors[0].v;
    const rest = t.factors.slice(1);
    if (c.n === -1 && c.d === 1) return rest.length === 1 ? rest[0] : { k: "mul", factors: rest };
    return { k: "mul", factors: [{ k: "num", v: { n: -c.n, d: c.d } }, ...rest] };
  }
  return t;
}

/** Display order: start with a positive term when there is one. */
function displayTerms(terms: Node[]): Node[] {
  if (!isNegativeTerm(terms[0])) return terms;
  const firstPositive = terms.findIndex((t) => !isNegativeTerm(t));
  if (firstPositive < 0) return terms;
  return [terms[firstPositive], ...terms.filter((_, i) => i !== firstPositive)];
}

interface Fraction {
  negative: boolean;
  coef: Rational;
  top: Node[];
  bottom: Node[];
}

/** Splits a product into sign, |coefficient|, numerator factors and denominator factors. */
function splitProduct(n: Node): Fraction {
  const factors = n.k === "mul" ? n.factors : [n];
  let negative = false;
  let cn = 1;
  let cd = 1;
  const top: Node[] = [];
  const bottom: Node[] = [];
  for (const f of factors) {
    if (f.k === "num") {
      if (f.v.n < 0) negative = !negative;
      cn *= Math.abs(f.v.n);
      cd *= f.v.d;
    } else if (f.k === "pow" && f.exp.k === "num" && f.exp.v.n < 0) {
      const e = f.exp.v;
      bottom.push(e.n === -1 && e.d === 1 ? f.base : { k: "pow", base: f.base, exp: { k: "num", v: { n: -e.n, d: e.d } } });
    } else {
      top.push(f);
    }
  }
  return { negative, coef: { n: cn, d: cd }, top, bottom };
}

const TRIG_LIKE = new Set<FnName>(["sin", "cos", "tan", "sec", "csc", "cot", "sinh", "cosh", "tanh"]);

// ---------- LaTeX ----------

const LATEX_FN: Record<FnName, string> = {
  sin: "\\sin", cos: "\\cos", tan: "\\tan", sec: "\\sec", csc: "\\csc", cot: "\\cot",
  asin: "\\arcsin", acos: "\\arccos", atan: "\\arctan",
  sinh: "\\sinh", cosh: "\\cosh", tanh: "\\tanh", ln: "\\ln", abs: "",
};

const paren = (s: string) => `\\left(${s}\\right)`;

function texNum(v: Rational): string {
  const sign = v.n < 0 ? "-" : "";
  const n = Math.abs(v.n);
  return v.d === 1 ? `${sign}${n}` : `${sign}\\frac{${n}}{${v.d}}`;
}

function texFactor(f: Node): string {
  if (f.k === "add" || f.k === "neg" || (f.k === "num" && (f.v.n < 0 || f.v.d !== 1))) return paren(toLatex(f));
  return toLatex(f);
}

function joinFactors(parts: string[]): string {
  let out = "";
  parts.forEach((p, i) => {
    if (i > 0 && /^[0-9.]/.test(p)) out += " \\cdot ";
    else if (i > 0 && /[a-zA-Z]$/.test(out) && /^[a-zA-Z]/.test(p)) out += " ";
    out += p;
  });
  return out;
}

function texProduct(n: Node): string {
  const { negative, coef, top, bottom } = splitProduct(n);
  const sign = negative ? "-" : "";
  const topParts = top.map(texFactor);
  if (bottom.length === 0 && coef.d === 1) {
    const parts = coef.n === 1 && topParts.length ? topParts : [String(coef.n), ...topParts];
    return sign + joinFactors(parts);
  }
  const bottomParts = bottom.map((b) => (b.k === "add" && bottom.length > 1 ? paren(toLatex(b)) : toLatex(b)));
  const denominator = joinFactors([...(coef.d !== 1 ? [String(coef.d)] : []), ...bottomParts]);
  if (bottom.length === 0 && top.some((t) => t.k === "fn" || t.k === "add" || (t.k === "pow" && t.base.k === "fn"))) {
    // (1/2) sin(x) reads better than sin(x)/2.
    const lead = `\\frac{${coef.n}}{${coef.d}}`;
    return sign + lead + joinFactors(topParts);
  }
  const numParts = coef.n === 1 && topParts.length ? topParts : [String(coef.n), ...topParts];
  const numerator = top.length === 1 && top[0].k === "add" && coef.n === 1 ? toLatex(top[0]) : joinFactors(numParts);
  return `${sign}\\frac{${numerator}}{${denominator}}`;
}

function texPow(base: Node, exp: Node): string {
  if (exp.k === "num" && exp.v.n < 0) {
    return `\\frac{1}{${texPow(base, { k: "num", v: { n: -exp.v.n, d: exp.v.d } })}}`;
  }
  if (exp.k === "num" && exp.v.n === 1 && exp.v.d === 2) return `\\sqrt{${toLatex(base)}}`;
  if (exp.k === "num" && exp.v.n === 1 && exp.v.d > 2) return `\\sqrt[${exp.v.d}]{${toLatex(base)}}`;
  if (exp.k === "neg") return `\\frac{1}{${texPow(base, exp.arg)}}`;
  const e = exp.k === "num" && exp.v.d !== 1 ? `${exp.v.n}/${exp.v.d}` : toLatex(exp);
  if (base.k === "fn" && TRIG_LIKE.has(base.name) && exp.k === "num" && exp.v.d === 1 && exp.v.n > 0) {
    return `${LATEX_FN[base.name]}^{${e}}${paren(toLatex(base.arg))}`;
  }
  const needsParens =
    base.k === "add" || base.k === "mul" || base.k === "div" || base.k === "neg" || base.k === "pow" ||
    (base.k === "num" && (base.v.n < 0 || base.v.d !== 1)) || (base.k === "fn" && base.name !== "abs");
  const b = needsParens ? paren(toLatex(base)) : toLatex(base);
  return `${b}^{${e}}`;
}

export function toLatex(n: Node): string {
  switch (n.k) {
    case "num":
      return texNum(n.v);
    case "sym":
      return n.name === "θ" ? "\\theta" : n.name;
    case "const":
      return n.name === "pi" ? "\\pi" : "e";
    case "add": {
      const terms = displayTerms(n.terms);
      return terms
        .map((t, i) => {
          if (i === 0) return toLatex(t);
          return isNegativeTerm(t) ? ` - ${toLatex(negateTerm(t))}` : ` + ${toLatex(t)}`;
        })
        .join("");
    }
    case "mul":
      return texProduct(n);
    case "div":
      if (isNegativeTerm(n.num)) return `-\\frac{${toLatex(negateTerm(n.num))}}{${toLatex(n.den)}}`;
      return `\\frac{${toLatex(n.num)}}{${toLatex(n.den)}}`;
    case "neg": {
      const inner = n.arg.k === "add" ? paren(toLatex(n.arg)) : toLatex(n.arg);
      return `-${inner}`;
    }
    case "pow":
      return texPow(n.base, n.exp);
    case "fn":
      if (n.name === "abs") return `\\left|${toLatex(n.arg)}\\right|`;
      return `${LATEX_FN[n.name]}${paren(toLatex(n.arg))}`;
  }
}

// ---------- plain text ----------

function textFactor(f: Node): string {
  if (f.k === "add" || f.k === "neg" || f.k === "div" || (f.k === "num" && (f.v.n < 0 || f.v.d !== 1))) return `(${toText(f)})`;
  return toText(f);
}

function textProduct(n: Node): string {
  const { negative, coef, top, bottom } = splitProduct(n);
  const sign = negative ? "-" : "";
  const topParts = top.map(textFactor);
  const numerator = coef.n === 1 && topParts.length ? topParts.join("*") : [String(coef.n), ...topParts].join("*");
  if (bottom.length === 0 && coef.d === 1) return sign + numerator;
  const bottomParts = [...(coef.d !== 1 ? [String(coef.d)] : []), ...bottom.map(textFactor)];
  const den = bottomParts.length > 1 ? `(${bottomParts.join("*")})` : bottomParts[0];
  const numText = topParts.length > 1 || (topParts.length === 1 && coef.n !== 1) ? `(${numerator})` : numerator;
  return `${sign}${numText}/${den}`;
}

export function toText(n: Node): string {
  switch (n.k) {
    case "num":
      return n.v.d === 1 ? String(n.v.n) : `${n.v.n}/${n.v.d}`;
    case "sym":
      return n.name;
    case "const":
      return n.name;
    case "add":
      return displayTerms(n.terms)
        .map((t, i) => {
          if (i === 0) return toText(t);
          return isNegativeTerm(t) ? ` - ${toText(negateTerm(t))}` : ` + ${toText(t)}`;
        })
        .join("");
    case "mul":
      return textProduct(n);
    case "div":
      return `${textFactor(n.num)}/${textFactor(n.den)}`;
    case "neg":
      return `-${textFactor(n.arg)}`;
    case "pow": {
      const { base, exp } = n;
      if (exp.k === "num" && exp.v.n === 1 && exp.v.d === 2) return `sqrt(${toText(base)})`;
      if (exp.k === "num" && exp.v.n < 0) {
        if (exp.v.n === -1 && exp.v.d === 1) return `1/${textFactor(base)}`;
        return `1/${toText({ k: "pow", base, exp: { k: "num", v: { n: -exp.v.n, d: exp.v.d } } })}`;
      }
      const b = base.k === "sym" || base.k === "const" || (base.k === "num" && base.v.n >= 0 && base.v.d === 1) || (base.k === "fn")
        ? toText(base)
        : `(${toText(base)})`;
      const e = exp.k === "sym" || exp.k === "const" || (exp.k === "num" && exp.v.n >= 0 && exp.v.d === 1) ? toText(exp) : `(${toText(exp)})`;
      return `${b}^${e}`;
    }
    case "fn":
      return `${n.name}(${toText(n.arg)})`;
  }
}

// ---------- Algebrite ----------

const ALGEBRITE_FN: Partial<Record<FnName, string>> = {
  sin: "sin", cos: "cos", tan: "tan", asin: "arcsin", acos: "arccos", atan: "arctan",
  sinh: "sinh", cosh: "cosh", tanh: "tanh", ln: "log",
};

/** Symbol names are prefixed so they cannot collide with Algebrite built-ins such as d or i. */
export const ALGEBRITE_PREFIX = "qq";

export function toAlgebrite(n: Node): string {
  const a = toAlgebrite;
  switch (n.k) {
    case "num":
      return n.v.d === 1 ? `(${n.v.n})` : `(${n.v.n}/${n.v.d})`;
    case "sym":
      return ALGEBRITE_PREFIX + (n.name === "θ" ? "theta" : n.name);
    case "const":
      return n.name === "pi" ? "pi" : "exp(1)";
    case "add":
      return `(${n.terms.map(a).join("+")})`;
    case "mul":
      return `(${n.factors.map(a).join("*")})`;
    case "div":
      return `(${a(n.num)}/${a(n.den)})`;
    case "neg":
      return `(-${a(n.arg)})`;
    case "pow":
      if (n.base.k === "const" && n.base.name === "e") return `exp(${a(n.exp)})`;
      return `(${a(n.base)}^${a(n.exp)})`;
    case "fn": {
      const arg = a(n.arg);
      if (n.name === "sec") return `(1/cos(${arg}))`;
      if (n.name === "csc") return `(1/sin(${arg}))`;
      if (n.name === "cot") return `(cos(${arg})/sin(${arg}))`;
      const name = ALGEBRITE_FN[n.name];
      if (!name) throw new MathError(`The fallback integrator does not support ${n.name}().`);
      return `${name}(${arg})`;
    }
  }
}
