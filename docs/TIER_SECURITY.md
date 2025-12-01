# Tier-Based Access Control Security

## Overview
This document describes how subscription tiers are enforced throughout the Mercy Blade application, preventing tier spoofing and ensuring premium content protection.

---

## Core Principle: Server-Side Tier Verification

**CRITICAL RULE:** Never trust tier information from the client.

### ❌ WRONG: Client-Side Tier
```typescript
// NEVER DO THIS
const tier = localStorage.getItem('userTier'); // ❌ Can be spoofed
const tier = props.tier; // ❌ Can be manipulated
const tier = searchParams.get('tier'); // ❌ Easily spoofed
```

### ✅ CORRECT: Server-Side Tier
```typescript
// Always fetch from database
const { data: subscription } = await supabase
  .from('user_subscriptions')
  .select('subscription_tiers(name)')
  .eq('user_id', user.id)
  .eq('status', 'active')
  .maybeSingle();

const tier = normalizeTier(subscription?.subscription_tiers?.name || 'free');
```

---

## Tier Enforcement Layers

### Layer 1: Database RLS Policies

**Rooms Table:**
```sql
CREATE POLICY "Users can view rooms based on tier"
ON public.rooms
FOR SELECT
USING (
  has_role(auth.uid(), 'admin')
  OR get_user_tier_level(auth.uid()) >= get_room_tier_level(tier)
);
```

**How it works:**
- `get_user_tier_level(auth.uid())` fetches user's tier from `user_subscriptions`
- `get_room_tier_level(tier)` converts room tier to numeric (0=free, 9=vip9)
- User can only SELECT rooms where their tier >= room tier
- Admins bypass all checks

**Safety:** ✅ Database-enforced, cannot be bypassed from client

---

### Layer 2: Room Loader (Application Layer)

**Location:** `src/lib/roomLoader.ts`

```typescript
// 1. Get authenticated user (internal, not from caller)
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  throw new Error('AUTHENTICATION_REQUIRED');
}

// 2. Check admin status via RPC
const { data: isAdminRpc } = await supabase.rpc('has_role', {
  _role: 'admin',
  _user_id: user.id,
});

// 3. Get user's tier from database
const { data: subscription } = await supabase
  .from('user_subscriptions')
  .select('subscription_tiers(name)')
  .eq('user_id', user.id)
  .eq('status', 'active')
  .maybeSingle();

const userTier = normalizeTier(subscription?.subscription_tiers?.name || 'free');

// 4. Enforce access control
if (!isAdminRpc && !canUserAccessRoom(userTier, roomTier)) {
  throw new Error('ACCESS_DENIED_INSUFFICIENT_TIER');
}
```

**Key Security Features:**
- ✅ Fetches user tier from database, never trusts caller
- ✅ No `tier` parameter accepted from caller
- ✅ Admins bypass tier checks (for admin tools)
- ✅ Throws clear error on access denial

---

### Layer 3: Frontend Access Control

**Location:** `src/hooks/useUserAccess.ts`

```typescript
export const useUserAccess = (): UserAccess => {
  // Fetch user and subscription from Supabase
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('*, subscription_tiers(*)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();
    
  const tier = normalizeTier(subscription?.subscription_tiers?.name || 'free');
  
  return {
    tier,
    canAccessVIP1: canAccessVIPTier(tier, 'vip1'),
    canAccessVIP2: canAccessVIPTier(tier, 'vip2'),
    // ... etc
  };
};
```

**Purpose:** UI-level gating (hide/show upgrade buttons)

**Safety:** ⚠️ NOT SECURITY - UI only
- Only used for UX (showing upgrade prompts)
- Cannot be relied upon for security
- Backend enforcement (layers 1 & 2) is the real security

---

## Tier Normalization

**Location:** `src/lib/constants/tiers.ts`

```typescript
export function normalizeTier(rawTier: string): TierId {
  const normalized = rawTier.toLowerCase().trim();
  
  // Handle "VIP1", "vip 1", "vip_1", etc.
  const vipMatch = normalized.match(/vip\s*(\d+)/);
  if (vipMatch) {
    return `vip${vipMatch[1]}` as TierId;
  }
  
  // Default to free
  return 'free';
}
```

