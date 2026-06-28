// src/lib/ai-tutor/tutorUiCopy.ts
// Mock results and text helpers. Product/UI copy lives in src/lib/tutor.

import { correctWithTutorRules } from "@/lib/tutor/correctionEngine";
import { readAnonymousPair } from "@/lib/languagePair/anonymousPair";

import {
  resolveTutorTargetLanguage,
  type TutorLanguageCode,
} from "@/lib/tutor/languageRegistry";

export type TutorTarget = TutorLanguageCode;
export type ExplainLanguage = "vi" | "en";

type PracticeFeedback = {
  encouragement: string;
  tip: string;
  nextStep: string;
};

type MockCorrection = {
  explanation: Record<ExplainLanguage, string>;
  grammarTip: Record<ExplainLanguage, string>;
  practicePrompt: Record<ExplainLanguage, string>;
  feedback: PracticeFeedback;
};

export const MOCK_RESULTS_BY_TARGET: Record<TutorTarget, MockCorrection> = {
  en: {
    explanation: {
      vi: "Với chủ ngữ ngôi thứ ba số ít như she/he/it, động từ ở hiện tại đơn cần thêm -s hoặc -es.",
      en: "Third-person singular subjects such as she/he/it need -s or -es in the present simple.",
    },
    grammarTip: {
      vi: "Quy tắc: Chủ ngữ ngôi thứ ba số ít → động từ thêm -s/-es.",
      en: "Rule: third-person singular subject -> verb + -s/-es.",
    },
    practicePrompt: {
      vi: "Viết một câu về thói quen hằng ngày của bạn dùng thì hiện tại đơn.",
      en: "Write one sentence about a daily habit using the present simple.",
    },
    feedback: {
      encouragement: "Tốt lắm! Bạn đã thực hành thì hiện tại đơn. 🎯",
      tip: "Nhớ thêm -s/-es cho động từ khi chủ ngữ là she / he / it nhé.",
      nextStep: "Thử viết thêm một câu khác về người thân của bạn.",
    },
  },
  fr: {
    explanation: {
      vi: "Câu vẫn giữ ý gốc bằng tiếng Pháp. Mercy sửa 'neuve' thành 'nouvelle' cho tự nhiên hơn và thay dấu gạch ngang bằng dấu chấm phẩy để câu học thuật mạch lạc hơn.",
      en: "The sentence stays in French. Mercy changed 'neuve' to the more natural 'nouvelle' and used a semicolon for a smoother academic sentence.",
    },
    grammarTip: {
      vi: "Trong tiếng Pháp trang trọng, 'nouvelle lecture' tự nhiên hơn 'lecture neuve' khi nói về cách đọc/diễn giải mới.",
      en: "In formal French, 'nouvelle lecture' is more natural than 'lecture neuve' for a new interpretation.",
    },
    practicePrompt: {
      vi: "Viết lại một câu tiếng Pháp học thuật khác, giữ ý gốc nhưng làm văn phong tự nhiên hơn.",
      en: "Rewrite another academic French sentence while keeping the original meaning.",
    },
    feedback: {
      encouragement: "Tốt lắm! Câu tiếng Pháp của bạn đã rõ và tự nhiên hơn.",
      tip: "Ưu tiên cụm danh từ quen dùng trong văn học thuật, ví dụ 'nouvelle lecture'.",
      nextStep: "Thử viết thêm một câu có cấu trúc 'd'abord..., puis...'.",
    },
  },
  zh: {
    explanation: {
      vi: "Câu tiếng Trung cần thêm '了' sau động từ để đánh dấu hành động đã xảy ra trong quá khứ.",
      en: "The Chinese sentence needs '了' after the verb to mark a completed past action.",
    },
    grammarTip: {
      vi: "Khi nói về hành động đã hoàn thành, thường dùng cấu trúc: chủ ngữ + động từ + 了 + tân ngữ.",
      en: "For completed actions, a common pattern is subject + verb + 了 + object.",
    },
    practicePrompt: {
      vi: "Viết một câu tiếng Trung khác về việc bạn đã làm hôm qua.",
      en: "Write another Chinese sentence about something you did yesterday.",
    },
    feedback: {
      encouragement: "Tốt! Bạn đã luyện cách diễn tả hành động đã hoàn thành.",
      tip: "Đừng quên '了' khi câu nhấn mạnh việc đã xảy ra.",
      nextStep: "Thử thêm thời gian như '昨天晚上' hoặc '上个星期'.",
    },
  },
  de: {
    explanation: {
      vi: "Câu tiếng Đức cần dùng Perfekt cho hành động đã xảy ra: 'bin ... gegangen'.",
      en: "The German sentence needs Perfekt for a completed past action: 'bin ... gegangen'.",
    },
    grammarTip: {
      vi: "Với động từ chỉ chuyển động như 'gehen', Perfekt thường dùng trợ động từ 'sein'.",
      en: "Movement verbs such as 'gehen' often use 'sein' in the Perfekt.",
    },
    practicePrompt: {
      vi: "Viết một câu tiếng Đức khác về nơi bạn đã đi hôm qua.",
      en: "Write another German sentence about where you went yesterday.",
    },
    feedback: {
      encouragement: "Tốt! Bạn đã luyện đúng dạng quá khứ Perfekt.",
      tip: "Nhớ đặt phân từ quá khứ ở cuối câu.",
      nextStep: "Thử dùng 'fahren' hoặc 'kommen' trong một câu mới.",
    },
  },
  ja: {
    explanation: {
      vi: "Câu tiếng Nhật cần dùng dạng quá khứ lịch sự '行きました' khi nói về việc đã đi hôm qua.",
      en: "The Japanese sentence needs the polite past form '行きました' for something you did yesterday.",
    },
    grammarTip: {
      vi: "Mẫu câu: thời gian + nơi chốn + に/へ + động từ quá khứ.",
      en: "Pattern: time + place + に/へ + past-tense verb.",
    },
    practicePrompt: {
      vi: "Viết một câu tiếng Nhật khác về nơi bạn đã đến hôm qua.",
      en: "Write another Japanese sentence about where you went yesterday.",
    },
    feedback: {
      encouragement: "Tốt! Câu của bạn đã dùng đúng dạng quá khứ lịch sự.",
      tip: "Có thể dùng に hoặc へ với động từ di chuyển.",
      nextStep: "Thử thêm phương tiện, ví dụ '電車で'.",
    },
  },
  ko: {
    explanation: {
      vi: "Câu tiếng Hàn cần dùng dạng quá khứ '갔어요' khi nói về việc đã đi hôm qua.",
      en: "The Korean sentence needs the past form '갔어요' for something that happened yesterday.",
    },
    grammarTip: {
      vi: "Động từ 가다 ở quá khứ lịch sự thường là 갔어요.",
      en: "The polite past form of 가다 is commonly 갔어요.",
    },
    practicePrompt: {
      vi: "Viết một câu tiếng Hàn khác về việc bạn đã làm hôm qua.",
      en: "Write another Korean sentence about something you did yesterday.",
    },
    feedback: {
      encouragement: "Tốt! Bạn đã luyện đúng thì quá khứ trong tiếng Hàn.",
      tip: "Từ chỉ thời gian như 어제 thường đứng gần đầu câu.",
      nextStep: "Thử viết câu với '지난주'.",
    },
  },
  es: {
    explanation: {
      vi: "Câu tiếng Tây Ban Nha dùng pretérito 'fui' để nói về hành động đã hoàn thành trong quá khứ.",
      en: "The Spanish sentence uses the preterite 'fui' for a completed past action.",
    },
    grammarTip: {
      vi: "Với hành động đã xảy ra tại một thời điểm rõ ràng như 'ayer', dùng pretérito.",
      en: "Use the preterite for completed actions at a clear past time such as 'ayer'.",
    },
    practicePrompt: {
      vi: "Viết một câu tiếng Tây Ban Nha khác về việc bạn đã làm hôm qua.",
      en: "Write another Spanish sentence about something you did yesterday.",
    },
    feedback: {
      encouragement: "Tốt! Câu tiếng Tây Ban Nha của bạn đã dùng thì quá khứ tự nhiên hơn.",
      tip: "Dùng pretérito cho hành động đã hoàn thành trong quá khứ.",
      nextStep: "Thử viết thêm một câu với 'la semana pasada'.",
    },
  },
  vi: {
    explanation: {
      vi: "Câu tiếng Việt đã tự nhiên. Mercy giữ cấu trúc gọn và đúng ngữ cảnh.",
      en: "The Vietnamese sentence is natural. Mercy keeps the concise structure and correct context.",
    },
    grammarTip: {
      vi: "Tiếng Việt thường dùng từ chỉ thời gian như 'hôm qua' thay vì biến đổi động từ.",
      en: "Vietnamese usually uses time words such as 'hôm qua' instead of changing verb forms.",
    },
    practicePrompt: {
      vi: "Viết một câu tiếng Việt khác về việc bạn đã làm hôm qua.",
      en: "Write another Vietnamese sentence about something you did yesterday.",
    },
    feedback: {
      encouragement: "Tốt! Câu tiếng Việt của bạn rõ và tự nhiên.",
      tip: "Đặt trạng ngữ thời gian ở đầu câu giúp ý rõ hơn.",
      nextStep: "Thử viết câu với 'sáng nay' hoặc 'tuần trước'.",
    },
  },
  tr: {
    explanation: {
      vi: "Câu tiếng Thổ Nhĩ Kỳ cần dùng thì quá khứ khi có từ chỉ thời gian 'dün'.",
      en: "The Turkish sentence needs past tense when it uses the past-time word 'dün'.",
    },
    grammarTip: {
      vi: "Với hành động đã xảy ra hôm qua, dùng dạng quá khứ như 'gittim' thay vì hiện tại 'gidiyorum'.",
      en: "For an action completed yesterday, use a past form such as 'gittim' instead of present 'gidiyorum'.",
    },
    practicePrompt: {
      vi: "Viết một câu tiếng Thổ Nhĩ Kỳ khác về việc bạn đã làm hôm qua.",
      en: "Write another Turkish sentence about something you did yesterday.",
    },
    feedback: {
      encouragement: "Tốt! Bạn đã luyện cách nói hành động đã xảy ra trong tiếng Thổ Nhĩ Kỳ.",
      tip: "Từ 'dün' thường kéo câu về thì quá khứ.",
      nextStep: "Thử viết thêm một câu với 'geçen hafta'.",
    },
  },
  ru: {
    explanation: {
      vi: "Câu tiếng Nga cần dùng dạng quá khứ khi nói về việc đã đi hôm qua.",
      en: "The Russian sentence needs past tense for something you did yesterday.",
    },
    grammarTip: {
      vi: "Với hành động đã xảy ra hôm qua, dùng dạng quá khứ như 'ходил/ходила' thay vì nguyên mẫu hoặc hiện tại.",
      en: "For an action completed yesterday, use a past-tense form such as 'ходил/ходила' instead of an infinitive or present form.",
    },
    practicePrompt: {
      vi: "Viết một câu tiếng Nga khác về việc bạn đã làm hôm qua.",
      en: "Write another Russian sentence about something you did yesterday.",
    },
    feedback: {
      encouragement: "Tốt! Bạn đã luyện cách diễn tả quá khứ trong tiếng Nga.",
      tip: "Nhớ chia động từ quá khứ theo giống và số trong tiếng Nga.",
      nextStep: "Thử viết thêm một câu với 'вчера' hoặc 'на прошлой неделе'.",
    },
  },

};

