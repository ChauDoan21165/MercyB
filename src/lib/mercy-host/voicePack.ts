/**
 * Mercy Voice Pack - Phase 5 Enhanced
 * 
 * Voice line definitions for EN + VI with emotion triggers.
 * Audio files stored in /public/mercy-voice/
 */

import type { EmotionState } from './emotionModel';

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
  // Phase 7: English teacher triggers
  | 'ef_room_enter'
  | 'ef_entry_complete'
  | 'ef_pronunciation_focus'
  | 'ef_streak';

export interface VoiceLine {
  id: string;
  en: string;
  vi: string;
  audioEn?: string;
  audioVi?: string;
  trigger: VoiceTrigger;
}

export const MERCY_VOICE_LINES: VoiceLine[] = [
  // Room Enter
  {
    id: 'welcome_back',
    en: "Welcome back, {{name}}. Mercy is here with you.",
    vi: "Chào mừng bạn trở lại, {{name}}. Mercy luôn ở đây cùng bạn.",
    audioEn: '/mercy-voice/welcome_back_en.mp3',
    audioVi: '/mercy-voice/welcome_back_vi.mp3',
    trigger: 'room_enter'
  },
  {
    id: 'take_breath',
    en: "Take a breath. You're safe. Let's continue your path.",
    vi: "Hít thở nhẹ. Bạn an toàn. Ta tiếp tục hành trình nhé.",
    audioEn: '/mercy-voice/take_breath_en.mp3',
    audioVi: '/mercy-voice/take_breath_vi.mp3',
    trigger: 'room_enter'
  },
  {
    id: 'proud_progress',
    en: "You grow stronger every day — I'm proud of you.",
    vi: "Mỗi ngày bạn đều tiến bộ. Mercy tự hào về bạn.",
    audioEn: '/mercy-voice/proud_progress_en.mp3',
    audioVi: '/mercy-voice/proud_progress_vi.mp3',
    trigger: 'room_enter'
  },
  {
    id: 'gentle_space',
    en: "This is your space. Gentle, calm, and ready for you.",
    vi: "Đây là không gian của bạn. Nhẹ nhàng, bình yên, sẵn sàng cho bạn.",
    audioEn: '/mercy-voice/gentle_space_en.mp3',
    audioVi: '/mercy-voice/gentle_space_vi.mp3',
    trigger: 'room_enter'
  },
  {
    id: 'beside_you',
    en: "Mercy walks beside you. Always.",
    vi: "Mercy luôn bước bên cạnh bạn. Luôn luôn.",
    audioEn: '/mercy-voice/beside_you_en.mp3',
    audioVi: '/mercy-voice/beside_you_vi.mp3',
    trigger: 'room_enter'
  },

  // Entry Complete
  {
    id: 'well_done',
    en: "Well done. Each step forward matters.",
    vi: "Làm tốt lắm. Mỗi bước tiến đều quan trọng.",
    audioEn: '/mercy-voice/well_done_en.mp3',
    audioVi: '/mercy-voice/well_done_vi.mp3',
    trigger: 'entry_complete'
  },
  {
    id: 'growth_visible',
    en: "Your growth is visible. Keep moving.",
    vi: "Sự tiến bộ của bạn rõ ràng. Tiếp tục nhé.",
    audioEn: '/mercy-voice/growth_visible_en.mp3',
    audioVi: '/mercy-voice/growth_visible_vi.mp3',
    trigger: 'entry_complete'
  },
  {
    id: 'one_more_step',
    en: "One more step completed. You're building something real.",
    vi: "Thêm một bước hoàn thành. Bạn đang xây dựng điều có thật.",
    audioEn: '/mercy-voice/one_more_step_en.mp3',
    audioVi: '/mercy-voice/one_more_step_vi.mp3',
    trigger: 'entry_complete'
  },

  // Color Toggle
  {
    id: 'clean_mode',
    en: "Switched to clean mode for you.",
    vi: "Đã chuyển sang chế độ sáng cho bạn.",
    audioEn: '/mercy-voice/clean_mode_en.mp3',
    audioVi: '/mercy-voice/clean_mode_vi.mp3',
    trigger: 'color_toggle'
  },
  {
    id: 'colors_back',
    en: "Colors restored. Welcome back to the vibrant side.",
    vi: "Màu sắc đã trở lại. Chào mừng bạn quay về thế giới rực rỡ.",
    audioEn: '/mercy-voice/colors_back_en.mp3',
    audioVi: '/mercy-voice/colors_back_vi.mp3',
    trigger: 'color_toggle'
  },
  {
    id: 'visual_comfort',
    en: "Adjusted for your visual comfort.",
    vi: "Đã điều chỉnh cho sự thoải mái thị giác của bạn.",
    audioEn: '/mercy-voice/visual_comfort_en.mp3',
    audioVi: '/mercy-voice/visual_comfort_vi.mp3',
    trigger: 'color_toggle'
  },

  // Return after inactive (12+ hours)
  {
    id: 'missed_you',
    en: "I missed you, {{name}}. Welcome back.",
    vi: "Mình nhớ bạn, {{name}}. Chào mừng trở lại.",
    audioEn: '/mercy-voice/missed_you_en.mp3',
    audioVi: '/mercy-voice/missed_you_vi.mp3',
    trigger: 'return_inactive'
  },
  {
    id: 'ready_continue',
    en: "Ready to continue where we left off?",
    vi: "Sẵn sàng tiếp tục từ chỗ chúng ta dừng lại chứ?",
    audioEn: '/mercy-voice/ready_continue_en.mp3',
    audioVi: '/mercy-voice/ready_continue_vi.mp3',
    trigger: 'return_inactive'
  },
  {
    id: 'back_again',
    en: "You're back again. Consistency is your strength.",
    vi: "Bạn quay lại rồi. Sự kiên trì là sức mạnh của bạn.",
    audioEn: '/mercy-voice/back_again_en.mp3',
    audioVi: '/mercy-voice/back_again_vi.mp3',
    trigger: 'return_inactive'
  },

  // Encouragement
  {
    id: 'believe_in_you',
    en: "I believe in you. Always have.",
    vi: "Mình tin bạn. Luôn luôn.",
    audioEn: '/mercy-voice/believe_in_you_en.mp3',
    audioVi: '/mercy-voice/believe_in_you_vi.mp3',
    trigger: 'encouragement'
  },
  {
    id: 'strength_within',
    en: "The strength is within you. I'm just here to remind you.",
    vi: "Sức mạnh nằm trong bạn. Mình chỉ ở đây để nhắc nhở bạn.",
    audioEn: '/mercy-voice/strength_within_en.mp3',
    audioVi: '/mercy-voice/strength_within_vi.mp3',
    trigger: 'encouragement'
  },

  // Phase 5: Onboarding
  {
    id: 'onboarding_welcome',
    en: "Welcome to your journey. I'm Mercy, and I'll walk beside you.",
    vi: "Chào mừng đến hành trình của bạn. Mình là Mercy, mình sẽ bước cùng bạn.",
    audioEn: '/mercy-voice/onboarding_welcome_en.mp3',
    audioVi: '/mercy-voice/onboarding_welcome_vi.mp3',
    trigger: 'onboarding'
  },
  {
    id: 'onboarding_complete',
    en: "We're ready to begin. I'm honored to guide you.",
    vi: "Chúng ta sẵn sàng bắt đầu. Mình vinh dự được hướng dẫn bạn.",
    audioEn: '/mercy-voice/onboarding_complete_en.mp3',
    audioVi: '/mercy-voice/onboarding_complete_vi.mp3',
    trigger: 'onboarding_complete'
  },

  // Phase 5: Low Mood
  {
    id: 'low_mood_gentle',
    en: "It's okay to feel this way. I'm here with you.",
    vi: "Không sao cả khi cảm thấy như vậy. Mình ở đây với bạn.",
    audioEn: '/mercy-voice/low_mood_gentle_en.mp3',
    audioVi: '/mercy-voice/low_mood_gentle_vi.mp3',
    trigger: 'low_mood'
  },
  {
    id: 'low_mood_comfort',
    en: "Some days are harder. You're not alone in this.",
    vi: "Có những ngày khó khăn hơn. Bạn không đơn độc trong chuyện này.",
    audioEn: '/mercy-voice/low_mood_comfort_en.mp3',
    audioVi: '/mercy-voice/low_mood_comfort_vi.mp3',
    trigger: 'low_mood'
  },

  // Phase 5: Confusion
  {
    id: 'confusion_support',
    en: "Confusion means you're exploring new territory. That's good.",
    vi: "Bối rối nghĩa là bạn đang khám phá vùng đất mới. Điều đó tốt.",
    audioEn: '/mercy-voice/confusion_support_en.mp3',
    audioVi: '/mercy-voice/confusion_support_vi.mp3',
    trigger: 'confusion'
  },
  {
    id: 'confusion_patience',
    en: "Take your time. Understanding comes in its own moment.",
    vi: "Từ từ thôi. Sự hiểu biết sẽ đến vào lúc của nó.",
    audioEn: '/mercy-voice/confusion_patience_en.mp3',
    audioVi: '/mercy-voice/confusion_patience_vi.mp3',
    trigger: 'confusion'
  },

  // Phase 5: Stress Release
  {
    id: 'stress_breathe',
    en: "Breathe with me. In... and out. You're safe here.",
    vi: "Hít thở cùng mình. Vào... và ra. Bạn an toàn ở đây.",
    audioEn: '/mercy-voice/stress_breathe_en.mp3',
    audioVi: '/mercy-voice/stress_breathe_vi.mp3',
    trigger: 'stress_release'
  },
  {
    id: 'stress_pause',
    en: "It's okay to pause. Rest is part of the journey.",
    vi: "Được phép tạm dừng. Nghỉ ngơi là một phần của hành trình.",
    audioEn: '/mercy-voice/stress_pause_en.mp3',
    audioVi: '/mercy-voice/stress_pause_vi.mp3',
    trigger: 'stress_release'
  },

  // Phase 5: Celebration
  {
    id: 'celebration_proud',
    en: "Look at you! I'm so proud of what you've accomplished.",
    vi: "Nhìn bạn kìa! Mình rất tự hào về những gì bạn đã đạt được.",
    audioEn: '/mercy-voice/celebration_proud_en.mp3',
    audioVi: '/mercy-voice/celebration_proud_vi.mp3',
    trigger: 'celebration'
  },
  {
    id: 'celebration_milestone',
    en: "A milestone reached! Your dedication shines through.",
    vi: "Một cột mốc đạt được! Sự cống hiến của bạn tỏa sáng.",
    audioEn: '/mercy-voice/celebration_milestone_en.mp3',
    audioVi: '/mercy-voice/celebration_milestone_vi.mp3',
    trigger: 'celebration'
  },

  // Phase 5: Returning After Gap
  {
    id: 'return_gap_welcome',
    en: "You've been missed, {{name}}. Welcome home.",
    vi: "Bạn đã được nhớ, {{name}}. Chào mừng về nhà.",
    audioEn: '/mercy-voice/return_gap_welcome_en.mp3',
    audioVi: '/mercy-voice/return_gap_welcome_vi.mp3',
    trigger: 'returning_after_gap'
  },
  {
    id: 'return_gap_gentle',
    en: "Life takes us away sometimes. I'm glad you're here again.",
    vi: "Cuộc sống đôi khi đưa ta đi xa. Mình vui vì bạn ở đây lại.",
    audioEn: '/mercy-voice/return_gap_gentle_en.mp3',
    audioVi: '/mercy-voice/return_gap_gentle_vi.mp3',
    trigger: 'returning_after_gap'
  },

  // Phase 7: English Teacher triggers
  {
    id: 'ef_welcome',
    en: "Let's practice English together. No rush.",
    vi: "Cùng luyện tiếng Anh nhé. Không vội.",
    trigger: 'ef_room_enter'
  },
  {
    id: 'ef_progress',
    en: "Your English is growing. Well done!",
    vi: "Tiếng Anh của bạn đang tiến bộ. Làm tốt lắm!",
    trigger: 'ef_entry_complete'
  },
  {
    id: 'ef_pronunciation',
    en: "Listen carefully and repeat. Sounds build fluency.",
    vi: "Lắng nghe và lặp lại. Âm thanh xây dựng sự lưu loát.",
    trigger: 'ef_pronunciation_focus'
  },
  {
    id: 'ef_streak_praise',
    en: "Your daily English practice is building real skill.",
    vi: "Việc luyện tiếng Anh hàng ngày đang xây dựng kỹ năng thực sự.",
    trigger: 'ef_streak'
  }
];

