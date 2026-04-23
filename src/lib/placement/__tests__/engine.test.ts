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
import { PLACEMENT_QUESTIONS } from '../questions';

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
