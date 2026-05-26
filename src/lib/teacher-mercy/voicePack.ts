/**
 * Mercy Voice Pack - Phase 6 Enhanced
 *
 * Voice line definitions for EN + VI with emotion triggers.
 * Audio files stored in /public/mercy-voice/
 *
 * Upgrade goals:
 * - keep voice as a rendering layer
 * - add calmer teacher-like cadence selection
 * - support teacher and martial flows without double-styling
 * - preserve existing trigger compatibility
 */

import type { EmotionState } from './emotionModel';
import type { MercyPersonalityContext } from './personalityRules';
import { applyPersonality } from './personalityRules';
import type { TeacherLevel } from './teacherScripts';
import type { MartialCoachLevel } from './martialCoachScripts';

export type VoiceTrigger =
  | 'room_enter'
  | 'entry_complete'
  | 'color_toggle'
  | 'return_inactive'
  | 'encouragement'
  | 'onboarding'
  | 'onboarding_complete'
  | 'low_mood'
  | 'confusion'
  | 'stress_release'
  | 'celebration'
  | 'returning_after_gap'
  // English teacher triggers
  | 'ef_room_enter'
  | 'ef_entry_complete'
  | 'ef_pronunciation_focus'
  | 'ef_streak'
  // Martial coach triggers
  | 'martial_room_enter'
  | 'martial_entry_complete'
  | 'martial_low_mood'
  | 'martial_stressed'
  | 'martial_failure_reframe'
  | 'martial_victory';

export type VoiceRegister =
  | 'steady_teacher'
  | 'warm_encourager'
  | 'dry_wit'
  | 'martial_coach'
  | 'gentle_host';

export interface VoiceLine {
  id: string;
  en: string;
  vi: string;
  audioEn?: string;
  audioVi?: string;
  trigger: VoiceTrigger;
}

export interface VoiceSelectionOptions {
  name?: string;
  register?: VoiceRegister;
  teacherLevel?: TeacherLevel;
  martialLevel?: MartialCoachLevel;
  suppressHumor?: boolean;
  requireDirectness?: boolean;
  softenTone?: boolean;
}

