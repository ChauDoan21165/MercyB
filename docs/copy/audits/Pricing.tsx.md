# Phase-2 audit — `src/screens/Pricing.tsx`

**Surface:** `/pricing` + `/upgrade` — the consumer pricing surface.
Hero banner + plan cards (Free / Monthly / Yearly) + yearly-vs-monthly
comparison + already-subscribed panel + Apple/Stripe subscription
disclosure footer.

**Priority:** **TOP** — the §255 priority slot from
`docs/copy/bilingual-audit.md` was reassigned to this file in the
Phase-2 #3 re-categorization (the original §255 target `Tiers.tsx`
turned out to be internal diagnostic tooling, not the consumer
pricing surface). Pricing copy directly affects conversion.

**Scope:** every user-facing VI string. Cataloged 26 distinct
surfaces — the `Plan` struct's bilingual fields (`titleVi /
subtitleVi / bodyVi`), the `BiText {en, vi}` button/label component,
inline EN-paragraph + VI-paragraph pairs in the hero + disclosure
blocks, plus the yearly-vs-monthly comparison cells.

**Method:** verdict column per `docs/copy/bilingual-audit.md` §Method.
Adds an *ordering* column to flag the EN-primary vs VI-primary
inconsistency found in the disclosure footer.

**Conclusion:** **22/26 OK + 4 revision candidates** — 3 EN-only
plan-card bullet lists (highest-impact finding: every plan card
shows three EN-only bullets on a VI-primary surface), 1 EN-first
disclosure footer link pair (line 902–903 `Terms of Use (EULA) /
Điều khoản sử dụng` and `Privacy Policy / Chính sách bảo mật`
break the VI-primary contract).

---

## Catalog

### Plan struct — bilingual content (lines 193–250)

The three plans use the `Plan { titleVi, subtitleVi, bodyVi, ... }`
struct convention — the cleanest bilingual-pairing mechanism on the
page.

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 196 (titleVi level0) | `Miễn phí` | `Level 0` | **OK** — `Miễn phí` ("Free") is the standard idiom; the EN `Level 0` is a brand-product label. Asymmetric but defensible — the EN names the tier, the VI describes it. | — |
| 199 (subtitleVi level0) | `Khám phá một số phòng giới hạn.` | `Explore a limited set of rooms.` | **OK** — natural; `phòng` (room) is the canonical VI per the `MercyEnglishTab` finding. | — |
| 201 (bodyVi level0) | `Bắt đầu nhẹ nhàng và làm quen với trải nghiệm trước.` | `Start gently and get a feel for the experience first.` | **OK** — `bắt đầu nhẹ nhàng` ("start gently") is on-voice for the no-pressure free-tier framing. | — |
| 214 (titleVi month) | `Toàn quyền — Hàng tháng` | `Full Access — Monthly` | **OK** — `Toàn quyền` ("full access/rights") mirrors EN cleanly; em-dash spacing matches the EN. | — |
| 217 (subtitleVi month) | `Toàn quyền truy cập linh hoạt với thanh toán hàng tháng.` | `Flexible recurring access with monthly billing.` | **OK** — natural; `linh hoạt` is the right register for "flexible" here. | — |
| 219 (bodyVi month) | `Phù hợp cho người học muốn mở toàn bộ phòng premium mà chưa cần cam kết dài hạn.` | `Good for learners who want every premium room without a longer commitment.` | **OK** — natural; `cam kết dài hạn` ("longer commitment") is the on-voice anti-pressure framing. | — |
| 232 (titleVi year) | `Toàn quyền — Hàng năm` | `Full Access — Yearly` | **OK** — pattern-match of 214. | — |
| 235 (subtitleVi year) | `Tiết kiệm hơn và giữ toàn bộ quyền truy cập suốt cả năm.` | `Save more and stay fully unlocked all year.` | **OK** — `Tiết kiệm hơn` ("save more") is the value frame; `suốt cả năm` ("all year long") reads natural. | — |
| 237 (bodyVi year) | `Giá trị tốt nhất cho hành trình dài hạn với ít gián đoạn thanh toán hơn.` | `Best long-term value for steady learning without billing friction.` | **OK** — `hành trình dài hạn` ("long-term journey") is the warm framing; `ít gián đoạn thanh toán` ("less billing interruption") translates the friction concept naturally. | — |

### Plan-card bullets — EN-only on a VI-primary surface (lines 202–248)

Each plan card carries a 3-item `bullets: string[]` array. **All three plans ship EN-only bullets**, even though every other field on the same plan card has both EN and VI halves. This is the page's main bilingual-contract gap.

| Loc | EN (today) | Verdict | Proposed revision |
|---|---|---|---|
| 202–208 (level0 bullets) | `["Explore the experience before upgrading", "Good for first-time visitors", "No billing required"]` | **awkward — EN-only on a VI-primary surface** | Add a parallel `bulletsVi: string[]` field on the `Plan` struct AND render both halves on each bullet (mirror the `titleVi` / `subtitleVi` / `bodyVi` pattern). VI candidates: `["Khám phá trước khi nâng cấp", "Phù hợp cho người mới ghé thăm", "Không cần thẻ thanh toán"]`. |
| 220–226 (month bullets) | `["Unlock all premium rooms", "Good for trying the full experience", "Flexible monthly billing"]` | **awkward — same class as 202–208** | VI candidates: `["Mở khóa mọi phòng premium", "Phù hợp cho người muốn thử trọn vẹn", "Thanh toán linh hoạt hàng tháng"]`. |
| 240–246 (year bullets) | `["Best long-term value", "Full premium access all year", "Less billing friction"]` | **awkward — same class** | VI candidates: `["Giá trị dài hạn tốt nhất", "Trọn quyền premium cả năm", "Ít gián đoạn thanh toán hơn"]`. |

The fix requires touching the `Plan` type (line 37–51 — add
`bulletsVi?: string[]`) AND the render path (somewhere in the
plan-card render function); higher cost than a string-only edit but
the highest-impact bilingual-contract gap on the page.

### `BiText` action labels (lines 413–426)

| Loc | EN | VI | Order | Verdict | Proposed revision |
|---|---|---|---|---|---|
| 413 | `Checking access…` | `Đang kiểm tra quyền truy cập…` | bilingual | **OK** — natural progressive form. | — |
| 416 | `Updating plan…` | `Đang cập nhật gói…` | bilingual | **OK** — natural. | — |
| 417 | `Opening secure checkout…` | `Đang mở trang thanh toán bảo mật…` | bilingual | **OK** — natural. | — |
| 419 | `Upgrade monthly` | `Nâng cấp hàng tháng` | bilingual | **OK** — natural CTA. | — |
| 420 | `Upgrade yearly` | `Nâng cấp hàng năm` | bilingual | **OK** — natural CTA. | — |
| 422 | `Current plan` | `Gói hiện tại` | bilingual | **OK** — standard. | — |
| 425 | `Switch to monthly` | `Chuyển sang hàng tháng` | bilingual | **OK** — natural. | — |
| 426 | `Switch to yearly` | `Chuyển sang hàng năm` | bilingual | **OK** — natural. | — |

### Hero banner (lines 644–725)

Bilingual paragraph pairs (EN `<p>` followed by VI `<p>` in muted
type) plus three feature cards each with EN bold + VI sub-label.

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 647 | `Mở toàn bộ phòng học premium của MercyBlade` | `Get full access to all premium rooms` (line 644) | **OK** — `phòng học` ("lesson room") uses the canonical VI per the `MercyEnglishTab` `room`→`phòng` finding. | — |
| 654 | `Chọn gói phù hợp với tốc độ học của bạn. Có thể nâng cấp bất cứ lúc nào.` | `Choose a plan that fits your learning pace. Upgrade anytime.` (line 651) | **OK** — natural; "tốc độ học" ("learning pace") translates "pace" idiomatically. | — |
| 667 (feature card 1) | `Toàn quyền truy cập phòng premium` | `Full access to all premium rooms` | **OK** — natural. | — |
| 668 (feature card 2) | `Mở khóa ngay sau khi thanh toán thành công` | `Instant unlock after successful payment` | **OK** — natural. | — |
| 670–671 (feature card 3, conditional iOS) | `Quản lý hoặc hủy trong Cài đặt Apple ID` / `Quản lý hoặc hủy bất cứ lúc nào qua Stripe` | `Manage or cancel in Apple ID settings` / `Manage or cancel anytime in Stripe` | **OK** — both branches mirror EN cleanly; "Cài đặt Apple ID" is the standard VI for the Apple settings surface. | — |
| 700 (BiText, iOS / non-iOS branches) | `Quản lý qua Apple` / `Đang mở cổng thanh toán…` / `Quản lý gói đăng ký` | `Manage in Apple` / `Opening portal…` / `Manage subscription` | **OK** — natural across all three states; `cổng thanh toán` ("payment portal") is the standard VI. | — |
| 717 (BiText, year-busy state) | `Xem các gói` / `Đang mở…` / `Nâng cấp ngay` | `See plans` / `Opening…` / `Upgrade now` | **OK** — natural; `Nâng cấp ngay` ("Upgrade now") is the standard imperative CTA. | — |

### Comparison block — EN/VI labels with sub-text (lines 837–870)

The yearly-vs-monthly comparison cells use uppercase EN labels with
muted VI sub-labels — a deliberate asymmetric style (EN = title-case
metric label, VI = explanation/expansion). Different from the
`BiText` shape used elsewhere on the page but consistent within
this block.

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 841 | `Nếu trả theo tháng (12 tháng)` | `If paid monthly` | **OK** — VI is more explicit than the EN (adds "12 tháng" to make the math obvious). | — |
| 844 | `${MONTHLY_PRICE_VND} × 12 tháng` | (sub figure, VI-only fragment) | **OK** — runtime template; renders as e.g. `199.000 ₫ × 12 tháng`. | — |
| 854 | `Gói hàng năm` | `Yearly plan` | **OK** — standard. | — |
| 857 | `Tiết kiệm ${pct}% — chỉ ${YEARLY/12} ₫/tháng` | (line 860 has EN companion `Save ${pct}% · ≈ ${YEARLY/12} ₫/month`) | **OK** — pair reads naturally; both halves give the same per-month framing. | — |
| 863 / 866 | `Tiết kiệm ${formatPrice(savings, "VND")} mỗi năm` | `You save ${formatPrice(savings, "VND")} per year` (line 863, EN-first) | **OK** with note — VI follows EN inside the same block, which is acceptable for a numeric callout where the figure is the focal point. | — |

### Already-subscribed panel (lines 730–760)

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 736 | `Bạn đã có quyền truy cập premium.` | `You already have premium access.` (line 733) | **OK** — natural; uses `bạn` (correct learner pronoun for system-spoken messages). | — |

### Canceled / error / config notices (lines 770–790)

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 773 | `Thanh toán đã bị hủy. Không có thay đổi nào được thực hiện.` | `Checkout was canceled. No changes were made.` | **OK** — factual, no shame framing; "không có thay đổi" mirrors EN's "no changes" cleanly. | — |
| 788 | `Có lỗi xảy ra. Vui lòng thử lại.` | (error banner, EN comes from `errorText`) | **OK** — `Vui lòng + bare verb` is acceptable mid-formal "please" per `vi-style-guide.md` §3 (no honorific subject; doesn't trip the `Quý khách vui lòng` anti-pattern). | — |

### Subscription disclosure (lines 894–905) — Apple 3.1.2(c) / Google Play required

Two bilingual paragraphs (EN then VI) plus two link pairs in the
footer.

| Loc | VI | EN companion | Order | Verdict | Proposed revision |
|---|---|---|---|---|---|
| 899 | `Gói đăng ký tự động gia hạn. Gói sẽ tự động gia hạn vào cuối mỗi kỳ thanh toán với mức giá niêm yết trừ khi bạn hủy ít nhất 24 giờ trước ngày gia hạn. Bạn có thể quản lý hoặc hủy bất cứ lúc nào.` | (line 895–897 EN paragraph) | EN para then VI para | **OK** — formal-registered, factual; appropriate for the compliance-required disclosure context. | — |
| 902 (terms link) | `Điều khoản sử dụng` | `Terms of Use (EULA)` | **EN · VI** | **awkward — ordering** | Flip to `Điều khoản sử dụng / Terms of Use (EULA)`. VI must visually dominate per `vi-style-guide.md` §2; the `/` separator is fine. |
| 903 (privacy link) | `Chính sách bảo mật` | `Privacy Policy` | **EN · VI** | **awkward — ordering** | Flip to `Chính sách bảo mật / Privacy Policy`. Same fix. **Note:** the `AccountPage.tsx:831` audit revised this exact VI string to `Chính sách quyền riêng tư` (to align with the section heading `Quyền riêng tư` at AccountPage.tsx:812); the Phase-2 revision author should propagate the same wording here for cross-file consistency. |

### Trailing footer texts (lines 887–891, 658–662)

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 887–891 (iOS / non-iOS branches) | — (no VI) | `Subscriptions are billed through your Apple ID and managed in Apple ID → Subscriptions.` / `Payments are processed securely through Stripe. Existing subscribers are managed through Stripe Billing Portal.` | **EN-only on a VI-primary surface** — this footer paragraph runs without a VI half. The hero banner above carries bilingual paragraph pairs throughout; this trailing paragraph drops the convention. | (optional) Add a VI subtitle below: `Gói đăng ký được thanh toán qua Apple ID và quản lý trong Apple ID → Subscriptions.` / `Thanh toán được xử lý an toàn qua Stripe. Người dùng hiện tại quản lý qua Stripe Billing Portal.` |
| 658–662 (trust badges) | — (no VI) | `Billed through your Apple ID` / `Secure Stripe checkout` / `Cancel anytime` / `No hidden fees` | **EN-only trust badges** — small inline strip, EN-only by current design. Asymmetric with the bilingual pattern but defensible as design choice (trust badges are often EN-only in VN UI conventions for brand credibility). | (optional) Add VI subtitles to each badge if the team decides to push every visible element to bilingual. |

### SeoMeta + page chrome (lines 912–913, 684, 724)

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 912 (SEO title) | `Bảng giá MercyBlade — Học tiếng Anh cho người Việt` | — (title only) | **OK** — natural, on-brand. | — |
| 913 (SEO description) | `Các gói học tiếng Anh MercyBlade dành cho người Việt. Dùng thử miễn phí 7 ngày, hủy bất cứ lúc nào.` | — | **OK** — natural, action-led, mirrors marketing landing convention. | — |
| 684 (CTA inside hero) | — (no VI) | `Browse rooms` | **OK** with note — short CTA, EN-only is acceptable density (same surface convention as the `Back to home` button at 724). | (optional) If the bullet list above lands a `bulletsVi` field, this is a natural place to add `Khám phá phòng` as a sub-label. |
| 724 (CTA) | — (no VI) | `Back to home` | **OK** with note — short CTA, EN-only at this density. Same note as 684. | — |

---

## Cross-cutting observations

1. **The plan-card `bullets: string[]` array is the page's main
   VI-primary contract gap.** Three plans × three bullets each
   = nine EN-only strings on a Vietnamese-primary conversion
   surface. This is the highest-impact finding on the page —
   the bullet copy IS the value-prop framing a learner reads
   before deciding to upgrade.
2. **The disclosure-footer link pairs (lines 902–903) flip to
   EN-first.** Two lines in an otherwise VI-primary file.
   Trivial fix: flip the order.
3. **Cross-file alignment with `AccountPage.tsx:831`'s shipped
   revision.** The Privacy Policy link in `AccountPage.tsx` was
   revised to `Chính sách quyền riêng tư` in `!48`. The Pricing
   page still uses the older `Chính sách bảo mật` form. Worth
   propagating the same wording for cross-file consistency.
4. **The `Plan { titleVi, subtitleVi, bodyVi }` struct is the
   cleanest bilingual-pairing mechanism on the page** — every
   field that uses it reads on-voice. Extending it with
   `bulletsVi?: string[]` is the natural fix for finding #1.
5. **No shame triggers, no MT-feel.** Every cataloged VI string
   passes `vi-style-guide.md` §5 quick-checklist. The page's
   prose was written by a Vietnamese-native author.
6. **`Vui lòng + bare verb` appears once (line 788) on an error
   banner.** Acceptable per `vi-style-guide.md` §3 — no
   honorific subject, doesn't trip the `Quý khách vui lòng`
   anti-pattern. Same pattern the `LoginPage.tsx` audit
   green-lit.
7. **Bilingual-paragraph-pair pattern (lines 644–655, 894–900)
   is consistent and on-voice.** Worth promoting as the
   recommended shape for any future compliance-required
   bilingual disclosure (where both halves need to be
   simultaneously visible).

## References

- `docs/copy/bilingual-audit.md` §255 (priority entry — reassigned
  from `Tiers.tsx` to this file in the Phase-2 #3 re-categorization).
- `docs/copy/vi-style-guide.md` §1 (pronoun consistency — `bạn`
  for the learner is used correctly here), §2 (bilingual pairing —
  VI must dominate; lines 902–903 are the violation), §3 (`Vui lòng`
  acceptable on a no-honorific-subject error banner).
- `docs/copy/audits/AccountPage.tsx.md` — see line 831's
  `Chính sách bảo mật` → `Chính sách quyền riêng tư` revision (the
  cross-file alignment opportunity in observation #3).
- `docs/copy/audits/MercyEnglishTab.tsx.md` — see line 59's
  `room` → `phòng` revision (the canonical VI for "lesson room"
  that this page's `phòng học` uses correctly).
- `src/lib/pricing/displayPrices.ts` — the `formatPrice` +
  `MONTHLY_PRICE_VND` + `YEARLY_PRICE_VND` constants.
- `src/components/pricing/PaywallExperiment.tsx` — the experimental
  paywall surface (out of scope here; would warrant its own
  Phase-2 audit if/when it ships as the default).
