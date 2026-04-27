// src/lib/onboarding/types.ts
//
// Shared types + bilingual copy for the onboarding flow.
//
// Tone discipline:
//   - VI primary, EN secondary in lighter weight
//   - Mercy's voice: warm, encouraging, like a kind teacher
//   - No shame language: "trình độ thấp" → "mới bắt đầu"
//   - Avoid "phải" (must) — use "bạn có thể" (you can)

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
  | "goal"
  | "profession"
  | "level"
  | "confirmation";

export interface OnboardingDraft {
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

/** Five onboarding steps in display order. */
export const ONBOARDING_STEPS: OnboardingStepId[] = [
  "welcome",
  "goal",
  "profession",
  "level",
  "confirmation",
];

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
      vi: "Trong 60 giây, mình muốn hiểu bạn một chút để chọn bài học đầu tiên cho phù hợp. Bạn có thể bỏ qua bất kỳ bước nào — không sao cả.",
      en: "In 60 seconds, I'd like to understand you a little so I can pick a first lesson that fits. You can skip any step — that's totally fine.",
    },
    cta: { vi: "Bắt đầu", en: "Let's start" },
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
      vi: "Mercy đã chọn bài đầu tiên cho bạn dựa trên các câu trả lời. Bạn có thể đổi sau trong phần Cài đặt.",
      en: "Mercy has picked your first lesson based on your answers. You can change anything later in Settings.",
    },
  },
} as const;
