// Recursive-descent parser for plain-text math such as "3x^2 + sin(2x)/x".
//
// Supported: + - * / ^ (and **), parentheses ( ) [ ] { }, |x| bars,
// implicit multiplication (2x, x sin x, (x+1)(x-1)), functions with or without
// parentheses (sin x, sin(x), sin^2(x)), the constants pi and e, and a few
// Unicode symbols (π, √, ², ³, ×, ·, ÷, −).

import { E, FUNCTION_NAMES, PI, add, div, fn, freeSymbols, mul, neg, num, numR, pow, sym, type FnName, type Node } from "./ast";
import { MathError } from "./errors";
import { ratFromDecimal } from "./rational";

type Token =
  | { t: "num"; text: string; pos: number }
  | { t: "name"; text: string; pos: number }
  | { t: "op"; text: string; pos: number };

/** Every multi-letter name the parser understands, mapped to its meaning. */
const NAMES: Record<string, FnName | "pi" | "e" | "exp" | "sqrt" | "cbrt" | "log"> = {
  arcsin: "asin", arccos: "acos", arctan: "atan",
  asin: "asin", acos: "acos", atan: "atan",
  sinh: "sinh", cosh: "cosh", tanh: "tanh",
  sin: "sin", cos: "cos", tan: "tan", sec: "sec", csc: "csc", cot: "cot",
  ln: "ln", log: "log", abs: "abs", exp: "exp", sqrt: "sqrt", cbrt: "cbrt",
  pi: "pi", e: "e",
};
const NAMES_BY_LENGTH = Object.keys(NAMES).sort((a, b) => b.length - a.length);
const FUNCTION_LIKE = new Set(["exp", "sqrt", "cbrt", "log", ...FUNCTION_NAMES]);

const UNICODE: [RegExp, string][] = [
  [/π/g, "pi"],
  [/√/g, "sqrt"],
  [/²/g, "^2"],
  [/³/g, "^3"],
  [/[×·∙⋅]/g, "*"],
  [/÷/g, "/"],
  [/[−–—]/g, "-"],
  [/\*\*/g, "^"],
];

export interface ParseResult {
  node: Node;
  notes: string[];
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const c = input[i];
    if (/\s/.test(c)) {
      i++;
    } else if (/[0-9.]/.test(c)) {
      const start = i;
      while (i < input.length && /[0-9.]/.test(input[i])) i++;
      const text = input.slice(start, i);
      if (text === "." || (text.match(/\./g) ?? []).length > 1) {
        throw new MathError(`"${text}" is not a valid number.`, "Use a single decimal point, for example 2.5.");
      }
      tokens.push({ t: "num", text, pos: start });
    } else if (/[a-zA-Zθ]/.test(c)) {
      const start = i;
      while (i < input.length && /[a-zA-Zθ]/.test(input[i])) i++;
      let text = input.slice(start, i);
      // log10 is the one name that contains digits.
      if (text.toLowerCase().endsWith("log") && input.slice(i, i + 2) === "10") {
        text += "10";
        i += 2;
      }
      tokens.push({ t: "name", text, pos: start });
    } else if ("+-*/^()[]{}|,".includes(c)) {
      tokens.push({ t: "op", text: c, pos: i });
      i++;
    } else if (c === "=") {
      throw new MathError(
        "Enter only an expression, not an equation.",
        'Remove the "=" sign. For example, type x^2 + 3x instead of y = x^2 + 3x.',
      );
    } else if (c === "!") {
      throw new MathError("Factorials (!) are not supported.");
    } else {
      throw new MathError(`Unexpected character "${c}".`, "Check the syntax guide for supported symbols.");
    }
  }
  return tokens;
}

/** Splits a run of letters like "xsinx" into known names and single-letter variables. */
function splitName(text: string, pos: number, followedByParen: boolean): Token[] {
  const lower = text.toLowerCase();
  if (lower === "log10") return [{ t: "name", text: "log10", pos }];
  if (lower.endsWith("log10")) {
    return [...splitName(text.slice(0, -5), pos, false), { t: "name", text: "log10", pos: pos + text.length - 5 }];
  }
  const parts: Token[] = [];
  let i = 0;
  while (i < lower.length) {
    const known = NAMES_BY_LENGTH.find((n) => n.length > 1 && lower.startsWith(n, i));
    if (known) {
      parts.push({ t: "name", text: known, pos: pos + i });
      i += known.length;
    } else {
      parts.push({ t: "name", text: text[i], pos: pos + i });
      i++;
    }
  }
  const allSingle = parts.every((p) => p.text.length === 1);
  if (allSingle && text.length >= 2 && followedByParen) {
    throw new MathError(
      `Unknown function "${text}".`,
      "Supported functions: sin, cos, tan, sec, csc, cot, asin, acos, atan, sinh, cosh, tanh, ln, log, exp, sqrt, cbrt, abs.",
    );
  }
  if (allSingle && text.length >= 3) {
    throw new MathError(
      `Unknown name "${text}".`,
      `Use * between variables (for example ${text.split("").join("*")}) or check the spelling of the function.`,
    );
  }
  return parts;
}

