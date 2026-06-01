# Confusable-negative stress — FALSE-POSITIVE rollback candidates (CEO audit)

Consolidated from all per-slice fragments (slices 1, 2, 3, A, B, C). Every entry
is a **real captured** `input → wrong-output` from the live engine
(`correctWithTutorRules(input, "en")`). Each rule **over-corrects** a confusable
surface. **No rule was edited; no FP was added as a passing negative.** The
matching lock fixtures are pre-staged in
`tests/regression/golden-set/_pending-guards/staged-lock-fixtures.md`, ready to
verify-and-commit the instant Lane A ships each guard.

**Verdict summary: every candidate is a GUARD or TRIM — none needs a full rule
rollback.** The rules' positive behavior is correct; each just needs a narrower
trigger.

| # | Rule | FP class | Verdict |
|---|------|----------|---------|
| 1 | en-step6-possessive-s | object-noun-as-verb | GUARD (shared) |
| 2 | en-l4-missing-singular-article | noun-as-verb | GUARD (shared) |
| 3 | en-yesterday-irregular-beginner-past | no question guard | GUARD (reuse !304) |
| 4 | en-step6-profession-article | title + proper name | GUARD |
| 5 | en-step6-wait-for-person-object | phrasal idiom | GUARD |
| 6 | en-step5-subject-verb-agreement | coordinated subject | GUARD |
| 7 | en-calque-take-medicine | whitelist ambiguity | TRIM |
| 8 | en-step6-look-at-pronoun | fixed idiom | GUARD |
| 9 | en-step6-at-clock-time | over-broad anchor (edge) | TRIM — optional, **LOWEST** severity |

---

## A. Verb-sense family — ONE shared Lane A guard fixes both

Both rules carry an object/noun whitelist containing words that are **also
verbs** (`phone`, `book`, `bike`). When the learner uses the word as a verb, the
rule mistakes it for a noun and rewrites. A single shared "object-noun-not-used-
as-a-following-verb" guard closes both.

### 1. en-step6-possessive-s — object-noun-used-as-verb

| Input | Wrong output | Note |
|-------|--------------|------|
| `My sister phone me yesterday.` | `My sister's phone me yesterday.` | `phone` = verb (phoned) |
| `My friend book a room.` | `My friend's book a room.` | `book` = verb (books) |
| `His brother bike to work.` | `His brother's bike to work.` | `bike` = verb (bikes) |

- **Trigger:** `\b(my|your|his|her|our|their)\s+<owner>\s+<object-noun>\b` with no check that `<object-noun>` is being used as a verb.
- **Verdict:** GUARD (shared). Rule self-rates High risk — confirmed.

### 2. en-l4-missing-singular-article — noun-whitelist-word-used-as-verb

| Input | Wrong output | Note |
|-------|--------------|------|
| `I want book a room.` | `I want a book a room.` | `book` = verb (to book) |
| `I need book a table.` | `I need a book a table.` | same |

