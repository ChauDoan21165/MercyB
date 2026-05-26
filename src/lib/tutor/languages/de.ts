import type { TutorLanguagePack } from "../tutorCopy";

export const de = {
  code: "de",
  nameEn: "German",
  nameVi: "tiếng Đức",
  correctionTitle: "German correction",
  conversationTitle: "Conversation in German with Mercy",
  inputLabel: "German sentence",
  placeholder: 'gõ câu tiếng Đức của bạn ở đây, ví dụ: "Ich gehe gestern zum Markt"',
  exampleSentences: ["Ich gehe gestern zum Markt.", "Ich trinke Kaffee am Morgen.", "Ich lerne Deutsch."],
  starterQuestions: ["Was machst du morgens normalerweise?", "Was hast du gestern gemacht?", "Was möchtest du üben?"],
  commonBeginnerMistakes: ["Using present tense with gestern.", "Putting the past participle too early.", "Using haben instead of sein with movement verbs."],
  grammarHints: ["Movement verbs like gehen often use sein in Perfekt.", "Put the past participle at the end.", "Capitalize German nouns."],
  nextQuestionTemplates: ["Was machst du danach?", "Kannst du noch einen Satz sagen?", "Kannst du die Idee im Perfekt sagen?"],
  naturalReplies: ["Gut. Deine Morgenroutine ist klar.", "Gut gemacht. Deine Idee ist klar.", "Das klingt natürlich für einen einfachen Satz."],
  fallbackMessages: {
    correctionNeedsAi: "Mercy braucht den KI-Korrekturmodus für diesen deutschen Satz.",
    conversationNeedsAi: "Mercy braucht den KI-Korrekturmodus, um dieses deutsche Gespräch fortzusetzen.",
  },
  speakerLabels: { tutor: "Teacher Mercy", learner: "You", correctedVersion: "Corrected version", shortExplanation: "Giải thích ngắn", naturalReply: "Natural reply", thinking: "Mercy is thinking..." },
  micLabels: { input: "Nói câu của bạn", listening: "Đang nghe giọng của bạn...", helper: "Mercy sẽ chuyển giọng nói của bạn thành câu để sửa.", unavailable: "Không dùng được micro trên trình duyệt này. Bạn vẫn có thể gõ câu.", ariaStart: "Nói câu của bạn để nhập bằng giọng nói", ariaStop: "Dừng nghe" },
} satisfies TutorLanguagePack;
