/**
 * 90-Day English Plan Generator
 * 
 * Generates a personalized 90-day learning roadmap based on:
 * - CEFR level (A1-C1)
 * - Focus area (listening, speaking, reading, mixed)
 * - User interests/topics
 */

import {
  type CEFRLevel,
  type FocusArea,
  type PlanGenerationInput,
  type NinetyDayPlan,
  type PlanPhase,
  type DailyTask,
  CEFR_INFO,
  FOCUS_INFO,
} from './planTypes';

// ============================================
// PHASE TEMPLATES BY LEVEL
// ============================================

interface PhaseTemplate {
  phase: number;
  weeksStart: number;
  weeksEnd: number;
  titleEn: string;
  titleVi: string;
  goalsEn: string[];
  goalsVi: string[];
  roomsTarget: number;
}

const PHASE_TEMPLATES: Record<CEFRLevel, PhaseTemplate[]> = {
  A1: [
    {
      phase: 1, weeksStart: 1, weeksEnd: 2,
      titleEn: 'Foundation: Sounds & Alphabet',
      titleVi: 'Nền tảng: Âm thanh & Bảng chữ cái',
      goalsEn: ['Master English sounds', 'Learn basic greetings', 'Build listening habit'],
      goalsVi: ['Thành thạo âm tiếng Anh', 'Học lời chào cơ bản', 'Xây dựng thói quen nghe'],
      roomsTarget: 6,
    },
    {
      phase: 2, weeksStart: 3, weeksEnd: 4,
      titleEn: 'Core Words: Daily Life',
      titleVi: 'Từ vựng cốt lõi: Cuộc sống hàng ngày',
      goalsEn: ['100 essential words', 'Simple phrases', 'Shadow practice basics'],
      goalsVi: ['100 từ thiết yếu', 'Cụm từ đơn giản', 'Cơ bản luyện shadow'],
      roomsTarget: 8,
    },
    {
      phase: 3, weeksStart: 5, weeksEnd: 8,
      titleEn: 'First Sentences',
      titleVi: 'Những câu đầu tiên',
      goalsEn: ['Form simple sentences', 'Ask basic questions', 'Introduce yourself'],
      goalsVi: ['Tạo câu đơn giản', 'Hỏi câu cơ bản', 'Giới thiệu bản thân'],
      roomsTarget: 12,
    },
    {
      phase: 4, weeksStart: 9, weeksEnd: 13,
      titleEn: 'Confidence Building',
      titleVi: 'Xây dựng sự tự tin',
      goalsEn: ['Speak without hesitation', 'Understand slow speech', 'Complete A1'],
      goalsVi: ['Nói không do dự', 'Hiểu lời nói chậm', 'Hoàn thành A1'],
      roomsTarget: 14,
    },
  ],
  A2: [
    {
      phase: 1, weeksStart: 1, weeksEnd: 3,
      titleEn: 'Everyday Conversations',
      titleVi: 'Hội thoại hàng ngày',
      goalsEn: ['Shopping phrases', 'Restaurant vocabulary', 'Common situations'],
      goalsVi: ['Cụm từ mua sắm', 'Từ vựng nhà hàng', 'Tình huống thường gặp'],
      roomsTarget: 10,
    },
    {
      phase: 2, weeksStart: 4, weeksEnd: 6,
      titleEn: 'Grammar Patterns',
      titleVi: 'Mẫu ngữ pháp',
      goalsEn: ['Past tense', 'Future plans', 'Connecting ideas'],
      goalsVi: ['Thì quá khứ', 'Kế hoạch tương lai', 'Kết nối ý tưởng'],
      roomsTarget: 10,
    },
    {
      phase: 3, weeksStart: 7, weeksEnd: 10,
      titleEn: 'Real-World Practice',
      titleVi: 'Thực hành thực tế',
      goalsEn: ['Travel scenarios', 'Work basics', 'Social interactions'],
      goalsVi: ['Tình huống du lịch', 'Công việc cơ bản', 'Tương tác xã hội'],
      roomsTarget: 12,
    },
    {
      phase: 4, weeksStart: 11, weeksEnd: 13,
      titleEn: 'Fluency Foundation',
      titleVi: 'Nền tảng lưu loát',
      goalsEn: ['Speak more naturally', 'Understand native speed', 'Complete A2'],
      goalsVi: ['Nói tự nhiên hơn', 'Hiểu tốc độ bản xứ', 'Hoàn thành A2'],
      roomsTarget: 10,
    },
  ],
  B1: [
    {
      phase: 1, weeksStart: 1, weeksEnd: 3,
      titleEn: 'Opinion & Discussion',
      titleVi: 'Ý kiến & Thảo luận',
      goalsEn: ['Express opinions', 'Agree/disagree politely', 'Give reasons'],
      goalsVi: ['Diễn đạt ý kiến', 'Đồng ý/không đồng ý lịch sự', 'Đưa ra lý do'],
      roomsTarget: 10,
    },
    {
      phase: 2, weeksStart: 4, weeksEnd: 7,
      titleEn: 'Complex Structures',
      titleVi: 'Cấu trúc phức tạp',
      goalsEn: ['Conditional sentences', 'Reported speech', 'Passive voice'],
      goalsVi: ['Câu điều kiện', 'Câu tường thuật', 'Câu bị động'],
      roomsTarget: 12,
    },
    {
      phase: 3, weeksStart: 8, weeksEnd: 10,
      titleEn: 'Professional English',
      titleVi: 'Tiếng Anh chuyên nghiệp',
      goalsEn: ['Meeting language', 'Email writing', 'Presentations'],
      goalsVi: ['Ngôn ngữ họp', 'Viết email', 'Thuyết trình'],
      roomsTarget: 10,
    },
    {
      phase: 4, weeksStart: 11, weeksEnd: 13,
      titleEn: 'Natural Expression',
      titleVi: 'Diễn đạt tự nhiên',
      goalsEn: ['Idioms and phrases', 'Cultural nuances', 'Complete B1'],
      goalsVi: ['Thành ngữ và cụm từ', 'Sắc thái văn hóa', 'Hoàn thành B1'],
      roomsTarget: 10,
    },
  ],
  B2: [
    {
      phase: 1, weeksStart: 1, weeksEnd: 3,
      titleEn: 'Abstract Discussion',
      titleVi: 'Thảo luận trừu tượng',
      goalsEn: ['Discuss complex topics', 'Hypothetical situations', 'Debate skills'],
      goalsVi: ['Thảo luận chủ đề phức tạp', 'Tình huống giả định', 'Kỹ năng tranh luận'],
      roomsTarget: 10,
    },
    {
      phase: 2, weeksStart: 4, weeksEnd: 7,
      titleEn: 'Nuanced Communication',
      titleVi: 'Giao tiếp tinh tế',
      goalsEn: ['Subtle meanings', 'Tone and register', 'Persuasive language'],
      goalsVi: ['Nghĩa tinh tế', 'Giọng điệu và phong cách', 'Ngôn ngữ thuyết phục'],
      roomsTarget: 12,
    },
    {
      phase: 3, weeksStart: 8, weeksEnd: 10,
      titleEn: 'Academic & Formal',
      titleVi: 'Học thuật & Trang trọng',
      goalsEn: ['Academic vocabulary', 'Formal writing', 'Research language'],
      goalsVi: ['Từ vựng học thuật', 'Viết trang trọng', 'Ngôn ngữ nghiên cứu'],
      roomsTarget: 10,
    },
    {
      phase: 4, weeksStart: 11, weeksEnd: 13,
      titleEn: 'Native-like Expression',
      titleVi: 'Diễn đạt như người bản xứ',
      goalsEn: ['Colloquialisms', 'Cultural references', 'Complete B2'],
      goalsVi: ['Cách nói thông tục', 'Tham chiếu văn hóa', 'Hoàn thành B2'],
      roomsTarget: 10,
    },
  ],
  C1: [
    {
      phase: 1, weeksStart: 1, weeksEnd: 3,
      titleEn: 'Advanced Expression',
      titleVi: 'Diễn đạt nâng cao',
      goalsEn: ['Flexible language use', 'Implicit meaning', 'Rhetorical devices'],
      goalsVi: ['Sử dụng ngôn ngữ linh hoạt', 'Nghĩa ngầm', 'Thủ pháp tu từ'],
      roomsTarget: 10,
    },
    {
      phase: 2, weeksStart: 4, weeksEnd: 7,
      titleEn: 'Professional Mastery',
      titleVi: 'Thành thạo chuyên nghiệp',
      goalsEn: ['Leadership language', 'Negotiation', 'Complex presentations'],
      goalsVi: ['Ngôn ngữ lãnh đạo', 'Đàm phán', 'Thuyết trình phức tạp'],
      roomsTarget: 12,
    },
    {
      phase: 3, weeksStart: 8, weeksEnd: 10,
      titleEn: 'Cultural Fluency',
      titleVi: 'Lưu loát văn hóa',
      goalsEn: ['Humor and irony', 'Literary language', 'Cultural depth'],
      goalsVi: ['Hài hước và mỉa mai', 'Ngôn ngữ văn học', 'Chiều sâu văn hóa'],
      roomsTarget: 10,
    },
    {
      phase: 4, weeksStart: 11, weeksEnd: 13,
      titleEn: 'Near-Native Polish',
      titleVi: 'Trau chuốt gần bản xứ',
      goalsEn: ['Subtle nuances', 'Regional variations', 'Complete C1'],
      goalsVi: ['Sắc thái tinh tế', 'Biến thể vùng miền', 'Hoàn thành C1'],
      roomsTarget: 10,
    },
  ],
};

