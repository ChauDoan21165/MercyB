# Step-by-Step Prompts for AI to Recreate MercyBlade

## How to Use This Guide

Each prompt below is **self-contained and copy-paste ready**. Work through them in order. Each prompt references the necessary context files.

---

## PROMPT 1: Project Foundation & Design System

I need to create a bilingual (English/Vietnamese) React + TypeScript + Vite web application. 

**Design Requirements:**
- Use HSL semantic color tokens (never direct colors like `text-white` or `bg-black`)
- All text must be in format: "English / Vietnamese" 
- Mobile-first responsive design
- Dark/light mode support via `next-themes`
- Use Tailwind CSS with shadcn/ui components

**Create:**
1. Update `index.css` with HSL color tokens for:
   - Primary, secondary, accent colors
   - Background, foreground, muted variants
   - Border, input, ring colors
   - Destructive, success states
   - Card, popover surfaces

2. Configure `tailwind.config.ts` to use these HSL tokens with `hsl()` wrapper

3. Create base layout structure with:
   - Responsive container
   - Navigation system
   - Theme provider with dark/light mode toggle

**Tech Stack:**
- React 18.3, TypeScript, Vite
- Tailwind CSS + shadcn/ui
- Supabase for backend
- React Router for navigation
- TanStack Query for data fetching

---

## PROMPT 2: Database Schema & Authentication

I need a complete Supabase database schema with authentication.

**Authentication:**
- Email/password authentication
- Auto-confirm email signups (for development)
- Create `profiles` table with trigger for new users
- Store: id (references auth.users), email, full_name, username

**Core Tables:**

1. **subscription_tiers**
   - id, name, name_vi, price_monthly
   - room_access_per_day, custom_topics_allowed
   - priority_support, is_active, display_order

2. **user_subscriptions**
   - user_id, tier_id, status
   - stripe_subscription_id, stripe_customer_id
   - current_period_start, current_period_end

3. **rooms** (main content table)
   - id, schema_id, title_en, title_vi
   - tier (free/VIP1/VIP2/VIP3)
   - entries (jsonb), keywords (text[])
   - room_essay_en, room_essay_vi
   - safety_disclaimer_en, safety_disclaimer_vi
   - crisis_footer_en, crisis_footer_vi

4. **user_quotas**
   - user_id, quota_date
   - rooms_accessed, questions_used

5. **user_points**
   - user_id, total_points, updated_at

6. **point_transactions**
   - user_id, points, transaction_type
   - description, room_id

7. **room_assignments**
   - user_id, room_id, assigned_date, is_full_access

8. **room_usage_analytics**
   - user_id, room_id, session_start, session_end
   - messages_sent, time_spent_seconds, completed_room

9. **promo_codes**
   - code, description, daily_question_limit
   - max_redemptions, current_redemptions
   - expires_at, is_active

10. **user_promo_redemptions**
    - user_id, promo_code_id
    - daily_question_limit, total_question_limit
    - total_questions_used, expires_at

**User Roles:**
- Create enum `app_role` with 'admin', 'user'
- Create `user_roles` table (user_id, role)
- Create function `has_role(_user_id uuid, _role app_role)` for RLS

**RLS Policies:**
- Users can view/update own profiles
- Users can view/insert/update own subscriptions
- Users can view/update own quotas and points
- Admins can view all data
- Anyone can view active subscription_tiers
- Anyone can view rooms (read-only)

**Functions:**
- `handle_new_user()` - trigger to create profile on signup
- `award_points()` - function to add points and create transaction
- `get_user_tier()` - return user's active subscription tier
- `check_usage_limit(user_uuid, limit_type)` - verify daily limits
- `validate_promo_code(code_input)` - check promo code validity

---

## PROMPT 3: Core Access Control & User Hooks

Create the access control system and core hooks.

**Create Hook: `src/hooks/useUserAccess.ts`**
- Fetch user's active subscription tier
- Fetch user's daily quota (rooms_accessed, questions_used)
- Fetch promo code redemptions
- Calculate effective daily limits (tier + promo)
- Expose: `hasAccess(roomTier)`, `canAccessRoom(roomId)`, `incrementRoomAccess()`, `incrementQuestions()`

**Create Hook: `src/hooks/usePoints.ts`**
- Fetch user's total points
- Fetch point transactions history
- Expose: `totalPoints`, `transactions`, `awardPoints(points, type, description)`

**Create Hook: `src/hooks/useCredits.ts`**
- Fetch questions_used from user_quotas for today
- Calculate remaining credits based on tier + promo
- Expose: `credits`, `maxCredits`, `useCredit()`

