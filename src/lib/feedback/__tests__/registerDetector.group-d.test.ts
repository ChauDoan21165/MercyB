import { describe, expect, it } from 'vitest';

import {
  detectRegisterError,
  detectRegisterErrorWithContext,
} from '../index.js';

describe('detectRegisterErrorWithContext — Group D register scenarios', () => {
  it('detects direct request transfer only in a professional request scenario', () => {
    const hit = detectRegisterErrorWithContext({
      learnerText: 'You send me the file.',
      expectedText: 'Could you send me the file?',
      scenario: 'professional_request',
    });

    expect(hit).toMatchObject({
      matched: true,
      patternId: 'direct_request_transfer',
      tag: 'en_l1_register_direct_request_transfer',
    });

    expect(detectRegisterError({ learnerText: 'You send me the file.' }).matched).toBe(false);
    expect(detectRegisterErrorWithContext({
      learnerText: 'You send me the file.',
      expectedText: 'Send me the file.',
      scenario: 'instruction',
    }).matched).toBe(false);
  });

  it('detects apology explanation before responsibility', () => {
    const hit = detectRegisterErrorWithContext({
      learnerText: 'The traffic was terrible, so I am late.',
      expectedText: "I'm sorry I'm late. The traffic was terrible.",
      scenario: 'professional_apology',
    });

    expect(hit).toMatchObject({
      matched: true,
      patternId: 'apology_explanation_before_responsibility',
      tag: 'en_l1_register_apology_explanation_order',
    });

    expect(detectRegisterErrorWithContext({
      learnerText: "I'm sorry I'm late. The traffic was terrible.",
      expectedText: "I'm sorry I'm late. The traffic was terrible.",
      scenario: 'professional_apology',
    }).matched).toBe(false);
  });

  it('detects refusal softening only with professional refusal context', () => {
    const hit = detectRegisterErrorWithContext({
      learnerText: "No, I don't go.",
      expectedText: "Thanks for asking, but I can't this week.",
      scenario: 'professional_refusal',
    });

    expect(hit).toMatchObject({
      matched: true,
      patternId: 'refusal_softening_gap',
      tag: 'en_l1_register_refusal_softening_gap',
    });

    expect(detectRegisterErrorWithContext({
      learnerText: "No, I don't go.",
      expectedText: '',
      scenario: 'casual_refusal',
    }).matched).toBe(false);
  });
});
