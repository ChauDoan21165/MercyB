import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildSelfAuditOutcomeEventRow,
  deriveSelfAuditLangPair,
  readSelfAuditOutcomeLocalContextForTest,
  writeSelfAuditOutcomeEvent,
  type SelfAuditOutcomeEventRow,
} from "../selfAuditOutcomeEvents";
import { CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY } from "../correctionSourceSyntheticMarker";

const blockTelemetry = {
  decision: "BLOCK",
  isBlocked: true,
  decidingGate: "S1_HARD_SAFETY",
  gateDecisions: {
    S1_HARD_SAFETY: {
      passed: false,
      decision: "BLOCK",
      reasonCode: "fake_praise",
    },
  },
};

describe("self audit outcome events", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("builds text-free block rows with gate, reason, language pair, and synthetic tag", () => {
    const row = buildSelfAuditOutcomeEventRow(
      { telemetry: blockTelemetry, targetLanguage: "en" },
      { nativeLanguage: "Vietnamese", isSynthetic: true },
    );

    expect(row).toEqual({
      decision: "BLOCK",
      deciding_gate: "S1_HARD_SAFETY",
      failed_rule: "S1_HARD_SAFETY",
      reason_code: "fake_praise",
      lang_pair: "vi-en",
      is_synthetic: true,
    });
    expect(JSON.stringify(row)).not.toContain("learner");
    expect(JSON.stringify(row)).not.toContain("correction");
  });

  it("keeps pass rows as denominator rows without a failed rule", async () => {
    const rows: SelfAuditOutcomeEventRow[] = [];

    await writeSelfAuditOutcomeEvent(
      {
        telemetry: {
          decision: "SHOW",
          isBlocked: false,
          decidingGate: null,
          gateDecisions: {},
        },
        targetLanguage: "en",
      },
      {
        getUserContext: async () => ({ nativeLanguage: "vi", isSynthetic: false }),
        insertRow: async (row) => {
          rows.push(row);
          return { error: null };
        },
      },
    );

    expect(rows).toEqual([
      {
        decision: "SHOW",
        deciding_gate: null,
        failed_rule: null,
        reason_code: null,
        lang_pair: "vi-en",
        is_synthetic: false,
      },
    ]);
  });

  it("uses local marker and cached profile state for synthetic labeling", async () => {
    window.localStorage.setItem("mercyblade.languagePair", JSON.stringify({ native: "vi", targets: ["en"] }));
    window.localStorage.setItem(CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY, "1");

    expect(readSelfAuditOutcomeLocalContextForTest()).toEqual({
      nativeLanguage: "vi",
      isSynthetic: true,
    });

    const rows: SelfAuditOutcomeEventRow[] = [];
    await writeSelfAuditOutcomeEvent(
      { telemetry: blockTelemetry, targetLanguage: "en" },
      {
        getUserContext: async () => ({ nativeLanguage: null, isSynthetic: false }),
        insertRow: async (row) => {
          rows.push(row);
          return { error: null };
        },
      },
    );

    expect(rows[0]).toMatchObject({
      decision: "BLOCK",
      lang_pair: "vi-en",
      is_synthetic: true,
    });
    expect(deriveSelfAuditLangPair(" Vietnamese ", "en")).toBe("vi-en");
  });

  it("holds the keepalive insert until a cold profile synthetic cache resolves", async () => {
    let cachedSynthetic = false;
    let cacheCold = true;
    let resolveCache!: () => void;
    const durableInsertRow = vi.fn(async (_row: SelfAuditOutcomeEventRow) => ({ error: null }));
    const cacheResolution = new Promise<void>((resolve) => {
      resolveCache = () => {
        cachedSynthetic = true;
        cacheCold = false;
        resolve();
      };
    });

    const pendingWrite = writeSelfAuditOutcomeEvent(
      { telemetry: blockTelemetry, targetLanguage: "en" },
      {
        getLocalContext: () => ({ nativeLanguage: "vi", isSynthetic: cachedSynthetic }),
        isProfileSyntheticCacheCold: () => cacheCold,
        ensureProfileSyntheticResolved: () => cacheResolution,
        durableInsertRow,
      },
    );

    await Promise.resolve();
    expect(durableInsertRow).not.toHaveBeenCalled();

    resolveCache();
    await pendingWrite;

    expect(durableInsertRow).toHaveBeenCalledWith({
      decision: "BLOCK",
      deciding_gate: "S1_HARD_SAFETY",
      failed_rule: "S1_HARD_SAFETY",
      reason_code: "fake_praise",
      lang_pair: "vi-en",
      is_synthetic: true,
    });
  });
});
