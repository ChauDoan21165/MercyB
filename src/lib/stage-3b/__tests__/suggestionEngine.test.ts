/**
 * Stage 3B — suggestionEngine tests.
 *
 * Drives the pure `decideSuggestion()` core. Gate state is passed in
 * explicitly so the engine tests do not depend on localStorage —
 * `suggestionState.test.ts` covers that surface separately.
 *
 * The forbidden-words guardrail at the bottom sweeps the FULL Stage 3A
 * taxonomy (L1 / placement / phoneme) and asserts that every emitted
 * suggestion clears the anti-pattern filter — that's the brick's
 * load-bearing guarantee per ROADMAP §3B "no streak, no XP, no shame,
 * no daily requirement, no pushy."
 */

import { beforeEach, describe, expect, it } from "vitest";

import type { LocalWeaknessMap } from "../../stage-3a/aggregator";
import {
  L1_DESCRIPTIONS,
  PHONEME_AXIS_KEYS,
  PLACEMENT_DESCRIPTIONS,
} from "../../stage-3a/taxonomy";
import {
  decideSuggestion,
  FORBIDDEN_PHRASES,
  FORBIDDEN_REGEXES,
  getSuggestion,
  type ActivityEvent,
  type GateState,
  type Suggestion,
} from "../suggestionEngine";
import {
  clearDismissedSuggestions,
  dismissSuggestion,
  setSuggestionsDisabled,
} from "../suggestionState";

const EMPTY_GATE: GateState = {
  disabled: false,
  dismissedIds: new Set(),
};

function emptyWeaknesses(): LocalWeaknessMap {
  return {
    topL1Patterns: [],
    placementWeaknesses: [],
    topPronunciationPainPoints: [],
    isEmpty: true,
    generatedAt: 1_700_000_000_000,
  };
}

function lessonEvent(): ActivityEvent {
  return { kind: "lesson_completed", ts: 1_700_000_000_001 };
}

function tutorEvent(): ActivityEvent {
  return { kind: "tutor_turn_completed", ts: 1_700_000_000_002 };
}

function placementEvent(): ActivityEvent {
  return { kind: "placement_step_completed", ts: 1_700_000_000_003 };
}

function pronunciationEvent(axis?: string): ActivityEvent {
  return { kind: "pronunciation_exercise_completed", ts: 1_700_000_000_004, axis };
}

describe("suggestionEngine — fires when fresh evidence + useful action both present", () => {
  it("fires on a repeated L1 pattern after a lesson completes", () => {
    const weaknesses: LocalWeaknessMap = {
      ...emptyWeaknesses(),
      topL1Patterns: [
        { tag: "vi_l1_3rd_person_s", count: 3, lastSeen: 1_700_000_000_000 },
      ],
      isEmpty: false,
    };
    const result = decideSuggestion(lessonEvent(), weaknesses, EMPTY_GATE);
    expect(result).not.toBeNull();
    expect(result!.triggerReason.kind).toBe("repeated_l1_pattern");
    expect(result!.targetAction.kind).toBe("review_l1_pattern");
    expect(result!.dismissible).toBe(true);
  });

  it("fires on a placement weakness after a placement step", () => {
    const weaknesses: LocalWeaknessMap = {
      ...emptyWeaknesses(),
      placementWeaknesses: [
        { tag: "final_consonant_cluster_reduction", severity: "high" },
      ],
      isEmpty: false,
    };
    const result = decideSuggestion(placementEvent(), weaknesses, EMPTY_GATE);
    expect(result).not.toBeNull();
    expect(result!.triggerReason.kind).toBe("high_severity_placement");
    expect(result!.targetAction.kind).toBe("review_placement_weakness");
  });

  it("fires on a high-error phoneme after a pronunciation exercise", () => {
    const weaknesses: LocalWeaknessMap = {
      ...emptyWeaknesses(),
      topPronunciationPainPoints: [
        { axis: "TH_T", errorRate: 0.6, samples: 5 },
      ],
      isEmpty: false,
    };
    const result = decideSuggestion(
      pronunciationEvent("TH_T"),
      weaknesses,
      EMPTY_GATE,
    );
    expect(result).not.toBeNull();
    expect(result!.triggerReason.kind).toBe("high_error_phoneme");
    expect(result!.targetAction.kind).toBe("review_phoneme_axis");
  });
});

