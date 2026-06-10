import { describe, expect, it } from "vitest";
import { SPEAK_TOPIC_LIBRARY } from "@/lib/tutor/speakTopicLibrary";
import { speakTopics } from "@/lib/tutor/speakTopics/utilitiesSetup";

const VIETNAMESE_DIACRITIC_PATTERN = /[À-ỹ]/u;

describe("Utilities & Internet Setup speak topics", () => {
  it("ships the authored set and auto-registers in the speak topic library", () => {
    const libraryIds = new Set(SPEAK_TOPIC_LIBRARY.map((topic) => topic.id));

    // 8 move-in-essential utility-setup topics. Keep in sync if topics are added.
    expect(speakTopics).toHaveLength(8);
    for (const topic of speakTopics) {
      expect(libraryIds.has(topic.id), topic.id).toBe(true);
      expect(topic.category).toBe("utilities-setup");
    }
  });

  it("has well-formed labels, seeds, detection, follow-ups, and L1 notes per topic", () => {
    for (const topic of speakTopics) {
      expect(topic.labelEn.trim().length, `${topic.id} labelEn`).toBeGreaterThan(0);
      expect(topic.labelVi, `${topic.id} labelVi diacritics`).toMatch(VIETNAMESE_DIACRITIC_PATTERN);
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
      }

      // note ids and follow-up ids must be disjoint within a topic (CEO-2 id-hygiene).
      const overlappingIds = noteIds.filter((id) => followUpIds.includes(id));
      expect(overlappingIds, `${topic.id} note/followUp id overlap`).toEqual([]);
    }
  });

  it("keeps topic ids unique within the theme", () => {
    const ids = speakTopics.map((topic) => topic.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
