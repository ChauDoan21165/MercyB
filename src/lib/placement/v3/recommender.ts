import type { CEFRAssessment } from "@/types/placement-v3";
import { LESSON_INDEX } from "./lessonIndex";
import { CEFR_LEVELS, type CefrLevel, type IndexedLesson, type Recommendation, type RecommendationContext } from "./recommenderTypes";

export type { Recommendation, RecommendationContext } from "./recommenderTypes";

const CEFR_RANK: Record<CefrLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

const SKILL_TO_CATEGORY: Record<string, string[]> = {
  grammar: ["grammar"],
  vocabulary: ["vocabulary"],
  pronunciation: ["pronunciation"],
  listening: ["listening"],
  speaking: ["speaking", "interview"],
  reading: ["reading"],
  writing: ["writing"],
};

const L1_ALIASES: Record<string, string> = {
  "missing-articles": "vi_l1_missing_article",
  "missing_article": "vi_l1_missing_article",
  "article-omission": "vi_l1_missing_article",
  articles: "vi_l1_missing_article",
  "third-person-s": "vi_l1_3rd_person_s",
  "3rd-person-s": "vi_l1_3rd_person_s",
  "plural-s": "vi_l1_plural_s",
  "past-ed": "vi_l1_past_ed",
  "missing-be": "vi_l1_missing_be",
  "question-no-aux": "vi_l1_question_no_aux",
  "subjunctive-mood": "vi_l1_subjunctive_were",
  subjunctive: "vi_l1_subjunctive_were",
  "final-consonants": "vi_l1_final_consonants",
};

type SkillLevelMap = Partial<Record<string, string>>;

type NormalizedFlag = {
  id: string;
  severity: number;
};

type ScoredLesson = {
  lesson: IndexedLesson;
  rawPriority: number;
  cefrAlignment: number;
  gapMatch: string[];
  l1Match: string[];
};