describe("suggestionEngine — null when evidence is missing", () => {
  it("returns null when the weakness map is empty", () => {
    expect(
      decideSuggestion(lessonEvent(), emptyWeaknesses(), EMPTY_GATE),
    ).toBeNull();
  });

  it("returns null when an L1 pattern exists but count is below threshold", () => {
    const weaknesses: LocalWeaknessMap = {
      ...emptyWeaknesses(),
      topL1Patterns: [
        { tag: "vi_l1_3rd_person_s", count: 1, lastSeen: 1_700_000_000_000 },
      ],
      isEmpty: false,
    };
    // count=1 doesn't satisfy "repeated"; no other signal present.
    expect(decideSuggestion(lessonEvent(), weaknesses, EMPTY_GATE)).toBeNull();
  });

  it("returns null when a pronunciation error rate is below threshold", () => {
    const weaknesses: LocalWeaknessMap = {
      ...emptyWeaknesses(),
      topPronunciationPainPoints: [
        { axis: "TH_T", errorRate: 0.2, samples: 5 },
      ],
      isEmpty: false,
    };
    expect(
      decideSuggestion(pronunciationEvent("TH_T"), weaknesses, EMPTY_GATE),
    ).toBeNull();
  });

  it("skips unknown phoneme axes and falls back to the next useful action", () => {
    const weaknesses: LocalWeaknessMap = {
      ...emptyWeaknesses(),
      topL1Patterns: [
        { tag: "vi_l1_3rd_person_s", count: 2, lastSeen: 1_700_000_000_000 },
      ],
      topPronunciationPainPoints: [
        { axis: "UNKNOWN_AXIS", errorRate: 0.8, samples: 5 },
      ],
      isEmpty: false,
    };

    const result = decideSuggestion(
      pronunciationEvent("UNKNOWN_AXIS"),
      weaknesses,
      EMPTY_GATE,
    );

    expect(result?.triggerReason.kind).toBe("repeated_l1_pattern");
  });
});

describe("suggestionEngine — null when no useful next action", () => {
  it("returns null when the only weakness is an unknown tag (taxonomy fallback)", () => {
    // count >= threshold but the tag isn't in L1_DESCRIPTIONS, so no
    // useful action — engine declines rather than emit empty copy.
    const weaknesses: LocalWeaknessMap = {
      ...emptyWeaknesses(),
      topL1Patterns: [
        {
          tag: "this_tag_does_not_exist" as unknown as never,
          count: 5,
          lastSeen: 1_700_000_000_000,
        },
      ],
      isEmpty: false,
    };
    expect(decideSuggestion(lessonEvent(), weaknesses, EMPTY_GATE)).toBeNull();
  });

  it("returns null when an unknown placement tag is the only signal", () => {
    const weaknesses: LocalWeaknessMap = {
      ...emptyWeaknesses(),
      placementWeaknesses: [
        { tag: "this_placement_does_not_exist", severity: "high" },
      ],
      isEmpty: false,
    };
    expect(
      decideSuggestion(placementEvent(), weaknesses, EMPTY_GATE),
    ).toBeNull();
  });
});

describe("suggestionEngine — null when learner-controllable gates apply", () => {
  const weaknesses: LocalWeaknessMap = {
    ...emptyWeaknesses(),
    topL1Patterns: [
      { tag: "vi_l1_3rd_person_s", count: 3, lastSeen: 1_700_000_000_000 },
    ],
    isEmpty: false,
  };

  it("returns null when globally disabled", () => {
    expect(
      decideSuggestion(lessonEvent(), weaknesses, {
        disabled: true,
        dismissedIds: new Set(),
      }),
    ).toBeNull();
  });

  it("returns null when this exact suggestion id is already dismissed", () => {
    const fired = decideSuggestion(lessonEvent(), weaknesses, EMPTY_GATE);
    expect(fired).not.toBeNull();
    const dismissedId = fired!.id;

    const next = decideSuggestion(lessonEvent(), weaknesses, {
      disabled: false,
      dismissedIds: new Set([dismissedId]),
    });
    expect(next).toBeNull();
  });

  it("produces a stable id for the same evidence across calls", () => {
    const a = decideSuggestion(lessonEvent(), weaknesses, EMPTY_GATE);
    const b = decideSuggestion(tutorEvent(), weaknesses, EMPTY_GATE);
    expect(a!.id).toBe(b!.id);
  });
});

