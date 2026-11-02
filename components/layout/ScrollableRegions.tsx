"use client";

import { useEffect } from "react";

const LABEL = "Scrolls sideways";
const FOCUSABLE = "a[href], button, input, select, textarea, [tabindex]";

/**
 * Wide formulas (.math-scroll) and tables (.overflow-x-auto) scroll sideways on small screens.
 * Boxes that actually overflow and contain nothing focusable get tabindex="0", so keyboard
 * users can focus and scroll them; all other boxes stay out of the tab order.
 */
export function ScrollableRegions() {
  useEffect(() => {
    const update = () => {
      document.querySelectorAll<HTMLElement>(".math-scroll, .overflow-x-auto").forEach((el) => {
        const managed = el.dataset.scrollRegion === "true";
        const needsFocus = el.scrollWidth > el.clientWidth + 1 && (managed || !el.querySelector(FOCUSABLE));
        if (needsFocus && !managed) {
          el.dataset.scrollRegion = "true";
          el.tabIndex = 0;
          if (!el.hasAttribute("role")) el.setAttribute("role", "region");
          if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", LABEL);
        } else if (!needsFocus && managed) {
          delete el.dataset.scrollRegion;
          el.removeAttribute("tabindex");
          if (el.getAttribute("aria-label") === LABEL) {
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
    // Solver results and client-side navigation add new formulas and tables.
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
