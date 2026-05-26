-- Create admin notification preferences table
CREATE TABLE IF NOT EXISTS public.admin_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback_notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(admin_user_id)
);

-- Create admin notifications table to track unread feedback
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback_id UUID NOT NULL REFERENCES public.feedback(id) ON DELETE CASCADE,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(admin_user_id, feedback_id)
);

-- Enable RLS
ALTER TABLE public.admin_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for admin_notification_preferences
CREATE POLICY "Admins can manage their own preferences"
ON public.admin_notification_preferences
FOR ALL
USING (auth.uid() = admin_user_id);

-- RLS policies for admin_notifications
CREATE POLICY "Admins can view their own notifications"
ON public.admin_notifications
FOR SELECT
USING (auth.uid() = admin_user_id);

CREATE POLICY "Admins can update their own notifications"
ON public.admin_notifications
FOR UPDATE
USING (auth.uid() = admin_user_id);

CREATE POLICY "System can insert notifications for admins"
ON public.admin_notifications
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = admin_user_id AND role = 'admin'
));

-- Trigger to update updated_at
CREATE TRIGGER update_admin_notification_preferences_updated_at
BEFORE UPDATE ON public.admin_notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Function to create notifications for all admins when new feedback is submitted
CREATE OR REPLACE FUNCTION public.notify_admins_on_new_feedback()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert notification for each admin who has notifications enabled
  INSERT INTO public.admin_notifications (admin_user_id, feedback_id)
  SELECT ur.user_id, NEW.id
  FROM public.user_roles ur
  LEFT JOIN public.admin_notification_preferences anp ON ur.user_id = anp.admin_user_id
  WHERE ur.role = 'admin'
    AND (anp.feedback_notifications_enabled IS NULL OR anp.feedback_notifications_enabled = true);
  
  RETURN NEW;
END;
$$;

-- Trigger to notify admins when new feedback is created
CREATE TRIGGER notify_admins_on_feedback_insert
AFTER INSERT ON public.feedback
FOR EACH ROW
EXECUTE FUNCTION public.notify_admins_on_new_feedback();