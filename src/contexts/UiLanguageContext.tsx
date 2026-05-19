// src/contexts/UiLanguageContext.tsx
//
// Global gloss / explanation language ("vi" | "en") shared by the app
// chrome toggle (AppHeroShell global band) and every lesson surface
// (Korean/Japanese/Chinese/French/German pages + the mercy-guide
// language tabs).
//
// WHY A CONTEXT (not the prior per-component hook): the old
// useLessonUiLang() was useState + a `storage` event listener. The
// `storage` event does NOT fire in the tab that called setItem — only
// in *other* tabs. So a toggle in the global band could write
// localStorage but would never re-render the language page in the same
// tab. A shared context is the smallest thing that makes one global
// toggle reactively drive all consumers in the same tab.
//
// Persistence: localStorage key `mercyblade.lessonUiLang` — unchanged
// from #427, so an existing user's stored choice carries over. The
// initial value is read synchronously in a lazy useState initializer
// so a stored "en" never flashes "vi" first. Cross-tab sync via the
// `storage` event is retained for multi-tab users.
//
// Default is "vi": every existing user keeps Vietnamese until they
// explicitly toggle EN.

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type UiLanguage = "vi" | "en";

const STORAGE_KEY = "mercyblade.lessonUiLang";

function readStoredLang(): UiLanguage {
  if (typeof window === "undefined") return "vi";
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "vi";
  } catch {
    return "vi";
  }
}

type UiLanguageApi = {
  uiLang: UiLanguage;
  setUiLang: (next: UiLanguage) => void;
};

const Ctx = createContext<UiLanguageApi | null>(null);

export function UiLanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lazy initializer reads localStorage synchronously — no vi→en flash.
  const [uiLang, setUiLangState] = useState<UiLanguage>(() =>
    readStoredLang(),
  );

  // Same-tab reactivity comes from the context itself; this listener
  // only keeps *other* tabs/windows of the same browser in sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      setUiLangState(e.newValue === "en" ? "en" : "vi");
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Keep `<html lang>` in sync with the active UI language. index.html
  // ships a static `lang="en"` (correct pre-hydration default for
  // crawlers); without this, that "en" survives even when the chrome is
  // Vietnamese, so screen readers pronounce every VI string with an
  // English voice. This provider wraps the router (see main.tsx) and is
  // the single reactive owner of uiLang, so this is the one place that
  // owns the document-level lang attribute for the interactive app.
  // (The 8 static SEO landing pages set their own lang via SeoMeta and
  // restore the prior value on unmount — left untouched.)
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = uiLang;
  }, [uiLang]);

  const api = useMemo<UiLanguageApi>(
    () => ({
      uiLang,
      setUiLang: (next: UiLanguage) => {
        setUiLangState(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          // Storage disabled (private mode / quota) — in-memory state
          // still works for the current session.
        }
      },
    }),
    [uiLang],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useUiLanguage(): UiLanguageApi {
  const v = useContext(Ctx);
  if (!v) {
    throw new Error("useUiLanguage must be used inside UiLanguageProvider");
  }
  return v;
}
