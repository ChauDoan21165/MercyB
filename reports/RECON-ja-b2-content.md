> **See also:** the scoping decision has shipped via #512 (deferred fields) → #555 (Group A 46–50 VI siblings) → #567 (Group B 51–91 roleplay `pronunciation_focus _vi+_en`). The "awaiting scope decision" status here is closed.

# RECON — JA B2 VI sibling content (ja-b2-content)

Branch: `ja-b2-content` off `origin/main` @ f66eefc5 (#551). Worktree: `/private/tmp/MercyB-ja-b2-content`.
Target file: `src/languages/japanese/lessons-b2.ts` (11,923 lines, 46 lessons).

## TL;DR — B2 does NOT mirror A2/B1; brief's assumptions need a scope decision before Phase 2

The brief assumes B2 looks like A2/B1 (where `_en` siblings + `pronunciation_focus_en` already existed and #548/#551 only added the VI siblings). **B2 is structurally different.** Two gaps, one of which is far larger than #548/#551.

## 1. Lesson inventory — 46 lessons, ids 46–91, two structural groups

| Group | IDs | Count | Type | Has cultural/tip _en+_vi? | Has pronunciation_focus(_en)? |
|---|---|---|---|---|---|
| A — grammar | 46–50 | 5 | grammar (`grammar` key, 5 examples each) | **No** (neither _en nor _vi) | No |
| B — roleplay | 51–91 | 41 | scenario/roleplay (#512 fields) | **Yes** — already authored, real content (not stubs) | No |

- Group A (46–50): Conditional Sentences, Idiomatic Expressions, Slang and Colloquial, Debating Skills, Final Comprehensive Review. Keys: id, title, level, vocabulary, grammar, dialogue, examples, exercises.
- Group B (51–91): job/visa/cultural/crisis/relationship scenarios. Already carry `cultural_notes_vi/_en`, `tip_advice_vi/_en`, `roleplay_prompts(_en)`, `register_notes(_en)`, `idiom_glosses`, `title_vi/_en` (from #512, merged as 41de5a23).

## 2. Schema verification (A2/B1 post-#548/#551 — confirmed authoritative)

- Lesson-level: `cultural_notes_en` + `cultural_notes_vi`; `tip_advice_en` + `tip_advice_vi`. 1:1 sibling pairs.
- `examples[]` per entry: `japanese`, `english`, **`pronunciation_focus`** (VI, string[]), **`pronunciation_focus_en`** (EN, string[]). VI sibling is the **un-suffixed** `pronunciation_focus`; counts are 1:1 (A2: 61/61, B1: 75/75; `pronunciation_focus_vi` = 0 — that key name is NOT used).

## 3. Gaps vs the pattern

**Gap 1 — cultural_notes/tip_advice:** missing for **5 lessons only (46–50)**. The 41 roleplay lessons already have them. To match the schema ("VI alongside _en sibling"), 46–50 also lack the `_en` sibling → would need `_en` + `_vi` authored (4 fields × 5 lessons = 20 strings).

**Gap 2 — pronunciation_focus (the brief's headline item):** **`pronunciation_focus_en` exists nowhere in B2** — 0 of 230 example entries (all 46 lessons) have it. In #548/#551 the PR added the VI sibling next to a *pre-existing* `_en`. Here neither exists. Faithfully reproducing the pattern means authoring **both `pronunciation_focus_en` and `pronunciation_focus` (VI)** for every example: 46 lessons × 5 = **230 example entries**, ≈ 4 focus strings each ≈ **~920 EN + ~920 VI strings**. This is ~3–4× the size of #548 (61) or #551 (75) and includes English authoring, not just VI siblings.

## 4. Deferral-flag note — brief's #488/#491 reference is incorrect

- **#488** = `feat(japanese): A1 English pedagogy` (merged 2026-05-16). **#491** = `feat(japanese): A2 English pedagogy` (merged 2026-05-16). Neither flags any B2 lesson as deferred.
- Genuine B2 deferred-field work = **#512** (`register_notes_en + roleplay_prompts_en + idiom literal/meaning/example _en`, merged 41de5a23) — orthogonal `_en` backfill, adds **no VI-deferral exclusion list**.
- **Conclusion: no B2 lessons are deferred-flagged out of VI scope. All 46 are in play.** (Locked worktree `agent-afca5e0c93ab6b49c` = pre-merge #512 branch; #512 already in origin/main, no collision — my fields don't overlap its `_en` fields.)

## 5. Scope options (decision required before Phase 2)

- **Option A — full faithful pattern (recommended, batched):** 46–50 get cultural/tip `_en`+`_vi` (20 strings); ALL 46 lessons get `pronunciation_focus_en` + `pronunciation_focus` for every example (~230 entries). Batch into 3 PRs (e.g. 46–50 + 51–63 / 64–77 / 78–91) — too large for one #16-style PR.
- **Option C — leaner first step (pilot):** 46–50 get cultural/tip `_en`+`_vi` AND pronunciation_focus (en+vi) for their 25 examples only. Defer 51–91 pronunciation to a follow-up. Single PR, #548/#551-scale, ships value, mirrors the Korean #506 pilot pattern.
- **Option B — strict "VI sibling only":** not viable — no `_en` siblings exist to pair against; would produce ~nothing for the headline item.

Note: brief says "single commit, single PR per #16" AND "propose batching if >15". Option A's 46 lessons exceed that → batching proposed. Option C fits one PR.

## 6. Sample draft — Lesson 46 "Conditional Sentences" (B2 depth, VN-learner framing, pitch accent)

Lesson-level:

```jsonc
"cultural_notes_vi": "Bốn cách nói 'nếu' trong tiếng Nhật KHÔNG thay thế cho nhau, chọn sai nghe vô duyên hoặc thất lễ nơi công sở. と = hệ quả tự nhiên/quy luật (春になると桜が咲く), không dùng cho ý muốn hay nhờ vả. ば = điều kiện chung/giả định, hạn chế khi vế sau là mệnh lệnh/rủ rê. たら linh hoạt nhất trong hội thoại và an toàn khi nói với cấp trên (資料ができたら、お送りします). なら tiếp nhận thông tin đối phương vừa nêu rồi đưa lời khuyên (東京に行くなら新幹線がいいですよ). Người Việt hay dồn hết về たら và mất sắc thái — ở công ty Nhật, dùng と chỗ đáng lẽ たら nghe như đang phán xét quy luật thay vì xin phép.",
"cultural_notes_en": "Japanese has four 'if' constructions that are NOT interchangeable; the wrong one sounds tactless or rude at work. と = natural/law-like consequence (春になると桜が咲く), never volition or requests. ば = general/hypothetical condition, weak when the result is a command or invitation. たら is the most flexible in conversation and the safe choice with a superior (資料ができたら、お送りします). なら picks up what the other person just said and offers advice (東京に行くなら新幹線がいいですよ). Vietnamese learners overgeneralise to たら and lose the nuance — at a Japanese company, using と where たら is expected sounds like judging a rule rather than asking permission.",
"tip_advice_vi": "Đừng học bốn mẫu điều kiện bằng bảng quy tắc — não sẽ kẹt khi nói thật. Ở B2: shadowing drama/họp công sở Nhật, mỗi lần gặp 'nếu' dừng lại tự hỏi 'sao chỗ này たら chứ không phải と'. Gom 10–15 câu thật vào Anki theo cụm (collocation), không học từ lẻ. Tỉ lệ input/output ~70/30: nghe nhiều để cảm sắc thái trước, rồi ép viết lại cùng một ý bằng cả ba mẫu mỗi ngày và nhờ người Nhật sửa — chính phần output bị sửa mới khắc được khác biệt と/ば/たら/なら.",
"tip_advice_en": "Don't drill the four conditionals from a rules table — it freezes in real speech. At B2: shadow Japanese drama/meeting clips; at every 'if', pause and ask 'why たら here, not と'. Bank 10–15 real sentences in Anki as collocations, not isolated words. Keep input/output ~70/30: absorb the nuance first, then force yourself to rewrite one idea daily in all three forms and get a native to correct it — the corrected output is what fixes the と/ば/たら/なら distinction."
```

examples[0] (`春になれば、桜が咲きます。` / "If spring comes, cherry blossoms bloom."):

```jsonc
"pronunciation_focus": [
  "春 (はる) → 'ha-ru'; pitch HEIBAN (低→高, không có lõm) — đừng nhấn mạnh は kiểu tiếng Việt",
  "に → trợ từ, đọc thấp, dính liền 春に thành một cụm nhịp, không tách rời",
  "なれば → 'na-re-ba'; ば-form điều kiện của なる; ば là một mora dứt khoát, không kéo dài",
  "桜 (さくら) → 'sa-ku-ra'; pitch NAKADAKA (低高低): mora 2 く lên cao rồi tụt — đọc bằng phẳng kiểu Việt là sai ngữ điệu",
  "が → trợ từ chủ ngữ, 'g' cứng (như 'g' trong 'gà'), không phải 'gi'",
  "咲きます → 'sa-ki-mas'; ます kết câu, hạ giọng cuối (trần thuật), nguyên âm cuối lướt"
],
"pronunciation_focus_en": [
  "春 (haru) → 'ha-ru'; heiban pitch (low→high, no drop) — don't stress は",
  "に → particle, low and bound into 春に as one rhythmic unit",
  "なれば → 'na-re-ba'; conditional ば-form of なる; ば is one crisp mora, not lengthened",
  "桜 (sakura) → 'sa-ku-ra'; nakadaka pitch (low-high-low): mora 2 く peaks then drops",
  "が → subject particle, hard 'g', not 'gi'",
  "咲きます → 'sa-ki-mas'; ます sentence-final, falling declarative intonation, final vowel devoiced"
]
```

## Gates (run before Phase 2 PR): typecheck:ci · lint · build (incl. rooms:check) · vitest — all exit 0.
Disclaimer to carry in PR body (matches #548/#551): `> **Drafts produced by agent; native review recommended before final adoption.**` + "First pass, not final translation — same disclaimer class as #545/#547/#548/#551."
