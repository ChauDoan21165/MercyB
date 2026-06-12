# Netlify deploy posture, false-green verification, and the f30f045 auto-promote incident

Last verified: 2026-06-06

Companion to [`netlify-ship-to-prod.md`](./netlify-ship-to-prod.md), which is now stale. This document remains historical context for the old Netlify lock posture, the verification discipline that proves a deploy actually landed, and the 2026-06-06 incident that motivated both. Current production deploys use the guarded Cloudflare Pages job plus `golden-flows-prod`.

---

## TL;DR

1. **Auto-publish stays LOCKED by default.** Ship via a deliberate manual publish on a chosen build, never by leaving the gate open.
2. **Unlocking auto-publish is not free.** While the production context is unlocked, the **next merge to `main` auto-promotes to prod within seconds** — no human in the loop. That is exactly the auto-promote that shipped `f30f045` on 2026-06-06.
3. **"Merged" is not "deployed", and a Netlify build record is not a published deploy.** A commit can be merged, and Netlify can even *build* it, while prod still serves an older commit.
4. **Never declare a deploy done from the dashboard or the pipeline status alone.** Prove it against the **served bundle**: `version.json` hash + a grep of the changed code in a live chunk, confirmed against the intended commit SHA.

---

## 1. Deploy posture — locked by default, manual publish on a chosen build

### The intended posture

- The Netlify **production context is kept LOCKED**. A locked production context refuses every deploy except a deliberate publish, and pins prod to whatever build is currently published.
- Historical Netlify releases shipped through a GitLab manual publish job that built from the pipeline SHA. That job is retired because it targets the dead origin.
- Current releases ship through the guarded Cloudflare Pages job (`deploy-cloudflare-pages`) on a chosen green `main` pipeline, followed by `golden-flows-prod`.

### What unlocking does (the auto-promote)

Unlocking the production context (Netlify → **Deploys → Locked publish → Unlock auto publishing**) re-opens Netlify's own GitLab integration. From that moment:

> **Every new merge to `main` is auto-built and auto-published to `mercyblade.com` within seconds of the merge** — there is no manual gate, no pipeline `Play` click, and no review step.

On 2026-06-06 the production context was unlocked for ~30 minutes to retry a stuck publish. During that window the MR `fix/speak-followup-depth-and-coherence` merged at `19:50:50Z`; Netlify auto-published the new HEAD `f30f045` at `19:51:10Z` — **20 seconds later** — ahead of any intent to ship it. The re-lock landed *after* that, so prod froze on `f30f045` rather than the intended build. See §3.

**Rule: unlock only for the minimum time needed, publish the one build you want, then re-lock immediately. Treat any merge that lands during an unlocked window as already live in prod.**

### Two deploy-command footguns

- **`--prod-if-unlocked` is a false-green trap.** While the context is locked, `netlify deploy --prod-if-unlocked` exits **0 (green)** but creates an *unpublished* deploy — prod does not move. CI/job goes green while prod stays stale. Do not "fix" a locked-context failure by swapping in this flag; it hides the problem. The real failure message is explicit:
  ```
  Error: Deployments are "locked" for production context of this project.
  ```
  The correct response is: unlock in the dashboard (admin-only), then **retry the same job** (so it stays pinned to the intended SHA), then re-lock.
- **Do not create a new pipeline to deploy** (`glab ci run -b main`). An API/web-sourced pipeline does not match the push/MR rules of the test jobs and can come up empty/jobless. To fire the manual deploy, **trigger the existing push pipeline's manual job in place**:
  ```bash
  glab ci trigger deploy-cloudflare-pages -p <PIPELINE_ID>   # pins to that pipeline's SHA
  # or retry a specific failed/finished job instance (keeps the same SHA):
  glab ci retry <JOB_ID>
  ```
  The job name is `deploy-cloudflare-pages`.

---

## 2. The false-green verification sequence

Run this **before declaring any production deploy done**. It takes under a minute and is the only thing that distinguishes "shipped" from "the dashboard says it built."

### Step 0 — know your target

Pin the exact commit you intend to be live, e.g. `git rev-parse --short <ref>`. Everything below confirms *that specific SHA* is the one prod serves.

### Step 1 — `version.json` hash + buildTime

```bash
curl -s -H 'Cache-Control: no-cache' https://mercyblade.com/version.json
```
```jsonc
{ "version": "...", "hash": "f30f045", "buildTime": "2026-06-06T19:51:10.083Z", ... }
```

- **`hash` is the deployed commit's short SHA.** `scripts/generate-version.js` stamps it with `git rev-parse --short HEAD` at build time, so `version.json.hash` *is* the commit that built the live bundle. If `hash` ≠ your target short SHA, **prod is not on your build** — stop and reconcile.
- **`buildTime`** dates the live build. A buildTime *older* than your merge means your change is not live yet; a buildTime you don't recognize means *something else* shipped (see the incident — a newer, unintended build).

### Step 2 — grep the changed code in the live bundle

The hash proves *which commit* built it; this step proves *the change you care about is actually in the served JavaScript* (guards against cache/CDN edge cases and confirms the fix, not just the SHA).

