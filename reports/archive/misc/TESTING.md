# Testing Guide

This project has comprehensive test coverage including unit tests, integration tests, and visual regression tests.

## Test Types

### 1. Unit Tests (Vitest)
Tests individual functions and utilities in isolation.

**Location**: `src/lib/__tests__/`

**Run**:
```bash
# Run all unit tests
npx vitest

# Run with coverage
npx vitest --coverage

# Run in watch mode
npx vitest --watch

# Run with UI
npx vitest --ui
```

### 2. Integration Tests (React Testing Library + Vitest)
Tests React components and navigation flows.

**Location**: `src/__tests__/`

**Run**:
```bash
# Run all tests (includes integration)
npx vitest

# Run only integration tests
npx vitest src/__tests__
```

### 3. Visual Regression Tests (Playwright)
Tests UI rendering across browsers and devices with screenshot comparison.

**Location**: `e2e/`

**Run**:
```bash
# Install Playwright browsers first
npx playwright install

# Run all E2E tests
npx playwright test

# Run with UI mode
npx playwright test --ui

# Run specific test file
npx playwright test e2e/visual-regression.spec.ts

# Update snapshots after UI changes
npx playwright test --update-snapshots
```

## Quick Start

### Install All Dependencies

```bash
# Install npm packages
npm install

# Install Playwright browsers
npx playwright install
```

### Run All Tests

```bash
# Unit & Integration tests
npm run test

# Visual regression tests
npm run test:e2e

# All tests with coverage
npm run test:all
```

## Test Scripts (package.json)

Add these to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:update": "playwright test --update-snapshots",
    "test:all": "vitest run --coverage && playwright test"
  }
}
```

## Coverage Goals

- **Route Helper**: 100% coverage
- **Navigation Logic**: 100% coverage
- **Critical User Paths**: 100% E2E coverage

Current Status:
- ✅ Unit Tests: 65+ tests
- ✅ Integration Tests: 40+ tests  
- ✅ Visual Regression: 30+ scenarios
- ✅ Cross-browser: 5 browsers/devices

## CI/CD Integration

Tests run automatically on:
- Every push to main branch
- Every pull request
- Manual workflow trigger

### GitHub Actions Workflows

**Vitest Tests** (`.github/workflows/vitest.yml`):
- Runs unit and integration tests
- Generates coverage report
- Posts coverage to PR comments

**Playwright Tests** (`.github/workflows/playwright.yml`):
- Runs visual regression tests
- Tests on multiple browsers
- Uploads failed test artifacts

## Writing New Tests

### Unit Test Example

```typescript
// src/lib/__tests__/myFunction.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myFunction';

describe('myFunction', () => {
  it('should handle valid input', () => {
    expect(myFunction('valid')).toBe('expected');
  });
  
  it('should handle edge cases', () => {
    expect(myFunction('')).toBe('default');
  });
});
```

### Integration Test Example

```typescript
// src/__tests__/MyComponent.test.tsx
import { describe, it, expect } from 'vitest';
import { renderWithRouter, screen, userEvent } from '@/test/test-utils';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should navigate on button click', async () => {
    renderWithRouter(<MyComponent />);
    
    const button = screen.getByRole('button', { name: /Click Me/i });
    await userEvent.setup().click(button);
    
    expect(mockNavigate).toHaveBeenCalledWith('/expected-route');
  });
});
```

### Visual Regression Test Example

```typescript
// e2e/my-feature.spec.ts
import { test, expect } from '@playwright/test';

test('my feature renders correctly', async ({ page }) => {
  await page.goto('/my-feature');
  await page.waitForLoadState('networkidle');
  
  await expect(page).toHaveScreenshot('my-feature.png', {
    fullPage: true,
    maxDiffPixels: 100,
  });
});
```

## Debugging Tests

### Debug Vitest Tests

```bash
# Debug in VS Code
# Add breakpoint and use Debug > JavaScript Debug Terminal

# Debug with console logs
npx vitest --reporter=verbose
```

### Debug Playwright Tests

```bash
# Debug mode - opens browser with inspector
npx playwright test --debug

# Debug specific test
npx playwright test e2e/visual-regression.spec.ts:42 --debug

# View test trace
npx playwright show-trace trace.zip
```

## Test Best Practices

### 1. **Arrange-Act-Assert Pattern**

```typescript
it('should do something', () => {
  // Arrange - Set up test data
  const input = 'test';
  
  // Act - Execute the function
  const result = myFunction(input);
  
  // Assert - Verify the result
  expect(result).toBe('expected');
});
```

### 2. **Test User Behavior, Not Implementation**

```typescript
// ✅ Good - Tests what user sees
expect(screen.getByText('Welcome')).toBeInTheDocument();

// ❌ Bad - Tests implementation details
expect(component.state.isWelcome).toBe(true);
```

### 3. **Use Descriptive Test Names**

```typescript
// ✅ Good
it('should navigate to VIP3 tier when back button is clicked from ADHD room', () => {});

// ❌ Bad  
it('test navigation', () => {});
```

### 4. **Clean Up After Tests**

```typescript
beforeEach(() => {
  mockNavigate.mockClear();
});

afterEach(() => {
  cleanup();
});
```

### 5. **Avoid Test Interdependence**

Each test should be independent and able to run in any order.

## Troubleshooting

### Vitest Issues

**Tests timing out:**
```typescript
test.setTimeout(10000); // Increase timeout
```

**Mock not working:**
```typescript
vi.clearAllMocks(); // Clear mocks between tests
```

### Playwright Issues

**Flaky screenshots:**
```typescript
// Increase diff threshold
maxDiffPixels: 200

// Wait for animations
await page.waitForTimeout(500);
```

**Element not found:**
```typescript
// Use more flexible selectors
await page.waitForSelector('text=/Pattern/i', { timeout: 10000 });
```

## Resources

- [Vitest Documentation](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Getting Help

- Check existing tests for examples
- Read test README files in `src/lib/__tests__/` and `e2e/`
- Review GitHub Actions logs for CI failures
- Search [Playwright Discord](https://discord.com/invite/playwright-807756831384403968) for help
