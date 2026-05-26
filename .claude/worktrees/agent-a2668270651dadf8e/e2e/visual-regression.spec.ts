import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests
 * Verifies UI renders correctly across different room types and tiers
 * 
 * To update snapshots: npx playwright test --update-snapshots
 */

test.describe('Visual Regression - Room Grids', () => {
  test('Free tier room grid renders correctly', async ({ page }) => {
    await page.goto('/rooms');
    await page.waitForLoadState('networkidle');
    
    // Wait for rooms to load
    await page.waitForSelector('[class*="grid"]', { timeout: 10000 });
    
    // Take screenshot
    await expect(page).toHaveScreenshot('rooms-free-tier.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('VIP1 tier room grid renders correctly', async ({ page }) => {
    await page.goto('/rooms-vip1');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[class*="grid"]', { timeout: 10000 });
    
    await expect(page).toHaveScreenshot('rooms-vip1-tier.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('VIP2 tier room grid renders correctly', async ({ page }) => {
    await page.goto('/rooms-vip2');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[class*="grid"]', { timeout: 10000 });
    
    await expect(page).toHaveScreenshot('rooms-vip2-tier.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('VIP3 tier room grid renders correctly', async ({ page }) => {
    await page.goto('/rooms-vip3');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[class*="grid"]', { timeout: 10000 });
    
    await expect(page).toHaveScreenshot('rooms-vip3-tier.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('Sexuality Culture room grid renders correctly', async ({ page }) => {
    await page.goto('/sexuality-culture');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[class*="grid"]', { timeout: 10000 });
    
    await expect(page).toHaveScreenshot('sexuality-culture-grid.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});

test.describe('Visual Regression - Individual Rooms', () => {
  test('ADHD Support room renders correctly', async ({ page }) => {
    await page.goto('/chat/adhd-support-vip3');
    await page.waitForLoadState('networkidle');
    
    // Wait for room content to load
    await page.waitForSelector('text=/ADHD|Rối Loạn Tăng Động/i', { timeout: 10000 });
    
    await expect(page).toHaveScreenshot('room-adhd-support.png', {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });

  test('Anxiety Relief room renders correctly', async ({ page }) => {
    await page.goto('/chat/anxiety-relief-vip3');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=/Anxiety|Lo Âu/i', { timeout: 10000 });
    
    await expect(page).toHaveScreenshot('room-anxiety-relief.png', {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });

  test('Confidence room renders correctly', async ({ page }) => {
    await page.goto('/chat/confidence-vip3');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=/Confidence|Tự Tin/i', { timeout: 10000 });
    
    await expect(page).toHaveScreenshot('room-confidence.png', {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });

  test('Sexuality sub-room 1 renders correctly', async ({ page }) => {
    await page.goto('/chat/sexuality-curiosity-vip3-sub1');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=/Sacred Body|Thân Thể Linh Thiêng/i', { timeout: 10000 });
    
    await expect(page).toHaveScreenshot('room-sexuality-sub1.png', {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });

  test('Strategy in Life room renders correctly', async ({ page }) => {
    await page.goto('/chat/strategy-in-life-1-vip3');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=/Strategy|Chiến Lược/i', { timeout: 10000 });
    
    await expect(page).toHaveScreenshot('room-strategy-in-life.png', {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });

  test('Finance Glory room renders correctly', async ({ page }) => {
    await page.goto('/chat/finance-glory-vip3');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=/Finance|Tài Chính/i', { timeout: 10000 });
    
    await expect(page).toHaveScreenshot('room-finance-glory.png', {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });
});

test.describe('Visual Regression - Navigation Elements', () => {
  test('Back button renders correctly in standard room', async ({ page }) => {
    await page.goto('/chat/adhd-support-vip3');
    await page.waitForLoadState('networkidle');
    
    // Focus on header with back button
    const header = page.locator('header, [class*="header"]').first();
    await expect(header).toHaveScreenshot('back-button-standard.png', {
      maxDiffPixels: 50,
    });
  });

  test('Back button renders correctly in sexuality sub-room', async ({ page }) => {
    await page.goto('/chat/sexuality-curiosity-vip3-sub1');
    await page.waitForLoadState('networkidle');
    
    const header = page.locator('header, [class*="header"]').first();
    await expect(header).toHaveScreenshot('back-button-sexuality-sub.png', {
      maxDiffPixels: 50,
    });
  });

  test('Feedback section renders correctly', async ({ page }) => {
    await page.goto('/chat/adhd-support-vip3');
    await page.waitForLoadState('networkidle');
    
    // Scroll to feedback section at bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const feedbackSection = page.locator('text=/Feedback/i').locator('..').locator('..');
    await expect(feedbackSection).toHaveScreenshot('feedback-section.png', {
      maxDiffPixels: 50,
    });
  });
});

test.describe('Visual Regression - Responsive Design', () => {
  test('Room grid is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/rooms-vip3');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[class*="grid"]', { timeout: 10000 });
    
    await expect(page).toHaveScreenshot('rooms-vip3-mobile.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('Chat room is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/chat/adhd-support-vip3');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=/ADHD|Rối Loạn Tăng Động/i', { timeout: 10000 });
    
    await expect(page).toHaveScreenshot('chat-room-mobile.png', {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });

  test('Sexuality culture grid is responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/sexuality-culture');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[class*="grid"]', { timeout: 10000 });
    
    await expect(page).toHaveScreenshot('sexuality-culture-tablet.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});

test.describe('Visual Regression - Content Display', () => {
  test('Room essay content renders correctly', async ({ page }) => {
    await page.goto('/chat/adhd-support-vip3');
    await page.waitForLoadState('networkidle');
    
    // Wait for essay content
    await page.waitForSelector('[class*="essay"], [class*="content"]', { timeout: 10000 });
    
    // Screenshot of content area
    const contentArea = page.locator('[class*="scroll"]').first();
    await expect(contentArea).toHaveScreenshot('room-essay-content.png', {
      maxDiffPixels: 200,
    });
  });

  test('Keywords display correctly', async ({ page }) => {
    await page.goto('/chat/adhd-support-vip3');
    await page.waitForLoadState('networkidle');
    
    // Wait for keywords section
    await page.waitForSelector('text=/Keywords|Từ Khóa/i', { timeout: 10000 });
    
    // Screenshot keywords area
    const keywordsSection = page.locator('text=/Keywords|Từ Khóa/i').locator('..').locator('..');
    await expect(keywordsSection).toHaveScreenshot('keywords-display.png', {
      maxDiffPixels: 100,
    });
  });
});

test.describe('Visual Regression - Dark Mode', () => {
  test.use({ colorScheme: 'dark' });

  test('Room grid renders correctly in dark mode', async ({ page }) => {
    await page.goto('/rooms-vip3');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[class*="grid"]', { timeout: 10000 });
    
    await expect(page).toHaveScreenshot('rooms-vip3-dark-mode.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('Chat room renders correctly in dark mode', async ({ page }) => {
    await page.goto('/chat/adhd-support-vip3');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=/ADHD|Rối Loạn Tăng Động/i', { timeout: 10000 });
    
    await expect(page).toHaveScreenshot('chat-room-dark-mode.png', {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });
});

test.describe('Visual Regression - Cross-Browser Consistency', () => {
  test('Verify consistent rendering across browsers', async ({ page, browserName }) => {
    await page.goto('/rooms-vip3');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[class*="grid"]', { timeout: 10000 });
    
    // Browser-specific screenshot
    await expect(page).toHaveScreenshot(`rooms-vip3-${browserName}.png`, {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });
});
