import { describe, expect, it } from 'vitest';

import {
  detectL1Error,
  type L1WeaknessTag,
} from '../index.js';

function expectHit(user: string, expected: string, tag: L1WeaknessTag) {
  const result = detectL1Error({ userAnswer: user, expectedAnswer: expected });
  expect(result.matched, `expected ${tag} for "${user}", got ${result.weaknessTag ?? 'no match'}`).toBe(true);
  if (result.matched) {
    expect(result.weaknessTag).toBe(tag);
    expect(result.feedback.en).toContain(expected);
    expect(result.feedback.vi).toContain(expected);
  }
}

function expectNoTag(user: string, expected: string, tag: L1WeaknessTag) {
  const result = detectL1Error({ userAnswer: user, expectedAnswer: expected });
  if (result.matched) {
    expect(result.weaknessTag, `expected not ${tag} for "${user}"`).not.toBe(tag);
  }
}

describe('Group D D-G1: vi_l1_modal_overinflection', () => {
  const tag = 'vi_l1_modal_overinflection';

  it('detects an inflected modal', () => {
    expectHit('He cans speak English.', 'He can speak English.', tag);
    expectHit('She shoulds come early.', 'She should come early.', tag);
  });

  it('does not fire on a correct modal form', () => {
    expectNoTag('He can speak English.', 'He can speak English.', tag);
  });
});

describe('Group D D-G2: vi_l1_phrasal_verb_transfer', () => {
  const tag = 'vi_l1_phrasal_verb_transfer';

  it('detects whitelisted phrasal-verb transfer cases', () => {
    expectHit('I wake at six.', 'I get up at six.', tag);
    expectHit('Wear your jacket.', 'Put on your jacket.', tag);
    expectHit('She cares her brother.', 'She looks after her brother.', tag);
  });

  it('does not fire outside the whitelist or when already phrasal', () => {
    expectNoTag('I get up at six.', 'I get up at six.', tag);
    expectNoTag('I wake the baby.', 'I wake the baby.', tag);
  });
});

describe('Group D D-G3: vi_l1_very_verb_calque', () => {
  const tag = 'vi_l1_very_verb_calque';

  it('detects very + verb when the expected answer uses really + verb', () => {
    expectHit('I very like this song.', 'I really like this song.', tag);
  });

  it('does not fire on correct really + verb or very + adjective', () => {
    expectNoTag('I really like this song.', 'I really like this song.', tag);
    expectNoTag('This song is very good.', 'This song is very good.', tag);
  });
});

describe('Group D D-G4: vi_l1_overexplicit_reference', () => {
  const tag = 'vi_l1_overexplicit_reference';

  it('detects repeated name reference chains where expected text uses pronouns', () => {
    expectHit(
      'Lan is my friend. Lan works with me. Lan is kind.',
      'Lan is my friend. She works with me. She is kind.',
      tag,
    );
  });

  it('does not fire for a single mention', () => {
    expectNoTag('Lan is my friend.', 'Lan is my friend.', tag);
  });
});

describe('Group D D-G5: vi_l1_time_reference_overmarking', () => {
  const tag = 'vi_l1_time_reference_overmarking';

  it('detects repeated time marker overmarking in a short narrative', () => {
    expectHit(
      'Yesterday I went to work. Yesterday I met my boss. Yesterday I came home late.',
      'Yesterday I went to work. I met my boss. I came home late.',
      tag,
    );
  });

  it('does not fire when the time marker appears only once', () => {
    expectNoTag(
      'Yesterday I went to work. I met my boss. I came home late.',
      'Yesterday I went to work. I met my boss. I came home late.',
      tag,
    );
  });
});
