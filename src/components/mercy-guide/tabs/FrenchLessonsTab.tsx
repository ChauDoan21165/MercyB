// src/components/mercy-guide/tabs/FrenchLessonsTab.tsx
//
// Per-language wrapper for the French lessons tab inside the Mercy guide
// panel. Imports French lessons + vocabulary at module scope so this file
// rides its own lazy chunk; opening the German tab does not pull French
// data and vice versa.

import LanguageLessonsView, {
  type LanguageLessonsConfig,
} from "./LanguageLessonsView";
import {
  FRENCH_CATEGORIES,
  getLessonsByCategory,
  type FrenchCategoryId,
} from "@/languages/french/lessons";
import { FRENCH_VOCABULARY } from "@/languages/french/vocabulary";

const FRENCH_CONFIG: LanguageLessonsConfig = {
  code: "french",
  label: "French",
  labelVi: "Tiếng Pháp",
  flag: "🇫🇷",
  accent: "blue",
  vocab: FRENCH_VOCABULARY,
  categories: FRENCH_CATEGORIES,
  getLessonsByCategory: (cat) => getLessonsByCategory(cat as FrenchCategoryId),
};

export default function FrenchLessonsTab() {
  return <LanguageLessonsView config={FRENCH_CONFIG} />;
}
