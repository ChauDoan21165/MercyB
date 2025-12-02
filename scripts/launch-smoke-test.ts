#!/usr/bin/env npx tsx
/**
 * Mercy Blade Launch Smoke Test
 * 
 * Usage:
 *   npx tsx scripts/launch-smoke-test.ts http://localhost:5173
 *   BASE_URL=https://preview--mercy-blade.lovable.app npx tsx scripts/launch-smoke-test.ts
 *   npx tsx scripts/launch-smoke-test.ts --help
 */

type RouteCheck = {
  path: string;
  label: string;
  mustContain?: string[];
};

const ROUTES: RouteCheck[] = [
  { path: "/", label: "Home", mustContain: ["Mercy Blade", "Tier"] },
  { path: "/tier-map", label: "Tier Map" },
  { path: "/rooms", label: "Free Rooms" },
  { path: "/vip/vip1", label: "VIP1 Grid" },
  { path: "/vip/vip2", label: "VIP2 Grid" },
  { path: "/vip/vip3", label: "VIP3 Grid" },
  { path: "/vip/vip3ii", label: "VIP3 II Grid" },
  { path: "/vip/vip4", label: "VIP4 Grid" },
  { path: "/vip/vip5", label: "VIP5 Grid" },
  { path: "/vip/vip6", label: "VIP6 Grid" },
  { path: "/vip/vip9", label: "VIP9 Grid" },
  { path: "/kids-level1", label: "Kids Level 1" },
  { path: "/kids-level2", label: "Kids Level 2" },
  { path: "/kids-level3", label: "Kids Level 3" },
  { path: "/admin", label: "Admin Dashboard" },
  { path: "/admin/rooms", label: "Admin Rooms" },
  { path: "/admin/content-quality", label: "Admin Content Quality" },
  { path: "/admin/stats", label: "Admin Stats" },
  { path: "/room/english_foundation_ef01", label: "Room: EF01" },
  { path: "/room/english_foundation_ef06", label: "Room: EF06" },
];

async function checkRoute(
  baseUrl: string,
  route: RouteCheck
): Promise<{ ok: boolean; warning?: boolean; details: string[] }> {
  const url = new URL(route.path, baseUrl).toString();
  const details: string[] = [];

  try {
    const res = await fetch(url, { redirect: "follow" });
    const status = res.status;
    const text = await res.text();

    details.push(`HTTP ${status} for ${url}`);

    if (status >= 500) {
      details.push("❌ Server error (>=500)");
      return { ok: false, details };
    }

    if (
      text.includes("Something went wrong") ||
      text.includes("Đã xảy ra lỗi không mong muốn")
    ) {
      details.push("❌ React error boundary triggered");
      return { ok: false, details };
    }

    if (status === 401 || status === 403) {
      details.push("⚠ Auth-protected route (401/403) – treated as warning");
      return { ok: true, warning: true, details };
    }

    if (status === 404) {
      details.push("⚠ Route returned 404 – page not found");
      return { ok: true, warning: true, details };
    }

    if (route.mustContain && route.mustContain.length > 0) {
      for (const marker of route.mustContain) {
        if (!text.includes(marker)) {
          details.push(`⚠ Missing expected text: "${marker}"`);
        }
      }
    }

    return { ok: true, details };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    details.push(`❌ Network/Fetch error: ${message}`);
    return { ok: false, details };
  }
}

function printHelp() {
  console.log(`
🚀 Mercy Blade Launch Smoke Test

Usage:
  npx tsx scripts/launch-smoke-test.ts [BASE_URL]
  BASE_URL=<url> npx tsx scripts/launch-smoke-test.ts

Options:
  --help    Show this help message

Examples:
  npx tsx scripts/launch-smoke-test.ts http://localhost:5173
  npx tsx scripts/launch-smoke-test.ts https://preview--mercy-blade.lovable.app
  BASE_URL=http://localhost:8080 npx tsx scripts/launch-smoke-test.ts

Default BASE_URL: http://localhost:5173
`);
}

async function main() {
  // Handle --help
  if (process.argv.includes("--help")) {
    printHelp();
    process.exit(0);
  }

  // Resolve base URL
  const baseUrl =
    process.argv[2] || process.env.BASE_URL || "http://localhost:5173";

  console.log(`
🚀 Mercy Blade Launch Smoke Test
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Base URL: ${baseUrl}
Routes to check: ${ROUTES.length}
`);

  if (baseUrl.includes("localhost")) {
    console.log(
      "💡 Tip: Make sure dev server is running (npm run dev) before this test.\n"
    );
  }

  let criticalFailures = 0;
  let warnings = 0;

  for (const route of ROUTES) {
    const result = await checkRoute(baseUrl, route);

    if (!result.ok) {
      criticalFailures++;
      console.log(`❌ ${route.label} (${route.path})`);
    } else if (result.warning) {
      warnings++;
      console.log(`⚠️  ${route.label} (${route.path})`);
    } else {
      console.log(`✅ ${route.label} (${route.path})`);
    }

    for (const detail of result.details) {
      console.log(`   ${detail}`);
    }
    console.log("");
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Smoke Test Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Critical failures: ${criticalFailures}
Warnings: ${warnings}
Total routes: ${ROUTES.length}
`);

  if (criticalFailures > 0) {
    console.log("🚫 LAUNCH BLOCKED – Critical failures detected!\n");
    process.exit(1);
  } else if (warnings > 0) {
    console.log("⚠️  LAUNCHABLE WITH RISKS – Review warnings above.\n");
    process.exit(0);
  } else {
    console.log("🎉 ALL CLEAR – Ready to launch!\n");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Fatal error running smoke test:", err);
  process.exit(1);
});
