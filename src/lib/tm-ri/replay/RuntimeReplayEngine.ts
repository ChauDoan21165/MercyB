import { AssessmentIntegrityAnalyzer } from "../assessment/AssessmentIntegrityAnalyzer";
import { EducationalHonesty } from "../assessment/EducationalHonesty";
import { EmotionalTimeline } from "../learner/EmotionalTimeline";
import { FrictionAnalyzer } from "../learner/FrictionAnalyzer";
import { ObservationKnowledgeGraph } from "../memory/ObservationKnowledgeGraph";
import { TeacherObservationBuilder } from "../pedagogy/TeacherObservationBuilder";
import { RepairPlanner } from "../planner/RepairPlanner";
import { ProductPsychologyAnalyzer } from "../psychology/ProductPsychologyAnalyzer";
import { ProductTrustAnalyzer } from "../psychology/ProductTrustAnalyzer";
import { RuntimeFailureDetector } from "../runtime/RuntimeFailureDetector";
import type { TmRiLearnerSignal, TmRiReplayAnalysis, TmRiRuntimeEvent } from "../types";

export class RuntimeReplayEngine {
  analyze(
    runtimeEvents: readonly TmRiRuntimeEvent[],
    learnerSignals: readonly TmRiLearnerSignal[],
  ): TmRiReplayAnalysis {
    const runtimeFindings = new RuntimeFailureDetector().detect(runtimeEvents);
    const learnerTimeline = new EmotionalTimeline().build(learnerSignals);
    const psychology = new ProductPsychologyAnalyzer().analyze(learnerTimeline);
    const assessmentIntegrity = new AssessmentIntegrityAnalyzer().analyze(runtimeEvents, runtimeFindings);
    const allFindings = [
      ...runtimeFindings,
      ...assessmentIntegrity.findings,
      ...psychology.findings,
    ];
    const friction = new FrictionAnalyzer().analyze(allFindings, learnerTimeline);
    const honesty = new EducationalHonesty().recommend(assessmentIntegrity, allFindings);
    const trust = new ProductTrustAnalyzer().analyze(allFindings, learnerTimeline);
    const observationPacket = new TeacherObservationBuilder().build(allFindings, psychology, trust, honesty);
    const repairPlan = new RepairPlanner().plan(allFindings);
    const knowledgeGraph = new ObservationKnowledgeGraph().build(allFindings, repairPlan);

    return {
      runtimeFindings,
      learnerTimeline,
      friction,
      assessmentIntegrity,
      honesty,
      psychology,
      trust,
      observationPacket,
      repairPlan,
      knowledgeGraph,
    };
  }
}
