# Activating the external `pg_dump` pipeline

> **Scope:** the one-time setup work that turns C7's external nightly
> Postgres backup pipeline (shipped in MR !69) from "code on main"
> into "running every night and writing encrypted dumps to an
> object store you control."
>
> **Why this is a separate doc:** the pipeline code is committed; the
> CI/CD variable values, the GPG private key, and the object-store
> credentials are NOT (per the project's security posture — secrets
> live in macOS Keychain / 1Password / GitLab CI variables, never in
> the repo, [[project_agent_infra_access]]). This doc is the runbook
> for setting those secrets up.
>
> **Audience:** Chau (founder). Agents cannot perform this work — it
> requires GPG private-key generation, password-manager access, and
> GitLab CI/CD variable creation, all of which are deliberately
> agent-unreachable per principle #19 (secrets stay with the human).
>
> **Companion docs:**
> - `scripts/db-backup/README.md` — the pipeline's own design doc,
>   shipped in !69. Read this first for context.
> - `docs/runbooks/disaster-recovery.md` §5 — the broader disaster-
>   recovery runbook (!67) that motivates this pipeline.
> - `scripts/supervisor/verify-pg-dump-setup.sh` — pre-flight
>   verification script. Run it after each section below.
>
> **Time budget:** ~45–60 minutes end-to-end, of which 10 minutes
> are waiting on `gpg --gen-key` and ~10 minutes are the Backblaze
> account-creation flow if you don't have one already.
>
> **Last verified:** 2026-05-27.

---

## §1 What this doc activates

After completing every step below, the following will be true:

1. A GPG keypair exists where the private key is stored only in your
   password manager (and a physical offline backup), and the public
   key is loaded into GitLab CI as a file-type variable.
2. An off-Supabase object store (Backblaze B2 by default — see
   alternatives in §3) exists with a dedicated bucket and a
   per-app application key.
3. The four required GitLab CI/CD variables are set:
   `DATABASE_URL`, `GPG_PUBLIC_KEY_FILE`, `RCLONE_CONFIG`,
   `RCLONE_CONFIG_REMOTE`. Names exactly as `.gitlab-ci.yml` and
   `scripts/db-backup/nightly-dump.sh` read them, so use them
   verbatim.
4. The scheduled `nightly-db-backup` pipeline runs at 04:00 UTC and
   writes a fresh `mercyb-<timestamp>-prod.dump.gpg` to your bucket.
5. The `nightly-db-backup-now` manual job is greenwhen you trigger
   it from the GitLab UI as a one-off pipeline-validation run.

If `scripts/supervisor/verify-pg-dump-setup.sh` reports GREEN for
every check, you're done with setup.

---

## §2 Generate the GPG keypair

**Do this on your personal laptop**, not on a server you might lose
access to and not inside a CI runner. The private key never leaves
your password manager + a physical offline backup.

### §2.1 Generate

```bash
gpg --full-generate-key
```

The interactive prompts. Answer each as below:

| Prompt | What to enter |
|---|---|
| Please select what kind of key you want | `(1) RSA and RSA` — the default; enter `1` or just press Return. |
| What keysize do you want? | `4096` — type `4096` and press Return. The default of 3072 is fine for general use; 4096 is the right choice here because this key sits idle for years between use and needs to outlast incremental crypto attacks. |
| Key is valid for? | `0` — never expires. A 1-year key would force you to rotate during the next account-lockout incident, which is the worst possible time. We accept the "compromised key can't be revoked easily" tradeoff because the private key never leaves 1Password. |
| Is this correct? | `y` |
| Real name | `MercyBlade DB Backup` |
| Email address | `admin@mercyblade.com` (per [[project_sending_address]]) |
| Comment | (leave blank — press Return) |
| Change name/comment/email/okay/quit | `o` for okay. |
| Enter passphrase | **A passphrase you actually remember.** This passphrase protects the private key inside your password manager — if it's ever lost AND the password manager is breached, the attacker still needs the passphrase. Use a 4-word diceware passphrase or equivalent. Save it in your password manager alongside the key file. |

After generation, GPG dumps a summary. Note the **fingerprint** —
the 40-character hex string. You'll use the email address
`admin@mercyblade.com` as the recipient identifier in the pipeline.

