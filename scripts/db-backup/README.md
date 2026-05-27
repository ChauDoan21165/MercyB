# External nightly Postgres backups

Encrypted, off-Supabase dumps of the production database. Designed so
that even if the Supabase account is locked out, deleted, or otherwise
inaccessible, the founder still holds a key-recoverable dataset.

## Why this exists

Supabase runs its own backups, but those backups live inside Supabase
and are gated by Supabase auth. The May 2026 account-lockout incident
made this risk concrete: when your only copy is behind a vendor login
you can't access, you have no copy. This pipeline produces an
**externally-stored, GPG-encrypted** dump that can be decrypted offline
with a key that only the founder holds.

The current threat model is "the Supabase account becomes unreachable
for hours or days." Hostile-decryption attacks on the dump itself are
out of scope — the cipher and the key length we use are far above
what's needed for that.

## Components

| File | Role |
|---|---|
| `nightly-dump.sh` | The dump script. Runs `pg_dump --format=custom --compress=9`, pipes through `gpg --encrypt`, writes a single `.dump.gpg` file. |
| `restore.sh` | Companion decrypt + `pg_restore`. **Destructive.** Has a 10-second guard countdown and a `--dry-run` mode. |
| `.gitlab-ci.yml` job `nightly-db-backup` | Scheduled execution at 04:00 UTC daily, uploads to object store via `rclone`. |
| `tests/scripts/db-backup-script-shape.test.ts` | Vitest shape test — catches credential-leak regressions in the bash scripts at compile time. |

## One-time setup (Chau, before first run)

### 1. Generate a GPG keypair

Do this on your personal laptop, not on a server you can lose. **Keep
the private key in 1Password (or your password manager of choice) and
also burn it to a physical backup (USB stick + safe).** Without the
private key, the dumps are unrecoverable.

```bash
# 4096-bit RSA, no expiry. Use a strong passphrase you actually remember.
gpg --full-generate-key
# Choose: (1) RSA and RSA, 4096 bits, key does not expire,
#         Real name: "MercyBlade DB Backup",
#         Email:     admin@mercyblade.com,
#         Passphrase: (your strong passphrase)

# Note the key id / fingerprint:
gpg --list-keys --keyid-format=long admin@mercyblade.com

# Export the public key (this one CAN go in CI):
gpg --armor --export admin@mercyblade.com > mercyb-backup-pub.asc

# Export the private key (this one MUST go in 1Password ONLY):
gpg --armor --export-secret-keys admin@mercyblade.com > mercyb-backup-priv.asc
# Save mercyb-backup-priv.asc to 1Password as a secure note attachment,
# then `rm mercyb-backup-priv.asc` from disk. Confirm 1Password has it
# before deleting.
```

### 2. Set up CI/CD variables in GitLab

Under **Settings → CI/CD → Variables**, add (all protected; mask where
the variable contents permit):

| Variable | Type | Contents |
|---|---|---|
| `SUPABASE_DB_URL` | masked, protected | `postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres` |
| `GPG_RECIPIENT_KEY` | file (NOT masked — armored public-key blob breaks masking) | The contents of `mercyb-backup-pub.asc` from step 1 |
| `RCLONE_CONFIG` | file | Your rclone config (see step 3) |
| `RCLONE_REMOTE` | not masked, protected | The rclone remote name + path, e.g. `b2:mercyb-backups/prod` |

**Why `GPG_RECIPIENT_KEY` is a "file" variable, not a regular one:** the
public-key blob is multi-line and contains characters GitLab's masking
rejects. File-type variables are written to disk as a path that the job
can read, which is exactly what `nightly-dump.sh` expects when
`GPG_RECIPIENT_KEY_ID` points at a readable file path.

In the CI job, the env var `GPG_RECIPIENT_KEY_ID` is set to
`$GPG_RECIPIENT_KEY` (the file path GitLab writes the contents to), and
`nightly-dump.sh` detects it's a file path and imports the public key
on the fly.

### 3. Set up the off-Supabase object store

The choice of provider is yours; the only hard requirement is that it
is **NOT** Supabase. Recommended:

