import { describe, it, expect } from 'vitest';
import {
  getValidationConfig,
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
    const entryWithOnlyEnglish = { copy: { en: 'English' } };
    const entryWithNoContent = {};

    it('should require bilingual copy in strict mode', () => {
      expect(validateEntryBilingualCopy(entryWithBilingual, 0, 'strict').valid).toBe(true);
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
});
