# Phase-2 audit — `src/components/mercy-guide/UnifiedMercyChat.tsx`

**Surface:** the unified single-stream Mercy chat surface inside the
`MercyGuidePanel` (the alternative to the legacy classic-tabs UI).
Header pill, settings toggle (Unified ↔ Classic), inline mode
banners (pronunciation / grammar / lesson / encouragement), the
empty-state opener, the bilingual textarea placeholder, and four
canned reply templates that ship when the LLM pipeline isn't wired.

**Priority:** **YES** — named in
`docs/copy/bilingual-audit.md` §281 as part of the mercy-guide/
top-priority directory. Non-kids (no `kidsDataLoader` import, no
`isKidsMode` prop, no kid-image paths). Distinct from
`MercyTeacherTab.tsx` (kids-mode-coupled — CC2's lane) and
`MercySpeakTab.tsx` (audited in `!42` / revisions shipped in `!48`).

**Scope:** every user-facing string in the file. Cataloged 16
distinct surfaces — 1 placeholder pair, 4 inline-mode header pairs,
4 inline-mode body templates, 4 inline-mode canned replies, 1
empty-state greeting, 1 settings panel set, plus a handful of
`aria-label` strings (EN-only by accessibility convention).

**Method:** verdict column per `docs/copy/bilingual-audit.md` §Method.
Adds a *pronoun* column to track the file's deliberate use of `em`
(younger-sibling pronoun) — a register choice that differs from the
`bạn`-default elsewhere in the codebase and is worth surfacing.

**Conclusion:** **16/16 OK** — no defects. **One cross-cutting
finding worth promoting**: this file uses `em` as the consistent
learner-address pronoun (warmer than `bạn`, sister/teacher framing),
which the `vi-style-guide.md` §1 pronoun table does not currently
codify. The file's voice IS on-brand — Mercy as a slightly-older
sister — but the convention is implicit, not documented. Three
files in the mercy-guide subtree (this one, `MercySuggestTab.tsx`,
and the still-unaudited `MercyGuidePanel.tsx`) all use this same
register. Worth promoting to the style guide.

---

## Catalog

### Placeholder + textarea (lines 44–47, 379)

| Loc | VI | EN | Pronoun | Verdict | Proposed revision |
|---|---|---|---|---|---|
| 44–47 | `Nhắn cho Mercy — phát âm, ngữ pháp, bài học, hoặc tâm sự…` | `Ask Mercy anything — pronunciation, grammar, a lesson, or just chat` | — | **OK** — `tâm sự` ("share feelings") translates "just chat" warmly; `Nhắn cho Mercy` ("Message Mercy") is the on-voice imperative form. Both halves visible side-by-side in the textarea placeholder (line 379: `${VI_PLACEHOLDER}\n${EN_PLACEHOLDER}`). | — |

### Inline-mode headers (lines 49–54)

`INLINE_HEADERS` is `Record<kind, [VI, EN]>` — clean bilingual
pairing at the type level.

| Loc | VI | EN | Pronoun | Verdict | Proposed revision |
|---|---|---|---|---|---|
| 50 (pronunciation) | `Luyện phát âm` | `Practice pronunciation` | — | **OK** — standard. | — |
| 51 (grammar) | `Kiểm tra ngữ pháp` | `Grammar check` | — | **OK** — standard. | — |
| 52 (lesson) | `Mở bài học` | `Open lesson` | — | **OK** — standard. | — |
| 53 (encouragement) | `Mercy ở đây` | `Mercy is here` | — | **OK** — calm, warm; pairs with the encouragement-mode body template (line 350–352) where Mercy speaks. | — |

### Canned reply templates (lines 66–90)

Pure-function `craftReply()` — runs when the LLM seam isn't hooked.
Every branch has both VI and EN; the VI branch fires when
`learnerLanguage === "vi"` or `"mixed"`. Reads as Mercy's voice
across all four kinds.

| Loc | VI | EN companion | Pronoun | Verdict | Proposed revision |
|---|---|---|---|---|---|
| 70–72 (pronunciation reply) | `Cùng luyện "${inline.target \|\| "từ này"}" nhé — bấm mic để thu âm.` | `Let's practice "${inline.target \|\| "this word"}" — tap the mic to record.` | (no explicit pronoun — `cùng` "together" is the invitational frame) | **OK** — `nhé` particle warms the imperative; `Cùng luyện … nhé` is the canonical Mercy-as-companion frame. The fallback `"từ này"` ("this word") inside the template is graceful. | — |
| 74–76 (grammar reply) | `Mercy soi câu "${inline.target}" giúp em nha.` | `Mercy will check "${inline.target}" for you.` | **`em`** (younger sibling) | **OK** with cross-cutting note — `soi câu` ("inspect the sentence") is on-voice and idiomatic; `nha` particle warms the offer. **Pronoun:** uses `em` (younger sibling) to address the learner — see §Cross-cutting #1. | — |
| 78–80 (lesson reply) | `Mở bài về ${inline.topic} ngay đây.` | `Opening the ${inline.topic} lesson.` | — | **OK** — `ngay đây` ("right here") translates the immediate-action English progressive cleanly. | — |
| 82–84 (encouragement reply) | `Mercy hiểu, từ từ thôi — mình thử một câu nhỏ trước nha.` | `Mercy hears you — let's try one tiny step together.` | **`mình`** (we/us, inclusive) | **OK** — `từ từ thôi` ("take it slow") is the on-voice softener. `mình thử một câu nhỏ trước` ("let's try one small sentence first") is the canonical no-pressure micro-step framing — pairs with the `STRATEGY.md` §5 small-steps principle. | — |
| 86–88 (chat-default reply) | `Mercy đây — mình muốn luyện gì hôm nay?` | `Mercy here — what should we work on today?` | **`mình`** | **OK** — `Mercy đây` ("Mercy here") is the warm announcement; `mình muốn luyện gì` ("what should we practice") uses the inclusive `mình`. | — |

### Header pill + settings panel (lines 213–275)

| Loc | VI | EN companion | Pronoun | Verdict | Proposed revision |
|---|---|---|---|---|---|
| 215 (header subtitle) | `Bạn muốn học gì hôm nay?` | `How can I help today?` | **`bạn`** | **OK** with note — this single string uses `bạn` (formal "you"), while the rest of the file uses `em` (younger sibling) or `mình` (inclusive we). The header is a single-pill greeting that runs once; the inconsistency is mild but real. The deliberate read is: header = first-impression formal greeting; in-stream Mercy = warm sibling. Acceptable as a register-distinction; flag for the style-guide author. | (optional) `Em muốn học gì hôm nay?` (align with the rest of the file's `em` pronoun) — but only if the style guide commits to `em` as the canonical learner-pronoun for the mercy-guide surface. |
| 248 (settings panel heading) | `Chế độ giao diện` | `View mode` | — | **OK** — `Chế độ giao diện` ("interface mode") is the standard VI for a settings switch. | — |
| 260 (toggle option 1) | `Chat hợp nhất` | `Unified` | — | **OK** — `hợp nhất` ("unified") translates the EN cleanly. | — |
| 269 (toggle option 2) | `Nhiều tab` | `Classic` | — | **OK** — `Nhiều tab` ("many tabs") describes the legacy multi-tab UI; the EN labels it `Classic`. Asymmetric (VI describes, EN brands) but defensible — same pattern as `Tiers.tsx`'s `Luyện thi / Exams (VSTEP · TOEIC · IELTS)` audit verdict. | — |
| 273 (toggle help text) | `Đổi sang Classic nếu em quen dùng các tab cũ. Vẫn dùng được mọi lúc.` | (VI-only — no EN companion) | **`em`** | **OK** — natural, soft; the "Classic" brand-label stays English inside VI prose (a one-word loan, common in UI). VI-only is acceptable on a tucked-away settings-panel help text. | — |

### Empty-state opener (lines 287–290)

| Loc | VI | EN companion | Pronoun | Verdict | Proposed revision |
|---|---|---|---|---|---|
| 287 | `Chào em — Mercy ở đây.` | (VI-only) | **`em`** | **OK** — warm greeting, Mercy's voice. The `—` (em-dash) spacing is correct VI punctuation. | — |
| 290 | `Hỏi Mercy về phát âm, ngữ pháp, hay nhờ Mercy ra bài tiếp theo.` | (VI-only) | — | **OK** — natural, action-led; the third-person Mercy reference ("Hỏi Mercy…") is consistent with the persona's teacher framing. | — |

### Inline-mode body templates (lines 332–353)

These run when an inline panel is open above the message stream.

| Loc | VI | EN companion | Pronoun | Verdict | Proposed revision |
|---|---|---|---|---|---|
| 334–335 (pronunciation inline) | `Bấm mic để thu âm "${state.inline.target \|\| "từ này"}". Mercy sẽ chấm điểm và đọc mẫu lại cho em.` | (VI-only inline body) | **`em`** | **OK** — `chấm điểm và đọc mẫu lại` ("score and read back as a model") is the canonical pronunciation-feedback framing. | — |
| 340 (grammar inline) | `Câu cần kiểm tra: <em>{state.inline.target}</em>` | (VI-only, runtime substitution) | — | **OK** — terse fragment, natural. The `<em>` HTML emphasis tag (not the VN pronoun) is correctly used for italicization. | — |
| 345 (lesson inline) | `Bài học: <strong>{state.inline.topic \|\| "tiếp theo"}</strong>` | (VI-only) | — | **OK** — fragment with `<strong>` highlight; the `\|\| "tiếp theo"` fallback ("next") is graceful. | — |
| 350–352 (encouragement inline) | `Mercy thấy em đang khó. Mình thử một câu thật nhỏ — không sao nếu sai, mình cùng sửa.` | (VI-only) | **`em` + `mình`** mix | **OK** — exemplary Mercy-as-companion writing. `Mercy thấy em đang khó` ("Mercy sees you're struggling") is the empathetic open; `không sao nếu sai, mình cùng sửa` ("it's OK to be wrong, we'll fix it together") explicitly removes shame. This is one of the strongest no-shame strings audited so far. **Worth promoting to `vi-style-guide.md` §6 exemplars.** | — |

### aria-labels (lines 223, 233, 325, 365, 387)

All EN-only (accessibility-API convention; screen readers in VN
locales typically prefer the EN technical-control name).

| Loc | EN | Verdict |
|---|---|---|
| 223 | `Reset conversation` | **OK** — standard aria label, EN-only by a11y convention. |
| 233 | `Settings` | **OK** — same. |
| 325 | `Dismiss inline panel` | **OK** — same. |
| 365 | `Voice input` | **OK** — same. |
| 387 | `Send` | **OK** — same. |

---

## Cross-cutting observations

1. **The `em` pronoun is the dominant Mercy-↔-learner address
   register in this file** (lines 75, 273, 287, 290, 335, 350,
   etc.). `vi-style-guide.md` §1's pronoun table lists `bạn` for
   the learner and `mình` for Mercy, but does NOT currently
   codify `em` as a third option. The voice it produces is
   warm-elder-sister Mercy — appropriate for a teacher-character
   conversational surface, distinct from the more formal `bạn`
   on settings/account pages. **Worth promoting to the style
   guide as the canonical Mercy-conversational register**, with
   `bạn` reserved for system-spoken / settings / page-chrome
   surfaces. (Same convention surfaces in
   `MercySuggestTab.tsx` and `MercyGuidePanel.tsx`.)
2. **The encouragement-inline template (line 350–352) is one of
   the strongest no-shame strings in the codebase.** Pair the
   empathy open (`Mercy thấy em đang khó`), the micro-step offer
   (`mình thử một câu thật nhỏ`), and the explicit shame-removal
   (`không sao nếu sai, mình cùng sửa`) — and it covers the full
   `voice-guidelines-vn.md` no-shame arc in one breath. Worth
   `vi-style-guide.md` §6 exemplar status, alongside the
   `MercySpeakTab.tsx` recognition-error envelope.
3. **The header pill at line 215 uses `bạn`**, while the rest of
   the file uses `em` / `mình`. This is the file's one
   register-consistency question — and arguably correct (the
   header is a first-impression greeting; in-stream Mercy is
   warm-sibling). Flag for the style-guide author to decide
   whether to formalize the split or align to one pronoun.
4. **The `Mercy đây` / `Mercy ở đây` framing** (lines 53, 287,
   87) is the file's persona signature. Three places, three
   slightly different formulations of the same "Mercy is
   present" idea — natural variation in a single voice. Not a
   defect; worth keeping all three.
5. **No shame triggers, no MT-feel, no register drift beyond
   observation #3.** Every cataloged VI string passes
   `vi-style-guide.md` §5 quick-checklist. The file's prose was
   written by a Vietnamese-native author with a clear voice
   discipline.
6. **The `\${VI_PLACEHOLDER}\n\${EN_PLACEHOLDER}` textarea
   placeholder shape** (line 379) is the canonical "user
   actively reading both languages" pattern. Both halves
   simultaneously visible to a bilingual reader; the VI half
   wraps first by convention.

## References

- `docs/copy/bilingual-audit.md` §281 (mercy-guide/ top-priority
  entry — this file is one of three non-kids members of that dir).
- `docs/copy/vi-style-guide.md` §1 (pronoun consistency — this
  file's `em` usage suggests a §1 update worth proposing; see
  observation #1).
- `docs/voice-guidelines-vn.md` (anti-shame canon — the
  encouragement-inline template, observation #2, is an exemplar).
- `docs/copy/audits/MercySpeakTab.tsx.md` — sibling audit in the
  same directory (`!42`).
- `docs/copy/audits/MercyEnglishTab.tsx.md` — sibling audit
  (`docs/bilingual-audit-batch-2` branch / merged via `!53`); the
  `phòng học` canonical-VI finding applies cross-file but doesn't
  surface here (this file uses `bài học` for "lesson", which is
  separate vocabulary).
- `src/components/mercy/AIDisclosureModal.tsx` — the Apple 5.1.1
  AI-disclosure modal this file mounts on first message; its copy
  is a separate surface and would warrant its own audit if/when
  picked up.
- `src/components/mercy-guide/MercyGuidePanel.tsx` — the parent
  panel; pending Phase-2 audit (next batch).
- `src/components/mercy-guide/MercySuggestTab.tsx` — sibling
  panel (~65 lines); pending Phase-2 audit (next batch).
