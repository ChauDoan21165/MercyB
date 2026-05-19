// supabase/functions/placement-session/engine/result.ts
//
// Placement Test v2 — result assembly (Phase 2, PR 8).
//
// Implements: sequence-doc PR 8 "+ result assembly". The final lifecycle
// step terminator.ts:23-27 defers to it explicitly: "the post-test
// retest cooldown (RETEST_COOLDOWN_DAYS) and CEFR banding live with
// result assembly (a later PR), not here". `assembleResult` maps a
// settled session to the `ResultPayload` (types.ts §2.3) and is the SOLE
// owner of the `terminating → complete` phase edge (one-owner-per-
// function; session.ts owns abandon/resume, advance.ts owns the in-test
// loop).
//
// SERVER-SIDE, PURE given an injected `ResultDeps`. The two cross-layer
// facts the engine deliberately does NOT reach for itself —
//   • the CEFR→room map (`src/lib/placement/cefrToRoom.ts`, a BROWSER
//     module keyed off the v1 engine + validated against
//     public/data/*.json), and
//   • the learner's prior placement-history row (a DB read)
// — are injected, exactly the engine's established scope-boundary house
// style: SessionDeps injects id/clock/rng; the terminator takes a
// pre-computed `hasEligibleItem` rather than the bank. Pulling browser
// code or storage into this URL-free server subtree would break the
// tsconfig.functions.json scope AND the server/browser split. This is a
// deliberate boundary, NOT a contradiction of the `ResultPayload
// .recommendedRoomId` "via existing cefrToRoom.ts" note — it keeps that
// map the single source of truth (the caller passes `roomForCefr`
// straight through; `CefrBand` is string-compatible with the browser
// `ResultCEFR`).
//
// Imports are this series' own modules only (no Deno/URL) ⇒
// tsconfig.functions.json (gate #6) type-checks it; vitest runs goldens.
//
// NO USER-FACING STRINGS: the engine emits stable machine keys
// (`retest.rationale`, `growth.narrativeKey`); the UI owns the
// Vietnamese-first copy (Vietnamese-first is a presentation concern — the
// server must not hard-code VI text).

import {
  CEFR_CUTS,
  L1_SEVERITY_HIGH_ERROR_RATE,
  L1_SEVERITY_MODERATE_ERROR_RATE,
  L1_WEAKNESS_MIN_SEEN,
  MIN_ITEMS_PER_SUBSCORE,
  RETEST_COOLDOWN_DAYS,
} from "../config.ts";
import { evaluateTermination } from "./terminator.ts";
import { eligibleItems, SCORED_TYPES } from "./itemSelector.ts";
import { estimate } from "./thetaEstimator.ts";
import { scoreResponse } from "./scoring.ts";
import { itemById } from "./itemBank.ts";
import type { ScoredItem } from "./irt.ts";
import type {
  CefrBand,
  ItemBank,
  ItemType,
  L1TransferTag,
  L1WeaknessEntry,
  PerSkillScore,
  PlacementHistoryEntry,
  ResultPayload,
  SessionState,
  TerminationReason,
} from "../types.ts";

/**
 * Injected cross-layer facts the URL-free server engine must not reach
 * for itself (same DI seam discipline as `SessionDeps`).
 */
export interface ResultDeps {
  /** Wall-clock ISO instant (drives `createdAt`, `elapsedMs`,
   *  `retest.eligibleAt`). */
  now: () => string;
  /** CEFR band → recommended starting room id. Caller passes
   *  `roomForCefr` from the browser `cefrToRoom.ts` (the single source
   *  of truth, validated against public/data/*.json) — the engine never
   *  imports browser code. */
  recommendedRoomFor: (cefr: CefrBand) => string;
  /** The learner's most recent PRIOR placement-history entry (design
   *  §3.1), or null/undefined for a first-ever test. Drives `growth`;
   *  the caller reads `profiles.placement_history` — the engine stays
   *  storage-free. */
  previous?: PlacementHistoryEntry | null;
}

/** `assembleResult` outcome: the session advanced to `complete` plus the
 *  payload, or an untouched no-op (`result:null`) when called off a
 *  non-`terminating` phase (the engine never throws — same guard
 *  discipline as session.ts / advance.ts). */
