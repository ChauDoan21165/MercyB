# MercyBlade bilingual copy audit — 2026-05-27

A diagnostic, not a fix. This doc catalogs the user-facing VI strings
in the app, grades each on natural-Vietnamese quality and shame-risk,
and proposes revisions where one is warranted. **No source strings
change in the MR that lands this audit** — proposed revisions are
queued for a follow-up "Phase-2 sweep" wave.

## Scope

**In scope** — UI-chrome strings the user reads in the app:

- Page chrome (headings, subtitles, body copy, button labels, empty states).
- Component chrome (panel titles, row labels, helper text, tooltips, errors).
- The learner-language layer (`src/lib/stage-3a/taxonomy.ts`) — the canonical bilingual catalog the diagnostic surfaces read from.
- Stage 3B engine + UI strings (post-C5 `chore/stage-3b-vi-copy-audit` revision in `!24`).
- Teacher Mercy voice scripts (`src/lib/teacher-mercy/*`) — the companion-voice canon.

**Out of scope** — content, not chrome:

- `src/data/**` (mock interviews, exam-prep, listening clips, profession packs, phoneme drills, speech sentences). These are lesson-authoring artifacts and are governed by the `project_vi_sweep_policies` Northern-VI sweep, not by this UI-chrome audit.
- `src/languages/**` (KO/JA/ZH/FR/DE/ES lesson `.ts` files). Same reason — pedagogical content with its own sweep policy and dual `title_vi` / `title_en` conventions.
- `public/data/**` room JSON. Also governed by the room-content VI sweep series (`#601/#603/#606/#609/#610`).
- Test fixtures (`**/__tests__/**`, `**.test.*`, `**.spec.*`). Not user-facing.

**Why the scope split:** the diagnostic the user wants — *"is our
chrome readable and on-voice for Vietnamese learners?"* — is a
different question from *"are our 486 rooms tonally consistent?"*.
Mixing them in one MR makes neither tractable. The chrome question
is what marketing, onboarding, and the AppStore reviewer see; that
is the audit this MR completes.

## Method

Each catalogued string was assessed on five axes:

| Verdict | Meaning |
|---|---|
| **OK** | Natural Vietnamese, on-voice, no shame risk. Ship as-is. |
| **natural** | Reads as if a Vietnamese writer wrote it (no MT tells, register fits the surface). |
| **awkward** | Grammatically correct but reads stiff, formal, or unidiomatic. A native speaker would phrase it differently. |
| **MT-feel** | Has the markers of machine translation — calques from English templates, unusual word order, "thật" / "rất" / "luôn" over-use, formal register where the EN was casual. |
| **shame-risk** | Triggers the audit patterns from `docs/voice-guidelines-vn.md` (loss-framing initiated by the system, "you missed / you're behind / you lost", red-color implications, comparison shaming). |

"OK" subsumes "natural" — the column is shorthand for *natural +
on-voice + no shame risk*. The other four are mutually exclusive
red-flag types; a string can carry more than one (e.g.
MT-feel + shame-risk together).

The audit is intentionally **diagnostic, not prescriptive in
production**: where a revision is proposed, it is a sketch for the
Phase-2 sweep author to refine, not a directive. The author of the
follow-up MR has license to land different wording that meets the
same quality bar.

---

## Tier 1 — Marketing-visible + first-impression surfaces

### `src/pages/MarketingLandingPage.tsx`

The public landing at `/` for first-time anonymous visitors. The
most-read VI surface in the app — every external link lands here.

| Loc | VI | EN | Verdict | Proposed revision |
|---|---|---|---|---|
| line 94 (SEO title) | `Ngoại ngữ cho người Việt và Tiếng Việt cho thế giới nói tiếng Anh` | — (title only) | **OK** — canonical brand line per `project_marketing_landing_decisions`. Verbatim. Don't touch. | — |
| line 95 (SEO description) | `Học tiếng Anh cho người Việt: sửa lỗi phát âm, luyện giao tiếp và luyện thi cùng Cô Mercy. Dùng thử miễn phí 7 ngày, không cần thẻ.` | — | **OK** — natural, action-led. "Cô Mercy" is the deliberate teacher-character framing. | — |
| line 103 (H1 VI) | `Ngoại ngữ cho người Việt và Tiếng Việt cho thế giới nói tiếng Anh` | `Foreign languages for Vietnamese learners and Vietnamese for the English-speaking world` (line 106) | **OK** — canonical brand line. | — |
| line 110 (sub VI) | `Sửa lỗi tiếng Anh của người Việt, giải thích bằng tiếng Việt. AI thầy giáo hiểu cách người Việt học.` | — | **OK** — natural, learner-centric, the "lỗi" here is the legitimate diagnostic usage (named referent: "tiếng Anh của người Việt") not shame language. | — |
| line 119 (CTA primary) | `Tôi học ngoại ngữ` | — | **OK** — first-person speech-act framing, very on-voice. | — |
| line 127 (CTA secondary, EN) | — | `I'm learning Vietnamese` | **OK** (EN; the VI-pair-mirror direction) | — |
| line 135 (trial H2) | `Thử phát âm — không cần đăng nhập` | `Try pronunciation — no signup needed` (line 138) | **OK** — friction-killer, natural, low-stakes. | — |
| line 141 (trial copy) | `Nói một câu, nhận điểm phát âm trong 12 giây.` | — | **OK** — concrete numeric, action-led. | — |
| line 149 (trial CTA) | `Nói thử ngay →` | — | **OK** — imperative, energetic, the `→` reinforces forward motion. | — |
| line 156 (why H2) | `Vì sao MercyBlade` | — | **OK** — title-cased phrase, natural. | — |
| line 160 (col1 title) | `Học bằng tiếng Việt` | — | **OK** | — |
| line 161 (col1 body VI) | `AI thầy giáo của bạn nói tiếng Việt như thầy giáo thật. Sửa lỗi tiếng Anh của người Việt, không phải lỗi chung chung.` | `Your AI teacher speaks Vietnamese like a real teacher — fixing the mistakes Vietnamese learners actually make, not generic ones.` | **OK** — the contrastive structure ("không phải lỗi chung chung") reads naturally in VI. | — |
| line 165 (col2 title) | `Điểm phát âm tức thì` | — | **OK** | — |
| line 166 (col2 body VI) | `Nói một câu, biết điểm trong 12 giây. Sửa từng âm, không phải sửa cả câu.` | `Say a sentence, see your score in 12 seconds. Fix each sound, not the whole sentence.` | **OK** | — |
| line 170 (col3 title) | `Cầu nối ngôn ngữ` | — | **OK** — poetic, fits brand voice. | — |
| line 171 (col3 body VI) | `Người Việt học ngoại ngữ. Người nước ngoài học tiếng Việt. Cùng một nền tảng — vì ngôn ngữ không có ranh giới một chiều.` | `Vietnamese learners study foreign languages. The world learns Vietnamese. One platform — language has no one-way border.` | **OK** — the rhetorical parallelism survives the translation; both feel natural. | — |
| line 180 (founder line) | `Được tạo bởi Chau Doan — kỹ sư phần mềm tại Canada, sáng lập viên MercyBlade.` | — | **OK** — fact-stating, no metric inflation. | — |
| line 188 (FAQ H2) | `Câu hỏi thường gặp` | — | **OK** — standard idiomatic | — |
| line 191 (FAQ q1) | `Tại sao không dùng Duolingo?` | — | **OK** — direct, conversational | — |
| line 192 (FAQ a1) | `Duolingo dạy chung cho mọi người. MercyBlade sửa đúng những lỗi tiếng Anh mà người Việt hay mắc — và giải thích bằng tiếng Việt, như một người thầy thật sự ngồi cạnh bạn.` | — | **OK** — the "người thầy thật sự ngồi cạnh bạn" image is the on-brand Mercy-as-companion frame. | — |
| line 195 (FAQ q2) | `Có phí không?` | — | **OK** — short, conversational, the way a learner would ask. | — |
| line 199 (FAQ a2) | `Có gói miễn phí để bắt đầu. Gói trả phí (theo tháng hoặc theo năm) mở toàn bộ phòng học. Xem chi tiết tại trang Giá.` | — | **OK** — concise, action-led. | — |
| line 205 (FAQ q3) | `Làm sao bắt đầu?` | — | **OK** | — |
| line 208 (FAQ a3) | `Chọn "Tôi học ngoại ngữ" và trả lời vài câu hỏi ngắn trong 60 giây. Bắt đầu ngay →` | — | **OK** — references the primary CTA by literal text + concrete time bound. | — |
| line 235 (legal) | `Quyền riêng tư` | — | **OK** | — |
| line 237 (legal) | `Điều khoản` | — | **OK** | — |

