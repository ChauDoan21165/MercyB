# Backup Restore Drill Runbook

> **Frequency:** Quarterly (or after any major schema migration).
> A backup you have never restored is not a backup.
>
> **Scope:** decrypt the latest nightly GPG dump, restore it into a
> throwaway SCRATCH Supabase project, verify row counts for the 10
> biggest tables, tear down. Never touches production.
>
> **Who runs this:** Chau (the founder) — the GPG private key lives in
> 1Password and never leaves Chau's laptop. Agents cannot execute this
> drill; they can only update this document.
>
> **Time estimate:** ~20–30 minutes including Supabase project creation
> and teardown.

---

## Prerequisites checklist

Before starting, confirm all of the following:

- [ ] `psql`, `gpg`, `pg_restore`, and `rclone` are installed on your laptop
      (`brew install libpq gnupg rclone` if any are missing)
- [ ] The nightly backup job has run at least once (check GitLab →
      **Build → Pipelines → scheduled** → `nightly-db-backup`)
- [ ] You have access to the object store where dumps are uploaded
      (Backblaze B2 or whichever remote is in `RCLONE_CONFIG_REMOTE`)
- [ ] The `RCLONE_CONFIG` for that remote is configured in
      `~/.config/rclone/rclone.conf`
- [ ] The GPG private key for `admin@mercyblade.com` is saved in 1Password
      (it was generated during the one-time backup setup in
      `scripts/db-backup/README.md §1`)

---

## Step 1 — Import the GPG private key

> **CHAU ↓↓↓ LOCAL ACTION**
>
> 1. Open 1Password. Find the secure note named **"MercyBlade DB Backup
>    Private Key"**.
> 2. Export the attachment `mercyb-backup-priv.asc` to a temporary path
>    such as `~/Desktop/mercyb-backup-priv.asc`.
> 3. Import it into your local GPG keyring:
>    ```bash
>    gpg --import ~/Desktop/mercyb-backup-priv.asc
>    ```
> 4. Confirm the key is present:
>    ```bash
>    gpg --list-secret-keys admin@mercyblade.com
>    ```
>    You should see the key fingerprint and uid line.
> 5. Delete the exported file:
>    ```bash
>    rm ~/Desktop/mercyb-backup-priv.asc
>    ```
>
> **Why now:** `scripts/host/restore-drill.sh` checks for this key before
> it starts and exits with a clear error if it's missing. Importing first
> avoids a mid-drill failure.

---

## Step 2 — Create a scratch Supabase project

