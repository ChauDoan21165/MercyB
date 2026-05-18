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
  | "goal"
  | "profession"
  | "level"
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

/** All onboarding steps in canonical display order. Some are
 *  conditionally skipped at runtime (see OnboardingPage's nextStep):
 *  - native/target are always shown to new users
 *  - start_with only when >1 target chosen
 *  - goal/profession/level only when the primary target is English
 *    (these capture English-specific exam/career intent; nonsensical
 *    for a vi→ja learner) — preserves the (vi,en) experience unchanged
 *    per locked #14. */
export const ONBOARDING_STEPS: OnboardingStepId[] = [
  "welcome",
  "native",
  "target",
  "start_with",
  "goal",
  "profession",
  "level",
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

/** Goal options shown on step 2. Order is intentional — career first
 *  because the profession-pack content is MercyBlade's strongest
 *  vertical, then exam tracks (largest VN cohort), then general. */
export const GOAL_OPTIONS: Array<{
  value: OnboardingGoal;
  label: BilingualLabel;
  /** Short emoji or icon hint — purely decorative. */
  icon: string;
  description: BilingualLabel;
}> = [
  {
    value: "career",
    icon: "💼",
    label: { vi: "Đi làm", en: "Career" },
    description: {
      vi: "Tiếng Anh cho công việc — nói chuyện với khách, đồng nghiệp, sếp.",
      en: "English for your job — customers, colleagues, your boss.",
    },
  },
  {
    value: "ielts",
    icon: "🎓",
    label: { vi: "Luyện IELTS", en: "IELTS prep" },
    description: {
      vi: "Học để thi IELTS — du học, định cư, thăng tiến.",
      en: "Prepare for IELTS — study abroad, migration, promotion.",
    },
  },
  {
    value: "vstep",
    icon: "🇻🇳",
    label: { vi: "Luyện VSTEP", en: "VSTEP prep" },
    description: {
      vi: "Kỳ thi tiếng Anh quốc gia — tốt nghiệp, công chức, viên chức.",
      en: "National English exam — graduation, civil service.",
    },
  },
  {
    value: "toeic",
    icon: "🏢",
    label: { vi: "Luyện TOEIC", en: "TOEIC prep" },
    description: {
      vi: "Tiếng Anh công sở — yêu cầu của nhiều công ty Việt Nam.",
      en: "Workplace English — required by many Vietnamese employers.",
    },
  },
  {
    value: "travel",
    icon: "✈️",
    label: { vi: "Đi du lịch", en: "Travel" },
    description: {
      vi: "Nói được khi đi nước ngoài — sân bay, khách sạn, nhà hàng.",
      en: "Speak when travelling — airport, hotel, restaurant.",
    },
  },
  {
    value: "general",
    icon: "🌱",
    label: { vi: "Học chung", en: "General learning" },
    description: {
      vi: "Mình muốn giỏi tiếng Anh hơn — chưa có mục tiêu cụ thể, không sao.",
      en: "Just want to improve my English — no specific goal, that's fine.",
    },
  },
];

/** Profession options shown on step 3 (only when goal = career). */
export const PROFESSION_OPTIONS: Array<{
  value: OnboardingProfession;
  label: BilingualLabel;
  icon: string;
}> = [
  { value: "restaurant",       icon: "🍜", label: { vi: "Nhà hàng / Quán ăn", en: "Restaurant" } },
  { value: "nail_tech",        icon: "💅", label: { vi: "Thợ nail",            en: "Nail technician" } },
  { value: "customer_service", icon: "🎧", label: { vi: "Chăm sóc khách hàng",  en: "Customer service" } },
  { value: "healthcare",       icon: "🩺", label: { vi: "Y tế / Điều dưỡng",   en: "Healthcare" } },
  { value: "tech",             icon: "💻", label: { vi: "Công nghệ / IT",      en: "Tech worker" } },
  { value: "driver",           icon: "🚗", label: { vi: "Tài xế / Vận tải",    en: "Driver / transport" } },
  { value: "hospitality",      icon: "🏨", label: { vi: "Khách sạn / Du lịch", en: "Hospitality" } },
  { value: "other",            icon: "✨", label: { vi: "Nghề khác",            en: "Other" } },
];

/** Level options shown on step 4. NO SHAME LANGUAGE — "mới bắt đầu"
 *  not "trình độ thấp"; "đã giỏi" not "khá cao". */
export const LEVEL_OPTIONS: Array<{
  value: OnboardingLevel;
  label: BilingualLabel;
  description: BilingualLabel;
}> = [
  {
    value: "beginner",
    label: { vi: "Mới bắt đầu", en: "Just starting" },
    description: {
      vi: "Mình mới học, chưa nói được nhiều câu — không sao, ai cũng bắt đầu từ đây.",
      en: "I'm just starting and can't say much yet — that's fine, everyone starts here.",
    },
  },
  {
    value: "elementary",
    label: { vi: "Đang xây nền", en: "Building basics" },
    description: {
      vi: "Mình đã biết một ít — chào hỏi, vài câu đơn giản trong cuộc sống hàng ngày.",
      en: "I know some basics — greetings, simple daily phrases.",
    },
  },
  {
    value: "intermediate",
    label: { vi: "Đang phát triển", en: "Getting fluent" },
    description: {
      vi: "Mình nói chuyện được, nhưng còn ngại sai và cần luyện thêm trôi chảy.",
      en: "I can hold a conversation but still hesitate and want to be smoother.",
    },
  },
  {
    value: "advanced",
    label: { vi: "Đã giỏi rồi", en: "Already advanced" },
    description: {
      vi: "Mình tự tin rồi — chỉ muốn polish thêm để tự nhiên hơn nữa.",
      en: "I'm confident — I just want to polish toward natural fluency.",
    },
  },
];

/** Top-level page copy. */
export const ONBOARDING_COPY = {
  pageTitle: { vi: "Chào bạn!", en: "Welcome!" },
  skipLink: { vi: "Bỏ qua", en: "Skip" },
  back:     { vi: "Quay lại", en: "Back" },
  continue: { vi: "Tiếp tục", en: "Continue" },
  finish:   { vi: "Hoàn tất", en: "Finish" },
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
  goal: {
    title: { vi: "Bạn học tiếng Anh để làm gì?", en: "What do you want English for?" },
    body: {
      vi: "Chọn cái gần nhất với mình — bạn có thể đổi sau.",
      en: "Pick the closest one — you can change it later.",
    },
  },
  profession: {
    title: { vi: "Bạn làm nghề gì?", en: "What's your job?" },
    body: {
      vi: "Mercy có bộ bài học riêng cho từng nghề — chọn cái gần nhất.",
      en: "Mercy has lesson packs for specific jobs — pick the closest one.",
    },
  },
  level: {
    title: { vi: "Trình độ tiếng Anh hiện tại của bạn?", en: "Your current English level?" },
    body: {
      vi: "Không có câu trả lời sai — Mercy chỉ muốn chọn bài phù hợp.",
      en: "No wrong answer — Mercy just wants to pick the right starting point.",
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
