# Pre-launch checklist — Stage 3 launch morning

The single tickable document Chau (or any tester) runs **the morning of launch**, on a real device, **before any post goes live**.

Total time budget: **~20 minutes**. If a phase exceeds its budget by more than 2x, stop and triage — something is wrong upstream of the launch itself.

> **Hard rule.** If any **abort criterion** in a phase below trips, **do not launch**. Fix first, then re-run the affected phase. The launch is not a deadline; the working product is.

This file does NOT generate any post, does not commit any code, and does not require any source change to run. It is a tester's worksheet.

---

## §0 Pre-flight (1 min)

Before starting Phase 1, write the launch context at the top of your run:

| Field | Value |
|---|---|
| Tester name | ______________________ |
| Date (ICT + local) | ______________________ |
| Build / commit (`git rev-parse --short HEAD` on `main`) | ______________________ |
| Real device used | (e.g. iPhone 14 Safari / Pixel 7 Chrome / DevTools 375×812) |
| Hosting target | Netlify production (`mercyblade.com`) — current per [`docs/runbooks/disaster-recovery.md`](../runbooks/disaster-recovery.md) §1 |
| Last good Netlify deploy ID (filled in Phase 5) | ______________________ |
| Rollback authority | Chau only |

**Network:** prefer LTE / 5G on the actual phone, not the home Wi-Fi. The launch audience will not be on your home Wi-Fi.

---

## §1 Phase 1 — Tech health (5 min)

Goal: production is reachable and the four user-facing entry points render without crashing.

### 1.1 Apex + www resolve

```bash
dig +short mercyblade.com A
dig +short www.mercyblade.com A
```

| Check | Expected | Actual | Pass / Fail |
|---|---|---|---|
| Apex returns an IPv4 | non-empty | | ☐ |
| `www` either returns an IPv4 or CNAMEs to apex | non-empty | | ☐ |

**Abort criterion:** either returns empty. DNS is broken. See [`disaster-recovery.md`](../runbooks/disaster-recovery.md) §2.5.

### 1.2 Production HTTPS responds

```bash
curl -sI https://mercyblade.com | head -3
curl -sI https://mercyblade.com/weak-at | head -3
```

| Check | Expected | Actual | Pass / Fail |
|---|---|---|---|
| Apex `/` returns `HTTP/2 200` | 200 | | ☐ |
| `/weak-at` returns `HTTP/2 200` (Netlify SPA rewrite serves the same `index.html`) | 200 | | ☐ |
| `content-type` includes `text/html` for both | `text/html; charset=utf-8` | | ☐ |

**Abort criterion:** non-2xx from either path. See [`disaster-recovery.md`](../runbooks/disaster-recovery.md) §2.2 (Netlify) and §2.5 (Cloudflare).

### 1.3 Netlify deploy status green

Open the Netlify dashboard for the `mercyblade` site → **Deploys**. Confirm the topmost deploy is:

| Check | Expected | Actual | Pass / Fail |
|---|---|---|---|
| State = **Published** (green dot) | Published | | ☐ |
| Commit SHA on the deploy === `git rev-parse main` locally | match | | ☐ |
| No "Failed" deploy in the most recent 3 | none failed | | ☐ |

**Note:** the iOS / Android Capacitor shells continue to serve their bundled `dist/` regardless of web deploy state ([`disaster-recovery.md`](../runbooks/disaster-recovery.md) §2.2 — "iOS app continues to render the `dist/` shipped inside the Capacitor bundle"). A web-side red here does NOT mean the native app is broken; it does mean web users see a stale or 5xx page.

**Abort criterion:** topmost deploy is **Failed** or **Building** (in progress). Wait for build to settle or trigger a re-deploy.

### 1.4 Routes render without crash (real device)

On your phone (or DevTools 375×812 per [`docs/stage-3a/marketing-screenshot-spec.md`](../stage-3a/marketing-screenshot-spec.md) §2), visit each route, watch for blank screen / spinner-of-death / React error boundary:

