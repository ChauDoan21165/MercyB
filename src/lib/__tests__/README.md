# Route Helper Tests

## Running Tests

The route helper has comprehensive unit tests covering all room patterns and edge cases.

### Run Tests

```bash
# Run all tests
npx vitest

# Run tests in watch mode
npx vitest --watch

# Run tests with coverage
npx vitest --coverage

# Run tests with UI
npx vitest --ui
```

### Test Coverage

The test suite covers:

#### 1. **Type Validation**
- `isValidRoomId()` - Validates room existence
- `getRoomTier()` - Extracts tier from room IDs
- `tierToRoute()` - Maps tiers to routes

#### 2. **Edge Cases**
- Undefined room IDs
- Empty strings
- Invalid room IDs
- Rooms without tier suffixes
- Console warning verification

#### 3. **Sexuality Sub-Rooms** (6 rooms)
- All sub-rooms route to `/sexuality-culture`
- Parent room routes to `/rooms-level3`

#### 4. **Special Level 3 Rooms**
- Strategy in Life series (3 rooms)
- Finance Glory
- Sexuality parent room

#### 5. **Standard Tier-Based Rooms**
- Level 0 tier → `/rooms`
- Level 1 tier → `/rooms-level1`
- Level 2 tier → `/rooms-level2`
- Level 3 tier → `/rooms-level3`

#### 6. **All Room Categories**
- ADHD Support (all tiers)
- Depression Support (all tiers)
- Confidence (all tiers)
- Nutrition (all tiers)
- And more...

#### 7. **Pattern Matching Priority**
- Ensures special patterns match before tier-based routing
- Validates correct precedence order

### Test Output Example

```
✓ src/lib/__tests__/routeHelper.test.ts (65)
  ✓ routeHelper (65)
    ✓ isValidRoomId (8)
    ✓ getRoomTier (4)
    ✓ tierToRoute (2)
    ✓ getParentRoute (51)
      ✓ Edge Cases (4)
      ✓ Sexuality Sub-Rooms (2)
      ✓ Strategy in Life Series (1)
      ✓ Special Level 3 Rooms (1)
      ✓ Standard Tier-Based Rooms (4)
      ✓ All Room Categories (4)
      ✓ Type Safety (2)
      ✓ Pattern Matching Priority (2)

Test Files  1 passed (1)
Tests  65 passed (65)
```

### Adding Tests to package.json

To make running tests easier, add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
  }
}
```

Then you can run:
```bash
npm test
npm run test:watch
npm run test:coverage
npm run test:ui
```
