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
| `nightly-dump.sh` | Two encrypted dumps per run: a `.schema.dump.gpg` (DDL-only, fast restore) and a `.dump.gpg` (full schema + data). `pg_dump --format=custom --compress=9` piped through `gpg --encrypt`. Plaintext never touches disk. |
| `restore.sh` | Companion decrypt + `pg_restore`. **Destructive.** 10-second guard countdown and a `--dry-run` mode. |
| `verify-restore.sh` | Non-production restore proof. Creates a throwaway DB, streams `gpg --decrypt` into `pg_restore`, runs smoke queries, then drops the throwaway DB unless `--keep-db` is passed. |
| `.gitlab-ci.yml` job `nightly-db-backup` | Scheduled execution at the configured cron time, uploads to object store via `rclone` into date-bucketed remote folders (`daily/`, `weekly/`, `monthly/`). |
| `.gitlab-ci.yml` job `test-db-backup-now` | Manual UI-triggered run with identical logic — lets Chau validate the pipeline without waiting for the schedule. |
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

| Variable | GitLab type | Protected | Masked | Contents |
|---|---|---:|---:|---|
| `DATABASE_URL` | Variable | yes | yes | `postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require` for the production Supabase Postgres database. If GitLab refuses masking because of password characters, rotate the DB password until the value can be masked. |
| `GPG_PUBLIC_KEY_FILE` | **File** | yes | no | Contents of `mercyb-backup-pub.asc` from step 1. This is a public key, but it is multi-line and must be file-type so GitLab writes it to a temp file path. |
| `RCLONE_CONFIG` | **File** | yes | no | Contents of `~/.config/rclone/rclone.conf` for the off-Supabase object store remote. This is multi-line and secret-bearing, so use file-type. |
| `RCLONE_CONFIG_REMOTE` | Variable | yes | no | Remote path for immutable uploads, e.g. `b2:mercyb-backups/prod`, `r2:mercyb-backups/prod`, or `s3:mercyb-backups/prod`. This is a bucket path, not a credential. |

**Why `GPG_PUBLIC_KEY_FILE` is a "file" variable, not a regular one:**
the public-key blob is multi-line and contains characters GitLab's
masking rejects. File-type variables are written to disk as a path
exposed through the env var, which is exactly what `nightly-dump.sh`
expects.

There is also a legacy alternative env var `GPG_RECIPIENT_KEY_ID` that
takes a key id / fingerprint ALREADY in the keyring — useful on a
laptop where you've imported the public key. CI runners are fresh per
job so `GPG_PUBLIC_KEY_FILE` is the practical choice in CI.

The dump script also accepts `SUPABASE_DB_URL` as a fallback if
`DATABASE_URL` is unset, but new setups should use `DATABASE_URL`.

### 2.1 Exact nightly GitLab schedule

Chau creates this in GitLab. Do not create it from an agent session.

Project page → **Build → Pipeline schedules → New schedule**:

| Field | Exact value |
|---|---|
| Description | `nightly-db-backup (04:00 UTC)` |
| Interval pattern | Custom |
| Cron | `0 4 * * *` |
| Cron timezone | `UTC` |
| Target branch | `main` |
| Variables | leave empty; the job reads project-level CI/CD variables |
| Activated | checked |

This schedule runs the `nightly-db-backup` job because `.gitlab-ci.yml`
gates it to `CI_PIPELINE_SOURCE == "schedule"`.

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

Trigger the `test-db-backup-now` manual job in GitLab CI **once** before
relying on the schedule. It uses identical code paths to the scheduled
job, so a successful manual run means the schedule will work too.

## Date-bucketed remote layout

The scheduled CI job uploads into three folders under
`$RCLONE_CONFIG_REMOTE`:

| Folder | What lands here | When |
|---|---|---|
| `daily/`   | Every night's pair of dumps (schema + full) | Always |
| `weekly/`  | Sunday night's pair of dumps                | Day-of-week == 7 (Sunday, UTC) |
| `monthly/` | First-of-the-month pair of dumps            | Day-of-month == 01 (UTC) |

The same encrypted files are simply copied into each folder, so the
weekly/monthly snapshots survive even after the daily folder gets
pruned. Pruning is independent per folder (see below).

## Retention policy + rclone-based pruning

Recommended: **7 daily + 4 weekly + 12 monthly**.

### Option A — rclone-based pruning (works on any S3-compatible store)

Run these as a follow-up job in the same CI pipeline, or on a separate
cron. They use `--min-age` to delete files older than the cutoff:

```bash
# Daily — keep only the last 7 days:
rclone delete --min-age 8d "$RCLONE_CONFIG_REMOTE/daily/"

# Weekly — keep only the last 4 Sundays (28 days ≈ 4 weeks; use 29d
# so we never accidentally trim a still-recent week):
rclone delete --min-age 29d "$RCLONE_CONFIG_REMOTE/weekly/"

# Monthly — keep only the last 12 monthly snapshots (366d to be safe
# across leap years):
rclone delete --min-age 366d "$RCLONE_CONFIG_REMOTE/monthly/"
```

