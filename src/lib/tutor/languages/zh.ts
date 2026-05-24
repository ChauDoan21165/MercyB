import type { TutorLanguagePack } from "../tutorCopy";

export const zh = {
  code: "zh",
  nameEn: "Chinese",
  nameVi: "tiếng Trung",
  correctionTitle: "Chinese correction",
  conversationTitle: "中文对话练习",
  inputLabel: "Chinese sentence",
  placeholder: 'gõ câu tiếng Trung của bạn ở đây, ví dụ: "我昨天去商店"',
  exampleSentences: [
    "我昨天去商店",
    "我早上喝咖啡",
    "我想练习中文",
  ],
  starterQuestions: [
    "你早上通常做什么？",
    "你昨天做了什么？",
    "你今天想练习什么？",
  ],
  commonBeginnerMistakes: [
    "Forgetting 了 for completed past actions.",
    "Using English word order too rigidly.",
    "Missing a time word when the tense depends on context.",
  ],
  grammarHints: [
    "Completed action: subject + verb + 了 + object.",
    "Put time words such as 昨天 near the start of the sentence.",
    "Keep one clear idea per beginner sentence.",
  ],
  nextQuestionTemplates: [
    "然后你做什么？",
    "你可以再说一句吗？",
    "你能用昨天再说一句吗？",
  ],
  naturalReplies: [
    "很好。你的早上习惯很清楚。",
    "不错。你的意思很清楚。",
    "这个句子很适合初学者练习。",
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
