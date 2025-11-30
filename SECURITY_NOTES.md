# Security Notes - RLS Policy Audit

This document tracks Row-Level Security (RLS) policies for critical tables in the Supabase database.

## Critical Tables

### ✅ `rooms` Table

**Current Status:** Properly secured with tiered access control

- [x] RLS enabled
- [x] SELECT: Anonymous users can view demo rooms only (is_demo = true AND tier = 'free')
- [x] SELECT: Authenticated users can view all rooms
- [x] SELECT: Users can view rooms based on their tier (enforced via `get_user_tier_level()` and `get_room_tier_level()`)
- [x] INSERT: Admin only (via `has_role(auth.uid(), 'admin')`)
- [x] UPDATE: Admin only (via `has_role(auth.uid(), 'admin')`)
- [x] DELETE: Admin only (via `has_role(auth.uid(), 'admin')`)

**Security Notes:**
- Room content is NOT directly editable by users
- Tier-based access control is enforced server-side
- Admin operations require explicit role check

---

### ✅ `user_subscriptions` Table

**Current Status:** Properly secured with owner-based access

- [x] RLS enabled
- [x] SELECT: Users can view their own subscription (`auth.uid() = user_id`)
- [x] SELECT: Admins can view all subscriptions (via `has_role(auth.uid(), 'admin')`)
- [x] INSERT: Users can insert their own subscription only (`auth.uid() = user_id`)
- [x] UPDATE: Users can update their own subscription only (`auth.uid() = user_id`)
- [x] UPDATE: Admins can update all subscriptions (via `has_role(auth.uid(), 'admin')`)
- [x] DELETE: No DELETE policy (subscriptions persist for audit trail)

**Security Notes:**
- Subscription modifications are controlled
- Payment edge functions use service role to bypass RLS (secure)
- Users cannot manipulate other users' subscriptions

---

### ✅ `profiles` Table

**Current Status:** Properly secured with privacy controls

- [x] RLS enabled
- [x] SELECT: Users can view their own profile (`auth.uid() = id`)
- [x] SELECT: Admins can view all profiles (via `has_role(auth.uid(), 'admin')`)
- [x] SELECT: VIP3 users can view other VIP3 users' public info (via `vip3_view_other_vip3_public_info` policy)
- [x] INSERT: Users can insert their own profile only (`auth.uid() = id`)
- [x] UPDATE: Users can update their own profile only (`auth.uid() = id`)
- [x] DELETE: No DELETE policy (profiles persist)

**Security Notes:**
- VIP3 cross-visibility is restricted to username/avatar only (no PII)
- Email, phone, full_name are protected from public access
- Profile creation is tied to auth.users via trigger

---

### ✅ `favorite_tracks` Table

**Current Status:** Properly secured with owner-based access

- [x] RLS enabled
- [x] SELECT: Users can view their own favorites (`auth.uid() = user_id`)
- [x] INSERT: Users can insert their own favorites (`auth.uid() = user_id`)
- [x] UPDATE: Users can update their own favorites (`auth.uid() = user_id`)
- [x] DELETE: Users can delete their own favorites (`auth.uid() = user_id`)

**Security Notes:**
- Favorites are fully user-controlled
- No cross-user visibility
- Simple owner-based access pattern

---

### ⚠️ `access_codes` Table

**Current Status:** NEEDS IMPROVEMENT - Codes are enumerable

- [x] RLS enabled
- [x] SELECT: Admins can view all codes (via `has_role(auth.uid(), 'admin')`)
- [ ] **ISSUE:** SELECT: Authenticated users can view ALL active codes (not restricted to intended user)
- [x] INSERT: Admin only (via `has_role(auth.uid(), 'admin')`)
- [x] UPDATE: Admin only (via `has_role(auth.uid(), 'admin')`)
- [x] DELETE: Admin only (via `has_role(auth.uid(), 'admin')`)

**Security Recommendation:**
```sql
-- Fix: Restrict SELECT to only show codes for the user or public codes
DROP POLICY "Authenticated users can view active codes for redemption" ON access_codes;

CREATE POLICY "Users can view their assigned codes or public codes"
ON access_codes
FOR SELECT
TO authenticated
USING (
  (is_active = true) 
  AND ((expires_at IS NULL) OR (expires_at > now()))
  AND (for_user_id IS NULL OR for_user_id = auth.uid())
);
```

---

### ✅ `payment_transactions` Table

**Current Status:** Properly secured with restricted access

- [x] RLS enabled
- [x] SELECT: Users can view their own transactions (`auth.uid() = user_id`)
- [x] SELECT: Admins can view all transactions (via `has_role(auth.uid(), 'admin')`)
- [x] INSERT: System only (via edge functions using service role)
- [x] UPDATE: No UPDATE policy (transactions are immutable)
- [x] DELETE: No DELETE policy (transactions persist for audit trail)

**Security Notes:**
- Payment data is write-once by system only
- Users cannot modify payment records
- Comprehensive audit trail maintained

---

### ✅ `feedback` Table

**Current Status:** Properly secured with owner-based access

- [x] RLS enabled
- [x] SELECT: Users can view their own feedback (`auth.uid() = user_id`)
- [x] SELECT: Admins can view all feedback (via `has_role(auth.uid(), 'admin')`)
- [x] INSERT: Users can insert their own feedback (`auth.uid() = user_id`)
- [x] UPDATE: Admins can update all feedback (via `has_role(auth.uid(), 'admin')`)
- [x] DELETE: No DELETE policy (feedback persists)

**Security Notes:**
- Users cannot view or modify other users' feedback
- Admin updates are for status/priority management only

---

## Edge Function Security Checklist

### Authentication Pattern
All edge functions MUST follow this pattern:

```typescript
import { getUserFromAuthHeader } from '../_shared/security.ts';

const user = await getUserFromAuthHeader(req);
if (!user) {
  return new Response(JSON.stringify({ error: 'Authentication required' }), {
    status: 401,
    headers: corsHeaders,
  });
}
```

### Admin Operations Pattern
All admin operations MUST check role server-side:

```typescript
import { assertAdmin } from '../_shared/security.ts';

await assertAdmin(user.id); // Throws 403 if not admin
```

### Input Validation Pattern
All edge functions MUST validate input:

```typescript
import { safeParseBody, ChatMessageSchema } from '../../src/lib/api/validation.ts';

const data = safeParseBody(ChatMessageSchema, await req.json());
// Use validated data.roomId, data.content
```

---

## Security Definer Functions

All SECURITY DEFINER functions MUST have explicit `SET search_path = public`:

- [x] `has_role()` - ✅ Has search_path
- [x] `get_user_tier_level()` - ✅ Has search_path
- [x] `check_usage_limit()` - ✅ Has search_path
- [x] `is_user_blocked()` - ✅ Has search_path
- [x] `check_rate_limit()` - ✅ Has search_path
- [ ] `update_kids_updated_at_column()` - ⚠️ Missing search_path
- [ ] `update_app_settings_updated_at()` - ⚠️ Missing search_path

**Action Required:** Add `SET search_path = public` to the two functions above.

---

## Manual Security Configuration

- [ ] **CRITICAL:** Enable "Leaked Password Protection" in Lovable Cloud
  - Navigate to: Lovable Cloud → Authentication → Password Settings
  - Toggle ON: "Leaked Password Protection"
  - This prevents users from using passwords found in breach databases

---

## Last Updated
**Date:** 2025-01-30  
**Reviewed By:** Security audit script  
**Next Review:** After any schema changes or new edge function deployments
