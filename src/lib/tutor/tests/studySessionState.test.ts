import { beforeEach, describe, expect, it } from "vitest";
import {
  clearStudySessionState,
  createStudySessionState,
  getStudySessionStorageKey,
  loadStudySessionState,
  recordStudyPromptCompleted,
  recordStudyRetry,
  sanitizeStudyTopicTag,
  startStudySession,
} from "@/lib/tutor/studySessionState";

describe("studySessionState", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("creates safe local-only session state for Today Lesson", () => {
    expect(createStudySessionState({
      product: "ai-tutor",
      targetLanguage: "EN",
      safeTopicTag: "Past Tense",
      suggestedNextFocus: "Past Tense",
      now: 1234,
    })).toEqual({
      product: "ai-tutor",
      targetLanguage: "en",
      currentStep: 1,
      retryCount: 0,
      completedPromptsCount: 0,
      lastSafeTopicTag: "past-tense",
      suggestedNextFocus: "past-tense",
      updatedAt: 1234,
    });
  });

  it("persists and loads state by product and target language", () => {
    const state = startStudySession({
      product: "ai-tutor",
      targetLanguage: "fr",
      safeTopicTag: "gender agreement",
      suggestedNextFocus: "articles",
      now: 100,
    });

    expect(window.localStorage.getItem(getStudySessionStorageKey("ai-tutor", "fr"))).toContain("gender-agreement");
    expect(loadStudySessionState("ai-tutor", "fr")).toEqual(state);
    expect(loadStudySessionState("ai-tutor", "en")).toBeNull();
  });

  it("tracks completed prompt count and retry count without storing learner text", () => {
    const started = startStudySession({
      product: "ai-tutor",
      targetLanguage: "en",
      safeTopicTag: "past tense",
      suggestedNextFocus: "past tense",
      now: 100,
    });
    const afterPrompt = recordStudyPromptCompleted(started, {
      safeTopicTag: "yesterday-present learner@example.com",
      suggestedNextFocus: "past tense",
      now: 200,
    });
    const afterRetry = recordStudyRetry(afterPrompt, {
      safeTopicTag: "past tense",
      suggestedNextFocus: "past tense",
      now: 300,
    });

    expect(afterPrompt).toMatchObject({
      currentStep: 2,
      completedPromptsCount: 1,
      retryCount: 0,
      lastSafeTopicTag: "yesterday-present",
    });
    expect(afterRetry).toMatchObject({
      currentStep: 3,
      completedPromptsCount: 1,
      retryCount: 1,
      updatedAt: 300,
    });

    const serialized = window.localStorage.getItem(getStudySessionStorageKey("ai-tutor", "en")) ?? "";
    expect(serialized).not.toContain("learner@example.com");
    expect(serialized).not.toContain("raw");
    expect(serialized).not.toContain("audio");
    expect(serialized).not.toContain("transcript");
  });

  it("sanitizes contact details, ids, punctuation, and long values", () => {
    const safe = sanitizeStudyTopicTag(
      "Past tense user@example.com 550e8400-e29b-41d4-a716-446655440000 123456789 private ticket yesterday",
    );

    expect(safe).not.toContain("user@example.com");
    expect(safe).not.toContain("550e8400");
    expect(safe).not.toContain("123456789");
    expect(safe.length).toBeLessThanOrEqual(48);
  });

  it("clears only the matching local session key", () => {
    startStudySession({ product: "ai-tutor", targetLanguage: "en", safeTopicTag: "past tense" });
    startStudySession({ product: "ai-tutor", targetLanguage: "fr", safeTopicTag: "articles" });

    clearStudySessionState("ai-tutor", "en");

    expect(loadStudySessionState("ai-tutor", "en")).toBeNull();
    expect(loadStudySessionState("ai-tutor", "fr")?.lastSafeTopicTag).toBe("articles");
  });
});
