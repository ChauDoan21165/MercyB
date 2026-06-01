# Confusable-stress FP candidates — Slice C (B4)

Per-slice fragment (kept separate from the shared rollback doc to avoid add/add conflicts; the consolidation pass folds all slice fragments later).

Slice C rules: `en-step6-look-at-pronoun`, `en-time-expression-placement`, `en-yesterday-irregular-beginner-past`.
Method: live engine (`correctWithTutorRules`), real input → output captured. FPs are **surfaced as candidates only** — rules NOT modified, FP cases NOT added as passing negatives.

## FP candidates

### `en-step6-look-at-pronoun` — fires on the "look <obj> in the eye" idiom

| input | engine output | issue |
| --- | --- | --- |
| `Look him in the eye.` | `Look at him in the eye.` | The idiom *look someone in the eye* takes a bare object (no `at`). The rule sees `look` + person pronoun (`him`) not followed by a separated particle and inserts `at`, producing the non-idiomatic `look at him in the eye`. |

- **Class:** idiom over-trigger. The `look <pronoun>` pattern doesn't exclude the fixed `look <obj> in the eye(s)` frame.
- **Lane A candidate fix (not applied):** add `in the eye(s)` (and similar fixed-object idioms) to the blocked-context set, or require the pronoun to be sentence/clause-final.

### `en-yesterday-irregular-beginner-past` — no question guard (over-triggers in questions)

| input | engine output | issue |
| --- | --- | --- |
| `Did you go yesterday?` | `Did you went yesterday?` | In a `do/did`-question the base verb is correct (`Did you go`). The rule sees a past marker + `you go` adjacency and rewrites `go`→`went`, producing the ungrammatical `Did you went`. |
| `Where did you go yesterday?` | `Where did you went yesterday?` | Same bug under a wh-question. |
| `Did you go to school yesterday?` | `Did you went to school yesterday?` | Same bug (surfaced while probing the time-expression slice — the mutation is from this rule, not the placement rule). |

- **Class:** missing `isQuestionLike` guard (the same gap `en-step5-subject-verb-agreement` already guards against, and that !304 fixed for the third-person routine rules). The beginner-past rewrite should not fire inside `do/does/did`-supported questions where the base form is correct.
- **Lane A candidate fix (not applied):** add an `isQuestionLike` / `do-support` guard to `en-yesterday-irregular-beginner-past`, mirroring `en-step5-subject-verb-agreement`.

## Clean-abstain negatives added this slice (for reference)

All verified `unchanged` on the live engine and added to the respective fixtures (one MR):
- **look-at-pronoun +3:** `Watch me.` (different verb), `Look it up.` (non-person pronoun `it` + separated particle), `They look down on us.` (`look down on` — pronoun not adjacent to `look`).
- **time-expression-placement +2:** `I recently went to school.` (non-whitelist time word), `Did you watch TV yesterday?` (question, non-pronoun-initial; no other rule fires).
- **has-past-time-marker (yesterday-irregular) +1:** `Yesterday I cook rice.` (different lemma — `cook` outside `{buy,do,eat,go,have}`).
