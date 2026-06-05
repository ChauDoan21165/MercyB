# Disaster Recovery Runbook

> **Scope:** the playbook for "third-party service [X] is unreachable
> or has locked us out — get MercyBlade back online in under 2 hours."
> Not a daily checklist. Not a drill manual. The reference for
> incidents involving the identity / account / provider layer rather
> than code-level bugs.
>
> **Last verified:** 2026-05-27, post-recovery from the May 26–27
> cascade (GitHub suspension → Vercel migration → Supabase lockout).
> The dates of the three incidents this doc was written against:
> - **2026-05-26** — GitHub account `cd12536` suspended. Repository
>   `gitlab.com:cd12536/mercyB` became the canonical remote (see
>   memory `feedback_response_formatting` history + the `old-origin`
>   GitHub remote retained for read-only forensics).
> - **2026-05-26 / 27** — Vercel migration triggered. The
>   `production-deploy.yml` workflow that was the sole prod-ship path
>   (memory `[[project_vercel_prod_deploy]]`) became stale; the
>   current deploy environment is read from `NETLIFY_CONTEXT` per
>   commit `952d3e9e3 fix(sentry): map deploy environment from
>   Netlify CONTEXT, not stale VERCEL_ENV`. **This doc's "current
>   primary" entries reflect the post-migration state.**
> - **2026-05-27** — Supabase account lockout. Resolved before this
>   doc was written; recovery procedure documented in §2.3 below.
>
> **Why this doc:** none of the three May 26–27 incidents were
> *technical* failures. The product code shipped. The CI pipelines
> ran. The database had the right shape. What broke was the
> **identity / account / provider layer** — the assumption that the
> human who owns the developer accounts can always reach them. This
> runbook treats provider availability as a thing that can fail, the
> same way the application treats database availability as a thing
> that can fail.
>
> **What this doc is NOT:**
> - A drill manual. Drills come later. Reviewing this doc quarterly
>   is enough.
> - A "preemptively migrate everything" plan. Migration is scope
>   creep; the rule is "primary + recovery, two providers max per
>   layer." See §6.
> - A code-level incident runbook. For application bugs, see
>   `.github/workflows/ROLLBACK.md` and the per-system docs at
>   `docs/architecture/systems/`.
> - A complete vendor-shopping list. Where this doc names "candidate
>   providers" it presents 2–3 options with tradeoffs; selection is
>   a future decision, not a foregone conclusion.

---

## §1 Critical dependency map

Every third-party service in the production critical path, ranked
roughly by blast-radius severity. "Critical path" = removing it
breaks at least one user-facing flow.

