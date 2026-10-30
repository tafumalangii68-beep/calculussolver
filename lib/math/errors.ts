/** An error whose message is safe and helpful to show directly to the user. */
export class MathError extends Error {
  hint?: string;

  constructor(message: string, hint?: string) {
    super(message);
    this.name = "MathError";
    this.hint = hint;
  }
}
