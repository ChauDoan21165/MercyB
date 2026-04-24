// Regression tests for the defensive behaviour of firstL1HintFromIssues.
// Grammar API serverless function returned 500 in production — the real
// root cause was Vercel's bundler failing on the old server/mercy/
// import path (see fix/grammar-api-import-path, which moved this file
// to api/_lib/). This suite also locks in the defensive handling of
// junk inputs so no malformed OpenAI response can re-break the endpoint.

import { describe, expect, it } from 'vitest';
import { firstL1HintFromIssues } from '../l1HintAdapter';

describe('firstL1HintFromIssues — defensive behaviour', () => {
  it('returns null when issues is undefined', () => {
    expect(firstL1HintFromIssues(undefined)).toBeNull();
  });

  it('returns null when issues is null', () => {
    expect(firstL1HintFromIssues(null)).toBeNull();
  });

  it('returns null when issues is an empty array', () => {
    expect(firstL1HintFromIssues([])).toBeNull();
  });

  it('does not throw when an entry is null', () => {
    expect(() =>
      firstL1HintFromIssues([null as unknown as never]),
    ).not.toThrow();
    expect(firstL1HintFromIssues([null as unknown as never])).toBeNull();
  });

  it('does not throw when an entry is not an object', () => {
    const issues = ['oops' as unknown as never, 42 as unknown as never];
    expect(() => firstL1HintFromIssues(issues)).not.toThrow();
    expect(firstL1HintFromIssues(issues)).toBeNull();
  });

  it('does not throw when before/original/corrected/after are non-string types', () => {
    const issues = [
      { before: null, corrected: null },
      { original: 123, after: true },
      { before: {}, corrected: [] },
    ] as unknown as never[];
    expect(() => firstL1HintFromIssues(issues)).not.toThrow();
    expect(firstL1HintFromIssues(issues)).toBeNull();
  });

  it('skips entries with empty before/corrected and continues to the next', () => {
    const issues = [
      { before: '', corrected: '' },
      { before: 'she study', corrected: 'she studies' },
    ];
    const hit = firstL1HintFromIssues(issues);
    expect(hit).not.toBeNull();
    expect(hit?.weaknessTag).toBe('vi_l1_3rd_person_s');
  });

  it('accepts `original` / `after` as alternative field names (OpenAI shape)', () => {
    const hit = firstL1HintFromIssues([
      { original: 'she study', corrected: 'she studies', reason: 'verb' } as any,
    ]);
    expect(hit).not.toBeNull();
    expect(hit?.weaknessTag).toBe('vi_l1_3rd_person_s');
  });

  it('returns the first priority match when multiple issues would qualify', () => {
    const hit = firstL1HintFromIssues([
      { before: 'she study english', corrected: 'she studies english' },
      { before: 'yesterday i walk', corrected: 'yesterday i walked' },
    ]);
    expect(hit).not.toBeNull();
    expect(hit?.weaknessTag).toBe('vi_l1_3rd_person_s'); // rule 1 before rule 2
  });

  it('returns null when no rule matches on any issue', () => {
    const hit = firstL1HintFromIssues([
      { before: 'hello world', corrected: 'hello world' },
      { before: 'random text', corrected: 'unrelated' },
    ]);
    expect(hit).toBeNull();
  });

  it('feedback payload is bilingual and contains placeholders filled', () => {
    const hit = firstL1HintFromIssues([
      { before: 'she study', corrected: 'she studies' },
    ]);
    expect(hit).not.toBeNull();
    expect(hit!.feedback.en.length).toBeGreaterThan(0);
    expect(hit!.feedback.vi.length).toBeGreaterThan(0);
    // The corrected sentence must appear in both languages' feedback.
    expect(hit!.feedback.en).toContain('she studies');
    expect(hit!.feedback.vi).toContain('she studies');
  });
});
