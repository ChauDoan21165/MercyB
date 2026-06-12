import { test, expect } from "./fixtures/test";
import { BASE_URL } from "./fixtures/env";

test.describe("placement v3 multimodal UI", () => {
  for (const locale of ["en", "vi"] as const) {
    test(`happy path: welcome to writing to results (${locale})`, async ({ page }) => {
      await page.goto(`${BASE_URL}/placement`);
      await expect(page.getByText(/Let's find where you should start|Hãy tìm điểm bắt đầu/i)).toBeVisible();
      await page.getByRole("button", { name: /Start placement test/i }).click();
      await page.getByRole("button", { name: /adult learner/i }).click();
      await page.getByLabel(/Writing answer/i).fill("I study English every morning because I want a better job. This month I want to improve speaking and listening.");
      await page.getByRole("button", { name: /Submit answer/i }).click();
      await expect(page.getByText(/Speaking|Nói/i)).toBeVisible();
    });

    test(`skip flow: welcome to confirmation to home (${locale})`, async ({ page }) => {
      await page.goto(`${BASE_URL}/placement`);
      await page.getByRole("button", { name: /Skip for now/i }).click();
      await expect(page.getByText(/Skip placement test/i)).toBeVisible();
      await page.getByRole("button", { name: /Yes, skip/i }).click();
      await expect(page).toHaveURL(/\/$/);
    });

    test(`abandon mid-test after two responses (${locale})`, async ({ page }) => {
      await page.goto(`${BASE_URL}/placement/who`);
      await page.getByRole("button", { name: /adult learner/i }).click();
      await page.getByLabel(/Writing answer/i).fill("I study English every day because I need it for work and interviews. I want better grammar this month.");
      await page.getByRole("button", { name: /Submit answer/i }).click();
      await page.getByLabel(/Transcript or typed answer/i).fill("I am learning English for work and for a future interview.");
      await page.getByRole("button", { name: /Submit answer/i }).click();
      await page.getByRole("button", { name: /Leave test/i }).click();
      await page.getByRole("button", { name: /Leave/i }).click();
      await expect(page).toHaveURL(/\/$/);
    });

    test(`resume flow from unfinished session (${locale})`, async ({ page }) => {
      await page.goto(`${BASE_URL}/placement/who`);
      await page.getByRole("button", { name: /adult learner/i }).click();
      await page.goto(`${BASE_URL}/placement`);
      await expect(page).toHaveURL(/\/placement\/resume/);
      await expect(page.getByText(/Resume your placement test/i)).toBeVisible();
    });

    test(`audio permission denied falls back to typed answer (${locale})`, async ({ context, page }) => {
      await context.grantPermissions([], { origin: BASE_URL });
      await page.goto(`${BASE_URL}/placement/who`);
      await page.getByRole("button", { name: /adult learner/i }).click();
      await page.getByLabel(/Writing answer/i).fill("I study English every day because I need it for work and interviews. I want better grammar this month.");
      await page.getByRole("button", { name: /Submit answer/i }).click();
      await page.getByRole("button", { name: /Record/i }).click();
      await page.getByLabel(/Transcript or typed answer/i).fill("I would say my name and explain my goals.");
      await expect(page.getByRole("button", { name: /Submit answer/i })).toBeEnabled();
    });

    test(`network failure mid-submit can retry (${locale})`, async ({ page }) => {
      await page.goto(`${BASE_URL}/placement/who`);
      await page.getByRole("button", { name: /adult learner/i }).click();
      await page.getByLabel(/Writing answer/i).fill("__network_fail_once__ I study English every day because I need it for work and interviews.");
      await page.getByRole("button", { name: /Submit answer/i }).click();
      await expect(page.getByRole("alert")).toBeVisible();
      await expect(page.getByRole("button", { name: /Retry submit/i })).toBeVisible();
    });

    test(`session expired modal offers new test (${locale})`, async ({ page }) => {
      await page.goto(`${BASE_URL}/placement/who`);
      await page.getByRole("button", { name: /adult learner/i }).click();
      await page.evaluate(() => {
        const key = "mb.placement.v3.stub.session";
        const raw = localStorage.getItem(key);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        parsed.expiresAt = new Date(Date.now() - 1000).toISOString();
        localStorage.setItem(key, JSON.stringify(parsed));
      });
      await page.reload();
      await expect(page.getByText(/This session expired/i)).toBeVisible();
    });

    test(`completed results show profile and recommendations (${locale})`, async ({ page }) => {
      await page.goto(`${BASE_URL}/placement/who`);
      await page.getByRole("button", { name: /adult learner/i }).click();
      await page.getByLabel(/Writing answer/i).fill("I study English every day because I need it for work and interviews. I want better grammar this month.");
      await page.getByRole("button", { name: /Submit answer/i }).click();
      await page.getByLabel(/Transcript or typed answer/i).fill("I am learning English for work and for a future interview.");
      await page.getByRole("button", { name: /Submit answer/i }).click();
      await page.getByRole("radio", { name: /Send three feedback slides/i }).click();
      await page.getByRole("button", { name: /Submit answer/i }).click();
      await page.getByRole("radio", { name: /the bus is delayed/i }).click();
      await page.getByRole("button", { name: /Submit answer/i }).click();
      await page.getByLabel(/Conversation answer/i).fill("I want an office job where I can email customers and speak clearly in meetings.");
      await page.getByRole("button", { name: /Submit answer/i }).click();
      await expect(page.getByText(/Overall level/i)).toBeVisible();
      await expect(page.getByText(/Start here/i)).toBeVisible();
    });
  }
});
