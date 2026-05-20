// src/hooks/usePlacementSession.ts
//
// Placement Test v2 — the React adapter over PR 10's pure flow (Phase 2,
// PR 11 — the FINAL slice of the 11-PR series).
//
// PR 10 (#732) shipped `createPlacementFlow(createPlacementClient())` —
// a framework-agnostic, fully vitest-tested state machine. This hook is
// the thin React binding the PR-10 header named ("PR 11 is a thin React
// binding over getState() + begin/rate/submit/abandon"). It owns ZERO
// placement logic: every transition still lives in flow.ts; this only
// mirrors `flow.getState()` into React state and re-renders after each
// action. That keeps the brain pure + golden-tested and this layer
// trivially correct.
//
// DI seam (the locked discipline, PRs 3-10): `flowFactory` is injectable
// so a test passes a scripted fake flow with no client/network. Default
// = the real client. The flow instance is created ONCE per mount
// (useRef) — a placement session is a single continuous lifecycle, not
// re-created on every render.

import { useCallback, useRef, useState } from "react";

import { createPlacementClient } from "@/lib/placement/v2/client";
import {
  createPlacementFlow,
  type PlacementFlow,
  type PlacementFlowState,
} from "@/lib/placement/v2/flow";
import type { ClientResponse, SelfRating } from "@/lib/placement/v2/types";

export interface UsePlacementSessionOptions {
  /** Test seam — defaults to the real edge-backed flow. */
  flowFactory?: () => PlacementFlow;
}

export interface UsePlacementSession {
  state: PlacementFlowState;
  begin: (opts?: { selfRating?: SelfRating }) => Promise<void>;
  rate: (rating: SelfRating) => Promise<void>;
  submit: (response: ClientResponse) => Promise<void>;
  refreshResult: () => Promise<void>;
  abandon: () => Promise<void>;
}

export function usePlacementSession(
  opts?: UsePlacementSessionOptions,
): UsePlacementSession {
  // One flow per mounted session (the lifecycle is continuous).
  const flowRef = useRef<PlacementFlow | null>(null);
  if (flowRef.current === null) {
    flowRef.current = opts?.flowFactory
      ? opts.flowFactory()
      : createPlacementFlow(createPlacementClient());
  }
  const flow = flowRef.current;

  const [state, setState] = useState<PlacementFlowState>(() =>
    flow.getState(),
  );

  // Every action delegates to the pure flow, then publishes the new
  // immutable snapshot. flow methods never throw (they fold errors into
  // `status:'error'`), so no try/catch is needed here.
  const begin = useCallback(
    async (o?: { selfRating?: SelfRating }) => {
      setState(await flow.begin(o));
    },
    [flow],
  );
  const rate = useCallback(
    async (rating: SelfRating) => {
      setState(await flow.rate(rating));
    },
    [flow],
  );
  const submit = useCallback(
    async (response: ClientResponse) => {
      setState(await flow.submit(response));
    },
    [flow],
  );
  const refreshResult = useCallback(async () => {
    setState(await flow.refreshResult());
  }, [flow]);
  const abandon = useCallback(async () => {
    setState(await flow.abandon());
  }, [flow]);

  return { state, begin, rate, submit, refreshResult, abandon };
}
