import type { DpEvidencePacket } from "../dp/types";
import type { LearningDpEvidencePacket } from "../dp/learning";
import type { LearningLmMemoryPacket } from "../lm/learning";
import type { LearningPedDecisionPacket } from "../ped/learning";
import type { LmMemoryPacket } from "../lm/types";
import type { ObservationPacket } from "../obs/types";
import type { PedDecisionPacket } from "../ped/types";
import type { SpeechDpEvidencePacket } from "../dp/speech";
import type { SpeechLmMemoryPacket } from "../lm/speech";
import type { SpeechPedDecisionPacket } from "../ped/speech";

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

export type SpeechTeachingCasePipelineOutput = {
  observation: ObservationPacket;
  dp: SpeechDpEvidencePacket;
  ped: SpeechPedDecisionPacket;
  lm: SpeechLmMemoryPacket;
};

export type SpeechJudgeReplayResult = {
  teachingCaseId: "TC-000002";
  judgeHookId: "JUDGE-TC-000002-REPLAY";
  deterministic: boolean;
  pass: boolean;
  failures: string[];
  first: SpeechTeachingCasePipelineOutput;
  second: SpeechTeachingCasePipelineOutput;
};

export type LearningTeachingCasePipelineOutput = {
  observation: ObservationPacket;
  dp: LearningDpEvidencePacket;
  ped: LearningPedDecisionPacket;
  lm: LearningLmMemoryPacket;
};

export type LearningJudgeReplayResult = {
  teachingCaseId: "TC-000003";
  judgeHookId: "JUDGE-TC-000003-REPLAY";
  deterministic: boolean;
  pass: boolean;
  failures: string[];
  first: LearningTeachingCasePipelineOutput;
  second: LearningTeachingCasePipelineOutput;
};
