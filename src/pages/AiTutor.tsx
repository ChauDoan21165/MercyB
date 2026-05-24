// src/pages/AiTutor.tsx
// AI Tutor mock UI — static responses, no real provider calls.
// M3: Safe aggregate reminder card using IndexedDB getMemorySummary.

import { Mic, MicOff, Square, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import {
  putCorrection,
  markPracticed,
  getMemorySummary,
} from "@/lib/ai-tutor/learningMemory";
import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";
import { useBrowserStt } from "@/lib/ai-tutor/useBrowserStt";
import { useTtsSpeaker } from "@/lib/ai-tutor/useTtsSpeaker";

type CorrectionResult = {
  corrected: string;
  explanation: string;
  grammarTip: string;
  practicePrompt: string;
};

type MockCorrection = {
  explanation: Record<ExplainLanguage, string>;
  grammarTip: Record<ExplainLanguage, string>;
  practicePrompt: Record<ExplainLanguage, string>;
  feedback: PracticeFeedback;
};

type PracticeFeedback = {
  encouragement: string;
  tip: string;
  nextStep: string;
};

type TutorTarget = "en" | "fr" | "zh" | "de" | "ja" | "ko" | "es" | "vi";
type ExplainLanguage = "vi" | "en";

type TutorTargetCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  helper: string;
  placeholder: string;
  label: string;
  voiceLabel: string;
  voiceFallback: string;
  nameEn: string;
  nameVi: string;
};

type UiCopy = {
  title: (targetCopy: TutorTargetCopy, target: TutorTarget) => string;
  subtitle: (targetCopy: TutorTargetCopy) => string;
  helper: (targetCopy: TutorTargetCopy) => string;
  inputLabel: (targetCopy: TutorTargetCopy) => string;
  micInput: string;
  micListening: string;
  micHelper: string;
  micUnavailable: string;
  micAriaStart: string;
  micAriaStop: string;
  submit: string;
  submitting: string;
  reset: string;
  emptyTitle: string;
  emptyBody: (targetCopy: TutorTargetCopy) => string;
  loadingTitle: string;
  loadingBody: string;
  correctedLabel: string;
  ttsUnavailable: string;
  ttsPlay: string;
  ttsStop: string;
  ttsAriaPlay: string;
  ttsAriaStop: string;
  explanationLabel: string;
  grammarTipLabel: string;
  practiceLabel: string;
  practicePlaceholder: string;
  practiceSubmit: string;
  practiceSubmitting: string;
  feedbackLabel: string;
  tipLabel: string;
  nextStepLabel: string;
  tryAnother: string;
  footer: string;
};

