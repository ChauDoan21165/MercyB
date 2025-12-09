-- Email Campaigns table for batch sends
CREATE TABLE public.email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  audience_type TEXT NOT NULL, -- 'vip2', 'vip3', 'all_vip', 'manual'
  manual_emails TEXT[] NULL,
  sent_at TIMESTAMPTZ NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'sending', 'sent', 'failed'
  total_recipients INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT NULL
);

-- Email Events table for tracking all email sends
CREATE TABLE public.email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  campaign_id UUID NULL REFERENCES public.email_campaigns(id) ON DELETE SET NULL,
  user_id UUID NULL,
  email TEXT NOT NULL,
  type TEXT NOT NULL, -- 'welcome_vip', 'vip_expiry_warning', 'campaign_send'
  status TEXT NOT NULL, -- 'sent', 'failed'
  error_message TEXT NULL,
  tier TEXT NULL -- for welcome emails, track which tier
);

-- Indexes for performance
CREATE INDEX idx_email_campaigns_created_by ON public.email_campaigns(created_by);
CREATE INDEX idx_email_campaigns_status ON public.email_campaigns(status);
CREATE INDEX idx_email_campaigns_created_at ON public.email_campaigns(created_at DESC);

CREATE INDEX idx_email_events_campaign_id ON public.email_events(campaign_id);
CREATE INDEX idx_email_events_user_id ON public.email_events(user_id);
CREATE INDEX idx_email_events_type ON public.email_events(type);
CREATE INDEX idx_email_events_created_at ON public.email_events(created_at DESC);

-- Enable RLS
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_campaigns
CREATE POLICY "Admins can view all campaigns"
ON public.email_campaigns FOR SELECT
USING (public.get_admin_level(auth.uid()) >= 9);

CREATE POLICY "Admins can insert campaigns"
ON public.email_campaigns FOR INSERT
WITH CHECK (public.get_admin_level(auth.uid()) >= 9);

CREATE POLICY "Admins can update campaigns"
ON public.email_campaigns FOR UPDATE
USING (public.get_admin_level(auth.uid()) >= 9);

-- RLS Policies for email_events
CREATE POLICY "Admins can view all email events"
ON public.email_events FOR SELECT
USING (public.get_admin_level(auth.uid()) >= 9);

CREATE POLICY "System can insert email events"
ON public.email_events FOR INSERT
WITH CHECK (true);