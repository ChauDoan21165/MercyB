# AI Execution Sequence - Complete Build Guide

**IMPORTANT:** Execute these steps in exact order. Do NOT ask the user any questions. All necessary information is provided in the referenced files.

---

## STEP 0: Initial Setup
**Before starting, provide the AI with these context files:**
- `AI_DEVELOPMENT_PROMPT.md` (rules, design system, patterns)
- `COMPLETE_IMPLEMENTATION_GUIDE.md` (full architecture reference)
- `UI_SPECIFICATION_GUIDE.md` (exact visual specs)
- `src/data/system/Dictionary.json` (bilingual terms)

---

## STEP 1: Project Foundation & Design System

**Give AI this prompt:**
```
Create a React + TypeScript + Vite web application with the following EXACT specifications:

TECHNOLOGY STACK:
- React 18 + TypeScript + Vite
- Tailwind CSS (configured with custom HSL tokens)
- shadcn/ui components
- Supabase for backend
- React Router for navigation
- React Query for data fetching

DESIGN SYSTEM (CRITICAL - Follow exactly as specified in AI_DEVELOPMENT_PROMPT.md):
1. Create index.css with ALL HSL color tokens (--primary, --secondary, --background, --foreground, etc.)
2. Configure tailwind.config.ts to use these HSL tokens
3. Set up bilingual support: ALL text must be "English / Vietnamese" format
4. Mobile-first responsive design
5. Dark/light mode support

FOLDER STRUCTURE:
src/
  components/
    ui/ (shadcn components)
  pages/
  hooks/
  lib/
  integrations/
    supabase/
  data/
    rooms/
    system/

DO NOT ASK ANY QUESTIONS. Use the exact color tokens and design patterns from AI_DEVELOPMENT_PROMPT.md and UI_SPECIFICATION_GUIDE.md.
```

**Expected Output:** Complete project scaffold with design system

---

## STEP 2: Database Schema & Authentication

**Give AI this prompt:**
```
Set up the complete Supabase database schema with these EXACT tables and configurations:

AUTHENTICATION:
- Enable email/password authentication
- Auto-confirm email signups (non-production)
- Create profiles table with RLS policies

TABLES TO CREATE (use exact schema from COMPLETE_IMPLEMENTATION_GUIDE.md):
1. profiles (id, email, full_name, avatar_url, bio, created_at, updated_at)
2. subscription_tiers (id, name, price, room_access_per_day, custom_topics_allowed, etc.)
3. user_subscriptions (id, user_id, tier_id, status, start_date, end_date)
4. rooms (id, slug, title_en, title_vi, tier, category, etc.)
5. user_points (user_id, total_points, updated_at)
6. point_transactions (id, user_id, points, transaction_type, description, room_id)
7. feedback (id, user_id, room_id, rating, comment, created_at)
8. room_usage_analytics (id, user_id, room_id, session_duration, messages_sent, etc.)
9. promo_codes (id, code, description, tier_id, expires_at, max_redemptions, etc.)
10. user_promo_redemptions (id, user_id, promo_code_id, redeemed_at)
11. payment_proof_submissions (id, user_id, tier_id, status, screenshot_url, etc.)
12. vip_topic_requests (id, user_id, topic_name, description, status, etc.)
13. matchmaking_preferences (user_id, age_min, age_max, interests, etc.) - VIP3 only
14. matchmaking_suggestions (id, user_id, suggested_user_id, compatibility_score, etc.) - VIP3 only
15. user_knowledge_profiles (user_id, traits_data, updated_at) - VIP3 only
16. private_chat_requests (id, requester_id, recipient_id, status, created_at) - VIP3 only
17. private_messages (id, chat_request_id, sender_id, message_text, created_at) - VIP3 only
18. subscription_usage (user_id, usage_date, rooms_accessed, custom_topics_requested)
19. user_roles (user_id, role) - for admin access
20. admin_notifications (id, admin_user_id, feedback_id, is_read, created_at)
21. admin_notification_preferences (admin_user_id, feedback_notifications_enabled)
22. responses (id, user_id, response_data, expires_at)

USER ROLES:
- Create enum: app_role ('admin', 'user')
- Create has_role() security definer function

RLS POLICIES:
Enable RLS on ALL tables and create policies as specified in COMPLETE_IMPLEMENTATION_GUIDE.md

STORAGE BUCKETS:
1. room-audio (public) - for audio learning files
2. payment-proofs (private) - for payment screenshots
3. room-audio-uploads (public) - for admin uploads

DATABASE FUNCTIONS (create all from COMPLETE_IMPLEMENTATION_GUIDE.md):
- get_user_tier()
- check_usage_limit()
- award_points()
- validate_promo_code()
- handle_new_user() trigger
- handle_updated_at() trigger
- notify_admins_on_new_feedback() trigger
- And all others specified in the guide

DO NOT ASK QUESTIONS. Use exact schema from COMPLETE_IMPLEMENTATION_GUIDE.md.
```