const TARGET_COPY: Record<TutorTarget, TutorTargetCopy> = {
  en: {
    eyebrow: "New AI Tutor",
    title: "Teacher Mercy AI Tutor",
    subtitle: "Sửa câu tiếng Anh bằng AI thật, ghi nhớ lỗi hay gặp, rồi luyện lại với Mercy.",
    helper: "Write a sentence — AI corrects it, explains it, and gives follow-up practice.",
    placeholder: 'gõ câu của bạn ở đây, ví dụ: "She go to school every day"',
    label: "English correction",
    voiceLabel: "Voice input",
    voiceFallback: "Microphone unavailable in this browser",
    nameEn: "English",
    nameVi: "tiếng Anh",
  },
  fr: {
    eyebrow: "AI Tutor tiếng Pháp",
    title: "Teacher Mercy · French Tutor",
    subtitle: "Luyện tiếng Pháp với Mercy: sửa câu, giải thích lỗi, và ôn lại điểm cần nhớ.",
    helper: "Write a French sentence — Mercy corrects it, explains it, and gives follow-up practice.",
    placeholder: 'gõ câu tiếng Pháp của bạn ở đây, ví dụ: "Je suis aller au marché"',
    label: "French practice",
    voiceLabel: "French voice input",
    voiceFallback: "Microphone unavailable for French practice",
    nameEn: "French",
    nameVi: "tiếng Pháp",
  },
  zh: {
    eyebrow: "AI Tutor tiếng Trung",
    title: "Teacher Mercy · Chinese Tutor",
    subtitle: "Luyện tiếng Trung với Mercy: sửa câu, giải thích lỗi, và ôn lại điểm cần nhớ.",
    helper: "Write a Chinese sentence — Mercy corrects it, explains it, and gives follow-up practice.",
    placeholder: 'gõ câu tiếng Trung của bạn ở đây, ví dụ: "我昨天去商店"',
    label: "Chinese practice",
    voiceLabel: "Chinese voice input",
    voiceFallback: "Microphone unavailable for Chinese practice",
    nameEn: "Chinese",
    nameVi: "tiếng Trung",
  },
  de: {
    eyebrow: "AI Tutor tiếng Đức",
    title: "Teacher Mercy · German Tutor",
    subtitle: "Luyện tiếng Đức với Mercy: sửa câu, giải thích lỗi, và ôn lại điểm cần nhớ.",
    helper: "Write a German sentence — Mercy corrects it, explains it, and gives follow-up practice.",
    placeholder: 'gõ câu tiếng Đức của bạn ở đây, ví dụ: "Ich gehe gestern zum Markt"',
    label: "German practice",
    voiceLabel: "German voice input",
    voiceFallback: "Microphone unavailable for German practice",
    nameEn: "German",
    nameVi: "tiếng Đức",
  },
  ja: {
    eyebrow: "AI Tutor tiếng Nhật",
    title: "Teacher Mercy · Japanese Tutor",
    subtitle: "Luyện tiếng Nhật với Mercy: sửa câu, giải thích lỗi, và ôn lại điểm cần nhớ.",
    helper: "Write a Japanese sentence — Mercy corrects it, explains it, and gives follow-up practice.",
    placeholder: 'gõ câu tiếng Nhật của bạn ở đây, ví dụ: "私は昨日店に行く"',
    label: "Japanese practice",
    voiceLabel: "Japanese voice input",
    voiceFallback: "Microphone unavailable for Japanese practice",
    nameEn: "Japanese",
    nameVi: "tiếng Nhật",
  },
  ko: {
    eyebrow: "AI Tutor tiếng Hàn",
    title: "Teacher Mercy · Korean Tutor",
    subtitle: "Luyện tiếng Hàn với Mercy: sửa câu, giải thích lỗi, và ôn lại điểm cần nhớ.",
    helper: "Write a Korean sentence — Mercy corrects it, explains it, and gives follow-up practice.",
    placeholder: 'gõ câu tiếng Hàn của bạn ở đây, ví dụ: "저는 어제 시장에 가요"',
    label: "Korean practice",
    voiceLabel: "Korean voice input",
    voiceFallback: "Microphone unavailable for Korean practice",
    nameEn: "Korean",
    nameVi: "tiếng Hàn",
  },
  es: {
    eyebrow: "AI Tutor tiếng Tây Ban Nha",
    title: "Teacher Mercy · Spanish Tutor",
    subtitle: "Practice Spanish with Mercy: correction, explanation, memory, and review.",
    helper: "Write a Spanish sentence — Mercy corrects it, explains it, and gives follow-up practice.",
    placeholder: 'type your Spanish sentence here, for example: "Yo fui al mercado ayer"',
    label: "Spanish practice",
    voiceLabel: "Spanish voice input",
    voiceFallback: "Microphone unavailable for Spanish practice",
    nameEn: "Spanish",
    nameVi: "tiếng Tây Ban Nha",
  },
  vi: {
    eyebrow: "AI Tutor tiếng Việt",
    title: "Teacher Mercy · Vietnamese Tutor",
    subtitle: "Practice Vietnamese with Mercy: correction, explanation, memory, and review.",
    helper: "Write a Vietnamese sentence — Mercy corrects it, explains it, and gives follow-up practice.",
    placeholder: 'gõ câu tiếng Việt của bạn ở đây, ví dụ: "Tôi buồn vì mất cái mũ đẹp."',
    label: "Vietnamese practice",
    voiceLabel: "Vietnamese voice input",
    voiceFallback: "Microphone unavailable for Vietnamese practice",
    nameEn: "Vietnamese",
    nameVi: "tiếng Việt",
  },
};

