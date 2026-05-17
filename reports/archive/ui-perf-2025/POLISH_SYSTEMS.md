# Polish Systems Infrastructure

Foundational systems implementing the 50 parallel polish prompts for production-ready quality.

## 🎯 Core Systems

### 1. Unified Logger (`src/lib/logger.ts`)
**Replaces all console.log/warn/error**

```typescript
import { logger } from '@/lib/logger';

// Replace console.log with:
logger.info('Room loaded', { roomId, tier });

// Replace console.warn with:
logger.warn('Slow render detected', { component, duration });

// Replace console.error with:
logger.error('Failed to load audio', { error, audioPath });
```

**Features:**
- Auto-logs to database in production (errors/warnings only)
- Adds context (route, userId, timestamp)
- Performance tracking helpers
- Auth/payment event logging

**Debug access:**
```javascript
window.__MB_LOGGER // Access logger in console
```

---

### 2. Page Transitions (`src/components/PageTransition.tsx`)
**Smooth fade-in + slide-up animations**

```tsx
import { PageTransition } from '@/components/PageTransition';

function VIP3Page() {
  return (
    <PageTransition>
      <YourContent />
    </PageTransition>
  );
}
```

**Variants:**
- `<PageTransition>` - Fade + slide-up (300ms)
- `<PageFade>` - Fade only (200ms)

---

### 3. Accessibility Utilities (`src/lib/accessibility.ts`)

#### Focus Trap (for modals)
```tsx
import { useFocusTrap, useEscapeKey } from '@/lib/accessibility';

function Modal({ isOpen, onClose }) {
  const containerRef = useFocusTrap(isOpen);
  useEscapeKey(onClose, isOpen);

  return (
    <div ref={containerRef}>
      {/* Modal content */}
    </div>
  );
}
```

#### Screen Reader Announcements
```typescript
import { announceToScreenReader } from '@/lib/accessibility';

// Announce success
announceToScreenReader('Room loaded successfully', 'polite');

// Announce error
announceToScreenReader('Failed to load room', 'assertive');
```

#### Debounce Hook
```tsx
import { useDebounce } from '@/lib/accessibility';

function SearchBar() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    // API call with debouncedSearch
  }, [debouncedSearch]);
}
```

#### Click Guard (prevent double-submit)
```tsx
import { useClickGuard } from '@/lib/accessibility';

function SubmitButton() {
  const { guardedClick, isProcessing } = useClickGuard(1000);

  return (
    <button 
      onClick={guardedClick(async () => {
        await submitForm();
      })}
      disabled={isProcessing}
    >
      Submit
    </button>
  );
}
```

---

### 4. Retry Button (`src/components/ui/retry-button.tsx`)
**Standardized retry with timeout protection**

```tsx
import { RetryButton } from '@/components/ui/retry-button';

function ErrorState() {
  return (
    <div>
      <p>Failed to load room</p>
      <RetryButton 
        onRetry={() => loadRoom(roomId)}
        text="Try Again"
      />
    </div>
  );
}
```

**Features:**
- 8s timeout protection
- Loading state with spinner
- Accessible ARIA labels

---

### 5. Performance Monitor (`src/lib/performance/monitor.ts`)
**FPS tracking, render times, network timing**

```typescript
import { performanceMonitor } from '@/lib/performance/monitor';

// Log events
performanceMonitor.logEvent('room_loaded', { roomId, tier });
performanceMonitor.logEvent('audio_played', { trackId });

// Measure network calls
await performanceMonitor.measureNetwork(
  '/api/room',
  () => fetch('/api/room')
);

// Get metrics
const metrics = performanceMonitor.getMetrics();
console.log('FPS:', metrics.fps);
console.log('Memory:', metrics.memoryUsage);
```

**Debug access:**
```javascript
window.__MB_PERF.getMetrics() // Current metrics
window.__MB_LOG.events()      // Event log
window.__MB_LOG.metrics()     // Full metrics
```

**Auto-starts in development** - monitors FPS continuously

---

### 6. Shimmer Skeleton (`src/components/ui/shimmer-skeleton.tsx`)
**Enhanced loading skeletons with shimmer effect**

