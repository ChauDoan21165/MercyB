// scripts/launch-audit.ts
// MERCY BLADE – FULL LAUNCH AUDIT (READ-ONLY)
//
// This script ONLY runs checks. It DOES NOT:
// - change UI
// - change JSON
// - touch Supabase data
//
// It calls your existing tools + reports status.
//
// Usage:
//   npx tsx scripts/launch-audit.ts
//
// Exit codes:
//   0 = OK for launch
//   1 = BLOCKED (critical)
//   2 = WARN (non-blocking issues)

import { spawnSync } from "node:child_process";

type AuditResult = {
  name: string;
  status: "ok" | "warn" | "error";
  details?: string;
};

function runCmd(label: string, cmd: string, args: string[] = []): AuditResult {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`▶ ${label}`);
  console.log(`   $ ${cmd} ${args.join(" ")}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  const res = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });

  if (res.status === 0) {
    return { name: label, status: "ok" };
  }

  // Non-zero but we don't know if critical or minor → mark as error and let you decide.
  return {
    name: label,
    status: "error",
    details: `Command failed with status ${res.status ?? "unknown"}`
  };
}

async function main() {
  const results: AuditResult[] = [];

  // 1) ROOM REGISTRY / JSON VALIDATION
  //  - validate-rooms-ci: schema + JSON sanity
  //  - generate-room-registry: registry sync (read-only build)
  results.push(
    runCmd("1. Room JSON + Schema Validation", "node", ["scripts/validate-rooms-ci.js"]),
  );
  results.push(
    runCmd("1b. Regenerate Room Registry (dry build)", "node", ["scripts/generate-room-registry.js"]),
  );

  // 2) AUDIO HEALTH CHECK
  //  - verifies missing audio, mismatched filenames, etc.
  results.push(
    runCmd("2. Audio Health Check", "node", ["scripts/check-audio-health.js"]),
  );

  // 3) ROOM LINK + TIER ROUTE CHECK
  //  - broken links, orphan files, naming mismatches
  results.push(
    runCmd("3. Room Link & Route Validation", "node", ["scripts/validate-room-links.js"]),
  );

  // 4) SUPABASE TIER & ROOM CONSISTENCY
  //  - DB tiers match canonical labels, domains, tracks
  results.push(
    runCmd("4. DB Tier Audit", "npx", ["tsx", "scripts/audit-db-tiers.ts"]),
  );

  // 5) KEYWORD → ENTRY MAPPING SANITY
  //  - simulate keyword resolution for all rooms (no UI)
  results.push(
    runCmd("5. Keyword Mapping Audit", "npx", ["tsx", "scripts/audit-keyword-mapping.ts"]),
  );

  // 6) BEHAVIOR / PROGRESS / POINTS SYSTEM
  results.push(
    runCmd("6. Behavior Tracking Audit", "npx", ["tsx", "scripts/audit-behavior-system.ts"]),
  );

  // 7) CHATHUB STABILITY CHECK
  //  - ensures no crash on room load, keyword click, audio play
  results.push(
    runCmd("7. ChatHub Stability Smoke Test", "npx", ["tsx", "scripts/audit-chathub-smoke.ts"]),
  );

  // 8) PERFORMANCE / MEMORY QUICK CHECK
  //  - uses your existing Launch Simulator / Real Device Simulator in "short" mode
  results.push(
    runCmd("8. Launch Simulator – Short Suite", "npx", ["tsx", "scripts/run-launch-simulator.ts", "--preset", "short"]),
  );

  // 9) UI HEALTH CHECK (NO UI CHANGES)
  //  - only runs your existing DeepScan / RoomMaster validators
  results.push(
    runCmd("9. UI Health DeepScan", "npx", ["tsx", "scripts/run-deepscan-ui.ts"]),
  );

  // 10) ROUTE COMPLETENESS
  //  - smoke tests /, /tier-map, /free, /vip1..vip9, /vip3ii, /kids, /room-map, /admin/*
  results.push(
    runCmd("10. Route Completeness Audit", "npx", ["tsx", "scripts/audit-routes.ts"]),
  );

  // ─────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────

  console.log(`\n\n==================================================`);
  console.log(`MERCY BLADE – FULL LAUNCH AUDIT SUMMARY`);
  console.log(`==================================================\n`);

  let hasError = false;
  let hasWarn = false;

  for (const r of results) {
    const mark = r.status === "ok" ? "✅"
      : r.status === "warn" ? "⚠️"
      : "❌";
    console.log(`${mark} ${r.name}${r.details ? ` — ${r.details}` : ""}`);

    if (r.status === "error") hasError = true;
    if (r.status === "warn") hasWarn = true;
  }

  console.log(`\nLegend: ✅ OK   ⚠️ Non-blocking issue   ❌ Launch-blocking\n`);

  if (hasError) {
    console.log(`❌ LAUNCH STATUS: BLOCKED (fix the ❌ checks above)`);
    process.exit(1);
  }

  if (hasWarn) {
    console.log(`⚠️ LAUNCH STATUS: WARN (non-blocking issues remain)`);
    process.exit(2);
  }

  console.log(`✅ LAUNCH STATUS: READY (all checks passed)`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Unexpected error in launch-audit:", err);
  process.exit(1);
});
