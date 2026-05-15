// src/components/mercy-guide/tabs/FrenchLessonsTab.tsx
//
// Per-language wrapper for the French lessons tab inside the Mercy guide
// panel. The tab is itself lazy-loaded by MercyGuidePanel; inside the
// tab, individual levels are loaded on demand via the lazy registry so
// users only download the level they actually open.

import LanguageLessonsView, {
  type LanguageLessonsConfig,
} from "./LanguageLessonsView";
import LessonUiLangToggle, { useLessonUiLang } from "./LessonUiLangToggle";
import {
  FRENCH_CATEGORIES,
  loadLessonsForLevel,
  type FrenchCefrLevel,
  type FrenchLesson,
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
  loadLessonsForLevel: (level) =>
    loadLessonsForLevel(level as FrenchCefrLevel) as Promise<FrenchLesson[]>,
};

export default function FrenchLessonsTab() {
  const [uiLang, setUiLang] = useLessonUiLang();
  return (
    <div className="space-y-2">
      <div className="flex justify-end px-1 pt-1">
        <LessonUiLangToggle value={uiLang} onChange={setUiLang} />
      </div>
      <LanguageLessonsView config={FRENCH_CONFIG} uiLang={uiLang} />
    </div>
  );
}
