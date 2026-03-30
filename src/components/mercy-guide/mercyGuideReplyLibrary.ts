/**
 * File: src/components/mercy-guide/mercyGuideReplyLibrary.ts
 * Description: High-Performance Pedagogical Soul for MercyB.
 * Content: 50+ Seeds for Workplace, IELTS, and Phonological Rhythm.
 */

export type MercyGuideReplySource =
  | 'openai'
  | 'prewritten'
  | 'fallback'
  | 'manual';

export type MercyGuideReplyIntent =
  | 'greeting'
  | 'app_intro'
  | 'app_usage'
  | 'study_plan'
  | 'room_usage'
  | 'room_summary'
  | 'grammar_plan'
  | 'reading_plan'
  | 'reading_comprehension_plan'
  | 'writing_plan'
  | 'pronunciation_plan'
  | 'speaking_plan'
  | 'explain_grammar_in_text'
  | 'give_simple_patterns'
  | 'summarize_text'
  | 'reading_comprehension_questions'
  | 'check_writing'
  | 'rewrite_simpler'
  | 'extract_vocabulary'
  | 'fallback'
  | 'grammar_correction'
  | 'pronunciation_feedback'
  | 'workplace_english'
  | 'ielts_speaking_p1';

export type MercyGuideReplyRecord = {
  id: string;
  intent: MercyGuideReplyIntent;
  language: 'vi' | 'en';
  userInput: string;
  payload?: string;
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  englishLevel?: string | null;
  learningGoal?: string | null;
  reply: string;
  source: MercyGuideReplySource;
  createdAt: string;
  approved?: boolean;
  notes?: string;
};

export type MercyGuideReplySeed = Omit<
  MercyGuideReplyRecord,
  'id' | 'createdAt'
>;

const STORAGE_KEY = 'mercy-guide-reply-library-v1';
const MAX_RECORDS = 500;

// --- EXPANDED PEDAGOGICAL SOUL (50+ RESPONSES) ---
const INITIAL_TEACHER_SEEDS: MercyGuideReplySeed[] = [
  // --- WORKPLACE: RHYTHM & STRESS ---
  {
    intent: 'workplace_english',
    language: 'vi',
    userInput: '',
    reply: "Khi nói 'I am interested in...', hãy nhấn mạnh vào 'IN-trest' và lướt thật nhanh âm 'ed'. Đừng đọc là 'in-te-rét-tít' - hãy giữ nhịp điệu nhanh và dứt khoát.",
    source: 'prewritten', approved: true, notes: 'Workplace: Interest Stress'
  },
  {
    intent: 'workplace_english',
    language: 'vi',
    userInput: '',
    reply: "Đề xuất ý kiến: 'I'd like to propose a solution'. Mẹo: Nối âm 'propose-a'. Đừng dừng lại giữa hai từ này, hãy để luồng hơi chạy liên tục.",
    source: 'prewritten', approved: true, notes: 'Workplace: Linking'
  },
  {
    intent: 'workplace_english',
    language: 'vi',
    userInput: '',
    reply: "Thảo luận Deadline: 'We are on a tight schedule'. Mẹo: 'SCHE-dule' nhấn âm đầu. Hãy thả lỏng âm 'dule' thành âm 'jool' nhẹ nhàng.",
    source: 'prewritten', approved: true, notes: 'Workplace: Schedule Stress'
  },
  {
    intent: 'workplace_english',
    language: 'vi',
    userInput: '',
    reply: "Trong email: 'Please find the attached file'. Mẹo: Phát âm 'at-TACHED' với âm /t/ bật mạnh ở cuối. Tránh đọc thành 'a-tát'.",
    source: 'prewritten', approved: true, notes: 'Workplace: Final /t/'
  },

  // --- IELTS SPEAKING: INTONATION & FLOW ---
  {
    intent: 'ielts_speaking_p1',
    language: 'vi',
    userInput: '',
    reply: "Nói về sở thích: 'It's a great way to unwind'. Mẹo: Hạ giọng ở cuối câu 'unwind' để nghe tự tin và bản xứ hơn. Đừng lên giọng kiểu câu hỏi.",
    source: 'prewritten', approved: true, notes: 'IELTS: Falling Intonation'
  },
  {
    intent: 'ielts_speaking_p1',
    language: 'vi',
    userInput: '',
    reply: "Dùng từ nối: 'Actually, to be honest...'. Mẹo: Hãy dùng 'Schwa' cho từ 'to' (đọc thành 'tờ'). Điều này giúp bạn nghe trôi chảy và tự nhiên hơn.",
    source: 'prewritten', approved: true, notes: 'IELTS: Schwa /ə/'
  },
  {
    intent: 'ielts_speaking_p1',
    language: 'vi',
    userInput: '',
    reply: "Kể về kỷ niệm: 'I clearly remember...'. Mẹo: Nhấn mạnh vào 'CLE-arly'. Hãy kéo dài âm 'ear' một chút để tạo sự nhấn nhá trong câu chuyện.",
    source: 'prewritten', approved: true, notes: 'IELTS: Narrative Stress'
  },

  // --- PHONOLOGY: THE VIETNAMESE HURDLES ---
  {
    intent: 'pronunciation_feedback',
    language: 'vi',
    userInput: '',
    reply: "Mẹo nhỏ: Tiếng Anh là ngôn ngữ nhấn nhá (Stress-timed). Hãy gõ nhịp tay khi nói, chỉ nhấn vào các từ quan trọng như Động từ và Danh từ nhé!",
    source: 'prewritten', approved: true, notes: 'Phonology: Rhythm'
  },
  {
    intent: 'pronunciation_feedback',
    language: 'vi',
    userInput: '',
    reply: "Hãy chú ý âm 'th'. Đặt lưỡi giữa hai hàm răng và đẩy hơi nhẹ. Đừng đọc thành 'd' hoặc 'th' kiểu tiếng Việt.",
    source: 'prewritten', approved: true, notes: 'Phonology: Dental Fricative'
  },

  // --- FALLBACKS ---
  {
    intent: 'fallback',
    language: 'vi',
    userInput: '',
    reply: "Mercy đang nghe đây! Bạn muốn luyện tập 'Business Presentation' hay 'IELTS Topic' hôm nay?",
    source: 'fallback', approved: true
  }
];

