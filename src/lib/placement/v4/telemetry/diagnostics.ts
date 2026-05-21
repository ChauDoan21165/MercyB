// Placement v4 telemetry — learner-visible bilingual diagnostics.
//
// Pure functions that turn the adaptive signal bundle + intervention plan
// into short, learner-readable, bilingual strings the UI can render.
//
// Style rules (also enforced in tests):
//   - Vietnamese first.
//   - Non-judgmental. No "you failed", no "we detected"; framed as "let's…".
//   - No scary analytics language (no "churn", no "risk score").
//   - Deterministic — same inputs always produce the same string.

import type {
  AdaptiveSignalBundle,
  DiagnosticKind,
  InterventionPlan,
  LearnerDiagnostic,
  ProgressionSnapshotLike,
  Skill,
} from "./adaptiveTelemetryTypes";

export interface BuildDiagnosticsInput {
  snapshot: ProgressionSnapshotLike;
  signals: AdaptiveSignalBundle;
  plan: InterventionPlan;
}

export function buildLearnerDiagnostics(
  input: BuildDiagnosticsInput,
): readonly LearnerDiagnostic[] {
  const out: LearnerDiagnostic[] = [];

  out.push(focusAreaThisWeek(input));

  if (
    input.signals.burnout.level === "high" ||
    input.signals.burnout.level === "critical"
  ) {
    out.push(youMayBeOverloaded(input));
  }
  if (input.signals.reviewOverload.detected) {
    out.push(reviewDebtBuilding(input));
  }
  if (
    input.signals.speakingAvoidance.detected ||
    speakingImproving(input)
  ) {
    out.push(speakingConfidenceMessage(input));
  }
  if (pronunciationLagging(input)) {
    out.push(pronunciationLaggingMessage(input));
  }
  if (
    input.snapshot.streakDays === 0 &&
    input.signals.churn.level !== "low"
  ) {
    out.push(streakRecoverable(input));
  }

  // Diagnostics emitted in deterministic order (by kind name) so the UI is
  // stable across replays.
  return [...out].sort((a, b) => {
    if (a.kind < b.kind) return -1;
    if (a.kind > b.kind) return 1;
    return 0;
  });
}

// ---------------------------------------------------------------------------
// Individual diagnostic builders
// ---------------------------------------------------------------------------

function focusAreaThisWeek(
  input: BuildDiagnosticsInput,
): LearnerDiagnostic {
  const weakest = findWeakestSkill(input.snapshot);
  return {
    kind: "focus_area_this_week",
    headline: {
      vi: "Tập trung tuần này",
      en: "Focus this week",
    },
    body: {
      vi: weakest
        ? `Cùng tập trung vào ${weakest} một chút nhé.`
        : "Cùng giữ đều các kỹ năng trong tuần này.",
      en: weakest
        ? `Let's focus a little on ${weakest}.`
        : "Let's keep skills balanced this week.",
    },
    reasonCode: weakest ? `focus_skill:${weakest}` : "focus_balanced",
    tone: "informational",
  };
}

function youMayBeOverloaded(
  input: BuildDiagnosticsInput,
): LearnerDiagnostic {
  const minutesToday =
    input.snapshot.plan.days
      .find((d) => d.day === input.snapshot.currentDay)
      ?.lessons.reduce((s, l) => s + l.estimatedMinutes, 0) ?? 0;
  return {
    kind: "you_may_be_overloaded",
    headline: {
      vi: "Hôm nay có thể hơi nhiều",
      en: "Today may be a bit much",
    },
    body: {
      vi: `Ngày này có khoảng ${minutesToday} phút. Mình có thể rút gọn để bạn thoải mái hơn.`,
      en: `This day is about ${minutesToday} minutes. We can shorten it for you.`,
    },
    reasonCode: `overload:${minutesToday}m`,
    tone: "cautionary",
  };
}

function reviewDebtBuilding(
  input: BuildDiagnosticsInput,
): LearnerDiagnostic {
  const count = input.signals.reviewOverload.reviewDebtCount;
  return {
    kind: "review_debt_building",
    headline: {
      vi: "Bài ôn đang đợi",
      en: "Reviews are waiting",
    },
    body: {
      vi: `Có ${count} bài ôn cần xem lại. Một ngày dành riêng để ôn sẽ giúp bạn nhẹ đầu.`,
      en: `${count} reviews are waiting. A dedicated review day will help.`,
    },
    reasonCode: `review_debt:${count}`,
    tone: "cautionary",
  };
}

