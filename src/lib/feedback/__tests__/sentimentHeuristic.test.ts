import { describe, it, expect } from "vitest";
import { classifyFeedbackSentiment } from "../sentimentHeuristic";

describe("classifyFeedbackSentiment — sentiment buckets", () => {
  it("returns null sentiment for too-short input (< 4 chars)", () => {
    expect(classifyFeedbackSentiment("").sentiment).toBeNull();
    expect(classifyFeedbackSentiment("ok").sentiment).toBeNull();
    expect(classifyFeedbackSentiment("   ").sentiment).toBeNull();
  });

  it("classifies pure-positive English", () => {
    const r = classifyFeedbackSentiment("I love this app, amazing!");
    expect(r.sentiment).toBe("positive");
    expect(r.debug.positiveHits).toBeGreaterThan(0);
  });

  it("classifies pure-negative English", () => {
    const r = classifyFeedbackSentiment("This crashed and is so slow, useless");
    expect(r.sentiment).toBe("negative");
    expect(r.debug.negativeHits).toBeGreaterThan(0);
  });

  it("classifies mixed sentiment when both poles fire", () => {
    const r = classifyFeedbackSentiment("Love the lessons but the audio is broken");
    expect(r.sentiment).toBe("mixed");
    expect(r.debug.positiveHits).toBeGreaterThan(0);
    expect(r.debug.negativeHits).toBeGreaterThan(0);
  });

  it("classifies neutral when no sentiment words fire", () => {
    const r = classifyFeedbackSentiment("The login screen has three buttons");
    expect(r.sentiment).toBe("neutral");
  });

  it("classifies positive Vietnamese (ASCII-folded)", () => {
    const r = classifyFeedbackSentiment("App rất hay và dễ dùng, cảm ơn");
    expect(r.sentiment).toBe("positive");
  });

  it("classifies negative Vietnamese", () => {
    const r = classifyFeedbackSentiment("Bài học bị lỗi, chậm quá, không dùng được");
    expect(r.sentiment).toBe("negative");
  });
});

describe("classifyFeedbackSentiment — topic tags", () => {
  it("tags audio_quality on 'audio' or 'voice'", () => {
    expect(classifyFeedbackSentiment("the audio is robotic").tags).toContain("audio_quality");
    expect(classifyFeedbackSentiment("Mercy voice sounds weird").tags).toContain("audio_quality");
  });

  it("tags pricing on 'price' / 'expensive'", () => {
    expect(classifyFeedbackSentiment("the price is too high").tags).toContain("pricing");
    expect(classifyFeedbackSentiment("subscription is expensive").tags).toContain("pricing");
  });

  it("tags performance on 'slow' / 'crash'", () => {
    expect(classifyFeedbackSentiment("everything is slow").tags).toContain("performance");
    expect(classifyFeedbackSentiment("app crash on login").tags).toContain("performance");
  });

  it("tags bug on 'bug' / 'broken'", () => {
    expect(classifyFeedbackSentiment("found a bug in the lesson").tags).toContain("bug");
  });

  it("tags feature_request on common request phrases", () => {
    expect(classifyFeedbackSentiment("please add a dark mode").tags).toContain("feature_request");
    expect(classifyFeedbackSentiment("would be nice to have offline").tags).toContain("feature_request");
  });

  it("multiple tags fire for multi-topic feedback", () => {
    const r = classifyFeedbackSentiment("the audio is broken and pricing is expensive");
    expect(r.tags).toContain("audio_quality");
    expect(r.tags).toContain("pricing");
    expect(r.tags).toContain("bug");
  });

  it("no tags for off-topic feedback", () => {
    expect(classifyFeedbackSentiment("Hello there").tags).toEqual([]);
  });

  it("each tag fires at most once even with multiple triggers", () => {
    const r = classifyFeedbackSentiment("audio audio audio voice voice sound");
    const audioCount = r.tags.filter((t) => t === "audio_quality").length;
    expect(audioCount).toBe(1);
  });

  it("matches Vietnamese topic words too (ASCII-folded)", () => {
    const r = classifyFeedbackSentiment("giá quá đắt rồi");
    expect(r.tags).toContain("pricing");
  });
});

describe("classifyFeedbackSentiment — robustness", () => {
  it("never throws on null / undefined", () => {
    expect(() => classifyFeedbackSentiment(null)).not.toThrow();
    expect(() => classifyFeedbackSentiment(undefined)).not.toThrow();
    expect(classifyFeedbackSentiment(null).sentiment).toBeNull();
    expect(classifyFeedbackSentiment(null).tags).toEqual([]);
  });

  it("handles emoji + unicode safely", () => {
    const r = classifyFeedbackSentiment("Love it 💛 great work");
    expect(r.sentiment).toBe("positive");
  });

  it("trimmedLength reflects whitespace removal", () => {
    expect(classifyFeedbackSentiment("   hi   ").debug.trimmedLength).toBe(2);
  });
});
