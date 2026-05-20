import { describe, expect, it } from "vitest";
import {
  adjustDifficulty,
  nextPromptAfterAssessment,
  PROMPTS,
  selectNextModality,
  selectPrompt,
  updateStats,
} from "../modality.ts";
import { freshSession } from "./fixtures/mock-sessions.ts";
import { assessment } from "./fixtures/mock-grader-responses.ts";

describe("placement v3 modality sequencing", () => {
  it("starts with a writing prompt", () => {
    const prompt = selectPrompt({ modality: "writing", targetLevel: "A2", responses: [] });
    expect(prompt.modality).toBe("writing");
  });

  it("moves to speaking after high-confidence writing", () => {
    const session = freshSession();
    const next = nextPromptAfterAssessment({
      session,
      responses: [],
      assessment: assessment("A2", 0.9),
    });
    expect(next.prompt?.modality).toBe("speaking");
  });

  it("keeps writing after low-confidence writing", () => {
    const session = freshSession();
    const next = nextPromptAfterAssessment({
      session,
      responses: [],
      assessment: assessment("A2", 0.4),
    });
    expect(next.prompt?.modality).toBe("writing");
  });

  it("raises difficulty after confident stronger evidence", () => {
    expect(adjustDifficulty("A2", assessment("B1", 0.8))).toBe("B1");
  });

  it("lowers difficulty after confident weaker evidence", () => {
    expect(adjustDifficulty("B2", assessment("A2", 0.8))).toBe("B1");
  });

  it("does not jump hard on weak confidence", () => {
    expect(adjustDifficulty("B2", assessment("A1", 0.3))).toBe("B1");
  });

  it("enters conversation after all prior modalities complete", () => {
    let metadata = freshSession().metadata;
    for (const modality of ["writing", "speaking", "reading", "listening"] as const) {
      metadata = updateStats(metadata, modality, assessment("B1", 0.9));
    }
    expect(selectNextModality(metadata)).toBe("conversation");
  });

  it("returns null after conversation completes", () => {
    let metadata = freshSession().metadata;
    for (const modality of ["writing", "speaking", "reading", "listening", "conversation"] as const) {
      metadata = updateStats(metadata, modality, assessment("B1", 0.9));
    }
    expect(selectNextModality(metadata)).toBeNull();
  });

  it("never returns an already-used prompt when alternatives exist", () => {
    const used = PROMPTS.find((p) => p.modality === "writing" && p.cefr === "A2");
    const prompt = selectPrompt({
      modality: "writing",
      targetLevel: "A2",
      responses: used
        ? [{
            session_id: "s",
            task_index: 0,
            modality: "writing",
            prompt_id: used.id,
            prompt_text: used.promptText,
            user_response_text: "x",
            audio_storage_path: null,
            response_duration_ms: null,
            ai_assessment: null,
            ai_assessment_version: null,
            graded_at: null,
            created_at: "now",
          }]
        : [],
    });
    expect(prompt.id).not.toBe(used?.id);
  });
});
