# PAGE-BY-PAGE IMPLEMENTATION PROMPTS
## Exact Recreation Guide for Mercy Blade Application

This document provides detailed prompts for recreating each page of the Mercy Blade application exactly as implemented. Use these prompts sequentially with the other documentation files.

**Prerequisites**: Before using these prompts, ensure you have:
- `AI_DEVELOPMENT_PROMPT.md` (architecture & patterns)
- `COMPLETE_IMPLEMENTATION_GUIDE.md` (full context)
- `UI_SPECIFICATION_GUIDE.md` (styling system)
- `Dictionary.json` and `cross_topic_recommendations.json`
- Sample room JSON files

---

## TABLE OF CONTENTS

1. [App Router & Layout Setup](#1-app-router--layout-setup)
2. [Welcome Page (Landing)](#2-welcome-page-landing)
3. [Authentication Page](#3-authentication-page)
4. [Room Grid Pages](#4-room-grid-pages)
5. [Chat Hub (Main Chat Interface)](#5-chat-hub-main-chat-interface)
6. [Matchmaking Hub](#6-matchmaking-hub)
7. [Manual Payment Page](#7-manual-payment-page)
8. [Promo Code Page](#8-promo-code-page)
9. [VIP Request Pages](#9-vip-request-pages)
10. [Admin Pages](#10-admin-pages)
11. [Shared Components](#11-shared-components)

---

## 1. APP ROUTER & LAYOUT SETUP

### Prompt 1.1: Create Main App Router

```
Create the main App.tsx router component with the following specifications:

ROUTING STRUCTURE:
- "/" → Welcome page (landing)
- "/auth" → Authentication (sign in/sign up)
- "/rooms" → RoomGrid (free rooms)
- "/rooms-vip1" → RoomGridVIP1
- "/rooms-vip2" → RoomGridVIP2
- "/rooms-vip3" → RoomGridVIP3
- "/all-rooms" → AllRooms (admin view)
- "/chat/:roomId" → ChatHub (main chat interface)
- "/vip-request" → VIPRequestForm
- "/vip-requests" → VIPRequests (user's requests)
- "/vip-topic-request" → VIPTopicRequest
- "/matchmaking" → MatchmakingHub (VIP3 only)
- "/subscribe" → PaymentTest
- "/manual-payment" → ManualPayment
- "/promo-code" → PromoCode
- "/admin" → AdminDashboard
- "/admin/vip-rooms" → AdminVIPRooms
- "/admin/reports" → AdminReports
- "/admin/stats" → AdminStats
- "/admin/payments" → AdminPaymentVerification
- "/admin/audio" → AdminAudioUpload
- "*" → NotFound

REQUIRED SETUP:
- Use React Router DOM v6
- Setup QueryClient from @tanstack/react-query
- Include TooltipProvider from shadcn
- Add Toaster and Sonner for notifications
- Include AdminFloatingButton component globally

IMPORTS NEEDED:
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminFloatingButton } from "@/components/AdminFloatingButton";

The AdminFloatingButton should be placed inside BrowserRouter but outside Routes, so it appears on all pages.
```

---

## 2. WELCOME PAGE (LANDING)

### Prompt 2.1: Create Welcome Page Layout

```
Create the Welcome page (src/pages/Welcome.tsx) with these exact specifications:

PAGE STRUCTURE:
1. Header with authentication status
2. Hero section with app title and description
3. Points display component
4. Navigation buttons to room categories
5. Subscription tier cards
6. Footer with disclaimer

HEADER SECTION:
Left side:
- Button: "Home Page / Trang Chủ" (navigate to "/")
- Variant: outline
- Style: border-2 border-primary/50 hover:bg-primary/10

Right side (if user logged in):
- User info badge: bg-primary/10 with User icon
- Display: profile.username or email (before @)
- Logout button with LogOut icon

Right side (if not logged in):
- "Sign In / Đăng Nhập" button (navigate to "/auth")

HERO SECTION:
- H1: "Mercy Blade" with gradient text: "text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
- Points display component (PointsDisplay)
- Bilingual description (English + Vietnamese)
- Card with app description: max-w-4xl with gradient background "bg-gradient-to-br from-primary/5 via-background to-secondary/5"

NAVIGATION BUTTONS (4 buttons):
All buttons should be TooltipProvider wrapped with size="lg" and border-2:

1. Free Rooms:
   - Always accessible
   - border-primary
   - Navigate to "/rooms"

2. VIP1 Rooms:
   - Disabled if !canAccessVIP1
   - border-accent
   - Navigate to "/rooms-vip1"
   - Tooltip: "Only for VIP1" when disabled

3. VIP2 Rooms:
   - Disabled if !canAccessVIP2
   - border-primary
   - Navigate to "/rooms-vip2"
   - Tooltip: "Only for VIP2" when disabled

4. VIP3 Rooms:
   - Disabled if !canAccessVIP3
   - border-secondary
   - Navigate to "/rooms-vip3"
   - Tooltip: "Only for VIP3" when disabled

Each button shows bilingual text (English / Vietnamese)

VIP INFO BANNER:
- "🌟 VIP members can request custom topics tailored to their needs"
- Bilingual text
- Center aligned

SUBSCRIPTION TIERS:
Display 4 tier cards in a grid (md:grid-cols-2 lg:grid-cols-4):

Tier 1 - FREE:
- Price: $0
- Features (bilingual):
  * "10 random entries/day"
  * "Achievement badges"
  * "Learning streaks"
- Button: Golden gradient arrow (from-yellow-200 via-yellow-400 to-yellow-600)
- Requires authentication to use
- Tooltip when not logged in: "Please register first"

Tier 2 - VIP1:
- Price: $2/month
- Features (bilingual):
  * "Users can request one custom topic"
  * "1 full room access/day"
  * "🤖 AI Content"
- Button: Golden gradient (from-yellow-300 via-yellow-500 to-yellow-700)
- Navigate to "/subscribe?tier=vip1"

Tier 3 - VIP2:
- Price: $4/month
- Features (bilingual):
  * "Users can request two custom topics"
  * "2 full rooms access/day"
  * "🤖 AI Content"
- Button: Golden gradient (from-yellow-400 via-yellow-600 to-yellow-800)
- Navigate to "/subscribe?tier=vip2"

Tier 4 - VIP3:
- Price: $6/month
- Features (bilingual):
  * "Users can request three custom topics"
  * "3 rooms access/day"
  * "AI Matchmaking"
  * "Voice chat"
  * "🤖 AI Content"
- Button: Golden gradient (from-yellow-500 via-yellow-700 to-yellow-900)
- Navigate to "/subscribe?tier=vip3"

GOLDEN ARROW BUTTONS:
- Size: w-14 h-14
- Shape: rounded-full
- Icon: ArrowRight (w-6 h-6 text-white)
- Position: Center bottom of each card

DISCLAIMER CARD:
- max-w-4xl mx-auto mt-12
- p-3 bg-primary/5 border-primary/20
- Text size: text-xs text-muted-foreground
- Bilingual medical disclaimer

FOOTER INFO:
- Bilingual learning description
- text-sm and text-xs
- text-muted-foreground

PAGE BACKGROUND:
style={{ background: 'hsl(var(--page-welcome))' }}

HOOKS NEEDED:
- useNavigate from react-router-dom
- useUserAccess for tier checking
- useState for user/profile state
- useEffect for auth state checking
- supabase.auth.getUser() and onAuthStateChange

USERNAME SETUP:
- Show UsernameSetup component if user has no username
- Only show after isCheckingProfile is false
- Pass onComplete callback to refresh profile
```

---

## 3. AUTHENTICATION PAGE

### Prompt 3.1: Create Auth Page with Tabs

```
Create the Authentication page (src/pages/Auth.tsx) with these specifications:

PAGE LAYOUT:
- Full screen centered: min-h-screen bg-background flex items-center justify-center
- Card: max-w-md w-full p-6
- Title: "Welcome" (text-3xl font-bold)

TAB STRUCTURE:
Use shadcn Tabs component with 2 tabs:
1. "Sign In" tab
2. "Sign Up" tab

Default tab: "signin"

SIGN IN TAB FORM:
Fields:
1. Email input:
   - Type: email
   - Placeholder: "your@email.com"
   - Required
   - Saved to localStorage as 'mercyblade_email'
   - Pre-filled from localStorage if exists

2. Password input:
   - Type: password (with toggle)
   - Placeholder: "••••••••"
   - Required
   - Show/hide password toggle button (Eye/EyeOff icons)
   - Toggle button positioned: absolute right-3 top-1/2 -translate-y-1/2

3. Submit button:
   - Text: "Sign In" (or "Signing in..." when loading)
   - Full width
   - Disabled when loading

4. Forgot password link:
   - variant="link"
   - Text: "Forgot password?"
   - Shows reset password form

SIGN UP TAB FORM:
Fields:
1. Email input (same as sign in)

2. Password input:
   - Label: "Password (min 6 characters)"
   - minLength: 6
   - With show/hide toggle

3. Submit button:
   - Text: "Sign Up" (or "Creating account..." when loading)
   - Full width
   - Disabled when loading

SIGN UP FLOW:
1. Call supabase.auth.signUp with emailRedirectTo
2. On success, auto sign-in immediately
3. Navigate to "/"
4. Toast: "Account created successfully"

SIGN IN FLOW:
1. Call supabase.auth.signInWithPassword
2. Navigate to "/"
3. Toast: "Welcome back!"

PASSWORD RESET FORM:
Shown when showReset is true:
- Single email input
- "Send Reset Link" button
- "Back to Sign In" button
- Call supabase.auth.resetPasswordForEmail
- redirectTo: current origin + "/auth"

BOTTOM ACTIONS:
- "Back to Home" button (ghost variant)
- Navigate to "/"

AUTH STATE MANAGEMENT:
- useEffect to check auth state
- supabase.auth.onAuthStateChange
- Auto-navigate to "/" if SIGNED_IN event

PASSWORD VISIBILITY:
- Two separate state variables: showSignInPassword, showSignUpPassword
- Toggle buttons with Eye/EyeOff icons from lucide-react
- Size: 20px
- Color: text-muted-foreground hover:text-foreground

ERROR HANDLING:
- Use toast with variant="destructive"
- Display error.message from Supabase

LOADING STATES:
- Disable all inputs and buttons when loading
- Show loading text on submit buttons

ICONS USED:
- Eye, EyeOff from lucide-react
```

---

## 4. ROOM GRID PAGES

### Prompt 4.1: Create Free Rooms Grid Page

```
Create the RoomGrid page (src/pages/RoomGrid.tsx) for free rooms:

PAGE STRUCTURE:
1. Back button header
2. Page title (bilingual)
3. Legend badges
4. Room cards grid
5. Footer note

BACKGROUND:
style={{ background: 'hsl(var(--page-roomgrid))' }}

CONTAINER:
- container mx-auto px-4 py-8 max-w-7xl

HEADER SECTION:
Left side:
- Back button (variant="ghost")
- "← Back / Quay Lại"
- Navigate to "/"

Right side (2 buttons):
1. "My Requests" button:
   - variant="outline"
   - Icon: BarChart3
   - Navigate to "/vip-requests"

2. "Request Custom Room" button:
   - gradient: "bg-gradient-to-r from-primary to-accent"
   - Icon: Sparkles
   - Navigate to "/vip-request"

PAGE TITLE:
- H1: "Choose Your Learning Room"
- Gradient text: "bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
- Font: text-4xl font-bold
- Subtitle (Vietnamese): "Chọn Phòng Học Của Bạn"

LEGEND:
Single badge showing what's ready:
- Badge: "bg-green-100 text-green-700 border-green-300"
- Icon: CheckCircle2 (w-3 h-3)
- Text: "Ready / Sẵn Sàng"

ROOM GRID:
Grid classes: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"

Filter: Show only rooms where tier === "free"
Source: ALL_ROOMS from @/lib/roomData

ROOM CARD STRUCTURE:
Each card wrapped in Tooltip:

Card classes:
"relative p-3 transition-all duration-300 cursor-pointer group hover:scale-110 hover:shadow-hover hover:z-10"

If !room.hasData:
- Add "opacity-60 cursor-not-allowed"
- Don't add hover effects

STATUS BADGE (Top Right - absolute top-1 right-1 z-10):
If hasData:
- Green circle: "bg-green-500 rounded-full p-1"
- Icon: CheckCircle2 (w-3 h-3 text-white)

If !hasData:
- Gray circle: "bg-gray-400 rounded-full p-1"
- Icon: Lock (w-3 h-3 text-white)

ROOM NAMES:
1. English name:
   - "text-xs font-semibold text-foreground leading-tight line-clamp-2"
   
2. Vietnamese name:
   - "text-[10px] text-muted-foreground leading-tight line-clamp-2"

HOVER EFFECT OVERLAY:
Gradient overlay (only if hasData):
"absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"

TOOLTIP:
Content: "Click to enter" or "Coming soon"

CLICK HANDLER:
1. Return early if !room.hasData
2. Check authentication for free rooms:
   - If not authenticated, show toast: "Please register first"
   - Return without navigation
3. Check VIP access for VIP rooms
4. Navigate to `/chat/${room.id}`

FOOTER NOTE:
Bilingual centered text:
- "Rooms with ✓ are ready for learning"
- "Các Phòng Có ✓ Đã Sẵn Sàng Để Học"
- Styling: text-sm and text-xs text-muted-foreground

AUTHENTICATION CHECK:
- useEffect to check supabase.auth.getUser()
- Store result in isAuthenticated state

ACCESS CONTROL:
- Use useUserAccess hook for canAccessVIP1, canAccessVIP2, canAccessVIP3
- Use useToast for error messages

ROOM DATA:
Import from: import { ALL_ROOMS } from "@/lib/roomData"
```

### Prompt 4.2: Create VIP Room Grid Pages

```
Create RoomGridVIP1, RoomGridVIP2, and RoomGridVIP3 pages:

These are nearly identical to RoomGrid but with these differences:

ROOMGRID VIP1 (src/pages/RoomGridVIP1.tsx):
- Background: style={{ background: 'hsl(var(--page-vip1))' }}
- Filter: tier === "vip1"
- Title includes "VIP1" badge
- Access check: if !canAccessVIP1, show AccessDenied alert

ROOMGRID VIP2 (src/pages/RoomGridVIP2.tsx):
- Background: style={{ background: 'hsl(var(--page-vip2))' }}
- Filter: tier === "vip2"
- Title includes "VIP2" badge
- Access check: if !canAccessVIP2, show AccessDenied alert

ROOMGRID VIP3 (src/pages/RoomGridVIP3.tsx):
- Background: style={{ background: 'hsl(var(--page-vip3))' }}
- Filter: tier === "vip3"
- Title includes "VIP3" badge
- Access check: if !canAccessVIP3, show AccessDenied alert

ACCESS DENIED ALERT DIALOG:
Use AlertDialog component:

Title: "VIP Only / Chỉ Dành Cho VIP"

Description (bilingual):
- "This room is for VIP members only. Please upgrade your subscription to access this content."
- Vietnamese translation
- Show required tier
- Show user's current tier

Action button:
- Text: "Go Back / Quay Lại"
- onClick: navigate(-1) or navigate('/')

VIP BADGE IN TITLE:
Add after the main title:
<Badge className="ml-2 bg-gradient-to-r from-accent to-primary text-white">
  VIP1 / VIP2 / VIP3
</Badge>

All other structure remains the same as RoomGrid.
```

---

## 5. CHAT HUB (MAIN CHAT INTERFACE)

### Prompt 5.1: Create ChatHub Page - Layout & Structure

```
Create the ChatHub page (src/pages/ChatHub.tsx) - the main chat interface:

PAGE STRUCTURE:
1. Access control (VIP check)
2. Header with room info and controls
3. Main chat area
4. Sidebar tabs (Feedback, Room chat)
5. Input area with mode selector

BACKGROUND:
Dynamic based on room tier:
```typescript
const getBgColor = () => {
  if (!roomInfo) return 'hsl(var(--background))';
  switch (roomInfo.tier) {
    case 'vip1': return 'hsl(var(--page-vip1))';
    case 'vip2': return 'hsl(var(--page-vip2))';
    case 'vip3': return 'hsl(var(--page-vip3))';
    default: return 'hsl(var(--background))';
  }
};
```

ROUTE PARAMS:
- Get roomId from useParams()
- Load room info: getRoomInfo(roomId)

STATE MANAGEMENT:
Required state:
- mainMessages: Message[] (main chat)
- feedbackMessages: Message[] (feedback tab)
- roomMessages: Message[] (room chat tab)
- mainInput, feedbackInput, roomInput: string
- isLoading: boolean
- noKeywordCount: number
- matchedEntryCount: number
- userMessageCount: number
- contentMode: "ai" | "keyword" (saved to localStorage)
- showAccessDenied: boolean
- showCreditLimit: boolean

Message interface:
```typescript
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  relatedRooms?: string[];
}
```

HOOKS NEEDED:
- useParams, useNavigate from react-router-dom
- useRoomProgress(roomId)
- useBehaviorTracking(roomId)
- usePoints()
- useUserAccess()
- useCredits()
- useToast()
- Custom refs: mainScrollRef

ACCESS CONTROL:
In useEffect, check:
```typescript
const hasAccess = 
  info.tier === 'free' ||
  (info.tier === 'vip1' && canAccessVIP1) ||
  (info.tier === 'vip2' && canAccessVIP2) ||
  (info.tier === 'vip3' && canAccessVIP3);

if (!hasAccess) {
  setShowAccessDenied(true);
}
```

Show AlertDialog with access denied message and "Go Back" button.
```

### Prompt 5.2: Create ChatHub - Header Section

```
Create the header section of ChatHub:

LAYOUT:
"flex items-center justify-between bg-card rounded-lg p-4 shadow-soft"

LEFT SECTION:
Back button:
- variant="ghost"
- Icon: ArrowLeft (w-4 h-4)
- Text: "Back / Quay Lại"
- Navigate to "/rooms"

CENTER SECTION:
Room information (text-center space-y-2):
1. Room name (English):
   - "text-xl font-bold text-foreground"
   - From: currentRoom.nameEn

2. Room name (Vietnamese):
   - "text-sm text-muted-foreground"
   - From: currentRoom.nameVi

3. Content mode selector:
   - Label: "Choose content mode / Chọn chế độ nội dung:" (text-xs text-muted-foreground)
   - ToggleGroup component with 2 options:

   Option 1 - Keyword mode:
   - Value: "keyword"
   - Always available
   - Display: "📚 Keyword"
   - Background: "bg-card p-1 rounded-lg"
   - Active style: "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"

   Option 2 - AI mode:
   - Value: "ai"
   - Disabled if !canAccessVIP1
   - Display: "🤖 AI"
   - Active style: "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
   - If disabled and clicked, show toast: "VIP Required"

Save contentMode to localStorage: `contentMode_${roomId}`
Load from localStorage on mount

RIGHT SECTION:
Two components:
1. CreditsDisplay component
2. RoomProgress component (if progress data available)
```

### Prompt 5.3: Create ChatHub - Message Display

```
Create the message display area in ChatHub:

MESSAGE BUBBLE COMPONENT:
```typescript
const MessageBubble = ({ message }: { message: Message }) => (
  <div className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-4`}>
    <div className="max-w-[80%] group">
      <div
        className={`rounded-2xl px-4 py-3 ${
          message.isUser
            ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground"
            : "bg-card border shadow-sm"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        {message.isUser && (
          <span className="text-xs opacity-70 mt-1 block">
            {message.timestamp.toLocaleTimeString()}
          </span>
        )}
      </div>
      
      {!message.isUser && (
        <>
          <MessageActions text={message.text} roomId={roomId || ""} />
          {message.relatedRooms && message.relatedRooms.length > 0 && (
            <RelatedRooms roomNames={message.relatedRooms} />
          )}
        </>
      )}
    </div>
  </div>
);
```

SCROLL AREA:
Main messages container:
- Use ScrollArea component
- Height: flexible (use ref for auto-scroll)
- Ref: mainScrollRef
- Auto-scroll on new messages

WELCOME MESSAGE:
On mount (when mainMessages.length === 0):
```typescript
const welcomeMessage: Message = {
  id: 'welcome',
  text: `Hello! Welcome to ${currentRoom.nameEn} room. How can I help you today?\n\nXin chào! Chào mừng bạn đến với phòng ${currentRoom.nameVi}. Tôi có thể giúp gì cho bạn hôm nay?`,
  isUser: false,
  timestamp: new Date()
};
```

AUTO-SCROLL EFFECT:
```typescript
useEffect(() => {
  if (mainScrollRef.current) {
    mainScrollRef.current.scrollTop = mainScrollRef.current.scrollHeight;
  }
}, [mainMessages]);

// Auto-scroll during AI typing
useEffect(() => {
  if (isLoading && mainScrollRef.current) {
    const scrollInterval = setInterval(() => {
      if (mainScrollRef.current) {
        mainScrollRef.current.scrollTop = mainScrollRef.current.scrollHeight;
      }
    }, 100);
    
    return () => clearInterval(scrollInterval);
  }
}, [isLoading]);
```
```

### Prompt 5.4: Create ChatHub - Message Sending Logic

```
Create the message sending logic for ChatHub:

INPUT VALIDATION:
Use messageSchema from @/lib/inputValidation:
```typescript
const validation = messageSchema.safeParse({ text: mainInput });
if (!validation.success) {
  toast({
    title: "Invalid Input / Đầu Vào Không Hợp Lệ",
    description: validation.error.issues[0].message,
    variant: "destructive"
  });
  return;
}
```

CREDIT CHECK:
Before sending message:
```typescript
if (!hasCreditsRemaining()) {
  setShowCreditLimit(true);
  return;
}
```

POINTS SYSTEM:
Track user messages and award points every 10 messages:
```typescript
const newCount = userMessageCount + 1;
setUserMessageCount(newCount);
if (newCount % 10 === 0) {
  await awardPoints(10, 'questions_completed', `Completed ${newCount} questions in ${currentRoom.nameEn}`, roomId);
  toast({
    title: "Points Awarded! / Điểm Thưởng!",
    description: `You earned 10 points for completing ${newCount} questions!`,
  });
}
```

KEYWORD MODE LOGIC:
```typescript
if (contentMode === "keyword") {
  // Add typing indicator
  const typingMessage: Message = {
    id: (Date.now() + 1).toString(),
    text: '...',
    isUser: false,
    timestamp: new Date()
  };
  setMainMessages(prev => [...prev, typingMessage]);
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get keyword response
  const response = keywordRespond(roomId || "", currentInput, noKeywordCount, matchedEntryCount);
  
  // Update counters
  if (response.matched) {
    setMatchedEntryCount(prev => prev + 1);
    setNoKeywordCount(0);
  } else {
    setNoKeywordCount(prev => prev + 1);
  }
  
  // Replace typing indicator with response
  setMainMessages(prev => 
    prev.map(m => 
      m.id === typingMessage.id 
        ? { 
            ...m, 
            text: response.text.replace(/\*\*/g, '').replace(/(?:\n|\s)*\d{1,2}:\d{2}:\d{2}\s?(AM|PM)?\.?$/i, '').trim(), 
            relatedRooms: response.relatedRooms 
          }
        : m
    )
  );
}
```

AI MODE LOGIC (STREAMING):
```typescript
if (contentMode === "ai") {
  // Create temporary AI message
  const aiMessageId = (Date.now() + 1).toString();
  const tempAiMessage: Message = {
    id: aiMessageId,
    text: '',
    isUser: false,
    timestamp: new Date()
  };
  setMainMessages(prev => [...prev, tempAiMessage]);
  
  // Build conversation history
  const conversationHistory = mainMessages
    .filter(m => m.id !== 'welcome')
    .map(m => ({
      role: m.isUser ? 'user' : 'assistant',
      content: m.text
    }));
  conversationHistory.push({ role: 'user', content: currentInput });
  
  // Call AI chat endpoint
  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
  const response = await fetch(CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({
      roomId: roomId,
      messages: conversationHistory
    }),
  });
  
  // Handle streaming response
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulatedText = '';
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value, { stream: true });
    // Parse SSE format and extract content
    // Update message with accumulated text
    setMainMessages(prev =>
      prev.map(m =>
        m.id === aiMessageId ? { ...m, text: cleanedText } : m
      )
    );
  }
}
```

ERROR HANDLING:
- Catch all errors
- Show toast with error message
- Remove temporary messages on error
- Handle specific status codes:
  - 429: "Too many requests"
  - 402: "AI service temporarily unavailable"
```

### Prompt 5.5: Create ChatHub - Input Area

```
Create the input area for ChatHub:

CONTAINER:
"p-4 bg-card rounded-lg border shadow-sm"

LAYOUT:
"flex gap-2"

INPUT FIELD:
```typescript
<Input
  placeholder="Type your message / Nhập tin nhắn..."
  value={mainInput}
  onChange={(e) => setMainInput(e.target.value)}
  onKeyPress={(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMainMessage();
    }
  }}
  className="flex-1"
  disabled={isLoading}
/>
```

SEND BUTTON:
```typescript
<Button 
  onClick={sendMainMessage}
  disabled={!mainInput.trim() || isLoading}
  size="icon"
>
  {isLoading ? (
    <Loader2 className="w-4 h-4 animate-spin" />
  ) : (
    <Send className="w-4 h-4" />
  )}
</Button>
```

ADDITIONAL FEATURES:
1. Audio player (if room has audio):
   - Show audio controls
   - Source: `/room-audio/${roomId}.mp3`

2. Matchmaking button (VIP3 only):
   - Component: <MatchmakingButton />
   - Only show if canAccessVIP3

CREDIT LIMIT MODAL:
```typescript
<CreditLimitModal 
  open={showCreditLimit}
  onOpenChange={setShowCreditLimit}
/>
```

Component shows when user runs out of credits with upgrade options.
```

---

## 6. MATCHMAKING HUB

### Prompt 6.1: Create Matchmaking Page

```
Create the MatchmakingHub page (src/pages/MatchmakingHub.tsx):

ACCESS CONTROL:
VIP3 only - redirect to "/" if !isVIP3 with toast error

PAGE STRUCTURE:
1. Header with title and description card
2. Generate button
3. Match suggestions grid

HEADER:
```typescript
<div className="flex items-center gap-2 mb-2">
  <Heart className="w-8 h-8 text-primary" />
  <h1 className="text-4xl font-bold">Learning Partner Finder</h1>
</div>
```

DESCRIPTION CARD:
Gradient card: "bg-gradient-to-br from-primary/5 via-background to-secondary/5"

Two sections (English + Vietnamese):
1. English description:
   - H3: "font-semibold text-lg mb-2"
   - Paragraph explaining VIP3 matchmaking feature

2. Vietnamese description:
   - Same structure
   - Vietnamese translation

Full description explains:
- Premium VIP3 feature
- Pairs with learning partners based on interests
- Categories: health, career, wellness, personal growth
- Matching by level and learning style
- Point earning system
- Example use cases
- Algorithm explanation

GENERATE BUTTON:
```typescript
<Button onClick={handleGenerate} className="gap-2">
  <Sparkles className="w-4 h-4" />
  Generate New Matches
</Button>
```

NO MATCHES STATE:
Card with centered content:
- Heart icon (w-16 h-16 text-muted-foreground)
- H3: "No matches yet"
- Description: "Click 'Generate New Matches' to find people who share your interests"

MATCH CARDS:
Grid layout: "grid gap-6"

Each suggestion card:
Header (gradient): "bg-gradient-to-r from-primary/10 to-primary/5"
- User name (CardTitle text-2xl)
- User email (CardDescription)
- Match score badge: "{(score * 100).toFixed(0)}% Match" (variant="secondary" text-lg)

Content sections:
1. Common Interests:
   - H4: "font-semibold mb-2"
   - Badge list: flex-wrap gap-2, variant="outline"

2. Complementary Traits:
   - H4: "font-semibold mb-2"
   - Badge list: variant="secondary"

3. Match Reason:
   - H4: "font-semibold mb-2"
   - Display JSON stringified reason

Action buttons (flex gap-3 pt-4):
1. Accept button:
   - "flex-1 gap-2"
   - Icon: Heart (w-4 h-4)
   - Text: "Accept Match"
   - Calls updateSuggestionStatus(id, 'accepted')

2. Pass button:
   - "flex-1 gap-2"
   - variant="outline"
   - Icon: X (w-4 h-4)
   - Text: "Pass"
   - Calls updateSuggestionStatus(id, 'rejected')

HOOKS:
Use custom useMatchmaking hook:
```typescript
const { 
  suggestions, 
  loading, 
  isVIP3, 
  generateSuggestions, 
  updateSuggestionStatus 
} = useMatchmaking();
```

TOASTS:
- Loading: "Generating personalized matches..."
- Success: "New matches generated!"
- Error: "Failed to generate matches"
- Accept: "Match accepted! You can now connect with this person."
- Reject: "Match declined"

LOADING STATE:
Full screen centered Loader2 spinner while loading
```

---

## 7. MANUAL PAYMENT PAGE

### Prompt 7.1: Create Manual Payment Page

```
Create the ManualPayment page (src/pages/ManualPayment.tsx):

URL PARAMS:
Get from useSearchParams():
- tier: Tier ID
- name: Tier name
- price: Price amount

PAGE STRUCTURE:
1. Back button
2. Page title and tier info
3. Instructions alert
4. Result alert (after submission)
5. Form with username and screenshot upload

BACKGROUND:
"min-h-screen bg-gradient-to-b from-background to-background/80 p-4"

CONTAINER:
"max-w-2xl mx-auto"

BACK BUTTON:
```typescript
<Button variant="ghost" onClick={() => navigate(-1)}>
  <ArrowLeft className="w-4 h-4 mr-2" />
  Back
</Button>
```

TITLE:
H1: "Manual Payment Verification" (text-2xl font-bold)
Subtitle: "{tierName} - ${price}/year" (text-muted-foreground)

INSTRUCTIONS ALERT:
Alert with AlertCircle icon:
```typescript
<strong>Instructions:</strong>
<ol className="list-decimal list-inside mt-2 space-y-1">
  <li>Send payment to our PayPal: <strong>cd12536@gmail.com</strong></li>
  <li>Take a screenshot of the completed transaction</li>
  <li>Enter your username and upload the screenshot below</li>
  <li>Wait for verification (usually instant with OCR, may require admin review)</li>
</ol>
```

RESULT ALERT:
Show after submission with dynamic styling:

Auto-approved (green):
- border-green-500 bg-green-50
- CheckCircle icon (text-green-600)
- Show extracted transaction details

Pending review (yellow):
- border-yellow-500 bg-yellow-50
- AlertCircle icon (text-yellow-600)
- Message: "Submitted for Review"

FORM FIELDS:
1. Username input:
   - Label: "Username"
   - Type: text
   - Placeholder: "Enter your username"
   - Disabled after auto-approval

2. Screenshot upload:
   - Label: "Payment Screenshot"
   - Type: file
   - Accept: "image/*"
   - Validate:
     * File type must be image
     * Max size: 5MB
   - Show selected filename below input

SUBMIT BUTTON:
Full width button with states:
- Normal: "Submit Payment Proof" with Upload icon
- Loading: "Verifying..." with Loader2 spinner
- Disabled: After auto-approval or while uploading

SUBMISSION LOGIC:
1. Validate username and screenshot
2. Get authenticated user
3. Upload screenshot to Supabase storage bucket 'payment-proofs'
   - Path: `{userId}/{timestamp}.{ext}`
4. Get public URL
5. Call 'verify-payment-screenshot' edge function:
   ```typescript
   await supabase.functions.invoke('verify-payment-screenshot', {
     body: {
       imageUrl: publicUrl,
       tierId: tierId,
       username: username.trim(),
       expectedAmount: parseFloat(price || '0')
     }
   });
   ```
6. Handle response:
   - auto_approved: Show success, redirect to "/" after 2s
   - pending: Show submitted for review message

ERROR HANDLING:
- File type validation
- File size validation
- Upload errors
- OCR function errors
- Show descriptive toasts

TOASTS:
- Success: "🎉 Congratulations! You are now in {tierName}"
- Pending: "📋 Submitted for Review - Admin will verify shortly"
- Error: Show specific error message
```

---

## 8. PROMO CODE PAGE

### Prompt 8.1: Create Promo Code Redemption Page

```
Create the PromoCode page (src/pages/PromoCode.tsx):

PAGE STRUCTURE:
1. Back button
2. Promo code input card
3. Redeem button

BACKGROUND:
"min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-4"

CONTAINER:
"container max-w-2xl mx-auto py-8"

BACK BUTTON:
```typescript
<Button variant="ghost" onClick={() => navigate("/")}>
  <ArrowLeft className="h-4 w-4 mr-2" />
  Back to Home
</Button>
```

CARD:
Card with backdrop blur:
"backdrop-blur-sm bg-card/95 border-primary/20"

CARD HEADER:
- Title: "Redeem Promo Code" (text-2xl)
- Description: "Enter your promotional code to unlock additional questions per day"

CARD CONTENT:
Input field:
```typescript
<Input
  placeholder="Enter promo code"
  value={code}
  onChange={(e) => setCode(e.target.value.toUpperCase())}
  className="text-lg"
  disabled={isLoading}
/>
```

Auto-uppercase input value

Redeem button:
```typescript
<Button
  onClick={handleRedeem}
  disabled={isLoading || !code.trim()}
  className="w-full"
  size="lg"
>
  {isLoading ? "Redeeming..." : "Redeem Code"}
</Button>
```

REDEMPTION LOGIC:
1. Check user authentication:
   ```typescript
   const { data: { user } } = await supabase.auth.getUser();
   if (!user) {
     toast.error("Please login first");
     navigate("/auth");
     return;
   }
   ```

2. Validate code (server-side RPC):
   ```typescript
   const { data: validationResult, error } = await supabase
     .rpc("validate_promo_code", { code_input: code.toUpperCase() });
   ```

3. If invalid:
   - Show error toast with reason

4. If valid, redeem:
   ```typescript
   const expiresAt = new Date();
   expiresAt.setFullYear(expiresAt.getFullYear() + 1);
   
   await supabase
     .from("user_promo_redemptions")
     .insert({
       user_id: user.id,
       promo_code_id: result.promo_code_id,
       daily_question_limit: result.daily_question_limit,
       total_question_limit: result.daily_question_limit,
       total_questions_used: 0,
       expires_at: expiresAt.toISOString()
     });
   ```

5. Increment promo code usage count

6. Show success toast (bilingual):
   ```typescript
   toast.success(`Success! You now have ${limit} total questions across all rooms for 1 year! / Thành công! Bạn có ${limit} câu hỏi tổng cộng!`);
   ```

7. Clear code input

ERROR MESSAGES:
- "Please enter a promo code"
- "Please login first"
- "Invalid or expired promo code"
- "Failed to redeem code. Please try again."

STATE:
- code: string
- isLoading: boolean
```

---

## 9. VIP REQUEST PAGES

### Prompt 9.1: Create VIP Request Form Page

```
Create the VIPRequestForm page (src/pages/VIPRequestForm.tsx):

This page allows users to request custom room topics.

PAGE STRUCTURE:
1. Back button
2. Title and description
3. Form with topic request fields
4. Submit button

BACKGROUND:
Dynamic based on user's tier:
- VIP1: 'hsl(var(--page-vip1))'
- VIP2: 'hsl(var(--page-vip2))'
- VIP3: 'hsl(var(--page-vip3))'
- Default: 'hsl(var(--background))'

CONTAINER:
"container mx-auto px-4 py-8 max-w-2xl"

BACK BUTTON:
Navigate to "/rooms" or "/" with ArrowLeft icon

TITLE SECTION:
- H1: "Request Custom Room" (text-3xl font-bold)
- Subtitle: "Tell us what topic you'd like to learn about"
- Bilingual description

FORM FIELDS:
1. Topic Title (English):
   - Label: "Topic Title (English)"
   - Placeholder: "e.g., Advanced Nutrition for Athletes"
   - Required

2. Topic Title (Vietnamese):
   - Label: "Tiêu đề Chủ đề (Tiếng Việt)"
   - Placeholder: "VD: Dinh dưỡng nâng cao cho vận động viên"
   - Required

3. Description:
   - Textarea (min 50 characters)
   - Placeholder: "Describe what you want to learn..."
   - Required

4. Category selection:
   - Select dropdown
   - Options: Health, Wellness, Career, Personal Growth, Relationships, Finance
   - Required

5. Priority level:
   - Radio buttons
   - Options: Normal, High, Urgent
   - Default: Normal

TIER LIMITS:
Check user's tier and show:
- VIP1: "You can request 1 custom topic"
- VIP2: "You can request 2 custom topics"
- VIP3: "You can request 3 custom topics"

Check if user has reached their limit before showing form.

SUBMIT BUTTON:
```typescript
<Button 
  type="submit" 
  className="w-full"
  disabled={isLoading}
>
  {isLoading ? "Submitting..." : "Submit Request"}
</Button>
```

SUBMISSION LOGIC:
1. Validate all fields
2. Check user's remaining request slots
3. Insert into 'vip_room_requests' table:
   ```typescript
   await supabase.from('vip_room_requests').insert({
     user_id: user.id,
     topic_title_en: topicTitleEn,
     topic_title_vi: topicTitleVi,
     description: description,
     category: category,
     priority: priority,
     status: 'pending'
   });
   ```
4. Show success toast
5. Navigate to "/vip-requests"

VALIDATION:
- All required fields must be filled
- Description minimum 50 characters
- Check if user has available request slots
```

### Prompt 9.2: Create VIP Requests List Page

```
Create the VIPRequests page (src/pages/VIPRequests.tsx):

Shows user's submitted custom room requests.

PAGE STRUCTURE:
1. Back button
2. Title and stats
3. Requests list/grid
4. Empty state if no requests

BACKGROUND:
Same as VIPRequestForm (tier-based)

HEADER:
- Back button
- Title: "My Custom Room Requests"
- Subtitle: "Track your submitted topics"

STATS CARD:
Show user's tier and request limits:
- Current tier badge
- Requests used / total allowed
- "Request New Topic" button (if slots available)

REQUESTS GRID:
Grid layout for request cards:
"grid gap-4 md:grid-cols-2"

REQUEST CARD:
Card structure:
```typescript
<Card className="p-4">
  <div className="flex justify-between items-start mb-2">
    <div>
      <h3 className="font-bold text-lg">{request.topic_title_en}</h3>
      <p className="text-sm text-muted-foreground">{request.topic_title_vi}</p>
    </div>
    <Badge variant={statusVariant}>
      {request.status}
    </Badge>
  </div>
  
  <p className="text-sm mb-3">{request.description}</p>
  
  <div className="flex gap-2 text-xs text-muted-foreground">
    <span>Category: {request.category}</span>
    <span>•</span>
    <span>Priority: {request.priority}</span>
  </div>
  
  <div className="text-xs text-muted-foreground mt-2">
    Submitted: {new Date(request.created_at).toLocaleDateString()}
  </div>
</Card>
```

STATUS BADGES:
- pending: yellow/warning
- approved: green/success
- in_progress: blue/info
- completed: green with checkmark
- rejected: red/destructive

EMPTY STATE:
Card with centered content:
- Icon: FileQuestion (large, muted)
- H3: "No requests yet"
- Description: "Request a custom topic to get started"
- Button: "Create Request" → navigate to "/vip-request"

QUERY:
Fetch user's requests:
```typescript
const { data } = await supabase
  .from('vip_room_requests')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

REAL-TIME UPDATES:
Subscribe to changes on user's requests to show status updates in real-time.
```

---

## 10. ADMIN PAGES

### Prompt 10.1: Create Admin Dashboard

```
Create the AdminDashboard page (src/pages/AdminDashboard.tsx):

ACCESS CONTROL:
Admin only - check isAdmin from useUserAccess()

PAGE STRUCTURE:
1. Admin navigation
2. Stats overview cards
3. Quick action buttons
4. Recent activity feed

BACKGROUND:
"min-h-screen" with gradient: "bg-gradient-to-br from-background via-background/95" using admin colors

ADMIN NAVIGATION:
Grid of navigation cards:
"grid gap-4 md:grid-cols-2 lg:grid-cols-3"

Navigation items:
1. VIP Rooms Management:
   - Icon: Sparkles
   - Navigate to "/admin/vip-rooms"

2. Payment Verification:
   - Icon: DollarSign
   - Navigate to "/admin/payments"
   - Show pending count badge

3. Reports & Feedback:
   - Icon: MessageSquare
   - Navigate to "/admin/reports"
   - Show unread count badge

4. Statistics:
   - Icon: BarChart3
   - Navigate to "/admin/stats"

5. Audio Upload:
   - Icon: Upload
   - Navigate to "/admin/audio"

6. All Rooms:
   - Icon: Grid
   - Navigate to "/all-rooms"

STATS CARDS:
Overview metrics:
- Total users
- Active VIP members
- Pending payments
- Pending requests
- Total revenue

Use gradient cards with icons

RECENT ACTIVITY:
List of recent:
- User registrations
- VIP upgrades
- Payment submissions
- Room requests

Each item with timestamp and status

QUICK ACTIONS:
Buttons for common admin tasks:
- Approve all pending payments
- Generate reports
- Export data
- Send notifications
```

### Prompt 10.2: Create Admin Payment Verification

```
Create the AdminPaymentVerification page (src/pages/AdminPaymentVerification.tsx):

ACCESS CONTROL:
Admin only

PAGE STRUCTURE:
1. Filters and search
2. Payments table
3. Action modals

FILTERS:
- Status filter: All, Pending, Auto-approved, Manual-approved, Rejected
- Date range picker
- Search by username/email

PAYMENTS TABLE:
Columns:
1. User info (username, email)
2. Tier requested
3. Amount
4. Screenshot (clickable to view full)
5. Status
6. OCR confidence score
7. Submitted date
8. Actions

TABLE ROW ACTIONS:
For each payment:
- View screenshot (lightbox)
- Approve button (if pending)
- Reject button (if pending)
- View details

APPROVE FLOW:
1. Show confirmation dialog
2. Update user's subscription:
   ```typescript
   await supabase.from('subscriptions').insert({
     user_id: payment.user_id,
     tier_id: payment.tier_id,
     status: 'active',
     expires_at: oneYearFromNow
   });
   ```
3. Update payment status to 'manual_approved'
4. Send notification to user
5. Show success toast

REJECT FLOW:
1. Show confirmation with reason input
2. Update payment status to 'rejected'
3. Add rejection reason
4. Send notification to user

BULK ACTIONS:
- Select multiple pending payments
- Approve all selected
- Export selected to CSV

PAGINATION:
Standard pagination for large payment lists

REAL-TIME UPDATES:
Subscribe to payment_submissions table for new submissions
```

### Prompt 10.3: Create Admin Reports Page

```
Create the AdminReports page (src/pages/AdminReports.tsx):

ACCESS CONTROL:
Admin only

PAGE STRUCTURE:
1. Tabs for different report types
2. Filters
3. Report data display

TAB STRUCTURE:
Three tabs:
1. User Feedback
2. Behavior Analytics
3. System Reports

FEEDBACK TAB:
Display user feedback from rooms:
- Filter by room, priority, status
- Table with feedback details
- Actions: Mark as read, Respond, Archive

Table columns:
- User
- Room
- Message
- Priority
- Status
- Date
- Actions

BEHAVIOR ANALYTICS TAB:
Show user engagement metrics:
- Most active users
- Most popular rooms
- Peak usage times
- Keyword match rates
- AI vs Keyword mode usage

Charts and graphs:
- Use recharts library
- Line charts for trends
- Bar charts for comparisons
- Pie charts for distributions

SYSTEM REPORTS TAB:
Technical metrics:
- Error logs
- API response times
- Database query performance
- Edge function invocations
- Storage usage

ACTIONS:
- Export reports as PDF/CSV
- Schedule automated reports
- Set up alerts for anomalies

FILTERS:
- Date range
- Room categories
- User tiers
- Status/Priority
```

### Prompt 10.4: Create Admin Stats Page

```
Create the AdminStats page (src/pages/AdminStats.tsx):

ACCESS CONTROL:
Admin only

PAGE STRUCTURE:
1. Overview KPIs
2. Charts and graphs
3. Detailed metrics tables

KPI CARDS:
Grid of metric cards:
"grid gap-4 md:grid-cols-2 lg:grid-cols-4"

Metrics:
1. Total Users:
   - Count
   - Growth %
   - Chart trend

2. VIP Members:
   - By tier
   - Conversion rate
   - Revenue

3. Active Rooms:
   - Usage stats
   - Popular topics
   - Completion rates

4. Revenue:
   - Total
   - By tier
   - Growth trend

CHARTS:
1. User Growth Chart:
   - Line chart
   - Daily/Weekly/Monthly toggle
   - Compare with previous period

2. Revenue Chart:
   - Area chart
   - Breakdown by tier
   - Recurring vs one-time

3. Room Usage Chart:
   - Bar chart
   - Top 10 rooms
   - Sort by messages/completions

4. Engagement Chart:
   - Heatmap
   - Time of day analysis
   - Day of week patterns

DETAILED METRICS:
Tables with sortable columns:
- User retention rates
- Room completion rates
- Average session duration
- Messages per user
- Credit usage patterns

EXPORT OPTIONS:
- Export as PDF
- Export as Excel
- Download charts as images

REAL-TIME UPDATES:
WebSocket or polling for live stats updates
```

### Prompt 10.5: Create Admin Audio Upload Page

```
Create the AdminAudioUpload page (src/pages/AdminAudioUpload.tsx):

ACCESS CONTROL:
Admin only

PAGE STRUCTURE:
1. Room selector
2. Audio file upload
3. Upload progress
4. Current audio list

ROOM SELECTOR:
Dropdown to select which room to upload audio for:
- Load all rooms from ALL_ROOMS
- Filter by hasData: true
- Group by tier

UPLOAD SECTION:
Card with upload form:
```typescript
<div className="space-y-4">
  <Label>Select Room</Label>
  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
    {/* Room options */}
  </Select>
  
  <Label>Audio File (.mp3)</Label>
  <Input 
    type="file" 
    accept="audio/mp3"
    onChange={handleFileSelect}
  />
  
  {/* File info */}
  {file && (
    <div className="text-sm text-muted-foreground">
      <p>File: {file.name}</p>
      <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
      <p>Duration: {audioDuration}s</p>
    </div>
  )}
  
  <Button 
    onClick={handleUpload}
    disabled={!file || !selectedRoom || uploading}
  >
    {uploading ? "Uploading..." : "Upload Audio"}
  </Button>
</div>
```

UPLOAD LOGIC:
1. Validate file:
   - Type: audio/mp3
   - Max size: 50MB

2. Upload to Supabase storage:
   ```typescript
   const fileName = `${selectedRoom}.mp3`;
   await supabase.storage
     .from('room-audio')
     .upload(fileName, file, {
       cacheControl: '3600',
       upsert: true
     });
   ```

3. Show progress bar

4. Update database with audio metadata

5. Show success toast

CURRENT AUDIO LIST:
Table showing rooms with audio:
- Room name
- Audio duration
- File size
- Upload date
- Actions (Play preview, Delete, Replace)

AUDIO PREVIEW:
Simple audio player to preview uploaded files
```

---

## 11. SHARED COMPONENTS

### Prompt 11.1: Create Component Files List

```
Create these shared components (brief specs, refer to full implementation in code):

1. PointsDisplay.tsx:
   - Shows user's total points
   - Animated counter
   - Breakdown tooltip

2. CreditsDisplay.tsx:
   - Shows remaining questions
   - Daily/Total limits
   - Warning colors when low

3. RoomProgress.tsx:
   - Topics explored count
   - Streak counter
   - Achievement badges

4. MessageActions.tsx:
   - Copy to clipboard
   - Text-to-speech
   - Share functionality

5. RelatedRooms.tsx:
   - Chips showing related room suggestions
   - Click to navigate

6. WelcomeBack.tsx:
   - Greeting based on time of day
   - Last visit info
   - Streak reminder

7. MatchmakingButton.tsx:
   - Heart icon button
   - VIP3 badge
   - Navigate to matchmaking

8. CreditLimitModal.tsx:
   - Upgrade prompt
   - Tier comparison
   - Navigation to subscribe

9. UsernameSetup.tsx:
   - Modal for first-time users
   - Username input with validation
   - Skip/Save buttons

10. AdminFloatingButton.tsx:
    - Fixed position button
    - Only visible for admins
    - Quick access to admin panel

11. PromoCodeBanner.tsx:
    - Dismissible banner
    - "Have a promo code?" message
    - Navigate to promo page

12. FeedbackNotificationBadge.tsx:
    - Red dot for unread feedback
    - Count bubble
    - Admin only

13. VIPNavigation.tsx:
    - Tabbed navigation for VIP tiers
    - Active tier highlight
    - Locked tiers display

Each component should follow the design system from UI_SPECIFICATION_GUIDE.md.
```

---

## ADDITIONAL PAGES

### Prompt 11.2: Create NotFound Page

```
Create NotFound page (src/pages/NotFound.tsx):

Simple 404 page with:
- Large "404" text
- "Page Not Found" message (bilingual)
- "Go Home" button
- Animated background gradient

Center everything, use primary color scheme.
```

### Prompt 11.3: Create AllRooms Page

```
Create AllRooms page (src/pages/AllRooms.tsx):

Admin-only page showing ALL rooms regardless of tier:
- Combined grid of free + all VIP rooms
- Color-coded by tier
- Status indicators
- Admin actions (Edit, Delete, View Stats)

Similar layout to RoomGrid but includes all rooms in one view.
```

---

## USAGE INSTRUCTIONS

### How to Use These Prompts:

1. **Sequential Implementation**:
   Start with prompt 1.1 (App Router) and proceed in order.

2. **Reference Other Guides**:
   Each prompt assumes you have:
   - UI_SPECIFICATION_GUIDE.md for styling
   - AI_DEVELOPMENT_PROMPT.md for patterns
   - COMPLETE_IMPLEMENTATION_GUIDE.md for context

3. **Component Dependencies**:
   Some prompts reference shared components. Create those first or create placeholder versions.

4. **Backend Integration**:
   All Supabase integration code is included in prompts. Ensure database schema matches.

5. **Testing Each Page**:
   After implementing each page:
   - Test all navigation
   - Test authentication/authorization
   - Test responsive design
   - Test bilingual content
   - Test error states

6. **Iteration**:
   If output doesn't match exactly, use UI_SPECIFICATION_GUIDE.md to correct styling.

---

## FINAL CHECKLIST

After implementing all pages, verify:

- [ ] All routes work correctly
- [ ] Authentication flow complete
- [ ] All VIP tier checks working
- [ ] Bilingual text everywhere
- [ ] Design system colors used (no hardcoded colors)
- [ ] All icons from lucide-react
- [ ] Responsive on all breakpoints
- [ ] Toasts/notifications working
- [ ] Loading states present
- [ ] Error handling implemented
- [ ] Admin pages secured
- [ ] Database operations correct
- [ ] Real-time updates working (where applicable)
- [ ] Audio players functional
- [ ] Payment flow complete
- [ ] Promo code redemption working
- [ ] Matchmaking VIP3 only
- [ ] Points system working
- [ ] Credits tracking functional

---

**END OF PAGE-BY-PAGE PROMPTS**

These prompts provide complete specifications for recreating every page in the Mercy Blade application. Use them in conjunction with the other documentation files for exact replication.
