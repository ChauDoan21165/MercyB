# Push Notification Setup (A9)

This document covers the manual provisioning steps that are NOT in the
codebase: APNs certificates, FCM service account, Capacitor plugin
install, and verifying the end-to-end flow on a real device.

## Status: ships dark

Tables, RLS, the edge function, and the preferences page are all
shipped in PR `feat/push-notifications`. Nothing fires until:

1. APNs / FCM credentials are loaded into Supabase secrets.
2. The Capacitor plugin is installed and built into the iOS / Android
   bundle.
3. At least one device successfully registers a token.

The cron schedules listed in the migration are described in comments
only — they are NOT registered. Add them in a follow-up migration when
you're ready to go live.

---

## 1. Install the Capacitor plugin

Run on the dev machine (not in CI):

```sh
npm install @capacitor/push-notifications
npx cap sync ios
npx cap sync android
```

Then update `capacitor.config.ts` to add the plugin's iOS presentation
options:

```ts
const config: CapacitorConfig = {
  appId: "com.chaudoan.mercyblade",
  appName: "Mercy Blade",
  webDir: "dist",
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};
```

> Why this isn't in the PR: installing native plugins and editing
> `capacitor.config.ts` requires a clean working tree on the dev
> machine that owns the iOS project. CI agents don't have the iOS
> project files. Run these locally.

---

## 2. iOS — APNs key

1. Apple Developer → Keys → `+` → **Apple Push Notifications service (APNs)**.
2. Download the `.p8` file once (you cannot re-download it).
3. Note the **Key ID** (10 chars) and your **Team ID** (10 chars,
   visible in Membership).
4. In Xcode → MercyBlade target → Signing & Capabilities →
   `+ Capability` → **Push Notifications**.
5. Build & install on a real device (not simulator — APNs doesn't
   work on simulators).

Load the APNs key into Supabase secrets:

```sh
supabase secrets set \
  --project-ref buemdfxyhxunzpgdoqin \
  APNS_KEY_ID="ABCD123456" \
  APNS_TEAM_ID="0123456789" \
  APNS_PRIVATE_KEY="$(cat AuthKey_ABCD123456.p8)"
```

> Bundle ID for APNs JWT `topic` field is `com.chaudoan.mercyblade`.

---

## 3. Android — FCM service account

1. Firebase Console → Project Settings → Service Accounts → **Generate new private key**.
2. You'll get a `firebase-adminsdk-xxxx.json` — keep it locally.
3. Open Capacitor's Android project (`android/` after `npx cap sync`),
   place `google-services.json` in `android/app/`. Get this file from
   Firebase Console → Project Settings → Your Apps → Android.

Load the service account into Supabase secrets as a single env var:

```sh
supabase secrets set \
  --project-ref buemdfxyhxunzpgdoqin \
  FCM_SERVICE_ACCOUNT_JSON="$(cat firebase-adminsdk-xxxx.json)"
```

The `send-push` edge function reads this string and uses it to mint a
short-lived OAuth2 access token for FCM v1.

---

## 4. Deploy

```sh
supabase db push --linked
supabase functions deploy send-push --project-ref buemdfxyhxunzpgdoqin
```

The migration:
- Adds `push_tokens`, `push_preferences`, `push_send_log` tables.
- Creates `register_push_token(text, push_platform, text)` and
  `mark_push_token_invalid(text, text)` SECURITY DEFINER RPCs.
- Does NOT register any cron jobs (intentional — see top of doc).

---

## 5. Verify on device

After installing the updated app:

1. Sign in as a test user.
2. Visit `/account/push-preferences`.
3. Tap **Đăng ký thiết bị** — accept the system prompt.
4. Run this in the SQL editor to confirm the token row landed:
   ```sql
   SELECT id, platform, status, enrolled_at
   FROM public.push_tokens
   WHERE user_id = '<your-user-id>'
   ORDER BY enrolled_at DESC;
   ```
5. Tap **Gửi thử** — a notification should arrive within a few
   seconds. If not:
   - Check `push_send_log` for the latest row's `status` and
     `error_message` columns.
   - For APNs: 410 Gone usually means the token has been invalidated
     by Apple (user uninstalled the app); the function marks it
     `invalid` automatically.
   - For FCM: `UNREGISTERED` is the equivalent.

---

## 6. Wire the cron schedules (when ready)

The brief lists three time-based triggers. Add them in a follow-up
migration once the dark ship is verified:

```sql
-- daily_practice — every 15 min, edge function decides per-user
PERFORM cron.schedule(
  'send-push-daily-practice',
  '*/15 * * * *',
  $cron$
    SELECT net.http_post(
      url:='https://buemdfxyhxunzpgdoqin.functions.supabase.co/send-push-daily-pass',
      headers:='{"Authorization":"Bearer <service-role>"}'::jsonb
    );
  $cron$
);

-- streak_grace — 23:00 UTC = 06:00 ICT
PERFORM cron.schedule(
  'send-push-streak-grace',
  '0 23 * * *',
  $cron$ SELECT public.queue_streak_grace_pushes(); $cron$
);
```

> Leaderboard rank pushes are best fired inline by the leaderboard
> trigger that already exists, not by cron.

---

## 7. Privacy & ops notes

- **Tokens are sensitive.** Anyone with a token can push to that
  device. Token storage is service-role only; RLS lets owners read
  their own rows but not anyone else's.
- **Quiet hours default 22:00–07:00 user local time.** The decision
  is made in `decideSend()` — any new caller of `send-push` gets
  this for free; do not bypass.
- **`daily_practice` defaults OFF.** Don't change this without product
  approval — opt-in defaults are part of the trust contract.
- **Dark-ship discipline.** Do not register cron schedules until at
  least one real device has registered a token and successfully
  received a `Gửi thử` notification.

---

## 8. Files of interest

| Path | Purpose |
| --- | --- |
| `supabase/migrations/20260518000000_push_notifications.sql` | Tables, RLS, RPCs |
| `supabase/functions/_shared/pushNotifications.ts` | Localized copy + quiet-hours logic |
| `supabase/functions/send-push/index.ts` | HTTP edge function |
| `src/lib/push/types.ts` | TypeScript-side type twin |
| `src/lib/push/pushTokenRegistration.ts` | Capacitor lazy-loader + RPC call |
| `src/pages/account/PushPreferences.tsx` | User-facing preferences UI |
