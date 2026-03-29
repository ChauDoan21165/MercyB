import {
  getMercyGuideAnswer,
  joinGuideLines,
  type GuideReplyKey,
  type RoomAnswerContext,
} from './mercyGuideAnswers';

export type GuideArticle = {
  id?: string | number;
  title?: string;
  summary?: string;
  excerpt?: string;
  description?: string;
  content?: string;
  tags?: string[];
};

export type ReplySource = 'mercy_library' | 'fallback';

export type ResolvedReply = {
  text: string;
  language: 'vi' | 'en';
  suggestSpeak: boolean;
  source: ReplySource;
};

export interface ResolveMercyGuideReplyParams {
  input: string;
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  articles?: GuideArticle[];
  englishLevel?: string | null;
  learningGoal?: string | null;
}

type SkillIntent =
  | 'grammar'
  | 'reading'
  | 'reading_comprehension'
  | 'writing'
  | 'pronunciation'
  | 'speaking';

type TaskIntent =
  | 'explain_grammar_in_text'
  | 'give_simple_patterns'
  | 'summarize_text'
  | 'reading_comprehension_questions'
  | 'check_writing'
  | 'rewrite_simpler'
  | 'extract_vocabulary';

function cleanText(value?: string | null) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function humanizeSlug(value?: string | null) {
  const text = cleanText(value);
  if (!text) return '';
  return text.replace(/[-_/]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

function truncate(value?: string | null, maxWords = 24) {
  const text = cleanText(value);
  if (!text) return '';

  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(' ')}…`;
}

function deriveRoomName(
  roomTitle?: string,
  pathSlug?: string,
  tier?: string,
  roomId?: string
) {
  return (
    cleanText(roomTitle) ||
    humanizeSlug(pathSlug) ||
    (cleanText(tier) ? `${cleanText(tier)} room` : '') ||
    (cleanText(roomId) ? `room ${cleanText(roomId)}` : '') ||
    'this room'
  );
}

function deriveTopic(tags?: string[], articles?: GuideArticle[]) {
  const safeTags = (tags ?? []).map(cleanText).filter(Boolean);
  if (safeTags.length > 0) {
    return safeTags.slice(0, 4).join(', ');
  }

  const firstArticle = (articles ?? []).find((article) => {
    return Boolean(
      cleanText(article.summary) ||
        cleanText(article.excerpt) ||
        cleanText(article.description) ||
        cleanText(article.content)
    );
  });

  const articleText =
    cleanText(firstArticle?.summary) ||
    cleanText(firstArticle?.excerpt) ||
    cleanText(firstArticle?.description) ||
    cleanText(firstArticle?.content);

  return truncate(articleText, 14) || '';
}

function includesAny(text: string, candidates: string[]) {
  return candidates.some((candidate) => text.includes(candidate));
}

export function detectGuideLanguage(text: string): 'vi' | 'en' {
  const lower = cleanText(text).toLowerCase();

  const viSignals = [
    'mình',
    'bạn',
    'giúp',
    'phòng',
    'học',
    'thế nào',
    'ở đâu',
    'phát âm',
    'luyện',
    'được không',
    'tiếng việt',
    'xin chào',
    'chào',
    'ứng dụng',
    'app này',
    'sửa',
    'nói',
    'đọc',
    'ngữ pháp',
    'đọc hiểu',
    'viết',
    'giải thích',
    'đoạn này',
    'câu này',
  ];

  return viSignals.some((signal) => lower.includes(signal)) ? 'vi' : 'en';
}

function buildRoomAnswerContext(
  roomName: string,
  topic: string,
  learningGoal?: string | null,
  englishLevel?: string | null
): RoomAnswerContext {
  const goal = cleanText(learningGoal);
  const level = cleanText(englishLevel);

  return {
    roomName,
    roomLineEn: `${roomName} is a study space inside the app.`,
    roomLineVi: `${roomName} là một không gian học trong ứng dụng.`,
    topicLineEn: topic ? `Current topic: ${topic}.` : '',
    topicLineVi: topic ? `Chủ đề hiện tại: ${topic}.` : '',
    goalLineEn: goal ? `Your current goal is ${goal}.` : '',
    goalLineVi: goal ? `Mục tiêu hiện tại của bạn là ${goal}.` : '',
    levelLineEn: level ? `I will try to support your ${level} level.` : '',
    levelLineVi: level ? `Mình sẽ cố gắng hỗ trợ theo mức ${level}.` : '',
  };
}

function buildStaticReply(
  key: GuideReplyKey,
  language: 'vi' | 'en',
  source: ReplySource,
  ctx?: RoomAnswerContext
): ResolvedReply {
  return {
    text: getMercyGuideAnswer(key, language, ctx),
    language,
    suggestSpeak: key === 'speak_redirect',
    source,
  };
}

function skillKey(intent: SkillIntent): GuideReplyKey {
  switch (intent) {
    case 'grammar':
      return 'grammar_plan';
    case 'reading':
      return 'reading_plan';
    case 'reading_comprehension':
      return 'reading_comprehension_plan';
    case 'writing':
      return 'writing_plan';
    case 'pronunciation':
      return 'pronunciation_plan';
    case 'speaking':
      return 'speaking_plan';
  }
}

function detectSkillIntents(text: string): SkillIntent[] {
  const lower = cleanText(text).toLowerCase();
  const intents: SkillIntent[] = [];

  if (
    includesAny(lower, [
      'grammar',
      'grammer',
      'ngữ pháp',
      'sentence pattern',
      'tense',
    ])
  ) {
    intents.push('grammar');
  }

  if (
    includesAny(lower, [
      'reading comprehension',
      'comprehension',
      'understand what i read',
      'understanding what i read',
      'read and understand',
      'đọc hiểu',
      'hiểu bài đọc',
      'hiểu đoạn đọc',
    ])
  ) {
    intents.push('reading_comprehension');
  }

  if (
    includesAny(lower, [
      'reading skill',
      'reading practice',
      'practice reading',
      'train my reading',
      'improve reading',
      'reading',
      'đọc',
      'luyện đọc',
      'kỹ năng đọc',
    ])
  ) {
    intents.push('reading');
  }

  if (
    includesAny(lower, [
      'writing',
      'write better',
      'improve writing',
      'train my writing',
      'help me write',
      'viết',
      'luyện viết',
      'cải thiện viết',
    ])
  ) {
    intents.push('writing');
  }

  if (
    includesAny(lower, [
      'pronunciation',
      'phát âm',
      'correct my pronunciation',
      'fix my pronunciation',
      'accent',
      'ending sounds',
    ])
  ) {
    intents.push('pronunciation');
  }

  if (
    includesAny(lower, [
      'speaking',
      'speak better',
      'speaking skill',
      'fluency',
      'conversation',
      'nói',
      'luyện nói',
      'kỹ năng nói',
    ])
  ) {
    intents.push('speaking');
  }

  return Array.from(new Set(intents));
}

function isGreeting(text: string) {
  const lower = cleanText(text).toLowerCase();
  return /^(hi|hello|hey|chào|xin chào)\b/.test(lower) || lower === 'hi' || lower === 'hello';
}

function isAppIntro(text: string) {
  const lower = cleanText(text).toLowerCase();
  return includesAny(lower, [
    'introduce this app',
    'introduce the app',
    'about this app',
    'what is this app',
    'introduce this application',
    'introduce the application',
    'ứng dụng này là gì',
    'giới thiệu app',
    'giới thiệu ứng dụng',
    'giới thiệu về app',
    'giới thiệu về ứng dụng',
  ]);
}

function isAppUsage(text: string) {
  const lower = cleanText(text).toLowerCase();
  return includesAny(lower, [
    'guide me how to use this app',
    'guide me to use this app',
    'how do i use this app',
    'how users use this app',
    'how to use this app',
    'help me use this app',
    'how does this app work',
    'what can you do',
    'what do you do',
    'hướng dẫn mình dùng app',
    'dùng app này thế nào',
    'dùng ứng dụng này thế nào',
    'app này dùng sao',
    'ứng dụng này dùng sao',
    'bạn làm được gì',
  ]);
}

function isStudyPlanIntent(text: string) {
  const lower = cleanText(text).toLowerCase();
  return includesAny(lower, [
    'guide me',
    'help me study',
    'how do i study',
    'how should i study',
    'how can i study',
    'how to study',
    'where do i start',
    'can you help me to study',
    'can you help me study',
    'hướng dẫn mình',
    'mình nên học thế nào',
    'mình nên bắt đầu thế nào',
    'học thế nào',
    'bắt đầu từ đâu',
  ]);
}

function isRoomUsageIntent(text: string) {
  const lower = cleanText(text).toLowerCase();
  return includesAny(lower, [
    'how do i use this room',
    'how to use this room',
    'how do i study here',
    'how should i study here',
    'study with this room',
    'study in this room',
    'how do i learn here',
    'phòng này học thế nào',
    'dùng phòng này thế nào',
    'sử dụng phòng này thế nào',
    'mình học ở đây thế nào',
    'học ở đây sao',
  ]);
}

function isRoomSummaryIntent(text: string) {
  const lower = cleanText(text).toLowerCase();
  return includesAny(lower, [
    'what is this room',
    'what is this room about',
    'what is this about',
    'where are we',
    'where am i',
    'what room is this',
    'phòng này là gì',
    'phòng này học gì',
    'đây là đâu',
    'đang ở đâu',
    'room này là gì',
  ]);
}

function shouldAutoSuggestSpeak(intents: SkillIntent[], text: string) {
  if (intents.length !== 1) return false;

  const onlyIntent = intents[0];
  if (onlyIntent !== 'pronunciation' && onlyIntent !== 'speaking') {
    return false;
  }

  const lower = cleanText(text).toLowerCase();
  return includesAny(lower, [
    'practice pronunciation',
    'i want to practice pronunciation',
    'train pronunciation',
    'open speak',
    'use speak',
    'luyện phát âm',
    'mở speak',
    'speak now',
    'practice speaking',
    'i want to practice speaking',
    'luyện nói',
  ]);
}

function extractExplicitPayload(input: string) {
  const raw = String(input ?? '');
  const patterns = [
    /\bin this\s*:\s*([\s\S]+)/i,
    /\bfrom this\s*:\s*([\s\S]+)/i,
    /\bfor this\s*:\s*([\s\S]+)/i,
    /\bsentence\s*:\s*([\s\S]+)/i,
    /\bparagraph\s*:\s*([\s\S]+)/i,
    /\btext\s*:\s*([\s\S]+)/i,
    /\bđoạn này\s*:\s*([\s\S]+)/i,
    /\bcâu này\s*:\s*([\s\S]+)/i,
    /\bđoạn văn này\s*:\s*([\s\S]+)/i,
    /\bnội dung này\s*:\s*([\s\S]+)/i,
  ];

  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match?.[1]) {
      return cleanText(match[1]);
    }
  }

  const quoted = raw.match(/["“](.+?)["”]/);
  if (quoted?.[1]) {
    return cleanText(quoted[1]);
  }

  return '';
}

function splitSentences(text: string) {
  return cleanText(text)
    .split(/(?<=[.!?])\s+/)
    .map(cleanText)
    .filter(Boolean);
}

function classifySentence(sentence: string) {
  const trimmed = cleanText(sentence);
  const lower = trimmed.toLowerCase();

  const firstWord = lower.split(/\s+/)[0] || '';
  const imperativeStarters = [
    'start',
    'build',
    'discover',
    'find',
    'use',
    'read',
    'write',
    'take',
    'choose',
    'look',
    'notice',
    'ask',
    'move',
    'practice',
    'keep',
    'try',
    'begin',
    'hãy',
  ];

  if (imperativeStarters.includes(firstWord)) {
    return 'imperative';
  }

  if (lower.startsWith('guidance for ') || lower.startsWith('support for ')) {
    return 'noun_phrase';
  }

  if (firstWord.endsWith('ing')) {
    return 'gerund_opening';
  }

  return 'statement';
}

function buildGrammarExecutionReply(
  payload: string,
  language: 'vi' | 'en',
  roomContext: RoomAnswerContext
): ResolvedReply {
  const sentences = splitSentences(payload).slice(0, 3);
  const analyses = sentences.map((sentence) => {
    const type = classifySentence(sentence);

    if (type === 'imperative') {
      return language === 'vi'
        ? `• "${sentence}" → đây là câu mệnh lệnh / chỉ dẫn. Động từ đứng ở dạng gốc để đưa ra hành động trực tiếp.`
        : `• "${sentence}" → this is an imperative sentence. The base verb is used to give a direct action or instruction.`;
    }

    if (type === 'noun_phrase' || type === 'gerund_opening') {
      return language === 'vi'
        ? `• "${sentence}" → đây giống một cụm danh từ hoặc tiêu đề ngắn, không phải câu hoàn chỉnh kiểu chủ ngữ + động từ hữu hạn.`
        : `• "${sentence}" → this works like a noun phrase or heading, not a full clause with a clear finite verb pattern.`;
    }

    return language === 'vi'
      ? `• "${sentence}" → đây là câu trần thuật / mô tả. Bạn có thể chú ý trật tự từ và phần bổ nghĩa phía sau danh từ hoặc động từ.`
      : `• "${sentence}" → this is a descriptive statement. Notice the word order and the modifiers after the noun or verb.`;
  });

  const simplePatterns =
    language === 'vi'
      ? [
          'Mẫu đơn giản 1: Guidance for + noun',
          'Ví dụ: Guidance for recovery.',
          'Mẫu đơn giản 2: Start with + noun phrase',
          'Ví dụ: Start with small steps.',
        ]
      : [
          'Simple pattern 1: Guidance for + noun',
          'Example: Guidance for recovery.',
          'Simple pattern 2: Start with + noun phrase',
          'Example: Start with small steps.',
        ];

  const intro =
    language === 'vi'
      ? joinGuideLines([
          roomContext.roomLineVi,
          roomContext.topicLineVi,
          '',
          'Mình sẽ giải thích grammar trực tiếp từ đoạn bạn đưa:',
        ])
      : joinGuideLines([
          roomContext.roomLineEn,
          roomContext.topicLineEn,
          '',
          'I will explain the grammar directly from the text you gave:',
        ]);

  const ending =
    language === 'vi'
      ? [
          '',
          'Bước tiếp theo tốt nhất:',
          '• chọn 1 câu trong đoạn này',
          '• nhờ mình viết lại câu đó theo mẫu đơn giản hơn',
          '• sau đó tự viết 2 câu mới theo cùng mẫu',
        ]
      : [
          '',
          'Best next step:',
          '• choose one sentence from this text',
          '• ask me to rewrite it in a simpler pattern',
          '• then write 2 new sentences with the same pattern',
        ];

  return {
    text: joinGuideLines([intro, ...analyses, '', ...simplePatterns, ...ending]),
    language,
    suggestSpeak: false,
    source: 'mercy_library',
  };
}

function buildSummaryReply(
  payload: string,
  language: 'vi' | 'en',
  roomContext: RoomAnswerContext
): ResolvedReply {
  const sentences = splitSentences(payload);
  const first = sentences[0] || payload;
  const second = sentences[1] || '';

  const summary =
    language === 'vi'
      ? joinGuideLines([
          roomContext.roomLineVi,
          roomContext.topicLineVi,
          '',
          'Tóm tắt ngắn:',
          `• Ý chính: ${truncate(first, 18)}`,
          second ? `• Ý hỗ trợ: ${truncate(second, 18)}` : '',
          '',
          'Để kiểm tra hiểu bài, bạn có thể hỏi mình tiếp:',
          '• ý chính là gì',
          '• từ nào quan trọng',
          '• đoạn này muốn người đọc làm gì hoặc hiểu gì',
        ])
      : joinGuideLines([
          roomContext.roomLineEn,
          roomContext.topicLineEn,
          '',
          'Short summary:',
          `• Main idea: ${truncate(first, 18)}`,
          second ? `• Supporting idea: ${truncate(second, 18)}` : '',
          '',
          'To check understanding, you can ask me next:',
          '• what the main idea is',
          '• which vocabulary matters',
          '• what the reader is being asked to do or understand',
        ]);

  return {
    text: summary,
    language,
    suggestSpeak: false,
    source: 'mercy_library',
  };
}

function buildReadingQuestionsReply(
  payload: string,
  language: 'vi' | 'en',
  roomContext: RoomAnswerContext
): ResolvedReply {
  const sentences = splitSentences(payload);
  const anchor = truncate(sentences[0] || payload, 16);

  return {
    text:
      language === 'vi'
        ? joinGuideLines([
            roomContext.roomLineVi,
            roomContext.topicLineVi,
            '',
            'Đây là 3 câu hỏi đọc hiểu cho đoạn này:',
            `1. Đoạn này chủ yếu nói về điều gì?`,
            `2. Tác giả đang khuyến khích người đọc làm gì hoặc hiểu gì từ ý "${anchor}"?`,
            '3. Chi tiết nào trong đoạn hỗ trợ ý chính rõ nhất?',
            '',
            'Bạn có thể trả lời từng câu, rồi mình sẽ kiểm tra giúp bạn.',
          ])
        : joinGuideLines([
            roomContext.roomLineEn,
            roomContext.topicLineEn,
            '',
            'Here are 3 reading comprehension questions for this passage:',
            '1. What is the main point of this passage?',
            `2. What is the reader being encouraged to do or understand from the idea "${anchor}"?`,
            '3. Which detail supports the main idea most clearly?',
            '',
            'Answer them one by one and I can check your understanding.',
          ]),
    language,
    suggestSpeak: false,
    source: 'mercy_library',
  };
}

function buildWritingCheckReply(
  payload: string,
  language: 'vi' | 'en',
  roomContext: RoomAnswerContext
): ResolvedReply {
  const sentences = splitSentences(payload);
  const improved = sentences
    .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
    .join(' ');

  return {
    text:
      language === 'vi'
        ? joinGuideLines([
            roomContext.roomLineVi,
            roomContext.topicLineVi,
            '',
            'Mình sẽ kiểm tra writing của bạn theo 3 điểm:',
            '• clarity',
            '• grammar',
            '• flow',
            '',
            `Bản hiện tại: ${payload}`,
            '',
            `Một bản gọn và rõ hơn có thể là: ${improved}`,
            '',
            'Bạn có thể gửi tiếp 3–5 câu của riêng bạn, mình sẽ sửa từng câu.',
          ])
        : joinGuideLines([
            roomContext.roomLineEn,
            roomContext.topicLineEn,
            '',
            'I will check your writing for 3 things:',
            '• clarity',
            '• grammar',
            '• flow',
            '',
            `Current version: ${payload}`,
            '',
            `A cleaner version could be: ${improved}`,
            '',
            'Send your own 3–5 sentences next and I can correct them one by one.',
          ]),
    language,
    suggestSpeak: false,
    source: 'mercy_library',
  };
}

function buildSimplerRewriteReply(
  payload: string,
  language: 'vi' | 'en',
  roomContext: RoomAnswerContext
): ResolvedReply {
  const sentences = splitSentences(payload);
  const rewritten = sentences.map((sentence) => {
    const lower = sentence.toLowerCase();

    if (lower.startsWith('guidance for ')) {
      return language === 'vi'
        ? 'This gives help for recovery.'
        : 'This gives help for recovery.';
    }

    if (lower.startsWith('discover ')) {
      return language === 'vi'
        ? 'You can find more help in higher tiers.'
        : 'You can find more help in higher tiers.';
    }

    return sentence;
  });

  return {
    text:
      language === 'vi'
        ? joinGuideLines([
            roomContext.roomLineVi,
            roomContext.topicLineVi,
            '',
            'Đây là bản đơn giản hơn:',
            ...rewritten.map((line) => `• ${line}`),
            '',
            'Nếu muốn, mình có thể tiếp tục đổi đoạn này sang mức dễ hơn nữa.',
          ])
        : joinGuideLines([
            roomContext.roomLineEn,
            roomContext.topicLineEn,
            '',
            'Here is a simpler rewrite:',
            ...rewritten.map((line) => `• ${line}`),
            '',
            'If you want, I can simplify the passage even further.',
          ]),
    language,
    suggestSpeak: false,
    source: 'mercy_library',
  };
}

function buildVocabularyReply(
  payload: string,
  language: 'vi' | 'en',
  roomContext: RoomAnswerContext
): ResolvedReply {
  const words = Array.from(
    new Set(
      cleanText(payload)
        .replace(/[^a-zA-Z\s-]/g, ' ')
        .split(/\s+/)
        .filter((word) => word.length >= 7)
    )
  ).slice(0, 4);

  const mapped =
    words.length > 0
      ? words
      : ['guidance', 'recovering', 'intentional', 'support'];

  return {
    text:
      language === 'vi'
        ? joinGuideLines([
            roomContext.roomLineVi,
            roomContext.topicLineVi,
            '',
            'Một vài từ đáng chú ý trong đoạn này:',
            ...mapped.map((word) => `• ${word}`),
            '',
            'Nếu muốn, mình có thể giải thích từng từ bằng nghĩa đơn giản và ví dụ ngắn.',
          ])
        : joinGuideLines([
            roomContext.roomLineEn,
            roomContext.topicLineEn,
            '',
            'A few useful words in this passage are:',
            ...mapped.map((word) => `• ${word}`),
            '',
            'If you want, I can explain each one with a simple meaning and short example.',
          ]),
    language,
    suggestSpeak: false,
    source: 'mercy_library',
  };
}

function buildCombinedSkillsReply(
  intents: SkillIntent[],
  language: 'vi' | 'en',
  roomContext: RoomAnswerContext
): ResolvedReply {
  const introVi = joinGuideLines([
    roomContext.roomLineVi,
    roomContext.topicLineVi,
    roomContext.goalLineVi,
    roomContext.levelLineVi,
    '',
    'Bạn đang muốn luyện nhiều kỹ năng. Cách an toàn nhất là tách ra theo thứ tự này:',
  ]);

  const introEn = joinGuideLines([
    roomContext.roomLineEn,
    roomContext.topicLineEn,
    roomContext.goalLineEn,
    roomContext.levelLineEn,
    '',
    'You want to train multiple skills. The safest way is to split them in this order:',
  ]);

  const ordered = intents.slice().sort((a, b) => {
    const rank: Record<SkillIntent, number> = {
      reading: 1,
      reading_comprehension: 2,
      grammar: 3,
      writing: 4,
      speaking: 5,
      pronunciation: 6,
    };
    return rank[a] - rank[b];
  });

  const bodyVi = ordered.map((intent, index) => {
    switch (intent) {
      case 'reading':
        return `${index + 1}. Reading: đọc 1 đoạn ngắn, tìm ý chính, và đánh dấu chỗ khó.`;
      case 'reading_comprehension':
        return `${index + 1}. Reading comprehension: tự trả lời ai / cái gì / vì sao / kết quả là gì.`;
      case 'grammar':
        return `${index + 1}. Grammar: lấy 1 mẫu câu từ nội dung và viết 2 câu mới theo cùng mẫu.`;
      case 'writing':
        return `${index + 1}. Writing: viết 3–5 câu từ chủ đề hiện tại rồi nhờ mình sửa.`;
      case 'speaking':
        return `${index + 1}. Speaking: nói lại ý của bạn thành 2–3 câu trước khi luyện giọng.`;
      case 'pronunciation':
        return `${index + 1}. Pronunciation: sau cùng, chọn 1 câu ngắn và đưa sang Speak để ghi âm, nghe lại, và so sánh.`;
    }
  });

  const bodyEn = ordered.map((intent, index) => {
    switch (intent) {
      case 'reading':
        return `${index + 1}. Reading: read one short section, find the main idea, and mark difficult lines.`;
      case 'reading_comprehension':
        return `${index + 1}. Reading comprehension: answer who / what / why / what happens next.`;
      case 'grammar':
        return `${index + 1}. Grammar: take one pattern from the content and make two new sentences.`;
      case 'writing':
        return `${index + 1}. Writing: write 3–5 sentences from the current topic and let me check them.`;
      case 'speaking':
        return `${index + 1}. Speaking: say your idea in 2–3 connected sentences before voice drilling.`;
      case 'pronunciation':
        return `${index + 1}. Pronunciation: last, move one short sentence into Speak to record, replay, and compare.`;
    }
  });

  return {
    text:
      language === 'vi'
        ? joinGuideLines([
            introVi,
            ...bodyVi,
            '',
            'Speak chỉ cần dùng cho phần pronunciation / speaking, không cần cho grammar, reading, hoặc writing.',
          ])
        : joinGuideLines([
            introEn,
            ...bodyEn,
            '',
            'Use Speak only for the pronunciation / speaking part, not for grammar, reading, or writing.',
          ]),
    language,
    suggestSpeak: false,
    source: 'mercy_library',
  };
}

function detectTaskIntent(text: string, payload: string): TaskIntent | null {
  const lower = cleanText(text).toLowerCase();

  if (
    payload &&
    includesAny(lower, [
      'explain grammar',
      'grammar in this',
      'explain the grammar',
      'giải thích ngữ pháp',
      'giải thích grammar',
      'ngữ pháp trong đoạn này',
      'ngữ pháp trong câu này',
    ])
  ) {
    return 'explain_grammar_in_text';
  }

  if (
    payload &&
    includesAny(lower, [
      'simple patterns',
      '2 simple patterns',
      'give me patterns',
      'mẫu đơn giản',
      'cho mình 2 mẫu',
    ])
  ) {
    return 'give_simple_patterns';
  }

  if (
    payload &&
    includesAny(lower, [
      'summarize this',
      'summarize the paragraph',
      'summary of this',
      'tóm tắt đoạn này',
      'tóm tắt giúp',
    ])
  ) {
    return 'summarize_text';
  }

  if (
    payload &&
    includesAny(lower, [
      'reading comprehension questions',
      'comprehension questions',
      'questions for this paragraph',
      'câu hỏi đọc hiểu',
      'đặt câu hỏi đọc hiểu',
    ])
  ) {
    return 'reading_comprehension_questions';
  }

  if (
    payload &&
    includesAny(lower, [
      'check my writing',
      'correct my writing',
      'improve my writing',
      'sửa bài viết',
      'kiểm tra bài viết',
      'giúp sửa bài viết',
    ])
  ) {
    return 'check_writing';
  }

  if (
    payload &&
    includesAny(lower, [
      'rewrite simpler',
      'simplify this',
      'rewrite this more simply',
      'viết lại đơn giản hơn',
      'đơn giản hóa đoạn này',
    ])
  ) {
    return 'rewrite_simpler';
  }

  if (
    payload &&
    includesAny(lower, [
      'vocabulary in this',
      'key vocabulary',
      'important words',
      'từ vựng trong đoạn này',
      'từ quan trọng',
      'giải thích từ vựng',
    ])
  ) {
    return 'extract_vocabulary';
  }

  return null;
}

export function resolveMercyGuideReply(
  params: ResolveMercyGuideReplyParams
): ResolvedReply {
  const {
    input,
    roomId,
    roomTitle,
    tier,
    pathSlug,
    tags,
    articles,
    englishLevel,
    learningGoal,
  } = params;

  const language = detectGuideLanguage(input);
  const lower = cleanText(input).toLowerCase();
  const roomName = deriveRoomName(roomTitle, pathSlug, tier, roomId);
  const topic = deriveTopic(tags, articles);
  const roomContext = buildRoomAnswerContext(roomName, topic, learningGoal, englishLevel);

  const payload = extractExplicitPayload(input);
  const taskIntent = detectTaskIntent(input, payload);

  if (taskIntent === 'explain_grammar_in_text' || taskIntent === 'give_simple_patterns') {
    return buildGrammarExecutionReply(payload, language, roomContext);
  }

  if (taskIntent === 'summarize_text') {
    return buildSummaryReply(payload, language, roomContext);
  }

  if (taskIntent === 'reading_comprehension_questions') {
    return buildReadingQuestionsReply(payload, language, roomContext);
  }

  if (taskIntent === 'check_writing') {
    return buildWritingCheckReply(payload, language, roomContext);
  }

  if (taskIntent === 'rewrite_simpler') {
    return buildSimplerRewriteReply(payload, language, roomContext);
  }

  if (taskIntent === 'extract_vocabulary') {
    return buildVocabularyReply(payload, language, roomContext);
  }

  const intents = detectSkillIntents(lower);

  if (isGreeting(lower)) {
    return buildStaticReply('greeting', language, 'mercy_library');
  }

  if (isAppIntro(lower)) {
    return buildStaticReply('app_intro', language, 'mercy_library');
  }

  if (isAppUsage(lower)) {
    return buildStaticReply('app_usage', language, 'mercy_library');
  }

  if (isRoomUsageIntent(lower)) {
    return buildStaticReply('room_usage', language, 'mercy_library', roomContext);
  }

  if (isRoomSummaryIntent(lower)) {
    return buildStaticReply('room_summary', language, 'mercy_library', roomContext);
  }

  if (isStudyPlanIntent(lower)) {
    return buildStaticReply('study_plan', language, 'mercy_library', roomContext);
  }

  if (intents.length > 1) {
    return buildCombinedSkillsReply(intents, language, roomContext);
  }

  if (intents.length === 1) {
    const key = skillKey(intents[0]);
    return {
      text: getMercyGuideAnswer(key, language, roomContext),
      language,
      suggestSpeak: shouldAutoSuggestSpeak(intents, lower),
      source: 'mercy_library',
    };
  }

  if (
    lower.startsWith('what about ') ||
    lower.startsWith('còn ') ||
    lower.startsWith('thế còn ')
  ) {
    if (includesAny(lower, ['reading comprehension', 'comprehension', 'đọc hiểu'])) {
      return buildStaticReply('reading_comprehension_plan', language, 'mercy_library', roomContext);
    }
    if (includesAny(lower, ['reading', 'đọc'])) {
      return buildStaticReply('reading_plan', language, 'mercy_library', roomContext);
    }
    if (includesAny(lower, ['grammar', 'grammer', 'ngữ pháp'])) {
      return buildStaticReply('grammar_plan', language, 'mercy_library', roomContext);
    }
    if (includesAny(lower, ['writing', 'viết'])) {
      return buildStaticReply('writing_plan', language, 'mercy_library', roomContext);
    }
  }

  return {
    text: getMercyGuideAnswer('fallback', language, roomContext),
    language,
    suggestSpeak: false,
    source: 'fallback',
  };
}