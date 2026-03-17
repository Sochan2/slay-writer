"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";
import {
  getLocalSavedPosts,
  deleteLocalSavedPost,
} from "@/lib/savedPosts";

type FilterTab = "all" | "authority" | "relatable";

interface DisplayPost {
  id: string;
  topic: string;
  content: string;
  type: "authority" | "relatable";
  savedAt: string;
  supabaseId?: string;
  localId?: string;
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function SavedPage() {
  const [posts, setPosts] = useState<DisplayPost[]>([]);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showGuestBanner, setShowGuestBanner] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setIsLoggedIn(true);
      const { data } = await supabase
        .from("saved_posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        const display: DisplayPost[] = [];
        for (const row of data) {
          display.push({
            id: `${row.id}-authority`,
            topic: row.topic,
            content: row.authority_post,
            type: "authority",
            savedAt: row.created_at,
            supabaseId: row.id,
          });
          display.push({
            id: `${row.id}-relatable`,
            topic: row.topic,
            content: row.relatable_post,
            type: "relatable",
            savedAt: row.created_at,
            supabaseId: row.id,
          });
        }
        setPosts(display);
      }
    } else {
      setIsLoggedIn(false);
      const local = getLocalSavedPosts();
      setPosts(
        local.map((p) => ({
          id: p.id,
          topic: p.topic,
          content: p.type === "authority" ? p.authorityPost : p.relatablePost,
          type: p.type,
          savedAt: p.savedAt,
          localId: p.id,
        }))
      );
    }

    setLoading(false);
  }

  const filteredPosts =
    filter === "all" ? posts : posts.filter((p) => p.type === filter);

  async function handleDelete(post: DisplayPost) {
    if (post.supabaseId) {
      const supabase = createClient();
      await supabase.from("saved_posts").delete().eq("id", post.supabaseId);
      setPosts((prev) => prev.filter((p) => p.supabaseId !== post.supabaseId));
    } else if (post.localId) {
      deleteLocalSavedPost(post.localId);
      setPosts((prev) => prev.filter((p) => p.localId !== post.localId));
    }
  }

  async function handleCopy(post: DisplayPost) {
    try {
      await navigator.clipboard.writeText(post.content);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = post.content;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">Saved Posts</h1>
          {filteredPosts.length > 0 && (
            <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-bold text-black">
              {filteredPosts.length}
            </span>
          )}
        </div>

        {/* Guest banner */}
        {!isLoggedIn && !loading && showGuestBanner && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-amber-700 bg-amber-950/30 px-4 py-3 text-sm text-amber-300">
            <span>
              ☁️ Posts saved locally only.{" "}
              <Link
                href="/login"
                className="font-semibold text-amber-400 underline-offset-2 hover:underline"
              >
                Sign in with Google →
              </Link>{" "}
              to sync across devices.
            </span>
            <button
              type="button"
              onClick={() => setShowGuestBanner(false)}
              className="shrink-0 text-amber-600 transition-colors hover:text-amber-400"
              aria-label="Dismiss"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 2l10 10M12 2L2 12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Filter tabs */}
        <div className="mb-6 flex gap-2">
          {(["all", "authority", "relatable"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                filter === tab
                  ? "bg-amber-400 text-black"
                  : "border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
              }`}
            >
              {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-zinc-900"
              />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="mb-3 text-zinc-400">No saved posts yet.</p>
            <Link
              href="/generate"
              className="text-sm font-semibold text-amber-400 underline-offset-2 hover:underline"
            >
              Generate your first post →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const isExpanded = expandedIds.has(post.id);
              const preview =
                post.content.slice(0, 100) +
                (post.content.length > 100 ? "..." : "");

              return (
                <div
                  key={post.id}
                  className={`overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 border-t-2 ${
                    post.type === "authority"
                      ? "border-t-amber-400"
                      : "border-t-emerald-500"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(post.id)}
                    className="w-full px-5 py-4 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              post.type === "authority"
                                ? "bg-amber-900/50 text-amber-400 ring-1 ring-amber-700"
                                : "bg-emerald-900/50 text-emerald-400 ring-1 ring-emerald-700"
                            }`}
                          >
                            {post.type === "authority" ? "Authority" : "Relatable"}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {timeAgo(post.savedAt)}
                          </span>
                        </div>
                        <p className="truncate text-sm font-medium text-white">
                          {post.topic}
                        </p>
                        {!isExpanded && (
                          <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
                            {preview}
                          </p>
                        )}
                      </div>
                      <svg
                        className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 6l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-zinc-800 px-5 pb-4 pt-3">
                      <pre className="mb-4 whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-200">
                        {post.content}
                      </pre>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(post)}
                          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            copiedId === post.id
                              ? "bg-emerald-600 text-white"
                              : "bg-amber-400 text-black hover:bg-amber-500"
                          }`}
                        >
                          {copiedId === post.id ? "✓ Copied!" : "Copy"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(post)}
                          className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-red-800 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
