import { describe, expect, it } from "vitest";
import { SPEAK_TOPIC_LIBRARY } from "@/lib/tutor/speakTopicLibrary";
import { speakTopics as documentSpeakTopics } from "@/lib/tutor/speakTopics/documents";
import { speakTopics as serviceSpeakTopics } from "@/lib/tutor/speakTopics/services";

const VIETNAMESE_DIACRITIC_PATTERN = /[À-ỹ]/u;

describe("reviewed orphan speak topics", () => {
  it("auto-registers the normalized documents and services modules", () => {
    const libraryIds = new Set(SPEAK_TOPIC_LIBRARY.map((topic) => topic.id));

    expect(documentSpeakTopics).toHaveLength(15);
    expect(serviceSpeakTopics).toHaveLength(15);

    for (const topic of [...documentSpeakTopics, ...serviceSpeakTopics]) {
      expect(libraryIds.has(topic.id), topic.id).toBe(true);
    }

    for (const topic of documentSpeakTopics) {
      expect(topic.category, topic.id).toBe("documents");
    }

    for (const topic of serviceSpeakTopics) {
      expect(topic.category, topic.id).toBe("service");
    }
  });

  it("preserves Vietnamese diacritics in learner-facing labels", () => {
    for (const topic of [...documentSpeakTopics, ...serviceSpeakTopics]) {
      expect(topic.labelVi, topic.id).toMatch(VIETNAMESE_DIACRITIC_PATTERN);
    }
  });
});
