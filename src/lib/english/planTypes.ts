/**
 * 90-Day English Plan Types
 * 
 * Core type definitions for the English learning roadmap generator.
 */

// ============================================
// CEFR LEVELS
// ============================================

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export const CEFR_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export interface CEFRLevelInfo {
  level: CEFRLevel;
  name_en: string;
  name_vi: string;
  description_en: string;
  description_vi: string;
}

export const CEFR_INFO: Record<CEFRLevel, CEFRLevelInfo> = {
  A1: {
    level: 'A1',
    name_en: 'Beginner',
    name_vi: 'Người mới bắt đầu',
    description_en: 'Basic phrases, simple vocabulary, fundamental sounds',
    description_vi: 'Cụm từ cơ bản, từ vựng đơn giản, âm thanh nền tảng',
  },
  A2: {
    level: 'A2',
    name_en: 'Elementary',
    name_vi: 'Sơ cấp',
    description_en: 'Everyday expressions, simple sentences, common situations',
    description_vi: 'Cách diễn đạt hàng ngày, câu đơn giản, tình huống thông thường',
  },
  B1: {
    level: 'B1',
    name_en: 'Intermediate',
    name_vi: 'Trung cấp',
    description_en: 'Main points of clear speech, travel situations, personal interests',
    description_vi: 'Ý chính của lời nói rõ ràng, tình huống du lịch, sở thích cá nhân',
  },
  B2: {
    level: 'B2',
    name_en: 'Upper Intermediate',
    name_vi: 'Trung cấp cao',
    description_en: 'Complex texts, spontaneous interaction, detailed explanations',
    description_vi: 'Văn bản phức tạp, tương tác tự phát, giải thích chi tiết',
  },
  C1: {
    level: 'C1',
    name_en: 'Advanced',
    name_vi: 'Nâng cao',
    description_en: 'Demanding texts, fluent expression, flexible language use',
    description_vi: 'Văn bản khó, diễn đạt lưu loát, sử dụng ngôn ngữ linh hoạt',
  },
};

// ============================================
// FOCUS AREAS
// ============================================

export type FocusArea = 'listening' | 'speaking' | 'reading' | 'mixed';

export interface FocusAreaInfo {
  focus: FocusArea;
  name_en: string;
  name_vi: string;
  activities_en: string[];
  activities_vi: string[];
}

export const FOCUS_INFO: Record<FocusArea, FocusAreaInfo> = {
  listening: {
    focus: 'listening',
    name_en: 'Listening Focus',
    name_vi: 'Tập trung Nghe',
    activities_en: ['Audio playback', 'Comprehension exercises', 'Dictation'],
    activities_vi: ['Phát lại âm thanh', 'Bài tập hiểu', 'Chính tả'],
  },
  speaking: {
    focus: 'speaking',
    name_en: 'Speaking Focus',
    name_vi: 'Tập trung Nói',
    activities_en: ['Shadow practice', 'Pronunciation drills', 'Repetition'],
    activities_vi: ['Luyện shadow', 'Bài tập phát âm', 'Lặp lại'],
  },
  reading: {
    focus: 'reading',
    name_en: 'Reading Focus',
    name_vi: 'Tập trung Đọc',
    activities_en: ['Room essays', 'Vocabulary building', 'Context learning'],
    activities_vi: ['Bài văn phòng', 'Xây dựng từ vựng', 'Học ngữ cảnh'],
  },
  mixed: {
    focus: 'mixed',
    name_en: 'Mixed Skills',
    name_vi: 'Kỹ năng Hỗn hợp',
    activities_en: ['All skill types', 'Balanced approach', 'Comprehensive'],
    activities_vi: ['Tất cả loại kỹ năng', 'Cách tiếp cận cân bằng', 'Toàn diện'],
  },
};

// ============================================
// DAILY TASK
// ============================================

export interface DailyTask {
  id: string;
  type: 'shadow' | 'listen' | 'read' | 'vocabulary' | 'pronunciation' | 'review';
  duration_minutes: number;
  description_en: string;
  description_vi: string;
  room_suggestion?: string; // Room ID if applicable
  topic?: string;
}

// ============================================
// PLAN PHASE
// ============================================

export interface PlanPhase {
  phase_number: number; // 1, 2, 3, etc.
  weeks_start: number; // e.g., 1
  weeks_end: number; // e.g., 2
  title_en: string;
  title_vi: string;
  focus: FocusArea;
  goals_en: string[];
  goals_vi: string[];
  sample_tasks: DailyTask[];
  rooms_to_complete: number; // Target rooms for this phase
}

// ============================================
// 90-DAY PLAN
// ============================================

export interface NinetyDayPlan {
  id: string;
  created_at: string;
  cefr_level: CEFRLevel;
  focus: FocusArea;
  topics: string[];
  total_days: 90;
  phases: PlanPhase[];
  estimated_rooms: number;
  estimated_hours: number;
  user_id?: string;
}

// ============================================
// PLAN GENERATION INPUT
// ============================================

export interface PlanGenerationInput {
  cefrLevel: CEFRLevel;
  focus: FocusArea;
  topics?: string[]; // Optional user interests
  dailyMinutes?: number; // Target daily study time, default 15
}

// ============================================
// ROOM DIFFICULTY INTERFACE (STUB)
// ============================================

/**
 * Interface for room difficulty assessment.
 * TODO: Implement actual difficulty engine based on room content.
 */
export interface RoomDifficulty {
  roomId: string;
  cefrLevel: CEFRLevel;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  estimated_minutes: number;
}

/**
 * Stub function to get room difficulty.
 * Replace with actual implementation when room tagging is complete.
 */
export function getRoomDifficulty(roomId: string): RoomDifficulty {
  // TODO: Implement actual difficulty assessment based on room content
  // For now, return a placeholder
  return {
    roomId,
    cefrLevel: 'A1',
    difficulty: 'medium',
    topics: [],
    estimated_minutes: 10,
  };
}
