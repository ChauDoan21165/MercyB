import { TUTOR_LANGUAGE_PACKS } from "./languages";
import {
  getTutorLanguage,
  resolveTutorTargetLanguage,
  type TutorLanguageCode,
} from "./languageRegistry";

export type TutorTarget = TutorLanguageCode;
export type TutorUiLanguage = "vi" | "en";

export type TutorLanguagePack = {
  code: TutorTarget;
  nameEn: string;
  nameVi: string;
  correctionTitle: string;
  conversationTitle: string;
  inputLabel: string;
  placeholder: string;
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
    footer: string;
    inputLabel: string;
    correctionTitle: string;
    conversationTitle: string;
    conversationEyebrow: string;
    conversationBody: string;
    conversationDescription: string;
    conversationEmpty: string;
    conversationThinking: string;
    conversationInputLabel: string;
    conversationPlaceholder: string;
    conversationSend: string;
    conversationMercyLabel: string;
    conversationUserLabel: string;
    conversationCorrectedLabel: string;
    conversationExplanationLabel: string;
    conversationReplyLabel: string;
    emptyConversation: string;
    answerLabel: string;
    answerPlaceholder: string;
    send: string;
    submit: string;
    submitting: string;
    reset: string;
    emptyTitle: string;
    emptyBody: string;
    loadingTitle: string;
    loadingBody: string;
    correctedLabel: string;
    ttsUnavailable: string;
    ttsAriaStop: string;
    ttsAriaPlay: string;
    ttsPreparing: string;
    ttsStop: string;
    ttsPlay: string;
    ttsBrowserFallback: string;
    ttsMercyVoiceLabel: string;
    ttsDeviceVoiceFallbackLabel: string;
    explanationLabel: string;
    grammarTipLabel: string;
    practiceLabel: string;
    practicePlaceholder: string;
    practiceSubmitting: string;
    practiceSubmit: string;
    feedbackLabel: string;
    tipLabel: string;
    nextStepLabel: string;
    tryAnother: string;
    journeyModeLabel: string;
    grammarModeLabel: string;
    speakModeLabel: string;
    logicModeLabel: string;
    journeyTitle: string;
    journeyDescription: string;
    speakTitle: string;
    speakDescription: string;
    speakInputLabel: string;
    speakPlaceholder: string;
    speakSend: string;
    logicTitle: string;
    logicDescription: string;
    logicInputLabel: string;
    logicPlaceholder: string;
    logicSend: string;
  };
};

function normalizeTargetLanguage(value: unknown): TutorTarget {
  return resolveTutorTargetLanguage(value);
}

function normalizeUiLanguage(value: unknown): TutorUiLanguage {
  return String(value ?? "").trim().toLowerCase() === "en" ? "en" : "vi";
}

