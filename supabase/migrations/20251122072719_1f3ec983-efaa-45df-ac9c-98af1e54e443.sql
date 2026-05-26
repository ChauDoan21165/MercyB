-- Create admin notification preferences table
CREATE TABLE IF NOT EXISTS public.admin_notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL UNIQUE,
  sound_enabled BOOLEAN DEFAULT true,
  alert_tone TEXT DEFAULT 'alert',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_notification_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view their own settings
CREATE POLICY "Admins can view own notification settings"
ON public.admin_notification_settings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
    AND user_roles.user_id = admin_user_id
  )
);

-- Policy: Admins can insert their own settings
CREATE POLICY "Admins can insert own notification settings"
ON public.admin_notification_settings
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
    AND user_roles.user_id = admin_user_id
  )
);

-- Policy: Admins can update their own settings
CREATE POLICY "Admins can update own notification settings"
ON public.admin_notification_settings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
    AND user_roles.user_id = admin_user_id
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_admin_notification_settings_updated_at
BEFORE UPDATE ON public.admin_notification_settings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();