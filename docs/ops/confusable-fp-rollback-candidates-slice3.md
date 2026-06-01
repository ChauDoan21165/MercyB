# Confusable-negative stress — Slice 3 FP rollback candidates (CEO audit)

> **Consolidation note:** the shared `confusable-fp-rollback-candidates.md`
> (created in !311, slice 1) is **not on `main` yet**, so writing the shared file
> here would add/add-conflict with !311 and B5's slice-2. This slice-3 fragment
> is kept separate; fold it into the shared doc's `## Slice 3` section once !311
> merges. Same format.

Each entry is a **real captured** `input → wrong-output` from the live engine.
Rule **not** edited; FP **not** added as a passing negative. Clean confusables
were added as negative fixtures in the same MR.

## Slice 3 — B3 (en-step6-past-marker-recall, en-calque-take-medicine, en-step6-listen-to-object)

Per-rule verdict:

| Rule | Verdict | Clean confusable negatives added |
|------|---------|----------------------------------|
| en-step6-listen-to-object | ✅ CLEAN (no FP) | comitative `Listen with me.`, phrasal `Listen up everyone.` |
| en-step6-past-marker-recall | ✅ CLEAN (no FP) | future-year `In 2050 I go to Paris.`, comma-blocker `Two hours ago, I go home.` |
| en-calque-take-medicine | 🔴 **1 FP** | non-medicine `I eat candy.`, idiom `Eat your words.` |

### 🔴 en-calque-take-medicine — `tablet` (chocolate slab) FP

The medicine-object whitelist includes `tablet`, which is **also** a British word
for a slab/bar of chocolate. `eat a tablet of chocolate` is correct English; the
rule rewrites `eat → take`.

| Input | Wrong output | Note |
|-------|--------------|------|
| `I eat a tablet of chocolate.` | `I take a tablet of chocolate.` | `tablet` = chocolate slab, not a pill |

Root: `CALQUE_MEDICINE_OBJECT_PATTERN` lists `tablet(s)` with no guard for the
`tablet of chocolate` (confection) sense; the verb `eat` is correct there.

### ✅ Clean (no FP) — for the audit record
- **en-step6-listen-to-object** abstained correctly on comitative (`Listen with
  me.`), adverb (`Listen carefully.`), phrasal (`Listen up everyone.`), idiom
  (`Listen here.`), and different-verb (`I hear music.`). Whitelist-gated; precise.
- **en-step6-past-marker-recall** abstained correctly on future years (`In 2050
  …`, `isPastYear`=false), habitual (`Every Monday …`), `on <day>` (`On Monday
  …`), and comma clause-blocked surfaces. Guards hold.
