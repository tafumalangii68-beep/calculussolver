"use client";

import { AlertCircle, CheckCircle2, Copy, Mail, Send } from "lucide-react";
import { useState } from "react";

type Field = "name" | "email" | "subject" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const FIELDS: Field[] = ["name", "email", "subject", "message"];
const EMPTY: Values = { name: "", email: "", subject: "", message: "" };
const LIMITS = { name: 80, subject: 120, message: 4000 };
export const SUBJECTS = ["Report a wrong answer", "Suggest a feature", "Question about the site", "Something else"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name (at least 2 characters).";
  if (!v.email.trim()) e.email = "Please enter your email address so we can reply.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "That doesn't look like an email address. Check for a typo, e.g. name@example.com.";
  if (!v.subject) e.subject = "Please choose a subject.";
  if (v.message.trim().length < 10) e.message = "Please write a little more (at least 10 characters).";
  else if (v.message.length > LIMITS.message) e.message = `Please keep the message under ${LIMITS.message} characters.`;
  return e;
}

function compose(v: Values) {
  const subject = `[Calculus Solver] ${v.subject}`;
  const body = `${v.message.trim()}\n\n—\nFrom: ${v.name.trim()}\nReply to: ${v.email.trim()}`;
  return { subject, body };
}

const label = "block text-sm font-semibold text-ink";
const fieldBase =
  "mt-1.5 w-full rounded-xl border bg-paper px-4 py-3 text-ink placeholder:text-muted transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60";
const fieldClass = (bad: boolean) => `${fieldBase} ${bad ? "border-danger focus:border-danger focus:ring-danger/20" : "border-line-strong focus:border-accent focus:ring-accent/20"}`;

/**
 * Contact form. There is no server: on a valid submit it opens a pre-filled draft in the
 * visitor's own email app, so nothing is sent or stored by this website. With no published
 * address (`email` null) the form is shown disabled with an explanation.
 */
