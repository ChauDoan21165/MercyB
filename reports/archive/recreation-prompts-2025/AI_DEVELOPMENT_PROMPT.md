# AI Development Prompt for Mercy Mind Link Application

## Overview
Build a React + TypeScript web application for mental health and wellness learning rooms with VIP tiers, bilingual support (English/Vietnamese), and Supabase backend integration.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with semantic tokens, shadcn/ui components
- **Backend**: Supabase (Lovable Cloud)
- **Routing**: React Router v6
- **State Management**: React Query (@tanstack/react-query)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Notifications**: Sonner toasts

## Design System Principles

### Color System (CRITICAL)
**ALWAYS use HSL colors with semantic tokens from index.css:**
```css
--primary: [hsl values]
--secondary: [hsl values]
--accent: [hsl values]
--background: [hsl values]
--foreground: [hsl values]
```

**NEVER use direct colors like:**
- ❌ `text-white`, `bg-white`, `text-black`, `bg-black`
- ❌ `bg-blue-500`, `text-red-600`

**ALWAYS use semantic tokens:**
- ✅ `bg-primary`, `text-foreground`, `bg-background`
- ✅ `border-border`, `text-muted-foreground`

### Typography & Spacing
- Headings: `text-4xl font-bold` for h1, `text-2xl font-semibold` for h2
- Body text: `text-base`, `text-sm` for secondary
- Spacing: `p-6`, `mb-4`, `gap-4` (consistent 4-unit spacing)
- Responsive: Always use responsive classes (`md:`, `lg:`)

### Layout Patterns
```tsx
// Standard page container
<div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
  <div className="container mx-auto px-4 py-8">
    {/* Navigation */}
    <div className="flex items-center gap-4 mb-6">
      <Button variant="outline" onClick={() => navigate(-1)}>
        <ChevronLeft /> Back / Quay lại
      </Button>
    </div>
    
    {/* Content */}
    <Card className="backdrop-blur-sm bg-card/95">
      {/* Page content */}
    </Card>
  </div>
</div>
```

## Bilingual Support (EN/VI)

### Display Pattern
Always show English first, followed by Vietnamese with `/` separator:
```tsx
<Button>Submit / Gửi</Button>
<p>Welcome back! / Chào mừng trở lại!</p>
<AlertTitle>Success / Thành công</AlertTitle>
```

### Toast Messages
```tsx
toast.success("Payment successful! / Thanh toán thành công!");
toast.error("Access denied / Không có quyền truy cập");
```

### Form Labels & Placeholders
```tsx
<Label>Username / Tên người dùng</Label>
<Input placeholder="Enter your name / Nhập tên của bạn" />
```

## Authentication & Authorization

### User Access Hook Pattern
```tsx
import { useUserAccess } from '@/hooks/useUserAccess';

const { isAdmin, tier, canAccessVIP1, canAccessVIP2, canAccessVIP3, loading } = useUserAccess();
```

### Tier-Based Access Control
```tsx
// Check before navigation
const handleRoomClick = (room) => {
  if (!isAuthenticated) {
    toast.error("Please login / Vui lòng đăng nhập");
    navigate('/auth');
    return;
  }
  
  if (room.tier === 'vip1' && !canAccessVIP1) {
    toast.error("VIP1 required / Cần VIP1");
    return;
  }
  
  navigate(`/chat/${room.id}`);
};
```

### Auth Flow
1. Check authentication: `supabase.auth.getUser()`
2. Check subscription tier: Query `user_subscriptions` table
3. Protect routes with conditional rendering
4. Redirect to `/auth` for login/signup

## Page Structure Patterns

### Admin Pages
```tsx
const AdminPage = () => {
  const { isAdmin, loading } = useUserAccess();
  
  if (loading) return <div>Loading...</div>;
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      {/* Admin content */}
    </div>
  );
};
```

### Data Fetching Pattern
```tsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('user_id', user.id);
      
    if (error) throw error;
    setData(data || []);
  } catch (error) {
    console.error('Error:', error);
    toast.error("Failed to load / Tải thất bại");
  } finally {
    setLoading(false);
  }
};
```

### Grid Layout for Cards
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle>{item.title_en} / {item.title_vi}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Card content */}
      </CardContent>
    </Card>
  ))}
</div>
```

## Common UI Patterns

### Status Badges
```tsx
<Badge variant={status === 'active' ? 'default' : 'secondary'}>
  {status === 'active' ? 'Active / Hoạt động' : 'Inactive / Không hoạt động'}
</Badge>
```

### Loading States
```tsx
{loading ? (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin">Loading...</div>
  </div>
) : (
  // Content
)}
```

### Empty States
```tsx
{data.length === 0 ? (
  <Alert>
    <AlertDescription>
      No data found / Không có dữ liệu
    </AlertDescription>
  </Alert>
) : (
  // Data display
)}
```

### Dialog/Modal Pattern
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title / Tiêu đề</DialogTitle>
      <DialogDescription>
        Description / Mô tả
      </DialogDescription>
    </DialogHeader>
    {/* Form or content */}
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel / Hủy
      </Button>
      <Button onClick={handleSubmit}>
        Submit / Gửi
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Navigation Patterns

### Back Button (Always include)
```tsx
<Button 
  variant="outline" 
  onClick={() => navigate(-1)}
  className="mb-4"
