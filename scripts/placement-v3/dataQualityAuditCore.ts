import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

import type {
  PlacementDataQualityAuditKind,
  PlacementDataQualityCategory,
  PlacementDataQualityIssue,
  PlacementDataQualityIssueCounts,
  PlacementDataQualityRun,
  PlacementDataQualitySeverity,
} from "../../src/types/placementDataQuality.js";

export const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

export const RAW_RUN_DIR = path.join(
  REPO_ROOT,
  "docs/placement-v3/data-quality/raw-runs",
);

const REQUIRED_SURFACES = [
  "src/data/placement/v3/calibration",
  "src/data/placement/v3/prompts",
  "src/lib/placement/v3/recommender.ts",
  "src/lib/placement/v3/lessonIndex.ts",
  "supabase/functions/_shared/cefr/rubric.ts",
  "supabase/functions/_shared/cefr/types.ts",
  "supabase/functions/placement-v3-grade-writing/index.ts",
  "supabase/functions/placement-v3-session/index.ts",
];

const VALID_CEFR = ["pre_a1", "A1", "A2", "B1", "B2", "C1", "C2"] as const;
const PLACEMENT_QUESTION_CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const VALID_MODALITIES = [
  "reading",
  "listening",
  "speaking",
  "conversation",
  "grammar",
  "vocabulary",
  "usage",
  "writing",
  "writing_sample",
] as const;
const V3_MODALITIES = ["writing", "speaking", "reading", "listening", "conversation"] as const;
const V3_RUBRIC_DIMENSIONS = ["grammar", "vocabulary", "coherence", "taskAchievement"] as const;

type LocalQuestion = {
  id: string;
  type: string;
  cefr: string;
  difficulty: number;
  skill: string;
  cefrDescriptor: string;
  prompt: { en: string; vi: string };
  options: unknown[];
  weaknessTag?: string;
  passage?: { en?: string };
};

type LocalWeaknessEntry = {
  tag: string;
  linkedRoomId: string | null;
  hasDescription: boolean;
  hasExamples: boolean;
};

type LocalV3Prompt = {
  id: string;
  modality: string;
  targetLevel: string;
  acceptableLevels: string[];
  promptText: string;
  promptTextVi: string;
  bodyText: string;
  expectedDurationSec: number;
  minResponseLength: number;
  rubricFocus: string[];
  l1InterferenceTriggers: string[];
  file: string;
  questions: string[];
};

type LocalCalibrationEntry = {
  id: string;
  promptId: string;
  modality: string;
  expectedLevel: string;
  expectedSubskills: Record<string, string>;
  expectedL1Flags: string[];
  userResponse: string;
  expertNotes: string;
  difficulty: string;
  file: string;
};

function exists(rel: string): boolean {
  return fs.existsSync(path.join(REPO_ROOT, rel));
}

function issue(
  auditKind: PlacementDataQualityAuditKind,
  category: PlacementDataQualityCategory,
  severity: PlacementDataQualitySeverity,
  file: string,
  message: string,
  evidence?: Record<string, unknown>,
): PlacementDataQualityIssue {
  const fingerprint = `${auditKind}:${category}:${file}:${message}`;
  return {
    id: createHash("sha256").update(fingerprint).digest("hex").slice(0, 24),
    auditKind,
    category,
    severity,
    file,
    message,
    evidence,
  };
}

export function missingRequiredSurfaceIssues(
  auditKind: PlacementDataQualityAuditKind,
): PlacementDataQualityIssue[] {
  return REQUIRED_SURFACES.filter((surface) => !exists(surface)).map((surface) =>
    issue(
      auditKind,
      "missing_required_surface",
      "blocker",
      surface,
      `Required Placement V3 surface is missing on origin/main: ${surface}`,
      { surface },
    ),
  );
}

function normalizePrompt(text: string): string {
  return text
    .toLowerCase()
    .replace(/[_\W]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function trigrams(text: string): Set<string> {
  const words = normalizePrompt(text).split(" ").filter(Boolean);
  const grams = new Set<string>();
  for (let i = 0; i < Math.max(1, words.length - 2); i += 1) {
    grams.add(words.slice(i, i + 3).join(" "));
  }
  if (grams.size === 0 && words.length) grams.add(words.join(" "));
  return grams;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  const union = new Set([...a, ...b]);
  if (union.size === 0) return 0;
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection += 1;
  return intersection / union.size;
}

function roomExists(roomId: string): boolean {
  return fs.existsSync(path.join(REPO_ROOT, "public/data", `${roomId}.json`));
}

function extractQuotedValues(source: string, pattern: RegExp): string[] {
  const values: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source))) values.push(match[1]);
  return values;
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

