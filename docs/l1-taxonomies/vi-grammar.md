# Vietnamese-speaker grammar L1 transfer map

> Curated, judgement-driven, **not encyclopedic**. Biased toward what a
> Vietnamese English teacher would flag as a real transfer pattern from
> their students rather than textbook completeness. If a pattern is true
> of every ESL learner everywhere ("their/there" confusion, run-on
> sentences, comma splices), it does not belong here.
>
> The bar is the same one `src/lib/pronunciation/vn-phoneme-map.ts` uses
> for phonemes: would a Vietnamese teacher say "that's a Vietnamese-
> learner mistake, not a generic English mistake"? If yes, it's in.
>
> This document is the grammar-side parallel to `vn-phoneme-map.ts`.
> Same audience, same product (the MercyBlade tutor / placement /
> Mercy diagnostic surfaces), same discipline — applied to morphosyntax
> instead of phonology. The format is intentionally close enough to the
> phoneme map's data shape that a future module (`vn-grammar-map.ts`,
> tracked as A4 follow-up) can be mechanically generated from it.

---

## Scope and what this is not

**In scope.** Grammar patterns where a Vietnamese learner's L1 leaks
into their English output — written or spoken — in a way that a
Vietnamese teacher recognises immediately. Article system, tense
marking, plurals, agreement, copula, question formation, prepositions,
pronoun gender, count vs non-count, noun-phrase order, inflectional
endings the learner knows in writing but loses in speech, and the
topic-comment habit.

**Out of scope.** Pronunciation (covered by `vn-phoneme-map.ts`).
Discourse, pragmatics, register, and writing-style transfer (covered
by `docs/placement-vn-l1-interference-taxonomy.md`, which is broader
than this doc but shallower per pattern). Generic ESL errors with no
Vietnamese-specific root — homophone confusions, comma rules, capital
letters, dangling modifiers, "would have went" — these are real errors
but they are not L1-Vietnamese transfer and do not belong here.

**Why a separate doc.** The existing taxonomy at
`docs/placement-vn-l1-interference-taxonomy.md` covers grammar as one
of six categories alongside phonology, lexicon, discourse, and
pragmatics, giving each pattern 3-5 example pairs. That is the right
shape for placement grading and for a research reference. It is the
wrong shape for a runtime tutor module: a tutor needs many examples
per pattern (so prompt-engineering and fine-tuning have something to
work from), tight per-family scope, and a severity tier that maps
cleanly to "intervene / hint / log only". This doc supplies that shape.

---

## Severity tiers (parallel to the phoneme map's credit scale)

The phoneme map uses partial-credit floats (0.60 / 0.70 / 0.75 / 0.85)
because pronunciation is intrinsically gradient — a learner can be 80%
of the way to the target sound. Grammar is more discrete: an article
is there or it isn't, a verb is conjugated or not. So this doc uses a
three-tier severity instead of a credit scale. The tiers map to tutor
behaviour, not to a "how wrong is it" judgement:

| Tier   | When to flag                                                | Tutor behaviour                                                                                  |
|--------|-------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| high   | The error blocks intelligibility, sounds visibly beginner, or breaks a CEFR A1-A2 contract the lesson is teaching. | Correct every time. Show the rewrite. Brief bilingual explanation. |
| medium | The error marks the learner as non-native and would be flagged in IELTS/TOEIC writing, but listeners parse around it. | Catch it. Offer the rewrite. Don't lecture if the learner just wants to keep talking. |
| low    | The form is non-native but meaning is preserved and a native speaker would not interrupt to correct. | Log silently. Surface in periodic review summaries, not mid-conversation. |

Rationale: the tutor's job at A1-B1 is to keep the learner producing
output without shame (`STRATEGY.md` §5 item 1; the corpus's repeated
"speak slowly, you do not need to be perfect" line). Aggressive
correction of every low-tier transfer pattern is a known retention
killer for adult learners — they stop talking. Reserving "correct
every time" for high-tier patterns concentrates corrections where they
materially improve outcomes (`STRATEGY.md` §5: outcomes, not
engagement). A `low` rating is not "we don't care" — it's "we care
later, not in the middle of the learner's third spoken sentence
today."

This tiering is the doc author's recommendation, not a final product
decision. A4 (the schema designer) and Chau can adjust the
high/medium/low cutoffs without restructuring the doc, because each
family declares its tier independently.

---

## Pattern families

Each family below has:

- a stable English short ID (kebab-case),
- bilingual one-line description (EN + VI),
- severity tier with one-line rationale,
- 8-15 paired examples in the format `learner produces` → `target form`,
- a one-line "why this happens in Vietnamese" gloss on examples where
  the L1 source is non-obvious.

Examples are written to look like real Vietnamese-learner output, not
invented textbook errors. Phrasing patterns are drawn from
`public/data/english_a1_*.json` and `public/data/english_b1_*.json` so
the examples sit inside the corpus the tutor actually sees.

---

### 1. Article omission and overuse (`article-omission-overuse`)

- **EN:** Missing, overused, or mis-selected `a/an/the`. Vietnamese has no
  article system; definiteness is carried by classifiers, demonstratives,
  numerals, or context.
- **VI:** Thiếu, thừa, hoặc dùng sai `a/an/the`. Tiếng Việt không có hệ
  thống mạo từ; sự xác định được thể hiện qua loại từ, từ chỉ định, số đếm,
  hoặc ngữ cảnh.
- **Severity:** medium. Listeners parse around missing articles, but
  consistent omission is the single most visible "Vietnamese English"
  marker in writing. Flag, don't lecture mid-conversation.

