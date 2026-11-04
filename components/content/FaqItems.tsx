import { Plus } from "lucide-react";
import type { Faq } from "@/types/content";

/** The accordion itself, without heading or structured data. */
export function FaqItems({ faqs, open = false }: { faqs: Faq[]; open?: boolean }) {
  return (
    <div className="space-y-3">
      {faqs.map((f) => (
        <details
          key={f.q}
          open={open}
          className="group rounded-2xl border border-line bg-surface px-5 py-4 shadow-card transition-colors open:border-accent/40 hover:border-accent/30 sm:px-6 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-ink">
            <h3 className="font-display text-base font-bold sm:text-[17px]">{f.q}</h3>
            <span
              aria-hidden
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-strong transition-all duration-300 group-open:rotate-45 group-open:bg-brand-gradient group-open:text-white"
            >
              <Plus className="h-4 w-4" />
            </span>
          </summary>
          <p className="mt-3 max-w-[72ch] leading-relaxed text-ink-soft">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