describe("suggestionEngine — activity event biases first probe", () => {
  it("prefers a phoneme suggestion after a pronunciation exercise even when an L1 also qualifies", () => {
    const weaknesses: LocalWeaknessMap = {
      ...emptyWeaknesses(),
      topL1Patterns: [
        { tag: "vi_l1_3rd_person_s", count: 5, lastSeen: 1_700_000_000_000 },
      ],
      topPronunciationPainPoints: [
        { axis: "TH_T", errorRate: 0.6, samples: 5 },
      ],
      isEmpty: false,
    };

    const lessonPick = decideSuggestion(lessonEvent(), weaknesses, EMPTY_GATE);
    expect(lessonPick!.triggerReason.kind).toBe("repeated_l1_pattern");

    const pronPick = decideSuggestion(
      pronunciationEvent("TH_T"),
      weaknesses,
      EMPTY_GATE,
    );
    expect(pronPick!.triggerReason.kind).toBe("high_error_phoneme");
  });

  it("prefers placement after placement activity, then falls through when the placement tag is not actionable", () => {
    const weaknesses: LocalWeaknessMap = {
      ...emptyWeaknesses(),
      topL1Patterns: [
        { tag: "vi_l1_3rd_person_s", count: 5, lastSeen: 1_700_000_000_000 },
      ],
      placementWeaknesses: [
        { tag: "final_consonant_cluster_reduction", severity: "high" },
      ],
      isEmpty: false,
    };

    const placementPick = decideSuggestion(
      placementEvent(),
      weaknesses,
      EMPTY_GATE,
    );
    expect(placementPick?.triggerReason.kind).toBe("high_severity_placement");

    const fallbackPick = decideSuggestion(
      placementEvent(),
      {
        ...weaknesses,
        placementWeaknesses: [
          { tag: "unknown_placement_tag", severity: "high" },
        ],
      },
      EMPTY_GATE,
    );
    expect(fallbackPick?.triggerReason.kind).toBe("repeated_l1_pattern");
  });

  it("treats placement vi_l1_* tags as L1-backed actionable placement suggestions", () => {
    const weaknesses: LocalWeaknessMap = {
      ...emptyWeaknesses(),
      placementWeaknesses: [
        { tag: "vi_l1_3rd_person_s", severity: "high" },
      ],
      isEmpty: false,
    };

    const result = decideSuggestion(placementEvent(), weaknesses, EMPTY_GATE);

    expect(result?.id).toBe("stage3b:placement:vi_l1_3rd_person_s");
    expect(result?.triggerReason.kind).toBe("high_severity_placement");
    expect(result?.suggestionText.vi).toContain("em");
  });
});

describe("suggestionEngine — getSuggestion wrapper reads persisted gate state", () => {
  const weaknesses: LocalWeaknessMap = {
    ...emptyWeaknesses(),
    topL1Patterns: [
      { tag: "vi_l1_3rd_person_s", count: 3, lastSeen: 1_700_000_000_000 },
    ],
    isEmpty: false,
  };

  beforeEach(() => {
    clearDismissedSuggestions();
    setSuggestionsDisabled(false);
  });

  it("delegates to decideSuggestion when persisted gates are open", () => {
    const result = getSuggestion(lessonEvent(), weaknesses);

    expect(result?.id).toBe("stage3b:l1:vi_l1_3rd_person_s");
  });

  it("suppresses every suggestion when the persisted disabled flag is set", () => {
    setSuggestionsDisabled(true);

    expect(getSuggestion(lessonEvent(), weaknesses)).toBeNull();
  });

  it("suppresses a suggestion whose stable id is in the persisted dismissed set", () => {
    dismissSuggestion("stage3b:l1:vi_l1_3rd_person_s");

    expect(getSuggestion(lessonEvent(), weaknesses)).toBeNull();
  });
});

