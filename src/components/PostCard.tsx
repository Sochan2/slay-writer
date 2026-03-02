"use client";

import { useState } from "react";

interface PostCardProps {
  title: string;
  subtitle: string;
  content: string;
  variant: "authority" | "relatable";
}

export function PostCard({ title, subtitle, content, variant }: PostCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = content;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const badgeStyles =
    variant === "authority"
      ? "bg-amber-900/50 text-amber-400 ring-1 ring-amber-700"
      : "bg-emerald-900/50 text-emerald-400 ring-1 ring-emerald-700";

  const accentBorder =
    variant === "authority" ? "border-t-amber-400" : "border-t-emerald-500";

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-sm border-t-2 ${accentBorder} transition-shadow hover:shadow-md hover:shadow-black/40`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between border-b border-zinc-800 px-5 py-4">
        <div className="flex flex-col gap-1">
          <span
            className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeStyles}`}
          >
            {variant === "authority" ? "Expert Voice" : "Human Voice"}
          </span>
          <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
          <p className="text-xs text-zinc-500">{subtitle}</p>
        </div>

        <button
          onClick={handleCopy}
          aria-label={copied ? "Copied!" : "Copy to clipboard"}
          className={`ml-4 flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
            copied
              ? "border-emerald-700 bg-emerald-900/40 text-emerald-400"
              : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-700 hover:text-white"
          }`}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <rect
                  x="4"
                  y="4"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M8 4V2a1 1 0 00-1-1H2a1 1 0 00-1 1v5a1 1 0 001 1h2"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Post Content */}
      <div className="flex-1 overflow-auto px-5 py-4">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-200">
          {content}
        </pre>
      </div>

      {/* Footer with word count + prominent copy button */}
      <div className="border-t border-zinc-800 px-5 py-3 flex items-center justify-between gap-3">
        <p className="text-xs text-zinc-500">
          {content.trim().split(/\s+/).length} words · Ready to post on LinkedIn
        </p>
        <button
          onClick={handleCopy}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
            copied
              ? "bg-emerald-600 text-white"
              : "bg-amber-400 text-black hover:bg-amber-500"
          }`}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              ✓ Copied!
            </>
          ) : (
            "Copy to clipboard"
          )}
        </button>
      </div>
    </div>
  );
}
