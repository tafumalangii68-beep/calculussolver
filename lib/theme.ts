// Light / dark theme. The resolved theme lives in <html data-theme="...">.
// A visitor's explicit choice is saved in localStorage; without one, the
// device's prefers-color-scheme setting is followed and nothing is stored.

export const THEME_KEY = "cs-theme";

export type Theme = "light" | "dark";

/**
 * Runs in <head> before first paint (see app/layout.tsx), so dark mode never
 * flashes white. Kept as a plain string because it executes before React loads.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","light")}})();`;

export function currentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

let transitionTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * Cross-fades colours for a moment while the theme changes. The class is only present
 * during a switch, so page loads and ordinary hovers are never slowed down.
 */
function withThemeTransition(apply: () => void): void {
  const root = document.documentElement;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
  root.classList.add("theme-transition");
  apply();
  clearTimeout(transitionTimer);
  transitionTimer = setTimeout(() => root.classList.remove("theme-transition"), 350);
}

export function setTheme(theme: Theme): void {
  withThemeTransition(() => document.documentElement.setAttribute("data-theme", theme));
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage blocked: the theme still applies until the page is reloaded.
  }
}

/** Applies a theme chosen in another tab of this site, so all open tabs stay in step. */
export function syncThemeAcrossTabs(): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key !== THEME_KEY) return;
    const next: Theme = e.newValue === "dark" || e.newValue === "light" ? e.newValue : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    if (next !== currentTheme()) withThemeTransition(() => document.documentElement.setAttribute("data-theme", next));
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

/** Notifies when data-theme on <html> changes. */
export function subscribeTheme(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
