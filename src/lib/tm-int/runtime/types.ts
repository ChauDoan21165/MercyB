import type { EduLearningSignalKey } from "../edu";
import type { ObservationFact, ObservationPacket } from "../obs/types";

export type RuntimeVerifiedSource =
  | "TC-000001"
  | "TC-000002"
  | "TC-000003"
  | "EDU-LS-SPRINT1"
  | "LEARNING-BEHAVIOR-FAMILY-v1";

export type RuntimeRecommendation = {
  source: RuntimeVerifiedSource;
  reason: string;
  action: string;
  confidence: "medium" | "high";
  evidenceCount: number;
};

export type TeacherContextLearningSignal = {
  signal_key: EduLearningSignalKey;
  source_edu_id: string;
  confidence: "low" | "medium" | "high";
  evidenceCount: number;
  alternatives: readonly string[];
};

export type TeacherContextProductIssue = {
  source: "TC-000001" | "TC-000002";
  issue: "product_failure_audio" | "product_or_permission_block";
  affectedSkill: "listening" | "speaking";
  evidenceCount: number;
};

export type TeacherContextPendingRetest = {
  source: "TC-000001" | "TC-000002";
  skill: "listening" | "speaking";
  reason: string;
};

export type TeacherContextReplayStep = {
  stage: "OBS" | "DP" | "PED" | "LM" | "SIGNALS" | "RUNTIME";
  source: RuntimeVerifiedSource | "runtime";
  summary: string;
};

export type TeacherContext = {
  schemaVersion: "tm-int-teacher-context-v1";
  observationSummary: {
    packetId: string;
    factCount: number;
    factTypes: string[];
    factTypeCounts?: Record<string, number>;
  };
  learningSignals: TeacherContextLearningSignal[];
  productIssues: TeacherContextProductIssue[];
  pendingRetests: TeacherContextPendingRetest[];
  recommendations: RuntimeRecommendation[];
  confidenceSummary: {
    high: number;
    medium: number;
    low: number;
  };
  replayTrace: TeacherContextReplayStep[];
};

export type TeacherContextRuntimeInput = {
  observationPacket: ObservationPacket;
};

export type RuntimeObservationAdapter = {
  facts: ObservationFact[];
};
