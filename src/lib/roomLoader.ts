import { supabase } from '@/integrations/supabase/client';
import { processEntriesOptimized } from './roomLoaderHelpers';

/**
 * Normalize room ID for database lookup
 */
const normalizeRoomId = (roomId: string): string => {
  if (roomId.endsWith('_kids_l1')) {
    // Kids room: strip suffix and convert underscores to hyphens
    return roomId.replace('_kids_l1', '').replace(/_/g, '-');
  }
  // Regular room: convert hyphens to underscores for database lookup
  return roomId.replace(/-/g, '_');
};

/**
 * Load room from database
 */
const loadFromDatabase = async (dbRoomId: string) => {
  const { data: dbRoom, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', dbRoomId)
    .maybeSingle();

  if (!dbRoom || error) return null;
  
  const hasEntries = Array.isArray(dbRoom.entries) && dbRoom.entries.length > 0;
  
  if (!hasEntries) return null;
  
  // Single-pass processing - extract keywords and transform entries at once
  const { keywordMenu, merged } = processEntriesOptimized(dbRoom.entries);
  
  return {
    merged,
    keywordMenu,
    audioBasePath: '/audio/'
  };
};

/**
 * Load room from static JSON files (fallback)
 */
const loadFromJson = async (roomId: string) => {
  try {
    const { loadRoomJson } = await import('./roomJsonResolver');
    const jsonData = await loadRoomJson(roomId);
    
    if (!Array.isArray(jsonData?.entries) || jsonData.entries.length === 0) {
      return null;
    }
    
    // Single-pass processing
    const { keywordMenu, merged } = processEntriesOptimized(jsonData.entries);
    
    return {
      merged,
      keywordMenu,
      audioBasePath: '/audio/'
    };
  } catch (error) {
    console.error('Failed to load room from JSON:', error);
    return null;
  }
};

/**
 * Main room loader - optimized for fast loading
 */
export const loadMergedRoom = async (roomId: string, tier: string = 'free') => {
  // Normalize room ID
  const dbRoomId = normalizeRoomId(roomId);
  
  // Try database first
  try {
    const dbResult = await loadFromDatabase(dbRoomId);
    if (dbResult) return dbResult;
  } catch (dbError) {
    console.error('Database load failed:', dbError);
  }
  
  // Fallback to JSON files
  try {
    const jsonResult = await loadFromJson(roomId);
    if (jsonResult) return jsonResult;
  } catch (error) {
    console.error('Failed to load room:', error);
  }
  
  // Return empty result if all loading attempts fail
  return {
    merged: [],
    keywordMenu: { en: [], vi: [] },
    audioBasePath: '/audio/'
  };
};