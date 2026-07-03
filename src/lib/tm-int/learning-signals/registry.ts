import type { EduLearningSignalId, EduLearningSignalKey } from "../edu";

export type LearningSignalMapping = {
  engine_id: "LS-ENGINE-000001";
  signal_key: EduLearningSignalKey;
  source_edu_id: EduLearningSignalId;
  required_evidence: readonly string[];
};

export const LEARNING_SIGNAL_MAPPINGS = [
  {
    engine_id: "LS-ENGINE-000001",
    signal_key: "productive_hesitation",
    source_edu_id: "EDU-LS-000001",
    required_evidence: ["pause", "final correct", "no hint"],
  },
  {
    engine_id: "LS-ENGINE-000001",
    signal_key: "healthy_self_correction",
    source_edu_id: "EDU-LS-000002",
    required_evidence: ["wrong", "revised", "correct"],
  },
  {
    engine_id: "LS-ENGINE-000001",
    signal_key: "hint_dependency",
    source_edu_id: "EDU-LS-000003",
    required_evidence: ["repeated hint usage"],
  },
  {
    engine_id: "LS-ENGINE-000001",
    signal_key: "misconception_recurrence",
    source_edu_id: "EDU-LS-000004",
    required_evidence: ["same concept wrong repeatedly"],
  },
  {
    engine_id: "LS-ENGINE-000001",
    signal_key: "retrieval_success",
    source_edu_id: "EDU-LS-000005",
    required_evidence: ["correct after delay"],
  },
  {
    engine_id: "LS-ENGINE-000001",
    signal_key: "productive_struggle",
    source_edu_id: "EDU-LS-000006",
    required_evidence: ["multiple wrong attempts", "eventual correct", "shared anchor"],
  },
  {
    engine_id: "LS-ENGINE-000001",
    signal_key: "sustained_attention",
    source_edu_id: "EDU-LS-000007",
    required_evidence: ["three thoughtful responses", "response timing", "session window"],
  },
  {
    engine_id: "LS-ENGINE-000001",
    signal_key: "confidence_calibration",
    source_edu_id: "EDU-LS-000008",
    required_evidence: ["confidence rating", "answer outcome", "same item"],
  },
  {
    engine_id: "LS-ENGINE-000001",
    signal_key: "cognitive_overload",
    source_edu_id: "EDU-LS-000009",
    required_evidence: ["slow wrong answers", "support seeking", "same window"],
  },
  {
    engine_id: "LS-ENGINE-000001",
    signal_key: "transfer_success",
    source_edu_id: "EDU-LS-000010",
    required_evidence: ["correct answers", "shared concept anchor", "distinct items"],
  },
] as const satisfies readonly LearningSignalMapping[];
