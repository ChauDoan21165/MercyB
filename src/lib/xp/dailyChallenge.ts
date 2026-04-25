// src/lib/xp/dailyChallenge.ts
//
// Daily challenge generator + completion flow.
//
// One row per (user, date). The kind is chosen from the user's weakest
// signal (placement_weaknesses on the profile) with a deterministic
// fallback so users with no signal still get a varied daily card.
//
// Stubs to other parallel agents:
//   - awardPointsStub: A2 owns leaderboard points; wired by A2's PR.
//   - updateStreakStub: A1 owns streaks (src/lib/streaks/); wired by
//     A1's PR. Note: profile-row streaks already auto-update via the
//     trigger on user_room_progress; this stub is for an A1-owned
//     "challenge counts as a study event" hook if/when A1 adds one.

import { supabase } from "@/lib/supabaseClient";
import { awardXp } from "./xpClient";

export type ChallengeKind = "sentence" | "rule" | "pronunciation" | "mixed";

export type ChallengePayload = {
  kind: ChallengeKind;
  /** Originating weakness tag if the kind was picked from a signal. */
  sourceTag?: string;
  /** VN prompt the user sees first; bilingual where helpful. */
  prompt_vi: string;
  /** EN target / reference. */
  prompt_en?: string;
  /** Free-form hint (Vietnamese teacher voice). */
  hint_vi?: string;
};

export type DailyChallengeRow = {
  id: string;
  user_id: string;
  date: string;
  challenge_kind: ChallengeKind;
  challenge_payload: ChallengePayload;
  completed: boolean;
  completed_at: string | null;
  xp_awarded: number;
};

const XP_BY_KIND: Record<ChallengeKind, number> = {
  sentence: 10,
  rule: 15,
  pronunciation: 15,
  mixed: 20,
};

export function xpForKind(kind: ChallengeKind): number {
  return XP_BY_KIND[kind];
}

// ── Pure pickers (testable without Supabase) ──────────────────────────────

/** True if the tag is an L1 grammar pattern (vs a pronunciation/lexical tag). */
function isGrammarTag(tag: string): boolean {
  return tag.startsWith("vi_l1_");
}

/**
 * Hash a YYYY-MM-DD string to a small non-negative integer. Used to
 * rotate fallback prompts deterministically per day.
 */
