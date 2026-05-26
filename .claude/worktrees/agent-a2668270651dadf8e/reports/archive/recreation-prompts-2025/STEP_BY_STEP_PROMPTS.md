# Step-by-Step AI Prompts to Recreate the App

Use these prompts in sequence with an AI assistant to recreate the Mental Health & Wellness Learning Platform.

---

## Phase 1: Foundation & Design System

### 1. Initialize Project Structure
Create a React 18 + TypeScript + Vite project with Tailwind CSS. Set up the basic folder structure with:
- `/src/components` for UI components
- `/src/pages` for page components
- `/src/hooks` for custom hooks
- `/src/lib` for utilities
- `/src/data/rooms` for room content JSON files
- `/src/integrations/supabase` for Supabase client

### 2. Set Up Design System
Create a comprehensive design system in `index.css` and `tailwind.config.ts` with:
- HSL-based semantic color tokens (--primary, --secondary, --accent, --background, --foreground, --muted, etc.)
- Support for light and dark modes
- Typography scale with consistent font sizes
- Spacing system using Tailwind defaults
- **CRITICAL**: NO direct colors like bg-blue-500, text-white, bg-black allowed. Everything must use semantic tokens.

### 3. Install Core Dependencies
Install these packages:
- @supabase/supabase-js for backend
- @tanstack/react-query for data fetching
- react-router-dom for routing
- @radix-ui components for UI primitives
- shadcn/ui components (button, card, dialog, form, input, toast, etc.)
- lucide-react for icons
- react-hook-form + zod for forms
- sonner for toast notifications

---

## Phase 2: Authentication & Database

### 4. Enable Lovable Cloud (Supabase Backend)
Enable Lovable Cloud to get a Supabase backend. Configure auto-confirm for email signups in authentication settings.

### 5. Create Core Database Schema - Part 1: Users & Auth
Create these tables with RLS policies:
```sql
- profiles (id uuid PRIMARY KEY refs auth.users, email, full_name, username unique, created_at, updated_at)
- user_roles (id uuid, user_id uuid refs auth.users, role app_role enum('admin','moderator','user'))
- Create security definer function: has_role(_user_id uuid, _role app_role) returns boolean
- Create trigger: handle_new_user() to auto-create profile on signup
- Create trigger: handle_admin_signup() to grant admin role to cd12536@gmail.com
- Enable RLS on profiles with policies for users to view/update own profile, admins to view all
- Enable RLS on user_roles with policy for admins only
```

### 6. Create Database Schema - Part 2: Subscriptions
Create subscription system tables:
```sql
- subscription_tiers (id, name, name_vi, price_monthly, room_access_per_day, custom_topics_allowed, priority_support, display_order, is_active)
- user_subscriptions (id, user_id refs auth.users, tier_id refs subscription_tiers, status default 'active', current_period_start, current_period_end, stripe_subscription_id, stripe_customer_id)
- subscription_usage (id, user_id, usage_date, rooms_accessed, custom_topics_requested)
- Create function: get_user_tier(user_uuid) returns tier info
- Create function: check_usage_limit(user_uuid, limit_type) returns boolean
- Insert 4 tiers: Free (5 rooms/day), VIP1 ($9.99), VIP2 ($19.99), VIP3 ($29.99)
- Set up RLS policies for authenticated users
```

### 7. Create Database Schema - Part 3: Rooms & Content
Create content tables:
```sql
- rooms (id text PRIMARY KEY, schema_id, title_en, title_vi, tier default 'free', keywords text[], entries jsonb, room_essay_en, room_essay_vi, safety_disclaimer_en, safety_disclaimer_vi, crisis_footer_en, crisis_footer_vi, created_at, updated_at)
- Enable RLS: authenticated users can read all rooms
- Create trigger: handle_room_updated_at() for updated_at timestamp
```

### 8. Create Database Schema - Part 4: Gamification
Create points system:
```sql
- user_points (id, user_id unique refs auth.users, total_points default 0, created_at, updated_at)
- point_transactions (id, user_id refs auth.users, points integer, transaction_type, description, room_id, created_at)
- Create function: award_points(_user_id, _points, _transaction_type, _description, _room_id)
- Enable RLS: users can view their own points/transactions, admins can view all
```

