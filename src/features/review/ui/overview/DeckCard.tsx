// src/features/review/ui/overview/DeckCard.tsx — Lane D / D6
//
// One flow's deck card on the review overview. Prop-driven, presentational.
// Vietnamese-first, mobile-first (375px). Shows the flow label, due count, and
// new count with a "Bắt đầu ôn" action. A deck with nothing to do (0 due + 0
// new) is visually de-emphasized and its start action disabled — no
// streak-shaming, just an honest "Chưa có thẻ".

import React from "react";
import type { ReviewFlow } from "@/features/review/types";

export interface DeckCardProps {
  flow: ReviewFlow;
  /** Cards due now for this flow. */
  dueCount: number;
  /** New cards available to introduce (already capped to today's budget). */
  newCount: number;
  /** Fired when the learner taps "Bắt đầu ôn". */
  onStart(): void;
}

/**
 * A single deck card. Empty decks (0 due + 0 new) render muted with a disabled
 * start button labeled "Chưa có thẻ".
 */
export function DeckCard({
  flow,
  dueCount,
  newCount,
  onStart,
}: DeckCardProps): React.ReactElement {
  const isEmpty = dueCount <= 0 && newCount <= 0;

  return (
    <div
      data-testid={`deck-card-${flow.id}`}
      data-empty={isEmpty ? "true" : "false"}
      className={[
        "flex items-center justify-between gap-3 rounded-2xl border p-4",
        isEmpty
          ? "border-gray-200 bg-gray-50 text-gray-400 opacity-60"
          : "border-gray-200 bg-white text-gray-900",
      ].join(" ")}
    >
      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold">{flow.label}</h3>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-sm">
          <span
            className={dueCount > 0 ? "font-medium text-emerald-700" : ""}
          >
            {dueCount} thẻ đến hạn
          </span>
          <span className={newCount > 0 ? "font-medium text-sky-700" : ""}>
            {newCount} thẻ mới
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        disabled={isEmpty}
        aria-label={
          isEmpty
            ? `${flow.label}: chưa có thẻ`
            : `Bắt đầu ôn ${flow.label}`
        }
        className={[
          "shrink-0 rounded-xl px-4 py-2 text-sm font-semibold",
          isEmpty
            ? "cursor-not-allowed bg-gray-100 text-gray-400"
            : "bg-emerald-600 text-white active:bg-emerald-700",
        ].join(" ")}
      >
        {isEmpty ? "Chưa có thẻ" : "Bắt đầu ôn"}
      </button>
    </div>
  );
}

export default DeckCard;
