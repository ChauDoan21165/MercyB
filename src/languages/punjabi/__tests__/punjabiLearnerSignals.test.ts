import { describe, expect, it } from "vitest";

import {
  PUNJABI_LEARNER_SIGNAL_AUDIENCES,
  PUNJABI_LEARNER_SIGNALS_NOTICE,
  PUNJABI_LEARNER_SIGNAL_TYPES,
  PUNJABI_SIGNAL_SEVERITIES,
  punjabiLearnerSignals,
  type PunjabiLearnerSignal,
} from "@/languages/punjabi/learnerSignals";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiLearnerSignals - size and identity", () => {
  it("keeps a compact useful signal set", () => {
    expect(punjabiLearnerSignals.length).toBeGreaterThanOrEqual(16);
    expect(punjabiLearnerSignals.length).toBeLessThanOrEqual(50);
  });

  it("has unique kebab-case ids", () => {
    const ids = punjabiLearnerSignals.map((signal) => signal.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiLearnerSignals - app fields", () => {
  const requiredText: (keyof PunjabiLearnerSignal)[] = [
    "detectorHint",
    "exampleMistake",
    "target_pa",
    "target_en",
    "interpretation_vi",
    "interpretation_en",
    "routingAction",
  ];

  it("fills every required text field", () => {
    for (const signal of punjabiLearnerSignals) {
      for (const key of requiredText) {
        const value = signal[key];
        expect(typeof value, `${signal.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${signal.id}.${key}`).toBeGreaterThan(0);
      }
      expect(signal.suggestedPracticeIds.length, `${signal.id}.suggestedPracticeIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary in target forms", () => {
    for (const signal of punjabiLearnerSignals) {
      expect(GURMUKHI_SCRIPT.test(signal.target_pa), `${signal.id}.target_pa`).toBe(true);
    }
  });

  it("keeps Vietnamese and English interpretations genuinely bilingual", () => {
    for (const signal of punjabiLearnerSignals) {
      expect(signal.interpretation_vi).not.toBe(signal.interpretation_en);
      expect(VIETNAMESE_MARKS.test(signal.interpretation_vi), `${signal.id} should include Vietnamese text`).toBe(true);
    }
  });
});

describe("punjabiLearnerSignals - coverage and guardrails", () => {
  it("uses only valid signal types and covers every required type", () => {
    const present = new Set<PunjabiLearnerSignal["signalType"]>();
    for (const signal of punjabiLearnerSignals) {
      expect(PUNJABI_LEARNER_SIGNAL_TYPES).toContain(signal.signalType);
      present.add(signal.signalType);
    }
    for (const type of PUNJABI_LEARNER_SIGNAL_TYPES) {
      expect(present.has(type), `missing signal type ${type}`).toBe(true);
    }
  });

  it("uses only valid audiences and includes Vietnamese/English-specific signals", () => {
    const present = new Set<PunjabiLearnerSignal["audience"]>();
    for (const signal of punjabiLearnerSignals) {
      expect(PUNJABI_LEARNER_SIGNAL_AUDIENCES).toContain(signal.audience);
      present.add(signal.audience);
    }
    expect(present.has("vi")).toBe(true);
    expect(present.has("en")).toBe(true);
    expect(present.has("both")).toBe(true);
  });

  it("uses only valid severities", () => {
    for (const signal of punjabiLearnerSignals) {
      expect(PUNJABI_SIGNAL_SEVERITIES).toContain(signal.severity);
    }
  });

  it("includes Canada-practical examples", () => {
    expect(punjabiLearnerSignals.filter((signal) => signal.canadaPractical).length).toBeGreaterThanOrEqual(5);
  });

  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_LEARNER_SIGNALS_NOTICE} ${JSON.stringify(punjabiLearnerSignals)}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review or official placement", () => {
    const notice = PUNJABI_LEARNER_SIGNALS_NOTICE.toLowerCase();
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
