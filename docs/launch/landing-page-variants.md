# Landing-page copy variants — Stage 3 launch

Three alternative bilingual treatments for `src/pages/MarketingLandingPage.tsx` (the `/` route for first-time anonymous visitors per `src/router/AnonymousOnboardingGate.tsx`). Each variant pairs the page's existing layout slots with a different leading angle.

This file is **proposal only**. No source string changes ship in the MR that lands it — source revision is a separate dispatch after Chau picks a variant.

## Why this doc exists

The current landing copy (Variant A below) leads with the canonical brand line *"Ngoại ngữ cho người Việt và Tiếng Việt cho thế giới nói tiếng Anh"* — a positioning statement. The Stage 3 launch surfaces two angles that the positioning line doesn't pull forward:

- The **L1-thesis** — *"we know your brain expects Vietnamese grammar"* — which is the differentiated product claim, not the positioning claim.
- The **privacy / local-only** posture — *"nothing leaves your phone for the diagnostic"* — which is the differentiated platform posture.

The current page mentions both downstream (in the FAQ + the trust column). Variants B and C lead with them instead. Variant A stays here as the documented baseline so the contrast reads cleanly.

## What stays the same across all three variants

The page's structural slots from `MarketingLandingPage.tsx` — hero block, instant-trial block, three value columns, founder line, FAQ, footer CTA — do not move. Only the *strings inside the slots* change. This means a future single-PR source revision can swap a variant without touching the component's layout, CSS, or `useNavigate` handler.

Constraints (from the kit-wide rules — [`stage-3-content-kit/README.md`](./stage-3-content-kit/README.md) — and [`docs/copy/vi-style-guide.md`](../copy/vi-style-guide.md)):

- **No outcome promises** in any variant — no fluency claims, no IELTS-score claims.
- **No competitor trademarks.** No "Duolingo" anywhere; generic phrasing where the contrast frame appears.
- **VI clears the shame regex** — no *yếu / kém / dốt / lười / tệ* user-facing labels. Where the route name `điểm yếu` appears, the EN companion reframes per the audit pattern.
- **Mercy-as-companion voice** on lines spoken in Mercy's voice — *mình* for Mercy, *bạn* for the learner.
- **No fabricated testimonials, no metric inflation, no paying-user counts.**
- **Bilingual pairing** per the style guide — VI primary, EN does identity / reframe / diaspora-safety-net jobs.

If a variant string below violates any of these, it is a defect; flag and rewrite before the source revision.

---

## Variant A — the shipped baseline (positioning lead)

Current copy as of `src/pages/MarketingLandingPage.tsx`. Documented here for variant-to-variant comparison.

### Hero

| Slot | VI | EN |
|---|---|---|
| H1 | *Ngoại ngữ cho người Việt và Tiếng Việt cho thế giới nói tiếng Anh* | *Foreign languages for Vietnamese learners and Vietnamese for the English-speaking world* |
| Sub-hero | *Sửa lỗi tiếng Anh của người Việt, giải thích bằng tiếng Việt. AI thầy giáo hiểu cách người Việt học.* | (none — sub-hero is VI-only) |

### CTAs

| CTA | VI | EN |
|---|---|---|
| Primary (`/onboarding`) | *Tôi học ngoại ngữ* | — |
| Secondary (`/onboarding?direction=vn`) | — | *I'm learning Vietnamese* |
| Trial (`/?trypron=1`) heading | *Thử phát âm — không cần đăng nhập* | *Try pronunciation — no signup needed* |
| Trial CTA | *Nói thử ngay →* | — |

### Trust strip (the "Vì sao MercyBlade" three-column block)

| Col | VI title | VI body |
|---|---|---|
| 1 | *Học bằng tiếng Việt* | *AI thầy giáo của bạn nói tiếng Việt như thầy giáo thật. Sửa lỗi tiếng Anh của người Việt, không phải lỗi chung chung.* |
| 2 | *Điểm phát âm tức thì* | *Nói một câu, biết điểm trong 12 giây. Sửa từng âm, không phải sửa cả câu.* |
| 3 | *Cầu nối ngôn ngữ* | *Người Việt học ngoại ngữ. Người nước ngoài học tiếng Việt. Cùng một nền tảng — vì ngôn ngữ không có ranh giới một chiều.* |

