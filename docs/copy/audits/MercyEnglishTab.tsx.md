# Phase-2 audit — `src/components/mercy-guide/MercyEnglishTab.tsx`

**Surface:** the English-helper tab inside `MercyGuidePanel` — where
Mercy unfolds simple-English vocab + example sentences from the
current room's content. Companion to `MercySpeakTab` (audited in
`!42`) and `MercyTeacherTab` (kids-mode, owned by CC2's lane).

**Priority:** chosen as the **non-kids substitute** for
`MercyTeacherTab.tsx` (which imports `kidsDataLoader` and carries
`isKidsMode` + kids image paths — out of scope per CC2's lane).
Sits in the same `mercy-guide/` top-priority directory called out
in `docs/copy/bilingual-audit.md` §281.

**Scope:** every user-facing string. ~12 distinct surfaces — three
VI strings + nine EN-only surfaces. This tab is **English-immersive
by design** — the target language is the dominant surface so the
learner reads English on the help tab; VI appears as subtitle where
comprehension support is needed.

**Method:** verdict column per `docs/copy/bilingual-audit.md` §Method.
Adds a *register* column to mark "EN-immersive by design" surfaces
where a VI companion is optional, not required.

**Conclusion:** **2/3 VI strings OK + 1 revision candidate** (`room`
untranslated on line 59, inconsistent with `phòng này` on line 163
within the same file). Plus a design-question observation about
several EN-only chrome surfaces — flagged but not classified as
defects, since the immersive-English register is the tab's
pedagogical intent.

---

## Catalog

### VI subtitles + bilingual lines

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 59 (no-context state, VI subtitle) | `Mở một room để học từ vựng và câu mẫu từ chính nội dung đó.` | `Open a room to learn vocabulary and example sentences from that lesson.` (line 55–57) | **awkward** — `room` left untranslated. The file uses `phòng này` ("this room") at line 163 — natural VI for the same concept. The untranslated `room` here is `vi-style-guide.md` §3 "half-translated UI element" anti-pattern, AND it's internally inconsistent with line 163. The audit notes that "room" is sometimes treated as the app's internal codename, but the rest of the codebase uses `phòng` for user-facing copy (see `Tiers.tsx` section headings + the room JSON titles). | `Mở một phòng học để học từ vựng và câu mẫu từ chính nội dung đó.` (uses `phòng học` — natural VI, and aligns with line 163's `phòng này`) |
| 163 (CTA caption) | `Dạy mình tiếng Anh đơn giản từ phòng này` | `Teach me simple English from this room` (line 158) | **OK** — `mình` here is the user-voice form ("teach **me**"), which is acceptable casual Vietnamese self-reference. Uses `phòng này` correctly. This line is the model the line-59 fix should imitate. | — |
| 215–217 (post-result footer, inline bilingual) | `Bạn có thể quay lại luyện tiếp lúc khác.` | `You can come back and practice again.` (inline, EN-first with ` / ` separator) | **OK** copy / **note on ordering** — VI half is natural ("You can come back and practice some other time"). The EN-first ordering on this single line is inconsistent with the `MercySpeakTab.tsx` recognition-error envelope convention (VI first). Acceptable as a tail-of-result line where the EN reads as the primary "you did it" note and the VI as supportive subtitle; not a defect. | (optional) `Bạn có thể quay lại luyện tiếp lúc khác. / You can come back and practice again.` (VI first) |

### EN-only chrome surfaces — design question

These are EN-only by design (English-immersive tab posture). Listed
for completeness, not as defects.

| Loc | EN | Why EN-only is OK here | Phase-2 follow-up |
|---|---|---|---|
| 52–53 (no-context heading) | `English works best with room content` | Header for the English-helper tab; learner is opting into English reading. | (none required) |
| 54–57 (no-context body) | `Open a room to learn vocabulary and example sentences from that lesson.` | Paired with the VI subtitle on line 59. | (line 59 fix only) |
| 69 (CTA inside no-context card) | `Ask Mercy in Guide instead` | Cross-tab nav; routes back to Guide tab where VI returns. Brief CTA, acceptable EN-only at this density. | optional VI subtitle if other Phase-2 finds the no-context state is opened by VI-only learners often |
| 73 (helper text) | `You can ask about any word, sentence, or grammar point in Guide.` | Pairs with line 69 as helper text. Same density. | optional VI subtitle |
| 81 / 226 (vault title × 2) | `Vocabulary Vault` | Lexical-set brand label; appears as a section header. The empty-state subtitle below already carries `VOCAB_VAULT_EMPTY.vi` (`shared.ts`) for the no-items state. | (none required) |
| 96–98 (vault subtitle, non-empty) | `You can still review saved words here.` | One-line subtitle; the per-word chips below carry both `tipEn` and `tipVi`. | optional VI subtitle |
| 121–122 / 261–262 (vault chip score × 2) | `Last {score}/100` | Tiny metric label inside a button chip. The fluent EN is appropriate density for the per-item card. | (none required) |
| 156–159 (CTA primary, top) | `Teach me simple English from this room` | Pairs with the VI caption on line 163 already. | (none required) |
| 222–280 (vault repeat in non-context state) | (mirrors 77–141) | Same surface, different mount state. Same posture. | (none required) |

---

## Cross-cutting observations

1. **The single revision in this file is the internal
   inconsistency `room` (line 59) vs `phòng này` (line 163).** Two
   lines apart on the same tab, both literally pointing at the same
   thing. Easy fix; high readability win.

2. **English-immersive by design — but the VI subtitle pattern is
   under-applied.** Lines 162–164 (the CTA caption) and lines
   215–217 (the post-result footer) show the correct shape: small
   muted VI line beneath an EN-primary element. That same shape
   could appear under lines 69, 73, 81, 96 for surface consistency.
   This is a design call, not a defect — flag for Phase-2 author
   if they want to push every help element to bilingual rather
   than EN-only.

3. **The `phòng này` form on line 163 is the right model for the
   `room` → `phòng` translation across the codebase.** Worth
   promoting to `vi-style-guide.md` §3 as the canonical VI for
   "lesson room" — the codebase has been drifting between `room`
   (untranslated) and `phòng` (translated) for the same concept;
   pinning `phòng` is a one-line style decision worth making.

4. **No shame triggers, no register drift.** The three VI strings
   all pass the `vi-style-guide.md` §5 quick-checklist (with the
   `room` → `phòng` fix applied to line 59).

5. **Kids-mode lane stays clean.** This file has zero `kids`
   references (verified by grep). Auditing it does not encroach on
   CC2's `MercyTeacherTab.tsx` territory, which is the kids-mode
   surface in the same directory.

## References

- `docs/copy/bilingual-audit.md` §281 (mercy-guide/ top-priority
  framing — this file is the non-kids member of that dir).
- `docs/copy/vi-style-guide.md` §3 (half-translated UI elements
  flag — line 59's `room` is the example case).
- `src/components/mercy-guide/MercySpeakTab.tsx` — companion
  audit `!42` for the speak surface in the same directory.
- `src/components/mercy-guide/MercyTeacherTab.tsx` — the
  kids-mode sibling, OUT of scope for this audit (CC2's lane).
- `src/components/mercy-guide/shared.ts` — `VOCAB_VAULT_EMPTY`
  bilingual constant that this file pulls from.
