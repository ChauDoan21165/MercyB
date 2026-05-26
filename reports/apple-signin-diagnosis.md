# Sign in with Apple — Web Diagnosis (mercyblade.com)

**Status:** broken on web. Working hypothesis from Chau is correct.
**Error from Apple:** `invalid_request — Invalid client id or web redirect url`
**Authorize URL Apple sees:** `appleid.apple.com/auth/authorize?client_id=com.chaudoan.mercyblade&redirect=…`

This is **not** a code bug. It is an **Apple Developer + Supabase Auth provider configuration** issue. Code is correct.

---

## 1. Where is `client_id` configured?

**Not in this repo.** The web flow's `client_id` is populated by Supabase Auth itself. The code path:

- `src/pages/LoginPage.tsx:366–395` — web branch calls
  ```ts
  supabase.auth.signInWithOAuth({
    provider: "apple",
    options: { redirectTo: redirectToOAuthReturn },
  });
  ```
  No `client_id` is sent from the client. Supabase assembles the Apple `authorize` URL server-side using its provider config.
- `src/lib/nativeOAuth.ts:55–76` — native iOS/Android path. Same `signInWithOAuth`, redirect goes to `com.mercyapps.mercyblade://auth/callback`. Capacitor only.
- `src/components/auth/AppleSignInButton.tsx` — pure UI button. Click delegates to the LoginPage handler. Nothing here.

**Conclusion:** the failing `client_id=com.chaudoan.mercyblade` is being inserted by Supabase from its **Apple provider settings** in the dashboard.

The team's own setup playbook already calls this out: `docs/APPLE_SIGNIN_CONFIG.md` Section 2.2.

---

## 2. What `client_id` Apple SHOULD see vs what it IS seeing

| | Value | Source |
|---|---|---|
| **iOS bundle (App ID)** | `com.chaudoan.mercyblade` | Apple Developer App ID — used by the **native** SIWA flow only |
| **Web Services ID** (what Apple expects for web) | `com.chaudoan.mercyblade.signin` | Apple Developer Services ID — used by the **web** SIWA flow |
| **Currently sent** (per the failing URL) | `com.chaudoan.mercyblade` | Supabase Apple provider Client IDs field — only the App ID is configured (or it's first in the list and Supabase's selection logic is picking it for the web redirect) |

Apple's Sign in with Apple has two distinct identifier types:
- **App IDs** — only valid as `client_id` when the request comes from a native iOS/macOS client and is signed by an Apple-issued identity token.
- **Services IDs** — the only identifier Apple accepts as `client_id` in the **web `/auth/authorize` endpoint**.

Right now Supabase is sending the App ID to the web endpoint. Apple correctly rejects it with `invalid_request — Invalid client id or web redirect url`.

The team's playbook (`docs/APPLE_SIGNIN_CONFIG.md` line 139) specifies the correct Supabase value:

> **Client IDs (comma-separated)** = `com.chaudoan.mercyblade,com.chaudoan.mercyblade.signin`
>
> First is the iOS bundle ID (native sign-in path); second is the Services ID (web redirect path). **Both, comma-separated, no spaces.**

---

## 3. Code change vs Supabase config vs Apple Developer setup?

**Code change:** **None required.** The web path in `LoginPage.tsx` is doing the right thing — letting Supabase pick the client_id based on its provider config.

**The fix is split across two control planes:**

### A. Apple Developer (developer.apple.com) — needs verification

Per `docs/APPLE_SIGNIN_CONFIG.md` Sections 1.1–1.6, the following must exist:

| Item | Required value | Likely status |
|---|---|---|
| App ID with SIWA enabled | `com.chaudoan.mercyblade` | ✅ probably exists (iOS app already builds) |
| **Services ID** | `com.chaudoan.mercyblade.signin` | ❓ **likely missing — this is the prime suspect** |
| Services ID web config — Domains | `mercyblade.com` | ❓ depends on Services ID existing |
| Services ID web config — Return URL | `https://buemdfxyhxunzpgdoqin.supabase.co/auth/v1/callback` | ❓ depends on Services ID existing |
| Domain verification file at `https://mercyblade.com/.well-known/apple-developer-domain-association.txt` | published | ❓ **`public/.well-known/` does not exist in this repo** — file was never committed, suggesting domain was never verified |
| `.p8` private key + Key ID + Team ID | recorded | ❓ unknown — Chau must check |

