/**
 * Mercy Humor Engine
 *
 * Purpose:
 * - keep Mercy witty, but never distracting
 * - allow light teacher warmth and occasional dry humor
 * - suppress jokes when the learner is confused, stressed, or discouraged
 *
 * Design rules:
 * - clarity > warmth > wit
 * - humor is seasoning, not identity
 * - never mock confusion
 * - never escalate when learner is upset
 * - keep lines short and reusable
 */

export type HumorStyle =
  | 'off'
  | 'gentle'
  | 'teacher_wit'
  | 'dry'
  | 'martial_light';

export type HumorContext =
  | 'success'
  | 'challenge'
  | 'correction'
  | 'warmup'
  | 'returning'
  | 'streak'
  | 'pronunciation'
  | 'boss_joke';

export interface HumorLine {
  id: string;
  style: HumorStyle;
  context: HumorContext;
  en: string;
  vi: string;
}

export interface HumorDecisionInput {
  style?: HumorStyle;
  context: HumorContext;
  learnerText?: string | null;
  isConfused?: boolean;
  isFrustrated?: boolean;
  isSensitiveMoment?: boolean;
  repeatedMistake?: boolean;
  allowBossJoke?: boolean;
  userName?: string | null;
}

export interface HumorDecision {
  shouldUseHumor: boolean;
  reason:
    | 'allowed'
    | 'off'
    | 'confused'
    | 'frustrated'
    | 'sensitive'
    | 'repeated_mistake'
    | 'boss_joke_disabled'
    | 'no_matching_lines';
  line?: {
    id: string;
    en: string;
    vi: string;
  };
}

const HUMOR_LINES: HumorLine[] = [
  {
    id: 'gentle_success_1',
    style: 'gentle',
    context: 'success',
    en: 'Nice. Quiet progress still counts.',
    vi: 'Tốt đấy. Tiến bộ âm thầm vẫn được tính.',
  },
  {
    id: 'gentle_success_2',
    style: 'gentle',
    context: 'success',
    en: 'That landed well.',
    vi: 'Cú đó vào khá đẹp.',
  },
  {
    id: 'teacher_success_1',
    style: 'teacher_wit',
    context: 'success',
    en: 'Good. The grammar gods may relax for a minute.',
    vi: 'Tốt. Các vị thần ngữ pháp có thể thư giãn một phút rồi.',
  },
  {
    id: 'teacher_success_2',
    style: 'teacher_wit',
    context: 'success',
    en: 'Clean work. Very teacher-pleasing.',
    vi: 'Làm gọn đấy. Rất hợp ý giáo viên.',
  },
  {
    id: 'teacher_challenge_1',
    style: 'teacher_wit',
    context: 'challenge',
    en: 'Good. Now let us make the sentence earn its lunch.',
    vi: 'Tốt. Giờ hãy làm cho câu này làm việc xứng đáng hơn.',
  },
  {
    id: 'teacher_challenge_2',
    style: 'teacher_wit',
    context: 'challenge',
    en: 'Solid. Time for the slightly meaner version.',
    vi: 'Ổn. Đến lúc thử bản khó tính hơn một chút.',
  },
  {
    id: 'teacher_correction_1',
    style: 'teacher_wit',
    context: 'correction',
    en: 'Small fix. Nothing dramatic, just grammar being grammar.',
    vi: 'Sửa nhẹ thôi. Không có gì kịch tính, chỉ là ngữ pháp đúng kiểu ngữ pháp.',
  },
  {
    id: 'teacher_pron_1',
    style: 'teacher_wit',
    context: 'pronunciation',
    en: 'Give the final sound a proper job.',
    vi: 'Cho âm cuối làm việc đàng hoàng đi nào.',
  },
  {
    id: 'teacher_streak_1',
    style: 'teacher_wit',
    context: 'streak',
    en: 'Ah, a streak. We do enjoy a competent pattern.',
    vi: 'À, có streak rồi. Mình khá thích những chuỗi giỏi giang thế này.',
  },
  {
    id: 'dry_success_1',
    style: 'dry',
    context: 'success',
    en: 'Efficient. We approve.',
    vi: 'Hiệu quả đấy. Duyệt.',
  },
  {
    id: 'dry_challenge_1',
    style: 'dry',
    context: 'challenge',
    en: 'Good. Now do it with fewer regrets.',
    vi: 'Tốt. Giờ làm lại với ít tiếc nuối hơn.',
  },
  {
    id: 'dry_returning_1',
    style: 'dry',
    context: 'returning',
    en: 'You returned. Excellent strategic choice.',
    vi: 'Bạn quay lại rồi. Lựa chọn chiến lược khá xuất sắc.',
  },
  {
    id: 'gentle_returning_1',
    style: 'gentle',
    context: 'returning',
    en: 'Back again. Good. The path remembers you.',
    vi: 'Quay lại rồi. Tốt. Con đường vẫn nhớ bạn.',
  },
  {
    id: 'martial_warmup_1',
    style: 'martial_light',
    context: 'warmup',
    en: 'Steady first. Heroics can wait.',
    vi: 'Ổn định trước đã. Anh hùng tính để sau.',
  },
  {
    id: 'martial_success_1',
    style: 'martial_light',
    context: 'success',
    en: 'Good rep. Keep the ego on a short leash.',
    vi: 'Một rep tốt. Giữ cái tôi ở dây ngắn thôi nhé.',
  },
  {
    id: 'martial_challenge_1',
    style: 'martial_light',
    context: 'challenge',
    en: 'Good. Again, but cleaner.',
    vi: 'Tốt. Lại lần nữa, nhưng gọn hơn.',
  },
  {
    id: 'boss_joke_1',
    style: 'teacher_wit',
    context: 'boss_joke',
    en: 'Ah yes, the legendary friend of Chau Doan clause.',
    vi: 'À vâng, điều khoản huyền thoại bạn của Chau Doan.',
  },
  {
    id: 'boss_joke_2',
    style: 'teacher_wit',
    context: 'boss_joke',
    en: 'Careful. That sounds suspiciously like executive grammar.',
    vi: 'Cẩn thận. Nghe khá giống ngữ pháp cấp điều hành đấy.',
  },
];