**Verdict for MarketingLandingPage.tsx**: **27/27 strings OK.** This
is the highest-quality VI surface in the app — author Chau wrote it
directly and it reads accordingly. It can serve as the reference
exemplar for the rest of the app.

### `src/pages/Home.tsx` (chrome lines only — sampled)

Home is 1192 lines and ~80% TSX/router/effect plumbing. The
user-facing VI lines are concentrated in card "shortLine" props and
section headings.

| Loc | VI | EN context | Verdict | Proposed revision |
|---|---|---|---|---|
| line 637 | `Đọc. Nghe. Tiến bộ từng ngày.` / `Đọc. Nghe. Suy ngẫm. Tiến bộ từng ngày.` | (stories card shortLine, two phone-vs-tablet variants) | **OK** — the staccato three-word rhythm survives the diacritics; very on-voice. | — |
| line 683 | `Luyện đúng định dạng, giải thích bằng tiếng Việt.` / `Luyện đúng định dạng. Hiểu sâu nhờ giải thích tiếng Việt.` | (exam-prep card shortLine) | **OK** — the longer phone-vs-tablet split is a deliberate device-density choice. | — |
| line 728 | `Biết band hiện tại, biết cách nâng lên.` / `Biết band hiện tại. Biết chính xác cách nâng lên.` | (band-test card) | **OK** | — |
| line 774 | `Biết chính xác trình độ của bạn — 6 phút.` / `Biết chính xác trình độ thật của bạn. 6–9 phút.` | (placement card) | **OK** — concrete time bound; "trình độ thật" is the on-brand un-flattering-yet-not-shaming framing. | — |
| line 849 | `Đúng định dạng Bộ. Đạt chuẩn đầu ra.` / `Học đúng định dạng Bộ Giáo dục. Đạt chuẩn đầu ra.` | (VSTEP card) | **OK** — "Bộ" abbreviation is fine in VN context where the Ministry of Education is the obvious referent. | — |

Sampled 5 of ~25 short-line card strings; the remainder match the
same pattern (short, declarative, action-led, no shame). Full
catalog deferred to Phase 2 — no red flags surfaced in the sample.

### `src/pages/WeakAt.tsx`

Forty-four lines, four strings.

| Loc | VI | EN | Verdict | Proposed revision |
|---|---|---|---|---|
| line 25 (h1) | `Điểm yếu của bạn` | `What you're working on` (line 31) | **OK** but worth flagging — "Điểm yếu" is literally "weak point", which the audit usually flags. In context the EN companion *"What you're working on"* deliberately reframes — the page chrome carries both registers and the second softens the first. Acceptable but borderline. | (none — the EN reframe is the safety net per `docs/voice-guidelines-vn.md` Rule 4 *"permission to rest is named, not implied"* — though the strict 1:1 EN translation of *"điểm yếu"* would be *"weak point"*, the EN here intentionally diverges to set the frame) |
| line 34–35 (subtitle) | `Tổng hợp từ thiết bị này (phát âm + ngữ pháp + placement) — không gửi lên server. Càng luyện càng chính xác.` | — | **OK** — privacy claim is concrete; "Càng luyện càng chính xác" is on-voice. | — |

### `src/components/stage-3b/SuggestedPracticeList.tsx`

Already audited and revised by C5 in `!24`. Re-checked for residual risks.

| Loc | VI | EN | Verdict | Proposed revision |
|---|---|---|---|---|
| line 128 (heading) | `Gợi ý luyện tập` | `Suggested practice` (line 131) | **OK** | — |
| line 205, 211, 217 (kind chip labels) | `Ngữ pháp` / `Trình độ` / `Phát âm` | (aria-label only) | **OK** — three-word taxonomy, native. | — |
| line 247 (empty state) | `Chưa có gợi ý nào — luyện thêm vài bài để Mercy hiểu bạn rõ hơn.` | `Suggestions appear after a few lessons.` (line 250) | **OK** — C5's revision reads warm; "để Mercy hiểu bạn rõ hơn" is the Mercy-as-companion frame done right. | — |

### `src/stage-3b/suggestedPractice.ts`

Three rationale templates emitted by the engine.

| Loc | VI | Verdict | Proposed revision |
|---|---|---|---|
| line 65 | `Bạn đã gặp mẫu này ${topL1.count} lần gần đây.` | **OK** — C5 revised from `"Mẫu này đã xuất hiện…"` to `"Bạn đã gặp mẫu này…"`, which puts the learner (not the pattern) as the subject — on-voice. | — |
| line 78 | `Từ bài kiểm tra trình độ của bạn.` | **OK** — pithy, source-attributing, on-voice. | — |
| line 92 | `Khoảng ${errorPct}% chưa chính xác trong ${topPron.samples} lần luyện gần đây.` | **OK** — "chưa chính xác" is the kindness frame (still-working-on, not failed); "khoảng" softens the percentage from a verdict to an observation. | — |

---

## Tier 2 — Learner-language layer (canonical catalog)

### `src/lib/stage-3a/taxonomy.ts`

The single source of truth for engineer-tag → learner-facing
bilingual descriptions. 65 L1 entries + 6 phoneme axes + 31
placement weakness entries = **102 catalog entries × {shortVi,
shortEn, exampleVi?, exampleEn?} ≈ ~280 strings**.

Spot-checked all 65 L1 entries + all 6 phoneme axes + 12 of 31
placement entries during the Stage 3B marketing-spec authoring.
Summary:

| Sample | Quality | Notes |
|---|---|---|
| `vi_l1_3rd_person_s.shortVi` | OK | `Hay quên thêm -s sau he, she, it.` — "Hay" softens to "tend to" not "always" — exactly right. |
| `vi_l1_no_aux_negation.shortVi` | OK | `Phủ định cần don't, doesn't, didn't.` — neutral, prescriptive, no learner-blame. |
| `vi_l1_co_transfer.shortVi` | OK | `Có trong tiếng Việt dịch sang have hoặc there is.` — names the L1-interference mechanic explicitly without judgment. |
| `PHONEME_AXIS.TH_T.shortVi` | OK | `Âm th tiếng Anh hay bị nhầm thành t.` — passive-voice "bị nhầm" depersonalizes the error from "you mispronounce" to "the sound gets mistaken" — kind. |
| `PHONEME_AXIS.R_L.shortVi` | OK | `Âm r và l tiếng Anh hay bị trộn lẫn.` — same passive softener. |
| `PLACEMENT.th_stopping_and_fronting.shortVi` | OK | `Âm th hay bị thay bằng t hoặc f.` — same pattern. |
| `PLACEMENT.past_tense_unmarked.shortVi` | OK | `Hành động quá khứ cần dấu hiệu trên động từ.` — pedagogical-precise. |
| `FALLBACK` (unknown tag) | OK | `Một mẫu câu bạn còn đang luyện.` — "còn đang luyện" is the canonical kindness-frame for unknown patterns. **This single string is a model for the whole codebase.** |

**Verdict for taxonomy.ts**: **systematically on-voice across the
sampled ~80 entries.** The taxonomy is the highest-quality
bilingual catalog in the codebase. Future authoring should treat it
as the reference exemplar for any new learner-language strings.

The unsampled remainder (~20 placement entries — discourse cluster,
pragmatics cluster) was eyeballed at the surface level and shows the
same patterns ("hay" softening, passive-voice depersonalization, no
shame triggers, ≤12-word constraint honored).

### `src/lib/teacher-mercy/tierScripts.ts`

Mercy's greeting + encouragement scripts, keyed by tier. 100% of
strings carry both `en` + `vi`. Sampled the level0 + level1 blocks
(the lowest-confidence tiers, where shame risk is highest).

