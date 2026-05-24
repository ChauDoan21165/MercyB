import { describe, expect, it } from "vitest";
import {
  AI_CORRECTION_REQUIRED_MESSAGE,
  correctWithTutorRules,
  validateCorrectionChangedWhenNeeded,
} from "@/lib/tutor/correctionEngine";

describe("correctionEngine", () => {
  it.each([
    ["I buy a hat yesterday.", "I bought a hat yesterday."],
    ["She go to school every day.", "She goes to school every day."],
    ["He eat rice yesterday.", "He ate rice yesterday."],
    ["She go yesterday.", "She went yesterday."],
    ["He have a test yesterday.", "He had a test yesterday."],
    ["I have lunch yesterday.", "I had lunch yesterday."],
    ["I do homework yesterday.", "I did homework yesterday."],
    ["He go to school every day.", "He goes to school every day."],
    ["She eat rice every day.", "She eats rice every day."],
    ["It have food every day.", "It has food every day."],
  ])("corrects beginner English fallback: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
    });
  });

  it("rejects unchanged wrong correction text", () => {
    expect(
      validateCorrectionChangedWhenNeeded(
        "I buy a hat yesterday.",
        "I buy a hat yesterday.",
      ),
    ).toEqual({
      ok: false,
      reason: "unchanged_wrong",
      message: AI_CORRECTION_REQUIRED_MESSAGE,
    });
  });

  it("does not pretend unsupported clearly wrong English is corrected", () => {
    expect(correctWithTutorRules("I run yesterday.", "en")).toEqual({
      status: "needs_ai",
      corrected: "",
      appliedRuleIds: [],
      message: AI_CORRECTION_REQUIRED_MESSAGE,
    });
  });

  it("leaves unsupported French and Chinese placeholder rules unchanged", () => {
    expect(correctWithTutorRules("Je suis aller au marché", "fr")).toMatchObject({
      status: "unchanged",
      corrected: "Je suis aller au marché.",
      appliedRuleIds: [],
    });
    expect(correctWithTutorRules("我昨天去商店", "zh")).toMatchObject({
      status: "unchanged",
      corrected: "我昨天去商店。",
      appliedRuleIds: [],
    });
  });
});
