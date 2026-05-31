// =============================================================================
// dependency-cruiser — ORPHAN / DEAD-CODE SCAN (non-blocking, info-level)
// =============================================================================
//
// Separate from `.dependency-cruiser.cjs` (which enforces architectural
// boundaries at severity:error and MUST stay green). This config carries only
// `severity: 'warn'` rules, so `depcruise --output-type err` exits 0 even when
// it reports candidates — it never fails CI. It is wired into the existing
// `module-boundaries` job via `npm run depcruise:orphans || true`.
//
// PURPOSE: a tripwire against dead-code *reaccumulation*. It surfaces files that
// became orphans (nothing imports them, they import nothing) so a reviewer sees
// "new orphan detected" on the PR that introduced it — cheaper than a quarterly
// 800-candidate sweep. It is NOT a deletion oracle; see
// `docs/dead-code-risk-map.md` for the full tiered inventory and the
// false-positive classes (dynamic template-literal imports, test-only modules,
// dead islands) that a pure orphan check cannot see.
//
// KNOWN-DYNAMIC EXCLUSIONS: `src/components/mercy-guide/kids/kidPage*Data.ts`
// are loaded by `kidsDataLoader.ts` via `import(`./kids/kidPage${n}Data`)`.
// dependency-cruiser cannot resolve template-literal specifiers, so without
// this exclusion every kids data file is a false orphan. If you add another
// template-literal/registry loader, exclude its targets here too.

const base = require('./.dependency-cruiser.cjs');

module.exports = {
  forbidden: [
    {
      name: 'no-new-orphans',
      severity: 'warn',
      comment:
        'File has no incoming AND no outgoing dependencies — likely dead. If it ' +
        'is reached dynamically (string/template-literal import, runtime registry), ' +
        'either wire the reference statically or add it to the exclusions in ' +
        '.dependency-cruiser.orphans.cjs with a comment citing the loader.',
      from: {
        orphan: true,
        pathNot: [
          '\\.d\\.ts$',
          '\\.(json|css|svg|png|jpg|jpeg|webp|mp3|txt|md)$',
          '(^|/)vite-env',
          '\\.config\\.(ts|js|cjs|mjs)$',
          '^src/main\\.tsx$',
          '\\.(test|spec)\\.(ts|tsx)$',
          '__tests__/',
          '^src/test/',
          // Dynamically loaded by kidsDataLoader.ts (template-literal import) —
          // depcruise-blind, NOT dead. See header note.
          '^src/components/mercy-guide/kids/kidPage\\d+Data\\.',
        ],
      },
      to: {},
    },
  ],
  options: {
    ...base.options,
    // Tests are excluded from the orphan graph here: a test file imports nothing
    // that imports it, so it would always read as an orphan. Reachability/test-only
    // analysis lives in the one-time risk-map doc, not this per-PR tripwire.
  },
};
