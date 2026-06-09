import { describe, expect, it } from "vitest";
import { SPEAK_TOPIC_LIBRARY } from "@/lib/tutor/speakTopicLibrary";
import { speakTopics as emergencySpeakTopics } from "@/lib/tutor/speakTopics/emergencies";
import { speakTopics as errandsSpeakTopics } from "@/lib/tutor/speakTopics/errands";
import { speakTopics as governmentSpeakTopics } from "@/lib/tutor/speakTopics/government";
import { speakTopics as socialSpeakTopics } from "@/lib/tutor/speakTopics/social";

const finalThemeGroups = [
  { category: "government", topics: governmentSpeakTopics },
  { category: "emergencies", topics: emergencySpeakTopics },
  { category: "errands", topics: errandsSpeakTopics },
  { category: "social", topics: socialSpeakTopics },
] as const;

const VIETNAMESE_DIACRITIC_PATTERN = /[À-ỹ]/u;

const l1NotesWithVietnameseExamples = new Set([
  "emergency-hurt-passive",
  "emergency-medical-breathing",
  "errands-pick-up",
  "errands-pharmacy-ready",
  "government-counter-ask-for",
  "government-benefits-status",
  "social-invite-free",
]);

describe("final speak topic themes", () => {
  it("registers the final four content themes in the speak topic library", () => {
    const libraryIds = new Set(SPEAK_TOPIC_LIBRARY.map((topic) => topic.id));

    for (const { category, topics } of finalThemeGroups) {
      expect(topics, category).toHaveLength(3);

      for (const topic of topics) {
        expect(libraryIds.has(topic.id), topic.id).toBe(true);
        expect(topic.category).toBe(category);
      }
    }
  });

  it("ships conversation metadata, follow-up depth, and L1 notes for each final theme topic", () => {
    for (const { topics } of finalThemeGroups) {
      for (const topic of topics) {
        expect(topic.scenarioDescription.trim().length, topic.id).toBeGreaterThan(40);
        expect(topic.aiRoleDefinition.trim().length, topic.id).toBeGreaterThan(40);
        expect(topic.conversationDirections.length, topic.id).toBeGreaterThanOrEqual(5);
        expect(topic.conversationDirections.length, topic.id).toBeLessThanOrEqual(8);
        expect(topic.warmthPatterns.length, topic.id).toBeGreaterThanOrEqual(3);
        expect(topic.l1InterferenceNotes?.length, topic.id).toBeGreaterThanOrEqual(3);
        expect(topic.followUps.length, topic.id).toBeGreaterThanOrEqual(6);
      }
    }
  });

  it("preserves Vietnamese diacritics in learner-facing labels and L1 note examples", () => {
    for (const { topics } of finalThemeGroups) {
      for (const topic of topics) {
        expect(topic.labelVi, `${topic.id} labelVi`).toMatch(VIETNAMESE_DIACRITIC_PATTERN);

        for (const note of topic.l1InterferenceNotes ?? []) {
          if (l1NotesWithVietnameseExamples.has(note.id)) {
            expect(note.note, `${topic.id} ${note.id}`).toMatch(VIETNAMESE_DIACRITIC_PATTERN);
          }
        }
      }
    }
  });
});
