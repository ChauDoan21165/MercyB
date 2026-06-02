# Proposal — Content fill for vi→de / vi→ja / vi→ko / vi→zh

> **STATUS: PROPOSAL ONLY — no cards generated yet.** Awaiting CEO approval of
> the sourcing strategy + validation gate below before any DC1–DC4 work or seed.
> Branch `lane-d/content` (off `origin/lane-d/review`). Isolation contract
> unchanged: files under `src/features/review/content/` only, flagged,
> client-first, no new Supabase tables, no touch to A/B/C/billing/auth/audio.

## STEP 0 recon — headline

**The content largely already exists in the repo.** D3's "no clean VI-gloss
source" conclusion was wrong — it was misled by field names. Each target
language has CEFR-leveled lesson files (`src/languages/<lang>/lessons-a1…c2.ts`)
that already pair the **target sentence** with a **Vietnamese gloss** — but the
fields are named inconsistently per language, and the target text is sometimes
stored in a field literally called `en`.

> **Adapting existing content beats generating it** — it's authored, already
> shipping on the live lesson pages, and avoids the correctness risk of MT. The
> work is mostly *field-mapping + validation*, with generation only to fill
> measured gaps. "Wrong content > no content" → adaptation is the low-risk path.

### Per-language source inventory (counts across A1–C2)

| Flow  | Target field           | VI gloss field        | Reading field        | VI coverage | Verdict |
| ----- | ---------------------- | --------------------- | -------------------- | ----------- | ------- |
| vi→de | `en` (holds **German**)| `vi` ✅                | n/a (Latin script)   | ~3,759 sentences ✅ | **Adapt as-is** |
| vi→ko | `korean` (hangul)      | `vi` ✅ (~2,001)       | `romanized` (~726)   | partial/mixed shapes | **Adapt subset + fill** |
| vi→zh | `chinese` (hanzi)      | `vi` ✅ (~2,080)       | `pinyin` (~4,409) ✅  | ~2,080 / ~4,260 ≈ 49% | **Adapt subset + fill** |
| vi→ja | `japanese` (kana/kanji)| **none at sentence level** | none (no romaji)| 0 per-sentence (VI only in lesson meta) | **Adapt target + generate VI + romaji** |

Field-shape examples found:
- **de** `{ "en": "Guten Morgen! Ich heiße Anna.", "vi": "Chào buổi sáng! …", "pronunciation_focus": [VI], "pronunciation_focus_en": [EN] }` — `en` is German; `vi` is the real Vietnamese gloss.
- **ko** `{ "korean": "아", "romanized": "a", "en": "a", "vi": "Nguyên âm 'a'" }` — mixed: alphabet drills vs full sentences; only ~726/2,001 carry `korean`+`romanized`.
- **zh** `{ "chinese": "你好吗？", "pinyin": "nǐ hǎo ma?", "english": "How are you?", … }` — pinyin is tone-marked; only ~half of hanzi sentences carry a `vi`.
- **ja** `{ "japanese": "…", "english": "…", "pronunciation_focus": […] }` — gloss is **English**, no `vi`, no romaji. Vietnamese exists only as `title_vi` / `tip_advice_vi` / `cultural_notes_vi` at the lesson level.

These files are **live** (they feed the German/Japanese/Korean/Chinese lesson
pages), so the ContentAdapter reads them **read-only** — no risk of mutating
shipping content.

## Sourcing proposal (per language)

**Recommended strategy: adapt-first, generate-to-fill, all behind validation.**

1. **vi→de — pure adaptation, zero generation.** Map `en`→`back` (German),
   `vi`→`front`, lesson `level`→CEFR tag. ~3,759 sentences immediately. No MT,
   no reading needed (Latin). Lowest risk, highest yield — ship this first.
2. **vi→ko — adapt the `korean`+`vi` subset; generate to fill.** Take sentences
   that carry both `korean` and `vi` (map `romanized`→pronunciation). For
   `vi`-only or `korean`-only rows, **generate the missing half** (romaja from
   hangul is deterministic; VI gloss via validated MT). ~726 clean now, rest
   gated through generation+validation.
3. **vi→zh — adapt the `chinese`+`vi`+`pinyin` subset; generate VI for the gap.**
   ~2,080 clean now (pinyin already tone-marked). The ~2,180 hanzi sentences
   missing `vi` get a **validated generated VI gloss**.
