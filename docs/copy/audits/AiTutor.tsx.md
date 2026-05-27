# Phase-2 audit — `src/pages/AiTutor.tsx`

**Surface:** `/ai-tutor` — the AI Tutor page where Mercy explains
English-via-Vietnamese, runs the 5-minute lesson loop, and hosts the
Logic-mode "why is this English structure not that one?" Q&A.

**Priority:** **HIGH** — `docs/copy/bilingual-audit.md` §253-296 +
§312-313 names this as the top single-file Phase-2 target. The
runtime Mercy voice surfaces here; consistency with
`src/lib/teacher-mercy/tierScripts.ts` matters most on this page.

**Scope:** every user-facing VI string in the file. Cataloged
exhaustively (7 distinct VI surfaces — the file is ~1,015 lines but
~95% is router / effect / state plumbing; the VI footprint is
small).

**Method:** verdict column uses `docs/copy/bilingual-audit.md` §Method.

**Conclusion:** **7/7 OK.** Two stylistic borderline notes, both
flagged for the Phase-2 author's discretion — neither is a defect.

---

## Catalog

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| line 119 (LOGIC_STARTER_PROMPTS[0]) | `Vì sao nói "I'm interested in English" mà không nói "I'm interesting in English"?` | — (VI-only starter prompt; the example sentences inside the quotes are the EN under-study) | **OK** — natural Vietnamese for "Why do we say X and not Y?" The `Vì sao X mà không Y?` shape is the conversational form a Vietnamese learner would use to frame this exact pedagogical question. | — |
| line 120 (LOGIC_STARTER_PROMPTS[1]) | `Vì sao nói "I go to school" mà không nói "I go school"?` | — | **OK** — same pattern as line 119. | — |
| line 121 (LOGIC_STARTER_PROMPTS[2]) | `Vì sao "I bought a hat yesterday" đúng hơn "I buy a hat yesterday"?` | — | **OK** — `đúng hơn` ("more correct") is the kindness frame — comparative rather than declaring one wrong. | — |
| line 133 (createLogicOpeningMessage) | `Chọn một câu bên dưới hoặc nhập câu tiếng Anh/Vietlish của bạn. Mercy sẽ giải thích cấu trúc tự nhiên, lỗi dịch từng chữ, mẫu cần nhớ và ví dụ đối chiếu Việt-Anh.` | `Choose a question below or enter an English/Vietlish sentence. Mercy will explain the natural English structure, the word-for-word Vietnamese trap, the pattern to remember, and contrast examples.` (line 134) | **OK** — action-led, lists 4 concrete deliverables. `lỗi dịch từng chữ` ("word-for-word translation traps") is the Vietnamese-specific framing for L1 interference — on-voice for this surface. The EN companion uses "trap" where the VI uses the neutral `lỗi` — both are valid in their respective registers. | — |
| line 206 (buildLogicReply explanation template) | `${fallbackPrefix}Cách nghĩ tiếng Việt: ${diagnosis.vietnameseThinking} Logic tiếng Anh: ${diagnosis.englishLogic}` | `${fallbackPrefix}Vietnamese thinking: ${diagnosis.vietnameseThinking} English logic: ${diagnosis.englishLogic}` (line 207) | **OK** — structured pedagogical template. The `Cách nghĩ tiếng Việt: X. Logic tiếng Anh: Y.` shape is a contrastive frame that matches the L1-vs-L2 explanation pattern in `src/lib/l1-profiles/vi.ts`. Minor: at runtime the two clauses concatenate without a period between `vietnameseThinking` and `Logic` — the EN has the same issue. A separator would read more clearly, but this is a punctuation question for the diagnosis-rendering pass, not a copy defect. | — (the missing period is a runtime-output observation; not a string fix) |
| line 209 (buildLogicReply naturalReply template) | `Mẫu cần nhớ: ${diagnosis.rememberRule}` | `Remember rule: ${diagnosis.rememberRule}` (line 210) | **OK** — concise, pedagogical. `Mẫu cần nhớ` ("pattern to remember") is on-voice; mirrors the `Mẫu` framing used elsewhere in the codebase. | — |
| line 931 (placement banner, VI half) | `Bạn mới học? Kiểm tra trình độ trước.` | `New here? Take a placement test first.` (line 929) | **OK** with stylistic note — `Bạn mới học?` literally reads "Are you new to learning?" which is slightly broader than the EN's `New here?` (which is space-specific to *this app*). A Phase-2 author could push the VI toward `Bạn mới đến?` ("New here?") or `Mới bắt đầu với Mercy?` ("Just starting out with Mercy?") for a tighter EN-VI semantic pairing. Not a defect — `Bạn mới học?` reads naturally to a learner. | (optional) `Mới bắt đầu với Mercy? Kiểm tra trình độ trước.` |

---

## Cross-cutting observations

1. **The Logic-mode starter prompts (lines 119–121) are quietly
   excellent.** Three pedagogical prompts that ask "Why X and not Y?"
   in the exact conversational Vietnamese a learner would use. They
   could serve as templates for any future "explain the L1-interference
   pattern" prompts elsewhere in the codebase.

2. **`lỗi dịch từng chữ` ("word-for-word translation mistakes",
   line 133) is the canonical VI framing for L1 interference** in
   the codebase. Worth promoting to the `vi-style-guide.md` §6
   exemplar list when this audit's revisions land — pairs well with
   the existing `Hay quên thêm -s sau he, she, it.` exemplar from
   `stage-3a/taxonomy.ts`.

3. **No shame triggers, no MT-feel, no register drift.** This file
   passes the style guide §5 quick-checklist on all seven strings.

4. **VI surface footprint is small.** Most of `AiTutor.tsx`'s
   user-facing chrome is EN-only (the `TodayLessonLoopPanel` —
   lines ~300–400 — is entirely English; the "Resume lesson", "5-minute
   lesson loop", "Continue today's lesson", and similar labels all
   render in English regardless of language). Phase 2 should decide
   whether the lesson-loop panel needs a bilingual treatment — that
   is a scope question for the design wave, not this audit.

## References

- `docs/copy/bilingual-audit.md` — the diagnostic this audit builds on.
- `docs/copy/vi-style-guide.md` §1 (Mercy voice), §3 (MT tells),
  §5 (pre-merge checklist).
- `src/lib/teacher-mercy/tierScripts.ts` — the runtime-voice canon
  this file's strings should stay consistent with.
