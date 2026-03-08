/**
 * VERSION: specificPraise.ts v1
 *
 * Mercy Specific Praise
 *
 * Purpose:
 * - generate short, teacher-like praise that feels earned
 * - avoid generic compliments like "good job" when possible
 * - reinforce exactly what improved so the learner knows what to keep
 *
 * Design rules:
 * - short, clear, believable
 * - praise the improvement, not the person
 * - specific beats enthusiastic
 * - safe fallback to neutral encouragement
 */

export interface SpecificPraiseInput {
  language: 'en' | 'vi';
  concept?: string;
  mistake?: string;
  fix?: string;
  learnerText?: string;
  repeatedMistake?: boolean;
  wasCorrectiveTurn?: boolean;
  wantsChallenge?: boolean;
  improvementType?:
    | 'accuracy'
    | 'clarity'
    | 'confidence'
    | 'consistency'
    | 'retry_success'
    | 'rule_use'
    | 'pronunciation'
    | 'structure'
    | 'momentum';
}

export interface SpecificPraiseResult {
  short: string;
  medium: string;
  tag:
    | 'fixed_mistake'
    | 'cleaner_step'
    | 'kept_rule'
    | 'good_retry'
    | 'good_structure'
    | 'good_accuracy'
    | 'good_clarity'
    | 'good_momentum'
    | 'fallback';
}

function cleanText(text: string): string {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .replace(/\s([,.!?;:])/g, '$1')
    .trim();
}

function lower(text?: string): string {
  return cleanText(text || '').toLowerCase();
}

function sentence(text: string): string {
  const cleaned = cleanText(text);
  if (!cleaned) return '';
  return /[.!?]$/.test(cleaned) ? cleaned : `${cleaned}.`;
}

function looksLikePronunciation(concept?: string, mistake?: string): boolean {
  const hay = `${lower(concept)} ${lower(mistake)}`;
  return (
    hay.includes('pronunciation') ||
    hay.includes('stress') ||
    hay.includes('sound') ||
    hay.includes('intonation') ||
    hay.includes('accent')
  );
}

function looksLikeStructure(concept?: string, mistake?: string): boolean {
  const hay = `${lower(concept)} ${lower(mistake)}`;
  return (
    hay.includes('structure') ||
    hay.includes('grammar') ||
    hay.includes('tense') ||
    hay.includes('word order') ||
    hay.includes('sentence')
  );
}

function buildEnglishPraise(input: SpecificPraiseInput): SpecificPraiseResult {
  const {
    concept,
    mistake,
    fix,
    repeatedMistake = false,
    wasCorrectiveTurn = false,
    wantsChallenge = false,
    improvementType,
  } = input;

  const cleanConcept = cleanText(concept || '');
  const cleanMistake = cleanText(mistake || '');
  const cleanFix = cleanText(fix || '');

  if (cleanFix) {
    return {
      short: sentence(`Good — you fixed ${cleanFix}`),
      medium: sentence(`Good — you fixed ${cleanFix}, so keep that exact change`),
      tag: 'fixed_mistake',
    };
  }

  if (repeatedMistake && wasCorrectiveTurn) {
    return {
      short: sentence('Nice repair'),
      medium: sentence('Nice repair — that part is cleaner now'),
      tag: 'good_retry',
    };
  }

  if (improvementType === 'rule_use' && cleanConcept) {
    return {
      short: sentence(`Yes — you used the ${cleanConcept} rule correctly`),
      medium: sentence(`Yes — you used the ${cleanConcept} rule correctly there`),
      tag: 'kept_rule',
    };
  }

  if (improvementType === 'clarity') {
    return {
      short: sentence('That is clearer'),
      medium: sentence('That is clearer now — the idea is easier to follow'),
      tag: 'good_clarity',
    };
  }

  if (improvementType === 'accuracy') {
    return {
      short: sentence('That part is correct now'),
      medium: sentence('That part is correct now — keep that exact move'),
      tag: 'good_accuracy',
    };
  }

  if (improvementType === 'consistency') {
    return {
      short: sentence('Much more consistent'),
      medium: sentence('Much more consistent — you held the pattern this time'),
      tag: 'cleaner_step',
    };
  }

  if (improvementType === 'retry_success') {
    return {
      short: sentence('Good retry'),
      medium: sentence('Good retry — the second pass was cleaner'),
      tag: 'good_retry',
    };
  }

  if (improvementType === 'structure' || looksLikeStructure(cleanConcept, cleanMistake)) {
    return {
      short: sentence('Good — the structure is cleaner'),
      medium: sentence('Good — the structure is cleaner now, so keep that shape'),
      tag: 'good_structure',
    };
  }

  if (
    improvementType === 'pronunciation' ||
    looksLikePronunciation(cleanConcept, cleanMistake)
  ) {
    return {
      short: sentence('Better — that sound is cleaner'),
      medium: sentence('Better — that sound is cleaner now, so keep that mouth shape'),
      tag: 'cleaner_step',
    };
  }

  if (wantsChallenge) {
    return {
      short: sentence('Good — you have enough footing now'),
      medium: sentence('Good — you have enough footing now for one harder step'),
      tag: 'good_momentum',
    };
  }

  if (cleanMistake) {
    return {
      short: sentence(`Good — that ${cleanMistake} part is cleaner`),
      medium: sentence(`Good — that ${cleanMistake} part is cleaner now`),
      tag: 'cleaner_step',
    };
  }

  if (cleanConcept) {
    return {
      short: sentence(`Good — you held the ${cleanConcept} idea`),
      medium: sentence(`Good — you held the ${cleanConcept} idea more clearly there`),
      tag: 'kept_rule',
    };
  }

  return {
    short: sentence('Good — that is cleaner'),
    medium: sentence('Good — that is cleaner now, so keep that exact move'),
    tag: 'fallback',
  };
}

