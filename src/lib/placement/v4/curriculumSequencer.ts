import type { CEFRAssessment, PlacementSkill } from "../../../types/placement-v3";
import { LESSON_INDEX } from "../v3/lessonIndex";
import { recommendLessons } from "../v3/recommender";
import type { CefrLevel, IndexedLesson, Recommendation, RecommendationContext } from "../v3/recommenderTypes";

export type CurriculumPlanLength = 7 | 28 | 90;

export type CurriculumActivityKind = "learn" | "review" | "reinforce" | "speaking" | "challenge";

export type CurriculumSkill =
  | "grammar"
  | "vocabulary"
  | "pronunciation"
  | "listening"
  | "speaking"
  | "reading"
  | "writing";

export type CompletedCurriculumLesson = {
  lessonId: string;
  completedDay: number;
  skill?: CurriculumSkill | string;
  score?: number;
};

export type SkillProgress = {
  mastery: number;
  confidence?: number;
  attempts?: number;
  lastPracticedDay?: number;
};

export type CurriculumLearnerState = {
  assessment: CEFRAssessment;
  recentLessonHistory?: string[];
  completedLessons?: CompletedCurriculumLesson[];
  skillProgress?: Partial<Record<CurriculumSkill, SkillProgress>>;
  weakSkills?: CurriculumSkill[];
  fatigue?: {
    score?: number;
    missedDaysLast14?: number;
    averageSessionMinutes?: number;
    streakDays?: number;
  };
  speaking?: {
    confidence?: number;
    avoidanceDays?: number;
    recentAttempts?: number;
  };
  userPreferences?: RecommendationContext["userPreferences"];
  startDay?: number;
};

export type CurriculumActivity = {
  day: number;
  slot: number;
  kind: CurriculumActivityKind;
  lessonId: string;
  lessonTitle: string;
  category: string;
  cefrLevel: string;
  targetSkill: CurriculumSkill;
  reason: string;
  priority: number;
  spacingDays: number | null;
  l1Weight: number;
  weakSkillWeight: number;
  fatigueAdjusted: boolean;
};

export type CurriculumDayPlan = {
  day: number;
  intensity: "light" | "standard" | "challenge";
  focusSkill: CurriculumSkill;
  activities: CurriculumActivity[];
};

export type CurriculumPlan = {
  planLengthDays: CurriculumPlanLength;
  generatedAtDay: number;
  days: CurriculumDayPlan[];
  diagnostics: {
    deterministicKey: string;
    fatigueScore: number;
    reviewCadenceDays: number[];
    weakSkills: CurriculumSkill[];
    speakingConfidence: number;
    challengeEveryDays: number;
  };
};

type Candidate = {
  lesson: IndexedLesson;
  recommendation?: Recommendation;
  targetSkill: CurriculumSkill;
  baseScore: number;
  l1Weight: number;
  weakSkillWeight: number;
  speakingWeight: number;
};

const SKILLS: CurriculumSkill[] = ["grammar", "vocabulary", "pronunciation", "listening", "speaking", "reading", "writing"];

const CEFR_RANK: Record<CefrLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

const RANK_TO_CEFR: Record<number, CefrLevel> = {
  1: "A1",
  2: "A2",
  3: "B1",
  4: "B2",
  5: "C1",
  6: "C2",
};

const REVIEW_CADENCE = [1, 3, 7, 14, 28];

function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

function round(value: number): number {
  return Number(value.toFixed(3));
}

function normalizeSkill(value: unknown): CurriculumSkill | null {
  const raw = String(value ?? "").toLowerCase();
  if (SKILLS.includes(raw as CurriculumSkill)) return raw as CurriculumSkill;
  if (raw === "conversation" || raw === "interview") return "speaking";
  return null;
}

function normalizeCefr(value: unknown): CefrLevel | null {
  const raw = String(value ?? "").toUpperCase();
  if (raw === "PRE_A1") return "A1";
  if (raw in CEFR_RANK) return raw as CefrLevel;
  return null;
}

function assessmentLevel(assessment: CEFRAssessment): CefrLevel {
  return (
    normalizeCefr(assessment.overallCefr) ??
    normalizeCefr(assessment.overallCEFR) ??
    normalizeCefr(assessment.overallLevel) ??
    normalizeCefr(assessment.cefrLevel) ??
    normalizeCefr(assessment.level) ??
    "A1"
  );
}