- **Trigger:** `\b(I|You|We|They|He|She)\s+(bought|buy|want|need)\s+(book)\b` — `book` taken as a noun object even when it is the following verb.
- **Verdict:** GUARD (shared, same predicate as #1).

---

## B. Question / do-support family — reuse the !304 guard pattern

### 3. en-yesterday-irregular-beginner-past — no question guard

| Input | Wrong output | Note |
|-------|--------------|------|
| `Did you go yesterday?` | `Did you went yesterday?` | do-support question — base form is correct |
| `Where did you go yesterday?` | `Where did you went yesterday?` | wh-question, same bug |
| `Did you go to school yesterday?` | `Did you went to school yesterday?` | same bug |

- **Trigger:** past marker + `you go` adjacency, with no `isQuestionLike` /
  do-support guard. In `did`-questions the base verb is correct.
- **Verdict:** GUARD — add the same `isQuestionLike` guard
  `en-step5-subject-verb-agreement` already has and that **!304** ("guard routine
  corrections in questions") applied to the third-person routine rules.

---

## C. Rule-specific guards/trims

### 4. en-step6-profession-article — title + proper-name

| Input | Wrong output | Should be |
|-------|--------------|-----------|
| `He is doctor Smith.` | `He is a doctor Smith.` | `He is Doctor Smith.` (title) |
| `She is doctor Strange.` | `She is a doctor Strange.` | proper name — no `a` |
| `He is engineer Lee.` | `He is an engineer Lee.` | proper name — no `an` |

- **Trigger:** `\b(?:I am|He is|She is)\s+<profession>\b` — the `\b` lets a
  following capitalized proper noun through.
- **Verdict:** GUARD — don't fire when the profession is immediately followed by
  a capitalized proper noun (title use).

### 5. en-step6-wait-for-person-object — phrasal-verb idiom

| Input | Wrong output | Note |
|-------|--------------|------|
| `Wait them out.` | `Wait for them out.` | `wait … out` = outlast; no `for` |

- **Trigger:** `\b(wait…)\s+(me|you|him|her|us|them)\b` with no lookahead for a
  trailing particle.
- **Verdict:** GUARD — block when a phrasal particle (`out`, `up`) follows the pronoun.

### 6. en-step5-subject-verb-agreement — coordinated plural subject

| Input | Wrong output | Note |
|-------|--------------|------|
| `He and she go to work.` | `He and she goes to work.` | `He and she` is plural → `go` is correct |

- **Trigger:** `/\b(He|She|It)\s+(go|make|work)\b/i` matches the **second**
  pronoun of a coordinated subject.
- **Verdict:** GUARD — don't fire when the pronoun is preceded by a coordinator
  (`<X> and <pronoun>`). Likely affects `He and I/we/they go`, `you and she go`.

### 7. en-calque-take-medicine — whitelist ambiguity (`tablet`)

| Input | Wrong output | Note |
|-------|--------------|------|
| `I eat a tablet of chocolate.` | `I take a tablet of chocolate.` | `tablet` = chocolate slab, not pill |

- **Trigger:** medicine-object whitelist includes `tablet(s)`, which also means a
  slab/bar of chocolate; `eat` is correct there.
- **Verdict:** TRIM — drop/guard `tablet` (e.g. require a medicine context, or
  exclude `tablet of <confection>`).

### 8. en-step6-look-at-pronoun — fixed "look … in the eye" idiom

| Input | Wrong output | Note |
|-------|--------------|------|
| `Look him in the eye.` | `Look at him in the eye.` | idiom takes a bare object — no `at` |

- **Trigger:** `look` + person pronoun not followed by a separated particle;
  doesn't exclude the fixed `look <obj> in the eye(s)` frame.
- **Verdict:** GUARD — add `in the eye(s)` (and similar fixed-object frames) to
  the blocked-context set, or require the pronoun to be clause-final.

---

## D. Lowest severity — at-clock-time (edge case, optional trim)

### 9. en-step6-at-clock-time — over-broad clock-time anchor

| Input | Engine output | Note |
|-------|---------------|------|
| `We meet 25:00.` | `We meet at 25:00.` | inserts `at` before an **invalid** (out-of-range) time |

- **Trigger:** `CLOCK_TIME_PATTERN` (`\d{1,2}:\d{2}`, `\d{1,2}\s*(AM|PM)`) is not
  range-bounded, so any `<verb> <1-2 digits>:<2 digits>` fires regardless of
  validity. The inserted `at` is grammatical, so the harm is over-trigger on a
  non-time, **not a broken sentence**.
- **Score/ratio probe result:** the colon-form concern does **not** reproduce on
  score/ratio inputs — `3:0`, `2:1`, `5:4` all pass through **untouched (zero
  rules fired)**. The only over-fire is the original out-of-range clock input
  `We meet 25:00`. **Scope is clock-only.**
- **Severity: LOWEST of the 9.** A genuine edge case (impossible clock time), not
  a broad false positive; output stays grammatical even when it fires.
- **Verdict:** OPTIONAL low-priority TRIM — range-bound `CLOCK_TIME_PATTERN` to
  valid hours (`0?[0-9]|1[0-9]|2[0-3]`, or 1–12 for AM/PM) and minutes (`[0-5]\d`).
  Self-contained pattern bound — **no shared guard needed**, no broken-output harm.

---

## Appendix — checked, NOT a false positive

- **en-step6-enter-concrete-place** — `Did you enter into the room?` →
  `Did you enter the room?`. The rule has no question guard, but `enter into the
  room` is the same concrete-place calque inside a question and `enter the room`
  is the **correct** fix. Output is grammatical → not an FP, not staged. Recorded
  so the audit knows it was checked.

---

_This file is the single source of truth. All six per-slice FP fragments are
folded above and **deleted in this MR** (atomic fragment-to-canonical cutover):
`-slice3.md`, `confusable-fp-candidates-slice2.md`, `-sliceA.md`, `-sliceB.md`,
and `confusable-fp-candidates-sliceC.md`. The clean abstain negatives those
slice MRs added to the fixtures are untouched and remain as real coverage._
