import { ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import { FaqItems } from "@/components/content/FaqSection";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHero } from "@/components/content/PageHero";
import { faqGroups } from "@/data/faq";
import { buildMetadata, faqLd } from "@/lib/seo";

const description = "Answers to common questions about Calculus Solver: typing expressions, how answers are checked, privacy, offline use and studying with the solver.";

export const metadata = buildMetadata({ title: "Frequently Asked Questions", description, path: "/faq" });

const groupId = (title: string) => `faq-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}`;

export default function FaqPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "FAQ", path: "/faq" }]} eyebrow="Help centre" icon={<HelpCircle />} title="Frequently Asked Questions">
        <p>
          Quick answers about using the solver. For details of the math, see <Link href="/how-it-works">how the solver works</Link>.
        </p>
      </PageHero>

      <div className="relative z-10 mx-auto -mt-12 max-w-4xl px-4 sm:px-6">
        <nav aria-label="FAQ topics" className="rounded-2xl border border-line bg-surface p-4 shadow-card">
          <ul className="flex flex-wrap gap-2">
            {faqGroups.map((g) => (
              <li key={g.title}>
                <a
                  href={`#${groupId(g.title)}`}
                  className="inline-flex items-center rounded-full bg-accent-soft px-4 py-2 text-sm font-semibold text-accent-strong transition-colors hover:bg-brand-gradient hover:text-white"
                >
                  {g.title}
                  <span className="ml-2 rounded-full bg-surface/70 px-1.5 text-xs text-accent-strong">{g.faqs.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {faqGroups.map((group) => (
          <section key={group.title} aria-labelledby={groupId(group.title)} className="mt-14">
            <h2 id={groupId(group.title)} className="scroll-mt-24 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {group.title}
            </h2>
            <div className="mt-5">
              <FaqItems faqs={group.faqs} />
            </div>
          </section>
        ))}

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
