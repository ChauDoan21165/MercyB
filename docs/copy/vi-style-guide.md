# MercyBlade Vietnamese voice + bilingual style guide

The canonical reference for writing or revising any user-facing
Vietnamese (and Vietnamese-paired English) string in the app.
Pairs with — and does not duplicate — the existing
`docs/voice-guidelines-vn.md`.

## How this doc relates to the existing voice guide

`docs/voice-guidelines-vn.md` is the **anti-shame canon** —
extracted from the 2026-04-26 streak-shame audit. It tells you what
*not* to do on streak / leaderboard / progress surfaces (no
loss-framing initiated by the system, no red on user scores, etc.).
That doc is authoritative for those surfaces. Read it first.

This doc is the **stylistic canon** — it tells you what the voice
*sounds* like across the whole app: how Mercy talks, how VI and EN
sit next to each other on a screen, how to avoid machine-translation
tells, and what register fits which surface. Read this *after* the
anti-shame guide; this builds on top.

Where the two would conflict, the anti-shame guide wins. Stylistic
preference never overrides a shame rule.

---

## 1. The voice — Mercy as companion, not coach

The audit's strongest finding (see `docs/copy/bilingual-audit.md`):
the highest-quality VI strings in the app share one pattern. They
sound like a **trusted friend who happens to teach** — not a coach,
not a system, not a brand. The canonical exemplars are in
`src/lib/teacher-mercy/tierScripts.ts`:

> *Mừng bạn ở đây, {{name}}. Mình sẽ đi theo nhịp khiến bạn thấy an tâm.*
> *Nỗ lực của bạn vẫn đáng quý, dù thật lặng lẽ.*
> *Bạn không cần hoàn hảo — chỉ cần có mặt.*
> *Nếu hôm nay nặng nề, mình sẽ chia nhỏ để bạn dễ mang hơn.*

These four lines hit the voice precisely. They share concrete features
worth naming:

### What makes the voice work

| Feature | Why | Example |
|---|---|---|
| **First-person "mình" for Mercy** | Companion, not authority. "Chúng tôi" is a brand; "Mình" is a person. | *Mình sẽ chia nhỏ để bạn dễ mang hơn.* |
| **Second-person "bạn" for the learner** | Direct, warm-respectful, age-neutral. Avoids "anh/chị/em/cô/chú/bác" pronoun choice (which would gender + age the relationship and create exclusion). | *Nỗ lực của bạn vẫn đáng quý.* |
| **End particles "nhé / nha / mà"** sparingly | Lifts the register from prescriptive to conversational. One per sentence at most; over-use turns it cutesy. | *Cùng học từng bước một nhé.* |
| **Permission-to-rest tails** | Names rest explicitly, doesn't imply it. Anti-shame rule #4. | *Mệt thì cũng không sao.* |
| **Concrete imagery over abstraction** | "Chia nhỏ để bạn dễ mang hơn" lands; "Hỗ trợ bạn tốt nhất có thể" doesn't. | *Mình sẽ chia nhỏ để bạn dễ mang hơn.* |
| **"hay" as the frequency softener** | "Hay quên" = *"often forget"*, not *"always forget"*. Critical for the taxonomy and any pattern-naming surface. | *Hay quên thêm -s sau he, she, it.* |
| **Passive depersonalization for errors** | "bị nhầm" = *"gets mistaken"*, not "you mispronounce". Moves the error from learner-fault to phenomenon. | *Âm th tiếng Anh hay bị nhầm thành t.* |

### What breaks the voice

