# Bar #2 Option B Redesign Recommendation

## Context

The local F0 spike in `docs/axis-2/spike-results.md` tested the 18 fixture
MP3s in `public/audio/tones/` using a Web Audio-compatible autocorrelation
pitch contour method.

The spike result is clear: Option B should not ship as production tone
grading in its current form.

## What Failed

- Four-tone separation was weak: the minimum pairwise distance among
  `ngang`, `huyen`, `sac`, and `nang` was only `0.82` semitone RMS.
- `ngã` / `nặng` were technically reachable in the fixture set with a
  `0.99` semitone RMS distance, but that margin is still narrow.
- `hỏi` and `ngã` each had only one fixture, so those results are too thin
  for scoring confidence.
- The fixtures are clean MP3 assets, not noisy learner microphone captures.
  If clean fixtures are only marginally separable, learner audio will be
  less reliable.

## Why Production Tone Grading Should Not Ship

Production tone grading would imply Mercy can judge whether a learner
produced a Vietnamese tone correctly. The current design cannot support that
claim safely.

The main risks:

- False negatives: a learner may produce an acceptable tone but receive a
  failure because the contour scorer is too brittle.
- False positives: a learner may pass with an unnatural tone because the
  score only matches a rough F0 shape.
- Device variance: phone microphones, browser audio pipelines, noise
  suppression, and room noise can distort F0 contours.
- Voice variance: adult, child, male, female, creaky, breathy, and regional
  voices will not match one clean reference contour reliably.
- Pedagogy risk: bad scoring feedback can teach learners to chase the tool
  instead of learning Vietnamese tones.

Therefore, Bar #2 Option B should not ship as authoritative pass/fail tone
production grading from this design.

## What Can Safely Ship Tomorrow

Useful learner value can still ship without pretending to grade production.

Safe scope:

- Listen-compare tone practice.
- Visual contour explorer showing reference tone shape.
- Non-scored tone repetition practice.
- Learner-facing copy that says the tool is for listening and comparison,
  not grading.
- A simple "try again" flow that does not label the learner as correct or
  wrong.
- Optional local-only display of a learner contour if microphone work is
  already approved separately, with no raw audio storage and no score.

Unsafe scope for tomorrow:

- Pass/fail tone scoring.
- CEFR-like pronunciation labels.
- Claims that Mercy can verify tone production.
- Storage of raw audio or transcripts.
- Syncing tone attempts to Supabase or external analytics.

## Proposed Fallback Design

### Listen-Compare

The learner hears two or more tone examples and chooses what they heard.
This tests perception, which is safer and already aligned with fixture-based
assets.

### Visual Contour Explorer

Show a simple reference contour for each tone:

- `ngang`: relatively level
- `huyen`: falling
- `sac`: rising
- `hoi`: dipping/rising
- `nga`: broken/rising
- `nang`: low/short/heavy

The UI should explain contours as hints, not as exact acoustic truth.

### Non-Scored Tone Practice

Let learners repeat after Mercy, then offer neutral guidance:

- "Listen again."
- "Try making the ending rise."
- "Try making it shorter and lower."

Do not show a numeric score, grade, badge, pass/fail state, or mastery claim.

## Additional Data Needed Before Scoring

Before any production scoring design, collect and test:

- Multiple human-recorded references per tone, not only TTS-like fixtures.
- Multiple speakers across pitch ranges, gender, age, and voice qualities.
- Northern and Southern Vietnamese tone variants where relevant.
- Minimal pairs across several syllable shapes, not only one or two base
  syllables.
- Real mobile microphone captures from iOS Safari, Android Chrome, and
  desktop Chrome.
- Noisy-room samples and low-volume samples.
- A human-labeled validation set with acceptable vs unacceptable tone
  attempts.
- A threshold study measuring false positives and false negatives.

Scoring should remain blocked until those data show stable separation under
real learner conditions.

## Bar #2 Tick Opinion

Bar #2 can tick only if its Definition of Done is explicitly non-scoring.

Acceptable non-scoring DoD:

- Tone production coaching exists as listen-compare plus visual contour
  guidance.
- The feature avoids pass/fail scoring.
- The feature avoids grading claims.
- The feature stores no raw audio, transcript, or learner identity.
- The feature is local-only unless a separate safety review approves more.
- Tests verify the UI does not call the experience a score, grade, or
  production verifier.

Not acceptable for Bar #2 tick:

- Claiming tone production scoring is solved.
- Shipping a production pass/fail grader from the current F0 design.
- Treating clean-fixture contour separation as proof of learner microphone
  reliability.

Recommendation: tick Bar #2 under a revised non-scoring DoD, or keep it open
if the bar requires actual production tone scoring.
