"use client";

import { useEffect } from "react";

const FOCUSABLE = "a[href], button, input, select, textarea, [tabindex]";

/**
 * Wide formulas (.math-scroll) and tables (.overflow-x-auto) scroll sideways on small screens.
 * Boxes that actually overflow and contain nothing focusable get tabindex="0", so keyboard
 * users can focus and scroll them; all other boxes stay out of the tab order. Each one gets a
 * numbered label so screen readers can tell the regions apart.
 */
export function ScrollableRegions() {
  useEffect(() => {
    const update = () => {
      let n = 0;
      document.querySelectorAll<HTMLElement>(".math-scroll, .overflow-x-auto").forEach((el) => {
        const managed = el.dataset.scrollRegion === "true";
        const needsFocus = el.scrollWidth > el.clientWidth && (managed || !el.querySelector(FOCUSABLE));
        if (needsFocus) {
          n += 1;
          if (!managed) {
            el.dataset.scrollRegion = "true";
            el.tabIndex = 0;
            if (!el.hasAttribute("role")) el.setAttribute("role", "region");
            if (!el.hasAttribute("aria-label")) el.dataset.scrollLabel = "true";
          }
          if (el.dataset.scrollLabel === "true") el.setAttribute("aria-label", `Scrolls sideways (${n})`);
        } else if (managed) {
          delete el.dataset.scrollRegion;
          el.removeAttribute("tabindex");
          if (el.dataset.scrollLabel === "true") {
            delete el.dataset.scrollLabel;
            el.removeAttribute("aria-label");
            el.removeAttribute("role");
          }
        }
      });
    };
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    // Web fonts and lazily loaded math can widen formulas after the first check.
    void document.fonts?.ready.then(schedule);
    // Solver results and client-side navigation add new formulas and tables.
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
