// src/store/languageProgress.tsx
//
// Progress tracking for the bonus language modules (French, German,
// Japanese, Chinese, Korean, Vietnamese). The full system is wired up — localStorage
// persistence, validation, cross-tab sync, the CompletedMap data
// structure — but no UI calls toggleLesson or isLessonCompleted yet, so
// in production every progress bar reads 0/50.
//
// Two things to know before wiring up a "Mark complete" button:
//
//   1. toggleLesson(lang, lessonId: number) requires numeric IDs.
//      Chinese/Japanese/Korean lessons use numeric ids (1..50). French
//      and German use string ids (e.g. "french_greetings_intro"). Adding
//      the button to French/German pages without first deciding how to
//      map string ids to the 1..50 range will silently fail.
//
//   2. The progress is not synced to a backend — it's localStorage only.
//      A user who clears storage or switches devices loses their progress.
//      Fine for v1; replace with Supabase row-per-user-per-language when
//      account-tied progress matters.
//
// Until the UI button ships, getCompletedCount and getProgressPercent
// will always return 0 / 0%, and the progress bars in LanguageSwitcher
// will show empty.

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

export type LearningLanguage = "french" | "german" | "japanese" | "chinese" | "korean" | "vietnamese" | "spanish";

export const TOTAL_LESSONS_PER_LANGUAGE = 50;

export interface LanguageMeta {
  id: LearningLanguage;
  category: "european" | "asian";
  name: string;
  nameVi: string;
  flag: string;
  totalLessons?: number;
}

export const LANGUAGES: LanguageMeta[] = [
  { id: "french", category: "european", name: "French", nameVi: "Tiếng Pháp", flag: "🇫🇷" },
  { id: "german", category: "european", name: "German", nameVi: "Tiếng Đức", flag: "🇩🇪" },
  { id: "spanish", category: "european", name: "Spanish", nameVi: "Tiếng Tây Ban Nha", flag: "🇪🇸", totalLessons: 110 },
  { id: "japanese", category: "asian", name: "Japanese", nameVi: "Tiếng Nhật", flag: "🇯🇵" },
  { id: "chinese", category: "asian", name: "Chinese", nameVi: "Tiếng Trung", flag: "🇨🇳" },
  { id: "korean", category: "asian", name: "Korean", nameVi: "Tiếng Hàn", flag: "🇰🇷" },
  { id: "vietnamese", category: "asian", name: "Vietnamese", nameVi: "For foreigners", flag: "🇻🇳", totalLessons: 47 },
];

const EUROPEAN = LANGUAGES.filter((l) => l.category === "european");
const ASIAN = LANGUAGES.filter((l) => l.category === "asian");

export { EUROPEAN as EUROPEAN_LANGUAGES, ASIAN as ASIAN_LANGUAGES };

const LS_COMPLETED = "mb.completedLessons";
const LS_SELECTED = "mb.selectedLearningLanguage";

type CompletedMap = Record<LearningLanguage, number[]>;

function defaultCompleted(): CompletedMap {
  return { french: [], german: [], japanese: [], chinese: [], korean: [], vietnamese: [], spanish: [] };
}

function validateIds(ids: unknown): number[] {
  if (!Array.isArray(ids)) return [];
  return ids
    .map(Number)
    .filter(
      (n) => Number.isInteger(n) && n >= 1 && n <= TOTAL_LESSONS_PER_LANGUAGE,
    );
}

function loadCompleted(): CompletedMap {
  try {
    const raw = localStorage.getItem(LS_COMPLETED);
    if (!raw) return defaultCompleted();
    const parsed = JSON.parse(raw);
    const out = defaultCompleted();
    for (const key of Object.keys(out) as LearningLanguage[]) {
      out[key] = validateIds(parsed[key]);
    }
    return out;
  } catch {
    return defaultCompleted();
  }
}

function loadSelected(): LearningLanguage | null {
  try {
    const raw = localStorage.getItem(LS_SELECTED);
    if (!raw) return null;
    const ids = LANGUAGES.map((l) => l.id);
    return ids.includes(raw as LearningLanguage) ? (raw as LearningLanguage) : null;
  } catch {
    return null;
  }
}

export interface LanguageProgressContextValue {
  selectedLanguage: LearningLanguage | null;
  selectLanguage: (lang: LearningLanguage) => void;
  completedLessons: CompletedMap;
  toggleLesson: (lang: LearningLanguage, lessonId: number) => void;
  isLessonCompleted: (lang: LearningLanguage, lessonId: number) => boolean;
  getCompletedCount: (lang: LearningLanguage) => number;
  getProgressPercent: (lang: LearningLanguage) => number;
}

const LanguageProgressContext = createContext<LanguageProgressContextValue | undefined>(
  undefined,
);

export function LanguageProgressProvider({ children }: { children: ReactNode }) {
  const [selectedLanguage, setSelectedLanguage] = useState<LearningLanguage | null>(
    () => loadSelected(),
  );
  const [completedLessons, setCompletedLessons] = useState<CompletedMap>(() =>
    loadCompleted(),
  );

  const selectLanguage = useCallback((lang: LearningLanguage) => {
    setSelectedLanguage(lang);
    try {
      localStorage.setItem(LS_SELECTED, lang);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLesson = useCallback((lang: LearningLanguage, lessonId: number) => {
    if (lessonId < 1 || lessonId > TOTAL_LESSONS_PER_LANGUAGE) return;
    setCompletedLessons((prev) => {
      const current = prev[lang] ?? [];
      const next = current.includes(lessonId)
        ? current.filter((id) => id !== lessonId)
        : [...current, lessonId].sort((a, b) => a - b);
      const updated = { ...prev, [lang]: next };
      try {
        localStorage.setItem(LS_COMPLETED, JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
    });
  }, []);

  const isLessonCompleted = useCallback(
    (lang: LearningLanguage, lessonId: number) => {
      return (completedLessons[lang] ?? []).includes(lessonId);
    },
    [completedLessons],
  );

  const getCompletedCount = useCallback(
    (lang: LearningLanguage) => {
      return (completedLessons[lang] ?? []).length;
    },
    [completedLessons],
  );

  const getProgressPercent = useCallback(
    (lang: LearningLanguage) => {
      const count = (completedLessons[lang] ?? []).length;
      return Math.round((count / TOTAL_LESSONS_PER_LANGUAGE) * 100);
    },
    [completedLessons],
  );

  // Re-sync from localStorage on external changes
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_COMPLETED) setCompletedLessons(loadCompleted());
      if (e.key === LS_SELECTED) setSelectedLanguage(loadSelected());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<LanguageProgressContextValue>(
    () => ({
      selectedLanguage,
      selectLanguage,
      completedLessons,
      toggleLesson,
      isLessonCompleted,
      getCompletedCount,
      getProgressPercent,
    }),
    [
      selectedLanguage,
      selectLanguage,
      completedLessons,
      toggleLesson,
      isLessonCompleted,
      getCompletedCount,
      getProgressPercent,
    ],
  );

  return (
    <LanguageProgressContext.Provider value={value}>
      {children}
    </LanguageProgressContext.Provider>
  );
}

export function useLanguageProgress() {
  const ctx = useContext(LanguageProgressContext);
  if (!ctx) {
    throw new Error(
      "useLanguageProgress must be used within <LanguageProgressProvider>",
    );
  }
  return ctx;
}
