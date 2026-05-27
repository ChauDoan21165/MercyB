import { test, expect } from '@playwright/test';

// DEPRECATED — proposed for deletion in Phase 2 of the legacy `e2e/` migration.
//
// Two reasons this spec is no longer load-bearing:
//
//   1. Heavy reliance on dead routes that no longer match any Route element:
//        - `/subscribe` (the spec asserts URL changes to `/subscribe` after clicking a tier
//                        card; the live app routes `/pricing` and `/upgrade` instead — see
//                        src/router/AppRouter.tsx:811-812 and the `/pricing` smoke spec in
//                        tests/e2e/pricing-anon.spec.ts)
//        - `/vip1`      (pre-tier-rename; CLAUDE.md non-negotiable #5 — "no VIP tier")
//
//   2. The remaining live-route portion is now covered by smaller, more focused smoke specs:
//        - `/tiers` chrome + Upgrade CTA   → tests/e2e/tier-map-anon.spec.ts (P2, !47)
//        - `/`      MarketingLandingPage   → tests/e2e/marketing-landing-anon.spec.ts (P0, !36)
//        - `/rooms` index render           → legacy e2e/room-loading.spec.ts (kept; no smoke
//                                            analogue yet)
//
// Verified 2026-05-27 against `src/router/AppRouter.tsx` — `/subscribe` and `/vip1` have
// zero matching routes; the visible-text `"Mercy Blade"` assertion is also brittle (the
// current brand spelling on the marketing landing is `MercyBlade` with no space).
//
// See `docs/testing/playwright-config-audit.md` Phase 1 for the deletion plan + open
// questions resolved. This file is NOT removed in the current MR; the marker exists so a
// follow-up PR can drop it cleanly.

/**
 * E2E tests for complete user journey
 * Tests the flow: Homepage → Tiers → Payment → Rooms
 */