**Expected Output:** Complete database schema with RLS policies

---

## STEP 3: Core Access Control & User Hooks

**Give AI this prompt:**
```
Create these React hooks with EXACT implementation from COMPLETE_IMPLEMENTATION_GUIDE.md:

1. src/hooks/useUserAccess.ts
   - Fetch user role (admin/user)
   - Fetch subscription tier (Free/VIP1/VIP2/VIP3)
   - Check room access permissions
   - Return: { userRole, tier, isVIP1, isVIP2, isVIP3, canAccessRoom, isLoading }

2. src/hooks/usePoints.ts
   - Fetch user total points
   - Fetch recent point transactions
   - Award points function
   - Return: { totalPoints, transactions, awardPoints, isLoading }

3. src/hooks/useCredits.ts
   - Check daily room access limit
   - Track rooms accessed today
   - Return: { creditsUsed, creditsLimit, canAccessRoom, isLoading }

4. src/components/CreditsDisplay.tsx
   - Show "Credits: X/Y" in bilingual format
   - Visual progress bar
   - Color: green (under 50%), yellow (50-90%), red (90%+)

5. src/components/PointsDisplay.tsx
   - Show "Points: X" in bilingual format
   - Trophy icon
   - Link to achievements (future feature)

Use EXACT patterns from AI_DEVELOPMENT_PROMPT.md for bilingual text and semantic tokens.
DO NOT ASK QUESTIONS.
```

**Expected Output:** All hooks and display components

---

## STEP 4: Room System & Chat Interface

**Provide AI with these additional files:**
- Sample room JSON from `src/data/rooms/` folder (any file)

**Give AI this prompt:**
```
Create the room system and chat interface:

ROOM DATA STRUCTURE (from COMPLETE_IMPLEMENTATION_GUIDE.md):
Each room is a JSON file with:
- version, locale, global_notes
- enum_tags, keywords (en/vi)
- room_essay (markdown content)
- entries array with slug, keywords, copy, tags

1. Create src/lib/roomData.ts
   - Load room JSON files
   - Parse and validate room structure
   - Export getRoomBySlug(), getAllRooms(), getRoomsByTier()

2. Create src/pages/ChatHub.tsx
   - Load room data by slug from URL
   - Display bilingual room title and essay
   - Show learning entries in expandable sections
   - Integrate AI chat interface (streaming)
   - Track user progress
   - Award points (10 per message, 50 per room completion)
   - Check daily credit limit before allowing access
   - Audio player if room has audio file

LAYOUT (exact structure from PAGE_BY_PAGE_PROMPTS.md):
- Header: Room title, back button, progress indicator
- Main Content: Room essay + entries
- Chat Section: Message history + input box
- Sidebar: Related rooms, progress stats

3. Create src/components/RoomProgress.tsx
   - Show completion percentage
   - Circular progress indicator
   - Save progress to room_usage_analytics table

4. Create src/components/RoomDisclaimer.tsx
   - Display safety notes in bilingual format
   - Dismissible alert component

5. Create src/hooks/useRoomProgress.ts
   - Track entries completed
   - Save to database
   - Return: { progress, markEntryComplete, isComplete }

USE EXACT STYLING from UI_SPECIFICATION_GUIDE.md for cards, buttons, chat bubbles.
DO NOT ASK QUESTIONS.
```