### 9. Create Database Schema - Part 5: Analytics & Feedback
Create tracking tables:
```sql
- room_usage_analytics (id, user_id refs auth.users, room_id, session_start, session_end, messages_sent, time_spent_seconds, completed_room, created_at)
- feedback (id, user_id refs auth.users, message, status default 'new', priority default 'normal', category, created_at, updated_at)
- admin_notifications (id, admin_user_id refs auth.users, feedback_id refs feedback, is_read default false, created_at)
- admin_notification_preferences (id, admin_user_id unique refs auth.users, feedback_notifications_enabled default true)
- Create trigger: notify_admins_on_new_feedback()
- Enable RLS with appropriate policies
```

### 10. Create Database Schema - Part 6: Promo Codes
Create promo code system:
```sql
- promo_codes (id, code unique, description, daily_question_limit default 20, max_redemptions default 1, current_redemptions default 0, expires_at, is_active default true, created_at)
- user_promo_redemptions (id, user_id refs auth.users, promo_code_id refs promo_codes, redeemed_at, unique(user_id, promo_code_id))
- Create function: validate_promo_code(code_input) returns json
- Enable RLS policies
```

### 11. Create Database Schema - Part 7: Matchmaking (VIP3)
Create matchmaking tables:
```sql
- user_knowledge_profiles (id, user_id unique refs auth.users, topics_discussed jsonb default '{}', interaction_count default 0, last_active, personality_traits jsonb, created_at, updated_at)
- matchmaking_matches (id, user1_id refs auth.users, user2_id refs auth.users, compatibility_score, match_reason, status default 'suggested', created_at)
- private_chat_requests (id, from_user_id refs auth.users, to_user_id refs auth.users, status default 'pending', message, created_at, updated_at)
- private_messages (id, from_user_id refs auth.users, to_user_id refs auth.users, message, is_read default false, created_at)
- Create trigger: update_private_chat_request_timestamp()
- Enable RLS policies for privacy
- Enable realtime: ALTER PUBLICATION supabase_realtime ADD TABLE private_messages;
```

### 12. Create Database Schema - Part 8: Payments
Create payment verification tables:
```sql
- payment_proof_submissions (id, user_id refs auth.users, tier_id refs subscription_tiers, username, screenshot_url, payment_method default 'paypal_manual', status default 'pending', extracted_amount, extracted_date, extracted_email, extracted_transaction_id, ocr_confidence, verification_method, verified_by refs auth.users, verified_at, admin_notes, created_at)
- Enable RLS: users can view their own submissions, admins can view all
```

### 13. Set Up Storage Buckets
Create Supabase storage buckets:
```sql
- room-audio (public bucket for room audio files)
- room-audio-uploads (public bucket for admin uploads)
- payment-proofs (private bucket for payment screenshots)
- Set up RLS policies for bucket access
```

### 14. Create Authentication Pages
Create `src/pages/Auth.tsx` with:
- Bilingual signup/login forms (English / Vietnamese format)
- Email and password fields using react-hook-form + zod validation
- Integration with Supabase auth
- Error handling with toast notifications
- Redirect to home after successful auth
- Use semantic color tokens only

---

## Phase 3: Core Hooks & Utilities

### 15. Create useUserAccess Hook
Create `src/hooks/useUserAccess.ts`:
- Fetch user roles from user_roles table
- Fetch subscription tier from user_subscriptions + subscription_tiers
- Return: isAdmin, tier ('free' | 'vip1' | 'vip2' | 'vip3'), canAccessVIP1/2/3, loading
- Use React Query for caching
- Handle unauthenticated users (return free tier)

### 16. Create usePoints Hook
Create `src/hooks/usePoints.ts`:
- Fetch total points from user_points table
- Award points every 10 messages in a room
- Function to award points using award_points database function
- Real-time subscription to point changes
- Return: totalPoints, awardPoints function, loading

### 17. Create useCredits Hook
Create `src/hooks/useCredits.ts`:
- Check daily question limit based on tier and promo codes
- Track credits used today from room_usage_analytics
- VIP users: unlimited credits
- Free users: 30 credits/day (or promo code limit)
- Return: creditsRemaining, creditsLimit, checkAndDeductCredit function, loading

