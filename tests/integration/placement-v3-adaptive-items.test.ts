import { describe, expect, it } from "vitest";

import {
  buildAdaptiveGenerationPrompts,
  buildAdaptiveValidationPrompts,
  MODALITY_CONSTRAINTS,
  REJECTION_RUBRIC,
} from "../../supabase/functions/_shared/placementAdaptivePrompts";

describe("placement v3 adaptive item pipeline", () => {
  it("builds generation prompts for reading", () => {
    const prompts = buildAdaptiveGenerationPrompts({
      modality: "reading",
      targetCefr: "A2",
      learnerL1: "vi",
      targetLanguage: "en",
      skillFocus: "detail extraction",
      difficultyConstraints: ["short familiar task"],
    });
    expect(prompts.systemPrompt).toContain("Vietnamese-L1");
    expect(prompts.userMessage).toContain('"modality": "reading"');
  });

  it("builds generation prompts for writing", () => {
    const prompts = buildAdaptiveGenerationPrompts({
      modality: "writing",
      targetCefr: "B1",
      learnerL1: "vi",
      targetLanguage: "en",
      skillFocus: "articles",
      difficultyConstraints: ["connected familiar topic"],
    });
    expect(prompts.systemPrompt).toContain("grammar, vocabulary, coherence");
  });

  it("builds generation prompts for listening", () => {
    const prompts = buildAdaptiveGenerationPrompts({
      modality: "listening",
      targetCefr: "B2",
      learnerL1: "vi",
      targetLanguage: "en",
      skillFocus: "speaker attitude",
      difficultyConstraints: ["paraphrase required"],
    });
    expect(prompts.systemPrompt).toContain("audio transcript");
  });

  it("builds generation prompts for speaking", () => {
    const prompts = buildAdaptiveGenerationPrompts({
      modality: "speaking",
      targetCefr: "C1",
      learnerL1: "vi",
      targetLanguage: "en",
      skillFocus: "fluency",
      difficultyConstraints: ["nuanced register"],
    });
    expect(prompts.systemPrompt).toContain("spoken response");
  });

  it("includes CEFR anchors in generation prompts", () => {
    const prompts = buildAdaptiveGenerationPrompts({
      modality: "reading",
      targetCefr: "C2",
      learnerL1: "vi",
      targetLanguage: "en",
      skillFocus: "subtle inference",
      difficultyConstraints: [],
    });
    expect(prompts.systemPrompt).toContain("C2: near-native precision");
  });

  it("includes one prompt version tuning note", () => {
    const prompts = buildAdaptiveGenerationPrompts({
      modality: "reading",
      targetCefr: "B1",
      learnerL1: "vi",
      targetLanguage: "en",
      skillFocus: "gist",
      difficultyConstraints: [],
      promptVersion: "a35-v2",
    });
    expect(prompts.systemPrompt).toContain("clearer expected answer");
  });

  it("includes all required validation dimensions", () => {
    const prompts = buildAdaptiveValidationPrompts({
      item: { id: "x", modality: "reading", promptText: "Read." },
      existingItems: [],
    });
    expect(prompts.systemPrompt).toContain("CEFR fit");
    expect(prompts.systemPrompt).toContain("Vietnamese-L1 interference relevance");
    expect(prompts.systemPrompt).toContain("Duplicate/similarity risk");
  });

  it("adds existing items to duplicate context", () => {
    const prompts = buildAdaptiveValidationPrompts({
      item: { id: "x", modality: "reading", promptText: "Read." },
      existingItems: [{ id: "old-1", title: "Old", promptText: "Similar prompt" }],
    });
    expect(prompts.userMessage).toContain("old-1");
    expect(prompts.userMessage).toContain("Similar prompt");
  });

  it("requires duplicate risk threshold in validation prompt", () => {
    const prompts = buildAdaptiveValidationPrompts({
      item: { id: "x" },
      existingItems: [],
    });
    expect(prompts.userMessage).toContain("duplicateRisk.score <= 0.35");
  });

  it("declares rejection causes", () => {
    expect(REJECTION_RUBRIC.join("\n")).toContain("poor_vietnamese_l1_relevance");
    expect(REJECTION_RUBRIC.join("\n")).toContain("not_gradable");
  });

  it("has modality-specific constraints for all four modalities", () => {
    expect(Object.keys(MODALITY_CONSTRAINTS).sort()).toEqual([
      "listening",
      "reading",
      "speaking",
      "writing",
    ]);
  });

  it("keeps validation output JSON-only", () => {
    const prompts = buildAdaptiveValidationPrompts({
      item: { id: "x" },
      existingItems: [],
    });
    expect(prompts.systemPrompt).toContain("Return JSON only");
  });
});