| Layer | Service | Provides | Blast radius if it dies | Backup status today | Monthly cost (approx) |
|---|---|---|---|---|---|
| Repo | **GitLab** — `gitlab.com:cd12536/mercyB` | Source-of-truth Git remote, MR review, CI runner | All deploys gated; all agent dispatches gated; no new code can land. Existing prod build keeps serving. | **Partial.** The `old-origin` GitHub remote is retained read-only (`git remote -v` shows both); local clones in every worktree carry the full history. No mirror branch on a third host. | $0 (free tier) |
| Hosting | **Netlify** — current primary post-Vercel migration | Edge-hosted SPA, preview deploys, free SSL, branch deploys | Production site offline at `mercyblade.com`. iOS app continues to render the `dist/` shipped inside the Capacitor bundle but cannot serve fresh content. | **Partial.** The previous Vercel project + workflow (`production-deploy.yml`) still exists in repo but is no longer the live path. Cloudflare DNS can be retargeted in minutes. | ~$0–19 (Free / Pro tier) |
| Database | **Supabase** — project `buemdfxyhxunzpgdoqin.supabase.co` | Postgres + Auth + Storage + Edge Functions + Realtime | Every auth flow, every gate, every payment record, every audio fetch. The single biggest single-point-of-failure in the stack. | **Partial → Strong once MR !69 merges.** `supabase/migrations/` (239 files) IS the schema source-of-truth. `supabase/functions/` (110 functions) is in repo. Recent data is currently in Supabase only; MR !69 (`feat/external-pg-dump-nightly`) ships the nightly external `pg_dump` with GPG encryption + rclone upload — see §5.3. | ~$25 (Pro tier) |
| Payments | **Stripe** | Subscription billing, customer portal, webhook events | New checkouts fail; existing subscribers keep access until `current_period_end` per the entitlement contract in `./../architecture/systems/billing-entitlement.md`. **Hidden grace period: weeks of runway.** | **Strong.** The `current_period_end + status` derivation in `src/billing/computeEntitlement.ts` means existing paying users keep full access through Stripe outages until their period naturally expires. | ~2.9% + $0.30/txn |
| DNS | **Cloudflare** — `mercyblade.com` zone | Authoritative DNS, TLS termination, CDN for `room-audio` Storage bucket (per `[[project_supabase_audio_cdn_stale]]`), email routing (`admin@mercyblade.com` → Chau's inbox) | DNS resolution stops → site appears offline globally; CDN cache continues to serve until TTL expires. Email forwarding stops simultaneously. | **None.** Single DNS provider. Zone file is exportable but no live secondary nameserver. | $0 (free tier) |
| Errors | **Sentry** — org `chau-doan`, project `mercyblade-web`, region `us.sentry.io` ([[project_sentry_infra_access]]) | Production error capture, perf instrumentation, source-map de-mangling, RLS alert rules `17072095` / `17072096` | **No user-visible impact.** Errors fall back to `console.*` per the perfInstrumentation contract (`./../architecture/systems/observability.md`). The SDK is route-gated — static legal/marketing pages don't load it. | **Strong by design.** Sentry is breadcrumbs + captureException; both are bounded; loss of Sentry is loss of visibility, not loss of the product. | ~$0–26 (Developer / Team tier) |
| iOS distribution | **Apple Developer / App Store Connect** — bundle ID `com.chaudoan.mercyblade` ([[project_android_urls]]) | iOS app distribution, TestFlight, IAP via RevenueCat | No new iOS releases. Existing installs continue to function (no code-push). | **Partial.** The `ios/` Capacitor shell is in repo. Apple Developer enrollment is the binding identity; an account suspension is recoverable but slow (App Store rule appeals are weeks-long). | $99/yr |
| Android distribution | **Google Play Console** — application ID `com.mercyapps.mercyblade` (locked-divergent from iOS — never align, [[project_android_urls]]) | Android app distribution, internal testing track, billing via Google Play Billing | No new Android releases. Existing installs continue to function. | **Partial.** Same as iOS — `android/` shell in repo; enrollment identity is the binding. | $25 one-time |
| Phoneme scoring | **Azure Speech Services** — accessed via `supabase/functions/azure-phoneme` + `azure-phoneme-stream` | Per-phoneme accuracy scoring for the Speak tab | Speak-tab cloud scoring fails; degrades to local Needleman-Wunsch + Levenshtein fuzzy fallback at `src/lib/pronunciation/scorer.ts:347` (already implemented). User loses per-phoneme detail, keeps top-level score. | **Strong by design.** Local fallback is the contract per the pronunciation pipeline (`./../architecture/system-overview.md` §5). | Pay-as-you-go (~$1/1k requests) |
| Auth (OAuth providers) | **Google / Apple Sign-in** — proxied through Supabase Auth | Convenience sign-in option | Users who signed up via OAuth cannot sign back in if the proxy chain breaks. Email+password users unaffected. | **Strong by design.** Supabase Auth is the canonical auth surface; OAuth is one method among several. See §4. | $0 (included in Supabase Auth) |
| Email | **Resend** — sending domain `mercyblade.com`, from `admin@mercyblade.com` ([[project_sending_address]]) | Transactional + campaign email delivery | Password reset emails stop, gift redeem emails stop, daily admin digest stops. **Auth flow degrades silently if reset email never arrives.** | **None today.** No fallback email provider. The 9 edge functions in `supabase/functions/email-*` all assume Resend. | $0–20 (Free / Pro) |
| LLM (primary) | **OpenAI** — accessed via `supabase/functions/guide-assistant`, `ai-chat`, `ai-reasoning`, `ai-tutor` | Mercy chat replies, grammar correction, English explanation, the production tutor surface (per `./../architecture/systems/ai-tutor.md` §2 layer 1 + `./../architecture/systems/mercy-guide.md` §2 path B) | New tutor replies + grammar fixes fail; existing classified prewritten replies (`mercyGuideReplyLibrary.ts`) keep serving. Crisis pre-gate + rate-limit + AI-disabled response shape ([[`./../architecture/systems/mercy-guide.md` §5]]) all already handle the failure mode — users see a calm "AI temporarily unavailable" not a 500. | **Strong by design.** The prewritten-reply path is the silent fallback; mercy-guide classifier routes top-N intents through it. Outage degrades to "library-only", which is bounded but not broken. No alt LLM wired today. | Pay-as-you-go (~$10–30/day at current scale) |
| LLM (secondary) | **Anthropic** — accessed via `@anthropic-ai/sdk` if/when wired | Currently NOT a runtime dependency for the user-facing tutor flow. Anthropic is used in the developer-side agent fleet (Claude Code) NOT in the production app. | **No production impact** today. Listed for completeness because the agent dispatches that author this codebase are gated on Anthropic. **Lockout from Anthropic stops new agent work but does not break the running product.** | **Strong by design.** Production tutor surface uses OpenAI; Anthropic is dev-tooling. | Pay-as-you-go (~$50–200/mo across the agent fleet) |
| Analytics | **GA4 + Microsoft Clarity + Meta Pixel** | Marketing attribution, behavior replay, ads pixel | **No user-visible impact.** All analytics are best-effort, route-gated, and consent-gated ([[project_marketing_consent_is_tracking]]). | **Strong by design.** Analytics loss is invisible to users. | $0 / free tiers |

**Memory anchors used above:**
`[[project_vercel_prod_deploy]]` `[[project_sentry_infra_access]]`
`[[project_supabase_audio_cdn_stale]]` `[[project_android_urls]]`
`[[project_marketing_consent_is_tracking]]` `[[project_sending_address]]`.

**What's NOT on this list (and why):**
- **Vercel** — was primary hosting until the May 27 migration; now
  treated as the *recovery* host for Netlify (see §2.2).
- **RevenueCat** — proxy for Apple IAP entitlements on iOS, not on
  the web critical path. Outage degrades to "iOS users see Apple
  receipt but app shows free tier briefly until next entitlement
  refresh" — bounded, not catastrophic.
- **The CDN cache** is Cloudflare; Supabase Storage URLs are
  Cloudflare-fronted ([[project_supabase_audio_cdn_stale]]). Already
  in the Cloudflare row above.

---

## §2 Per-provider recovery runbook

For each critical dependency: **"you have 2 hours, get the app back online"** — a numbered checklist.
"2 hours" is the target; some recoveries (Apple, Google Play
re-enrollment) are weeks. Where the recovery is bounded by
external review, document the side-channel that buys time.

### §2.1 GitLab unavailable (repo)

**Failure mode:** `git push origin main` returns 403 / 502 / DNS
fail; MR creation via `glab mr create` fails; CI runners idle.

**Existing belt-and-braces:** every local clone (`/Users/admin/MercyB`
+ every `~/MercyB-*-worktree/`) carries the full Git history. The
`old-origin` GitHub remote is retained read-only for forensics
(`git remote get-url old-origin` — verify before relying).

**Recovery sequence:**

1. **Verify it's GitLab, not the network.** `curl -sI https://gitlab.com`
   → 200 means GitLab is up; the local clone has stale auth.
2. **Try the GitHub mirror as read-only first.** `git fetch old-origin`
   — if the suspension is reversed or this remote is still active,
   you have a recent state to compare against.
3. **Push to a backup remote.** Candidates (none currently
   configured — this is the §1 "Partial" gap):
   - **Codeberg** (free, EU-hosted Gitea fork) — tradeoff: smaller
     community, slower CI options.
   - **sr.ht** (paid, plain-Git focus) — tradeoff: no MR UI as we
     know it; review workflow is mailing-list-style.
   - **A self-hosted Gitea on the same VPS as Netlify** — tradeoff:
     adds an infra-management burden but eliminates the third-party
     identity risk.
4. **Update CI to push to the new remote.** Edit `.github/workflows/`
   workflow YAMLs that reference `origin/main` — none today should
   need changes, but verify `production-deploy.yml`,
   `deploy-edge-functions.yml`, `sync-lessons.yml` (per
   [[project_lessons_autosync_prod]]).
5. **Re-dispatch agent work.** Existing agents whose worktrees were
   tracking `origin` (GitLab) need `git remote set-url origin <new>`
   per worktree. See [[feedback_worktree_gates_node_modules]] for
   the symlink discipline that keeps fresh worktrees cheap.
6. **Document the swap.** Add a top-banner note to `STRATEGY.md`
   §6 + this file's "last verified" date.

**Pre-staged commands** (run BEFORE you need them — see §5):

```bash
# Add a third remote that mirrors GitLab now (no cost on Codeberg / sr.ht)
git remote add backup git@codeberg.org:cd12536/mercyB.git
git push backup main
git push backup --tags
# Re-run weekly via a cron on the laptop (NOT in CI — CI is gated on GitLab today)
```

### §2.2 Netlify unavailable (hosting)

**Failure mode:** `mercyblade.com` returns 5xx; new deploys fail in
the Netlify dashboard or via `netlify deploy --prod`.

**Existing belt-and-braces:** the `dist/` directory inside the
Capacitor iOS/Android shells continues to serve those native users.
The Cloudflare CDN cache for static assets keeps serving until TTL
expires (~5 min for HTML, hours for assets).

**Recovery sequence:**

1. **Verify the failure isn't DNS or CDN.** `dig mercyblade.com` →
   resolves; `curl -sI https://mercyblade.com` → 5xx confirms
   Netlify (vs DNS) is the issue.
2. **Re-deploy to the recovery host.** Candidates:
   - **Vercel** (the pre-migration primary; still has the project
     wired per `vercel.json` in repo). Tradeoff: brings us back to
     the migration we just escaped from; OK as a short-term landing
     pad, not a permanent return. Memory note: PR #681 deleted
     `deploy-with-rollback.yml` per [[project_vercel_prod_deploy]];
     the standard `vercel deploy --prebuilt --prod` still works.
   - **Cloudflare Pages** (same Cloudflare account that owns DNS,
     single-vendor reduction). Tradeoff: ties two layers to one
     vendor; if Cloudflare itself has the outage, you lose both at
     once. Acceptable for emergency-only use.
   - **Render / Fly.io static site** (independent provider).
     Tradeoff: extra account to manage and an extra place that needs
     SSL + DNS attention.
3. **Swap DNS at Cloudflare.** Pre-staged commands in §5.
4. **Re-deploy Capacitor shells if the iOS/Android apps are out of
   date.** See §2.7 (Apple) and §2.8 (Google).
5. **Update Sentry deploy environment.** Per commit `952d3e9e3`, the
   environment is read from `NETLIFY_CONTEXT` (`deploy-preview` /
   `production` / `branch-deploy`). On Vercel rollback this becomes
   `VERCEL_ENV` (`preview` / `production`). The `src/lib/monitoring/`
   environment-mapper needs a short conditional during the transient.

**Pre-staged commands:**

```bash
# Vercel emergency redeploy from any current branch
vercel pull --environment=production
vercel build --prod
vercel deploy --prebuilt --prod

# Cloudflare Pages alternative (assumes the project is created)
# (Use the Cloudflare dashboard for the first-time hookup; CLI for redeploys)
npx wrangler pages deploy dist --project-name mercyblade
```

### §2.3 Supabase unavailable (DB + Auth + Storage + Functions)

**Failure mode:** any of (1) account locked out of the dashboard,
(2) project paused/suspended, (3) DB connection refused, (4) Auth
returns 500, (5) Storage 404s every key.

**This is the highest-impact provider outage** because Supabase
touches every layer of the app simultaneously. The May 27 lockout
established the practice in this section.

**Existing belt-and-braces:**

- **Schema source-of-truth:** `supabase/migrations/` (239 files).
  Every table, RLS policy, index, function is in repo. The deepdive
  at `./../architecture/systems/observability.md` describes how
  migrations apply via SQL Editor (NOT `db push`, per
  [[project_agent_infra_access]] — the unattended SQL path doesn't
  exist).
- **Function source-of-truth:** `supabase/functions/` (110
  functions). Deployed via `deploy-edge-functions.yml`
  ([[project_edge_fn_ci_deploy]]).
- **Service-role key** stored in macOS Keychain as
  `mb-supabase-service-role` ([[project_agent_infra_access]]) — NOT
  in any committed `.env`. Lockout from the dashboard does NOT
  automatically rotate this key; it remains valid for
  service-role-key API calls until manually rotated.
- **Entitlement runway:** `current_period_end` derivation in
  `src/billing/computeEntitlement.ts` means every existing paying
  user continues to see correct entitlement until their
  `current_period_end` ticks, even if Supabase Auth (and therefore
  `getMeEntitlement`) is unreachable mid-session.

**Recovery sequence (account lockout — most common):**

1. **Verify it's not a regional outage.** `curl -sI
   https://buemdfxyhxunzpgdoqin.supabase.co/rest/v1/` → 401 means
   the project is up and the API is responding (your auth is just
   wrong); connection-refused or DNS-fail means the project itself
   is down.
2. **Recover the dashboard account.** Supabase support contact:
   `support@supabase.io`. The May 27 lockout was resolved via this
   path. Side-channel: if the lockout is OAuth-chain related (see
   §4), reset the underlying provider chain first.
3. **Verify the service-role key still works.** `security
   find-generic-password -s mb-supabase-service-role -w | head -c 12`
   — if the key still authenticates against the REST API, you have
   continued write access to the project even while locked out of
   the dashboard.
4. **If the project itself is suspended/destroyed**, see "full DB
   restoration" below.

**Recovery sequence (full DB restoration to alt provider):**

This is the worst case. Candidates for alt-Postgres host:

- **Neon** (Vercel Marketplace partner; PostgreSQL-managed,
  branching DBs). Tradeoff: no built-in Auth/Storage/Functions — you
  rebuild those layers.
- **Render Postgres** (companion to Render hosting). Tradeoff: same
  as Neon — Postgres only.
- **A standard EC2/Hetzner Postgres + GoTrue Docker** (self-host the
  Supabase OSS stack components). Tradeoff: ops burden; the OSS
  components are stable but you own the upgrades.

**Recovery checklist:**

1. **Apply all `supabase/migrations/*.sql` in order** to the new
   Postgres instance. The migrations are timestamp-ordered; apply
   via `psql -f` in chronological order. Some migrations were
   applied manually via SQL Editor and may show drift — see the
   per-CLAUDE.md note "Some migrations were applied manually via SQL
   Editor; CLI state drifts." The most-recent applied state on the
   primary IS the ground truth; the migrations file order is the
   recovery template.
2. **Restore data from the most-recent backup.** Today (2026-05-27)
   no automated `pg_dump` runs against an external store. Going
   forward see §5 for the pre-staged daily-dump command. If no
   backup exists and the primary is unreachable, recent data is
   lost; the schema + the room JSON (~488 files in `public/data/`)
   are the only things preserved. **Storage bucket contents
   (`room-audio` + others) are NOT in repo and may not be
   recoverable.**
3. **Stand up GoTrue (Auth)** at the new host. The Supabase OSS
   GoTrue container speaks the same API as the hosted Supabase
   Auth surface — `src/lib/supabaseClient.ts` just needs the new
   `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`.
4. **Stand up Edge Functions.** All 110 functions in
   `supabase/functions/` deploy via the OSS `supabase functions
   deploy` command against a self-hosted edge-runtime if needed.
5. **Re-create the `room-audio` Storage bucket** as public (per
   CLAUDE.md "Storage bucket is PUBLIC post-Phase-2"). Re-upload
   from whatever backup exists; the bucket is the audio CDN's
   origin so the Cloudflare cache will retain everything until
   purged. **This is where the worst data-loss happens** — without
   a Storage backup, audio for any room not yet cached at the CDN
   is gone.
6. **Update DNS** if needed (if `*.supabase.co` is being replaced
   with a custom domain).
7. **Smoke-test:** sign in, complete a placement question, hit the
   Speak tab, check entitlement, open `/account`.

**Pre-staged commands:**

```bash
# Daily pg_dump to local disk (cron candidate — NOT yet scheduled)
PGPASSWORD="$(security find-generic-password -s mb-supabase-service-role -w)" \
  pg_dump "postgresql://postgres@db.buemdfxyhxunzpgdoqin.supabase.co:5432/postgres" \
  --no-owner --no-acl --format=c \
  --file="$HOME/Backups/mercyb-$(date -u +%Y%m%dT%H%M%SZ).dump"

# Restore to alt Postgres
pg_restore --no-owner --no-acl --dbname="postgresql://user@new-host/db" \
  ~/Backups/mercyb-LATEST.dump
```

**The bigger gap to close:** the `pg_dump` above lives nowhere
today. Adding it as a daily cron (locally or on a backup-only VPS)
is the single highest-leverage hardening move in this entire doc.

### §2.4 Stripe unavailable (payments)

**Failure mode:** Stripe API returns 5xx; webhook deliveries pause;
the customer portal is offline.

**Existing belt-and-braces:** **the entitlement contract**.
`src/billing/computeEntitlement.ts` derives `is_premium` from
`status` + `current_period_end` on the in-DB `subscriptions` row.
Existing paying users keep access through Stripe outages until their
period_end ticks. This is the single most important piece of
"runway" in the stack — Stripe can be down for days and existing
subscribers don't notice. New signups fail; cancellations stop
synchronizing; but the product keeps serving.

**Recovery sequence:**

1. **Check status.stripe.com.** Stripe outages are publicly
   tracked; most are < 30 minutes.
2. **If outage > 4 hours, route new checkouts to a status page.**
   Don't try to migrate payment providers under stress — the
   migration is a months-long compliance/PCI exercise. Display a
   "Premium signup paused; existing access continues" notice.
3. **Verify webhook backlog.** When Stripe recovers, queued webhook
   events deliver in burst — `supabase/functions/apple-iap-sync`,
   `apple-webhook`, `billing-google-attach-purchase`,
   `billing-stripe-change-plan` may see brief spikes. Monitor
   Sentry for handler failures.
4. **Cancellation drift recovery.** During the outage, Stripe-side
   cancellations don't sync to `subscriptions.status`. After
   recovery, run a one-time reconciliation: fetch
   `stripe.subscriptions.list()` and update local rows whose status
   differs.

**Long-term hardening candidates** (NOT done in an outage — this is
a deliberate decision):

- **Paddle** (merchant-of-record model; handles VAT/sales tax for
  EU). Tradeoff: very different API; full integration effort
  ~4–8 weeks; would coexist with Stripe rather than replace it.
- **LemonSqueezy** (same merchant-of-record model). Tradeoff: same.
- **A second Stripe account in a different region.** Tradeoff:
  Stripe outages are usually global; this doesn't help much.

### §2.5 Cloudflare DNS unavailable (DNS)

**Failure mode:** `mercyblade.com` doesn't resolve; users see "site
can't be reached"; email forwarding (`admin@mercyblade.com` → Chau)
breaks; Storage CDN cache continues to serve until TTL expires.

**Existing belt-and-braces:** none today. Single-DNS-provider.

**Recovery sequence:**

1. **Check status.cloudflare.com.**
2. **If the outage is account-level (not infrastructure-level)**,
   the recovery is the same shape as the GitLab case: identity-layer
   problem. Login recovery via Cloudflare's account-support path
   (`support@cloudflare.com`).
3. **If you have a secondary DNS provider configured** (you don't
   yet — see hardening below), switch nameservers at the registrar.
   This is the single command at the registrar dashboard; takes
   minutes but DNS-cache propagation is bounded by the TTL of the
   NS records (typically 24–48h).

**Hardening candidates:**

- **Route 53** (AWS) as a hot-standby DNS, kept in sync via a
  weekly zone-file export from Cloudflare. Tradeoff: adds AWS to
  the stack.
- **DNSimple** (paid, independent). Tradeoff: paid tier; lower
  global PoP coverage than Cloudflare so resolution is slower.
- **Self-host BIND or Knot DNS on the same backup VPS as the
  Codeberg mirror.** Tradeoff: ops burden; need to know what you're
  doing with DNSSEC if you turn it on.

**The cheap fix that closes 80% of the risk:** export the
Cloudflare zone file weekly to `~/Backups/cloudflare-zone-*.txt`.
That's the recovery template even if the secondary provider isn't
hot-standby.

**Pre-staged commands:**

```bash
# Zone file export via Cloudflare API (requires CLOUDFLARE_API_TOKEN
# stored in Keychain, NOT committed)
curl -s "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/export" \
  -H "Authorization: Bearer $(security find-generic-password -s mb-cloudflare-api-token -w)" \
  > "$HOME/Backups/cloudflare-zone-$(date -u +%Y%m%d).txt"
```

### §2.6 Sentry unavailable (errors)

**Failure mode:** errors stop appearing in the Sentry dashboard;
sourcemap uploads fail.

**User-visible impact: none.** This is the lowest-impact provider
in the §1 table. Sentry is a visibility tool, not a
product-delivery tool.

**Recovery sequence:**

1. **Verify it's Sentry, not your network.** Check
   status.sentry.io.
2. **Do nothing else.** Errors fall back to `console.*` for the
   developer console; production stack traces still log to Sentry's
   ingest endpoint and queue locally if the endpoint is unreachable
   (Sentry SDK retry semantics). When Sentry recovers, the backlog
   flushes.
3. **If the outage is account-level** (account locked out), the
   recovery is the same shape as §2.3 — recover the dashboard, the
   SDK keeps reporting in the meantime.

**Hardening:** the auto-fix workflow ([[project_sentry_infra_access]],
PR #627) is the active integration; loss of Sentry doesn't break
the workflow's CI gate because the auto-fix is best-effort.

### §2.7 Apple Developer / App Store Connect unavailable (iOS)

**Failure mode:** `appstoreconnect.apple.com` is down (rare), or
the account is suspended (slow recovery, weeks).

**Existing belt-and-braces:** the `ios/` Capacitor shell is in
repo. Existing app installs continue to function — Apple cannot
remotely revoke a shipped app over a brief outage. The IAP via
RevenueCat ([[feedback_native_work_phasing]] — phased) means even
billing for iOS users works without a fresh App Store Connect
session.

**Recovery sequence (infrastructure outage):**

1. Wait. Apple infrastructure outages are usually < 4 hours.
2. Continue web-side dev (the only thing blocked is iOS submission).

**Recovery sequence (account suspension):**

1. **Contact Apple Developer Support.** The appeal path is
   documented at `developer.apple.com/contact/`. Expedited reviews
   for live-app issues are case-by-case.
2. **Side-channel distribution while suspended.** TestFlight is
   tied to the same developer account → also unavailable. Internal
   beta via Xcode signing-and-distribution to ad-hoc devices is the
   stopgap (Capacitor's `npx cap open ios` opens the Xcode
   workspace, per [[feedback_cap_sync_ios_mechanics]]).
3. **Long-term:** there is no "alt provider" for iOS distribution.
   This is the layer with the most account-identity risk in the
   entire stack — Apple's account-suspension policy has very few
   appeals. Hardening = (a) keep the developer account in good
   standing; (b) maintain Apple Pay receipts (the financial
   relationship signals legitimacy); (c) ensure the account's
   2FA is on the phone you own physically, not on a
   SIM-swappable number — see §3.

### §2.8 Google Play Console unavailable (Android)

**Failure mode:** same as Apple — service outage (rare) or
account suspension (less rare than Apple; Google's automated
suspensions have been a frequent topic).

**Existing belt-and-braces:** `android/` Capacitor shell in repo.
Existing app installs continue. App ID `com.mercyapps.mercyblade`
is locked at first Play publish; permanently divergent from iOS
`com.chaudoan.mercyblade` ([[project_android_urls]]) — **do not
"align" them under any pressure**, the divergence is intentional
and reversing it is impossible.

**Recovery sequence:**

1. **Service outage:** wait, < 4 hours typically.
2. **Account suspension:** Google Play has a dispute process
   accessible from the suspended app's listing. Expedited review is
   not a thing on Google's side; expect 7–14 days.
3. **Side-channel:** APK distribution via GitHub Releases (when
   GitLab Releases is the source) or direct download for advanced
   users. Drops the Play Billing flow → users would need to be
   migrated to web-paywall + RevenueCat receipts.

**Long-term hardening:** Amazon Appstore + Samsung Galaxy Store
have non-zero share in markets that matter (Vietnam diaspora in
Korea/Japan/AU). Tradeoff: per-store review, per-store payment
integration. Not yet investigated; flag as
[[feedback_native_work_phasing]] post-launch work.

### §2.9 Azure Speech (phoneme scoring) unavailable

**Failure mode:** `supabase/functions/azure-phoneme` returns 5xx
from the Azure backend.

**Existing belt-and-braces:** **the local Needleman-Wunsch + Levenshtein
fallback at `src/lib/pronunciation/scorer.ts:347`**. The Speak tab
degrades to "top-level score, no per-phoneme breakdown" silently —
the user sees a score, just not the diagnostic per-phoneme detail.

**Recovery sequence:**

1. Check `status.azure.com` for the Speech-services region. Outages
   are usually < 2 hours.
2. **Do nothing else.** The local fallback handles it.
3. Sentry breadcrumbs in `cloudScorer.ts` will show the failure
   rate spike; monitor for normalization.

**Hardening candidates:**

- **Google Cloud Speech-to-Text.** Tradeoff: different scoring
  semantics; would need adapter work in `cloudScorer.ts`.
- **AssemblyAI**. Tradeoff: per-call cost higher; adapter work.
- **No alt provider needed today** because the local fallback
  exists. The §1 "Strong by design" rating reflects this.

### §2.10 Resend (email) unavailable

**Failure mode:** `supabase/functions/send-email-campaign` /
`send-redeem-email` / `email-broadcast` / etc. all fail.

**Existing belt-and-braces:** none today. Email is a single point
of failure.

**Recovery sequence:**

1. Check `status.resend.com`.
2. **If outage > 4 hours**, swap the SMTP/HTTP API target in the
   `supabase/functions/_shared/` email helpers to an alt provider.
   Candidates:
   - **Postmark** (transactional-only; high deliverability).
     Tradeoff: pricier; no marketing-email helpers.
   - **Amazon SES** (cheap; needs more deliverability setup —
     SPF/DKIM/DMARC; bounce/complaint webhooks).
   - **Mailgun** (similar to Resend in feature set).
3. **Auth email caveat:** password-reset emails route through
   Supabase Auth's built-in SMTP (the Supabase dashboard's SMTP
   config). If Resend is the configured Supabase Auth SMTP, the
   auth flow degrades silently. The Supabase Auth email templates
   per [[project_supabase_auth_email_templates]] are
   dashboard-only; the SMTP config is dashboard-only too.
4. **Track the bounce.** Auth-email failure during the outage means
   some users can't reset passwords; document the affected window
   for manual support outreach when service recovers.

**Hardening candidates:** Resend's webhook to a second provider
mirror would be the cheapest fix; not done today.

### §2.11 OpenAI (LLM, production tutor) unavailable

**Failure mode:** `supabase/functions/guide-assistant` (and the
sibling `ai-chat` / `ai-reasoning` / `ai-tutor` functions) return
5xx from the OpenAI backend, or the API key is revoked / billed
account is suspended.

**Existing belt-and-braces:**
- **The prewritten-reply library** at
  `src/components/mercy-guide/mercyGuideReplyLibrary.ts` (per
  `./../architecture/systems/mercy-guide.md` §2 path A). The mercy-
  guide classifier dispatches the top-N intents to the library
  synchronously; only `api_tutor` route hits OpenAI. During an
  OpenAI outage, library hits keep working; `api_tutor` queries
  return the `aiDisabledResponse` shape (per the guide-assistant
  AI-disabled check at `./../architecture/systems/mercy-guide.md`
  §2 path B step 3).
- **Crisis pre-gate runs BEFORE the LLM call** (`containsCrisisKeywords`
  in `guide-assistant/index.ts`). Self-harm / medical-emergency
  intercepts continue to return `SAFE_RESPONSE` even with the LLM
  unreachable.
- **Rate-limit + AI-enabled checks** all degrade gracefully — the
  shape `{ summary_vi, content_vi, ... }` is returned with a
  Vietnamese-first "AI temporarily unavailable" message rather than
  a 500.

**Recovery sequence:**

1. **Check `status.openai.com`.** Most OpenAI outages are < 2 hours.
2. **If outage > 4 hours**, the library-only mode is the current
   acceptable degraded state. No alt LLM is wired today — wiring
   one in a stressed window is risky (system-prompt assembly,
   safety rails, tier-depth gating all need adapter work).
3. **If the failure is account-level** (key revoked, billing
   suspended), recover via `platform.openai.com` → Billing /
   Settings. OpenAI lockout recovery is identity-layer recovery —
   see §3.
4. **If the outage is > 24 hours and the team decides to swap**,
   the cleanest path is to wire **Anthropic** as the alt LLM
   provider — adapter work fits inside `supabase/functions/_shared/`
   (the `openai` import in each edge function is the only
   provider-coupled surface; the rest of the pipeline is
   provider-agnostic). Tradeoff: ~1–2 days of focused work; cannot
   be done blind under stress.

**Hardening candidates** (NOT done in an outage):
- **Anthropic Claude** (already a dev-tooling dependency — adapter
  cost is the only new work). Tradeoff: different safety-rail
  semantics + cost shape.
- **Google Gemini** (vendor diversity). Tradeoff: different
  prompt-engineering norms; rebuild prompt-quality test set.
- **A self-hosted open-weights model** (e.g. Llama 3.x via Together
  or Replicate). Tradeoff: quality cliff for VI-language Mercy
  voice; not a quick swap.

### §2.12 Anthropic (LLM, agent fleet) unavailable

**Failure mode:** `@anthropic-ai/sdk` calls return 5xx, or the API
key is revoked.

**User-visible impact: NONE.** Anthropic is not on the production
user-facing critical path. It is the LLM that powers the
agent-dispatch fleet (Claude Code) that authors this codebase.

**Recovery sequence:**

1. **The running product is unaffected.** Skip to step 2 only if
   active agent dispatches are blocked.
2. **Pause agent work.** The dispatch protocol can wait; users
   don't.
3. **Recover the Anthropic account** via `console.anthropic.com`.
   Identity-layer recovery; see §3.
4. **If lockout is long-running**, switch agent work to a
   different model provider's CLI (e.g. OpenAI's `codex-cli` if
   available, or self-driven). Tradeoff: the per-agent context
   conventions (CLAUDE.md, memory file format) are
   Claude-Code-specific; switching is a full re-onboarding for
   the agent fleet.