// ─── Text helpers ──────────────────────────────────────────────────────

export function normalizeSpokenText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function appendCleanSpeech(base: string, transcript: string): string {
  const normalizedBase = normalizeSpokenText(base);
  const normalizedTranscript = normalizeSpokenText(transcript);
  if (!normalizedTranscript) return normalizedBase;
  if (!normalizedBase) return normalizedTranscript.slice(0, 500);
  if (normalizedBase === normalizedTranscript || normalizedBase.includes(normalizedTranscript)) {
    return normalizedBase.slice(0, 500);
  }
  if (normalizedTranscript.includes(normalizedBase)) {
    return normalizedTranscript.slice(0, 500);
  }
  const next = `${normalizedBase} ${normalizedTranscript}`;
  if (next.length <= 500) return next;
  const clipped = next.slice(0, 500);
  const lastSpace = clipped.lastIndexOf(" ");
  return lastSpace > 420 ? clipped.slice(0, lastSpace) : clipped;
}

export function ensureTerminalPunctuation(value: string, target: TutorTarget): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/[.!?。！？]$/.test(trimmed)) return trimmed;
  return target === "zh" || target === "ja" ? `${trimmed}。` : `${trimmed}.`;
}

export function capitalizeFirst(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
}

function collapseRepeatedVietnameseFragments(value: string): string {
  const words = value.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (words.length === 0) return "";
  const maxPhrase = Math.min(6, Math.floor(words.length / 2));
  for (let size = maxPhrase; size >= 1; size--) {
    const collapsed: string[] = [];
    for (let index = 0; index < words.length; index++) {
      const phrase = words.slice(index, index + size).join(" ").toLowerCase();
      const previous = collapsed.slice(-size).join(" ").toLowerCase();
      if (phrase && phrase === previous) {
        index += size - 1;
        continue;
      }
      collapsed.push(words[index]);
    }
    words.splice(0, words.length, ...collapsed);
  }
  return words.join(" ");
}

