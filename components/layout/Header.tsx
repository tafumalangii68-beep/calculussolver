import { buildSearchIndex } from "@/lib/search";
import { Logo } from "./Logo";
import { DesktopNav, MobileNav } from "./NavMenu";
import { SearchDialog } from "./SearchDialog";
import { ThemeToggle } from "./ThemeToggle";

/** Sticky navy header, the same on every page and in both themes. */
export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-navy-900 shadow-[0_1px_0_rgb(255_255_255/0.04),0_8px_24px_rgb(11_14_42/0.18)]">
      <div className="relative mx-auto flex h-[72px] max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <Logo />
        <div className="ml-auto flex items-center gap-2">
          <DesktopNav />
          <div className="flex items-center gap-1.5 sm:gap-2 lg:ml-3">
            <SearchDialog items={buildSearchIndex()} />
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
