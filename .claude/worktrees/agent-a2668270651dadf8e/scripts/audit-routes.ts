// scripts/audit-routes.ts
// MERCY BLADE – Route Completeness Audit (READ-ONLY)
//
// Validates that all expected routes are defined in App.tsx
// and that route patterns are consistent.
//
// Usage: npx tsx scripts/audit-routes.ts

import * as fs from "node:fs";
import * as path from "node:path";

const APP_FILE = path.join(process.cwd(), "src", "App.tsx");

// Expected routes that should exist
const EXPECTED_ROUTES = [
  // Public routes
  "/",
  "/home",
  "/onboarding",
  "/tiers",
  "/welcome",
  "/auth",
  "/reset",
  
  // Room routes
  "/rooms",
  "/room/:roomId",
  "/all-rooms",
  "/english-pathway",
  
  // VIP routes (both patterns)
  "/rooms-vip1",
  "/rooms-vip2",
  "/rooms-vip3",
  "/rooms-vip3",
  "/rooms-vip4",
  "/rooms-vip5",
  "/rooms-vip6",
  "/rooms-vip9",
  "/vip/vip1",
  "/vip/vip2",
  "/vip/vip3",
  "/vip/vip3",
  "/vip/vip4",
  "/vip/vip5",
  "/vip/vip6",
  "/vip/vip9",
  
  // Kids routes
  "/kids-level1",
  "/kids-level2",
  "/kids-level3",
  "/kids-chat/:roomId",
  
  // Paths routes
  "/paths/:slug",
  "/paths/:slug/day/:day",
  "/paths/:slug/completed",
  
  // Admin routes
  "/admin",
  "/admin/rooms",
  "/admin/users",
  "/admin/payments",
  "/admin/room-health",
  "/admin/stats",
];

interface RouteCheck {
  route: string;
  found: boolean;
}

function auditRoutes(): void {
  console.log("🔍 ROUTE COMPLETENESS AUDIT");
  console.log("===========================\n");

  if (!fs.existsSync(APP_FILE)) {
    console.log("❌ App.tsx not found at:", APP_FILE);
    process.exit(1);
  }

  const content = fs.readFileSync(APP_FILE, "utf-8");
  const results: RouteCheck[] = [];

  console.log(`Checking ${EXPECTED_ROUTES.length} expected routes...\n`);

  for (const route of EXPECTED_ROUTES) {
    // Escape special regex characters and convert :param to pattern
    const pattern = route
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/:\w+/g, "[^\"]+");
    
    const regex = new RegExp(`path=["']${pattern}["']`);
    const found = regex.test(content);
    
    results.push({ route, found });
  }

  // Report
  console.log("📊 ROUTE CHECK RESULTS");
  console.log("======================\n");

  const found = results.filter(r => r.found);
  const missing = results.filter(r => !r.found);

  console.log(`✅ Found:   ${found.length}`);
  console.log(`❌ Missing: ${missing.length}`);

  if (missing.length > 0) {
    console.log("\n❌ MISSING ROUTES:");
    for (const result of missing) {
      console.log(`   - ${result.route}`);
    }
  }

  // Additional checks
  console.log("\n📋 ADDITIONAL CHECKS");
  console.log("--------------------\n");

  // Check for AdminRoute wrapper on admin routes
  const adminRoutePattern = /<AdminRoute>/g;
  const adminRouteMatches = content.match(adminRoutePattern);
  const adminRouteCount = adminRouteMatches ? adminRouteMatches.length : 0;
  console.log(`🔒 AdminRoute wrappers found: ${adminRouteCount}`);

  // Check for lazy loading
  const lazyPattern = /lazy\(\(\) => import\(/g;
  const lazyMatches = content.match(lazyPattern);
  const lazyCount = lazyMatches ? lazyMatches.length : 0;
  console.log(`⚡ Lazy-loaded components: ${lazyCount}`);

  // Check for Suspense
  const hasSuspense = content.includes("<Suspense");
  console.log(`🔄 Suspense wrapper: ${hasSuspense ? "✅" : "❌"}`);

  console.log("");

  if (missing.length > 0) {
    console.log(`⚠️ ${missing.length} expected route(s) not found.\n`);
    // Routes missing is a warning, not a blocker
    process.exit(0);
  }

  console.log("✅ All expected routes are defined.\n");
  process.exit(0);
}

auditRoutes();