// ============================================
// TASK TEMPLATES
// ============================================

function generateTasksForPhase(
  focus: FocusArea,
  level: CEFRLevel,
  dailyMinutes: number
): DailyTask[] {
  const tasks: DailyTask[] = [];
  const taskId = (type: string) => `${level.toLowerCase()}_${type}_${Date.now()}`;

  // Listening-focused tasks
  if (focus === 'listening' || focus === 'mixed') {
    tasks.push({
      id: taskId('listen'),
      type: 'listen',
      duration_minutes: Math.round(dailyMinutes * 0.4),
      description_en: 'Listen to room audio without looking at text',
      description_vi: 'Nghe âm thanh phòng mà không nhìn văn bản',
    });
  }

  // Speaking-focused tasks
  if (focus === 'speaking' || focus === 'mixed') {
    tasks.push({
      id: taskId('shadow'),
      type: 'shadow',
      duration_minutes: Math.round(dailyMinutes * 0.3),
      description_en: 'Shadow practice: repeat after the audio',
      description_vi: 'Luyện shadow: lặp lại theo âm thanh',
    });
    tasks.push({
      id: taskId('pronunciation'),
      type: 'pronunciation',
      duration_minutes: Math.round(dailyMinutes * 0.2),
      description_en: 'Focus on difficult sounds and endings',
      description_vi: 'Tập trung vào âm khó và âm cuối',
    });
  }

  // Reading-focused tasks
  if (focus === 'reading' || focus === 'mixed') {
    tasks.push({
      id: taskId('read'),
      type: 'read',
      duration_minutes: Math.round(dailyMinutes * 0.3),
      description_en: 'Read room content, note new vocabulary',
      description_vi: 'Đọc nội dung phòng, ghi chú từ vựng mới',
    });
    tasks.push({
      id: taskId('vocabulary'),
      type: 'vocabulary',
      duration_minutes: Math.round(dailyMinutes * 0.2),
      description_en: 'Review and practice new words',
      description_vi: 'Ôn tập và thực hành từ mới',
    });
  }

  // Review task (all focuses)
  tasks.push({
    id: taskId('review'),
    type: 'review',
    duration_minutes: Math.round(dailyMinutes * 0.1),
    description_en: 'Quick review of yesterday\'s learning',
    description_vi: 'Ôn nhanh bài học hôm qua',
  });

  return tasks;
}

