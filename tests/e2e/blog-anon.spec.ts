/**
 * /blog — anonymous index render smoke.
 *
 * Anon-only. The blog index is fully static — `getAllPosts()` reads
 * from `src/lib/blog/blogManifest`, no Supabase, no network. So the
 * spec can assert the hero copy and the presence of post cards
 * without any backend coordination.
 *
 * Why two languages tested: the hero deliberately renders VI as the
 * primary tagline and EN as a secondary line below it. A regression
 * to either side would silently shift the brand voice — we want it
 * to fail loudly here.
 */

import { test, expect } from "@playwright/test";
import { BASE_URL } from "./fixtures/env";
import { blockExternalServices } from "./fixtures/mocks";

test.describe("/blog — anon", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalServices(page);
  });

  test("(1) hero header renders with the VI + EN tagline pair", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/blog`);

    await expect(
      page.getByRole("heading", { name: "Blog MercyBlade", level: 1 }),
    ).toBeVisible();
    // VI subtitle — the primary tagline.
    await expect(
      page.getByText(
        "Câu chuyện, mẹo học, và sự thật về tiếng Anh cho người Việt",
        { exact: true },
      ),
    ).toBeVisible();
    // EN sibling subtitle.
    await expect(
      page.getByText(
        "Stories, learning tips, and truths about English for Vietnamese speakers",
        { exact: true },
      ),
    ).toBeVisible();
  });

  test("(2) renders at least one post card linking to /blog/:slug", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/blog`);

    // Cards are rendered as <Link to="/blog/:slug"> — assert at
    // least one is present and points at the blog-slug shape. The
    // exact count depends on the manifest at HEAD, which is volatile;
    // "at least one" is the stable contract.
    const blogPostLinks = page.locator('a[href^="/blog/"]');
    await expect(blogPostLinks.first()).toBeVisible();
    expect(await blogPostLinks.count()).toBeGreaterThan(0);
  });

  test("(3) does not require auth — no signin redirect on load", async ({
    page,
  }) => {
    // Anon viewers must land on /blog directly, not get bounced to
    // /signin / /onboarding. The cheapest proof is asserting the URL
    // didn't change after navigation settles.
    await page.goto(`${BASE_URL}/blog`);
    await expect(page).toHaveURL(/\/blog\b/);
  });
});
