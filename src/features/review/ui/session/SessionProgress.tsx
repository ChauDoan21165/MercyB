// src/features/review/ui/session/SessionProgress.tsx — Lane D / D5
//
// Presentational progress bar for a review session. Prop-driven, pure.

import React from "react";

export interface SessionProgressProps {
  /** Cards already graded this session. */
  completed: number;
  /** Total cards in the queue. */
  total: number;
}

/**
 * A slim progress bar plus an "x / y" counter. Vietnamese-first, mobile-first.
 */
export function SessionProgress({ completed, total }: SessionProgressProps) {
  const safeTotal = Math.max(0, total);
  const safeDone = Math.min(Math.max(0, completed), safeTotal);
  const pct = safeTotal === 0 ? 0 : Math.round((safeDone / safeTotal) * 100);

  return (
    <div className="w-full" data-testid="session-progress">
      <div className="mb-1 flex items-center justify-between text-sm text-gray-600">
        <span>Tiến độ</span>
        <span aria-hidden="true">
          {safeDone} / {safeTotal}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-valuenow={safeDone}
        aria-label={`Đã ôn ${safeDone} trên ${safeTotal} thẻ`}
      >
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
