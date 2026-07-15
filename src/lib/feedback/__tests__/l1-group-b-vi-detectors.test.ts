import { describe, expect, it } from 'vitest';

import {
  detectL1Error,
  type L1WeaknessTag,
} from '../index.js';

function expectHit(user: string, expected: string, tag: L1WeaknessTag) {
  const result = detectL1Error({ userAnswer: user, expectedAnswer: expected });
  expect(result.matched, `expected ${tag} for "${user}" vs "${expected}", got ${result.weaknessTag ?? 'no match'}`).toBe(true);
  if (result.matched) {
    expect(result.weaknessTag).toBe(tag);
    expect(result.feedback.en).toContain(expected);
    expect(result.feedback.vi).toContain(expected);
  }
}

function expectNoTag(user: string, expected: string, tag: L1WeaknessTag) {
  const result = detectL1Error({ userAnswer: user, expectedAnswer: expected });
  if (result.matched) {
    expect(result.weaknessTag, `expected not ${tag} for "${user}" vs "${expected}"`).not.toBe(tag);
  }
}

describe('Group B VI-2: vi_l1_profession_article_copula', () => {
  const tag = 'vi_l1_profession_article_copula';

  it('detects profession article/copula transfer', () => {
    expectHit('My father doctor.', 'My father is a doctor.', tag);
    expectHit('She is teacher.', 'She is a teacher.', tag);
    expectHit('I want to be engineer.', 'I want to be an engineer.', tag);
  });

  it('guards against non-profession and already-correct cases', () => {
    expectNoTag('She is a teacher.', 'She is a teacher.', tag);
    expectNoTag('My father is tall.', 'My father is tall.', tag);
  });
});

describe('Group B VI-3: vi_l1_progressive_be_drop', () => {
  const tag = 'vi_l1_progressive_be_drop';

  it('detects dropped progressive be', () => {
    expectHit('I going to school.', 'I am going to school.', tag);
    expectHit('She cooking dinner.', 'She is cooking dinner.', tag);
    expectHit('They studying now.', 'They are studying now.', tag);
  });

  it('guards against simple present and already-correct progressive', () => {
    expectNoTag('I go to school.', 'I go to school.', tag);
    expectNoTag('She is cooking dinner.', 'She is cooking dinner.', tag);
  });
});

describe('Group B VI-7: vi_l1_definite_article_remention', () => {
  const tag = 'vi_l1_definite_article_remention';

  it('detects missing the on a repeated noun', () => {
    expectHit('Open the door, then close door.', 'Open the door, then close the door.', tag);
    expectHit('I read a book. Book is interesting.', 'I read a book. The book is interesting.', tag);
  });

  it('guards against first mentions and already-correct rementions', () => {
    expectNoTag('Book is interesting.', 'The book is interesting.', tag);
    expectNoTag('I read a book. The book is interesting.', 'I read a book. The book is interesting.', tag);
  });
});

describe('Group B VI-11: vi_l1_noun_preposition_collocation', () => {
  const tag = 'vi_l1_noun_preposition_collocation';

  it('detects whitelisted noun-preposition collocations', () => {
    expectHit('The reason of this problem is unclear.', 'The reason for this problem is unclear.', tag);
    expectHit('My opinion about this issue is different.', 'My opinion on this issue is different.', tag);
    expectHit('Demand of English is high.', 'Demand for English is high.', tag);
  });

  it('guards against non-whitelisted or already-correct collocations', () => {
    expectNoTag('The color of this problem is red.', 'The color of this problem is red.', tag);
    expectNoTag('The reason for this problem is unclear.', 'The reason for this problem is unclear.', tag);
  });
});

describe('Group B VI-12: vi_l1_say_tell_argument_frame', () => {
  const tag = 'vi_l1_say_tell_argument_frame';

  it('detects say/tell/talk argument-frame transfer', () => {
    expectHit('She said me the truth.', 'She told me the truth.', tag);
    expectHit('Please tell with him.', 'Please talk to him.', tag);
    expectHit('I talked him about it.', 'I talked to him about it.', tag);
  });

  it('guards against valid argument frames', () => {
    expectNoTag('She told me the truth.', 'She told me the truth.', tag);
    expectNoTag('Please talk with him.', 'Please talk with him.', tag);
  });
});

