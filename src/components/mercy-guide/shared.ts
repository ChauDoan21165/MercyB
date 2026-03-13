import { CompanionProfile } from '@/services/companion';

export interface Message {
  id: string;
  type: 'user' | 'assistant' | 'article' | 'english';
  content: string;
  contentVi?: string;
}

export interface EnglishHelperResult {
  intro_en: string;
  intro_vi: string;
  items: {
    word: string;
    meaning_vi: string;
    example_en: string;
    example_vi: string;
  }[];
  encouragement_en: string;
  encouragement_vi: string;
}

export interface PronunciationFeedback {
  praise_en: string;
  praise_vi: string;
  focus_items: {
    word: string;
    tip_en: string;
    tip_vi: string;
  }[];
  encouragement_en: string;
  encouragement_vi: string;
}

export interface PronunciationResult {
  targetText: string;
  transcribedText: string;
  score: number;
  feedback: PronunciationFeedback;
}

export interface GuideAssistantResponse {
  ok?: boolean;
  answer?: string;
  answerVi?: string;
  answer_vi?: string;
  error?: string;
}

export interface TroubleWord {
  word: string;
  count: number;
  lastScore: number;
  bestScore: number;
  updatedAt?: string;
  tipEn?: string;
  tipVi?: string;
}

export const QUICK_BUTTONS = [
  { key: 'what_is_room', label_en: 'What is a room?', label_vi: 'Phòng là gì?' },
  { key: 'how_to_use_room', label_en: 'How to use?', label_vi: 'Cách sử dụng?' },
  { key: 'how_to_use_paths', label_en: 'What is a path?', label_vi: 'Path là gì?' },
  { key: 'where_to_start', label_en: 'Where to start?', label_vi: 'Bắt đầu từ đâu?' },
  { key: 'language_switch', label_en: 'EN & VI', label_vi: 'EN & VI' },
] as const;

export const RATE_LIMIT_MESSAGE = {
  en: 'Let us pause a bit. You can ask more questions later.',
  vi: 'Mình tạm dừng một chút nhé. Bạn có thể hỏi thêm sau.',
};

export const FALLBACK_PRAISE = {
  en: 'Thank you for trying. Speaking out loud is already a brave step.',
  vi: 'Cảm ơn bạn đã thử. Dám nói ra thành tiếng đã là một bước rất can đảm rồi.',
};

export const GUIDE_TIMEOUT_FALLBACK = {
  en: "Let's keep it simple for now. Try a shorter question, or open Speak if you want pronunciation help.",
  vi: 'Mình tạm làm đơn giản nhé. Bạn thử hỏi ngắn hơn, hoặc mở tab Speak nếu muốn luyện phát âm.',
};

export const GUIDE_GENERIC_ERROR = {
  en: 'Sorry, I could not answer that. Please try again.',
  vi: 'Xin lỗi, mình không thể trả lời câu đó. Vui lòng thử lại.',
};

export const PRONUNCIATION_ROUTE_REPLY = {
  en: 'For pronunciation, please open the Speak tab. I can listen there and help you practice one phrase at a time.',
  vi: 'Với phát âm, bạn mở tab Speak nhé. Ở đó mình có thể nghe và giúp bạn luyện từng cụm ngắn.',
};

export const SPEAK_LOCATION_REPLY = {
  en: 'The Speak tab is at the top of this panel, next to English. I am opening it for you now.',
  vi: 'Tab Speak nằm ở hàng trên cùng của khung này, cạnh English. Mình mở nó cho bạn ngay nhé.',
};

export const VOCAB_VAULT_EMPTY = {
  en: 'Your vault is empty. Practice speaking to collect trouble words.',
  vi: 'Kho từ của bạn đang trống. Hãy luyện nói để lưu lại các từ cần luyện thêm.',
};

