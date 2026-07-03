import type { ObservationFact, ObservationPacket } from "../obs/types";

export type DpCapabilityId = "DP-AUDIO-000001";

export type AudioDecisionReason = "product_failure_audio";
export type PlacementValidity = "invalid_listening";
export type TeacherAction = "retest_required";

export type AudioDecisionEvidence = {
  tmIntId: DpCapabilityId;
  reason: AudioDecisionReason;
  confidence: 0.99;
  placement_validity: PlacementValidity;
  teacher_action: TeacherAction;
  sourceObservationPacketId: string;
  sourceFacts: ObservationFact[];
};

export type DpEvidencePacket = {
  schemaVersion: "tm-int-dp-evidence-v1";
  packetId: string;
  createdAt: string;
  source: "tm-int-dp";
  teachingCaseId: "TC-000001";
  observationPacketId: string;
  evidence: AudioDecisionEvidence[];
};

export type DpInput = ObservationPacket;
