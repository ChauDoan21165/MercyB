# Vietnamese L1 Interference Taxonomy — Reference

## Purpose

This taxonomy catalogs recurring English patterns produced by Vietnamese L1 learners. It is designed to power three MercyBlade systems:

- Placement-test grading: identify whether an error is general CEFR weakness or a Vietnamese-specific transfer pattern.
- Lesson recommendation: map a learner's response to focused remediation tags rather than generic grammar practice.
- Mercy diagnostic feedback: explain the Vietnamese source of an error in a way that feels accurate, respectful, and useful.

The goal is not to label Vietnamese-accented English as deficient. The goal is to make MercyBlade unusually good at noticing the exact places where Vietnamese and English encode meaning differently.

## How to Use This Document

For grader prompts, use the stable pattern IDs in `src/data/placement/vnL1Interference.ts`. A grader should detect both direct errors and likely hidden causes. For example, a spoken response missing final `-s` may be tagged as `inflectional-s-ed-inaudible` before assuming the learner does not understand plural or third-person morphology.

For lesson recommendations, use `lessonTags`. These tags are intentionally free-form in v1 because future lessons may use different naming conventions. The useful invariant is semantic: `articles`, `final-consonants`, `question-inversion`, `prepositions`, `requests`, and similar tags should become routing hooks.

For Mercy feedback, quote the Vietnamese root carefully. The feedback should say "Vietnamese does X, English does Y" rather than "Vietnamese lacks..." unless the linguistic absence is the specific cause, such as articles or inflectional suffixes.

## Methodology

The encoded patterns come from four inputs:

1. Published Vietnamese-English learner research on final consonant clusters, English articles, grammatical writing errors, question formation, cohesion, ELSA Speak use, and pragmatic transfer.
2. Public descriptions of Vietnamese phonology and grammar used only where they support, not replace, learner-error research.
3. MercyBlade's existing pronunciation and Vietnamese-first product strategy.
4. CEFR judgment from the placement-test context: early patterns are those that block basic grammar or intelligibility; later patterns affect discourse, register, and idiomatic command.

Key source anchors:

- Nguyen (2019), "Optimality Theory in ESL Phonology: A Practice of Final Consonant Clusters from Vietnamese L1 Speakers" reports that Vietnamese lacks final consonant clusters and Vietnamese ESL learners use multiple repair strategies for English final clusters. Source: https://online-journal.unja.ac.id/IJoLTE/article/view/6178
- Do Anh Tuan (2021), "Intelligible Pronunciation: Teaching English to Vietnamese Learners" argues for using Vietnamese L1 phonological transfer explicitly in pronunciation teaching. Source: https://js.vnu.edu.vn/FS/article/view/4666
- Brunelle and Jannedy (2016), "Stress and phrasal prominence in tone languages: The case of Southern Vietnamese" finds little evidence for English-like word stress in Southern Vietnamese. Source: https://www.cambridge.org/core/journals/journal-of-the-international-phonetic-association/article/stress-and-phrasal-prominence-in-tone-languages-the-case-of-southern-vietnamese/13F3BF93FCA2C9BD365B2AC012C35B7D
- Nguyen Thi Quyen (2018), "English Article Choices by Vietnamese EFL Learners" describes Vietnamese nominal phrases without determiners/articles and classifier specificity effects. Source: https://js.vnu.edu.vn/FS/article/download/4248/3953
- Le Thi Kim Duc (2024), "Grammatical Challenges in Written English: A Study of Common Errors Among Vietnamese Learners" identifies article usage, sentence structure, pluralization, subject-verb agreement, verb tense, and preposition errors. Source: https://jst.tnu.edu.vn/jst/article/download/10966/pdf
- Bac Lieu University Journal article on English question errors among Vietnamese adult learners reports that subject-verb inversion and obligatory initial wh-placement are absent in Vietnamese and commonly transferred. Source: https://vjol.info.vn/index.php/tckhdhBacLieu/article/view/116957
- VNU Journal of Foreign Studies work on cohesive devices in Vietnamese EFL paragraph writing analyzes cohesion in 400 paragraphs from Vietnamese learners. Source: https://vjol.info.vn/index.php/NCNN/article/view/95531
- Hue University study on pragmatic transfer in English apologies by Vietnamese learners directly supports apology sequencing as a speech-act pattern. Source: https://vjol.info.vn/index.php/TCKH-DHH/article/view/63524
- PLOS One study on Vietnamese English majors' satisfaction with ELSA Speak confirms pronunciation practice categories including vowels, consonant clusters, linking, stress, and intonation. Source: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0317378