**Why this is in the runbook even though it doesn't affect users:**
the May 26 incident's recovery REQUIRED uninterrupted agent work.
A simultaneous Anthropic lockout during a GitHub-suspension recovery
would have made the cascade much worse. Account-hardening §3 applies
here too.

---

## §3 Identity / account hardening checklist

The May 26 GitHub suspension cascaded because the OAuth chain was
*the* auth path. The lesson: **OAuth is a convenience, not the only
door.**

### §3.1 Audit checklist per paid service

For every service in §1's table, confirm:

| Check | GitLab | Netlify | Vercel | Supabase | Stripe | Cloudflare | Sentry | Apple Dev | Play | Azure | Resend | OpenAI | Anthropic |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Email+password sign-in enabled (NOT just OAuth) | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 2FA via authenticator app (NOT SMS) | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Recovery email is NOT a Gmail aliased to the same Google account that signs in | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Password reset path tested in the last 90 days | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Recovery codes stored offline (paper or password manager export) | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Support contact path documented | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

Fill these in after the first quarterly review; they are deliberately
left blank in the inaugural version of this doc to force the
exercise.

### §3.2 Why SMS 2FA is forbidden

SIM-swap attacks. The phone number is a shared resource controlled
by the carrier — a social-engineering attack against the carrier
gives an attacker the 2FA codes. Authenticator apps (Authy, 1Password,
Apple/Google native authenticators) bind to the device, not the
phone number.

