// src/lib/pronunciation/__tests__/streamingScorer.test.ts
//
// Tests for the pure helpers + the WebSocket lifecycle in
// streamingScorer.ts. WebSocket transport is exercised against a tiny
// in-test mock that mirrors the wire protocol, so these tests are
// hermetic.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createPronunciationStream,
  float32ToInt16Pcm,
  isSlowConnection,
  shouldAbortToFallback,
  FIRST_PARTIAL_WARN_MS,
} from "../streamingScorer";

// ── Pure-helper tests (no WebSocket) ─────────────────────────────────────

describe("float32ToInt16Pcm", () => {
  it("converts neutral zero to 0", () => {
    const out = float32ToInt16Pcm(new Float32Array([0]));
    expect(out[0]).toBe(0);
  });

  it("converts +1.0 to 32767 (Int16 max)", () => {
    const out = float32ToInt16Pcm(new Float32Array([1.0]));
    expect(out[0]).toBe(0x7fff);
  });

  it("converts -1.0 to -32768 (Int16 min)", () => {
    const out = float32ToInt16Pcm(new Float32Array([-1.0]));
    expect(out[0]).toBe(-0x8000);
  });

  it("clamps overshoot above +1 to Int16 max", () => {
    const out = float32ToInt16Pcm(new Float32Array([5.0]));
    expect(out[0]).toBe(0x7fff);
  });

  it("clamps overshoot below -1 to Int16 min", () => {
    const out = float32ToInt16Pcm(new Float32Array([-5.0]));
    expect(out[0]).toBe(-0x8000);
  });

  it("preserves length", () => {
    const out = float32ToInt16Pcm(new Float32Array(64));
    expect(out.length).toBe(64);
  });

  it("returns an Int16Array", () => {
    const out = float32ToInt16Pcm(new Float32Array([0.5]));
    expect(out).toBeInstanceOf(Int16Array);
  });
});

describe("isSlowConnection", () => {
  it("is false when first partial arrived within budget", () => {
    expect(
      isSlowConnection({
        firstPartialMs: 800,
        elapsedSinceStartMs: 5000,
      }),
    ).toBe(false);
  });

  it("is true when first partial arrived but exceeded the warn threshold", () => {
    expect(
      isSlowConnection({
        firstPartialMs: FIRST_PARTIAL_WARN_MS + 1,
        elapsedSinceStartMs: FIRST_PARTIAL_WARN_MS + 1,
      }),
    ).toBe(true);
  });

  it("is true when first partial has not arrived and elapsed exceeded warn", () => {
    expect(
      isSlowConnection({
        firstPartialMs: null,
        elapsedSinceStartMs: FIRST_PARTIAL_WARN_MS + 1,
      }),
    ).toBe(true);
  });

  it("is false when first partial has not arrived but elapsed is still within budget", () => {
    expect(
      isSlowConnection({
        firstPartialMs: null,
        elapsedSinceStartMs: 500,
      }),
    ).toBe(false);
  });
});

describe("shouldAbortToFallback", () => {
  it("never aborts once a partial has landed", () => {
    expect(
      shouldAbortToFallback({
        firstPartialMs: 200,
        elapsedSinceStartMs: 99_999,
        fallbackBudgetMs: 5000,
      }),
    ).toBe(false);
  });

  it("aborts when no partial within the fallback budget", () => {
    expect(
      shouldAbortToFallback({
        firstPartialMs: null,
        elapsedSinceStartMs: 6000,
        fallbackBudgetMs: 5000,
      }),
    ).toBe(true);
  });

  it("does not abort while the budget hasn't elapsed yet", () => {
    expect(
      shouldAbortToFallback({
        firstPartialMs: null,
        elapsedSinceStartMs: 4000,
        fallbackBudgetMs: 5000,
      }),
    ).toBe(false);
  });
});

// ── createPronunciationStream lifecycle (mock WebSocket) ─────────────────

class MockSocket {
  static OPEN = 1;
  static CLOSED = 3;

  readyState = 0; // CONNECTING
  binaryType: "arraybuffer" | "blob" = "blob";
  onopen: (() => void) | null = null;
  onmessage: ((ev: { data: unknown }) => void) | null = null;
  onerror: (() => void) | null = null;
  onclose: (() => void) | null = null;
  url: string;
  sent: unknown[] = [];

  constructor(url: string) {
    this.url = url;
  }