| learner produces                              | target form                                       | why (VI L1)                                                                 |
|-----------------------------------------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| I bought book yesterday.                      | I bought a book yesterday.                        | No article in `tôi mua sách hôm qua`.                                       |
| She is teacher.                               | She is a teacher.                                 | `cô ấy là giáo viên` — no `a` slot.                                         |
| I live in Hanoi for five year.                | I have lived in Hanoi for five years.             | (also tense + plural — but article slot is empty too)                       |
| The Vietnam is beautiful country.             | Vietnam is a beautiful country.                   | Proper nouns get spurious `the` from over-correction.                       |
| I love the music.                             | I love music.                                     | Abstract / mass nouns get spurious `the`.                                   |
| He is in hospital because he sick.            | He is in the hospital because he is sick.        | Definite location dropped; British zero-article hospital is also confusing. |
| My father is doctor and my mother is nurse.   | My father is a doctor and my mother is a nurse.   | Professions need `a/an` in EN, bare noun in VI.                             |
| I go to school by bike.                       | I go to school by bike.                           | Acceptable as-is — bare-noun `school` is correct. (Counter-example.)        |
| She has long hair and beautiful smile.        | She has long hair and a beautiful smile.          | First noun mass (correct), second noun count (needs `a`).                   |
| I want to be engineer.                        | I want to be an engineer.                         | Same as "she is teacher", plus the `a → an` rule.                           |
| I read the book about Vietnamese history.     | I read a book about Vietnamese history.           | First-mention indefinite, but learners default to `the` from translation drills. |
| Please open the door, then close door again.  | Please open the door, then close the door again.  | Definite reference dropped on repetition.                                   |
| I want one coffee.                            | I want a coffee.                                  | `một` translates to `one`, but the indefinite reading needs `a`.            |
| He is best student in our class.              | He is the best student in our class.              | Superlatives obligatorily take `the`; VI uses `nhất` with no article.       |

---

### 2. Tense flattening — past, perfect, future via adverbs (`tense-adverb-flattening`)

- **EN:** Verbs stay in base form; time is carried entirely by adverbs
  (`yesterday`, `tomorrow`, `already`, `next week`). Vietnamese marks time
  through `đã`, `đang`, `sẽ`, `rồi` or temporal adverbs — never through
  verb morphology — so learners treat tense as redundant when the time
  is already lexically marked.
- **VI:** Động từ giữ nguyên dạng; thời gian chỉ thể hiện qua trạng từ
  (`yesterday`, `tomorrow`, `already`). Tiếng Việt báo thì qua `đã/đang/sẽ`
  hoặc từ chỉ thời gian, không qua biến hình động từ — nên học viên thấy
  `-ed` thừa khi `yesterday` đã có sẵn.
- **Severity:** high. This is the single highest-impact transfer
  pattern: it touches every past, present perfect, and future utterance,
  and `I go to Da Nang last week` reads as visibly broken to any
  English ear. The existing L1 detector
  (`src/lib/feedback/l1-error-detector.ts`) handles bare past-tense
  omission via `vi_l1_past_ed`, present-perfect-vs-past confusion via
  `vi_l1_present_perfect_vs_past`, and past-perfect via
  `vi_l1_past_perfect_missing`. What this family adds is the *future
  via adverbs* corner (`Tomorrow I go`, `Next week I start`) — the
  existing rules cover the past axis but not the future-by-adverb
  pattern.

| learner produces                                  | target form                                              | why (VI L1)                                                                 |
|---------------------------------------------------|----------------------------------------------------------|-----------------------------------------------------------------------------|
| I go to Da Nang last week.                        | I went to Da Nang last week.                             | `tôi đi Đà Nẵng tuần trước` — past is in the adverb, not the verb.          |
| She cook dinner yesterday.                        | She cooked dinner yesterday.                             | Same — `nấu` doesn't change.                                                |
| We meet two years ago.                            | We met two years ago.                                    | `gặp` is invariant.                                                          |
| I watch a movie last night.                       | I watched a movie last night.                            |                                                                              |
| He call me three time today.                      | He called me three times today.                          | (also plural — `time → times`)                                              |
| Tomorrow I go to my parents house.                | Tomorrow I will go to my parents' house.                 | Future also adverb-only; `sẽ` is optional in casual VI.                     |
| Next week I start a new job.                      | Next week I will start a new job. / I'm starting…        | Either future form acceptable; bare present is the L1 default.              |
| I already eat breakfast.                          | I have already eaten breakfast. / I already ate…         | `đã ăn rồi` flattens to bare verb when learner reaches for perfect.         |
| I live in Canada for three years.                 | I have lived in Canada for three years.                  | Present-perfect-progressive is the clearest gap; VI has no perfect aspect.  |
| Yesterday I am very tired.                        | Yesterday I was very tired.                              | Even `be` flattens when the adverb does the time work.                      |
| She not come to class yesterday.                  | She didn't come to class yesterday.                      | (also negation — see family 14)                                              |
| When you arrive Hanoi?                            | When did you arrive in Hanoi?                            | Question + past + preposition all collapse.                                 |
| Last year I learn English at evening class.       | Last year I learned English in an evening class.         |                                                                              |
| He just finish his homework.                      | He has just finished his homework. / He just finished…   | `vừa làm xong` — both EN forms are acceptable, learner produces neither.    |

---

### 3. Plural marking (-s) (`plural-s-omission`)

- **EN:** Count nouns stay singular after numerals, quantifiers, and in
  general plural contexts. Vietnamese marks plurality lexically with
  `những`, `các`, `mấy`, or via numerals + classifiers — never via a
  suffix on the noun itself.
- **VI:** Danh từ đếm được không thêm `-s` sau số đếm hoặc lượng từ.
  Tiếng Việt báo số nhiều bằng `những/các/mấy` hoặc bằng số đếm + loại
  từ, không qua hậu tố trên danh từ.
- **Severity:** medium. Frequent and visible, but rarely blocks meaning
  (the numeral or quantifier already gave the count). Worth correcting
  in writing; correct gently in speech.

