/**
 * Mercy Voice Pack
 * 
 * Voice line definitions for EN + VI.
 * Audio files stored in /public/mercy-voice/
 */

export interface VoiceLine {
  id: string;
  en: string;
  vi: string;
  audioEn?: string;
  audioVi?: string;
  trigger: 'room_enter' | 'entry_complete' | 'color_toggle' | 'return_inactive' | 'encouragement';
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
  }
];

/**
 * Get random voice line by trigger type
 */
export function getVoiceLineByTrigger(
  trigger: VoiceLine['trigger'],
  name?: string
): VoiceLine {
  const lines = MERCY_VOICE_LINES.filter(l => l.trigger === trigger);
  const line = lines[Math.floor(Math.random() * lines.length)];
  
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