## Patterns by Category

### Phonology

#### Final cluster reduction (`final-consonant-cluster-reduction`)

Vietnamese speakers often delete or simplify English word-final consonant clusters. English places lexical and grammatical information at the end of words: `next`, `asked`, `tests`, `worlds`. Vietnamese-accented English often reduces these, so the listener may hear a different word or a missing tense/plural marker.

Vietnamese syllables do not permit English-style final consonant clusters. Research on Vietnamese L1 speakers' English final clusters reports deletion, simplification, and vowel insertion as repair strategies. This pattern interacts with morphology because `asked` and `tests` can be grammar-known but phonetically absent.

| incorrect | corrected | gloss | context |
|---|---|---|---|
| I saw three tes yesterday. | I saw three tests yesterday. | ba bài kiểm tra | Reporting school work |
| She ask me last night. | She asked me last night. | cô ấy hỏi tôi tối qua | Narrating a past event |
| The nex stop is mine. | The next stop is mine. | trạm kế tiếp | On a bus |

CEFR: A1-B2. Severity: high. Remediation: timed final-cluster release drills tied to grammar contrasts. Tags: `final-consonants`, `clusters`, `past-ed`, `plural-s`.

#### Voiced final stop loss (`voiced-final-stop-devoicing`)

Final /b d g/ are often devoiced, unreleased, or dropped. `Bad` can sound like `bat`; `bag` can sound like `back`. The learner may understand the word in writing but not yet produce English voicing cues.

Vietnamese has restricted final stops, and final stops are unreleased. English listeners rely on vowel length and voicing transitions around final voiced obstruents. Vietnamese learners may produce a short unreleased coda that is perceptually too weak.

Examples: `I need a back` -> `I need a bag`; `The road is bat` -> `The road is bad`; `She has a big dok` -> `She has a big dog`. CEFR: A1-B1. Severity: med. Tags: `final-stops`, `voicing`, `minimal-pairs`.

#### TH substitution (`th-stopping-and-fronting`)

English /theta/ and /eth/ are replaced by /t d/ or /s z/: `tink/sink` for `think`, `dis` for `this`. This is visible early because `this`, `that`, `they`, `three`, and `think` are frequent.

Vietnamese has no interdental fricatives. Vietnamese spelling `th` corresponds to an aspirated stop-like sound, so literate learners often map English `th` through Vietnamese orthography.

Examples: `I tink it is good` -> `I think it is good`; `Dis is my brother` -> `This is my brother`; `She has tree books` -> `She has three books`. CEFR: A1-B2. Severity: med. Tags: `th`, `interdental-fricatives`.

#### Inaudible -s and -ed (`inflectional-s-ed-inaudible`)

Third-person, plural, possessive, and past endings are not pronounced clearly. The learner may write the ending correctly but omit it in speech. This makes a pronunciation issue look like a grammar issue.

Vietnamese has no bound suffixes for tense, agreement, plural, or possession, and English suffixes occur in the difficult final-coda position. Mercy should diagnose both possibilities: morphosyntax knowledge and spoken realization.

Examples: `He work every day` -> `He works every day`; `I watch it yesterday` -> `I watched it yesterday`; `My friend car is red` -> `My friend's car is red`. CEFR: A1-B2. Severity: high. Tags: `final-s`, `past-ed`, `third-person-s`.

#### Even word stress (`word-stress-even-timing`)

Multisyllabic English words are pronounced with flat or misplaced stress. This harms intelligibility even when consonants and vowels are accurate. It becomes more visible with academic vocabulary.

Vietnamese is tonal and syllable-based; research on Southern Vietnamese finds little evidence for English-style word stress. Learners therefore need to acquire lexical stress and unstressed vowel reduction as new habits.