| learner produces                          | target form                                | why (VI L1)                                                              |
|-------------------------------------------|--------------------------------------------|--------------------------------------------------------------------------|
| I have two sister and one brother.        | I have two sisters and one brother.        | `hai chị em` — number in the numeral, not the noun.                      |
| Many student in my class come from Hue.   | Many students in my class come from Hue.   |                                                                          |
| I work for five year in this company.     | I have worked for five years in this company. | (also tense — see family 2)                                            |
| There are a lot of car on the road today. | There are a lot of cars on the road today. |                                                                          |
| I bought three book at the bookstore.     | I bought three books at the bookstore.     |                                                                          |
| All my friend like this restaurant.       | All my friends like this restaurant.       |                                                                          |
| She has many friend from work.            | She has many friends from work.            |                                                                          |
| Some people don't like coffee.            | Some people don't like coffee.             | Acceptable — `people` is irregular plural, learner sometimes gets right. |
| I take English class every Tuesday.       | I take an English class every Tuesday. / I take English classes every Tuesday. | Article + count both unsettled. |
| Last weekend we visit three city.         | Last weekend we visited three cities.      |                                                                          |
| My company has many office around Asia.   | My company has many offices around Asia.   |                                                                          |
| Both of my parent are teachers.           | Both of my parents are teachers.           |                                                                          |

---

### 4. Subject-verb agreement (3rd-person singular -s) (`third-person-s-omission`)

- **EN:** Third-person singular present `-s` is dropped: `she go`,
  `my brother have`, `it cost a lot`. Vietnamese verbs do not change for
  person or number — `tôi đi`, `anh đi`, `họ đi` all use one form — so
  the `-s` looks gratuitous and is the first thing to drop under speaking
  pressure.
- **VI:** Thiếu `-s` của động từ ở ngôi thứ ba số ít: `she go`, `he have`.
  Động từ tiếng Việt không đổi theo ngôi hay số — `tôi đi / anh ấy đi /
  họ đi` đều dùng `đi` — nên `-s` thành dấu hiệu thừa, dễ bị rơi khi nói.
- **Severity:** high. Persistent even in advanced learners. The existing
  L1 detector already ships a verb-agnostic `vi_l1_3rd_person_s` rule
  plus a `vi_l1_do_support_3ps` rule for `she don't / he don't`; this
  family supplies the bilingual-description shape and a wider example
  set for those existing detectors.

| learner produces                          | target form                                | why (VI L1)                                                                 |
|-------------------------------------------|--------------------------------------------|-----------------------------------------------------------------------------|
| She go to work by motorbike.              | She goes to work by motorbike.             | `cô ấy đi làm` — no person agreement.                                       |
| My brother have a new job in Saigon.      | My brother has a new job in Saigon.        |                                                                              |
| It depend on the weather.                 | It depends on the weather.                 |                                                                              |
| He live in Ha Noi with his family.        | He lives in Hanoi with his family.         |                                                                              |
| My mother cook very well.                 | My mother cooks very well.                 |                                                                              |
| This bus stop in front of my house.       | This bus stops in front of my house.       |                                                                              |
| She speak three language.                 | She speaks three languages.                | (also plural)                                                                |
| The teacher always give us homework.      | The teacher always gives us homework.      |                                                                              |
| My friend work at a hotel near the lake.  | My friend works at a hotel near the lake.  |                                                                              |
| He don't like spicy food.                 | He doesn't like spicy food.                | `does` carries the `-s`; `don't` is the L1-default negation.                |
| It cost about fifty thousand dong.        | It costs about fifty thousand dong.        |                                                                              |
| She want to learn Korean next year.       | She wants to learn Korean next year.       |                                                                              |
| He always tell me funny stories.          | He always tells me funny stories.          |                                                                              |

---

### 5. Copula deletion and overuse (`copula-be-deletion`)

- **EN:** `be` (`is/am/are/was/were`) is omitted before adjectives, nouns,
  or locations — `she beautiful`, `he doctor`, `my house near the
  market`. Vietnamese adjectival predicates don't need a copula at all;
  `là` exists but is narrower than English `be` and used mainly for
  identity ("X is a Y"), not for "X is adjective".
- **VI:** Bỏ động từ `to be` trước tính từ, danh từ, hoặc địa điểm
  (`she beautiful`, `he doctor`). Câu vị ngữ tính từ tiếng Việt không
  cần `to be`; `là` có nhưng chỉ dùng cho danh tính, không dùng trước
  tính từ.
- **Severity:** high. Sounds visibly broken even to a sympathetic
  listener and breaks the A1-A2 "I am from X / I am a Y" contract that
  every lesson in `english_a1_*` reinforces.

| learner produces                          | target form                                | why (VI L1)                                                                 |
|-------------------------------------------|--------------------------------------------|-----------------------------------------------------------------------------|
| She very kind.                            | She is very kind.                          | `cô ấy rất tốt` — adjective predicate, no copula.                           |
| He doctor.                                | He is a doctor. / He's a doctor.            | (also article)                                                              |
| My house near the market.                 | My house is near the market.               | `nhà tôi gần chợ` — locative predicate, no copula.                          |
| I very tired today.                       | I am very tired today.                     |                                                                              |
| The weather very hot in summer.           | The weather is very hot in summer.         |                                                                              |
| My brother an engineer at FPT.            | My brother is an engineer at FPT.          |                                                                              |
| She is very beautiful and kind.           | She is very beautiful and kind.            | Acceptable as-is — counter-example.                                          |
| Today Monday.                             | Today is Monday.                            | `hôm nay thứ Hai` — bare predicate.                                         |
| My favorite food pho.                     | My favourite food is pho.                  |                                                                              |
| The children very hungry now.             | The children are very hungry now.          | Plural agreement also drops with `be`.                                      |
| He is doctor and his wife is nurse.       | He is a doctor and his wife is a nurse.    | Copula present, article missing (the inverse failure).                      |
| My English not good yet.                  | My English is not good yet.                |                                                                              |
| She a student at Hanoi University.        | She is a student at Hanoi University.       |                                                                              |
| I am agree with you.                      | I agree with you.                          | Over-correction: `be` inserted before a verb that needs no copula.          |
| I am think this idea is good.             | I think this idea is good.                 | Same over-correction with stative `think`.                                  |

---

### 6. Question inversion (`question-inversion-omission`)

- **EN:** Yes/no and wh-questions keep declarative word order with a
  rising intonation or with `không` calqued into English: `You like
  coffee?`, `You where go?`, `She can speak English?`. Vietnamese forms
  yes/no questions with sentence-final particles (`...không?`, `...phải
  không?`) or initial `có ... không`, and wh-questions leave the wh-word
  in situ. English requires auxiliary inversion or do-support.
