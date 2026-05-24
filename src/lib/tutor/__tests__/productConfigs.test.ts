import { describe, expect, it } from "vitest";
import {
  TUTOR_PRODUCT_CONFIGS,
  aiTutor,
  getTutorProductConfig,
  getSafetyLabel,
  ieltsSpeaking,
  resolveExplainLanguage,
  resolveTargetLanguage,
  toeicPractice,
  viKidsEnglish,
} from "../productConfigs";

describe("tutor product configs", () => {
  it("aiTutor allows French, Chinese, and English targets", () => {
    expect(aiTutor.allowedTargetLanguages).toEqual(expect.arrayContaining(["fr", "zh", "en"]));
    expect(aiTutor.modes).toEqual(["journey", "grammar", "speak", "logic", "correction", "conversation"]);
  });

  it("viKidsEnglish only allows English target", () => {
    expect(viKidsEnglish.allowedTargetLanguages).toEqual(["en"]);
    expect(resolveTargetLanguage(viKidsEnglish, "fr")).toBe("en");
    expect(viKidsEnglish.modes).toEqual(["journey", "grammar", "speak"]);
  });

  it("viKidsEnglish explains Vietnamese-first", () => {
    expect(viKidsEnglish.explainLanguageStrategy).toBe("vi-first");
    expect(resolveExplainLanguage(viKidsEnglish, "en", "en")).toBe("vi");
  });

  it("disallows raw audio and transcript storage for every product", () => {
    for (const config of Object.values(TUTOR_PRODUCT_CONFIGS)) {
      expect(config.rawAudioAllowed).toBe(false);
      expect(config.transcriptStorageAllowed).toBe(false);
    }
  });

  it("exposes the kids-safe safety label from tone and storage policy", () => {
    expect(getSafetyLabel(viKidsEnglish)).toBe("Kids-safe practice");
    expect(getSafetyLabel(aiTutor)).toBe("No raw audio or full transcript storage");
  });

  it("defines English-only exam placeholders for IELTS and TOEIC", () => {
    expect(ieltsSpeaking.allowedTargetLanguages).toEqual(["en"]);
    expect(ieltsSpeaking.tone).toBe("exam");
    expect(toeicPractice.allowedTargetLanguages).toEqual(["en"]);
    expect(toeicPractice.tone).toBe("business");
    expect(toeicPractice.modes).toEqual(["grammar", "logic", "correction"]);
  });

  it("fails safe to AI Tutor for unknown product ids", () => {
    expect(getTutorProductConfig("unknown-product")).toBe(aiTutor);
  });
});
