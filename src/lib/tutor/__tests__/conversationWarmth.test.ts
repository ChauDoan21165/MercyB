import { describe, expect, it } from "vitest";

import {
  abstentionRedirectFromPronunciation,
  abstentionTriggerFromPronunciation,
  buildAbstentionRedirect,
  buildTurnWarmth,
  type AbstentionTrigger,
  type L1InterferenceNoteInput,
  type WarmthRegister,
} from "@/lib/tutor/conversationWarmth";
import type { ConversationPronunciationResult } from "@/lib/pronunciation/conversationPronunciation";

const REGISTERS: readonly WarmthRegister[] = ["friendly", "respectful"];
const ALL_TRIGGERS: readonly AbstentionTrigger[] = [
  "no_audio",
  "low_confidence_pronunciation",
  "scoring_unavailable",
  "uncertain_interference",
  "uncertain_vietlish",
];

/** Vietnamese diacritics — proxy for "this string is actually Vietnamese". */
const VIETNAMESE_MARKERS = /[ăâêôơưđàáảãạèéẻẽẹìíỉĩịòóỏõọùúủũụỳýỷỹỵ]/i;
/** Any fabricated numeric score (a digit or a percent sign) must never appear. */
const FABRICATED_SCORE = /\d|%/;
/** Shame mechanics are forbidden product-wide. */
const SHAME = /\b(shame|ashamed|guilt|guilty|stupid|dumb|fail(?:ure)?|kém|dốt|ngu)\b/i;

function aResult(
  over: Partial<ConversationPronunciationResult>,
): Pick<ConversationPronunciationResult, "overallScore" | "quality" | "confidence"> {
  return {
    overallScore: over.overallScore ?? null,
    quality: over.quality ?? "ok",
    confidence: over.confidence ?? "ok",
  };
}

describe("buildTurnWarmth", () => {
  it("produces Vietnamese-primary copy for every tone and register", () => {
    for (const register of REGISTERS) {
      for (const outcome of ["strong", "minor_slip", "struggling"] as const) {
        const warmth = buildTurnWarmth({ register, outcome });
        expect(warmth.vi.trim().length).toBeGreaterThan(0);
        expect(warmth.en.trim().length).toBeGreaterThan(0);
        expect(warmth.vi).toMatch(VIETNAMESE_MARKERS);
        expect(warmth.vi).not.toMatch(SHAME);
        expect(warmth.en).not.toMatch(SHAME);
      }
    }
  });

  it("maps outcome to tone (strong→celebrate, minor_slip→encourage, struggling→reassure)", () => {
    expect(buildTurnWarmth({ outcome: "strong" }).tone).toBe("celebrate");
    expect(buildTurnWarmth({ outcome: "minor_slip" }).tone).toBe("encourage");
    expect(buildTurnWarmth({ outcome: "struggling" }).tone).toBe("reassure");
  });

  it("defaults to the encourage tone and friendly register", () => {
    const warmth = buildTurnWarmth({});
    expect(warmth.tone).toBe("encourage");
    expect(warmth.vi).toMatch(VIETNAMESE_MARKERS);
  });

  it("is identity-affirming when the learner is struggling (names Vietnamese as a strength)", () => {
    const friendly = buildTurnWarmth({ outcome: "struggling", register: "friendly", turnIndex: 0 });
    expect(friendly.vi.toLowerCase()).toContain("tiếng việt");
  });

  it("rotates phrasing by turnIndex to avoid repetition", () => {
    const lines = new Set(
      [0, 1, 2].map((turnIndex) => buildTurnWarmth({ outcome: "struggling", turnIndex }).vi),
    );
    expect(lines.size).toBeGreaterThan(1);
  });

  it("seeds the English secondary line from topic warmthPatterns (quoted phrase extracted)", () => {
    const warmth = buildTurnWarmth({
      outcome: "minor_slip",
      warmthPatterns: ["Stay calm around money stress: 'Let's look at it step by step.'"],
      turnIndex: 0,
    });
    expect(warmth.en).toBe("Let's look at it step by step.");
  });

  it("prefers the matched L1 interference note for the English tip when present", () => {
    const note: L1InterferenceNoteInput = {
      id: "banking-open-article",
      label: "Open a bank account",
      note: "Vietnamese learners may drop 'a' and say 'open bank account.' The natural phrase is 'I'd like to open a bank account.'",
    };
    const warmth = buildTurnWarmth({ outcome: "minor_slip", interferenceNote: note });
    expect(warmth.en).toContain("I'd like to open a bank account");
    expect(warmth.vi).toMatch(VIETNAMESE_MARKERS);
  });

  it("never emits a fabricated score in warmth copy", () => {
    for (const register of REGISTERS) {
      for (const outcome of ["strong", "minor_slip", "struggling"] as const) {
        const warmth = buildTurnWarmth({ register, outcome });
        expect(warmth.vi).not.toMatch(FABRICATED_SCORE);
      }
    }
  });
});

