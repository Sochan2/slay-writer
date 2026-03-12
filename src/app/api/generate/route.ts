import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_FIELD_LENGTH = 1000;
const REQUIRED_FIELDS = ["topic", "experience", "message", "audience"] as const;
const IS_DEV = process.env.NODE_ENV === "development";

// ── In-memory rate limiter ───────────────────────────────────────────────────
// Resets on server restart. Swap for Redis/KV when persistence is needed.
const MONTHLY_LIMIT = 10;
const WINDOW_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MONTHLY_LIMIT - 1 };
  }

  if (entry.count >= MONTHLY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: MONTHLY_LIMIT - entry.count };
}

// ────────────────────────────────────────────────────────────────────────────

/**
 * Lazily creates an Anthropic client per request.
 * Throws a clear, catch-able error when the API key is missing rather than
 * letting the SDK throw at module-initialisation time (outside try/catch).
 */
function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_anthropic_api_key_here") {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured. Create a .env.local file and add your key."
    );
  }
  return new Anthropic({ apiKey });
}

export async function POST(request: NextRequest) {
  // ── Subscription / rate-limit check ────────────────────────────────────────
  let isPro = false;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const admin = createAdminClient();
      const { data: sub } = await admin
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .in("status", ["active", "trialing"])
        .maybeSingle();
      isPro = !!sub;
    }
  } catch {
    // If Supabase is unavailable, fall back to free tier
    isPro = false;
  }

  if (!isPro) {
    const ip = getClientIp(request);
    const { allowed, remaining } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "You've used your 10 free generations this month. Upgrade to Pro for unlimited access.",
          upgradeRequired: true,
          remaining: 0,
        },
        { status: 429 }
      );
    }
    // Attach remaining count so the UI can show a counter
    void remaining;
  }
  // ───────────────────────────────────────────────────────────────────────────

  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { topic, experience, message, audience, numbers, frustration, postGoal } = body as Record<string, unknown>;

    // Presence check
    for (const field of REQUIRED_FIELDS) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field "${field}" is required.` },
          { status: 400 }
        );
      }
    }

    // Type + length validation
    const fields = { topic, experience, message, audience };
    for (const [key, value] of Object.entries(fields)) {
      if (typeof value !== "string") {
        return NextResponse.json(
          { error: `Field "${key}" must be a string.` },
          { status: 400 }
        );
      }
      if (value.trim().length === 0) {
        return NextResponse.json(
          { error: `Field "${key}" cannot be empty.` },
          { status: 400 }
        );
      }
      if (value.length > MAX_FIELD_LENGTH) {
        return NextResponse.json(
          { error: `Field "${key}" exceeds the 1000 character limit.` },
          { status: 400 }
        );
      }
    }

    // Validate optional fields (if provided)
    const optionalStringFields = { numbers, frustration };
    for (const [key, value] of Object.entries(optionalStringFields)) {
      if (value !== undefined && value !== "") {
        if (typeof value !== "string") {
          return NextResponse.json(
            { error: `Field "${key}" must be a string.` },
            { status: 400 }
          );
        }
        if (value.length > MAX_FIELD_LENGTH) {
          return NextResponse.json(
            { error: `Field "${key}" exceeds the 1000 character limit.` },
            { status: 400 }
          );
        }
      }
    }

    const VALID_GOALS = ["Get comments", "Get followers", "Get DMs", "Get saves"];
    if (postGoal && (typeof postGoal !== "string" || !VALID_GOALS.includes(postGoal))) {
      return NextResponse.json({ error: "Invalid postGoal value." }, { status: 400 });
    }

    // Build optional prompt context
    const optionalLines: string[] = [];
    if (numbers && typeof numbers === "string" && numbers.trim()) {
      optionalLines.push(`- Specific Numbers or Results: ${numbers.trim()}`);
    }
    if (frustration && typeof frustration === "string" && frustration.trim()) {
      optionalLines.push(`- What Frustrated/Surprised Them: ${frustration.trim()}`);
    }
    if (postGoal && typeof postGoal === "string") {
      optionalLines.push(`- Post Goal: ${postGoal} (optimise hook and CTA for this outcome)`);
    }
    const optionalContext = optionalLines.length ? "\n" + optionalLines.join("\n") : "";

    // Initialise client — throws a clear error if API key is missing/invalid
    const client = getAnthropicClient();

    const postCount = isPro ? "THREE" : "TWO";
    const rantJsonField = isPro ? `\n  "rantPost": "..."` : "";
    const rantRules = isPro
      ? `\n\nrantPost rules:\n- Raw, passionate, unapologetic hot-take\n- One strong controversial opinion stated with zero hedging\n- Confrontational but never aggressive — punchy, not mean\n- Maximum personality, zero corporate speak\n- Same SLAY structure but with completely unfiltered voice\n- Opens with a blunt "unpopular opinion" or "let's be honest" statement`
      : "";

    const prompt = `You are an expert LinkedIn content strategist who writes viral posts using the SLAY Framework.

SLAY Framework:
- S = Strong Hook + Rehook (first 3 lines: line 1-2 = bold controversial statement or contrarian opinion that challenges a common belief; line 3 = a "rehook" sentence that makes the reader NEED to keep reading, e.g. "Here's what no one tells you." / "Most people get this completely wrong.")
- L = Lesson or Insight (the key takeaway — clear and punchy)
- A = Action or Story (back it up with a real example or specific moment)
- Y = Your CTA (a specific question that invites comments — never generic)