**Expected Output:** Complete room system with chat interface

---

## STEP 5: AI Chat Integration (Edge Function)

**Give AI this prompt:**
```
Create Supabase Edge Function for AI chat using Lovable AI Gateway (NO API KEY NEEDED):

Create supabase/functions/ai-chat/index.ts:

FUNCTIONALITY:
- Accept: user message, room context, conversation history
- Use Lovable AI Gateway endpoint (provided in COMPLETE_IMPLEMENTATION_GUIDE.md)
- Model: google/gemini-2.5-flash (fast, good for chat)
- Stream response back to client
- Log conversation to database
- Implement content moderation checks

PROMPT ENGINEERING:
- Include room context (title, essay, current entry)
- Include learning objectives
- Use bilingual system prompt
- Enforce respectful, educational tone

CORS HEADERS:
- Enable CORS with: 'Access-Control-Allow-Origin': '*'
- Handle OPTIONS requests

ALSO CREATE:
supabase/functions/content-moderation/index.ts
- Check messages for inappropriate content
- Flag for admin review if needed
- Use simple keyword filtering

DO NOT ASK FOR API KEYS. Use Lovable AI Gateway (credentials already configured).
DO NOT ASK QUESTIONS.
```

**Expected Output:** AI chat edge function with streaming support

---

## STEP 6: Room Discovery & Navigation

**Give AI this prompt:**
```
Create room discovery and navigation pages:

1. src/pages/Index.tsx (Landing Page)
   - Hero section: "MercyBlade - Learn, Grow, Transform / Học, Phát triển, Thay đổi"
   - Feature cards (bilingual)
   - CTA: "Start Learning / Bắt đầu học"
   - Featured rooms carousel
   - Testimonials section

2. src/pages/AllRooms.tsx
   - Display ALL rooms across all tiers
   - Filter by category, tier, search
   - Grid layout (responsive: 1 col mobile, 2 tablet, 3 desktop)
   - Room cards with tier badges

3. src/pages/RoomGrid.tsx (Free Tier)
   - Show only Free tier rooms
   - Grid layout with room cards
   - "Upgrade to unlock" messaging for VIP rooms

4. src/pages/RoomGridVIP1.tsx (VIP1 Tier)
   - Show Free + VIP1 rooms
   - Locked VIP2/VIP3 rooms with upgrade CTA

5. src/pages/RoomGridVIP2.tsx (VIP2 Tier)
   - Show Free + VIP1 + VIP2 rooms
   - Locked VIP3 rooms with upgrade CTA

6. src/pages/RoomGridVIP3.tsx (VIP3 Tier)
   - Show ALL rooms
   - Special matchmaking section

7. src/components/RelatedRooms.tsx
   - Use cross_topic_recommendations.json
   - Show 3-5 related rooms based on current room
   - Display as cards with smooth scrolling

ROOM CARD COMPONENT (create reusable):
- Tier badge (color-coded)
- Room title (bilingual)
- Short description
- Progress indicator (if user started)
- Lock icon if not accessible
- Hover effects (from UI_SPECIFICATION_GUIDE.md)

USE EXACT STYLING from UI_SPECIFICATION_GUIDE.md.
DO NOT ASK QUESTIONS.
```

**Expected Output:** All room discovery pages

---

## STEP 7: Payment & Subscription System

