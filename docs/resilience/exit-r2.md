# Cloudflare R2 — Exit Plan (48 h)

> **Why this doc exists:** Cloudflare R2 is the designated replacement for
> Supabase Storage in the event of a Supabase exit (see `exit-supabase.md`
> §Neon-path step 7). If MercyBlade migrates audio storage to R2 and then
> needs to vacate R2 — account lockout, pricing change, or a Cloudflare-wide
> incident — this doc is the playbook for moving out within 48 hours.
>
> **Scope:** R2 object storage exit only. CF Pages hosting exit is a separate
> concern (see `exit-cf-pages.md`). DNS is Cloudflare too (see
> `disaster-recovery.md §2.5`).
>
> **Pre-condition:** this doc assumes R2 is being used as the `room-audio`
> CDN origin (replacing Supabase Storage). If the current host is still
> Supabase Storage, exit-r2 is not yet needed — bookmark it for when the
> migration happens.

---

## What R2 holds that must be migrated

| Asset | Volume estimate | Migration target |
|---|---|---|
| `room-audio` bucket (adult-room, kids/*, music/*) | ~200–500 MB (476 rooms × avg ~500 KB/room) | New Supabase Storage, AWS S3, or Backblaze B2 |
| Other buckets (if created: `listening-clips`, profile images, etc.) | < 100 MB at current scale | Same destination |

R2 is object storage only — no user data, no auth records, no schema.
The exit is: download all objects, re-upload to the new host, update the
CDN origin URL in the app config and edge functions, redeploy.

---

## Pre-staged: download all R2 objects (run NOW)

### Via `rclone` (recommended — parallel, resumable)

```bash
# Install once: brew install rclone
# Configure once: rclone config add r2-mercyblade (S3-compatible endpoint)
#   Provider: Cloudflare R2
#   Access key ID:  $(security find-generic-password -s mb-r2-access-key-id -w)
#   Secret access key: $(security find-generic-password -s mb-r2-secret-key -w)
#   Endpoint: https://<ACCOUNT_ID>.r2.cloudflarestorage.com

# Download room-audio bucket
mkdir -p "$HOME/Backups/r2-room-audio"
rclone sync r2-mercyblade:room-audio "$HOME/Backups/r2-room-audio" \
  --progress --transfers 8
```

Verify count after sync:
```bash
find "$HOME/Backups/r2-room-audio" -type f | wc -l
# Expected: hundreds of .mp3 files
```

### Via `wrangler` (Cloudflare CLI — no rclone config required)

```bash
# Install once: npm install -g wrangler
# Authenticate once: wrangler login

# List bucket contents
wrangler r2 object list room-audio

# Download individual files (no bulk download in wrangler — use rclone for bulk)
wrangler r2 object get room-audio/<key> --file "$HOME/Backups/r2-room-audio/<key>"
```

> **Note:** `wrangler r2 object get` is single-file only. For a bucket with
> hundreds of audio files, `rclone sync` is the right tool. Configure rclone
> once and add the sync to the monthly Storage backup rotation.

---

## Exit sequence

### Step 1 — Choose destination and provision it

| Destination | When to choose | Setup |
|---|---|---|
| **New Supabase Storage** | Returning to Supabase (new account or original recovered) | Create bucket `room-audio` as PUBLIC in Supabase dashboard |
| **AWS S3** | Diversifying away from Cloudflare entirely | Create bucket in S3 console; set bucket policy to public-read |
| **Backblaze B2** | Cost-optimized alternative (free egress to Cloudflare CDN via B2–CF partnership) | Create bucket in B2 console; note `s3.REGION.backblazeb2.com` S3 endpoint |

For fastest 48-hour exit, **new Supabase Storage** is the lowest-friction
target because `src/lib/roomAudioResolver.ts` already uses the Supabase
Storage client.

### Step 2 — Upload objects to destination

#### → New Supabase Storage

```bash
# supabase CLI must be authenticated: supabase login
# Bucket must exist and be PUBLIC before upload

supabase storage cp \
  "$HOME/Backups/r2-room-audio" \
  ss://room-audio \
  --project-ref "${NEW_PROJECT_REF}" \
  --recursive
```

#### → AWS S3

```bash
# aws CLI must be configured: aws configure
aws s3 sync "$HOME/Backups/r2-room-audio" s3://mercyblade-room-audio/ \
  --acl public-read \
  --region ap-southeast-1   # nearest region to Vietnam
```

#### → Backblaze B2 (via rclone)

```bash
# Configure rclone with B2 credentials (S3-compatible mode)
rclone sync "$HOME/Backups/r2-room-audio" b2-mercyblade:room-audio \
  --progress --transfers 8
```

Verify upload count on destination before cutting over:
```bash
# For Supabase Storage
supabase storage ls ss://room-audio --project-ref "${NEW_PROJECT_REF}" | wc -l

# For S3
aws s3 ls s3://mercyblade-room-audio/ --recursive | wc -l
```

### Step 3 — Update the CDN origin in the app

The app fetches audio via `src/lib/roomAudioResolver.ts`. The
`resolveRoomAudioUrl` function calls
`supabase.storage.from('room-audio').getPublicUrl(filename)`.

If the destination is a new Supabase project: updating `VITE_SUPABASE_URL`
(see `exit-supabase.md §Step 6`) automatically redirects all audio fetches.

If the destination is NOT Supabase (S3 or B2): update `roomAudioResolver.ts`
to return the new public URL base:

```typescript
// In src/lib/roomAudioResolver.ts, replace getPublicUrl() with:
// const CDN_BASE = 'https://mercyblade-room-audio.s3.ap-southeast-1.amazonaws.com'
//   (or your B2/custom CDN URL)
// return { url: `${CDN_BASE}/${filename}`, fallback: false }
```

The `CLAUDE.md` audio pipeline invariant is: **all** `kids/*`, `music/*`,
and room-audio keys must resolve to a public URL; the local fallback is
only for `http(s)://` or `images/` prefixed keys. Whichever destination
you pick, the public URL must be accessible without signing.

### Step 4 — Update Workbox cache pattern

`vite.config.ts` has a Workbox `urlPattern` that matches `room-audio`
storage URLs for offline caching. If the URL domain changes (e.g., from
`*.supabase.co` to `*.r2.cloudflarestorage.com` or `s3.amazonaws.com`),
update the pattern:

```typescript
// In vite.config.ts, find the Workbox runtimeCaching block for room-audio
// and update the urlPattern regex to match the new CDN domain.
// CLAUDE.md note: "Workbox cache pattern now matches (sign|public) for room-audio"
// — don't narrow the pattern back to /sign/ only; keep both variants if
// the destination uses signed URLs.
```

Rebuild and redeploy after this change.

### Step 5 — Secrets rotation (if R2 account is compromised)

| Secret | Location | Action |
|---|---|---|
| R2 Access Key ID | macOS Keychain `mb-r2-access-key-id` | Revoke in CF dashboard → R2 → Manage API tokens; generate new |
| R2 Secret Access Key | macOS Keychain `mb-r2-secret-key` | Same |
| `CLOUDFLARE_ACCOUNT_ID` | GitLab CI var | Confirm no R2-specific token is exposed; update if needed |
| `CLOUDFLARE_API_TOKEN` (R2 scope) | macOS Keychain `mb-cloudflare-api-token` | If scoped to R2, revoke that specific token scope; regenerate |

Cloudflare tokens can be scoped per-product. Revoking the R2 token does NOT
affect DNS, CF Pages, or other CF products if separate tokens are in use.

### Step 6 — Remove the R2 bucket (after cutover confirmed)

```bash
# wrangler must be authenticated
# Confirm ALL objects are uploaded to destination BEFORE deleting the source
wrangler r2 bucket delete room-audio   # prompts for confirmation
```

Do NOT delete before Step 2 upload is verified. Deleted R2 objects are
unrecoverable without a local backup.

### Step 7 — Smoke-test audio playback

```bash
# Open the app in a private/incognito browser (clears SW cache)
# Navigate to any room that has audio
# Check browser DevTools → Network for the audio request URL
# Confirm it hits the new CDN domain, not *.r2.cloudflarestorage.com
```

Also run:
```bash
GOLDEN_FLOW_ALLOW_MISSING_SECRETS=1 npm run verify:golden-flows
# Flow 2 (TTS) exercises the mercy-tts edge function, not room audio directly.
# Manual playback test is the definitive check for room audio.
```

---

## CDN stale-content trap

R2 is often fronted by a Cloudflare CDN cache layer. After uploading files
to R2, the old CDN-cached bytes may serve for minutes to hours.

Always cache-bust when verifying a new upload:
```bash
curl -H "Cache-Control: no-cache" "https://<YOUR_R2_PUBLIC_URL>/FILENAME.mp3"
# Replace <YOUR_R2_PUBLIC_URL> with your R2 public bucket URL
```

This is the same trap documented for the Supabase CDN in `CLAUDE.md`
("Supabase audio CDN stale" memory) — it applies equally to R2.

---

## Maintenance

- **Monthly:** run `rclone sync` to keep `$HOME/Backups/r2-room-audio` current.
- **Quarterly:** spot-check that 3–5 audio files from the backup are playable
  (not zero-byte or corrupted).
- **After any audio upload to R2:** cache-bust the verification probe
  (see "CDN stale-content trap" above).
- **If the R2 bucket becomes the permanent primary** (i.e., Supabase Storage
  is fully vacated): update `disaster-recovery.md §1` to list R2 as the
  Storage layer and mark Supabase Storage as "removed."

---

**Last verified:** 2026-06-11.
**Cross-ref:** `disaster-recovery.md` §2.3, §2.5; `exit-supabase.md`; `exit-cf-pages.md`; `CLAUDE.md` (audio pipeline invariants, Workbox cache pattern note).
