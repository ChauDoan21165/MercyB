import { describe, expect, it } from 'vitest';
import {
  detectL1Error,
  type L1DetectionInput,
  type L1WeaknessTag,
} from '../l1-error-detector';

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function run(
  user: string,
  expected: string,
  ctx?: L1DetectionInput['questionContext'],
) {
  return detectL1Error({ userAnswer: user, expectedAnswer: expected, questionContext: ctx });
}

function expectHit(user: string, expected: string, tag: L1WeaknessTag) {
  const r = run(user, expected);
  expect(r.matched, `expected ${tag} for "${user}" vs "${expected}"`).toBe(true);
  if (r.matched) {
    expect(r.weaknessTag).toBe(tag);
    expect(r.feedback).not.toBeNull();
    expect(r.feedback!.en.length).toBeGreaterThan(0);
    expect(r.feedback!.vi.length).toBeGreaterThan(0);
    // Every feedback string embeds the corrected answer via {FIX}.
    expect(r.feedback!.en.includes(expected)).toBe(true);
    expect(r.feedback!.vi.includes(expected)).toBe(true);
  }
}

function expectMiss(user: string, expected: string) {
  const r = run(user, expected);
  expect(r.matched, `expected NO L1 match for "${user}" vs "${expected}" — got ${r.weaknessTag}`).toBe(false);
}

function expectMissOrDifferentTag(user: string, expected: string, notTag: L1WeaknessTag) {
  const r = run(user, expected);
  if (r.matched) {
    expect(r.weaknessTag, `expected tag != ${notTag} for "${user}" / "${expected}"`).not.toBe(notTag);
  }
}

