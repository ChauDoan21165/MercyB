# Phase-2 audit — `src/pages/BillingSuccessPage.tsx`

**Surface:** `/billing/success` — the post-checkout landing page.
Header + body intro paragraph + two-card status grid
(Current access + Subscription status) + four-button action row
(Refresh access / Go to rooms / Account / Billing). Conditional
states: entitlement loading, premium-active, payment-received-
but-not-yet-premium.

**Priority:** **YES** — named in `docs/copy/bilingual-audit.md`
§256 as the post-payment companion to `Billing.tsx` (audited
in !65, revisions !89). Listed for batch-4 (Phase-2 #7) in the
!89 still-pending-list.

**Scope special note — CC2 kids-mode lane:** zero kids
references in this file (`grep` confirmed). No kids paths to
skip.

**Scope:** every user-facing VI string. Cataloged 25 distinct
surfaces — 7 status-label pairs (`getStatusLabel`), 1 access-
label state machine with 4 branches, conditional title + body
intro + status panels, 4 action buttons, and the loading-state
placeholders.

**Method:** verdict column per `docs/copy/bilingual-audit.md`
§Method. Adds a *state* column to track the multi-branch
conditional copy (entitlementLoading / isPremium / fallback).

**Conclusion:** **25/25 OK.** **No defects.** This is the
strongest billing-surface page audited to date — every state of
every conditional carries a paired VI line via the file's local
`viStyle` constant. The page is the post-payment proof-of-
concept for the bilingual-everything posture. Plus four
cross-cutting findings: a stale-duplicate companion file at
the same `src/pages/` path, an a11y-compliant slate-500 color
choice, a deliberate decision to mirror — not localize —
`getStatusLabel` against `Billing.tsx`, and a stylistic
opportunity to promote the file as a `vi-style-guide.md` §6
exemplar for "post-action confirmation page" surfaces.

---

## Catalog

### `getStatusLabel` status labels (lines 10–22)

Eight conditional `{en, vi}` pairs (7 cases + default). All
read natural — pattern-match the `Billing.tsx` audit (!65)'s
status labels.

| Loc | Case | VI | EN | Verdict | Proposed revision |
|---|---|---|---|---|---|
| 12 | active | `Đang hoạt động` | `Active` | **OK** | — |
| 13 | trialing | `Đang dùng thử` | `Active (trial)` | **OK** — `Đang dùng thử` ("currently trying") is the natural VI for "trial" state. | — |
| 14 | grace_period | `Trong thời gian gia hạn` | `Grace period` | **OK** — explicit ("during the grace period"); pattern-match with `Billing.tsx`'s `Thời gian gia hạn`. | — |
| 15 | past_due | `Quá hạn thanh toán` | `Past due` | **OK** | — |
| 16 | paused | `Đã tạm dừng` | `Paused` | **OK** | — |
| 17 | expired | `Đã hết hạn` | `Expired` | **OK** | — |
| 18 | revoked | `Đã bị thu hồi` | `Revoked` | **OK** | — |
| 20 | inactive / default | `Chưa kích hoạt` | `Inactive` | **OK** — `Chưa kích hoạt` ("not yet activated") is the warmer-than-literal framing; matches `Billing.tsx`. | — |

### `accessLabel` state machine (lines 76–82)

Four conditional `{en, vi}` pairs covering the
loading / free / trial / premium cases.

| Loc | State | VI | EN | Verdict | Proposed revision |
|---|---|---|---|---|---|
| 77 | entitlementLoading | `Đang tải…` | `Loading…` | **OK** — pattern-match standard. | — |
| 78 | not premium | `Truy cập miễn phí` | `Free access` | **OK** — `Truy cập miễn phí` is the standard VI. | — |
| 80 | trialing | `Cao cấp (dùng thử)` | `Premium (trial)` | **OK** with note — `Cao cấp` translates "Premium" literally ("high-tier"); this is the only place in the page that does NOT leave "Premium" untranslated. The rest of the page uses `Premium` as a brand-product name (e.g. line 81 `Quyền truy cập Premium`). Defensible — `Cao cấp (dùng thử)` reads natural — but inconsistent with the page's own pattern. | (optional) `Premium (dùng thử)` (drop `Cao cấp` to align with the page's own brand-product convention). |
| 81 | premium | `Quyền truy cập Premium` | `Premium access` | **OK** — natural; "Premium" as brand-product. | — |

