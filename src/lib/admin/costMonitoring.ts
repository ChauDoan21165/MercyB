/**
 * Cost monitoring — pure aggregation + Supabase fetchers.
 *
 * Why this module exists: MercyBlade's costs are spread across providers
 * (OpenAI/Gemini for Mercy chat, ElevenLabs for TTS, Resend for emails,
 * Azure Speech for phoneme analysis). Each writes to its own telemetry
 * table. Without a unified daily roll-up, Chau can't tell whether pricing
 * is sustainable or which feature flag to flip dark when costs spike.
 *
 * Design rules:
 *   1. Aggregation is **pure** — `aggregate*` functions take rows in and
 *      emit { date, vnd_cost, breakdown } out. Easy to unit-test, no
 *      Supabase coupling.
 *   2. Fetchers are thin wrappers that pull rows from existing tables and
 *      call the matching aggregator. NO new tracking columns; NO new
 *      tables. Existing telemetry is the source of truth.
 *   3. USD→VND uses a fixed `DEFAULT_USD_VND_RATE` injected as a default
 *      argument. Callers can pass a fresher rate (cached up to 24h by the
 *      page) without touching this file.
 *   4. Bilingual labels ride on every category constant so the UI does
 *      not have to translate at render time.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

// ─── Constants ──────────────────────────────────────────────────────────

/** Default USD→VND rate. Roughly mid-2026 mid-market. Caller may override. */
export const DEFAULT_USD_VND_RATE = 25_000;

/**
 * Per-unit USD prices. Values are mid-tier list prices and intentionally
 * conservative — actual invoices can be lower (free tier, volume credit).
 * The point is "is this sustainable?", not "match Stripe to the cent".
 */
export const PRICING_USD = {
  /** ElevenLabs Creator plan: ~$0.00018/char (≈ $22/100k chars). */
  elevenlabs_per_char: 0.00018,
  /** Resend paid plan: $20 per 50k emails = $0.0004/email. */
  resend_per_email: 0.0004,
  /**
   * Azure Speech-to-Text: ~$1 per audio hour. speech_attempts has no
   * duration column, so we estimate 3 seconds per attempt (typical
   * single-line read-aloud) → $0.000833 per attempt.
   */
  azure_per_attempt: (1 / 3600) * 3,
} as const;

/** Bilingual category labels surfaced in tables, charts, CSVs. */
export const COST_CATEGORY_LABELS = {
  openai: { en: "Mercy chat (OpenAI / Gemini)", vi: "Mercy chat (OpenAI / Gemini)" },
  elevenlabs: { en: "ElevenLabs TTS", vi: "Giọng nói ElevenLabs" },
  resend: { en: "Email (Resend)", vi: "Email (Resend)" },
  azure: { en: "Speech analysis (Azure)", vi: "Phân tích phát âm (Azure)" },
} as const;

export type CostCategory = keyof typeof COST_CATEGORY_LABELS;

// ─── Output shape (used everywhere) ────────────────────────────────────

export interface DailyCostPoint {
  /** ISO date YYYY-MM-DD (UTC). */
  date: string;
  /** Total VND for the day across the relevant categories. */
  vnd_cost: number;
  /** Per-category breakdown for the day. */
  breakdown: Partial<Record<CostCategory, number>>;
}

// ─── Pure aggregators ──────────────────────────────────────────────────

const DAY_MS = 86_400_000;

/** YYYY-MM-DD bucket from a timestamptz string (UTC). */
export function utcDayKey(ts: string | null | undefined): string | null {
  if (!ts) return null;
  // Trust the input format. Anything not parseable returns null.
  const t = new Date(ts).getTime();
  if (Number.isNaN(t)) return null;
  return new Date(t).toISOString().slice(0, 10);
}

/**
 * Build a sorted list of YYYY-MM-DD keys covering [now - days + 1, now].
 * Used to fill zero-rows on quiet days so charts and CSVs never have
 * gaps that visually under-state spend.
 */
