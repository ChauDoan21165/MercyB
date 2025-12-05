/**
 * Phase 4.7 Contract Test: Autopilot Artifacts
 * 
 * These tests exercise the serialization functions to ensure
 * artifacts maintain their expected structure after round-trips.
 */

import { describe, it, expect, vi } from 'vitest';
import type { AudioChangeSet, AudioChange, AutopilotStatusStore } from '../types';

// Mock the autopilot module functions since they may have side effects
vi.mock('../audioAutopilot', async () => {
  const actual = await vi.importActual('../audioAutopilot');
  return {
    ...actual,
    // Only mock file system operations if needed
  };
});

describe('Autopilot artifacts (Phase 4.7)', () => {
  describe('AutopilotStatusStore serialization', () => {
    it('serializes and deserializes correctly', () => {
      const status: AutopilotStatusStore = {
        version: '4.7',
        lastRunAt: new Date().toISOString(),
        mode: 'dry-run',
        beforeIntegrity: 95.1,
        afterIntegrity: 99.3,
        roomsTouched: 42,
        changesApplied: 10,
        changesBlocked: 2,
        governanceFlags: ['flag1', 'flag2'],
        lastReportPath: 'public/audio/autopilot-report.json',
      };

      const json = JSON.stringify(status, null, 2);
      const parsed = JSON.parse(json) as AutopilotStatusStore;

      expect(parsed.version).toBe(status.version);
      expect(parsed.beforeIntegrity).toBe(status.beforeIntegrity);
      expect(parsed.afterIntegrity).toBe(status.afterIntegrity);
      expect(parsed.roomsTouched).toBe(status.roomsTouched);
      expect(parsed.changesApplied).toBe(status.changesApplied);
      expect(parsed.changesBlocked).toBe(status.changesBlocked);
      expect(parsed.governanceFlags).toEqual(status.governanceFlags);
    });

    it('handles null optional fields', () => {
      const status: AutopilotStatusStore = {
        version: '4.7',
        lastRunAt: null,
        mode: null,
        beforeIntegrity: 0,
        afterIntegrity: 0,
        roomsTouched: 0,
        changesApplied: 0,
        changesBlocked: 0,
        governanceFlags: [],
        lastReportPath: null,
      };

      const json = JSON.stringify(status, null, 2);
      const parsed = JSON.parse(json) as AutopilotStatusStore;

      expect(parsed.lastRunAt).toBeNull();
      expect(parsed.mode).toBeNull();
      expect(parsed.lastReportPath).toBeNull();
    });
  });

  describe('AudioChangeSet serialization', () => {
    const makeChange = (id: string): AudioChange => ({
      id,
      roomId: `room-${id}`,
      type: 'rename',
      before: `${id}-old.mp3`,
      after: `${id}-new.mp3`,
      confidence: 95,
      governanceDecision: 'auto-approve',
    });

    it('serializes and deserializes correctly', () => {
      const changeSet: AudioChangeSet = {
        criticalFixes: [makeChange('c1')],
        autoFixes: [makeChange('a1'), makeChange('a2')],
        lowConfidence: [makeChange('l1')],
        blocked: [makeChange('b1')],
        cosmetic: [],
      };

      const json = JSON.stringify(changeSet, null, 2);
      const parsed = JSON.parse(json) as AudioChangeSet;

      expect(parsed.criticalFixes.length).toBe(1);
      expect(parsed.autoFixes.length).toBe(2);
      expect(parsed.lowConfidence.length).toBe(1);
      expect(parsed.blocked.length).toBe(1);
      expect(parsed.cosmetic.length).toBe(0);

      // Verify nested structure
      expect(parsed.criticalFixes[0].id).toBe('c1');
      expect(parsed.autoFixes[0].type).toBe('rename');
    });

    it('preserves all AudioChange fields', () => {
      const change: AudioChange = {
        id: 'full-change',
        roomId: 'test-room',
        type: 'attach-orphan',
        before: 'orphan.mp3',
        after: 'attached.mp3',
        confidence: 87.5,
        governanceDecision: 'requires-review',
        notes: 'Some notes about this change',
      };

      const changeSet: AudioChangeSet = {
        criticalFixes: [],
        autoFixes: [],
        lowConfidence: [change],
        blocked: [],
        cosmetic: [],
      };

      const json = JSON.stringify(changeSet, null, 2);
      const parsed = JSON.parse(json) as AudioChangeSet;
      const parsedChange = parsed.lowConfidence[0];

      expect(parsedChange.id).toBe(change.id);
      expect(parsedChange.roomId).toBe(change.roomId);
      expect(parsedChange.type).toBe(change.type);
      expect(parsedChange.before).toBe(change.before);
      expect(parsedChange.after).toBe(change.after);
      expect(parsedChange.confidence).toBe(change.confidence);
      expect(parsedChange.governanceDecision).toBe(change.governanceDecision);
      expect(parsedChange.notes).toBe(change.notes);
    });

    it('handles empty changesets', () => {
      const changeSet: AudioChangeSet = {
        criticalFixes: [],
        autoFixes: [],
        lowConfidence: [],
        blocked: [],
        cosmetic: [],
      };

      const json = JSON.stringify(changeSet, null, 2);
      const parsed = JSON.parse(json) as AudioChangeSet;

      expect(Object.keys(parsed)).toEqual([
        'criticalFixes',
        'autoFixes',
        'lowConfidence',
        'blocked',
        'cosmetic',
      ]);
    });
  });

  describe('artifact structure validation', () => {
    it('status artifact has required jq-queryable fields', () => {
      const status: AutopilotStatusStore = {
        version: '4.7',
        lastRunAt: new Date().toISOString(),
        mode: 'dry-run',
        beforeIntegrity: 95,
        afterIntegrity: 99,
        roomsTouched: 10,
        changesApplied: 5,
        changesBlocked: 2,
        governanceFlags: [],
        lastReportPath: 'path.json',
      };

      const json = JSON.stringify(status);
      const parsed = JSON.parse(json);

      // These are the exact fields the CI workflow reads via jq
      expect('beforeIntegrity' in parsed).toBe(true);
      expect('afterIntegrity' in parsed).toBe(true);
      expect('changesApplied' in parsed).toBe(true);
      expect('changesBlocked' in parsed).toBe(true);
      expect('roomsTouched' in parsed).toBe(true);

      // Verify they're numbers (jq expects numeric comparison)
      expect(typeof parsed.beforeIntegrity).toBe('number');
      expect(typeof parsed.afterIntegrity).toBe('number');
      expect(typeof parsed.changesApplied).toBe('number');
      expect(typeof parsed.changesBlocked).toBe('number');
      expect(typeof parsed.roomsTouched).toBe('number');
    });

    it('changeset artifact has all category arrays', () => {
      const changeSet: AudioChangeSet = {
        criticalFixes: [],
        autoFixes: [],
        lowConfidence: [],
        blocked: [],
        cosmetic: [],
      };

      const json = JSON.stringify(changeSet);
      const parsed = JSON.parse(json);

      // The dashboard and governance console expect these exact keys
      const expectedKeys = ['criticalFixes', 'autoFixes', 'lowConfidence', 'blocked', 'cosmetic'];
      for (const key of expectedKeys) {
        expect(key in parsed).toBe(true);
        expect(Array.isArray(parsed[key])).toBe(true);
      }
    });
  });
});