function skillLevel(assessment: CEFRAssessment, skill: CurriculumSkill): CefrLevel {
  const maps = [assessment.skillCefr, assessment.skillCEFR, assessment.skillLevels];
  for (const map of maps) {
    const level = normalizeCefr(map?.[skill as PlacementSkill]);
    if (level) return level;
  }
  return assessmentLevel(assessment);
}

function nextCefr(level: CefrLevel): CefrLevel {
  return RANK_TO_CEFR[Math.min(6, CEFR_RANK[level] + 1)];
}

function targetSkillForLesson(lesson: IndexedLesson): CurriculumSkill {
  return normalizeSkill(lesson.category) ?? lesson.subskills.map(normalizeSkill).find(Boolean) ?? "vocabulary";
}

function fatigueScore(state: CurriculumLearnerState): number {
  const fatigue = state.fatigue ?? {};
  const explicit = typeof fatigue.score === "number" ? fatigue.score : 0;
  const missed = clamp((fatigue.missedDaysLast14 ?? 0) / 8);
  const sessionLoad = clamp(((fatigue.averageSessionMinutes ?? 18) - 24) / 24);
  const streakLoad = clamp(((fatigue.streakDays ?? 0) - 21) / 21) * 0.35;
  return round(clamp(Math.max(explicit, missed * 0.55 + sessionLoad * 0.35 + streakLoad)));
}

function dailySlots(fatigue: number): number {
  if (fatigue >= 0.72) return 2;
  if (fatigue >= 0.48) return 3;
  return 4;
}

function weakSkills(state: CurriculumLearnerState): CurriculumSkill[] {
  const explicit = state.weakSkills ?? [];
  const fromProgress = SKILLS.filter((skill) => (state.skillProgress?.[skill]?.mastery ?? 1) < 0.58);
  const levels = SKILLS.map((skill) => ({ skill, rank: CEFR_RANK[skillLevel(state.assessment, skill)] }));
  const lowest = Math.min(...levels.map((entry) => entry.rank));
  const fromAssessment = levels.filter((entry) => entry.rank === lowest).map((entry) => entry.skill);
  return [...new Set([...explicit, ...fromProgress, ...fromAssessment].map(normalizeSkill).filter(Boolean))] as CurriculumSkill[];
}

function l1Weight(lesson: IndexedLesson, recommendation?: Recommendation): number {
  const recMatches = recommendation?.matchedDiagnostics.l1Match.length ?? 0;
  const coverage = lesson.l1InterferenceCoverage.length;
  return round(clamp(recMatches * 0.34 + coverage * 0.18, 0, 1));
}

function weakSkillWeight(skill: CurriculumSkill, weak: CurriculumSkill[]): number {
  return weak.includes(skill) ? 1 : 0;
}

function speakingConfidence(state: CurriculumLearnerState): number {
  const explicit = state.speaking?.confidence;
  const progress = state.skillProgress?.speaking?.confidence;
  return round(clamp(typeof explicit === "number" ? explicit : typeof progress === "number" ? progress : 0.55));
}

