# Launch-window operations — Stage 3 launch

The live operating procedure for the **launch window itself** — the hours between the first post going live and the moment the window closes.

Pairs with [`prelaunch-checklist.md`](./prelaunch-checklist.md) (the morning-of checklist) and the future [`week-1-retrospective.md`](./week-1-retrospective.md) (the day-7+ retro). Together those three docs cover *before*, *during*, and *after* a launch wave.

This file is **operator-facing**, not user-facing. The operator is Chau today; the doc is written so a future operator who hasn't been in the room could run the launch window without asking questions.

---

## §0 Scope and time blocks

The "launch window" is defined as the period from the first post going live to the end of **hour +72**. Three time blocks inside it:

| Block | Window | What it's for |
|---|---|---|
| **Hour 0 — +4** | Active monitoring | First-comment response, first-error triage, the kill-switch window. Operator at the keyboard. |
| **Hour +4 — +24** | Light monitoring | Comments + DMs read on a 1–2 hour cadence. Operator near the phone. Sleep is allowed if the launch lands in the morning ICT (= overnight MT for Chau). |
| **Hour +24 — +72** | Passive monitoring | Daily check-ins. Engagement trajectory observable. Variant-comparison reads are still too early (per [`decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) — TikTok window is 7 days). |

After hour +72, the operator transitions to **week-1 mode**: daily passive read, weekly metrics roll-up, retrospective at day 7+. That mode is governed by [`first-week-metrics-spec.md`](./first-week-metrics-spec.md) (when it ships) and the week-1 retro template.

> **What this doc deliberately does NOT cover:** the multi-week variant-test cadence (covered by [`decision-criteria.md`](./stage-3-content-kit/decision-criteria.md)) and the platform-side reading cadence after the first 72 h (covered by `first-week-metrics-spec.md`). Launch-window ops is the first-72-hour-only doc; it ends where the metrics spec begins.

---

## §1 Pre-window setup (hour −1)

One hour before the planned post time, the operator runs:

1. **Re-confirm Phase 5 of [`prelaunch-checklist.md`](./prelaunch-checklist.md)** is still green — Netlify last-good deploy ID still recorded, rollback dashboard tab open, Sentry tab open.
2. **Pin three browser tabs** on the operator's primary device:
   - Netlify dashboard → Deploys page (for rollback)
   - Sentry → org `chau-doan` → project `mercyblade-web` → Issues feed (for error spike detection)
   - The platform's posting / replies tool — TikTok Studio app, Facebook Page Manager, Zalo (use the phone app for Zalo; no desktop equivalent)
3. **Open the operator scratch sheet.** A private Google Doc or Notion page (per `measurement-plan.md` — NOT in any MercyBlade system, NOT shared) with sections:
   - **Posted-at timestamps** (one per post)
   - **First-comment log** (who, what, the time it landed, the response sent if any)
   - **Sentry events seen** (any new issue group during the window — note title, count, link)
   - **Kill-switch decisions** (any post pulled, any deploy rolled back, the time + reason)
4. **Confirm phone reachability** — silenced apps unmuted for Netlify alerts + Sentry alerts + the platform's reply notifications. SMS reachable for Cloudflare / Supabase outage alerts (per [`disaster-recovery.md`](../runbooks/disaster-recovery.md) §3.4).

If any of these is not in place, **delay the post by 30 minutes** and complete the setup. Posting into a window where you can't see what's happening is launching blind.

---

## §2 Hour 0 — the first 60 minutes after the first post

The first 60 minutes carry the highest expected event density:

- TikTok's algorithmic distribution makes its first push in the first 15–30 minutes.
- Facebook's organic surfacing happens in the first 60–90 minutes after publishing.
- Zalo forwards (if any) start within minutes of the seed message landing in active conversations.

### 2.1 Continuous watch (the operator is at the keyboard)

| Surface | What to watch | Cadence |
|---|---|---|
| Sentry Issues feed | New error groups created since the post went live | Refresh every 5 minutes |
| Netlify deploys page | Any auto-deploy triggered by an unrelated merge to `main` (could silently change the live surface mid-window) | Refresh every 10 minutes |
| Platform replies/comments inbox | First-comment, first-DM | Refresh every 5 minutes |
| `mercyblade.com/weak-at` open in a private browser tab on a fresh device | Verify it still renders, still has zero outbound HTTP, still shows the bilingual labels | Reload every 15 minutes |

### 2.2 First-comment response policy

**The first comment sets the tone.** A reply within 10 minutes signals "the founder is here." A reply at hour +6 signals "another brand." For the launch window, the operator should respond to comments / DMs **within 15 minutes** during hour 0 — +4.

Per-comment response rules:

| Comment type | Response | Where |
|---|---|---|
| Genuine question about the product | Answer briefly in VI (the platform's primary language for VN-resident audiences); link to FAQ if relevant: [`docs/launch/stage-3-content-kit/faq.md`](./stage-3-content-kit/faq.md) | Reply in-platform |
| Tested-the-product positive feedback | Thank them briefly. **Do NOT screenshot or repost** without explicit permission — that crosses the no-fabricated-testimonials line ([[project_marketing_landing_decisions]]). | Reply in-platform |
| Crisis-level content (self-harm reference, medical emergency framing) | The platform's crisis-resource link is the response. **Do not engage in the original commenter's framing.** See §3 below. | Reply in-platform; escalate to §3 below |
| Negative / hostile / trolling | One calm reply with a fact, OR no reply at all. **Never argue.** Two replies max, then stop. | Reply in-platform |
| Spam / link-spam from unrelated accounts | Hide the comment using the platform's tools. Do not respond. | Platform-side action |
| Comment alleges a product bug | Acknowledge briefly, ask for a reproducer (browser / OS / specific URL), log to scratch sheet under "Sentry events seen / user-reported issues" | Reply in-platform AND log |

**Tone constraint:** every operator reply in VI is held to the same anti-shame standard as the source posts (no *yếu / kém / dốt / lười / tệ* user-facing labels). The shame regex check applies in real-time conversation, not just to prepared copy.

### 2.3 Error-spike triage

Sentry's RLS alert rules (`17072095` / `17072096`, per [[project_sentry_infra_access]]) will surface RLS violations automatically. For other error spikes during the launch window:

| Symptom | Severity | Action |
|---|---|---|
| 1 new error group with < 3 events in the first hour | Low | Note, do not act. Most are session quirks. |
| 1 new error group with 10+ events affecting > 5 unique users in the first hour | High | Investigate immediately. Compare against the launch-day deploy; if the error landed with the launch deploy, **prepare for rollback** (§5). |
| Spike in `[Sentry] failed to send` lines in users' DevTools (rare to observe; only matters if a user reports it) | Medium | Sentry's own ingest may be degraded. Errors still queue locally per the Sentry SDK retry semantics ([`disaster-recovery.md`](../runbooks/disaster-recovery.md) §2.6). Note in scratch sheet; no operator action needed. |
| Any new error group whose first event timestamp matches a launch-day deploy SHA | **High** | The launch deploy regressed something. Rollback (§5) is the first option, not the last. |

---

## §3 Crisis-content escalation

The Stage 3 surface (`/weak-at`) is a learning-diagnostic page; the launch posts are about that page. But comments / DMs can carry **any** content, including:

- Self-harm references
- Medical-emergency framing
- Domestic-violence disclosure
- Other distress signals

These are NOT product bugs. The operator response is **the platform's crisis-resource link, surfaced calmly**, and **disengagement from the original framing**. Per the app-side pattern in `containsCrisisKeywords` + `SAFE_RESPONSE` (see [`disaster-recovery.md`](../runbooks/disaster-recovery.md) §2.11 — the OpenAI outage section names the same pattern in code), crisis content gets a fixed, safe response — not improvised empathy and not advice.

### 3.1 Crisis-response template (operator copies this verbatim, edits only the language match)

**Vietnamese:**

> Cảm ơn bạn đã chia sẻ. Mình không phải là chuyên viên hỗ trợ tâm lý. Nếu bạn đang gặp khủng hoảng, đường dây hỗ trợ tâm lý 24/7 tại Việt Nam là **1800 599 920** (Đường dây nóng Tham vấn tâm lý). Ở nước ngoài, hãy gọi 113 hoặc đường dây khẩn cấp địa phương.

**English:**

> Thank you for sharing. I'm not a crisis-support professional. If you're in immediate crisis, please reach out — in Vietnam, the 24/7 helpline is **1800 599 920** (national psychological support hotline). Outside Vietnam, please contact your local emergency line or a crisis hotline you trust.

The operator does NOT continue the conversation after sending this. The crisis-line link is the response; engagement past that crosses outside the operator's competence.

### 3.2 What NOT to do

- Do NOT cite MercyBlade's product as a help for the disclosed crisis. The product is a language tool, not a mental-health intervention.
- Do NOT screenshot the disclosure for any internal discussion — privacy + dignity.
- Do NOT delete the comment unless it contains harmful content directed at others. Disengagement does not require deletion.

---

## §4 Per-channel response cadence (hour +4 — +24)

After the first 4 hours, the operator can transition to lighter monitoring. Cadence per surface:

| Surface | Cadence in hour +4 — +24 |
|---|---|
| TikTok comments | Every 60–90 min while awake |
| Facebook comments + DMs | Every 60–90 min while awake |
| Zalo (the seed conversations) | Every 2–3 hours while awake |
| Sentry feed | Every 60 min, plus on alert ping |
| Netlify deploys page | Once per 4 hours unless an auto-deploy fires |

**Sleep allowance:** if the launch lands in the morning ICT (a common case — see [`prelaunch-checklist.md`](./prelaunch-checklist.md) §4.4 time-zone table), the hour +12 — +20 window falls in Chau's overnight Mountain Time. Sleep is allowed. Sentry alerts via the routed inbox per [[project_sending_address]] cover the high-severity wake-up cases.

Set **two alarms**: one at hour +20 (catch up on overnight comments before Chau's morning); one at hour +24 (formal close-of-day-1 review).

---

## §5 The kill switch

Two distinct kill-switch options exist. Don't confuse them.

### 5.1 Pull the post (platform-side)

When to use: a specific post is the problem — wrong copy, misleading framing, audience reacting badly enough that the brand is damaged faster than the post is helping. Per [`decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) — *"if B is actively damaging brand … pull the post."*

Steps:

1. **Note the time + reason** in the operator scratch sheet under "Kill-switch decisions."
2. **Delete the post on the platform** (TikTok Studio → Manage → Delete; Facebook Page → Posts → Delete; Zalo — recall message if within the platform's recall window, or send a follow-up clarification).
3. **Do NOT replace with a "corrected" post in the same window.** The audience just saw the first post; a second post on the same topic 30 minutes later reads as flailing. Wait until the next planned post window — or a different wave entirely.
4. **Update [`ab-variants.md`](./stage-3-content-kit/ab-variants.md)** to mark the variant retired with a one-line reason. This goes in a follow-up commit, not during the launch window.

**Not a kill-switch trigger:** a small number of negative comments. Per §2.2 — engage calmly, two replies max. Negative-comment density has to be high *and* the negative reads have to be on-content (the message is wrong) not on-style (the message is fine; some commenters are just hostile) before pulling.

### 5.2 Roll back the deploy (site-side)

When to use: the launch-day deploy introduced a regression — `/weak-at` crashes, sign-in breaks, the privacy claim is provably false on the live build (a Supabase call fires that wasn't there pre-deploy).

Steps:

1. **Verify it's a regression, not a transient.** Reload `/weak-at` three times across 5 minutes; if the regression reproduces, proceed.
2. **Find the last-good deploy ID** in §0 / [`prelaunch-checklist.md`](./prelaunch-checklist.md) §5.1.
3. **Roll back** via the Netlify dashboard's "Publish deploy" button on the last-good deploy. The CLI equivalent is in [`prelaunch-checklist.md`](./prelaunch-checklist.md) §5.2.
4. **Verify rollback took effect.** `curl -sI https://mercyblade.com | head -3` shows 200; the regression should be gone. Native iOS / Android shells are unaffected (they serve the bundled `dist/` they shipped with — same caveat as the disaster-recovery doc §2.2).
5. **Investigate the regression OFFLINE** — not during the launch window. The launch window is for triage, not for fixing.
6. **Decide whether the launch posts stay live** or get pulled too. If the regression broke the surface the post claims to demonstrate, pulling the post is consistent. If the regression was on an unrelated route, leave the posts.

**Hard rule:** rollback decisions are Chau's, made alone, in under 10 minutes from regression confirmation. No committee. No "let's wait and see if it recovers" past 15 minutes.

### 5.3 Both — pull AND roll back

When to use: the launch posts demonstrate a privacy claim that the deploy regression makes false. Example: Variant C says "0 yêu cầu" but a Supabase call is now firing during `/weak-at`. The claim is publicly wrong; the post must come down AND the deploy must roll back.

Order matters: **pull the post FIRST, roll back the deploy SECOND.** Pulling the post stops the false claim from spreading further while the rollback completes; rolling back the deploy first leaves the false claim visible for the rollback's duration.

---

## §6 Hour +24 — close of day 1

At hour +24, the operator runs the **day-1 close review**:

| Check | Expected | Pass / Fail |
|---|---|---|
| All operator scratch-sheet sections have entries | populated | ☐ |
| No kill-switch event open (no pulled-post or rollback in flight) | clear | ☐ |
| Sentry feed shows no new HIGH-severity group from the launch deploy | clean | ☐ |
| Platform-side counts noted in scratch sheet: TikTok views, FB reach, Zalo reactions | noted | ☐ |
| Vercel edge logs (`/weak-at` request count over the last 24 h) noted | noted | ☐ |
| Any planned follow-up posts queued for hour +24 — +72 are still appropriate given hour 0 — +24 signal | confirmed | ☐ |
| Tester / operator gets some sleep before hour +24 — +72 | yes | ☐ |

If any fails, **the launch window stays open and active monitoring continues**. The window closes only when day-1 review passes.

---

## §7 Hour +24 — +72 — passive monitoring

Cadence drops to once-per-half-day comment / DM review. Sentry alerts still wake the operator. Otherwise the launch window has settled into early-week territory.

Specific things to watch in this block:

| Watch for | Why |
|---|---|
| Late-arriving comments on TikTok (algorithmic surge can hit on day 2–3) | TikTok's distribution is bursty; the largest engagement spike sometimes happens after the initial surge |
| Forward chains on Zalo (a card forwarded into a different conversation may produce reactions in that conversation) | This is the only Zalo signal — manual observation, per [`measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) §3 |
| Press / blogger pickup (rare but happens — a Vietnamese-language blogger may write about the post) | Search the post's hashtags on day 2 and day 3 for organic reposts |
| Continued zero remote calls from `/weak-at` | Reload on a fresh device once per day; the privacy claim is a continuing claim, not a launch-only claim |
| Sentry HIGH-severity any group attributed to the launch deploy | Same as §2.3 — investigation triggers rollback |

**Not in scope** for the operator during this block: variant comparison. The decision criteria's TikTok 7-day / Facebook 14-day windows are deliberate; reading variant performance at day 3 biases toward the loudest variant, not the better one.

---

## §8 Hour +72 — window closes, handoff to week-1 mode

At hour +72:

1. **Move operator scratch-sheet contents** into the future `week-1-retrospective.md` template (sections: "What we shipped vs. what we measured", "What surprised us", "Feedback patterns").
2. **Close the Sentry tab** (alerts still active, but constant refresh stops).
3. **Close the Netlify dashboard tab** (alerts still active).
4. **Resume normal development cadence** — feature work, agent dispatches, the regular flow. The launch window is over.
5. **Schedule the week-1 retro** on the calendar — 7 days from posted-at, or at the next available block after that.

The launch is not a milestone with a celebratory close; it's a routine that ran and finished. The next milestone — *a named Vietnamese learner publicly credits MercyBlade for an outcome* — is the §15 Bar #7 close, and it cannot be reached by any operator action in this doc.

---

## §A Anti-patterns during the launch window

| Anti-pattern | Why it's bad |
|---|---|
| **Reading view counts every 5 minutes** | Confirmation-bias loop; the same data refreshes; no action follows the read. Cap at the cadence in §2.1 / §4. |
| **Replying to every commenter** | Engagement metrics inflate; brand voice diffuses; operator burns out. The §2.2 policy is enough. |
| **Posting a "correction" post 30 min after a pull** | Flailing read. Wait. |
| **Reading variant comparison at hour +6** | Pre-§7 — the data is too thin. The next variant pair is queued for the next wave, not the next hour. |
| **Engaging crisis-content commenters past the §3 fixed response** | Outside operator competence; risk to the commenter + risk to the operator. |
| **Defending the privacy claim in comments by typing technical details** | The claim is verifiable; the commenter can verify themselves per [`landing-page-variants.md`](./landing-page-variants.md) Variant C trust strip ("DevTools → Network → 0 requests"). Long technical replies look defensive. |
| **Trying to "fix" a launch-window regression in code DURING the window** | Rollback first, fix offline. Mid-window code changes during a live launch is how the launch ends in a worse state than the regression. |
| **Skipping the day-1 close review** because everything seems fine | The §6 review is the gate that confirms what "fine" means. Skipping it lets latent issues drift into day 2. |

---

## §B What this doc does NOT cover

- **Multi-week variant testing.** See [`decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) for the weeks-1-through-6 cadence and the per-platform thresholds.
- **The actual posting tools' UI.** TikTok Studio, Facebook Page Manager, Zalo — those tools are owned by their respective platforms and their UIs change; the operator follows the platform's documentation, not this doc.
- **Email or push-notification responses.** No marketing email is sent during the launch window (the unsubscribe system isn't shipped — per `CLAUDE.md` "Email system"). If a user-side email arrives during the window, route it to the normal `admin@mercyblade.com` inbox per [[project_sending_address]].
- **Paid-amplification decisions.** Out of scope for organic-only launches; out of scope for this doc.
- **The first 100 user-onboarding flow.** Different concern; lives in the onboarding doc set.
- **Apple / Google store-side launch operations.** Web-only today per [[feedback_native_work_phasing]]; native store launches are a different runbook entirely.

---

## §C References

- [`prelaunch-checklist.md`](./prelaunch-checklist.md) — the morning-of, before-the-post checklist. The §0 setup in this doc assumes that one passed.
- [`stage-3-content-kit/`](./stage-3-content-kit/) — the posts, captions, hashtags this window is operating on.
- [`stage-3-content-kit/measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) — the privacy posture + UTM scheme + what gets measured + the explicit rejection list.
- [`stage-3-content-kit/decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) — when a variant test concludes; out-of-scope for the first 72 h but defines what "settled" means downstream.
- [`stage-3-content-kit/faq.md`](./stage-3-content-kit/faq.md) — bilingual answers the operator pastes into replies.
- [`landing-page-variants.md`](./landing-page-variants.md) — Variant C's privacy trust-strip claims are the public claims the operator defends in §2.2.
- [`../runbooks/disaster-recovery.md`](../runbooks/disaster-recovery.md) — §2.2 (Netlify), §2.6 (Sentry), §2.11 (OpenAI) inform the §2.3 + §5 escalation paths above.
- `[[project_sentry_infra_access]]` — Sentry org / project / RLS alert IDs.
- `[[project_sending_address]]` — `admin@mercyblade.com` for all routing.
- `[[project_marketing_landing_decisions]]` — no fabricated testimonials; no screenshot-and-repost without explicit permission.
- `[[feedback_native_work_phasing]]` — web-only today.

---

**End of launch-window operations.** Next planned wave: Stage 3. This doc is updated after any launch surfaces a category of operator decision that the doc didn't cover.
