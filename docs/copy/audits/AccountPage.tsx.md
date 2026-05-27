# Phase-2 audit — `src/pages/AccountPage.tsx`

**Surface:** `/account` — the signed-in account page. Membership
status (free / Premium), referral code, leaderboard settings,
learning-languages picker, privacy controls, destructive actions
(reset Mercy's memory, delete account). The settings copy + the
destructive-action confirmations are where MT-feel and register
drift creep in across most apps.

**Priority:** **YES — priority** per `docs/copy/bilingual-audit.md`
§253. Settings copy is high-touch and a known MT-feel trap.

**Scope:** every user-facing VI string. 34 distinct surfaces
cataloged (most via the `BiLabel { en, vi }` component pattern;
some via inline `lang === "en" ? "..." : "..."` conditionals).

**Method:** verdict column per `docs/copy/bilingual-audit.md` §Method.

**Conclusion:** **30/34 OK + 4 revision candidates** (2 awkward —
pronoun inconsistency + ambiguous heading; 2 minor — semantic
mismatch on "privacy/security" and informal `&` punctuation). No
shame triggers; no MT-feel patterns at the lexical or syntactic
level.

---

## Catalog

### Auth + security errors (lines 256–267)

System-emitted messages on destructive-action failure paths.

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 257–258 | `Vì xóa tài khoản là hành động không thể hoàn tác, bạn cần xác thực mã 2FA. Đang chuyển đến trang xác thực…` | — (system error, VI-only render path) | **OK** — formal-but-appropriate security register. `hành động không thể hoàn tác` reads naturally; `Đang chuyển đến trang xác thực…` (present-continuous with ellipsis) signals motion correctly. | — |
| 266 | `Không thể xác minh trạng thái bảo mật. Vui lòng thử lại sau.` | — | **OK** — `Vui lòng + verb` without an honorific subject is the mid-formal "please". Per `vi-style-guide.md` §3, the anti-pattern is `Quý khách vui lòng…`; `Vui lòng + bare verb` is acceptable on a security-sensitive error. | — |

### Header + primary actions (lines 562–629)

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 562 (h1) | `Tài khoản của bạn` | `Account` | **OK** — VI is more personal ("Your account"); EN is the conventional terse form. Bilingual-pairing pattern from `vi-style-guide.md` §2 honored. | — |
| 577 (BiLabel) | `Kích hoạt mã quà tặng` | `Redeem gift code` | **OK** — `kích hoạt` ("activate") is one of two valid VI forms for "redeem". `đổi` (exchange) would also fit. Either reads natural. | — |
| 585 (BiLabel) | `Bảng giá` | `Pricing` | **OK** — standard idiom. | — |
| 596 (BiLabel, conditional) | `Đang đăng xuất…` / `Đăng xuất` | `Signing out…` / `Sign out` | **OK** — present-continuous + simple pair, mirrors EN. | — |
| 605 (BiLabel) | `Thanh toán` | `Billing` | **OK** — `Thanh toán` literally "payment", standard for the billing surface. | — |
| 612 (BiLabel) | `Tiến độ của tôi` | `My progress` | **awkward** — pronoun inconsistency. The rest of `AccountPage.tsx` addresses the learner as `bạn` (lines 562 `của bạn`, 702 `Bạn có quyền…`, 711 `Bạn đang dùng…`, 903 `về bạn`), but this label uses `tôi` (first-person). Mixed pronouns within one settings page read as if two different translators wrote the strings. | `Tiến độ của bạn` (align with the rest of the page) or `Tiến độ` (drop the possessive entirely — same fix the EN already implicitly does by using "My" only because it's a navigation label) |
| 621 (BiLabel) | `Lịch sử phát âm` | `Pronunciation history` | **OK** — natural. | — |
| 629 (BiLabel) | `Tải dữ liệu tiến độ` | `Download progress data` | **OK** — verb-noun-noun chain reads natural in VI. | — |

### Placement banner + entitlement refresh (lines 651–667)

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 651–652 (conditional) | `Làm lại bài đánh giá${cefr ? ` · ${cefr}` : ""}` / `Làm bài đánh giá` | (no inline EN — VI-only conditional) | **OK** — `Làm lại` / `Làm` pair is the standard "retake / take" verb shift. CEFR tail (`B1`, `B2`, etc.) is a learner-language identifier — fine to render bare. | — |
| 660 (BiLabel, conditional) | `Đang làm mới…` / `Làm mới quyền truy cập` | `Refreshing…` / `Refresh access` | **OK** — natural. | — |
| 667 (BiLabel) | `Tùy chọn email` | `Email preferences` | **OK** — `Tùy chọn` is "options"; `preferences` is the EN convention. Close enough. | — |

### Premium / free plan status (lines 689–724)

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 690 | `⭐ Premium đang hoạt động` | `⭐ Premium active` | **OK** — `đang hoạt động` ("is active") is the natural progressive form. "Premium" untranslated is correct (brand-product name). | — |
| 697 | `Gia hạn vào ${expiryText}` | `Renews on` | **OK** — `Gia hạn vào ${date}` reads naturally. | — |
| 702 | `Bạn có quyền truy cập đầy đủ.` | `You have full access.` | **OK** — direct, factual, on-voice. | — |
| 711 | `🔓 Bạn đang dùng bản miễn phí` | `🔓 You're on the free plan` | **OK** — `bản miễn phí` ("free version/plan") is the standard idiom. | — |
| 716 | `Mở khóa toàn bộ bài học, luyện thi, và phản hồi phát âm.` | `Unlock every lesson, exam prep set, and pronunciation feedback.` | **OK** — natural list. The serial `và` before the last item is correct VI. | — |
| 724 (button) | `Nâng cấp →` | `Upgrade →` | **OK** — short imperative, arrow reinforces motion. | — |

### Referral + leaderboard + learning-languages (lines 765–799)

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 765 | `Chia sẻ mã giới thiệu` | `Share referral code` | **OK** — natural. | — |
| 783 | `Bảng xếp hạng & tùy chọn` | `Leaderboard settings` | **minor / borderline** — two issues: (a) `&` is an English-punctuation habit; VI conventionally uses `và`; (b) the VI says "options" (`tùy chọn`) while the EN says "settings" — slight semantic drift. Neither rises to a defect; flag for the Phase-2 author. | `Bảng xếp hạng và cài đặt` (uses `và` instead of `&`; uses `cài đặt` which is the standard VI for "settings") |
| 799 | `Ngôn ngữ học` | `Learning languages` | **awkward** — ambiguous. `Ngôn ngữ học` reads two ways: (1) "languages [I am] studying" (the intended meaning), (2) "linguistics" (the academic field). The EN `Learning languages` uses the participle to disambiguate; the VI bare-NP doesn't. Native readers will pick the right reading from context, but the heading on its own is genuinely ambiguous. | `Ngôn ngữ đang học` (verb makes the participial reading explicit) or `Ngôn ngữ bạn học` (possessive disambiguates) |

### Privacy block (lines 812–839)

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 812 | `Quyền riêng tư` | `Privacy` | **OK** — natural, the standard VI idiom. | — |
| 831 (BiLabel) | `Chính sách bảo mật` | `Privacy Policy` | **minor** — semantic drift. `Chính sách bảo mật` literally "security policy"; the standard VI for "privacy policy" can be either `Chính sách bảo mật` (common in practice) or `Chính sách quyền riêng tư` (more literal). Today the page uses `Quyền riêng tư` for the section heading at line 812 — using `Chính sách quyền riêng tư` for the policy link would align the two. | `Chính sách quyền riêng tư` (align with line 812's `Quyền riêng tư`) |
| 839 (BiLabel) | `Điều khoản sử dụng` | `Terms of Use` | **OK** — standard legal-document idiom. | — |

### Reset Mercy's memory (lines 856–965)

The most prose-heavy block — confirmation modal with descriptive
warning + RESET-keyword input.

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 856 (BiLabel) | `Đặt lại bộ nhớ của Mercy` | `Reset Mercy's memory` | **OK** — possessive natural. | — |
| 885 | `Bộ nhớ của Mercy đã được xóa. Cô ấy sẽ bắt đầu lại từ buổi học tiếp theo.` | `Mercy's memory has been reset. She'll start fresh on your next lesson.` | **OK** — `Cô ấy` (third-person feminine pronoun for Mercy) is consistent with the character's gendered voice elsewhere. Minor: EN says `reset`, VI says `đã được xóa` ("has been deleted") — semantic drift; `đã được đặt lại` would mirror EN exactly. Acceptable as-is because the user *intent* is deletion. | (optional) `Bộ nhớ của Mercy đã được đặt lại.` (mirror EN's `reset`) |
| 903 | `Thao tác này sẽ xóa mọi thứ Mercy nhớ về bạn — các bài học trước, điểm mạnh, điểm yếu, và ghi chú về tính cách. Tài khoản và tiến độ của bạn được giữ nguyên.` | `This clears everything Mercy remembers about you — past lessons, strengths, weaknesses, and personality notes. Your account and progress stay.` | **OK** — descriptive, factual, sets correct expectations. Note: `điểm yếu` appears here in the descriptive context — same usage C8 flagged in `bilingual-audit.md` §324 as a stylistic opportunity rather than a defect. Inside a destructive-action confirmation modal, the descriptive context softens the framing further. | — |
| 909 | `Nhập **RESET** để xác nhận.` | `Type **RESET** to confirm:` | **OK** — natural imperative for a deliberate input action. EN uses a colon, VI uses a period; minor punctuation difference, both correct. | — |
| 953 (BiLabel, conditional) | `Đang đặt lại…` / `Đặt lại bộ nhớ` | `Resetting…` / `Reset memory` | **OK** — natural pair. | — |
| 965 (BiLabel) | `Hủy` | `Cancel` | **OK** — standard. | — |

### Delete account (lines 868–1040)

The destructive-action block — most safety-critical strings on
the page.

| Loc | VI | EN companion | Verdict | Proposed revision |
|---|---|---|---|---|
| 868 (BiLabel) | `Xóa tài khoản của tôi` | `Delete my account` | **OK** — uses `tôi` ("my") deliberately. The standard product-design convention is that destructive actions read in the *user's voice* (the user says "delete my account", not "delete your account"). This is the one acceptable use of `tôi` on this page; consistent with conventional UX writing. (Contrast with line 612's `Tiến độ của tôi` — that label is *system-spoken*, so it should be `bạn`.) | — |
| 984 | `Thao tác này sẽ xóa vĩnh viễn tài khoản, bộ nhớ, sổ tay và toàn bộ dữ liệu liên quan. Không thể hoàn tác.` | `This permanently deletes your account, memory, notebook, and all associated data. This cannot be undone.` | **OK** — descriptive, factual, correct destructive-action register. | — |
| 990 | `Nhập **DELETE** để xác nhận.` | `Type **DELETE** to confirm:` | **OK** — mirror of line 909 for the DELETE keyword. | — |
| 1031 (BiLabel, conditional) | `Đang xóa…` / `Xóa vĩnh viễn` | `Deleting…` / `Permanently delete` | **OK** — natural. | — |
| 1040 (BiLabel) | `Hủy` | `Cancel` | **OK** — standard. | — |

---

## Cross-cutting observations

1. **Pronoun consistency is the main revision target.** The page
   uses `bạn` (second-person, learner-facing) in most strings but
   slips to `tôi` (first-person) on one system-spoken label
   (line 612 `Tiến độ của tôi`). The deliberate `tôi` on the
   "Delete my account" action (line 868) is correct UX convention
   and should stay; the 612 slip is the actual fix. One-line change.

2. **`Ngôn ngữ học` (line 799) is the only string in the file
   that's genuinely ambiguous.** Worth a Phase-2 revision — every
   other "awkward" verdict in this audit is borderline; this one
   is a real comprehension question for a fresh reader.

3. **The destructive-action prose (lines 884–909, 983–990) is
   excellent.** Three paragraphs of confirmation-modal copy that
   describe consequences factually, name the keyword-to-type
   explicitly, and end with the correct destructive-action
   register. `vi-style-guide.md` §6 could add this surface as the
   exemplar for "destructive-confirmation copy".

4. **Privacy / security semantic alignment.** The section heading
   (`Quyền riêng tư`, line 812) and the policy link
   (`Chính sách bảo mật`, line 831) use different VI roots for the
   same concept. Aligning the policy link to
   `Chính sách quyền riêng tư` would tighten the surface — but
   this is a low-priority fix; both readings are valid in current
   Vietnamese tech writing.

5. **No shame triggers, no MT-feel.** No "kém", "tệ", "sai" framing;
   no calqued idioms; no over-use of `thật / rất / luôn`; no
   half-translated UI elements. The page's VI was written
   carefully.

6. **High pattern consistency via `BiLabel`.** ~70% of the page's
   VI surfaces flow through the `BiLabel { en, vi }` component
   pattern — one of the cleanest bilingual-pairing affordances in
   the codebase. The remaining ~30% (inline `lang === "en"` ternaries
   for prose paragraphs) is the convention split where MT-feel
   would normally creep in — but this page handles both registers
   competently.

## References

- `docs/copy/bilingual-audit.md` §253 (priority listing).
- `docs/copy/vi-style-guide.md` §1 (pronoun consistency: `bạn`
  for the learner), §2 (bilingual pairing), §3 (`Vui lòng`
  acceptable on security errors).
- `src/components/account/` — sub-components imported by this
  page; sampled in the C8 audit at ~90 VI lines, deferred to a
  Phase-2 follow-up wave (separate file from this audit).