**Create Component: `src/components/CreditsDisplay.tsx`**
- Show "Credits: X / Y" in bilingual format
- Visual progress bar
- Warning state when low
- Use semantic color tokens

**Create Component: `src/components/PointsDisplay.tsx`**
- Show total points with icon
- Hover tooltip showing recent transactions

**Integration:**
- These hooks will be used throughout the app to check access
- All room entry points must verify access first
- Award points for completing rooms, daily logins, etc.

---

## PROMPT 4: Room System & Chat Interface

Create the room content system and AI chat interface.

**Room Data Structure:**
Each room JSON in `src/data/rooms/` has:
```json
{
  "id": "room_name",
  "schema_id": "room_name",
  "title_en": "English Title",
  "title_vi": "Vietnamese Title",
  "tier": "free|VIP1|VIP2|VIP3",
  "keywords": ["word1", "word2"],
  "room_essay_en": "Introduction text...",
  "room_essay_vi": "Vietnamese introduction...",
  "safety_disclaimer_en": "Safety notice...",
  "safety_disclaimer_vi": "Vietnamese safety...",
  "crisis_footer_en": "Crisis resources...",
  "crisis_footer_vi": "Vietnamese crisis...",
  "entries": [
    {
      "entry_number": 1,
      "topic_vi": "Vietnamese topic",
      "topic_en": "English topic",
      "learning_content_vi": "Vietnamese content",
      "learning_content_en": "English content",
      "system_prompt_vi": "AI instructions in Vietnamese",
      "system_prompt_en": "AI instructions in English",
      "sample_question_vi": "Example question in Vietnamese",
      "sample_question_en": "Example question in English"
    }
  ]
}
```

**Create: `src/pages/ChatHub.tsx`**
Main chat interface:
- Load room by ID from URL params
- Check access with `useUserAccess`
- Display room essay and safety disclaimer
- Show progress (current entry / total entries)
- Navigation: Previous/Next entry buttons
- Display entry topic and learning content
- Chat interface with AI
- Award points on completion
- Track analytics (time spent, messages sent)

**Create: `src/components/RoomProgress.tsx`**
- Visual progress indicator
- "Entry X of Y"
- Progress bar
- Completion percentage

**Create: `src/components/RoomDisclaimer.tsx`**
- Display safety_disclaimer
- Display crisis_footer with resources
- Collapsible accordion format

**Create Hook: `src/hooks/useRoomProgress.ts`**
- Track current entry number
- Save/load progress from localStorage
- Mark entries as completed
- Award points on room completion

---

## PROMPT 5: AI Chat Integration (Edge Function)

Create the AI chat system using Lovable AI Gateway.

**Create Edge Function: `supabase/functions/ai-chat/index.ts`**

Requirements:
- Copy all room JSON files to `supabase/functions/ai-chat/data/`
- Accept: `{ roomId, entryNumber, userMessage, language }`
- Load room data and find entry by number
- Use appropriate system_prompt based on language
- Call Lovable AI Gateway: `https://ai.gateway.lovable.dev/v1/chat/completions`
- Use model: `google/gemini-2.5-flash`
- Use `LOVABLE_API_KEY` from Supabase secrets
- Return streamed response
- Handle rate limits (429) and payment required (402) errors
- CORS headers for all responses

**Frontend Integration:**
- Call edge function from ChatHub
- Stream response token-by-token
- Display typing indicator while waiting
- Show error toasts for rate limits or payment issues
- Store conversation history in component state

**Content Moderation:**
- Create `supabase/functions/content-moderation/index.ts`
- Check messages against moderation rules
- Block inappropriate content
- Track violations in `user_moderation_status` and `user_moderation_violations` tables

---

## PROMPT 6: Room Discovery & Navigation

Create room browsing and discovery interfaces.

**Create: `src/pages/Index.tsx`** (Homepage)
- Hero section with app description
- Featured rooms carousel
- Categories/topics grid
- Call-to-action for signup
- Link to full room list

**Create: `src/pages/AllRooms.tsx`**
- Grid of all free rooms
- Search/filter by keywords
- Category tabs
- Click to view room details or start

**Create: `src/pages/RoomGrid.tsx`** (Free tier rooms)
- Display all rooms with tier="free"
- Card layout with title, description
- Lock icon for rooms user hasn't accessed
- Progress indicator for started rooms

**Create: `src/pages/RoomGridVIP1.tsx`**
- Display rooms with tier="VIP1"
- Require VIP1+ subscription
- Show upgrade prompt if not subscribed

**Create: `src/pages/RoomGridVIP2.tsx`**
- Display rooms with tier="VIP2"
- Require VIP2+ subscription