function speakingConfidenceMessage(
  input: BuildDiagnosticsInput,
): LearnerDiagnostic {
  if (speakingImproving(input)) {
    return {
      kind: "speaking_confidence_improving",
      headline: {
        vi: "Bạn đang nói tự tin hơn",
        en: "Your speaking is getting more confident",
      },
      body: {
        vi: "Mình thấy bạn quay lại bài nói đều đặn — cứ giữ vậy nhé.",
        en: "You're returning to speaking lessons steadily — keep going.",
      },
      reasonCode: "speaking_improving",
      tone: "celebratory",
    };
  }
  return {
    kind: "speaking_confidence_improving",
    headline: {
      vi: "Một bước nói nhẹ nhàng",
      en: "A gentle speaking step",
    },
    body: {
      vi: "Mình mở một bài nói rất ngắn để bắt đầu lại.",
      en: "Opening a very short speaking lesson to ease back in.",
    },
    reasonCode: "speaking_easeback",
    tone: "informational",
  };
}

function pronunciationLaggingMessage(
  input: BuildDiagnosticsInput,
): LearnerDiagnostic {
  const pron = input.snapshot.skills.pronunciation;
  const days = pron?.lastPracticedDayOrdinal != null
    ? Math.max(0, daysSince(input.snapshot.snapshotMs, pron.lastPracticedDayOrdinal))
    : 0;
  return {
    kind: "pronunciation_lagging_expected",
    headline: {
      vi: "Phát âm cần một chút thời gian",
      en: "Pronunciation needs a little time",
    },
    body: {
      vi: `Phát âm đang đi chậm hơn dự đoán — đã ${days} ngày chưa luyện. Mình chèn một bài ngắn.`,
      en: `Pronunciation is moving slower than predicted — ${days} day(s) since last practice. Adding a short lesson.`,
    },
    reasonCode: `pronunciation_lag:${days}d`,
    tone: "cautionary",
  };
}

function streakRecoverable(
  input: BuildDiagnosticsInput,
): LearnerDiagnostic {
  return {
    kind: "streak_recoverable",
    headline: {
      vi: "Bắt đầu lại một bài ngắn",
      en: "Start again with a short lesson",
    },
    body: {
      vi: "Một bài 5 phút là đủ để bắt nhịp lại — không có áp lực.",
      en: "A 5-minute lesson is enough to find your rhythm again — no pressure.",
    },
    reasonCode: "streak_recoverable",
    tone: "informational",
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findWeakestSkill(
  snapshot: ProgressionSnapshotLike,
): Skill | null {
  const entries = Object.entries(snapshot.skills).filter(
    ([, p]) => p && typeof p.mastery === "number",
  ) as [Skill, { mastery: number }][];
  if (entries.length === 0) return null;
  let weakest: [Skill, number] | null = null;
  for (const [skill, p] of entries) {
    if (!weakest || p.mastery < weakest[1]) weakest = [skill, p.mastery];
  }
  return weakest ? weakest[0] : null;
}

function pronunciationLagging(input: BuildDiagnosticsInput): boolean {
  const pron = input.snapshot.skills.pronunciation;
  if (!pron) return false;
  const others = Object.entries(input.snapshot.skills)
    .filter(([key]) => key !== "pronunciation")
    .map(([, p]) => p?.mastery ?? 0);
  if (others.length === 0) return false;
  const otherMean = others.reduce((s, m) => s + m, 0) / others.length;
  return pron.mastery + 0.1 < otherMean;
}

function speakingImproving(input: BuildDiagnosticsInput): boolean {
  if (input.signals.speakingAvoidance.detected) return false;
  const speaking = input.snapshot.skills.speaking;
  return !!speaking && speaking.mastery >= 0.6;
}

function daysSince(snapshotMs: number, dayOrdinal: number): number {
  const today = Math.floor(snapshotMs / 86_400_000);
  return Math.max(0, today - dayOrdinal);
}

export type { DiagnosticKind };
