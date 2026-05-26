// FILE: scripts/preflight.ts
// VERSION: MB-BLUE-101.12b — 2026-01-12 (+0700)
// PURPOSE: Hard fail early if core assumptions are broken

import fs from "fs";

function mustExist(path: string) {
  if (!fs.existsSync(path)) {
    console.error(`[PRECHECK FAIL] Missing: ${path}`);
    process.exit(1);
  }
}

mustExist("src/components/room/RoomRenderer.tsx");
mustExist("package.json");

console.log("[PRECHECK OK] Core files present");