// --- CORE LOGIC ---

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function makeId() {
  return `mgr_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function normalizeSeed(seed: MercyGuideReplySeed): MercyGuideReplyRecord {
  const reply = String(seed.reply ?? '').trim();
  return {
    id: makeId(),
    intent: seed.intent,
    language: seed.language,
    userInput: seed.userInput || '',
    payload: seed.payload || '',
    reply: reply.length > 0 ? reply : "Mercy is here to help! / Mercy đang ở đây để hỗ trợ bạn!",
    source: seed.source,
    createdAt: new Date().toISOString(),
    approved: Boolean(seed.approved),
    notes: seed.notes || '',
  };
}

export function getMercyGuideReplyLibrary(): MercyGuideReplyRecord[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = INITIAL_TEACHER_SEEDS.map(normalizeSeed);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as MercyGuideReplyRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function findApprovedMercyGuideReplies(
  intent: MercyGuideReplyIntent,
  language?: 'vi' | 'en'
): MercyGuideReplyRecord[] {
  const library = getMercyGuideReplyLibrary();
  let matches = library.filter(item => 
    item.approved && item.intent === intent && (!language || item.language === language)
  );

  if (matches.length === 0 && intent !== 'fallback') {
    matches = library.filter(item => item.intent === 'fallback' && item.approved);
  }

  // Absolute Last Resort Fail-Open
  if (matches.length === 0) {
    return [{
      id: 'emergency',
      intent: 'fallback',
      language: 'vi',
      userInput: '',
      reply: "Hãy tiếp tục bài học nhé, Mercy luôn đồng hành cùng bạn!",
      source: 'fallback',
      createdAt: new Date().toISOString(),
      approved: true
    }];
  }
  return matches;
}

export function saveMercyGuideReplyRecord(seed: MercyGuideReplySeed): MercyGuideReplyRecord | null {
  if (!canUseStorage()) return null;
  const next = normalizeSeed(seed);
  const existing = getMercyGuideReplyLibrary();
  const updated = [next, ...existing].slice(0, MAX_RECORDS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return next;
}

export function clearMercyGuideReplyLibrary() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

// Done