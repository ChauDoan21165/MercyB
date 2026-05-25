import { beforeEach, describe, expect, it } from "vitest";
import {
  getLocalLearningEventProgressSummary,
  summarizeLearningEvents,
} from "@/lib/tutor/learningEventSummary";
import {
  clearLearningEvents,
  recordLearningEvent,
} from "@/lib/tutor/learningEvents";
import type { LearningEvent } from "@/lib/tutor/learningEvents";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const NOW = new Date(2026, 4, 24, 20, 30).getTime();
const TODAY = new Date(2026, 4, 24, 9, 0).getTime();
const YESTERDAY = TODAY - DAY_MS;

function event(overrides: Partial<LearningEvent>): LearningEvent {
  return {
    eventType: "lesson_started",
    product: "ai_tutor",
    targetLanguage: "en",
    timestamp: TODAY,
    sessionId: "local-session",
    ...overrides,
  };
}

describe("learningEventSummary", () => {
  beforeEach(() => {
    clearLearningEvents();
    window.localStorage.clear();
  });

  it("returns empty local progress signals for empty history", () => {
    expect(summarizeLearningEvents([], NOW)).toEqual({
      lessonsStartedToday: 0,
      lessonsCompletedToday: 0,
      lessonResumesToday: 0,
      lessonResumedToday: false,
      retryCountToday: 0,
      modeUsageCountsToday: {
        journey: 0,
        grammar: 0,
        speak: 0,
        logic: 0,
      },
      logicInsightViewsToday: 0,
      logicInsightViewedToday: false,
      nextFocusViewsToday: 0,
      nextFocusViewedToday: false,
      placementCtaClicksToday: 0,
      placementCtaClickedToday: false,
      kidsPictureSelectionsToday: 0,
      kidsSpeakClicksToday: 0,
      lastSafeActivityAt: null,
    });
  });

  it("summarizes today-only Study OS momentum from allowed event types", () => {
    const summary = summarizeLearningEvents([
      event({ eventType: "lesson_started", mode: "grammar", timestamp: TODAY }),
      event({ eventType: "lesson_completed", mode: "grammar", timestamp: TODAY + HOUR_MS }),
      event({ eventType: "lesson_resumed", mode: "journey", timestamp: TODAY + 2 * HOUR_MS }),
      event({ eventType: "mistake_retried", mode: "grammar", count: 3, timestamp: TODAY + 3 * HOUR_MS }),
      event({ eventType: "logic_insight_viewed", mode: "logic", timestamp: TODAY + 4 * HOUR_MS }),
      event({ eventType: "next_focus_viewed", mode: "logic", timestamp: TODAY + 5 * HOUR_MS }),
      event({ eventType: "placement_cta_clicked", timestamp: TODAY + 6 * HOUR_MS }),
      event({ eventType: "kids_picture_selected", product: "mercy_kids", timestamp: TODAY + 7 * HOUR_MS }),
      event({ eventType: "kids_speak_clicked", product: "mercy_kids", timestamp: TODAY + 8 * HOUR_MS }),
    ], NOW);

    expect(summary).toMatchObject({
      lessonsStartedToday: 1,
      lessonsCompletedToday: 1,
      lessonResumesToday: 1,
      lessonResumedToday: true,
      retryCountToday: 3,
      logicInsightViewsToday: 1,
      logicInsightViewedToday: true,
      nextFocusViewsToday: 1,
      nextFocusViewedToday: true,
      placementCtaClicksToday: 1,
      placementCtaClickedToday: true,
      kidsPictureSelectionsToday: 1,
      kidsSpeakClicksToday: 1,
      lastSafeActivityAt: TODAY + 8 * HOUR_MS,
    });
    expect(summary.modeUsageCountsToday).toEqual({
      journey: 1,
      grammar: 3,
      speak: 0,
      logic: 2,
    });
  });

  it("counts lesson resume and completion events by occurrence, not progress metadata", () => {
    const summary = summarizeLearningEvents([
      event({
        eventType: "lesson_resumed",
        mode: "grammar",
        safeTopicTag: "yesterday-present",
        count: 2,
        value: 1,
        timestamp: TODAY,
      }),
      event({
        eventType: "lesson_resumed",
        mode: "grammar",
        safeTopicTag: "past-tense",
        count: 4,
        value: 2,
        timestamp: TODAY + HOUR_MS,
      }),
      event({
        eventType: "lesson_completed",
        mode: "grammar",
        safeTopicTag: "past-tense",
        count: 3,
        value: 2,
        timestamp: TODAY + 2 * HOUR_MS,
      }),
      event({
        eventType: "lesson_completed",
        mode: "logic",
        safeTopicTag: "vietlish-logic",
        count: 5,
        value: 3,
        timestamp: TODAY + 3 * HOUR_MS,
      }),
    ], NOW);

    expect(summary.lessonResumesToday).toBe(2);
    expect(summary.lessonResumedToday).toBe(true);
    expect(summary.lessonsCompletedToday).toBe(2);
    expect(summary.modeUsageCountsToday).toEqual({
      journey: 0,
      grammar: 3,
      speak: 0,
      logic: 1,
    });
  });

  it("does not let progress-style count metadata inflate lifecycle counts", () => {
    const summary = summarizeLearningEvents([
      event({
        eventType: "lesson_started",
        mode: "grammar",
        safeTopicTag: "past-tense",
        count: 7,
        value: 2,
        timestamp: TODAY,
      }),
      event({
        eventType: "lesson_resumed",
        mode: "grammar",
        safeTopicTag: "past-tense",
        count: 8,
        value: 3,
        timestamp: TODAY + HOUR_MS,
      }),
      event({
        eventType: "lesson_completed",
        mode: "grammar",
        safeTopicTag: "past-tense",
        count: 9,
        value: 4,
        timestamp: TODAY + 2 * HOUR_MS,
      }),
      event({
        eventType: "mistake_retried",
        mode: "grammar",
        safeTopicTag: "past-tense",
        count: 3,
        timestamp: TODAY + 3 * HOUR_MS,
      }),
    ], NOW);

    expect(summary.lessonsStartedToday).toBe(1);
    expect(summary.lessonResumesToday).toBe(1);
    expect(summary.lessonsCompletedToday).toBe(1);
    expect(summary.retryCountToday).toBe(3);
    expect(summary.modeUsageCountsToday.grammar).toBe(4);
  });

  it("ignores older events for today counts but keeps the last safe activity timestamp", () => {
    const summary = summarizeLearningEvents([
      event({ eventType: "lesson_started", timestamp: YESTERDAY }),
      event({ eventType: "mistake_retried", count: 4, timestamp: YESTERDAY + HOUR_MS }),
      event({ eventType: "kids_speak_clicked", product: "mercy_kids", timestamp: TODAY + HOUR_MS }),
    ], NOW);

    expect(summary.lessonsStartedToday).toBe(0);
    expect(summary.retryCountToday).toBe(0);
    expect(summary.kidsSpeakClicksToday).toBe(1);
    expect(summary.lastSafeActivityAt).toBe(TODAY + HOUR_MS);
  });

  it("ignores unknown, invalid, and future events", () => {
    const summary = summarizeLearningEvents([
      event({ eventType: "lesson_started", timestamp: TODAY }),
      { eventType: "raw_transcript_saved", product: "ai_tutor", timestamp: TODAY + HOUR_MS },
      { eventType: "lesson_completed", product: "unknown", timestamp: TODAY + HOUR_MS },
      { eventType: "mode_selected", product: "ai_tutor", mode: "advanced", timestamp: TODAY + HOUR_MS },
      event({ eventType: "lesson_completed", timestamp: NOW + HOUR_MS }),
      event({ eventType: "logic_insight_viewed", timestamp: -1 }),
      null,
    ], NOW);

    expect(summary.lessonsStartedToday).toBe(1);
    expect(summary.lessonsCompletedToday).toBe(0);
    expect(summary.modeUsageCountsToday).toEqual({
      journey: 0,
      grammar: 0,
      speak: 0,
      logic: 0,
    });
    expect(summary.lastSafeActivityAt).toBe(TODAY + HOUR_MS);
  });

  it("does not copy unsafe event fields into derived summaries", () => {
    const summary = summarizeLearningEvents([
      {
        ...event({
          eventType: "mistake_retried",
          mode: "logic",
          safeTopicTag: "past-tense",
          timestamp: TODAY,
        }),
        learnerText: "I buy a hat yesterday.",
        correctedText: "I bought a hat yesterday.",
        transcript: "full transcript",
        audioBlob: "raw audio",
        email: "learner@example.com",
        jwt: "secret-token",
        supabaseUserId: "user-123",
        placementResultId: "placement-123",
        childName: "private child",
      },
    ], NOW);

    const serialized = JSON.stringify(summary);

    expect(summary.retryCountToday).toBe(1);
    expect(serialized).not.toContain("I buy a hat yesterday");
    expect(serialized).not.toContain("I bought a hat yesterday");
    expect(serialized).not.toContain("full transcript");
    expect(serialized).not.toContain("raw audio");
    expect(serialized).not.toContain("learner@example.com");
    expect(serialized).not.toContain("secret-token");
    expect(serialized).not.toContain("user-123");
    expect(serialized).not.toContain("placement-123");
    expect(serialized).not.toContain("private child");
    expect(serialized).not.toContain("past-tense");
    expect(serialized).not.toContain("learnerText");
    expect(serialized).not.toContain("correctedText");
    expect(serialized).not.toContain("transcript");
    expect(serialized).not.toContain("audioBlob");
    expect(serialized).not.toContain("safeTopicTag");
  });

  it("can summarize the existing local-only event store", () => {
    recordLearningEvent({
      eventType: "lesson_started",
      product: "ai_tutor",
      mode: "grammar",
      timestamp: TODAY,
    });
    recordLearningEvent({
      eventType: "lesson_completed",
      product: "ai_tutor",
      mode: "grammar",
      timestamp: TODAY + HOUR_MS,
    });

    expect(getLocalLearningEventProgressSummary(NOW)).toMatchObject({
      lessonsStartedToday: 1,
      lessonsCompletedToday: 1,
      modeUsageCountsToday: {
        journey: 0,
        grammar: 2,
        speak: 0,
        logic: 0,
      },
    });
  });
});