- **[Backblaze B2](https://www.backblaze.com/b2)** — $5/TB/month
  archive-class storage, free egress to Cloudflare. Cheapest in this
  class.
- Cloudflare R2 — slightly more expensive, but zero egress fees and
  integrates with the rest of the Cloudflare stack you already use for
  DNS.
- AWS S3 with Glacier Deep Archive — cheapest cold storage on the market
  but more friction to retrieve. Fine if you treat the backup as
  break-glass-only.

All three speak the S3 protocol and are `rclone`-compatible. Set up
once, configure `rclone`, then export your `rclone.conf`:

```bash
rclone config        # interactive setup; create a remote called "b2" (or your choice)
rclone lsf b2:       # verify it can reach the bucket
cat ~/.config/rclone/rclone.conf    # paste this into the GitLab variable RCLONE_CONFIG
```

### 4. First manual run

Trigger the `nightly-db-backup-now` manual job in GitLab CI **once**
before relying on the schedule. It uses identical code paths to the
scheduled job, so a successful manual run means the schedule will work
too.

## Retention policy

Recommended via `rclone` lifecycle rules (or set in the object-store
console — they're equivalent):

- **7 daily** — keep the last 7 days verbatim.
- **4 weekly** — Sundays only, kept for 28 days.
- **12 monthly** — first of the month only, kept for 1 year.

For Backblaze B2, this is a lifecycle rule on the bucket:

```
keepLastVersions: 7         # daily
keepLastWeekly:   4         # weekly
keepLastMonthly: 12         # monthly
```

For S3, set lifecycle transitions to Glacier Deep Archive after 30 days,
delete after 1 year.

## Manual run (laptop)

You may want to take a one-off dump before a risky migration. With
`SUPABASE_DB_URL` and a keyring containing the public key both set:

```bash
export SUPABASE_DB_URL="postgresql://postgres:...@db.<ref>.supabase.co:5432/postgres"
export GPG_RECIPIENT_KEY_ID="admin@mercyblade.com"   # or the fingerprint
export BACKUP_OUTPUT_DIR="$HOME/Desktop/mercyb-backups"

./scripts/db-backup/nightly-dump.sh
# OK /Users/you/Desktop/mercyb-backups/mercyb-2026-05-27T04-00-00Z-prod.dump.gpg 184320104
```

The single `OK <path> <bytes>` line is the success contract — anything
else means failure.

## Restore procedure

**Always restore to a non-production database first.** Never restore
straight back over the live Supabase project unless you have already
exhausted every other option — a successful restore to a staging or
local Postgres is the test that the dump is actually usable.

```bash
# 1. Pull the backup down.
rclone copy b2:mercyb-backups/prod/mercyb-2026-05-27T04-00-00Z-prod.dump.gpg ./

# 2. Make sure your GPG private key is in your keyring.
#    (Import once from the 1Password export — `gpg --import mercyb-backup-priv.asc`.)

# 3. Dry-run first to confirm everything looks right.
DATABASE_URL="postgresql://postgres@localhost:5432/mercyb_restore_test" \
  ./scripts/db-backup/restore.sh ./mercyb-2026-05-27T04-00-00Z-prod.dump.gpg --dry-run

# 4. Real restore against the non-prod target.
DATABASE_URL="postgresql://postgres@localhost:5432/mercyb_restore_test" \
  ./scripts/db-backup/restore.sh ./mercyb-2026-05-27T04-00-00Z-prod.dump.gpg

# 5. Verify with a smoke query: `SELECT count(*) FROM profiles;` etc.
```

The restore script is `--clean --if-exists` by default — every object
in the target is dropped before being restored. It prints a banner and
counts down 10 seconds before starting; abort with Ctrl+C if anything
looks wrong. Pass `--yes` only in automation.

## Quarterly test-restore reminder

**Calendar this**: every 3 months, restore the most recent backup to a
throwaway Postgres on your laptop and run a sanity query. A backup you
have never tried to restore is not a backup.

The test takes ~10 minutes. Do it after each major schema migration
even if it isn't quarterly time — schema migrations are where
backup/restore pipelines most commonly break.

## What this does NOT cover

- **Supabase Storage objects** (`room-audio`, `listening-clips`, etc).
  Those are file-system blobs in Supabase's S3-backed storage, not
  Postgres rows. A separate sync of the public buckets to Backblaze is
  on the roadmap; for now, audio is recoverable from the original
  source files in the repo or the Storage CDN.
- **Supabase Auth users' encrypted secrets** (MFA factors, etc) — the
  `auth.users` table dumps fine, but Supabase manages additional
  encryption layers for some fields that won't round-trip outside
  Supabase. Treat Auth migration as a Supabase-to-Supabase concern.
- **Real-time channel state** — ephemeral; not backed up anywhere
  except client memory.

## When to use these backups

In rough order of likelihood:

1. **Supabase account locked / suspended** — the use case that drove
   this. Restore to a fresh Supabase or Neon project and re-point the
   app.
2. **Bad migration shipped to prod** — restore a pre-migration dump to
   a side project, dump the affected tables, copy the rows back into
   prod (don't full-restore prod from a backup if you can possibly
   avoid it).
3. **Data accidentally deleted** — same surgical restore as (2).
4. **Disaster recovery / region outage** — bring up a new project, full
   restore, re-point.

For (1) and (4), the restore is "full". For (2) and (3), you almost
always want a partial restore via a temporary side project — the
`--clean --if-exists` default of `restore.sh` is the wrong choice here.
