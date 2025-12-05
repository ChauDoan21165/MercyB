/**
 * Global Consistency Engine Tests
 * Phase 4: Verifies GCE functions correctly
 */

import { describe, it, expect } from 'vitest';
import {
  getCanonicalAudioForRoom,
  normalizeRoomId,
  normalizeEntrySlug,
  validateWithGCE,
  extractLanguage,
  MIN_CONFIDENCE_FOR_AUTO_FIX,
} from '../globalConsistencyEngine';

describe('globalConsistencyEngine', () => {
  describe('getCanonicalAudioForRoom', () => {
    it('generates correct canonical pair for string slug', () => {
      const result = getCanonicalAudioForRoom('anger-management', 'breathing-exercise');
      expect(result.en).toBe('anger-management-breathing-exercise-en.mp3');
      expect(result.vi).toBe('anger-management-breathing-exercise-vi.mp3');
    });

    it('generates correct canonical pair for numeric slug', () => {
      const result = getCanonicalAudioForRoom('vip2-nutrition', 1);
      expect(result.en).toBe('vip2-nutrition-entry-1-en.mp3');
      expect(result.vi).toBe('vip2-nutrition-entry-1-vi.mp3');
    });

    it('normalizes underscores to hyphens in roomId', () => {
      const result = getCanonicalAudioForRoom('anger_management', 'entry-1');
      expect(result.en).toBe('anger-management-entry-1-en.mp3');
    });

    it('normalizes uppercase to lowercase', () => {
      const result = getCanonicalAudioForRoom('Anger-Management', 'Entry-1');
      expect(result.en).toBe('anger-management-entry-1-en.mp3');
    });

    it('handles complex slug normalization', () => {
      const result = getCanonicalAudioForRoom('Room_Name', 'Some_Entry Slug');
      expect(result.en).toBe('room-name-some-entry-slug-en.mp3');
    });
  });

  describe('normalizeRoomId', () => {
    it('converts to lowercase', () => {
      expect(normalizeRoomId('VIP2-Nutrition')).toBe('vip2-nutrition');
    });

    it('replaces underscores with hyphens', () => {
      expect(normalizeRoomId('anger_management')).toBe('anger-management');
    });

    it('replaces spaces with hyphens', () => {
      expect(normalizeRoomId('anger management')).toBe('anger-management');
    });

    it('removes invalid characters', () => {
      expect(normalizeRoomId('room@name#123')).toBe('roomname123');
    });

    it('collapses multiple hyphens', () => {
      expect(normalizeRoomId('room--name---test')).toBe('room-name-test');
    });

    it('trims leading/trailing hyphens', () => {
      expect(normalizeRoomId('-room-name-')).toBe('room-name');
    });
  });

  describe('normalizeEntrySlug', () => {
    it('handles numeric input', () => {
      expect(normalizeEntrySlug(5)).toBe('entry-5');
    });

    it('normalizes string slug', () => {
      expect(normalizeEntrySlug('Some_Entry_Name')).toBe('some-entry-name');
    });

    it('handles complex strings', () => {
      expect(normalizeEntrySlug('Entry #1 - Test')).toBe('entry-1-test');
    });
  });

  describe('extractLanguage', () => {
    it('detects EN suffix with hyphen', () => {
      expect(extractLanguage('room-entry-en.mp3')).toBe('en');
    });

    it('detects VI suffix with hyphen', () => {
      expect(extractLanguage('room-entry-vi.mp3')).toBe('vi');
    });

    it('detects EN suffix with underscore', () => {
      expect(extractLanguage('room_entry_en.mp3')).toBe('en');
    });

    it('detects VI suffix with underscore', () => {
      expect(extractLanguage('room_entry_vi.mp3')).toBe('vi');
    });

    it('returns null for no language suffix', () => {
      expect(extractLanguage('room-entry.mp3')).toBe(null);
    });

    it('returns null for invalid format', () => {
      expect(extractLanguage('room-entry-fr.mp3')).toBe(null);
    });
  });

  describe('validateWithGCE', () => {
    it('validates correct canonical filename', () => {
      const result = validateWithGCE(
        'anger-management-entry-1-en.mp3',
        'anger-management',
        'entry-1'
      );
      expect(result.isValid).toBe(true);
      expect(result.violations).toHaveLength(0);
      expect(result.confidence).toBe(100);
    });

    it('detects missing roomId prefix', () => {
      const result = validateWithGCE(
        'entry-1-en.mp3',
        'anger-management',
        'entry-1'
      );
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('CRITICAL: Must start with "anger-management-"');
    });

    it('detects uppercase in filename', () => {
      const result = validateWithGCE(
        'Anger-Management-entry-1-en.mp3',
        'anger-management'
      );
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('Must be all lowercase');
    });

    it('detects underscores in filename', () => {
      const result = validateWithGCE(
        'anger_management_entry_1_en.mp3',
        'anger-management'
      );
      expect(result.violations).toContain('Must use hyphens, not underscores or spaces');
    });

    it('detects missing language suffix', () => {
      const result = validateWithGCE(
        'anger-management-entry-1.mp3',
        'anger-management'
      );
      expect(result.violations).toContain('Must end with -en.mp3 or -vi.mp3');
    });

    it('marks as auto-repairable when confidence is high', () => {
      const result = validateWithGCE(
        'anger-management-entry-1-en.mp3',
        'anger-management',
        'entry-1'
      );
      expect(result.autoRepairable).toBe(true);
    });

    it('marks as not auto-repairable when confidence is low', () => {
      const result = validateWithGCE(
        'wrong-room-entry-1-en.mp3',
        'anger-management',
        'entry-1'
      );
      expect(result.autoRepairable).toBe(false);
    });
  });

  describe('MIN_CONFIDENCE_FOR_AUTO_FIX', () => {
    it('is set to 0.85', () => {
      expect(MIN_CONFIDENCE_FOR_AUTO_FIX).toBe(0.85);
    });
  });
});
