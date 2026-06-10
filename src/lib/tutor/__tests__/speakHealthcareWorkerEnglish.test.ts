import { describe, expect, it } from "vitest";
import { SPEAK_TOPIC_LIBRARY } from "@/lib/tutor/speakTopicLibrary";
import { speakTopics } from "@/lib/tutor/speakTopics/healthcareWorkerEnglish";

describe("healthcare worker English speak topics", () => {
  it("ships D4 professional metadata and warm conversation direction", () => {
    const libraryIds = new Set(SPEAK_TOPIC_LIBRARY.map((topic) => topic.id));

    // 3 original D4 topics + 4 salvaged from stale MR !600 (canonical-file port).
    expect(speakTopics).toHaveLength(7);
    for (const topic of speakTopics) {
      expect(libraryIds.has(topic.id), topic.id).toBe(true);
      expect(topic.scenarioDescription.trim().length).toBeGreaterThan(40);
      expect(topic.aiRoleDefinition.trim().length).toBeGreaterThan(40);
      expect(topic.conversationDirections.length).toBeGreaterThanOrEqual(5);
      expect(topic.conversationDirections.length).toBeLessThanOrEqual(8);
      expect(topic.warmthPatterns.length).toBeGreaterThanOrEqual(3);
      expect(topic.l1InterferenceNotes?.length).toBeGreaterThanOrEqual(2);
      expect(topic.followUps.length).toBeGreaterThanOrEqual(5);
    }
  });
});
