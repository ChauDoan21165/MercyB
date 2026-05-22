# V5 Boundary Rules

**C7 deliverable. Baseline: main at 3be4e6ef1 (V4 stack complete: #968, #988, #989, #991).**

V5 inherits all V4 boundary rules and adds V5-specific restrictions. No V5 production code may land until C1/C2 approve scope and inheritance. This document governs all C-series implementation PRs.

---

## 1. Inherited V4 Runtime Boundary Rules

These 10 rules from V4's `CONTRACT_MAP.md` apply to V5 without modification:

1. **No `Date.now`** in deterministic functions. All timestamps arrive via injected context (`nowMs`, `snapshotMs`).
2. **No `Math.random`**. All non-determinism comes from FNV-1a hashes of sorted, deterministic input.
3. **k-anonymity**. All cohort/aggregate rollups gated by explicit `kAnonThreshold`. Below threshold → row dropped, never blurred.
4. **No PII**. `userIdHash` is pre-pseudonymized. Session ids are opaque strings. No email, name, or handle in analytical surfaces.
5. **No upstream imports in telemetry/adapter/orchestration layers**. These layers import NOTHING from core modules. The `…Like` structural contract pattern governs all cross-layer communication.
6. **Core path survives optional failures**. Enqueue/speaking/adaptive processing must not block primary user flows.
7. **Import from barrel only**. All consumers import from the module's `index.ts` barrel. Never from submodules directly.
8. **Deterministic replay**. All state must be rebuildable from event logs. No wall-clock time reads in state transitions.
9. **No Supabase, no Azure, no vendor I/O** in analytical modules (telemetry, adapter, orchestrator, core). These are pure functions.
10. **Idempotent events**. Duplicate event IDs produce no state change.

---

## 2. Forbidden Files and Paths

V5 implementation PRs MUST NOT touch these paths without explicit C7 + C1 approval:

### V4 surfaces (owned by B-series, parked)
```
src/lib/placement/v4/          # all V4 code — read-only for V5
src/components/placement/v4/   # V4 UI components
src/lib/placement/v4/telemetry/CONTRACT_MAP.md  # B7 source-of-truth
```

### Production infrastructure
```
api/                           # Vercel serverless functions
supabase/functions/            # Supabase edge functions
supabase/migrations/           # Database migrations
vercel.json                    # Vercel routing
vite.config.ts                 # Build configuration
capacitor.config.ts            # Mobile build
```

### Mobile / audio / DOM (owned by other agents)
```
ios/                           # iOS native
android/                       # Android native
mobile-shell/                  # Mobile shell
src/speech/                    # Speech/audio runtime
src/components/audio/          # Audio UI components
src/hooks/useAudioUrl.ts       # Audio resolution
src/lib/roomAudioResolver.ts   # Audio pipeline
public/audio/                  # Audio assets
```

### Ops / release / operator scripts
```
scripts/ops-morning.mjs        # Morning status
scripts/pr-ready.mjs           # PR readiness
scripts/verify-v3-placement.mjs
scripts/placement-v4/
scripts/validate-tests.mjs
scripts/audit-local-artifacts.mjs
audit_tmp/
room-audio-fixed/
```

### Global configuration
```
.env                           # Secrets (gitignored)
.env.local                     # Local overrides (gitignored)
.env.validation                # Validation config
package.json                   # Package manifest (scripts/deps)
package-lock.json              # Lockfile
tsconfig.json                  # Root TS config
tsconfig.typecheck.json        # CI typecheck config
eslint.config.js               # Lint config
.tailwind.config.ts             # Tailwind
postcss.config.cjs             # PostCSS
```

### Test infrastructure
```
vitest.config.ts               # Test runner config
playwright.config.ts           # E2E config
playwright.smoke.config.ts     # Smoke test config
e2e/                           # Playwright tests
src/test/                      # Test utilities
src/__tests__/                 # Global test directory
src/setupTests.ts              # Test setup
```

### Dead / recovery / graveyard
```
graveyard/
*.local-backup
*.local-backup.*
scripts/*.local-backup
src/**/*.local-backup
```

---

## 3. Forbidden Runtime Surfaces

V5 code MUST NOT:

- Import from `src/lib/placement/v4/` into V5 modules (use V5's own namespace)
- Import from `src/components/placement/v4/` into V5 UI
- Call Supabase client directly (`src/lib/supabaseClient.ts`)
- Call Azure SDK or any vendor SDK from analytical modules
- Access `localStorage` / `sessionStorage` / `IndexedDB` from deterministic functions
- Use `fetch()`, `XMLHttpRequest`, or any network I/O in analytical modules
- Read from `process.env` in browser bundles (use build-time injection only)
- Use `window`, `document`, `navigator` in analytical modules
- Use `setTimeout` / `setInterval` / `requestAnimationFrame` in deterministic functions
- Access `Date` constructor without injection (only `Date.parse` on caller-supplied ISO strings is permitted for conversion)

---

## 4. Vendor / Provider Boundary Rules

V5 provider integration must follow the V4 providerRegistry policy:

- All providers are gated through `PlacementV4ProviderSelection` (or V5 equivalent)
- No direct vendor SDK imports in analytical code
- Provider health snapshots (`PlacementV4ProviderHealthSnapshot`) are the sole gating mechanism
- `supabaseApproved` is a boolean validation flag — not an SDK import permission
- Secrets (keys, tokens, credentials) must never appear in analytical modules
- The `SECRET_VALUE_PATTERN` regex in providerRegistry is a static redaction pattern — not an authorization mechanism
- Provider trust tiers (`mock`, `validation_candidate`, `live_only`) govern what can run in each environment
- Production endpoints are blocked at the boundary layer until explicitly approved
- Any new provider addition requires: C5 provider plan approval → C7 boundary review → C1 final sign-off

---

## 5. Storage / Network / Env / Secrets Policy

### Storage
- No direct `localStorage`, `sessionStorage`, or `IndexedDB` access in V5 analytical code
- Persistence goes through approved storage adapters (Supabase, if approved by C5)
- All storage writes must be idempotent

### Network
- No `fetch()` or XHR in analytical modules
- Network I/O is permitted only in:
  - Vercel serverless functions (`api/`)
  - Supabase edge functions (`supabase/functions/`)
  - React event handlers (browser-only, for UI flows)
  - Approved provider adapters (gated through providerRegistry)
- Service Worker (`public/sw.js`) is read-only for V5 — no changes without mobile agent approval

### Environment variables
- `.env` and `.env.local` are gitignored — never commit secrets
- `.env.example` is the canonical template
- V5 modules must not read `process.env` at runtime in browser bundles
- Build-time environment injection goes through `vite.config.ts` `define` or `import.meta.env`

### Secrets
- No API keys, tokens, or credentials in source files
- No service-role keys in browser bundles
- The anon key in `src/lib/supabaseClient.ts` is the ONLY Supabase key permitted in the browser bundle
- Azure keys and service-role keys must never appear outside `api/` and `supabase/functions/`

---

## 6. Browser / Mobile / Audio / DOM Policy

- V5 analytical modules are **browser-safe pure functions** — no DOM access
- V5 UI components may render to DOM (React components) but must not contain analytical logic
- Mobile (iOS/Android/Capacitor) paths are off-limits to V5
- Audio pipeline (`src/lib/roomAudioResolver.ts`, `src/hooks/useAudioUrl.ts`) is off-limits
- Service Worker (`public/sw.js`) is off-limits
- PWA registration in `src/main.tsx` is off-limits
- Speech Synthesis API (`window.speechSynthesis`) access must go through existing V4 speaking adapter — no direct access from V5

---

## 7. Package / Scripts Policy

V5 PRs MUST NOT:

- Add, remove, or bump npm dependencies without C7 + C1 approval
- Add new npm scripts without C7 approval
- Modify existing npm scripts (`dev`, `build`, `typecheck`, `lint`, `test`, etc.)
- Modify `package.json` `engines`, `browserslist`, or build tooling config
- Add new workspace packages or monorepo entries
- Touch `bun.lockb` or `deno.json` / `deno.lock`

---

## 8. Release / Operator Path Policy

V5 PRs MUST NOT:

- Modify `.github/workflows/` (CI/CD pipelines)
- Modify `.husky/pre-commit` (pre-commit hooks)
- Modify `vercel.json` (deployment routing)
- Modify `.vercel/` (Vercel project config)
- Add or modify release scripts
- Change deployment targets or environment configurations
- Alter PR templates or contribution guides
- Modify `.dependency-cruiser.cjs` (module boundary enforcement)

---

## 9. C7 Approval Requirements for V5 Implementation PRs

Every V5 implementation PR must:

1. **Pass all CI gates**: typecheck, lint, test, build, rooms:check
2. **Contain zero files from §2 Forbidden Files and Paths** (unless explicitly approved by C7 + C1)
3. **Contain zero violations of §3 Forbidden Runtime Surfaces** (verified by grep/depcruise)
4. **Not add vendor SDK imports** without C5 provider plan + C7 review
5. **Not introduce duplicate type definitions** — cross-check with V4 telemetry types and B5 core types
6. **Not access storage/network/env at module scope** in analytical code
7. **Not modify package.json or lockfiles**
8. **Not touch mobile/audio/ops/release paths**
9. **Include a C7 boundary checklist in the PR body** (see V5_RELEASE_GATE.md)
10. **Be scoped to `src/lib/placement/v5/`** — the single permitted V5 landing zone

### Permitted V5 landing zone
```
src/lib/placement/v5/          # V5 analytical modules
src/lib/placement/v5/index.ts  # V5 barrel export
src/components/placement/v5/   # V5 UI components (if approved)
docs/placement/v5/             # V5 documentation (C7-owned)
```

---

## 10. V5 Boundary Approval Chain

```
C1 (scope/inheritance) → C2 (contract map) → C5 (provider plan) → C6 (evaluation plan) → C7 (boundary audit) → C1 (final sign-off)
```

No V5 implementation PR may be created until C1 approves the consolidated discovery. C7 reviews every implementation PR against this document before merge.

---

## Validation

```
npm run typecheck   # must pass
npm run lint        # must pass
npx depcruise src/lib/placement/v5 --config .dependency-cruiser.cjs  # no forbidden imports
grep -r 'Date.now\|Math.random\|fetch(' src/lib/placement/v5/        # must return empty
grep -r 'supabase\|azure' src/lib/placement/v5/ --include='*.ts'     # must return empty (no SDK refs)
```
