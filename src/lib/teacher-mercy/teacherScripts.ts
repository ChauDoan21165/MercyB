/**
 * Mercy Teacher Scripts - Phase 11
 *
 * English teacher mode with micro-tips, correction rhythm, and pronunciation nudges.
 * Authored tips are kept ≤120 chars where practical. Warm tone, no "AI" language.
 *
 * Upgrade goals:
 * - more real-teacher rhythm
 * - calmer correction language
 * - explicit next-step nudges
 * - less generic praise
 * - safe playfulness only when appropriate
 * - richer teacher planning metadata
 * - better bridge to planner/strategy pipeline
 * - test-friendly validation
 */

import type { TeacherLevel } from './memorySchema';
import {
  applyPersonalityWithFlavor,
  type MercyPersonalityContext,
} from './personalityRules';

export type { TeacherLevel };

export type TeacherContext =
  | 'ef_room_enter'
  | 'ef_entry_complete'
  | 'ef_streak'
  | 'ef_return_after_gap'
  | 'ef_pronunciation_focus';

export interface TeacherTip {
  en: string;
  vi: string;
  context: TeacherContext;
}

export type TeacherTone = 'calm' | 'warm' | 'playful' | 'firm';

export type TeacherMove =
  | 'welcome'
  | 'encourage'
  | 'correct'
  | 'explain'
  | 'challenge'
  | 'recap'
  | 'pronunciation'
  | 'review'
  | 'drill';

export type CorrectionStyle = 'gentle' | 'direct' | 'contrastive';

export interface TeacherPlan {
  move: TeacherMove;
  tone: TeacherTone;
  shouldUseHumor: boolean;
  shouldBeBrief: boolean;
  acknowledgeEffort: boolean;
  addNextStep: boolean;
  correctionStyle: CorrectionStyle;
  reason:
    | 'welcome_context'
    | 'pronunciation_context'
    | 'frustrated'
    | 'explanation_requested'
    | 'correction'
    | 'challenge_requested'
    | 'streak_context'
    | 'review_context'
    | 'drill_requested'
    | 'recap_requested'
    | 'encourage_default';
}

export interface TeacherResponseInput {
  teacherLevel: TeacherLevel;
  learnerText?: string;
  context?: TeacherContext;
  correction?: {
    mistake: string;
    fix: string;
  };
  explanation?: string;
  nextPrompt?: string;
  repeatedMistake?: boolean;
  wantsChallenge?: boolean;
  wantsExplanation?: boolean;
  wantsRecap?: boolean;
  wantsDrill?: boolean;
  userName?: string;
  concept?: string;
  specificPraise?: string;
}

export interface TeacherResponseOutput extends BilingualLine {
  plan: TeacherPlan;
}

interface BilingualLine {
  en: string;
  vi: string;
}

/**
 * Teacher tips organized by context and level
 */
