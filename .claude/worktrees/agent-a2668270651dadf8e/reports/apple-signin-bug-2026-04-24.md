# Apple Sign In broken — invalid_request

Reported: 24 Apr 2026 ~11:30 PM Mountain Time
Error shown to user:
  invalid_request
  Invalid client id or web redirect url.

## Possible causes (most likely first)

1. Services ID misconfigured in Apple Developer Console
   - Services ID (e.g. com.chaudoan.mercyblade.signin) not registered
   - Domain mercyblade.com not added to the Services ID
   - Return URL https://<supabase-project>.supabase.co/auth/v1/callback missing or wrong

2. Supabase Auth provider misconfigured
   - Wrong Services ID entered
   - Wrong Team ID
   - Wrong Key ID
   - .p8 private key file content not pasted correctly (or expired)

3. Domain mismatch between site and Apple config
   - Web flow tested from a domain not in the Services ID

## Diagnostic steps for tomorrow

Step 1: Identify which environment failed
- Web browser at mercyblade.com? (Services ID + return URL issue)
- iOS app on TestFlight? (uses native Sign In with Apple — different flow, NOT this error)
- Android? (web flow — same as web browser)
- Local dev? (localhost not in Services ID domains)

Step 2: Check Apple Developer Console
- Login: https://developer.apple.com/account
- Certificates, IDs & Profiles → Identifiers → Services IDs
- Find the Services ID used by Sign In with Apple
- Click Configure
- Verify:
  - Primary App ID matches your iOS bundle (com.chaudoan.mercyblade)
  - Domains include: mercyblade.com AND <supabase-project>.supabase.co
  - Return URLs include: https://<supabase-project>.supabase.co/auth/v1/callback

Step 3: Check Supabase Dashboard
- Login: https://app.supabase.com
- Project → Authentication → Providers → Apple
- Verify "Enabled" is ON
- Verify all 4 fields filled:
  - Services ID (matches Apple)
  - Team ID (10-char string from Apple Account → Membership)
  - Key ID (10-char string from Apple Keys page)
  - Private Key (.p8 contents, includes -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY-----)

Step 4: Test
- Try web sign-in from mercyblade.com (incognito)
- If still fails, check browser DevTools Network tab for the actual redirect URL Apple is rejecting
- The URL pattern should be: https://appleid.apple.com/auth/authorize?client_id=...&redirect_uri=...
- Compare client_id and redirect_uri values to what's in Apple console

## If .p8 key file is missing

Apple lets you download .p8 only ONCE at creation time. If you don't have it:
- Create a new key: Apple Developer → Keys → +
- Enable Sign in with Apple capability for the key
- Download immediately (you can't redownload later)
- Update Supabase with new Key ID and key contents

## Estimated time to fix
- If .p8 exists and configs just need fixing: 15-30 minutes
- If .p8 needs to be regenerated: 30-60 minutes
- If first-time Sign In with Apple setup: 1-2 hours

## What's NOT broken
- Email sign-in (works)
- Google sign-in (if configured)
- iOS app native auth (different code path)
- Anything else shipped today

This is a single-feature degradation, not a regression.
