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

function hasRuntimeEventShape(value: PartialRuntimeEvidenceBundle["runtimeEvent"]): boolean {
  return Boolean(
    value &&
      typeof value.eventId === "string" &&
      typeof value.route === "string" &&
      typeof value.eventType === "string" &&
      typeof value.observedAt === "string" &&
      Array.isArray(value.observationIds),
  );
}

function hasStageDecisionShape(value: PartialRuntimeEvidenceBundle["dpDecision"]): boolean {
  return Boolean(
    value &&
      typeof value.stage === "string" &&
      typeof value.source === "string" &&
      Array.isArray(value.observationIds),
  );
}

function hasRuntimeDecisionShape(value: PartialRuntimeEvidenceBundle["runtimeDecision"]): boolean {
  return Boolean(
    value &&
      typeof value.changed === "boolean" &&
      typeof value.changedBecauseOfTeacherContext === "boolean" &&
      typeof value.teacherContextUsed === "boolean" &&
      typeof value.learningSignalsUsed === "boolean" &&
      typeof value.summary === "string" &&
      Array.isArray(value.observationIds) &&
      Array.isArray(value.signalKeys),
  );
}

function hasReplayEvidenceShape(value: PartialRuntimeEvidenceBundle["replay"]): boolean {
  return Boolean(value && typeof value.deterministic === "boolean");
}

export function isRuntimeEvidenceBundle(value: PartialRuntimeEvidenceBundle): value is RuntimeEvidenceBundle {
  return (
    missingRuntimeEvidenceBundleFields(value).length === 0 &&
    value.schemaVersion === RUNTIME_EVIDENCE_BUNDLE_SCHEMA_VERSION &&
    typeof value.contractId === "string" &&
    hasRuntimeEventShape(value.runtimeEvent) &&
    value.obsPacket?.schemaVersion === "tm-int-obs-packet-v1" &&
    Array.isArray(value.obsPacket.facts) &&
    Array.isArray(value.learningSignals) &&
    value.teacherContext?.schemaVersion === "tm-int-teacher-context-v1" &&
    hasStageDecisionShape(value.dpDecision) &&
    hasStageDecisionShape(value.pedDecision) &&
    hasRuntimeDecisionShape(value.runtimeDecision) &&
    hasReplayEvidenceShape(value.replay) &&
    hasReplayEvidenceShape(value.judgeReproduction)
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

export function normalizedObservationIdsFromBundle(bundle: PartialRuntimeEvidenceBundle): readonly string[] {
  return Array.from(observationIdsFromBundle(bundle)).sort();
}

export function signalKeysFromBundle(bundle: PartialRuntimeEvidenceBundle): Set<string> {
  const keys = new Set<string>();
  for (const signal of bundle.learningSignals ?? []) keys.add(signal.signal_key);
  return keys;
}

export function normalizedSignalKeysFromBundle(bundle: PartialRuntimeEvidenceBundle): readonly string[] {
  return Array.from(signalKeysFromBundle(bundle)).sort();
}