| Anti-pattern | Why it breaks | Replacement |
|---|---|---|
| **"Chúng tôi" / "MercyBlade" as agent of help** | Bureaucratic, brand-y, distancing. | *"Mình"* (when Mercy speaks) or omit the agent. |
| **Imperatives without softener** ("Hãy làm…!") | Stiff, school-teacher. | Soft imperative or invitation: *"Mình cùng…"*, *"Bạn thử…"*, *"… nhé."* |
| **Formal pronouns "ngài / quý vị / quý khách"** | Hotel-lobby register; wrong distance. | "bạn" always. |
| **Tu register pronouns "mày / tao"** | Too familiar; alienates older + parent learners. | "bạn" always. |
| **Generic "khách hàng" / "người dùng"** | App-speak, not human-speak. | "bạn" always (or omit). |
| **"Đừng quên…" / "Hãy nhớ…" recurring** | Nag pattern; reads as anxious system. | Drop or convert to gentle: *"Hôm nay nếu rảnh…"*, *"Khi nào sẵn sàng…"*. |
| **"Tuyệt vời! / Tuyệt!" after every correct answer** | False-warm, exclamation-inflation. The lesson does the validating; copy doesn't need to. | One sober acknowledgment, no exclamation, or silence. |
| **Diminutives for adult learners** ("em ơi", "con nhé") | Infantilizing outside Kids mode. | "bạn" always. |
| **"Cố lên!" as a default encouragement** | Pushy; reads as "you're not trying hard enough." | The level0 encouragements in `tierScripts.ts` (e.g. *"Bạn không cần hoàn hảo — chỉ cần có mặt."*) are the warm replacement. |

### Where the voice fits which surface

| Surface | Register |
|---|---|
| Marketing landing | Confident, declarative, brand-voice. Less "mình", more headline rhythm. (Cô Mercy is the third-person teacher figure here.) |
| Onboarding | First-person learner ("Tôi học ngoại ngữ" buttons), warmth follows once they're signed in. |
| Home dashboard | Action-led, short, no second person needed on card titles. Card body copy can be warmer. |
| AI Tutor (Mercy speaks) | Full Mercy-as-companion voice. "Mình" + "bạn", soft particles, permission-to-rest. |
| Errors + form validation | Concrete + factual. "Email chưa đúng định dạng" beats "Có lỗi xảy ra". No "Xin lỗi…" preface unless we genuinely broke something. |
| Billing + receipts | Crisp + transactional. Voice is mostly absent. The product earns Mercy's voice on learning surfaces, not on payment surfaces. |
| Legal (Privacy / Terms) | Standard formal. Voice doesn't apply; legal correctness does. |
| Kids mode | Different voice entirely. Per CLAUDE.md non-negotiable #2, Kids is sacred — its copy belongs to its own playbook, not this one. |

---

## 2. Bilingual pairing — when VI alone, when VI + EN, ratios

