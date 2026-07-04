import type { TutorLanguagePack } from "../tutorCopyTypes";

export const ja = {
  code: "ja",
  nameEn: "Japanese",
  nameVi: "tiếng Nhật",
  correctionTitle: "Japanese correction",
  conversationTitle: "Japanese conversation with Mercy",
  inputLabel: "Japanese sentence",
  placeholder: 'gõ câu tiếng Nhật của bạn ở đây, ví dụ: "私は昨日店に行く"',
  exampleSentences: ["私は昨日店に行く", "朝、コーヒーを飲みます。", "日本語を練習したいです。"],
  starterQuestions: ["朝、たいてい何をしますか？", "昨日、何をしましたか？", "今日は何を練習したいですか？"],
  commonBeginnerMistakes: ["Using dictionary form for a past event.", "Missing polite past form.", "Choosing the wrong movement particle."],
  grammarHints: ["Use 行きました for polite past movement.", "Pattern: time + place + に/へ + past verb.", "Keep particles attached to the word before them."],
  nextQuestionTemplates: ["その後、何をしますか？", "もう一つ文を作れますか？", "昨日を使って言えますか？"],
  naturalReplies: ["いいですね。朝の習慣がよく分かります。", "よくできました。意味がはっきりしています。", "初級の練習文として自然です。"],
  fallbackMessages: {
    correctionNeedsAi: "Mercy がこの日本語文を直すには AI 添削エンジンが必要です。",
    conversationNeedsAi: "Mercy がこの日本語会話を続けるには AI 添削エンジンが必要です。",
  },
  speakerLabels: { tutor: "Teacher Mercy", learner: "You", correctedVersion: "Corrected version", shortExplanation: "Giải thích ngắn", naturalReply: "Natural reply", thinking: "Mercy is thinking..." },
  micLabels: { input: "Nói câu của bạn", listening: "Đang nghe giọng của bạn...", helper: "Mercy sẽ chuyển giọng nói của bạn thành câu để sửa.", unavailable: "Không dùng được micro trên trình duyệt này. Bạn vẫn có thể gõ câu.", ariaStart: "Nói câu của bạn để nhập bằng giọng nói", ariaStop: "Dừng nghe" },
} satisfies TutorLanguagePack;
