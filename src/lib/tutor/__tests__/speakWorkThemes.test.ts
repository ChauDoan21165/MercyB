import { describe, expect, it } from "vitest";
import { SPEAK_TOPIC_LIBRARY } from "@/lib/tutor/speakTopicLibrary";
import { workplaceSpeakTopics } from "@/lib/tutor/speakTopics/workplace";
import { speakTopics as workJobTopics } from "@/lib/tutor/speakTopics/workJob";

// Covers both D4-deepened work themes: workplace (9 topics) + workJob (10 topics).

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
  expect(topic.conversationDirections.length, `${topic.id} conversationDirections`).toBeGreaterThanOrEqual(5);
  expect(topic.conversationDirections.length, `${topic.id} conversationDirections max`).toBeLessThanOrEqual(8);
  expect(topic.warmthPatterns.length, `${topic.id} warmthPatterns`).toBeGreaterThanOrEqual(3);
  expect(topic.followUps.length, `${topic.id} followUps`).toBeGreaterThanOrEqual(5);
  expect(topic.labelVi, `${topic.id} labelVi diacritics`).toMatch(VI_DIACRITICS);

  const notes = topic.l1InterferenceNotes ?? [];
  expect(notes.length, `${topic.id} l1 notes`).toBeGreaterThanOrEqual(2);

  // note-ids ∩ followUp-ids = ∅
  const noteIdSet = new Set(notes.map((n) => n.id));
  const fuIdSet = new Set(topic.followUps.map((f) => f.id));
  for (const nId of noteIdSet) {
    expect(fuIdSet.has(nId), `${topic.id}: note id '${nId}' must not appear in followUp ids`).toBe(false);
  }
  // Note body diacritics: at least one note per topic has Vietnamese
  const anyViNote = notes.some((n) => VI_DIACRITICS.test(n.note));
  expect(anyViNote, `${topic.id}: at least one l1 note must have Vietnamese diacritics`).toBe(true);
}

describe("workplace speak topics — D4 metadata", () => {
  const libraryIds = new Set(SPEAK_TOPIC_LIBRARY.map((t) => t.id));

  it("ships 9 topics and auto-registers all in the library", () => {
    expect(workplaceSpeakTopics).toHaveLength(9);
    for (const topic of workplaceSpeakTopics) {
      expect(libraryIds.has(topic.id), `${topic.id} not in library`).toBe(true);
      expect(topic.category).toBe("work");
    }
  });

  it("each topic has full D4 metadata, diacritics, and disjoint note/followUp ids", () => {
    for (const topic of workplaceSpeakTopics) {
      assertD4Topic(topic);
    }
  });

  it("topic ids are unique within the theme", () => {
    const ids = workplaceSpeakTopics.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("workJob speak topics — D4 metadata", () => {
  const libraryIds = new Set(SPEAK_TOPIC_LIBRARY.map((t) => t.id));

  it("ships 10 topics and auto-registers all in the library", () => {
    expect(workJobTopics).toHaveLength(10);
    for (const topic of workJobTopics) {
      expect(libraryIds.has(topic.id), `${topic.id} not in library`).toBe(true);
      expect(topic.category).toBe("work-job");
    }
  });

  it("each topic has full D4 metadata, diacritics, and disjoint note/followUp ids", () => {
    for (const topic of workJobTopics) {
      assertD4Topic(topic);
    }
  });

  it("topic ids are unique within the theme", () => {
    const ids = workJobTopics.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
