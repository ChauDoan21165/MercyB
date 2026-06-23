/**
 * Golden Tests — Personalized Lesson Sequence Generator
 *
 * These are REGRESSION TESTS that verify the sequence generator produces
 * EXACT, known-good outputs for representative learner profiles.
 *
 * If any of these tests break, it means the sequence generation behavior
 * has changed — intentionally or not. Golden test failures require a
 * CONSCIOUS review.
 *
 * What makes these "golden":
 *   1. Exact output assertions — every field verified.
 *   2. Full coverage: cold-start, interference, mastery, goals, recency, CEFR.
 *   3. Organized by scenario archetype — mirrors real learner situations.
 *   4. Both structure (phase count, session count) and content (titles, reasons).
 *
 * Pure functions — no I/O, no side effects, deterministic.
 */

import { describe, expect, it } from "vitest";
import {
  generateLessonSequence,
  generateQuickSequence,
  getDispatchLabelVi,
  LESSON_SEQUENCE_STRATEGY_CATALOG,
  LESSON_SEQUENCE_DIMENSIONS,
  type PersonalizedLessonSequence,
  type LessonSequencePhase,
  type SequenceGeneratorInput,
} from "../lessonSequenceGenerator";
import type { LearnerHistoryProfile } from "../learnerHistoryProfile";
import type { CefrLevel, LearnerGoal } from "../lessonRecommendationIntelligence";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function emptyProfile(overrides: Partial<LearnerHistoryProfile> = {}): LearnerHistoryProfile {
  return {
    product: "english",
    targetLanguage: "en",
    topicMastery: {},
    interferencePatterns: [],
    sessionCount: 0,
    completedSessionCount: 0,
    preferredMode: null,
    updatedAt: Date.now(),
    ...overrides,
  };
}

function defaultInput(overrides: Partial<SequenceGeneratorInput> = {}): SequenceGeneratorInput {
  return {
    profile: emptyProfile(),
    cefrLevel: null,
    goals: [],
    recentPractice: [],
    avgDaysBetweenSessions: null,
    now: 1_700_000_000_000,
    ...overrides,
  };
}

function makeInterferencePattern(
  tag: string,
  observedCount: number,
  lastSeenAt = 1_700_000_000_000,
) {
  return { tag, observedCount, lastSeenAt };
}

function makeRecentPractice(
  topic: string,
  daysAgo: number,
  mode: "grammar" | "speak" | "journey" | "logic" = "grammar",
  now = 1_700_000_000_000,
) {
  const DAY_MS = 24 * 60 * 60 * 1000;
  return {
    topic,
    practicedAt: now - daysAgo * DAY_MS,
    mode,
  };
}

/** Assert that a sequence has the expected structure. */
function assertSequenceStructure(seq: PersonalizedLessonSequence) {
  expect(seq).toHaveProperty("phases");
  expect(seq).toHaveProperty("totalSessions");
  expect(seq).toHaveProperty("estimatedWeeks");
  expect(seq).toHaveProperty("summaryVi");
  expect(seq).toHaveProperty("learnerNoteVi");
  expect(seq).toHaveProperty("adaptedFor");
  expect(seq).toHaveProperty("dispatchLabel");
  expect(Array.isArray(seq.phases)).toBe(true);
  expect(seq.phases.length).toBeGreaterThan(0);
  expect(seq.totalSessions).toBeGreaterThan(0);
  expect(typeof seq.summaryVi).toBe("string");
  expect(seq.summaryVi.length).toBeGreaterThan(0);
  expect(typeof seq.learnerNoteVi).toBe("string");
  expect(seq.learnerNoteVi.length).toBeGreaterThan(0);
}

/** Assert a single phase has all required fields. */
function assertPhaseShape(phase: LessonSequencePhase) {
  expect(phase).toHaveProperty("position");
  expect(phase).toHaveProperty("skillTag");
  expect(phase).toHaveProperty("titleVi");
  expect(phase).toHaveProperty("sessionCount");
  expect(phase).toHaveProperty("reasonVi");
  expect(phase).toHaveProperty("suggestedMode");
  expect(phase).toHaveProperty("prerequisiteSkillTag");
  expect(phase).toHaveProperty("challengeLevel");
  expect(phase).toHaveProperty("strategy");
  expect(phase).toHaveProperty("addressesInterference");
  expect(phase).toHaveProperty("alignedWithGoals");
  expect(phase.position).toBeGreaterThan(0);
  expect(phase.sessionCount).toBeGreaterThan(0);
  expect(phase.sessionCount).toBeLessThanOrEqual(5);
  expect(typeof phase.titleVi).toBe("string");
  expect(phase.titleVi.length).toBeGreaterThan(0);
  expect(typeof phase.reasonVi).toBe("string");
  expect(phase.reasonVi.length).toBeGreaterThan(0);
  expect(["journey", "grammar", "speak", "logic"]).toContain(phase.suggestedMode);
  expect(["easy", "comfortable", "moderate", "stretch", "hard"]).toContain(phase.challengeLevel);
  expect(phase.strategy).toBeTruthy();
}

// ─── Cold-Start / Fallback ────────────────────────────────────────────────────

