-- Create table to store historical metrics snapshots
CREATE TABLE IF NOT EXISTS public.metrics_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_rooms INTEGER NOT NULL DEFAULT 0,
  total_users INTEGER NOT NULL DEFAULT 0,
  concurrent_users INTEGER NOT NULL DEFAULT 0,
  total_entries INTEGER NOT NULL DEFAULT 0,
  total_tts_calls INTEGER NOT NULL DEFAULT 0,
  total_storage_objects INTEGER NOT NULL DEFAULT 0,
  moderation_queue_length INTEGER NOT NULL DEFAULT 0,
  active_subscriptions INTEGER NOT NULL DEFAULT 0,
  rooms_by_tier JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on timestamp for efficient querying
CREATE INDEX IF NOT EXISTS idx_metrics_history_timestamp ON public.metrics_history(timestamp DESC);

-- Enable RLS
ALTER TABLE public.metrics_history ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view metrics history
CREATE POLICY "Admins can view metrics history"
  ON public.metrics_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Policy: System can insert metrics snapshots
CREATE POLICY "System can insert metrics snapshots"
  ON public.metrics_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);