"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { MagicCard } from "@/components/magicui/magic-card";
import { ShineBorder } from "@/components/magicui/shine-border";
import { BorderBeam } from "@/components/magicui/border-beam";

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-amber-400"
    >
      <path
        d="M3 8l3.5 3.5L13 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startTrial() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/login?next=/pricing");
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      if (data.url) {
        router.push(data.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar />

      <main className="flex-1 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              Simple pricing
            </p>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Start free. Upgrade when ready.
            </h1>
            <p className="mt-4 text-lg text-zinc-400">
              No commitment. Cancel any time.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-start">

            {/* Free plan */}
            <MagicCard className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
                  Free
                </p>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-5xl font-bold text-white">$0</span>
                  <span className="mb-1.5 text-sm text-zinc-500">/month</span>
                </div>
                <p className="mt-3 text-sm text-zinc-400">
                  Perfect for trying SLAY Writer out.
                </p>
              </div>

              <ul className="mb-8 space-y-3">
                {[
                  "10 post generations per month",
                  "Both Authority & Relatable styles",
                  "Copy-to-clipboard",
                  "All optional fields (numbers, goal…)",
                ].map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <CheckIcon />
                    {feat}
                  </li>
                ))}
              </ul>

              <Link
                href="/generate"
                className="block w-full rounded-xl border border-zinc-700 py-3 text-center text-sm font-semibold text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white"
              >
                Start for free
              </Link>
            </MagicCard>

            {/* Pro plan */}
            <ShineBorder
              color={["#FBBF24", "#F59E0B", "#D97706"]}
              duration={6}
              borderWidth={2}
              className="relative bg-zinc-900 shadow-2xl shadow-amber-400/10"
            >
              {/* BorderBeam animation */}
              <BorderBeam duration={8} colorFrom="#FBBF24" colorTo="#F97316" />

              {/* Most Popular badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                <span className="rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-black">
                  MOST POPULAR
                </span>
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
                    Pro
                  </p>
                  <div className="mt-3 flex items-end gap-1">
                    <span className="text-5xl font-bold text-white">$9</span>
                    <span className="mb-1.5 text-sm text-zinc-400">/month</span>
                  </div>
                  <p className="mt-3 text-sm text-zinc-400">
                    7-day free trial · card required · cancel any time
                  </p>
                </div>

                <ul className="mb-8 space-y-3">
                  {[
                    "Unlimited post generations",
                    "Both Authority & Relatable styles",
                    "Copy-to-clipboard",
                    "All optional fields (numbers, goal…)",
                    "Priority support",
                    "Early access to new features",
                  ].map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <CheckIcon />
                      {feat}
                    </li>
                  ))}
                </ul>

                {error && (
                  <p className="mb-4 rounded-lg border border-red-800 bg-red-950/50 px-3 py-2 text-xs text-red-400">
                    {error}
                  </p>
                )}

                <button
                  onClick={startTrial}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-3 text-sm font-bold text-black shadow-lg shadow-amber-400/25 transition-all hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Redirecting to checkout…
                    </>
                  ) : (
                    "Start Free Trial →"
                  )}
                </button>
                <p className="mt-3 text-center text-xs text-zinc-500">
                  $9/month after 7-day trial. Cancel any time.
                </p>
              </div>
            </ShineBorder>

          </div>

          {/* FAQ */}
          <div className="mt-16 border-t border-zinc-800 pt-14">
            <h2 className="mb-8 text-center text-2xl font-bold text-white">
              Common questions
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                {
                  q: "Do I need a credit card for the free plan?",
                  a: "No. You get 10 generations per month with no card required.",
                },
                {
                  q: "When will I be charged?",
                  a: "After your 7-day trial ends. You won't be charged a cent during the trial.",
                },
                {
                  q: "Can I cancel before the trial ends?",
                  a: "Yes — cancel any time from your Stripe billing portal and you won't be charged.",
                },
                {
                  q: "What happens when my free generations run out?",
                  a: "You'll see an upgrade prompt. Your existing posts are always yours to keep.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                  <p className="mb-2 font-semibold text-white">{q}</p>
                  <p className="text-sm leading-relaxed text-zinc-400">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800 bg-black py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} SLAY Writer · Payments secured by Stripe
      </footer>
    </div>
  );
}