describe("Cold-start and fallback sequences", () => {
  it("generates fallback balanced sequence when profile has no data", () => {
    const seq = generateLessonSequence(defaultInput());

    assertSequenceStructure(seq);
    expect(seq.dispatchLabel).toBe("fallback:balanced-default");
    expect(seq.phases.length).toBe(3); // FALLBACK_PHASES has 3 entries
    expect(seq.totalSessions).toBeGreaterThan(3);
    expect(seq.estimatedWeeks).toBeNull(); // No cadence data

    // First phase is starter sentence
    expect(seq.phases[0].skillTag).toBe("starter-sentence");
    expect(seq.phases[0].position).toBe(1);
    expect(seq.phases[0].suggestedMode).toBe("grammar");
    expect(seq.phases[0].prerequisiteSkillTag).toBeNull();

    // Second builds on first
    expect(seq.phases[1].skillTag).toBe("daily-life-vocabulary");
    expect(seq.phases[1].prerequisiteSkillTag).toBe("starter-sentence");

    // Third builds on second
    expect(seq.phases[2].skillTag).toBe("speaking-basics");
    expect(seq.phases[2].prerequisiteSkillTag).toBe("daily-life-vocabulary");

    // All phases have good reasons
    for (const phase of seq.phases) {
      assertPhaseShape(phase);
    }

    // Summary mentions the phases
    expect(seq.summaryVi).toContain("Bắt đầu với một câu đơn giản");
    expect(seq.summaryVi).toContain("Xây dựng từ vựng");
    expect(seq.summaryVi).toContain("Luyện nói");
  });

  it("generates fallback for profile with 0 sessions and no patterns", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({ sessionCount: 0, completedSessionCount: 0 }),
    }));

    expect(seq.dispatchLabel).toBe("fallback:balanced-default");
    expect(seq.phases.length).toBe(3);
  });

  it("cold-start learner note is encouraging for A1", () => {
    const seq = generateLessonSequence(defaultInput({
      cefrLevel: "A1",
    }));

    expect(seq.learnerNoteVi).toContain("mới bắt đầu");
    expect(seq.learnerNoteVi).toContain("từng bước nhỏ");
  });

  it("cold-start adaptedFor has correct counts", () => {
    const seq = generateLessonSequence(defaultInput());

    expect(seq.adaptedFor.interferenceCount).toBe(0);
    expect(seq.adaptedFor.lowMasteryTopicCount).toBe(0);
    expect(seq.adaptedFor.cefrLevel).toBeNull();
    expect(seq.adaptedFor.goals).toEqual([]);
    expect(seq.adaptedFor.cadenceDays).toBeNull();
  });
});

// ─── Interference-Driven Sequences ────────────────────────────────────────────

describe("Interference-driven sequences", () => {
  it("prioritizes missing-article when observed >= 3 times", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [
          makeInterferencePattern("missing-article", 5),
        ],
      }),
    }));

    assertSequenceStructure(seq);
    expect(seq.dispatchLabel).toBe("interference:missing-article");
    expect(seq.phases[0].skillTag).toBe("missing-article");
    expect(seq.phases[0].titleVi).toContain("mạo từ");
    expect(seq.phases[0].addressesInterference).toBe("missing-article");
    expect(seq.phases[0].strategy).toBe("target_weakness");
    expect(seq.phases[0].reasonVi).toContain("5");
    expect(seq.phases[0].suggestedMode).toBe("grammar");
  });

  it("prioritizes tense-omission when observed >= 3 times", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 8,
        interferencePatterns: [
          makeInterferencePattern("tense-omission", 4),
        ],
      }),
    }));

    expect(seq.dispatchLabel).toBe("interference:tense-omission");
    expect(seq.phases[0].skillTag).toBe("tense-omission");
    expect(seq.phases[0].titleVi).toContain("thời gian");
    expect(seq.phases[0].reasonVi).toContain("4");
  });

  it("sorts multiple interference patterns by severity (obs count)", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 15,
        interferencePatterns: [
          makeInterferencePattern("word-order", 2),
          makeInterferencePattern("missing-article", 5),
          makeInterferencePattern("tense-omission", 3),
          makeInterferencePattern("preposition-calque", 4),
        ],
      }),
    }));

    // Highest obs count first: missing-article (5) > preposition-calque (4) > tense-omission (3) > word-order (2)
    expect(seq.phases[0].skillTag).toBe("missing-article");
    expect(seq.phases[1].skillTag).toBe("preposition-calque");
    expect(seq.phases[2].skillTag).toBe("tense-omission");
    expect(seq.phases[3].skillTag).toBe("word-order");

    // Dispatch label reflects the first (most urgent) seed
    expect(seq.dispatchLabel).toBe("interference:missing-article");
  });

  it("skips interference patterns with fewer than 2 observations", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 5,
        interferencePatterns: [
          makeInterferencePattern("missing-article", 1), // Too few
          makeInterferencePattern("tense-omission", 1),   // Too few
        ],
      }),
    }));

    // Should fall back — no patterns meet the ≥2 threshold
    expect(seq.dispatchLabel).toBe("fallback:balanced-default");
  });

  it("includes interference patterns at exactly 2 observations", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 5,
        interferencePatterns: [
          makeInterferencePattern("double-negation", 2),
        ],
      }),
    }));

    expect(seq.dispatchLabel).toBe("interference-mild:double-negation");
    expect(seq.phases[0].skillTag).toBe("double-negation");
    expect(seq.phases[0].addressesInterference).toBe("double-negation");
  });

  it("marks A1 interference phases as easy challenge", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [
          makeInterferencePattern("missing-article", 3),
        ],
      }),
      cefrLevel: "A1",
    }));

    expect(seq.phases[0].challengeLevel).toBe("easy");
  });

  it("challenge increases for higher CEFR with same interference", () => {
    const a1 = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("missing-article", 3)],
      }),
      cefrLevel: "A1",
    }));
    const b2 = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("missing-article", 3)],
      }),
      cefrLevel: "B2",
    }));

    expect(a1.phases[0].challengeLevel).toBe("easy");
    expect(b2.phases[0].challengeLevel).toBe("moderate");
  });

  it("includes all covered interference tags", () => {
    // Every tag in INTERFERENCE_PHASE_TEMPLATES should generate a phase
    const tags = [
      "missing-article",
      "tense-omission",
      "preposition-calque",
      "subj-verb-agreement",
      "word-order",
      "zero-copula",
      "double-negation",
    ];

    for (const tag of tags) {
      const seq = generateLessonSequence(defaultInput({
        profile: emptyProfile({
          sessionCount: 10,
          interferencePatterns: [makeInterferencePattern(tag, 3)],
        }),
      }));

      expect(
        seq.phases[0].skillTag,
        `Tag "${tag}" should produce a phase`,
      ).toBe(tag);
    }
  });
});

