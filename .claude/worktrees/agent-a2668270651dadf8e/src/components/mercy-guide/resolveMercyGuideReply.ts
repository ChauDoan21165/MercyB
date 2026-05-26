export type ResolvedReply = {
  text: string;
  language: 'vi' | 'en';
  suggestSpeak: boolean;
};

function detectLanguage(text: string): 'vi' | 'en' {
  return /[à-ỹ]/i.test(text) ? 'vi' : 'en';
}

function clean(text: string) {
  return text.toLowerCase().trim();
}

export async function resolveMercyGuideReply({
  input,
}: {
  input: string;
}): Promise<ResolvedReply> {
  const lang = detectLanguage(input);
  const text = clean(input);

  // --- GREETING ---
  if (/^(hi|hello|hey|chào)/.test(text)) {
    return {
      text:
        lang === 'vi'
          ? 'Chào bạn! Mình có thể giúp bạn dùng app hoặc chọn hướng học.'
          : 'Hi! I can help you use the app or choose what to learn.',
      language: lang,
      suggestSpeak: false,
    };
  }

  // --- APP USAGE ---
  if (text.includes('use') || text.includes('how')) {
    return {
      text:
        lang === 'vi'
          ? 'Bạn có thể hỏi mình cách dùng app hoặc chọn phòng học.'
          : 'You can ask me how to use the app or choose a learning room.',
      language: lang,
      suggestSpeak: false,
    };
  }

  // --- ROOM ---
  if (text.includes('room') || text.includes('where')) {
    return {
      text:
        lang === 'vi'
          ? 'Mỗi phòng có mục tiêu khác nhau. Bạn muốn học gì?'
          : 'Each room has a different purpose. What do you want to learn?',
      language: lang,
      suggestSpeak: false,
    };
  }

  // --- SPEAK ---
  if (text.includes('pronounce') || text.includes('phát âm')) {
    return {
      text:
        lang === 'vi'
          ? 'Hãy dùng Speak để luyện phát âm nhé.'
          : 'Please use Speak to practice pronunciation.',
      language: lang,
      suggestSpeak: true,
    };
  }

  // --- REDIRECT TO HOST ---
  if (
    text.includes('grammar') ||
    text.includes('check') ||
    text.includes('correct') ||
    text.includes('rewrite') ||
    text.includes('summarize')
  ) {
    return {
      text:
        lang === 'vi'
          ? 'Câu hỏi này cần Mercy Host. Hãy chuyển sang đó nhé.'
          : 'This requires Mercy Host. Please switch there.',
      language: lang,
      suggestSpeak: false,
    };
  }

  // --- FALLBACK ---
  return {
    text:
      lang === 'vi'
        ? 'Mình giúp về cách dùng app. Nếu bạn muốn học sâu hơn, hãy dùng Mercy Host.'
        : 'I help with using the app. For learning, use Mercy Host.',
    language: lang,
    suggestSpeak: false,
  };
}