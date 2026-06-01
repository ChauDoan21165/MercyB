// src/features/review/ui/overview/OverviewView.tsx — Lane D / D6
//
// The review module home: the deck list. Purely presentational and prop-driven
// — the OverviewContainer feeds it computed per-flow counts + the daily-limit
// settings. Iterates REVIEW_FLOWS (never hard-codes a flow list) so all 7
// decks render in canonical order. Vietnamese-first, mobile-first.

import React from "react";
import type { ReviewFlowId } from "@/features/review/types";
import { REVIEW_FLOWS, getFlow } from "@/features/review/flows";
import { DeckCard } from "./DeckCard";
import { DailyLimitControl } from "./DailyLimitControl";

/** Computed counts for one flow's deck card. */
export interface DeckSummary {
  due: number;
  /** New cards available, already capped to today's remaining budget. */
  newAvailable: number;
}

export interface OverviewViewProps {
  /** Per-flow computed counts, keyed by ReviewFlowId. Missing = 0/0. */
  decks: Partial<Record<ReviewFlowId, DeckSummary>>;
  /** Per-flow daily new-card limit, keyed by ReviewFlowId. */
  dailyNewLimits: Partial<Record<ReviewFlowId, number>>;
  /** Fired when a deck's "Bắt đầu ôn" is tapped. */
  onStartFlow(flow: ReviewFlowId): void;
  /** Fired when a flow's daily new-card limit changes. */
  onChangeDailyLimit(flow: ReviewFlowId, value: number): void;
  /** True while initial counts are loading. */
  loading?: boolean;
}

/**
 * Renders one DeckCard per flow in REVIEW_FLOWS order, each with its own
 * inline daily-limit control.
 */
export function OverviewView({
  decks,
  dailyNewLimits,
  onStartFlow,
  onChangeDailyLimit,
  loading = false,
}: OverviewViewProps): React.ReactElement {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-6">
      <header className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Ôn tập</h1>
        <p className="mt-1 text-sm text-gray-600">
          Ôn lại những gì bạn đã học để nhớ lâu.
        </p>
      </header>

      {loading ? (
        <p
          role="status"
          className="py-8 text-center text-sm text-gray-500"
        >
          Đang tải…
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {REVIEW_FLOWS.map((flow) => {
            const summary = decks[flow.id] ?? { due: 0, newAvailable: 0 };
            const limit = dailyNewLimits[flow.id] ?? 0;
            return (
              <li key={flow.id} className="flex flex-col gap-2">
                <DeckCard
                  flow={flow}
                  dueCount={summary.due}
                  newCount={summary.newAvailable}
                  onStart={() => onStartFlow(flow.id)}
                />
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-2">
                  <DailyLimitControl
                    value={limit}
                    onChange={(v) => onChangeDailyLimit(flow.id, v)}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

// Re-exported for callers that want the flow label without importing flows.
export { getFlow };

export default OverviewView;
