// src/features/review/ui/session/SessionComplete.tsx — Lane D / D5
//
// The completion panel: a celebration, NOT a report card. Shows the reviewed
// count and the next review time (or a friendly "nothing left today").
// Presentational, prop-driven, pure.

import React from "react";
import type { SessionSummary } from "@/features/review/types";
import { formatNextDue } from "./format";

export interface SessionCompleteProps {
  summary: SessionSummary;
  /** Optional "review again / back" affordance, wired by the leader. */
  onDone?: () => void;
}

export function SessionComplete({ summary, onDone }: SessionCompleteProps) {
  return (
    <div
      className="flex flex-col items-center gap-4 py-8 text-center"
      data-testid="session-complete"
    >
      <div className="text-4xl" aria-hidden="true">
        🎉
      </div>
      <h2 className="text-xl font-semibold text-gray-900">Hoàn thành 🎉</h2>

      <p className="text-gray-700" data-testid="session-complete-count">
        Đã ôn {summary.reviewed} thẻ
      </p>

      <p className="text-sm text-gray-500" data-testid="session-complete-next">
        {summary.nextDueAt == null
          ? "Hôm nay không còn thẻ nào"
          : `Lần ôn tiếp theo: ${formatNextDue(summary.nextDueAt)}`}
      </p>

      {onDone ? (
        <button
          type="button"
          onClick={onDone}
          aria-label="Xong"
          className="mt-2 rounded-xl bg-emerald-600 px-6 py-3 text-base font-medium text-white hover:bg-emerald-700"
        >
          Xong
        </button>
      ) : null}
    </div>
  );
}
