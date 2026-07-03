export type EduLearningSignalId =
  | "EDU-LS-000001"
  | "EDU-LS-000002"
  | "EDU-LS-000003"
  | "EDU-LS-000004"
  | "EDU-LS-000005"
  | "EDU-LS-000006"
  | "EDU-LS-000007"
  | "EDU-LS-000008"
  | "EDU-LS-000009"
  | "EDU-LS-000010";

export type EduLearningSignalKey =
  | "productive_hesitation"
  | "healthy_self_correction"
  | "hint_dependency"
  | "misconception_recurrence"
  | "retrieval_success"
  | "productive_struggle"
  | "sustained_attention"
  | "confidence_calibration"
  | "cognitive_overload"
  | "transfer_success";

export type EduLearningSignalDefinition = {
  edu_id: EduLearningSignalId;
  signal_key: EduLearningSignalKey;
  name: string;
  educational_definition: string;
  observable_evidence: readonly string[];
  alternative_explanations: readonly string[];
  teacher_goal: string;
  teacher_actions: readonly string[];
  validation_criteria: readonly string[];
  anti_fake_checks: readonly string[];
};
