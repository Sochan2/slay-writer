"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Target, Clipboard } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { AuroraText } from "@/components/magicui/aurora-text";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { Meteors } from "@/components/magicui/meteors";
import { MagicCard } from "@/components/magicui/magic-card";

// ── Shared animation helpers ──────────────────────────────────────────────────
const MotionLink = motion(Link);

const EASE = "easeOut" as const;
const DUR = 0.6;

function heroVariant(delay: number) {
  return {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DUR, ease: EASE, delay },
  };
}

const inViewFadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const inViewScale = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
};

const springBtn = { type: "spring" as const, stiffness: 400, damping: 17 };

// ── Data ─────────────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote:
      "I've tried your project above and its really cool, the result as an expert voice and human voice are both giving a great result.",
    name: "Andi F",
    role: "Full-Stack Developer",
    location: "🇸🇬 Singapore",
    initials: "AF",
  },
  {
    quote:
      "Finally a tool that gets it. I went from blank page anxiety to posting in under 3 minutes.",
    name: "Priya M.",
    role: "Product Designer",
    location: "🇮🇳 India",
    initials: "PM",
  },
  {
    quote:
      "The Relatable post type is scary good. It sounds exactly like how I talk. My last post got 3x my usual engagement.",
    name: "James T.",
    role: "Indie Founder",
    location: "🇦🇺 Australia",
    initials: "JT",
  },
];

const features = [
  {
    icon: Zap,
    title: "2 posts in seconds",
    description:
      "Fill in your story once. Get an Authority post and a Relatable post instantly. No rewriting, no second-guessing.",
  },
  {
    icon: Target,
    title: "The SLAY Framework",
    description:
      "Every post follows the proven S-L-A-Y structure used by top LinkedIn creators. Hook, lesson, story, CTA — automatically.",
  },
  {
    icon: Clipboard,
    title: "Copy and post",
    description:
      "One click to copy. Ready to paste directly into LinkedIn. No formatting, no editing needed.",
  },
];

