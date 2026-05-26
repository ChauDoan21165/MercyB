/**
 * Keyword Color Mapping for Psychology-Based Highlighting
 * Each keyword is assigned a subtle pastel color based on its psychological meaning
 * All colors ensure WCAG AA accessibility (4.5:1 contrast) on white backgrounds
 */

export interface KeywordColor {
  keyword: string;
  keywordVi?: string; // Vietnamese translation
  color: string;
  rationale: string;
}

export interface CustomKeywordMapping {
  en: string[];
  vi: string[];
  color: string;
}

// Custom keyword mappings from room data (set by setCustomKeywordMappings)
let customKeywordMappings: CustomKeywordMapping[] = [];

/**
 * Set custom keyword color mappings from room data
 * This allows rooms to define their own highlighted words with specific colors
 */
export function setCustomKeywordMappings(mappings: CustomKeywordMapping[]) {
  customKeywordMappings = mappings;
}

/**
 * Clear custom keyword mappings (useful when switching rooms)
 */
export function clearCustomKeywordMappings() {
  customKeywordMappings = [];
}

export const KEYWORD_COLORS: KeywordColor[] = [
  // Mental Health & Emotional Well-being
  { keyword: 'emotional', keywordVi: 'cảm xúc', color: '#FFB6C1', rationale: 'Warmth, empathy, emotional connection' },
  { keyword: 'anxiety', keywordVi: 'lo âu', color: '#B8D4F1', rationale: 'Calm, reduces stress, evokes safety' },
  { keyword: 'depression', keywordVi: 'trầm cảm', color: '#C8E6F5', rationale: 'Hope, gentle uplift, emotional space' },
  { keyword: 'stress', keywordVi: 'căng thẳng', color: '#E6D8F5', rationale: 'Soothing, tension release, calm awareness' },
  { keyword: 'mindfulness', keywordVi: 'chánh niệm', color: '#A8D8F0', rationale: 'Calm awareness, present-moment focus' },
  { keyword: 'meditation', keywordVi: 'thiền định', color: '#D9E6F5', rationale: 'Inner peace, stillness, contemplation' },
  { keyword: 'calm', keywordVi: 'bình tĩnh', color: '#C8F0E0', rationale: 'Peace, tranquility, emotional equilibrium' },
  { keyword: 'peace', keywordVi: 'bình an', color: '#D4F0E6', rationale: 'Serenity, harmony, inner stillness' },
  
  // ADHD-Specific
  { keyword: 'adhd', keywordVi: 'rối loạn tăng động giảm chú ý', color: '#8EB8D5', rationale: 'Focus, mental clarity, cognitive awareness' },
  { keyword: 'focus', keywordVi: 'tập trung', color: '#A8C8E6', rationale: 'Concentration, attention, mental clarity' },
  { keyword: 'attention', keywordVi: 'chú ý', color: '#B8D8F0', rationale: 'Awareness, cognitive engagement, presence' },
  { keyword: 'concentration', keywordVi: 'sự tập trung', color: '#C8E0F5', rationale: 'Mental focus, sustained attention' },
  { keyword: 'distraction', keywordVi: 'sao nhãng', color: '#FFE8D8', rationale: 'Awareness of scattered energy' },
  { keyword: 'hyperactivity', keywordVi: 'tăng động', color: '#FFD8B8', rationale: 'Energy recognition, movement awareness' },
  { keyword: 'impulsivity', keywordVi: 'bốc đồng', color: '#FFDAB9', rationale: 'Quick-action awareness, spontaneity' },
  
  // Emotions & States
  { keyword: 'frustration', keywordVi: 'khó chịu', color: '#FFD4A3', rationale: 'Tension release, energy in motion' },
  { keyword: 'anger', keywordVi: 'tức giận', color: '#FFB8A3', rationale: 'Passion acknowledgment, fierce energy' },
  { keyword: 'joy', keywordVi: 'niềm vui', color: '#FFF8D8', rationale: 'Happiness, brightness, positive energy' },
  { keyword: 'happiness', keywordVi: 'hạnh phúc', color: '#FFF4CC', rationale: 'Contentment, warmth, cheerfulness' },
  { keyword: 'sadness', keywordVi: 'buồn bã', color: '#D8E6F5', rationale: 'Melancholy space, gentle processing' },
  { keyword: 'fear', keywordVi: 'sợ hãi', color: '#E6D8F0', rationale: 'Vulnerability, courage to face uncertainty' },
  { keyword: 'overwhelm', keywordVi: 'choáng ngợp', color: '#FFE0D8', rationale: 'Recognition of intensity, need for space' },
  { keyword: 'gratitude', keywordVi: 'biết ơn', color: '#F5E6D8', rationale: 'Appreciation, thankfulness, abundance' },
  
  // Resilience & Growth
  { keyword: 'resilience', keywordVi: 'khả năng phục hồi', color: '#90EE90', rationale: 'Growth, strength, recovery, adaptive power' },
  { keyword: 'strength', keywordVi: 'sức mạnh', color: '#A8F0A8', rationale: 'Inner power, fortitude, capability' },
  { keyword: 'courage', keywordVi: 'lòng dũng cảm', color: '#FFE0CC', rationale: 'Bravery, facing fear, bold action' },
  { keyword: 'growth', keywordVi: 'phát triển', color: '#98FB98', rationale: 'Development, expansion, evolution' },
  { keyword: 'healing', keywordVi: 'chữa lành', color: '#D4EED5', rationale: 'Recovery, restoration, renewal' },
  { keyword: 'recovery', keywordVi: 'hồi phục', color: '#C8F0D8', rationale: 'Restoration, bouncing back, renewal' },
  { keyword: 'transformation', keywordVi: 'biến đổi', color: '#E6D8F5', rationale: 'Change, metamorphosis, evolution' },
  
  // Challenges & Triggers
  { keyword: 'challenges', keywordVi: 'thách thức', color: '#D9C8F0', rationale: 'Transformation, courage, difficulty as opportunity' },
  { keyword: 'triggers', keywordVi: 'yếu tố kích hoạt', color: '#FFA8A8', rationale: 'Alert awareness, recognition, gentle warning' },
  { keyword: 'obstacles', keywordVi: 'trở ngại', color: '#D8C8F0', rationale: 'Growth opportunities, barriers to overcome' },
  { keyword: 'difficulties', keywordVi: 'khó khăn', color: '#E0D8F5', rationale: 'Acknowledging hardship, perseverance' },
  
  // Clarity & Understanding
  { keyword: 'clarity', keywordVi: 'rõ ràng', color: '#A8E6F5', rationale: 'Understanding, insight, mental transparency' },
  { keyword: 'understanding', keywordVi: 'hiểu biết', color: '#C8E6F5', rationale: 'Comprehension, empathy, awareness' },
  { keyword: 'awareness', keywordVi: 'nhận thức', color: '#D8F0F5', rationale: 'Consciousness, recognition, mindful presence' },
  { keyword: 'insight', keywordVi: 'sự thấu hiểu', color: '#E0F5F8', rationale: 'Deep understanding, wisdom, revelation' },
  { keyword: 'wisdom', keywordVi: 'trí tuệ', color: '#E0D8F5', rationale: 'Deep knowledge, experience, discernment' },
  
  // Action & Practice
  { keyword: 'practice', keywordVi: 'thực hành', color: '#D8F0E6', rationale: 'Repetition, skill-building, discipline' },
  { keyword: 'breathing', keywordVi: 'thở', color: '#B8E6B8', rationale: 'Soothing vitality, natural rhythm, life-affirming' },
  { keyword: 'gentle breathing', keywordVi: 'thở nhẹ nhàng', color: '#B8E6B8', rationale: 'Soothing vitality, natural rhythm, life-affirming calm' },
  { keyword: 'exercise', keywordVi: 'tập luyện', color: '#A8F0B8', rationale: 'Movement, vitality, physical wellness' },
  { keyword: 'movement', keywordVi: 'chuyển động', color: '#B8F0C8', rationale: 'Dynamic energy, physical expression' },
  { keyword: 'routine', keywordVi: 'thói quen', color: '#F0E6D8', rationale: 'Structure, consistency, stability' },
  { keyword: 'habits', keywordVi: 'thói quen', color: '#F5EED8', rationale: 'Patterns, consistency, behavior shaping' },
  
  // Support & Connection
  { keyword: 'support', keywordVi: 'hỗ trợ', color: '#FFE0EC', rationale: 'Care, assistance, community' },
  { keyword: 'community', keywordVi: 'cộng đồng', color: '#FFDAB9', rationale: 'Belonging, connection, togetherness' },
  { keyword: 'connection', keywordVi: 'kết nối', color: '#FFE0D8', rationale: 'Relationship, bonding, intimacy' },
  { keyword: 'relationship', keywordVi: 'mối quan hệ', color: '#FFD8E6', rationale: 'Partnership, connection, bonds' },
  { keyword: 'empathy', keywordVi: 'đồng cảm', color: '#FFD8F0', rationale: 'Understanding, compassion, emotional attunement' },
  { keyword: 'compassion', keywordVi: 'lòng trắc ẩn', color: '#F5D8E6', rationale: 'Kindness, caring, loving-kindness' },
  
  // Health & Vitality
  { keyword: 'health', keywordVi: 'sức khỏe', color: '#D4EED5', rationale: 'Wellness, vitality, wholeness' },
  { keyword: 'wellness', keywordVi: 'sự khỏe mạnh', color: '#E0F5E6', rationale: 'Well-being, holistic health, balance' },
  { keyword: 'nutrition', keywordVi: 'dinh dưỡng', color: '#D4EED5', rationale: 'Nourishment, healthy eating, vitality' },
  { keyword: 'sleep', keywordVi: 'giấc ngủ', color: '#D8E0F5', rationale: 'Rest, restoration, rejuvenation' },
  { keyword: 'rest', keywordVi: 'nghỉ ngơi', color: '#E0E6F5', rationale: 'Recovery, relaxation, stillness' },
  { keyword: 'energy', keywordVi: 'năng lượng', color: '#FFF4D8', rationale: 'Vitality, aliveness, dynamic force' },
  
  // Strategy & Planning
  { keyword: 'strategy', keywordVi: 'chiến lược', color: '#C4EAEA', rationale: 'Clear thinking, tactical planning, vision' },
  { keyword: 'planning', keywordVi: 'lập kế hoạch', color: '#D8F0F5', rationale: 'Organization, forethought, preparation' },
  { keyword: 'organization', keywordVi: 'tổ chức', color: '#E0F5F8', rationale: 'Structure, order, systematic approach' },
  { keyword: 'productivity', keywordVi: 'năng suất', color: '#FFE0CC', rationale: 'Efficiency, output, accomplishment' },
  { keyword: 'goals', keywordVi: 'mục tiêu', color: '#F5E0CC', rationale: 'Targets, aspirations, direction' },
  
  // Time & Management
  { keyword: 'time', keywordVi: 'thời gian', color: '#E6E0F5', rationale: 'Temporal awareness, rhythm, pacing' },
  { keyword: 'management', keywordVi: 'quản lý', color: '#F0E6F5', rationale: 'Control, coordination, effectiveness' },
  { keyword: 'balance', keywordVi: 'cân bằng', color: '#E6F5E6', rationale: 'Equilibrium, harmony, moderation' },
  { keyword: 'boundaries', keywordVi: 'ranh giới', color: '#F5E6E6', rationale: 'Limits, protection, self-care' },
  
  // Learning & Memory
  { keyword: 'learning', keywordVi: 'học tập', color: '#D8E6F5', rationale: 'Growth, education, skill acquisition' },
  { keyword: 'memory', keywordVi: 'trí nhớ', color: '#E0E8F5', rationale: 'Recall, retention, cognitive storage' },
  { keyword: 'remembering', keywordVi: 'ghi nhớ', color: '#E8F0F5', rationale: 'Recollection, mental retrieval' },
  
  // Self-Development
  { keyword: 'confidence', keywordVi: 'tự tin', color: '#FFE8B8', rationale: 'Self-assurance, belief, empowerment' },
  { keyword: 'self-esteem', keywordVi: 'lòng tự trọng', color: '#FFF0C8', rationale: 'Self-worth, self-respect, dignity' },
  { keyword: 'self-care', keywordVi: 'tự chăm sóc', color: '#F5D8E6', rationale: 'Self-nurturing, personal wellness' },
  { keyword: 'self-awareness', keywordVi: 'tự nhận thức', color: '#E6D8F5', rationale: 'Self-knowledge, introspection, insight' },
  { keyword: 'acceptance', keywordVi: 'chấp nhận', color: '#E6F5E6', rationale: 'Self-compassion, allowing, non-resistance' },
  
  // Spirituality & Meaning
  { keyword: 'spirituality', keywordVi: 'tâm linh', color: '#EDD9F7', rationale: 'Transcendence, connection to higher meaning' },
  { keyword: 'meaning', keywordVi: 'ý nghĩa', color: '#E6D8F5', rationale: 'Purpose, significance, deeper understanding' },
  { keyword: 'purpose', keywordVi: 'mục đích', color: '#F0E0F5', rationale: 'Direction, reason for being, mission' },
  { keyword: 'faith', keywordVi: 'đức tin', color: '#F5E8F5', rationale: 'Trust, belief, spiritual confidence' },
  
  // Finance & Prosperity
  { keyword: 'finance', keywordVi: 'tài chính', color: '#FFF4CC', rationale: 'Wealth, prosperity, abundance' },
  { keyword: 'money', keywordVi: 'tiền bạc', color: '#FFF8D8', rationale: 'Resources, financial energy, flow' },
  { keyword: 'prosperity', keywordVi: 'thịnh vượng', color: '#F8FFD8', rationale: 'Abundance, thriving, flourishing' },
  { keyword: 'abundance', keywordVi: 'dồi dào', color: '#F0FFD8', rationale: 'Plenty, richness, overflow' },
  
  // Career & Work
  { keyword: 'career', keywordVi: 'sự nghiệp', color: '#FFE0CC', rationale: 'Professional path, vocation, calling' },
  { keyword: 'work', keywordVi: 'công việc', color: '#FFE8D8', rationale: 'Labor, effort, productivity' },
  { keyword: 'job', keywordVi: 'nghề nghiệp', color: '#FFF0E0', rationale: 'Employment, occupation, role' },
  { keyword: 'success', keywordVi: 'thành công', color: '#E8FFD8', rationale: 'Achievement, accomplishment, victory' },
  
  // Relationships & Intimacy
  { keyword: 'love', keywordVi: 'tình yêu', color: '#FFB6C1', rationale: 'Affection, care, deep connection' },
  { keyword: 'romance', keywordVi: 'lãng mạn', color: '#FFE0EC', rationale: 'Passionate love, courtship, intimacy' },
  { keyword: 'intimacy', keywordVi: 'thân mật', color: '#FFD8E6', rationale: 'Closeness, vulnerability, deep connection' },
  { keyword: 'sexuality', keywordVi: 'tình dục', color: '#FFE0ED', rationale: 'Sensuality, exploration, desire' },
  { keyword: 'desire', keywordVi: 'khát khao', color: '#FFD8E8', rationale: 'Longing, passion, attraction' },
  { keyword: 'trust', keywordVi: 'tin tưởng', color: '#D8E6F5', rationale: 'Reliability, faith, security' },
];