function buildVietnamesePraise(input: SpecificPraiseInput): SpecificPraiseResult {
  const {
    concept,
    mistake,
    fix,
    repeatedMistake = false,
    wasCorrectiveTurn = false,
    wantsChallenge = false,
    improvementType,
  } = input;

  const cleanConcept = cleanText(concept || '');
  const cleanMistake = cleanText(mistake || '');
  const cleanFix = cleanText(fix || '');

  if (cleanFix) {
    return {
      short: sentence(`Tốt — bạn đã sửa đúng phần ${cleanFix}`),
      medium: sentence(`Tốt — bạn đã sửa đúng phần ${cleanFix}, cứ giữ đúng thay đổi đó`),
      tag: 'fixed_mistake',
    };
  }

  if (repeatedMistake && wasCorrectiveTurn) {
    return {
      short: sentence('Sửa tốt lắm'),
      medium: sentence('Sửa tốt lắm — phần đó gọn hơn rồi'),
      tag: 'good_retry',
    };
  }

  if (improvementType === 'rule_use' && cleanConcept) {
    return {
      short: sentence(`Đúng rồi — bạn đã dùng đúng quy tắc ${cleanConcept}`),
      medium: sentence(`Đúng rồi — bạn đã dùng đúng quy tắc ${cleanConcept} ở chỗ đó`),
      tag: 'kept_rule',
    };
  }

  if (improvementType === 'clarity') {
    return {
      short: sentence('Rõ hơn rồi'),
      medium: sentence('Rõ hơn rồi — ý đó giờ dễ theo hơn'),
      tag: 'good_clarity',
    };
  }

  if (improvementType === 'accuracy') {
    return {
      short: sentence('Phần đó đúng rồi'),
      medium: sentence('Phần đó đúng rồi — cứ giữ đúng nước đi đó'),
      tag: 'good_accuracy',
    };
  }

  if (improvementType === 'consistency') {
    return {
      short: sentence('Ổn định hơn nhiều rồi'),
      medium: sentence('Ổn định hơn nhiều rồi — lần này bạn giữ được đúng mẫu'),
      tag: 'cleaner_step',
    };
  }

  if (improvementType === 'retry_success') {
    return {
      short: sentence('Lần thử lại này tốt đấy'),
      medium: sentence('Lần thử lại này tốt đấy — lượt thứ hai gọn hơn rõ ràng'),
      tag: 'good_retry',
    };
  }

  if (improvementType === 'structure' || looksLikeStructure(cleanConcept, cleanMistake)) {
    return {
      short: sentence('Tốt — cấu trúc gọn hơn rồi'),
      medium: sentence('Tốt — cấu trúc gọn hơn rồi, cứ giữ đúng khung đó'),
      tag: 'good_structure',
    };
  }

  if (
    improvementType === 'pronunciation' ||
    looksLikePronunciation(cleanConcept, cleanMistake)
  ) {
    return {
      short: sentence('Tốt hơn rồi — âm đó sạch hơn'),
      medium: sentence('Tốt hơn rồi — âm đó sạch hơn rồi, cứ giữ đúng khẩu hình đó'),
      tag: 'cleaner_step',
    };
  }

  if (wantsChallenge) {
    return {
      short: sentence('Tốt — giờ bạn đã đủ chắc để lên một bước khó hơn'),
      medium: sentence('Tốt — giờ bạn đã đủ chắc để thử thêm một bước khó hơn'),
      tag: 'good_momentum',
    };
  }

  if (cleanMistake) {
    return {
      short: sentence(`Tốt — phần ${cleanMistake} gọn hơn rồi`),
      medium: sentence(`Tốt — phần ${cleanMistake} giờ gọn hơn rồi`),
      tag: 'cleaner_step',
    };
  }

  if (cleanConcept) {
    return {
      short: sentence(`Tốt — bạn giữ được đúng ý ${cleanConcept}`),
      medium: sentence(`Tốt — bạn giữ được ý ${cleanConcept} rõ hơn ở chỗ đó`),
      tag: 'kept_rule',
    };
  }

  return {
    short: sentence('Tốt — phần đó gọn hơn rồi'),
    medium: sentence('Tốt — phần đó gọn hơn rồi, cứ giữ đúng nước đi đó'),
    tag: 'fallback',
  };
}

export function generateSpecificPraise(
  input: SpecificPraiseInput
): SpecificPraiseResult {
  return input.language === 'vi'
    ? buildVietnamesePraise(input)
    : buildEnglishPraise(input);
}

export function getSpecificPraiseText(
  input: SpecificPraiseInput & { length?: 'short' | 'medium' }
): string {
  const result = generateSpecificPraise(input);
  return input.length === 'medium' ? result.medium : result.short;
}

export default generateSpecificPraise;