export function dateSeed(dateISO: string): number {
  let h = 0;
  for (let i = 0; i < dateISO.length; i++) {
    h = (h * 31 + dateISO.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const FALLBACK_SENTENCES: ReadonlyArray<{ vi: string; en: string }> = [
  { vi: "Tôi đang luyện tiếng Anh mỗi ngày.", en: "I am practicing English every day." },
  { vi: "Hôm nay tôi sẽ học một câu mới.", en: "Today I will learn one new sentence." },
  { vi: "Tôi có thể nói chậm và rõ ràng.", en: "I can speak slowly and clearly." },
  { vi: "Tôi cần thêm thời gian để suy nghĩ.", en: "I need a little more time to think." },
  { vi: "Bạn có thể nhắc lại được không?", en: "Could you say that again, please?" },
  { vi: "Tôi không hiểu, xin lỗi.", en: "I don't understand, sorry." },
  { vi: "Cuối tuần bạn thường làm gì?", en: "What do you usually do on weekends?" },
];

const FALLBACK_PRONUNCIATIONS: ReadonlyArray<{ vi: string; en: string }> = [
  { vi: "Đọc to: 'I think therefore I am.'", en: "I think therefore I am." },
  { vi: "Đọc to: 'She sells seashells by the seashore.'", en: "She sells seashells by the seashore." },
  { vi: "Đọc to: 'Three free throws.'", en: "Three free throws." },
];

/**
 * Picks the daily challenge given the user's weakness signal and the
 * date. Pure — no I/O. Date is used as a deterministic rotator so the
 * same user gets the same challenge if they revisit the page.
 */
export function pickChallenge(
  weaknessTags: readonly string[],
  dateISO: string,
): ChallengePayload {
  const seed = dateSeed(dateISO);
  const grammarTag = weaknessTags.find(isGrammarTag);

  if (grammarTag) {
    return {
      kind: "rule",
      sourceTag: grammarTag,
      prompt_vi: `Sửa câu sai theo quy tắc: ${grammarTag}`,
      hint_vi:
        "Đọc kỹ câu, tìm chỗ thiếu hoặc sai, viết lại cho đúng quy tắc bạn vừa học.",
    };
  }

  // No grammar weakness signal — rotate sentence vs pronunciation by date
  // so users see variety. Mixed appears every 7th day as a small reward.
  const slot = seed % 7;
  if (slot === 6) {
    return {
      kind: "mixed",
      prompt_vi: "Hôm nay thử thách hỗn hợp: dịch 1 câu rồi đọc to câu đó.",
      prompt_en: "Translate one sentence, then read it aloud.",
      hint_vi: "Hai bước nhỏ — không cần hoàn hảo, chỉ cần làm xong.",
    };
  }

  if (slot % 2 === 0) {
    const item = FALLBACK_SENTENCES[seed % FALLBACK_SENTENCES.length];
    return {
      kind: "sentence",
      prompt_vi: `Dịch sang tiếng Anh: "${item.vi}"`,
      prompt_en: item.en,
      hint_vi: "Viết câu trả lời bằng tiếng Anh, sau đó so với gợi ý.",
    };
  }

  const item = FALLBACK_PRONUNCIATIONS[seed % FALLBACK_PRONUNCIATIONS.length];
  return {
    kind: "pronunciation",
    prompt_vi: item.vi,
    prompt_en: item.en,
    hint_vi: "Đọc rõ từng âm cuối; chậm hơn bình thường một chút.",
  };
}

// ── Stubs for parallel agents (A1 streaks, A2 leaderboard points) ─────────

const awardPointsStub = (
  _userId: string,
  _points: number,
  _source: string,
): Promise<void> => Promise.resolve(); // wired by A2's PR

const updateStreakStub = (_userId: string): Promise<void> => Promise.resolve(); // wired by A1's PR

// ── Supabase I/O ──────────────────────────────────────────────────────────

type WeaknessRow = { placement_weaknesses: unknown } | null;

async function loadWeaknessTags(userId: string): Promise<string[]> {
  try {
    const { data, error } = await (supabase
      .from("profiles") as unknown as {
        select: (cols: string) => {
          eq: (col: string, val: string) => {
            maybeSingle: () => Promise<{
              data: WeaknessRow;
              error: { message: string } | null;
            }>;
          };
        };
      })
      .select("placement_weaknesses")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) return [];
    const raw = data.placement_weaknesses;
    return Array.isArray(raw)
      ? raw.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

type DailyChallengeResponse = {
  data: DailyChallengeRow | null;
  error: { message: string } | null;
};

async function loadExistingChallenge(
  userId: string,
  dateISO: string,
): Promise<DailyChallengeRow | null> {
  const { data, error } = await (supabase
    .from("daily_challenges") as unknown as {
      select: (cols: string) => {
        eq: (col: string, val: string) => {
          eq: (col: string, val: string) => {
            maybeSingle: () => Promise<DailyChallengeResponse>;
          };
        };
      };
    })
    .select("*")
    .eq("user_id", userId)
    .eq("date", dateISO)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

/**
 * Returns today's challenge row, generating + inserting it on first
 * call. Idempotent: subsequent calls on the same date return the same
 * row (UNIQUE (user_id, date) plus a maybeSingle read).
 */
export async function generateDaily(
  userId: string,
  dateISO: string,
): Promise<DailyChallengeRow | null> {
  const existing = await loadExistingChallenge(userId, dateISO);
  if (existing) return existing;

  const tags = await loadWeaknessTags(userId);
  const payload = pickChallenge(tags, dateISO);

  const insert = (await (supabase
    .from("daily_challenges") as unknown as {
      insert: (
        row: Record<string, unknown>,
      ) => {
        select: (cols: string) => {
          single: () => Promise<DailyChallengeResponse>;
        };
      };
    })
    .insert({
      user_id: userId,
      date: dateISO,
      challenge_kind: payload.kind,
      challenge_payload: payload,
    })
    .select("*")
    .single()) as DailyChallengeResponse;

  if (insert.error) {
    // Most likely cause: a concurrent insert won the UNIQUE race. Re-read.
    return loadExistingChallenge(userId, dateISO);
  }

  return insert.data;
}

export type CompleteDailyResult =
  | { ok: true; xpAwarded: number; xpTotal: number }
  | { ok: false; error: string };

/**
 * Marks today's challenge complete, awards XP, and notifies streak +
 * leaderboard via stubs. Idempotent: a second call on an already-
 * completed row is a no-op.
 */
export async function completeDaily(
  userId: string,
  dateISO: string,
): Promise<CompleteDailyResult> {
  const row = await loadExistingChallenge(userId, dateISO);
  if (!row) {
    return { ok: false, error: "no challenge for date — call generateDaily first" };
  }
  if (row.completed) {
    return { ok: true, xpAwarded: row.xp_awarded, xpTotal: 0 };
  }

  const points = xpForKind(row.challenge_kind);

  const update = (await (supabase
    .from("daily_challenges") as unknown as {
      update: (
        row: Record<string, unknown>,
      ) => {
        eq: (col: string, val: string) => {
          eq: (col: string, val: string) => {
            select: (cols: string) => {
              single: () => Promise<DailyChallengeResponse>;
            };
          };
        };
      };
    })
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
      xp_awarded: points,
    })
    .eq("user_id", userId)
    .eq("date", dateISO)
    .select("*")
    .single()) as DailyChallengeResponse;

  if (update.error) {
    return { ok: false, error: update.error.message };
  }

  const xpResult = await awardXp(userId, points, "challenge");
  if (!xpResult.ok) {
    // The challenge row is already flipped completed=true; we don't
    // roll it back. The next sync of total_xp will reconcile.
    return { ok: false, error: xpResult.error };
  }

  await awardPointsStub(userId, points, "challenge");
  await updateStreakStub(userId);

  return { ok: true, xpAwarded: points, xpTotal: xpResult.total };
}
