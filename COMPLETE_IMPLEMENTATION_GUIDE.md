# Complete Implementation Guide
## Mental Health & Wellness Learning Platform

This document captures all key decisions, patterns, and implementation details from the development conversation.

---

## 1. PROJECT OVERVIEW

**Core Concept**: A bilingual (English/Vietnamese) mental health and wellness learning platform with AI-powered chat rooms, subscription tiers, and gamification.

**Tech Stack**:
- React 18 + TypeScript + Vite
- Tailwind CSS (HSL semantic tokens only)
- Supabase (auth, database, edge functions, storage)
- Radix UI + shadcn/ui components
- React Query for data fetching
- Zod for validation

---

## 2. CRITICAL DESIGN PATTERNS

### 2.1 Color System (ABSOLUTELY CRITICAL)
```css
/* NEVER use direct colors like bg-blue-500, text-white, bg-black */
/* ALWAYS use HSL semantic tokens from index.css */

:root {
  --primary: [hsl values];
  --secondary: [hsl values];
  --accent: [hsl values];
  --background: [hsl values];
  --foreground: [hsl values];
  --muted: [hsl values];
}

/* Usage in components */
<div className="bg-primary text-primary-foreground">
<Button variant="secondary">Click</Button>
```

### 2.2 Bilingual Support Pattern
**MANDATORY FORMAT**: `English / Vietnamese`

```tsx
// UI Elements
<Button>Submit / Gửi</Button>
<h1>Welcome Back / Chào Mừng Trở Lại</h1>

// Toasts
toast({
  title: "Success / Thành công",
  description: "Changes saved / Đã lưu thay đổi"
});

// Form Labels
<Label>Email / Email</Label>
<Label>Password / Mật khẩu</Label>

// Error Messages
"Invalid credentials / Thông tin đăng nhập không hợp lệ"
```

---

## 3. AUTHENTICATION & AUTHORIZATION

### 3.1 User Roles System
```sql
-- Enum for roles
create type public.app_role as enum ('admin', 'moderator', 'user');

-- User roles table (NEVER store roles on profiles table)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

-- Security definer function (prevents RLS recursion)
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;
```

### 3.2 Subscription Tiers
- **Free**: Limited daily access (e.g., 5 rooms/day)
- **VIP1**: Enhanced access + custom topic requests
- **VIP2**: More access + relationship-focused content
- **VIP3**: Full access + matchmaking features

### 3.3 useUserAccess Hook Pattern
```tsx
export type UserTier = 'free' | 'vip1' | 'vip2' | 'vip3';

interface UserAccess {
  isAdmin: boolean;
  tier: UserTier;
  canAccessVIP1: boolean;
  canAccessVIP2: boolean;
  canAccessVIP3: boolean;
  loading: boolean;
}

// Usage in components
const { isAdmin, tier, canAccessVIP3, loading } = useUserAccess();

if (loading) return <LoadingScreen />;
if (!canAccessVIP3 && roomTier === 'vip3') {
  return <AccessDeniedDialog />;
}
```

---

## 4. DATABASE SCHEMA PATTERNS

### 4.1 Core Tables

