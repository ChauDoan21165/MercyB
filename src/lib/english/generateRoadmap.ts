/**
 * English Roadmap Generator
 * 
 * Generates milestone-based roadmaps for CEFR level progression.
 */

import type { CEFRLevel } from './planTypes';

// ============================================
// TYPES
// ============================================

export interface RoadmapMilestone {
  id: string;
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi: string;
  skills_en: string[];
  skills_vi: string[];
  estimated_weeks: number;
}

export interface EnglishRoadmap {
  id: string;
  created_at: string;
  current_cefr: CEFRLevel;
  target_cefr: CEFRLevel;
  milestones: RoadmapMilestone[];
  total_weeks: number;
}

export interface RoadmapInput {
  currentCEFR: CEFRLevel;
  targetCEFR: CEFRLevel;
}

// ============================================
// MILESTONE TEMPLATES
// ============================================

const LEVEL_TRANSITIONS: Record<string, RoadmapMilestone[]> = {
  'A1_A2': [
    {
      id: 'a1_a2_m1',
      title_en: 'Basic Comprehension',
      title_vi: 'Hiểu biết cơ bản',
      description_en: 'Understand simple, everyday expressions and phrases.',
      description_vi: 'Hiểu các cụm từ và biểu đạt đơn giản hàng ngày.',
      skills_en: ['Greetings', 'Numbers', 'Basic questions', 'Self-introduction'],
      skills_vi: ['Lời chào', 'Số đếm', 'Câu hỏi cơ bản', 'Giới thiệu bản thân'],
      estimated_weeks: 4,
    },
    {
      id: 'a1_a2_m2',
      title_en: 'Simple Conversations',
      title_vi: 'Hội thoại đơn giản',
      description_en: 'Handle simple, routine exchanges on familiar topics.',
      description_vi: 'Xử lý các trao đổi đơn giản, thường ngày về chủ đề quen thuộc.',
      skills_en: ['Shopping phrases', 'Ordering food', 'Asking directions', 'Daily routines'],
      skills_vi: ['Cụm từ mua sắm', 'Gọi đồ ăn', 'Hỏi đường', 'Thói quen hàng ngày'],
      estimated_weeks: 4,
    },
    {
      id: 'a1_a2_m3',
      title_en: 'A2 Confirmation',
      title_vi: 'Xác nhận A2',
      description_en: 'Demonstrate elementary-level proficiency.',
      description_vi: 'Thể hiện trình độ sơ cấp.',
      skills_en: ['Past tense basics', 'Future plans', 'Describe people/places'],
      skills_vi: ['Thì quá khứ cơ bản', 'Kế hoạch tương lai', 'Mô tả người/địa điểm'],
      estimated_weeks: 4,
    },
  ],
  'A2_B1': [
    {
      id: 'a2_b1_m1',
      title_en: 'Slow Podcasts & Audio',
      title_vi: 'Podcast & Audio chậm',
      description_en: 'Understand main points of clear, slow speech on familiar topics.',
      description_vi: 'Hiểu ý chính của lời nói rõ ràng, chậm về chủ đề quen thuộc.',
      skills_en: ['Podcast listening', 'Note-taking', 'Summarizing content'],
      skills_vi: ['Nghe podcast', 'Ghi chú', 'Tóm tắt nội dung'],
      estimated_weeks: 4,
    },
    {
      id: 'a2_b1_m2',
      title_en: 'Express Opinions',
      title_vi: 'Diễn đạt ý kiến',
      description_en: 'Give reasons for opinions and explain plans.',
      description_vi: 'Đưa ra lý do cho ý kiến và giải thích kế hoạch.',
      skills_en: ['Opinion phrases', 'Agreeing/Disagreeing', 'Explaining why'],
      skills_vi: ['Cụm từ ý kiến', 'Đồng ý/Không đồng ý', 'Giải thích lý do'],
      estimated_weeks: 4,
    },
    {
      id: 'a2_b1_m3',
      title_en: 'B1 Confirmation',
      title_vi: 'Xác nhận B1',
      description_en: 'Handle most travel situations and describe experiences.',
      description_vi: 'Xử lý hầu hết tình huống du lịch và mô tả trải nghiệm.',
      skills_en: ['Travel language', 'Storytelling', 'Conditional sentences'],
      skills_vi: ['Ngôn ngữ du lịch', 'Kể chuyện', 'Câu điều kiện'],
      estimated_weeks: 4,
    },
  ],
  'B1_B2': [
    {
      id: 'b1_b2_m1',
      title_en: 'YouTube with Subtitles',
      title_vi: 'YouTube có phụ đề',
      description_en: 'Understand extended speech and lectures on familiar topics.',
      description_vi: 'Hiểu bài nói và bài giảng dài về chủ đề quen thuộc.',
      skills_en: ['Video comprehension', 'Vocabulary from context', 'Following arguments'],
      skills_vi: ['Hiểu video', 'Từ vựng từ ngữ cảnh', 'Theo dõi lập luận'],
      estimated_weeks: 5,
    },
    {
      id: 'b1_b2_m2',
      title_en: 'Spontaneous Interaction',
      title_vi: 'Tương tác tự phát',
      description_en: 'Interact with native speakers with reasonable fluency.',
      description_vi: 'Tương tác với người bản xứ với sự lưu loát hợp lý.',
      skills_en: ['Natural responses', 'Filler phrases', 'Asking for clarification'],
      skills_vi: ['Phản hồi tự nhiên', 'Cụm từ lấp đầy', 'Yêu cầu làm rõ'],
      estimated_weeks: 5,
    },
    {
      id: 'b1_b2_m3',
      title_en: 'B2 Confirmation',
      title_vi: 'Xác nhận B2',
      description_en: 'Produce clear, detailed text on various subjects.',
      description_vi: 'Tạo văn bản rõ ràng, chi tiết về nhiều chủ đề.',
      skills_en: ['Essay writing', 'Debate skills', 'Complex grammar'],
      skills_vi: ['Viết luận', 'Kỹ năng tranh luận', 'Ngữ pháp phức tạp'],
      estimated_weeks: 5,
    },
  ],
  'B2_C1': [
    {
      id: 'b2_c1_m1',
      title_en: 'Fluent Conversation',
      title_vi: 'Hội thoại lưu loát',
      description_en: 'Express ideas fluently and spontaneously without searching for words.',
      description_vi: 'Diễn đạt ý tưởng lưu loát và tự phát không cần tìm từ.',
      skills_en: ['Idiomatic expressions', 'Cultural references', 'Humor in English'],
      skills_vi: ['Thành ngữ', 'Tham chiếu văn hóa', 'Hài hước bằng tiếng Anh'],
      estimated_weeks: 6,
    },
    {
      id: 'b2_c1_m2',
      title_en: 'Academic & Professional',
      title_vi: 'Học thuật & Chuyên nghiệp',
      description_en: 'Use language flexibly for social, academic, and professional purposes.',
      description_vi: 'Sử dụng ngôn ngữ linh hoạt cho mục đích xã hội, học thuật và chuyên nghiệp.',
      skills_en: ['Academic writing', 'Presentations', 'Negotiation'],
      skills_vi: ['Viết học thuật', 'Thuyết trình', 'Đàm phán'],
      estimated_weeks: 6,
    },
    {
      id: 'b2_c1_m3',
      title_en: 'C1 Confirmation',
      title_vi: 'Xác nhận C1',
      description_en: 'Understand demanding, longer texts and implicit meaning.',
      description_vi: 'Hiểu văn bản khó, dài và nghĩa ngầm.',
      skills_en: ['Literary analysis', 'Subtle nuances', 'Regional variations'],
      skills_vi: ['Phân tích văn học', 'Sắc thái tinh tế', 'Biến thể vùng miền'],
      estimated_weeks: 6,
    },
  ],
};

