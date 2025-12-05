-- Phase 4.7: Audio Governance Persistence Table
-- Stores pending, approved, and rejected governance reviews

CREATE TABLE IF NOT EXISTS public.audio_governance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id TEXT UNIQUE NOT NULL,
  cycle_id TEXT NOT NULL,
  operation_type TEXT NOT NULL,
  room_id TEXT NOT NULL,
  before_filename TEXT,
  after_filename TEXT,
  confidence NUMERIC NOT NULL DEFAULT 0,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Deduplication: unique constraint on operation signature
  CONSTRAINT unique_operation UNIQUE (room_id, before_filename, operation_type)
);

-- Enable RLS
ALTER TABLE public.audio_governance_reviews ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage governance reviews"
  ON public.audio_governance_reviews
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Public can read (for dashboard display)
CREATE POLICY "Anyone can view governance reviews"
  ON public.audio_governance_reviews
  FOR SELECT
  USING (true);

-- Index for common queries
CREATE INDEX idx_audio_governance_status ON public.audio_governance_reviews(status);
CREATE INDEX idx_audio_governance_room ON public.audio_governance_reviews(room_id);
CREATE INDEX idx_audio_governance_cycle ON public.audio_governance_reviews(cycle_id);

-- Auto-update updated_at
CREATE TRIGGER update_audio_governance_reviews_updated_at
  BEFORE UPDATE ON public.audio_governance_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();