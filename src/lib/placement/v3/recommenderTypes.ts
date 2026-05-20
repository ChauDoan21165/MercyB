import type { CEFRAssessment } from "../../../types/placement-v3";

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export type CefrLevel = (typeof CEFR_LEVELS)[number];

export type LessonSource =
  | "daily"
  | "rich"
  | "profession-pack"
  | "vstep"
  | "pronunciation"
  | "listening"
  | "interview"
  | "room";

export type IndexedLesson = {
  id: string;
  title: string;
  titleVi?: string;
  source: LessonSource;
  cefrLevel: CefrLevel | null;
  category: string;
  subskills: string[];
  tags: string[];
  l1InterferenceCoverage: string[];
};

export type Recommendation = {
  lessonId: string;
  lessonTitle: string;
  reason: string;
  priority: number;
  category: string;
  cefrLevel: string;
  matchedDiagnostics: {
    cefrAlignment: number;
    gapMatch: string[];
    l1Match: string[];
  };
};

export type RecommendationContext = {
  assessment: CEFRAssessment;
  recentLessonHistory?: string[];
  userPreferences?: {
    focusOnGrammar?: boolean;
    focusOnPronunciation?: boolean;
    avoidExamPrep?: boolean;
  };
};
