import { supabase } from '@/integrations/supabase/client';
import { processEntriesOptimized } from './roomLoaderHelpers';
import { roomCache } from './roomLoaderCache';

// Enable/disable verbose logging for production
const VERBOSE_LOGGING = import.meta.env.DEV;

const log = (...args: any[]) => {
  if (VERBOSE_LOGGING) console.log(...args);
};

/**
 * Normalize room ID for database lookup
 */
const normalizeRoomId = (roomId: string): string => {
  if (roomId.endsWith('_kids_l1')) {
    // Kids room: strip suffix and convert underscores to hyphens
    return roomId.replace('_kids_l1', '').replace(/_/g, '-');
  }
  // Regular room: use roomId as-is
  return roomId;
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
  
  log('✅ Room loaded from database:', dbRoom.id);
  
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
  log(`[Static] Loading room ${roomId} from JSON files`);
  
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
 * Main room loader with caching and optimized processing
 */
export const loadMergedRoom = async (roomId: string, tier: string = 'free') => {
  log('=== loadMergedRoom START ===');
  log('Input roomId:', roomId);
  log('Input tier:', tier);
  
  // Check cache first
  const cached = roomCache.get(roomId);
  if (cached) {
    log('✅ Room loaded from cache:', roomId);
    return cached;
  }
  
  // Normalize room ID
  const dbRoomId = normalizeRoomId(roomId);
  
  if (dbRoomId !== roomId) {
    log('🎯 Room ID normalized:', roomId, '→', dbRoomId);
  }
  
  // Try database first
  try {
    const dbResult = await loadFromDatabase(dbRoomId);
    
    if (dbResult) {
      // Cache successful result
      roomCache.set(roomId, dbResult);
      return dbResult;
    }
    
    log('⚠️ DB room has no entries, falling back to static files');
  } catch (dbError) {
    log('⚠️ Database load failed, falling back to static files:', dbError);
  }
  
  // Fallback to JSON files
  try {
    const jsonResult = await loadFromJson(roomId);
    
    if (jsonResult) {
      // Cache successful result
      roomCache.set(roomId, jsonResult);
      return jsonResult;
    }
  } catch (error) {
    console.error('Failed to load room:', error);
  }
  
  // Return empty result if all loading attempts fail
  const emptyResult = {
    merged: [],
    keywordMenu: { en: [], vi: [] },
    audioBasePath: '/audio/'
  };
  
  // Don't cache empty results
  return emptyResult;
};