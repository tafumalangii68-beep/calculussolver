import Image from "next/image";
import type { Illustration } from "@/types/content";

/**
 * A topic illustration shown inside the page content, with its caption. Uses next/image, so it is
 * lazy-loaded, served at the right size and reserves its space (no layout shift). The image keeps
 * its light paper background in both themes; dark mode dims it slightly (app/globals.css).
 */
export function ContentFigure({ image, className = "" }: { image: Illustration; className?: string }) {
  return (
    <figure className={`overflow-hidden rounded-2xl border border-line bg-[#f8f7f4] shadow-card ${className}`}>
      <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 1280px) 800px, (min-width: 768px) 70vw, 100vw" className="h-auto w-full" />
      {image.caption && <figcaption className="border-t border-line bg-surface px-4 py-3 text-sm leading-relaxed text-muted sm:px-5">{image.caption}</figcaption>}
    </figure>
  );
}