| Sample | VI | Verdict |
|---|---|---|
| level0 greeting #1 | `Chào mừng {{name}}. Cùng học từng bước một nhé.` | **OK** — particle "nhé" carries the warm/familiar register without crossing into infantilizing. |
| level0 greeting #5 | `Mừng bạn ở đây, {{name}}. Mình sẽ đi theo nhịp khiến bạn thấy an tâm.` | **OK** — first-person "mình" + "an tâm" framing is the Mercy-as-companion canon. |
| level0 greeting #6 | `Chào mừng trở lại, {{name}}. Nỗ lực của bạn vẫn đáng quý, dù thật lặng lẽ.` | **OK** — the "dù thật lặng lẽ" tail explicitly validates quiet/low-volume practice — a Rule 4 (permission-to-rest) line. |
| level0 encouragement #3 | `Bạn không cần hoàn hảo — chỉ cần có mặt.` | **OK** — pithy, anti-perfectionism. Strong line. |
| level0 encouragement #4 | `Nếu hôm nay nặng nề, mình sẽ chia nhỏ để bạn dễ mang hơn.` | **OK** — explicit acknowledgement of emotional weight + offer of help. The clearest companion-voice example in the codebase. |

**Verdict for tierScripts.ts level0**: **systematically on-voice.**
Author has internalized voice-guidelines-vn.md Rules 1 + 4. No
revisions warranted in the sampled blocks.

Level1–level5 tiers + emotion scripts were not exhaustively sampled
in this pass; they should be re-audited in Phase 2 against the same
bar, but no surface-level red flag pattern was visible.

### `src/lib/teacher-mercy/teacherScripts.ts`

Correction-templating engine. The output is computed at runtime via
string interpolation, so strings live as templates with
substituted segments. Spot-checked one representative line:

| Loc | Template (line 757) | Verdict |
|---|---|---|
| 757 | `vi: \`Dùng "${stripSentencePunctuation(correction.fix)}", không dùng "${stripSentencePunctuation(correction.error)}"\`` | **OK** as a template — but worth a Phase 2 check on the runtime-rendered output for edge cases (very long fixes, fixes containing quotes, fixes containing Vietnamese diacritics in unexpected positions). Template is correct; rendered output should be sanity-checked in a separate pass. |

### `src/lib/l1-profiles/vi.ts` (124 VI lines) and `src/lib/feedback/l1-vn-explanations.ts` (190 VI lines)

These two files together are the **deep instructional layer** — the
AI Tutor uses them to render explanations when a Vietnamese learner
hits an L1-interference pattern. Markdown formatting embedded.

**Sample from `l1-vn-explanations.ts`:**

- `Thêm **-s** cho he/she/it` — short title, OK.
- `Tiếng Việt động từ không đổi. Tiếng Anh phải thêm **-s** (hoặc **-es**) khi chủ ngữ là he, she, it.` — contrastive L1-vs-L2 framing, pedagogical-precise, no shame, OK.
- `Quá khứ — phải đổi động từ` — declarative, OK.
- `Tiếng Việt mình hay chỉ cần từ chỉ thời gian như 'hôm qua'. Tiếng Anh **luôn phải đổi** động từ sang quá khứ.` — "Tiếng Việt mình" is the warm/inclusive first-person register Mercy uses elsewhere — on-voice.

**Verdict for the l1-explanations layer**: **systematically
on-voice.** Phase 2 should still do a full pass for the remaining
~95% of entries — there are 65 L1 tags × ~4 strings each =
~260 strings here — but the sample carries no red flags.

### `src/lib/feedback/rule-packs/vi/explanations.ts` (78 VI lines)

Detector-rule-pack explanations. Not sampled in this pass — Phase 2.

### `src/data/placement/vnL1Interference.ts` (108 VI lines)

The canonical 37-pattern `VN_L1_INTERFERENCE_PATTERNS` array that
feeds the Stage 3A placement-weakness taxonomy. Not user-facing
directly; the taxonomy renders these via `PLACEMENT_DESCRIPTIONS`
(already audited above). Cataloged here for traceability only.

---

## Tier 3 — File-level survey of remaining UI chrome

For files not exhaustively cataloged above, this table records:
total VI-touching line count, the surface's user role, a
sampled-string verdict, and whether it's flagged for Phase 2.

| File | VI lines | Role | Sample verdict | Phase 2? |
|---|---|---|---|---|
| `src/pages/AccountPage.tsx` | ~120 (in a 1058-line file) | Post-login account chrome — settings, profile, preferences | Not sampled in this pass; Phase 2 priority — settings copy is high-touch and often where MT-feel creeps in. | **YES — priority** |
| `src/pages/LoginPage.tsx` | ~80 (in 687 lines) | Auth chrome — sign-in/up forms, error states | Phase 2 — error-state strings are the highest shame-risk category outside streak surfaces. | **YES — priority** |
| `src/pages/Tiers.tsx` | ~60 | Pricing surface | Phase 2 — pricing copy directly affects conversion. | **YES — priority** |
| `src/pages/Billing.tsx` + `BillingSuccess(Page).tsx` | ~70 | Post-payment + invoice chrome | Phase 2. | YES |
| `src/pages/Privacy.tsx` (103 VI lines) | 103 | Legal — privacy policy | Legal text; revision discretion belongs to author. Verdict pending legal review, not copy review. | NO (out of copy-audit jurisdiction) |
| `src/pages/Terms.tsx` | ~80 | Legal — terms | Same as Privacy. | NO |
| `src/pages/Support.tsx` | ~50 | Help / contact | Phase 2. | YES |
| `src/pages/AiTutor.tsx` | ~120 | Conversation surface — the core learning interface | **HIGH priority Phase 2** — this is where Mercy's runtime voice meets the learner; consistency with `teacher-mercy/tierScripts.ts` matters most here. | **YES — top priority** |
| `src/pages/RoleplayPage.tsx` | ~70 | Roleplay scenarios | Phase 2. | YES |
| `src/pages/SpeechDrillPage.tsx` | ~60 | Pronunciation drill chrome | Phase 2. | YES |
| `src/pages/Progress.tsx` | ~50 | Progress dashboard — covered in voice-guidelines-vn.md scope but worth re-confirming the streak-audit fixes still hold | Phase 2 — light pass to confirm no regression since the streak-shame audit. | YES (regression check) |
| `src/pages/Stories.tsx` | ~40 | Reading-stories index | Phase 2. | YES |
| `src/pages/listening/Library.tsx` | ~30 | Listening library | Phase 2. | YES |
| `src/pages/Referral.tsx` | ~30 | Referral CTA chrome | Phase 2. | YES |
| `src/pages/Unsubscribe.tsx` | ~20 | Email unsub page | Phase 2 (low priority). | YES |
| `src/pages/CertVerifyPage.tsx` | ~20 | Certificate verify | Phase 2 (low priority). | YES |
| `src/pages/corporate/*.tsx` | ~50 | Corporate onboarding/join | Phase 2 (B2B surface, different register). | YES |
| `src/pages/teacher-portal/*.tsx` | ~40 | Teacher-portal review queue | Phase 2 (internal-staff surface, lower stakes). | YES |
| `src/pages/PronunciationSRSSessionPage.tsx` | ~30 | SRS session chrome | Phase 2. | YES |
| `src/pages/MarketingLandingPage.tsx` | (audited above) | — | OK | NO |
| `src/pages/Home.tsx` (full) | (sampled above) | — | OK at sample density; full catalog deferred | Phase 2 (low priority — sample showed no issues) |
| `src/pages/WeakAt.tsx` | (audited above) | — | OK | NO |
| `src/pages/home/LanguageTrackHome.tsx` | ~40 | Per-language home chrome | Phase 2. | YES |

**Components dirs** (sampled string density only — no per-string catalog):

| Dir | VI lines | Surface family | Phase 2? |
|---|---|---|---|
| `src/components/mercy-guide/` | ~400 | The companion bubble + tabs (Journey, Grammar, Speak, Logic). Mercy's runtime voice. | **YES — top priority pair with `AiTutor.tsx`** |
| `src/components/ai-tutor/` | ~250 | AI tutor row primitives | YES priority |
| `src/components/onboarding/` | ~180 | Onboarding picker chrome — first impression for signed-up users | **YES — priority** |
| `src/components/billing/` | ~120 | Billing flows | YES |
| `src/components/account/` | ~90 | Account-page sub-components | YES |
| `src/components/exam-prep/{ielts,toefl,toeic}/` | ~280 (combined) | Exam-prep surfaces | YES |
| `src/components/feedback/` | ~80 | Error / feedback chrome | YES priority |
| `src/components/kids/` | ~100 | Kids-mode surface | **CAUTION** — per CLAUDE.md non-negotiable #2, Kids mode is sacred; any copy change requires extra review |
| `src/components/mercy/` | ~70 | Mercy character mounts | YES |
| `src/components/leaderboard/` | ~40 | Leaderboard chrome — covered partly by voice-guidelines-vn.md | YES (regression check) |
| `src/components/family/`, `src/components/groups/`, `src/components/contribute/`, `src/components/certificates/`, `src/components/gift/`, `src/components/corporate/`, `src/components/iap/`, `src/components/keyboard/`, `src/components/languages/`, `src/components/layout/`, `src/components/audio/`, `src/components/admin/`, `src/components/auth/` | ~50 each | Various secondary surfaces | YES (sweep) |

