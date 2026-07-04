import type { TeacherContext, TeacherContextLearningSignal } from "../runtime";
import { buildTeacherContext } from "../runtime";
import type { ObservationPacket } from "../obs";
import type { RuntimeEvidenceBundle } from "../runtimeReadiness";
import { validateTeacherContext, type TeacherContextValidationResult } from "../runtimeReadiness";
import type { DpEvidenceBasedDecision } from "./decisionContract";
import { validateDpDecision, type DpDecisionValidationResult } from "./dpValidator";

export type DpEvidenceIntakeValidationResult = {
  pass: boolean;
  teacherContextValidation: TeacherContextValidationResult;
  dpDecisionValidation: DpDecisionValidationResult;
};

export function validateDpEvidenceIntake(
  decision: DpEvidenceBasedDecision,
  teacherContext: TeacherContext,
  evidenceBundle: RuntimeEvidenceBundle,
): DpEvidenceIntakeValidationResult {
  const teacherContextValidation = validateTeacherContext(evidenceBundle);
  const dpDecisionValidation = validateDpDecision(decision, teacherContext);

  return {
    pass: teacherContextValidation.pass && dpDecisionValidation.pass,
    teacherContextValidation,
    dpDecisionValidation,
  };
}

export function buildDpTeacherContextFromObservationPacket(observationPacket: ObservationPacket): TeacherContext {
  return buildTeacherContext(observationPacket);
}

export function learningSignalsForDpEvidence(teacherContext: TeacherContext): readonly TeacherContextLearningSignal[] {
  return teacherContext.learningSignals.map((signal) => ({
    ...signal,
    alternatives: [...signal.alternatives],
  }));
}

export function observationPacketForDpEvidence(evidenceBundle: RuntimeEvidenceBundle): ObservationPacket {
  return evidenceBundle.obsPacket;
}
