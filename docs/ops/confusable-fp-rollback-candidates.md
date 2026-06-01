# Confusable-negative stress test — FALSE-POSITIVE rollback candidates (CEO audit)

Each entry is a **real captured** `input → wrong-output` from the live engine
(`correctWithTutorRules(input, "en")`). These rules **over-correct** a confusable
surface. **Do not fix the rule here** — flagged for Lane A + the CEO rollback
audit. Clean confusables (rule correctly abstains) were added as negative
fixtures in the same MR; the FPs below were **not** added (they would not pass).

Parallel agents: append your slice's section below; keep the table format.

## Slice 1 — B3 (en-step6-profession-article, en-step6-possessive-s, en-step6-wait-for-person-object)

### 🔴 en-step6-profession-article — title + proper-name FP

The matcher `\b(?:I am|He is|She is)\s+(<profession>)\b` fires whenever a
whitelisted profession word follows the copula, even when it is a **title before
a proper name** (no article belongs there).

| Input | Wrong output | Should be |
|-------|--------------|-----------|
| `He is doctor Smith.` | `He is a doctor Smith.` | `He is Doctor Smith.` (title, no `a`) |
| `She is doctor Strange.` | `She is a doctor Strange.` | proper name — no `a` |
| `He is engineer Lee.` | `He is an engineer Lee.` | proper name — no `an` |

Root: the matcher's `\b` after the profession lets a following capitalized
proper noun through; no guard for "profession used as a title."

### 🔴 en-step6-possessive-s — object-noun-used-as-verb FP

The object whitelist (`car|phone|house|room|bag|book|computer|bicycle|bike|office|job`)
contains words that are also **verbs**. When the learner uses one as a verb, the
rule still inserts `'s`, producing a broken sentence.

| Input | Wrong output | Note |
|-------|--------------|------|
| `My sister phone me yesterday.` | `My sister's phone me yesterday.` | `phone` is the verb (phoned) |
| `My friend book a room.` | `My friend's book a room.` | `book` is the verb (books) |
| `His brother bike to work.` | `His brother's bike to work.` | `bike` is the verb (bikes) |

Root: no part-of-speech / following-context guard distinguishing object-noun
`phone/book/bike` from verb `phone/book/bike`. (fpRiskNote already rates this
rule **High risk** — confirmed.)

### 🔴 en-step6-wait-for-person-object — phrasal-verb idiom FP

`\b(wait|waits|waited|waiting)\s+(me|you|him|her|us|them)\b` fires inside the
phrasal idiom `wait <pronoun> out`, inserting `for` mid-idiom.

| Input | Wrong output | Note |
|-------|--------------|------|
| `Wait them out.` | `Wait for them out.` | `wait … out` = outlast; no `for` |

Root: no lookahead for a trailing phrasal particle (`out`, `up`).

## Slice 2 — (fan-out agent)
_pending_

## Slice 3 — (fan-out agent)
_pending_
