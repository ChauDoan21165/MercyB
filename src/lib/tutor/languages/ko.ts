import type { TutorLanguagePack } from "../tutorCopy";

export const ko = {
  code: "ko",
  nameEn: "Korean",
  nameVi: "tiếng Hàn",
  correctionTitle: "Korean correction",
  conversationTitle: "Korean conversation with Mercy",
  inputLabel: "Korean sentence",
  placeholder: 'gõ câu tiếng Hàn của bạn ở đây, ví dụ: "저는 어제 시장에 가요"',
  fallbackMessages: {
    correctionRequired: "Mercy needs the AI correction engine for this Korean sentence.",
    emptyConversation: "Mercy가 쉬운 질문으로 시작합니다.",
    voiceUnavailable: "Không dùng được micro trên trình duyệt này. Bạn vẫn có thể gõ câu.",
  },
  exampleSentences: ["저는 어제 시장에 가요", "아침에 커피를 마셔요.", "한국어를 연습하고 싶어요."],
  starterQuestions: ["아침에 보통 무엇을 해요?", "어제 무엇을 했어요?", "오늘 무엇을 연습하고 싶어요?"],
  commonBeginnerMistakes: ["Using present form for past actions.", "Forgetting polite past endings.", "Placing time words unnaturally."],
  grammarHints: ["가다 becomes 갔어요 in polite past.", "Time words like 어제 often come near the start.", "Keep beginner sentences short and clear."],
  nextQuestionTemplates: ["그다음에 무엇을 해요?", "한 문장 더 말해 볼래요?", "지난주를 써서 말해 볼래요?"],
  naturalReplies: ["좋아요. 아침 습관이 잘 보여요.", "잘했어요. 뜻이 분명해요.", "초급 연습 문장으로 자연스러워요."],
  speakerLabels: { tutor: "Teacher Mercy", learner: "You", correctedVersion: "Corrected version", shortExplanation: "Giải thích ngắn", naturalReply: "Natural reply", thinking: "Mercy is thinking..." },
  micLabels: { input: "Nói câu của bạn", listening: "Đang nghe giọng của bạn...", helper: "Mercy sẽ chuyển giọng nói của bạn thành câu để sửa.", unavailable: "Không dùng được micro trên trình duyệt này. Bạn vẫn có thể gõ câu.", ariaStart: "Nói câu của bạn để nhập bằng giọng nói", ariaStop: "Dừng nghe" },
} satisfies TutorLanguagePack;
