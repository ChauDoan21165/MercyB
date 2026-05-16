// src/components/mercy-guide/tabs/LessonUiLangToggle.tsx
//
// Shared VI/EN toggle UI for lesson surfaces. As of the global-toggle
// work the state + localStorage persistence moved to the app-wide
// UiLanguageProvider context (src/contexts/UiLanguageContext.tsx) so a
// single toggle in the global chrome band drives every language page
// reactively in the same tab. `useLessonUiLang()` is kept as a thin
// shim over the context with its original [lang, setLang] signature so
// existing call sites compile unchanged.

import { useUiLanguage } from "@/contexts/UiLanguageContext";
import type { LessonUiLang } from "./LanguageLessonsView";

export function useLessonUiLang(): [LessonUiLang, (next: LessonUiLang) => void] {
  const { uiLang, setUiLang } = useUiLanguage();
  return [uiLang, setUiLang];
}

type Props = {
  value: LessonUiLang;
  onChange: (next: LessonUiLang) => void;
};

export default function LessonUiLangToggle({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Ngôn ngữ giải thích / Explanation language"
      className="inline-flex items-center rounded-full border border-slate-200 bg-white p-0.5 text-[10px] font-semibold"
    >
      <button
        type="button"
        onClick={() => onChange("vi")}
        aria-pressed={value === "vi"}
        className={`rounded-full px-2.5 py-0.5 uppercase tracking-wide transition ${
          value === "vi"
            ? "bg-slate-900 text-white"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        VI
      </button>
      <button
        type="button"
        onClick={() => onChange("en")}
        aria-pressed={value === "en"}
        className={`rounded-full px-2.5 py-0.5 uppercase tracking-wide transition ${
          value === "en"
            ? "bg-slate-900 text-white"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        EN
      </button>
    </div>
  );
}