```sql
-- Profiles (auto-created on signup)
create table public.profiles (
  id uuid primary key references auth.users(id),
  email text,
  full_name text,
  username text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Subscription tiers
create table public.subscription_tiers (
  id uuid primary key default gen_random_uuid(),
  name text not null, -- 'Free', 'VIP1', 'VIP2', 'VIP3'
  name_vi text not null,
  price_monthly numeric not null,
  room_access_per_day integer,
  custom_topics_allowed integer,
  priority_support boolean default false,
  display_order integer not null,
  is_active boolean default true
);

-- User subscriptions
create table public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  tier_id uuid references subscription_tiers(id) not null,
  status text default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  stripe_subscription_id text,
  stripe_customer_id text,
  created_at timestamptz default now()
);

-- Rooms (learning content)
create table public.rooms (
  id text primary key,
  schema_id text not null,
  title_en text not null,
  title_vi text not null,
  tier text default 'free', -- 'free', 'vip1', 'vip2', 'vip3'
  keywords text[],
  entries jsonb default '[]'::jsonb,
  room_essay_en text,
  room_essay_vi text,
  safety_disclaimer_en text,
  safety_disclaimer_vi text,
  crisis_footer_en text,
  crisis_footer_vi text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Points system
create table public.user_points (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) not null,
  total_points integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.point_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  points integer not null,
  transaction_type text not null, -- 'room_completion', 'milestone', 'daily_login'
  description text,
  room_id text,
  created_at timestamptz default now()
);

-- Feedback system
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  message text not null,
  status text default 'new', -- 'new', 'in_progress', 'resolved'
  priority text default 'normal', -- 'low', 'normal', 'high'
  category text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Room analytics
create table public.room_usage_analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  room_id text not null,
  session_start timestamptz default now(),
  session_end timestamptz,
  messages_sent integer default 0,
  time_spent_seconds integer default 0,
  completed_room boolean default false,
  created_at timestamptz default now()
);

-- Promo codes
create table public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  description text,
  daily_question_limit integer default 20,
  max_redemptions integer default 1,
  current_redemptions integer default 0,
  expires_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Payment proofs (manual verification)
create table public.payment_proof_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  tier_id uuid references subscription_tiers(id) not null,
  username text not null,
  screenshot_url text not null,
  payment_method text default 'paypal_manual',
  status text default 'pending', -- 'pending', 'approved', 'rejected'
  extracted_amount numeric,
  extracted_date timestamptz,
  extracted_email text,
  extracted_transaction_id text,
  ocr_confidence numeric,
  verification_method text,
  verified_by uuid references auth.users(id),
  verified_at timestamptz,
  admin_notes text,
  created_at timestamptz default now()
);
```

### 4.2 RLS Policies Pattern
```sql
-- Enable RLS
alter table public.profiles enable row level security;

-- Users can view their own profile
create policy "Users can view their own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id);

-- Admins can view all
create policy "Admins can view all profiles"
on public.profiles for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));
```

---

## 5. KEY COMPONENTS & PAGES

### 5.1 Page Structure Pattern
```tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ExamplePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: accessLoading } = useUserAccess();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessLoading && !isAdmin) {
      toast({
        title: "Access Denied / Truy cập bị từ chối",
        description: "Admin access required / Yêu cầu quyền quản trị",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, accessLoading, navigate, toast]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('table_name')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error / Lỗi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (accessLoading || loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          ← Back / Quay lại
        </Button>

        <h1 className="text-4xl font-bold mb-2">Page Title / Tiêu đề</h1>
        <p className="text-muted-foreground mb-8">Description / Mô tả</p>

        {/* Content */}
        <div className="grid gap-4">
          {data.map(item => (
            <Card key={item.id} className="p-6">
              {/* Card content */}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamplePage;
```

### 5.2 Common UI Patterns

**Status Badges:**
```tsx
<Badge variant={status === 'active' ? 'default' : 'secondary'}>
  {status === 'active' ? 'Active / Hoạt động' : 'Inactive / Không hoạt động'}
</Badge>
```

**Loading States:**
```tsx
{loading ? (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
) : (
  // Content
)}
```

**Empty States:**
```tsx
{data.length === 0 ? (
  <Card className="p-8 text-center">
    <p className="text-muted-foreground">No data found / Không có dữ liệu</p>
  </Card>
) : (
  // Data display
)}
```

---

## 6. EDGE FUNCTIONS

