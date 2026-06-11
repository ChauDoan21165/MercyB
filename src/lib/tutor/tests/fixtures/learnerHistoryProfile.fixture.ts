// src/lib/tutor/tests/fixtures/learnerHistoryProfile.fixture.ts
//
// Eval-derived fixture — Step 14 scaffold.
//
// HOW THIS FIXTURE WAS DERIVED
// =============================
// Source: vietlishCorpus.ts sourcePattern entries + eval sessions eval-010
// through eval-042 (correction engine audit, 2026-05). Those sessions surfaced
// the following observed tag distribution across ~12 sessions of a B1-level
// Vietnamese learner working on job-interview and daily-life topics:
//
//   missing-article     × 5  (corpus entries: "khach phan nan ve toi",
//                             "quet sai gia", "mua ba cuon sach" — all missing
//                             article in the translated target)
//   tense-omission      × 3  (corpus entries: unmarked-past-tense,
//                             "nam ngoai toi hoc → no past inflection",
//                             "roi" completion without past marker)
//   subj-verb-agreement × 1  (single session sighting — below threshold)
//
// Topic mastery was read from the masteryGraph output for the same learner
// after the 12th session (topicCounts from learningMemory).

import type { LearnerHistoryProfile } from "@/lib/tutor/learnerHistoryProfile";

// Timestamp anchored relative to a Tuesday session block in the eval run.
// Using a fixed offset from unix epoch so the fixture is reproducible.
const EVAL_LAST_SESSION_AT = 1_748_000_000_000; // 2025-05-23 approx

export const FIXTURE_VN_LEARNER_B1_12_SESSIONS: LearnerHistoryProfile = {
  product: "ai-tutor",
  targetLanguage: "en",

  // Per-topic mastery after 12 sessions.
  // Past tense is low (35) — matches tense-omission interference.
  // Articles are lowest (20) — matches missing-article interference.
  // Daily life is the strongest topic (75) — learner's comfort zone.
  topicMastery: {
    "past-tense": 35,
    "missing-article": 20,
    "subject-verb-agreement": 48,
    "daily-life": 75,
    "job-interview": 62,
    "preposition": 45,
  },

  // Interference patterns derived from vietlishCorpus + eval-010..042.
  interferencePatterns: [
    {
      tag: "missing-article",
      observedCount: 5,
      lastSeenAt: EVAL_LAST_SESSION_AT,
    },
    {
      tag: "tense-omission",
      observedCount: 3,
      lastSeenAt: EVAL_LAST_SESSION_AT - 2 * 24 * 60 * 60 * 1000,
    },
    {
      tag: "subj-verb-agreement",
      observedCount: 1,
      lastSeenAt: EVAL_LAST_SESSION_AT - 5 * 24 * 60 * 60 * 1000,
    },
  ],

  sessionCount: 12,
  completedSessionCount: 10,
  preferredMode: "grammar",
  updatedAt: EVAL_LAST_SESSION_AT,
};

// A minimal "just started" fixture — no interference data, no mastery.
export const FIXTURE_VN_LEARNER_NEW: LearnerHistoryProfile = {
  product: "ai-tutor",
  targetLanguage: "en",
  topicMastery: {},
  interferencePatterns: [],
  sessionCount: 1,
  completedSessionCount: 0,
  preferredMode: null,
  updatedAt: EVAL_LAST_SESSION_AT,
};

// A fixture where tense-omission fires but missing-article is below threshold.
export const FIXTURE_VN_LEARNER_TENSE_ONLY: LearnerHistoryProfile = {
  product: "ai-tutor",
  targetLanguage: "en",
  topicMastery: {
    "past-tense": 30,
    "daily-life": 70,
  },
  interferencePatterns: [
    {
      tag: "tense-omission",
      observedCount: 4,
      lastSeenAt: EVAL_LAST_SESSION_AT,
    },
    {
      tag: "missing-article",
      observedCount: 1,
      lastSeenAt: EVAL_LAST_SESSION_AT,
    },
  ],
  sessionCount: 8,
  completedSessionCount: 7,
  preferredMode: "grammar",
  updatedAt: EVAL_LAST_SESSION_AT,
};
