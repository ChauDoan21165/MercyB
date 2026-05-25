import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import "dotenv/config";

import {
  buildAdaptiveGenerationPrompts,
  buildAdaptiveValidationPrompts,
  PLACEMENT_ADAPTIVE_PROMPT_VERSION,
  PLACEMENT_ADAPTIVE_TUNING_NOTES,
  type PlacementAdaptiveCefrLevel,
  type PlacementAdaptiveModality,
} from "../../supabase/functions/_shared/placementAdaptivePrompts.js";
import {
  calculatePlacementAcceptanceRate,
  estimatePlacementTokens,
  normalizeRejectionReason,
  validateGeneratedItemShape,
  type PlacementGeneratedItem,
  type PlacementItemValidationResult,
} from "../../src/types/placementAdaptiveItems.js";

type ProviderName = "openai" | "gemini";

type AiJsonResult = {
  ok: boolean;
  json: Record<string, unknown>;
  raw: string;
  provider: ProviderName;
  model: string;
  latencyMs: number;
  tokensInput: number;
  tokensOutput: number;
  estimatedCostUsd: number;
  error?: string;
};

const ROOT = process.cwd();
const RAW_ROOT = path.join(ROOT, "docs/placement-v3/adaptive-generation/raw-runs");
const REPORT_ROOT = path.join(ROOT, "docs/placement-v3/adaptive-generation");
const OPENAI_MODEL = process.env.PLACEMENT_A35_OPENAI_MODEL || "gpt-4o-mini";
const GEMINI_MODEL = process.env.PLACEMENT_A35_GEMINI_MODEL || "gemini-2.5-flash";

const MODALITIES: PlacementAdaptiveModality[] = [
  "reading",
  "writing",
  "listening",
  "speaking",
];
const LEVEL_BANDS: PlacementAdaptiveCefrLevel[][] = [
  ["A1", "A2"],
  ["B1", "B2"],
  ["C1", "C2"],
];
const SKILL_FOCUS: Record<PlacementAdaptiveModality, string[]> = {
  reading: ["main idea", "detail extraction", "inference"],
  writing: ["articles and tense", "coherence", "task achievement"],
  listening: ["gist", "detail recall", "speaker attitude"],
  speaking: ["fluency", "accuracy", "range"],
};
const DIFFICULTY_CONSTRAINTS: Record<string, string[]> = {
  A1: ["very short", "literal meaning only", "everyday topic"],
  A2: ["short familiar task", "one simple reason", "concrete detail"],
  B1: ["connected familiar topic", "basic inference", "some distractor resistance"],
  B2: ["paraphrase required", "clear explanation", "moderate abstraction"],
  C1: ["implicit stance", "nuanced register", "dense but mobile-readable"],
  C2: ["subtle inference", "precise wording", "near-native nuance"],
};

function argValue(name: string, fallback: string): string {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] || fallback : fallback;
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function promptVersionForCycle(cycle: number): string {
  return `a35-v${Math.min(4, cycle + 1)}`;
}

function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const prices: Record<string, { input: number; output: number }> = {
    "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
    "gemini-2.5-flash": { input: 0.0003, output: 0.0025 },
  };
  const price = prices[model] ?? { input: 0.001, output: 0.002 };
  return Number(((inputTokens / 1000) * price.input + (outputTokens / 1000) * price.output).toFixed(6));
}

async function writeBlockers(command: string, error: string): Promise<void> {
  await fs.mkdir(REPORT_ROOT, { recursive: true });
  const body = `# A35 Blockers

Generated: ${new Date().toISOString()}

## Command Attempted

\`${command}\`

## Exact Error

\`\`\`text
${error}
\`\`\`

## What Could Be Tested Locally

- Type-level schemas and shape validators.
- Prompt construction.
- Raw-run directory creation.
- Report generation structure.
- Honest failure behavior when credentials are absent.

## What Remains Unverified

- Real generation API calls.
- Real validation API calls.
- Token counts from provider responses.
- Latency and acceptance-rate metrics.
- 90 generated candidates, 90 validation records, 30 accepted items, and prompt-tuning impact.

No generated items, validation scores, token counts, acceptance rates, or latency data were fabricated.
`;
  await fs.writeFile(path.join(REPORT_ROOT, "a35-blockers.md"), body);
}