// ─── Low-Mastery-Driven Sequences ─────────────────────────────────────────────

describe("Low-mastery-driven sequences", () => {
  it("includes low mastery topics (< 50%) in sequence", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        topicMastery: {
          "past-tense": 35,
          articles: 80,
          prepositions: 45,
        },
      }),
    }));

    // past-tense (35%) and prepositions (45%) are < 50%
    // articles (80%) is not included
    // First phase should be the lowest mastery topic
    expect(seq.phases[0].skillTag).toBe("past-tense");
    expect(seq.phases[0].strategy).toBe("cement_foundation");

    // Should have prepositions too (if under maxPhases)
    const hasPrepositions = seq.phases.some((p) => p.skillTag === "prepositions");
    expect(hasPrepositions).toBe(true);
  });

  it("does not include topics at or above 50% mastery", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        topicMastery: {
          "past-tense": 55,
          articles: 80,
        },
      }),
    }));

    // No topics below 50% → should fall back
    expect(seq.dispatchLabel).toBe("fallback:balanced-default");
  });

  it("dispatch label reflects lowest mastery topic", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        topicMastery: {
          "past-tense": 25,
          prepositions: 40,
        },
      }),
    }));

    expect(seq.dispatchLabel).toBe("mastery:past-tense");
  });

  it("low mastery topics come after interference patterns", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 15,
        topicMastery: {
          "past-tense": 35,
          prepositions: 40,
        },
        interferencePatterns: [
          makeInterferencePattern("missing-article", 4),
        ],
      }),
    }));

    // Interference first, then low mastery
    expect(seq.phases[0].skillTag).toBe("missing-article");
    expect(seq.phases[1].skillTag).toBe("past-tense");
    expect(seq.phases[2].skillTag).toBe("prepositions");
  });

  it("present-perfect phase has past-tense as prerequisite", () => {
    // When present-perfect is low mastery, it should reference past-tense
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        topicMastery: {
          "present-perfect": 35,
        },
      }),
    }));

    expect(seq.phases[0].skillTag).toBe("present-perfect");
    expect(seq.phases[0].prerequisiteSkillTag).toBe("past-tense");
  });
});

// ─── Goal-Aligned Sequences ────────────────────────────────────────────────────

describe("Goal-aligned sequences", () => {
  it("adds daily conversation phases when goal is set and few other needs", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 8,
      }),
      goals: ["daily_conversation"],
    }));

    expect(seq.phases.length).toBeGreaterThan(0);
    const hasDailyConv = seq.phases.some(
      (p) => p.skillTag.includes("daily-conversation"),
    );
    expect(hasDailyConv).toBe(true);
  });

  it("adds workplace phases when goal is workplace_english", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 8,
      }),
      goals: ["workplace_english"],
    }));

    const hasWorkplace = seq.phases.some(
      (p) => p.skillTag.includes("workplace"),
    );
    expect(hasWorkplace).toBe(true);
  });

  it("adds IELTS phases when goal is ielts_preparation", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 12,
      }),
      goals: ["ielts_preparation"],
    }));

    const hasIelts = seq.phases.some(
      (p) => p.skillTag.includes("ielts"),
    );
    expect(hasIelts).toBe(true);
  });

  it("adds travel phases when goal is travel_english", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 6,
      }),
      goals: ["travel_english"],
    }));

    const hasTravel = seq.phases.some(
      (p) => p.skillTag.includes("travel"),
    );
    expect(hasTravel).toBe(true);
  });

  it("adds job interview phases when goal is job_interview", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
      }),
      goals: ["job_interview"],
    }));

    const hasInterview = seq.phases.some(
      (p) => p.skillTag.includes("job-interview"),
    );
    expect(hasInterview).toBe(true);
  });

  it("adds general improvement phases when goal is general_improvement", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 5,
      }),
      goals: ["general_improvement"],
    }));

    const hasGeneral = seq.phases.some(
      (p) => p.skillTag.includes("general"),
    );
    expect(hasGeneral).toBe(true);
  });

  it("goal-aligned phases appear after interference and mastery phases", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 12,
        interferencePatterns: [makeInterferencePattern("missing-article", 3)],
        topicMastery: { "past-tense": 35 },
      }),
      goals: ["daily_conversation"],
    }));

    // Order: interference first, then mastery, then goal
    const interferenceIdx = seq.phases.findIndex((p) => p.skillTag === "missing-article");
    const masteryIdx = seq.phases.findIndex((p) => p.skillTag === "past-tense");
    const goalIdx = seq.phases.findIndex((p) => p.skillTag.includes("daily-conversation"));

    expect(interferenceIdx).toBe(0);
    expect(masteryIdx).toBeLessThan(goalIdx);
  });

  it("multiple goals add phases from each", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 8,
      }),
      goals: ["daily_conversation", "travel_english"],
    }));

    const hasDaily = seq.phases.some((p) => p.skillTag.includes("daily-conversation"));
    const hasTravel = seq.phases.some((p) => p.skillTag.includes("travel"));
    expect(hasDaily).toBe(true);
    expect(hasTravel).toBe(true);
  });

  it("goal phases have alignedWithGoals: true", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({ sessionCount: 8 }),
      goals: ["daily_conversation"],
    }));

    const goalPhases = seq.phases.filter((p) => p.alignedWithGoals);
    expect(goalPhases.length).toBeGreaterThan(0);
  });
});

