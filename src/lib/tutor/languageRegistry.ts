export type TutorLanguageCode = "en" | "fr" | "zh" | "de" | "ja" | "ko" | "es" | "vi";
export type TutorUiLanguage = "en" | "vi" | "native";
export type TutorLanguageDirection = "ltr" | "rtl";

export type TutorLanguageConfig = {
  code: TutorLanguageCode;
  labelEn: string;
  labelNative: string;
  labelVi: string;
  speechLocale: string;
  ttsLocale: string;
  defaultExample: string;
  placeholder: string;
  supportsStt: boolean;
  supportsBrowserTts: boolean;
  supportsCloudTts: boolean;
  direction: TutorLanguageDirection;
};

export const TUTOR_LANGUAGE_CODES = ["en", "fr", "zh", "de", "ja", "ko", "es", "vi"] as const;

export const TUTOR_LANGUAGE_REGISTRY: Record<TutorLanguageCode, TutorLanguageConfig> = {
  en: {
    code: "en",
    labelEn: "English",
    labelNative: "English",
    labelVi: "tiếng Anh",
    speechLocale: "en-US",
    ttsLocale: "en-US",
    defaultExample: "She go to school every day",
    placeholder: 'gõ câu của bạn ở đây, ví dụ: "She go to school every day"',
    supportsStt: true,
    supportsBrowserTts: true,
    supportsCloudTts: true,
    direction: "ltr",
  },
  fr: {
    code: "fr",
    labelEn: "French",
    labelNative: "français",
    labelVi: "tiếng Pháp",
    speechLocale: "fr-FR",
    ttsLocale: "fr-FR",
    defaultExample: "Je suis aller au marché",
    placeholder: 'gõ câu tiếng Pháp của bạn ở đây, ví dụ: "Je suis aller au marché"',
    supportsStt: true,
    supportsBrowserTts: true,
    supportsCloudTts: false,
    direction: "ltr",
  },
  zh: {
    code: "zh",
    labelEn: "Chinese",
    labelNative: "中文",
    labelVi: "tiếng Trung",
    speechLocale: "zh-CN",
    ttsLocale: "zh-CN",
    defaultExample: "我昨天去商店",
    placeholder: 'gõ câu tiếng Trung của bạn ở đây, ví dụ: "我昨天去商店"',
    supportsStt: true,
    supportsBrowserTts: true,
    supportsCloudTts: false,
    direction: "ltr",
  },
  de: {
    code: "de",
    labelEn: "German",
    labelNative: "Deutsch",
    labelVi: "tiếng Đức",
    speechLocale: "de-DE",
    ttsLocale: "de-DE",
    defaultExample: "Ich gehe gestern zum Markt",
    placeholder: 'gõ câu tiếng Đức của bạn ở đây, ví dụ: "Ich gehe gestern zum Markt"',
    supportsStt: true,
    supportsBrowserTts: true,
    supportsCloudTts: false,
    direction: "ltr",
  },
  ja: {
    code: "ja",
    labelEn: "Japanese",
    labelNative: "日本語",
    labelVi: "tiếng Nhật",
    speechLocale: "ja-JP",
    ttsLocale: "ja-JP",
    defaultExample: "私は昨日店に行く",
    placeholder: 'gõ câu tiếng Nhật của bạn ở đây, ví dụ: "私は昨日店に行く"',
    supportsStt: true,
    supportsBrowserTts: true,
    supportsCloudTts: false,
    direction: "ltr",
  },
  ko: {
    code: "ko",
    labelEn: "Korean",
    labelNative: "한국어",
    labelVi: "tiếng Hàn",
    speechLocale: "ko-KR",
    ttsLocale: "ko-KR",
    defaultExample: "저는 어제 시장에 가요",
    placeholder: 'gõ câu tiếng Hàn của bạn ở đây, ví dụ: "저는 어제 시장에 가요"',
    supportsStt: true,
    supportsBrowserTts: true,
    supportsCloudTts: false,
    direction: "ltr",
  },
  es: {
    code: "es",
    labelEn: "Spanish",
    labelNative: "español",
    labelVi: "tiếng Tây Ban Nha",
    speechLocale: "es-ES",
    ttsLocale: "es-ES",
    defaultExample: "Yo fui al mercado ayer",
    placeholder: 'type your Spanish sentence here, for example: "Yo fui al mercado ayer"',
    supportsStt: true,
    supportsBrowserTts: true,
    supportsCloudTts: false,
    direction: "ltr",
  },
  vi: {
    code: "vi",
    labelEn: "Vietnamese",
    labelNative: "Tiếng Việt",
    labelVi: "tiếng Việt",
    speechLocale: "vi-VN",
    ttsLocale: "vi-VN",
    defaultExample: "Tôi buồn vì mất cái mũ đẹp.",
    placeholder: 'gõ câu tiếng Việt của bạn ở đây, ví dụ: "Tôi buồn vì mất cái mũ đẹp."',
    supportsStt: true,
    supportsBrowserTts: true,
    supportsCloudTts: true,
    direction: "ltr",
  },
};

const TUTOR_LANGUAGE_ALIASES: Record<string, TutorLanguageCode> = {
  english: "en",
  french: "fr",
  francais: "fr",
  "français": "fr",
  chinese: "zh",
  mandarin: "zh",
  cn: "zh",
  german: "de",
  deutsch: "de",
  japanese: "ja",
  jp: "ja",
  korean: "ko",
  kr: "ko",
  spanish: "es",
  espanol: "es",
  "español": "es",
  vietnamese: "vi",
  "tieng-viet": "vi",
};

function normalizeRawLanguage(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return "";
  if (trimmed.includes("=") || trimmed.startsWith("?")) {
    try {
      const queryStart = trimmed.indexOf("?");
      const search = queryStart >= 0 ? trimmed.slice(queryStart) : `?${trimmed}`;
      return new URLSearchParams(search).get("target")?.trim().toLowerCase() ?? trimmed;
    } catch {
      return trimmed;
    }
  }
  return trimmed;
}

export function getTutorLanguage(code: unknown): TutorLanguageConfig {
  const normalized = normalizeRawLanguage(code);
  if (normalized in TUTOR_LANGUAGE_REGISTRY) {
    return TUTOR_LANGUAGE_REGISTRY[normalized as TutorLanguageCode];
  }
  return TUTOR_LANGUAGE_REGISTRY.en;
}

export function resolveTutorTargetLanguage(raw: unknown): TutorLanguageCode {
  const normalized = normalizeRawLanguage(raw);
  if (normalized in TUTOR_LANGUAGE_REGISTRY) return normalized as TutorLanguageCode;
  return TUTOR_LANGUAGE_ALIASES[normalized] ?? "en";
}

export function getTutorLanguageLabel(code: unknown, uiLang: string = "en"): string {
  const language = getTutorLanguage(resolveTutorTargetLanguage(code));
  if (uiLang === "vi") return language.labelVi;
  if (uiLang === "native") return language.labelNative;
  return language.labelEn;
}

export function getSpeechLocale(code: unknown): string {
  return getTutorLanguage(resolveTutorTargetLanguage(code)).speechLocale;
}

export function getTtsLocale(code: unknown): string {
  return getTutorLanguage(resolveTutorTargetLanguage(code)).ttsLocale;
}