export interface ResultOutcome {
  session: SessionState;
  result: ResultPayload | null;
}

/**
 * θ → CEFR band: the first `CEFR_CUTS` entry whose `maxTheta` (EXCLUSIVE
 * upper edge) θ falls under; the last band is unbounded
 * (+Infinity) so this is total (config.ts:84-99 spec, verbatim).
 */
export function cefrForTheta(theta: number): CefrBand {
  for (const cut of CEFR_CUTS) {
    if (theta < cut.maxTheta) return cut.band;
  }
  // Unreachable: the last cut is +Infinity. Defensive, never throws.
  return CEFR_CUTS[CEFR_CUTS.length - 1].band;
}

/** Add N days to an ISO instant, as ISO. */
function isoPlusDays(iso: string, days: number): string {
  return new Date(Date.parse(iso) + days * 86_400_000).toISOString();
}

/**
 * Per-skill subscores (design §2.3). For each SCORED type: gather that
 * type's scored items (decision #3 + L1 discount via `scoreResponse`);
 * `itemsSeen` is the count; `reportable` iff
 * `itemsSeen >= MIN_ITEMS_PER_SUBSCORE`. Reportable → its own EAP/MLE
 * estimate at the session's prior mean; else θ/SE are null (design
 * contract: a subscore on too-few items is noise, not a score).
 */
function perSkillScores(
  bank: ItemBank,
  session: SessionState,
): PerSkillScore[] {
  const byType = new Map<ItemType, ScoredItem[]>();
  for (const t of SCORED_TYPES) byType.set(t, []);

  for (const resp of session.administered) {
    const item = itemById(bank, resp.itemId);
    if (item === null) continue;
    const scored = scoreResponse(item, resp);
    if (scored === null) continue; // writing_sample / null-correct
    byType.get(item.type)?.push(scored);
  }

  return SCORED_TYPES.map((skill): PerSkillScore => {
    const data = byType.get(skill) ?? [];
    const itemsSeen = data.length;
    const reportable = itemsSeen >= MIN_ITEMS_PER_SUBSCORE;
    if (!reportable) {
      return { skill, theta: null, se: null, itemsSeen, reportable: false };
    }
    const est = estimate(data, { priorMean: session.priorMean });
    return {
      skill,
      theta: est.theta,
      se: est.se,
      itemsSeen,
      reportable: true,
    };
  });
}

/**
 * Vietnamese-L1-transfer weakness diagnostic (types.ts §2.3). For every
 * `l1Tag` the learner actually saw: `seen` responses, `correct` =
 * scored-as-u=1 (the SAME scoring as θ — a crutch-assisted correct is
 * NOT mastery, by the L1-revealed discount), `errorRate` =
 * (seen−correct)/seen. Severity by the PROVISIONAL config bands, with the
 * `L1_WEAKNESS_MIN_SEEN` floor so one wrong answer is not "high".
 * Deterministic order: errorRate desc, then tag lexicographic.
 */
function l1Weaknesses(
  bank: ItemBank,
  session: SessionState,
): L1WeaknessEntry[] {
  const seen = new Map<L1TransferTag, number>();
  const correct = new Map<L1TransferTag, number>();

  for (const resp of session.administered) {
    const item = itemById(bank, resp.itemId);
    if (item === null || !item.l1Tags || item.l1Tags.length === 0) continue;
    const scored = scoreResponse(item, resp);
    if (scored === null) continue; // unscored — no L1 signal
    for (const tag of item.l1Tags) {
      seen.set(tag, (seen.get(tag) ?? 0) + 1);
      if (scored.u === 1) correct.set(tag, (correct.get(tag) ?? 0) + 1);
    }
  }

  const entries: L1WeaknessEntry[] = [];
  for (const [tag, n] of seen) {
    const c = correct.get(tag) ?? 0;
    const errorRate = (n - c) / n;
    const severity: L1WeaknessEntry["severity"] =
      n >= L1_WEAKNESS_MIN_SEEN && errorRate >= L1_SEVERITY_HIGH_ERROR_RATE
        ? "high"
        : n >= L1_WEAKNESS_MIN_SEEN &&
            errorRate >= L1_SEVERITY_MODERATE_ERROR_RATE
          ? "moderate"
          : "low";
    entries.push({ tag, seen: n, correct: c, errorRate, severity });
  }

  return entries.sort((a, b) =>
    b.errorRate !== a.errorRate
      ? b.errorRate - a.errorRate
      : a.tag < b.tag
        ? -1
        : a.tag > b.tag
          ? 1
          : 0,
  );
}

