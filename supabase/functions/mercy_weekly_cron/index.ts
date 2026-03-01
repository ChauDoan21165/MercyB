// supabase/functions/mercy_weekly_cron/index.ts
//
// Mercy Weekly Cron (idempotent) — Sunday 23:59 UTC recommended
// - Computes week_start/week_end in UTC (ISO week: Monday->Sunday)
// - Aggregates per-user metrics from your existing tables/views
// - Upserts into mb_weekly_snapshots (unique user_id+week_start)
// - Generates narrative via OpenAI and upserts into mb_progress_narratives
// - Uses SERVICE ROLE key so it can write under RLS
//
// Required env vars in Supabase:
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY
// - OPENAI_KEY
//
// Optional:
// - OPENAI_MODEL (default "gpt-4o-mini")

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

type WeekWindow = { week_start: string; week_end: string }; // YYYY-MM-DD

function toISODate(d: Date): string {
  // YYYY-MM-DD in UTC
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDaysUTC(d: Date, days: number): Date {
  const x = new Date(d.getTime());
  x.setUTCDate(x.getUTCDate() + days);
  return x;
}

// ISO week start (Monday 00:00 UTC)
function getIsoWeekWindowUTC(now = new Date()): WeekWindow {
  // normalize to UTC midnight
  const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dow = midnight.getUTCDay(); // 0=Sun..6=Sat

  // Convert so Monday is start:
  // If Sunday(0), go back 6 days; else go back (dow-1)
  const deltaToMonday = dow === 0 ? -6 : -(dow - 1);
  const monday = addDaysUTC(midnight, deltaToMonday);
  const sunday = addDaysUTC(monday, 6);

  return { week_start: toISODate(monday), week_end: toISODate(sunday) };
}

function jsonResponse(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

async function openaiNarrative(params: {
  apiKey: string;
  model: string;
  userId: string;
  week: WeekWindow;
  snapshot: any;
}) {
  const prompt = `
You are MERCY, a warm, sharp English tutor.
Write a short weekly progress narrative for the learner.

CONSTRAINTS:
- 5 to 9 sentences, plain text.
- Mention 1–2 concrete wins (what improved).
- Mention 1 focus for next week.
- End with ONE tiny next step (10–30 seconds).
- Do not mention internal tables, tokens, RLS, databases, etc.

WEEK:
${params.week.week_start} to ${params.week.week_end}

SNAPSHOT JSON (facts):
${JSON.stringify(params.snapshot, null, 2)}
`.trim();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${params.apiKey}`,
    },
    body: JSON.stringify({
      model: params.model,
      temperature: 0.4,
      messages: [
        { role: "system", content: "You write concise, supportive coaching narratives." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`OpenAI error ${res.status}: ${t.slice(0, 500)}`);
  }

  const json = await res.json();
  const text = String(json?.choices?.[0]?.message?.content ?? "").trim();
  return text;
}

serve(async (req) => {
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const OPENAI_KEY = Deno.env.get("OPENAI_KEY") ?? "";
    const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-4o-mini";

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return jsonResponse({ ok: false, error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" }, 500);
    }
    if (!OPENAI_KEY) {
      return jsonResponse({ ok: false, error: "Missing OPENAI_KEY" }, 500);
    }

    // Determine which week to write.
    // Default: current ISO week (Mon->Sun) in UTC.
    // If you ever want "previous complete week", you can pass {"previous_week": true}.
    let body: any = null;
    try {
      body = await req.json();
    } catch {
      body = null;
    }

    const now = new Date();
    let week = getIsoWeekWindowUTC(now);

    const previousWeek = Boolean(body?.previous_week);
    if (previousWeek) {
      const monday = new Date(`${week.week_start}T00:00:00Z`);
      const prevMonday = addDaysUTC(monday, -7);
      const prevSunday = addDaysUTC(prevMonday, 6);
      week = { week_start: toISODate(prevMonday), week_end: toISODate(prevSunday) };
    }

    const weekStartTs = `${week.week_start}T00:00:00Z`;
    const weekEndExclusiveTs = `${toISODate(addDaysUTC(new Date(`${week.week_start}T00:00:00Z`), 7))}T00:00:00Z`;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // 1) Find active users in that week (based on quality events or pron attempts).
    // You can widen this later.
    const { data: qeUsers } = await supabase
      .from("mb_ai_quality_events")
      .select("user_id")
      .gte("created_at", weekStartTs)
      .lt("created_at", weekEndExclusiveTs)
      .not("user_id", "is", null);

    const { data: paUsers } = await supabase
      .from("mb_pronunciation_attempts")
      .select("user_id")
      .gte("created_at", weekStartTs)
      .lt("created_at", weekEndExclusiveTs)
      .not("user_id", "is", null);

    const userSet = new Set<string>();
    for (const r of (qeUsers ?? []) as any[]) if (r?.user_id) userSet.add(String(r.user_id));
    for (const r of (paUsers ?? []) as any[]) if (r?.user_id) userSet.add(String(r.user_id));

    const users = Array.from(userSet.values());
    if (users.length === 0) {
      return jsonResponse({ ok: true, week, processed_users: 0, note: "No active users found for week." });
    }

    let snapshotsUpserted = 0;
    let narrativesUpserted = 0;
    const errors: Array<{ user_id: string; error: string }> = [];

    // 2) For each user compute metrics and upsert snapshot + narrative.
    for (const userId of users) {
      try {
        // VIP rank (optional)
        let vip_rank = 1;
        try {
          const { data: prof } = await supabase.from("profiles").select("vip_rank").eq("id", userId).maybeSingle();
          const v = Number((prof as any)?.vip_rank);
          if ([1, 2, 3, 4].includes(v)) vip_rank = v;
        } catch {}

        // Weekly aggregates (quality + usage + pron)
        // Use views if you created them; if not, we compute directly.
        const [{ data: qRow }, { data: uRow }, { data: pRow }] = await Promise.all([
          supabase
            .from("mb_v_quality_events_week")
            .select("*")
            .eq("user_id", userId)
            .eq("week_start", week.week_start)
            .maybeSingle(),
          supabase
            .from("mb_v_usage_week")
            .select("*")
            .eq("user_id", userId)
            .eq("week_start", week.week_start)
            .maybeSingle(),
          supabase
            .from("mb_v_pron_attempts_week")
            .select("*")
            .eq("user_id", userId)
            .eq("week_start", week.week_start)
            .maybeSingle(),
        ]);

        // Pronunciation improvement core (optional)
        const { data: improv } = await supabase
          .from("mb_v_pronunciation_improvement_core")
          .select("key_pattern, improvement_delta, improvement_pct")
          .eq("user_id", userId)
          .eq("week_start", week.week_start);

        // Build snapshot payload (store whatever columns your table actually has)
        // If your table has a jsonb column, you can store richer detail.
        const snapshot: any = {
          user_id: userId,
          vip_rank,
          week_start: week.week_start,
          week_end: week.week_end,

          // Quality
          total_events: Number((qRow as any)?.total_events ?? 0),
          json_valid_rate: (qRow as any)?.json_valid_rate ?? null,
          intent_match_rate: (qRow as any)?.intent_match_rate ?? null,
          has_next_action_rate: (qRow as any)?.has_next_action_rate ?? null,
          ask_back_rate: (qRow as any)?.ask_back_rate ?? null,

          // Usage
          prompt_tokens: Number((uRow as any)?.prompt_tokens ?? 0),
          completion_tokens: Number((uRow as any)?.completion_tokens ?? 0),
          total_tokens: Number((uRow as any)?.total_tokens ?? 0),

          // Pron attempts
          pron_attempts: Number((pRow as any)?.attempts ?? 0),
          pron_avg_score: (pRow as any)?.avg_overall_score ?? null,
          pron_avg_corrections: (pRow as any)?.avg_corrections_count ?? null,

          // Improvements (weakness proxy)
          pron_improvements: Array.isArray(improv)
            ? improv.map((r: any) => ({
                key_pattern: String(r.key_pattern ?? ""),
                improvement_delta: r.improvement_delta ?? null,
                improvement_pct: r.improvement_pct ?? null,
              }))
            : [],
        };

        // 2a) UPSERT snapshot (idempotent)
        const { error: snapErr } = await supabase
          .from("mb_weekly_snapshots")
          .upsert(snapshot, { onConflict: "user_id,week_start" });

        if (snapErr) throw new Error(`snapshot upsert failed: ${snapErr.message}`);
        snapshotsUpserted++;

        // 2b) Generate narrative text from snapshot
        const narrative_text = await openaiNarrative({
          apiKey: OPENAI_KEY,
          model: OPENAI_MODEL,
          userId,
          week,
          snapshot,
        });

        // 2c) UPSERT narrative (idempotent)
        const narrativeRow: any = {
          user_id: userId,
          week_start: week.week_start,
          week_end: week.week_end, // only works if column exists; harmless if it doesn't? (it would error)
          narrative_text,
        };

        // If mb_progress_narratives does NOT have week_end, remove it safely:
        // We'll try with week_end first, and if it errors, retry without week_end.
        let narErr: any = null;

        const r1 = await supabase.from("mb_progress_narratives").upsert(narrativeRow, {
          onConflict: "user_id,week_start",
        });

        narErr = r1.error;

        if (narErr) {
          // retry without week_end
          const { error: r2Err } = await supabase.from("mb_progress_narratives").upsert(
            {
              user_id: userId,
              week_start: week.week_start,
              narrative_text,
            },
            { onConflict: "user_id,week_start" },
          );
          if (r2Err) throw new Error(`narrative upsert failed: ${r2Err.message}`);
        }

        narrativesUpserted++;
      } catch (e) {
        errors.push({ user_id: userId, error: String((e as any)?.message ?? e) });
      }
    }

    return jsonResponse({
      ok: true,
      week,
      processed_users: users.length,
      snapshots_upserted: snapshotsUpserted,
      narratives_upserted: narrativesUpserted,
      errors,
    });
  } catch (e) {
    return jsonResponse({ ok: false, error: String((e as any)?.message ?? e) }, 500);
  }
});