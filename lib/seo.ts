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
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
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
