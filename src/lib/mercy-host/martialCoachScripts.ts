/**
 * Mercy Martial Coach Scripts - Phase 10
 *
 * Martial arts coaching with mindset, discipline, and safety focus.
 * Authored lines are kept ≤140 chars where practical.
 * Calm and disciplined tone, no violent language.
 *
 * NOTE:
 * - This file remains the RAW content source for martial coaching.
 * - Personality styling is applied later in engine.ts to avoid double-styling.
 * - This version adds coach planning so Mercy feels more like a real guide.
 * - Validation checks authored tips only.
 */

export type MartialCoachLevel = 'off' | 'gentle' | 'focused' | 'dojo';

export type MartialContext =
  | 'martial_room_enter'
  | 'martial_entry_complete'
  | 'martial_low_mood'
  | 'martial_stressed'
  | 'martial_failure_reframe'
  | 'martial_victory';

export interface MartialCoachTip {
  id: string;
  level: MartialCoachLevel;
  context: MartialContext;
  en: string;
  vi: string;
}

export type DomainCategory = 'martial' | 'general';

export type MartialCoachTone = 'calm' | 'steady' | 'firm';

export type MartialCoachMove =
  | 'ground'
  | 'encourage'
  | 'reframe'
  | 'focus'
  | 'recover'
  | 'advance'
  | 'review';

export interface MartialCoachPlan {
  move: MartialCoachMove;
  tone: MartialCoachTone;
  shouldBeBrief: boolean;
  addNextStep: boolean;
  acknowledgeState: boolean;
  reason:
    | 'off'
    | 'room_enter'
    | 'stress'
    | 'low_mood'
    | 'setback'
    | 'victory'
    | 'entry_complete'
    | 'default';
}

export interface MartialCoachResponseInput {
  level: MartialCoachLevel;
  context: MartialContext;
  userName?: string | null;
  learnerText?: string;
  nextPrompt?: string;
  repeatedSetback?: boolean;
}

function normalizeText(input: string): string {
  return String(input ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_\s]+/g, ' ')
    .trim();
}

