"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const isGenerator = pathname === "/generate";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-900">
            SLAY<span className="text-violet-600">Writer</span>
          </span>
        </Link>

        {/* Center nav — landing page only */}
        {!isGenerator && (
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              How it works
            </a>
            <a href="#pricing" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              Pricing
            </a>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isGenerator ? (
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to home
            </Link>
          ) : (
            <Link
              href="/generate"
              className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 transition-colors"
            >
              Try for free
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