export function changedFilesSincePreviousRun(): string[] {
  try {
    const output = execFileSync("git", ["diff", "--name-only", "HEAD"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
    });
    return output.split("\n").map((s) => s.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

export function collectAuditedFiles(): string[] {
  const candidates = [
    "docs/placement-v3/native-audio/native-permission-audit.md",
    "src/data/placement/v3/prompts/index.ts",
    "src/data/placement/v3/prompts/writing.ts",
    "src/data/placement/v3/prompts/speaking.ts",
    "src/data/placement/v3/prompts/reading.ts",
    "src/data/placement/v3/prompts/listening.ts",
    "src/data/placement/v3/prompts/conversation.ts",
    "src/data/placement/v3/calibration/index.ts",
    "src/data/placement/v3/calibration/writing-corpus.ts",
    "src/data/placement/v3/calibration/speaking-corpus.ts",
    "src/data/placement/v3/calibration/reading-corpus.ts",
    "src/data/placement/v3/calibration/listening-corpus.ts",
    "src/lib/placement/v3/recommender.ts",
    "src/lib/placement/v3/lessonIndex.ts",
    "src/lib/placement/v3/recommenderTypes.ts",
    "src/lib/placement/questions.ts",
    "src/lib/placement/cefrToRoom.ts",
    "src/lib/weakness/weakness-catalog.ts",
    "src/lib/weakness/recommendationEngine.ts",
    "src/lib/weakness/micro-lessons.ts",
    "supabase/functions/placement-session/types.ts",
    "supabase/functions/placement-session/config.ts",
    "supabase/functions/placement-session/engine/itemBank.ts",
    "supabase/functions/_shared/cefr/rubric.ts",
    "supabase/functions/_shared/cefr/types.ts",
    "supabase/functions/placement-v3-grade-writing/types.ts",
    "supabase/functions/placement-v3-grade-writing/core.ts",
    "supabase/functions/placement-v3-grade-writing/__tests__/fixtures/prompts.json",
    "supabase/functions/placement-v3-session/types.ts",
    "supabase/functions/placement-v3-session/modality.ts",
    "supabase/functions/placement-v3-session/core.ts",
    "supabase/migrations/20260618000000_placement_items.sql",
    "supabase/migrations/20260619000000_placement_sessions.sql",
    "supabase/migrations/20260627000000_placement_v3_sessions.sql",
    "supabase/migrations/20260627000001_placement_v3_responses.sql",
    "supabase/migrations/20260627000002_placement_v3_profiles.sql",
    "supabase/migrations/20260627000003_placement_v3_rls.sql",
  ];
  return candidates.filter(exists);
}

function parseArray(block: string, name: string): string[] {
  const match = new RegExp(`${name}:\\s*\\[([\\s\\S]*?)\\]`).exec(block);
  if (!match) return [];
  return extractQuotedValues(match[1], /["']([^"']+)["']/g);
}

function parseObjectStringValues(block: string, name: string): Record<string, string> {
  const match = new RegExp(`${name}:\\s*\\{([\\s\\S]*?)\\}`).exec(block);
  if (!match) return {};
  const out: Record<string, string> = {};
  const pattern = /([A-Za-z][A-Za-z0-9_]*):\s*["']([^"']+)["']/g;
  let row: RegExpExecArray | null;
  while ((row = pattern.exec(match[1]))) out[row[1]] = row[2];
  return out;
}

function topLevelObjectBlocks(source: string, marker: RegExp, endPattern = "\n]"): string[] {
  const starts = [...source.matchAll(marker)].map((m) => m.index ?? 0);
  return starts.map((start, index) => {
    const next = starts[index + 1] ?? source.indexOf(endPattern, start);
    return source.slice(start, next > start ? next : undefined);
  });
}

function topLevelArrayObjectBlocks(source: string): string[] {
  const assignment = /=\s*\[/.exec(source);
  if (assignment?.index == null) return [];
  const arrayStart = source.indexOf("[", assignment.index);
  const blocks: string[] = [];
  let arrayDepth = 0;
  let braceDepth = 0;
  let objectStart = -1;
  for (let index = arrayStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "[") arrayDepth += 1;
    if (char === "]") {
      arrayDepth -= 1;
      if (arrayDepth === 0) break;
    }
    if (arrayDepth !== 1) continue;
    if (char === "{") {
      if (braceDepth === 0) objectStart = index;
      braceDepth += 1;
    }
    if (char === "}") {
      braceDepth -= 1;
      if (braceDepth === 0 && objectStart >= 0) {
        blocks.push(source.slice(objectStart, index + 1));
        objectStart = -1;
      }
    }
  }
  return blocks;
}

export function loadKnownV3L1Ids(): string[] {
  const rel = "src/data/placement/v3/prompts/index.ts";
  if (!exists(rel)) return [];
  const source = readSource(rel);
  const block = /KNOWN_L1_INTERFERENCE_IDS\s*=\s*\[([\s\S]*?)\]/.exec(source)?.[1] ?? "";
  return extractQuotedValues(block, /["']([^"']+)["']/g);
}

export function loadV3Prompts(): LocalV3Prompt[] {
  const files = [
    "src/data/placement/v3/prompts/writing.ts",
    "src/data/placement/v3/prompts/speaking.ts",
    "src/data/placement/v3/prompts/reading.ts",
    "src/data/placement/v3/prompts/listening.ts",
    "src/data/placement/v3/prompts/conversation.ts",
  ].filter(exists);
  const prompts: LocalV3Prompt[] = [];
  for (const file of files) {
    const source = readSource(file);
    const blocks = topLevelArrayObjectBlocks(source);
    for (const block of blocks) {
      const pick = (name: string): string => {
        const match = new RegExp(`${name}:\\s*(['"])([\\s\\S]*?)\\1`).exec(block);
        return match?.[2] ?? "";
      };
      const pickNumber = (name: string): number => Number(new RegExp(`${name}:\\s*([0-9]+)`).exec(block)?.[1] ?? Number.NaN);
      const questionCount = (block.match(/\bquestionText:\s*["']/g) ?? []).length;
      prompts.push({
        id: pick("id"),
        modality: pick("modality"),
        targetLevel: pick("targetLevel"),
        acceptableLevels: parseArray(block, "acceptableLevels"),
        promptText: pick("promptText"),
        promptTextVi: pick("promptTextVi"),
        bodyText: pick("passageText") || pick("audioScript") || pick("context"),
        expectedDurationSec: pickNumber("expectedDurationSec"),
        minResponseLength: pickNumber("minResponseLength"),
        rubricFocus: parseArray(block, "rubricFocus"),
        l1InterferenceTriggers: parseArray(block, "l1InterferenceTriggers"),
        questions: Array.from({ length: questionCount }, (_, index) => `${pick("id")}-question-${index + 1}`),
        file,
      });
    }
  }
  return prompts.filter((prompt) => prompt.id && (V3_MODALITIES as readonly string[]).includes(prompt.modality));
}

export function loadV3CalibrationEntries(): LocalCalibrationEntry[] {
  const files = [
    "src/data/placement/v3/calibration/writing-corpus.ts",
    "src/data/placement/v3/calibration/speaking-corpus.ts",
    "src/data/placement/v3/calibration/reading-corpus.ts",
    "src/data/placement/v3/calibration/listening-corpus.ts",
  ].filter(exists);
  const entries: LocalCalibrationEntry[] = [];
  for (const file of files) {
    const source = readSource(file);
    const blocks = topLevelArrayObjectBlocks(source);
    for (const block of blocks) {
      const pick = (name: string): string => {
        const match = new RegExp(`${name}:\\s*(['"])([\\s\\S]*?)\\1`).exec(block);
        return match?.[2] ?? "";
      };
      entries.push({
        id: pick("id"),
        promptId: pick("promptId"),
        modality: pick("modality"),
        expectedLevel: pick("expectedLevel"),
        expectedSubskills: parseObjectStringValues(block, "expectedSubskills"),
        expectedL1Flags: parseArray(block, "expectedL1Flags"),
        userResponse: pick("userResponse"),
        expertNotes: pick("expertNotes"),
        difficulty: pick("difficulty"),
        file,
      });
    }
  }
  return entries.filter((entry) => entry.id);
}

export function loadPlacementQuestions(): LocalQuestion[] {
  const rel = "src/lib/placement/questions.ts";
  if (!exists(rel)) return [];
  const source = readSource(rel);
  const starts = [...source.matchAll(/\n\s*\{\s*\n\s*id:\s*'q_/g)].map((m) => m.index ?? 0);
  const blocks = starts.map((start, index) => {
    const next = starts[index + 1] ?? source.indexOf("\n];", start);
    return source.slice(start, next > start ? next : undefined);
  });
  return blocks.map((block) => {
    const pick = (name: string): string => {
      const match = new RegExp(`${name}:\\s*(['"])([\\s\\S]*?)\\1`).exec(block);
      return match?.[2] ?? "";
    };
    const difficulty = Number(/difficulty:\s*([0-9.]+)/.exec(block)?.[1] ?? Number.NaN);
    const stringValue = (section: string, field: string): string | undefined => {
      const match = new RegExp(`${section}:\\s*\\{[\\s\\S]*?${field}:\\s*(['"])([\\s\\S]*?)\\1`).exec(block);
      return match?.[2];
    };
    const promptEn = stringValue("prompt", "en") ?? "";
    const promptVi = stringValue("prompt", "vi") ?? "";
    const passageEn = stringValue("passage", "en");
    const optionCount = (block.match(/\{\s*id:\s*'[a-d]'/g) ?? []).length;
    const weaknessTag = /weaknessTag:\s*'([^']+)'/.exec(block)?.[1];
    return {
      id: pick("id"),
      type: pick("type"),
      cefr: pick("cefr"),
      difficulty,
      skill: pick("skill"),
      cefrDescriptor: pick("cefrDescriptor"),
      prompt: { en: promptEn, vi: promptVi },
      options: Array.from({ length: optionCount }),
      weaknessTag,
      passage: passageEn ? { en: passageEn } : undefined,
    };
  });
}

export function loadCefrToRoom(): Record<string, string> {
  const rel = "src/lib/placement/cefrToRoom.ts";
  if (!exists(rel)) return {};
  const source = readSource(rel);
  const mapBlock = /CEFR_TO_ROOM[\s\S]*?=\s*\{([\s\S]*?)\};/.exec(source)?.[1] ?? "";
  const out: Record<string, string> = {};
  const rowPattern = /^\s*([A-Za-z0-9_]+):\s*'([^']+)'/gm;
  let match: RegExpExecArray | null;
  while ((match = rowPattern.exec(mapBlock))) out[match[1]] = match[2];
  return out;
}

export function loadWeaknessCatalog(): Record<string, LocalWeaknessEntry> {
  const rel = "src/lib/weakness/weakness-catalog.ts";
  if (!exists(rel)) return {};
  const source = readSource(rel);
  const tags = extractQuotedValues(source, /\|\s*"([^"]+)"/g).filter((tag) =>
    tag.startsWith("vi_l1_"),
  );
  const starts = unique(tags)
    .map((tag) => ({ tag, index: source.indexOf(`\n  ${tag}: {`) }))
    .filter((item) => item.index >= 0)
    .sort((a, b) => a.index - b.index);
  const out: Record<string, LocalWeaknessEntry> = {};
  for (const tag of unique(tags)) {
    const startRecord = starts.find((item) => item.tag === tag);
    const nextRecord = startRecord
      ? starts.find((item) => item.index > startRecord.index)
      : undefined;
    const block = startRecord
      ? source.slice(startRecord.index, nextRecord?.index ?? source.indexOf("\n};", startRecord.index))
      : "";
    const roomMatch = /linkedRoomId:\s*(null|['"]([^'"]+)['"])/.exec(block);
    out[tag] = {
      tag,
      linkedRoomId: roomMatch?.[2] ?? null,
      hasDescription: /longDescription:\s*\{[\s\S]*?en:\s*"[^"]+"/.test(block),
      hasExamples: /exampleWrong:\s*"[^"]+"/.test(block) && /exampleRight:\s*"[^"]+"/.test(block),
    };
  }
  return out;
}

export function countIssues(
  issues: PlacementDataQualityIssue[],
): PlacementDataQualityIssueCounts {
  const byCategory: PlacementDataQualityIssueCounts["byCategory"] = {};
  for (const item of issues) {
    byCategory[item.category] = (byCategory[item.category] ?? 0) + 1;
  }
  return {
    total: issues.length,
    blockers: issues.filter((i) => i.severity === "blocker").length,
    errors: issues.filter((i) => i.severity === "error").length,
    warnings: issues.filter((i) => i.severity === "warning").length,
    info: issues.filter((i) => i.severity === "info").length,
    byCategory,
  };
}

export function auditCorpusIntegrity(): PlacementDataQualityIssue[] {
  const issues = [...missingRequiredSurfaceIssues("corpus_integrity")];
  const placementQuestions = loadPlacementQuestions();
  const weaknessCatalog = loadWeaknessCatalog();
  const weaknessTags = Object.keys(weaknessCatalog);
  const cefrToRoom = loadCefrToRoom();
  const v3Prompts = loadV3Prompts();
  const calibrationEntries = loadV3CalibrationEntries();
  const knownV3L1Ids = loadKnownV3L1Ids();
  const v3PromptIds = new Set(v3Prompts.map((prompt) => prompt.id));
  const byPrompt = new Map<string, string[]>();
  const byV3Prompt = new Map<string, string[]>();

  const v3PromptDuplicates = v3Prompts
    .map((prompt) => prompt.id)
    .filter((id, index, ids) => ids.indexOf(id) !== index);
  for (const id of unique(v3PromptDuplicates)) {
    issues.push(
      issue(
        "corpus_integrity",
        "malformed_calibration_entry",
        "error",
        "src/data/placement/v3/prompts",
        `Duplicate Placement V3 prompt id ${id}`,
        { id },
      ),
    );
  }

  for (const prompt of v3Prompts) {
    if (!(PLACEMENT_QUESTION_CEFR as readonly string[]).includes(prompt.targetLevel)) {
      issues.push(
        issue(
          "corpus_integrity",
          "missing_cefr_label",
          "error",
          prompt.file,
          `Prompt ${prompt.id} has invalid targetLevel ${prompt.targetLevel}`,
          { id: prompt.id, targetLevel: prompt.targetLevel },
        ),
      );
    }
    if (!(V3_MODALITIES as readonly string[]).includes(prompt.modality)) {
      issues.push(
        issue(
          "corpus_integrity",
          "invalid_modality_mapping",
          "error",
          prompt.file,
          `Prompt ${prompt.id} has invalid modality ${prompt.modality}`,
          { id: prompt.id, modality: prompt.modality },
        ),
      );
    }
    if (
      !prompt.promptText ||
      !prompt.promptTextVi ||
      !Number.isFinite(prompt.expectedDurationSec) ||
      !Number.isFinite(prompt.minResponseLength) ||
      prompt.rubricFocus.length === 0
    ) {
      issues.push(
        issue(
          "corpus_integrity",
          "missing_metadata",
          "error",
          prompt.file,
          `Prompt ${prompt.id} is missing required metadata`,
          { id: prompt.id },
        ),
      );
    }
    for (const tag of prompt.l1InterferenceTriggers) {
      if (!knownV3L1Ids.includes(tag)) {
        issues.push(
          issue(
            "corpus_integrity",
            "invalid_taxonomy_reference",
            "error",
            prompt.file,
            `Prompt ${prompt.id} references undefined Placement V3 L1 trigger ${tag}`,
            { id: prompt.id, tag },
          ),
        );
      }
    }
    const key = normalizePrompt(`${prompt.promptText} ${prompt.bodyText}`);
    byV3Prompt.set(key, [...(byV3Prompt.get(key) ?? []), prompt.id]);
  }

  for (const [promptKey, ids] of byV3Prompt) {
    if (promptKey && ids.length > 1) {
      issues.push(
        issue(
          "corpus_integrity",
          "duplicate_prompt",
          "warning",
          "src/data/placement/v3/prompts",
          `Duplicate Placement V3 prompt text appears in ${ids.join(", ")}`,
          { promptKey, ids },
        ),
      );
    }
  }

  for (let i = 0; i < v3Prompts.length; i += 1) {
    for (let j = i + 1; j < v3Prompts.length; j += 1) {
      const a = v3Prompts[i];
      const b = v3Prompts[j];
      const aText = `${a.promptText} ${a.bodyText}`;
      const bText = `${b.promptText} ${b.bodyText}`;
      const score = jaccard(trigrams(aText), trigrams(bText));
      if (score >= 0.82 && normalizePrompt(aText) !== normalizePrompt(bText)) {
        issues.push(
          issue(
            "corpus_integrity",
            "near_duplicate_prompt",
            "info",
            "src/data/placement/v3/prompts",
            `Near-duplicate Placement V3 prompts: ${a.id} and ${b.id}`,
            { a: a.id, b: b.id, score },
          ),
        );
      }
    }
  }

  const calibrationDuplicates = calibrationEntries
    .map((entry) => entry.id)
    .filter((id, index, ids) => ids.indexOf(id) !== index);
  for (const id of unique(calibrationDuplicates)) {
    issues.push(
      issue(
        "corpus_integrity",
        "malformed_calibration_entry",
        "error",
        "src/data/placement/v3/calibration",
        `Duplicate calibration entry id ${id}`,
        { id },
      ),
    );
  }

  for (const entry of calibrationEntries) {
    if (!v3PromptIds.has(entry.promptId)) {
      issues.push(
        issue(
          "corpus_integrity",
          "invalid_recommendation_reference",
          "error",
          entry.file,
          `Calibration entry ${entry.id} references missing prompt ${entry.promptId}`,
          { id: entry.id, promptId: entry.promptId },
        ),
      );
    }
    if (!(V3_MODALITIES as readonly string[]).includes(entry.modality)) {
      issues.push(
        issue(
          "corpus_integrity",
          "invalid_modality_mapping",
          "error",
          entry.file,
          `Calibration entry ${entry.id} has invalid modality ${entry.modality}`,
          { id: entry.id, modality: entry.modality },
        ),
      );
    }
    if (!(PLACEMENT_QUESTION_CEFR as readonly string[]).includes(entry.expectedLevel)) {
      issues.push(
        issue(
          "corpus_integrity",
          "missing_cefr_label",
          "error",
          entry.file,
          `Calibration entry ${entry.id} has invalid expectedLevel ${entry.expectedLevel}`,
          { id: entry.id, expectedLevel: entry.expectedLevel },
        ),
      );
    }
    if (!entry.userResponse || !entry.expertNotes || !entry.difficulty) {
      issues.push(
        issue(
          "corpus_integrity",
          "malformed_calibration_entry",
          "error",
          entry.file,
          `Calibration entry ${entry.id} is missing response, notes, or difficulty metadata`,
          { id: entry.id },
        ),
      );
    }
    for (const tag of entry.expectedL1Flags) {
      if (!knownV3L1Ids.includes(tag)) {
        issues.push(
          issue(
            "corpus_integrity",
            "invalid_taxonomy_reference",
            "error",
            entry.file,
            `Calibration entry ${entry.id} references undefined Placement V3 L1 flag ${tag}`,
            { id: entry.id, tag },
          ),
        );
      }
    }
  }

  for (const q of placementQuestions) {
    if (!(PLACEMENT_QUESTION_CEFR as readonly string[]).includes(q.cefr)) {
      issues.push(
        issue(
          "corpus_integrity",
          "missing_cefr_label",
          "error",
          "src/lib/placement/questions.ts",
          `Question ${q.id} has invalid CEFR label ${q.cefr}`,
          { id: q.id, cefr: q.cefr },
        ),
      );
    }
    if (q.difficulty !== (PLACEMENT_QUESTION_CEFR as readonly string[]).indexOf(q.cefr) + 1) {
      issues.push(
        issue(
          "corpus_integrity",
          "impossible_cefr_transition",
          "warning",
          "src/lib/placement/questions.ts",
          `Question ${q.id} CEFR ${q.cefr} does not match difficulty ${q.difficulty}`,
          { id: q.id, cefr: q.cefr, difficulty: q.difficulty },
        ),
      );
    }
    if (!(VALID_MODALITIES as readonly string[]).includes(q.skill)) {
      issues.push(
        issue(
          "corpus_integrity",
          "invalid_modality_mapping",
          "error",
          "src/lib/placement/questions.ts",
          `Question ${q.id} has invalid skill/modality ${q.skill}`,
          { id: q.id, skill: q.skill },
        ),
      );
    }
    if (!q.prompt?.en || !q.prompt?.vi || !Array.isArray(q.options)) {
      issues.push(
        issue(
          "corpus_integrity",
          "malformed_calibration_entry",
          "error",
          "src/lib/placement/questions.ts",
          `Question ${q.id} is missing prompt or options metadata`,
          { id: q.id },
        ),
      );
    }
    if (q.type === "reading_comprehension" && !q.passage?.en) {
      issues.push(
        issue(
          "corpus_integrity",
          "malformed_calibration_entry",
          "error",
          "src/lib/placement/questions.ts",
          `Reading question ${q.id} is missing a passage`,
          { id: q.id },
        ),
      );
    }
    if (q.weaknessTag && !weaknessTags.includes(q.weaknessTag)) {
      issues.push(
        issue(
          "corpus_integrity",
          "invalid_taxonomy_reference",
          "error",
          "src/lib/placement/questions.ts",
          `Question ${q.id} references undefined weakness taxonomy tag ${q.weaknessTag}`,
          { id: q.id, weaknessTag: q.weaknessTag },
        ),
      );
    }

    const promptKey = normalizePrompt(q.prompt.en);
    byPrompt.set(promptKey, [...(byPrompt.get(promptKey) ?? []), q.id]);
  }

  for (const [promptKey, ids] of byPrompt) {
    if (promptKey && ids.length > 1) {
      issues.push(
        issue(
          "corpus_integrity",
          "duplicate_prompt",
          "warning",
          "src/lib/placement/questions.ts",
          `Duplicate prompt text appears in ${ids.join(", ")}`,
          { promptKey, ids },
        ),
      );
    }
  }

  for (let i = 0; i < placementQuestions.length; i += 1) {
    for (let j = i + 1; j < placementQuestions.length; j += 1) {
      const a = placementQuestions[i];
      const b = placementQuestions[j];
      const score = jaccard(trigrams(a.prompt.en), trigrams(b.prompt.en));
      if (score >= 0.82 && normalizePrompt(a.prompt.en) !== normalizePrompt(b.prompt.en)) {
        issues.push(
          issue(
            "corpus_integrity",
            "near_duplicate_prompt",
            "info",
            "src/lib/placement/questions.ts",
            `Near-duplicate prompts: ${a.id} and ${b.id}`,
            { a: a.id, b: b.id, score },
          ),
        );
      }
    }
  }

  for (const [cefr, roomId] of Object.entries(cefrToRoom)) {
    if (!VALID_CEFR.includes(cefr as never)) {
      issues.push(
        issue(
          "corpus_integrity",
          "impossible_cefr_transition",
          "error",
          "src/lib/placement/cefrToRoom.ts",
          `Recommendation map contains invalid CEFR key ${cefr}`,
          { cefr, roomId },
        ),
      );
    }
    if (!roomExists(roomId)) {
      issues.push(
        issue(
          "corpus_integrity",
          "invalid_recommendation_reference",
          "error",
          "src/lib/placement/cefrToRoom.ts",
          `CEFR ${cefr} maps to missing room ${roomId}`,
          { cefr, roomId },
        ),
      );
    }
  }

  return issues;
}

export function auditTaxonomyConsistency(): PlacementDataQualityIssue[] {
  const issues = [...missingRequiredSurfaceIssues("taxonomy_consistency")];
  const placementQuestions = loadPlacementQuestions();
  const weaknessCatalog = loadWeaknessCatalog();
  const v3Prompts = loadV3Prompts();
  const calibrationEntries = loadV3CalibrationEntries();
  const knownV3L1Ids = loadKnownV3L1Ids();
  const tags = Object.keys(weaknessCatalog);
  const v3Used = new Set([
    ...v3Prompts.flatMap((prompt) => prompt.l1InterferenceTriggers),
    ...calibrationEntries.flatMap((entry) => entry.expectedL1Flags),
  ]);
  const duplicateV3Ids = knownV3L1Ids.filter((tag, index) => knownV3L1Ids.indexOf(tag) !== index);
  for (const tag of unique(duplicateV3Ids)) {
    issues.push(
      issue(
        "taxonomy_consistency",
        "duplicate_taxonomy_id",
        "error",
        "src/data/placement/v3/prompts/index.ts",
        `Duplicate Placement V3 L1 interference id ${tag}`,
        { tag },
      ),
    );
  }
  for (const tag of v3Used) {
    if (!knownV3L1Ids.includes(tag)) {
      issues.push(
        issue(
          "taxonomy_consistency",
          "undefined_taxonomy_category",
          "error",
          "src/data/placement/v3",
          `Placement V3 corpus references undefined L1 interference id ${tag}`,
          { tag },
        ),
      );
    }
  }
  for (const tag of knownV3L1Ids) {
    if (!v3Used.has(tag)) {
      issues.push(
        issue(
          "taxonomy_consistency",
          "unused_taxonomy_category",
          "info",
          "src/data/placement/v3/prompts/index.ts",
          `Placement V3 L1 interference id ${tag} is not referenced by prompts or calibration entries`,
          { tag },
        ),
      );
    }
  }
  const duplicates = tags.filter((tag, index) => tags.indexOf(tag) !== index);
  for (const tag of unique(duplicates)) {
    issues.push(
      issue(
        "taxonomy_consistency",
        "duplicate_taxonomy_id",
        "error",
        "src/lib/weakness/weakness-catalog.ts",
        `Duplicate weakness taxonomy id ${tag}`,
        { tag },
      ),
    );
  }

  for (const tag of tags) {
    const entry = weaknessCatalog[tag];
    if (!entry) {
      issues.push(
        issue(
          "taxonomy_consistency",
          "undefined_taxonomy_category",
          "error",
          "src/lib/weakness/weakness-catalog.ts",
          `ALL_WEAKNESS_TAGS references missing catalog entry ${tag}`,
          { tag },
        ),
      );
      continue;
    }
    if (entry.tag !== tag) {
      issues.push(
        issue(
          "taxonomy_consistency",
          "taxonomy_conflict",
          "error",
          "src/lib/weakness/weakness-catalog.ts",
          `Catalog key ${tag} contains mismatched entry.tag ${entry.tag}`,
          { key: tag, entryTag: entry.tag },
        ),
      );
    }
    if (!entry.hasDescription || !entry.hasExamples) {
      issues.push(
        issue(
          "taxonomy_consistency",
          "missing_metadata",
          "warning",
          "src/lib/weakness/weakness-catalog.ts",
          `Taxonomy tag ${tag} is missing description or learner examples`,
          { tag },
        ),
      );
    }
    if (entry.linkedRoomId && !roomExists(entry.linkedRoomId)) {
      issues.push(
        issue(
          "taxonomy_consistency",
          "missing_remediation_link",
          "error",
          "src/lib/weakness/weakness-catalog.ts",
          `Taxonomy tag ${tag} links to missing room ${entry.linkedRoomId}`,
          { tag, linkedRoomId: entry.linkedRoomId },
        ),
      );
    }
    if (!entry.linkedRoomId) {
      issues.push(
        issue(
          "taxonomy_consistency",
          "missing_remediation_link",
          "warning",
          "src/lib/weakness/weakness-catalog.ts",
          `Taxonomy tag ${tag} has no remediation room link`,
          { tag },
        ),
      );
    }
  }

  const usedByPlacement = new Set(
    placementQuestions.map((q) => q.weaknessTag).filter(Boolean) as string[],
  );
  for (const tag of tags) {
    if (!usedByPlacement.has(tag)) {
      issues.push(
        issue(
          "taxonomy_consistency",
          "unused_taxonomy_category",
          "info",
          "src/lib/weakness/weakness-catalog.ts",
          `Taxonomy tag ${tag} is not referenced by the deterministic placement question bank`,
          { tag },
        ),
      );
    }
  }

  return issues;
}

export function auditRecommendationGraph(): PlacementDataQualityIssue[] {
  const issues = [...missingRequiredSurfaceIssues("recommendation_graph")];
  const cefrToRoom = loadCefrToRoom();
  const weaknessCatalog = loadWeaknessCatalog();
  const knownV3L1Ids = loadKnownV3L1Ids();
  for (const [cefr, roomId] of Object.entries(cefrToRoom)) {
    if (!VALID_CEFR.includes(cefr as never)) {
      issues.push(
        issue(
          "recommendation_graph",
          "invalid_recommendation_reference",
          "error",
          "src/lib/placement/cefrToRoom.ts",
          `Invalid CEFR transition source ${cefr}`,
          { cefr, roomId },
        ),
      );
    }
    if (!roomExists(roomId)) {
      issues.push(
        issue(
          "recommendation_graph",
          "orphan_recommendation_path",
          "error",
          "src/lib/placement/cefrToRoom.ts",
          `Recommendation path ${cefr} -> ${roomId} is orphaned because the room file is missing`,
          { cefr, roomId },
        ),
      );
    }
  }

  const mappedRooms = new Set(Object.values(cefrToRoom));
  for (const [tag, entry] of Object.entries(weaknessCatalog)) {
    if (entry.linkedRoomId && !roomExists(entry.linkedRoomId)) {
      issues.push(
        issue(
          "recommendation_graph",
          "broken_prerequisite_chain",
          "error",
          "src/lib/weakness/weakness-catalog.ts",
          `Weakness recommendation ${tag} points to missing room ${entry.linkedRoomId}`,
          { tag, linkedRoomId: entry.linkedRoomId },
        ),
      );
    }
    if (entry.linkedRoomId && mappedRooms.has(entry.linkedRoomId)) {
      issues.push(
        issue(
          "recommendation_graph",
          "cyclic_recommendation_chain",
          "info",
          "src/lib/weakness/weakness-catalog.ts",
          `Weakness remediation ${tag} reuses a placement starting room; review for loop risk`,
          { tag, linkedRoomId: entry.linkedRoomId },
        ),
      );
    }
  }

  const recommenderSource = exists("src/lib/placement/v3/recommender.ts")
    ? readSource("src/lib/placement/v3/recommender.ts")
    : "";
  const aliasBlock = /const L1_ALIASES[\s\S]*?=\s*\{([\s\S]*?)\};/.exec(recommenderSource)?.[1] ?? "";
  const aliasTargets = extractQuotedValues(aliasBlock, /:\s*["']([^"']+)["']/g);
  for (const target of aliasTargets) {
    const knownInLegacy = target.startsWith("vi_l1_") && Object.prototype.hasOwnProperty.call(weaknessCatalog, target);
    const knownInV3 = knownV3L1Ids.includes(target);
    if (!knownInLegacy && !knownInV3) {
      issues.push(
        issue(
          "recommendation_graph",
          "invalid_recommendation_reference",
          "warning",
          "src/lib/placement/v3/recommender.ts",
          `Recommendation L1 alias points to taxonomy id not defined in legacy or V3 catalogs: ${target}`,
          { target },
        ),
      );
    }
  }

  return issues;
}

export function auditPromptRubricAlignment(): PlacementDataQualityIssue[] {
  const issues = [...missingRequiredSurfaceIssues("prompt_rubric_alignment")];
  const placementQuestions = loadPlacementQuestions();
  const v3Prompts = loadV3Prompts();
  const calibrationEntries = loadV3CalibrationEntries();
  const calibrationByPrompt = new Map<string, LocalCalibrationEntry[]>();
  for (const entry of calibrationEntries) {
    calibrationByPrompt.set(entry.promptId, [...(calibrationByPrompt.get(entry.promptId) ?? []), entry]);
  }
  for (const prompt of v3Prompts) {
    const acceptable = new Set(prompt.acceptableLevels);
    if (!acceptable.has(prompt.targetLevel)) {
      issues.push(
        issue(
          "prompt_rubric_alignment",
          "prompt_level_mismatch",
          "warning",
          prompt.file,
          `Prompt ${prompt.id} targetLevel ${prompt.targetLevel} is not included in acceptableLevels`,
          { id: prompt.id, targetLevel: prompt.targetLevel, acceptableLevels: prompt.acceptableLevels },
        ),
      );
    }
    if (prompt.modality === "reading" && prompt.questions.length === 0) {
      issues.push(
        issue(
          "prompt_rubric_alignment",
          "prompt_modality_mismatch",
          "error",
          prompt.file,
          `Reading prompt ${prompt.id} is missing questions`,
          { id: prompt.id },
        ),
      );
    }
    if (prompt.modality === "listening" && prompt.questions.length === 0) {
      issues.push(
        issue(
          "prompt_rubric_alignment",
          "prompt_modality_mismatch",
          "error",
          prompt.file,
          `Listening prompt ${prompt.id} is missing questions`,
          { id: prompt.id },
        ),
      );
    }
    const samples = calibrationByPrompt.get(prompt.id) ?? [];
    if (!samples.length) {
      issues.push(
        issue(
          "prompt_rubric_alignment",
          "orphaned_rubric_reference",
          "warning",
          prompt.file,
          `Prompt ${prompt.id} has no calibration entry`,
          { id: prompt.id },
        ),
      );
    }
    for (const entry of samples) {
      if (entry.modality !== prompt.modality) {
        issues.push(
          issue(
            "prompt_rubric_alignment",
            "prompt_modality_mismatch",
            "error",
            entry.file,
            `Calibration entry ${entry.id} modality ${entry.modality} does not match prompt ${prompt.id} modality ${prompt.modality}`,
            { id: entry.id, promptId: prompt.id, entryModality: entry.modality, promptModality: prompt.modality },
          ),
        );
      }
      if (!acceptable.has(entry.expectedLevel)) {
        issues.push(
          issue(
            "prompt_rubric_alignment",
            "prompt_level_mismatch",
            "warning",
            entry.file,
            `Calibration entry ${entry.id} expectedLevel ${entry.expectedLevel} is outside prompt ${prompt.id} acceptableLevels`,
            { id: entry.id, promptId: prompt.id, expectedLevel: entry.expectedLevel, acceptableLevels: prompt.acceptableLevels },
          ),
        );
      }
      for (const dimension of Object.keys(entry.expectedSubskills)) {
        if (!(V3_RUBRIC_DIMENSIONS as readonly string[]).includes(dimension)) {
          issues.push(
            issue(
              "prompt_rubric_alignment",
              "rubric_category_mismatch",
              "warning",
              entry.file,
              `Calibration entry ${entry.id} uses non-rubric subskill ${dimension}`,
              { id: entry.id, dimension },
            ),
          );
        }
      }
    }
  }
  for (const q of placementQuestions) {
    const descriptor = q.cefrDescriptor.toLowerCase();
    if (!descriptor.includes(q.cefr.toLowerCase())) {
      issues.push(
        issue(
          "prompt_rubric_alignment",
          "prompt_level_mismatch",
          "warning",
          "src/lib/placement/questions.ts",
          `Question ${q.id} descriptor does not mention its CEFR ${q.cefr}`,
          { id: q.id, cefr: q.cefr, cefrDescriptor: q.cefrDescriptor },
        ),
      );
    }
    if (q.skill !== "usage" && !descriptor.includes(q.skill.replace("_", " "))) {
      issues.push(
        issue(
          "prompt_rubric_alignment",
          "rubric_category_mismatch",
          "warning",
          "src/lib/placement/questions.ts",
          `Question ${q.id} skill ${q.skill} is not reflected in descriptor`,
          { id: q.id, skill: q.skill, cefrDescriptor: q.cefrDescriptor },
        ),
      );
    }
    if (q.type === "reading_comprehension" && q.skill !== "reading") {
      issues.push(
        issue(
          "prompt_rubric_alignment",
          "prompt_modality_mismatch",
          "error",
          "src/lib/placement/questions.ts",
          `Reading comprehension question ${q.id} has non-reading skill ${q.skill}`,
          { id: q.id, skill: q.skill },
        ),
      );
    }
    if (q.type === "multiple_choice" && q.options.length < 4) {
      issues.push(
        issue(
          "prompt_rubric_alignment",
          "rubric_missing_scoring_dimension",
          "warning",
          "src/lib/placement/questions.ts",
          `Question ${q.id} has fewer than four answer options`,
          { id: q.id, optionCount: q.options.length },
        ),
      );
    }
  }

  return issues;
}

export function buildRun(
  auditKinds: PlacementDataQualityAuditKind[],
  issues: PlacementDataQualityIssue[],
  command: string,
): PlacementDataQualityRun {
  const timestamp = new Date().toISOString();
  return {
    runId: `a3-${timestamp.replace(/[-:.]/g, "").slice(0, 15)}`,
    timestamp,
    command,
    auditKinds,
    issues,
    counts: countIssues(issues),
    changedFilesSincePreviousRun: changedFilesSincePreviousRun(),
    auditedFiles: collectAuditedFiles(),
    missingRequiredSurfaces: REQUIRED_SURFACES.filter((surface) => !exists(surface)),
  };
}

export function writeRun(run: PlacementDataQualityRun, prefix: string): string {
  fs.mkdirSync(RAW_RUN_DIR, { recursive: true });
  const file = path.join(RAW_RUN_DIR, `${run.runId}-${prefix}.json`);
  fs.writeFileSync(file, `${JSON.stringify(run, null, 2)}\n`);
  return file;
}

export function runAudit(kind: PlacementDataQualityAuditKind): PlacementDataQualityRun {
  const command = `pnpm tsx scripts/placement-v3/${scriptNameForKind(kind)}`;
  const issues =
    kind === "corpus_integrity"
      ? auditCorpusIntegrity()
      : kind === "taxonomy_consistency"
        ? auditTaxonomyConsistency()
        : kind === "recommendation_graph"
          ? auditRecommendationGraph()
          : auditPromptRubricAlignment();
  return buildRun([kind], issues, command);
}

export function scriptNameForKind(kind: PlacementDataQualityAuditKind): string {
  return kind === "corpus_integrity"
    ? "run-corpus-integrity-audit.ts"
    : kind === "taxonomy_consistency"
      ? "run-taxonomy-consistency.ts"
      : kind === "recommendation_graph"
        ? "run-recommendation-graph-audit.ts"
        : "run-prompt-rubric-alignment.ts";
}

export function printRun(run: PlacementDataQualityRun): void {
  console.log(JSON.stringify(run, null, 2));
}

export function readSource(rel: string): string {
  return fs.readFileSync(path.join(REPO_ROOT, rel), "utf8");
}

export function extractCefrLikeValuesFromFile(rel: string): string[] {
  if (!exists(rel)) return [];
  const source = readSource(rel);
  return extractQuotedValues(source, /['"]((?:pre_a1)|A1|A2|B1|B2|C1|C2)['"]/g);
}
