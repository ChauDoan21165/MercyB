import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePlacementSubmit } from "../usePlacementSubmit";
import { submitResponse } from "@/lib/placement/v3/clientStub";
import type { PlacementV3ResponsePayload, PlacementV3SubmitResult } from "@/lib/placement/v3/types";

vi.mock("@/lib/placement/v3/clientStub", () => ({
  submitResponse: vi.fn(),
}));

const mockedSubmitResponse = vi.mocked(submitResponse);

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function payload(overrides: Partial<PlacementV3ResponsePayload> = {}): PlacementV3ResponsePayload {
  return {
    sessionId: "session-1",
    taskId: "task-1",
    modality: "writing",
    value: "I study English every day.",
    ...overrides,
  };
}

beforeEach(() => {
  mockedSubmitResponse.mockReset();
  window.sessionStorage.clear();
});

afterEach(() => {
  window.sessionStorage.clear();
});

describe("usePlacementSubmit", () => {
  it("blocks rapid double-submit with one in-flight request", async () => {
    const gate = deferred<PlacementV3SubmitResult>();
    mockedSubmitResponse.mockReturnValueOnce(gate.promise);
    const { result } = renderHook(() => usePlacementSubmit());
    const body = payload();

    let first!: Promise<PlacementV3SubmitResult | null>;
    let second!: Promise<PlacementV3SubmitResult | null>;
    act(() => {
      first = result.current.submit(body);
      second = result.current.submit(body);
    });

    expect(mockedSubmitResponse).toHaveBeenCalledTimes(1);
    gate.resolve({
      session: {
        sessionId: "session-1",
        status: "in_progress",
        currentTask: null,
        answeredCount: 1,
        estimatedTotal: 11,
        modalityIndex: 0,
        modalities: ["writing", "speaking", "reading", "listening", "conversation"],
        startedAt: "2026-05-20T12:00:00.000Z",
        expiresAt: "2026-05-21T12:00:00.000Z",
      },
      completed: false,
    });

    await act(async () => {
      await first;
      await second;
    });
    expect(result.current.submitting).toBe(false);
  });

  it("preserves the last payload across a transient 500 retry", async () => {
    const body = payload({ value: "Retry after 500." });
    mockedSubmitResponse
      .mockRejectedValueOnce(new Error("Placement request failed (500)"))
      .mockResolvedValueOnce({
        session: {
          sessionId: "session-1",
          status: "in_progress",
          currentTask: null,
          answeredCount: 1,
          estimatedTotal: 11,
          modalityIndex: 0,
          modalities: ["writing", "speaking", "reading", "listening", "conversation"],
          startedAt: "2026-05-20T12:00:00.000Z",
          expiresAt: "2026-05-21T12:00:00.000Z",
        },
        completed: false,
      });

    const { result } = renderHook(() => usePlacementSubmit());

    await act(async () => {
      await result.current.submit(body);
    });

    expect(result.current.error).toContain("500");
    expect(result.current.canRetry).toBe(true);

    await act(async () => {
      await result.current.retry();
    });

    expect(mockedSubmitResponse).toHaveBeenCalledTimes(2);
    expect(mockedSubmitResponse.mock.calls[0][0]).toMatchObject(body);
    expect(mockedSubmitResponse.mock.calls[1][0]).toMatchObject(body);
  });

  it("preserves the last payload across a network drop retry", async () => {
    const body = payload({ value: "Retry after network drop." });
    mockedSubmitResponse
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce({
        session: {
          sessionId: "session-1",
          status: "in_progress",
          currentTask: null,
          answeredCount: 1,
          estimatedTotal: 11,
          modalityIndex: 0,
          modalities: ["writing", "speaking", "reading", "listening", "conversation"],
          startedAt: "2026-05-20T12:00:00.000Z",
          expiresAt: "2026-05-21T12:00:00.000Z",
        },
        completed: false,
      });

    const { result } = renderHook(() => usePlacementSubmit());

    await act(async () => {
      await result.current.submit(body);
    });

    expect(result.current.error).toContain("Failed to fetch");
    await act(async () => {
      await result.current.retry();
    });

    expect(mockedSubmitResponse).toHaveBeenCalledTimes(2);
    expect(mockedSubmitResponse.mock.calls[0][0]).toMatchObject(body);
    expect(mockedSubmitResponse.mock.calls[1][0]).toMatchObject(body);
  });

  it("clears stale retry payload after completed grading succeeds", async () => {
    const body = payload({ value: "Completed answer." });
    mockedSubmitResponse.mockResolvedValueOnce({
      session: {
        sessionId: "session-1",
        status: "completed",
        currentTask: null,
        answeredCount: 11,
        estimatedTotal: 11,
        modalityIndex: 4,
        modalities: ["writing", "speaking", "reading", "listening", "conversation"],
        startedAt: "2026-05-20T12:00:00.000Z",
        expiresAt: "2026-05-21T12:00:00.000Z",
      },
      completed: true,
      results: {
        sessionId: "session-1",
        overallCefr: "B1",
        overallConfidence: 0.82,
        overallSummary: { en: "Ready for B1 practice.", vi: "San sang luyen tap B1." },
        skills: [],
        l1Flags: [],
        recommendations: [],
        strengths: [],
        gaps: [],
        questionCount: 11,
        completedAt: "2026-05-20T12:03:00.000Z",
      },
    });

    const first = renderHook(() => usePlacementSubmit());
    await act(async () => {
      await first.result.current.submit(body);
    });
    expect(first.result.current.canRetry).toBe(false);
    first.unmount();

    const second = renderHook(() => usePlacementSubmit());
    expect(second.result.current.canRetry).toBe(false);
  });

  it("restores a pending payload after refresh during an in-flight submit", async () => {
    const body = payload({ value: "Refresh-safe payload." });
    const gate = deferred<PlacementV3SubmitResult>();
    mockedSubmitResponse.mockReturnValueOnce(gate.promise);

    const first = renderHook(() => usePlacementSubmit());
    await act(async () => {
      void first.result.current.submit(body);
    });
    expect(first.result.current.submitting).toBe(true);
    first.unmount();

    const second = renderHook(() => usePlacementSubmit());
    expect(second.result.current.canRetry).toBe(true);

    mockedSubmitResponse.mockResolvedValueOnce({
      session: {
        sessionId: "session-1",
        status: "in_progress",
        currentTask: null,
        answeredCount: 1,
        estimatedTotal: 11,
        modalityIndex: 0,
        modalities: ["writing", "speaking", "reading", "listening", "conversation"],
        startedAt: "2026-05-20T12:00:00.000Z",
        expiresAt: "2026-05-21T12:00:00.000Z",
      },
      completed: false,
    });

    await act(async () => {
      await second.result.current.retry();
    });

    expect(mockedSubmitResponse).toHaveBeenCalledTimes(2);
    expect(mockedSubmitResponse.mock.calls[1][0]).toMatchObject(body);
    gate.resolve({
      session: {
        sessionId: "session-1",
        status: "in_progress",
        currentTask: null,
        answeredCount: 1,
        estimatedTotal: 11,
        modalityIndex: 0,
        modalities: ["writing", "speaking", "reading", "listening", "conversation"],
        startedAt: "2026-05-20T12:00:00.000Z",
        expiresAt: "2026-05-21T12:00:00.000Z",
      },
      completed: false,
    });
  });
});