### 18. Create useRoomProgress Hook
Create `src/hooks/useRoomProgress.ts`:
- Track message count and time spent in room
- Save progress to room_usage_analytics table
- Mark room as completed when user finishes
- Return: messageCount, timeSpent, markCompleted function

### 19. Create useRoomAnalytics Hook
Create `src/hooks/useRoomAnalytics.ts`:
- Fetch room analytics from room_usage_analytics
- Track room visits, completion rate, time spent
- Return analytics data for admin dashboard

### 20. Create useBehaviorTracking Hook
Create `src/hooks/useBehaviorTracking.ts`:
- Track user behavior (room visits, message patterns)
- Update user_knowledge_profiles for matchmaking
- Extract topics from messages
- Calculate personality traits

### 21. Create useMatchmaking Hook
Create `src/hooks/useMatchmaking.ts`:
- Fetch match suggestions from matchmaking_matches
- Send private chat requests
- Fetch private messages with realtime subscription
- Return: matches, sendRequest, messages, sendMessage functions

### 22. Create Room Data Management
Create `src/lib/roomData.ts` and `src/lib/roomDataImports.ts`:
- Load room JSON files from src/data/rooms
- Parse room structure (id, title_en, title_vi, tier, entries, essays)
- Filter rooms by tier
- Search rooms by keywords
- Export getRoomData, getAllRooms, getRoomsByTier functions

---

## Phase 4: Core UI Components

### 23. Create Reusable Components - Part 1
Create these components with bilingual support:
- `src/components/PointsDisplay.tsx` - Display user points in header
- `src/components/CreditsDisplay.tsx` - Display remaining credits
- `src/components/RoomProgress.tsx` - Progress bar for room completion
- `src/components/CreditLimitModal.tsx` - Modal shown when limit reached
- `src/components/UsernameSetup.tsx` - Modal to set username on first login
- `src/components/WelcomeBack.tsx` - Welcome message with username

### 24. Create Reusable Components - Part 2
Create navigation and admin components:
- `src/components/VIPNavigation.tsx` - Tier-based navigation menu
- `src/components/AdminFloatingButton.tsx` - Floating admin button (visible to admins only)
- `src/components/PromoCodeBanner.tsx` - Display active promo code
- `src/components/RoomDisclaimer.tsx` - Safety disclaimer for rooms
- `src/components/RelatedRooms.tsx` - Show related room suggestions

### 25. Create Message Components
Create chat-related components:
- `src/components/MessageActions.tsx` - Copy, bookmark, share message actions
- `src/components/PrivateChatPanel.tsx` - Private chat interface for VIP3
- `src/components/MatchmakingButton.tsx` - Button to access matchmaking
- `src/components/FeedbackNotificationBadge.tsx` - Notification badge for admins

---

## Phase 5: Main Pages

### 26. Create Index/Home Page
Create `src/pages/Index.tsx`:
- Hero section with app description (bilingual)
- Featured rooms grid (3 columns on desktop, 1 on mobile)
- Tier benefits showcase
- Call-to-action to signup/login
- Use semantic colors and responsive design
- Show PointsDisplay and CreditsDisplay in header if logged in

### 27. Create All Rooms Page
Create `src/pages/AllRooms.tsx`:
- Display all free tier rooms in grid
- Search and filter functionality
- Room cards with title, description, keywords
- Click to navigate to ChatHub
- Use useUserAccess to check access
- Bilingual content throughout

### 28. Create VIP Room Grid Pages
Create these pages (follow same pattern):
- `src/pages/RoomGridVIP1.tsx` - VIP1 tier rooms
- `src/pages/RoomGridVIP2.tsx` - VIP2 tier rooms
- `src/pages/RoomGridVIP3.tsx` - VIP3 tier rooms
- Check tier access with useUserAccess
- Show upgrade prompt if access denied
- Bilingual room cards

### 29. Create Chat Hub Page - Part 1: Structure
Create `src/pages/ChatHub.tsx` structure:
- Get roomId from URL params
- Load room data from roomData.ts
- Check user access level
- Initialize usePoints, useCredits, useRoomProgress hooks
- Show RoomDisclaimer component
- Display room title (bilingual)

### 30. Create Chat Hub Page - Part 2: Message Interface
Add to ChatHub.tsx:
- Message list with user and AI messages
- Message input field with character limit
- Send button that checks credit limit before sending
- Loading state while AI responds
- Auto-scroll to newest message
- MessageActions component for each AI message

