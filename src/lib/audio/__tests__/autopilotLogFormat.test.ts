/**
 * Phase 4.7 Contract Test: Log Output Format
 * 
 * This test locks the exact string format that the CI workflow's
 * fallback parsing depends on. If someone "prettifies" the log output,
 * this test will catch it before CI silently breaks.
 */

import { describe, it, expect } from 'vitest';
import { formatIntegrityLine, formatChangesLine } from '../cliHelpers';

describe('Autopilot log format fallback (Phase 4.7)', () => {
  describe('integrity line format', () => {
    it('matches the CI fallback pattern for Before line', () => {
      const line = formatIntegrityLine('Before', 95.1);
      expect(line).toBe('Before: 95.1%');
      expect(/^Before: \d+(\.\d+)?%$/.test(line)).toBe(true);
    });

    it('matches the CI fallback pattern for After line', () => {
      const line = formatIntegrityLine('After', 99.3);
      expect(line).toBe('After: 99.3%');
      expect(/^After: \d+(\.\d+)?%$/.test(line)).toBe(true);
    });

    it('handles whole numbers correctly', () => {
      const line = formatIntegrityLine('Before', 100);
      expect(line).toBe('Before: 100.0%');
      expect(/^Before: \d+(\.\d+)?%$/.test(line)).toBe(true);
    });

    it('handles zero correctly', () => {
      const line = formatIntegrityLine('After', 0);
      expect(line).toBe('After: 0.0%');
    });

    it('formats to exactly one decimal place', () => {
      // 95.123 should become 95.1
      const line1 = formatIntegrityLine('Before', 95.123);
      expect(line1).toBe('Before: 95.1%');

      // 99.999 should become 100.0
      const line2 = formatIntegrityLine('After', 99.999);
      expect(line2).toBe('After: 100.0%');
    });
  });

  describe('changes line format', () => {
    it('formats Applied count', () => {
      const line = formatChangesLine('Applied', 10);
      expect(line).toBe('Applied: 10');
    });

    it('formats Blocked count', () => {
      const line = formatChangesLine('Blocked', 2);
      expect(line).toBe('Blocked: 2');
    });

    it('handles zero counts', () => {
      expect(formatChangesLine('Applied', 0)).toBe('Applied: 0');
      expect(formatChangesLine('Blocked', 0)).toBe('Blocked: 0');
    });
  });

  describe('CI workflow regex patterns', () => {
    // These patterns must stay aligned with audio-auto-repair.yml
    const BEFORE_PATTERN = /^Before: (\d+(?:\.\d+)?)%$/;
    const AFTER_PATTERN = /^After: (\d+(?:\.\d+)?)%$/;
    const APPLIED_PATTERN = /^Applied: (\d+)$/;
    const BLOCKED_PATTERN = /^Blocked: (\d+)$/;

    it('Before line matches and extracts value', () => {
      const line = formatIntegrityLine('Before', 95.5);
      const match = line.match(BEFORE_PATTERN);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('95.5');
    });

    it('After line matches and extracts value', () => {
      const line = formatIntegrityLine('After', 99.0);
      const match = line.match(AFTER_PATTERN);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('99.0');
    });

    it('Applied line matches and extracts value', () => {
      const line = formatChangesLine('Applied', 42);
      const match = line.match(APPLIED_PATTERN);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('42');
    });

    it('Blocked line matches and extracts value', () => {
      const line = formatChangesLine('Blocked', 5);
      const match = line.match(BLOCKED_PATTERN);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('5');
    });
  });
});