Examples: stress errors in `photographer`, `important`, and `information`. CEFR: A2-C1. Severity: med. Tags: `word-stress`, `schwa`, `academic-vocabulary`.

#### Diphthong reduction (`diphthong-monophthong-reduction`)

English diphthongs are shortened into single vowels, blurring `face`, `goat`, `boat`, `late`, and similar high-frequency words. The result may be intelligible in context but marked or confusing in minimal pairs.

Vietnamese vowel categories do not map neatly onto English glide trajectories such as /eI/ and /oU/. Under time pressure, learners may select a stable Vietnamese-like vowel instead of moving through the English diphthong.

Examples: `fess` -> `face`; `bot` -> `boat`; `late` with too little /eI/ glide. CEFR: A1-B1. Severity: med. Tags: `vowels`, `diphthongs`.

#### R/L/W position confusion (`r-l-w-position-confusion`)

R, L, and W are confused depending on region and word position. The same learner may handle initial /l/ but lose final /l/, or distinguish /v/ and /w/ in reading but not spontaneous speech.

Vietnamese regional phonologies differ in how spellings such as `r`, `d`, `gi`, `v`, `l`, and `n` are realized. English /r/, dark final /l/, and /w/ require position-specific diagnosis.

Examples: `rice` heard as `lice`; `very` with /w/ or spelling-influenced pronunciation; `feel` losing final /l/. CEFR: A1-B2. Severity: med. Tags: `r-l`, `v-w`, `regional-accent`.

#### Flat English intonation (`flat-english-intonation`)

English sentence melody is flattened or shaped by Vietnamese tone habits. Questions may sound like statements, enthusiasm may sound neutral, and requests may sound abrupt.

Vietnamese uses pitch lexically through tone. English uses phrase-level pitch for information structure, attitude, and discourse function. Advanced learners often need explicit work on English intonation after segmental pronunciation is acceptable.

Examples: `You want coffee` as an offer; `Really` without question rise; `I like it` sounding unenthusiastic. CEFR: B1-C2. Severity: low. Tags: `intonation`, `sentence-stress`, `pragmatics`.

### Morphology

#### Missing subject agreement (`missing-subject-verb-agreement`)

Third-person singular `-s` is omitted: `she go`, `my brother have`, `it depend`. It can persist because the ending is semantically small, phonetically final, and absent from Vietnamese.

Vietnamese verbs do not change for person or number. `Tôi đi`, `anh ấy đi`, and `họ đi` all use the same verb form. English marks a narrow present-tense condition, which makes the rule easy to explain but hard to automate.

Examples: `She go to work` -> `She goes to work`; `My brother have a job` -> `has`; `It depend` -> `depends`. CEFR: A1-B1. Severity: med. Tags: `third-person-s`, `present-simple`.

#### Unmarked past tense (`past-tense-unmarked`)

Learners rely on time adverbs and leave verbs in base form: `I go yesterday`, `we meet two years ago`. This is one of the clearest Vietnamese-English transfer patterns.

Vietnamese marks time through context, adverbs, and optional aspect particles rather than obligatory verb inflection. English requires tense on the verb even when `yesterday` already gives the time.

Examples: `I go to Da Nang last week` -> `I went`; `She cook dinner yesterday` -> `cooked`; `We meet two years ago` -> `met`. CEFR: A1-B1. Severity: high. Tags: `past-simple`, `irregular-verbs`.

#### Plural -s omission (`plural-s-omission`)

Count nouns remain singular after numbers and quantifiers: `two sister`, `many student`, `five year`. The intended number is clear, but English requires noun morphology too.

Vietnamese nouns are number-neutral unless context, numerals, classifiers, or plural markers add number. The noun itself does not change. English makes plural marking obligatory for count nouns in most plural contexts.

Examples: `two sister` -> `two sisters`; `many student` -> `many students`; `five year` -> `five years`. CEFR: A1-B1. Severity: med. Tags: `plural-s`, `count-nouns`.

#### Possessive -s avoidance (`possessive-s-avoidance`)

Learners omit apostrophe-s or overuse `of`: `my mother phone`, `the car of Nam`. Meaning is clear, but English noun phrases sound unnatural.

Vietnamese possession commonly uses `của` after the possessed noun or uses juxtaposition when the relationship is obvious. There is no English-like possessive clitic.

