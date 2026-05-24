import { describe, expect, it } from "vitest";
import {
  TUTOR_PRODUCT_CONFIGS,
  aiTutor,
  getSafetyLabel,
  resolveExplainLanguage,
  resolveTargetLanguage,
  viKidsEnglish,
} from "../productConfigs";

describe("tutor product configs", () => {
  it("aiTutor allows French, Chinese, and English targets", () => {
    expect(aiTutor.allowedTargetLanguages).toEqual(expect.arrayContaining(["fr", "zh", "en"]));
  });

  it("viKidsEnglish only allows English target", () => {
    expect(viKidsEnglish.allowedTargetLanguages).toEqual(["en"]);
    expect(resolveTargetLanguage(viKidsEnglish, "fr")).toBe("en");
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
});
