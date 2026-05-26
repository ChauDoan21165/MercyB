> **SUPERSEDED 2026-05-17 or later:** Phase 1 recon's recommendation was acted on; all 14 proposed rooms (`english_b2_b201.json … english_b2_b214.json`) now live on `main` (verified by A9j 2026-05-19). Keep for audit trail of the original gap analysis + topic design.

# RECON — English B2 rooms (the missing band)

**Agent:** english-b2-content-agent
**Branch:** `english-b2-content` (off fresh `origin/main` @ `68855a29`, incl. #556)
**Worktree:** `/private/tmp/MercyB-english-b2-content`
**Date:** 2026-05-17
**Status:** Phase 1 recon complete — awaiting go before authoring

---

## TL;DR

- **Gap confirmed.** English rooms: A1=14, A2=14, B1=14, **B2=0**, C1=14, C2=14. B2 (CEFR) = **IELTS 5.5–6.5** — STRATEGY §4's *core* test-prep band. The one level with zero rooms is the one the primary audience needs most.
- **Schema fully reverse-engineered** from B1-08 / C1-03 / A2-06. Drop-in: `english_b2_b201.json … english_b2_b214.json`, `tier:"free"`, `domain:"English B2"`, 6 entries each, audio `b2NN_0M_en.mp3`.
- **14 topics proposed** below — an IELTS-anchored bridge between B1 (simple opinions) and C1 (professional/nuance). Zero overlap with existing levels.
- **Sample room 1 fully drafted** (§6) — 6 entries, 4 Vietnamese cultural anchors (phở, Honda Wave, xe máy, Tết, VinFast), explicit IELTS framing.
- **Audio honest cost: ~$0.50–$0.90 for all 84 clips** (OpenAI `gpt-4o-mini-tts`). This is **NOT** "~$0.12 like Spanish B2" — Spanish used Google Neural2's free tier (effectively $0.00); the *rooms* pipeline is a different, paid OpenAI path. Still trivially below the $50 line → no Chau cost decision needed. One real risk flagged in §7.
- **Recommendation:** approve topics + sample tone → I author all 14 + generate audio (scoped) → single PR.

---

## 1. Inventory — gap confirmed

```
english_a1_*  14    A1
english_a2_*  14    A2
english_b1_*  14    B1
english_b2_*   0    ← MISSING
english_c1_*  14    C1
english_c2_*  14    C2
```

`tier` field across the 70 English level rooms: **68 `free`, 2 `vip3`** (the 2 vip3 are legacy artifacts — `tier` is a legacy string; tier-gating lives in the app layer per CLAUDE.md #5 + ROOM_GUIDE §3). Every B1/C1/C2 room sampled is `tier:"free"`.

## 2. Schema (reverse-engineered, drop-in compatible)

Root:
```json
{
  "id": "english_b2_b201",                 // MUST equal filename (ROOM_GUIDE §2, hard-fail)
  "tier": "free",
  "domain": "English B2",
  "title": { "en": "B2-01 — …", "vi": "B2-01 — …" },
  "content": { "en": "<intro>", "vi": "<giới thiệu>" },
  "entries": [ … 6 … ],
  "domain_image": "/images/domains/english.svg"   // exists, 554 B, shared by all EN rooms
}
```
Entry:
```json
{
  "slug": "kebab-identifier",
  "keywords_en": ["…","…"],
  "keywords_vi": ["…","…"],
  "copy": { "en": "<plain English>", "vi": "<VI instruction, English examples kept in English inline>" },
  "audio": "b201_01_en.mp3",               // flat filename, English-only
  "tags": []
}
```

**Confirmed conventions:**
- **6 entries** per room (uniform across all 70 existing English rooms; strict-mode validation allows 2–8, so 6 is safe).
- **Bilingual pattern:** `copy.en` = English instruction + example sentences. `copy.vi` = Vietnamese instruction that **keeps the English example sentences in English inline** (the learner reads VI scaffolding, practices EN). Verified identical in A2/B1/C1.
- **Last entry is always a "daily practice routine"** (matches `-14`/closing pattern across levels).
- **Audio is English-only.** All existing English room audio is `{prefix}_{NN}_en.mp3` at the `room-audio` bucket root. Live-checked 5 keys (`b108_01_en.mp3`, `a201_01_en.mp3`, `c103_01_en.mp3`, `b101_01_en.mp3`, `c214_06_en.mp3`) → all HTTP 200, real mp3 (245–337 KB). **No `_vi` room audio exists** — rooms are EN-audio + bilingual text. (The "Google TTS Vietnamese + English / Spanish B2 pipeline" in the brief refers to the *lessons* table system — a different pipeline; rooms do not use it. See §7.)

## 3. Tone ladder (A2 → B1 → C1) and where B2 sits

| Level | Sampled register |
|---|---|
| A2 (a206) | Terse. `"Regular past tense verbs end with ed. worked cleaned opened…"` — drill-like. |
| B1 (b108) | Simple opinion patterns. `"I think this is a good idea… Start with short sentences before trying longer ones."` |
| C1 (c103) | Professional/mature. `"A clear update is short and calm. Start with status… Add a detail… Finish with next step."` |

**B2 = the bridge.** IELTS 5.5–6.5 is where a learner stops giving short correct answers and starts **sustaining and justifying**: answer + reason + example + extension; comparing; hypothesizing; conceding; cohesive paragraphs. B2 copy should be **fuller and more abstract than B1, IELTS-explicit, but below C1's workplace/EI register**. Real Vietnamese-English contexts, not Western defaults.

## 4. Proposed 14 B2 topics (IELTS 5.5–6.5, complementary to A1–C2)

| # | id | Title (EN) | One-line rationale |
|---|---|---|---|
| 1 | `english_b2_b201` | B2-01 — Extended Answers: From Short Replies to Full Responses | IELTS Speaking Part 1: kill one-word answers; answer→reason→example→extension. Foundational B2 move. |
| 2 | `english_b2_b202` | B2-02 — The 2-Minute Long Turn (Speaking Part 2) | Cue-card structure + note-making; fill 2 minutes without drying up. Nothing below B2 teaches sustained monologue. |
| 3 | `english_b2_b203` | B2-03 — Abstract Discussion & Justifying Opinions (Speaking Part 3) | Concrete → abstract; opinion + justification + concession. B1 only does *simple* opinions. |
| 4 | `english_b2_b204` | B2-04 — Comparing & Contrasting | `whereas / compared with / on the other hand`; powers Speaking Part 3 + Writing Task 1/2. |
| 5 | `english_b2_b205` | B2-05 — Describing Trends & Data (Writing Task 1) | `rose / plateaued / a sharp decline`; overview sentence; no opinion. High-value, unique — nothing else covers Task 1. |
| 6 | `english_b2_b206` | B2-06 — The Opinion Essay: Structure & Topic Sentences (Writing Task 2) | Intro/thesis/body/conclusion; topic sentence + support. The Writing-band lever. |
| 7 | `english_b2_b207` | B2-07 — Two-Sided Arguments: Discuss Both Views | `while some argue… others believe…` + concession. The "discuss both views and give your opinion" essay type. |
| 8 | `english_b2_b208` | B2-08 — Cause, Effect & Consequence | `due to / as a result / which means that`; problem-solution essays + Part 3 reasoning. |
| 9 | `english_b2_b209` | B2-09 — Hypothesizing & Conditionals (Real & Unreal) | Fluent 1st/2nd conditionals, `unless / provided that`; speculation for Part 3 — a classic Vietnamese transfer-error zone. |
| 10 | `english_b2_b210` | B2-10 — Degrees of Certainty & Hedging | `it's likely that / arguably / tends to`; academic caution — examiners reward it, Vietnamese learners over-generalize. |
| 11 | `english_b2_b211` | B2-11 — Paraphrasing & Avoiding Repetition | Synonyms, word-form & voice change; Reading paraphrase recognition + Writing lexical resource. |
| 12 | `english_b2_b212` | B2-12 — Cohesion: Linking Ideas Smoothly | Referencing (`this / such / the former`), markers beyond `and/but/so` — the band-6 coherence lever. |
| 13 | `english_b2_b213` | B2-13 — IELTS Listening: Signposts, Distractors & Paraphrase | Section transitions, answer-correction distractors, prediction. Only level with a Listening-strategy room. |
| 14 | `english_b2_b214` | B2-14 — Fluency Under Pressure: Fillers & Self-Repair | Natural fillers, talk-around-the-word, recover from a stumble — the fluency descriptor. Doubles as the closing `-14` capstone routine. |

Coverage check: all four IELTS skills (Speaking 1/2/3, Writing Task 1/2, Reading paraphrase, Listening strategy) + the B2 functional-grammar gaps (conditionals, hedging, cohesion, cause-effect) B1 lacks and C1 assumes. No topic duplicates an existing A1–C2 room.

## 5. File naming, validation, free/VIP

- **Filenames:** `public/data/english_b2_b201.json … english_b2_b214.json`. `id` field == filename (ROOM_GUIDE §2 zero-tolerance; mismatch = hard fail in `rooms:check`).
- **Registry:** after authoring, `npm run rooms:check` regenerates `src/lib/roomManifest.ts` + `src/lib/roomDataImports.ts` and runs core validation (also the prebuild hook). Commit JSON + regenerated registry together (pre-commit hook keeps them in sync; never hand-edit the registry).
- **Free/VIP recommendation: `tier:"free"` for all 14.** Rationale: (1) matches the dominant English-level pattern (68/70 free); (2) Principle #5 — no VIP tier, the 2 `vip3` strings are legacy; (3) STRATEGY §4 — the primary audience is the IELTS aspirant; gating the *core* missing band behind a tier contradicts the mission. `tier` is non-authoritative anyway (app-layer gating), but `"free"` is the correct, consistent signal.

## 6. Sample room 1 — fully drafted (`public/data/english_b2_b201.json`)

> Cultural anchors used: **phở, Honda Wave, xe máy, Tết, VinFast** (5 — exceeds the ≥2 rule). IELTS framing explicit in entries 1 & 5. Tone: fuller than B1-08, below C1-03; real Vietnamese-English speaking contexts. Draft — native review recommended before ship.

```json
{
  "id": "english_b2_b201",
  "tier": "free",
  "domain": "English B2",
  "title": {
    "en": "B2-01 — Extended Answers: From Short Replies to Full Responses",
    "vi": "B2-01 — Câu Trả Lời Mở Rộng: Từ Trả Lời Ngắn Đến Trả Lời Đầy Đủ"
  },
  "content": {
    "en": "At IELTS band 5.5–6.5 the examiner is not testing whether your answer is correct — they are testing whether you can keep going. This room trains the move that lifts you from short replies to full B2 responses: answer, then add a reason, an example, and one natural extension. You will practice it on the everyday Vietnamese topics that really come up in Speaking Part 1.",
    "vi": "Ở trình độ IELTS 5.5–6.5, giám khảo không kiểm tra xem câu trả lời của bạn có đúng hay không — họ kiểm tra xem bạn có thể nói tiếp được hay không. Phòng này luyện đúng bước giúp bạn vượt từ câu trả lời ngắn lên câu trả lời đầy đủ ở mức B2: trả lời, rồi thêm một lý do, một ví dụ, và một ý mở rộng tự nhiên. Bạn sẽ luyện với chính những chủ đề Việt Nam thường gặp trong IELTS Speaking Part 1."
  },
  "entries": [
    {
      "slug": "why-short-answers-cap-your-band",
      "keywords_en": ["ielts", "speaking", "band"],
      "keywords_vi": ["ielts", "nói", "band điểm"],
      "copy": {
        "en": "In Speaking Part 1 the examiner asks simple questions, but a one-word answer keeps your score near band 5. Compare these. Weak: \"Do you like phở?\" — \"Yes.\" Stronger: \"Yes, I do. I usually have a bowl of phở near my office on cold mornings because it is warm and quick.\" Same question — but the second answer shows the examiner you can develop an idea. B2 is not harder grammar; it is the same grammar, kept going.",
        "vi": "Trong Speaking Part 1, giám khảo hỏi những câu đơn giản, nhưng câu trả lời một từ sẽ giữ điểm của bạn quanh band 5. Hãy so sánh. Yếu: \"Do you like phở?\" — \"Yes.\" Mạnh hơn: \"Yes, I do. I usually have a bowl of phở near my office on cold mornings because it is warm and quick.\" Cùng một câu hỏi — nhưng câu thứ hai cho giám khảo thấy bạn có thể phát triển một ý. B2 không phải là ngữ pháp khó hơn; đó là cùng ngữ pháp đó, nhưng được nói tiếp."
      },
      "audio": "b201_01_en.mp3",
      "tags": []
    },
    {
      "slug": "answer-reason-example-extension",
      "keywords_en": ["structure", "answer", "reason"],
      "keywords_vi": ["cấu trúc", "trả lời", "lý do"],
      "copy": {
        "en": "Use a four-part shape: answer, reason, example, extension. Question: \"How do you usually travel to work?\" Answer: \"I usually ride my Honda Wave.\" Reason: \"because the bus is slow and the streets are always busy.\" Example: \"This morning it took me about twenty minutes from home to the office.\" Extension: \"but if I move further out next year, I might switch to the metro.\" Four short steps turn a flat reply into a full B2 answer.",
        "vi": "Hãy dùng cấu trúc bốn phần: câu trả lời, lý do, ví dụ, ý mở rộng. Câu hỏi: \"How do you usually travel to work?\" Trả lời: \"I usually ride my Honda Wave.\" Lý do: \"because the bus is slow and the streets are always busy.\" Ví dụ: \"This morning it took me about twenty minutes from home to the office.\" Mở rộng: \"but if I move further out next year, I might switch to the metro.\" Bốn bước ngắn biến một câu trả lời cụt thành một câu trả lời B2 đầy đủ."
      },
      "audio": "b201_02_en.mp3",
      "tags": []
    },
    {
      "slug": "make-the-example-personal",
      "keywords_en": ["example", "detail", "specific"],
      "keywords_vi": ["ví dụ", "chi tiết", "cụ thể"],
      "copy": {
        "en": "A specific personal example always sounds more fluent than a general one. General: \"I like festivals.\" Specific: \"My favourite is Tết — last year my whole family rode back to Nam Định together and my grandmother cooked bánh chưng for two days.\" The grammar is the same, but a real detail gives you something to talk about and stops you freezing. At B2, choose true details you can describe, not impressive ones you cannot.",
        "vi": "Một ví dụ cá nhân cụ thể luôn nghe trôi chảy hơn ví dụ chung chung. Chung chung: \"I like festivals.\" Cụ thể: \"My favourite is Tết — last year my whole family rode back to Nam Định together and my grandmother cooked bánh chưng for two days.\" Ngữ pháp vẫn vậy, nhưng một chi tiết thật cho bạn thứ để nói tiếp và giúp bạn không bị \"đứng hình\". Ở mức B2, hãy chọn chi tiết thật mà bạn tả được, đừng chọn chi tiết \"oách\" mà bạn tả không nổi."
      },
      "audio": "b201_03_en.mp3",
      "tags": []
    },
    {
      "slug": "extend-once-then-stop",
      "keywords_en": ["extension", "fluency", "control"],
      "keywords_vi": ["mở rộng", "trôi chảy", "kiểm soát"],
      "copy": {
        "en": "Extending does not mean talking forever. Add one extension, then stop cleanly so the examiner can ask the next question. Good length: \"I ride a xe máy every day, and honestly I cannot imagine the city without them — although the traffic does get stressful in the rain.\" That is enough: one clear idea, one honest extension, full stop. Rambling past the point lowers fluency; one controlled extension raises it.",
        "vi": "Mở rộng không có nghĩa là nói mãi không dừng. Hãy thêm một ý mở rộng, rồi dừng dứt khoát để giám khảo hỏi câu tiếp theo. Độ dài tốt: \"I ride a xe máy every day, and honestly I cannot imagine the city without them — although the traffic does get stressful in the rain.\" Vậy là đủ: một ý rõ ràng, một ý mở rộng thật, rồi chấm hết. Nói lan man quá sẽ làm giảm độ trôi chảy; một ý mở rộng có kiểm soát thì làm tăng nó."
      },
      "audio": "b201_04_en.mp3",
      "tags": []
    },
    {
      "slug": "apply-it-to-common-part-1-topics",
      "keywords_en": ["practice", "topics", "part 1"],
      "keywords_vi": ["luyện tập", "chủ đề", "part 1"],
      "copy": {
        "en": "Part 1 reuses a small set of topics: hometown, food, transport, work, free time. Practise the four-part shape on each. Food: \"My go-to breakfast is phở because it is fast before work, and last week I tried a new place near my street that was even better.\" Transport: \"I rely on my Honda Wave, mainly because parking a car in the centre is almost impossible — though I admit I would love a VinFast electric bike one day.\" Same shape, Vietnamese content you already know.",
        "vi": "Part 1 lặp lại một nhóm nhỏ chủ đề: quê hương, đồ ăn, đi lại, công việc, thời gian rảnh. Hãy luyện cấu trúc bốn phần với từng chủ đề. Đồ ăn: \"My go-to breakfast is phở because it is fast before work, and last week I tried a new place near my street that was even better.\" Đi lại: \"I rely on my Honda Wave, mainly because parking a car in the centre is almost impossible — though I admit I would love a VinFast electric bike one day.\" Vẫn cấu trúc đó, nhưng nội dung Việt Nam mà bạn đã biết sẵn."
      },
      "audio": "b201_05_en.mp3",
      "tags": []
    },
    {
      "slug": "daily-extended-answer-routine",
      "keywords_en": ["routine", "daily", "speaking"],
      "keywords_vi": ["thói quen", "hằng ngày", "luyện nói"],
      "copy": {
        "en": "Two minutes a day builds this into a habit. Pick one Part 1 question, set a timer, and speak the four parts out loud — answer, reason, example, one extension — recording yourself on your phone. Play it back once and ask only: did I add a reason and an example, or did I stop too early? Do not chase perfect grammar. At B2, the learner who keeps going every day passes the band the learner who waits to be perfect does not.",
        "vi": "Hai phút mỗi ngày sẽ biến điều này thành thói quen. Hãy chọn một câu hỏi Part 1, bấm giờ, và nói to bốn phần — trả lời, lý do, ví dụ, một ý mở rộng — và ghi âm lại bằng điện thoại. Nghe lại một lần và chỉ tự hỏi: mình đã thêm lý do và ví dụ chưa, hay mình dừng quá sớm? Đừng đòi hỏi ngữ pháp hoàn hảo. Ở mức B2, người chịu nói tiếp mỗi ngày sẽ qua band, còn người chờ đến lúc hoàn hảo thì không."
      },
      "audio": "b201_06_en.mp3",
      "tags": []
    }
  ],
  "domain_image": "/images/domains/english.svg"
}
```

## 7. Audio generation plan + honest cost

**Rooms audio pipeline (distinct from the lessons/Spanish pipeline):**

- The brief references the "Spanish B2 audio pipeline (Google TTS, ~$0.12)". That pipeline (`generate-spanish-audio.ts`, Google Neural2, keys `b2/es/l…`) drives the **`public.lessons` table**, not rooms. **It does not apply here.**
- Room audio = flat `{prefix}_{NN}_en.mp3` files at the `room-audio` bucket root, referenced directly by `entry.audio`. Generated by **`npm run audio:tts`** → `scripts/generate-missing-audio.ts` (**OpenAI `gpt-4o-mini-tts`, voice `alloy`, English-only**), then uploaded with `npx tsx scripts/upload-audio-to-supabase.ts` (idempotent — skips keys already in the bucket).
- Env: `OPENAI_API_KEY`, `VITE_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (Chau manages locally; same vars the other generators use — presence to be verified at Phase 2 start, not assumed).

**Honest cost — NOT ~$0.12:**

- 84 clips (14 rooms × 6). Each `copy.en` ≈ 55–80 words ≈ ~25–30 s of speech → ~37–42 min total.
- OpenAI `gpt-4o-mini-tts` ≈ $0.015 / min audio → **~$0.55–$0.65; budget ~$0.50–$0.90** allowing for retries.
- This is ~5–7× the Spanish figure **because it is a paid OpenAI path, not Google's free Neural2 tier** — I am not going to repeat "~$0.12" when the rooms pipeline genuinely costs more. It is still **trivially below the $50 decision line → no Chau cost decision required**, but the brief's expectation is corrected here on purpose (faithful-reporting rule).

**⚠️ One real risk to resolve before Phase 2 runs audio:** `generate-missing-audio.ts` scans **all** `public/data/*.json` and generates any clip "missing on disk." In a fresh worktree `public/audio/` is empty (CLAUDE.md: all bundled audio removed, dir gitignored), so an unscoped `npm run audio:tts` could attempt to regenerate the **entire ~474-room corpus** = a large unintended OpenAI bill, not $0.90. **Phase-2 gate:** before running, confirm a scoping flag (room/prefix filter) on the script, or generate only the 84 `b201–b214` clips via a targeted invocation; never run it unscoped. Upload step is safe (bucket-existence skip). If scoping cannot be made safe, audio for B2 is **deferred** and rooms ship text-only (resolver fails soft to `/audio/{key}`; rooms render and are fully usable without audio).

## 8. Phase 2 plan (on approval)

1. Author `english_b2_b201.json … english_b2_b214.json` — 6 entries each, the §6 tone, ≥2 VN cultural anchors/room (target 3–5), IELTS framing where natural, last entry = daily routine.
2. `npm run rooms:check` → commit JSON + regenerated `roomManifest.ts`/`roomDataImports.ts` together.
3. Gates: `npm run typecheck:ci` + `npm run lint` + `npm run validate-rooms` green.
4. Audio: resolve the §7 scoping risk → generate **only** the 84 B2 clips → `upload-audio-to-supabase.ts` → live HTTP-200 spot-check a sample. If unscopable safely → defer audio, ship text-only, note in PR.
5. Single PR off `english-b2-content` (per locked #16). PR body: native-review-recommended disclaimer (agent-drafted bilingual content).

**Disclaimer (standing):** all 14 rooms are agent-drafted. EN is examiner-aligned B2; the VI scaffolding is fluent but a native Vietnamese teacher review is recommended before this becomes the canonical B2 ladder users credit for their band.

---

## 9. Phase 2 — EXECUTED (2026-05-17, approved: all 14 topics, sample tone, `tier:"free"`, scoped audio)

| Step | Result |
|---|---|
| Author 14 rooms `english_b2_b201–b214` | ✅ 84 entries, 6/room, last entry = daily routine |
| Cultural anchors ≥2/room | ✅ all 14 (b211 was 1 → fixed to 3: phở, Tết, xe máy) |
| `npm run rooms:check` (registry + core validation) | ✅ 487 files, 0 warnings, 0 errors; `roomManifest.ts` regenerated with all 14 (`roomDataImports.ts` does not exist in this codebase — `roomManifest.ts` is the sole registry) |
| `npm run validate-rooms` (FULL) | ✅ PASS, 0 errors, 1 pre-existing non-fatal warning (not a B2 room) |
| `npm run typecheck:ci` (`tsc --noEmit`) | ✅ clean |
| `npm run lint` (`eslint .`) | ✅ clean |
| Scoped audio generator `scripts/generate-english-b2-room-audio.ts` | ✅ written — mirrors `generate-missing-audio.ts` text shape + TTS settings byte-for-byte (`gpt-4o-mini-tts`, `alloy`), idempotent vs. bucket, **scoped to `english_b2_b2*` only** (the general script has no scoping and would bill the whole ~474-room corpus) |
| Audio dry-run | ✅ 84 candidate clips, skipped=0, ~425 chars/clip |
| Audio smoke (`--limit=2`) | ✅ **2/84 generated + uploaded** (`b201_01_en.mp3`, `b201_02_en.mp3`) — OpenAI TTS + Supabase upload confirmed live |
| Audio full run (82 remaining) | ⏸️ **deferred to Chau** — auto-mode classifier blocked the agent's outward Supabase writes mid-run (classifier premise was wrong; Chau had approved). Per Chau's call: ship rooms PR now, Chau runs audio on the unrestricted main checkout. |

### Audio runbook (Chau runs this on `/Users/admin/MercyB` after merge or in the worktree)

```bash
cd /Users/admin/MercyB        # has node_modules + .env (OPENAI_API_KEY, VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
# (or: cd /private/tmp/MercyB-english-b2-content — node_modules symlinked, same .env)

npx tsx scripts/generate-english-b2-room-audio.ts --dry-run    # expect: 84 candidate clips, generated=0 (dry-run)
npx tsx scripts/generate-english-b2-room-audio.ts              # full run
```

Expected full-run output: `[b2-audio] done — generated=82 skipped=2 failed=0`
(the 2 smoke clips `b201_01_en.mp3` + `b201_02_en.mp3` are already live → auto-skipped by the bucket-existence HEAD check; script is idempotent and safe to re-run). **Honest cost: ~$0.50–0.65** (84 clips × ~425 chars, OpenAI `gpt-4o-mini-tts`; NOT free-tier like Spanish/Google — corrected from the brief's "~$0.12"). Trivially below the $50 line.

Verify after the run:
```bash
BASE=https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio
for k in b201_01_en b205_03_en b210_06_en b214_06_en; do curl -s -o /dev/null -w "$k %{http_code}\n" "$BASE/$k.mp3"; done   # expect all 200
```

Rooms render and are fully usable **without** audio in the meantime — `roomAudioResolver.ts` fails soft to `/audio/{key}`.

---

**Phase 2 complete except Chau-owned audio run. Single PR off `english-b2-content`.**
