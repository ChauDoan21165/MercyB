# `database.types.ts` Regen Runbook — Post #789 + #832 Apply (A8g)

**Agent:** A8g (operator runbook, doc-only) · **Branch:** `docs/database-types-regen-runbook`
**Project ref (verified):** `buemdfxyhxunzpgdoqin` (canonical, from `supabase/config.toml:3`)
**Labels:** ops, db-types, A18-unblock
**Trigger condition:** **AFTER** PR #789's migration (`20260519230000_create_entitlements_table.sql`) AND PR #832's migration (`20260519250000_create_recompute_entitlement_tx_rpc.sql`) are both **SQL-Editor-applied** to prod by Chau. Order matters — see §1.

> **Purpose.** Closes A8f (PR #836) procedural follow-up #1: regenerate the TS-side generated types so `Database['public']['Functions']['recompute_entitlement_tx']` lands and A18 PR1 can call the RPC without an `as any` cast. Two byte-identical generated files must be regenerated and kept in sync — §3 covers both.

---

## 0. Important repo facts (verified at runbook-write time)

These contradict the dispatch's command sketch and the existing helper script. Use the numbers below, not the sketch.

| Fact | Value | Source |
|---|---|---|
| **Project ref** | `buemdfxyhxunzpgdoqin` | `supabase/config.toml:3` |
| **TWO canonical generated files, byte-identical on `origin/main`** | `src/integrations/supabase/types.ts` (10,248 lines) — browser/SPA; `supabase/functions/_shared/database.types.ts` (10,248 lines) — Deno edge functions | `diff -q` returns equal at `295dfbc10` |
| **There is NO `src/lib/database.types.ts`** | does not exist in this repo | the existing `scripts/regenerate-db-types.sh` defaults `OUTPUT_PATH` to that wrong path; do not rely on the default |
| **Schema** | `public` | every entitlements + RPC object created by #789/#832 lives in `public.` |
| **CLI auth required** | `supabase login` (interactive, one-time per shell session) | otherwise `gen types` returns 401 |
| **#789 status** | merged to `origin/main` @ `295dfbc10` | code is on main; SQL Editor apply is a separate Chau action |
| **#832 status** | **OPEN** at runbook-write time | merge + Chau SQL Editor apply both required before regen will see the RPC |

---

## 1. Prerequisites (run in this order)

1. **PR #789 merged AND its migration applied to prod via Supabase SQL Editor.** Verify with the queries in PR #820 §9 step 3. The `public.entitlements` table must exist on prod; otherwise `gen types` will not include it.
2. **PR #832 merged AND its migration applied to prod via Supabase SQL Editor** (strict order — applies *after* #789; the RPC's body references `public.entitlements`). Verify with the §(a) signature check in #832's commented verify block (file: `supabase/migrations/20260519250000_create_recompute_entitlement_tx_rpc.sql`, lines starting with `-- (a) Function exists with the expected 6-arg signature`).
3. **Supabase CLI installed and authenticated:**
   ```bash
   supabase --version    # any 1.x is fine; bump if older than 1.50
   supabase login        # interactive; one-time per shell
   ```

If any prerequisite is unmet: **stop, complete the prereq, do NOT regen** — a partial regen against a prod that lacks the table/RPC will silently overwrite the existing types files with a version that omits other recent objects (because the local migration set ≠ prod state).

---

## 2. The exact regen command (use this, not the existing script)

The repo's `scripts/regenerate-db-types.sh` defaults `OUTPUT_PATH=src/lib/database.types.ts` — a path that **does not exist** in this repo. Override `OUTPUT_PATH` explicitly, or run the raw `npx` command. Both forms below are equivalent.

### Form A — raw `npx` (recommended for clarity, no script edit needed)

Run **TWICE**, once per canonical file:

```bash
# (1) Browser/SPA copy
npx supabase gen types typescript \
  --project-id buemdfxyhxunzpgdoqin \
  --schema public \
  > src/integrations/supabase/types.ts

# (2) Edge-function copy — A18 PR1's recompute.ts imports from here
npx supabase gen types typescript \
  --project-id buemdfxyhxunzpgdoqin \
  --schema public \
  > supabase/functions/_shared/database.types.ts
```

Both outputs **must** be byte-identical (same prod schema, same command). The current `origin/main` files are already byte-identical (`diff -q` returns equal) — preserve that invariant post-regen.

### Form B — via the existing script (with OUTPUT_PATH override)

```bash
PROJECT_REF=buemdfxyhxunzpgdoqin \
  OUTPUT_PATH=src/integrations/supabase/types.ts \
  ./scripts/regenerate-db-types.sh

PROJECT_REF=buemdfxyhxunzpgdoqin \
  OUTPUT_PATH=supabase/functions/_shared/database.types.ts \
  ./scripts/regenerate-db-types.sh
```

Both forms are non-destructive — they write to `> file` (truncate then write); the prior content is replaced only after `gen types` produces output, so an auth failure / network error leaves the existing file intact.

---

## 3. Post-regen verification (every check must pass before commit)

### 3.1 Confirm the two files are still byte-identical

```bash
diff -q src/integrations/supabase/types.ts \
        supabase/functions/_shared/database.types.ts
# expect: (no output — files are identical)
```

If `diff` reports a difference, regen one of them again with the **same** command form. Drift between the two is forbidden — both consumers (`src/` SPA and `supabase/functions/` Deno edge) must see identical schema definitions.

### 3.2 Confirm `entitlements` table appears

```bash
grep -n '^      entitlements:' src/integrations/supabase/types.ts | head
# expect: ONE line, in the public Tables block (line number will vary).
# Verify the block contains: user_id/app_id/status/source/expires_at/
# is_premium/computed_at/updated_at. Spot-check that status is typed as
# the 8-string-literal union (or as the supabase enum form) — not a
# bare 'string'.
```

Compare against the pre-regen state to make sure the table was actually added (it was not present at `295dfbc10`):

```bash
git diff src/integrations/supabase/types.ts | grep '^\+.*entitlements' | head
# expect: several green lines — entitlements Row/Insert/Update interfaces.
```

### 3.3 Confirm `recompute_entitlement_tx` appears under `Functions`

```bash
grep -n 'recompute_entitlement_tx' src/integrations/supabase/types.ts | head
# expect: at least one hit, inside the public.Functions block. The Args
# member should list p_user_id / p_app_id / p_status / p_source /
# p_expires_at / p_computed_at — the 6 args per A8f's verify.
# Returns should reference the entitlements Row type (or its inline
# equivalent).
```

If either of these is missing → the migration was **not** applied to prod. Stop, re-run §1 prereqs.

### 3.4 Confirm no existing types were accidentally dropped

```bash
git diff --stat src/integrations/supabase/types.ts \
                supabase/functions/_shared/database.types.ts
# expect: two files, both +N/-M with N substantially > M.
# A regen that ADDS entitlements + recompute_entitlement_tx should be net
# additive (~80-150 insertions, ~0-5 deletions). A diff that DELETES
# tables/functions you recognize from main is a RED FLAG — abort and
# investigate (§5 risk).
```

Concretely, inspect deletions:

```bash
git diff src/integrations/supabase/types.ts | grep '^-' | grep -v '^---' | head -30
# expect: deletions are typically just timestamp/formatting changes
# in unrelated rows, NOT removed Table or Function interfaces.
```

### 3.5 TypeScript still compiles

```bash
npm run typecheck:ci   # CLAUDE.md commands — runs bare `tsc --noEmit` against tsconfig.json
# expect: clean. If a callsite typechecks because the regen tightened a
# field that used to be wider, that is a real shift to flag (not a
# blocker per se, but worth a one-line note in the commit message).
```

If `typecheck:ci` is RED on something unrelated to the new objects — **do NOT commit the regen blindly.** Investigate. The most likely cause is a parallel schema drift on prod that the regen surfaced; revert the regen, file a separate scoping recon.

---

## 4. Commit + open PR

Once §3 is all-green:

```bash
git add src/integrations/supabase/types.ts \
        supabase/functions/_shared/database.types.ts
git commit -m "chore(types): regenerate db types — entitlements table + recompute_entitlement_tx RPC

Post-apply regen for PR #789 (entitlements table) + PR #832
(recompute_entitlement_tx RPC). Closes A8f (PR #836) procedural
follow-up #1. Both canonical files kept in sync (diff -q clean).

Verification: §3 of reports/OPS-database-types-regen-runbook-A8g.md
all-green pre-commit."
```

Open the PR with a short body — this is a generated-files commit, no design discussion needed. Title suggestion: `chore(types): regenerate db types — entitlements + recompute_entitlement_tx (post #789 + #832 apply)`.

---

## 5. After the regen lands — A18 PR1 follow-up (forward-looking)

A18 PR1 is currently planned to call the RPC with an explicit return-type assertion:

```ts
const { data, error } = await supabase.rpc('recompute_entitlement_tx', { /* …6 args… */ });
if (error) { /* fail loud */ throw error; }
const row = data as EntitlementRow;   // ← explicit assertion, A8f follow-up #2
```

**This is the intended landing shape** for A18 PR1, because at PR1 dispatch time the generated `Database['public']['Functions']['recompute_entitlement_tx']` does not yet exist on `main`. After the regen in this runbook lands, the generated `Functions` member becomes available — at that point, **open a small follow-up PR** that:

1. Removes the `as EntitlementRow` cast.
2. Lets supabase-js infer the return type from the regenerated `Database` type:
   ```ts
   const { data, error } = await supabase
     .rpc<'recompute_entitlement_tx'>('recompute_entitlement_tx', { /* …args… */ });
   // `data` is now typed as the generated entitlements Row directly.
   ```
3. Keeps `EntitlementRow` as a local alias only if A18 PR1's signature publicly returns it (`Promise<EntitlementRow>`); otherwise drop it.

**Important: this is a strict improvement, NOT a merge blocker for A18 PR1.** A18 PR1 ships with the explicit assertion, runs in prod correctly, and the cast removal lands later as housekeeping. Sequencing:

```
#789 merged                       ✅ (on main @ 295dfbc10)
#832 merged                       ← pending review
   ↓
Chau SQL-Editor-applies #789      ← Chau action, D6
Chau SQL-Editor-applies #832      ← Chau action, D6 (strict order — table first)
   ↓
THIS regen lands as a chore PR    ← uses §2 commands; verified by §3
   ↓
A18 PR1 dispatches                ← uses `as EntitlementRow` cast (still fine)
A18 PR1 merges                    ← writer + tests + 4 deletions + stripe rewire
   ↓
Cast-removal follow-up PR         ← strict improvement, no behavior change
```

---

## 6. Risk register

| Risk | Severity | Detection | Mitigation |
|---|---|---|---|
| **Regen run before #832 applied to prod** | High | §3.3 `recompute_entitlement_tx` grep returns nothing. | Abort, rerun §1 prereqs, regen again. The two files were rewritten; revert via `git restore src/integrations/supabase/types.ts supabase/functions/_shared/database.types.ts` to the pre-regen state, then start over. |
| **Two canonical files drift apart** | High | §3.1 `diff -q` reports a difference. | Re-run the regen command for whichever file is stale, using the *same* form (A or B). Do not hand-edit. |
| **Regen surfaces unrelated prod schema drift** (e.g., a table/function that exists on prod but not in `supabase/migrations/`) | Medium | §3.4 `git diff --stat` shows a net +N/-M with M much larger than expected; spot-check shows known objects deleted *or* unknown ones added. | Abort, do **NOT** commit. The regen is reflecting prod reality; the drift was already there before. File a separate scoping recon (memory: `db-schema-drift-audit`). Revert with `git restore` on both files. |
| **TypeScript breaks on a tightened type** (regen narrows a column from `string` to a literal union, e.g.) | Low | §3.5 `npm run typecheck:ci` RED on a callsite using the narrowed column. | Real shift — fix the callsite in the same PR. Note in commit body. (Not a regen abort; this is the regen working as intended.) |
| **CLI auth expired mid-run** | Low | `gen types` returns 401 and produces an empty / error file. | Detected by file size — both targets should be ~10k lines after a real regen; an auth-failure run produces a few hundred lines or a JSON error. Re-`supabase login`, re-run. The redirect (`> file`) truncated the target only after the command's stderr error, so the file is mangled; restore from git, re-run. |
| **Network blip during regen** | Low | Same as above (empty/short file). | Same mitigation — restore and re-run. |

**Hard rule:** *only commit when §3 is fully green AND no §6 mitigation was triggered.* Do not commit "to fix in a follow-up" — the generated files are 10k+ lines; partial-state files break edge functions and SPA simultaneously.

---

## 7. References

- A8f (PR #836) — type-alignment verify that flagged this regen as procedural follow-up #1.
- A8d (PR #820) — #789 migration pre-apply verify; §9 has the entitlements-table verification SQL Chau runs to confirm prereq §1.1.
- PR #789 — entitlements table (merged @ `295dfbc10`).
- PR #832 — `recompute_entitlement_tx` RPC (open).
- PR #815 — A18 readiness audit (this regen flips A18 G2-types from "needs cast" to "fully typed").
- `supabase/config.toml:3` — project ref source.
- `scripts/regenerate-db-types.sh` — existing helper (defaults wrong, override `OUTPUT_PATH` per §2 Form B).

---

## Status

- **No code touched.** No `types.ts` regenerated by A8g — that is Chau's action per this runbook.
- **No SQL executed.**
- **No production data touched.**
- Pure documentation PR.

*A8g — operator runbook. Chau runs §2 once both #789 and #832 are SQL-Editor-applied. The regenerated-types commit is its own small PR; A18 PR1 dispatches independently and the cast removal is a follow-up.*
