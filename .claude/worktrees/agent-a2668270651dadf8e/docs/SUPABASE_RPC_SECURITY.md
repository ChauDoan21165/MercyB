# Supabase RPC Security Documentation

## Overview
This document describes the security model for all Supabase RPC (Remote Procedure Call) functions used in the Mercy Blade application.

## Core Security Principles

1. **Never trust client-supplied user IDs**
   - All RPCs that need a user ID should use `auth.uid()` internally
   - If a `_user_id` parameter is accepted, it must be validated against `auth.uid()`

2. **Use SECURITY DEFINER carefully**
   - Functions marked as `SECURITY DEFINER` run with the privileges of the function creator
   - Always set `search_path = public` to prevent schema injection
   - Document why SECURITY DEFINER is needed

3. **Validate all inputs**
   - Use type checking and constraints in function signatures
   - Reject invalid or malicious inputs early

---

## RPC Function Inventory

### 1. `has_role(_user_id uuid, _role app_role)`

**Purpose:** Check if a user has a specific role

**Security Model:**
- `SECURITY DEFINER` to bypass RLS on `user_roles` table (prevents infinite recursion)
- `SET search_path = public` to prevent schema injection attacks
- `STABLE` marking for query optimization
- Accepts `_user_id` parameter but validates it against caller's actual role

**Usage:**
```sql
SELECT has_role(auth.uid(), 'admin');
```

**Safety:** ✅ SAFE
- The function checks the `user_roles` table which is admin-controlled
- Using SECURITY DEFINER here is correct to avoid RLS recursion
- Client cannot spoof roles because the data source (user_roles table) is protected

---

### 2. `get_user_tier_level(user_uuid uuid)`

**Purpose:** Get numeric tier level for a user (0=free, 9=vip9)

**Security Model:**
- `SECURITY DEFINER` with `SET search_path = public`
- Queries `user_subscriptions` and `subscription_tiers` tables
- Returns display_order as tier level

**Usage:**
```sql
SELECT get_user_tier_level(auth.uid());
```

**Safety:** ✅ SAFE
- Only returns numeric tier level, no sensitive data
- Cannot be abused to access other users' data
- Used in tier-based access control policies

---

### 3. `get_room_tier_level(tier_name text)`

**Purpose:** Convert tier name to numeric level

**Security Model:**
- `IMMUTABLE` function (pure function, no side effects)
- No database access, pure string-to-number mapping
- Case-insensitive tier name matching

**Usage:**
```sql
SELECT get_room_tier_level('vip3');
```

**Safety:** ✅ SAFE
- No database access or user data involved
- Pure utility function for tier comparison

---

### 4. `check_usage_limit(user_uuid uuid, limit_type text)`

**Purpose:** Check if user has exceeded daily room access or custom topic limits

**Security Model:**
- `SECURITY DEFINER` with `SET search_path = public`
- Queries user's subscription tier and usage
- Returns boolean indicating if limit is exceeded

**Usage:**
```sql
SELECT check_usage_limit(auth.uid(), 'rooms');
```

**Safety:** ⚠️ NEEDS REVIEW
- **Issue:** Accepts `user_uuid` parameter without validation
- **Risk:** Client could pass arbitrary user IDs to check other users' limits
- **Fix needed:** Add validation `IF user_uuid != auth.uid() THEN RAISE EXCEPTION`

---

### 5. `award_points(_user_id uuid, _points integer, _transaction_type text, ...)`

**Purpose:** Award points to a user

**Security Model:**
- `SECURITY DEFINER` with `SET search_path = public`
- Inserts into `point_transactions` and updates `user_points`

**Usage:**
```sql
SELECT award_points(auth.uid(), 10, 'room_completed', 'Completed VIP3 room', 'room_id');
```

**Safety:** ⚠️ NEEDS REVIEW
- **Issue:** Accepts `_user_id` without validation
- **Risk:** Malicious user could award points to themselves or others
- **Fix needed:** Add validation or restrict to admin-only calls

---

### 6. `validate_promo_code(code_input text)`

**Purpose:** Validate and return promo code details

**Security Model:**
- `SECURITY DEFINER` with `SET search_path = public`
- Checks code validity and redemption status

**Safety:** ✅ SAFE
- Only returns code details if valid and not already redeemed by user
- Uses `auth.uid()` internally to check redemption status

---

### 7. `log_security_event_v2(...)`

**Purpose:** Log security events for audit trail

**Security Model:**
- `SECURITY DEFINER` with `SET search_path = public`
- Inserts into `security_events` table
- Uses `COALESCE(_user_id, auth.uid())` for user ID

**Safety:** ✅ SAFE
- Defaults to authenticated user ID if not provided
- Used for security monitoring and audit trails

---

## Required Actions

### High Priority Fixes

1. **Fix `check_usage_limit`**
   ```sql
   CREATE OR REPLACE FUNCTION public.check_usage_limit(
     user_uuid uuid,
     limit_type text
   )
   RETURNS boolean
   LANGUAGE plpgsql
   STABLE SECURITY DEFINER
   SET search_path = public
   AS $$
   BEGIN
     -- SECURITY: Only allow checking own limits
     IF user_uuid != auth.uid() AND NOT has_role(auth.uid(), 'admin') THEN
       RAISE EXCEPTION 'ACCESS_DENIED: Cannot check other users limits';
     END IF;
     
     -- ... existing logic ...
   END;
   $$;
   ```

2. **Fix `award_points`**
   ```sql
   CREATE OR REPLACE FUNCTION public.award_points(
     _user_id uuid,
     _points integer,
     _transaction_type text,
     _description text DEFAULT NULL,
     _room_id text DEFAULT NULL
   )
   RETURNS void
   LANGUAGE plpgsql
   SECURITY DEFINER
   SET search_path = public
   AS $$
   BEGIN
     -- SECURITY: Only allow awarding points to self or admin-initiated
     IF _user_id != auth.uid() AND NOT has_role(auth.uid(), 'admin') THEN
       RAISE EXCEPTION 'ACCESS_DENIED: Cannot award points to other users';
     END IF;
     
     -- ... existing logic ...
   END;
   $$;
   ```

---

## Best Practices for Future RPCs

1. ✅ **Always validate user_id parameters**
   ```sql
   IF provided_user_id != auth.uid() AND NOT has_role(auth.uid(), 'admin') THEN
     RAISE EXCEPTION 'ACCESS_DENIED';
   END IF;
   ```

2. ✅ **Use SECURITY DEFINER only when necessary**
   - Avoid using it for simple queries that RLS can handle
   - Document why SECURITY DEFINER is required

3. ✅ **Always set search_path**
   ```sql
   SET search_path = public
   ```

4. ✅ **Return minimal data**
   - Only return data the calling user should see
   - Never return sensitive data from other users

5. ✅ **Log security-relevant events**
   ```sql
   PERFORM log_security_event_v2('rpc_called', 'info', auth.uid(), ...);
   ```

---

## Security Review Checklist

When adding or modifying an RPC function:

- [ ] Does it validate user_id parameters?
- [ ] Does it use SECURITY DEFINER appropriately?
- [ ] Does it have `SET search_path = public`?
- [ ] Does it return only authorized data?
- [ ] Does it log security events when appropriate?
- [ ] Is it marked with correct volatility (`STABLE`, `IMMUTABLE`, `VOLATILE`)?
- [ ] Has it been tested for privilege escalation?
