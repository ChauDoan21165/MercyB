# Bar #2 Owner Decision Brief

## Decision Needed

The Option B F0 spike and redesign memo show that the current design is not
ready for production tone grading.

Owner needs to choose whether Bar #2 still requires actual pass/fail tone
production scoring, or whether Bar #2 can be revised to non-scored tone
production coaching.

## Choice 1: Keep Original Scoring DoD

Bar #2 remains open.

This means the bar still requires Mercy to judge whether a learner produced a
Vietnamese tone correctly.

### What Ships Next

- No production tone grader.
- No pass/fail scoring.
- No claim that Mercy can verify tone production.
- Data collection and redesign work before implementation:
  - more human-recorded tone fixtures
  - multiple speakers and pitch ranges
  - Northern/Southern tone variants where relevant
  - real mobile microphone samples
  - noisy-room samples
  - human-labeled acceptable/unacceptable attempts
  - threshold study for false positives and false negatives

### Cost

This is slower, but safer. It preserves the original meaning of "tone
production scoring" and avoids shipping a weak acoustic classifier.

## Choice 2: Revise DoD to Non-Scored Tone Coaching

Bar #2 may become eligible after a non-scoring prototype ships.

This changes the bar from "Mercy grades tone production" to "Mercy coaches
tone production without pretending to score it."

### What Ships Next

- Listen-compare tone practice.
- Visual contour explorer.
- Non-scored repeat-after-Mercy practice.
- Neutral guidance such as:
  - "Listen again."
  - "Try making the ending rise."
  - "Try making it shorter and lower."
- Clear UI copy that avoids score, grade, pass/fail, verified, or mastery
  language.
- Tests proving the prototype does not claim production grading.

### Cost

This is shippable sooner and still gives learner value, but it lowers the
original ambition. The tick must explicitly say Bar #2 is non-scored coaching,
not production grading.

## False-Scoring Risk

Vietnamese tones are high-stakes for meaning. A weak scorer can harm learning:

- False negatives can discourage acceptable pronunciation.
- False positives can reinforce incorrect tones.
- Device microphones and browser audio pipelines can distort F0.
- Speaker pitch range, voice quality, region, and syllable shape all affect
  contours.
- Learners may optimize for the tool instead of natural Vietnamese speech.

Because the fixture spike already showed weak four-tone separation, production
pass/fail scoring is not safe from the current design.

## Recommendation

Choose **Choice 2: revise Bar #2 to non-scored tone coaching**.

Ship listen-compare, visual contour exploration, and non-scored tone practice
as learner value now. Keep production tone grading as a future bar that
requires a human-labeled microphone dataset and measured false-positive /
false-negative thresholds.