### Founder line

> *Được tạo bởi Chau Doan — kỹ sư phần mềm tại Canada, sáng lập viên MercyBlade.*

### Strengths

- The H1 carries the strongest brand identity claim in the codebase. Cannot be improved without losing the bilingual bridge that is core to the product positioning.
- The CTA pair (*"Tôi học ngoại ngữ"* / *"I'm learning Vietnamese"*) is itself the brand statement — each CTA is written in the language of its target audience.
- 27/27 VI strings rated OK in the [`docs/copy/bilingual-audit.md`](../copy/bilingual-audit.md) Tier-1 catalog.

### Weaknesses

- The L1-interference thesis ("Vietnamese-language interference patterns") is buried in the body copy of value column 1, not in the hero. A visitor scanning only the H1 + sub-hero learns the product is *for Vietnamese learners* but not *what makes the product work for them*.
- The privacy posture is not visible above the fold at all. The Stage 3 `/weak-at` local-only invariant is not mentioned anywhere on the landing.
- "Sửa lỗi" appears twice (sub-hero + value col 1) — borderline-repetition, not a defect, but reduces room for a differentiated proof point.

### Best platform fit (per [`stage-3-content-kit/ab-variants.md`](./stage-3-content-kit/ab-variants.md))

| Inbound traffic source | Landing fit |
|---|---|
| TikTok Script 1 (diagnostic frame) | **Strong** — diagnostic-curious visitor lands on a positioning-led page; "Tôi học ngoại ngữ" CTA absorbs the click. |
| TikTok Script 2 (prescriptive frame) | **OK** — same. |
| TikTok Script 5 (no-streak) | **OK** — but the no-streak posture isn't reinforced on the landing. |
| Facebook Post 1 (broad diagnostic) | **Strong** — broad post + broad landing. |
| Facebook Post 3 (diaspora L1 identity) | **Medium** — the diaspora-identity reader expects to see the L1 thesis above the fold; Variant A doesn't deliver. |
| Facebook Post 4 (privacy) | **Weak** — privacy-led inbound + no privacy above the fold = framing whiplash. |
| Zalo Card 5 (privacy) | **Weak** — same. |

---

## Variant B — L1-thesis lead

Variant B re-orders the hero to lead with the differentiated product claim: *we recognize that learning English while thinking in Vietnamese is a specific cognitive load*. The bilingual brand statement moves to a smaller, slower position on the page (still present, no longer the H1).

### Hero

| Slot | VI | EN |
|---|---|---|
| H1 | *Học tiếng Anh khi tiếng Việt vẫn nằm trong đầu bạn — mình hiểu* | *Learning English when your brain still thinks in Vietnamese — we know* |
| Sub-hero | *Tiếng Việt động từ không đổi. Tiếng Anh phải đổi. Tiếng Việt một giới từ "ở" — tiếng Anh là ba: in, on, at. MercyBlade biết những điểm chuyển này và dạy đúng chỗ đó.* | (VI-only) |

**Notes on the hero copy.** The H1 reframes the brand from positioning (*"Ngoại ngữ cho người Việt"*) to a *cognitive observation* (*"tiếng Việt vẫn nằm trong đầu bạn"*) and then a *companion-voice acknowledgement* (*"mình hiểu"*). The "mình" here is Mercy speaking — first-person companion register from the style guide.

The sub-hero gives three concrete L1-interference examples in 26 Vietnamese words. Each example is a real pattern from `src/lib/stage-3a/taxonomy.ts` (`vi_l1_past_ed`, `vi_l1_preposition_transfer`). Concreteness over abstraction is the strongest engagement bet.

### CTAs

| CTA | VI | EN |
|---|---|---|
| Primary (`/onboarding`) | *Bắt đầu — học tiếng Anh đúng cho người Việt* | — |
| Secondary (`/onboarding?direction=vn`) | — | *I'm learning Vietnamese* |
| Trial (`/?trypron=1`) heading | *Nói một câu — xem lỗi tiếng Anh của riêng bạn* | *Speak one sentence — see your specific Vietnamese-learner patterns* |
| Trial CTA | *Nói thử ngay →* | — |

