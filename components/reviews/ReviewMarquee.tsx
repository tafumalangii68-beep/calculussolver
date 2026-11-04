"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PublicReview } from "@/lib/reviews/validate";
import { TestimonialCard } from "./TestimonialCard";

/** Seconds each card takes to pass, so the speed stays the same whatever the number of reviews. */
const SECONDS_PER_CARD = 7;

/**
 * Continuous right-to-left testimonial carousel, built with a CSS keyframe animation.
 * The list is rendered twice and the track moves by exactly one copy (-50%), so the loop
 * is seamless. Pauses on hover, keyboard focus, touch, or the Pause button; reduced-motion
 * users get a static, swipeable row instead (see .marquee in globals.css).
 */
export function ReviewMarquee({ reviews }: { reviews: PublicReview[] }) {
  const [paused, setPaused] = useState(false);
  const [touching, setTouching] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const touchStart = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setTouching(true);
  };
  const touchEnd = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setTouching(false), 3000);
  };

  const group = (copy: number) => (
    <ul className="flex shrink-0 gap-6 pr-6" aria-hidden={copy === 1 ? true : undefined}>
      {reviews.map((r) => (
        <li key={`${copy}-${r.id}`} className="flex w-[82vw] max-w-[25rem] shrink-0 sm:w-[23rem] lg:w-[24.5rem]">
          <TestimonialCard review={r} />
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <div
        role="region"
        aria-label="Student testimonials"
        className="marquee -mx-4 sm:-mx-8"
        data-paused={paused || touching ? "true" : undefined}
        onTouchStart={touchStart}
        onTouchEnd={touchEnd}
        onTouchCancel={touchEnd}
      >
        <div className="marquee-track flex py-6" style={{ "--marquee-duration": `${reviews.length * SECONDS_PER_CARD}s` } as React.CSSProperties}>
          {group(0)}
          {group(1)}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 sm:gap-4">
        <span aria-hidden className="hidden h-px w-24 bg-line-strong sm:block" />
        <p className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent-soft px-4 py-1.5 text-sm font-medium text-accent-strong">
          <span aria-hidden className="text-base leading-none">
            ∞
          </span>
          <span className="motion-reduce:hidden">Continuously moving reviews</span>
          <span className="hidden motion-reduce:inline">Swipe or scroll to see more reviews</span>
        </p>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-ink-soft hover:bg-sunken motion-reduce:hidden"
        >
          {paused ? <Play aria-hidden className="h-3.5 w-3.5" /> : <Pause aria-hidden className="h-3.5 w-3.5" />}
          {paused ? "Play" : "Pause"}
        </button>
        <span aria-hidden className="hidden h-px w-24 bg-line-strong sm:block" />
      </div>
    </div>
  );
}