async function callOpenAiJson(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number,
  temperature: number,
): Promise<AiJsonResult> {
  const startedAt = Date.now();
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set.");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });
  const text = await response.text();
  if (!response.ok) {
    return {
      ok: false,
      json: {},
      raw: text,
      provider: "openai",
      model: OPENAI_MODEL,
      latencyMs: Date.now() - startedAt,
      tokensInput: estimatePlacementTokens(`${systemPrompt}\n${userMessage}`),
      tokensOutput: estimatePlacementTokens(text),
      estimatedCostUsd: 0,
      error: `OpenAI HTTP ${response.status}: ${text.slice(0, 500)}`,
    };
  }
  const data = JSON.parse(text) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  const raw = data.choices?.[0]?.message?.content ?? "";
  const tokensInput = data.usage?.prompt_tokens ??
    estimatePlacementTokens(`${systemPrompt}\n${userMessage}`);
  const tokensOutput = data.usage?.completion_tokens ?? estimatePlacementTokens(raw);
  return {
    ok: true,
    json: JSON.parse(raw) as Record<string, unknown>,
    raw,
    provider: "openai",
    model: OPENAI_MODEL,
    latencyMs: Date.now() - startedAt,
    tokensInput,
    tokensOutput,
    estimatedCostUsd: estimateCost(OPENAI_MODEL, tokensInput, tokensOutput),
  };
}

async function callGeminiJson(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number,
  temperature: number,
): Promise<AiJsonResult> {
  const startedAt = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set.");
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
        responseMimeType: "application/json",
      },
    }),
  });
  const text = await response.text();
  if (!response.ok) {
    return {
      ok: false,
      json: {},
      raw: text,
      provider: "gemini",
      model: GEMINI_MODEL,
      latencyMs: Date.now() - startedAt,
      tokensInput: estimatePlacementTokens(`${systemPrompt}\n${userMessage}`),
      tokensOutput: estimatePlacementTokens(text),
      estimatedCostUsd: 0,
      error: `Gemini HTTP ${response.status}: ${text.slice(0, 500)}`,
    };
  }
  const data = JSON.parse(text) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
  };
  const raw = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
  const tokensInput = data.usageMetadata?.promptTokenCount ??
    estimatePlacementTokens(`${systemPrompt}\n${userMessage}`);
  const tokensOutput = data.usageMetadata?.candidatesTokenCount ?? estimatePlacementTokens(raw);
  return {
    ok: true,
    json: JSON.parse(raw) as Record<string, unknown>,
    raw,
    provider: "gemini",
    model: GEMINI_MODEL,
    latencyMs: Date.now() - startedAt,
    tokensInput,
    tokensOutput,
    estimatedCostUsd: estimateCost(GEMINI_MODEL, tokensInput, tokensOutput),
  };
}

async function callAiJson(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number,
  temperature: number,
): Promise<AiJsonResult> {
  if (process.env.OPENAI_API_KEY) {
    const result = await callOpenAiJson(systemPrompt, userMessage, maxTokens, temperature);
    if (result.ok) return result;
    if (!process.env.GEMINI_API_KEY) return result;
  }
  if (process.env.GEMINI_API_KEY) {
    return callGeminiJson(systemPrompt, userMessage, maxTokens, temperature);
  }
  throw new Error("No model credentials found. Set OPENAI_API_KEY or GEMINI_API_KEY.");
}

