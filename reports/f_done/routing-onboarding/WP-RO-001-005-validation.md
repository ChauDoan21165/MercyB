# Routing-Onboarding F Validation: WP-RO-001..005

Worker: F
Lane: routing-onboarding
Batch: 1

## Commands

```bash
node -e "const fs=require('fs'); const j=JSON.parse(fs.readFileSync('reports/routing-onboarding-workpacks.json','utf8')); const keys=new Set(); for (const wp of j.workpacks){ if(keys.has(wp.semantic_key)) throw new Error('dup '+wp.semantic_key); keys.add(wp.semantic_key); if(!wp.wp_id||!wp.source_files?.length||!wp.objective||!wp.acceptance_tests||!wp.validation_commands?.length||!wp.anti_fake_checks?.length) throw new Error('bad '+wp.wp_id); } console.log(j.lane_id, j.workpacks.length, keys.size);"
npm run factory-runtime -- init-lane routing-onboarding
npm run factory-runtime -- import-workpacks routing-onboarding reports/routing-onboarding-workpacks.json
npm run factory-runtime -- status routing-onboarding
```

Result: passed. Imported 45 workpacks with `verified=0`.

```bash
npx eslint src/lib/languagePair/__tests__/languagePair.test.ts
```

Result: passed.

```bash
npx vitest run src/lib/languagePair/__tests__/languagePair.test.ts
```

Result: passed, 1 file, 15 tests.

```bash
git diff --check
```

Result: passed.

## Notes

Full `npm run typecheck` was intentionally skipped because the full app typecheck is a known active compiler hot graph and is not the lane batch gate.
