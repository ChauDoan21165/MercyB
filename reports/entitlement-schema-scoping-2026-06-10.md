# Entitlement Schema Scoping & Consolidation Plan

**Author:** Agent A7 · **Date:** 2026-06-10 · **Status:** DOCS ONLY — analysis & proposal. No SQL run, no schema change, no migration authored, no deploy.
**Priority-queue:** #10 (entitlement schema scoping).

> **Hard caveat — the repo is NOT the source of truth for ~half of these objects.** ~20 of the 46 relations are **prod-ahead drift**: they exist in production (and in the generated `src/integrations/supabase/types.ts`) but have **no `CREATE` statement in `supabase/migrations/`** (created via Lovable/dashboard). Two migrations confirm this in writing — `20260422020000_enable_rls_on_exposed_tables.sql` and `20260622000000_revoke_anon_on_internal_views.sql` ("these views are NOT in repo migrations (prod-ahead drift)"). **Any consolidation MUST begin by reconciling the drift into migrations** (a `supabase db pull` / hand-authored baseline), human-reviewed, before a single table is touched. See [[project_db_schema_drift_audit]].

> **Liveness method:** "LIVE" = a current edge function / `api/*` / `src/**` path does a real `.from(...)` read/write. A mention only in `supabase/functions/delete-account/user-data-manifest.ts` (GDPR enumerate-all) is **manifest-only → effectively dead** for business logic. `types.ts` is dated Apr 15 but already carries June drift, so it is reliable for *shape*, not *liveness* — trust migrations + edge-fn `.from()` for that.

---

## 1. Scope — the 46 entitlement-cluster relations

Grouped by function. `LIVE` / `DEAD` / `LEGACY` is business-logic liveness; `drift` = no defining migration.

### Billing / payment (15)
| Relation | Migration | Liveness | Note |
|---|---|---|---|
| `payment_transactions` | 20251120035109 | **LIVE (canonical)** | manual+IAP+stripe ledger; AdminPaymentsPage, TestPurchasePanel |
| `bank_transfer_orders` | 20251209075112 | **LIVE** | manual VND transfer v2 |
| `payment_proof_submissions` | 20251022041903 | **LIVE** | OCR'd payment screenshots |
| `apple_iap_events` | 20260321000000 | **LIVE** | Apple IAP webhook dedup |
| `stripe_webhook_events` | 20260613000000 | **LIVE** | current Stripe idempotency log |
| `billing_provider_events` | 20260319000000 | **LIVE** | generic provider webhook log |
| `payments` | drift | LEGACY | stripe-native mirror, no page reads it |
| `payment_events` | drift | LEGACY | legacy stripe event store |
| `payment_event_resolutions` | drift | DEAD | feeds the dead `payment_events_canonical` view |
| `payment_proof_audit_log` | 20251107030856 | manifest-only | proof-review audit |
| `bank_payment_requests` | 20251203221306 | LEGACY | superseded by `bank_transfer_orders` |
| `billing_customers` | drift | manifest-only | provider↔customer map |
| `stripe_events` | drift | DEAD | superseded by `stripe_webhook_events` (RLS-only touch) |
| `webhook_events` | drift | LEGACY | superseded by `billing_provider_events` |
| `payment_proof_*` (see above) | — | — | — |

### Subscription (6)
| Relation | Migration | Liveness | Note |
|---|---|---|---|
| `subscriptions` | 20260315211233 | **LIVE (target canonical)** | unified all-provider model; written by ALL webhooks |
| `user_subscriptions` | 20251020094557 | **LIVE (legacy, load-bearing — 26 refs)** | still the de-facto gate in many edge fns |
| `subscription_tiers` | 20251020094557 | **LIVE** | tier catalog/pricing (11 refs) |
| `subscription_usage` | 20251020094557 | **LIVE** | daily room/topic counters |
| `subscription_products` | drift | DEAD | product↔tier map, 0 refs |
| `user_subscription_state` | drift | manifest-only | revenue rollup per user |

### Entitlement core (6)
| Relation | Migration | Liveness | Note |
|---|---|---|---|
| `entitlement_events` | 20260315211233 | **LIVE (canonical ledger)** | written by subscriptionRepository |
| `user_entitlements_raw` | drift | base table | projection base for the views |
| `user_entitlements_v` (view) | drift (ALTER 20260630) | **LIVE (primary)** | fallback #1 in `_shared/billing.ts:170` |
| `user_entitlements` (view) | drift (ALTER 20260630) | LIVE | fallback #2 |
| `my_entitlements` (view) | drift | LIVE | fallback #4 |
| `billing_entitlement_events` | 20260319000000 | **DEAD** | Team-C foundation, never wired (0 refs) |

