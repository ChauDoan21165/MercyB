// supabase/functions/weekly_mercy_snapshots/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import OpenAI from "https://esm.sh/openai@4.57.0";

function weekStartUTC(d = new Date()): string {
  // Monday-based week start using UTC
  const dt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = dt.getUTCDay(); // 0 Sun .. 6 Sat
  const diff = (day === 0 ? -6 : 1 - day); // shift to Monday
  dt.setUTCDate(dt.getUTCDate() + diff);
  return dt.toISOString().slice(0, 10); // YYYY-MM-DD
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00.000Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

serve(async (req) => {
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const OPENAI_KEY = Deno.env.get("OPENAI_KEY")!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const openai = new OpenAI({ apiKey: OPENAI_KEY });

    // Default: generate snapshot for the PREVIOUS week (so the week is complete)
    const now = new Date();
    const thisWeekStart = weekStartUTC(now);
    const week_start = addDays(thisWeekStart, -7);
    const week_end = addDays(week_start, 6);

    // 1) Generate snapshots in DB via RPC (single call)
    const { error: rpcErr } = await supabase.rpc("mb_generate_weekly_snapshots", { p_week_start: week_start });
    if (rpcErr) throw new Error(`RPC failed: ${rpcErr.message}`);

    // 2) Fetch snapshots we just generated
    const { data: snaps, error: snapErr } = await supabase
      .from("mb_weekly_snapshots")
      .select("*")
      .eq("week_start", week_start);

    if (snapErr) throw new Error(`Snapshot fetch failed: ${snapErr.message}`);
    const snapshots = Array.isArray(snaps) ? snaps : [];

    // 3) For each user, write a narrative
    // Keep it short + useful + motivational
    for (const s of snapshots) {
      const userId = String(s.user_id);
      const avgQ = Number(s.avg_quality_score ?? 0);
      const intent = Number(s.intent_match_rate ?? 0);
      const jsonV = Number(s.json_valid_rate ?? 0);
      const nextA = Number(s.has_next_action_rate ?? 0);
      const askB = Number(s.ask_back_rate ?? 0);
      const conf = Number(s.avg_confidence ?? 0);

      const trust = clamp(
        100
          - 30 * (1 - intent)
          - 35 * (1 - jsonV)
          - 15 * (1 - nextA)
          - 10 * (1 - askB)
          - 10 * (1 - Math.min(1, conf))
          - 10 * (1 - Math.min(1, avgQ / 100)),
        0,
        100,
      );

      const weaknessWeek = s.weakness_week_counts ?? {};
      const weaknessLife = s.weakness_counts ?? {};

      const prompt = `
You are MERCY. Write a weekly progress narrative for an English learner.

Week: ${week_start} to ${week_end}
Signals:
- sessions=${s.total_sessions}
- pronunciation_attempts=${s.pronunciation_attempts}
- avg_quality_score=${avgQ}
- avg_confidence=${conf}
- intent_match_rate=${intent}
- json_valid_rate=${jsonV}
- next_action_rate=${nextA}
- ask_back_rate=${askB}
- trust_score_estimate=${trust}

Weakness mentions this week (json): ${JSON.stringify(weaknessWeek).slice(0, 2000)}
Lifetime weakness counts (json): ${JSON.stringify(weaknessLife).slice(0, 2000)}

Output requirements:
- 120–220 words.
- Structure:
  1) 1-sentence summary of the week
  2) 2–3 bullet "Wins"
  3) 2 bullet "Focus next week" (pick the biggest patterns)
  4) End with ONE 10–30 second micro-task.
- Tone: supportive, specific, no shame.
`.trim();

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages: [{ role: "system", content: prompt }],
      });

      const narrative = completion.choices?.[0]?.message?.content?.trim() ?? "";
      if (!narrative) continue;

      // Upsert narrative (unique user_id + week_start)
      const { error: upErr } = await supabase
        .from("mb_progress_narratives")
        .upsert(
          { user_id: userId, week_start, narrative_text: narrative },
          { onConflict: "user_id,week_start" },
        );

      if (upErr) {
        // Don’t fail whole run for one user
        console.error("Narrative upsert failed:", userId, upErr.message);
      }

      // Optionally: persist trust_score into snapshots
      await supabase
        .from("mb_weekly_snapshots")
        .update({ trust_score: trust })
        .eq("user_id", userId)
        .eq("week_start", week_start);
    }

    return new Response(JSON.stringify({ ok: true, week_start, week_end, users: snapshots.length }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e?.message ?? e) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
});