// ============================================
// MAIN GENERATOR
// ============================================

/**
 * Generate a personalized 90-day English learning plan.
 */
export function generateNinetyDayPlan(input: PlanGenerationInput): NinetyDayPlan {
  const { cefrLevel, focus, topics = [], dailyMinutes = 15 } = input;

  const templates = PHASE_TEMPLATES[cefrLevel];
  const phases: PlanPhase[] = templates.map((template) => ({
    phase_number: template.phase,
    weeks_start: template.weeksStart,
    weeks_end: template.weeksEnd,
    title_en: template.titleEn,
    title_vi: template.titleVi,
    focus: focus,
    goals_en: template.goalsEn,
    goals_vi: template.goalsVi,
    sample_tasks: generateTasksForPhase(focus, cefrLevel, dailyMinutes),
    rooms_to_complete: template.roomsTarget,
  }));

  const totalRooms = phases.reduce((sum, p) => sum + p.rooms_to_complete, 0);
  const estimatedHours = Math.round((totalRooms * 10 + dailyMinutes * 90) / 60);

  return {
    id: `plan_${cefrLevel.toLowerCase()}_${Date.now()}`,
    created_at: new Date().toISOString(),
    cefr_level: cefrLevel,
    focus: focus,
    topics: topics,
    total_days: 90,
    phases: phases,
    estimated_rooms: totalRooms,
    estimated_hours: estimatedHours,
  };
}

/**
 * Get a summary of what the plan will include
 */
export function getPlanSummary(level: CEFRLevel, focus: FocusArea): {
  level_name_en: string;
  level_name_vi: string;
  focus_name_en: string;
  focus_name_vi: string;
  phase_count: number;
  estimated_rooms: number;
} {
  const levelInfo = CEFR_INFO[level];
  const focusInfo = FOCUS_INFO[focus];
  const templates = PHASE_TEMPLATES[level];
  const totalRooms = templates.reduce((sum, t) => sum + t.roomsTarget, 0);

  return {
    level_name_en: levelInfo.name_en,
    level_name_vi: levelInfo.name_vi,
    focus_name_en: focusInfo.name_en,
    focus_name_vi: focusInfo.name_vi,
    phase_count: templates.length,
    estimated_rooms: totalRooms,
  };
}
