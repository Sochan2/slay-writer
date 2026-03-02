"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";

// ── Shared animation helpers ──────────────────────────────────────────────────
const MotionLink = motion(Link);

const EASE = "easeOut" as const;
const DUR = 0.6;

/** Fade + slide up — for hero elements driven by animate (not whileInView) */
function heroVariant(delay: number) {
  return {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DUR, ease: EASE, delay },
  };
}

/** Fade + slide up — triggered by scroll (whileInView) */
const inViewFadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

/** Scale + fade — triggered by scroll */
const inViewScale = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
};

/** Spring transition for interactive buttons */
const springBtn = { type: "spring" as const, stiffness: 400, damping: 17 };

// ── Testimonials data ─────────────────────────────────────────────────────────
const testimonials = [
  {
    quote:
      "Even on the first try, both Expert and Human voice outputs were impressive. I didn't expect the quality to be this good.",
    name: "Beta User",
    role: "Developer",
    initial: "D",
  },
  {
    quote:
      "The responsive design and handwriting instructions are excellent. It feels intentional and polished.",
    name: "Beta User",
    role: "Designer",
    initial: "D",
  },
  {
    quote:
      "This tool finally made me stop dreading LinkedIn. I just fill in my story and it does the rest.",
    name: "Beta User",
    role: "Founder",
    initial: "F",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar />

      <main className="flex-1">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 pt-32 pb-28 lg:px-10">
          {/* Ambient amber glow */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-amber-400/6 blur-3xl" />
            <div className="absolute left-1/2 top-20 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-amber-500/4 blur-2xl" />
          </div>

          <div className="mx-auto max-w-4xl text-center">

            {/* Badge — fade in + slide down */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DUR, ease: EASE, delay: 0 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-800/60 bg-amber-950/40 px-4 py-2 text-sm font-medium text-amber-400 backdrop-blur-sm"
            >
              <span aria-hidden="true" className="text-amber-300">✦</span>
              AI-Powered LinkedIn Growth
            </motion.div>

            {/* H1 — fade in + slide up */}
            <motion.h1
              {...heroVariant(0.2)}
              className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
              style={{ lineHeight: "1.1" }}
            >
              Turn Your Story Into a{" "}
              <span className="gradient-text">Viral LinkedIn Post</span>
            </motion.h1>

            {/* Subtext — fade in + slide up */}
            <motion.p
              {...heroVariant(0.4)}
              className="mx-auto mt-7 max-w-lg text-lg leading-relaxed text-zinc-400"
            >
              Stop staring at a blank page. Fill in 4 fields. Get 2 scroll-stopping posts in seconds.
            </motion.p>

            {/* CTA — fade in + scale up */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: DUR, ease: EASE, delay: 0.6 }}
              className="mt-10 flex flex-col items-center gap-4"
            >
              <MotionLink
                href="/generate"
                whileHover={{ scale: 1.05, boxShadow: "0 0 32px rgba(251, 191, 36, 0.45)" }}
                whileTap={{ scale: 0.95 }}
                transition={springBtn}
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-9 py-4 text-base font-bold text-black shadow-xl shadow-amber-400/25 transition-colors hover:bg-amber-300"
              >
                Generate Your Post Free →
              </MotionLink>
              <p className="text-sm text-zinc-500">
                No credit card required · 10 free generations/month
              </p>
            </motion.div>

            {/* Social proof pill — fade in */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: DUR, ease: EASE, delay: 0.8 }}
              className="mt-10 inline-flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-900/70 px-5 py-3 backdrop-blur-sm"
            >
              <div className="flex -space-x-2">
                {["P", "S", "A", "K", "M"].map((letter, i) => (
                  <div
                    key={i}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-amber-800/80 text-xs font-bold text-amber-200"
                    aria-hidden="true"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <p className="text-sm text-zinc-400">
                Join{" "}
                <span className="font-semibold text-white">40+</span>{" "}
                professionals already posting with SLAY
              </p>
            </motion.div>

          </div>
        </section>

        {/* ── STEP ONE / TWO / THREE ───────────────────────────────────────── */}
        <section id="features" className="bg-zinc-950 px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-[1200px]">

            {/* Section header */}
            <motion.div
              {...inViewFadeUp}
              transition={{ duration: DUR, ease: EASE }}
              className="mb-16 text-center"
            >
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl leading-tight">
                Built around the SLAY Framework
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                A proven structure used by top LinkedIn creators. We automate the hard part.
              </p>
            </motion.div>

            {/* 3-card visual layout */}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:items-start">

              {/* ─ Card 1: Fill in your idea ─ */}
              <motion.div
                {...inViewFadeUp}
                transition={{ duration: DUR, ease: EASE, delay: 0 }}
                className="flex flex-col items-center"
              >
                <div className="mb-3 self-start ml-4 flex flex-col">
                  <span className="font-caveat text-2xl font-bold text-amber-400">Step One</span>
                  <svg viewBox="0 0 64 36" className="mt-0.5 w-14 h-9 text-amber-400 ml-4" fill="none">
                    <path d="M 6 4 C 18 4 32 28 56 30" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                    <path d="M 50 25 L 56 30 L 50 34" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div className="w-full rounded-2xl bg-zinc-900 p-5 shadow-lg ring-2 ring-amber-900/50">
                  <div className="space-y-2.5">
                    {["Your topic", "Your experience", "Main message", "Target audience"].map((field) => (
                      <div key={field} className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-800 px-3.5 py-2.5">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-zinc-500">
                          <circle cx="6" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M2 11c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                        <span className="text-xs text-zinc-400">{field}</span>
                      </div>
                    ))}
                    <div className="rounded-xl bg-amber-400 py-2.5 text-center text-xs font-semibold text-black">
                      Generate →
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <h3 className="text-base font-bold text-white">Fill in four fields</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400 max-w-xs mx-auto">
                    Topic, your personal experience, the main message you want to share, and your target audience.
                  </p>
                </div>
              </motion.div>

              {/* ─ Card 2: SLAY Framework ─ */}
              <motion.div
                {...inViewFadeUp}
                transition={{ duration: DUR, ease: EASE, delay: 0.15 }}
                className="flex flex-col items-center lg:mt-12"
              >
                <div className="w-full rounded-2xl bg-zinc-900 p-6 shadow-xl ring-2 ring-amber-800/50">
                  <div className="flex justify-center mb-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-md">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                        <path d="M5 7h18M5 14h12M5 21h8" stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>

                  <div className="flex justify-center mb-4">
                    <div className="w-px h-4 bg-amber-800" />
                  </div>

                  <div className="space-y-2">
                    {[
                      { letter: "S", label: "Strong Hook" },
                      { letter: "L", label: "Lesson" },
                      { letter: "A", label: "Action Story" },
                      { letter: "Y", label: "Your CTA" },
                    ].map((item) => (
                      <div key={item.letter} className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-800 px-4 py-2.5">
                        <span className="w-5 shrink-0 text-center text-sm font-black text-amber-400">{item.letter}</span>
                        <span className="text-xs text-zinc-400">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <h3 className="text-base font-bold text-white">SLAY Framework applied</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400 max-w-xs mx-auto">
                    Claude AI applies the proven S-L-A-Y structure to every post. No guesswork, no blank page.
                  </p>
                </div>
              </motion.div>

              {/* ─ Card 3: Pick, copy, post ─ */}
              <motion.div
                {...inViewFadeUp}
                transition={{ duration: DUR, ease: EASE, delay: 0.30 }}
                className="flex flex-col items-center"
              >
                <div className="mb-3 self-end mr-4 flex flex-col items-end">
                  <span className="font-caveat text-2xl font-bold text-amber-400">Step Three</span>
                  <svg viewBox="0 0 64 36" className="mt-0.5 w-14 h-9 text-amber-400 mr-4 scale-x-[-1]" fill="none">
                    <path d="M 6 4 C 18 4 32 28 56 30" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                    <path d="M 50 25 L 56 30 L 50 34" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div className="w-full rounded-2xl bg-zinc-900 p-5 shadow-lg ring-2 ring-amber-900/50">
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5 rounded-xl border border-amber-900/50 bg-amber-900/20 px-3.5 py-2.5">
                      <span className="shrink-0 rounded-full bg-amber-900/50 px-2 py-0.5 text-xs font-semibold text-amber-400 ring-1 ring-amber-800">
                        Expert
                      </span>
                      <span className="text-xs text-zinc-400 line-clamp-1">95% of LinkedIn posts fail...</span>
                    </div>
                    <div className="flex items-start gap-2.5 rounded-xl border border-emerald-900/50 bg-emerald-900/20 px-3.5 py-2.5">
                      <span className="shrink-0 rounded-full bg-emerald-900/50 px-2 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-800">
                        Human
                      </span>
                      <span className="text-xs text-zinc-400 line-clamp-1">I deleted my post 4 times...</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-800 px-3.5 py-2.5">
                      <span className="text-xs text-zinc-400">Ready to paste on LinkedIn</span>
                      <span className="rounded-lg bg-amber-400 px-2.5 py-1 text-xs font-semibold text-black">Copy</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <h3 className="text-base font-bold text-white">Pick, copy, post</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400 max-w-xs mx-auto">
                    Two scroll-stopping posts ready instantly. Pick your tone, copy to clipboard, paste to LinkedIn.
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
        <section className="px-6 py-24 lg:px-10 bg-black">
          <div className="mx-auto max-w-[1200px]">

            {/* Section header */}
            <motion.div
              {...inViewFadeUp}
              transition={{ duration: DUR, ease: EASE }}
              className="mb-14 text-center"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                Early Access
              </p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                What early users are saying
              </h2>
            </motion.div>

            {/* Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  {...inViewFadeUp}
                  transition={{ duration: DUR, ease: EASE, delay: i * 0.1 }}
                  className="flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-7 transition-colors duration-200 hover:border-zinc-700 hover:bg-zinc-900/80"
                >
                  {/* Stars */}
                  <div className="flex gap-1" aria-label="5 stars">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path
                          d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.885l-3.09 1.625.59-3.44L2 4.635l3.455-.505L7 1z"
                          fill="#FBBF24"
                        />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="flex-1 text-sm leading-relaxed text-zinc-300">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Attribution */}
                  <div className="flex items-center gap-3 border-t border-zinc-800 pt-5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-900/60 text-sm font-bold text-amber-300">
                      {t.initial}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-zinc-500">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
        <section className="px-6 py-24 lg:px-10 bg-amber-400">
          <motion.div
            {...inViewScale}
            transition={{ duration: DUR, ease: EASE }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-3xl font-bold text-black sm:text-4xl lg:text-5xl leading-tight">
              Ready to Stop Hiding and Start Posting?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-amber-900">
              Your story matters. Let SLAY Writer turn it into a post people actually read.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3">
              <MotionLink
                href="/generate"
                whileHover={{ scale: 1.05, boxShadow: "0 0 28px rgba(0, 0, 0, 0.35)" }}
                whileTap={{ scale: 0.95 }}
                transition={springBtn}
                className="inline-flex items-center gap-2 rounded-2xl bg-black px-9 py-4 text-base font-bold text-amber-400 shadow-xl shadow-black/30 transition-colors hover:bg-zinc-900"
              >
                Try SLAY Writer Free
              </MotionLink>
              <p className="text-sm text-amber-800">No credit card required</p>
            </div>
          </motion.div>
        </section>

      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 bg-black px-6 py-8 lg:px-10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-400">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 3h8M2 6h5M2 9h3" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-zinc-200">
              SLAY<span className="text-amber-400">Writer</span>
            </span>
            <span className="hidden text-xs text-zinc-600 sm:inline">·</span>
            <span className="hidden text-xs text-zinc-500 sm:inline">
              © {new Date().getFullYear()} SLAY Writer
            </span>
          </div>

          <p className="text-xs text-zinc-500 sm:hidden">
            © {new Date().getFullYear()} SLAY Writer
          </p>

          <div className="flex gap-6 text-xs text-zinc-500">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