  // Test helpers — fire lifecycle events the way a real socket would.
  open() {
    this.readyState = MockSocket.OPEN;
    this.onopen?.();
  }
  receive(data: unknown) {
    const payload = typeof data === "string" ? data : JSON.stringify(data);
    this.onmessage?.({ data: payload });
  }
  triggerError() {
    this.onerror?.();
  }
  close() {
    this.readyState = MockSocket.CLOSED;
    this.onclose?.();
  }

  // Real WebSocket API surface — only what the scorer uses.
  send(data: unknown) {
    this.sent.push(data);
  }
}

const mockSocketImpl = MockSocket as unknown as typeof WebSocket;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("createPronunciationStream — fallback paths", () => {
  it("returns fallback no_token when authToken is missing", async () => {
    const result = await createPronunciationStream({
      referenceText: "test",
      authToken: "",
      webSocketImpl: mockSocketImpl,
    });
    expect(result.kind).toBe("fallback");
    if (result.kind === "fallback") expect(result.reason).toBe("no_token");
  });

  it("returns fallback connect_timeout when ready never arrives", async () => {
    let socket: MockSocket | null = null;
    const Spy = vi.fn().mockImplementation((url: string) => {
      socket = new MockSocket(url);
      // Open but never send 'ready'.
      setTimeout(() => socket?.open(), 0);
      return socket;
    });
    const promise = createPronunciationStream({
      referenceText: "test",
      authToken: "jwt",
      connectTimeoutMs: 100,
      webSocketImpl: Spy as unknown as typeof WebSocket,
    });
    await vi.advanceTimersByTimeAsync(150);
    const result = await promise;
    expect(result.kind).toBe("fallback");
    if (result.kind === "fallback") {
      expect(result.reason).toBe("connect_timeout");
    }
  });

  it("returns fallback auth_required when server replies with auth_required error", async () => {
    let socket: MockSocket | null = null;
    const Spy = vi.fn().mockImplementation((url: string) => {
      socket = new MockSocket(url);
      setTimeout(() => {
        socket?.open();
        socket?.receive({
          type: "error",
          code: "auth_required",
          message: "expired",
        });
      }, 0);
      return socket;
    });
    const promise = createPronunciationStream({
      referenceText: "test",
      authToken: "expired-jwt",
      webSocketImpl: Spy as unknown as typeof WebSocket,
    });
    await vi.advanceTimersByTimeAsync(50);
    const result = await promise;
    expect(result.kind).toBe("fallback");
    if (result.kind === "fallback") expect(result.reason).toBe("auth_required");
  });

  it("returns fallback connect_error when socket closes during handshake", async () => {
    let socket: MockSocket | null = null;
    const Spy = vi.fn().mockImplementation((url: string) => {
      socket = new MockSocket(url);
      setTimeout(() => {
        socket?.close();
      }, 0);
      return socket;
    });
    const promise = createPronunciationStream({
      referenceText: "test",
      authToken: "jwt",
      webSocketImpl: Spy as unknown as typeof WebSocket,
    });
    await vi.advanceTimersByTimeAsync(50);
    const result = await promise;
    expect(result.kind).toBe("fallback");
    if (result.kind === "fallback") expect(result.reason).toBe("connect_error");
  });
});