- **VI:** Câu hỏi giữ trật tự câu khẳng định (`You like coffee?`, `You
  where go?`). Tiếng Việt dùng tiểu từ `...không?` hoặc `có...không` và
  giữ từ để hỏi tại vị trí thông tin; tiếng Anh phải đảo trợ động từ
  hoặc dùng `do`.
- **Severity:** high at A1-B1 (breaks the most basic interactional
  pattern), medium at B2+ (most learners have repaired this by then but
  it reappears under pressure).

| learner produces                          | target form                                | why (VI L1)                                                                 |
|-------------------------------------------|--------------------------------------------|-----------------------------------------------------------------------------|
| You like coffee?                          | Do you like coffee?                         | `bạn thích cà phê không?` — particle at end, no aux.                        |
| You where go?                             | Where are you going?                        | Wh-in-situ; aux missing.                                                    |
| She can speak English?                    | Can she speak English?                      | Aux exists, just isn't fronted.                                             |
| Why you don't come yesterday?             | Why didn't you come yesterday?              | (also tense + neg placement)                                                 |
| What time you finish work?                | What time do you finish work?               |                                                                              |
| How much this cost?                       | How much does this cost?                    |                                                                              |
| Where you live now?                       | Where do you live now?                      |                                                                              |
| Your mother she works in Hanoi?           | Does your mother work in Hanoi?             | Subject doubling — `mẹ bạn chị ấy làm ở Hà Nội?` is acceptable VI topic-comment. |
| You have brother and sister?              | Do you have any brothers or sisters?        |                                                                              |
| When you start learn English?             | When did you start learning English?        | (also tense + infinitive)                                                    |
| He is a doctor, right?                    | He is a doctor, isn't he?                   | `phải không?` calques to `right?`, which is informal but acceptable EN.     |
| What you do for living?                   | What do you do for a living?                |                                                                              |
| Why she look sad today?                   | Why does she look sad today?                |                                                                              |

---

### 7. Preposition selection (`preposition-selection-transfer`)

- **EN:** Wrong preposition for time, place, and verb-frame: `in Monday`,
  `at the morning`, `depend in`, `discuss about`, `married with`,
  `listen music`. Vietnamese relational words (`vào`, `ở`, `tại`,
  `về`, `cho`, `với`) don't map one-to-one to English prepositions, and
  English verb frames (`depend on`, `interested in`, `married to`) are
  lexicalised in a way that has no Vietnamese parallel.
- **VI:** Chọn sai giới từ chỉ thời gian, nơi chốn, hoặc trong khung
  động từ (`in Monday`, `depend in`, `discuss about`). Các từ chỉ quan
  hệ tiếng Việt không tương ứng 1-1 với giới từ tiếng Anh.
- **Severity:** medium for `in/on/at` time/place; low for verb-frame
  choices (listener parses around them). At IELTS-prep level the bar
  rises — prepositions are heavily weighted in writing scores.

| learner produces                          | target form                                | why (VI L1)                                                                 |
|-------------------------------------------|--------------------------------------------|-----------------------------------------------------------------------------|
| I will see you in Monday.                 | I will see you on Monday.                  | `vào thứ Hai` — `vào` is the same word for at/in/on.                        |
| At the morning I drink coffee.            | In the morning I drink coffee.             |                                                                              |
| I was born on 1995.                       | I was born in 1995.                        |                                                                              |
| She lives in 12 Ly Thuong Kiet street.    | She lives at 12 Ly Thuong Kiet Street.     | Street addresses take `at`, not `in`.                                       |
| It depends in the weather.                | It depends on the weather.                 | `phụ thuộc vào` — `vào` calques to `in`.                                    |
| We discussed about the new project.       | We discussed the new project.              | `thảo luận về` — `về` calques to `about`; EN `discuss` is transitive.       |
| I listen music every night.               | I listen to music every night.             | `nghe nhạc` — bare verb in VI.                                              |
| She married with a Korean man.            | She married a Korean man. / married to…    | `kết hôn với` — `với` calques to `with`.                                    |
| I am interested on history.               | I am interested in history.                |                                                                              |
| He is good in mathematics.                | He is good at mathematics.                 |                                                                              |
| I waited the bus for thirty minutes.      | I waited for the bus for thirty minutes.   | `đợi xe buýt` — VI verb is transitive, EN needs `for`.                      |
| She is angry to me.                       | She is angry with me. / at me.              |                                                                              |
| I go to home after work.                  | I go home after work.                      | `về nhà` literally `return + home`; `home` is a bare adverb in EN.          |
| We arrived to Hanoi at midnight.          | We arrived in Hanoi at midnight.           | `arrive in` for cities; `arrive at` for points; `to` is the L1 default.     |
| The teacher explained me the lesson.      | The teacher explained the lesson to me.    | `giải thích cho tôi` — VI takes the indirect object directly.               |

---

### 8. Pronoun gender (he / she) (`pronoun-gender-confusion`)

- **EN:** `He` and `she` are swapped or used interchangeably when
  referring to the same person. Vietnamese third-person pronouns
  (`anh ấy`, `chị ấy`, `cô ấy`, `ông ấy`, `bà ấy`, `nó`, `họ`) encode
  age, kinship, social distance, and respect — but not gender as a
  separate axis. `Nó` is unmarked for gender; the kinship forms encode
  gender only as a side effect of the kinship term. So when a learner
  reaches for "third person singular" under pressure, the gender
  feature is the first thing to slip.
- **VI:** Lẫn `he/she` khi nói về cùng một người. Đại từ ngôi thứ ba
  tiếng Việt mã hóa tuổi, vai vế, mức tôn trọng — không tách giới tính
  thành trục riêng — nên dưới áp lực nói, giới tính là đặc trưng đầu
  tiên bị rơi.
- **Severity:** medium. Listeners catch the gender swap easily and
  re-map. The error sounds like a slip rather than a structural fault.
  Worth flagging because it persists into advanced levels and surprises
  EN listeners ("wait, is your mother a man?").

