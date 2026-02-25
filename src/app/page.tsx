import Link from "next/link";
import { Navbar } from "@/components/Navbar";

const pricingTiers = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for trying out SLAY Writer.",
    features: [
      "5 generations per month",
      "Both Authority & Relatable tones",
      "Copy-to-clipboard",
      "SLAY Framework posts",
    ],
    cta: "Start for free",
    href: "/generate",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For creators serious about LinkedIn growth.",
    features: [
      "Unlimited generations",
      "Both tones always",
      "Post history",
      "Priority AI processing",
      "Export as plain text",
    ],
    cta: "Coming soon",
    href: "#",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/month",
    description: "For agencies and content teams.",
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "Shared post library",
      "Brand voice customization",
      "Priority support",
    ],
    cta: "Coming soon",
    href: "#",
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden px-6 pt-24 pb-28 lg:px-10">
          {/* Background blobs */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-50 opacity-60 blur-3xl" />
            <div className="absolute top-20 right-0 h-[300px] w-[300px] rounded-full bg-indigo-50 opacity-50 blur-2xl" />
          </div>

          <div className="mx-auto max-w-[1200px]">
            {/* Text block — centered */}
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1.5 text-xs font-medium text-violet-700">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                Powered by Claude AI · SLAY Framework
              </div>

              {/* Headline */}
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                LinkedIn posts that{" "}
                <span className="gradient-text">actually get read</span>
              </h1>

              {/* Problem-aware subtext */}
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500">
                Most LinkedIn posts die in 3 seconds — ignored before the third line.
                SLAY Writer solves that. Fill in 4 fields and get two scroll-stopping posts
                — one expert, one human — built on a proven framework. Done in seconds.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/generate"
                  className="w-full rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 transition-colors sm:w-auto"
                >
                  Generate your first post →
                </Link>
                <a
                  href="#how-it-works"
                  className="w-full rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors sm:w-auto"
                >
                  See how it works
                </a>
              </div>

              <p className="mt-5 text-xs text-slate-400">
                No credit card required · Takes 30 seconds
              </p>
            </div>

            {/* ── Demo preview ── */}
            <div className="mx-auto mt-16 max-w-4xl">
              {/* Label above */}
              <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-slate-400">
                Live output preview
              </p>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-slate-100">
                {/* Fake browser chrome */}
                <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-3 flex-1 rounded bg-white px-3 py-1 text-xs text-slate-400 border border-slate-200">
                    slaywriter.com/generate
                  </span>
                </div>

                {/* Two-column post output */}
                <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                  {/* Authority Post */}
                  <div className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
                        Expert Voice
                      </span>
                      <span className="text-xs font-medium text-slate-600">Authority Post</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">
                      <span className="font-semibold text-slate-900">
                        95% of LinkedIn posts fail before the third line.
                      </span>
                      <br />
                      <span className="text-slate-400">Here&apos;s why yours won&apos;t.</span>
                      <br /><br />
                      After studying 500 viral posts, I found one pattern.
                      <br /><br />
                      The hook isn&apos;t clever.
                      <br />
                      It&apos;s specific.
                      <br /><br />
                      <span className="text-slate-300">· · ·</span>
                    </p>
                  </div>

                  {/* Relatable Post */}
                  <div className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                        Human Voice
                      </span>
                      <span className="text-xs font-medium text-slate-600">Relatable Post</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">
                      <span className="font-semibold text-slate-900">
                        I deleted my LinkedIn post 4 times before I hit publish.
                      </span>
                      <br />
                      <span className="text-slate-400">It got 40,000 impressions.</span>
                      <br /><br />
                      The post I was most embarrassed to share.
                      <br /><br />
                      That&apos;s usually the one people need to hear.
                      <br /><br />
                      <span className="text-slate-300">· · ·</span>
                    </p>
                  </div>
                </div>

                {/* Bottom bar — reinforces the workflow */}
                <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Generated in ~3 seconds</span>
                  <span className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white">
                    Copy to clipboard
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="bg-white px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-[1200px]">

            {/* Section header */}
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
                Built around the SLAY Framework
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                A proven structure used by top LinkedIn creators. We automate the hard part.
              </p>
            </div>

            {/* 3-card visual layout */}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:items-start">

              {/* ─ Card 1: Fill in your idea ─ */}
              <div className="flex flex-col items-center">
                {/* Step label + arrow */}
                <div className="mb-3 self-start ml-4 flex flex-col">
                  <span className="font-caveat text-2xl font-bold text-violet-500">Step One</span>
                  <svg viewBox="0 0 64 36" className="mt-0.5 w-14 h-9 text-violet-400 ml-4" fill="none">
                    <path d="M 6 4 C 18 4 32 28 56 30" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                    <path d="M 50 25 L 56 30 L 50 34" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Mockup card */}
                <div className="w-full rounded-2xl bg-white p-5 shadow-lg ring-2 ring-violet-100">
                  <div className="space-y-2.5">
                    {["Your topic", "Your experience", "Main message", "Target audience"].map((field) => (
                      <div key={field} className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-slate-300">
                          <circle cx="6" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M2 11c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                        <span className="text-xs text-slate-400">{field}</span>
                      </div>
                    ))}
                    <div className="rounded-xl bg-violet-600 py-2.5 text-center text-xs font-semibold text-white">
                      Generate →
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <h3 className="text-base font-bold text-slate-900">Fill in four fields</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 max-w-xs mx-auto">
                    Topic, your personal experience, the main message you want to share, and your target audience.
                  </p>
                </div>
              </div>

              {/* ─ Card 2: SLAY Framework (hero middle) ─ */}
              <div className="flex flex-col items-center lg:mt-12">
                {/* No step label — center card is self-evident */}

                {/* Mockup card */}
                <div className="w-full rounded-2xl bg-white p-6 shadow-xl ring-2 ring-violet-200">
                  {/* Icon */}
                  <div className="flex justify-center mb-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                        <path d="M5 7h18M5 14h12M5 21h8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="flex justify-center mb-4">
                    <div className="w-px h-4 bg-violet-200" />
                  </div>

                  {/* S L A Y breakdown */}
                  <div className="space-y-2">
                    {[
                      { letter: "S", label: "Strong Hook" },
                      { letter: "L", label: "Lesson" },
                      { letter: "A", label: "Action Story" },
                      { letter: "Y", label: "Your CTA" },
                    ].map((item) => (
                      <div key={item.letter} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">
                        <span className="w-5 shrink-0 text-center text-sm font-black text-violet-600">{item.letter}</span>
                        <span className="text-xs text-slate-500">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <h3 className="text-base font-bold text-slate-900">SLAY Framework applied</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 max-w-xs mx-auto">
                    Claude AI applies the proven S-L-A-Y structure to every post. No guesswork, no blank page.
                  </p>
                </div>
              </div>

              {/* ─ Card 3: Pick, copy, post ─ */}
              <div className="flex flex-col items-center">
                {/* Step label + arrow (mirrored) */}
                <div className="mb-3 self-end mr-4 flex flex-col items-end">
                  <span className="font-caveat text-2xl font-bold text-violet-500">Step Three</span>
                  <svg viewBox="0 0 64 36" className="mt-0.5 w-14 h-9 text-violet-400 mr-4 scale-x-[-1]" fill="none">
                    <path d="M 6 4 C 18 4 32 28 56 30" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                    <path d="M 50 25 L 56 30 L 50 34" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Mockup card */}
                <div className="w-full rounded-2xl bg-white p-5 shadow-lg ring-2 ring-violet-100">
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5 rounded-xl border border-violet-100 bg-violet-50 px-3.5 py-2.5">
                      <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
                        Expert
                      </span>
                      <span className="text-xs text-slate-500 line-clamp-1">95% of LinkedIn posts fail...</span>
                    </div>
                    <div className="flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 px-3.5 py-2.5">
                      <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                        Human
                      </span>
                      <span className="text-xs text-slate-500 line-clamp-1">I deleted my post 4 times...</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5">
                      <span className="text-xs text-slate-400">Ready to paste on LinkedIn</span>
                      <span className="rounded-lg bg-violet-600 px-2.5 py-1 text-xs font-semibold text-white">Copy</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <h3 className="text-base font-bold text-slate-900">Pick, copy, post</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 max-w-xs mx-auto">
                    Two scroll-stopping posts ready instantly. Pick your tone, copy to clipboard, paste to LinkedIn.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Three steps to your next post
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                No writing skills needed. Just your idea and 30 seconds.
              </p>
            </div>

            <div className="mx-auto max-w-3xl space-y-5">
              {[
                {
                  step: "01",
                  title: "Fill in four fields",
                  description:
                    "Topic, your personal experience, the main message you want to share, and your target audience.",
                },
                {
                  step: "02",
                  title: "Hit generate",
                  description:
                    "Claude AI applies the SLAY Framework to craft two distinct posts — one authoritative, one relatable.",
                },
                {
                  step: "03",
                  title: "Pick, copy, post",
                  description:
                    "Choose the post that fits your mood. Copy to clipboard. Paste to LinkedIn. Done.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-5 rounded-2xl border border-slate-100 bg-slate-50 p-6"
                >
                  <span className="shrink-0 rounded-xl bg-violet-600 px-3 py-1.5 text-xs font-bold tracking-widest text-white">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="bg-slate-50 px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                Start free. Upgrade when you&apos;re ready.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative flex flex-col rounded-2xl border p-6 shadow-sm ${
                    tier.highlighted
                      ? "border-violet-300 bg-white ring-2 ring-violet-500/20"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                        Most popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-slate-500">{tier.name}</p>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-slate-900">{tier.price}</span>
                      {tier.period && (
                        <span className="text-sm text-slate-500">{tier.period}</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{tier.description}</p>
                  </div>

                  <ul className="mb-8 flex-1 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-violet-500"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 8l3 3 7-7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={tier.href}
                    className={`block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-colors ${
                      tier.highlighted
                        ? "bg-violet-600 text-white hover:bg-violet-700"
                        : tier.href === "#"
                        ? "border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                    aria-disabled={tier.href === "#"}
                  >
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="px-6 py-16 lg:px-10">
          <div className="mx-auto max-w-[1200px]">
            <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 p-12 text-center shadow-xl">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Your next post is 30 seconds away
              </h2>
              <p className="mt-3 text-violet-200">
                No account needed. Just fill in the fields and go.
              </p>
              <Link
                href="/generate"
                className="mt-8 inline-block rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-violet-700 shadow-sm hover:bg-violet-50 transition-colors"
              >
                Generate your post →
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 px-6 py-10 lg:px-10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-600">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 3h8M2 6h5M2 9h3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-700">
              SLAY<span className="text-violet-600">Writer</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} SLAYWriter. Built with the SLAY Framework.
          </p>
          <div className="flex gap-4 text-xs text-slate-400">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
