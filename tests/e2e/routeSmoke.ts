import { expect, type Page, type APIResponse } from "@playwright/test";

export async function expectSpaResponse(
  page: Page,
  path: string,
): Promise<APIResponse | null> {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });

  expect(response, `${path} should return a document response`).not.toBeNull();
  expect(response?.status(), `${path} should not be a CDN/server 404`).toBe(200);
  await expect(page.locator("#root")).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/Page not found:\s/i);
  await expect(page.locator("body")).not.toContainText(/^404$/);

  return response;
}
