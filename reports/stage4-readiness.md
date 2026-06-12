# Stage-4 Corpus Promotion — Readiness Definition

**Date:** 2026-06-12
**Author:** A4 (pool)
**Status:** DEFINED — ready for CEO-1 dispatch after wave-19 review queue lands

## What Stage-4 is

Stage-4 is the next promotion tier after Stage-3: promote the remaining **high-frequency** Step-11 Vietlish review candidates that are still only in pending guard files and not wired into `VIETLISH_CORPUS`.

Stage-3 was fully defined as the low-frequency tail of the earlier promotion batch, and current `origin/main` already contains both Stage-3A and Stage-3B. The remaining unpromoted inventory is therefore the pending-review queue from waves 1-18 after dedupe against live corpus.

## Inventory baseline

Baseline: current `origin/main` before wave 19.

| Frequency | Remaining count |
|-----------|-----------------|
| high | 700 |
| medium | 1,088 |
| low | 171 |
| **TOTAL** | **1,959** |

Stage-4 scope is the **700 high-frequency** entries only.

| Category | High-frequency count |
|----------|----------------------|
| collocation | 142 |
| literal_translation | 160 |
| word_order | 135 |
| false_friend | 114 |
| calque | 92 |
| register | 57 |
| **TOTAL** | **700** |

## Recommended slicing

Keep the Stage-2/Stage-3 review discipline: small, serial, deduped slices with focused guard output.

| Slice | Target size | Suggested contents |
|-------|-------------|--------------------|
| 4A | 150 | high literal_translation first tranche |
| 4B | 150 | remaining high literal_translation + collocation |
| 4C | 150 | remaining high collocation + word_order |
| 4D | 150 | remaining high word_order + false_friend |
| 4E | 100 | remaining high false_friend + calque + register |

Exact category boundaries can move if dedupe or QA removes entries, but each MR should stay at or below 150 promotions unless CEO-1 explicitly authorizes a larger slice.

## QA gates

Each Stage-4 promotion MR must include:

1. Dedupe against live `VIETLISH_CORPUS`, all unmerged promotion branches, and all pending guard files.
2. No duplicate `vietlish` strings after promotion, case-insensitive and whitespace-normalized.
3. Schema parity with `VietlishCorpusEntry`: `vietlish`, `natural`, `sourcePattern`, `category`, `frequency`, `context`.
4. Full Vietnamese diacritics in any Vietnamese-language `sourcePattern` explanation.
5. Word-order entries get the same terminal-question review used for Stage-2D.
6. Guard tests for the promoted slice plus the existing Vietlish logic tests.
7. `npm run typecheck:ci`, `git diff --check`, and guarded-literal scan clean.

## Wave interaction

Wave 19 is a review queue expansion, not part of this Stage-4 inventory baseline. After wave 19 merges, Stage-4 dispatch should either keep the 700-entry baseline above for a stable promotion campaign or explicitly recalculate and decide whether any wave-19 high-frequency entries should be deferred to Stage-5.

**READY TO START:** YES, after CEO-1 dispatch and a fresh branch from current `origin/main`.
