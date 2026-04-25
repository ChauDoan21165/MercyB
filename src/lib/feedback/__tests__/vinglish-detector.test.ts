import { describe, it, expect } from "vitest";
import {
  detectVNEnglishCodeSwitch,
  resolveVinglishFriendlyMode,
  shouldReverseFramingForL1,
  buildVinglishGuidance,
} from "../vinglish-detector.js";

describe("detectVNEnglishCodeSwitch — pure English (no change in behavior)", () => {
  it("returns hasVNTokens=false for plain English sentence", () => {
    const r = detectVNEnglishCodeSwitch("I want to eat rice for dinner");
    expect(r.hasVNTokens).toBe(false);
    expect(r.vnTokens).toEqual([]);
    expect(r.confidence).toBe(0);
  });

  it("returns hasVNTokens=false for an English question", () => {
    const r = detectVNEnglishCodeSwitch("Where is the bathroom please?");
    expect(r.hasVNTokens).toBe(false);
    expect(r.vnTokens).toEqual([]);
  });

  it("returns hasVNTokens=false for empty / whitespace input", () => {
    expect(detectVNEnglishCodeSwitch("").hasVNTokens).toBe(false);
    expect(detectVNEnglishCodeSwitch("   ").hasVNTokens).toBe(false);
    expect(detectVNEnglishCodeSwitch("").confidence).toBe(0);
  });
});

describe("detectVNEnglishCodeSwitch — Vinglish mix", () => {
  it("detects diacritic VN words inside an English sentence", () => {
    const r = detectVNEnglishCodeSwitch("I want ăn cơm now");
    expect(r.hasVNTokens).toBe(true);
    expect(r.vnTokens).toContain("ăn");
    expect(r.vnTokens).toContain("cơm");
    expect(r.confidence).toBeGreaterThan(0);
    expect(r.confidence).toBeLessThan(1);
  });

  it("detects plain-ASCII VN tokens (anh, chị without diacritics)", () => {
    const r = detectVNEnglishCodeSwitch("anh go to school today");
    expect(r.hasVNTokens).toBe(true);
    expect(r.vnTokens).toContain("anh");
  });

  it("detects 'Chị go where?' as code-switching", () => {
    const r = detectVNEnglishCodeSwitch("Chị go where?");
    expect(r.hasVNTokens).toBe(true);
    expect(r.vnTokens).toContain("chị");
  });

  it("detects sentence-ending particles like 'không'", () => {
    const r = detectVNEnglishCodeSwitch("you like coffee không");
    expect(r.hasVNTokens).toBe(true);
    expect(r.vnTokens).toContain("không");
  });
});

describe("detectVNEnglishCodeSwitch — pure VN (mostly Vietnamese)", () => {
  it("flags nearly-pure-VN input with high confidence", () => {
    const r = detectVNEnglishCodeSwitch("anh ơi em muốn ăn cơm");
    expect(r.hasVNTokens).toBe(true);
    expect(r.vnTokenCount).toBeGreaterThanOrEqual(5);
    expect(r.confidence).toBeGreaterThan(0.7);
  });

  it("handles a fully-VN sentence with diacritics", () => {
    const r = detectVNEnglishCodeSwitch("mình không hiểu bài này");
    expect(r.hasVNTokens).toBe(true);
    expect(r.confidence).toBeGreaterThan(0.5);
  });
});

describe("detectVNEnglishCodeSwitch — confidence math", () => {
  it("a single VN token in a 4-word sentence is ~0.25 confidence", () => {
    const r = detectVNEnglishCodeSwitch("I want ăn lunch");
    expect(r.totalTokens).toBe(4);
    expect(r.vnTokenCount).toBe(1);
    expect(r.confidence).toBe(0.25);
  });

  it("rounds to 2 decimal places", () => {
    // 1 VN token in 3 total → 0.333… → rounded to 0.33
    const r = detectVNEnglishCodeSwitch("anh I am");
    expect(r.confidence).toBe(0.33);
  });

  it("strips trailing punctuation when tokenizing", () => {
    const r = detectVNEnglishCodeSwitch("anh, em, chị!");
    expect(r.vnTokens.sort()).toEqual(["anh", "chị", "em"]);
  });
});

describe("shouldReverseFramingForL1", () => {
  it("returns true when confidence > 0.5 (mostly VN)", () => {
    expect(shouldReverseFramingForL1({
      hasVNTokens: true, vnTokens: ["a", "b", "c"], vnTokenCount: 3,
      totalTokens: 4, confidence: 0.75,
    })).toBe(true);
  });

  it("returns false at exactly 0.5 (open lower bound)", () => {
    expect(shouldReverseFramingForL1({
      hasVNTokens: true, vnTokens: ["a"], vnTokenCount: 1,
      totalTokens: 2, confidence: 0.5,
    })).toBe(false);
  });

  it("returns false for typical code-switching (~0.3)", () => {
    expect(shouldReverseFramingForL1({
      hasVNTokens: true, vnTokens: ["a"], vnTokenCount: 1,
      totalTokens: 3, confidence: 0.33,
    })).toBe(false);
  });
});

