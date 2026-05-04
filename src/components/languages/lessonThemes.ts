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
};

export const cefrPillColors: Record<string, string> = {
  A1: "bg-emerald-100 text-emerald-700",
  A2: "bg-sky-100 text-sky-700",
  B1: "bg-amber-100 text-amber-700",
  B2: "bg-rose-100 text-rose-700",
  C1: "bg-purple-100 text-purple-700",
  C2: "bg-slate-200 text-slate-800",
};

export const cefrPillLabels: Record<string, string> = {
  A1: "A1 · Sơ cấp",
  A2: "A2 · Cơ bản",
  B1: "B1 · Trung cấp",
  B2: "B2 · Trung cao",
  C1: "C1 · Cao cấp",
  C2: "C2 · Thuần thục",
};
