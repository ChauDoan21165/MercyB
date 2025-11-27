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
  // Bold Blues - sharp, strong, blade-like
  // ═══════════════════════════════════════════════════════════
  
  mental_health: '#4A90E2', // Bold Blue - General mental wellness
  anxiety: '#4A90E2', // Bold Blue - Promotes calm, reduces stress
  depression: '#5CA3FF', // Bright Azure - Uplifting without overwhelming
  adhd: '#3B7FCC', // Deep Cerulean - Aids focus, reduces overstimulation
  stress: '#5599DD', // Strong Periwinkle - Tranquility and peace
  burnout: '#3E7FC2', // Bold Blue - Restorative, encourages rest
  ocd: '#6BA5E7', // Bright Blue - Order and calm
  ptsd: '#4D8FD8', // Strong Powder Blue - Safety and emotional distance
  bipolar: '#709DD6', // Steel Blue - Stability and balance
  shadow_work: '#8AA4C8', // Deep Moonstone - Introspection, exploration
  mens_mental_health: '#5898DE', // Bold Steel Blue - Approachable vulnerability
  mindfulness: '#679DDF', // Strong Periwinkle - Present moment awareness
  
  // ═══════════════════════════════════════════════════════════
  // RELATIONSHIPS & CONNECTION
  // Bold Pinks/Magentas - sharp warmth, strong intimacy
  // ═══════════════════════════════════════════════════════════
  
  relationships: '#FF66A3', // Bold Pink - General relationship warmth
  soulmate: '#FF7AB8', // Strong Blush - Romance and tenderness
  loneliness: '#FA5E8F', // Deep Rose - Comfort and connection
  social_anxiety: '#FF6EAD', // Bold Cotton Candy - Social warmth
  relational_intelligence: '#FF70A9', // Strong Petal Pink - Empathy and understanding
  
  // ═══════════════════════════════════════════════════════════
  // HEALTH & VITALITY
  // Bold Greens - sharp healing, strong growth
  // ═══════════════════════════════════════════════════════════
  
  health: '#5CB85C', // Bold Green - General health and wellness
  nutrition: '#66CC66', // Strong Mint - Fresh, natural health
  physical_fitness: '#4CAF4C', // Deep Spring - Energy and renewal
  sleep: '#52B652', // Strong Sage - Rest and rejuvenation
  weight_loss: '#6FCC6F', // Bold Celadon - Balance and patience
  obesity: '#58BD58', // Deep Jade - Body acceptance
  eating_disorder: '#75D175', // Strong Tea Green - Healing
  trigger_point: '#49A849', // Bold Mint - Physical release
  mental_sharpness: '#5EC45E', // Strong Pistachio - Cognitive vitality
  
  // ═══════════════════════════════════════════════════════════
  // FINANCE & PROSPERITY
  // Bold yellows/golds - sharp abundance, strong prosperity
  // ═══════════════════════════════════════════════════════════
  
  finance: '#FFD700', // Bold Gold - General financial wellness
  finance_calm: '#FFC928', // Strong Gold - Calm abundance
  wealth_wisdom: '#FFD63D', // Bright Vanilla - Long-term prosperity
  investing: '#FFCC1A', // Deep Buttercream - Growth and calculated risk
  money_basics: '#FFD84C', // Bold Champagne - Financial clarity
  growing_money: '#FFCE2B', // Strong Yellow - Gradual wealth building
  legacy_peace: '#FFD957', // Bright Eggshell - Generational wealth
  
  // ═══════════════════════════════════════════════════════════
  // CAREER & PERSONAL GROWTH
  // Bold Orange/Coral - sharp motivation, strong creativity
  // ═══════════════════════════════════════════════════════════
  
  career: '#FF9966', // Bold Peach - Professional motivation
  courage_to_begin: '#FF8855', // Strong Apricot - Boldness
  discover_self: '#FFA078', // Bright Seashell - Self-exploration
  explore_world: '#FF8F66', // Deep Peach - Openness to experiences
  build_skills: '#FF9470', // Bold Champagne Pink - Craftsmanship
  resilience: '#FFA280', // Strong Linen - Endurance and flexibility
  career_community: '#FF8D5F', // Deep Bisque - Professional connection
  launch_career: '#FFA485', // Bright Bisque - New professional beginnings
  grow_wealth: '#FF8A52', // Bold Apricot - Career prosperity
  
  // ═══════════════════════════════════════════════════════════
  // SPIRITUALITY & MEANING
  // Bold Purples - sharp wisdom, strong transcendence
  // ═══════════════════════════════════════════════════════════
  
  spirituality: '#9966CC', // Bold Lavender - Spiritual connection
  meaning_of_life: '#AA77DD', // Strong Mauve - Existential inquiry
  finding_peace: '#8855BB', // Deep Lavender - Spiritual calm
  god_with_us: '#A370CE', // Bright Thistle - Divine presence
  philosophy: '#9B63C7', // Strong Wisteria - Philosophical contemplation
  stoicism: '#AE7FD9', // Bold Lilac - Virtue and rational calm
  
  // ═══════════════════════════════════════════════════════════
  // SEXUALITY & INTIMACY
  // Bold pinks/corals - sharp sensuality, strong connection
  // ═══════════════════════════════════════════════════════════
  
  sexuality: '#FF88B8', // Bold Pink Lace - General sexuality topics
  sexuality_curiosity: '#FF99C3', // Strong Pink - Exploration and openness
  sacred_body: '#FF7AAE', // Deep Cherry Blossom - Body reverence
  erotic_wisdom: '#FF8FBE', // Bright Ballet - Mature intimacy
  diverse_desires: '#FF85B5', // Bold Fairy Tale - Sexual spectrum acceptance
  
  // ═══════════════════════════════════════════════════════════
  // PRODUCTIVITY & STRATEGY
  // Bold Aqua/Cyan - sharp clarity, strong focus
  // ═══════════════════════════════════════════════════════════
  
  productivity: '#33CCCC', // Bold Aqua - Mental efficiency
  focus: '#3DD6D6', // Strong Aqua - Concentration
  strategy: '#2EC8C8', // Deep Cyan - Clear tactical planning
  confidence: '#27BFBF', // Bold Turquoise - Self-assurance
  confidence_building: '#FF9977', // Strong Peach - Warm self-assurance
  
  // ═══════════════════════════════════════════════════════════
  // RECOVERY & TRANSFORMATION
  // Bold sage greens - sharp healing, strong renewal
  // ═══════════════════════════════════════════════════════════
  
  addiction: '#66BB66', // Bold Moss - Healing and renewal
  grief: '#70C870', // Strong Jade - Sadness, growth through loss
  
  // ═══════════════════════════════════════════════════════════
  // SELF-DEVELOPMENT
  // Bold coral - sharp self-compassion, strong warmth
  // ═══════════════════════════════════════════════════════════
  
  self_love: '#FF9D7A', // Bold Coral - Self-compassion and acceptance
  
  // ═══════════════════════════════════════════════════════════
  // DEFAULT FALLBACK
  // ═══════════════════════════════════════════════════════════
  
  default: '#5EAABB' // Bold Blue Grey - Neutral strong
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
