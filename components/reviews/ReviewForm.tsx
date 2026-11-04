"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { REVIEW_LIMITS, validateReview, type ReviewField } from "@/lib/reviews/validate";
import { StarInput } from "./StarInput";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "success" } | { kind: "error"; message: string };

const field =
  "mt-1 w-full rounded-lg border bg-surface px-3 py-2 text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

export function ReviewForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot: hidden from people, filled in by bots
  const [errors, setErrors] = useState<Partial<Record<ReviewField, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const startedAt = useRef(0);

  const markStarted = () => {
    if (!startedAt.current) startedAt.current = Date.now();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status.kind === "sending") return;
    const check = validateReview({ name, email, rating, message });
    if (!check.ok) {
      setErrors(check.errors);
      setStatus({ kind: "error", message: "Please fix the highlighted fields." });
      return;
    }
    setErrors({});
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, rating, message, website, startedAt: startedAt.current || Date.now() }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Partial<Record<ReviewField, string>> };
      if (res.ok && data.ok) {
        setStatus({ kind: "success" });
        setName("");
        setEmail("");
        setRating(0);
        setMessage("");
        return;
      }
      if (data.fields) setErrors(data.fields);
      setStatus({ kind: "error", message: data.error ?? "Your review could not be sent. Please try again." });
    } catch {
      setStatus({ kind: "error", message: "Your review could not be sent. Check your connection and try again." });
    }
  };

  if (status.kind === "success") {
    return (
      <div role="status" className="rounded-card border border-ok/30 bg-ok-soft p-6">
        <p className="flex items-center gap-2 font-semibold text-ok">
          <CheckCircle2 aria-hidden className="h-5 w-5" /> Thank you for your review!
        </p>
        <p className="mt-2 text-ink-soft">
          It has been received and will appear on the site once it has been approved. Reviews are usually checked within a few days.
        </p>
        <button type="button" onClick={() => setStatus({ kind: "idle" })} className="mt-4 text-sm font-medium text-accent-strong underline underline-offset-2">
          Write another review
        </button>
      </div>
    );
  }

  const border = (f: ReviewField) => (errors[f] ? "border-danger" : "border-line-strong");
  const describedBy = (f: ReviewField, extra?: string) => [errors[f] ? `review-${f}-error` : "", extra ?? ""].filter(Boolean).join(" ") || undefined;

  return (
    <form onSubmit={onSubmit} onFocus={markStarted} noValidate className="relative space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="review-name" className="block text-sm font-medium text-ink">
            Name <span className="text-danger">*</span>
          </label>
          <input
            id="review-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={REVIEW_LIMITS.nameMax}
            autoComplete="given-name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name", "review-name-help")}
            className={`${field} ${border("name")}`}
          />
          <p id="review-name-help" className="mt-1 text-xs text-muted">
            Shown with your review. A first name or initials is fine.
          </p>
          {errors.name && (
            <p id="review-name-error" className="mt-1 text-sm text-danger">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="review-email" className="block text-sm font-medium text-ink">
            Email <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="review-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={REVIEW_LIMITS.emailMax}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email", "review-email-help")}
            className={`${field} ${border("email")}`}
          />
          <p id="review-email-help" className="mt-1 text-xs text-muted">
            Never shown publicly. Only used if we need to contact you about your review.
          </p>
          {errors.email && (
            <p id="review-email-error" className="mt-1 text-sm text-danger">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <StarInput name="review-rating" value={rating} onChange={setRating} error={errors.rating} />

      <div>
        <label htmlFor="review-message" className="block text-sm font-medium text-ink">
          Your review <span className="text-danger">*</span>
        </label>
        <textarea
          id="review-message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={REVIEW_LIMITS.messageMax}
          required
          placeholder="What did you use the solver for, and how did it help?"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message", "review-message-count")}
          className={`${field} ${border("message")}`}
        />
        <p id="review-message-count" className="mt-1 text-right text-xs text-muted">
          {message.trim().length} / {REVIEW_LIMITS.messageMax}
        </p>
        {errors.message && (
          <p id="review-message-error" className="text-sm text-danger">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot: invisible to people and screen readers. */}
      <div aria-hidden className="sr-only">
        <label htmlFor="review-website">Website</label>
        <input id="review-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      {status.kind === "error" && (
        <p role="alert" className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          {status.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-70"
        >
          {status.kind === "sending" && <Loader2 aria-hidden className="h-4 w-4 animate-spin" />}
          {status.kind === "sending" ? "Sending…" : "Submit Review"}
        </button>
        <p className="text-xs text-muted">
          Reviews are checked before they appear. See our <Link href="/privacy-policy" className="underline underline-offset-2">Privacy Policy</Link>.
        </p>
      </div>
    </form>
  );
}
