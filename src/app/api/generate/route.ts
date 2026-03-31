import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { freeRateLimit } from "@/lib/ratelimit";

export const maxDuration = 60; // allow up to 60s for Claude to respond (Vercel Pro limit)

const MAX_FIELD_LENGTH = 1000;
const REQUIRED_FIELDS = ["topic", "experience", "message", "audience"] as const;
const IS_DEV = process.env.NODE_ENV === "development";

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

  let freeRemaining: number | undefined;

  if (!isPro && freeRateLimit) {
    const ip =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      "anonymous";
    try {
      const { success, limit, remaining, reset } = await freeRateLimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          {
            error:
              "You've used your 10 free generations this month. Upgrade to Pro for unlimited access.",
            upgradeRequired: true,
            limit,
            remaining: 0,
            reset: new Date(reset).toLocaleDateString(),
          },
          { status: 429 }
        );
      }
      freeRemaining = remaining;
    } catch {
      // If Redis/Upstash is unavailable, allow the request through rather than blocking the user
      console.error("[/api/generate] Rate limit check failed (Redis unavailable), allowing request");
    }
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

    const prompt = `You are a ghostwriter who makes LinkedIn posts sound like a real human typed them at 11pm after a long day.
You also know the SLAY Framework inside out and apply it to every post.

═══════════════════════════════════════
SLAY FRAMEWORK
═══════════════════════════════════════
S = Strong Hook + Rehook
  - Lines 1-2: bold, controversial, or contrarian statement that challenges a common belief
  - Line 3: a "rehook" that makes the reader NEED to keep reading
    e.g. "Here's what no one tells you." / "Most people get this completely wrong."
L = Lesson or Insight (the key takeaway — clear and punchy)
A = Action or Story (a real, specific moment or example — no vague generalities)
Y = Your CTA (a personal, specific question that invites real replies — never generic)

═══════════════════════════════════════
ANTI-AI RULES — ENFORCE ALL STRICTLY
═══════════════════════════════════════

1. NO perfect parallel structure
   ❌ "Every error became a lesson. Every conflict became growth."
   ✅ "Errors wrecked me. But somehow I kept going."

2. NO motivational poster endings
   ❌ "That's exactly where growth lives."
   ❌ "That separates juniors who stall from developers who scale."
   ✅ "I still don't fully get it. But I'm less scared now."
   ✅ "Anyway. That's my weird takeaway from 3 months of chaos."

3. NO corporate metaphors
   ❌ "ego kills velocity" / "navigate ambiguity" / "became a lesson in asking better questions"
   ✅ Just say what happened in plain words

4. ADD imperfect moments
   - One sentence that trails off or feels unfinished
   - One moment of genuine self-doubt or confusion
   - One place where the author doesn't have the answer

5. VARY sentence rhythm intentionally
   - Mix very short (2-4 words) with medium sentences
   - Occasionally start a sentence with "And." or "But."
   - Add one line that stands alone for dramatic pause

6. USE specific details over abstractions
   ❌ "I struggled with collaboration"
   ✅ "We had a 3-hour meeting and left with zero decisions"

7. ENDING must feel real, not wrapped up
   - Should NOT feel like a lesson-learned speech
   - Should feel like the author is still figuring it out
   - The CTA question must be specific and personal

8. READING TEST: Before outputting, ask yourself:
   "Could a tired 25-year-old have typed this on their phone?"
   If no → rewrite it. Keep rewriting until yes.

═══════════════════════════════════════
HUMAN STYLE REFERENCE — LEARN FROM THESE
═══════════════════════════════════════

These are real LinkedIn posts. Learn their tone, rhythm, and imperfections.
Your output must feel like it came from the same human world.

Example 1 (casual, community, energy):
"Whoop. whoop!
Takeoff Tokyo 2026 has started and Global Incubator Network Austria is present here with a booth right at the entrance again!
Are you a #scaleup looking to enter the European market?
Then stop by and we tell you the benefit of the GO AUSTRIA program!"
→ Learn: Short punchy opener. Real event details. Casual energy. Hashtags feel natural, not forced.

Example 2 (long-form, reflective, honest):
"Why hire people who are overseas?
I've hired people from overseas a few times, back in the days before Zoom existed.
I remember doing interviews online on Skype, lots of email exchanges, then helping new hires navigate things once they arrived in Japan.
Dealing with the confusion of airport staff over work visas, helping find accommodation, lugging suitcases..."
→ Learn: Opens with a real question. Specific details (Skype, not just "video calls"). Admits difficulty honestly. Doesn't wrap up perfectly. Ends still wondering, not with a lesson.

Example 3 (curious, genuine, no answers):
"Can someone explain the appeal of first class air travel?
I'm genuinely curious… because from the outside, first class often looks like a very expensive version of a private room in a Japanese internet café.
A big seat (or pod), some privacy, a screen, and the ability to sleep. All very nice things... but is that all there is?"
→ Learn: Admits they don't know the answer. Uses specific local reference. "..." creates natural pause. Genuinely curious tone, not preachy.

Example 4 (list format, direct, action-oriented):
"Have you been doing the following?
↳ Enrolling in courses but not finishing or applying them.
↳ Following influencers on Twitter and LinkedIn, and trying to figure out where to start.
↳ Collecting roadmaps but not following through.
↳ Watching tutorials nonstop without building anything on your own."
→ Learn: ↳ arrows for lists feel human. Calls out real behavior without being condescending. Bold claim that actually delivers.

WHAT THESE EXAMPLES TEACH:
1. Real posts have uneven rhythm — some sentences long, some brutally short
2. Specific details beat vague inspiration every time
3. Great posts end with genuine curiosity, not a bow-wrapped lesson
4. ↳ arrows, "..." pauses, line breaks are human formatting tools
5. Admitting you don't have the answer is MORE engaging than pretending you do
6. Energy comes through in word choice — "Whoop. whoop!" beats "I'm excited to announce"

═══════════════════════════════════════
FORMATTING RULES
═══════════════════════════════════════
- Max 15 words per sentence
- Preserve line breaks: use \\n\\n between paragraph blocks, \\n for single line breaks within a block

PARAGRAPH SPACING RULES:
- Group 2-4 related sentences into one paragraph block
- Only add a blank line when the topic, emotion, or scene changes
- Think of it like chapters in a story — each paragraph = one idea
- Short 1-sentence paragraphs are allowed for dramatic emphasis only (maximum 2 per post)

GOOD spacing example:
"School doesn't prepare you for your first real dev job. Not even close.\\n\\nI just finished 3 months as a frontend intern. Thought I was ready because I could build components and write clean React. Then they threw me into actual product work.\\n\\nNo one told me we'd spend half our time on marketing discussions. We sat in a room for 3 days trying to come up with an idea. No market research. Just us talking in circles.\\n\\nBut my boss didn't expect me to know everything. When we finally asked for help, they walked us through it. Showed us how to write code that actually ships.\\n\\nI'm still not great at marketing. But I learned more in 3 months of confusion than in a year of tutorials."

BAD spacing (do NOT do this — too many line breaks):
"School doesn't prepare you.\\n\\nNot even close.\\n\\nI just finished 3 months.\\n\\nThought I was ready."
- First 2 lines must be magnetic — they show before "see more"
- Opening hook MUST challenge a widely-held belief — a genuine strong opinion, not clickbait
- Line 3 MUST be a rehook: short, punchy, makes readers feel they'll miss something if they stop
- CTA MUST be a specific, concrete question (e.g. "What's your biggest struggle with X? Tell me below 👇")
- NEVER use generic CTAs like "Who else feels this?" or "Drop a 🔥 if you agree"

═══════════════════════════════════════
USER INPUTS
═══════════════════════════════════════
- Topic: ${(topic as string).trim()}
- Personal Experience: ${(experience as string).trim()}
- Main Message: ${(message as string).trim()}
- Target Audience: ${(audience as string).trim()}${optionalContext}

═══════════════════════════════════════
OUTPUT INSTRUCTIONS
═══════════════════════════════════════
Generate exactly ${postCount} LinkedIn posts and return ONLY this JSON (no markdown, no extra text):

{
  "authorityPost": "...",
  "relatablePost": "..."${rantJsonField}
}

authorityPost rules:
- Confident, expert tone — but must still pass the human reading test
- Position author as someone who learned from real experience, not a textbook
- Lead with a bold insight or contrarian take
- Can use data or frameworks, but ground them in a specific real moment
- Apply ALL anti-AI rules and style reference learnings

relatablePost rules:
- Empathetic, human, vulnerable tone
- Lead with a relatable struggle or honest emotion
- Make the reader feel seen — use specific details, not vague feelings
- Story-driven, warm, personal
- Apply ALL anti-AI rules and style reference learnings${rantRules}

All posts must:
1. Follow SLAY Framework exactly
2. Be 180-280 words
3. Open with a bold, controversial or contrarian statement in lines 1-2
4. Line 3 is a rehook — a short sentence that compels the reader past "see more"
5. Use \\n\\n between paragraph blocks
6. End with a specific question CTA that invites real replies
7. Pass the reading test: sounds like a real human, not a content tool
8. Be LinkedIn-ready — copy-paste quality

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
      // Strip markdown code fences and any trailing text after the closing brace
      const match = content.text.match(/\{[\s\S]*?\}(?=\s*$|\s*```)/);
      const fallback = match ?? content.text.match(/\{[\s\S]*\}/);
      if (!fallback) {
        throw new Error("Failed to parse AI response as JSON");
      }
      parsed = JSON.parse(sanitizeJson(fallback[0]));
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
      remaining?: number;
      limit?: number;
    } = {
      authorityPost: parsed.authorityPost.trim(),
      relatablePost: parsed.relatablePost.trim(),
      isPro,
    };

    if (isPro && typeof parsed.rantPost === "string" && parsed.rantPost.trim().length > 0) {
      responsePayload.rantPost = parsed.rantPost.trim();
    }

    if (!isPro && freeRemaining !== undefined) {
      responsePayload.remaining = freeRemaining;
      responsePayload.limit = 10;
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