**Create: `src/pages/RoomGridVIP3.tsx`**
- Display rooms with tier="VIP3"
- Require VIP3 subscription

**Create: `src/components/RelatedRooms.tsx`**
- Load `src/data/system/cross_topic_recommendations.json`
- Show related rooms based on current room
- Recommend next rooms based on user interests

**Room Card Component:**
- Title (bilingual)
- Tier badge
- Progress bar if started
- Lock icon if no access
- Entry count
- Estimated time

---

## PROMPT 7: Payment & Subscription System

Create the payment verification and subscription management.

**Database Tables:**

**payment_proof_submissions:**
- user_id, tier_id, screenshot_url, username
- status (pending/approved/rejected)
- payment_method (paypal_manual)
- extracted_amount, extracted_date, extracted_transaction_id, extracted_email
- ocr_confidence, verification_method
- verified_by, verified_at, admin_notes

**Storage Bucket:**
- Create `payment-proofs` bucket (private)
- RLS: Users upload to own folder, admins view all

**Create: `src/pages/ManualPayment.tsx`**
User flow:
1. Select subscription tier
2. Show PayPal payment instructions with email
3. Upload screenshot of payment
4. Submit for verification
5. Show pending status

**Create Edge Function: `supabase/functions/verify-payment-screenshot/index.ts`**
- Accept screenshot upload
- Use Lovable AI (google/gemini-2.5-pro with vision) to extract:
  - Transaction ID
  - Amount
  - Date
  - Email
- Return confidence score
- Store in payment_proof_submissions

**Create: `src/pages/AdminPaymentVerification.tsx`**
Admin interface:
- View pending submissions
- Display screenshot and extracted data
- Approve/reject buttons
- On approve: create/update user_subscription
- Add admin notes

**Create Edge Function: `supabase/functions/paypal-payment/index.ts`**
- Verify PayPal webhook (future enhancement)
- Auto-approve matching submissions

---

## PROMPT 8: Matchmaking System (VIP3 Feature)

Create the matchmaking system for VIP3 users.

**Database Tables:**

**matchmaking_preferences:**
- user_id, looking_for (text[])
- communication_style, availability (jsonb)
- goals (jsonb)

**matchmaking_suggestions:**
- user_id, suggested_user_id
- match_score, match_reason (jsonb)
- common_interests, complementary_traits
- status (pending/accepted/rejected)
- expires_at (7 days)

**user_knowledge_profile:**
- user_id, interests (jsonb)
- knowledge_areas (jsonb)
- completed_topics (jsonb)
- traits (jsonb)

**Create: `src/pages/MatchmakingHub.tsx`**
For VIP3 users:
- Complete matchmaking questionnaire
- View AI-generated matches
- See match reasons and compatibility score
- Accept/reject suggestions
- View profile of suggested matches

**Create Hook: `src/hooks/useMatchmaking.ts`**
- Fetch user preferences
- Fetch suggestions
- Update preference
- Accept/reject matches

**Create Component: `src/components/MatchmakingButton.tsx`**
- Show for VIP3 users only
- Navigate to matchmaking hub
- Show notification badge for new matches

**Create Edge Function: `supabase/functions/generate-matches/index.ts`**
AI matchmaking:
- Load all VIP3 users' profiles and preferences
- Use Lovable AI to analyze compatibility
- Generate match reasons (common interests, complementary traits)
- Calculate match scores
- Create suggestions in database
- Run daily via cron

**Special Room: `matchmaker_traits.json`**
- Help users discover their personality traits
- Store results in user_knowledge_profile.traits
- Use for better matchmaking

---

## PROMPT 9: Private Chat System (VIP3 Feature)

Create private messaging between matched VIP3 users.

**Database Tables:**

**private_chat_requests:**
- sender_id, receiver_id, room_id
- status (pending/accepted/rejected)

**private_messages:**
- request_id, sender_id, receiver_id
- message, is_read

**Create: `src/components/PrivateChatPanel.tsx`**
- Send chat request to matched user
- View incoming requests
- Accept/reject requests
- Real-time messaging interface
- Message history
- Read receipts

