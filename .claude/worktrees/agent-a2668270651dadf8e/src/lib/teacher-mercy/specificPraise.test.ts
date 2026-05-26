/**
 * VERSION: specificPraise.test.ts v1
 *
 * Tests for Mercy specific praise generation.
 *
 * Purpose:
 * - verify praise is specific, stable, and appropriate
 * - protect against regressions back to vague praise
 */

import { describe, expect, it } from 'vitest';
import {
  generateSpecificPraise,
  getSpecificPraiseText,
} from './specificPraise';

describe('generateSpecificPraise', () => {
  it('returns fixed_mistake praise when fix is present', () => {
    const result = generateSpecificPraise({
      language: 'en',
      fix: 'matching the denominators first',
    });

    expect(result.tag).toBe('fixed_mistake');
    expect(result.short.toLowerCase()).toContain('fixed');
  });

  it('returns good_retry for repeated mistake during corrective turn', () => {
    const result = generateSpecificPraise({
      language: 'en',
      repeatedMistake: true,
      wasCorrectiveTurn: true,
    });

    expect(result.tag).toBe('good_retry');
    expect(result.short.toLowerCase()).toContain('repair');
  });

  it('returns kept_rule when rule_use improvement is present', () => {
    const result = generateSpecificPraise({
      language: 'en',
      concept: 'fractions',
      improvementType: 'rule_use',
    });

    expect(result.tag).toBe('kept_rule');
    expect(result.medium.toLowerCase()).toContain('fractions');
  });

  it('returns pronunciation praise for pronunciation-like concept', () => {
    const result = generateSpecificPraise({
      language: 'en',
      concept: 'pronunciation',
    });

    expect(result.tag).toBe('cleaner_step');
    expect(result.short.toLowerCase()).toContain('sound');
  });

  it('returns structure praise for grammar / structure-like concept', () => {
    const result = generateSpecificPraise({
      language: 'en',
      concept: 'sentence structure',
    });

    expect(result.tag).toBe('good_structure');
    expect(result.short.toLowerCase()).toContain('structure');
  });

  it('returns momentum praise when challenge is desired', () => {
    const result = generateSpecificPraise({
      language: 'en',
      wantsChallenge: true,
    });

    expect(result.tag).toBe('good_momentum');
    expect(result.medium.toLowerCase()).toContain('harder');
  });

  it('falls back cleanly when no specific signals are present', () => {
    const result = generateSpecificPraise({
      language: 'en',
    });

    expect(result.tag).toBe('fallback');
    expect(result.short.length).toBeGreaterThan(0);
    expect(result.medium.length).toBeGreaterThan(0);
  });

  it('produces Vietnamese praise when language is vi', () => {
    const result = generateSpecificPraise({
      language: 'vi',
      fix: 'mẫu số trước',
    });

    expect(result.tag).toBe('fixed_mistake');
    expect(result.short).toContain('Tốt');
  });
});

describe('getSpecificPraiseText', () => {
  it('returns short by default', () => {
    const result = getSpecificPraiseText({
      language: 'en',
      fix: 'the denominator',
    });

    expect(result.toLowerCase()).toContain('fixed');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns medium when requested', () => {
    const result = getSpecificPraiseText({
      language: 'en',
      fix: 'the denominator',
      length: 'medium',
    });

    expect(result.toLowerCase()).toContain('keep');
  });

  it('returns structure-focused medium praise when requested', () => {
    const result = getSpecificPraiseText({
      language: 'en',
      concept: 'grammar structure',
      length: 'medium',
    });

    expect(result.toLowerCase()).toContain('structure');
  });
});