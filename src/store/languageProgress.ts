import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export type LearningLanguage = "french" | "german" | "japanese" | "chinese" | "korean";

export interface LanguageMeta {
  id: LearningLanguage;
  category: "european" | "asian";
  name: string;
  nameVi: string;
  flag: string;
}

export const LANGUAGES: LanguageMeta[] = [
  { id: "french", category: "european", name: "French", nameVi: "Tiếng Pháp", flag: "🇫🇷" },
  { id: "german", category: "european", name: "German", nameVi: "Tiếng Đức", flag: "🇩🇪" },
  { id: "japanese", category: "asian", name: "Japanese", nameVi: "Tiếng Nhật", flag: "🇯🇵" },
  { id: "chinese", category: "asian", name: "Chinese", nameVi: "Tiếng Trung", flag: "🇨🇳" },
  { id: "korean", category: "asian", name: "Korean", nameVi: "Tiếng Hàn", flag: "🇰🇷" },
];

const EUROPEAN = LANGUAGES.filter((l) => l.category === "european");
const ASIAN = LANGUAGES.filter((l) => l.category === "asian");

export { EUROPEAN as EUROPEAN_LANGUAGES, ASIAN as ASIAN_LANGUAGES };

const LS_PROGRESS = "mb.languageProgress";
const LS_SELECTED = "mb.selectedLearningLanguage";

function defaultProgress(): Record<LearningLanguage, number> {
  return { french: 0, german: 0, japanese: 0, chinese: 0, korean: 0 };
}

function loadProgress(): Record<LearningLanguage, number> {
  try {
    const raw = localStorage.getItem(LS_PROGRESS);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    const out = defaultProgress();
    for (const key of Object.keys(out) as LearningLanguage[]) {
      const v = Number(parsed[key]);
      out[key] = Number.isFinite(v) ? Math.max(0, Math.min(100, Math.round(v))) : 0;
    }
    return out;
  } catch {
    return defaultProgress();
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

interface LanguageProgressContextValue {
  selectedLanguage: LearningLanguage | null;
  progress: Record<LearningLanguage, number>;
  selectLanguage: (lang: LearningLanguage) => void;
  setProgress: (lang: LearningLanguage, pct: number) => void;
}

const LanguageProgressContext = createContext<LanguageProgressContextValue | undefined>(
  undefined,
);

export function LanguageProgressProvider({ children }: { children: ReactNode }) {
  const [selectedLanguage, setSelectedLanguage] = useState<LearningLanguage | null>(
    () => loadSelected(),
  );
  const [progress, setProgressState] = useState<Record<LearningLanguage, number>>(() =>
    loadProgress(),
  );

  const selectLanguage = useCallback((lang: LearningLanguage) => {
    setSelectedLanguage(lang);
    try {
      localStorage.setItem(LS_SELECTED, lang);
    } catch {
      /* ignore */
    }
  }, []);

  const setProgress = useCallback((lang: LearningLanguage, pct: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(pct)));
    setProgressState((prev) => {
      const next = { ...prev, [lang]: clamped };
      try {
        localStorage.setItem(LS_PROGRESS, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  // Re-sync from localStorage on external changes
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_PROGRESS) setProgressState(loadProgress());
      if (e.key === LS_SELECTED) setSelectedLanguage(loadSelected());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <LanguageProgressContext.Provider
      value={{ selectedLanguage, progress, selectLanguage, setProgress }}
    >
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
