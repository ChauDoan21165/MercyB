/**
 * Audio Schema Definition
 * Defines all DB fields where audio may live for batch processing
 */

export type PathDayAudioField = 
  | 'audio_content_en' 
  | 'audio_content_vi'
  | 'audio_reflection_en' 
  | 'audio_reflection_vi'
  | 'audio_dare_en' 
  | 'audio_dare_vi'
  | 'audio_intro_en'
  | 'audio_intro_vi';

export type AudioKind = 'content' | 'reflection' | 'dare' | 'intro' | 'warmth';
export type AudioLang = 'en' | 'vi';

export type AudioFieldTarget =
  | { table: 'path_days'; field: PathDayAudioField; lang: AudioLang; kind: AudioKind }
  | { table: 'rooms'; field: 'audio_intro_en' | 'audio_intro_vi'; lang: AudioLang; kind: 'intro' }
  | { table: 'warmth'; field: 'audio_en' | 'audio_vi'; lang: AudioLang; kind: 'warmth' };

export interface AudioTask {
  target: 'path_days' | 'rooms' | 'warmth';
  id: string;
  slug: string;
  day_index?: number;
  lang: AudioLang;
  kind: AudioKind;
  text: string;
  suggestedFilename: string;
  field: string;
}

export interface BatchScanResult {
  ok: boolean;
  tasks: AudioTask[];
  summary?: {
    total: number;
    byKind: Record<string, number>;
    byLang: Record<string, number>;
    estimatedChars: number;
    estimatedCostUsd: number;
  };
  error?: string;
}

export interface BatchGenerateResult {
  ok: boolean;
  results: {
    id: string;
    filename: string;
    status: 'success' | 'skipped_exists' | 'error';
    error?: string;
  }[];
  summary?: {
    success: number;
    skipped: number;
    errors: number;
  };
}

/**
 * Generate standardized filename for path day audio
 */
export function generatePathDayFilename(
  pathSlug: string,
  dayIndex: number,
  kind: AudioKind,
  lang: AudioLang
): string {
  // Normalize slug: replace hyphens with underscores, lowercase
  const normalizedSlug = pathSlug.toLowerCase().replace(/-/g, '_');
  return `${normalizedSlug}_day${dayIndex}_${kind}_${lang}.mp3`;
}

/**
 * Map kind + lang to the correct DB field name
 */
export function getPathDayAudioField(kind: AudioKind, lang: AudioLang): PathDayAudioField {
  const fieldMap: Record<string, PathDayAudioField> = {
    'content_en': 'audio_content_en',
    'content_vi': 'audio_content_vi',
    'reflection_en': 'audio_reflection_en',
    'reflection_vi': 'audio_reflection_vi',
    'dare_en': 'audio_dare_en',
    'dare_vi': 'audio_dare_vi',
    'intro_en': 'audio_intro_en',
    'intro_vi': 'audio_intro_vi',
  };
  return fieldMap[`${kind}_${lang}`] || 'audio_content_en';
}

/**
 * Map DB field name back to kind + lang
 */
export function parsePathDayAudioField(field: PathDayAudioField): { kind: AudioKind; lang: AudioLang } {
  const parts = field.replace('audio_', '').split('_');
  const lang = parts.pop() as AudioLang;
  const kind = parts.join('_') as AudioKind;
  return { kind, lang };
}

/**
 * Estimate OpenAI TTS cost based on character count
 * OpenAI TTS pricing: $0.015 per 1,000 characters
 */
export function estimateTtsCost(charCount: number): number {
  return (charCount / 1000) * 0.015;
}