### Tier (6)
| Relation | Migration | Liveness | Note |
|---|---|---|---|
| `subscription_tiers` | (above) | **LIVE (catalog canonical)** | — |
| `user_tiers` | 20251209000524 | **LIVE** | simple user→tier (redeem-gift-code) |
| `tier_maps` | drift | DEAD | 0 refs |
| `app_tier_ranks` | drift | DEAD | duplicates `subscription_tiers.rank/vip_key` |
| `tier_memberships` | drift | manifest-only | multi-app future |
| `user_counts_by_tier` (view), `current_user_vip` (view) | drift | DEAD / manifest-only | analytics |

### Quota / usage (6)
| Relation | Migration | Liveness | Note |
|---|---|---|---|
| `ai_usage_logs` | 20260318000000 | **LIVE (newest meter)** | VND cost; ai-chat |
| `ai_usage` | 20251130014951 | LIVE | older log; `_shared/aiLogger.ts` |
| `ai_usage_events` | 20251207021032 | LIVE | older slimmer log; ai-dashboard |
| `ai_usage_daily` | drift | manifest-only | rate-limit/rollup |
| `user_quotas` | 20251021090532 | **LIVE** | daily questions/rooms; useCredits |
| `subscription_usage` | (above) | **LIVE** | overlaps `user_quotas.rooms_accessed` |
| `tts_usage_log` | 20251112070827 | **LIVE** | TTS usage |

### Promo / codes / redemption (6)
| Relation | Migration | Liveness | Note |
|---|---|---|---|
| `access_codes` | 20251120035109 | **LIVE** | admin-issued codes |
| `gift_codes` | 20251122042210 | **LIVE** | gift codes |
| `promo_codes` | 20251021125101 | **LIVE** | promo w/ daily limits |
| `access_code_redemptions` | 20251120035109 | LIVE (write path) | — |
| `user_promo_redemptions` | 20251021125101 | **LIVE** | per-user promo state |
| `user_referrals` | 20251201045405 | DEAD-ish | defined+RLS, 0 `.from` refs |

### Catalog / pricing (2)
| Relation | Migration | Liveness | Note |
|---|---|---|---|
| `ai_product_catalog` | 20260318000000 | **LIVE** | costMonitoring.ts |
| `ai_price_catalog` | drift | DEAD | 0 refs |

### Roles / access-gating (4)
| Relation | Migration | Liveness | Note |
|---|---|---|---|
| `user_roles` | 20251020090513 (hardened 20260301032412) | **LIVE** | RBAC (19 refs) |
| `admin_users` | 20251209061329 | **LIVE** | admin allowlist+level (9 refs) |
| `organizations` | drift | DEAD | B2B future |
| `organization_users` | drift | DEAD | B2B future |

### Legacy VIP (2) — see five-non-negotiables [[project_no_vip_tier]]
| Relation | Migration | Liveness | Note |
|---|---|---|---|
| `vip_room_requests` | 20251020100911 | LEGACY | custom-room requests |
| `vip_topic_requests_detailed` | 20251021125701 | LEGACY | detailed topic requests |

### Admin revenue views (4)
`admin_mrr_snapshot` (DEAD — admin-billing-metrics uses `billing_mrr_inputs_v`), `admin_revenue_risk_snapshot` (DEAD), `payment_events_canonical` (DEAD — view over the dead `payment_events`), `payment_transactions_with_age` (analytics/dead). All drift; the first two had anon revoked in `20260622000000`.

---

## 2. Redundancy groups & canonical verdicts

| # | Group | **Canonical (keep)** | Collapse / retire |
|---|---|---|---|
| a | Payment store | **`payment_transactions`** | `payments`, `payment_events`, `payment_event_resolutions`, `payment_events_canonical` (view) — ⚠️ naming trap: `*_canonical` is the **dead** lineage; the real canonical is `payment_transactions` |
| b | Subscription state | **`subscriptions`** (unified) | `user_subscription_state` (→ view); `user_subscriptions` = **legacy but load-bearing, highest-risk cutover** |
| c | Entitlement | **`entitlement_events`** (ledger) + **`user_entitlements_raw`**→**`user_entitlements_v`** (one view) | drop `user_entitlements`, `my_entitlements` (collapse the 4-deep fallback chain in `billing.ts:170`); **delete `billing_entitlement_events`** (dead parallel ledger) |
| d | Tier | **`subscription_tiers`** (catalog) + one user→tier source | `tier_maps`, `app_tier_ranks` (dead), `tier_memberships` (future), `user_counts_by_tier`/`current_user_vip` (views) — note tier is triple-stored on `user_tiers`, `user_subscriptions.tier_id`, `subscriptions.tier` |
| e | AI usage / quota | **`ai_usage_logs`** (+ daily rollup view) | fold `ai_usage`, `ai_usage_events`, `ai_usage_daily`; merge `user_quotas` + `subscription_usage` (overlapping `rooms_accessed`) |
| f | Webhook/provider logs | **`billing_provider_events`** (generic) + provider idempotency tables where dedup keys differ (`stripe_webhook_events`, `apple_iap_events`) | `stripe_events`, `webhook_events` (dead) |
| g | Code/redemption trio | (lower priority) all three LIVE w/ separate redeem fns | optional future unify → `redemption_codes` + `code_redemptions`; **refactor, not dead-code removal** |

