import { describe, expect, it } from "vitest";
import {
  englishTextForTts,
  hasVietnameseDiacritics,
  speechTextFromBilingual,
} from "@/lib/tutor/englishOnlyTts";

describe("englishOnlyTts", () => {
  it("detects Vietnamese diacritics", () => {
    expect(hasVietnameseDiacritics("Mercy chưa nghe rõ.")).toBe(true);
    expect(hasVietnameseDiacritics("I didn't catch that clearly.")).toBe(false);
  });

  it("extracts English from bilingual display strings", () => {
    const speech = englishTextForTts(
      "Mercy chưa nghe rõ. Bạn nói lại nhé. I didn't catch that clearly. Can you say it again?",
    );

    expect(speech).toBe("I didn't catch that clearly. Can you say it again?");
    expect(hasVietnameseDiacritics(speech)).toBe(false);
  });

  it("returns empty speech for Vietnamese-only strings", () => {
    expect(englishTextForTts("Hôm nay trời đẹp.")).toBe("");
  });

  it("uses only the English field from structured bilingual text", () => {
    expect(speechTextFromBilingual({ vi: "Bạn nói lại nhé.", en: "Can you say it again?" })).toBe(
      "Can you say it again?",
    );
  });
});
