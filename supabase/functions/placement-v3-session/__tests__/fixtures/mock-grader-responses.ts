import type { CEFRLevel, CEFRAssessment } from "../../types.ts";

export function assessment(
  level: CEFRLevel,
  confidence = 0.8,
  extra: Partial<CEFRAssessment> = {},
): CEFRAssessment {
  return {
    overallLevel: level,
    confidence,
    strengths: [`${level} strength`],
    gaps: [`${level} gap`],
    l1InterferenceFlags: [],
    ...extra,
  };
}

export const ASSESSMENTS: Record<CEFRLevel, CEFRAssessment> = {
  A1: assessment("A1", 0.82),
  A2: assessment("A2", 0.82),
  B1: assessment("B1", 0.82),
  B2: assessment("B2", 0.82),
  C1: assessment("C1", 0.82),
  C2: assessment("C2", 0.82),
};

