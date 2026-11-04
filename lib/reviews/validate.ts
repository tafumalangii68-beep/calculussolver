// Review validation, shared by the form (instant feedback) and the API (the real check).

export const REVIEW_LIMITS = {
  nameMin: 2,
  nameMax: 50,
  emailMax: 254,
  messageMin: 10,
  messageMax: 1000,
} as const;

/** Optional "I am a…" choices shown under the reviewer's name. */
export const REVIEW_CATEGORIES = [
  "High school student",
  "AP Calculus student",
  "College student",
  "Graduate student",
  "Teacher or tutor",
  "Self-learner",
  "Parent",
] as const;

export interface ReviewInput {
  name: string;
  email: string;
  rating: number;
  message: string;
  /** One of REVIEW_CATEGORIES, or "" if not given. */
  category: string;
}

export type ReviewField = keyof ReviewInput;

export type ValidationResult =
  | { ok: true; value: ReviewInput }
  | { ok: false; errors: Partial<Record<ReviewField, string>> };

const LINK = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|ru|cn|xyz|top|info)\b)/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Collapses whitespace so "Great   site" and "Great site" are treated the same. */
export function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function validateReview(raw: Partial<Record<ReviewField, unknown>>): ValidationResult {
  const errors: Partial<Record<ReviewField, string>> = {};
  const name = normalizeText(String(raw.name ?? ""));
  const email = String(raw.email ?? "").trim().toLowerCase();
  const message = normalizeText(String(raw.message ?? ""));
  const rating = Number(raw.rating);
  const category = String(raw.category ?? "").trim();

  if (name.length < REVIEW_LIMITS.nameMin) errors.name = "Please enter your name.";
  else if (name.length > REVIEW_LIMITS.nameMax) errors.name = `Please keep your name under ${REVIEW_LIMITS.nameMax} characters.`;
  else if (LINK.test(name)) errors.name = "Please enter your name without links.";

  if (email && (email.length > REVIEW_LIMITS.emailMax || !EMAIL.test(email))) errors.email = "Please enter a valid email address, or leave it empty.";

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = "Please choose a rating from 1 to 5 stars.";

  if (message.length < REVIEW_LIMITS.messageMin) errors.message = `Please write at least ${REVIEW_LIMITS.messageMin} characters.`;
  else if (message.length > REVIEW_LIMITS.messageMax) errors.message = `Please keep your review under ${REVIEW_LIMITS.messageMax} characters.`;
  else if (LINK.test(message)) errors.message = "Links aren't allowed in reviews.";

  if (category && !(REVIEW_CATEGORIES as readonly string[]).includes(category)) errors.category = "Please choose one of the listed options.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value: { name, email, rating, message, category } };
}

/** Public review shape: never includes the email. */
export interface PublicReview {
  id: number;
  name: string;
  rating: number;
  message: string;
  category: string | null;
  createdAt: string;
}

export interface ReviewSummary {
  count: number;
  average: number;
}