**Notes on the CTAs.** The secondary CTA stays in English unchanged — it's the bilingual-bridge statement and the secondary audience expects the EN-CTA. The trial heading shifts from *"không cần đăng nhập"* (logistical) to *"xem lỗi tiếng Anh của riêng bạn"* (outcome-oriented, but bounded — *"of your own"* not *"and improve"*). The "không cần đăng nhập" assurance moves into a small line below the trial CTA: *Không cần đăng nhập · No signup needed*.

### Trust strip (the three-column block)

| Col | VI title | VI body |
|---|---|---|
| 1 | *65 mẫu lỗi người Việt hay mắc* | *MercyBlade ghi nhận 65 mẫu câu mà người học gốc Việt hay vấp khi nói tiếng Anh — từ "quên -s" đến "câu hỏi không có do/does/did" — và giải thích từng cái bằng tiếng Việt, kèm so sánh.* |
| 2 | *Cô Mercy nói tiếng Việt* | *AI thầy giáo của bạn không phải dịch từ tiếng Anh — Cô Mercy nói tiếng Việt như thầy giáo thật, vì người tạo ra cô là người Việt.* |
| 3 | *Phát âm trên thiết bị* | *Nói một câu, biết điểm trong 12 giây. Sửa từng âm, không phải sửa cả câu. Không cần tải, không cần đăng nhập.* |

**Notes on the trust strip.** Col 1 names the concrete `L1_DESCRIPTIONS` table size (65) — verifiable, anchored to code, not a marketing number. Col 2 introduces Cô Mercy as the teacher character (the *project_teacher_mercy* memory framing). Col 3 keeps the pronunciation hook but adds *"trên thiết bị"* to plant the privacy thread that the secondary positioning line below picks up.

### Brand-positioning line (relocated, smaller)

Below the trust strip, before the founder line:

> *MercyBlade là cây cầu hai chiều — người Việt học ngoại ngữ và thế giới học tiếng Việt. Cùng một nền tảng.*
>
> *MercyBlade is a two-way bridge — Vietnamese learners study foreign languages and the world learns Vietnamese. One platform.*

The Variant A H1 still lives on the page; it just no longer occupies the hero slot.

### Founder line

> *Được tạo bởi Chau Doan — kỹ sư phần mềm tại Canada, sáng lập viên MercyBlade. Người mà sau 10 năm sống ở Bắc Mỹ vẫn quên -ed cho quá khứ.*

**Notes.** The founder-line addition (*"vẫn quên -ed cho quá khứ"*) is a factual confession Chau can make about himself, not a fabricated testimonial. Verifiable by anyone who has heard Chau speak English. Lands as humility, not humble-brag.

### Strengths

- The L1-thesis lands above the fold — the visitor learns *what makes the product work for them*, not just *who it's for*.
- The H1's *"mình hiểu"* is the strongest companion-voice move in any landing-page H1 considered. *project_teacher_mercy* memory directly supported.
- Concrete examples (-s, -ed, in/on/at) in the sub-hero give visitors something to remember.

### Weaknesses

