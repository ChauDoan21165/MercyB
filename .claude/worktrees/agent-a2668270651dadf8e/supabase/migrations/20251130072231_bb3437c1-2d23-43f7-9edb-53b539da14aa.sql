-- Create UI health issues table for automated visual/UX error detection
CREATE TABLE public.ui_health_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text,
  path text NOT NULL,
  issue_type text NOT NULL,
  severity text NOT NULL DEFAULT 'warning',
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ui_health_issues ENABLE ROW LEVEL SECURITY;

-- Admins can insert/select/delete
CREATE POLICY "Admins can manage UI health issues"
ON public.ui_health_issues
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_ui_health_issues_created_at ON public.ui_health_issues(created_at DESC);
CREATE INDEX idx_ui_health_issues_room_id ON public.ui_health_issues(room_id);
CREATE INDEX idx_ui_health_issues_severity ON public.ui_health_issues(severity);