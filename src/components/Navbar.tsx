"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { getLocalSavedCount } from "@/lib/savedPosts";
import { useEffect, useState } from "react";

const MotionLink = motion(Link);

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isGenerator = pathname === "/generate";

  const [hasActiveSub, setHasActiveSub] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSavedCount(getLocalSavedCount());
        return;
      }
      setIsLoggedIn(true);

      const { data } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .in("status", ["active", "trialing"])
        .single();

      setHasActiveSub(!!data);

      const { count } = await supabase
        .from("saved_posts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      setSavedCount(count ?? 0);
    }

    checkSubscription();

    const refresh = () => checkSubscription();
    window.addEventListener("slay-post-saved", refresh);
    return () => window.removeEventListener("slay-post-saved", refresh);
  }, []);

  // Scroll-based darkening
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function handleManageSubscription() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setPortalLoading(false);
    }
  }

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it works" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-zinc-700/80 bg-black/95 shadow-lg shadow-black/40 backdrop-blur-md"
          : "border-zinc-800 bg-black/80 backdrop-blur-md"
      }`}
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
            {navLinks.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                className="group relative text-sm text-zinc-400 hover:text-white transition-colors"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-amber-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <Link
              href="/saved"
              className="group relative flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <path d="M3 2h9a1 1 0 011 1v10l-4.5-2.5L4 13V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
              Saved
              {savedCount > 0 && (
                <span className="rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold leading-none text-black">
                  {savedCount}
                </span>
              )}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-amber-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isGenerator ? (
            <>
              <Link
                href="/"
                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to home
              </Link>
              <Link href="/saved" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <path d="M3 2h9a1 1 0 011 1v10l-4.5-2.5L4 13V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                </svg>
                Saved
                {savedCount > 0 && (
                  <span className="rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold leading-none text-black">
                    {savedCount}
                  </span>
                )}
              </Link>
              {hasActiveSub && (
                <button
                  type="button"
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  className="text-sm text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  {portalLoading ? "Loading…" : "Manage Subscription"}
                </button>
              )}
              {isLoggedIn && (
                hasActiveSub ? (
                  <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-semibold text-black">
                    Pro
                  </span>
                ) : (
                  <Link
                    href="/pricing"
                    className="rounded-full bg-zinc-700 px-2.5 py-0.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-600 transition-colors"
                  >
                    Free
                  </Link>
                )
              )}
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Login
                </Link>
              )}
            </>
          ) : (
            <>
              {/* Mobile hamburger */}
              <button
                type="button"
                className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  {mobileOpen ? (
                    <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  ) : (
                    <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  )}
                </svg>
              </button>

              {/* Log in (desktop) */}
              <Link
                href="/login"
                className="hidden md:inline-flex items-center rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              >
                Log in
              </Link>

              {/* Try Free CTA */}
              <MotionLink
                href="/generate"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(251, 191, 36, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="hidden md:inline-flex items-center gap-1 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-amber-500 transition-colors"
              >
                Try Free <span aria-hidden="true">→</span>
              </MotionLink>
            </>
          )}
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {mobileOpen && !isGenerator && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-zinc-800 bg-black/95 md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  {label}
                </a>
              ))}
              <Link
                href="/saved"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
              >
                Saved
                {savedCount > 0 && (
                  <span className="rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold leading-none text-black">
                    {savedCount}
                  </span>
                )}
              </Link>
              <div className="mt-3 flex flex-col gap-2 border-t border-zinc-800 pt-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-zinc-700 px-4 py-2.5 text-center text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/generate"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-amber-400 px-4 py-2.5 text-center text-sm font-semibold text-black hover:bg-amber-500 transition-colors"
                >
                  Try Free →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
