// supabase/functions/weekly-snapshots/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type SupabaseRow = Record<string, any>;

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

// Monday-start week in UTC
function startOfWeekUTC(d: Date) {
  const dt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = dt.getUTCDay(); // 0=Sun..6=Sat
  const diff = (day === 0 ? -6 : 1 - day); // shift to Monday
  dt.setUTCDate(dt.getUTCDate() + diff);
  return dt;
}

async function sbQuery(sql: string, params?: any) {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/mb_sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE,
      Authorization: `Bearer ${SERVICE_ROLE}`,
    },
    body: JSON.stringify({ sql, params: params ?? {} }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`sbQuery failed: ${res.status} ${txt}`);
  }
  return res.json();
}

/**
 * You need this RPC helper once:
 *
 * create or replace function public.mb_sql(sql text, params jsonb default '{}'::jsonb)
 * returns jsonb
 * language plpgsql
 * security definer
 * as $$
 * declare result jsonb;
 * begin
 *   execute sql into result;
 *   return result;
 * end;
 * $$;
 *
 * If you don't want an RPC, replace sbQuery() with direct REST queries.
 */

async function openaiNarrative(input: {
  vip_rank: number;
  week_start: string;
  attempts_count: number;
  avg_quality_score: number | null;
  focus_areas: any;
  deltas: any;
}) {
  const OPENAI_KEY = Deno.env.get("OPENAI_KEY");
  if (!OPENAI_KEY) return null;

  const depth =
    input.vip_rank <= 1 ? "short" : input.vip_rank === 2 ? "medium" : "high";

  const prompt = `
Write a weekly coaching narrative for an English learner.
Tone: warm, specific, motivating, not cheesy.
Length: ${depth === "short" ? "4-6 lines" : depth === "medium" ? "8-12 lines" : "12-18 lines"}.
Include:
- 1 headline sentence about the week
- 2 concrete wins (even small)
- 1 focus area for next week (based on weaknesses)
- 1 tiny 10–30s next action

Data:
week_start=${input.week_start}
attempts_count=${input.attempts_count}
avg_quality_score=${input.avg_quality_score}
focus_areas=${JSON.stringify(input.focus_areas)}
deltas=${JSON.stringify(input.deltas)}
`.trim();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: "You are MERCY, an elite English tutor." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    return null; // best-effort; don't fail the cron
  }

  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content ?? null;
  return typeof text === "string" ? text.trim() : null;
}

