import { CompanionProfile } from './companion';
import { supabase } from '@/lib/supabaseClient';

export interface SuggestedItem {
  type: 'room' | 'path';
  slug: string;
  title_en: string;
  title_vi: string;
  reason_en: string;
  reason_vi: string;
}

const HEAVY_TAGS = ['heartbreak', 'anxiety', 'grief', 'depression', 'trauma', 'loss'];

export async function getSuggestionsForUser(options: {
  profile: CompanionProfile;
  lastRoomId?: string;
  lastTags?: string[];
}): Promise<SuggestedItem[]> {

  const { lastRoomId, lastTags = [] } = options;
  const suggestions: SuggestedItem[] = [];

  const wasInHeavyRoom = lastTags.some(tag =>
    HEAVY_TAGS.includes(tag.toLowerCase())
  );

  try {

    const { data: rooms } = await supabase
      .from('rooms')
      .select('id, title_en, title_vi, tier, tags')
      .eq('is_demo', false)
      .limit(20);

    if (!rooms || rooms.length === 0) {
      return [];
    }

    let filtered = rooms.filter(r => r.id !== lastRoomId);

    if (wasInHeavyRoom) {
      filtered = filtered.filter(r =>
        !(r.tags || []).some((t: string) =>
          HEAVY_TAGS.includes(t.toLowerCase())
        )
      );
    }

    const shuffled = filtered.sort(() => Math.random() - 0.5).slice(0, 3);

    shuffled.forEach(room => {
      suggestions.push({
        type: 'room',
        slug: room.id,
        title_en: room.title_en || 'Room',
        title_vi: room.title_vi || 'Phòng',
        reason_en: 'A gentle place you can explore next.',
        reason_vi: 'Một nơi nhẹ nhàng bạn có thể thử tiếp.',
      });
    });

  } catch (error) {
    console.error('Failed to get suggestions:', error);
    return [];
  }

  return suggestions;
}