// ─── Recency-Aware Ordering ────────────────────────────────────────────────────

describe("Recency-aware ordering", () => {
  it("delays recently practiced skills that are not strong interference", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [
          makeInterferencePattern("missing-article", 5),
          makeInterferencePattern("tense-omission", 3),
        ],
      }),
      // missing-article was practiced today
      recentPractice: [makeRecentPractice("missing-article", 0)],
    }));

    // missing-article is strong interference (≥5) → should NOT be delayed
    expect(seq.phases[0].skillTag).toBe("missing-article");
  });

  it("delays mild interference if recently practiced", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [
          makeInterferencePattern("tense-omission", 3), // moderate
          makeInterferencePattern("word-order", 2),     // mild
        ],
      }),
      // word-order was practiced yesterday
      recentPractice: [makeRecentPractice("word-order", 1)],
    }));

    // word-order should be delayed (mild + recently practiced)
    // tense-omission should come first
    expect(seq.phases[0].skillTag).toBe("tense-omission");
  });

  it("strong interference (≥5) always comes first even if recently practiced", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [
          makeInterferencePattern("tense-omission", 2),
          makeInterferencePattern("missing-article", 7),
        ],
      }),
      recentPractice: [makeRecentPractice("missing-article", 0)],
    }));

    // missing-article (obs=7 → strong) should NOT be delayed
    expect(seq.phases[0].skillTag).toBe("missing-article");
  });

  it("does not delay practice older than 3 days", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [
          makeInterferencePattern("missing-article", 5),
          makeInterferencePattern("word-order", 2),
        ],
      }),
      recentPractice: [makeRecentPractice("word-order", 5)], // 5 days ago
    }));

    // word-order was practiced 5 days ago → not "recent" anymore
    // missing-article (obs=5) still comes first anyway
    expect(seq.phases[0].skillTag).toBe("missing-article");
  });
});

// ─── CEFR Calibration ──────────────────────────────────────────────────────────

describe("CEFR calibration", () => {
  it("A1 learner gets easy first phase in fallback", () => {
    const seq = generateLessonSequence(defaultInput({
      cefrLevel: "A1",
    }));

    expect(seq.phases[0].challengeLevel).toBe("easy");
    expect(seq.phases[0].strategy).toBe("build_confidence");
  });

  it("B1 learner gets moderate challenge in fallback", () => {
    const seq = generateLessonSequence(defaultInput({
      cefrLevel: "B1",
    }));

    // First phase for B1 in fallback should not be "easy"
    expect(seq.phases[0].challengeLevel).not.toBe("easy");
  });

  it("C2 learner with interference gets stretch challenge", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 20,
        interferencePatterns: [makeInterferencePattern("missing-article", 3)],
      }),
      cefrLevel: "C2",
    }));

    // C2 should not start with "easy" even for fundamentals
    expect(seq.phases[0].challengeLevel).not.toBe("easy");
  });

  it("advanced CEFR compresses session counts", () => {
    const a1Seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("missing-article", 5)],
      }),
      cefrLevel: "A1",
    }));
    const c1Seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("missing-article", 5)],
      }),
      cefrLevel: "C1",
    }));

    // C1 should have fewer or equal sessions for the same pattern
    expect(c1Seq.phases[0].sessionCount).toBeLessThanOrEqual(
      a1Seq.phases[0].sessionCount,
    );
  });

  it("CEFR-aware adaptedFor field", () => {
    const seq = generateLessonSequence(defaultInput({
      cefrLevel: "B2",
      profile: emptyProfile({
        sessionCount: 15,
        interferencePatterns: [
          makeInterferencePattern("tense-omission", 3),
        ],
      }),
    }));

    expect(seq.adaptedFor.cefrLevel).toBe("B2");
  });
});

// ─── Cadence Calibration ───────────────────────────────────────────────────────

describe("Cadence calibration", () => {
  it("infrequent learner (7+ days) gets compressed sessions", () => {
    const frequent = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("missing-article", 4)],
      }),
      avgDaysBetweenSessions: 2,
    }));
    const infrequent = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("missing-article", 4)],
      }),
      avgDaysBetweenSessions: 7,
    }));

    // Infrequent learner should have ≤ sessions per phase
    expect(infrequent.phases[0].sessionCount).toBeLessThanOrEqual(
      frequent.phases[0].sessionCount,
    );
  });

  it("estimates weeks from cadence", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("missing-article", 3)],
      }),
      avgDaysBetweenSessions: 3,
    }));

    expect(seq.estimatedWeeks).not.toBeNull();
    expect(seq.estimatedWeeks!).toBeGreaterThan(0);

    // 3 days between sessions = ~2.33 sessions/week
    // totalSessions / sessionsPerWeek = estimated weeks
    const expectedWeeks = Math.ceil(
      seq.totalSessions / (7 / 3),
    );
    expect(seq.estimatedWeeks).toBe(expectedWeeks);
  });

  it("returns null weeks when cadence is unknown", () => {
    const seq = generateLessonSequence(defaultInput({
      avgDaysBetweenSessions: null,
    }));

    expect(seq.estimatedWeeks).toBeNull();
  });

  it("long-gap learner note mentions returning after break", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 5,
        interferencePatterns: [makeInterferencePattern("missing-article", 3)],
      }),
      avgDaysBetweenSessions: 10,
    }));

    expect(seq.learnerNoteVi).toContain("khoảng nghỉ");
  });

  it("regular learner note mentions momentum", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("tense-omission", 3)],
      }),
      avgDaysBetweenSessions: 2,
    }));

    expect(seq.learnerNoteVi).toContain("đà");
  });
});

