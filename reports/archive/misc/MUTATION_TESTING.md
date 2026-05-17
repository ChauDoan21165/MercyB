# Mutation Testing Guide

## Overview

Mutation testing verifies the quality of your test suite by introducing small changes (mutations) to your code and checking if your tests catch them. A high mutation score indicates strong, effective tests.

## What is Mutation Testing?

Mutation testing works by:
1. **Creating mutants**: Small changes to your code (e.g., changing `>` to `>=`, `&&` to `||`)
2. **Running tests**: Execute your test suite against each mutant
3. **Scoring**: Calculate how many mutants were "killed" (caught by tests)

### Mutation Types

Common mutations include:
- **Arithmetic**: `+` → `-`, `*` → `/`
- **Conditional**: `>` → `>=`, `&&` → `||`
- **Boolean**: `true` → `false`, `!x` → `x`
- **Strings**: `"text"` → `""`
- **Returns**: `return x` → `return undefined`

## Running Mutation Tests

### Quick Start

```bash
# Run mutation tests on all lib files
npm run test:mutation

# Run mutation tests on room loader only (faster)
npm run test:mutation:roomloader

# Run with HTML report
npm run test:mutation -- --reporters html,clear-text
```

### Configuration Files

- `stryker.config.json` - Main configuration for all lib files
- `stryker.roomloader.config.json` - Focused config for room loader

### Understanding Results

```
Mutation Score: 85.5%
├── Killed: 47 (mutants caught by tests) ✅
├── Survived: 8 (mutants not caught) ❌
├── Timeout: 2 (tests took too long) ⏱️
└── No Coverage: 3 (code not tested) 📊
```

**Score Interpretation:**
- **80%+**: Excellent test quality 🌟
- **60-80%**: Good, room for improvement ✅
- **50-60%**: Needs work ⚠️
- **<50%**: Poor test coverage ❌

## Improving Mutation Score

### Example: Surviving Mutant

**Original Code:**
```typescript
if (entries.length > 0) {
  return entries;
}
```

**Mutant (Survived):**
```typescript
if (entries.length >= 0) {  // Changed > to >=
  return entries;
}
```

**Fix: Add Test:**
```typescript
it('should handle empty entries array', () => {
  const result = processEntries([]);
  expect(result).toEqual([]);
});
```

### Common Patterns

#### 1. Boundary Testing
```typescript
// ❌ Weak Test
expect(value > 0).toBe(true);

// ✅ Strong Test
expect(value).toBeGreaterThan(0);
expect(processValue(0)).toBe(defaultValue);
expect(processValue(1)).toBe(expectedValue);
```

#### 2. Boolean Logic
```typescript
// ❌ Weak Test
expect(isValid && isActive).toBe(true);

// ✅ Strong Test
expect(isValid).toBe(true);
expect(isActive).toBe(true);
expect(process(true, false)).toBe(result1);
expect(process(false, true)).toBe(result2);
```

#### 3. String Handling
```typescript
// ❌ Weak Test
expect(result.length).toBeGreaterThan(0);

// ✅ Strong Test
expect(result).toBe('expected string');
expect(processEmpty('')).toBe('');
expect(processNull(null)).toBe('default');
```

## CI/CD Integration

Mutation tests run automatically on:
- Pull requests to `main` or `develop`
- Changes to `src/lib/**` files

### Workflow Steps:
1. Run mutation tests
2. Generate HTML report
3. Upload report as artifact
4. Comment PR with score
5. Fail if score < 55%

## Performance Tips

### 1. Incremental Mode
```json
{
  "incremental": true,
  "incrementalFile": ".stryker-tmp/incremental.json"
}
```
Only test changed files on subsequent runs.

### 2. Focus on Critical Code
```bash
# Test specific file
npx stryker run --mutate "src/lib/roomLoader.ts"

# Test specific directory
npx stryker run --mutate "src/lib/security/**/*.ts"
```

### 3. Parallel Execution
```json
{
  "maxConcurrentTestRunners": 4
}
```

## Best Practices

### 1. Set Realistic Thresholds
```json
{
  "thresholds": {
    "high": 80,    // Green zone
    "low": 60,     // Yellow zone
    "break": 50    // Red zone (fails build)
  }
}
```

### 2. Exclude Non-Critical Mutations
```json
{
  "mutator": {
    "excludedMutations": [
      "StringLiteral",    // Skip string mutations
      "ObjectLiteral",    // Skip object mutations
      "BlockStatement"    // Skip block mutations
    ]
  }
}
```

### 3. Review Surviving Mutants

1. **Check HTML report**: `reports/mutation/html/index.html`
2. **Identify survivors**: Look for red-highlighted code
3. **Analyze**: Is the mutant valid? Should it be caught?
4. **Add tests**: Write tests to kill legitimate mutants

### 4. Don't Chase 100%

Not all surviving mutants indicate poor tests:
- **Equivalent mutants**: Changes that don't affect behavior
- **Logging/UI**: Non-critical mutations
- **Error messages**: String literal changes

Focus on:
- Business logic mutations
- Boundary conditions
- Error handling paths

## Troubleshooting

### Tests Timeout
```json
{
  "timeoutMS": 60000,
  "timeoutFactor": 2
}
```

### High Memory Usage
```json
{
  "maxConcurrentTestRunners": 2
}
```

### False Positives
```json
{
  "coverageAnalysis": "perTest"  // More accurate but slower
}
```

## Example Reports

### Good Mutation Score (85%)
```
✅ 47 Killed
❌ 8 Survived
⏱️ 2 Timeout
📊 3 No Coverage

Strong tests! Most mutations caught.
```

### Poor Mutation Score (45%)
```
✅ 23 Killed
❌ 32 Survived
⏱️ 1 Timeout
📊  15 No Coverage

Weak tests. Many mutations survived.
Need more edge case testing.
```

## Integration with Coverage

Mutation testing complements code coverage:

| Coverage | Mutation Score | Quality |
|----------|---------------|---------|
| 90% | 85% | Excellent ⭐⭐⭐ |
| 90% | 45% | Shallow tests ⚠️ |
| 60% | 80% | Good but incomplete ✓ |
| 60% | 40% | Poor ❌ |

**Goal**: High coverage + High mutation score

## Resources

- [Stryker Mutator Docs](https://stryker-mutator.io/)
- [Mutation Testing Best Practices](https://stryker-mutator.io/docs/mutation-testing-elements/mutation-testing-best-practices/)
- [Vitest Runner](https://stryker-mutator.io/docs/stryker-js/vitest-runner/)

## Quick Reference

```bash
# Run all mutation tests
npm run test:mutation

# Run focused mutation tests
npm run test:mutation:roomloader

# View HTML report
open reports/mutation/html/index.html

# Run with custom config
npx stryker run --configFile custom.config.json

# Run incrementally (faster)
npx stryker run --incremental

# Clean incremental cache
rm -rf .stryker-tmp
```
