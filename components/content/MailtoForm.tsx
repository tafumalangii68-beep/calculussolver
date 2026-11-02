"use client";

import { useState } from "react";

const field =
  "mt-1 w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

/** Prepares an email in the visitor's own mail app. Nothing is sent by the website. */
export function MailtoForm({ email }: { email: string }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [opened, setOpened] = useState(false);

  const href = `mailto:${email}?subject=${encodeURIComponent(subject || "Calculus Solver")}&body=${encodeURIComponent(message)}`;

  return (
    <form
      className="mt-6 max-w-xl rounded-card border border-line bg-surface p-5 not-prose"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = href;
        setOpened(true);
      }}
    >
      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-ink">
          Subject
        </label>
        <input id="contact-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={field} />
      </div>
      <div className="mt-4">
        <label htmlFor="contact-message" className="block text-sm font-medium text-ink">
          Message
        </label>
        <textarea id="contact-message" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} className={field} />
      </div>
      <button type="submit" className="mt-4 rounded-lg bg-accent px-5 py-2.5 font-semibold text-white hover:bg-accent-hover">
        Open in my email app
      </button>
      <p className="mt-3 text-sm text-muted" aria-live="polite">
        {opened
          ? "Your email app should now be open with this message. It has not been sent yet: review it and press Send there. If nothing opened, copy the address above into your email instead."
          : "This does not send anything by itself. It opens a pre-filled draft in your own email app for you to review and send."}
      </p>
    </form>
  );
}