export const MERCY_VOICE_LINES: VoiceLine[] = [
  // Room Enter
  {
    id: 'welcome_back',
    en: 'Welcome back, {{name}}. Mercy is here with you.',
    vi: 'Chào mừng bạn trở lại, {{name}}. Mercy luôn ở đây cùng bạn.',
    audioEn: '/mercy-voice/welcome_back_en.mp3',
    audioVi: '/mercy-voice/welcome_back_vi.mp3',
    trigger: 'room_enter',
  },
  {
    id: 'take_breath',
    en: "Take a breath. You're safe. Let's continue your path.",
    vi: 'Hít thở nhẹ. Bạn an toàn. Ta tiếp tục hành trình nhé.',
    audioEn: '/mercy-voice/take_breath_en.mp3',
    audioVi: '/mercy-voice/take_breath_vi.mp3',
    trigger: 'room_enter',
  },
  {
    id: 'proud_progress',
    en: "You grow stronger every day — I'm proud of you.",
    vi: 'Mỗi ngày bạn đều tiến bộ. Mercy tự hào về bạn.',
    audioEn: '/mercy-voice/proud_progress_en.mp3',
    audioVi: '/mercy-voice/proud_progress_vi.mp3',
    trigger: 'room_enter',
  },
  {
    id: 'gentle_space',
    en: 'This is your space. Gentle, calm, and ready for you.',
    vi: 'Đây là không gian của bạn. Nhẹ nhàng, bình yên, sẵn sàng cho bạn.',
    audioEn: '/mercy-voice/gentle_space_en.mp3',
    audioVi: '/mercy-voice/gentle_space_vi.mp3',
    trigger: 'room_enter',
  },
  {
    id: 'beside_you',
    en: 'Mercy walks beside you. Always.',
    vi: 'Mercy luôn bước bên cạnh bạn. Luôn luôn.',
    audioEn: '/mercy-voice/beside_you_en.mp3',
    audioVi: '/mercy-voice/beside_you_vi.mp3',
    trigger: 'room_enter',
  },

  // Entry Complete
  {
    id: 'well_done',
    en: 'Well done. Each step forward matters.',
    vi: 'Làm tốt lắm. Mỗi bước tiến đều quan trọng.',
    audioEn: '/mercy-voice/well_done_en.mp3',
    audioVi: '/mercy-voice/well_done_vi.mp3',
    trigger: 'entry_complete',
  },
  {
    id: 'growth_visible',
    en: 'Your growth is visible. Keep moving.',
    vi: 'Sự tiến bộ của bạn rõ ràng. Tiếp tục nhé.',
    audioEn: '/mercy-voice/growth_visible_en.mp3',
    audioVi: '/mercy-voice/growth_visible_vi.mp3',
    trigger: 'entry_complete',
  },
  {
    id: 'one_more_step',
    en: "One more step completed. You're building something real.",
    vi: 'Thêm một bước hoàn thành. Bạn đang xây dựng điều có thật.',
    audioEn: '/mercy-voice/one_more_step_en.mp3',
    audioVi: '/mercy-voice/one_more_step_vi.mp3',
    trigger: 'entry_complete',
  },

  // Color Toggle
  {
    id: 'clean_mode',
    en: 'Switched to clean mode for you.',
    vi: 'Đã chuyển sang chế độ sáng cho bạn.',
    audioEn: '/mercy-voice/clean_mode_en.mp3',
    audioVi: '/mercy-voice/clean_mode_vi.mp3',
    trigger: 'color_toggle',
  },
  {
    id: 'colors_back',
    en: 'Colors restored. Welcome back to the vibrant side.',
    vi: 'Màu sắc đã trở lại. Chào mừng bạn quay về thế giới rực rỡ.',
    audioEn: '/mercy-voice/colors_back_en.mp3',
    audioVi: '/mercy-voice/colors_back_vi.mp3',
    trigger: 'color_toggle',
  },
  {
    id: 'visual_comfort',
    en: 'Adjusted for your visual comfort.',
    vi: 'Đã điều chỉnh cho sự thoải mái thị giác của bạn.',
    audioEn: '/mercy-voice/visual_comfort_en.mp3',
    audioVi: '/mercy-voice/visual_comfort_vi.mp3',
    trigger: 'color_toggle',
  },

  // Return after inactive
  {
    id: 'missed_you',
    en: 'I missed you, {{name}}. Welcome back.',
    vi: 'Mình nhớ bạn, {{name}}. Chào mừng trở lại.',
    audioEn: '/mercy-voice/missed_you_en.mp3',
    audioVi: '/mercy-voice/missed_you_vi.mp3',
    trigger: 'return_inactive',
  },
  {
    id: 'ready_continue',
    en: 'Ready to continue where we left off?',
    vi: 'Sẵn sàng tiếp tục từ chỗ chúng ta dừng lại chứ?',
    audioEn: '/mercy-voice/ready_continue_en.mp3',
    audioVi: '/mercy-voice/ready_continue_vi.mp3',
    trigger: 'return_inactive',
  },
  {
    id: 'back_again',
    en: "You're back again. Consistency is your strength.",
    vi: 'Bạn quay lại rồi. Sự kiên trì là sức mạnh của bạn.',
    audioEn: '/mercy-voice/back_again_en.mp3',
    audioVi: '/mercy-voice/back_again_vi.mp3',
    trigger: 'return_inactive',
  },

  // Encouragement
  {
    id: 'believe_in_you',
    en: 'I believe in you. Always have.',
    vi: 'Mình tin bạn. Luôn luôn.',
    audioEn: '/mercy-voice/believe_in_you_en.mp3',
    audioVi: '/mercy-voice/believe_in_you_vi.mp3',
    trigger: 'encouragement',
  },
  {
    id: 'strength_within',
    en: "The strength is within you. I'm just here to remind you.",
    vi: 'Sức mạnh nằm trong bạn. Mình chỉ ở đây để nhắc nhở bạn.',
    audioEn: '/mercy-voice/strength_within_en.mp3',
    audioVi: '/mercy-voice/strength_within_vi.mp3',
    trigger: 'encouragement',
  },

  // Onboarding
  {
    id: 'onboarding_welcome',
    en: "Welcome to your journey. I'm Mercy, and I'll walk beside you.",
    vi: 'Chào mừng đến hành trình của bạn. Mình là Mercy, mình sẽ bước cùng bạn.',
    audioEn: '/mercy-voice/onboarding_welcome_en.mp3',
    audioVi: '/mercy-voice/onboarding_welcome_vi.mp3',
    trigger: 'onboarding',
  },
  {
    id: 'onboarding_complete',
    en: "We're ready to begin. I'm honored to guide you.",
    vi: 'Chúng ta sẵn sàng bắt đầu. Mình vinh dự được hướng dẫn bạn.',
    audioEn: '/mercy-voice/onboarding_complete_en.mp3',
    audioVi: '/mercy-voice/onboarding_complete_vi.mp3',
    trigger: 'onboarding_complete',
  },

  // Low Mood
  {
    id: 'low_mood_gentle',
    en: "It's okay to feel this way. I'm here with you.",
    vi: 'Không sao cả khi cảm thấy như vậy. Mình ở đây với bạn.',
    audioEn: '/mercy-voice/low_mood_gentle_en.mp3',
    audioVi: '/mercy-voice/low_mood_gentle_vi.mp3',
    trigger: 'low_mood',
  },
  {
    id: 'low_mood_comfort',
    en: "Some days are harder. You're not alone in this.",
    vi: 'Có những ngày khó khăn hơn. Bạn không đơn độc trong chuyện này.',
    audioEn: '/mercy-voice/low_mood_comfort_en.mp3',
    audioVi: '/mercy-voice/low_mood_comfort_vi.mp3',
    trigger: 'low_mood',
  },

  // Confusion
  {
    id: 'confusion_support',
    en: "Confusion means you're exploring new territory. That's good.",
    vi: 'Bối rối nghĩa là bạn đang khám phá vùng đất mới. Điều đó tốt.',
    audioEn: '/mercy-voice/confusion_support_en.mp3',
    audioVi: '/mercy-voice/confusion_support_vi.mp3',
    trigger: 'confusion',
  },
  {
    id: 'confusion_patience',
    en: 'Take your time. Understanding comes in its own moment.',
    vi: 'Từ từ thôi. Sự hiểu biết sẽ đến vào lúc của nó.',
    audioEn: '/mercy-voice/confusion_patience_en.mp3',
    audioVi: '/mercy-voice/confusion_patience_vi.mp3',
    trigger: 'confusion',
  },

  // Stress Release
  {
    id: 'stress_breathe',
    en: "Breathe with me. In... and out. You're safe here.",
    vi: 'Hít thở cùng mình. Vào... và ra. Bạn an toàn ở đây.',
    audioEn: '/mercy-voice/stress_breathe_en.mp3',
    audioVi: '/mercy-voice/stress_breathe_vi.mp3',
    trigger: 'stress_release',
  },
  {
    id: 'stress_pause',
    en: "It's okay to pause. Rest is part of the journey.",
    vi: 'Được phép tạm dừng. Nghỉ ngơi là một phần của hành trình.',
    audioEn: '/mercy-voice/stress_pause_en.mp3',
    audioVi: '/mercy-voice/stress_pause_vi.mp3',
    trigger: 'stress_release',
  },

  // Celebration
  {
    id: 'celebration_proud',
    en: "Look at you. I'm proud of what you've accomplished.",
    vi: 'Nhìn bạn kìa. Mình tự hào về những gì bạn đã đạt được.',
    audioEn: '/mercy-voice/celebration_proud_en.mp3',
    audioVi: '/mercy-voice/celebration_proud_vi.mp3',
    trigger: 'celebration',
  },
  {
    id: 'celebration_milestone',
    en: 'A milestone reached. Your dedication shows.',
    vi: 'Một cột mốc đã đạt được. Sự tận tâm của bạn đang hiện rõ.',
    audioEn: '/mercy-voice/celebration_milestone_en.mp3',
    audioVi: '/mercy-voice/celebration_milestone_vi.mp3',
    trigger: 'celebration',
  },

  // Returning After Gap
  {
    id: 'return_gap_welcome',
    en: "You've been missed, {{name}}. Welcome home.",
    vi: 'Bạn đã được nhớ, {{name}}. Chào mừng về nhà.',
    audioEn: '/mercy-voice/return_gap_welcome_en.mp3',
    audioVi: '/mercy-voice/return_gap_welcome_vi.mp3',
    trigger: 'returning_after_gap',
  },
  {
    id: 'return_gap_gentle',
    en: "Life takes us away sometimes. I'm glad you're here again.",
    vi: 'Cuộc sống đôi khi đưa ta đi xa. Mình vui vì bạn lại ở đây.',
    audioEn: '/mercy-voice/return_gap_gentle_en.mp3',
    audioVi: '/mercy-voice/return_gap_gentle_vi.mp3',
    trigger: 'returning_after_gap',
  },

  // English Teacher
  {
    id: 'ef_welcome',
    en: "Let's practice English together. No rush.",
    vi: 'Cùng luyện tiếng Anh nhé. Không vội.',
    trigger: 'ef_room_enter',
  },
  {
    id: 'ef_progress',
    en: 'Your English is growing. Well done.',
    vi: 'Tiếng Anh của bạn đang tiến bộ. Làm tốt lắm.',
    trigger: 'ef_entry_complete',
  },
  {
    id: 'ef_pronunciation',
    en: 'Listen carefully and repeat. Sounds build fluency.',
    vi: 'Lắng nghe và lặp lại. Âm thanh xây dựng sự lưu loát.',
    trigger: 'ef_pronunciation_focus',
  },
  {
    id: 'ef_streak_praise',
    en: 'Your daily English practice is building real skill.',
    vi: 'Việc luyện tiếng Anh hàng ngày đang xây dựng kỹ năng thật.',
    trigger: 'ef_streak',
  },

  // Martial Coach
  {
    id: 'martial_enter_breathe',
    en: 'Breathe first. Then step in with intention.',
    vi: 'Hít thở trước. Rồi bước vào với chủ đích.',
    trigger: 'martial_room_enter',
  },
  {
    id: 'martial_complete_clean',
    en: 'Good work. Keep the form clean.',
    vi: 'Làm tốt. Giữ kỹ thuật gọn gàng.',
    trigger: 'martial_entry_complete',
  },
  {
    id: 'martial_low_mood_steady',
    en: 'Low energy still allows good practice. Stay steady.',
    vi: 'Năng lượng thấp vẫn có thể luyện tốt. Giữ vững nhịp.',
    trigger: 'martial_low_mood',
  },
  {
    id: 'martial_stress_reset',
    en: 'Release the tension. Return to controlled movement.',
    vi: 'Thả lỏng căng thẳng. Quay lại chuyển động có kiểm soát.',
    trigger: 'martial_stressed',
  },
  {
    id: 'martial_failure_reframe',
    en: 'A setback is feedback. Adjust and repeat.',
    vi: 'Một lần hụt là phản hồi. Điều chỉnh rồi lặp lại.',
    trigger: 'martial_failure_reframe',
  },
  {
    id: 'martial_victory_quiet',
    en: 'Good. Keep the discipline and return tomorrow.',
    vi: 'Tốt. Giữ kỷ luật và quay lại vào ngày mai.',
    trigger: 'martial_victory',
  },
];