Writing rules (strictly enforce all):
- Max 15 words per sentence
- Blank line between each idea block
- No corporate tone, no buzzwords, no fluff
- First 2 lines must be magnetic — they show before "see more"
- Conversational, direct, human voice
- Preserve line breaks with \\n\\n between paragraphs and \\n for single line breaks within a block
- Don't break into a new paragraph after every single sentence. Group 2-3 related sentences together before adding a line break. This creates natural reading rhythm, not robotic pacing. Only break when the topic genuinely shifts.
- Opening hook MUST be controversial or challenge a widely-held belief — a genuine strong opinion, not clickbait
- Line 3 MUST be a rehook: a short, punchy sentence that makes readers feel they'll miss something if they stop
- CTA MUST be a specific, concrete question about the topic (e.g. "What's your biggest struggle with X? Tell me below 👇") — NEVER use generic CTAs like "Who else feels this?" or "Drop a 🔥 if you agree"

User inputs:
- Topic: ${(topic as string).trim()}
- Personal Experience: ${(experience as string).trim()}
- Main Message: ${(message as string).trim()}
- Target Audience: ${(audience as string).trim()}${optionalContext}

Generate exactly ${postCount} LinkedIn posts and return ONLY this JSON (no markdown, no extra text):

{
  "authorityPost": "...",
  "relatablePost": "..."${rantJsonField}
}

authorityPost rules:
- Expert, confident, authoritative tone
- Position author as an industry leader
- Lead with a bold insight or contrarian take
- Data or framework-driven where possible

relatablePost rules:
- Empathetic, human, vulnerable tone
- Lead with a relatable struggle or honest emotion
- Make the reader feel seen
- Story-driven, warm, personal${rantRules}

All posts must:
1. Follow SLAY Framework exactly
2. Be 180-280 words
3. Open with a bold, controversial or contrarian statement in lines 1-2
4. Line 3 is a rehook — a short sentence that compels the reader past "see more"
5. Use \\n\\n between paragraph blocks
6. End with a specific question CTA that invites real replies (not a generic prompt)
7. Be LinkedIn-ready — copy-paste quality

Return ONLY the raw JSON object.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: isPro ? 3072 : 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];

    if (content.type !== "text") {
      throw new Error("Unexpected response type from Anthropic API");
    }

    let parsed: { authorityPost: string; relatablePost: string; rantPost?: string };

    // Escape literal newlines/tabs that appear inside JSON string values.
    // The model occasionally returns unescaped control characters which break JSON.parse.
    function sanitizeJson(text: string): string {
      let out = "";
      let inStr = false;
      let esc = false;
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (esc) { out += c; esc = false; continue; }
        if (c === "\\" && inStr) { out += c; esc = true; continue; }
        if (c === '"') { inStr = !inStr; out += c; continue; }
        if (inStr && c === "\n") { out += "\\n"; continue; }
        if (inStr && c === "\r") { out += "\\r"; continue; }
        if (inStr && c === "\t") { out += "\\t"; continue; }
        out += c;
      }
      return out;
    }

    try {
      parsed = JSON.parse(sanitizeJson(content.text));
    } catch {
      // Strip markdown code fences if model wrapped the JSON
      const match = content.text.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error("Failed to parse AI response as JSON");
      }
      parsed = JSON.parse(sanitizeJson(match[0]));
    }

    if (
      typeof parsed.authorityPost !== "string" ||
      typeof parsed.relatablePost !== "string" ||
      parsed.authorityPost.trim().length === 0 ||
      parsed.relatablePost.trim().length === 0
    ) {
      throw new Error("Invalid response structure from AI");
    }

    const responsePayload: {
      authorityPost: string;
      relatablePost: string;
      rantPost?: string;
      isPro: boolean;
    } = {
      authorityPost: parsed.authorityPost.trim(),
      relatablePost: parsed.relatablePost.trim(),
      isPro,
    };

    if (isPro && typeof parsed.rantPost === "string" && parsed.rantPost.trim().length > 0) {
      responsePayload.rantPost = parsed.rantPost.trim();
    }

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("[/api/generate] Error:", error);

    // Missing / placeholder API key (thrown by getAnthropicClient)
    if (
      error instanceof Error &&
      error.message.includes("ANTHROPIC_API_KEY is not configured")
    ) {
      return NextResponse.json(
        {
          error: IS_DEV
            ? "ANTHROPIC_API_KEY is not configured. Add it to .env.local and restart the dev server."
            : "Service is not configured. Please contact support.",
        },
        { status: 500 }
      );
    }

    // Anthropic SDK typed API errors (auth, rate-limit, overload, etc.)
    if (error instanceof Anthropic.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          {
            error: IS_DEV
              ? `Authentication failed (401). Check that ANTHROPIC_API_KEY in .env.local is correct.`
              : "API authentication failed. Please contact support.",
          },
          { status: 500 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: "Rate limit reached. Please wait a moment and try again." },
          { status: 429 }
        );
      }
      if (error.status === 529 || error.status === 503) {
        return NextResponse.json(
          { error: "The AI service is temporarily overloaded. Please try again shortly." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        error: IS_DEV && error instanceof Error
          ? `Generation failed: ${error.message}`
          : "Failed to generate posts. Please try again.",
      },
      { status: 500 }
    );
  }
}
