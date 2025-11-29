import { supabase } from '@/integrations/supabase/client';
import { ROOMS_TABLE } from '@/lib/constants/rooms';

// Toggle demo status for a room
export const toggleRoomDemoStatus = async (roomId: string, isDemo: boolean) => {
  const { error } = await supabase
    .from(ROOMS_TABLE)
    .update({ is_demo: isDemo })
    .eq('id', roomId);
  
  if (error) throw error;
};

// Get all rooms with demo status
export const getRoomsWithDemoStatus = async () => {
  const { data, error } = await supabase
    .from(ROOMS_TABLE)
    .select('id, title_en, title_vi, tier, is_demo')
    .order('title_en');
  
  if (error) throw error;
  return data || [];
};
