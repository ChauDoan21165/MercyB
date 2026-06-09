// src/lib/conversationRetention/sessionSummary.ts
//
// Session summary + "come back tomorrow" hook (Lane D retention). Pure data:
// Lane A (or any caller) passes the finished session's stats; this returns a
// warm, Vietnamese-first recap and a SPECIFIC tomorrow tease — never generic.
// No I/O, no LLM, deterministic — safe to render anywhere.
//
// Warmth-engine rules (STRATEGY.md / non-negotiable #4): affirming, low-shame,
// identity-affirming. We celebrate effort ("errors caught" = things the learner
// noticed), never scold. The tomorrow hook names something concrete from THIS
// session so the learner has a real reason to return.

export type Bilingual = { vi: string; en: string };

export type SessionSummaryInput = {
  turnsCompleted: number;
  /** Corrections the learner engaged with — framed as wins ("caught"). */
  errorsCaught: number;
  /** Patterns trending up this session, most-improved first (e.g. "thì quá khứ -ed"). */
  patternsImproving?: readonly string[];
  /** Distinct words/phrases practiced this session. */
  wordsPracticed?: readonly string[];
  /** The conversation topic label (to tease a related next scenario). */
  topicLabelVi?: string | null;
  topicLabelEn?: string | null;
  /** A concrete next scenario to tease, if the caller has one queued. */
  nextScenarioVi?: string | null;
  nextScenarioEn?: string | null;
  /** Current conversation streak, to weave into the hook when nothing more specific exists. */
  streakCurrent?: number;
};

export type TomorrowHookKind =
  | "pattern" // keep practicing a specific pattern
  | "next_scenario" // a concrete teased scenario
  | "topic_deeper" // go deeper on today's topic
  | "streak_keep"; // protect the running streak (only when nothing else is specific)

export type SessionSummary = {
  turnsCompleted: number;
  errorsCaught: number;
  patternsImproving: readonly string[];
  wordsPracticedCount: number;
  /** Warm recap of what the learner did today. */
  headline: Bilingual;
  /** Specific reason to come back tomorrow. */
  tomorrowHook: Bilingual;
  tomorrowHookKind: TomorrowHookKind;
};

function clampNonNeg(n: unknown): number {
  return typeof n === "number" && Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

function buildHeadline(turns: number, errorsCaught: number, words: number): Bilingual {
  // Lead with effort; affirm, never shame.
  if (errorsCaught > 0) {
    return {
      vi: `Bạn nói ${turns} lượt và tự bắt được ${errorsCaught} điểm cần sửa — giỏi lắm!`,
      en: `You spoke ${turns} turns and caught ${errorsCaught} thing${errorsCaught === 1 ? "" : "s"} to fix — well done!`,
    };
  }
  if (words > 0) {
    return {
      vi: `Bạn nói ${turns} lượt và luyện ${words} từ/cụm hôm nay. Cứ đà này nhé!`,
      en: `You spoke ${turns} turns and practiced ${words} words today. Keep it up!`,
    };
  }
  return {
    vi: `Bạn đã trò chuyện ${turns} lượt hôm nay — mỗi lượt là một bước tiến.`,
    en: `You had ${turns} turns today — every turn is progress.`,
  };
}

/**
 * Build the tomorrow hook from the MOST specific signal available, in order:
 * a pattern the learner is improving → a queued next scenario → going deeper on
 * today's topic → (last resort) keeping the streak. Never returns a generic
 * "come back tomorrow" with no concrete reason.
 */
function buildTomorrowHook(input: SessionSummaryInput): { hook: Bilingual; kind: TomorrowHookKind } {
  const pattern = input.patternsImproving?.find((p) => p && p.trim());
  if (pattern) {
    return {
      kind: "pattern",
      hook: {
        vi: `Mai mình luyện tiếp "${pattern}" nha — bạn đang tiến bộ chỗ này đó.`,
        en: `Tomorrow let's keep working on "${pattern}" — you're getting better at it.`,
      },
    };
  }

  const nextVi = input.nextScenarioVi?.trim();
  const nextEn = input.nextScenarioEn?.trim();
  if (nextVi || nextEn) {
    return {
      kind: "next_scenario",
      hook: {
        vi: `Mai có tình huống mới: ${nextVi || nextEn} — thử nhé?`,
        en: `Tomorrow there's a new scenario: ${nextEn || nextVi} — want to try?`,
      },
    };
  }

  const topicVi = input.topicLabelVi?.trim();
  const topicEn = input.topicLabelEn?.trim();
  if (topicVi || topicEn) {
    return {
      kind: "topic_deeper",
      hook: {
        vi: `Mai mình nói sâu hơn về "${topicVi || topicEn}" nhé.`,
        en: `Tomorrow let's go a little deeper on "${topicEn || topicVi}".`,
      },
    };
  }

  const streak = clampNonNeg(input.streakCurrent);
  if (streak >= 1) {
    const next = streak + 1;
    return {
      kind: "streak_keep",
      hook: {
        vi: `Quay lại mai để thành chuỗi ${next} ngày trò chuyện nhé!`,
        en: `Come back tomorrow to make it a ${next}-day conversation streak!`,
      },
    };
  }

  // Even the fallback names a concrete first step, not a generic nudge.
  return {
    kind: "streak_keep",
    hook: {
      vi: "Mai nói thêm một lượt nữa để bắt đầu chuỗi ngày của bạn nhé!",
      en: "Tomorrow, one more conversation starts your streak!",
    },
  };
}

export function buildSessionSummary(input: SessionSummaryInput): SessionSummary {
  const turnsCompleted = clampNonNeg(input?.turnsCompleted);
  const errorsCaught = clampNonNeg(input?.errorsCaught);
  const patternsImproving = (input?.patternsImproving ?? []).filter((p) => !!p && p.trim());
  const words = Array.isArray(input?.wordsPracticed)
    ? new Set(input.wordsPracticed.filter((w) => !!w && w.trim())).size
    : 0;

  const { hook, kind } = buildTomorrowHook(input ?? ({} as SessionSummaryInput));

  return {
    turnsCompleted,
    errorsCaught,
    patternsImproving,
    wordsPracticedCount: words,
    headline: buildHeadline(turnsCompleted, errorsCaught, words),
    tomorrowHook: hook,
    tomorrowHookKind: kind,
  };
}