describe('Group B VI-13: vi_l1_learn_study_transfer', () => {
  const tag = 'vi_l1_learn_study_transfer';

  it('detects contextual study vs learn/practice transfer', () => {
    expectHit('I study English at home every day.', 'I practice English at home every day.', tag);
    expectHit('I learned at university last year.', 'I studied at university last year.', tag);
    expectHit('I study how to cook from YouTube.', 'I learn how to cook from YouTube.', tag);
  });

  it('guards against study when expected also uses study', () => {
    expectNoTag('I study at university.', 'I study at university.', tag);
    expectNoTag('I learn English at home.', 'I learn English at home.', tag);
  });
});

describe('Group B VI-14: vi_l1_know_meet_timeline', () => {
  const tag = 'vi_l1_know_meet_timeline';

  it('detects know used for first meeting in a timeline context', () => {
    expectHit('I knew him yesterday.', 'I met him yesterday.', tag);
    expectHit('She knew my brother last year.', 'She met my brother last year.', tag);
  });

  it('guards against know as familiarity and non-timeline contexts', () => {
    expectNoTag('I know him well.', 'I know him well.', tag);
    expectNoTag('I know him.', 'I meet him.', tag);
  });
});

describe('Group B VI-15: vi_l1_verb_noun_collocation', () => {
  const tag = 'vi_l1_verb_noun_collocation';

  it('detects whitelisted take-medicine collocations', () => {
    expectHit('I eat medicine twice a day.', 'I take medicine twice a day.', tag);
    expectHit('She drinks medicine before sleep.', 'She takes medicine before sleep.', tag);
    expectHit('He used medicine yesterday.', 'He took medicine yesterday.', tag);
  });

  it('guards against valid food/drink uses and correct medicine collocation', () => {
    expectNoTag('I eat rice twice a day.', 'I eat rice twice a day.', tag);
    expectNoTag('I take medicine twice a day.', 'I take medicine twice a day.', tag);
  });
});

describe('Group B VI-16: vi_l1_appliance_open_close_transfer', () => {
  const tag = 'vi_l1_appliance_open_close_transfer';

  it('detects appliance open/close transfer', () => {
    expectHit('Open the light, please.', 'Turn on the light, please.', tag);
    expectHit('Close the TV.', 'Turn off the TV.', tag);
    expectHit('Can you open the air conditioner?', 'Can you turn on the air conditioner?', tag);
  });

  it('guards against real open/close objects', () => {
    expectNoTag('Open the door, please.', 'Open the door, please.', tag);
    expectNoTag('Turn on the light, please.', 'Turn on the light, please.', tag);
  });
});

describe('Group B VI-17: vi_l1_connector_stacking', () => {
  const tag = 'vi_l1_connector_stacking';

  it('detects redundant paired connectors', () => {
    expectHit('Because it rained, so I stayed home.', 'Because it rained, I stayed home.', tag);
    expectHit('Although he was tired, but he worked.', 'Although he was tired, he worked.', tag);
    expectHit("Even though it is cheap, but I won't buy it.", "Even though it is cheap, I won't buy it.", tag);
  });

  it('guards against single connector patterns', () => {
    expectNoTag('Because it rained, I stayed home.', 'Because it rained, I stayed home.', tag);
    expectNoTag('It rained, so I stayed home.', 'It rained, so I stayed home.', tag);
  });
});

describe('Group B VI-19: vi_l1_elliptical_subject_transfer', () => {
  const tag = 'vi_l1_elliptical_subject_transfer';

  it('detects omitted subjects in finite clauses', () => {
    expectHit("Because busy, I didn't go.", "Because I was busy, I didn't go.", tag);
    expectHit('When arrived, called me.', 'When he arrived, called me.', tag);
    expectHit('In my opinion, should study more.', 'In my opinion, we should study more.', tag);
  });

  it('guards against non-elliptical and already explicit subjects', () => {
    expectNoTag("Because I was busy, I didn't go.", "Because I was busy, I didn't go.", tag);
    expectNoTag('When the bus arrived, I called.', 'When the bus arrived, I called.', tag);
  });
});
