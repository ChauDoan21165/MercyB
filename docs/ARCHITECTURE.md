# Mercy Blade Architecture

## Overview

Mercy Blade is a React-based web application built with Vite, TypeScript, and Tailwind CSS. The app provides tiered English learning content with strict access control, room-based learning experiences, and comprehensive admin tooling.

## Core Principles

1. **Single Source of Truth**: All critical logic flows through canonical modules
2. **Strict Validation**: Zero-tolerance for data inconsistencies in production
3. **Tier-Based Access**: Hierarchical permission system for content gating
4. **JSON-First Architecture**: Room content lives in JSON files, synced to database

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with semantic token system
- **Backend**: Supabase (Lovable Cloud)
  - Database: PostgreSQL with RLS policies
  - Storage: Supabase Storage for audio files
  - Auth: Supabase Auth with tier-based roles
  - Edge Functions: Serverless functions for payments, AI, etc.
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Testing**: Vitest + Playwright

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── admin/          # Admin-only components
│   │   └── health/     # Health check sub-components
│   └── layout/         # Layout components
├── pages/              # Route pages
│   ├── admin/          # Admin pages (role-protected)
│   └── [tier]/         # Tier-specific room grids
├── hooks/              # Custom React hooks
├── lib/                # Core business logic
│   ├── constants/      # Constants and enums
│   ├── validation/     # Validation modules
│   ├── api/           # API client wrappers
│   └── __tests__/     # Unit tests
├── integrations/       # External integrations
│   └── supabase/      # Supabase client & types
└── styles/            # Global styles

supabase/
├── functions/         # Edge functions
│   └── _shared/      # Shared utilities
└── migrations/       # Database migrations
```

## Key Modules

### 1. Room Loading System

**Location**: `src/lib/roomLoader.ts`, `src/lib/roomJsonResolver.ts`

**Purpose**: Load room data from JSON files with strict validation

**Flow**:
1. User requests room by ID
2. `loadMergedRoom()` authenticates user and checks tier
3. `resolveRoomJsonPath()` finds canonical JSON file
4. `validateRoomJson()` validates structure (strict by default)
5. Room data merged with database entries
6. Access control enforced via `canUserAccessRoom()`

**Validation Modes**:
- **Strict** (production): 2-8 entries, audio required, bilingual required
- **Preview**: 1-15 entries, audio optional, bilingual required
- **WIP**: 1-20 entries, audio optional, bilingual optional

### 2. Access Control System

**Location**: `src/lib/accessControl.ts`

**Purpose**: Enforce tier-based permissions

**Tier Hierarchy**:
```
free (1) → vip1 (2) → vip2 (3) → vip3 (4) → vip3ii (4.5) → 
vip4 (5) → vip5 (6) → vip6 (7) → vip9 (10)

Kids tiers: kids_1 (2), kids_2 (3), kids_3 (4)
```

**Key Functions**:
- `canUserAccessRoom(userTier, roomTier)`: Check if user can access specific room
- `canAccessVIPTier(userTier, targetTier)`: Check if user can access tier level
- `getAccessibleTiers(userTier)`: Get all tiers user can access

**Testing**: Validated via `ACCESS_TEST_MATRIX` with 16+ test cases

### 3. Admin Health Check System

**Location**: `src/pages/admin/UnifiedHealthCheck.tsx` (refactored into components)

**Components**:
- **RoomHealthSummary**: Live sync stats dashboard
- **TierFilterBar**: Tier selection and filtering
- **RoomIssuesTable**: Detailed issue reporting
- **AudioCoveragePanel**: Audio file validation
- **DeepScanPanel**: Deep validation per room

**Features**:
- Quick scan: Manifest vs database comparison
- Deep scan: Full JSON + audio + entry validation
- Bulk fixes: Audio paths, keywords, entries
- Phantom room detection with dual-safety filtering

### 4. Payment System

**Location**: `supabase/functions/paypal-payment/`, `supabase/functions/usdt-payment/`

**Flow**:
1. User selects tier and payment method
2. Frontend calls create-order edge function
3. Edge function generates PayPal/USDT order
4. User completes payment externally
5. Webhook/capture edge function validates payment
6. Edge function creates/updates `user_subscriptions` row
7. Frontend refetches user access state

**Security**:
- Idempotency checks via `external_reference`
- Rate limiting (10 creates/5min, 20 captures/5min)
- Audit logging for all payment events
- RLS policies prevent unauthorized access

### 5. User Access Hook

**Location**: `src/hooks/useUserAccess.ts`

**Purpose**: Central hook for user tier and permissions

**Returns**:
```typescript
{
  isAdmin: boolean,
  isAuthenticated: boolean,
  isDemoMode: boolean,
  tier: TierId,
  canAccessVIP1: boolean,
  canAccessVIP2: boolean,
  // ... through VIP9
  loading: boolean
}
```

**Usage**: All tier-protected pages must use this hook

## Data Flow

### Room Loading Flow

```
User requests /room/:roomId
  ↓
