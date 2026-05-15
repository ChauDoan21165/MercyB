// src/components/mercy-guide/tabs/GermanLessonsTab.tsx
//
// Per-language wrapper for the German lessons tab inside the Mercy guide
// panel. The tab is itself lazy-loaded by MercyGuidePanel; inside the
// tab, individual levels are loaded on demand via the lazy registry so
// users only download the level they actually open.

import LanguageLessonsView, {
  type LanguageLessonsConfig,
} from "./LanguageLessonsView";
import LessonUiLangToggle, { useLessonUiLang } from "./LessonUiLangToggle";
import {
  GERMAN_CATEGORIES,
  loadLessonsForLevel,
  type GermanCefrLevel,
  type GermanLesson,
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
  loadLessonsForLevel: (level) =>
    loadLessonsForLevel(level as GermanCefrLevel) as Promise<GermanLesson[]>,
};

export default function GermanLessonsTab() {
  const [uiLang, setUiLang] = useLessonUiLang();
  return (
    <div className="space-y-2">
      <div className="flex justify-end px-1 pt-1">
        <LessonUiLangToggle value={uiLang} onChange={setUiLang} />
      </div>
      <LanguageLessonsView config={GERMAN_CONFIG} uiLang={uiLang} />
    </div>
  );
}
