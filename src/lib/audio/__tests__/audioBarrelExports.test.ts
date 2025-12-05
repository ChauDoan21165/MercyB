/**
 * Phase 4.7 Smoke Test: Audio Barrel Exports
 * 
 * This catches "renamed file / broken barrel export" bugs.
 * If someone moves or renames a module without updating index.ts,
 * this test will fail at import time.
 */

import { describe, it, expect } from 'vitest';
import * as audio from '@/lib/audio';

describe('audio index barrel exports (Phase 4.7)', () => {
  it('exposes autopilot core functions', () => {
    expect(typeof audio.runAutopilotCycle).toBe('function');
    expect(typeof audio.getAutopilotStatus).toBe('function');
    expect(typeof audio.saveAutopilotStatus).toBe('function');
    expect(typeof audio.generateAutopilotReport).toBe('function');
    expect(typeof audio.generateMarkdownReport).toBe('function');
  });

  it('exposes CLI helpers', () => {
    expect(typeof audio.parseAutopilotCliOptions).toBe('function');
    expect(typeof audio.formatIntegrityLine).toBe('function');
    expect(typeof audio.formatChangesLine).toBe('function');
  });

  it('exposes GCE (Global Consistency Engine)', () => {
    expect(typeof audio.getCanonicalAudioForRoom).toBe('function');
    expect(typeof audio.normalizeRoomId).toBe('function');
    expect(typeof audio.normalizeEntrySlug).toBe('function');
    expect(typeof audio.validateWithGCE).toBe('function');
  });

  it('exposes governance functions', () => {
    expect(typeof audio.evaluateChangeSet).toBe('function');
    expect(typeof audio.getSystemIntegrity).toBe('function');
    expect(typeof audio.meetsIntegrityThreshold).toBe('function');
  });

  it('exposes serialization functions', () => {
    expect(typeof audio.serializeAutopilotReport).toBe('function');
    expect(typeof audio.serializeChangeSet).toBe('function');
  });

  it('exposes history and governance management', () => {
    expect(typeof audio.getAutopilotHistory).toBe('function');
    expect(typeof audio.getPendingGovernance).toBe('function');
    expect(typeof audio.addPendingReview).toBe('function');
  });
});