**Total Tier-3 line count (un-cataloged)**: roughly 2,400 VI lines
across pages + components, distributed across ~80 files. Phase 2
should process them in priority order (priority files marked above).

---

## Findings summary

1. **The high-leverage surfaces are systematically on-voice.**
   `MarketingLandingPage.tsx`, `WeakAt.tsx`, Stage 3B strings, the
   Stage 3A taxonomy, and the level0 Mercy scripts all read as if
   written by a Vietnamese-native speaker — because they were (Chau
   directly authored marketing, C5 revised Stage 3B, the taxonomy
   was reviewed during the L1-detector campaign). No shame triggers
   surfaced in any Tier-1 + Tier-2 cataloged string.

2. **The unsampled remainder (~2,400 VI lines across ~80 files) is
   the actual unknown.** The audit cannot conclude *"the whole app
   is on-voice"* from the Tier 1+2 sample alone. Phase 2 must
   process the priority files (`AccountPage`, `LoginPage`, `Tiers`,
   `AiTutor`, `mercy-guide/`, `onboarding/`) before any conclusion
   about app-wide bilingual quality can be drawn.

3. **No machine-translation tells in cataloged strings.** The
   common MT-feel patterns — over-use of "thật" / "rất" / "luôn",
   English word order, calque idioms ("vào ngày khác" instead of
   "hôm khác"), formal register where casual was warranted — did
   not appear in any cataloged string. This is consistent with the
   provenance: human authors wrote these surfaces.

4. **Borderline cases worth re-checking in Phase 2.** Two patterns
   merit a light pass:
   - `/weak-at` page title `Điểm yếu của bạn` — the "Điểm yếu"
     framing is rescued by the EN companion's reframe (*What you're
     working on*) and the soft subtitle, but a future revision
     could push the VI itself further toward growth-zone framing
     (e.g. *"Điều bạn đang luyện"* — *"What you're practicing"*).
     Not a defect; a stylistic opportunity.
   - `tierScripts.ts` level1+ tiers were not sampled. Confidence
     that level0's voice extends upward through level5 + emotion
     scripts is **inferred, not verified**.

5. **The voice-guidelines-vn.md canon is being honored on the
   surfaces that touch its scope.** No `dc2626` red was found on
   user scores in the cataloged surfaces, no countdown patterns, no
   comparison-shaming. Streak/leaderboard/progress regression check
   in Phase 2 is a confirmation pass, not a re-audit.

6. **Mercy-as-companion voice is the strongest pattern.** The level0
   tier scripts (`Chào mừng… Mercy sẽ đồng hành cùng bạn`, `Mình sẽ
   đi theo nhịp khiến bạn thấy an tâm`, `Nếu hôm nay nặng nề, mình
   sẽ chia nhỏ để bạn dễ mang hơn`) define the canonical voice for
   any future copy. This is captured in
   `docs/copy/vi-style-guide.md` as the reference exemplar.

## Phase-2 follow-up scope

A separate wave should:

1. Process priority Tier-3 files (mercy-guide/, AiTutor.tsx,
   AccountPage.tsx, LoginPage.tsx, Tiers.tsx, onboarding/,
   feedback/) — author per-file catalog rows + apply revisions
   in-place.
2. Full pass on `tierScripts.ts` level1–level5 + emotion scripts.
3. Sweep `l1-vn-explanations.ts` (the remaining ~95% of entries
   not sampled here).
4. Streak/leaderboard/progress regression check against
   `docs/voice-guidelines-vn.md`.
5. Runtime sanity check on `teacherScripts.ts` correction-template
   rendered output for edge cases.
6. Pedagogical content (in `src/data/` and `src/languages/`) stays
   out of scope — it has its own VI sweep policy
   (`project_vi_sweep_policies`).

The Phase-2 wave should land in **per-priority-file MRs** (not one
giant sweep MR), so reviewers can read each surface against the
style guide without scrolling through hundreds of unrelated string
changes.

## Phase-2 progress — per-file appendix audits

To keep each surface's audit independently scannable (and to let
parallel Phase-2 work land without merge conflicts on this doc),
per-file audits live as siblings in `docs/copy/audits/` rather than
appended sections in this file. Each appendix uses the same
verdict framework (`§Method` above) and the same `vi-style-guide.md`
reference set.

| Audit | Surface | Strings | Verdict summary |
|---|---|---|---|
| [`docs/copy/audits/AiTutor.tsx.md`](audits/AiTutor.tsx.md) | `/ai-tutor` — Logic mode openers + lesson-loop chrome | 7 | **7/7 OK** — no defects; two stylistic borderline notes. Strong surface. |
| [`docs/copy/audits/MercySpeakTab.tsx.md`](audits/MercySpeakTab.tsx.md) | `mercy-guide/MercySpeakTab` — pronunciation surface, mic errors, per-word breakdown | 32 | **27/32 OK + 5 revision candidates**: 3 awkward (`Hãy` bare imperatives × 2, `You` English fallback), 1 MT-feel (`mobile` untranslated, line 1769), 1 ordering inconsistency (4 strings reverse to EN · VI — should flip back to VI · EN). |
| [`docs/copy/audits/AccountPage.tsx.md`](audits/AccountPage.tsx.md) | `/account` — settings, membership, destructive actions | 34 | **30/34 OK + 4 revision candidates**: 1 pronoun inconsistency (`tôi` on system-spoken label), 1 ambiguous heading (`Ngôn ngữ học`), 2 minor (`&` instead of `và`, `Chính sách bảo mật` vs `quyền riêng tư` alignment). |

