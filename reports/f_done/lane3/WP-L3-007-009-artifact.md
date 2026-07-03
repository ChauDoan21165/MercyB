# F Done Artifact: WP-L3-007..WP-L3-009

Status: f_done, verified=false

Workpacks:
- WP-L3-007: generated salience weak abstract target "the problem"
- WP-L3-008: article-noise transcript "I buy the some"
- WP-L3-009: generated-target noise "the any"

Changed files:
- `src/lib/tutor/speakFollowups.ts`
- `src/lib/tutor/__tests__/speakFollowups.test.ts`

Artifact summary:
- Added `problem` and `problems` to the weak abstract target catalog.
- Added focused unsafe follow-up cases for:
  - "I have the problem"
  - "I buy the some"
  - "I buy the any"
- Added non-regression coverage for clear learner sentences:
  - "I have a problem with my sink."
  - "I buy some noodles."
  - "Do you have any questions?"

Verification boundary:
- This is F completion evidence only.
- It is not Judge/Admin verification.
- No workpack is marked verified.