**Realtime Setup:**
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.private_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.private_chat_requests;
```

**Integration:**
- Show private chat option in matchmaking results
- Notification badge for new messages
- VIP3-only feature with access control

---

## PROMPT 10: Admin Dashboard

Create comprehensive admin interface.

**Create: `src/pages/AdminDashboard.tsx`**
Overview:
- Total users count
- Active subscriptions by tier
- Revenue metrics
- Recent signups
- System health

**Create: `src/pages/AdminStats.tsx`**
Analytics:
- Room usage statistics
- Most popular rooms
- Completion rates
- User engagement metrics
- Credit usage patterns

**Create: `src/pages/AdminReports.tsx`**
- Export user data
- Subscription reports
- Financial reports
- Usage reports by date range

**Create: `src/pages/AdminVIPRooms.tsx`**
VIP Room Request Management:
- View all requests from `vip_room_requests` table
- Approve/reject/complete
- Assign room_id when completed
- Add admin notes

**Create: `src/pages/VIPRequests.tsx`** (User View)
- VIP1+ users can request custom rooms
- View their request status
- See admin notes

**Create: `src/pages/VIPTopicRequest.tsx`** (User View)
- Detailed topic request form
- Specific goals, target audience
- Urgency level
- Additional notes

**Create: `src/pages/AdminAudioUpload.tsx`**
- Upload audio files to `room-audio` storage bucket
- Link audio to rooms
- Manage audio library

**Create: `src/components/AdminFloatingButton.tsx`**
- Show for admin users only
- Floating action button
- Quick access to admin dashboard

**Feedback System:**

**feedback table:**
- user_id, message, category
- status (new/in_progress/resolved)
- priority (low/normal/high)

**admin_notifications:**
- admin_user_id, feedback_id, is_read

**Create: `src/components/FeedbackNotificationBadge.tsx`**
- Show unread count for admins
- Click to view feedback

---

## PROMPT 11: Promo Code System

Create promo code functionality.

**Frontend: `src/pages/PromoCode.tsx`**
User interface:
- Input field for promo code
- Validate button
- Show benefits if valid
- Redeem button
- Display active promo codes

**Create: `src/components/PromoCodeBanner.tsx`**
- Show on homepage or dashboard
- Highlight active promotions
- Click to enter code

**Admin Interface:**
In AdminDashboard:
- Create new promo codes
- Set daily_question_limit
- Set max_redemptions
- Set expiration date
- Activate/deactivate codes
- View redemption statistics

**Backend Logic:**
- Function `validate_promo_code()` checks validity
- On redemption: increment current_redemptions
- Create entry in user_promo_redemptions
- Promo limits stack with tier limits
- Track total_questions_used

---

## PROMPT 12: Audio Support System

Add audio playback for room content.

**Storage Setup:**
- Bucket: `room-audio` (public)
- Bucket: `room-audio-uploads` (public, for admin uploads)
- Store files as: `{room_id}.mp3`

**Room Audio Integration:**
In ChatHub:
- Check if audio exists: `/room-audio/{roomId}.mp3`
- Show audio player if available
- Play/pause controls
- Progress bar
- Volume control
- Download option

**Audio Upload (Admin):**
Via AdminAudioUpload:
- Select room from dropdown
- Upload MP3 file
- Automatic naming: `{room_id}.mp3`
- Preview before upload
- Replace existing audio option

**Frontend Audio Player:**
- Use HTML5 `<audio>` element
- Custom styled controls matching design system
- Show audio title from room data
- Remember playback position in localStorage

---

## PROMPT 13: Advanced Features & Polish

**User Profile Dashboard:**

Special room: `user_profile_dashboard.json`
- Interactive questionnaire about user's life
- Topics: health, relationships, career, goals
- Store responses in user_knowledge_profile
- Use for personalized room recommendations

**Welcome Back System:**

**Create: `src/components/WelcomeBack.tsx`**
- Show on return visits
- "Continue where you left off"
- Resume incomplete rooms
- Show recommendation based on profile
- Celebration for streaks

**VIP Navigation:**

**Create: `src/components/VIPNavigation.tsx`**
- Tab navigation for VIP1/VIP2/VIP3 room grids
- Show lock icon on tabs if no access
- Upsell messaging for locked tiers

**Behavior Tracking:**

**user_behavior_tracking table:**
- interaction_type, room_id, interaction_data (jsonb)
- Track: room_entry, room_completion, question_asked, audio_played

**Create Hook: `src/hooks/useBehaviorTracking.ts`**
- `trackInteraction(type, roomId, data)`
- Use throughout app for analytics

**Room Analytics:**

**Create Hook: `src/hooks/useRoomAnalytics.ts`**
- Track session_start, session_end
- Count messages_sent
- Calculate time_spent_seconds
- Mark completed_room
- Update room_usage_analytics table

**Responsive Design:**
- Mobile hamburger menu
- Touch-friendly buttons (min 44px)
- Responsive grid layouts (1/2/3 columns)
- Mobile-optimized chat interface
- Bottom navigation on mobile

**Loading States:**
- Skeleton loaders for content
- Spinner for API calls
- Progressive image loading
- Optimistic UI updates

**Error Handling:**
- Toast notifications for errors
- Retry mechanisms
- Offline detection
- Fallback UI states

---

## PROMPT 14: SEO & Meta Tags

Add SEO optimization to all pages.

**Create: `src/lib/seo.ts`**
Helper functions:
- `generateMetaTags(title, description, keywords)`
- `generateStructuredData(type, data)`
- `generateCanonicalUrl(path)`

**Update Each Page with:**
```tsx
<Helmet>
  <title>Page Title - MercyBlade</title>
  <meta name="description" content="..." />
  <meta name="keywords" content="..." />
  <link rel="canonical" href={canonicalUrl} />
  <script type="application/ld+json">
    {JSON.stringify(structuredData)}
  </script>