export const MAX_SPEAK_ATTEMPTS = 20;
export const SPEAK_SESSION_KEY = 'mb_speak_attempts';
export const GUIDE_ASSISTANT_TIMEOUT_MS = 12000;
export const TROUBLE_WORDS_STORAGE_KEY = 'mb_trouble_words_v1';
export const MERCY_HOST_IMAGE_SRC = '/mercy-host.jpg?v=3';
export const MERCY_HOST_IMAGE_FALLBACK = '/mercy-host.png?v=3';

export function getCheckInMessage(
  profile: CompanionProfile,
  lastActiveAt?: string,
  lastEnglishActivity?: string
): { en: string; vi: string } | null {
  const name = profile.preferred_name || 'friend';
  const now = Date.now();

  if (lastActiveAt) {
    const daysSinceActive =
      (now - new Date(lastActiveAt).getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceActive > 7) {
      return {
        en: `${name}, it has been a little while. We can start with something very small today.`,
        vi: `${name} ơi, cũng khá lâu rồi. Hôm nay mình bắt đầu bằng một điều rất nhỏ thôi nhé.`,
      };
    }
  }

  if (lastEnglishActivity) {
    const daysSinceEnglish =
      (now - new Date(lastEnglishActivity).getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceEnglish > 3) {
      return {
        en: 'We have not practiced English together for a few days. One short phrase today is already good.',
        vi: 'Mình đã vài ngày chưa luyện tiếng Anh cùng nhau. Chỉ một cụm ngắn hôm nay cũng đã là tốt rồi.',
      };
    }
  }

  return {
    en: 'You are doing well just by showing up here.',
    vi: 'Chỉ cần bạn có mặt ở đây đã là rất tốt rồi.',
  };
}

export function getSpeakProgressHint(
  profile: CompanionProfile
): { en: string; vi: string } {
  const lastActivity = profile.last_english_activity;

  if (!lastActivity) {
    return {
      en: 'This might be your first speaking practice here. Take it slow.',
      vi: 'Có thể đây là lần đầu bạn luyện nói ở đây. Mình cứ đi thật chậm nhé.',
    };
  }

  const now = Date.now();
  const daysSince = (now - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24);

  if (daysSince < 1) {
    return {
      en: 'You already practiced speaking today. One more try is a bonus.',
      vi: 'Hôm nay bạn đã luyện nói rồi. Thử thêm lần nữa chỉ là phần thưởng thôi.',
    };
  }

  if (daysSince > 3) {
    return {
      en: "It has been a few days since we spoke together. Let's keep it light.",
      vi: 'Mình đã vài ngày chưa luyện nói cùng nhau. Hôm nay mình làm thật nhẹ nhàng nhé.',
    };
  }

  return {
    en: 'You are doing well just by showing up here.',
    vi: 'Chỉ cần bạn có mặt ở đây đã là rất tốt rồi.',
  };
}

export function extractFirstSentence(text: string): string {
  if (!text) return '';
  const sentences = text.split(/[.!?]+/);
  const first = sentences[0]?.trim() || '';
  return first.length > 80 ? `${first.slice(0, 77)}...` : first;
}

