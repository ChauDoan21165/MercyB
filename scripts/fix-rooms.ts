#!/usr/bin/env ts-node
/**
 * Mercy Blade – Room JSON Auto-Fixer (Updated 2025)
 * Prioritizes public/data/rooms (real deployed data)
 * Falls back to old src paths only if needed
 */

import { join, extname } from "path";
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  statSync,
} from "fs";

// ── Smart directory detection – public first! ─────────────────────────────────
const CANDIDATE_DIRS = [
  // ƯU TIÊN: dữ liệu thật khi đã build/deploy
  join(process.cwd(), "public", "data", "rooms"),
  join(process.cwd(), "public", "data"),

  // Fallback: cấu trúc dev cũ
  join(process.cwd(), "src", "data", "rooms"),
  join(process.cwd(), "src", "data"),
] as const;

function resolveRoomsDir(): string {
  for (const dir of CANDIDATE_DIRS) {
    if (existsSync(dir) && statSync(dir).isDirectory()) {
      console.log(`Found rooms directory: ${dir}`);
      return dir;
    }
  }
  throw new Error(
    "Could not find rooms directory. Tried:\n" + CANDIDATE_DIRS.join("\n")
  );
}

const ROOMS_DIR = resolveRoomsDir();

// ── Types ─────────────────────────────────────────────────────────────────────
type LangPair = { en?: string; vi?: string };
type ContentBlock = LangPair & { audio?: string };

interface Entry {
  slug?: string;
  keywords_en?: string[];
  keywords_vi?: string[];
  copy?: LangPair;
  tags?: string[];
  audio?: string;
  [key: string]: unknown;
}

interface RoomFile {
  tier?: string;
  title?: LangPair;
  content?: ContentBlock;
  entries?: Entry[];
  [key: string]: unknown;
}

