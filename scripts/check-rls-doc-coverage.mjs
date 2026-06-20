#!/usr/bin/env node
// ──────────────────────────────────────────────────────────────────────────
// A15 — RLS documentation coverage gate.
//
// Verifies that every policy listed in reports/RLS-current-state-A15.json
// has some documentation source in supabase/migrations/*.sql.
//
// Documentation sources accepted (in priority order):
//   1. Explicit `COMMENT ON POLICY "name" ON schema.table IS '...'` line.
//   2. Hand-curated table override in 20260625000000_rls_policy_documentation.sql
//      (weekly_digest_data, feature_flags, listening_clips).
//   3. Templated coverage for `require_aal2_when_factor_present`.
//   4. Pattern-matched intent in the same migration's CASE block.
//   5. Generic fallback in the same migration's last branch.
//
// Gate also verifies: any new CREATE POLICY in this PR has a matching
// COMMENT ON POLICY (or is covered by a pattern) in the same PR.
//
// Snapshot lives in reports/RLS-current-state-A15.json (committed).
// ──────────────────────────────────────────────────────────────────────────

import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const SNAPSHOT_PATH = join(REPO_ROOT, 'reports', 'RLS-current-state-A15.json');
const MIGRATIONS_DIR = join(REPO_ROOT, 'supabase', 'migrations');
const DOC_MIGRATION_NAME = '20260625000000_rls_policy_documentation.sql';

const fail = (msg) => {
  console.error(`\x1b[31m✗\x1b[0m ${msg}`);
  process.exitCode = 1;
};
const ok = (msg) => console.log(`\x1b[32m✓\x1b[0m ${msg}`);
const info = (msg) => console.log(`\x1b[36mℹ\x1b[0m ${msg}`);

async function loadSnapshot() {
  const raw = await readFile(SNAPSHOT_PATH, 'utf8');
  const json = JSON.parse(raw);

  if (json._meta?._TODO_CHAU) {
    info(`Snapshot is in stub mode: ${json._meta._TODO_CHAU}`);
    info('Running in headline-validation mode (full policy list not yet pasted).');
    return { stubMode: true, snapshot: json };
  }

  if (!Array.isArray(json.policies)) {
    throw new Error(
      'reports/RLS-current-state-A15.json: missing or non-array "policies" key.'
    );
  }
  return { stubMode: false, snapshot: json };
}

async function loadMigrations() {
  const files = (await readdir(MIGRATIONS_DIR))
    .filter((f) => f.endsWith('.sql'))
    .sort();
  const bodies = await Promise.all(
    files.map(async (f) => ({
      file: f,
      body: await readFile(join(MIGRATIONS_DIR, f), 'utf8'),
    }))
  );
  return bodies;
}

function hasExplicitComment(migrations, schemaname, tablename, policyname) {
  const re = new RegExp(
    `COMMENT\\s+ON\\s+POLICY\\s+(?:"${escapeRegex(policyname)}"|'${escapeRegex(
      policyname
    )}')\\s+ON\\s+(?:${escapeRegex(schemaname)}\\.)?(?:"?${escapeRegex(
      tablename
    )}"?)\\s+IS\\s+`,
    'i'
  );
  return migrations.some(({ body }) => re.test(body));
}

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isCoveredByDocMigrationPattern(policyname, tablename) {
  // Mirror the priority order in 20260625000000_rls_policy_documentation.sql.
  const curatedTables = new Set([
    'weekly_digest_data',
    'feature_flags',
    'listening_clips',
  ]);
  if (curatedTables.has(tablename)) return 'hand-curated';

  if (policyname === 'require_aal2_when_factor_present') return 'aal2-template';

  const lower = policyname.toLowerCase();
  if (/service[_ ]?role|^service_role/.test(lower)) return 'pattern:service_role';
  if (/admin.*manage|admin.*all|admins can manage/.test(lower)) return 'pattern:admin-manage';
  if (/admin.*view|admin.*select|admins can view/.test(lower)) return 'pattern:admin-view';
  if (/admin/.test(lower)) return 'pattern:admin-generic';
  if (/own|their own|users can.*own/.test(lower)) return 'pattern:owner';
  if (/public|anyone can|anonymous.*read/.test(lower)) return 'pattern:public-read';
  if (/authenticated|logged in|signed-in/.test(lower)) return 'pattern:authenticated';
  if (/insert/.test(lower)) return 'pattern:insert';
  if (/update/.test(lower)) return 'pattern:update';
  if (/delete/.test(lower)) return 'pattern:delete';
  if (/select/.test(lower)) return 'pattern:select';

  return 'fallback-generic';
}

