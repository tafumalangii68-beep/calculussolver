import type { JsonLdObject } from "@/lib/seo";

/**
 * Serialises structured data for a <script type="application/ld+json"> tag. Every "<" becomes the
 * JSON escape <, so text such as a review containing "</script>" can never close the tag.
 * JSON parsers read < back as "<", so the data itself is unchanged.
 */
export function serializeJsonLd(data: JsonLdObject | JsonLdObject[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
