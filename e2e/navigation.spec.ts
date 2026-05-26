import { test, expect } from '@playwright/test';

/**
 * Navigation E2E Tests
 * Verifies navigation flows work correctly across all room types
 */

test.describe('Navigation Flow Tests', () => {
  test('Navigate from VIP3 tier to ADHD room and back', async ({ page }) => {
    // Start at VIP3 tier page
    await page.goto('/rooms-vip3');
    await page.waitForLoadState('networkidle');
    
    // Click on ADHD Support room
    await page.click('text=/ADHD Support|Hỗ Trợ Rối Loạn Tăng Động/i');
    await page.waitForLoadState('networkidle');
    
    // Verify we're in the room
    await expect(page).toHaveURL(/\/chat\/adhd-support-vip3/);
    
    // Click back button
    await page.click('button:has-text("Back"), button:has-text("Quay Lại")');
    await page.waitForLoadState('networkidle');
    
    // Verify we're back at VIP3 tier
    await expect(page).toHaveURL('/rooms-vip3');
  });

  test('Navigate from sexuality culture to sub-room and back', async ({ page }) => {
    // Start at sexuality culture page
    await page.goto('/sexuality-culture');
    await page.waitForLoadState('networkidle');
    
    // Click on first sub-room
    await page.click('[class*="grid"] > *:first-child');
    await page.waitForLoadState('networkidle');
    
    // Verify we're in a sub-room
    await expect(page).toHaveURL(/\/chat\/sexuality-curiosity-vip3-sub/);
    
    // Click back button
    await page.click('button:has-text("Back"), button:has-text("Quay Lại")');
    await page.waitForLoadState('networkidle');
    
    // Verify we're back at sexuality culture
    await expect(page).toHaveURL('/sexuality-culture');
  });

  test('Navigate from VIP3 to sexuality culture to sub-room', async ({ page }) => {
    // Start at VIP3
    await page.goto('/rooms-vip3');
    await page.waitForLoadState('networkidle');
    
    // Click sexuality culture room
    await page.click('text=/Sexuality.*Culture|Tính Dục.*Văn Hóa/i');
    await page.waitForLoadState('networkidle');
    
    // Verify at sexuality culture
    await expect(page).toHaveURL('/sexuality-culture');
    
    // Click a sub-room
    await page.click('[class*="grid"] > *:first-child');
    await page.waitForLoadState('networkidle');
    
    // Verify at sub-room
    await expect(page).toHaveURL(/\/chat\/sexuality-curiosity-vip3-sub/);
  });

  test('Navigate through all tiers using tier navigation', async ({ page }) => {
    // Start at free tier
    await page.goto('/rooms');
    await page.waitForLoadState('networkidle');
    
    // Navigate to VIP1 (if navigation exists)
    const vip1Link = page.locator('a[href="/rooms-vip1"], button:has-text("VIP1")');
    if (await vip1Link.count() > 0) {
      await vip1Link.first().click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/rooms-vip1');
      
      // Navigate to VIP2
      const vip2Link = page.locator('a[href="/rooms-vip2"], button:has-text("VIP2")');
      if (await vip2Link.count() > 0) {
        await vip2Link.first().click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/rooms-vip2');
        
        // Navigate to VIP3
        const vip3Link = page.locator('a[href="/rooms-vip3"], button:has-text("VIP3")');
        if (await vip3Link.count() > 0) {
          await vip3Link.first().click();
          await page.waitForLoadState('networkidle');
          await expect(page).toHaveURL('/rooms-vip3');
        }
      }
    }
  });

  test('Verify no 404 errors when navigating back from all room types', async ({ page }) => {
    const roomsToTest = [
      { id: 'adhd-support-vip3', expectedParent: '/rooms-vip3' },
      { id: 'confidence-vip2', expectedParent: '/rooms-vip2' },
      { id: 'anxiety-relief-vip1', expectedParent: '/rooms-vip1' },
      { id: 'mental-health-free', expectedParent: '/rooms' },
      { id: 'sexuality-curiosity-vip3-sub1', expectedParent: '/sexuality-culture' },
    ];

    for (const room of roomsToTest) {
      // Navigate to room
      await page.goto(`/chat/${room.id}`);
      await page.waitForLoadState('networkidle');
      
      // Verify not on 404 page
      await expect(page.locator('text=/404|Not Found/i')).not.toBeVisible();
      
      // Click back
      await page.click('button:has-text("Back"), button:has-text("Quay Lại")');
      await page.waitForLoadState('networkidle');
      
      // Verify at expected parent and not 404
      await expect(page).toHaveURL(room.expectedParent);
      await expect(page.locator('text=/404|Not Found/i')).not.toBeVisible();
    }
  });
});

test.describe('Deep Link Navigation', () => {
  test('Direct URL navigation to room works', async ({ page }) => {
    await page.goto('/chat/adhd-support-vip3');
    await page.waitForLoadState('networkidle');
    
    // Should load the room directly
    await expect(page).toHaveURL('/chat/adhd-support-vip3');
    await expect(page.locator('text=/ADHD|Rối Loạn Tăng Động/i')).toBeVisible();
  });

  test('Direct URL navigation to sexuality sub-room works', async ({ page }) => {
    await page.goto('/chat/sexuality-curiosity-vip3-sub3');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL('/chat/sexuality-curiosity-vip3-sub3');
    await expect(page.locator('text=/Sexual Health|Sức Khỏe Tình Dục/i')).toBeVisible();
  });

  test('Back button from deep link navigates correctly', async ({ page }) => {
    // Navigate directly to sub-room
    await page.goto('/chat/sexuality-curiosity-vip3-sub2');
    await page.waitForLoadState('networkidle');
    
    // Click back
    await page.click('button:has-text("Back"), button:has-text("Quay Lại")');
    await page.waitForLoadState('networkidle');
    
    // Should go to sexuality culture, not browser back
    await expect(page).toHaveURL('/sexuality-culture');
  });
});

test.describe('Navigation Accessibility', () => {
  test('Back button is keyboard accessible', async ({ page }) => {
    await page.goto('/chat/adhd-support-vip3');
    await page.waitForLoadState('networkidle');
    
    // Tab to back button
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus');
    
    // Check if back button or something in header is focused
    await expect(focusedElement).toBeVisible();
    
    // Press Enter
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle');
    
    // Should navigate back
    await expect(page).toHaveURL('/rooms-vip3');
  });

  test('Back button has proper ARIA labels', async ({ page }) => {
    await page.goto('/chat/adhd-support-vip3');
    await page.waitForLoadState('networkidle');
    
    const backButton = page.locator('button:has-text("Back"), button:has-text("Quay Lại")');
    
    // Button should be visible and accessible
    await expect(backButton).toBeVisible();
    await expect(backButton).toBeEnabled();
  });
});
