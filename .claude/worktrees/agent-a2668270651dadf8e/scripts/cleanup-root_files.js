// scripts/cleanup-root_files.js
// Deletes unwanted data files from the REPO ROOT only.
// Safe: keeps all core system + docs + Dictionary.json

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// Files that must NEVER be deleted (root-level only)
const KEEP_FILES = new Set([
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

  "AI_DEVELOPMENT_PROMPT.md",
  "AI_EXECUTION_SEQUENCE.md",
  "COMPLETE_IMPLEMENTATION_GUIDE.md",
  "CONTENT_CREATION_GUIDE.md",
  "DESIGN_REPLICATION_PROMPT.md",
  "PAGE_BY_PAGE_PROMPTS.md",
  "ROOM_JSON_PROMPT.md",
  "STEP_BY_STEP_PROMPTS.md",
  "UI_SPECIFICATION_GUIDE.md",

  "Dictionary.json"
]);

// Extensions we want to delete in ROOT (but NOT in subfolders)
const DELETE_EXTS = new Set([
  ".json",
  ".mp3",
  ".sql",
  ".csv",
  ".bak",
  ".tsx"
]);

function main() {
  console.log("🧹 Cleaning root-level data files in MercyB...\n");
  console.log(`Repo root: ${ROOT}\n`);

  const entries = fs.readdirSync(ROOT, { withFileTypes: true });

  let deletedCount = 0;
  let keptCount = 0;

  for (const entry of entries) {
    if (!entry.isFile()) continue; // only files in root

    const name = entry.name;
    const ext = path.extname(name).toLowerCase();
    const fullPath = path.join(ROOT, name);

    if (KEEP_FILES.has(name)) {
      keptCount++;
      continue;
    }

    if (DELETE_EXTS.has(ext)) {
      fs.unlinkSync(fullPath); // ❌ direct delete, no backup
      console.log(`🗑️  Deleted: ${name}`);
      deletedCount++;
    } else {
      keptCount++;
    }
  }

  console.log("\n📊 Summary");
  console.log(`  🗑️  Files deleted: ${deletedCount}`);
  console.log(`  ✅ Files kept   : ${keptCount}`);
}

main();
