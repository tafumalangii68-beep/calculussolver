import { ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import { FaqBrowser } from "@/components/content/FaqBrowser";
import { JsonLd } from "@/components/content/JsonLd";
import { LinkCards } from "@/components/content/LinkCards";
import { PageHero } from "@/components/content/PageHero";
import { SectionHeader } from "@/components/content/SectionHeader";
import { faqGroups } from "@/data/faq";
import { buildMetadata, faqLd } from "@/lib/seo";
import { calculatorNav } from "@/lib/site-config";

const description = "Answers to common questions about Calculus Solver: typing expressions, how answers are checked, privacy, offline use and studying with the solver.";

export const metadata = buildMetadata({ title: "Frequently Asked Questions", description, path: "/faq" });

const RELATED = ["derivative-calculator", "integral-calculator", "limit-calculator"] as const;

export default function FaqPage() {
  const related = calculatorNav.filter((c) => (RELATED as readonly string[]).includes(c.slug));
  return (
    <>
      <PageHero crumbs={[{ name: "FAQ", path: "/faq" }]} eyebrow="Help centre" icon={<HelpCircle />} title="Frequently Asked Questions">
        <p>
          Quick answers about using the solver. For details of the math, see <Link href="/how-it-works">how the solver works</Link>.
        </p>
      </PageHero>

      <div className="relative z-10 mx-auto -mt-12 max-w-4xl px-4 sm:px-6">
        <FaqBrowser groups={faqGroups} />
      </div>

      <section aria-labelledby="faq-related" className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <SectionHeader id="faq-related" eyebrow="Try it" title="Popular" highlight="calculators">
          <p>
            Put the answers into practice. All <Link href="/" className="font-semibold text-accent-strong underline underline-offset-2">nine calculators</Link> show
            their steps. To learn the rules themselves, read the{" "}
            <Link href="/guides/derivative-rules" className="font-semibold text-accent-strong underline underline-offset-2">
              derivative rules
            </Link>{" "}
            and{" "}
            <Link href="/guides/integration-techniques" className="font-semibold text-accent-strong underline underline-offset-2">
              integration techniques
            </Link>{" "}
            guides.
          </p>
        </SectionHeader>
        <div className="mt-10">
          <LinkCards cards={related.map((c) => ({ href: `/${c.slug}`, title: c.label, description: c.blurb, titleClass: c.titleClass }))} />
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <section aria-labelledby="still" className="mt-16 flex flex-col items-start gap-4 rounded-3xl bg-navy-gradient p-8 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="still" className="font-display text-xl font-extrabold">
              Still have a question?
            </h2>
            <p className="mt-1 text-white/80">Read the full methodology, or get in touch.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/how-it-works" className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-5 py-3 font-semibold text-white shadow-glow hover:bg-brand-gradient-hover">
              How it works <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 font-semibold text-white hover:bg-white/10">
              Contact
            </Link>
          </div>
        </section>
      </div>
      <JsonLd data={faqLd(faqGroups.flatMap((g) => g.faqs))} />
    </>
  );
}
