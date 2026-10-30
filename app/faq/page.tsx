import Link from "next/link";
import { JsonLd } from "@/components/content/JsonLd";
import { PageIntro } from "@/components/content/PageIntro";
import { faqGroups } from "@/data/faq";
import { buildMetadata, faqLd } from "@/lib/seo";

const description = "Answers to common questions about Calculus Solver: typing expressions, how answers are checked, privacy, offline use and studying with the solver.";

export const metadata = buildMetadata({ title: "Frequently Asked Questions", description, path: "/faq" });

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
      <PageIntro crumbs={[{ name: "FAQ", path: "/faq" }]} title="Frequently Asked Questions">
        <p>
          Quick answers about using the solver. For details of the math, see <Link href="/how-it-works" className="text-accent-strong underline underline-offset-2">how the solver works</Link>.
        </p>
      </PageIntro>
      {faqGroups.map((group) => (
        <section key={group.title} aria-label={group.title} className="mt-12">
          <h2 className="font-serif text-2xl font-semibold text-ink">{group.title}</h2>
          <div className="mt-4 divide-y divide-line rounded-card border border-line bg-surface">
            {group.faqs.map((f) => (
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
        </section>
      ))}
      <JsonLd data={faqLd(faqGroups.flatMap((g) => g.faqs))} />
    </div>
  );
}
