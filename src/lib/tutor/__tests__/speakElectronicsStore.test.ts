import { describe, expect, it } from "vitest";
import { SPEAK_TOPIC_LIBRARY } from "@/lib/tutor/speakTopicLibrary";
import { speakTopics } from "@/lib/tutor/speakTopics/electronicsStore";

const VI_DIACRITICS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("Electronics & tech store customer speak topics", () => {
  it("ships exactly 5 topics with full D4 professional metadata", () => {
    const libraryIds = new Set(SPEAK_TOPIC_LIBRARY.map((t) => t.id));

    expect(speakTopics).toHaveLength(5);
    for (const topic of speakTopics) {
      expect(libraryIds.has(topic.id), `${topic.id} not in SPEAK_TOPIC_LIBRARY`).toBe(true);
      expect(topic.scenarioDescription.trim().length, `scenarioDescription too short: ${topic.id}`).toBeGreaterThan(40);
      expect(topic.aiRoleDefinition.trim().length, `aiRoleDefinition too short: ${topic.id}`).toBeGreaterThan(40);
      expect(topic.conversationDirections.length, `too few conversationDirections: ${topic.id}`).toBeGreaterThanOrEqual(5);
      expect(topic.conversationDirections.length, `too many conversationDirections: ${topic.id}`).toBeLessThanOrEqual(8);
      expect(topic.warmthPatterns.length, `too few warmthPatterns: ${topic.id}`).toBeGreaterThanOrEqual(3);
      expect(topic.l1InterferenceNotes?.length, `too few l1InterferenceNotes: ${topic.id}`).toBeGreaterThanOrEqual(2);
      expect(topic.followUps.length, `too few followUps: ${topic.id}`).toBeGreaterThanOrEqual(5);
      expect(topic.labelVi, `labelVi missing diacritics: ${topic.id}`).toMatch(VI_DIACRITICS);
    }
  });

  it("has unique topic IDs and disjoint note-id / followUp-id namespaces per topic", () => {
    const allTopicIds = speakTopics.map((t) => t.id);
    expect(new Set(allTopicIds).size).toBe(allTopicIds.length);

    for (const topic of speakTopics) {
      const noteIds = new Set((topic.l1InterferenceNotes ?? []).map((n) => n.id));
      const fuIds = new Set(topic.followUps.map((f) => f.id));
      const intersection = [...noteIds].filter((id) => fuIds.has(id));
      expect(intersection, `note/followUp id collision in ${topic.id}: ${intersection.join(", ")}`).toHaveLength(0);

      // note-ids should not carry -fu- suffix
      for (const id of noteIds) {
        expect(id, `note id should not contain '-fu-': ${id}`).not.toContain("-fu-");
      }
      // followUp-ids should carry -fu- suffix
      for (const id of fuIds) {
        expect(id, `followUp id should contain '-fu-': ${id}`).toContain("-fu-");
      }
    }
  });

  it("l1InterferenceNotes contain Vietnamese diacritics in all notes", () => {
    for (const topic of speakTopics) {
      for (const note of topic.l1InterferenceNotes ?? []) {
        expect(note.note, `note '${note.id}' has no Vietnamese diacritics`).toMatch(VI_DIACRITICS);
      }
    }
  });
});
