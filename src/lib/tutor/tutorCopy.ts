import { TUTOR_LANGUAGE_PACKS } from "./languages";

export type TutorTarget = "en" | "fr" | "zh" | "de" | "ja" | "ko" | "es" | "vi";
export type TutorUiLanguage = "vi" | "en";

export type TutorLanguagePack = {
  code: TutorTarget;
  nameEn: string;
  nameVi: string;
  correctionTitle: string;
  conversationTitle: string;
  inputLabel: string;
  placeholder: string;
  fallbackMessages: {
    correctionRequired: string;
    emptyConversation: string;
    voiceUnavailable: string;
  };
  exampleSentences: string[];
  starterQuestions: string[];
  commonBeginnerMistakes: string[];
  grammarHints: string[];
  nextQuestionTemplates: string[];
  naturalReplies: string[];
  speakerLabels: {
    tutor: string;
    learner: string;
    correctedVersion: string;
    shortExplanation: string;
    naturalReply: string;
    thinking: string;
  };
  micLabels: {
    input: string;
    listening: string;
    helper: string;
    unavailable: string;
    ariaStart: string;
    ariaStop: string;
  };
};

export type TutorCopy = TutorLanguagePack & {
  targetLanguage: TutorTarget;
  uiLanguage: TutorUiLanguage;
  ui: {
    title: string;
    subtitle: string;
    helper: string;
    eyebrow: string;
    inputLabel: string;
    submit: string;
    submitting: string;
    reset: string;
    emptyTitle: string;
    emptyBody: string;
    loadingTitle: string;
    loadingBody: string;
    correctedLabel: string;
    errorLabel: string;
    ttsUnavailable: string;
    ttsPreparing: string;
    ttsBrowserFallback: string;
    ttsMercyVoiceLabel: string;
    ttsDeviceVoiceFallbackLabel: string;
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
    conversationTitle: string;
    conversationEyebrow: string;
    conversationBody: string;
    emptyConversation: string;
    conversationMercyLabel: string;
    conversationUserLabel: string;
    conversationCorrectedLabel: string;
    conversationExplanationLabel: string;
    conversationReplyLabel: string;
    conversationThinking: string;
    answerLabel: string;
    answerPlaceholder: string;
    send: string;
    micInput: string;
    micListening: string;
    micHelper: string;
    micUnavailable: string;
    micAriaStart: string;
    micAriaStop: string;
    footer: string;
    conversationModeTab: string;
    correctionModeTab: string;
    speakModeTab: string;
    logicModeTab: string;
  };
};

function normalizeTargetLanguage(value: unknown): TutorTarget {
  const target = String(value ?? "").trim().toLowerCase();
  if (target === "fr" || target === "french") return "fr";
  if (target === "zh" || target === "chinese" || target === "cn") return "zh";
  if (target === "de" || target === "german") return "de";
  if (target === "ja" || target === "japanese" || target === "jp") return "ja";
  if (target === "ko" || target === "korean" || target === "kr") return "ko";
  if (target === "es" || target === "spanish") return "es";
  if (target === "vi" || target === "vietnamese") return "vi";
  return "en";
}

function normalizeUiLanguage(value: unknown): TutorUiLanguage {
  return String(value ?? "").trim().toLowerCase() === "en" ? "en" : "vi";
}

