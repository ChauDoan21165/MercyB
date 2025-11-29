# 🚀 Mercy Blade Launch Checklist (Engineering + UX)

## Status Legend
- ✅ PASS - Working correctly
- ⚠️ NEEDS ATTENTION - Requires fixes
- 🔍 TESTING - Currently being validated
- ⏳ PENDING - Not yet tested

---

## 1. Onboarding Flow

### First-Time User Path
- ⏳ Landing on homepage (unauthenticated)
- ⏳ Sign up flow (email validation, password requirements)
- ⏳ First login experience
- ⏳ Tier selection/purchase flow
- ⏳ First room access
- ⏳ Audio playback tutorial/hint

### Auth Edge Cases
- ⏳ Logout → Login persistence
- ⏳ Session timeout handling
- ⏳ Invalid credentials error messages
- ⏳ Password reset flow
- ⏳ Redirect after login (preserves intended destination)

### Kids Mode Isolation
- ⏳ Kids English access control
- ⏳ Kids room separate navigation
- ⏳ Age-appropriate content filtering

---

## 2. Empty States

### User-Facing
- ⏳ No active subscription → Clear CTA to upgrade
- ⏳ No rooms available for current tier → Upgrade prompt
- ⏳ No audio files loaded → Loading skeleton or error message
- ⏳ Search returns zero results → Helpful message
- ⏳ Favorites list empty → Add favorites prompt

### Admin-Facing
- ⏳ Admin dashboard with zero users → Placeholder state
- ⏳ Room Health Check with no issues → Success message
- ⏳ Payment dashboard with no transactions → Empty state
- ⏳ Feedback inbox empty → Zero-state message

---

## 3. Broken Link Scan

### Internal Routes (User-Facing)
- ⏳ Homepage `/`
- ⏳ Free tier `/free`
- ⏳ VIP1-VIP9 tier pages `/vip1` through `/vip9`
- ⏳ Room detail pages `/chat/:roomId`
- ⏳ Tier Map `/tier-map`
- ⏳ English Pathway `/english-pathway`
- ⏳ Profile/Settings page
- ✅ Terms `/terms`
- ✅ Privacy `/privacy`
- ✅ Refund `/refund`
- ✅ 404 Page → Improved with bilingual message + Link component

### Admin Routes
- ⏳ Admin dashboard `/admin`
- ⏳ Room Health Check `/admin/health`
- ⏳ Payment verification `/admin/payment-verification`
- ⏳ Payment monitoring `/admin/payment-monitoring`
- ⏳ User management `/admin/users`
- ⏳ Feedback analytics `/admin/feedback-analytics`

### Navigation Components
- ⏳ Back button functionality
- ⏳ Home button (permanent, top-left)
- ⏳ Tier navigation from search
- ⏳ Room navigation from tier pages
- ⏳ Breadcrumb navigation (if applicable)

---

## 4. Offline & Slow Network UX

### Audio Streaming
- ⏳ Audio fails to load → Retry button + error message
- ⏳ Audio buffering indicator
- ⏳ Offline audio caching (if implemented)
- ⏳ Audio playback interruption handling

### Payment Flows
- ⏳ PayPal SDK load timeout → Fallback message
- ⏳ Payment webhook delay → Pending state UI
- ⏳ Network error during checkout → Retry logic

### Room Loading
- ⏳ Skeleton screens while loading rooms
- ⏳ Timeout handling for slow database queries
- ⏳ Graceful degradation if room data incomplete

### General Network Resilience
- ✅ Offline detection → Shows banner when user goes offline/online
- ⏳ Supabase connection timeout → Retry + error message
- ⏳ Edge function failures → Fallback or clear error
- ⏳ Image loading failures → Placeholder images

---

## 5. Admin Panel Critical Checks

### Gift Code Management
- ⏳ Create access code → Verify code generation
- ⏳ Assign code to user → Test tier upgrade
- ⏳ Code expiration handling
- ⏳ Max uses enforcement

### User Role Management
- ⏳ Assign admin role → Verify admin access
- ⏳ Remove admin role → Verify access revocation
- ⏳ User tier manual override → Verify tier change

### Payment Review
- ⏳ View pending payment proofs
- ⏳ Approve payment → Verify tier upgrade
- ⏳ Reject payment → Verify notification to user
- ⏳ Payment transaction logs readable

### Moderation
- ⏳ View user feedback
- ⏳ Mark feedback as resolved
- ⏳ Block/suspend user → Verify access restriction
- ⏳ Moderation logs accessible

### Error Monitoring
- ⏳ Edge function logs viewable
- ⏳ Security event logs accessible
- ⏳ Rate limit logs visible
- ⏳ Failed login attempts tracked

---

## 6. Crash Surface (Error Boundaries & Fail-Safes)

### React Error Boundaries
- ✅ Component crashes → Error boundary displays fallback
- ✅ Error boundary logs error to console (production: TODO monitoring service)
- ✅ User can recover from error (Reset / Go Home buttons)

### ChatHub Fail-Safes
- ⏳ Room data fails to load → Error boundary catches
- ⏳ Keywords missing → Fallback to room-level keywords
- ⏳ Audio URLs broken → Display error, don't crash
- ⏳ Entry content malformed → Skip entry, log error

### AI Response Errors
- ⏳ AI provider timeout → Display retry button
- ⏳ AI rate limit hit → Clear message to user
- ⏳ Invalid AI response format → Graceful degradation

### Supabase Downtime
- ⏳ Auth service down → Redirect to error page
- ⏳ Database unreachable → Cached data fallback (if any)
- ⏳ Storage bucket inaccessible → Display placeholder

### 401/403 Handling
- ⏳ Unauthorized access → Redirect to login
- ⏳ Forbidden tier access → Display upgrade prompt
- ⏳ Expired session → Refresh token or re-login prompt

### React Error Boundaries
- ⏳ Component crashes → Error boundary displays fallback
- ⏳ Error boundary logs error to monitoring
- ⏳ User can recover from error (e.g., "Go Home" button)

---

## Critical Blocker Issues (Fix Immediately)

### FIXED ✅
1. **Error Boundary** - Created ErrorBoundary component wrapping entire app to catch crashes
2. **Offline Detection** - Created OfflineDetector showing online/offline banner  
3. **404 Page** - Fixed to use React Router Link instead of `<a>` tag, added bilingual message

### COMPLETED ✅
1. **PayPal SDK Load Timeout** - 15s timeout with retry button + error banner
2. **Audio Player Error Handling** - Inline error state with retry button
3. **Session Timeout** - Created central fetch wrapper (`src/utils/edgeFetch.ts`) for 401/403 handling

---

## Nice-to-Have Polish (Post-Launch)

_To be populated with non-blocking improvements_

---

## Launch Sign-Off

- ⏳ All critical sections reviewed
- ⏳ All blocking issues fixed
- ⏳ Manual testing completed by user
- ⏳ Ready for App Store submission

---

**Last Updated:** 2025-11-29  
**Audit Status:** 🔍 IN PROGRESS - Critical fixes applied (ErrorBoundary, OfflineDetector, 404 page)
