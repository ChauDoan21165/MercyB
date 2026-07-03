import type { DpEvidencePacket } from "../dp/types";
import type { LmMemoryPacket } from "../lm/types";
import type { ObservationPacket } from "../obs/types";
import type { PedDecisionPacket } from "../ped/types";

export type TeachingCasePipelineOutput = {
  observation: ObservationPacket;
  dp: DpEvidencePacket;
  ped: PedDecisionPacket;
  lm: LmMemoryPacket;
};

export type JudgeReplayResult = {
  teachingCaseId: "TC-000001";
  judgeHookId: "JUDGE-TC-000001-REPLAY";
  deterministic: boolean;
  pass: boolean;
  failures: string[];
  first: TeachingCasePipelineOutput;
  second: TeachingCasePipelineOutput;
};
