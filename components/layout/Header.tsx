import { buildSearchIndex } from "@/lib/search";
import { AuthorProfile } from "./AuthorProfile";
import { Logo } from "./Logo";
import { DesktopNav, MobileNav } from "./NavMenu";
import { SearchDialog } from "./SearchDialog";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Sticky header, the same on every page: a soft lavender band holding a rounded, white navbar.
 * The band adds 0.5–0.75rem around the bar, so the whole header is 80px tall on phones and 96px on desktop
 * (pages offset their sticky sidebars by top-24 to sit just below it).
 */
export function Header() {
  return (
    <header className="on-light sticky top-0 z-30 bg-[linear-gradient(90deg,#f8f5ff_0%,#eee5ff_100%)] px-1.5 py-2 sm:px-4 lg:py-3 dark:bg-none dark:bg-paper">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-2 max-[389px]:gap-1 rounded-[28px] border border-[#e5ddf5] bg-surface/90 px-3 shadow-[0_8px_24px_-16px_rgb(76_29_149/0.3)] max-[389px]:px-2.5 sm:gap-3 sm:px-5 lg:h-[72px] lg:rounded-[32px] xl:px-7 dark:border-line">
        <Logo />
        <div className="ml-auto flex items-center gap-1.5 max-[389px]:gap-1 sm:gap-2">
          <DesktopNav />
          <AuthorProfile />
          <div className="flex items-center gap-1.5 max-[389px]:gap-1 sm:gap-2 xl:ml-2">
            <SearchDialog items={buildSearchIndex()} />
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