### 31. Create Chat Hub Page - Part 3: AI Integration
Add AI response logic to ChatHub.tsx:
- Call AI chat edge function (will create in later step)
- Stream AI responses token-by-token
- Award points every 10 messages
- Track analytics with useRoomAnalytics
- Handle errors with toast notifications
- Deduct credits on each message

### 32. Create Matchmaking Hub Page
Create `src/pages/MatchmakingHub.tsx` (VIP3 only):
- Check VIP3 access with useUserAccess
- Display match suggestions with compatibility scores
- Show match reasons (shared interests, complementary traits)
- Send private chat requests
- View pending and accepted requests
- Integrate PrivateChatPanel for accepted matches
- Bilingual interface

### 33. Create Manual Payment Page
Create `src/pages/ManualPayment.tsx`:
- Tier selection cards (VIP1, VIP2, VIP3)
- PayPal payment instructions (bilingual)
- Screenshot upload interface
- Upload to payment-proofs storage bucket
- Submit to payment_proof_submissions table
- Success confirmation message
- Instructions to wait for admin verification

### 34. Create Promo Code Page
Create `src/pages/PromoCode.tsx`:
- Input field for promo code
- Validate code using validate_promo_code database function
- Display benefits (daily question limit)
- Apply code to user account
- Save to user_promo_redemptions table
- Show success message with new limits

---

## Phase 6: Admin Pages

### 35. Create Admin Dashboard
Create `src/pages/AdminDashboard.tsx`:
- Check admin access with useUserAccess
- Display key metrics: total users, active subscriptions, feedback count
- Quick links to all admin pages
- Recent activity feed
- Bilingual interface
- Use Card components for sections

### 36. Create Admin Stats Page
Create `src/pages/AdminStats.tsx`:
- User growth charts (use recharts)
- Revenue metrics by tier
- Room usage statistics
- Top performing rooms
- User retention metrics
- Export data functionality
- Date range filters

### 37. Create Admin Reports Page
Create `src/pages/AdminReports.tsx`:
- Feedback submissions table
- Status badges (new, in_progress, resolved)
- Priority indicators (low, normal, high)
- Filter by status and priority
- Assign/update status
- Add admin notes
- Mark as read functionality

### 38. Create Admin Payment Verification Page
Create `src/pages/AdminPaymentVerification.tsx`:
- Table of pending payment submissions
- Display screenshot preview
- Show extracted data (amount, email, transaction ID, OCR confidence)
- Approve/reject buttons
- Add admin notes field
- On approve: create user_subscription record
- Send toast notification on action

### 39. Create Admin VIP Rooms Page
Create `src/pages/AdminVIPRooms.tsx`:
- List all VIP-tier rooms
- Edit room details (title, tier, keywords)
- Add/remove rooms
- Upload room JSON files
- Preview room content
- Sync to database

### 40. Create Admin Audio Upload Page
Create `src/pages/AdminAudioUpload.tsx`:
- Upload audio files to room-audio-uploads bucket
- Associate audio with specific rooms
- Audio player preview
- Manage existing audio files
- Delete functionality

---

## Phase 7: Edge Functions

