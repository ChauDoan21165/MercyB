import type { ObservationPacket } from "../obs/types";
import type { TeacherContext, TeacherContextLearningSignal } from "../runtime";
import type { RuntimeGateId } from "./contracts";

export const RUNTIME_EVIDENCE_BUNDLE_SCHEMA_VERSION = "tm-int-runtime-evidence-bundle-v1";

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
  schemaVersion: typeof RUNTIME_EVIDENCE_BUNDLE_SCHEMA_VERSION;
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

export const RUNTIME_EVIDENCE_BUNDLE_REQUIRED_FIELDS = [
  "schemaVersion",
  "contractId",
  "runtimeEvent",
  "obsPacket",
  "learningSignals",
  "teacherContext",
  "dpDecision",
  "pedDecision",
  "runtimeDecision",
  "replay",
  "judgeReproduction",
] as const satisfies readonly (keyof RuntimeEvidenceBundle)[];

export type RuntimeEvidenceBundleRequiredField = (typeof RUNTIME_EVIDENCE_BUNDLE_REQUIRED_FIELDS)[number];

export type PartialRuntimeEvidenceBundle = Partial<RuntimeEvidenceBundle> & {
  contractId?: RuntimeGateId | string;
};

export function missingRuntimeEvidenceBundleFields(
  value: PartialRuntimeEvidenceBundle,
): RuntimeEvidenceBundleRequiredField[] {
  return RUNTIME_EVIDENCE_BUNDLE_REQUIRED_FIELDS.filter((field) => {
    const fieldValue = value[field];
    return fieldValue === null || typeof fieldValue === "undefined";
  });
}

export function isRuntimeEvidenceBundle(value: PartialRuntimeEvidenceBundle): value is RuntimeEvidenceBundle {
  return (
    missingRuntimeEvidenceBundleFields(value).length === 0 &&
    value.schemaVersion === RUNTIME_EVIDENCE_BUNDLE_SCHEMA_VERSION &&
    typeof value.contractId === "string" &&
    Array.isArray(value.learningSignals) &&
    Boolean(value.runtimeEvent) &&
    Boolean(value.obsPacket) &&
    Boolean(value.teacherContext) &&
    Boolean(value.dpDecision) &&
    Boolean(value.pedDecision) &&
    Boolean(value.runtimeDecision) &&
    Boolean(value.replay) &&
    Boolean(value.judgeReproduction)
  );
}

export function observationIdsFromBundle(bundle: PartialRuntimeEvidenceBundle): Set<string> {
  const ids = new Set<string>();

  if (bundle.obsPacket?.packetId) ids.add(bundle.obsPacket.packetId);
  for (const fact of bundle.obsPacket?.facts ?? []) {
    if (fact.context.taskId) ids.add(fact.context.taskId);
    if (fact.context.requestedUrl) ids.add(fact.context.requestedUrl);
    ids.add(`${fact.factType}:${fact.context.taskId ?? fact.context.requestedUrl ?? fact.observedAt}`);
  }

  for (const observationId of bundle.runtimeEvent?.observationIds ?? []) ids.add(observationId);
  return ids;
}

export function signalKeysFromBundle(bundle: PartialRuntimeEvidenceBundle): Set<string> {
  const keys = new Set<string>();
  for (const signal of bundle.learningSignals ?? []) keys.add(signal.signal_key);
  return keys;
}