Mercy is Vietnamese-first (CLAUDE.md non-negotiable #1). Every
user-facing surface is VI-primary. The question is whether and how
EN sits next to it.

### Default pattern: VI primary, EN secondary

For card titles, panel headings, marketing copy, and learner-language
labels — the dominant pattern is **VI on top, EN below in smaller /
lighter weight**. Examples from the codebase:

```
Gợi ý luyện tập                       ← VI heading
Suggested practice                     ← EN subtitle (smaller, slate-500)
```

```
Điểm yếu của bạn                       ← VI h1
What you're working on                 ← EN h2 (lighter)
```

```
Hay quên thêm -s sau he, she, it.      ← VI label (font-semibold, slate-900)
You often skip -s after he, she, it.   ← EN sublabel (text-[12px], slate-500)
```

The size/color hierarchy matters: VI must visually dominate. If the
EN reads at the same weight, the user's eye is split.

### When VI alone is correct

- **Zalo / TikTok-VN captions.** EN dilutes when the audience is
  Vietnam-resident.
- **Forms the user fills out in VI** — placeholders, helper text,
  error messages on those fields. Pairing EN here adds visual noise
  for no benefit.
- **Conversational AI tutor output where Mercy is responding in
  VI to a VI prompt.** The reply doesn't need its own EN subtitle;
  the conversation is already in VI.

### When EN alone is correct

- **VN-target onboarding paths.** A user who picked "I'm learning
  Vietnamese" (English-native track) reads EN chrome by default; VI
  appears as the *target* language they're studying, not the
  chrome.
- **Internal admin / staff surfaces.** Not learner-facing; no
  audience for the bilingual contract.

### When VI + EN is correct (default)

Almost everywhere else. Specifically:

- Every learner-language label coming from `stage-3a/taxonomy.ts`.
- Page headings.
- Card titles + their explanatory subtitles.
- Empty states (the EN second line buys safety if the VI lands
  awkwardly for any reader).
- CTAs in the Vietnamese-native marketing flow when the EN serves
  as the bilingual-mirror identity statement ("I'm learning
  Vietnamese" as a parallel CTA on the landing page).

### The EN's job

EN below VI is **not a translation aid for VI-natives** — Mercy is
not Google Translate. EN is:

1. **An identity signal** — "this product takes English seriously".
2. **A reframe of the VI** — sometimes the EN is deliberately not a
   1:1 translation but a softer / different angle, the way
   *"Điểm yếu của bạn"* pairs with *"What you're working on"*.
3. **A safety net for EN-native users in the diaspora cohort** who
   read EN faster than VI even though they're learning English
   alongside their Vietnamese.

Write the VI first. Write the EN to do one of these three jobs.
Never write the EN first and translate to VI — that's the canonical
source of MT-feel (see §3).

---

## 3. Machine-translation tells — what to flag

If a string carries any of these markers, treat it as a
revision candidate even if it's grammatically correct.

### Lexical tells

| Tell | Example | Fix |
|---|---|---|
| **"thật"/"rất"/"luôn"/"rất là" over-use** | *"Mercy rất vui được chào đón bạn"* | Drop. *"Chào mừng bạn."* is enough. |
| **"việc" as a nominalizer over-use** | *"Việc luyện tập là rất quan trọng"* | Verbalize. *"Cứ luyện thêm — sẽ tiến."* |
| **"bạn" stacking** ("của bạn" + "bạn" + "bạn") | *"Bạn hãy luyện cho bạn của bạn tốt hơn"* | Trim. *"Cứ luyện cho mình thôi."* |
| **"có thể" hedging on confident claims** | *"Bạn có thể đã quên -s"* (when the system is sure) | *"Hay quên -s sau he, she, it."* |
| **English content-words untranslated where VI exists** | *"streak của bạn"*, *"feedback từ Mercy"* | *"chuỗi"*, *"nhận xét"* — but only where there's no internal codename collision. |

### Syntactic tells

| Tell | Example | Fix |
|---|---|---|
| **English word-order subject-verb-object on Vietnamese topic-prominent sentences** | *"Bạn nên luyện ba điều"* | Often fine, but check whether topic-fronting reads more naturally for the surface: *"Ba điều bạn nên luyện…"* |
| **Calqued idioms from EN templates** | *"Hãy làm cho ngày của bạn"* (literal "make your day") | Idiom in source has no VI equivalent → rewrite the *intent*, not the words. |
| **Untranslated relative clauses** ("which/that/who" → "mà") stacked | *"Câu mà bạn vừa nói mà có lỗi mà tôi vừa sửa"* | Break into multiple sentences. VI tolerates more periods than EN. |
| **Comma-splice English habits** | *"Bạn đã làm tốt, hãy tiếp tục, đừng dừng lại"* | VI prefers shorter sentences with periods, not comma chains. |

### Register tells

| Tell | Example | Fix |
|---|---|---|
| **Hotel-lobby formality on a learning surface** | *"Quý khách vui lòng nhập mật khẩu"* | *"Nhập mật khẩu của bạn."* |
| **Brand-speak agentive verbs** | *"MercyBlade hỗ trợ bạn cải thiện…"* | *"Mình sẽ giúp bạn…"* (or drop the agent entirely). |
| **Anglicism corporate VI** | *"trải nghiệm người dùng tối ưu"* | Strike from learner-facing surfaces entirely. Belongs in internal docs or marketing-to-investors, not learner copy. |
| **Half-translated UI elements** ("button Đăng ký now") | — | Translate the whole element or none. The mid-string switch is the strongest MT tell. |

The audit-style fast filter: **read the line aloud to yourself in
Vietnamese.** If it sounds like you'd say that to a friend, ship.
If you'd never say it to anyone, rewrite.

---

## 4. Stylistic conventions

### Diacritics

- Always use full Vietnamese diacritics. No `dien thoai`, no `Tieng Viet`. UTF-8 from end to end.
- For mixed-language strings, keep diacritics on Vietnamese tokens and use plain Latin for English tokens: *"Câu hỏi về **streak**"* not *"Câu hỏi về s-trê-c"*.
- For technical / English terms with no VI equivalent (codenames, brand names, API names), keep them in Latin: *"Mercy"*, *"MercyBlade"*, *"OpenAI"*, *"GPT-4"*.

### Punctuation

- VI uses the same punctuation as EN (period, comma, question mark, exclamation mark). No Chinese full-width punctuation.
- Em-dashes (`—`) are fine in VI and used in the codebase already. Em-dash + space on both sides: ` — ` (matches the existing voice).
- Smart quotes `"…"` not straight `"…"` in user-facing copy where the codebase allows it. For TypeScript string literals containing user-facing copy, prefer template literals or escape carefully so smart quotes survive Prettier.
- Ellipsis: prefer the three-dot character `…` over `...` for visual reasons; both are tolerated.
- Use exclamation marks sparingly. One per surface, max. Mercy is not excited; Mercy is steady.

### Numbers + units

- Vietnamese reads numerals fine. *"6 phút"*, *"12 giây"*, *"3 lần"*. No spelled-out form needed except for one-word small numbers in headlines.
- Currency: *"99.000 ₫"* or *"99.000 VND"* — keep what the surrounding codebase uses. Don't introduce mixed formats.
- Percentages: *"68%"* sits fine before or after the number; the codebase uses *"68%"* postfix.

### Names + titles

- *"Cô Mercy"* in marketing copy (third-person teacher form).
- *"Mercy"* in conversational copy where Mercy speaks (no "Cô" — Mercy doesn't refer to herself with the honorific).
- Brand: *"MercyBlade"* (one word, capital M + B).
- Founder: *"Chau Doan"* in EN copy; *"Chau Doan"* (no Vietnamese-style transliteration like "Châu Đoàn") for consistency with the landing page.

---

## 5. Quick checklist — before merging a copy PR

Before merging any PR that adds or changes user-facing VI strings:

- [ ] **Read every new VI string aloud.** Does it sound like a thing a person would say?
- [ ] **Does Mercy speak as "mình"?** (On Mercy surfaces, not on marketing chrome.)
- [ ] **Does the learner get addressed as "bạn"?** (Not "khách hàng", "người dùng", "anh/chị", "em".)
- [ ] **Is the VI visually dominant** over its EN companion (where one exists)?
- [ ] **Did I write the VI first** — not translate from EN? (If the EN was the first draft and the VI followed, the VI almost certainly has MT-feel.)
- [ ] **No anti-patterns from §1**: no "Tuyệt vời!" after every correct answer, no "Cố lên!" as the default encouragement, no diminutives for adult learners, no formal hotel-lobby pronouns.
- [ ] **No MT tells from §3**: no "thật"/"rất"/"luôn" over-use, no calqued idioms, no comma-splice chains, no half-translated UI elements.
- [ ] **The anti-shame canon (voice-guidelines-vn.md) is honored** on any surface in its scope (streak, leaderboard, progress).
- [ ] **Strings that touch Kids mode** went through the Kids playbook, not this one.
- [ ] **The EN companion does one of its three jobs** (§2): identity signal, reframe, or diaspora safety net. Never a translation aid for VI-natives.

## 6. Where to look for exemplars

When unsure, copy the pattern from one of these — they are the
codebase's known-good VI surfaces:

- **Marketing voice**: `src/pages/MarketingLandingPage.tsx`
- **Mercy companion voice**: `src/lib/teacher-mercy/tierScripts.ts` level0 + level1 blocks
- **Learner-language labels**: `src/lib/stage-3a/taxonomy.ts` (especially `vi_l1_no_aux_negation`, `PHONEME_AXIS.TH_T`, and the `FALLBACK` entry)
- **Empty states**: `src/components/stage-3b/SuggestedPracticeList.tsx` `EmptyState` (post-C5 revision)
- **Soft diagnostic frame**: `src/pages/WeakAt.tsx` header (VI + EN reframe pair)

## 7. References

- `docs/voice-guidelines-vn.md` — the anti-shame canon. Authoritative for streak/leaderboard/progress.
- `docs/copy/bilingual-audit.md` — the 2026-05-27 diagnostic audit this guide builds on top of.
- `reports/streak-shame-audit-2026-04-26.md` — original shame-trigger inventory.
- C5's `chore/stage-3b-vi-copy-audit` (`!24`, commit `78186c729`) — the per-surface audit precedent.
- CLAUDE.md non-negotiables #1 (Vietnamese-first) and #2 (Kids is sacred).
