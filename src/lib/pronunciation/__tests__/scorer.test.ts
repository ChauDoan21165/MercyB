import { describe, it, expect } from 'vitest';
import { scorePronunciation } from '../scorer';

describe('scorePronunciation', () => {
  it('perfect match → 100, all words correct', () => {
    const r = scorePronunciation({
      target: 'I love this city',
      recognized: 'i love this city',
    });
    expect(r.overallScore).toBe(100);
    expect(r.wordScores).toHaveLength(4);
    expect(r.wordScores.every((w) => w.status === 'correct')).toBe(true);
  });

  it('case + punctuation differences are normalised', () => {
    const r = scorePronunciation({
      target: 'I Love, This City!',
      recognized: 'i love this city',
    });
    expect(r.overallScore).toBe(100);
  });

  it('VN-typical v→b substitution earns partial credit', () => {
    const r = scorePronunciation({
      target: 'she is very nice',
      recognized: 'she is bery nice',
    });
    expect(r.overallScore).toBeGreaterThanOrEqual(85); // 3/4 correct + 0.70 partial
    const very = r.wordScores.find((w) => w.word === 'very');
    expect(very?.status).toBe('close');
    expect(very?.score).toBe(70);
    expect(very?.hint?.vi).toBeTruthy();
  });

  it('Southern VN v→y substitution earns 0.65 credit (Gap 1)', () => {
    // Saigon dialect: /v/ → [j] yod-glide. "very" → "yery".
    // Co-exists with the existing v→b rule (resolver dedupes by variant).
    const r = scorePronunciation({
      target: 'she is very nice',
      recognized: 'she is yery nice',
    });
    const very = r.wordScores.find((w) => w.word === 'very');
    expect(very?.status).toBe('close');
    expect(very?.score).toBe(65);
  });

  it('Southern VN word override fires on "voice" → "yois"', () => {
    const r = scorePronunciation({
      target: 'her voice is clear',
      recognized: 'her yois is clear',
    });
    const voice = r.wordScores.find((w) => w.word === 'voice');
    expect(voice?.status).toBe('close');
    expect(voice?.score).toBe(65);
  });

  // ── Gap 2: Final consonant cluster simplification ─────────────────────
  // Every Vietnamese learner produces these — Vietnamese permits no coda
  // clusters. Adding the cluster rules expands partial-credit coverage
  // to ~18 final-cluster patterns that previously scored 0.

  it('cluster -nd → -n earns 0.80 ("find" → "fin")', () => {
    const r = scorePronunciation({
      target: 'i can find it',
      recognized: 'i can fin it',
    });
    const find = r.wordScores.find((w) => w.word === 'find');
    expect(find?.status).toBe('close');
    expect(find?.score).toBe(80);
  });

  it('cluster -st → -s earns 0.75 ("last" → "las")', () => {
    const r = scorePronunciation({
      target: 'the last bus',
      recognized: 'the las bus',
    });
    const last = r.wordScores.find((w) => w.word === 'last');
    expect(last?.status).toBe('close');
    expect(last?.score).toBe(75);
  });

  it('cluster -nt → -n earns 0.75 ("want" → "wan")', () => {
    const r = scorePronunciation({
      target: 'i want coffee',
      recognized: 'i wan coffee',
    });
    const want = r.wordScores.find((w) => w.word === 'want');
    expect(want?.status).toBe('close');
    expect(want?.score).toBe(75);
  });

  it('cluster -mp → -m earns 0.75 ("jump" → "jum")', () => {
    const r = scorePronunciation({
      target: 'kids jump high',
      recognized: 'kids jum high',
    });
    const jump = r.wordScores.find((w) => w.word === 'jump');
    expect(jump?.status).toBe('close');
    expect(jump?.score).toBe(75);
  });

  it('cluster -lp → -l earns 0.70 ("help" → "hel")', () => {
    const r = scorePronunciation({
      target: 'please help me',
      recognized: 'please hel me',
    });
    const help = r.wordScores.find((w) => w.word === 'help');
    expect(help?.status).toBe('close');
    expect(help?.score).toBe(70);
  });

  it('cluster -ld → -l earns 0.75 ("told" → "tol")', () => {
    const r = scorePronunciation({
      target: 'she told me',
      recognized: 'she tol me',
    });
    const told = r.wordScores.find((w) => w.word === 'told');
    expect(told?.status).toBe('close');
    expect(told?.score).toBe(75);
  });

  it('cluster -pt → -p earns 0.70 ("kept" → "kep")', () => {
    const r = scorePronunciation({
      target: 'he kept it',
      recognized: 'he kep it',
    });
    const kept = r.wordScores.find((w) => w.word === 'kept');
    expect(kept?.status).toBe('close');
    expect(kept?.score).toBe(70);
  });

  it('existing -ed drop still fires (no cluster regression on "asked")', () => {
    // 'asked' ends in 'sked' — would hit -sk$ → -s after stripping -ed,
    // but the -ed$ rule fires first at 0.85 credit. Confirms the cluster
    // rules don't shadow existing high-credit endings.
    const r = scorePronunciation({
      target: 'she asked me',
      recognized: 'she ask me',
    });
    const asked = r.wordScores.find((w) => w.word === 'asked');
    expect(asked?.status).toBe('close');
    expect(asked?.score).toBe(85);
  });

  it('VN-typical th→t substitution on "think" earns close', () => {
    const r = scorePronunciation({
      target: 'I think so',
      recognized: 'i tink so',
    });
    const think = r.wordScores.find((w) => w.word === 'think');
    expect(think?.status).toBe('close');
    expect(think?.score).toBe(75);
  });

  it('missed words drop the score proportionally', () => {
    const r = scorePronunciation({
      target: 'I live in Hanoi',
      recognized: 'i hanoi',
    });
    // target has 4 words; learner said 2 → upper bound on exact matches = 2/4 = 50.
    expect(r.overallScore).toBeGreaterThanOrEqual(45);
    expect(r.overallScore).toBeLessThanOrEqual(55);
    const missed = r.wordScores.filter((w) => w.status === 'missed').map((w) => w.word);
    // alignment should mark "live" and "in" as missed.
    expect(missed).toContain('live');
    expect(missed).toContain('in');
  });

  it('extra words penalise the score but don\'t dominate', () => {
    const r = scorePronunciation({
      target: 'I love coffee',
      recognized: 'um i love coffee ok',
    });
    // 3/3 target matches → base 100, -3 per extra × 2 = 94
    expect(r.overallScore).toBe(94);
    const extras = r.wordScores.filter((w) => w.status === 'wrong' && !w.word);
    expect(extras.map((w) => w.heard)).toEqual(['um', 'ok']);
  });

  it('all-wrong recognition → single-digit score', () => {
    const r = scorePronunciation({
      target: 'good morning teacher',
      recognized: 'banana xylophone earthquake',
    });
    expect(r.overallScore).toBeLessThanOrEqual(20);
  });

  it('empty recognised → 0 and everything marked missed', () => {
    const r = scorePronunciation({
      target: 'hello world',
      recognized: '',
    });
    expect(r.overallScore).toBe(0);
    expect(r.wordScores.every((w) => w.status === 'missed')).toBe(true);
  });

  it('empty target → 0 with a meaningful feedback message', () => {
    const r = scorePronunciation({
      target: '',
      recognized: 'hello',
    });
    expect(r.overallScore).toBe(0);
    expect(r.feedback.vi.length).toBeGreaterThan(0);
  });

  it('feedback bands move with the score', () => {
    const perfect = scorePronunciation({ target: 'hi', recognized: 'hi' });
    const decent  = scorePronunciation({ target: 'think little zoo', recognized: 'tink little su' });
    const awful   = scorePronunciation({ target: 'one two three', recognized: 'apple banana cherry' });

    expect(perfect.feedback.en.toLowerCase()).toContain('excellent');
    // decent: partial credit everywhere — lands in 55..89 band.
    expect(decent.overallScore).toBeGreaterThanOrEqual(55);
    expect(decent.overallScore).toBeLessThan(90);
    expect(awful.overallScore).toBeLessThan(30);
  });

  it('fuzzy fallback (1-edit distance) gives partial credit', () => {
    const r = scorePronunciation({
      target: 'please bring the water',
      recognized: 'please bring the watter',
    });
    // "watter" is a 1-char insertion from "water"; word-overrides handle
    // "wader"/"woder" explicitly, so this tests the fuzzy fallback.
    const water = r.wordScores.find((w) => w.word === 'water');
    expect(water?.status).toBe('close');
    expect(water!.score).toBeGreaterThan(0);
  });

  it('returns bilingual feedback on every call', () => {
    const r = scorePronunciation({ target: 'hello', recognized: 'helo' });
    expect(r.feedback.en).toBeTruthy();
    expect(r.feedback.vi).toBeTruthy();
  });

  it('word scores are stable length: target words + extras', () => {
    const r = scorePronunciation({
      target: 'I love pho',
      recognized: 'um i love pho',
    });
    // 3 target words + 1 extra = 4 slots
    expect(r.wordScores).toHaveLength(4);
  });
});
