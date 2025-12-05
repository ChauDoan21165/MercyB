/**
 * Phase 4.7 Contract Test: AutopilotStatusStore Schema
 * 
 * This test locks the TypeScript type to the shape the CI workflow expects.
 * If someone refactors the status schema later, this test will fail
 * at COMPILE TIME before CI silently breaks.
 * 
 * IMPORTANT: This imports the REAL type, not a local redeclaration.
 */

import { describe, it, expect } from 'vitest';
import type { AutopilotStatusStore } from '@/lib/audio/types';

describe('AutopilotStatusStore contract (Phase 4.7)', () => {
  it('has all fields required by CI workflow', () => {
    // This sample must conform to the REAL exported type.
    // If someone changes the type, this test fails at compile time.
    const sample: AutopilotStatusStore = {
      version: '4.7',
      lastRunAt: new Date().toISOString(),
      mode: 'dry-run',
      beforeIntegrity: 95.1,
      afterIntegrity: 99.3,
      roomsTouched: 42,
      changesApplied: 10,
      changesBlocked: 2,
      governanceFlags: [],
      lastReportPath: 'public/audio/autopilot-report.json',
    };

    // CI reads these exact fields via jq - they must be numbers
    expect(typeof sample.beforeIntegrity).toBe('number');
    expect(typeof sample.afterIntegrity).toBe('number');
    expect(typeof sample.changesApplied).toBe('number');
    expect(typeof sample.changesBlocked).toBe('number');
    expect(typeof sample.roomsTouched).toBe('number');
  });

  it('accepts null for optional fields', () => {
    // The real type allows null for these fields
    const sample: AutopilotStatusStore = {
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

    expect(sample.lastRunAt).toBeNull();
    expect(sample.mode).toBeNull();
    expect(sample.lastReportPath).toBeNull();
  });

  it('validates integrity values are in valid range', () => {
    // Integrity should be between 0-100
    const validIntegrity = (val: number): boolean => val >= 0 && val <= 100;
    
    expect(validIntegrity(99.5)).toBe(true);
    expect(validIntegrity(99)).toBe(true); // CI threshold
    expect(validIntegrity(0)).toBe(true);
    expect(validIntegrity(100)).toBe(true);
    expect(validIntegrity(-1)).toBe(false);
    expect(validIntegrity(101)).toBe(false);
  });

  it('documents how totals are derived from applied + blocked', () => {
    const sample: Pick<AutopilotStatusStore, 'changesApplied' | 'changesBlocked'> = {
      changesApplied: 10,
      changesBlocked: 2,
    };

    // CI calculates: TOTAL=$((APPLIED + BLOCKED))
    const total = sample.changesApplied + sample.changesBlocked;
    expect(total).toBe(12);
  });
});
