// src/hooks/__tests__/usePlacementSession.test.tsx
//
// PR 11 — the React adapter is a THIN binding: it must mirror
// flow.getState() and re-render after each action, owning no logic. A
// scripted fake PlacementFlow (DI seam) proves exactly that, with no
// client/network.

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { usePlacementSession } from "../usePlacementSession";
import type { PlacementFlow, PlacementFlowState } from "@/lib/placement/v2/flow";

function mkState(p: Partial<PlacementFlowState>): PlacementFlowState {
  return {
    status: "idle",
    sessionId: null,
    item: null,
    result: null,
    error: null,
    resumed: false,
    lastDeduplicated: false,
    answeredCount: 0,
    ...p,
  };
}

/** Fake flow: each method resolves the next scripted snapshot and also
 *  becomes what getState() returns (mirrors the real flow's mutate-then-
 *  return contract). */
function fakeFlow(steps: {
  initial?: PlacementFlowState;
  begin?: PlacementFlowState;
  rate?: PlacementFlowState;
  submit?: PlacementFlowState;
  abandon?: PlacementFlowState;
}): PlacementFlow {
  let cur = steps.initial ?? mkState({});
  const step = (s?: PlacementFlowState) => {
    if (s) cur = s;
    return cur;
  };
  return {
    getState: () => cur,
    begin: async () => step(steps.begin),
    rate: async () => step(steps.rate),
    submit: async () => step(steps.submit),
    refreshResult: async () => cur,
    abandon: async () => step(steps.abandon),
  };
}

describe("usePlacementSession", () => {
  it("seeds state from flow.getState()", () => {
    const flow = fakeFlow({ initial: mkState({ status: "idle" }) });
    const { result } = renderHook(() =>
      usePlacementSession({ flowFactory: () => flow }),
    );
    expect(result.current.state.status).toBe("idle");
  });

  it("begin → publishes the new snapshot (re-render)", async () => {
    const flow = fakeFlow({
      begin: mkState({ status: "in_progress", sessionId: "s1", item: { id: "i1", type: "grammar", skill: "grammar", prompt: { en: "Q", vi: "C" } } }),
    });
    const { result } = renderHook(() =>
      usePlacementSession({ flowFactory: () => flow }),
    );
    await act(async () => {
      await result.current.begin({ selfRating: "intermediate" });
    });
    expect(result.current.state.status).toBe("in_progress");
    expect(result.current.state.sessionId).toBe("s1");
    expect(result.current.state.item?.id).toBe("i1");
  });

  it("submit then abandon each re-render with the flow's snapshot", async () => {
    const flow = fakeFlow({
      submit: mkState({ status: "complete", sessionId: "s1", answeredCount: 3 }),
      abandon: mkState({ status: "abandoned", sessionId: "s1" }),
    });
    const { result } = renderHook(() =>
      usePlacementSession({ flowFactory: () => flow }),
    );
    await act(async () => {
      await result.current.submit({
        itemId: "i1",
        correct: null,
        responseMs: 800,
        timedOut: false,
        l1RevealedUsed: false,
        shownAt: "2026-05-19T00:00:00.000Z",
        answeredAt: "2026-05-19T00:00:01.000Z",
      });
    });
    expect(result.current.state.status).toBe("complete");
    expect(result.current.state.answeredCount).toBe(3);
    await act(async () => {
      await result.current.abandon();
    });
    expect(result.current.state.status).toBe("abandoned");
  });

  it("creates the flow exactly once across re-renders", async () => {
    let made = 0;
    const flow = fakeFlow({ rate: mkState({ status: "in_progress", sessionId: "s1" }) });
    const { result, rerender } = renderHook(() =>
      usePlacementSession({
        flowFactory: () => {
          made++;
          return flow;
        },
      }),
    );
    rerender();
    await act(async () => {
      await result.current.rate("beginner");
    });
    rerender();
    expect(made).toBe(1);
  });
});