| learner produces                                         | target form                                              | why (VI L1)                                                                 |
|----------------------------------------------------------|----------------------------------------------------------|-----------------------------------------------------------------------------|
| My mother is a teacher. He works at a primary school.    | My mother is a teacher. She works at a primary school.   | `mẹ tôi` → reflexively `he` because `he` was the last 3sg learned.          |
| My boss called me yesterday. She wants me to work Saturday. | (Could be correct — if boss is female. Often wrong if male.) | Gender of the referent isn't recoverable from the VI kinship term alone.  |
| My older brother is married. She has two children.       | My older brother is married. He has two children.        |                                                                              |
| My grandfather lives in Hue. She is eighty years old.    | My grandfather lives in Hue. He is eighty years old.     |                                                                              |
| I have a younger sister. He is in high school.           | I have a younger sister. She is in high school.          |                                                                              |
| My friend Linh is a doctor. He works at Bach Mai hospital. | My friend Linh is a doctor. She works at Bach Mai hospital. | Linh is a female name; learner defaults to `he` for "friend".            |
| Mr Nguyen is my teacher. She teaches English.            | Mr Nguyen is my teacher. He teaches English.             |                                                                              |
| My wife is from Da Nang. He likes the beach.             | My wife is from Da Nang. She likes the beach.            |                                                                              |
| The baby is so cute. He is six month old.                | The baby is so cute. She is six months old.               | Acceptable if baby is female; many learners default `he` for "baby".       |
| Her brother told me that she will visit Hanoi.           | Her brother told me that he will visit Hanoi.            | Pronoun jumps gender mid-sentence — referent tracking is unstable.          |
| My boss is very kind. He always smiles. (boss is female) | My boss is very kind. She always smiles.                 |                                                                              |
| I called my dad. She said she will pick me up.           | I called my dad. He said he will pick me up.             | Compounding error — gender flips mid-clause.                                |

---

### 9. Count vs non-count nouns (`count-noncount-confusion`)

- **EN:** Mass nouns get treated as count nouns: `informations`,
  `advices`, `furnitures`, `equipments`, `homeworks`, `softwares`,
  `slangs`, `feedbacks`. Vietnamese doesn't grammatically distinguish
  count from non-count; classifiers handle individuation when needed.
  English's mass/count split is a learned, lexicalised distinction with
  no L1 anchor.
- **VI:** Coi danh từ không đếm được như đếm được — `informations`,
  `advices`, `furnitures`. Tiếng Việt không phân biệt đếm được / không
  đếm được về ngữ pháp; loại từ xử lý cá thể hóa khi cần.
- **Severity:** low for spoken (intelligible, common ESL pattern), medium
  for IELTS/TOEIC writing where each instance is a marked error.

| learner produces                              | target form                                       | why (VI L1)                                                                 |
|-----------------------------------------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| I need some informations about the visa.      | I need some information about the visa.           | `thông tin` is itself mass + count in VI; defaults to `-s` in EN.           |
| Thank you for your advices.                   | Thank you for your advice.                        |                                                                              |
| We bought new furnitures for the office.      | We bought new furniture for the office. / new pieces of furniture | `nội thất` patterns as countable in VI.                                  |
| He gave me a good advice.                     | He gave me a good piece of advice. / good advice | Indefinite `a` slot taken without realising the noun is mass.               |
| I have a lot of homeworks tonight.            | I have a lot of homework tonight.                 |                                                                              |
| The hotel has many equipments for guests.     | The hotel has a lot of equipment for guests.      |                                                                              |
| My boss gave me three feedbacks.              | My boss gave me three pieces of feedback.         |                                                                              |
| I learned many new vocabularies today.        | I learned a lot of new vocabulary today. / new words today | `từ vựng` counts items in VI but is mass in EN.                          |
| She has many beautiful jewelleries.           | She has a lot of beautiful jewellery.             |                                                                              |
| I want to give him an useful advice.          | I want to give him useful advice. / a useful piece of advice. | Article + mass noun double error.                                      |
| The traffic in Saigon are very bad.           | The traffic in Saigon is very bad.                | (also subject-verb agreement — `traffic` is mass + singular).               |
| I bought two breads at the bakery.            | I bought two loaves of bread at the bakery.       | `bánh mì` is countable in VI, mass in EN.                                   |

---

### 10. Noun phrase word order — adjectives and possession (`noun-phrase-word-order`)

- **EN:** Two patterns collapse into one family.
  (a) Adjectives placed after the noun (`a house big`, `the girl
  beautiful`) — Vietnamese is noun-first, modifier-after, the mirror of
  English.
  (b) Possession expressed with `of` instead of `'s` or pre-noun
  possessive (`the book of me`, `the phone of my mother`) — Vietnamese
  uses `của + possessor` after the head noun, which the learner calques
  to `of + possessor`.
- **VI:** Hai mẫu gộp trong một họ.
  (a) Đặt tính từ sau danh từ (`a house big`) — tiếng Việt là danh từ
  đứng trước, tính từ đứng sau, ngược với tiếng Anh.
  (b) Dùng `of` thay cho `'s` hoặc đại từ sở hữu (`the book of me`) —
  tiếng Việt dùng `của + người sở hữu` sau danh từ chính.
- **Severity:** high for (a) (sounds visibly broken at A1-A2), low for
  (b) (`the phone of my mother` is grammatical English, just unnatural).

| learner produces                          | target form                                | why (VI L1)                                                                 |
|-------------------------------------------|--------------------------------------------|-----------------------------------------------------------------------------|
| I live in a house big near the market.    | I live in a big house near the market.     | `nhà to` — adjective postnominal.                                           |
| She has hair long and beautiful.          | She has long, beautiful hair.              | `tóc dài` — same.                                                            |
| He gave me a gift very special.           | He gave me a very special gift.            |                                                                              |
| The book of me is on the table.           | My book is on the table. / The book is mine. | `sách của tôi` calqued literally.                                          |
| The car of my brother is new.             | My brother's car is new. / The car my brother bought is new. |                                                                  |
| The phone of her mother broke yesterday.  | Her mother's phone broke yesterday.        |                                                                              |
| The friend of mine works at the bank.     | A friend of mine works at the bank. / My friend works at the bank. | Acceptable mid-form; the `of mine` is real EN, just used wrong. |
| I want to buy a shirt blue and a hat red. | I want to buy a blue shirt and a red hat.  |                                                                              |
| This is the house of my grandparents.     | This is my grandparents' house. / This is the house of my grandparents. | The `of` form is grammatical, just less natural. |
| She is a girl smart and kind.             | She is a smart and kind girl.              |                                                                              |
| The name of this place is Tam Coc.        | This place is called Tam Coc. / The name of this place is Tam Coc. | `of`-form acceptable for named things.                          |
| He bought a motorbike Japanese second-hand. | He bought a second-hand Japanese motorbike. | Multiple postnominal adjectives stack in VI order.                          |
| The husband of my sister is a teacher.    | My sister's husband is a teacher.           |                                                                              |