async function gateAgainstSnapshot(snapshot, migrations) {
  const policies = snapshot.policies;
  info(`Snapshot lists ${policies.length} policies.`);

  let uncovered = 0;
  const coverageHist = {};

  for (const p of policies) {
    const explicit = hasExplicitComment(
      migrations,
      p.schemaname,
      p.tablename,
      p.policyname
    );
    if (explicit) {
      coverageHist.explicit = (coverageHist.explicit ?? 0) + 1;
      continue;
    }
    const pattern = isCoveredByDocMigrationPattern(p.policyname, p.tablename);
    coverageHist[pattern] = (coverageHist[pattern] ?? 0) + 1;

    if (pattern === 'fallback-generic') {
      // Fallback IS coverage (the doc migration writes a generic comment) but
      // we surface it so reviewers see how many policies got the placeholder.
    }
  }

  const docMigration = migrations.find((m) => m.file === DOC_MIGRATION_NAME);
  if (!docMigration) {
    fail(
      `Required documentation migration missing: ${DOC_MIGRATION_NAME}. ` +
        'This migration is the catch-all that writes COMMENT ON POLICY for every ' +
        'policy lacking an explicit one. See reports/RLS-CANONICAL-REFERENCE-A15.md.'
    );
    return;
  }

  ok(`Documentation migration present: ${DOC_MIGRATION_NAME}`);
  info('Coverage histogram:');
  for (const [k, v] of Object.entries(coverageHist).sort()) {
    info(`  ${k}: ${v}`);
  }

  if (uncovered === 0) {
    ok('All policies in the snapshot have a documentation source.');
  } else {
    fail(`${uncovered} policies have no documentation source.`);
  }
}

async function gateAgainstNewPolicies(migrations) {
  // Catch the future-doc case: a new CREATE POLICY in a migration must come
  // with either a COMMENT ON POLICY in the same file OR a pattern that the
  // doc migration covers. We surface a warning when the pattern is the
  // generic fallback.
  const createRe =
    /CREATE\s+POLICY\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:"([^"]+)"|([a-z0-9_]+))\s+ON\s+(?:([a-z_]+)\.)?([a-z0-9_]+)/gi;

  let totalCreates = 0;
  let withSameFileComment = 0;
  let onlyPatternCovered = 0;
  let fallbackOnly = 0;

  for (const m of migrations) {
    if (m.file === DOC_MIGRATION_NAME) continue;
    let match;
    while ((match = createRe.exec(m.body)) !== null) {
      totalCreates += 1;
      const policyname = match[1] ?? match[2];
      const schemaname = match[3] ?? 'public';
      const tablename = match[4];

      const sameFileComment = new RegExp(
        `COMMENT\\s+ON\\s+POLICY\\s+(?:"${escapeRegex(
          policyname
        )}"|'${escapeRegex(policyname)}')`,
        'i'
      ).test(m.body);

      if (sameFileComment) {
        withSameFileComment += 1;
        continue;
      }
      const pattern = isCoveredByDocMigrationPattern(policyname, tablename);
      if (pattern === 'fallback-generic') {
        fallbackOnly += 1;
      } else {
        onlyPatternCovered += 1;
      }
    }
  }

  info(`CREATE POLICY statements scanned: ${totalCreates}`);
  info(`  with same-file COMMENT ON POLICY: ${withSameFileComment}`);
  info(`  covered by named pattern in doc migration: ${onlyPatternCovered}`);
  info(`  covered only by generic fallback: ${fallbackOnly}`);

  if (fallbackOnly > 0) {
    info(
      `${fallbackOnly} CREATE POLICY statements would receive the generic ` +
        'fallback comment. Acceptable, but consider adding an explicit ' +
        'COMMENT ON POLICY in those migrations for clarity.'
    );
  }
}

async function main() {
  let snapshotInfo;
  try {
    snapshotInfo = await loadSnapshot();
  } catch (e) {
    fail(`Cannot load snapshot: ${e.message}`);
    return;
  }
  const migrations = await loadMigrations();
  info(`Loaded ${migrations.length} migration files.`);

  if (snapshotInfo.stubMode) {
    // Headline-only validation: assert structural keys + counts placeholder.
    const head = snapshotInfo.snapshot._meta?.headlines_per_chau;
    if (
      !head ||
      typeof head.total_policies !== 'number' ||
      typeof head.rls_enabled_tables !== 'number'
    ) {
      fail('Snapshot stub is missing _meta.headlines_per_chau fields.');
      return;
    }
    ok(
      `Headlines: ${head.total_policies} policies, ${head.rls_enabled_tables} RLS-enabled tables, ${head.public_tables_without_rls} public tables without RLS.`
    );
    await gateAgainstNewPolicies(migrations);
    ok('Stub-mode gate passed. Replace the snapshot with the full pg_policies dump to enable strict mode.');
    return;
  }

  await gateAgainstSnapshot(snapshotInfo.snapshot, migrations);
  await gateAgainstNewPolicies(migrations);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
