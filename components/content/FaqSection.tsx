import { faqLd } from "@/lib/seo";
import type { Faq } from "@/types/content";
import { FaqItems } from "./FaqItems";
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
