import { describe, expect, it } from "vitest";
import {
  TUTOR_LANGUAGE_CODES,
  TUTOR_LANGUAGE_REGISTRY,
  getSpeechLocale,
  getTtsLocale,
  getTutorLanguage,
  getTutorLanguageLabel,
  resolveTutorTargetLanguage,
} from "../languageRegistry";

describe("tutor language registry", () => {
  it("resolves all supported AI Tutor target languages", () => {
    expect(TUTOR_LANGUAGE_CODES).toEqual(["en", "fr", "zh", "de", "ja", "ko", "es", "vi"]);

    for (const code of TUTOR_LANGUAGE_CODES) {
      expect(resolveTutorTargetLanguage(code)).toBe(code);
      expect(getTutorLanguage(code).code).toBe(code);
    }
  });

  it("falls back unknown targets to English", () => {
    expect(resolveTutorTargetLanguage("unknown")).toBe("en");
    expect(resolveTutorTargetLanguage(null)).toBe("en");
    expect(getTutorLanguage("unknown").code).toBe("en");
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

  it("returns STT and TTS locales from the registry", () => {
    for (const code of TUTOR_LANGUAGE_CODES) {
      expect(getSpeechLocale(code)).toBe(TUTOR_LANGUAGE_REGISTRY[code].speechLocale);
      expect(getTtsLocale(code)).toBe(TUTOR_LANGUAGE_REGISTRY[code].ttsLocale);
    }
  });
});