ChatHub component mounts
  ↓
loadMergedRoom(roomId) called
  ↓
Fetch user from Supabase Auth
  ↓
Get user tier from user_subscriptions
  ↓
Fetch room tier from database
  ↓
canUserAccessRoom(userTier, roomTier)?
  ↓ YES                    ↓ NO
Load JSON via resolver   Show access denied message
  ↓
Merge with DB entries
  ↓
Render room content
```

### Authentication Flow

```
User logs in
  ↓
Supabase Auth creates session
  ↓
useUserAccess() hook fetches:
  - User profile
  - Active subscription
  - Admin role via has_role() RPC
  ↓
Hook returns tier + permissions
  ↓
Components use permissions to gate content
```

## Security Layers

### 1. Frontend Access Control
- Components check `useUserAccess()` before rendering
- Early return or redirect for unauthorized users
- Soft messaging for non-VIPs ("upgrade to access")

### 2. Backend RLS Policies
- Row-Level Security on all tables
- Policies enforce user_id matching
- Admin-only policies for sensitive operations

### 3. Edge Function Auth
- All edge functions check `Authorization` header
- `getUserFromAuthHeader()` validates JWT
- `assertAdmin()` for admin-only endpoints
- Rate limiting via `checkEndpointRateLimit()`

### 4. Content Protection
- JSON files blocked in production (vercel.json, netlify.toml)
- Audio files served with signed URLs
- No direct file access without authentication

## Testing Strategy

### Unit Tests
- `src/lib/__tests__/accessControl.test.ts`: Access control matrix
- `src/lib/__tests__/roomJsonValidation.test.ts`: Validation modes
- Coverage for critical business logic

### Integration Tests
- Playwright tests for critical user flows
- Payment flow simulation
- Room access gating

### Manual Testing Checklist
- See `LAUNCH_HUMAN_CHECKLIST.md` for pre-launch tests
- Payment verification on iOS/Android
- Audio storage scan
- Empty room cleanup

## Performance Considerations

### Bundle Size
- Component code-splitting via React.lazy()
- Defer non-critical imports
- Optimize UnifiedHealthCheck (split into smaller components)

### Data Loading
- React Query for caching and deduplication
- Batch room queries where possible
- Lazy load room entries (load on-demand)

### Audio Delivery
- Progressive audio loading
- Signed URLs cached for 1 hour
- Preload next entry audio

## Common Patterns

### Protected Routes
```typescript
import { AdminRoute } from '@/components/AdminRoute';

<Route path="/admin/dashboard" element={
  <AdminRoute>
    <AdminDashboard />
  </AdminRoute>
} />
```

### Tier-Based Rendering
```typescript
const { canAccessVIP3, isAdmin } = useUserAccess();
const hasAccess = canAccessVIP3 || isAdmin;

if (!hasAccess) {
  return <UpgradeMessage tier="vip3" />;
}

return <VIP3Content />;
```

### Edge Function Security
```typescript
import { getUserFromAuthHeader, checkEndpointRateLimit, logAudit } from '../_shared/security.ts';

const user = await getUserFromAuthHeader(req);
await checkEndpointRateLimit('endpoint-name', user.id);

// ... business logic

await logAudit('action_name', user.id, metadata);
```

## Known Technical Debt

1. **UnifiedHealthCheck**: 3.6k lines, needs full component split (in progress)
2. **JSON validation**: Strict rules block WIP previews (fixed with validation modes)
3. **VIP page gating**: Some pages show too much structure before gating (fixed for VIP2/VIP3)
4. **Test coverage**: Core modules tested, need more edge cases
5. **Bundle size**: Consider lazy loading more admin components

## Future Improvements

1. **Implement server-side rendering** for SEO
2. **Add end-to-end encryption** for private messages
3. **Implement progressive web app** for offline support
4. **Add Redis caching layer** for frequently accessed rooms
5. **Implement CDN** for audio file delivery
6. **Add telemetry** for error tracking (Sentry)

## Contributing

See `SETUP.md` for development environment setup.

## Deployment

- **Production**: Deployed to Vercel/Netlify
- **Backend**: Supabase Lovable Cloud
- **Database**: PostgreSQL via Supabase
- **CDN**: Cloudflare (optional for assets)

## Support

For questions or issues, contact the development team or refer to project documentation in `/docs`.
