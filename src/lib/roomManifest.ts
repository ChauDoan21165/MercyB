/**
 * Manifest of all room JSON files in the public directory
 * Format: {roomId: filename}
 * 
 * roomId is kebab-case (e.g., 'adhd-support-free')
 * filename is the actual file name (e.g., 'ADHD Support_Free.json')
 */
export const PUBLIC_ROOM_MANIFEST: Record<string, string> = {
  // ADHD Support
  'adhd-support-free': 'ADHD Support_Free.json',
  'adhd-support-vip1': 'ADHD Support_VIP1.json',
  'adhd-support-vip2': 'ADHD Support_VIP2.json',
  'adhd-support-vip3': 'ADHD Support_VIP3.json',
  
  // AI
  'ai-free': 'AI_free.json',
  'ai-vip1': 'AI_VIP1.json',
  'ai-vip2': 'AI_VIP2.json',
  'ai-vip3': 'AI_VIP3.json',
  
  // Confidence
  'confidence-vip1': 'confidence_vip1.json',
  'confidence-vip2': 'confidence_vip2.json',
  'confidence-vip3': 'confidence_vip3.json',
  
  // Eating Disorder Support
  'eating-disorder-support-free': 'Eating Disorder Support_Free.json',
  'eating-disorder-support-vip1': 'Eating Disorder Support_VIP1.json',
  'eating-disorder-support-vip2': 'Eating Disorder Support_VIP2.json',
  'eating-disorder-support-vip3': 'Eating Disorder Support_VIP3.json',
  
  // Meaning of Life
  'meaning-of-life-free': 'meaning_of_life_free.json',
  'meaning-of-life-vip2': 'meaning_of_life_vip2.json',
  'meaning-of-life-vip3': 'meaning_of_life_vip3.json',
  
  // Mental Health
  'mental-health-free': 'mental_health_free.json',
  
  // Mindfulness
  'mindfulness-free': 'Mindfulness_Free.json',
  'mindfulness-vip1': 'Mindfulness_VIP1.json',
  'mindfulness-vip2': 'Mindfulness_VIP2.json',
  'mindfulness-vip3': 'Mindfulness_VIP3.json',
  
  // Nutrition
  'nutrition-free': 'nutrition_free.json',
  'nutrition-vip1': 'nutrition_vip1.json',
  'nutrition-vip2': 'nutrition_vip2.json',
  'nutrition-vip3': 'nutrition_vip3.json',
  
  // Obesity
  'obesity-free': 'obesity_free.json',
  'obesity-vip1': 'obesity_vip1.json',
  'obesity-vip2': 'obesity_vip2.json',
  'obesity-vip3': 'obesity_vip3.json',
  
  // Sleep
  'sleep-free': 'Sleep_free.json',
  'sleep-vip1': 'Sleep_vip1.json',
  'sleep-vip2': 'Sleep_vip2.json',
  'sleep-vip3': 'Sleep_vip3.json',
};

/**
 * Get all unique room base names (without tier suffix)
 */
export function getRoomBaseNames(): string[] {
  const baseNames = new Set<string>();
  
  for (const roomId of Object.keys(PUBLIC_ROOM_MANIFEST)) {
    // Remove tier suffix: 'adhd-support-free' -> 'adhd-support'
    const baseName = roomId.replace(/-(free|vip1|vip2|vip3)$/, '');
    baseNames.add(baseName);
  }
  
  return Array.from(baseNames).sort();
}

/**
 * Get all tiers available for a room base name
 */
export function getAvailableTiers(roomBaseName: string): string[] {
  const tiers: string[] = [];
  
  for (const tier of ['free', 'vip1', 'vip2', 'vip3']) {
    const roomId = `${roomBaseName}-${tier}`;
    if (PUBLIC_ROOM_MANIFEST[roomId]) {
      tiers.push(tier);
    }
  }
  
  return tiers;
}