**Exception:** services that ONLY support SMS 2FA (some older
providers still do). For those: enable SMS as last-resort + use the
provider's recovery codes as the primary recovery path.

### §3.3 Recovery-email rule

**The rule:** the recovery email for `service-A` must NOT be an
address that itself authenticates via `service-A` or via a service
whose chain includes `service-A`. Concretely:

- ✘ GitHub recovery email = `chau@gmail.com`, and Gmail signs in
  via Google OAuth which proxies through GitHub. Circular.
- ✓ GitHub recovery email = `chau-backup@protonmail.com`, which
  has its own password and its own 2FA.

The May 26 GitHub suspension exposed exactly this class of bug
because the developer-account graph at most companies converges
into 1–2 Google accounts.

### §3.4 Support contact path per service

| Service | Primary contact | Side channel |
|---|---|---|
| GitLab | support@gitlab.com | GitLab forum, Twitter @gitlab |
| Netlify | support@netlify.com (Pro tier+); community forum (free) | Twitter @netlify |
| Vercel | help@vercel.com (Pro+); Discord (community) | Twitter @vercel |
| Supabase | support@supabase.io | Discord, GitHub Discussions |
| Stripe | support.stripe.com (in-dashboard); status.stripe.com | Twitter @stripe |
| Cloudflare | dash.cloudflare.com → Support; community.cloudflare.com | Twitter @CloudflareHelp |
| Sentry | support@sentry.io | sentry-talk Discord |
| Apple Developer | developer.apple.com/contact/ | (slow; usually no side channel) |
| Google Play | play.google.com/console/about/support | (slow; usually no side channel) |
| Azure | portal.azure.com → Support | azure.status.com |
| Resend | support@resend.com | Discord |
| OpenAI | help.openai.com (in-dashboard); status.openai.com | Twitter @OpenAIDevs |
| Anthropic | support@anthropic.com; status.anthropic.com | Twitter @AnthropicAI |

