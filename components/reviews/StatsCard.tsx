import { CheckCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { getSolveCount } from "@/lib/stats";

/** Real count of problems solved. Hidden until it reaches the threshold set in site-config. */
export async function StatsCard() {
  const count = await getSolveCount();
  if (count < siteConfig.stats.showSolveCountFrom) return null;
  return (
    <section aria-labelledby="stats-heading" className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[auto_1fr] md:gap-10">
        <div className="flex items-center gap-5">
          <span aria-hidden className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-accent text-white shadow-card sm:h-20 sm:w-20">
            <CheckCheck className="h-8 w-8 sm:h-10 sm:w-10" />
          </span>
          <div>
            <h2 id="stats-heading" className="text-sm font-semibold uppercase tracking-wider text-muted">
              Problems solved
            </h2>
            <p className="flex items-center gap-2 font-display text-4xl font-semibold text-accent-strong sm:text-5xl">
              {count.toLocaleString("en-US")}
              <TrendingUp aria-hidden className="h-6 w-6 text-ok" />
            </p>
          </div>
        </div>
        <p className="text-ink-soft md:border-l md:border-line md:pl-10">
          That is how many problems students have solved with {siteConfig.name} so far. Each one is counted anonymously when someone
          presses Solve; what they typed never leaves their device.{" "}
          <Link href="/derivative-calculator" className="font-medium text-accent-strong underline underline-offset-2">
            Try the derivative calculator
          </Link>
        </p>
      </div>
    </section>
  );
}
