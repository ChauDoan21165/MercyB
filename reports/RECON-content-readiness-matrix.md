# RECON — Content-Readiness Matrix (native × target learning pairs)

**Date:** 2026-05-17
**Source:** Content-readiness recon was run in a separate dispatch and **delivered to Chau as a chat message only** — it was never written to the repo (verified absent from `origin/main`, every remote branch, all merged PRs, and disk on 2026-05-17). This file is the canonical written record, authored into PR 1 of the Duolingo-onboarding build by the `duolingo-onboarding-build-agent` so the build's input is documented and auditable.
**Status:** **CANONICAL for the Duolingo-onboarding build.** Chau ruled this matrix and the 5 decisions below canonical and instructed the build to proceed off it.
**Discipline:** locked #14 (Chau's strategic call — ruled canonical), #15 (input documented so onboarding never promises an empty pair), #7 (limited pairs ship honestly badged, not as full A1–C2).

---

## §1 — The matrix

Two native languages × eight target languages (STRATEGY.md v3.0 §4 — "2 native × 8 target, up to 16 learning pairs"). A cell is the `(native, target)` pair a learner picks in onboarding.

| native ↓ \ target → | en | ja | ko | zh | fr | de | es | vi |
|---|---|---|---|---|---|---|---|---|
| **vi** | 🟢 | 🟢 | 🟡 | 🟠 | 🟢 | 🟢 | ⚪ | — |
| **en** | — | 🟡 | 🟡 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 |

**Tally:** 8 🟢 · 4 🟡 · 1 🟠 · 1 ⚪ · 0 🔴.

### Legend — and what each verdict means for onboarding (locked #7)

| Mark | Meaning | Onboarding behavior |
|---|---|---|
| 🟢 **FULL** | A1–C2 content present and usable for that native's pedagogy | Offer plainly, no badge |
| 🟡 **PARTIAL** | Built but incomplete depth for that native (some levels thin / VI-pedagogy gaps) | Offer **with a "limited content" badge** — do not promise full A1–C2 |
| 🟠 **SKELETAL** | Only a sub-range is usable for that native | Offer **with an explicit level-range badge** (see decision 1) |
| ⚪ **EXCLUDED** | Built, but offering it for that native would violate a non-negotiable | **Not shown** in that native's target menu (see decision 2) |
| 🔴 | Not built | Not shown |
| — | N/A — you can't learn your own native language | Not shown |

---

## §2 — Per-pair verdict + evidence

Evidence cross-checked against `RECON-duolingo-onboarding-recon.md` §2 (verified-against-code) and STRATEGY.md v3.0 §6 (verified content inventory: KO/JA/ZH/FR/DE/ES = 862 A1–C2 lessons; Vietnamese-for-foreigners = 536; Spanish = 109).

### Vietnamese-native (`native = vi`) — the ~95% home market

