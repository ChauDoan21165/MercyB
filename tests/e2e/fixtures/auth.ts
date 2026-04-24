/**
 * Sign-in / sign-up helpers that drive the real UI, not Supabase directly.
 *
 * We go through the UI so the smoke tests catch regressions in the login
 * form, redirect logic, cookie/localStorage plumbing, and auth provider
 * wiring — if the DB is fine but the login page breaks, we want a red
 * light.
 *
 * Each helper assumes the page is already at the base URL (or anywhere).
 * Navigation back to "/" after sign-in is the caller's responsibility.
 */

import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

import { BASE_URL } from "./env";

/**
 * Fills out the sign-up form and submits. Waits for the post-signup
 * redirect (placement welcome or home, depending on flag state).
 */
export async function signUpThroughUi(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.goto(`${BASE_URL}/signup`);
  // Selectors intentionally broad — the form markup has evolved several
  // times. If these break, that's a bug worth surfacing.
  await page
    .locator('input[type="email"], input[name="email"]')
    .first()
    .fill(email);
  await page
    .locator('input[type="password"], input[name="password"]')
    .first()
    .fill(password);
  await Promise.all([
    page.waitForURL((url) => !url.pathname.startsWith("/signup"), {
      timeout: 15_000,
    }),
    page
      .locator('button[type="submit"]:has-text(/sign ?up|đăng ?ký/i)')
      .first()
      .click(),
  ]);
}

/**
 * Sign-in via the UI. Returns when the navigation away from /signin has
 * completed.
 */
export async function signInThroughUi(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.goto(`${BASE_URL}/signin`);
  await page
    .locator('input[type="email"], input[name="email"]')
    .first()
    .fill(email);
  await page
    .locator('input[type="password"], input[name="password"]')
    .first()
    .fill(password);
  await Promise.all([
    page.waitForURL((url) => !url.pathname.startsWith("/signin"), {
      timeout: 15_000,
    }),
    page
      .locator('button[type="submit"]:has-text(/sign ?in|log ?in|đăng ?nhập/i)')
      .first()
      .click(),
  ]);
}

/**
 * Sign out via the account menu. Best-effort; doesn't fail the test if
 * the button is hidden or missing (some pages clear session on their
 * own).
 */
export async function signOutThroughUi(page: Page): Promise<void> {
  try {
    await page.goto(`${BASE_URL}/account`);
    await page
      .locator('button:has-text(/sign ?out|đăng ?xuất/i)')
      .first()
      .click({ timeout: 3_000 });
    await expect(page).toHaveURL(/\/(signin|$|$\?)/, { timeout: 10_000 });
  } catch {
    // Swallow — if the page is already signed out, we're done.
  }
}
