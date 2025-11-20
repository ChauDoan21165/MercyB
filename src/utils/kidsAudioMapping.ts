/**
 * Kids Audio File Mapping Utilities
 * Maps audio files to Kids room entries following naming convention
 */

/**
 * Audio file naming convention: <roomId>_<entryNumber>_en.mp3
 * Example: level1-alphabet-adventure_1_en.mp3
 */

export const KIDS_AUDIO_BASE_PATH = '/audio/kids';

/**
 * Generate audio URL for a Kids entry
 */
export function getKidsAudioUrl(roomId: string, entryNumber: number): string {
  const filename = `${roomId}_${entryNumber}_en.mp3`;
  return `${KIDS_AUDIO_BASE_PATH}/${filename}`;
}

/**
 * Extract room ID and entry number from audio filename
 */
export function parseKidsAudioFilename(filename: string): {
  roomId: string;
  entryNumber: number;
} | null {
  const match = filename.match(/^(level[1-3]-[\w-]+)_(\d+)_en\.mp3$/);
  if (!match) return null;

  return {
    roomId: match[1],
    entryNumber: parseInt(match[2], 10)
  };
}

/**
 * Validate audio filename format
 */
export function isValidKidsAudioFilename(filename: string): boolean {
  return /^level[1-3]-[\w-]+_\d+_en\.mp3$/.test(filename);
}

/**
 * Generate list of expected audio files for a room
 */
export function getExpectedAudioFiles(roomId: string): string[] {
  return Array.from({ length: 5 }, (_, i) => `${roomId}_${i + 1}_en.mp3`);
}

/**
 * Check if all audio files exist for a room (requires audio file list)
 */
export function validateRoomAudioFiles(
  roomId: string, 
  availableFiles: string[]
): {
  missing: string[];
  found: string[];
  isComplete: boolean;
} {
  const expected = getExpectedAudioFiles(roomId);
  const found = expected.filter(file => availableFiles.includes(file));
  const missing = expected.filter(file => !availableFiles.includes(file));

  return {
    found,
    missing,
    isComplete: missing.length === 0
  };
}

/**
 * Map audio URLs to Kids entries
 */
export function mapAudioToEntries(
  roomId: string,
  entryCount: number = 5
): Record<number, string> {
  const mapping: Record<number, string> = {};
  
  for (let i = 1; i <= entryCount; i++) {
    mapping[i] = getKidsAudioUrl(roomId, i);
  }
  
  return mapping;
}

/**
 * Get audio file info from Supabase Storage path
 */
export function getAudioFileInfo(storagePath: string): {
  isKidsAudio: boolean;
  roomId?: string;
  entryNumber?: number;
} {
  const kidsMatch = storagePath.match(/\/audio\/kids\/(level[1-3]-[\w-]+)_(\d+)_en\.mp3$/);
  
  if (kidsMatch) {
    return {
      isKidsAudio: true,
      roomId: kidsMatch[1],
      entryNumber: parseInt(kidsMatch[2], 10)
    };
  }

  return { isKidsAudio: false };
}

/**
 * Build audio upload path for Supabase Storage
 */
export function buildKidsAudioUploadPath(roomId: string, entryNumber: number): string {
  return `kids/${roomId}_${entryNumber}_en.mp3`;
}
