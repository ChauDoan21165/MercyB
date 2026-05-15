// src/components/mercy-guide/tabs/FrenchLessonsTab.tsx
//
// Per-language wrapper for the French lessons tab inside the Mercy guide
// panel. The tab is itself lazy-loaded by MercyGuidePanel; inside the
// tab, individual levels are loaded on demand via the lazy registry so
// users only download the level they actually open.
//
// Normalizes per-language lesson and vocab shapes to the canonical
// NormalizedLesson / SidePanelVocabEntry contracts at the boundary so
// LanguageLessonsView never imports per-language types.

import LanguageLessonsView, {
  type LanguageLessonsConfig,
  type SidePanelVocabEntry,
} from "./LanguageLessonsView";
import LessonUiLangToggle, { useLessonUiLang } from "./LessonUiLangToggle";
import {
  FRENCH_CATEGORIES,
  loadLessonsForLevel,
  type FrenchCefrLevel,
  type FrenchLesson,
} from "@/languages/french/lessons";
import { FRENCH_VOCABULARY } from "@/languages/french/vocabulary";
import { normalizeFrenchLesson } from "@/languages/french/normalize";

// FRENCH_VOCABULARY entries are { fr, en, vi, pos, pronunciation_vi };
// the side panel only needs { word, vi, en? }. Map at the boundary.
const FRENCH_SIDE_PANEL_VOCAB: ReadonlyArray<SidePanelVocabEntry> =
  FRENCH_VOCABULARY.map((v) => ({
    word: v.fr,
    vi: v.vi,
    en: v.en,
  }));

const FRENCH_CONFIG: LanguageLessonsConfig = {
  label: "French",
  labelVi: "Tiếng Pháp",
  flag: "🇫🇷",
  accent: "blue",
  vocab: FRENCH_SIDE_PANEL_VOCAB,
  categories: FRENCH_CATEGORIES,
  loadLessonsForLevel: async (level) => {
    const raw = (await loadLessonsForLevel(
      level as FrenchCefrLevel,
    )) as FrenchLesson[];
    return raw.map((lesson, i) => normalizeFrenchLesson(lesson, i));
  },
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
