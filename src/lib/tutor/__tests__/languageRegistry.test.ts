import { describe, expect, it } from "vitest";
import {
  TUTOR_LANGUAGE_CODES,
  TUTOR_LANGUAGE_REGISTRY,
  getSpeechLocale,
  getTtsLocale,
  getTutorLanguage,
  getTutorLanguageLabel,
  isTutorTargetLanguageSupported,
  resolveTutorTargetLanguage,
} from "../languageRegistry";

describe("tutor language registry", () => {
  it("resolves all supported AI Tutor target languages", () => {
    expect(TUTOR_LANGUAGE_CODES).toEqual(["en", "fr", "zh", "de", "ja", "ko", "es", "vi", "tr", "ru", "th"]);

    for (const code of TUTOR_LANGUAGE_CODES) {
      expect(resolveTutorTargetLanguage(code)).toBe(code);
      expect(getTutorLanguage(code).code).toBe(code);
    }
  });

  it("falls back unknown targets to English", () => {
    expect(resolveTutorTargetLanguage("unknown")).toBe("en");
    expect(resolveTutorTargetLanguage(null)).toBe("en");
    expect(getTutorLanguage("unknown").code).toBe("en");
    expect(isTutorTargetLanguageSupported("unknown")).toBe(false);
  });

  it("resolves /ai-tutor target query values", () => {
    expect(resolveTutorTargetLanguage("?target=fr")).toBe("fr");
    expect(resolveTutorTargetLanguage("/ai-tutor?target=fr")).toBe("fr");
    expect(getTutorLanguage("?target=fr").labelEn).toBe("French");
  });

  it("returns labels from the registry for UI language", () => {
    expect(getTutorLanguageLabel("fr", "en")).toBe("French");
    expect(getTutorLanguageLabel("fr", "vi")).toBe("tiếng Pháp");
    expect(getTutorLanguageLabel("fr", "native")).toBe("français");
  });

  it("recognizes Turkish as a supported AI Tutor target", () => {
    expect(isTutorTargetLanguageSupported("tr")).toBe(true);
    expect(resolveTutorTargetLanguage("?target=tr")).toBe("tr");
    expect(getTutorLanguage("tr")).toMatchObject({
      code: "tr",
      labelEn: "Turkish",
      labelVi: "Tiếng Thổ Nhĩ Kỳ",
      labelNative: "Türkçe",
      speechLocale: "tr-TR",
    });
  });

  it("returns STT and TTS locales from the registry", () => {
    for (const code of TUTOR_LANGUAGE_CODES) {
      expect(getSpeechLocale(code)).toBe(TUTOR_LANGUAGE_REGISTRY[code].speechLocale);
      expect(getTtsLocale(code)).toBe(TUTOR_LANGUAGE_REGISTRY[code].ttsLocale);
    }
  });
  it("resolves Russian language metadata", () => {
    expect(resolveTutorTargetLanguage("russian")).toBe("ru");
    expect(resolveTutorTargetLanguage("русский")).toBe("ru");
    expect(getTutorLanguageLabel("ru", "en")).toBe("Russian");
    expect(getTutorLanguageLabel("ru", "vi")).toBe("Tiếng Nga");
    expect(getSpeechLocale("ru")).toBe("ru-RU");
    expect(getTtsLocale("ru")).toBe("ru-RU");
  });

});