const faqs = [
  {
    q: "Is it really free to start?",
    a: "Yes. You get 10 free generations per month, no credit card required. Upgrade to Pro anytime for unlimited access.",
  },
  {
    q: "Will it sound like me, or like a robot?",
    a: "SLAY Writer uses your own story, experience, and words as the foundation. The AI structures it but you provide the soul. Most users don't edit a single word.",
  },
  {
    q: "What's the difference between Authority and Relatable posts?",
    a: "Authority posts position you as an expert with bold insights and confident tone. Relatable posts lead with vulnerability and emotion. Both follow the SLAY Framework. So, should pick the one that fits your mood.",
  },
  {
    q: "How is this different from ChatGPT?",
    a: "ChatGPT gives you a blank canvas. SLAY Writer gives you a proven LinkedIn framework, two distinct voices, and output that's ready to paste. No prompting skills is necessary.",
  },
  {
    q: "Can I save my generated posts?",
    a: "Yes. Sign in with Google to save posts to your account and access them anytime. Guest users can save locally to their browser.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

          {/* Meteors background */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <Meteors number={12} />
          </div>

          <div className="mx-auto max-w-4xl text-center">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DUR, ease: EASE, delay: 0 }}
              className="mb-8 flex justify-center"
            >
              <AnimatedGradientText>
                <span aria-hidden="true" className="mr-2">✦</span>
                AI-Powered LinkedIn Growth
              </AnimatedGradientText>
            </motion.div>

            {/* H1 */}
            <motion.h1
              {...heroVariant(0.2)}
              className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
              style={{ lineHeight: "1.1" }}
            >
              Turn Your Story Into a{" "}
              <br className="hidden sm:block" />
              <AuroraText
                colors={["#FBBF24", "#F59E0B", "#FCD34D", "#F97316", "#FBBF24"]}
                speed={4}
              >
                Viral LinkedIn Post
              </AuroraText>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              {...heroVariant(0.4)}
              className="mx-auto mt-7 max-w-lg text-lg leading-relaxed text-zinc-400"
            >
              Stop staring at a blank page. Fill in 4 fields. Get 2 scroll-stopping posts in seconds.
            </motion.p>

            {/* CTA */}
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

            {/* Fix 1: Static trusted text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: DUR, ease: EASE, delay: 0.8 }}
              className="mt-8"
            >
              <p className="text-sm text-amber-400 text-center">
                ✦ Trusted by early adopters across 5+ countries
              </p>
            </motion.div>

            {/* Fix 2: Browser mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.9 }}
              className="mx-auto mt-14 max-w-[900px]"
            >
              <div
                className="rounded-xl overflow-hidden border border-zinc-700/60"
                style={{ boxShadow: "0 0 60px rgba(251, 191, 36, 0.12), 0 0 0 1px rgba(251,191,36,0.08)" }}
              >
                {/* Browser chrome */}
                <div className="flex items-center gap-3 bg-zinc-800 px-4 py-3 border-b border-zinc-700">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="rounded-md bg-zinc-700 px-4 py-1 text-xs text-zinc-400 w-64 text-center">
                      slay-writer.vercel.app/generate
                    </div>
                  </div>
                  <div className="w-10" />
                </div>

                {/* Browser body */}
                <div className="bg-zinc-950 p-5">
                  <div className="flex gap-5">

                    {/* Left: Form */}

                    {/* Right: Output preview — hidden on mobile */}
                    <div className="hidden sm:flex flex-1 min-w-0 flex-col gap-3">
                     <img src="/mockup.png" alt="Generated post preview" className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-xs text-zinc-400" />
                     
                    </div>

                  </div>
                </div>
              </div>
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

                <MagicCard className="w-full rounded-2xl bg-zinc-900 p-5 shadow-lg ring-2 ring-amber-900/50">
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
                </MagicCard>

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
                <MagicCard className="w-full rounded-2xl bg-zinc-900 p-6 shadow-xl ring-2 ring-amber-800/50">
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
                </MagicCard>

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

                <MagicCard className="w-full rounded-2xl bg-zinc-900 p-5 shadow-lg ring-2 ring-amber-900/50">
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
                </MagicCard>

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

        {/* ── Fix 3: FEATURES ──────────────────────────────────────────────── */}
        <section className="px-6 py-24 lg:px-10 bg-black">
          <div className="mx-auto max-w-[1200px]">

            <motion.div
              {...inViewFadeUp}
              transition={{ duration: DUR, ease: EASE }}
              className="mb-14 text-center"
            >
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Everything you need to stop dreading LinkedIn
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                Built for professionals who&apos;d rather ship than write.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  {...inViewFadeUp}
                  transition={{ duration: DUR, ease: EASE, delay: i * 0.1 }}
                >
                  <MagicCard className="flex h-full flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-7 transition-colors duration-200 hover:border-zinc-700">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-400/10 border border-amber-400/20">
                      <feature.icon size={20} className="text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm leading-relaxed text-zinc-400">{feature.description}</p>
                    </div>
                  </MagicCard>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* ── Fix 4: TESTIMONIALS ──────────────────────────────────────────── */}
        <section className="px-6 py-24 lg:px-10 bg-zinc-950">
          <div className="mx-auto max-w-[1200px]">

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

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  {...inViewFadeUp}
                  transition={{ duration: DUR, ease: EASE, delay: i * 0.1 }}
                >
                  <MagicCard className="flex h-full flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-7 transition-colors duration-200 hover:border-zinc-700">
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
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-900/60 text-xs font-bold text-amber-300">
                        {t.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{t.name}</p>
                        <p className="text-xs text-zinc-500">{t.role} · {t.location}</p>
                      </div>
                    </div>
                  </MagicCard>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* ── Fix 5: FAQ ───────────────────────────────────────────────────── */}
        <section className="px-6 py-24 lg:px-10 bg-zinc-950">
          <div className="mx-auto max-w-[700px]">

            <motion.div
              {...inViewFadeUp}
              transition={{ duration: DUR, ease: EASE }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Frequently asked questions
              </h2>
            </motion.div>

            <div className="divide-y divide-zinc-800 border-t border-zinc-800">
              {faqs.map((item, i) => (
                <motion.div
                  key={i}
                  {...inViewFadeUp}
                  transition={{ duration: DUR, ease: EASE, delay: i * 0.05 }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={openFaq === i}
                  >
                    <span className="text-sm font-semibold text-white sm:text-base">
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: openFaq === i ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-xl font-light text-amber-400 leading-none"
                      aria-hidden="true"
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 text-sm leading-relaxed text-zinc-400">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* ── Fix 6: FINAL CTA ─────────────────────────────────────────────── */}
        <section className="px-6 py-24 lg:px-10 bg-gradient-to-br from-amber-400 to-orange-500">
          <motion.div
            {...inViewScale}
            transition={{ duration: DUR, ease: EASE }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-3xl font-bold text-black sm:text-4xl lg:text-5xl leading-tight">
              Your next LinkedIn post is 3 minutes away.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-zinc-900">
              No blank page. No overthinking. Just your story, structured to stop the scroll.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3">
              <MotionLink
                href="/generate"
                whileHover={{ scale: 1.05, boxShadow: "0 0 28px rgba(0, 0, 0, 0.35)" }}
                whileTap={{ scale: 0.95 }}
                transition={springBtn}
                className="inline-flex items-center gap-2 rounded-2xl bg-black px-9 py-4 text-base font-bold text-white shadow-xl shadow-black/30 transition-colors hover:bg-zinc-900"
              >
                Start Writing Free →
              </MotionLink>
              <p className="text-sm text-zinc-900/70">
                10 free generations · No credit card · Cancel anytime
              </p>
            </div>
          </motion.div>
        </section>

      </main>

      {/* ── Fix 7: FOOTER ────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 bg-black px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-[1200px] space-y-6">

          {/* Top row: logo + social icons */}
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
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

            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a href="#" aria-label="LinkedIn" className="text-zinc-500 transition-colors hover:text-amber-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://github.com/Sochan2/slay-writer" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-zinc-500 transition-colors hover:text-amber-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" aria-label="X / Twitter" className="text-zinc-500 transition-colors hover:text-amber-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Bottom row: links + credit */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-zinc-800 pt-6 sm:flex-row">
            <p className="text-xs text-zinc-500 sm:hidden">
              © {new Date().getFullYear()} SLAY Writer
            </p>
            <div className="flex gap-6 text-xs text-zinc-500">
              <a href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-zinc-300 transition-colors">Terms</a>
            </div>
            <p className="text-xs text-zinc-600">
              Built with ❤️ and Claude AI
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
