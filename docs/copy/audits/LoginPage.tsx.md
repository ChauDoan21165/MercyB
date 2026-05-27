# Phase-2 audit — `src/pages/LoginPage.tsx`

**Surface:** `/signin` (and `/login`) — the email + phone + social
OAuth sign-in page, plus a two-paragraph bilingual marketing panel
on the right. The first signed-in moment for most users.

**Priority:** named **YES — priority** in
`docs/copy/bilingual-audit.md` §254 — *"error-state strings are the
highest shame-risk category outside streak surfaces."*

**Scope:** every user-facing VI string. ~22 distinct surfaces
across `MarketingPanel`, the auth state pills, the success/error
notices, the OAuth buttons, and the mode-toggle row.

**Method:** verdict column per `docs/copy/bilingual-audit.md` §Method.

**Conclusion:** **18/22 OK + 4 revision candidates** (3 EN-only
success notices on a VI-primary surface, 1 borderline
`Vui lòng đợi…` button-busy label).

The file uses `useChromeT` (`t({vi, en})`) as the dominant
bilingual-pairing mechanism — clean and pervasive — plus a small
number of inline `vi · en` composite strings. The shame-risk
hypothesis from `bilingual-audit.md` §254 did NOT pan out: every
error-class string is routed through `humanizeAuthError` or the
auth-redirect-error mapping which emits bilingual `${vi}\n${en}`.
No raw error strings reach the user untranslated. Reuse the
recognition-error envelope pattern from `MercySpeakTab.tsx`
(`vi-style-guide.md` §6 candidate exemplar) as the model.

---

## Catalog

### Marketing panel (lines 100–135)

The two-paragraph bilingual block in the right column. EN paragraph
first, VI paragraph below — both visible side-by-side at desktop
widths. Hidden at ≤980 px (single-column collapse).

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 107 (EN headline) | — | `A loyal, smart, and gentle companion — for real life.` | — | — |
| 109–118 (EN body) | — | `Mercy Blade is part of the **Mercy — Serving Humanity App Ecosystem**. We walk with you through health, emotions, money, relationships, work, and meaning — with calm clarity and practical steps you can use today. No pressure. No judgment. Just a steady companion.` | — | — |
| 121 (VI headline) | `Người đồng hành thông minh và dịu dàng — cho đời sống thật.` | (mirror of 107) | **OK** — `Người đồng hành` ("companion") is the consistent brand voice; `dịu dàng` ("gentle") survives translation. | — |
| 124–129 (VI body) | `Mercy Blade là một phần của **Hệ sinh thái ứng dụng Mercy — Phục vụ Nhân loại**. Chúng tôi đồng hành cùng bạn trong sức khỏe, cảm xúc, tiền bạc, mối quan hệ, công việc và ý nghĩa sống.` | (mirror of 109–118) | **OK** — uses `Chúng tôi` (brand-voice "we"), which is acceptable on a marketing surface per `vi-style-guide.md` §1 register table *"Marketing landing: Confident, declarative, brand-voice. Less 'mình', more headline rhythm. Cô Mercy is the third-person teacher figure here."* The auth/login page sits adjacent to marketing in voice register, so `Chúng tôi` reads correct here. Note that the VI body drops the "No pressure. No judgment. Just a steady companion." tail — a deliberate compression. | — |
| 131 (badge) | — | `🌈 Mercy Blade • Calm • Practical • Human` | **OK** — brand stamp, EN-only as a design wordmark. | — |

### Page chrome — auth state, primary actions (lines 464–629)

The auth shell's first-class surfaces, all `useChromeT`-routed.

| Loc | VI | EN | Verdict | Proposed revision |
|---|---|---|---|---|
| 464 / 672 (back button × 2) | `← Về trang chủ` | `← Back to home` | **OK** — natural, arrow reinforces direction. | — |
| 468 (page title, inline bilingual) | `Đăng nhập hoặc tạo tài khoản · Sign in or create account` | (inline) | **OK** — VI · EN inline bilingual; cleanly the page's primary heading. | — |
| 470 (subtitle) | `Nhập email — chúng tôi sẽ gửi mã đăng nhập hoặc tạo tài khoản mới cho bạn · Enter your email — we'll send a code to sign you in or create your account` | (inline) | **OK** with note — uses `chúng tôi` referring to the system ("we'll send a code"). On a transactional auth surface this is system-attribution, not brand-bureaucracy. Acceptable but could be tightened to drop the agent: `Nhập email — sẽ có mã gửi đến hộp thư để đăng nhập hoặc tạo tài khoản. · Enter your email — a code will be sent to sign you in or create your account.` | (optional) drop the explicit agent |
| 486 (signed-in pill) | `✅ Đã đăng nhập.` | `✅ Signed in.` | **OK** — natural, factual. | — |
| 495 (Continue) | `Tiếp tục` | `Continue` | **OK** — standard. | — |
| 505 (Sign out) | `Đăng xuất` | `Sign out` | **OK** — standard. | — |
| 512–513 (signed-out pill) | `🔒 Đã đăng xuất — vui lòng đăng nhập.` | `🔒 Signed out — please sign in.` | **OK** — `vui lòng` is acceptable mid-formal "please" on an auth-state message; no honorific subject so doesn't trip the `Quý khách vui lòng` anti-pattern. | — |
| 518 (session-check pill) | `Đang kiểm tra phiên đăng nhập…` | `Checking session…` | **OK** — natural progressive form. | — |
| 553 (ecosystem title) | `Tài khoản Mercy` | `Mercy Account` | **OK** — standard. | — |
| 556–559 (ecosystem text) | `Một lần đăng nhập cho mọi ứng dụng Mercy.` | `One sign-in for all Mercy apps.` | **OK** — mirrors EN cleanly. | — |
| 563–566 (return-to text) | `Bạn đang đăng nhập để tiếp tục tới ` | `You're signing in to continue to ` | **OK** — natural progressive + preposition. Trailing space is for the inline `<b>` tag continuation. | — |
| 572 (return-to footer) | `Sau khi đăng nhập: ` | `After sign-in: ` | **OK** — natural. | — |
| 592–593 / 602–603 (busy label × 2) | `Vui lòng đợi...` | `Please wait...` | **awkward** — `Vui lòng đợi…` is the most common Vietnamese form for "please wait" on a busy button, but reads slightly formal for a learning app. A warmer form would be `Đang xử lý…` ("processing…") or just `Đợi tí…` ("hold on a sec…"). Borderline — fits the surface but doesn't fully clear the `vi-style-guide.md` §3 hotel-lobby register flag. The EN `Please wait...` is itself the standard form, so the VI is mirror-natural rather than translated. | (optional) `Đang xử lý…` (more action-led than waiting) |
| 593 / 604 (OAuth CTA × 2) | `Tiếp tục với Google` / `Tiếp tục với Facebook` | `Continue with Google` / `Continue with Facebook` | **OK** — standard. | — |
| 610 (divider) | `HOẶC` | `OR` | **OK** — all-caps separator, idiomatic. | — |
| 629 (mode toggle) | `📱 Số điện thoại` | `📱 Phone` | **OK** — natural. | — |