function checkBrackets(tokens: Token[]): void {
  const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const stack: string[] = [];
  for (const tok of tokens) {
    if (tok.t !== "op") continue;
    if ("([{".includes(tok.text)) stack.push(tok.text);
    else if (tok.text in pairs) {
      if (stack.length === 0) throw new MathError(`There is an extra closing "${tok.text}".`, "Remove it or add the matching opening bracket.");
      const open = stack.pop();
      if (open !== pairs[tok.text]) throw new MathError(`Mismatched brackets: "${open}" is closed by "${tok.text}".`);
    }
  }
  if (stack.length > 0) {
    throw new MathError(
      `Missing ${stack.length} closing bracket${stack.length > 1 ? "s" : ""}.`,
      `Every "${stack[stack.length - 1]}" needs a matching closing bracket.`,
    );
  }
  const bars = tokens.filter((t) => t.t === "op" && t.text === "|").length;
  if (bars % 2 === 1) throw new MathError('Unmatched "|" absolute value bar.', "Write absolute values as |x| or abs(x).");
}

class Parser {
  private i = 0;
  private absDepth = 0;
  notes = new Set<string>();

  constructor(private tokens: Token[]) {}

  private peek(): Token | undefined {
    return this.tokens[this.i];
  }

  private isOp(text: string, tok = this.peek()): boolean {
    return tok?.t === "op" && tok.text === text;
  }

  private expectClose(open: string): void {
    const close = { "(": ")", "[": "]", "{": "}" }[open]!;
    if (!this.isOp(close)) throw new MathError(`Expected "${close}".`);
    this.i++;
  }

  parse(): Node {
    const node = this.expr();
    const tok = this.peek();
    if (tok) throw new MathError(`Unexpected "${tok.text}".`, "Check for a missing operator or bracket near this symbol.");
    return node;
  }

  private expr(): Node {
    const terms: Node[] = [this.term()];
    while (this.isOp("+") || this.isOp("-")) {
      const op = this.peek()!.text;
      this.i++;
      this.requireOperand(op);
      const t = this.term();
      terms.push(op === "-" ? neg(t) : t);
    }
    return terms.length === 1 ? terms[0] : add(...terms);
  }

  private requireOperand(op: string): void {
    const tok = this.peek();
    if (!tok) throw new MathError(`The expression ends with "${op}".`, "Add the missing term after the operator.");
    if (tok.t === "op" && "*/^)]},".includes(tok.text)) {
      throw new MathError(`"${op}" is followed by "${tok.text}".`, "Two operators cannot appear in a row.");
    }
  }

  /** True if the next token can begin a factor that is multiplied implicitly. */
  private startsFactor(): boolean {
    const tok = this.peek();
    if (!tok) return false;
    if (tok.t === "num" || tok.t === "name") return true;
    if (tok.t === "op" && "([{".includes(tok.text)) return true;
    return this.isOp("|") && this.absDepth === 0;
  }

  private term(): Node {
    let left = this.unary();
    for (;;) {
      if (this.isOp("*") || this.isOp("/")) {
        const op = this.peek()!.text;
        this.i++;
        this.requireOperand(op);
        const right = this.unary();
        left = op === "*" ? mul(left, right) : div(left, right);
      } else if (this.startsFactor()) {
        left = mul(left, this.power());
      } else {
        return left;
      }
    }
  }

  private unary(): Node {
    if (this.isOp("-")) {
      this.i++;
      this.requireOperand("-");
      return neg(this.unary());
    }
    if (this.isOp("+")) {
      this.i++;
      this.requireOperand("+");
      return this.unary();
    }
    return this.power();
  }

  private power(): Node {
    const base = this.primary();
    if (this.isOp("^")) {
      this.i++;
      this.requireOperand("^");
      return pow(base, this.unary());
    }
    return base;
  }

  private primary(): Node {
    const tok = this.peek();
    if (!tok) throw new MathError("The expression is incomplete.", "Check for a missing term at the end.");
    if (tok.t === "num") {
      this.i++;
      return numR(ratFromDecimal(tok.text));
    }
    if (tok.t === "op") {
      if ("([{".includes(tok.text)) {
        this.i++;
        if (this.isOp(")") || this.isOp("]") || this.isOp("}")) throw new MathError("Empty brackets.");
        const inner = this.expr();
        this.expectClose(tok.text);
        return inner;
      }
      if (tok.text === "|") {
        this.i++;
        this.absDepth++;
        const inner = this.expr();
        this.absDepth--;
        if (!this.isOp("|")) throw new MathError('Unmatched "|" absolute value bar.');
        this.i++;
        return fn("abs", inner);
      }
      throw new MathError(`Unexpected "${tok.text}".`, "Check for a missing term before this symbol.");
    }
    return this.name(tok);
  }

