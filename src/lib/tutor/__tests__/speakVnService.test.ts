import { describe, expect, it } from "vitest";
import { selectSpeakFollowUpByTopicId } from "@/lib/tutor/speakFollowups";
import { SPEAK_TOPIC_LIBRARY } from "@/lib/tutor/speakTopicLibrary";
import { speakTopics } from "@/lib/tutor/speakTopics/vnService";

describe("VN-specific speak topics", () => {
  it("auto-registers the VN-specific service topics", () => {
    const libraryIds = new Set(SPEAK_TOPIC_LIBRARY.map((topic) => topic.id));

    expect(speakTopics.map((topic) => topic.id)).toEqual([
      "topic-vn-pho-less-spicy",
      "topic-vn-nail-client-request",
      "topic-vn-landlord-zalo-leak",
      "topic-vn-remittance-bank-fee",
      "topic-vn-teacher-late-pickup",
      "topic-vn-shift-change-manager",
    ]);

    for (const topic of speakTopics) {
      expect(libraryIds.has(topic.id), topic.id).toBe(true);
      expect(topic.followUps.length).toBeGreaterThanOrEqual(5);
      expect(topic.labelVi).toMatch(/[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i);
    }
  });

  it("serves topic-aware follow-ups by explicit topic id", () => {
    for (const topic of speakTopics) {
      const selection = selectSpeakFollowUpByTopicId(topic.id, {
        turnsOnTopic: 0,
        learnerText: topic.seedInputs[0],
      });

      expect(selection.topicId).toBe(topic.id);
      expect(selection.isPivot).toBe(false);
      expect(selection.followUpId).toBe(topic.followUps[0].id);
    }
  });

  it("carries full D4 conversation metadata with disjoint note/followUp ids", () => {
    for (const topic of speakTopics) {
      expect(topic.scenarioDescription.trim().length, `${topic.id} scenarioDescription`).toBeGreaterThan(40);
      expect(topic.aiRoleDefinition.trim().length, `${topic.id} aiRoleDefinition`).toBeGreaterThan(40);
      expect(topic.conversationDirections.length, `${topic.id} conversationDirections`).toBeGreaterThanOrEqual(5);
      expect(topic.conversationDirections.length, `${topic.id} conversationDirections`).toBeLessThanOrEqual(8);
      expect(topic.warmthPatterns.length, `${topic.id} warmthPatterns`).toBeGreaterThanOrEqual(3);

      const noteIds: string[] = (topic.l1InterferenceNotes ?? []).map((n) => n.id);
      const followUpIds: string[] = topic.followUps.map((f) => f.id);
      expect(new Set(noteIds).size, `${topic.id} unique note ids`).toBe(noteIds.length);
      expect(new Set(followUpIds).size, `${topic.id} unique followUp ids`).toBe(followUpIds.length);
      expect(noteIds.filter((id) => followUpIds.includes(id)), `${topic.id} note/followUp overlap`).toEqual([]);
    }
  });
});
