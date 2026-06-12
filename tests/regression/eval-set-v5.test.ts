import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  forecastPatternTrajectory,
  MIN_FORECAST_ATTEMPTS,
} from "../../src/lib/sequencing/masteryForecaster";
import type { InterferenceMasteryScore } from "../../src/lib/sequencing/types";
import type { EvalEntryV5, EvalSetMetaV5 } from "../../docs/eval/vn-en-eval-set-v5/types";

const ROOT = resolve(__dirname, "../..");
const V5_PATH = resolve(ROOT, "docs/eval/vn-en-eval-set-v5/eval-set-v5.json");
const NOW = Date.UTC(2026, 5, 12);

function loadV5(): EvalSetMetaV5 {
  return JSON.parse(readFileSync(V5_PATH, "utf8")) as EvalSetMetaV5;
}

function byCategory(entries: EvalEntryV5[], category: EvalEntryV5["category"]) {
  return entries.filter((entry) => entry.category === category);
}

describe("eval set v5", () => {
  it("contains exactly 30 uniquely identified entries", () => {
    const evalSet = loadV5();
    const ids = evalSet.entries.map((entry) => entry.id);

    expect(evalSet.name).toBe("vn-en-eval-set-v5");
    expect(evalSet.version).toBe(5);
    expect(evalSet.count).toBe(30);
    expect(evalSet.entries).toHaveLength(30);
    expect(new Set(ids).size).toBe(30);
    expect(ids).toEqual(Array.from({ length: 30 }, (_, i) => `eval-v5-${String(i + 1).padStart(3, "0")}`));
  });

  it("keeps the requested 10/10/10 category split", () => {
    const { entries } = loadV5();

    expect(byCategory(entries, "stt_mishear_sanity")).toHaveLength(10);
    expect(byCategory(entries, "register_error_contextual")).toHaveLength(10);
    expect(byCategory(entries, "forecast_abstain_thin_data")).toHaveLength(10);
  });

  it("covers STT minimal-pair read-back and free-answer abstain behavior", () => {
    const sttEntries = byCategory(loadV5().entries, "stt_mishear_sanity");
    const pairs = sttEntries.map((entry) => entry.stt.minimalPair.join("/"));
    const classes = new Set(sttEntries.map((entry) => entry.stt.vnFinalConsonantClass));

    expect(pairs).toContain("hat/head");
    expect(pairs).toContain("ship/sheep");
    expect(Array.from(classes)).toEqual(
      expect.arrayContaining([
        "final_t_d_voicing",
        "final_p_b_voicing",
        "final_k_g_voicing",
        "final_s_z_voicing",
        "vowel_length_i_short_i",
      ]),
    );

    const readBack = sttEntries.filter((entry) => entry.stt.mode === "read_back");
    const freeAnswer = sttEntries.filter((entry) => entry.stt.mode === "free_answer");

    expect(readBack.length).toBeGreaterThanOrEqual(6);
    expect(readBack.every((entry) => entry.stt.expectedBehavior === "flag_mishear_and_ask_reread")).toBe(true);
    expect(readBack.every((entry) => entry.stt.shouldAbstain === false)).toBe(true);
    expect(freeAnswer).toHaveLength(3);
    expect(freeAnswer.every((entry) => entry.stt.expectedBehavior === "abstain_no_correction")).toBe(true);
    expect(freeAnswer.every((entry) => entry.stt.shouldAbstain === true)).toBe(true);
  });

  it("requires contextual register cases to be actionable, not addressee-only guesses", () => {
    const registerEntries = byCategory(loadV5().entries, "register_error_contextual");
    const taxonomyIds = new Set(registerEntries.map((entry) => entry.register.taxonomyPatternId));

    expect(registerEntries.every((entry) => entry.register.contextProvided)).toBe(true);
    expect(registerEntries.every((entry) => entry.register.shouldAbstain === false)).toBe(true);
    expect(registerEntries.every((entry) => entry.register.expectedBehavior === "flag_register_error")).toBe(true);
    expect(registerEntries.every((entry) => entry.register.addresseeContext.length > 20)).toBe(true);
    expect(taxonomyIds.size).toBeGreaterThanOrEqual(8);
  });

  it("marks all thin-data learner cases as NO forecast and exercises forecaster abstention", () => {
    const forecastEntries = byCategory(loadV5().entries, "forecast_abstain_thin_data");

    expect(MIN_FORECAST_ATTEMPTS).toBe(3);
    expect(forecastEntries.every((entry) => entry.expected === "NO_FORECAST")).toBe(true);
    expect(forecastEntries.every((entry) => entry.forecast.minAttemptsRequired === MIN_FORECAST_ATTEMPTS)).toBe(true);
    expect(forecastEntries.every((entry) => entry.forecast.attemptsCount < MIN_FORECAST_ATTEMPTS)).toBe(true);
    expect(forecastEntries.every((entry) => entry.forecast.shouldAbstain === true)).toBe(true);

    for (const entry of forecastEntries) {
      const score: InterferenceMasteryScore = {
        patternId: entry.forecast.patternId,
        level: entry.forecast.level,
        score: entry.forecast.score ?? undefined,
        attemptsCount: entry.forecast.attemptsCount,
        confidenceWidth: entry.forecast.confidenceWidth,
        lastUpdatedAt: NOW,
      };
      const forecast = forecastPatternTrajectory(score, NOW);

      expect(forecast.abstain).toBe(true);
      expect(forecast.horizon7).toBeUndefined();
      expect(forecast.horizon14).toBeUndefined();
      expect(forecast.daysToNextLevel).toBeNull();
    }
  });
});
