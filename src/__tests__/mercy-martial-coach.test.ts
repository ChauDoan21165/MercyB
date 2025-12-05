/**
 * Mercy Martial Coach Tests - Phase 8
 */

import { describe, it, expect } from 'vitest';
import { isMartialDomain, getDomainCategory } from '@/lib/mercy-host/domainMap';
import { 
  getMartialCoachTip, 
  validateMartialCoachTips, 
  inferMartialDiscipline,
  type MartialCoachLevel 
} from '@/lib/mercy-host/martialCoachScripts';

describe('Martial Domain Detection', () => {
  it('detects martial domain from roomId', () => {
    expect(isMartialDomain('martial_sword_dojo')).toBe(true);
    expect(isMartialDomain('karate_basics')).toBe(true);
    expect(isMartialDomain('boxing_training')).toBe(true);
    expect(isMartialDomain('bjj_fundamentals')).toBe(true);
    expect(isMartialDomain('samurai_mindset')).toBe(true);
  });

  it('detects martial domain from roomDomain', () => {
    expect(isMartialDomain(null, 'Martial Arts Dojo')).toBe(true);
    expect(isMartialDomain(null, 'Combat Training')).toBe(true);
    expect(isMartialDomain(null, 'Kung Fu Academy')).toBe(true);
  });

  it('detects martial domain from tags', () => {
    expect(isMartialDomain(null, null, ['martial_arts'])).toBe(true);
    expect(isMartialDomain(null, null, ['combat_sport'])).toBe(true);
    expect(isMartialDomain(null, null, ['martial'])).toBe(true);
  });

  it('returns false for non-martial content', () => {
    expect(isMartialDomain('english_basics')).toBe(false);
    expect(isMartialDomain(null, 'English Foundation')).toBe(false);
    expect(isMartialDomain(null, null, ['language'])).toBe(false);
  });

  it('getDomainCategory returns martial for martial rooms', () => {
    expect(getDomainCategory('martial_sword_dojo')).toBe('martial');
    expect(getDomainCategory('karate_training')).toBe('martial');
  });
});

describe('Martial Coach Tips', () => {
  const levels: MartialCoachLevel[] = ['gentle', 'focused', 'dojo'];
  const contexts = [
    'martial_room_enter',
    'martial_entry_complete', 
    'martial_low_mood',
    'martial_stressed',
    'martial_failure_reframe',
    'martial_victory'
  ] as const;

  it('returns empty tip for off level', () => {
    const tip = getMartialCoachTip({ level: 'off', context: 'martial_room_enter' });
    expect(tip.id).toBe('martial_off');
    expect(tip.en).toBe('');
    expect(tip.vi).toBe('');
  });

  it('returns non-empty tips for active levels', () => {
    levels.forEach(level => {
      contexts.forEach(context => {
        const tip = getMartialCoachTip({ level, context });
        expect(tip.en.length).toBeGreaterThan(0);
        expect(tip.vi.length).toBeGreaterThan(0);
      });
    });
  });

  it('replaces {{name}} placeholder with userName', () => {
    const tip = getMartialCoachTip({ 
      level: 'gentle', 
      context: 'martial_room_enter', 
      userName: 'Warrior' 
    });
    expect(tip.en).not.toContain('{{name}}');
    expect(tip.vi).not.toContain('{{name}}');
  });

  it('all tips are ≤140 characters', () => {
    const validation = validateMartialCoachTips();
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });
});

describe('Discipline Inference', () => {
  it('infers sword discipline', () => {
    expect(inferMartialDiscipline('sword_training_vip3')).toBe('sword');
    expect(inferMartialDiscipline('samurai_mindset')).toBe('sword');
  });

  it('infers boxing discipline', () => {
    expect(inferMartialDiscipline('boxing_basics')).toBe('boxing');
  });

  it('infers karate discipline', () => {
    expect(inferMartialDiscipline('karate_kata_1')).toBe('karate');
  });

  it('infers bjj discipline', () => {
    expect(inferMartialDiscipline('bjj_guard_passes')).toBe('bjj');
  });

  it('returns martial for unknown discipline', () => {
    expect(inferMartialDiscipline('combat_training')).toBe('martial');
  });
});