// ============================================
// MAIN GENERATOR
// ============================================

const CEFR_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

/**
 * Generate an English roadmap from current to target CEFR level.
 */
export function generateEnglishRoadmap(input: RoadmapInput): EnglishRoadmap {
  const { currentCEFR, targetCEFR } = input;

  const currentIdx = CEFR_ORDER.indexOf(currentCEFR);
  const targetIdx = CEFR_ORDER.indexOf(targetCEFR);

  if (currentIdx === -1 || targetIdx === -1 || currentIdx >= targetIdx) {
    // Invalid input: return empty roadmap
    return {
      id: `roadmap_${Date.now()}`,
      created_at: new Date().toISOString(),
      current_cefr: currentCEFR,
      target_cefr: targetCEFR,
      milestones: [],
      total_weeks: 0,
    };
  }

  // Collect milestones for each level transition
  const milestones: RoadmapMilestone[] = [];
  for (let i = currentIdx; i < targetIdx; i++) {
    const from = CEFR_ORDER[i];
    const to = CEFR_ORDER[i + 1];
    const key = `${from}_${to}`;
    const transitionMilestones = LEVEL_TRANSITIONS[key] || [];
    milestones.push(...transitionMilestones);
  }

  const totalWeeks = milestones.reduce((sum, m) => sum + m.estimated_weeks, 0);

  return {
    id: `roadmap_${currentCEFR}_${targetCEFR}_${Date.now()}`,
    created_at: new Date().toISOString(),
    current_cefr: currentCEFR,
    target_cefr: targetCEFR,
    milestones,
    total_weeks: totalWeeks,
  };
}

/**
 * Get a summary of roadmap between two levels
 */
export function getRoadmapSummary(currentCEFR: CEFRLevel, targetCEFR: CEFRLevel): {
  milestones_count: number;
  total_weeks: number;
  level_transitions: string[];
} {
  const currentIdx = CEFR_ORDER.indexOf(currentCEFR);
  const targetIdx = CEFR_ORDER.indexOf(targetCEFR);

  if (currentIdx === -1 || targetIdx === -1 || currentIdx >= targetIdx) {
    return { milestones_count: 0, total_weeks: 0, level_transitions: [] };
  }

  const transitions: string[] = [];
  let totalMilestones = 0;
  let totalWeeks = 0;

  for (let i = currentIdx; i < targetIdx; i++) {
    const from = CEFR_ORDER[i];
    const to = CEFR_ORDER[i + 1];
    transitions.push(`${from} → ${to}`);
    const key = `${from}_${to}`;
    const milestones = LEVEL_TRANSITIONS[key] || [];
    totalMilestones += milestones.length;
    totalWeeks += milestones.reduce((sum, m) => sum + m.estimated_weeks, 0);
  }

  return {
    milestones_count: totalMilestones,
    total_weeks: totalWeeks,
    level_transitions: transitions,
  };
}
