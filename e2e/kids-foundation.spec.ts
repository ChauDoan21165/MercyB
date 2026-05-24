import { expect, test } from '@playwright/test';

test.describe('Mercy Kids foundation visual smoke', () => {
  test('Việt Kids English renders picture + speak flow without adult tutor shell', async ({ page }) => {
    await page.goto('/kids/vi-english');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Mercy Kids' })).toBeVisible();
    await expect(page.getByText('1. Chọn hình')).toBeVisible();
    await expect(page.getByText('2. Bấm để nói')).toBeVisible();

    const pictureChoices = page
      .locator('button')
      .filter({ hasText: /apple|dog|cat|sun|car|book|quả táo|con chó|con mèo|mặt trời|xe hơi|quyển sách/i });
    await expect(pictureChoices).toHaveCount(6);

    await pictureChoices.first().click();
    await expect(page.getByRole('button', { name: /Bấm để nói với Mercy/i })).toBeVisible();

    for (const tabName of ['Journey', 'Grammar', 'Speak', 'Logic']) {
      await expect(page.getByRole('tab', { name: tabName, exact: true })).toHaveCount(0);
    }

    await expect(page.locator('textarea')).toHaveCount(0);
    await expect(page.locator('[data-testid="teacher-mercy-learning-shell"]')).toHaveCount(0);
    await expect(page.getByText(/Nhắc nhẹ hôm nay|Memory/i)).toHaveCount(0);

    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot.byteLength).toBeGreaterThan(10_000);
  });
});
