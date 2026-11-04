import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "./site-config";

interface PageMeta {
  title: string;
  description: string;
  path: string;
  /** Use the title as-is instead of applying the "| Calculus Solver" template. */
  absoluteTitle?: boolean;
  type?: "website" | "article";
  noIndex?: boolean;
}

/**
 * The site-wide share image (app/opengraph-image.png). A page that sets its own `openGraph`
 * replaces the inherited one, so every page lists the image explicitly.
 */
const SHARE_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Calculus Solver: step-by-step derivatives, integrals and limits, shown beside a curve with a tangent line and the shaded area under it",
};

export function buildMetadata({ title, description, path, absoluteTitle, type = "website", noIndex }: PageMeta): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [SHARE_IMAGE],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [SHARE_IMAGE] },
  };
}

// ---------- structured data ----------

export type JsonLdObject = Record<string, unknown>;

export function breadcrumbLd(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqLd(faqs: { q: string; a: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function webApplicationLd(name: string, path: string, description: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url: absoluteUrl(path),
    description,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any (runs in a web browser)",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    inLanguage: siteConfig.language,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

export function webPageLd(name: string, path: string, description: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    url: absoluteUrl(path),
    description,
    inLanguage: siteConfig.language,
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
  };
}

export function articleLd(headline: string, path: string, description: string, published: string = siteConfig.contentUpdated): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    datePublished: published,
    dateModified: published > siteConfig.contentUpdated ? published : siteConfig.contentUpdated,
    inLanguage: siteConfig.language,
    author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  };
}

/**
 * Review markup for the reviews page. Built only from approved reviews that are visible on
 * the page, so the rating and count always match what visitors can read.
 */
export function reviewsLd(
  summary: { count: number; average: number },
  reviews: { name: string; rating: number; message: string; createdAt: string }[],
): JsonLdObject {
  return {
    ...webApplicationLd(siteConfig.name, "/", siteConfig.description),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(summary.average.toFixed(1)),
      reviewCount: summary.count,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      datePublished: r.createdAt.slice(0, 10),
      reviewBody: r.message,
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
    })),
  };
}

export function websiteLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
  };
}
