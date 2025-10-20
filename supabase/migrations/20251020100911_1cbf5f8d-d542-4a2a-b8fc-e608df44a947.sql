-- Create table for VIP1 room requests
CREATE TABLE public.vip_room_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_name TEXT NOT NULL,
  topic_name_vi TEXT,
  description TEXT NOT NULL,
  urgency TEXT CHECK (urgency IN ('low', 'medium', 'high')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('pending', 'approved', 'in_progress', 'completed', 'rejected')) DEFAULT 'pending',
  admin_notes TEXT,
  room_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create table for room usage analytics
CREATE TABLE public.room_usage_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id TEXT NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  messages_sent INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  completed_room BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vip_room_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_usage_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vip_room_requests
CREATE POLICY "VIP1 users can create their own requests"
ON public.vip_room_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own requests"
ON public.vip_room_requests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests"
ON public.vip_room_requests
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all requests"
ON public.vip_room_requests
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for room_usage_analytics
CREATE POLICY "Users can insert their own analytics"
ON public.room_usage_analytics
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics"
ON public.room_usage_analytics
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own analytics"
ON public.room_usage_analytics
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all analytics"
ON public.room_usage_analytics
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_vip_room_requests_updated_at
BEFORE UPDATE ON public.vip_room_requests
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_vip_room_requests_user_id ON public.vip_room_requests(user_id);
CREATE INDEX idx_vip_room_requests_status ON public.vip_room_requests(status);
CREATE INDEX idx_room_usage_analytics_user_id ON public.room_usage_analytics(user_id);
CREATE INDEX idx_room_usage_analytics_room_id ON public.room_usage_analytics(room_id);