The missing `public/.well-known/` directory is a strong signal that **Section 1.4 (domain verification) was never completed**, which would also imply **Section 1.2 (Services ID) was never created** — without a Services ID there's nothing to verify the domain *for*.

### B. Supabase Dashboard — needs verification

Path: `https://supabase.com/dashboard/project/buemdfxyhxunzpgdoqin → Authentication → Providers → Apple`

Required state per playbook Section 2.2:

| Field | Required value |
|---|---|
| Enable Apple provider | ON |
| **Client IDs** | `com.chaudoan.mercyblade,com.chaudoan.mercyblade.signin` |
| **Secret Key** | A signed JWT (ES256) generated from `.p8` + Team ID + Key ID + Services ID — expires every 6 months |

What Chau is most likely seeing today: only `com.chaudoan.mercyblade` in the Client IDs field, and either no secret or a secret tied to a non-existent Services ID.

### C. No code change

Confirmed. Don't touch:
- `src/pages/LoginPage.tsx` — already calls `signInWithOAuth({ provider: "apple" })` correctly
- `src/lib/nativeOAuth.ts` — native path is fine and unrelated
- `src/components/auth/AppleSignInButton.tsx` — pure presentation

---

## 4. Estimated time to fix

The branching factor is whether the `.p8` key, Services ID, and Team ID already exist in some drawer.

### Best case — Services ID and `.p8` key already exist, just never wired up
**~20–30 minutes**, all dashboard work, no code:
1. Generate the secret JWT (`docs/APPLE_SIGNIN_CONFIG.md` Section 2.3 — pick Option A if Supabase UI offers the generator, else Option B with the Node one-liner). 5 min.
2. Open Supabase → Authentication → Providers → Apple. Set **Client IDs** to `com.chaudoan.mercyblade,com.chaudoan.mercyblade.signin`. Paste the secret JWT into **Secret Key**. Save. 5 min.
3. Hard-refresh `mercyblade.com/signin` and re-test "Continue with Apple". 5 min.
4. Buffer for one round of "JWT had a typo, regenerate" or "Apple takes a minute to propagate". ~10 min.

### Worst case — nothing is set up
**~2–4 hours**, mostly waiting on Apple + DNS propagation:
1. Section 1.1 — enable SIWA capability on the App ID. 5 min.
2. Section 1.2 — create the Services ID `com.chaudoan.mercyblade.signin`. 5 min.
3. Section 1.3 — configure web auth: Primary App ID, domain `mercyblade.com`, return URL `https://buemdfxyhxunzpgdoqin.supabase.co/auth/v1/callback`. 5 min.
4. Section 1.4 — **domain verification.** Download `apple-developer-domain-association.txt`, drop into `public/.well-known/`, redeploy mercyblade.com (Vercel), wait for redeploy + Apple verification. 30–60 min including the inevitable "did the file deploy with the right Content-Type" debugging.
5. Section 1.5 — create `.p8` key, save, record Key ID. 5 min (one-time download — irrecoverable if lost).
6. Section 1.6 — record Team ID. 1 min.
7. Section 2.3 — generate the JWT. 5 min.
8. Section 2.2 — paste into Supabase. 5 min.
9. Re-test. 10 min.
10. Buffer for domain-verification retries (the most common stumbling block). 30–60 min.

---

## 5. What the diagnosis does NOT tell you

- Whether the `.p8` already exists somewhere on Chau's machine. If so, the Section-1 work is mostly done and we're closer to the best-case 20-minute fix.
- Whether the Apple Developer team currently shows the Services ID. **Chau should open https://developer.apple.com/account/resources/identifiers/list and check** — that's the single piece of information that decides best-case vs worst-case.
- Whether Supabase's existing Apple provider has a stale secret JWT (would also break web sign-in, but with a different error: `invalid_client` rather than `invalid_request`).

---

## 6. One-line summary for the team chat

> Web Sign-in-with-Apple is sending the iOS App ID `com.chaudoan.mercyblade` to Apple's `/auth/authorize` endpoint. Apple only accepts a **Services ID** (e.g. `com.chaudoan.mercyblade.signin`) at that endpoint. Fix is in Apple Developer + Supabase dashboard per `docs/APPLE_SIGNIN_CONFIG.md` — no code change needed. ETA 30 min if the Services ID + `.p8` already exist, 2–4 hours if starting from scratch (domain verification is the bottleneck).
