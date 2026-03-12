"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";

interface FormData {
  topic: string;
  experience: string;
  message: string;
  audience: string;
  numbers: string;
  frustration: string;
  postGoal: string;
}

interface GenerateResult {
  authorityPost: string;
  relatablePost: string;
  rantPost?: string;
  isPro?: boolean;
}

const MAX_LENGTH = 1000;

const FIELDS: {
  key: keyof FormData;
  label: string;
  placeholder: string;
  hint?: string;
  multiline: boolean;
}[] = [
  {
    key: "topic",
    label: "Topic",
    placeholder: "e.g. Dealing with imposter syndrome as a new manager",
    hint: "What is this post about?",
    multiline: false,
  },
  {
    key: "audience",
    label: "Target Audience",
    placeholder: "e.g. First-time managers, team leads, HR professionals",
    hint: "Who are you writing for?",
    multiline: false,
  },
  {
    key: "experience",
    label: "What did you learn from it?",
    placeholder:
      "e.g. I experienced how to learn code to match my team's level can build trust and credibility.",
    multiline: true,
  },
  {
    key: "message",
    label: "What do you want people to feel?",
    placeholder:
      "e.g. Imposter syndrome often means you care deeply — that's actually a strength, not a weakness.",
    hint: "What's the key takeaway you want to share?",
    multiline: true,
  },
];

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default function GeneratePage() {
  const [form, setForm] = useState<FormData>({
    topic: "",
    experience: "",
    message: "",
    audience: "",
    numbers: "",
    frustration: "",
    postGoal: "",
  });

  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Mobile quiz state
  const [mobileStep, setMobileStep] = useState(0);
  const [slideDir, setSlideDir] = useState<"forward" | "back">("forward");
  const [stepKey, setStepKey] = useState(0);

  const goNext = () => {
    setSlideDir("forward");
    setStepKey((k) => k + 1);
    setMobileStep((s) => s + 1);
  };

  const goBack = () => {
    setSlideDir("back");
    setStepKey((k) => k + 1);
    setMobileStep((s) => s - 1);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (value.length > MAX_LENGTH) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = FIELDS.every(
    (f) => form[f.key].trim().length > 0
  );

  const generatePosts = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setUpgradeRequired(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429 && data.upgradeRequired) {
          setUpgradeRequired(true);
          return;
        }
        throw new Error(data.error || "Failed to generate posts.");
      }

      setResult(data);

      // Scroll to results after a short delay for state to settle
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Generate LinkedIn Posts
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Fill in the four fields below. AI will craft two SLAY-framework
            posts — one authoritative, one human.
          </p>
        </div>

        {/* ── Mobile quiz (hidden on md+) ── */}
        <div className="md:hidden">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">
                Step {mobileStep + 1} of {FIELDS.length}
              </span>
              <span className="text-xs text-zinc-600">
                {Math.round(((mobileStep + 1) / FIELDS.length) * 100)}%
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-zinc-800">
              <div
                className="h-1 rounded-full bg-amber-400 transition-all duration-300"
                style={{ width: `${((mobileStep + 1) / FIELDS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step card */}
          <div
            key={stepKey}
            className={`quiz-slide-${slideDir} flex min-h-[60vh] flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-6`}
          >
            {/* Question */}
            <div className="mb-6 flex-shrink-0">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
                Question {mobileStep + 1}
              </p>
              <h2 className="text-2xl font-bold leading-snug text-white">
                {FIELDS[mobileStep].label}
              </h2>
              {FIELDS[mobileStep].hint && (
                <p className="mt-2 text-sm text-zinc-400">
                  {FIELDS[mobileStep].hint}
                </p>
              )}
            </div>

            {/* Input */}
            <div className="flex flex-1 flex-col">
              {FIELDS[mobileStep].multiline ? (
                <textarea
                  id={`mobile-${FIELDS[mobileStep].key}`}
                  name={FIELDS[mobileStep].key}
                  value={form[FIELDS[mobileStep].key]}
                  onChange={handleChange}
                  placeholder={FIELDS[mobileStep].placeholder}
                  rows={6}
                  autoFocus
                  className="flex-1 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-base text-zinc-100 placeholder-zinc-500 transition-colors focus:border-amber-400 focus:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                />
              ) : (
                <input
                  id={`mobile-${FIELDS[mobileStep].key}`}
                  name={FIELDS[mobileStep].key}
                  type="text"
                  value={form[FIELDS[mobileStep].key]}
                  onChange={handleChange}
                  placeholder={FIELDS[mobileStep].placeholder}
                  autoFocus
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-base text-zinc-100 placeholder-zinc-500 transition-colors focus:border-amber-400 focus:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                />
              )}
              <div className="mt-1.5 text-right">
                <span
                  className={`text-xs tabular-nums ${
                    form[FIELDS[mobileStep].key].length > MAX_LENGTH * 0.9
                      ? "text-amber-400"
                      : "text-zinc-600"
                  }`}
                >
                  {form[FIELDS[mobileStep].key].length}/{MAX_LENGTH}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between gap-3">
              {mobileStep > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back
                </button>
              ) : (
                <div />
              )}

              {mobileStep < FIELDS.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={form[FIELDS[mobileStep].key].trim().length === 0}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={generatePosts}
                  disabled={loading || !isFormValid}
                  className="flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Generating…
                    </>
                  ) : (
                    <>
                      Generate ✨
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="hidden md:block rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm sm:p-8">
          <form onSubmit={(e) => { e.preventDefault(); generatePosts(); }} noValidate>
            {/* Top row: 2 columns on sm+ */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {FIELDS.filter((f) => !f.multiline).map((field) => (
                <div key={field.key}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <label
                      htmlFor={field.key}
                      className="text-sm font-medium text-zinc-200"
                    >
                      {field.label}
                      <span className="ml-1 text-red-500" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <span
                      className={`text-xs tabular-nums ${
                        form[field.key].length > MAX_LENGTH * 0.9
                          ? "text-amber-400"
                          : "text-zinc-500"
                      }`}
                    >
                      {form[field.key].length}/{MAX_LENGTH}
                    </span>
                  </div>
                  <input
                    id={field.key}
                    name={field.key}
                    type="text"
                    value={form[field.key]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-amber-400 focus:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                  />
                  <p className="mt-1 text-xs text-zinc-500">{field.hint}</p>
                </div>
              ))}
            </div>

            {/* Textareas */}
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {FIELDS.filter((f) => f.multiline).map((field) => (
                <div key={field.key}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <label
                      htmlFor={field.key}
                      className="text-sm font-medium text-zinc-200"
                    >
                      {field.label}
                      <span className="ml-1 text-red-500" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <span
                      className={`text-xs tabular-nums ${
                        form[field.key].length > MAX_LENGTH * 0.9
                          ? "text-amber-400"
                          : "text-zinc-500"
                      }`}
                    >
                      {form[field.key].length}/{MAX_LENGTH}
                    </span>
                  </div>
                  <textarea
                    id={field.key}
                    name={field.key}
                    value={form[field.key]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    rows={5}
                    required
                    className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-amber-400 focus:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                  />
                  <p className="mt-1 text-xs text-zinc-500">{field.hint}</p>
                </div>
              ))}
            </div>

            {/* Optional fields */}
            <div className="mt-6 border-t border-zinc-800 pt-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Optional{" "}
                <span className="font-normal normal-case tracking-normal">
                  — adds context for stronger posts
                </span>
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Numbers */}
                <div>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <label
                      htmlFor="numbers"
                      className="text-sm font-medium text-zinc-200"
                    >
                      Any specific numbers or results?
                    </label>
                    <span
                      className={`text-xs tabular-nums ${
                        form.numbers.length > MAX_LENGTH * 0.9
                          ? "text-amber-400"
                          : "text-zinc-500"
                      }`}
                    >
                      {form.numbers.length}/{MAX_LENGTH}
                    </span>
                  </div>
                  <input
                    id="numbers"
                    name="numbers"
                    type="text"
                    value={form.numbers}
                    onChange={handleChange}
                    placeholder="e.g. 3 months, 10x faster, saved $500"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-amber-400 focus:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                  />
                  <p className="mt-1 text-xs text-zinc-500">
                    Stats and proof points strengthen credibility.
                  </p>
                </div>

                {/* Frustration */}
                <div>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <label
                      htmlFor="frustration"
                      className="text-sm font-medium text-zinc-200"
                    >
                      What frustrated or surprised you about this topic?
                    </label>
                    <span
                      className={`text-xs tabular-nums ${
                        form.frustration.length > MAX_LENGTH * 0.9
                          ? "text-amber-400"
                          : "text-zinc-500"
                      }`}
                    >
                      {form.frustration.length}/{MAX_LENGTH}
                    </span>
                  </div>
                  <textarea
                    id="frustration"
                    name="frustration"
                    value={form.frustration}
                    onChange={handleChange}
                    placeholder="e.g. Everyone told me X but actually Y"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-amber-400 focus:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                  />
                  <p className="mt-1 text-xs text-zinc-500">
                    Contrarian angles make posts stand out.
                  </p>
                </div>
              </div>

              {/* Post goal */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-zinc-200">
                  What&apos;s your goal for this post?
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["Get comments", "Get followers", "Get DMs", "Get saves"] as const).map(
                    (goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            postGoal: prev.postGoal === goal ? "" : goal,
                          }))
                        }
                        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                          form.postGoal === goal
                            ? "border-amber-400 bg-amber-400 text-black"
                            : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-amber-400 hover:text-amber-400"
                        }`}
                      >
                        {goal}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-zinc-500">
                Required fields marked *. Max 1,000 characters each.
              </p>
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-2.5 text-sm font-semibold text-black shadow-sm transition-all hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[180px]"
              >
                {loading ? (
                  <>
                    <Spinner />
                    Generating…
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M8 1v14M1 8h14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    Generate posts
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Upgrade required banner */}
        {upgradeRequired && (
          <div className="mt-6 rounded-2xl border border-amber-700 bg-amber-950/40 p-6 text-center">
            <p className="mb-1 text-lg font-bold text-white">
              You&apos;ve used all 10 free generations this month
            </p>
            <p className="mb-5 text-sm text-zinc-400">
              Upgrade to Pro for unlimited posts. 7-day free trial — no charge today.
            </p>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-3 text-sm font-bold text-black shadow-lg shadow-amber-400/20 hover:bg-amber-300 transition-colors"
            >
              Start Free Trial →
            </a>
            <p className="mt-3 text-xs text-zinc-500">$9/month after trial · cancel any time</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-800 bg-red-950/50 px-4 py-3.5 text-sm text-red-400">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M8 5v3M8 11v.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="mt-8" aria-live="polite" aria-label="Generating posts…">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-5 w-5 animate-spin">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#F59E0B" strokeWidth="4" />
                  <path className="opacity-75" fill="#F59E0B" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-amber-400">
                Crafting your posts with the SLAY Framework…
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-80 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-sm"
                >
                  <div className="border-b border-zinc-800 p-5">
                    <div className="mb-3 h-5 w-24 animate-pulse rounded-full bg-zinc-800" />
                    <div className="h-4 w-32 animate-pulse rounded bg-zinc-800" />
                  </div>
                  <div className="space-y-2 p-5">
                    {[90, 75, 60, 85, 50, 70, 40].map((w, j) => (
                      <div
                        key={j}
                        className="h-3 animate-pulse rounded bg-zinc-800"
                        style={{ width: `${w}%` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div ref={resultsRef} className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Your posts are ready
                </h2>
                <p className="text-sm text-zinc-400">
                  Pick your favourite. Copy and paste to LinkedIn.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setError(null);
                }}
                className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
              >
                Clear
              </button>
            </div>

            {/* SLAY badge */}
            <div className="mb-5 flex flex-wrap gap-3">
              {["S — Strong Hook", "L — Lesson", "A — Action Story", "Y — Your CTA"].map(
                (step) => (
                  <span
                    key={step}
                    className="rounded-full border border-amber-800 bg-amber-900/30 px-3 py-1 text-xs font-medium text-amber-400"
                  >
                    {step}
                  </span>
                )
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <PostCard
                title="Authority Post"
                subtitle="Expert, confident, authoritative tone"
                content={result.authorityPost}
                variant="authority"
              />
              <PostCard
                title="Relatable Post"
                subtitle="Empathetic, human, vulnerable tone"
                content={result.relatablePost}
                variant="relatable"
              />
            </div>

            {/* Rant post — Pro only */}
            <div className="mt-6">
              {result.isPro && result.rantPost ? (
                <PostCard
                  title="Rant Post"
                  subtitle="Raw, opinionated, unapologetic hot-take"
                  content={result.rantPost}
                  variant="rant"
                />
              ) : (
                <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-sm border-t-2 border-t-red-500">
                  {/* blurred preview rows */}
                  <div className="select-none blur-sm pointer-events-none px-5 py-4 space-y-2" aria-hidden="true">
                    {[85, 70, 90, 55, 75, 60, 80].map((w, i) => (
                      <div key={i} className="h-3 rounded bg-zinc-700" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                  {/* overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-950/80 px-6 text-center">
                    <span className="text-2xl" aria-hidden="true">🔥</span>
                    <div>
                      <p className="text-sm font-semibold text-white">Rant Post — Pro only</p>
                      <p className="mt-1 text-xs text-zinc-400">Raw, opinionated, zero-filter. Unlock with a Pro plan.</p>
                    </div>
                    <a
                      href="/pricing"
                      className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-xs font-bold text-white hover:bg-red-400 transition-colors"
                    >
                      Upgrade to Pro →
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Posting tip */}
            {(() => {
              const tips: Record<string, string> = {
                "Get comments": "Post Tuesday–Thursday at 8–10 am — professionals are active and more likely to jump into a conversation.",
                "Get followers": "Post Monday or Wednesday morning — the algorithm rewards early engagement and shows new content to more people.",
                "Get DMs": "Post at lunch (12–1 pm) when people have time to read carefully and reach out.",
                "Get saves": "Try weekend mornings — people browse and save reference content when they're not in work mode.",
              };
              const tip = form.postGoal && tips[form.postGoal]
                ? tips[form.postGoal]
                : "Post at 12–1 pm on weekdays, or weekend mornings for less competition.";
              return (
                <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-amber-800 bg-amber-900/20 px-4 py-3 text-sm text-amber-300">
                  <span aria-hidden="true">💡</span>
                  <span>
                    <strong>Best time to post:</strong> {tip}
                  </span>
                </div>
              );
            })()}

            {/* Regenerate */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={generatePosts}
                className="text-sm text-zinc-500 underline-offset-2 hover:text-amber-400 hover:underline transition-colors"
              >
                Not satisfied? Regenerate →
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer strip */}
      <div className="mt-auto border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">
        <p>
          Powered by Claude AI · SLAY Framework ·{" "}
          <a href="/" className="hover:text-amber-400 transition-colors">
            SLAYWriter
          </a>
        </p>
      </div>
    </div>
  );
}