export function getTutorCopy(targetLanguage: unknown, uiLanguage: unknown): TutorCopy {
  const target = normalizeTargetLanguage(targetLanguage);
  const ui = normalizeUiLanguage(uiLanguage);
  const packs = TUTOR_LANGUAGE_PACKS;
  const pack = packs[target] ?? packs.en;
  const language = getTutorLanguage(target);

  const uiCopy = ui === "en"
    ? {
        title: target === "en" ? "Teacher Mercy AI Tutor" : `Teacher Mercy · ${pack.nameEn} Tutor`,
        subtitle: `Practice ${pack.nameEn} with Mercy. Write a ${pack.nameEn} sentence; Mercy corrects it and explains in English.`,
        helper: `Mercy corrects the selected target language: ${pack.nameEn}.`,
        eyebrow: "Teacher Mercy",
        footer: "Mock UI - no real AI provider calls are made.",
        inputLabel: `Your ${pack.nameEn} sentence`,
        correctionTitle: pack.correctionTitle,
        conversationTitle: pack.conversationTitle,
        conversationEyebrow: "Mercy asks · You answer",
        conversationBody: `Practice in ${pack.nameEn}. Mercy corrects gently, replies naturally, and asks one next question.`,
        conversationDescription: `Practice in ${pack.nameEn}. Mercy corrects gently, replies naturally, and asks one next question.`,
        conversationEmpty: "Mercy will start with one easy question.",
        conversationThinking: "Mercy is thinking...",
        conversationInputLabel: "Your answer",
        conversationPlaceholder: `Type your ${pack.nameEn} answer here...`,
        conversationSend: "Send",
        conversationMercyLabel: "Mercy",
        conversationUserLabel: "You",
        conversationCorrectedLabel: "Corrected",
        conversationExplanationLabel: "Explanation",
        conversationReplyLabel: "Mercy reply",
        emptyConversation: "Mercy will start with one easy question.",
        answerLabel: "Your answer",
        answerPlaceholder: `Type your ${pack.nameEn} answer here...`,
        send: "Send",
        submit: "Correct my sentence",
        submitting: "Correcting...",
        reset: "Reset",
        emptyTitle: "AI is ready to correct your sentence",
        emptyBody: `Type a ${pack.nameEn} sentence above and press Correct my sentence.`,
        loadingTitle: "AI is analyzing your sentence...",
        loadingBody: "Mercy will correct the language you selected.",
        correctedLabel: "Corrected",
        ttsUnavailable: "Browser voice playback is not supported on this device.",
        ttsAriaStop: "Stop Mercy voice",
        ttsAriaPlay: "Read corrected sentence with Mercy AI voice",
        ttsPreparing: "Preparing Mercy voice...",
        ttsStop: "Stop",
        ttsPlay: "Mercy reads",
        ttsBrowserFallback: "Mercy voice unavailable. Using device voice.",
        ttsMercyVoiceLabel: "Mercy voice",
        ttsDeviceVoiceFallbackLabel: "Device voice fallback",
        explanationLabel: "Explanation",
        grammarTipLabel: "Grammar tip",
        practiceLabel: "Practice",
        practicePlaceholder: "Write your answer here...",
        practiceSubmitting: "Checking...",
        practiceSubmit: "Submit answer",
        feedbackLabel: "Feedback",
        tipLabel: "Tip",
        nextStepLabel: "Next step",
        tryAnother: "Try another sentence",
        journeyModeLabel: "Journey",
        grammarModeLabel: "Grammar",
        speakModeLabel: "Speak",
        logicModeLabel: "Logic",
        journeyTitle: "Journey practice",
        journeyDescription: `Conversation practice in ${pack.nameEn}. Mercy corrects gently, replies naturally, and asks the next question.`,
        speakTitle: "Speak practice",
        speakDescription: `Use the mic to say a ${pack.nameEn} sentence. Mercy helps you hear and improve the natural version.`,
        speakInputLabel: "Sentence to practice aloud",
        speakPlaceholder: `Speak or type a ${pack.nameEn} sentence for Mercy...`,
        speakSend: "Practice speaking",
        logicTitle: "Logic coach",
        logicDescription: `Ask why a ${pack.nameEn} correction works. Mercy explains the pattern clearly.`,
        logicInputLabel: "Ask why",
        logicPlaceholder: `Ask Mercy why a ${pack.nameEn} sentence works this way...`,
        logicSend: "Explain why",
      }
    : {
        title: target === "en" ? "Teacher Mercy AI Tutor" : `Teacher Mercy · Gia sư ${pack.nameVi}`,
        subtitle: `Luyện ${pack.nameVi} với Mercy. Viết một câu ${pack.nameVi}, Mercy sẽ sửa và giải thích bằng tiếng Việt.`,
        helper: `Mercy sửa đúng ${pack.nameVi}; phần giải thích và mẹo học dùng tiếng Việt.`,
        eyebrow: "Teacher Mercy",
        footer: "Giao diện thử nghiệm - chưa gọi nhà cung cấp AI thật.",
        inputLabel: `Câu ${pack.nameVi} của bạn`,
        correctionTitle: pack.correctionTitle,
        conversationTitle: "Trò chuyện với Mercy",
        conversationEyebrow: "Mercy hỏi · Bạn trả lời",
        conversationBody: `Luyện ${pack.nameVi}. Mercy sửa nhẹ nhàng, trả lời tự nhiên, rồi hỏi tiếp một câu.`,
        conversationDescription: `Luyện ${pack.nameVi}. Mercy sửa nhẹ nhàng, trả lời tự nhiên, rồi hỏi tiếp một câu.`,
        conversationEmpty: "Mercy sẽ bắt đầu bằng một câu hỏi dễ.",
        conversationThinking: "Mercy đang nghĩ...",
        conversationInputLabel: "Câu trả lời của bạn",
        conversationPlaceholder: `Gõ câu trả lời ${pack.nameVi} của bạn ở đây...`,
        conversationSend: "Gửi",
        conversationMercyLabel: "Mercy",
        conversationUserLabel: "Bạn",
        conversationCorrectedLabel: "Câu đã sửa",
        conversationExplanationLabel: "Giải thích",
        conversationReplyLabel: "Mercy trả lời",
        emptyConversation: "Mercy sẽ bắt đầu bằng một câu hỏi dễ.",
        answerLabel: "Câu trả lời của bạn",
        answerPlaceholder: `Gõ câu trả lời ${pack.nameVi} của bạn ở đây...`,
        send: "Gửi",
        submit: "Sửa câu này",
        submitting: "Đang sửa...",
        reset: "Làm mới",
        emptyTitle: "AI sẵn sàng sửa câu của bạn",
        emptyBody: `Gõ một câu ${pack.nameVi} bên trên và nhấn Sửa câu này.`,
        loadingTitle: "AI đang phân tích câu của bạn...",
        loadingBody: "Mercy sẽ sửa đúng ngôn ngữ bạn chọn.",
        correctedLabel: "Câu đã sửa",
        ttsUnavailable: "Giọng đọc trình duyệt chưa khả dụng trên thiết bị này.",
        ttsAriaStop: "Dừng đọc",
        ttsAriaPlay: "Mercy đọc câu đã sửa bằng giọng AI",
        ttsPreparing: "Preparing Mercy voice...",
        ttsStop: "Dừng",
        ttsPlay: "Mercy đọc",
        ttsBrowserFallback: "Mercy voice unavailable. Using device voice.",
        ttsMercyVoiceLabel: "Mercy voice",
        ttsDeviceVoiceFallbackLabel: "Device voice fallback",
        explanationLabel: "Giải thích",
        grammarTipLabel: "Mẹo ngữ pháp",
        practiceLabel: "Luyện tập",
        practicePlaceholder: "Viết câu trả lời của bạn ở đây...",
        practiceSubmitting: "Đang kiểm tra...",
        practiceSubmit: "Gửi câu trả lời",
        feedbackLabel: "Nhận xét",
        tipLabel: "Mẹo",
        nextStepLabel: "Bước tiếp theo",
        tryAnother: "Sửa câu khác",
        journeyModeLabel: "Journey",
        grammarModeLabel: "Grammar",
        speakModeLabel: "Speak",
        logicModeLabel: "Logic",
        journeyTitle: "Lộ trình luyện tập",
        journeyDescription: `Trò chuyện bằng ${pack.nameVi}. Mercy sửa nhẹ nhàng, trả lời tự nhiên, rồi hỏi tiếp một câu.`,
        speakTitle: "Luyện nói",
        speakDescription: `Dùng micro để nói một câu ${pack.nameVi}. Mercy giúp bạn nghe và sửa câu tự nhiên hơn.`,
        speakInputLabel: "Câu để luyện nói",
        speakPlaceholder: `Nói hoặc gõ một câu ${pack.nameVi} cho Mercy...`,
        speakSend: "Luyện nói",
        logicTitle: "Giải thích vì sao",
        logicDescription: `Hỏi vì sao một câu ${pack.nameVi} đúng hơn. Mercy giải thích quy tắc bằng tiếng Việt.`,
        logicInputLabel: "Câu hỏi vì sao",
        logicPlaceholder: `Hỏi Mercy vì sao câu ${pack.nameVi} dùng cấu trúc này...`,
        logicSend: "Giải thích",
      };

  return {
    ...pack,
    nameEn: language.labelEn,
    nameVi: language.labelVi,
    placeholder: language.beginnerPlaceholder,
    exampleSentences: [language.defaultExampleSentence, ...pack.exampleSentences.filter((example) => example !== language.defaultExampleSentence)],
    speakerLabels: ui === "en" ? {
      tutor: "Teacher Mercy",
      learner: "You",
      correctedVersion: "Corrected version",
      shortExplanation: "Short explanation",
      naturalReply: "Natural reply",
      thinking: "Mercy is thinking...",
    } : {
      tutor: "Teacher Mercy",
      learner: "Bạn",
      correctedVersion: "Câu đã sửa",
      shortExplanation: "Giải thích ngắn",
      naturalReply: "Câu trả lời tự nhiên",
      thinking: "Mercy đang suy nghĩ...",
    },
    micLabels: ui === "en" ? {
      input: "Speak your sentence",
      listening: "Listening to your voice...",
      helper: "Mercy turns your voice into text for correction.",
      unavailable: "Microphone unavailable in this browser. You can still type your sentence.",
      ariaStart: "Speak your sentence for voice input",
      ariaStop: "Stop listening",
    } : {
      input: "Nói câu của bạn",
      listening: "Đang nghe giọng của bạn...",
      helper: "Mercy sẽ chuyển giọng nói của bạn thành câu để sửa.",
      unavailable: "Không dùng được micro trên trình duyệt này. Bạn vẫn có thể gõ câu.",
      ariaStart: "Nói câu của bạn để nhập bằng giọng nói",
      ariaStop: "Dừng nghe",
    },
    targetLanguage: target,
    uiLanguage: ui,
    ui: uiCopy,
  };
}