### §2.2 Export the public key

```bash
gpg --armor --export admin@mercyblade.com > mercyb-backup-pub.asc
```

This is the file you'll upload to GitLab CI as a file-type variable
(§6 step 2). It's safe to commit publicly (but don't — there's no
reason to).

### §2.3 Export and stash the private key

```bash
gpg --armor --export-secret-keys admin@mercyblade.com > mercyb-backup-priv.asc
```

**Now immediately move it to 1Password:**

1. Open 1Password (or your password manager of choice).
2. Create a new **Secure Note** titled
   `MercyBlade GPG private key — DB backups`.
3. **Attach** `mercyb-backup-priv.asc` as a file attachment to that
   note. Confirm the file is uploaded by closing and reopening the
   note.
4. In the note body, write the GPG passphrase (the one from §2.1).
5. **Verify before deleting from disk.** Open the attachment from
   inside 1Password and confirm it begins with
   `-----BEGIN PGP PRIVATE KEY BLOCK-----`.
6. Make a physical offline backup: copy `mercyb-backup-priv.asc`
   to a USB drive, store the drive somewhere not in your house
   (safe-deposit box, parent's home, etc.). Document this location
   in the 1Password note.
7. **Only then** delete the local copy:

```bash
rm mercyb-backup-priv.asc
```

The public key file (`mercyb-backup-pub.asc`) stays on your
laptop — you'll upload it in §6.

### §2.4 Why a file-type variable for the public key

GitLab CI/CD variables have two relevant types:

- **Variable (default):** a single-line string; max ~10 KB; masking
  works on values that match GitLab's masking criteria (no
  whitespace, no quotes, no asterisks).
- **File:** the value is written to disk in the job's filesystem as
  a temporary file; the variable's value is the **file path**, not
  the contents.

The armored public key is multi-line and starts with
`-----BEGIN PGP PUBLIC KEY BLOCK-----`. GitLab's masking rejects
multi-line values. A **regular** variable would either fail to save
or save unmasked.

A **file** variable solves both: GitLab writes the contents to a
temporary path, and `nightly-dump.sh` reads `GPG_PUBLIC_KEY_FILE` as
that path and imports the public key on the fly.

**Therefore: use type "File" for `GPG_PUBLIC_KEY_FILE`, not type
"Variable."**

---

## §3 Set up the off-Supabase object store

The pipeline must NOT write to Supabase Storage — defeats the
purpose. Choose any S3-compatible store you can reach. Recommended
candidates (no winner pre-selected; pick on cost/jurisdiction):

| Provider | Storage cost | Egress cost | Notes |
|---|---|---|---|
| **Backblaze B2** | $5/TB/month (cheap) | Free to Cloudflare; $10/TB elsewhere | Default recommendation; cheap, simple, S3-compatible. |
| **Cloudflare R2** | $15/TB/month | $0 (zero egress) | Same-vendor as our DNS provider, single login surface. Tradeoff: ties two layers to one vendor. |
| **AWS S3 + Glacier Deep Archive** | $0.99/TB/month (cold) | $9/GB to retrieve | Cheapest IF you treat backups as break-glass-only. Retrieving takes 12–48 hours. |

This doc walks the **Backblaze B2** path because it's the cheapest
common case. If you pick a different provider, the §3 + §4 steps
adapt — `rclone` handles all three uniformly.

### §3.1 Create the Backblaze B2 account + bucket

