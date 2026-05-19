// src/lib/placement/v2/flow.ts
//
// Placement Test v2 — the pure, framework-agnostic adaptive-loop
// controller (Phase 2, PR 10).
//
// This is PR 10's testable BRAIN and the client's only stateful caller —
// so client.ts is NOT dead wiring (CLAUDE.md keywordResponder trap): the
// flow drives it end-to-end and the vitest goldens drive the flow. A
// React hook + the placement pages + the `PLACEMENT_TEST_ENABLED` flag
// are DELIBERATELY PR 11 (re-surfacing is gated on #658); shipping an
// unmounted React hook now would BE dead UI, so it is deferred to where
// it is actually mounted. The pure controller here carries every loop
// decision, so PR 11 is a thin React binding over `getState()` +
// `begin/rate/submit/abandon`.
//
// PURE + DI: the ONLY effectful input is an injected `PlacementClient`
// (client.ts's interface; tests pass a scripted fake). No clock, no
// random, no React — deterministic, golden-testable, the locked engine/
// orchestrator discipline.
//
// ── RECONSTRUCTION FLAG #3 (docs ephemeral — same transparency as
//    #712/#718/#724/#728 and PR 9 flags #4/#5) ─────────────────────────
// RESUME = CONTINUATION, never re-serve. PR 9 (#728) proved the #678
// schema persists no in-flight-item anchor, so `/start` on a non-stale
// `in_progress` session returns `{ resumed:true, item:null }`. This flow
// FAITHFULLY surfaces that: `status:'in_progress', resumed:true,
// item:null`. It does NOT fabricate or guess an item — the UI (PR 11)
// re-presents the `PublicItem` it still holds in memory and calls
// `submit()` with it; the edge fn's per-request anchor reconstruction
// (PR 9 flag #4) validates + advances. `submit()` therefore never
// requires `state.item` to be non-null (the caller owns the rendered
// item) — modelling anything stricter would contradict the merged
// server contract.
//
// DEDUP: an `AnswerResponse` with `deduplicated:true` (stale/duplicate/
// unknown submit the engine no-op'd) is a true no-op here — phase/item
// unchanged, a transient `lastDeduplicated` flag raised so the UI can
// re-prompt the same item. TERMINATING-without-result (core.ts's rare
// defensive path) auto-finalizes via `client.result()` so the loop never
// strands the learner.

import type {
  ClientError,
  ClientResponse,
  PublicItem,
  ResultPayload,
  SelfRating,
  SessionPhase,
} from "./types";
import type { PlacementClient } from "./client";

export type FlowStatus =
  | "idle"
  | "starting"
  | "awaiting_self_rating"
  | "in_progress"
  | "submitting"
  | "complete"
  | "abandoned"
  | "error";

export interface PlacementFlowState {
  status: FlowStatus;
  sessionId: string | null;
  /** The item to render now. May be null on a resumed in_progress
   *  session — the UI re-presents its held item (flag #3). */
  item: PublicItem | null;
  result: ResultPayload | null;
  error: ClientError | null;
  /** True once a pre-existing unfinished session was resumed. */
  resumed: boolean;
  /** True for exactly the snapshot after a no-op (deduplicated) submit;
   *  cleared on the next successful transition. */
  lastDeduplicated: boolean;
  /** Count of answers the server accepted (advanced on). */
  answeredCount: number;
}

function initialState(): PlacementFlowState {
  return {
    status: "idle",
    sessionId: null,
    item: null,
    result: null,
    error: null,
    resumed: false,
    lastDeduplicated: false,
    answeredCount: 0,
  };
}

/** Map a server phase + payload onto the flow status. Centralised so
 *  every endpoint resolves phases identically. */