  private name(tok: Token): Node {
    this.i++;
    const name = tok.text;
    if (name === "pi") return PI;
    if (name === "e") return E;
    if (!FUNCTION_LIKE.has(name) && name !== "log10") {
      if (name.length === 1 || name === "θ") return sym(name);
      throw new MathError(`Unknown name "${name}".`);
    }

    // Optional power written on the function name: sin^2(x).
    let power: Node | null = null;
    if (this.isOp("^")) {
      this.i++;
      power = this.unary();
      if (power.k === "neg" && power.arg.k === "num" && power.arg.v.n === 1 && power.arg.v.d === 1) {
        throw new MathError(
          `"${name}^-1" is ambiguous.`,
          `Use a${name}(x) for the inverse function, or (${name}(x))^(-1) for the reciprocal.`,
        );
      }
    }

    let args: Node[];
    if (this.isOp("(") || this.isOp("[") || this.isOp("{")) {
      const open = this.peek()!.text;
      this.i++;
      if (this.isOp(")")) throw new MathError(`${name}() needs an argument.`);
      args = [this.expr()];
      while (this.isOp(",")) {
        this.i++;
        args.push(this.expr());
      }
      this.expectClose(open);
    } else {
      if (!this.startsFactor()) {
        throw new MathError(`${name} needs an argument.`, `Write it like ${name}(x).`);
      }
      // "sin 2x" means sin(2x); stop before another function: "sin x cos x".
      let arg = this.power();
      while (this.startsFactor() && !(this.peek()!.t === "name" && FUNCTION_LIKE.has(this.peek()!.text))) {
        arg = mul(arg, this.power());
      }
      args = [arg];
    }

    const result = this.applyFunction(name, args);
    return power ? pow(result, power) : result;
  }

  private applyFunction(name: string, args: Node[]): Node {
    const arity = name === "log" ? [1, 2] : [1];
    if (!arity.includes(args.length)) {
      throw new MathError(`${name}() takes ${arity.join(" or ")} argument${arity.length > 1 || arity[0] > 1 ? "s" : ""}.`);
    }
    const [x] = args;
    switch (name) {
      case "exp":
        return pow(E, x);
      case "sqrt":
        return pow(x, num(1, 2));
      case "cbrt":
        return pow(x, num(1, 3));
      case "log10":
        return div(fn("ln", x), fn("ln", num(10)));
      case "log":
        if (args.length === 2) return div(fn("ln", x), fn("ln", args[1]));
        this.notes.add("log(x) is read as the natural logarithm ln(x). Use log10(x) or log(x, b) for other bases.");
        return fn("ln", x);
      default:
        return fn(name as FnName, x);
    }
  }
}

function prepare(input: string): Token[] {
  let text = input.trim();
  if (!text) throw new MathError("Enter an expression to solve.");
  if (text.length > 500) throw new MathError("The expression is too long (500 characters maximum).");
  for (const [re, rep] of UNICODE) text = text.replace(re, rep);
  const raw = tokenize(text);
  checkBrackets(raw);
  const tokens: Token[] = [];
  raw.forEach((tok, idx) => {
    if (tok.t === "name") {
      const next = raw[idx + 1];
      tokens.push(...splitName(tok.text, tok.pos, next?.t === "op" && next.text === "("));
    } else tokens.push(tok);
  });
  return tokens;
}

export function parse(input: string): ParseResult {
  const parser = new Parser(prepare(input));
  const node = parser.parse();
  return { node, notes: [...parser.notes] };
}

/** Parses an expression and makes sure it only uses the given variable (or none). */
export function parseIn(input: string, variable: string): ParseResult {
  const result = parse(input);
  const others = [...freeSymbols(result.node)].filter((s) => s !== variable);
  if (others.length) {
    throw new MathError(
      `This calculation needs an expression in ${variable} only, but it also contains ${others.map((s) => `"${s}"`).join(", ")}.`,
      `Replace other letters with numbers, or choose ${others[0]} as the variable.`,
    );
  }
  return result;
}

export type PointValue = { kind: "finite"; node: Node } | { kind: "inf"; sign: 1 | -1 };

/** Parses a bound or approach value: a constant expression, or ±infinity. */
export function parsePoint(input: string, label: string): PointValue {
  const text = input.trim().toLowerCase().replace(/\s+/g, "");
  if (!text) throw new MathError(`Enter a value for the ${label}.`);
  const inf = /^([+-]?)(inf|infinity|∞|oo)$/.exec(text);
  if (inf) return { kind: "inf", sign: inf[1] === "-" ? -1 : 1 };
  let node: Node;
  try {
    node = parse(input).node;
  } catch (err) {
    if (err instanceof MathError) throw new MathError(`The ${label} is not valid: ${err.message}`, err.hint);
    throw err;
  }
  const symbols = freeSymbols(node);
  if (symbols.size) {
    throw new MathError(`The ${label} must be a number (such as 2, -1/3, pi/2 or inf), not a variable.`);
  }
  return { kind: "finite", node };
}
