export interface SavedPost {
  id: string;
  topic: string;
  authorityPost: string;
  relatablePost: string;
  savedAt: string;
  type: "authority" | "relatable";
}

const LS_KEY = "slay_saved_posts";

export function getLocalSavedPosts(): SavedPost[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as SavedPost[]) : [];
  } catch {
    return [];
  }
}

export function savePostLocally(
  data: Omit<SavedPost, "id" | "savedAt">
): SavedPost {
  const post: SavedPost = {
    ...data,
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
  };
  const existing = getLocalSavedPosts();
  localStorage.setItem(LS_KEY, JSON.stringify([post, ...existing]));
  return post;
}

export function deleteLocalSavedPost(id: string): void {
  const posts = getLocalSavedPosts().filter((p) => p.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(posts));
}

export function getLocalSavedCount(): number {
  return getLocalSavedPosts().length;
}
