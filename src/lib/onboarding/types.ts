// src/lib/onboarding/types.ts
//
// Shared types + bilingual copy for the onboarding flow.
//
// Tone discipline:
//   - VI primary, EN secondary in lighter weight
//   - Mercy's voice: warm, encouraging, like a kind teacher
//   - No shame language: "trình độ thấp" → "mới bắt đầu"
//   - Avoid "phải" (must) — use "bạn có thể" (you can)

import type { NativeLang } from "@/components/languages/nativeContent";

/** The eight target languages a user can learn (matches the
 *  profiles.target_languages CHECK domain in migration
 *  20260615000000). STRATEGY.md v3.0 §4 — 2 native × 8 target. */
export type TargetLang =
  | "en"
  | "ja"
  | "ko"
  | "zh"
  | "fr"
  | "de"
  | "es"
  | "vi";

/** Per-pair content readiness for a chosen native. Source of truth:
 *  reports/RECON-content-readiness-matrix.md (canonical, Chau-ratified).
 *  Drives the honesty badge on the target menu (locked #7). */
export type ContentReadiness = "full" | "partial" | "skeletal";

export type { NativeLang };

export type OnboardingGoal =
  | "career"
  | "travel"
  | "ielts"
  | "vstep"
  | "toeic"
  | "general";

export type OnboardingProfession =
  | "restaurant"
  | "nail_tech"
  | "customer_service"
  | "healthcare"
  | "tech"
  | "driver"
  | "hospitality"
  | "other";

export type OnboardingLevel =
  | "beginner"
  | "elementary"
  | "intermediate"
  | "advanced";

// The picker is now a flat 3-step FSM. The `welcome` interstitial and
// `confirmation` echo screen were removed as guaranteed dead clicks
// (A32 audit 2026-05-18 — they collected nothing and only added taps
// between the landing CTA and the actual app). Mercy's greeting is now
// inlined into the entry step header (ONBOARDING_COPY.greeting); finish
// happens straight off the last pick (single-target Continue / the
// start_with tap) — no separate confirmation screen.
export type OnboardingStepId = "native" | "target" | "start_with";

export interface OnboardingDraft {
  /** L1 the lesson pedagogy is authored for. Persisted to
   *  profiles.native_language. NULL until the user picks. */
  native_language: NativeLang | null;
  /** Ordered list of chosen target languages — index 0 is the primary
   *  (the one onboarding routes into first). Persisted to
   *  profiles.target_languages. */
  target_languages: TargetLang[];
  primary_goal: OnboardingGoal | null;
  profession: OnboardingProfession | null;
  english_level: OnboardingLevel | null;
}

export interface BilingualLabel {
  vi: string;
  en: string;
}

export interface BilingualCopy extends BilingualLabel {
  /** Optional one-line subhead — VI only, lighter weight. */
  vi_sub?: string;
}

/** Onboarding steps in canonical display order. start_with is shown
 *  only when >1 target chosen (see OnboardingPage's nextStep); a
 *  single-target pick finishes straight off `target`. `welcome` and
 *  `confirmation` were removed as dead clicks (A32 audit). The
 *  goal/profession/level steps were already removed as unreachable dead
 *  UI (pair-pick → home since #598). The OnboardingGoal/Profession/Level
 *  types + the profiles columns they map to are intentionally KEPT —
 *  still a live data contract (MercyGuide / DailyCoach read
 *  english_level; columns privilege-frozen per #578). */
export const ONBOARDING_STEPS: OnboardingStepId[] = [
  "native",
  "target",
  "start_with",
];

/** Native-language options (Screen 1). Both shown — en-native is
 *  greenlit (STRATEGY v3.0 §4 / RECON-content-readiness-matrix.md
 *  decision 3). vi first: the ~95% home market. */
export const NATIVE_OPTIONS: Array<{
  value: NativeLang;
  label: BilingualLabel;
  icon: string;
}> = [
  { value: "vi", icon: "🇻🇳", label: { vi: "Tiếng Việt", en: "Vietnamese" } },
  { value: "en", icon: "🇬🇧", label: { vi: "Tiếng Anh", en: "English" } },
];

