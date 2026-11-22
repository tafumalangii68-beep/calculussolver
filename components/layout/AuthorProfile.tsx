"use client";

import { Calculator, Code, GraduationCap, Heart, Layers, Monitor, Target, UserRound, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef } from "react";

const PHOTO = "/images/henry.webp";

const ABOUT = [
  "Hi, I'm Henry, the founder and creator of Calculus Solver. I'm passionate about mathematics, technology, and building educational tools that make complex mathematical concepts easier to understand.",
  "Through Calculus Solver, my goal is to help students, teachers, and independent learners solve calculus problems with clear, step-by-step explanations. I focus on creating simple, reliable, and accessible tools that make learning mathematics easier and more effective.",
  "I believe every complex problem becomes easier when you understand it one step at a time.",
];

const EXPERTISE = [
  { icon: Code, label: "Website Development & Technology" },
  { icon: Calculator, label: "Online Calculator Development" },
  { icon: GraduationCap, label: "Educational Tools & Resources" },
  { icon: Monitor, label: "User Experience & Interface Design" },
];

function SectionHeading({ icon: Icon, id, children }: { icon: typeof Heart; id?: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight text-ink sm:text-xl">
      <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow">
        <Icon className="h-4 w-4" />
      </span>
      {children}
    </h3>
  );
}

/**
 * Henry's photo and name in the header. Clicking opens his profile in a native <dialog>
 * (focus trap, Escape and inert page handled by the browser), so nothing else on the page is affected.
 */
export function AuthorProfile() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const uid = useId();

  const open = () => {
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
  };
  const close = () => dialogRef.current?.close();

  // Close after navigating.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-label="About Henry, founder of Calculus Solver"
        className="group -mx-0.5 max-[374px]:-mx-1 flex shrink-0 items-center gap-2 rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-white sm:mx-0 sm:p-0.5 sm:pr-3 lg:pr-0.5 xl:ml-2 xl:pr-3"
      >
        <Image
          src={PHOTO}
          alt=""
          width={36}
          height={36}
          className="h-8 w-8 max-[374px]:h-6 max-[374px]:w-6 rounded-full object-cover ring-1 ring-line-strong transition-[box-shadow] group-hover:ring-accent sm:h-9 sm:w-9"
        />
        {/* Beside the full desktop nav there is only room for the photo between lg and xl. */}
        <span className="hidden text-sm font-semibold sm:inline lg:hidden xl:inline">Henry</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${uid}-name`}
        onClick={(e) => e.target === dialogRef.current && close()}
        className="author-dialog m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-4xl overflow-hidden rounded-3xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-navy-950/60 backdrop:backdrop-blur-sm"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close Henry's profile"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-accent-soft text-ink transition-colors hover:bg-accent hover:text-white sm:right-4 sm:top-4"
        >
          <X aria-hidden className="h-4 w-4" />
        </button>

        {/* The content scrolls inside the dialog, so the close button above stays in view. */}
        <div className="author-dialog-body grid max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain [scrollbar-width:thin] md:grid-cols-[17rem_1fr]">
          {/* Photo, name and title. */}
          <div className="relative flex flex-col items-center overflow-hidden border-b border-line bg-sunken px-6 pb-7 pt-10 text-center md:border-b-0 md:border-r md:pb-10">
            <div className="relative rounded-full bg-brand-gradient p-1 shadow-glow">
              <Image src={PHOTO} alt="Henry, founder and creator of Calculus Solver" width={176} height={176} className="h-32 w-32 rounded-full border-4 border-surface object-cover md:h-44 md:w-44" />
            </div>
            <h2 id={`${uid}-name`} className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
              Henry
            </h2>
            <p className="mt-3 rounded-full bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-glow">Founder &amp; Creator of Calculus Solver</p>
            <p aria-hidden className="mt-6 hidden font-display text-4xl italic text-accent/40 md:block">
              ∫ <span className="text-3xl">d/dx</span>
            </p>
          </div>

          {/* Profile text. */}
          <div className="space-y-7 px-5 py-7 sm:px-8 sm:py-9">
            <section aria-labelledby={`${uid}-about`}>
              <SectionHeading icon={UserRound} id={`${uid}-about`}>
                About Henry
              </SectionHeading>
              <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-soft">
                {ABOUT.map((p) => (
                  <p key={p.slice(0, 20)}>{p}</p>
                ))}
              </div>
            </section>

            <section aria-labelledby={`${uid}-expertise`}>
              <SectionHeading icon={Layers} id={`${uid}-expertise`}>
                My Expertise
              </SectionHeading>
              <ul className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {EXPERTISE.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-sunken px-3 py-4 text-center shadow-card transition-transform hover:-translate-y-0.5">
                    <Icon aria-hidden className="h-7 w-7 text-accent-strong" />
                    <span className="text-sm font-semibold leading-snug text-ink">{label}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby={`${uid}-mission`}>
              <SectionHeading icon={Target} id={`${uid}-mission`}>
                My Mission
              </SectionHeading>
              <p className="mt-3 rounded-2xl border border-line bg-sunken px-4 py-3.5 text-[15px] leading-relaxed text-ink-soft">
                My mission is to make mathematics easier to understand through accessible online tools, clear explanations, and step-by-step learning experiences.
              </p>
            </section>

            <section aria-labelledby={`${uid}-philosophy`}>
              <SectionHeading icon={Heart} id={`${uid}-philosophy`}>
                My Philosophy
              </SectionHeading>
              <p className="mt-3 rounded-2xl bg-brand-gradient px-5 py-4 text-center font-display text-base font-bold italic text-white shadow-glow sm:text-lg">
                Learn step by step. Understand every rule. Solve with confidence.
              </p>
            </section>
          </div>
        </div>
      </dialog>
    </>
  );
}