### 6.1 AI Chat Function Pattern
```typescript
// supabase/functions/ai-chat/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, roomId, conversationHistory } = await req.json();
    
    // Load room data
    const roomData = await import(`./data/${roomId}.json`);
    
    // Call Lovable AI API
    const response = await fetch('https://api.lovable.app/v1/ai/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-5-mini',
        messages: [
          { role: 'system', content: roomData.systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        stream: true,
      }),
    });

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

### 6.2 Payment Verification Function
```typescript
// supabase/functions/verify-payment-screenshot/index.ts
// Uses Lovable AI for OCR to extract payment info from screenshots
// Auto-approves if confidence > 0.85 and amount matches
// Otherwise, creates pending submission for admin review
```

---

## 7. CONTENT STRUCTURE

### 7.1 Room JSON Format
```json
{
  "id": "room_id",
  "schema_id": "unique_schema",
  "title_en": "English Title",
  "title_vi": "Tiếng Việt Title",
  "tier": "free",
  "keywords": ["keyword1", "keyword2"],
  "entries": [
    {
      "entry_number": 1,
      "keywords": ["specific", "keywords"],
      "word_count_en": 150,
      "word_count_vi": 150,
      "content_en": "75-150 word response...",
      "content_vi": "75-150 word response..."
    }
  ],
  "room_essay_en": "400-600 word comprehensive essay",
  "room_essay_vi": "400-600 word comprehensive essay",
  "safety_disclaimer_en": "Disclaimer text",
  "safety_disclaimer_vi": "Disclaimer text"
}
```

### 7.2 Content Word Count Guidelines
- **Quick responses/tips**: 50-100 words
- **Detailed entries**: 75-150 words (EXPANDED from 30-40)
- **Comprehensive essays**: 400-600 words
- **Safety disclaimers**: 40-80 words

---

## 8. ROUTING STRUCTURE

```tsx
// src/App.tsx routes
{
  path: "/",
  element: <Index />
},
{
  path: "/auth",
  element: <Auth />
},
{
  path: "/chat/:roomId",
  element: <ChatHub />
},
{
  path: "/rooms",
  element: <AllRooms />
},
{
  path: "/rooms/vip1",
  element: <RoomGridVIP1 />
},
{
  path: "/rooms/vip2",
  element: <RoomGridVIP2 />
},
{
  path: "/rooms/vip3",
  element: <RoomGridVIP3 />
},
{
  path: "/admin",
  element: <AdminDashboard />
},
{
  path: "/admin/stats",
  element: <AdminStats />
},
{
  path: "/manual-payment",
  element: <ManualPayment />
},
{
  path: "/matchmaking",
  element: <MatchmakingHub />
}
```

---

## 9. KEY FEATURES IMPLEMENTATION

### 9.1 Points System
- Award 10 points every 10 questions in a room
- Track via `usePoints` hook
- Display in header via `<PointsDisplay />`

### 9.2 Credit Limits
- Free users: 30 questions/day (or promo code limit)
- VIP users: Unlimited
- Check via `useCredits` hook
- Display modal when limit reached

### 9.3 Room Progress
- Track via `useRoomProgress` hook
- Save to `room_usage_analytics` table
- Display progress bar via `<RoomProgress />`

### 9.4 Matchmaking (VIP3 only)
- Knowledge profile tracking
- AI-powered compatibility scoring
- Match suggestions with reasons
- Private chat requests

### 9.5 Payment Methods
- PayPal (automated via API)
- Manual screenshot upload with AI verification
- Admin verification dashboard

---

## 10. RESPONSIVE DESIGN PATTERNS

```tsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  
// Hide on mobile
<div className="hidden md:block">

// Mobile navigation
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="md:hidden">
      <Menu className="h-6 w-6" />
    </Button>
  </SheetTrigger>
</Sheet>
```

---

## 11. ERROR HANDLING PATTERNS

```tsx
try {
  const { data, error } = await supabase.from('table').select('*');
  if (error) throw error;
  // Success handling
} catch (error) {
  console.error('Error:', error);
  toast({
    title: "Error / Lỗi",
    description: error.message || "An error occurred / Đã xảy ra lỗi",
    variant: "destructive",
  });
}
```

---

## 12. DEPLOYMENT CHECKLIST

- [ ] Enable email auto-confirm in Supabase Auth settings
- [ ] Set up PayPal credentials in Supabase secrets
- [ ] Configure LOVABLE_API_KEY for AI features
- [ ] Deploy edge functions
- [ ] Upload room audio files to storage bucket
- [ ] Configure storage bucket policies
- [ ] Set up admin user roles
- [ ] Test payment flows (both automated and manual)
- [ ] Verify RLS policies on all tables
- [ ] Test all subscription tier access controls

---

## 13. CRITICAL RULES SUMMARY

1. **NEVER** use direct colors (bg-blue-500, text-white) - always use HSL semantic tokens
2. **ALWAYS** bilingual format: `English / Vietnamese`
3. **NEVER** store roles on profiles table - use separate user_roles table
4. **ALWAYS** use security definer functions for role checks
5. **ALWAYS** check user access before rendering protected content
6. **ALWAYS** enable RLS on all tables
7. **ALWAYS** use `useUserAccess`, `usePoints`, `useCredits` hooks
8. **ALWAYS** handle loading and error states
9. **ALWAYS** show toast notifications for user actions
10. **ALWAYS** use proper TypeScript types

---

This guide contains all patterns, decisions, and implementation details needed to recreate or extend this application.