function buildCandidates(state: CurriculumLearnerState): Candidate[] {
  const recommended = recommendLessons({
    assessment: state.assessment,
    recentLessonHistory: state.recentLessonHistory,
    userPreferences: state.userPreferences,
  });
  const recommendationById = new Map(recommended.map((rec) => [rec.lessonId, rec]));
  const completed = new Set(state.completedLessons?.map((lesson) => lesson.lessonId) ?? []);
  const recent = new Set(state.recentLessonHistory ?? []);
  const weak = weakSkills(state);
  const confidence = speakingConfidence(state);

  return LESSON_INDEX.filter((lesson) => !completed.has(lesson.id))
    .map((lesson): Candidate => {
      const recommendation = recommendationById.get(lesson.id);
      const targetSkill = targetSkillForLesson(lesson);
      const level = lesson.cefrLevel ?? assessmentLevel(state.assessment);
      const levelDistance = Math.abs(CEFR_RANK[level] - CEFR_RANK[skillLevel(state.assessment, targetSkill)]);
      const alignment = levelDistance === 0 ? 1 : levelDistance === 1 ? 0.74 : levelDistance === 2 ? 0.38 : 0.12;
      const recScore = recommendation?.priority ?? 0.34;
      const l1 = l1Weight(lesson, recommendation);
      const weakWeight = weakSkillWeight(targetSkill, weak);
      const speakingWeightForLesson = targetSkill === "speaking" || lesson.subskills.includes("speaking") ? 1 - confidence : 0;
      const recentPenalty = recent.has(lesson.id) ? 0.35 : 0;
      const baseScore = recScore * 0.45 + alignment * 0.25 + l1 * 0.12 + weakWeight * 0.13 + speakingWeightForLesson * 0.05 - recentPenalty;
      return {
        lesson,
        recommendation,
        targetSkill,
        baseScore: round(baseScore),
        l1Weight: l1,
        weakSkillWeight: weakWeight,
        speakingWeight: round(speakingWeightForLesson),
      };
    })
    .sort(compareCandidates);
}

function compareCandidates(a: Candidate, b: Candidate): number {
  return (
    b.baseScore - a.baseScore ||
    b.weakSkillWeight - a.weakSkillWeight ||
    b.l1Weight - a.l1Weight ||
    a.lesson.id.localeCompare(b.lesson.id)
  );
}

function challengeEveryDays(planLength: CurriculumPlanLength, fatigue: number): number {
  if (fatigue >= 0.65) return planLength === 7 ? 7 : 14;
  return planLength === 7 ? 4 : 7;
}

function activityKindFor(day: number, slot: number, planLength: CurriculumPlanLength, fatigue: number, hasReview: boolean, speakingDue: boolean): CurriculumActivityKind {
  if (hasReview && slot === 0) return "review";
  if (speakingDue && slot <= 1) return "speaking";
  if (day % challengeEveryDays(planLength, fatigue) === 0 && slot === dailySlots(fatigue) - 1) return "challenge";
  return slot === 0 ? "reinforce" : "learn";
}

function dueReview(completed: CompletedCurriculumLesson[], day: number): CompletedCurriculumLesson | null {
  return (
    completed
      .filter((lesson) => REVIEW_CADENCE.includes(day - lesson.completedDay))
      .sort((a, b) => a.completedDay - b.completedDay || a.lessonId.localeCompare(b.lessonId))[0] ?? null
  );
}

function candidateForReview(candidates: Candidate[], review: CompletedCurriculumLesson): Candidate | null {
  const skill = normalizeSkill(review.skill);
  return (
    candidates.find((candidate) => candidate.lesson.id === review.lessonId) ??
    (skill ? candidates.find((candidate) => candidate.targetSkill === skill) : null) ??
    null
  );
}

