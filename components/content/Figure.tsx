import Image from "next/image";
import type { Illustration } from "@/types/content";

/** A decorative-but-meaningful illustration. Lazy-loaded; never placed above the solver. */
export function Figure({ image, className, sizes = "(min-width: 768px) 720px, 100vw" }: { image: Illustration; className?: string; sizes?: string }) {
  return (
    <figure className={`overflow-hidden rounded-card border border-line bg-[#faf8f5] ${className ?? ""}`}>
      <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} className="h-auto w-full" />
    </figure>
  );
}
