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
| 10 | en-l4-quantity-plural-s | verb-sense (quantity+noun) | GUARD (shared, verb-sense) — **LOW** (wave 2) |

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

## Second wave — verb-transforming guard-gap map

Read-only inspection of **every** rule in `src/lib/tutor/correctionRules/en.ts`
on two axes, with live-engine probes for each flagged rule. Result: **no new
high-severity gap** — the 9 above cover the real ones. One marginal new
over-fire (low-plausibility) + a confirmed breadth on #3.

### Axis 1 — do-support / question gap (verb-form rewrite inside a question)

| Rule | Question guard? | Probe | Verdict |
|------|-----------------|-------|---------|
| en-yesterday-irregular-beginner-past | ❌ none | `Did you eat yesterday?` → `Did you ate yesterday?` | **FP — already #3** (see breadth note) |
| en-step5-subject-verb-agreement | ✅ `!isQuestionLike` | `Does he go?` untouched | safe |
| en-third-person-daily-go-eat-have | ✅ `!isQuestionLike` (!304) | `Does she go every day?` untouched | safe |
| en-third-person-school-routine | ✅ `!isQuestionLike` (!304) | `Did she go to school?` untouched | safe |
| en-be-verb-omission | ✅ `!isBeAuxInvertedQuestion` | — | safe |
| en-step6-location-be-drop / past-marker-recall | ✅ `isQuestionLike` guard | — | safe |
| calques (discuss-about, marry-with, open/close-appliance, take-medicine, say-with-person), preposition-pattern, enter-concrete-place | ❌ none | `Did you discuss about it?` → `Did you discuss it?` ; `Did you open the light?` → `Did you turn on the light?` | **NOT FP** — the calque error exists in questions too; output is correct |
| morning-routine / runon-punctuation | exact `^…$` anchor | — | safe |

**Breadth note on #3:** `en-yesterday-irregular-beginner-past` breaks on **every
verb in its set** inside a `do`-question, not just `go`:
`Did you eat yesterday?` → `…ate`, `Did you buy yesterday?` → `…bought`,
`Did you have lunch yesterday?` → `…had`, `Did you do it yesterday?` → `…did`.
The single `isQuestionLike` guard (verdict #3) fixes all of them.

### Axis 2 — verb-sense (transforms on a verb/noun-ambiguous token)

| Rule | Token | Probe | Verdict |
|------|-------|-------|---------|
| en-step6-possessive-s | object whitelist (phone/book/bike) | — | **FP — already #1** |
| en-l4-missing-singular-article | noun whitelist (book) | — | **FP — already #2** |
| en-l4-quantity-plural-s | `book`/`word` after a quantity | `I want some book a room.` → `I want some books a room.` | **NEW — #10, LOW** (see below) |
| en-step6-listen-to-object | object whitelist | `Listen story.` → `Listen to story.` (correct) | safe |
| en-step6-profession-article | profession (nurse/driver/doctor) | `She is nurse.` → `She is a nurse.` (correct) | safe — `He is/She is <prof>` forces the noun reading |
| en-step6-past-marker-recall | verbs eat/go/move | `Last summer I move to Canada.` → `…moved` (correct) | safe — slot wants a verb |

### 10. en-l4-quantity-plural-s — verb-sense (LOW / low-plausibility)

| Input | Wrong output | Note |
|-------|--------------|------|
| `I want some book a room.` | `I want some books a room.` | `book` is the verb (to book), but `(some\|two\|…)\s+book` pluralizes it |

- **Trigger:** `/\b(two\|three\|many\|some\|several)\s+(…\|book\|…\|word)\b/i` — no
  guard against the quantity-adjacent noun being a following verb.
- **Verdict:** GUARD (verb-sense family, same shared predicate as #1/#2) — **LOW
  severity**: a quantity determiner almost always forces the noun reading, so a
  natural learner surface for this is rare. The reproducing input is contrived.
  Folds into the shared verb-sense guard for free; not worth its own change.

---

_This file is the single source of truth. All six per-slice FP fragments are
folded above and **deleted in this MR** (atomic fragment-to-canonical cutover):
`-slice3.md`, `confusable-fp-candidates-slice2.md`, `-sliceA.md`, `-sliceB.md`,
and `confusable-fp-candidates-sliceC.md`. The clean abstain negatives those
slice MRs added to the fixtures are untouched and remain as real coverage._
