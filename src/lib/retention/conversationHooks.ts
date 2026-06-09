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
  | "momentum"
  | "milestone"
  | "streak";

export type ConversationEncouragement = {
  tone: ConversationEncouragementTone;
  vi: string;
  en: string;
};

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
