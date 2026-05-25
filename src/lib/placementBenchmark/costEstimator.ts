import type { BenchmarkProvider, CostBreakdown } from "./types.js";

const TOKEN_PRICES_PER_MILLION: Record<string, { input: number; output: number }> = {
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4o": { input: 2.5, output: 10 },
  "gemini-2.5-flash": { input: 0.3, output: 2.5 },
  "gemini-1.5-flash": { input: 0.075, output: 0.3 },
  "azure-pronunciation": { input: 0, output: 0 },
};

export function estimateTokenCostUsd(args: {
  provider: BenchmarkProvider;
  model?: string | null;
  tokensInput: number;
  tokensOutput: number;
}): number {
  if (args.provider === "azure") {
    return 0;
  }
  const model = args.model || (args.provider === "gemini" ? "gemini-2.5-flash" : "gpt-4o-mini");
  const price = TOKEN_PRICES_PER_MILLION[model] ?? TOKEN_PRICES_PER_MILLION["gpt-4o-mini"];
  return roundUsd(
    (Math.max(0, args.tokensInput) / 1_000_000) * price.input +
      (Math.max(0, args.tokensOutput) / 1_000_000) * price.output,
  );
}

export function estimateAzurePronunciationCostUsd(audioSeconds: number): number {
  const minutes = Math.max(0, audioSeconds) / 60;
  return roundUsd(minutes * 0.006);
}

export function summarizeCost(rows: CostBreakdown[]): {
  totalUsd: number;
  byProvider: Record<string, number>;
} {
  const byProvider: Record<string, number> = {};
  let totalUsd = 0;
  for (const row of rows) {
    totalUsd += row.estimatedCostUsd;
    byProvider[row.provider] = roundUsd((byProvider[row.provider] ?? 0) + row.estimatedCostUsd);
  }
  return { totalUsd: roundUsd(totalUsd), byProvider };
}

function roundUsd(value: number): number {
  return Number(value.toFixed(6));
}
