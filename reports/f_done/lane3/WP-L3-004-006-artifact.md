# F Done Artifact: WP-L3-004..WP-L3-006

Status: f_done, verified=false

Workpacks:
- WP-L3-004: generated salience weak target "the stuff"
- WP-L3-005: generated salience weak targets "the everyone/everything"
- WP-L3-006: generated salience place-like weak target "the home"

Changed files:
- `src/lib/tutor/speakFollowups.ts`
- `src/lib/tutor/__tests__/speakFollowups.test.ts`

Artifact summary:
- Added `home` to the place-like generated-target guard so "the home" does not become an awkward salience prompt.
- Added a narrow transcript-clarity guard for `the` + weak noun/abstract targets, preserving the existing "the way to ..." exception.
- Added focused regression cases for:
  - "I need the stuff"
  - "I saw the everyone"
  - "I need the home"
- Added non-regression coverage that "I need help with my stuff at home." remains clear.

Verification boundary:
- This is F completion evidence only.
- It is not Judge/Admin verification.
- No workpack is marked verified.