Dry-run first if you're not sure what would go:

```bash
rclone delete --dry-run --min-age 8d "$RCLONE_CONFIG_REMOTE/daily/"
```

### Option B — object-store lifecycle rules

If the provider supports it (Backblaze B2, S3, R2 all do), set lifecycle
rules in the provider console. Backblaze B2 example:

```
keepLastVersions: 7        # daily
keepLastWeekly:   4        # weekly
keepLastMonthly: 12        # monthly
```

S3: transition objects to Glacier Deep Archive after 30 days, delete
after the retention window.

The lifecycle-rule approach is slightly more reliable than the rclone
approach because it survives client-side bugs (e.g. an empty
`$RCLONE_CONFIG_REMOTE` would otherwise wipe the bucket root with
`rclone delete`). If you choose Option B, you can skip the rclone
prune commands entirely.

## Manual run (laptop)

You may want to take a one-off pair of dumps before a risky migration.
With `DATABASE_URL` and a keyring containing the public key both set:

```bash
export DATABASE_URL="postgresql://postgres:...@db.<ref>.supabase.co:5432/postgres"
export GPG_RECIPIENT_KEY_ID="admin@mercyblade.com"   # or the fingerprint
export BACKUP_OUTPUT_DIR="$HOME/Desktop/mercyb-backups"

./scripts/db-backup/nightly-dump.sh
# OK /Users/you/Desktop/mercyb-backups/mercyb-2026-05-27T04-00-00Z-prod.schema.dump.gpg 41244
# OK /Users/you/Desktop/mercyb-backups/mercyb-2026-05-27T04-00-00Z-prod.dump.gpg        184320104
```

The two `OK <path> <bytes>` lines are the success contract — anything
else means failure.

## Restore procedure

**Always restore to a non-production database first.** Never restore
straight back over the live Supabase project unless you have already
exhausted every other option — a successful restore to a staging or
local Postgres is the test that the dump is actually usable.

If you only need to check structure quickly (e.g. confirm a table
exists), restore from the `.schema.dump.gpg` file — it's tiny and fast.

```bash
# 1. Pull the backup down.
rclone copy "$RCLONE_CONFIG_REMOTE/daily/mercyb-2026-05-27T04-00-00Z-prod.dump.gpg" ./

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

## One-command restore proof

Once Chau has the GPG private key in his local keyring and access to a
throwaway Postgres server, use `verify-restore.sh`. This is the preferred
backup gate because it proves the encrypted dump decrypts and restores
without targeting production.

```bash
# 1. Pull the encrypted full dump down from the backup remote.
rclone copy "$RCLONE_CONFIG_REMOTE/daily/mercyb-<timestamp>-prod.dump.gpg" ./

# 2. Confirm the private key exists locally. Import it from the password
#    manager first if needed:
#    gpg --import mercyb-backup-priv.asc
gpg --list-secret-keys admin@mercyblade.com

# 3. Restore into a throwaway DB and drop it automatically after smoke checks.
VERIFY_RESTORE_ADMIN_DATABASE_URL="postgresql://postgres:<password>@<throwaway-host>:5432/postgres?sslmode=require" \
  ./scripts/db-backup/verify-restore.sh ./mercyb-<timestamp>-prod.dump.gpg

# Or fetch the newest daily full dump directly from the configured backup remote.
VERIFY_RESTORE_ADMIN_DATABASE_URL="postgresql://postgres:<password>@<throwaway-host>:5432/postgres?sslmode=require" \
RCLONE_CONFIG_REMOTE="b2:mercyb-backups/prod" \
  ./scripts/db-backup/verify-restore.sh --from-rclone
```

Expected success shape:

```text
[verify-restore] creating throwaway DB mercyb_restore_verify_...
[verify-restore] restoring encrypted dump into mercyb_restore_verify_...
[verify-restore] running restore content assertions
[verify-restore] current_database=mercyb_restore_verify_...
[verify-restore] restored_tables=<non-zero count>
[verify-restore] schemas=<non-zero count>
[verify-restore] expected_table=public.profiles rows=<count>
[verify-restore] restore verification passed; throwaway DB will be dropped
```

Use `--keep-db` only when Chau wants to inspect the restored database
manually. The default is safer: drop the throwaway DB after proof.
Use `--expect-table <name>` and `--min-tables <n>` only when the scratch
database or dump shape intentionally differs from the default `profiles`
table check.

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
   this. Restore the full dump to a fresh Supabase or Neon project and
   re-point the app.
2. **Bad migration shipped to prod** — restore the schema-only dump to
   a side project, dump the affected tables from prod, replay; OR
   restore the full pre-migration dump to a side project and copy the
   affected rows back into prod.
3. **Data accidentally deleted** — same surgical restore as (2).
4. **Disaster recovery / region outage** — bring up a new project, full
   restore, re-point.

For (1) and (4), the restore is "full". For (2) and (3), you almost
always want a partial restore via a temporary side project — the
`--clean --if-exists` default of `restore.sh` is the wrong choice here.
