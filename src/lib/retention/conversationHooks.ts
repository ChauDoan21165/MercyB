// Lane D1 conversation retention hooks for Lane A.
//
// These are intentionally small and deterministic. Conversations feed the
// existing general streak via canonical streak reads/writes elsewhere; this
// module does not maintain a conversation-specific counter.

import { getCanonicalStreak } from "@/lib/streak/canonicalStreak";
import { awardXPEventBackground } from "@/lib/xp/awardXPEvent";

export type ConversationEncouragementTone =
  | "first_turn"
  | "repair"
  | "challenge"
  | "momentum"
  | "milestone"
  | "streak";

export type ConversationEncouragement = {
  tone: ConversationEncouragementTone;
  vi: string;
  en: string;
};

export type ConversationChallengeEvidence = {
  interactions?: readonly {
    outcome?: string | null;
  }[];
  topicMastery?: Record<string, number | null | undefined> | null;
};

const CHALLENGE_MASTERY_THRESHOLD = 80;
const CHALLENGE_MAX_RECENT_ERROR_RATE = 0.2;
const CHALLENGE_MIN_RECENT_INTERACTIONS = 2;

function clampInt(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : 0;
}

/**
 * Copy hook for inline encouragement after a learner turn. Warm, specific,
 * and low-shame: errors are framed as catches/repairs, not failures.
 */
export function getEncouragementForTurn(
  turnNumber: number,
  errorsThisTurn: number,
  streakDays: number,
  challengeEvidence?: ConversationChallengeEvidence | null,
): ConversationEncouragement {
  const turn = clampInt(turnNumber);
  const errors = clampInt(errorsThisTurn);
  const streak = clampInt(streakDays);

  if (turn <= 1) {
    return {
      tone: "first_turn",
      vi: "Bạn đã bắt đầu cuộc hội thoại. Cứ trả lời ngắn cũng được.",
      en: "You started the conversation. Short answers count too.",
    };
  }

  if (errors > 0) {
    return {
      tone: "repair",
      vi: `Bạn vừa bắt được ${errors} điểm cần sửa. Đó là cách nói tự nhiên hơn từng lượt.`,
      en: `You caught ${errors} thing${errors === 1 ? "" : "s"} to fix. That is how each turn gets more natural.`,
    };
  }

  if (shouldChallengeLearner(turn, errors, challengeEvidence)) {
    return {
      tone: "challenge",
      vi: "Bạn đang vững phần này rồi. Thử trả lời dài hơn: thêm một lý do và một chi tiết cụ thể.",
      en: "You look steady here. Try a harder answer: add one reason and one specific detail.",
    };
  }

  if (turn > 0 && turn % 5 === 0) {
    return {
      tone: "milestone",
      vi: `${turn} lượt rồi. Bạn đang giữ được mạch hội thoại thật.`,
      en: `${turn} turns in. You are holding a real conversation thread.`,
    };
  }

  if (streak >= 3) {
    return {
      tone: "streak",
      vi: `Chuỗi ${streak} ngày vẫn đang chạy. Một lượt hôm nay cũng giữ nhịp.`,
      en: `Your ${streak}-day streak is still moving. One turn today keeps the rhythm.`,
    };
  }

  return {
    tone: "momentum",
    vi: "Tốt. Bạn đang trả lời bằng ý của mình, không chỉ học thuộc câu mẫu.",
    en: "Good. You are answering with your own meaning, not just memorizing a line.",
  };
}

/**
 * Award XP for a useful conversation turn. Correction acceptance gets a small
 * bump, but there is no separate conversation streak/counter.
 */
export function awardConversationTurnXP(
  turnNumber: number,
  correctionAccepted: boolean,
): void {
  const turn = clampInt(turnNumber);
  if (turn <= 0) return;

  awardXPEventBackground({
    event_type: "conversation_turn",
    xp_amount: correctionAccepted ? 4 : 2,
    multiplier: turn > 0 && turn % 5 === 0 ? 1.5 : 1,
  });
}

export function getCurrentGeneralStreakDays(): number {
  return getCanonicalStreak().current;
}

function shouldChallengeLearner(
  turn: number,
  errorsThisTurn: number,
  evidence?: ConversationChallengeEvidence | null,
): boolean {
  if (turn <= 1 || errorsThisTurn > 0 || !evidence) return false;

  const masteryValues = Object.values(evidence.topicMastery ?? {})
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  const hasHighMastery = masteryValues.some((value) => value >= CHALLENGE_MASTERY_THRESHOLD);
  if (!hasHighMastery) return false;

  const recent = (evidence.interactions ?? [])
    .filter((interaction) => interaction?.outcome === "correct" || interaction?.outcome === "incorrect")
    .slice(-6);
  if (recent.length < CHALLENGE_MIN_RECENT_INTERACTIONS) return false;

  const incorrect = recent.filter((interaction) => interaction.outcome === "incorrect").length;
  return incorrect / recent.length <= CHALLENGE_MAX_RECENT_ERROR_RATE;
}