Examples: `My mother phone` -> `My mother's phone`; `the car of Nam` -> `Nam's car`; `teacher book` -> `the teacher's book`. CEFR: A1-B1. Severity: low. Tags: `possessive-s`, `noun-phrases`.

#### Comparative form mixing (`comparative-superlative-mixing`)

Learners mix `more`, `-er`, `most`, and `-est`: `more cheap`, `most tall`, `more good`. The comparison meaning is present, but English form selection is wrong.

Vietnamese uses separate comparison words such as `hơn` and `nhất` without changing the adjective. English divides forms by adjective length and irregularity.

Examples: `more cheap` -> `cheaper`; `most tall` -> `tallest`; `more good` -> `better`. CEFR: A2-B2. Severity: low. Tags: `comparatives`, `superlatives`.

#### Modal verb inflection (`modal-verb-inflection`)

Learners add endings to modals or use `to` after them: `he cans`, `she shoulds`, `must to leave`. This often appears after learners study third-person `-s`.

Vietnamese modal meanings use preverbal words such as `có thể`, `nên`, `phải`, and `cần`. English modals are defective auxiliaries with special syntax: modal + base verb, no `-s`, no `to`.

Examples: `He cans speak` -> `He can speak`; `She shoulds study` -> `She should study`; `I must to leave` -> `I must leave`. CEFR: A1-B1. Severity: med. Tags: `modals`, `auxiliaries`.

### Syntax

#### Article omission (`missing-articles`)

Vietnamese speakers omit, overuse, or misselect `a/an/the`. This affects every level because article choice depends on countability, specificity, definiteness, and shared knowledge.

Vietnamese has no grammatical article system. Definiteness is resolved through context, demonstratives, classifiers, numerals, or plural markers. Research on Vietnamese learners of English articles highlights classifier specificity and bare-noun ambiguity.

Examples: `I bought book` -> `I bought a book`; `The Vietnam` -> `Vietnam`; `I love the music` -> `I love music`. CEFR: A1-C1. Severity: med. Tags: `articles`, `definiteness`.

#### Copula be omission (`copula-be-omission`)

`Be` is omitted before adjectives, nouns, or locations: `she beautiful`, `he doctor`, `my house near the market`.

Vietnamese adjectival predicates do not need an equivalent of `be`; `là` is narrower than English `be` and used mainly for identity/classification. English uses `be` as a required structural carrier.

Examples: `She beautiful` -> `She is beautiful`; `He doctor` -> `He is a doctor`; `My house near the market` -> `My house is near the market`. CEFR: A1-A2. Severity: high. Tags: `be`, `copula`.

#### Question word order (`question-word-order-transfer`)

Questions keep Vietnamese declarative order: `You where go?`, `Why you don't come?`, `She can speak English?`

Vietnamese wh-questions can leave the wh-word in information position, and yes/no questions can use particles or intonation. English requires auxiliary movement or do-support in most direct questions.

Examples: `You where go?` -> `Where are you going?`; `Why you don't come?` -> `Why didn't you come?`; `She can...?` -> `Can she...?` CEFR: A1-B1. Severity: high. Tags: `questions`, `auxiliary-inversion`.

#### Relative clause transfer (`relative-clause-transfer`)

Learners omit relative markers or retain repeated pronouns: `the man I met him`, `the book that you gave it to me`.

Vietnamese relative-like modification can use `mà` or bare modifier structures, and pronoun retention can feel natural. English relative clauses usually require a gap rather than a resumptive pronoun.

Examples: `The man I met him` -> `The man I met`; `the book that you gave it` -> `the book that you gave`; `Students want study abroad` -> `Students who want to study abroad`. CEFR: B1-C1. Severity: med. Tags: `relative-clauses`.

#### Negation placement (`negation-no-not-placement`)

Learners map Vietnamese `không` onto English `no/not`: `I no want`, `he not come`, `I don't can`.

Vietnamese uses `không` before the verb or predicate and does not require dummy `do`. English finite negation attaches to auxiliaries; present and past simple require do-support.

