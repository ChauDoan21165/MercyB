import { describe, expect, it } from "vitest";
import {
  TUTOR_PRODUCT_CONFIGS,
  aiTutor,
  getTutorProductConfig,
  getSafetyLabel,
  mercyKids,
  resolveExplainLanguage,
  resolveTargetLanguage,
  viKidsEnglish,
} from "../productConfigs";

describe("tutor product configs", () => {
  it("aiTutor allows French, Chinese, and English targets", () => {
    expect(aiTutor.allowedTargetLanguages).toEqual(expect.arrayContaining(["fr", "zh", "en"]));
    expect(aiTutor.modes).toEqual(["journey", "grammar", "speak", "logic"]);
  });

  it("keeps AI Tutor as the clean four-mode general tutor product", () => {
    expect(getTutorProductConfig("aiTutor")).toMatchObject({
      productId: "aiTutor",
      title: "Teacher Mercy AI Tutor",
      tone: "general",
      memoryEnabled: true,
      cloudVoiceEnabled: true,
      rawAudioAllowed: false,
      transcriptStorageAllowed: false,
    });
    expect(aiTutor.modes).toEqual(["journey", "grammar", "speak", "logic"]);
    expect(aiTutor.modes).not.toContain("conversation");
    expect(aiTutor.modes).not.toContain("correction");
  });

  it("viKidsEnglish only allows English target", () => {
    expect(viKidsEnglish.allowedTargetLanguages).toEqual(["en"]);
    expect(resolveTargetLanguage(viKidsEnglish, "fr")).toBe("en");
  });

  it("keeps Việt Kids separate from the multilingual AI Tutor route/product", () => {
    expect(viKidsEnglish.productId).toBe("viKidsEnglish");
    expect(viKidsEnglish.title).toBe("Teacher Mercy · English for Việt Kids");
    expect(viKidsEnglish.tone).toBe("kids-safe");
    expect(viKidsEnglish.allowedTargetLanguages).toEqual(["en"]);
    expect(aiTutor.productId).toBe("aiTutor");
    expect(aiTutor.allowedTargetLanguages).toEqual(expect.arrayContaining(["en", "fr", "zh"]));
    expect(viKidsEnglish).not.toBe(aiTutor);
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
    expect(getSafetyLabel(mercyKids)).toBe("Kids-safe practice");
    expect(getSafetyLabel(aiTutor)).toBe("No raw audio or full transcript storage");
  });
});
