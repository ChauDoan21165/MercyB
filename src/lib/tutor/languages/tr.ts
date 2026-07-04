import type { TutorLanguagePack } from "../tutorCopyTypes";

export const tr = {
  code: "tr",
  nameEn: "Turkish",
  nameVi: "Tiếng Thổ Nhĩ Kỳ",
  correctionTitle: "Turkish correction",
  conversationTitle: "Turkish conversation with Mercy",
  inputLabel: "Turkish sentence",
  placeholder: 'gõ câu tiếng Thổ Nhĩ Kỳ của bạn ở đây, ví dụ: "Dün pazara gidiyorum"',
  exampleSentences: [
    "Dün pazara gidiyorum.",
    "Sabah kahve içiyorum.",
    "Türkçe pratik yapmak istiyorum.",
  ],
  starterQuestions: [
    "Sabahları genellikle ne yaparsın?",
    "Dün ne yaptın?",
    "Bugün Türkçe'de ne çalışmak istiyorsun?",
  ],
  commonBeginnerMistakes: [
    "Using present tense with past-time words like dün.",
    "Forgetting Turkish word order: time and place often come before the verb.",
    "Translating English or Vietnamese sentence structure too directly.",
  ],
  grammarHints: [
    "Use past tense for completed actions with dün: gittim, yaptım, içtim.",
    "Turkish verbs usually carry the tense and person ending.",
    "Keep practical sentences compact: time + place/object + verb.",
  ],
  nextQuestionTemplates: [
    "Sonra ne yaparsın?",
    "Bir cümle daha söyleyebilir misin?",
    "Aynı fikri geçmiş zamanda söyleyebilir misin?",
  ],
  naturalReplies: [
    "Güzel. Sabah rutinin açık.",
    "İyi söyledin. Fikrin anlaşılır.",
    "Bu pratik için doğal bir cümle.",
  ],
  fallbackMessages: {
    correctionNeedsAi: "Mercy needs the AI correction engine for this Turkish sentence.",
    conversationNeedsAi: "Mercy needs the AI correction engine to continue this Turkish conversation.",
  },
  speakerLabels: {
    tutor: "Teacher Mercy",
    learner: "You",
    correctedVersion: "Corrected version",
    shortExplanation: "Short explanation",
    naturalReply: "Natural reply",
    thinking: "Mercy is thinking...",
  },
  micLabels: {
    input: "Speak your sentence",
    listening: "Listening to your voice...",
    helper: "Mercy turns your voice into text for correction.",
    unavailable: "Microphone unavailable in this browser. You can still type your sentence.",
    ariaStart: "Speak your sentence for voice input",
    ariaStop: "Stop listening",
  },
} satisfies TutorLanguagePack;
