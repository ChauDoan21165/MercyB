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
    inputLabel: string;
    correctionTitle: string;
    conversationTitle: string;
    conversationEyebrow: string;
    conversationBody: string;
    emptyConversation: string;
    answerLabel: string;
    answerPlaceholder: string;
    send: string;
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
  const packs = TUTOR_LANGUAGE_PACKS;
  const pack = packs[target] ?? packs.en;

  const uiCopy = ui === "en"
    ? {
        title: target === "en" ? "Teacher Mercy AI Tutor" : `Teacher Mercy · ${pack.nameEn} Tutor`,
        subtitle: `Practice ${pack.nameEn} with Mercy. Write a ${pack.nameEn} sentence; Mercy corrects it and explains in English.`,
        helper: `Mercy corrects the selected target language: ${pack.nameEn}.`,
        inputLabel: `Your ${pack.nameEn} sentence`,
        correctionTitle: pack.correctionTitle,
        conversationTitle: pack.conversationTitle,
        conversationEyebrow: "Mercy asks · You answer",
        conversationBody: `Practice in ${pack.nameEn}. Mercy corrects gently, replies naturally, and asks one next question.`,
        emptyConversation: "Mercy will start with one easy question.",
        answerLabel: "Your answer",
        answerPlaceholder: `Type your ${pack.nameEn} answer here...`,
        send: "Send",
      }
    : {
        title: target === "en" ? "Teacher Mercy AI Tutor" : `Teacher Mercy · Gia sư ${pack.nameVi}`,
        subtitle: `Luyện ${pack.nameVi} với Mercy. Viết một câu ${pack.nameVi}, Mercy sẽ sửa và giải thích bằng tiếng Việt.`,
        helper: `Mercy sửa đúng ${pack.nameVi}; phần giải thích và mẹo học dùng tiếng Việt.`,
        inputLabel: `Câu ${pack.nameVi} của bạn`,
        correctionTitle: pack.correctionTitle,
        conversationTitle: "Trò chuyện với Mercy",
        conversationEyebrow: "Mercy hỏi · Bạn trả lời",
        conversationBody: `Luyện ${pack.nameVi}. Mercy sửa nhẹ nhàng, trả lời tự nhiên, rồi hỏi tiếp một câu.`,
        emptyConversation: "Mercy sẽ bắt đầu bằng một câu hỏi dễ.",
        answerLabel: "Câu trả lời của bạn",
        answerPlaceholder: `Gõ câu trả lời ${pack.nameVi} của bạn ở đây...`,
        send: "Gửi",
      };

  return {
    ...pack,
    targetLanguage: target,
    uiLanguage: ui,
    ui: uiCopy,
  };
}