>
  <ChevronLeft className="mr-2 h-4 w-4" />
  Back / Quay lại
</Button>
```

### Navigation Links
```tsx
<Button onClick={() => navigate('/path')}>
  Go to Page / Đi tới trang
</Button>
```

## Form Handling

### Standard Form Pattern
```tsx
const [formData, setFormData] = useState({
  field1: '',
  field2: ''
});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { error } = await supabase
      .from('table_name')
      .insert({
        user_id: user.id,
        ...formData
      });
      
    if (error) throw error;
    
    toast.success("Saved successfully / Lưu thành công!");
    navigate('/success-page');
  } catch (error) {
    console.error('Error:', error);
    toast.error("Failed to save / Lưu thất bại");
  }
};
```

### File Upload Pattern
```tsx
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  // Validate file type
  if (!file.type.includes('image')) {
    toast.error("Please upload an image / Vui lòng tải lên hình ảnh");
    return;
  }
  
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error("File too large / File quá lớn");
    return;
  }
  
  setSelectedFile(file);
};

// Upload to Supabase Storage
const uploadFile = async () => {
  const filePath = `${user.id}/${Date.now()}_${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('bucket-name')
    .upload(filePath, file);
    
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('bucket-name')
    .getPublicUrl(filePath);
    
  return publicUrl;
};
```

## Payment Flow Pattern

### Tier Selection
```tsx
<div className="grid md:grid-cols-3 gap-6">
  {tiers.map(tier => (
    <Card key={tier.id} className="relative hover:shadow-xl transition-all">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          {tier.name}
        </CardTitle>
        <p className="text-center text-3xl font-bold text-primary">
          ${tier.price_monthly}/month
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tier.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => handleSelectTier(tier.id)}
        >
          Choose Plan / Chọn gói
        </Button>
      </CardFooter>
    </Card>
  ))}
</div>
```

### Success Message Pattern
```tsx
toast.success(`🎉 Congratulations! You are now in ${tierName}. Enjoy your experience! / Chúc mừng! Bạn đã là ${tierName}. Tận hưởng trải nghiệm!`);
```

## Room/Content Display Pattern

### Room Card
```tsx
<Card 
  className="cursor-pointer hover:shadow-lg transition-all group"
  onClick={() => handleRoomClick(room)}
>
  <CardHeader>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <CardTitle className="text-xl mb-2">
          {room.title_en}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {room.title_vi}
        </p>
      </div>
      {room.tier !== 'free' && (
        <Badge variant="secondary">{room.tier.toUpperCase()}</Badge>
      )}
    </div>
  </CardHeader>
  <CardContent>
    <div className="flex items-center gap-2 text-sm">
      {canAccess ? (
        <>
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <span>Ready / Sẵn sàng</span>
        </>
      ) : (
        <>
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span>Locked / Khóa</span>
        </>
      )}
    </div>
  </CardContent>
</Card>
```

## Table Display Pattern

### Data Table with Actions
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name / Tên</TableHead>
      <TableHead>Status / Trạng thái</TableHead>
      <TableHead>Actions / Thao tác</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>
          <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
            {item.status}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
              Edit / Sửa
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(item)}>
              Delete / Xóa
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## Analytics & Tracking

### Points System
```tsx
import { usePoints } from '@/hooks/usePoints';

const { totalPoints, awardPoints } = usePoints();

// Award points for actions
await awardPoints(5, 'message_sent', 'Sent a message', roomId);
await awardPoints(50, 'room_completed', 'Completed room', roomId);
```

### Room Analytics
```tsx
import { useRoomAnalytics } from '@/hooks/useRoomAnalytics';

const { trackMessage, markCompleted } = useRoomAnalytics(roomId);

// Track user interactions
await trackMessage();
await markCompleted();
```

## Critical Rules

1. **ALWAYS** use semantic color tokens, NEVER direct colors
2. **ALWAYS** show bilingual text (EN / VI)
3. **ALWAYS** check authentication before protected actions
4. **ALWAYS** include loading states
5. **ALWAYS** handle errors with toasts
6. **ALWAYS** use responsive design
7. **ALWAYS** include back navigation
8. **ALWAYS** validate user input
9. **ALWAYS** use proper TypeScript types
10. **ALWAYS** follow the card-based layout pattern

## Component Imports Template
```tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserAccess } from '@/hooks/useUserAccess';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ChevronLeft, CheckCircle2, Lock } from 'lucide-react';
```

## Example Complete Page Structure
```tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserAccess } from '@/hooks/useUserAccess';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';

const ExamplePage = () => {
  const navigate = useNavigate();
  const { tier, loading: accessLoading } = useUserAccess();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('table_name')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setData(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load data / Tải dữ liệu thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (loading || accessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back / Quay lại
        </Button>

        <Card className="backdrop-blur-sm bg-card/95">
          <CardHeader>
            <CardTitle className="text-4xl text-center">
              Page Title / Tiêu đề trang
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Page content */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamplePage;
```

Follow these patterns consistently to create pages with similar layout, logic, and functionality throughout the application.
