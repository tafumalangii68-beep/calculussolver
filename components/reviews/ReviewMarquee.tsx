"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** Seconds each card takes to pass, so the speed stays the same whatever the number of reviews. */
const SECONDS_PER_CARD = 7;

/**
 * Continuous right-to-left testimonial carousel, built with a CSS keyframe animation.
 * The list is rendered twice and the track moves by exactly one copy (-50%), so the loop
 * is seamless. Pauses on hover, keyboard focus, touch, or the Pause button; reduced-motion
 * users get a static, swipeable row instead (see .marquee in globals.css).
 */
export function ReviewMarquee({ items, label }: { items: { key: string; content: React.ReactNode }[]; label: string }) {
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
      {items.map((item) => (
        <li key={`${copy}-${item.key}`} className="flex w-[78vw] max-w-[420px] shrink-0 sm:w-[350px] lg:w-[380px] 2xl:w-[420px]">
          {item.content}
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <div
        role="region"
        aria-label={label}
        className="marquee"
        data-paused={paused || touching ? "true" : undefined}
        onTouchStart={touchStart}
        onTouchEnd={touchEnd}
        onTouchCancel={touchEnd}
      >
        <div className="marquee-track flex py-6" style={{ "--marquee-duration": `${items.length * SECONDS_PER_CARD}s` } as React.CSSProperties}>
          {group(0)}
          {group(1)}
        </div>
      </div>

      <div className="mx-auto mt-9 flex max-w-[950px] flex-wrap items-center justify-center gap-2.5 px-4 sm:mt-12 sm:flex-nowrap sm:gap-6">
        <span aria-hidden className="hidden h-px flex-1 bg-line-strong sm:block" />
        <p className="inline-flex items-center gap-3 rounded-full bg-accent-soft px-4 py-3 text-xs sm:whitespace-nowrap font-semibold text-accent-strong sm:px-7 sm:py-3.5 sm:text-base">
          <span aria-hidden className="text-2xl leading-none sm:text-[32px]">
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
        <span aria-hidden className="hidden h-px flex-1 bg-line-strong sm:block" />
      </div>
    </div>
  );
}
