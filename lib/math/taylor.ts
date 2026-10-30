// Taylor polynomials: c_k = f^(k)(a) / k!, computed with exact substitution.

import type { ResultTable } from "@/types/solver";
import { add, isNum, mul, num, pow, sym, type Node } from "./ast";
import { differentiate } from "./derivative";
import { MathError } from "./errors";
import { toLatex } from "./print";
import { simplify, substituteExact } from "./simplify";

export const MAX_TAYLOR_ORDER = 10;

export interface TaylorOutcome {
  polynomial: Node;
  table: ResultTable;
}

function factorial(k: number): number {
  let r = 1;
  for (let i = 2; i <= k; i++) r *= i;
  return r;
}

export function taylorPolynomial(f: Node, v: string, center: Node, order: number): TaylorOutcome {
  if (!Number.isInteger(order) || order < 1 || order > MAX_TAYLOR_ORDER) {
    throw new MathError(`Choose an order between 1 and ${MAX_TAYLOR_ORDER}.`);
  }
  const x = sym(v);
  const shift = isNum(center, 0) ? x : simplify(add(x, mul(num(-1), center)));
  const terms: Node[] = [];
  const rows: string[][] = [];
  let derivative = simplify(f);
  for (let k = 0; k <= order; k++) {
    if (k > 0) derivative = differentiate(derivative, v);
    let value: Node;
    try {
      value = substituteExact(derivative, v, center);
    } catch (err) {
      if (err instanceof MathError) {
        throw new MathError(
          `The ${k === 0 ? "function" : `derivative of order ${k}`} is undefined at ${toLatex(center).replace(/\\/g, "")}, so there is no Taylor polynomial centered there.`,
          "Try a different center where the function is smooth (for ln(x), use a = 1).",
        );
      }
      throw err;
    }
    const coef = simplify(mul(value, num(1, factorial(k))));
    rows.push([String(k), k === 0 ? toLatex(derivative) : toLatex(derivative), toLatex(value), toLatex(coef)]);
    if (!isNum(coef, 0)) {
      const power = k === 0 ? null : k === 1 ? shift : pow(shift, num(k));
      terms.push(power ? simplify(mul(coef, power)) : coef);
    }
  }
  const polynomial: Node = terms.length === 0 ? num(0) : terms.length === 1 ? terms[0] : { k: "add", terms };
  const name = v === "θ" ? "\\theta" : v;
  return {
    polynomial,
    table: {
      caption: "Derivatives at the center and the resulting coefficients",
      headers: ["k", `f^{(k)}(${name})`, "f^{(k)}(a)", "c_k = f^{(k)}(a)/k!"],
      rows,
      textColumns: [0],
    },
  };
}
