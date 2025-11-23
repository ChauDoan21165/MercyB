-- Create table for GitHub sync configuration
CREATE TABLE IF NOT EXISTS public.github_sync_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_url text NOT NULL,
  branch text NOT NULL DEFAULT 'main',
  base_path text NOT NULL DEFAULT 'public/data',
  is_enabled boolean NOT NULL DEFAULT true,
  sync_interval_minutes integer NOT NULL DEFAULT 60,
  last_sync_at timestamp with time zone,
  last_sync_status text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create table for sync logs
CREATE TABLE IF NOT EXISTS public.github_sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id uuid REFERENCES public.github_sync_config(id) ON DELETE CASCADE,
  sync_started_at timestamp with time zone NOT NULL DEFAULT now(),
  sync_completed_at timestamp with time zone,
  files_checked integer NOT NULL DEFAULT 0,
  files_downloaded integer NOT NULL DEFAULT 0,
  files_failed integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'running',
  error_message text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.github_sync_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_sync_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for github_sync_config
CREATE POLICY "Admins can manage GitHub sync config"
  ON public.github_sync_config
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for github_sync_logs
CREATE POLICY "Admins can view sync logs"
  ON public.github_sync_logs
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_github_sync_config_updated_at
  BEFORE UPDATE ON public.github_sync_config
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();