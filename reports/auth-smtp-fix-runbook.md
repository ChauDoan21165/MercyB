# Auth-email SMTP fix runbook (Supabase Auth → custom Resend SMTP)

**Problem:** signup OTP and password-recovery emails don't deliver to non-team
addresses on prod. Signature of Supabase's **built-in email service** (heavily
rate-limited, ~2–4/hour, and effectively only reliable to project members) —
i.e. custom SMTP is not configured. Fix: point Supabase Auth SMTP at Resend,
which already has the **`mercyblade.com`** domain verified (digest/alert emails
already send through it).

**No credentials in this repo/report.** A1 prepared the values + commands; Chau
creates the Resend key and enters the dashboard values.

---

## Grounding (from the repo — verified, not assumed)
- Resend key env var: **`RESEND_API_KEY`** (e.g. `email-automations/index.ts:202`,
  `email-broadcast/index.ts:212`, `parent-weekly-digest/index.ts:324`,
  `perf-alert/index.ts:146`).
- Resend SDK client: `new Resend(RESEND_API_KEY)` in those functions.
- Verified sender domain: **`mercyblade.com`** — comments "verified Resend domain"
  at `email-reengagement/index.ts:22`, `referral-recognition-email/index.ts:9`,
  `teacher-notifications/index.ts:14`.
- Exact from-addresses in active use (both on the verified domain):
  - **`MercyBlade <noreply@mercyblade.com>`** — `redeem-access-code/index.ts:16`
    (`FROM_ADDRESS`), `streak-reminder-email/index.ts:26`,
    `weekly-progress-email/index.ts:26`.
  - `Mercy Blade <admin@mercyblade.com>` — `email-broadcast/index.ts:25`, etc.
  - (One stale `onboarding@resend.dev` in an unrelated function — do NOT use.)
- **Chosen auth sender: `noreply@mercyblade.com`** (transactional/no-reply
  convention, matches `FROM_ADDRESS`). `admin@mercyblade.com` is an acceptable
  alternative — both are on the verified domain.

---

## STEP 0 (admin host) — confirm current state BEFORE changing anything
Reads the live Auth config via the Supabase Management API. `smtp_host` empty/null
⇒ **built-in service (the bug)**; `smtp_host: "smtp.resend.com"` ⇒ custom already set.
```sh
# Personal Access Token: Supabase dashboard → Account → Access Tokens → generate.
# (The Supabase CLI login also holds one; a PAT is the simplest for this call.)
export SUPABASE_ACCESS_TOKEN="<supabase personal access token>"

curl -sS "https://api.supabase.com/v1/projects/buemdfxyhxunzpgdoqin/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  | python3 -c 'import sys,json;c=json.load(sys.stdin);print(json.dumps({k:c.get(k) for k in ["smtp_host","smtp_port","smtp_user","smtp_admin_email","smtp_sender_name","smtp_max_frequency","external_email_enabled","mailer_autoconfirm"]}, indent=2))'
```
Expected on the broken state: `"smtp_host": null` (or `""`). That confirms the
built-in service is in use. (The SMTP password `smtp_pass` is write-only and is
never returned — good.)

Optional: the same endpoint accepts a `PATCH` to set SMTP via API instead of the
dashboard, but the dashboard form (Step 2) is the intended path and needs no
scripting.

---

## STEP 1 — create the Resend API key (2 clicks; Chau holds it)
1. Resend dashboard → **API Keys** → **Create API Key**.
2. Name `supabase-auth-smtp`, permission **Sending access**, domain
   **mercyblade.com** → **Create** → copy the key (`re_…`). **This key is the SMTP
   password** used in Step 2. Do not paste it anywhere but the Supabase SMTP form.

---

## STEP 2 — Supabase Auth SMTP form (the six values, pre-filled)
Supabase dashboard → project `buemdfxyhxunzpgdoqin` → **Authentication → Emails →
SMTP Settings** → enable **Custom SMTP**, then:

| # | Field | Value |
|---|---|---|
| 1 | **Host** | `smtp.resend.com` |
| 2 | **Port** | `465` *(if it fails, try `587`)* |
| 3 | **Username** | `resend` |
| 4 | **Password** | `[CHAU CREATES IN RESEND]` (the `re_…` key from Step 1) |
| 5 | **Sender email** | `noreply@mercyblade.com` |
| 6 | **Sender name** | `MercyBlade` |

Save. (Optional: raise "Minimum interval between emails" / rate limit if the
default throttles OTP resends — not required for the fix.)

---

## STEP 3 — verify delivery to a NON-team address
1. Trigger one auth email to a fresh non-team inbox (e.g. a personal Gmail that
   is NOT a project member):
   - **Signup OTP:** go to `mercyblade.com/signup`, enter the non-team email,
     request the code; **or**
   - **Recovery:** `mercyblade.com/signin` → "Quên mật khẩu / Forgot password"
     with a non-team account's email.
2. Confirm the email arrives in that inbox (from `noreply@mercyblade.com`).
3. Where failures show:
   - **Resend dashboard → Emails (Logs):** every attempt with status
     `delivered` / `bounced` / `complained` / `failed` and the reason — this is the
     authoritative send log.
   - **Supabase → Authentication → Logs (or Logs → Auth):** shows the SMTP send
     attempt and any SMTP error (auth/TLS/relay) from GoTrue's side.
   - Re-run Step 0's read: `smtp_host` should now be `"smtp.resend.com"`.

**Done when:** a non-team address receives the OTP/recovery email and Resend logs
show `delivered`.

---

### Notes
- The domain (`mercyblade.com`) is already verified in Resend (digest emails send
  today), so no DNS/verification work is needed — only the SMTP wiring above.
- Nothing in the app code changes; this is Supabase Auth configuration only.
- Project ref: `buemdfxyhxunzpgdoqin`.