/** Re-derive the `TerminationReason` from the FINAL settled state — a
 *  pure function of SE / answered counts / remaining bank, so no extra
 *  `SessionState` field is needed (and a resumed-from-DB session, which
 *  carries no reason, still resolves identically). */
function terminationReasonFor(
  bank: ItemBank,
  session: SessionState,
): TerminationReason {
  const decision = evaluateTermination({
    se: session.current.se,
    typeCounts: session.typeCounts,
    hasEligibleItem: eligibleItems(bank, session.servedItemIds).length > 0,
  });
  // A legitimately `terminating` session always satisfies a stop reason
  // (advance.ts / applySelfRating only enter `terminating` via one).
  // `bank_exhausted` is the safe deterministic floor if a future change
  // ever lands here non-stopping — never throws.
  return decision.reason ?? "bank_exhausted";
}

/**
 * Finalize a `terminating` session → `ResultPayload` + phase `complete`.
 *
 * Guard: callable only from `terminating` (the settled-but-not-finalized
 * phase `advance`/`applySelfRating` produce). From any other phase it is
 * a no-op — `{ session, result:null }`, session reference untouched (the
 * engine never throws; the edge fn owns not double-finalizing). This
 * mirrors session.ts:applySelfRating's idempotent guard.
 *
 * `overall` reports the WORKING estimate that drove the stop
 * (`session.current` — the EAP/MLE of record, never re-rolled here so the
 * reported number is exactly the one the terminator acted on).
 * `itemsAdministered` is the SCORED count (θ-contributing — the engine's
 * "administered == scored" convention, same as the terminator's
 * `administeredCount`; writing samples are post-test, not "administered"
 * for measurement).
 */
export function assembleResult(
  session: SessionState,
  bank: ItemBank,
  deps: ResultDeps,
): ResultOutcome {
  if (session.phase !== "terminating") {
    return { session, result: null };
  }

  const createdAt = deps.now();
  const { theta, se } = session.current;
  const cefr = cefrForTheta(theta);

  let scoredCount = 0;
  for (const resp of session.administered) {
    const item = itemById(bank, resp.itemId);
    if (item !== null && scoreResponse(item, resp) !== null) scoredCount++;
  }

  const elapsedMs = Math.max(
    0,
    Date.parse(createdAt) - Date.parse(session.startedAt),
  );

  const prev = deps.previous ?? null;
  const growth: ResultPayload["growth"] =
    prev && prev.theta !== null
      ? {
          fromCefr: prev.cefr,
          toCefr: cefr,
          deltaTheta: theta - prev.theta,
          sinceISO: prev.ts,
          narrativeKey:
            theta - prev.theta > 0
              ? "growth_up"
              : theta - prev.theta < 0
                ? "growth_down"
                : "growth_flat",
        }
      : null;

  const result: ResultPayload = {
    sessionId: session.sessionId,
    bankVersion: session.bankVersion,
    overall: { cefr, theta, se },
    perSkill: perSkillScores(bank, session),
    l1Weaknesses: l1Weaknesses(bank, session),
    recommendedRoomId: deps.recommendedRoomFor(cefr),
    itemsAdministered: scoredCount,
    elapsedMs,
    terminationReason: terminationReasonFor(bank, session),
    retest: {
      eligibleAt: isoPlusDays(createdAt, RETEST_COOLDOWN_DAYS),
      rationale: `retest_cooldown_${RETEST_COOLDOWN_DAYS}d`,
    },
    growth,
    createdAt,
  };

  return {
    session: { ...session, phase: "complete", updatedAt: createdAt },
    result,
  };
}