function normalizeText(input: string): string {
  return String(input ?? '').toLowerCase().trim();
}

function includesAny(text: string, phrases: string[]): boolean {
  return phrases.some((phrase) => text.includes(phrase));
}

function pickRandom<T>(items: T[]): T | undefined {
  if (items.length === 0) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}

function applyNamePlaceholders(text: string, userName?: string | null): string {
  if (!userName) {
    return text.replace(/\{\{name\}\},?\s*/g, '').replace(/\s+/g, ' ').trim();
  }

  return text.replace(/\{\{name\}\}/g, userName).replace(/\s+/g, ' ').trim();
}

/**
 * Heuristic detector for boss-joke style banter.
 */
export function detectBossJoke(input?: string | null): boolean {
  const text = normalizeText(input || '');

  return includesAny(text, [
    'friend of chau doan',
    'chau doan',
    'boss joke',
    'boss mode',
    'executive grammar',
  ]);
}

/**
 * Decide if humor should be used at all.
 */
export function shouldUseHumor(input: HumorDecisionInput): HumorDecision['reason'] {
  const style = input.style || 'gentle';

  if (style === 'off') return 'off';
  if (input.isConfused) return 'confused';
  if (input.isFrustrated) return 'frustrated';
  if (input.isSensitiveMoment) return 'sensitive';
  if (input.repeatedMistake) return 'repeated_mistake';
  if (input.context === 'boss_joke' && !input.allowBossJoke) return 'boss_joke_disabled';

  return 'allowed';
}

/**
 * Get matching humor candidates.
 */
export function getHumorCandidates(
  style: HumorStyle,
  context: HumorContext
): HumorLine[] {
  if (style === 'off') return [];

  const exact = HUMOR_LINES.filter((line) => line.style === style && line.context === context);
  if (exact.length > 0) return exact;

  if (style === 'dry') {
    return HUMOR_LINES.filter(
      (line) => line.style === 'teacher_wit' && line.context === context
    );
  }

  if (style === 'teacher_wit') {
    return HUMOR_LINES.filter(
      (line) => line.style === 'gentle' && line.context === context
    );
  }

  return [];
}

/**
 * Main humor selector.
 */
export function getHumorLine(input: HumorDecisionInput): HumorDecision {
  const style = input.style || 'gentle';
  const reason = shouldUseHumor(input);

  if (reason !== 'allowed') {
    return {
      shouldUseHumor: false,
      reason,
    };
  }

  const resolvedContext =
    input.context === 'boss_joke' && detectBossJoke(input.learnerText)
      ? 'boss_joke'
      : input.context;

  const candidates = getHumorCandidates(style, resolvedContext);

  if (candidates.length === 0) {
    return {
      shouldUseHumor: false,
      reason: 'no_matching_lines',
    };
  }

  const line = pickRandom(candidates);

  if (!line) {
    return {
      shouldUseHumor: false,
      reason: 'no_matching_lines',
    };
  }

  return {
    shouldUseHumor: true,
    reason: 'allowed',
    line: {
      id: line.id,
      en: applyNamePlaceholders(line.en, input.userName),
      vi: applyNamePlaceholders(line.vi, input.userName),
    },
  };
}

/**
 * Append humor to an existing EN/VI response.
 * Keeps structure simple and avoids overwriting the main teaching message.
 */
export function appendHumor(
  base: { en: string; vi: string },
  input: HumorDecisionInput
): { en: string; vi: string; humorUsed: boolean; humorId?: string } {
  const decision = getHumorLine(input);

  if (!decision.shouldUseHumor || !decision.line) {
    return {
      en: cleanText(base.en),
      vi: cleanText(base.vi),
      humorUsed: false,
    };
  }

  return {
    en: cleanText(`${base.en} ${decision.line.en}`),
    vi: cleanText(`${base.vi} ${decision.line.vi}`),
    humorUsed: true,
    humorId: decision.line.id,
  };
}

/**
 * Get a standalone humor line for UI chips, subtitles, or side comments.
 */
export function getStandaloneHumor(
  input: HumorDecisionInput
): { en: string; vi: string } | null {
  const decision = getHumorLine(input);

  if (!decision.shouldUseHumor || !decision.line) {
    return null;
  }

  return {
    en: decision.line.en,
    vi: decision.line.vi,
  };
}

/**
 * Validation helper.
 */
export function validateHumorLines(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const MAX_LENGTH = 120;

  for (const line of HUMOR_LINES) {
    if (!line.en.trim()) {
      errors.push(`${line.id}: EN is empty`);
    }
    if (!line.vi.trim()) {
      errors.push(`${line.id}: VI is empty`);
    }
    if (line.en.length > MAX_LENGTH) {
      errors.push(`${line.id}: EN too long (${line.en.length})`);
    }
    if (line.vi.length > MAX_LENGTH) {
      errors.push(`${line.id}: VI too long (${line.vi.length})`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Expose raw lines for tests.
 */
export function getAllHumorLines(): HumorLine[] {
  return [...HUMOR_LINES];
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').replace(/\s([,.!?;:])/g, '$1').trim();
}