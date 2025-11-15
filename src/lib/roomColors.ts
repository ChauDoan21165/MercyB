/**
 * Color Psychology-Based Palette for Mercy Blade
 * 
 * Each color is carefully selected based on psychological research:
 * - Blues: Calm, trust, mental clarity (mental health, focus)
 * - Pinks/Peaches: Warmth, connection, romance (relationships, intimacy)
 * - Greens: Healing, growth, vitality (health, recovery)
 * - Yellows: Optimism, abundance, clarity (finance, prosperity)
 * - Oranges: Motivation, energy, creativity (career, productivity)
 * - Purples: Wisdom, spirituality, introspection (meaning, philosophy)
 * 
 * All colors maintain WCAG AA accessibility with dark text (rgba(0,0,0,0.85))
 */

export const ROOM_COLOR_THEMES = {
  // ═══════════════════════════════════════════════════════════
  // MENTAL HEALTH & EMOTIONAL WELL-BEING
  // Blues promote calm, reduce stress, aid focus
  // ═══════════════════════════════════════════════════════════
  
  mental_health: '#B8D4F1', // Soft Sky Blue - General mental wellness
  anxiety: '#B8D4F1', // Soft Sky Blue - Promotes calm, reduces stress
  depression: '#C9E4FF', // Light Azure - Uplifting without overwhelming
  adhd: '#B3D1ED', // Gentle Cerulean - Aids focus, reduces overstimulation
  stress: '#B5D6F0', // Pale Periwinkle - Tranquility and peace
  burnout: '#A8C9E8', // Misty Blue - Restorative, encourages rest
  ocd: '#C1D8F4', // Serenity Blue - Order and calm
  ptsd: '#B0D0EE', // Powder Blue - Safety and emotional distance
  bipolar: '#C5DCEF', // Cloud Blue - Stability and balance
  shadow_work: '#D0DDEE', // Moonstone - Introspection, gentle exploration
  mens_mental_health: '#BAD5F0', // Steel Blue Tint - Approachable vulnerability
  mindfulness: '#BDD9F2', // Periwinkle - Present moment awareness
  
  // ═══════════════════════════════════════════════════════════
  // RELATIONSHIPS & CONNECTION
  // Pinks evoke warmth, romance, emotional intimacy
  // ═══════════════════════════════════════════════════════════
  
  relationships: '#FFD4E5', // Soft Pink - General relationship warmth
  soulmate: '#FFE0EC', // Blush Pink - Romance and tenderness
  loneliness: '#FDD5E3', // Rose Quartz - Comfort and connection
  social_anxiety: '#FFDCE8', // Cotton Candy - Gentle social warmth
  relational_intelligence: '#FFD9E6', // Petal Pink - Empathy and understanding
  
  // ═══════════════════════════════════════════════════════════
  // HEALTH & VITALITY
  // Greens represent healing, growth, natural wellness
  // ═══════════════════════════════════════════════════════════
  
  health: '#C8E6C9', // Pale Green - General health and wellness
  nutrition: '#D4EED5', // Mint Cream - Fresh, natural health
  physical_fitness: '#C0E4C1', // Spring Green - Energy and renewal
  sleep: '#B8E0B9', // Sage Mint - Rest and rejuvenation
  weight_loss: '#CFE9D0', // Celadon - Balance and patience
  obesity: '#C4E6C5', // Soft Jade - Body acceptance
  eating_disorder: '#D0EBCD', // Tea Green - Gentle healing
  trigger_point: '#BCE1BD', // Mint - Physical release
  mental_sharpness: '#C5E7C6', // Pistachio - Cognitive vitality
  
  // ═══════════════════════════════════════════════════════════
  // FINANCE & PROSPERITY
  // Warm yellows suggest abundance, optimism, clarity
  // ═══════════════════════════════════════════════════════════
  
  finance: '#FFF4CC', // Cream Yellow - General financial wellness
  finance_calm: '#FFEFC2', // Soft Gold - Calm abundance
  wealth_wisdom: '#FFF5D1', // Vanilla - Long-term prosperity
  investing: '#FFF2C8', // Buttercream - Growth and calculated risk
  money_basics: '#FFF6D4', // Champagne - Financial clarity
  growing_money: '#FFF3CC', // Pale Yellow - Gradual wealth building
  legacy_peace: '#FFF7D7', // Eggshell - Generational wealth
  
  // ═══════════════════════════════════════════════════════════
  // CAREER & PERSONAL GROWTH
  // Peach/Orange tones inspire motivation, creativity, warmth
  // ═══════════════════════════════════════════════════════════
  
  career: '#FFE0CC', // Peach Cream - Professional motivation
  courage_to_begin: '#FFD7BA', // Apricot - Gentle boldness
  discover_self: '#FFE5D4', // Seashell - Self-exploration
  explore_world: '#FFD9C1', // Light Peach - Openness to experiences
  build_skills: '#FFDDC7', // Champagne Pink - Craftsmanship
  resilience: '#FFE2CF', // Linen - Endurance and flexibility
  career_community: '#FFDBC4', // Warm Bisque - Professional connection
  launch_career: '#FFE4D2', // Bisque - New professional beginnings
  grow_wealth: '#FFD5B8', // Pale Apricot - Career prosperity
  
  // ═══════════════════════════════════════════════════════════
  // SPIRITUALITY & MEANING
  // Lavenders inspire wisdom, transcendence, contemplation
  // ═══════════════════════════════════════════════════════════
  
  spirituality: '#E8D4F5', // Soft Lavender - Spiritual connection
  meaning_of_life: '#EDD9F7', // Mauve - Existential inquiry
  finding_peace: '#E5D0F3', // Lavender Mist - Spiritual calm
  god_with_us: '#EAD6F6', // Thistle - Divine presence
  philosophy: '#E7D3F4', // Wisteria - Philosophical contemplation
  stoicism: '#EBDAF7', // Pale Lilac - Virtue and rational calm
  
  // ═══════════════════════════════════════════════════════════
  // SEXUALITY & INTIMACY
  // Warm pinks/peach suggest sensuality, connection, openness
  // ═══════════════════════════════════════════════════════════
  
  sexuality: '#FFD9E8', // Pink Lace - General sexuality topics
  sexuality_curiosity: '#FFE0ED', // Pink Lace - Exploration and openness
  sacred_body: '#FFD6E4', // Cherry Blossom - Body reverence
  erotic_wisdom: '#FFDCE9', // Ballet Slipper - Mature intimacy
  diverse_desires: '#FFD8E6', // Fairy Tale - Sexual spectrum acceptance
  
  // ═══════════════════════════════════════════════════════════
  // PRODUCTIVITY & STRATEGY
  // Aqua/Teal promote clarity, focus, tactical thinking
  // ═══════════════════════════════════════════════════════════
  
  productivity: '#B8E6E6', // Powder Aqua - Mental efficiency
  focus: '#C4EAEA', // Aqua Haze - Concentration
  strategy: '#C0E8E8', // Morning Mist - Clear tactical planning
  confidence: '#BADFDF', // Soft Turquoise - Self-assurance (kept for compatibility)
  confidence_building: '#FFE0D4', // Pale Peach - Warm self-assurance
  
  // ═══════════════════════════════════════════════════════════
  // RECOVERY & TRANSFORMATION
  // Sage greens suggest healing through growth and renewal
  // ═══════════════════════════════════════════════════════════
  
  addiction: '#D5E8D5', // Moss Green - Healing and renewal
  grief: '#D9EBDB', // Pale Jade - Gentle sadness, growth through loss
  
  // ═══════════════════════════════════════════════════════════
  // SELF-DEVELOPMENT
  // Warm coral suggests self-compassion and inner warmth
  // ═══════════════════════════════════════════════════════════
  
  self_love: '#FFE5D9', // Coral Cream - Self-compassion and acceptance
  
  // ═══════════════════════════════════════════════════════════
  // DEFAULT FALLBACK
  // ═══════════════════════════════════════════════════════════
  
  default: '#E8F0F2' // Pale Blue Grey - Neutral calm
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
