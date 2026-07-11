import { describe, expect, it, vi, afterEach } from "vitest";
import {
  NetworkTimeoutError,
  fetchWithTimeout,
  invokeFunctionWithTimeout,
} from "../networkTimeout";

describe("network timeout helpers", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("aborts fetch calls and surfaces a timeout error", async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("aborted", "AbortError"));
        });
      });
    }) as unknown as typeof fetch;

    const result = fetchWithTimeout("/api/example", {
      method: "POST",
      timeoutMs: 25,
      fetchImpl,
    });

    const assertion = expect(result).rejects.toMatchObject({
      name: "NetworkTimeoutError",
      reason: "timeout",
    });
    await vi.advanceTimersByTimeAsync(25);
    await assertion;
    expect(fetchImpl).toHaveBeenCalledWith(
      "/api/example",
      expect.objectContaining({
        method: "POST",
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("passes an abort signal to Supabase function invokes", async () => {
    vi.useFakeTimers();
    const invoke = vi.fn((_functionName: string, options?: { signal?: AbortSignal }) => {
      return new Promise<{ data: null; error: null }>((_resolve, reject) => {
        options?.signal?.addEventListener("abort", () => {
          reject(new DOMException("aborted", "AbortError"));
        });
      });
    });

    const result = invokeFunctionWithTimeout(
      { functions: { invoke } },
      "mercy-guide",
      { body: { message: "hello" } },
      30,
    );

    const assertion = expect(result).rejects.toBeInstanceOf(NetworkTimeoutError);
    await vi.advanceTimersByTimeAsync(30);
    await assertion;
    expect(invoke).toHaveBeenCalledWith(
      "mercy-guide",
      expect.objectContaining({
        body: { message: "hello" },
        signal: expect.any(AbortSignal),
      }),
    );
  });
});