### 41. Create AI Chat Edge Function
Create `supabase/functions/ai-chat/index.ts`:
- Import room data from `./data/{roomId}.json`
- Receive message and conversation history from client
- Call Lovable AI API (https://ai.gateway.lovable.dev/v1/chat/completions)
- Use model: google/gemini-2.5-flash
- Stream response with SSE
- Handle CORS headers
- Include system prompt from room data
- Handle rate limits (429) and payment errors (402)
- Use LOVABLE_API_KEY from environment

### 42. Create Room Chat Edge Function
Create `supabase/functions/room-chat/index.ts`:
- Similar to ai-chat but with room-specific logic
- Load room data from `./data/{roomId}.json`
- Apply keyword-based responses from room entries
- Track message count for points
- Return structured responses
- Handle CORS

### 43. Create Content Moderation Edge Function
Create `supabase/functions/content-moderation/index.ts`:
- Receive message content from client
- Check against moderation rules in mercyblade_moderation_rules.v1.json
- Use Lovable AI for content analysis
- Return: isAllowed (boolean), reason (string), severity (low/medium/high)
- Block messages that violate rules
- Log violations to database

### 44. Create Generate Matches Edge Function
Create `supabase/functions/generate-matches/index.ts`:
- Run daily cron job
- Fetch all user_knowledge_profiles
- Calculate compatibility scores between users
- Consider: shared topics, complementary personality traits, activity level
- Use Lovable AI for match reasoning
- Insert matches into matchmaking_matches table
- Send notifications to users with new matches

### 45. Create PayPal Payment Edge Function
Create `supabase/functions/paypal-payment/index.ts`:
- Integrate with PayPal API (collect PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET)
- Create payment order
- Capture payment on approval
- Create user_subscription record on success
- Handle webhooks for subscription updates
- Return payment status to client

### 46. Create Payment Screenshot Verification Edge Function
Create `supabase/functions/verify-payment-screenshot/index.ts`:
- Receive screenshot URL from client
- Use Lovable AI vision model (google/gemini-2.5-flash) for OCR
- Extract: amount, date, email, transaction ID
- Calculate confidence score
- If confidence > 0.85 and amount matches: auto-approve
- Otherwise: mark as pending for admin review
- Update payment_proof_submissions table
- Return verification result

### 47. Create Text-to-Speech Edge Function
Create `supabase/functions/text-to-speech/index.ts`:
- Receive text content from client
- Call text-to-speech API (collect API key if needed)
- Return audio stream or URL
- Cache results in storage bucket
- Handle bilingual content (EN/VI)

---

## Phase 8: Content & Data

### 48. Create Room Content Structure
Create room JSON files in `src/data/rooms/` with this structure:
```json
{
  "id": "room_id",
  "schema_id": "unique_schema",
  "title_en": "English Title",
  "title_vi": "Vietnamese Title",
  "tier": "free",
  "keywords": ["keyword1", "keyword2"],
  "entries": [
    {
      "entry_number": 1,
      "keywords": ["specific"],
      "word_count_en": 150,
      "word_count_vi": 150,
      "content_en": "75-150 word response",
      "content_vi": "75-150 word response"
    }
  ],
  "room_essay_en": "400-600 word essay",
  "room_essay_vi": "400-600 word essay",
  "safety_disclaimer_en": "Disclaimer text",
  "safety_disclaimer_vi": "Disclaimer text"
}
```

### 49. Create Initial Room Content - Mental Health
Create these room JSON files:
- stress_and_anxiety.json (free tier)
- depression.json (free tier)
- burnout.json (free tier)
- anxiety_toolkit.json (free tier)
- trauma.json (VIP1)
- grief.json (VIP1)
- phobia.json (VIP2)

### 50. Create Initial Room Content - Physical Health
Create these room JSON files:
- sleep_health.json (free tier)
- nutrition_basics.json (free tier)
- exercise_medicine.json (free tier)
- diabetes.json (VIP1)
- hypertension.json (VIP1)
- cardiovascular.json (VIP2)

### 51. Create Initial Room Content - Relationships
Create these room JSON files:
- relationship_conflicts.json (free tier)
- how_to_find_your_soul_mate.json (free tier)
- husband_dealing.json (VIP2)
- wife_dealing.json (VIP2)
- sexuality_and_intimacy.json (VIP2)

### 52. Create Initial Room Content - Professional
Create these room JSON files:
- career_burnout.json (free tier)
- office_survival.json (free tier)
- business_strategy.json (VIP1)
- negotiation_mastery.json (VIP1)
- speaking_crowd.json (VIP2)

### 53. Create Initial Room Content - Spiritual
Create these room JSON files:
- finding_gods_peace_free.json (free tier)
- gods_guidance_vip1.json (VIP1)
- gods_strength_vip2_resilience.json (VIP2)
- gods_purpose_vip3.json (VIP3)

### 54. Create System Data Files
Create in `src/data/system/`:
- Dictionary.json - Common terms and translations
- cross_topic_recommendations.json - Related room suggestions
- mercyblade_moderation_rules.v1.json - Content moderation rules

### 55. Sync Room Data to Database
Create script `scripts/import-rooms-to-supabase.ts`:
- Read all room JSON files from src/data/rooms
- Insert into rooms table
- Handle conflicts (update existing rooms)
- Log import results

---

## Phase 9: Routing & Navigation

### 56. Set Up React Router
Create routing in `src/App.tsx`:
```typescript
- "/" -> Index
- "/auth" -> Auth
- "/rooms" -> AllRooms
- "/rooms/vip1" -> RoomGridVIP1
- "/rooms/vip2" -> RoomGridVIP2
- "/rooms/vip3" -> RoomGridVIP3
- "/chat/:roomId" -> ChatHub
- "/matchmaking" -> MatchmakingHub
- "/manual-payment" -> ManualPayment
- "/promo-code" -> PromoCode
- "/admin" -> AdminDashboard
- "/admin/stats" -> AdminStats
- "/admin/reports" -> AdminReports
- "/admin/payment-verification" -> AdminPaymentVerification
- "/admin/vip-rooms" -> AdminVIPRooms
- "/admin/audio-upload" -> AdminAudioUpload
- "/vip-requests" -> VIPRequests (user topic requests)
- "/vip-request-form" -> VIPRequestForm
- "*" -> NotFound
```

### 57. Create Protected Route Wrapper
Create `src/components/ProtectedRoute.tsx`:
- Check authentication status
- Redirect to /auth if not logged in
- Show loading state while checking
- Support role-based access (admin, VIP tiers)

### 58. Create Navigation Header
Create main navigation header component:
- Logo/brand name
- Links: Home, Rooms, VIP Rooms (if has access), Matchmaking (VIP3 only)
- User menu: Profile, Settings, Logout
- PointsDisplay and CreditsDisplay
- AdminFloatingButton (if admin)
- Mobile responsive (hamburger menu)
- Bilingual menu items

### 59. Create Footer Component
Create footer component:
- Links: About, Privacy Policy, Terms of Service, Contact
- Social media links
- Copyright notice
- Language toggle (EN/VI)
- Crisis helpline information

---

## Phase 10: Advanced Features

### 60. Implement Keyword-Based Responses
Create `src/lib/keywordResponder.ts`:
- Match user message against room entry keywords
- Return matching entry content (EN or VI based on user preference)
- Fallback to AI response if no match
- Priority system for multi-keyword matches

### 61. Implement Input Validation
Create `src/lib/inputValidation.ts`:
- Validate message length (max 500 characters)
- Sanitize user input
- Check for spam patterns
- Rate limiting logic
- Return validation errors (bilingual)

### 62. Implement Room Recommendations
Create recommendation system:
- Cross-topic recommendations from cross_topic_recommendations.json
- Based on completed rooms
- Based on user interests (from knowledge profile)
- Display in RelatedRooms component

### 63. Implement Progress Tracking
Enhance useRoomProgress hook:
- Track which entries user has seen
- Calculate completion percentage
- Show progress bar in ChatHub
- Award completion bonus points
- Mark room as completed in analytics

### 64. Implement Search Functionality
Add search to room grids:
- Search by title (EN or VI)
- Search by keywords
- Filter by tier
- Sort by: newest, most popular, alphabetical
- Debounce search input

### 65. Implement User Profile Page
Create user profile page:
- Display username, email, full name
- Show total points and tier
- Room completion history
- Edit profile information
- Change password
- Delete account option

### 66. Implement Notification System
Create notification system:
- In-app notifications for: new matches, chat requests, point awards, subscription expiry
- Badge count in header
- Notification center dropdown
- Mark as read functionality
- Real-time updates with Supabase realtime

### 67. Implement Export Data Feature
Add export functionality:
- Export user data (GDPR compliance)
- Export chat history
- Export analytics (admin only)
- Download as JSON or CSV
- Include bilingual labels

### 68. Implement Rate Limiting
Add rate limiting:
- Max messages per minute (prevent spam)
- Max room accesses per day (tier-based)
- Max match requests per day (VIP3)
- Display countdown timer when limited
- Store limits in database

---

## Phase 11: Testing & Quality

### 69. Create Validation Scripts
Create in `scripts/`:
- validate-rooms.ts - Check room JSON structure
- validate-room-integrity.ts - Check data consistency
- clean-room-entries.ts - Remove duplicates
- clean-word-counts.ts - Verify word counts
- generate-cross-topic-recommendations.ts

### 70. Add Error Boundaries
Create error boundary components:
- Global error boundary in App.tsx
- Page-level error boundaries
- Show user-friendly error messages (bilingual)
- Log errors to database
- Provide recovery options

### 71. Add Loading States
Enhance all pages with proper loading states:
- Skeleton loaders for cards
- Shimmer effects
- Loading spinners for actions
- Optimistic UI updates
- Prevent duplicate submissions

### 72. Add Empty States
Add empty state components:
- No rooms found
- No matches available
- No messages yet
- No feedback submissions
- Include helpful suggestions (bilingual)

### 73. Implement Form Validation
Enhance all forms:
- Real-time validation with Zod schemas
- Show field-level errors (bilingual)
- Disable submit until valid
- Show success messages
- Handle server-side errors

### 74. Add Accessibility Features
Improve accessibility:
- ARIA labels (bilingual)
- Keyboard navigation
- Focus management
- Screen reader support
- High contrast mode support
- Font size adjustment

---

## Phase 12: Mobile Optimization

### 75. Responsive Design - Layout
Optimize layouts for mobile:
- Mobile-first approach
- Touch-friendly buttons (min 44px)
- Readable font sizes (min 16px)
- Proper spacing for touch targets
- Collapsible navigation
- Bottom navigation bar (optional)

### 76. Responsive Design - Chat Interface
Optimize ChatHub for mobile:
- Full-screen chat on mobile
- Sticky input at bottom
- Virtual keyboard handling
- Scroll to input when keyboard opens
- Swipe gestures for actions

### 77. Responsive Design - Tables
Make admin tables mobile-friendly:
- Horizontal scroll for tables
- Card view on small screens
- Collapsible rows
- Filter/sort drawer
- Pagination controls

### 78. Performance Optimization - Images
Optimize images:
- Use WebP format
- Lazy loading for images
- Responsive images with srcset
- Image placeholders
- Compress images

### 79. Performance Optimization - Code Splitting
Implement code splitting:
- Lazy load routes with React.lazy
- Lazy load admin pages
- Lazy load heavy components
- Preload critical routes
- Show loading fallbacks

---

## Phase 13: SEO & Meta

### 80. Add Meta Tags
Add SEO meta tags to all pages:
- Title (max 60 chars, include main keyword)
- Meta description (max 160 chars)
- Open Graph tags (og:title, og:description, og:image)
- Twitter Card tags
- Canonical URL
- Language tags (hreflang for EN/VI)

### 81. Add Structured Data
Implement JSON-LD structured data:
- Organization schema
- Article schema for room content
- FAQPage schema
- BreadcrumbList schema
- Review schema (future)

### 82. Create Sitemap
Generate sitemap.xml:
- List all public pages
- List all free-tier rooms
- Update frequency
- Priority values
- Submit to search engines

### 83. Create robots.txt
Create robots.txt in public/:
- Allow all crawlers
- Disallow admin pages
- Disallow user-specific pages
- Link to sitemap
- Crawl delay if needed

---

## Phase 14: Configuration & Deployment

### 84. Environment Variables
Set up environment variables:
- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY
- VITE_SUPABASE_PROJECT_ID
- (These are auto-configured by Lovable Cloud)

### 85. Configure Supabase
Update `supabase/config.toml`:
- List all edge functions
- Set verify_jwt = false for public functions
- Configure CORS settings
- Set function timeout limits

### 86. Set Up Storage Policies
Configure storage bucket policies:
- room-audio: public read, admin write
- room-audio-uploads: admin only
- payment-proofs: user write own, admin read all

### 87. Create Seed Data
Create database seed script:
- Insert subscription tiers
- Insert sample rooms
- Create admin user (cd12536@gmail.com)
- Insert sample promo codes
- Set up initial configuration

### 88. Configure Auth Settings
Configure Supabase Auth:
- Enable email signup
- Enable auto-confirm email (for non-production)
- Configure password requirements
- Set up email templates (bilingual)
- Configure redirect URLs

### 89. Set Up Edge Function Secrets
Add required secrets:
- LOVABLE_API_KEY (auto-provided)
- PAYPAL_CLIENT_ID (if using PayPal)
- PAYPAL_CLIENT_SECRET (if using PayPal)
- PAYPAL_MODE (sandbox or live)

### 90. Deploy Application
Final deployment steps:
- Connect GitHub repository
- Push all code to GitHub
- Click "Publish" in Lovable
- Verify deployment
- Test all features in production
- Configure custom domain (if needed)
- Set up SSL certificate
- Monitor error logs

---

## Phase 15: Final Polish

### 91. Add Welcome Tour
Create first-time user tour:
- Highlight key features
- Explain tier system
- Show how to use chat
- Explain points and credits
- Skip option
- Don't show again checkbox

### 92. Add Keyboard Shortcuts
Implement keyboard shortcuts:
- Cmd/Ctrl + K: Search
- Cmd/Ctrl + /: Show shortcuts
- Esc: Close modals
- Enter: Send message
- Display shortcuts help modal

### 93. Add Dark Mode Toggle
Enhance dark mode:
- Toggle in header
- Persist preference
- Smooth transition
- Test all colors in both modes
- Ensure proper contrast

### 94. Add Language Preference
Add language toggle:
- Switch between EN/VI
- Persist preference
- Update all UI elements
- Update AI responses
- Flag icon in header

### 95. Add Analytics Tracking
Add analytics (optional):
- Track page views
- Track user interactions
- Track conversions
- Track errors
- Privacy-compliant (GDPR)

### 96. Add Feedback Widget
Create feedback widget:
- Floating feedback button
- Quick feedback form
- Submit to feedback table
- Thank you message
- Track feedback submission

### 97. Create Help Center
Create help/FAQ page:
- Common questions (bilingual)
- How-to guides
- Troubleshooting
- Contact information
- Search functionality

### 98. Add Terms & Privacy
Create legal pages:
- Terms of Service (bilingual)
- Privacy Policy (bilingual)
- Cookie Policy
- GDPR compliance
- Link in footer

### 99. Final Testing
Comprehensive testing:
- Test all user flows
- Test all admin functions
- Test payment flows
- Test matchmaking
- Test on mobile devices
- Test in different browsers
- Test with screen readers
- Fix any bugs found

### 100. Launch Checklist
Final launch verification:
- ✅ All edge functions deployed
- ✅ Database migrations applied
- ✅ RLS policies tested
- ✅ Authentication working
- ✅ Payment systems tested
- ✅ Admin functions working
- ✅ Mobile responsive
- ✅ SEO optimized
- ✅ Error handling in place
- ✅ Performance optimized
- ✅ Security verified
- ✅ Backup strategy in place
- ✅ Monitoring set up
- ✅ Documentation complete
- ✅ User guide created
- 🚀 Ready to launch!

---

## Important Notes

### Color System Rules (CRITICAL)
- **NEVER** use direct colors like `bg-blue-500`, `text-white`, `bg-black`
- **ALWAYS** use HSL semantic tokens from index.css
- Use `bg-primary`, `text-foreground`, `bg-secondary`, etc.
- All colors must be defined as HSL values in CSS variables

### Bilingual Format (MANDATORY)
- **ALL** UI elements must be: `English / Vietnamese`
- Applies to: buttons, labels, headings, toasts, errors, form fields
- Separator is always: ` / ` (space-slash-space)
- Example: `Submit / Gửi`, `Welcome Back / Chào Mừng Trở Lại`

### Security Rules
- **NEVER** expose Supabase credentials in client code
- **ALWAYS** use RLS policies on all tables
- **ALWAYS** validate user input on backend
- **NEVER** trust client-side access checks
- Use security definer functions for role checks

### Authentication Rules
- **NEVER** use anonymous signups
- **ALWAYS** implement proper signup/login forms
- **ALWAYS** enable auto-confirm for email (non-production)
- Check authentication before protected actions
- Redirect unauthenticated users to /auth

### Edge Function Rules
- **ALWAYS** handle CORS properly
- Use LOVABLE_API_KEY for AI features
- Handle rate limits (429) and payment errors (402)
- Log errors for debugging
- Return proper HTTP status codes
- Never expose secrets to client

---

## References

Refer to these files for complete implementation details:
- `COMPLETE_IMPLEMENTATION_GUIDE.md` - All patterns and decisions
- `AI_DEVELOPMENT_PROMPT.md` - Design system and conventions
- Existing codebase - Follow established patterns

---

**Total Prompts: 100**

Use these prompts sequentially with an AI assistant. Each prompt builds on the previous ones. The AI should refer to the implementation guide for detailed patterns and examples.
