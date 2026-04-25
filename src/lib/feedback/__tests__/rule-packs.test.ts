// src/lib/feedback/__tests__/rule-packs.test.ts
//
// Step 10 — refactor verification tests:
//   1. Pack validation catches missing/invalid fields.
//   2. The detector engine works against an arbitrary pack (proves it
//      is genuinely language-agnostic, not VN-coupled).
//   3. resolveRulePack returns the right pack and falls back to VN.
//   4. Golden parity: a curated handful of detector outputs from
//      detectL1Error (which routes through the VN pack) match expected
//      shapes — a smoke check on top of the 278 existing tests.

import { describe, expect, it } from 'vitest';

import {
  detectErrors,
  detectL1Error,
  resolveRulePack,
  validateRulePack,
  VN_RULE_PACK,
  DEFAULT_RULE_PACK,
  type L1DetectionInput,
  type L1Rule,
  type L1RulePack,
} from '..';

// ──────────────────────────────────────────────────────────────────────
// 1. validateRulePack
// ──────────────────────────────────────────────────────────────────────

describe('validateRulePack', () => {
  it('accepts the production VN pack', () => {
    expect(validateRulePack(VN_RULE_PACK)).toEqual([]);
  });

  it('flags missing l1Code / l1Name / version', () => {
    const issues = validateRulePack({
      l1Code: '',
      l1Name: '',
      version: 'not-a-version',
      rules: [() => null],
      explanations: [{ tag: 'x', en: 'a', vi: 'b' }],
    });
    expect(issues).toContain('l1Code is required and must be a non-empty string');
    expect(issues).toContain('l1Name is required and must be a non-empty string');
    expect(issues.find((m) => m.includes('version'))).toBeDefined();
  });

  it('rejects empty rule and explanation arrays', () => {
    const issues = validateRulePack({
      l1Code: 'xx',
      l1Name: 'Test',
      version: '0.1',
      rules: [],
      explanations: [],
    });
    expect(issues).toContain('rules array is empty');
    expect(issues).toContain('explanations array is empty');
  });

  it('rejects non-function entries in rules', () => {
    const issues = validateRulePack({
      l1Code: 'xx',
      l1Name: 'Test',
      version: '0.1',
      // @ts-expect-error — runtime guard is the point
      rules: ['not a function'],
      explanations: [{ tag: 'x', en: 'a', vi: 'b' }],
    });
    expect(issues).toContain('a rule entry is not a function');
  });

  it('flags duplicate explanation tags', () => {
    const issues = validateRulePack({
      l1Code: 'xx',
      l1Name: 'Test',
      version: '0.1',
      rules: [() => null],
      explanations: [
        { tag: 'dup', en: 'a', vi: 'b' },
        { tag: 'dup', en: 'c', vi: 'd' },
      ],
    });
    expect(issues.find((m) => m.includes('duplicate explanation tag: dup'))).toBeDefined();
  });

  it('flags blank en/vi strings on explanations', () => {
    const issues = validateRulePack({
      l1Code: 'xx',
      l1Name: 'Test',
      version: '0.1',
      rules: [() => null],
      explanations: [{ tag: 'x', en: '', vi: '   ' }],
    });
    expect(issues).toContain('explanation.en is empty for tag x');
    expect(issues).toContain('explanation.vi is empty for tag x');
  });
});

// ──────────────────────────────────────────────────────────────────────
// 2. detectErrors against a STUB pack (engine is language-agnostic)
// ──────────────────────────────────────────────────────────────────────

