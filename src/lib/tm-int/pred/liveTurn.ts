// WP-001 — live-turn integration helper (SHADOW MODE).
//
// The single, self-guarding entry point the live tutor turn calls. It is inert unless
// the flag is on: the FIRST thing it does is check the flag and return. Everything is
// wrapped so it can NEVER throw into the caller's turn — the core path survives this
// optional capture failing (CLAUDE.md: "core path survives optional failures").
//
// This is what makes constraint 1 real: on every live tutor turn, when capture is on,
// a prediction row is written BEFORE the learner's next outcome exists.

import { capturePrediction } from "./capture";
import { drainPrediction } from "./sink";
import { isPredictionCaptureEnabled } from "./flag";
import { predictOutcome } from "./predictor";
import { predictionRecordedFact } from "./observe";
import { observationEventBus } from "../obs/eventBus";
import type { CefrBucket, CorrectionStatus, PredictionRow, TurnAddress, TurnFeatures } from "./types";

export type LiveTurnInput = {
  /** Correction status of THIS turn (the feature), not the learner's next outcome. */
  status: CorrectionStatus | "corrected" | "unchanged" | "needs_ai" | "abstained";
  /** Rule ids that fired this turn (first is the primary rule; length is the issue count). */
  appliedRuleIds?: string[];
  isCurrentLessonTarget?: boolean;
  cefrBucket?: CefrBucket;
  /** Stable per-turn id for provenance (e.g. the correction turn id). */
  msgId: string;
};

// In-module session token (no PII) + monotonic turn index. Minted lazily; a fresh token
// per tab session is all the provenance we need to group a session's predictions.
let sessionToken: string | null = null;
let turnCounter = 0;

function ensureSessionToken(): string {
  if (sessionToken) return sessionToken;
  const cryptoObj = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;
  sessionToken = cryptoObj?.randomUUID ? `live-${cryptoObj.randomUUID()}` : `live-${turnCounter}`;
  return sessionToken;
}

function toStatus(raw: LiveTurnInput["status"]): CorrectionStatus {
  return raw === "corrected" || raw === "unchanged" || raw === "needs_ai" || raw === "abstained" ? raw : "unchanged";
}

/**
 * Capture a prediction for the current live tutor turn, in SHADOW MODE. Returns the
 * captured row (for tests) or null when the flag is off or anything went wrong. Never
 * throws; never touches learner-facing state.
 */
export function captureLiveTurnPrediction(input: LiveTurnInput, now: number = Date.now()): PredictionRow | null {
  if (!isPredictionCaptureEnabled()) return null;
  try {
    const address: TurnAddress = {
      sessionId: ensureSessionToken(),
      turnIndex: turnCounter++,
      msgId: input.msgId,
    };
    const features: TurnFeatures = {
      correctionStatus: toStatus(input.status),
      issueCount: input.appliedRuleIds?.length ?? 0,
      ruleId: input.appliedRuleIds?.[0] ?? null,
      cefrBucket: input.cefrBucket ?? "unknown",
      isCurrentLessonTarget: input.isCurrentLessonTarget ?? false,
    };
    const row = capturePrediction(address, features, predictOutcome(features), now);
    drainPrediction(row);
    observationEventBus.publish(predictionRecordedFact(row));
    return row;
  } catch {
    // Optional capture must never break a live turn.
    return null;
  }
}

/** Test-only reset of the in-module session token + counter. */
export function __resetLiveTurnStateForTests(): void {
  sessionToken = null;
  turnCounter = 0;
}
