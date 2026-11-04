import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

/** Brand mark: violet gradient tile with an integral sign, then "CalculusSolver.pro". For navy backgrounds. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label={`${siteConfig.name} home`} className={`group flex shrink-0 items-center gap-2 sm:gap-2.5 ${className}`}>
      <span
        aria-hidden
        className="grid h-8 w-8 place-items-center rounded-xl sm:h-9 sm:w-9 bg-brand-gradient font-display text-xl font-bold italic text-white shadow-glow transition-transform group-hover:scale-105"
      >
        ∫
      </span>
      <span aria-hidden className="font-display text-[17px] font-extrabold tracking-tight text-white sm:text-xl">
        CalculusSolver<span className="text-[#b48cff] max-[359px]:hidden">.pro</span>
      </span>
    </Link>
  );
}