const UI_COPY: Record<ExplainLanguage, UiCopy> = {
  vi: {
    title: (targetCopy, target) =>
      target === "en" ? "Teacher Mercy AI Tutor" : `Teacher Mercy · Gia sư ${targetCopy.nameVi}`,
    subtitle: (targetCopy) =>
      `Luyện ${targetCopy.nameVi} với Mercy. Viết một câu ${targetCopy.nameVi}, Mercy sẽ sửa và giải thích bằng tiếng Việt.`,
    helper: (targetCopy) =>
      `Mercy sửa đúng ${targetCopy.nameVi}; phần giải thích và mẹo học dùng tiếng Việt.`,
    inputLabel: (targetCopy) => `Câu ${targetCopy.nameVi} của bạn`,
    micInput: "Nói câu của bạn",
    micListening: "Đang nghe giọng của bạn...",
    micHelper: "Mercy sẽ chuyển giọng nói của bạn thành câu để sửa.",
    micUnavailable: "Không dùng được micro trên trình duyệt này. Bạn vẫn có thể gõ câu.",
    micAriaStart: "Nói câu của bạn để nhập bằng giọng nói",
    micAriaStop: "Dừng nghe",
    submit: "Sửa câu này",
    submitting: "Đang sửa...",
    reset: "Làm mới",
    emptyTitle: "AI sẵn sàng sửa câu của bạn",
    emptyBody: (targetCopy) => `Gõ một câu ${targetCopy.nameVi} bên trên và nhấn Sửa câu này.`,
    loadingTitle: "AI đang phân tích câu của bạn...",
    loadingBody: "Mercy sẽ sửa đúng ngôn ngữ bạn chọn.",
    correctedLabel: "Câu đã sửa",
    ttsUnavailable: "Giọng đọc trình duyệt chưa khả dụng trên thiết bị này.",
    ttsPlay: "Mercy đọc",
    ttsStop: "Dừng",
    ttsAriaPlay: "Mercy đọc câu đã sửa bằng giọng trình duyệt",
    ttsAriaStop: "Dừng đọc",
    explanationLabel: "Giải thích",
    grammarTipLabel: "Mẹo ngữ pháp",
    practiceLabel: "Luyện tập",
    practicePlaceholder: "Viết câu trả lời của bạn ở đây...",
    practiceSubmit: "Gửi câu trả lời",
    practiceSubmitting: "Đang kiểm tra...",
    feedbackLabel: "Nhận xét",
    tipLabel: "Mẹo",
    nextStepLabel: "Bước tiếp theo",
    tryAnother: "Sửa câu khác",
    footer: "Giao diện thử nghiệm - chưa gọi nhà cung cấp AI thật.",
  },
  en: {
    title: (targetCopy, target) => (target === "en" ? "Teacher Mercy AI Tutor" : targetCopy.title),
    subtitle: (targetCopy) =>
      `Practice ${targetCopy.nameEn} with Mercy. Write a ${targetCopy.nameEn} sentence; Mercy corrects it and explains in English.`,
    helper: (targetCopy) =>
      `Mercy corrects the selected target language: ${targetCopy.nameEn}.`,
    inputLabel: (targetCopy) => `Your ${targetCopy.nameEn} sentence`,
    micInput: "Speak your sentence",
    micListening: "Listening to your voice...",
    micHelper: "Mercy turns your voice into text for correction.",
    micUnavailable: "Microphone unavailable in this browser. You can still type your sentence.",
    micAriaStart: "Speak your sentence for voice input",
    micAriaStop: "Stop listening",
    submit: "Correct my sentence",
    submitting: "Correcting...",
    reset: "Reset",
    emptyTitle: "AI is ready to correct your sentence",
    emptyBody: (targetCopy) => `Type a ${targetCopy.nameEn} sentence above and press Correct my sentence.`,
    loadingTitle: "AI is analyzing your sentence...",
    loadingBody: "Mercy will correct the language you selected.",
    correctedLabel: "Corrected",
    ttsUnavailable: "Browser voice playback is not supported on this device.",
    ttsPlay: "Mercy reads",
    ttsStop: "Stop",
    ttsAriaPlay: "Read corrected sentence with browser voice",
    ttsAriaStop: "Stop reading",
    explanationLabel: "Explanation",
    grammarTipLabel: "Grammar Tip",
    practiceLabel: "Practice",
    practicePlaceholder: "Write your answer here...",
    practiceSubmit: "Submit answer",
    practiceSubmitting: "Checking...",
    feedbackLabel: "Feedback",
    tipLabel: "Tip",
    nextStepLabel: "Next Step",
    tryAnother: "Try another sentence",
    footer: "Mock UI - no real AI provider calls are made.",
  },
};

const MOCK_RESULTS_BY_TARGET: Record<TutorTarget, MockCorrection> = {
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
      encouragement: "Good! Your Spanish sentence now uses the past tense naturally.",
      tip: "Use pretérito for completed past actions.",
      nextStep: "Try another sentence with 'la semana pasada'.",
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
};

const MOCK_DELAY_MS = 600;
const TEACHER_MERCY_AVATAR_SRC = "/teacher-mercy.webp";

function normalizeSpokenText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function ensureTerminalPunctuation(value: string, target: TutorTarget): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/[.!?。！？]$/.test(trimmed)) return trimmed;
  return target === "zh" || target === "ja" ? `${trimmed}。` : `${trimmed}.`;
}