interface FixResult {
  file: string;
  changed: boolean;
  fixes: string[];
  warnings: string[];
  errors: string[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function walkJsonFiles(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkJsonFiles(full, acc);
    else if (st.isFile() && extname(name) === ".json") acc.push(full);
  }
  return acc;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isLangPair(value: unknown): value is LangPair {
  return isRecord(value);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function ensureLangPair(
  obj: Record<string, unknown>,
  key: string,
  ctx: string,
  fixes: string[],
  warnings: string[]
) {
  const block = obj[key];
  if (!block) return;
  if (!isLangPair(block)) {
    warnings.push(`Empty ${ctx} (both en & vi missing)`);
    return;
  }

  if (!block.en && block.vi) {
    block.en = block.vi;
    fixes.push(`Filled missing ${ctx}.en from .vi`);
  } else if (!block.vi && block.en) {
    block.vi = block.en;
    fixes.push(`Filled missing ${ctx}.vi from .en`);
  } else if (!block.en && !block.vi) {
    warnings.push(`Empty ${ctx} (both en & vi missing)`);
  }
}

function removeDeprecatedKeys(room: RoomFile, fixes: string[]) {
  const deprecatedRoot = [
    "schema_id",
    "schema_version",
    "meta",
    "localization",
    "safety_disclaimer",
    "crisis_footer",
  ];
  for (const k of deprecatedRoot) {
    if (k in room) {
      delete room[k];
      fixes.push(`Removed deprecated root key "${k}"`);
    }
  }

  if (Array.isArray(room.entries)) {
    for (const e of room.entries) {
      const old = ["dare", "duration", "system", "severity"];
      for (const k of old) {
        if (k in e) {
          delete e[k];
          fixes.push(`Removed deprecated entry key "${k}" in "${e.slug}"`);
        }
      }
    }
  }
}

function deriveLabelFromSlug(slug = ""): string {
  if (!slug) return "Untitled";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Core fixer ───────────────────────────────────────────────────────────────
function fixRoom(room: RoomFile, file: string): FixResult {
  const fixes: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    // Title & content
    if (!room.title) warnings.push("Missing root.title");
    else ensureLangPair(room, "title", "title", fixes, warnings);

    if (!room.content) warnings.push("Missing root.content");
    else ensureLangPair(room, "content", "content", fixes, warnings);

    // Entries
    if (!Array.isArray(room.entries)) {
      warnings.push("Missing or invalid root.entries → created empty array");
      room.entries = [];
    }

    const cleaned: Entry[] = [];
    for (const entry of room.entries) {
      const ctx = entry.slug || "<no-slug>";
      let keep = true;

      entry.copy ??= {};
      ensureLangPair(entry, "copy", `entry.copy (${ctx})`, fixes, warnings);

      if (!entry.copy.en && !entry.copy.vi) {
        warnings.push(`Dropped empty entry "${ctx}"`);
        keep = false;
      }

      if (!entry.slug) {
        entry.slug = `auto-${cleaned.length + 1}`;
        fixes.push(`Auto slug "${entry.slug}"`);
      }

      if (!Array.isArray(entry.keywords_en) || entry.keywords_en.length === 0) {
        const label = deriveLabelFromSlug(entry.slug);
        entry.keywords_en = [label];
        fixes.push(`Added default keywords_en "${label}"`);
      }
      if (!Array.isArray(entry.keywords_vi) || entry.keywords_vi.length === 0) {
        entry.keywords_vi = [entry.keywords_en[0]];
        fixes.push(`Mirrored keywords_vi from en (please review)`);
      }

      if (!Array.isArray(entry.tags)) {
        entry.tags = [];
        fixes.push(`Created empty tags[]`);
      }

      if (keep) cleaned.push(entry);
    }

    if (cleaned.length < room.entries.length) {
      fixes.push(`Pruned ${room.entries.length - cleaned.length} invalid entries`);
    }
    room.entries = cleaned;

    // Clean deprecated keys
    removeDeprecatedKeys(room, fixes);

    return { file, changed: fixes.length > 0, fixes, warnings, errors };
  } catch (e: unknown) {
    errors.push(`Error: ${getErrorMessage(e)}`);
    return { file, changed: false, fixes, warnings, errors };
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
function main() {
  console.log(`Scanning: ${ROOMS_DIR}\n`);

  const files = walkJsonFiles(ROOMS_DIR);
  if (files.length === 0) {
    console.log("No JSON files found in the detected directory.");
    return;
  }

  const results: FixResult[] = [];
  let changed = 0, warns = 0, errs = 0;

  for (const file of files) {
    let json: RoomFile;
    try {
      const parsed: unknown = JSON.parse(readFileSync(file, "utf8"));
      if (!isRecord(parsed)) {
        results.push({
          file,
          changed: false,
          fixes: [],
          warnings: [],
          errors: ["Parse error: JSON root is not an object"],
        });
        continue;
      }
      json = parsed;
    } catch (e: unknown) {
      results.push({
        file,
        changed: false,
        fixes: [],
        warnings: [],
        errors: [`Parse error: ${getErrorMessage(e)}`],
      });
      continue;
    }

    const before = JSON.stringify(json);
    const res = fixRoom(json, file);
    const after = JSON.stringify(json, null, 2);

    if (res.changed && before !== after) {
      writeFileSync(file, after + "\n", "utf8");
      changed++;
    } else {
      res.changed = false;
    }

    // log only if something happened
    if (res.changed || res.warnings.length || res.errors.length) {
      console.log(`--- ${file}`);
      res.fixes.forEach((f) => console.log("  " + f));
      res.warnings.forEach((w) => console.log("  " + w));
      res.errors.forEach((e) => console.log("  " + e));
    }

    warns += res.warnings.length;
    errs += res.errors.length;
    results.push(res);
  }

  console.log(
    `\nDone! Processed: ${results.length} | Fixed: ${changed} | Warnings: ${warns} | Errors: ${errs}\n`
  );
}

main();