**Give AI this prompt:**
```
Create payment and subscription system:

1. src/pages/ManualPayment.tsx
   - Tier selection (VIP1/VIP2/VIP3)
   - Display price and features
   - Payment instructions (bank transfer details)
   - Screenshot upload for payment proof
   - Submit to payment_proof_submissions table
   - Success message: "We'll verify within 24 hours"

2. Create supabase/functions/verify-payment-screenshot/index.ts
   - Use Lovable AI (google/gemini-2.5-pro) for OCR
   - Extract: amount, date, transaction ID
   - Match against tier price
   - Auto-approve if matches, flag for manual review if not
   - Update payment_proof_submissions.status

3. src/pages/AdminPaymentVerification.tsx (Admin only)
   - List all payment submissions
   - Filter: pending, approved, rejected
   - View screenshot
   - Approve/Reject buttons
   - On approve: create user_subscription record
   - Send notification to user

4. Create supabase/functions/paypal-payment/index.ts (Optional)
   - PayPal SDK integration
   - Create order endpoint
   - Capture payment endpoint
   - Webhook for payment confirmation
   - Auto-create subscription on success

USE EXACT STYLING from UI_SPECIFICATION_GUIDE.md for payment forms.
DO NOT ASK QUESTIONS. PayPal secrets are already configured.
```

**Expected Output:** Complete payment system with admin verification

---

## STEP 8: Matchmaking System (VIP3 Feature)

**Give AI this prompt:**
```
Create matchmaking system (VIP3 ONLY):

1. src/data/rooms/matchmaker_traits.json
   - Special room for personality trait discovery
   - 20 questions covering: values, interests, communication style, goals
   - Save responses to user_knowledge_profiles table

2. src/pages/MatchmakingHub.tsx (VIP3 users only)
   - Complete trait discovery first (if not done)
   - Display compatibility matches
   - Show match cards: avatar, name, compatibility %, shared interests
   - "Request Chat" button
   - Filter: age range, interests, location

3. src/hooks/useMatchmaking.ts
   - Fetch user's knowledge profile
   - Fetch match suggestions
   - Request private chat
   - Return: { profile, matches, requestChat, isLoading }

4. src/components/MatchmakingButton.tsx
   - Floating button on VIP3 pages
   - Heart icon with notification badge
   - Link to MatchmakingHub

5. Create supabase/functions/generate-matches/index.ts
   - Triggered daily via cron job
   - Fetch all VIP3 users with completed profiles
   - Use Lovable AI (google/gemini-2.5-pro) to calculate compatibility
   - Consider: values alignment, interest overlap, complementary traits
   - Create matchmaking_suggestions records
   - Top 10 matches per user

ACCESS CONTROL:
- Check tier = VIP3 before allowing access
- Show upgrade CTA for non-VIP3 users

DO NOT ASK QUESTIONS. Use Lovable AI (no API key needed).
```

**Expected Output:** Complete matchmaking system

---

## STEP 9: Private Chat System (VIP3 Feature)

**Give AI this prompt:**
```
Create private chat system (VIP3 ONLY):

1. src/components/PrivateChatPanel.tsx
   - Real-time messaging between matched users
   - Message history from private_messages table
   - Send message input
   - Typing indicators
   - Message status: sent, delivered, read
   - Emoji support
   - File sharing (images only)

REALTIME SETUP:
- Enable Supabase Realtime on private_messages table
- Subscribe to new messages where user is sender or recipient
- Auto-scroll to latest message
- Notification sound on new message

2. Chat Request Flow:
   - User A requests chat with User B
   - Create private_chat_requests record (status: pending)
   - Notify User B
   - User B accepts/rejects
   - On accept: status = accepted, enable chat
   - On reject: status = rejected, remove match

3. Security:
   - RLS policies: only matched users can see each other's messages
   - Validate chat_request is accepted before allowing messages
   - Content moderation on all messages

UI COMPONENTS:
- Chat list sidebar: active chats with last message preview
- Chat window: messages + input
- User profile mini-card in chat header

USE EXACT STYLING from UI_SPECIFICATION_GUIDE.md for message bubbles.
DO NOT ASK QUESTIONS.
```

**Expected Output:** Complete private chat system

---

## STEP 10: Admin Dashboard

