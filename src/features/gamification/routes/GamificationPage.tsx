// src/features/gamification/routes/GamificationPage.tsx
//
// The module's single route surface, mounted at /progress/play behind
// FEATURE_GAMIFICATION (see src/router/AppRouter.tsx).
//
// Flip-safety (canonical-read-only): the streak and XP/points widgets read the
// app's ONE canonical source, not the gamification store's parallel counters —
//   • Streak → pointsService.getStreakDays() (+ useServerStreak for the record),
//     so testers never see a second streak number that disagrees with the rest
//     of the app.
//   • XP/points → the canonical user_points total via usePoints(), mapped
//     through the level curve for display only. Read-only: this page never
//     emits XP, so the display shows real accruing value instead of the
//     near-dead goal_complete-only gamification XP.
// Daily-goal and achievements stand alone (no canonical equivalent) and keep
// reading through useGamification().

import React from "react";

import { dailyGoalEngine } from "../engines/dailyGoalEngine";
import { xpEngine } from "../engines/xpEngine";
import { ACHIEVEMENTS } from "../engines/achievementEngine";
import { createDefaultState } from "../defaults";
import { useGamification } from "../hooks/useGamification";
import StreakWidget from "../components/StreakWidget";
import XpWidget from "../components/XpWidget";
import DailyGoalWidget from "../components/DailyGoalWidget";
import AchievementsScreen from "../components/AchievementsScreen";
import type { GamificationState } from "../types";

import { getStreakDays } from "@/services/pointsService";
import { useServerStreak } from "@/hooks/useServerStreak";
import { usePoints } from "@/hooks/usePoints";
import { FEATURE_FLAGS } from "@/lib/featureFlags";

function hasDisplayState(value: unknown): value is GamificationState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<GamificationState>;
  return Boolean(
    state.dailyGoal?.config &&
      state.achievements?.unlocked &&
      state.dailyGoal.config.metric &&
      Number.isFinite(state.dailyGoal.config.target),
  );
}

function safeCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : 0;
}

export default function GamificationPage() {
  const { state, loading } = useGamification();
  const stateReady = hasDisplayState(state);
  const displayState = stateReady ? state : createDefaultState();

  // Canonical streak. useServerStreak() warms streakCache and makes this
  // component re-render once the server value resolves, so the synchronous
  // getStreakDays() reader returns the canonical (server-or-localStorage)
  // number — the same one StreakBadge shows. The record (longest) only exists
  // canonically when server-streaks are on; otherwise it's omitted.
  const serverStreak = useServerStreak();
  const streakCurrent = safeCount(getStreakDays());
  const streakLongest =
    FEATURE_FLAGS.SERVER_STREAKS_ENABLED && serverStreak.longest > 0
      ? serverStreak.longest
      : undefined;

  // Canonical points (server user_points), displayed read-only through the
  // level curve. This page does not award XP.
  const { totalPoints } = usePoints();
  const displayPoints = safeCount(totalPoints);

  return (
    <main
      className="mx-auto w-full max-w-md px-4 py-8"
      data-testid="gamification-page"
    >
      <h1 className="text-2xl font-bold">Tiến độ của bạn</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Chuỗi ngày học, điểm XP, mục tiêu hằng ngày và huy hiệu.
      </p>

      {loading ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Đang tải…
        </p>
      ) : !stateReady ? (
        <div
          className="mt-6 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground"
          data-testid="gamification-display-fallback"
        >
          <p className="font-medium text-foreground">
            Tiến độ tạm thời chưa sẵn sàng
          </p>
          <p className="mt-1">
            Mercy đang làm mới dữ liệu học tập của bạn. Hãy thử lại sau một lát.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          <StreakWidget current={streakCurrent} longest={streakLongest} />

          {(() => {
            const p = xpEngine.progress(displayPoints);
            return (
              <XpWidget
                level={p.level}
                intoLevel={p.intoLevel}
                neededForNext={p.neededForNext}
                ratio={p.ratio}
              />
            );
          })()}

          <DailyGoalWidget
            metric={displayState.dailyGoal.config.metric}
            target={displayState.dailyGoal.config.target}
            progress={displayState.dailyGoal.progress}
            ratio={dailyGoalEngine.ratio(displayState.dailyGoal)}
            completed={displayState.dailyGoal.completedToday}
          />

          <AchievementsScreen
            definitions={ACHIEVEMENTS}
            unlocked={displayState.achievements.unlocked}
          />
        </div>
      )}
    </main>
  );
}