Examples: `I no want coffee` -> `I don't want coffee`; `He not come yesterday` -> `He didn't come yesterday`; `I don't can swim` -> `I can't swim`. CEFR: A1-A2. Severity: high. Tags: `negation`, `do-support`.

#### There is / có transfer (`there-is-co-transfer`)

Vietnamese `có` is mapped too broadly onto `have`, `there is/are`, `be`, and existence: `There has many people`, `In my house has...`

Vietnamese `có` covers possession, existence, availability, and occurrence. English distributes those meanings across different constructions with different subjects and agreement.

Examples: `There has many people` -> `There are many people`; `My city has very beautiful` -> `My city is very beautiful`; `In my house has...` -> `There are... in my house`. CEFR: A1-B1. Severity: med. Tags: `there-is`, `have`.

#### Topic-comment fronting (`topic-comment-fronting`)

Vietnamese topic-first structures appear inside English sentences: `My family, they live in Hue`; `This job, I don't like`.

Vietnamese commonly organizes known information as a topic followed by a comment. English permits topicalization but uses it less often and marks it differently. Overuse creates unnatural or fragmented syntax.

Examples: `My family, they live in Hue` -> `My family lives in Hue`; `This job, I don't like` -> `I don't like this job`; `About English, I study every day` -> `I study English every day`. CEFR: A2-B2. Severity: med. Tags: `topic-comment`, `word-order`.

### Lexicon

#### Literal Vietnamese calques (`literal-vietnamese-calques`)

Learners translate Vietnamese collocations word for word: `open the light`, `eat medicine`, `very like`. The sentence may be understandable but unnatural.

Vietnamese everyday collocations package actions differently from English. Dictionary-level translation hides that English often requires a different verb-object chunk.

Examples: `open the light` -> `turn on the light`; `eat medicine` -> `take medicine`; `very like` -> `really like`. CEFR: A1-B2. Severity: low. Tags: `collocations`, `calques`.

#### One Vietnamese word, many English words (`polysemy-one-vietnamese-many-english`)

A broad Vietnamese word is mapped to one English equivalent across contexts: `learn/study`, `know/meet`, `say/tell`.

Vietnamese and English divide semantic fields differently. Words like `học`, `biết`, `nói`, `làm`, and `đi` cover ranges that English splits into multiple verbs.

Examples: `I learn English at university` -> `I study English`; `I know him yesterday` -> `I met him yesterday`; `say me the answer` -> `tell me the answer`. CEFR: A2-B2. Severity: med. Tags: `word-choice`, `semantic-maps`.

#### Preposition selection (`preposition-selection-transfer`)

English prepositions are chosen by Vietnamese spatial or verb patterns: `depend in`, `in Monday`, `discuss about`.

Vietnamese relational words and verb-preposition packaging do not map one-to-one to English. English prepositions are also partly lexicalized in frames such as `depend on`, `interested in`, `reason for`.

Examples: `depends in the weather` -> `depends on the weather`; `in Monday` -> `on Monday`; `discussed about the plan` -> `discussed the plan`. CEFR: A1-C1. Severity: med. Tags: `prepositions`, `verb-patterns`.

#### Phrasal verb avoidance (`phrasal-verb-avoidance`)

Learners avoid common phrasal verbs or interpret them literally: `wake` for `get up`, `wear your jacket` for `put on your jacket`, `care her brother` for `look after her brother`.

Vietnamese has verb-result and directional patterns, but English phrasal verbs are often idiomatic and particle meaning is unpredictable. Word-by-word study makes the particle look optional.

CEFR: A2-C1. Severity: low. Tags: `phrasal-verbs`, `spoken-english`.

#### Loanword false friends (`false-friend-loanword-overreach`)

Loanwords or familiar technical terms are mapped to wrong English words or register: `informatics`, `saloon`, odd uses around `photo/photocopy`.

Vietnamese loanwords may shift meaning, pronunciation, and register after borrowing. Surface similarity can make educated learners overconfident in a word that is not the natural English choice.

CEFR: B1-C1. Severity: low. Tags: `false-friends`, `register`.

#### Literal idiom interpretation (`idiom-literal-interpretation`)

Learners interpret English idioms literally or translate Vietnamese idioms directly. `Mưa như trút nước` may become `rains like pouring water`; `ếch ngồi đáy giếng` may become `frog under the well`.

