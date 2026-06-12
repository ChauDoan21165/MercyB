import { describe, expect, it } from "vitest";
import { SPEAK_TOPIC_LIBRARY } from "@/lib/tutor/speakTopicLibrary";
import { gymFitnessSpeakTopics } from "@/lib/tutor/speakTopics/gymFitnessCustomerEnglish";

// Covers the D4-deepened gym-fitness theme (6 topics).

const VI_DIACRITICS = /[À-ỹ]/u;

function assertD4Topic(topic: {
  id: string;
  labelVi: string;
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
  followUps: readonly { id: string; question: string }[];
  l1InterferenceNotes?: readonly { id: string; label: string; note: string }[];
}) {
  expect(topic.scenarioDescription.trim().length, `${topic.id} scenarioDescription`).toBeGreaterThan(40);
  expect(topic.aiRoleDefinition.trim().length, `${topic.id} aiRoleDefinition`).toBeGreaterThan(40);
  expect(topic.conversationDirections.length, `${topic.id} conversationDirections min`).toBeGreaterThanOrEqual(5);
  expect(topic.conversationDirections.length, `${topic.id} conversationDirections max`).toBeLessThanOrEqual(8);
  expect(topic.warmthPatterns.length, `${topic.id} warmthPatterns`).toBeGreaterThanOrEqual(3);
  expect(topic.followUps.length, `${topic.id} followUps`).toBeGreaterThanOrEqual(5);
  expect(topic.labelVi, `${topic.id} labelVi diacritics`).toMatch(VI_DIACRITICS);

  const notes = topic.l1InterferenceNotes ?? [];
  expect(notes.length, `${topic.id} l1 notes`).toBeGreaterThanOrEqual(2);

  const noteIdSet = new Set(notes.map((n) => n.id));
  const fuIdSet = new Set(topic.followUps.map((f) => f.id));
  for (const nId of noteIdSet) {
    expect(fuIdSet.has(nId), `${topic.id}: note id '${nId}' must not appear in followUp ids`).toBe(false);
  }

  const anyViNote = notes.some((n) => VI_DIACRITICS.test(n.note));
  expect(anyViNote, `${topic.id}: at least one l1 note must have Vietnamese diacritics`).toBe(true);
}

describe("gym-fitness speak topics — D4 metadata", () => {
  const libraryIds = new Set(SPEAK_TOPIC_LIBRARY.map((t) => t.id));

  it("ships 6 topics and auto-registers all in the library", () => {
    expect(gymFitnessSpeakTopics).toHaveLength(6);
    for (const topic of gymFitnessSpeakTopics) {
      expect(libraryIds.has(topic.id), `${topic.id} not in library`).toBe(true);
      expect(topic.category).toBe("gym-fitness");
    }
  });

  it("each topic has full D4 metadata, diacritics, and disjoint note/followUp ids", () => {
    for (const topic of gymFitnessSpeakTopics) {
      assertD4Topic(topic);
    }
  });

  it("topic ids are unique within the theme", () => {
    const ids = gymFitnessSpeakTopics.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