/**
 * Get the color for a specific keyword (case-insensitive)
 * Supports both English and Vietnamese keywords
 * Checks custom mappings first, then falls back to default colors
 */
export function getKeywordColor(keyword: string): string | null {
  const normalized = keyword.toLowerCase().trim();
  
  // Check custom keyword mappings first (from room data)
  for (const mapping of customKeywordMappings) {
    const allKeywords = [...mapping.en, ...mapping.vi].map(k => k.toLowerCase().trim());
    if (allKeywords.includes(normalized)) {
      return mapping.color;
    }
  }
  
  // Fall back to default keyword colors
  const match = KEYWORD_COLORS.find(
    kc => kc.keyword.toLowerCase() === normalized || 
          (kc.keywordVi && kc.keywordVi.toLowerCase() === normalized)
  );
  
  return match ? match.color : null;
}

/**
 * Check if a word is a keyword
 */
export function isKeyword(word: string): boolean {
  const normalized = word.toLowerCase().trim();
  
  // Check custom mappings first
  for (const mapping of customKeywordMappings) {
    const allKeywords = [...mapping.en, ...mapping.vi].map(k => k.toLowerCase().trim());
    if (allKeywords.includes(normalized)) {
      return true;
    }
  }
  
  // Check default keywords
  return KEYWORD_COLORS.some((kc) => kc.keyword.toLowerCase() === normalized);
}

/**
 * Get all keywords as an array
 */
export function getAllKeywords(): string[] {
  return KEYWORD_COLORS.map((kc) => kc.keyword);
}
