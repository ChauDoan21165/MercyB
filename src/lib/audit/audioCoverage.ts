import { supabase } from "@/integrations/supabase/client";

export interface RoomAudioCoverage {
  roomId: string;
  titleEn: string | null;
  titleVi: string | null;
  tier: string | null;
  totalEntries: number;
  totalAudioRefsEn: number;
  totalAudioRefsVi: number;
  presentEn: number;
  presentVi: number;
  missingEn: string[];
  missingVi: string[];
}

export interface AudioCoverageReport {
  rooms: RoomAudioCoverage[];
  storageFiles: Set<string>;
  summary: {
    totalRooms: number;
    roomsWithMissingAudio: number;
    totalMissingEn: number;
    totalMissingVi: number;
  };
}

/**
 * Normalize audio filename to bare filename only (no folder prefix)
 */
export function normalizeAudioName(name: string): string {
  if (!name) return '';
  // Trim whitespace, get last segment after any slashes, lowercase
  return (name.trim().split('/').pop() ?? '').toLowerCase();
}

/**
 * Extract audio filenames from an entry
 */
function extractAudioFromEntry(entry: any): { en: string[]; vi: string[] } {
  const en: string[] = [];
  const vi: string[] = [];

  if (!entry) return { en, vi };

  // Handle entry.audio (can be string or { en, vi })
  if (entry.audio) {
    if (typeof entry.audio === 'string') {
      // Single audio file - assume EN
      const normalized = normalizeAudioName(entry.audio);
      if (normalized.endsWith('.mp3')) {
        en.push(normalized);
      }
    } else if (typeof entry.audio === 'object') {
      if (entry.audio.en && typeof entry.audio.en === 'string') {
        const normalized = normalizeAudioName(entry.audio.en);
        if (normalized.endsWith('.mp3')) {
          en.push(normalized);
        }
      }
      if (entry.audio.vi && typeof entry.audio.vi === 'string') {
        const normalized = normalizeAudioName(entry.audio.vi);
        if (normalized.endsWith('.mp3')) {
          vi.push(normalized);
        }
      }
    }
  }

  // Handle explicit audio_en and audio_vi fields
  if (entry.audio_en && typeof entry.audio_en === 'string') {
    const normalized = normalizeAudioName(entry.audio_en);
    if (normalized.endsWith('.mp3')) {
      en.push(normalized);
    }
  }
  if (entry.audio_vi && typeof entry.audio_vi === 'string') {
    const normalized = normalizeAudioName(entry.audio_vi);
    if (normalized.endsWith('.mp3')) {
      vi.push(normalized);
    }
  }

  return { en, vi };
}

/**
 * Fetch storage files from the audio-storage-audit edge function
 */
async function fetchStorageFiles(): Promise<Set<string>> {
  try {
    const { data, error } = await supabase.functions.invoke("audio-storage-audit", {
      body: {},
    });
    
    if (error || !data?.ok) {
      console.error("Failed to fetch storage files:", error || data?.error);
      return new Set();
    }
    
    // Return normalized storage files as a Set
    return new Set(data.storageFiles || []);
  } catch (err) {
    console.error("Error fetching storage files:", err);
    return new Set();
  }
}

/**
 * Get audio coverage for all rooms
 */
export async function getRoomAudioCoverage(): Promise<AudioCoverageReport> {
  // Fetch storage files first
  const storageFiles = await fetchStorageFiles();
  console.log(`Loaded ${storageFiles.size} storage files`);

  // Fetch all rooms
  const { data: rooms, error } = await supabase
    .from('rooms')
    .select('id, title_en, title_vi, tier, entries')
    .order('tier', { ascending: true })
    .order('title_en', { ascending: true });

  if (error) {
    console.error("Error fetching rooms:", error);
    return {
      rooms: [],
      storageFiles,
      summary: {
        totalRooms: 0,
        roomsWithMissingAudio: 0,
        totalMissingEn: 0,
        totalMissingVi: 0,
      },
    };
  }

  const roomCoverages: RoomAudioCoverage[] = [];
  let totalMissingEn = 0;
  let totalMissingVi = 0;
  let roomsWithMissingAudio = 0;

  for (const room of rooms || []) {
    const entries = Array.isArray(room.entries) ? room.entries : [];
    
    const allEnAudio: string[] = [];
    const allViAudio: string[] = [];

    for (const entry of entries) {
      const { en, vi } = extractAudioFromEntry(entry);
      allEnAudio.push(...en);
      allViAudio.push(...vi);
    }

    // Check which files are missing from storage
    const missingEn = allEnAudio.filter(f => !storageFiles.has(f));
    const missingVi = allViAudio.filter(f => !storageFiles.has(f));

    const coverage: RoomAudioCoverage = {
      roomId: room.id,
      titleEn: room.title_en,
      titleVi: room.title_vi,
      tier: room.tier,
      totalEntries: entries.length,
      totalAudioRefsEn: allEnAudio.length,
      totalAudioRefsVi: allViAudio.length,
      presentEn: allEnAudio.length - missingEn.length,
      presentVi: allViAudio.length - missingVi.length,
      missingEn,
      missingVi,
    };

    roomCoverages.push(coverage);

    totalMissingEn += missingEn.length;
    totalMissingVi += missingVi.length;
    if (missingEn.length > 0 || missingVi.length > 0) {
      roomsWithMissingAudio++;
    }
  }

  return {
    rooms: roomCoverages,
    storageFiles,
    summary: {
      totalRooms: roomCoverages.length,
      roomsWithMissingAudio,
      totalMissingEn,
      totalMissingVi,
    },
  };
}
