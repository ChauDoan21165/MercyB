export type ViKidsTutorMode = "journey" | "grammar" | "speak" | "logic";

export const VI_KIDS_TUTOR_TABS: Array<{ id: ViKidsTutorMode; label: string }> = [
  { id: "journey", label: "Journey" },
  { id: "grammar", label: "Grammar" },
  { id: "speak", label: "Speak" },
  { id: "logic", label: "Logic" },
];

export const VI_KIDS_TUTOR_COPY = {
  title: "Teacher Mercy · English for Việt Kids",
  subtitle: "Mercy giúp bé luyện tiếng Anh bằng giải thích tiếng Việt ngắn, ấm áp, dễ hiểu.",
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
