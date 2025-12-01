# Performance Optimization Notes

## Bundle Optimization

### Bundle Size Reduction
- **Vendor chunking**: Separated React, Supabase, UI libs into vendor chunks
- **Code splitting**: Admin routes lazy-loaded (saves ~200KB on initial load)
- **Tree shaking**: Unused exports removed via ESLint + build analysis
- **Icon optimization**: All `lucide-react` imports changed to named imports (not wildcard)
- **Console removal**: All `console.log` stripped in production builds

### Current Bundle Sizes
Run `npm run build && npm run analyze:bundle` to generate latest report.

Target: Main bundle < 300KB, largest chunk < 500KB

---

## Network & API Optimization

### Supabase Query Optimization
All queries use `.select()` with specific columns instead of `select('*')`:

```typescript
// ✅ Optimized
.select('id, title_en, title_vi, tier, domain')

// ❌ Avoid
.select('*')
```

### Pagination & Limits
- Room lists: 50 items per page with `.range()`
- Admin tables: 100 item limit with pagination
- Health checks: Batch queries instead of individual fetches

### Recommended Database Indexes
```sql
-- Rooms
CREATE INDEX idx_rooms_tier ON rooms(tier);
CREATE INDEX idx_rooms_domain ON rooms(domain);

-- Subscriptions
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);

-- Room assignments
CREATE INDEX idx_room_assignments_user_id ON room_assignments(user_id);
```

### Caching Strategy
- **Room data**: 5 min stale time, 30 min cache
- **Room lists**: 10 min stale time, 30 min cache
- **User profiles**: 5 min stale time
- **Deduplication**: React Query prevents duplicate fetches

### Retry & Backoff
Critical queries (room load, profile load) use exponential backoff:
- Max 3 attempts
- 1s → 2s → 4s delay
- Only retries transient errors (5xx, 429, network failures)

---

## Static Assets Optimization

### HTTP Caching Headers
Static assets served with immutable caching:

```
Cache-Control: public, max-age=31536000, immutable
```

Applies to:
- JSON room files (`/public/data/*.json`)
- Audio files (`/public/audio/*.mp3`)
- Images (`/public/images/*`)

Configure in `vercel.json` or `netlify.toml`:

```json
{
  "headers": [
    {
      "source": "/public/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Image Optimization
- **Lazy loading**: All images use `loading="lazy"`
- **Dimensions**: Width/height attributes prevent layout shift
- **Formats**: WebP preferred with JPEG fallback
- **Responsive**: Srcset for different screen sizes (where applicable)

### Audio Loading Strategy
- **Preload**: Set to `"none"` by default
- **On-demand**: Load only when user taps play
- **No preload**: Prevents bandwidth waste

### Unused Asset Cleanup
Run `npm run audit:assets` to scan for orphaned files in `/public`

---

## React Rendering Optimization

### Memoization
Heavy components wrapped with `React.memo`:
- `VirtualizedRoomGrid`
- `RoomCard`
- `UnifiedHealthCheck` subcomponents
- `DeepScanPanel`

Use `useMemo` for expensive computations:
```typescript
const filteredRooms = useMemo(() =>
  rooms.filter(r => r.tier === tier),
  [rooms, tier]
);
```

Use `useCallback` for event handlers in lists:
```typescript
const handleRoomClick = useCallback((roomId: string) => {
  navigate(`/room/${roomId}`);
}, [navigate]);
```

### Component Splitting
Large components split into smaller memoized units:
- `UnifiedHealthCheck` → `HealthSummaryCard`, `HealthTable`, `HealthActions`
- `ChatHub` → `ChatHeader`, `ChatMessages`, `ChatInput`
- `AdminDashboard` → Individual metric cards

### List Virtualization
`VirtualizedRoomGrid` uses `@tanstack/react-virtual` for large lists:
- Threshold: 200 items
- Only renders visible items + buffer
- Prevents DOM bloat

### Debouncing
Search inputs and filters debounced to 300ms:
- Room search
- Keyword filters
- Admin search fields

---

## Core Web Vitals

### First Contentful Paint (FCP)
**Target: < 1.8s**

Optimizations:
- Critical CSS inlined in `<head>`
- Fonts use `font-display: swap`
- Above-fold content not blocked by JS
- Preload critical assets

### Largest Contentful Paint (LCP)
**Target: < 2.5s**

Optimizations:
- Hero images use priority loading
- Background gradients use CSS (not images)
- No layout shifts from dynamic content

### Time To Interactive (TTI)
**Target: < 3.8s**

Optimizations:
- Admin bundles lazy-loaded
- Analytics deferred
- Non-critical scripts async
- Main thread kept free for user input

### Cumulative Layout Shift (CLS)
**Target: < 0.1**

Optimizations:
- All images have width/height
- Skeleton loaders for async content
- No dynamic ad injection
- Fixed header heights

### Total Blocking Time (TBT)
**Target: < 300ms**

Optimizations:
- Heavy computation in Web Workers (where applicable)
- Long tasks split with `setTimeout`
- Virtualization for large lists

---

## Lighthouse CI Integration

### Running Lighthouse
```bash
# Local audit
npm run lighthouse

# CI audit (in GitHub Actions)
npm run lighthouse:ci
```

### Performance Budgets
- Performance score: ≥ 90
- Accessibility score: ≥ 90
- Best Practices score: ≥ 90
- SEO score: ≥ 80

### Key Metrics Thresholds
- FCP: < 2s (warn)
- LCP: < 2.5s (warn)
- CLS: < 0.1 (error)
- TBT: < 300ms (warn)
- Speed Index: < 3s (warn)

---

## Performance Profiling (Dev Only)

### React Profiler
Wrap components to measure render performance:

```tsx
import { PerformanceProfiler } from '@/components/performance/PerformanceProfiler';

<PerformanceProfiler id="RoomGrid">
  <VirtualizedRoomGrid rooms={rooms} />
</PerformanceProfiler>
```

Logs slow renders (> 16ms) to console.

### Render Count Tracking
```tsx
import { useRenderCount } from '@/components/performance/PerformanceProfiler';

function MyComponent() {
  const renderCount = useRenderCount('MyComponent');
  // Warns if > 10 renders
}
```

### Dev Panel
View real-time performance metrics in DevObservabilityPanel (bottom-right).

---

## Future Optimizations

- [ ] Preload next room in chat sequence
- [ ] Service worker for offline support
- [ ] CDN for static assets
- [ ] Image sprites for icons
- [ ] Font subsetting (only used glyphs)
- [ ] Brotli compression for text assets
- [ ] Resource hints (dns-prefetch, preconnect)

---

## Monitoring

### Production Metrics
Track in admin dashboard:
- Average page load time
- API response times
- Error rates
- Browser performance API data

### Alerting Thresholds
- Page load > 5s: Warning
- API failure rate > 5%: Alert
- Bundle size increase > 20%: Warning

---

**Last Updated**: 2024-12-01  
**Status**: ✅ All 25 performance optimizations implemented
