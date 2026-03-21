export type MercyBilingualReply = {
  en: string;
  vi: string;
};

export const MERCY_COPY = {
  guideGreeting: {
    en: "Hi. I'm here with you.",
    vi: "Chào bạn. Mình ở đây với bạn.",
  },

  genericAppHelp: {
    en: "Hello! I can't hear you, but I'm here to help you with any questions about the Mercy Blade app. What can I assist you with today?",
    vi: "Mình đang trả lời bằng tiếng Anh trước nhé.",
  },

  pronunciationHelpIntro: {
    en: "I can help correct pronunciation in chat. If you want voice practice, open Speak, type or paste a short phrase, then tap Record.",
    vi: "Mình có thể giúp sửa phát âm trong phần chat. Nếu bạn muốn luyện bằng giọng nói, hãy mở Speak, nhập hoặc dán một câu ngắn rồi nhấn Record.",
  },

  pronunciationThreadFollowUp: {
    en: "In Guide, I can explain pronunciation in chat, but I cannot hear live audio here. For listening, recording, and pronunciation checking, open Speak, type or paste a short phrase, then tap Record.",
    vi: "Trong Guide, mình có thể giải thích phát âm bằng chat, nhưng mình không nghe âm thanh trực tiếp ở đây. Để nghe mẫu, thu âm và kiểm tra phát âm, bạn hãy mở Speak, nhập hoặc dán một câu ngắn rồi nhấn Record.",
  },

  pronunciationThreadNextStep: {
    en: "We’re still working on pronunciation. In Guide, I can explain sounds, mouth position, stress, or a word you type. For voice practice, open Speak and record there.",
    vi: "Mình vẫn đang ở phần hỗ trợ phát âm nhé. Trong Guide, mình có thể giải thích âm, khẩu hình, trọng âm hoặc từ/câu bạn gõ vào. Còn để luyện bằng giọng nói, bạn mở Speak và thu âm ở đó.",
  },
} as const;

export function getGenericAppHelpReply(): MercyBilingualReply {
  return MERCY_COPY.genericAppHelp;
}

export function getPronunciationHelpIntroReply(): MercyBilingualReply {
  return MERCY_COPY.pronunciationHelpIntro;
}

export function getPronunciationThreadFollowUpReply(
  mode: 'hear' | 'next'
): MercyBilingualReply {
  return mode === 'hear'
    ? MERCY_COPY.pronunciationThreadFollowUp
    : MERCY_COPY.pronunciationThreadNextStep;
}