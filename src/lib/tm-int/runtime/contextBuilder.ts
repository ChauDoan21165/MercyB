import type { ObservationPacket } from "../obs/types";
import { runRuntimeDecisionPipeline } from "./decisionPipeline";
import { aggregateLearningSignals } from "./signalAggregator";
import type { TeacherContext } from "./types";

function factTypeCounts(observationPacket: ObservationPacket): Record<string, number> {
  return observationPacket.facts.reduce<Record<string, number>>((counts, fact) => ({
    ...counts,
    [fact.factType]: (counts[fact.factType] ?? 0) + 1,
  }), {});
}

function confidenceSummary(recommendations: TeacherContext["recommendations"]): TeacherContext["confidenceSummary"] {
  return recommendations.reduce(
    (summary, recommendation) => ({
      ...summary,
      [recommendation.confidence]: summary[recommendation.confidence] + 1,
    }),
    { high: 0, medium: 0, low: 0 },
  );
}

export function buildTeacherContext(observationPacket: ObservationPacket): TeacherContext {
  const decisions = runRuntimeDecisionPipeline(observationPacket);
  const learningSignals = aggregateLearningSignals(observationPacket);

  return {
    schemaVersion: "tm-int-teacher-context-v1",
    observationSummary: {
      packetId: observationPacket.packetId,
      factCount: observationPacket.facts.length,
      factTypes: observationPacket.facts.map((fact) => fact.factType),
      factTypeCounts: factTypeCounts(observationPacket),
    },
    learningSignals,
    productIssues: decisions.productIssues,
    pendingRetests: decisions.pendingRetests,
    recommendations: decisions.recommendations,
    confidenceSummary: confidenceSummary(decisions.recommendations),
    replayTrace: decisions.replayTrace,
  };
}