function capitalizeFirst(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
}

function buildInputAwareCorrection(input: string, target: TutorTarget): string {
  const trimmed = input.replace(/\s+/g, " ").trim();
  if (!trimmed) return trimmed;

  switch (target) {
    case "vi": {
      const corrected = trimmed
        .replace(/\bvì mất cái xe đạp\b/i, "vì đã làm mất chiếc xe đạp")
        .replace(/\bvì mất cái mũ đẹp\b/i, "vì đã làm mất chiếc mũ đẹp của mình")
        .replace(/\bcái xe đạp\b/gi, "chiếc xe đạp")
        .replace(/\bcái mũ\b/gi, "chiếc mũ")
        .replace(/\bvì mất\b/gi, "vì đã làm mất");
      return ensureTerminalPunctuation(capitalizeFirst(corrected), target);
    }
    case "fr": {
      const corrected = trimmed
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
    case "en":
    default: {
      const corrected = capitalizeFirst(trimmed)
        .replace(/\b[Ss]he go\b/g, "She goes")
        .replace(/\b[Hh]e go\b/g, "He goes")
        .replace(/\b[Ii] goes\b/g, "I go");
      return ensureTerminalPunctuation(corrected, target);
    }
  }
}

function getTutorTargetFromSearch(search: string): TutorTarget {
  const value = new URLSearchParams(search).get("target")?.toLowerCase();
  if (value === "fr" || value === "french") return "fr";
  if (value === "zh" || value === "chinese" || value === "cn") return "zh";
  if (value === "de" || value === "german") return "de";
  if (value === "ja" || value === "japanese" || value === "jp") return "ja";
  if (value === "ko" || value === "korean" || value === "kr") return "ko";
  if (value === "es" || value === "spanish") return "es";
  if (value === "vi" || value === "vietnamese") return "vi";
  return "en";
}

function getTutorSpeechLang(target: TutorTarget): string {
  switch (target) {
    case "fr":
      return "fr-FR";
    case "zh":
      return "zh-CN";
    case "de":
      return "de-DE";
    case "ja":
      return "ja-JP";
    case "ko":
      return "ko-KR";
    case "es":
      return "es-ES";
    case "vi":
      return "vi-VN";
    case "en":
    default:
      return "en-US";
  }
}

function getExplainLanguage(): ExplainLanguage {
  if (typeof window === "undefined") return "vi";
  try {
    return window.localStorage.getItem("mercyblade.lessonUiLang") === "en" ? "en" : "vi";
  } catch {
    return "vi";
  }
}

export default function AiTutorPage() {
  const shellRef = useRef<HTMLElement | null>(null);

  // ── Display name / greeting ─────────────────────────────────────
  const { user } = useAuth();

  // ── Browser speech-to-text + text-to-speech ──────────────────────
  const [target, setTarget] = useState<TutorTarget>(() =>
    typeof window === "undefined" ? "en" : getTutorTargetFromSearch(window.location.search),
  );
  const [explainLanguage, setExplainLanguage] = useState<ExplainLanguage>(() => getExplainLanguage());
  const speechLang = getTutorSpeechLang(target);
  const stt = useBrowserStt(speechLang);
  const tts = useTtsSpeaker();

  const nickname: string | undefined =
    (user?.user_metadata as Record<string, unknown> | undefined)?.nickname as string | undefined;
  const greetingName = (nickname ?? "").trim() || undefined;

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Practice flow
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceFeedback, setPracticeFeedback] = useState<PracticeFeedback | null>(null);
  const [practiceLoading, setPracticeLoading] = useState(false);

  // ── M3: Learning memory ──────────────────────────────────────────
  const [memoryLoaded, setMemoryLoaded] = useState(false);
  const [memory, setMemory] = useState<MemorySummary | null>(null);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);
  const [isFloatingShell, setIsFloatingShell] = useState(true);
  // speechSupported is now derived from stt.supported (line ~143)

  const targetCopy = TARGET_COPY[target];
  const uiCopy = UI_COPY[explainLanguage];

  // Sync STT transcript → input when listening stops
  const sttInputRef = useRef<string>("");
  const lastCommittedSttRef = useRef<string>("");
  useEffect(() => {
    const transcript = normalizeSpokenText(stt.transcript);
    if (!stt.listening && transcript && transcript !== sttInputRef.current) {
      sttInputRef.current = transcript;
      if (transcript === lastCommittedSttRef.current) return;
      setInput((prev) => {
        const normalizedPrev = normalizeSpokenText(prev);
        const normalizedTranscript = normalizeSpokenText(transcript);
        if (!normalizedTranscript) return prev;
        if (normalizedPrev === normalizedTranscript || normalizedPrev.includes(normalizedTranscript)) {
          lastCommittedSttRef.current = normalizedTranscript;
          return prev;
        }
        if (normalizedTranscript.includes(normalizedPrev)) {
          lastCommittedSttRef.current = normalizedTranscript;
          return normalizedTranscript.slice(0, 500);
        }
        lastCommittedSttRef.current = normalizedTranscript;
        return normalizedPrev ? `${normalizedPrev} ${normalizedTranscript}`.slice(0, 500) : normalizedTranscript.slice(0, 500);
      });
    }
  }, [stt.listening, stt.transcript]);

  const loadMemory = async () => {
    try {
      setMemory(await getMemorySummary());
    } catch {
      // IndexedDB unavailable — degrade silently
    }
    setMemoryLoaded(true);
  };

  useEffect(() => { loadMemory(); }, []);

  useEffect(() => {
    const syncTarget = () => setTarget(getTutorTargetFromSearch(window.location.search));
    syncTarget();
    window.addEventListener("popstate", syncTarget);
    return () => window.removeEventListener("popstate", syncTarget);
  }, []);

  useEffect(() => {
    const syncExplainLanguage = () => setExplainLanguage(getExplainLanguage());
    window.addEventListener("storage", syncExplainLanguage);
    window.addEventListener("focus", syncExplainLanguage);
    return () => {
      window.removeEventListener("storage", syncExplainLanguage);
      window.removeEventListener("focus", syncExplainLanguage);
    };
  }, []);

  // speechSupported now comes from stt.supported (useBrowserStt hook)
  // useEffect(() => {
  //   setSpeechSupported(hasSpeechRecognitionSupport());
  // }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return undefined;

    const detectLayoutMode = () => {
      const shellWidth = shell.getBoundingClientRect().width;
      const explicitFloatingShell = Boolean(
        shell.parentElement?.closest(
          [
            "[data-floating-shell]",
            "[data-ai-tutor-floating-shell]",
            "[data-mercy-floating-shell]",
            ".ai-tutor-floating-shell",
            ".mercy-floating-shell",
          ].join(","),
        ),
      );

      setIsFloatingShell(explicitFloatingShell || shellWidth < 1040);
    };

    detectLayoutMode();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", detectLayoutMode);
      return () => window.removeEventListener("resize", detectLayoutMode);
    }

    const observer = new ResizeObserver(detectLayoutMode);
    observer.observe(shell);

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setError(null);
    setLoading(true);
    setResult(null);
    setPracticeAnswer("");
    setPracticeFeedback(null);

    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));

    const next = MOCK_RESULTS_BY_TARGET[target];
    const corrected = buildInputAwareCorrection(trimmed, target);
    setResult({
      corrected,
      explanation: next.explanation[explainLanguage],
      grammarTip: next.grammarTip[explainLanguage],
      practicePrompt: next.practicePrompt[explainLanguage],
    });
    setLoading(false);

    // M3: Save correction to IndexedDB
    const id = `corr-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    setLastSavedId(id);
    putCorrection({
      id,
      original: trimmed,
      corrected,
      topic: next.grammarTip[explainLanguage].slice(0, 60),
      cefr: "B1",
      createdAt: Date.now(),
      practiced: false,
    }).then(() => loadMemory()).catch(() => {});
  };

  const handlePracticeSubmit = async () => {
    if (!practiceAnswer.trim()) return;
    setPracticeLoading(true);
    setPracticeFeedback(null);

    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));

    const mock = MOCK_RESULTS_BY_TARGET[target];
    setPracticeFeedback(mock.feedback);
    setPracticeLoading(false);

    // M3: Mark last saved correction as practiced
    if (lastSavedId) {
      markPracticed(lastSavedId).then(() => loadMemory()).catch(() => {});
    }
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
    setError(null);
    setPracticeAnswer("");
    setPracticeFeedback(null);
  };

  const charCount = input.length;
  const isEmpty = !input.trim();
  const hasResult = Boolean(result && !loading);

  return (
    <main
      ref={shellRef}
      data-testid="ai-tutor-shell"
      data-floating-shell={isFloatingShell ? "true" : "false"}
      className="ai-tutor-shell mx-auto min-h-[calc(100vh-72px)] w-full max-w-full px-4 py-6 sm:px-6 lg:px-8"
    >
      <style>{`
        .ai-tutor-shell {
          container-type: inline-size;
          padding-left: 0.75rem;
          padding-right: 0.75rem;
        }
        @media (min-width: 640px) {
          .ai-tutor-shell {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        .ai-tutor-result-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 1.25rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
        }
        @container (min-width: 1040px) {
          .ai-tutor-shell[data-floating-shell="false"] .ai-tutor-result-layout[data-expanded="true"] {
            grid-template-columns: minmax(320px, 420px) minmax(0, 1fr);
            align-items: start;
          }
        }
        .ai-tutor-shell[data-floating-shell="true"] .ai-tutor-result-layout[data-expanded="true"] {
          grid-template-columns: minmax(0, 1fr);
        }
        .ai-tutor-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .ai-tutor-copy {
          overflow-wrap: break-word;
          word-break: normal;
        }
        .ai-tutor-memory-card {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow: hidden;
        }
        .ai-tutor-memory-pill-list {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 0.5rem;
        }
        .ai-tutor-memory-pill {
          min-width: 0;
          max-width: 100%;
          white-space: normal;
          overflow-wrap: break-word;
        }
        @container (min-width: 560px) {
          .ai-tutor-memory-pill-list {
            display: flex;
            flex-wrap: wrap;
          }
        }
        @container (max-width: 360px) {
          .ai-tutor-shell-title {
            font-size: 1.5rem;
            line-height: 2rem;
          }
          .ai-tutor-shell-copy {
            font-size: 0.8125rem;
            line-height: 1.25rem;
          }
        }
      `}</style>
      {/* Header */}
      <section className="mx-auto mb-6 w-full max-w-3xl text-center" data-testid="ai-tutor-header">
        <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full border border-indigo-100 bg-white p-1 shadow-sm sm:h-32 sm:w-32">
          <img
            src={TEACHER_MERCY_AVATAR_SRC}
            alt="Teacher Mercy"
            className="h-full w-full rounded-full object-cover"
            data-testid="ai-tutor-mercy-avatar"
          />
        </div>
        {/* Greeting — uses nickname, never email */}
        <div className="mb-3 text-sm font-bold text-slate-600" data-testid="ai-tutor-greeting">
          {greetingName ? (
            <>
              Chào {greetingName} · Hi {greetingName}
            </>
          ) : (
            <>
              Chào bạn · Hi there
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <h1 className="ai-tutor-shell-title text-2xl font-black text-slate-950 sm:text-3xl">
            {uiCopy.title(targetCopy, target)}
          </h1>
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-black uppercase text-indigo-700">
            {targetCopy.eyebrow}
          </span>
          <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-black uppercase text-amber-700">
            Mock
          </span>
        </div>
        <p className="ai-tutor-copy ai-tutor-shell-copy mt-2 text-sm font-medium text-slate-500">
          {uiCopy.subtitle(targetCopy)}
        </p>
        <p className="ai-tutor-copy mt-1 text-xs text-slate-400">
          {uiCopy.helper(targetCopy)}
        </p>
      </section>

      {/* ── M3: Aggregate memory reminder card ──────────────────── */}
      {memoryLoaded && memory && memory.totalCorrections > 0 && (
        <section
          data-testid="ai-tutor-memory-card"
          className="ai-tutor-memory-card mx-auto mb-5 rounded-[16px] border border-indigo-100 bg-white p-4 shadow-sm"
        >
          <div className="text-xs font-black uppercase text-indigo-500">
            Học tập gần đây · Recent Learning
          </div>
          <div className="ai-tutor-memory-pill-list mt-1.5 text-xs">
            <span className="ai-tutor-copy ai-tutor-memory-pill font-bold text-slate-700">
              {memory.totalCorrections} câu đã sửa
            </span>
            <span className="ai-tutor-copy ai-tutor-memory-pill font-medium text-slate-500">
              {memory.practicedCount} đã luyện tập
            </span>
          </div>
          <div className="ai-tutor-memory-pill-list mt-2 text-[11px]">
            {memory.strongestTopic && (
              <span className="ai-tutor-memory-pill rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700">
                Mạnh nhất: {memory.strongestTopic}
              </span>
            )}
            {memory.topicNeedingReview && (
              <span className="ai-tutor-memory-pill rounded-full bg-amber-50 px-2.5 py-1 font-bold text-amber-700">
                Cần ôn: {memory.topicNeedingReview}
              </span>
            )}
            {memory.lastPracticedTopic && (
              <span className="ai-tutor-memory-pill rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                Gần nhất: {memory.lastPracticedTopic}
              </span>
            )}
          </div>
          {memory.suggestedNextFocus && (
            <div className="ai-tutor-copy mt-2 text-xs font-medium text-indigo-600">
              Gợi ý tiếp theo: {memory.suggestedNextFocus}
            </div>
          )}
        </section>
      )}

      {/* ── M3: Empty memory state ────────────────────────────────── */}
      {memoryLoaded && memory && memory.totalCorrections === 0 && (
        <section
          data-testid="ai-tutor-memory-empty"
          className="mx-auto mb-5 w-full max-w-[720px] rounded-[16px] border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center"
        >
          <div className="text-xs font-medium text-slate-400">
            Chưa có lịch sử sửa câu. Gửi câu đầu tiên để bắt đầu!
          </div>
        </section>
      )}

      <div
        data-testid="ai-tutor-layout"
        data-expanded={hasResult ? "true" : "false"}
        className={`ai-tutor-result-layout ${hasResult ? "" : "mx-auto max-w-[720px]"}`}
      >
        <div className="min-w-0">
          {/* Input area */}
          <section className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="text-xs font-black uppercase text-slate-500">
                {uiCopy.inputLabel(targetCopy)}
              </label>
              <span className="shrink-0 text-[11px] font-medium text-slate-400">
                {charCount} / 500
              </span>
            </div>

            <textarea
              value={input}
              onChange={(e) => {
                if (e.target.value.length <= 500) setInput(e.target.value);
              }}
              placeholder={targetCopy.placeholder}
              rows={4}
              className="w-full min-w-0 resize-none rounded-[14px] border border-slate-200 bg-slate-50 p-4 text-[15px] leading-relaxed text-slate-900 placeholder-slate-400 transition focus:border-indigo-300 focus:bg-white focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleSubmit();
                }
              }}
            />

            <div className="ai-tutor-actions mt-3">
              {stt.supported ? (
                <button
                  type="button"
                  onClick={() => (stt.listening ? stt.stop() : stt.start())}
                  className={`min-h-[44px] w-full rounded-full border px-4 py-2.5 text-sm font-black transition ${
                    stt.listening
                      ? "border-red-300 bg-red-50 text-red-700"
                      : "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  }`}
                  aria-label={stt.listening ? uiCopy.micAriaStop : uiCopy.micAriaStart}
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <Mic className="h-4 w-4" aria-hidden />
                    {stt.listening ? uiCopy.micListening : uiCopy.micInput}
                  </span>
                </button>
              ) : (
                <div
                  role="status"
                  className="min-h-[44px] w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-xs font-bold text-slate-500"
                  data-testid="ai-tutor-mic-fallback"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <MicOff className="h-4 w-4" aria-hidden />
                    {uiCopy.micUnavailable}
                  </span>
                </div>
              )}
              <p className="w-full text-xs font-medium leading-5 text-slate-500">
                {uiCopy.micHelper}
              </p>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isEmpty || loading}
                className="min-h-[48px] w-full flex-1 rounded-full bg-slate-900 px-4 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {uiCopy.submitting}
                  </span>
                ) : (
                  uiCopy.submit
                )}
              </button>

              {result && !loading && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="min-h-[48px] w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
                >
                  {uiCopy.reset}
                </button>
              )}
            </div>
          </section>

          {/* Error state */}
          {error && (
            <section className="mt-4 rounded-[16px] border border-rose-200 bg-rose-50 p-5">
              <div className="text-sm font-black text-rose-700">Lỗi · Error</div>
              <p className="mt-1 text-sm font-medium text-rose-600">{error}</p>
            </section>
          )}

          {/* Empty state */}
          {!result && !loading && !error && (
            <section className="mt-5 rounded-[18px] border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
              <div className="text-3xl">✨</div>
              <div className="mt-2 text-sm font-black text-slate-600">
                {uiCopy.emptyTitle}
              </div>
              <div className="mt-1 text-xs font-medium text-slate-400">
                {uiCopy.emptyBody(targetCopy)}
              </div>
            </section>
          )}

          {/* Loading state */}
          {loading && (
            <section className="mt-4 rounded-[16px] border border-indigo-100 bg-indigo-50/60 p-6 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200 border-t-indigo-500" />
              <div className="mt-3 text-sm font-black text-indigo-700">
                {uiCopy.loadingTitle}
              </div>
              <div className="mt-1 text-xs font-medium text-indigo-400">
                {uiCopy.loadingBody}
              </div>
            </section>
          )}
        </div>

        {/* Result */}
        {result && !loading && (
          <section className="grid min-w-0 gap-4">
            {/* Corrected */}
            <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 p-5">
              <div className="mb-2 text-xs font-black uppercase text-emerald-600">
                {uiCopy.correctedLabel}
              </div>
              <div className="text-xl font-black leading-snug text-emerald-900">
                {result.corrected}
              </div>
              {/* TTS speaker button */}
              {!tts.supported && (
                <div className="mt-2 text-[11px] text-slate-400">
                  🔊 {uiCopy.ttsUnavailable}
                </div>
              )}
              {tts.supported && (
                <button
                  type="button"
                  onClick={() => (tts.speaking ? tts.stop() : tts.speak(result.corrected, speechLang))}
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                    tts.speaking
                      ? "border-red-300 bg-red-50 text-red-700"
                      : "border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50"
                  }`}
                  aria-label={tts.speaking ? uiCopy.ttsAriaStop : uiCopy.ttsAriaPlay}
                >
                  {tts.speaking ? (
                    <Square className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5" aria-hidden />
                  )}
                  {tts.speaking ? uiCopy.ttsStop : uiCopy.ttsPlay}
                </button>
              )}
            </div>

            {/* Explanation */}
            <div className="rounded-[16px] border border-slate-200 bg-white p-5">
              <div className="mb-2 text-xs font-black uppercase text-slate-500">
                {uiCopy.explanationLabel}
              </div>
              <p className="text-sm font-semibold leading-6 text-slate-700">
                {result.explanation}
              </p>
            </div>

            {/* Grammar tip */}
            <div className="rounded-[16px] border border-indigo-100 bg-indigo-50/50 p-5">
              <div className="mb-2 text-xs font-black uppercase text-indigo-500">
                {uiCopy.grammarTipLabel}
              </div>
              <p className="text-sm font-semibold leading-6 text-indigo-800">
                {result.grammarTip}
              </p>
            </div>

            {/* Practice section */}
            {!practiceFeedback && (
              <div className="rounded-[18px] border border-violet-200 bg-violet-50/50 p-5">
                <div className="mb-2 text-xs font-black uppercase text-violet-600">
                  {uiCopy.practiceLabel}
                </div>
                <p className="text-sm font-semibold leading-6 text-slate-700">
                  {result.practicePrompt}
                </p>

                <textarea
                  value={practiceAnswer}
                  onChange={(e) => setPracticeAnswer(e.target.value)}
                  placeholder={uiCopy.practicePlaceholder}
                  rows={3}
                  className="mt-3 w-full min-w-0 resize-none rounded-[12px] border border-violet-200 bg-white p-3 text-[14px] leading-relaxed text-slate-900 placeholder-slate-400 transition focus:border-violet-400 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={handlePracticeSubmit}
                  disabled={!practiceAnswer.trim() || practiceLoading}
                  className="mt-3 min-h-[44px] w-full rounded-full bg-violet-700 px-4 py-2.5 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-violet-200 disabled:text-violet-400"
                >
                  {practiceLoading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      {uiCopy.practiceSubmitting}
                    </span>
                  ) : (
                    uiCopy.practiceSubmit
                  )}
                </button>
              </div>
            )}

            {/* Practice feedback */}
            {practiceFeedback && (
              <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 p-5">
                <div className="mb-2 text-xs font-black uppercase text-emerald-600">
                  {uiCopy.feedbackLabel}
                </div>
                <p className="text-sm font-bold leading-6 text-emerald-800">
                  {practiceFeedback.encouragement}
                </p>
                <div className="mt-3 rounded-[12px] bg-white/70 p-3">
                  <div className="text-xs font-black uppercase text-slate-500">{uiCopy.tipLabel}</div>
                  <p className="mt-1 text-sm font-medium leading-6 text-slate-700">{practiceFeedback.tip}</p>
                </div>
                <div className="mt-3 rounded-[12px] bg-white/70 p-3">
                  <div className="text-xs font-black uppercase text-slate-500">{uiCopy.nextStepLabel}</div>
                  <p className="mt-1 text-sm font-medium leading-6 text-slate-700">{practiceFeedback.nextStep}</p>
                </div>

                <button
                  type="button"
                  onClick={handleClear}
                  className="mt-4 min-h-[48px] w-full rounded-full border border-emerald-300 bg-white px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                >
                  {uiCopy.tryAnother}
                </button>
              </div>
            )}

            {/* Try another (when practice not yet submitted) */}
            {!practiceFeedback && (
              <button
                type="button"
                onClick={handleClear}
                className="min-h-[48px] rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                {uiCopy.tryAnother}
              </button>
            )}
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-[11px] font-medium text-slate-300">
        {uiCopy.footer}
      </footer>
    </main>
  );
}