function itemPlan(count: number) {
  const rows: Array<{
    modality: PlacementAdaptiveModality;
    level: PlacementAdaptiveCefrLevel;
    skillFocus: string;
  }> = [];
  let cursor = 0;
  while (rows.length < count) {
    for (const band of LEVEL_BANDS) {
      for (let i = 0; i < 10 / LEVEL_BANDS.length && rows.length < count; i += 1) {
        const modality = MODALITIES[cursor % MODALITIES.length];
        const level = band[(cursor + i) % band.length];
        const focusOptions = SKILL_FOCUS[modality];
        rows.push({
          modality,
          level,
          skillFocus: focusOptions[cursor % focusOptions.length],
        });
        cursor += 1;
      }
    }
  }
  return rows.slice(0, count);
}

async function run(): Promise<void> {
  const batchId = argValue("batch", `a35-${new Date().toISOString().replace(/[:.]/g, "")}`);
  const cycles = Number(argValue("cycles", hasFlag("full") ? "3" : "1"));
  const candidatesPerCycle = Number(argValue("count", "30"));
  const command = `pnpm tsx scripts/placement-v3/run-adaptive-item-gauntlet.ts ${process.argv.slice(2).join(" ")}`.trim();

  if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
    const error = "No model credentials found. Set OPENAI_API_KEY or GEMINI_API_KEY.";
    await writeBlockers(command, error);
    throw new Error(error);
  }

  await fs.mkdir(RAW_ROOT, { recursive: true });
  const acceptedItems: PlacementGeneratedItem[] = [];
  const validations: PlacementItemValidationResult[] = [];
  const rawRuns: unknown[] = [];
  const startedAt = new Date().toISOString();

  for (let cycle = 0; cycle < cycles; cycle += 1) {
    const promptVersion = promptVersionForCycle(cycle);
    const plan = itemPlan(candidatesPerCycle);
    for (let index = 0; index < plan.length; index += 1) {
      const entry = plan[index];
      const generationPrompts = buildAdaptiveGenerationPrompts({
        modality: entry.modality,
        targetCefr: entry.level,
        learnerL1: "vi",
        targetLanguage: "en",
        skillFocus: entry.skillFocus,
        difficultyConstraints: DIFFICULTY_CONSTRAINTS[entry.level],
        promptVersion,
      });
      const generation = await callAiJson(
        generationPrompts.systemPrompt,
        generationPrompts.userMessage,
        1_600,
        0.45,
      );
      if (!generation.ok) throw new Error(generation.error || "Generation failed.");

      const generatedAt = new Date().toISOString();
      const item = {
        id: crypto.randomUUID(),
        ...generation.json,
        metadata: {
          batchId,
          cycle,
          promptVersion,
          generatedAt,
          provider: generation.provider,
          model: generation.model,
          latencyMs: generation.latencyMs,
          tokensInput: generation.tokensInput,
          tokensOutput: generation.tokensOutput,
          estimatedCostUsd: generation.estimatedCostUsd,
        },
      } as PlacementGeneratedItem;

      const shapeErrors = validateGeneratedItemShape(item);
      const validationPrompts = buildAdaptiveValidationPrompts({
        item: shapeErrors.length
          ? { ...item, localShapeErrors: shapeErrors }
          : item as unknown as Record<string, unknown>,
        existingItems: acceptedItems.map((accepted) => ({
          id: accepted.id,
          title: accepted.title,
          promptText: accepted.promptText,
        })),
        promptVersion,
      });
      const validationCall = await callAiJson(
        validationPrompts.systemPrompt,
        validationPrompts.userMessage,
        1_800,
        0.05,
      );
      if (!validationCall.ok) throw new Error(validationCall.error || "Validation failed.");

      const validation = normalizeValidation(
        validationCall.json,
        item.id,
        batchId,
        cycle,
        promptVersion,
        validationCall,
        shapeErrors,
      );
      if (validation.finalDecision === "accepted") acceptedItems.push(item);
      validations.push(validation);

      const raw = {
        isoTimestamp: new Date().toISOString(),
        batchId,
        cycle,
        promptVersion,
        tuningNote: PLACEMENT_ADAPTIVE_TUNING_NOTES[promptVersion],
        candidateIndex: index,
        generation: {
          provider: generation.provider,
          model: generation.model,
          latencyMs: generation.latencyMs,
          tokensInput: generation.tokensInput,
          tokensOutput: generation.tokensOutput,
          estimatedCostUsd: generation.estimatedCostUsd,
          rawGeneratedItem: generation.raw,
          parsedItem: item,
        },
        validation: {
          provider: validationCall.provider,
          model: validationCall.model,
          latencyMs: validationCall.latencyMs,
          tokensInput: validationCall.tokensInput,
          tokensOutput: validationCall.tokensOutput,
          estimatedCostUsd: validationCall.estimatedCostUsd,
          rawValidatorResponse: validationCall.raw,
          parsedValidation: validation,
        },
        finalDecision: validation.finalDecision,
        rejectionReasons: validation.rejectionReasons,
      };
      rawRuns.push(raw);
      await fs.writeFile(
        path.join(RAW_ROOT, `${batchId}-cycle${cycle + 1}-${String(index + 1).padStart(2, "0")}.json`),
        JSON.stringify(raw, null, 2),
      );
    }
  }

  await writeReports(batchId, startedAt, rawRuns, acceptedItems, validations, cycles);
}

