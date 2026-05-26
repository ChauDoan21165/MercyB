// scripts/move_root_junk_to_DEL.js
// Run from repo root: `node scripts/move_root_junk_to_DEL.js`

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const DEL_DIR = path.join(ROOT, "DEL");

// Files we ALWAYS keep in the root
const KEEP_FILES = new Set([
  // Core system files
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "tsconfig.app.json",
  "tsconfig.node.json",
  "components.json",
  "postcss.config.js",
  "vite.config.ts",
  ".gitignore",
  "README.md",
  ".env",

  // Documentation files (if present)
  "AI_DEVELOPMENT_PROMPT.md",
  "AI_EXECUTION_SEQUENCE.md",
  "COMPLETE_IMPLEMENTATION_GUIDE.md",
  "CONTENT_CREATION_GUIDE.md",
  "DESIGN_REPLICATION_PROMPT.md",
  "PAGE_BY_PAGE_PROMPTS.md",
  "ROOM_JSON_PROMPT.md",
  "STEP_BY_STEP_PROMPTS.md",
  "UI_SPECIFICATION_GUIDE.md",

  // Data file to keep
  "Dictionary.json"
]);

// Only these extensions in the ROOT will be moved if not in KEEP_FILES
const MOVE_EXTENSIONS = new Set([
  ".json",
  ".mp3",
  ".mp2",
  ".csv",
  ".bak",
  ".sql",
  ".tsx"
]);

console.log("📂 Repo root:", ROOT);

// Ensure DEL folder exists
if (!fs.existsSync(DEL_DIR)) {
  fs.mkdirSync(DEL_DIR);
  console.log("📁 Created DEL folder");
} else {
  console.log("📁 DEL folder already exists");
}

console.log();

const entries = fs.readdirSync(ROOT, { withFileTypes: true });

let movedCount = 0;
let skippedCount = 0;

for (const entry of entries) {
  const name = entry.name;

  // Skip directories – we only touch files in root
  if (entry.isDirectory()) {
    continue;
  }

  const fullPath = path.join(ROOT, name);

  // Skip hidden/system files except .gitignore (already whitelisted)
  if (name.startsWith(".") && !KEEP_FILES.has(name)) {
    skippedCount++;
    continue;
  }

  // Keep allow-listed core files
  if (KEEP_FILES.has(name)) {
    continue;
  }

  const ext = path.extname(name).toLowerCase();

  // Only move known "data" extensions
  if (MOVE_EXTENSIONS.has(ext)) {
    const destPath = path.join(DEL_DIR, name);

    try {
      fs.renameSync(fullPath, destPath);
      console.log(`➡️  Moved to DEL: ${name}`);
      movedCount++;
    } catch (err) {
      console.error(`❌ Failed to move ${name}: ${err.message}`);
      skippedCount++;
    }
  } else {
    // Unknown / suspicious type – leave it
    console.log(`🤔 Left in root (unknown type): ${name}`);
    skippedCount++;
  }
}

console.log();
console.log(`✅ Done. Files moved to DEL: ${movedCount}`);
console.log(`ℹ️  Files skipped/left in root: ${skippedCount}`);
