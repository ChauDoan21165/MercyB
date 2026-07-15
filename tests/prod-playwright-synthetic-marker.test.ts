import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(__dirname, "..");

const PROD_TOUCHING_BROWSER_CONFIGS = [
  "playwright.crawler.config.ts",
  "playwright.golden-flows.config.ts",
  "playwright.perf-budget.config.ts",
  "playwright.prod-smoke.config.ts",
  "playwright.r3-explorer.config.ts",
  "playwright.smoke.config.ts",
  "playwright.synthetic-learner.config.ts",
] as const;

function read(relativePath: string): string {
  return readFileSync(resolve(repoRoot, relativePath), "utf8");
}

describe("production Playwright synthetic attribution", () => {
  it.each(PROD_TOUCHING_BROWSER_CONFIGS)(
    "%s seeds correction-source synthetic monitoring before app boot",
    (configPath) => {
      const source = read(configPath);

      expect(source).toContain("CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY");
      expect(source).toContain("storageState");
      expect(source).toContain("localStorage");
      expect(source).toContain('value: "1"');
    },
  );
});

describe("Vitest Supabase isolation", () => {
  const NON_PROD_VITEST_ENV = [
    'VITE_SUPABASE_URL="http://127.0.0.1:54321"',
    'VITE_SUPABASE_ANON_KEY="ci-vitest-non-prod-anon-key"',
  ] as const;

  function expectCommandUsesNonProdSupabase(source: string, command: string) {
    const commandIndex = source.indexOf(command);

    expect(commandIndex, `missing CI command: ${command}`).toBeGreaterThanOrEqual(0);

    const precedingScriptBlock = source.slice(Math.max(0, commandIndex - 180), commandIndex);

    for (const envLine of NON_PROD_VITEST_ENV) {
      expect(precedingScriptBlock, `${command} must set ${envLine}`).toContain(envLine);
    }
  }

  it("runs CI Vitest shards against a non-production Supabase URL", () => {
    const source = read(".gitlab-ci.yml");

    expectCommandUsesNonProdSupabase(
      source,
      "npx vitest run --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL --maxWorkers=1",
    );
  });

  it("runs secondary CI Vitest commands against non-production Supabase", () => {
    const source = read(".gitlab-ci.yml");

    for (const command of [
      'npx vitest run --shard="$SHARD/$SHARD_TOTAL" --maxWorkers=2',
      "npx vitest related --run $CHANGED_SPACE",
      "npx vitest run supabase/migrations/__tests__ scripts/__tests__/rls-matrix-scan.test.mjs scripts/__tests__/sql-lint.test.mjs",
      "npm run check:delete-account-guard",
    ]) {
      expectCommandUsesNonProdSupabase(source, command);
    }

    expect(source).toContain("VITE_SUPABASE_URL");
    expect(source).toContain("src/lib/tutor/__tests__/step11VietlishCorpusD4Wave*.test.ts");
  });

  it("runs native-audio verifier tests against non-production Supabase without rebuilding under test env", () => {
    const source = read(".gitlab-ci.yml");

    expect(source).toContain("npm run verify:mobile-audio");
    expect(source).toContain("--skip-build");
    expectCommandUsesNonProdSupabase(source, "npm run verify:mobile-audio");
  });

  it("fails fast if Vitest resolves the production Supabase project", () => {
    const source = read("src/test/setup.ts");

    expect(source).toContain("vitest-prod-supabase-guard");
    expect(source).toContain("buemdfxyhxunzpgdoqin");
    expect(source).toContain("VITE_SUPABASE_URL");
  });
});
