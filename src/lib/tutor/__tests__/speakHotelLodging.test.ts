import { describe, expect, it } from "vitest";
import { speakTopics } from "../speakTopics/hotelLodging";

describe("speakHotelLodging", () => {
  it("exports exactly 6 topics (auto-registers via glob)", () => {
    expect(speakTopics).toHaveLength(6);
  });

  it("every topic is well-formed with VN diacritics and disjoint note/followUp ids", () => {
    for (const topic of speakTopics) {
      expect(topic.id.startsWith("topic-hotel-lodging-")).toBe(true);
      // Vietnamese diacritics required in labelVi
      expect(topic.labelVi).toMatch(/[àáâãèéêìíòóôõùúýăđơưÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂĐƠƯ]/);
      // At least 3 L1 notes with content
      const notes = topic.l1InterferenceNotes ?? [];
      expect(notes.length).toBeGreaterThanOrEqual(3);
      for (const note of notes) {
        expect(note.id.trim().length).toBeGreaterThan(0);
        expect(note.label.trim().length).toBeGreaterThan(0);
        expect(note.note.trim().length).toBeGreaterThan(20);
      }
      // At least 6 followUps, each with -fu suffix
      expect(topic.followUps.length).toBeGreaterThanOrEqual(6);
      for (const fu of topic.followUps) {
        expect(fu.id.endsWith("-fu"), `followUp id "${fu.id}" must end with -fu`).toBe(true);
      }
      // note-ids ∩ followUp-ids = ∅ per topic
      const noteIds = new Set<string>(notes.map((n) => n.id));
      for (const fu of topic.followUps) {
        expect(noteIds.has(fu.id), `id collision: "${fu.id}" is both a note and a followUp`).toBe(false);
      }
    }
  });

  it("all topic ids are globally unique within the module", () => {
    const ids = speakTopics.map((t) => t.id);
    const unique = new Set<string>(ids);
    expect(unique.size).toBe(ids.length);
  });
});
