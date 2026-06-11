# Supabase — Exit Plan (48 h)

> **Why this doc exists:** Supabase is the single largest blast-radius
> dependency — Postgres, GoTrue Auth, Edge Functions, and the `room-audio`
> Storage bucket all live there. The May 2026 account-lockout incident
> (documented in `disaster-recovery.md` §2.3) confirmed that exit readiness
> must be pre-staged, not improvised under stress.
>
> **Scope:** full Supabase project exit — DB, Auth, Storage, Edge Functions.
> This is the worst-case 48-hour playbook. For account-lockout-only recovery
> (project still running), use `disaster-recovery.md §2.3` instead.

---

## What Supabase holds that must be migrated

| Layer | What it holds | Migration target |
|---|---|---|
| **Postgres DB** | All user data: `profiles`, `user_subscriptions`, `placement_sessions`, lessons, etc. | Neon, Render Postgres, or self-hosted Postgres |
| **GoTrue Auth** | User accounts, OAuth providers, email templates | Supabase OSS GoTrue on alt host OR Neon-compatible auth |
| **Edge Functions** (110 files) | `mercy-tts`, `guide-assistant`, `stripe-webhook`, email fns, etc. | `supabase/functions/` in repo — redeploy to new project |
| **Storage: `room-audio` bucket** | All audio files (adult-room, kids/*, music/*) — PUBLIC bucket | Cloudflare R2 or new Supabase Storage |
| **Storage: other buckets** | `listening-clips`, profile images, etc. | Same — R2 or new Supabase Storage |

**Source-of-truth status:**
- Schema: `supabase/migrations/` (239 SQL files in repo) ✓
- Functions: `supabase/functions/` (110 fns in repo) ✓
- Data: only in Supabase DB (no live external backup yet — see §5.3 in disaster-recovery.md) ⚠️
- Storage bucket contents: only in Supabase Storage ⚠️

The ⚠️ rows are the data-loss risk. Mitigate NOW by running the backup commands in §5 of this doc before they're needed.

---

## Exit target options

| Target | DB | Auth | Functions | Storage |
|---|---|---|---|---|
| **Neon + GoTrue OSS** | Neon managed Postgres (serverless-compatible branching) | Self-hosted GoTrue Docker | `supabase functions deploy` against OSS edge-runtime | R2 or S3 |
| **Render Postgres** | Render managed Postgres | Same GoTrue OSS | Same | R2 or S3 |
| **New Supabase project** | Fastest path — same tooling | Native Supabase Auth | Native deploy | Native Storage |

**Fastest 48 h exit: new Supabase project.** Schema + functions are in repo;
restore data from dump; re-upload audio files. Only works if a new Supabase
account is accessible (i.e., the issue is with the CURRENT account, not
Supabase-the-service).

---

## Pre-staged backup (run NOW, before incident)

### DB dump

```bash
# Retrieve service-role key from Keychain (never hardcode)
PG_PWD="$(security find-generic-password -s mb-supabase-service-role -w)"

mkdir -p "$HOME/Backups"
PGPASSWORD="${PG_PWD}" pg_dump \
  "postgresql://postgres@db.buemdfxyhxunzpgdoqin.supabase.co:5432/postgres" \
  --no-owner --no-acl --format=c \
  --file="$HOME/Backups/mercyb-$(date -u +%Y%m%dT%H%M%SZ).dump"

# Retention: keep last 30
find "$HOME/Backups" -name 'mercyb-*.dump' -mtime +30 -delete
```

Verify the dump is non-empty:
```bash
ls -lh "$HOME/Backups"/mercyb-*.dump | tail -1
# Should be > 5 MB for a healthy production DB
```

### Storage bucket contents

Supabase Storage does not have a one-click bulk export. Use the Supabase CLI
or `rclone` with an S3-compatible endpoint:

```bash
# supabase-cli must be installed: brew install supabase/tap/supabase
# (or: npm install -g supabase)
supabase login   # uses Supabase dashboard OAuth

# List all buckets
supabase storage ls --project-ref buemdfxyhxunzpgdoqin

# Download room-audio bucket (public, largest — ~GB range)
mkdir -p "$HOME/Backups/supabase-storage/room-audio"
supabase storage cp \
  ss://room-audio \
  "$HOME/Backups/supabase-storage/room-audio" \
  --project-ref buemdfxyhxunzpgdoqin \
  --recursive

# Repeat for other buckets (listening-clips, etc.)
```

> **Note on Storage backup time:** the `room-audio` bucket holds hundreds of
> audio files. First download may take 30–60 min on a good connection. Start
> this BEFORE the incident window closes.

---

## Exit sequence (new Supabase project — fastest path)

### Step 1 — Create a new Supabase project

1. Create a NEW Supabase account at `supabase.com` using an email
   **independent of any identity chain tied to the current account** (see
   `disaster-recovery.md §3.3`).
2. Create a project. Note the new:
   - `NEW_PROJECT_REF` (the project reference, e.g. `abcdefghijklmnop`)
   - `NEW_SUPABASE_URL` = `https://<NEW_PROJECT_REF>.supabase.co`
   - `NEW_ANON_KEY` and `NEW_SERVICE_ROLE_KEY` (from Project Settings → API)

### Step 2 — Apply schema migrations

```bash
# Link the CLI to the new project
supabase link --project-ref "${NEW_PROJECT_REF}"

# Apply migrations in order (timestamp-sorted, which ls -v gives)
# NOTE: some migrations have CLI-drift (applied via SQL Editor historically).
# Apply in this order; manually verify any that fail with "already exists".
for f in $(ls supabase/migrations/*.sql | sort); do
  echo "Applying: $f"
  psql "${NEW_DATABASE_URL}" -f "$f" 2>&1 | tail -5
done
```

### Step 3 — Restore data

```bash
pg_restore --no-owner --no-acl \
  --dbname="${NEW_DATABASE_URL}" \
  "$HOME/Backups/mercyb-LATEST.dump"
```

Spot-check after restore:
```bash
psql "${NEW_DATABASE_URL}" \
  -c "SELECT COUNT(*) FROM profiles; SELECT COUNT(*) FROM user_subscriptions;"
```

### Step 4 — Redeploy Edge Functions

```bash
# All 110 functions are in supabase/functions/ — deploy in one pass
supabase functions deploy --project-ref "${NEW_PROJECT_REF}" --no-verify-jwt

# Functions with verify_jwt = false (stripe-webhook, etc.) need explicit flag:
# supabase functions deploy stripe-webhook --project-ref "${NEW_PROJECT_REF}" --no-verify-jwt
# Check supabase/config.toml [functions.*] blocks for the list.
```

### Step 5 — Re-upload Storage bucket contents

```bash
# Upload room-audio (public bucket — must be created first in Supabase dashboard)
supabase storage cp \
  "$HOME/Backups/supabase-storage/room-audio" \
  ss://room-audio \
  --project-ref "${NEW_PROJECT_REF}" \
  --recursive

# Set bucket as PUBLIC in the Supabase dashboard:
# Storage → room-audio → Edit bucket → toggle "Public bucket" → Save
```

### Step 6 — Secrets rotation

Update the following wherever they're stored (GitLab CI, Netlify env, `.env.local`):

| Secret | Old value source | New value source |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://buemdfxyhxunzpgdoqin.supabase.co` | `https://<NEW_PROJECT_REF>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Old project API settings | New project API settings |
| `SUPABASE_SERVICE_ROLE_KEY` | macOS Keychain `mb-supabase-service-role` | New project API settings → update Keychain: `security add-generic-password -s mb-supabase-service-role -a mercyblade -w "<NEW_KEY>" -U` |
| `SUPABASE_PROJECT_REF` (GitLab CI) | `buemdfxyhxunzpgdoqin` | `<NEW_PROJECT_REF>` |
| `SUPABASE_ACCESS_TOKEN` (GitLab CI) | Old Supabase personal access token | New account personal access token (Supabase dashboard → Account → Access tokens) |

### Step 7 — DNS / deploy switch

The bundle-baked `VITE_SUPABASE_URL` is the critical change. It requires a
new build and redeploy:

```bash
# Export updated env vars into the shell, then rebuild
export VITE_SUPABASE_URL="https://${NEW_PROJECT_REF}.supabase.co"
export VITE_SUPABASE_ANON_KEY="${NEW_ANON_KEY}"
npm run build
# Deploy to Netlify or Vercel as usual (see disaster-recovery.md §5.5 / §5.6)
```

No DNS record changes needed — Supabase is accessed via env vars baked into
the JS bundle, not via a custom DNS entry. Only the Netlify/Vercel env vars
and the Keychain entry need updating.

### Step 8 — Smoke-test

```bash
# Full golden-flow suite including auth flows
npm run verify:golden-flows
# All 5 flows must be green; Flow 1 (AUTH CONFIG) confirms the bundle
# is pointing at the new project ref.
```

---

## Exit sequence (Neon + GoTrue — independent path)

Use this when a new Supabase account is not an option (Supabase-the-service
is the problem, not just the current account).

1. **Provision Neon:** `neon.tech` → create project → get connection string.
2. **Apply schema:** same `psql` migration loop as Step 2 above.
3. **Restore data:** same `pg_restore` as Step 3.
4. **Stand up GoTrue Auth:**
   ```bash
   # Supabase OSS GoTrue runs in Docker
   # Minimal env vars: DATABASE_URL, GOTRUE_JWT_SECRET, GOTRUE_SITE_URL
   docker run -e DATABASE_URL="${NEON_URL}" \
              -e GOTRUE_JWT_SECRET="$(openssl rand -hex 32)" \
              -e GOTRUE_SITE_URL="https://mercyblade.com" \
              -p 9999:8080 \
              supabase/gotrue
   ```
5. **Update `src/lib/supabaseClient.ts`:** the `createClient(url, anonKey)`
   call must point at the new GoTrue host. The only file to change.
6. **Edge Functions:** deploy against the Supabase OSS edge-runtime
   (`deno` required). All 110 functions in `supabase/functions/` are
   standard Deno; no Supabase-proprietary APIs needed.
7. **Storage:** use Cloudflare R2 (see `exit-r2.md`) as the audio CDN
   replacement; update signed-URL base in `src/lib/roomAudioResolver.ts`.

---

## Auth email templates (dashboard-only — cannot be exported)

The Supabase Auth email templates are dashboard-only (not in repo).
Per `project_supabase_auth_email_templates` memory:
- Must keep `{{ .Token }}` (OTP code entry, not a magic link)
- Vietnamese drafts are at `/private/tmp/supabase-auth-vi-email-templates.md`

After standing up the new project, re-apply the templates from that file
via the Supabase dashboard → Authentication → Email Templates.

---

## Maintenance

- **Run the DB dump weekly** (script in `disaster-recovery.md §5.3`).
- **Run the Storage backup monthly** (bucket contents change slowly).
- **Quarterly:** restore the DB dump to a throwaway Neon instance to
  confirm the backup is valid. A dump that won't restore is not a backup.
- **After any schema migration:** bump this doc's "last verified" date.

---

**Last verified:** 2026-06-11.
**Cross-ref:** `disaster-recovery.md` §2.3, §5.3, §5.4; `exit-r2.md`; `repo-mirror.md`.
