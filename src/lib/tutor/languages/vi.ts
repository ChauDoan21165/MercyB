import type { TutorLanguagePack } from "../tutorCopyTypes";

export const vi = {
  code: "vi",
  nameEn: "Vietnamese",
  nameVi: "tiếng Việt",
  correctionTitle: "Vietnamese correction",
  conversationTitle: "Vietnamese conversation with Mercy",
  inputLabel: "Vietnamese sentence",
  placeholder: 'gõ câu tiếng Việt của bạn ở đây, ví dụ: "Tôi buồn vì mất cái mũ đẹp."',
  exampleSentences: ["Tôi buồn vì mất cái mũ đẹp.", "Hôm qua tôi đi chợ.", "Tôi muốn luyện tiếng Việt."],
  starterQuestions: ["Buổi sáng bạn thường làm gì?", "Hôm qua bạn đã làm gì?", "Hôm nay bạn muốn luyện gì?"],
  commonBeginnerMistakes: ["Using vague classifiers like cái when chiếc sounds more natural.", "Missing đã when the sentence needs a completed-action feel.", "Repeating spoken fragments after dictation."],
  grammarHints: ["Use time words instead of changing verb forms.", "Chiếc often sounds more natural for personal objects.", "Keep one clear idea per sentence."],
  nextQuestionTemplates: ["Sau đó bạn thường làm gì?", "Bạn có thể viết thêm một câu không?", "Bạn thử dùng sáng nay trong câu mới nhé."],
  naturalReplies: ["Tốt lắm. Câu trả lời của bạn rõ và tự nhiên.", "Hay lắm. Ý của bạn rất rõ.", "Câu này tự nhiên cho phần luyện tập cơ bản."],
  fallbackMessages: {
    correctionNeedsAi: "Mercy cần bộ sửa lỗi AI cho câu tiếng Việt này.",
    conversationNeedsAi: "Mercy cần bộ sửa lỗi AI để tiếp tục cuộc trò chuyện tiếng Việt này.",
  },
  speakerLabels: { tutor: "Teacher Mercy", learner: "You", correctedVersion: "Corrected version", shortExplanation: "Giải thích ngắn", naturalReply: "Natural reply", thinking: "Mercy is thinking..." },
  micLabels: { input: "Nói câu của bạn", listening: "Đang nghe giọng của bạn...", helper: "Mercy sẽ chuyển giọng nói của bạn thành câu để sửa.", unavailable: "Không dùng được micro trên trình duyệt này. Bạn vẫn có thể gõ câu.", ariaStart: "Nói câu của bạn để nhập bằng giọng nói", ariaStop: "Dừng nghe" },
} satisfies TutorLanguagePack;