export interface TargetMeta {
  labelVi: string;
  labelEn: string;
  flag: string;
  /** /languages/{slug} route for the language track; null for English
   *  (delivered via the rooms / exam-prep mission corpus, not a
   *  /languages page — routed through pickFirstLesson instead). */
  slug: string | null;
}

/** Display + routing metadata per target language. Labels mirror the
 *  store LANGUAGES meta (src/store/languageProgress.tsx); slugs match
 *  the /languages/{slug} routes in AppRouter. */
export const TARGET_META: Record<TargetLang, TargetMeta> = {
  en: { labelVi: "Tiếng Anh",          labelEn: "English",    flag: "🇬🇧", slug: null },
  ja: { labelVi: "Tiếng Nhật",         labelEn: "Japanese",   flag: "🇯🇵", slug: "japanese" },
  ko: { labelVi: "Tiếng Hàn",          labelEn: "Korean",     flag: "🇰🇷", slug: "korean" },
  zh: { labelVi: "Tiếng Trung",        labelEn: "Chinese",    flag: "🇨🇳", slug: "chinese" },
  fr: { labelVi: "Tiếng Pháp",         labelEn: "French",     flag: "🇫🇷", slug: "french" },
  de: { labelVi: "Tiếng Đức",          labelEn: "German",     flag: "🇩🇪", slug: "german" },
  es: { labelVi: "Tiếng Tây Ban Nha",  labelEn: "Spanish",    flag: "🇪🇸", slug: "spanish" },
  vi: { labelVi: "Tiếng Việt",         labelEn: "Vietnamese", flag: "🇻🇳", slug: "vietnamese" },
};

/** Target-language display name in the chrome language. The chrome
 *  follows the learner's native choice (vi-native → Vietnamese names,
 *  en-native → English names) — no more hardcoded `.labelVi`. */
export function targetLabel(t: TargetLang, lang: NativeLang): string {
  const m = TARGET_META[t];
  return lang === "en" ? m.labelEn : m.labelVi;
}

export interface TargetMenuItem {
  value: TargetLang;
  readiness: ContentReadiness;
  /** Pre-selected + the skip default for this native. */
  recommended?: boolean;
  /** Explicit badge override; otherwise derived from readiness. */
  badge?: BilingualLabel;
}

/**
 * Target menu per native language. SOURCE OF TRUTH:
 * reports/RECON-content-readiness-matrix.md §4 (canonical,
 * Chau-ratified). Verified cell-by-cell per locked #15. Per-native
 * filtering (Spanish absent from the vi menu — decision 2; English
 * absent everywhere as a target it is the implicit vi→en flagship and
 * en cannot be its own target) is APPLICATION logic here, not a DB
 * constraint, so future pairs need no migration.
 */
export const TARGET_MENU: Record<NativeLang, TargetMenuItem[]> = {
  vi: [
    { value: "en", readiness: "full", recommended: true },
    { value: "ja", readiness: "full" },
    { value: "fr", readiness: "full" },
    { value: "de", readiness: "full" },
    { value: "ko", readiness: "partial" },
    {
      value: "zh",
      readiness: "skeletal",
      badge: { vi: "Hiện chỉ có B2–C2", en: "B2–C2 only for now" },
    },
    // 'es' intentionally excluded for vi-native (decision 2): the
    // Spanish track is hardcoded EN-native; serving it to a vi-native
    // user would render English pedagogy → violates non-negotiable #1.
  ],
  en: [
    { value: "es", readiness: "full", recommended: true },
    { value: "zh", readiness: "full" },
    { value: "fr", readiness: "full" },
    { value: "de", readiness: "full" },
    { value: "ja", readiness: "partial" },
    { value: "ko", readiness: "partial" },
    { value: "vi", readiness: "partial" },
  ],
};

/** Skip default + the pre-checked recommendation per native (Phase 3
 *  step 3 / RECON §4). */
