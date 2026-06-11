import { describe, expect, it } from "vitest";
import { SPEAK_TOPIC_LIBRARY } from "@/lib/tutor/speakTopicLibrary";
import { speakTopics } from "@/lib/tutor/speakTopics/eyeCareCustomerEnglish";

describe("eye-care customer English speak topics", () => {
  it("ships D4 professional metadata and warm conversation direction", () => {
    const libraryIds = new Set(SPEAK_TOPIC_LIBRARY.map((topic) => topic.id));

    expect(speakTopics).toHaveLength(5);
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

  it("keeps topic, note, and follow-up ids unique and note-ids disjoint from follow-up-ids", () => {
    const topicIds = speakTopics.map((t) => t.id);
    expect(new Set(topicIds).size).toBe(topicIds.length);

    for (const topic of speakTopics) {
      const noteIds = (topic.l1InterferenceNotes ?? []).map((n) => n.id);
      const followUpIds = topic.followUps.map((f) => f.id);
      expect(new Set(noteIds).size).toBe(noteIds.length);
      expect(new Set(followUpIds).size).toBe(followUpIds.length);
      // A9 rec / B3 guard: note-ids and follow-up-ids must not overlap.
      const overlap = noteIds.filter((id) => followUpIds.includes(id));
      expect(overlap, `note/followUp id overlap in ${topic.id}`).toEqual([]);
    }
  });
});
