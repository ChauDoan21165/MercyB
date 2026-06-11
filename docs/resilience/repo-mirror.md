# Repository Mirror — Setup and Verification

> **Why this doc exists:** the May 2026 GitHub-suspension cascade exposed
> that GitLab alone is a single point of failure for the repository layer.
> This doc closes the §1 "Partial" gap in `docs/runbooks/disaster-recovery.md`
> by wiring a live push mirror so any GitLab outage has a warm backup.
>
> **Scope:** one primary GitLab remote + one push-mirror target.
> Two providers, no more (per disaster-recovery §6.1).

---

## Evaluation: GitHub vs Codeberg

| | **GitHub (old `cd12536` account)** | **Codeberg** |
|---|---|---|
| Account status | **Suspended** as of 2026-05-26. Repo `github.com/cd12536/mercyB` returns 404. Cannot receive pushes. | Active, free, EU-hosted Gitea instance. Independent vendor. |
| GitLab push-mirror support | N/A (account inaccessible) | Full SSH push-mirror via GitLab Settings → Repository → Mirroring. |
| Cost | — | $0 (free tier; private repos supported). |
| Independence from GitLab | Shares the GitHub identity ecosystem (same ecosystem that caused the May cascade). | Fully independent provider, separate identity chain. |
| CI/CD | N/A | Codeberg Actions (Gitea-based). Not needed — mirrors are read-only backups; CI stays on GitLab. |
| **Verdict** | ✘ Not viable — account suspended, repo not found. | ✓ **Recommended**. Free, independent, no shared identity with GitLab. |

**Decision: Codeberg via GitLab's built-in push mirroring.**

The one-step alternative mentioned in the brief is irrelevant once GitHub is confirmed unreachable — Codeberg is the direct implementation path.

---

## Setup steps (Chau's clicks)

> Mirror config lives in GitLab repo settings — Chau must click these.
> Agent cannot configure GitLab repository settings.

### Step 1 — Create the Codeberg repo (one-time, ~2 min)

1. Go to **https://codeberg.org** → sign in (or create a free account).
2. Click **+ → New Repository**.
3. Set:
   - **Owner:** your Codeberg username (e.g. `chaudoan` or `cd12536`)
   - **Repository name:** `mercyB`
   - **Visibility:** Private
   - **Initialize:** ✗ (no README — must be empty for the mirror push to work)
4. Click **Create Repository**.
5. Note the SSH URL shown: `git@codeberg.org:<username>/mercyB.git`.

### Step 2 — Add an SSH deploy key to Codeberg

GitLab needs a private key to push to Codeberg.

1. In the GitLab repo, go to **Settings → Repository → Deploy keys**.
2. Copy the public key shown under "Deploy keys" — or generate a dedicated one:
   ```bash
   # Run once on your Mac; use ed25519 for Codeberg compatibility
   ssh-keygen -t ed25519 -C "gitlab-mirror-to-codeberg" \
     -f ~/.ssh/gitlab_codeberg_mirror -N ""
   cat ~/.ssh/gitlab_codeberg_mirror.pub   # copy this
   ```
3. In **Codeberg repo → Settings → Deploy Keys → Add Key**:
   - **Title:** `gitlab-mirror`
   - **Content:** paste the public key
   - **Allow Write Access:** ✓ (required for push-mirror)
   - Click **Add Deploy Key**.

### Step 3 — Configure the push mirror in GitLab

1. Go to the GitLab repo: **https://gitlab.com/cd12536/mercyB**.
2. Open **Settings → Repository → Mirroring repositories**.
3. Click **Add new** (or "Add mirror").
4. Fill in:
   - **Git repository URL:** `git@codeberg.org:<username>/mercyB.git`
     *(replace `<username>` with your Codeberg username from Step 1)*
   - **Mirror direction:** Push
   - **Authentication method:** SSH public key
   - **SSH private key:** paste contents of `~/.ssh/gitlab_codeberg_mirror`
     (the private key — `cat ~/.ssh/gitlab_codeberg_mirror`)
   - **Keep divergent refs:** ✗ (leave unchecked — mirror should match GitLab exactly)
   - **Mirror branches:** All branches (or `main` only is fine)
5. Click **Mirror repository**.
6. GitLab will immediately attempt a test push — watch for the ✓ green status.

### Step 4 — Verify the mirror is live

After clicking "Mirror repository" in Step 3, GitLab shows a mirroring status row.
Wait ~60 seconds, then:

```bash
# On your Mac — check the mirror directly
git ls-remote git@codeberg.org:<username>/mercyB.git HEAD

# Expected output (SHA must match GitLab's current main):
# abc123def...    HEAD
```

Also confirm in the Codeberg UI:
- Open `https://codeberg.org/<username>/mercyB` → you should see the commit history.
- **Commits count must match** `git log --oneline origin/main | wc -l`.

---

## How the mirror stays current

GitLab push-mirrors are **event-driven**: every push to `origin` (GitLab) triggers an automatic mirror push to Codeberg within seconds. No cron job, no manual steps.

Verify after any normal push:
```bash
# After pushing to GitLab, confirm the mirror updated
git ls-remote git@codeberg.org:<username>/mercyB.git main
# SHA must match:
git rev-parse origin/main
```

---

## Recovery procedure (GitLab outage)

If GitLab is unreachable and you need to push code:

```bash
# Add Codeberg as a local remote (one-time, run now so it's pre-staged)
git remote add codeberg git@codeberg.org:<username>/mercyB.git
git fetch codeberg

# During an outage — push directly to the mirror
git push codeberg main
git push codeberg --tags

# After GitLab recovers — push back so GitLab is source-of-truth again
git push origin main
git push origin --tags
```

> **Note:** during a GitLab outage, CI (`.gitlab-ci.yml`) cannot run since
> GitLab Runners are part of the GitLab service. Agent dispatch is also gated.
> Codeberg as a push target gives you a warm code backup, NOT a hot standby CI.
> That tradeoff is intentional per `disaster-recovery.md §6.1` (two providers
> max per layer; this is the recovery provider, not a parallel CI pipeline).

---

## Updating `disaster-recovery.md` cross-reference

Once the mirror is confirmed live, update `docs/runbooks/disaster-recovery.md`:

1. **§1 table** — Repo row "Backup status today": change from "Partial" to
   "**Strong.** Codeberg push-mirror at `git@codeberg.org/<username>/mercyB.git`
   receives every GitLab push automatically; pre-staged `codeberg` remote in
   local clones."
2. **§2.1 step 3** — replace the "Candidates (none currently configured)" note
   with "Push to `codeberg` remote (pre-staged; see `docs/resilience/repo-mirror.md`)."
3. **§5.1** — replace the manual Codeberg snippet with:
   ```bash
   # Mirror is automatic (GitLab push-mirror). For local pre-staging:
   git remote add codeberg git@codeberg.org:<username>/mercyB.git
   git fetch codeberg   # verify it's reachable
   ```

---

## Maintenance

- **No routine action needed.** GitLab push-mirror is automatic.
- **Quarterly check:** run `git ls-remote codeberg main` and compare SHA to `origin/main`.
  If they diverge, go to GitLab → Settings → Repository → Mirroring and click the sync button.
- **If Codeberg changes its SSH host key:** GitLab will fail mirror pushes.
  Remove and re-add the mirror in GitLab settings (takes 2 min).
- **If the Codeberg account ever closes:** create a new private repo on any
  independent Git host (sr.ht, sourcehut, self-hosted Gitea) and repeat Steps 1–4.

---

**Last verified:** 2026-06-11 (initial setup).
**Next quarterly check:** 2026-09-11.
