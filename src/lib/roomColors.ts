/**
 * Gentle, pastel color system for all rooms
 * Each category has thematic colors that are soft and readable
 */

export const ROOM_COLOR_THEMES = {
  // Mental Health & Well-being - Calm blues, soft purples
  mental_health: '#B8D4F1',
  anxiety: '#C9E4FF',
  depression: '#D4E4F7',
  stress: '#B5D6F0',
  burnout: '#A8C9E8',
  mindfulness: '#BDD9F2',
  ocd: '#C1D8F4',
  ptsd: '#B0D0EE',
  bipolar: '#C5DCEF',
  adhd: '#B3D1ED',
  shadow_work: '#D0DDEE',
  mens_mental_health: '#BAD5F0',
  
  // Relationships & Social - Soft pinks, warm peaches
  relationships: '#FFD4E5',
  soulmate: '#FFE0EC',
  loneliness: '#FDD5E3',
  social_anxiety: '#FFDCE8',
  relational_intelligence: '#FFD9E6',
  
  // Health & Body - Fresh greens, mint tones
  health: '#C8E6C9',
  nutrition: '#D4EED5',
  physical_fitness: '#C0E4C1',
  sleep: '#B8E0B9',
  weight_loss: '#CFE9D0',
  obesity: '#C4E6C5',
  eating_disorder: '#D0EBCD',
  trigger_point: '#BCE1BD',
  mental_sharpness: '#C5E7C6',
  
  // Finance & Wealth - Warm yellows, gentle golds
  finance: '#FFF4CC',
  finance_calm: '#FFEFC2',
  wealth_wisdom: '#FFF5D1',
  investing: '#FFF2C8',
  money_basics: '#FFF6D4',
  growing_money: '#FFF3CC',
  legacy_peace: '#FFF7D7',
  
  // Career & Growth - Energetic oranges, coral tones
  career: '#FFE0CC',
  courage_to_begin: '#FFD7BA',
  discover_self: '#FFE5D4',
  explore_world: '#FFD9C1',
  build_skills: '#FFDDC7',
  resilience: '#FFE2CF',
  career_community: '#FFDBC4',
  launch_career: '#FFE4D2',
  grow_wealth: '#FFD5B8',
  
  // Spirituality & Meaning - Soft lavenders, light purples
  spirituality: '#E8D4F5',
  meaning_of_life: '#EDD9F7',
  finding_peace: '#E5D0F3',
  god_with_us: '#EAD6F6',
  philosophy: '#E7D3F4',
  stoicism: '#EBDAF7',
  
  // Sexuality & Intimacy - Gentle rose, warm blush
  sexuality: '#FFD9E8',
  sexuality_curiosity: '#FFE0ED',
  sacred_body: '#FFD6E4',
  erotic_wisdom: '#FFDCE9',
  diverse_desires: '#FFD8E6',
  
  // Productivity & Focus - Light teals, soft aquas
  productivity: '#B8E6E6',
  focus: '#C4EAEA',
  confidence: '#BADFDF',
  strategy: '#C0E8E8',
  
  // Addiction & Recovery - Calming sage, soft grey-greens
  addiction: '#D5E8D5',
  grief: '#D9EBDB',
  
  // Self-Development - Warm peach-pink
  self_love: '#FFE5D9',
  confidence_building: '#FFE0D4',
  
  // Default fallback
  default: '#E8F0F2'
};

/**
 * Maps room slugs/IDs to color categories
 */
