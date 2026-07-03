import { describe, expect, it } from "vitest";
import { EDU_LEARNING_SIGNAL_DEFINITIONS, eduDefinitionById, eduDefinitionBySignalKey } from "../index";

describe("EDU learning signal definitions", () => {
  it("defines the canonical EDU learning signals with required fields", () => {
    expect(EDU_LEARNING_SIGNAL_DEFINITIONS).toHaveLength(10);
    expect(EDU_LEARNING_SIGNAL_DEFINITIONS.map((definition) => definition.edu_id)).toEqual([
      "EDU-LS-000001",
      "EDU-LS-000002",
      "EDU-LS-000003",
      "EDU-LS-000004",
      "EDU-LS-000005",
      "EDU-LS-000006",
      "EDU-LS-000007",
      "EDU-LS-000008",
      "EDU-LS-000009",
      "EDU-LS-000010",
    ]);

    for (const definition of EDU_LEARNING_SIGNAL_DEFINITIONS) {
      expect(definition.signal_key).toBeTruthy();
      expect(definition.name).toBeTruthy();
      expect(definition.educational_definition).toBeTruthy();
      expect(definition.observable_evidence.length).toBeGreaterThan(0);
      expect(definition.alternative_explanations.length).toBeGreaterThan(0);
      expect(definition.teacher_goal).toBeTruthy();
      expect(definition.teacher_actions.length).toBeGreaterThan(0);
      expect(definition.validation_criteria.length).toBeGreaterThan(0);
      expect(definition.anti_fake_checks.length).toBeGreaterThan(0);
    }
  });

  it("looks up definitions by EDU id and signal key", () => {
    expect(eduDefinitionById("EDU-LS-000001")?.signal_key).toBe("productive_hesitation");
    expect(eduDefinitionBySignalKey("retrieval_success")?.edu_id).toBe("EDU-LS-000005");
  });

  it("keeps definitions educational rather than psychological", () => {
    const serialized = JSON.stringify(EDU_LEARNING_SIGNAL_DEFINITIONS);

    expect(serialized).not.toMatch(/lazy|careless|low ability|bad learner|poor learner/i);
  });
});