---

### 11. Final-consonant cluster reduction reflected in written form (`final-cluster-spelling-loss`)

- **EN:** The learner writes the bare stem where English requires a
  past-tense, plural, or possessive suffix that they have stopped
  producing in speech — `walked → walk`, `asked → ask`, `tests → test`,
  `friend's → friend`. The proximate cause is phonological
  (`vn-phoneme-map.ts` covers it under `final-cluster-cluster-final`),
  but the consequence shows up in writing and is grammatical: the
  morpheme is gone from the learner's mental representation, not just
  their pronunciation.
- **VI:** Học viên viết theo cách họ phát âm — bỏ luôn `-ed`, `-s`,
  `-'s` khỏi chữ viết vì âm cuối không phát ra. Nguyên nhân gần là ngữ
  âm (xử lý trong `vn-phoneme-map.ts`), nhưng hậu quả là ngữ pháp.
- **Severity:** high in writing (the morpheme is the grammatical signal
  itself), medium in speech (overlaps with the phoneme map; flag once,
  not twice). Tutor should detect this in written submissions even when
  the speech analyzer has already flagged it for the same learner.

| learner produces                          | target form                                | why (VI L1)                                                                 |
|-------------------------------------------|--------------------------------------------|-----------------------------------------------------------------------------|
| I walk to school yesterday.               | I walked to school yesterday.              | `-ed` inaudible in own speech → omitted in writing.                         |
| She ask me about my family last night.    | She asked me about my family last night.   | `ask` ends in `-sk`, the `-ed` makes it `-skt`, a triple cluster.            |
| I work at this company since 2019.        | I have worked at this company since 2019.  | (also perfect — see family 2)                                               |
| He live in Hanoi five year ago.           | He lived in Hanoi five years ago.          | Multiple suffixes lost: `-d`, `-s`.                                         |
| We watch the football match last night.   | We watched the football match last night.  |                                                                              |
| I miss the bus this morning.              | I missed the bus this morning.             |                                                                              |
| She finish her work at 6 pm.              | She finishes her work at 6 pm. / She finished her work at 6 pm. | `-shes` is two clusters' worth of difficulty.                  |
| My friend car is parking outside.         | My friend's car is parked outside.         | Possessive `-'s` and passive `-ed` both lost.                               |
| The student name is Hoa.                  | The student's name is Hoa.                 |                                                                              |
| I ate three cake at the birthday party.   | I ate three cakes at the birthday party.   |                                                                              |
| He pass the IELTS test with 7.0.          | He passed the IELTS test with 7.0.         | `passed` → `/pæst/` — the `-ed` is silent in speech, dropped in writing.    |
| The room book by my company.              | The room is booked by my company. / The room was booked… | Copula + `-ed` both missing.                                       |

---

### 12. Topic-comment vs subject-prominent structure (`topic-comment-fronting`)

- **EN:** The learner fronts the topic with a comma and then restates it
  inside the sentence with a resumptive pronoun: `My family, they live
  in Hue`, `This job, I don't like it`, `Vietnamese food, it is very
  delicious`. Vietnamese is canonically topic-prominent — fronted topic
  + comment-clause is the unmarked information structure, not a marked
  emphasis device as in English.
- **VI:** Đặt chủ đề ở đầu câu kèm dấu phẩy rồi nhắc lại trong câu bằng
  đại từ (`My family, they live in Hue`). Tiếng Việt thuộc loại chủ đề-
  bình luận — đó là cấu trúc thông tin mặc định, không phải dạng nhấn
  mạnh như tiếng Anh.
- **Severity:** medium. The result is parseable but reads as
  consistently odd to EN listeners. At IELTS speaking it costs band
  score; at conversational level it survives.

| learner produces                              | target form                                       | why (VI L1)                                                                 |
|-----------------------------------------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| My family, they live in Hue.                  | My family lives in Hue.                            | `gia đình tôi, họ sống ở Huế` — natural VI.                                 |
| This job, I don't like it.                    | I don't like this job.                            |                                                                              |
| Vietnamese food, it is very delicious.        | Vietnamese food is very delicious.                |                                                                              |
| About English, I study every day.             | I study English every day. / As for English, I study every day. | The `as for…` form is real EN; learner reaches for raw `about`.       |
| My older brother, he works in Singapore now.  | My older brother works in Singapore now.          |                                                                              |
| Coffee, I drink three cups every morning.     | I drink three cups of coffee every morning.       |                                                                              |
| The weather in Hanoi, it changes very fast.   | The weather in Hanoi changes very fast.           |                                                                              |
| That movie, I watched it last week.           | I watched that movie last week.                    |                                                                              |
| My English teacher, she is very kind.         | My English teacher is very kind.                   |                                                                              |
| In Saigon, the traffic is very bad.           | In Saigon, the traffic is very bad.                | Acceptable EN — fronted PP, no resumptive pronoun. Counter-example.        |
| This restaurant, the food here is good.       | The food at this restaurant is good. / The food here is good. | Topic + locative resumptive `here` is the giveaway.                  |
| My parents, they don't know I am here.        | My parents don't know I am here.                   |                                                                              |

---

### 13. `Có` → `there is / have / be` over-mapping (`co-transfer-overgeneralisation`)

*Added family — not in the brief's required 12, but ranks among the
top three written-error patterns in the corpus phrasing.*

- **EN:** Vietnamese `có` covers existence, possession, availability,
  and occurrence. Learners default to one English equivalent — usually
  `have` — across all four senses: `In my house has three bedrooms`,
  `There has many people in the market`, `My city has very beautiful`.
- **VI:** Học viên dịch nguyên `có` thành `have`, vì `có` tiếng Việt
  bao trùm cả tồn tại, sở hữu, sẵn có, và xảy ra. Tiếng Anh tách bốn
  nghĩa này ra `have`, `there is/are`, `be`, `there are…`.
- **Severity:** medium. Causes characteristic "Vietnamese English"
  sentences that natives can decode but find awkward. Frequent enough
  to be worth a dedicated detector.

| learner produces                          | target form                                | why (VI L1)                                                                 |
|-------------------------------------------|--------------------------------------------|-----------------------------------------------------------------------------|
| In my house has three bedrooms.           | There are three bedrooms in my house. / My house has three bedrooms. | `trong nhà tôi có ba phòng ngủ` calqued.                          |
| There has many people in the market.      | There are many people in the market.       |                                                                              |
| My city has very beautiful.               | My city is very beautiful.                 | `thành phố tôi rất đẹp` — `có` slot doesn't exist; learner inserts `has`.   |
| In my class has thirty students.          | There are thirty students in my class.     |                                                                              |
| Yesterday has a big rain.                 | Yesterday there was heavy rain. / It rained heavily yesterday. | `hôm qua có cơn mưa lớn`.                                          |
| In Hanoi has many lakes.                  | There are many lakes in Hanoi.             |                                                                              |
| My company has free coffee every morning. | My company offers free coffee every morning. / There is free coffee at my company every morning. | `have` is acceptable but learners overproduce it. |
| In summer has a lot of fruit.             | There is a lot of fruit in summer.         |                                                                              |
| On the table have a book and two pen.     | There are a book and two pens on the table. / There is a book and there are two pens on the table. | (also plural) |
| Tonight has a party at my friend house.   | There is a party at my friend's house tonight. |                                                                          |
| In this hotel have a swimming pool.       | This hotel has a swimming pool. / There is a swimming pool in this hotel. |                                                       |
| In my country has four seasons.           | My country has four seasons. / There are four seasons in my country. |                                                                  |

---

### 14. Modal verb inflection and `to`-insertion (`modal-verb-inflection`)

*Added family — `must to`, `cans`, `shoulds` are persistent enough
in the corpus's audience to warrant a dedicated entry separate from
general subject-verb agreement.*

- **EN:** Learners apply `-s` to modal verbs (`he cans`, `she shoulds`)
  or insert `to` after them (`must to leave`, `can to swim`).
  Vietnamese modal-like words (`có thể`, `phải`, `nên`, `cần`) take a
  bare verb after them — but the learner has been taught "verb after
  preposition takes infinitive" (`I want to go`) and over-extends.
- **VI:** Học viên thêm `-s` vào modal (`he cans`) hoặc chèn `to` sau
  modal (`must to leave`). Từ tình thái tiếng Việt (`có thể`, `phải`,
  `nên`) đi với động từ nguyên thể không có dấu hiệu nào — nhưng quy
  tắc `to-infinitive` bị áp dụng quá rộng.
- **Severity:** high at A1-A2 (visible structural error in core
  modals), medium at B1+ (most learners self-correct `cans/shoulds`
  but `must to` persists).

| learner produces                          | target form                                | why (VI L1)                                                                 |
|-------------------------------------------|--------------------------------------------|-----------------------------------------------------------------------------|
| He cans speak three languages.            | He can speak three languages.              | `-s` over-applied; modal is invariant in EN.                                |
| She shoulds study harder.                 | She should study harder.                   |                                                                              |
| I must to leave at 6 pm.                  | I must leave at 6 pm.                      | `phải đi` — no marker; learner inserts `to`.                                |
| We can to go to the beach tomorrow.       | We can go to the beach tomorrow.           |                                                                              |
| You should to drink more water.           | You should drink more water.               |                                                                              |
| She doesn't can swim.                     | She can't swim.                            | Auxiliary doubling — `does` plus `can`.                                     |
| He don't can come tonight.                | He can't come tonight.                     |                                                                              |
| I will can speak English well next year.  | I will be able to speak English well next year. | Two modals stacked.                                                    |
| She musts work this weekend.              | She must work this weekend.                |                                                                              |
| Mays I borrow your pen?                   | May I borrow your pen?                      | `-s` inserted on first-person modal — pure overgeneralisation.              |
| I can to help you with that.              | I can help you with that.                  |                                                                              |
| He needs to studies more.                 | He needs to study more.                    | `to` + `-s` — infinitive form rule lost.                                    |

---

### 15. Negation with `no/not` instead of `do/does/did + not` (`negation-no-not-placement`)

*Added family — frequent enough at A1-A2 to need a dedicated detector
distinct from question inversion, with which it interacts but does
not overlap.*

- **EN:** Vietnamese `không` is placed directly before the verb or
  predicate and does not require any dummy auxiliary. Learners calque
  this: `I no want coffee`, `He not come yesterday`, `I don't can swim`.
