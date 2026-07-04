export type RuntimeGateId =
  | "RA-1"
  | "RR-001"
  | "RR-002"
  | "RR-003"
  | "RR-004"
  | "RR-005"
  | "RR-006";

export type RuntimeGateContractStatus = "promoted" | "candidate" | "planned";

export type RuntimeGateContract = {
  gateId: RuntimeGateId;
  name: string;
  status: RuntimeGateContractStatus;
  objective: string;
  requiredEvidenceFields: readonly RuntimeEvidenceField[];
  invariants: readonly RuntimeReadinessInvariant[];
};

export type RuntimeGateDpEvidenceRequirement = {
  gateId: RuntimeGateId;
  requiredEvidenceFields: readonly RuntimeEvidenceField[];
  requiredInvariants: readonly RuntimeReadinessInvariant[];
  requiresTeacherContext: boolean;
  requiresLearningSignals: boolean;
  requiresJudgeReproduction: boolean;
};

export type RuntimeGateContractReplayEvidence = {
  gateId: RuntimeGateId;
  status: RuntimeGateContractStatus;
  requiredEvidenceFields: readonly RuntimeEvidenceField[];
  requiredInvariants: readonly RuntimeReadinessInvariant[];
};

export type RuntimeEvidenceField =
  | "runtimeEvent"
  | "obsPacket"
  | "learningSignals"
  | "teacherContext"
  | "dpDecision"
  | "pedDecision"
  | "runtimeDecision"
  | "replay"
  | "judgeReproduction";

export type RuntimeReadinessInvariant =
  | "no_product_failure_as_learner_weakness"
  | "no_ped_without_dp"
  | "no_bypassing_teacher_context"
  | "no_bypassing_learning_signals"
  | "replay_deterministic"
  | "runtime_decision_changed_by_teacher_context";

export const REQUIRED_RUNTIME_EVIDENCE_FIELDS: readonly RuntimeEvidenceField[] = [
  "runtimeEvent",
  "obsPacket",
  "learningSignals",
  "teacherContext",
  "dpDecision",
  "pedDecision",
  "runtimeDecision",
  "replay",
  "judgeReproduction",
];

export const REQUIRED_RUNTIME_INVARIANTS: readonly RuntimeReadinessInvariant[] = [
  "no_product_failure_as_learner_weakness",
  "no_ped_without_dp",
  "no_bypassing_teacher_context",
  "no_bypassing_learning_signals",
  "replay_deterministic",
  "runtime_decision_changed_by_teacher_context",
];

export const RUNTIME_GATE_CONTRACTS: readonly RuntimeGateContract[] = [
  {
    gateId: "RA-1",
    name: "Teacher Context Pipeline",
    status: "promoted",
    objective: "Runtime can build Teacher Context from verified TM INT capabilities.",
    requiredEvidenceFields: REQUIRED_RUNTIME_EVIDENCE_FIELDS,
    invariants: REQUIRED_RUNTIME_INVARIANTS,
  },
  {
    gateId: "RR-001",
    name: "Placement Runtime Integration",
    status: "candidate",
    objective: "Placement runtime uses verified Teacher Context decisions for audio, microphone, and rapid-guessing outcomes.",
    requiredEvidenceFields: REQUIRED_RUNTIME_EVIDENCE_FIELDS,
    invariants: REQUIRED_RUNTIME_INVARIANTS,
  },
  {
    gateId: "RR-002",
    name: "Room Runtime Integration",
    status: "planned",
    objective: "Reserved contract for future room runtime adoption evidence.",
    requiredEvidenceFields: REQUIRED_RUNTIME_EVIDENCE_FIELDS,
    invariants: REQUIRED_RUNTIME_INVARIANTS,
  },
  {
    gateId: "RR-003",
    name: "Lesson Runtime Integration",
    status: "planned",
    objective: "Reserved contract for future lesson runtime adoption evidence.",
    requiredEvidenceFields: REQUIRED_RUNTIME_EVIDENCE_FIELDS,
    invariants: REQUIRED_RUNTIME_INVARIANTS,
  },
  {
    gateId: "RR-004",
    name: "Assessment Runtime Integration",
    status: "planned",
    objective: "Reserved contract for future assessment runtime adoption evidence.",
    requiredEvidenceFields: REQUIRED_RUNTIME_EVIDENCE_FIELDS,
    invariants: REQUIRED_RUNTIME_INVARIANTS,
  },
  {
    gateId: "RR-005",
    name: "Tutor Runtime Integration",
    status: "planned",
    objective: "Reserved contract for future tutor runtime adoption evidence.",
    requiredEvidenceFields: REQUIRED_RUNTIME_EVIDENCE_FIELDS,
    invariants: REQUIRED_RUNTIME_INVARIANTS,
  },
  {
    gateId: "RR-006",
    name: "Reporting Runtime Integration",
    status: "planned",
    objective: "Reserved contract for future reporting runtime adoption evidence.",
    requiredEvidenceFields: REQUIRED_RUNTIME_EVIDENCE_FIELDS,
    invariants: REQUIRED_RUNTIME_INVARIANTS,
  },
];

export function getRuntimeGateContract(gateId: RuntimeGateId): RuntimeGateContract {
  const contract = RUNTIME_GATE_CONTRACTS.find((item) => item.gateId === gateId);
  if (!contract) throw new Error(`Unknown runtime gate contract: ${gateId}`);
  return contract;
}

export function getRuntimeGateDpEvidenceRequirement(gateId: RuntimeGateId): RuntimeGateDpEvidenceRequirement {
  const contract = getRuntimeGateContract(gateId);
  return {
    gateId: contract.gateId,
    requiredEvidenceFields: contract.requiredEvidenceFields,
    requiredInvariants: contract.invariants,
    requiresTeacherContext: contract.requiredEvidenceFields.includes("teacherContext"),
    requiresLearningSignals: contract.requiredEvidenceFields.includes("learningSignals"),
    requiresJudgeReproduction: contract.requiredEvidenceFields.includes("judgeReproduction"),
  };
}

export function createRuntimeGateContractReplayEvidence(): readonly RuntimeGateContractReplayEvidence[] {
  return RUNTIME_GATE_CONTRACTS.map((contract) => ({
    gateId: contract.gateId,
    status: contract.status,
    requiredEvidenceFields: [...contract.requiredEvidenceFields],
    requiredInvariants: [...contract.invariants],
  }));
}
