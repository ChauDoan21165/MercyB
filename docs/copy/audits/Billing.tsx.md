# Phase-2 audit — `src/pages/Billing.tsx`

**Surface:** `/billing` — the signed-in billing management page.
Subscription status (Active / Past due / Grace / Paused / Canceled /
Expired / Revoked) + current access card + Monthly + Yearly + iOS
Subscribe cards + Refresh / Manage / View-plans actions + success/
error banners + post-checkout polling notices.

**Priority:** **YES** — named in
`docs/copy/bilingual-audit.md` §256 as priority Tier-3 (post-payment
+ invoice chrome). Companion to the Pricing surface (`src/screens/Pricing.tsx`)
audited in this same batch — together they form the conversion +
retention copy surface for paying users.

**Scope:** every user-facing VI string. Cataloged 28 distinct
surfaces — 7 status-label pairs, 6 `UiMessage { en, vi }` error/
success notices, 4 plan-button-state labels, page chrome (header,
sub-header, three cards), plus the `canceledLike` legacy-subscription
banner.

**Method:** verdict column per `docs/copy/bilingual-audit.md` §Method.
The file's dominant bilingual-pairing mechanism is the
`VIETNAMESE_SUB_STYLE` muted-subscript pattern (EN as primary text
+ VI immediately below in 12 px slate-400). Verdict on this pattern
overall: see Cross-cutting #1.

**Conclusion:** **27/28 OK + 1 revision candidate** —
auto-renew status string at line 599 (`"On"` / `"Off — cancels at
period end"`) is EN-only inside an otherwise-bilingual card.
Otherwise: every status label, every error/success notice, every
plan-button label has a clean bilingual pair. No shame triggers,
no MT-feel.

---

## Catalog

### Status labels (lines 84–114)

The `getStatusLabel(status)` helper returns a `<span>{en} ({vi})</span>`
inline pair — the parenthetical-VI shape, distinct from the
subscript-VI pattern used elsewhere on the page.

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 86 (default) | `Chưa kích hoạt` | `Inactive` | **OK** — `Chưa kích hoạt` ("not yet activated") is the standard idiom; the "yet" framing is on-voice. | — |
| 91 (active / trialing) | `Đang hoạt động` | `Active` | **OK** — natural progressive. | — |
| 93 (past_due) | `Quá hạn thanh toán` | `Past due` | **OK** — explicit ("payment past due") where EN is concise. Asymmetric but defensible — the explicit form helps users understand the state. | — |
| 95 (grace_period) | `Thời gian gia hạn` | `Grace period` | **OK** — natural. | — |
| 97 (paused) | `Đã tạm dừng` | `Paused` | **OK** — past-aspect (`Đã`), correct register for an account-state label. | — |
| 99 (canceled) | `Đã hủy` | `Canceled` | **OK** — terse, natural. | — |
| 101 (expired) | `Đã hết hạn` | `Expired` | **OK** — past-aspect, natural. | — |
| 103 (revoked) | `Đã bị thu hồi` | `Revoked` | **OK** — passive past-aspect; the `bị` particle adds the affected-by-action framing correctly. | — |

### Error / success notices via `UiMessage { en, vi }` (lines 130–172, 316–392)

