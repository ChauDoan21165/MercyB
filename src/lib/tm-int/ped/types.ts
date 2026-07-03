import type { DpEvidencePacket } from "../dp/types";

export type PedCapabilityId = "PED-AUDIO-000001";

export type TeacherDecision = {
  tmIntId: PedCapabilityId;
  exclude_listening_score: true;
  offer_retest: true;
  continue_remaining_sections: true;
  show_support_message: true;
  reason: "product_failure_audio";
  sourceDpPacketId: string;
};

export type PedDecisionPacket = {
  schemaVersion: "tm-int-ped-decision-v1";
  packetId: string;
  createdAt: string;
  source: "tm-int-ped";
  teachingCaseId: "TC-000001";
  dpPacketId: string;
  decisions: TeacherDecision[];
};

export type PedInput = DpEvidencePacket;
