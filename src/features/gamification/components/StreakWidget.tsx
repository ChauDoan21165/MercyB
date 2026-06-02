// src/features/gamification/components/StreakWidget.tsx
//
// Lane F — F6. Pure presentational streak widget. Props-driven so it renders
// without IndexedDB. Vietnamese-first, mobile-first, encouraging tone — never
// shames a broken or at-risk streak.

import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface StreakWidgetProps {
  current: number;
  /**
   * Record streak. Optional: the canonical streak source
   * (`pointsService.getStreakDays` / server `profiles.streak_longest`) only
   * exposes a record when server-streaks are enabled, so the page omits it
   * otherwise rather than surface a streakEngine-local value. Hidden when undefined.
   */
  longest?: number;
  /**
   * Streak-freeze count. A gamification-streakEngine-only concept with no
   * canonical equivalent — omitted by the page so testers never see a second,
   * dead counter alongside the canonical streak. Hidden when undefined.
   */
  freezesAvailable?: number;
  atRisk?: boolean;
}

export default function StreakWidget({
  current,
  longest,
  freezesAvailable,
  atRisk = false,
}: StreakWidgetProps) {
  return (
    <Card data-testid="streak-widget" className="overflow-hidden">
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-full bg-orange-100 text-3xl"
          aria-hidden
        >
          🔥
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-muted-foreground">
            Chuỗi ngày học
          </div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold leading-none">
              {current}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              ngày
            </span>
          </div>
          {longest !== undefined || freezesAvailable !== undefined ? (
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {longest !== undefined ? (
                <span>
                  Kỷ lục: <strong className="text-foreground">{longest}</strong>{" "}
                  ngày
                </span>
              ) : null}
              {freezesAvailable !== undefined ? (
                <span>
                  Bảo vệ:{" "}
                  <strong className="text-foreground">{freezesAvailable}</strong>
                </span>
              ) : null}
            </div>
          ) : null}
          {atRisk ? (
            <Badge variant="secondary" className="mt-2">
              Học hôm nay để giữ chuỗi nhé!
            </Badge>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
