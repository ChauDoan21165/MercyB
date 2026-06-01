// src/features/gamification/routes/GamificationPage.tsx
//
// The module's single route surface, mounted at /progress/play behind
// FEATURE_GAMIFICATION (see src/router/AppRouter.tsx). STEP-0 ships a
// placeholder shell; F6 replaces the body with the streak / XP / daily-goal
// widgets and the achievements screen, all reading through useGamification().

import React from "react";

export default function GamificationPage() {
  return (
    <main
      className="mx-auto w-full max-w-md px-4 py-8"
      data-testid="gamification-page"
    >
      <h1 className="text-2xl font-bold">Tiến độ của bạn</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Chuỗi ngày học, điểm XP, mục tiêu hằng ngày và huy hiệu.
      </p>
      {/* F6: <StreakWidget /> <XpWidget /> <DailyGoalWidget /> <AchievementsScreen /> */}
    </main>
  );
}