function clean(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[*_`"“”'’()[\]{}]/g, " ")
    .replace(/[^a-z0-9/+\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function asCefr(value: unknown): CefrLevel | null {
  const raw = String(value ?? "").toUpperCase();
  if (raw === "PRE_A1") return "A1";
  return CEFR_LEVELS.includes(raw as CefrLevel) ? (raw as CefrLevel) : null;
}

function assessmentOverall(assessment: CEFRAssessment): CefrLevel {
  const value =
    assessment.overallCefr ??
    assessment.overallCEFR ??
    assessment.cefrLevel ??
    assessment.level;
  return asCefr(value) ?? "A1";
}

function skillLevels(assessment: CEFRAssessment): SkillLevelMap {
  return {
    ...(assessment.skillCefr ?? {}),
    ...(assessment.skillCEFR ?? {}),
    ...(assessment.skillLevels ?? {}),
  };
}

function lowestTargetLevels(assessment: CEFRAssessment): Array<{ skill: string; level: CefrLevel }> {
  const levels = skillLevels(assessment);
  const pairs = Object.entries(levels)
    .map(([skill, level]) => ({ skill, level: asCefr(level) }))
    .filter((entry): entry is { skill: string; level: CefrLevel } => Boolean(entry.level));

  if (!pairs.length) return [{ skill: "overall", level: assessmentOverall(assessment) }];

  const lowest = Math.min(...pairs.map((entry) => CEFR_RANK[entry.level]));
  const weakSkills = pairs.filter((entry) => CEFR_RANK[entry.level] === lowest);
  return weakSkills.length ? weakSkills : [{ skill: "overall", level: assessmentOverall(assessment) }];
}

function cefrAlignment(lesson: IndexedLesson, assessment: CEFRAssessment): number {
  if (!lesson.cefrLevel) return 0.5;

  const lessonLevel = lesson.cefrLevel;
  const targets = lowestTargetLevels(assessment);
  const relevantTargets = targets.filter((target) => {
    if (target.skill === "overall") return true;
    const categories = SKILL_TO_CATEGORY[target.skill] ?? [target.skill];
    return categories.includes(lesson.category) || lesson.subskills.some((skill) => categories.includes(skill));
  });
  const levels = relevantTargets.length ? relevantTargets : [{ skill: "overall", level: assessmentOverall(assessment) }];
  const bestDistance = Math.min(...levels.map((target) => Math.abs(CEFR_RANK[lessonLevel] - CEFR_RANK[target.level])));
  if (bestDistance === 0) return 1;
  if (bestDistance === 1) return 0.82;
  if (bestDistance === 2) return 0.45;
  return 0.12;
}

function tokenizeLesson(lesson: IndexedLesson): string {
  return clean([lesson.title, lesson.titleVi, lesson.category, ...lesson.subskills, ...lesson.tags, ...lesson.l1InterferenceCoverage].join(" "));
}

function gapMatches(lesson: IndexedLesson, gaps: string[]): string[] {
  const text = tokenizeLesson(lesson);
  return gaps.filter((gap) => {
    const normalized = clean(gap);
    if (!normalized) return false;
    const pieces = normalized.split(" ").filter((piece) => piece.length > 2);
    return text.includes(normalized) || pieces.some((piece) => text.includes(piece));
  });
}

function normalizeFlag(raw: unknown): NormalizedFlag | null {
  if (typeof raw === "string") return { id: L1_ALIASES[clean(raw)] ?? raw, severity: 1 };
  if (!raw || typeof raw !== "object") return null;

  const value = raw as { id?: string; patternId?: string; tag?: string; severity?: string | number };
  const id = value.id ?? value.patternId ?? value.tag;
  if (!id) return null;

  const severity =
    typeof value.severity === "number"
      ? Math.max(0.5, Math.min(1.5, value.severity))
      : value.severity === "severe"
        ? 1.5
        : value.severity === "high"
          ? 1.3
          : value.severity === "medium"
            ? 1
            : 0.75;

  return { id: L1_ALIASES[clean(id)] ?? id, severity };
}

function l1Matches(lesson: IndexedLesson, assessment: CEFRAssessment): NormalizedFlag[] {
  const coverage = new Set(lesson.l1InterferenceCoverage.map((value) => clean(value)));
  const text = tokenizeLesson(lesson);
  return (assessment.l1InterferenceFlags ?? [])
    .map(normalizeFlag)
    .filter((flag): flag is NormalizedFlag => Boolean(flag))
    .filter((flag) => coverage.has(clean(flag.id)) || text.includes(clean(flag.id)) || text.includes(clean(flag.id.replace(/^vi_l1_/, ""))));
}

function gapScore(matches: string[], totalGaps: number): number {
  if (!totalGaps) return 0;
  return Math.min(1, matches.length / Math.min(3, totalGaps));
}

function l1Score(matches: NormalizedFlag[]): number {
  if (!matches.length) return 0;
  return Math.min(1, matches.reduce((sum, match) => sum + match.severity, 0) / 2);
}

function preferenceMultiplier(lesson: IndexedLesson, ctx: RecommendationContext): number {
  let multiplier = 1;
  if (ctx.userPreferences?.focusOnGrammar && (lesson.category === "grammar" || lesson.subskills.includes("grammar"))) {
    multiplier *= 1.2;
  }
  if (ctx.userPreferences?.focusOnPronunciation && (lesson.category === "pronunciation" || lesson.subskills.includes("pronunciation"))) {
    multiplier *= 1.2;
  }
  return multiplier;
}

function buildReason(scored: ScoredLesson): string {
  if (scored.l1Match.length) {
    return `Targets ${scored.l1Match[0].replace(/^vi_l1_/, "").replace(/_/g, " ")} with a ${scored.lesson.cefrLevel ?? "level-matched"} ${scored.lesson.category} lesson.`;
  }
  if (scored.gapMatch.length) {
    return `Addresses the "${scored.gapMatch[0]}" gap at the right CEFR level.`;
  }
  return `Matches the learner's current CEFR level with ${scored.lesson.category} practice.`;
}

function diversify(scored: ScoredLesson[]): ScoredLesson[] {
  const categoryCounts = new Map<string, number>();
  return scored.map((item) => {
    const count = categoryCounts.get(item.lesson.category) ?? 0;
    categoryCounts.set(item.lesson.category, count + 1);
    return {
      ...item,
      rawPriority: item.rawPriority * Math.max(0.75, 1 - count * 0.05),
    };
  });
}

export function recommendLessons(ctx: RecommendationContext): Recommendation[] {
  const history = new Set(ctx.recentLessonHistory ?? []);
  const gaps = ctx.assessment.gaps ?? [];

  const scored = LESSON_INDEX.filter((lesson) => !history.has(lesson.id))
    .filter((lesson) => !(ctx.userPreferences?.avoidExamPrep && lesson.source === "vstep"))
    .map((lesson): ScoredLesson => {
      const cefr = cefrAlignment(lesson, ctx.assessment);
      const gapMatch = gapMatches(lesson, gaps);
      const l1MatchObjects = l1Matches(lesson, ctx.assessment);
      const l1Match = l1MatchObjects.map((match) => match.id);
      const categoryNudge = lesson.source === "daily" || lesson.source === "rich" || lesson.source === "room" ? 0.03 : 0;
      const rawPriority =
        (cefr * 0.4 + gapScore(gapMatch, gaps.length) * 0.3 + l1Score(l1MatchObjects) * 0.2 + categoryNudge) *
        preferenceMultiplier(lesson, ctx);

      return { lesson, rawPriority, cefrAlignment: cefr, gapMatch, l1Match };
    })
    .sort((a, b) => b.rawPriority - a.rawPriority || a.lesson.title.localeCompare(b.lesson.title));

  return diversify(scored)
    .sort((a, b) => b.rawPriority - a.rawPriority || a.lesson.title.localeCompare(b.lesson.title))
    .slice(0, 12)
    .map((item) => ({
      lessonId: item.lesson.id,
      lessonTitle: item.lesson.title,
      reason: buildReason(item),
      priority: Number(Math.max(0, Math.min(1, item.rawPriority)).toFixed(3)),
      category: item.lesson.category,
      cefrLevel: item.lesson.cefrLevel ?? "unknown",
      matchedDiagnostics: {
        cefrAlignment: Number(item.cefrAlignment.toFixed(3)),
        gapMatch: item.gapMatch,
        l1Match: item.l1Match,
      },
    }));
}
