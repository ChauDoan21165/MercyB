import { describe, expect, it } from "vitest";
import { speakTopics } from "../speakTopics/insuranceCustomerEnglish";

describe("speakInsuranceCustomerEnglish", () => {
  it("exports exactly 6 topics (auto-registers via glob)", () => {
    expect(speakTopics).toHaveLength(6);
  });

  it("every topic is well-formed with VN diacritics and disjoint note/followUp ids", () => {
    for (const topic of speakTopics) {
      expect(topic.id.startsWith("topic-insurance-")).toBe(true);
      // Vietnamese diacritics required in labelVi (Latin Extended + Latin Extended Additional)
      expect(topic.labelVi).toMatch(/[À-ɏḀ-ỿ]/);
      // At least 2 L1 notes
      const notes = topic.l1InterferenceNotes ?? [];
      expect(notes.length).toBeGreaterThanOrEqual(2);
      // At least 5 followUps
      expect(topic.followUps.length).toBeGreaterThanOrEqual(5);
      // note-ids ∩ followUp-ids = ∅ per topic
      const noteIds = new Set<string>(notes.map((n) => n.id));
      const followUpIds = (topic.followUps as readonly { id: string }[]).map((f) => f.id);
      for (const fid of followUpIds) {
        expect(noteIds.has(fid)).toBe(false);
      }
    }
  });

  it("all topic ids are globally unique", () => {
    const ids = speakTopics.map((t) => t.id);
    const unique = new Set<string>(ids);
    expect(unique.size).toBe(ids.length);
  });
});
