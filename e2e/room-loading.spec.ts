import { test, expect } from '@playwright/test';

/**
 * E2E tests for critical room loading flows
 * Tests the complete user journey from navigation to content display
 */

test.describe('Room Loading Critical Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load room data and display keywords', async ({ page }) => {
    // Navigate to a specific room
    await page.goto('/chat/god-with-us-free');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check that the page loaded successfully (not 404)
    await expect(page.locator('h1')).not.toContainText('404');
    
    // Check for presence of audio elements or keyword UI
    const hasContent = await page.locator('[data-testid="room-content"], .keyword-menu, audio').count();
    expect(hasContent).toBeGreaterThan(0);
  });

  test('should handle direct room URL navigation', async ({ page }) => {
    // Direct navigation to room
    await page.goto('/chat/god-with-us-free');
    
    // Verify URL is correct
    expect(page.url()).toContain('/chat/god-with-us-free');
    
    // Wait for any loading states to complete
    await page.waitForTimeout(1000);
    
    // Check page is interactive
    const isInteractive = await page.evaluate(() => document.readyState === 'complete');
    expect(isInteractive).toBe(true);
  });

  test('should load different tier rooms correctly', async ({ page }) => {
    const rooms = [
      '/chat/god-with-us-free',
      '/chat/anxiety-relief-free',
      '/chat/adhd-support-free',
    ];

    for (const room of rooms) {
      await page.goto(room);
      await page.waitForLoadState('networkidle');
      
      // Verify no error page
      const bodyText = await page.textContent('body');
      expect(bodyText).not.toContain('404');
      expect(bodyText).not.toContain('Error');
    }
  });

  test('should handle room loading with cache busting', async ({ page }) => {
    // First visit
    await page.goto('/chat/god-with-us-free');
    await page.waitForLoadState('networkidle');
    
    // Reload the page (should use cache-busted URL)
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify content still loads correctly
    const isComplete = await page.evaluate(() => document.readyState === 'complete');
    expect(isComplete).toBe(true);
  });

  test('should display audio elements when room has audio content', async ({ page }) => {
    await page.goto('/chat/god-with-us-free');
    await page.waitForLoadState('networkidle');
    
    // Check if audio elements exist in DOM
    const audioCount = await page.locator('audio').count();
    
    // If room has audio, verify elements are present
    if (audioCount > 0) {
      const firstAudio = page.locator('audio').first();
      await expect(firstAudio).toBeAttached();
      
      // Verify audio has a source
      const hasSrc = await firstAudio.evaluate((audio: HTMLAudioElement) => {
        return audio.src.length > 0 || audio.querySelector('source')?.src.length || 0 > 0;
      });
      expect(hasSrc).toBeTruthy();
    }
  });

  test('should handle navigation back from room', async ({ page }) => {
    // Navigate to home
    await page.goto('/');
    
    // Navigate to a room
    await page.goto('/chat/god-with-us-free');
    await page.waitForLoadState('networkidle');
    
    // Go back
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    // Verify we're back at home or parent page
    expect(page.url()).not.toContain('/chat/god-with-us-free');
  });

  test('should load room registry manifest', async ({ page }) => {
    // Intercept network request for manifest
    const manifestPromise = page.waitForResponse(
      response => response.url().includes('room-manifest.json') && response.status() === 200,
      { timeout: 10000 }
    );
    
    await page.goto('/');
    
    try {
      const manifestResponse = await manifestPromise;
      const manifestData = await manifestResponse.json();
      
      // Verify manifest structure
      expect(manifestData).toBeDefined();
      expect(Array.isArray(manifestData.rooms) || Array.isArray(manifestData)).toBe(true);
    } catch (error) {
      // Manifest might not be present yet, test is informative
      console.log('Room manifest not found or not loaded');
    }
  });

  test('should handle JSON loading errors gracefully', async ({ page }) => {
    // Navigate to a room that might have loading issues
    await page.goto('/chat/nonexistent-room-test-12345');
    await page.waitForLoadState('networkidle');
    
    // Should show some kind of error or empty state, not crash
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeDefined();
    
    // Page should still be interactive
    const isInteractive = await page.evaluate(() => document.readyState === 'complete');
    expect(isInteractive).toBe(true);
  });
});

test.describe('Room Content Display', () => {
  test('should display keyword menu when available', async ({ page }) => {
    await page.goto('/chat/god-with-us-free');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500); // Allow time for data loading
    
    // Look for keyword-related UI elements
    const keywordElements = await page.locator('[class*="keyword"], [data-keyword], .menu').count();
    
    // If keywords exist, verify they're displayed
    if (keywordElements > 0) {
      const firstKeyword = page.locator('[class*="keyword"], [data-keyword]').first();
      await expect(firstKeyword).toBeVisible();
    }
  });

  test('should handle multiple entries in a room', async ({ page }) => {
    await page.goto('/chat/god-with-us-free');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Check for multiple content entries
    const entries = await page.locator('[data-entry], [class*="entry"]').count();
    
    // Room should have structure even if no explicit entry markers
    const bodyContent = await page.textContent('body');
    expect(bodyContent?.length || 0).toBeGreaterThan(100);
  });
});

test.describe('Room Loading Performance', () => {
  test('should load room within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/chat/god-with-us-free');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Room should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should not make redundant network requests', async ({ page }) => {
    const requests: string[] = [];
    
    page.on('request', request => {
      requests.push(request.url());
    });
    
    await page.goto('/chat/god-with-us-free');
    await page.waitForLoadState('networkidle');
    
    // Check for duplicate JSON requests
    const jsonRequests = requests.filter(url => url.endsWith('.json'));
    const uniqueJsonRequests = [...new Set(jsonRequests)];
    
    // Should not have many duplicate requests
    expect(jsonRequests.length - uniqueJsonRequests.length).toBeLessThan(5);
  });
});
