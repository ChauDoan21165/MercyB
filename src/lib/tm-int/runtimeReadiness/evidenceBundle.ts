import type { ObservationPacket } from "../obs/types";
import type { TeacherContext, TeacherContextLearningSignal } from "../runtime";
import type { RuntimeGateId } from "./contracts";

export type RuntimeEventEvidence = {
  eventId: string;
  route: string;
  eventType: string;
  observedAt: string;
  observationIds: readonly string[];
};

export type RuntimeReadinessReplayEvidence = {
  deterministic: boolean;
  pass?: boolean;
  failures?: readonly string[];
};

export type RuntimeReadinessStageDecision = {
  stage: "DP" | "PED" | "RUNTIME";
  source: string;
  reason?: string;
  action?: string;
  evidenceCount?: number;
  productFailure?: boolean;
  learnerWeakness?: boolean;
  observationIds: readonly string[];
  signalKeys?: readonly string[];
};

export type RuntimeReadinessRuntimeDecision = {
  changed: boolean;
  changedBecauseOfTeacherContext: boolean;
  teacherContextUsed: boolean;
  learningSignalsUsed: boolean;
  summary: string;
  observationIds: readonly string[];
  signalKeys: readonly string[];
};

export type RuntimeEvidenceBundle = {
  schemaVersion: "tm-int-runtime-evidence-bundle-v1";
  contractId: RuntimeGateId;
  runtimeEvent: RuntimeEventEvidence;
  obsPacket: ObservationPacket;
  learningSignals: readonly TeacherContextLearningSignal[];
  teacherContext: TeacherContext;
  dpDecision: RuntimeReadinessStageDecision;
  pedDecision: RuntimeReadinessStageDecision;
  runtimeDecision: RuntimeReadinessRuntimeDecision;
  replay: RuntimeReadinessReplayEvidence;
  judgeReproduction: RuntimeReadinessReplayEvidence;
};

export type PartialRuntimeEvidenceBundle = Partial<RuntimeEvidenceBundle> & {
  contractId?: RuntimeGateId | string;
};

export function observationIdsFromBundle(bundle: PartialRuntimeEvidenceBundle): Set<string> {
  const ids = new Set<string>();

  if (bundle.obsPacket?.packetId) ids.add(bundle.obsPacket.packetId);
  for (const fact of bundle.obsPacket?.facts ?? []) {
    if (fact.context.taskId) ids.add(fact.context.taskId);
    ids.add(`${fact.factType}:${fact.context.taskId ?? fact.context.requestedUrl ?? fact.observedAt}`);
  }

  for (const observationId of bundle.runtimeEvent?.observationIds ?? []) ids.add(observationId);
  return ids;
}

export function signalKeysFromBundle(bundle: PartialRuntimeEvidenceBundle): Set<string> {
  const keys = new Set<string>();
  for (const signal of bundle.learningSignals ?? []) keys.add(signal.signal_key);
  for (const signal of bundle.teacherContext?.learningSignals ?? []) keys.add(signal.signal_key);
  return keys;
}
