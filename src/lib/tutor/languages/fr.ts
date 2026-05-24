import type { TutorLanguagePack } from "../tutorCopy";

export const fr = {
  code: "fr",
  nameEn: "French",
  nameVi: "tiếng Pháp",
  correctionTitle: "French correction",
  conversationTitle: "Conversation en français avec Mercy",
  inputLabel: "French sentence",
  placeholder: 'gõ câu tiếng Pháp của bạn ở đây, ví dụ: "Je suis aller au marché"',
  exampleSentences: [
    "Je suis aller au marché.",
    "Toute lecture neuve d'un texte canonique paraît hérétique.",
    "Hier je vais au café.",
  ],
  starterQuestions: [
    "Qu'est-ce que tu fais le matin ?",
    "Qu'est-ce que tu as fait hier ?",
    "Qu'est-ce que tu aimes étudier ?",
  ],
  commonBeginnerMistakes: [
    "Using infinitive aller where the past participle allé is needed.",
    "Choosing an adjective order that sounds unnatural in formal French.",
    "Missing agreement in common noun phrases.",
  ],
  grammarHints: [
    "Use je suis allé/allée for a completed movement action.",
    "Nouvelle lecture is more natural than lecture neuve for a new interpretation.",
    "Keep formal French punctuation clean and balanced.",
  ],
  nextQuestionTemplates: [
    "Qu'est-ce que tu fais après ça ?",
    "Peux-tu répondre avec une phrase plus longue ?",
    "Peux-tu dire la même idée au passé ?",
  ],
  naturalReplies: [
    "Très bien. Ta routine du matin est claire.",
    "Bien joué. Ton idée est claire.",
    "C'est naturel pour une phrase de débutant.",
  ],
  speakerLabels: {
    tutor: "Teacher Mercy",
    learner: "You",
    correctedVersion: "Corrected version",
    shortExplanation: "Giải thích ngắn",
    naturalReply: "Natural reply",
    thinking: "Mercy is thinking...",
  },
  micLabels: {
    input: "Nói câu của bạn",
    listening: "Đang nghe giọng của bạn...",
    helper: "Mercy sẽ chuyển giọng nói của bạn thành câu để sửa.",
    unavailable: "Không dùng được micro trên trình duyệt này. Bạn vẫn có thể gõ câu.",
    ariaStart: "Nói câu của bạn để nhập bằng giọng nói",
    ariaStop: "Dừng nghe",
  },
} satisfies TutorLanguagePack;
