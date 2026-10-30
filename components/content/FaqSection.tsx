import { faqLd } from "@/lib/seo";
import type { Faq } from "@/types/content";
import { JsonLd } from "./JsonLd";

/** Visible FAQ list. FAQPage structured data is emitted only for these visible questions. */
export function FaqSection({ faqs, title = "Frequently asked questions", id = "faq" }: { faqs: Faq[]; title?: string; id?: string }) {
  return (
    <section aria-labelledby={`${id}-title`} className="mt-16">
      <h2 id={`${id}-title`} className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
        {title}
      </h2>
      <div className="mt-6 divide-y divide-line rounded-card border border-line bg-surface">
        {faqs.map((f) => (
          <details key={f.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium text-ink">
              <h3 className="text-base">{f.q}</h3>
              <span aria-hidden className="mt-0.5 text-muted transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-[72ch] text-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqLd(faqs)} />
    </section>
  );
}
