// supabase/functions/weekly_snapshots/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Optional: if you want GPT narratives
const OPENAI_KEY = Deno.env.get("OPENAI_KEY"); // store as secret

function isoWeekStart(d: Date) {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = x.getUTCDay() || 7; // 1..7 (Mon..Sun)
  x.setUTCDate(x.getUTCDate() - (day - 1));
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, days: number) {
  const x = new Date(d.getTime());
  x.setUTCDate(x.getUTCDate() + days);
  return x;
}

Deno.serve(async () => {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const now = new Date();
  const weekStart = isoWeekStart(addDays(now, -7)); // previous week start
  const weekEnd = addDays(weekStart, 7);

  // 1) get active users (you can change this selector)
  const { data: users, error: usersErr } = await supabase
    .from("mb_ai_quality_events")
    .select("user_id")
    .gte("created_at", weekStart.toISOString())
    .lt("created_at", weekEnd.toISOString());

  if (usersErr) return new Response(JSON.stringify({ error: usersErr.message }), { status: 500 });

  const userIds = Array.from(new Set((users ?? []).map((r: any) => r.user_id).filter(Boolean)));
  let written = 0;

  for (const user_id of userIds) {
    // Pronunciation attempts weekly stats
    const { data: attempts } = await supabase
      .from("mb_pronunciation_attempts")
      .select("overall_score, corrections_count, created_at")
      .eq("user_id", user_id)
      .gte("created_at", weekStart.toISOString())
      .lt("created_at", weekEnd.toISOString());

    const nAttempts = attempts?.length ?? 0;
    const avgScore =
      nAttempts > 0
        ? (attempts!.map((a: any) => Number(a.overall_score ?? 0)).reduce((a, b) => a + b, 0) / nAttempts)
        : null;
    const avgCorrections =
      nAttempts > 0
        ? (attempts!.map((a: any) => Number(a.corrections_count ?? 0)).reduce((a, b) => a + b, 0) / nAttempts)
        : null;

    // Trust/Confidence weekly stats
    const { data: trustRows } = await supabase
      .from("mb_ai_quality_events")
      .select("notes, created_at")
      .eq("user_id", user_id)
      .gte("created_at", weekStart.toISOString())
      .lt("created_at", weekEnd.toISOString());

    const parsed = (trustRows ?? []).map((r: any) => {
      const notes = String(r.notes ?? "");
      const qs = notes.match(/quality_score=([0-9]+)/)?.[1];
      const cf = notes.match(/confidence=([0-9.]+)/)?.[1];
      return { qs: qs ? Number(qs) : null, cf: cf ? Number(cf) : null };
    });

    const qsVals = parsed.map((p) => p.qs).filter((x) => typeof x === "number") as number[];
    const cfVals = parsed.map((p) => p.cf).filter((x) => typeof x === "number") as number[];

    const trustAvg = qsVals.length ? qsVals.reduce((a, b) => a + b, 0) / qsVals.length : null;
    const confAvg = cfVals.length ? cfVals.reduce((a, b) => a + b, 0) / cfVals.length : null;

    // Top weaknesses (current state; for true deltas add snapshots)
    const { data: weak } = await supabase
      .from("mb_user_weakness_profile")
      .select("category, key_pattern, frequency, last_seen")
      .eq("user_id", user_id)
      .order("frequency", { ascending: false })
      .limit(5);

    // Optional: store weekly weakness snapshot rows (recommended)
    // (This enables exact /θ/, /ð/ deltas week-over-week.)
    if (weak?.length) {
      const rows = weak.map((w: any) => ({
        user_id,
        snapshot_at: weekStart.toISOString().slice(0, 10),
        category: String(w.category ?? "pronunciation"),
        key_pattern: String(w.key_pattern ?? ""),
        frequency: Number(w.frequency ?? 0),
        last_seen: w.last_seen ?? null,
      }));
      await supabase.from("mb_user_weakness_snapshots").upsert(rows, {
        onConflict: "user_id,snapshot_at,category,key_pattern",
      });
    }

    // Narrative (simple deterministic template; you can replace with OpenAI later)
    const narrative =
      `Weekly check-in (${weekStart.toISOString().slice(0, 10)} → ${weekEnd.toISOString().slice(0, 10)}): ` +
      `${nAttempts} pronunciation attempts. ` +
      (avgScore === null ? "" : `Avg score: ${avgScore.toFixed(2)}. `) +
      (avgCorrections === null ? "" : `Avg corrections: ${avgCorrections.toFixed(1)}. `) +
      (trustAvg === null ? "" : `Trust: ${trustAvg.toFixed(0)}/100. `) +
      (confAvg === null ? "" : `Confidence: ${confAvg.toFixed(2)}. `) +
      (weak?.length ? `Top focus: ${weak.map((w: any) => w.key_pattern).slice(0, 3).join(", ")}.` : "");

    // Write snapshot
    const { error: upErr } = await supabase.from("mb_user_weekly_snapshots").upsert(
      {
        user_id,
        week_start: weekStart.toISOString().slice(0, 10),
        week_end: weekEnd.toISOString().slice(0, 10),
        pronunciation_attempts: nAttempts,
        avg_overall_score: avgScore,
        corrections_avg: avgCorrections,
        trust_avg: trustAvg,
        confidence_avg: confAvg,
        top_weaknesses: weak ?? [],
        emotion_mix: {}, // fill when you log emotion into quality events
        narrative,
      },
      { onConflict: "user_id,week_start" },
    );

    if (!upErr) written++;
  }

  return new Response(JSON.stringify({ ok: true, weekStart, weekEnd, users: userIds.length, written }), {
    headers: { "content-type": "application/json" },
  });
});