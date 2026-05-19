// src/lib/placement/v2/types.ts
//
// Placement Test v2 — BROWSER-FACING contract types (Phase 2, PR 10).
//
// PR 10 is the browser counterpart of PR 9 (the edge orchestrator): a
// typed client + a pure adaptive-loop controller for the
// `placement-session` edge function. It is DELIBERATELY UI-FREE and does
// NOT touch `FEATURE_FLAGS.PLACEMENT_TEST_ENABLED` — re-surfacing the
// test (pages + flipping/gating that #658 flag) is PR 11. PR 10 lands
// vitest-tested but unmounted, exactly the series' "land the tested unit,
// wire it later" discipline (types.ts PR1 "No file imports this yet →
// zero behavior change"; the engine PRs 3-8; the orchestrator PR 9, which
// had no browser caller until now). The test suite here is its caller —
// not the keywordResponder dead-wiring trap (CLAUDE.md), because flow.ts
// is a fully exercised pure unit.
//
// ── RECONSTRUCTION FLAG #1 (sequence/architecture docs are ephemeral —
//    itemSelector.ts:33 confirms; same transparency as #712 randomesqueK
//    / #718 terminator precedence / #724 L1-bands / #728 cefr mirror) ──
// These interfaces MIRROR the server contract in
// `supabase/functions/placement-session/types.ts` (the PublicItem /
// ResultPayload the edge fn returns). The server module is NOT
// browser-importable: `tsconfig.json` excludes `"supabase"`, so a
// cross-import would ship un-type-checked, and dragging server types
// into the browser bundle is the wrong layer boundary (identical
// rationale to PR 9's CEFR_TO_ROOM_SERVER mirror — the URL-free server
// subtree and the browser bundle are deliberately separate). So this is
// a hand-mirrored, structurally-compatible copy of the BROWSER-VISIBLE
// subset only (no answer key, no IRT params — PublicItem already strips
// those server-side). KEEP STRUCTURALLY EQUAL to the server `PublicItem`
// / `ResultPayload`; the response field names are pinned 1:1 to the
// merged `core.ts` JSON envelopes (verified against #728 on main).

/** Mirrors server `ItemType` (types.ts). */
export type ItemType =
  | "reading"
  | "listening"
  | "grammar"
  | "vocabulary"
  | "writing_sample";

/** Mirrors server `CefrBand`. */
export type CefrBand = "pre_a1" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

/** Mirrors server `SelfRating`. */
export type SelfRating =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "not_sure";

/** Mirrors server `SessionPhase`. */
export type SessionPhase =
  | "awaiting_self_rating"
  | "in_progress"
  | "terminating"
  | "complete"
  | "abandoned";

/** Mirrors server `TerminationReason`. */
export type TerminationReason = "precision" | "max_items" | "bank_exhausted";

/** Mirrors server `L1TransferTag`. Kept as a widenable string union — the
 *  browser only ever displays these; never renumber/remove (parity with
 *  the server type's own contract). */
export type L1TransferTag =
  | "article_use"
  | "plural_s"
  | "third_person_s"
  | "past_ed_regular"
  | "past_irregular"
  | "question_word_order"
  | "vowel_discrimination"
  | "false_friend"
  | "preposition_transfer";

export interface Bilingual {
  en: string;
  vi: string;
}

export interface ItemOption {
  id: string;
  en: string;
  vi: string;
}

/**
 * Mirrors server `PublicItem` — the ONLY item shape the client ever
 * receives (the edge fn stripped `correctOptionId` / `transcript` / IRT
 * params / authoring meta server-side; this type structurally CANNOT
 * carry them, the browser mirror of that allow-list guarantee).
 */
export interface PublicItem {
  id: string;
  type: ItemType;
  skill: "reading" | "listening" | "grammar" | "vocabulary" | "writing";
  prompt: Bilingual;
  passage?: Bilingual;
  options?: ItemOption[];
  audio?: { key: string; replayLimit: number };
  timeLimitMs?: number;
}