export function normalizeMercyInput(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function stripVietnamese(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function containsVietnameseChars(text: string): boolean {
  return /[ăâđêôơưàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/i.test(
    text
  );
}

export function cleanupAssistantText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export function splitBilingualAnswer(answer: string): { en: string; vi?: string } {
  const cleaned = cleanupAssistantText(answer);
  if (!cleaned) return { en: '' };

  if (!containsVietnameseChars(cleaned)) {
    return { en: cleaned };
  }

  const lines = cleaned
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length >= 2) {
    const viLines = lines.filter((line) => containsVietnameseChars(line));
    const enLines = lines.filter((line) => !containsVietnameseChars(line));

    if (enLines.length > 0 && viLines.length > 0) {
      return {
        en: enLines.join(' ').trim(),
        vi: viLines.join(' ').trim(),
      };
    }
  }

  const firstViIndex = cleaned.search(
    /[ăâđêôơưàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/i
  );

  if (firstViIndex > 0) {
    let splitIndex = firstViIndex;

    while (
      splitIndex > 0 &&
      cleaned[splitIndex - 1] !== '.' &&
      cleaned[splitIndex - 1] !== '!' &&
      cleaned[splitIndex - 1] !== '?'
    ) {
      splitIndex--;
    }

    if (splitIndex > 0) {
      const en = cleaned.slice(0, splitIndex).trim();
      const vi = cleaned.slice(splitIndex).trim();

      if (en && vi) {
        return { en, vi };
      }
    }
  }

  const sentenceMatches =
    cleaned
      .match(/[^.!?]+[.!?]?/g)
      ?.map((s) => s.trim())
      .filter(Boolean) || [];

  if (sentenceMatches.length > 1) {
    const viSentences = sentenceMatches.filter((sentence) =>
      containsVietnameseChars(sentence)
    );
    const enSentences = sentenceMatches.filter(
      (sentence) => !containsVietnameseChars(sentence)
    );

    if (enSentences.length > 0 && viSentences.length > 0) {
      return {
        en: enSentences.join(' ').trim(),
        vi: viSentences.join(' ').trim(),
      };
    }
  }

  return { en: cleaned };
}

export function getLocalMercyReply(
  question: string
): { en: string; vi?: string } | null {
  const q = normalizeMercyInput(question);

  if (/^(hi|hello|hey)\b/.test(q)) {
    return {
      en: "Hi. I'm here with you.",
      vi: 'Chào bạn. Mình ở đây với bạn.',
    };
  }

  if (q.includes('help')) {
    return {
      en: 'Ask me something small and we begin there.',
      vi: 'Bạn hỏi một điều nhỏ thôi nhé.',
    };
  }

  if (q.includes('start')) {
    return {
      en: 'Start with one small room.',
      vi: 'Mình bắt đầu bằng một room nhỏ nhé.',
    };
  }

  if (q.includes('tired') || q.includes('stress')) {
    return {
      en: 'Then we keep it light today.',
      vi: 'Hôm nay mình làm nhẹ thôi nhé.',
    };
  }

  return null;
}

export function isPronunciationIntent(question: string): boolean {
  const raw = normalizeMercyInput(question);
  const q = stripVietnamese(raw);

  return (
    q.includes('pronunciation') ||
    q.includes('pronounce') ||
    q.includes('fix my pronunciation') ||
    q.includes('correct my pronunciation') ||
    q.includes('speak better') ||
    q.includes('listen to my voice') ||
    q.includes('how do i say') ||
    q.includes('how to say') ||
    q.includes('phat am') ||
    q.includes('sua phat am') ||
    q.includes('chinh phat am') ||
    q.includes('luyen phat am') ||
    q.includes('giup phat am') ||
    q.includes('nghe phat am') ||
    q.includes('noi dung') ||
    q.includes('speak tab')
  );
}

export function isSpeakLocationIntent(question: string): boolean {
  const raw = normalizeMercyInput(question);
  const q = stripVietnamese(raw);

  return (
    q === 'where' ||
    q === 'where?' ||
    q.includes('where is speak') ||
    q.includes('where speak') ||
    q.includes("can't find speak") ||
    q.includes('cannot find speak') ||
    q.includes('khong tim thay speak') ||
    q.includes('khong thay speak') ||
    q.includes('speak o dau') ||
    q.includes('o dau') ||
    q.includes('ở đâu')
  );
}

export function sanitizeAssistantAnswer(answer: string): string {
  return cleanupAssistantText(answer);
}

export function looksIncompleteAssistantAnswer(answer: string): boolean {
  const cleaned = sanitizeAssistantAnswer(answer);
  if (!cleaned) return true;

  const words = cleaned.split(' ');
  if (words.length < 4) return false;

  const lastChar = cleaned.slice(-1);
  const hasEndingPunctuation = /[.!?]"?$/.test(cleaned);
  const badTailPattern =
    /\b(is|are|was|were|am|to|for|with|about|on|in|and|or|but|that|this|your|my|the|a|an|of)\s*$/i;

  return !hasEndingPunctuation || badTailPattern.test(cleaned) || lastChar === ',';
}

export function getAssistantVietnamese(
  data: GuideAssistantResponse,
  answer?: string
): string | undefined {
  const directVi = data.answerVi || data.answer_vi;
  const cleanedDirectVi = cleanupAssistantText(directVi || '');
  if (cleanedDirectVi) return cleanedDirectVi;
  if (!answer) return undefined;
  return splitBilingualAnswer(answer).vi;
}

export function normalizeVaultWord(word: string): string {
  return word
    .trim()
    .toLowerCase()
    .replace(/^[^a-zA-Z']+|[^a-zA-Z']+$/g, '');
}

export function extractCandidateWordsFromPhrase(phrase: string): string[] {
  return phrase
    .split(/\s+/)
    .map(normalizeVaultWord)
    .filter(Boolean)
    .filter((word) => word.length > 2);
}

export function normalizePronunciationResult(
  raw: Partial<PronunciationResult> | null | undefined,
  fallbackTargetText: string
): PronunciationResult {
  const rawFeedback =
    raw && typeof raw.feedback === 'object' && raw.feedback !== null ? raw.feedback : {};

  const rawFocusItems = Array.isArray(rawFeedback.focus_items) ? rawFeedback.focus_items : [];

  const focus_items = rawFocusItems
    .map((item) => {
      const safeItem =
        item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
      const word = typeof safeItem.word === 'string' ? safeItem.word.trim() : '';
      const tip_en = typeof safeItem.tip_en === 'string' ? safeItem.tip_en.trim() : '';
      const tip_vi = typeof safeItem.tip_vi === 'string' ? safeItem.tip_vi.trim() : '';

      return {
        word,
        tip_en,
        tip_vi,
      };
    })
    .filter((item) => item.word && (item.tip_en || item.tip_vi))
    .slice(0, 3);

  const safeScore =
    typeof raw?.score === 'number' && Number.isFinite(raw.score) ? raw.score : 0;

  return {
    targetText:
      typeof raw?.targetText === 'string' && raw.targetText.trim()
        ? raw.targetText.trim()
        : fallbackTargetText,
    transcribedText:
      typeof raw?.transcribedText === 'string' ? raw.transcribedText.trim() : '',
    score: Math.max(0, Math.min(100, safeScore)),
    feedback: {
      praise_en:
        typeof rawFeedback.praise_en === 'string' ? rawFeedback.praise_en.trim() : '',
      praise_vi:
        typeof rawFeedback.praise_vi === 'string' ? rawFeedback.praise_vi.trim() : '',
      encouragement_en:
        typeof rawFeedback.encouragement_en === 'string'
          ? rawFeedback.encouragement_en.trim()
          : '',
      encouragement_vi:
        typeof rawFeedback.encouragement_vi === 'string'
          ? rawFeedback.encouragement_vi.trim()
          : '',
      focus_items,
    },
  };
}

export function normalizeEnglishHelperResult(
  raw: Partial<EnglishHelperResult> | null | undefined
): EnglishHelperResult {
  const rawItems = Array.isArray(raw?.items) ? raw.items : [];

  return {
    intro_en: typeof raw?.intro_en === 'string' ? raw.intro_en.trim() : '',
    intro_vi: typeof raw?.intro_vi === 'string' ? raw.intro_vi.trim() : '',
    encouragement_en:
      typeof raw?.encouragement_en === 'string' ? raw.encouragement_en.trim() : '',
    encouragement_vi:
      typeof raw?.encouragement_vi === 'string' ? raw.encouragement_vi.trim() : '',
    items: rawItems
      .map((item) => ({
        word: typeof item?.word === 'string' ? item.word.trim() : '',
        meaning_vi: typeof item?.meaning_vi === 'string' ? item.meaning_vi.trim() : '',
        example_en: typeof item?.example_en === 'string' ? item.example_en.trim() : '',
        example_vi: typeof item?.example_vi === 'string' ? item.example_vi.trim() : '',
      }))
      .filter((item) => item.word),
  };
}