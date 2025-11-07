# End-to-End and Visual Regression Tests

## Overview

This directory contains Playwright tests for visual regression testing and end-to-end navigation testing. These tests verify that the UI renders correctly and navigation works properly across all room types and browsers.

## Setup

### Install Dependencies

```bash
# Install Playwright
npm install

# Install browser binaries
npx playwright install
```

### Install Specific Browsers

```bash
# Install only Chromium
npx playwright install chromium

# Install all browsers
npx playwright install
```

## Running Tests

### Run All Tests

```bash
# Run all tests
npx playwright test

# Run with UI mode (interactive)
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test file
npx playwright test e2e/visual-regression.spec.ts
```

### Run Specific Browser

```bash
# Run only on Chromium
npx playwright test --project=chromium

# Run only on Firefox
npx playwright test --project=firefox

# Run only on WebKit (Safari)
npx playwright test --project=webkit

# Run on mobile
npx playwright test --project=mobile-chrome
```

### Debug Tests

```bash
# Debug mode - opens browser and pauses
npx playwright test --debug

# Debug specific test
npx playwright test e2e/visual-regression.spec.ts:15 --debug
```

## Visual Regression Testing

### How It Works

Visual regression tests take screenshots of pages and compare them to baseline images. If there are differences beyond the threshold, the test fails.

### Update Snapshots

When you make intentional UI changes, update the baseline screenshots:

```bash
# Update all snapshots
npx playwright test --update-snapshots

# Update snapshots for specific test
npx playwright test visual-regression --update-snapshots

# Update snapshots for specific browser
npx playwright test --project=chromium --update-snapshots
```

### View Test Results

```bash
# Open HTML report
npx playwright show-report

# View specific test trace
npx playwright show-trace trace.zip
```

## Test Coverage

### Visual Regression Tests

1. **Room Grids**
   - Free tier room grid
   - VIP1 tier room grid
   - VIP2 tier room grid
   - VIP3 tier room grid
   - Sexuality culture grid

2. **Individual Rooms**
   - ADHD Support room
   - Anxiety Relief room
   - Confidence room
   - Sexuality sub-rooms (all 6)
   - Strategy in Life rooms
   - Finance Glory room

3. **Navigation Elements**
   - Back button in standard rooms
   - Back button in sexuality sub-rooms
   - Feedback section

4. **Responsive Design**
   - Mobile viewport (375x667)
   - Tablet viewport (768x1024)
   - Desktop viewport (1280x720)

5. **Dark Mode**
   - All major pages in dark mode

6. **Cross-Browser**
   - Chromium, Firefox, WebKit
   - Mobile Chrome, Mobile Safari

### Navigation E2E Tests

1. **Navigation Flows**
   - VIP3 → Room → Back to VIP3
   - Sexuality Culture → Sub-room → Back
   - Multi-tier navigation

2. **Deep Linking**
   - Direct URL to rooms
   - Direct URL to sub-rooms
   - Back button behavior

3. **Accessibility**
   - Keyboard navigation
   - ARIA labels

## Snapshot Organization

Snapshots are stored in:
```
e2e/__screenshots__/
├── visual-regression.spec.ts/
│   ├── rooms-free-tier-chromium.png
│   ├── rooms-vip3-tier-chromium.png
│   ├── room-adhd-support-chromium.png
│   └── ...
└── navigation.spec.ts/
    └── ...
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      
      - name: Run Playwright tests
        run: npx playwright test
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
      
      - name: Upload failed test screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: failed-screenshots
          path: test-results/
          retention-days: 7
```

## Best Practices

### 1. Wait for Content

Always wait for content to load before taking screenshots:

```typescript
await page.waitForLoadState('networkidle');
await page.waitForSelector('text=/Expected Content/i');
```

### 2. Set Appropriate Thresholds

Use `maxDiffPixels` to allow for minor rendering differences:

```typescript
await expect(page).toHaveScreenshot('test.png', {
  maxDiffPixels: 100, // Allow up to 100 pixels difference
});
```

### 3. Use Stable Selectors

Prefer text content and ARIA roles over CSS classes:

```typescript
// ✅ Good
await page.click('button:has-text("Back")');
await page.locator('role=button[name="Submit"]');

// ❌ Avoid
await page.click('.btn-back-123');
```

### 4. Test Critical Paths

Focus on user-facing features and navigation:
- Room grids
- Individual rooms
- Navigation flows
- Responsive layouts

### 5. Exclude Dynamic Content

If content changes frequently (e.g., timestamps), exclude from screenshots:

```typescript
await expect(page.locator('.content-area')).toHaveScreenshot('content.png', {
  mask: [page.locator('.timestamp')],
});
```

## Troubleshooting

### Flaky Tests

If tests fail inconsistently:

1. **Increase timeouts**
   ```typescript
   test.setTimeout(60000); // 60 seconds
   ```

2. **Wait for animations**
   ```typescript
   await page.waitForTimeout(500); // Wait for transitions
   ```

3. **Use stricter waiting**
   ```typescript
   await page.waitForLoadState('networkidle');
   await page.waitForFunction(() => document.fonts.ready);
   ```

### Font Rendering Differences

Different OS may render fonts differently:

```typescript
// Use maxDiffPixelRatio for text-heavy screenshots
await expect(page).toHaveScreenshot('text.png', {
  maxDiffPixelRatio: 0.1, // Allow 10% difference
});
```

### Screenshot Size

Full page screenshots can be large. Consider capturing specific elements:

```typescript
const element = page.locator('.main-content');
await expect(element).toHaveScreenshot('element.png');
```

## Performance

### Parallel Execution

Tests run in parallel by default. Configure in `playwright.config.ts`:

```typescript
workers: process.env.CI ? 1 : undefined, // Sequential in CI
```

### Selective Browser Testing

For faster development, test on one browser:

```bash
npx playwright test --project=chromium
```

Run all browsers only in CI or before release.

## Adding New Tests

### New Visual Regression Test

```typescript
test('New room type renders correctly', async ({ page }) => {
  await page.goto('/chat/new-room-type-vip3');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('text=/New Room/i');
  
  await expect(page).toHaveScreenshot('room-new-type.png', {
    fullPage: true,
    maxDiffPixels: 150,
  });
});
```

### New Navigation Test

```typescript
test('Navigate to new room and back', async ({ page }) => {
  await page.goto('/rooms-vip3');
  await page.click('text=/New Room/i');
  await expect(page).toHaveURL('/chat/new-room-type-vip3');
  
  await page.click('button:has-text("Back")');
  await expect(page).toHaveURL('/rooms-vip3');
});
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Visual Regression Testing Guide](https://playwright.dev/docs/test-snapshots)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
