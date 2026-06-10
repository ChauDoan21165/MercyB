import { describe, expect, it } from "vitest";
import { SPEAK_TOPIC_LIBRARY } from "@/lib/tutor/speakTopicLibrary";
import { speakTopics } from "@/lib/tutor/speakTopics/introductions";

const VIETNAMESE_DIACRITIC_PATTERN = /[À-ỹ]/u;

describe("introductions speak topics — deepened to D4 metadata depth", () => {
  it("ships the authored set with rich conversation metadata", () => {
    const libraryIds = new Set(SPEAK_TOPIC_LIBRARY.map((topic) => topic.id));

    expect(speakTopics).toHaveLength(3);
    for (const topic of speakTopics) {
      expect(libraryIds.has(topic.id), topic.id).toBe(true);
      expect(topic.category).toBe("introductions");
      expect(topic.labelVi, `${topic.id} labelVi`).toMatch(VIETNAMESE_DIACRITIC_PATTERN);
      expect(topic.scenarioDescription.trim().length, `${topic.id} scenarioDescription`).toBeGreaterThan(40);
      expect(topic.aiRoleDefinition.trim().length, `${topic.id} aiRoleDefinition`).toBeGreaterThan(40);
      expect(topic.conversationDirections.length, `${topic.id} conversationDirections`).toBeGreaterThanOrEqual(5);
      expect(topic.conversationDirections.length, `${topic.id} conversationDirections`).toBeLessThanOrEqual(8);
      expect(topic.warmthPatterns.length, `${topic.id} warmthPatterns`).toBeGreaterThanOrEqual(3);
      expect((topic.l1InterferenceNotes ?? []).length, `${topic.id} l1 notes`).toBeGreaterThanOrEqual(2);
      expect(topic.followUps.length, `${topic.id} followUps`).toBeGreaterThanOrEqual(5);
    }
  });

  it("keeps note ids and followUp ids unique and disjoint within each topic", () => {
    for (const topic of speakTopics) {
      const noteIds: string[] = (topic.l1InterferenceNotes ?? []).map((n) => n.id);
      const followUpIds: string[] = topic.followUps.map((f) => f.id);
      expect(new Set(noteIds).size, `${topic.id} unique note ids`).toBe(noteIds.length);
      expect(new Set(followUpIds).size, `${topic.id} unique followUp ids`).toBe(followUpIds.length);
      const overlap = noteIds.filter((id) => followUpIds.includes(id));
      expect(overlap, `${topic.id} note/followUp id overlap`).toEqual([]);
    }
  });
});
