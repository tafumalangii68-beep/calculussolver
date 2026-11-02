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

export function setTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage blocked: the theme still applies until the page is reloaded.
  }
}

/** Notifies when data-theme on <html> changes. */
export function subscribeTheme(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