### Page header — title + body intro (lines 148–176)

Both blocks are 3-branch conditionals; every branch has a paired VI.

| Loc | State | VI | EN | Verdict | Proposed revision |
|---|---|---|---|---|---|
| 150 → 157 (title, loading) | entitlementLoading | `Đang xác nhận quyền truy cập…` | `Confirming your access…` | **OK** — natural progressive form. | — |
| 152 → 159 (title, premium) | isPremium | `Thanh toán thành công` | `Payment successful` | **OK** — standard. | — |
| 153 → 160 (title, fallback) | not premium yet | `Đã nhận thanh toán` | `Payment received` | **OK** — `Đã nhận` ("have received") is the right perfect-aspect form for the moment between checkout-complete + webhook-confirmed. | — |
| 165 → 172 (body, loading) | entitlementLoading | `Đang đồng bộ trạng thái gói đăng ký…` | `Syncing your subscription status…` | **OK** — natural. | — |
| 167 → 173 (body, premium) | isPremium | `Quyền truy cập Premium đang hoạt động. Bạn có thể vào tất cả phòng Premium.` | `Your premium access is now active. You can explore all premium rooms.` | **OK** — uses `bạn` correctly for the system-spoken success message. `vào tất cả phòng Premium` ("go into all Premium rooms") uses the cross-file canonical `vào phòng` verb (per `MercyEnglishTab:163`, `Pricing:647`). | — |
| 168 → 175 (body, fallback) | not premium yet | `Thanh toán đã hoàn tất. Nếu quyền truy cập chưa cập nhật, hãy nhấn Làm mới quyền truy cập.` | `Your payment is complete. If access hasn't updated yet, tap Refresh access below.` | **OK** with note — uses `hãy nhấn` (bare imperative). Per `MercySpeakTab.tsx:1125`'s `!48` revision (dropped `Hãy thu âm trước` → `Thu âm trước`), `Hãy + bare imperative` is the anti-pattern. **But** this is an instructional sentence (telling the user what to do), not a CTA itself — the bare imperative reads naturally here. Borderline. Flag for the Phase-2 author's discretion. | (optional) `Thanh toán đã hoàn tất. Nếu quyền truy cập chưa cập nhật, nhấn Làm mới quyền truy cập bên dưới nhé.` (drop `hãy`, add `nhé` particle for warmth, add `bên dưới` to match EN's "below"). |

### Status grid panels (lines 181–211)

Two panels (Current access + Subscription status), each with a
bilingual label + bilingual value.

| Loc | VI | EN | Verdict | Proposed revision |
|---|---|---|---|---|
| 182–183 (label) | `Quyền truy cập hiện tại` | `Current access` | **OK** — pattern-match `Billing.tsx:577`. | — |
| 186–187 (value) | (interpolated `accessLabel.vi`) | (interpolated `accessLabel.en`) | **OK** — value comes from `accessLabel` state-machine above; verdicted on that row. | — |
| 191–198 (sub-paragraph, premium) | `Tất cả phòng Premium đã được mở khóa.` | `All premium rooms are unlocked.` | **OK** — natural. | — |
| 192–198 (sub-paragraph, not premium) | `Chưa tìm thấy gói Premium đang hoạt động.` | `No active premium subscription found yet.` | **OK** — `Chưa tìm thấy` ("not yet found") is the right tentative aspect for the moment-after-checkout. | — |
| 203–204 (label) | `Trạng thái gói đăng ký` | `Subscription status` | **OK** — pattern-match `Billing.tsx`'s "Status" labels. | — |
| 207 / 209 (value, loading) | `Đang tải…` | `Loading…` | **OK** — placeholder. | — |

### Action row (lines 217–243)

Four buttons; each a bilingual EN-primary + VI-subscript pair.

| Loc | VI | EN | Verdict | Proposed revision |
|---|---|---|---|---|
| 223 / 225 (Refresh) | `Đang làm mới…` / `Làm mới quyền truy cập` | `Refreshing…` / `Refresh access` | **OK** — pattern-match `Billing.tsx:539+515`. | — |
| 230–231 (Go to rooms) | `Vào phòng học` | `Go to rooms` | **OK** — uses `Vào phòng học` (the canonical `vào phòng` verb per cross-file precedent). Matches `MercyEnglishTab.tsx:163` + `Pricing.tsx:647`. | — |
| 235–236 (Account) | `Tài khoản` | `Account` | **OK** — pattern-match `AccountPage.tsx:562`. | — |
| 240–241 (Billing) | `Thanh toán` | `Billing` | **OK** — pattern-match `Billing.tsx:492`. | — |

---

## Cross-cutting observations

1. **The file is a Phase-2 §6 exemplar candidate for
   "post-action confirmation page."** Every conditional state of
   every conditional surface (header title × 3, body intro × 3,
   access label × 4, status label × 8, action row × 4) ships a
   matched VI counterpart. The file's local `viStyle` constant
   (line 24) is the muted-subscript shape and is reused for
   every VI line. This is the cleanest end-to-end bilingual page
   audited so far in the cascade. Worth promoting alongside the
   `MercySpeakTab.tsx` recognition-error envelope and
   `AccountPage.tsx` destructive-action prose.
2. **Color choice is a11y-compliant out of the gate** —
   `viStyle.color = "#64748b"` (slate-500, 4.78:1 on white) per
   the !64 a11y-contrast audit. Pattern other pages should adopt
   when refactoring away from `#94a3b8` (slate-400).
3. **Known noise file: `src/pages/BillingSuccess.tsx` is a
   dead duplicate.** The live `/billing/success` route in
   `src/router/AppRouter.tsx:1430-1433` imports
   `BillingSuccessPage` (line 64). `BillingSuccess.tsx` (older
   variant, ~253 lines, different polling logic) has zero
   importers (`grep -rn 'BillingSuccess[^P]' src/` confirmed —
   only its own self-reference comments). Flagged for cleanup;
   not edited or audited here per the diagnostic-only scope.
   Same shape as the `upabase/functions/stripe-webhook.ts`
   stray flagged in !80 (CLAUDE.md + billing-entitlement.md):
   tracked source, no consumers, needs a deliberate-deletion
   dispatch.
4. **`getStatusLabel` deliberately mirrors `Billing.tsx`'s
   `getStatusLabel`** (every label pair is identical or
   trivially equivalent). This is GOOD — the same status read
   by a user in two contexts (post-checkout + ongoing billing
   page) should read identically. Adding a `_shared` helper to
   collapse the duplication is a refactor question, not a copy
   question.
5. **Em-pronoun thesis (per !65 UnifiedMercyChat audit):
   does NOT apply.** This page uses `bạn` (second-person formal
   `you`) throughout (lines 167 `Bạn có thể vào tất cả phòng`,
   175 `quyền truy cập chưa cập nhật`, etc.). This is CORRECT
   — the thesis's distinction is: `em` for Mercy-conversational
   surfaces, `bạn` for system-spoken / settings / page-chrome
   surfaces. A billing-result page is system-spoken; `bạn` is
   the right register. Confirms the thesis's scope (not
   contradicts it).