**Files audited so far (Phase-2 #1):** 3 of the priority list named
above (`AiTutor.tsx`, `MercySpeakTab.tsx`, `AccountPage.tsx`).
Source strings unchanged in that MR (`!42`) — diagnostic only, per
the Phase-2 ground rule that revisions land per-file in follow-up
MRs.

**Revisions shipped (Phase-2 #2 — `!48`):** all 9 revision
candidates from the `!42` audit landed as actual source-string
changes. `AiTutor.tsx` had 7/7 OK and contributed no revisions.
`MercySpeakTab.tsx` and `AccountPage.tsx` revisions broken out:

| Site | Before | After | Notes |
|---|---|---|---|
| `MercySpeakTab.tsx:1125` | `Hãy thu âm trước · Record first` | `Thu âm trước · Record first` | drops `Hãy` bare imperative |
| `MercySpeakTab.tsx:1769` | `Mobile audio retest · Kiểm tra âm thanh mobile` (EN · VI) | `Kiểm tra lại âm thanh điện thoại · Mobile audio retest` (VI · EN) | flips ordering + replaces `mobile` calque |
| `MercySpeakTab.tsx:1825` | `Copied anonymized diagnostics · Đã sao chép …` (EN · VI) | `Đã sao chép chẩn đoán ẩn danh · Copied anonymized diagnostics` (VI · EN) | flips ordering |
| `MercySpeakTab.tsx:1827` | `Diagnostics copy failed. Please try again. · … Hãy thử lại.` (EN · VI) | `Không sao chép được. Thử lại nhé. · Diagnostics copy failed. Please try again.` (VI · EN) | flips ordering + drops `Hãy` imperative (replaced with `nhé` particle) + drops VI noun repetition |
| `MercySpeakTab.tsx:1828` | `Anonymized, last 5 events only · Ẩn danh, chỉ 5 sự kiện gần nhất` (EN · VI) | `Ẩn danh, chỉ 5 sự kiện gần nhất · Anonymized, last 5 events only` (VI · EN) | flips ordering |
| `MercySpeakTab.tsx:1976` | `'You'` (EN-only fallback in VI surface) | `'Bạn · You'` | adds VI; matches bilingual surface convention |
| `AccountPage.tsx:612` | `vi="Tiến độ của tôi"` | `vi="Tiến độ"` | drops possessive to sidestep `bạn` vs `tôi` consistency conflict; the `/progress` destination page keeps its `Tiến độ của tôi` title (the audit's second proposed form taken over the first, because changing to `Tiến độ của bạn` would break the cross-file mirror with `streakCopy.ts` and `Progress.tsx`) |
| `AccountPage.tsx:783` | `Bảng xếp hạng & tùy chọn` | `Bảng xếp hạng và cài đặt` | replaces `&` with `và` + uses `cài đặt` for "settings" |
| `AccountPage.tsx:799` | `Ngôn ngữ học` | `Ngôn ngữ đang học` | resolves the linguistics-vs-learning-languages ambiguity |
| `AccountPage.tsx:831` | `vi="Chính sách bảo mật"` | `vi="Chính sách quyền riêng tư"` | aligns with section heading `Quyền riêng tư` at line 812 |

10 source-line edits across 2 files; no test changes (existing test
regexes are EN-substring-anchored and still match the new bilingual
strings). `npm run typecheck:ci` + ESLint + vitest 100/100 across
the mercy-guide subtree + 41/41 across the streak subtree pass.

**Files audited (Phase-2 #3):** 3 more priority files. Diagnostic
only — no source string changes; revisions landed in the Phase-2 #4
sub-section below.

| Audit | Surface | Strings | Verdict summary |
|---|---|---|---|
| [`docs/copy/audits/LoginPage.tsx.md`](audits/LoginPage.tsx.md) | `/signin` — email + phone + OAuth + bilingual marketing panel | 22 | **18/22 OK + 4 revision candidates**: 3 EN-only success notices (lines 287, 292, 298) on a VI-primary surface — easy fix, mirror the `${vi}\n${en}` shape `mapAuthRedirectError` already uses; 1 borderline `Vui lòng đợi…` on OAuth busy buttons. The §254 "auth = shame risk" hypothesis did NOT pan out — `humanizeAuthError` + `mapAuthRedirectError` emit bilingual errors. |
| [`docs/copy/audits/Tiers.tsx.md`](audits/Tiers.tsx.md) | `/tiers` — per-tier room-count diagnostic page | 7 | **7/7 OK.** No revisions. **⚠ Audit re-categorization needed:** this file is NOT the consumer pricing surface §255 implied — it is an internal tier/room-count diagnostic. The consumer pricing surface is `src/screens/Pricing.tsx`. The Phase-2 priority slot in §255 should reassign to `Pricing.tsx`. |
| [`docs/copy/audits/MercyEnglishTab.tsx.md`](audits/MercyEnglishTab.tsx.md) | `mercy-guide/MercyEnglishTab` — English-immersive vocab/example help | 12 | **2/3 VI strings OK + 1 revision candidate** (`room` untranslated on line 59 vs `phòng này` on line 163 — same file, same concept). Picked as the **non-kids substitute for `MercyTeacherTab.tsx`** (which imports `kidsDataLoader` + carries `isKidsMode` — CC2's lane). |

**Audit-process findings worth promoting:**

1. **The §255 priority entry mis-targets `Tiers.tsx`.** The
   audit's "pricing surface" priority is actually
   `src/screens/Pricing.tsx`. Re-route the priority slot in a
   follow-up doc-update; this batch's audit covers the
   mis-categorized file and confirms it's a 7/7-OK diagnostic.
2. **`MercyTeacherTab.tsx` (1,734 lines, second-highest VI
   density in `mercy-guide/`) is kids-mode-coupled** (imports
   `kidsDataLoader`, has `isKidsMode` prop, references
   `/images/mercy-kids*` paths). It belongs in CC2's kids-mode
   lane; do not assign it to a non-kids Phase-2 auditor.
3. **`useChromeT` (`t({vi, en})`) is the cleanest bilingual
   pattern in the codebase.** `LoginPage.tsx` routes 18 surfaces
   through it; every one passes the §5 quick-checklist. Worth
   promoting to `vi-style-guide.md` §6 as the recommended
   bilingual-pairing mechanism for new chrome.
4. **The `room` vs `phòng` drift surfaced in MercyEnglishTab is a
   codebase-wide style question.** Pinning `phòng` as the VI for
   "lesson room" (with `room` reserved for internal codenames) is
   a one-line style-guide decision worth making.

**Revisions shipped (Phase-2 #4):** the non-optional revision
candidates from the Phase-2 #3 batch landed as source-string
changes. Tiers.tsx had 7/7 OK and contributed no revisions.
LoginPage.tsx and MercyEnglishTab.tsx revisions broken out:

| Site | Before | After | Notes |
|---|---|---|---|
| `LoginPage.tsx:287` | `✅ You've been signed out.` (EN-only) | `✅ Bạn đã đăng xuất.\n✅ You've been signed out.` (bilingual) | mirror the `${vi}\n${en}` shape `mapAuthRedirectError` already uses on the error path |
| `LoginPage.tsx:292` | `✅ Account created. You can sign in now.` (EN-only) | `✅ Đã tạo tài khoản. Bạn có thể đăng nhập ngay.\n✅ Account created. You can sign in now.` (bilingual) | same shape |
| `LoginPage.tsx:298` | `✅ Password updated. You can sign in now.` (EN-only) | `✅ Đã cập nhật mật khẩu. Bạn có thể đăng nhập ngay.\n✅ Password updated. You can sign in now.` (bilingual) | same shape |
| `MercyEnglishTab.tsx:59` | `Mở một room để học từ vựng và câu mẫu từ chính nội dung đó.` | `Mở một phòng học để học từ vựng và câu mẫu từ chính nội dung đó.` | replaces untranslated `room` with `phòng học`; aligns with `phòng này` already used at line 163 |

4 source-line edits across 2 files; no test changes (no existing
test matches the changed strings). `npm run typecheck:ci` + ESLint +
vitest pass.

The five "(optional)" candidates flagged in the Phase-2 #3 batch
(LoginPage.tsx:470 drop-agent subtitle, LoginPage.tsx:592
`Vui lòng đợi…` → `Đang xử lý…`, Tiers.tsx:189 fallback-label
ordering flip, MercyEnglishTab.tsx:215 EN-first → VI-first) stay
deferred — they are stylistic improvements, not defects, and the
audit doc records the alternative wording for a future author.

The four "(optional)" candidates leftover from the batch-1 audits
(MercySpeakTab.tsx:1159 tighter VI, MercySpeakTab.tsx:1646 bilingual
affordance, AccountPage.tsx:885 mirror EN `reset`, AiTutor.tsx:931
tighter EN-VI pair) stay deferred for the same reason.

**Files audited (Phase-2 #5):** 3 more priority files. Diagnostic
only — no source string changes; revisions will queue for a
follow-up sweep MR (Phase-2 #6).

| Audit | Surface | Strings | Verdict summary |
|---|---|---|---|
| [`docs/copy/audits/Pricing.tsx.md`](audits/Pricing.tsx.md) | `/pricing` + `/upgrade` — consumer pricing surface (hero + plan cards + comparison + subscription disclosure) | 26 | **22/26 OK + 4 revision candidates**: 3 plan-card `bullets` arrays are EN-only on a VI-primary surface (the page's main bilingual-contract gap — 9 EN-only value-prop bullets total across Free/Monthly/Yearly), 1 EN-first ordering on the disclosure-footer link pair (`Terms of Use (EULA) / Điều khoản sử dụng` + `Privacy Policy / Chính sách bảo mật` should flip). Includes a cross-file alignment opportunity: propagate `AccountPage.tsx:831`'s shipped `Chính sách quyền riêng tư` revision to the same link here. |
| [`docs/copy/audits/UnifiedMercyChat.tsx.md`](audits/UnifiedMercyChat.tsx.md) | `mercy-guide/UnifiedMercyChat` — single-stream Mercy chat panel (Unified mode) | 16 | **16/16 OK** — no defects. Picked as the **non-kids mercy-guide file** alongside `MercyEnglishTab.tsx` (audited in Phase-2 #3). One cross-cutting finding worth promoting: this file uses `em` (younger-sibling pronoun) as the consistent learner-address register, distinct from `bạn` elsewhere. Worth codifying in `vi-style-guide.md` §1. Plus the encouragement-inline template at line 350–352 is one of the strongest no-shame strings in the codebase — exemplar candidate for §6. |
| [`docs/copy/audits/Billing.tsx.md`](audits/Billing.tsx.md) | `/billing` — signed-in billing management (status + cards + actions + notices) | 28 | **27/28 OK + 1 revision candidate**: line 599's `Auto-renew` value (`On` / `Off — cancels at period end`) is EN-only inside an otherwise-bilingual card (the LABEL has VI `Tự động gia hạn` at line 598, but the VALUE doesn't). All status labels, all `UiMessage { en, vi }` notices, all plan-button states are clean bilingual pairs. The `VIETNAMESE_SUB_STYLE` muted-subscript pattern is consistent + worth promoting to `vi-style-guide.md` §6 as the canonical inline-status bilingual shape. |

**Audit-process findings worth promoting:**

1. **The `em` pronoun is the dominant Mercy-conversational
   register** in three non-kids mercy-guide files
   (`UnifiedMercyChat.tsx`, plus inferred presence in
   `MercySuggestTab.tsx` and `MercyGuidePanel.tsx` — both pending
   audit). `vi-style-guide.md` §1's pronoun table currently lists
   `bạn` (learner) and `mình` (Mercy) but does not codify `em`.
   Worth a §1 update: `em` for the Mercy-conversational
   surfaces (warm-elder-sister voice), `bạn` for system-spoken /
   settings / page-chrome surfaces.
2. **The plan-card `bullets: string[]` array in `Pricing.tsx`
   ships EN-only** (9 strings across 3 plans). The fix requires
   touching the `Plan` type (add `bulletsVi?: string[]`) AND the
   render path — higher cost than a string-only edit but the
   single highest-impact VI-primary contract gap on the page.
   Revision authors: scope this as a structural change, not a
   single-line swap.
3. **Two bilingual-pairing patterns coexist in the codebase**: the
   `BiText { en, vi }` component (`Pricing.tsx`, others) AND the
   `VIETNAMESE_SUB_STYLE` muted-subscript pattern (`Billing.tsx`,
   `AccountPage.tsx`). Both are on-voice when applied
   consistently. Worth a `vi-style-guide.md` §6 entry comparing
   them: `BiText` for inline action labels + free-form bilingual
   prose; subscript for compact inline status/state labels in
   data-dense cards.
4. **`Vui lòng + bare verb` is a recurring borderline pattern.**
   Appears 4× in `Billing.tsx`'s error notices (acceptable per
   §3), 1× in Pricing.tsx's error banner, 1× in `Billing.tsx`'s
   `canceledLike` informational notice (borderline — softer
   alternatives exist). The §3 rule "acceptable on technical-
   failure errors with no honorific subject" continues to hold;
   the audit recommends NOT tightening it across the codebase
   without a deliberate register-policy decision.
5. **The `Tặng 2 tháng` (`Billing.tsx:651`) and `phòng học`
   (`Pricing.tsx:647`) patterns** are worth promoting to
   `vi-style-guide.md` §6 — they show how to translate
   commercial/product vocabulary in a way that lands warmer than
   the literal English.

**Revisions shipped (Phase-2 #6):** the non-optional revision
candidates from the Phase-2 #5 batch landed as source-string
changes. `UnifiedMercyChat.tsx` had 16/16 OK and contributed no
revisions. `Pricing.tsx` (structural plus inline edits) +
`Billing.tsx` (single inline edit) revisions broken out:

| Site | Before | After | Notes |
|---|---|---|---|
| `Pricing.tsx` `Plan` type + 3 plan objects + render path | `bullets: string[]` only (EN-only on a VI-primary surface — 9 strings) | Added `bulletsVi?: string[]` to the `Plan` type; populated all 3 plans (level0 / month / year) with 3 VI bullets each; both render paths (level0 simple + paid-plans) updated to render each EN bullet with its VI companion in a muted slate-500 sub-style. Tolerates missing/short `bulletsVi` (falls back to EN-only per index) — defensive. | Structural change. The audit's stated highest-impact bilingual-contract gap. New `bulletViStyle` uses `#64748b` (slate-500, 4.78:1 on white) per the !64 a11y-contrast audit — slate-400 (#94a3b8) is forbidden in audit-fixed files. |
| `Pricing.tsx:907` (footer terms link) | `Terms of Use (EULA) / Điều khoản sử dụng` (EN · VI) | `Điều khoản sử dụng / Terms of Use (EULA)` (VI · EN) | flips ordering to honor `vi-style-guide.md` §2 (VI must dominate). |
| `Pricing.tsx:908` (footer privacy link) | `Privacy Policy / Chính sách bảo mật` (EN · VI) | `Chính sách quyền riêng tư / Privacy Policy` (VI · EN) | flips ordering AND propagates `AccountPage.tsx:831`'s shipped `Chính sách quyền riêng tư` revision from !48 for cross-file consistency. |
| `Billing.tsx:599` (auto-renew value) | EN-only `On` / `Off — cancels at period end` inside an otherwise-bilingual card | Added a VI sub-span: `Bật` / `Tắt — sẽ hủy vào cuối kỳ` (loading state renders empty string) — matches the surrounding `VIETNAMESE_SUB_STYLE` muted-subscript shape | Single inline edit; the LABEL above (`Auto-renew` / `Tự động gia hạn`) was already bilingual, only the VALUE was EN-only. |

4 logical edits across 2 files (one structural; three inline).
No test changes needed — the existing test regexes are EN
substring-anchored and continue to match the EN halves preserved
in the bilingual composites. `npm run typecheck:ci` + ESLint +
vitest billing + pricing + a11y-contrast all green (69/69 across
the touched-area suites).

`Tiers.tsx` had 7/7 OK in the Phase-2 #3 audit and contributed no
revisions (consistent with the Phase-2 #4 batch); its single
"(optional)" fallback-label ordering flip stays deferred.

The five "(optional)" candidates flagged in the Phase-2 #5 batch
(Pricing.tsx:470 subtitle-agent-drop, Pricing.tsx:887–891 EN-only
disclosure-footer paragraph, Pricing.tsx:658–662 trust badges
without VI subtitles, Pricing.tsx:684 + 724 short CTAs without VI
subtitles, Billing.tsx:507 `Vui lòng chọn` warmer alternative,
Billing.tsx:885 EN-mirror `đặt lại` for the reset message) stay
deferred — they are stylistic improvements, not defects, and the
audit doc records the alternative wording for a future author.

The four "(optional)" candidates leftover from the batch-1 audits
plus the five "(optional)" from the Phase-2 #3 batch ALSO stay
deferred for the same reason, per the !48 + !58 + !65 precedent.

**Files audited (Phase-2 #7):** 3 more priority files — the
remaining `mercy-guide/` non-kids members plus the live
post-payment landing page. Diagnostic only; revisions will queue
for a follow-up sweep MR (Phase-2 #8).

| Audit | Surface | Strings | Verdict summary |
|---|---|---|---|
| [`docs/copy/audits/MercyGuidePanel.tsx.md`](audits/MercyGuidePanel.tsx.md) | Floating Mercy Guide panel shell — header pill + body card | 4 (non-kids only) | **3/4 OK + 1 revision candidate**: line 70 header subtitle (`Choose where you want to practice.`) is EN-only on a Mercy-surface panel. **CC2 lane note:** the panel's body card today is a Mercy Kids landing (lines 96–112) — explicitly out of scope per the dispatch's CC2 rule; audited only the panel-shell strings. Plus a structural observation: the panel currently renders ONLY the kids card body; the multi-tab body presumably ships from `UnifiedMercyChat.tsx` (separate file). |
| [`docs/copy/audits/MercySuggestTab.tsx.md`](audits/MercySuggestTab.tsx.md) | Suggest tab inside Mercy Guide — "Recommended for you" list chrome | 3 | **0/3 OK + 3 revision candidates**: the ENTIRE chrome surface is EN-only on a Mercy-conversational tab (heading + empty-state + per-item nav button). Per-item data fields (`title_vi`, `reason_vi`) are bilingual at the data layer; only the chrome is the gap. Single-file's the cleanest single-file bilingual-contract gap audited to date. |
| [`docs/copy/audits/BillingSuccessPage.tsx.md`](audits/BillingSuccessPage.tsx.md) | `/billing/success` — post-checkout landing (header + status grid + 4-button action row, 3 conditional states) | 25 | **25/25 OK** — no defects. Every conditional state of every conditional surface has a paired VI line via the file's local `viStyle` constant; uses `#64748b` (slate-500, a11y-compliant). The cleanest end-to-end bilingual page audited so far — `vi-style-guide.md` §6 exemplar candidate for "post-action confirmation page." |

**Audit-process findings worth promoting:**

1. **Em-pronoun thesis update** (from !65 `UnifiedMercyChat`
   audit): the thesis distinguishes `em` (younger-sibling
   register, Mercy-conversational surfaces) from `bạn`
   (second-person formal, system-spoken / settings /
   page-chrome surfaces). This batch's audits:
   - `MercyGuidePanel.tsx` — proposed revision uses `em`
     (extends the thesis to the panel-shell subtitle layer).
   - `MercySuggestTab.tsx` — all 3 proposed VI translations
     reach for `em` (strengthens the thesis on a third
     mercy-guide file).
   - `BillingSuccessPage.tsx` — uses `bạn` throughout
     (CONFIRMS the thesis's scope distinction; billing-result
     is system-spoken, `bạn` is correct).
   Combined: the thesis is now confirmed across 3 mercy-guide
   files AND its complement (`bạn`-on-system-spoken) is
   confirmed on the billing surface. Worth codifying in
   `vi-style-guide.md` §1.
2. **Cross-file `Vào phòng học` canonicalization continues.**
   Today the "go to room" framing appears as `Vào phòng học`
   in `MercyEnglishTab.tsx:163` (audited !53; revision !58
   resolved the `room → phòng` half-translation),
   `Pricing.tsx:647` (audited !65, shipped via !89),
   `BillingSuccessPage.tsx:231` (audited here — already
   bilingual). The proposed `MercySuggestTab.tsx` revision
   suggests `Vào phòng học` for the "Go to room" button. Worth
   promoting `Vào phòng học` (and the related `Vào lộ trình`
   for "Go to path") to `vi-style-guide.md` §6 as the
   canonical VI for navigation CTAs that lead into a learning
   surface.
3. **Two known noise files (dead duplicates) flagged this
   batch:**
   - `src/pages/BillingSuccess.tsx` — older variant of
     `BillingSuccessPage.tsx`; zero importers (`grep -rn
     'BillingSuccess[^P]' src/` confirmed). Different polling
     logic + different copy from the live page. Tracked
     source; not audited (the live page is the audit subject).
     Same shape as the `upabase/functions/stripe-webhook.ts`
     stray flagged in !80 — needs a deliberate-deletion
     dispatch, NOT a silent edit.
   - `MercyGuidePanel.tsx`'s panel-body rendering ONLY the
     kids card today is suspicious — `UnifiedMercyChat.tsx`
     ships the tab-host body separately. Whether
     `MercyGuidePanel.tsx` is itself stale-or-different-from-
     intended is a question for the next architecture pass,
     not this audit's copy verdict.
4. **A11y-compliant color choice exemplar.**
   `BillingSuccessPage.tsx`'s local `viStyle` uses `#64748b`
   (slate-500) out of the gate, matching the !64 a11y-contrast
   audit's required palette. This is the pattern other pages
   should adopt when refactoring away from `#94a3b8`
   (slate-400, forbidden in audit-fixed files). Worth a
   `vi-style-guide.md` §6 line.

**Revisions shipped (Phase-2 #8):** the non-optional revision
candidates from the Phase-2 #7 batch landed as source-string
changes. `BillingSuccessPage.tsx` had 25/25 OK and contributed
no revisions. `MercyGuidePanel.tsx` (1 revision) +
`MercySuggestTab.tsx` (3 revisions) revisions broken out:

| Site | Before | After | Notes |
|---|---|---|---|
| `MercyGuidePanel.tsx:70` (header subtitle) | EN-only `Choose where you want to practice.` | VI primary `Chọn nơi em muốn luyện hôm nay.` + EN secondary `Choose where you want to practice.` (stacked, both `text-slate-500` for a11y safety; VI larger weight) | Uses `em` per the !65 thesis (Mercy-conversational register). VI primary in DOM order per `vi-style-guide.md` §2. |
| `MercySuggestTab.tsx:24` (heading) | EN-only `Recommended for you` | `Gợi ý cho em · Recommended for you` (VI · EN inline composite) | Em-pronoun thesis applied. Single-line composite matches the existing mercy-guide sibling pattern (e.g. `MercyEnglishTab.tsx:215`). |
| `MercySuggestTab.tsx:29` (empty state) | EN-only `No suggestions yet. Explore some rooms first!` | VI primary `Chưa có gợi ý nào. Em vào vài phòng trước nhé.` + EN secondary block | Drops the EN exclamation-mark imperative in favor of the warm `em + nhé`-particle frame (per the !48 `MercySpeakTab.tsx:1827` precedent that dropped `Hãy thử lại` for `Thử lại nhé`). |
| `MercySuggestTab.tsx:56` (button label, 2 states) | EN-only `Go to path` / `Go to room` | VI · EN inline: `Vào lộ trình · Go to path` / `Vào phòng học · Go to room` | Uses the cross-file canonical `Vào phòng học` (now in MercyEnglishTab:163 post-!58, Pricing:647 post-!89, BillingSuccessPage:231). Strengthens the §6 canonicalization promotion candidate. |

4 logical edits across 2 files; no test changes (no existing
test matches the changed strings). `npm run typecheck:ci` +
ESLint + vitest a11y-contrast + mercy-guide subtree all green
(102/102 across the mercy-guide test suite). The new bilingual
markup on both files keeps slate-500 (`#64748b`) — neither file
is in the !64 `CONTRAST_FIXED_FILES` allow-list, so the a11y
test does not strictly require it, but using slate-500 keeps
both files forward-compatible if the list extends.

`BillingSuccessPage.tsx` had 25/25 OK in the Phase-2 #7 audit
and contributed no revisions (consistent with the Phase-2 #6
`UnifiedMercyChat.tsx` 16/16-OK precedent).

The two noise files flagged in Phase-2 #7 cross-cutting #3
(`src/pages/BillingSuccess.tsx` dead duplicate +
`MercyGuidePanel.tsx`'s panel-body-renders-only-kids-card
architecture question) were NOT silently edited in this MR
per the dispatch constraint. They remain on the deferred-
deletion / deferred-architecture follow-up list.

## Pilot migrations (Bilingual wrapper)

Post-!96/!110, the inline VI-primary + EN-secondary `lang`-attr
pattern had three independent implementations (W2 stage-3a/3b,
O2 onboarding, P4 Pricing). The Rule of Three was satisfied;
the extraction MR pulled the shared shape into a single
component.

**Shipped:** `src/components/Bilingual.tsx` — typed wrapper with
`vi` / `en` content props, `primary` order toggle (default
`'vi'`), `as` + `viAs` / `enAs` element overrides, parallel
`viClassName` / `enClassName` + `viStyle` / `enStyle`, and
`viLang` / `enLang` BCP 47 overrides. Renders a React Fragment
(no container element — the caller's surrounding markup is
preserved). Empty-string handling is deliberate-NOT-silent-drop
so missing halves surface visibly at the data layer.

**Test:** `src/components/__tests__/Bilingual.test.tsx` — 15
tests across DOM order, lang attributes, element-type
overrides, styling, edge cases (empty string, ReactNode
children), and pilot-consumer parity (W2 / P4-BiText / Home
inline shapes).

**Pilot migrations done (3 sites, 1 per consumer flavour):**

| Surface | Site | Notes |
|---|---|---|
| W2 — Tailwind classes, VI-primary | `src/components/stage-3a/LocalWeaknessMap.tsx` row title pair (was lines 152–157) | First L1-row VI/EN pair; the other inline lang pairs in this file (~7 more) stay inline for the follow-up sweep. |
| P4 — inline style, EN-primary | `src/screens/Pricing.tsx` `BiText` helper (line 125) | The `BiText` public signature `({en, vi})` is preserved — every existing `BiText` call site (9 in this file) continues to work unchanged; only the helper's internals delegate to `<Bilingual>`. The non-`BiText` inline `<span lang="…">` pairs in `renderCard` (~595, ~599, ~606, ~629, ~632, ~634–635) stay inline for the follow-up sweep. |
| Home — inline style, VI-primary, NOT-currently-lang-tagged | `src/components/home/PracticeRecommendationCard.tsx` title pair (was lines 82–83) | This pair did NOT have `lang` attrs before — the migration BOTH wraps in `<Bilingual>` AND adds the WCAG 3.1.2 fix. The description pair below (lines 91–92) is similarly un-lang-tagged but stays for the follow-up sweep. |

**Remaining inline lang-attr call sites (follow-up sweep
candidates):**

- ~~`src/components/stage-3a/LocalWeaknessMap.tsx` — 7 more `<p lang="…">` pairs~~ **DONE in the sweep MR** (PlacementRow, PronunciationRow shortVi/shortEn, SectionHeading, GlobalEmptyState). L1Row example pair (`exampleVi`/`exampleEn`) deliberately **left inline** — see "Sweep migration" flag below.
- ~~`src/components/stage-3b/SuggestedPracticeList.tsx` — 6 `<p lang="…">` pairs~~ **DONE in the sweep MR** (row item viLabel/enLabel + EmptyState). Heading h3/p pair **left inline** — see "Sweep migration" flag below.
- `src/pages/onboarding/OnboardingPage.tsx` — 4 lang-tagged elements (lines 463, 465, 468, 470). **Special case (still pending):** the `<h1 ref={headingRef} tabIndex={-1}>` carries wizard focus-management state; migrating to `<Bilingual>` requires a `primaryRef` prop addition (deliberately deferred — the current wrapper does NOT support refs, per the component header). When O2 migrates, either add the prop or carve a `<BilingualHeading>` variant.
- ~~`src/screens/Pricing.tsx` — ~10 non-`BiText` inline pairs~~ **DONE in the sweep MR** (hero h1+VI subtitle, hero secondary pair, feature grid divs, plan card titles × 2, plan card subtitle pairs × 2, plan card body pairs × 2, auto-renewal disclosure). Plan-card bullets + legal-link anchors **left inline** — see flags.
- ~~`src/components/home/PracticeRecommendationCard.tsx` — description pair~~ **DONE in the sweep MR**. The migration also added the WCAG 3.1.2 `lang` attrs that the inline pair was missing.

## Sweep migration (post-!115)

The pilot migrations established three call-site shapes; this MR
applies `<Bilingual>` to every inline lang-attr pair across the
backlog **except O2** (deferred per the `headingRef` blocker above)
and four flagged sites where the inline pattern uses a feature the
wrapper doesn't model.

**Migrated (13 sites across 4 files):**

| File | Sites | Notes |
|---|---|---|
| `src/components/stage-3a/LocalWeaknessMap.tsx` | 4 | PlacementRow, PronunciationRow shortVi/shortEn pair, SectionHeading (uses `viAs="h3" enAs="p"`), GlobalEmptyState. |
| `src/components/stage-3b/SuggestedPracticeList.tsx` | 2 | Row item viLabel/enLabel pair (rationale `<p>` stays inline — VI-only, not a bilingual pair), EmptyState. |
| `src/screens/Pricing.tsx` | 9 | Hero h1+VI subtitle, hero secondary p pair, feature grid divs, plan card titles × 2 (level0 + paid), plan card subtitle pairs × 2, plan card body pairs × 2, auto-renewal disclosure. All `primary="en"`. |
| `src/components/home/PracticeRecommendationCard.tsx` | 1 | Description pair (this MR ALSO adds the WCAG 3.1.2 `lang` attrs the inline pair was missing). |

**Flagged — deliberately NOT migrated (4 sites):**

| Site | Reason |
|---|---|
| `LocalWeaknessMap.tsx` L1Row `exampleVi`/`exampleEn` (around lines 184/189) | Each side guarded by its own `&& { … }` conditional. `<Bilingual>` deliberately does not silently drop empty halves (per its component-header contract); migrating would render an empty `<p>` whenever only one example is populated. Could be resolved by adding a `dropEmpty` opt-in to the wrapper, but that's a wrapper-API change, not a mechanical sweep. |
| `SuggestedPracticeList.tsx` heading `<h3 id="suggested-practice-heading">` + EN subtitle (lines 124–133) | The `<h3>` carries an `id` referenced by the parent `<section aria-labelledby="suggested-practice-heading">`. `<Bilingual>` has no `viId`/`enId` prop to pass through. Could be resolved by extending the wrapper's API; not done in this MR per the wrapper-stability rule. |
| `Pricing.tsx` plan-card bullets `<li>` containing `<span lang="en">{bullet}</span> {plan.bulletsVi?.[i] && <span lang="vi">…</span>}` (around lines 615/617) | Same conditional-one-side-missing pattern as the L1 example pair. The VI half is only rendered when `plan.bulletsVi?.[i]` is truthy; `<Bilingual>` would emit an empty VI span otherwise. |
| `Pricing.tsx` legal-link anchors `<a>…<span lang="vi">VI</span> / <span lang="en">EN</span></a>` (around lines 999–1000) | The literal `" / "` text separator between the two languages is design-intentional in-line presentation. `<Bilingual>` renders the two language nodes as adjacent fragment children with no slot for a between-content separator. Could be resolved by adding a `separator` prop, but that's wrapper-API expansion. |

**Open follow-ups:**

1. **O2 onboarding migration** — blocked on the `primaryRef` wrapper-API addition (or a `<BilingualHeading>` variant carve-out). Tracked separately.
2. **Conditional-render extension** — three of the four flags above (L1 example, plan bullets) share the same "one side may be empty / undefined" shape. A `dropEmpty` opt-in on `<Bilingual>` (or a sibling `<BilingualOptional>` component) would close them together. Deliberately deferred — the wrapper's "no silent drop" contract is a feature, not a bug.
3. **Per-side prop passthrough** — SuggestedPracticeList heading needs `id`; potentially other surfaces want `data-testid`. A `viProps` / `enProps` escape hatch on `<Bilingual>` would close all such cases. Deferred for the same reason as #2 — keep the wrapper minimal until a third unmigratable site demands it.

Tests verified post-sweep: 124 vitest specs across `stage-3a/`, `stage-3b/`, `home/`, `screens/`, and `Bilingual.test.tsx` — all green. No test-file edits required; the markup change was transparent to existing assertions.

---

**Files still pending Phase-2 audit:** the `feedback/` +
`account/` component directories (sampling), `Support.tsx`,
`RoleplayPage.tsx`, `SpeechDrillPage.tsx`, plus the
lower-priority Tier-3 files listed in the table above.
`MercyTeacherTab.tsx` is kids-mode-coupled and belongs in CC2's
lane. The dead `BillingSuccess.tsx` + the
`MercyGuidePanel.tsx` panel-body-structure question (Phase-2
#7 cross-cutting #3) are non-audit follow-ups.

**Cross-cutting findings worth promoting before further Phase-2
work:**

1. **The recognition-error envelope in `MercySpeakTab.tsx`
   (lines 422–438)** — six strings, all on-voice — is the
   strongest error-message surface audited to date. Worth
   promoting to `vi-style-guide.md` §6 exemplars.
2. **The destructive-action confirmation prose in
   `AccountPage.tsx` (lines 884, 903, 984)** — three paragraphs
   of factual, correctly-registered destructive-action copy — is
   the exemplar for "irreversible-action UX" copy. Also worth
   promoting to §6.
3. **Pronoun consistency (`bạn` for the learner, `mình` for
   Mercy)** is the single most common revision class — appears
   as the `Tiến độ của tôi` slip on AccountPage.tsx:612 and the
   `You` fallback on MercySpeakTab.tsx:1976. Phase-2 should
   convention-check every file against this rule.

## References

- `docs/copy/vi-style-guide.md` — the canonical voice + bilingual pairing reference for any future copy work (the prescriptive complement to this diagnostic).
- `docs/voice-guidelines-vn.md` — the anti-shame canon from the 2026-04-26 streak-shame audit. Authoritative for streak/leaderboard/progress surfaces.
- `reports/streak-shame-audit-2026-04-26.md` — the original shame-trigger inventory the voice guidelines doc was extracted from.
- `src/lib/stage-3a/taxonomy.ts` — the canonical bilingual catalog the diagnostic surfaces read from (the highest-quality reference exemplar in the codebase).
- `src/lib/teacher-mercy/tierScripts.ts` — the Mercy-as-companion voice exemplar.
- `src/pages/MarketingLandingPage.tsx` — the marketing-voice exemplar.
- C5's `chore/stage-3b-vi-copy-audit` (`!24` / commit `78186c729`) — the precedent for per-surface VI copy audits in this codebase.