function pickCandidate(
  candidates: Candidate[],
  usedLessonIds: Set<string>,
  daySkills: CurriculumSkill[],
  kind: CurriculumActivityKind,
  focusSkill: CurriculumSkill,
  targetLevel: CefrLevel,
): Candidate {
  const allowedChallengeLevels = new Set<CefrLevel>([targetLevel, nextCefr(targetLevel)]);
  const filtered = candidates.filter((candidate) => {
    if (usedLessonIds.has(candidate.lesson.id)) return false;
    if (kind === "speaking" && candidate.targetSkill !== "speaking" && !candidate.lesson.subskills.includes("speaking")) return false;
    if (kind === "challenge" && candidate.lesson.cefrLevel && !allowedChallengeLevels.has(candidate.lesson.cefrLevel)) return false;
    return true;
  });

  const ranked = filtered
    .map((candidate) => {
      const focusBoost = candidate.targetSkill === focusSkill ? 0.16 : 0;
      const varietyPenalty = daySkills.includes(candidate.targetSkill) ? 0.22 : 0;
      const challengeBoost = kind === "challenge" && candidate.lesson.cefrLevel === nextCefr(targetLevel) ? 0.2 : 0;
      const score = candidate.baseScore + focusBoost + challengeBoost - varietyPenalty;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score || compareCandidates(a.candidate, b.candidate));

  return ranked[0]?.candidate ?? candidates.find((candidate) => !usedLessonIds.has(candidate.lesson.id)) ?? candidates[0];
}

function makeActivity(candidate: Candidate, day: number, slot: number, kind: CurriculumActivityKind, spacingDays: number | null, fatigueAdjusted: boolean): CurriculumActivity {
  return {
    day,
    slot,
    kind,
    lessonId: candidate.lesson.id,
    lessonTitle: candidate.lesson.title,
    category: candidate.lesson.category,
    cefrLevel: candidate.lesson.cefrLevel ?? "unknown",
    targetSkill: candidate.targetSkill,
    reason: candidate.recommendation?.reason ?? `${kind === "review" ? "Reviews" : "Builds"} ${candidate.targetSkill} through indexed curriculum practice.`,
    priority: candidate.baseScore,
    spacingDays,
    l1Weight: candidate.l1Weight,
    weakSkillWeight: candidate.weakSkillWeight,
    fatigueAdjusted,
  };
}

function deterministicKey(state: CurriculumLearnerState, planLength: CurriculumPlanLength): string {
  const weak = weakSkills(state).join(",");
  const recent = [...(state.recentLessonHistory ?? [])].sort().join(",");
  const completed = [...(state.completedLessons ?? [])]
    .map((lesson) => `${lesson.lessonId}:${lesson.completedDay}:${lesson.score ?? ""}`)
    .sort()
    .join(",");
  return [planLength, assessmentLevel(state.assessment), weak, recent, completed, fatigueScore(state), speakingConfidence(state)].join("|");
}

export function generateCurriculumPlan(state: CurriculumLearnerState, planLength: CurriculumPlanLength): CurriculumPlan {
  const fatigue = fatigueScore(state);
  const slots = dailySlots(fatigue);
  const weak = weakSkills(state);
  const candidates = buildCandidates(state);
  const usedLessonIds = new Set<string>();
  const completedForReviews = [...(state.completedLessons ?? [])];
  const startDay = state.startDay ?? 1;
  const confidence = speakingConfidence(state);
  const speakingAvoidanceDays = state.speaking?.avoidanceDays ?? 0;
  const speakingInterval = confidence < 0.35 || speakingAvoidanceDays >= 5 ? 2 : confidence < 0.65 ? 3 : 4;
  const days: CurriculumDayPlan[] = [];

  for (let offset = 0; offset < planLength; offset += 1) {
    const day = startDay + offset;
    const focusSkill = weak[offset % Math.max(1, weak.length)] ?? SKILLS[offset % SKILLS.length];
    const targetLevel = skillLevel(state.assessment, focusSkill);
    const review = dueReview(completedForReviews, day);
    const daySkills: CurriculumSkill[] = [];
    const activities: CurriculumActivity[] = [];
    const speakingDue = day === startDay || (day - startDay + speakingAvoidanceDays) % speakingInterval === 0;
    const intensity = fatigue >= 0.58 ? "light" : day % challengeEveryDays(planLength, fatigue) === 0 ? "challenge" : "standard";

    for (let slot = 0; slot < slots; slot += 1) {
      const kind = activityKindFor(day, slot, planLength, fatigue, Boolean(review), speakingDue);
      const reviewCandidate = kind === "review" && review ? candidateForReview(candidates, review) : null;
      const candidate = reviewCandidate ?? pickCandidate(candidates, usedLessonIds, daySkills, kind, focusSkill, targetLevel);
      usedLessonIds.add(candidate.lesson.id);
      daySkills.push(candidate.targetSkill);
      activities.push(
        makeActivity(candidate, day, slot, kind, review ? day - review.completedDay : null, fatigue >= 0.48),
      );
      if (kind !== "review") {
        completedForReviews.push({ lessonId: candidate.lesson.id, completedDay: day, skill: candidate.targetSkill });
      }
    }

    days.push({ day, intensity, focusSkill, activities });
  }

  return {
    planLengthDays: planLength,
    generatedAtDay: startDay,
    days,
    diagnostics: {
      deterministicKey: deterministicKey(state, planLength),
      fatigueScore: fatigue,
      reviewCadenceDays: REVIEW_CADENCE,
      weakSkills: weak,
      speakingConfidence: confidence,
      challengeEveryDays: challengeEveryDays(planLength, fatigue),
    },
  };
}