describe("suggestionEngine — suggestion shape", () => {
  it("emits bilingual text (vi + en, both non-empty)", () => {
    const weaknesses: LocalWeaknessMap = {
      ...emptyWeaknesses(),
      topL1Patterns: [
        { tag: "vi_l1_3rd_person_s", count: 3, lastSeen: 1_700_000_000_000 },
      ],
      isEmpty: false,
    };
    const result = decideSuggestion(lessonEvent(), weaknesses, EMPTY_GATE)!;
    expect(typeof result.suggestionText.vi).toBe("string");
    expect(typeof result.suggestionText.en).toBe("string");
    expect(result.suggestionText.vi.length).toBeGreaterThan(0);
    expect(result.suggestionText.en.length).toBeGreaterThan(0);
  });

  it("uses the em-pronoun on the Vietnamese side", () => {
    const weaknesses: LocalWeaknessMap = {
      ...emptyWeaknesses(),
      topL1Patterns: [
        { tag: "vi_l1_3rd_person_s", count: 3, lastSeen: 1_700_000_000_000 },
      ],
      isEmpty: false,
    };
    const result = decideSuggestion(lessonEvent(), weaknesses, EMPTY_GATE)!;
    expect(/\bem\b/.test(result.suggestionText.vi)).toBe(true);
  });
});

describe("suggestionEngine — GUARDRAILS (load-bearing)", () => {
  it("every emitted suggestion has dismissible: true (literal)", () => {
    const samples = sweepSuggestionsAcrossTaxonomy();
    expect(samples.length).toBeGreaterThan(50);
    for (const s of samples) {
      expect(s.dismissible).toBe(true);
    }
  });

  it("no suggestion contains streak / XP / shame / pushy / daily-requirement language", () => {
    const samples = sweepSuggestionsAcrossTaxonomy();
    const offenders: Array<{ id: string; phrase: string; text: string }> = [];

    for (const s of samples) {
      const haystacks = [s.suggestionText.vi, s.suggestionText.en];
      for (const haystack of haystacks) {
        const lower = haystack.toLowerCase();
        for (const phrase of FORBIDDEN_PHRASES) {
          if (lower.includes(phrase.toLowerCase())) {
            offenders.push({ id: s.id, phrase, text: haystack });
          }
        }
        for (const re of FORBIDDEN_REGEXES) {
          if (re.test(haystack)) {
            offenders.push({ id: s.id, phrase: re.source, text: haystack });
          }
        }
      }
    }

    if (offenders.length > 0) {
      const fmt = offenders
        .slice(0, 5)
        .map((o) => `  ${o.id} — "${o.phrase}" in: ${o.text}`)
        .join("\n");
      throw new Error(
        `${offenders.length} forbidden-phrase hit(s) in suggestion output:\n${fmt}`,
      );
    }

    expect(offenders).toEqual([]);
  });
});

// ── Helpers ───────────────────────────────────────────────────────────

function sweepSuggestionsAcrossTaxonomy(): Suggestion[] {
  const out: Suggestion[] = [];

  for (const tag of Object.keys(L1_DESCRIPTIONS)) {
    const weaknesses: LocalWeaknessMap = {
      ...emptyWeaknesses(),
      topL1Patterns: [
        {
          tag: tag as never,
          count: 3,
          lastSeen: 1_700_000_000_000,
        },
      ],
      isEmpty: false,
    };
    const fired = decideSuggestion(lessonEvent(), weaknesses, EMPTY_GATE);
    if (fired) out.push(fired);
  }

  for (const tag of Object.keys(PLACEMENT_DESCRIPTIONS)) {
    if (tag.startsWith("vi_l1_")) continue;
    const weaknesses: LocalWeaknessMap = {
      ...emptyWeaknesses(),
      placementWeaknesses: [{ tag, severity: "high" }],
      isEmpty: false,
    };
    const fired = decideSuggestion(placementEvent(), weaknesses, EMPTY_GATE);
    if (fired) out.push(fired);
  }

  for (const axis of PHONEME_AXIS_KEYS) {
    const weaknesses: LocalWeaknessMap = {
      ...emptyWeaknesses(),
      topPronunciationPainPoints: [{ axis, errorRate: 0.5, samples: 5 }],
      isEmpty: false,
    };
    const fired = decideSuggestion(
      pronunciationEvent(axis),
      weaknesses,
      EMPTY_GATE,
    );
    if (fired) out.push(fired);
  }

  return out;
}