const TEACHER_TIPS: Record<TeacherLevel, Record<TeacherContext, TeacherTip[]>> = {
  gentle: {
    ef_room_enter: [
      {
        en: "Let's learn together. No rush, no pressure.",
        vi: 'Cùng học nhé. Không vội, không áp lực.',
        context: 'ef_room_enter',
      },
      {
        en: 'Welcome back to English. Take your time.',
        vi: 'Chào mừng trở lại với tiếng Anh. Từ từ thôi.',
        context: 'ef_room_enter',
      },
      {
        en: 'English is a journey. Enjoy each step.',
        vi: 'Tiếng Anh là hành trình. Tận hưởng từng bước.',
        context: 'ef_room_enter',
      },
    ],
    ef_entry_complete: [
      {
        en: 'Well done. That word is now part of your toolkit.',
        vi: 'Làm tốt. Từ đó giờ đã vào bộ công cụ của bạn.',
        context: 'ef_entry_complete',
      },
      {
        en: 'Nice work. One clear step is still real progress.',
        vi: 'Làm tốt. Một bước rõ ràng vẫn là tiến bộ thật sự.',
        context: 'ef_entry_complete',
      },
      {
        en: 'Good step. Keep this phrase close today.',
        vi: 'Một bước tốt. Hôm nay hãy giữ cụm này thật gần nhé.',
        context: 'ef_entry_complete',
      },
    ],
    ef_streak: [
      {
        en: 'Your consistency is beautiful. Keep it gentle.',
        vi: 'Sự kiên trì của bạn thật đẹp. Giữ nhẹ nhàng nhé.',
        context: 'ef_streak',
      },
      {
        en: 'Steady practice wins. Quiet progress still counts.',
        vi: 'Luyện đều là thắng. Tiến bộ âm thầm vẫn là tiến bộ.',
        context: 'ef_streak',
      },
    ],
    ef_return_after_gap: [
      {
        en: 'Welcome back. We can rebuild the rhythm together.',
        vi: 'Chào mừng trở lại. Mình cùng xây lại nhịp học nhé.',
        context: 'ef_return_after_gap',
      },
      {
        en: "You're back. That's the hardest part done.",
        vi: 'Bạn quay lại rồi. Phần khó nhất đã xong.',
        context: 'ef_return_after_gap',
      },
    ],
    ef_pronunciation_focus: [
      {
        en: 'Listen first. Then copy the shape of the sound.',
        vi: 'Nghe trước. Rồi bắt chước hình dạng của âm.',
        context: 'ef_pronunciation_focus',
      },
      {
        en: 'Go slowly. Clear sounds come before fast sounds.',
        vi: 'Đi chậm thôi. Âm rõ ràng quan trọng hơn âm nhanh.',
        context: 'ef_pronunciation_focus',
      },
    ],
  },

  normal: {
    ef_room_enter: [
      {
        en: "Let's practice English today. Ready when you are.",
        vi: 'Hãy luyện tiếng Anh hôm nay. Sẵn sàng khi bạn sẵn sàng.',
        context: 'ef_room_enter',
      },
      {
        en: "English Foundation awaits. Let's grow together.",
        vi: 'English Foundation đang chờ. Cùng phát triển nhé.',
        context: 'ef_room_enter',
      },
      {
        en: 'Your English journey continues. One lesson at a time.',
        vi: 'Hành trình tiếng Anh tiếp tục. Từng bài học một.',
        context: 'ef_room_enter',
      },
    ],
    ef_entry_complete: [
      {
        en: 'Good progress. Try using this phrase once today.',
        vi: 'Tiến bộ tốt. Hôm nay thử dùng cụm này một lần nhé.',
        context: 'ef_entry_complete',
      },
      {
        en: 'Well done. Your vocabulary is getting sharper.',
        vi: 'Làm tốt. Vốn từ của bạn đang sắc hơn.',
        context: 'ef_entry_complete',
      },
      {
        en: 'Another solid step. Now use it in one real sentence.',
        vi: 'Thêm một bước chắc. Giờ dùng nó trong một câu thật.',
        context: 'ef_entry_complete',
      },
    ],
    ef_streak: [
      {
        en: 'Your daily practice is paying off. Keep going.',
        vi: 'Việc luyện tập hằng ngày đang có kết quả. Tiếp tục nhé.',
        context: 'ef_streak',
      },
      {
        en: "Consistency builds fluency. You're on the right track.",
        vi: 'Kiên trì xây dựng sự lưu loát. Bạn đang đúng hướng.',
        context: 'ef_streak',
      },
    ],
    ef_return_after_gap: [
      {
        en: "Welcome back. Let's refresh the strongest pieces first.",
        vi: 'Chào mừng trở lại. Hãy ôn lại phần mạnh nhất trước.',
        context: 'ef_return_after_gap',
      },
      {
        en: 'Back again. Good. We restart with clarity, not pressure.',
        vi: 'Quay lại rồi. Tốt. Mình bắt đầu lại rõ ràng, không áp lực.',
        context: 'ef_return_after_gap',
      },
    ],
    ef_pronunciation_focus: [
      {
        en: 'Tip: Focus on the ending sounds in English words.',
        vi: 'Mẹo: Tập trung vào âm cuối trong từ tiếng Anh.',
        context: 'ef_pronunciation_focus',
      },
      {
        en: 'Say it slowly first. Speed can come later.',
        vi: 'Nói chậm trước. Tốc độ có thể đến sau.',
        context: 'ef_pronunciation_focus',
      },
      {
        en: 'Listen for stress. Meaning often rides on rhythm.',
        vi: 'Hãy nghe trọng âm. Nghĩa thường đi cùng nhịp điệu.',
        context: 'ef_pronunciation_focus',
      },
    ],
  },

  intense: {
    ef_room_enter: [
      {
        en: "Time to level up your English. Let's work.",
        vi: 'Đến lúc nâng cấp tiếng Anh. Hãy bắt đầu.',
        context: 'ef_room_enter',
      },
      {
        en: "English mastery needs reps. You're here. Good.",
        vi: 'Thành thạo tiếng Anh cần lặp lại. Bạn có mặt rồi. Tốt.',
        context: 'ef_room_enter',
      },
    ],
    ef_entry_complete: [
      {
        en: 'Good. Now use it in a sentence from your real life.',
        vi: 'Tốt. Giờ hãy dùng nó trong một câu từ đời sống thật.',
        context: 'ef_entry_complete',
      },
      {
        en: 'Lock it in. Review it again tomorrow morning.',
        vi: 'Ghi nhớ nó. Ôn lại lần nữa vào sáng mai.',
        context: 'ef_entry_complete',
      },
    ],
    ef_streak: [
      {
        en: 'Your streak shows discipline. Keep pushing forward.',
        vi: 'Streak của bạn cho thấy kỷ luật. Tiếp tục tiến lên.',
        context: 'ef_streak',
      },
      {
        en: 'Good discipline. Protect the rhythm tomorrow too.',
        vi: 'Kỷ luật tốt. Giữ nhịp đó cả ngày mai nữa.',
        context: 'ef_streak',
      },
    ],
    ef_return_after_gap: [
      {
        en: "You're back. Good. We rebuild with clean reps.",
        vi: 'Bạn quay lại rồi. Tốt. Mình xây lại bằng lượt luyện rõ ràng.',
        context: 'ef_return_after_gap',
      },
      {
        en: 'No drama. Restart sharp and steady.',
        vi: 'Không cần kịch tính. Bắt đầu lại sắc gọn và đều đặn.',
        context: 'ef_return_after_gap',
      },
    ],
    ef_pronunciation_focus: [
      {
        en: 'Record yourself. Compare with a clear native model.',
        vi: 'Ghi âm bạn. So sánh với một mẫu bản ngữ rõ ràng.',
        context: 'ef_pronunciation_focus',
      },
      {
        en: 'Hit the final sound cleanly. Meaning can shift there.',
        vi: 'Chạm âm cuối thật gọn. Nghĩa có thể đổi ở chính chỗ đó.',
        context: 'ef_pronunciation_focus',
      },
    ],
  },
};