// ────────────────────────────────────────────────────────────────────────────
// 1. vi_l1_3rd_person_s
// ────────────────────────────────────────────────────────────────────────────
describe('rule 1: vi_l1_3rd_person_s', () => {
  it('positive cases (10)', () => {
    expectHit('she study english',        'she studies english',        'vi_l1_3rd_person_s');
    expectHit('he play football',         'he plays football',          'vi_l1_3rd_person_s');
    expectHit('it work well',             'it works well',              'vi_l1_3rd_person_s');
    expectHit('she go home',              'she goes home',              'vi_l1_3rd_person_s');
    expectHit('he watch tv',              'he watches tv',              'vi_l1_3rd_person_s');
    expectHit('she cry a lot',            'she cries a lot',            'vi_l1_3rd_person_s');
    expectHit('it fix itself',            'it fixes itself',            'vi_l1_3rd_person_s');
    expectHit('he have a car',            'he has a car',               'vi_l1_3rd_person_s');
    expectHit('she teach math',           'she teaches math',           'vi_l1_3rd_person_s');
    expectHit('he try hard',              'he tries hard',              'vi_l1_3rd_person_s');
  });

  it('negative cases (10)', () => {
    expectMiss('she studies english',     'she studies english');       // correct
    expectMiss('i study english',         'i study english');           // 1st person OK
    expectMiss('they study english',      'they study english');        // plural subject
    expectMiss('we play football',        'we play football');          // plural
    expectMiss('you watch tv',            'you watch tv');              // 2nd person
    expectMissOrDifferentTag('she went home', 'she goes home', 'vi_l1_3rd_person_s'); // diff tense
    expectMiss('he plays football',       'he plays football');         // already correct
    expectMiss('they are happy',          'they are happy');            // plural
    expectMiss('students learn english',  'students learn english');    // plural noun subject
    expectMissOrDifferentTag('yesterday she walk', 'yesterday she walked', 'vi_l1_3rd_person_s'); // → rule 2 past_ed
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. vi_l1_past_ed
// ────────────────────────────────────────────────────────────────────────────
describe('rule 2: vi_l1_past_ed', () => {
  it('positive cases (10)', () => {
    expectHit('yesterday i walk to school',   'yesterday i walked to school',   'vi_l1_past_ed');
    expectHit('last week i visit grandma',    'last week i visited grandma',    'vi_l1_past_ed');
    expectHit('two days ago i call her',      'two days ago i called her',      'vi_l1_past_ed');
    expectHit('yesterday he go home',         'yesterday he went home',         'vi_l1_past_ed');
    expectHit('last night we eat pho',        'last night we ate pho',          'vi_l1_past_ed');
    expectHit('yesterday she study hard',     'yesterday she studied hard',     'vi_l1_past_ed');
    expectHit('last year i live in hanoi',    'last year i lived in hanoi',     'vi_l1_past_ed');
    expectHit('yesterday i try pho',          'yesterday i tried pho',          'vi_l1_past_ed');
    expectHit('last monday they see a movie', 'last monday they saw a movie',   'vi_l1_past_ed');
    expectHit('a week ago i buy a laptop',    'a week ago i bought a laptop',   'vi_l1_past_ed');
  });

  it('negative cases (10)', () => {
    expectMiss('yesterday i walked to school',  'yesterday i walked to school');   // correct
    expectMiss('i walk every day',              'i walk every day');               // no past marker
    expectMiss('she walks every day',           'she walks every day');            // present habit
    expectMiss('i will walk tomorrow',          'i will walk tomorrow');           // future
    expectMiss('they live in hanoi',            'they live in hanoi');             // present
    expectMiss('last night we ate pho',         'last night we ate pho');          // already correct
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_past_ed'); // → rule 1
    expectMiss('i am walking now',              'i am walking now');               // present continuous
    expectMiss('yesterday i was tired',         'yesterday i was tired');          // already correct
    expectMiss('in 2030 we will travel',        'in 2030 we will travel');         // future, no past form
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. vi_l1_plural_s
// ────────────────────────────────────────────────────────────────────────────
describe('rule 3: vi_l1_plural_s', () => {
  it('positive cases (10)', () => {
    expectHit('two book',              'two books',              'vi_l1_plural_s');
    expectHit('three apple',           'three apples',           'vi_l1_plural_s');
    expectHit('many child play',       'many children play',     'vi_l1_plural_s');
    expectHit('five car',              'five cars',              'vi_l1_plural_s');
    expectHit('several student',       'several students',       'vi_l1_plural_s');
    expectHit('many man',              'many men',               'vi_l1_plural_s');
    expectHit('four box',              'four boxes',             'vi_l1_plural_s');
    expectHit('six story',             'six stories',            'vi_l1_plural_s');
    expectHit('many woman',            'many women',             'vi_l1_plural_s');
    expectHit('seven person',          'seven people',           'vi_l1_plural_s');
  });

  it('negative cases (10)', () => {
    expectMiss('two books',            'two books');                 // correct
    expectMiss('a book',               'a book');                    // singular
    expectMiss('the book',             'the book');                  // singular w/ article
    expectMiss('many children',        'many children');             // already plural
    expectMissOrDifferentTag('she book',      'she books',      'vi_l1_plural_s'); // not a plural context
    expectMiss('i have books',         'i have books');              // already plural
    expectMiss('one book',             'one book');                  // one is singular
    expectMissOrDifferentTag('i like a book', 'i like a book', 'vi_l1_plural_s');
    expectMiss('they are students',    'they are students');         // already plural
    expectMiss('no books here',        'no books here');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. vi_l1_missing_be
// ────────────────────────────────────────────────────────────────────────────
describe('rule 4: vi_l1_missing_be', () => {
  it('positive cases (10)', () => {
    expectHit('she happy',             'she is happy',               'vi_l1_missing_be');
    expectHit('he tired',              'he is tired',                'vi_l1_missing_be');
    expectHit('they hungry',           'they are hungry',            'vi_l1_missing_be');
    expectHit('we ready',              'we are ready',               'vi_l1_missing_be');
    expectHit('i sick',                'i am sick',                  'vi_l1_missing_be');
    expectHit('it cold today',         'it is cold today',           'vi_l1_missing_be');
    expectHit('she at home',           'she is at home',             'vi_l1_missing_be');
    expectHit('the room quiet',        'the room is quiet',          'vi_l1_missing_be');
    expectHit('yesterday she tired',   'yesterday she was tired',    'vi_l1_missing_be');
    expectHit('they late',             'they are late',              'vi_l1_missing_be');
  });

  it('negative cases (10)', () => {
    expectMiss('she is happy',         'she is happy');              // correct
    expectMiss('he is tired',          'he is tired');               // correct
    expectMiss('i am a student',       'i am a student');            // correct
    expectMissOrDifferentTag('she happy now',      'she is very happy now',      'vi_l1_missing_be'); // length diff > 1
    expectMissOrDifferentTag('she book',           'she reads a book',           'vi_l1_missing_be');
    expectMiss('they went home',       'they went home');            // has action verb
    expectMiss('i like pho',           'i like pho');                // has verb
    expectMissOrDifferentTag('she eat pho',        'she is eating pho',          'vi_l1_missing_be');
    expectMiss('he works hard',        'he works hard');
    expectMiss('we played football',   'we played football');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. vi_l1_question_no_aux
// ────────────────────────────────────────────────────────────────────────────
describe('rule 5: vi_l1_question_no_aux', () => {
  it('positive cases (10)', () => {
    // Using do/does/did-insertion cases. Missing-be cases ("i ready?" →
    // "am i ready?") get claimed by rule 4 (higher priority) and tested there.
    expectHit('you like coffee?',        'do you like coffee?',          'vi_l1_question_no_aux');
    expectHit('she eat meat?',           'does she eat meat?',           'vi_l1_question_no_aux');
    expectHit('he like music?',          'does he like music?',          'vi_l1_question_no_aux');
    expectHit('they come tomorrow?',     'are they coming tomorrow?',    'vi_l1_question_no_aux');
    expectHit('you play football?',      'do you play football?',        'vi_l1_question_no_aux');
    expectHit('you go yesterday?',       'did you go yesterday?',        'vi_l1_question_no_aux');
    expectHit('he finish homework?',     'did he finish homework?',      'vi_l1_question_no_aux');
    expectHit('she live here?',          'does she live here?',          'vi_l1_question_no_aux');
    expectHit('they know you?',          'do they know you?',            'vi_l1_question_no_aux');
    expectHit('she work today?',         'does she work today?',         'vi_l1_question_no_aux');
  });

  it('negative cases (10)', () => {
    expectMiss('do you like coffee?',  'do you like coffee?');       // already correct
    expectMiss('she eats meat.',       'she eats meat.');            // not a question
    expectMiss('why did you go?',      'why did you go?');           // wh-question = aux-equivalent
    expectMiss('i like coffee.',       'i like coffee.');            // statement
    expectMiss('are you ready?',       'are you ready?');            // already aux-led
    expectMiss('can you help?',        'can you help?');             // already aux-led
    expectMiss('does she eat meat?',   'does she eat meat?');
    expectMiss('he is happy.',         'he is happy.');
    expectMiss('they went home.',      'they went home.');
    expectMiss('this is my book.',     'this is my book.');              // statement
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 6. vi_l1_missing_article
// ────────────────────────────────────────────────────────────────────────────
describe('rule 6: vi_l1_missing_article', () => {
  it('positive cases (10)', () => {
    expectHit('i eat apple',            'i eat an apple',              'vi_l1_missing_article');
    expectHit('she bought car',         'she bought a car',            'vi_l1_missing_article');
    expectHit('book is on table',       'the book is on the table',    'vi_l1_missing_article');
    expectHit('i go to market',         'i go to the market',          'vi_l1_missing_article');
    expectHit('he is teacher',          'he is a teacher',             'vi_l1_missing_article');
    expectHit('they saw movie',         'they saw a movie',            'vi_l1_missing_article');
    expectHit('open door please',       'open the door please',        'vi_l1_missing_article');
    expectHit('give me pen',            'give me a pen',               'vi_l1_missing_article');
    expectHit('i want water',           'i want the water',            'vi_l1_missing_article');
    expectHit('cat is black',           'the cat is black',            'vi_l1_missing_article');
  });

  it('negative cases (10)', () => {
    expectMiss('the book is on the table', 'the book is on the table');
    expectMiss('a book',                   'a book');
    expectMiss('i eat an apple',           'i eat an apple');
    expectMiss('she bought a car',         'she bought a car');
    expectMiss('i love vietnam',           'i love vietnam');            // proper noun, no article
    expectMiss('he is at home',            'he is at home');             // idiom, no article
    expectMiss('they play football',       'they play football');        // sport, no article
    expectMiss('i like coffee',            'i like coffee');             // mass noun
    expectMiss('we go to school',          'we go to school');           // idiom
    expectMissOrDifferentTag('she happy',  'she is happy',  'vi_l1_missing_article'); // → rule 4
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 8. vi_l1_possessive_gender
// ────────────────────────────────────────────────────────────────────────────
describe('rule 8: vi_l1_possessive_gender', () => {
  it('positive cases (10)', () => {
    expectHit('his sister is nice',    'her sister is nice',         'vi_l1_possessive_gender');
    expectHit('her brother works hard','his brother works hard',     'vi_l1_possessive_gender');
    expectHit('i met his mother',      'i met her mother',           'vi_l1_possessive_gender');
    expectHit('i saw her father',      'i saw his father',           'vi_l1_possessive_gender');
    expectHit('we like his voice',     'we like her voice',          'vi_l1_possessive_gender');
    expectHit('they know her dad',     'they know his dad',          'vi_l1_possessive_gender');
    expectHit('his book is here',      'her book is here',           'vi_l1_possessive_gender');
    expectHit('her phone rings',       'his phone rings',            'vi_l1_possessive_gender');
    expectHit('his bag is heavy',      'her bag is heavy',           'vi_l1_possessive_gender');
    expectHit('her car is fast',       'his car is fast',            'vi_l1_possessive_gender');
  });

  it('negative cases (10)', () => {
    expectMiss('her sister is nice',   'her sister is nice');
    expectMiss('his brother is tall',  'his brother is tall');
    expectMiss('my sister is here',    'my sister is here');
    expectMiss('their car is fast',    'their car is fast');
    expectMiss('the bag is heavy',     'the bag is heavy');
    expectMissOrDifferentTag('he happy',       'he is happy',       'vi_l1_possessive_gender');
    expectMissOrDifferentTag('i eat apple',    'i eat an apple',    'vi_l1_possessive_gender');
    expectMiss('we like his voice',    'we like his voice');
    expectMiss('they saw him',         'they saw him');
    expectMiss('our house is big',     'our house is big');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 9. vi_l1_preposition_transfer
// ────────────────────────────────────────────────────────────────────────────
describe('rule 9: vi_l1_preposition_transfer', () => {
  it('positive cases (10)', () => {
    expectHit('i see her in monday',    'i see her on monday',          'vi_l1_preposition_transfer');
    expectHit('i live at vietnam',      'i live in vietnam',            'vi_l1_preposition_transfer');
    expectHit('i listen music',         'i listen to music',            'vi_l1_preposition_transfer');
    expectHit('meeting in friday',      'meeting on friday',            'vi_l1_preposition_transfer');
    expectHit('i wait you',             'i wait for you',               'vi_l1_preposition_transfer');
    expectHit('he study at hanoi',      'he study in hanoi',            'vi_l1_preposition_transfer');
    expectHit('look the picture',       'look at the picture',          'vi_l1_preposition_transfer');
    expectHit('birthday in sunday',     'birthday on sunday',           'vi_l1_preposition_transfer');
    expectHit('they live at saigon',    'they live in saigon',          'vi_l1_preposition_transfer');
    expectHit('party in saturday',      'party on saturday',            'vi_l1_preposition_transfer');
  });

  it('negative cases (10)', () => {
    expectMiss('i see her on monday',   'i see her on monday');
    expectMiss('i live in vietnam',     'i live in vietnam');
    expectMiss('i listen to music',     'i listen to music');
    expectMiss('i go home',             'i go home');
    expectMiss('i eat pho',             'i eat pho');
    expectMissOrDifferentTag('she happy', 'she is happy', 'vi_l1_preposition_transfer');
    expectMiss('we meet tomorrow',      'we meet tomorrow');
    expectMiss('he runs fast',          'he runs fast');
    expectMissOrDifferentTag('i eat apple', 'i eat an apple', 'vi_l1_preposition_transfer');
    expectMiss('the book is here',      'the book is here');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 10. vi_l1_countable
// ────────────────────────────────────────────────────────────────────────────
describe('rule 10: vi_l1_countable', () => {
  it('positive cases (10)', () => {
    expectHit('i need an advice',        'i need advice',               'vi_l1_countable');
    expectHit('she gave me a advice',    'she gave me advice',          'vi_l1_countable');
    expectHit('i have many informations','i have much information',     'vi_l1_countable');
    expectHit('we bought a furniture',   'we bought furniture',         'vi_l1_countable');
    expectHit('i heard a news',          'i heard news',                'vi_l1_countable');
    expectHit('a homework is hard',      'homework is hard',            'vi_l1_countable');
    expectHit('he does many homeworks',  'he does much homework',       'vi_l1_countable');
    expectHit('i gave him a equipment',  'i gave him equipment',        'vi_l1_countable');
    expectHit('she has a luggage',       'she has luggage',             'vi_l1_countable');
    expectHit('many researches show',    'much research shows',         'vi_l1_countable');
  });

  it('negative cases (10)', () => {
    expectMiss('i need advice',          'i need advice');
    expectMiss('an apple',               'an apple');                   // countable
    expectMiss('a book',                 'a book');
    expectMiss('three books',            'three books');
    expectMiss('i have information',     'i have information');
    expectMiss('he bought furniture',    'he bought furniture');
    expectMissOrDifferentTag('she happy',        'she is happy',        'vi_l1_countable');
    expectMiss('i like coffee',          'i like coffee');              // mass but not from our whitelist pair
    expectMiss('a chair is broken',      'a chair is broken');
    expectMiss('the furniture is new',   'the furniture is new');       // "the" allowed
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Cross-rule regression — 20+ assertions. Verifies priority order holds,
// identical inputs don't trigger anything, edge cases stay sane.
// ────────────────────────────────────────────────────────────────────────────
describe('cross-rule regressions', () => {
  it('identical answers never fire any rule', () => {
    expectMiss('she studies english',           'she studies english');
    expectMiss('yesterday i walked to school',  'yesterday i walked to school');
    expectMiss('i need advice',                 'i need advice');
    expectMiss('are you ready?',                'are you ready?');
    expectMiss('the book is on the table',      'the book is on the table');
  });

  it('empty or whitespace inputs return miss cleanly', () => {
    expectMiss('',                        'she studies english');
    expectMiss('she studies english',     '');
    expectMiss('   ',                     '   ');
    const r = detectL1Error({ userAnswer: '', expectedAnswer: '' });
    expect(r.matched).toBe(false);
    expect(r.weaknessTag).toBeNull();
    expect(r.feedback).toBeNull();
  });

  it('priority: past_ed wins over 3rd-person-s when both could apply', () => {
    // "yesterday she work" vs "yesterday she worked" — rule 1 doesn't match
    // because "worked" isn't a valid 3rd-person-s of "work"; rule 2 fires.
    const r = run('yesterday she work', 'yesterday she worked');
    expect(r.matched).toBe(true);
    if (r.matched) expect(r.weaknessTag).toBe('vi_l1_past_ed');
  });

  it('priority: 3rd-person-s fires before past_ed on pure present', () => {
    // No past marker → rule 2 skips, rule 1 fires.
    const r = run('she study english', 'she studies english');
    expect(r.matched).toBe(true);
    if (r.matched) expect(r.weaknessTag).toBe('vi_l1_3rd_person_s');
  });

  it('priority: missing_be fires before missing_article when both plausible', () => {
    // "she happy" vs "she is happy" — missing_be (len diff 1, be-verb insert).
    // Article count stays 0, so rule 6 can't match anyway; guard still valid.
    const r = run('she happy', 'she is happy');
    expect(r.matched).toBe(true);
    if (r.matched) expect(r.weaknessTag).toBe('vi_l1_missing_be');
  });

  it('priority: question_no_aux only fires with a question mark in user input', () => {
    // Without "?" in userText, rule 5 does not fire regardless of what the
    // expected answer looks like. Higher-priority rules may still match;
    // here nothing does, so the detector returns a clean miss and the
    // caller falls back to generic grammar feedback.
    const a = run('you like coffee', 'do you like coffee?');
    expect(a.matched).toBe(false);

    // With "?" in userText, rule 5 fires.
    const b = run('she study?', 'does she study?');
    expect(b.matched).toBe(true);
    if (b.matched) expect(b.weaknessTag).toBe('vi_l1_question_no_aux');
  });

  it('punctuation and casing do not break detection', () => {
    const r1 = run('She Study English.', 'She studies English.');
    expect(r1.matched).toBe(true);
    if (r1.matched) expect(r1.weaknessTag).toBe('vi_l1_3rd_person_s');

    const r2 = run('You like coffee?', 'Do you like coffee?');
    expect(r2.matched).toBe(true);
    if (r2.matched) expect(r2.weaknessTag).toBe('vi_l1_question_no_aux');
  });

  it('long sentences still match the first applicable rule', () => {
    expectHit(
      'my brother he study english at school every day in hanoi',
      'my brother he studies english at school every day in hanoi',
      'vi_l1_3rd_person_s',
    );
  });

  it('feedback contains the bolded grammar cues from the template', () => {
    const r = run('she study', 'she studies');
    expect(r.matched).toBe(true);
    if (r.matched) {
      expect(r.feedback.en).toContain('**she**');
      expect(r.feedback.en).toContain('**-s**');
      expect(r.feedback.vi).toContain('**she / he / it**');
      expect(r.feedback.vi).toContain('**-s**');
    }
  });

  it('feedback substitutes USER_PREP and FIX_PREP for rule 9', () => {
    const r = run('i see her in monday', 'i see her on monday');
    expect(r.matched).toBe(true);
    if (r.matched && r.weaknessTag === 'vi_l1_preposition_transfer') {
      expect(r.feedback.en).toContain('**in**');
      expect(r.feedback.en).toContain('**on**');
      expect(r.feedback.vi).toContain('**in**');
      expect(r.feedback.vi).toContain('**on**');
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Perf budget — detector must stay well under 5 ms per call on average.
// ────────────────────────────────────────────────────────────────────────────
describe('performance', () => {
  it('mean call time < 5 ms across 500 iterations', () => {
    const cases: Array<[string, string]> = [
      ['she study english',          'she studies english'],
      ['yesterday i walk to school', 'yesterday i walked to school'],
      ['two book',                   'two books'],
      ['she happy',                  'she is happy'],
      ['you like coffee?',           'do you like coffee?'],
      ['i eat apple',                'i eat an apple'],
      ['his sister',                 'her sister'],
      ['i see her in monday',        'i see her on monday'],
      ['i need an advice',           'i need advice'],
      ['i am happy',                 'i am happy'],
    ];
    const start = performance.now();
    for (let i = 0; i < 500; i++) {
      const [u, e] = cases[i % cases.length];
      detectL1Error({ userAnswer: u, expectedAnswer: e });
    }
    const mean = (performance.now() - start) / 500;
    expect(mean, `mean call time = ${mean.toFixed(3)}ms`).toBeLessThan(5);
  });
});
