# Sign in with Apple — Configuration Checklist

**Owner:** CC3 (Apple Sign-In track, branch `ios/apple-signin`)
**Do this BEFORE the Phase 2 code lands.** When every step below is green, tell CC3 `config done` and Phase 2 begins.

Every step assumes you are signed in with the Apple ID that owns the MercyBlade Apple Developer account.

---

## 0. What we already know

| Thing | Value |
|---|---|
| iOS bundle identifier | `com.chaudoan.mercyblade` (confirmed from `project.pbxproj`) |
| Supabase project ref | `buemdfxyhxunzpgdoqin` |
| Supabase auth callback | `https://buemdfxyhxunzpgdoqin.supabase.co/auth/v1/callback` |
| Web domain | `mercyblade.com` |

---

## 1. Apple Developer Portal

**Root URL:** https://developer.apple.com/account

You will create / collect **six things** in this section:
1. Enable "Sign in with Apple" on the App ID
2. Create a Services ID
3. Configure the Services ID with your domain + return URL
4. Download the `apple-developer-domain-association.txt` file and upload it to your web server
5. Create a Sign in with Apple private key (`.p8` file)
6. Note down: Team ID, Key ID, Services ID identifier

### 1.1 Enable Sign in with Apple on the App ID

1. Navigate: https://developer.apple.com/account/resources/identifiers/list
2. In the filter dropdown, pick **App IDs**
3. Click the row for `com.chaudoan.mercyblade` (that's the primary App ID — the one matching the iOS bundle).
   - If the row doesn't exist, click **+** → **App IDs** → **App** → Continue → fill in `com.chaudoan.mercyblade` as Bundle ID, description "MercyBlade".
4. In the Capabilities list, scroll until you see **Sign in with Apple** and tick its checkbox.
5. Leave the "Enable as a primary App ID" setting at the default ("Enable as a primary App ID").
6. Click **Save**. Confirm when prompted.

✅ Checkpoint: the App ID row for `com.chaudoan.mercyblade` now shows "Sign in with Apple" as enabled.

### 1.2 Create a Services ID

A Services ID is a separate identifier used for the web-redirect / Supabase OAuth flow. It's NOT the same as the App ID.

1. Same page: https://developer.apple.com/account/resources/identifiers/list
2. Click the **+** button at the top of the identifier list.
3. Select **Services IDs** → Continue.
4. Fill in:
   - **Description:** `MercyBlade Sign In`
   - **Identifier:** `com.chaudoan.mercyblade.signin` (this is a convention — App ID plus `.signin`. Must be different from the App ID.)
5. Click **Continue** → **Register**.

✅ Checkpoint: a new Services ID called `com.chaudoan.mercyblade.signin` appears in the list.

### 1.3 Configure the Services ID with domain + return URL

1. From the identifier list, click the Services ID `com.chaudoan.mercyblade.signin`.
2. Tick **Sign in with Apple**.
3. Click the **Configure** button that appears next to it.
4. In the "Web Authentication Configuration" dialog:
   - **Primary App ID:** select `com.chaudoan.mercyblade` from the dropdown.
   - **Domains and Subdomains:** add `mercyblade.com` (no `https://`, no trailing slash).
   - **Return URLs:** add **exactly** `https://buemdfxyhxunzpgdoqin.supabase.co/auth/v1/callback`
5. Click **Next** → **Done** → **Save**.

✅ Checkpoint: the Services ID now shows your domain and return URL.

### 1.4 Verify domain ownership

Apple will prompt you to verify `mercyblade.com`.

1. In the same Services ID configure panel, click **Download** next to the domain.
2. You get a file named `apple-developer-domain-association.txt`.
3. Upload that file to your web server so it's served at:
   `https://mercyblade.com/.well-known/apple-developer-domain-association.txt`
   - If mercyblade.com is deployed via Vercel / Netlify / Lovable, drop the file into `public/.well-known/` in the repo root and redeploy.
   - Must be served over HTTPS with `Content-Type: text/plain` and no redirect.
4. Back in the Apple portal, click **Verify** next to the domain.
5. If it fails, double-check the URL is accessible in an incognito browser tab and returns the file contents (not a 404 and not the Vercel login page).

✅ Checkpoint: the domain shows "Verified" in the Services ID.

### 1.5 Create a Sign in with Apple private key (.p8)

1. Navigate: https://developer.apple.com/account/resources/authkeys/list
2. Click the **+** button.
3. **Key Name:** `MercyBlade Sign In Key` (any name — only you see it).
4. Tick **Sign in with Apple**.
5. Click **Configure** next to Sign in with Apple.
6. **Primary App ID:** pick `com.chaudoan.mercyblade`. Click **Save**.
7. Click **Continue** → **Register**.
8. On the next page, **click Download** and save the `.p8` file somewhere safe (e.g. `~/Documents/mercyblade/AuthKey_XXXXXXXXXX.p8`).
   - ⚠️ **You can only download this ONCE.** If you lose it you must create a new key.
9. On the same page, **copy the Key ID** (a 10-character alphanumeric like `ABC123DEFG`). Write it down.
10. Click **Done**.

✅ Checkpoint: you have an `.p8` file on disk and a Key ID written down.

### 1.6 Collect the Team ID

1. Open https://developer.apple.com/account (main page).
2. Scroll down to the **Membership details** section.
3. Copy the **Team ID** (10-character alphanumeric, different from the Key ID).

---

### After Section 1 you should have all of this written down:

| What | Example | Yours |
|---|---|---|
| App ID (primary) | `com.chaudoan.mercyblade` | same |
| Services ID | `com.chaudoan.mercyblade.signin` | same |
| Team ID | `ABC1234567` | ____________ |
| Key ID | `DEFG890ABC` | ____________ |
| .p8 file path | `~/Documents/mercyblade/AuthKey_DEFG890ABC.p8` | ____________ |
| Domain verified? | yes | ___ |

---

## 2. Supabase Dashboard

**Root URL:** https://supabase.com/dashboard/project/buemdfxyhxunzpgdoqin

### 2.1 Open the Apple provider settings

Path: **Authentication** (left sidebar) → **Providers** → scroll down → click **Apple**.

### 2.2 Understanding the fields (READ THIS CAREFULLY)

Supabase's Apple provider form has these fields. Supabase's labels are slightly ambiguous — here's what each one really means:

| Supabase label | What to paste | Why |
|---|---|---|
| **Enable Apple provider** | Toggle ON | Required |
| **Client IDs** (comma-separated) | `com.chaudoan.mercyblade,com.chaudoan.mercyblade.signin` | First is the iOS bundle ID (native sign-in path); second is the Services ID (web redirect path). **Both, comma-separated, no spaces.** |
| **Secret Key (for OAuth)** | A JWT generated from your `.p8` + Team ID + Key ID + Services ID | Required for the web redirect path. See 2.3. |
| **Authorized Client IDs** | *(usually appears automatically from Client IDs above)* | Leave as generated |

**Callback URL (read-only, displayed by Supabase):**
`https://buemdfxyhxunzpgdoqin.supabase.co/auth/v1/callback`

This MUST match the Return URL you put in the Apple Services ID (Section 1.3). If it doesn't match exactly, web sign-in fails with `invalid_client`.

### 2.3 Generate the secret JWT

Supabase needs the `.p8` key as a signed JWT, not raw. Options:

**Option A — Supabase UI (easiest, if available):**
Some versions of the Supabase dashboard have a **"Generate a new secret"** button right next to the Secret Key field. If you see it:
1. Click **Generate a new secret**.
2. Paste your `.p8` file contents (open the file in a text editor, paste everything including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines).
3. Fill in Team ID, Key ID, Services ID (`com.chaudoan.mercyblade.signin`).
4. Click **Generate**. Supabase fills the Secret Key field for you.

**Option B — Manual (if Supabase UI doesn't have a generator):**
Use https://token.dev/apple or run a local Node script:

```bash
# One-liner using jsonwebtoken. Run from any Node project with the package installed.
node -e "
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync('/Users/admin/Documents/mercyblade/AuthKey_YOUR_KEY_ID.p8');
const token = jwt.sign({}, privateKey, {
  algorithm: 'ES256',
  expiresIn: '180d',
  audience: 'https://appleid.apple.com',
  issuer: 'YOUR_TEAM_ID',
  subject: 'com.chaudoan.mercyblade.signin',
  keyid: 'YOUR_KEY_ID'
});
console.log(token);
"
```

Paste the generated JWT into Supabase's Secret Key field.

⚠️ **The JWT expires** (max 6 months per Apple's rule). Set a calendar reminder to regenerate.

### 2.4 Save

Click **Save** at the bottom of the Apple provider settings.

✅ Checkpoint: the Apple provider shows "Enabled" in the providers list.

### 2.5 Account linking setting (IMPORTANT)

Path: **Authentication** → **Providers** (same page, scroll to top) → or **Authentication** → **Settings**.

Find the setting **"Allow users to sign in with the same email across providers"** (exact label varies by Supabase version; sometimes called "Email linking" or "Link identities with same email").

- **Recommended: ON.** This makes Supabase merge a new Apple sign-in into an existing Google/email account when the verified email matches. Without this, each provider creates a separate user (= duplicate accounts).
- Caveat: Supabase only merges if BOTH emails are verified. Apple emails are always treated as verified. Google emails are usually verified. Email/password signups only verify after the user clicks the confirmation link.

✅ Checkpoint: setting is ON (or you've decided you want it OFF and understand duplicates will happen).

### 2.6 There is no separate "iOS-specific Apple provider" toggle

Supabase has one Apple provider. The iOS native flow (`signInWithIdToken`) and the web redirect flow (`signInWithOAuth`) both use the same Apple provider, identified by matching one of the Client IDs you comma-separated in 2.2.

---

## 3. Xcode

I (CC3) will commit an `App.entitlements` file in the Phase 2 code drop. You still need to do two things in Xcode so it takes effect.

**Open the workspace** (not the .xcodeproj):
```
open ios/App/App.xcworkspace
```

### 3.1 Add the Sign in with Apple capability

1. In Xcode left sidebar, click the **App** project (blue icon at top).
2. In the center pane, select the **App** target (under TARGETS).
3. Click the **Signing & Capabilities** tab.
4. Click the **+ Capability** button (top-left of that tab).
5. Double-click **Sign in with Apple**. A new row appears with a simple `com.apple.developer.applesignin` entitlement.
6. Xcode will auto-associate it with the `App.entitlements` file I committed. If it asks to create a new one, cancel and point it at `ios/App/App/App.entitlements` — don't let it overwrite my file.

### 3.2 Confirm bundle identifier and team

Still on the **Signing & Capabilities** tab:
- **Bundle Identifier:** must be `com.chaudoan.mercyblade` (matching the App ID from Section 1.1).
- **Team:** must be the Apple Developer team that owns the App ID. If you have multiple teams, pick the one whose Team ID you recorded in Section 1.6.

✅ Checkpoint: Xcode shows no red errors in Signing & Capabilities, the Sign in with Apple row is present, and the bundle ID matches.

### 3.3 Clean build

After adding the capability:
```bash
cd ios/App
pod install
# then build in Xcode: Product → Clean Build Folder, then Product → Build
```

---

## 4. Account linking behavior (what happens in real life)

### Scenario A — Same email across providers, linking ON
1. User signed up earlier with Google using `chau@gmail.com`. Supabase user_id = `aaa-111`.
2. User signs in with Apple. Apple returns `chau@gmail.com` (user chose NOT to use Hide My Email).
3. Supabase finds the existing user with matching verified email and **links the Apple identity to user_id `aaa-111`**. No duplicate. All `user_points`, `profiles`, `user_subscriptions` keep working.

### Scenario B — Apple "Hide My Email" enabled
1. User signs in with Apple. Apple returns `xxxx.yyyyy@privaterelay.appleid.com` (stable per Apple ID + app, but unrelated to their real email).
2. Supabase has no matching user → creates a **new user** with user_id `bbb-222`.
3. If the user had a prior account via Google/email (`chau@gmail.com`, user_id `aaa-111`), that account stays separate. The new Apple user has **zero points, no subscription, empty profile**.
4. Apple will keep returning the same relay email next time they sign in with Apple, so user_id `bbb-222` is stable — they can keep using the new account, they just can't cross-merge automatically.

**Mitigation we are NOT doing in this pass:** writing server logic to prompt the user "we see you have an existing account — want to merge?" That requires a dedicated UI + SQL merge operation. Out of scope for launch.

### Scenario C — Linking is OFF (not recommended)
1. User signs up with Google (`chau@gmail.com`), later signs in with Apple (`chau@gmail.com`).
2. Supabase rejects the Apple sign-in with an error like `User already registered`.
3. User is confused; can't use Apple at all.

### Consequences of duplicate accounts (Scenario B)
If a user ends up with two accounts (one Apple, one Google/email), all of these are **separate** because they're keyed by `user_id`:
- `user_points.total_points`
- `user_subscriptions.tier_id` (the Apple account is free; the Google account may be paid)
- `access_code_redemptions`
- `app_feedback`
- `profiles.*`

**Manual merge** is possible in SQL (update child tables' user_id from `bbb-222` → `aaa-111`, delete auth.users row for `bbb-222`), but that's a one-off admin task, not automated.

### Acceptable-risk summary for v1
- ✅ Most users won't use Hide My Email (it's opt-in on the Apple sheet).
- ✅ Users who stay consistent (always Apple, OR always Google) have no issue.
- ⚠️ Users who mix providers + use Hide My Email get duplicates. Document this for support staff. Monitor via a daily SQL query: `SELECT email, count(*) FROM auth.users GROUP BY email HAVING count(*) > 1;`

---

## 5. Final acceptance gate — tell CC3 `config done` when ALL of these are true

- [ ] App ID `com.chaudoan.mercyblade` has Sign in with Apple enabled (Section 1.1)
- [ ] Services ID `com.chaudoan.mercyblade.signin` exists (Section 1.2)
- [ ] Services ID has domain `mercyblade.com` and return URL `https://buemdfxyhxunzpgdoqin.supabase.co/auth/v1/callback` configured (Section 1.3)
- [ ] Domain `mercyblade.com` is verified (Section 1.4)
- [ ] `.p8` key file is saved safely on disk (Section 1.5)
- [ ] Team ID, Key ID, Services ID written down and ready to paste (Section 1.6)
- [ ] Supabase Apple provider is ON with Client IDs = `com.chaudoan.mercyblade,com.chaudoan.mercyblade.signin` (Section 2.2)
- [ ] Supabase Secret Key (JWT) is saved and not expired (Section 2.3)
- [ ] Supabase account-linking setting is ON (Section 2.5)
- [ ] Decision made on Hide My Email behavior — accepted as documented risk (Section 4)

Once all ten boxes are ticked, reply to CC3 with `config done` and Phase 2 begins.
