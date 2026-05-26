/**
 * Environment-aware JSON validation rules
 * 
 * Allows flexible validation for WIP content while maintaining strict rules for production
 */

export type ValidationMode = 'strict' | 'preview' | 'wip';

interface ValidationConfig {
  mode: ValidationMode;
  minEntries: number;
  maxEntries: number;
  requireAudio: boolean;
  requireBilingualCopy: boolean;
  allowMissingFields: boolean;
}

const VALIDATION_CONFIGS: Record<ValidationMode, ValidationConfig> = {
  strict: {
    mode: 'strict',
    minEntries: 2,
    maxEntries: 8,
    requireAudio: true,
    requireBilingualCopy: true,
    allowMissingFields: false,
  },
  preview: {
    mode: 'preview',
    minEntries: 1,
    maxEntries: 15, // Allow more entries for long-form content
    requireAudio: false, // Audio can be added later
    requireBilingualCopy: true,
    allowMissingFields: true,
  },
  wip: {
    mode: 'wip',
    minEntries: 1,
    maxEntries: 20, // Very flexible for work-in-progress
    requireAudio: false,
    requireBilingualCopy: false, // Can have incomplete translations
    allowMissingFields: true,
  },
};

/**
 * Get validation config based on environment
 */
export function getValidationMode(): ValidationMode {
  // Check environment variables or build mode
  const env = import.meta.env.MODE;
  const isProduction = env === 'production';
  const previewMode = import.meta.env.VITE_PREVIEW_MODE === 'true';
  
  if (isProduction && !previewMode) {
    return 'strict';
  }
  
  if (previewMode) {
    return 'preview';
  }
  
  return 'wip';
}

/**
 * Get validation config for current mode
 */
export function getValidationConfig(mode?: ValidationMode): ValidationConfig {
  const activeMode = mode || getValidationMode();
  return VALIDATION_CONFIGS[activeMode];
}

/**
 * Validate entry count based on mode
 */
export function validateEntryCount(
  count: number,
  mode?: ValidationMode
): { valid: boolean; message?: string } {
  const config = getValidationConfig(mode);
  
  if (count < config.minEntries) {
    return {
      valid: false,
      message: `Entry count too low: ${count}. Minimum: ${config.minEntries} (${config.mode} mode)`,
    };
  }
  
  if (count > config.maxEntries) {
    return {
      valid: false,
      message: `Entry count too high: ${count}. Maximum: ${config.maxEntries} (${config.mode} mode)`,
    };
  }
  
  return { valid: true };
}

/**
 * Validate entry audio based on mode
 */
export function validateEntryAudio(
  entry: any,
  entryIndex: number,
  mode?: ValidationMode
): { valid: boolean; message?: string } {
  const config = getValidationConfig(mode);
  
  if (!config.requireAudio) {
    return { valid: true };
  }
  
  const hasAudio = entry.audio || entry.audio_en || entry.audioEn;
  if (!hasAudio) {
    return {
      valid: false,
      message: `Entry ${entryIndex + 1} missing audio (required in ${config.mode} mode)`,
    };
  }
  
  return { valid: true };
}

/**
 * Validate entry bilingual copy based on mode
 */
export function validateEntryBilingualCopy(
  entry: any,
  entryIndex: number,
  mode?: ValidationMode
): { valid: boolean; message?: string } {
  const config = getValidationConfig(mode);
  
  if (!config.requireBilingualCopy) {
    return { valid: true };
  }
  
  const hasBilingualCopy = (entry.copy?.en && entry.copy?.vi) || (entry.copy_en && entry.copy_vi);
  if (!hasBilingualCopy) {
    return {
      valid: false,
      message: `Entry ${entryIndex + 1} missing bilingual copy (required in ${config.mode} mode)`,
    };
  }
  
  return { valid: true };
}

/**
 * Get validation summary for display
 */
export function getValidationSummary(mode?: ValidationMode): string {
  const config = getValidationConfig(mode);
  const lines = [
    `Validation Mode: ${config.mode.toUpperCase()}`,
    `Entry Count: ${config.minEntries}-${config.maxEntries}`,
    `Audio Required: ${config.requireAudio ? 'Yes' : 'No'}`,
    `Bilingual Copy Required: ${config.requireBilingualCopy ? 'Yes' : 'No'}`,
    `Allow Missing Fields: ${config.allowMissingFields ? 'Yes' : 'No'}`,
  ];
  return lines.join('\n');
}
