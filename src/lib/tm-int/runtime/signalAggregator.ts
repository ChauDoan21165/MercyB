import { runLearningSignalEngine } from "../learning-signals";
import type { ObservationPacket } from "../obs/types";
import type { TeacherContextLearningSignal } from "./types";

function evidenceReference(fact: ObservationPacket["facts"][number]): string {
  const anchor = fact.context.taskId ?? fact.context.route ?? fact.observedAt;
  return `${fact.factType}:${anchor}`;
}

export function aggregateLearningSignals(observationPacket: ObservationPacket): TeacherContextLearningSignal[] {
  return runLearningSignalEngine(observationPacket).signals.map((signal) => ({
    signal_key: signal.signal_key,
    source_edu_id: signal.source_edu_id,
    confidence: signal.confidence,
    evidenceCount: signal.evidence.length,
    alternatives: signal.alternatives,
    evidenceReferences: signal.evidence.map(evidenceReference),
  }));
}