function normalizeValidation(
  raw: Record<string, unknown>,
  itemId: string,
  batchId: string,
  cycle: number,
  promptVersion: string,
  ai: AiJsonResult,
  shapeErrors: string[],
): PlacementItemValidationResult {
  const rejectionReasons = [
    ...(Array.isArray(raw.rejectionReasons)
      ? raw.rejectionReasons.map((reason) => normalizeRejectionReason(reason as Record<string, unknown>))
      : []),
    ...shapeErrors.map((error) => normalizeRejectionReason({
      code: "malformed",
      severity: "high",
      message: error,
    })),
  ];
  const finalDecision =
    raw.finalDecision === "accepted" && rejectionReasons.length === 0
      ? "accepted"
      : "rejected";
  return {
    id: crypto.randomUUID(),
    generatedItemId: itemId,
    validatedAt: new Date().toISOString(),
    finalDecision,
    cefrFit: scoreBlock(raw.cefrFit),
    safety: scoreBlock(raw.safety),
    ageAppropriateness: scoreBlock(raw.ageAppropriateness),
    culturalNeutrality: scoreBlock(raw.culturalNeutrality),
    vietnameseL1Relevance: {
      ...scoreBlock(raw.vietnameseL1Relevance),
      matchedPatterns: stringArray((raw.vietnameseL1Relevance as Record<string, unknown> | undefined)?.matchedPatterns),
    },
    duplicateRisk: {
      ...scoreBlock(raw.duplicateRisk),
      nearestItemIds: stringArray((raw.duplicateRisk as Record<string, unknown> | undefined)?.nearestItemIds),
    },
    rubricCompatibility: {
      ...scoreBlock(raw.rubricCompatibility),
      supportedDimensions: stringArray((raw.rubricCompatibility as Record<string, unknown> | undefined)?.supportedDimensions),
    },
    learnerUsability: scoreBlock(raw.learnerUsability),
    rejectionReasons,
    metadata: {
      batchId,
      cycle,
      promptVersion,
      generatedAt: new Date().toISOString(),
      provider: ai.provider,
      model: ai.model,
      latencyMs: ai.latencyMs,
      tokensInput: ai.tokensInput,
      tokensOutput: ai.tokensOutput,
      estimatedCostUsd: ai.estimatedCostUsd,
    },
  };
}

function scoreBlock(value: unknown) {
  const record = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  return {
    score: typeof record.score === "number" ? Math.max(0, Math.min(1, record.score)) : 0,
    pass: record.pass === true,
    notes: String(record.notes ?? "").slice(0, 500),
    predictedCefr: typeof record.predictedCefr === "string" ? record.predictedCefr as PlacementAdaptiveCefrLevel : undefined,
  };
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean).slice(0, 8) : [];
}

