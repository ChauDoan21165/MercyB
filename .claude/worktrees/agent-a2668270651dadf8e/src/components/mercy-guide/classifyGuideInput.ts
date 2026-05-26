import type {
  GuideClassification,
  GuideSkillIntent,
  GuideTaskIntent,
} from './guideRoutingSpec';

function cleanText(value?: string | null) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
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
    'ngữ pháp',
    'đọc hiểu',
    'viết',
    'giải thích',
    'đoạn này',
    'câu này',
  ];

  return viSignals.some((signal) => lower.includes(signal)) ? 'vi' : 'en';
}

export function extractGuidePayload(input: string) {
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

function detectTaskIntent(lower: string, payload: string): GuideTaskIntent | undefined {
  if (
    payload &&
    includesAny(lower, [
      'what the main grammar point',
      'what is the main grammar point',
      'main grammar point',
      'explain grammar',
      'grammar in this',
      'explain the grammar',
      'giải thích ngữ pháp',
      'giải thích grammar',
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
    ])
  ) {
    return 'give_simple_patterns';
  }

  if (
    payload &&
    includesAny(lower, [
      'summarize this',
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
      'câu hỏi đọc hiểu',
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
    ])
  ) {
    return 'check_writing';
  }

  if (
    payload &&
    includesAny(lower, [
      'rewrite simpler',
      'simplify this',
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
    ])
  ) {
    return 'extract_vocabulary';
  }

  return undefined;
}

function detectSkillIntent(lower: string): GuideSkillIntent | undefined {
  if (includesAny(lower, ['grammar', 'grammer', 'ngữ pháp'])) return 'grammar';
  if (includesAny(lower, ['reading comprehension', 'comprehension', 'đọc hiểu'])) {
    return 'reading_comprehension';
  }
  if (includesAny(lower, ['reading', 'đọc', 'reading skill'])) return 'reading';
  if (includesAny(lower, ['writing', 'viết', 'improve writing'])) return 'writing';
  if (includesAny(lower, ['pronunciation', 'phát âm'])) return 'pronunciation';
  if (includesAny(lower, ['speaking', 'luyện nói', 'conversation'])) return 'speaking';
  return undefined;
}

function isPronunciationOrSpeakingOnly(
  lower: string,
  skillIntent?: GuideSkillIntent,
  taskIntent?: GuideTaskIntent
) {
  if (taskIntent) return false;
  if (!skillIntent) return false;
  if (skillIntent !== 'pronunciation' && skillIntent !== 'speaking') return false;

  const nonSpeakSignals = ['grammar', 'writing', 'reading', 'đọc', 'viết', 'ngữ pháp'];
  return !includesAny(lower, nonSpeakSignals);
}

export function classifyGuideInput(input: string): GuideClassification {
  const lower = cleanText(input).toLowerCase();
  const language = detectGuideLanguage(input);
  const payload = extractGuidePayload(input);
  const hasPayload = Boolean(payload);
  const taskIntent = detectTaskIntent(lower, payload);
  const skillIntent = detectSkillIntent(lower);

  if (taskIntent && hasPayload) {
    return {
      language,
      route: 'api_tutor',
      taskIntent,
      skillIntent,
      hasPayload,
      payload,
    };
  }

  if (isPronunciationOrSpeakingOnly(lower, skillIntent, taskIntent)) {
    return {
      language,
      route: 'speak_route',
      skillIntent,
      hasPayload,
      payload,
    };
  }

  if (
    skillIntent ||
    includesAny(lower, [
      'guide me',
      'help me study',
      'how do i study',
      'how do i use this room',
      'how do i use this app',
      'what can you do',
      'chào',
      'hi',
      'hello',
    ])
  ) {
    return {
      language,
      route: 'prewritten',
      skillIntent,
      hasPayload,
      payload,
    };
  }

  return {
    language,
    route: 'fallback',
    hasPayload,
    payload,
  };
}