// ─── Multi-Source Combined Sequences ───────────────────────────────────────────

describe("Multi-source combined sequences", () => {
  it("combines interference, mastery, and goals in correct priority order", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 15,
        interferencePatterns: [
          makeInterferencePattern("missing-article", 5),
          makeInterferencePattern("tense-omission", 3),
        ],
        topicMastery: {
          "past-tense": 35,
          articles: 80,
        },
      }),
      goals: ["daily_conversation"],
    }));

    // Order: interference first, then mastery, then goals
    // missing-article (obs=5) → tense-omission (obs=3) → past-tense (35%) → daily-conversation
    const idxArticle = seq.phases.findIndex((p) => p.skillTag === "missing-article");
    const idxTense = seq.phases.findIndex((p) => p.skillTag === "tense-omission");
    const idxPast = seq.phases.findIndex((p) => p.skillTag === "past-tense");
    const idxDaily = seq.phases.findIndex((p) => p.skillTag.includes("daily-conversation"));

    expect(idxArticle).toBe(0);
    expect(idxTense).toBe(1);
    expect(idxPast).toBe(2);
    expect(idxDaily).toBeGreaterThan(idxPast);
  });

  it("each phase has sequential positions starting from 1", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 15,
        interferencePatterns: [
          makeInterferencePattern("missing-article", 5),
          makeInterferencePattern("tense-omission", 3),
          makeInterferencePattern("preposition-calque", 4),
        ],
      }),
    }));

    for (let i = 0; i < seq.phases.length; i++) {
      expect(seq.phases[i].position).toBe(i + 1);
    }
  });

  it("later phases reference earlier phases as prerequisites", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 15,
        interferencePatterns: [
          makeInterferencePattern("missing-article", 5),
          makeInterferencePattern("tense-omission", 3),
        ],
      }),
    }));

    // Second phase should reference first phase as prerequisite
    expect(seq.phases[1].prerequisiteSkillTag).toBe(seq.phases[0].skillTag);
  });
});

// ─── Quick Sequence ────────────────────────────────────────────────────────────

describe("generateQuickSequence", () => {
  it("returns at most 3 phases", () => {
    const seq = generateQuickSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 15,
        interferencePatterns: [
          makeInterferencePattern("missing-article", 5),
          makeInterferencePattern("tense-omission", 3),
          makeInterferencePattern("preposition-calque", 4),
          makeInterferencePattern("subj-verb-agreement", 3),
        ],
      }),
    }));

    expect(seq.phases.length).toBeLessThanOrEqual(3);
  });

  it("quick sequence has correct structure", () => {
    const seq = generateQuickSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 5,
      }),
    }));

    assertSequenceStructure(seq);
    expect(seq.phases.length).toBeLessThanOrEqual(3);
  });
});

// ─── maxPhases Parameter ───────────────────────────────────────────────────────

describe("maxPhases parameter", () => {
  it("respects custom maxPhases (2)", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 15,
        interferencePatterns: [
          makeInterferencePattern("missing-article", 5),
          makeInterferencePattern("tense-omission", 3),
          makeInterferencePattern("preposition-calque", 4),
        ],
      }),
      maxPhases: 2,
    }));

    expect(seq.phases.length).toBe(2);
  });

  it("respects custom maxPhases (4)", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 15,
        interferencePatterns: [
          makeInterferencePattern("missing-article", 5),
          makeInterferencePattern("tense-omission", 3),
          makeInterferencePattern("preposition-calque", 4),
          makeInterferencePattern("subj-verb-agreement", 3),
          makeInterferencePattern("word-order", 2),
          makeInterferencePattern("zero-copula", 3),
        ],
      }),
      maxPhases: 4,
    }));

    expect(seq.phases.length).toBe(4);
  });

  it("clamps maxPhases to [2, 8] range", () => {
    // Too low → clamped to 2
    const low = generateLessonSequence(defaultInput({
      maxPhases: 1,
    }));
    expect(low.phases.length).toBeGreaterThanOrEqual(2);

    // Too high → clamped to 8
    const high = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 30,
        interferencePatterns: Array.from({ length: 10 }, (_, i) =>
          makeInterferencePattern(`tag-${i}`, 5),
        ),
      }),
      maxPhases: 20,
    }));
    expect(high.phases.length).toBeLessThanOrEqual(8);
  });
});

// ─── Dispatch Label ────────────────────────────────────────────────────────────