export function getTutorCopy(targetLanguage: unknown, uiLanguage: unknown): TutorCopy {
  const target = normalizeTargetLanguage(targetLanguage);
  const ui = normalizeUiLanguage(uiLanguage);
  const pack = TUTOR_LANGUAGE_PACKS[target] ?? TUTOR_LANGUAGE_PACKS.en;

  const uiCopy = ui === "en"
    ? {
        title: target === "en" ? "Teacher Mercy AI Tutor" : `Teacher Mercy · ${pack.nameEn} Tutor`,
        subtitle: `Practice ${pack.nameEn} with Mercy. Write a ${pack.nameEn} sentence; Mercy corrects it and explains in English.`,
        helper: `Mercy corrects the selected target language: ${pack.nameEn}.`,
        eyebrow: target === "en" ? "New AI Tutor" : `AI Tutor · ${pack.nameEn}`,
        inputLabel: `Your ${pack.nameEn} sentence`,
        submit: "Correct my sentence",
        submitting: "Correcting...",
        reset: "Reset",
        emptyTitle: "AI is ready to correct your sentence",
        emptyBody: `Type a ${pack.nameEn} sentence above and press Correct my sentence.`,
        loadingTitle: "AI is analyzing your sentence...",
        loadingBody: "Mercy will correct the language you selected.",
        correctedLabel: "Corrected",
        errorLabel: "Error",
        ttsUnavailable: "Browser voice playback is not supported on this device.",
        ttsPreparing: "Preparing Mercy voice...",
        ttsBrowserFallback: "Mercy voice unavailable. Using device voice.",
        ttsMercyVoiceLabel: "Mercy voice",
        ttsDeviceVoiceFallbackLabel: "Device voice fallback",
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
        conversationTitle: pack.conversationTitle,
        conversationEyebrow: "Mercy asks · You answer",
        conversationBody: `Practice in ${pack.nameEn}. Mercy corrects gently, replies naturally, and asks one next question.`,
        emptyConversation: "Mercy will start with one easy question.",
        conversationMercyLabel: "Teacher Mercy",
        conversationUserLabel: "You",
        conversationCorrectedLabel: "Corrected version",
        conversationExplanationLabel: "Short explanation",
        conversationReplyLabel: "Natural reply",
        conversationThinking: "Mercy is thinking...",
        answerLabel: "Your answer",
        answerPlaceholder: `Type your ${pack.nameEn} answer here...`,
        send: "Send",
        micInput: "Speak your sentence",
        micListening: "Listening to your voice...",
        micHelper: "Mercy turns your voice into text for correction.",
        micUnavailable: "Microphone unavailable in this browser. You can still type your sentence.",
        micAriaStart: "Speak your sentence for voice input",
        micAriaStop: "Stop listening",
        footer: "Mock UI - no real AI provider calls are made.",
        conversationModeTab: "Journey",
        correctionModeTab: "Grammar",
        speakModeTab: "Speak",
        logicModeTab: "Logic",
      }
    : {
        title: target === "en" ? "Teacher Mercy AI Tutor" : `Teacher Mercy · Gia sư ${pack.nameVi}`,
        subtitle: `Luyện ${pack.nameVi} với Mercy. Viết một câu ${pack.nameVi}, Mercy sẽ sửa và giải thích bằng tiếng Việt.`,
        helper: `Mercy sửa đúng ${pack.nameVi}; phần giải thích và mẹo học dùng tiếng Việt.`,
        eyebrow: target === "en" ? "New AI Tutor" : `AI Tutor ${pack.nameVi}`,
        inputLabel: `Câu ${pack.nameVi} của bạn`,
        submit: "Sửa câu này",
        submitting: "Đang sửa...",
        reset: "Làm mới",
        emptyTitle: "AI sẵn sàng sửa câu của bạn",
        emptyBody: `Gõ một câu ${pack.nameVi} bên trên và nhấn Sửa câu này.`,
        loadingTitle: "AI đang phân tích câu của bạn...",
        loadingBody: "Mercy sẽ sửa đúng ngôn ngữ bạn chọn.",
        correctedLabel: "Câu đã sửa",
        errorLabel: "Lỗi",
        ttsUnavailable: "Giọng đọc trình duyệt chưa khả dụng trên thiết bị này.",
        ttsPreparing: "Đang chuẩn bị giọng Mercy...",
        ttsBrowserFallback: "Giọng Mercy chưa khả dụng. Đang dùng giọng thiết bị.",
        ttsMercyVoiceLabel: "Mercy voice",
        ttsDeviceVoiceFallbackLabel: "Device voice fallback",
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
        conversationTitle: "Trò chuyện với Mercy",
        conversationEyebrow: "Mercy hỏi · Bạn trả lời",
        conversationBody: `Luyện ${pack.nameVi}. Mercy sửa nhẹ nhàng, trả lời tự nhiên, rồi hỏi tiếp một câu.`,
        emptyConversation: "Mercy sẽ bắt đầu bằng một câu hỏi dễ.",
        conversationMercyLabel: "Teacher Mercy",
        conversationUserLabel: "Bạn",
        conversationCorrectedLabel: "Câu đã sửa",
        conversationExplanationLabel: "Giải thích ngắn",
        conversationReplyLabel: "Câu trả lời tự nhiên",
        conversationThinking: "Mercy đang suy nghĩ...",
        answerLabel: "Câu trả lời của bạn",
        answerPlaceholder: `Gõ câu trả lời ${pack.nameVi} của bạn ở đây...`,
        send: "Gửi",
        micInput: "Nói câu của bạn",
        micListening: "Đang nghe giọng của bạn...",
        micHelper: "Mercy sẽ chuyển giọng nói của bạn thành câu để sửa.",
        micUnavailable: "Không dùng được micro trên trình duyệt này. Bạn vẫn có thể gõ câu.",
        micAriaStart: "Nói câu của bạn để nhập bằng giọng nói",
        micAriaStop: "Dừng nghe",
        footer: "Giao diện thử nghiệm - chưa gọi nhà cung cấp AI thật.",
        conversationModeTab: "Journey",
        correctionModeTab: "Grammar",
        speakModeTab: "Speak",
        logicModeTab: "Logic",
      };

  return {
    ...pack,
    targetLanguage: target,
    uiLanguage: ui,
    ui: uiCopy,
  };
}
