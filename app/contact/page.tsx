import { ArrowRight, Bug, HelpCircle, Lock, Mail, Settings2 } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/components/content/ContactForm";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHero } from "@/components/content/PageHero";
import { buildMetadata, webPageLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const description = "Contact Calculus Solver to report a wrong answer, suggest a feature, or ask a question about the site.";

export const metadata = buildMetadata({ title: "Contact Us", description, path: "/contact" });

const sideCard = "rounded-3xl border border-line bg-surface p-6 shadow-card";
const sideTitle = "flex items-center gap-2.5 font-display text-lg font-bold text-ink";
const sideIcon = "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong [&>svg]:h-4 [&>svg]:w-4";

export default function ContactPage() {
  const email = siteConfig.contactEmail;
  return (
    <>
      <JsonLd data={webPageLd("Contact Us", "/contact", description)} />
      <PageHero crumbs={[{ name: "Contact Us", path: "/contact" }]} eyebrow="Get in touch" icon={<Mail />} title="Contact Us">
        <p>Report an incorrect result, suggest an improvement, or ask about the site.</p>
      </PageHero>

      <div className="relative z-10 mx-auto -mt-12 grid max-w-6xl items-start gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <ContactForm email={email} />

        <aside aria-label="Before you write" className="space-y-5">
          <section aria-labelledby="contact-email-title" className={sideCard}>
            <h2 id="contact-email-title" className={sideTitle}>
              <span aria-hidden className={sideIcon}>
                <Mail />
              </span>
              Email us directly
            </h2>
            {email ? (
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Write to us at{" "}
                <a href={`mailto:${email}`} className="break-all font-semibold text-accent-strong underline underline-offset-2">
                  {email}
                </a>
                . We read every message, though we cannot promise to reply to each one or to help with individual homework problems.
              </p>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">A contact email address has not been published yet. Please check back soon.</p>
            )}
          </section>

          <section aria-labelledby="contact-report-title" className={sideCard}>
            <h2 id="contact-report-title" className={sideTitle}>
              <span aria-hidden className={sideIcon}>
                <Bug />
              </span>
              Reporting a wrong answer
            </h2>
            <p className="mt-3 text-sm text-ink-soft">To help us reproduce the problem, please include:</p>
            <ul className="mt-2 space-y-2 text-sm text-ink-soft">
              {[
                "the exact expression you typed;",
                "the operation and options (derivative order, bounds, limit point and direction, and so on);",
                "the answer you expected, and why, if you know.",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="contact-privacy-title" className={sideCard}>
            <h2 id="contact-privacy-title" className={sideTitle}>
              <span aria-hidden className={sideIcon}>
                <Lock />
              </span>
              Your privacy
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              The solver runs in your browser and never sends us your problems, so we only see what you include in your message. See the{" "}
              <Link href="/privacy-policy" className="font-semibold text-accent-strong underline underline-offset-2">
                privacy policy
              </Link>
              .
            </p>
          </section>

          <nav aria-label="Quick answers" className="rounded-3xl bg-navy-gradient p-6 text-white">
            <p className="font-display text-lg font-bold">Looking for a quick answer?</p>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/faq", label: "Frequently asked questions", icon: <HelpCircle /> },
                { href: "/how-it-works", label: "How the solver works", icon: <Settings2 /> },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group flex items-center gap-3 rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold hover:bg-white/10">
                    <span aria-hidden className="text-[#c9a8ff] [&>svg]:h-4 [&>svg]:w-4">
                      {l.icon}
                    </span>
                    <span className="flex-1">{l.label}</span>
                    <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
}
