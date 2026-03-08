import { beforeEach, describe, expect, it } from 'vitest';
import {
  checkRepetition,
  clearRepetitionGuardState,
  createEmptyRepetitionGuardState,
  getRecentRepeatedChannels,
  pickLeastRepeatedCandidate,
  recordReplyParts,
  recordRepetitionSample,
} from './repetitionGuard';

describe('repetitionGuard', () => {
  const userId = 'test-user';

  beforeEach(() => {
    clearRepetitionGuardState(userId);
  });

  it('creates an empty state', () => {
    const state = createEmptyRepetitionGuardState(userId);
    expect(state.userId).toBe(userId);
    expect(state.records).toEqual([]);
  });

  it('detects exact repetition in the same channel', () => {
    recordRepetitionSample({
      userId,
      channel: 'opening',
      text: 'Let’s take this one step at a time.',
    });

    const result = checkRepetition({
      userId,
      channel: 'opening',
      text: 'Let’s take this one step at a time.',
    });

    expect(result.isRepeated).toBe(true);
    expect(result.suggestion).toMatch(/soft_avoid|avoid/);
  });

  it('detects near repetition for similar encouragement lines', () => {
    recordRepetitionSample({
      userId,
      channel: 'encouragement',
      text: 'You’re closer than you think.',
    });

    const result = checkRepetition({
      userId,
      channel: 'encouragement',
      text: 'You are closer than you think.',
    });

    expect(result.isNearRepeated || result.isRepeated).toBe(true);
    expect(result.strongestSimilarity).toBeGreaterThan(0.6);
  });

  it('does not cross-contaminate channels', () => {
    recordRepetitionSample({
      userId,
      channel: 'opening',
      text: 'Start here.',
    });

    const result = checkRepetition({
      userId,
      channel: 'humor',
      text: 'Start here.',
    });

    expect(result.isRepeated).toBe(false);
    expect(result.isNearRepeated).toBe(false);
    expect(result.suggestion).toBe('allow');
  });

  it('picks the least repeated candidate', () => {
    recordRepetitionSample({
      userId,
      channel: 'action',
      text: 'Try one more on your own.',
    });

    const choice = pickLeastRepeatedCandidate({
      userId,
      channel: 'action',
      candidates: [
        'Try one more on your own.',
        'Give this next one a shot.',
        'Try one more on your own.',
      ],
    });

    expect(choice).toBe('Give this next one a shot.');
  });

  it('records reply parts across multiple channels', () => {
    const state = recordReplyParts({
      userId,
      opening: 'Okay, let’s reset.',
      acknowledgement: 'That was a good catch.',
      teaching: 'The key is to line up the signs first.',
      action: 'Try the next step.',
      encouragement: 'You’re still on track.',
      humor: 'No algebra crimes yet.',
      fullReply:
        'Okay, let’s reset. That was a good catch. The key is to line up the signs first. Try the next step. You’re still on track. No algebra crimes yet.',
    });

    expect(state.records.length).toBeGreaterThanOrEqual(6);
  });

  it('reports recently repeated channels', () => {
    recordRepetitionSample({
      userId,
      channel: 'humor',
      text: 'No math crimes today.',
    });

    recordRepetitionSample({
      userId,
      channel: 'humor',
      text: 'No math crimes today.',
    });

    const channels = getRecentRepeatedChannels(userId);
    expect(channels).toContain('humor');
  });

  it('treats full replies more strictly', () => {
    recordRepetitionSample({
      userId,
      channel: 'full_reply',
      text: 'Nice work. Now try the next one.',
    });

    const result = checkRepetition({
      userId,
      channel: 'full_reply',
      text: 'Nice work. Now try the next one.',
    });

    expect(result.suggestion).toBe('avoid');
  });
});