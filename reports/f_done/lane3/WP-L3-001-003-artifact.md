# F Done Artifact: WP-L3-001..WP-L3-003

Status: f_done, verified=false

Workpacks:
- WP-L3-001: learner says "your question is not clear"
- WP-L3-002: learner says "I don't get the question"
- WP-L3-003: learner reports "the follow-up question" is unclear

Changed files:
- `src/lib/tutor/speakFollowups.ts`
- `src/lib/tutor/__tests__/speakFollowups.test.ts`

Artifact summary:
- Extended `learnerReportsFollowUpIsUnclear` with a shared question-reference pattern covering possessive question phrasing, "get the question" confusion, and follow-up question wording.
- Added regression assertions for:
  - "Your question is not clear."
  - "I don't get the question."
  - "I didn't get that follow-up question."
  - "The follow up question does not make sense."
- Added non-regression coverage that "I get the bus at seven." remains clear.

Verification boundary:
- This is F completion evidence only.
- It is not Judge/Admin verification.
- No workpack is marked verified.
