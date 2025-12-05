/**
 * Phase 7 Tests: Logs + Teacher Scripts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { logEvent, getRecentLogs, clearLogs, getLogSummary } from '../lib/mercy-host/logs';
import { getDomainCategory, isEnglishDomain, isHealthDomain } from '../lib/mercy-host/domainMap';
import { getTeacherTip, validateTeacherTips } from '../lib/mercy-host/teacherScripts';

describe('Mercy Logs', () => {
  beforeEach(() => {
    clearLogs();
  });

  it('should log events and retrieve them', () => {
    logEvent({ type: 'room_enter', roomId: 'test_room' });
    logEvent({ type: 'entry_click', entrySlug: 'entry_1' });

    const logs = getRecentLogs(10);
    expect(logs.length).toBe(2);
    expect(logs[0].type).toBe('entry_click'); // newest first
    expect(logs[1].type).toBe('room_enter');
  });

  it('should generate unique IDs and timestamps', () => {
    const event1 = logEvent({ type: 'room_enter' });
    const event2 = logEvent({ type: 'room_enter' });

    expect(event1.id).not.toBe(event2.id);
    expect(event1.timestampISO).toBeDefined();
  });

  it('should provide log summary counts', () => {
    logEvent({ type: 'room_enter' });
    logEvent({ type: 'room_enter' });
    logEvent({ type: 'entry_click' });

    const summary = getLogSummary();
    expect(summary.room_enter).toBe(2);
    expect(summary.entry_click).toBe(1);
    expect(summary.vip_upgrade).toBe(0);
  });

  it('should clear logs', () => {
    logEvent({ type: 'room_enter' });
    clearLogs();
    expect(getRecentLogs().length).toBe(0);
  });
});

describe('Domain Map', () => {
  it('should detect English domains', () => {
    expect(isEnglishDomain('english_foundation_ef01')).toBe(true);
    expect(isEnglishDomain('ef_01_alphabet')).toBe(true);
    expect(isEnglishDomain('a1_beginner_01')).toBe(true);
    expect(isEnglishDomain(null, 'English')).toBe(true);
    expect(isEnglishDomain(null, 'English Foundation Ladder')).toBe(true);
  });

  it('should detect health domains', () => {
    expect(isHealthDomain('anxiety_relief')).toBe(true);
    expect(isHealthDomain('mental_health_room')).toBe(true);
    expect(isHealthDomain(null, 'Healing')).toBe(true);
  });

  it('should categorize domains correctly', () => {
    expect(getDomainCategory('english_foundation_ef01')).toBe('english');
    expect(getDomainCategory('anxiety_relief')).toBe('health');
    expect(getDomainCategory('strategic_thinking_vip7')).toBe('strategy');
    expect(getDomainCategory('kids_level_1_room')).toBe('kids');
    expect(getDomainCategory('random_room')).toBe('other');
  });
});

describe('Teacher Scripts', () => {
  it('should return teacher tips for all contexts', () => {
    const contexts = ['ef_room_enter', 'ef_entry_complete', 'ef_streak', 'ef_return_after_gap'] as const;
    const levels = ['gentle', 'normal', 'intense'] as const;

    for (const level of levels) {
      for (const context of contexts) {
        const tip = getTeacherTip({ teacherLevel: level, context });
        expect(tip.en).toBeDefined();
        expect(tip.vi).toBeDefined();
        expect(tip.en.length).toBeGreaterThan(0);
        expect(tip.vi.length).toBeGreaterThan(0);
      }
    }
  });

  it('should keep tips under 120 characters', () => {
    const validation = validateTeacherTips();
    expect(validation.valid).toBe(true);
    if (!validation.valid) {
      console.error('Teacher tip validation errors:', validation.errors);
    }
  });

  it('should replace name placeholders', () => {
    const tip = getTeacherTip({
      teacherLevel: 'normal',
      context: 'ef_room_enter',
      userName: 'TestUser'
    });
    // Tips may or may not have {{name}} - just ensure no crash
    expect(tip.en).not.toContain('{{name}}');
  });
});
