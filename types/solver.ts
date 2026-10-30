export type Operation =
  | "derivative"
  | "indefinite-integral"
  | "definite-integral"
  | "limit"
  | "taylor"
  | "critical-points";

export type LimitSide = "both" | "left" | "right";

export interface SolveRequest {
  operation: Operation;
  expression: string;
  variable: string;
  /** Derivative order, or the highest power kept in a Taylor polynomial. */
  order?: number;
  /** Definite integral bounds. */
  lower?: string;
  upper?: string;
  /** Limit approach value, or Taylor series center. */
  point?: string;
  side?: LimitSide;
  /** Search interval for critical points. */
  rangeMin?: string;
  rangeMax?: string;
}

export interface Step {
  rule: string;
  latex: string;
  note?: string;
  depth: number;
}

export interface StepSection {
  title: string;
  steps: Step[];
  truncated?: boolean;
}

export interface ResultTable {
  caption: string;
  headers: string[];
  /** Each cell is LaTeX, except cells in columns listed in `textColumns`. */
  rows: string[][];
  textColumns?: number[];
}

export interface ResultCheck {
  status: "verified" | "numeric" | "warning";
  message: string;
}

export interface SolveSuccess {
  ok: true;
  operation: Operation;
  /** The problem as typeset math, e.g. \frac{d}{dx}\left[x^2\right]. */
  problemLatex: string;
  answerLatex: string;
  answerText: string;
  /** Decimal approximation, when the answer is a number. */
  approx?: string;
  method: string;
  sections: StepSection[];
  notes: string[];
  check?: ResultCheck;
  table?: ResultTable;
}

export interface SolveFailure {
  ok: false;
  error: string;
  hint?: string;
}

export type SolveResult = SolveSuccess | SolveFailure;
