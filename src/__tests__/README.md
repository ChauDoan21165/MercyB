# Navigation Integration Tests

## Overview

This test suite verifies that navigation works correctly end-to-end in the React application, testing actual component rendering and user interactions with React Testing Library.

## Running Integration Tests

```bash
# Run all tests (unit + integration)
npx vitest

# Run only integration tests
npx vitest src/__tests__

# Run with coverage
npx vitest --coverage

# Run with UI
npx vitest --ui

# Watch mode
npx vitest --watch
```

## Test Coverage

### 1. **Route Helper Integration**
Tests that the route helper correctly determines parent routes for:
- Free tier rooms → `/rooms`
- VIP1 tier rooms → `/rooms-vip1`
- VIP2 tier rooms → `/rooms-vip2`
- VIP3 tier rooms → `/rooms-vip3`
- Sexuality sub-rooms → `/sexuality-culture`
- Special VIP3 rooms (Strategy, Finance Glory)

### 2. **Back Button Navigation**
End-to-end tests that verify:
- Clicking back button from standard rooms navigates to correct tier page
- Clicking back button from sexuality sub-rooms navigates to `/sexuality-culture`
- User interactions trigger proper navigation calls

### 3. **Cross-Tier Navigation**
Verifies navigation consistency across different tiers:
- Same room category across all tiers (e.g., ADHD Support)
- Correct parent route for each tier

### 4. **Edge Case Navigation**
Tests handling of:
- Undefined room IDs
- Empty strings
- Invalid room IDs
- Graceful fallback to default routes

### 5. **Room Type Coverage**
Comprehensive coverage of all major room categories:
- Mental Health (ADHD, Anxiety, Depression)
- Physical Health (Nutrition, Obesity, Sleep)
- Personal Growth (Confidence, Mindfulness, Shadow Work)
- Spiritual (God With Us, Meaning of Life)
- Specialty (AI, Philosophy)

### 6. **Sexuality Culture Room Integration**
Specific tests for:
- All 6 sexuality sub-rooms
- Parent room navigation
- Sub-room to parent navigation

### 7. **Navigation Consistency**
Ensures:
- Bidirectional navigation patterns work correctly
- No circular navigation loops
- Valid route path formats

## Test Structure

```typescript
// Example integration test
it('should navigate to correct parent when back button is clicked', async () => {
  // 1. Set up mocks
  vi.mocked(useParams).mockReturnValue({ roomId: 'adhd-support-vip3' });
  
  // 2. Render component
  renderWithRouter(<ChatHub />);
  
  // 3. Wait for render
  await waitFor(() => {
    expect(screen.queryByText(/Back/i)).toBeInTheDocument();
  });
  
  // 4. Simulate user interaction
  const backButton = screen.getByRole('button', { name: /Back/i });
  await userEvent.setup().click(backButton);
  
  // 5. Assert navigation
  expect(mockNavigate).toHaveBeenCalledWith('/rooms-vip3');
});
```

## Test Utilities

### `renderWithRouter()`
Custom render function that wraps components with:
- QueryClientProvider (for TanStack Query)
- MemoryRouter (for React Router)

```typescript
renderWithRouter(<MyComponent />, {
  initialEntries: ['/chat/adhd-support-vip3']
});
```

### `createMockNavigate()`
Helper for tracking navigation calls:
```typescript
const { navigate, navigations } = createMockNavigate();
// Later verify: navigations.includes('/rooms-vip3')
```

## Mocks

The integration tests mock:
- **React Router**: `useNavigate`, `useParams`
- **Supabase Client**: Auth and database queries
- **Custom Hooks**: `useRoomProgress`, `useBehaviorTracking`, `usePoints`, `useUserAccess`, `useCredits`

This allows testing navigation logic in isolation while maintaining realistic component behavior.

## Adding New Tests

When adding new room types or navigation patterns:

1. **Add to Route Helper Integration**
```typescript
it('should handle new-room-type correctly', () => {
  expect(getParentRoute('new-room-type-vip3')).toBe('/rooms-vip3');
});
```

2. **Add E2E Navigation Test**
```typescript
it('should navigate from new room type', async () => {
  vi.mocked(useParams).mockReturnValue({ roomId: 'new-room-type-vip3' });
  renderWithRouter(<ChatHub />);
  // ... test navigation
});
```

3. **Add to Coverage Test**
```typescript
{ id: 'new-room-type-vip3', parent: '/rooms-vip3' }
```

## Debugging Tests

### View Test Output
```bash
# Verbose mode
npx vitest --reporter=verbose

# Show browser-like output
npx vitest --ui
```

### Debug Single Test
```typescript
it.only('should test specific behavior', async () => {
  // Only this test will run
});
```

### View Rendered HTML
```typescript
import { screen, debug } from '@testing-library/react';

// Print entire document
debug();

// Print specific element
debug(screen.getByRole('button'));
```

## CI/CD Integration

These tests are designed to run in CI environments. Add to your GitHub Actions:

```yaml
- name: Run Tests
  run: npm test

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

## Best Practices

1. **Test user behavior, not implementation**
   - ✅ Click button, verify navigation
   - ❌ Call internal functions directly

2. **Use semantic queries**
   - ✅ `getByRole('button', { name: /Back/i })`
   - ❌ `getByTestId('back-button')`

3. **Await async operations**
   ```typescript
   await waitFor(() => {
     expect(screen.getByText('Content')).toBeInTheDocument();
   });
   ```

4. **Clean up mocks**
   ```typescript
   beforeEach(() => {
     mockNavigate.mockClear();
   });
   ```

## Coverage Goals

- **Route Helper**: 100% coverage (all branches)
- **Navigation Logic**: 100% coverage (all paths)
- **Integration Tests**: Cover all room types and navigation patterns

Current coverage:
- Route Helper Unit Tests: 65+ tests
- Navigation Integration Tests: 40+ tests
- Total: 105+ tests covering navigation