function includesAny(haystack: string, needles: string[]): boolean {
  for (const n of needles) {
    if (haystack.includes(n)) return true;
  }
  return false;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cleanPlaceholder(text: string, userName?: string | null): string {
  if (userName) {
    return text.replace(/\{\{name\}\}/g, userName).replace(/\s+/g, ' ').trim();
  }

  return text
    .replace(/\{\{name\}\},?\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function joinClean(parts: string[]): string {
  return parts
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .replace(/\s([,.!?;:])/g, '$1')
    .trim();
}

const MARTIAL_DOMAIN_KEYWORDS = [
  'martial',
  'martial arts',
  'combat',
  'dojo',
  'academy',
  'self defense',
  'self-defence',
  'self defence',
  'self-protection',
  'self protection',
  'sparring',
  'kung fu',
  'kungfu',
  'wushu',
  'karate',
  'taekwondo',
  'tkd',
  'muay thai',
  'kickboxing',
  'kick boxing',
  'boxing',
  'jiu jitsu',
  'jiujitsu',
  'bjj',
  'brazilian jiu jitsu',
  'grappling',
  'wrestling',
  'judo',
  'aikido',
  'krav maga',
  'kendo',
  'fencing',
  'sword',
  'swords',
];

const MARTIAL_TAG_KEYWORDS = [
  'martial',
  'combat',
  'dojo',
  'academy',
  'kungfu',
  'kung fu',
  'wushu',
  'karate',
  'taekwondo',
  'boxing',
  'bjj',
  'jiu-jitsu',
  'jiu jitsu',
  'muaythai',
  'muay thai',
  'self-defense',
  'self defence',
  'self defense',
  'krav',
  'judo',
  'fencing',
  'sword',
];

/**
 * Detect if the content belongs to the martial domain.
 * Supports detection by roomId, roomDomain (title/category), and tags.
 */
export function isMartialDomain(
  roomId?: string | null,
  roomDomain?: string | null,
  tags?: string[] | null
): boolean {
  const idNorm = roomId ? normalizeText(roomId).replace(/\s+/g, '_') : '';
  const domainNorm = roomDomain ? normalizeText(roomDomain) : '';

  if (idNorm) {
    if (
      includesAny(idNorm, [
        'martial',
        'combat',
        'dojo',
        'kung_fu',
        'kungfu',
        'wushu',
        'karate',
        'taekwondo',
        'boxing',
        'bjj',
        'jiu',
        'muay_thai',
        'krav',
        'judo',
        'kendo',
        'fencing',
        'sword',
      ])
    ) {
      return true;
    }
  }

  if (domainNorm && includesAny(domainNorm, MARTIAL_DOMAIN_KEYWORDS)) {
    return true;
  }

  if (tags && tags.length > 0) {
    for (const t of tags) {
      const tagNorm = normalizeText(String(t));
      if (includesAny(tagNorm, MARTIAL_TAG_KEYWORDS)) return true;
    }
  }

  return false;
}

/**
 * Higher-level category helper used by the host.
 */
export function getDomainCategory(
  roomId?: string | null,
  roomDomain?: string | null,
  tags?: string[] | null
): DomainCategory {
  return isMartialDomain(roomId, roomDomain, tags) ? 'martial' : 'general';
}

/**
 * Martial coach tips organized by level and context
 */
const MARTIAL_TIPS: MartialCoachTip[] = [
  // === GENTLE LEVEL ===
  {
    id: 'gentle_enter_1',
    level: 'gentle',
    context: 'martial_room_enter',
    en: 'Welcome to the dojo. Move at your own pace.',
    vi: 'Chào mừng đến dojo. Di chuyển theo nhịp riêng của bạn.',
  },
  {
    id: 'gentle_enter_2',
    level: 'gentle',
    context: 'martial_room_enter',
    en: 'Breathe first. The path unfolds naturally.',
    vi: 'Hít thở trước. Con đường sẽ tự mở ra.',
  },
  {
    id: 'gentle_complete_1',
    level: 'gentle',
    context: 'martial_entry_complete',
    en: 'One step completed. Each step matters.',
    vi: 'Một bước hoàn thành. Mỗi bước đều quan trọng.',
  },
  {
    id: 'gentle_complete_2',
    level: 'gentle',
    context: 'martial_entry_complete',
    en: 'Good work. Keep the movement simple and clear.',
    vi: 'Làm tốt. Hãy giữ chuyển động đơn giản và rõ ràng.',
  },
  {
    id: 'gentle_low_1',
    level: 'gentle',
    context: 'martial_low_mood',
    en: 'Even the greatest warriors rest. Your stillness is strength.',
    vi: 'Ngay cả chiến binh giỏi nhất cũng nghỉ ngơi. Sự tĩnh lặng của bạn là sức mạnh.',
  },
  {
    id: 'gentle_stressed_1',
    level: 'gentle',
    context: 'martial_stressed',
    en: 'Center yourself. The dojo is a place of peace.',
    vi: 'Tập trung vào bản thân. Dojo là nơi yên bình.',
  },
  {
    id: 'gentle_failure_1',
    level: 'gentle',
    context: 'martial_failure_reframe',
    en: 'Every fall teaches balance. Rest and return.',
    vi: 'Mỗi lần hụt đều dạy cách giữ thăng bằng. Nghỉ ngơi rồi quay lại.',
  },
  {
    id: 'gentle_victory_1',
    level: 'gentle',
    context: 'martial_victory',
    en: 'Well done. Progress flows from consistency.',
    vi: 'Làm tốt. Tiến bộ đến từ sự kiên định.',
  },

  // === FOCUSED LEVEL ===
  {
    id: 'focused_enter_1',
    level: 'focused',
    context: 'martial_room_enter',
    en: 'Clear your mind. Training begins with focus.',
    vi: 'Tĩnh tâm. Tập luyện bắt đầu từ sự tập trung.',
  },
  {
    id: 'focused_enter_2',
    level: 'focused',
    context: 'martial_room_enter',
    en: 'Discipline is the bridge between goals and results.',
    vi: 'Kỷ luật là cầu nối giữa mục tiêu và kết quả.',
  },
  {
    id: 'focused_complete_1',
    level: 'focused',
    context: 'martial_entry_complete',
    en: 'Technique refined. Continue your practice.',
    vi: 'Kỹ thuật được trau dồi. Tiếp tục luyện tập.',
  },
  {
    id: 'focused_complete_2',
    level: 'focused',
    context: 'martial_entry_complete',
    en: 'Good form. Now repeat until it becomes natural.',
    vi: 'Tư thế tốt. Bây giờ lặp lại cho đến khi trở nên tự nhiên.',
  },
  {
    id: 'focused_low_1',
    level: 'focused',
    context: 'martial_low_mood',
    en: "The warrior's path includes valleys. Keep breathing.",
    vi: 'Con đường chiến binh có cả thung lũng. Tiếp tục hít thở.',
  },
  {
    id: 'focused_stressed_1',
    level: 'focused',
    context: 'martial_stressed',
    en: 'Tension blocks flow. Exhale fully. Begin again.',
    vi: 'Căng thẳng chặn dòng chảy. Thở ra hoàn toàn. Bắt đầu lại.',
  },
  {
    id: 'focused_failure_1',
    level: 'focused',
    context: 'martial_failure_reframe',
    en: 'Setbacks sharpen focus. Analyze, adapt, advance.',
    vi: 'Thất bại mài sắc sự tập trung. Phân tích, thích nghi, tiến lên.',
  },
  {
    id: 'focused_victory_1',
    level: 'focused',
    context: 'martial_victory',
    en: 'Victory earned through practice. Celebrate quietly, then prepare.',
    vi: 'Thành quả đến qua luyện tập. Ăn mừng nhẹ nhàng, rồi chuẩn bị.',
  },

  // === DOJO LEVEL ===
  {
    id: 'dojo_enter_1',
    level: 'dojo',
    context: 'martial_room_enter',
    en: 'Bow in. Train with intention. Every session builds mastery.',
    vi: 'Cúi chào. Tập luyện có chủ đích. Mỗi buổi tập xây dựng sự thành thạo.',
  },
  {
    id: 'dojo_enter_2',
    level: 'dojo',
    context: 'martial_room_enter',
    en: 'The dojo awaits. Show up. Execute. Grow.',
    vi: 'Dojo đang chờ. Xuất hiện. Thực hiện. Phát triển.',
  },
  {
    id: 'dojo_complete_1',
    level: 'dojo',
    context: 'martial_entry_complete',
    en: 'Strong execution. Log this and review tomorrow.',
    vi: 'Thực hiện mạnh mẽ. Ghi lại và xem lại ngày mai.',
  },
  {
    id: 'dojo_complete_2',
    level: 'dojo',
    context: 'martial_entry_complete',
    en: 'Movement recorded. Next: apply under pressure.',
    vi: 'Động tác đã ghi nhận. Tiếp theo: áp dụng dưới áp lực.',
  },
  {
    id: 'dojo_low_1',
    level: 'dojo',
    context: 'martial_low_mood',
    en: 'Even in low energy, show up. Light training still builds.',
    vi: 'Ngay cả khi năng lượng thấp, hãy xuất hiện. Tập nhẹ vẫn xây dựng.',
  },
  {
    id: 'dojo_stressed_1',
    level: 'dojo',
    context: 'martial_stressed',
    en: 'Use this tension. Channel it into controlled movement.',
    vi: 'Dùng căng thẳng này. Hướng nó vào chuyển động có kiểm soát.',
  },
  {
    id: 'dojo_failure_1',
    level: 'dojo',
    context: 'martial_failure_reframe',
    en: 'Failure is data. Adjust your stance and try again.',
    vi: 'Thất bại là dữ liệu. Điều chỉnh tư thế và thử lại.',
  },
  {
    id: 'dojo_victory_1',
    level: 'dojo',
    context: 'martial_victory',
    en: 'Bow out. You showed discipline today. Return stronger.',
    vi: 'Cúi chào ra. Bạn đã thể hiện kỷ luật hôm nay. Trở lại mạnh mẽ hơn.',
  },
];

/**
 * Build a simple coaching plan so the martial voice feels intentional,
 * not just decorative.
 */
export function buildMartialCoachPlan(args: MartialCoachResponseInput): MartialCoachPlan {
  const { level, context, learnerText, repeatedSetback } = args;
  const text = normalizeText(learnerText || '');

  if (level === 'off') {
    return {
      move: 'ground',
      tone: 'calm',
      shouldBeBrief: true,
      addNextStep: false,
      acknowledgeState: false,
      reason: 'off',
    };
  }

  if (context === 'martial_room_enter') {
    return {
      move: 'ground',
      tone: level === 'dojo' ? 'firm' : 'calm',
      shouldBeBrief: true,
      addNextStep: false,
      acknowledgeState: false,
      reason: 'room_enter',
    };
  }

  if (context === 'martial_stressed') {
    return {
      move: 'focus',
      tone: 'calm',
      shouldBeBrief: true,
      addNextStep: true,
      acknowledgeState: true,
      reason: 'stress',
    };
  }

  if (context === 'martial_low_mood') {
    return {
      move: 'recover',
      tone: 'steady',
      shouldBeBrief: true,
      addNextStep: true,
      acknowledgeState: true,
      reason: 'low_mood',
    };
  }

  if (context === 'martial_failure_reframe' || repeatedSetback) {
    return {
      move: 'reframe',
      tone: level === 'dojo' ? 'firm' : 'steady',
      shouldBeBrief: true,
      addNextStep: true,
      acknowledgeState: true,
      reason: 'setback',
    };
  }

  if (
    context === 'martial_victory' ||
    includesAny(text, ['good', 'better', 'done', 'finished', 'nailed it', 'got it'])
  ) {
    return {
      move: 'advance',
      tone: level === 'dojo' ? 'firm' : 'steady',
      shouldBeBrief: true,
      addNextStep: true,
      acknowledgeState: false,
      reason: 'victory',
    };
  }

  if (context === 'martial_entry_complete') {
    return {
      move: 'encourage',
      tone: level === 'dojo' ? 'firm' : level === 'focused' ? 'steady' : 'calm',
      shouldBeBrief: true,
      addNextStep: true,
      acknowledgeState: false,
      reason: 'entry_complete',
    };
  }

  return {
    move: 'encourage',
    tone: level === 'dojo' ? 'firm' : level === 'focused' ? 'steady' : 'calm',
    shouldBeBrief: true,
    addNextStep: true,
    acknowledgeState: false,
    reason: 'default',
  };
}

/**
 * Get a martial coach tip for the given context
 */
export function getMartialCoachTip(args: {
  level: MartialCoachLevel;
  context: MartialContext;
  userName?: string | null;
}): { id: string; en: string; vi: string } {
  const { level, context, userName } = args;

  if (level === 'off') {
    return { id: 'martial_off', en: '', vi: '' };
  }

  const matchingTips = MARTIAL_TIPS.filter(
    (tip) => tip.level === level && tip.context === context
  );

  const tips =
    matchingTips.length > 0
      ? matchingTips
      : MARTIAL_TIPS.filter(
          (tip) => tip.level === level && tip.context === 'martial_room_enter'
        );

  if (tips.length === 0) {
    return {
      id: 'martial_default',
      en: 'Focus. Breathe. Train.',
      vi: 'Tập trung. Hít thở. Luyện tập.',
    };
  }

  const tip = pickRandom(tips);
  const en = cleanPlaceholder(tip.en, userName);
  const vi = cleanPlaceholder(tip.vi, userName);

  return { id: tip.id, en, vi };
}

/**
 * Render a structured martial coaching response.
 * Structure: acknowledge -> coach line -> next step
 */
export function renderMartialCoachResponse(
  args: MartialCoachResponseInput
): { id: string; en: string; vi: string; move: MartialCoachMove; tone: MartialCoachTone } {
  const { level, context, userName, nextPrompt } = args;

  if (level === 'off') {
    return {
      id: 'martial_off',
      en: '',
      vi: '',
      move: 'ground',
      tone: 'calm',
    };
  }

  const plan = buildMartialCoachPlan(args);
  const baseTip = getMartialCoachTip({ level, context, userName });
  const enParts: string[] = [];
  const viParts: string[] = [];

  if (plan.acknowledgeState) {
    const ack = getMartialAcknowledgement(plan.move, plan.tone);
    enParts.push(ack.en);
    viParts.push(ack.vi);
  }

  enParts.push(baseTip.en);
  viParts.push(baseTip.vi);

  if (plan.addNextStep && nextPrompt) {
    enParts.push(cleanNextPrompt(nextPrompt));
    viParts.push(`Bước tiếp theo: ${cleanNextPrompt(nextPrompt)}`);
  }

  return {
    id: baseTip.id,
    en: joinClean(enParts),
    vi: joinClean(viParts),
    move: plan.move,
    tone: plan.tone,
  };
}

function getMartialAcknowledgement(
  move: MartialCoachMove,
  tone: MartialCoachTone
): { en: string; vi: string } {
  if (move === 'focus') {
    return {
      en: 'Settle first.',
      vi: 'Hãy ổn định lại trước.',
    };
  }

  if (move === 'recover') {
    return {
      en: 'Low energy is still usable.',
      vi: 'Năng lượng thấp vẫn có thể dùng tốt.',
    };
  }

  if (move === 'reframe' && tone === 'firm') {
    return {
      en: 'Stay with the lesson.',
      vi: 'Hãy ở lại với bài học.',
    };
  }

  if (move === 'reframe') {
    return {
      en: 'This is part of training.',
      vi: 'Đây là một phần của luyện tập.',
    };
  }

  if (move === 'advance') {
    return {
      en: 'Stay steady.',
      vi: 'Giữ vững nhịp.',
    };
  }

  return {
    en: 'Stay steady.',
    vi: 'Giữ vững nhịp.',
  };
}

/**
 * Validate authored martial coach tips only.
 */
export function validateMartialCoachTips(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const MAX_LENGTH = 140;
  const activeLevels: MartialCoachLevel[] = ['gentle', 'focused', 'dojo'];

  for (const tip of MARTIAL_TIPS) {
    if (tip.en.length > MAX_LENGTH) {
      errors.push(`${tip.id}: EN too long (${tip.en.length}): "${tip.en}"`);
    }
    if (tip.vi.length > MAX_LENGTH) {
      errors.push(`${tip.id}: VI too long (${tip.vi.length}): "${tip.vi}"`);
    }

    if (activeLevels.includes(tip.level)) {
      if (!tip.en.trim()) {
        errors.push(`${tip.id}: EN is empty`);
      }
      if (!tip.vi.trim()) {
        errors.push(`${tip.id}: VI is empty`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Get all tips for testing/validation
 */
export function getAllMartialTips(): MartialCoachTip[] {
  return [...MARTIAL_TIPS];
}

/**
 * Infer martial discipline from room metadata.
 * (Extra args are optional; tests may pass only roomId.)
 */
export function inferMartialDiscipline(
  roomId: string,
  roomDomain?: string | null,
  tags?: string[] | null
): string {
  const parts: string[] = [];
  if (roomId) parts.push(roomId);
  if (roomDomain) parts.push(roomDomain);
  if (tags?.length) parts.push(tags.join(' '));

  const text = normalizeText(parts.join(' ')).replace(/\s+/g, ' ');

  if (includesAny(text, ['fencing', 'kendo', 'sword', 'swords', 'samurai'])) return 'sword';
  if (includesAny(text, ['boxing', 'kickboxing', 'kick boxing'])) return 'boxing';
  if (includesAny(text, ['bjj', 'brazilian jiu jitsu', 'jiu jitsu', 'jiujitsu', 'grappling'])) {
    return 'bjj';
  }
  if (includesAny(text, ['karate'])) return 'karate';
  if (includesAny(text, ['taekwondo', 'tkd'])) return 'taekwondo';
  if (includesAny(text, ['muay thai'])) return 'muay_thai';
  if (includesAny(text, ['judo'])) return 'judo';
  if (includesAny(text, ['aikido'])) return 'aikido';
  if (includesAny(text, ['kung fu', 'kungfu', 'wushu'])) return 'kung_fu';

  return 'martial';
}

function cleanNextPrompt(text: string): string {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .replace(/\s([,.!?;:])/g, '$1')
    .trim();
}