import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const DEFAULT_SOURCE_DIR = "src/languages";
const DEFAULT_ASSET_DIR = "public";
const DEFAULT_BASELINE_PATH = "scripts/factory/cell-coverage-baseline.json";

export const IPA_FIELDS = [
  "ipa",
  "ipa_en",
  "ipa_vi",
  "pronunciation",
  "pronunciation_en",
  "pronunciation_vi",
];

export const AUDIO_FIELDS = [
  "audio",
  "audio_url",
  "audioUrl",
  "audio_path",
  "audioPath",
  "reference_audio",
  "referenceAudio",
];

const LANGUAGE_TEXT_FIELDS = [
  "arabic",
  "chinese",
  "french",
  "german",
  "hindi",
  "indonesian",
  "italian",
  "japanese",
  "korean",
  "portuguese",
  "punjabi",
  "russian",
  "spanish",
  "swahili",
  "thai",
  "turkish",
  "urdu",
  "vietnamese",
];

const TEXT_FIELDS_BY_TYPE = {
  vocabulary: ["word", "term", "text", "line", "phrase", "target", "en", ...LANGUAGE_TEXT_FIELDS],
  dialogue: ["text", "line", "phrase", "target", "sentence", "prompt", "en", ...LANGUAGE_TEXT_FIELDS],
};

function rel(root, file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function walkFiles(dir, exts, acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__" || entry.name === "fixtures" || entry.name === "__fixtures__") continue;
      walkFiles(p, exts, acc);
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      acc.push(p);
    }
  }
  return acc;
}

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
  return undefined;
}

function objectProperties(node) {
  const out = new Map();
  if (!ts.isObjectLiteralExpression(node)) return out;
  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const name = propertyName(property.name);
    if (name) out.set(name, property.initializer);
  }
  return out;
}

function stringValue(node) {
  return node && ts.isStringLiteralLike(node) ? node.text : undefined;
}

function stringField(properties, field) {
  return stringValue(properties.get(field));
}

function populatedStringField(properties, field) {
  const value = stringField(properties, field);
  return value && value.trim().length > 0 ? value.trim() : "";
}

function hasArrayField(properties, field) {
  return properties.get(field) && ts.isArrayLiteralExpression(properties.get(field));
}

function findCellLessonObjects(file, sourceText) {
  const source = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true);
  const lessons = [];
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const properties = objectProperties(node);
      if (hasArrayField(properties, "vocabulary") || hasArrayField(properties, "dialogue")) {
        lessons.push({ node, properties });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return lessons;
}

function collectExistingAudioAssets(root, assetDir) {
  const dir = path.join(root, assetDir);
  return new Set(
    walkFiles(dir, [".mp3", ".wav", ".m4a", ".ogg"])
      .map((file) => rel(root, file)),
  );
}

function audioReferences(properties) {
  const refs = [];
  for (const field of AUDIO_FIELDS) {
    const value = properties.get(field);
    if (!value) continue;
    if (ts.isStringLiteralLike(value)) {
      refs.push({ field, value: value.text });
      continue;
    }
    if (ts.isObjectLiteralExpression(value)) {
      const nested = objectProperties(value);
      for (const [nestedField, nestedValue] of nested.entries()) {
        const text = stringValue(nestedValue);
        if (text !== undefined) refs.push({ field: `${field}.${nestedField}`, value: text });
      }
    }
  }
  return refs;
}

