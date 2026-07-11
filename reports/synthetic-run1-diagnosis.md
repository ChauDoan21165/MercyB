# Synthetic run #1 diagnosis — journey (a) sign-in (pipeline 2668764981)

**Verdict: SPEC SELECTOR BUG (invalid Playwright syntax), NOT an auth failure.**
Journey (a) never submitted the login — the sign-in `locator.click` threw a CSS
parse error before any request went out. (b/c/d) are downstream of (a). Fix is in
this MR, grounded in the live prod DOM. (e)(f) were unaffected and passed.

---

## Journey (a) — root cause (job 15294488335, `journeys.spec.ts:73`)
Playwright error from the job log:
```
locator.click: Unexpected token "/" while parsing css selector
"button:has-text(/sign ?in|log ?in|đăng ?nhập/i), button[type="submit"]".
- waiting for button:has-text(/sign ?in|log ?in|đăng ?nhập/i), button[type="submit"] >> nth=0
```
`tests/prod-synthetic-learner/journeys.spec.ts:88` built the sign-in locator as a
**CSS string** using `:has-text(/regex/)`. Playwright's `:has-text()` inside a CSS
selector string does **not** accept a regex literal — the `/` is an unexpected
token, so the selector fails to parse and `.click()` throws. **The login was never
submitted**; the journey's `ok` stayed false and the assertion failed. This is a
spec-side selector defect, not a credential/auth problem.

## (b/c/d) — downstream of (a)
After (a) failed to sign in, journey (b) timed out (90s) waiting for
`getByRole('textbox').first()` — the /ai-tutor correction input requires a signed-in
session, which (a) never established:
```
b=no correction/buttons: locator.click: Test timeout of 90000ms exceeded.
- waiting for getByRole('textbox').first()
```
Additionally, `journeys.spec.ts:112` (the grammar "Sửa câu" submit) had the **same**
`:has-text(/regex/)` bug — so (b) would have failed on the identical parse error even
with a valid session. Both are fixed here.

## Discrimination: SELECTOR (fix spec) vs AUTH (hand back)
**SELECTOR.** The failure is a locator syntax error thrown *before* submit — no
request, no auth round-trip, no post-submit error/redirect. So the spec is fixed;
nothing is handed back to Chau on auth grounds for this run.

## Grounding — the real prod DOM (headless, no login)
Fetched `https://mercyblade.com/signin` (waited networkidle, no credentials):
- **URL stayed `/signin`** — the page did NOT bounce; the sign-in form is reachable.
- Every button is `type="button"` — **there is no `button[type="submit"]` on the page.**
- The sign-in button is `type="button"` with accessible name **"Đăng nhập · Sign in"**
  (source: `src/components/auth/EmailBlock.tsx:782`, `primaryActionLabel`).
- Email input: `autocomplete="email"` (no `type`/`name`) — the spec's
  `input[autocomplete="email"]` branch matches. Password field mounts after the
  "Đăng nhập bằng mật khẩu · Sign in with password" tab.
- /ai-tutor grammar submit is also `type="button"` (`src/components/ai-tutor/CorrectionMode.tsx:140`, `ui.submit`).

## The fix (this MR — `journeys.spec.ts`)
Replace both malformed CSS-string locators with valid role+name locators, keeping a
`button[type="submit"]` fallback for other environments:
- **:88 (sign-in)** → `page.getByRole("button", { name: /đăng nhập · sign in|^sign ?in$|^log ?in$/i }).or(page.locator('button[type="submit"]')).first()`
- **:112 (grammar submit)** → `page.getByRole("button", { name: /Sửa câu|Submit|Gửi|Kiểm tra/i }).or(page.locator('button[type="submit"]')).first()`
Validated live (no login): the fixed journey-(a) locator resolves to **count 1,
text "Đăng nhập · Sign in"** — the real button.

## Caveat for the NEXT run
This fix makes the sign-in click execute. Whether journey (a) then *passes* against
prod additionally depends on (i) the /signin bounce fix (!2581) being live in the
deployed bundle — the headless load shows /signin currently does NOT bounce, so this
looks OK — and (ii) the synthetic account's credentials/session actually completing
the redirect. If (a) still fails *after submit* on the next run (e.g. "BOUNCED back
to /signin" or a login error), that is the auth/credential path and goes back to Chau.

## Separate finding (no fix — logged for a later thread)
`golden-flows-prod` (job 15294501725) failed its **GATE** flow on a Cloudflare **502
Bad gateway**:
- Endpoint: **`POST https://mercyblade.com/api/mercy-ai`** (`mode: "ai-conversation-turn"`,
  the landlord roleplay turn — `tests/golden-flows/prod-golden-flows.pw.ts:109`,
  helper `postLearnerLedConversationTurn`).
- Timestamp: **2026-07-10T23:41:52Z**.
- `expect(landlordResponse.status()).toBe(200)` received `502`. Cloudflare 5xx →
  the origin/edge for `/api/mercy-ai` returned a bad gateway. Not addressed here.
