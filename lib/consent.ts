// Cookie / storage consent, kept in localStorage under a single key.
// "Necessary" storage is this record itself; optional categories default to off.

export const CONSENT_KEY = "cs-consent";
export const CONSENT_VERSION = 1;
const CHANGE_EVENT = "cs-consent-change";

export type OptionalCategory = "analytics" | "marketing";

export interface ConsentRecord {
  version: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  /** ISO timestamp of the visitor's choice. */
  updatedAt: string;
}

export function parseConsent(raw: string | null): ConsentRecord | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ConsentRecord>;
    if (value.version !== CONSENT_VERSION || typeof value.analytics !== "boolean" || typeof value.marketing !== "boolean") {
      return null;
    }
    return { version: CONSENT_VERSION, necessary: true, analytics: value.analytics, marketing: value.marketing, updatedAt: String(value.updatedAt ?? "") };
  } catch {
    return null;
  }
}

export function readConsentRaw(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export function saveConsent(choice: Pick<ConsentRecord, OptionalCategory>): void {
  const record: ConsentRecord = { version: CONSENT_VERSION, necessary: true, ...choice, updatedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    // Storage blocked (private mode or browser settings): the choice applies to this page view only.
    memoryFallback = JSON.stringify(record);
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function clearConsent(): void {
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // ignore
  }
  memoryFallback = null;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

let memoryFallback: string | null = null;

export function consentSnapshot(): string | null {
  return readConsentRaw() ?? memoryFallback;
}

export function subscribeConsent(callback: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === CONSENT_KEY) callback();
  };
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}
