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

export type OnboardingStepId =
  | "welcome"
  | "native"
  | "target"
  | "start_with"
  | "confirmation";

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
 *  only when >1 target chosen (see OnboardingPage's nextStep). The
 *  goal/profession/level steps were removed as unreachable dead UI
 *  (pair-pick → home since #598). The OnboardingGoal/Profession/Level
 *  types + the profiles columns they map to are intentionally KEPT —
 *  still a live data contract (MercyGuide / DailyCoach read
 *  english_level; columns privilege-frozen per #578). */
export const ONBOARDING_STEPS: OnboardingStepId[] = [
  "welcome",
  "native",
  "target",
  "start_with",
  "confirmation",
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
  partial: { vi: "Nội dung giới hạn", en: "Limited content" },
  skeletal: { vi: "Nội dung giới hạn", en: "Limited content" },
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
  finish:   { vi: "Hoàn tất", en: "Finish" },
  /** Honesty/recommendation badges on the target grid. Rendered in the
   *  chrome language (single), not bilingual. */
  recommended: { vi: "Gợi ý", en: "Recommended" },
  /** Confirmation-screen field labels. Were hardcoded bilingual
   *  ("Tiếng mẹ đẻ · Native:"); now picked single by chrome language. */
  summary: {
    native:     { vi: "Tiếng mẹ đẻ", en: "Native language" },
    learning:   { vi: "Học", en: "Learning" },
  },
  /** Inline error shown if the Supabase write blips (still navigates). */
  finishError: {
    vi: "Đã xảy ra lỗi nhỏ — Mercy vẫn đưa bạn đến bài học.",
    en: "A small error occurred — Mercy is still taking you to your lesson.",
  },
  welcome: {
    title: { vi: "Chào bạn — mình là Mercy.", en: "Hi — I'm Mercy." },
    body: {
      vi: "Trong 60 giây, mình muốn hiểu bạn một chút để chọn lộ trình học cho phù hợp. Bạn có thể bỏ qua bất kỳ bước nào — không sao cả.",
      en: "In 60 seconds, I'd like to understand you a little so I can set up a learning path that fits. You can skip any step — that's totally fine.",
    },
    cta: { vi: "Bắt đầu", en: "Let's start" },
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
      vi: "Mercy sẽ mở ngôn ngữ này trước — những ngôn ngữ kia vẫn luôn ở đó.",
      en: "Mercy will open this one first — the others stay available.",
    },
  },
    confirmation: {
    title: { vi: "Đã sẵn sàng!", en: "All set!" },
    body: {
      vi: "Mercy đã chuẩn bị lộ trình học cho bạn. Bạn có thể đổi bất cứ lúc nào trong phần Cài đặt.",
      en: "Mercy has set up your learning path. You can change anything anytime in Settings.",
    },
  },
} as const;
