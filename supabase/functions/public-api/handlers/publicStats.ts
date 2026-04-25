/**
 * GET /api/v1/public-stats
 *
 * Returns aggregate counts only — no PII, no per-user data, no
 * room-level details. Intended for partner-app dashboards or
 * developer-portal pages that want to show "MercyBlade community
 * is active".
 *
 * Three numbers:
 *   - total_users:           count of profile rows
 *   - lessons_completed_today: rows in user_room_progress with
 *                              progress_pct = 1.0 and completed_at within
 *                              the current UTC day
 *   - sentences_contributed:  approved rows in user_submitted_sentences
 *
 * Cached at the CDN layer for 5 minutes — these numbers don't need to
 * be precise, just trending. Cuts DB load for popular dashboards.
 */

import type { HandlerResponse, RequestContext } from "../index.ts";

function startOfUtcDay(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function handlePublicStats(
  ctx: RequestContext,
): Promise<HandlerResponse> {
  if (ctx.request.method !== "GET") {
    return { status: 405, body: { error: "method_not_allowed" } };
  }

  const since = startOfUtcDay();

  // Issue all three count queries in parallel — they're independent.
  // Each uses { count: 'exact', head: true } so Postgres returns just
  // the count without serializing rows.
  const [usersRes, lessonsRes, sentencesRes] = await Promise.all([
    ctx.supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true }),
    ctx.supabaseAdmin
      .from("user_room_progress")
      .select("*", { count: "exact", head: true })
      .gte("progress_pct", 1.0)
      .gte("last_seen_at", since),
    ctx.supabaseAdmin
      .from("user_submitted_sentences")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),
  ]);

  // Treat any individual query failure as a partial response — return
  // whatever counts we got, mark the failures with `null` so the partner
  // can render gracefully.
  const total_users = usersRes.error ? null : usersRes.count ?? 0;
  const lessons_completed_today = lessonsRes.error
    ? null
    : lessonsRes.count ?? 0;
  const sentences_contributed = sentencesRes.error
    ? null
    : sentencesRes.count ?? 0;

  return {
    status: 200,
    body: {
      generated_at: new Date().toISOString(),
      since_utc_midnight: since,
      total_users,
      lessons_completed_today,
      sentences_contributed,
    },
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  };
}