describe("buildAbstentionRedirect", () => {
  it("always returns a concrete next prompt (never dead-ends) for every trigger", () => {
    for (const trigger of ALL_TRIGGERS) {
      const redirect = buildAbstentionRedirect({ trigger });
      expect(redirect.nextPrompt.vi.trim().length).toBeGreaterThan(0);
      expect(redirect.nextPrompt.en.trim().length).toBeGreaterThan(0);
      expect(redirect.nextPrompt.vi).toMatch(VIETNAMESE_MARKERS);
    }
  });

  it("acknowledges uncertainty in Vietnamese-first copy without a fabricated score", () => {
    for (const trigger of ALL_TRIGGERS) {
      const redirect = buildAbstentionRedirect({ trigger });
      expect(redirect.vi).toMatch(VIETNAMESE_MARKERS);
      expect(redirect.vi).not.toMatch(FABRICATED_SCORE);
      expect(redirect.en).not.toMatch(FABRICATED_SCORE);
      expect(redirect.vi).not.toMatch(SHAME);
    }
  });

  it("the redirect is more than a bare 'try again' / 'skip'", () => {
    for (const trigger of ALL_TRIGGERS) {
      const redirect = buildAbstentionRedirect({ trigger });
      const combined = `${redirect.vi} ${redirect.nextPrompt.vi}`.toLowerCase();
      // It must invite continued practice, not only retry/skip.
      expect(redirect.nextPrompt.vi.length).toBeGreaterThan(10);
      expect(combined).not.toBe("thử lại");
      expect(combined).not.toBe("bỏ qua");
    }
  });

  it("uses a caller-supplied topic-specific next prompt when provided", () => {
    const redirect = buildAbstentionRedirect({
      trigger: "no_audio",
      suggestedNextPrompt: {
        vi: "Bạn muốn mở loại tài khoản nào trước nhỉ?",
        en: "Which type of account would you like to open first?",
      },
    });
    expect(redirect.nextPrompt.vi).toBe("Bạn muốn mở loại tài khoản nào trước nhỉ?");
    expect(redirect.nextPrompt.en).toBe("Which type of account would you like to open first?");
  });

  it("rotates the default next prompt by turnIndex", () => {
    const prompts = new Set(
      [0, 1, 2].map(
        (turnIndex) => buildAbstentionRedirect({ trigger: "no_audio", turnIndex }).nextPrompt.vi,
      ),
    );
    expect(prompts.size).toBeGreaterThan(1);
  });
});

describe("abstentionTriggerFromPronunciation", () => {
  it("returns null for a solid, confident, real score (caller may render it)", () => {
    expect(
      abstentionTriggerFromPronunciation(aResult({ overallScore: 88, quality: "ok", confidence: "ok" })),
    ).toBeNull();
  });

  it("abstains on null overallScore even when quality reads ok", () => {
    expect(
      abstentionTriggerFromPronunciation(aResult({ overallScore: null, quality: "ok", confidence: "ok" })),
    ).toBe("low_confidence_pronunciation");
  });

  it("abstains on low confidence even with a number present", () => {
    expect(
      abstentionTriggerFromPronunciation(aResult({ overallScore: 72, quality: "ok", confidence: "low" })),
    ).toBe("low_confidence_pronunciation");
  });

  it("maps each non-ok quality to its trigger", () => {
    expect(abstentionTriggerFromPronunciation(aResult({ quality: "no_audio" }))).toBe("no_audio");
    expect(abstentionTriggerFromPronunciation(aResult({ quality: "low_confidence" }))).toBe(
      "low_confidence_pronunciation",
    );
    expect(abstentionTriggerFromPronunciation(aResult({ quality: "scoring_unavailable" }))).toBe(
      "scoring_unavailable",
    );
  });
});

describe("abstentionRedirectFromPronunciation", () => {
  it("returns null when the score is confident and renderable", () => {
    expect(
      abstentionRedirectFromPronunciation(aResult({ overallScore: 90, quality: "ok", confidence: "ok" })),
    ).toBeNull();
  });

  it("returns an honest redirect with a next prompt for no_audio", () => {
    const redirect = abstentionRedirectFromPronunciation(
      aResult({ overallScore: null, quality: "no_audio" }),
      { turnIndex: 1 },
    );
    expect(redirect).not.toBeNull();
    expect(redirect?.trigger).toBe("no_audio");
    expect(redirect?.nextPrompt.vi).toMatch(VIETNAMESE_MARKERS);
    expect(redirect?.vi).not.toMatch(FABRICATED_SCORE);
  });
});