function mapTeacherContextToPersonalityContext(
  context: TeacherContext,
  level: TeacherLevel
): MercyPersonalityContext {
  switch (context) {
    case 'ef_room_enter':
      return level === 'intense' ? 'gentle_authority' : 'greeting';
    case 'ef_entry_complete':
      return level === 'intense' ? 'teacher_wit' : 'encouragement';
    case 'ef_streak':
      return 'encouragement';
    case 'ef_return_after_gap':
      return 'returning_user';
    case 'ef_pronunciation_focus':
      return level === 'gentle' ? 'encouragement' : 'teacher_wit';
    default:
      return 'default';
  }
}

/**
 * Infer a simple teaching plan from learner state and request signals.
 * This keeps the teacher calm, warm, and purposeful.
 */
export function buildTeacherPlan(input: TeacherResponseInput): TeacherPlan {
  const text = normalizeText(input.learnerText || '');

  const soundsFrustrated =
    includesAny(text, [
      "i don't get it",
      'i dont get it',
      "i'm confused",
      'im confused',
      'this is hard',
      'why is this so hard',
      'this makes no sense',
      'i give up',
      'stuck',
      'not sure',
    ]) || input.repeatedMistake === true;

  const soundsPlayful = includesAny(text, [
    'haha',
    'lol',
    'boss',
    'joke',
    'roast me',
    'friend of chau doan',
  ]);

  const wantsChallenge =
    input.wantsChallenge === true ||
    includesAny(text, ['harder', 'next one', 'test me', 'again', 'more']);

  const wantsExplanation =
    input.wantsExplanation === true ||
    includesAny(text, ['why', 'explain', 'what is the rule', 'how does this work']);

  const wantsRecap =
    input.wantsRecap === true ||
    includesAny(text, ['recap', 'review', 'summary', 'summarize']);

  const wantsDrill =
    input.wantsDrill === true ||
    includesAny(text, ['repeat', 'drill', 'practice again', 'one more']);

  if (input.context === 'ef_room_enter') {
    return {
      move: 'welcome',
      tone: levelToTone(input.teacherLevel),
      shouldUseHumor: false,
      shouldBeBrief: true,
      acknowledgeEffort: false,
      addNextStep: false,
      correctionStyle: 'gentle',
      reason: 'welcome_context',
    };
  }

  if (input.context === 'ef_pronunciation_focus') {
    return {
      move: wantsDrill ? 'drill' : 'pronunciation',
      tone: input.teacherLevel === 'intense' ? 'firm' : 'calm',
      shouldUseHumor: false,
      shouldBeBrief: true,
      acknowledgeEffort: true,
      addNextStep: true,
      correctionStyle: 'gentle',
      reason: 'pronunciation_context',
    };
  }

  if (input.context === 'ef_return_after_gap' && !input.correction && !input.explanation) {
    return {
      move: 'review',
      tone: input.teacherLevel === 'gentle' ? 'warm' : 'calm',
      shouldUseHumor: false,
      shouldBeBrief: false,
      acknowledgeEffort: true,
      addNextStep: true,
      correctionStyle: 'gentle',
      reason: 'review_context',
    };
  }

  if (wantsRecap) {
    return {
      move: 'recap',
      tone: 'calm',
      shouldUseHumor: false,
      shouldBeBrief: false,
      acknowledgeEffort: true,
      addNextStep: true,
      correctionStyle: 'gentle',
      reason: 'recap_requested',
    };
  }

  if (wantsExplanation || soundsFrustrated) {
    return {
      move: input.correction ? 'explain' : 'encourage',
      tone: 'warm',
      shouldUseHumor: false,
      shouldBeBrief: false,
      acknowledgeEffort: true,
      addNextStep: true,
      correctionStyle: 'gentle',
      reason: wantsExplanation ? 'explanation_requested' : 'frustrated',
    };
  }

  if (input.correction) {
    return {
      move: 'correct',
      tone: soundsPlayful && input.teacherLevel !== 'gentle' ? 'playful' : 'calm',
      shouldUseHumor: soundsPlayful && !input.repeatedMistake,
      shouldBeBrief: true,
      acknowledgeEffort: true,
      addNextStep: true,
      correctionStyle: input.repeatedMistake ? 'contrastive' : 'gentle',
      reason: 'correction',
    };
  }

  if (wantsDrill) {
    return {
      move: 'drill',
      tone: input.teacherLevel === 'intense' ? 'firm' : 'calm',
      shouldUseHumor: false,
      shouldBeBrief: true,
      acknowledgeEffort: false,
      addNextStep: true,
      correctionStyle: 'direct',
      reason: 'drill_requested',
    };
  }

  if (wantsChallenge || input.context === 'ef_streak') {
    return {
      move: 'challenge',
      tone: input.teacherLevel === 'intense' ? 'firm' : soundsPlayful ? 'playful' : 'warm',
      shouldUseHumor: soundsPlayful,
      shouldBeBrief: true,
      acknowledgeEffort: false,
      addNextStep: true,
      correctionStyle: 'direct',
      reason: input.context === 'ef_streak' ? 'streak_context' : 'challenge_requested',
    };
  }

  return {
    move: 'encourage',
    tone: levelToTone(input.teacherLevel),
    shouldUseHumor: soundsPlayful && input.teacherLevel !== 'gentle',
    shouldBeBrief: true,
    acknowledgeEffort: true,
    addNextStep: true,
    correctionStyle: 'gentle',
    reason: 'encourage_default',
  };
}