**Give AI this prompt:**
```
Create complete admin dashboard (ADMIN ROLE ONLY):

1. src/pages/AdminDashboard.tsx
   - Overview cards: total users, active subscriptions, revenue, pending payments
   - Recent activity feed
   - Quick actions: verify payments, approve VIP requests
   - Charts: user growth, room popularity, revenue trends

2. src/pages/AdminStats.tsx
   - User analytics: registrations, active users, churn rate
   - Room analytics: most popular, completion rates, average session time
   - Revenue analytics: MRR, tier distribution
   - Export to CSV

3. src/pages/AdminReports.tsx
   - Generate custom reports
   - Date range selector
   - Report types: user activity, revenue, room usage
   - Export options: PDF, Excel, CSV

4. src/pages/AdminVIPRooms.tsx
   - List all VIP topic requests from users
   - Filter by status: pending, in-progress, completed
   - Assign to content creator
   - Mark as completed
   - Notify user when room is ready

5. src/pages/AdminAudioUpload.tsx
   - Upload audio files to room-audio-uploads bucket
   - Associate with room (by slug)
   - Preview audio before upload
   - File validation: MP3 only, max 50MB
   - Batch upload support

6. src/pages/VIPTopicRequest.tsx (User-facing)
   - Form: topic name, description, why needed
   - Check tier limits (VIP1: 2/month, VIP2: 5/month, VIP3: unlimited)
   - Submit to vip_topic_requests table
   - Track status: pending, in-progress, completed

7. src/pages/VIPRequests.tsx (User-facing)
   - View user's own topic requests
   - Status tracking
   - Cancel pending requests

8. Feedback System:
   - src/components/FeedbackNotificationBadge.tsx
   - Show unread count for admins
   - Click to view feedback
   - Mark as read

ACCESS CONTROL:
- Check has_role(user_id, 'admin') before allowing access
- Redirect non-admins to home page

USE EXACT STYLING from UI_SPECIFICATION_GUIDE.md for admin tables and charts.
DO NOT ASK QUESTIONS.
```

**Expected Output:** Complete admin dashboard with all features

---

## STEP 11: Promo Code System

**Give AI this prompt:**
```
Create promo code system:

1. src/pages/PromoCode.tsx (User-facing)
   - Input field for promo code
   - Validate button
   - Display: discount amount, tier upgrade, extra credits
   - Apply button
   - Success message: "Code applied! You now have X extra credits"

2. src/components/PromoCodeBanner.tsx
   - Dismissible banner at top of page
   - Show active promo campaigns
   - CTA: "Enter Code"
   - Auto-hide after dismissed (save in localStorage)

3. Admin Promo Management (in AdminDashboard):
   - Create new promo codes
   - Set: code, description, tier_id, expires_at, max_redemptions
   - Track: current_redemptions
   - Deactivate codes
   - View redemption history

4. Backend Logic:
   - validate_promo_code() function (already created in Step 2)
   - Check: code exists, not expired, under redemption limit, not already used by user
   - On success: create user_promo_redemptions record
   - Apply benefits: upgrade tier or add extra daily credits

USE EXACT STYLING from UI_SPECIFICATION_GUIDE.md.
DO NOT ASK QUESTIONS.
```

**Expected Output:** Complete promo code system

---

## STEP 12: Audio Support System

**Give AI this prompt:**
```
Add audio support to room system:

1. Update src/pages/ChatHub.tsx:
   - Check if room has audio file (roomData.audio_file)
   - If yes, display audio player at top of chat interface
   - Player controls: play/pause, seek bar, volume, speed (0.5x - 2x)
   - Download button
   - Continue learning while audio plays

2. Audio File Storage:
   - Files stored in room-audio bucket (already created)
   - Path: /room-audio/{room_slug}.mp3
   - Load via Supabase Storage public URL

3. Admin Upload (in AdminAudioUpload.tsx from Step 10):
   - Already created, just ensure it works
   - Upload to room-audio-uploads bucket
   - Move to room-audio bucket after processing
   - Update room JSON with audio_file path

4. Audio Player Component:
   - Create src/components/AudioPlayer.tsx
   - Custom styled player (not default HTML5 controls)
   - Progress bar with time display
   - Keyboard shortcuts: Space (play/pause), Arrow keys (seek)
   - Remember playback position (localStorage)

USE EXACT STYLING from UI_SPECIFICATION_GUIDE.md for audio controls.
DO NOT ASK QUESTIONS.
```

