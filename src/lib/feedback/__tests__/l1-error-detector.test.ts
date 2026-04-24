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
    // Note: weekday preposition swaps (in Monday → on Monday) are now
    // handled by rule 36 (time_expressions). Rule 9 focuses on location
    // and verb-preposition collocations.
    expectHit('i study in school every day', 'i study at school every day',   'vi_l1_preposition_transfer');
    expectHit('i live at vietnam',      'i live in vietnam',            'vi_l1_preposition_transfer');
    expectHit('i listen music',         'i listen to music',            'vi_l1_preposition_transfer');
    expectHit('she stays in home',      'she stays at home',            'vi_l1_preposition_transfer');
    expectHit('i wait you',             'i wait for you',               'vi_l1_preposition_transfer');
    expectHit('he study at hanoi',      'he study in hanoi',            'vi_l1_preposition_transfer');
    expectHit('look the picture',       'look at the picture',          'vi_l1_preposition_transfer');
    expectHit('he works on hospital',   'he works in hospital',         'vi_l1_preposition_transfer');
    expectHit('they live at saigon',    'they live in saigon',          'vi_l1_preposition_transfer');
    expectHit('meeting on office',      'meeting in office',            'vi_l1_preposition_transfer');
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
// 11. vi_l1_to_verb_confusion — "i want go" → "i want to go"
// ────────────────────────────────────────────────────────────────────────────
describe('rule 11: vi_l1_to_verb_confusion', () => {
  it('positive cases (10)', () => {
    expectHit('i want go home',             'i want to go home',             'vi_l1_to_verb_confusion');
    expectHit('i need eat',                 'i need to eat',                 'vi_l1_to_verb_confusion');
    expectHit('she try finish her work',    'she try to finish her work',    'vi_l1_to_verb_confusion');
    expectHit('he hope see you',            'he hope to see you',            'vi_l1_to_verb_confusion');
    expectHit('i plan travel next month',   'i plan to travel next month',   'vi_l1_to_verb_confusion');
    expectHit('she decide leave',           'she decide to leave',           'vi_l1_to_verb_confusion');
    expectHit('they learn speak english',   'they learn to speak english',   'vi_l1_to_verb_confusion');
    expectHit('i prefer stay home',         'i prefer to stay home',         'vi_l1_to_verb_confusion');
    expectHit('we agree meet at six',       'we agree to meet at six',       'vi_l1_to_verb_confusion');
    expectHit('i promise help you',         'i promise to help you',         'vi_l1_to_verb_confusion');
  });

  it('negative cases (10)', () => {
    expectMiss('i want to go home',         'i want to go home');
    expectMiss('she goes home',             'she goes home');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_to_verb_confusion');
    expectMiss('i like pho',                'i like pho');          // "like"+noun is fine
    expectMiss('he can swim',               'he can swim');         // modal, not trigger verb
    expectMiss('i love her',                'i love her');          // love + object, not verb
    expectMiss('i start the work',          'i start the work');    // start + noun
    expectMiss('they will meet tomorrow',   'they will meet tomorrow');
    expectMiss('we need money',             'we need money');
    expectMissOrDifferentTag('she happy',   'she is happy',         'vi_l1_to_verb_confusion');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 12. vi_l1_can_no_infinitive — "she can speaks" → "she can speak"
// ────────────────────────────────────────────────────────────────────────────
describe('rule 12: vi_l1_can_no_infinitive', () => {
  it('positive cases (10)', () => {
    expectHit('she can speaks english',     'she can speak english',         'vi_l1_can_no_infinitive');
    expectHit('he can sings well',          'he can sing well',              'vi_l1_can_no_infinitive');
    expectHit('i could went there',         'i could go there',              'vi_l1_can_no_infinitive');
    expectHit('they will came tomorrow',    'they will come tomorrow',       'vi_l1_can_no_infinitive');
    expectHit('she should studies more',    'she should study more',         'vi_l1_can_no_infinitive');
    expectHit('he must works harder',       'he must work harder',           'vi_l1_can_no_infinitive');
    expectHit('i might goes home',          'i might go home',               'vi_l1_can_no_infinitive');
    expectHit('we would plays football',    'we would play football',        'vi_l1_can_no_infinitive');
    expectHit('she may sings',              'she may sing',                  'vi_l1_can_no_infinitive');
    expectHit('he can ate all of it',       'he can eat all of it',          'vi_l1_can_no_infinitive');
  });

  it('negative cases (10)', () => {
    expectMiss('she can speak english',     'she can speak english');
    expectMiss('he can sing well',          'he can sing well');
    expectMiss('they will come tomorrow',   'they will come tomorrow');
    expectMiss('i should study more',       'i should study more');
    expectMissOrDifferentTag('she studies english', 'she studies english', 'vi_l1_can_no_infinitive'); // no modal
    expectMiss('i went home',               'i went home');            // past, no modal
    expectMiss('he plays football',         'he plays football');
    expectMissOrDifferentTag('she eat apple', 'she eats apple', 'vi_l1_can_no_infinitive'); // rule 1
    expectMiss('we do the work',            'we do the work');
    expectMiss('she has a cat',             'she has a cat');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 13. vi_l1_double_past — "i didn't went" → "i didn't go"
// ────────────────────────────────────────────────────────────────────────────
describe('rule 13: vi_l1_double_past', () => {
  it('positive cases (10)', () => {
    expectHit("i didn't went home",         "i didn't go home",              'vi_l1_double_past');
    expectHit("she didn't ate lunch",       "she didn't eat lunch",          'vi_l1_double_past');
    expectHit("he doesn't likes coffee",    "he doesn't like coffee",        'vi_l1_double_past');
    expectHit("they didn't came yesterday", "they didn't come yesterday",    'vi_l1_double_past');
    expectHit("she doesn't knows me",       "she doesn't know me",           'vi_l1_double_past');
    expectHit("i don't likes it",           "i don't like it",               'vi_l1_double_past');
    expectHit("we didn't saw the movie",    "we didn't see the movie",       'vi_l1_double_past');
    expectHit("he didn't bought it",        "he didn't buy it",              'vi_l1_double_past');
    expectHit("did she went there",         "did she go there",              'vi_l1_double_past');
    expectHit("does he likes pho",          "does he like pho",              'vi_l1_double_past');
  });

  it('negative cases (10)', () => {
    expectMiss("i didn't go home",          "i didn't go home");
    expectMiss("she didn't eat lunch",      "she didn't eat lunch");
    expectMiss("he doesn't like coffee",    "he doesn't like coffee");
    expectMiss('i went home',               'i went home');               // plain past
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_double_past'); // rule 1
    expectMissOrDifferentTag('yesterday i walk', 'yesterday i walked', 'vi_l1_double_past'); // rule 2
    expectMiss("i don't know",              "i don't know");
    expectMiss("she doesn't cry",           "she doesn't cry");
    expectMiss('does he know',              'does he know');
    expectMiss("we didn't see it",          "we didn't see it");
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 14. vi_l1_possessive_s_missing — "my mother house" → "my mother's house"
// ────────────────────────────────────────────────────────────────────────────
describe('rule 14: vi_l1_possessive_s_missing', () => {
  it('positive cases (10)', () => {
    expectHit("my mother house is big",         "my mother's house is big",           'vi_l1_possessive_s_missing');
    expectHit("my brother car is red",          "my brother's car is red",            'vi_l1_possessive_s_missing');
    expectHit("the teacher book is on desk",    "the teacher's book is on desk",      'vi_l1_possessive_s_missing');
    expectHit("my friend bike broke",           "my friend's bike broke",             'vi_l1_possessive_s_missing');
    expectHit("john house is near school",      "john's house is near school",        'vi_l1_possessive_s_missing');
    expectHit("the doctor clinic opens early",  "the doctor's clinic opens early",    'vi_l1_possessive_s_missing');
    expectHit("my sister room is clean",        "my sister's room is clean",          'vi_l1_possessive_s_missing');
    expectHit("the dog tail is wagging",        "the dog's tail is wagging",          'vi_l1_possessive_s_missing');
    expectHit("my boss office is downstairs",   "my boss's office is downstairs",     'vi_l1_possessive_s_missing');
    expectHit("mary bag is on the chair",       "mary's bag is on the chair",         'vi_l1_possessive_s_missing');
  });

  it('negative cases (10)', () => {
    expectMiss("my mother's house is big",      "my mother's house is big");
    expectMiss("my brother's car is red",       "my brother's car is red");
    expectMiss('the book is on the table',      'the book is on the table');
    expectMiss('she has a car',                 'she has a car');
    expectMissOrDifferentTag('she happy',       'she is happy',       'vi_l1_possessive_s_missing');
    expectMiss('my house is big',               'my house is big');   // one noun only
    expectMiss('the teacher helps students',    'the teacher helps students');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_possessive_s_missing');
    expectMiss("i like my mother's cooking",    "i like my mother's cooking");
    expectMiss('the cars are fast',             'the cars are fast');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 15. vi_l1_comparative_double — "more better" / "more faster"
// ────────────────────────────────────────────────────────────────────────────
describe('rule 15: vi_l1_comparative_double', () => {
  it('positive cases (10)', () => {
    expectHit('this is more better',        'this is better',                'vi_l1_comparative_double');
    expectHit('he runs more faster',        'he runs faster',                'vi_l1_comparative_double');
    expectHit('she is more taller',         'she is taller',                 'vi_l1_comparative_double');
    expectHit('it is more bigger',          'it is bigger',                  'vi_l1_comparative_double');
    expectHit('this car is more smaller',   'this car is smaller',           'vi_l1_comparative_double');
    expectHit('he is more stronger',        'he is stronger',                'vi_l1_comparative_double');
    expectHit('she looks more younger',     'she looks younger',             'vi_l1_comparative_double');
    expectHit('it got more worse',          'it got worse',                  'vi_l1_comparative_double');
    expectHit('we need more longer rope',   'we need longer rope',           'vi_l1_comparative_double');
    expectHit('this is more cheaper',       'this is cheaper',               'vi_l1_comparative_double');
  });

  it('negative cases (10)', () => {
    expectMiss('this is better',            'this is better');
    expectMiss('he runs faster',            'he runs faster');
    expectMiss('this is more expensive',    'this is more expensive');      // correct, no -er
    expectMiss('i want more',               'i want more');                 // "more" alone
    expectMiss('give me more books',        'give me more books');
    expectMissOrDifferentTag('she happy',   'she is happy',                 'vi_l1_comparative_double');
    expectMiss('she is taller than me',     'she is taller than me');
    expectMiss('it is the biggest',         'it is the biggest');
    expectMiss('a little more rice please', 'a little more rice please');   // "more rice" not comparative
    expectMiss('she has more money',        'she has more money');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 16. vi_l1_adjective_order — "car red" → "red car"
// ────────────────────────────────────────────────────────────────────────────
describe('rule 16: vi_l1_adjective_order', () => {
  it('positive cases (10)', () => {
    expectHit('i have car red',             'i have red car',                'vi_l1_adjective_order');
    expectHit('she wears dress beautiful',  'she wears beautiful dress',     'vi_l1_adjective_order');
    expectHit('the book new is here',       'the new book is here',          'vi_l1_adjective_order');
    expectHit('my bag small',               'my small bag',                  'vi_l1_adjective_order');
    expectHit('a phone old',                'a old phone',                   'vi_l1_adjective_order');
    expectHit('the house big',              'the big house',                 'vi_l1_adjective_order');
    expectHit('i see dog black',            'i see black dog',               'vi_l1_adjective_order');
    expectHit('she has shirt blue',         'she has blue shirt',            'vi_l1_adjective_order');
    expectHit('the room warm',              'the warm room',                 'vi_l1_adjective_order');
    expectHit('my cat white',               'my white cat',                  'vi_l1_adjective_order');
  });

  it('negative cases (10)', () => {
    expectMiss('i have red car',            'i have red car');
    expectMiss('she wears beautiful dress', 'she wears beautiful dress');
    expectMissOrDifferentTag('she happy',   'she is happy',                  'vi_l1_adjective_order');
    expectMiss('the book is new',           'the book is new');              // predicative adj is fine
    expectMiss('the car is red',            'the car is red');               // predicative
    expectMiss('she is happy',              'she is happy');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_adjective_order');
    expectMiss('i have two cats',           'i have two cats');
    expectMiss('this is good',              'this is good');
    expectMiss('the cars are blue',         'the cars are blue');            // predicative, plural noun not in COMMON_NOUNS
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 17. vi_l1_very_much_placement — "i very much like it" → "i like it very much"
// ────────────────────────────────────────────────────────────────────────────
describe('rule 17: vi_l1_very_much_placement', () => {
  it('positive cases (10)', () => {
    expectHit('i very much like it',        'i like it very much',           'vi_l1_very_much_placement');
    expectHit('she very much enjoys music', 'she enjoys music very much',    'vi_l1_very_much_placement');
    expectHit('we very much want pho',      'we want pho very much',         'vi_l1_very_much_placement');
    expectHit('he very much misses home',   'he misses home very much',      'vi_l1_very_much_placement');
    expectHit('they very much love movies', 'they love movies very much',    'vi_l1_very_much_placement');
    expectHit('i very much enjoyed it',     'i enjoyed it very much',        'vi_l1_very_much_placement');
    expectHit('she very much wants to go',  'she wants to go very much',     'vi_l1_very_much_placement');
    expectHit('you very much help me',      'you help me very much',         'vi_l1_very_much_placement');
    expectHit('we very much appreciate it', 'we appreciate it very much',    'vi_l1_very_much_placement');
    expectHit('he very much hopes so',      'he hopes so very much',         'vi_l1_very_much_placement');
  });

  it('negative cases (10)', () => {
    expectMiss('i like it very much',           'i like it very much');
    expectMiss('thank you very much',           'thank you very much');
    expectMiss('i like it',                     'i like it');
    expectMiss('very much of the time',         'very much of the time');
    expectMissOrDifferentTag('she happy',       'she is happy',                  'vi_l1_very_much_placement');
    expectMiss('she enjoys music',              'she enjoys music');
    expectMiss('we want pho very much',         'we want pho very much');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_very_much_placement');
    expectMiss('i am very hungry',              'i am very hungry');            // "very" without "much"
    expectMiss('it is very important',          'it is very important');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 18. vi_l1_there_are_singular — "there are a book" → "there is a book"
// ────────────────────────────────────────────────────────────────────────────
describe('rule 18: vi_l1_there_are_singular', () => {
  it('positive cases (10)', () => {
    expectHit('there are a book on the table', 'there is a book on the table',  'vi_l1_there_are_singular');
    expectHit('there are an apple here',       'there is an apple here',        'vi_l1_there_are_singular');
    expectHit('there are one cat in the room', 'there is one cat in the room',  'vi_l1_there_are_singular');
    expectHit('there are a car outside',       'there is a car outside',        'vi_l1_there_are_singular');
    expectHit('there are a problem',           'there is a problem',            'vi_l1_there_are_singular');
    expectHit('there are an orange',           'there is an orange',            'vi_l1_there_are_singular');
    expectHit('there are a teacher here',      'there is a teacher here',       'vi_l1_there_are_singular');
    expectHit('there are an error',            'there is an error',             'vi_l1_there_are_singular');
    expectHit('there are one pen',             'there is one pen',              'vi_l1_there_are_singular');
    expectHit('there are a room for you',      'there is a room for you',       'vi_l1_there_are_singular');
  });

  it('negative cases (10)', () => {
    expectMiss('there is a book on the table', 'there is a book on the table');
    expectMiss('there are books on the table', 'there are books on the table'); // plural OK
    expectMiss('there are many cars',          'there are many cars');
    expectMiss('there are two apples',         'there are two apples');
    expectMiss('there is a problem',           'there is a problem');
    expectMissOrDifferentTag('she happy',      'she is happy',                  'vi_l1_there_are_singular');
    expectMiss('there are some people',        'there are some people');
    expectMiss('we have a book',               'we have a book');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_there_are_singular');
    expectMiss('there were some apples',       'there were some apples');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 19. vi_l1_everyone_plural — "everyone are" → "everyone is"
// ────────────────────────────────────────────────────────────────────────────
describe('rule 19: vi_l1_everyone_plural', () => {
  it('positive cases (10)', () => {
    expectHit('everyone are happy here',      'everyone is happy here',         'vi_l1_everyone_plural');
    expectHit('someone are knocking',         'someone is knocking',            'vi_l1_everyone_plural');
    expectHit('anyone have a pen',            'anyone has a pen',               'vi_l1_everyone_plural');
    expectHit('nobody were there',            'nobody was there',               'vi_l1_everyone_plural');
    expectHit('everybody have homework',      'everybody has homework',         'vi_l1_everyone_plural');
    expectHit('everyone were tired',          'everyone was tired',             'vi_l1_everyone_plural');
    expectHit('somebody are waiting',         'somebody is waiting',            'vi_l1_everyone_plural');
    expectHit('nothing are easy',             'nothing is easy',                'vi_l1_everyone_plural');
    expectHit('everything have changed',      'everything has changed',         'vi_l1_everyone_plural');
    expectHit('anybody are welcome',          'anybody is welcome',             'vi_l1_everyone_plural');
  });

  it('negative cases (10)', () => {
    expectMiss('everyone is happy here',      'everyone is happy here');
    expectMiss('they are happy',              'they are happy');
    expectMiss('we have homework',            'we have homework');
    expectMiss('the students are here',       'the students are here');
    expectMissOrDifferentTag('she happy',     'she is happy',                   'vi_l1_everyone_plural');
    expectMiss('people are waiting',          'people are waiting');          // "people" not indef
    expectMiss('someone was knocking',        'someone was knocking');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_everyone_plural');
    expectMiss('nothing is wrong',            'nothing is wrong');
    expectMiss('everybody has left',          'everybody has left');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 20. vi_l1_make_vs_do — collocation errors
// ────────────────────────────────────────────────────────────────────────────
describe('rule 20: vi_l1_make_vs_do', () => {
  it('positive cases (10)', () => {
    expectHit('i always do a mistake',         'i always make a mistake',          'vi_l1_make_vs_do');
    expectHit('she made homework fast',        'she did homework fast',            'vi_l1_make_vs_do');
    // "make a homework" would also fire rule 10 (countable noun with article);
    // by priority rule 10 wins. Use a case that's cleanly rule 20 only.
    expectHit('please make homework now',      'please do homework now',           'vi_l1_make_vs_do');
    expectHit('he do a decision yesterday',    'he made a decision yesterday',     'vi_l1_make_vs_do');
    expectHit('we make exercise every day',    'we do exercise every day',         'vi_l1_make_vs_do');
    expectHit('they make sport every weekend', 'they do sport every weekend',      'vi_l1_make_vs_do');
    expectHit('he makes business with japan',  'he does business with japan',      'vi_l1_make_vs_do');
    expectHit('she do an effort today',        'she made an effort today',         'vi_l1_make_vs_do');
    expectHit('we do a plan for summer',       'we make a plan for summer',        'vi_l1_make_vs_do');
    expectHit('i make research online',        'i do research online',             'vi_l1_make_vs_do');
  });

  it('negative cases (10)', () => {
    expectMiss('i always make a mistake',      'i always make a mistake');
    expectMiss('she did homework fast',        'she did homework fast');
    expectMiss('they do their best',           'they do their best');            // correct
    expectMiss('please make dinner',           'please make dinner');            // correct
    expectMiss('he made a phone call',         'he made a phone call');
    expectMissOrDifferentTag('she happy',      'she is happy',                   'vi_l1_make_vs_do');
    expectMiss('i finished my work',           'i finished my work');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_make_vs_do');
    expectMiss('we made progress',             'we made progress');
    expectMiss('do the dishes please',         'do the dishes please');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 21. vi_l1_tag_question — ", no?" / ", yes?"
// ────────────────────────────────────────────────────────────────────────────
describe('rule 21: vi_l1_tag_question', () => {
  it('positive cases (10)', () => {
    expectHit('you like coffee, no?',          "you like coffee, don't you?",        'vi_l1_tag_question');
    expectHit('she is tired, no?',             "she is tired, isn't she?",           'vi_l1_tag_question');
    expectHit('he is coming, yes?',            'he is coming, right?',               'vi_l1_tag_question');
    expectHit('you went there, no?',           "you went there, didn't you?",        'vi_l1_tag_question');
    expectHit('they will come, no?',           "they will come, won't they?",        'vi_l1_tag_question');
    expectHit('it is hot today, no?',          "it is hot today, isn't it?",         'vi_l1_tag_question');
    expectHit('you can swim, yes?',            'you can swim, right?',               'vi_l1_tag_question');
    expectHit('she has a dog, no?',            "she has a dog, doesn't she?",        'vi_l1_tag_question');
    expectHit('we are friends, yes?',          "we are friends, aren't we?",         'vi_l1_tag_question');
    expectHit('you speak vietnamese, no?',     "you speak vietnamese, don't you?",   'vi_l1_tag_question');
  });

  it('negative cases (10)', () => {
    expectMiss("you like coffee, don't you?",  "you like coffee, don't you?");
    expectMiss('do you like coffee?',          'do you like coffee?');
    expectMiss('is she tired?',                'is she tired?');
    expectMiss('i said no',                    'i said no');                         // no ? at end
    expectMiss('yes that is right',            'yes that is right');
    expectMissOrDifferentTag('she happy',      'she is happy',                       'vi_l1_tag_question');
    expectMiss("no, i don't like it",          "no, i don't like it");
    expectMissOrDifferentTag('she study english', 'she studies english',             'vi_l1_tag_question');
    expectMiss('we are ready?',                'we are ready?');
    expectMiss('where are you going?',         'where are you going?');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// v1.2 rule tests — 15 new rules, 10+ positive / 10+ negative each.
// ────────────────────────────────────────────────────────────────────────────

// 22. vi_l1_past_perfect_missing
describe('rule 22: vi_l1_past_perfect_missing', () => {
  it('positive cases (10)', () => {
    expectHit('when i arrived he left',          'when i arrived he had left',           'vi_l1_past_perfect_missing');
    expectHit('before she came i finished',      'before she came i had finished',       'vi_l1_past_perfect_missing');
    expectHit('when we got there they gone',     'when we got there they had gone',      'vi_l1_past_perfect_missing');
    expectHit('after he spoke she cried',        'after he spoke she had cried',         'vi_l1_past_perfect_missing');
    expectHit('when i called she eaten',         'when i called she had eaten',          'vi_l1_past_perfect_missing');
    expectHit('by the time i arrived he gone',   'by the time i arrived he had gone',    'vi_l1_past_perfect_missing');
    expectHit('when they came we seen it',       'when they came we had seen it',        'vi_l1_past_perfect_missing');
    expectHit('already i finished',              'already i had finished',               'vi_l1_past_perfect_missing');
    expectHit('just before he asked i left',     'just before he asked i had left',      'vi_l1_past_perfect_missing');
    expectHit('when i woke up she gone',         'when i woke up she had gone',          'vi_l1_past_perfect_missing');
  });
  it('negative cases (10)', () => {
    expectMiss('when i arrived he had left',     'when i arrived he had left');
    expectMiss('i went home',                    'i went home');                  // no context word
    expectMiss('yesterday i ate pho',            'yesterday i ate pho');
    expectMiss('she has a car',                  'she has a car');                // "had" alone = possession
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_past_perfect_missing');
    expectMiss('when i arrive he leaves',        'when i arrive he leaves');       // present tense
    expectMiss('i had a dog',                    'i had a dog');
    expectMissOrDifferentTag('yesterday i walk', 'yesterday i walked', 'vi_l1_past_perfect_missing');
    expectMiss('when we met she was happy',      'when we met she was happy');
    expectMiss('i finished it',                  'i finished it');
  });
});

// 23. vi_l1_reported_speech
describe('rule 23: vi_l1_reported_speech', () => {
  it('positive cases (10)', () => {
    expectHit('he said he is tired',             'he said he was tired',                 'vi_l1_reported_speech');
    expectHit('she said she has a dog',          'she said she had a dog',               'vi_l1_reported_speech');
    expectHit('they said they are coming',       'they said they were coming',           'vi_l1_reported_speech');
    expectHit('he said he will come',            'he said he would come',                'vi_l1_reported_speech');
    expectHit('she said she can help',           'she said she could help',              'vi_l1_reported_speech');
    expectHit('he said he may join',             'he said he might join',                'vi_l1_reported_speech');
    expectHit('she said she does it',            'she said she did it',                  'vi_l1_reported_speech');
    expectHit('he said the teacher is here',     'he said the teacher was here',         'vi_l1_reported_speech');
    expectHit('she said the boy has money',      'she said the boy had money',           'vi_l1_reported_speech');
    expectHit('he said they are friends',        'he said they were friends',            'vi_l1_reported_speech');
  });
  it('negative cases (10)', () => {
    expectMiss('he said he was tired',           'he said he was tired');
    expectMiss('he says he is tired',            'he says he is tired');               // present reporting OK
    expectMiss('she is tired',                   'she is tired');                       // no "said"
    expectMissOrDifferentTag('she happy',        'she is happy',                         'vi_l1_reported_speech');
    expectMiss('i think he is tired',            'i think he is tired');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_reported_speech');
    expectMiss('he said it',                     'he said it');
    expectMiss('they told me',                   'they told me');
    expectMiss('he said nothing',                'he said nothing');
    expectMiss('she said yes',                   'she said yes');
  });
});

// 24. vi_l1_since_vs_for
describe('rule 24: vi_l1_since_vs_for', () => {
  it('positive cases (10)', () => {
    expectHit('i live here since 5 years',       'i live here for 5 years',              'vi_l1_since_vs_for');
    expectHit('i work here since 3 months',      'i work here for 3 months',             'vi_l1_since_vs_for');
    expectHit('they married since 10 years',     'they married for 10 years',            'vi_l1_since_vs_for');
    expectHit('she studies english since 2 years','she studies english for 2 years',     'vi_l1_since_vs_for');
    expectHit('i live in hanoi for 2020',        'i live in hanoi since 2020',           'vi_l1_since_vs_for');
    expectHit('he works there for 2019',         'he works there since 2019',            'vi_l1_since_vs_for');
    expectHit('she has been here for monday',    'she has been here since monday',       'vi_l1_since_vs_for');
    expectHit('i have been sick since 2 weeks',  'i have been sick for 2 weeks',         'vi_l1_since_vs_for');
    expectHit('we are friends since 6 years',    'we are friends for 6 years',           'vi_l1_since_vs_for');
    expectHit('he studies for last year',        'he studies since last year',           'vi_l1_since_vs_for');
  });
  it('negative cases (10)', () => {
    expectMiss('i live here for 5 years',        'i live here for 5 years');
    expectMiss('i live here since 2020',         'i live here since 2020');
    expectMissOrDifferentTag('she happy',        'she is happy',                         'vi_l1_since_vs_for');
    expectMiss('i want to stay',                 'i want to stay');
    expectMiss('she waited patiently',           'she waited patiently');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_since_vs_for');
    expectMiss('i go there on monday',           'i go there on monday');
    expectMiss('for a long time we talked',      'for a long time we talked');
    expectMiss('since then everything changed',  'since then everything changed');
    expectMiss('i have a cat',                   'i have a cat');
  });
});

// 25. vi_l1_countable_much
describe('rule 25: vi_l1_countable_much', () => {
  it('positive cases (10)', () => {
    expectHit('i have much books',               'i have many books',                    'vi_l1_countable_much');
    expectHit('she has much friends',            'she has many friends',                 'vi_l1_countable_much');
    expectHit('there are much cars',             'there are many cars',                  'vi_l1_countable_much');
    expectHit('we need much students',           'we need many students',                'vi_l1_countable_much');
    expectHit('they have much problems',         'they have many problems',              'vi_l1_countable_much');
    expectHit('give me many advice',             'give me much advice',                  'vi_l1_countable_much');
    expectHit('i have many homework',            'i have much homework',                 'vi_l1_countable_much');
    expectHit('she needs many information',      'she needs much information',           'vi_l1_countable_much');
    expectHit('they have many furniture',        'they have much furniture',             'vi_l1_countable_much');
    expectHit('he earned many money',            'he earned much money',                 'vi_l1_countable_much');
  });
  it('negative cases (10)', () => {
    expectMiss('i have many books',              'i have many books');
    expectMiss('i need much information',        'i need much information');
    expectMissOrDifferentTag('she happy',        'she is happy',                         'vi_l1_countable_much');
    expectMiss('there are some books',           'there are some books');
    expectMiss('i have a lot of books',          'i have a lot of books');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_countable_much');
    expectMiss('give me a book',                 'give me a book');
    expectMiss('i have two books',               'i have two books');
    expectMiss('he has little money',            'he has little money');
    expectMiss('they need help',                 'they need help');
  });
});

// 26. vi_l1_some_vs_any
describe('rule 26: vi_l1_some_vs_any', () => {
  it('positive cases (10)', () => {
    expectHit('do you have some questions?',     'do you have any questions?',           'vi_l1_some_vs_any');
    expectHit('does she have some money?',       'does she have any money?',             'vi_l1_some_vs_any');
    expectHit("i don't have some time",          "i don't have any time",                'vi_l1_some_vs_any');
    expectHit("she doesn't know some english",   "she doesn't know any english",         'vi_l1_some_vs_any');
    expectHit('did he bring some food?',         'did he bring any food?',               'vi_l1_some_vs_any');
    expectHit("we don't need some help",         "we don't need any help",               'vi_l1_some_vs_any');
    expectHit('do they sell some books?',        'do they sell any books?',              'vi_l1_some_vs_any');
    expectHit("i didn't see some people",        "i didn't see any people",              'vi_l1_some_vs_any');
    expectHit('does the shop have some milk?',   'does the shop have any milk?',         'vi_l1_some_vs_any');
    expectHit("he doesn't want some coffee",     "he doesn't want any coffee",           'vi_l1_some_vs_any');
  });
  it('negative cases (10)', () => {
    expectMiss('do you have any questions?',     'do you have any questions?');
    expectMiss('i have some coffee',             'i have some coffee');                 // positive OK
    expectMiss('i bought some books yesterday',  'i bought some books yesterday');
    expectMissOrDifferentTag('she happy',        'she is happy',                         'vi_l1_some_vs_any');
    expectMiss('she has some friends',           'she has some friends');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_some_vs_any');
    expectMiss('some people like it',            'some people like it');
    expectMiss('give me some bread',             'give me some bread');
    expectMiss('we need some time',              'we need some time');
    expectMiss('any questions?',                 'any questions?');
  });
});

// 27. vi_l1_reflexive_missing
describe('rule 27: vi_l1_reflexive_missing', () => {
  it('positive cases (10)', () => {
    expectHit('i enjoyed at the party',          'i enjoyed myself at the party',        'vi_l1_reflexive_missing');
    expectHit('please behave in class',          'please behave yourself in class',      'vi_l1_reflexive_missing');
    expectHit('he hurt on the field',            'he hurt himself on the field',         'vi_l1_reflexive_missing');
    expectHit('she introduced to the group',     'she introduced herself to the group',  'vi_l1_reflexive_missing');
    expectHit('we enjoyed during the trip',      'we enjoyed ourselves during the trip', 'vi_l1_reflexive_missing');
    expectHit('they behaved at dinner',          'they behaved themselves at dinner',    'vi_l1_reflexive_missing');
    expectHit('i cut with the knife',            'i cut myself with the knife',          'vi_l1_reflexive_missing');
    expectHit('she helped to the food',          'she helped herself to the food',       'vi_l1_reflexive_missing');
    expectHit('you should enjoy more',           'you should enjoy yourself more',       'vi_l1_reflexive_missing');
    expectHit('he introduced at the meeting',    'he introduced himself at the meeting', 'vi_l1_reflexive_missing');
  });
  it('negative cases (10)', () => {
    expectMiss('i enjoyed myself at the party',  'i enjoyed myself at the party');
    expectMiss('i enjoyed the food',             'i enjoyed the food');                 // transitive is fine
    expectMiss('he helped her',                  'he helped her');
    expectMissOrDifferentTag('she happy',        'she is happy',                         'vi_l1_reflexive_missing');
    expectMiss('they played outside',            'they played outside');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_reflexive_missing');
    expectMiss('she enjoyed the movie',          'she enjoyed the movie');
    expectMiss('i cut the bread',                'i cut the bread');                    // transitive
    expectMiss('he introduced his friend',       'he introduced his friend');           // transitive
    expectMiss('we helped mom',                  'we helped mom');
  });
});

// 28. vi_l1_conditional_mix
describe('rule 28: vi_l1_conditional_mix', () => {
  it('positive cases (10)', () => {
    expectHit('if i will have time i call you',  'if i have time i call you',            'vi_l1_conditional_mix');
    expectHit('if she will come tell me',        'if she comes tell me',                 'vi_l1_conditional_mix');
    expectHit('if he will be here wait',         'if he is here wait',                   'vi_l1_conditional_mix');
    expectHit('if it will rain we stay',         'if it rains we stay',                  'vi_l1_conditional_mix');
    expectHit('if you will finish go home',      'if you finish go home',                'vi_l1_conditional_mix');
    expectHit('if they will agree we sign',      'if they agree we sign',                'vi_l1_conditional_mix');
    expectHit('if we will go call me',           'if we go call me',                     'vi_l1_conditional_mix');
    expectHit('if mom will call tell her yes',   'if mom calls tell her yes',            'vi_l1_conditional_mix');
    expectHit('if i will see her tomorrow',      'if i see her tomorrow',                'vi_l1_conditional_mix');
    expectHit('if the bus will come we leave',   'if the bus comes we leave',            'vi_l1_conditional_mix');
  });
  it('negative cases (10)', () => {
    expectMiss('if i have time i will call',     'if i have time i will call');
    expectMiss('she will come tomorrow',         'she will come tomorrow');             // no "if"
    expectMiss('i will go home',                 'i will go home');
    expectMissOrDifferentTag('she happy',        'she is happy',                         'vi_l1_conditional_mix');
    expectMiss('when i arrive i will call',     'when i arrive i will call');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_conditional_mix');
    expectMiss('if only i knew',                 'if only i knew');
    expectMiss('if she came we would talk',      'if she came we would talk');
    expectMiss('will it rain?',                  'will it rain?');
    expectMiss('i hope she will come',           'i hope she will come');
  });
});

// 29. vi_l1_to_infinitive_after_ing
describe('rule 29: vi_l1_to_infinitive_after_ing', () => {
  it('positive cases (10)', () => {
    expectHit('i want going home',               'i want to go home',                    'vi_l1_to_infinitive_after_ing');
    expectHit('she needs eating lunch',          'she needs to eat lunch',               'vi_l1_to_infinitive_after_ing');
    expectHit('he hopes seeing you',             'he hopes to see you',                  'vi_l1_to_infinitive_after_ing');
    expectHit('we decided going away',           'we decided to go away',                'vi_l1_to_infinitive_after_ing');
    expectHit('they planned traveling',          'they planned to travel',               'vi_l1_to_infinitive_after_ing');
    expectHit('i want writing a book',           'i want to write a book',               'vi_l1_to_infinitive_after_ing');
    expectHit('she needs reading more',          'she needs to read more',               'vi_l1_to_infinitive_after_ing');
    expectHit('he wants learning english',       'he wants to learn english',            'vi_l1_to_infinitive_after_ing');
    expectHit('they hoped meeting you',          'they hoped to meet you',               'vi_l1_to_infinitive_after_ing');
    expectHit('we want staying here',            'we want to stay here',                 'vi_l1_to_infinitive_after_ing');
  });
  it('negative cases (10)', () => {
    expectMiss('i want to go home',              'i want to go home');
    expectMiss('i enjoy going home',             'i enjoy going home');                 // enjoy takes -ing
    expectMiss('she is going home',              'she is going home');
    expectMissOrDifferentTag('she happy',        'she is happy',                         'vi_l1_to_infinitive_after_ing');
    expectMissOrDifferentTag('i want go home',   'i want to go home',                    'vi_l1_to_infinitive_after_ing');  // rule 11
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_to_infinitive_after_ing');
    expectMiss('he likes reading',               'he likes reading');
    expectMiss('they love dancing',              'they love dancing');
    expectMiss('i am learning english',          'i am learning english');
    expectMiss('she will finish soon',           'she will finish soon');
  });
});

// 30. vi_l1_passive_missing_be
describe('rule 30: vi_l1_passive_missing_be', () => {
  it('positive cases (10)', () => {
    // Cases with irregular past participles (eaten/written/sung/sent/broken/
    // stolen/taken/built) are recognised without needing a `by` agent.
    expectHit('the cake eaten by the dog',       'the cake was eaten by the dog',        'vi_l1_passive_missing_be');
    expectHit('the book written by chau',        'the book was written by chau',         'vi_l1_passive_missing_be');
    expectHit('the song sung beautifully',       'the song was sung beautifully',        'vi_l1_passive_missing_be');
    expectHit('the letter sent yesterday',       'the letter was sent yesterday',        'vi_l1_passive_missing_be');
    expectHit('the window broken',               'the window was broken',                'vi_l1_passive_missing_be');
    expectHit('the money stolen',                'the money was stolen',                 'vi_l1_passive_missing_be');
    expectHit('the picture taken in 2020',       'the picture was taken in 2020',        'vi_l1_passive_missing_be');
    expectHit('the bridge built last year',      'the bridge was built last year',       'vi_l1_passive_missing_be');
    // Cases with regular -ed participles need a `by` agent to confirm
    // passive (otherwise "painted" etc. could be an adjective).
    expectHit('the message received by mary',    'the message was received by mary',     'vi_l1_passive_missing_be');
    expectHit('the house painted red by him',    'the house was painted red by him',     'vi_l1_passive_missing_be');
  });
  it('negative cases (10)', () => {
    expectMiss('the cake was eaten',             'the cake was eaten');
    expectMiss('the cake is delicious',          'the cake is delicious');
    expectMissOrDifferentTag('she happy',        'she is happy',                         'vi_l1_passive_missing_be');
    expectMiss('she ate the cake',               'she ate the cake');
    expectMiss('he wrote the book',              'he wrote the book');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_passive_missing_be');
    expectMiss('i saw a movie',                  'i saw a movie');
    expectMiss('the cat is sleeping',            'the cat is sleeping');
    expectMiss('this book is good',              'this book is good');
    expectMiss('he finished the work',           'he finished the work');
  });
});

// 31. vi_l1_relative_pronoun
describe('rule 31: vi_l1_relative_pronoun', () => {
  it('positive cases (10)', () => {
    expectHit('the man which came is my uncle',  'the man who came is my uncle',         'vi_l1_relative_pronoun');
    expectHit('the woman which called was mom',  'the woman who called was mom',         'vi_l1_relative_pronoun');
    expectHit('the teacher which helped is kind','the teacher who helped is kind',       'vi_l1_relative_pronoun');
    expectHit('the student which won is here',   'the student who won is here',          'vi_l1_relative_pronoun');
    expectHit('the doctor which helped me was',  'the doctor who helped me was',         'vi_l1_relative_pronoun');
    expectHit('the boy which won is ten',        'the boy who won is ten',               'vi_l1_relative_pronoun');
    expectHit('the girl which sang is sarah',    'the girl who sang is sarah',           'vi_l1_relative_pronoun');
    expectHit('the friend which called hung up', 'the friend who called hung up',        'vi_l1_relative_pronoun');
    expectHit('the brother which came is mine',  'the brother who came is mine',         'vi_l1_relative_pronoun');
    expectHit('the boss which spoke was angry',  'the boss who spoke was angry',         'vi_l1_relative_pronoun');
  });
  it('negative cases (10)', () => {
    expectMiss('the man who came is my uncle',   'the man who came is my uncle');
    expectMiss('the book which i read',          'the book which i read');              // thing = which OK
    expectMiss('the car which broke down',       'the car which broke down');
    expectMissOrDifferentTag('she happy',        'she is happy',                         'vi_l1_relative_pronoun');
    expectMiss('the boy is tall',                'the boy is tall');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_relative_pronoun');
    expectMiss('who is that?',                   'who is that?');
    expectMiss('which one is yours',             'which one is yours');
    expectMiss('i know that woman',              'i know that woman');
    expectMiss('the man i met',                  'the man i met');
  });
});

// 32. vi_l1_used_to_vs_be_used_to
describe('rule 32: vi_l1_used_to_vs_be_used_to', () => {
  it('positive cases (10)', () => {
    // Pattern A: be used to + bare verb (wrong for past habit)
    expectHit('i am used to smoke',              'i used to smoke',                      'vi_l1_used_to_vs_be_used_to');
    expectHit('she is used to work here',        'she used to work here',                'vi_l1_used_to_vs_be_used_to');
    expectHit('they are used to play football',  'they used to play football',           'vi_l1_used_to_vs_be_used_to');
    expectHit('he is used to drink coffee',      'he used to drink coffee',              'vi_l1_used_to_vs_be_used_to');
    expectHit('we are used to live in hanoi',    'we used to live in hanoi',             'vi_l1_used_to_vs_be_used_to');
    // Pattern B: used to + -ing (wrong for accustomed)
    expectHit('i used to waking up early',       'i am used to waking up early',         'vi_l1_used_to_vs_be_used_to');
    expectHit('she used to eating pho',          'she is used to eating pho',            'vi_l1_used_to_vs_be_used_to');
    expectHit('we used to working late',         'we are used to working late',          'vi_l1_used_to_vs_be_used_to');
    expectHit('he used to driving fast',         'he is used to driving fast',           'vi_l1_used_to_vs_be_used_to');
    expectHit('they used to speaking english',   'they are used to speaking english',    'vi_l1_used_to_vs_be_used_to');
  });
  it('negative cases (10)', () => {
    expectMiss('i used to smoke',                'i used to smoke');                    // past habit OK
    expectMiss('i am used to waking up early',   'i am used to waking up early');       // accustomed OK
    expectMissOrDifferentTag('she happy',        'she is happy',                         'vi_l1_used_to_vs_be_used_to');
    expectMiss('i used this pen',                'i used this pen');                    // simple past "used"
    expectMiss('the pen is used',                'the pen is used');                    // passive
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_used_to_vs_be_used_to');
    expectMiss('i smoked before',                'i smoked before');
    expectMiss('she woke up early today',        'she woke up early today');
    expectMiss('they like it',                   'they like it');
    expectMiss('he has a bike',                  'he has a bike');
  });
});

// 33. vi_l1_another_vs_other
describe('rule 33: vi_l1_another_vs_other', () => {
  it('positive cases (10)', () => {
    expectHit('give me other one',               'give me another one',                  'vi_l1_another_vs_other');
    expectHit('i need other coffee',             'i need another coffee',                'vi_l1_another_vs_other');
    expectHit('please show me other book',       'please show me another book',          'vi_l1_another_vs_other');
    expectHit('can i have other slice',          'can i have another slice',             'vi_l1_another_vs_other');
    expectHit('try other approach',              'try another approach',                 'vi_l1_another_vs_other');
    expectHit('take other example',              'take another example',                 'vi_l1_another_vs_other');
    expectHit('bring other chair',               'bring another chair',                  'vi_l1_another_vs_other');
    expectHit('she bought other dress',          'she bought another dress',             'vi_l1_another_vs_other');
    expectHit('we need other room',              'we need another room',                 'vi_l1_another_vs_other');
    expectHit('he has other idea',               'he has another idea',                  'vi_l1_another_vs_other');
  });
  it('negative cases (10)', () => {
    expectMiss('give me another one',            'give me another one');
    expectMiss('the other day i saw him',        'the other day i saw him');           // "other" OK with "the"
    expectMissOrDifferentTag('she happy',        'she is happy',                         'vi_l1_another_vs_other');
    expectMiss('other people like it',           'other people like it');               // plural — "other" correct
    expectMiss('i have no other choice',         'i have no other choice');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_another_vs_other');
    expectMiss('others might disagree',          'others might disagree');
    expectMiss('we need more time',              'we need more time');
    expectMiss('some people prefer tea',         'some people prefer tea');
    expectMiss('i want the other option',        'i want the other option');
  });
});

// 34. vi_l1_look_vs_see_vs_watch
describe('rule 34: vi_l1_look_vs_see_vs_watch', () => {
  it('positive cases (10)', () => {
    expectHit('i see tv every night',            'i watch tv every night',               'vi_l1_look_vs_see_vs_watch');
    expectHit('she saw a movie yesterday',       'she watched a movie yesterday',        'vi_l1_look_vs_see_vs_watch');
    expectHit('we see the match now',            'we watch the match now',               'vi_l1_look_vs_see_vs_watch');
    expectHit('they see football every weekend', 'they watch football every weekend',    'vi_l1_look_vs_see_vs_watch');
    expectHit('he sees movies all the time',     'he watches movies all the time',       'vi_l1_look_vs_see_vs_watch');
    expectHit('please watch the picture',        'please look at the picture',           'vi_l1_look_vs_see_vs_watch');
    expectHit('i watched the photo carefully',   'i looked at the photo carefully',      'vi_l1_look_vs_see_vs_watch');
    expectHit('look a movie with me',            'watch a movie with me',                'vi_l1_look_vs_see_vs_watch');
    expectHit('she looks tv in the evening',     'she watches tv in the evening',        'vi_l1_look_vs_see_vs_watch');
    expectHit('i watched the doctor today',      'i saw the doctor today',               'vi_l1_look_vs_see_vs_watch');
  });
  it('negative cases (10)', () => {
    expectMiss('i watch tv every night',         'i watch tv every night');
    expectMiss('i see the sunset',               'i see the sunset');                   // perception OK
    expectMissOrDifferentTag('she happy',        'she is happy',                         'vi_l1_look_vs_see_vs_watch');
    expectMiss('look at the sky',                'look at the sky');
    expectMiss('they watch the children',        'they watch the children');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_look_vs_see_vs_watch');
    expectMiss('i saw a bird',                   'i saw a bird');
    expectMiss('he looks tired',                 'he looks tired');                    // "looks" as state verb
    expectMiss('watch out!',                     'watch out!');
    expectMiss('we watched a sunrise',           'we watched a sunrise');
  });
});

// 35. vi_l1_by_vs_with
describe('rule 35: vi_l1_by_vs_with', () => {
  it('positive cases (10)', () => {
    expectHit('i go to work with car',           'i go to work by car',                  'vi_l1_by_vs_with');
    expectHit('she travels with bus',            'she travels by bus',                   'vi_l1_by_vs_with');
    expectHit('we came with train',              'we came by train',                     'vi_l1_by_vs_with');
    expectHit('he flew with plane',              'he flew by plane',                     'vi_l1_by_vs_with');
    expectHit('they went with bike',             'they went by bike',                    'vi_l1_by_vs_with');
    expectHit('she walks by foot to school',     'she walks on foot to school',          'vi_l1_by_vs_with');
    expectHit('i travel by foot every day',      'i travel on foot every day',           'vi_l1_by_vs_with');
    expectHit('i wrote with foot',               'i wrote on foot',                      'vi_l1_by_vs_with');
    expectHit('he wrote the letter by pen',      'he wrote the letter with a pen',       'vi_l1_by_vs_with');
    expectHit('she drew by pencil',              'she drew with a pencil',               'vi_l1_by_vs_with');
  });
  it('negative cases (10)', () => {
    expectMiss('i go to work by car',            'i go to work by car');
    expectMiss('she travels by bus',             'she travels by bus');
    expectMiss('written with a pen',             'written with a pen');
    expectMissOrDifferentTag('she happy',        'she is happy',                         'vi_l1_by_vs_with');
    expectMiss('the book is here',               'the book is here');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_by_vs_with');
    expectMiss('i came with my sister',          'i came with my sister');              // companion, not instrument
    expectMiss('he paid by card',                'he paid by card');
    expectMiss('walk quickly',                   'walk quickly');
    expectMiss('we met by chance',               'we met by chance');
  });
});

// 36. vi_l1_time_expressions
describe('rule 36: vi_l1_time_expressions', () => {
  it('positive cases (10)', () => {
    expectHit('i was born on 2020',              'i was born in 2020',                   'vi_l1_time_expressions');
    expectHit('she started on 2023',             'she started in 2023',                  'vi_l1_time_expressions');
    expectHit('we met at morning',               'we met in the morning',                'vi_l1_time_expressions');
    expectHit('he studies at afternoon',         'he studies in the afternoon',          'vi_l1_time_expressions');
    expectHit('we eat dinner at evening',        'we eat dinner in the evening',         'vi_l1_time_expressions');
    expectHit('owls hunt on night',              'owls hunt at night',                   'vi_l1_time_expressions');
    expectHit('i sleep in night',                'i sleep at night',                     'vi_l1_time_expressions');
    expectHit('we relax at weekend',             'we relax on the weekend',              'vi_l1_time_expressions');
    expectHit('they play football in weekend',   'they play football on the weekend',    'vi_l1_time_expressions');
    expectHit('i have class in monday',          'i have class on monday',               'vi_l1_time_expressions');
  });
  it('negative cases (10)', () => {
    expectMiss('i was born in 2020',             'i was born in 2020');
    expectMiss('we met in the morning',          'we met in the morning');
    expectMiss('owls hunt at night',             'owls hunt at night');
    expectMissOrDifferentTag('she happy',        'she is happy',                         'vi_l1_time_expressions');
    expectMiss('it is cold today',               'it is cold today');
    expectMissOrDifferentTag('she study english', 'she studies english', 'vi_l1_time_expressions');
    expectMiss('see you tomorrow',               'see you tomorrow');
    expectMiss('on monday i am busy',            'on monday i am busy');
    expectMiss('at 7pm the show starts',         'at 7pm the show starts');
    expectMiss('we celebrated in july',          'we celebrated in july');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Perf budget — detector must stay well under 5 ms per call on average.
// ────────────────────────────────────────────────────────────────────────────
describe('performance', () => {
  it('mean call time < 5 ms across 500 iterations', () => {
    const cases: Array<[string, string]> = [
      // v1.0
      ['she study english',            'she studies english'],
      ['yesterday i walk to school',   'yesterday i walked to school'],
      ['two book',                     'two books'],
      ['she happy',                    'she is happy'],
      ['you like coffee?',             'do you like coffee?'],
      ['i eat apple',                  'i eat an apple'],
      ['his sister',                   'her sister'],
      ['i see her in monday',          'i see her on monday'],
      ['i need an advice',             'i need advice'],
      ['i am happy',                   'i am happy'],
      // v1.1
      ['i want go home',               'i want to go home'],
      ['she can speaks english',       'she can speak english'],
      ["i didn't went home",           "i didn't go home"],
      ['my mother house is big',       "my mother's house is big"],
      ['this is more better',          'this is better'],
      ['i have car red',               'i have red car'],
      ['i very much like it',          'i like it very much'],
      ['there are a book here',        'there is a book here'],
      ['everyone are happy',           'everyone is happy'],
      ['i do a mistake',               'i make a mistake'],
      ['you like coffee, no?',         "you like coffee, don't you?"],
      // v1.2
      ['when i arrived he left',       'when i arrived he had left'],
      ['he said he is tired',          'he said he was tired'],
      ['i live here since 5 years',    'i live here for 5 years'],
      ['i have much books',            'i have many books'],
      ['do you have some questions?',  'do you have any questions?'],
      ['i enjoyed at the party',       'i enjoyed myself at the party'],
      ['if i will have time i call you','if i have time i call you'],
      ['i want going home',            'i want to go home'],
      ['the cake eaten by the dog',    'the cake was eaten by the dog'],
      ['the man which came',           'the man who came'],
      ['i am used to smoke',           'i used to smoke'],
      ['give me other one',            'give me another one'],
      ['i see tv every night',         'i watch tv every night'],
      ['i go to work with car',        'i go to work by car'],
      ['i was born on 2020',           'i was born in 2020'],
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