describe("createPronunciationStream — happy path", () => {
  it("sends hello, then routes partial + final frames to the right callbacks", async () => {
    let socket: MockSocket | null = null;
    const Spy = vi.fn().mockImplementation((url: string) => {
      socket = new MockSocket(url);
      setTimeout(() => {
        socket?.open();
        socket?.receive({ type: "ready", sessionId: "abc-123" });
      }, 0);
      return socket;
    });
    const promise = createPronunciationStream({
      referenceText: "I went to the market",
      authToken: "jwt",
      webSocketImpl: Spy as unknown as typeof WebSocket,
    });
    await vi.advanceTimersByTimeAsync(50);
    const result = await promise;
    expect(result.kind).toBe("stream");
    if (result.kind !== "stream") return;

    const partials: unknown[] = [];
    const finals: unknown[] = [];
    result.onPartial((p) => partials.push(p));
    result.onFinal((f) => finals.push(f));

    socket!.receive({
      type: "partial",
      runningScore: 75,
      words: [{ word: "I", accuracy: 80 }],
      elapsedMs: 1200,
    });
    socket!.receive({
      type: "final",
      overallScore: 82,
      words: [{ word: "I", accuracy: 80 }],
      phonemes: [],
    });

    expect(partials.length).toBe(1);
    expect(finals.length).toBe(1);
    expect((finals[0] as { overallScore: number }).overallScore).toBe(82);
  });

  it("sends the hello frame with the correct shape", async () => {
    let socket: MockSocket | null = null;
    const Spy = vi.fn().mockImplementation((url: string) => {
      socket = new MockSocket(url);
      setTimeout(() => {
        socket?.open();
        socket?.receive({ type: "ready", sessionId: "abc" });
      }, 0);
      return socket;
    });
    const promise = createPronunciationStream({
      referenceText: "hello world",
      authToken: "jwt",
      webSocketImpl: Spy as unknown as typeof WebSocket,
    });
    await vi.advanceTimersByTimeAsync(50);
    await promise;

    expect(socket!.sent.length).toBeGreaterThan(0);
    const hello = JSON.parse(socket!.sent[0] as string);
    expect(hello).toEqual({
      type: "hello",
      referenceText: "hello world",
      sampleRate: 16000,
    });
  });

  it("end() sends an end frame", async () => {
    let socket: MockSocket | null = null;
    const Spy = vi.fn().mockImplementation((url: string) => {
      socket = new MockSocket(url);
      setTimeout(() => {
        socket?.open();
        socket?.receive({ type: "ready", sessionId: "abc" });
      }, 0);
      return socket;
    });
    const promise = createPronunciationStream({
      referenceText: "hi",
      authToken: "jwt",
      webSocketImpl: Spy as unknown as typeof WebSocket,
    });
    await vi.advanceTimersByTimeAsync(50);
    const result = await promise;
    if (result.kind !== "stream") throw new Error("expected stream");

    result.end();
    const lastFrame = socket!.sent[socket!.sent.length - 1] as string;
    expect(JSON.parse(lastFrame)).toEqual({ type: "end" });
  });

  it("pushAudioChunk forwards binary frames when socket is open", async () => {
    let socket: MockSocket | null = null;
    const Spy = vi.fn().mockImplementation((url: string) => {
      socket = new MockSocket(url);
      setTimeout(() => {
        socket?.open();
        socket?.receive({ type: "ready", sessionId: "abc" });
      }, 0);
      return socket;
    });
    const promise = createPronunciationStream({
      referenceText: "hi",
      authToken: "jwt",
      webSocketImpl: Spy as unknown as typeof WebSocket,
    });
    await vi.advanceTimersByTimeAsync(50);
    const result = await promise;
    if (result.kind !== "stream") throw new Error("expected stream");

    const buf = new ArrayBuffer(16);
    result.pushAudioChunk(buf);
    expect(socket!.sent[socket!.sent.length - 1]).toBe(buf);
  });

  it("getLatency reports null firstPartialMs before any partial arrives", async () => {
    let socket: MockSocket | null = null;
    const Spy = vi.fn().mockImplementation((url: string) => {
      socket = new MockSocket(url);
      setTimeout(() => {
        socket?.open();
        socket?.receive({ type: "ready", sessionId: "abc" });
      }, 0);
      return socket;
    });
    const promise = createPronunciationStream({
      referenceText: "hi",
      authToken: "jwt",
      webSocketImpl: Spy as unknown as typeof WebSocket,
    });
    await vi.advanceTimersByTimeAsync(50);
    const result = await promise;
    if (result.kind !== "stream") throw new Error("expected stream");

    expect(result.getLatency().firstPartialMs).toBeNull();
  });

  it("getLatency populates firstPartialMs after the first partial arrives", async () => {
    let socket: MockSocket | null = null;
    const Spy = vi.fn().mockImplementation((url: string) => {
      socket = new MockSocket(url);
      setTimeout(() => {
        socket?.open();
        socket?.receive({ type: "ready", sessionId: "abc" });
      }, 0);
      return socket;
    });
    const promise = createPronunciationStream({
      referenceText: "hi",
      authToken: "jwt",
      webSocketImpl: Spy as unknown as typeof WebSocket,
    });
    await vi.advanceTimersByTimeAsync(50);
    const result = await promise;
    if (result.kind !== "stream") throw new Error("expected stream");

    socket!.receive({
      type: "partial",
      runningScore: 75,
      words: [],
      elapsedMs: 1200,
    });

    expect(result.getLatency().firstPartialMs).not.toBeNull();
  });
});