4. **vi→ja — adapt target + generate VI gloss + romaji.** The `japanese` text is
   authored and trustworthy; we generate (a) the **romaji reading** (deterministic
   kana→romaji, but kanji needs reading disambiguation → generate+validate) and
   (b) the **VI gloss** (from the existing `english` + Japanese, validated). This
   is the most generation-heavy flow → smallest seed, strictest gate, ships last.

**Generation mechanism (when needed):** a **build-time offline script** (not a
runtime path) that calls the model, writes static validated JSON committed to
this branch. No runtime model calls, no billing/auth/audio coupling, client-first
contract intact. Generated cards are quarantined until they pass the gate +
human review.

### Tradeoffs
- **Adapt** — authored quality, instant, zero MT risk; but bounded by existing
  coverage and tied to the source field shapes (brittle if upstream renames).
- **Generate** — fills gaps, scales; but MT can be subtly wrong (the exact
  failure the gate exists to catch), costs tokens, needs human spot-review.
- **Recommendation:** adapt everything available now (de fully, ko/zh subsets),
  generate only the measured gaps, gate everything identically. de flips on
  first; ja last.

## Validation gate (what certifies a card correct) — per language

A card is **certified** only if it passes **every** applicable check; any failure
→ `quarantine` (not live). Shared checks first, then per-language.

**Shared (all 4 flows):**
- **Non-empty** front (VI) and back (target); trimmed; no placeholder/ellipsis-only.
- **Stable namespaced id** `"<flow>:<kind>:<slug>"` (existing D3 contract);
  **dedup** within and across source files (first-wins, log collisions).
- **CEFR tag** inherited from the source lesson `level` (A1–C2); generated cards
  inherit their source lesson's level.
- **Script-leak guard:** front must be Latin+Vietnamese-diacritic only (no target
  script bleeding into the VI side); back must be in the target script (below).
- **Length sanity:** reject cards whose back is wildly longer/shorter than its
  source class (catches truncated/duplicated MT).

**vi→de:**
- Back is **Latin** with German orthography; **preserve ä/ö/ü/ß** (reject cards
  where umlauts/ß were mangled to ae/oe/ue/ss unless the source did so).
- No CJK/Cyrillic codepoints in back.
- (No reading check — Latin script.)

**vi→ja:**
- Back **contains at least one Japanese codepoint** (Hiragana U+3040–309F /
  Katakana U+30A0–30FF / CJK Ideograph U+4E00–9FFF); reject romaji-only backs.
- **Romaji reading** present and **kana-consistent**: kana segments must
  round-trip to the generated romaji deterministically; kanji readings flagged
  for human review when ambiguous.
- **VI gloss back-translation round-trip:** generated VI → MT back to JA →
  semantic-similarity vs the source `japanese` above threshold; below →
  quarantine.

**vi→ko:**
- Back is **Hangul** (Hangul Syllables U+AC00–D7A3, allow Jamo for alphabet
  drills); reject non-Hangul backs.
- **Romaja** present and **Revised-Romanization-consistent** with the hangul
  (deterministic transliteration check).
- VI round-trip for any **generated** VI gloss (as ja).

**vi→zh:**
- Back is **Hanzi** (CJK Unified Ideographs); reject pinyin-only/Latin backs.
- **Pinyin** present and **tone-marked** (diacritic tones or numbered tones);
  reject toneless pinyin; validate pinyin syllable validity.
- VI round-trip for any **generated** VI gloss.

**Threshold + escalation:** round-trip similarity and reading-consistency
thresholds tuned on the seed; anything below → `quarantine` with a reason code.
A flow's adapter flips **on** only after its seed clears the gate **and** a human
review pass. Validation runs in CI as a content-lint check (DC4) so no
uncertified card can land live.

## After approval — fan-out plan (unchanged from brief)
- **DC1 ingestion/** — `ContentSource` interface + importer (adapt) / generator
  (fill) feeding the existing `ContentAdapter`.
- **DC2 validate/** — the full gate above (the big slice).
- **DC3 adapters/** — wire **certified** content into the 4 flows, per language.
- **DC4** — tests + a content-lint CI check that fails on any uncertified card.
- **SEED** — a SMALL gated batch per language (proposed: A1, ~20 cards/lang),
  marked `for-review`, **not** auto-live. Flow flips on only post-validation +
  review.

## Recommendation (my clear pick)
Approve **adapt-first**: ship **vi→de** from existing content with the gate above
(no generation, ~3,759 cards available — biggest, safest win), **vi→zh** and
**vi→ko** from their VI-glossed subsets, and treat **vi→ja** as a
generation-gated flow that ships last with the strictest seed. Seed = A1 / ~20
cards per language for the review pass before any flow goes live.