Update these the moment a service routes a real support ticket
elsewhere — vendor support-channel routing changes.

---

## §4 The "single OAuth provider" lesson

**What happened (2026-05-26):** the GitHub account `cd12536` was
suspended. The suspension cascaded:

1. **Vercel** uses GitHub OAuth as one of its sign-in options. The
   developer account's primary auth path was GitHub-OAuth. Vercel
   sign-in failed.
2. **Supabase** also offered GitHub-OAuth as a sign-in path. The
   migrate-Vercel-to-something-else recovery path was blocked
   because Supabase login was also gated on the same OAuth chain.
3. **The recovery email** for some of these accounts was a Gmail
   account itself signed in via a Google account that was tied to
   the same identity graph. (See §3.3.)

The recovery (over 36 hours) required:

- Spinning up a new Git host (GitLab) and force-mirroring the repo.
- Re-enrolling Vercel under email+password where possible, or
  migrating to Netlify where not.
- Recovering the Supabase account via direct support-channel email
  with proof-of-ownership.

### §4.1 The rule

> **OAuth is a convenience option. Every paid service must have
> email+password sign-in enabled and password-reset tested.**

This is a one-line policy. The checklist in §3.1 is the enforcement.

### §4.2 Why this rule and not "always log in via email+password"

Email+password is itself a chain — it relies on the email provider's
availability + the password manager's availability. The point is
NOT to pick one perfect auth method. The point is **never let any
single provider be the only door.** Two doors → either-or
availability. One door → outage probability multiplies through every
service in the chain.

