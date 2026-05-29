import { describe, expect, it } from "vitest";
import { calculateSentenceMatchPercent, selectSpeakFollowUp } from "@/lib/tutor/speakFollowups";

describe("speakFollowups", () => {
  it("selects a deterministic follow-up for bought-hat sentences", () => {
    expect(selectSpeakFollowUp("I bought a hat yesterday.")).toBe("Where did you buy it?");
  });

  it("selects a dinner follow-up grounded in the target sentence", () => {
    expect(selectSpeakFollowUp("I had dinner with my family.")).toBe("What did you eat?");
  });

  it("falls back gently for unmatched sentences", () => {
    expect(selectSpeakFollowUp("The weather is nice today.")).toBe("Can you tell me one more detail about that?");
  });

  it("calculates exact sentence-match as 100", () => {
    expect(calculateSentenceMatchPercent("I bought a hat yesterday.", "I bought a hat yesterday.")).toBe(100);
  });

  it("calculates partial sentence-match without calling it pronunciation", () => {
    expect(calculateSentenceMatchPercent("I bought a hat", "I bought a hat yesterday.")).toBe(89);
  });
});
