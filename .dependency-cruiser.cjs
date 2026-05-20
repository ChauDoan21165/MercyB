// .dependency-cruiser.cjs
//
// Locks architectural module boundaries for src/, supabase/functions/,
// server/, and scripts/. Run via `npm run depcruise` (added to package.json)
// or directly: `npx depcruise --config .dependency-cruiser.cjs src`.
//
// CI wiring: a non-blocking "Module Boundaries" job in .github/workflows/ci.yml
// runs `npm run depcruise:validate` after each PR. Errors fail that job but
// the job is NOT added to the branch-protection required-checks ruleset yet
// — per the A13 brief, that promotion happens after ~1 week of stability so
// real false positives can be addressed without blocking merges.
//
// Rule layout:
//   forbidden[] — severity:error / severity:warn
//   options{}   — exclude tests, generated types, vendored content
//
// Tightening protocol: when a rule needs to add a grandfather exception,
// add it to that rule's `from.pathNot` or `to.pathNot` with an inline TODO
// citing the cleanup PR number, NOT by demoting the severity.

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    // ── ERRORS — fail the depcruise job on hit ────────────────────────

    {
      name: 'no-ui-to-edge-functions',
      severity: 'error',
      comment:
        'src/components/** must NOT import supabase/functions/** — UI bundle cannot ship Deno edge-function code.',
      from: { path: '^src/components' },
      to: { path: '^supabase/functions' },
    },
    {
      name: 'no-ui-to-server',
      severity: 'error',
      comment:
        'src/components/** must NOT import server/** — UI bundle cannot ship server-only code.',
      from: { path: '^src/components' },
      to: { path: '^server/' },
    },
    {
      name: 'no-billing-to-ui',
      severity: 'error',
      comment:
        'src/billing/** must NOT import src/components/** — business logic depending on UI components is a cycle waiting to happen.',
      from: { path: '^src/billing' },
      to: { path: '^src/components' },
    },
    {
      name: 'no-teacher-mercy-to-ui',
      severity: 'error',
      comment:
        'src/lib/teacher-mercy/** must NOT import src/components/** — teacher-mercy engine is core domain; UI imports inverted.',
      from: { path: '^src/lib/teacher-mercy' },
      to: { path: '^src/components' },
    },
    {
      name: 'no-services-to-ui',
      severity: 'error',
      comment:
        'src/services/** must NOT import src/components/** — service layer depends on data + types, never UI.',
      from: { path: '^src/services' },
      to: { path: '^src/components' },
    },
    {
      name: 'no-hooks-to-ui',
      severity: 'error',
      comment:
        'src/hooks/** must NOT import src/components/** at runtime — hooks are state primitives, not UI consumers. Type-only imports are exempt (see dependencyTypesNot below) since they compile away to zero runtime bytes; the shadcn pattern (a hook in src/hooks/ type-coupled to its own UI primitive in src/components/ui/) is intentional and architecturally sound.',
      from: {
        path: '^src/hooks/',
        // No grandfather exceptions needed after the A13 cleanup cascade:
        //   - `use-toast.ts` (shadcn type-only pattern) is covered by
        //     `to.dependencyTypesNot: ['type-only']` below (#898 / A13-cleanup-1).
        //   - `useTeacherMercy.ts` no longer exists (#899 / A13-cleanup-2
        //     deletes the orphan file).
        // If future regressions surface, add a TODO-tagged entry here
        // citing the cleanup PR number rather than demoting severity.
      },
      to: {
        path: '^src/components',
        // Type-only imports compile away — they create no runtime
        // architectural coupling. The shadcn pattern (e.g. use-toast.ts
        // doing `import type { ToastActionElement, ToastProps } from
        // '@/components/ui/toast'`) is endorsed by the design system and
        // by 6502 GitHub stars of shadcn convention. Without this
        // exemption, depcruise's `tsPreCompilationDeps: true` follows
        // type-only edges and flags shadcn hooks as violations. With it,
        // a hook's *value* import of a UI component is still an error.
        dependencyTypesNot: ['type-only'],
      },
    },
    {
      name: 'no-src-to-scripts',
      severity: 'error',
      comment:
        'src/** must NOT import scripts/** — scripts are operator tooling, not app dependencies.',
      from: { path: '^src/' },
      to: { path: '^scripts/' },
    },
    {
      name: 'no-direct-node-modules',
      severity: 'error',
      comment:
        'Never import via a node_modules/ path directly — always use the package name so module resolution + bundling work correctly.',
      from: {},
      to: { path: 'node_modules/' },
    },

    // ── WARNINGS — informational, do not fail CI ─────────────────────

    {
      name: 'cross-feature-room-to-auth',
      severity: 'warn',
      comment:
        'Cross-feature import room→auth. If genuinely needed, extract the shared piece into src/lib/ or src/hooks/.',
      from: { path: '^src/components/room/' },
      to: { path: '^src/components/auth/' },
    },
    {
      name: 'cross-feature-auth-to-room',
      severity: 'warn',
      comment:
        'Cross-feature import auth→room. If genuinely needed, extract the shared piece into src/lib/ or src/hooks/.',
      from: { path: '^src/components/auth/' },
      to: { path: '^src/components/room/' },
    },
    {
      name: 'no-circular',
      severity: 'warn',
      comment:
        'Circular dependency detected. Refactor: typically extract the shared piece into a third module that both can depend on. ' +
        'Note: cycles whose members contain any type-only edge (`import type { X } from ...`) are excluded — those edges compile to zero runtime bytes and cannot form a real cycle at execution time. ' +
        'This is the same pattern #898 applies to no-hooks-to-ui for the shadcn type-only coupling.',
      from: {},
      to: {
        circular: true,
        // `viaOnly` matches cycles only when EVERY edge in the cycle
        // satisfies the criterion. `dependencyTypesNot: ['type-only']`
        // means "no edge in the cycle is a type-only import" — so a
        // cycle that closes via even one `import type ...` is excluded.
        // `tsPreCompilationDeps: true` (set on this config) follows
        // type-only edges for cross-layer type-name leak detection,
        // which is useful but produces no-circular false positives
        // because such edges disappear at compile time.
        viaOnly: { dependencyTypesNot: ['type-only'] },
      },
    },
    // Large-file detection (>800 lines) is intentionally NOT a depcruise rule —
    // depcruise doesn't measure file size. The brief's preventive flag for big
    // central files (RoomRenderer.tsx etc.) is handled by depcruise's
    // `--metrics` / `--output-type metrics` reporters, which the CI job emits
    // alongside the validate pass. See .github/workflows/ci.yml job
    // "Module Boundaries" for the metrics step.
  ],

  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    exclude: {
      // Tests + generated files are not subject to the boundary rules.
      path: [
        '__tests__/',
        '\\.test\\.(ts|tsx)$',
        '\\.spec\\.(ts|tsx)$',
        '^src/integrations/supabase/types\\.ts$',
        '^supabase/functions/_shared/database\\.types\\.ts$',
        '^dist/',
        '^coverage/',
        '^playwright-report/',
        '^test-results/',
        '^node_modules/',
        '^public/',
        '^ios/',
        '^android/',
      ],
    },
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    reporterOptions: {
      text: { highlightFocused: true },
    },
  },
};
