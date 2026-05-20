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
  "docs/placement-v3/calibration",
  "docs/placement-v3/taxonomy",
  "docs/placement-v3/prompt-library",
  "src/lib/recommendations",
  "supabase/functions/placement-v3-grade-writing/index.ts",
  "supabase/functions/placement-v3-session-orchestrator/index.ts",
];

const VALID_CEFR = ["pre_a1", "A1", "A2", "B1", "B2", "C1", "C2"] as const;
const PLACEMENT_QUESTION_CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const VALID_MODALITIES = [
  "reading",
  "listening",
  "grammar",
  "vocabulary",
  "usage",
  "writing",
  "writing_sample",
] as const;

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
    "src/lib/placement/questions.ts",
    "src/lib/placement/cefrToRoom.ts",
    "src/lib/weakness/weakness-catalog.ts",
    "src/lib/weakness/recommendationEngine.ts",
    "src/lib/weakness/micro-lessons.ts",
    "supabase/functions/placement-session/types.ts",
    "supabase/functions/placement-session/config.ts",
    "supabase/functions/placement-session/engine/itemBank.ts",
    "supabase/migrations/20260618000000_placement_items.sql",
    "supabase/migrations/20260619000000_placement_sessions.sql",
  ];
  return candidates.filter(exists);
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
  const byPrompt = new Map<string, string[]>();

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
  const tags = Object.keys(weaknessCatalog);
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

  return issues;
}

export function auditPromptRubricAlignment(): PlacementDataQualityIssue[] {
  const issues = [...missingRequiredSurfaceIssues("prompt_rubric_alignment")];
  const placementQuestions = loadPlacementQuestions();
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
