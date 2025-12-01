// Audio Filename Generator - Generate canonical audio filenames

import { RULES } from './roomMasterRules';

export function generateAudioFilename(roomId: string, entryIndex: number): string {
  // Format: {roomId}_{index}_en.mp3
  // Index is 1-based and zero-padded to 2 digits
  const paddedIndex = String(entryIndex + 1).padStart(2, '0');
  return `${roomId}_${paddedIndex}_en.mp3`;
}

export function validateAudioPath(audioPath: string): { valid: boolean; error?: string } {
  // Audio should be filename only, no folder path
  if (audioPath.includes('/') || audioPath.includes('\\')) {
    return {
      valid: false,
      error: 'Audio path contains folder separator. Use filename only.',
    };
  }

  // Check pattern
  if (!RULES.AUDIO.PATTERN.test(audioPath)) {
    return {
      valid: false,
      error: `Audio filename does not match pattern: ${RULES.AUDIO.EXAMPLE}`,
    };
  }

  return { valid: true };
}

export async function checkAudioFileExists(filename: string): Promise<boolean> {
  try {
    const url = `${RULES.AUDIO.FOLDER}${filename}`;
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

export async function scanMissingAudio(roomId: string, audioFiles: string[]): Promise<string[]> {
  const missing: string[] = [];

  for (const file of audioFiles) {
    const exists = await checkAudioFileExists(file);
    if (!exists) {
      missing.push(file);
    }
  }

  return missing;
}