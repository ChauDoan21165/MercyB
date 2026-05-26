// src/lib/placement/__tests__/engine.test.ts
//
// Unit tests for the placement-test adaptive engine. Focus on:
// 1. CEFR mapping at boundary values (pure function)
// 2. Convergence — does a user of level X land in the expected CEFR bucket?
// 3. Invariants — no repeat questions, min/max bounds respected
// 4. Finish-early semantics
// 5. Response logging — viRevealed and elapsedMs pass through

import { describe, it, expect } from 'vitest';
import {
  createPlacementEngine,
  mapEstimateToCefr,
  type ResultCEFR,
} from '../engine';
import { PLACEMENT_QUESTIONS, type PlacementQuestion } from '../questions';

describe('mapEstimateToCefr — band boundaries', () => {
  it.each([
    [0, 'pre_a1'],
    [0.5, 'pre_a1'],
    [0.74, 'pre_a1'],
    [0.75, 'A1'],
    [1.49, 'A1'],
    [1.5, 'A2'],
    [2.49, 'A2'],
    [2.5, 'B1'],
    [3.49, 'B1'],
    [3.5, 'B2'],
    [4.49, 'B2'],
    [4.5, 'C1'],
    [5.49, 'C1'],
    [5.5, 'C2'],
    [6.5, 'C2'],
  ] as const)('est=%s → %s', (estimate, expected) => {
    expect(mapEstimateToCefr(estimate)).toBe(expected as ResultCEFR);
  });
});

/**
 * Simulate a user of a given "true level". The user answers correctly iff
 * the question's difficulty is less than or equal to their level.
 * Runs the engine to completion and returns the final snapshot.
 */
function runUserAtLevel(userLevel: number) {
  const engine = createPlacementEngine();
  let state = engine.getState();
  // Guard against infinite loops if something is wrong.
  let safety = 100;
  while (!state.isDone && state.currentQuestion && safety-- > 0) {
    const q = state.currentQuestion;
    const correct = q.difficulty <= userLevel;
    const selectedOptionId = correct
      ? q.correctOptionId
      : q.options.find((o) => o.id !== q.correctOptionId)!.id;
    engine.submit({ selectedOptionId });
    state = engine.getState();
  }
  expect(state.isDone).toBe(true);
  return state;
}

describe('placement engine — convergence', () => {
  it('all-correct user (level 10) places at C1 or C2', () => {
    const state = runUserAtLevel(10);
    expect(['C1', 'C2']).toContain(state.finalCefr);
    expect(state.questionCount).toBeGreaterThanOrEqual(8);
    expect(state.questionCount).toBeLessThanOrEqual(15);
  });

  it('all-incorrect user (level -10) places at pre_a1 or A1', () => {
    const state = runUserAtLevel(-10);
    expect(['pre_a1', 'A1']).toContain(state.finalCefr);
  });

  it('A1-level user (difficulty ≤ 1) places at pre_a1, A1, or A2', () => {
    const state = runUserAtLevel(1);
    expect(['pre_a1', 'A1', 'A2']).toContain(state.finalCefr);
  });

  it('A2-level user (difficulty ≤ 2) places at A1 or A2', () => {
    const state = runUserAtLevel(2);
    expect(['A1', 'A2']).toContain(state.finalCefr);
  });

  it('B1-level user (difficulty ≤ 3) places at A2, B1, or B2', () => {
    const state = runUserAtLevel(3);
    expect(['A2', 'B1', 'B2']).toContain(state.finalCefr);
  });

  it('B2-level user (difficulty ≤ 4) places at B1, B2, or C1', () => {
    const state = runUserAtLevel(4);
    expect(['B1', 'B2', 'C1']).toContain(state.finalCefr);
  });

  it('C1-level user (difficulty ≤ 5) places at B2, C1, or C2', () => {
    const state = runUserAtLevel(5);
    expect(['B2', 'C1', 'C2']).toContain(state.finalCefr);
  });
});

