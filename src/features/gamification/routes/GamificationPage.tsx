// src/features/gamification/routes/GamificationPage.tsx
//
// The module's single route surface, mounted at /progress/play behind
// FEATURE_GAMIFICATION (see src/router/AppRouter.tsx). F6 wires the streak /
// XP / daily-goal widgets and the achievements screen, all reading through
// useGamification().

import React from "react";

import { toIsoDate } from "../defaults";
import { xpEngine } from "../engines/xpEngine";
import { streakEngine } from "../engines/streakEngine";
import { dailyGoalEngine } from "../engines/dailyGoalEngine";
import { ACHIEVEMENTS } from "../engines/achievementEngine";
import { useGamification } from "../hooks/useGamification";
import StreakWidget from "../components/StreakWidget";
import XpWidget from "../components/XpWidget";
import DailyGoalWidget from "../components/DailyGoalWidget";
import AchievementsScreen from "../components/AchievementsScreen";

export default function GamificationPage() {
  const { state, loading } = useGamification();

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
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          <StreakWidget
            current={state.streak.current}
            longest={state.streak.longest}
            freezesAvailable={state.streak.freezesAvailable}
            atRisk={
              streakEngine.status(state.streak, toIsoDate(new Date())).atRisk
            }
          />

          {(() => {
            const p = xpEngine.progress(state.xp.totalXp);
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
            metric={state.dailyGoal.config.metric}
            target={state.dailyGoal.config.target}
            progress={state.dailyGoal.progress}
            ratio={dailyGoalEngine.ratio(state.dailyGoal)}
            completed={state.dailyGoal.completedToday}
          />

          <AchievementsScreen
            definitions={ACHIEVEMENTS}
            unlocked={state.achievements.unlocked}
          />
        </div>
      )}
    </main>
  );
}