function statusForPhase(
  phase: SessionPhase,
  hasResult: boolean,
): FlowStatus {
  switch (phase) {
    case "awaiting_self_rating":
      return "awaiting_self_rating";
    case "in_progress":
      return "in_progress";
    case "complete":
      return "complete";
    case "abandoned":
      return "abandoned";
    case "terminating":
      // Settled-but-not-finalized — only ever transient here; treated as
      // complete iff the result already came back, else the caller path
      // auto-finalizes via /result.
      return hasResult ? "complete" : "in_progress";
  }
}

export interface PlacementFlow {
  getState(): PlacementFlowState;
  /** Start (or resume) a session. Optional `selfRating` short-circuits
   *  the self-rating step server-side (one round-trip to the first
   *  item). */
  begin(opts?: { selfRating?: SelfRating }): Promise<PlacementFlowState>;
  /** Answer the awaiting self-rating prompt. */
  rate(rating: SelfRating): Promise<PlacementFlowState>;
  /** Submit the answer for the item the caller is presenting. */
  submit(response: ClientResponse): Promise<PlacementFlowState>;
  /** Idempotent fetch/finalize of the result for a settled session. */
  refreshResult(): Promise<PlacementFlowState>;
  /** Explicitly abandon the in-flight session. */
  abandon(): Promise<PlacementFlowState>;
}

export function createPlacementFlow(client: PlacementClient): PlacementFlow {
  let state = initialState();
  const set = (patch: Partial<PlacementFlowState>): PlacementFlowState => {
    state = { ...state, ...patch };
    return state;
  };

  function fail(error: ClientError): PlacementFlowState {
    return set({ status: "error", error, lastDeduplicated: false });
  }

  return {
    getState: () => state,

    async begin(opts) {
      set({ status: "starting", error: null, lastDeduplicated: false });
      const r = await client.start(opts);
      if (!r.ok) return fail(r.error);
      const d = r.data;
      return set({
        sessionId: d.sessionId,
        resumed: d.resumed,
        item: d.item,
        result: null,
        error: null,
        status: statusForPhase(d.phase, false),
      });
    },

    async rate(rating) {
      if (!state.sessionId) {
        return fail({ kind: "validation", code: "no_session" });
      }
      set({ status: "submitting", error: null, lastDeduplicated: false });
      const r = await client.selfRating(state.sessionId, rating);
      if (!r.ok) return fail(r.error);
      const d = r.data;
      return set({
        item: d.item,
        status: statusForPhase(d.phase, false),
      });
    },

    async submit(response) {
      if (!state.sessionId) {
        return fail({ kind: "validation", code: "no_session" });
      }
      set({ status: "submitting", error: null, lastDeduplicated: false });
      const r = await client.answer(state.sessionId, response);
      if (!r.ok) return fail(r.error);
      const d = r.data;

      if (d.deduplicated) {
        // No-op: stale/duplicate/unknown submit the engine refused.
        // Keep phase + item; let the UI re-prompt the same item.
        return set({
          status: statusForPhase(d.phase, false),
          lastDeduplicated: true,
        });
      }

      if (d.result) {
        return set({
          item: null,
          result: d.result,
          status: "complete",
          answeredCount: state.answeredCount + 1,
        });
      }

      if (d.phase === "terminating") {
        // Rare defensive server path: terminating w/o a payload — finalize.
        set({ answeredCount: state.answeredCount + 1 });
        return this.refreshResult();
      }

      return set({
        item: d.item,
        status: statusForPhase(d.phase, false),
        answeredCount: state.answeredCount + 1,
      });
    },

    async refreshResult() {
      if (!state.sessionId) {
        return fail({ kind: "validation", code: "no_session" });
      }
      const r = await client.result(state.sessionId);
      if (!r.ok) return fail(r.error);
      return set({
        item: null,
        result: r.data.result,
        status: "complete",
        error: null,
      });
    },

    async abandon() {
      if (!state.sessionId) {
        return set({ status: "abandoned" });
      }
      const r = await client.abandon(state.sessionId);
      if (!r.ok) return fail(r.error);
      return set({ status: "abandoned", item: null });
    },
  };
}
