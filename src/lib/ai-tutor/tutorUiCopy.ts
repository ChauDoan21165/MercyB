// src/lib/ai-tutor/tutorUiCopy.ts
// Target-language copy, mock results, and text helpers.
// Extracted from AiTutor.tsx for reuse across components.

export type TutorTarget = "en" | "fr" | "zh" | "de" | "ja" | "ko" | "es" | "vi";
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

export type TutorTargetCopy = {
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

export type UiCopy = {
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
  ttsPreparing: string;
  ttsBrowserFallback: string;
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

export const TARGET_COPY: Record<TutorTarget, TutorTargetCopy> = {
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

export const UI_COPY: Record<ExplainLanguage, UiCopy> = {
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
    ttsPreparing: "Đang chuẩn bị giọng Mercy...",
    ttsBrowserFallback: "Giọng Mercy chưa khả dụng. Đang dùng giọng thiết bị.",
    ttsPlay: "Mercy đọc",
    ttsStop: "Dừng",
    ttsAriaPlay: "Mercy đọc câu đã sửa bằng giọng AI",
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
    ttsPreparing: "Preparing Mercy voice...",
    ttsBrowserFallback: "Mercy voice is unavailable. Using device voice.",
    ttsPlay: "Mercy reads",
    ttsStop: "Stop",
    ttsAriaPlay: "Read corrected sentence with Mercy AI voice",
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

export function getTutorTargetFromSearch(search: string): TutorTarget {
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

export function getTutorSpeechLang(target: TutorTarget): string {
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

export function getExplainLanguage(): ExplainLanguage {
  if (typeof window === "undefined") return "vi";
  try {
    return window.localStorage.getItem("mercyblade.lessonUiLang") === "en" ? "en" : "vi";
  } catch {
    return "vi";
  }
}