test.describe('Complete User Journey', () => {
  test('should navigate from Homepage to Tiers page', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    
    // Wait for page to load
    await expect(page.locator('text=Mercy Blade')).toBeVisible({ timeout: 10000 });
    
    // Find and click the "Explore Tiers" button in footer
    const exploreTiersButton = page.locator('button:has-text("Explore Tiers"), a:has-text("Explore Tiers")').last();
    await expect(exploreTiersButton).toBeVisible();
    await exploreTiersButton.click();
    
    // Verify navigation to /tiers
    await expect(page).toHaveURL(/.*\/tiers/);
    await expect(page.locator('text=Mercy Blade')).toBeVisible();
  });

  test('should display all tier sections on Tiers page', async ({ page }) => {
    await page.goto('/tiers');
    
    // Wait for page to load
    await expect(page.locator('text=Mercy Blade')).toBeVisible({ timeout: 10000 });
    
    // Check for tier sections (looking for price indicators)
    await expect(page.locator('text=/\\$\\d+/')).toBeVisible({ timeout: 5000 });
  });

  test('should navigate from Tiers to Subscribe page', async ({ page }) => {
    await page.goto('/tiers');
    
    // Wait for page to load
    await expect(page.locator('text=Mercy Blade')).toBeVisible({ timeout: 10000 });
    
    // Scroll to bottom to find "Sign Up Now" button
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Find and click "Sign Up Now" button
    const signUpButton = page.locator('button:has-text("Sign Up Now")');
    await expect(signUpButton).toBeVisible({ timeout: 5000 });
    await signUpButton.click();
    
    // Verify navigation to /subscribe
    await expect(page).toHaveURL(/.*\/subscribe/);
  });

  test('should display tier options on Subscribe page', async ({ page }) => {
    await page.goto('/subscribe');
    
    // Wait for page to load
    await expect(page.locator('text=Mercy Blade')).toBeVisible({ timeout: 10000 });
    
    // Check for VIP tier cards
    await expect(page.locator('text=/VIP\\s*\\d/i')).toBeVisible({ timeout: 5000 });
  });

  test('should have back navigation throughout the journey', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    await expect(page.locator('text=Mercy Blade')).toBeVisible({ timeout: 10000 });
    
    // Go to tiers
    await page.goto('/tiers');
    await expect(page.locator('text=Mercy Blade')).toBeVisible({ timeout: 10000 });
    
    // Check for back button
    const backButton = page.locator('button:has-text("Back"), a:has-text("Back")').first();
    await expect(backButton).toBeVisible();
    
    // Click back button
    await backButton.click();
    
    // Should be back at homepage
    await expect(page).toHaveURL(/^\/$|^\/$/);
  });

  test('should navigate to room grid pages from homepage', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await expect(page.locator('text=Mercy Blade')).toBeVisible({ timeout: 10000 });
    
    // Try to find a link to rooms (looking for "rooms" or "chat" in URL)
    await page.goto('/rooms');
    
    // Check if we're on a room selection page
    await expect(page.locator('text=Mercy Blade')).toBeVisible({ timeout: 10000 });
  });

  test('should handle complete flow from start to payment selection', async ({ page }) => {
    // Step 1: Homepage
    await page.goto('/');
    await expect(page.locator('text=Mercy Blade')).toBeVisible({ timeout: 10000 });
    
    // Step 2: Navigate to Tiers
    const tierButton = page.locator('button:has-text("Explore Tiers"), a:has-text("Explore Tiers")').last();
    if (await tierButton.isVisible()) {
      await tierButton.click();
      await expect(page).toHaveURL(/.*\/tiers/);
    } else {
      await page.goto('/tiers');
    }
    
    // Step 3: From Tiers to Subscribe
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const signUpButton = page.locator('button:has-text("Sign Up Now")');
    await expect(signUpButton).toBeVisible({ timeout: 5000 });
    await signUpButton.click();
    
    // Step 4: Verify we're on subscribe page with tier options
    await expect(page).toHaveURL(/.*\/subscribe/);
    await expect(page.locator('text=Mercy Blade')).toBeVisible();
    
    // Verify tier selection cards are present
    const tierCards = page.locator('[class*="card"], [class*="Card"]');
    await expect(tierCards.first()).toBeVisible({ timeout: 5000 });
  });

  test('should maintain consistent branding throughout journey', async ({ page }) => {
    const pages = ['/', '/tiers', '/subscribe'];
    
    for (const url of pages) {
      await page.goto(url);
      
      // Check for Mercy Blade branding
      await expect(page.locator('text=Mercy Blade')).toBeVisible({ timeout: 10000 });
      
      // Check for colorful theme
      const header = page.locator('text=Mercy Blade').first();
      await expect(header).toBeVisible();
    }
  });
});

test.describe('User Journey - Authenticated Flow', () => {
  test('should redirect to auth if trying to access VIP rooms without login', async ({ page }) => {
    // Try to access a VIP room directly
    await page.goto('/vip1');
    
    // Should redirect to home or auth
    await page.waitForURL(/.*\/(|auth)$/);
  });

  test('should show free rooms without authentication', async ({ page }) => {
    await page.goto('/rooms');
    
    // Should be able to see the rooms page
    await expect(page.locator('text=Mercy Blade')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('User Journey - Performance', () => {
  test('should load all journey pages within acceptable time', async ({ page }) => {
    const urls = ['/', '/tiers', '/subscribe'];
    
    for (const url of urls) {
      const startTime = Date.now();
      await page.goto(url);
      await expect(page.locator('text=Mercy Blade')).toBeVisible({ timeout: 10000 });
      const loadTime = Date.now() - startTime;
      
      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    }
  });

  test('should handle rapid navigation without errors', async ({ page }) => {
    // Rapidly navigate between pages
    await page.goto('/');
    await page.goto('/tiers');
    await page.goto('/subscribe');
    await page.goto('/');
    
    // Final page should load successfully
    await expect(page.locator('text=Mercy Blade')).toBeVisible({ timeout: 10000 });
    
    // Check console for errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Should have no critical errors
    expect(errors.length).toBe(0);
  });
});