function normalizeVietnameseCorrectionInput(value: string): string {
  return collapseRepeatedVietnameseFragments(value)
    .replace(/\b(?:ok|okay)\b/gi, "")
    .replace(/chương trình nó chạy xong/gi, "")
    .replace(/\bchiếc cái\b/gi, "chiếc")
    .replace(/\bcái chiếc\b/gi, "chiếc")
    .replace(/\b(tôi buồn)(?:\s+\1)+\b/gi, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function correctEnglishBeginnerGrammar(value: string): string {
  const correction = correctWithTutorRules(value, "en");
  return correction.status === "needs_ai" ? "" : correction.corrected;
}

export function buildInputAwareCorrection(input: string, target: TutorTarget): string {
  const trimmed = input.replace(/\s+/g, " ").trim();
  if (!trimmed) return trimmed;

  switch (target) {
    case "vi": {
      const cleanedInput = normalizeVietnameseCorrectionInput(trimmed);
      const lower = cleanedInput.toLowerCase();
      if (lower.includes("buồn") && lower.includes("mất") && lower.includes("xe đạp")) {
        return "Tôi buồn vì đã làm mất chiếc xe đạp.";
      }
      if (lower.includes("buồn") && lower.includes("mất") && lower.includes("mũ")) {
        return "Tôi buồn vì đã làm mất chiếc mũ đẹp của mình.";
      }
      const corrected = cleanedInput
        .replace(/\bvì mất cái xe đạp\b/i, "vì đã làm mất chiếc xe đạp")
        .replace(/\bvì mất cái mũ đẹp\b/i, "vì đã làm mất chiếc mũ đẹp của mình")
        .replace(/\bcái xe đạp\b/gi, "chiếc xe đạp")
        .replace(/\bcái mũ\b/gi, "chiếc mũ")
        .replace(/\bvì mất\b/gi, "vì đã làm mất");
      return ensureTerminalPunctuation(capitalizeFirst(corrected), target);
    }
    case "fr": {
      const corrected = trimmed
        .replace(/\bJe suis aller\b/gi, "Je suis allé")
        .replace(/\bje suis aller\b/gi, "Je suis allé")
        .replace(/\blecture neuve\b/gi, "lecture nouvelle")
        .replace(/\bneuve\b/gi, "nouvelle")
        .replace(/\bparait\b/gi, "paraît")
        .replace(/\s+—\s+/g, " ; ")
        .replace(/\bparaît hérétique\b/gi, "paraît d'abord hérétique");
      return ensureTerminalPunctuation(corrected, target);
    }
    case "zh": {
      const corrected = trimmed
        .replace(/我昨天去商店/g, "我昨天去了商店")
        .replace(/昨天去商店/g, "昨天去了商店");
      return ensureTerminalPunctuation(corrected, target);
    }
    case "ja": {
      const corrected = trimmed
        .replace(/昨日店に行く/g, "昨日店に行きました")
        .replace(/昨日お店に行く/g, "昨日お店に行きました")
        .replace(/行く。?$/g, "行きました");
      return ensureTerminalPunctuation(corrected, target);
    }
    case "ko": {
      const corrected = trimmed
        .replace(/시장에 가요/g, "시장에 갔어요")
        .replace(/어제 시장에 가/g, "어제 시장에 갔");
      return ensureTerminalPunctuation(corrected, target);
    }
    case "de": {
      const corrected = capitalizeFirst(trimmed)
        .replace(/\bIch gehe gestern zum Markt\b/i, "Ich bin gestern zum Markt gegangen")
        .replace(/\bich gehe gestern zum markt\b/i, "Ich bin gestern zum Markt gegangen");
      return ensureTerminalPunctuation(corrected, target);
    }
    case "es": {
      const corrected = capitalizeFirst(trimmed)
        .replace(/\bYo fui al mercado ayer\b/i, "Fui al mercado ayer")
        .replace(/\byo fui\b/i, "Fui");
      return ensureTerminalPunctuation(corrected, target);
    }
    case "tr": {
      const corrected = capitalizeFirst(trimmed)
        .replace(/\bDün pazara gidiyorum\b/i, "Dün pazara gittim")
        .replace(/\bdün pazara gidiyorum\b/i, "Dün pazara gittim")
        .replace(/\bgidiyorum\b/gi, "gittim");
      return ensureTerminalPunctuation(corrected, target);
    }
    case "en":
    default: {
      const corrected = correctEnglishBeginnerGrammar(trimmed);
      return ensureTerminalPunctuation(corrected, target);
    }
  }
}

export function getTutorTargetFromSearch(
  search: string,
  allowedTargetLanguages?: readonly string[],
  defaultTargetLanguage: TutorTarget = "en",
): TutorTarget {
  const target = resolveTutorTargetLanguage(search);
  return allowedTargetLanguages?.includes(target) ? target : allowedTargetLanguages ? defaultTargetLanguage : target;
}

export function getExplainLanguage(search?: string): ExplainLanguage {
  // 1. When a ?native= param is present and the native language is NOT
  //    Vietnamese, explanations default to English. This keeps the AI
  //    Tutor usable for speakers of all 19 homepage languages without
  //    requiring per-language copy for every native tongue.
  if (search) {
    try {
      const native = new URLSearchParams(search).get("native")?.trim().toLowerCase();
      if (native && native !== "vi" && native !== "vietnamese") return "en";
    } catch { /* ignore */ }
  }
  // 2. No URL param — check the stored anonymous language pair from
  //    the homepage selector. If a pair was persisted (e.g. via
  //    /learn/thai/english), respect its native language.
  if (typeof window !== "undefined") {
    try {
      const pair = readAnonymousPair();
      if (pair && pair.native !== "vi") return "en";
    } catch { /* ignore */ }
  }
  // 3. Fall back to the stored lesson UI language preference, then
  //    Vietnamese (the primary audience default).
  if (typeof window === "undefined") return "vi";
  try {
    return window.localStorage.getItem("mercyblade.lessonUiLang") === "en" ? "en" : "vi";
  } catch {
    return "vi";
  }
}