**Purpose:** Ensure consistent tier representation throughout app

---

## Session Expiration Handling

**Problem:** Session expires, tier reverts to 'free', user still sees premium content

**Solution:** Monitor session state changes

```typescript
// In useUserAccess or app-level
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        // Clear tier state, redirect to login
        setAccess({ ...guestAccess });
      }
    }
  );
  
  return () => subscription.unsubscribe();
}, []);
```

**What happens:**
1. Session expires (token invalid)
2. `onAuthStateChange` fires with `SIGNED_OUT`
3. Tier reset to 'free'
4. User redirected to login
5. Premium pages show "Session expired" message

---

## Edge Function Tier Enforcement

For edge functions that serve premium content:

```typescript
// Example: secure-room-loader edge function
export default async function handler(req: Request) {
  // 1. Verify JWT
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    {
      global: {
        headers: { Authorization: authHeader },
      },
    }
  );

  // 2. Get authenticated user
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 3. Get user's tier
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('subscription_tiers(name)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  const userTier = normalizeTier(subscription?.subscription_tiers?.name || 'free');

  // 4. Get room tier
  const { data: room } = await supabase
    .from('rooms')
    .select('tier')
    .eq('id', roomId)
    .single();

  const roomTier = normalizeTier(room?.tier || 'free');

  // 5. Enforce access control
  if (!canUserAccessRoom(userTier, roomTier)) {
    return new Response('Access denied', { status: 403 });
  }

  // 6. Serve content
  return new Response(roomContent, { status: 200 });
}
```

---

## Audit & Monitoring

### Tier Spoofing Detection

Log suspicious tier access patterns:

```typescript
// When access is denied
await supabase.rpc('log_security_event_v2', {
  _event_type: 'tier_access_denied',
  _severity: 'warn',
  _metadata: {
    requested_room: roomId,
    room_tier: roomTier,
    user_tier: userTier,
    ip: clientIp,
  },
});
```

### Alert on Anomalies
- User accessing VIP9 content with 'free' tier
- Multiple access denials from same user
- Tier changes without payment transactions

---

## Required Actions

### High Priority

1. ✅ **Remove any localStorage tier caching**
   - Search codebase for `localStorage.getItem('tier')`
   - Replace with server-side fetch

2. ✅ **Audit all tier checks**
   - Ensure all tier checks use `useUserAccess` or server-side fetch
   - Never trust `props.tier` or URL params

3. ✅ **Add session expiration handling**
   - Implement `onAuthStateChange` monitoring
   - Clear state and redirect on logout

4. ⚠️ **Move premium JSON files behind edge function**
   - Currently in `public/data/` (direct access possible)
   - Create `secure-room-loader` edge function
   - Enforce tier checks before serving content

---

## Testing Tier Security

### Manual Test Cases

1. **Logout Test**
   - Log in as VIP3 user
   - Open VIP3 room
   - Log out
   - Verify: Room shows "Session expired" + login prompt

2. **Tier Downgrade Test**
   - Log in as VIP3 user
   - Admin downgrades user to VIP1 (via database)
   - User refreshes page
   - Verify: VIP3 rooms show upgrade prompt

3. **Direct URL Test**
   - Log in as free user
   - Manually navigate to `/room/vip9-room-id`
   - Verify: Access denied error shown

4. **LocalStorage Spoofing Test**
   - Log in as free user
   - Open DevTools, set `localStorage.setItem('tier', 'vip9')`
   - Try accessing VIP9 room
   - Verify: Still denied (backend blocks access)

---

## Review Checklist

When adding tier-gated features:

- [ ] Tier fetched from `user_subscriptions` table
- [ ] No tier parameters accepted from client
- [ ] RLS policies enforce tier access
- [ ] Session expiration handled
- [ ] Access denials logged
- [ ] Premium content not in `public/` folder
- [ ] Edge functions validate tier before serving content
