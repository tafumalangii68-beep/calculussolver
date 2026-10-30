import type { Operation } from "./solver";

export interface Faq {
  q: string;
  a: string;
}

export interface ExampleStep {
  text: string;
  math?: string;
}

export interface WorkedExample {
  title: string;
  /** LaTeX of the problem. */
  problem: string;
  steps: ExampleStep[];
  /** LaTeX of the final answer. */
  answer: string;
  /** Machine check: the solver must reproduce this answer (see tests/content.test.ts). */
  check: {
    operation: Operation;
    expression: string;
    expected: string;
    order?: number;
    lower?: string;
    upper?: string;
    point?: string;
    side?: "both" | "left" | "right";
  };
}

export interface SolverExample {
  label: string;
  operation: Operation;
  expression: string;
  order?: number;
  lower?: string;
  upper?: string;
  point?: string;
  side?: "both" | "left" | "right";
}

export interface Illustration {
  src: string;
  alt: string;
  width: number;
  height: number;
}
