import { buildSearchIndex } from "@/lib/search";
import { AuthorProfile } from "./AuthorProfile";
import { Logo } from "./Logo";
import { DesktopNav, MobileNav } from "./NavMenu";
import { SearchDialog } from "./SearchDialog";
import { ThemeToggle } from "./ThemeToggle";

/** Sticky navy header, the same on every page and in both themes. */
export function Header() {
  return (
    <header className="on-light sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
      <div className="relative mx-auto flex h-[72px] max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <Logo />
        <div className="ml-auto flex items-center gap-2">
          <DesktopNav />
          <AuthorProfile />
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