### §4.3 The audit deliverable

After the first quarterly review of this runbook, every cell in §3.1's
matrix must be ticked. Cells that are NOT tickable (the service
doesn't support email+password, etc.) become hardening tickets in
their own right: switch to an alt provider, or document the
unavoidable risk.

---

## §5 Pre-staged migration scripts

These are the scripts you want **already on the developer machine**
when an incident starts. Running them under stress is fine; writing
them under stress is the failure mode this doc exists to prevent.

### §5.1 GitLab → backup mirror

```bash
# Add the backup remote once
git remote add backup git@codeberg.org:cd12536/mercyB.git

# Mirror weekly via cron
git fetch origin
git push backup main
git push backup --tags
```

### §5.2 Cloudflare DNS zone export

```bash
# Requires Cloudflare API token in Keychain (NOT committed)
TOKEN="$(security find-generic-password -s mb-cloudflare-api-token -w)"
ZONE_ID="<your zone id>"
mkdir -p "$HOME/Backups"
curl -s "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/export" \
  -H "Authorization: Bearer ${TOKEN}" \
  > "$HOME/Backups/cloudflare-zone-$(date -u +%Y%m%d).txt"
```

### §5.3 Supabase Postgres daily dump

> **Cross-reference: MR !69** (`feat/external-pg-dump-nightly` —
> "nightly external Postgres backups, GPG-encrypted, rclone-uploaded").
> C7's in-flight infrastructure MR ships the productionized version
> of this command — a nightly cron with GPG encryption + rclone upload
> to off-Supabase storage. The bash below is the minimal local-only
> form to run by hand under stress; **once !69 merges, the productionized
> path replaces this snippet** and this section should be updated to
> "Run by hand only if the nightly job has failed to write for ≥ 36 h."

```bash
# Local manual form — requires service-role key in Keychain
# (per [[project_agent_infra_access]]). For the productionized
# nightly cron + GPG encryption + rclone upload, see MR !69.
PG_PWD="$(security find-generic-password -s mb-supabase-service-role -w)"
mkdir -p "$HOME/Backups"
PGPASSWORD="${PG_PWD}" pg_dump \
  "postgresql://postgres@db.buemdfxyhxunzpgdoqin.supabase.co:5432/postgres" \
  --no-owner --no-acl --format=c \
  --file="$HOME/Backups/mercyb-$(date -u +%Y%m%dT%H%M%SZ).dump"

# Retention: keep last 30 dumps
find "$HOME/Backups" -name 'mercyb-*.dump' -mtime +30 -delete
```

**Why daily, not hourly:** the user-data churn on a ~100-user app
is bounded; daily dumps cost ~50 MB/day at current scale.
Cost-of-storage << ops-burden-of-hourly. !69's productionized cron
runs nightly for the same reason.

### §5.4 Supabase project link (for alt-project restoration)

```bash
# After standing up an alt Supabase project (or self-hosted)
cd /tmp
supabase login   # uses dashboard OAuth — must work
supabase link --project-ref <NEW_PROJECT_REF>

# Apply repo migrations (chronological order)
for f in supabase/migrations/*.sql; do
  psql "$NEW_DATABASE_URL" -f "$f"
done

# Restore latest dump
pg_restore --no-owner --no-acl \
  --dbname="${NEW_DATABASE_URL}" \
  "$HOME/Backups/mercyb-LATEST.dump"
```

### §5.5 Netlify emergency deploy

```bash
# Build artifact must exist; if not, npm run build first
netlify deploy --prod --dir=dist --auth="${NETLIFY_AUTH_TOKEN}"
```

### §5.6 Vercel emergency redeploy (recovery host)

```bash
vercel pull --environment=production --token="${VERCEL_TOKEN}"
vercel build --prod
vercel deploy --prebuilt --prod --token="${VERCEL_TOKEN}"
```

### §5.7 Cloudflare DNS swap (origin host change)

The actual DNS swap happens at the Cloudflare dashboard for
defensive reasons (UI confirmation prevents typos). The
pre-staged COMMAND below verifies the swap took effect:

```bash
dig +short mercyblade.com A   # should show the new origin IP
curl -sI https://mercyblade.com | head -3   # should 200 from new host
```

Cloudflare's API also supports DNS edits via `curl`; the dashboard
is the recommended path for an irreversible change.

---

## §6 What NOT to do

The temptations under incident stress are predictable. The rules
below are the defenses against them.

### §6.1 Don't migrate preemptively

After a Vercel outage, the impulse is "migrate everything to
Netlify + Render + Cloudflare Pages, never depend on one vendor
again." This is **scope creep dressed as risk management**.

The right move is: **primary + recovery, two providers max per
layer**. Three providers per layer is a permanent ops burden that
exceeds the incident-cost it averts.

### §6.2 Don't add five providers

For every layer in §1, the answer is "one primary + one tested
recovery path." If you can't articulate the recovery path in <20
lines of this doc, you don't have one — you have a vague
intention.

### §6.3 Don't run this runbook routinely

This is a runbook, not a drill manual. Running through it
quarterly to verify the contact paths still work is enough.
Running through it as a "monthly disaster drill" is overhead that
the ~100-user current scale doesn't warrant. **Drills come at
launch + 1000 users + meaningful revenue**, not before.

### §6.4 Don't conflate "outage" with "lockout"

The recovery procedure for "Stripe is down" is different from
"my Stripe account is suspended." §2.x sections distinguish them
where it matters (Supabase §2.3 has both branches). When an
incident lands, identify which class it is in the first 10 minutes
— the recovery path differs by hours.

### §6.5 Don't burn through recovery codes

Each service ships ~10 single-use recovery codes for the
2FA-locked-out path. Each is a one-shot — once used, it's gone.
The temptation under stress is to use one to unblock a
non-emergency task; resist. Recovery codes are the last resort.

### §6.6 Don't trust the "we'll get back to you in 1 business day"

Apple and Google support response times are documented as 1 business
day; the actual first-touch is often 7–14 days for non-paying
accounts, longer for accounts with active suspensions. Plan
recovery timelines accordingly.

---

## §7 Update cadence

This doc is **quarterly-reviewed OR after any incident** — whichever
comes first. Each row in §1's dependency table, each cell in §3.1's
matrix, each command in §5 has a "last verified" date.

### §7.1 Quarterly review checklist

1. **Re-verify each service is still in the critical path.** Some
   services are sunset (e.g. Microsoft Clarity was added in 2025;
   could be deprecated by 2027). Some are added (BotID, for
   example, per `vercel:knowledge-update` skill).
2. **Re-test one support contact path per quarter.** Don't test all
   at once — providers throttle.
3. **Re-test the password reset path on one paid service per
   quarter.** Rotate through.
4. **Re-run §5.3 (pg_dump) and verify the restore on a throwaway
   target.** A dump that doesn't restore is not a backup.
5. **Re-export the Cloudflare zone file** (§5.2).
6. **Diff this doc against `STRATEGY.md` §6** — the strategy doc
   names the live product; if this runbook references a service the
   strategy no longer cares about, prune.
7. **Bump the "last verified" date at the top of this doc.**

### §7.2 Post-incident review

After any incident invokes this runbook:

1. Document the incident under `reports/incident-YYYY-MM-DD.md` with:
   - First-symptom timestamp
   - First-recognition timestamp (when the team realized "this is
     X-provider")
   - First-action timestamp
   - First-restore timestamp
   - The §2.x step that turned out to be the load-bearing one
2. Update this runbook with anything the incident exposed:
   - Missing contact paths
   - Steps that didn't work as documented
   - Hardening opportunities surfaced
3. Run the next quarterly review immediately — don't wait for the
   calendar.

### §7.3 The completeness test

> "Take this doc to a fresh contractor who has read CLAUDE.md +
> STRATEGY.md but has never touched the MercyBlade stack. Could
> they execute §2.3 (Supabase recovery) end-to-end with no other
> human input? If not, what's missing?"

This is the read of "complete." Currently NO — §2.3 references
service-role keys in the local Keychain that a contractor doesn't
have. Closing this gap is a separate piece of work (account-handover
runbook) that pairs with this doc.

### §7.4 The "STRATEGY.md scope diff" test

Run `git log --since="3 months ago" -- STRATEGY.md` and read every
commit. For each strategic addition (new `layer-model.md` step, new §15 bar,
new product surface): is there a critical-path dependency this
runbook doesn't mention yet? If yes, add the row to §1 + write the
§2.x recovery.

---

## §A Memory anchors index

In line with the brief, this doc cites the following session-memory
entries:

- [[project_vercel_prod_deploy]] — Vercel was PRO + `production-deploy.yml` was sole prod-ship; current state post-Netlify-migration.
- [[project_agent_infra_access]] — service-role key in macOS Keychain `mb-supabase-service-role`; RLS via SQL Editor not `db push`; weekend security backlog cleared 2026-05-18.
- [[project_sentry_infra_access]] — org `chau-doan`, project `mercyblade-web`, region `us.sentry.io`; token in Keychain `mb-sentry-auth-token`; 2 RLS alert rules (17072095 / 17072096) created 2026-05-18.
- [[project_android_urls]] — Android app ID `com.mercyapps.mercyblade` locked-divergent from iOS `com.chaudoan.mercyblade` — never align.
- [[project_supabase_audio_cdn_stale]] — room-audio bucket is Cloudflare-fronted; cache-bust verify probes.
- [[project_marketing_consent_is_tracking]] — tracking consent is per-device localStorage, NOT email opt-out.
- [[project_sending_address]] — use `admin@mercyblade.com` for all MercyBlade emails.
- [[project_lessons_autosync_prod]] — language-lesson `.ts` merges to main auto-sync to prod Supabase via `sync-lessons.yml`.
- [[project_edge_fn_ci_deploy]] — `deploy-edge-functions.yml` (PR #669) is the real deploy + drift pipeline.
- [[project_supabase_auth_email_templates]] — Auth emails are dashboard-only; MUST keep `{{ .Token }}` for OTP entry.
- [[feedback_native_work_phasing]] — web-only today; defer native PR work to ~2-4wk pre-submission.
- [[feedback_worktree_gates_node_modules]] — symlink main repo's `node_modules` into fresh worktrees for gate runs.
- [[feedback_cap_sync_ios_mechanics]] — `cap sync ios` needs throwaway gitignored `dist/index.html` placeholder; `Podfile` + `Podfile.lock` are tracked.

---

## §B Cross-references

- `./../architecture/system-overview.md` — the 24-system table this
  doc's §1 cross-references for blast-radius framing.
- `./../architecture/systems/billing-entitlement.md` — the
  `current_period_end + status` entitlement contract that gives
  Stripe outages weeks of runway.
- `./../architecture/systems/observability.md` — the Sentry SDK
  contract; explains why §2.6 (Sentry outage) has no user-visible
  impact.
- `./../architecture/systems/native-shells.md` — the Capacitor
  iOS/Android shells; the source for the §2.7 / §2.8 recovery
  framings.
- `.github/workflows/DEPLOYMENT.md` — the deploy-workflow runbook
  (currently references Vercel; stale per the Netlify migration —
  needs an update of its own).
- `.github/workflows/ROLLBACK.md` — the application-rollback
  runbook (code-level incidents, separate concern from this doc).
- `./placement-to-lesson.md` — the existing per-flow runbook
  (separate concern; informs the per-flow tone of §2.x sections).
- `STRATEGY.md` §6 — the live-product inventory this doc's §1
  must stay in sync with.

---

**End of runbook.** Next quarterly review due: **2026-08-27**.
