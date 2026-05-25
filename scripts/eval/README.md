# L1 correction eval harness

Offline measurement of MercyBlade's Vietnamese L1-interference detector
(`src/lib/feedback/l1-error-detector.ts` and its rule packs). Reads
held-out fixture JSON, runs each learner sentence through
`detectL1Error`, compares the returned tag to what the case expects,
and prints a per-family pass-rate table plus a global number.

**Not** wired into CI. **Not** imported by app runtime. Run it manually
before and after touching anything under `src/lib/feedback/` to confirm
your change didn't regress the baseline.

## Run

```bash
# Default: load both fixtures (evals/vi-grammar-cases.json + evals/vi-writing-cases.json).
npx tsx scripts/eval/l1-correction-harness.ts

# A single fixture, or several explicitly named ones.
npx tsx scripts/eval/l1-correction-harness.ts --files evals/vi-grammar-cases.json

# Filter to specific families (comma-separated, no spaces inside the list).
npx tsx scripts/eval/l1-correction-harness.ts --families plural-s-omission,copula-be-deletion

# Overwrite evals/.baseline.json with the current run's per-family pass rates.
# Do this whenever the fixture set changes intentionally.
npx tsx scripts/eval/l1-correction-harness.ts --update-baseline

# Compare against the stored baseline; exit 1 if the global pass rate
# has dropped. Use in a pre-merge check once the harness has settled.
npx tsx scripts/eval/l1-correction-harness.ts --regression

# Machine-readable JSON for piping into other tools.
npx tsx scripts/eval/l1-correction-harness.ts --json

# Skip the per-failure detail block at the bottom.
npx tsx scripts/eval/l1-correction-harness.ts --quiet
```

## The three case categories

Each case in a fixture declares an `expected_category`. The harness's
verdict depends on which category the case is in:

| `expected_category` | Pass condition                                                       | Counted in baseline? |
| ------------------- | -------------------------------------------------------------------- | -------------------- |
| `expected_pass`     | Detector fires **and** the returned tag equals `expected_rule_id`.   | yes                  |
| `expected_partial`  | Detector fires **any** rule (a parent or related rule is expected).  | yes                  |
| `expected_failure`  | Detector does **not** fire. The case documents a known detector gap. | **no**               |

The `expected_failure` bucket is the one that makes this harness do
something a unit-test suite can't easily do: cases waiting for a
detector to ship sit in `expected_failure` indefinitely without
penalising the baseline. The moment the detector lands and starts
firing on them, the author flips the case from `expected_failure` to
`expected_pass` and re-runs with `--update-baseline`. The baseline
goes up automatically; the cases stop being gap markers and start
being regression guards.

Current `expected_failure` cases of note:

- `vi-gram-014`, `vi-gram-015` — future-via-adverbs (`Tomorrow I go…`),
  waiting for `vi_l1_future_adverb_bare`.
- `vi-gram-072`, `vi-gram-073`, `vi-gram-074` — subject-position `he/she`
  swap, waiting for `vi_l1_subject_gender`.
- `vi-gram-110` – `112` — topic-comment fronting (`My family, they
  live in Hue`), waiting for `vi_l1_topic_comment_fronting`.
- `vi-gram-120` – `122` — `có` → `has/there is` over-mapping, waiting
  for `vi_l1_co_transfer`.
- `vi-gram-142`, `vi-gram-143` — bare `no/not` negation without
  do-support, waiting for `vi_l1_no_aux_negation`.

The five `vi-write-00*` cases in `evals/vi-writing-cases.json` are
placeholders for C2's writing-quality coverage and are all marked
`expected_failure` since the sentence-level detector can't see them.

## Fixture JSON shape

```jsonc
{
  "_meta": {
    "fixture_name": "vi-grammar-cases",
    "schema_version": 1,
    "purpose": "...",
    "source_notes": ["..."]
  },
  "cases": [
    {
      "id": "vi-gram-001",
      "family": "article-omission-overuse",
      "expected_rule_id": "vi_l1_missing_article",
      "severity": "medium",
      "input": "I bought book yesterday.",
      "expected_correction": "I bought a book yesterday.",
      "expected_category": "expected_pass",
      "source": "C1-taxonomy",
      "notes": "Optional one-liner."
    }
  ]
}
```

Field-by-field:

- **`id`** (string, required, unique within the fixture) — stable
  forever. Used in failure output. Do not renumber when adding cases;
  append.
- **`family`** (string, required) — the abstract grammar family this
  case targets. Free-form, but it should match a family name from
  `docs/l1-taxonomies/vi-grammar.md` so failures route to the right
  authoring backlog.