function resolveAudioReference(ref, audioAssets) {
  const value = String(ref.value || "").trim();
  if (!value) return false;
  if (value.startsWith("data:audio/")) return true;
  if (/^https?:\/\//i.test(value)) return false;

  const stripped = value.replace(/^\/+/, "");
  const candidates = [
    stripped,
    `public/${stripped}`,
    `public/audio/${stripped}`,
    `public/audio/en/${stripped}`,
    `public/audio/vi/${stripped}`,
  ].map((candidate) => candidate.replaceAll("\\", "/"));
  return candidates.some((candidate) => audioAssets.has(candidate));
}

function ipaReferences(properties) {
  return IPA_FIELDS
    .map((field) => ({ field, value: stringField(properties, field) }))
    .filter((entry) => entry.value !== undefined);
}

function textForObject(properties, type) {
  for (const field of TEXT_FIELDS_BY_TYPE[type] || []) {
    const value = stringField(properties, field);
    if (value) return value;
  }
  return "";
}

function tokensForText(text) {
  return (String(text).toLowerCase().match(/[\p{L}\p{M}\p{N}]+(?:[''.-][\p{L}\p{M}\p{N}]+)*/gu) || [])
    .filter(Boolean);
}

function percent(numerator, denominator) {
  return denominator === 0 ? 100 : Number(((numerator / denominator) * 100).toFixed(2));
}

function emptyCoverage() {
  return {
    objects: 0,
    cellIdCoveredObjects: 0,
    ipaCoveredObjects: 0,
    audioCoveredObjects: 0,
    uniqueWordTokens: 0,
    ipaCoveredUniqueWordTokens: 0,
    audioCoveredUniqueWordTokens: 0,
    uncoveredIpaObjects: 0,
    uncoveredAudioObjects: 0,
    uncoveredCellIdObjects: 0,
    uncoveredIpaUniqueWordTokens: 0,
    uncoveredAudioUniqueWordTokens: 0,
    ipaObjectPercent: 100,
    audioObjectPercent: 100,
    ipaUniqueWordTokenPercent: 100,
    audioUniqueWordTokenPercent: 100,
  };
}

function summarizeType(items, type) {
  const selected = items.filter((item) => item.type === type);
  const byToken = new Map();
  for (const item of selected) {
    for (const token of tokensForText(item.text)) {
      const existing = byToken.get(token) || { ipa: false, audio: false };
      existing.ipa ||= item.ipaCovered;
      existing.audio ||= item.audioCovered;
      byToken.set(token, existing);
    }
  }

  const summary = {
    ...emptyCoverage(),
    objects: selected.length,
    cellIdCoveredObjects: selected.filter((item) => item.cellId).length,
    ipaCoveredObjects: selected.filter((item) => item.ipaCovered).length,
    audioCoveredObjects: selected.filter((item) => item.audioCovered).length,
    uniqueWordTokens: byToken.size,
    ipaCoveredUniqueWordTokens: [...byToken.values()].filter((item) => item.ipa).length,
    audioCoveredUniqueWordTokens: [...byToken.values()].filter((item) => item.audio).length,
  };
  summary.uncoveredIpaObjects = summary.objects - summary.ipaCoveredObjects;
  summary.uncoveredAudioObjects = summary.objects - summary.audioCoveredObjects;
  summary.uncoveredCellIdObjects = summary.objects - summary.cellIdCoveredObjects;
  summary.uncoveredIpaUniqueWordTokens = summary.uniqueWordTokens - summary.ipaCoveredUniqueWordTokens;
  summary.uncoveredAudioUniqueWordTokens = summary.uniqueWordTokens - summary.audioCoveredUniqueWordTokens;
  summary.ipaObjectPercent = percent(summary.ipaCoveredObjects, summary.objects);
  summary.audioObjectPercent = percent(summary.audioCoveredObjects, summary.objects);
  summary.ipaUniqueWordTokenPercent = percent(summary.ipaCoveredUniqueWordTokens, summary.uniqueWordTokens);
  summary.audioUniqueWordTokenPercent = percent(summary.audioCoveredUniqueWordTokens, summary.uniqueWordTokens);
  return summary;
}

function summarizeCellIds(items) {
  const populated = items.filter((item) => item.cellId);
  const byId = new Map();
  for (const item of populated) {
    const existing = byId.get(item.cellId) || [];
    existing.push(item);
    byId.set(item.cellId, existing);
  }
  const duplicates = [...byId.entries()].filter(([, entries]) => entries.length > 1);
  return {
    totalObjects: items.length,
    populated: populated.length,
    missing: items.length - populated.length,
    unique: byId.size,
    duplicateIds: duplicates.length,
    duplicateObjects: duplicates.reduce((sum, [, entries]) => sum + entries.length, 0),
    duplicateSamples: duplicates.slice(0, 10).map(([id, entries]) => ({
      id,
      locations: entries.map((entry) => `${entry.file}:${entry.type}`).slice(0, 5),
    })),
  };
}

function clusterItems(items, key) {
  const clusters = new Map();
  for (const item of items) {
    const name = key === "level" ? `${item.level || "unknown"}:${item.type}` : item.file;
    const cluster = clusters.get(name) || {
      name,
      totalObjects: 0,
      vocabularyObjects: 0,
      dialogueObjects: 0,
      missingIpaObjects: 0,
      missingAudioObjects: 0,
    };
    cluster.totalObjects++;
    if (item.type === "vocabulary") cluster.vocabularyObjects++;
    if (item.type === "dialogue") cluster.dialogueObjects++;
    if (!item.ipaCovered) cluster.missingIpaObjects++;
    if (!item.audioCovered) cluster.missingAudioObjects++;
    clusters.set(name, cluster);
  }
  return [...clusters.values()]
    .sort((a, b) => (
      b.missingIpaObjects - a.missingIpaObjects
      || b.missingAudioObjects - a.missingAudioObjects
      || a.name.localeCompare(b.name)
    ));
}

export function scanCellCoverage(options = {}) {
  const root = options.root || process.cwd();
  const sourceDir = options.sourceDir || DEFAULT_SOURCE_DIR;
  const assetDir = options.assetDir || DEFAULT_ASSET_DIR;
  const audioAssets = collectExistingAudioAssets(root, assetDir);
  const files = walkFiles(path.join(root, sourceDir), [".ts"])
    .filter((file) => !/\.(test|spec)\.ts$/.test(file))
    .sort();

  const items = [];
  let lessonObjectCount = 0;
  const filesWithCell = new Set();

  for (const file of files) {
    let sourceText;
    try {
      sourceText = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const lesson of findCellLessonObjects(file, sourceText)) {
      lessonObjectCount++;
      const level = stringField(lesson.properties, "level") || "unknown";
      for (const type of ["vocabulary", "dialogue"]) {
        const array = lesson.properties.get(type);
        if (!array || !ts.isArrayLiteralExpression(array)) continue;
        filesWithCell.add(rel(root, file));
        for (const element of array.elements) {
          if (!ts.isObjectLiteralExpression(element)) continue;
          const properties = objectProperties(element);
          const ipaRefs = ipaReferences(properties);
          const audioRefs = audioReferences(properties);
          items.push({
            file: rel(root, file),
            type,
            level,
            text: textForObject(properties, type),
            cellId: populatedStringField(properties, "cell_id"),
            ipaCovered: ipaRefs.some((ref) => String(ref.value || "").trim().length > 0),
            audioCovered: audioRefs.some((ref) => resolveAudioReference(ref, audioAssets)),
          });
        }
      }
    }
  }

  const totals = {
    vocabulary: summarizeType(items, "vocabulary"),
    dialogue: summarizeType(items, "dialogue"),
  };
  const combined = summarizeType(items.map((item) => ({ ...item, type: "all" })), "all");
  const cellIds = summarizeCellIds(items);

  return {
    definitions: {
      ipaCovered: `An object is IPA-covered when any of ${IPA_FIELDS.join(", ")} exists as a non-empty string. Empty strings are uncovered.`,
      audioAddressable: `An object is audio-addressable when any of ${AUDIO_FIELDS.join(", ")} points to a checked-in audio asset under ${assetDir}/ or uses a data:audio URI. Missing files, empty strings, and http(s) runtime URLs are not counted as checked-in reference audio.`,
      denominators: "Reports both per-object coverage and per-unique-word-token coverage.",
    },
    filesScanned: files.length,
    filesWithCell: filesWithCell.size,
    lessonObjects: lessonObjectCount,
    audioAssets: audioAssets.size,
    cellIds,
    totals,
    combined,
    clusters: {
      byFile: clusterItems(items, "file"),
      byLevel: clusterItems(items, "level"),
    },
  };
}

export function readCellCoverageBaseline(root = process.cwd(), baselinePath = DEFAULT_BASELINE_PATH) {
  const fullPath = path.join(root, baselinePath);
  const raw = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(raw);
}

export function compareCellCoverageToBaseline(current, baseline) {
  const findings = [];
  for (const type of ["vocabulary", "dialogue"]) {
    const currentType = current.totals[type];
    const baselineType = baseline?.totals?.[type] || {};
    for (const metric of [
      "uncoveredIpaObjects",
      "uncoveredAudioObjects",
      "uncoveredIpaUniqueWordTokens",
      "uncoveredAudioUniqueWordTokens",
    ]) {
      const allowed = Number(baselineType[metric]);
      const actual = Number(currentType[metric]);
      if (Number.isFinite(allowed) && actual > allowed) {
        findings.push({
          type,
          metric,
          baseline: allowed,
          actual,
        });
      }
    }
  }
  return findings;
}

export function formatCellCoverageSummary(scan, baselineFindings = []) {
  const lines = [];
  lines.push(`CELL files scanned=${scan.filesScanned}; files_with_cell=${scan.filesWithCell}; lesson_objects=${scan.lessonObjects}; audio_assets=${scan.audioAssets}`);
  lines.push(`cell_id: populated=${scan.cellIds.populated}/${scan.cellIds.totalObjects}; missing=${scan.cellIds.missing}; unique=${scan.cellIds.unique}; duplicate_ids=${scan.cellIds.duplicateIds}; duplicate_objects=${scan.cellIds.duplicateObjects}`);
  for (const type of ["vocabulary", "dialogue"]) {
    const s = scan.totals[type];
    lines.push(`${type}: objects=${s.objects}; IPA=${s.ipaCoveredObjects}/${s.objects} (${s.ipaObjectPercent}%); audio=${s.audioCoveredObjects}/${s.objects} (${s.audioObjectPercent}%); unique_tokens=${s.uniqueWordTokens}; IPA_tokens=${s.ipaCoveredUniqueWordTokens}/${s.uniqueWordTokens} (${s.ipaUniqueWordTokenPercent}%); audio_tokens=${s.audioCoveredUniqueWordTokens}/${s.uniqueWordTokens} (${s.audioUniqueWordTokenPercent}%)`);
  }
  const worst = scan.clusters.byFile.slice(0, 5)
    .map((cluster) => `${cluster.name} missing_ipa=${cluster.missingIpaObjects} missing_audio=${cluster.missingAudioObjects}`)
    .join("; ");
  lines.push(`worst_file_clusters: ${worst || "none"}`);
  if (baselineFindings.length) {
    lines.push(`baseline_exceeded: ${baselineFindings.map((finding) => `${finding.type}.${finding.metric} actual=${finding.actual} baseline=${finding.baseline}`).join("; ")}`);
  } else {
    lines.push("baseline_exceeded: none");
  }
  return lines.join("\n");
}

export { DEFAULT_BASELINE_PATH };
