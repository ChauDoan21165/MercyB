# be-drop composition — deferred (WS2 hold)

> For golden-net schema, runner, and authoring rules, see the canonical reference: [`golden-net-harness.md`](./golden-net-harness.md). This doc is a topic-specific deferral note only.

**Status:** HELD. B3 will not lock be-drop composition golden fixtures until
Lane A resolves the two engine gaps below.

**Owner of the fix:** Lane A (correction engine, `src/lib/tutor/**`).
**Owner of the fixtures (blocked):** B3 (Lane B golden harness).

## Why this is held

The Lane B composition golden set ([MR !256](https://gitlab.com/cd12536/mercyB/-/merge_requests/256))
locks rule **interactions** by asserting that every expected rule co-fires and
that the composed output is one clean sentence. A golden fixture's job is to
detect *change* from a known-good baseline — so it may only encode behavior that
is correct today. Locking a fixture against broken output would freeze the bug.

The two verified be-verb-independent classes (3rd-sing × missing-to, past-marker
× missing-to) shipped in !256. The **be-drop** pairs were deferred there pending
the be-verb FP work. On re-probing the live engine after that work, **no be-drop
pair produces clean composed output**, so none can be locked yet.

Note on the gate: **!253** (`fix(tutor): skip be-drop in inverted questions`)
addressed a different be-drop case (inverted questions), not the two gaps below.
Those remain open.

## The two engine gaps (for Lane A — document, not yet fixed)

All outputs below captured from the live engine (`correctWithTutorRules(input, "en")`)
on `main` at the time this doc was written.

### Gap 1 — be-verb omission ignores past-time markers (wrong copula tense)

When a past-time marker is present, be-verb omission still inserts a **present**
copula instead of `was`/`were`. The past-marker rule does **not** co-fire.

| Input | Current output | Expected |
|-------|----------------|----------|
| `She very happy yesterday` | `She is very happy yesterday.` ❌ | `She was very happy yesterday.` |
| `they very happy yesterday` | `They are very happy yesterday.` ❌ | `They were very happy yesterday.` |
| `he very tired last night` | `He is very tired last night.` ❌ | `He was very tired last night.` |
| `we very tired two days ago` | `We are very tired two days ago.` ❌ | `We were very tired two days ago.` |

**What Lane A needs to fix:** be-verb omission should select the past copula
(`was`/`were`) when the same sentence carries a past-time marker (`yesterday`,
`last <unit>`, `<n> <unit> ago`) — i.e. the copula-insertion path must consult
the same past-marker signal the verb-past rule uses.

### Gap 2 — be-drop × missing-to composes into a run-on

When be-verb omission and the missing-`to` preposition rule both apply to one
input, they co-fire but the result is ungrammatical.

| Input | Current output | Problem |
|-------|----------------|---------|
| `he very happy go school` | `He is very happy go to school.` ❌ | run-on: two predicates (`is very happy` + `go to school`) with no conjunction/boundary |

**What Lane A needs to fix:** ordering/guarding so the two rules don't stitch a
run-on. Either suppress one rule when the input is two clauses jammed together,
or route this surface to `needs_ai` rather than emitting a malformed sentence.

## Unblock criteria (when B3 can lock be-drop fixtures)

B3 will draft and lock the be-drop composition golden set once **both** are true:

1. Gap 1 fixed — past-marker be-drop yields `was`/`were` and the past-marker
   rule co-fires (assertable via `expectedRulesFired[]`).
2. Gap 2 fixed — be-drop × missing-to yields a clean single sentence (or a
   deliberate `needs_ai`), with no run-on.

Until then, **WS2 be-drop holds.** The !256 composition set (non-be-drop) is
unaffected and remains in force.