export const RECOMMENDED_TARGET: Record<NativeLang, TargetLang> = {
  vi: "en",
  en: "es",
};

/** Default honesty badge by readiness (locked #7). full ⇒ none; a
 *  per-item `badge` overrides this (e.g. vi→zh "B2–C2 only for now"). */
export const READINESS_BADGE: Record<
  ContentReadiness,
  BilingualLabel | null
> = {
  full: null,
  // "Nội dung còn hạn chế" reads as natural Northern VI; the literal
  // "Nội dung giới hạn" (← "Limited content") was mild translationese
  // (A32 audit §2). EN side unchanged.
  partial: { vi: "Nội dung còn hạn chế", en: "Limited content" },
  skeletal: { vi: "Nội dung còn hạn chế", en: "Limited content" },
};

/** Resolve the badge to show for a menu item: explicit override first,
 *  else the readiness default. Never promises full A1–C2 for a
 *  non-🟢 cell (locked #7). */
export function targetBadge(item: TargetMenuItem): BilingualLabel | null {
  return item.badge ?? READINESS_BADGE[item.readiness];
}

// GOAL_OPTIONS / PROFESSION_OPTIONS / LEVEL_OPTIONS were removed with
// the unreachable goal/profession/level picker UI (dead since #598).
// The OnboardingGoal/Profession/Level *types* + OnboardingDraft fields
// are kept — they map to live profiles columns (MercyGuide/DailyCoach).

/** Top-level page copy. */
export const ONBOARDING_COPY = {
  pageTitle: { vi: "Chào bạn!", en: "Welcome!" },
  skipLink: { vi: "Bỏ qua", en: "Skip" },
  back:     { vi: "Quay lại", en: "Back" },
  continue: { vi: "Tiếp tục", en: "Continue" },
  /** Honesty/recommendation badges on the target grid. Rendered in the
   *  chrome language (single), not bilingual. */
  recommended: { vi: "Gợi ý", en: "Recommended" },
  /** Inline error shown if the Supabase write blips (still navigates). */
  finishError: {
    vi: "Đã xảy ra lỗi nhỏ — Mercy vẫn đưa bạn đến bài học.",
    en: "A small error occurred — Mercy is still taking you to your lesson.",
  },
  /** One short warm line inlined into the ENTRY step header (replaces
   *  the old standalone `welcome` interstitial — A32 audit). Drops the
   *  stale "60 giây / hiểu bạn" personalization promise (#598 removed
   *  the goal/profession/level survey it referred to); keeps only the
   *  true, warm part so Mercy's persona handoff survives without a
   *  dead click. */
  greeting: {
    vi: "Chào bạn — mình là Mercy 👋",
    en: "Hi — I'm Mercy 👋",
  },
  native: {
    title: {
      vi: "Tiếng mẹ đẻ của bạn là gì?",
      en: "What's your native language?",
    },
    body: {
      vi: "Mercy sẽ giải thích bài học bằng ngôn ngữ này.",
      en: "Mercy will explain your lessons in this language.",
    },
  },
  target: {
    title: {
      vi: "Bạn muốn học ngôn ngữ nào?",
      en: "What do you want to learn?",
    },
    body: {
      vi: "Chọn một hoặc nhiều — bạn có thể thêm hoặc bớt sau trong Cài đặt.",
      en: "Pick one or more — you can add or remove any later in Settings.",
    },
  },
  startWith: {
    title: {
      vi: "Bạn muốn bắt đầu với ngôn ngữ nào?",
      en: "Which would you like to start with?",
    },
    body: {
      // "vẫn luôn sẵn sàng" reads as natural VI; the literal "vẫn luôn
      // ở đó" (← "still always there") was mild translationese (A32
      // audit §2). EN side unchanged.
      vi: "Mercy sẽ mở ngôn ngữ này trước — những ngôn ngữ khác vẫn luôn sẵn sàng.",
      en: "Mercy will open this one first — the others stay available.",
    },
  },
} as const;
