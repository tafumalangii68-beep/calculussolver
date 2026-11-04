import type { Guide } from "@/data/guides";

const WORDS_PER_MINUTE = 200;
/** Reading a displayed formula takes about as long as a short sentence. */
const WORDS_PER_FORMULA = 12;

const words = (text: string) => text.split(/\s+/).filter(Boolean).length;

/** Estimated reading time in minutes: the prose, plus a fixed allowance for each formula and table cell. */
export function readingMinutes(guide: Guide): number {
  let count = words(guide.intro);
  for (const section of guide.sections) {
    count += words(section.heading);
    for (const block of section.blocks) {
      if (block.type === "p") count += words(block.text);
      else if (block.type === "math") count += WORDS_PER_FORMULA;
      else if (block.type === "list") count += block.items.reduce((n, item) => n + words(item), 0);
      else if (block.type === "table") count += block.headers.length + block.rows.length * block.headers.length * 3;
    }
  }
  for (const example of guide.examples) {
    count += words(example.title) + WORDS_PER_FORMULA * 2;
    for (const step of example.steps) count += words(step.text) + (step.math ? WORDS_PER_FORMULA : 0);
  }
  for (const faq of guide.faqs) count += words(faq.q) + words(faq.a);
  return Math.max(1, Math.round(count / WORDS_PER_MINUTE));
}
