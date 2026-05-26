// src/components/LessonUiLangToggle.tsx
//
// Shared VI/EN toggle UI for lesson surfaces. As of the global-toggle
// work the state + localStorage persistence moved to the app-wide
// UiLanguageProvider context (src/contexts/UiLanguageContext.tsx) so a
// single toggle in the global chrome band drives every language page
// reactively in the same tab. `useLessonUiLang()` is kept as a thin
// shim over the context with its original [lang, setLang] signature so
// existing call sites compile unchanged.
//
// CORRECTLY FILED HERE (NOT under src/components/mercy-guide/tabs/):
// this is a shared toggle used by the global chrome (AppRouter) and 8
// language surfaces; it has no Mercy-guide runtime deps — only
// useUiLanguage + a type. The vite.config.ts manualChunks rule buckets
// anything under `/mercy-guide/` into the chunk it *names* `mercy-guide`,
// and AppRouter imports this eagerly, so living there put a global-chrome
// component in a Mercy-namespaced chunk — a one-owner-per-function smell.
//
// NOTE for future perf work: the bundle visualizer shows that
// `mercy-guide` chunk is mostly the *shared app core* (supabaseClient,
// AuthProvider, lazyWithRetry, captureException, lib/queries/*) that
// main.tsx requires eagerly — it is modulepreloaded because the entry
// genuinely needs it, NOT because of this file. Moving this file out
// does NOT shrink the initial bundle (verified: eager JS unchanged); the
// mobile-audit cat3 §3 "~39 KB mercy-guide preload waste" was a misread
// of that chunk's misleading name. Keep this file here for hygiene; do
// not expect a byte saving from its location.

import { useUiLanguage } from "@/contexts/UiLanguageContext";
import type { LessonUiLang } from "@/components/mercy-guide/tabs/LanguageLessonsView";

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