- The "two-way bridge" positioning is demoted from hero to secondary. Some visitors who'd be drawn by the positioning statement may not scroll far enough to find it.
- Sub-hero is denser (26 VI words vs Variant A's 17). Mobile-first rendering at 375 px still works but the eye has more to do.
- The founder-line confession (*"vẫn quên -ed"*) is a stylistic move that could be misread as MercyBlade-doesn't-work-on-its-own-founder. The risk is real and the line should be rewritten if focus tests confirm it.

### Best platform fit

| Inbound traffic source | Landing fit |
|---|---|
| TikTok Script 3 (L1 thesis) | **Strong** — same thesis above the fold; visitor lands inside a continued conversation. |
| Facebook Post 3 (diaspora L1 identity) | **Strong** — diaspora-identity reader sees the *"mình hiểu"* line and the concrete examples. |
| TikTok Script 1 / Facebook Post 1 (broad diagnostic) | **Medium** — broad inbound + specific landing risks audience-context mismatch. Variant A is the better landing for those sources. |
| TikTok Script 4 / Facebook Post 4 / Zalo Card 5 (privacy) | **Weak** — privacy posture stays implicit (only *"trên thiết bị"* in trust col 3). Variant C is the better landing. |

---

## Variant C — local-only privacy lead

Variant C leads with the platform posture: *your data stays on your device — see your patterns without giving us anything*. Differentiated from the field by ten orders of magnitude. The L1-thesis and the positioning statement both move downstream.

### Hero

| Slot | VI | EN |
|---|---|---|
| H1 | *Học tiếng Anh — dữ liệu của bạn không rời khỏi máy bạn* | *Learn English — your data never leaves your phone* |
| Sub-hero | *Trang chẩn đoán "Điểm cần luyện" của MercyBlade đọc dữ liệu thẳng từ trình duyệt của bạn. Không gửi lên server. Bạn có thể tự kiểm tra trong 30 giây.* | (VI-only) |

**Notes.** The H1 is 11 VI words / 9 EN words — both fit at 375 px without wrapping awkwardly. The EN companion is a near-1:1 translation here on purpose (the privacy claim is the message; reframing risks softening). Sub-hero closes on *"tự kiểm tra trong 30 giây"* — the verification-first framing from `ab-variants.md` Facebook Post 4 Variant B.

The H1 deliberately avoids *"không tracking"* / *"không pixel"* — the negative-frame would invite the visitor to imagine the tracking before negating it. The positive frame (*"data stays on your phone"*) lands cleaner.

### CTAs

| CTA | VI | EN |
|---|---|---|
| Primary (`/weak-at`) | *Xem ngay — không cần đăng nhập* | — |
| Secondary (`/onboarding`) | *Học cùng Cô Mercy* | — |
| Trial (`/?trypron=1`) heading | *Thử phát âm — cũng không gửi đi đâu* | *Try pronunciation — also stays on your device* |
| Trial CTA | *Nói thử ngay →* | — |

**Notes on CTAs.** This is the variant where the primary CTA changes destination from `/onboarding` to `/weak-at`. The Stage 3 surface IS the proof of the privacy claim — sending the visitor directly there is the most credible demonstration the page can stage. The "Cô Mercy" CTA stays as a secondary affordance for visitors who arrive with the L1-thesis frame from a different inbound source.

The English-only secondary CTA (*"I'm learning Vietnamese"* from Variants A and B) MUST still exist on the page — bilingual bridge non-negotiable. In Variant C it moves into the footer CTA row, not the hero CTA row. (The hero gets the privacy-led CTA pair; the footer holds the brand-bridge CTA pair.)

### Trust strip

| Col | VI title | VI body |
|---|---|---|
| 1 | *Đọc trên máy của bạn* | *Trang `/weak-at` đọc 3 khóa `localStorage`, không gửi gì lên server. Bạn có thể mở DevTools → Network và đếm: 0 yêu cầu.* |
| 2 | *Không tracking pixel, không cookie marketing* | *MercyBlade không cài Facebook Pixel, không cài Google Analytics, không cài TikTok Pixel. Bạn vào và rời đi mà không ai theo dõi.* |
| 3 | *Mã nguồn mở — bạn xem được* | *Đoạn code đọc và hiển thị "Điểm cần luyện" công khai trên GitHub (`stage-3a/aggregator.ts`, `stage-3b/suggestedPractice.ts`). Bạn có thể tự đọc.* |

**Notes on the trust strip.** Every claim in every column is verifiable by the visitor on the spot — DevTools (col 1), `view-source` / "no script tags" check (col 2), GitHub link (col 3). Verifiable claims are the only credible privacy claims; *"trust us"* without an affordance has no signal.

The GitHub link in col 3 needs to actually work — Stage 3 source IS on `main` of the GitLab mirror. Add a hyperlink to the relevant file URL when this variant lands.

### Brand-positioning line (relocated, smaller)

Same as Variant B — the *"two-way bridge"* statement moves downstream from the hero but stays on the page.

### L1-thesis paragraph (relocated, smaller)

Below the trust strip, before the founder line — *one paragraph* that names the L1-thesis without leading on it:

> *Ngoài ra: MercyBlade ghi nhận 65 mẫu lỗi tiếng Anh mà người học gốc Việt hay vấp — từ "quên -s" đến "câu hỏi không có do/does/did" — và giải thích từng cái bằng tiếng Việt, kèm so sánh tiếng Anh / tiếng Việt.*
>
> *Beyond privacy: MercyBlade catalogs 65 grammar patterns Vietnamese-language learners of English commonly trip on — explained in Vietnamese with contrastive examples.*

### Founder line

Same as Variant A — no Variant-B-style confession addition. The privacy variant earns trust through verifiability, not vulnerability.

### Strengths

- The single most-differentiated platform posture leads. No competitor — paid or free, Vietnamese-market or global — makes the same claim.
- Every claim above the fold and in the trust strip is **verifiable on the spot**. The credibility transfer is structural, not rhetorical.
- The "Xem ngay — không cần đăng nhập" primary CTA is the lowest-friction primary CTA in any of the three variants. The product itself becomes the demo.

### Weaknesses

- The positioning statement (*"Ngoại ngữ cho người Việt và Tiếng Việt cho thế giới"*) is demoted twice — once below trust strip, once into the footer CTA. Visitors who'd be drawn by the positioning may not scroll that far.
- The "open-source" claim in trust col 3 sets an expectation that needs honoring (the GitHub link must exist + must lead to public-readable source). This becomes a maintenance contract — if the repository ever flips to private, the landing copy is suddenly false.
- Privacy-led messaging risks attracting an audience that is *only* there for the privacy posture, not for the language-learning value. Conversion to active use may underperform.
- Cô Mercy as the AI teacher becomes a secondary character on this landing — the *project_teacher_mercy* memory weighting (live in core rooms + AccountPage + 28 tests) doesn't get its airtime in the hero. Acceptable tradeoff, worth naming.

### Best platform fit

| Inbound traffic source | Landing fit |
|---|---|
| TikTok Script 4 (privacy DevTools demo) | **Strong** — same thesis above the fold + verifiable continuation. |
| Facebook Post 4 (privacy decision-explanation) | **Strong** — visitor arrives ready to verify; the page hands them the verification. |
| Zalo Card 5 (privacy trust-led) | **Strong** — Zalo card was content-light by design; landing carries the proof. |
| TikTok Script 5 / Facebook Post 5 (anti-shame / older-learner) | **Medium** — privacy doesn't speak to the no-streak posture directly; "không tracking" appeals to the privacy-minded reader, less to the rest-permission-seeking reader. |
| TikTok Script 1 / Facebook Post 1 (broad diagnostic) | **Weak** — broad inbound + specific privacy frame risks losing visitors who came for the diagnostic and don't yet care about privacy. Variant A is the better landing for those. |
| TikTok Script 3 / Facebook Post 3 (diaspora L1) | **Medium** — diaspora-identity reader is privacy-curious but came for the L1 thesis. Variant B is the better landing. |

---

## Variant-to-variant comparison

| Axis | Variant A | Variant B | Variant C |
|---|---|---|---|
| **Lead claim** | Positioning (two-way bridge) | L1-thesis (cognitive observation) | Privacy posture (local-only) |
| **Hero subject** | The product family | The learner's cognitive state | The data flow |
| **Primary-CTA destination** | `/onboarding` | `/onboarding` | `/weak-at` |
| **Above-the-fold mentions of privacy** | 0 | 0 (col 3 "trên thiết bị" — implicit) | 3 (H1 + sub-hero + col 1) |
| **Above-the-fold mentions of L1-thesis** | 0 explicit (implicit in "lỗi của người Việt") | 3 (H1 + sub-hero + col 1) | 0 (downstream paragraph only) |
| **Above-the-fold mentions of positioning bridge** | 1 (H1) | 0 (downstream) | 0 (downstream) |
| **Above-the-fold mentions of Cô Mercy** | 1 (sub-hero "AI thầy giáo") | 1 (col 2) | 1 (secondary CTA) |
| **Verifiability of hero claims** | Brand claim (un-verifiable, definitional) | Cognitive observation (rings true or doesn't) | DevTools-verifiable in 30 s |
| **Risk if landing copy is wrong** | Low — visitor still gets positioning | Medium — sub-hero density loses skim-readers | Medium — primary CTA shift to /weak-at changes funnel shape |
| **Best paired inbound source** | TikTok 1, 2; Facebook 1, 2 | TikTok 3; Facebook 3 | TikTok 4; Facebook 4; Zalo 5 |

---

## Source revision implementation notes (for the future PR Chau approves)

When (if) a variant is picked and a source-revision MR follows, these are the structural notes for that PR:

1. **Slot-for-slot string swap only.** The component's TSX structure, CSS, and `useNavigate` handlers do not change. This is the contract that makes the variants safely swappable without QA churn.
2. **Trial CTA (`tryPronunciation()`) wiring stays** — every variant retains the *"Nói thử ngay"* button + the `/?trypron=1` query parameter handoff. `AnonymousOnboardingGate.searchHasCtaSignal` continues to read this param.
3. **The secondary EN CTA (`I'm learning Vietnamese`) stays on the page** in every variant — the bilingual-bridge identity statement is non-negotiable per the marketing landing audit (`project_marketing_landing_decisions`). In Variant C it relocates from hero to footer CTA row; in B it stays in the hero CTA row.
4. **The `direction=vn` URL parameter on the secondary CTA must NOT change.** Onboarding reads that param.
5. **SEO meta strings** (`SeoMeta title` and `description`) update with the variant. The new strings still resolve in <90 chars (title) and <160 chars (description) for search-engine snippet rendering. Variant B and C SEO copy is sketched as follow-up — out of scope for this proposal doc.
6. **Critical-path test coverage**: the existing `AnonymousOnboardingGate.test.tsx` does not assert specific copy strings; the variant swap won't fail those tests. But any test that DOES assert specific strings (search src for `Tôi học ngoại ngữ`, `Vì sao MercyBlade`, `Nói thử ngay`) needs updating in the same PR.
7. **The inline `CSS` constant** (the `.mb-ml-*` class block at the bottom of `MarketingLandingPage.tsx`) does not change for any variant. All copy revisions are string-only.

## What this file does NOT contain

- **Not an SEO copy variant set.** Variant B and C will need new `SeoMeta` strings; those are out of scope here and ship in the source-revision PR.
- **Not an image / hero-visual proposal.** The landing currently has no images (Lighthouse-first design); the variants preserve that. If a hero image is later proposed, it is a separate decision.
- **Not a copy-test methodology.** How to *test* one variant against another lives in [`stage-3-content-kit/measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) + [`stage-3-content-kit/decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) — including the caveat that the existing kit's measurement plan is calibrated to platform-side (TikTok/Facebook/Zalo) tests, not landing-page A/B tests. A landing-page A/B test would need its own measurement note + would require some affordance for serving two copies of the page to different visitors — which is itself a privacy + complexity tradeoff worth a separate dispatch.
- **Not a kid-mode variant.** Kids mode is governed by its own playbook (CLAUDE.md non-negotiable #2); the landing here is the adult-learner entry only.
- **Not a variant for signed-in users or returning anonymous users.** Those flows go through Home, not the marketing landing — out of scope for this file.

## References

- `src/pages/MarketingLandingPage.tsx` — the current source (Variant A baseline).
- `src/router/AnonymousOnboardingGate.tsx` — the gate that routes `/` to this page for first-time anonymous visitors.
- [`docs/copy/vi-style-guide.md`](../copy/vi-style-guide.md) — the stylistic canon all three variants honor.
- [`docs/copy/bilingual-audit.md`](../copy/bilingual-audit.md) — the audit that rated Variant A's current 27/27 strings as OK.
- [`docs/voice-guidelines-vn.md`](../voice-guidelines-vn.md) — the anti-shame canon.
- [`docs/launch/stage-3-content-kit/`](./stage-3-content-kit/) — the content kit whose inbound sources are matched to each variant in the "best platform fit" tables.
- [`docs/launch/stage-3-content-kit/ab-variants.md`](./stage-3-content-kit/ab-variants.md) — the per-piece A/B variants that produce the inbound traffic each landing variant absorbs.
- `project_marketing_landing_decisions` (memory) — the 2026-05-18 audit that locked the canonical brand line and the bilingual-bridge CTA pair.
- `project_teacher_mercy` (memory) — the *Cô Mercy* character-naming convention all variants honor.