describe('placement engine — invariants', () => {
  it('never asks the same question twice', () => {
    const state = runUserAtLevel(3);
    const ids = state.responses.map((r) => r.questionId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('respects min and max question bounds', () => {
    for (const level of [-5, 1, 2, 3, 4, 5, 10]) {
      const state = runUserAtLevel(level);
      expect(state.questionCount, `level ${level} count lo`).toBeGreaterThanOrEqual(8);
      expect(state.questionCount, `level ${level} count hi`).toBeLessThanOrEqual(15);
    }
  });

  it('all responses come from the configured pool', () => {
    const state = runUserAtLevel(3);
    const poolIds = new Set(PLACEMENT_QUESTIONS.map((q) => q.id));
    for (const r of state.responses) {
      expect(poolIds.has(r.questionId)).toBe(true);
    }
  });

  it('final state exposes a finalCefr and a currentQuestion = null', () => {
    const state = runUserAtLevel(3);
    expect(state.finalCefr).not.toBeNull();
    expect(state.currentQuestion).toBeNull();
  });

  it('estimate stays within [0.5, 6.5]', () => {
    for (const level of [-10, 10]) {
      const state = runUserAtLevel(level);
      expect(state.estimate).toBeGreaterThanOrEqual(0.5);
      expect(state.estimate).toBeLessThanOrEqual(6.5);
    }
  });

  it('questionCount progresses 1, 2, 3... before done', () => {
    const engine = createPlacementEngine();
    const s0 = engine.getState();
    expect(s0.questionCount).toBe(1);
    expect(s0.currentQuestion).not.toBeNull();

    engine.submit({ selectedOptionId: s0.currentQuestion!.correctOptionId });
    const s1 = engine.getState();
    expect(s1.questionCount).toBe(2);
  });
});

describe('placement engine — finishEarly', () => {
  it('is a no-op before min questions (Q<8)', () => {
    const engine = createPlacementEngine();
    // Answer 5 questions.
    for (let i = 0; i < 5; i++) {
      const s = engine.getState();
      if (!s.currentQuestion) break;
      engine.submit({ selectedOptionId: s.currentQuestion.correctOptionId });
    }
    expect(engine.getState().canFinishEarly).toBe(false);
    engine.finishEarly();
    const s = engine.getState();
    expect(s.isDone).toBe(false);
    expect(s.currentQuestion).not.toBeNull();
  });

  // Alternating answers keeps the recentDeltas window noisy, which
  // prevents the engine's own convergence rule from firing at Q8. That
  // leaves finishEarly as the ONLY path to isDone within these tests,
  // so we can assert its semantics cleanly.
  function submitAlternating(engine: ReturnType<typeof createPlacementEngine>, n: number) {
    for (let i = 0; i < n; i++) {
      const s = engine.getState();
      if (!s.currentQuestion) break;
      const correct = i % 2 === 0;
      const selectedOptionId = correct
        ? s.currentQuestion.correctOptionId
        : s.currentQuestion.options.find(
            (o) => o.id !== s.currentQuestion!.correctOptionId,
          )!.id;
      engine.submit({ selectedOptionId });
    }
  }

  it('commits at Q8+ with current estimate', () => {
    const engine = createPlacementEngine();
    submitAlternating(engine, 8);
    const pre = engine.getState();
    expect(pre.isDone).toBe(false); // engine did not auto-converge
    expect(pre.canFinishEarly).toBe(true);
    engine.finishEarly();
    const post = engine.getState();
    expect(post.isDone).toBe(true);
    expect(post.finalCefr).not.toBeNull();
    expect(post.currentQuestion).toBeNull();
  });

  it('further submits after finishEarly are no-ops', () => {
    const engine = createPlacementEngine();
    submitAlternating(engine, 8);
    engine.finishEarly();
    const before = engine.getState();
    expect(before.isDone).toBe(true);
    engine.submit({ selectedOptionId: 'a' });
    const after = engine.getState();
    expect(after.responses.length).toBe(before.responses.length);
    expect(after.finalCefr).toBe(before.finalCefr);
  });
});

describe('placement engine — response log fidelity', () => {
  it('records viRevealed and elapsedMs per response', () => {
    const engine = createPlacementEngine();
    let state = engine.getState();
    let idx = 0;
    while (!state.isDone && state.currentQuestion) {
      engine.submit({
        selectedOptionId: state.currentQuestion.correctOptionId,
        viRevealed: idx % 2 === 0,
        elapsedMs: 1000 + idx * 100,
      });
      state = engine.getState();
      idx += 1;
    }
    expect(state.responses.length).toBeGreaterThan(0);
    for (let i = 0; i < state.responses.length; i++) {
      const r = state.responses[i];
      expect(r.viRevealed).toBe(i % 2 === 0);
      expect(r.elapsedMs).toBe(1000 + i * 100);
    }
  });

  it('defaults viRevealed=false and elapsedMs=0 when omitted', () => {
    const engine = createPlacementEngine();
    const s0 = engine.getState();
    engine.submit({ selectedOptionId: s0.currentQuestion!.correctOptionId });
    const r = engine.getState().responses[0];
    expect(r.viRevealed).toBe(false);
    expect(r.elapsedMs).toBe(0);
  });

  it('null selectedOptionId is recorded as incorrect', () => {
    const engine = createPlacementEngine();
    engine.submit({ selectedOptionId: null });
    const r = engine.getState().responses[0];
    expect(r.selectedOptionId).toBeNull();
    expect(r.correct).toBe(false);
  });
});

describe('placement engine — configurable options', () => {
  it('honors a custom initialEstimate', () => {
    const engine = createPlacementEngine({ initialEstimate: 5 });
    const q = engine.getState().currentQuestion;
    expect(q?.difficulty).toBeGreaterThanOrEqual(4);
    expect(q?.difficulty).toBeLessThanOrEqual(6);
  });

  it('honors custom min/max/target', () => {
    const engine = createPlacementEngine({
      minQuestions: 4,
      maxQuestions: 5,
      targetQuestions: 5,
    });
    let state = engine.getState();
    let safety = 30;
    while (!state.isDone && state.currentQuestion && safety-- > 0) {
      engine.submit({ selectedOptionId: state.currentQuestion.correctOptionId });
      state = engine.getState();
    }
    expect(state.isDone).toBe(true);
    expect(state.questionCount).toBeLessThanOrEqual(5);
    expect(state.questionCount).toBeGreaterThanOrEqual(4);
  });
});

describe('placement engine — weaknessFlags', () => {
  // The three L1-interference items with known tags. If questions.ts
  // renames any of these, this block fails loudly — which is the point.
  const L1_IDS = ['q_a1_009', 'q_a2_009', 'q_b1_009'];
  const TAG_BY_ID: Record<string, string> = {
    q_a1_009: 'vi_l1_plural_s',
    q_a2_009: 'vi_l1_past_ed',
    q_b1_009: 'vi_l1_3rd_person_s',
  };

  it('is an empty array until isDone', () => {
    const engine = createPlacementEngine();
    const s0 = engine.getState();
    expect(s0.isDone).toBe(false);
    expect(s0.weaknessFlags).toEqual([]);

    // Answer a few questions; still not done.
    for (let i = 0; i < 3; i++) {
      const s = engine.getState();
      if (!s.currentQuestion) break;
      engine.submit({ selectedOptionId: s.currentQuestion.correctOptionId });
    }
    expect(engine.getState().weaknessFlags).toEqual([]);
  });

  it('records tag on a response when a tagged question is asked', () => {
    // Level-1 user (A1) — correct on A1 items incl. q_a1_009 — tag copied
    // through to response but not to weaknessFlags (answer was correct).
    const engine = createPlacementEngine();
    let state = engine.getState();
    let safety = 30;
    while (!state.isDone && state.currentQuestion && safety-- > 0) {
      const q = state.currentQuestion;
      engine.submit({
        selectedOptionId: q.difficulty <= 1 ? q.correctOptionId : 'a',
      });
      state = engine.getState();
    }
    const askedL1 = state.responses.filter((r) => L1_IDS.includes(r.questionId));
    for (const r of askedL1) {
      expect(r.weaknessTag).toBe(TAG_BY_ID[r.questionId]);
    }
  });

  it('flags exactly the tagged questions the user got wrong', () => {
    // Force every question wrong so every L1 item the engine asks gets
    // flagged. Uses a simulated -10 user (all-incorrect).
    const engine = createPlacementEngine();
    let state = engine.getState();
    let safety = 30;
    while (!state.isDone && state.currentQuestion && safety-- > 0) {
      const q = state.currentQuestion;
      const wrong = q.options.find((o) => o.id !== q.correctOptionId)!.id;
      engine.submit({ selectedOptionId: wrong });
      state = engine.getState();
    }
    expect(state.isDone).toBe(true);

    const askedTagged = state.responses
      .filter((r) => r.weaknessTag !== undefined)
      .map((r) => r.weaknessTag as string);

    // Engine may skip L1 items at levels it doesn't visit, but every L1
    // item that WAS asked should appear (they're all-wrong here).
    expect(new Set(state.weaknessFlags)).toEqual(new Set(askedTagged));
  });

  it('does not flag tagged questions the user got right', () => {
    // Answer every question correctly. weaknessFlags must be empty even
    // if L1 items were asked.
    const engine = createPlacementEngine();
    let state = engine.getState();
    let safety = 30;
    while (!state.isDone && state.currentQuestion && safety-- > 0) {
      engine.submit({
        selectedOptionId: state.currentQuestion.correctOptionId,
      });
      state = engine.getState();
    }
    expect(state.isDone).toBe(true);
    expect(state.weaknessFlags).toEqual([]);
  });

  it('returns tags in ask order and deduplicated', () => {
    // Ask custom pool with two copies of the same tag so we can verify
    // the dedupe branch. Use a minimal adaptive setup to keep this fast.
    const engine = createPlacementEngine({
      minQuestions: 2,
      maxQuestions: 4,
      targetQuestions: 4,
      pool: [
        {
          id: 'fake_1',
          type: 'multiple_choice',
          cefr: 'A1',
          difficulty: 3,
          skill: 'grammar',
          cefrDescriptor: 'test',
          weaknessTag: 'tag_alpha',
          prompt: { en: 'x', vi: 'x' },
          options: [
            { id: 'a', text: { en: '1', vi: '1' } },
            { id: 'b', text: { en: '2', vi: '2' } },
            { id: 'c', text: { en: '3', vi: '3' } },
            { id: 'd', text: { en: '4', vi: '4' } },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'fake_2',
          type: 'multiple_choice',
          cefr: 'A2',
          difficulty: 3,
          skill: 'grammar',
          cefrDescriptor: 'test',
          weaknessTag: 'tag_beta',
          prompt: { en: 'x', vi: 'x' },
          options: [
            { id: 'a', text: { en: '1', vi: '1' } },
            { id: 'b', text: { en: '2', vi: '2' } },
            { id: 'c', text: { en: '3', vi: '3' } },
            { id: 'd', text: { en: '4', vi: '4' } },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'fake_3',
          type: 'multiple_choice',
          cefr: 'A2',
          difficulty: 3,
          skill: 'grammar',
          cefrDescriptor: 'test',
          weaknessTag: 'tag_alpha', // duplicate tag — tests dedupe
          prompt: { en: 'x', vi: 'x' },
          options: [
            { id: 'a', text: { en: '1', vi: '1' } },
            { id: 'b', text: { en: '2', vi: '2' } },
            { id: 'c', text: { en: '3', vi: '3' } },
            { id: 'd', text: { en: '4', vi: '4' } },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'fake_4',
          type: 'multiple_choice',
          cefr: 'B1',
          difficulty: 3,
          skill: 'grammar',
          cefrDescriptor: 'test',
          prompt: { en: 'x', vi: 'x' },
          options: [
            { id: 'a', text: { en: '1', vi: '1' } },
            { id: 'b', text: { en: '2', vi: '2' } },
            { id: 'c', text: { en: '3', vi: '3' } },
            { id: 'd', text: { en: '4', vi: '4' } },
          ],
          correctOptionId: 'a',
        },
      ],
    });

    // All wrong → all L1 tags flagged.
    let state = engine.getState();
    let safety = 10;
    while (!state.isDone && state.currentQuestion && safety-- > 0) {
      engine.submit({ selectedOptionId: 'b' }); // never 'a' = always wrong
      state = engine.getState();
    }
    expect(state.isDone).toBe(true);
    // tag_alpha and tag_beta should both appear. tag_alpha dedupes.
    expect(state.weaknessFlags).toEqual(['tag_alpha', 'tag_beta']);
  });
});

describe('placement engine — viRevealed reading discount (Option A)', () => {
  // A pool of difficulty-3 (B1) reading items. With initialEstimate 3 the
  // engine draws from this pool only.
  function readingPool(n: number): PlacementQuestion[] {
    return Array.from({ length: n }, (_, i) => ({
      id: `r_${i + 1}`,
      type: 'reading_comprehension' as const,
      cefr: 'B1' as const,
      difficulty: 3,
      skill: 'reading' as const,
      cefrDescriptor: 'test reading',
      passage: { en: 'A short English passage.', vi: 'Một đoạn văn ngắn.' },
      prompt: { en: 'What is it?', vi: 'Nó là gì?' },
      options: [
        { id: 'a' as const, text: { en: 'A passage', vi: 'A passage' } },
        { id: 'b' as const, text: { en: 'A song', vi: 'A song' } },
        { id: 'c' as const, text: { en: 'A film', vi: 'A film' } },
        { id: 'd' as const, text: { en: 'A game', vi: 'A game' } },
      ],
      correctOptionId: 'a' as const,
    }));
  }

  function runReading(viRevealed: boolean) {
    const engine = createPlacementEngine({
      pool: readingPool(4),
      minQuestions: 2,
      maxQuestions: 4,
      targetQuestions: 4,
    });
    let state = engine.getState();
    let safety = 20;
    while (!state.isDone && state.currentQuestion && safety-- > 0) {
      engine.submit({
        selectedOptionId: state.currentQuestion.correctOptionId,
        viRevealed,
      });
      state = engine.getState();
    }
    expect(state.isDone).toBe(true);
    return state;
  }

  it('a correct reading answer with viRevealed=true does NOT raise the estimate', () => {
    const state = runReading(true);
    // Started at 3.0 (B1). Revealing VI on every correct reading answer
    // must drive the estimate DOWN (evidence the learner is below the
    // item), never up to the item's B1 difficulty.
    expect(state.estimate).toBeLessThan(3);
    expect(['pre_a1', 'A1', 'A2']).toContain(state.finalCefr);
  });

  it('preserves correct:true in the response log (no false weakness, SRS intact)', () => {
    const state = runReading(true);
    expect(state.responses.length).toBeGreaterThan(0);
    for (const r of state.responses) {
      expect(r.correct).toBe(true); // they did pick the right English word
      expect(r.viRevealed).toBe(true);
    }
  });

  it('honest reading (viRevealed=false) still raises the estimate — no regression', () => {
    const state = runReading(false);
    expect(state.estimate).toBeGreaterThan(3);
    expect(['B2', 'C1', 'C2']).toContain(state.finalCefr);
  });

  // Synthetic "VI-reading pattern matcher" on the REAL pool: a pidgin
  // learner who reveals the Vietnamese on every reading item and matches
  // the English option, but fails every grammar/vocab MCQ.
  function runPatternMatcher(revealOnReading: boolean) {
    const readingIds = new Set(
      PLACEMENT_QUESTIONS.filter(
        (q) => q.type === 'reading_comprehension',
      ).map((q) => q.id),
    );
    const engine = createPlacementEngine();
    let state = engine.getState();
    let safety = 100;
    while (!state.isDone && state.currentQuestion && safety-- > 0) {
      const q = state.currentQuestion;
      const isReading = readingIds.has(q.id);
      if (isReading) {
        engine.submit({
          selectedOptionId: q.correctOptionId, // matched via VI
          viRevealed: revealOnReading,
        });
      } else {
        const wrong = q.options.find((o) => o.id !== q.correctOptionId)!.id;
        engine.submit({ selectedOptionId: wrong }); // pidgin fails grammar
      }
      state = engine.getState();
    }
    expect(state.isDone).toBe(true);
    return state;
  }

  it('floor-anchors a VI-reading pattern matcher (was reaching B2/C1 before)', () => {
    const crutch = runPatternMatcher(true);
    expect(['pre_a1', 'A1']).toContain(crutch.finalCefr);
  });

  it('flips the sign of the estimate step: same correct reading, viRevealed toggled', () => {
    // Clamp-free, single-question proof of the exact Option-A contract in
    // this fixed-step ladder. First step from 3.0 is 1.0, so neither
    // branch hits the [0.5, 6.5] clamp — the delta is observed cleanly.
    const reveal = createPlacementEngine({ pool: readingPool(4) });
    reveal.submit({
      selectedOptionId: reveal.getState().currentQuestion!.correctOptionId,
      viRevealed: true,
    });
    const revealEst = reveal.getState().estimate;

    const noReveal = createPlacementEngine({ pool: readingPool(4) });
    noReveal.submit({
      selectedOptionId: noReveal.getState().currentQuestion!.correctOptionId,
      viRevealed: false,
    });
    const noRevealEst = noReveal.getState().estimate;

    // Identical correct answer on an identical B1 reading item. With the
    // VI crutch the estimate moves DOWN; without it, UP — same magnitude,
    // opposite sign (the discount = a downward step, per Option A).
    expect(revealEst).toBeLessThan(3);
    expect(noRevealEst).toBeGreaterThan(3);
    expect(3 - revealEst).toBeCloseTo(noRevealEst - 3, 10);
  });
});