async function writeReports(
  batchId: string,
  startedAt: string,
  rawRuns: unknown[],
  acceptedItems: PlacementGeneratedItem[],
  validations: PlacementItemValidationResult[],
  cycles: number,
): Promise<void> {
  const completedAt = new Date().toISOString();
  const generatedCount = rawRuns.length;
  const acceptedCount = acceptedItems.length;
  const rejectedCount = validations.filter((validation) => validation.finalDecision === "rejected").length;
  const rawCostUsd = rawRuns.reduce<number>((sum, raw) => {
    const record = raw as {
      generation?: { estimatedCostUsd?: number };
      validation?: { estimatedCostUsd?: number };
    };
    return sum +
      (record.generation?.estimatedCostUsd ?? 0) +
      (record.validation?.estimatedCostUsd ?? 0);
  }, 0);
  const rawGenerationLatencyMs = rawRuns.reduce<number>((sum, raw) => {
    const record = raw as { generation?: { latencyMs?: number } };
    return sum + (record.generation?.latencyMs ?? 0);
  }, 0);
  const rejectionCounts = validations.reduce<Record<string, number>>((acc, validation) => {
    for (const reason of validation.rejectionReasons) {
      acc[reason.code] = (acc[reason.code] ?? 0) + 1;
    }
    return acc;
  }, {});

  const report = {
    batchId,
    startedAt,
    completedAt,
    cyclesCompleted: cycles,
    generatedCount,
    validatedCount: validations.length,
    acceptedCount,
    rejectedCount,
    acceptanceRate: calculatePlacementAcceptanceRate(acceptedCount, validations.length),
    estimatedCostUsd: Number(rawCostUsd.toFixed(6)),
    costPerAcceptedItem: acceptedCount
      ? Number((rawCostUsd / acceptedCount).toFixed(6))
      : null,
    averageGenerationLatencyMs: Math.round(rawGenerationLatencyMs / Math.max(1, rawRuns.length)),
    rejectionCounts,
  };

  await fs.writeFile(
    path.join(RAW_ROOT, `${batchId}-summary.json`),
    JSON.stringify({ report, validations }, null, 2),
  );
  await fs.writeFile(
    path.join(REPORT_ROOT, "production-readiness-report.md"),
    `# Adaptive Item Generation Production Readiness

Generated: ${completedAt}

## Batch Summary

| Batch | Cycles | Generated | Validated | Accepted | Acceptance Rate | Estimated Cost | Cost / Accepted |
|---|---:|---:|---:|---:|---:|---:|---:|
| ${batchId} | ${cycles} | ${generatedCount} | ${validations.length} | ${acceptedCount} | ${(report.acceptanceRate * 100).toFixed(1)}% | $${report.estimatedCostUsd.toFixed(6)} | ${report.costPerAcceptedItem === null ? "n/a" : `$${report.costPerAcceptedItem.toFixed(6)}`} |

## Production Recommendation

${acceptedCount >= 30 && validations.length >= 90 ? "Soft launch may proceed only after human review of accepted items." : "Not ready for production replacement. The hard evidence gates were not met in this run."}
`,
  );
  await fs.writeFile(
    path.join(REPORT_ROOT, "rejection-analysis.md"),
    `# Adaptive Item Rejection Analysis

Generated: ${completedAt}

${Object.entries(rejectionCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([code, count]) => `- ${code}: ${count}`)
  .join("\n") || "- No rejections recorded."}
`,
  );
}

run().catch(async (error) => {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("No model credentials")) {
    await writeBlockers(
      `pnpm tsx scripts/placement-v3/run-adaptive-item-gauntlet.ts ${process.argv.slice(2).join(" ")}`.trim(),
      message,
    );
  }
  console.error(message);
  process.exit(1);
});
