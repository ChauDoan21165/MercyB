// @vitest-environment jsdom
//
// Tests for src/lib/stage-3a/adapters/pronunciationAdapter.ts
//
// Coverage:
//   1. Write → read roundtrip (single + multi-entry).
//   2. FIFO cap of PRONUNCIATION_RECENT_MAX, oldest dropped.
//   3. Pain-point axis preserved on read (and stripped if invalid).
//   4. Tolerates missing / disabled localStorage — never throws.
//   5. Resilient to schema drift (malformed entries skipped silently).

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  PRONUNCIATION_RECENT_KEY,
  PRONUNCIATION_RECENT_MAX,
  readPronunciationRecent,
  recordPronunciationPhonemes,
  type PhonemeResult,
} from '../pronunciationAdapter';

beforeEach(() => {
  try {
    window.localStorage.clear();
  } catch {
    /* environment without storage — OK */
  }
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ────────────────────────────────────────────────────────────────────────
// Roundtrip
// ────────────────────────────────────────────────────────────────────────

describe('pronunciationAdapter — write + read roundtrip', () => {
  it('returns [] on a fresh storage', () => {
    expect(readPronunciationRecent()).toEqual([]);
  });

  it('records one phoneme and reads it back', () => {
    const entry: PhonemeResult = {
      phoneme: 'th',
      accuracy: 72,
      ts: 1_780_000_000_000,
    };
    recordPronunciationPhonemes([entry]);
    expect(readPronunciationRecent()).toEqual([entry]);
  });

  it('records multiple phonemes in order across two calls', () => {
    recordPronunciationPhonemes([
      { phoneme: 'th', accuracy: 60, ts: 1 },
      { phoneme: 'r', accuracy: 75, ts: 2 },
    ]);
    recordPronunciationPhonemes([
      { phoneme: 'l', accuracy: 80, ts: 3 },
    ]);
    expect(readPronunciationRecent()).toEqual([
      { phoneme: 'th', accuracy: 60, ts: 1 },
      { phoneme: 'r', accuracy: 75, ts: 2 },
      { phoneme: 'l', accuracy: 80, ts: 3 },
    ]);
  });

  it('writes to the canonical localStorage key', () => {
    recordPronunciationPhonemes([{ phoneme: 'th', accuracy: 50, ts: 1 }]);
    const raw = window.localStorage.getItem(PRONUNCIATION_RECENT_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw as string)).toEqual([
      { phoneme: 'th', accuracy: 50, ts: 1 },
    ]);
  });
});

// ────────────────────────────────────────────────────────────────────────
// FIFO cap
// ────────────────────────────────────────────────────────────────────────

describe('pronunciationAdapter — FIFO cap', () => {
  it('keeps the latest PRONUNCIATION_RECENT_MAX entries, drops oldest', () => {
    const batchA: PhonemeResult[] = Array.from(
      { length: PRONUNCIATION_RECENT_MAX },
      (_, i) => ({ phoneme: 'a', accuracy: 50, ts: i }),
    );
    recordPronunciationPhonemes(batchA);
    expect(readPronunciationRecent().length).toBe(PRONUNCIATION_RECENT_MAX);

    // Pushing 5 more should drop the first 5.
    const batchB: PhonemeResult[] = [
      { phoneme: 'b', accuracy: 60, ts: PRONUNCIATION_RECENT_MAX + 0 },
      { phoneme: 'b', accuracy: 61, ts: PRONUNCIATION_RECENT_MAX + 1 },
      { phoneme: 'b', accuracy: 62, ts: PRONUNCIATION_RECENT_MAX + 2 },
      { phoneme: 'b', accuracy: 63, ts: PRONUNCIATION_RECENT_MAX + 3 },
      { phoneme: 'b', accuracy: 64, ts: PRONUNCIATION_RECENT_MAX + 4 },
    ];
    recordPronunciationPhonemes(batchB);
    const after = readPronunciationRecent();
    expect(after.length).toBe(PRONUNCIATION_RECENT_MAX);
    // Oldest 5 dropped — the first remaining entry should be ts=5.
    expect(after[0]).toEqual({ phoneme: 'a', accuracy: 50, ts: 5 });
    // Newest 5 present at the end.
    expect(after.slice(-5)).toEqual(batchB);
  });

  it('caps within a single oversized append call', () => {
    const oversize: PhonemeResult[] = Array.from(
      { length: PRONUNCIATION_RECENT_MAX + 10 },
      (_, i) => ({ phoneme: 'p', accuracy: 70, ts: i }),
    );
    recordPronunciationPhonemes(oversize);
    const after = readPronunciationRecent();
    expect(after.length).toBe(PRONUNCIATION_RECENT_MAX);
    // First 10 dropped — earliest remaining ts is 10.
    expect(after[0].ts).toBe(10);
  });
});

// ────────────────────────────────────────────────────────────────────────
// Pain-point axis tagging
// ────────────────────────────────────────────────────────────────────────

describe('pronunciationAdapter — pain-point axis', () => {
  it('preserves a valid painPointAxis on read', () => {
    recordPronunciationPhonemes([
      { phoneme: 'th', accuracy: 65, ts: 1, painPointAxis: 'TH_T' },
      { phoneme: 'r', accuracy: 70, ts: 2, painPointAxis: 'R_L' },
    ]);
    const after = readPronunciationRecent();
    expect(after[0].painPointAxis).toBe('TH_T');
    expect(after[1].painPointAxis).toBe('R_L');
  });

  it('preserves all six valid axis values', () => {
    const axes: PhonemeResult['painPointAxis'][] = [
      'TH_T',
      'R_L',
      'ED_ENDINGS',
      'S_PLURALS',
      'STRESS',
      'INTONATION',
    ];
    recordPronunciationPhonemes(
      axes.map((axis, i) => ({ phoneme: 'x', accuracy: 50, ts: i, painPointAxis: axis })),
    );
    const after = readPronunciationRecent();
    expect(after.map((e) => e.painPointAxis)).toEqual(axes);
  });

  it('omits painPointAxis when not provided', () => {
    recordPronunciationPhonemes([{ phoneme: 'th', accuracy: 65, ts: 1 }]);
    const [entry] = readPronunciationRecent();
    expect(entry.painPointAxis).toBeUndefined();
  });

  it('drops an invalid painPointAxis value at read time (schema-drift defense)', () => {
    // Hand-write a junk value to localStorage — simulates an older
    // entry from a prior schema. The sanitizer must drop the bad
    // axis but keep the rest of the entry.
    window.localStorage.setItem(
      PRONUNCIATION_RECENT_KEY,
      JSON.stringify([
        { phoneme: 'th', accuracy: 65, ts: 1, painPointAxis: 'BOGUS_AXIS' },
      ]),
    );
    const [entry] = readPronunciationRecent();
    expect(entry.phoneme).toBe('th');
    expect(entry.accuracy).toBe(65);
    expect(entry.painPointAxis).toBeUndefined();
  });
});

// ────────────────────────────────────────────────────────────────────────
// Storage unavailability + schema drift
// ────────────────────────────────────────────────────────────────────────

describe('pronunciationAdapter — storage unavailability', () => {
  it('readPronunciationRecent returns [] when getItem throws (e.g. Safari private mode)', () => {
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError', 'QuotaExceededError');
    });
    expect(readPronunciationRecent()).toEqual([]);
  });

  it('recordPronunciationPhonemes does not throw when setItem throws (quota exceeded)', () => {
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError', 'QuotaExceededError');
    });
    expect(() =>
      recordPronunciationPhonemes([{ phoneme: 'th', accuracy: 50, ts: 1 }]),
    ).not.toThrow();
  });

  it('readPronunciationRecent returns [] on malformed JSON in storage', () => {
    window.localStorage.setItem(PRONUNCIATION_RECENT_KEY, '{not valid json');
    expect(readPronunciationRecent()).toEqual([]);
  });

  it('readPronunciationRecent returns [] when payload is not an array', () => {
    window.localStorage.setItem(PRONUNCIATION_RECENT_KEY, '{"phoneme":"th"}');
    expect(readPronunciationRecent()).toEqual([]);
  });

  it('readPronunciationRecent skips invalid entries but keeps valid ones', () => {
    window.localStorage.setItem(
      PRONUNCIATION_RECENT_KEY,
      JSON.stringify([
        { phoneme: 'th', accuracy: 60, ts: 1 },
        null,
        { phoneme: '', accuracy: 50, ts: 2 },               // empty phoneme
        { phoneme: 'r', accuracy: 'not a number', ts: 3 },  // bad accuracy
        { phoneme: 'l', accuracy: 80, ts: 4 },
      ]),
    );
    const after = readPronunciationRecent();
    expect(after).toEqual([
      { phoneme: 'th', accuracy: 60, ts: 1 },
      { phoneme: 'l', accuracy: 80, ts: 4 },
    ]);
  });
});

// ────────────────────────────────────────────────────────────────────────
// Input validation
// ────────────────────────────────────────────────────────────────────────

describe('pronunciationAdapter — input validation', () => {
  it('no-ops on empty input array', () => {
    recordPronunciationPhonemes([]);
    expect(readPronunciationRecent()).toEqual([]);
  });

  it('silently skips invalid entries from the caller (defensive)', () => {
    // Caller hands us a mixed-validity batch. Sanitizer accepts the
    // two clean entries and drops the malformed one without writing
    // a partial / broken row to storage.
    recordPronunciationPhonemes([
      { phoneme: 'th', accuracy: 60, ts: 1 },
      { phoneme: '', accuracy: 50, ts: 2 },     // empty phoneme → drop
      { phoneme: 'r', accuracy: 70, ts: 3 },
    ] as PhonemeResult[]);
    expect(readPronunciationRecent()).toEqual([
      { phoneme: 'th', accuracy: 60, ts: 1 },
      { phoneme: 'r', accuracy: 70, ts: 3 },
    ]);
  });
});