export function utcDateRange(now: Date, days: number): string[] {
  const out: string[] = [];
  const startMs = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(startMs - i * DAY_MS);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export interface OpenAiUsageRow {
  estimated_cost_vnd: number | null;
  created_at: string;
  feature?: string | null;
  user_id?: string | null;
}

/**
 * OpenAI/Gemini cost is already stored in VND on every ai_usage_logs row
 * (the chat function records the converted amount at write time). Sum
 * per UTC day.
 */
export function aggregateOpenAi(
  rows: OpenAiUsageRow[],
  now: Date,
  days: number,
): DailyCostPoint[] {
  const byDay = new Map<string, number>();
  for (const r of rows) {
    const day = utcDayKey(r.created_at);
    if (!day) continue;
    byDay.set(day, (byDay.get(day) ?? 0) + Number(r.estimated_cost_vnd ?? 0));
  }
  return utcDateRange(now, days).map((date) => {
    const vnd = Math.round(byDay.get(date) ?? 0);
    return { date, vnd_cost: vnd, breakdown: { openai: vnd } };
  });
}

export interface TtsUsageRow {
  text_length: number | null;
  created_at: string;
  user_id?: string | null;
}

/**
 * ElevenLabs charges per character. mercy_tts_usage logs only cache MISSES
 * (cache hits cost nothing — the file is replayed from storage). Multiply
 * total chars × price-per-char × FX.
 */
export function aggregateElevenLabs(
  rows: TtsUsageRow[],
  now: Date,
  days: number,
  usdVndRate: number = DEFAULT_USD_VND_RATE,
): DailyCostPoint[] {
  const byDay = new Map<string, number>();
  for (const r of rows) {
    const day = utcDayKey(r.created_at);
    if (!day) continue;
    const chars = Math.max(0, Number(r.text_length ?? 0));
    const usd = chars * PRICING_USD.elevenlabs_per_char;
    byDay.set(day, (byDay.get(day) ?? 0) + usd * usdVndRate);
  }
  return utcDateRange(now, days).map((date) => {
    const vnd = Math.round(byDay.get(date) ?? 0);
    return { date, vnd_cost: vnd, breakdown: { elevenlabs: vnd } };
  });
}

export interface ResendSendRow {
  status: string;
  scheduled_at: string;
  sent_at: string | null;
}

/**
 * Resend cost is per email *sent* (not queued / not failed). Use sent_at
 * when present, else scheduled_at (skipped or pending rows are filtered
 * out so they don't count toward spend).
 */
export function aggregateResend(
  rows: ResendSendRow[],
  now: Date,
  days: number,
  usdVndRate: number = DEFAULT_USD_VND_RATE,
): DailyCostPoint[] {
  const byDay = new Map<string, number>();
  for (const r of rows) {
    if (r.status !== "sent") continue;
    const day = utcDayKey(r.sent_at ?? r.scheduled_at);
    if (!day) continue;
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }
  return utcDateRange(now, days).map((date) => {
    const count = byDay.get(date) ?? 0;
    const usd = count * PRICING_USD.resend_per_email;
    const vnd = Math.round(usd * usdVndRate);
    return { date, vnd_cost: vnd, breakdown: { resend: vnd } };
  });
}

export interface SpeechAttemptRow {
  created_at: string;
  user_id?: string | null;
}

/**
 * Azure Speech-to-Text: estimate per-attempt cost (3 sec average).
 * speech_attempts has no duration column, so this is a deliberate
 * over-estimate — better than under-counting and surprising Chau.
 */
export function aggregateAzure(
  rows: SpeechAttemptRow[],
  now: Date,
  days: number,
  usdVndRate: number = DEFAULT_USD_VND_RATE,
): DailyCostPoint[] {
  const byDay = new Map<string, number>();
  for (const r of rows) {
    const day = utcDayKey(r.created_at);
    if (!day) continue;
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }
  return utcDateRange(now, days).map((date) => {
    const count = byDay.get(date) ?? 0;
    const usd = count * PRICING_USD.azure_per_attempt;
    const vnd = Math.round(usd * usdVndRate);
    return { date, vnd_cost: vnd, breakdown: { azure: vnd } };
  });
}

/** Combine per-category daily series into one merged series. */
export function combineDailyCosts(
  series: Array<DailyCostPoint[]>,
): DailyCostPoint[] {
  const merged = new Map<string, DailyCostPoint>();
  for (const arr of series) {
    for (const point of arr) {
      const cur = merged.get(point.date) ?? {
        date: point.date,
        vnd_cost: 0,
        breakdown: {},
      };
      cur.vnd_cost += point.vnd_cost;
      cur.breakdown = { ...cur.breakdown, ...point.breakdown };
      merged.set(point.date, cur);
    }
  }
  return Array.from(merged.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

// ─── Per-user analysis ──────────────────────────────────────────────────

export interface UserCostRow {
  user_id: string;
  vnd_cost: number;
  breakdown: Partial<Record<CostCategory, number>>;
}

/**
 * Top-N most expensive users for the given month-window. Uses the same
 * raw rows the daily aggregators consume so totals reconcile.
 */
export function topUsersByCost(
  openaiRows: OpenAiUsageRow[],
  ttsRows: TtsUsageRow[],
  azureRows: SpeechAttemptRow[],
  options: { topN?: number; usdVndRate?: number } = {},
): UserCostRow[] {
  const topN = options.topN ?? 10;
  const usdVndRate = options.usdVndRate ?? DEFAULT_USD_VND_RATE;
  const totals = new Map<string, UserCostRow>();

  const bump = (
    user_id: string | null | undefined,
    category: CostCategory,
    vnd: number,
  ) => {
    if (!user_id) return;
    if (vnd <= 0) return;
    const cur =
      totals.get(user_id) ??
      ({ user_id, vnd_cost: 0, breakdown: {} } as UserCostRow);
    cur.vnd_cost += vnd;
    cur.breakdown[category] = (cur.breakdown[category] ?? 0) + vnd;
    totals.set(user_id, cur);
  };

  for (const r of openaiRows) {
    bump(r.user_id, "openai", Number(r.estimated_cost_vnd ?? 0));
  }
  for (const r of ttsRows) {
    const usd = Math.max(0, Number(r.text_length ?? 0)) * PRICING_USD.elevenlabs_per_char;
    bump(r.user_id, "elevenlabs", usd * usdVndRate);
  }
  for (const r of azureRows) {
    bump(r.user_id, "azure", PRICING_USD.azure_per_attempt * usdVndRate);
  }

  return Array.from(totals.values())
    .map((u) => ({
      ...u,
      vnd_cost: Math.round(u.vnd_cost),
      breakdown: Object.fromEntries(
        Object.entries(u.breakdown).map(([k, v]) => [k, Math.round(v ?? 0)]),
      ) as UserCostRow["breakdown"],
    }))
    .sort((a, b) => b.vnd_cost - a.vnd_cost)
    .slice(0, topN);
}

// ─── Forecast ──────────────────────────────────────────────────────────

/**
 * Project monthly spend from a window of recent daily totals. Uses the
 * average of the **last `windowDays`** days × 30 — simple and easy to
 * explain. Empty input → 0 (no false-precision forecast).
 */
export function forecastMonthlyVnd(
  daily: DailyCostPoint[],
  windowDays = 7,
): number {
  if (daily.length === 0) return 0;
  const tail = daily.slice(-windowDays);
  const avg = tail.reduce((a, p) => a + p.vnd_cost, 0) / tail.length;
  return Math.round(avg * 30);
}

// ─── CSV ────────────────────────────────────────────────────────────────

/**
 * Serialize a DailyCostPoint array to RFC-4180 CSV. Columns in fixed
 * order so monthly bookkeeping diffs stay readable across exports.
 */
export function toCsv(points: DailyCostPoint[]): string {
  const header = [
    "date",
    "openai_vnd",
    "elevenlabs_vnd",
    "resend_vnd",
    "azure_vnd",
    "total_vnd",
  ].join(",");
  const lines = points.map((p) => {
    const o = p.breakdown.openai ?? 0;
    const e = p.breakdown.elevenlabs ?? 0;
    const r = p.breakdown.resend ?? 0;
    const a = p.breakdown.azure ?? 0;
    const total = p.vnd_cost || o + e + r + a;
    return [p.date, o, e, r, a, total].join(",");
  });
  return [header, ...lines].join("\r\n") + "\r\n";
}

// ─── Supabase fetchers ─────────────────────────────────────────────────

function isoDaysAgo(now: Date, days: number): string {
  return new Date(now.getTime() - days * DAY_MS).toISOString();
}

export async function getOpenAiTokenUsageByDay(
  supabase: SupabaseClient,
  days: number,
  now: Date = new Date(),
): Promise<DailyCostPoint[]> {
  const { data, error } = await supabase
    .from("ai_usage_logs")
    .select("estimated_cost_vnd, created_at, feature, user_id")
    .gte("created_at", isoDaysAgo(now, days));
  if (error) throw new Error(`ai_usage_logs query failed: ${error.message}`);
  return aggregateOpenAi((data ?? []) as OpenAiUsageRow[], now, days);
}

export async function getElevenLabsCostsByDay(
  supabase: SupabaseClient,
  days: number,
  now: Date = new Date(),
  usdVndRate: number = DEFAULT_USD_VND_RATE,
): Promise<DailyCostPoint[]> {
  const { data, error } = await supabase
    .from("mercy_tts_usage")
    .select("text_length, created_at, user_id")
    .gte("created_at", isoDaysAgo(now, days));
  if (error) throw new Error(`mercy_tts_usage query failed: ${error.message}`);
  return aggregateElevenLabs((data ?? []) as TtsUsageRow[], now, days, usdVndRate);
}

export async function getResendEmailCountByDay(
  supabase: SupabaseClient,
  days: number,
  now: Date = new Date(),
  usdVndRate: number = DEFAULT_USD_VND_RATE,
): Promise<DailyCostPoint[]> {
  const { data, error } = await supabase
    .from("email_sends_log")
    .select("status, scheduled_at, sent_at")
    .gte("scheduled_at", isoDaysAgo(now, days));
  if (error) throw new Error(`email_sends_log query failed: ${error.message}`);
  return aggregateResend((data ?? []) as ResendSendRow[], now, days, usdVndRate);
}

export async function getAzurePhonemeCallsByDay(
  supabase: SupabaseClient,
  days: number,
  now: Date = new Date(),
  usdVndRate: number = DEFAULT_USD_VND_RATE,
): Promise<DailyCostPoint[]> {
  const { data, error } = await supabase
    .from("speech_attempts")
    .select("created_at, user_id")
    .gte("created_at", isoDaysAgo(now, days));
  if (error) throw new Error(`speech_attempts query failed: ${error.message}`);
  return aggregateAzure((data ?? []) as SpeechAttemptRow[], now, days, usdVndRate);
}

/**
 * Single entrypoint for the dashboard. Returns one merged daily series
 * over the requested window plus the per-user top-list.
 */
export async function getTotalDailyCost(
  supabase: SupabaseClient,
  days: number,
  options: { now?: Date; usdVndRate?: number; topN?: number } = {},
): Promise<{
  daily: DailyCostPoint[];
  topUsers: UserCostRow[];
  forecast_monthly_vnd: number;
}> {
  const now = options.now ?? new Date();
  const usdVndRate = options.usdVndRate ?? DEFAULT_USD_VND_RATE;
  const topN = options.topN ?? 10;

  const since = isoDaysAgo(now, days);

  const [openai, tts, resend, azure] = await Promise.all([
    supabase
      .from("ai_usage_logs")
      .select("estimated_cost_vnd, created_at, feature, user_id")
      .gte("created_at", since),
    supabase
      .from("mercy_tts_usage")
      .select("text_length, created_at, user_id")
      .gte("created_at", since),
    supabase
      .from("email_sends_log")
      .select("status, scheduled_at, sent_at")
      .gte("scheduled_at", since),
    supabase
      .from("speech_attempts")
      .select("created_at, user_id")
      .gte("created_at", since),
  ]);

  if (openai.error) throw new Error(`ai_usage_logs: ${openai.error.message}`);
  if (tts.error) throw new Error(`mercy_tts_usage: ${tts.error.message}`);
  if (resend.error) throw new Error(`email_sends_log: ${resend.error.message}`);
  if (azure.error) throw new Error(`speech_attempts: ${azure.error.message}`);

  const openaiRows = (openai.data ?? []) as OpenAiUsageRow[];
  const ttsRows = (tts.data ?? []) as TtsUsageRow[];
  const resendRows = (resend.data ?? []) as ResendSendRow[];
  const azureRows = (azure.data ?? []) as SpeechAttemptRow[];

  const daily = combineDailyCosts([
    aggregateOpenAi(openaiRows, now, days),
    aggregateElevenLabs(ttsRows, now, days, usdVndRate),
    aggregateResend(resendRows, now, days, usdVndRate),
    aggregateAzure(azureRows, now, days, usdVndRate),
  ]);

  const topUsers = topUsersByCost(openaiRows, ttsRows, azureRows, {
    topN,
    usdVndRate,
  });

  return {
    daily,
    topUsers,
    forecast_monthly_vnd: forecastMonthlyVnd(daily, 7),
  };
}

// ─── Cost-to-revenue ────────────────────────────────────────────────────

/**
 * Sum the active monthly recognized revenue across all paying users.
 * Reads from ai_product_catalog × subscriptions (the same join
 * check_ai_budget already uses, so numbers stay consistent).
 */
export async function getMonthlyRecognizedRevenueVnd(
  supabase: SupabaseClient,
): Promise<number> {
  const { data: subs, error: subsError } = await supabase
    .from("subscriptions")
    .select("product_id, status")
    .in("status", ["active", "trialing", "grace_period"]);
  if (subsError) {
    throw new Error(`subscriptions query failed: ${subsError.message}`);
  }
  const productIds = Array.from(
    new Set(((subs ?? []) as Array<{ product_id: string | null }>).map((s) => s.product_id).filter(Boolean) as string[]),
  );
  if (productIds.length === 0) return 0;

  const { data: catalog, error: catalogError } = await supabase
    .from("ai_product_catalog")
    .select("product_id, recognized_monthly_revenue_vnd, billing_interval, is_active")
    .in("product_id", productIds)
    .eq("is_active", true);
  if (catalogError) {
    throw new Error(`ai_product_catalog query failed: ${catalogError.message}`);
  }

  const revenueByProduct = new Map<string, number>();
  for (const c of (catalog ?? []) as Array<{
    product_id: string;
    recognized_monthly_revenue_vnd: number | null;
    billing_interval: string;
  }>) {
    const monthly =
      c.billing_interval === "year"
        ? Number(c.recognized_monthly_revenue_vnd ?? 0) / 12
        : Number(c.recognized_monthly_revenue_vnd ?? 0);
    revenueByProduct.set(c.product_id, monthly);
  }

  let total = 0;
  for (const s of (subs ?? []) as Array<{ product_id: string | null }>) {
    if (!s.product_id) continue;
    total += revenueByProduct.get(s.product_id) ?? 0;
  }
  return Math.round(total);
}

/**
 * Cost ÷ Revenue. Returns null when revenue is zero (avoid div-by-zero
 * UI flicker). UI uses null to show a "—" placeholder.
 */
export function costToRevenueRatio(
  monthlyCostVnd: number,
  monthlyRevenueVnd: number,
): number | null {
  if (monthlyRevenueVnd <= 0) return null;
  return Number((monthlyCostVnd / monthlyRevenueVnd).toFixed(4));
}