/**
 * Get random voice line by trigger type
 */
export function getVoiceLineByTrigger(
  trigger: VoiceTrigger,
  name?: string
): VoiceLine {
  const lines = MERCY_VOICE_LINES.filter(l => l.trigger === trigger);
  
  // Fallback to encouragement if no lines for trigger
  const fallbackLines = lines.length > 0 
    ? lines 
    : MERCY_VOICE_LINES.filter(l => l.trigger === 'encouragement');
  
  const line = fallbackLines[Math.floor(Math.random() * fallbackLines.length)];
  
  if (!line) {
    // Ultimate fallback - text only
    return {
      id: 'fallback',
      en: "I'm here with you.",
      vi: "Mình ở đây với bạn.",
      trigger: 'encouragement'
    };
  }
  
  if (name) {
    return {
      ...line,
      en: line.en.replace(/\{\{name\}\}/g, name),
      vi: line.vi.replace(/\{\{name\}\}/g, name)
    };
  }
  
  return line;
}

/**
 * Get voice line by ID
 */
export function getVoiceLineById(id: string, name?: string): VoiceLine | undefined {
  const line = MERCY_VOICE_LINES.find(l => l.id === id);
  
  if (line && name) {
    return {
      ...line,
      en: line.en.replace(/\{\{name\}\}/g, name),
      vi: line.vi.replace(/\{\{name\}\}/g, name)
    };
  }
  
  return line;
}

/**
 * Map emotion state to voice trigger
 */
export function getVoiceTriggerForEmotion(emotion: EmotionState): VoiceTrigger {
  switch (emotion) {
    case 'low_mood': return 'low_mood';
    case 'confused': return 'confusion';
    case 'stressed': return 'stress_release';
    case 'celebrating': return 'celebration';
    case 'returning_after_gap': return 'returning_after_gap';
    case 'focused': return 'encouragement';
    case 'neutral':
    default: return 'room_enter';
  }
}

/**
 * Get emotion-aware voice line
 */
export function getEmotionVoiceLine(
  emotion: EmotionState,
  name?: string
): VoiceLine {
  const trigger = getVoiceTriggerForEmotion(emotion);
  return getVoiceLineByTrigger(trigger, name);
}
