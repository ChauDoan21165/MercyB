import { describe, expect, it } from 'vitest';

import {
  splitCorrectionForSpeech,
} from '../correctionSpeechPayload';
import {
  parseCorrectiveFeedbackMove,
  serializeCorrectiveFeedbackMove,
} from '../correctionFeedbackTaxonomy';

describe('CF-015 splitCorrectionForSpeech', () => {
  it('keeps audio correction spoken text short and preserves detail in text', () => {
    const result = splitCorrectionForSpeech({
      mode: 'audio',
      correctionText: 'Say: I have lived here for three years.',
      explanation:
        'Use the present perfect with for plus a duration when the situation started in the past and continues now.',
      maxSpokenChars: 64,
    });

    expect(result.reason).toBe('audio_compact_cue');
    expect(result.spokenText.length).toBeLessThanOrEqual(64);
    expect(result.spokenText).toMatch(/^Try:/);
    expect(result.textDetail).toContain('present perfect');
  });

  it('does not split short audio corrections', () => {
    const result = splitCorrectionForSpeech({
      mode: 'audio',
      correctionText: 'Try: I went yesterday.',
      maxSpokenChars: 64,
    });

    expect(result.reason).toBe('full_spoken_correction');
    expect(result.textDetail).toBeNull();
    expect(result.spokenText).toBe('Try: I went yesterday.');
  });

  it('does not apply the audio split to text mode', () => {
    const longExplanation = 'Use an article before a singular count noun when introducing it.'.repeat(3);
    const result = splitCorrectionForSpeech({
      mode: 'text',
      correctionText: 'The teacher gave homework.',
      explanation: longExplanation,
      maxSpokenChars: 64,
    });

    expect(result.reason).toBe('full_spoken_correction');
    expect(result.textDetail).toBeNull();
    expect(result.spokenText).toContain('singular count noun');
  });
});

describe('CF-023 correction feedback taxonomy', () => {
  it('accepts canonical oral corrective feedback moves', () => {
    expect(parseCorrectiveFeedbackMove('recast')).toEqual({
      ok: true,
      move: 'recast',
    });
    expect(serializeCorrectiveFeedbackMove('metalinguistic_clue')).toEqual({
      ok: true,
      value: 'metalinguistic_clue',
    });
  });

  it('accepts approved product-specific extensions', () => {
    expect(parseCorrectiveFeedbackMove('pronunciation_recast_repeat')).toEqual({
      ok: true,
      move: 'pronunciation_recast_repeat',
    });
  });

  it('rejects unknown free-form feedback moves', () => {
    expect(parseCorrectiveFeedbackMove('nice_hint')).toEqual({
      ok: false,
      reason: 'unknown_feedback_move',
      value: 'nice_hint',
    });
    expect(serializeCorrectiveFeedbackMove('custom string')).toEqual({
      ok: false,
      reason: 'unknown_feedback_move',
      value: 'custom string',
    });
  });
});
