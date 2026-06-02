// src/features/gamification/engines/achievementEngine.ts
//
// Lane F — F4: the ACHIEVEMENTS catalog + evaluation engine.
//
// Pure, deterministic, idempotent. Engines never read the clock; the caller
// passes `now`. The catalog is Vietnamese-first (Principle #1) and tuned for
// outcomes over engagement — every title/description is encouraging, with no
// streak-shaming or dark patterns.

import type {
  AchievementDefinition,
  AchievementEngine,
  AchievementEvaluation,
  AchievementId,
  AchievementState,
  GamificationState,
} from "../types";

/** Clamp a number into the 0..1 range. */
function clamp01(n: number): number {
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n >= 1 ? 1 : n;
}

/**
 * Count days the learner completed their daily goal: history entries with
 * `completed === true`, plus today if `completedToday` and today isn't already
 * recorded as completed in history (avoid double counting on rollover edge).
 */
function completedGoalDays(state: GamificationState): number {
  const { dailyGoal } = state;
  let count = 0;
  for (const rec of Object.values(dailyGoal.history)) {
    if (rec.completed) count += 1;
  }
  if (dailyGoal.completedToday) {
    const today = dailyGoal.date;
    const todayInHistory =
      today != null && dailyGoal.history[today]?.completed === true;
    if (!todayInHistory) count += 1;
  }
  return count;
}

/**
 * Built-in achievement catalog. Predicates prefer monotonic fields
 * (streak.longest over streak.current, lifetime totalXp) so an unlock can
 * never silently re-lock after the fact.
 */
export const ACHIEVEMENTS: AchievementDefinition[] = [
  // ── Streak ────────────────────────────────────────────────────────
  {
    id: "streak_3",
    category: "streak",
    title: "Ba ngày liên tục",
    description: "Bạn đã học đều đặn 3 ngày liền — thói quen đang hình thành!",
    icon: "🔥",
    isUnlocked: (s) => s.streak.longest >= 3,
    progress: (s) => clamp01(s.streak.longest / 3),
  },
  {
    id: "streak_7",
    category: "streak",
    title: "Trọn một tuần",
    description: "Bảy ngày liên tục! Bạn đang giữ nhịp học rất tốt.",
    icon: "🔥",
    isUnlocked: (s) => s.streak.longest >= 7,
    progress: (s) => clamp01(s.streak.longest / 7),
  },
  {
    id: "streak_30",
    category: "streak",
    title: "Ba mươi ngày bền bỉ",
    description: "Một tháng học không nghỉ — sự kiên trì đáng tự hào!",
    icon: "🏆",
    isUnlocked: (s) => s.streak.longest >= 30,
    progress: (s) => clamp01(s.streak.longest / 30),
  },

  // ── XP ────────────────────────────────────────────────────────────
  {
    id: "xp_level_5",
    category: "xp",
    title: "Đạt cấp 5",
    description: "Bạn đã lên tới cấp độ 5. Tiến bộ rõ rệt từng ngày!",
    icon: "⭐",
    isUnlocked: (s) => s.xp.level >= 5,
    progress: (s) => clamp01(s.xp.level / 5),
  },
  {
    id: "xp_1000",
    category: "xp",
    title: "Một nghìn điểm kinh nghiệm",
    description: "Tích lũy được 1000 điểm kinh nghiệm — nỗ lực được đền đáp!",
    icon: "💎",
    isUnlocked: (s) => s.xp.totalXp >= 1000,
    progress: (s) => clamp01(s.xp.totalXp / 1000),
  },

  // ── Goal ──────────────────────────────────────────────────────────
  {
    id: "goal_first",
    category: "goal",
    title: "Hoàn thành mục tiêu đầu tiên",
    description: "Bạn đã đạt mục tiêu học tập trong một ngày. Khởi đầu tuyệt vời!",
    icon: "🎯",
    isUnlocked: (s) => completedGoalDays(s) >= 1,
  },
  {
    id: "goal_7",
    category: "goal",
    title: "Bảy ngày đạt mục tiêu",
    description: "Đã hoàn thành mục tiêu trong 7 ngày — kỷ luật đáng nể!",
    icon: "🎯",
    isUnlocked: (s) => completedGoalDays(s) >= 7,
    progress: (s) => clamp01(completedGoalDays(s) / 7),
  },

  // ── Milestone ─────────────────────────────────────────────────────
  {
    id: "first_xp",
    category: "milestone",
    title: "Điểm kinh nghiệm đầu tiên",
    description: "Bạn vừa kiếm được điểm kinh nghiệm đầu tiên. Hành trình bắt đầu!",
    icon: "✨",
    isUnlocked: (s) => s.xp.totalXp > 0,
  },
  {
    id: "first_day",
    category: "milestone",
    title: "Ngày học đầu tiên",
    description: "Ngày đầu tiên trong chuỗi học của bạn. Cứ thế tiếp tục nhé!",
    icon: "🌱",
    isUnlocked: (s) => s.streak.current >= 1,
  },
];

function evaluate(
  achState: AchievementState,
  fullState: GamificationState,
  now: number,
  defs: AchievementDefinition[] = ACHIEVEMENTS,
): AchievementEvaluation {
  const newlyUnlocked: AchievementDefinition[] = [];
  // Start from a shallow copy so inputs are never mutated.
  const unlocked: AchievementState["unlocked"] = { ...achState.unlocked };

  for (const def of defs) {
    if (unlocked[def.id]) continue; // already unlocked — preserve, never re-report
    if (def.isUnlocked(fullState) === true) {
      unlocked[def.id] = { id: def.id, unlockedAt: now };
      newlyUnlocked.push(def);
    }
  }

  return {
    state: { unlocked },
    newlyUnlocked,
  };
}

function isUnlocked(achState: AchievementState, id: AchievementId): boolean {
  return Object.prototype.hasOwnProperty.call(achState.unlocked, id);
}

export const achievementEngine: AchievementEngine = {
  evaluate,
  isUnlocked,
};