/**
 * What the client SENDS for an answered item. Mirrors server `Response`
 * (types.ts:128). `correct` is null for a writing sample (decision #3).
 * `shownAt`/`answeredAt` are ISO strings (the server's idempotency /
 * timing anchors); `l1RevealedUsed` = the learner pressed the VI crutch.
 */
export interface ClientResponse {
  itemId: string;
  correct: boolean | null;
  selectedOptionId?: string;
  responseMs: number;
  timedOut: boolean;
  l1RevealedUsed: boolean;
  audioPlays?: number;
  shownAt: string;
  answeredAt: string;
}

export interface PerSkillScore {
  skill: ItemType;
  theta: number | null;
  se: number | null;
  itemsSeen: number;
  reportable: boolean;
}

export interface L1WeaknessEntry {
  tag: L1TransferTag;
  seen: number;
  correct: number;
  errorRate: number;
  severity: "low" | "moderate" | "high";
}

/** Mirrors server `ResultPayload` (types.ts §2.3). Machine keys only —
 *  the UI owns the Vietnamese-first copy for `retest.rationale` /
 *  `growth.narrativeKey` (server hard-codes no VI text). */
export interface ResultPayload {
  sessionId: string;
  bankVersion: string;
  overall: { cefr: CefrBand; theta: number; se: number };
  perSkill: PerSkillScore[];
  l1Weaknesses: L1WeaknessEntry[];
  recommendedRoomId: string;
  itemsAdministered: number;
  elapsedMs: number;
  terminationReason: TerminationReason;
  retest: { eligibleAt: string; rationale: string };
  growth:
    | null
    | {
        fromCefr: CefrBand;
        toCefr: CefrBand;
        deltaTheta: number;
        sinceISO: string;
        narrativeKey: string;
      };
  createdAt: string;
}

// ── Edge JSON envelopes — field names pinned 1:1 to the merged core.ts
//    (verified against #728 on main; line refs are core.ts) ────────────

/** `POST /start` 200 (core.ts:496-502 / :476-482 resume). */
export interface StartResponse {
  sessionId: string;
  phase: SessionPhase;
  item: PublicItem | null;
  bankVersion: string;
  /** true ⇒ an existing unfinished session was resumed; on a non-stale
   *  `in_progress` resume `item` is null and the UI re-presents the item
   *  it already holds (PR 9 flag #4/#5 — there is no persisted anchor). */
  resumed: boolean;
}

/** `POST /self-rating` 200 (core.ts:532-536). */
export interface SelfRatingResponse {
  sessionId: string;
  phase: SessionPhase;
  item: PublicItem | null;
}

/** `POST /answer` 200 (core.ts:616-620 continue / :650-654 finalize /
 *  :583-588 dedup). `deduplicated` ⇒ a stale/duplicate/unknown submit
 *  was a no-op; nothing was appended. */
export interface AnswerResponse {
  sessionId: string;
  phase: SessionPhase;
  item: PublicItem | null;
  result: ResultPayload | null;
  deduplicated?: boolean;
}

/** `POST /result` 200 (core.ts:650 / handleResult). */
export interface ResultResponse {
  sessionId: string;
  phase: SessionPhase;
  result: ResultPayload;
}

/** `POST /abandon` 200 (core.ts handleAbandon). */
export interface AbandonResponse {
  ok: true;
}

/** Any non-2xx structured body (core.ts `json({error,...}, status)`).
 *  `auth_required` carries bilingual messages (401). */
export interface EdgeErrorBody {
  error: string;
  message?: string;
  message_vi?: string;
  phase?: SessionPhase;
}

/** Discriminated client outcome. `kind` lets the flow controller / UI
 *  branch without inspecting HTTP internals. */
export type ClientError =
  | { kind: "auth_required"; message: string; messageVi: string }
  | { kind: "validation"; code: string }
  | { kind: "not_found" }
  | { kind: "conflict"; phase?: SessionPhase }
  | { kind: "network" }
  | { kind: "timeout" }
  | { kind: "bad_response"; status: number }
  | { kind: "server"; status: number; code?: string };

export type ClientResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ClientError };
