/**
 * Integrity Map Tests
 * Phase 4: Verifies integrity mapping functions
 */

import { describe, it, expect } from 'vitest';
import {
  buildRoomIntegrity,
  buildIntegrityMap,
  generateIntegritySummary,
  getLowestIntegrityRooms,
  getRoomsWithIssues,
} from '../integrityMap';

describe('integrityMap', () => {
  describe('buildRoomIntegrity', () => {
    it('calculates 100% score for perfect room', () => {
      const entries = [
        { slug: 'entry-1' },
        { slug: 'entry-2' },
      ];
      const storageFiles = new Set([
        'test-room-entry-1-en.mp3',
        'test-room-entry-1-vi.mp3',
        'test-room-entry-2-en.mp3',
        'test-room-entry-2-vi.mp3',
      ]);
      
      const result = buildRoomIntegrity('test-room', entries, storageFiles);
      
      expect(result.score).toBe(100);
      expect(result.missing).toHaveLength(0);
      expect(result.found).toHaveLength(4);
      expect(result.orphans).toHaveLength(0);
    });

    it('detects missing files', () => {
      const entries = [{ slug: 'entry-1' }];
      const storageFiles = new Set([
        'test-room-entry-1-en.mp3',
        // missing vi file
      ]);
      
      const result = buildRoomIntegrity('test-room', entries, storageFiles);
      
      expect(result.missing).toContain('test-room-entry-1-vi.mp3');
      expect(result.score).toBeLessThan(100);
    });

    it('detects orphan files', () => {
      const entries = [{ slug: 'entry-1' }];
      const storageFiles = new Set([
        'test-room-entry-1-en.mp3',
        'test-room-entry-1-vi.mp3',
        'test-room-unknown-file-en.mp3', // orphan
      ]);
      
      const result = buildRoomIntegrity('test-room', entries, storageFiles);
      
      expect(result.orphans).toContain('test-room-unknown-file-en.mp3');
    });

    it('handles numeric entry indices', () => {
      const entries = [
        { id: 0 },
        { id: 1 },
      ];
      const storageFiles = new Set([
        'test-room-entry-0-en.mp3',
        'test-room-entry-0-vi.mp3',
        'test-room-entry-1-en.mp3',
        'test-room-entry-1-vi.mp3',
      ]);
      
      const result = buildRoomIntegrity('test-room', entries, storageFiles);
      
      expect(result.score).toBe(100);
    });

    it('ignores files from other rooms', () => {
      const entries = [{ slug: 'entry-1' }];
      const storageFiles = new Set([
        'test-room-entry-1-en.mp3',
        'test-room-entry-1-vi.mp3',
        'other-room-entry-1-en.mp3', // different room
      ]);
      
      const result = buildRoomIntegrity('test-room', entries, storageFiles);
      
      expect(result.found).toHaveLength(2);
      expect(result.orphans).toHaveLength(0);
    });
  });

  describe('buildIntegrityMap', () => {
    it('builds map for multiple rooms', () => {
      const rooms = [
        { roomId: 'room-a', entries: [{ slug: 'entry-1' }] },
        { roomId: 'room-b', entries: [{ slug: 'entry-1' }] },
      ];
      const storageFiles = new Set([
        'room-a-entry-1-en.mp3',
        'room-a-entry-1-vi.mp3',
        'room-b-entry-1-en.mp3',
        'room-b-entry-1-vi.mp3',
      ]);
      
      const map = buildIntegrityMap(rooms, storageFiles);
      
      expect(Object.keys(map)).toHaveLength(2);
      expect(map['room-a']).toBeDefined();
      expect(map['room-b']).toBeDefined();
    });
  });

  describe('generateIntegritySummary', () => {
    it('calculates correct summary', () => {
      const map = {
        'room-a': {
          roomId: 'room-a',
          expected: ['a-en.mp3', 'a-vi.mp3'],
          found: ['a-en.mp3', 'a-vi.mp3'],
          missing: [],
          orphans: [],
          mismatchedLang: [],
          duplicates: [],
          unrepairable: [],
          score: 100,
          lastChecked: new Date().toISOString(),
        },
        'room-b': {
          roomId: 'room-b',
          expected: ['b-en.mp3', 'b-vi.mp3'],
          found: ['b-en.mp3'],
          missing: ['b-vi.mp3'],
          orphans: [],
          mismatchedLang: [],
          duplicates: [],
          unrepairable: [],
          score: 80,
          lastChecked: new Date().toISOString(),
        },
      };
      
      const summary = generateIntegritySummary(map);
      
      expect(summary.totalRooms).toBe(2);
      expect(summary.healthyRooms).toBe(1);
      expect(summary.roomsWithIssues).toBe(1);
      expect(summary.totalExpected).toBe(4);
      expect(summary.totalFound).toBe(3);
      expect(summary.totalMissing).toBe(1);
      expect(summary.averageScore).toBe(90);
    });
  });

  describe('getLowestIntegrityRooms', () => {
    it('returns rooms sorted by score ascending', () => {
      const map = {
        'good-room': {
          roomId: 'good-room',
          expected: [],
          found: [],
          missing: [],
          orphans: [],
          mismatchedLang: [],
          duplicates: [],
          unrepairable: [],
          score: 100,
          lastChecked: '',
        },
        'bad-room': {
          roomId: 'bad-room',
          expected: [],
          found: [],
          missing: [],
          orphans: [],
          mismatchedLang: [],
          duplicates: [],
          unrepairable: [],
          score: 50,
          lastChecked: '',
        },
        'medium-room': {
          roomId: 'medium-room',
          expected: [],
          found: [],
          missing: [],
          orphans: [],
          mismatchedLang: [],
          duplicates: [],
          unrepairable: [],
          score: 75,
          lastChecked: '',
        },
      };
      
      const lowest = getLowestIntegrityRooms(map, 2);
      
      expect(lowest).toHaveLength(2);
      expect(lowest[0].roomId).toBe('bad-room');
      expect(lowest[1].roomId).toBe('medium-room');
    });
  });

  describe('getRoomsWithIssues', () => {
    it('filters rooms with missing files', () => {
      const map = {
        'has-missing': {
          roomId: 'has-missing',
          expected: [],
          found: [],
          missing: ['file.mp3'],
          orphans: [],
          mismatchedLang: [],
          duplicates: [],
          unrepairable: [],
          score: 80,
          lastChecked: '',
        },
        'no-missing': {
          roomId: 'no-missing',
          expected: [],
          found: [],
          missing: [],
          orphans: [],
          mismatchedLang: [],
          duplicates: [],
          unrepairable: [],
          score: 100,
          lastChecked: '',
        },
      };
      
      const withMissing = getRoomsWithIssues(map, 'missing');
      
      expect(withMissing).toHaveLength(1);
      expect(withMissing[0].roomId).toBe('has-missing');
    });
  });
});
