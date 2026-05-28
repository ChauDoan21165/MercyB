# Phase-2 audit — `src/components/mercy-guide/MercySuggestTab.tsx`

**Surface:** the Suggest tab inside the Mercy Guide panel — a
short scrollable list of "Recommended for you" items (rooms,
paths, etc.) the learner can navigate into. Each item carries
its own bilingual title + reason (data layer); the tab CHROME
around the list is the audit subject.

**Priority:** **YES** — named in `docs/copy/bilingual-audit.md`
§281 as part of the `mercy-guide/` top-priority directory. Listed
for batch-4 (Phase-2 #7) in the !89 still-pending-list. This is
the smallest mercy-guide member (~65 lines).

**Scope special note — CC2 kids-mode lane:** zero kids
references in this file (`grep` confirmed). No kids paths to skip.

**Scope:** every user-facing string. The per-item data fields
(`title_en` / `title_vi` / `reason_en` / `reason_vi`) come from
`@/services/suggestions` and are bilingual at the data layer —
out of scope for the chrome audit. The tab itself ships **3
chrome strings**, all EN-only.

**Method:** verdict column per `docs/copy/bilingual-audit.md`
§Method.

**Conclusion:** **0/3 OK + 3 revision candidates** — the entire
chrome surface is EN-only on a Mercy-conversational tab. The
heading, the empty-state copy, and the per-item navigation
button are all EN-only inside a panel whose other tabs
(`UnifiedMercyChat.tsx`, `MercyTeacherTab.tsx`,
`MercySpeakTab.tsx`, `MercyEnglishTab.tsx`) all carry bilingual
or VI-primary chrome. This is the most consistent
bilingual-contract gap in the mercy-guide directory.

---

## Catalog

| Loc | VI | EN | Verdict | Proposed revision |
|---|---|---|---|---|
| 24 (heading) | — (no VI companion) | `Recommended for you` | **awkward — EN-only on a Mercy-conversational tab** | The mercy-guide sibling pattern (per !65's `UnifiedMercyChat.tsx` audit) uses the `em` warm-elder-sister register on conversational headings. Natural VI: `Gợi ý cho em` (uses `em` to align with `UnifiedMercyChat.tsx`'s register). Wrap as a bilingual heading via the surrounding sibling pattern (inline `<span>` muted-sub or VI · EN composite). |
| 29 (empty state) | — (no VI companion) | `No suggestions yet. Explore some rooms first!` | **awkward — EN-only empty state on a learner-facing surface.** The exclamation mark plus "Explore some rooms first!" reads as a school-teacher imperative; the mercy-guide voice canon (per `MercySpeakTab.tsx`'s recognition-error envelope at lines 422–438, audit !42) is action-led + kindness-framed. | VI candidate: `Chưa có gợi ý nào. Em vào vài phòng trước nhé.` ("No suggestions yet. Go into a few rooms first, [particle].") — uses `em` + the `nhé` particle to warm the imperative, matching the `MercySpeakTab.tsx:1125` revision pattern that dropped the bare `Hãy` imperative in `!48`. |
| 56 (button label, 2 states) | — (no VI companion) | `Go to path` / `Go to room` | **awkward — EN-only nav CTA**. Per-item the data already carries `title_vi`, but the action button is EN-only. | VI candidate: `Vào lộ trình` / `Vào phòng học` (mirrors EN cleanly; `Vào` is the natural VI for "enter/go to" — same verb the kids-card on `MercyGuidePanel.tsx` uses with `Vào Mercy Kids`, and the !58 cross-file alignment with `BillingSuccessPage:231`'s `Vào phòng học`). Render as VI · EN inline composite or as a bilingual two-line button. |

---

## Cross-cutting observations

1. **The entire chrome surface is EN-only** on a Mercy-
   conversational tab where every other sibling tab carries
   bilingual chrome. This is the cleanest single-file bilingual-
   contract gap audited to date — 3 strings, 3 revisions, all in
   one ~65-line file.
2. **Em-pronoun thesis (per !65 UnifiedMercyChat audit):**
   strengthens. The natural VI translations of all 3 chrome
   strings reach for `em` (younger-sibling pronoun) rather than
   `bạn` (second-person). This is the third mercy-guide file
   where the thesis applies cleanly (`UnifiedMercyChat.tsx`
   confirmed; `MercyEnglishTab.tsx` partially confirmed via
   line 163's `phòng này` framing; `MercySuggestTab.tsx`
   confirmed prospectively via the proposed revisions).
3. **Cross-file vocabulary alignment:** the proposed `Vào phòng
   học` for the "Go to room" button intentionally mirrors:
   - `MercyGuidePanel.tsx:109` `Vào Mercy Kids` (out-of-scope
     kids card, but uses the same `Vào` verb).
   - `BillingSuccessPage.tsx:231` `Vào phòng học` (shipped
     bilingual today).
   - `Pricing.tsx:647` `phòng học premium` (audited !65,
     revisions !89).
   "Vào phòng học" is becoming the codebase-wide canonical VI
   for "go to room"; the suggestion is to use that wording.
4. **No shame triggers.** No `kém / tệ / sai / điểm số / hạng`
   in this file. No countdown patterns.
5. **Per-item data fields** (`title_vi`, `reason_vi`) prove the
   data layer is bilingual; only the chrome is EN-only.
   Whoever last touched `@/services/suggestions` clearly knew
   the surface needed both languages — the chrome inconsistency
   looks like an oversight, not a deliberate choice.
6. **All 3 fixes are mechanical** — no Plan-type-extension or
   render-restructure required, unlike `Pricing.tsx`'s bullets
   in !89. Pure copy edits. Suitable for a follow-up
   "non-optional revisions" sweep.

## References

- `docs/copy/bilingual-audit.md` §281 (mercy-guide/ top-priority
  entry).
- `docs/copy/vi-style-guide.md` §1 (pronoun register — `em` for
  Mercy-conversational surfaces per the !65 thesis), §2 (bilingual
  pairing — VI must dominate).
- `docs/copy/audits/UnifiedMercyChat.tsx.md` — sibling audit;
  source of the `em` thesis.
- `docs/copy/audits/MercySpeakTab.tsx.md` — sibling audit; the
  recognition-error envelope at lines 422–438 is the no-shame
  voice exemplar the empty-state revision (29) mirrors.
- `docs/copy/audits/MercyEnglishTab.tsx.md` — sibling audit;
  `phòng này` (line 163) is the cross-file `room → phòng`
  precedent.
- `src/services/suggestions.ts` — the `SuggestedItem` type
  (carries the bilingual data the chrome wraps).
- `src/components/mercy-guide/MercyEnglishTab.tsx:163`,
  `src/components/mercy-guide/MercyGuidePanel.tsx:109`,
  `src/pages/BillingSuccessPage.tsx:231`,
  `src/screens/Pricing.tsx:647` — cross-file `Vào …` /
  `phòng học` precedents.
