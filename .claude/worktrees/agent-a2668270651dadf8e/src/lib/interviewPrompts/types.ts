// Shared types + constants for community interview prompts. Mirrors
// the enums + columns in supabase/migrations/20260534000000_user_interview_prompts.sql.

export type InterviewPromptStatus =
  | "pending"
  | "approved"
  | "published"
  | "rejected";

export type InterviewPromptDifficulty = "easy" | "medium" | "hard";

export type InterviewPromptQuestionType =
  | "behavioral"
  | "technical"
  | "situational"
  | "culture_fit"
  | "salary"
  | "open_ended";

export type InterviewPromptVoteType = "up" | "flag";

export type InterviewPromptProfession =
  | "nail-tech"
  | "restaurant"
  | "customer-service"
  | "healthcare"
  | "tech-worker"
  | "hospitality"
  | "drivers";

export const INTERVIEW_PROMPT_PROFESSIONS: ReadonlyArray<InterviewPromptProfession> = [
  "nail-tech",
  "restaurant",
  "customer-service",
  "healthcare",
  "tech-worker",
  "hospitality",
  "drivers",
];

export const INTERVIEW_PROMPT_DIFFICULTIES: ReadonlyArray<InterviewPromptDifficulty> = [
  "easy",
  "medium",
  "hard",
];

export const INTERVIEW_PROMPT_QUESTION_TYPES: ReadonlyArray<InterviewPromptQuestionType> = [
  "behavioral",
  "technical",
  "situational",
  "culture_fit",
  "salary",
  "open_ended",
];

export const PROFESSION_LABELS_VI: Record<InterviewPromptProfession, string> = {
  "nail-tech": "Thợ nail",
  restaurant: "Nhà hàng / phục vụ",
  "customer-service": "Chăm sóc khách hàng",
  healthcare: "Y tế / điều dưỡng",
  "tech-worker": "Công nghệ / IT",
  hospitality: "Khách sạn / du lịch",
  drivers: "Tài xế / rideshare",
};

export const PROFESSION_LABELS_EN: Record<InterviewPromptProfession, string> = {
  "nail-tech": "Nail technician",
  restaurant: "Restaurant / waitstaff",
  "customer-service": "Customer service",
  healthcare: "Healthcare / nursing",
  "tech-worker": "Tech / IT",
  hospitality: "Hospitality / hotel",
  drivers: "Driver / rideshare",
};

export const DIFFICULTY_LABELS_VI: Record<InterviewPromptDifficulty, string> = {
  easy: "Dễ",
  medium: "Trung bình",
  hard: "Khó",
};

export const QUESTION_TYPE_LABELS_VI: Record<InterviewPromptQuestionType, string> = {
  behavioral: "Hành vi (behavioral)",
  technical: "Kỹ thuật (technical)",
  situational: "Tình huống (situational)",
  culture_fit: "Văn hoá (culture fit)",
  salary: "Lương / phúc lợi",
  open_ended: "Mở (open-ended)",
};

export interface UserInterviewPromptRow {
  id: string;
  submitter_user_id: string;
  question_text_en: string;
  question_text_vi: string | null;
  profession: InterviewPromptProfession;
  context: string | null;
  difficulty: InterviewPromptDifficulty;
  question_type: InterviewPromptQuestionType;
  status: InterviewPromptStatus;
  upvotes_count: number;
  flag_count: number;
  submitter_anonymous: boolean;
  submitted_at: string;
  approved_at: string | null;
  published_at: string | null;
  rejection_reason: string | null;
}

export interface InterviewPromptVoteRow {
  user_id: string;
  prompt_id: string;
  vote_type: InterviewPromptVoteType;
  voted_at: string;
}

// Anti-abuse caps. Exported so UI copy and tests share the same source.
export const INTERVIEW_PROMPT_LIMITS = {
  MIN_COMPLETIONS_TO_SUBMIT: 3,
  MAX_SUBMISSIONS_PER_30_DAYS: 10,
  MAX_VOTES_PER_24H: 30,
  AUTO_PULL_FLAG_THRESHOLD: 5,
} as const;
