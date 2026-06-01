// src/features/gamification/components/XpWidget.tsx
//
// Lane F — F6. Pure presentational XP / level widget. Props are the already-
// computed XpLevelProgress fields so it stays clock- and store-free.

import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface XpWidgetProps {
  level: number;
  intoLevel: number;
  neededForNext: number;
  /** intoLevel / neededForNext, already clamped 0..1. */
  ratio: number;
}

export default function XpWidget({
  level,
  intoLevel,
  neededForNext,
  ratio,
}: XpWidgetProps) {
  const percent = Math.round(ratio * 100);
  return (
    <Card data-testid="xp-widget">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden>
              ⭐
            </span>
            <span className="text-base font-extrabold">Cấp {level}</span>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {intoLevel} / {neededForNext} XP
          </span>
        </div>
        <Progress value={percent} className="mt-3 h-3" />
        <div className="mt-1.5 text-xs text-muted-foreground">
          Còn {Math.max(0, neededForNext - intoLevel)} XP nữa để lên cấp {level + 1}
        </div>
      </CardContent>
    </Card>
  );
}
