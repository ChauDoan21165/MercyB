import { viKidsEnglish, type TutorProductMode } from "@/lib/tutor/productConfigs";

export type ViKidsTutorMode = Extract<TutorProductMode, "journey" | "grammar" | "speak">;

const VI_KIDS_TUTOR_TAB_LABELS: Record<ViKidsTutorMode, string> = {
  journey: "Journey",
  grammar: "Grammar",
  speak: "Speak",
};

export const VI_KIDS_TUTOR_TABS: Array<{ id: ViKidsTutorMode; label: string }> = viKidsEnglish.modes
  .filter((mode): mode is ViKidsTutorMode =>
    mode === "journey" || mode === "grammar" || mode === "speak",
  )
  .map((mode) => ({ id: mode, label: VI_KIDS_TUTOR_TAB_LABELS[mode] }));

export const VI_KIDS_TUTOR_COPY = {
  title: viKidsEnglish.title,
  subtitle: viKidsEnglish.subtitle,
  helper: "Bé luyện tiếng Anh thôi. Mercy sửa nhẹ nhàng, hỏi một câu nhỏ, và không lưu audio thô.",
  eyebrow: "Việt Kids English",
  memoryTitle: "Nhắc nhẹ hôm nay",
  memoryBody: "Luyện một câu ngắn, nghe Mercy đọc, rồi thử nói lại.",
  correctionPrompt: "Viết hoặc nói một câu tiếng Anh ngắn.",
  correctionPlaceholder: 'Ví dụ: "She go to school every day"',
  correctedLabel: "Mercy sửa nhẹ",
  correctedExample: "She goes to school every day.",
  explanationLabel: "Giải thích bằng tiếng Việt",
  explanation: "Với she/he/it, động từ hiện tại đơn thêm -s hoặc -es. Không sao, lỗi này rất thường gặp.",
  conversationTitle: "Mercy hỏi · Bé trả lời",
  conversationQuestion: "What do you like to eat?",
  conversationHint: "Trả lời bằng một câu tiếng Anh ngắn. Ví dụ: I like apples.",
  speakLine: "I like apples.",
  logicTask: "Chọn một việc mỗi ngày và nói bằng tiếng Anh: I read. I play. I eat.",
  micInput: "Bé nói tiếng Anh",
  micListening: "Mercy đang nghe...",
  micUnavailable: "Không dùng được micro. Bé vẫn có thể gõ câu.",
  micAriaStart: "Bắt đầu nói tiếng Anh",
  micAriaStop: "Dừng nghe",
  ttsPlay: "Mercy đọc",
  ttsStop: "Dừng",
  ttsUnavailable: "Chưa dùng được giọng đọc trên thiết bị này.",
  footer: "Kids-safe practice only. Không gọi nhà cung cấp AI thật trong màn này.",
};