| Route | What should render | Expected | Pass / Fail |
|---|---|---|---|
| `/` (Marketing landing) | `MarketingLandingPage` hero, three trust columns, `Tôi học ngoại ngữ` CTA | populated, no console errors | ☐ |
| `/weak-at` | `LocalWeaknessMap` + `SuggestedPracticeList` (empty-state copy OK on a fresh device) | populated or empty-state, never crash | ☐ |
| `/onboarding` | Picker, `direction=vn` toggle | populated | ☐ |
| `/account` (anon → redirect) | Sign-in surface | redirects to sign-in, no error | ☐ |

**Abort criterion:** any route shows a React error boundary, a hung spinner > 5 s, or a blank `<body>`.

### 1.5 Sign-in flow smoke

| Check | Expected | Actual | Pass / Fail |
|---|---|---|---|
| Anonymous → `/account` → "Đăng nhập" tap → email field accepts input | accepts | | ☐ |
| Existing known account (Chau's test account) signs in successfully | session established | | ☐ |
| `/account` post-sign-in renders email + tier badge | populated | | ☐ |
| Sign out → returns to anon state | clean | | ☐ |

If reset-email is needed: confirm Resend is up via the Resend dashboard. If reset-email is broken silently, see [`disaster-recovery.md`](../runbooks/disaster-recovery.md) §2.10 + §2.3 note on the Supabase Auth SMTP config.

**Abort criterion:** sign-in fails on a known-good account. Auth broken at launch = users cannot use a paid product.

### 1.6 Sentry receiving events (one synthetic breadcrumb)

The Sentry SDK is route-gated — static legal/marketing pages may not load it. Use `/weak-at` or any signed-in page so Sentry is initialized.

In the device's browser DevTools console:

```javascript
// Confirm SDK loaded:
window.Sentry?.getClient?.() ? 'sentry-ok' : 'sentry-missing'

// Fire a synthetic message (NOT an exception — captureMessage avoids
// noising the error alert channels):
window.Sentry?.captureMessage('prelaunch-smoke-' + Date.now(), 'info')
```

Then open Sentry → org `chau-doan` → project `mercyblade-web` ([[project_sentry_infra_access]]) → Issues → "All" → filter by level=info, last 5 minutes.

| Check | Expected | Actual | Pass / Fail |
|---|---|---|---|
| Console shows `sentry-ok` | `sentry-ok` | | ☐ |
| Sentry dashboard shows the `prelaunch-smoke-...` message within 60 s | visible | | ☐ |
| Environment tag on the event === `production` (mapped from `NETLIFY_CONTEXT` per commit `952d3e9e3`) | `production` | | ☐ |

**Abort criterion:** SDK is `sentry-missing` on a route that should load it (any signed-in page or `/weak-at`). Errors during the launch window will be invisible to triage. See [`disaster-recovery.md`](../runbooks/disaster-recovery.md) §2.6 — the product still works, but you lose visibility.

**Not an abort criterion:** the test message takes > 60 s to appear (Sentry ingest lag) AND `sentry-ok` is true. Wait 5 min, recheck once.

---

## §2 Phase 2 — Content correctness (5 min)

Goal: the surface that appears in the launch screenshot looks **exactly** like the spec.

### 2.1 Seed the device

On the device (or DevTools), paste the seed block from one of:

- [`docs/stage-3a/marketing-screenshot-spec.md`](../stage-3a/marketing-screenshot-spec.md) §1 — for the **diagnostic-frame** asset.
- [`docs/stage-3b/marketing-screenshot-spec.md`](../stage-3b/marketing-screenshot-spec.md) §1 — for the **prescriptive-frame** asset (different tag distribution; gives 3 distinct rows).

Reload `/weak-at` after pasting. Confirm:

| Check | Expected | Actual | Pass / Fail |
|---|---|---|---|
| All 3 `mb.stage3a.*` keys present (DevTools → Application → Local Storage) | `mb.stage3a.l1.recent`, `mb.stage3a.placement.snapshot`, `mb.stage3a.pronunciation.recent` | | ☐ |
| `LocalWeaknessMap` shows all 3 sections (Lỗi ngữ pháp, Kết quả kiểm tra, Phát âm) — no skeleton | 3 populated sections | | ☐ |
| `SuggestedPracticeList` shows exactly 3 rows (3b seed) | 3 rows | | ☐ |

**Abort criterion:** any section shows a skeleton > 3 s or an empty-state when seed was applied — `localStorage` write failed silently (private browsing, quota exceeded, wrong origin).

### 2.2 Bilingual labels render

Per [`docs/stage-3b/qa-test-plan.md`](../stage-3b/qa-test-plan.md) §7 — **both** VI and EN labels render on every row of `SuggestedPracticeList`; there is no per-language toggle on this surface.

| Check | Expected | Actual | Pass / Fail |
|---|---|---|---|
| Header reads `Gợi ý luyện tập` / `Suggested practice` | both languages | | ☐ |
| Every row: VI label (top, bold) + EN subtitle (under, smaller, gray) | both per row | | ☐ |
| Empty-state copy bilingual | `Chưa có gợi ý — …` + `Suggestions appear after a few lessons.` | | ☐ |

**Abort criterion:** any row shows only one language. Regression — file an issue and link `qa-test-plan.md` §7.

### 2.3 Row navigation per `practiceRoutes.ts`

Per [`docs/stage-3b/qa-test-plan.md`](../stage-3b/qa-test-plan.md) §2 — tap each row in turn:

| Row | Expected destination | Actual | Pass / Fail |
|---|---|---|---|
| L1 (indigo BookOpen, *Ngữ pháp*) | `/ai-tutor?focus=vi_l1_3rd_person_s` (with the 3b seed) | | ☐ |
| Placement (amber ClipboardList, *Trình độ*) | `/placement/results` | | ☐ |
| Pronunciation (teal Volume2, *Phát âm*) | `/practice/phoneme/th` (via `TH_T → th` mapping) | | ☐ |

Back-navigate between each tap.

**Not an abort criterion:** a destination is a `console.log` stub if you are on a pre-handoff build. Note in the worksheet — don't ship a "tap goes to a drill" follow-up video against this build per [`stage-3b/marketing-screenshot-spec.md`](../stage-3b/marketing-screenshot-spec.md) §6.

### 2.4 Console clean on public routes

Open DevTools console. Visit `/`, `/weak-at`, `/onboarding` in turn. Reload each.

| Check | Expected | Actual | Pass / Fail |
|---|---|---|---|
| Zero `console.error` rows | 0 | | ☐ |
| Zero red `[Sentry]` SDK init errors | 0 | | ☐ |
| `console.warn` rows are pre-existing (audio resolver fallbacks, etc.) and not new | unchanged baseline | | ☐ |

**Abort criterion:** a new `console.error` introduced in the head of `main`. New JS-side regression — investigate the most recent few commits before launching.

### 2.5 Screenshot composition matches the spec

Per [`docs/stage-3a/marketing-screenshot-spec.md`](../stage-3a/marketing-screenshot-spec.md) §3 (or stage-3b §3 if capturing that asset):

| Check | Expected | Actual | Pass / Fail |
|---|---|---|---|
| Viewport at 375×812 (iPhone 13 mini) | 375×812 | | ☐ |
| VI-primary headings visible: *Điểm yếu của bạn*, *Lỗi ngữ pháp*, *Kết quả kiểm tra*, *Phát âm* | all 4 | | ☐ |
| No gamification words (streak, XP, hearts, "keep going" loops) | none | | ☐ |
| No PII visible (no email, no real name, no session ID > "seed-marketing-screenshot") | none | | ☐ |
| No Supabase loading indicator visible | none | | ☐ |
| For 3b asset: *Gợi ý luyện tập* card with 3 kind chips (indigo / amber / teal), Phát âm row shows ~68% rationale | matches | | ☐ |

**Abort criterion:** any of the four heading strings is missing, OR PII visible, OR gamification words present. The screenshot's job is the diagnostic / prescriptive frame contrast — anything else dilutes.

---

## §3 Phase 3 — Privacy verification (3 min, Chau's job)

Goal: confirm the privacy claim the launch is going to make is **literally true on the device**.

Per [`docs/stage-3b/qa-test-plan.md`](../stage-3b/qa-test-plan.md) §6 and [`docs/launch/landing-page-variants.md`](./landing-page-variants.md) Variant C trust-strip claims — `/weak-at` issues **zero** outbound HTTP. Phase 3 verifies that on the launch-day build.

### 3.1 Network panel — zero remote calls during `/weak-at`

DevTools → **Network** → click **clear** → enable **Preserve log** → set filter to **Fetch/XHR**.

1. Hard-reload `/weak-at` (Cmd-Shift-R / Ctrl-Shift-R).
2. Scroll through the surface for ~5 s.
3. Inspect the Network panel.

| Check | Expected | Actual | Pass / Fail |
|---|---|---|---|
| Requests to `*.supabase.co` | **0** | | ☐ |
| Requests to `/api/*` (app-owned endpoints) | **0** | | ☐ |
| Requests to `*.openai.com` / `*.anthropic.com` / `*.azure.com` | **0** | | ☐ |
| GA4 / Pixel / Clarity beacons (`google-analytics.com`, `clarity.ms`, `connect.facebook.net`) | **0** unless marketing-consent toggled on for this device | | ☐ |

**Note on tracking beacons:** GA4 + Clarity + Pixel are consent-gated per [[project_marketing_consent_is_tracking]]. If you are testing on a device that has the consent toggle ON (you specifically enabled it in `/account` → Privacy), beacons WILL fire — that is correct. For the launch-day privacy claim, test on a device with consent OFF (default state).

**Abort criterion:** any request to `*.supabase.co` or any `/api/*` endpoint during `/weak-at`. The launch caption (per [`landing-page-variants.md`](./landing-page-variants.md) Variant C) claims "0 yêu cầu" — the claim must be true.

### 3.2 localStorage only carries allowed keys

DevTools → **Application** → **Local Storage** → `https://mercyblade.com`.

| Check | Expected | Actual | Pass / Fail |
|---|---|---|---|
| Keys matching `mb.stage3a.*` (3 of them after seed) | present | | ☐ |
| Key `mb.stage3b.viewCount` (after at least one populated `/weak-at` render) | present, integer string | | ☐ |
| **No** keys matching `mb.marketing.*` | absent | | ☐ |
| No long opaque-looking JWT-shaped values outside Supabase auth keys (`sb-buemdfxyhxunzpgdoqin-auth-token` is expected if signed in) | only known keys | | ☐ |

**Abort criterion:** a `mb.marketing.*` key exists — that namespace is explicitly rejected per [`measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) "A `mb.marketing.*` localStorage namespace — REJECTED". If a future feature added it, the privacy claim drifts.

---

## §4 Phase 4 — Post-ready (2 min)

Goal: the asset and caption are spec-shaped and the inbound URL is correctly tagged.

### 4.1 Screenshot / video captured per spec

| Check | Expected | Actual | Pass / Fail |
|---|---|---|---|
| File saved as `stage-3a-launch.png` and/or `stage-3b-launch.png` (per the respective `marketing-screenshot-spec.md` §3 step 7) | saved | | ☐ |
| Capture is full viewport (3a) or visible viewport with scroll (3b §3 step 7) | matches spec | | ☐ |
| Reviewed against §2.5 above (PII / gamification / Supabase indicators) | clean | | ☐ |

### 4.2 Caption drafted from the content kit

Use the framing copy from the relevant spec — do NOT rewrite under launch-day pressure.

| Asset | VI caption source | EN caption source |
|---|---|---|
| 3a (diagnostic) | [`docs/stage-3a/marketing-screenshot-spec.md`](../stage-3a/marketing-screenshot-spec.md) §4 | same file, §4 |
| 3b (prescriptive) | [`docs/stage-3b/marketing-screenshot-spec.md`](../stage-3b/marketing-screenshot-spec.md) §4 | same file, §4 |

| Check | Expected | Actual | Pass / Fail |
|---|---|---|---|
| VI caption pasted **verbatim** (no on-the-fly edits) | exact | | ☐ |
| For TikTok-VN / Zalo: **VI only**, no EN line | VI-only | | ☐ |
| For Facebook diaspora: VI primary + EN secondary, blank line between | both | | ☐ |
| Hashtags per platform (TikTok: `#hocTiengAnh #nguoiViet #IELTS #TiengAnhCoBan #MercyBlade`) | match spec §5 | | ☐ |

**Abort criterion:** the caption claims an outcome ("learners improved by X%", "boost your IELTS score") that the asset cannot back up. Per both spec §6 — *not an outcome-claim asset*.

### 4.3 UTM params on inbound URLs

Per [`measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) "Setting up the UTM convention":

```
?utm_source=<platform>&utm_medium=<format>&utm_campaign=stage-3-launch&utm_content=<variant>
```

| Platform | Expected URL pattern | Actual | Pass / Fail |
|---|---|---|---|
| TikTok script 1 var A | `https://mercyblade.com/weak-at?utm_source=tiktok&utm_medium=script1&utm_campaign=stage-3-launch&utm_content=A` | | ☐ |
| Facebook post 1 var A | `https://mercyblade.com/weak-at?utm_source=facebook&utm_medium=post1&utm_campaign=stage-3-launch&utm_content=A` | | ☐ |
| Zalo card | omitted (Zalo strips most external links per measurement-plan §"Zalo") | n/a | ☐ |
| Bitly / branch.io / linktr.ee shortener used? | **NO** — rejected per measurement-plan §"Bitly / branch.io / linktr.ee — REJECTED" | none | ☐ |

**Abort criterion:** a link shortener was used. Even "just to count clicks" — the third-party data flow is incompatible with the launch privacy claim.

### 4.4 Time-zone — post at peak Vietnam time

Vietnam standard time is **ICT (UTC+7)**. Peak TikTok / Facebook engagement is roughly **19:00–22:00 ICT**.

| Conversion | Chau's local (Mountain Time, UTC−7 in summer / −6 in winter) |
|---|---|
| 19:00 ICT → | **05:00 MT** (the day's morning) |
| 21:00 ICT → | **07:00 MT** |
| 12:00 ICT (lunch) → | **22:00 MT** (the prior calendar day) |

| Check | Expected | Actual | Pass / Fail |
|---|---|---|---|
| Post scheduled (or being posted) inside 19:00–22:00 ICT window | yes | | ☐ |
| If posting from Mountain Time on a weekday morning: confirm calendar slot 05:00–08:00 MT is reserved | yes | | ☐ |

**Not an abort criterion:** off-peak post. Engagement will be lower but the launch is not broken. Note in worksheet for the post-launch read.

---

## §5 Phase 5 — Rollback readiness

Goal: when (not if) the launch surfaces a regression, the recovery path is **already loaded** before the post goes live.

### 5.1 Last good Netlify deploy ID noted

Open the Netlify dashboard → **Deploys**. Identify the deploy that was live **before** the launch-day deploy (i.e. the deploy you would roll back to if the launch-day build regresses).

| Field | Value |
|---|---|
| Last-good deploy ID (Netlify deploy hash, 8+ char) | ______________________ |
| Last-good deploy commit SHA | ______________________ |
| Last-good deploy timestamp | ______________________ |
| Verified state via `curl -sI https://${LAST_GOOD_ID}--mercyblade.netlify.app` returns 200 | ☐ |

Write the ID at the top of this worksheet (§0). If the launch-day build needs to be reverted, this is the target.

### 5.2 One-command rollback documented inline

The Netlify dashboard's "Publish deploy" button on the last-good deploy is the canonical rollback path (UI confirmation prevents typos on an irreversible-feeling change). The CLI equivalent, for situations where the dashboard is the bottleneck:

```bash
# From the local repo root — restores the last-good deploy as the live one.
# Requires NETLIFY_AUTH_TOKEN in env (NOT committed).
netlify api restoreSiteDeploy \
  --data '{"site_id":"<SITE_ID>","deploy_id":"<LAST_GOOD_DEPLOY_ID>"}'
```

If Netlify itself is the failure mode (not the deploy contents), the recovery host is Vercel per [`disaster-recovery.md`](../runbooks/disaster-recovery.md) §2.2 + §5.6 pre-staged commands:

```bash
# Vercel emergency redeploy from the local repo
vercel pull --environment=production --token="${VERCEL_TOKEN}"
vercel build --prod
vercel deploy --prebuilt --prod --token="${VERCEL_TOKEN}"
```

DNS swap at Cloudflare follows; the dashboard is the recommended path per [`disaster-recovery.md`](../runbooks/disaster-recovery.md) §5.7.

| Check | Expected | Actual | Pass / Fail |
|---|---|---|---|
| Tester has dashboard access OR the `NETLIFY_AUTH_TOKEN` is reachable from this terminal | yes | | ☐ |
| Site ID known (Netlify dashboard → Site settings → General) | yes | | ☐ |
| Rollback path tested **at least once** in a prior quarter (not at launch) | yes | | ☐ |

**Abort criterion:** the rollback path has never been exercised, OR the tester does not have dashboard auth. Launching with no usable rollback = launching uninsured.

### 5.3 Sentry alert thresholds checked

Two RLS-related alert rules exist per [[project_sentry_infra_access]]: rule IDs `17072095` and `17072096`.

In Sentry → org `chau-doan` → project `mercyblade-web` → **Alerts**:

| Check | Expected | Actual | Pass / Fail |
|---|---|---|---|
| Both RLS alert rules **enabled** (not paused) | enabled | | ☐ |
| Alert recipient is the address that reaches Chau in <5 min (per [[project_sending_address]] forwarding) | reaches | | ☐ |
| No new alert rule introduced in the last week without Chau's review | clean | | ☐ |

The Sentry SDK is route-gated and the default error path falls back to `console.*` per [`disaster-recovery.md`](../runbooks/disaster-recovery.md) §2.6 — Sentry going down is **not** a launch blocker, but Sentry being **misconfigured** (alerts going to a stale inbox) means a real regression at launch will go unseen.

### 5.4 Native shells noted (informational, not actionable today)

| Surface | State during a web rollback |
|---|---|
| iOS (`com.chaudoan.mercyblade`, per [[project_android_urls]]) | Existing installs continue to render the bundled `dist/` they shipped with — unaffected by web rollback. |
| Android (`com.mercyapps.mercyblade`, per [[project_android_urls]]) | Same. |

Web rollback affects web users only. If the launch-day regression is in a native-only path, the rollback procedure is a code revert + a new web deploy AND (separately) a new native build cycle. Per [[feedback_native_work_phasing]] — defer native PR work to ~2–4 weeks pre-submission; not a launch-day path.

---

## §6 Sign-off

Once all phases above are PASS (or NOTE for advisory items), sign off below before posting:

| Field | Value |
|---|---|
| All Phase 1 abort criteria PASS | ☐ |
| All Phase 2 abort criteria PASS | ☐ |
| All Phase 3 abort criteria PASS | ☐ |
| All Phase 4 abort criteria PASS | ☐ |
| All Phase 5 abort criteria PASS | ☐ |
| Last-good Netlify deploy ID written down | ☐ |
| Rollback dashboard tab open in browser | ☐ |
| Sentry tab open in browser | ☐ |
| Phone fully charged (≥ 80%) | ☐ |

**Tester signature (just type your name):** ______________________

**Posted-at timestamp (ICT):** ______________________

---

## §A Abort matrix (the only table that matters)

| Failure | Severity | Abort launch? |
|---|---|---|
| `mercyblade.com` returns 5xx | Critical | **YES** |
| `/weak-at` returns 5xx or blank | Critical | **YES** |
| Netlify topmost deploy = Failed | Critical | **YES** |
| Sign-in fails on known-good account | Critical | **YES** |
| Console error introduced in head of `main` | High | **YES** — investigate first |
| Sentry SDK missing on a route that should load it | High | **YES** — launch invisible |
| Supabase request fires during `/weak-at` | High | **YES** — privacy claim false |
| `mb.marketing.*` localStorage key exists | High | **YES** — privacy claim drifts |
| Caption claims outcomes the asset can't back | High | **YES** — rewrite caption |
| Link shortener used on inbound URL | High | **YES** — strip and re-post URL |
| Last-good deploy ID unknown | High | **YES** — no rollback insurance |
| Sentry test message takes > 60 s (but SDK loaded) | Medium | NO — note and proceed |
| `console.warn` rows present but unchanged baseline | Low | NO — note and proceed |
| Post lands outside 19:00–22:00 ICT window | Low | NO — note and proceed |
| Row navigation hits a `console.log` stub (pre-handoff build) | Low | NO — don't film handoff video |
| iOS / Android shell deploy is stale | Informational | NO — web rollback only affects web |

---

## §B References

- [`docs/stage-3a/marketing-screenshot-spec.md`](../stage-3a/marketing-screenshot-spec.md) — diagnostic-frame asset seed + viewport + capture procedure + framing copy.
- [`docs/stage-3b/marketing-screenshot-spec.md`](../stage-3b/marketing-screenshot-spec.md) — prescriptive-frame asset seed + procedure + framing copy.
- [`docs/stage-3b/qa-test-plan.md`](../stage-3b/qa-test-plan.md) — the real-device QA pass; §6 (zero-remote-calls), §7 (bilingual rendering), and §2 (row navigation) are the source-of-truth for Phase 2 and Phase 3 above.
- [`docs/launch/landing-page-variants.md`](./landing-page-variants.md) — the bilingual landing-copy proposal whose Variant C trust-strip claims Phase 3 verifies on the live device.
- [`docs/launch/stage-3-content-kit/`](./stage-3-content-kit/) — captions, hashtags, A/B variant matrix, FAQ.
- [`docs/launch/stage-3-content-kit/measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) — UTM convention + the explicit list of rejected measurements (Pixel, GA4, shorteners, `mb.marketing.*` keys) that Phase 3 / Phase 4 mirror.
- [`docs/runbooks/disaster-recovery.md`](../runbooks/disaster-recovery.md) — §2.2 (Netlify), §2.5 (Cloudflare DNS), §2.6 (Sentry), §5.5–5.7 (pre-staged emergency-deploy + DNS-swap commands), §6 ("what NOT to do" — including don't migrate preemptively).
- `[[project_sentry_infra_access]]` (memory) — Sentry org / project / token / RLS alert IDs.
- `[[project_marketing_consent_is_tracking]]` (memory) — tracking consent is per-device localStorage, NOT email opt-out; the source of the Phase 3 GA4/Pixel/Clarity-beacons-conditional note.
- `[[project_android_urls]]` (memory) — iOS + Android app IDs (locked-divergent; never align).
- `[[feedback_native_work_phasing]]` (memory) — web-only today; native shells unaffected by web rollback.

---

**End of pre-launch checklist.** This file is updated each time a launch reveals a check that should have caught the regression. The next planned launch is the Stage 3 wave; this is the inaugural version of the doc.
