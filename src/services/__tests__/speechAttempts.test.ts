import { describe, it, expect, vi, beforeEach } from "vitest";

const mockInsertSingle = vi.fn();
const mockInsertSelect = vi.fn(() => ({ single: () => mockInsertSingle() }));
const mockInsert = vi.fn(() => ({ select: () => mockInsertSelect() }));
const mockFrom = vi.fn(() => ({ insert: (row: unknown) => mockInsert(row) }));
const mockGetUser = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
    auth: { getUser: () => mockGetUser() },
  },
}));

// Default — feature flag ON for most tests. Individual tests override.
const { mockFlags } = vi.hoisted(() => ({
  mockFlags: { SPEECH_PERSISTENCE_ENABLED: true } as { SPEECH_PERSISTENCE_ENABLED: boolean },
}));
vi.mock("@/lib/featureFlags", () => ({
  FEATURE_FLAGS: new Proxy(mockFlags, {
    get: (t, k: string) =>
      (t as Record<string, boolean>)[k] ?? false,
  }),
}));

import { recordSpeechAttempt } from "../speechAttempts";
import type { ScoreResult } from "@/lib/pronunciation/scorer";

const SAMPLE_SCORE: ScoreResult = {
  overallScore: 87,
  feedback: { en: "Solid — keep going.", vi: "Tốt — tiếp tục." },
  wordScores: [
    { word: "hello", heard: "hello", score: 100, status: "correct" },
    {
      word: "world",
      heard: "word",
      score: 60,
      status: "close",
      hint: { en: "Close — try again.", vi: "Gần rồi — thử lại." },
    },
  ],
};

beforeEach(() => {
  mockInsertSingle.mockReset();
  mockInsertSelect.mockClear();
  mockInsert.mockClear();
  mockFrom.mockClear();
  mockGetUser.mockReset();
  mockFlags.SPEECH_PERSISTENCE_ENABLED = true;
});

describe("recordSpeechAttempt — feature-flag behaviour", () => {
  it("returns skipped:flag_off when feature flag is OFF (no network call)", async () => {
    mockFlags.SPEECH_PERSISTENCE_ENABLED = false;
    const r = await recordSpeechAttempt({
      target: "hello world",
      recognized: "hello word",
      score: SAMPLE_SCORE,
      elapsedMs: 1234,
    });
    expect(r).toEqual({ ok: true, skipped: true, reason: "flag_off" });
    expect(mockFrom).not.toHaveBeenCalled();
    expect(mockGetUser).not.toHaveBeenCalled();
  });

  it("returns skipped:anon when no auth user", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });
    const r = await recordSpeechAttempt({
      target: "hello",
      recognized: "hello",
      score: SAMPLE_SCORE,
      elapsedMs: 500,
    });
    expect(r).toEqual({ ok: true, skipped: true, reason: "anon" });
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("returns skipped:empty_score when score is malformed", async () => {
    const r = await recordSpeechAttempt({
      target: "hello",
      recognized: "hello",
      // @ts-expect-error — deliberately malformed
      score: { overallScore: 50 },
      elapsedMs: 500,
    });
    expect(r).toEqual({
      ok: true,
      skipped: true,
      reason: "empty_score",
    });
  });
});

