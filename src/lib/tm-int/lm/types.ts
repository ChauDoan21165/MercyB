import type { PedDecisionPacket } from "../ped/types";

export type LmCapabilityId = "LM-AUDIO-000001";

export type ListeningAttempt = {
  tmIntId: LmCapabilityId;
  status: "invalid";
  reason: "product_failure";
  retest_pending: true;
  sourcePedPacketId: string;
};

export type LmMemoryPacket = {
  schemaVersion: "tm-int-lm-memory-v1";
  packetId: string;
  createdAt: string;
  source: "tm-int-lm";
  teachingCaseId: "TC-000001";
  pedPacketId: string;
  listeningAttempts: ListeningAttempt[];
};

export type LmInput = PedDecisionPacket;