> **CHAU ↓↓↓ CONSOLE ACTION**
>
> 1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
>    and click **New project**.
> 2. Use these settings:
>    - **Name:** `mercyb-restore-drill-<YYYY-MM-DD>` (today's date)
>    - **Database password:** generate a strong random password and copy
>      it to your clipboard
>    - **Region:** same as the prod project (Southeast Asia / Singapore)
>    - **Pricing plan:** Free tier is fine for a drill
> 3. Wait for the project to finish provisioning (~1 minute).
> 4. Go to **Project Settings → Database → Connection string → URI**.
>    Copy the connection string. It looks like:
>    ```
>    postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres?sslmode=require
>    ```
>    Replace `<password>` with the password you generated in step 2.
> 5. Set it in your terminal:
>    ```bash
>    export VERIFY_RESTORE_ADMIN_DATABASE_URL="postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres?sslmode=require"
>    ```
>
> **Safety:** the script has a guard that refuses to run if the URL
> contains `buemdfxyhxunzpgdoqin` (the prod project ref). If you
> accidentally paste the prod URL, the script will print an error and
> exit before touching anything.

---

## Step 3 — Set environment variables

In the same terminal session where you exported
`VERIFY_RESTORE_ADMIN_DATABASE_URL` above, also set:

```bash
# Where the nightly dumps live (same value as the GitLab CI/CD variable).
export RCLONE_CONFIG_REMOTE="b2:mercyb-backups/prod"   # adjust if different

# Optional but strongly recommended: enables row-count comparison vs prod.
# This is the prod Supabase DATABASE_URL (read-only Postgres access is enough).
export DRILL_SOURCE_DATABASE_URL="postgresql://postgres:<prod-password>@db.buemdfxyhxunzpgdoqin.supabase.co:5432/postgres?sslmode=require"
```

> **CHAU ↓↓↓ LOCAL ACTION**
>
> `DRILL_SOURCE_DATABASE_URL` is the prod DB password — retrieve it from
> 1Password (**"Supabase DB Password — prod"**). Setting it enables the
> row-count comparison table in Step 5. If you skip it, the drill still
> validates that the restore worked; you just won't see a prod-vs-restored
> comparison.

---

## Step 4 — Dry-run (smoke check)

Before the real drill, run with `--dry-run` to confirm env vars are
correct and tools are in place:

```bash
cd ~/MercyB
scripts/host/restore-drill.sh --dry-run
```

Expected output (abbreviated):

```
[restore-drill] ════════════════════════════════════════════════════════
[restore-drill]  BACKUP RESTORE DRILL — 2026-06-11T...
[restore-drill] ════════════════════════════════════════════════════════
[restore-drill]  scratch admin URL : postgresql://[redacted]@db.<ref>.supabase.co:5432/postgres
[restore-drill]  throwaway DB      : mercyb_drill_20260611...
[restore-drill]  dump source       : rclone (b2:mercyb-backups/prod)
[restore-drill]  source comparison : (enabled — DRILL_SOURCE_DATABASE_URL set)
...
[restore-drill] dry-run: would rclone lsf b2:mercyb-backups/prod/daily/ and fetch newest *.dump.gpg
[restore-drill] dry-run: would CREATE DATABASE "mercyb_drill_..." on scratch project
[restore-drill] dry-run: would DROP DATABASE "mercyb_drill_..." from scratch project
[restore-drill] ── DRILL COMPLETE
```

If `restore-drill.sh` errors out here, fix the issue before proceeding.
Common problems:

| Error | Fix |
|---|---|
| `missing required command: psql` | `brew install libpq && brew link --force libpq` |
| `missing required command: rclone` | `brew install rclone` |
| `GPG private key for admin@mercyblade.com not found` | Re-do Step 1 |
| `RCLONE_CONFIG_REMOTE is not set` | Export the variable (Step 3) |
| `no full *.dump.gpg found` | Check that the nightly backup job has run; verify rclone can list: `rclone lsf "$RCLONE_CONFIG_REMOTE/daily/"` |

---

## Step 5 — Run the drill

```bash
scripts/host/restore-drill.sh
```

The script will:

1. **Fetch** the newest `*.dump.gpg` from the object store via `rclone`
2. **Restore** it into throwaway DB `mercyb_drill_<timestamp>` on the
   scratch project using `scripts/db-backup/verify-restore.sh`
   (creates the DB, decrypts + `pg_restore`, runs basic smoke queries)
3. **Run `ANALYZE`** on the restored DB so row estimates are fresh
4. **Compare row counts** for the 10 biggest tables:
   - Identifies the top-10 tables by disk size from prod (or restored DB
     if `DRILL_SOURCE_DATABASE_URL` is not set)
   - Runs `count(*)` on each table in both restored DB and prod
   - Prints a comparison table
5. **Tear down** by dropping the throwaway DB

Typical runtime: ~10–20 minutes depending on dump size and Supabase
provisioning speed. The `count(*)` step can add 5–10 minutes for large
tables; use `--fast` to use row estimates instead if time is short.

### Expected success output

```
[restore-drill] ── Step 1/4: Fetch latest encrypted dump
[restore-drill] fetching: mercyb-2026-06-11T04-00-00Z-prod.dump.gpg
[restore-drill] fetched: /tmp/.../mercyb-...prod.dump.gpg (184M)

[restore-drill] ── Step 2/4: Restore into scratch throwaway DB (mercyb_drill_20260611...)
[verify-restore] creating throwaway DB mercyb_drill_20260611...
[verify-restore] restoring encrypted dump into mercyb_drill_...
[verify-restore] running restore content assertions
[verify-restore] current_database=mercyb_drill_...
[verify-restore] restored_tables=<non-zero>
[verify-restore] schemas=<non-zero>
[verify-restore] expected_table=public.profiles rows=<count>
[verify-restore] restore verification passed; kept throwaway DB ...
[restore-drill] running ANALYZE ...
[restore-drill] ANALYZE complete

[restore-drill] ── Step 3/4: Row-count verification (top 10 tables)

TABLE                                          RESTORED          SOURCE      STATUS
──────────────────────────────────────────── ─────────────── ─────────────── ────────────
public.profiles                                      1 234           1 235          OK
public.user_subscriptions                              890             890          OK
public.email_events                                  4 501           4 506    OK (0% drift)
...

[restore-drill] row-count verification PASSED — all 10 tables within acceptable drift

[restore-drill] ── Step 4/4: Teardown
[restore-drill] teardown: terminating connections and dropping mercyb_drill_... ...
[restore-drill] teardown: done — throwaway DB dropped

[restore-drill] ── DRILL COMPLETE ── 2026-06-11T10:42:33Z
```

---

## Step 6 — Delete the scratch Supabase project

> **CHAU ↓↓↓ CONSOLE ACTION**
>
> The throwaway DB inside the scratch project was dropped automatically
> by the script. But the scratch *project itself* still exists on your
> Supabase account and costs Free-tier quota.
>
> 1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard).
> 2. Find the `mercyb-restore-drill-<date>` project.
> 3. Go to **Project Settings → General → Danger Zone → Delete project**.
> 4. Confirm deletion.
>
> **Note:** if you ran with `--keep-db` to inspect the restored DB
> manually, also drop the throwaway DB first:
> ```bash
> psql "$VERIFY_RESTORE_ADMIN_DATABASE_URL" \
>   -c "DROP DATABASE \"mercyb_drill_<timestamp>\";"
> ```

