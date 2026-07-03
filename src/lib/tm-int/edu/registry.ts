import type { EduLearningSignalDefinition, EduLearningSignalId, EduLearningSignalKey } from "./types";

export const EDU_LEARNING_SIGNAL_DEFINITIONS = [
  {
    edu_id: "EDU-LS-000001",
    signal_key: "productive_hesitation",
    name: "ProductiveHesitation",
    educational_definition: "A learner takes meaningful time before a correct final response without relying on a hint.",
    observable_evidence: ["pause or delayed answer timing", "final answer correct", "no hint used for the same item"],
    alternative_explanations: ["slow device", "interruption", "reading time", "accessibility need"],
    teacher_goal: "Preserve thinking time while confirming the learner can explain the answer.",
    teacher_actions: ["allow wait time", "ask for reasoning", "avoid marking the pause as weakness"],
    validation_criteria: ["answer timing exceeds pause threshold", "final answer is correct", "no HintUsed fact for the item"],
    anti_fake_checks: ["must include source facts", "must not infer anxiety", "must not infer unsupported learner capacity"],
  },
  {
    edu_id: "EDU-LS-000002",
    signal_key: "healthy_self_correction",
    name: "HealthySelfCorrection",
    educational_definition: "A learner revises an initially wrong response and reaches a correct response for the same item or concept.",
    observable_evidence: ["wrong answer fact", "later correct answer fact", "shared item or concept anchor"],
    alternative_explanations: ["accidental first tap", "ambiguous prompt", "interface correction", "peer or teacher cue"],
    teacher_goal: "Support revision as productive learning evidence without over-crediting mastery.",
    teacher_actions: ["acknowledge correction", "ask what changed", "check transfer on a nearby item"],
    validation_criteria: ["wrong response precedes correct response", "facts share the same task anchor", "source sequence is preserved"],
    anti_fake_checks: ["must not fabricate revision", "must not infer character traits", "must not conclude mastery from one correction"],
  },
  {
    edu_id: "EDU-LS-000003",
    signal_key: "hint_dependency",
    name: "HintDependency",
    educational_definition: "A learner repeatedly uses hints in a short evidence window, suggesting the teacher should check scaffolding fit.",
    observable_evidence: ["multiple HintUsed facts", "same route, task, or short session window"],
    alternative_explanations: ["unclear directions", "new format", "language load", "exploratory use"],
    teacher_goal: "Adjust support while avoiding blame for using available help.",
    teacher_actions: ["check prompt clarity", "model one example", "fade hints gradually"],
    validation_criteria: ["hint count meets threshold", "evidence list includes every counted hint", "no ability conclusion is emitted"],
    anti_fake_checks: ["must not label dependency as weakness", "must not ignore unclear prompt alternatives", "must include source facts"],
  },
  {
    edu_id: "EDU-LS-000004",
    signal_key: "misconception_recurrence",
    name: "MisconceptionRecurrence",
    educational_definition: "A similar wrong response pattern recurs for the same concept anchor across multiple attempts.",
    observable_evidence: ["repeated wrong answer facts", "shared concept or task anchor", "separate attempts"],
    alternative_explanations: ["miskeyed answer", "ambiguous item", "content not taught yet", "translation mismatch"],
    teacher_goal: "Find the specific concept to reteach rather than lowering the learner broadly.",
    teacher_actions: ["reteach the concept", "use a contrast example", "verify with a new item"],
    validation_criteria: ["wrong count meets threshold", "same concept or task anchor is present", "facts are not a single duplicate event"],
    anti_fake_checks: ["must not infer unsupported learner capacity", "must not generalize beyond the concept anchor", "must preserve alternatives"],
  },
  {
    edu_id: "EDU-LS-000005",
    signal_key: "retrieval_success",
    name: "RetrievalSuccess",
    educational_definition: "A learner retrieves a correct response after a meaningful delay without relying on immediate hints.",
    observable_evidence: ["correct answer fact", "response time exceeds retrieval delay threshold", "no immediate hint required"],
    alternative_explanations: ["easy item", "prior knowledge", "slow input", "reading time"],
    teacher_goal: "Recognize successful retrieval while checking that the knowledge transfers.",
    teacher_actions: ["briefly reinforce", "ask a transfer question", "space future practice"],
    validation_criteria: ["answer is correct", "delay threshold is met", "evidence includes timing fact"],
    anti_fake_checks: ["must not conclude broad mastery", "must not ignore easy item or prior knowledge alternatives", "must include evidence"],
  },
] as const satisfies readonly EduLearningSignalDefinition[];

export function eduDefinitionById(eduId: EduLearningSignalId): EduLearningSignalDefinition | null {
  return EDU_LEARNING_SIGNAL_DEFINITIONS.find((definition) => definition.edu_id === eduId) ?? null;
}

export function eduDefinitionBySignalKey(signalKey: EduLearningSignalKey): EduLearningSignalDefinition | null {
  return EDU_LEARNING_SIGNAL_DEFINITIONS.find((definition) => definition.signal_key === signalKey) ?? null;
}
