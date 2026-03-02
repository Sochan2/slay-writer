"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

export function Navbar() {
  const pathname = usePathname();
  const isGenerator = pathname === "/generate";

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-zinc-800 bg-black/90 backdrop-blur-md"
    >
      <nav className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-black shadow-sm">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-base font-semibold tracking-tight text-white">
            SLAY<span className="text-amber-400">Writer</span>
          </span>
        </Link>

        {/* Center nav — landing page only */}
        {!isGenerator && (
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors">
              How it works
            </a>
            <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Pricing
            </a>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isGenerator ? (
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to home
            </Link>
          ) : (
            <MotionLink
              href="/generate"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(251, 191, 36, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-amber-500 transition-colors"
            >
              Try for free
            </MotionLink>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
