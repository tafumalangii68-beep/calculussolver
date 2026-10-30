import Link from "next/link";
import type { Guide } from "@/data/guides";
import { articleLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { FaqSection } from "./FaqSection";
import { Figure } from "./Figure";
import { JsonLd } from "./JsonLd";
import { PageIntro } from "./PageIntro";
import { formatDate } from "./ProsePage";
import { Tex } from "./Tex";
import { WorkedExample } from "./WorkedExample";

export function GuideView({ guide }: { guide: Guide }) {
  const path = `/guides/${guide.slug}`;
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
      <JsonLd data={articleLd(guide.title, path, guide.description)} />
      <PageIntro
        crumbs={[
          { name: "Guides", path: "/guides" },
          { name: guide.title.split(":")[0], path },
        ]}
        title={guide.title}
      >
        <p>{guide.intro}</p>
        <p className="mt-3 text-sm text-muted">
          Last reviewed: <time dateTime={siteConfig.contentUpdated}>{formatDate(siteConfig.contentUpdated)}</time>
        </p>
      </PageIntro>

      <Figure image={guide.image} className="mt-8 max-w-3xl" />

      <nav aria-label="On this page" className="mt-8 max-w-3xl rounded-card border border-line bg-surface p-5">
        <p className="text-sm font-semibold text-ink">On this page</p>
        <ol className="mt-2 grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
          {guide.sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-accent-strong hover:underline underline-offset-2">
                {s.heading}
              </a>
            </li>
          ))}
          <li>
            <a href="#examples" className="text-accent-strong hover:underline underline-offset-2">
              Worked examples
            </a>
          </li>
        </ol>
      </nav>

      <article className="prose-body mt-6">
        {guide.sections.map((section) => (
          <section key={section.id} aria-labelledby={section.id}>
            <h2 id={section.id}>{section.heading}</h2>
            {section.blocks.map((block, i) => {
              switch (block.type) {
                case "p":
                  return <p key={i}>{block.text}</p>;
                case "math":
                  return <Tex key={i} display>{block.latex}</Tex>;
                case "list":
                  return (
                    <ul key={i}>
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  );
                case "table":
                  return (
                    <div key={i} className="overflow-x-auto rounded-card border border-line bg-surface">
                      <table className="w-full min-w-[20rem] text-sm">
                        <caption className="sr-only">{block.caption}</caption>
                        <thead>
                          <tr className="border-b border-line text-left">
                            {block.headers.map((h) => (
                              <th key={h} scope="col" className="px-4 py-2.5 font-semibold text-ink">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {block.rows.map((row, r) => (
                            <tr key={r} className="border-b border-line last:border-0">
                              {row.map((cell, c) => (
                                <td key={c} className="px-4 py-2">
                                  <Tex>{cell}</Tex>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
              }
            })}
          </section>
        ))}
      </article>

      <section aria-labelledby="examples" className="mt-16">
        <h2 id="examples" className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
          Worked examples
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {guide.examples.map((e, i) => (
            <WorkedExample key={e.title} example={e} index={i} />
          ))}
        </div>
      </section>

      <FaqSection faqs={guide.faqs} title="Questions about this topic" />

      <section className="mt-16 rounded-card bg-ink px-6 py-8 text-paper sm:px-10">
        <h2 className="font-serif text-2xl font-semibold">Practise what you learned</h2>
        <p className="mt-2 max-w-2xl text-paper/80">
          Try the worked examples above in the calculator and compare each step with your own. You can also use the main{" "}
          <Link href="/" className="underline underline-offset-2">Calculus Solver</Link> for every operation in one place.
        </p>
        <Link href={guide.calculator.href} className="mt-4 inline-block rounded-lg bg-paper px-5 py-2.5 font-semibold text-ink hover:bg-sunken">
          {guide.calculator.label}
        </Link>
      </section>
    </div>
  );
}