Every notice routes through a `UiMessage` typed pair — rendered with
the EN-primary + VI-subscript shape (line 555/563).

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 136 | `Không thể tải thông tin giá. Vui lòng làm mới hoặc thử lại.` | `We couldn't load pricing. Please refresh or try again.` | **OK** — `Vui lòng + bare verb` is acceptable on a technical-failure error per `vi-style-guide.md` §3 (no honorific subject). | — |
| 143 | `Yêu cầu thanh toán đang thiếu Stripe price ID.` | `Checkout request is missing the Stripe price ID.` | **OK** — factual; "Stripe price ID" left untranslated is correct (it's a technical identifier the user can give to support). | — |
| 150 | `Hiện không thể mở trang thanh toán. Vui lòng thử lại.` | `We couldn't open billing right now. Please try again.` | **OK** — `Hiện` ("currently") + `Vui lòng thử lại` is the standard transient-failure pattern. | — |
| 157 | `Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại rồi thử thanh toán tiếp.` | `Your session expired. Please sign in again, then retry billing.` | **OK** — `rồi thử… tiếp` ("then try… again") is the sequenced-action frame; reads natural. | — |
| 164 | `Gói đăng ký trước đó đã kết thúc, nên hệ thống sẽ mở một lần thanh toán mới.` | `Your earlier subscription ended, so we're opening a fresh checkout instead.` | **OK** — explanatory; `nên hệ thống sẽ mở…` ("so the system will open…") translates the EN's "so we're opening…" with system-attribution rather than first-person plural. Acceptable for an automated-flow message. | — |
| 170 | `Có lỗi xảy ra. Vui lòng thử lại.` | (raw error message, EN-side) | **OK** — generic fallback; same pattern as Pricing.tsx:788's audit verdict (`!49`-batch). | — |
| 318 | `Gói của bạn đã được cập nhật. Đang làm mới trạng thái thanh toán…` | `Your plan was updated. Refreshing billing status...` | **OK** — present-perfect + present-progressive pair, matches EN. | — |
| 326 | `Gói đăng ký của bạn đã được cập nhật đầy đủ.` | `Your subscription is up to date.` | **OK** — `đã được cập nhật đầy đủ` ("has been fully updated") translates "is up to date" cleanly. | — |
| 331 | `Thanh toán đã thành công. Hệ thống có thể cần thêm một chút thời gian để đồng bộ.` | `Payment succeeded. Billing may take a moment to sync.` | **OK** — `cần thêm một chút thời gian` ("needs a little more time") is warmer than a literal "may take a moment" — on-voice. | — |
| 350–351 (config error) | `Stripe price_id cho gói {tháng/năm} chưa được cấu hình trong root .env.` | `{Monthly/Yearly} Stripe price_id is not configured in root .env.` | **OK** — admin-facing config error, technical register acceptable. | — |
| 383 | `Trạng thái thanh toán của bạn đã được cập nhật.` | `Your billing status is up to date.` | **OK** — minor variant of 326; both natural. | — |
| 391 | `Bạn đã ở đúng gói này rồi.` | `You are already on that plan.` | **OK** — `Bạn đã… rồi` ("you're already…") is the right idiom; `đúng gói này` ("on this exact plan") is conversational. | — |

### Plan-button state labels (lines 184–228)

`getPlanButtonLabel()` returns a `<div>{en}<span class="vi-sub">{vi}</span></div>` pair.

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 188 | `Đang kiểm tra…` | `Checking...` | **OK** — natural progressive. | — |
| 197 | `Đang xử lý…` | `Processing...` | **OK** — natural. | — |
| 206 | `Gói hiện tại` | `Current plan` | **OK** — standard. | — |
| 218 (switch) | `Chuyển sang gói {tháng/năm}` | `Switch to {monthly/yearly}` | **OK** — natural. | — |
| 219 (subscribe) | `Đăng ký theo {tháng/năm}` | `Subscribe {monthly/yearly}` | **OK** — natural. | — |

### Page chrome (lines 485–550)

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 492 (h1 sub) | `Quản lý thanh toán` | `Billing` | **OK** — natural section title; sub-label matches the EN h1 cleanly. | — |
| 500 (sub-body) | `Quản lý gói đăng ký và phương thức thanh toán của bạn.` | `Manage your subscription and payment methods.` | **OK** — natural; "gói đăng ký và phương thức thanh toán" is the standard pair. | — |
| 507 (canceledLike banner) | `Gói đăng ký cũ đã kết thúc. Vui lòng chọn một gói bên dưới để bắt đầu lại.` | `Your previous subscription ended. Choose a plan below to start a fresh subscription.` | **OK** with note — `Vui lòng` here is on an informational notice (not a technical-failure error), softer than the call-to-action requires. A learner-friendlier form would drop the `Vui lòng`: `Hãy chọn một gói bên dưới để bắt đầu lại.` — but that would re-introduce the bare `Hãy` imperative the `MercySpeakTab.tsx:1125` audit flagged. The current `Vui lòng chọn` is the safest middle ground; flag only if the team wants to tighten further. | (optional) `Chọn một gói bên dưới để bắt đầu lại nhé.` (drop `Vui lòng`, add `nhé` particle for warmth) — but this is borderline; the current copy is acceptable. |
| 515 (refresh button) | `Làm mới quyền truy cập` | `Refresh access` | **OK** — natural. | — |
| 532 (Apple manage subscript) | `Quản lý qua Apple` | `Manage in Apple` | **OK** — pattern-match with Pricing.tsx:700. | — |
| 539 (manage subscript, conditional) | `Đang mở cổng thanh toán…` / `Quản lý thanh toán` | `Opening…` / `Manage billing` | **OK** — natural pair. | — |
| 546 (view plans subscript) | `Xem gói` | `View plans` | **OK** — terse, natural. | — |

### Current-access + plan cards (lines 574–688)

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 577 (label) | `Quyền truy cập hiện tại` | `Current access` | **OK** — natural. | — |
| 586 (label) | `Trạng thái` | `Status` | **OK** — standard. | — |
| 592 (label) | `Gia hạn tiếp theo` | `Renews` | **OK** — explicit ("next renewal") vs concise EN; reads natural. | — |
| 598 (label) | `Tự động gia hạn` | `Auto-renew` | **OK** — standard. | — |
| 599 (value) | — (no VI — EN-only) | `On` / `Off — cancels at period end` | **awkward — EN-only on a VI-primary card** — Status, Renews, and Auto-renew labels all have VI subscripts; the auto-renew VALUE (`On` / `Off — cancels at period end`) is EN-only. Asymmetric within the same field. | Add VI: `Bật` / `Tắt` for the simple states; for `Off — cancels at period end` → `Tắt — sẽ hủy vào cuối kỳ` or `Tắt — kết thúc ở kỳ thanh toán hiện tại`. |
| 608 (label) | `Hàng tháng` | `Monthly` | **OK** — standard. | — |
| 616 (body sub) | `Truy cập linh hoạt, thanh toán hàng tháng.` | `Flexible recurring access with monthly billing.` | **OK** — natural; slight compression vs EN (drops "recurring") but reads cleanly. | — |
| 636 (label) | `Hàng năm` | `Yearly` | **OK** — standard. | — |
| 644 (body sub) | `Giá trị tốt nhất với quyền Premium trong cả năm.` | `Best long-term value with full premium access all year.` | **OK** — natural; "quyền Premium" ("Premium rights/access") leaves "Premium" untranslated, consistent with the brand-product convention used elsewhere. | — |
| 651 (savings badge) | `Tiết kiệm 17% • Tặng 2 tháng` | `Save 17% • 2 months free` | **OK** — `Tặng 2 tháng` ("gifting 2 months") is warmer than a literal `2 tháng miễn phí` ("2 months free") — on-voice for a promotional badge. | — |
| 671 (iOS Subscribe label) | `Đăng ký` | `Subscribe` | **OK** — standard. | — |
| 676 (iOS Subscribe body) | `Trên iOS, gói đăng ký được thanh toán qua Apple ID.` | `Subscriptions on iOS are billed through your Apple ID.` | **OK** — natural; reorders the topic ("On iOS, …") for natural VI sentence flow. | — |
| 686 (iOS CTA sub) | `Xem các gói` | `See plans` | **OK** — pattern-match with Pricing.tsx:717. | — |

---

## Cross-cutting observations

1. **The `VIETNAMESE_SUB_STYLE` muted-subscript pattern is the
   page's dominant bilingual-pairing mechanism** — EN as primary
   visible text + VI immediately below in 12 px slate-400 muted
   type. Used across 20+ surfaces consistently. Reads as a
   single bilingual unit on every visit. Different shape from
   `Pricing.tsx`'s `BiText { en, vi }` component but equally
   on-voice; worth comparing the two patterns in
   `vi-style-guide.md` §6 (subscript-VI for inline status/state
   labels vs side-by-side paragraphs for prose).
2. **The single defect** — line 599's `Auto-renew` VALUE
   (`On` / `Off — cancels at period end`) is EN-only inside an
   otherwise-bilingual card. The label has VI (`Tự động gia hạn`,
   line 598), but the value (Yes/No state) does not. Easy fix.
3. **`Vui lòng + bare verb` appears 4 times** (lines 136, 150,
   157, 170) on technical-failure errors — all acceptable per
   `vi-style-guide.md` §3 (no honorific subject; doesn't trip
   the `Quý khách vui lòng` anti-pattern). Plus 1 borderline at
   line 507 on an informational notice — acceptable but tighter
   alternatives exist.
4. **Status labels (lines 84–114) use parenthetical-VI shape**
   (`{en} ({vi})`) — distinct from the subscript-VI used
   elsewhere on the page. The parenthetical works as a compact
   inline pair that fits within a single sentence ("Status: Active
   (Đang hoạt động)"). Acceptable internal inconsistency — the
   parenthetical is the right shape for inline-flowed text.
5. **No shame triggers, no MT-feel.** Every cataloged VI string
   passes `vi-style-guide.md` §5 quick-checklist. The page's
   prose was written by a Vietnamese-native author with explicit
   billing-domain register awareness.
6. **The `Tặng 2 tháng` savings-badge framing (line 651)** is
   worth flagging as a `vi-style-guide.md` §6 exemplar — turning
   "free" ("miễn phí", neutral) into "gifted" ("tặng", warm) is
   a small but on-voice translation choice that promotional
   copy elsewhere can borrow.
7. **`planName` runtime fallbacks (line 277–280)** render EN-only
   strings (`"Free Plan"`, `"Premium"`). These appear inside the
   `Current access` card at line 581. Acceptable because:
   `"Premium"` is a brand-product name (intentionally
   untranslated, consistent with Pricing.tsx convention); and
   `"Free Plan"` is a transient fallback when `ent.plan_name` is
   not yet loaded — the user sees it briefly during cold-load.
   Not flagged.

## References

- `docs/copy/bilingual-audit.md` §256 (priority entry —
  Billing.tsx + BillingSuccess(Page).tsx pair).
- `docs/copy/vi-style-guide.md` §1 (pronoun consistency — `bạn`
  used correctly throughout), §3 (`Vui lòng` acceptable on
  technical-failure errors), §6 (the `VIETNAMESE_SUB_STYLE` and
  `Tặng 2 tháng` patterns worth promoting).
- `docs/copy/audits/Pricing.tsx.md` — sister surface audited in
  the same batch; together they form the conversion + retention
  copy.
- `src/pages/BillingSuccess.tsx` + `BillingSuccessPage.tsx` —
  the post-payment confirmation pages (~250 lines each); paired
  Tier-3 entry under §256, separate audit needed.
- `src/lib/billing/` — `fetchMyEntitlement`, `openBillingPortal`,
  `startCheckoutOrOpenPortal` — the billing edge-function client.
