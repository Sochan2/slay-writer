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
}

const MAX_LENGTH = 1000;

const FIELDS: {
  key: keyof FormData;
  label: string;
  placeholder: string;
  hint: string;
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
    label: "Personal Experience",
    placeholder:
      "e.g. I was promoted to manager after 2 years as a developer. I had no training and felt like a fraud for months...",
    hint: "What happened to you? Be specific.",
    multiline: true,
  },
  {
    key: "message",
    label: "Main Message",
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
  const resultsRef = useRef<HTMLDivElement>(null);

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

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
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
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Generate LinkedIn Posts
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Fill in the four fields below. AI will craft two SLAY-framework
            posts — one authoritative, one human.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={(e) => { e.preventDefault(); generatePosts(); }} noValidate>
            {/* Top row: 2 columns on sm+ */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {FIELDS.filter((f) => !f.multiline).map((field) => (
                <div key={field.key}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <label
                      htmlFor={field.key}
                      className="text-sm font-medium text-slate-700"
                    >
                      {field.label}
                      <span className="ml-1 text-red-500" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <span
                      className={`text-xs tabular-nums ${
                        form[field.key].length > MAX_LENGTH * 0.9
                          ? "text-amber-500"
                          : "text-slate-400"
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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/20"
                  />
                  <p className="mt-1 text-xs text-slate-400">{field.hint}</p>
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
                      className="text-sm font-medium text-slate-700"
                    >
                      {field.label}
                      <span className="ml-1 text-red-500" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <span
                      className={`text-xs tabular-nums ${
                        form[field.key].length > MAX_LENGTH * 0.9
                          ? "text-amber-500"
                          : "text-slate-400"
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
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/20"
                  />
                  <p className="mt-1 text-xs text-slate-400">{field.hint}</p>
                </div>
              ))}
            </div>

            {/* Optional fields */}
            <div className="mt-6 border-t border-slate-100 pt-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
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
                      className="text-sm font-medium text-slate-700"
                    >
                      Any specific numbers or results?
                    </label>
                    <span
                      className={`text-xs tabular-nums ${
                        form.numbers.length > MAX_LENGTH * 0.9
                          ? "text-amber-500"
                          : "text-slate-400"
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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/20"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Stats and proof points strengthen credibility.
                  </p>
                </div>

                {/* Frustration */}
                <div>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <label
                      htmlFor="frustration"
                      className="text-sm font-medium text-slate-700"
                    >
                      What frustrated or surprised you about this topic?
                    </label>
                    <span
                      className={`text-xs tabular-nums ${
                        form.frustration.length > MAX_LENGTH * 0.9
                          ? "text-amber-500"
                          : "text-slate-400"
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
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/20"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Contrarian angles make posts stand out.
                  </p>
                </div>
              </div>

              {/* Post goal */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700">
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
                            ? "border-violet-600 bg-violet-600 text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700"
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
              <p className="text-xs text-slate-400">
                Required fields marked *. Max 1,000 characters each.
              </p>
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[180px]"
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

        {/* Error */}
        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
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
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#7c3aed" strokeWidth="4" />
                  <path className="opacity-75" fill="#7c3aed" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-violet-700">
                Crafting your posts with the SLAY Framework…
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-80 rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="border-b border-slate-100 p-5">
                    <div className="mb-3 h-5 w-24 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                  </div>
                  <div className="space-y-2 p-5">
                    {[90, 75, 60, 85, 50, 70, 40].map((w, j) => (
                      <div
                        key={j}
                        className="h-3 animate-pulse rounded bg-slate-100"
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
                <h2 className="text-lg font-semibold text-slate-900">
                  Your posts are ready
                </h2>
                <p className="text-sm text-slate-500">
                  Pick your favourite. Copy and paste to LinkedIn.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setError(null);
                }}
                className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
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
                    className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
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

            {/* Posting tip */}
            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <span aria-hidden="true">💡</span>
              <span>
                <strong>Pro tip:</strong> Post at 12–1 pm on weekdays, or weekend mornings for less competition.
              </span>
            </div>

            {/* Regenerate */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={generatePosts}
                className="text-sm text-slate-500 underline-offset-2 hover:text-violet-700 hover:underline transition-colors"
              >
                Not satisfied? Regenerate →
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer strip */}
      <div className="mt-auto border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        <p>
          Powered by Claude AI · SLAY Framework ·{" "}
          <a href="/" className="hover:text-violet-600 transition-colors">
            SLAYWriter
          </a>
        </p>
      </div>
    </div>
  );
}
