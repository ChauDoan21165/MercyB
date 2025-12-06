#!/usr/bin/env ts-node
/**
 * Mercy Blade – Room Validator (B)
 *
 * Read-only validator for room-style JSON files (tier/title/content/entries).
 * - Scans public/data (and a few fallbacks)
 * - Detects "room-like" files
 * - Applies Generator Standard checks
 * - Prints a human-readable summary
 */

import {
  readdirSync,
  readFileSync,
  statSync,
  existsSync,
} from "fs";
import { join, extname, basename } from "path";

type Severity = "error" | "warning" | "info";

interface Issue {
  file: string;
  severity: Severity;
  message: string;
}

interface ValidationStats {
  totalFiles: number;
  roomLikeFiles: number;
  validRooms: number;
  roomsWithIssues: number;
  totalEntries: number;
  avgEntriesPerRoom: number;
}

interface ValidationReport {
  totalFiles: number;
  validFiles: number;
  filesWithIssues: number;
  errors: Array<{ file: string; message: string }>;
  warnings: Array<{ file: string; message: string }>;
  info: Array<{ file: string; message: string }>;
  stats: ValidationStats;
}

const CANDIDATE_DIRS = [
  join(process.cwd(), "public", "data"),
  join(process.cwd(), "public", "data", "rooms"),
  join(process.cwd(), "src", "data"),
  join(process.cwd(), "src", "data", "rooms"),
];

function resolveRootDir(): string {
  for (const dir of CANDIDATE_DIRS) {
    if (existsSync(dir) && statSync(dir).isDirectory()) {
      return dir;
    }
  }
  throw new Error(
    "Could not find data directory. Tried:\n" + CANDIDATE_DIRS.join("\n")
  );
}

const ROOT_DIR = resolveRootDir();

function walkJsonFiles(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      walkJsonFiles(full, acc);
    } else if (st.isFile() && extname(name) === ".json") {
      acc.push(full);
    }
  }
  return acc;
}

