import { describe, expect, it } from "vitest";

import {
  analyzeForecastVsActual,
  summarizeForecastForLearner,
} from "../index";
import { makeForecast, makeSnapshot, tg } from "./adapterFixtures";

describe("forecastAnalysis — happy path", () => {
  it("returns full confidence when predictions match observations", () => {
    const snap = makeSnapshot({
      skills: {
        reading: { mastery: 0.7 },
        writing: { mastery: 0.55 },
      },
      cefr: { overall: "A2", perSkill: { reading: "A2", writing: "A2" } },
    });
    const forecast = makeForecast([
      tg("reading", 0.7, "A2"),
      tg("writing", 0.55, "A2"),
    ]);
    const report = analyzeForecastVsActual(forecast, snap);
    expect(report.deviations).toHaveLength(0);
    expect(report.degradedConfidence).toBe(1);
  });

  it("detects optimistic bias when predictions overshoot observations", () => {
    const snap = makeSnapshot({
      skills: {
        reading: { mastery: 0.5 },
        writing: { mastery: 0.5 },
      },
      cefr: { overall: "A2", perSkill: { reading: "A2", writing: "A2" } },
    });
    const forecast = makeForecast([
      tg("reading", 0.8, "B1"),
      tg("writing", 0.7, "B1"),
    ]);
    const report = analyzeForecastVsActual(forecast, snap);
    const optimistic = report.deviations.filter((d) => d.code === "optimistic_bias");
    expect(optimistic.length).toBeGreaterThanOrEqual(2);
    expect(report.recalibrationRecommendations.some((r) => r.kind === "lower_mastery_targets")).toBe(true);
  });
});

describe("forecastAnalysis — deviation codes", () => {
  it("emits forecast_error_above_tolerance when |delta| > 0.15", () => {
    const snap = makeSnapshot({
      skills: { writing: { mastery: 0.4 } },
      cefr: { overall: "A2", perSkill: { writing: "A2" } },
    });
    const forecast = makeForecast([tg("writing", 0.6, "A2")]);
    const report = analyzeForecastVsActual(forecast, snap);
    expect(
      report.deviations.some((d) => d.code === "forecast_error_above_tolerance"),
    ).toBe(true);
  });

  it("emits false_acceleration when learner outpaces the forecast", () => {
    const snap = makeSnapshot({
      skills: { listening: { mastery: 0.85 } },
      cefr: { overall: "B1", perSkill: { listening: "B1" } },
    });
    const forecast = makeForecast([tg("listening", 0.6, "A2")]);
    const report = analyzeForecastVsActual(forecast, snap);
    expect(report.deviations.some((d) => d.code === "false_acceleration")).toBe(true);
  });

  it("emits stagnation_against_forecast when CEFR uplift was predicted but did not happen", () => {
    const snap = makeSnapshot({
      skills: { speaking: { mastery: 0.5 } },
      cefr: { overall: "A2", perSkill: { speaking: "A2" } },
    });
    const forecast = makeForecast([tg("speaking", 0.5, "B1")]);
    const report = analyzeForecastVsActual(forecast, snap);
    expect(
      report.deviations.some((d) => d.code === "stagnation_against_forecast"),
    ).toBe(true);
  });

  it("emits weak_skill_prediction_miss for low-confidence over-predictions", () => {
    const snap = makeSnapshot({
      skills: { pronunciation: { mastery: 0.3 } },
      cefr: { overall: "A1", perSkill: { pronunciation: "A1" } },
    });
    const forecast = makeForecast([
      tg("pronunciation", 0.7, "A2", /*confidence*/ 0.3),
    ]);
    const report = analyzeForecastVsActual(forecast, snap);
    expect(
      report.deviations.some((d) => d.code === "weak_skill_prediction_miss"),
    ).toBe(true);
  });
});

describe("forecastAnalysis — determinism", () => {
  it("deviations are sorted by skill", () => {
    const snap = makeSnapshot({
      skills: {
        writing: { mastery: 0.3 },
        speaking: { mastery: 0.3 },
        reading: { mastery: 0.3 },
      },
      cefr: {
        overall: "A2",
        perSkill: { writing: "A2", speaking: "A2", reading: "A2" },
      },
    });
    const forecast = makeForecast([
      tg("speaking", 0.9, "B1"),
      tg("reading", 0.9, "B1"),
      tg("writing", 0.9, "B1"),
    ]);
    const report = analyzeForecastVsActual(forecast, snap);
    const skills = report.deviations.map((d) => d.skill);
    expect([...skills].sort()).toEqual(skills);
  });

  it("identical inputs always produce identical reports", () => {
    const snap = makeSnapshot();
    const forecast = makeForecast([
      tg("reading", 0.9, "B1"),
      tg("writing", 0.8, "B1"),
    ]);
    const a = analyzeForecastVsActual(forecast, snap);
    const b = analyzeForecastVsActual(forecast, snap);
    expect(a).toEqual(b);
  });
});

describe("forecastAnalysis — recalibration rules", () => {
  it("rerun_placement fires when >=2 skills show false_acceleration", () => {
    const snap = makeSnapshot({
      skills: {
        reading: { mastery: 0.9 },
        writing: { mastery: 0.9 },
      },
      cefr: { overall: "B1", perSkill: { reading: "B1", writing: "B1" } },
    });
    const forecast = makeForecast([
      tg("reading", 0.5, "A2"),
      tg("writing", 0.5, "A2"),
    ]);
    const report = analyzeForecastVsActual(forecast, snap);
    expect(
      report.recalibrationRecommendations.some((r) => r.kind === "rerun_placement"),
    ).toBe(true);
  });

  it("drop_speaking_acceleration fires only when speaking misses are present", () => {
    const snapNoSpeaking = makeSnapshot({
      skills: { reading: { mastery: 0.5 } },
      cefr: { overall: "A2", perSkill: { reading: "A2" } },
    });
    const fc = makeForecast([tg("reading", 0.5, "A2")]);
    const report = analyzeForecastVsActual(fc, snapNoSpeaking);
    expect(
      report.recalibrationRecommendations.some((r) => r.kind === "drop_speaking_acceleration"),
    ).toBe(false);
  });
});

describe("forecastAnalysis — learner summary", () => {
  it("returns the on-track string when there are no deviations", () => {
    const summary = summarizeForecastForLearner({
      forecastId: "fc",
      planVersion: "v",
      degradedConfidence: 1,
      deviations: [],
      recalibrationRecommendations: [],
    });
    expect(summary.reasonCode).toBe("forecast_on_track");
    expect(summary.vi.length).toBeGreaterThan(0);
    expect(summary.en.length).toBeGreaterThan(0);
  });

  it("returns optimistic-majority message when ≥2 optimistic biases present", () => {
    const summary = summarizeForecastForLearner({
      forecastId: "fc",
      planVersion: "v",
      degradedConfidence: 0.4,
      deviations: [
        {
          skill: "reading",
          code: "optimistic_bias",
          predictedMastery: 0.8,
          observedMastery: 0.5,
          deltaCefrSteps: -1,
          predictedCefr: "B1",
          observedCefr: "A2",
        },
        {
          skill: "writing",
          code: "optimistic_bias",
          predictedMastery: 0.8,
          observedMastery: 0.5,
          deltaCefrSteps: -1,
          predictedCefr: "B1",
          observedCefr: "A2",
        },
      ],
      recalibrationRecommendations: [],
    });
    expect(summary.reasonCode).toBe("optimistic_bias_majority");
  });
});
