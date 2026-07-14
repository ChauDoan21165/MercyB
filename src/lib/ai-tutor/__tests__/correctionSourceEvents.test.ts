import { describe, expect, it, vi } from "vitest";
import {
  classifyCorrectionSourceEvent,
  deriveCorrectionSourceLangPair,
  readCorrectionSourceLocalContextForTest,
  writeCorrectionSourceEvent,
  type CorrectionSourceEventRow,
  type CorrectionSourceEventSource,
} from "../correctionSourceEvents";
import { CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY } from "../correctionSourceSyntheticMarker";

describe("correction source events", () => {
  it.each([
    [{ localStatus: "corrected" as const }, "local_corrected"],
    [{ localStatus: "unchanged" as const, serverAttempted: true }, "local_unchanged_server_attempt"],
    [{ localStatus: "needs_ai" as const, serverAttempted: true, serverSucceeded: true }, "server_corrected"],
    [{ localStatus: "needs_ai" as const, serverAttempted: true, serverSucceeded: false }, "server_no_correction"],
  ])("classifies %#", (input, expected) => {
    expect(classifyCorrectionSourceEvent(input)).toBe(expected);
  });

  it("writes the five text-free source rows with language pair and synthetic tag", async () => {
    const rows: CorrectionSourceEventRow[] = [];
    const sources: CorrectionSourceEventSource[] = [
      "local_corrected",
      "local_unchanged_server_attempt",
      "server_corrected",
      "server_no_correction",
      "server_failed",
    ];

    for (const source of sources) {
      await writeCorrectionSourceEvent(
        { source, targetLanguage: "en" },
        {
          getUserContext: async () => ({ nativeLanguage: "vi", isSynthetic: true }),
          insertRow: async (row) => {
            rows.push(row);
            return { error: null };
          },
        },
      );
    }

    expect(rows).toEqual(
      sources.map((source) => ({
        source,
        lang_pair: "vi-en",
        is_synthetic: true,
      })),
    );
  });

  it("falls back to local anonymous pair context when profile context fails", async () => {
    const insertRow = vi.fn(async (_row: CorrectionSourceEventRow) => ({ error: null }));

    await writeCorrectionSourceEvent(
      { source: "server_failed", targetLanguage: "en" },
      {
        getLocalContext: () => ({ nativeLanguage: "vietnamese", isSynthetic: false }),
        getUserContext: async () => {
          throw new Error("profile read failed");
        },
        insertRow,
      },
    );

    expect(insertRow).toHaveBeenCalledWith({
      source: "server_failed",
      lang_pair: "vi-en",
      is_synthetic: false,
    });
    expect(deriveCorrectionSourceLangPair(" Vietnamese ", "en")).toBe("vi-en");
  });

  it("merges local language context with remote synthetic profile context", async () => {
    const rows: CorrectionSourceEventRow[] = [];

    await writeCorrectionSourceEvent(
      { source: "local_corrected", targetLanguage: "en" },
      {
        getLocalContext: () => ({ nativeLanguage: "vi", isSynthetic: false }),
        getUserContext: async () => ({ nativeLanguage: null, isSynthetic: true }),
        insertRow: async (row) => {
          rows.push(row);
          return { error: null };
        },
      },
    );

    expect(rows).toEqual([
      {
        source: "local_corrected",
        lang_pair: "vi-en",
        is_synthetic: true,
      },
    ]);
  });

  it("reads the prod-monitoring synthetic marker from local browser storage", async () => {
    window.localStorage.setItem("mercyblade.languagePair", JSON.stringify({ native: "vi", targets: ["en"] }));
    window.localStorage.setItem(CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY, "1");

    expect(readCorrectionSourceLocalContextForTest()).toEqual({
      nativeLanguage: "vi",
      isSynthetic: true,
    });

    const rows: CorrectionSourceEventRow[] = [];
    await writeCorrectionSourceEvent(
      { source: "local_corrected", targetLanguage: "en" },
      {
        getUserContext: async () => ({ nativeLanguage: null, isSynthetic: false }),
        insertRow: async (row) => {
          rows.push(row);
          return { error: null };
        },
      },
    );

    expect(rows).toEqual([
      {
        source: "local_corrected",
        lang_pair: "vi-en",
        is_synthetic: true,
      },
    ]);
  });
});
