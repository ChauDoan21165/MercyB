/**
 * Path: src/components/mercy-guide/logic/detectMercyIntent.ts
 */

export type MercyIntent =
  | 'ui_action'
  | 'speak_help'
  | 'english_explain'
  | 'emotional_support'
  | 'learning_path'
  | 'fallback_api';

function normalizeUserText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ');
}

function stripVietnamese(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function countAny(text: string, patterns: RegExp[]): number {
  return patterns.reduce(
    (count, pattern) => count + (pattern.test(text) ? 1 : 0),
    0
  );
}

const GREETING_ONLY_PATTERNS: RegExp[] = [
  /^(hi|hello|hey)$/,
  /^(hi|hello|hey)\s+(mercy|there)$/,
];

const UI_ACTION_PATTERNS: RegExp[] = [
  /\bopen speak\b/,
  /\bopen english\b/,
  /\bopen teacher\b/,
  /\bopen guide\b/,
  /\bshow me the speak tab\b/,
  /\bshow me the english tab\b/,
  /\bgo to speak\b/,
  /\bgo to english\b/,
  /\bstart with one phrase\b/,
  /\bchange phrase\b/,
  /\bfinish today\b/,
  /\bmaybe later\b/,
];

const SPEAK_HELP_STRONG_PATTERNS: RegExp[] = [
  /\bcorrect my pronunciation\b/,
  /\bcheck my pronunciation\b/,
  /\bcan you correct my pronunciation\b/,
  /\bcan you check my pronunciation\b/,
  /\bcan you correct my english pronunciation\b/,
  /\bhelp my pronunciation\b/,
  /\bhelp me pronounce\b/,
  /\bhelp me say\b/,
  /\blisten to my pronunciation\b/,
  /\blisten to me\b/,
  /\bhow do i say\b/,
  /\bhow should i say\b/,
  /\bhow do you pronounce\b/,
  /\bhow to pronounce\b/,
  /\bpronunciation help\b/,
  /\bspeaking practice\b/,
  /\bcan you hear me here in guide\b/,
  /\bcan you hear me here\b/,
  /\bcan you hear me in guide\b/,
  /\bsua phat am\b/,
  /\bchinh phat am\b/,
  /\bgiup phat am\b/,
  /\bhuong dan phat am\b/,
  /\bdoc the nao\b/,
  /\bnoi the nao\b/,
  /\bcach doc\b/,
  /\bban sua phat am cho toi\b/,
  /\bsua phat am cho toi\b/,
  /\bban co the sua phat am\b/,
  /\bgiup toi sua phat am\b/,
  /\bphat am cho toi\b/,
  /\bban giup toi sua phat am duoc khong\b/,
  /\bban sua phat am giup toi nhe\b/,
  /\bgiup toi phat am\b/,
  /\bkiem tra phat am cho toi\b/,
  /\bban co nghe toi o guide khong\b/,
  /\bban co nghe toi o day khong\b/,
];

const SPEAK_HELP_MEDIUM_PATTERNS: RegExp[] = [
  /\bpronunciation\b/,
  /\bpronounce\b/,
  /\bsay this\b/,
  /\bsay it\b/,
  /\bfix my pronunciation\b/,
  /\bimprove my pronunciation\b/,
  /\bphat am\b/,
  /\bsua am\b/,
  /\bdoc am\b/,
];

const ENGLISH_EXPLAIN_STRONG_PATTERNS: RegExp[] = [
  /\bexplain this in vietnamese\b/,
  /\bexplain in vietnamese\b/,
  /\btranslate this\b/,
  /\btranslate this sentence\b/,
  /\bcorrect this sentence\b/,
  /\bfix this sentence\b/,
  /\bis this sentence correct\b/,
  /\bwhat does .+ mean\b/,
  /\bwhat is the difference between\b/,
];

const ENGLISH_EXPLAIN_MEDIUM_PATTERNS: RegExp[] = [
  /\bexplain\b/,
  /\bgrammar\b/,
  /\btranslate\b/,
  /\bin vietnamese\b/,
  /\bin english\b/,
  /\bwhy is\b/,
  /\bwhat means\b/,
  /\bmeaning of\b/,
];

const EMOTIONAL_SUPPORT_STRONG_PATTERNS: RegExp[] = [
  /\bi feel\b/,
  /\bi am feeling\b/,
  /\bi'm feeling\b/,
  /\bembarrassed\b/,
  /\bdiscouraged\b/,
  /\banxious\b/,
  /\bafraid\b/,
  /\bscared\b/,
  /\bashamed\b/,
  /\bshy\b/,
  /\bnervous\b/,
  /\bstressed\b/,
  /\boverwhelmed\b/,
  /\bburned out\b/,
  /\bburnt out\b/,
];

const EMOTIONAL_SUPPORT_MEDIUM_PATTERNS: RegExp[] = [
  /\btired\b/,
  /\bfrustrated\b/,
  /\buncomfortable\b/,
  /\blosing confidence\b/,
  /\bnot confident\b/,
  /\btoo hard\b/,
];

const LEARNING_PATH_PATTERNS: RegExp[] = [
  /\bwhat should i practice\b/,
  /\bwhat should i learn\b/,
  /\bwhat next\b/,
  /\bwhat should i do next\b/,
  /\bwhat should i focus on\b/,
  /\bwhat do you recommend\b/,
  /\brecommend for me\b/,
  /\bwhat is best for my level\b/,
  /\bwhat should i study\b/,
  /\bwhat should i work on\b/,
  /\bwhat do i practice next\b/,
];

const PRONUNCIATION_REPAIR_PATTERNS: RegExp[] = [
  /\bwhy didn't you answer\??\b/,
  /\bwhy did not you answer\??\b/,
  /\bdid you not read my message\??\b/,
  /\bdidn't you read my message\??\b/,
  /\byou didn't answer\b/,
  /\byou did not answer\b/,
  /\bban khong doc duoc tin nhan cua toi\b/,
  /\btai sao ban khong tra loi\b/,
  /\bban khong tra loi\b/,
];

const PRONUNCIATION_FOLLOW_UP_PATTERNS: RegExp[] = [
  /^(hi|hello|hey)$/,
  /^(ok|okay|yes)$/,
  /\bwhat do i do here\b/,
  /\bso what do i do here\b/,
  /\bthen what\b/,
  /\bwhat next\b/,
  /\bhow do i use that\b/,
  /\bhow do i use it\b/,
  /\bwhere do i click\b/,
  /\bwhat should i do here\b/,
  /\bhi[,!.\s]*can you hear me\b/,
  /\bcan you hear me\b/,
  /\bcan you hear me here in guide\b/,
  /\bcan you hear me here\b/,
  /\bcan you hear me in guide\b/,
  /\bare you listening\b/,
  /\bhello\??\b/,
  /\bokay[,!.\s]*what now\b/,
  /\bwhat now\b/,
  /\bso what do i do\b/,
  /\bbam vao dau\b/,
  /\bo day thi toi phai lam gi\b/,
  /\btoi phai lam gi tiep\b/,
  /\bban co nghe toi khong\b/,
  /\bnghe toi khong\b/,
  /\bban co nghe toi o guide khong\b/,
  /\bban co nghe toi o day khong\b/,
  /\broi sao nua\b/,
  /\btiep theo thi sao\b/,
  /\bbay gio sao\b/,
  /\bo day lam gi\b/,
  ...PRONUNCIATION_REPAIR_PATTERNS,
];

function getIntentScores(text: string, strippedText: string) {
  return {
    ui: countAny(text, UI_ACTION_PATTERNS) * 3,

    speak:
      countAny(text, SPEAK_HELP_STRONG_PATTERNS) * 4 +
      countAny(text, SPEAK_HELP_MEDIUM_PATTERNS) * 2 +
      countAny(strippedText, SPEAK_HELP_STRONG_PATTERNS) * 4 +
      countAny(strippedText, SPEAK_HELP_MEDIUM_PATTERNS) * 2,

    english:
      countAny(text, ENGLISH_EXPLAIN_STRONG_PATTERNS) * 4 +
      countAny(text, ENGLISH_EXPLAIN_MEDIUM_PATTERNS) * 2,

    emotional:
      countAny(text, EMOTIONAL_SUPPORT_STRONG_PATTERNS) * 4 +
      countAny(text, EMOTIONAL_SUPPORT_MEDIUM_PATTERNS) * 2,

    learning: countAny(text, LEARNING_PATH_PATTERNS) * 4,
  };
}

export function isPronunciationRepairMessage(input: string): boolean {
  const text = normalizeUserText(input);
  const strippedText = stripVietnamese(text);

  return (
    hasAny(text, PRONUNCIATION_REPAIR_PATTERNS) ||
    hasAny(strippedText, PRONUNCIATION_REPAIR_PATTERNS)
  );
}

export function isPronunciationHelpFollowUp(input: string): boolean {
  const text = normalizeUserText(input);
  const strippedText = stripVietnamese(text);

  return (
    hasAny(text, PRONUNCIATION_FOLLOW_UP_PATTERNS) ||
    hasAny(strippedText, PRONUNCIATION_FOLLOW_UP_PATTERNS)
  );
}

export function detectMercyIntent(input: string): MercyIntent {
  const text = normalizeUserText(input);
  const strippedText = stripVietnamese(text);

  if (!text) {
    return 'fallback_api';
  }

  if (hasAny(text, GREETING_ONLY_PATTERNS)) {
    return 'fallback_api';
  }

  const scores = getIntentScores(text, strippedText);

  if (scores.ui >= 3) {
    return 'ui_action';
  }

  const hasEmotionalSignal = scores.emotional >= 4;
  const hasSpeakSignal = scores.speak >= 4;
  const hasEnglishSignal = scores.english >= 4;
  const hasLearningSignal = scores.learning >= 4;

  if (
    hasEmotionalSignal &&
    scores.emotional >= scores.speak &&
    scores.emotional >= scores.english
  ) {
    return 'emotional_support';
  }

  if (hasSpeakSignal && scores.speak > scores.english) {
    return 'speak_help';
  }

  if (hasEnglishSignal) {
    return 'english_explain';
  }

  if (hasLearningSignal) {
    return 'learning_path';
  }

  return 'fallback_api';
}