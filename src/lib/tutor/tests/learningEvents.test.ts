import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ackEvents,
  clearLearningEvents,
  getLearningEventSummary,
  getLearningEvents,
  getLearningEventsSessionKey,
  getLearningEventsStorageKey,
  peekPendingEvents,
  pruneLearningEvents,
  recordLearningEvent,
  type LearningEvent,
} from "@/lib/tutor/learningEvents";

describe("learningEvents", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("records approved safe learning events locally", () => {
    const now = Date.now();
    const event = recordLearningEvent({
      eventType: "lesson_started",
      product: "ai_tutor",
      targetLanguage: "FR",
      mode: "grammar",
      safeTopicTag: "Past tense",
      timestamp: now,
      sessionId: "local-session-1",
      count: 1,
    });

    expect(event).toEqual({
      id: expect.any(String),
      eventType: "lesson_started",
      product: "ai_tutor",
      targetLanguage: "fr",
      mode: "grammar",
      safeTopicTag: "past-tense",
      timestamp: now,
      sessionId: "local-session-1",
      count: 1,
    });
    expect(event?.id).toBeTruthy();
    expect(getLearningEvents()).toEqual([event]);
  });

  it("keeps only allowlisted fields and strips raw learner data", () => {
    recordLearningEvent({
      eventType: "mistake_retried",
      product: "ai_tutor",
      targetLanguage: "en",
      mode: "logic",
      safeTopicTag: "Yesterday I buy a hat learner@example.com 550e8400-e29b-41d4-a716-446655440000",
      timestamp: Date.now(),
      sessionId: "safe-session",
      count: 2,
      learnerText: "I buy a hat yesterday.",
      correctedText: "I bought a hat yesterday.",
      transcript: "full transcript",
      audioBlob: "raw audio",
      jwt: "secret-token",
      supabaseUserId: "user-123",
      placementResultId: "placement-123",
    } as Parameters<typeof recordLearningEvent>[0] & Record<string, unknown>);

    const serialized = window.localStorage.getItem(getLearningEventsStorageKey()) ?? "";

    expect(serialized).toContain("mistake_retried");
    expect(serialized).not.toContain("Yesterday I buy a hat");
    expect(serialized).not.toContain("yesterday-i-buy-a-hat");
    expect(serialized).not.toContain("learner@example.com");
    expect(serialized).not.toContain("I bought a hat yesterday");
    expect(serialized).not.toContain("full transcript");
    expect(serialized).not.toContain("raw audio");
    expect(serialized).not.toContain("secret-token");
    expect(serialized).not.toContain("user-123");
    expect(serialized).not.toContain("placement-123");
  });

  it("summarizes safe events for future Study OS decisions", () => {
    const now = Date.now();

    recordLearningEvent({ eventType: "lesson_started", product: "ai_tutor", mode: "grammar", timestamp: now + 100 });
    recordLearningEvent({ eventType: "lesson_resumed", product: "ai_tutor", mode: "grammar", timestamp: now + 200 });
    recordLearningEvent({ eventType: "lesson_completed", product: "ai_tutor", mode: "logic", timestamp: now + 300 });
    recordLearningEvent({ eventType: "mistake_retried", product: "ai_tutor", mode: "grammar", count: 3, timestamp: now + 400 });
    recordLearningEvent({ eventType: "logic_insight_viewed", product: "ai_tutor", mode: "logic", timestamp: now + 500 });

    expect(getLearningEventSummary()).toEqual({
      lessonsStarted: 2,
      lessonsCompleted: 1,
      retryCount: 3,
      logicInsightViews: 1,
      mostUsedMode: "grammar",
      lastActiveAt: now + 500,
      completionRate: 0.5,
    });
  });

  it("filters by safe event fields", () => {
    const now = Date.now();

    recordLearningEvent({ eventType: "mode_selected", product: "ai_tutor", targetLanguage: "fr", mode: "journey", timestamp: now + 100 });
    recordLearningEvent({ eventType: "kids_picture_selected", product: "mercy_kids", targetLanguage: "vi", timestamp: now + 200 });

    expect(getLearningEvents({ product: "ai_tutor" })).toHaveLength(1);
    expect(getLearningEvents({ mode: "journey" })).toHaveLength(1);
    expect(getLearningEvents({ targetLanguage: "vi" })[0]?.eventType).toBe("kids_picture_selected");
    expect(getLearningEvents({ since: now + 150 })).toHaveLength(1);
  });

  it("prunes old events and keeps the newest bounded set", () => {
    const now = Date.now();

    recordLearningEvent({ eventType: "lesson_started", product: "ai_tutor", timestamp: now - 31 * 24 * 60 * 60 * 1000 });
    recordLearningEvent({ eventType: "lesson_completed", product: "ai_tutor", timestamp: now - 10 });
    recordLearningEvent({ eventType: "logic_insight_viewed", product: "ai_tutor", timestamp: now - 5 });

    const pruned = pruneLearningEvents({ maxEvents: 1, maxAgeDays: 30, now });

    expect(pruned).toHaveLength(1);
    expect(pruned[0]?.eventType).toBe("logic_insight_viewed");
    expect(getLearningEvents()).toEqual(pruned);
  });

  it("clears events without clearing the anonymous session key", () => {
    const first = recordLearningEvent({ eventType: "lesson_started", product: "ai_tutor" });
    const sessionKey = window.localStorage.getItem(getLearningEventsSessionKey());

    clearLearningEvents();

    expect(first?.sessionId).toBeTruthy();
    expect(getLearningEvents()).toEqual([]);
    expect(window.localStorage.getItem(getLearningEventsSessionKey())).toBe(sessionKey);
  });

  it("carries ruleOrDetectorId through when provided (no producer wired)", () => {
    const event = recordLearningEvent({
      eventType: "mistake_retried",
      product: "ai_tutor",
      ruleOrDetectorId: "l1-detector:past-tense",
    });
    expect(event?.ruleOrDetectorId).toBe("l1-detector:past-tense");
    expect(getLearningEvents()[0]?.ruleOrDetectorId).toBe("l1-detector:past-tense");
  });

  describe("drain API (peekPendingEvents / ackEvents)", () => {
    it("drains oldest-first and acks a round-trip, leaving the rest queued", () => {
      const now = Date.now();
      const a = recordLearningEvent({ eventType: "lesson_started", product: "ai_tutor", timestamp: now + 1 });
      const b = recordLearningEvent({ eventType: "lesson_completed", product: "ai_tutor", timestamp: now + 2 });
      const c = recordLearningEvent({ eventType: "logic_insight_viewed", product: "ai_tutor", timestamp: now + 3 });

      const peeked = peekPendingEvents(2);
      expect(peeked.map((e) => e.id)).toEqual([a?.id, b?.id]); // oldest first, limited
      expect(peeked.every((e) => typeof e.id === "string" && e.id.length > 0)).toBe(true);

      // Peek does not remove.
      expect(getLearningEvents()).toHaveLength(3);

      ackEvents([a!.id!, b!.id!]);
      const remaining = getLearningEvents();
      expect(remaining.map((e) => e.id)).toEqual([c?.id]);

      // Acking unknown ids is a no-op.
      ackEvents(["does-not-exist"]);
      expect(getLearningEvents()).toHaveLength(1);
    });

    it("back-fills stable ids for legacy id-less entries on first drain", () => {
      const now = Date.now();
      // Simulate a pre-upgrade queue written without ids.
      const legacy = [
        { eventType: "lesson_started", product: "ai_tutor", targetLanguage: "en", timestamp: now + 1, sessionId: "s" },
        { eventType: "lesson_completed", product: "ai_tutor", targetLanguage: "en", timestamp: now + 2, sessionId: "s" },
      ];
      window.localStorage.setItem(getLearningEventsStorageKey(), JSON.stringify(legacy));

      const peeked = peekPendingEvents();
      expect(peeked).toHaveLength(2);
      expect(peeked.every((e) => typeof e.id === "string" && e.id.length > 0)).toBe(true);

      // Ids are now persisted (stable across a second drain) so they are ackable.
      const secondPeek = peekPendingEvents();
      expect(secondPeek.map((e) => e.id)).toEqual(peeked.map((e) => e.id));

      ackEvents(peeked.map((e) => e.id!));
      expect(getLearningEvents()).toEqual([]);
    });

    it("leaves the queue untouched when the ack storage write fails", () => {
      const a = recordLearningEvent({ eventType: "lesson_started", product: "ai_tutor" });
      const b = recordLearningEvent({ eventType: "lesson_completed", product: "ai_tutor" });
      const before = window.localStorage.getItem(getLearningEventsStorageKey());

      const setItemSpy = vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
        throw new Error("quota exceeded");
      });
      try {
        // Must not throw, and must not partially remove.
        expect(() => ackEvents([a!.id!, b!.id!])).not.toThrow();
      } finally {
        setItemSpy.mockRestore();
      }

      const after = window.localStorage.getItem(getLearningEventsStorageKey());
      expect(after).toBe(before);
      const events: LearningEvent[] = getLearningEvents();
      expect(events.map((e) => e.id).sort()).toEqual([a?.id, b?.id].sort());
    });
  });
});