**Clear dead-code (0 business refs) — safe-to-drop candidates after drift reconciliation:** `billing_entitlement_events`, `subscription_products`, `tier_maps`, `app_tier_ranks`, `user_referrals`, `ai_price_catalog`, `organizations`, `organization_users`, `payment_event_resolutions`, `admin_mrr_snapshot`, `admin_revenue_risk_snapshot`, `stripe_events`.

---

## 3. Phased consolidation plan (proposal — each phase = human-reviewed migration, no unattended SQL)

**Phase 0 — Drift reconciliation (BLOCKER, do first).** Hand-author migrations (or `db pull`) that baseline the ~20 drift relations so the repo describes reality. No behavior change. Without this, every later DROP/ALTER risks diverging further. Ref [[project_db_schema_drift_audit]] — there is **no unattended SQL path** to this Supabase; Chau applies via SQL Editor.

**Phase 1 — Dead-code removal (lowest risk).** Drop the 12 zero-reference relations listed above. Each: confirm 0 `.from()` refs at drop time (code moves fast), drop in its own small migration, keep a one-line tombstone comment. Removes ~26% of the cluster with no app impact.

**Phase 2 — View/ledger collapse (low risk).** (c) Reduce the entitlement read-fallback chain in `_shared/billing.ts` from 4 views to 1 (`user_entitlements_v`); retire `user_entitlements` + `my_entitlements`. (f) Retire `stripe_events`/`webhook_events`. (a) Retire the `payment_events*` view/trio in favor of `payment_transactions` (+ rebuild `*_with_age` on the canonical table).

**Phase 3 — Tier source unification (medium risk).** Pick ONE user→tier source. Tier currently lives on `user_tiers`, `user_subscriptions.tier_id`, and `subscriptions.tier` simultaneously — a correctness hazard (which wins?). Recommend: tier is **derived from `subscriptions` + `subscription_tiers`**, with `user_tiers` retired or made a view. Retire `tier_maps`/`app_tier_ranks`.

**Phase 4 — Subscription cutover (HIGHEST risk, do last).** Complete `user_subscriptions` → `subscriptions`. Today `_shared/entitlement/recompute.ts` **dual-writes both**; ~26 edge-fn references (`text-to-speech`, `redeem-gift-code`, `admin-set-tier`, `me-entitlement`, …) still gate on `user_subscriptions`. Sequence: (1) make `subscriptions` the sole write target, (2) expose `user_subscriptions` as a backward-compat view, (3) migrate readers off the view, (4) drop the view. Gate behind golden-flow + entitlement tests; this is the one that can break paid access.

**Phase 5 — Usage merge (medium).** Consolidate the 3 AI-usage logs into `ai_usage_logs` + a daily rollup view; merge `user_quotas`/`subscription_usage`.

**(Deferred) Phase 6 — Code/redemption unify (g):** optional refactor; no urgency.

---

## 4. Risks & guardrails
- **Permissions are product logic** (CLAUDE.md): every entitlement table is an access gate. A consolidation that renders the UI but mis-gates tier = a paid-access regression. Every phase needs entitlement/golden-flow test coverage before merge.
- **Phase 4 is the revenue-critical one** — the dual-write `subscriptions`/`user_subscriptions` cutover. Do not reorder it earlier.
- **No VIP tier** ([[project_no_vip_tier]]): `vip_*` request tables and `current_user_vip` are legacy naming; consolidation should not resurrect a VIP cohort concept.
- **Drift-first**: never DROP a drift relation before it (and its dependents) are baselined into migrations and re-verified against prod.
- **Tier DB corruption** known issue ([[project_room_tier_db_corruption]]) is adjacent — do not assume `rooms.tier`/`profiles.tier` are clean inputs.

## 5. One-line summary
46 entitlement relations collapse to a **~22-table target**: ~12 are droppable dead-code, 7 redundancy groups consolidate to single canonicals (`payment_transactions`, `subscriptions`, `entitlement_events`+1 view, `subscription_tiers`, `ai_usage_logs`, `billing_provider_events`, and a deferred code-redemption unify). Sequence is **drift-reconcile → drop dead → collapse views → unify tier → subscription cutover (last, revenue-critical) → usage merge.**
