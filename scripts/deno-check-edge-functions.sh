#!/usr/bin/env bash
#
# scripts/deno-check-edge-functions.sh — Deno-aware type gate for edge functions.
#
# WHY THIS EXISTS
# ---------------
# Edge-function bugs ship uncaught today:
#   • tsconfig.json EXCLUDES "supabase", so `typecheck:ci` (bare tsc) never
#     sees edge-function code.
#   • eslint ignores "supabase/functions/**".
#   • `typecheck:functions` (tsconfig.functions.json) only covers the
#     URL-free placement-session subtree — a Node `tsc` cannot resolve Deno
#     URL specifiers (`https://deno.land/`, `https://esm.sh/`) or `npm:` /
#     `jsr:` specifiers, which almost every edge function reaches.
#
# `deno check` IS Deno-aware: it resolves those specifiers and type-checks
# the real module graph an edge function runs with. That is the gate that
# actually catches the "edge-function bug ships uncaught" class — including
# index.ts and _shared, which the Node tsc gate structurally cannot cover.
#
# SCOPE REALITY (documented, not papered over)
# --------------------------------------------
# A wholesale `deno check supabase/functions/**/*.ts` is RED on current
# main. Verified pre-existing failures (NOT introduced here):
#   • supabase/functions/stripe-webhook/webhook-events.ts — 10+ TS2339
#     `Property 'product_id' does not exist on type { price_id?; plan?; }`
#     (a real latent money-path type bug surfaced by this gate).
#   • supabase/functions/billing-stripe-change-plan/index.ts — TS error
#     at index.ts:408.
# Also: every `__tests__/*.test.ts` imports `from "vitest"` and there are
# ZERO `Deno.test` files in the repo — those tests are run by `npm test`
# (vitest), NOT `deno test`; they are intentionally OUT of this gate.
#
# So, exactly mirroring the tsconfig.functions.json precedent (gate the
# currently-green subtree, document the rest, make it extensible), this
# gate runs `deno check` over a curated allowlist that is GREEN on main
# today. It is a real, blocking, Deno-resolved type gate for the highest-
# stakes money-path edge modules — and a foothold to widen as the
# pre-existing debt above is paid down in follow-up PRs.
#
# HOW TO EXTEND
# -------------
# Add a path to ALLOWLIST below ONLY after this script stays green with it
# (run `npm run deno:check:functions` locally / in CI). Never add a path
# that red-lines on pre-existing legacy code — fix that code in its own PR
# first, then widen the gate.
#
# Requires `deno` on PATH (CI: denoland/setup-deno@v1; local: optional).
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v deno >/dev/null 2>&1; then
  echo "::error::deno not found on PATH. CI installs it via denoland/setup-deno@v1." >&2
  echo "Locally: curl -fsSL https://deno.land/install.sh | sh   (then add deno to PATH)" >&2
  exit 1
fi

# Currently-green allowlist. Each entry verified with `deno check` on main.
ALLOWLIST=(
  # #715 money-path pure decision logic. Its own header: a mis-typed
  # shouldForceCheckoutForLifecycle is a silent revenue leak.
  "supabase/functions/billing-stripe-change-plan/logic.ts"
  # #715 billing-portal handler core + the full function entrypoint
  # (index.ts pulls Deno std + supabase-js — the deno-only value-add
  # over the Node tsc gate).
  "supabase/functions/create-billing-portal-session/core.ts"
  "supabase/functions/create-billing-portal-session/index.ts"
)

echo "→ deno check (Deno $(deno --version | head -1 | awk '{print $2}')) over ${#ALLOWLIST[@]} edge module(s):"
printf '   %s\n' "${ALLOWLIST[@]}"

# --no-lock: the repo-root deno.json sets nodeModulesDir:"auto", so a
# lock-writing `deno check` from the repo root rewrites deno.lock with the
# ENTIRE root package.json tree (~5k lines of churn) — irrelevant to this
# gate. Type-check correctness is unaffected: every external specifier the
# allowlist reaches is exact-pinned in source (e.g. npm:stripe@12.18.0).
deno check --no-lock "${ALLOWLIST[@]}"

echo "✅ edge-function deno check passed."
