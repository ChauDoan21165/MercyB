import { CompanionProfile, EnglishLevel } from './companion';
import { supabase } from '@/integrations/supabase/client';

export interface SuggestedItem {
  type: 'room' | 'path';
  slug: string;
  title_en: string;
  title_vi: string;
  reason_en: string;
  reason_vi: string;
}

// Tags that indicate heavy emotional content
const HEAVY_TAGS = ['heartbreak', 'anxiety', 'grief', 'depression', 'trauma', 'loss'];

// Suggestions based on English level
const BEGINNER_SUGGESTIONS: SuggestedItem[] = [
  {
    type: 'path',
    slug: 'calm-mind-7',
    title_en: 'Calm Mind 7 Days',
    title_vi: 'Bình Tâm 7 Ngày',
    reason_en: 'Gentle path with short English and Vietnamese support.',
    reason_vi: 'Lộ trình nhẹ nhàng với tiếng Anh ngắn và có tiếng Việt hỗ trợ.',
  },
];

const HEALING_SUGGESTIONS: SuggestedItem[] = [
  {
    type: 'room',
    slug: 'self-worth',
    title_en: 'Self Worth',
    title_vi: 'Giá Trị Bản Thân',
    reason_en: 'A softer place to remind you of your value.',
    reason_vi: 'Một nơi hiền hơn để nhắc bạn về giá trị của mình.',
  },
];

/**
 * Get personalized suggestions for the user
 */
export async function getSuggestionsForUser(options: {
  profile: CompanionProfile;
  lastRoomId?: string;
  lastTags?: string[];
}): Promise<SuggestedItem[]> {
  const { profile, lastRoomId, lastTags = [] } = options;
  const suggestions: SuggestedItem[] = [];

  // Check if user just visited a heavy emotional room
  const wasInHeavyRoom = lastTags.some(tag => 
    HEAVY_TAGS.includes(tag.toLowerCase())
  );

  // Get some rooms from DB for variety
  try {
    const { data: rooms } = await supabase
      .from('rooms')
      .select('id, title_en, title_vi, tier')
      .eq('is_demo', false)
      .limit(10);

    // Filter based on user level and context
    if (profile.english_level === 'beginner' || profile.english_level === 'lower_intermediate') {
      // Suggest calm mind path for beginners
      suggestions.push(...BEGINNER_SUGGESTIONS);
    }

    // If user was in heavy room, suggest healing content
    if (wasInHeavyRoom && lastRoomId) {
      suggestions.push({
        type: 'room',
        slug: 'self-worth',
        title_en: 'Self Worth',
        title_vi: 'Giá Trị Bản Thân',
        reason_en: `A softer place to rest after your last room.`,
        reason_vi: `Một nơi hiền hơn để nghỉ sau phòng trước.`,
      });
    }

    // Add some variety from DB if we have rooms
    if (rooms && rooms.length > 0) {
      const freeRooms = rooms.filter(r => 
        r.tier?.toLowerCase() === 'free' && 
        r.id !== lastRoomId
      );
      
      if (freeRooms.length > 0 && suggestions.length < 3) {
        const randomRoom = freeRooms[Math.floor(Math.random() * freeRooms.length)];
        suggestions.push({
          type: 'room',
          slug: randomRoom.id,
          title_en: randomRoom.title_en || 'Room',
          title_vi: randomRoom.title_vi || 'Phòng',
          reason_en: 'A gentle room to explore at your own pace.',
          reason_vi: 'Một phòng nhẹ nhàng để khám phá theo nhịp của bạn.',
        });
      }
    }

    // If still no suggestions, add default calm mind
    if (suggestions.length === 0) {
      suggestions.push(...BEGINNER_SUGGESTIONS);
    }

  } catch (error) {
    console.error('Failed to get suggestions:', error);
    // Return default suggestions on error
    return BEGINNER_SUGGESTIONS;
  }

  // Limit to 3 suggestions and remove duplicates
  const uniqueSlugs = new Set<string>();
  return suggestions
    .filter(s => {
      if (uniqueSlugs.has(s.slug)) return false;
      uniqueSlugs.add(s.slug);
      return true;
    })
    .slice(0, 3);
}
