"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { clearConsent, consentSnapshot, parseConsent, saveConsent, subscribeConsent, type ConsentRecord } from "@/lib/consent";
import { siteConfig } from "@/lib/site-config";

interface ConsentContextValue {
  /** null until the visitor has made a valid choice (or before hydration). */
  consent: ConsentRecord | null;
  openSettings: () => void;
}

const ConsentContext = createContext<ConsentContextValue>({ consent: null, openSettings: () => {} });

export function useConsent(): ConsentContextValue {
  return useContext(ConsentContext);
}

const SERVER_SNAPSHOT = "server";

export function CookieConsent({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribeConsent, consentSnapshot, () => SERVER_SNAPSHOT);
  const hydrated = raw !== SERVER_SNAPSHOT;
  const consent = hydrated ? parseConsent(raw) : null;
  const [settingsOpen, setSettingsOpen] = useState(false);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const value = useMemo(() => ({ consent, openSettings }), [consent, openSettings]);

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {hydrated && !consent && !settingsOpen && <Banner onSettings={openSettings} />}
      {settingsOpen && <SettingsDialog current={consent} onClose={() => setSettingsOpen(false)} />}
    </ConsentContext.Provider>
  );
}

function Banner({ onSettings }: { onSettings: () => void }) {
  return (
    <section
      aria-label="Cookie and storage notice"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 py-4 shadow-[0_-4px_20px_rgb(31_30_28/0.06)] backdrop-blur sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-3xl text-sm text-ink-soft">
          This site uses only <strong className="font-semibold text-ink">necessary browser storage</strong> to remember this
          choice. There are no analytics or advertising cookies, and your math problems never leave your device.{" "}
          <Link href="/privacy-policy" className="text-accent-strong underline underline-offset-2">
            Privacy Policy
          </Link>
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onSettings} className="rounded-lg border border-line-strong px-4 py-2 text-sm font-medium text-ink hover:bg-sunken">
            Cookie Settings
          </button>
          <button
            type="button"
            onClick={() => saveConsent({ analytics: false, marketing: false })}
            className="rounded-lg border border-line-strong px-4 py-2 text-sm font-medium text-ink hover:bg-sunken"
          >
            Reject Optional
          </button>
          <button
            type="button"
            onClick={() => saveConsent({ analytics: true, marketing: true })}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-strong"
          >
            Accept All
          </button>
        </div>
      </div>
    </section>
  );
}

const CATEGORIES = [
  {
    id: "analytics",
    title: "Analytics",
    service: siteConfig.services.analytics,
    description: "Would help the site owner understand which pages are used, through aggregated statistics.",
  },
  {
    id: "marketing",
    title: "Marketing",
    service: siteConfig.services.marketing,
    description: "Would allow advertising or marketing measurement services.",
  },
] as const;

function SettingsDialog({ current, onClose }: { current: ConsentRecord | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [choice, setChoice] = useState({ analytics: current?.analytics ?? false, marketing: current?.marketing ?? false });

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => dialog?.close();
  }, []);

  const save = (next: typeof choice) => {
    saveConsent(next);
    onClose();
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="cookie-settings-title"
      className="m-auto w-[min(36rem,calc(100vw-2rem))] rounded-card border border-line bg-surface p-0 text-ink shadow-card backdrop:bg-ink/40"
    >
      <div className="max-h-[85vh] overflow-y-auto p-6">
        <h2 id="cookie-settings-title" className="font-serif text-2xl font-semibold">
          Cookie settings
        </h2>
        <p className="mt-2 text-sm text-muted">
          Choose which optional categories you allow. You can change or withdraw your choice at any time from the
          &ldquo;Cookie Settings&rdquo; link in the footer.
        </p>

        <ul className="mt-5 space-y-3">
          <li className="rounded-lg border border-line bg-sunken/60 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold">Necessary storage</h3>
                <p className="mt-1 text-sm text-muted">
                  Remembers this cookie choice in your browser&apos;s local storage. Required for the site to respect your
                  preference, so it cannot be switched off.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent-strong">Always on</span>
            </div>
          </li>
          {CATEGORIES.map((cat) => {
            const id = `consent-${cat.id}`;
            return (
              <li key={cat.id} className="rounded-lg border border-line p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <label htmlFor={id} className="font-semibold">
                      {cat.title} <span className="text-sm font-normal text-muted">(optional)</span>
                    </label>
                    <p className="mt-1 text-sm text-muted" id={`${id}-desc`}>
                      {cat.description}{" "}
                      {cat.service
                        ? `Service used: ${cat.service.name}.`
                        : "No such service is currently installed on this site, so nothing is loaded either way. Your choice is saved and will be respected if this changes."}
                    </p>
                  </div>
                  <input
                    id={id}
                    type="checkbox"
                    role="switch"
                    aria-describedby={`${id}-desc`}
                    checked={choice[cat.id]}
                    onChange={(e) => setChoice((c) => ({ ...c, [cat.id]: e.target.checked }))}
                    className="mt-1 h-5 w-5 shrink-0 accent-accent"
                  />
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          {current && (
            <button
              type="button"
              onClick={() => {
                clearConsent();
                onClose();
              }}
              className="mr-auto rounded-lg px-3 py-2 text-sm font-medium text-muted underline underline-offset-2 hover:text-ink"
            >
              Withdraw consent
            </button>
          )}
          <button type="button" onClick={() => save({ analytics: false, marketing: false })} className="rounded-lg border border-line-strong px-4 py-2 text-sm font-medium hover:bg-sunken">
            Reject Optional
          </button>
          <button type="button" onClick={() => save(choice)} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-strong">
            Save preferences
          </button>
        </div>
      </div>
    </dialog>
  );
}

export function CookieSettingsButton({ className }: { className?: string }) {
  const { openSettings } = useConsent();
  return (
    <button type="button" onClick={openSettings} className={className}>
      Cookie Settings
    </button>
  );
}