- **`expected_rule_id`** (string | null, required) — the detector tag
  the case ideally fires. Must be a member of the `L1WeaknessTag`
  union in `src/lib/feedback/l1-error-detector.ts` **unless** the case
  is `expected_failure` for a detector that doesn't exist yet, in
  which case use the planned tag name (e.g. `vi_l1_subject_gender`).
  Use `null` for false-positive guard cases where no rule should fire.
- **`severity`** (`"high" | "medium" | "low"`, required) — consumer-
  side hint for how the tutor should treat a match. The harness records
  it but does **not** weight by it: severity is for tutor UX, not for
  rule priority. Rule priority remains first-match-wins in the
  `VN_RULES` registry order.
- **`input`** (string, required) — the learner's sentence. Passed as
  `userAnswer` to `detectL1Error`.
- **`expected_correction`** (string, required) — the target form.
  Passed as `expectedAnswer` to the detector. Most positional rules
  compare these two tokenwise, so phrasing matters.
- **`expected_category`** (required) — see the three categories table
  above.
- **`source`** (string, required) — provenance. Use `"C1-taxonomy"`
  for cases drawn from `docs/l1-taxonomies/vi-grammar.md`,
  `"docs/placement-vn-l1-interference-taxonomy.md"` for cases drawn
  from that doc, `"corpus"` for real learner data, `"invented"` for
  plausibility-only cases (mark honestly).
- **`notes`** (string, optional) — one-liner. Useful for explaining
  why a case is partial / failure / counter-example.

## Adding cases

1. Pick a fixture. Sentence-level grammar goes in
   `evals/vi-grammar-cases.json`. Paragraph / discourse / register
   goes in `evals/vi-writing-cases.json`.
2. Append a case using the schema above. Use the next free id slot in
   the family's range (the existing file leaves gaps between families:
   `001-005` for articles, `010-015` for tense, `020-024` for plurals,
   etc.). Append, never renumber.
3. If you're targeting a real detector tag, confirm the tag exists in
   `L1WeaknessTag` in `src/lib/feedback/l1-error-detector.ts`.
4. Re-run the harness. If the case's verdict matches what you expect,
   commit. If you intentionally changed the fixture set in a way that
   moves the baseline, re-run with `--update-baseline` and commit the
   updated `.baseline.json` alongside.

## When to add a new fixture file (vs. extending existing ones)

- A new L1 (e.g. Korean → English learners) → new file
  `evals/<l1>-grammar-cases.json`. The harness's `--files` flag accepts
  any number.
- A new error class that doesn't fit grammar or writing (e.g. listening
  comprehension, kids-mode picture-vocab) → new file with a distinct
  name. Don't overload the grammar fixture.
- Real corpus replacing invented placeholders → land the new file
  alongside the existing one, validate the baseline holds, then prune
  the old file once coverage is equivalent.

## How `--update-baseline` and `--regression` interact

`--update-baseline` writes the current run's per-family + global pass
rates to `evals/.baseline.json`. `--regression` reads that file and
exits 1 if the current global pass rate is below the stored rate (no
epsilon — any drop is a fail). Use `--update-baseline` after an
intentional fixture or detector change; use `--regression` as a
pre-merge guard.

There is intentionally no "automatic baseline update on success" — a
silent baseline shift would hide regressions. The author must decide
the new number is correct and commit the file change explicitly.

## What the harness measures (and doesn't)

Measures:

- Whether the detector identifies the right L1 *family* for each case.
- Whether known detector gaps (`expected_failure` cases) remain gaps
  (i.e. no spurious match has been introduced).
- Per-family pass rate, so changing one rule pack reveals which
  families moved.

Does **not** measure:

- Correction-text quality (the rule's `FIX` template content).
- Feedback-string quality (`L1_VN_EXPLANATIONS` in
  `src/lib/feedback/l1-vn-explanations.ts`).
- Downstream AI Tutor response quality (this harness doesn't call any
  LLM — it's pure-regex, deterministic, free, fast).
- Severity tier appropriateness (recorded for context, not graded).

These are follow-on harnesses worth building once the detector-level
baseline stabilises.

## Source of truth

- Detector entry point: `detectL1Error` in
  `src/lib/feedback/index.ts` (barrel re-export of the engine + VN
  pack).
- Rule code: `src/lib/feedback/l1-error-detector.ts`.
- Rule registry / ordering: `src/lib/feedback/rule-packs/vi/rules.ts`.
- Explanations: `src/lib/feedback/rule-packs/vi/explanations.ts` and
  `src/lib/feedback/l1-vn-explanations.ts`.
- Authoring taxonomy: `docs/l1-taxonomies/vi-grammar.md` (C1) and
  `docs/placement-vn-l1-interference-taxonomy.md` (broader, older).
- Existing unit tests: `src/lib/feedback/__tests__/*.test.ts`. The
  harness is complementary, not a duplicate — unit tests cover
  rule-by-rule logic in isolation, the harness measures end-to-end
  family-tag accuracy on held-out cases.
