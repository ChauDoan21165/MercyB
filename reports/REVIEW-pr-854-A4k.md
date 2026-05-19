# Review — PR #854 (regenerate-db-types.sh rewrite)

**Reviewer:** A4 (read-only)
**Branch:** `review/854-regen-script` (off `origin/main` @ `14e672577`)
**Subject:** [PR #854](https://github.com/ChauDoan21165/MercyB/pull/854) — `fix/regenerate-db-types-output-paths` — `fix(scripts): regenerate-db-types.sh — correct output paths + dual-file invariant`
**Author:** A8h
**Date:** 2026-05-19

---

## TL;DR — VERDICT: ✅ APPROVE (with one sequencing note for #849)

Script is correct, well-defended, and matches the runbook. All 6 brief-mandated checks pass cleanly. The runbook reference to `reports/OPS-database-types-regen-runbook-A8g.md` is correct in intent — that doc lives in companion PR [#849](https://github.com/ChauDoan21165/MercyB/pull/849), still OPEN; if #854 merges before #849 there is a brief dangling-link window.

---

## CI status snapshot

| Check | Result |
|---|---|
| Vercel | ✅ pass |
| Vercel Preview Comments | ✅ pass |
| Build Preview | ⏳ pending |
| Build and Test | ⏳ pending |
| Lighthouse Mobile | ⏳ pending |
| Lint Code | ⏳ pending |
| Validate Rooms | ⏳ pending |

This PR touches only `scripts/regenerate-db-types.sh` and `docs/billing-foundation/runbook.md`. None of the pending checks have substantive bearing on a bash script + markdown change. Pending checks are typical CI lag, not a substantive concern.

---

## 1. Output paths (brief check 2)

✅ **Both target files exist on current main:**

```
-rw-r--r-- 307639 src/integrations/supabase/types.ts
-rw-r--r-- 307639 supabase/functions/_shared/database.types.ts
```

Matching byte counts (`307639` each) and `diff -q` exit 0 — these two files are **already byte-identical on main**, which is exactly the invariant this script enforces post-regeneration. Live-data confirmation that the invariant is achievable in practice today.

The script's hardcoded targets match exactly:

```bash
SPA_TYPES="$REPO_ROOT/src/integrations/supabase/types.ts"
EDGE_TYPES="$REPO_ROOT/supabase/functions/_shared/database.types.ts"
```

---

## 2. project_id parse from supabase/config.toml (brief check 3)

✅ **Parse logic verified empirically.** Live `supabase/config.toml` contains:

```toml
project_id = "buemdfxyhxunzpgdoqin"
```

Running the script's exact awk extractor against this file:

```
extracted: [buemdfxyhxunzpgdoqin]
```

Clean extraction, no leading/trailing whitespace, no quote artifacts. The parse:

```awk
/^[[:space:]]*project_id[[:space:]]*=/ {
  sub(/^[[:space:]]+/, "", $2)        # strip leading spaces after =
  sub(/[[:space:]]*#.*$/, "", $2)     # strip inline comment
  gsub(/^[[:space:]]*"|"[[:space:]]*$/, "", $2)  # strip surrounding quotes
  print $2; exit
}
```

Handles inline comments + surrounding whitespace + surrounding quotes; matches Postgres-style config conventions. The post-extract check rejects empty results with a clean error.

Override behavior: `PROJECT_REF=overridden123 ./scripts/regenerate-db-types.sh --dry-run` correctly bypasses the config.toml read and prints `project_ref = overridden123`. ✅

---

## 3. Dual-file invariant — `diff -q` exit 3 on drift (brief check 4)

✅ **Three layers of defense:**

1. **Pre-mv check** (after both temp generates):
   ```bash
   if ! diff -q "$TMP_SPA" "$TMP_EDGE" > /dev/null; then
     printf 'error: …byte-identical invariant violated.\n' >&2
     diff "$TMP_SPA" "$TMP_EDGE" | head -50 >&2 || true
     exit 3
   fi
   ```
   Catches non-deterministic CLI output BEFORE either canonical file is touched. The first 50 lines of the diff get printed for debug, then `exit 3`.

2. **Stage-then-swap atomicity** — generates go to `mktemp` first, only get `mv`'d into the canonical paths if both invariant checks pass. **No partial-state regen is possible** (SPA updated, edge stale).

3. **Post-mv defensive recheck** — runs the same `diff -q` after the swap. Should always pass if step 1 passed, but is a belt + suspenders for "what if mv corrupted one file?". Also `exit 3`.

Exit-code taxonomy is clean:
- `2` — usage / config error (missing CLI arg, missing config.toml, dir doesn't exist)
- `3` — byte-identical invariant violated (the headline failure mode this script is built to catch)
- `4` — empty output or missing `export type Database` marker (auth/network failure that didn't propagate exit code)

Three distinguishable exit codes for three distinguishable failure modes. Operator can write CI gates against specific exit codes.

---

## 4. `--dry-run` flag (brief check 5)

✅ **Verified empirically from repo root:**

```
[dry-run] would regenerate (no writes):
  project_ref = buemdfxyhxunzpgdoqin
  schema      = public
  ->         /private/tmp/A4k-854-review/src/integrations/supabase/types.ts
  ->         /private/tmp/A4k-854-review/supabase/functions/_shared/database.types.ts
  verify:    diff -q (byte-identical invariant)
```

Honored:
- ✅ Prints what would happen (project_ref, schema, target paths, verify step)
- ✅ Exits 0 cleanly without any writes (no temp files, no `supabase gen types` invocation)
- ✅ Still performs sanity checks on target directories existing (so a misconfiguration is caught even in dry-run)
- ✅ Honors `PROJECT_REF` env override in dry-run
- ✅ Aliased `--dry-run` and `-n`

Also tested `--help` / `-h`: prints a clean usage block extracted from the script's own header via a `sed` self-extraction, exits 0. ✅

---

## 5. `OUTPUT_PATH` env var deliberately removed (brief check 6)

✅ **Verified.** The previous script honored `OUTPUT_PATH="${OUTPUT_PATH:-src/lib/database.types.ts}"` — that default path **doesn't exist on main** (the actual paths are the two listed in §1), so the old default would have silently written to a wrong location.

The new script has zero reference to `OUTPUT_PATH`:
- No `OUTPUT_PATH=…` parsing
- No env var read
- Passing `OUTPUT_PATH=/tmp/x` as an argument gets rejected as an unknown argument with `exit 2`
- Passing `OUTPUT_PATH=/tmp/x` as an env var has no effect — the script doesn't read it, and the targets are repo-relative absolutes

This is the correct architectural choice — the dual-file invariant means the targets are NOT configurable; they're load-bearing constants tied to the structure of the codebase (one for the browser bundle, one for the Deno edge isolate). Allowing override would defeat the invariant.

---

## 6. Runbook update accurate (brief check 7)

✅ **Content verified.** The `## 2) Regenerate DB types` section in `docs/billing-foundation/runbook.md` matches the script's new interface:

```markdown
./scripts/regenerate-db-types.sh             # regenerate both canonical files
./scripts/regenerate-db-types.sh --dry-run   # preview, no writes
```

Plus an accurate paragraph describing: config.toml-as-source-of-truth, the two canonical files, the byte-identical invariant, and a link to the operator runbook.

⚠️ **One sequencing observation (not a blocker):**

The runbook reference `reports/OPS-database-types-regen-runbook-A8g.md` points to a file that **does not exist on main yet**. The file lives in companion PR [#849](https://github.com/ChauDoan21165/MercyB/pull/849) (`docs/database-types-regen-runbook` branch, also OPEN). I verified the file is correctly authored at exactly that path on the #849 branch — so the reference is correct in intent.

**Implication for merge ordering:**
- If #849 merges before/with #854: ✅ link lands live, no issue.
- If #854 merges before #849: ⚠️ brief dangling-link window in `docs/billing-foundation/runbook.md` until #849 lands. Operator who follows the runbook between merges will hit "file not found" when clicking the link.

This is a **minor doc-coordination issue, not a defect in #854 itself.** The cleanest fix is to merge #849 first (or together). Alternatively, the line could be commented out in #854 with a TODO, but that adds churn for little gain — the dangling window is small and the doc IS coming.

Not blocking. Flag for Chau's merge order awareness.

---

## 7. Additional positive findings

Beyond the brief's checks, several deliberate engineering choices stood out:

1. **Repo-root resolution from script location** (`SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"` + `REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"`) — the script works regardless of operator cwd. Important for an operator tool that might get run from anywhere.
2. **Target directory existence check** — runs even in dry-run, so a structural misconfiguration is caught immediately rather than after `supabase gen types` produces output that gets written nowhere.
3. **`set -euo pipefail`** — bash strict mode applied at the top.
4. **`trap cleanup EXIT`** + explicit `TMP_SPA=""` / `TMP_EDGE=""` clearing after successful `mv` — prevents the trap from re-deleting already-moved temp files on the success path. Subtle but correct.
5. **Empty-output detection (`[[ ! -s "$tmp" ]]`)** — catches the silent-auth-failure case where `supabase gen types` exits 0 but produces an empty file. The accompanying `grep -q '^export type Database'` marker check catches the related "produced something but not the expected shape" case. Both exit `4`, distinct from the invariant-violation exit `3`.
6. **CLI prerequisites documented inline** — header lists `npx supabase --version` and `supabase login` as prereqs, so a fresh operator doesn't get a confusing failure from the gen step.
7. **Documented failure-recovery path** — references PR #849 as the finding source, so future readers can trace why the script was rewritten.

---

## 8. Caveats and risks (none blocking)

1. **`npx supabase` doesn't pin a CLI version.** The runbook says "npx supabase --version (CLI installed)" but doesn't specify a version. If supabase-cli releases a breaking change in its `gen types typescript` output format, this script could produce diffs that fail the byte-identical invariant for non-schema reasons. Acceptable for an operator tool that's run manually and infrequently; would be more concerning in CI. Not a #854 issue.
2. **`SCHEMA` env var hardcoded default `public`.** Other schemas (e.g., `auth`, `storage`) are not generated by this script. The runbook's example doesn't mention schema overrides. Fine for the current scope (the project uses public for app code), but if a future feature needs `auth` schema types, the script would need a small extension to handle multi-schema generation. Out of scope.

Neither caveat is a #854 defect; both are observations about the broader system.

---

## 9. VERDICT — ✅ APPROVE

All 6 brief-mandated checks pass:

| Brief check | Status |
|---|---|
| Two output paths correct + exist on main | ✅ verified empirically |
| `project_id` parse extracts `buemdfxyhxunzpgdoqin` | ✅ verified empirically |
| Dual-file invariant — `diff -q` exit 3 on drift | ✅ verified (3 layers of defense) |
| `--dry-run` works as documented | ✅ verified empirically |
| `OUTPUT_PATH` env var deliberately removed | ✅ verified empirically |
| `docs/billing-foundation/runbook.md` update accurate | ✅ verified — one sequencing note for #849 |

The script is more defensive than the brief required: pre/post-mv invariant checks, atomic stage-then-swap, distinguishable exit codes for distinct failure modes, empty-output detection, schema-marker check, repo-root resolution, dry-run that still validates structure. Operator can rely on this.

**Merge order recommendation:** land **#849 before/with #854** to avoid a brief dangling-link window in the runbook. Both are doc/script-only — no functional risk in either order.

---

## References

- [PR #854](https://github.com/ChauDoan21165/MercyB/pull/854) — `fix(scripts): regenerate-db-types.sh — correct output paths + dual-file invariant` (this review's subject)
- [PR #849](https://github.com/ChauDoan21165/MercyB/pull/849) — A8g operator runbook for the regen workflow (companion doc, OPEN — see §6 sequencing note)
- [PR #789](https://github.com/ChauDoan21165/MercyB/pull/789) — entitlements table migration (a recent example of when this script needs to run)
- [PR #832](https://github.com/ChauDoan21165/MercyB/pull/832) — `recompute_entitlement_tx` RPC migration (same)
- `docs/billing-foundation/runbook.md` — operator runbook updated by this PR
- `scripts/regenerate-db-types.sh` — the rewritten operator script
- Memory: `project_db_schema_drift_audit` — context for why types regeneration matters in a schema-drift-heavy project