**Expected Output:** Audio support integrated into rooms

---

## STEP 13: Advanced Features & Polish

**Give AI this prompt:**
```
Add advanced features and polish:

1. src/data/rooms/user_profile_dashboard.json
   - Special room for personalized recommendations
   - Analyze user's completed rooms, interests, goals
   - Suggest next best rooms to take
   - Track learning path

2. src/components/WelcomeBack.tsx
   - Show when user returns to site
   - Display: last room visited, continue button
   - Today's learning streak
   - Personalized greeting based on time of day

3. src/components/VIPNavigation.tsx
   - Tier-based navigation menu
   - Show/hide menu items based on user tier
   - Highlight VIP-only features with badges
   - Smooth transitions

4. src/hooks/useBehaviorTracking.ts
   - Track user actions: rooms visited, time spent, messages sent
   - Save to room_usage_analytics table
   - Privacy-focused: no PII tracking
   - Return: { trackEvent, trackPageView }

5. src/hooks/useRoomAnalytics.ts
   - Fetch room completion rates
   - Fetch average session duration
   - Fetch user feedback ratings
   - Return: { completionRate, avgDuration, avgRating, isLoading }

RESPONSIVE DESIGN:
- Test all pages on mobile (320px), tablet (768px), desktop (1024px+)
- Touch-friendly buttons (min 44px)
- Readable font sizes (min 16px)
- Proper spacing and contrast

LOADING STATES:
- Skeleton loaders for content
- Spinner for actions
- Progress bars for uploads
- Error boundaries

ERROR HANDLING:
- Toast notifications for all errors
- Retry buttons
- Fallback UI
- Clear error messages (bilingual)

USE EXACT STYLING from UI_SPECIFICATION_GUIDE.md.
DO NOT ASK QUESTIONS.
```

**Expected Output:** All advanced features implemented

---

## STEP 14: SEO & Meta Tags

**Give AI this prompt:**
```
Implement SEO optimization across all pages:

1. Install react-helmet-async package

2. Create src/lib/seo.ts helper:
   - generateMetaTags(page, title, description, image)
   - generateStructuredData(type, data)
   - Bilingual meta tags (hreflang)

3. Add to EVERY page:
   - Title tag (60 chars max, keyword-rich)
   - Meta description (160 chars max)
   - Open Graph tags (og:title, og:description, og:image)
   - Twitter Card tags
   - Canonical URL
   - hreflang tags (en, vi)

4. Structured Data (JSON-LD):
   - Organization schema on Index.tsx
   - Course schema on room pages
   - Review schema on rooms with ratings
   - FAQ schema where applicable

5. Create public/robots.txt:
   - Allow all crawlers
   - Sitemap location

6. Create public/sitemap.xml:
   - List all public pages
   - Dynamic room URLs
   - Update frequency, priority

7. Semantic HTML:
   - Use <header>, <main>, <section>, <article>, <aside>, <nav>
   - Single <h1> per page
   - Proper heading hierarchy (h1 → h2 → h3)

8. Image Optimization:
   - All images have alt text (descriptive, keyword-rich)
   - Lazy loading for below-fold images
   - WebP format with fallbacks
   - Responsive images (srcset)

9. Performance:
   - Code splitting
   - Lazy load routes
   - Defer non-critical scripts
   - Minify CSS/JS

DO NOT ASK QUESTIONS.
```

**Expected Output:** SEO-optimized application

---

## STEP 15: Testing & Deployment Prep