serve(async (_req) => {
  try {
    const now = new Date();
    const thisWeekStart = startOfWeekUTC(now);
    const lastWeekEnd = thisWeekStart;
    const lastWeekStart = new Date(lastWeekEnd);
    lastWeekStart.setUTCDate(lastWeekEnd.getUTCDate() - 7);

    const week_start = isoDate(lastWeekStart);
    const week_end = isoDate(lastWeekEnd);

    // 1) Active users last week (quality events is the cheapest “activity” source)
    const activeUsers: SupabaseRow[] = await sbQuery(`
      select jsonb_agg(t) from (
        select distinct user_id
        from public.mb_ai_quality_events
        where user_id is not null
          and created_at >= '${week_start}'::date
          and created_at <  '${week_end}'::date
      ) t;
    `);

    const arr = (activeUsers?.[0]?.jsonb_agg ?? []) as SupabaseRow[];
    const userIds = Array.isArray(arr) ? arr.map((x) => x.user_id).filter(Boolean) : [];

    let processed = 0;

    for (const user_id of userIds) {
      // 2) Pull vip_rank (best-effort)
      const vipRes: SupabaseRow[] = await sbQuery(`
        select to_jsonb(t) from (
          select coalesce(
            (select vip_rank from public.profiles where id = '${user_id}' limit 1),
            (select vip_rank from public.mb_user_profile where user_id = '${user_id}' limit 1),
            1
          ) as vip_rank
        ) t;
      `);
      const vip_rank = Number(vipRes?.[0]?.to_jsonb?.vip_rank ?? 1);

      // 3) Weekly aggregates from mb_ai_quality_events
      const qAgg: SupabaseRow[] = await sbQuery(`
        select to_jsonb(t) from (
          select
            count(*) as events,
            avg(quality_score)::numeric as avg_quality_score,
            avg(confidence)::numeric as avg_confidence,
            avg((intent_match)::int)::numeric as intent_match_rate,
            avg((json_valid)::int)::numeric as json_valid_rate,
            avg((ask_back_present)::int)::numeric as ask_back_rate,
            avg((has_next_action)::int)::numeric as next_action_rate
          from public.mb_ai_quality_events
          where user_id = '${user_id}'
            and created_at >= '${week_start}'::date
            and created_at <  '${week_end}'::date
        ) t;
      `);
      const q = qAgg?.[0]?.to_jsonb ?? {};
      const avg_quality_score = q.avg_quality_score === null ? null : Number(q.avg_quality_score);
      const avg_confidence = q.avg_confidence === null ? null : Number(q.avg_confidence);

      // 4) Pronunciation attempts count
      const aAgg: SupabaseRow[] = await sbQuery(`
        select to_jsonb(t) from (
          select
            count(*) as attempts_count,
            avg(corrections_count)::numeric as avg_corrections
          from public.mb_pronunciation_attempts
          where user_id = '${user_id}'
            and created_at >= '${week_start}'::date
            and created_at <  '${week_end}'::date
        ) t;
      `);
      const a = aAgg?.[0]?.to_jsonb ?? {};
      const attempts_count = Number(a.attempts_count ?? 0);

      // 5) Current focus areas from weakness profile (top 5)
      const wAgg: SupabaseRow[] = await sbQuery(`
        select jsonb_agg(t) from (
          select category, key_pattern, frequency, last_seen
          from public.mb_user_weakness_profile
          where user_id = '${user_id}'
          order by frequency desc nulls last, last_seen desc nulls last
          limit 5
        ) t;
      `);
      const top_weaknesses = (wAgg?.[0]?.jsonb_agg ?? []) as SupabaseRow[];
      const focus_areas = { top_weaknesses };

      // 6) Compare against previous snapshot for deltas
      const prevSnap: SupabaseRow[] = await sbQuery(`
        select to_jsonb(t) from (
          select *
          from public.mb_weekly_snapshots
          where user_id='${user_id}'
          order by week_start desc
          limit 1
        ) t;
      `);
      const prev = prevSnap?.[0]?.to_jsonb ?? null;

      // Very simple delta logic: compare previous avg_quality_score and attempts_count
      const deltas: any = {};
      if (prev) {
        const prevScore = prev.avg_quality_score === null ? null : Number(prev.avg_quality_score);
        const prevAttempts = Number(prev.attempts_count ?? 0);
        if (prevScore !== null && avg_quality_score !== null) {
          deltas.quality_score = {
            prev: prevScore,
            now: avg_quality_score,
            delta: Number((avg_quality_score - prevScore).toFixed(2)),
          };
        }
        deltas.attempts = {
          prev: prevAttempts,
          now: attempts_count,
          delta: attempts_count - prevAttempts,
        };
      }

      // 7) Generate narrative (best-effort)
      const narrative_text = await openaiNarrative({
        vip_rank,
        week_start,
        attempts_count,
        avg_quality_score,
        focus_areas,
        deltas,
      });

      // 8) Upsert into mb_weekly_snapshots
      const payload = {
        user_id,
        week_start,
        week_end,
        vip_rank,
        attempts_count,
        avg_quality_score,
        avg_confidence,
        intent_match_rate: q.intent_match_rate === null ? null : Number(q.intent_match_rate),
        json_valid_rate: q.json_valid_rate === null ? null : Number(q.json_valid_rate),
        ask_back_rate: q.ask_back_rate === null ? null : Number(q.ask_back_rate),
        next_action_rate: q.next_action_rate === null ? null : Number(q.next_action_rate),
        focus_areas,
        deltas,
        narrative_text,
      };

      // Use SQL upsert
      await sbQuery(`
        select to_jsonb(t) from (
          insert into public.mb_weekly_snapshots (
            user_id, week_start, week_end, vip_rank,
            attempts_count, avg_quality_score, avg_confidence,
            intent_match_rate, json_valid_rate, ask_back_rate, next_action_rate,
            focus_areas, deltas, narrative_text
          )
          values (
            '${payload.user_id}'::uuid,
            '${payload.week_start}'::date,
            '${payload.week_end}'::date,
            ${payload.vip_rank},
            ${payload.attempts_count},
            ${payload.avg_quality_score === null ? "null" : payload.avg_quality_score},
            ${payload.avg_confidence === null ? "null" : payload.avg_confidence},
            ${payload.intent_match_rate === null ? "null" : payload.intent_match_rate},
            ${payload.json_valid_rate === null ? "null" : payload.json_valid_rate},
            ${payload.ask_back_rate === null ? "null" : payload.ask_back_rate},
            ${payload.next_action_rate === null ? "null" : payload.next_action_rate},
            '${JSON.stringify(payload.focus_areas).replaceAll("'", "''")}'::jsonb,
            '${JSON.stringify(payload.deltas).replaceAll("'", "''")}'::jsonb,
            ${payload.narrative_text ? `'${payload.narrative_text.replaceAll("'", "''")}'` : "null"}
          )
          on conflict (user_id, week_start)
          do update set
            week_end = excluded.week_end,
            vip_rank = excluded.vip_rank,
            attempts_count = excluded.attempts_count,
            avg_quality_score = excluded.avg_quality_score,
            avg_confidence = excluded.avg_confidence,
            intent_match_rate = excluded.intent_match_rate,
            json_valid_rate = excluded.json_valid_rate,
            ask_back_rate = excluded.ask_back_rate,
            next_action_rate = excluded.next_action_rate,
            focus_areas = excluded.focus_areas,
            deltas = excluded.deltas,
            narrative_text = excluded.narrative_text
          returning *
        ) t;
      `);

      // Optional: keep a separate narratives feed table
      if (narrative_text) {
        await sbQuery(`
          select to_jsonb(t) from (
            insert into public.mb_progress_narratives (user_id, week_start, narrative_text, metrics)
            values (
              '${user_id}'::uuid,
              '${week_start}'::date,
              '${narrative_text.replaceAll("'", "''")}',
              '${JSON.stringify(payload).replaceAll("'", "''")}'::jsonb
            )
            on conflict (user_id, week_start)
            do update set
              narrative_text = excluded.narrative_text,
              metrics = excluded.metrics
            returning 1
          ) t;
        `);
      }

      processed++;
    }

    return new Response(JSON.stringify({ ok: true, week_start, week_end, users: userIds.length, processed }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});