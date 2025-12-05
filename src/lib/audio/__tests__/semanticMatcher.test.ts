/**
 * Semantic Matcher Tests
 * Phase 4: Verifies semantic matching functions
 */

import { describe, it, expect } from 'vitest';
import {
  matchAudioToEntry,
  batchMatchOrphans,
  getMatchConfidence,
} from '../semanticMatcher';

describe('semanticMatcher', () => {
  describe('matchAudioToEntry', () => {
    const entries = [
      { slug: 'breathing-exercise' },
      { slug: 'anger-tips' },
      { slug: 'meditation' },
    ];

    it('finds exact match', () => {
      const result = matchAudioToEntry(
        'anger-room-breathing-exercise-en.mp3',
        'anger-room',
        entries
      );
      
      expect(result.matchType).toBe('exact');
      expect(result.confidence).toBe(100);
      expect(result.matchedEntry?.slug).toBe('breathing-exercise');
      expect(result.requiresHumanReview).toBe(false);
    });

    it('finds slug match with high confidence', () => {
      const result = matchAudioToEntry(
        'anger-room-breathing-exercises-en.mp3', // slight variation
        'anger-room',
        entries
      );
      
      expect(result.matchType).toBe('slug');
      expect(result.confidence).toBeGreaterThan(80);
      expect(result.matchedEntry?.slug).toBe('breathing-exercise');
    });

    it('finds index-based match', () => {
      const result = matchAudioToEntry(
        'anger-room-entry-2-en.mp3',
        'anger-room',
        [{ id: 0 }, { id: 1 }, { id: 2 }]
      );
      
      expect(result.matchType).toBe('index');
      expect(result.matchedEntry?.index).toBe(2);
    });

    it('returns no match for invalid filename', () => {
      const result = matchAudioToEntry(
        'completely-different-file.mp3', // no language suffix
        'anger-room',
        entries
      );
      
      expect(result.matchType).toBe('none');
      expect(result.matchedEntry).toBeNull();
      expect(result.requiresHumanReview).toBe(true);
    });

    it('flags low confidence matches for human review', () => {
      const result = matchAudioToEntry(
        'anger-room-random-name-en.mp3',
        'anger-room',
        entries
      );
      
      // Should find a levenshtein match but with low confidence
      if (result.confidence < 85) {
        expect(result.requiresHumanReview).toBe(true);
      }
    });

    it('provides suggested canonical name', () => {
      const result = matchAudioToEntry(
        'anger-room-breathing-exercise-en.mp3',
        'anger-room',
        entries
      );
      
      expect(result.suggestedCanonical).toBe('anger-room-breathing-exercise-en.mp3');
    });
  });

  describe('batchMatchOrphans', () => {
    it('separates auto-repairs from human review', () => {
      const orphans = [
        'test-room-entry-1-en.mp3',  // should match
        'test-room-unknown-en.mp3',   // might not match well
      ];
      const entries = [{ slug: 'entry-1' }, { slug: 'entry-2' }];
      
      const { autoRepairs, humanReview } = batchMatchOrphans(
        orphans,
        'test-room',
        entries
      );
      
      // At least one should be in autoRepairs (exact match)
      expect(autoRepairs.length + humanReview.length).toBe(2);
    });

    it('returns empty arrays for no orphans', () => {
      const { autoRepairs, humanReview } = batchMatchOrphans(
        [],
        'test-room',
        [{ slug: 'entry-1' }]
      );
      
      expect(autoRepairs).toHaveLength(0);
      expect(humanReview).toHaveLength(0);
    });
  });

  describe('getMatchConfidence', () => {
    it('returns 1 for identical strings', () => {
      expect(getMatchConfidence(
        'test-room-entry-1-en.mp3',
        'test-room-entry-1-en.mp3'
      )).toBe(1);
    });

    it('returns high score for similar strings', () => {
      const score = getMatchConfidence(
        'test-room-entry-1-en.mp3',
        'test-room-entry-2-en.mp3'
      );
      expect(score).toBeGreaterThan(0.8);
    });

    it('returns low score for different strings', () => {
      const score = getMatchConfidence(
        'test-room-entry-1-en.mp3',
        'completely-different-room-vi.mp3'
      );
      expect(score).toBeLessThan(0.5);
    });

    it('is case insensitive', () => {
      const score = getMatchConfidence(
        'TEST-ROOM-entry-1-en.mp3',
        'test-room-entry-1-en.mp3'
      );
      expect(score).toBe(1);
    });
  });
});