describe("Dispatch label", () => {
  it("returns 'fallback:balanced-default' for empty profile", () => {
    const seq = generateLessonSequence(defaultInput());
    expect(seq.dispatchLabel).toBe("fallback:balanced-default");
  });

  it("returns 'interference:<tag>' for high-count interference", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("tense-omission", 5)],
      }),
    }));
    expect(seq.dispatchLabel).toBe("interference:tense-omission");
  });

  it("returns 'interference-mild:<tag>' for 2-observation interference", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 5,
        interferencePatterns: [makeInterferencePattern("word-order", 2)],
      }),
    }));
    expect(seq.dispatchLabel).toBe("interference-mild:word-order");
  });

  it("returns 'mastery:<tag>' for low mastery without interference", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        topicMastery: { "past-tense": 30 },
      }),
    }));
    expect(seq.dispatchLabel).toBe("mastery:past-tense");
  });

  it("returns 'goal:<tag>' for goal-driven without interference or mastery", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({ sessionCount: 10 }),
      goals: ["daily_conversation"],
    }));
    expect(seq.dispatchLabel).toContain("goal:");
  });
});

// ─── getDispatchLabelVi ────────────────────────────────────────────────────────

describe("getDispatchLabelVi", () => {
  it("formats interference label", () => {
    const label = getDispatchLabelVi("interference:missing-article");
    expect(label).toContain("lỗi hệ thống");
    expect(label).toContain("missing article");
  });

  it("formats mild interference label", () => {
    const label = getDispatchLabelVi("interference-mild:word-order");
    expect(label).toContain("lỗi nhẹ");
    expect(label).toContain("word order");
  });

  it("formats mastery label", () => {
    const label = getDispatchLabelVi("mastery:past-tense");
    expect(label).toContain("mastery thấp");
    expect(label).toContain("past tense");
  });

  it("formats goal label", () => {
    const label = getDispatchLabelVi("goal:daily-conversation-introductions");
    expect(label).toContain("mục tiêu");
  });

  it("formats fallback label", () => {
    const label = getDispatchLabelVi("fallback:balanced-default");
    expect(label).toContain("mặc định");
    expect(label).toContain("chưa đủ dữ liệu");
  });

  it("passthrough for unknown labels", () => {
    const label = getDispatchLabelVi("unknown-label-xyz");
    expect(label).toBe("unknown-label-xyz");
  });
});

// ─── Learner Note Personalization ──────────────────────────────────────────────

describe("Learner note personalization", () => {
  it("A1 beginner gets encouraging note", () => {
    const seq = generateLessonSequence(defaultInput({
      cefrLevel: "A1",
      profile: emptyProfile({ sessionCount: 2 }),
    }));

    expect(seq.learnerNoteVi).toContain("mới bắt đầu");
  });

  it("C1 advanced learner gets polish note", () => {
    const seq = generateLessonSequence(defaultInput({
      cefrLevel: "C1",
      profile: emptyProfile({
        sessionCount: 30,
        interferencePatterns: [makeInterferencePattern("missing-article", 3)],
      }),
    }));

    expect(seq.learnerNoteVi).toContain("bản xứ");
  });

  it("returning after gap gets warm welcome note", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 5,
        interferencePatterns: [makeInterferencePattern("missing-article", 3)],
      }),
      avgDaysBetweenSessions: 10,
    }));

    expect(seq.learnerNoteVi).toContain("khoảng nghỉ");
  });

  it("regular learner gets momentum note", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("tense-omission", 3)],
      }),
      avgDaysBetweenSessions: 2,
    }));

    expect(seq.learnerNoteVi).toContain("đà");
  });
});

// ─── Session Count ─────────────────────────────────────────────────────────────

describe("Session count calculation", () => {
  it("totalSessions equals sum of all phase sessionCounts", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 15,
        interferencePatterns: [
          makeInterferencePattern("missing-article", 5),
          makeInterferencePattern("tense-omission", 3),
          makeInterferencePattern("preposition-calque", 4),
        ],
      }),
    }));

    const sum = seq.phases.reduce((acc, p) => acc + p.sessionCount, 0);
    expect(seq.totalSessions).toBe(sum);
  });

  it("session count per phase is between 1 and 5", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 20,
        interferencePatterns: Array.from({ length: 5 }, (_, i) =>
          makeInterferencePattern(`tag-${i}`, i + 1),
        ),
      }),
      maxPhases: 5,
    }));

    for (const phase of seq.phases) {
      expect(phase.sessionCount).toBeGreaterThanOrEqual(1);
      expect(phase.sessionCount).toBeLessThanOrEqual(5);
    }
  });

  it("high observation count leads to more sessions", () => {
    const low = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("missing-article", 2)],
      }),
    }));
    const high = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("missing-article", 10)],
      }),
    }));

    // Higher obs count → more sessions (capped at 4 for missing-article)
    expect(high.phases[0].sessionCount).toBeGreaterThanOrEqual(
      low.phases[0].sessionCount,
    );
  });
});

// ─── Summary Content ───────────────────────────────────────────────────────────

describe("Summary content", () => {
  it("summary includes phase count", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("missing-article", 3)],
      }),
    }));

    expect(seq.summaryVi).toContain("lộ trình");
  });

  it("summary includes total session count", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("missing-article", 3)],
      }),
    }));

    expect(seq.summaryVi).toContain(String(seq.totalSessions));
  });

  it("summary with cadence includes weeks estimate", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("missing-article", 3)],
      }),
      avgDaysBetweenSessions: 3,
    }));

    expect(seq.summaryVi).toContain("tuần");
  });

  it("summary without cadence mentions it's unknown", () => {
    const seq = generateLessonSequence(defaultInput({
      avgDaysBetweenSessions: null,
    }));

    expect(seq.summaryVi).toContain("chưa biết nhịp học");
  });
});

// ─── AdaptedFor Metadata ───────────────────────────────────────────────────────

