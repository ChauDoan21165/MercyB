import { describe, expect, it } from "vitest";
import { SPEAK_TOPIC_LIBRARY } from "@/lib/tutor/speakTopicLibrary";
import { speakTopics } from "@/lib/tutor/speakTopics/autoCarRepairEnglish";

const VIETNAMESE_DIACRITIC_PATTERN = /[À-ỹ]/u;

describe("Auto / car-repair customer speak topics", () => {
  it("ships the authored set and auto-registers in the speak topic library", () => {
    const libraryIds = new Set(SPEAK_TOPIC_LIBRARY.map((topic) => topic.id));

    // 5 car-owner ↔ mechanic topics. Keep in sync if topics are added.
    expect(speakTopics).toHaveLength(5);
    for (const topic of speakTopics) {
      expect(libraryIds.has(topic.id), topic.id).toBe(true);
      expect(topic.category).toBe("auto-car-customer");
    }
  });

  it("has well-formed labels, seeds, detection, follow-ups, and L1 notes per topic", () => {
    for (const topic of speakTopics) {
      expect(topic.labelEn.trim().length, `${topic.id} labelEn`).toBeGreaterThan(0);
      expect(topic.labelVi, `${topic.id} labelVi diacritics`).toMatch(VIETNAMESE_DIACRITIC_PATTERN);
      expect(topic.scenarioDescription.trim().length, `${topic.id} scenario`).toBeGreaterThan(40);
      expect(topic.aiRoleDefinition.trim().length, `${topic.id} aiRole`).toBeGreaterThan(40);
      expect(topic.conversationDirections.length, `${topic.id} directions`).toBeGreaterThanOrEqual(5);
      expect(topic.warmthPatterns.length, `${topic.id} warmth`).toBeGreaterThanOrEqual(3);

      expect(topic.seedInputs.length, `${topic.id} seedInputs`).toBeGreaterThanOrEqual(1);
      expect(topic.seedInputs.every((s) => s.trim().length > 0), `${topic.id} seed non-empty`).toBe(true);
      expect(topic.detectionPatterns.length, `${topic.id} detectionPatterns`).toBeGreaterThanOrEqual(1);

      expect(topic.followUps.length, `${topic.id} followUps`).toBeGreaterThanOrEqual(4);
      const followUpIds = topic.followUps.map((f) => f.id);
      expect(new Set(followUpIds).size, `${topic.id} unique followUp ids`).toBe(followUpIds.length);
      for (const followUp of topic.followUps) {
        expect(followUp.question.trim().length, `${topic.id} ${followUp.id} question`).toBeGreaterThan(0);
      }

      const notes = topic.l1InterferenceNotes ?? [];
      expect(notes.length, `${topic.id} l1 notes`).toBeGreaterThanOrEqual(2);
      const noteIds = notes.map((n) => n.id);
      expect(new Set(noteIds).size, `${topic.id} unique note ids`).toBe(noteIds.length);
      for (const note of notes) {
        expect(note.label.trim().length, `${topic.id} ${note.id} label`).toBeGreaterThan(0);
        expect(note.note.trim().length, `${topic.id} ${note.id} body`).toBeGreaterThan(20);
        // Dispatch bar: VN diacritics present in the L1 interference notes.
        expect(note.note, `${topic.id} ${note.id} VN diacritics`).toMatch(VIETNAMESE_DIACRITIC_PATTERN);
      }

      // Dispatch bar: note-ids and followUp-ids must be disjoint within a topic.
      const noteIdSet = new Set<string>(noteIds);
      const overlap = (followUpIds as readonly string[]).filter((id) => noteIdSet.has(id));
      expect(overlap, `${topic.id} note∩followUp ids must be disjoint`).toEqual([]);
    }
  });

  it("keeps topic ids unique within the theme", () => {
    const ids = speakTopics.map((topic) => topic.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