/**
 * Map voice trigger to Mercy personality context
 */
function getPersonalityContextForTrigger(trigger: VoiceTrigger): MercyPersonalityContext {
  switch (trigger) {
    case 'room_enter':
    case 'onboarding':
    case 'onboarding_complete':
    case 'return_inactive':
    case 'returning_after_gap':
    case 'ef_room_enter':
    case 'martial_room_enter':
      return 'greeting';

    case 'entry_complete':
    case 'encouragement':
    case 'celebration':
    case 'ef_entry_complete':
    case 'ef_streak':
    case 'martial_entry_complete':
    case 'martial_victory':
      return 'encouragement';

    case 'confusion':
      return 'confused_user';

    case 'low_mood':
    case 'stress_release':
    case 'martial_low_mood':
    case 'martial_stressed':
    case 'martial_failure_reframe':
      return 'gentle_authority';

    case 'ef_pronunciation_focus':
      return 'teacher_wit';

    case 'color_toggle':
    default:
      return 'default';
  }
}

function applyNamePlaceholders(text: string, name?: string): string {
  if (name) {
    return text.replace(/\{\{name\}\}/g, name).replace(/\s+/g, ' ').trim();
  }

  return text.replace(/\{\{name\}\},?\s*/g, '').replace(/\s+/g, ' ').trim();
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').replace(/\s([,.!?;:])/g, '$1').trim();
}

