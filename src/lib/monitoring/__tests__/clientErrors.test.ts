import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  __internal,
  createClientErrorSink,
  toClientErrorRow,
  type ClientErrorEvent,
  type ClientErrorRow,
  type InsertResult,
} from "@/lib/monitoring/clientErrors";

type InsertFn = (rows: ClientErrorRow[]) => Promise<InsertResult>;
const insertMock = (impl: InsertFn) => vi.fn<InsertFn>(impl);

function event(id: string, over: Partial<ClientErrorEvent> = {}): ClientErrorEvent {
  return {
    id,
    timestamp: 1000,
    route: "/roleplay?x=secret@example.com",
    userId: "user-1",
    buildSha: "build-1",
    endpoint: "/api/mercy-ai?prompt=do-not-store",
    status: 502,
    method: "post",
    durationMs: 123,
    errorSignature: "api:POST /api/mercy-ai -> 502",
    errorKind: "api",
    ...over,
  };
}

describe("clientErrors", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("maps events to insert rows without query strings or raw payload fields", () => {
    const row = toClientErrorRow(event("a"));

    expect(row).toEqual<ClientErrorRow>({
      client_ts: new Date(1000).toISOString(),
      route: "/roleplay",
      user_id: "user-1",
      build_sha: "build-1",
      endpoint: "/api/mercy-ai",
      status: 502,
      method: "POST",
      duration_ms: 123,
      error_signature: "api:POST /api/mercy-ai -> 502",
      error_kind: "api",
      source: "r1-sentinel",
    });
    expect(JSON.stringify(row)).not.toMatch(/prompt|do-not-store|audio|transcript|Bearer/i);
  });

  it("flushes anonymous rows and removes them only after successful insert", async () => {
    let queue: ClientErrorEvent[] = [event("a", { userId: null }), event("b", { userId: null })];
    const insertRows = insertMock(async () => ({ error: null }));
    const sink = createClientErrorSink({
      enabled: true,
      readQueue: () => queue,
      writeQueue: (next) => { queue = next; },
      insertRows,
      getUserId: async () => "user-later",
      now: () => 2000,
    });

    const out = await sink.flush();

    expect(out.flushed).toBe(2);
    expect(insertRows).toHaveBeenCalledTimes(1);
    expect(insertRows.mock.calls[0][0].every((row) => row.user_id === null)).toBe(true);
    expect(queue).toEqual([]);
  });

  it("backs off and preserves the queue on insert error", async () => {
    let queue: ClientErrorEvent[] = [event("a")];
    let clock = 2000;
    const insertRows = insertMock(async () => ({ error: { message: "table missing" } }));
    const sink = createClientErrorSink({
      enabled: true,
      readQueue: () => queue,
      writeQueue: (next) => { queue = next; },
      insertRows,
      getUserId: async () => "user-1",
      now: () => clock,
    });

    const first = await sink.flush();
    expect(first.error).toBeTruthy();
    expect(queue.map((item) => item.id)).toEqual(["a"]);

    const suppressed = await sink.flush();
    expect(suppressed.skipped).toBe("backoff");
    expect(insertRows).toHaveBeenCalledTimes(1);

    clock = 10 * 60_000;
    insertRows.mockResolvedValueOnce({ error: null });
    expect((await sink.flush()).flushed).toBe(1);
    expect(queue).toEqual([]);
  });

  it("samples repeated signatures per browser window", async () => {
    let queue: ClientErrorEvent[] = [];
    const sink = createClientErrorSink({
      enabled: true,
      readQueue: () => queue,
      writeQueue: (next) => { queue = next; },
      insertRows: insertMock(async () => ({ error: null })),
      getUserId: async () => null,
      sizeThreshold: 100,
      now: () => 2000,
    });

    for (let i = 0; i < 8; i += 1) {
      await sink.enqueue({
        endpoint: "/api/mercy-ai",
        status: 502,
        method: "POST",
        durationMs: 1,
        errorSignature: "api:POST /api/mercy-ai -> 502",
        errorKind: "api",
      });
    }

    expect(queue).toHaveLength(5);
    expect(queue.every((item) => item.userId === null)).toBe(true);
  });

  it("captures uid at enqueue time", async () => {
    let queue: ClientErrorEvent[] = [];
    const sink = createClientErrorSink({
      enabled: true,
      readQueue: () => queue,
      writeQueue: (next) => { queue = next; },
      insertRows: insertMock(async () => ({ error: null })),
      getUserId: async () => "user-at-error-time",
      sizeThreshold: 100,
      now: () => 2000,
    });

    await sink.enqueue({
      endpoint: "/api/mercy-ai",
      status: 502,
      method: "POST",
      durationMs: 1,
      errorSignature: "api:POST /api/mercy-ai -> 502",
      errorKind: "api",
    });

    expect(queue[0]?.userId).toBe("user-at-error-time");
  });

  it("normalizes endpoints and skips its own telemetry endpoint", () => {
    expect(__internal.isTelemetryEndpoint("/rest/v1/client_errors")).toBe(true);
    expect(__internal.isTelemetryEndpoint("/api/mercy-ai")).toBe(false);
  });

  it("includes scrubbed JS error name and message in signatures", () => {
    const signature = __internal.buildJsSignature(
      "js",
      new TypeError("Cannot read properties of undefined for secret@example.com"),
    );

    expect(signature).toBe("js:TypeError: Cannot read properties of undefined for [EMAIL_REDACTED]");
    expect(signature).not.toMatch(/secret@example.com/i);
  });

  it("does not collapse string JS errors to js:js", () => {
    expect(__internal.buildJsSignature("js", "Chunk load failed")).toBe("js:js: Chunk load failed");
  });

  it("uses ErrorEvent message and source location when event.error is absent", () => {
    const signature = __internal.buildJsSignature("js", {
      name: "ErrorEvent",
      message: "Script error.",
      filename: "https://mercyblade.com/assets/AiTutor-abc123.js?token=secret",
      lineno: 42,
      colno: 7,
    });

    expect(signature).toBe("js:ErrorEvent: Script error. @ https://mercyblade.com/assets/AiTutor-abc123.js:42:7");
    expect(signature).not.toMatch(/token=secret/);
  });

  it("truncates JS error messages for stable dedupe", () => {
    const longMessage = `prefix ${"x".repeat(200)}`;
    const signature = __internal.buildJsSignature("unhandledrejection", { name: "ChunkLoadError", message: longMessage });

    expect(signature).toBe(`unhandledrejection:ChunkLoadError: ${`prefix ${"x".repeat(113)}`}`);
    expect(signature.length).toBe("unhandledrejection:ChunkLoadError: ".length + 120);
  });
});