### Success notices (lines 287–300) — VI-primary contract gap

Three success notices set via `setNotice` when the user lands on
`/signin` with a state-flagged query string. **These render in the
notice card alongside the rest of the VI-primary chrome — but are
themselves EN-only.**

| Loc | VI | EN (today) | Verdict | Proposed revision |
|---|---|---|---|---|
| 287 (?logged_out=1) | — (none today) | `✅ You've been signed out.` | **awkward** — EN-only success notice on a VI-primary surface. The user just signed out of a VI page and now sees an EN-only confirmation. Should be bilingual to match the rest of the page. | `✅ Bạn đã đăng xuất.\n✅ You've been signed out.` (bilingual, matches the `${vi}\n${en}` shape already used at line 307 for the auth-redirect-error mapping) |
| 292 (?created=1) | — (none today) | `✅ Account created. You can sign in now.` | **awkward** — same class as line 287. | `✅ Đã tạo tài khoản. Bạn có thể đăng nhập ngay.\n✅ Account created. You can sign in now.` |
| 298 (?reset=1) | — (none today) | `✅ Password updated. You can sign in now.` | **awkward** — same class. | `✅ Đã cập nhật mật khẩu. Bạn có thể đăng nhập ngay.\n✅ Password updated. You can sign in now.` |

The auth-redirect-error path at line 307 ALREADY uses
`${mapped.vi}\n${mapped.en}` for bilingual error notices (via
`mapAuthRedirectError`). The fix here is to follow the same
bilingual shape for these three success notices.

---

## Cross-cutting observations

1. **The `useChromeT` pattern is the cleanest bilingual-pairing
   mechanism audited so far.** Eighteen of the page's surfaces flow
   through `t({vi, en})` — including the back-button, the
   auth-state pills, the OAuth CTAs, the divider, and the mode
   toggle. Every one of them is on-voice. Worth flagging as a
   reusable design pattern in `vi-style-guide.md` §6.

2. **The shame-risk hypothesis from `bilingual-audit.md` §254 did
   NOT pan out.** Every error-class string on this page is routed
   through `humanizeAuthError` or `mapAuthRedirectError`, both of
   which emit bilingual `${vi}\n${en}` already. No raw shame-y
   error reaches the user. The Phase-2 priority bar for "auth =
   shame risk" can be lowered after this MR.

3. **Three EN-only success notices (lines 287, 292, 298)** are the
   single revision class on this page. All three are easy fixes —
   just route them through the same `${vi}\n${en}` shape the
   error path already uses.

4. **`Vui lòng đợi…` on the OAuth busy buttons** is the only
   borderline-formal phrase. Minor; would not raise it standalone,
   but flag for the Phase-2 author's discretion.

5. **`Chúng tôi` usage is correct here.** The marketing-panel and
   subtitle uses of `chúng tôi` are surface-appropriate per the
   `vi-style-guide.md` §1 register table — auth + marketing
   surfaces use brand voice; the learner surfaces use `mình`. Don't
   "fix" these.

6. **No shame triggers, no MT-feel patterns at the lexical /
   syntactic level.** Cataloged strings all pass `vi-style-guide.md`
   §5 quick-checklist.

## References

- `docs/copy/bilingual-audit.md` §254 (priority entry).
- `docs/copy/vi-style-guide.md` §1 (`Chúng tôi` register table),
  §2 (VI-primary contract on all user-facing surfaces),
  §3 (hotel-lobby formality flag).
- `src/lib/i18n/chromeLanguage.ts` — `useChromeT` implementation.
- `src/lib/authHelpers.ts` — `humanizeAuthError`.
- `src/lib/authRedirect.ts` — `mapAuthRedirectError` (the
  bilingual `${vi}\n${en}` shape to mirror for the three EN-only
  success notices).