6. **No shame triggers, no MT-feel.** Every cataloged VI string
   passes `vi-style-guide.md` §5 quick-checklist.
7. **The `Hãy + nhấn` borderline on line 175** is the file's
   only stylistic note. Acceptable as instructional copy; would
   benefit from the `nhé`-particle warming used in `!48`'s
   MercySpeakTab revisions but is not a defect.

## References

- `docs/copy/bilingual-audit.md` §256 (priority entry — paired
  with `Billing.tsx`).
- `docs/copy/vi-style-guide.md` §1 (pronoun register — `bạn`
  for system-spoken surfaces; this page applies the rule
  correctly).
- `docs/copy/audits/Billing.tsx.md` — sibling audit
  (`getStatusLabel` mirror + `VIETNAMESE_SUB_STYLE` shape).
- `docs/copy/audits/UnifiedMercyChat.tsx.md` — `em`-pronoun
  thesis (this page confirms the thesis's scope distinction).
- `docs/copy/audits/MercySpeakTab.tsx.md` — recognition-error
  envelope at lines 422–438 (the `nhé`-particle precedent the
  optional line-175 revision references).
- `src/pages/BillingSuccess.tsx` — the dead-duplicate sibling
  flagged in cross-cutting #3.
- `src/router/AppRouter.tsx:64, 1430–1433` — the live wiring
  (confirms `BillingSuccessPage` is the wired page).
- `[memory: project_marketing_consent_is_tracking]` — adjacent
  domain (post-payment tracking vs email opt-out boundary;
  this page doesn't touch it but a future "after-payment opt-in
  CTA" addition should).
