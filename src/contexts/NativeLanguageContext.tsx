// src/contexts/NativeLanguageContext.tsx
//
// The learner's *native* language ("which L1 they think in") — the axis
// the lesson pedagogy prose is authored for. DISTINCT from the UI-chrome
// language in UiLanguageContext, even though both are "vi"|"en" today and
// most users keep them aligned. The selection seam this provider feeds
// lives in src/components/languages/nativeContent.ts.
//
// Phase 2 / Option C: pure plumbing. Today every real user resolves to
// "vi" (there is no UI to change it yet — see RECON-schema-generalize.md
// §5). This provider exists so PR-A2 can route pedagogy selection through
// a native axis with no behavior change, and so the eventual
// N-native-language work has one reactive source.
//
// Persistence/reactivity intentionally mirror UiLanguageContext exactly
// (lazy synchronous init so a stored choice never flashes the default;
// same-tab reactivity via the context; cross-tab sync via the `storage`
// event, which does NOT fire in the writing tab). localStorage key:
// `mercyblade.nativeLang` — separate from `mercyblade.lessonUiLang` so the
// two axes can diverge once a real native-language picker ships.

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { NativeLang } from "@/components/languages/nativeContent";

const STORAGE_KEY = "mercyblade.nativeLang";

function readStoredNativeLang(): NativeLang {
  if (typeof window === "undefined") return "vi";
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "vi";
  } catch {
    return "vi";
  }
}

type NativeLanguageApi = {
  nativeLang: NativeLang;
  setNativeLang: (next: NativeLang) => void;
};

const Ctx = createContext<NativeLanguageApi | null>(null);

export function NativeLanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lazy initializer reads localStorage synchronously — no vi→en flash.
  const [nativeLang, setNativeLangState] = useState<NativeLang>(() =>
    readStoredNativeLang(),
  );

  // Same-tab reactivity comes from the context itself; this listener only
  // keeps *other* tabs/windows of the same browser in sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      setNativeLangState(e.newValue === "en" ? "en" : "vi");
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const api = useMemo<NativeLanguageApi>(
    () => ({
      nativeLang,
      setNativeLang: (next: NativeLang) => {
        setNativeLangState(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          // Storage disabled (private mode / quota) — in-memory state
          // still works for the current session.
        }
      },
    }),
    [nativeLang],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useNativeLanguage(): NativeLanguageApi {
  const v = useContext(Ctx);
  if (!v) {
    throw new Error(
      "useNativeLanguage must be used inside NativeLanguageProvider",
    );
  }
  return v;
}
