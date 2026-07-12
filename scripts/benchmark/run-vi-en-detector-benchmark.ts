import { runBenchmark } from "./harness.js";
import { smokeImportAdditionalDetectorSurfaces } from "./detectors.js";

type CliOptions = {
  annotated?: string;
  proxy?: string;
  out: string;
  report?: string;
  seed: number;
  limit: number;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    out: "reports/benchmark/vi-en-detector-benchmark-v1.results.json",
    report: "reports/benchmark/vi-en-detector-benchmark-v1.md",
    seed: 20260712,
    limit: 5000,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (flag === "--annotated") {
      options.annotated = requireValue(flag, value);
      index += 1;
    } else if (flag === "--proxy") {
      options.proxy = requireValue(flag, value);
      index += 1;
    } else if (flag === "--out") {
      options.out = requireValue(flag, value);
      index += 1;
    } else if (flag === "--report") {
      options.report = requireValue(flag, value);
      index += 1;
    } else if (flag === "--seed") {
      options.seed = Number.parseInt(requireValue(flag, value), 10);
      index += 1;
    } else if (flag === "--limit") {
      options.limit = Number.parseInt(requireValue(flag, value), 10);
      index += 1;
    } else if (flag === "--help") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${flag}`);
    }
  }

  if (!Number.isFinite(options.seed)) throw new Error("--seed must be an integer");
  if (!Number.isFinite(options.limit) || options.limit < 1 || options.limit > 5000) {
    throw new Error("--limit must be between 1 and 5000");
  }
  return options;
}

function requireValue(flag: string, value: string | undefined): string {
  if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value`);
  return value;
}

function printHelp(): void {
  console.log(`Usage:
  npx tsx scripts/benchmark/run-vi-en-detector-benchmark.ts \\
    --annotated benchmark-data/fce/annotated.jsonl \\
    --proxy benchmark-data/icnale/proxy.jsonl \\
    --out reports/benchmark/vi-en-detector-benchmark-v1.results.json \\
    --report reports/benchmark/vi-en-detector-benchmark-v1.md \\
    --seed 20260712 --limit 5000`);
}

smokeImportAdditionalDetectorSurfaces();

const options = parseArgs(process.argv.slice(2));
const results = runBenchmark({
  annotatedPath: options.annotated,
  proxyPath: options.proxy,
  outputPath: options.out,
  reportPath: options.report,
  seed: options.seed,
  limit: options.limit,
});

console.log(
  `[benchmark] annotated=${results.annotated.sample_size} proxy=${results.proxy.sample_size} out=${options.out}`,
);
