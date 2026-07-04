import { describe, it, expect } from 'vitest';
import {
  getValidationConfig,
  getValidationSummary,
  validateEntryCount,
  validateEntryAudio,
  validateEntryBilingualCopy,
  type ValidationMode,
} from '../validation/roomJsonValidation';

describe('Room JSON Validation', () => {
  describe('getValidationConfig', () => {
    it('should return strict config for strict mode', () => {
      const config = getValidationConfig('strict');
      expect(config.mode).toBe('strict');
      expect(config.requireAudio).toBe(true);
      expect(config.requireBilingualCopy).toBe(true);
      expect(config.minEntries).toBe(2);
      expect(config.maxEntries).toBe(8);
    });

    it('should return preview config for preview mode', () => {
      const config = getValidationConfig('preview');
      expect(config.mode).toBe('preview');
      expect(config.requireAudio).toBe(false);
      expect(config.requireBilingualCopy).toBe(true);
      expect(config.maxEntries).toBe(15);
    });

    it('should return wip config for wip mode', () => {
      const config = getValidationConfig('wip');
      expect(config.mode).toBe('wip');
      expect(config.requireAudio).toBe(false);
      expect(config.requireBilingualCopy).toBe(false);
      expect(config.maxEntries).toBe(20);
    });
  });

  describe('validateEntryCount', () => {
    it.each([
      ['strict', 2, 8],
      ['preview', 1, 15],
      ['wip', 1, 20],
    ] satisfies Array<[ValidationMode, number, number]>)(
      'validates exact boundaries in %s mode',
      (mode, min, max) => {
        expect(validateEntryCount(min - 1, mode).valid).toBe(false);
        expect(validateEntryCount(min, mode).valid).toBe(true);
        expect(validateEntryCount(max, mode).valid).toBe(true);
        expect(validateEntryCount(max + 1, mode).valid).toBe(false);
      },
    );

    it('should validate entry count in strict mode', () => {
      expect(validateEntryCount(5, 'strict').valid).toBe(true);
      expect(validateEntryCount(1, 'strict').valid).toBe(false);
      expect(validateEntryCount(9, 'strict').valid).toBe(false);
    });

    it('should be more flexible in preview mode', () => {
      expect(validateEntryCount(1, 'preview').valid).toBe(true);
      expect(validateEntryCount(15, 'preview').valid).toBe(true);
      expect(validateEntryCount(16, 'preview').valid).toBe(false);
    });

    it('should be very flexible in wip mode', () => {
      expect(validateEntryCount(1, 'wip').valid).toBe(true);
      expect(validateEntryCount(20, 'wip').valid).toBe(true);
      expect(validateEntryCount(21, 'wip').valid).toBe(false);
    });
  });

  describe('validateEntryAudio', () => {
    const entryWithAudio = { audio: 'test.mp3', copy: { en: 'text', vi: 'text' } };
    const entryWithoutAudio = { copy: { en: 'text', vi: 'text' } };

    it.each([
      { audio: 'canonical.mp3' },
      { audio_en: 'legacy-en.mp3' },
      { audioEn: 'legacyCamel.mp3' },
    ])('accepts supported audio aliases in strict mode: %o', (entry) => {
      expect(validateEntryAudio(entry, 0, 'strict').valid).toBe(true);
    });

    it('should require audio in strict mode', () => {
      expect(validateEntryAudio(entryWithAudio, 0, 'strict').valid).toBe(true);
      expect(validateEntryAudio(entryWithoutAudio, 0, 'strict').valid).toBe(false);
    });

    it('should not require audio in preview mode', () => {
      expect(validateEntryAudio(entryWithAudio, 0, 'preview').valid).toBe(true);
      expect(validateEntryAudio(entryWithoutAudio, 0, 'preview').valid).toBe(true);
    });

    it('should not require audio in wip mode', () => {
      expect(validateEntryAudio(entryWithAudio, 0, 'wip').valid).toBe(true);
      expect(validateEntryAudio(entryWithoutAudio, 0, 'wip').valid).toBe(true);
    });
  });

  describe('validateEntryBilingualCopy', () => {
    const entryWithBilingual = { copy: { en: 'English', vi: 'Vietnamese' } };
    const entryWithFlatBilingual = { copy_en: 'English', copy_vi: 'Vietnamese' };
    const entryWithOnlyEnglish = { copy: { en: 'English' } };
    const entryWithNoContent = {};

    it('should require bilingual copy in strict mode', () => {
      expect(validateEntryBilingualCopy(entryWithBilingual, 0, 'strict').valid).toBe(true);
      expect(validateEntryBilingualCopy(entryWithFlatBilingual, 0, 'strict').valid).toBe(true);
      expect(validateEntryBilingualCopy(entryWithOnlyEnglish, 0, 'strict').valid).toBe(false);
    });

    it('should require bilingual copy in preview mode', () => {
      expect(validateEntryBilingualCopy(entryWithBilingual, 0, 'preview').valid).toBe(true);
      expect(validateEntryBilingualCopy(entryWithOnlyEnglish, 0, 'preview').valid).toBe(false);
    });

    it('should not require bilingual copy in wip mode', () => {
      expect(validateEntryBilingualCopy(entryWithBilingual, 0, 'wip').valid).toBe(true);
      expect(validateEntryBilingualCopy(entryWithOnlyEnglish, 0, 'wip').valid).toBe(true);
      expect(validateEntryBilingualCopy(entryWithNoContent, 0, 'wip').valid).toBe(true);
    });
  });

  describe('getValidationSummary', () => {
    it.each([
      ['strict', 'Entry Count: 2-8', 'Audio Required: Yes', 'Bilingual Copy Required: Yes'],
      ['preview', 'Entry Count: 1-15', 'Audio Required: No', 'Bilingual Copy Required: Yes'],
      ['wip', 'Entry Count: 1-20', 'Audio Required: No', 'Bilingual Copy Required: No'],
    ] satisfies Array<[ValidationMode, string, string, string]>)(
      'summarizes %s mode accurately',
      (mode, countLine, audioLine, copyLine) => {
        const summary = getValidationSummary(mode);

        expect(summary).toContain(`Validation Mode: ${mode.toUpperCase()}`);
        expect(summary).toContain(countLine);
        expect(summary).toContain(audioLine);
        expect(summary).toContain(copyLine);
      },
    );

    it('uses the current test environment default mode when mode is omitted', () => {
      expect(getValidationConfig().mode).toBe('wip');
      expect(getValidationSummary()).toContain('Validation Mode: WIP');
    });
  });
});
