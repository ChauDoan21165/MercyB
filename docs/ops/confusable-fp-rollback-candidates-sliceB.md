# Confusable-negative stress — Slice B FP rollback candidates (CEO audit)

> Per-slice fragment (shared rollback doc not on `main` yet — avoids add/add
> conflict). Fold into the shared doc later. Same format. Every entry is a
> **real captured** `input → wrong-output`; rule **not** edited, FP **not** added
> as a passing negative.

## Slice B — B3 (en-l4-missing-singular-article, en-l4-topic-comment-word-order, en-step6-location-be-drop)

| Rule | Verdict | Clean confusable negatives added |
|------|---------|----------------------------------|
| en-l4-missing-singular-article | 🔴 **1 FP** | proper noun, plural, intervening |
| en-step6-location-be-drop | ✅ CLEAN | intervening, trailing word, non-whitelist location |
| en-l4-topic-comment-word-order | ✅ CLEAN (confirmed anchored) | verb near-miss, extra-words anchor break |

### 🔴 en-l4-missing-singular-article — noun-whitelist-word-used-as-verb FP

The noun whitelist (`apple|bicycle|book|hat|orange|student|teacher`) includes
`book`, which is **also** a verb. After `want`/`need`, the learner often means
the verb (`want to book a room`); the rule inserts `a` and breaks the sentence.

| Input | Wrong output | Note |
|-------|--------------|------|
| `I want book a room.` | `I want a book a room.` | `book` = verb (to book) |
| `I need book a table.` | `I need a book a table.` | same |

Root: `\b(I|You|We|They|He|She)\s+(bought|buy|want|need)\s+(book)\b` has no
guard against the object-noun being used as a following verb.

### ✅ Clean (no FP) — for the audit record
- **en-step6-location-be-drop** is fully anchored (`^pronoun + whitelisted
  location$`, questions blocked). It abstained on intervening adverb (`I really
  at home`), trailing word (`he at the office now`), already-copula (`I am at
  home`), and non-whitelist location (`I at the gym`). Very safe.
- **en-l4-topic-comment-word-order** matches three exact `^…$` strings; near-miss
  surfaces (`This book I love.`, `This book I like a lot.`) do not match, so it
  self-guards. Confirmed clean as expected.
