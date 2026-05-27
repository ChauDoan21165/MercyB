/**
 * /support — anonymous support page render smoke.
 *
 * Public, fully static. The page renders contact channel cards
 * (Zalo / Messenger / email) and a FAQ section. App-store reviewers
 * frequently land here from the in-app "Contact support" link, so a
 * silent regression here is high-cost.
 */

import { test, expect } from "@playwright/test";
import { BASE_URL } from "./fixtures/env";
import { blockExternalServices } from "./fixtures/mocks";

test.describe("/support — anon", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalServices(page);
  });

  test("(1) hero header renders with the EN title + VI subtitle", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/support`);

    await expect(
      page.getByRole("heading", { name: "Support", level: 1 }),
    ).toBeVisible();
    // VI subtitle directly below the h1.
    await expect(page.getByText("Hỗ trợ", { exact: true })).toBeVisible();
  });

  test("(2) renders the 'Nhắn tin với Mercy' contact section + Chat with us peer line", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/support`);

    await expect(
      page.getByRole("heading", { name: "Nhắn tin với Mercy", level: 2 }),
    ).toBeVisible();
    await expect(page.getByText("Chat with us", { exact: true })).toBeVisible();
  });

  test("(3) contact card region exposes Zalo and Messenger affordances", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/support`);

    // The contact card grid is wrapped in a labelled section per the
    // page source ("Chat with us / Nhắn tin với Mercy"). The card
    // tiles render the channel names as their VI title; assert both
    // are present in the rendered text.
    const main = page.locator("body");
    await expect(main).toContainText("Zalo");
    await expect(main).toContainText("Facebook Messenger");
  });

  test("(4) does not require auth — anon load lands on /support directly", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/support`);
    await expect(page).toHaveURL(/\/support$/);
  });
});