| Pair | Mark | Evidence / caveat |
|---|---|---|
| **(vi, en)** | 🟢 | **PRIMARY, deepest.** Not in `src/languages/`; delivered via ~486 `public/data/*.json` rooms + IELTS/TOEIC/VSTEP exam tracks + Teacher Mercy. The mission corpus. **This pair's home is the existing home page, unchanged (locked #14).** |
| **(vi, ja)** | 🟢 | Full A1–C2; VI-first pedagogy fresh (cultural_notes_vi / tip_advice_vi / pronunciation_focus authored A2 #548, B1 #551, B2 #555/#567). **Decision 4: ships 🟢 confirmed.** |
| **(vi, ko)** | 🟡 | Full A1–C2 skeleton; ID-collision + Storage rekey resolved 2026-05-17 ([[project_korean_lesson_id_collision]]); Phase-2 RR/C2 authoring debt deferred ([[project_korean_phase2_debt]]). Ship with limited-content badge. |
| **(vi, zh)** | 🟠 | **A2/B1 missing VI pedagogy.** Decision 1: show with a **"B2–C2 only for now"** badge — do **not** hide. |
| **(vi, fr)** | 🟢 | Full A1–C2; `example_en` audited clean 2026-05-16 (0/337 deviant, #510/#502) ([[project_french_example_en_clean]]). |
| **(vi, de)** | 🟢 | Full A1–C2; one minor known defect (German #511 §10 French-absent) — non-blocking. |
| **(vi, es)** | ⚪ | **EXCLUDED from the vi-native menu.** `src/languages/spanish/*` is hardcoded English→Spanish (`SpanishLessonsPage` carries explicit `nativeLanguage="en"`). Serving it to a vi-native user renders English pedagogy → violates non-negotiable #1 (Vietnamese-first). Decision 2. |
| (vi, vi) | — | N/A. |

### English-native (`native = en`) — the ~5% built-and-maintained side (GREENLIT, decision 3)

| Pair | Mark | Evidence / caveat |
|---|---|---|
| (en, en) | — | N/A. |
| **(en, ja)** | 🟡 | JA tracks are VI-first authored; usable for en-native but VI-pedagogy fields don't serve an en-native user → partial for this native. Badge. |
| **(en, ko)** | 🟡 | Same as (en, ja): built, VI-first authored, partial for en-native pedagogy. Badge. |
| **(en, zh)** | 🟢 | Full for en-native. |
| **(en, fr)** | 🟢 | Full for en-native. |
| **(en, de)** | 🟢 | Full for en-native. |
| **(en, es)** | 🟢 | **The Spanish track's true pair.** `nativeLanguage="en"`, 109 lessons (`SPANISH_TOTAL_LESSONS`), A1–C2. |
| **(en, vi)** | 🟡 | Vietnamese-for-foreigners. `src/languages/vietnamese/*`, 536 lessons (`VIETNAMESE_TOTAL_LESSONS`); page surfaces A1/B1/B2, A2/C1/C2 authored-but-hidden by the page selector. Partial → badge. |

---

## §3 — Chau's decisions (canonical for this build)

1. **Chinese A2/B1 missing VI** → show `(vi, zh)` **with a "B2–C2 only for now" badge**; do **not** hide it.
2. **Spanish excluded from the vi-native target menu** — `src/languages/spanish/*` is hardcoded EN-native; offering it to a vi-native user would violate non-negotiable #1. `(en, es)` is unaffected (its true pair).
3. **en-native onboarding GREENLIT** — STRATEGY.md v3.0 §4 makes MercyBlade a matrix product; en-native is *served*, not gated. Onboarding Screen 1 shows both 🇻🇳 Tiếng Việt and 🇬🇧 English as native options.
4. **`(vi, ja)` ships as 🟢** — confirmed full, no badge.
5. **Stale lesson-count meta** (store `LANGUAGES` says vietnamese 47 / spanish 110; canonical `*_TOTAL_LESSONS` constants say 536 / 109) — **fixed in this same build (PR 3), not deferred to a separate dispatch.**

---

## §4 — How onboarding consumes this matrix

- **Native menu (Screen 1):** `vi`, `en` — both (decision 3).
- **Target menu (Screen 2), filtered by chosen native:**
  - `native = vi` → `en` (🟢, default-recommended), `ja` (🟢), `fr` (🟢), `de` (🟢), `ko` (🟡 badge), `zh` (🟠 "B2–C2 only for now" badge). **`es` excluded** (decision 2).
  - `native = en` → `zh` (🟢), `fr` (🟢), `de` (🟢), `es` (🟢), `ja` (🟡 badge), `ko` (🟡 badge), `vi` (🟡 badge).
- **Skip default (recommended pair):** `native = vi` → `[en]`; `native = en` → `[es]` (its highest-readiness 🟢 with native-correct pedagogy).
- **Badge copy** is honest per locked #7 — 🟡 = "limited content", 🟠 `(vi,zh)` = "B2–C2 only for now". Never promise full A1–C2 for a non-🟢 cell.

*End of matrix recon. This file is the documented, canonical input for the Duolingo-onboarding build (PRs 1–3). No code or strategy changed by this file.*
