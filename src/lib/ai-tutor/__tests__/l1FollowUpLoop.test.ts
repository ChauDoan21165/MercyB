import { describe, expect, it } from "vitest";
import type {
  L1DetectionResult,
  L1WeaknessTag,
} from "@/lib/feedback/l1-error-detector";
import {
  L1_FOCUS_DEPTH_CAP,
  advanceL1Focus,
  buildMoveOnMessageVi,
  classifyL1Confidence,
  followUpsForTag,
  initialL1FocusState,
  isFocusableL1Tag,
  type L1FocusState,
} from "../l1FollowUpLoop";

// ── fixtures ──────────────────────────────────────────────────────────────

/** A real, focus-worthy detection (high-severity tag with authored content). */
function highHit(tag: L1WeaknessTag = "vi_l1_3rd_person_s"): L1DetectionResult {
  return {
    matched: true,
    weaknessTag: tag,
    feedback: { en: "...", vi: "..." },
  };
}

/** A genuine match on a tag OUTSIDE the high-severity allowlist → low conf. */
const lowSeverityHit: L1DetectionResult = {
  matched: true,
  weaknessTag: "vi_l1_adjective_order",
  feedback: { en: "...", vi: "..." },
};

/** No detection at all → low confidence. */
const noHit: L1DetectionResult = {
  matched: false,
  weaknessTag: null,
  feedback: null,
};

// ── confidence ────────────────────────────────────────────────────────────

describe("classifyL1Confidence", () => {
  it("is high only for a real match on a high-severity tag", () => {
    expect(classifyL1Confidence(highHit("vi_l1_3rd_person_s"))).toBe("high");
    expect(classifyL1Confidence(highHit("vi_l1_past_ed"))).toBe("high");
  });

  it("is low for an unmatched detection", () => {
    expect(classifyL1Confidence(noHit)).toBe("low");
  });

  it("is low for a match on a non-high-severity tag", () => {
    expect(classifyL1Confidence(lowSeverityHit)).toBe("low");
  });
});

// ── bank integrity ────────────────────────────────────────────────────────