- **VI:** Tiếng Việt dùng `không` đứng ngay trước động từ hoặc vị ngữ,
  không cần trợ động từ giả. Học viên dịch nguyên: `I no want coffee`,
  `He not come yesterday`.
- **Severity:** high at A1-A2. Breaks the core present/past negation
  contract.

| learner produces                          | target form                                | why (VI L1)                                                                 |
|-------------------------------------------|--------------------------------------------|-----------------------------------------------------------------------------|
| I no want coffee.                         | I don't want coffee.                       | `tôi không muốn cà phê` — `không` before verb.                              |
| He not come yesterday.                    | He didn't come yesterday.                  |                                                                              |
| I don't can swim.                         | I can't swim.                              | Auxiliary doubling — `don't` + modal.                                       |
| She no like spicy food.                   | She doesn't like spicy food.               |                                                                              |
| We not have time today.                   | We don't have time today.                  |                                                                              |
| He not went to school yesterday.          | He didn't go to school yesterday.          | Negation correct slot, but tense double-marked.                             |
| I no understand.                          | I don't understand.                        |                                                                              |
| She doesn't has a car.                    | She doesn't have a car.                    | `does` carries the `-s`; learner doubles it onto `has`.                     |
| They no want to come.                     | They don't want to come.                   |                                                                              |
| It not is true.                           | It is not true. / It isn't true.            | Negation slot before copula instead of after.                               |
| He didn't came home last night.           | He didn't come home last night.            | `did` carries tense; learner double-marks past on the verb.                 |