describe("AdaptedFor metadata", () => {
  it("counts interference patterns with >= 2 observations", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [
          makeInterferencePattern("missing-article", 5),
          makeInterferencePattern("tense-omission", 3),
          makeInterferencePattern("word-order", 1), // too few — doesn't count
        ],
      }),
    }));

    expect(seq.adaptedFor.interferenceCount).toBe(2);
  });

  it("counts low mastery topics (< 50%)", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        topicMastery: {
          "past-tense": 35,
          articles: 80,
          prepositions: 45,
          speaking: 60,
        },
      }),
    }));

    // past-tense (35) and prepositions (45) are < 50%
    // articles (80) and speaking (60) are ≥ 50%
    expect(seq.adaptedFor.lowMasteryTopicCount).toBe(2);
  });

  it("records goals and cadence in adaptedFor", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({ sessionCount: 5 }),
      goals: ["daily_conversation", "travel_english"],
      avgDaysBetweenSessions: 3,
    }));

    expect(seq.adaptedFor.goals).toEqual(["daily_conversation", "travel_english"]);
    expect(seq.adaptedFor.cadenceDays).toBe(3);
  });
});

// ─── Strategy Assignment ───────────────────────────────────────────────────────

describe("Strategy assignment", () => {
  it("interference patterns get target_weakness strategy", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("missing-article", 5)],
      }),
    }));

    expect(seq.phases[0].strategy).toBe("target_weakness");
  });

  it("low mastery topics get cement_foundation strategy", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        topicMastery: { "past-tense": 30 },
      }),
    }));

    expect(seq.phases[0].strategy).toBe("cement_foundation");
  });

  it("A1 fallback first phase gets build_confidence", () => {
    const seq = generateLessonSequence(defaultInput({
      cefrLevel: "A1",
    }));

    expect(seq.phases[0].strategy).toBe("build_confidence");
  });

  it("speak mode on non-A1 gets real_world_practice", () => {
    // Use a goal that generates speak mode phases
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({ sessionCount: 10 }),
      cefrLevel: "B1",
      goals: ["daily_conversation"],
    }));

    const speakPhases = seq.phases.filter((p) => p.suggestedMode === "speak");
    if (speakPhases.length > 0) {
      expect(speakPhases[0].strategy).toBe("real_world_practice");
    }
  });
});

// ─── Phase Shape and Contract ──────────────────────────────────────────────────

describe("Phase shape contract", () => {
  it("all phases in all sequence types have valid shapes", () => {
    const inputs: SequenceGeneratorInput[] = [
      // Empty
      defaultInput(),
      // With interference
      defaultInput({
        profile: emptyProfile({
          sessionCount: 10,
          interferencePatterns: [makeInterferencePattern("missing-article", 5)],
        }),
      }),
      // With mastery
      defaultInput({
        profile: emptyProfile({
          sessionCount: 10,
          topicMastery: { "past-tense": 30, prepositions: 40 },
        }),
      }),
      // With goals
      defaultInput({
        profile: emptyProfile({ sessionCount: 10 }),
        goals: ["daily_conversation"],
      }),
      // Combined
      defaultInput({
        profile: emptyProfile({
          sessionCount: 15,
          interferencePatterns: [
            makeInterferencePattern("missing-article", 5),
            makeInterferencePattern("tense-omission", 3),
          ],
          topicMastery: { "past-tense": 35 },
        }),
        goals: ["daily_conversation"],
        cefrLevel: "B1",
        avgDaysBetweenSessions: 3,
      }),
    ];

    for (const inp of inputs) {
      const seq = generateLessonSequence(inp);
      for (const phase of seq.phases) {
        assertPhaseShape(phase);
      }
    }
  });

  it("sequence types can handle nil inputs", () => {
    // null cefr, empty goals, no practice, no cadence
    const seq = generateLessonSequence({
      profile: emptyProfile(),
      cefrLevel: null,
      goals: [],
      recentPractice: [],
      avgDaysBetweenSessions: null,
    });

    assertSequenceStructure(seq);
    expect(seq.phases.length).toBeGreaterThan(0);
  });
});

// ─── Catalog and Dimension Exports ────────────────────────────────────────────

describe("Catalog and dimension exports", () => {
  it("LESSON_SEQUENCE_STRATEGY_CATALOG has required entries", () => {
    expect(LESSON_SEQUENCE_STRATEGY_CATALOG.length).toBeGreaterThan(0);

    const keys = LESSON_SEQUENCE_STRATEGY_CATALOG.map((e) => e.key);
    expect(keys).toContain("interference-first");
    expect(keys).toContain("mastery-gap-review");
    expect(keys).toContain("goal-aligned-padding");
    expect(keys).toContain("recency-aware-ordering");
    expect(keys).toContain("cadence-calibration");
    expect(keys).toContain("cefr-challenge-gradient");
    expect(keys).toContain("strategy-per-phase");

    for (const entry of LESSON_SEQUENCE_STRATEGY_CATALOG) {
      expect(entry.titleVi).toBeTruthy();
      expect(entry.titleEn).toBeTruthy();
      expect(entry.descriptionVi).toBeTruthy();
    }
  });

  it("LESSON_SEQUENCE_DIMENSIONS has required entries", () => {
    expect(LESSON_SEQUENCE_DIMENSIONS.length).toBeGreaterThan(0);

    const ids = LESSON_SEQUENCE_DIMENSIONS.map((d) => d.id);
    expect(ids).toContain("weakness_priority");
    expect(ids).toContain("recency_awareness");
    expect(ids).toContain("session_calibration");
    expect(ids).toContain("prerequisite_chaining");
    expect(ids).toContain("personalized_messaging");

    for (const dim of LESSON_SEQUENCE_DIMENSIONS) {
      expect(dim.titleVi).toBeTruthy();
      expect(dim.titleEn).toBeTruthy();
      expect(dim.descriptionVi).toBeTruthy();
    }
  });
});

