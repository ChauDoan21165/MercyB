import type { TeacherContext } from "../runtime";
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