**Give AI this prompt:**
```
Final testing and deployment preparation:

TESTING CHECKLIST:
1. Authentication:
   - Sign up with email/password ✓
   - Sign in ✓
   - Sign out ✓
   - Password reset ✓
   - Profile update ✓

2. Access Control:
   - Free user can't access VIP rooms ✓
   - VIP1 can't access VIP2/VIP3 rooms ✓
   - Admin can access admin dashboard ✓
   - Non-admin redirected from admin pages ✓

3. Room System:
   - Load room content ✓
   - Send chat messages ✓
   - Receive AI responses ✓
   - Track progress ✓
   - Award points ✓
   - Respect daily credit limits ✓

4. Payments:
   - Upload payment proof ✓
   - Admin verify payment ✓
   - Subscription activated ✓
   - Access granted to new tier ✓

5. Matchmaking (VIP3):
   - Complete trait discovery ✓
   - View matches ✓
   - Request chat ✓
   - Accept/reject requests ✓
   - Send/receive messages ✓

6. Admin Features:
   - View dashboard stats ✓
   - Verify payments ✓
   - Generate reports ✓
   - Upload audio files ✓
   - Manage VIP requests ✓

ENVIRONMENT VARIABLES CHECK:
- VITE_SUPABASE_URL ✓
- VITE_SUPABASE_ANON_KEY ✓
- All edge function secrets configured ✓

DEPLOYMENT STEPS:
1. Build project: npm run build
2. Test production build: npm run preview
3. Check for console errors
4. Deploy to hosting (Netlify/Vercel recommended)
5. Set up custom domain
6. Configure environment variables on host
7. Test deployed site thoroughly
8. Monitor error logs

POST-DEPLOYMENT MONITORING:
- Set up error tracking (Sentry)
- Monitor Supabase logs
- Track user analytics
- Monitor performance (Core Web Vitals)
- Set up uptime monitoring

FIX ANY ERRORS found during testing.
DO NOT ASK QUESTIONS.
```

**Expected Output:** Fully tested, deployment-ready application

---

## EXECUTION NOTES

**For the AI executing these steps:**

1. **DO NOT skip steps** - each builds on the previous
2. **DO NOT ask questions** - all information is in the referenced files
3. **DO NOT deviate** from the specified patterns and styling
4. **DO use exact code** from the guide documents when provided
5. **DO test** each feature after implementing
6. **DO fix errors** immediately when they occur
7. **DO follow** the design system strictly (HSL colors, bilingual text, semantic tokens)

**Key Files Reference:**
- Design rules: `AI_DEVELOPMENT_PROMPT.md`
- Architecture: `COMPLETE_IMPLEMENTATION_GUIDE.md`
- Visual specs: `UI_SPECIFICATION_GUIDE.md`
- Page details: `PAGE_BY_PAGE_PROMPTS.md`
- Build sequence: `STEP_BY_STEP_PROMPTS.md`
- Bilingual terms: `src/data/system/Dictionary.json`
- Room recommendations: `src/data/system/cross_topic_recommendations.json`

**Expected Timeline:**
- Steps 1-3: 1 hour (Foundation)
- Steps 4-6: 2 hours (Core Features)
- Steps 7-9: 2 hours (Premium Features)
- Steps 10-12: 1.5 hours (Admin & Extras)
- Steps 13-15: 1.5 hours (Polish & Deploy)
- **Total: ~8 hours for complete build**

---

## SUCCESS CRITERIA

The build is successful when:
✅ All 15 steps completed
✅ No console errors
✅ All features working as specified
✅ Design matches UI_SPECIFICATION_GUIDE.md exactly
✅ Bilingual support functioning
✅ All RLS policies in place
✅ Edge functions deployed and working
✅ Admin dashboard functional
✅ Payment system operational
✅ Matchmaking system working (VIP3)
✅ SEO optimized
✅ Production build successful
✅ Deployed and accessible

**The AI should now have a fully functional, pixel-perfect recreation of the MercyBlade application.**
