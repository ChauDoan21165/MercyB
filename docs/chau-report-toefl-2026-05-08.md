# Chau Report from Tui5
**Date:** 2026-05-08
**Topic:** TOEFL iBT Foundation Planning — Architecture & Scaffolding

---

## Summary

TOEFL iBT architecture designed and minimal scaffolding created. Typecheck and build both pass. No full system built yet — this is the blueprint and placeholder layer only.

---

## 1. Architecture Design

**Test format:** TOEFL iBT Enhanced (post-July 2023, <2 hours)

| Section | Duration | Items | Scoring |
|---|---|---|---|
| Reading | 35 min | 2 passages × 10 questions | 0–30 |
| Listening | 36 min | 3 lectures + 2 conversations | 0–30 |
| Speaking | 16 min | 4 tasks (1 independent + 3 integrated) | 0–30 |
| Writing | 29 min | 2 tasks (Integrated + Academic Discussion) | 0–30 |
| **Total** | **~116 min** | **54 questions/tasks** | **0–120** |

**Data model** mirrors IELTS/TOEIC patterns:
- `TOEFLSection[]` — section-level metadata (name, timing, question count)
- `TOEFL_READING_PASSAGES[]`, `TOEFL_LISTENING_ITEMS[]`, `TOEFL_SPEAKING_TASKS[]`, `TOEFL_WRITING_TASKS[]` — per-skill sub-structures
- `TOEFLScoreBand[]` — CEFR mapping with Vietnamese descriptions
- `estimateReadingScaled()`, `estimateListeningScaled()` — raw→scaled lookup tables
- `estimateTOEFLScore()` — full estimator function (ready, not wired to UI yet)

**Routing:**
```
/exam/toefl              ← ACTIVE (overview grid)
/exam/toefl/reading      ← TODO
/exam/toefl/listening    ← TODO
/exam/toefl/speaking     ← TODO
/exam/toefl/writing      ← TODO
/exam/toefl/estimator    ← TODO
```
Auth-gated at route level (`RequireAuth`). Premium gate is in-page (pass-through for now).

---

## 2. Files Added (7 new, 1 modified)

```
NEW:
  src/data/exam-prep/toefl/structure.ts          (253 lines)
  src/data/exam-prep/toefl/score-bands.ts        (213 lines)
  src/data/exam-prep/toefl/__tests__/            (empty dir)
  src/components/exam-prep/toefl/TOEFLCopy.ts    (80 lines)
  src/components/exam-prep/toefl/TOEFLOverview.tsx (103 lines)
  src/components/exam-prep/toefl/PremiumGate.tsx (43 lines)
  src/components/exam-prep/toefl/__tests__/      (empty dir)
  src/pages/exam-prep/TOEFLIndexPage.tsx         (38 lines)

MODIFIED:
  src/router/AppRouter.tsx                       (+1 import, +1 route)
```

Bundle impact: **3.83 kB** (1.63 kB gzipped) — lazy-loaded, zero impact on initial load.

---

## 3. Reuse Strategy

Everything follows the existing IELTS/TOEIC patterns exactly:

| Component | Reused From | Status |
|---|---|---|
| Section grid + overview cards | `IELTSOverview` | Built |
| Bilingual copy shape | `ieltsCopy.ts` | Built |
| Premium gate pattern | `IELTS PremiumGate` | Built (pass-through) |
| Audio pipeline (ElevenLabs) | IELTS listening | Ready for Phase 2 |
| Countdown timer | IELTS speaking | Ready for Phase 2 |
| Writing editor + scoring | IELTS writing | Ready for Phase 2 |
| Reading passage + questions | IELTS reading | Ready for Phase 2 |

---

## 4. Recommended Build Order

1. **TOEFL Listening** — highest reuse. Data shape identical to IELTS. Ship 5 audio items with existing pipeline.
2. **TOEFL Reading** — straightforward passage + question UI.
3. **TOEFL Writing** — the Academic Discussion task (Task 2) is unique to TOEFL — good differentiator.
4. **TOEFL Speaking** — 4 tasks with prep/speak timers.
5. **TOEFL Estimator** — function ready, needs form UI.
6. **SEO content pack** (`/exam-prep/toefl/*`) — open marketing surface.

---

## 5. What Was NOT Done

- No practice datasets (no passages, no audio, no question banks)
- No per-skill pages beyond the index
- No estimator UI
- No content pack routes
- No full TOEFL system

All TODO markers are tagged `TODO(TOEFL):` for easy grepping.

---

## 6. Verification

```
npm run typecheck   ✅ PASS (0 errors)
npm run build       ✅ PASS (10.5s)
```