Idioms are cultural chunks, not compositional vocabulary exercises. A learner can understand each word but miss the phrase meaning.

CEFR: B1-C2. Severity: low. Tags: `idioms`, `metaphor`.

### Discourse

#### Over-explicit pronouns (`over-explicit-pronoun-reference`)

Learners repeat names or nouns where English prefers pronouns: `Lan... Lan... Lan...`, `my mother said my mother...`

Vietnamese pronoun choice is socially loaded, and names or kinship terms often replace simple pronouns. English expects pronouns once the referent is established.

CEFR: A2-B2. Severity: low. Tags: `pronoun-reference`, `cohesion`.

#### Topic-comment paragraphing (`topic-comment-paragraph-shape`)

Paragraphs present associated observations rather than a clear English claim-support sequence. The topic may be broad and the controlling idea implicit.

Vietnamese discourse can tolerate more context-building and indirect topic development. English academic and test writing expects topic sentence, controlled development, and visible conclusion.

CEFR: B1-C1. Severity: med. Tags: `paragraphs`, `coherence`, `ielts-writing`.

#### Connector stacking (`connector-overuse-and-stacking`)

Learners overuse or mechanically stack connectors: `so... so...`, `moreover` without additive logic, sentence fragments after `because`.

Vietnamese clause chaining and discourse particles do not map cleanly to English punctuation and connector logic. Exam-prep overteaching can worsen the issue.

CEFR: A2-C1. Severity: med. Tags: `connectors`, `cohesion`.

#### Time reference overmarking (`time-reference-overmarking`)

Learners repeat time adverbs because Vietnamese relies more on lexical time marking: `Yesterday... Yesterday... Yesterday...`

Vietnamese does not require tense inflection, so time words organize narratives. English can mark time once and let tense/sequencing carry the rest.

CEFR: A1-B1. Severity: low. Tags: `time-reference`, `narrative`.

#### Delayed main point (`indirect-main-point-delay`)

Writers delay requests or opinions with background before stating the point. In English workplace contexts, this can feel inefficient or unclear.

Vietnamese politeness and high-context communication often value relational setup. North American professional English often treats early explicit purpose as reader-friendly.

CEFR: B1-C2. Severity: med. Tags: `email-writing`, `main-idea`, `professional-english`.

### Pragmatics

#### Direct request transfer (`direct-request-transfer`)

Requests translated literally can sound too blunt or too soft: `You send me the file`, `Give me one coffee`.

Vietnamese politeness uses pronouns, kinship terms, particles, and context. English relies on modal request formulas, `please`, hedging, and intonation.

CEFR: A2-C1. Severity: med. Tags: `requests`, `politeness`, `workplace`.

#### Formality calibration (`formality-calibration`)

Learners choose English that is too formal, too intimate, or mismatched: `Respected sir`, `Dear teacher`, `Hey bro` in official contexts.

Vietnamese address terms encode hierarchy and relationship. English uses fewer pronoun distinctions and more genre-specific conventions.

CEFR: B1-C2. Severity: med. Tags: `register`, `email`, `address-terms`.

#### Apology explanation order (`apology-explanation-before-responsibility`)

Learners give explanations before apology or repair: `The traffic was terrible, so I am late.` English listeners often expect explicit apology first.

Vietnamese apology routines can rely on explanation, relationship, and particles to show sincerity. English workplace norms often prefer apology, responsibility, repair, then brief reason.

CEFR: A2-C1. Severity: med. Tags: `apologies`, `speech-acts`.

#### Refusal softening gap (`refusal-softening-gap`)

Refusals are either too direct or too vague: `No, I don't go`, `Maybe later`. English often needs appreciation, soft no, brief reason, and alternative.

Vietnamese refusals are managed through relationship, indirectness, and context. English professional situations require clear but softened refusal formulas.

CEFR: B1-C1. Severity: med. Tags: `refusals`, `politeness`.

#### Greeting convention transfer (`greeting-small-talk-transfer`)

Vietnamese greeting topics such as age, eating, destination, or family are transferred into English settings where they may feel too personal.

