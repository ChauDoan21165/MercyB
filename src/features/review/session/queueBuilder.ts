// src/features/review/session/queueBuilder.ts — Lane D / D4
//
// Pure session-queue construction, composed against the Scheduler / ReviewStore
// / ContentAdapter INTERFACES (never their concrete D1/D2/D3 implementations).
//
// Ordering contract: due cards first, then freshly-introduced new cards, capped
// by the remaining daily new-card budget. Fail soft — a flow with no content,
// or items that vanished from content, yields an empty / pruned queue, never a
// throw. Time is ms-epoch + an explicit clock (opts.nowMs); never Date.now().

import type {
  ReviewFlowId,
  ReviewItem,
  SessionCard,
  StoredCard,
  BuildQueueOptions,
} from "@/features/review/types";

import type { SessionDeps } from "./deps";

/**
 * Local YYYY-MM-DD for an ms-epoch instant (the daily-count key is in the
 * learner's local timezone, per the contract). Exported so the grading loop and
 * tests derive the same day string from the same clock.
 */
export function dayKey(nowMs: number): string {
  const d = new Date(nowMs);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Build the ordered session queue for a flow.
 *
 * 1. Pull due cards from the store, join each with its content item; drop any
 *    whose item is missing from content (fail soft).
 * 2. Introduce NEW cards (items with no stored card) up to the remaining daily
 *    new-card budget: (newLimit ?? settings.dailyNewLimit) - dailyCount.newCards.
 *    New cards get scheduler.newCard(nowMs) and isNew:true.
 * 3. Order: due cards first, then new cards.
 *
 * Returns [] for an empty / unwired flow.
 */
export async function buildQueue(
  deps: SessionDeps,
  flow: ReviewFlowId,
  opts: BuildQueueOptions,
): Promise<SessionCard[]> {
  const { scheduler, store, content } = deps;
  const { nowMs } = opts;

  // Content items for this flow, indexed by id. Empty/unwired flow → [].
  const items = await content.getItems(flow);
  if (items.length === 0) return [];

  const itemById = new Map<string, ReviewItem>();
  for (const it of items) itemById.set(it.id, it);

  // ── Due cards ────────────────────────────────────────────────────────────
  const dueStored = await store.getDueCards(flow, nowMs);
  const dueQueue: SessionCard[] = [];
  const dueItemIds = new Set<string>();
  for (const card of dueStored) {
    const item = itemById.get(card.itemId);
    if (!item) continue; // item gone from content → fail soft, drop it
    dueItemIds.add(card.itemId);
    dueQueue.push({ item, card, isNew: false });
  }

  // ── New-card budget ────────────────────────────────────────────────────────
  const settings = await store.getSettings(flow);
  const limit = opts.newLimit ?? settings.dailyNewLimit;
  const daily = await store.getDailyCount(flow, dayKey(nowMs));
  const budget = limit - daily.newCards;

  const newQueue: SessionCard[] = [];
  if (budget > 0) {
    for (const item of items) {
      if (newQueue.length >= budget) break;
      // Skip anything that already has a stored card (due or otherwise).
      if (dueItemIds.has(item.id)) continue;
      const existing = await store.getCard(flow, item.id);
      if (existing) continue;
      const state = scheduler.newCard(nowMs);
      const card: StoredCard = {
        itemId: item.id,
        flow,
        state,
        introducedAt: nowMs,
      };
      newQueue.push({ item, card, isNew: true });
    }
  }

  return [...dueQueue, ...newQueue];
}