</Helmet>
```

**Structured Data Types:**
- Organization (homepage)
- Course (room pages)
- FAQPage (help pages)
- Product (subscription tiers)

**robots.txt:**
Already exists at `public/robots.txt`

**Sitemap:**
- Generate dynamic sitemap from room data
- Include all public pages
- Update on content changes

---

## PROMPT 15: Testing & Deployment

**Environment Configuration:**

`.env` (auto-configured by Supabase):
- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY
- VITE_SUPABASE_PROJECT_ID

**Edge Function Secrets:**
- LOVABLE_API_KEY (for AI)
- PAYPAL_CLIENT_ID
- PAYPAL_CLIENT_SECRET
- PAYPAL_MODE (sandbox/live)

**Testing Checklist:**

1. Authentication:
   - [ ] Signup flow
   - [ ] Login flow
   - [ ] Auto-confirm emails enabled
   - [ ] Profile creation on signup

2. Access Control:
   - [ ] Free users can access free rooms
   - [ ] VIP users can access their tier rooms
   - [ ] Upgrade prompts for locked rooms
   - [ ] Daily limit enforcement

3. Room System:
   - [ ] Room loads correctly
   - [ ] Progress saves/loads
   - [ ] AI chat responds
   - [ ] Points awarded on completion

4. Payment:
   - [ ] Screenshot upload works
   - [ ] OCR extraction accurate
   - [ ] Admin can approve/reject
   - [ ] Subscription activates

5. Matchmaking (VIP3):
   - [ ] Preferences save
   - [ ] Matches generate
   - [ ] Private chat works
   - [ ] Real-time updates

6. Admin:
   - [ ] Dashboard loads
   - [ ] Stats display correctly
   - [ ] Can manage requests
   - [ ] Can verify payments

**Deployment Steps:**

1. Verify all Edge Functions deployed
2. Check RLS policies enabled on all tables
3. Confirm storage buckets configured
4. Test authentication flows
5. Verify API rate limits appropriate
6. Enable production mode for PayPal
7. Set up monitoring/logging
8. Configure custom domain
9. Enable CDN caching
10. Set up backup strategy

**Post-Deployment:**
- Monitor error rates
- Check AI API usage/costs
- Review user feedback
- Optimize slow queries
- Scale as needed

---

## Important Reference Files

When implementing, reference these files for complete context:
- `AI_DEVELOPMENT_PROMPT.md` - Full development guidelines
- `COMPLETE_IMPLEMENTATION_GUIDE.md` - All patterns and rules
- `src/data/system/Dictionary.json` - Moderation keywords
- `src/data/system/cross_topic_recommendations.json` - Room relationships

---

## Critical Rules Summary

1. **Always bilingual:** "English / Vietnamese"
2. **HSL colors only:** Never `text-white`, use semantic tokens
3. **Check access first:** Use `useUserAccess` before showing content
4. **Track everything:** Analytics, behavior, usage
5. **Award points:** Completion, daily login, milestones
6. **Secure RLS:** Every table must have proper policies
7. **Admin role check:** Use `has_role()` function
8. **Stream AI responses:** Token-by-token for better UX
9. **Handle errors:** Toast notifications, retry logic
10. **Mobile first:** Responsive at all breakpoints
11. **Edge Functions:** Copy room data, use LOVABLE_API_KEY
12. **Type safety:** Full TypeScript, no `any` types
13. **Accessibility:** ARIA labels, keyboard navigation

---

## Need Help?

If any prompt is unclear:
1. Check `COMPLETE_IMPLEMENTATION_GUIDE.md` for patterns
2. Review `AI_DEVELOPMENT_PROMPT.md` for guidelines
3. Look at existing similar components in codebase
4. Ask for clarification on specific implementation details

Copy each prompt above sequentially to recreate the entire MercyBlade application.