---

## Cross-family interaction notes

Several families compound predictably in real learner output. A single
A2 sentence often hits three families at once:

- **`She not come yesterday`** = negation placement (`not` instead of
  `didn't`) + tense flattening (`come` instead of `came`).
- **`My brother have new job`** = third-person `-s` omission + article
  omission.
- **`Yesterday I am very tired`** = tense flattening on copula +
  copula-be (correctly present this time, but wrong tense).
- **`In my house has three bedroom`** = `có`-transfer + plural-s
  omission.
- **`My mother, she is teacher and she very kind`** = topic-comment
  fronting + article omission + copula omission.

The runtime tutor needs to handle these multi-error sentences without
producing a wall of corrections. A reasonable policy (out of scope for
this doc but worth flagging): correct the highest-severity error
first; if the rewrite happens to clean up adjacent low-severity errors
as a side effect, accept that; if not, leave them.

---

## Future work — patterns considered and rejected

These were drafted as candidate families but cut because they didn't
meet the bar of "a Vietnamese teacher would call this a Vietnamese
mistake, not a general ESL mistake."

- **Their / there / they're confusion.** Universal English-spelling
  error; the Vietnamese root (homophony) isn't even there — VI doesn't
  have these homophones to confuse.
- **Comma splices and run-on sentences.** Real, but universal ESL.
  Vietnamese punctuation doesn't notably differ from English here.
- **Conditional sentence types (`if + would/will` mixing).** Real but
  driven by curriculum sequencing more than by L1 — Spanish and Chinese
  learners produce the same errors.
- **`Make / do` collocation errors.** Real but English-internal — `do
  homework` vs `make homework` is a memorisation problem with no clean
  Vietnamese root (`làm bài tập` works for both).
- **Gerund vs infinitive after specific verbs (`enjoy doing` vs `want
  to do`).** Lexical, not transfer-driven. The VI side has no aspectual
  marking that maps onto this.
- **Reported speech tense backshift.** Real grammar gap, but it shows
  up just as much in learners with morphologically rich L1s.
- **Articles with proper nouns (`the United States`, `the Netherlands`,
  no `the` for `France`).** Lexical memorisation, not L1 transfer; VI
  has no article at all so the learner can't transfer a wrong rule —
  they just don't have a rule.
- **Phrasal verbs (`look up`, `give in`, `take after`).** A real
  difficulty but already in scope of
  `docs/placement-vn-l1-interference-taxonomy.md` (Lexicon §
  `phrasal-verb-avoidance`); the doc you're reading is grammar-only.
- **Quantifier choice (`much / many / a lot of / a few`).** Worth a
  reference but most of the confusion is taught-and-forgotten, not L1
  transfer.

---

## Format note for A4 (schema designer)

This doc is structured to be mechanically transformable into a
TypeScript module parallel to `vn-phoneme-map.ts`. The minimum viable
schema each family fits into is:

```ts
type GrammarErrorFamily = {
  id: string;                            // 'article-omission-overuse'
  descriptionEn: string;                 // one-line EN summary
  descriptionVi: string;                 // one-line VI summary
  severity: 'high' | 'medium' | 'low';
  severityRationale: string;             // one sentence
  examples: Array<{
    learnerProduces: string;
    targetForm: string;
    whyViL1?: string;                    // optional gloss
  }>;
};
```

A natural extension is a `detect: (text: string) => boolean` field
per family for runtime use, but most of that work is already done.
The existing system in `src/lib/feedback/` ships 60 detectors as of
Round 5 — see the `RULE_REGISTRY`-equivalent in
`src/lib/feedback/rule-packs/vi/rules.ts` and the per-rule explanations
in `src/lib/feedback/rule-packs/vi/explanations.ts`. The pattern union
`L1WeaknessTag` in `src/lib/feedback/l1-error-detector.ts` is the
authoritative tag list; the data-side companion
`src/data/placement/vnL1Interference.ts` carries the same patterns in
a placement-grader shape with `lessonTags` for routing.

So the design call for A4 is mostly *reconciliation*, not greenfield:

1. **Tag namespace.** This doc uses kebab-case IDs (`article-omission-
   overuse`); the existing detector uses snake_case (`vi_l1_missing_
   article`); the placement file uses lowercase-with-dashes
   (`final-consonant-cluster-reduction`). All three name overlapping
   patterns with three different conventions. If A4 picks one, the
   placement grader, the L1 detector, and any new tutor module will
   stop drifting.
2. **What this doc adds that the detector doesn't have.** Five things:
   (a) bilingual one-line descriptions per family (existing
   `L1_VN_EXPLANATIONS` has VN-only `explanation_vi`, no parallel EN
   field of the same length); (b) a paired-example bank big enough to
   seed prompt-tuning (most existing rules carry one
   `example_wrong_vi_gloss`); (c) a few families with no detector yet
   — see report item 4; (d) a "why-this-happens-in-Vietnamese" gloss
   per example, not just per rule; (e) the cross-family interaction
   notes in the section above.
3. **Severity tier vs partial credit.** This doc's three-tier severity
   doesn't try to be a float like the phoneme map's credit scale; the
   placement data file's `severity: 'low'|'med'|'high'` already uses
   the same three-tier shape (mind the spelling: it's `'med'` there,
   `'medium'` here — reconcile in the schema). If A4 wants a numeric
   severity for ranking when multiple rules fire on one sentence,
   suggested floats are 1.0 / 0.6 / 0.2 — but the runtime detector
   already does "first match wins" via the ordered `VN_RULES` registry,
   so a float adds nothing until ranking-by-severity replaces ordered-
   priority.
