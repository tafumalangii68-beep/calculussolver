"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { currentTheme, setTheme, subscribeTheme } from "@/lib/theme";

export function ThemeToggle() {
  // null on the server: the icons below switch with CSS, so the markup never mismatches.
  const theme = useSyncExternalStore(subscribeTheme, currentTheme, () => null);
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(currentTheme() === "dark" ? "light" : "dark")}
      aria-label="Dark mode"
      aria-pressed={theme === null ? undefined : dark}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line text-ink hover:bg-sunken"
    >
      <Moon aria-hidden className="h-5 w-5 dark:hidden" />
      <Sun aria-hidden className="hidden h-5 w-5 dark:block" />
    </button>
  );
}