export const getRoomColor = (roomId: string, roomCategory?: string): string => {
  const normalizedId = roomId.toLowerCase().replace(/[_\s-]/g, '');
  
  // Direct matches
  if (normalizedId.includes('anxiety')) return ROOM_COLOR_THEMES.anxiety;
  if (normalizedId.includes('depression')) return ROOM_COLOR_THEMES.depression;
  if (normalizedId.includes('stress')) return ROOM_COLOR_THEMES.stress;
  if (normalizedId.includes('burnout')) return ROOM_COLOR_THEMES.burnout;
  if (normalizedId.includes('mindful')) return ROOM_COLOR_THEMES.mindfulness;
  if (normalizedId.includes('ocd')) return ROOM_COLOR_THEMES.ocd;
  if (normalizedId.includes('ptsd')) return ROOM_COLOR_THEMES.ptsd;
  if (normalizedId.includes('bipolar')) return ROOM_COLOR_THEMES.bipolar;
  if (normalizedId.includes('adhd')) return ROOM_COLOR_THEMES.adhd;
  if (normalizedId.includes('shadow')) return ROOM_COLOR_THEMES.shadow_work;
  if (normalizedId.includes('mens') && normalizedId.includes('mental')) return ROOM_COLOR_THEMES.mens_mental_health;
  
  // Relationships
  if (normalizedId.includes('soulmate')) return ROOM_COLOR_THEMES.soulmate;
  if (normalizedId.includes('loneliness')) return ROOM_COLOR_THEMES.loneliness;
  if (normalizedId.includes('social') && normalizedId.includes('anxiety')) return ROOM_COLOR_THEMES.social_anxiety;
  if (normalizedId.includes('relational')) return ROOM_COLOR_THEMES.relational_intelligence;
  if (normalizedId.includes('relationship')) return ROOM_COLOR_THEMES.relationships;
  
  // Health
  if (normalizedId.includes('nutrition')) return ROOM_COLOR_THEMES.nutrition;
  if (normalizedId.includes('physical') || normalizedId.includes('fitness')) return ROOM_COLOR_THEMES.physical_fitness;
  if (normalizedId.includes('sleep')) return ROOM_COLOR_THEMES.sleep;
  if (normalizedId.includes('weight')) return ROOM_COLOR_THEMES.weight_loss;
  if (normalizedId.includes('obesity')) return ROOM_COLOR_THEMES.obesity;
  if (normalizedId.includes('eating') && normalizedId.includes('disorder')) return ROOM_COLOR_THEMES.eating_disorder;
  if (normalizedId.includes('trigger')) return ROOM_COLOR_THEMES.trigger_point;
  if (normalizedId.includes('sharpness')) return ROOM_COLOR_THEMES.mental_sharpness;
  if (normalizedId.includes('health')) return ROOM_COLOR_THEMES.health;
  
  // Finance
  if (normalizedId.includes('finance')) return ROOM_COLOR_THEMES.finance_calm;
  if (normalizedId.includes('wealth')) return ROOM_COLOR_THEMES.wealth_wisdom;
  if (normalizedId.includes('invest')) return ROOM_COLOR_THEMES.investing;
  if (normalizedId.includes('money')) return ROOM_COLOR_THEMES.money_basics;
  if (normalizedId.includes('legacy')) return ROOM_COLOR_THEMES.legacy_peace;
  
  // Career
  if (normalizedId.includes('courage')) return ROOM_COLOR_THEMES.courage_to_begin;
  if (normalizedId.includes('discover') && normalizedId.includes('self')) return ROOM_COLOR_THEMES.discover_self;
  if (normalizedId.includes('explore') && normalizedId.includes('world')) return ROOM_COLOR_THEMES.explore_world;
  if (normalizedId.includes('build') && normalizedId.includes('skill')) return ROOM_COLOR_THEMES.build_skills;
  if (normalizedId.includes('resilience')) return ROOM_COLOR_THEMES.resilience;
  if (normalizedId.includes('career') && normalizedId.includes('community')) return ROOM_COLOR_THEMES.career_community;
  if (normalizedId.includes('launch')) return ROOM_COLOR_THEMES.launch_career;
  if (normalizedId.includes('grow') && normalizedId.includes('wealth')) return ROOM_COLOR_THEMES.grow_wealth;
  if (normalizedId.includes('career')) return ROOM_COLOR_THEMES.career;
  
  // Spirituality
  if (normalizedId.includes('meaning')) return ROOM_COLOR_THEMES.meaning_of_life;
  if (normalizedId.includes('peace') || normalizedId.includes('god')) return ROOM_COLOR_THEMES.finding_peace;
  if (normalizedId.includes('philosophy')) return ROOM_COLOR_THEMES.philosophy;
  if (normalizedId.includes('stoicism')) return ROOM_COLOR_THEMES.stoicism;
  
  // Sexuality
  if (normalizedId.includes('sexuality') || normalizedId.includes('sexual')) return ROOM_COLOR_THEMES.sexuality_curiosity;
  if (normalizedId.includes('sacred') && normalizedId.includes('body')) return ROOM_COLOR_THEMES.sacred_body;
  if (normalizedId.includes('erotic')) return ROOM_COLOR_THEMES.erotic_wisdom;
  if (normalizedId.includes('diverse') && normalizedId.includes('desire')) return ROOM_COLOR_THEMES.diverse_desires;
  
  // Productivity
  if (normalizedId.includes('productivity')) return ROOM_COLOR_THEMES.productivity;
  if (normalizedId.includes('focus')) return ROOM_COLOR_THEMES.focus;
  if (normalizedId.includes('confidence')) return ROOM_COLOR_THEMES.confidence_building;
  if (normalizedId.includes('strategy')) return ROOM_COLOR_THEMES.strategy;
  
  // Addiction & Recovery
  if (normalizedId.includes('addiction')) return ROOM_COLOR_THEMES.addiction;
  if (normalizedId.includes('grief')) return ROOM_COLOR_THEMES.grief;
  
  // Self-Development
  if (normalizedId.includes('selflove') || normalizedId.includes('self') && normalizedId.includes('love')) return ROOM_COLOR_THEMES.self_love;
  
  return ROOM_COLOR_THEMES.default;
};

/**
 * Get text color that contrasts well with the background
 * Returns dark text for light backgrounds
 */
export const getContrastTextColor = (backgroundColor: string): string => {
  // For our gentle pastel palette, dark text works best
  return 'rgba(0, 0, 0, 0.85)';
};

/**
 * Get a slightly darker shade for headings
 */
export const getHeadingColor = (backgroundColor: string): string => {
  return 'rgba(0, 0, 0, 0.90)';
};