/**
 * Render a planner-aware teacher response.
 * Structure: acknowledge -> teach -> next step
 */
export function renderTeacherResponse(input: TeacherResponseInput): TeacherResponseOutput {
  const plan = buildTeacherPlan(input);
  const enParts: string[] = [];
  const viParts: string[] = [];

  if (plan.acknowledgeEffort) {
    const ack = getAcknowledgement(plan.tone, input.teacherLevel, !!input.correction);
    enParts.push(ack.en);
    viParts.push(ack.vi);
  }

  if (input.specificPraise && plan.move !== 'correct' && plan.move !== 'explain') {
    enParts.push(cleanSentenceFlow(input.specificPraise));
    viParts.push(cleanSentenceFlow(input.specificPraise));
  }

  if (plan.move === 'correct' && input.correction) {
    const correction = renderCorrection(input.correction, plan.correctionStyle);
    enParts.push(correction.en);
    viParts.push(correction.vi);
  }

  if (plan.move === 'explain') {
    if (input.explanation) {
      enParts.push(addSentencePunctuation(input.explanation));
      viParts.push(`Điểm chính là: ${sanitizeVietnameseSentence(input.explanation)}`);
    } else if (input.correction) {
      enParts.push(`Key point: ${stripSentencePunctuation(input.correction.fix)}.`);
      viParts.push(`Điểm chính: ${stripSentencePunctuation(input.correction.fix)}.`);
    } else if (input.concept) {
      enParts.push(`Key point: focus on ${input.concept}.`);
      viParts.push(`Điểm chính: tập trung vào ${input.concept}.`);
    }
  }

  if (plan.move === 'challenge') {
    const line = getChallengeLine(input.teacherLevel, plan.tone);
    enParts.push(line.en);
    viParts.push(line.vi);
  }

  if (plan.move === 'recap') {
    const line = getRecapLine(input.teacherLevel, input.concept);
    enParts.push(line.en);
    viParts.push(line.vi);
  }

  if (plan.move === 'review') {
    const line = getReviewLine(input.teacherLevel, input.concept);
    enParts.push(line.en);
    viParts.push(line.vi);
  }

  if (plan.move === 'drill') {
    const line = getDrillLine(input.teacherLevel, input.concept);
    enParts.push(line.en);
    viParts.push(line.vi);
  }

  if (plan.move === 'pronunciation') {
    const line = getPronunciationCoachLine(input.teacherLevel);
    enParts.push(line.en);
    viParts.push(line.vi);
  }

  if (plan.move === 'encourage' && !input.correction && !input.explanation) {
    const line = getEncouragementLine(plan.tone, input.teacherLevel);
    enParts.push(line.en);
    viParts.push(line.vi);
  }

  if (plan.shouldUseHumor) {
    const line = getHumorLine(input.teacherLevel);
    enParts.push(line.en);
    viParts.push(line.vi);
  }

  if (plan.addNextStep && input.nextPrompt) {
    enParts.push(addSentencePunctuation(input.nextPrompt));
    viParts.push(`Bước tiếp theo: ${sanitizeVietnameseSentence(input.nextPrompt)}`);
  }

  return {
    en: cleanSentenceFlow(enParts.join(' ')),
    vi: cleanSentenceFlow(viParts.join(' ')),
    plan,
  };
}

