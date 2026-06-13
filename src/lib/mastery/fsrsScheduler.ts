import {
  createEmptyCard,
  fsrs,
  Rating,
  type Card,
  type Grade,
  type RecordLogItem,
} from "ts-fsrs";

import type { FsrsRating, ItemReviewState, LearnerInteraction } from "./types";

const scheduler = fsrs({ enable_fuzz: false });

export function buildReviewStates(
  interactions: readonly LearnerInteraction[],
): Map<string, ItemReviewState> {
  const cards = new Map<string, Card>();
  const histories = new Map<string, FsrsRating[]>();

  for (const interaction of [...interactions].sort((a, b) => toTime(a.occurredAt) - toTime(b.occurredAt))) {
    const rating = interaction.fsrsRating ?? ratingFromOutcome(interaction.outcome);
    const now = new Date(interaction.occurredAt);
    const existingCard = cards.get(interaction.itemId);
    const currentCard: Card = existingCard ?? createEmptyCard(now);
    const next = scheduler.next(currentCard, now, toTsFsrsRating(rating));
    cards.set(interaction.itemId, next.card);
    histories.set(interaction.itemId, [...(histories.get(interaction.itemId) ?? []), rating]);
  }

  return new Map([...cards].map(([itemId, card]) => [
    itemId,
    toReviewState(itemId, card, histories.get(itemId) ?? []),
  ]));
}

export function applyFsrsReview(
  itemId: string,
  state: ItemReviewState | null,
  rating: FsrsRating,
  reviewedAt: Date | string | number,
): ItemReviewState {
  const card = state ? fromReviewState(state) : createEmptyCard(reviewedAt);
  const next = scheduler.next(card, reviewedAt, toTsFsrsRating(rating));
  return toReviewState(itemId, next.card, [...(state?.ratingHistory ?? []), rating]);
}

function toReviewState(itemId: string, card: Card, ratingHistory: FsrsRating[]): ItemReviewState {
  return {
    itemId,
    dueAt: card.due.getTime(),
    stability: card.stability,
    difficulty: card.difficulty,
    lastReviewAt: card.last_review?.getTime() ?? null,
    ratingHistory,
    suspended: false,
  };
}

function fromReviewState(state: ItemReviewState): Card {
  return {
    due: new Date(state.dueAt),
    stability: state.stability,
    difficulty: state.difficulty,
    elapsed_days: 0,
    scheduled_days: Math.max(0, Math.round((state.dueAt - (state.lastReviewAt ?? state.dueAt)) / 86_400_000)),
    learning_steps: 0,
    reps: state.ratingHistory.length,
    lapses: state.ratingHistory.filter((rating) => rating === "again").length,
    state: 2,
    last_review: state.lastReviewAt == null ? undefined : new Date(state.lastReviewAt),
  };
}

function toTsFsrsRating(rating: FsrsRating): Grade {
  if (rating === "again") return Rating.Again as Grade;
  if (rating === "hard") return Rating.Hard as Grade;
  if (rating === "easy") return Rating.Easy as Grade;
  return Rating.Good as Grade;
}

function ratingFromOutcome(outcome: LearnerInteraction["outcome"]): FsrsRating {
  return outcome === "correct" ? "good" : "again";
}

function toTime(value: Date | string | number): number {
  return value instanceof Date ? value.getTime() : new Date(value).getTime();
}

export type { RecordLogItem };
