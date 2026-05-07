// src/components/mercy-guide/tabs/GermanLessonsTab.tsx
//
// Per-language wrapper for the German lessons tab inside the Mercy guide
// panel. Imports German lessons + vocabulary at module scope so this file
// rides its own lazy chunk; opening the French tab does not pull German
// data and vice versa.

import LanguageLessonsView, {
  type LanguageLessonsConfig,
} from "./LanguageLessonsView";
import {
  GERMAN_CATEGORIES,
  getLessonsByCategory,
  type GermanCategoryId,
} from "@/languages/german/lessons";
import { GERMAN_VOCABULARY } from "@/languages/german/vocabulary";

const GERMAN_CONFIG: LanguageLessonsConfig = {
  code: "german",
  label: "German",
  labelVi: "Tiếng Đức",
  flag: "🇩🇪",
  accent: "red",
  vocab: GERMAN_VOCABULARY,
  categories: GERMAN_CATEGORIES,
  getLessonsByCategory: (cat) => getLessonsByCategory(cat as GermanCategoryId),
};

export default function GermanLessonsTab() {
  return <LanguageLessonsView config={GERMAN_CONFIG} />;
}