export function ContactForm({ email }: { email: string | null }) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "invalid" | "opened">("idle");
  const [copied, setCopied] = useState(false);
  const disabled = !email;

  const set = (f: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const next = { ...values, [f]: e.target.value };
    setValues(next);
    // Once a field has been left or a submit failed, re-check it as the visitor types.
    if (touched[f] || status === "invalid") setErrors((old) => ({ ...old, [f]: validate(next)[f] }));
  };
  const blur = (f: Field) => () => {
    setTouched((t) => ({ ...t, [f]: true }));
    if (values[f]) setErrors((old) => ({ ...old, [f]: validate(values)[f] }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const found = validate(values);
    setErrors(found);
    const first = FIELDS.find((f) => found[f]);
    if (first) {
      setStatus("invalid");
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    const { subject, body } = compose(values);
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("opened");
  };

  const copy = async () => {
    const { subject, body } = compose(values);
    try {
      await navigator.clipboard.writeText(`To: ${email}\nSubject: ${subject}\n\n${body}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const errorCount = Object.values(errors).filter(Boolean).length;
  const describe = (f: Field, hint?: string) => [errors[f] ? `contact-${f}-error` : "", hint ?? ""].filter(Boolean).join(" ") || undefined;
  const errorText = (f: Field) =>
    errors[f] && (
      <p id={`contact-${f}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-danger">
        <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
        {errors[f]}
      </p>
    );

  if (status === "opened") {
    return (
      <div role="status" className="rounded-3xl border border-ok/30 bg-surface p-6 shadow-[0_24px_60px_-24px_rgb(21_25_54/0.25)] sm:p-8">
        <span aria-hidden className="grid h-12 w-12 place-items-center rounded-2xl bg-ok-soft text-ok">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <h2 className="mt-4 font-display text-2xl font-extrabold text-ink">Your message is ready to send</h2>
        <p className="mt-2 leading-relaxed text-ink-soft">
          Your email app should now be open with the message filled in. <strong className="text-ink">It has not been sent yet:</strong> check it and press
          Send there.
        </p>
        <p className="mt-3 leading-relaxed text-ink-soft">
          If nothing opened, copy the message and email it to <a className="font-semibold text-accent-strong underline underline-offset-2" href={`mailto:${email}`}>{email}</a>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-5 py-3 font-semibold text-ink hover:border-accent hover:text-accent-strong">
            <Copy aria-hidden className="h-4 w-4" />
            {copied ? "Copied" : "Copy message"}
          </button>
          <button
            type="button"
            onClick={() => {
              setValues(EMPTY);
              setErrors({});
              setTouched({});
              setCopied(false);
              setStatus("idle");
            }}
            className="rounded-xl bg-brand-gradient px-5 py-3 font-semibold text-white shadow-glow hover:bg-brand-gradient-hover"
          >
            Write another message
          </button>
        </div>
        <p aria-live="polite" className="sr-only">
          {copied ? "Message copied to the clipboard." : ""}
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="contact-form-title"
      className="rounded-3xl border border-line bg-surface p-6 shadow-[0_24px_60px_-24px_rgb(21_25_54/0.25)] sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span aria-hidden className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
          <Mail className="h-5 w-5" />
        </span>
        <div>
          <h2 id="contact-form-title" className="font-display text-xl font-extrabold text-ink sm:text-2xl">
            Send us a message
          </h2>
          <p className="text-sm text-muted">All fields are required.</p>
        </div>
      </div>

      {disabled && (
        <p role="note" className="mt-6 flex items-start gap-2 rounded-xl border border-warn/30 bg-warn-soft px-4 py-3 text-sm text-warn">
          <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          A contact email address has not been published yet, so this form can&apos;t be used. Please check back soon.
        </p>
      )}

      {status === "invalid" && errorCount > 0 && (
        <div role="alert" className="mt-6 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          <p className="font-semibold">
            Please fix {errorCount === 1 ? "1 field" : `${errorCount} fields`} before continuing.
          </p>
        </div>
      )}

      <fieldset disabled={disabled} className="mt-6 grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">Your message</legend>
        <div>
          <label htmlFor="contact-name" className={label}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            maxLength={LIMITS.name}
            value={values.name}
            onChange={set("name")}
            onBlur={blur("name")}
            aria-invalid={!!errors.name}
            aria-describedby={describe("name")}
            aria-required
            className={fieldClass(!!errors.name)}
          />
          {errorText("name")}
        </div>
        <div>
          <label htmlFor="contact-email" className={label}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={set("email")}
            onBlur={blur("email")}
            aria-invalid={!!errors.email}
            aria-describedby={describe("email")}
            aria-required
            placeholder="name@example.com"
            className={fieldClass(!!errors.email)}
          />
          {errorText("email")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-subject" className={label}>
            Subject
          </label>
          <select
            id="contact-subject"
            name="subject"
            value={values.subject}
            onChange={set("subject")}
            onBlur={blur("subject")}
            aria-invalid={!!errors.subject}
            aria-describedby={describe("subject")}
            aria-required
            className={fieldClass(!!errors.subject)}
          >
            <option value="">Choose a subject…</option>
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {errorText("subject")}
        </div>
        <div className="sm:col-span-2">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="contact-message" className={label}>
              Message
            </label>
            <span id="contact-message-count" className={`text-xs ${values.message.length > LIMITS.message ? "text-danger" : "text-muted"}`}>
              {values.message.length} / {LIMITS.message}
            </span>
          </div>
          <textarea
            id="contact-message"
            name="message"
            rows={7}
            value={values.message}
            onChange={set("message")}
            onBlur={blur("message")}
            aria-invalid={!!errors.message}
            aria-describedby={describe("message", "contact-message-count")}
            aria-required
            placeholder={values.subject === SUBJECTS[0] ? "The expression you typed, the options you chose, and the answer you expected" : ""}
            className={`${fieldClass(!!errors.message)} resize-y`}
          />
          {errorText("message")}
        </div>
      </fieldset>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-brand-gradient-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          <Send aria-hidden className="h-4 w-4" />
          Continue in my email app
        </button>
        <p className="text-sm text-muted sm:max-w-xs sm:text-right">Nothing is sent by this website. You review and send the email yourself.</p>
      </div>
    </form>
  );
}
