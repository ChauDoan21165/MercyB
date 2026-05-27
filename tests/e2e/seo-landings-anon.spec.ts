/**
 * /seo/* — anonymous SEO landing render smoke (parametrised).
 *
 * Anon-only. The five SEO landings all share `SeoLayout` (single
 * H1 + Vietnamese subheader + one UTM-tagged sign-up CTA, no app
 * chrome). They are static — no Supabase, no network — so the spec
 * iterates the 5 known routes and asserts:
 *   1. The shared layout testid mounts.
 *   2. The H1 matches the page-specific copy.
 *   3. The primary CTA links to /signin with the page's UTM campaign.
 *
 * This is the cheapest way to cover the SEO surface without
 * duplicating the same test five times. A future SEO landing only
 * needs a new entry in the `LANDINGS` table.
 */

import { test, expect } from "@playwright/test";
import { BASE_URL } from "./fixtures/env";
import { blockExternalServices } from "./fixtures/mocks";

type Landing = {
  /** URL path under /seo/. */
  path: string;
  /** Exact H1 text rendered by SeoLayout. */
  h1: string;
  /** The `utmCampaign` slug passed to SeoLayout — appears on the
   *  CTA href as `&utm_campaign=<slug>`. */
  utmCampaign: string;
};

const LANDINGS: readonly Landing[] = [
  {
    path: "/seo/hoc-tieng-anh-cho-nguoi-viet",
    h1: "Học tiếng Anh cho người Việt",
    utmCampaign: "hoc-tieng-anh-cho-nguoi-viet",
  },
  {
    path: "/seo/sua-phat-am-tieng-anh",
    h1: "Sửa phát âm tiếng Anh",
    utmCampaign: "sua-phat-am-tieng-anh",
  },
  {
    path: "/seo/loi-tieng-anh-nguoi-viet-hay-sai",
    h1: "Lỗi tiếng Anh người Việt hay sai",
    utmCampaign: "loi-tieng-anh-nguoi-viet-hay-sai",
  },
  {
    path: "/seo/phong-van-tieng-anh",
    h1: "Chuẩn bị phỏng vấn tiếng Anh",
    utmCampaign: "phong-van-tieng-anh",
  },
  {
    path: "/seo/hoc-tieng-anh-mien-phi",
    h1: "Học tiếng Anh miễn phí 7 ngày",
    utmCampaign: "hoc-tieng-anh-mien-phi",
  },
] as const;

test.describe("/seo/* — anon (parametrised)", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalServices(page);
  });

  for (const landing of LANDINGS) {
    test(`${landing.path} — SeoLayout mounts + H1 + UTM-tagged CTA`, async ({
      page,
    }) => {
      await page.goto(`${BASE_URL}${landing.path}`);

      // Layout testid is the cheapest proof that SeoLayout mounted
      // and the `data-utm-campaign` attribute is wired to this page.
      const layout = page.getByTestId("seo-layout");
      await expect(layout).toBeVisible();
      await expect(layout).toHaveAttribute(
        "data-utm-campaign",
        landing.utmCampaign,
      );

      // The page-specific H1 is the headline-keyword phrase.
      await expect(
        page.getByRole("heading", { name: landing.h1, level: 1 }),
      ).toBeVisible();

      // The primary CTA points at /signin with `next=/` and a
      // `utm_campaign` matching the page's slug. SeoLayout encodes the
      // `next` param, so the literal href contains `next=%2F` —
      // assert the substring rather than the full string so tiny
      // future tweaks (e.g. `&utm_term=…`) don't break the spec.
      const cta = page.getByTestId("seo-cta-primary");
      await expect(cta).toBeVisible();
      const href = await cta.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href).toContain("/signin?");
      expect(href).toContain("utm_source=seo");
      expect(href).toContain(
        `utm_campaign=${encodeURIComponent(landing.utmCampaign)}`,
      );
    });
  }
});
