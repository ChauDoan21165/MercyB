export type GuideReplyLanguage = 'vi' | 'en';

export type GuideReplyKey =
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
  | 'speak_redirect'
  | 'fallback';

export type RoomAnswerContext = {
  roomName?: string;
  roomLineEn: string;
  roomLineVi: string;
  goalLineEn?: string;
  goalLineVi?: string;
  levelLineEn?: string;
  levelLineVi?: string;
  topicLineEn?: string;
  topicLineVi?: string;
};

type BilingualAnswerEntry = {
  vi: string | ((ctx: RoomAnswerContext) => string);
  en: string | ((ctx: RoomAnswerContext) => string);
};

type BilingualAnswerSet = Record<GuideReplyKey, BilingualAnswerEntry>;

const DEFAULT_ROOM_CONTEXT: RoomAnswerContext = {
  roomName: 'this room',
  roomLineEn: 'This room is a study space inside the app.',
  roomLineVi: 'Phòng này là một không gian học trong ứng dụng.',
  goalLineEn: '',
  goalLineVi: '',
  levelLineEn: '',
  levelLineVi: '',
  topicLineEn: '',
  topicLineVi: '',
};

function compactWhitespace(value: string) {
  return value.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function joinGuideLines(lines: Array<string | undefined | null>) {
  return compactWhitespace(lines.filter(Boolean).join('\n'));
}

export const MERCY_GUIDE_ANSWERS: BilingualAnswerSet = {
  greeting: {
    vi: 'Chào bạn. Bạn cứ nói rõ điều bạn muốn làm, mình sẽ hỗ trợ ngắn gọn và từng bước.',
    en: 'Hi. Tell me what you want to do, and I will help step by step.',
  },

  app_intro: {
    vi:
      'Mercy Host là người đồng hành trong app này. Bạn có thể dùng Guide để hỏi tự do, Teacher để được hướng dẫn học, English để xem và hiểu nội dung tiếng Anh, và Speak để luyện phát âm bằng ghi âm, nghe lại, so sánh và chấm điểm khi có kết quả.',
    en:
      'Mercy Host is your guide inside this app. You can use Guide for open questions, Teacher for guided study help, English for room content and explanations, and Speak for pronunciation practice with recording, playback, comparison, and scoring when available.',
  },

  app_usage: {
    vi:
      'Cách dùng app nhanh nhất là thế này:\n• Guide để hỏi điều bạn cần\n• Teacher để nhận hướng dẫn học\n• English để xem nội dung và giải thích\n• Speak để luyện phát âm\n\nBước đầu tốt nhất là nói rõ kỹ năng bạn muốn luyện: grammar, reading, writing, pronunciation, hoặc speaking.',
    en:
      'The fastest way to use this app is:\n• Guide for questions\n• Teacher for guided study help\n• English for content and explanations\n• Speak for pronunciation practice\n\nThe best first step is to say which skill you want to train: grammar, reading, writing, pronunciation, or speaking.',
  },

  study_plan: {
    vi: (ctx) =>
      joinGuideLines([
        ctx.roomLineVi,
        ctx.topicLineVi,
        ctx.goalLineVi,
        ctx.levelLineVi,
        '',
        'Bạn có thể bắt đầu theo thứ tự này:',
        '1. Chọn một kỹ năng chính: grammar, reading, writing, pronunciation, hoặc speaking.',
        '2. Dùng nội dung của phòng này để luyện đúng kỹ năng đó.',
        '3. Làm một nhiệm vụ nhỏ trước, rồi kiểm tra lại.',
        '',
        'Ví dụ:',
        '• Grammar: tìm 1 mẫu câu rồi tự đặt 2 câu mới',
        '• Reading: đọc 1 đoạn và tóm tắt ý chính',
        '• Writing: viết 3–5 câu từ chủ đề đang học',
        '• Pronunciation: chọn 1 câu ngắn rồi đưa sang Speak để luyện',
      ]),
    en: (ctx) =>
      joinGuideLines([
        ctx.roomLineEn,
        ctx.topicLineEn,
        ctx.goalLineEn,
        ctx.levelLineEn,
        '',
        'A good way to start is:',
        '1. Pick one main skill: grammar, reading, writing, pronunciation, or speaking.',
        '2. Use the content in this room for that skill.',
        '3. Do one small task first, then check your result.',
        '',
        'Examples:',
        '• Grammar: find one pattern and make two new sentences',
        '• Reading: read one passage and summarize the main idea',
        '• Writing: write 3–5 sentences from the room topic',
        '• Pronunciation: choose one short sentence and move to Speak to practice',
      ]),
  },

  room_usage: {
    vi: (ctx) =>
      joinGuideLines([
        ctx.roomLineVi,
        ctx.topicLineVi,
        ctx.goalLineVi,
        ctx.levelLineVi,
        '',
        'Bạn có thể dùng phòng này theo ba bước:',
        '1. Đọc nội dung hoặc xác định chủ đề chính',
        '2. Hỏi mình về grammar, reading, writing, vocabulary, hoặc meaning',
        '3. Chỉ chuyển sang Speak khi bạn muốn luyện pronunciation hoặc speaking',
      ]),
    en: (ctx) =>
      joinGuideLines([
        ctx.roomLineEn,
        ctx.topicLineEn,
        ctx.goalLineEn,
        ctx.levelLineEn,
        '',
        'You can use this room in three steps:',
        '1. Read the content or identify the main topic',
        '2. Ask me about grammar, reading, writing, vocabulary, or meaning',
        '3. Move to Speak only when you want pronunciation or speaking practice',
      ]),
  },

  room_summary: {
    vi: (ctx) =>
      joinGuideLines([
        ctx.roomLineVi,
        ctx.topicLineVi,
        '',
        'Bạn có thể nhờ mình:',
        '• giải thích ngắn gọn',
        '• tóm tắt ý chính',
        '• chỉ ra từ vựng hoặc grammar quan trọng',
        '• giúp viết hoặc luyện nói từ nội dung này',
      ]),
    en: (ctx) =>
      joinGuideLines([
        ctx.roomLineEn,
        ctx.topicLineEn,
        '',
        'You can ask me to:',
        '• explain it simply',
        '• summarize the main idea',
        '• point out important vocabulary or grammar',
        '• help you write or speak from this content',
      ]),
  },

  grammar_plan: {
    vi: (ctx) =>
      joinGuideLines([
        ctx.roomLineVi,
        ctx.topicLineVi,
        '',
        'Nếu bạn muốn học grammar, hãy làm theo cách này:',
        '1. Tìm 1 mẫu câu hoặc 1 điểm ngữ pháp trong nội dung',
        '2. Xem nó diễn tả thời, vị trí, quan hệ, hay ý định gì',
        '3. Tự viết lại 2–3 câu mới theo cùng mẫu',
        '',
        'Trong app:',
        '• gửi cho mình 1 câu và hỏi điểm grammar chính là gì',
        '• yêu cầu mình đổi câu đó sang ví dụ đơn giản hơn',
        '• nhờ mình kiểm tra 2 câu bạn tự viết',
      ]),
    en: (ctx) =>
      joinGuideLines([
        ctx.roomLineEn,
        ctx.topicLineEn,
        '',
        'If you want to study grammar, use this flow:',
        '1. Find one pattern or grammar point in the content',
        '2. Notice what it expresses: time, place, relationship, or intention',
        '3. Make 2–3 new sentences with the same pattern',
        '',
        'In the app:',
        '• send me one sentence and ask what the main grammar point is',
        '• ask me to simplify the pattern',
        '• ask me to check two sentences you wrote',
      ]),
  },

  reading_plan: {
    vi: (ctx) =>
      joinGuideLines([
        ctx.roomLineVi,
        ctx.topicLineVi,
        '',
        'Nếu bạn muốn luyện reading, hãy làm thế này:',
        '1. Đọc từng đoạn ngắn, không cần hiểu mọi từ ngay',
        '2. Tìm chủ đề chính và 2–3 ý hỗ trợ',
        '3. Đánh dấu từ hoặc câu làm bạn chậm lại',
        '',
        'Trong app:',
        '• nhờ mình giải thích một đoạn ngắn theo cách dễ hơn',
        '• hỏi từ vựng quan trọng trong đoạn',
        '• nhờ mình tóm tắt ý chính sau khi bạn đọc',
      ]),
    en: (ctx) =>
      joinGuideLines([
        ctx.roomLineEn,
        ctx.topicLineEn,
        '',
        'If you want to train reading, do this:',
        '1. Read short sections first and do not stop on every word',
        '2. Find the main topic and 2–3 supporting ideas',
        '3. Mark the words or lines that slow you down',
        '',
        'In the app:',
        '• ask me to explain one short paragraph more simply',
        '• ask for the important vocabulary in the passage',
        '• ask me to summarize the main idea after you read',
      ]),
  },

  reading_comprehension_plan: {
    vi: (ctx) =>
      joinGuideLines([
        ctx.roomLineVi,
        ctx.topicLineVi,
        '',
        'Nếu bạn muốn luyện reading comprehension, tập trung vào hiểu nghĩa chứ không chỉ đọc chữ:',
        '1. Đọc 1 đoạn ngắn',
        '2. Trả lời: đoạn này nói về ai / cái gì / vì sao / kết quả là gì',
        '3. Nói lại bằng lời của bạn',
        '4. Kiểm tra lại bằng cách hỏi mình xem bạn hiểu đúng chưa',
        '',
        'Trong app:',
        '• nhờ mình đặt 2–3 câu hỏi kiểm tra hiểu bài',
        '• nhờ mình so sánh ý chính với ý phụ',
        '• nhờ mình kiểm tra phần tóm tắt của bạn',
      ]),
    en: (ctx) =>
      joinGuideLines([
        ctx.roomLineEn,
        ctx.topicLineEn,
        '',
        'If you want reading comprehension practice, focus on meaning, not only decoding words:',
        '1. Read one short passage',
        '2. Answer: who or what is it about, why does it matter, and what happens',
        '3. Retell it in your own words',
        '4. Check your understanding with me',
        '',
        'In the app:',
        '• ask me for 2–3 comprehension questions',
        '• ask me to separate the main idea from details',
        '• ask me to check your summary',
      ]),
  },

  writing_plan: {
    vi: (ctx) =>
      joinGuideLines([
        ctx.roomLineVi,
        ctx.topicLineVi,
        '',
        'Nếu bạn muốn cải thiện writing, hãy đi theo vòng này:',
        '1. Chọn 1 chủ đề nhỏ từ phòng hiện tại',
        '2. Viết 3–5 câu ngắn trước',
        '3. Kiểm tra grammar, clarity, và từ nối',
        '4. Viết lại bản tốt hơn',
        '',
        'Trong app:',
        '• đưa cho mình đoạn bạn viết để mình sửa cho tự nhiên hơn',
        '• nhờ mình biến ý ngắn thành câu hoàn chỉnh',
        '• nhờ mình cho 1 mẫu đoạn văn đơn giản trước khi bạn tự viết',
      ]),
    en: (ctx) =>
      joinGuideLines([
        ctx.roomLineEn,
        ctx.topicLineEn,
        '',
        'If you want to improve writing, use this loop:',
        '1. Choose one small topic from the current room',
        '2. Write 3–5 short sentences first',
        '3. Check grammar, clarity, and connectors',
        '4. Rewrite a cleaner version',
        '',
        'In the app:',
        '• paste your writing and ask me to make it more natural',
        '• ask me to turn short ideas into complete sentences',
        '• ask me for a simple model paragraph before you write your own',
      ]),
  },

  pronunciation_plan: {
    vi: (ctx) =>
      joinGuideLines([
        ctx.roomLineVi,
        ctx.topicLineVi,
        '',
        'Nếu bạn muốn luyện pronunciation:',
        '1. Chọn 1 câu ngắn từ nội dung hiện tại',
        '2. Đọc chậm và chú ý trọng âm / âm cuối',
        '3. Chuyển sang Speak để ghi âm, nghe lại, và so sánh',
        '4. Chỉ sửa 1–2 điểm mỗi lần',
        '',
        'Khi nào nên dùng Speak:',
        '• khi bạn muốn nghe lại chính giọng của mình',
        '• khi bạn muốn so sánh và lặp lại từng câu ngắn',
      ]),
    en: (ctx) =>
      joinGuideLines([
        ctx.roomLineEn,
        ctx.topicLineEn,
        '',
        'If you want pronunciation practice:',
        '1. Choose one short sentence from the current content',
        '2. Read slowly and notice stress and ending sounds',
        '3. Move to Speak to record, replay, and compare',
        '4. Fix only 1–2 points each round',
        '',
        'Use Speak when:',
        '• you want to hear your own voice again',
        '• you want sentence-by-sentence comparison and repetition',
      ]),
  },

  speaking_plan: {
    vi: (ctx) =>
      joinGuideLines([
        ctx.roomLineVi,
        ctx.topicLineVi,
        '',
        'Nếu bạn muốn luyện speaking:',
        '1. Bắt đầu bằng 1 ý ngắn hoặc 1 câu mẫu',
        '2. Nói thành 2–3 câu liên tiếp',
        '3. Kiểm tra clarity, grammar, và pronunciation',
        '4. Sau đó mới đưa sang Speak nếu bạn muốn luyện phát âm hoặc độ trôi chảy',
        '',
        'Mình có thể giúp bạn chuẩn bị câu trước khi bạn mở Speak.',
      ]),
    en: (ctx) =>
      joinGuideLines([
        ctx.roomLineEn,
        ctx.topicLineEn,
        '',
        'If you want speaking practice:',
        '1. Start with one idea or one model sentence',
        '2. Expand it into 2–3 connected sentences',
        '3. Check clarity, grammar, and pronunciation',
        '4. Then move to Speak if you want voice practice or fluency repetition',
        '',
        'I can help you prepare the sentences before you open Speak.',
      ]),
  },

  speak_redirect: {
    vi:
      'Được nhé. Hãy mở Speak, nhập một câu ngắn, rồi nhấn Record. Mình sẽ giúp bạn nghe, so sánh và sửa từng cụm ngắn một.',
    en:
      'Yes. Open Speak, enter one short phrase, then tap Record. I will help you listen, compare, and improve one phrase at a time.',
  },

  fallback: {
    vi:
      'Mình có thể giúp bạn về grammar, reading, reading comprehension, writing, pronunciation, speaking, vocabulary, hoặc giải thích một đoạn cụ thể. Bạn cứ dán nội dung hoặc nói rõ kỹ năng bạn muốn luyện.',
    en:
      'I can help with grammar, reading, reading comprehension, writing, pronunciation, speaking, vocabulary, or explain a specific passage. Paste the content or tell me which skill you want to train.',
  },
};

export function getMercyGuideAnswer(
  key: GuideReplyKey,
  language: GuideReplyLanguage,
  ctx?: RoomAnswerContext
): string {
  const entry = MERCY_GUIDE_ANSWERS[key][language];
  const safeContext: RoomAnswerContext = {
    ...DEFAULT_ROOM_CONTEXT,
    ...(ctx || {}),
  };

  if (typeof entry === 'function') {
    return entry(safeContext);
  }

  return entry;
}