import type { PartialRuntimeEvidenceBundle, RuntimeEvidenceBundle } from "./evidenceBundle";

export type RuntimeDecisionTraceStageId =
  | "runtimeEvent"
  | "obsPacket"
  | "learningSignals"
  | "teacherContext"
  | "dpDecision"
  | "pedDecision"
  | "runtimeDecision"
  | "replay"
  | "judge";

export type RuntimeDecisionTraceStage = {
  stageId: RuntimeDecisionTraceStageId;
  pass: boolean;
  evidenceReference: string;
  summary: string;
  timestamp?: string;
};

export type RuntimeDecisionTrace = {
  deterministic: true;
  stages: RuntimeDecisionTraceStage[];
  missingStages: RuntimeDecisionTraceStageId[];
};

export const RUNTIME_DECISION_TRACE_ORDER: readonly RuntimeDecisionTraceStageId[] = [
  "runtimeEvent",
  "obsPacket",
  "learningSignals",
  "teacherContext",
  "dpDecision",
  "pedDecision",
  "runtimeDecision",
  "replay",
  "judge",
];

function hasStage(bundle: PartialRuntimeEvidenceBundle, stageId: RuntimeDecisionTraceStageId): boolean {
  if (stageId === "judge") return typeof bundle.judgeReproduction !== "undefined";
  return typeof bundle[stageId] !== "undefined";
}

function stageTimestamp(bundle: PartialRuntimeEvidenceBundle, stageId: RuntimeDecisionTraceStageId): string | undefined {
  if (stageId === "runtimeEvent") return bundle.runtimeEvent?.observedAt;
  if (stageId === "obsPacket") return bundle.obsPacket?.createdAt;
  return undefined;
}

function stageEvidenceReference(bundle: PartialRuntimeEvidenceBundle, stageId: RuntimeDecisionTraceStageId): string {
  if (stageId === "runtimeEvent") return bundle.runtimeEvent?.eventId ?? "missing:runtimeEvent";
  if (stageId === "obsPacket") return bundle.obsPacket?.packetId ?? "missing:obsPacket";
  if (stageId === "learningSignals") return `signals:${bundle.learningSignals?.length ?? 0}`;
  if (stageId === "teacherContext") return bundle.teacherContext?.observationSummary?.packetId ?? "missing:teacherContext";
  if (stageId === "dpDecision") return `dp:${bundle.dpDecision?.source ?? "missing"}`;
  if (stageId === "pedDecision") return `ped:${bundle.pedDecision?.source ?? "missing"}`;
  if (stageId === "runtimeDecision") return `runtime:${bundle.runtimeDecision?.summary ?? "missing"}`;
  if (stageId === "replay") return `replay:${bundle.replay?.deterministic === true ? "deterministic" : "not-deterministic"}`;
  return `judge:${bundle.judgeReproduction?.deterministic === true ? "deterministic" : "not-deterministic"}`;
}

function stageSummary(bundle: PartialRuntimeEvidenceBundle, stageId: RuntimeDecisionTraceStageId): string {
  if (stageId === "runtimeEvent") return bundle.runtimeEvent ? `${bundle.runtimeEvent.eventType} on ${bundle.runtimeEvent.route}` : "Runtime Event missing.";
  if (stageId === "obsPacket") return bundle.obsPacket ? `${bundle.obsPacket.facts.length} OBS facts.` : "OBS Packet missing.";
  if (stageId === "learningSignals") return `${bundle.learningSignals?.length ?? 0} Learning Signals.`;
  if (stageId === "teacherContext") return bundle.teacherContext ? `${bundle.teacherContext.recommendations.length} Teacher Context recommendations.` : "Teacher Context missing.";
  if (stageId === "dpDecision") return bundle.dpDecision ? `${bundle.dpDecision.source}: ${bundle.dpDecision.reason ?? "decision recorded"}` : "DP Decision missing.";
  if (stageId === "pedDecision") return bundle.pedDecision ? `${bundle.pedDecision.source}: ${bundle.pedDecision.action ?? "decision recorded"}` : "PED Decision missing.";
  if (stageId === "runtimeDecision") return bundle.runtimeDecision ? bundle.runtimeDecision.summary : "Runtime Decision missing.";
  if (stageId === "replay") return bundle.replay ? `Replay deterministic=${bundle.replay.deterministic}` : "Replay missing.";
  return bundle.judgeReproduction ? `Judge reproduction deterministic=${bundle.judgeReproduction.deterministic}` : "Judge reproduction missing.";
}

function stagePass(bundle: PartialRuntimeEvidenceBundle, stageId: RuntimeDecisionTraceStageId): boolean {
  if (!hasStage(bundle, stageId)) return false;
  if (stageId === "replay") return bundle.replay?.deterministic === true && bundle.replay.pass !== false;
  if (stageId === "judge") return bundle.judgeReproduction?.deterministic === true && bundle.judgeReproduction.pass !== false;
  if (stageId === "runtimeDecision") return bundle.runtimeDecision?.changed === true && bundle.runtimeDecision.changedBecauseOfTeacherContext === true;
  return true;
}

export function generateRuntimeDecisionTrace(bundle: PartialRuntimeEvidenceBundle): RuntimeDecisionTrace {
  const stages = RUNTIME_DECISION_TRACE_ORDER.map((stageId) => ({
    stageId,
    pass: stagePass(bundle, stageId),
    evidenceReference: stageEvidenceReference(bundle, stageId),
    summary: stageSummary(bundle, stageId),
    timestamp: stageTimestamp(bundle, stageId),
  }));

  return {
    deterministic: true,
    stages,
    missingStages: stages.filter((stage) => !hasStage(bundle, stage.stageId)).map((stage) => stage.stageId),
  };
}

export function generateCompleteRuntimeDecisionTrace(bundle: RuntimeEvidenceBundle): RuntimeDecisionTrace {
  return generateRuntimeDecisionTrace(bundle);
}