// Helper: basic word counter
function countWords(text: string | undefined): number {
  if (!text) return 0;
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

// Heuristic: is this a "room-style" Mercy Blade file?
function isRoomLike(json: any): boolean {
  if (!json || typeof json !== "object") return false;
  const hasTier = typeof json.tier === "string";
  const hasTitle = json.title && typeof json.title === "object";
  const hasContent = json.content && typeof json.content === "object";
  const hasEntries = Array.isArray(json.entries);
  return (hasTier && hasEntries) || (hasTitle && hasContent && hasEntries);
}

// Kebab-case slug checker
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Main validation for one room-like file
function validateRoom(file: string, json: any): Issue[] {
  const issues: Issue[] = [];

  const push = (severity: Severity, message: string) => {
    issues.push({ file, severity, message });
  };

  // --- ROOT LEVEL ---

  if (!json.tier || typeof json.tier !== "string") {
    push("warning", "Missing or invalid root.tier (expected string like 'Free / Miễn phí')");
  }

  // title.en / title.vi
  if (!json.title || typeof json.title !== "object") {
    push("error", "Missing root.title object");
  } else {
    if (!json.title.en || typeof json.title.en !== "string") {
      push("error", "Missing title.en");
    }
    if (!json.title.vi || typeof json.title.vi !== "string") {
      push("error", "Missing title.vi");
    }
  }

  // content.en / content.vi
  if (!json.content || typeof json.content !== "object") {
    push("error", "Missing root.content object");
  } else {
    const en = json.content.en;
    const vi = json.content.vi;

    if (!en || typeof en !== "string") {
      push("error", "Missing content.en");
    } else {
      const w = countWords(en);
      if (w < 60 || w > 180) {
        push(
          "warning",
          `content.en word count ~${w} (recommended 80–140)`
        );
      }
    }

    if (!vi || typeof vi !== "string") {
      push("error", "Missing content.vi");
    } else {
      const w = countWords(vi);
      if (w < 60 || w > 180) {
        push(
          "warning",
          `content.vi word count ~${w} (recommended 80–140)`
        );
      }
    }
  }

  // entries
  if (!Array.isArray(json.entries)) {
    push("error", "root.entries must be an array");
    return issues;
  }

  if (json.entries.length < 2 || json.entries.length > 8) {
    push(
      "warning",
      `entries.length = ${json.entries.length} (recommended 2–8)`
    );
  }

  // --- ENTRY LEVEL ---

  json.entries.forEach((entry: any, idx: number) => {
    const ctx = `entry[${idx}]`;

    // slug
    if (!entry.slug || typeof entry.slug !== "string") {
      push("error", `${ctx}: Missing slug`);
    } else if (!SLUG_RE.test(entry.slug)) {
      push(
        "warning",
        `${ctx}: slug "${entry.slug}" is not kebab-case (expected like "simple-present-habits")`
      );
    }

    // keywords_en / keywords_vi
    if (!Array.isArray(entry.keywords_en) || entry.keywords_en.length < 3 || entry.keywords_en.length > 5) {
      push(
        "warning",
        `${ctx}: keywords_en should have 3–5 items (current: ${
          Array.isArray(entry.keywords_en) ? entry.keywords_en.length : "none"
        })`
      );
    } else if (!entry.keywords_en[0] || typeof entry.keywords_en[0] !== "string") {
      push("warning", `${ctx}: keywords_en[0] should be a non-empty label`);
    }

    if (!Array.isArray(entry.keywords_vi) || entry.keywords_vi.length < 3 || entry.keywords_vi.length > 5) {
      push(
        "warning",
        `${ctx}: keywords_vi should have 3–5 items (current: ${
          Array.isArray(entry.keywords_vi) ? entry.keywords_vi.length : "none"
        })`
      );
    } else if (!entry.keywords_vi[0] || typeof entry.keywords_vi[0] !== "string") {
      push("warning", `${ctx}: keywords_vi[0] should be a non-empty label`);
    }

    // copy.en / copy.vi
    if (!entry.copy || typeof entry.copy !== "object") {
      push("error", `${ctx}: Missing copy object`);
    } else {
      const en = entry.copy.en;
      const vi = entry.copy.vi;

      if (!en || typeof en !== "string") {
        push("error", `${ctx}: Missing copy.en`);
      } else {
        const w = countWords(en);
        if (w < 40 || w > 180) {
          push(
            "warning",
            `${ctx}: copy.en word count ~${w} (recommended 50–150)`
          );
        }
      }

      if (!vi || typeof vi !== "string") {
        push("error", `${ctx}: Missing copy.vi`);
      } else {
        const w = countWords(vi);
        if (w < 40 || w > 180) {
          push(
            "warning",
            `${ctx}: copy.vi word count ~${w} (recommended 50–150)`
          );
        }
      }
    }

    // tags
    if (!Array.isArray(entry.tags)) {
      push("warning", `${ctx}: tags should be an array with 2–4 items`);
    } else if (entry.tags.length < 2 || entry.tags.length > 4) {
      push(
        "warning",
        `${ctx}: tags.length = ${entry.tags.length} (recommended 2–4)`
      );
    }
  });

  return issues;
}

function main() {
  const files = walkJsonFiles(ROOT_DIR);
  const report: ValidationReport = {
    totalFiles: files.length,
    validFiles: 0,
    filesWithIssues: 0,
    errors: [],
    warnings: [],
    info: [],
    stats: {
      totalFiles: files.length,
      roomLikeFiles: 0,
      validRooms: 0,
      roomsWithIssues: 0,
      totalEntries: 0,
      avgEntriesPerRoom: 0,
    },
  };

  console.log(`🔍 Validating JSON under: ${ROOT_DIR}`);
  console.log(`Found ${files.length} .json files\n`);

  for (const file of files) {
    let json: any;
    try {
      const raw = readFileSync(file, "utf8");
      json = JSON.parse(raw);
    } catch (e: any) {
      const msg = `JSON parse error: ${e?.message || String(e)}`;
      report.errors.push({ file, message: msg });
      continue;
    }

    if (!isRoomLike(json)) {
      // Non-room file: just informational note for debugging
      report.info.push({
        file,
        message: "Skipped (not room-like: missing tier/title/content/entries)",
      });
      continue;
    }

    report.stats.roomLikeFiles += 1;

    const issues = validateRoom(file, json);
    const errors = issues.filter((i) => i.severity === "error");
    const warnings = issues.filter((i) => i.severity === "warning");

    if (issues.length === 0) {
      report.validFiles += 1;
      report.stats.validRooms += 1;
      console.log(`✅ ${file}`);
    } else {
      report.filesWithIssues += 1;
      report.stats.roomsWithIssues += 1;

      const shortName = basename(file);
      console.log(`\n⚠️  ${shortName}`);
      for (const iss of issues) {
        const prefix = iss.severity === "error" ? "⛔" : "•";
        console.log(`  ${prefix} ${iss.message}`);
      }

      for (const e of errors) {
        report.errors.push({ file: e.file, message: e.message });
      }
      for (const w of warnings) {
        report.warnings.push({ file: w.file, message: w.message });
      }
    }

    // stats: entries
    if (Array.isArray(json.entries)) {
      report.stats.totalEntries += json.entries.length;
    }
  }

  if (report.stats.roomLikeFiles > 0) {
    report.stats.avgEntriesPerRoom =
      report.stats.totalEntries / report.stats.roomLikeFiles;
  }

  console.log("\n===== SUMMARY =====");
  console.log(`Total JSON files:        ${report.totalFiles}`);
  console.log(`Room-like files:         ${report.stats.roomLikeFiles}`);
  console.log(`Valid rooms (no issues): ${report.stats.validRooms}`);
  console.log(`Rooms with issues:       ${report.stats.roomsWithIssues}`);
  console.log(`Total entries (rooms):   ${report.stats.totalEntries}`);
  console.log(
    `Avg entries per room:    ${report.stats.avgEntriesPerRoom.toFixed(2)}`
  );
  console.log(`Errors:                  ${report.errors.length}`);
  console.log(`Warnings:                ${report.warnings.length}`);

  // If you ever want machine-readable output:
  // console.log("\nJSON_REPORT_START");
  // console.log(JSON.stringify(report, null, 2));
  // console.log("JSON_REPORT_END");
}

main();