1. Go to https://www.backblaze.com/sign-up/cloud-storage. Use a NEW
   email separate from your Google / Supabase / GitLab login (per
   the disaster-recovery runbook's §3.3 "Recovery-email rule").
2. Verify the email + enable 2FA via authenticator app (NOT SMS) —
   §3 of `docs/runbooks/disaster-recovery.md` is the source for the
   forbid-SMS-2FA rule.
3. Sign in → My Account → **Buckets** → **Create a Bucket**.
4. Bucket settings:
   - **Name:** `mercyb-backups` (must be globally unique across B2; if
     taken, add a suffix like `mercyb-backups-prod`).
   - **Files in Bucket are:** Private.
   - **Default Encryption:** Disable. (We encrypt with GPG before
     upload; double-encrypting wastes CPU.)
   - **Object Lock:** Disable for now. Worth enabling once retention
     policy is finalized.
5. Set lifecycle rules (Bucket Settings → Lifecycle Settings →
   Set Bucket Lifecycle Rules):
   - **Keep prior versions for last 7 days** for daily files.
   - Optional: a weekly + monthly snapshot path if you want longer
     retention. See `scripts/db-backup/README.md` "Retention policy"
     for the suggested 7-daily / 4-weekly / 12-monthly cascade.

### §3.2 Generate an application key

1. Go to **App Keys** in the left sidebar.
2. **Add a New Application Key**:
   - **Name:** `mercyb-backups-write`.
   - **Allow access to Bucket(s):** select the `mercyb-backups`
     bucket only. (Important — never use a master key in CI.)
   - **Type of Access:** Read and Write.
   - **Allow List All Bucket Names:** unchecked.
   - **File name prefix:** leave blank.
   - **Duration:** leave blank (no expiry — we accept the rotate-
     manually tradeoff; rotating annually is a calendar item, not
     a forced one).
3. Click **Create New Key**.
4. **The next page shows the `keyID` + `applicationKey` ONCE.** Copy
   both into 1Password immediately, in a Secure Note titled
   `MercyBlade Backblaze B2 — mercyb-backups`. After you navigate
   away, the `applicationKey` is unrecoverable — you'd have to
   delete the key and make a new one.

You now have:
- `keyID` — looks like `004abcdef1234567890`
- `applicationKey` — looks like `K004abc...` (base64-ish, ~30 chars)
- Bucket name: `mercyb-backups`
- Endpoint: `s3.us-west-002.backblazeb2.com` (or your bucket's actual
  endpoint — visible on the bucket's settings page)

---

## §4 Configure `rclone` locally

`rclone` is the upload tool the CI job uses. We configure it on
your laptop, verify the upload works, then export the config to
load into GitLab.

### §4.1 Install if not already present

```bash
brew install rclone   # macOS
# or: https://rclone.org/install/
```

### §4.2 Run the config dialog

```bash
rclone config
```

Walkthrough — each prompt → answer:

| Prompt | Answer |
|---|---|
| `n/s/q>` | `n` (new remote) |
| `name>` | `b2` (must match what you'll use in `RCLONE_CONFIG_REMOTE`; if you change it, adjust accordingly throughout) |
| `Storage>` (list of provider numbers) | type `b2` or the number next to `Backblaze B2`. |
| `Application Key ID> account>` | paste your `keyID` from §3.2. |
| `Application Key> key>` | paste your `applicationKey` from §3.2. |
| `Endpoint>` | leave blank (rclone auto-detects from `keyID`). |
| `Edit advanced config? (y/n)` | `n`. |
| `Yes this is OK / Edit this remote / Delete this remote` | `y`. |
| `Current remotes ... e/n/d/r/c/s/q>` | `q` (quit). |

### §4.3 Verify locally

```bash
rclone lsf b2:           # should list your bucket(s)
rclone lsf b2:mercyb-backups   # should be empty (no files yet)

# Drop a smoke-test file:
echo "rclone smoke test $(date -u)" > /tmp/rclone-smoke.txt
rclone copy /tmp/rclone-smoke.txt b2:mercyb-backups/
rclone lsf b2:mercyb-backups   # should show rclone-smoke.txt
rclone deletefile b2:mercyb-backups/rclone-smoke.txt
rm /tmp/rclone-smoke.txt
```

If `rclone lsf b2:` errors, the `keyID` / `applicationKey` are
wrong — re-run `rclone config` and re-enter them.

### §4.4 Extract the config string for GitLab CI

```bash
cat ~/.config/rclone/rclone.conf
```

You'll see something like:

```ini
[b2]
type = b2
account = 004abcdef1234567890
key = K004abc...
```

**This entire content** is what goes into the GitLab `RCLONE_CONFIG`
file-type variable in §6. Don't copy fragments — copy the whole
file including the `[b2]` header.

---

## §5 Find your Supabase `DATABASE_URL`

The pipeline's `DATABASE_URL` is the direct-Postgres connection
string for the prod database. **Not** the public API URL; **not**
the connection-pooler URL.

### §5.1 Where to find it

1. Open https://supabase.com/dashboard/projects.
2. Pick the `mercyblade-prod` project (project ref
   `buemdfxyhxunzpgdoqin`, per `CLAUDE.md`).
3. Go to **Project Settings** → **Database**.
4. Scroll to the **Connection string** section.
5. Pick the **URI** tab. The default mode (Session) is what we want
   for `pg_dump`.
6. The string looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.buemdfxyhxunzpgdoqin.supabase.co:5432/postgres
   ```
7. **Click "Copy"** — Supabase substitutes `[YOUR-PASSWORD]` for the
   real password when you copy.

If you've forgotten the password: same page → **Reset database
password** at the top → copy the new password → update everywhere
else it's used (your local `.env`, the `mb-supabase-service-role`
Keychain entry per [[project_agent_infra_access]], etc.).

### §5.2 Sanity-check the URL locally

```bash
# Optional but recommended — confirm the URL works before pasting into GitLab.
# The hostname check below does NOT make a Postgres connection, just DNS.
host db.buemdfxyhxunzpgdoqin.supabase.co
# → should resolve to an IPv4 address; if not, the host portion is wrong.

# Real connection test (paste the URL, redacted here):
psql 'postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres' -c 'SELECT now();'
# → should print one row with the current timestamp.
```

If `psql` errors with "password authentication failed", the
password portion of the URL is wrong. If it errors with "could not
translate host name", the project ref is wrong.

---

## §6 Set GitLab CI/CD variables

Now the four secrets land in GitLab. **Each variable is "Protected"
(only runs on protected branches/tags) and the "Masked" setting
depends on the value type — see the table below.**

### §6.1 Navigate to the variables panel

1. Open your project: https://gitlab.com/cd12536/mercyB.
2. Left sidebar → **Settings** → **CI/CD**.
3. Find the **Variables** section → **Expand**.

### §6.2 Add each variable

For each row in the table below, click **Add variable** and fill the
form. The exact settings matter — the "Masked" + "File" + "Protected"
checkboxes are what make the pipeline secure.

| Key | Type | Value | Protected | Masked | Notes |
|---|---|---|---|---|---|
| `DATABASE_URL` | **File** | `postgresql://postgres:<password>@db.buemdfxyhxunzpgdoqin.supabase.co:5432/postgres` | ✓ | ✓ | File type is accepted because the dump script dereferences file-backed env values before connecting. |
| `GPG_PUBLIC_KEY_FILE` | **File** | Contents of `mercyb-backup-pub.asc` from §2.2 | ✓ | (cannot mask file vars) | Multi-line; masking is not applicable. GitLab writes the contents to a temp file in the runner and exposes the file path as the variable value. |
| `RCLONE_CONFIG` | **File** | Contents of `~/.config/rclone/rclone.conf` from §4.4 | ✓ | (cannot mask file vars) | Same shape as `GPG_PUBLIC_KEY_FILE` — multi-line config file. |
| `RCLONE_CONFIG_REMOTE` | Variable | `b2:mercyb-backups/prod` | ✓ | ✗ (no need to mask — this is just a bucket path, not a secret) | The path inside the bucket where dumps go. `b2:` must match the `[b2]` section name in your `RCLONE_CONFIG`. |

### §6.3 Sanity check via verification script

After adding all four variables, run the verification script (full
walkthrough in §9):

```bash
cd ~/MercyB     # or wherever your local clone lives
bash scripts/supervisor/verify-pg-dump-setup.sh
```

All four variable checks should show **GREEN**. If any are RED, the
script tells you which variable is missing or misnamed.

---

## §7 Activate the schedule

1. Project page → left sidebar → **Build** → **Pipeline schedules**.
2. Click **New schedule**.
3. Settings:
   - **Description:** `nightly-db-backup (04:00 UTC)`.
   - **Interval Pattern:** select **Custom**, then enter
     `0 4 * * *` (this means: at minute 0 of hour 4 every day, UTC).
   - **Cron Timezone:** UTC.
   - **Target branch:** `main`.
   - **Variables:** leave empty (the pipeline reads everything from
     project-level CI/CD variables).
   - **Activated:** ✓ (checked).
4. Click **Save pipeline schedule**.

The schedule now sits in the list. The next run will be the next
04:00 UTC after the creation time.

### §7.1 Verify the schedule appears

In the **Pipeline schedules** page, you should see one row:

| Description | Owner | Next run | Last pipeline | Activated |
|---|---|---|---|---|
| `nightly-db-backup (04:00 UTC)` | cd12536 | (a future date, ~04:00 UTC) | (empty until first run) | ✓ |

If you don't see the schedule, the verification script's
`Schedule presence` check will report RED.

---

## §8 First manual verification run

**Do NOT wait for the schedule** to fire the first time. Trigger
the manual job once, watch it succeed end-to-end, then trust the
schedule.

### §8.1 Trigger the `nightly-db-backup-now` manual job

1. Project page → **Build** → **Pipelines**.
2. Click **Run pipeline** (top-right).
3. **Run for branch:** `main`.
4. Leave variables empty.
5. Click **New pipeline**.

The pipeline starts. The `nightly-db-backup-now` job appears with
a **Play** icon (manual gate). Click the Play icon to start the
job.

### §8.2 Watch the logs

While the job runs (~2–5 minutes for a ~100-user-scale DB), the
log should show:

1. `apk add --no-cache --quiet gnupg rclone bash coreutils` (image
   prep).
2. The four `command -v` lines (toolchain presence).
3. `mkdir -p /builds/.../_backup_out`.
4. A success summary like:
   `OK /builds/.../_backup_out/mercyb-2026-05-27T...Z-prod.dump.gpg 184320104`
5. `rclone copy --immutable ... b2:mercyb-backups/prod`.
6. `Uploaded /builds/.../mercyb-...-prod.dump.gpg to b2:mercyb-backups/prod (manual run)`.
7. Job status: **Passed**.

### §8.3 Confirm the dump landed in B2

```bash
rclone lsf b2:mercyb-backups/prod/
# → should list the mercyb-<timestamp>-prod.dump.gpg from the manual run.

rclone size b2:mercyb-backups/prod/
# → should report 1 file, size > 0 bytes.
```

If the file is present and non-zero, **the pipeline is live**. You
can leave it alone — the schedule takes over from here.

---

## §9 The verification script

Location: `scripts/supervisor/verify-pg-dump-setup.sh` (this MR).

Run it after each of §2 / §3 / §4 / §5 / §6 / §7 to confirm
progress. The script:

- Calls `glab variable list` to confirm each of the four required
  variables exists in the project. **It never reads the variable
  values** — only the names.
- Calls `glab schedule list` (or falls back to the GitLab REST
  API) to confirm the schedule exists.
- Prints **GREEN** / **YELLOW** / **RED** per requirement.
- Exits 0 if all GREEN, 1 otherwise.

### §9.1 Run it

```bash
cd ~/MercyB     # or your local clone
bash scripts/supervisor/verify-pg-dump-setup.sh
```

Example output (mid-setup):

```
[verify-pg-dump-setup] GitLab project: cd12536/mercyB

  CI/CD variables
    [GREEN]  DATABASE_URL  present (file type)
    [GREEN]  GPG_PUBLIC_KEY_FILE  present (file type)
    [RED  ]  RCLONE_CONFIG  NOT FOUND in project variables
    [RED  ]  RCLONE_CONFIG_REMOTE  NOT FOUND in project variables

  Pipeline schedules
    [YELLOW] nightly-db-backup schedule  NOT FOUND (run §7 of pg-dump-activation.md)

Summary: 2 GREEN, 1 YELLOW, 2 RED
```

When fully set up:

```
[verify-pg-dump-setup] GitLab project: cd12536/mercyB

  CI/CD variables
    [GREEN]  DATABASE_URL  present (file type)
    [GREEN]  GPG_PUBLIC_KEY_FILE  present (file type)
    [GREEN]  RCLONE_CONFIG  present (file type)
    [GREEN]  RCLONE_CONFIG_REMOTE  present

  Pipeline schedules
    [GREEN]  nightly-db-backup schedule  present (next run: 2026-05-28T04:00:00Z)
    [GREEN]  nightly-db-backup schedule  cron matches 0 4 * * * UTC

Summary: 6 GREEN, 0 YELLOW, 0 RED
```

### §9.2 Prerequisites for the script

- `glab` CLI installed and authenticated (`glab auth status` shows
  Logged in as `cd12536`).
- `jq` installed (parses `glab` JSON output).
- Run from a directory inside the `cd12536/mercyB` clone (the
  script uses `glab`'s repo auto-detection).

If you need to install:

```bash
brew install glab jq
glab auth login   # follow the OAuth-or-token prompts
```

---

## §10 Troubleshooting

### §10.1 The manual job fails at `gpg --encrypt`

Likely cause: `GPG_PUBLIC_KEY_FILE` was uploaded as type **Variable**
instead of type **File**. The pipeline expects a file path and got
the literal armored key.

Fix: re-create `GPG_PUBLIC_KEY_FILE` with type **File**.

### §10.2 The manual job fails at `rclone copy`

Likely causes:

- `RCLONE_CONFIG` is type Variable instead of File.
- The `[b2]` remote name in `rclone.conf` doesn't match the prefix
  in `RCLONE_CONFIG_REMOTE` (e.g. `RCLONE_CONFIG_REMOTE=b2:...` but
  the config has `[backblaze]` not `[b2]`).
- The Backblaze application key was revoked or has wrong scope.

Fix: re-verify §4 locally (`rclone lsf b2:` from your laptop). If
local works, the GitLab `RCLONE_CONFIG` content is wrong; re-paste.

### §10.3 The manual job fails at `pg_dump` with "FATAL: password authentication failed"

The `DATABASE_URL` password is wrong, or it was rotated since
last set.

Fix: §5.1 → reset the Supabase database password → update
`DATABASE_URL` in GitLab CI/CD variables (use **Update value**,
don't add a duplicate).

### §10.4 The verification script reports YELLOW for the schedule

The four variables are set but the schedule isn't created. Run §7.

### §10.5 The verification script reports RED for everything

Your `glab` isn't authenticated to the project. Run `glab auth
status` — if it shows "not logged in", run `glab auth login` and
try again.

### §10.6 The `nightly-db-backup` schedule fires but the job is skipped

The job has `rules: - if: '$CI_PIPELINE_SOURCE == "schedule"'`. The
schedule fires the pipeline; the job's `rules` then admit it. If
the rule blocks the job, the pipeline shows the job as "skipped."
Check that the schedule's target branch matches a branch where the
.gitlab-ci.yml file lives (i.e. `main`).

---

## §A Quarterly maintenance

This is a "set up once, then forget" pipeline. The only recurring
work:

1. **Quarterly test-restore** — per `scripts/db-backup/README.md`
   "Quarterly test-restore reminder," restore the most recent
   `.dump.gpg` to a throwaway local Postgres and run a sanity
   query. ~10 minutes; bookmark this in your calendar.
2. **Annual GPG key rotation** — optional. If the private key is
   stored only in 1Password + offline USB, rotation is more
   ceremony than safety. Skip unless your password manager is
   compromised.
3. **Watch for failed schedule runs** — GitLab can email you when
   a scheduled pipeline fails. Enable email notifications under
   **Settings → Notifications → Custom** for this project, then
   tick **Failed pipeline**.

---

## §B Cross-references

- `scripts/db-backup/README.md` — the pipeline's own design doc
  (MR !69).
- `scripts/db-backup/nightly-dump.sh` — the dump script the
  scheduled job invokes.
- `scripts/db-backup/restore.sh` — the companion restore script
  (read this before the first quarterly test-restore).
- `.gitlab-ci.yml` — the schedule + manual job definitions.
- `scripts/supervisor/verify-pg-dump-setup.sh` — pre-flight check
  this doc walks through in §9.
- `tests/scripts/pg-dump-setup-script-shape.test.ts` — shape test
  for the verification script.
- `docs/runbooks/disaster-recovery.md` — the broader disaster-
  recovery playbook (MR !67) that this pipeline is the
  highest-leverage hardening for.
- `tests/scripts/db-backup-script-shape.test.ts` — shape test for
  the underlying pipeline scripts (MR !69).

---

**End of activation runbook.** When `scripts/supervisor/verify-pg-dump-setup.sh`
shows all GREEN and §8.3 confirms a file in B2, the pipeline is
live and the doc has done its job.