/**
 * Get a teacher tip for the given context
 */
export function getTeacherTip(params: {
  tier?: string;
  teacherLevel: TeacherLevel;
  context: TeacherContext;
  userName?: string;
}): TeacherTip {
  const { teacherLevel, context, userName } = params;

  const tipsForLevel = TEACHER_TIPS[teacherLevel];
  const tipsForContext = tipsForLevel[context] || tipsForLevel.ef_room_enter;
  const tip = tipsForContext[Math.floor(Math.random() * tipsForContext.length)];

  const baseTip = userName
    ? {
        ...tip,
        en: tip.en.replace(/\{\{name\}\}/g, userName),
        vi: tip.vi.replace(/\{\{name\}\}/g, userName),
      }
    : tip;

  const personalityContext = mapTeacherContextToPersonalityContext(context, teacherLevel);
  const flavored = applyPersonalityWithFlavor(baseTip.en, baseTip.vi, personalityContext, {
    addPrefix: false,
    addSuffix: false,
  });

  return {
    ...baseTip,
    en: cleanSentenceFlow(flavored.en),
    vi: cleanSentenceFlow(flavored.vi),
  };
}

export function getAllTipsForContext(
  level: TeacherLevel,
  context: TeacherContext
): TeacherTip[] {
  return TEACHER_TIPS[level][context] || [];
}

/**
 * Validate authored tips only.
 * We validate the hand-written content source, not rendered composite replies.
 */
