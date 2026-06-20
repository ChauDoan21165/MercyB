// src/components/languages/lessonThemes.ts
//
// Per-language accent color and CEFR pill palette. Used by LessonRenderer
// for the level pill, lesson-number badge, expand chevron, and dialogue
// speaker color.

import type { LessonTheme } from './LessonRenderer.types';

export const lessonThemes: Record<string, LessonTheme> = {
  french:   { accent: "#3B82F6" }, // blue-500
  german:   { accent: "#DC2626" }, // red-600
  japanese: { accent: "#F59E0B" }, // amber-500
  chinese:  { accent: "#DC2626" }, // red-600 (matches flag)
  korean:   { accent: "#8B5CF6" }, // violet-500
  vietnamese: { accent: "#16A34A" }, // green-600
  spanish:    { accent: "#E11D48" }, // rose-600 (Spanish-for-English-speakers vertical)
  portuguese: { accent: "#047857" }, // emerald-700 (Brazilian Portuguese)
  indonesian: { accent: "#B91C1C" }, // red-700 (Bahasa Indonesia)
  arabic:     { accent: "#C2410C" }, // orange-700 (Modern Standard Arabic)
  hindi:      { accent: "#4338CA" }, // indigo-700 (Hindi Devanagari)
  urdu:       { accent: "#0E7490" }, // cyan-700 (Urdu RTL)
};

export const cefrPillColors: Record<string, string> = {
  A1: "bg-emerald-100 text-emerald-700",
  "A1+": "bg-teal-100 text-teal-700",
  A2: "bg-sky-100 text-sky-700",
  B1: "bg-amber-100 text-amber-700",
  B2: "bg-rose-100 text-rose-700",
  C1: "bg-purple-100 text-purple-700",
  C2: "bg-slate-200 text-slate-800",
};

export const cefrPillLabels: Record<string, string> = {
  A1: "A1 · Sơ cấp",
  "A1+": "A1+ · Sơ cấp vững hơn",
  A2: "A2 · Cơ bản",
  B1: "B1 · Trung cấp",
  B2: "B2 · Trung cao",
  C1: "C1 · Cao cấp",
  C2: "C2 · Thuần thục",
};

// English CEFR pill labels — shown when the global uiLanguage is "en".
// Values are byte-identical to the set SpanishLessonsPage already ships
// in production (its local CEFR_PILL_LABELS_EN), so the whole app speaks
// one CEFR vocabulary. CEFR letters stay primary (they're international);
// the descriptive word is the English convention, not a translation of
// the Vietnamese phrase. The "A1+" rung has no Spanish precedent (Spanish
// is A1–C2 only) so its label is introduced here.
export const cefrPillLabelsEn: Record<string, string> = {
  A1: "A1 · Beginner",
  "A1+": "A1+ · Upper Beginner",
  A2: "A2 · Elementary",
  B1: "B1 · Intermediate",
  B2: "B2 · Upper-Intermediate",
  C1: "C1 · Advanced",
  C2: "C2 · Mastery",
};

// uiLang-aware accessor for the CEFR pill label. VI is byte-identical to
// the prior `cefrPillLabels[level] ?? level` call sites (zero change for
// existing Vietnamese users). EN prefers the English map, then falls back
// to the Vietnamese label, then the raw level token — so a level missing
// from the EN map degrades gracefully rather than rendering blank.
export function cefrPillLabel(
  level: string,
  uiLang: "vi" | "en",
): string {
  if (uiLang === "en") {
    return cefrPillLabelsEn[level] ?? cefrPillLabels[level] ?? level;
  }
  return cefrPillLabels[level] ?? level;
}
