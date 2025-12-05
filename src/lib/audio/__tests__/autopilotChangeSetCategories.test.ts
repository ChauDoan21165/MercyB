/**
 * Phase 4.7 Contract Test: ChangeSet Categories
 * 
 * This test locks the unified changeset schema used by:
 * - CLI artifacts (autopilot-changeset.json)
 * - Admin dashboard
 * - Governance console
 * 
 * The schema must have all categories and consistent summary counts.
 */

import { describe, it, expect } from 'vitest';
import type { AudioChangeSet, AudioChange } from '../types';

describe('AudioChangeSet contract (Phase 4.7)', () => {
  const makeChange = (id: string, roomId: string, confidence: number): AudioChange => ({
    id,
    roomId,
    type: 'rename',
    before: `${id}-before.mp3`,
    after: `${id}-after.mp3`,
    confidence,
    governanceDecision: confidence >= 90 ? 'auto-approve' : 'requires-review',
  });

  it('has all required categories', () => {
    const changeSet: AudioChangeSet = {
      criticalFixes: [],
      autoFixes: [],
      lowConfidence: [],
      blocked: [],
      cosmetic: [],
    };

    // Verify all categories exist
    expect(Array.isArray(changeSet.criticalFixes)).toBe(true);
    expect(Array.isArray(changeSet.autoFixes)).toBe(true);
    expect(Array.isArray(changeSet.lowConfidence)).toBe(true);
    expect(Array.isArray(changeSet.blocked)).toBe(true);
    expect(Array.isArray(changeSet.cosmetic)).toBe(true);
  });

  it('allows changes in each category', () => {
    const changeSet: AudioChangeSet = {
      criticalFixes: [makeChange('c1', 'room-a', 99)],
      autoFixes: [makeChange('a1', 'room-b', 95), makeChange('a2', 'room-c', 92)],
      lowConfidence: [makeChange('l1', 'room-d', 75)],
      blocked: [makeChange('b1', 'room-e', 50)],
      cosmetic: [],
    };

    expect(changeSet.criticalFixes.length).toBe(1);
    expect(changeSet.autoFixes.length).toBe(2);
    expect(changeSet.lowConfidence.length).toBe(1);
    expect(changeSet.blocked.length).toBe(1);
    expect(changeSet.cosmetic.length).toBe(0);
  });

  it('calculates total from all categories', () => {
    const changeSet: AudioChangeSet = {
      criticalFixes: [makeChange('c1', 'room-a', 99)],
      autoFixes: [makeChange('a1', 'room-b', 95), makeChange('a2', 'room-c', 92)],
      lowConfidence: [makeChange('l1', 'room-d', 75)],
      blocked: [makeChange('b1', 'room-e', 50)],
      cosmetic: [makeChange('cos1', 'room-f', 80)],
    };

    const total =
      changeSet.criticalFixes.length +
      changeSet.autoFixes.length +
      changeSet.lowConfidence.length +
      changeSet.blocked.length +
      changeSet.cosmetic.length;

    expect(total).toBe(6);
  });

  it('ensures every operation lives in exactly one category', () => {
    const changes: AudioChange[] = [
      makeChange('op-1', 'room-a', 99),
      makeChange('op-2', 'room-b', 95),
      makeChange('op-3', 'room-c', 75),
      makeChange('op-4', 'room-d', 50),
    ];

    const changeSet: AudioChangeSet = {
      criticalFixes: [changes[0]],
      autoFixes: [changes[1]],
      lowConfidence: [changes[2]],
      blocked: [changes[3]],
      cosmetic: [],
    };

    // Collect all IDs from all categories
    const allOps = [
      ...changeSet.criticalFixes,
      ...changeSet.autoFixes,
      ...changeSet.lowConfidence,
      ...changeSet.blocked,
      ...changeSet.cosmetic,
    ];

    const ids = allOps.map(o => o.id);
    const uniqueIds = new Set(ids);

    // No duplicates across categories
    expect(allOps.length).toBe(uniqueIds.size);
  });

  it('AudioChange has all required fields', () => {
    const change: AudioChange = {
      id: 'test-change-1',
      roomId: 'vip1-room-test',
      type: 'rename',
      before: 'old-name.mp3',
      after: 'new-name.mp3',
      confidence: 95,
      governanceDecision: 'auto-approve',
    };

    expect(change.id).toBeDefined();
    expect(change.roomId).toBeDefined();
    expect(change.type).toBeDefined();
    expect(change.confidence).toBeDefined();
    expect(change.governanceDecision).toBeDefined();
    expect(typeof change.confidence).toBe('number');
  });

  it('supports all governance decision types', () => {
    const decisions: AudioChange['governanceDecision'][] = [
      'auto-approve',
      'governance-approve',
      'requires-review',
      'blocked',
    ];

    for (const decision of decisions) {
      const change: AudioChange = {
        id: 'test',
        roomId: 'room',
        type: 'rename',
        confidence: 90,
        governanceDecision: decision,
      };
      expect(change.governanceDecision).toBe(decision);
    }
  });

  it('supports all change types', () => {
    const types: AudioChange['type'][] = [
      'rename',
      'attach-orphan',
      'generate-tts',
      'fix-json-ref',
      'delete-orphan',
    ];

    for (const type of types) {
      const change: AudioChange = {
        id: 'test',
        roomId: 'room',
        type,
        confidence: 90,
        governanceDecision: 'auto-approve',
      };
      expect(change.type).toBe(type);
    }
  });
});
