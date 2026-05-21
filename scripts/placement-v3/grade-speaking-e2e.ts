import { runGradeSpeakingBurnIn, type BurnInFailureMode } from "../../supabase/functions/placement-v3-session/burnIn.ts";

type CliConfig = {
  iterations: number;
  concurrency: number;
  injectFailure: BurnInFailureMode[];
  dryRun: boolean;
  json: boolean;
};

const DEFAULTS: CliConfig = {
  iterations: 1,
  concurrency: 1,
  injectFailure: [],
  dryRun: false,
  json: false,
};

const config = parseArgs(process.argv.slice(2));
const report = await runGradeSpeakingBurnIn({
  iterations: config.iterations,
  concurrency: config.concurrency,
  injectFailure: config.injectFailure,
  dryRun: config.dryRun,
});

if (config.json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`[grade-speaking:e2e] iterations=${report.iterations} concurrency=${report.concurrency} dryRun=${report.dryRun}`);
  console.log(`[grade-speaking:e2e] completed=${report.summary.completedIterations}/${report.iterations} fallback=${report.summary.fallbackCount} retries=${report.summary.retryCount}`);
  console.log(`[grade-speaking:e2e] duplicateSuppressed=${report.summary.duplicateSubmitSuppressed} staleRecovered=${report.summary.staleSessionRecovered} partialRecovered=${report.summary.partialResultRecovered}`);
  console.log(`[grade-speaking:e2e] redactionViolations=${report.summary.redactionViolations} crossIterationContamination=${report.summary.crossIterationContamination}`);
}

function parseArgs(argv: string[]): CliConfig {
  const config = { ...DEFAULTS };
  for (const arg of argv) {
    if (arg === "--dry-run") config.dryRun = true;
    else if (arg === "--json") config.json = true;
    else if (arg.startsWith("--iterations=")) config.iterations = parsePositiveInt(arg, "--iterations=");
    else if (arg.startsWith("--concurrency=")) config.concurrency = parsePositiveInt(arg, "--concurrency=");
    else if (arg.startsWith("--inject-failure=")) {
      const raw = arg.slice("--inject-failure=".length).trim();
      config.injectFailure = raw ? raw.split(",").map((value) => value.trim()).filter(Boolean) as BurnInFailureMode[] : [];
    }
  }
  if (config.iterations < 1) throw new Error("--iterations must be >= 1");
  if (config.concurrency < 1) throw new Error("--concurrency must be >= 1");
  return config;
}

function parsePositiveInt(arg: string, prefix: string) {
  const value = Number.parseInt(arg.slice(prefix.length), 10);
  if (!Number.isFinite(value) || value < 1) {
    throw new Error(`${prefix.slice(2, -1)} must be a positive integer`);
  }
  return value;
}
