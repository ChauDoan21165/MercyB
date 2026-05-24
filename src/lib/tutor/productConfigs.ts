import {
  TUTOR_LANGUAGE_CODES,
  resolveTutorTargetLanguage,
  type TutorLanguageCode,
} from "@/lib/tutor/languageRegistry";

export type TutorProductMode =
  | "journey"
  | "grammar"
  | "speak"
  | "logic"
  | "correction"
  | "conversation";

export type TutorMemoryScope =
  | "user-target-language"
  | "product-target-language"
  | "product-session";

export type TutorProductConfig = {
  productId: string;
  title: string;
  subtitle: string;
  allowedTargetLanguages: TutorLanguageCode[];
  defaultTargetLanguage: TutorLanguageCode;
  explainLanguageStrategy: "multilingual" | "vi-first" | "target";
  tone: "general" | "kids-safe" | "exam" | "business-exam";
  modes: TutorProductMode[];
  memoryScope: TutorMemoryScope;
  memoryEnabled: boolean;
  cloudVoiceEnabled: boolean;
  rawAudioAllowed: false;
  transcriptStorageAllowed: false;
};

export const aiTutor: TutorProductConfig = {
  productId: "aiTutor",
  title: "Teacher Mercy AI Tutor",
  subtitle: "Sửa câu bằng AI Tutor, ghi nhớ lỗi hay gặp, rồi luyện lại với Mercy.",
  allowedTargetLanguages: [...TUTOR_LANGUAGE_CODES],
  defaultTargetLanguage: "en",
  explainLanguageStrategy: "multilingual",
  tone: "general",
  modes: ["journey", "grammar", "speak", "logic", "correction", "conversation"],
  memoryScope: "user-target-language",
  memoryEnabled: true,
  cloudVoiceEnabled: true,
  rawAudioAllowed: false,
  transcriptStorageAllowed: false,
};

export const viKidsEnglish: TutorProductConfig = {
  productId: "viKidsEnglish",
  title: "Teacher Mercy · English for Việt Kids",
  subtitle: "Mercy giúp bé luyện tiếng Anh bằng giải thích tiếng Việt ngắn, ấm áp, dễ hiểu.",
  allowedTargetLanguages: ["en"],
  defaultTargetLanguage: "en",
  explainLanguageStrategy: "vi-first",
  tone: "kids-safe",
  modes: ["journey", "grammar", "speak"],
  memoryScope: "product-target-language",
  memoryEnabled: true,
  cloudVoiceEnabled: true,
  rawAudioAllowed: false,
  transcriptStorageAllowed: false,
};

export const ieltsSpeaking: TutorProductConfig = {
  productId: "ieltsSpeaking",
  title: "Teacher Mercy · IELTS Speaking",
  subtitle: "Exam-style speaking practice with clear criteria and concise feedback.",
  allowedTargetLanguages: ["en"],
  defaultTargetLanguage: "en",
  explainLanguageStrategy: "target",
  tone: "exam",
  modes: ["speak", "conversation", "correction"],
  memoryScope: "product-session",
  memoryEnabled: false,
  cloudVoiceEnabled: true,
  rawAudioAllowed: false,
  transcriptStorageAllowed: false,
};

export const toeicPractice: TutorProductConfig = {
  productId: "toeicPractice",
  title: "Teacher Mercy · TOEIC Practice",
  subtitle: "Focused TOEIC practice for workplace English and test readiness.",
  allowedTargetLanguages: ["en"],
  defaultTargetLanguage: "en",
  explainLanguageStrategy: "target",
  tone: "business-exam",
  modes: ["grammar", "conversation", "correction"],
  memoryScope: "product-session",
  memoryEnabled: false,
  cloudVoiceEnabled: true,
  rawAudioAllowed: false,
  transcriptStorageAllowed: false,
};

export const TUTOR_PRODUCT_CONFIGS = {
  aiTutor,
  viKidsEnglish,
  ieltsSpeaking,
  toeicPractice,
} as const;

export type TutorProductId = keyof typeof TUTOR_PRODUCT_CONFIGS;

export function getTutorProductConfig(productId: string): TutorProductConfig {
  return TUTOR_PRODUCT_CONFIGS[productId as TutorProductId] ?? aiTutor;
}

export function isTargetLanguageAllowed(
  config: TutorProductConfig,
  targetLanguage: string,
): boolean {
  return config.allowedTargetLanguages.includes(resolveTutorTargetLanguage(targetLanguage));
}

export function resolveTargetLanguage(
  config: TutorProductConfig,
  requestedTargetLanguage: string,
): TutorLanguageCode {
  const resolved = resolveTutorTargetLanguage(requestedTargetLanguage);
  return isTargetLanguageAllowed(config, resolved)
    ? resolved
    : config.defaultTargetLanguage;
}

export function getSafetyLabel(config: TutorProductConfig): string {
  if (config.tone === "kids-safe") return "Kids-safe practice";
  if (!config.rawAudioAllowed && !config.transcriptStorageAllowed) {
    return "No raw audio or full transcript storage";
  }
  return "Tutor practice";
}

export function resolveExplainLanguage(
  config: TutorProductConfig,
  uiLanguage: "en" | "vi",
  targetLanguage: string,
): "en" | "vi" {
  if (config.explainLanguageStrategy === "vi-first") return "vi";
  if (config.explainLanguageStrategy === "target") return targetLanguage === "vi" ? "vi" : "en";
  return uiLanguage;
}
