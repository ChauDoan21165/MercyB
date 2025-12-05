/**
 * Phase 4.7 Contract Test: CLI Mode Parsing
 * 
 * This test locks the CLI argument parsing behavior that the workflow
 * and documentation depend on.
 */

import { describe, it, expect } from 'vitest';
import { parseAutopilotCliOptions, type ParsedCliOptions } from '../cliHelpers';

describe('Autopilot CLI modes (Phase 4.7)', () => {
  it('defaults to dry-run + normal when no flags provided', () => {
    const opts = parseAutopilotCliOptions([]);
    expect(opts.mode).toBe('dry-run');
    expect(opts.cycleMode).toBe('normal');
    expect(opts.governanceMode).toBe('strict');
  });

  it('supports apply mode', () => {
    const opts = parseAutopilotCliOptions(['--apply']);
    expect(opts.mode).toBe('apply');
    expect(opts.cycleMode).toBe('normal');
  });

  it('supports dry-run mode explicitly', () => {
    const opts = parseAutopilotCliOptions(['--dry-run']);
    expect(opts.mode).toBe('dry-run');
  });

  it('apply wins when both --apply and --dry-run are present', () => {
    const opts = parseAutopilotCliOptions(['--dry-run', '--apply']);
    expect(opts.mode).toBe('apply');
  });

  it('supports fast cycle mode', () => {
    const opts = parseAutopilotCliOptions(['--dry-run', '--fast']);
    expect(opts.mode).toBe('dry-run');
    expect(opts.cycleMode).toBe('fast');
  });

  it('supports deep cycle mode', () => {
    const opts = parseAutopilotCliOptions(['--apply', '--deep']);
    expect(opts.mode).toBe('apply');
    expect(opts.cycleMode).toBe('deep');
  });

  it('deep wins over fast if both are present (explicit priority)', () => {
    const opts = parseAutopilotCliOptions(['--dry-run', '--fast', '--deep']);
    expect(opts.mode).toBe('dry-run');
    expect(opts.cycleMode).toBe('deep');
  });

  it('fast mode limits maxRooms to 50 and maxChanges to 100', () => {
    const opts = parseAutopilotCliOptions(['--fast']);
    expect(opts.maxRooms).toBeLessThanOrEqual(50);
    expect(opts.maxChanges).toBeLessThanOrEqual(100);
  });

  it('deep mode sets maxRooms to 999 and maxChanges to 2000', () => {
    const opts = parseAutopilotCliOptions(['--deep']);
    expect(opts.maxRooms).toBe(999);
    expect(opts.maxChanges).toBe(2000);
  });

  it('parses --rooms filter', () => {
    const opts = parseAutopilotCliOptions(['--rooms', 'vip1']);
    expect(opts.roomFilter).toBe('vip1');
  });

  it('parses --max-rooms limit', () => {
    const opts = parseAutopilotCliOptions(['--max-rooms', '25']);
    expect(opts.maxRooms).toBe(25);
  });

  it('parses --max-changes limit', () => {
    const opts = parseAutopilotCliOptions(['--max-changes', '200']);
    expect(opts.maxChanges).toBe(200);
  });

  it('parses --governance-mode', () => {
    const opts1 = parseAutopilotCliOptions(['--governance-mode', 'auto']);
    expect(opts1.governanceMode).toBe('auto');

    const opts2 = parseAutopilotCliOptions(['--governance-mode', 'assisted']);
    expect(opts2.governanceMode).toBe('assisted');

    const opts3 = parseAutopilotCliOptions(['--governance-mode', 'strict']);
    expect(opts3.governanceMode).toBe('strict');
  });

  it('ignores invalid governance mode and defaults to strict', () => {
    const opts = parseAutopilotCliOptions(['--governance-mode', 'invalid']);
    expect(opts.governanceMode).toBe('strict');
  });

  it('parses --cycle-label', () => {
    const opts = parseAutopilotCliOptions(['--cycle-label', 'nightly-fix']);
    expect(opts.cycleLabel).toBe('nightly-fix');
  });

  it('parses --save-artifacts path', () => {
    const opts = parseAutopilotCliOptions(['--save-artifacts', './tmp/artifacts']);
    expect(opts.saveArtifactsDir).toBe('./tmp/artifacts');
  });

  it('parses --with-tts flag', () => {
    const opts = parseAutopilotCliOptions(['--with-tts']);
    expect(opts.withTTS).toBe(true);
  });

  it('parses --verbose flag', () => {
    const opts = parseAutopilotCliOptions(['--verbose']);
    expect(opts.verbose).toBe(true);
  });

  it('handles complex combined flags', () => {
    const opts = parseAutopilotCliOptions([
      '--apply',
      '--deep',
      '--rooms', 'vip2',
      '--governance-mode', 'assisted',
      '--cycle-label', 'hotfix-123',
      '--with-tts',
      '--verbose',
    ]);

    expect(opts.mode).toBe('apply');
    expect(opts.cycleMode).toBe('deep');
    expect(opts.roomFilter).toBe('vip2');
    expect(opts.governanceMode).toBe('assisted');
    expect(opts.cycleLabel).toBe('hotfix-123');
    expect(opts.withTTS).toBe(true);
    expect(opts.verbose).toBe(true);
  });
});
