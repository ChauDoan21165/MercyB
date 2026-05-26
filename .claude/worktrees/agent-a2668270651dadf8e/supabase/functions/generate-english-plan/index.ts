/**
 * Generate English Plan Edge Function
 * 
 * Simple endpoint to generate 90-day English learning plans.
 * 
 * POST /generate-english-plan
 * Body: { cefrLevel: 'A1'|'A2'|'B1'|'B2'|'C1', focus: 'listening'|'speaking'|'reading'|'mixed', topics?: string[], dailyMinutes?: number }
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================
// TYPES (duplicated from planTypes.ts for edge function)
// ============================================

type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
type FocusArea = 'listening' | 'speaking' | 'reading' | 'mixed';

interface DailyTask {
  id: string;
  type: string;
  duration_minutes: number;
  description_en: string;
  description_vi: string;
}

interface PlanPhase {
  phase_number: number;
  weeks_start: number;
  weeks_end: number;
  title_en: string;
  title_vi: string;
  focus: FocusArea;
  goals_en: string[];
  goals_vi: string[];
  sample_tasks: DailyTask[];
  rooms_to_complete: number;
}

interface NinetyDayPlan {
  id: string;
  created_at: string;
  cefr_level: CEFRLevel;
  focus: FocusArea;
  topics: string[];
  total_days: 90;
  phases: PlanPhase[];
  estimated_rooms: number;
  estimated_hours: number;
}

// ============================================
// PHASE TEMPLATES
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
    { phase: 1, weeksStart: 1, weeksEnd: 2, titleEn: 'Foundation: Sounds & Alphabet', titleVi: 'Nền tảng: Âm thanh & Bảng chữ cái', goalsEn: ['Master English sounds', 'Learn basic greetings'], goalsVi: ['Thành thạo âm tiếng Anh', 'Học lời chào cơ bản'], roomsTarget: 6 },
    { phase: 2, weeksStart: 3, weeksEnd: 4, titleEn: 'Core Words: Daily Life', titleVi: 'Từ vựng cốt lõi: Cuộc sống hàng ngày', goalsEn: ['100 essential words', 'Simple phrases'], goalsVi: ['100 từ thiết yếu', 'Cụm từ đơn giản'], roomsTarget: 8 },
    { phase: 3, weeksStart: 5, weeksEnd: 8, titleEn: 'First Sentences', titleVi: 'Những câu đầu tiên', goalsEn: ['Form simple sentences', 'Ask basic questions'], goalsVi: ['Tạo câu đơn giản', 'Hỏi câu cơ bản'], roomsTarget: 12 },
    { phase: 4, weeksStart: 9, weeksEnd: 13, titleEn: 'Confidence Building', titleVi: 'Xây dựng sự tự tin', goalsEn: ['Speak without hesitation', 'Complete A1'], goalsVi: ['Nói không do dự', 'Hoàn thành A1'], roomsTarget: 14 },
  ],
  A2: [
    { phase: 1, weeksStart: 1, weeksEnd: 3, titleEn: 'Everyday Conversations', titleVi: 'Hội thoại hàng ngày', goalsEn: ['Shopping phrases', 'Common situations'], goalsVi: ['Cụm từ mua sắm', 'Tình huống thường gặp'], roomsTarget: 10 },
    { phase: 2, weeksStart: 4, weeksEnd: 6, titleEn: 'Grammar Patterns', titleVi: 'Mẫu ngữ pháp', goalsEn: ['Past tense', 'Future plans'], goalsVi: ['Thì quá khứ', 'Kế hoạch tương lai'], roomsTarget: 10 },
    { phase: 3, weeksStart: 7, weeksEnd: 10, titleEn: 'Real-World Practice', titleVi: 'Thực hành thực tế', goalsEn: ['Travel scenarios', 'Social interactions'], goalsVi: ['Tình huống du lịch', 'Tương tác xã hội'], roomsTarget: 12 },
    { phase: 4, weeksStart: 11, weeksEnd: 13, titleEn: 'Fluency Foundation', titleVi: 'Nền tảng lưu loát', goalsEn: ['Speak naturally', 'Complete A2'], goalsVi: ['Nói tự nhiên', 'Hoàn thành A2'], roomsTarget: 10 },
  ],
  B1: [
    { phase: 1, weeksStart: 1, weeksEnd: 3, titleEn: 'Opinion & Discussion', titleVi: 'Ý kiến & Thảo luận', goalsEn: ['Express opinions', 'Give reasons'], goalsVi: ['Diễn đạt ý kiến', 'Đưa ra lý do'], roomsTarget: 10 },
    { phase: 2, weeksStart: 4, weeksEnd: 7, titleEn: 'Complex Structures', titleVi: 'Cấu trúc phức tạp', goalsEn: ['Conditional sentences', 'Passive voice'], goalsVi: ['Câu điều kiện', 'Câu bị động'], roomsTarget: 12 },
    { phase: 3, weeksStart: 8, weeksEnd: 10, titleEn: 'Professional English', titleVi: 'Tiếng Anh chuyên nghiệp', goalsEn: ['Meeting language', 'Presentations'], goalsVi: ['Ngôn ngữ họp', 'Thuyết trình'], roomsTarget: 10 },
    { phase: 4, weeksStart: 11, weeksEnd: 13, titleEn: 'Natural Expression', titleVi: 'Diễn đạt tự nhiên', goalsEn: ['Idioms and phrases', 'Complete B1'], goalsVi: ['Thành ngữ và cụm từ', 'Hoàn thành B1'], roomsTarget: 10 },
  ],
  B2: [
    { phase: 1, weeksStart: 1, weeksEnd: 3, titleEn: 'Abstract Discussion', titleVi: 'Thảo luận trừu tượng', goalsEn: ['Complex topics', 'Debate skills'], goalsVi: ['Chủ đề phức tạp', 'Kỹ năng tranh luận'], roomsTarget: 10 },
    { phase: 2, weeksStart: 4, weeksEnd: 7, titleEn: 'Nuanced Communication', titleVi: 'Giao tiếp tinh tế', goalsEn: ['Subtle meanings', 'Persuasive language'], goalsVi: ['Nghĩa tinh tế', 'Ngôn ngữ thuyết phục'], roomsTarget: 12 },
    { phase: 3, weeksStart: 8, weeksEnd: 10, titleEn: 'Academic & Formal', titleVi: 'Học thuật & Trang trọng', goalsEn: ['Academic vocabulary', 'Formal writing'], goalsVi: ['Từ vựng học thuật', 'Viết trang trọng'], roomsTarget: 10 },
    { phase: 4, weeksStart: 11, weeksEnd: 13, titleEn: 'Native-like Expression', titleVi: 'Diễn đạt như người bản xứ', goalsEn: ['Colloquialisms', 'Complete B2'], goalsVi: ['Cách nói thông tục', 'Hoàn thành B2'], roomsTarget: 10 },
  ],
  C1: [
    { phase: 1, weeksStart: 1, weeksEnd: 3, titleEn: 'Advanced Expression', titleVi: 'Diễn đạt nâng cao', goalsEn: ['Flexible language', 'Implicit meaning'], goalsVi: ['Ngôn ngữ linh hoạt', 'Nghĩa ngầm'], roomsTarget: 10 },
    { phase: 2, weeksStart: 4, weeksEnd: 7, titleEn: 'Professional Mastery', titleVi: 'Thành thạo chuyên nghiệp', goalsEn: ['Leadership language', 'Negotiation'], goalsVi: ['Ngôn ngữ lãnh đạo', 'Đàm phán'], roomsTarget: 12 },
    { phase: 3, weeksStart: 8, weeksEnd: 10, titleEn: 'Cultural Fluency', titleVi: 'Lưu loát văn hóa', goalsEn: ['Humor and irony', 'Literary language'], goalsVi: ['Hài hước và mỉa mai', 'Ngôn ngữ văn học'], roomsTarget: 10 },
    { phase: 4, weeksStart: 11, weeksEnd: 13, titleEn: 'Near-Native Polish', titleVi: 'Trau chuốt gần bản xứ', goalsEn: ['Subtle nuances', 'Complete C1'], goalsVi: ['Sắc thái tinh tế', 'Hoàn thành C1'], roomsTarget: 10 },
  ],
};

// ============================================
// TASK GENERATOR
// ============================================

function generateTasks(focus: FocusArea, level: CEFRLevel, dailyMinutes: number): DailyTask[] {
  const tasks: DailyTask[] = [];
  const id = (t: string) => `${level.toLowerCase()}_${t}_${Date.now()}`;

  if (focus === 'listening' || focus === 'mixed') {
    tasks.push({ id: id('listen'), type: 'listen', duration_minutes: Math.round(dailyMinutes * 0.4), description_en: 'Listen to audio without text', description_vi: 'Nghe âm thanh không nhìn văn bản' });
  }
  if (focus === 'speaking' || focus === 'mixed') {
    tasks.push({ id: id('shadow'), type: 'shadow', duration_minutes: Math.round(dailyMinutes * 0.3), description_en: 'Shadow practice', description_vi: 'Luyện shadow' });
  }
  if (focus === 'reading' || focus === 'mixed') {
    tasks.push({ id: id('read'), type: 'read', duration_minutes: Math.round(dailyMinutes * 0.3), description_en: 'Read and note vocabulary', description_vi: 'Đọc và ghi chú từ vựng' });
  }
  tasks.push({ id: id('review'), type: 'review', duration_minutes: Math.round(dailyMinutes * 0.1), description_en: 'Quick review', description_vi: 'Ôn nhanh' });

  return tasks;
}

// ============================================
// PLAN GENERATOR
// ============================================

function generatePlan(cefrLevel: CEFRLevel, focus: FocusArea, topics: string[], dailyMinutes: number): NinetyDayPlan {
  const templates = PHASE_TEMPLATES[cefrLevel];
  const phases: PlanPhase[] = templates.map((t) => ({
    phase_number: t.phase,
    weeks_start: t.weeksStart,
    weeks_end: t.weeksEnd,
    title_en: t.titleEn,
    title_vi: t.titleVi,
    focus,
    goals_en: t.goalsEn,
    goals_vi: t.goalsVi,
    sample_tasks: generateTasks(focus, cefrLevel, dailyMinutes),
    rooms_to_complete: t.roomsTarget,
  }));

  const totalRooms = phases.reduce((s, p) => s + p.rooms_to_complete, 0);
  const hours = Math.round((totalRooms * 10 + dailyMinutes * 90) / 60);

  return {
    id: `plan_${cefrLevel.toLowerCase()}_${Date.now()}`,
    created_at: new Date().toISOString(),
    cefr_level: cefrLevel,
    focus,
    topics,
    total_days: 90,
    phases,
    estimated_rooms: totalRooms,
    estimated_hours: hours,
  };
}

// ============================================
// HANDLER
// ============================================

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const cefrLevel = body.cefrLevel as CEFRLevel;
    const focus = (body.focus || 'mixed') as FocusArea;
    const topics = body.topics || [];
    const dailyMinutes = body.dailyMinutes || 15;

    // Validate level
    if (!['A1', 'A2', 'B1', 'B2', 'C1'].includes(cefrLevel)) {
      return new Response(JSON.stringify({ error: 'Invalid CEFR level' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate focus
    if (!['listening', 'speaking', 'reading', 'mixed'].includes(focus)) {
      return new Response(JSON.stringify({ error: 'Invalid focus area' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const plan = generatePlan(cefrLevel, focus, topics, dailyMinutes);

    console.log(`[generate-english-plan] Generated ${cefrLevel} ${focus} plan`);

    return new Response(JSON.stringify({ success: true, plan }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[generate-english-plan] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
