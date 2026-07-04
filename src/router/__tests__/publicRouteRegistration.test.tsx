// src/router/__tests__/publicRouteRegistration.test.tsx
//
// Lane E (E3) — route-table integrity for the canonical public, no-auth
// routes. Rather than render the whole <AppRouter /> (which would pull
// AuthProvider, ~200 lazy chunks, and Supabase), we statically read the
// AppRouter source and assert the expected public routes are registered
// AND wired to a component element. This is a config-shape assertion, not
// a full app render — see the brief's "assert on the route config object".
//
// Why source-string parsing: AppRouter builds its <Routes> tree inline with
// guards/redirects, so there is no exported route table object to import.
// Reading the source is the only non-render way to verify the wiring, and
// it stays green as long as the route lines keep their <Route path=.. element=..>
// shape.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, expect, it } from "vitest";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROUTER_SRC = readFileSync(path.resolve(here, "../AppRouter.tsx"), "utf8");

/**
 * Canonical public routes a logged-out visitor must be able to reach.
 * Each maps to the lazy component name the route element renders.
 */
const PUBLIC_ROUTES: ReadonlyArray<{ path: string; component: string }> = [
  { path: "/", component: "MarketingLandingPage" }, // anon entry (gated) → Home for signed-in
  { path: "/privacy", component: "Privacy" },
  { path: "/terms", component: "Terms" },
  { path: "/legal/privacy", component: "Privacy" },
  { path: "/legal/terms", component: "Terms" },
  { path: "/legal/content-advisory", component: "ContentAdvisory" },
  { path: "/support", component: "Support" },
  { path: "/pricing", component: "Pricing" },
  { path: "/rooms", component: "AllRooms" },
  { path: "/blog", component: "BlogIndex" },
  { path: "/signin", component: "LoginPage" },
  { path: "/signup", component: "LoginPage" },
  { path: "/onboarding", component: "OnboardingPage" },
];

/** Routes that are registered as redirects, not page renders. */
const REDIRECT_ROUTES: ReadonlyArray<string> = ["/login", "/upgrade", "/redeem"];

describe("AppRouter public route registration", () => {
  it("exports a default AppRouter component", () => {
    expect(ROUTER_SRC).toMatch(/export default function AppRouter/);
  });

  it("declares a <Routes> tree with a catch-all NotFound fallback", () => {
    expect(ROUTER_SRC).toMatch(/<Routes>/);
    // The 404 fallback component is defined locally.
    expect(ROUTER_SRC).toMatch(/function NotFound\(\)/);
  });

  PUBLIC_ROUTES.forEach(({ path: routePath, component }) => {
    it(`registers public route "${routePath}"`, () => {
      // The route path must appear as a <Route path="..."> literal.
      const pathRegex = new RegExp(`path=["']${routePath.replace(/\//g, "\\/")}["']`);
      expect(ROUTER_SRC).toMatch(pathRegex);
    });

    it(`route "${routePath}" is wired to <${component} />`, () => {
      // The component the route renders is imported lazily and referenced
      // in the JSX. Both must be present.
      const lazyDecl = new RegExp(`const\\s+${component}\\b`);
      const jsxUse = new RegExp(`<${component}\\s*/>`);
      expect(ROUTER_SRC).toMatch(lazyDecl);
      expect(ROUTER_SRC).toMatch(jsxUse);
    });
  });

  REDIRECT_ROUTES.forEach((routePath) => {
    it(`registers redirect route "${routePath}"`, () => {
      const pathRegex = new RegExp(`path=["']${routePath.replace(/\//g, "\\/")}["']`);
      expect(ROUTER_SRC).toMatch(pathRegex);
    });
  });

  it("lazy-loads page chunks via lazyWithRetry (stale-deploy recovery)", () => {
    expect(ROUTER_SRC).toMatch(/lazyWithRetry\(\(\)\s*=>\s*import\(/);
  });

  it("wraps the public shell so each page lazy-mounts under <Suspense>", () => {
    expect(ROUTER_SRC).toMatch(/<Suspense/);
    expect(ROUTER_SRC).toMatch(/AppHeroShell/);
  });

  it("keeps the root route as the public marketing landing", () => {
    expect(ROUTER_SRC).toMatch(/path="\/"/);
    expect(ROUTER_SRC).toMatch(/<MarketingLandingPage\s*\/>/);
    expect(ROUTER_SRC).toMatch(/Renders the painting-backed language selector for ALL visitors/);
  });
});