describe("recordSpeechAttempt — happy path", () => {
  it("inserts the expected row shape and returns the new id", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockInsertSingle.mockResolvedValueOnce({
      data: { id: "row-999" },
      error: null,
    });

    const result = await recordSpeechAttempt({
      target: "Hello world.",
      recognized: "hello word",
      score: SAMPLE_SCORE,
      elapsedMs: 1234,
      context: { room_id: "room-abc", line_id: "line-42", extra: { source: "test" } },
    });

    expect(result).toEqual({ ok: true, skipped: false, id: "row-999" });

    const row = mockInsert.mock.calls[0][0];
    expect(row.user_id).toBe("user-1");
    expect(row.target_text).toBe("Hello world.");
    expect(row.transcript).toBe("hello word");
    expect(row.overall_score).toBe(87);
    expect(row.word_scores).toBe(SAMPLE_SCORE.wordScores);
    expect(row.feedback_message).toBe("Solid — keep going.");
    expect(row.room_id).toBe("room-abc");
    expect(row.line_id).toBe("line-42");
    expect(row.elapsed_ms).toBe(1234);
    expect(row.context).toEqual({ source: "test", elapsed_ms: 1234 });
    expect(typeof row.attempted_at).toBe("string");
  });

  it("clamps overall_score outside 0..100", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "u" } } });
    mockInsertSingle.mockResolvedValue({ data: { id: "x" }, error: null });
    await recordSpeechAttempt({
      target: "x",
      recognized: "x",
      score: { ...SAMPLE_SCORE, overallScore: 250 },
      elapsedMs: 1,
    });
    expect(mockInsert.mock.calls[0][0].overall_score).toBe(100);

    await recordSpeechAttempt({
      target: "x",
      recognized: "x",
      score: { ...SAMPLE_SCORE, overallScore: -10 },
      elapsedMs: 1,
    });
    expect(mockInsert.mock.calls[1][0].overall_score).toBe(0);
  });

  it("rounds fractional overall_score", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "u" } } });
    mockInsertSingle.mockResolvedValue({ data: { id: "x" }, error: null });
    await recordSpeechAttempt({
      target: "x",
      recognized: "x",
      score: { ...SAMPLE_SCORE, overallScore: 86.7 },
      elapsedMs: 1,
    });
    expect(mockInsert.mock.calls[0][0].overall_score).toBe(87);
  });

  it("leaves context null when nothing meaningful to record", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "u" } } });
    mockInsertSingle.mockResolvedValue({ data: { id: "x" }, error: null });
    await recordSpeechAttempt({
      target: "x",
      recognized: "x",
      score: SAMPLE_SCORE,
      // elapsedMs undefined → no elapsed_ms in context
      elapsedMs: Number.NaN,
    });
    const row = mockInsert.mock.calls[0][0];
    expect(row.context).toBeNull();
    expect(row.elapsed_ms).toBeNull();
  });

  it("never mutates the wordScores array it received", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "u" } } });
    mockInsertSingle.mockResolvedValue({ data: { id: "x" }, error: null });
    const snapshotLen = SAMPLE_SCORE.wordScores.length;
    await recordSpeechAttempt({
      target: "x",
      recognized: "x",
      score: SAMPLE_SCORE,
      elapsedMs: 100,
    });
    expect(SAMPLE_SCORE.wordScores).toHaveLength(snapshotLen);
  });
});

describe("recordSpeechAttempt — error handling", () => {
  it("returns ok:false and never throws when Supabase errors", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "u" } } });
    mockInsertSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "permission denied" },
    });
    const r = await recordSpeechAttempt({
      target: "x",
      recognized: "x",
      score: SAMPLE_SCORE,
      elapsedMs: 1,
    });
    expect(r).toEqual({ ok: false, error: "permission denied" });
  });

  it("handles a thrown exception during insert", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "u" } } });
    mockInsertSingle.mockRejectedValueOnce(new Error("network"));
    const r = await recordSpeechAttempt({
      target: "x",
      recognized: "x",
      score: SAMPLE_SCORE,
      elapsedMs: 1,
    });
    expect(r).toEqual({ ok: false, error: "network" });
  });

  it("anon gate still applies when getUser() throws", async () => {
    mockGetUser.mockRejectedValueOnce(new Error("auth broke"));
    const r = await recordSpeechAttempt({
      target: "x",
      recognized: "x",
      score: SAMPLE_SCORE,
      elapsedMs: 1,
    });
    expect(r).toEqual({ ok: true, skipped: true, reason: "anon" });
  });
});