Vietnamese care-based greetings include `ăn cơm chưa` and `đi đâu đấy`. English small talk uses safer low-disclosure topics and often does not seek literal information.

CEFR: A1-B2. Severity: low. Tags: `greetings`, `small-talk`, `culture`.

## Severity Distribution

| Category | Low | Med | High | Total |
|---|---:|---:|---:|---:|
| Phonology | 1 | 5 | 2 | 8 |
| Morphology | 2 | 3 | 1 | 6 |
| Syntax | 0 | 4 | 3 | 7 |
| Lexicon | 4 | 2 | 0 | 6 |
| Discourse | 2 | 3 | 0 | 5 |
| Pragmatics | 1 | 4 | 0 | 5 |
| **Total** | **10** | **21** | **6** | **37** |

## CEFR-Level Distribution

| CEFR | Pattern count | Typical meaning |
|---|---:|---|
| A1 | 22 | Core pronunciation, copula, articles, past/plural/agreement, basic requests |
| A2 | 31 | Most Vietnamese-transfer patterns are visible by this level |
| B1 | 35 | Patterns shift from survival grammar to control, fluency, and discourse |
| B2 | 25 | Pronunciation, articles, prepositions, discourse, and pragmatics persist |
| C1 | 16 | Advanced issues cluster around stress, articles, prepositions, discourse, register, idiom |
| C2 | 4 | Mostly discourse/pragmatics/idiom refinement |

## Open Patterns / Future Work

- Spelling interference from Vietnamese romanization and regional sound mergers (`d/gi/r`, `tr/ch`, `s/x`) when writing English names or transcribing listening.
- Vowel length distinctions beyond diphthongs, especially `ship/sheep`, `full/fool`, and `bed/bad`.
- Linking and resyllabification: final consonants may be easier before vowels but still missing before consonants.
- Register differences between Vietnamese diaspora English, Vietnam classroom English, IELTS English, and workplace English in Canada/Australia.
- Genre-specific writing: IELTS Task 1 graph description, job-cover letters, immigration forms, customer-service chat.
- Advanced stance markers: `actually`, `I think`, `maybe`, `quite`, `rather`, and hedging in academic argument.

## Sources Cited

- Nguyen, Thong Vi. "Optimality Theory in ESL Phonology: A Practice of Final Consonant Clusters from Vietnamese L1 Speakers." International Journal of Language Teaching and Education, 2019. https://online-journal.unja.ac.id/IJoLTE/article/view/6178
- Do Anh Tuan. "Intelligible Pronunciation: Teaching English to Vietnamese Learners." VNU Journal of Foreign Studies, 2021. https://js.vnu.edu.vn/FS/article/view/4666
- Brunelle, Marc and Stefanie Jannedy. "Stress and phrasal prominence in tone languages: The case of Southern Vietnamese." Journal of the International Phonetic Association, 2016. https://www.cambridge.org/core/journals/journal-of-the-international-phonetic-association/article/stress-and-phrasal-prominence-in-tone-languages-the-case-of-southern-vietnamese/13F3BF93FCA2C9BD365B2AC012C35B7D
- Nguyen Thi Quyen. "English Article Choices by Vietnamese EFL Learners." VNU Journal of Foreign Studies, 2018. https://js.vnu.edu.vn/FS/article/download/4248/3953
- Le Thi Kim Duc. "Grammatical Challenges in Written English: A Study of Common Errors Among Vietnamese Learners." TNU Journal of Science and Technology, 2024. https://jst.tnu.edu.vn/jst/article/download/10966/pdf
- "Errors in Making English Questions Among Vietnamese Adult Learners." BLU Journal of Science. https://vjol.info.vn/index.php/tckhdhBacLieu/article/view/116957
- "Use of Cohesive Devices in Paragraph Writing by EFL Students at English Language Centers in Vietnam." VNU Journal of Foreign Studies. https://vjol.info.vn/index.php/NCNN/article/view/95531
- "Pragmatic Transfer in Making Apology in English by Vietnamese Learners at Hue University." Hue University Journal of Science. https://vjol.info.vn/index.php/TCKH-DHH/article/view/63524
- "English major students' satisfaction with ELSA Speak in English pronunciation courses." PLOS One. https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0317378