function getVoiceRegisterForTrigger(
  trigger: VoiceTrigger,
  options?: VoiceSelectionOptions
): VoiceRegister {
  if (options?.register) {
    return options.register;
  }

  if (
    trigger === 'ef_room_enter' ||
    trigger === 'ef_entry_complete' ||
    trigger === 'ef_pronunciation_focus' ||
    trigger === 'ef_streak'
  ) {
    if (options?.teacherLevel === 'intense') return 'dry_wit';
    if (options?.teacherLevel === 'gentle') return 'warm_encourager';
    return 'steady_teacher';
  }

  if (
    trigger === 'martial_room_enter' ||
    trigger === 'martial_entry_complete' ||
    trigger === 'martial_low_mood' ||
    trigger === 'martial_stressed' ||
    trigger === 'martial_failure_reframe' ||
    trigger === 'martial_victory'
  ) {
    return 'martial_coach';
  }

  if (
    trigger === 'encouragement' ||
    trigger === 'entry_complete' ||
    trigger === 'celebration' ||
    trigger === 'low_mood'
  ) {
    return 'warm_encourager';
  }

  return 'gentle_host';
}

function tuneLineForRegister(
  line: Pick<VoiceLine, 'en' | 'vi'>,
  register: VoiceRegister,
  options?: VoiceSelectionOptions
): Pick<VoiceLine, 'en' | 'vi'> {
  let en = cleanText(line.en);
  let vi = cleanText(line.vi);

  if (options?.requireDirectness) {
    en = en.replace(/Let's\s+/gi, '').replace(/I believe in you\.?/gi, 'Keep going.');
    vi = vi.replace(/Cùng\s+/gi, '').replace(/Mình tin bạn\.?/gi, 'Tiếp tục nhé.');
  }

  if (options?.softenTone) {
    en = en.replace(/Keep going\./g, 'Take your time. Keep going.');
    vi = vi.replace(/Tiếp tục nhé\./g, 'Từ từ thôi. Tiếp tục nhé.');
  }

  if (options?.suppressHumor && register === 'dry_wit') {
    register = 'steady_teacher';
  }

  switch (register) {
    case 'steady_teacher':
      en = en.replace(/!/g, '.');
      vi = vi.replace(/!/g, '.');
      break;

    case 'warm_encourager':
      break;

    case 'dry_wit':
      if (!options?.suppressHumor) {
        en = en.replace(/Well done\./, 'Well done. Clean work.');
        vi = vi.replace(/Làm tốt lắm\./, 'Làm tốt lắm. Gọn gàng đấy.');
      }
      break;

    case 'martial_coach':
      en = en.replace(/I'm proud of you\./g, 'Stay steady.');
      vi = vi.replace(/Mercy tự hào về bạn\./g, 'Giữ vững nhịp.');
      break;

    case 'gentle_host':
    default:
      break;
  }

  return {
    en: cleanText(en),
    vi: cleanText(vi),
  };
}

function personalizeVoiceLine(
  line: VoiceLine,
  options?: VoiceSelectionOptions
): VoiceLine {
  const en = applyNamePlaceholders(line.en, options?.name);
  const vi = applyNamePlaceholders(line.vi, options?.name);
  const context = getPersonalityContextForTrigger(line.trigger);
  const register = getVoiceRegisterForTrigger(line.trigger, options);
  const tuned = tuneLineForRegister({ en, vi }, register, options);
  const styled = applyPersonality(tuned.en, tuned.vi, context);

  return {
    ...line,
    en: cleanText(styled.en),
    vi: cleanText(styled.vi),
  };
}

/**
 * Get random voice line by trigger type
 */
export function getVoiceLineByTrigger(
  trigger: VoiceTrigger,
  name?: string,
  options?: Omit<VoiceSelectionOptions, 'name'>
): VoiceLine {
  const lines = MERCY_VOICE_LINES.filter((l) => l.trigger === trigger);

  const fallbackLines =
    lines.length > 0
      ? lines
      : MERCY_VOICE_LINES.filter((l) => l.trigger === 'encouragement');

  const line = fallbackLines[Math.floor(Math.random() * fallbackLines.length)];

  if (!line) {
    return personalizeVoiceLine(
      {
        id: 'fallback',
        en: "I'm here with you.",
        vi: 'Mình ở đây với bạn.',
        trigger: 'encouragement',
      },
      { ...options, name }
    );
  }

  return personalizeVoiceLine(line, { ...options, name });
}

/**
 * Get voice line by ID
 */
export function getVoiceLineById(
  id: string,
  name?: string,
  options?: Omit<VoiceSelectionOptions, 'name'>
): VoiceLine | undefined {
  const line = MERCY_VOICE_LINES.find((l) => l.id === id);
  if (!line) return undefined;
  return personalizeVoiceLine(line, { ...options, name });
}

/**
 * Map emotion state to voice trigger
 */
export function getVoiceTriggerForEmotion(emotion: EmotionState): VoiceTrigger {
  switch (emotion) {
    case 'low_mood':
      return 'low_mood';
    case 'confused':
      return 'confusion';
    case 'stressed':
      return 'stress_release';
    case 'celebrating':
      return 'celebration';
    case 'returning_after_gap':
      return 'returning_after_gap';
    case 'focused':
      return 'encouragement';
    case 'neutral':
    default:
      return 'room_enter';
  }
}

/**
 * Get emotion-aware voice line
 */
export function getEmotionVoiceLine(
  emotion: EmotionState,
  name?: string,
  options?: Omit<VoiceSelectionOptions, 'name'>
): VoiceLine {
  const trigger = getVoiceTriggerForEmotion(emotion);
  return getVoiceLineByTrigger(trigger, name, options);
}

/**
 * Teacher convenience helper
 */
export function getTeacherVoiceLine(
  trigger:
    | 'ef_room_enter'
    | 'ef_entry_complete'
    | 'ef_pronunciation_focus'
    | 'ef_streak',
  teacherLevel: TeacherLevel,
  name?: string,
  options?: Omit<VoiceSelectionOptions, 'name' | 'teacherLevel'>
): VoiceLine {
  return getVoiceLineByTrigger(trigger, name, {
    ...options,
    teacherLevel,
  });
}

/**
 * Martial convenience helper
 */
export function getMartialVoiceLine(
  trigger:
    | 'martial_room_enter'
    | 'martial_entry_complete'
    | 'martial_low_mood'
    | 'martial_stressed'
    | 'martial_failure_reframe'
    | 'martial_victory',
  martialLevel: MartialCoachLevel,
  name?: string,
  options?: Omit<VoiceSelectionOptions, 'name' | 'martialLevel'>
): VoiceLine {
  return getVoiceLineByTrigger(trigger, name, {
    ...options,
    martialLevel,
  });
}