/**
 * Audio Filename Validator Tests v4.0
 * Chief Automation Engineer: Unit Tests for Core Rules
 * 
 * Tests cover:
 * 1. RoomId prefix rule
 * 2. Entry matching rule
 * 3. Duplicate detection rule
 */

import { describe, it, expect } from 'vitest';
import {
  validateAudioFilename,
  validateWithRoomContext,
  detectDuplicates,
  generateCanonicalFilename,
  normalizeFilename,
  extractLanguage,
  batchValidate,
  getCanonicalAudioPair,
  levenshteinDistance,
  similarityScore,
} from './filenameValidator';

describe('filenameValidator', () => {
  // ============================================
  // RULE 1: RoomId Prefix Tests
  // ============================================
  describe('roomId prefix rule', () => {
    it('should pass when filename starts with correct roomId', () => {
      const result = validateWithRoomContext(
        'anxiety-relief-entry-1-en.mp3',
        'anxiety-relief',
        ['entry-1']
      );
      expect(result.roomIdMatch).toBe(true);
      expect(result.errors.filter(e => e.includes('CRITICAL'))).toHaveLength(0);
    });

    it('should fail when filename does not start with roomId', () => {
      const result = validateWithRoomContext(
        'wrong-prefix-entry-1-en.mp3',
        'anxiety-relief',
        ['entry-1']
      );
      expect(result.roomIdMatch).toBe(false);
      expect(result.errors.some(e => e.includes('CRITICAL'))).toBe(true);
      expect(result.severity).toBe('critical');
    });

    it('should handle roomId with underscores converted to hyphens', () => {
      const result = validateWithRoomContext(
        'english-foundation-ef01-alphabet-en.mp3',
        'english_foundation_ef01',
        ['alphabet']
      );
      expect(result.roomIdMatch).toBe(true);
    });

    it('should reject filename that partially matches roomId', () => {
      const result = validateWithRoomContext(
        'anxiety-entry-1-en.mp3',
        'anxiety-relief',
        ['entry-1']
      );
      expect(result.roomIdMatch).toBe(false);
    });

    it('should generate expected canonical name with roomId prefix', () => {
      const canonical = generateCanonicalFilename('my-room', 'my-entry', 'en');
      expect(canonical).toBe('my-room-my-entry-en.mp3');
      expect(canonical.startsWith('my-room-')).toBe(true);
    });
  });

  // ============================================
  // RULE 2: Entry Matching Tests
  // ============================================
  describe('entry matching rule', () => {
    it('should match when filename corresponds to valid entry slug', () => {
      const result = validateWithRoomContext(
        'anxiety-relief-breathing-exercise-en.mp3',
        'anxiety-relief',
        ['breathing-exercise', 'grounding', 'meditation']
      );
      expect(result.entryMatch).toBe(true);
    });

    it('should not match when slug is not in entry list', () => {
      const result = validateWithRoomContext(
        'anxiety-relief-unknown-entry-en.mp3',
        'anxiety-relief',
        ['breathing-exercise', 'grounding', 'meditation']
      );
      expect(result.entryMatch).toBe(false);
    });

    it('should match numeric entry slugs', () => {
      const result = validateWithRoomContext(
        'english-foundation-ef01-entry-0-en.mp3',
        'english-foundation-ef01',
        [0, 1, 2]
      );
      expect(result.entryMatch).toBe(true);
    });

    it('should use fuzzy matching for close matches', () => {
      const result = validateWithRoomContext(
        'anxiety-relief-breathin-exercise-en.mp3', // typo
        'anxiety-relief',
        ['breathing-exercise']
      );
      // Should suggest correction
      expect(result.suggestions.some(s => s.includes('breathing-exercise'))).toBe(true);
    });

    it('should detect EN/VI language from filename', () => {
      expect(extractLanguage('room-entry-en.mp3')).toBe('en');
      expect(extractLanguage('room-entry-vi.mp3')).toBe('vi');
      expect(extractLanguage('room_entry_en.mp3')).toBe('en');
      expect(extractLanguage('room_entry_vi.mp3')).toBe('vi');
      expect(extractLanguage('room-entry.mp3')).toBe(null);
    });
  });

  // ============================================
  // RULE 3: Duplicate Detection Tests
  // ============================================
  describe('duplicate detection rule', () => {
    it('should detect duplicates that normalize to same name (underscore vs hyphen)', () => {
      const duplicates = detectDuplicates([
        'anger-entry-1-en.mp3',
        'anger_entry_1_en.mp3',
      ]);
      expect(duplicates).toHaveLength(1);
      expect(duplicates[0].variants).toContain('anger-entry-1-en.mp3');
      expect(duplicates[0].variants).toContain('anger_entry_1_en.mp3');
    });

    it('should detect duplicates with different casing', () => {
      const duplicates = detectDuplicates([
        'Room-Entry-1-EN.mp3',
        'room-entry-1-en.mp3',
      ]);
      expect(duplicates).toHaveLength(1);
      expect(duplicates[0].variants).toHaveLength(2);
    });

    it('should not flag unique filenames as duplicates', () => {
      const duplicates = detectDuplicates([
        'room-entry-1-en.mp3',
        'room-entry-1-vi.mp3',
        'room-entry-2-en.mp3',
      ]);
      expect(duplicates).toHaveLength(0);
    });

    it('should detect duplicates in room context validation', () => {
      const allFiles = [
        'anxiety-relief-entry-1-en.mp3',
        'anxiety_relief_entry_1_en.mp3',
      ];
      
      const result = validateWithRoomContext(
        'anxiety-relief-entry-1-en.mp3',
        'anxiety-relief',
        ['entry-1'],
        allFiles
      );
      
      expect(result.duplicateOf).toBe('anxiety_relief_entry_1_en.mp3');
      expect(result.severity).toBe('critical');
    });

    it('should recommend keeping canonical format in duplicates', () => {
      const duplicates = detectDuplicates([
        'anger-entry-1-en.mp3', // canonical
        'anger_entry_1_en.mp3', // non-canonical
        'Anger_Entry_1_EN.mp3', // non-canonical
      ]);
      
      expect(duplicates).toHaveLength(1);
      expect(duplicates[0].keepRecommendation).toBe('anger-entry-1-en.mp3');
    });
  });

  // ============================================
  // Basic Validation Tests
  // ============================================
  describe('basic validation', () => {
    it('should pass valid canonical filename', () => {
      const result = validateAudioFilename('room-entry-en.mp3');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail filename with uppercase', () => {
      const result = validateAudioFilename('Room-Entry-EN.mp3');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('lowercase'))).toBe(true);
    });

    it('should fail filename with underscores', () => {
      const result = validateAudioFilename('room_entry_en.mp3');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('underscore'))).toBe(true);
    });

    it('should fail filename without language suffix', () => {
      const result = validateAudioFilename('room-entry.mp3');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('-en.mp3') || e.includes('-vi.mp3'))).toBe(true);
    });

    it('should fail filename with spaces', () => {
      const result = validateAudioFilename('room entry en.mp3');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('spaces'))).toBe(true);
    });
  });

  // ============================================
  // Batch Validation Tests
  // ============================================
  describe('batch validation', () => {
    it('should validate all files and detect duplicates', () => {
      const { results, duplicates, summary } = batchValidate([
        'room-entry-1-en.mp3',
        'room_entry_1_en.mp3',
        'room-entry-2-en.mp3',
        'Invalid File.mp3',
      ]);
      
      expect(summary.total).toBe(4);
      expect(summary.duplicateGroups).toBe(1);
      expect(summary.critical).toBeGreaterThan(0);
    });

    it('should calculate average confidence', () => {
      const { summary } = batchValidate(
        ['room-entry-1-en.mp3', 'room-entry-1-vi.mp3'],
        'room',
        ['entry-1']
      );
      
      expect(summary.averageConfidence).toBeGreaterThan(0);
    });
  });

  // ============================================
  // Helper Function Tests
  // ============================================
  describe('helper functions', () => {
    it('should normalize filename correctly', () => {
      expect(normalizeFilename('Room_Entry_EN.mp3')).toBe('room-entry-en.mp3');
      expect(normalizeFilename('my file name.mp3')).toBe('my-file-name.mp3');
      expect(normalizeFilename('"corrupted.mp3')).toBe('corrupted.mp3');
    });

    it('should generate canonical audio pair', () => {
      const pair = getCanonicalAudioPair('my-room', 'my-entry');
      expect(pair.en).toBe('my-room-my-entry-en.mp3');
      expect(pair.vi).toBe('my-room-my-entry-vi.mp3');
    });

    it('should calculate Levenshtein distance', () => {
      expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
      expect(levenshteinDistance('same', 'same')).toBe(0);
    });

    it('should calculate similarity score', () => {
      expect(similarityScore('same', 'same')).toBe(1);
      expect(similarityScore('different', 'completely')).toBeLessThan(0.5);
      expect(similarityScore('entry-1-en', 'entry-1-en')).toBe(1);
    });
  });
});
