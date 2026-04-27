// supabase/functions/azure-phoneme-stream/__tests__/protocol.test.ts
//
// Tests for the pure helpers in protocol.ts. The WebSocket transport
// itself is integration territory and out of scope here.

import { describe, expect, it } from "vitest";

import {
  MAX_ACCUMULATED_SEC,
  PARTIAL_PASS_INTERVAL_SEC,
  REQUIRED_SAMPLE_RATE,
  parseControlMessage,
  projectWordsForStreaming,
  runningScoreFromWords,
  shouldRunPartialPass,
} from "../protocol.ts";

describe("REQUIRED_SAMPLE_RATE", () => {
  it("is 16 kHz — matches Azure pronunciation assessment input", () => {
    expect(REQUIRED_SAMPLE_RATE).toBe(16_000);
  });
});

describe("shouldRunPartialPass", () => {
  it("does not run while a previous pass is in flight", () => {
    expect(
      shouldRunPartialPass({
        msSinceLastPass: 99_999,
        accumulatedSec: 5,
        inFlight: true,
      }),
    ).toBe(false);
  });

  it("does not run when accumulated audio exceeds the cap", () => {
    expect(
      shouldRunPartialPass({
        msSinceLastPass: 99_999,
        accumulatedSec: MAX_ACCUMULATED_SEC + 1,
        inFlight: false,
      }),
    ).toBe(false);
  });

  it("does not run before the interval elapses", () => {
    expect(
      shouldRunPartialPass({
        msSinceLastPass: 100,
        accumulatedSec: 1,
        inFlight: false,
      }),
    ).toBe(false);
  });

  it("runs after the interval elapses with audio under cap and no in-flight", () => {
    expect(
      shouldRunPartialPass({
        msSinceLastPass: PARTIAL_PASS_INTERVAL_SEC * 1000 + 1,
        accumulatedSec: 5,
        inFlight: false,
      }),
    ).toBe(true);
  });

  it("uses the boundary correctly — exactly at the interval triggers", () => {
    expect(
      shouldRunPartialPass({
        msSinceLastPass: PARTIAL_PASS_INTERVAL_SEC * 1000,
        accumulatedSec: 5,
        inFlight: false,
      }),
    ).toBe(true);
  });
});

describe("parseControlMessage", () => {
  it("accepts a well-formed hello frame", () => {
    expect(
      parseControlMessage({
        type: "hello",
        referenceText: "I went to the market",
        sampleRate: 16000,
      }),
    ).toEqual({
      type: "hello",
      referenceText: "I went to the market",
      sampleRate: 16000,
    });
  });

  it("trims whitespace on referenceText", () => {
    const out = parseControlMessage({
      type: "hello",
      referenceText: "  hello world  ",
      sampleRate: 16000,
    });
    expect(out?.type === "hello" ? out.referenceText : null).toBe("hello world");
  });

  it("rejects hello without referenceText", () => {
    expect(parseControlMessage({ type: "hello", sampleRate: 16000 })).toBeNull();
  });

  it("rejects hello with empty referenceText", () => {
    expect(
      parseControlMessage({ type: "hello", referenceText: "   ", sampleRate: 16000 }),
    ).toBeNull();
  });

  it("rejects hello with non-numeric sampleRate", () => {
    expect(
      parseControlMessage({
        type: "hello",
        referenceText: "test",
        sampleRate: "16000",
      }),
    ).toEqual({ type: "hello", referenceText: "test", sampleRate: 16000 });
    // Number("16000") is finite > 0 — accepted. But:
    expect(
      parseControlMessage({
        type: "hello",
        referenceText: "test",
        sampleRate: "abc",
      }),
    ).toBeNull();
  });

  it("accepts a well-formed end frame", () => {
    expect(parseControlMessage({ type: "end" })).toEqual({ type: "end" });
  });

  it("rejects unknown message types", () => {
    expect(parseControlMessage({ type: "wat" })).toBeNull();
  });

  it("rejects non-objects (string, null, number)", () => {
    expect(parseControlMessage("hello")).toBeNull();
    expect(parseControlMessage(null)).toBeNull();
    expect(parseControlMessage(42)).toBeNull();
  });
});

describe("projectWordsForStreaming", () => {
  it("projects Azure word shapes into the streaming wire shape", () => {
    const out = projectWordsForStreaming([
      { Word: "hello", AccuracyScore: 88 },
      { Word: "world", AccuracyScore: 60, ErrorType: "Mispronunciation" },
    ]);
    expect(out).toEqual([
      { word: "hello", accuracy: 88, errorType: null },
      { word: "world", accuracy: 60, errorType: "Mispronunciation" },
    ]);
  });

  it("clamps accuracy to [0, 100]", () => {
    const out = projectWordsForStreaming([
      { Word: "low", AccuracyScore: -5 },
      { Word: "high", AccuracyScore: 999 },
    ]);
    expect(out[0].accuracy).toBe(0);
    expect(out[1].accuracy).toBe(100);
  });

  it("uses -1 sentinel when AccuracyScore is missing or non-numeric", () => {
    const out = projectWordsForStreaming([{ Word: "x" }]);
    expect(out[0].accuracy).toBe(-1);
  });

  it("filters out words with empty / missing text", () => {
    const out = projectWordsForStreaming([
      { Word: "", AccuracyScore: 80 },
      { Word: "  ", AccuracyScore: 80 },
      { Word: "ok", AccuracyScore: 80 },
    ]);
    expect(out.length).toBe(1);
    expect(out[0].word).toBe("ok");
  });
});

describe("runningScoreFromWords", () => {
  it("returns 0 for empty input", () => {
    expect(runningScoreFromWords([])).toBe(0);
  });

  it("returns 0 when all words have not-yet-scored sentinels", () => {
    expect(
      runningScoreFromWords([
        { word: "a", accuracy: -1 },
        { word: "b", accuracy: -1 },
      ]),
    ).toBe(0);
  });

  it("averages over scored words only, ignoring -1 sentinels", () => {
    expect(
      runningScoreFromWords([
        { word: "a", accuracy: 80 },
        { word: "b", accuracy: -1 },
        { word: "c", accuracy: 60 },
      ]),
    ).toBe(70);
  });

  it("rounds to integer", () => {
    expect(
      runningScoreFromWords([
        { word: "a", accuracy: 81 },
        { word: "b", accuracy: 82 },
        { word: "c", accuracy: 84 },
      ]),
    ).toBe(82);
  });
});
