import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const MAX_FIELD_LENGTH = 1000;
const REQUIRED_FIELDS = ["topic", "experience", "message", "audience"] as const;
const IS_DEV = process.env.NODE_ENV === "development";

// ── In-memory rate limiter ───────────────────────────────────────────────────
// Resets on server restart. Swap for Redis/KV when persistence is needed.
const DAILY_LIMIT = 3;
const WINDOW_MS = 24 * 60 * 60 * 1000;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= DAILY_LIMIT) return false;

  entry.count += 1;
  return true;
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
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Daily limit reached. You've used your 3 free generations for today." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { topic, experience, message, audience } = body as Record<string, unknown>;

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

    // Initialise client — throws a clear error if API key is missing/invalid
    const client = getAnthropicClient();

    const prompt = `You are an expert LinkedIn content strategist who writes viral posts using the SLAY Framework.

SLAY Framework:
- S = Strong Hook (first 2 lines stop the scroll — bold claim, surprising stat, or provocative question)
- L = Lesson or Insight (the key takeaway — clear and punchy)
- A = Action or Story (back it up with a real example or specific moment)
- Y = Your CTA (end with a subtle, non-pushy call to action)

Writing rules (strictly enforce all):
- Max 15 words per sentence
- Blank line between each idea block
- No corporate tone, no buzzwords, no fluff
- First 2 lines must be magnetic — they show before "see more"
- Conversational, direct, human voice
- Preserve line breaks with \\n\\n between paragraphs and \\n for single line breaks within a block

User inputs:
- Topic: ${(topic as string).trim()}
- Personal Experience: ${(experience as string).trim()}
- Main Message: ${(message as string).trim()}
- Target Audience: ${(audience as string).trim()}

Generate exactly TWO LinkedIn posts and return ONLY this JSON (no markdown, no extra text):

{
  "authorityPost": "...",
  "relatablePost": "..."
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
- Story-driven, warm, personal

Both posts must:
1. Follow SLAY Framework exactly
2. Be 180-280 words
3. Hook strongly in the first 2 lines
4. Use \\n\\n between paragraph blocks
5. End with a subtle, genuine CTA (not salesy)
6. Be LinkedIn-ready — copy-paste quality

Return ONLY the raw JSON object.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];

    if (content.type !== "text") {
      throw new Error("Unexpected response type from Anthropic API");
    }

    let parsed: { authorityPost: string; relatablePost: string };

    try {
      parsed = JSON.parse(content.text);
    } catch {
      // Strip markdown code fences if model wrapped the JSON
      const match = content.text.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error("Failed to parse AI response as JSON");
      }
      parsed = JSON.parse(match[0]);
    }

    if (
      typeof parsed.authorityPost !== "string" ||
      typeof parsed.relatablePost !== "string" ||
      parsed.authorityPost.trim().length === 0 ||
      parsed.relatablePost.trim().length === 0
    ) {
      throw new Error("Invalid response structure from AI");
    }

    return NextResponse.json({
      authorityPost: parsed.authorityPost.trim(),
      relatablePost: parsed.relatablePost.trim(),
    });
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
