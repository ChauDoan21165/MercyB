// src/features/gamification/components/DailyGoalWidget.tsx
//
// Lane F — F6. Pure presentational daily-goal widget. Props-driven.

import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { DailyGoalMetric } from "../types";

export interface DailyGoalWidgetProps {
  metric: DailyGoalMetric;
  target: number;
  progress: number;
  /** progress / target, already clamped 0..1. */
  ratio: number;
  completed: boolean;
}

/** Vietnamese label for each goal metric. */
const METRIC_LABEL: Record<DailyGoalMetric, string> = {
  minutes: "phút",
  xp: "XP",
  lessons: "bài học",
  rooms: "phòng học",
};

export default function DailyGoalWidget({
  metric,
  target,
  progress,
  ratio,
  completed,
}: DailyGoalWidgetProps) {
  const percent = Math.round(ratio * 100);
  const unit = METRIC_LABEL[metric];
  return (
    <Card data-testid="daily-goal-widget">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden>
              🎯
            </span>
            <span className="text-base font-extrabold">Mục tiêu hôm nay</span>
          </div>
          {completed ? (
            <Badge data-testid="daily-goal-completed">Đã hoàn thành 🎉</Badge>
          ) : null}
        </div>
        <Progress value={percent} className="mt-3 h-3" />
        <div className="mt-1.5 text-xs text-muted-foreground">
          {progress} / {target} {unit}
        </div>
      </CardContent>
    </Card>
  );
}