---

## Success criteria

The drill PASSES when all of the following are true:

- [ ] `restore-drill.sh` exits with code `0`
- [ ] `[verify-restore] restore verification passed` appears in output
- [ ] Every row in the comparison table shows `OK` or `OK (≤5% drift)`
- [ ] The throwaway DB was dropped (teardown log line present)

A `WARN N% short` row (>5% drift) on an active table is acceptable if:
- The table receives frequent writes in prod
- The drift percentage can be explained by the time elapsed between the
  dump (04:00 UTC) and when you ran the drill count

If it fails or the count drift is unexplained, see **Failure recovery**
below.

---

## Failure recovery

### Restore step fails

Symptom: `pg_restore` or `gpg` error logged by `verify-restore.sh`.

1. Was the dump fetched correctly? Check file size:
   ```bash
   ls -lh /tmp/mercyb-restore-drill-*/mercyb-*-prod.dump.gpg
   ```
   A valid full dump is typically 100–500 MB. An empty or tiny file
   means the rclone fetch failed mid-way.
2. Is the GPG private key the right one?
   ```bash
   gpg --list-secret-keys --keyid-format=long admin@mercyblade.com
   ```
   The fingerprint must match what's in 1Password.
3. Is the scratch project accepting connections? Try:
   ```bash
   psql "$VERIFY_RESTORE_ADMIN_DATABASE_URL" -c "SELECT 1;"
   ```
4. Check scratch project logs in Supabase Dashboard → **Logs → Postgres**.

### Row counts unexpectedly low

Symptom: >5% drift warning on non-write-heavy tables (e.g. `rooms`,
`lessons`).

1. Check the dump timestamp vs now. A very old daily dump (>24h) can
   legitimately miss data.
2. Check if `ANALYZE` ran — if it was skipped, `n_live_tup` will be 0.
   Re-run with `--fast` off to use exact `count(*)` instead.
3. If counts are consistently 0 for a table, check whether the table was
   excluded from the dump (e.g. excluded via `--exclude-table` in
   `nightly-dump.sh` — it currently isn't, but confirm).

### Script exits with code 9 (prod guard)

Symptom: `VERIFY_RESTORE_ADMIN_DATABASE_URL contains the PRODUCTION
Supabase project ref`.

You have the prod project URL in the wrong variable. Set
`VERIFY_RESTORE_ADMIN_DATABASE_URL` to the *scratch* project URL (Step 2).

---

## Scheduling

Run this drill at least once per quarter. Suggested cadence:

| Trigger | When |
|---|---|
| Quarterly calendar reminder | March, June, September, December |
| After any major schema migration | Within 48 hours of migration landing |
| After a `nightly-db-backup` CI failure | Once the backup pipeline is repaired |
| Before a disaster-recovery exercise | Always run the drill before invoking `restore.sh` |

Log the drill result in the quarterly note in 1Password or a dated entry
in `docs/notes/` after each run — record the dump timestamp, table
counts, and pass/fail verdict.

---

## Quick reference

```bash
# Full drill (recommended — includes prod comparison):
export VERIFY_RESTORE_ADMIN_DATABASE_URL="postgresql://postgres:<pw>@db.<scratch-ref>.supabase.co:5432/postgres?sslmode=require"
export RCLONE_CONFIG_REMOTE="b2:mercyb-backups/prod"
export DRILL_SOURCE_DATABASE_URL="postgresql://postgres:<prod-pw>@db.buemdfxyhxunzpgdoqin.supabase.co:5432/postgres?sslmode=require"
scripts/host/restore-drill.sh

# Dry-run only (no DB created, confirms env + tools):
scripts/host/restore-drill.sh --dry-run

# Fast row-count mode (n_live_tup estimates, ~5min faster):
scripts/host/restore-drill.sh --fast

# Use a local dump file instead of rclone fetch:
scripts/host/restore-drill.sh --dump ~/Downloads/mercyb-2026-06-11T04-00-00Z-prod.dump.gpg

# Keep restored DB for manual inspection:
scripts/host/restore-drill.sh --keep-db
```
