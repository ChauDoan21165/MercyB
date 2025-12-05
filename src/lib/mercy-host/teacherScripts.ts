/**
 * Mercy Teacher Scripts - Phase 7
 * 
 * English teacher mode with micro-tips and pronunciation nudges.
 * All lines ≤120 chars, warm tone, no "AI" language.
 */

import type { TeacherLevel } from './memorySchema';

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

/**
 * Teacher tips organized by context and level
 */
const TEACHER_TIPS: Record<TeacherLevel, Record<TeacherContext, TeacherTip[]>> = {
  gentle: {
    ef_room_enter: [
      {
        en: "Let's learn together. No rush, no pressure.",
        vi: "Cùng học nhé. Không vội, không áp lực.",
        context: 'ef_room_enter'
      },
      {
        en: "Welcome back to English. Take your time.",
        vi: "Chào mừng trở lại với tiếng Anh. Từ từ thôi.",
        context: 'ef_room_enter'
      },
      {
        en: "English is a journey. Enjoy each step.",
        vi: "Tiếng Anh là hành trình. Tận hưởng từng bước.",
        context: 'ef_room_enter'
      }
    ],
    ef_entry_complete: [
      {
        en: "Well done! Every word learned is progress.",
        vi: "Làm tốt lắm! Mỗi từ học được là tiến bộ.",
        context: 'ef_entry_complete'
      },
      {
        en: "You're building your English, one step at a time.",
        vi: "Bạn đang xây dựng tiếng Anh, từng bước một.",
        context: 'ef_entry_complete'
      }
    ],
    ef_streak: [
      {
        en: "Your consistency is beautiful. Keep it gentle.",
        vi: "Sự kiên trì của bạn thật đẹp. Giữ nhẹ nhàng nhé.",
        context: 'ef_streak'
      }
    ],
    ef_return_after_gap: [
      {
        en: "Welcome back. English missed you too.",
        vi: "Chào mừng trở lại. Tiếng Anh cũng nhớ bạn.",
        context: 'ef_return_after_gap'
      }
    ],
    ef_pronunciation_focus: [
      {
        en: "Listen carefully. The sounds will come naturally.",
        vi: "Lắng nghe cẩn thận. Âm thanh sẽ đến tự nhiên.",
        context: 'ef_pronunciation_focus'
      }
    ]
  },
  normal: {
    ef_room_enter: [
      {
        en: "Let's practice English today. Ready when you are.",
        vi: "Hãy luyện tiếng Anh hôm nay. Sẵn sàng khi bạn sẵn sàng.",
        context: 'ef_room_enter'
      },
      {
        en: "English Foundation awaits. Let's grow together.",
        vi: "English Foundation đang chờ. Cùng phát triển nhé.",
        context: 'ef_room_enter'
      },
      {
        en: "Your English journey continues. One lesson at a time.",
        vi: "Hành trình tiếng Anh tiếp tục. Từng bài học một.",
        context: 'ef_room_enter'
      }
    ],
    ef_entry_complete: [
      {
        en: "Good progress! Try using this phrase today.",
        vi: "Tiến bộ tốt! Thử dùng cụm từ này hôm nay nhé.",
        context: 'ef_entry_complete'
      },
      {
        en: "Well done! Your vocabulary is growing.",
        vi: "Làm tốt lắm! Vốn từ của bạn đang tăng.",
        context: 'ef_entry_complete'
      },
      {
        en: "Another step forward. Your English improves daily.",
        vi: "Thêm một bước tiến. Tiếng Anh của bạn cải thiện mỗi ngày.",
        context: 'ef_entry_complete'
      }
    ],
    ef_streak: [
      {
        en: "Your daily practice is paying off. Keep going!",
        vi: "Việc luyện tập hàng ngày đang có kết quả. Tiếp tục!",
        context: 'ef_streak'
      },
      {
        en: "Consistency builds fluency. You're on the right track.",
        vi: "Kiên trì xây dựng sự lưu loát. Bạn đang đúng hướng.",
        context: 'ef_streak'
      }
    ],
    ef_return_after_gap: [
      {
        en: "Welcome back! Let's refresh what you learned.",
        vi: "Chào mừng trở lại! Hãy ôn lại những gì bạn đã học.",
        context: 'ef_return_after_gap'
      }
    ],
    ef_pronunciation_focus: [
      {
        en: "Tip: Focus on the ending sounds in English words.",
        vi: "Mẹo: Tập trung vào âm cuối trong từ tiếng Anh.",
        context: 'ef_pronunciation_focus'
      },
      {
        en: "Try saying it slowly first, then speed up.",
        vi: "Thử nói chậm trước, sau đó tăng tốc.",
        context: 'ef_pronunciation_focus'
      }
    ]
  },
  intense: {
    ef_room_enter: [
      {
        en: "Time to level up your English. Let's work.",
        vi: "Đến lúc nâng cấp tiếng Anh. Hãy bắt đầu.",
        context: 'ef_room_enter'
      },
      {
        en: "English mastery requires daily practice. You're here.",
        vi: "Thành thạo tiếng Anh cần luyện tập hàng ngày. Bạn ở đây rồi.",
        context: 'ef_room_enter'
      }
    ],
    ef_entry_complete: [
      {
        en: "Good. Now practice using it in a sentence.",
        vi: "Tốt. Bây giờ thực hành dùng nó trong câu.",
        context: 'ef_entry_complete'
      },
      {
        en: "Memorize this. Review it tomorrow morning.",
        vi: "Ghi nhớ điều này. Ôn lại sáng mai.",
        context: 'ef_entry_complete'
      }
    ],
    ef_streak: [
      {
        en: "Your streak shows discipline. Keep pushing forward.",
        vi: "Streak của bạn thể hiện kỷ luật. Tiếp tục tiến lên.",
        context: 'ef_streak'
      }
    ],
    ef_return_after_gap: [
      {
        en: "You're back. Let's make up for lost time.",
        vi: "Bạn đã quay lại. Hãy bù đắp thời gian đã mất.",
        context: 'ef_return_after_gap'
      }
    ],
    ef_pronunciation_focus: [
      {
        en: "Record yourself. Compare with native speakers.",
        vi: "Ghi âm bạn. So sánh với người bản xứ.",
        context: 'ef_pronunciation_focus'
      }
    ]
  }
};

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

  // Pick random tip
  const tip = tipsForContext[Math.floor(Math.random() * tipsForContext.length)];

  // Replace name placeholder if present
  if (userName) {
    return {
      ...tip,
      en: tip.en.replace(/\{\{name\}\}/g, userName),
      vi: tip.vi.replace(/\{\{name\}\}/g, userName)
    };
  }

  return tip;
}

/**
 * Get all tips for a context (for validation/testing)
 */
export function getAllTipsForContext(
  level: TeacherLevel,
  context: TeacherContext
): TeacherTip[] {
  return TEACHER_TIPS[level][context] || [];
}

/**
 * Validate all tips are within length limit
 */
export function validateTeacherTips(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const MAX_LENGTH = 120;

  for (const [level, contexts] of Object.entries(TEACHER_TIPS)) {
    for (const [context, tips] of Object.entries(contexts)) {
      for (const tip of tips as TeacherTip[]) {
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