describe('detectErrors with a stub language pack', () => {
  // Toy "pack" that fires whenever the user wrote "TROUT" (uppercase
  // present in raw user input) and the expected text is different.
  // No L1 — purely a contract proof.
  const stubRule: L1Rule = ({ rawUser, rawExpected }) => {
    if (/\bTROUT\b/.test(rawUser) && rawUser !== rawExpected) {
      return { tag: 'stub_no_caps', replacements: { FIX: rawExpected } };
    }
    return null;
  };

  const STUB_PACK: L1RulePack = {
    l1Code: 'xx',
    l1Name: 'Stub Language',
    version: '0.0.1',
    rules: [stubRule],
    explanations: [
      {
        tag: 'stub_no_caps',
        en: 'Try lowercase: *{FIX}*.',
        vi: 'Hãy viết thường: *{FIX}*.',
      },
    ],
  };

  it('matches via the stub pack and routes the right feedback string', () => {
    // Engine short-circuits when user/expected are lowercase-equal, so
    // the inputs must differ in more than just case for the rule to run.
    const result = detectErrors(
      { userAnswer: 'I caught a TROUT today', expectedAnswer: 'I caught a salmon' },
      STUB_PACK,
    );
    expect(result.matched).toBe(true);
    if (result.matched) {
      expect(result.weaknessTag).toBe('stub_no_caps');
      expect(result.feedback.en).toContain('Try lowercase');
      expect(result.feedback.vi).toContain('viết thường');
    }
  });

  it('returns no-match when the stub rule does not fire', () => {
    const result = detectErrors(
      { userAnswer: 'hello', expectedAnswer: 'hi' },
      STUB_PACK,
    );
    expect(result.matched).toBe(false);
  });

  it('returns no-match (fail-open) when a rule fires with an unmapped tag', () => {
    // A pack with a rule that emits a tag not present in explanations.
    const brokenRule: L1Rule = () => ({
      tag: 'orphan_tag',
      replacements: {},
    });
    const broken: L1RulePack = {
      ...STUB_PACK,
      rules: [brokenRule],
      // Same explanations — no entry for 'orphan_tag'
    };
    const result = detectErrors(
      { userAnswer: 'a', expectedAnswer: 'b' },
      broken,
    );
    expect(result.matched).toBe(false);
  });

  it('skips both directions of empty input without invoking rules', () => {
    let invocations = 0;
    const counter: L1Rule = () => {
      invocations += 1;
      return null;
    };
    const tinyPack: L1RulePack = {
      ...STUB_PACK,
      rules: [counter],
    };
    detectErrors({ userAnswer: '', expectedAnswer: 'foo' }, tinyPack);
    detectErrors({ userAnswer: 'foo', expectedAnswer: '' }, tinyPack);
    detectErrors({ userAnswer: 'same', expectedAnswer: 'same' }, tinyPack);
    expect(invocations).toBe(0);
  });
});

// ──────────────────────────────────────────────────────────────────────
// 3. resolveRulePack
// ──────────────────────────────────────────────────────────────────────

describe('resolveRulePack', () => {
  it("returns VN for 'vi' code", () => {
    expect(resolveRulePack('vi')).toBe(VN_RULE_PACK);
  });

  it('is case-insensitive and trims whitespace', () => {
    expect(resolveRulePack('  VI  ')).toBe(VN_RULE_PACK);
  });

  it('falls back to the default (VN) for unknown codes', () => {
    expect(resolveRulePack('ko')).toBe(DEFAULT_RULE_PACK);
    expect(resolveRulePack('zz-fake')).toBe(DEFAULT_RULE_PACK);
  });

  it('falls back to the default for null / undefined / empty', () => {
    expect(resolveRulePack(null)).toBe(DEFAULT_RULE_PACK);
    expect(resolveRulePack(undefined)).toBe(DEFAULT_RULE_PACK);
    expect(resolveRulePack('')).toBe(DEFAULT_RULE_PACK);
  });
});

// ──────────────────────────────────────────────────────────────────────
// 4. Golden smoke: detectL1Error (post-refactor) on representative
//    inputs. The full 278-test suite is the real golden — these are a
//    quick visible-in-PR confidence check.
// ──────────────────────────────────────────────────────────────────────

describe('detectL1Error (post-refactor) — golden smoke', () => {
  function run(user: string, expected: string): { tag: string | null } {
    const result = detectL1Error({
      userAnswer: user,
      expectedAnswer: expected,
    } as L1DetectionInput);
    return { tag: result.matched ? result.weaknessTag : null };
  }

  it('still flags 3rd-person -s', () => {
    expect(run('She go to school', 'She goes to school').tag).toBe('vi_l1_3rd_person_s');
  });

  it('still flags past -ed', () => {
    expect(run('Yesterday I work hard', 'Yesterday I worked hard').tag).toBe('vi_l1_past_ed');
  });

  it('still flags plural -s', () => {
    expect(run('I have two book', 'I have two books').tag).toBe('vi_l1_plural_s');
  });

  it('still flags missing be', () => {
    expect(run('I tired', 'I am tired').tag).toBe('vi_l1_missing_be');
  });

  it('still returns no match for identical input', () => {
    expect(run('I am tired', 'I am tired').tag).toBeNull();
  });
});
