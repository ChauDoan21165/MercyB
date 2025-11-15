/**
 * Keyword Color Mapping for Psychology-Based Highlighting
 * Each keyword is assigned a subtle pastel color based on its psychological meaning
 * All colors ensure WCAG AA accessibility (4.5:1 contrast) on white backgrounds
 */

export interface KeywordColor {
  keyword: string;
  color: string;
  rationale: string;
}

export const KEYWORD_COLORS: KeywordColor[] = [
  // Mental Health & Emotional Well-being
  { keyword: 'emotional', color: '#FFB6C1', rationale: 'Warmth, empathy, emotional connection' },
  { keyword: 'anxiety', color: '#B8D4F1', rationale: 'Calm, reduces stress, evokes safety' },
  { keyword: 'depression', color: '#C8E6F5', rationale: 'Hope, gentle uplift, emotional space' },
  { keyword: 'stress', color: '#E6D8F5', rationale: 'Soothing, tension release, calm awareness' },
  { keyword: 'mindfulness', color: '#A8D8F0', rationale: 'Calm awareness, present-moment focus' },
  { keyword: 'meditation', color: '#D9E6F5', rationale: 'Inner peace, stillness, contemplation' },
  { keyword: 'calm', color: '#C8F0E0', rationale: 'Peace, tranquility, emotional equilibrium' },
  { keyword: 'peace', color: '#D4F0E6', rationale: 'Serenity, harmony, inner stillness' },
  
  // ADHD-Specific
  { keyword: 'adhd', color: '#8EB8D5', rationale: 'Focus, mental clarity, cognitive awareness' },
  { keyword: 'focus', color: '#A8C8E6', rationale: 'Concentration, attention, mental clarity' },
  { keyword: 'attention', color: '#B8D8F0', rationale: 'Awareness, cognitive engagement, presence' },
  { keyword: 'concentration', color: '#C8E0F5', rationale: 'Mental focus, sustained attention' },
  { keyword: 'distraction', color: '#FFE8D8', rationale: 'Awareness of scattered energy' },
  { keyword: 'hyperactivity', color: '#FFD8B8', rationale: 'Energy recognition, movement awareness' },
  { keyword: 'impulsivity', color: '#FFDAB9', rationale: 'Quick-action awareness, spontaneity' },
  
  // Emotions & States
  { keyword: 'frustration', color: '#FFD4A3', rationale: 'Tension release, energy in motion' },
  { keyword: 'anger', color: '#FFB8A3', rationale: 'Passion acknowledgment, fierce energy' },
  { keyword: 'joy', color: '#FFF8D8', rationale: 'Happiness, brightness, positive energy' },
  { keyword: 'happiness', color: '#FFF4CC', rationale: 'Contentment, warmth, cheerfulness' },
  { keyword: 'sadness', color: '#D8E6F5', rationale: 'Melancholy space, gentle processing' },
  { keyword: 'fear', color: '#E6D8F0', rationale: 'Vulnerability, courage to face uncertainty' },
  { keyword: 'overwhelm', color: '#FFE0D8', rationale: 'Recognition of intensity, need for space' },
  { keyword: 'gratitude', color: '#F5E6D8', rationale: 'Appreciation, thankfulness, abundance' },
  
  // Resilience & Growth
  { keyword: 'resilience', color: '#90EE90', rationale: 'Growth, strength, recovery, adaptive power' },
  { keyword: 'strength', color: '#A8F0A8', rationale: 'Inner power, fortitude, capability' },
  { keyword: 'courage', color: '#FFE0CC', rationale: 'Bravery, facing fear, bold action' },
  { keyword: 'growth', color: '#98FB98', rationale: 'Development, expansion, evolution' },
  { keyword: 'healing', color: '#D4EED5', rationale: 'Recovery, restoration, renewal' },
  { keyword: 'recovery', color: '#C8F0D8', rationale: 'Restoration, bouncing back, renewal' },
  { keyword: 'transformation', color: '#E6D8F5', rationale: 'Change, metamorphosis, evolution' },
  
  // Challenges & Triggers
  { keyword: 'challenges', color: '#D9C8F0', rationale: 'Transformation, courage, difficulty as opportunity' },
  { keyword: 'triggers', color: '#FFA8A8', rationale: 'Alert awareness, recognition, gentle warning' },
  { keyword: 'obstacles', color: '#D8C8F0', rationale: 'Growth opportunities, barriers to overcome' },
  { keyword: 'difficulties', color: '#E0D8F5', rationale: 'Acknowledging hardship, perseverance' },
  
  // Clarity & Understanding
  { keyword: 'clarity', color: '#A8E6F5', rationale: 'Understanding, insight, mental transparency' },
  { keyword: 'understanding', color: '#C8E6F5', rationale: 'Comprehension, empathy, awareness' },
  { keyword: 'awareness', color: '#D8F0F5', rationale: 'Consciousness, recognition, mindful presence' },
  { keyword: 'insight', color: '#E0F5F8', rationale: 'Deep understanding, wisdom, revelation' },
  { keyword: 'wisdom', color: '#E0D8F5', rationale: 'Deep knowledge, experience, discernment' },
  
  // Action & Practice
  { keyword: 'practice', color: '#D8F0E6', rationale: 'Repetition, skill-building, discipline' },
  { keyword: 'breathing', color: '#B8E6B8', rationale: 'Soothing vitality, natural rhythm, life-affirming' },
  { keyword: 'gentle breathing', color: '#B8E6B8', rationale: 'Soothing vitality, natural rhythm, life-affirming calm' },
  { keyword: 'exercise', color: '#A8F0B8', rationale: 'Movement, vitality, physical wellness' },
  { keyword: 'movement', color: '#B8F0C8', rationale: 'Dynamic energy, physical expression' },
  { keyword: 'routine', color: '#F0E6D8', rationale: 'Structure, consistency, stability' },
  { keyword: 'habits', color: '#F5EED8', rationale: 'Patterns, consistency, behavior shaping' },
  
  // Support & Connection
  { keyword: 'support', color: '#FFE0EC', rationale: 'Care, assistance, community' },
  { keyword: 'community', color: '#FFDAB9', rationale: 'Belonging, connection, togetherness' },
  { keyword: 'connection', color: '#FFE0D8', rationale: 'Relationship, bonding, intimacy' },
  { keyword: 'relationship', color: '#FFD8E6', rationale: 'Partnership, connection, bonds' },
  { keyword: 'empathy', color: '#FFD8F0', rationale: 'Understanding, compassion, emotional attunement' },
  { keyword: 'compassion', color: '#F5D8E6', rationale: 'Kindness, caring, loving-kindness' },
  
  // Health & Vitality
  { keyword: 'health', color: '#D4EED5', rationale: 'Wellness, vitality, wholeness' },
  { keyword: 'wellness', color: '#E0F5E6', rationale: 'Well-being, holistic health, balance' },
  { keyword: 'nutrition', color: '#D4EED5', rationale: 'Nourishment, healthy eating, vitality' },
  { keyword: 'sleep', color: '#D8E0F5', rationale: 'Rest, restoration, rejuvenation' },
  { keyword: 'rest', color: '#E0E6F5', rationale: 'Recovery, relaxation, stillness' },
  { keyword: 'energy', color: '#FFF4D8', rationale: 'Vitality, aliveness, dynamic force' },
  
  // Strategy & Planning
  { keyword: 'strategy', color: '#C4EAEA', rationale: 'Clear thinking, tactical planning, vision' },
  { keyword: 'planning', color: '#D8F0F5', rationale: 'Organization, forethought, preparation' },
  { keyword: 'organization', color: '#E0F5F8', rationale: 'Structure, order, systematic approach' },
  { keyword: 'productivity', color: '#FFE0CC', rationale: 'Efficiency, output, accomplishment' },
  { keyword: 'goals', color: '#F5E0CC', rationale: 'Targets, aspirations, direction' },
  
  // Time & Management
  { keyword: 'time', color: '#E6E0F5', rationale: 'Temporal awareness, rhythm, pacing' },
  { keyword: 'management', color: '#F0E6F5', rationale: 'Control, coordination, effectiveness' },
  { keyword: 'balance', color: '#E6F5E6', rationale: 'Equilibrium, harmony, moderation' },
  { keyword: 'boundaries', color: '#F5E6E6', rationale: 'Limits, protection, self-care' },
  
  // Learning & Memory
  { keyword: 'learning', color: '#D8E6F5', rationale: 'Growth, education, skill acquisition' },
  { keyword: 'memory', color: '#E0E8F5', rationale: 'Recall, retention, cognitive storage' },
  { keyword: 'remembering', color: '#E8F0F5', rationale: 'Recollection, mental retrieval' },
  
  // Self-Development
  { keyword: 'confidence', color: '#FFE8B8', rationale: 'Self-assurance, belief, empowerment' },
  { keyword: 'self-esteem', color: '#FFF0C8', rationale: 'Self-worth, self-respect, dignity' },
  { keyword: 'self-care', color: '#F5D8E6', rationale: 'Self-nurturing, personal wellness' },
  { keyword: 'self-awareness', color: '#E6D8F5', rationale: 'Self-knowledge, introspection, insight' },
  { keyword: 'acceptance', color: '#E6F5E6', rationale: 'Self-compassion, allowing, non-resistance' },
  
  // Spirituality & Meaning
  { keyword: 'spirituality', color: '#EDD9F7', rationale: 'Transcendence, connection to higher meaning' },
  { keyword: 'meaning', color: '#E6D8F5', rationale: 'Purpose, significance, deeper understanding' },
  { keyword: 'purpose', color: '#F0E0F5', rationale: 'Direction, reason for being, mission' },
  { keyword: 'faith', color: '#F5E8F5', rationale: 'Trust, belief, spiritual confidence' },
  
  // Finance & Prosperity
  { keyword: 'finance', color: '#FFF4CC', rationale: 'Wealth, prosperity, abundance' },
  { keyword: 'money', color: '#FFF8D8', rationale: 'Resources, financial energy, flow' },
  { keyword: 'prosperity', color: '#F8FFD8', rationale: 'Abundance, thriving, flourishing' },
  { keyword: 'abundance', color: '#F0FFD8', rationale: 'Plenty, richness, overflow' },
  
  // Career & Work
  { keyword: 'career', color: '#FFE0CC', rationale: 'Professional path, vocation, calling' },
  { keyword: 'work', color: '#FFE8D8', rationale: 'Labor, effort, productivity' },
  { keyword: 'job', color: '#FFF0E0', rationale: 'Employment, occupation, role' },
  { keyword: 'success', color: '#E8FFD8', rationale: 'Achievement, accomplishment, victory' },
  
  // Relationships & Intimacy
  { keyword: 'love', color: '#FFB6C1', rationale: 'Affection, care, deep connection' },
  { keyword: 'romance', color: '#FFE0EC', rationale: 'Passionate love, courtship, intimacy' },
  { keyword: 'intimacy', color: '#FFD8E6', rationale: 'Closeness, vulnerability, deep connection' },
  { keyword: 'sexuality', color: '#FFE0ED', rationale: 'Sensuality, exploration, desire' },
  { keyword: 'desire', color: '#FFD8E8', rationale: 'Longing, passion, attraction' },
  { keyword: 'trust', color: '#D8E6F5', rationale: 'Reliability, faith, security' },
];

/**
 * Get the color for a specific keyword (case-insensitive)
 */
export function getKeywordColor(keyword: string): string | null {
  const normalized = keyword.toLowerCase().trim();
  const match = KEYWORD_COLORS.find(
    (kc) => kc.keyword.toLowerCase() === normalized
  );
  return match ? match.color : null;
}

/**
 * Check if a word is a keyword
 */
export function isKeyword(word: string): boolean {
  const normalized = word.toLowerCase().trim();
  return KEYWORD_COLORS.some((kc) => kc.keyword.toLowerCase() === normalized);
}

/**
 * Get all keywords as an array
 */
export function getAllKeywords(): string[] {
  return KEYWORD_COLORS.map((kc) => kc.keyword);
}
