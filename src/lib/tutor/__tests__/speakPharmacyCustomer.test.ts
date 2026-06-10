import { describe, expect, it } from "vitest";
import { SPEAK_TOPIC_LIBRARY } from "@/lib/tutor/speakTopicLibrary";
import { speakTopics } from "@/lib/tutor/speakTopics/pharmacyCustomer";

const VIETNAMESE_DIACRITIC_PATTERN = /[À-ɏḀ-ỿ]/u;

describe("Pharmacy customer English speak topics", () => {
  it("ships the authored set and auto-registers in the speak topic library", () => {
    const libraryIds = new Set(SPEAK_TOPIC_LIBRARY.map((topic) => topic.id));

    expect(speakTopics).toHaveLength(5);
    for (const topic of speakTopics) {
      expect(libraryIds.has(topic.id), topic.id).toBe(true);
      expect(topic.category).toBe("pharmacy");
    }
  });

  it("has well-formed labels, seeds, detection, follow-ups, and L1 notes per topic", () => {
    for (const topic of speakTopics) {
      expect(topic.labelEn.trim().length, `${topic.id} labelEn`).toBeGreaterThan(0);
      expect(topic.labelVi, `${topic.id} labelVi diacritics`).toMatch(VIETNAMESE_DIACRITIC_PATTERN);
      expect(topic.seedInputs.length, `${topic.id} seedInputs`).toBeGreaterThanOrEqual(1);
      expect(
        topic.seedInputs.every((s) => s.trim().length > 0),
        `${topic.id} seed non-empty`,
      ).toBe(true);
      expect(topic.detectionPatterns.length, `${topic.id} detectionPatterns`).toBeGreaterThanOrEqual(1);

      expect(topic.followUps.length, `${topic.id} followUps`).toBeGreaterThanOrEqual(4);
      const followUpIds = topic.followUps.map((f) => f.id);
      expect(new Set(followUpIds).size, `${topic.id} unique followUp ids`).toBe(followUpIds.length);
      for (const followUp of topic.followUps) {
        expect(followUp.question.trim().length, `${topic.id} ${followUp.id} question`).toBeGreaterThan(0);
      }

      const notes = topic.l1InterferenceNotes ?? [];
      expect(notes.length, `${topic.id} l1 notes`).toBeGreaterThanOrEqual(3);
      const noteIds = notes.map((n) => n.id);
      expect(new Set(noteIds).size, `${topic.id} unique note ids`).toBe(noteIds.length);
      for (const note of notes) {
        expect(note.label.trim().length, `${topic.id} ${note.id} label`).toBeGreaterThan(0);
        expect(note.note.trim().length, `${topic.id} ${note.id} body`).toBeGreaterThan(20);
      }

      // note-ids and followUp-ids must be disjoint per topic
      const noteIdSet = new Set(noteIds);
      for (const fuId of followUpIds) {
        expect(
          noteIdSet.has(fuId),
          `${topic.id}: followUp id '${fuId}' collides with a note id`,
        ).toBe(false);
      }
    }
  });

  it("preserves Vietnamese diacritics in learner-facing labels", () => {
    for (const topic of speakTopics) {
      expect(topic.labelVi, `${topic.id} labelVi`).toMatch(VIETNAMESE_DIACRITIC_PATTERN);
    }
  });

  it("has conversation metadata and warmth patterns per topic", () => {
    for (const topic of speakTopics) {
      expect(topic.scenarioDescription.trim().length, `${topic.id} scenarioDescription`).toBeGreaterThan(40);
      expect(topic.aiRoleDefinition.trim().length, `${topic.id} aiRoleDefinition`).toBeGreaterThan(40);
      expect(topic.conversationDirections.length, `${topic.id} conversationDirections`).toBeGreaterThanOrEqual(5);
      expect(topic.conversationDirections.length, `${topic.id} conversationDirections`).toBeLessThanOrEqual(8);
      expect(topic.warmthPatterns.length, `${topic.id} warmthPatterns`).toBeGreaterThanOrEqual(3);
    }
  });
});