```tsx
import { 
  ShimmerSkeleton, 
  RoomCardShimmer, 
  ChatMessageShimmer,
  RoomGridShimmer 
} from '@/components/ui/shimmer-skeleton';

// Basic skeleton
<ShimmerSkeleton variant="text" width="80%" />
<ShimmerSkeleton variant="circular" width={40} height={40} />

// Pre-built components
<RoomCardShimmer />
<ChatMessageShimmer />
<RoomGridShimmer count={6} />
```

---

### 7. Session Manager (`src/lib/session-manager.ts`)
**Auto-refresh Supabase session before expiry**

**Auto-starts on import** - refreshes 2 minutes before expiry

```typescript
import { sessionManager } from '@/lib/session-manager';

// Force immediate renewal
await sessionManager.forceRenewal();

// Stop auto-renewal (if needed)
sessionManager.stopAutoRenewal();
```

**Debug access:**
```javascript
window.__MB_SESSION.forceRenewal() // Manual refresh
```

---

## 🚀 Integration Checklist

### ✅ Already Integrated
- [x] Logger system (ready to use)
- [x] Session auto-renewal (auto-starts in main.tsx)
- [x] Performance monitoring (auto-starts in dev mode)
- [x] Shimmer animations (keyframes added to Tailwind)

### 🔧 To Integrate

#### Replace console.log everywhere
```bash
# Find all console usage
grep -r "console\." src/
```

Replace with logger:
```typescript
// Before
console.log('Room loaded', roomId);

// After
logger.info('Room loaded', { roomId });
```

#### Add PageTransition to routes
```tsx
// In App.tsx or route components
import { PageTransition } from '@/components/PageTransition';

<Route path="/vip3" element={
  <PageTransition>
    <VIP3Page />
  </PageTransition>
} />
```

#### Add focus traps to modals
```tsx
// In Profile modal, Settings modal, etc.
const containerRef = useFocusTrap(isOpen);
useEscapeKey(onClose, isOpen);

<Dialog ref={containerRef}>
  {/* content */}
</Dialog>
```

#### Replace old skeletons with shimmer
```tsx
// Before
<Skeleton className="h-4 w-full" />

// After
<ShimmerSkeleton variant="text" width="100%" />
```

#### Add retry buttons to error states
```tsx
// In RoomErrorState, ChatHub errors, etc.
<RetryButton onRetry={() => refetch()} />
```

---

## 📊 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| FPS | 60 | Monitored ✅ |
| First Contentful Paint | < 1.5s | - |
| Time to Interactive | < 3s | - |
| Room Load Time | < 800ms | - |

---

## 🎨 Design System Alignment

All components use semantic tokens from:
- `src/index.css` (CSS variables)
- `tailwind.config.ts` (Tailwind theme)

**Never use direct colors** - always use tokens:
```tsx
// ❌ Wrong
<div className="bg-white text-black" />

// ✅ Correct
<div className="bg-background text-foreground" />
```

---

## 🧪 Testing

### Unit Tests (future)
```typescript
// Test logger
expect(logger.info).toHaveBeenCalledWith('message', { context });

// Test accessibility
expect(useFocusTrap).toTrapFocusInContainer();

// Test performance
expect(performanceMonitor.getFps()).toBeGreaterThan(30);
```

### Manual Testing
1. Open DevTools
2. Check `window.__MB_LOGGER` for logs
3. Check `window.__MB_PERF` for metrics
4. Check `window.__MB_LOG.events()` for event history

---

## 🔍 Debugging

### Logger
```javascript
window.__MB_LOGGER.info('test', { data: 'test' })
window.__MB_RESTORE_CONSOLE() // Restore original console
```

### Performance
```javascript
window.__MB_PERF.getMetrics()
window.__MB_PERF.getFps()
window.__MB_LOG.events()
```

### Session
```javascript
window.__MB_SESSION.forceRenewal()
```

---

## 📦 Dependencies Added

All dependencies already installed:
- `framer-motion` (animations)
- `lucide-react` (icons)

---

## 🎯 Next Steps

1. **Replace all console.log** → Use logger
2. **Add PageTransition** → Wrap route components
3. **Add focus traps** → Modal components
4. **Replace skeletons** → Use shimmer variants
5. **Add retry buttons** → Error states
6. **Monitor performance** → Use __MB_PERF in dev

---

## 📚 Additional Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Performance Best Practices](https://web.dev/performance/)

---

Built with ❤️ for Mercy Blade production launch.
