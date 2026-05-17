# RECON — JA B2 roleplay pronunciation_focus (lessons 51–91)

**Agent:** ja-b2-roleplay-agent
**Branch:** `ja-b2-roleplay-pronunciation` (worktree `/private/tmp/MercyB-ja-b2-roleplay`, off fresh `origin/main` @ `484f68cd` / #557 HEAD)
**Scope:** author `pronunciation_focus` (VI base) + `pronunciation_focus_en` for the 41 JA B2 roleplay lessons 51–91 deferred from PR #555.
**Status:** Phase 1 recon — awaiting approval before Phase 2 authoring.

---

## 1. Confirmed lesson + example count

Parsed `src/languages/japanese/lessons-b2.ts` (12,281 lines, 46 lesson objects, ids 46–91):

| Fact | Value |
|---|---|
| Lessons in scope (51–91) | **41** (contiguous, no gaps) |
| Category (all 41) | `fluency` |
| Level (all 41) | `B2` |
| Examples per lesson | **exactly 5** for every lesson (distribution `{"5": 41}`) |
| Total examples in scope | **205** (5 × 41) — matches PR #555 RECON §5 estimate |
| Examples already carrying `pronunciation_focus` | **0 / 205** (none — clean slate) |
| Lessons with `cultural_notes_vi` | **41 / 41** ✓ (shipped via #512) |
| Lessons with `tip_advice_vi` | **41 / 41** ✓ (shipped via #512) |

`pronunciation_focus` exists in the b2 file **only** for lessons 46–50 (25 occurrences, all ≤ line 934, shipped by #555). Lessons 51–91 also already carry `cultural_notes_en`, `tip_advice_en`, `register_notes(_en)`, `roleplay_prompts(_en)`, `idiom_glosses` (from #512). **The only missing field in scope is `pronunciation_focus` + `pronunciation_focus_en`.**

## 2. Schema verification

`JapaneseExample` (`src/languages/japanese/lessons.ts:17–22`):

```ts
export type JapaneseExample = {
  japanese: string;
  english: string;
  pronunciation_focus?: string[];      // base field = VIETNAMESE content
  pronunciation_focus_en?: string[];   // English sibling
};
```

- The base field is **`pronunciation_focus`** (no `_vi` suffix). It holds the **Vietnamese** content — the brief's "pronunciation_focus_vi" maps to this base field, per the established VI-base / `_en`-sibling convention used across #520/#548/#551/#555.
- Order in each example object: `japanese` → `english` → **`pronunciation_focus` (VI)** → `pronunciation_focus_en` (EN). VI base placed **before** the `_en` sibling, matching #555 (lesson 46, `lessons-b2.ts:72–87`) and #551 (B1, `lessons-b1.ts:68–79`).
- Both fields are optional `string[]`. Within one example, VI and EN arrays mirror each other token-by-token (same length per example); array length varies 4–7 by sentence, **not** a fixed count.
- Normalizer (`src/languages/japanese/normalize.ts:35–36`) is pure passthrough: `pronunciation_focus → pronunciationFocus`, `pronunciation_focus_en → pronunciationFocusEn`. **No parity/length assertion anywhere.** No vitest in `src/languages/__tests__` gates pronunciation_focus for Japanese (the profession-pack `content.test.ts` hits are unrelated EN packs). #555 already proved every gate green with this exact pattern.
- **Disclaimer is PR/commit-level, not inline.** #555 used "Drafts produced by agent; native review recommended before final adoption." in the commit body. The inline `// TODO: native review …` comments in `register_notes` are pre-existing #512 phrasing notes — **not** the standard disclaimer; I will not add inline disclaimers.

## 3. Style calibration (from shipped #555 / #551)

Each string = `token (kana) → 'romaji'; pitch/mora/sokuon/devoicing note — VN-contrastive cue`. Vietnamese strings explicitly call out where VN phonology collides (e.g. `'g' cứng (như 'g' trong 'gà'), không phải 'gi'`; `ら là 'r' chạm lưỡi (giữa l/r Việt)`; moraic ん, sokuon っ, devoiced す, long-vowel mora count). For B2 roleplay I additionally surface: keigo phrase intonation (petition vs. question rise), register-shift stress, business-Japanese phrase rhythm (humble openers said in one low breath).

## 4. Sample — lesson 51 fully drafted (5 examples)

> "Telling your boss you're resigning" — `lessons-b2.ts:1006–1278`. Insert after each example's `"english"` line (add trailing comma):

**Ex 1** — お忙しいところ恐れ入りますが、少しお時間をいただけませんでしょうか。
```jsonc
"pronunciation_focus": [
  "お忙しいところ → 'o-i-so-ga-shii-to-ko-ro'; 美化語 お đọc thấp dính 忙しい; しい kéo dài 2 mora — đừng rút thành 'shi'",
  "恐れ入りますが → 'o-so-re-i-ri-mas-ga'; cụm khiêm nhường mở đầu, đọc liền một hơi giọng hạ; ます lướt 'mas', が trôi không nhấn",
  "少し → 'su-ko-shi'; す gần câm (devoiced u) nghe như 's-ko-shi' — đọc rõ 'su' kiểu Việt là lộ ngay",
  "お時間 → 'o-ji-kan'; お nâng nhã, ん là một nhịp (mora) riêng, không dính nguyên âm trước",
  "いただけませんでしょうか → 'i-ta-da-ke-ma-sen-de-shoo-ka'; chồng ba lớp lịch sự; か cuối CHỈ đi lên nhẹ — đây là lời thỉnh cầu, KHÔNG cao như câu hỏi yes/no"
],
"pronunciation_focus_en": [
  "お忙しいところ → 'o-i-so-ga-shii-to-ko-ro'; beautifier お low, bound to 忙しい; long しい (2 mora), not 'shi'",
  "恐れ入りますが → 'o-so-re-i-ri-mas-ga'; humble opener in one low breath; ます glides to 'mas', が trails unstressed",
  "少し → 'su-ko-shi'; devoiced す, near 's-ko-shi' — over-pronouncing 'su' marks a learner",
  "お時間 → 'o-ji-kan'; honorific お; moraic ん is its own beat",
  "いただけませんでしょうか → 'i-ta-da-ke-ma-sen-de-shoo-ka'; triple-stacked politeness; only a slight rise on か — a petition, not a yes/no question rise"
]
```

**Ex 2** — 退職のことで、ご相談させていただきたく存じます。
```jsonc
"pronunciation_focus": [
  "退職 → 'tai-sho-ku'; たい là nguyên âm đôi 2 mora, く cuối gần câm — gần 'tai-sho-k'",
  "のことで → 'no-ko-to-de'; cụm đệm 'về việc ~', đọc nhanh và thấp, ngắt nhẹ sau で trước mệnh đề chính",
  "ご相談 → 'go-soo-dan'; 美化語 ご + そう nguyên âm dài 2 mora; KHÔNG nhấn đầu — keigo càng phẳng càng nhã",
  "させていただきたく → 'sa-se-te-i-ta-da-ki-ta-ku'; chuỗi kenjougo dài, giữ từng mora đều, đừng nuốt させて",
  "存じます → 'zon-ji-mas'; ぞ là 'z' (không phải 'gi' Việt); kenjougo của 思う, hạ giọng kết câu trang trọng"
],
"pronunciation_focus_en": [
  "退職 → 'tai-sho-ku'; たい diphthong (2 mora), final く nearly devoiced ('tai-sho-k')",
  "のことで → 'no-ko-to-de'; low fast filler 'regarding ~', slight break after で before the main clause",
  "ご相談 → 'go-soo-dan'; beautifier ご + long そう; no initial stress — flatter keigo is more polite",
  "させていただきたく → 'sa-se-te-i-ta-da-ki-ta-ku'; long kenjougo chain, even mora, don't swallow させて",
  "存じます → 'zon-ji-mas'; 'z' (not 'gi'); humble verb for 思う, falling formal sentence-end"
]
```

**Ex 3** — 三年間、本当にお世話になりました。
```jsonc
"pronunciation_focus": [
  "三年間 → 'san-nen-kan'; ba khối ん, mỗi ん một mora — người Việt hay nuốt ん giữa; phải tách rõ 'san·nen·kan'",
  "本当に → 'hon-too-ni'; とう nguyên âm dài 2 mora; nhấn cảm xúc rất nhẹ ở 本当 để nghe thành thật, không kịch",
  "お世話に → 'o-se-wa-ni'; cụm cố định, お thấp dính 世話, đọc liền một nhịp",
  "なりました → 'na-ri-ma-shi-ta'; ました quá khứ; した cuối gần câm 'sh-ta'; giọng kết hạ ấm, không lạnh"
],
"pronunciation_focus_en": [
  "三年間 → 'san-nen-kan'; three ん blocks, each one mora — keep them separate, don't merge the middle ん",
  "本当に → 'hon-too-ni'; long とう (2 mora); very light emotive lift on 本当 for sincerity, not drama",
  "お世話に → 'o-se-wa-ni'; set phrase, low お bound to 世話, one unit",
  "なりました → 'na-ri-ma-shi-ta'; past ました; final した nearly devoiced 'sh-ta'; warm falling close"
]
```

**Ex 4** — 後任の方への引き継ぎは責任を持って行います。
```jsonc
"pronunciation_focus": [
  "後任 → 'koo-nin'; こう nguyên âm dài 2 mora, ん một nhịp riêng",
  "の方へ → 'no-ka-ta-e'; 方 ở đây đọc 'kata' (người — kính ngữ), KHÔNG 'hoo'; trợ từ へ đọc 'e' không 'he'",
  "引き継ぎは → 'hi-ki-tsu-gi wa'; ぎ là 'g' cứng; は trợ từ chủ đề đọc 'wa', không 'ha'",
  "責任を持って → 'se-ki-nin o mot-te'; もって có っ (sokuon) — ngắt một mora, đọc 'mot·te' dứt khoát",
  "行います → 'o-ko-na-i-mas'; 行う đọc 'okonau' (KHÔNG 'iku' ở đây); ます lướt, giọng cam kết chắc"
],
"pronunciation_focus_en": [
  "後任 → 'koo-nin'; long こう (2 mora), moraic ん",
  "の方へ → 'no-ka-ta-e'; 方 read 'kata' (honorific 'person'), NOT 'hoo'; particle へ is 'e', not 'he'",
  "引き継ぎは → 'hi-ki-tsu-gi wa'; hard ぎ; topic は read 'wa'",
  "責任を持って → 'se-ki-nin o mot-te'; もって has sokuon っ — hold one mora, crisp 'mot-te'",
  "行います → 'o-ko-na-i-mas'; 行う is 'okonau' here (not 'iku'); ます glides, firm committed tone"
]
```

**Ex 5** — 皆様にご迷惑をおかけしますことを、深くお詫び申し上げます。
```jsonc
"pronunciation_focus": [
  "皆様 → 'mi-na-sa-ma'; さま (kính ngữ, cao hơn さん), bốn mora đều — đừng rút thành 'mina'",
  "ご迷惑を → 'go-mei-wa-ku o'; めい đọc dài 'me-e'; を trợ từ đọc 'o' không 'wo'",
  "おかけします → 'o-ka-ke-shi-mas'; お khiêm + động từ, ます lướt 'mas'",
  "深く → 'fu-ka-ku'; ふ là âm môi nhẹ (không 'f' rõ kiểu Việt, cũng không 'h'); く cuối gần câm",
  "お詫び申し上げます → 'o-wa-bi moo-shi-a-ge-mas'; 申し上げる kenjougo cao của 言う; もう nguyên âm dài; cả cụm hạ trầm, CHẬM — đỉnh điểm xin lỗi, đọc nhanh là mất trọng lượng"
],
"pronunciation_focus_en": [
  "皆様 → 'mi-na-sa-ma'; さま (honorific, higher than さん), four even mora — don't clip to 'mina'",
  "ご迷惑を → 'go-mei-wa-ku o'; long めい ('me-e'); を particle is 'o', not 'wo'",
  "おかけします → 'o-ka-ke-shi-mas'; humble お + verb; ます glides to 'mas'",
  "深く → 'fu-ka-ku'; ふ is a soft bilabial (not a hard Vietnamese 'f', not 'h'); final く near-devoiced",
  "お詫び申し上げます → 'o-wa-bi moo-shi-a-ge-mas'; 申し上げる high kenjougo for 言う; long もう; whole phrase low and SLOW — the apology peak; rushing it loses weight"
]
```

## 5. Batching proposal

**One PR** (per locked #16). Purely additive, single file, field already optional in the type and already shipped for 46–50 → **no lock-step / type-migration risk**, no test parity assertions. #548 (15 lessons), #551 (15), #555 (5) each shipped as a single squashed PR; 41 is larger but mechanically identical.

Authored in **4 internal passes** with a `typecheck:ci` + `lint` checkpoint between each (catch a malformed insert early, not after 2,900 lines):

| Pass | Lessons | Examples |
|---|---|---|
| A | 51–60 | 50 |
| B | 61–70 | 50 |
| C | 71–80 | 50 |
| D | 81–91 | 55 |

Full gate run (`typecheck:ci` · `lint` · `build` incl. `rooms:check` · `vitest` all) once at the end before push. Commit/PR carries the #555 disclaimer line.

## 6. Estimated token / diff size

- **Diff:** ~205 examples × ~14 added lines (VI block + EN block + comma) ≈ **+2,800–3,000 lines**, one file (`lessons-b2.ts`), zero deletions.
- **Authoring:** 205 examples × (VI array + EN mirror), 4–7 strings each ≈ ~410 arrays / ~2,400 individual focus strings. Large but mechanical; 4-pass batching keeps each authoring chunk reviewable and gate-checked.
- **Risk:** low. No schema change, no normalizer change, no test changes, no behavioral change to any other surface. Single-language render rule unaffected (renderer already `pick()`s VI vs EN; #555 proved it).

---

**Recommendation:** proceed to Phase 2 as a single PR, 4 internal passes, gates green, #555 disclaimer in the commit body. Awaiting approval.
