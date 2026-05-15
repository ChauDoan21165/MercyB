// src/components/mercy-guide/tabs/LessonUiLangToggle.tsx
//
// Shared VI/EN toggle for the per-language lesson tabs. Owns the state
// and the localStorage persistence so each parent tab can stay a thin
// wrapper. Default is "vi"; the toggle is local-only for v1 (no Supabase
// profile sync).

import { useEffect, useState } from "react";

import type { LessonUiLang } from "./LanguageLessonsView";

const STORAGE_KEY = "mercyblade.lessonUiLang";

function readStoredLang(): LessonUiLang {
  if (typeof window === "undefined") return "vi";
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "en" ? "en" : "vi";
  } catch {
    return "vi";
  }
}

export function useLessonUiLang(): [LessonUiLang, (next: LessonUiLang) => void] {
  // Read synchronously on mount so the first render matches what's stored.
  const [lang, setLangState] = useState<LessonUiLang>(() => readStoredLang());

  // Sync across tabs/windows in the same browser.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      setLangState(e.newValue === "en" ? "en" : "vi");
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setLang = (next: LessonUiLang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage may be disabled (private mode / quota); state still works
      // for the current session.
    }
  };

  return [lang, setLang];
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
