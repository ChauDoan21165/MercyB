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
//
// PROFILE HYDRATION (Duolingo-onboarding PR 1): the source of truth for
// native_language is now `profiles.native_language`; localStorage is
// demoted to a synchronous *cache* that seeds state with no flash before
// the profile query resolves. When the profile row carries a valid
// 'vi'|'en'|'ja'|'id'|'th'|'th'|'th' (i.e. the user has completed pair-selection onboarding) it
// wins and is written back to the cache. A NULL/absent native_language
// (the user still owes onboarding) is left untouched — state stays at
// the cached/default 'vi', which the nativeContent seam already resolves
// to, so this remains a zero-behavior-change wiring until PR 2/3 add
// consumers. Provider is mounted inside AuthProvider + QueryClientProvider
// (see main.tsx), so useAuth()/useProfileQuery() are safe here.

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { NativeLang } from "@/components/languages/nativeContent";
import { useAuth } from "@/providers/AuthProvider";
import { useProfileQuery } from "@/lib/queries/useProfileQuery";

const STORAGE_KEY = "mercyblade.nativeLang";

function isNativeLang(raw: unknown): raw is NativeLang {
  return raw === "vi" || raw === "en" || raw === "ja" || raw === "id" || raw === "th" || raw === "ur";
}

function readStoredNativeLang(): NativeLang {
  if (typeof window === "undefined") return "vi";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isNativeLang(stored) ? stored : "vi";
  } catch {
    return "vi";
  }
}

function persistNativeLang(next: NativeLang): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Storage disabled (private mode / quota) — in-memory state still
    // works for the current session.
  }
}

/**
 * Narrow a raw `profiles.native_language` value to a NativeLang, or null
 * when it is absent / SQL NULL / not one of the two authored audiences —
 * i.e. the user has not completed pair-selection onboarding yet, so the
 * profile must NOT override the local default (keeps behavior unchanged
 * and the `native_language IS NULL` onboarding gate meaningful).
 */
function normalizeNativeLang(raw: unknown): NativeLang | null {
  return isNativeLang(raw) ? raw : null;
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
      setNativeLangState(isNativeLang(e.newValue) ? e.newValue : "vi");
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Hydrate from the profile row — the source of truth. useProfileQuery
  // shares the app-wide cache key qk.profile(userId), so this adds no
  // extra network round-trip (every other reader already populates it).
  // A valid 'vi'|'en'|'ja'|'id'|'th'|'th'|'th' from the profile overrides the localStorage seed
  // and refreshes the cache; a NULL/absent value (onboarding still owed)
  // is ignored, so state stays at the cached/default 'vi' and behavior is
  // unchanged until PR 2/3 add real consumers. Effect depends only on the
  // profile value so a legitimate same-session setNativeLang() is not
  // fought back; setting state to an equal value is a React no-op.
  const { user } = useAuth();
  const { data: profile } = useProfileQuery(user?.id ?? null);
  const profileNativeLang = normalizeNativeLang(profile?.native_language);

  useEffect(() => {
    if (!profileNativeLang) return;
    setNativeLangState(profileNativeLang);
    persistNativeLang(profileNativeLang);
  }, [profileNativeLang]);

  const api = useMemo<NativeLanguageApi>(
    () => ({
      nativeLang,
      setNativeLang: (next: NativeLang) => {
        setNativeLangState(next);
        persistNativeLang(next);
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
