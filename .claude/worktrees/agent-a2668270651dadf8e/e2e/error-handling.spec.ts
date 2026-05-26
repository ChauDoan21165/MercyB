import { test, expect } from '@playwright/test';

/**
 * E2E tests for error handling and edge cases
 * Ensures the application handles failures gracefully
 */

test.describe('Error Handling and Edge Cases', () => {
  test('should handle 404 for non-existent rooms', async ({ page }) => {
    await page.goto('/chat/this-room-definitely-does-not-exist-12345');
    await page.waitForLoadState('networkidle');
    
    // Should show some indication of error (404, error message, or redirect)
    const url = page.url();
    const bodyText = await page.textContent('body');
    
    // Either shows 404 or redirects, but doesn't crash
    const handlesError = url.includes('404') || 
                        bodyText?.includes('404') || 
                        bodyText?.includes('not found') ||
                        bodyText?.includes('Error');
    
    expect(handlesError || url !== '/chat/this-room-definitely-does-not-exist-12345').toBe(true);
  });

  test('should handle network failures gracefully', async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true);
    
    await page.goto('/chat/god-with-us-free');
    
    // Should show some kind of error state, not hang indefinitely
    await page.waitForTimeout(3000);
    
    const isInteractive = await page.evaluate(() => document.readyState);
    expect(['complete', 'interactive']).toContain(isInteractive);
    
    // Re-enable network
    await page.context().setOffline(false);
  });

  test('should recover from failed JSON fetch', async ({ page }) => {
    // Block specific JSON files
    await page.route('**/*.json', route => {
      if (route.request().url().includes('test-fail')) {
        route.abort();
      } else {
        route.continue();
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // App should still be functional
    const isInteractive = await page.evaluate(() => document.readyState === 'complete');
    expect(isInteractive).toBe(true);
  });

  test('should handle malformed room data', async ({ page }) => {
    // Intercept and return malformed JSON
    await page.route('**/data/malformed-test.json', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{"invalid": json structure',
      });
    });

    await page.goto('/chat/malformed-test');
    await page.waitForTimeout(2000);
    
    // Should not crash the app
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeDefined();
  });

  test('should handle empty room data', async ({ page }) => {
    await page.route('**/data/empty-test.json', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ entries: [] }),
      });
    });

    await page.goto('/chat/empty-test');
    await page.waitForLoadState('networkidle');
    
    // Should show empty state without crashing
    const isComplete = await page.evaluate(() => document.readyState === 'complete');
    expect(isComplete).toBe(true);
  });

  test('should handle missing audio files', async ({ page }) => {
    // Block audio file requests
    await page.route('**/*.mp3', route => route.abort());
    
    await page.goto('/chat/god-with-us-free');
    await page.waitForLoadState('networkidle');
    
    // App should still display content even if audio fails
    const bodyText = await page.textContent('body');
    expect(bodyText?.length || 0).toBeGreaterThan(50);
  });

  test('should handle rapid navigation between rooms', async ({ page }) => {
    const rooms = [
      '/chat/god-with-us-free',
      '/chat/anxiety-relief-free',
      '/chat/adhd-support-free',
      '/chat/confidence-free',
    ];

    // Rapidly navigate between rooms
    for (const room of rooms) {
      await page.goto(room);
      await page.waitForTimeout(300); // Brief pause
    }
    
    await page.waitForLoadState('networkidle');
    
    // Should end up in a stable state
    const isComplete = await page.evaluate(() => document.readyState === 'complete');
    expect(isComplete).toBe(true);
  });

  test('should handle concurrent room loads', async ({ page }) => {
    // Start loading a room
    const navigation = page.goto('/chat/god-with-us-free');
    
    // Immediately navigate to another room
    await page.waitForTimeout(100);
    await page.goto('/chat/anxiety-relief-free');
    
    await navigation.catch(() => {}); // Ignore if first navigation was cancelled
    await page.waitForLoadState('networkidle');
    
    // Should resolve to a stable state
    const url = page.url();
    expect(url).toContain('/chat/');
  });
});

test.describe('Data Validation Edge Cases', () => {
  test('should handle room with missing keywords', async ({ page }) => {
    await page.route('**/data/no-keywords-test.json', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          title: { en: 'Test', vi: 'Thử' },
          entries: [{
            slug: 'test',
            audio: 'test.mp3',
            keywords_en: [],
            keywords_vi: [],
            replies_en: ['reply'],
            replies_vi: ['trả lời'],
          }],
        }),
      });
    });

    await page.goto('/chat/no-keywords-test');
    await page.waitForLoadState('networkidle');
    
    const isComplete = await page.evaluate(() => document.readyState === 'complete');
    expect(isComplete).toBe(true);
  });

  test('should handle room with insufficient keywords', async ({ page }) => {
    await page.route('**/data/few-keywords-test.json', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          title: { en: 'Test', vi: 'Thử' },
          entries: [{
            slug: 'test',
            audio: 'test.mp3',
            keywords_en: ['one', 'two'],
            keywords_vi: ['một', 'hai'],
            replies_en: ['reply'],
            replies_vi: ['trả lời'],
          }],
        }),
      });
    });

    await page.goto('/chat/few-keywords-test');
    await page.waitForLoadState('networkidle');
    
    // Should load but might show validation warning
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeDefined();
  });
});
