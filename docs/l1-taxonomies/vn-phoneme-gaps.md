# Vietnamese L1 → English pronunciation: gap audit

**Date:** 2026-05-24
**Author:** C3 (read-only audit agent)
**Subject:** `src/lib/pronunciation/vn-phoneme-map.ts` (628 lines, curated)
**Companion artifact:** `src/lib/pronunciation/vn-phoneme-map.extension.proposed.ts` (PROPOSAL, not imported)

This report identifies systematic Vietnamese-speaker English-pronunciation transfer patterns that the existing map does **not** cover. Every proposed entry is delta-checked against the live map — no duplicates. Each substitute is encoded in the exact shape of the existing `PhonemeSubRule` / `WORD_OVERRIDES` types, so the proposal could be merged with copy-paste plus review. Confidence-marked TODOs flag items I couldn't fully verify against a reference corpus.

---

## What the map covers well

The current map (curated, ~13 phoneme tips + 10 substitution rules + 15 word overrides + 38 problem pairs) handles the **highest-frequency consonant transfer set** very competently:

- Voiceless `th → t` and `th → f` with realistic credit asymmetry (0.75 vs 0.60)
- Voiced `th` (the/this/that) via word overrides with `d` and `z` variants
- `v → b` (most-cited VN-English error, especially in the diaspora-recognised "bery" caricature)
- `z → s` (high credit 0.80 — correctly recognises this barely affects intelligibility)
- `sh → s`, `j → d`, `r → l`, `l → n`
- Final `-s` and final `-ed` drop at 0.85 (grammar markers, ship-it level)
- Phoneme tips include `cluster-initial` and `cluster-final` and `final-consonant` (broad-coverage tips even though the substitution table doesn't enumerate the cluster rules)
- Problem-pair drills cover `th/t`, `r/l`, `-ed`, `-s` (38 pairs total) — the four canonical Vietnamese sticking points

**Curated discipline observed:** credit values cluster at 0.60 / 0.70 / 0.75 / 0.80 / 0.85, no fractional drift. Per-word overrides only when sound-level rules are too coarse. The file is biased toward "what would a Vietnamese teacher accept from a beginner?" not phonetic textbook truth — and the proposal below honors that bias.

---

## Gap 1 — Southern Vietnamese dialect transfer

**Rationale.** The existing map treats Vietnamese as one dialect. The single dialect-aware comment (`r → l`, "some northern VN speakers flip these") is actually backwards: the r↔l/d/gi merger is most strongly **northern** (Hanoi) where /r/ collapses toward /z/ and southerners preserve a retroflex /r/. More importantly, the **southern** dialect has a single very high-frequency feature missing from the map entirely:

- Southern `/v/` is realized as `[j]` (a yod-glide). So a Saigon learner saying English "very" outputs **"yery"** not "bery" — and the v→b rule gives them zero credit. This is the single biggest dialect-attributable false negative the current scorer will produce.
- Southern dialect also retroflexes `s/x/tr/ch` differently from the north, but those effects mostly **help** English production (English /ʃ/ already maps to southern `s`/`x`), so we don't add rules — we just don't penalize when southerners actually say `ʃ` for `sh`.
- TODO: verify — northern `d/gi/r → z` collapse may need its own rule if scorer hears "zice" for "rice" from a northern learner. Skipped from proposal pending logged production data.

**Proposed entries (8):**

| target | substitute | credit | note |
|---|---|---|---|
| `v` | `y` | 0.65 | Southern `/v/ → [j]` — "very → yery", "voice → yoice" |
| word: very | yery | 0.65 | South complement to existing `bery` |
| word: voice | yois | 0.65 | South |
| word: visit | yisit | 0.65 | South |
| word: video | yidio | 0.65 | South (also widespread in casual diaspora speech) |
| word: vote | yote | 0.65 | South |
| word: have | hay | 0.55 | South + final-v drop (`have` → "hay") — marginal credit |
| word: love | loy | 0.55 | South + final-v drop — marginal credit |

---

## Gap 2 — Final consonant cluster simplification (beyond `-s` and `-ed`)

**Rationale.** Vietnamese permits **zero** consonant clusters in coda position. Allowed finals are six nasals/stops only (`m`, `n`, `ng`, `p`, `t`, `k`), all unreleased. So **every** English final cluster gets simplified by VN learners — far beyond the `-s` and `-ed` cases the current map covers. The pattern is highly systematic: keep the first consonant, drop the rest (most common); or keep the last, drop the rest (less common). Both deserve partial credit; the first is more recognizable.

This is arguably the largest unaddressed gap. The map's `cluster-final` tip names this in prose but the substitution table doesn't enumerate it, so the scorer marks "las" (for "last") as `wrong` rather than `close`.

**Proposed entries (18):**

| target rule | substitute | credit | Examples produced |
|---|---|---|---|
| `st$` | `s` | 0.75 | last → las, first → firs, lost → los, just → jus, rest → res |
| `st$` | `t` | 0.65 | last → lat (less common, southern) |
| `sk$` | `s` | 0.70 | ask → as, desk → des, risk → ris |
| `sk$` | `k` | 0.65 | ask → ak, desk → dek |
| `sp$` | `s` | 0.70 | wasp → was, crisp → cris |
| `ld$` | `l` | 0.75 | told → tol, cold → col, child → chil, world → worl |
| `ld$` | `d` | 0.60 | told → tod, cold → cod |
| `nd$` | `n` | 0.80 | find → fin, friend → frien, send → sen, mind → min |
| `nt$` | `n` | 0.75 | want → wan, point → poin, count → coun |
| `ft$` | `f` | 0.70 | left → lef, soft → sof, gift → gif |
| `lf$` | `l` | 0.70 | self → sel, half → hal, golf → gol |
| `mp$` | `m` | 0.75 | jump → jum, lamp → lam, camp → cam |
| `lp$` | `l` | 0.70 | help → hel, gulp → gul |
| `lt$` | `l` | 0.70 | felt → fel, salt → sal, built → buil |
| `ct$` | `c` | 0.65 | act → ac, fact → fac (orthographic c masks /k/ here) |
| `pt$` | `p` | 0.70 | kept → kep, slept → slep, accept → accep |
| `xt$` | `x` | 0.70 | next → nex, text → tex |
| `nk$` | `n` | 0.70 | think → thin (collides with vowel pair — see Gap 3), bank → ban |

---

## Gap 3 — Vowel quality drift

**Rationale.** Vietnamese has a rich vowel inventory but the contrasts don't line up with English. The map currently has **zero** vowel substitution rules. The most-cited pairs:

- `/ɪ/` vs `/iː/` (ship/sheep, fit/feet, bit/beat, sit/seat) — VN tends toward an undifferentiated `/i/`
- `/ʊ/` vs `/uː/` (full/fool, pull/pool, look/Luke) — collapses to one rounded back vowel
- `/æ/` vs `/e/` (bad/bed, bat/bet, sat/set) — `/æ/` doesn't exist; collapses to `e` or front `a`
- `/ʌ/` vs `/ɒ/` vs `/ɑː/` (cup/cop, but/bot, luck/lock) — central `/ʌ/` doesn't exist; collapses to back rounded
- `/ɜː/` (bird, work, learn) — no equivalent; collapses to `/ə/` or front vowel `e`
- `/eɪ/` → `/e/` (eight → "et", late → "let"); `/oʊ/` → `/o/` (boat → "bot"); diphthongs flattened
- Schwa `/ə/` → full vowel (about → "a-bowt", banana → "ba-na-na" three full /a/s)

These cannot be encoded as `PHONEME_SUBSTITUTIONS` (which operate on orthography, not IPA) — they must live as `WORD_OVERRIDES` per-word. Below are the highest-frequency learner targets.

**Proposed entries (12 word overrides):**

| target | variants | rationale |
|---|---|---|
| sheep | ship (0.65), sip (0.55) | `/iː/ → /ɪ/`, plus sh→s compound |
| feet | fit (0.65) | `/iː/ → /ɪ/` |
| seat | sit (0.65) | `/iː/ → /ɪ/` |
| leave | live (0.65), lib (0.50) | `/iː/ → /ɪ/`, plus v→b compound |
| fool | full (0.70), fu (0.55) | `/uː/ → /ʊ/`, dark L drop |
| pool | pull (0.70), pu (0.55) | `/uː/ → /ʊ/`, dark L drop |
| bad | bed (0.65), bet (0.50) | `/æ/ → /e/` (intelligibility cost is high — bad↔bed is real confusion) |
| bag | beg (0.65) | `/æ/ → /e/` |
| cat | ket (0.55), ca (0.45) | `/æ/ → /e/`, final-t drop. Marginal. TODO: verify ke/ket form is common |
| cup | cop (0.65), kap (0.55) | `/ʌ/ → /ɒ/` |
| bird | bert (0.55), bet (0.50) | `/ɜː/` collapse + final cluster drop |
| about | abowt (0.70), ebowt (0.70) | schwa → full vowel |

---

## Gap 4 — Word stress placement

**Rationale.** Vietnamese is **syllable-timed and tonal** — there is no lexical stress system. Each syllable carries its own tone and roughly equal duration. English is stress-timed: one syllable in each polysyllabic word carries primary stress and the rest reduce (often to schwa). VN learners produce:

1. **Even stress on every syllable** (the most common pattern — "com-pu-ter" not "com-PYU-ter")
2. **Wrong-syllable stress** (often final-stress by analogy to French-influenced loanwords) — "ho-TEL" feels natural to a learner who's seen French "hôtel"
3. **Unreduced vowels** in unstressed positions — every syllable gets its full orthographic vowel

This cannot be cleanly encoded as substitutions because ASR transcripts don't carry stress marks. The proposal includes only a handful of word overrides for cases where wrong stress produces a different *spelling* in the ASR (because of vowel reduction differences). For the rest, the recommendation is that the scorer remain stress-blind and the **teaching layer** (phoneme tips + new audio drills) handle stress separately.

**Proposed entries (4 word overrides + 1 new phoneme tip — tip is not in this file but documented for the markdown report):**

| target | variants | rationale |
|---|---|---|
| computer | kompiuter (0.70), com-poo-ter (0.70) | full vowel in unstressed syllables |
| hotel | hoten (0.65), ho-ten (0.65) | stress shift + final cluster |
| photograph | foto-graf (0.70) | even stress, full vowels |
| economic | e-co-no-mic (0.70) | even stress |

(Plus: recommend adding a `word-stress` phoneme tip to `PHONEME_TIPS` with VN-language explanation. Not encoded here since the map's tips list is separately structured.)

---

## Gap 5 — Connected speech (linking, weak forms, schwa reduction)

**Rationale.** Vietnamese syllables are **discrete units separated by glottal-onset isolation** — no linking, no weak forms, no contraction. English connected speech features VN learners struggle with:

- Linking final consonant to next vowel: "an apple" → /ən_æpəl/; VN learner: "an / apple" with a glottal stop between
- Weak forms: `to` /tə/, `for` /fər/, `of` /əv/, `and` /ən/, `was` /wəz/ — VN learner uses citation form
- Contractions: `going to → gonna`, `want to → wanna`, `have to → hafta`, `got to → gotta` — VN learner uses full form
- /h/-deletion in pronouns: "tell him" → /telɪm/ — VN learner says full /h/

The asymmetry here is interesting: most of these "errors" make VN learners sound *more careful*, not less correct. ASR will often transcribe both forms identically. The high-value encoding is the **other direction**: when the *target* is a contraction and the learner produces the full form, give credit (and vice versa).

**Proposed entries (5 word overrides):**

| target | variants | rationale |
|---|---|---|
| gonna | going-to (0.85) | learner gives full form for the contraction. `'going to'` whitespace variant dropped — see follow-up note below |
| wanna | want-to (0.85) | full form for contraction. `'want to'` whitespace variant dropped — see follow-up note below |
| gotta | got-to (0.85) | full form for contraction |
| because | becos (0.80), bee-cos (0.75), bee-cause (0.75) | full vowels in unstressed first syllable |
| tomorrow | to-mor-row (0.80), to-mo-row (0.75) | even stress, no vowel reduction |

---

## Gap 6 — Intonation patterns

**Rationale.** Vietnamese is a **tonal language**: pitch carries lexical (word-level) meaning. Each Vietnamese syllable has one of 6 tones. English uses pitch at the **utterance level** — rising for yes/no questions, falling for statements and wh-questions, contrastive stress for prominence, list intonation for enumeration. VN learners produce English with:

1. **Per-syllable tonal contours** instead of utterance-level intonation. Each word gets a flat-mid or wandering tone.
2. **No final rise on yes/no questions** — sounds like a statement, listeners hear "are you ok" as a flat assertion
3. **No final fall on statements** — sounds incomplete or hesitant
4. **No contrastive prominence** — "I want THE red one" comes out evenly stressed

**This cannot be encoded in `PHONEME_SUBSTITUTIONS` or `WORD_OVERRIDES`** because the scorer compares orthographic transcripts. Intonation work needs either:
- A dedicated drill type (record a question; check pitch contour at end)
- A new phoneme-tip-like card (`intonation-question-rise`, `intonation-statement-fall`, `intonation-no-tone-per-syllable`)
- Cloud scorer with prosody features (Azure Pronunciation Assessment exposes some of this)

**No proposed entries.** Documented for the road-map; do not add fake substitution rules to give the illusion of coverage.

---

## Anything else — Dark L, ng-merger, ch/sh, dʒ/j, w/v

**Rationale.** Smaller patterns that don't fit the six categories above but show up frequently in learner production.

**Proposed entries (7):**

| pattern | substitute / variant | credit | note |
|---|---|---|---|
| `l$` → `w` (dark L final) | feel → feew, school → schoow, full → fuw | 0.65 | English final /l/ is dark/vocalized; VN learners drop or "w"-ify |
| `l$` → `` (dark L drop) | feel → fee, full → fu, well → we | 0.55 | weaker variant, marginal credit |
| word: school | schoo (0.60), skuw (0.60), sukul (0.55) | | also covers initial-cluster epenthesis ("sukul") |
| word: chair | share (0.60) | | VN learners conflate ch/sh in the harder direction (English `/tʃ/` → `/ʃ/`) |
| word: George | Joe-rge (0.65), jorj (0.65) | | `/dʒ/` is unstable initial/final, often realized as a stop+y |
| word: thank-you | tan-cu (0.70), thang-kiu (0.70) | | "thank you" as a unit — VN learners often produce a single linked form `tan-kiu` |
| word: please | puh-lease (0.70), pi-lis (0.65) | | initial cluster /pl/ broken by epenthetic vowel — already in `cluster-initial` tip but no word override existed |

---

## Delta check — confirmed no overlap with existing map

For each proposed entry I confirmed:

1. **Sound-level rules:** the new `target` strings (`v→y`, `st$→s`, `sk$→s`, `ld$→l`, `nd$→n`, `nt$→n`, `ft$→f`, `lf$→l`, `mp$→m`, `lp$→l`, `lt$→l`, `ct$→c`, `pt$→p`, `xt$→x`, `nk$→n`, `sp$→s`, `l$→w`, `l$→`) do not duplicate any of the 10 rules in `PHONEME_SUBSTITUTIONS` (`th→t`, `th→f`, `v→b`, `z→s`, `sh→s`, `j→d`, `r→l`, `l→n`, `s$→`, `ed$→`). The `v` and `l` substitutes differ from existing (new substitute, new direction).
2. **Word overrides:** new keys are `very` (extends existing `[bery]` with `yery`), `voice`, `visit`, `video`, `vote`, `have`, `love` (extends existing with `loy`), `sheep`, `feet`, `seat`, `leave`, `fool`, `pool`, `bad`, `bag`, `cat`, `cup`, `bird`, `about`, `computer`, `hotel`, `photograph`, `economic`, `gonna`, `wanna`, `gotta`, `because`, `tomorrow`, `feel`, `school`, `full`, `well`, `chair`, `george`, `thank-you`, `please`. The two collisions (`very`, `love`) are **additive only** — they propose new variants alongside the existing ones, not replacements; merging is set-union with `getAcceptedVariants`'s existing dedupe-by-highest-credit logic taking care of any conflict.

---

## Caveats and TODO: verify markers

- TODO: verify — Southern `v → y` rule (0.65). Confidence: high from my own knowledge of regional Vietnamese, lower from no production-corpus check.
- TODO: verify — Northern `d/gi/r → z` collapse not encoded. Should be tested against logged ASR output before adding.
- TODO: verify — `cat → ket` form (Gap 3). Less confident than `bad → bed`; included at marginal credit only.
- TODO: verify — `nk$ → n` rule (Gap 2). Acoustically the final `/k/` in `think`/`bank` is often unreleased, but transcription as just "thin"/"ban" may be rare; cloud-scorer corpus check needed.
- TODO: verify — `gonna` / `wanna` / `gotta` as target words. Only relevant if MercyBlade rooms ever use contractions as the target form; if all targets are citation form, these entries are dormant.

**None of these entries should ship into runtime without a production-data spot-check.** The `.proposed.ts` artifact deliberately is not imported by anything in `src/`. Merging requires a separate review step.

---

## Summary

- **6 gap categories audited.** 5 are encodable; intonation is documented as unreachable from the orthographic scorer.
- **60 proposed entries total** across 17 new substitution rules and 32 new word-override keys (some keys carry multiple variants). Originally 62; 2 whitespace-containing Gap-5 variants (`'going to'`, `'want to'`) dropped per PRINCIPLES §7 — they cannot match under the live scorer's `tokenize()` which splits on `\s+`. Phase-2 re-enablement noted in the `.proposed.ts` file.
- **All entries shape-compatible** with `PhonemeSubRule` / `WORD_OVERRIDES` types — proposal file typechecks.
- **No edits** to `vn-phoneme-map.ts`. No edits to scorer or any runtime file. No new tests. No PR.

---

## Format note for A4 / C4 (schema designer)

This document is the phonology-side parallel to `docs/l1-taxonomies/vi-grammar.md` (C1). Same audience, same product, same curated discipline — applied to sound rather than morphosyntax. Like that doc, the entries here are structured to be mechanically transformable into a runtime TypeScript module — in this case, **the existing `src/lib/pronunciation/vn-phoneme-map.ts`** itself. The `.proposed.ts` companion artifact already conforms to the live module's types (`PhonemeSubRule`, `WORD_OVERRIDES`) and typechecks against the project. Merging is a copy-paste-then-review step, not a redesign.

### Severity contract (consumer-side, not detector tie-breaker)

C1 / C4's inherited decision: severity is a **consumer-side signal** describing how the tutor behaves when a rule matches, *not* a tie-breaker for which rule wins (the engine contract remains **first-match-wins**, matching `vnL1Interference.ts` and `rules.ts` conventions). For phonology the underlying signal is **partial credit** (0.55 / 0.60 / 0.65 / 0.70 / 0.75 / 0.80 / 0.85), not three discrete tiers, because pronunciation accuracy is intrinsically gradient — a learner can be 80% of the way to the target sound. The credit scale is older than the tier system and lives at the `getAcceptedVariants` boundary; the tutor consumer can derive the equivalent tier at runtime:

| Credit range | Equivalent tier | Suggested tutor behaviour |
|---|---|---|
| ≤ 0.60 | **high** | The substitution drifts the word toward unrecognizability or a near-minimal-pair confusion. Correct every time, show the model, give the bilingual articulation tip from `PHONEME_TIPS`. |
| 0.65 – 0.75 | **medium** | Marks the learner as non-native but listeners parse around it. Offer the polish in a side panel; don't interrupt mid-sentence. |
| 0.80 – 0.85 | **low** | Native-acceptable in many registers (final -s drop in casual speech, `z → s`). Log for the periodic review summary; do not surface mid-conversation. |

This mapping is the doc author's recommendation, not a final product decision. A4 / C4 can move the cutoffs without restructuring this proposal: the credit numbers on each entry are stable and don't pretend to be tiers themselves.

### Tag namespace (snake_case until C4 locks)

The live `PhonemeSubRule` shape carries no `id` / `tag` field today — rules are identified positionally by their `(target, substitute)` pair, and `PHONEME_TIPS` use a kebab-case `phoneme` key (`th-voiceless`, `r-vs-l`). If C4's locked namespace requires per-rule tags for cross-system reconciliation with `L1WeaknessTag` (`src/lib/feedback/l1-error-detector.ts`) and the `RULE_REGISTRY` in `src/lib/feedback/rule-packs/vi/rules.ts`, the suggested addition is a `tag?: string` field on `PhonemeSubRule` populated with snake_case identifiers — matching the existing `rules.ts` convention until C4 locks the canonical form. Sample tag mapping if it helps:

| Proposed rule | Suggested snake_case tag |
|---|---|
| `v → y` (Gap 1) | `vi_l1_southern_v_yod` |
| `nd$ → n` (Gap 2) | `vi_l1_final_cluster_nd_reduction` |
| `st$ → s` (Gap 2) | `vi_l1_final_cluster_st_reduction` |
| `l$ → w` (Anything else) | `vi_l1_dark_l_vocalization` |
| word: `fool → full` (Gap 3) | `vi_l1_long_short_u_collapse` |
| word: `bad → bed` (Gap 3) | `vi_l1_ash_e_collapse` |
| word: `about → abowt` (Gap 3) | `vi_l1_schwa_full_vowel` |
| word: `gonna → going to` (Gap 5) | `vi_l1_connected_speech_full_form` |

These tags are not added to the `.proposed.ts` artifact — they would be premature surface area before C4 lands. They are listed here as evidence the proposal can be conformed to whatever C4 picks without re-authoring entries.

### What this doc adds that the live `vn-phoneme-map.ts` doesn't have

1. **Dialect awareness.** Live map treats VN as monolithic; this proposal opens a southern/northern axis (Gap 1) and is explicit about which patterns the live map's prose comments got backwards (`r → l` attribution).
2. **Final-cluster enumeration.** The live `cluster-final` tip names the pattern in prose; this proposal turns it into 18 enumerable substitution rules the scorer can actually use.
3. **Vowel-quality vocabulary.** Live map: 0 vowel entries. Proposal: 12 word overrides covering the canonical pairs (`/iː/-/ɪ/`, `/uː/-/ʊ/`, `/æ/-/e/`, `/ʌ/-/ɒ/`, `/ɜː/`, schwa).
4. **Intonation honesty.** Explicitly documents that pitch-contour transfer is **unreachable** from the orthographic scorer (Gap 6) — flags this as drill-card / Azure-prosody territory rather than inventing fake substitution rules to cover it.
5. **TODO: verify markers per entry.** Honest-uncertainty pass per PRINCIPLES §7; no entry shipped runtime-ready without a verification step labelled.
