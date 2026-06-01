// src/features/gamification/components/AchievementsScreen.tsx
//
// Lane F — F6. Pure presentational achievements grid. Props-driven so it tests
// without IndexedDB: pass the catalog (ACHIEVEMENTS) and the unlocked map.
// Locked cards show a 🔒; unlocked cards show the achievement icon and read at
// full opacity.

import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import type { AchievementDefinition, UnlockedAchievement } from "../types";

export interface AchievementsScreenProps {
  definitions: AchievementDefinition[];
  unlocked: Record<string, UnlockedAchievement>;
}

export default function AchievementsScreen({
  definitions,
  unlocked,
}: AchievementsScreenProps) {
  const unlockedCount = definitions.filter((d) => unlocked[d.id]).length;

  return (
    <section data-testid="achievements-screen" aria-label="Huy hiệu">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-lg font-bold">Huy hiệu</h2>
        <span className="text-xs font-medium text-muted-foreground">
          {unlockedCount} / {definitions.length}
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-3">
        {definitions.map((def) => {
          const isUnlocked = Boolean(unlocked[def.id]);
          return (
            <li key={def.id}>
              <Card
                data-testid={`achievement-${def.id}`}
                data-unlocked={isUnlocked ? "true" : "false"}
                className={isUnlocked ? "" : "opacity-60"}
              >
                <CardContent className="flex flex-col gap-1 p-3">
                  <span className="text-2xl" aria-hidden>
                    {isUnlocked ? def.icon ?? "🏅" : "🔒"}
                  </span>
                  <span className="text-sm font-bold leading-tight">
                    {def.title}
                  </span>
                  <span className="text-xs leading-snug text-muted-foreground">
                    {def.description}
                  </span>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
