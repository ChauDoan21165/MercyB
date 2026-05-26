/**
 * GET /api/v1/sentence-of-the-day
 *
 * Returns one approved sentence pair from `user_submitted_sentences`.
 * The choice is **daily-deterministic**: every caller worldwide gets
 * the same sentence on the same UTC date, so this endpoint can back
 * a "sentence of the day" widget on a partner app without each refresh
 * randomly cycling. Caching by date is therefore safe at the CDN layer.
 *
 * Privacy: NO submitter identity is exposed. Only the EN+VI pair plus
 * non-PII metadata (context, difficulty, the language-pair tag).
 */

import type { HandlerResponse, RequestContext } from "../index.ts";

type ApprovedSentenceRow = {
  id: string;
  en: string;
  vi: string;
  context: string | null;
  difficulty: string | null;
  suggested_l1_tag: string | null;
};

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

/**
 * Tiny FNV-1a 32-bit hash. Used to seed the daily index — we don't
 * need cryptographic randomness, just a stable shuffle keyed on the date.
 */
function fnv1a(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export async function handleSentenceOfTheDay(
  ctx: RequestContext,
): Promise<HandlerResponse> {
  if (ctx.request.method !== "GET") {
    return { status: 405, body: { error: "method_not_allowed" } };
  }

  const date = todayUtc();

  // Pull the candidate set — only approved rows, deterministic order.
  const { data, error } = await ctx.supabaseAdmin
    .from("user_submitted_sentences")
    .select("id, en, vi, context, difficulty, suggested_l1_tag")
    .eq("status", "approved")
    .order("id", { ascending: true });

  if (error) {
    return {
      status: 502,
      body: { error: "upstream_query_failed", detail: error.message },
    };
  }

  const rows = (data ?? []) as ApprovedSentenceRow[];
  if (rows.length === 0) {
    return {
      status: 503,
      body: { error: "no_approved_sentences_available", date },
    };
  }

  const idx = fnv1a(date) % rows.length;
  const pick = rows[idx];

  return {
    status: 200,
    body: {
      date,
      sentence: {
        id: pick.id,
        en: pick.en,
        vi: pick.vi,
        context: pick.context,
        difficulty: pick.difficulty,
        l1_tag: pick.suggested_l1_tag,
      },
      source: "MercyBlade — community-contributed, admin-verified",
    },
    headers: {
      // Encourage CDN/edge caching for the rest of the UTC day.
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  };
}