```bash
# a) fetch the served entry to discover the current hashed chunk names
curl -s https://mercyblade.com/ -o live.html
entry=$(grep -oE '/assets/index-[A-Za-z0-9_-]+\.js' live.html | head -1)
curl -s "https://mercyblade.com$entry" -o entry.js

# b) find the chunk that carries the code you changed, fetch it, grep the behavior
#    (lazy chunks are not in the entry; locate by a unique source string or chunk name prefix)
chunk=$(grep -oE '<FeatureName>-[A-Za-z0-9_-]{8}\.js' entry.js | sort -u | head -1)
curl -s "https://mercyblade.com/assets/$chunk" -o chunk.js
grep -oE '<the new vs old code pattern>' chunk.js
```

Worked instance from 2026-06-06 — confirming the L6 ParentView entitlement fix (MR 455) was live, in chunk `mercy-teacher-tab-*.js`:

| State | `isPremiumTier` in the served bundle |
|---|---|
| **OLD / buggy** | `function O(e){return e==="premium_month"||e==="premium_year"}` |
| **FIXED** | `function O(e){return e!=="level0"}` |

Seeing the fixed form in the live chunk — not just a new `version.json` hash — is what closed the loop.

### Step 3 — confirm against the intended commit

- `version.json.hash` (Step 1) **==** your target short SHA (Step 0), **and**
- the served chunk (Step 2) contains the **new** code, not the old, **and**
- if you must distinguish two close commits, fetch the chunk that differs between them and confirm which variant is served.

Only when all three agree is the deploy "done". A green CI job, a Netlify "build succeeded" line, or a dashboard build row satisfies **none** of these on its own.

### Things that look like done but are not

- **Build record ≠ published deploy.** Netlify can build a commit and list it without publishing it. The published deploy is the one serving `mercyblade.com`; verify by the served `version.json` hash.
- **Merged ≠ deployed.** A merge to `main` only ships automatically while auto-publish is *unlocked*. Locked → it waits for a manual publish.
- **Job green ≠ prod moved.** `--prod-if-unlocked` (or any draft deploy) can exit 0 without publishing.
- **CDN propagation.** If `version.json` shows your hash but a chunk still greps old, re-fetch with `Cache-Control: no-cache` and confirm the entry chunk hash changed; Netlify publishes atomically, so a persistent mismatch means you fetched a stale edge or the wrong chunk.

---

## 3. Worked example — the four-build confusion (2026-06-06)

Within ~18 hours, four distinct builds were in play for one ship. `version.json` + served-chunk grep resolved which was actually live at each step.

| Build (short SHA) | What it was | How it got there | Live? | How we knew |
|---|---|---|---|---|
| **`40bb5b0`** | Pre-fix stale prod (merge `lane-e/family-bridge-grammar-2b`, built `2026-06-06T01:01Z`) | Last build before the incident | Initially **yes**, then superseded | `version.json.hash=40bb5b0`; served chunk had **OLD** `isPremiumTier` (`==="premium_month"||==="premium_year"`) → confirmed the MR 455 fix was NOT live |
| **`feff731`** (`feff731b0`, pipeline #949) | Intended ship — contains the MR 455 ParentView fix | Manual Netlify publish retry after unlock, published `19:21Z` | **Yes**, briefly | `version.json.hash=feff731`; served chunk showed **FIXED** `isPremiumTier` (`!=="level0"`) |
| **`935ca26`** (`935ca264f`, pipeline #950) | Newer HEAD at the time (added the public `/practice/pronunciation` self-compare) | Netlify **built** it (build record at the merge time) but it was **never published** | **No** — build-only | It never appeared as the served `version.json.hash`; prod read `feff731`, then `f30f045`. A build row in the dashboard was mistaken for a publish — it wasn't. |
| **`f30f045`** (`f30f045c3`, current HEAD) | `935ca26` + `fix/speak-followup-depth-and-coherence` | **Auto-promoted**: merged `19:50:50Z`, auto-published `19:51:10Z` during the unlock window | **Yes** (current, locked) | `version.json.hash=f30f045`, `buildTime=19:51:10Z`; served entry chunk changed and the route table still mounted `/practice/pronunciation` |

**Lessons the example encodes:**

- The same fix can be present in several builds (MR 455 is in `feff731`, `935ca26`, and `f30f045`), so a *behavior* grep alone cannot tell which build is live — the **`version.json` hash** is what disambiguates the exact commit.
- `935ca26` proved "build ≠ deploy": it existed as a build record but never served traffic.
- `f30f045` proved the unlock auto-promote: prod jumped past the intended `feff731` to a newer HEAD because a merge landed while unlocked, before the re-lock.
- The only reliable read at every step was **`version.json` hash + served-chunk grep**, never the dashboard's build list.

---

## 4. Quick checklist

Before saying "it's deployed":

- [ ] Production context posture is intentional (locked unless you are mid-publish).
- [ ] `curl /version.json` → `hash` == the commit you meant to ship.
- [ ] `buildTime` is recent and expected (not an older or surprise build).
- [ ] A served chunk greps to the **new** code, not the old.
- [ ] If you unlocked: re-lock now, and check no *other* merge auto-promoted during the window.
- [ ] You triggered the existing pipeline's guarded Cloudflare Pages deploy job and then `golden-flows-prod`.