describe("resolveVinglishFriendlyMode — toggle precedence", () => {
  it("explicit true overrides any CEFR", () => {
    expect(resolveVinglishFriendlyMode({ explicitToggle: true, cefrLevel: "c1" })).toBe(true);
    expect(resolveVinglishFriendlyMode({ explicitToggle: true, cefrLevel: null })).toBe(true);
  });

  it("explicit false overrides any CEFR", () => {
    expect(resolveVinglishFriendlyMode({ explicitToggle: false, cefrLevel: "a1" })).toBe(false);
    expect(resolveVinglishFriendlyMode({ explicitToggle: false, cefrLevel: null })).toBe(false);
  });

  it("null toggle + beginner CEFR → on", () => {
    for (const level of ["pre_a1", "a1", "a2"]) {
      expect(resolveVinglishFriendlyMode({ explicitToggle: null, cefrLevel: level })).toBe(true);
    }
  });

  it("null toggle + B1+ CEFR → off", () => {
    for (const level of ["b1", "b2", "c1", "c2"]) {
      expect(resolveVinglishFriendlyMode({ explicitToggle: null, cefrLevel: level })).toBe(false);
    }
  });

  it("null toggle + unknown CEFR → on (safer default)", () => {
    expect(resolveVinglishFriendlyMode({ explicitToggle: null, cefrLevel: null })).toBe(true);
    expect(resolveVinglishFriendlyMode({ explicitToggle: null, cefrLevel: "" })).toBe(true);
    expect(resolveVinglishFriendlyMode({ explicitToggle: null, cefrLevel: "??" })).toBe(true);
  });

  it("undefined toggle treated like null", () => {
    expect(resolveVinglishFriendlyMode({ explicitToggle: undefined, cefrLevel: "a1" })).toBe(true);
    expect(resolveVinglishFriendlyMode({ explicitToggle: undefined, cefrLevel: "b1" })).toBe(false);
  });
});

describe("buildVinglishGuidance — toggle gating", () => {
  it("returns null when toggle is off, even if VN tokens are present", () => {
    expect(buildVinglishGuidance({
      learnerText: "I want ăn cơm",
      vinglishFriendlyEnabled: false,
    })).toBeNull();
  });

  it("returns null for pure English when toggle is on", () => {
    expect(buildVinglishGuidance({
      learnerText: "I want to eat rice",
      vinglishFriendlyEnabled: true,
    })).toBeNull();
  });

  it("returns guidance for mixed input when toggle is on", () => {
    const g = buildVinglishGuidance({
      learnerText: "I want ăn cơm",
      vinglishFriendlyEnabled: true,
    });
    expect(g).not.toBeNull();
    expect(g!.detected).toBe(true);
    expect(g!.vnTokens.length).toBeGreaterThan(0);
    expect(g!.framingFlipped).toBe(false); // confidence ~0.5 not > 0.5
    expect(g!.gentleResponse).toContain("Mercy");
    expect(g!.analyticsTag).toBe("vinglish_friendly");
  });

  it("flips framing when input is mostly VN", () => {
    const g = buildVinglishGuidance({
      learnerText: "anh ơi em muốn ăn cơm now",
      vinglishFriendlyEnabled: true,
    });
    expect(g).not.toBeNull();
    expect(g!.framingFlipped).toBe(true);
    expect(g!.gentleResponse).toMatch(/từ từ chuyển sang tiếng Anh/);
  });

  it("handles null / undefined learnerText safely", () => {
    expect(buildVinglishGuidance({
      learnerText: null,
      vinglishFriendlyEnabled: true,
    })).toBeNull();
    expect(buildVinglishGuidance({
      learnerText: undefined,
      vinglishFriendlyEnabled: true,
    })).toBeNull();
  });

  it("never echoes the raw learner text in gentleResponse (privacy)", () => {
    const sneaky = "my email is alice@example.com anh ơi";
    const g = buildVinglishGuidance({
      learnerText: sneaky,
      vinglishFriendlyEnabled: true,
    });
    expect(g).not.toBeNull();
    expect(g!.gentleResponse).not.toContain("alice@example.com");
    expect(g!.gentleResponse).not.toContain("my email");
  });
});

describe("buildVinglishGuidance — analytics tag", () => {
  it("always sets analyticsTag to 'vinglish_friendly' when guidance is returned", () => {
    const g = buildVinglishGuidance({
      learnerText: "Chị go where?",
      vinglishFriendlyEnabled: true,
    });
    expect(g?.analyticsTag).toBe("vinglish_friendly");
  });
});
