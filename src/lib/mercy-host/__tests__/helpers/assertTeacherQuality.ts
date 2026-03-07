/**
 * assertTeacherQuality
 *
 * Helper assertions used by Mercy Host tests to ensure replies
 * sound like a real teacher instead of a robotic system.
 *
 * Goals:
 * - enforce clarity
 * - avoid rambling
 * - avoid duplicate sentences
 * - ensure actionable teaching
 * - catch accidental empty / broken replies
 */

import { expect } from 'vitest';

export interface TeacherQualityOptions {
  maxLength?: number;
  requireAction?: boolean;
  forbidHumor?: boolean;
}

function normalize(text: string): string {
  return String(text ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function splitSentences(text: string): string[] {
  return normalize(text)
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function containsTeachingVerb(text: string): boolean {
  const verbs = [
    'try',
    'say',
    'rewrite',
    'translate',
    'make',
    'build',
    'practice',
    'focus',
    'remember',
  ];

  const normalized = normalize(text);

  return verbs.some((v) => normalized.includes(v));
}

function containsOvertHumor(text: string): boolean {
  const humorMarkers = [
    'haha',
    'lol',
    'grammar gods',
    'bite you',
    'meaner version',
  ];

  const normalized = normalize(text);

  return humorMarkers.some((m) => normalized.includes(m));
}

function detectSentenceDuplication(text: string): boolean {
  const sentences = splitSentences(text);

  const seen = new Set<string>();

  for (const s of sentences) {
    if (seen.has(s)) return true;
    seen.add(s);
  }

  return false;
}

/**
 * Main assertion helper used by Mercy voice tests.
 */
export function assertTeacherQuality(
  text: string,
  options: TeacherQualityOptions = {}
) {
  const { maxLength = 400, requireAction = true, forbidHumor = false } = options;

  const normalized = normalize(text);

  /* ----------------------------------------------------------- */
  /* basic sanity                                                */
  /* ----------------------------------------------------------- */

  expect(normalized.length).toBeGreaterThan(5);
  expect(normalized.length).toBeLessThan(maxLength);

  /* ----------------------------------------------------------- */
  /* avoid duplicate sentences                                   */
  /* ----------------------------------------------------------- */

  expect(detectSentenceDuplication(text)).toBe(false);

  /* ----------------------------------------------------------- */
  /* ensure actionable teaching                                  */
  /* ----------------------------------------------------------- */

  if (requireAction) {
    expect(containsTeachingVerb(text)).toBe(true);
  }

  /* ----------------------------------------------------------- */
  /* humor suppression when required                             */
  /* ----------------------------------------------------------- */

  if (forbidHumor) {
    expect(containsOvertHumor(text)).toBe(false);
  }

  /* ----------------------------------------------------------- */
  /* ensure not empty fragments                                  */
  /* ----------------------------------------------------------- */

  const sentences = splitSentences(text);

  for (const s of sentences) {
    expect(s.length).toBeGreaterThan(2);
  }
}