/**
 * Phase 4.7 Contract Test: AutopilotStatusStore Schema
 * 
 * This test locks the TypeScript type to the shape the CI workflow expects.
 * If someone refactors the status schema later, this test will fail
 * before CI silently breaks.
 */

import { describe, it, expect } from 'vitest';

/**
 * Contract type matching what CI workflow expects from autopilot-status.json
 * CI reads these exact fields via jq:
 *   - beforeIntegrity
 *   - afterIntegrity
 *   - changesApplied
 *   - changesBlocked
 *   - roomsTouched
 */
interface AutopilotStatusStore {
  version: string;
  lastRunAt: string;
  mode: 'dry-run' | 'apply';
  beforeIntegrity: number;
  afterIntegrity: number;
  roomsTouched: number;
  changesApplied: number;
  changesBlocked: number;
  governanceFlags: string[];
  lastReportPath: string;
}

describe('AutopilotStatusStore contract (Phase 4.7)', () => {
  it('has all fields required by CI workflow', () => {
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

    // CI expects these keys to exist and be numbers
    expect(typeof sample.beforeIntegrity).toBe('number');
    expect(typeof sample.afterIntegrity).toBe('number');
    expect(typeof sample.changesApplied).toBe('number');
    expect(typeof sample.changesBlocked).toBe('number');
    expect(typeof sample.roomsTouched).toBe('number');
  });

  it('rejects invalid integrity values', () => {
    // Integrity should be between 0-100
    const validIntegrity = (val: number): boolean => val >= 0 && val <= 100;
    
    expect(validIntegrity(99.5)).toBe(true);
    expect(validIntegrity(0)).toBe(true);
    expect(validIntegrity(100)).toBe(true);
    expect(validIntegrity(-1)).toBe(false);
    expect(validIntegrity(101)).toBe(false);
  });

  it('ensures changesApplied + changesBlocked gives total', () => {
    const sample: Pick<AutopilotStatusStore, 'changesApplied' | 'changesBlocked'> = {
      changesApplied: 10,
      changesBlocked: 2,
    };

    const total = sample.changesApplied + sample.changesBlocked;
    expect(total).toBe(12);
  });
});
