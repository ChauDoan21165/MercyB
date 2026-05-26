/**
 * File: mercyGuideReplyLibrary.ts
 * Path: src/components/mercy-guide/mercyGuideReplyLibrary.ts
 * Version: 5.0 (Knowledge Base Hardened)
 * Focus: Phonetic Triggers (Final S/ED), Room-Context, Fail-Open.
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
  | 'phonology_final_s'      // Added: Vietnamese-specific pitfall
  | 'phonology_ed_suffix'    // Added: Vietnamese-specific pitfall
  | 'workplace_english'
  | 'ielts_speaking_p1'
  | 'room_context';          // Added: Key for Room-specific overrides

export type MercyGuideReplyRecord = {
  id: string;
  intent: MercyGuideReplyIntent;
  language: 'vi' | 'en';
  userInput: string;
  payload?: string;
  roomId?: string;           // Hardened: Crucial for 400+ Room Mapping
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

const STORAGE_KEY = 'mercy-guide-reply-library-v5';
const MAX_RECORDS = 1000; // Scaled for massive room coverage

// --- HARDENED SEED DATA: THE TEACHER'S SOUL ---
const INITIAL_TEACHER_SEEDS: MercyGuideReplySeed[] = [
  // --- PHONETIC TRIGGERS (Vietnamese Specific) ---
  {
    intent: 'phonology_final_s',
    language: 'vi',
    userInput: '',
    reply: "Mẹo nhỏ nè: Đừng 'quên' âm /s/ ở cuối nhé! Tiếng Việt không có âm đuôi bật hơi, nhưng trong tiếng Anh, âm /s/ giúp phân biệt số ít và số nhiều đó. Thử xì nhẹ một cái nào!",
    source: 'prewritten', approved: true, notes: 'Vietnamese pitfall: Final S'
  },
  {
    intent: 'phonology_ed_suffix',
    language: 'vi',
    userInput: '',
    reply: "Âm /ed/ ở cuối có 3 cách đọc (/t/, /d/, /id/). Đừng đọc tất cả là 'ờ' nhé. Với các từ kết thúc bằng âm vô thanh, hãy bật âm /t/ thật gọn!",
    source: 'prewritten', approved: true, notes: 'Vietnamese pitfall: ED suffix'
  },

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
    reply: "Trong email: 'Please find the attached file'. Mẹo: Phát âm 'at-TACHED' với âm /t/ bật mạnh ở cuối. Tránh đọc thành 'a-tát'.",
    source: 'prewritten', approved: true, notes: 'Workplace: Final /t/'
  },

  // --- IELTS SPEAKING ---
  {
    intent: 'ielts_speaking_p1',
    language: 'vi',
    userInput: '',
    reply: "Nói về sở thích: 'It's a great way to unwind'. Mẹo: Hạ giọng ở cuối câu 'unwind' để nghe tự tin và bản xứ hơn. Đừng lên giọng kiểu câu hỏi nhé.",
    source: 'prewritten', approved: true, notes: 'IELTS: Falling Intonation'
  },

  // --- ROOM-SPECIFIC CONTEXT (Template for Scaling) ---
  {
    intent: 'room_context',
    language: 'vi',
    roomId: 'business-intro-101',
    userInput: '',
    reply: "Chào mừng bạn đến với Business Intro! Hôm nay chúng ta sẽ học cách dùng 'I would appreciate it' để chuyên nghiệp hơn. Bạn đã sẵn sàng chưa?",
    source: 'prewritten', approved: true
  },

  // --- GLOBAL FALLBACK ---
  {
    intent: 'fallback',
    language: 'vi',
    userInput: '',
    reply: "Mercy đang nghe đây! Bạn có muốn luyện tập âm đuôi /s/ hay cách dùng 'ED' trong khi chúng ta khám phá bài học này không?",
    source: 'fallback', approved: true
  }
];

// --- CORE UTILITIES ---

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
    roomId: seed.roomId || '',
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

/**
 * ADVISOR LOGIC: Hardened Priority Search
 * 1. Specific RoomID match
 * 2. Specific Intent + Language match
 * 3. Fallback Intent match
 * 4. Absolute Emergency Fallback
 */
export function findApprovedMercyGuideReplies(
  intent: MercyGuideReplyIntent,
  language: 'vi' | 'en' = 'vi',
  roomId?: string
): MercyGuideReplyRecord[] {
  const library = getMercyGuideReplyLibrary();

  // 1. Try Room-Specific Overrides first
  if (roomId) {
    const roomMatches = library.filter(i => i.roomId === roomId && i.language === language && i.approved);
    if (roomMatches.length > 0) return roomMatches;
  }

  // 2. Try Standard Intent Matches
  let matches = library.filter(item => 
    item.approved && item.intent === intent && item.language === language
  );

  // 3. Fail-Open to Global Fallback
  if (matches.length === 0 && intent !== 'fallback') {
    matches = library.filter(item => item.intent === 'fallback' && item.language === language && item.approved);
  }

  // 4. Absolute Last Resort
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