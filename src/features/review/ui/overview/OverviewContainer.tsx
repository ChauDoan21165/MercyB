// src/features/review/ui/overview/OverviewContainer.tsx — Lane D / D6
//
// Stateful container for the review overview. Computes per-flow due/new counts
// and daily-limit settings from the injected SessionDeps, then renders the
// purely-presentational OverviewView. Deps are injected via props — the lane
// leader owns the composition root, so this NEVER instantiates the real
// createScheduler / createReviewStore / createContentAdapter factories.

import React, { useCallback, useEffect, useState } from "react";
import type { ReviewFlowId, ReviewSettings } from "@/features/review/types";
import { REVIEW_FLOWS } from "@/features/review/flows";
import type { SessionDeps } from "@/features/review/session";
import { dayKey } from "@/features/review/session";
import { OverviewView, type DeckSummary } from "./OverviewView";

export interface OverviewContainerProps {
  deps: SessionDeps;
  /** Fixed clock for deterministic tests; defaults to Date.now(). */
  nowMs?: number;
  onStartFlow(flow: ReviewFlowId): void;
}

type DeckMap = Partial<Record<ReviewFlowId, DeckSummary>>;
type LimitMap = Partial<Record<ReviewFlowId, number>>;
type SettingsMap = Partial<Record<ReviewFlowId, ReviewSettings>>;

/**
 * For one flow at `now`: due count, the remaining-budget-capped new-available
 * count, and the flow's settings. New-available = content items with no stored
 * card; capped by (dailyNewLimit − newCards already introduced today), floored
 * at 0.
 */
async function computeDeck(
  deps: SessionDeps,
  flow: ReviewFlowId,
  now: number,
): Promise<{ summary: DeckSummary; settings: ReviewSettings }> {
  const [due, stored, items, settings, daily] = await Promise.all([
    deps.store.getDueCards(flow, now),
    deps.store.getCards(flow),
    deps.content.getItems(flow),
    deps.store.getSettings(flow),
    deps.store.getDailyCount(flow, dayKey(now)),
  ]);

  const storedIds = new Set(stored.map((c) => c.itemId));
  const newTotal = items.filter((it) => !storedIds.has(it.id)).length;

  const remainingBudget = Math.max(0, settings.dailyNewLimit - daily.newCards);
  const newAvailable = Math.min(newTotal, remainingBudget);

  return {
    summary: { due: due.length, newAvailable },
    settings,
  };
}

/**
 * Loads counts + settings for every flow on mount (and whenever deps/now
 * change), then renders OverviewView. Daily-limit changes persist via
 * `store.putSettings` and update local state optimistically.
 */
export function OverviewContainer({
  deps,
  nowMs,
  onStartFlow,
}: OverviewContainerProps): React.ReactElement {
  const now = nowMs ?? Date.now();

  const [decks, setDecks] = useState<DeckMap>({});
  const [settingsMap, setSettingsMap] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      const nextDecks: DeckMap = {};
      const nextSettings: SettingsMap = {};
      await Promise.all(
        REVIEW_FLOWS.map(async (flow) => {
          const { summary, settings } = await computeDeck(deps, flow.id, now);
          nextDecks[flow.id] = summary;
          nextSettings[flow.id] = settings;
        }),
      );
      if (cancelled) return;
      setDecks(nextDecks);
      setSettingsMap(nextSettings);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [deps, now]);

  const dailyNewLimits: LimitMap = {};
  for (const flow of REVIEW_FLOWS) {
    const s = settingsMap[flow.id];
    if (s) dailyNewLimits[flow.id] = s.dailyNewLimit;
  }

  const onChangeDailyLimit = useCallback(
    (flow: ReviewFlowId, value: number) => {
      setSettingsMap((prev) => {
        const base =
          prev[flow] ??
          ({ flow, dailyNewLimit: value, dailyReviewLimit: 0 } as ReviewSettings);
        const next: ReviewSettings = { ...base, flow, dailyNewLimit: value };
        // Persist (fire-and-forget; store is the source of truth on reload).
        void deps.store.putSettings(next);
        return { ...prev, [flow]: next };
      });
    },
    [deps],
  );

  return (
    <OverviewView
      decks={decks}
      dailyNewLimits={dailyNewLimits}
      onStartFlow={onStartFlow}
      onChangeDailyLimit={onChangeDailyLimit}
      loading={loading}
    />
  );
}

export default OverviewContainer;