export function validateTeacherTips(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const MAX_LENGTH = 120;

  for (const [level, contexts] of Object.entries(TEACHER_TIPS)) {
    for (const [context, tips] of Object.entries(contexts)) {
      for (const tip of tips as TeacherTip[]) {
        if (!tip.en.trim()) {
          errors.push(`${level}/${context}: EN is empty`);
        }
        if (!tip.vi.trim()) {
          errors.push(`${level}/${context}: VI is empty`);
        }
        if (tip.en.length > MAX_LENGTH) {
          errors.push(`${level}/${context}: EN too long (${tip.en.length}): "${tip.en}"`);
        }
        if (tip.vi.length > MAX_LENGTH) {
          errors.push(`${level}/${context}: VI too long (${tip.vi.length}): "${tip.vi}"`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function normalizeText(text: string): string {
  return String(text ?? '').toLowerCase().trim();
}

function includesAny(text: string, phrases: string[]): boolean {
  return phrases.some((phrase) => text.includes(phrase));
}

function levelToTone(level: TeacherLevel): TeacherTone {
  switch (level) {
    case 'gentle':
      return 'warm';
    case 'intense':
      return 'firm';
    default:
      return 'calm';
  }
}

function getAcknowledgement(
  tone: TeacherTone,
  level: TeacherLevel,
  hasCorrection: boolean
): BilingualLine {
  if (!hasCorrection) {
    if (tone === 'warm') {
      return {
        en: 'Good work.',
        vi: 'Làm tốt.',
      };
    }

    if (tone === 'playful') {
      return {
        en: 'Nice. Clean step.',
        vi: 'Tốt. Một bước khá gọn.',
      };
    }

    if (level === 'intense') {
      return {
        en: 'Good.',
        vi: 'Tốt.',
      };
    }

    return {
      en: 'Nicely done.',
      vi: 'Làm khá tốt.',
    };
  }

  if (tone === 'warm') {
    return {
      en: "You're close.",
      vi: 'Bạn gần đúng rồi.',
    };
  }

  if (tone === 'playful') {
    return {
      en: 'Close. Good swing.',
      vi: 'Gần đúng rồi. Cú đánh khá ổn.',
    };
  }

  return {
    en: 'Close.',
    vi: 'Gần đúng rồi.',
  };
}

function renderCorrection(
  correction: { mistake: string; fix: string },
  style: CorrectionStyle
): BilingualLine {
  switch (style) {
    case 'contrastive':
      return {
        en: `Use "${stripSentencePunctuation(correction.fix)}", not "${stripSentencePunctuation(
          correction.mistake
        )}".`,
        vi: `Dùng "${stripSentencePunctuation(correction.fix)}", không dùng "${stripSentencePunctuation(
          correction.mistake
        )}".`,
      };

    case 'direct':
      return {
        en: addSentencePunctuation(correction.fix),
        vi: addSentencePunctuation(correction.fix),
      };

    case 'gentle':
    default:
      return {
        en: `Small fix: ${stripSentencePunctuation(correction.fix)}.`,
        vi: `Sửa nhẹ: ${stripSentencePunctuation(correction.fix)}.`,
      };
  }
}

function getChallengeLine(level: TeacherLevel, tone: TeacherTone): BilingualLine {
  if (level === 'intense' || tone === 'firm') {
    return {
      en: 'Good. Now make it sharper.',
      vi: 'Tốt. Giờ làm nó sắc hơn.',
    };
  }

  if (tone === 'playful') {
    return {
      en: 'Good. One more round. Slightly harder.',
      vi: 'Tốt. Thêm một vòng nữa. Khó hơn một chút.',
    };
  }

  return {
    en: 'Good. Now take it one step further.',
    vi: 'Tốt. Giờ tiến thêm một bước nữa.',
    };
}

function getPronunciationCoachLine(level: TeacherLevel): BilingualLine {
  if (level === 'intense') {
    return {
      en: 'Hit the sound clearly. Then repeat with steady rhythm.',
      vi: 'Đánh âm cho rõ. Rồi lặp lại với nhịp ổn định.',
    };
  }

  if (level === 'gentle') {
    return {
      en: 'Listen, copy, then say it slowly once more.',
      vi: 'Nghe, bắt chước, rồi nói chậm lại thêm một lần.',
    };
  }

  return {
    en: 'Say it clearly first. Speed can come later.',
    vi: 'Nói rõ trước. Tốc độ đến sau.',
  };
}

function getEncouragementLine(tone: TeacherTone, level: TeacherLevel): BilingualLine {
  if (tone === 'playful') {
    return {
      en: 'You are on the right track. Keep the wheel straight.',
      vi: 'Bạn đang đi đúng hướng. Giữ tay lái thẳng nhé.',
    };
  }

  if (tone === 'firm' || level === 'intense') {
    return {
      en: 'Good direction. Keep the standard high.',
      vi: 'Hướng đi tốt. Giữ tiêu chuẩn cao nhé.',
    };
  }

  if (tone === 'warm') {
    return {
      en: 'You are on the right track. Keep going.',
      vi: 'Bạn đang đi đúng hướng. Tiếp tục nhé.',
    };
  }

  return {
    en: 'Good direction. Keep building from here.',
    vi: 'Hướng đi tốt. Tiếp tục xây từ đây nhé.',
  };
}

function getRecapLine(level: TeacherLevel, concept?: string): BilingualLine {
  if (concept) {
    return {
      en: `Quick recap: keep your eye on ${concept}.`,
      vi: `Ôn nhanh nhé: tập trung vào ${concept}.`,
    };
  }

  if (level === 'intense') {
    return {
      en: 'Quick recap. Keep the rule clean and usable.',
      vi: 'Ôn nhanh nhé. Giữ quy tắc gọn và dùng được.',
    };
  }

  return {
    en: 'Quick recap. Keep the key point simple and clear.',
    vi: 'Ôn nhanh nhé. Giữ điểm chính đơn giản và rõ ràng.',
  };
}

function getReviewLine(level: TeacherLevel, concept?: string): BilingualLine {
  if (concept) {
    return {
      en: `Let's review ${concept} once more before moving on.`,
      vi: `Hãy ôn lại ${concept} thêm một lần trước khi đi tiếp.`,
    };
  }

  if (level === 'gentle') {
    return {
      en: "Let's review the strong part first, then build again.",
      vi: 'Hãy ôn phần mạnh trước, rồi xây lại tiếp nhé.',
    };
  }

  return {
    en: "Let's review the key point once more before we move on.",
    vi: 'Hãy ôn lại điểm chính thêm một lần trước khi đi tiếp.',
  };
}

function getDrillLine(level: TeacherLevel, concept?: string): BilingualLine {
  if (concept) {
    return {
      en: `Again. Keep ${concept} clean this time.`,
      vi: `Lại lần nữa. Lần này giữ ${concept} cho thật gọn nhé.`,
    };
  }

  if (level === 'intense') {
    return {
      en: 'Again. Same standard. Cleaner execution.',
      vi: 'Lại lần nữa. Cùng tiêu chuẩn. Thực hiện gọn hơn.',
    };
  }

  return {
    en: 'Try it once more, slowly and clearly.',
    vi: 'Thử lại thêm một lần, chậm và rõ nhé.',
  };
}

function getHumorLine(level: TeacherLevel): BilingualLine {
  if (level === 'intense') {
    return {
      en: 'Easy. English likes precision, not panic.',
      vi: 'Bình tĩnh. Tiếng Anh thích chính xác, không thích hoảng loạn.',
    };
  }

  return {
    en: 'Easy. English likes precision, but it will not bite you.',
    vi: 'Bình tĩnh. Tiếng Anh thích chính xác, nhưng sẽ không cắn bạn đâu.',
  };
}

function cleanSentenceFlow(text: string): string {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .replace(/\s([,.!?;:])/g, '$1')
    .trim();
}

function stripSentencePunctuation(text: string): string {
  return cleanSentenceFlow(text).replace(/[.!?]+$/g, '');
}

function addSentencePunctuation(text: string): string {
  const trimmed = cleanSentenceFlow(text);
  if (!trimmed) return trimmed;
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

/**
 * Best-effort placeholder for bilingual fallback when no hand-written VI line exists.
 * Keeps the file self-contained without pretending to be a full translator.
 */
function sanitizeVietnameseSentence(text: string): string {
  return addSentencePunctuation(text);
}