describe("follow-up bank", () => {
  it("gives every focusable tag at least DEPTH_CAP distinct contexts", () => {
    // So a focus never exhausts contexts before reaching the depth cap.
    const focusable: L1WeaknessTag[] = [
      "vi_l1_3rd_person_s",
      "vi_l1_past_ed",
      "vi_l1_plural_s",
      "vi_l1_missing_be",
      "vi_l1_missing_article",
      "vi_l1_question_no_aux",
      "vi_l1_preposition_transfer",
    ];
    for (const tag of focusable) {
      expect(isFocusableL1Tag(tag)).toBe(true);
      const ctx = followUpsForTag(tag);
      expect(ctx.length).toBeGreaterThanOrEqual(L1_FOCUS_DEPTH_CAP);
      const ids = ctx.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length); // ids unique within tag
      for (const c of ctx) {
        expect(c.tag).toBe(tag);
        expect(c.promptVi.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("treats a high-severity tag with no authored content as non-focusable", () => {
    // vi_l1_a_vs_an_vowel is high-severity (chip-eligible) but has no bank entry.
    expect(isFocusableL1Tag("vi_l1_a_vs_an_vowel")).toBe(false);
  });

  it("never reuses a context id across the whole bank", () => {
    const all = (
      [
        "vi_l1_3rd_person_s",
        "vi_l1_past_ed",
        "vi_l1_plural_s",
        "vi_l1_missing_be",
        "vi_l1_missing_article",
        "vi_l1_question_no_aux",
        "vi_l1_preposition_transfer",
      ] as L1WeaknessTag[]
    ).flatMap((t) => followUpsForTag(t).map((c) => c.id));
    expect(new Set(all).size).toBe(all.length);
  });

  it("every follow-up prompt is Vietnamese-first (invariant 2 regression lock)", () => {
    // Vietnamese-specific letters/diacritics. Locks the whole bank against a
    // silent regression that swaps a VN prompt for a generic English one — the
    // integration test only asserts two of the 3rd-person contexts, so every
    // other context (and all six other tags) would otherwise be unguarded.
    const VIETNAMESE_DIACRITIC =
      /[àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i;
    const focusable: L1WeaknessTag[] = [
      "vi_l1_3rd_person_s",
      "vi_l1_past_ed",
      "vi_l1_plural_s",
      "vi_l1_missing_be",
      "vi_l1_missing_article",
      "vi_l1_question_no_aux",
      "vi_l1_preposition_transfer",
    ];
    for (const tag of focusable) {
      for (const ctx of followUpsForTag(tag)) {
        expect(
          VIETNAMESE_DIACRITIC.test(ctx.promptVi),
          `promptVi for ${ctx.id} must be Vietnamese-first; got "${ctx.promptVi}"`,
        ).toBe(true);
      }
    }
  });
});

// ── reducer: starting / low confidence ─────────────────────────────────────

describe("advanceL1Focus — entry conditions", () => {
  it("converses naturally when low confidence and no active focus", () => {
    const d = advanceL1Focus(initialL1FocusState, noHit);
    expect(d.action).toBe("converse_naturally");
    expect(d.followUp).toBeNull();
    expect(d.focusTag).toBeNull();
    expect(d.nextState).toEqual(initialL1FocusState);
  });

  it("does NOT force a loop on a low-severity match (no fabrication)", () => {
    const d = advanceL1Focus(initialL1FocusState, lowSeverityHit);
    expect(d.action).toBe("converse_naturally");
    expect(d.followUp).toBeNull();
  });

  it("converses naturally on a high-severity tag with no authored content", () => {
    const d = advanceL1Focus(initialL1FocusState, highHit("vi_l1_a_vs_an_vowel"));
    expect(d.action).toBe("converse_naturally");
    expect(d.nextState.focusTag).toBeNull();
  });

  it("starts a focus on the first high-confidence focusable tag", () => {
    const d = advanceL1Focus(initialL1FocusState, highHit("vi_l1_past_ed"));
    expect(d.action).toBe("start_focus");
    expect(d.focusTag).toBe("vi_l1_past_ed");
    expect(d.followUp?.tag).toBe("vi_l1_past_ed");
    expect(d.followUp?.promptVi).toBeTruthy();
    expect(d.nextState.turnsOnTag).toBe(1);
    expect(d.nextState.usedContextIds).toEqual([d.followUp?.id]);
  });
});

// ── reducer: circling the same weakness ─────────────────────────────────────

describe("advanceL1Focus — circling then offering to move on", () => {
  it("delivers DEPTH_CAP distinct same-tag practices, then offers to move on", () => {
    let state = initialL1FocusState;
    const seen: string[] = [];

    // Turn 1: start.
    let d = advanceL1Focus(state, highHit("vi_l1_3rd_person_s"));
    expect(d.action).toBe("start_focus");
    seen.push(d.followUp!.id);
    state = d.nextState;

    // Turns 2..CAP: continue with NEW contexts (never the same sentence twice).
    for (let turn = 2; turn <= L1_FOCUS_DEPTH_CAP; turn++) {
      d = advanceL1Focus(state, highHit("vi_l1_3rd_person_s"));
      expect(d.action).toBe("continue_focus");
      expect(d.focusTag).toBe("vi_l1_3rd_person_s");
      expect(seen).not.toContain(d.followUp!.id); // a NEW context each turn
      seen.push(d.followUp!.id);
      expect(d.nextState.turnsOnTag).toBe(turn);
      state = d.nextState;
    }

    // Next same-tag error past the cap → offer to move on (no nagging).
    d = advanceL1Focus(state, highHit("vi_l1_3rd_person_s"));
    expect(d.action).toBe("offer_move_on");
    expect(d.offerMoveOn).toBe(true);
    expect(d.messageVi).toBeTruthy();
    expect(d.followUp).toBeNull();
    expect(d.nextState.offeredMoveOn).toBe(true);

    expect(new Set(seen).size).toBe(seen.length); // all contexts distinct
  });

  it("offers to move on as soon as the learner produces a clean turn", () => {
    // Start a focus, then a low-confidence (clean) turn.
    const start = advanceL1Focus(initialL1FocusState, highHit("vi_l1_missing_be"));
    const d = advanceL1Focus(start.nextState, noHit);
    expect(d.action).toBe("offer_move_on");
    expect(d.focusTag).toBe("vi_l1_missing_be");
    expect(d.messageVi).toBeTruthy();
    expect(d.nextState.offeredMoveOn).toBe(true);
  });

  it("releases focus after an offer when the learner moves on cleanly", () => {
    const start = advanceL1Focus(initialL1FocusState, highHit("vi_l1_missing_be"));
    const offer = advanceL1Focus(start.nextState, noHit);
    const d = advanceL1Focus(offer.nextState, noHit);
    expect(d.action).toBe("release_focus");
    expect(d.nextState).toEqual(initialL1FocusState);
  });

  it("releases focus (stops nagging) if the error recurs after an offer", () => {
    const start = advanceL1Focus(initialL1FocusState, highHit("vi_l1_plural_s"));
    const offer = advanceL1Focus(start.nextState, noHit); // clean → offer
    const d = advanceL1Focus(offer.nextState, highHit("vi_l1_plural_s"));
    expect(d.action).toBe("release_focus");
    expect(d.nextState).toEqual(initialL1FocusState);
  });
});

// ── reducer: stickiness & determinism ───────────────────────────────────────

describe("advanceL1Focus — stickiness and purity", () => {
  it("stays on the current weakness even if a different high-severity tag fires", () => {
    const start = advanceL1Focus(initialL1FocusState, highHit("vi_l1_past_ed"));
    const d = advanceL1Focus(start.nextState, highHit("vi_l1_plural_s"));
    expect(d.action).toBe("continue_focus");
    expect(d.focusTag).toBe("vi_l1_past_ed"); // sticky, not switched to plural
    expect(d.followUp?.tag).toBe("vi_l1_past_ed");
  });

  it("is a pure function — same inputs give the same output, no mutation", () => {
    const prev: L1FocusState = {
      focusTag: "vi_l1_3rd_person_s",
      turnsOnTag: 1,
      usedContextIds: ["3ps-morning"],
      offeredMoveOn: false,
    };
    const frozen = Object.freeze({ ...prev, usedContextIds: Object.freeze([...prev.usedContextIds]) });
    const a = advanceL1Focus(frozen as L1FocusState, highHit("vi_l1_3rd_person_s"));
    const b = advanceL1Focus(frozen as L1FocusState, highHit("vi_l1_3rd_person_s"));
    expect(a).toEqual(b); // deterministic
    expect(prev.usedContextIds).toEqual(["3ps-morning"]); // input not mutated
  });

  it("never repeats a context id within a single focus", () => {
    let state = initialL1FocusState;
    const used: string[] = [];
    let d = advanceL1Focus(state, highHit("vi_l1_preposition_transfer"));
    while (d.followUp) {
      expect(used).not.toContain(d.followUp.id);
      used.push(d.followUp.id);
      state = d.nextState;
      d = advanceL1Focus(state, highHit("vi_l1_preposition_transfer"));
    }
    expect(used.length).toBeGreaterThan(0);
  });
});

describe("buildMoveOnMessageVi", () => {
  it("is Vietnamese-first and non-empty for a focus tag", () => {
    const msg = buildMoveOnMessageVi("vi_l1_3rd_person_s");
    expect(msg.length).toBeGreaterThan(0);
    expect(msg).toContain("Mình chuyển sang"); // VN phrasing
  });
});