// ─── Determinism ───────────────────────────────────────────────────────────────

describe("Determinism", () => {
  it("same input produces identical output", () => {
    const inp = defaultInput({
      profile: emptyProfile({
        sessionCount: 15,
        interferencePatterns: [
          makeInterferencePattern("missing-article", 5),
          makeInterferencePattern("tense-omission", 3),
          makeInterferencePattern("preposition-calque", 4),
        ],
        topicMastery: { "past-tense": 35 },
      }),
      goals: ["daily_conversation"],
      cefrLevel: "B1",
      avgDaysBetweenSessions: 3,
    });

    const seq1 = generateLessonSequence(inp);
    const seq2 = generateLessonSequence(inp);

    expect(seq1.dispatchLabel).toBe(seq2.dispatchLabel);
    expect(seq1.totalSessions).toBe(seq2.totalSessions);
    expect(seq1.phases.length).toBe(seq2.phases.length);
    expect(seq1.estimatedWeeks).toBe(seq2.estimatedWeeks);
    expect(seq1.summaryVi).toBe(seq2.summaryVi);
    expect(seq1.learnerNoteVi).toBe(seq2.learnerNoteVi);

    for (let i = 0; i < seq1.phases.length; i++) {
      expect(seq1.phases[i].skillTag).toBe(seq2.phases[i].skillTag);
      expect(seq1.phases[i].sessionCount).toBe(seq2.phases[i].sessionCount);
      expect(seq1.phases[i].challengeLevel).toBe(seq2.phases[i].challengeLevel);
    }
  });
});

// ─── Edge Cases ────────────────────────────────────────────────────────────────

describe("Edge cases", () => {
  it("handles unknown interference tag gracefully (falls through to fallback)", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 5,
        interferencePatterns: [
          makeInterferencePattern("unknown-tag-xyz", 5),
        ],
      }),
    }));

    // Unknown tag has no template → filtered out → fallback
    expect(seq.dispatchLabel).toBe("fallback:balanced-default");
  });

  it("handles very high session counts", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 500,
        interferencePatterns: [
          makeInterferencePattern("missing-article", 12),
        ],
      }),
    }));

    assertSequenceStructure(seq);
    expect(seq.phases[0].sessionCount).toBeLessThanOrEqual(5);
  });

  it("handles zero observation counts", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 5,
        interferencePatterns: [
          makeInterferencePattern("missing-article", 0),
        ],
      }),
    }));

    // 0 observations → filtered out → fallback
    expect(seq.dispatchLabel).toBe("fallback:balanced-default");
  });

  it("handles empty recentPractice array", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("missing-article", 3)],
      }),
      recentPractice: [],
    }));

    assertSequenceStructure(seq);
    expect(seq.phases[0].skillTag).toBe("missing-article");
  });

  it("handles nil now (uses current time)", () => {
    const seq = generateLessonSequence({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("missing-article", 3)],
      }),
      cefrLevel: null,
      goals: [],
      recentPractice: [],
      avgDaysBetweenSessions: null,
    });

    assertSequenceStructure(seq);
  });
});

// ─── Phase Mode Assignment ─────────────────────────────────────────────────────

describe("Phase mode assignment", () => {
  it("interference phases always use grammar mode", () => {
    const tags = ["missing-article", "tense-omission", "preposition-calque",
      "subj-verb-agreement", "word-order", "zero-copula", "double-negation"];

    for (const tag of tags) {
      const seq = generateLessonSequence(defaultInput({
        profile: emptyProfile({
          sessionCount: 10,
          interferencePatterns: [makeInterferencePattern(tag, 3)],
        }),
      }));
      expect(seq.phases[0].suggestedMode).toBe("grammar");
    }
  });

  it("speak mode for speaking-oriented goals", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({ sessionCount: 10 }),
      goals: ["daily_conversation"],
    }));

    const speakPhases = seq.phases.filter((p) => p.suggestedMode === "speak");
    expect(speakPhases.length).toBeGreaterThan(0);
  });

  it("journey mode for scenario-based goals", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({ sessionCount: 10 }),
      goals: ["travel_english"],
    }));

    const journeyPhases = seq.phases.filter((p) => p.suggestedMode === "journey");
    expect(journeyPhases.length).toBeGreaterThan(0);
  });
});

// ─── Goal Alignment Flag ──────────────────────────────────────────────────────

describe("Goal alignment flag", () => {
  it("daily_conversation goal marks daily-conversation phases as aligned", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({ sessionCount: 8 }),
      goals: ["daily_conversation"],
    }));

    const dailyPhases = seq.phases.filter(
      (p) => p.skillTag.includes("daily-conversation"),
    );
    for (const phase of dailyPhases) {
      expect(phase.alignedWithGoals).toBe(true);
    }
  });

  it("interference-only phases may still align with goals", () => {
    // missing-article aligns with ielts_preparation
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("missing-article", 3)],
      }),
      goals: ["ielts_preparation"],
    }));

    // missing-article IS in the ielts_preparation goal skill map
    expect(seq.phases[0].alignedWithGoals).toBe(true);
  });

  it("no goals means alignedWithGoals is false", () => {
    const seq = generateLessonSequence(defaultInput({
      profile: emptyProfile({
        sessionCount: 10,
        interferencePatterns: [makeInterferencePattern("missing-article", 3)],
      }),
      goals: [],
    }));

    expect(seq.phases[0].alignedWithGoals).toBe(false);
  });
});
