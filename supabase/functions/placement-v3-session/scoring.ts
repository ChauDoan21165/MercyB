import {
  CEFR_ORDER,
  MODALITY_ORDER,
  type CEFRLevel,
  type CEFRAssessment,
  type L1InterferenceFlag,
  type PerSkillProfile,
  type PlacementV3Profile,
  type PlacementV3Response,
  type Recommendation,
} from "./types.ts";
import { cefrToNumber, numberToCefr } from "./modality.ts";

const SEVERITY_RANK: Record<L1InterferenceFlag["severity"], number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export function aggregateProfile(args: {
  userId: string;
  sessionId: string;
  responses: PlacementV3Response[];
  now: string;
  recommendations?: Recommendation[];
}): PlacementV3Profile {
  const assessed = args.responses.filter(
    (r): r is PlacementV3Response & { ai_assessment: CEFRAssessment } =>
      r.ai_assessment !== null,
  );
  const cefr_per_skill: PerSkillProfile = {};
  const strengths = new Set<string>();
  const gaps = new Set<string>();
  const flags = new Map<string, L1InterferenceFlag>();

  for (const modality of MODALITY_ORDER) {
    const rows = assessed.filter((r) => r.modality === modality);
    if (rows.length === 0) continue;
    let weighted = 0;
    let confidence = 0;
    for (const row of rows) {
      const assessment = row.ai_assessment;
      weighted += cefrToNumber(assessment.overallLevel) * assessment.confidence;
      confidence += assessment.confidence;
      for (const s of assessment.strengths ?? []) strengths.add(s);
      for (const g of assessment.gaps ?? []) gaps.add(g);
      for (const flag of assessment.l1InterferenceFlags ?? []) {
        const prev = flags.get(flag.patternId);
        if (!prev || SEVERITY_RANK[flag.severity] > SEVERITY_RANK[prev.severity]) {
          flags.set(flag.patternId, flag);
        }
      }
    }
    cefr_per_skill[modality] = {
      level: numberToCefr(confidence > 0 ? weighted / confidence : 0),
      confidence: round2(confidence / rows.length),
    };
  }

  const skillValues = Object.values(cefr_per_skill);
  const overall = skillValues.length === 0
    ? { level: "A1" as CEFRLevel, confidence: 0.2 }
    : weightedOverall(skillValues);

  return {
    user_id: args.userId,
    session_id: args.sessionId,
    cefr_overall: overall.level,
    cefr_overall_confidence: overall.confidence,
    cefr_per_skill,
    l1_interference_flags: [...flags.values()],
    strengths: [...strengths].slice(0, 8),
    gaps: [...gaps].slice(0, 8),
    recommended_lessons: args.recommendations ?? [],
    computed_at: args.now,
    is_current: true,
  };
}

function weightedOverall(
  skills: Array<{ level: CEFRLevel; confidence: number }>,
): { level: CEFRLevel; confidence: number } {
  const confidenceSum = skills.reduce((sum, s) => sum + s.confidence, 0);
  if (confidenceSum <= 0) return { level: "A1", confidence: 0.2 };
  const weighted = skills.reduce(
    (sum, s) => sum + CEFR_ORDER.indexOf(s.level) * s.confidence,
    0,
  );
  return {
    level: numberToCefr(weighted / confidenceSum),
    confidence: round2(confidenceSum / skills.length),
  };
}

export function recommendLessonsStub(profile: PlacementV3Profile): Recommendation[] {
  const level = profile.cefr_overall.toLowerCase();
  const firstGap = profile.gaps[0] ?? "core accuracy";
  return [
    {
      lessonId: `placement-${level}-grammar-foundation`,
      reason: `Start with ${firstGap} at ${profile.cefr_overall}.`,
      priority: 1,
    },
    {
      lessonId: `placement-${level}-vn-transfer`,
      reason: "Targets common Vietnamese L1 transfer patterns found in placement.",
      priority: 2,
    },
    {
      lessonId: `placement-${level}-speaking-loop`,
      reason: "Builds active recall across speaking, listening, and writing.",
      priority: 3,
    },
  ];
}

function round2(n: number): number {
  return Math.round(Math.min(1, Math.max(0, n)) * 100) / 100;
}
