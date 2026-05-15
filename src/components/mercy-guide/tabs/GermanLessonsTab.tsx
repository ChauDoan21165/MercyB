// src/components/mercy-guide/tabs/GermanLessonsTab.tsx
//
// Per-language wrapper for the German lessons tab inside the Mercy guide
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
  GERMAN_CATEGORIES,
  loadLessonsForLevel,
  type GermanCefrLevel,
  type GermanLesson,
} from "@/languages/german/lessons";
import { GERMAN_VOCABULARY } from "@/languages/german/vocabulary";
import { normalizeGermanLesson } from "@/languages/german/normalize";

// GERMAN_VOCABULARY entries are { de, en, vi, pos, pronunciation_vi };
// the side panel only needs { word, vi, en? }. Map at the boundary.
const GERMAN_SIDE_PANEL_VOCAB: ReadonlyArray<SidePanelVocabEntry> =
  GERMAN_VOCABULARY.map((v) => ({
    word: v.de,
    vi: v.vi,
    en: v.en,
  }));

const GERMAN_CONFIG: LanguageLessonsConfig = {
  label: "German",
  labelVi: "Tiếng Đức",
  flag: "🇩🇪",
  accent: "red",
  vocab: GERMAN_SIDE_PANEL_VOCAB,
  categories: GERMAN_CATEGORIES,
  loadLessonsForLevel: async (level) => {
    const raw = (await loadLessonsForLevel(
      level as GermanCefrLevel,
    )) as GermanLesson[];
    return raw.map((lesson, i) => normalizeGermanLesson(lesson, i));
  },
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
