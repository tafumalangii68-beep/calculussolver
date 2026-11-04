import { Plus } from "lucide-react";
import { faqLd } from "@/lib/seo";
import type { Faq } from "@/types/content";
import { JsonLd } from "./JsonLd";

/** Visible FAQ accordion. FAQPage structured data is emitted only for these visible questions. */
export function FaqSection({ faqs, title = "Frequently asked questions", id = "faq" }: { faqs: Faq[]; title?: string; id?: string }) {
  return (
    <section aria-labelledby={`${id}-title`} className="mt-24">
      <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-accent-strong">
        <span aria-hidden>✦</span> FAQ
      </p>
      <h2 id={`${id}-title`} className="mt-4 font-display text-[clamp(1.6rem,3vw,2.3rem)] font-extrabold tracking-tight text-ink">
        {title}
      </h2>
      <div className="mt-8">
        <FaqItems faqs={faqs} />
      </div>
      <JsonLd data={faqLd(faqs)} />
    </section>
  );
}

/** The accordion itself, without heading or structured data. */
export function FaqItems({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((f) => (
        <details
          key={f.q}
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
