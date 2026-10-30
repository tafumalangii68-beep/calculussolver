import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { NavMenu } from "./NavMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl font-semibold tracking-tight text-ink" aria-label={`${siteConfig.name} home`}>
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-ink font-serif text-lg italic text-paper">
            ∫
          </span>
          {siteConfig.name}
        </Link>
        <NavMenu />
      </div>
    </header>
  );
}
